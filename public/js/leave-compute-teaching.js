/* ============================================================
   SDO Koronadal City — Leave Card System
   leave-compute-teaching.js — Teaching balance computation
   Load order in HTML:
     <script src="js/leave-logic.js"></script>
     <script src="js/leave-compute-teaching.js"></script>
     <script src="js/leave-compute-nonteaching.js"></script>
     <script src="js/leavecard.js"></script>
     <script src="js/personnel-list.js"></script>
     <script src="js/app.js"></script>
   ============================================================ */

'use strict';

/**
 * Compute balance updates for one TEACHING era segment.
 * @param {Array}  recs   - leave records in this era (no conversion markers)
 * @param {string} empId  - employee_id
 * @returns {Array}       - array of update objects
 */
function computeTeachingSegment(recs, empId) {
  // Single running balance (bal). Set A columns show the VL-type activity.
  // Set B columns show sick/maternity/paternity activity only (no balance carried there).
  let bal = 0;
  const updates = [];

  for (const r of recs) {
    if (!r._record_id) continue;

    const C = classifyLeave(r.action || '');
    let rAE = 0, rAA = 0, rAW = 0, rBA = 0, rBW = 0;

    if (C.isNoAction) {
      // No nature of action — no changes

    } else if (C.isTransfer) {
      // Credit Entry — 1 textbox for teaching, adds to the single balance (Set A Earned)
      rAE = +(r.trV || 0);
      bal += rAE;

    } else if (C.isAcc) {
      // Monthly Accrual — use whatever the user typed
      rAE = +(r.earned || 0);
      bal += rAE;

    } else if (+r.earned > 0 && !C.isMon && !C.isPer && !C.isDis && !C.isForceDis && !C.isMD) {
      // Any other positive earned value
      rAE = +r.earned;
      bal += rAE;

    } else if (C.isMD) {
      // Monetization (Disapproved) — ADDS BACK to balance
      const ret = +(r.monDV || r.monDisAmt || 0);
      if (ret > 0) { bal += ret; rAE = ret; }

    } else if (C.isForceDis) {
      // Force/Mandatory (Disapproved) — ADDS BACK to Set A balance
      const d = +(r.forceAmount || 0);
      if (d > 0) { bal += d; rAE = d; }

    } else if (C.isMon) {
      // Monetization — DEDUCTS from teaching balance
      const m = +(r.monV || r.monAmount || 0);
      if (m > 0) {
        if (bal >= m) { rAA = m; bal -= m; }
        else          { rAA = bal; rAW = m - bal; bal = 0; }
      }

    } else if (C.isForce) {
      // Force/Mandatory Leave — DEDUCTS from Set A balance ONLY
      const d = +(r.forceAmount || 0);
      if (d > 0) {
        if (bal >= d) { rAA = d; bal -= d; }
        else          { rAA = bal; rAW = d - bal; bal = 0; }
      }

    } else if (!C.isDis) {
      const days = calcDays(r);
      if (days > 0) {
        if (C.isPer) {
          rAW = days;

        } else if (C.isSetB_noDeduct) {
          rBA = days;

        } else if (C.isSetA_noDeduct) {
          rAA = days;

        } else if (C.isSick) {
          if (bal >= days) { rBA = days; bal -= days; }
          else             { rBA = bal;  rBW = days - bal; bal = 0; }

        } else if (C.isVacation) {
          if (bal >= days) { rAA = days; bal -= days; }
          else             { rAA = bal;  rAW = days - bal; bal = 0; }

        } else if (C.isTerminal) {
          if (bal >= days) {
            rAA = days; rBA = days; bal -= days;
          } else {
            rAA = bal; rAW = days - bal;
            rBA = bal; rBW = days - bal;
            bal = 0;
          }

        } else {
          if (bal >= days) { rAA = days; bal -= days; }
          else             { rAA = bal;  rAW = days - bal; bal = 0; }
        }
      }
    }
    // C.isDis — Disapproved Leave: no changes

    const usesSetB = (C.isSick || C.isSetB_noDeduct || C.isTerminal) &&
                     !C.isDis && !C.isForceDis && !C.isMon && !C.isMD &&
                     !C.isAcc && !(+r.earned > 0);

    updates.push({
      record_id:    r._record_id,
      employee_id:  empId,
      setA_earned:  +rAE.toFixed(3),
      setA_abs_wp:  +rAA.toFixed(3),
      setA_balance: usesSetB ? 0 : +bal.toFixed(3),
      setA_wop:     +rAW.toFixed(3),
      setB_earned:  0,
      setB_abs_wp:  +rBA.toFixed(3),
      setB_balance: usesSetB ? +bal.toFixed(3) : 0,
      setB_wop:     +rBW.toFixed(3),
    });
  }

  return updates;
}

window.computeTeachingSegment = computeTeachingSegment;