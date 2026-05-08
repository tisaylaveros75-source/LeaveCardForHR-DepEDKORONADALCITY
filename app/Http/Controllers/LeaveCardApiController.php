<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Helpers\LeaveHelper;
use Exception;

class LeaveCardApiController extends Controller
{
    // ── POST /api/login ─────────────────────────────────────────
    public function login(Request $request): JsonResponse
    {
        try {
            $id       = strtolower(trim($request->input('id', '')));
            $password = $request->input('password', '');

            if (!$id || !$password) {
                return response()->json(['ok' => false, 'error' => 'Please enter your email and password.'], 401);
            }

            $row = DB::table('admin_config')->whereRaw('LOWER(login_id) = ?', [$id])->first();
            if ($row && $row->password === $password) {
                $request->session()->put('lms_role',     $row->role);
                $request->session()->put('lms_name',     $row->name);
                $request->session()->put('lms_login_id', $row->login_id);
                if ($row->role === 'school_admin') {
                    $request->session()->put('lms_db_id', $row->id);
                }
                return response()->json([
                    'ok'       => true,
                    'role'     => $row->role,
                    'name'     => $row->name,
                    'login_id' => $row->login_id,
                    'db_id'    => $row->id,
                ]);
            }

            $emp = DB::table('personnel')->whereRaw('LOWER(email) = ?', [$id])->first();
            if ($emp && $emp->password === $password) {
                if (($emp->account_status ?? 'active') === 'inactive') {
                    return response()->json(['ok' => false, 'error' => 'Your account is inactive. Please contact the administrator.'], 403);
                }
                $request->session()->put('lms_role',        'employee');
                $request->session()->put('lms_name',        trim("{$emp->given} {$emp->surname}"));
                $request->session()->put('lms_employee_id', $emp->employee_id);
                return response()->json([
                    'ok'             => true,
                    'role'           => 'employee',
                    'employee_id'    => $emp->employee_id,
                    'name'           => trim("{$emp->given} {$emp->surname}"),
                    'status'         => $emp->status,
                    'account_status' => $emp->account_status ?? 'active',
                ]);
            }

            return response()->json(['ok' => false, 'error' => 'Incorrect email or password. Please try again.'], 401);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── GET /api/session_check ───────────────────────────────────
    public function sessionCheck(Request $request): JsonResponse
    {
        try {
            if (!$request->session()->has('lms_role')) {
                return response()->json(['ok' => false]);
            }
            $role = $request->session()->get('lms_role');
            $res  = [
                'ok'       => true,
                'role'     => $role,
                'name'     => $request->session()->get('lms_name', ''),
                'login_id' => $request->session()->get('lms_login_id', ''),
            ];
            if ($role === 'employee') {
                $res['employee_id'] = $request->session()->get('lms_employee_id', '');
            }
            if ($role === 'school_admin') {
                $res['db_id'] = $request->session()->get('lms_db_id', 0);
            }
            return response()->json($res);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── POST /api/logout ─────────────────────────────────────────
    public function logout(Request $request): JsonResponse
    {
        try {
            $request->session()->flush();
            return response()->json(['ok' => true]);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── GET /api/get_personnel ──────────────────────────────────
    public function getPersonnel(Request $request): JsonResponse
    {
        try {
            $role = $request->session()->get('lms_role', '');

            $page   = max(1, (int)$request->input('page', 1));
            $limit  = min(200, (int)$request->input('limit', 100));
            $offset = ($page - 1) * $limit;

            $saId  = $request->session()->get('lms_db_id', 0);
            $query = DB::table('personnel');
            if ($role === 'school_admin' && $saId) {
                $query->where('assigned_sa_id', $saId);
            }
            $total = $query->count();
            $rows  = $query->orderBy('surname')
                ->orderBy('given')
                ->limit($limit)
                ->offset($offset)
                ->get()
                ->toArray();

            $updatedIds = $this->batchComputeUpdatedIds(
                array_map(fn($r) => (array)$r, $rows)
            );

            $currentYear = (int)now()->format('Y');
            $forceAppliedIds = DB::table('leave_records')
                ->where('is_conversion', 0)
                ->whereRaw("(LOWER(action) LIKE '%force%' OR LOWER(action) LIKE '%mandatory%')")
                ->whereRaw("LOWER(action) NOT LIKE '%disapproved%'")
                ->whereYear('created_at', $currentYear)
                ->distinct()
                ->pluck('employee_id')
                ->toArray();

            $showPassword = in_array($role, ['admin', 'encoder', 'school_admin']);

            $data = array_map(function ($r) use ($updatedIds, $showPassword, $forceAppliedIds) {
                $arr = (array)$r;
                $emp = LeaveHelper::personnelRowToJs($arr);
                $emp['records']             = [];
                $emp['card_status_updated'] = in_array($arr['employee_id'], $updatedIds);
                $emp['force_leave_applied'] = in_array($arr['employee_id'], $forceAppliedIds);
                $emp['password'] = $showPassword ? ($arr['password'] ?? '') : '';
                return $emp;
            }, $rows);

            return response()->json(['ok' => true, 'data' => $data, 'total' => $total, 'page' => $page, 'limit' => $limit])
                ->header('Cache-Control', 'no-store, no-cache, must-revalidate');
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── GET /api/get_records ────────────────────────────────────
    public function getRecords(Request $request): JsonResponse
    {
        try {
            $empId = $request->input('employee_id');
            if (!$empId) return response()->json(['ok' => false, 'error' => 'employee_id required'], 400);

            $rows = DB::table('leave_records')
                ->where('employee_id', $empId)
                ->orderBy('sort_order')
                ->orderBy('record_id')
                ->get()
                ->toArray();

            $records = array_map(fn($r) => LeaveHelper::rowToRecord((array)$r), $rows);
            return response()->json(['ok' => true, 'records' => $records]);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── GET /api/get_admin_cfg ──────────────────────────────────
    public function getAdminCfg(Request $request): JsonResponse
    {
        try {
            $role     = $request->input('role', 'admin');
            $accounts = DB::table('admin_config')
                ->where('role', $role)
                ->orderBy('id')
                ->get(['id', 'name', 'login_id', 'password', 'role'])
                ->toArray();
            return response()->json(['ok' => true, 'accounts' => $accounts])
                ->header('Cache-Control', 'no-store, no-cache, must-revalidate');
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── GET /api/get_school_admins ──────────────────────────────
    public function getSchoolAdmins(): JsonResponse
    {
        try {
            $rows = DB::table('admin_config')
                ->where('role', 'school_admin')
                ->orderBy('name')
                ->get(['id', 'login_id', 'name', 'password'])
                ->toArray();
            return response()->json(['ok' => true, 'school_admins' => $rows]);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── POST /api/save_record ───────────────────────────────────
    public function saveRecord(Request $request): JsonResponse
    {
        try {
            $empId  = $request->input('employee_id');
            $record = $request->input('record', []);

            $emp = DB::table('personnel')->where('employee_id', $empId)->first();
            if (!$emp) return response()->json(['ok' => false, 'error' => 'Employee not found.'], 404);

            $action    = strtolower($record['action'] ?? '');
            $isAccrual = str_contains($action, 'accrual') || str_contains($action, 'service credit');
            $empCat    = strtolower($emp->status ?? '');
            $isNTorTR  = in_array($empCat, ['non-teaching', 'teaching related']);
            $isInactive = $emp->account_status === 'inactive';

            if ($isAccrual && $isNTorTR && $isInactive) {
                return response()->json(['ok' => false, 'skipped' => true, 'error' => "Skipped: employee {$empId} is inactive."]);
            }

            $maxSort   = DB::table('leave_records')->where('employee_id', $empId)->max('sort_order') ?? 0;
            $sortOrder = $maxSort + 1;

            $row      = LeaveHelper::recordToRow($record, $empId, $sortOrder);
            $recordId = DB::table('leave_records')->insertGetId($row);

            DB::table('personnel')->where('employee_id', $empId)
                ->update(['last_edited_at' => now()]);

            $this->resortRecords($empId);
            $this->recomputeAndSaveBalances($empId, $emp->status ?? 'Teaching');

            return response()->json(['ok' => true, 'record_id' => $recordId]);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── POST /api/update_record ─────────────────────────────────
    public function updateRecord(Request $request): JsonResponse
    {
        try {
            $empId    = $request->input('employee_id');
            $recordId = $request->input('record_id');
            $record   = $request->input('record', []);

            $sortRow   = DB::table('leave_records')->where('record_id', $recordId)->first();
            $sortOrder = (int)($sortRow->sort_order ?? 0);

            $row = LeaveHelper::recordToRow($record, $empId, $sortOrder);
            unset($row['employee_id']);
            unset($row['created_at']);

            DB::table('leave_records')->where('record_id', $recordId)->update($row);
            DB::table('personnel')->where('employee_id', $empId)->update(['last_edited_at' => now()]);

            $emp = DB::table('personnel')->where('employee_id', $empId)->first();

            $this->resortRecords($empId);
            $this->recomputeAndSaveBalances($empId, $emp->status ?? 'Teaching');

            return response()->json(['ok' => true]);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── POST /api/delete_record ─────────────────────────────────
    public function deleteRecord(Request $request): JsonResponse
    {
        try {
            $recordId = $request->input('record_id');
            $empId    = $request->input('employee_id');

            $row = DB::table('leave_records')
                ->where('record_id', $recordId)
                ->where('employee_id', $empId)
                ->first();
            if (!$row) return response()->json(['ok' => false, 'error' => 'Record not found.'], 404);
            if ($row->is_conversion) return response()->json(['ok' => false, 'error' => 'Cannot delete conversion markers directly.'], 400);

            DB::table('leave_records')->where('record_id', $recordId)->delete();
            DB::table('personnel')->where('employee_id', $empId)->update(['last_edited_at' => now()]);

            $emp = DB::table('personnel')->where('employee_id', $empId)->first();
            if ($emp) {
                $this->recomputeAndSaveBalances($empId, $emp->status ?? 'Teaching');
            }

            return response()->json(['ok' => true]);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── POST /api/delete_era ────────────────────────────────────
    public function deleteEra(Request $request): JsonResponse
    {
        try {
            $recordId = $request->input('record_id');
            $empId    = $request->input('employee_id');

            $row = DB::table('leave_records')
                ->where('record_id', $recordId)
                ->where('employee_id', $empId)
                ->first();
            if (!$row) return response()->json(['ok' => false, 'error' => 'Record not found.'], 404);
            if (!$row->is_conversion) return response()->json(['ok' => false, 'error' => 'Not a conversion marker.'], 400);

            DB::table('leave_records')->where('record_id', $recordId)->delete();
            return response()->json(['ok' => true]);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── POST /api/insert_record_at ──────────────────────────────
    public function insertRecordAt(Request $request): JsonResponse
    {
        try {
            $empId          = $request->input('employee_id');
            $record         = $request->input('record', []);
            $afterSortOrder = (int)$request->input('after_sort_order', 0);

            DB::table('leave_records')
                ->where('employee_id', $empId)
                ->where('sort_order', '>', $afterSortOrder)
                ->increment('sort_order');

            $newSortOrder = $afterSortOrder + 1;
            $row          = LeaveHelper::recordToRow($record, $empId, $newSortOrder);
            $recordId     = DB::table('leave_records')->insertGetId($row);

            DB::table('personnel')->where('employee_id', $empId)->update(['last_edited_at' => now()]);

            $emp = DB::table('personnel')->where('employee_id', $empId)->first();
            if ($emp) $this->recomputeAndSaveBalances($empId, $emp->status ?? 'Teaching');

            return response()->json(['ok' => true, 'record_id' => $recordId, 'sort_order' => $newSortOrder]);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── POST /api/reorder_records ───────────────────────────────
    public function reorderRecords(Request $request): JsonResponse
    {
        try {
            $empId     = $request->input('employee_id');
            $recordIds = $request->input('record_ids', []);

            foreach ($recordIds as $i => $rid) {
                DB::table('leave_records')
                    ->where('record_id', $rid)
                    ->where('employee_id', $empId)
                    ->update(['sort_order' => $i]);
            }
            return response()->json(['ok' => true]);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── POST /api/save_row_balance ──────────────────────────────
    public function saveRowBalance(Request $request): JsonResponse
    {
        try {
            $b = $request->all();
            DB::table('leave_records')->where('record_id', $b['record_id'])->update([
                'setA_earned'  => $b['setA_earned'],
                'setA_abs_wp'  => $b['setA_abs_wp'],
                'setA_balance' => $b['setA_balance'],
                'setA_wop'     => $b['setA_wop'],
                'setB_earned'  => $b['setB_earned'],
                'setB_abs_wp'  => $b['setB_abs_wp'],
                'setB_balance' => $b['setB_balance'],
                'setB_wop'     => $b['setB_wop'],
            ]);
            return response()->json(['ok' => true]);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── POST /api/save_employee ─────────────────────────────────
    public function saveEmployee(Request $request): JsonResponse
    {
        try {
            $p  = $request->all();
            $id = trim($p['id'] ?? '');

            $idErr = LeaveHelper::validateEmployeeId($id);
            if ($idErr) return response()->json(['ok' => false, 'error' => $idErr], 400);

            $email    = strtolower(trim($p['email'] ?? ''));
            $emailErr = LeaveHelper::validateDepedEmail($email);
            if ($emailErr) return response()->json(['ok' => false, 'error' => $emailErr], 400);

            $required = [
                'surname' => 'Surname', 'given' => 'Given name', 'sex' => 'Sex',
                'status'  => 'Category', 'dob'   => 'Date of Birth',
                'addr'    => 'Present Address', 'pos' => 'Position / Designation',
                'school'  => 'School / Office Assignment',
            ];
            foreach ($required as $field => $label) {
                if (!trim($p[$field] ?? ''))
                    return response()->json(['ok' => false, 'error' => "{$label} is required."], 400);
            }

            $originalId = trim($p['originalId'] ?? '') ?: $id;

            $dupEmail = DB::table('personnel')
                ->whereRaw('LOWER(email) = ?', [$email])
                ->where('employee_id', '!=', $originalId)
                ->exists();
            if ($dupEmail)
                return response()->json(['ok' => false, 'error' => "Email \"{$email}\" is already registered to another employee."], 400);

            $existing = DB::table('personnel')->where('employee_id', $originalId)->first();
            $isNew    = !$existing;

            $pw = $p['password'] ?? '';
            if (!$isNew && !$pw) {
                $cur = DB::table('personnel')->where('employee_id', $originalId)->value('password');
                $pw  = $cur ?? '';
            }
            if ($isNew && !$pw)
                return response()->json(['ok' => false, 'error' => 'Password is required for new employees.'], 400);

            $data = [
                'employee_id'    => $id,
                'email'          => $email,
                'password'       => $pw,
                'surname'        => $p['surname']  ?? '',
                'given'          => $p['given']    ?? '',
                'suffix'         => $p['suffix']   ?? '',
                'maternal'       => $p['maternal'] ?? '',
                'sex'            => $p['sex']      ?? '',
                'civil'          => $p['civil']    ?? '',
                'dob'            => LeaveHelper::normaliseDate($p['dob']   ?? ''),
                'pob'            => $p['pob']      ?? '',
                'addr'           => $p['addr']     ?? '',
                'spouse'         => $p['spouse']   ?? '',
                'edu'            => $p['edu']      ?? '',
                'elig'           => $p['elig']     ?? '',
                'rating'         => $p['rating']   ?? '',
                'tin'            => $p['tin']      ?? '',
                'pexam'          => $p['pexam']    ?? '',
                'dexam'          => LeaveHelper::normaliseDate($p['dexam'] ?? ''),
                'appt'           => LeaveHelper::normaliseDate($p['appt']  ?? ''),
                'status'         => $p['status']   ?? 'Teaching',
                'account_status' => in_array($p['account_status'] ?? '', ['active', 'inactive'])
                        ? $p['account_status'] : 'active',
                'assigned_sa_id' => isset($p['assigned_sa_id']) ? (int)$p['assigned_sa_id'] : null,
                'pos'            => $p['pos']    ?? '',
                'school'         => $p['school'] ?? '',
                'last_edited_at' => now(),
                'updated_at'     => now(),
            ];

            $eraCreated = false;
            $oldStatus  = '';
            $newStatus  = $data['status'];

            if (!$isNew) {
                $oldStatus = $existing->status ?? '';
                DB::table('personnel')->where('employee_id', $originalId)->update($data);

                if ($oldStatus !== '' && strtolower($oldStatus) !== strtolower($newStatus)) {
                    $maxSort = DB::table('leave_records')
                        ->where('employee_id', $id)
                        ->max('sort_order') ?? 0;

                    $lastRecord = DB::table('leave_records')
                        ->where('employee_id', $id)
                        ->where('is_conversion', 0)
                        ->orderByDesc('sort_order')
                        ->orderByDesc('record_id')
                        ->first();

                    $fwdBV = $lastRecord ? (float)($lastRecord->setA_balance ?? 0) : 0;
                    $fwdBS = $lastRecord ? (float)($lastRecord->setB_balance ?? 0) : 0;

                    DB::table('leave_records')->insert([
                        'employee_id'     => $id,
                        'sort_order'      => $maxSort + 1,
                        'is_conversion'   => 1,
                        'from_status'     => $oldStatus,
                        'to_status'       => $newStatus,
                        'conversion_date' => now()->toDateString(),
                        'setA_balance'    => $fwdBV,
                        'setB_balance'    => $fwdBS,
                        'so'              => '',
                        'prd'             => '',
                        'from_date'       => null,
                        'to_date'         => null,
                        'fromPeriod'      => 'WD',
                        'toPeriod'        => 'WD',
                        'spec'            => '',
                        'action'          => '',
                        'force_amount'    => 0,
                        'setA_earned'     => 0,
                        'setA_abs_wp'     => 0,
                        'setA_wop'        => 0,
                        'setB_earned'     => 0,
                        'setB_abs_wp'     => 0,
                        'setB_wop'        => 0,
                        'mon_v'           => 0,
                        'mon_s'           => 0,
                        'mon_dv'          => 0,
                        'mon_ds'          => 0,
                        'tr_v'            => 0,
                        'tr_s'            => 0,
                        'created_at'      => now(),
                        'updated_at'      => now(),
                    ]);
                    $eraCreated = true;
                }
            } else {
                $data['created_at'] = now();
                DB::table('personnel')->insert($data);

                if (!empty($p['records']) && is_array($p['records'])) {
                    DB::table('leave_records')->where('employee_id', $originalId)->delete();
                    foreach ($p['records'] as $i => $rec) {
                        $row = LeaveHelper::recordToRow($rec, $id, $i);
                        DB::table('leave_records')->insert($row);
                    }
                }
            }

            return response()->json([
                'ok'          => true,
                'employee_id' => $id,
                'era_created' => $eraCreated,
                'old_status'  => $oldStatus,
                'new_status'  => $newStatus,
            ]);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── POST /api/save_admin ────────────────────────────────────
    public function saveAdmin(Request $request): JsonResponse
    {
        try {
            $p         = $request->all();
            $role      = $p['role'] ?? 'admin';
            $accountId = (int)($p['account_id'] ?? 0);
            $isDelete  = !empty($p['_delete']);

            if ($isDelete) {
                if (!$accountId) return response()->json(['ok' => false, 'error' => 'account_id required for delete.'], 400);
                DB::table('admin_config')->where('id', $accountId)->where('role', $role)->delete();
                return response()->json(['ok' => true]);
            }

            $name    = trim($p['name']     ?? '');
            $loginId = strtolower(trim($p['login_id'] ?? ''));
            $pw      = $p['password'] ?? '';

            if (!$name || !$loginId) return response()->json(['ok' => false, 'error' => 'Name and login ID are required.'], 400);
            if (!str_ends_with($loginId, '@deped.gov.ph')) return response()->json(['ok' => false, 'error' => 'Login ID must use @deped.gov.ph domain.'], 400);

            if ($accountId > 0) {
                $row = DB::table('admin_config')->where('id', $accountId)->where('role', $role)->first();
                if (!$row) return response()->json(['ok' => false, 'error' => 'Account not found.'], 404);
                $finalPw = $pw !== '' ? $pw : $row->password;
                DB::table('admin_config')->where('id', $accountId)->update(['name' => $name, 'login_id' => $loginId, 'password' => $finalPw]);
            } else {
                if (!$pw) return response()->json(['ok' => false, 'error' => 'Password is required for new accounts.'], 400);
                DB::table('admin_config')->insert(['login_id' => $loginId, 'password' => $pw, 'name' => $name, 'role' => $role]);
            }
            return response()->json(['ok' => true]);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── POST /api/save_school_admin ─────────────────────────────
    public function saveSchoolAdmin(Request $request): JsonResponse
    {
        try {
            $p       = $request->all();
            $saId    = (int)($p['sa_id']    ?? 0);
            $name    = trim($p['name']       ?? '');
            $loginId = strtolower(trim($p['login_id'] ?? ''));
            $pw      = $p['password'] ?? '';

            if (!$name)    return response()->json(['ok' => false, 'error' => 'Display name is required.'], 400);
            if (!$loginId) return response()->json(['ok' => false, 'error' => 'Login email is required.'], 400);
            if (!str_ends_with($loginId, '@deped.gov.ph')) return response()->json(['ok' => false, 'error' => 'Login ID must use @deped.gov.ph domain.'], 400);

            $dup = DB::table('admin_config')->whereRaw('LOWER(login_id) = ?', [$loginId])->where('id', '!=', $saId)->exists();
            if ($dup) return response()->json(['ok' => false, 'error' => 'That email is already in use by another account.'], 400);

            $finalId = $saId;
            if ($saId > 0) {
                $row = DB::table('admin_config')->where('id', $saId)->where('role', 'school_admin')->first();
                if (!$row) return response()->json(['ok' => false, 'error' => 'School Admin account not found.'], 404);
                $finalPw = $pw !== '' ? $pw : $row->password;
                DB::table('admin_config')->where('id', $saId)->update(['name' => $name, 'login_id' => $loginId, 'password' => $finalPw]);
            } else {
                if (!$pw) return response()->json(['ok' => false, 'error' => 'Password is required for new accounts.'], 400);
                $finalId = DB::table('admin_config')->insertGetId(['login_id' => $loginId, 'password' => $pw, 'name' => $name, 'role' => 'school_admin']);
            }
            return response()->json(['ok' => true, 'sa_id' => $finalId]);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── POST /api/delete_school_admin ───────────────────────────
    public function deleteSchoolAdmin(Request $request): JsonResponse
    {
        try {
            $saId     = $request->input('sa_id');
            $affected = DB::table('admin_config')->where('id', $saId)->where('role', 'school_admin')->delete();
            if (!$affected) return response()->json(['ok' => false, 'error' => 'School Admin account not found.'], 404);
            return response()->json(['ok' => true]);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── POST /api/save_encoder ──────────────────────────────────
    public function saveEncoder(Request $request): JsonResponse
    {
        try {
            $name = $request->input('name');
            if (!$name) return response()->json(['ok' => false, 'error' => 'Name is required.'], 400);
            $row = DB::table('admin_config')->where('role', 'encoder')->first();
            if ($row) DB::table('admin_config')->where('id', $row->id)->update(['name' => $name]);
            return response()->json(['ok' => true]);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── POST /api/update_account ────────────────────────────────
    public function updateAccount(Request $request): JsonResponse
    {
        try {
            $p       = $request->all();
            $role    = $p['role']     ?? 'admin';
            $loginId = strtolower(trim($p['login_id'] ?? ''));
            $name    = trim($p['name'] ?? '');
            $pw      = $p['password'] ?? '';
            $dbId    = $p['db_id']    ?? null;

            if (!$name) return response()->json(['ok' => false, 'error' => 'Display name is required.'], 400);

            if ($role === 'school_admin' && $dbId) {
                $row = DB::table('admin_config')->where('id', $dbId)->where('role', 'school_admin')->first();
                if (!$row) return response()->json(['ok' => false, 'error' => 'Account not found.'], 404);
                $finalPw = $pw !== '' ? $pw : $row->password;
                DB::table('admin_config')->where('id', $dbId)->update(['name' => $name, 'password' => $finalPw]);
            } else {
                $row = DB::table('admin_config')->where('role', $role)->first();
                if (!$row) return response()->json(['ok' => false, 'error' => 'Account not found.'], 404);
                $finalPw    = $pw !== '' ? $pw : $row->password;
                $updateData = ['name' => $name, 'password' => $finalPw];
                if ($loginId) $updateData['login_id'] = $loginId;
                DB::table('admin_config')->where('id', $row->id)->update($updateData);
            }
            return response()->json(['ok' => true]);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── POST /api/archive ───────────────────────────────────────
    public function archive(Request $request): JsonResponse
    {
        try {
            $empId = $request->input('employee_id');
            DB::table('personnel')->where('employee_id', $empId)->update(['account_status' => 'inactive']);
            return response()->json(['ok' => true]);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── POST /api/unarchive ─────────────────────────────────────
    public function unarchive(Request $request): JsonResponse
    {
        try {
            $empId = $request->input('employee_id');
            DB::table('personnel')->where('employee_id', $empId)->update(['account_status' => 'active']);
            return response()->json(['ok' => true]);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── POST /api/compute_balances ──────────────────────────────
    public function computeBalances(Request $request): JsonResponse
    {
        try {
            $empId   = $request->input('employee_id');
            $records = $request->input('records', []);
            $status  = $request->input('status', 'Teaching');
            $updates = LeaveHelper::computeRowBalanceUpdates($records, $empId, $status);
            return response()->json(['ok' => true, 'updates' => $updates]);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── POST /api/validate_leave ────────────────────────────────
    public function validateLeave(Request $request): JsonResponse
    {
        try {
            $empRecords = $request->input('emp_records', []);
            $newRec     = $request->input('record', []);
            $editIdx    = (int)$request->input('edit_idx', -1);
            $status     = $request->input('status', 'Teaching');
            $err = LeaveHelper::validateLeaveEntry($empRecords, $newRec, $editIdx, $status);
            return response()->json(['ok' => true, 'error' => $err]);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── POST /api/apply_force_leave ─────────────────────────────
    public function applyForceLeave(Request $request): JsonResponse
    {
        try {
            $empId       = $request->input('employee_id');
            $amount      = 5;
            $currentYear = (int)now()->format('Y');

            if (!$empId) return response()->json(['ok' => false, 'error' => 'employee_id is required.'], 400);

            $emp = DB::table('personnel')->where('employee_id', $empId)->first();
            if (!$emp) return response()->json(['ok' => false, 'error' => 'Employee not found.'], 404);

            $alreadyApplied = DB::table('leave_records')
                ->where('employee_id', $empId)
                ->where('is_conversion', 0)
                ->whereRaw("(LOWER(action) LIKE '%force%' OR LOWER(action) LIKE '%mandatory%')")
                ->whereRaw("LOWER(action) NOT LIKE '%disapproved%'")
                ->whereYear('created_at', $currentYear)
                ->exists();

            if ($alreadyApplied) {
                return response()->json([
                    'ok'      => false,
                    'already' => true,
                    'error'   => 'Force/Mandatory Leave has already been applied for this employee this year.',
                ], 409);
            }

            $maxSort   = DB::table('leave_records')->where('employee_id', $empId)->max('sort_order') ?? 0;
            $sortOrder = $maxSort + 1;

            DB::table('leave_records')->insertGetId([
                'employee_id'   => $empId,
                'sort_order'    => $sortOrder,
                'is_conversion' => 0,
                'so'            => '',
                'prd'           => '',
                'from_date'     => null,
                'to_date'       => null,
                'fromPeriod'    => 'WD',
                'toPeriod'      => 'WD',
                'spec'          => 'Applied via Force Leave button',
                'action'        => 'Force/Mandatory Leave',
                'force_amount'  => $amount,
                'setA_earned'   => 0,
                'setA_abs_wp'   => 0,
                'setA_balance'  => 0,
                'setA_wop'      => 0,
                'setB_earned'   => 0,
                'setB_abs_wp'   => 0,
                'setB_balance'  => 0,
                'setB_wop'      => 0,
                'mon_v'         => 0,
                'mon_s'         => 0,
                'mon_dv'        => 0,
                'mon_ds'        => 0,
                'tr_v'          => 0,
                'tr_s'          => 0,
                'created_at'    => now(),
                'updated_at'    => now(),
            ]);

            DB::table('personnel')->where('employee_id', $empId)
                ->update(['last_edited_at' => now()]);

            $this->recomputeAndSaveBalances($empId, $emp->status ?? 'Teaching');

            return response()->json(['ok' => true, 'amount' => $amount, 'year' => $currentYear]);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── GET /api/check_force_leave_status ───────────────────────
    public function checkForceLeaveStatus(Request $request): JsonResponse
    {
        try {
            $empId       = $request->input('employee_id');
            $currentYear = (int)now()->format('Y');

            if (!$empId) return response()->json(['ok' => false, 'error' => 'employee_id is required.'], 400);

            $applied = DB::table('leave_records')
                ->where('employee_id', $empId)
                ->where('is_conversion', 0)
                ->whereRaw("(LOWER(action) LIKE '%force%' OR LOWER(action) LIKE '%mandatory%')")
                ->whereRaw("LOWER(action) NOT LIKE '%disapproved%'")
                ->whereYear('created_at', $currentYear)
                ->exists();

            return response()->json(['ok' => true, 'applied' => $applied, 'year' => $currentYear]);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── GET /api/check_accrual_status ───────────────────────────
    public function checkAccrualStatus(Request $request): JsonResponse
    {
        try {
            $empId = $request->input('employee_id');
            $year  = (int)$request->input('year',  now()->format('Y'));
            $month = (int)$request->input('month', now()->format('n'));

            if (!$empId) return response()->json(['ok' => false, 'error' => 'employee_id required'], 400);

            $applied = $this->empHasAccrualThisMonth($empId, $year, $month);

            return response()->json(['ok' => true, 'applied' => $applied, 'year' => $year, 'month' => $month]);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── GET /api/get_force_leave_statuses ────────────────────────
    public function getForceLeaveStatuses(Request $request): JsonResponse
    {
        try {
            $currentYear = (int)now()->format('Y');

            $appliedIds = DB::table('leave_records')
                ->where('is_conversion', 0)
                ->whereRaw("(LOWER(action) LIKE '%force%' OR LOWER(action) LIKE '%mandatory%')")
                ->whereRaw("LOWER(action) NOT LIKE '%disapproved%'")
                ->whereYear('created_at', $currentYear)
                ->pluck('employee_id')
                ->toArray();

            return response()->json([
                'ok'          => true,
                'applied_ids' => array_values(array_unique($appliedIds)),
                'year'        => $currentYear,
            ]);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── GET /api/get_accrual_statuses ────────────────────────────
    public function getAccrualStatuses(Request $request): JsonResponse
    {
        try {
            $year  = (int)($request->input('year',  now()->format('Y')));
            $month = (int)($request->input('month', now()->format('n')));

            $appliedIds = DB::table('leave_records')
                ->where('is_conversion', 0)
                ->whereRaw("(LOWER(action) LIKE '%monthly accrual%' OR LOWER(action) LIKE '%service credit%')")
                ->whereYear('created_at',  $year)
                ->whereMonth('created_at', $month)
                ->pluck('employee_id')
                ->toArray();

            return response()->json([
                'ok'          => true,
                'applied_ids' => array_values(array_unique($appliedIds)),
                'year'        => $year,
                'month'       => $month,
            ]);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ════════════════════════════════════════════════════════════
    //  PRIVATE HELPERS
    // ════════════════════════════════════════════════════════════

    private function resortRecords(string $empId): void
    {
        $rows = DB::table('leave_records')
            ->where('employee_id', $empId)
            ->orderBy('sort_order')
            ->orderBy('record_id')
            ->get()
            ->toArray();

        if (empty($rows)) return;

        $sorted = LeaveHelper::sortRecordsForResort(array_map(fn($r) => (array)$r, $rows));

        foreach ($sorted as $row) {
            DB::table('leave_records')
                ->where('record_id', $row['record_id'])
                ->update(['sort_order' => $row['sort_order']]);
        }
    }

    private function batchComputeUpdatedIds(array $rows): array
    {
        if (empty($rows)) return [];

        $now        = now();
        $year       = (int)$now->format('Y');
        $month      = (int)$now->format('n');
        $monthLabel = $now->format('F Y');
        $mmStr      = str_pad($month, 2, '0', STR_PAD_LEFT);

        $teachingIds = [];
        $ntTrIds     = [];
        foreach ($rows as $r) {
            $cat = strtolower($r['status'] ?? '');
            if ($cat === 'teaching') {
                $teachingIds[] = $r['employee_id'];
            } elseif (in_array($cat, ['non-teaching', 'teaching related'])) {
                $ntTrIds[] = $r['employee_id'];
            }
        }

        $updatedIds = [];

        if (!empty($teachingIds)) {
            $teachingUpdated = DB::table('leave_records')
                ->whereIn('employee_id', $teachingIds)
                ->where('is_conversion', 0)
                ->where(function ($q) use ($year, $month, $monthLabel, $mmStr) {
                    $q->where(function ($q2) use ($year, $month) {
                        $q2->whereYear('from_date', $year)->whereMonth('from_date', $month);
                    })->orWhere(function ($q2) use ($year, $month) {
                        $q2->whereYear('to_date', $year)->whereMonth('to_date', $month);
                    })->orWhere(function ($q2) use ($year, $month) {
                        $q2->whereYear('created_at', $year)->whereMonth('created_at', $month);
                    })->orWhere(function ($q2) use ($monthLabel, $mmStr, $year) {
                        $q2->where('prd', 'LIKE', "%{$monthLabel}%")
                           ->orWhere('prd', 'LIKE', "%{$mmStr}/{$year}%")
                           ->orWhere('prd', 'LIKE', "%{$mmStr}-{$year}%");
                    });
                })
                ->distinct()
                ->pluck('employee_id')
                ->toArray();

            $updatedIds = array_merge($updatedIds, $teachingUpdated);
        }

        if (!empty($ntTrIds)) {
            $ntTrUpdated = DB::table('leave_records')
                ->whereIn('employee_id', $ntTrIds)
                ->where('is_conversion', 0)
                ->whereRaw("(LOWER(action) LIKE '%monthly accrual%' OR LOWER(action) LIKE '%service credit%')")
                ->where(function ($q) use ($year, $month, $monthLabel, $mmStr) {
                    $q->where(function ($q2) use ($year, $month) {
                        $q2->whereYear('created_at', $year)->whereMonth('created_at', $month);
                    })->orWhere(function ($q2) use ($monthLabel, $mmStr, $year) {
                        $q2->where('prd', 'LIKE', "%{$monthLabel}%")
                           ->orWhere('prd', 'LIKE', "%{$mmStr}/{$year}%")
                           ->orWhere('prd', 'LIKE', "%{$mmStr}-{$year}%");
                    });
                })
                ->distinct()
                ->pluck('employee_id')
                ->toArray();

            $updatedIds = array_merge($updatedIds, $ntTrUpdated);
        }

        return array_values(array_unique($updatedIds));
    }

    private function empHasAccrualThisMonth(string $empId, int $year, int $month): bool
    {
        $now        = now()->setYear($year)->setMonth($month)->startOfMonth();
        $monthLabel = $now->format('F Y');
        $mmStr      = str_pad($month, 2, '0', STR_PAD_LEFT);

        return DB::table('leave_records')
            ->where('employee_id', $empId)
            ->where('is_conversion', 0)
            ->whereRaw("(LOWER(action) LIKE '%monthly accrual%' OR LOWER(action) LIKE '%service credit%')")
            ->where(function ($q) use ($year, $month, $monthLabel, $mmStr) {
                $q->where(function ($q2) use ($year, $month) {
                    $q2->whereYear('created_at', $year)->whereMonth('created_at', $month);
                })->orWhere(function ($q2) use ($monthLabel, $mmStr, $year) {
                    $q2->where('prd', 'LIKE', "%{$monthLabel}%")
                       ->orWhere('prd', 'LIKE', "%{$mmStr}/{$year}%")
                       ->orWhere('prd', 'LIKE', "%{$mmStr}-{$year}%");
                });
            })
            ->exists();
    }

    private function recomputeAndSaveBalances(string $empId, string $empStatus): void
    {
        $rows = DB::table('leave_records')
            ->where('employee_id', $empId)
            ->orderBy('sort_order')
            ->orderBy('record_id')
            ->get()
            ->toArray();

        $records = array_map(fn($r) => LeaveHelper::rowToRecord((array)$r), $rows);
        $updates = LeaveHelper::computeRowBalanceUpdates($records, $empId, $empStatus);

        foreach ($updates as $u) {
            DB::table('leave_records')
                ->where('record_id', $u['record_id'])
                ->update([
                    'setA_earned'  => $u['setA_earned'],
                    'setA_abs_wp'  => $u['setA_abs_wp'],
                    'setA_balance' => $u['setA_balance'],
                    'setA_wop'     => $u['setA_wop'],
                    'setB_earned'  => $u['setB_earned'],
                    'setB_abs_wp'  => $u['setB_abs_wp'],
                    'setB_balance' => $u['setB_balance'],
                    'setB_wop'     => $u['setB_wop'],
                ]);
        }
    }

    // ── GET /api/fix_all_sort_orders — ONE TIME USE ─────────────
    public function fixAllSortOrders(): JsonResponse
    {
        try {
            $employees = DB::table('personnel')->pluck('employee_id');
            $fixed = 0;

            foreach ($employees as $empId) {
                $emp = DB::table('personnel')
                    ->where('employee_id', $empId)
                    ->first();

                if (!$emp) continue;

                $this->resortRecords($empId);
                $this->recomputeAndSaveBalances(
                    $empId,
                    $emp->status ?? 'Teaching'
                );

                $fixed++;
            }

            return response()->json([
                'ok'      => true,
                'message' => "Fixed sort order for {$fixed} employees.",
            ]);
        } catch (Exception $e) {
            return response()->json([
                'ok'    => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // ── POST /api/submit_leave_application ──────────────────────
    public function submitLeaveApplication(Request $request): JsonResponse
    {
        try {
            $role  = $request->session()->get('lms_role', '');
            $empId = $request->session()->get('lms_employee_id', '');
            if ($role !== 'employee' || !$empId) {
                return response()->json(['ok' => false, 'error' => 'Unauthorized.'], 403);
            }

            $appId = (int)$request->input('app_id', 0);

            $emp = DB::table('personnel')->where('employee_id', $empId)->first();

            $data = [
                'employee_id'             => $empId,
                'surname'                 => $emp->surname  ?? '',
                'given'                   => $emp->given    ?? '',
                'suffix'                  => $emp->suffix   ?? '',
                'maternal'                => $emp->maternal ?? '',  // ← FIX 1
                'office_school'           => $request->input('office_school') ?? '',
                'position'                => $request->input('position') ?? '',
                'date_of_filing'          => $request->input('date_of_filing') ?: now()->toDateString(),
                'salary_monthly'          => $request->input('salary_monthly') ?: null,
                'leave_type'              => $request->input('leave_type') ?? '',
                'leave_type_other'        => $request->input('leave_type_other') ?? '',
                'vacation_detail'         => $request->input('vacation_detail') ?? '',
                'vacation_abroad_specify' => $request->input('vacation_abroad_specify') ?? '',
                'sick_detail'             => $request->input('sick_detail') ?? '',
                'sick_specify'            => $request->input('sick_specify') ?? '',
                'women_specify'           => $request->input('women_specify') ?? '',
                'study_detail'            => $request->input('study_detail') ?? '',
                'other_purpose'           => $request->input('other_purpose') ?? '',
                'num_working_days'        => $request->input('num_working_days') ?: null,
                'inclusive_dates'         => $request->input('inclusive_dates') ?? '',
                'commutation'             => $request->input('commutation') ?? 'Not Requested',
                'status'                  => 'pending',
            ];

            if ($request->hasFile('attachment')) {
                $file     = $request->file('attachment');
                $filename = time() . '_' . $empId . '_' . $file->getClientOriginalName();
                $path     = $file->storeAs('leave_attachments', $filename, 'public');
                $data['attachment_path'] = $path;
                $data['attachment_name'] = $file->getClientOriginalName();
            }

            if ($appId > 0) {
                $existing = DB::table('leave_applications')
                    ->where('id', $appId)
                    ->where('employee_id', $empId)
                    ->where('status', 'rejected')
                    ->first();
                if (!$existing) {
                    return response()->json(['ok' => false, 'error' => 'Application not found or not resubmittable.'], 404);
                }
                if (!$request->hasFile('attachment')) {
                    unset($data['attachment_path'], $data['attachment_name']);
                }
                DB::table('leave_applications')->where('id', $appId)->update($data);
                return response()->json(['ok' => true, 'app_id' => $appId, 'resubmitted' => true]);
            } else {
                $data['created_at'] = now();
                $newId = DB::table('leave_applications')->insertGetId($data);
                return response()->json(['ok' => true, 'app_id' => $newId]);
            }
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── GET /api/get_my_leave_applications ──────────────────────
    public function getMyLeaveApplications(Request $request): JsonResponse
    {
        try {
            $empId = $request->session()->get('lms_employee_id', '');
            if (!$empId) return response()->json(['ok' => false, 'error' => 'Unauthorized.'], 403);

            // ← FIX 2: JOIN personnel to always get maternal name
            $rows = DB::table('leave_applications as la')
                ->join('personnel as p', 'la.employee_id', '=', 'p.employee_id')
                ->where('la.employee_id', $empId)
                ->orderByDesc('la.created_at')
                ->select('la.*', 'p.maternal')
                ->get()
                ->toArray();

            return response()->json(['ok' => true, 'applications' => array_map(fn($r) => (array)$r, $rows)]);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── GET /api/get_leave_applications (admin/encoder) ─────────
    public function getLeaveApplications(Request $request): JsonResponse
    {
        try {
            $role = $request->session()->get('lms_role', '');
            if (!in_array($role, ['admin', 'encoder'])) {
                return response()->json(['ok' => false, 'error' => 'Unauthorized.'], 403);
            }

            $status = $request->input('status', 'pending');
            $rows = DB::table('leave_applications as la')
                ->join('personnel as p', 'la.employee_id', '=', 'p.employee_id')
                ->where('la.status', $status)
                ->orderByDesc('la.created_at')
                ->select('la.*', 'p.surname', 'p.given', 'p.suffix', 'p.maternal', 'p.status as emp_category')
                ->get()
                ->toArray();

            return response()->json(['ok' => true, 'applications' => array_map(fn($r) => (array)$r, $rows)]);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── POST /api/review_leave_application ──────────────────────
    public function reviewLeaveApplication(Request $request): JsonResponse
    {
        try {
            $role = $request->session()->get('lms_role', '');
            $name = $request->session()->get('lms_name', 'Admin');
            if (!in_array($role, ['admin', 'encoder'])) {
                return response()->json(['ok' => false, 'error' => 'Unauthorized.'], 403);
            }

            $appId  = $request->input('app_id');
            $action = $request->input('action');
            $reason = $request->input('reason', '');

            if (!$appId || !in_array($action, ['accept', 'reject'])) {
                return response()->json(['ok' => false, 'error' => 'Invalid parameters.'], 400);
            }
            if ($action === 'reject' && !$reason) {
                return response()->json(['ok' => false, 'error' => 'Rejection reason is required.'], 400);
            }

            DB::table('leave_applications')->where('id', $appId)->update([
                'status'           => $action === 'accept' ? 'accepted' : 'rejected',
                'rejection_reason' => $action === 'reject' ? $reason : null,
                'reviewed_at'      => now(),
                'reviewed_by'      => $name,
                'updated_at'       => now(),
            ]);

            return response()->json(['ok' => true]);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── POST /api/delete_leave_application ──────────────────────
    public function deleteLeaveApplication(Request $request): JsonResponse
    {
        try {
            $role  = $request->session()->get('lms_role', '');
            $empId = $request->session()->get('lms_employee_id', '');
            $appId = $request->input('app_id');

            $query = DB::table('leave_applications')->where('id', $appId);

            if ($role === 'employee') {
                $query->where('employee_id', $empId)
                      ->whereIn('status', ['pending', 'rejected']);
            } elseif (!in_array($role, ['admin', 'encoder'])) {
                return response()->json(['ok' => false, 'error' => 'Unauthorized.'], 403);
            }

            $deleted = $query->delete();
            if (!$deleted) return response()->json(['ok' => false, 'error' => 'Not found or not deletable.'], 404);

            return response()->json(['ok' => true]);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── POST /api/mark_as_recorded ───────────────────────────────
    public function markAsRecorded(Request $request): JsonResponse
    {
        try {
            $role = $request->session()->get('lms_role', '');
            $name = $request->session()->get('lms_name', 'Admin');
            if (!in_array($role, ['admin', 'encoder'])) {
                return response()->json(['ok' => false, 'error' => 'Unauthorized.'], 403);
            }
            $appId = $request->input('app_id');
            if (!$appId) return response()->json(['ok' => false, 'error' => 'Missing app_id'], 400);
            $app = DB::table('leave_applications')->where('id', $appId)->first();
            if (!$app) return response()->json(['ok' => false, 'error' => 'Application not found'], 404);
            if ($app->status !== 'accepted') {
                return response()->json(['ok' => false, 'error' => 'Only accepted applications can be recorded'], 400);
            }
            DB::table('leave_applications')->where('id', $appId)->update([
                'recorded_at' => now(),
                'recorded_by' => $name,
                'updated_at'  => now(),
            ]);
            return response()->json(['ok' => true]);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── GET /api/get_recorded_applications (admin) ───────────────
    public function getRecordedApplications(Request $request): JsonResponse
    {
        try {
            $role = $request->session()->get('lms_role', '');
            if (!in_array($role, ['admin', 'encoder'])) {
                return response()->json(['ok' => false, 'error' => 'Unauthorized.'], 403);
            }
            $rows = DB::table('leave_applications as la')
                ->join('personnel as p', 'la.employee_id', '=', 'p.employee_id')
                ->whereNotNull('la.recorded_at')
                ->orderByDesc('la.recorded_at')
                ->select('la.*', 'p.surname', 'p.given', 'p.suffix', 'p.maternal', 'p.status as emp_category')
                ->get()
                ->toArray();
            return response()->json(['ok' => true, 'applications' => array_map(fn($r) => (array)$r, $rows)]);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

   // ── POST /api/assign_school_admin ───────────────────────────
    public function assignSchoolAdmin(Request $request): JsonResponse
    {
        try {
            $role  = $request->session()->get('lms_role', '');
            if (!in_array($role, ['admin', 'encoder'])) {
                return response()->json(['ok' => false, 'error' => 'Unauthorized.'], 403);
            }
            $empId = $request->input('employee_id');
            $saId  = $request->input('assigned_sa_id');
            if (!$empId) return response()->json(['ok' => false, 'error' => 'employee_id required.'], 400);
            DB::table('personnel')->where('employee_id', $empId)->update([
                'assigned_sa_id' => $saId ? (int)$saId : null,
                'updated_at'     => now(),
            ]);
            return response()->json(['ok' => true]);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // ── GET /api/get_my_recorded_applications (employee) ────────
    public function getMyRecordedApplications(Request $request): JsonResponse
    {
        try {
            $empId = $request->session()->get('lms_employee_id', '');
            if (!$empId) return response()->json(['ok' => false, 'error' => 'Unauthorized.'], 403);
            $rows = DB::table('leave_applications as la')
                ->join('personnel as p', 'la.employee_id', '=', 'p.employee_id')
                ->where('la.employee_id', $empId)
                ->whereNotNull('la.recorded_at')
                ->orderByDesc('la.recorded_at')
                ->select('la.*', 'p.maternal')
                ->get()
                ->toArray();
            return response()->json(['ok' => true, 'applications' => array_map(fn($r) => (array)$r, $rows)]);
        } catch (Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }
}
