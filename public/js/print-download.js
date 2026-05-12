/* ============================================================
   SDO Koronadal City — Leave Card System
   print-download.js  v8.1  — RED ARMOUR REFORGED (FIXED)

   FIXES v8.1:
   • Canvas 0×0 crash fixed — images fully awaited before html2canvas
   • window.expose block moved OUT of renderPageToArrayBuffer closure
   • settle time increased to 500ms for safer font/layout rendering
   ============================================================ */

'use strict';

/* ─────────────────────────────────────────────────────────────
   0.  HELPERS
   ───────────────────────────────────────────────────────────── */
function esc(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
function eu(s) {
  if (!s) return '';
  return esc(String(s).toUpperCase());
}

/* ─────────────────────────────────────────────────────────────
   1.  PAGE LAYOUT CONSTANTS
   ───────────────────────────────────────────────────────────── */
const PDF_ROWS_PAGE1 = 16;
const PDF_ROWS_PAGEN = 33;
const PAGE_W_MM = 215.9;
const PAGE_H_MM = 355.6;

/* ─────────────────────────────────────────────────────────────
   2.  RESOLVE CURRENT EMPLOYEE
   ───────────────────────────────────────────────────────────── */
function resolveCurrentEmp() {
  if (!window.state || !window.state.db) return null;
  return window.state.db.find(e => e.id === window.state.curId) || null;
}

/* ─────────────────────────────────────────────────────────────
   3.  LOGO — load as base64
   ───────────────────────────────────────────────────────────── */
let _logoBase64 = null;
async function getLogoBase64() {
  if (_logoBase64) return _logoBase64;
  try {
    const res  = await fetch('/img/sdo.jpg');
    if (!res.ok) throw new Error('Logo fetch failed');
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = () => { _logoBase64 = reader.result; resolve(reader.result); };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch { return ''; }
}

/* ─────────────────────────────────────────────────────────────
   4.  NUMBER FORMATTER
   ───────────────────────────────────────────────────────────── */
function fmtNum(v) {
  if (!v && v !== 0) return '';
  const n = +v;
  if (isNaN(n) || n === 0) return '';
  if (n % 1 === 0) return String(n);
  return parseFloat(n.toFixed(3)).toString();
}

/* ─────────────────────────────────────────────────────────────
   5.  DATE FORMATTER
   ───────────────────────────────────────────────────────────── */
function fmtDateEx(raw) {
  if (!raw) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw.trim())) {
    const [y, m, d] = raw.trim().split('-');
    return `${m}/${d}/${y}`;
  }
  return raw;
}

/* ─────────────────────────────────────────────────────────────
   6.  TABLE HEADER HTML
   ───────────────────────────────────────────────────────────── */
function buildTableHeader() {
  return `
    <colgroup>
      <col style="width:5%"/>
      <col style="width:16%"/>
      <col style="width:5%"/>
      <col style="width:5%"/>
      <col style="width:5%"/>
      <col style="width:5%"/>
      <col style="width:5%"/>
      <col style="width:5%"/>
      <col style="width:5%"/>
      <col style="width:5%"/>
      <col style="width:34%"/>
    </colgroup>
    <thead>
      <tr>
        <th rowspan="2">SO #</th>
        <th rowspan="2">PERIOD</th>
        <th class="tha" colspan="4">STUDY / VACATION / FORCE PERSONAL / SPECIAL LEAVE</th>
        <th class="thb" colspan="4">SICK / MATERNITY / PATERNITY LEAVE</th>
        <th rowspan="2" style="text-align:left;padding-left:6px;">REMARKS / TYPE OF LEAVE</th>
      </tr>
      <tr>
        <th class="ths tha">EARNED</th>
        <th class="ths tha">ABS W/P</th>
        <th class="ths tha">BALANCE</th>
        <th class="ths tha">W/O P</th>
        <th class="ths thb">EARNED</th>
        <th class="ths thb">ABS W/P</th>
        <th class="ths thb">BALANCE</th>
        <th class="ths thb">W/O P</th>
      </tr>
    </thead>`;
}

/* ─────────────────────────────────────────────────────────────
   7.  PERIOD CELL
   ───────────────────────────────────────────────────────────── */
function buildPeriodCell(r) {
  const fromStr = fmtDateEx(r.from || '');
  const toStr   = fmtDateEx(r.to   || '');
  const fpTag   = (r.fromPeriod === 'AM' || r.fromPeriod === 'PM')
    ? ` <span class="ampm-tag">(${r.fromPeriod})</span>` : '';
  const tpTag   = (r.toPeriod === 'AM' || r.toPeriod === 'PM')
    ? ` <span class="ampm-tag">(${r.toPeriod})</span>` : '';

  function normPrd(p) {
    if (!p) return '';
    p = p.trim();
    if (/^\d{4}$/.test(p)) return p;
    if (/^\d{4}-\d{2}-\d{2}$/.test(p)) {
      const [y, m, d] = p.split('-');
      return `${m}/${d}/${y}`;
    }
    return p.toUpperCase();
  }

  let html = '';
  if (r.prd) html += `<span class="date-range">${esc(normPrd(r.prd))}</span>`;
  if (fromStr && toStr && fromStr !== toStr) {
    html += `<span class="date-range">${esc(fromStr)}${fpTag} &ndash; ${esc(toStr)}${tpTag}</span>`;
  } else if (fromStr) {
    html += `<span class="date-range">${esc(fromStr)}${fpTag}</span>`;
  }
  return html;
}

/* ─────────────────────────────────────────────────────────────
   8.  BUILD ONE DATA ROW
   ───────────────────────────────────────────────────────────── */
function buildTableRow(r) {
  const ae = fmtNum(r.setA_earned  || 0), aa = fmtNum(r.setA_abs_wp  || 0);
  const ab = fmtNum(r.setA_balance || 0), aw = fmtNum(r.setA_wop     || 0);
  const be = fmtNum(r.setB_earned  || 0), ba = fmtNum(r.setB_abs_wp  || 0);
  const bb = fmtNum(r.setB_balance || 0), bw = fmtNum(r.setB_wop     || 0);
  const remarksTxt = [
    (r.action || '').toUpperCase(),
    r.spec ? `(${String(r.spec).toUpperCase()})` : '',
  ].filter(Boolean).join(' ');
  return `
    <tr class="data-row">
      <td class="nc so-cell">${esc(r.so || '')}</td>
      <td class="period-cell">${buildPeriodCell(r)}</td>
      <td class="nc num-cell">${ae}</td>
      <td class="nc num-cell">${aa}</td>
      <td class="bc num-cell">${ab}</td>
      <td class="nc num-cell${aw ? ' rdc' : ''}">${aw}</td>
      <td class="nc num-cell">${be}</td>
      <td class="nc num-cell">${ba}</td>
      <td class="bc num-cell">${bb}</td>
      <td class="nc num-cell${bw ? ' rdc' : ''}">${bw}</td>
      <td class="remarks-cell">${esc(remarksTxt)}</td>
    </tr>`;
}

/* ─────────────────────────────────────────────────────────────
   9.  FORWARD-BALANCE ROW
   ───────────────────────────────────────────────────────────── */
function buildFwdRow(conv) {
  const bv = fmtNum(conv.fwdBV || 0);
  const bs = fmtNum(conv.fwdBS || 0);
  const fromLbl = (conv.fromStatus || '').toUpperCase();
  const toLbl   = (conv.toStatus   || '').toUpperCase();
  const convLabel = fromLbl && toLbl
    ? `&#8618; CARRIED OVER FROM ${fromLbl} TO ${toLbl}`
    : fromLbl
      ? `&#8618; CARRIED OVER FROM ${fromLbl}`
      : `&#8618; CARRIED OVER BALANCE`;
  return `
    <tr class="era-fwd-row">
      <td colspan="2" class="fwd-label-cell">${convLabel}</td>
      <td class="fwd-num-cell"></td>
      <td class="fwd-num-cell"></td>
      <td class="bc fwd-num-cell">${bv}</td>
      <td class="fwd-num-cell"></td>
      <td class="fwd-num-cell"></td>
      <td class="fwd-num-cell"></td>
      <td class="bc fwd-num-cell">${bs}</td>
      <td class="fwd-num-cell"></td>
      <td class="remarks-cell fwd-remarks-cell"></td>
    </tr>`;
}

/* ─────────────────────────────────────────────────────────────
   10.  FLATTEN ALL RECORDS
   ───────────────────────────────────────────────────────────── */
function flattenRecords(emp) {
  const records = emp.records || [];
  const flat = [];
  let eraIdx = 0;
  let cur = { conv: null, recs: [] };

  function pushSeg(seg, isFirst) {
    if (!isFirst && seg.conv) {
      flat.push({ type: 'fwd', payload: seg.conv, eraIdx, isFirstEra: isFirst });
    }
    seg.recs.forEach(r => {
      flat.push({ type: 'data', payload: r, eraIdx, isFirstEra: isFirst });
    });
    eraIdx++;
  }

  for (const r of records) {
    if (r._conversion) { pushSeg(cur, eraIdx === 0); cur = { conv: r, recs: [] }; }
    else cur.recs.push(r);
  }
  pushSeg(cur, eraIdx === 0);
  return flat;
}

