/*
  WHAT THIS FILE DOES:
  This is the MAIN file for the leave card feature. It ties everything together.
  When you open an employee's leave card, this file runs first and coordinates
  all the other leavecard-*.js files.

  WHAT IT COVERS:
  1. OPENING a leave card — loads the employee's records from the server,
     builds the full page layout (profile info, buttons, form, table).
  2. PROFILE DISPLAY — shows the employee's name, ID, category, and school.
  3. ADD RECORD button — clicking it activates the entry form (leavecard-form.js).
  4. FORCE LEAVE button — applies a mandatory 5-day deduction to Set A (VL),
     but only once per employee per year. Button is disabled after use.
  5. PRINT button — triggers the browser's print dialog.

  KEY FUNCTIONS:
  - openLeaveCardInContainer() → the main function; builds and shows the entire
                                 leave card view inside a given HTML container
  - lcField() / profileField() → small helpers that generate profile info HTML

  LOAD ORDER NOTE:
  This file must be loaded LAST among all leavecard-*.js files in the HTML,
  because it depends on all of them being available first.
*/
'use strict';

// ── Small profile-field builders ──────────────────────────────────────
function lcField(label, value) {
  return `<div class="lc-pf">
    <div class="lc-pf-label">${escHtml(label)}</div>
    <div class="lc-pf-value">${escHtml(value || '') || '&mdash;'}</div>
  </div>`;
}

function profileField(label, value) {
  return `<div class="pi"><label>${escHtml(label)}</label><span>${escHtml(value || '—')}</span></div>`;
}

