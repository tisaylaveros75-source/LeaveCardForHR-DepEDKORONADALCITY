/* ============================================================
   SDO Koronadal City — Leave Card System
   employee.js  — Employee Leave Card View

   !! LOAD ORDER IN app.blade.php !!
   employee.js MUST come AFTER app.js so it can override
   renderUserPage. Correct order:

     <script src="{{ asset('js/app.js') }}"></script>
     <script src="{{ asset('js/employee.js') }}"></script>   ← AFTER app.js
     <script src="{{ asset('js/print-download.js?v=5.8') }}"></script>
     <script src="{{ asset('js/pdf-export.js?v=4.0') }}"></script>

   ============================================================ */
'use strict';

/* ─────────────────────────────────────────────────────────────
   _empRenderTopbar
   Employee topbar: logo + name + Logout button only.
   No hamburger, no sidebar toggle.
   ───────────────────────────────────────────────────────────── */
function _empRenderTopbar(emp) {
  const tb = document.getElementById('topbar');
  if (!tb) return;

  const firstName = escHtml(emp?.given   || '');
  const lastName  = escHtml(emp?.surname || '');
  const fullName  = [lastName, firstName].filter(Boolean).join(', ') || 'Employee';

  tb.innerHTML = `
    <div class="tb-in">
      <div class="tb-brand">
        <img class="tb-logo" src="/img/sdo.jpg"
             onerror="this.src='https://upload.wikimedia.org/wikipedia/en/a/a8/DepEd_Koronadal.png'"
             alt="DepEd"/>
        <div class="tb-divider"></div>
        <div>
          <div class="tb-title">SDO Koronadal City</div>
          <div class="tb-sub">Leave Card Management System</div>
        </div>
      </div>
      <div class="tb-nav">
        <span style="font-size:11px;color:var(--mu);margin-right:8px;">
          Logged in as <strong>${fullName}</strong>
        </span>
        <button class="nb out" id="empLogoutBtn">🚪 Logout</button>
      </div>
    </div>`;

  document.getElementById('empLogoutBtn')
    ?.addEventListener('click', () => {
      if (typeof showLogoutModal === 'function') showLogoutModal();
      else if (typeof doLogout   === 'function') doLogout();
    });
}

/* ─────────────────────────────────────────────────────────────
   _empHideSidebar
   Employees have no sidebar — clear it and hide the overlay.
   ───────────────────────────────────────────────────────────── */
function _empHideSidebar() {
  const sb      = document.getElementById('sidebar');
  const overlay = document.getElementById('sbOverlay');
  if (sb)      sb.innerHTML = '';
  if (overlay) overlay.style.display = 'none';
}

/* ─────────────────────────────────────────────────────────────
   renderUserPage
   Shows the EXACT same leave card the admin sees — same
   profile block, same era/table via renderLeaveCardTable(),
   same Print/Download buttons wired to the shared pipeline.
   No entry form (canEdit = false for employee role).
   ───────────────────────────────────────────────────────────── */
