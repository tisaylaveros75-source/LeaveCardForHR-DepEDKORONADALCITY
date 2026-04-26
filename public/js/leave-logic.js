/* ============================================================
   SDO Koronadal City — Leave Card System
   leave-logic.js — Pure leave computation logic & utilities
   Load order in HTML:
     <script src="js/leave-logic.js"></script>
     <script src="js/leave-compute-teaching.js"></script>
     <script src="js/leave-compute-nonteaching.js"></script>
     <script src="js/leavecard.js"></script>
     <script src="js/personnel-list.js"></script>
     <script src="js/app.js"></script>
   ============================================================ */

'use strict';

// ── Date & Number Formatters ──────────────────────────────────

function fmtD(ds) {
  if (!ds) return '';
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(ds)) return ds;
  const d = new Date(ds + (ds.includes('T') ? '' : 'T00:00:00'));
  if (isNaN(d.getTime())) return ds;
  return String(d.getMonth()+1).padStart(2,'0') + '/' +
         String(d.getDate()).padStart(2,'0') + '/' +
         d.getFullYear();
}

function toISODate(s) {
  if (!s) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const [mm, dd, yyyy] = s.split('/');
  return `${yyyy}-${(mm||'').padStart(2,'0')}-${(dd||'').padStart(2,'0')}`;
}

function hz(n) { return (!n || n === 0) ? '' : (+n || 0).toString(); }
function h3(n) { const v = +n; return (v === 0) ? '' : v.toFixed(3).replace(/\.?0+$/, ''); }

function fmtDateInput(v) {
  let digits = v.replace(/\D/g, '');
  if (digits.length > 8) digits = digits.slice(0, 8);
  if (digits.length >= 5) return digits.slice(0,2) + '/' + digits.slice(2,4) + '/' + digits.slice(4);
  if (digits.length >= 3) return digits.slice(0,2) + '/' + digits.slice(2);
  return digits;
}

function currentMonthLabel() {
  return new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

// ── Leave Classification ──────────────────────────────────────

function classifyLeave(act) {
  const a = (act || '').toLowerCase();
  const isForceDis = (a.includes('force') || a.includes('mandatory')) && a.includes('disapproved');
  return {
    isAcc:           a.includes('monthly accrual') || a.includes('service credit'),
    isMon:           a.includes('monetization') && !a.includes('disapproved'),
    isMD:            a.includes('monetization') && a.includes('disapproved'),
    isForceDis,
    isDis:           a.includes('(disapproved)') && !(a.includes('monetization') && a.includes('disapproved')) && !isForceDis,
    isSick:          a.includes('sick'),
    isForce:         (a.includes('force') || a.includes('mandatory')) && !a.includes('disapproved'),
    isPer:           a.includes('personal'),
    isTransfer:      a.includes('credit entry') || a.includes('from denr'),
    isTerminal:      a.includes('terminal'),
    isSetB_noDeduct: a.includes('maternity') || a.includes('paternity'),
    isSetA_noDeduct: a.includes('solo parent') || a.includes('wellness') || a.includes('special privilege') ||
                     a.includes('spl') || a.includes('rehabilitation') || a.includes('study') ||
                     a.includes('magna carta') || a.includes('vawc') || a.includes('cto') || a.includes('compensatory'),
    isVacation:      a.includes('vacation') && !a.includes('(disapproved)'),
    isNoAction:      !a.trim(),
  };
}

// ── Days Calculator ───────────────────────────────────────────

function calcDays(r) {
  if (r.from && r.to) {
    const startHalf = r.fromPeriod === 'AM' || r.fromPeriod === 'PM';
    const endHalf   = r.toPeriod   === 'AM' || r.toPeriod   === 'PM';
    if (r.from === r.to && startHalf) {
      const d = new Date(r.from + 'T00:00:00');
      return (d.getDay() !== 0 && d.getDay() !== 6) ? 0.5 : 0;
    }
    let count = 0;
    const start = new Date(r.from + 'T00:00:00'), end = new Date(r.to + 'T00:00:00');
    if (end < start) return 0;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const day = d.getDay(); if (day !== 0 && day !== 6) count++;
    }
    if (startHalf) count -= 0.5;
    if (endHalf)   count -= 0.5;
    return Math.max(0, count);
  }
  return 0;
}

// ── Balance Computation — delegates to teaching/non-teaching modules ──

function computeRowBalanceUpdates(records, empId, empStatus) {
  // ── Split records into era segments ──
  const segments = [];
  let currentStatus = empStatus;

  // If there's a conversion marker, the FIRST era's status is fromStatus
  const firstConv = records.find(r => r && r._conversion);
  if (firstConv) currentStatus = firstConv.fromStatus || empStatus;

  let currentSeg = { eraStatus: currentStatus, recs: [] };

  for (const r of records) {
    if (!r) continue;
    if (r._conversion) {
      segments.push(currentSeg);
      currentSeg = { eraStatus: r.toStatus || empStatus, recs: [] };
    } else {
      currentSeg.recs.push(r);
    }
  }
  segments.push(currentSeg);

  // ── Process each segment using the appropriate module ──
  const updates = [];
  for (const seg of segments) {
    const isTeaching = (seg.eraStatus || '').toLowerCase() === 'teaching';
    const segUpdates = isTeaching
      ? computeTeachingSegment(seg.recs, empId)
      : computeNonTeachingSegment(seg.recs, empId);
    updates.push(...segUpdates);
  }

  return updates;
}

// ── Card Update Status ────────────────────────────────────────

function isCardUpdatedThisMonth(records, status, lastEditedAt) {
  if (!records || records.length === 0) return false;
  const now = new Date();
  const thisYear = now.getFullYear(), thisMon = now.getMonth() + 1;
  const lc = (status || '').toLowerCase();
  const isNTorTR = lc === 'non-teaching' || lc === 'teaching related';
  if (isNTorTR) {
    if (!lastEditedAt) return false;
    const d = new Date(lastEditedAt);
    return d.getFullYear() === thisYear && (d.getMonth()+1) === thisMon;
  }
  const thisMonStr = `${thisYear}-${String(thisMon).padStart(2,'0')}`;
  return records.some(r => {
    if (r._conversion) return false;
    const dateStr = r.from || r.to || '';
    if (!dateStr) return false;
    const d = new Date(dateStr + 'T00:00:00');
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    return key === thisMonStr;
  });
}

// ── Expose globally ───────────────────────────────────────────
window.fmtD                     = fmtD;
window.toISODate                = toISODate;
window.hz                       = hz;
window.h3                       = h3;
window.fmtDateInput             = fmtDateInput;
window.currentMonthLabel        = currentMonthLabel;
window.classifyLeave            = classifyLeave;
window.calcDays                 = calcDays;
window.computeRowBalanceUpdates = computeRowBalanceUpdates;
window.isCardUpdatedThisMonth   = isCardUpdatedThisMonth;