/* ============================================================
   SDO Koronadal City — Leave Card System
   bulk-export.js  v1.0  — BULK PRINT & DOWNLOAD

   Handles "Print All Cards" and "Download All" buttons on the
   Leave Cards list page (.lc-btn-print / .lc-btn-dl).

   SAFE: Uses a completely separate class selector from the
   individual-card buttons (.lc-print-btn / .lc-dl-btn) in
   print-download.js — zero conflict guaranteed.

   DEPENDS ON: print-download.js loaded before this file.
   The following functions from print-download.js are reused:
     - getLogoBase64()
     - buildFullPage(emp, logoSrc)
     - flattenRecords(emp)
     - sliceIntoPages(flat)
     - buildPageHTML(pageNum, slice, emp, logoSrc, total)
     - renderPageToArrayBuffer(htmlStr)
     - mergePageBuffers(buffers)
     - showArmourOverlay() / setOverlayProgress() / hideArmourOverlay()
   ============================================================ */

'use strict';

/* ─────────────────────────────────────────────────────────
   HELPER — get the currently filtered employee list
   Reads employee IDs from the visible .lc-emp-row elements,
   then resolves each against state.db.
   Falls back to all of state.db if no rows found.
───────────────────────────────────────────────────────── */
function _bulkGetFilteredEmps() {
  const db = (window.state && window.state.db) || [];
  // Each employee row has data-empid set by app.js
  const rows = document.querySelectorAll('.lc-emp-row[data-empid]');
  if (rows.length > 0) {
    const ids = [...rows].map(r => r.dataset.empid);
    const filtered = ids.map(id => db.find(e => e.id === id)).filter(Boolean);
    if (filtered.length > 0) return filtered;
  }
  // Fallback: return all active employees
  return db.filter(e => (e.account_status || 'active') !== 'inactive');
}

/* ─────────────────────────────────────────────────────────
   HELPER — ensure an employee's records are loaded
───────────────────────────────────────────────────────── */
async function _ensureRecords(emp) {
  if (!emp.records || emp.records.length === 0) {
    try {
      const res = await apiCall('get_records', { employee_id: emp.id }, 'GET');
      if (res.ok) emp.records = res.records || [];
    } catch (e) {
      emp.records = [];
    }
  }
  if (typeof sortRecordsInPlace === 'function') sortRecordsInPlace(emp.records);
}

