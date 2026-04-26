/* ============================================================
   SDO Koronadal City — Leave Card System
   leave-compute-nonteaching.js — Non-Teaching / Teaching-Related
                                   balance computation
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
 * Compute balance updates for one NON-TEACHING / TEACHING-RELATED era segment.
 * @param {Array}  recs   - leave records in this era (no conversion markers)
 * @param {string} empId  - employee_id
 * @returns {Array}       - array of update objects
 */
function computeNonTeachingSegment(recs, empId) {
  // Two separate running balances: bV = Set A (VL), bS = Set B (SL)
  let bV = 0, bS = 0;
  const updates = [];

  for (const r of recs) {
    if (!r._record_id) continue;

    const C = classifyLeave(r.action || '');
    let rAE = 0, rAA = 0, rAW = 0, rBE = 0, rBA = 0, rBW = 0;

    if (C.isNoAction) {
      // No nature of action — no changes

    } else if (C.isTransfer) {
      // Credit Entry — 2 textboxes: trV → Set A (VL), trS → Set B (SL)
      rAE = +(r.trV || 0); rBE = +(r.trS || 0);
      bV += rAE; bS += rBE;

    } else if (C.isAcc) {
      // Monthly Accrual — use whatever the user typed
      const v = +(r.earned || 0);
      rAE = v; rBE = v;
      bV += v; bS += v;

    } else if (+r.earned > 0 && !C.isMon && !C.isPer && !C.isDis && !C.isForceDis && !C.isMD) {
      // Any other positive earned value
      rAE = +r.earned; rBE = +r.earned;
      bV += rAE; bS += rBE;

    } else if (C.isMD) {
      // Monetization (Disapproved) — ADDS BACK to both Set A (VL) and Set B (SL)
      const addV = +(r.monDV || 0);
      const addS = +(r.monDS || 0);
      if (addV > 0) { rAE = addV; bV += addV; }
      if (addS > 0) { rBE = addS; bS += addS; }

    } else if (C.isForceDis) {
      // Force/Mandatory (Disapproved) — ADDS BACK to Set A (VL) balance only
      const d = +(r.forceAmount || 0);
      if (d > 0) { rAE = d; bV += d; }

    } else if (C.isMon) {
      // Monetization — DEDUCTS from Set A (VL) and Set B (SL) separately
      const mV = +(r.monV || 0);
      const mS = +(r.monS || 0);
      if (mV > 0) {
        if (bV >= mV) { rAA = mV; bV -= mV; }
        else          { rAA = bV; rAW = mV - bV; bV = 0; }
      }
      if (mS > 0) {
        if (bS >= mS) { rBA = mS; bS -= mS; }
        else          { rBA = bS; rBW = mS - bS; bS = 0; }
      }

    } else if (C.isForce) {
      // Force/Mandatory Leave — DEDUCTS from Set A (VL) ONLY
      const d = +(r.forceAmount || 0);
      if (d > 0) {
        if (bV >= d) { rAA = d; bV -= d; }
        else         { rAA = bV; rAW = d - bV; bV = 0; }
      }

    } else if (C.isDis) {
      // Disapproved Leave — no change to anything

    } else if (C.isPer) {
      const d = calcDays(r);
      if (d > 0) rAW = d;

    } else if (C.isVacation) {
      const d = calcDays(r);
      if (d > 0) {
        if (bV >= d) { rAA = d; bV -= d; }
        else         { rAA = bV; rAW = d - bV; bV = 0; }
      }

    } else if (C.isSick) {
      const d = calcDays(r);
      if (d > 0) {
        if (bS >= d) { rBA = d; bS -= d; }
        else         { rBA = bS; rBW = d - bS; bS = 0; }
      }

    } else if (C.isTerminal) {
      const d = calcDays(r);
      if (d > 0) {
        if (bV >= d) { rAA = d; bV -= d; } else { rAA = bV; rAW = d - bV; bV = 0; }
        if (bS >= d) { rBA = d; bS -= d; } else { rBA = bS; rBW = d - bS; bS = 0; }
      }

    } else if (C.isSetB_noDeduct) {
      const d = calcDays(r);
      if (d > 0) rBA = d;

    } else if (C.isSetA_noDeduct) {
      const d = calcDays(r);
      if (d > 0) rAA = d;

    } else {
      const d = calcDays(r);
      if (d > 0) {
        if (bV >= d) { rAA = d; bV -= d; }
        else         { rAA = bV; rAW = d - bV; bV = 0; }
      }
    }

    updates.push({
      record_id:    r._record_id,
      employee_id:  empId,
      setA_earned:  +rAE.toFixed(3),
      setA_abs_wp:  +rAA.toFixed(3),
      setA_balance: +bV.toFixed(3),
      setA_wop:     +rAW.toFixed(3),
      setB_earned:  +rBE.toFixed(3),
      setB_abs_wp:  +rBA.toFixed(3),
      setB_balance: +bS.toFixed(3),
      setB_wop:     +rBW.toFixed(3),
    });
  }

  return updates;
}

window.computeNonTeachingSegment = computeNonTeachingSegment;