async function renderUserPage() {
  const el = document.getElementById('pg-user');
  if (!el) return;

  /* Loading placeholder */
  el.innerHTML = `
    <div style="text-align:center;padding:60px 20px;color:#9a8a8a;
                font-family:Inter,sans-serif;">
      <div style="font-size:32px;margin-bottom:12px;">⏳</div>
      <div style="font-size:13px;">Loading your leave card…</div>
    </div>`;

  /* Fetch employee + records */
  const emp = await ensureRecords(state.curId);
  if (!emp) {
    el.innerHTML = `
      <div style="padding:48px;text-align:center;color:#c0392b;
                  font-family:Inter,sans-serif;">
        <div style="font-size:32px;margin-bottom:12px;">⚠️</div>
        Employee record not found.
      </div>`;
    return;
  }

  /* Apply employee-specific chrome (no sidebar, clean topbar) */
  _empRenderTopbar(emp);
  _empHideSidebar();

  /* Sort records */
  if (typeof sortRecordsInPlace === 'function') sortRecordsInPlace(emp.records);

  /* ── Category label ── */
  const statusLC      = (emp.status || '').toLowerCase();
  const isT           = statusLC === 'teaching';
  const isTR          = statusLC === 'teaching related';
  const categoryLabel = isT  ? 'TEACHING'
                      : isTR ? 'TEACHING RELATED'
                             : 'NON-TEACHING';

  /* ── lcField helper (defined in leavecard.js; inline fallback) ── */
  const _lcField = (typeof lcField === 'function')
    ? lcField
    : (label, val) => `
        <div class="lc-pf">
          <div class="lc-pf-label">${escHtml(label)}</div>
          <div class="lc-pf-value">${escHtml(val || '') || '&mdash;'}</div>
        </div>`;

  /* ── Page HTML — identical to openLeaveCard(), minus entry form & back btn ── */
  el.innerHTML = `
    <div class="lc-view">

      <!-- ── Action bar: Print + Download only ── -->
      <div class="lc-topbar no-print">
        <div style="display:flex;gap:10px;align-items:center;margin-left:auto;">
          <button class="btn lc-dl-btn"    id="empDlBtn">⬇ DOWNLOAD PDF</button>
          <button class="btn lc-print-btn" id="empPrintBtn">🖨 PRINT</button>
        </div>
      </div>

      <!-- ── Profile card — exact same markup as admin view ── -->
      <div class="lc-profile-card">
        <div class="lc-profile-header">
          <img src="/img/sdo.jpg"
               onerror="this.src='https://upload.wikimedia.org/wikipedia/en/a/a8/DepEd_Koronadal.png'"
               class="lc-ph-logo"/>
          <span>📋 ${categoryLabel} PERSONNEL LEAVE RECORD</span>
        </div>
        <div class="lc-profile-grid">
          <div class="lc-pf-row lc-pf-4col">
            ${_lcField('SURNAME',          emp.surname  || '')}
            ${_lcField('GIVEN NAME',       emp.given    || '')}
            ${_lcField('SUFFIX',           emp.suffix   || '')}
            ${_lcField('MATERNAL SURNAME', emp.maternal || '')}
          </div>
          <div class="lc-pf-row lc-pf-4col">
            ${_lcField('SEX',            emp.sex   || '')}
            ${_lcField('CIVIL STATUS',   emp.civil || '')}
            ${_lcField('DATE OF BIRTH',  fmtD(emp.dob   || ''))}
            ${_lcField('PLACE OF BIRTH', emp.pob   || '')}
          </div>
          <div class="lc-pf-row lc-pf-2col">
            ${_lcField('PRESENT ADDRESS', emp.addr   || '')}
            ${_lcField('NAME OF SPOUSE',  emp.spouse || '')}
          </div>
          <div class="lc-pf-row lc-pf-2col">
            ${_lcField('EDUCATIONAL QUALIFICATION',      emp.edu  || '')}
            ${_lcField('C.S. ELIGIBILITY: KIND OF EXAM', emp.elig || '')}
          </div>
          <div class="lc-pf-row lc-pf-4col">
            ${_lcField('RATING',        emp.rating || '')}
            ${_lcField('TIN NUMBER',    emp.tin    || '')}
            ${_lcField('PLACE OF EXAM', emp.pexam  || '')}
            ${_lcField('DATE OF EXAM',  fmtD(emp.dexam || ''))}
          </div>
          <div class="lc-pf-row lc-pf-3col">
            ${_lcField('EMPLOYEE NUMBER',              emp.id  || '')}
            ${_lcField('DATE OF ORIGINAL APPOINTMENT', fmtD(emp.appt || ''))}
            ${_lcField('POSITION',                     emp.pos || '')}
          </div>
          <div class="lc-pf-row lc-pf-1col">
            ${_lcField('SCHOOL / OFFICE', emp.school || '')}
          </div>
        </div>
      </div>

      <!-- ── Leave records table — renderLeaveCardTable handles eras ── -->
      <div id="lcTableWrap"></div>

    </div>`;

  /* ── Render the leave card table (same function admins use) ──
     canEdit is false for employees because state.isAdmin and
     state.isEncoder are both false — buildLeaveRow() skips
     the ⋮ action menu automatically.                         ── */
  if (typeof renderLeaveCardTable === 'function') {
    renderLeaveCardTable(emp);
  }

  /* ── Wire Print — same pipeline as admin ── */
  document.getElementById('empPrintBtn')?.addEventListener('click', () => {
    if (typeof pdfExportPrint   === 'function') pdfExportPrint(emp);
    else if (typeof lcPrint     === 'function') lcPrint(emp);
    else window.print();
  });

  /* ── Wire Download PDF — same pipeline as admin ── */
  document.getElementById('empDlBtn')?.addEventListener('click', () => {
    if (typeof pdfExportDownload === 'function') pdfExportDownload(emp);
    else if (typeof lcDownloadPDF === 'function') lcDownloadPDF(emp);
    else alert('PDF download is not available.');
  });
}

/* ─────────────────────────────────────────────────────────────
   Expose — overrides the versions defined in app.js.
   employee.js MUST be loaded AFTER app.js.
   ───────────────────────────────────────────────────────────── */
window.renderUserPage = renderUserPage;