function flattenByEra(emp) {
  const records = emp.records || [];
  const eras = [];
  let cur = { conv: null, recs: [] };
  for (const r of records) {
    if (r._conversion) { eras.push(cur); cur = { conv: r, recs: [] }; }
    else cur.recs.push(r);
  }
  eras.push(cur);
  return eras.map((seg, si) => {
    const flat = [];
    if (si > 0 && seg.conv) flat.push({ type: 'fwd', payload: seg.conv });
    seg.recs.forEach(r => flat.push({ type: 'data', payload: r }));
    return {
      conv: seg.conv,
      isFirst: si === 0,
      flat,
      label: seg.conv
        ? `${(seg.conv.fromStatus || '').toUpperCase()} → ${(seg.conv.toStatus || '').toUpperCase()}`
        : null,
    };
  });
}

/* ─────────────────────────────────────────────────────────────
   11.  BUILD TABLE BODY from flat slice
   ───────────────────────────────────────────────────────────── */
function buildTableBody(flatSlice) {
  if (flatSlice.length === 0) {
    return `<tr class="data-row"><td colspan="11" class="empty-row-cell">NO RECORDS IN THIS ERA.</td></tr>`;
  }
  return flatSlice.map(item => {
    if (item.type === 'fwd') return buildFwdRow(item.payload);
    return buildTableRow(item.payload);
  }).join('');
}

/* ─────────────────────────────────────────────────────────────
   11b.  PROFILE FIELD HELPER
   ───────────────────────────────────────────────────────────── */
function pf(lbl, val) {
  return `
    <div class="lc-pf">
      <div class="lc-pf-label">${esc(lbl)}</div>
      <div class="lc-pf-value">${eu(val) || '&mdash;'}</div>
    </div>`;
}

/* ─────────────────────────────────────────────────────────────
   12.  BUILD LETTERHEAD + PROFILE CARD HTML
   ───────────────────────────────────────────────────────────── */
function buildPersonnelTableRows(emp) {
  const rows = emp.personnelRecords || [];
  const MIN_ROWS = 5;
  const blanksNeeded = Math.max(0, MIN_ROWS - rows.length);
  const displayRows = [
    ...rows.map(r => r),
    ...Array(blanksNeeded).fill(null),
  ];
  return displayRows.map(r => `
    <tr>
      <td style="height:22px;">${r ? esc(r.effectiveDate || '') : ''}</td>
      <td>${r ? esc(r.designation || '') : ''}</td>
      <td>${r ? esc(r.statusReg || '') : ''}</td>
      <td>${r ? esc(r.salary || '') : ''}</td>
      <td>${r ? esc(r.station || '') : ''}</td>
      <td>${r ? esc(r.sourceOfFund || '') : ''}</td>
      <td>${r ? esc(r.lastPromotion || '') : ''}</td>
      <td>${r ? esc(r.remarks || '') : ''}</td>
    </tr>`).join('');
}

function buildHeaderSection(emp, logoSrc) {
  const records = emp.records || [];
  const lastConv = [...records].reverse().find(r => r._conversion);
  const currentEraStatus = (lastConv ? lastConv.toStatus : emp.status) || '';
  const categoryLabel = currentEraStatus
    ? `&#9632; ${currentEraStatus.toUpperCase()} PERSONNEL LEAVE RECORD`
    : '&#9632; NON-TEACHING PERSONNEL LEAVE RECORD';

  const logoImgLetterhead = logoSrc
    ? `<img class="lc-letterhead-logo" src="${logoSrc}" alt="SDO Logo"/>` : '';
  const logoImgHeader = logoSrc
    ? `<img class="lc-doc-banner-logo" src="${logoSrc}" alt="SDO Logo"/>` : '';

  return `
    <div class="lc-letterhead">
      ${logoImgLetterhead}
      <div class="lc-letterhead-text">
        <div class="lc-letterhead-gov">Republika ng Pilipinas &bull; Kagawaran ng Edukasyon</div>
        <div class="lc-letterhead-region">Rehiyon XII</div>
        <div class="lc-letterhead-agency">SANGAY NG PAARALANG LUNGSOD</div>
        <div class="lc-letterhead-sub">Lungsod ng Koronadal</div>
      </div>
    </div>

    <div class="lc-prc-title">PERSONNEL RECORD CARD</div>

    <div class="lc-prc-personal">
      <div class="lc-prc-name-row">
        <div class="lc-prc-field-group" style="flex:2;">
          <span class="lc-prc-field-line">
            <span class="lc-prc-field-val">${eu(emp.surname || '')}</span>
            <span class="lc-prc-field-val">${eu(emp.given || '')}</span>
            <span class="lc-prc-field-val">${eu(emp.maternal || '')}</span>
          </span>
          <span class="lc-prc-field-sublabel">
            <span>(Surname)</span>
            <span>(Given Name)</span>
            <span>(Maternal Surname)</span>
          </span>
        </div>
        <div class="lc-prc-field-group lc-prc-inline">
          <span class="lc-prc-label">Sex:</span>
          <span class="lc-prc-field-val lc-prc-underline">${eu(emp.sex || '')}</span>
        </div>
        <div class="lc-prc-field-group lc-prc-inline">
          <span class="lc-prc-label">Civil Status:</span>
          <span class="lc-prc-field-val lc-prc-underline">${eu(emp.civil || '')}</span>
        </div>
      </div>

      <div class="lc-prc-row">
        <div class="lc-prc-field-group lc-prc-half">
          <span class="lc-prc-label">Date of Birth:</span>
          <span class="lc-prc-field-val lc-prc-underline">${esc(fmtDateEx(emp.dob || ''))}</span>
        </div>
        <div class="lc-prc-field-group lc-prc-half">
          <span class="lc-prc-label">Place of Birth:</span>
          <span class="lc-prc-field-val lc-prc-underline">${eu(emp.pob || '')}</span>
        </div>
      </div>

      <div class="lc-prc-row">
        <div class="lc-prc-field-group lc-prc-half">
          <span class="lc-prc-label">Present Address:</span>
          <span class="lc-prc-field-val lc-prc-underline">${eu(emp.addr || '')}</span>
        </div>
        <div class="lc-prc-field-group lc-prc-half">
          <span class="lc-prc-label">Name of Spouse:</span>
          <span class="lc-prc-field-val lc-prc-underline">${eu(emp.spouse || '')}</span>
        </div>
      </div>

      <div class="lc-prc-row">
        <div class="lc-prc-field-group lc-prc-half">
          <span class="lc-prc-label">Educational Qualification:</span>
          <span class="lc-prc-field-val lc-prc-underline">${eu(emp.edu || '')}</span>
        </div>
        <div class="lc-prc-field-group" style="flex:1;">
          <span class="lc-prc-label">C.S. Eligibility: Kind of Exam:</span>
          <span class="lc-prc-field-val lc-prc-underline">${eu(emp.elig || '')}</span>
        </div>
        <div class="lc-prc-field-group lc-prc-inline">
          <span class="lc-prc-label">Rating:</span>
          <span class="lc-prc-field-val lc-prc-underline">${esc(emp.rating || '')}</span>
        </div>
      </div>

      <div class="lc-prc-row">
        <div class="lc-prc-field-group" style="flex:1;justify-content:center;text-align:center;">
          <span class="lc-prc-label">Place of Exam:</span>
          <span class="lc-prc-field-val lc-prc-underline">${eu(emp.pexam || '')}</span>
        </div>
        <div class="lc-prc-field-group" style="flex:1;justify-content:center;text-align:center;">
          <span class="lc-prc-label">Date:</span>
          <span class="lc-prc-field-val lc-prc-underline">${esc(fmtDateEx(emp.dexam || ''))}</span>
        </div>
      </div>

      <div class="lc-prc-row">
        <div class="lc-prc-field-group lc-prc-inline">
          <span class="lc-prc-label" style="font-weight:800;">EMPLOYEE NO.</span>
          <span class="lc-prc-field-val lc-prc-underline">${esc(emp.id || '')}</span>
        </div>
        <div class="lc-prc-field-group lc-prc-inline" style="flex:2;">
          <span class="lc-prc-label">Date of Original Appointment:</span>
          <span class="lc-prc-field-val lc-prc-underline">${esc(fmtDateEx(emp.appt || ''))}</span>
        </div>
      </div>
    </div>

    <table class="lc-prc-table">
      <thead>
        <tr>
          <th>Effective Date</th>
          <th>Designation</th>
          <th>Status Reg. Perm. Temp/Subt.</th>
          <th>Mo. / Annual Salary</th>
          <th>Name of Dist./ Station</th>
          <th>Source of Fund - Nat'l Local</th>
          <th>DATE OF LAST PROM...</th>
          <th>Remarks</th>
        </tr>
      </thead>
      <tbody>
        ${buildPersonnelTableRows(emp)}
      </tbody>
    </table>`;
}

