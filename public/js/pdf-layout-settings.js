/* ============================================================
   PDF LAYOUT SETTINGS — print-download.js
   Easy reference for column widths and text sizes.

   HOW TO USE:
   Copy any value you want to change, then find it in
   print-download.js Section 12 (EXPORT_INLINE_CSS) and
   replace it with your new value.
   ============================================================ */


/* ──────────────────────────────────────────────────────────
   COLUMN WIDTHS
   Total must add up to ~100%
   ──────────────────────────────────────────────────────────

   Col 1  = SO #           → currently  5%
   Col 2  = PERIOD         → currently 13%
   Col 3  = Set A EARNED   → currently  5.5%
   Col 4  = Set A ABS W/P  → currently  5.5%
   Col 5  = Set A BALANCE  → currently  5.5%
   Col 6  = Set A W/O P    → currently  5.5%
   Col 7  = Set B EARNED   → currently  5.5%
   Col 8  = Set B ABS W/P  → currently  5.5%
   Col 9  = Set B BALANCE  → currently  5.5%
   Col 10 = Set B W/O P    → currently  5.5%
   Col 11 = REMARKS        → currently 35%
                                        ────
                             TOTAL =   ~96%

   To change: find this block in Section 12 and edit the % values:

   table th:nth-child(1),  table td:nth-child(1)  { width:  5%;   }
   table th:nth-child(2),  table td:nth-child(2)  { width: 13%;   }
   table th:nth-child(3),  table td:nth-child(3),
   table th:nth-child(4),  table td:nth-child(4),
   table th:nth-child(5),  table td:nth-child(5),
   table th:nth-child(6),  table td:nth-child(6),
   table th:nth-child(7),  table td:nth-child(7),
   table th:nth-child(8),  table td:nth-child(8),
   table th:nth-child(9),  table td:nth-child(9),
   table th:nth-child(10), table td:nth-child(10) { width:  5.5%; }
   table th:nth-child(11), table td:nth-child(11) { width: 35%; text-align: left; padding-left: 6px; }

   TIPS:
   - If REMARKS text is still getting cut off → increase Col 11, decrease Col 2
   - If PERIOD dates are getting cut off → increase Col 2, decrease Col 11
   - If numbers look too cramped → increase cols 3-10 and decrease Col 11
   ────────────────────────────────────────────────────────── */


/* ──────────────────────────────────────────────────────────
   TEXT SIZES
   ──────────────────────────────────────────────────────────

   WHERE TO FIND EACH ONE in Section 12:

   1. Table header row 1 (big colored headers: "STUDY / VACATION…")
      Look for: thead tr:first-child th { font-size: 6.5pt; }
      Currently: 6.5pt

   2. Table header row 2 (sub-headers: "EARNED", "ABS W/P"…)
      Look for: thead tr:nth-child(2) th { font-size: 6pt; }
      Currently: 6pt

   3. Table body cells (all data rows)
      Look for: tbody td { font-size: 8pt; }
      Currently: 8pt

   4. Period column text (dates like "Apr 1, 2026")
      Look for: .period-cell { font-size: 7.5pt; }
      Currently: 7.5pt

   5. Remarks column text
      Look for: .remarks-cell { font-size: 7.5pt; }
      Currently: 7.5pt

   6. Profile field LABELS (e.g. "SURNAME", "DATE OF BIRTH")
      Look for: .lc-pf-label { font-size: 6.5pt; }
      Currently: 6.5pt

   7. Profile field VALUES (e.g. "ANDAYA", "Jun 15, 2004")
      Look for: .lc-pf-value { font-size: 10pt; }
      Currently: 10pt

   8. Letterhead agency name ("SDO City of Koronadal — Region XII")
      Look for: .lc-letterhead-agency { font-size: 14pt; }
      Currently: 14pt

   9. Doc banner title ("NON-TEACHING PERSONNEL LEAVE RECORD")
      Look for: .lc-doc-banner-title { font-size: 11pt; }
      Currently: 11pt

   TIPS:
   - Recommended range for table body: 7pt–9pt
   - Going below 6pt makes text hard to read when printed
   - Profile values at 10pt looks good; 9pt if you need to fit more
   ────────────────────────────────────────────────────────── */


/* ──────────────────────────────────────────────────────────
   PAGE SIZE & MARGINS (Section 1 — LEGAL_PDF_OPTIONS)
   ──────────────────────────────────────────────────────────

   margin: [top, right, bottom, left]  ← in millimeters
   Currently: [10, 9, 12, 9]

   Page format (jsPDF):
   [215.9, 355.6] = 8.5in × 14in (Legal)

   To switch to A4: change to [210, 297]
   To switch to Letter: change to [215.9, 279.4]
   ────────────────────────────────────────────────────────── */