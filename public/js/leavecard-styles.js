/* ============================================================
   leavecard-styles.js — Injects all Leave Card CSS at runtime
   ============================================================ */
'use strict';

(function injectLeaveCardStyles() {
  if (document.getElementById('era-collapse-style')) return;
  const s = document.createElement('style');
  s.id = 'era-collapse-style';
  s.textContent = `

    /* ── Era wrapper ── */
    .era-wrapper {
      margin: 14px 0;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 16px rgba(0,0,0,0.12), 0 0 0 1px rgba(180,40,30,0.18);
    }
    .era-wrapper:first-child { margin-top: 4px; }
    .era-wrapper:last-child  { margin-bottom: 4px; }

    /* ── Era collapse animation ── */
    .era-collapse-body {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease;
      opacity: 0;
    }
    .era-collapse-body.era-collapse-open {
      max-height: 99999px;
      opacity: 1;
    }

    /* ── Era banner — conversion ── */
    .era-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 18px;
      height: 48px;
      cursor: pointer;
      user-select: none;
      position: relative;
      background: linear-gradient(135deg, #3d0a0a 0%, #6b1010 50%, #4a0c0c 100%);
      border-bottom: 2px solid rgba(192,57,43,0.4);
      transition: filter 0.18s;
      overflow: hidden;
    }
    .era-banner:hover { filter: brightness(1.12); }
    .era-banner-shine { display: none; }

    /* ── Era banner — initial era ── */
    .era-banner--first {
      background: linear-gradient(135deg, #1a0505 0%, #3d0a0a 100%);
      border-bottom: 2px solid rgba(139,26,26,0.35);
    }

    /* ── Era label ── */
    .era-label-wrap { display: flex; align-items: center; gap: 10px; flex: 1; }
    .era-icon-pill  { font-size: 15px; }
    .era-label-text {
      font-size: 12px; font-weight: 700; letter-spacing: 0.06em;
      text-transform: uppercase; color: #fdd8c8;
    }
    .era-from-badge {
      display: inline-block; font-size: 10px; font-weight: 700;
      padding: 2px 8px; border-radius: 4px;
      background: rgba(220,80,60,0.25); color: #fca5a5;
      border: 1px solid rgba(220,80,60,0.4);
    }
    .era-to-badge {
      display: inline-block; font-size: 10px; font-weight: 700;
      padding: 2px 8px; border-radius: 4px;
      background: rgba(39,174,96,0.22); color: #86efac;
      border: 1px solid rgba(39,174,96,0.4);
    }
    .era-arrow       { color: rgba(255,200,160,0.45); font-size: 12px; }
    .era-record-count {
      font-size: 10.5px; font-weight: 500; font-style: italic;
      color: rgba(255,200,160,0.45); margin-left: 4px;
    }

    /* ── Chevron ── */
    .era-chevron-wrap { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
    .era-chevron {
      display: inline-flex; align-items: center; justify-content: center;
      width: 24px; height: 24px; border-radius: 6px;
      background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.12);
      color: rgba(255,200,160,0.75); font-size: 10px;
      transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
      flex-shrink: 0;
    }
    .era-chevron.collapsed { transform: rotate(-90deg); }

    /* ── Remove Era button ── */
    .era-del-btn {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 5px 11px; font-size: 10px; font-weight: 700;
      border-radius: 6px; border: 1px solid rgba(220,80,60,0.45);
      background: rgba(139,0,0,0.35); color: #fca5a5;
      cursor: pointer; letter-spacing: 0.04em; text-transform: uppercase;
      transition: all 0.18s; white-space: nowrap;
    }
    .era-del-btn:hover {
      background: rgba(200,20,20,0.55);
      color: #ffe4e4;
    }

    /* ── Era error toast ── */
    .era-del-error {
      position: fixed; bottom: 24px; left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: #fff; border: 1px solid #fca5a5;
      border-left: 4px solid #dc2626; color: #991b1b;
      font-size: 12.5px; font-weight: 600;
      padding: 12px 20px; border-radius: 10px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
      z-index: 9999; opacity: 0;
      transition: opacity 0.25s, transform 0.25s;
      pointer-events: none; max-width: 420px; text-align: center;
    }
    .era-del-error.show { opacity: 1; transform: translateX(-50%) translateY(0); }

    /* ══════════════════════════════════════════════
       TABLE
    ══════════════════════════════════════════════ */
    .tw { width: 100%; overflow-x: auto; }
    .tw::-webkit-scrollbar { height: 5px; }
    .tw::-webkit-scrollbar-thumb { background: #c0392b; border-radius: 4px; }
    .tw::-webkit-scrollbar-track { background: #f5eded; }

    .tw table {
     table-layout: auto; width: 100%; border-collapse: collapse;
      background: #ffffff; border: 1px solid #c8a0a0;
    }

    /* ── THEAD ── */
   .tw table thead tr:first-child th {
      background: #ffffff !important;
      color: #000000 !important;
      border-bottom: 1px solid #000000;
    }
    .tw table thead tr:last-child th {
      background: #ffffff !important;
      color: #000000 !important;
      border-bottom: 2px solid #000000;
    }
    .tw table thead th {
      white-space: normal !important;
      word-break: break-word !important;
      line-height: 1.25 !important;
      font-size: 9px !important;
      font-weight: 800 !important;
      padding: 7px 4px !important;
      text-align: center !important;
      letter-spacing: 0.06em !important;
      border-right: 1px solid #c8a0a0 !important;
    }
.tw table thead th.tha {
      background: #ffffff !important;
      color: #000000 !important;
      border-bottom: 2px solid #000000 !important;
    }
    .tw table thead th.thb {
      background: #ffffff !important;
      color: #000000 !important;
      border-bottom: 2px solid #000000 !important;
    }
    .tw table thead th.ths {
      font-size: 8px !important;
      opacity: 0.9;
    }

    /* ── TBODY ── */
    .tw table tbody tr {
      background: #ffffff;
      border-bottom: 1px solid #f0dede;
      transition: background 0.12s;
    }
    .tw table tbody tr:nth-child(even) {
      background: #fdf8f8;
    }
    .tw table tbody tr:hover {
      background: #fff0ee !important;
    }
    .tw table tbody td {
      font-size: 12px;
      font-weight: 500;
      padding: 9px 5px;
      vertical-align: middle;
      text-align: center;
      color: #2a1010;
      border-right: 1px solid #c8a0a0;
    }

/* ── Balance column ── */
    .tw table tbody td.bc {
      font-weight: 800 !important;
      font-size: 12.5px !important;
      color: #7a5010 !important;
      background: #fffbee !important;
      border-left: 2px solid #b8900a !important;
      border-right: 2px solid #b8900a !important;
    }

    /* ── W/O Pay ── */
    .tw table tbody td.rdc {
      color: #000000 !important;
      font-weight: 800 !important;
      text-decoration: underline !important;
    }

    @media print {
      .tw table tbody td.bc {
        color: #000000 !important;
        background: #ffffff !important;
        border-left: 1px solid #000 !important;
        border-right: 1px solid #000 !important;
      }
      .tw table tbody td.rdc {
        color: #000000 !important;
        background: #ffffff !important;
      }
      /* ── Forward balance row ── */
    .era-fwd-row {
      background: #ffffff !important;
      border-top: 2px solid #000000 !important;
    }
    .era-fwd-row td {
      color: #000000 !important;
      font-weight: 700 !important;
      font-style: italic !important;
      border-color: #000000 !important;
    }
      .tw table thead th.tha {
        background: #ffffff !important;
        color: #000000 !important;
        border-bottom: 1px solid #000 !important;
      }
      .tw table thead th.thb {
        background: #ffffff !important;
        color: #000000 !important;
        border-bottom: 1px solid #000 !important;
      }
      .tw table thead tr:first-child th,
      .tw table thead tr:last-child th {
        background: #ffffff !important;
        color: #000000 !important;
      }
    }

    /* ── Number cells ── */
    .tw table tbody td.nc {
      color: #1a1a2e;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
    }

    /* ── Period cell ── */
    .tw table tbody td.period-cell,
    .tw table tbody td:nth-child(2) {
      text-align: left !important;
      padding-left: 8px !important;
      color: #3a1a1a !important;
      font-size: 12px !important;
      font-weight: 600 !important;
    }

    /* ── Remarks cell ── */
    .tw table tbody td.remarks-cell,
    .tw table tbody td:nth-child(11) {
      text-align: left !important;
      padding-left: 8px !important;
      color: #2a1a1a !important;
      font-size: 11.5px !important;
      font-weight: 600 !important;
      white-space: normal !important;
      word-break: break-word !important;
      line-height: 1.45 !important;
    }

    /* ── Forward balance row ── */
    .era-fwd-row {
      background: #fffbee !important;
      border-top: 2px solid #c8a040 !important;
    }
    .era-fwd-row td {
      color: #7a5010 !important;
      font-weight: 700 !important;
      font-style: italic !important;
      border-color: #e8d090 !important;
    }

/* ══════════════════════════════════════════════
       COLUMN WIDTHS — fixed layout, Set A = Set B
    ══════════════════════════════════════════════ */

    /* SO# */
    .tw table th:nth-child(1), .tw table td:nth-child(1) {
      width: 4%; white-space: nowrap; overflow: hidden;
    }

    /* Period */
    .tw table th:nth-child(2), .tw table td:nth-child(2) {
      width: 11%; white-space: normal; word-break: break-word;
    }

    /* Set A cols 3–6 AND Set B cols 7–10 — identical width = always symmetric */
    .tw table th:nth-child(3),  .tw table td:nth-child(3),
    .tw table th:nth-child(4),  .tw table td:nth-child(4),
    .tw table th:nth-child(5),  .tw table td:nth-child(5),
    .tw table th:nth-child(6),  .tw table td:nth-child(6),
    .tw table th:nth-child(7),  .tw table td:nth-child(7),
    .tw table th:nth-child(8),  .tw table td:nth-child(8),
    .tw table th:nth-child(9),  .tw table td:nth-child(9),
    .tw table th:nth-child(10), .tw table td:nth-child(10) {
      width: 5%; white-space: nowrap; overflow: hidden;
    }

    /* Remarks — gets all remaining space */
    .tw table th:nth-child(11), .tw table td:nth-child(11) {
      width: 38%; white-space: normal;
      word-break: break-word; line-height: 1.45;
    }

    /* Action ⋮ — truly tiny */
    .tw table th:nth-child(12), .tw table td:nth-child(12) {
      width: 3%; white-space: nowrap;
      padding: 2px 2px; text-align: center;
    }

    /* ══════════════════════════════════════════════
       ROW ACTION MENU
    ══════════════════════════════════════════════ */
    .row-menu-wrap { position: relative; display: inline-block; }
    .row-menu-btn {
      background: transparent !important;
      border: 1px solid transparent !important;
      border-radius: 6px; padding: 3px 7px;
      cursor: pointer; font-size: 16px; font-weight: 900;
      color: #c0a0a0 !important;
      transition: all 0.15s; line-height: 1;
    }
    .row-menu-btn:hover {
      background: #fce8e8 !important;
      border-color: #e8c0c0 !important;
      color: #8b1a1a !important;
    }
    .row-menu-dd { display: none; }

    /* ── Portal dropdown ── */
    #row-menu-portal {
      background: #ffffff;
      border: 1px solid #e8d0d0;
      border-top: 3px solid #8b1a1a;
      border-radius: 8px;
      box-shadow: 0 8px 28px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08);
      padding: 4px 0;
      min-width: 165px;
    }
    #row-menu-portal button {
      display: flex; align-items: center; gap: 8px;
      width: 100%; text-align: left;
      padding: 9px 14px; background: none; border: none;
      font-size: 12.5px; font-family: 'Inter', sans-serif;
      font-weight: 500; color: #2a1a1a;
      cursor: pointer; transition: background 0.1s;
    }
    #row-menu-portal button:hover { background: #fff0ee; color: #8b1a1a; }
    #row-menu-portal button.danger { color: #c0392b; }
    #row-menu-portal button.danger:hover { background: #fff5f5; }
    #row-menu-portal .menu-div { height: 1px; background: #f0e0e0; margin: 4px 0; }

  `;
  document.head.appendChild(s);
})();
