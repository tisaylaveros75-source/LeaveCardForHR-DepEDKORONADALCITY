<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LeaveCardApiController;

Route::middleware('web')->prefix('')->group(function () {
    Route::get('/session_check',            [LeaveCardApiController::class, 'sessionCheck']);
    Route::post('/login',                   [LeaveCardApiController::class, 'login']);
    Route::post('/logout',                  [LeaveCardApiController::class, 'logout']);
    Route::get('/get_personnel',            [LeaveCardApiController::class, 'getPersonnel']);
    Route::get('/get_records',              [LeaveCardApiController::class, 'getRecords']);
    Route::get('/get_admin_cfg',            [LeaveCardApiController::class, 'getAdminCfg']);
    Route::get('/get_school_admins',        [LeaveCardApiController::class, 'getSchoolAdmins']);

    // ── FIXED TYPO: was 'checkForceLeavStatus' (missing 'e') ──
    Route::get('/check_force_leave_status', [LeaveCardApiController::class, 'checkForceLeaveStatus']);
    Route::get('/check_accrual_status',     [LeaveCardApiController::class, 'checkAccrualStatus']);

    // ── ADDED: batch status endpoints used by leave cards page ──
    Route::get('/get_force_leave_statuses', [LeaveCardApiController::class, 'getForceLeaveStatuses']);
    Route::get('/get_accrual_statuses',     [LeaveCardApiController::class, 'getAccrualStatuses']);

    Route::post('/save_employee',           [LeaveCardApiController::class, 'saveEmployee']);
    Route::post('/archive',                 [LeaveCardApiController::class, 'archive']);
    Route::post('/unarchive',               [LeaveCardApiController::class, 'unarchive']);
    Route::post('/save_record',             [LeaveCardApiController::class, 'saveRecord']);
    Route::post('/update_record',           [LeaveCardApiController::class, 'updateRecord']);
    Route::post('/delete_record',           [LeaveCardApiController::class, 'deleteRecord']);
    Route::post('/delete_era',              [LeaveCardApiController::class, 'deleteEra']);
    Route::post('/insert_record_at',        [LeaveCardApiController::class, 'insertRecordAt']);
    Route::post('/reorder_records',         [LeaveCardApiController::class, 'reorderRecords']);
    Route::post('/save_row_balance',        [LeaveCardApiController::class, 'saveRowBalance']);
    Route::post('/apply_force_leave',       [LeaveCardApiController::class, 'applyForceLeave']);
    Route::post('/save_admin',              [LeaveCardApiController::class, 'saveAdmin']);
    Route::post('/save_encoder',            [LeaveCardApiController::class, 'saveEncoder']);
    Route::post('/update_account',          [LeaveCardApiController::class, 'updateAccount']);
    Route::post('/save_school_admin',       [LeaveCardApiController::class, 'saveSchoolAdmin']);
    Route::post('/delete_school_admin',     [LeaveCardApiController::class, 'deleteSchoolAdmin']);
    Route::post('/compute_balances',        [LeaveCardApiController::class, 'computeBalances']);
    Route::post('/validate_leave',          [LeaveCardApiController::class, 'validateLeave']);
    Route::get('/fix_all_sort_orders', [LeaveCardApiController::class, 'fixAllSortOrders']);
});