/* ─────────────────────────────────────────────────────────────
   13.  BUILD A SINGLE PAGE HTML
   ───────────────────────────────────────────────────────────── */
function buildPageHTML(pageNum, flatSlice, emp, logoSrc, totalPages, eraLabel) {
  eraLabel = eraLabel || '&#9632; Leave Record';
  const tableSection = `
    <div class="lc-export-era">
      <div class="lc-table-cap">
        <div class="lc-table-cap-line"></div>
        <div class="lc-table-cap-badge">${eraLabel}</div>
        <div class="lc-table-cap-line"></div>
      </div>
      <div class="tw">
        <table>
          ${buildTableHeader()}
          <tbody>
            ${buildTableBody(flatSlice)}
          </tbody>
        </table>
      </div>
    </div>`;

  let body = '';
  if (pageNum === 0) {
    body = buildHeaderSection(emp, logoSrc) + tableSection;
  } else {
    const logoImgBanner = logoSrc
      ? `<img class="cont-logo" src="${logoSrc}" alt="SDO Logo"/>` : '';
    const surname  = (emp.surname || '').toUpperCase();
    const given    = (emp.given   || '').toUpperCase();
    body = `
      <div class="lc-export-era">
        <div class="continuation-header">
          <div class="cont-left">
            ${logoImgBanner}
            <div class="cont-agency-block">
              <div class="cont-agency">SDO City of Koronadal &mdash; Region XII</div>
              <div class="cont-sub">Employee Leave Record &mdash; ${surname}, ${given} &mdash; ${eraLabel}</div>
            </div>
          </div>
          <div class="cont-page-badge">
            <span class="cont-page-num">${pageNum + 1}</span>
            <span class="cont-page-of">of ${totalPages}</span>
          </div>
        </div>
        <div class="tw">
          <table>
            ${buildTableHeader()}
            <tbody>
              ${buildTableBody(flatSlice)}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>${SHARED_CSS}</style>
</head>
<body><div class="lc-export-doc">${body}</div></body>
</html>`;
}

/* ─────────────────────────────────────────────────────────────
   14.  SLICE FLAT ROWS INTO PAGES
   ───────────────────────────────────────────────────────────── */
function sliceIntoPages(flat) {
  const pages = [];
  if (flat.length === 0) { pages.push([]); return pages; }
  pages.push(flat.slice(0, PDF_ROWS_PAGE1));
  let offset = PDF_ROWS_PAGE1;
  while (offset < flat.length) {
    pages.push(flat.slice(offset, offset + PDF_ROWS_PAGEN));
    offset += PDF_ROWS_PAGEN;
  }
  return pages;
}

/* ─────────────────────────────────────────────────────────────
   15.  RENDER ONE PAGE → ArrayBuffer
        FIX v8.1: Wait for images to fully load (naturalWidth > 0)
        before decode + html2canvas capture to prevent 0×0 canvas crash.
   ───────────────────────────────────────────────────────────── */
const PDF_OPT_BASE = {
  margin:      [8, 5, 12, 5],
  image:       { type: 'jpeg', quality: 0.99 },
  html2canvas: {
    scale:           2,
    useCORS:         true,
    logging:         false,
    letterRendering: true,
    allowTaint:      true,
    backgroundColor: '#ffffff',
    scrollX: 0, scrollY: 0, x: 0, y: 0,
    windowHeight: 99999, windowWidth: 794, width: 794,
  },
  jsPDF: {
    unit: 'mm', format: [215.9, 355.6],
    orientation: 'portrait', compress: true,
  },
  pagebreak: { mode: [] },
};

async function renderPageToArrayBuffer(htmlStr) {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = [
    'position:fixed','left:-9999px','top:0',
    'width:794px','background:#fff',
    'z-index:-9999','visibility:hidden',
  ].join(';');
  wrapper.innerHTML = htmlStr;
  document.body.appendChild(wrapper);

  // ── STEP 1: Wait for ALL images to fully load (naturalWidth > 0).
  //   This is the critical fix — img.complete can be true even when
  //   naturalWidth===0 (broken/still-loading), which causes the
  //   "canvas element with a width or height of 0" crash in html2canvas.
  await Promise.all(
    [...wrapper.querySelectorAll('img')].map(img => {
      // Already fully loaded with real dimensions — nothing to do
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise(resolve => {
        img.onload  = resolve;
        img.onerror = resolve; // resolve on error — don't block forever
        // If src is set but stuck, poke it to re-trigger load
        if (img.src && !img.complete) {
          const s = img.src;
          img.src = '';
          img.src = s;
        }
      });
    })
  );

  // ── STEP 2: GPU texture upload (decode)
  await Promise.all(
    [...wrapper.querySelectorAll('img')].map(img =>
      img.decode ? img.decode().catch(() => {}) : Promise.resolve()
    )
  );

  // ── STEP 3: Longer settle for fonts + layout (increased from 350ms)
  await new Promise(r => setTimeout(r, 500));

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const target = wrapper.querySelector('.lc-export-doc') || wrapper;
      html2pdf()
        .set(PDF_OPT_BASE)
        .from(target)
        .outputPdf('arraybuffer')
        .then(buf => { wrapper.remove(); resolve(buf); })
        .catch(err => { wrapper.remove(); reject(err); });
    }, 300);
  });
}

/* ─────────────────────────────────────────────────────────────
   15b.  MERGE BUFFERS with pdf-lib
   ───────────────────────────────────────────────────────────── */
let _pdfLib = null;
function loadPdfLib() {
  if (_pdfLib) return Promise.resolve(_pdfLib);
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
    s.onload  = () => { _pdfLib = window.PDFLib; resolve(_pdfLib); };
    s.onerror = () => reject(new Error('Failed to load pdf-lib from CDN.'));
    document.head.appendChild(s);
  });
}

async function mergePageBuffers(buffers) {
  const PDFLib = await loadPdfLib();
  const merged = await PDFLib.PDFDocument.create();
  for (const buf of buffers) {
    const src   = await PDFLib.PDFDocument.load(buf);
    const pages = await merged.copyPages(src, src.getPageIndices());
    pages.forEach(p => merged.addPage(p));
  }
  return merged.save();
}

/* ─────────────────────────────────────────────────────────────
   16.  SHARED CSS  — Red Armour Reforged v8.1
   ───────────────────────────────────────────────────────────── */