// ── Open the full leave card inside a container element ───────────────
async function openLeaveCardInContainer(emp, container) {
  // Lazy-load records on first open
  if (!emp.records || emp.records.length === 0) {
    const res = await apiCall('get_records', { employee_id: emp.id }, 'GET');
    if (res.ok) emp.records = res.records || [];
  }
  sortRecordsInPlace(emp.records);

  const canEdit = state.isAdmin || state.isEncoder;

  // Check whether Force Leave was already applied this year
  let forceLeaveApplied = false;
  if (canEdit) {
    const flRes = await apiCall('check_force_leave_status', { employee_id: emp.id }, 'GET');
    if (flRes.ok) forceLeaveApplied = flRes.applied;
  }

  // ── Profile block ──
  const profileHtml = `<div class="cb"><div class="pg">
    ${profileField('Employee No.', emp.id)}
    ${profileField('Full Name', `${emp.surname}, ${emp.given} ${emp.suffix || ''}`)}
    ${profileField('Category', emp.status || '')}
    ${profileField('School', emp.school || '')}
  </div></div>`;

  // ── Force Leave button ──
  const forceBtnStyle = forceLeaveApplied
    ? 'background:rgba(255,100,100,.18);color:rgba(255,200,200,.6);border:1px solid rgba(255,100,100,.25);cursor:not-allowed;'
    : 'background:rgba(255,165,0,.22);color:#fde68a;border:1px solid rgba(255,165,0,.4);';
  const isNTorTR = ['non-teaching','teaching related'].includes((emp.status||'').toLowerCase());
  const forceBtnHtml = canEdit && isNTorTR ? `
    <button class="btn b-sm no-print" id="cForceLeave"
      style="${forceBtnStyle}"
      title="${forceLeaveApplied ? 'Force/Mandatory Leave already applied this year' : 'Apply Force/Mandatory Leave (deducts 5 days from Set A)'}"
      ${forceLeaveApplied ? 'disabled' : ''}>
      ⚡ Force Leave${forceLeaveApplied ? ' ✓' : ''}
    </button>` : '';

  // ── Container HTML ──
  container.innerHTML = `<div class="card" style="margin-top:20px;">
    <div class="ch grn" style="justify-content:space-between;">
      <span>📋 ${escHtml(emp.surname)}, ${escHtml(emp.given)}</span>
      <div style="display:flex;gap:8px;" class="no-print">
        ${canEdit ? `<button class="btn b-sm" style="background:rgba(255,255,255,.15);color:white;border:1px solid rgba(255,255,255,.3);" id="cAddRec">➕ Add Record</button>` : ''}
        ${canEdit ? `<button class="btn b-sm" style="background:rgba(30,58,138,.35);color:#93c5fd;border:1px solid rgba(59,130,246,.4);" id="cAddPrcRec">📋 Personnel Record</button>` : ''}
        ${forceBtnHtml}
        <button class="btn b-sm" style="background:rgba(255,255,255,.15);color:white;border:1px solid rgba(255,255,255,.3);" onclick="window.print()">🖨️ Print</button>
      </div>
    </div>
    ${profileHtml}
${canEdit ? buildLeaveEntryForm(emp) : ''}
${canEdit ? buildPersonnelEntryForm() : ''}
    <div id="prcTableWrap" style="padding:0 4px;margin-top:12px;"></div>
    <div id="lcTableWrap"></div>
  </div>`;

  // AFTER (correct order):
  sortRecordsInPlace(emp.records);
await saveRowBalances(emp.records, emp.id, emp.status);
const freshRes = await apiCall('get_records', { employee_id: emp.id }, 'GET');
if (freshRes.ok) emp.records = freshRes.records || [];
sortRecordsInPlace(emp.records);
lcPrimeForPrint(emp); // ← ADD THIS LINE
renderLeaveCardTable(emp);

  // Store emp reference for personnel table row actions
  window._currentPrcEmp = emp;

// Load existing personnel records — always reload fresh
  const prcRes = await apiCall('get_personnel_records', { employee_id: emp.id }, 'GET');
  if (prcRes.ok) emp.personnelRecords = prcRes.records || [];
  else emp.personnelRecords = emp.personnelRecords || [];

  // Render personnel table
  renderPersonnelTable(emp);

  // Wire "Add Record" button
  document.getElementById('cAddRec')?.addEventListener('click', () => {
    if (canEdit) wireLeaveEntryForm(emp, null);
  });

// Wire "Add Personnel Record" button — scrolls to the inline form
document.getElementById('cAddPrcRec')?.addEventListener('click', () => {
    if (canEdit) showPersonnelRecordModal(emp, null);
});

document.getElementById('cAddPrcRec2')?.addEventListener('click', () => {
    if (canEdit) showPersonnelRecordModal(emp, null);
});

  // Wire Force Leave button
  const forceLvBtn = document.getElementById('cForceLeave');
  if (forceLvBtn && !forceLeaveApplied) {
    forceLvBtn.addEventListener('click', async () => {
      const currentYear = new Date().getFullYear();
      if (!confirm(
        `Apply Force/Mandatory Leave for ${escHtml(emp.surname)}, ${escHtml(emp.given)}?\n\n` +
        `This will DEDUCT 5 days from Set A (VL) balance.\n` +
        `This action can only be done ONCE per employee per year (${currentYear}).`
      )) return;

      forceLvBtn.disabled    = true;
      forceLvBtn.textContent = 'Applying…';

      const res = await apiCall('apply_force_leave', { employee_id: emp.id, amount: 5 });

      if (!res.ok) {
        forceLvBtn.disabled    = false;
        forceLvBtn.textContent = '⚡ Force Leave';
        if (res.already) {
          alert('Force/Mandatory Leave has already been applied for this employee this year.');
          openLeaveCardInContainer(emp, container);
        } else {
          alert('Error: ' + (res.error || 'Could not apply force leave.'));
        }
        return;
      }

      const res2 = await apiCall('get_records', { employee_id: emp.id }, 'GET');
      if (res2.ok) emp.records = res2.records || [];
      sortRecordsInPlace(emp.records);
      await saveRowBalances(emp.records, emp.id, emp.status);

      const res3 = await apiCall('get_records', { employee_id: emp.id }, 'GET');
      if (res3.ok) emp.records = res3.records || [];
      sortRecordsInPlace(emp.records);

      if (typeof refreshEmpCardStatus === 'function') refreshEmpCardStatus(emp);
      openLeaveCardInContainer(emp, container);
    });
  }

  wireRowMenus(emp);
}
