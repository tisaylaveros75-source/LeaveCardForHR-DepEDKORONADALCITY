/* ============================================================
   SDO Koronadal City — Leave Card System
   pdf-export.js  v4.0  — THIN SHIM
   
   This file now delegates entirely to print-download.js.
   Both Download PDF and Print use the same buildFullPage()
   pipeline so the output is always identical.

   REQUIREMENTS: print-download.js must be loaded BEFORE this file.
   ============================================================ */

'use strict';

/* ─────────────────────────────────────────────────────────────
   Aliases — keeps any old callers of pdfExportDownload /
   pdfExportPrint working without changes.
   ───────────────────────────────────────────────────────────── */
window.pdfExportDownload = function (emp) {
return window.lcPrint(emp);};

window.pdfExportPrint = function (emp) {
  return window.lcPrint(emp);
};

/* ─────────────────────────────────────────────────────────────
   Auto-wire data-pdf-export attributes
   (kept here so existing HTML markup still works)
   ───────────────────────────────────────────────────────────── */
document.addEventListener('click', function (e) {
  const target = e.target.closest('[data-pdf-export]');
  if (!target) return;
  e.stopImmediatePropagation();
  const action = target.dataset.pdfExport;
  if (action === 'download') window.lcDownloadPDF();
  else if (action === 'print') window.lcPrint();
}, true);