const SHARED_CSS = `

*, *::before, *::after {
  box-sizing: border-box; margin: 0; padding: 0;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}
html, body {
  width: 794px; margin: 0 auto; padding: 0;
  background: #ffffff;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 9pt; color: #000000;
}
.lc-export-doc { width: 776px; background: #fff; padding: 8px; margin: 0 auto; }

/* ═══════════════════════════════════
   LETTERHEAD — plain centered text
   ═══════════════════════════════════ */
.lc-letterhead {
  text-align: center;
  padding: 8px 0 4px;
  margin-bottom: 2px;
  border: none;
  background: #fff;
}
.lc-letterhead-gov {
  font-size: 9pt; font-weight: 400; color: #000;
}
.lc-letterhead-region {
  font-size: 9pt; font-weight: 400; color: #000;
}
.lc-letterhead-agency {
  font-size: 9pt; font-weight: 700; color: #000;
  text-transform: uppercase;
}
.lc-letterhead-sub {
  font-size: 9pt; font-weight: 400; color: #000;
}

/* ═══════════════════════════════════
   PERSONNEL RECORD CARD TITLE
   ═══════════════════════════════════ */
.lc-prc-title {
  text-align: center;
  font-size: 12pt; font-weight: 900;
  letter-spacing: .08em; text-transform: uppercase;
  color: #000; margin: 6px 0 8px;
  font-family: Arial, sans-serif;
}

/* ═══════════════════════════════════
   PERSONAL DETAILS SECTION
   ═══════════════════════════════════ */
.lc-prc-personal {
  font-family: Arial, sans-serif;
  font-size: 9pt;
  margin-bottom: 0;
  padding: 0;
}
.lc-prc-name-row {
  display: flex; align-items: flex-end; gap: 6px;
  margin-bottom: 3px;
}
.lc-prc-row {
  display: flex; align-items: flex-end; gap: 6px;
  margin-bottom: 3px;
}
.lc-prc-field-group {
  display: flex; flex-direction: column; flex: 1;
}
.lc-prc-field-group.lc-prc-half { flex: 1; }
.lc-prc-field-group.lc-prc-inline {
  flex-direction: row; align-items: flex-end;
  gap: 3px; flex: 0 0 auto;
}
.lc-prc-label {
  font-size: 8.5pt; color: #000; white-space: nowrap;
  font-weight: 400;
}
.lc-prc-field-val {
  font-size: 9pt; font-weight: 400; color: #000;
  text-transform: uppercase; min-width: 30px;
}
.lc-prc-underline {
  border-bottom: 1pt solid #000;
  display: inline-block; min-width: 80px;
  padding-bottom: 1px;
}
.lc-prc-field-line {
  display: flex; gap: 20px;
}
.lc-prc-field-sublabel {
  display: flex; gap: 20px;
  font-size: 7pt; color: #000; font-style: italic;
}
.lc-prc-field-sublabel span,
.lc-prc-field-line span { flex: 1; text-align: center; }

/* Name label prefix */
.lc-prc-name-prefix {
  font-size: 9pt; font-weight: 400;
  white-space: nowrap; margin-right: 4px;
}

/* ═══════════════════════════════════
   PERSONNEL TABLE
   ═══════════════════════════════════ */
.lc-prc-table {
  width: 100%; border-collapse: collapse;
  font-family: Arial, sans-serif;
  font-size: 8pt; margin-top: 4px;
  table-layout: fixed;
}
.lc-prc-table th {
  border: 1pt solid #000;
  padding: 3px 2px; text-align: center;
  font-weight: 700; font-size: 7.5pt;
  background: #fff; color: #000;
  white-space: normal; word-break: break-word;
  line-height: 1.3;
}
.lc-prc-table td {
  border: 1pt solid #000;
  padding: 2px; height: 20px;
  text-align: center; vertical-align: middle;
  font-size: 8pt; color: #000;
  background: #fff;
}

/* ═══════════════════════════════════
   CONTINUATION HEADER (page 2+)
   ═══════════════════════════════════ */
.continuation-header {
  display: flex; align-items: center;
  justify-content: space-between;
  padding: 6px 8px; border-bottom: 1pt solid #000;
  margin-bottom: 4px; background: #fff;
}
.cont-left { display: flex; align-items: center; gap: 8px; }
.cont-agency {
  font-size: 9pt; font-weight: 700; color: #000;
}
.cont-sub { font-size: 7.5pt; color: #000; font-style: italic; }
.cont-page-badge {
  display: flex; flex-direction: column; align-items: center;
  border: 1pt solid #000; border-radius: 4px; padding: 2px 8px;
}
.cont-page-num { font-size: 14pt; font-weight: 800; color: #000; line-height: 1; }
.cont-page-of  { font-size: 6pt; color: #000; text-transform: uppercase; }
.cont-logo     { display: none; }

/* ═══════════════════════════════════
   LEAVE RECORD ERA / TABLE WRAPPER
   ═══════════════════════════════════ */
.lc-export-era {
  border: 1pt solid #000;
  margin-top: 8px; margin-bottom: 6px;
  width: 100%; box-sizing: border-box;
}
.lc-table-cap {
  width: 100%; padding: 4px 8px;
  background: #fff; border-bottom: 1pt solid #000;
  display: flex; align-items: center; gap: 6px;
}
.lc-table-cap-line {
  flex: 1; height: 1px; background: #ccc;
}
.lc-table-cap-badge {
  font-size: 7pt; font-weight: 700;
  color: #000; letter-spacing: .1em;
  text-transform: uppercase; white-space: nowrap;
}
.tw { overflow: visible; width: 100%; display: block; }

/* ═══════════════════════════════════
   LEAVE RECORD TABLE
   ═══════════════════════════════════ */
table {
  width: 100% !important; border-collapse: collapse !important;
  table-layout: fixed !important;
  font-size: 7.5pt; font-family: Arial, sans-serif;
}
thead { display: table-header-group; }
thead tr:first-child th {
  background: #fff !important; color: #000 !important;
  font-size: 6.5pt; font-weight: 800; padding: 5px 3px 4px;
  text-align: center;
  border: .5pt solid #000 !important;
  text-transform: uppercase; letter-spacing: .03em;
  white-space: normal; word-break: break-word; line-height: 1.3;
  font-family: Arial, sans-serif;
}
thead th.tha {
  background: #fff !important; color: #000 !important;
  border: .5pt solid #000 !important;
}
thead th.thb {
  background: #fff !important; color: #000 !important;
  border: .5pt solid #000 !important;
}
thead tr:nth-child(2) th {
  background: #fff !important; color: #000 !important;
  font-size: 6pt; font-weight: 700; padding: 3px 2px;
  text-align: center; border: .5pt solid #000 !important;
  white-space: normal; word-break: break-word; line-height: 1.2;
  font-family: Arial, sans-serif;
}
thead th.ths.tha,
thead th.ths.thb {
  background: #fff !important; color: #000 !important;
}

/* ── TBODY ── */
tbody tr { page-break-inside: avoid !important; break-inside: avoid !important; }
tbody td {
  border: .5pt solid #000 !important;
  padding: 3pt 2pt;
  font-size: 7.5pt; text-align: center; vertical-align: middle;
  white-space: normal; word-break: break-word; overflow-wrap: break-word;
  overflow: visible; line-height: 1.35; text-transform: uppercase;
  font-family: Arial, sans-serif;
  background: #fff !important; color: #000 !important;
}
tbody tr:nth-child(even) td { background: #fff !important; }
tbody tr:nth-child(odd)  td { background: #fff !important; }

.bc {
  background: #fff !important; color: #000 !important;
  font-weight: 800 !important; font-size: 8pt !important;
}
.rdc {
  color: #000 !important; font-weight: 700 !important;
  background: #fff !important;
  text-decoration: underline !important;
}
.nc {
  font-family: Arial, sans-serif !important;
  white-space: nowrap !important; font-size: 7.5pt !important;
  color: #000 !important;
}
.so-cell {
  font-size: 6.5pt !important; padding: 3px 2px !important;
  color: #000 !important; white-space: normal !important;
  word-break: break-word !important;
}
.num-cell { padding: 3px 2px !important; font-size: 7.5pt !important; }
.period-cell {
  text-align: left !important; padding: 3pt 4pt !important;
  font-weight: 600 !important; line-height: 1.35 !important;
  white-space: normal !important; word-break: break-word !important;
  font-size: 7pt !important; text-transform: uppercase !important;
  color: #000 !important;
}
.date-range {
  display: block; font-size: 7pt; font-weight: 700; line-height: 1.35;
  font-family: Arial, sans-serif;
  color: #000 !important; text-transform: uppercase;
}
.ampm-tag {
  font-size: 5.5pt; color: #000; font-weight: 400;
}
.remarks-cell {
  text-align: left !important; padding: 3pt 5pt !important;
  font-size: 7pt !important; white-space: normal !important;
  word-break: break-word !important; overflow: visible !important;
  line-height: 1.4 !important; text-transform: uppercase !important;
  color: #000 !important;
}
.empty-row-cell {
  text-align: center !important; padding: 10px !important;
  color: #666 !important; font-style: italic !important;
  font-size: 7.5pt !important;
}

/* ── Forward balance row ── */
.era-fwd-row {
  border-top: 1.5pt solid #000 !important;
  page-break-inside: avoid !important;
}
.fwd-label-cell {
  text-align: left !important; padding: 4px 8px !important;
  font-style: italic !important; font-size: 7pt !important;
  background: #f9f9f9 !important; color: #000 !important;
  font-weight: 700 !important; border-color: #000 !important;
  white-space: normal !important; word-break: break-word !important;
}
.fwd-num-cell {
  background: #f9f9f9 !important; color: #000 !important;
  font-weight: 700 !important; font-style: italic !important;
  font-size: 7pt !important; border-color: #000 !important;
  padding: 3pt 2pt !important; text-align: center !important;
}
.fwd-remarks-cell { background: #f9f9f9 !important; border-color: #000 !important; }

/* ── Column widths (leave table) ── */
table col:nth-child(1)  { width: 5%  !important; }
table col:nth-child(2)  { width: 14% !important; }
table col:nth-child(3)  { width: 5%  !important; }
table col:nth-child(4)  { width: 5%  !important; }
table col:nth-child(5)  { width: 5%  !important; }
table col:nth-child(6)  { width: 5%  !important; }
table col:nth-child(7)  { width: 5%  !important; }
table col:nth-child(8)  { width: 5%  !important; }
table col:nth-child(9)  { width: 5%  !important; }
table col:nth-child(10) { width: 5%  !important; }
table col:nth-child(11) { width: 36% !important; }

table th:nth-child(1),  table td:nth-child(1)  { width: 5%  !important; }
table th:nth-child(2),  table td:nth-child(2)  { width: 14% !important; }
table th:nth-child(3),  table td:nth-child(3),
table th:nth-child(4),  table td:nth-child(4),
table th:nth-child(5),  table td:nth-child(5),
table th:nth-child(6),  table td:nth-child(6),
table th:nth-child(7),  table td:nth-child(7),
table th:nth-child(8),  table td:nth-child(8),
table th:nth-child(9),  table td:nth-child(9),
table th:nth-child(10), table td:nth-child(10) { width: 5% !important; }
table th:nth-child(11), table td:nth-child(11) {
  width: 36% !important;
  text-align: left !important; padding-left: 6px !important;
}

@media print {
  tr, .data-row, .era-fwd-row {
    page-break-inside: avoid !important; break-inside: avoid !important;
  }
  td, th {
    overflow: visible !important;
    overflow-wrap: break-word !important;
    word-break: break-word !important;
  }
  *, *::before, *::after {
    box-shadow: none !important;
    text-shadow: none !important;
  }
}
`;

/* ─────────────────────────────────────────────────────────────
   17.  BUILD FULL STANDALONE PAGE  (for PRINT only)
   ───────────────────────────────────────────────────────────── */
