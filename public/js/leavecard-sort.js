/*
  WHAT THIS FILE DOES:
  This file is responsible for arranging (sorting) leave records in the correct order.

  THE RULES IT FOLLOWS:
  1. Records with dates are sorted from earliest to latest.
  2. Records WITHOUT a date act as "barriers" — they stay in place and
     do not get crossed over by dated records.
  3. A new undated record always goes AFTER all existing records.
  4. A new dated record slots into its correct date position, BUT
     it will not jump past an undated barrier that was already there.

  EXAMPLE:
    Existing: [12/01, 12/02, (no date), 12/03]
    Add 12/01/2026 → [12/01 NEW, 12/01, 12/02, (no date), 12/03]
    Add (no date)  → [12/01, 12/02, (no date), 12/03, (no date) NEW]
    Add 12/04/2026 → [..., (no date), 12/03, 12/04 NEW]

  KEY FUNCTIONS:
  - getRecordSortKey()         → figures out the date of a record (from date fields or typed text)
  - parseDateToMs()            → converts a date string into a number so dates can be compared
  - sortSegmentWithBoundaries() → does the actual sorting with the barrier logic above
  - sortRecordsInPlace()       → sorts all records, but skips over "era conversion" markers
*/
'use strict';

// ── Parse a record's effective date as milliseconds (for sorting) ─────
// Priority: from_date → date found in prd text → to_date
// Returns Infinity when no date is present (undated record).
function getRecordSortKey(r) {
  // Try from_date first (skip empty strings)
  if (r.from && r.from.trim()) {
    const d = parseDateToMs(r.from.trim());
    if (d !== null) return d;
  }

  // Try prd — extract the EARLIEST date found in the text
  if (r.prd && r.prd.trim()) {
    const prd = r.prd.trim();
    let earliest = null;

    // ISO dates: yyyy-mm-dd
    const isoMatches = [...prd.matchAll(/(\d{4}-\d{2}-\d{2})/g)];
    for (const m of isoMatches) {
      const d = parseDateToMs(m[1]);
      if (d !== null && (earliest === null || d < earliest)) earliest = d;
    }

    // US dates: mm/dd/yyyy or m/d/yyyy
    const mdyMatches = [...prd.matchAll(/(\d{1,2})\/(\d{1,2})\/(\d{4})/g)];
    for (const m of mdyMatches) {
      const d = parseDateToMs(
        `${m[3]}-${m[1].padStart(2,'0')}-${m[2].padStart(2,'0')}`
      );
      if (d !== null && (earliest === null || d < earliest)) earliest = d;
    }

    // yyyy only (like "2023" or "2004") — only if nothing else matched
    if (earliest === null && /^\d{4}$/.test(prd)) {
      const d = new Date(`${prd}-01-01T00:00:00`).getTime();
      if (!isNaN(d)) earliest = d;
    }

    if (earliest !== null) return earliest;
  }

  // Try to_date last (skip empty strings)
  if (r.to && r.to.trim()) {
    const d = parseDateToMs(r.to.trim());
    if (d !== null) return d;
  }

  return Infinity; // undated — acts as a barrier
}

// ── Parse ISO (yyyy-mm-dd) or US (mm/dd/yyyy) date string to ms ───────
function parseDateToMs(s) {
  if (!s) return null;
  s = s.trim();

  // yyyy-mm-dd (database format)
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const ms = new Date(s + 'T00:00:00').getTime();
    return isNaN(ms) ? null : ms;
  }

  // mm/dd/yyyy or m/d/yyyy (manually typed)
  const mdy = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (mdy) {
    const ms = new Date(
      `${mdy[3]}-${mdy[1].padStart(2,'0')}-${mdy[2].padStart(2,'0')}T00:00:00`
    ).getTime();
    return isNaN(ms) ? null : ms;
  }

  // yyyy only (like "2023" typed in period field)
  if (/^\d{4}$/.test(s)) {
    return new Date(`${s}-01-01T00:00:00`).getTime();
  }

  return null;
}

// ── Sort one era segment (no conversion markers inside) ───────────────
// Uses the boundary algorithm described at the top of this file.
function sortSegmentWithBoundaries(recs) {
  if (recs.length <= 1) return [...recs];

  const dated   = []; // { rec, date (ms), id (record_id) }
  const undated = []; // raw record objects

  for (const r of recs) {
    const key = getRecordSortKey(r);
    if (key === Infinity) {
      undated.push(r);
    } else {
      dated.push({ rec: r, date: key, id: r._record_id || 0 });
    }
  }

  // Dated entries sorted chronologically (ties: earlier record_id first)
  dated.sort((a, b) => a.date - b.date || a.id - b.id);

  if (undated.length === 0) return dated.map(d => d.rec);

  // Undated sorted by record_id (insertion order)
  const undatedByInsert = [...undated].sort(
    (a, b) => (a._record_id || 0) - (b._record_id || 0)
  );

  // Compute boundary for each undated entry:
  //   B(U) = max date of dated entries with record_id < U.record_id
  //          (-Infinity when U was inserted before any dated entry)
  const barriers = undatedByInsert.map(u => {
    const uid = u._record_id || 0;
    let boundary = -Infinity;
    for (const d of dated) {
      if (d.id < uid) boundary = Math.max(boundary, d.date);
    }
    return { boundary, rec: u, id: uid };
  });

  // Sort barriers: smaller boundary first; ties broken by record_id
  barriers.sort((a, b) => a.boundary - b.boundary || a.id - b.id);

  // Merge dated stream with barriers
  const result = [];
  let di = 0;

  for (const barrier of barriers) {
    // Flush dated entries whose date ≤ this barrier's boundary
    while (di < dated.length && dated[di].date <= barrier.boundary) {
      result.push(dated[di++].rec);
    }
    result.push(barrier.rec);
  }
  // Remaining dated entries (date > last barrier's boundary)
  while (di < dated.length) result.push(dated[di++].rec);

  return result;
}

// ── Sort all records in-place, skipping conversion markers ───────────
// Conversion markers divide records into era segments; each segment is
// sorted independently with sortSegmentWithBoundaries.
function sortRecordsInPlace(records) {
  const segments   = [];
  let segRecs      = [];
  let segPositions = [];

  for (let i = 0; i < records.length; i++) {
    if (records[i] && records[i]._conversion) {
      segments.push({ positions: segPositions, recs: segRecs });
      segRecs      = [];
      segPositions = [];
    } else {
      segRecs.push(records[i]);
      segPositions.push(i);
    }
  }
  segments.push({ positions: segPositions, recs: segRecs });

  for (const seg of segments) {
    if (seg.recs.length === 0) continue;
    const sorted = sortSegmentWithBoundaries(seg.recs);
    for (let i = 0; i < seg.positions.length; i++) {
      records[seg.positions[i]] = sorted[i];
    }
  }
}