/* ─────────────────────────────────────────────────────────
   BULK PRINT ALL
   Builds one big HTML document with all leave cards
   back-to-back, then opens the print dialog.
───────────────────────────────────────────────────────── */
async function bulkPrintAll() {
  const emps = _bulkGetFilteredEmps();
  if (emps.length === 0) { alert('No employees to print.'); return; }

  const btn = document.querySelector('.lc-btn-print');
  const origHTML = btn ? btn.innerHTML : '';
  if (btn) { btn.disabled = true; btn.innerHTML = '⏳ Preparing…'; }

  try {
    const logoSrc = await getLogoBase64();

    // Load all records in parallel
    await Promise.all(emps.map(e => _ensureRecords(e)));

    // Build combined HTML — each leave card separated by a page break
    const cardsHtml = emps.map((emp, i) => {
      const cardBody = buildExportHTML(emp, logoSrc);
      const breakStyle = i < emps.length - 1
        ? 'page-break-after:always;'
        : '';
      return `<div style="${breakStyle}">${cardBody}</div>`;
    }).join('');

    const fullHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>${SHARED_CSS}
  @media print {
    *, *::before, *::after {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    @page { size: 8.5in 14in portrait; margin: 10mm 9mm 12mm 9mm; }
  }
</style>
</head>
<body>${cardsHtml}</body>
</html>`;

    // Write into a hidden iframe and print
    const old = document.getElementById('lc-bulk-print-iframe');
    if (old) old.remove();

    const iframe = document.createElement('iframe');
    iframe.id = 'lc-bulk-print-iframe';
    iframe.style.cssText = 'position:fixed;left:0;top:0;width:794px;height:100%;border:none;z-index:99999;visibility:hidden;pointer-events:none;';
    document.body.appendChild(iframe);

    await new Promise(resolve => {
      iframe.onload = () => {
        // Wait for all images inside the iframe to finish loading
        const images = [...iframe.contentDocument.images];
        if (images.length === 0) { setTimeout(resolve, 800); return; }
        let loaded = 0;
        const done = () => { if (++loaded >= images.length) setTimeout(resolve, 600); };
        images.forEach(img => {
          if (img.complete) done();
          else { img.onload = done; img.onerror = done; }
        });
        // Safety fallback — never wait more than 4 seconds
        setTimeout(resolve, 4000);
      };
      iframe.contentDocument.open();
      iframe.contentDocument.write(fullHtml);
      iframe.contentDocument.close();
    });

    iframe.contentWindow.focus();
    iframe.contentWindow.print();

    const cleanup = () => {
      try { iframe.remove(); } catch (_) {}
    };
    iframe.contentWindow.addEventListener('afterprint', cleanup, { once: true });
    setTimeout(cleanup, 2000);

  } catch (err) {
    console.error('[bulk-export] Print error:', err);
    alert('Bulk print failed: ' + err.message);
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = origHTML; }
  }
}

/* ─────────────────────────────────────────────────────────
   BULK DOWNLOAD ALL
   Generates a PDF for each employee, merges them all into
   one file, and triggers a download.
───────────────────────────────────────────────────────── */
async function bulkDownloadAll() {
  if (typeof html2pdf === 'undefined') {
    alert('html2pdf is not loaded. Add the html2pdf CDN script to your page.');
    return;
  }

  const emps = _bulkGetFilteredEmps();
  if (emps.length === 0) { alert('No employees to download.'); return; }

  const btn = document.querySelector('.lc-btn-dl');
  const origHTML = btn ? btn.innerHTML : '';
  const origWidth = btn ? btn.style.width : '';
  if (btn) {
    btn.disabled = true;
    btn.style.width = btn.offsetWidth + 'px';
    btn.innerHTML = '🛡 &nbsp;Forging PDFs…';
    btn.style.opacity = '0.7';
  }

  showArmourOverlay();
  setOverlayProgress(2, 'Loading employee records…', 0);

  try {
    const logoSrc = await getLogoBase64();
    setOverlayProgress(8, 'Records loaded — starting render…', 0);

    // Load all records
    await Promise.all(emps.map(e => _ensureRecords(e)));

    const allBuffers = [];
    let empIdx = 0;

    for (const emp of emps) {
      empIdx++;
      const empLabel = `${(emp.surname || '').toUpperCase()}, ${(emp.given || '').toUpperCase()}`;

      // Flatten + paginate this employee's records
      const flat       = flattenRecords(emp);
      const pageSlices = sliceIntoPages(flat);
      const totalPages = pageSlices.length;

      for (let pi = 0; pi < pageSlices.length; pi++) {
        const overallProgress = 10 + Math.round(
          ((empIdx - 1 + (pi + 1) / totalPages) / emps.length) * 78
        );
        setOverlayProgress(
          overallProgress,
          `${empLabel} — page ${pi + 1}/${totalPages} (${empIdx}/${emps.length})`,
          1
        );

        const html = buildPageHTML(pi, pageSlices[pi], emp, logoSrc, totalPages);
        const buf  = await renderPageToArrayBuffer(html);
        allBuffers.push(buf);
      }
    }

    setOverlayProgress(90, 'Welding all pages together…', 2);
    const merged = await mergePageBuffers(allBuffers);

    setOverlayProgress(97, 'Sealing the document…', 3);
    const filename = `LeaveCards_All_${new Date().toISOString().slice(0,10)}.pdf`;
    const blob = new Blob([merged], { type: 'application/pdf' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 3000);

    setOverlayProgress(100, `Done! ${emps.length} leave card${emps.length > 1 ? 's' : ''} downloaded.`, 3);
    await new Promise(r => setTimeout(r, 900));

  } catch (err) {
    console.error('[bulk-export] Download error:', err);
    alert('Bulk download failed: ' + err.message);
  } finally {
    hideArmourOverlay();
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = origHTML;
      btn.style.width = origWidth || '';
      btn.style.opacity = '';
    }
  }
}

/* ─────────────────────────────────────────────────────────
   WIRE BUTTONS
   Uses event delegation on document so it works even if
   the buttons are injected dynamically by app.js.
   Captures on the bubble phase AFTER print-download.js
   (which uses capture phase) — no conflicts.
───────────────────────────────────────────────────────── */
document.addEventListener('click', function (e) {
  // Only fire on the list-page export buttons, not individual card buttons
  const printBtn = e.target.closest('.lc-btn-print');
  const dlBtn    = e.target.closest('.lc-btn-dl');

  if (printBtn) {
    e.preventDefault();
    e.stopPropagation();
    bulkPrintAll();
    return;
  }
  if (dlBtn) {
    e.preventDefault();
    e.stopPropagation();
    bulkDownloadAll();
  }
});

window.bulkPrintAll    = bulkPrintAll;
window.bulkDownloadAll = bulkDownloadAll;