function buildExportHTML(emp, logoSrc) {
  const records = emp.records || [];
  const logoImgLetterhead = ''; // plain black & white — no logo

  const segments = [];
  let cur = { conv: null, recs: [] };
  for (const r of records) {
    if (r._conversion) { segments.push(cur); cur = { conv: r, recs: [] }; }
    else cur.recs.push(r);
  }
  segments.push(cur);

  const erasHtml = segments.map((seg, si) => {
    const isFirst = si === 0;
    const fwdRow = (!isFirst && seg.conv) ? buildFwdRow(seg.conv) : '';
    const dataRows = seg.recs.map(r => buildTableRow(r)).join('');
    const emptyRow = seg.recs.length === 0
      ? `<tr class="data-row"><td colspan="11" class="empty-row-cell">NO RECORDS IN THIS ERA.</td></tr>` : '';
    return `
      <div class="lc-export-era">
        <div class="lc-table-cap">
          <div class="lc-table-cap-line"></div>
          <div class="lc-table-cap-badge">&#9632; Leave Record</div>
          <div class="lc-table-cap-line"></div>
        </div>
        <div class="tw">
          <table>
            ${buildTableHeader()}
            <tbody>${fwdRow}${dataRows}${emptyRow}</tbody>
          </table>
        </div>
      </div>`;
  }).join('');

  return `
    <div class="lc-export-doc">
<div class="lc-letterhead">
        <div class="lc-letterhead-gov">Republika ng Pilipinas</div>
        <div class="lc-letterhead-gov">Kagawaran ng Edukasyon</div>
        <div class="lc-letterhead-region">Rehiyon XII</div>
        <div class="lc-letterhead-agency">SANGAY NG PAARALANG LUNGSOD</div>
        <div class="lc-letterhead-sub">Lungsod ng Koronadal</div>
      </div>

      <div class="lc-prc-title">PERSONNEL RECORD CARD</div>

<div class="lc-prc-personal">

        <div class="lc-prc-name-row">
          <span class="lc-prc-name-prefix">Name:</span>
          <div class="lc-prc-field-group" style="flex:1;">
            <span class="lc-prc-field-val lc-prc-underline">${eu(emp.surname || '')}</span>
            <span style="font-size:7pt;text-align:center;display:block;">(Surname)</span>
          </div>
          <div class="lc-prc-field-group" style="flex:1;">
            <span class="lc-prc-field-val lc-prc-underline">${eu(emp.given || '')}</span>
            <span style="font-size:7pt;text-align:center;display:block;">(Given Name)</span>
          </div>
          <div class="lc-prc-field-group" style="flex:1;">
            <span class="lc-prc-field-val lc-prc-underline">${eu(emp.maternal || '')}</span>
            <span style="font-size:7pt;text-align:center;display:block;">(Maternal Surname)</span>
          </div>
          <div style="display:flex;align-items:flex-end;gap:3px;flex-shrink:0;">
            <span class="lc-prc-label">Sex:</span>
            <span class="lc-prc-field-val lc-prc-underline" style="min-width:50px;">${eu(emp.sex || '')}</span>
          </div>
          <div style="display:flex;align-items:flex-end;gap:3px;flex-shrink:0;">
            <span class="lc-prc-label">Civil Status:</span>
            <span class="lc-prc-field-val lc-prc-underline" style="min-width:70px;">${eu(emp.civil || '')}</span>
          </div>
        </div>

        <div class="lc-prc-row">
          <span class="lc-prc-label" style="white-space:nowrap;">Date of Birth:</span>
          <span class="lc-prc-field-val lc-prc-underline" style="flex:1;">${esc(fmtDateEx(emp.dob || ''))}</span>
          <span class="lc-prc-label" style="white-space:nowrap;margin-left:8px;">Place of Birth:</span>
          <span class="lc-prc-field-val lc-prc-underline" style="flex:2;">${eu(emp.pob || '')}</span>
        </div>

        <div class="lc-prc-row">
          <span class="lc-prc-label" style="white-space:nowrap;">Present Address:</span>
          <span class="lc-prc-field-val lc-prc-underline" style="flex:2;">${eu(emp.addr || '')}</span>
          <span class="lc-prc-label" style="white-space:nowrap;margin-left:8px;">Name of Spouse:</span>
          <span class="lc-prc-field-val lc-prc-underline" style="flex:1.5;">${eu(emp.spouse || '')}</span>
        </div>

        <div class="lc-prc-row">
          <span class="lc-prc-label" style="white-space:nowrap;">Educational Qualification:</span>
          <span class="lc-prc-field-val lc-prc-underline" style="flex:1.5;">${eu(emp.edu || '')}</span>
          <span class="lc-prc-label" style="white-space:nowrap;margin-left:8px;">C.S. ELIGIBILITY: Kind of Exam:</span>
          <span class="lc-prc-field-val lc-prc-underline" style="flex:1;">${eu(emp.elig || '')}</span>
          <span class="lc-prc-label" style="white-space:nowrap;margin-left:8px;">Rating:</span>
          <span class="lc-prc-field-val lc-prc-underline" style="min-width:40px;">${esc(emp.rating || '')}</span>
        </div>

        <div class="lc-prc-row" style="justify-content:center;gap:30px;">
          <div style="display:flex;gap:4px;align-items:flex-end;">
            <span class="lc-prc-label">Place of Exam:</span>
            <span class="lc-prc-field-val lc-prc-underline" style="min-width:120px;">${eu(emp.pexam || '')}</span>
          </div>
          <div style="display:flex;gap:4px;align-items:flex-end;">
            <span class="lc-prc-label">Date:</span>
            <span class="lc-prc-field-val lc-prc-underline" style="min-width:90px;">${esc(fmtDateEx(emp.dexam || ''))}</span>
          </div>
        </div>

        <div class="lc-prc-row">
          <span class="lc-prc-label" style="font-weight:800;white-space:nowrap;">EMPLOYEE NO.</span>
          <span class="lc-prc-field-val lc-prc-underline" style="min-width:90px;">${esc(emp.id || '')}</span>
          <span class="lc-prc-label" style="white-space:nowrap;margin-left:16px;">Date of Original Appointment:</span>
          <span class="lc-prc-field-val lc-prc-underline" style="flex:1;">${esc(fmtDateEx(emp.appt || ''))}</span>
        </div>

      </div>

      <table class="lc-prc-table">
        <colgroup>
          <col style="width:11%;"/><col style="width:15%;"/>
          <col style="width:11%;"/><col style="width:11%;"/>
          <col style="width:18%;"/><col style="width:12%;"/>
          <col style="width:11%;"/><col style="width:11%;"/>
        </colgroup>
        <thead>
          <tr>
            <th>Effective Date</th>
            <th>Designation</th>
            <th>Status Reg. Perm. Temp/Subt.</th>
            <th>Mo. / Annual Salary</th>
            <th>Name of Dist./ Station</th>
            <th>Source of Fund - Nat'l Local</th>
            <th>DATE OF LAST PROM...</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          ${buildPersonnelTableRows(emp)}
        </tbody>
      </table>

      ${erasHtml}
    </div>`;
}

/* ─────────────────────────────────────────────────────────────
   18.  IFRAME HELPER
   ───────────────────────────────────────────────────────────── */
function createCaptureIframe(htmlContent) {
  return new Promise((resolve) => {
    const old = document.getElementById('lc-capture-iframe');
    if (old) old.remove();

    const iframe = document.createElement('iframe');
    iframe.id = 'lc-capture-iframe';
    iframe.style.cssText = [
      'position:fixed','left:0','top:0',
      'width:794px','height:100%',
      'border:none','z-index:99999',
      'visibility:hidden','pointer-events:none',
    ].join(';');

    document.body.appendChild(iframe);
    iframe.onload = () => resolve(iframe);
    iframe.contentDocument.open();
    iframe.contentDocument.write(htmlContent);
    iframe.contentDocument.close();
  });
}

/* ─────────────────────────────────────────────────────────────
   18b.  PRE-WARMER
   ───────────────────────────────────────────────────────────── */
let _readyIframe   = null;
let _readyForEmpId = null;

