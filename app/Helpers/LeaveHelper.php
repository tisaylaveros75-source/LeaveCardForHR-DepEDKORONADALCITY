<?php

namespace App\Helpers;

class LeaveHelper
{
    // ── Date normalisation ──────────────────────────────────────
    public static function normaliseDate(?string $d): ?string
    {
        if (!$d) return null;
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $d)) return $d;
        if (preg_match('/^(\d{2})\/(\d{2})\/(\d{4})$/', $d, $m)) {
            return "{$m[3]}-{$m[1]}-{$m[2]}";
        }
        if (str_contains($d, 'T')) return substr($d, 0, 10);
        return null;
    }

    // ── Leave classification ────────────────────────────────────
    public static function classifyLeave(string $act): array
    {
        $a = strtolower($act);
        $isForceDis = (str_contains($a, 'force') || str_contains($a, 'mandatory')) && str_contains($a, 'disapproved');
        return [
            'isAcc'          => str_contains($a, 'accrual') || str_contains($a, 'service credit'),
            'isMon'          => str_contains($a, 'monetization') && !str_contains($a, 'disapproved'),
            'isMD'           => str_contains($a, 'monetization') && str_contains($a, 'disapproved'),
            'isForceDis'     => $isForceDis,
            'isDis'          => str_contains($a, '(disapproved)') && !(str_contains($a, 'monetization') && str_contains($a, 'disapproved')) && !$isForceDis,
            'isSick'         => str_contains($a, 'sick'),
            'isForce'        => (str_contains($a, 'force') || str_contains($a, 'mandatory')) && !str_contains($a, 'disapproved'),
            'isPer'          => str_contains($a, 'personal'),
            'isTransfer'     => str_contains($a, 'credit entry') || str_contains($a, 'from denr'),
            'isTerminal'     => str_contains($a, 'terminal'),
            'isSetB_noDeduct'=> str_contains($a, 'maternity') || str_contains($a, 'paternity'),
            'isSetA_noDeduct'=> str_contains($a, 'solo parent') || str_contains($a, 'wellness') ||
                                str_contains($a, 'special privilege') || str_contains($a, 'spl') ||
                                str_contains($a, 'rehabilitation') || str_contains($a, 'study') ||
                                str_contains($a, 'magna carta') || str_contains($a, 'vawc') ||
                                str_contains($a, 'cto') || str_contains($a, 'compensatory'),
            'isVacation'     => str_contains($a, 'vacation') && !str_contains($a, '(disapproved)'),
        ];
    }

    // ── Calculate weekdays ──────────────────────────────────────
    public static function calcDays(array $r): float
    {
        $a = strtolower($r['action'] ?? '');
        $isForceAction = (str_contains($a, 'force') || str_contains($a, 'mandatory')) && !str_contains($a, 'disapproved');
        $isForceDis    = (str_contains($a, 'force') || str_contains($a, 'mandatory')) &&  str_contains($a, 'disapproved');

        $forceAmount = (float)($r['forceAmount'] ?? 0);
        if (($isForceAction || $isForceDis) && $forceAmount > 0) return $forceAmount;

        $from = $r['from'] ?? '';
        $to   = $r['to']   ?? '';

        if ($from && $to) {
            $startHalf = in_array($r['fromPeriod'] ?? 'WD', ['AM', 'PM']);
            $endHalf   = in_array($r['toPeriod']   ?? 'WD', ['AM', 'PM']);

            if ($from === $to && $startHalf) {
                $d   = new \DateTime($from);
                $day = (int)$d->format('N');
                return ($day <= 5) ? 0.5 : 0;
            }

            $count = 0;
            $start = new \DateTime($from);
            $end   = new \DateTime($to);
            if ($end < $start) return 0;

            $cur = clone $start;
            while ($cur <= $end) {
                $day = (int)$cur->format('N');
                if ($day <= 5) $count++;
                $cur->modify('+1 day');
            }

            if ($startHalf) $count -= 0.5;
            if ($endHalf)   $count -= 0.5;
            if ($count < 0) $count = 0;
            return $count;
        }
        return 0;
    }

    // ── Format date MM/DD/YYYY ──────────────────────────────────
    public static function fmtD(?string $ds): string
    {
        if (!$ds) return '';
        if (preg_match('/^\d{2}\/\d{2}\/\d{4}$/', $ds)) return $ds;
        $d = new \DateTime($ds . (str_contains($ds, 'T') ? '' : 'T00:00:00'));
        if (!$d) return $ds;
        return $d->format('m/d/Y');
    }

    // ── Record → DB row ─────────────────────────────────────────
    public static function recordToRow(array $r, string $empId, int $sortOrder): array
    {
        $isConv = !empty($r['_conversion']);
        $action = $r['action'] ?? '';
        $isXfer = self::isTransferAction($action);

        $C = self::classifyLeave($action);

        $setAEarned = 0;
        if (isset($r['setA_earned']) && (float)$r['setA_earned'] !== 0.0) {
            $setAEarned = (float)$r['setA_earned'];
        } elseif ($C['isAcc']) {
            $setAEarned = (float)($r['earned'] ?? 0);
        } elseif ($isXfer) {
            $setAEarned = (float)($r['trV'] ?? 0);
        }

        $setBEarned = 0;
        if (isset($r['setB_earned']) && (float)$r['setB_earned'] !== 0.0) {
            $setBEarned = (float)$r['setB_earned'];
        } elseif ($C['isAcc']) {
            $setBEarned = (float)($r['earned'] ?? 0);
        } elseif ($isXfer) {
            $setBEarned = (float)($r['trS'] ?? 0);
        }

        return [
            'employee_id'     => $empId,
            'sort_order'      => $sortOrder,
            'so'              => $r['so']           ?? '',
            'prd'             => $isConv ? ''       : ($r['prd'] ?? ''),
            'from_date'       => self::normaliseDate($r['from'] ?? ''),
            'to_date'         => self::normaliseDate($r['to']   ?? ''),
            'fromPeriod'      => $r['fromPeriod']   ?? 'WD',
            'toPeriod'        => $r['toPeriod']     ?? 'WD',
            'spec'            => $r['spec']          ?? '',
            'action'          => $action,
            'force_amount'    => (float)($r['forceAmount'] ?? 0),
            'setA_earned'     => $setAEarned,
            'setA_abs_wp'     => (float)($r['setA_abs_wp']  ?? 0),
            'setA_balance'    => $isConv ? (float)($r['fwdBV'] ?? 0) : (float)($r['setA_balance'] ?? 0),
            'setA_wop'        => (float)($r['setA_wop']     ?? 0),
            'setB_earned'     => $setBEarned,
            'setB_abs_wp'     => (float)($r['setB_abs_wp']  ?? 0),
            'setB_balance'    => $isConv ? (float)($r['fwdBS'] ?? 0) : (float)($r['setB_balance'] ?? 0),
            'setB_wop'        => (float)($r['setB_wop']     ?? 0),
            'is_conversion'   => $isConv ? 1 : 0,
            'from_status'     => $r['fromStatus']   ?? '',
            'to_status'       => $r['toStatus']     ?? '',
            'conversion_date' => self::normaliseDate($r['date'] ?? ''),
            'mon_v'           => (float)($r['monV']  ?? 0),
            'mon_s'           => (float)($r['monS']  ?? 0),
            'mon_dv'          => (float)($r['monDV'] ?? 0),
            'mon_ds'          => (float)($r['monDS'] ?? 0),
            'tr_v'            => (float)($r['trV']   ?? 0),
            'tr_s'            => (float)($r['trS']   ?? 0),
            'created_at'      => now(),
            'updated_at'      => now(),
        ];
    }

    // ── DB row → JS record ──────────────────────────────────────
    public static function rowToRecord(array $row): array
    {
        $action = (string)($row['action'] ?? '');
        $isXfer = self::isTransferAction($action);

        $setAE = (float)($row['setA_earned'] ?? 0);
        $setBE = (float)($row['setB_earned'] ?? 0);
        $setAA = (float)($row['setA_abs_wp'] ?? 0);
        $setBA = (float)($row['setB_abs_wp'] ?? 0);

        $rawFP = strtoupper((string)($row['fromPeriod'] ?? 'WD'));
        $rawTP = strtoupper((string)($row['toPeriod']   ?? 'WD'));
        $fromPeriod = in_array($rawFP, ['AM', 'PM']) ? $rawFP : 'WD';
        $toPeriod   = in_array($rawTP, ['AM', 'PM']) ? $rawTP : 'WD';

        $fromDate = '';
        if (!empty($row['from_date'])) {
            $fromDate = $row['from_date'] instanceof \DateTime
                ? $row['from_date']->format('Y-m-d')
                : substr((string)$row['from_date'], 0, 10);
        }
        $toDate = '';
        if (!empty($row['to_date'])) {
            $toDate = $row['to_date'] instanceof \DateTime
                ? $row['to_date']->format('Y-m-d')
                : substr((string)$row['to_date'], 0, 10);
        }

        $r = [
            'so'           => (string)($row['so']   ?? ''),
            'prd'          => (string)($row['prd']  ?? ''),
            'from'         => $fromDate,
            'to'           => $toDate,
            'fromPeriod'   => $fromPeriod,
            'toPeriod'     => $toPeriod,
            'spec'         => (string)($row['spec']  ?? ''),
            'action'       => $action,
            'forceAmount'  => (float)($row['force_amount'] ?? 0),
            'earned'       => $setAE,
            'monAmount'    => (float)($row['mon_v']  ?? 0),
            'monDisAmt'    => (float)($row['mon_dv'] ?? 0),
            'monV'         => (float)($row['mon_v']  ?? 0),
            'monS'         => (float)($row['mon_s']  ?? 0),
            'monDV'        => (float)($row['mon_dv'] ?? 0),
            'monDS'        => (float)($row['mon_ds'] ?? 0),
            'trV'          => (float)($row['tr_v']   ?? ($isXfer ? $setAE : 0)),
            'trS'          => (float)($row['tr_s']   ?? ($isXfer ? $setBE : 0)),
            'setA_earned'  => $setAE,
            'setA_abs_wp'  => $setAA,
            'setA_balance' => (float)($row['setA_balance'] ?? 0),
            'setA_wop'     => (float)($row['setA_wop']     ?? 0),
            'setB_earned'  => $setBE,
            'setB_abs_wp'  => $setBA,
            'setB_balance' => (float)($row['setB_balance'] ?? 0),
            'setB_wop'     => (float)($row['setB_wop']     ?? 0),
            '_record_id'   => (int)($row['record_id'] ?? 0),
            'sort_order'   => (int)($row['sort_order'] ?? 0),
        ];

        if (!empty($row['is_conversion'])) {
            $r['_conversion'] = true;
            $r['fromStatus']  = (string)($row['from_status']     ?? '');
            $r['toStatus']    = (string)($row['to_status']       ?? '');
            $r['date']        = (string)($row['conversion_date'] ?? '');
            $r['fwdBV']       = (float)($row['setA_balance'] ?? 0);
            $r['fwdBS']       = (float)($row['setB_balance'] ?? 0);
        }
        return $r;
    }

    // ── Personnel DB row → array ────────────────────────────────
    public static function personnelRowToJs(array $r): array
    {
        return [
            'id'             => $r['employee_id'],
            'email'          => $r['email'],
            'password'       => $r['password'],
            'surname'        => $r['surname'],
            'given'          => $r['given'],
            'suffix'         => $r['suffix'] ?? '',
            'maternal'       => $r['maternal'] ?? '',
            'sex'            => $r['sex'] ?? '',
            'civil'          => $r['civil'] ?? '',
            'dob'            => $r['dob'],
            'pob'            => $r['pob'] ?? '',
            'addr'           => $r['addr'] ?? '',
            'spouse'         => $r['spouse'] ?? '',
            'edu'            => $r['edu'] ?? '',
            'elig'           => $r['elig'] ?? '',
            'rating'         => $r['rating'] ?? '',
            'tin'            => $r['tin'] ?? '',
            'pexam'          => $r['pexam'] ?? '',
            'dexam'          => $r['dexam'],
            'appt'           => $r['appt'],
            'status'         => $r['status'],
            'account_status'  => $r['account_status'] ?? 'active',
            'assigned_sa_id'  => $r['assigned_sa_id'] ?? null,
            'pos'            => $r['pos'] ?? '',
            'school'         => $r['school'] ?? '',
            'lastEditedAt'   => $r['last_edited_at'],
            'conversionLog'  => [],
            'records'        => [],
        ];
    }

    // ════════════════════════════════════════════════════════════
    //  SORT RECORDS FOR DB RESORT
    //
    //  Rules:
    //   • Conversion markers (is_conversion=1) are never moved —
    //     they stay as era boundaries.
    //   • Within each era segment (between conversion markers),
    //     records are grouped by "undated barriers":
    //       - Dated records before an undated record are sorted
    //         chronologically among themselves.
    //       - An undated record acts as a barrier: dated records
    //         that come after it stay after it.
    //       - A new undated record is always appended at the end
    //         (handled naturally since it was inserted last).
    //   • "Date" priority: from_date → extracted from prd → to_date
    //   • Duplicate dates: stable (preserve original record_id order,
    //     i.e. lower record_id comes first → older entry stays on top).
    //
    //  @param  array $rows  Raw DB rows (stdClass or array), each has:
    //                        record_id, sort_order, is_conversion,
    //                        from_date, to_date, prd
    //  @return array        Same rows with sort_order reassigned 1…N
    // ════════════════════════════════════════════════════════════
    public static function sortRecordsForResort(array $rows): array
    {
        if (empty($rows)) return $rows;

        // Normalise to arrays
        $rows = array_map(fn($r) => (array)$r, $rows);

        // ── Step 1: Split into segments at conversion markers ──
        // Each segment: ['conv' => row|null, 'recs' => [...rows]]
        $segments   = [];
        $currentSeg = ['conv' => null, 'recs' => []];

        foreach ($rows as $row) {
            if ((int)($row['is_conversion'] ?? 0) === 1) {
                $segments[]   = $currentSeg;
                $currentSeg   = ['conv' => $row, 'recs' => []];
            } else {
                $currentSeg['recs'][] = $row;
            }
        }
        $segments[] = $currentSeg;

        // ── Step 2: Sort each segment's recs respecting undated barriers ──
        $sorted = [];
        foreach ($segments as $seg) {
            if ($seg['conv'] !== null) {
                $sorted[] = $seg['conv'];
            }
            $sorted = array_merge($sorted, self::sortSegmentRecs($seg['recs']));
        }

        // ── Step 3: Reassign sort_order 1…N ──
        foreach ($sorted as $i => &$row) {
            $row['sort_order'] = $i + 1;
        }
        unset($row);

        return $sorted;
    }

    /**
     * Sort one era segment's records with undated-barrier logic.
     * Undated records act as separators: the dated records before each
     * undated record are sorted among themselves, then the undated record
     * is placed, and dated records after it are sorted separately.
     *
     * Stable: when two records have the same date key, the one with the
     * lower record_id comes first.
     */
    private static function sortSegmentRecs(array $recs): array
    {
        if (empty($recs)) return [];

        $result    = [];
        $dateGroup = [];   // accumulate dated records until we hit an undated one

        foreach ($recs as $r) {
            $key = self::getRowSortKey($r);
            if ($key === PHP_INT_MAX) {
                // Undated barrier: flush + sort the preceding dated group first
                usort($dateGroup, fn($a, $b) => self::compareRows($a, $b));
                $result    = array_merge($result, $dateGroup);
                $dateGroup = [];
                $result[]  = $r;   // undated stays here as a barrier
            } else {
                $dateGroup[] = $r;
            }
        }

        // Flush any remaining dated records
        usort($dateGroup, fn($a, $b) => self::compareRows($a, $b));
        $result = array_merge($result, $dateGroup);

        return $result;
    }

    /**
     * Get a comparable sort key (Unix timestamp) from a DB row.
     * Priority: from_date → first date in prd → to_date → PHP_INT_MAX (undated)
     */
    private static function getRowSortKey(array $row): int
{
    // from_date (ISO yyyy-mm-dd)
    if (!empty($row['from_date'])) {
        $ts = self::parseDateStr((string)$row['from_date']);
        if ($ts !== null) return $ts;
    }

    // prd — extract earliest date found in the text
    if (!empty($row['prd'])) {
        $prd      = trim((string)$row['prd']);
        $earliest = null;

        // All ISO dates: yyyy-mm-dd
        if (preg_match_all('/(\d{4}-\d{2}-\d{2})/', $prd, $matches)) {
            foreach ($matches[1] as $dateStr) {
                $ts = self::parseDateStr($dateStr);
                if ($ts !== null && ($earliest === null || $ts < $earliest)) {
                    $earliest = $ts;
                }
            }
        }

        // All MM/DD/YYYY dates
        if (preg_match_all('/(\d{1,2})\/(\d{1,2})\/(\d{4})/', $prd, $matches, PREG_SET_ORDER)) {
            foreach ($matches as $m) {
                $iso = sprintf('%04d-%02d-%02d', (int)$m[3], (int)$m[1], (int)$m[2]);
                $ts  = self::parseDateStr($iso);
                if ($ts !== null && ($earliest === null || $ts < $earliest)) {
                    $earliest = $ts;
                }
            }
        }

        // yyyy only — ONLY if nothing else matched (e.g. "2023" or "2004")
        if ($earliest === null && preg_match('/^\d{4}$/', $prd)) {
            $ts = self::parseDateStr($prd . '-01-01');
            if ($ts !== null) $earliest = $ts;
        }

        if ($earliest !== null) return $earliest;
    }

    // to_date fallback
    if (!empty($row['to_date'])) {
        $ts = self::parseDateStr((string)$row['to_date']);
        if ($ts !== null) return $ts;
    }

    return PHP_INT_MAX; // undated — acts as barrier
}
    

    private static function parseDateStr(string $s): ?int
    {
        $s = trim($s);
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $s)) return null;
        $ts = strtotime($s . ' 00:00:00');
        return ($ts !== false && $ts > 0) ? (int)$ts : null;
    }

    /**
     * Compare two rows: first by date key (ascending), then by record_id (stable).
     */
    private static function compareRows(array $a, array $b): int
    {
        $ka = self::getRowSortKey($a);
        $kb = self::getRowSortKey($b);
        if ($ka !== $kb) return $ka <=> $kb;
        // Same date → lower record_id first (stable, older entry on top)
        return (int)($a['record_id'] ?? 0) <=> (int)($b['record_id'] ?? 0);
    }

    // ── Compute row balance updates ─────────────────────────────
    public static function computeRowBalanceUpdates(array $records, string $empId, string $empStatus): array
    {
        $segments = [];
        $currentStatus = $empStatus;

        $firstConv = null;
        foreach ($records as $r) {
            if (!empty($r['_conversion'])) { $firstConv = $r; break; }
        }
        if ($firstConv) {
            $currentStatus = $firstConv['fromStatus'] ?? $empStatus;
        }

        $currentSeg = ['eraStatus' => $currentStatus, 'conv' => null, 'recs' => []];

        foreach ($records as $r) {
            if (!$r) continue;
            if (!empty($r['_conversion'])) {
                $segments[] = $currentSeg;
                $newStatus = $r['toStatus'] ?? $empStatus;
                $currentSeg = ['eraStatus' => $newStatus, 'conv' => $r, 'recs' => []];
            } else {
                $currentSeg['recs'][] = $r;
            }
        }
        $segments[] = $currentSeg;

        $updates = [];

        foreach ($segments as $seg) {
            if (strtolower($seg['eraStatus'] ?? '') === 'teaching') {
                // ── TEACHING: single running balance ──────────────────────
                $bal = 0;
                foreach ($seg['recs'] as $r) {
                    if (empty($r['_record_id'])) continue;
                    $C = self::classifyLeave($r['action'] ?? '');
                    $rowAEarned = 0; $rowAAbsWP = 0; $rowAWOP = 0;
                    $rowBAbsWP  = 0; $rowBWOP   = 0;

                    if ($C['isTransfer']) {
                        $rowAEarned = (float)($r['trV'] ?? 0);
                        $bal += $rowAEarned;

                    } elseif ($C['isAcc']) {
                        $rowAEarned = (float)($r['earned'] ?? $r['setA_earned'] ?? 0);
                        $bal += $rowAEarned;

                    } elseif ((float)($r['earned'] ?? 0) > 0 && !$C['isMon'] && !$C['isPer'] && !$C['isDis'] && !$C['isForceDis'] && !$C['isMD']) {
                        $rowAEarned = (float)$r['earned'];
                        $bal += $rowAEarned;

                    } elseif ($C['isMD']) {
                        $ret = (float)($r['monDV'] ?? $r['monDisAmt'] ?? 0);
                        if ($ret > 0) { $bal += $ret; $rowAEarned = $ret; }

                    } elseif ($C['isForceDis']) {
                        $d = (float)($r['forceAmount'] ?? 0);
                        if ($d > 0) { $bal += $d; $rowAEarned = $d; }

                    } elseif ($C['isMon']) {
                        $m = (float)($r['monV'] ?? 0);
                        if ($m > 0) {
                            if ($bal >= $m) { $rowAAbsWP = $m; $bal -= $m; }
                            else            { $rowAAbsWP = $bal; $rowAWOP = $m - $bal; $bal = 0; }
                        }

                    } elseif ($C['isForce']) {
                        $d = (float)($r['forceAmount'] ?? 0);
                        if ($d > 0) {
                            if ($bal >= $d) { $rowAAbsWP = $d; $bal -= $d; }
                            else            { $rowAAbsWP = $bal; $rowAWOP = $d - $bal; $bal = 0; }
                        }

                    } elseif (!$C['isDis']) {
                        $days = self::calcDays($r);
                        if ($days > 0) {
                            if ($C['isPer'])               { $rowAWOP = $days; }
                            elseif ($C['isSetB_noDeduct']) { $rowBAbsWP = $days; }
                            elseif ($C['isSetA_noDeduct']) { $rowAAbsWP = $days; }
                            elseif ($C['isSick']) {
                                if ($bal >= $days) { $rowBAbsWP = $days; $bal -= $days; }
                                else               { $rowBAbsWP = $bal;  $rowBWOP = $days - $bal; $bal = 0; }
                            } elseif ($C['isVacation']) {
                                if ($bal >= $days) { $rowAAbsWP = $days; $bal -= $days; }
                                else               { $rowAAbsWP = $bal;  $rowAWOP = $days - $bal; $bal = 0; }
                            } elseif ($C['isTerminal']) {
                                if ($bal >= $days) { $rowAAbsWP = $days; $rowBAbsWP = $days; $bal -= $days; }
                                else               { $rowAAbsWP = $bal; $rowAWOP = $days - $bal; $rowBAbsWP = $bal; $rowBWOP = $days - $bal; $bal = 0; }
                            } else {
                                if ($bal >= $days) { $rowAAbsWP = $days; $bal -= $days; }
                                else               { $rowAAbsWP = $bal;  $rowAWOP = $days - $bal; $bal = 0; }
                            }
                        }
                    }

                    $showBalInSetB = ($C['isSick'] || $C['isSetB_noDeduct'] || $C['isTerminal'])
                        && !$C['isDis'] && !$C['isForceDis'] && !$C['isMon'] && !$C['isMD']
                        && !$C['isAcc'] && !((float)($r['earned'] ?? 0) > 0);

                    $updates[] = [
                        'record_id'    => $r['_record_id'],
                        'employee_id'  => $empId,
                        'setA_earned'  => round($rowAEarned, 3),
                        'setA_abs_wp'  => round($rowAAbsWP, 3),
                        'setA_balance' => $showBalInSetB ? 0 : round($bal, 3),
                        'setA_wop'     => round($rowAWOP, 3),
                        'setB_earned'  => 0,
                        'setB_abs_wp'  => round($rowBAbsWP, 3),
                        'setB_balance' => $showBalInSetB ? round($bal, 3) : 0,
                        'setB_wop'     => round($rowBWOP, 3),
                    ];
                }

            } else {
                // ── NON-TEACHING / TEACHING-RELATED: two running balances ──
                $bV = 0; $bS = 0;
                foreach ($seg['recs'] as $r) {
                    if (empty($r['_record_id'])) continue;
                    $C = self::classifyLeave($r['action'] ?? '');
                    $rowAEarned = 0; $rowAAbsWP = 0; $rowAWOP = 0;
                    $rowBEarned = 0; $rowBAbsWP = 0; $rowBWOP  = 0;

                    if ($C['isTransfer']) {
                        $rowAEarned = (float)($r['trV'] ?? 0);
                        $rowBEarned = (float)($r['trS'] ?? 0);
                        $bV += $rowAEarned; $bS += $rowBEarned;

                    } elseif ($C['isAcc']) {
                        $v = (float)($r['earned'] ?? $r['setA_earned'] ?? 0);
                        $rowAEarned = $v; $rowBEarned = $v;
                        $bV += $v; $bS += $v;

                    } elseif ((float)($r['earned'] ?? 0) > 0 && !$C['isMon'] && !$C['isPer'] && !$C['isDis'] && !$C['isForceDis'] && !$C['isMD']) {
                        $rowAEarned = (float)$r['earned'];
                        $rowBEarned = (float)$r['earned'];
                        $bV += $rowAEarned; $bS += $rowBEarned;

                    } elseif ($C['isMD']) {
                        $addV = (float)($r['monDV'] ?? 0);
                        $addS = (float)($r['monDS'] ?? 0);
                        if ($addV > 0) { $rowAEarned = $addV; $bV += $addV; }
                        if ($addS > 0) { $rowBEarned = $addS; $bS += $addS; }

                    } elseif ($C['isForceDis']) {
                        $d = (float)($r['forceAmount'] ?? 0);
                        if ($d > 0) { $rowAEarned = $d; $bV += $d; }

                    } elseif ($C['isMon']) {
                        $mV = (float)($r['monV'] ?? 0);
                        $mS = (float)($r['monS'] ?? 0);
                        if ($mV > 0) {
                            if ($bV >= $mV) { $rowAAbsWP = $mV; $bV -= $mV; }
                            else            { $rowAAbsWP = $bV; $rowAWOP = $mV - $bV; $bV = 0; }
                        }
                        if ($mS > 0) {
                            if ($bS >= $mS) { $rowBAbsWP = $mS; $bS -= $mS; }
                            else            { $rowBAbsWP = $bS; $rowBWOP = $mS - $bS; $bS = 0; }
                        }

                    } elseif ($C['isForce']) {
                        $d = (float)($r['forceAmount'] ?? 0);
                        if ($d > 0) {
                            if ($bV >= $d) { $rowAAbsWP = $d; $bV -= $d; }
                            else           { $rowAAbsWP = $bV; $rowAWOP = $d - $bV; $bV = 0; }
                        }

                    } elseif ($C['isDis']) {
                        // Disapproved Leave — no changes

                    } elseif ($C['isPer']) {
                        $d = self::calcDays($r); if ($d > 0) $rowAWOP = $d;

                    } elseif ($C['isVacation']) {
                        $d = self::calcDays($r);
                        if ($d > 0) {
                            if ($bV >= $d) { $rowAAbsWP = $d; $bV -= $d; }
                            else           { $rowAAbsWP = $bV; $rowAWOP = $d - $bV; $bV = 0; }
                        }

                    } elseif ($C['isSick']) {
                        $d = self::calcDays($r);
                        if ($d > 0) {
                            if ($bS >= $d) { $rowBAbsWP = $d; $bS -= $d; }
                            else           { $rowBAbsWP = $bS; $rowBWOP = $d - $bS; $bS = 0; }
                        }

                    } elseif ($C['isTerminal']) {
                        $d = self::calcDays($r);
                        if ($d > 0) {
                            if ($bV >= $d) { $rowAAbsWP = $d; $bV -= $d; } else { $rowAAbsWP = $bV; $rowAWOP = $d - $bV; $bV = 0; }
                            if ($bS >= $d) { $rowBAbsWP = $d; $bS -= $d; } else { $rowBAbsWP = $bS; $rowBWOP = $d - $bS; $bS = 0; }
                        }

                    } elseif ($C['isSetB_noDeduct']) {
                        $d = self::calcDays($r); if ($d > 0) $rowBAbsWP = $d;

                    } elseif ($C['isSetA_noDeduct']) {
                        $d = self::calcDays($r); if ($d > 0) $rowAAbsWP = $d;

                    } else {
                        $d = self::calcDays($r);
                        if ($d > 0) {
                            if ($bV >= $d) { $rowAAbsWP = $d; $bV -= $d; }
                            else           { $rowAAbsWP = $bV; $rowAWOP = $d - $bV; $bV = 0; }
                        }
                    }

                    $updates[] = [
                        'record_id'    => $r['_record_id'],
                        'employee_id'  => $empId,
                        'setA_earned'  => round($rowAEarned, 3),
                        'setA_abs_wp'  => round($rowAAbsWP, 3),
                        'setA_balance' => round($bV, 3),
                        'setA_wop'     => round($rowAWOP, 3),
                        'setB_earned'  => round($rowBEarned, 3),
                        'setB_abs_wp'  => round($rowBAbsWP, 3),
                        'setB_balance' => round($bS, 3),
                        'setB_wop'     => round($rowBWOP, 3),
                    ];
                }
            }
        }
        return $updates;
    }

    private static function isTransferAction(string $action): bool
    {
        $a = strtolower($action);
        return str_contains($a, 'credit entry') || str_contains($a, 'from denr');
    }

    // ── Validation ──────────────────────────────────────────────
    public static function validateEmployeeId(string $id): ?string
    {
        if (!preg_match('/^\d{7}$/', $id)) return 'Invalid Employee No. — must be exactly 7 numbers.';
        return null;
    }

    public static function validateDepedEmail(string $email): ?string
{
    if (!$email) return 'Email address is required.';
    if (!str_ends_with($email, '@deped.gov.ph')) return 'Email must use @deped.gov.ph domain.';
    $local = substr($email, 0, strrpos($email, '@'));
    if (!$local) return 'Email username is required.';
    if (!preg_match('/^[a-zA-Z0-9._+\-\xC0-\xFF]+$/u', $local)) {
        return 'Invalid email format.';
    }
    return null;
}

    public static function validateLeaveEntry(array $empRecords, array $newRec, int $editIdx, string $empStatus): ?string
    {
        $al   = strtolower($newRec['action'] ?? '');
        $from = $newRec['from'] ?? '';
        $year = $from ? (int)(new \DateTime($from))->format('Y') : null;
        if (!$year) return null;

        $existing = array_filter($empRecords, function($r, $i) use ($editIdx) {
            if (!empty($r['_conversion'])) return false;
            if ($editIdx >= 0 && $i === $editIdx) return false;
            return true;
        }, ARRAY_FILTER_USE_BOTH);

        $isForce = (str_contains($al, 'force') || str_contains($al, 'mandatory')) && !str_contains($al, 'disapproved');
        if ($isForce) {
            $forceDays = (float)($newRec['forceAmount'] ?? 0) > 0 ? (float)$newRec['forceAmount'] : self::calcDays($newRec);
            if ($forceDays > 5) return "⚠️ Force/Mandatory Leave cannot exceed 5 days per year. You entered {$forceDays} day(s).";
            $existingForce = array_filter($existing, function($r) use ($year) {
                $ra = strtolower($r['action'] ?? '');
                $ry = $r['from'] ? (int)(new \DateTime($r['from']))->format('Y') : null;
                return (str_contains($ra, 'force') || str_contains($ra, 'mandatory')) && !str_contains($ra, 'disapproved') && $ry === $year;
            });
            if (count($existingForce) > 0) return "⚠️ Force/Mandatory Leave is only allowed ONCE per year ({$year}). A Force Leave entry already exists.";
        }

        if (str_contains($al, 'magna carta') || str_contains($al, 'special leave benefit')) {
            $newDays = self::calcDays($newRec);
            $existingDays = array_sum(array_map(function($r) use ($year) {
                $ra = strtolower($r['action'] ?? '');
                $ry = $r['from'] ? (int)(new \DateTime($r['from']))->format('Y') : null;
                return (str_contains($ra, 'magna carta') || str_contains($ra, 'special leave benefit')) && $ry === $year ? self::calcDays($r) : 0;
            }, $existing));
            $total = $existingDays + $newDays;
            if ($total > 60) return "⚠️ Special Leave Benefits for Women (Magna Carta) cannot exceed 60 days per year. Total: {$total} day(s).";
        }

        if ((float)($newRec['earned'] ?? 0) > 0 && $empStatus === 'Non-Teaching') {
            $existingEarned = array_sum(array_map(function($r) use ($year) {
                $ry = ($r['from'] ?? '') ? (int)(new \DateTime($r['from']))->format('Y') : null;
                return ((float)($r['earned'] ?? 0) > 0 && $ry === $year) ? (float)$r['earned'] : 0;
            }, $existing));
            $totalEarned = $existingEarned + (float)$newRec['earned'];
            if ($totalEarned > 15) return "⚠️ Non-Teaching leave accrual cannot exceed 15 days per year. Total: " . number_format($totalEarned, 3) . " days.";
        }
        return null;
    }
}