async function lcPrimeForPrint(emp) {
  if (!emp) return;
  if (_readyIframe && _readyForEmpId === emp.id
      && document.body.contains(_readyIframe)) return;
  if (_readyIframe) { try { _readyIframe.remove(); } catch (_) {} _readyIframe = null; }
  const logoSrc  = await getLogoBase64();
  const fullPage = buildFullPage(emp, logoSrc);
  _readyIframe   = await createCaptureIframe(fullPage);
  _readyForEmpId = emp.id;
}
function buildFullPage(emp, logoSrc) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>${SHARED_CSS}</style>
</head>
<body>${buildExportHTML(emp, logoSrc)}</body>
</html>`;
}
window.lcPrimeForPrint = lcPrimeForPrint;

/* ─────────────────────────────────────────────────────────────
   19.  RED ARMOUR LOADING OVERLAY
   ───────────────────────────────────────────────────────────── */
const OVERLAY_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;600&display=swap');

  #lc-armour-overlay {
    position: fixed; inset: 0; z-index: 999999;
    display: flex; align-items: center; justify-content: center;
    background: radial-gradient(ellipse at center,
      rgba(60,0,0,.97) 0%,
      rgba(15,0,0,.99) 60%,
      rgba(0,0,0,1) 100%);
    backdrop-filter: blur(8px);
    animation: overlay-in .35s cubic-bezier(.22,1,.36,1) both;
    font-family: 'Barlow Condensed', sans-serif;
  }
  @keyframes overlay-in {
    from { opacity:0; backdrop-filter:blur(0px); }
    to   { opacity:1; backdrop-filter:blur(8px); }
  }
  #lc-armour-overlay::before {
    content:'';
    position:absolute; inset:0;
    background-image:
      repeating-linear-gradient(60deg, rgba(139,26,26,.07) 0, rgba(139,26,26,.07) 1px, transparent 0, transparent 50%),
      repeating-linear-gradient(120deg, rgba(139,26,26,.07) 0, rgba(139,26,26,.07) 1px, transparent 0, transparent 50%),
      repeating-linear-gradient(0deg, rgba(139,26,26,.07) 0, rgba(139,26,26,.07) 1px, transparent 0, transparent 50%);
    background-size: 40px 70px, 40px 70px, 40px 70px;
    animation: grid-pan 8s linear infinite;
  }
  @keyframes grid-pan { to { background-position: 40px 70px, 40px 70px, 40px 70px; } }
  #lc-armour-overlay::after {
    content:'';
    position:absolute; inset:0;
    background: linear-gradient(105deg,
      transparent 0%, transparent 40%,
      rgba(255,80,60,.04) 50%,
      transparent 60%, transparent 100%);
    background-size: 200% 100%;
    animation: scan-sweep 2.8s ease-in-out infinite;
  }
  @keyframes scan-sweep {
    0%   { background-position: 200% 0; }
    100% { background-position: -100% 0; }
  }
  .lc-armour-card {
    position: relative; z-index: 1;
    width: 420px;
    background: linear-gradient(160deg,
      rgba(35,3,3,.95) 0%,
      rgba(22,2,2,.98) 50%,
      rgba(12,1,1,1)   100%);
    border: 1px solid rgba(192,57,43,.5);
    border-radius: 20px;
    padding: 44px 40px 40px;
    box-shadow:
      0 0 0 1px rgba(255,80,60,.08),
      0 0 60px rgba(139,0,0,.6),
      0 0 120px rgba(139,0,0,.3),
      0 40px 80px rgba(0,0,0,.9),
      inset 0 1px 0 rgba(255,120,100,.12),
      inset 0 -1px 0 rgba(0,0,0,.5);
    overflow: hidden;
  }
  .lc-armour-card::before {
    content:'';
    position:absolute; inset:8px;
    border-radius:14px;
    border: 1px solid rgba(192,57,43,.15);
    pointer-events:none;
  }
  .lc-armour-rivets { position:absolute; inset:0; pointer-events:none; }
  .lc-armour-rivets span {
    position:absolute; width:8px; height:8px; border-radius:50%;
    background: radial-gradient(circle at 35% 35%, #ff6040 0%, #991010 60%, #4a0808 100%);
    box-shadow: 0 0 6px rgba(255,80,60,.5), inset 0 1px 0 rgba(255,200,180,.2);
  }
  .lc-armour-rivets span:nth-child(1) { top:14px; left:14px; }
  .lc-armour-rivets span:nth-child(2) { top:14px; right:14px; }
  .lc-armour-rivets span:nth-child(3) { bottom:14px; left:14px; }
  .lc-armour-rivets span:nth-child(4) { bottom:14px; right:14px; }
  .lc-armour-emblem {
    width:72px; height:72px; border-radius:50%;
    margin:0 auto 24px; position:relative;
    display:flex; align-items:center; justify-content:center;
  }
  .lc-armour-emblem::before {
    content:''; position:absolute; inset:-4px; border-radius:50%;
    background: conic-gradient(from 0deg, #8b1a1a 0deg, #e53e3e 60deg, #8b1a1a 120deg, #c0392b 180deg, #8b1a1a 240deg, #e53e3e 300deg, #8b1a1a 360deg);
    animation: ring-rotate 4s linear infinite;
  }
  @keyframes ring-rotate { to { transform: rotate(360deg); } }
  .lc-armour-emblem::after {
    content:''; position:absolute; inset:-1px; border-radius:50%;
    background: radial-gradient(circle, rgba(15,1,1,1) 60%, transparent 100%);
  }
  .lc-armour-emblem-inner {
    position:relative; z-index:1;
    width:64px; height:64px; border-radius:50%;
    background: radial-gradient(circle at 35% 30%, #5a0e0e 0%, #2d0606 50%, #0d0101 100%);
    display:flex; align-items:center; justify-content:center;
    font-size:28px;
    box-shadow: inset 0 2px 8px rgba(0,0,0,.8), inset 0 -1px 2px rgba(255,80,60,.1);
  }
  .lc-armour-title {
    text-align:center; font-family:'Barlow Condensed', sans-serif;
    font-size:20pt; font-weight:900; letter-spacing:.18em; color:#fff;
    text-transform:uppercase;
    text-shadow: 0 0 20px rgba(255,60,40,.6), 0 2px 4px rgba(0,0,0,.8);
    margin-bottom:4px;
  }
  .lc-armour-sub {
    text-align:center; font-family:'Barlow', sans-serif;
    font-size:8pt; font-weight:300; color:rgba(255,160,140,.5);
    letter-spacing:.25em; text-transform:uppercase; margin-bottom:32px;
  }
  .lc-armour-progress-wrap { margin-bottom:24px; position:relative; }
  .lc-armour-progress-track {
    width:100%; height:6px; background:rgba(139,26,26,.25);
    border-radius:3px; overflow:hidden; position:relative;
    box-shadow: inset 0 1px 4px rgba(0,0,0,.6), 0 0 0 1px rgba(139,26,26,.3);
  }
  .lc-armour-progress-fill {
    height:100%;
    background: linear-gradient(90deg, #7a1010 0%, #c0392b 35%, #e53e3e 50%, #c0392b 65%, #7a1010 100%);
    background-size:200% 100%; border-radius:3px; width:0%;
    transition: width .4s cubic-bezier(.4,0,.2,1);
    animation: fill-shimmer 1.5s ease-in-out infinite; position:relative;
  }
  @keyframes fill-shimmer { 0%,100% { background-position:0% 0; } 50% { background-position:200% 0; } }
  .lc-armour-progress-glow {
    position:absolute; right:0; top:50%; transform:translateY(-50%);
    width:20px; height:20px; border-radius:50%;
    background: radial-gradient(circle, rgba(255,80,60,.8) 0%, transparent 70%);
    filter:blur(3px); transition: right .4s cubic-bezier(.4,0,.2,1); pointer-events:none;
  }
  .lc-armour-status-row { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:20px; }
  .lc-armour-status {
    font-family:'Barlow Condensed', sans-serif; font-size:10pt; font-weight:700;
    color:#e07060; letter-spacing:.08em; text-transform:uppercase;
  }
  .lc-armour-pct {
    font-family:'Barlow Condensed', sans-serif; font-size:16pt; font-weight:800;
    color:#ff6040; text-shadow: 0 0 12px rgba(255,80,60,.4);
  }
  .lc-armour-steps { display:flex; flex-direction:column; gap:10px; }
  .lc-armour-step {
    display:flex; align-items:center; gap:12px; padding:8px 12px; border-radius:8px;
    background:rgba(139,26,26,.08); border:1px solid rgba(139,26,26,.12); transition: all .3s ease;
  }
  .lc-armour-step.active { background: rgba(139,26,26,.22); border-color: rgba(192,57,43,.4); box-shadow: 0 0 20px rgba(139,0,0,.3); }
  .lc-armour-step.done   { background: rgba(46,204,113,.06); border-color: rgba(46,204,113,.2); }
  .lc-armour-step-icon {
    width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center;
    flex-shrink:0; font-size:12px; background: rgba(0,0,0,.4);
    border: 1px solid rgba(139,26,26,.3); color: rgba(255,100,80,.4); transition: all .3s ease;
  }
  .lc-armour-step.active .lc-armour-step-icon {
    background: rgba(139,26,26,.4); border-color: rgba(255,80,60,.6); color: #ff8060;
    box-shadow: 0 0 10px rgba(255,60,40,.3); animation: step-pulse .8s ease-in-out infinite alternate;
  }
  @keyframes step-pulse { from { box-shadow: 0 0 6px rgba(255,60,40,.2); } to { box-shadow: 0 0 16px rgba(255,60,40,.5); } }
  .lc-armour-step.done .lc-armour-step-icon { background: rgba(46,204,113,.2); border-color: rgba(46,204,113,.4); color: #4eda8c; }
  .lc-armour-step-label {
    font-family:'Barlow Condensed', sans-serif; font-size:9.5pt; font-weight:700;
    letter-spacing:.06em; text-transform:uppercase; color:rgba(255,160,140,.35);
    transition: color .3s ease; flex:1;
  }
  .lc-armour-step.active .lc-armour-step-label { color:#e07060; }
  .lc-armour-step.done  .lc-armour-step-label  { color:rgba(100,220,160,.6); }
  .lc-armour-step-detail {
    font-family:'Barlow', sans-serif; font-size:7pt; color:rgba(255,100,80,.4);
    transition: color .3s ease; text-align:right; white-space:nowrap;
  }
  .lc-armour-step.active .lc-armour-step-detail { color:rgba(255,120,80,.65); }
  .lc-armour-step.done  .lc-armour-step-detail  { color:rgba(80,200,140,.55); }
  #lc-armour-overlay.lc-overlay-out {
    animation: overlay-out .4s cubic-bezier(.55,0,1,.45) both;
  }
  @keyframes overlay-out { from { opacity:1; transform:scale(1); } to { opacity:0; transform:scale(.97); } }
`;

let _overlayEl = null;
let _overlayProgressFill = null;
let _overlayProgressGlow = null;
let _overlayStatus = null;
let _overlayPct = null;
let _overlaySteps = [];

const OVERLAY_STEPS = [
  { label: 'Forging armour plates',     detail: 'Building layout…',       icon: '⚙' },
  { label: 'Rendering pages',           detail: 'Capturing visuals…',     icon: '🖼' },
  { label: 'Welding into document',     detail: 'Merging pages…',         icon: '🔗' },
  { label: 'Sealing the PDF',           detail: 'Finalising file…',       icon: '🛡' },
];

function showArmourOverlay() {
  if (!document.getElementById('lc-armour-styles')) {
    const st = document.createElement('style');
    st.id = 'lc-armour-styles';
    st.textContent = OVERLAY_STYLES;
    document.head.appendChild(st);
  }
  const old = document.getElementById('lc-armour-overlay');
  if (old) old.remove();

  const stepsHtml = OVERLAY_STEPS.map((s, i) => `
    <div class="lc-armour-step" id="lc-step-${i}">
      <div class="lc-armour-step-icon" id="lc-step-icon-${i}">${s.icon}</div>
      <div class="lc-armour-step-label">${s.label}</div>
      <div class="lc-armour-step-detail" id="lc-step-detail-${i}">${s.detail}</div>
    </div>
  `).join('');

  const el = document.createElement('div');
  el.id = 'lc-armour-overlay';
  el.innerHTML = `
    <div class="lc-armour-card">
      <div class="lc-armour-rivets">
        <span></span><span></span><span></span><span></span>
      </div>
      <div class="lc-armour-emblem">
        <div class="lc-armour-emblem-inner">🛡</div>
      </div>
      <div class="lc-armour-title">Generating</div>
      <div class="lc-armour-sub">SDO Leave Card System</div>
      <div class="lc-armour-progress-wrap">
        <div class="lc-armour-progress-track">
          <div class="lc-armour-progress-fill" id="lc-prog-fill"></div>
        </div>
        <div class="lc-armour-progress-glow" id="lc-prog-glow"></div>
      </div>
      <div class="lc-armour-status-row">
        <div class="lc-armour-status" id="lc-overlay-status">Preparing…</div>
        <div class="lc-armour-pct" id="lc-overlay-pct">0%</div>
      </div>
      <div class="lc-armour-steps">${stepsHtml}</div>
    </div>`;
  document.body.appendChild(el);

  _overlayEl           = el;
  _overlayProgressFill = document.getElementById('lc-prog-fill');
  _overlayProgressGlow = document.getElementById('lc-prog-glow');
  _overlayStatus       = document.getElementById('lc-overlay-status');
  _overlayPct          = document.getElementById('lc-overlay-pct');
  _overlaySteps        = OVERLAY_STEPS.map((_, i) => ({
    el:     document.getElementById(`lc-step-${i}`),
    detail: document.getElementById(`lc-step-detail-${i}`),
  }));

  setOverlayProgress(0, 'Preparing armour…', -1);
}

function setOverlayProgress(pct, statusText, activeStep) {
  if (!_overlayEl) return;
  const p = Math.max(0, Math.min(100, pct));
  if (_overlayProgressFill) _overlayProgressFill.style.width = p + '%';
  if (_overlayProgressGlow) _overlayProgressGlow.style.right = (100 - p) + '%';
  if (_overlayStatus) _overlayStatus.textContent = statusText || '';
  if (_overlayPct)    _overlayPct.textContent    = Math.round(p) + '%';

  _overlaySteps.forEach((s, i) => {
    s.el.classList.remove('active','done');
    if (i < activeStep)       { s.el.classList.add('done'); s.detail.textContent = '✓ Done'; }
    else if (i === activeStep) { s.el.classList.add('active'); }
  });
}

function hideArmourOverlay() {
  if (!_overlayEl) return;
  _overlayEl.classList.add('lc-overlay-out');
  setTimeout(() => { if (_overlayEl) { _overlayEl.remove(); _overlayEl = null; } }, 420);
}

/* ─────────────────────────────────────────────────────────────
   20.  PRINT
   ───────────────────────────────────────────────────────────── */
async function lcPrint() {
  const emp = resolveCurrentEmp();
  if (!emp) { alert('No employee leave card is currently open.'); return; }

  let iframe = (_readyIframe && _readyForEmpId === emp.id
                && document.body.contains(_readyIframe))
    ? _readyIframe : null;

  _readyIframe   = null;
  _readyForEmpId = null;

  if (!iframe) {
    const logoSrc = await getLogoBase64();
    iframe = await createCaptureIframe(buildFullPage(emp, logoSrc));
  }

  await Promise.all(
    [...iframe.contentDocument.images].map(img =>
      img.decode ? img.decode().catch(() => {}) : Promise.resolve()
    )
  );
  await new Promise(r => setTimeout(r, 350));

  iframe.contentWindow.focus();
  iframe.contentWindow.print();

  const cleanup = () => {
    try { iframe.remove(); } catch (_) {}
    lcPrimeForPrint(emp);
  };
  iframe.contentWindow.addEventListener('afterprint', cleanup, { once: true });
  setTimeout(cleanup, 1500);
}
window.lcPrint = lcPrint;

/* ─────────────────────────────────────────────────────────────
   21.  DOWNLOAD PDF  v8.1
   ───────────────────────────────────────────────────────────── */
async function lcDownloadPDF(emp) {
  if (typeof html2pdf === 'undefined') {
    alert(
      'html2pdf not loaded.\n\nAdd to <head>:\n\n' +
      '<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"><\/script>'
    );
    return;
  }

  if (!emp || !emp.id) {
    const resolved = resolveCurrentEmp();
    if (!resolved) { alert('No employee leave card is currently open.'); return; }
    emp = resolved;
  }

  const dlBtn = document.querySelector('.lc-dl-btn');
  let origHTML = '', origWidth = '';
  if (dlBtn) {
    origHTML  = dlBtn.innerHTML;
    origWidth = dlBtn.style.width;
    dlBtn.disabled    = true;
    dlBtn.style.width = dlBtn.offsetWidth + 'px';
    dlBtn.innerHTML   = '🛡 &nbsp;Forging PDF…';
    dlBtn.style.opacity = '0.7';
  }

  showArmourOverlay();
  setOverlayProgress(5, 'Summoning the forge…', 0);

  try {
    const logoSrc = await getLogoBase64();
    setOverlayProgress(12, 'Loading insignia…', 0);

    setOverlayProgress(18, 'Building document layout…', 0);
    setOverlayProgress(40, 'Rendering document…', 1);
    const html = buildFullPage(emp, logoSrc);
    const buf  = await renderPageToArrayBuffer(html);
    const buffers = [buf];

    setOverlayProgress(72, 'Finalising document…', 2);
    const mergedBytes = await mergePageBuffers(buffers);

    setOverlayProgress(92, 'Sealing the document…', 3);
    const surname  = (emp.surname || 'RECORD').toUpperCase().replace(/\s+/g, '_');
    const given    = (emp.given   || '').toUpperCase().replace(/\s+/g, '_');
    const filename = `LeaveCard_${surname}_${given}.pdf`;

    const blob = new Blob([mergedBytes], { type: 'application/pdf' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 3000);

    setOverlayProgress(100, 'PDF ready — download started!', 3);
    await new Promise(r => setTimeout(r, 900));

  } catch (err) {
    console.error('[print-download] PDF error:', err);
    alert('PDF generation failed: ' + err.message);
  } finally {
    hideArmourOverlay();
    if (dlBtn) {
      dlBtn.disabled    = false;
      dlBtn.innerHTML   = origHTML || dlBtn.innerHTML;
      dlBtn.style.width = origWidth || '';
      dlBtn.style.opacity = '';
    }
  }
}
window.lcDownloadPDF = lcDownloadPDF;

/* ─────────────────────────────────────────────────────────────
   22.  RED ARMOUR BUTTON STYLES
   ───────────────────────────────────────────────────────────── */
const BUTTON_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&display=swap');

.lc-dl-btn {
  position: relative; display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 26px 12px 22px;
  font-family: 'Barlow Condensed', sans-serif !important;
  font-size: 11pt !important; font-weight: 800 !important; letter-spacing: .14em !important;
  text-transform: uppercase; color: #fff !important;
  border: none; border-radius: 10px; cursor: pointer; overflow: hidden; outline: none;
  transition: transform .18s cubic-bezier(.34,1.56,.64,1), box-shadow .18s ease;
  background: linear-gradient(160deg, #6b0e0e 0%, #8b1a1a 15%, #c0392b 40%, #e53e3e 55%, #c0392b 70%, #8b1a1a 85%, #5a0808 100%);
  box-shadow: 0 1px 0 rgba(255,255,255,.12) inset, 0 -2px 0 rgba(0,0,0,.5) inset, 2px 0 0 rgba(255,120,100,.08) inset, -2px 0 0 rgba(0,0,0,.3) inset, 0 6px 0 #5a0606, 0 7px 0 #3d0404, 0 8px 16px rgba(139,0,0,.6), 0 16px 40px rgba(139,0,0,.25), 0 0 0 1px rgba(192,57,43,.6);
  text-shadow: 0 1px 3px rgba(0,0,0,.6);
}
.lc-dl-btn::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(255,255,255,.12) 0%, rgba(255,255,255,.03) 45%, transparent 100%);
  border-radius: inherit; pointer-events: none;
}
.lc-dl-btn::after {
  content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
  background: linear-gradient(105deg, transparent 0%, rgba(255,255,255,.15) 50%, transparent 100%);
  animation: btn-shimmer 3s ease-in-out infinite; pointer-events: none;
}
@keyframes btn-shimmer { 0%,80%,100% { left: -100%; opacity:0; } 40% { left: 120%; opacity:1; } }
.lc-dl-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 1px 0 rgba(255,255,255,.15) inset, 0 -2px 0 rgba(0,0,0,.5) inset, 2px 0 0 rgba(255,120,100,.1) inset, -2px 0 0 rgba(0,0,0,.3) inset, 0 8px 0 #5a0606, 0 9px 0 #3d0404, 0 12px 28px rgba(139,0,0,.7), 0 24px 50px rgba(139,0,0,.3), 0 0 0 1px rgba(220,60,40,.8);
}
.lc-dl-btn:active { transform: translateY(4px); box-shadow: 0 1px 0 rgba(255,255,255,.1) inset, 0 -1px 0 rgba(0,0,0,.4) inset, 0 2px 0 #5a0606, 0 3px 0 #3d0404, 0 4px 12px rgba(139,0,0,.5), 0 0 0 1px rgba(192,57,43,.6); }
.lc-dl-btn:disabled { cursor: not-allowed; filter: saturate(.5) brightness(.7); }

.lc-print-btn {
  position: relative; display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 26px 12px 22px;
  font-family: 'Barlow Condensed', sans-serif !important;
  font-size: 11pt !important; font-weight: 800 !important; letter-spacing: .14em !important;
  text-transform: uppercase; color: #e8e0ff !important;
  border: none; border-radius: 10px; cursor: pointer; overflow: hidden; outline: none;
  transition: transform .18s cubic-bezier(.34,1.56,.64,1), box-shadow .18s ease;
  background: linear-gradient(160deg, #0d1a3a 0%, #1a2d6b 18%, #1e3d88 40%, #2251b3 55%, #1e3d88 70%, #1a2d6b 85%, #0a1530 100%);
  box-shadow: 0 1px 0 rgba(255,255,255,.12) inset, 0 -2px 0 rgba(0,0,0,.5) inset, 2px 0 0 rgba(100,140,255,.08) inset, -2px 0 0 rgba(0,0,0,.3) inset, 0 6px 0 #0a1530, 0 7px 0 #060e22, 0 8px 16px rgba(30,61,136,.6), 0 16px 40px rgba(30,61,136,.25), 0 0 0 1px rgba(34,81,179,.6);
  text-shadow: 0 1px 3px rgba(0,0,0,.6);
}
.lc-print-btn::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(255,255,255,.12) 0%, rgba(255,255,255,.03) 45%, transparent 100%);
  border-radius: inherit; pointer-events: none;
}
.lc-print-btn::after {
  content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
  background: linear-gradient(105deg, transparent 0%, rgba(255,255,255,.12) 50%, transparent 100%);
  animation: btn-shimmer 3.4s 1.2s ease-in-out infinite; pointer-events: none;
}
.lc-print-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 1px 0 rgba(255,255,255,.15) inset, 0 -2px 0 rgba(0,0,0,.5) inset, 0 8px 0 #0a1530, 0 9px 0 #060e22, 0 12px 28px rgba(30,61,136,.7), 0 24px 50px rgba(30,61,136,.3), 0 0 0 1px rgba(60,100,220,.8);
}
.lc-print-btn:active { transform: translateY(4px); box-shadow: 0 1px 0 rgba(255,255,255,.1) inset, 0 2px 0 #0a1530, 0 3px 0 #060e22, 0 4px 12px rgba(30,61,136,.5), 0 0 0 1px rgba(34,81,179,.6); }

.lc-back-btn {
  position: relative; display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 26px 12px 22px;
  font-family: 'Barlow Condensed', sans-serif !important;
  font-size: 11pt !important; font-weight: 800 !important; letter-spacing: .14em !important;
  text-transform: uppercase; color: #e8ddd0 !important;
  border: none; border-radius: 10px; cursor: pointer; overflow: hidden; outline: none;
  transition: transform .18s cubic-bezier(.34,1.56,.64,1), box-shadow .18s ease;
  background: linear-gradient(160deg, #0d0a08 0%, #1e1812 18%, #2e2418 40%, #3a2e1e 55%, #2e2418 70%, #1e1812 85%, #0a0806 100%);
  box-shadow: 0 1px 0 rgba(255,255,255,.10) inset, 0 -2px 0 rgba(0,0,0,.5) inset, 2px 0 0 rgba(200,160,80,.06) inset, -2px 0 0 rgba(0,0,0,.3) inset, 0 6px 0 #0a0806, 0 7px 0 #060502, 0 8px 16px rgba(0,0,0,.55), 0 16px 40px rgba(0,0,0,.25), 0 0 0 1px rgba(180,140,60,.35);
  text-shadow: 0 1px 3px rgba(0,0,0,.7);
}
.lc-back-btn::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(255,255,255,.10) 0%, rgba(255,255,255,.02) 45%, transparent 100%);
  border-radius: inherit; pointer-events: none;
}
.lc-back-btn::after {
  content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
  background: linear-gradient(105deg, transparent 0%, rgba(255,255,255,.10) 50%, transparent 100%);
  animation: btn-shimmer 4s 2s ease-in-out infinite; pointer-events: none;
}
.lc-back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 1px 0 rgba(255,255,255,.12) inset, 0 -2px 0 rgba(0,0,0,.5) inset, 0 8px 0 #0a0806, 0 9px 0 #060502, 0 12px 28px rgba(0,0,0,.6), 0 24px 50px rgba(0,0,0,.3), 0 0 0 1px rgba(200,160,80,.55);
}
.lc-back-btn:active { transform: translateY(4px); box-shadow: 0 1px 0 rgba(255,255,255,.08) inset, 0 2px 0 #0a0806, 0 3px 0 #060502, 0 4px 12px rgba(0,0,0,.5), 0 0 0 1px rgba(180,140,60,.35); }
`;

function injectButtonStyles() {
  if (document.getElementById('lc-btn-styles')) return;
  const st = document.createElement('style');
  st.id = 'lc-btn-styles';
  st.textContent = BUTTON_CSS;
  document.head.appendChild(st);
}

/* ─────────────────────────────────────────────────────────────
   23.  BUTTON WIRING
   ───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', injectButtonStyles);
injectButtonStyles();

document.addEventListener('click', function (e) {
  if (e.target.closest('.lc-dl-btn')) {
    e.stopImmediatePropagation();
    lcDownloadPDF();
    return;
  }
  if (e.target.closest('.lc-print-btn')) {
    e.stopImmediatePropagation();
    lcPrint();
  }
}, true);

// Pre-warm logo on script load
getLogoBase64();

/* ─────────────────────────────────────────────────────────────
   24.  EXPOSE SHARED API for bulk-export.js
        FIX v8.1: Moved OUT of renderPageToArrayBuffer closure
   ───────────────────────────────────────────────────────────── */
window.getLogoBase64           = getLogoBase64;
window.buildExportHTML         = buildExportHTML;
window.buildFullPage           = buildFullPage;
window.buildPageHTML           = buildPageHTML;
window.flattenRecords          = flattenRecords;
window.sliceIntoPages          = sliceIntoPages;
window.renderPageToArrayBuffer = renderPageToArrayBuffer;
window.mergePageBuffers        = mergePageBuffers;
window.showArmourOverlay       = showArmourOverlay;
window.setOverlayProgress      = setOverlayProgress;
window.hideArmourOverlay       = hideArmourOverlay;
window.SHARED_CSS              = SHARED_CSS;
