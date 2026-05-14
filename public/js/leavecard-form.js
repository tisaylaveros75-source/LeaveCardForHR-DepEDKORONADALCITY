/*
  WHAT THIS FILE DOES:
  This file handles the Leave Entry Form — the form that admins/encoders
  use to add or edit a leave record for an employee.

  WHAT IT COVERS:
  1. BUILDING the form — creates the HTML for the form (inputs, buttons, dropdowns).
  2. WIRING the form — makes the form interactive:
       - Shows/hides extra fields depending on the selected leave type
         (e.g. "Monetization" shows extra VL/SL amount fields)
       - Handles the AM / PM / WD period buttons
       - Handles the calendar date pickers
       - Pre-fills the form when you're editing an existing record
  3. SAVING — sends the form data to the server (add new or update existing).
  4. RESETTING — clears the form back to blank after saving or cancelling.

  KEY FUNCTIONS:
  - buildLeaveEntryForm()   → returns the HTML string for the form
  - wireLeaveEntryForm()    → attaches all click/input events and handles save/edit logic
  - collectEntryForm()      → reads all form inputs and packages them into a record object
  - resetLeaveEntryForm()   → clears all form fields and resets buttons to default state
*/
'use strict';

const LEAVE_TYPES = [
  'Monthly Accrual', 'Vacation Leave', 'Sick Leave',
  'Forced/Mandatory Leave', 'Forced/Mandatory Leave (Disapproved)',
  'Personal Leave (W/O Pay)', 'Monetization', 'Monetization (Disapproved)',
  'Terminal Leave', 'Maternity Leave', 'Paternity Leave',
  'Magna Carta (SLB)', 'Credit Entry', 'Solo Parent Leave',
  'Wellness Leave', 'Special Privilege Leave (SPL)',
  'Disapproved Leave', 'VAWC Leave',
  'Rehabilitation Leave', 'Study Leave',
];

// ── One shared date-picker popup (created once, reused for all cal buttons) ──
function ensureDatePickerPopup() {
  if (document.getElementById('lc-date-popup')) return;
  const popup = document.createElement('div');
  popup.id = 'lc-date-popup';
  popup.innerHTML = `
    <div id="lc-date-popup-inner">
      <div class="lc-dp-label" id="lc-dp-label">Select Date</div>
      <input type="date" id="lc-dp-native" />
      <div class="lc-dp-actions">
        <button type="button" id="lc-dp-cancel">Cancel</button>
        <button type="button" id="lc-dp-apply">Apply</button>
      </div>
    </div>`;
  document.body.appendChild(popup);

  // Inject styles once
  if (!document.getElementById('lc-dp-style')) {
    const s = document.createElement('style');
    s.id = 'lc-dp-style';
    s.textContent = `
      #lc-date-popup {
        display: none;
        position: absolute;
        z-index: 99999;
        background: #0d0404;
        border: 1px solid #5a0a0a;
        border-top: 2px solid #8b0000;
        border-radius: 8px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.75);
        padding: 14px;
        min-width: 220px;
      }
      #lc-date-popup.lc-dp-open { display: block; }
      .lc-dp-label {
        font-size: 10px;
        font-weight: 800;
        letter-spacing: .14em;
        text-transform: uppercase;
        color: #4a2020;
        margin-bottom: 10px;
      }
      #lc-dp-native {
        width: 100%;
        height: 38px;
        padding: 0 10px;
        background: #060202;
        border: 1px solid #2a0808;
        border-radius: 5px;
        color: #d0d0d0;
        font-size: 14px;
        font-family: inherit;
        outline: none;
        color-scheme: dark;
      }
      #lc-dp-native:focus { border-color: #8b0000; }
      .lc-dp-actions {
        display: flex;
        gap: 8px;
        margin-top: 10px;
        justify-content: flex-end;
      }
      .lc-dp-actions button {
        height: 34px;
        padding: 0 16px;
        border-radius: 5px;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: .08em;
        text-transform: uppercase;
        cursor: pointer;
        border: 1px solid #2a0808;
        background: #0a0202;
        color: #666;
      }
      #lc-dp-apply {
        background: #4a0808;
        border-color: #8b0000;
        color: #d0d0d0;
      }
      #lc-dp-apply:hover { background: #5a0a0a; color: #f0f0f0; }
      .lc-dp-actions button:hover { color: #999; }
    `;
    document.head.appendChild(s);
  }

  // Cancel
  document.getElementById('lc-dp-cancel').addEventListener('click', closeDatePopup);

  // Close on outside click
  document.addEventListener('click', (e) => {
    const popup = document.getElementById('lc-date-popup');
    if (popup && popup.classList.contains('lc-dp-open') && !popup.contains(e.target)) {
      closeDatePopup();
    }
  });
}

function closeDatePopup() {
  const popup = document.getElementById('lc-date-popup');
  if (popup) {
    popup.classList.remove('lc-dp-open');
    popup._applyCallback = null;
  }
}

// Open the popup anchored just below the triggering button
function openDatePopup(anchorEl, labelText, currentVal, onApply) {
  ensureDatePickerPopup();
  const popup   = document.getElementById('lc-date-popup');
  const native  = document.getElementById('lc-dp-native');
  const label   = document.getElementById('lc-dp-label');
  const applyBtn = document.getElementById('lc-dp-apply');

  label.textContent = labelText || 'Select Date';
  native.value = currentVal || '';

  // Position anchored to the button
  const rect    = anchorEl.getBoundingClientRect();
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  const scrollX = window.scrollX || document.documentElement.scrollLeft;

  popup.style.top  = (rect.bottom + scrollY + 4) + 'px';
  popup.style.left = (rect.left   + scrollX)      + 'px';

  // Flip above if it would go off-screen bottom
  popup.classList.add('lc-dp-open');
  const popupRect = popup.getBoundingClientRect();
  if (popupRect.bottom > window.innerHeight - 8) {
    popup.style.top = (rect.top + scrollY - popup.offsetHeight - 4) + 'px';
  }

  // Flip left if it would go off-screen right
  if (popupRect.right > window.innerWidth - 8) {
    popup.style.left = (rect.right + scrollX - popup.offsetWidth) + 'px';
  }

  // Wire apply — replace to avoid duplicate listeners
  const newApply = applyBtn.cloneNode(true);
  applyBtn.parentNode.replaceChild(newApply, applyBtn);
  newApply.id = 'lc-dp-apply';
  newApply.addEventListener('click', () => {
    const val = document.getElementById('lc-dp-native').value;
    if (val && onApply) onApply(val);
    closeDatePopup();
  });
}

// ── Build the entry form HTML (inserted once per leave card view) ─────
function buildLeaveEntryForm(emp) {
  return `
    <div class="lc-entry-card no-print" id="leaveEntryPanel">
      <div class="lc-entry-header"><span>LEAVE ENTRY FORM</span></div>
      <div class="lc-entry-body">

        <!-- Row 1 — main fields -->
        <div class="lc-entry-row">

          <div class="lc-ef">
            <label>SPECIAL ORDER #</label>
            <input id="le_so" type="text" placeholder=""/>
          </div>

          <div class="lc-ef">
            <label>PERIOD COVERED</label>
            <input id="le_prd" type="text" placeholder=""/>
          </div>

          <!-- DATE FROM -->
          <div class="lc-ef lc-ef-date">
            <label>DATE FROM</label>
            <div class="lc-date-wrap">
              <div class="lc-date-row">
                <input id="le_from" class="date-text" type="text" placeholder="mm/dd/yyyy"/>
                <button class="lc-cal-btn" tabindex="-1" data-dp-label="Date From" data-dp-target="le_from">📅</button>
              </div>
              <div class="lc-period-btns">
                <button class="lc-per-btn"               id="le_fp_am" type="button">AM</button>
                <button class="lc-per-btn"               id="le_fp_pm" type="button">PM</button>
                <button class="lc-per-btn lc-per-active" id="le_fp_wd" type="button">WD</button>
              </div>
            </div>
            <input type="hidden" id="le_fp" value="WD"/>
          </div>

          <!-- DATE TO -->
          <div class="lc-ef lc-ef-date">
            <label>DATE TO</label>
            <div class="lc-date-wrap">
              <div class="lc-date-row">
                <input id="le_to" class="date-text" type="text" placeholder="mm/dd/yyyy"/>
                <button class="lc-cal-btn" tabindex="-1" data-dp-label="Date To" data-dp-target="le_to">📅</button>
              </div>
              <div class="lc-period-btns">
                <button class="lc-per-btn"               id="le_tp_am" type="button">AM</button>
                <button class="lc-per-btn"               id="le_tp_pm" type="button">PM</button>
                <button class="lc-per-btn lc-per-active" id="le_tp_wd" type="button">WD</button>
              </div>
            </div>
            <input type="hidden" id="le_tp" value="WD"/>
          </div>

          <!-- TYPE OF LEAVE -->
          <div class="lc-ef lc-ef-wide">
            <label>TYPE OF LEAVE <span style="font-weight:400;font-size:10px;color:var(--mu);">(optional)</span></label>
            <input id="le_action" list="leaveTypesList" placeholder="Select or type…" autocomplete="off"/>
            <datalist id="leaveTypesList">
              ${LEAVE_TYPES.map(t => `<option value="${escHtml(t)}">`).join('')}
            </datalist>
          </div>

          <!-- ADDITIONAL NOTE -->
          <div class="lc-ef lc-ef-wide">
            <label>ADDITIONAL NOTE</label>
            <input id="le_spec" type="text" placeholder="e.g. per CSC MC No. 14"/>
          </div>

        </div>

        <!-- Row 2 — conditional numeric fields + buttons -->
        <div class="lc-entry-row2">

          <div class="lc-ef lc-ef-sm" id="le_earned_wrap" style="display:none;">
            <label>VALUE EARNED</label>
            <input id="le_earned" type="number" step="any" placeholder="e.g. 1.25"/>
          </div>

          <div class="lc-ef lc-ef-sm" id="le_force_wrap" style="display:none;">
            <label id="le_force_label">FORCE AMOUNT</label>
            <input id="le_force" type="number" step="any" value="0"/>
          </div>

          <div class="lc-ef lc-ef-sm" id="le_monV_wrap" style="display:none;">
            <label id="le_monV_label">MONETIZATION — SET A (VL)</label>
            <input id="le_monV" type="number" step="any" value="0" placeholder="0"/>
          </div>
          <div class="lc-ef lc-ef-sm" id="le_monS_wrap" style="display:none;">
            <label>MONETIZATION — SET B (SL)</label>
            <input id="le_monS" type="number" step="any" value="0" placeholder="0"/>
          </div>

          <div class="lc-ef lc-ef-sm" id="le_monDV_wrap" style="display:none;">
            <label id="le_monDV_label">MON. DISAPPROVED — SET A (VL)</label>
            <input id="le_monDV" type="number" step="any" value="0" placeholder="0"/>
          </div>
          <div class="lc-ef lc-ef-sm" id="le_monDS_wrap" style="display:none;">
            <label>MON. DISAPPROVED — SET B (SL)</label>
            <input id="le_monDS" type="number" step="any" value="0" placeholder="0"/>
          </div>

          <div class="lc-ef lc-ef-sm" id="le_trV_wrap" style="display:none;">
            <label id="le_trV_label">CREDIT ENTRY — SET A (VL)</label>
            <input id="le_trV" type="number" step="any" value="0" placeholder="0"/>
          </div>
          <div class="lc-ef lc-ef-sm" id="le_trS_wrap" style="display:none;">
            <label>CREDIT ENTRY — SET B (SL)</label>
            <input id="le_trS" type="number" step="any" value="0" placeholder="0"/>
          </div>

<div id="le_err" class="lc-err"></div>
<button class="btn lc-save-btn"        id="leaveEntrySave" type="button">💾 SAVE ENTRY</button>
          <button class="btn lc-cancel-edit-btn" id="leCancelEdit"   type="button" style="display:none;">✕ CANCEL EDIT</button>
          <button class="btn" id="cAddPrcRec2" type="button" style="background:linear-gradient(135deg,#1e3a6e,#2251b3);color:#fff;border:1px solid rgba(59,130,246,.5);padding:0 16px;font-size:12px;font-weight:700;letter-spacing:.5px;border-radius:10px;box-shadow:0 4px 14px rgba(30,58,110,.5);cursor:pointer;align-self:stretch;">📋 Personnel Record</button>
        </div>

      </div>
    </div>`;
}

// ── Wire all interactions on the entry form ───────────────────────────
function wireLeaveEntryForm(emp, editRecord) {
  const panel = document.getElementById('leaveEntryPanel');
  if (!panel) return;

  const actionInput   = panel.querySelector('#le_action');
  const empIsTeaching = (emp.status || '').toLowerCase() === 'teaching';

  // ── Show/hide conditional fields based on selected action ──
  function toggleConditionalFields() {
    const a = (actionInput?.value || '').toLowerCase().trim();

    const isAcc      = a.includes('monthly accrual');
    const isForce    = (a.includes('force') || a.includes('mandatory')) && !a.includes('disapproved');
    const isForceDis = (a.includes('force') || a.includes('mandatory')) &&  a.includes('disapproved');
    const isMon      = a.includes('monetization') && !a.includes('disapproved');
    const isMD       = a.includes('monetization') &&  a.includes('disapproved');
    const isTR       = a.includes('credit entry') || a.includes('from denr');

    _show(panel, '#le_earned_wrap', isAcc);

    _show(panel, '#le_force_wrap', isForce || isForceDis);
    const fLbl = panel.querySelector('#le_force_label');
    if (fLbl) fLbl.textContent = isForceDis ? 'FORCE AMOUNT (ADD BACK)' : 'FORCE AMOUNT';

    _show(panel, '#le_monV_wrap', isMon);
    if (isMon) {
      const lbl = panel.querySelector('#le_monV_label');
      if (lbl) lbl.textContent = empIsTeaching ? 'MONETIZATION AMOUNT' : 'MONETIZATION — SET A (VL)';
    }
    _show(panel, '#le_monS_wrap', isMon && !empIsTeaching);

    _show(panel, '#le_monDV_wrap', isMD);
    if (isMD) {
      const lbl = panel.querySelector('#le_monDV_label');
      if (lbl) lbl.textContent = empIsTeaching ? 'MON. DISAPPROVED — AMOUNT TO ADD BACK' : 'MON. DISAPPROVED — SET A (VL)';
    }
    _show(panel, '#le_monDS_wrap', isMD && !empIsTeaching);

    _show(panel, '#le_trV_wrap', isTR);
    if (isTR) {
      const lbl = panel.querySelector('#le_trV_label');
      if (lbl) lbl.textContent = empIsTeaching ? 'CREDIT ENTRY — AMOUNT' : 'CREDIT ENTRY — SET A (VL)';
    }
    _show(panel, '#le_trS_wrap', isTR && !empIsTeaching);
  }

  actionInput?.addEventListener('input', toggleConditionalFields);
  toggleConditionalFields();

  // ── AM / PM / WD period buttons ──
  ['fp', 'tp'].forEach(fp => {
    ['am', 'pm', 'wd'].forEach(p => {
      const btn = document.getElementById(`le_${fp}_${p}`);
      if (!btn) return;
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      newBtn.addEventListener('click', () => {
        ['am', 'pm', 'wd'].forEach(x =>
          document.getElementById(`le_${fp}_${x}`)?.classList.remove('lc-per-active')
        );
        newBtn.classList.add('lc-per-active');
        document.getElementById(`le_${fp}`).value = p.toUpperCase();
      });
    });
  });

// ── Calendar date pickers — native browser picker ──
  panel.querySelectorAll('.lc-cal-btn').forEach(calBtn => {
    const targetId = calBtn.dataset.dpTarget;
    const txtInput = document.getElementById(targetId);

    const hiddenPicker = document.createElement('input');
    hiddenPicker.type = 'date';
    hiddenPicker.style.cssText =
      'position:fixed;opacity:0;pointer-events:none;width:1px;height:1px;border:none;padding:0;margin:0;';
    document.body.appendChild(hiddenPicker);

    const newCalBtn = calBtn.cloneNode(true);
    calBtn.parentNode.replaceChild(newCalBtn, calBtn);

    newCalBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeDatePopup();

      // Position hidden input directly on top of the button
      const rect = newCalBtn.getBoundingClientRect();
      hiddenPicker.style.top  = rect.bottom + 'px';
      hiddenPicker.style.left = rect.left + 'px';

      if (txtInput && txtInput.value) {
        hiddenPicker.value = toISODate(txtInput.value) || '';
      }
      hiddenPicker.showPicker ? hiddenPicker.showPicker() : hiddenPicker.click();
    });

    hiddenPicker.addEventListener('change', () => {
      if (hiddenPicker.value && txtInput) {
        txtInput.value = fmtD(hiddenPicker.value);
      }
      hiddenPicker.value = '';
    });
  });

  // Text inputs — auto-format as user types
  panel.querySelectorAll('.date-text').forEach(txt => {
    txt.addEventListener('input', () => { txt.value = fmtDateInput(txt.value); });
  });

  // ── Pre-fill form when editing an existing record ──
  if (editRecord) {
    const r = editRecord;
    _val(panel, '#le_so',     r.so     || '');
    _val(panel, '#le_prd',    r.prd    || '');
    _val(panel, '#le_from',   fmtD(r.from || ''));
    _val(panel, '#le_to',     fmtD(r.to   || ''));
    _val(panel, '#le_action', r.action || '');
    _val(panel, '#le_spec',   r.spec   || '');
    _val(panel, '#le_earned', r.earned || '');
    _val(panel, '#le_force',  r.forceAmount || 0);
    _val(panel, '#le_monV',   r.monV  || 0);
    _val(panel, '#le_monS',   r.monS  || 0);
    _val(panel, '#le_monDV',  r.monDV || 0);
    _val(panel, '#le_monDS',  r.monDS || 0);
    _val(panel, '#le_trV',    r.trV   || 0);
    _val(panel, '#le_trS',    r.trS   || 0);

    ['fp', 'tp'].forEach(fp => {
      const val = (fp === 'fp' ? r.fromPeriod : r.toPeriod) || 'WD';
      ['am', 'pm', 'wd'].forEach(x =>
        document.getElementById(`le_${fp}_${x}`)?.classList.remove('lc-per-active')
      );
      document.getElementById(`le_${fp}_${val.toLowerCase()}`)?.classList.add('lc-per-active');
      document.getElementById(`le_${fp}`).value = val;
    });

    panel.dataset.editId = r._record_id;
    document.getElementById('leaveEntrySave').textContent = '💾 UPDATE ENTRY';
    document.getElementById('leCancelEdit').style.display = '';
    toggleConditionalFields();
    panel.querySelector('#le_action')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    delete panel.dataset.editId;
    document.getElementById('leaveEntrySave').textContent = '💾 SAVE ENTRY';
    document.getElementById('leCancelEdit').style.display = 'none';
  }

// ── Personnel Record button ──
  const prcBtn2 = document.getElementById('cAddPrcRec2');
  if (prcBtn2) {
    const newPrcBtn2 = prcBtn2.cloneNode(true);
    prcBtn2.parentNode.replaceChild(newPrcBtn2, prcBtn2);
    newPrcBtn2.addEventListener('click', () => {
      if (typeof showPersonnelRecordModal === 'function') showPersonnelRecordModal(emp, null);
    });
  }

  // ── Cancel edit ──
  const cancelBtn    = document.getElementById('leCancelEdit');
  const newCancelBtn = cancelBtn.cloneNode(true);
  cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
  newCancelBtn.addEventListener('click', () => {
    resetLeaveEntryForm(panel);
    wireLeaveEntryForm(emp, null);
  });

  // ── Save / Update ──
  const saveBtn    = document.getElementById('leaveEntrySave');
  const newSaveBtn = saveBtn.cloneNode(true);
  saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

  newSaveBtn.addEventListener('click', async () => {
    const errEl = document.getElementById('le_err');
    errEl.textContent = '';
    const rec    = collectEntryForm(panel);
    const editId = panel.dataset.editId ? +panel.dataset.editId : null;

    newSaveBtn.disabled    = true;
    newSaveBtn.textContent = 'Saving…';

    const apiRes = editId
      ? await apiCall('update_record', { employee_id: emp.id, record_id: editId, record: rec })
      : await apiCall('save_record',   { employee_id: emp.id, record: rec });

    newSaveBtn.disabled = false;

    if (!apiRes.ok) {
      errEl.textContent      = apiRes.error;
      newSaveBtn.textContent = editId ? '💾 UPDATE ENTRY' : '💾 SAVE ENTRY';
      return;
    }

    resetLeaveEntryForm(panel);

    const res2 = await apiCall('get_records', { employee_id: emp.id }, 'GET');
    if (res2.ok) emp.records = res2.records || [];
    sortRecordsInPlace(emp.records);

    await saveRowBalances(emp.records, emp.id, emp.status);

    const res3 = await apiCall('get_records', { employee_id: emp.id }, 'GET');
    if (res3.ok) emp.records = res3.records || [];
    sortRecordsInPlace(emp.records);

    if (typeof refreshEmpCardStatus === 'function') refreshEmpCardStatus(emp);
    renderLeaveCardTable(emp);
    wireLeaveEntryForm(emp, null);
  });
}

// ── Collect all form values into a record object ──────────────────────
function collectEntryForm(panel) {
  const action = panel.querySelector('#le_action').value.trim();
  const a      = action.toLowerCase();

  const isAcc      = a.includes('monthly accrual');
  const isForce    = (a.includes('force') || a.includes('mandatory')) && !a.includes('disapproved');
  const isForceDis = (a.includes('force') || a.includes('mandatory')) &&  a.includes('disapproved');
  const isMon      = a.includes('monetization') && !a.includes('disapproved');
  const isMD       = a.includes('monetization') &&  a.includes('disapproved');
  const isTR       = a.includes('credit entry') || a.includes('from denr');

  return {
    so:          panel.querySelector('#le_so').value.trim(),
    prd:         panel.querySelector('#le_prd').value.trim(),
    from:        toISODate(panel.querySelector('#le_from').value.trim()),
    to:          toISODate(panel.querySelector('#le_to').value.trim()),
    fromPeriod:  panel.querySelector('#le_fp').value || 'WD',
    toPeriod:    panel.querySelector('#le_tp').value || 'WD',
    spec:        panel.querySelector('#le_spec').value.trim(),
    action,
    earned:      isAcc            ? (+(panel.querySelector('#le_earned')?.value) || 0) : 0,
    forceAmount: (isForce || isForceDis) ? (+(panel.querySelector('#le_force')?.value)  || 0) : 0,
    monAmount:   0,
    monDisAmt:   0,
    monV:        isMon ? (+(panel.querySelector('#le_monV')?.value)  || 0) : 0,
    monS:        isMon ? (+(panel.querySelector('#le_monS')?.value)  || 0) : 0,
    monDV:       isMD  ? (+(panel.querySelector('#le_monDV')?.value) || 0) : 0,
    monDS:       isMD  ? (+(panel.querySelector('#le_monDS')?.value) || 0) : 0,
    noActionAmt: 0,
    trV:         isTR  ? (+(panel.querySelector('#le_trV')?.value)   || 0) : 0,
    trS:         isTR  ? (+(panel.querySelector('#le_trS')?.value)   || 0) : 0,
  };
}

// ── Reset form to blank state ─────────────────────────────────────────
function resetLeaveEntryForm(panel) {
  if (!panel) return;

  ['#le_so','#le_prd','#le_from','#le_to','#le_action','#le_spec','#le_earned']
    .forEach(s => { const el = panel.querySelector(s); if (el) el.value = ''; });

  ['#le_force','#le_monV','#le_monS','#le_monDV','#le_monDS','#le_trV','#le_trS']
    .forEach(s => { const el = panel.querySelector(s); if (el) el.value = '0'; });

  ['#le_force_wrap','#le_earned_wrap','#le_monV_wrap','#le_monS_wrap',
   '#le_monDV_wrap','#le_monDS_wrap','#le_trV_wrap','#le_trS_wrap']
    .forEach(s => { const el = panel.querySelector(s); if (el) el.style.display = 'none'; });

  delete panel.dataset.editId;
  delete panel.dataset.insertAfter;

  ['fp', 'tp'].forEach(fp => {
    ['am', 'pm', 'wd'].forEach(x =>
      document.getElementById(`le_${fp}_${x}`)?.classList.remove('lc-per-active')
    );
    document.getElementById(`le_${fp}_wd`)?.classList.add('lc-per-active');
    const hid = document.getElementById(`le_${fp}`); if (hid) hid.value = 'WD';
  });

  const saveBtn   = document.getElementById('leaveEntrySave');
  if (saveBtn)   saveBtn.textContent = '💾 SAVE ENTRY';
  const cancelBtn = document.getElementById('leCancelEdit');
  if (cancelBtn) cancelBtn.style.display = 'none';
  const errEl     = document.getElementById('le_err');
  if (errEl)     errEl.textContent = '';

  closeDatePopup();
}

// ── Internal helpers ──────────────────────────────────────────────────
function _show(panel, selector, visible) {
  const el = panel.querySelector(selector);
  if (el) el.style.display = visible ? '' : 'none';
}
function _val(panel, selector, value) {
  const el = panel.querySelector(selector);
  if (el) el.value = value;
}
// ── Personnel Record Card entry form ─────────────────────────────────
function buildPersonnelEntryForm() {
  return `
    <div class="lc-entry-card no-print" id="prcEntryPanel" style="margin-top:12px;display:none;">
      <div class="lc-entry-header" style="background:linear-gradient(135deg,#1a2d6b 0%,#2251b3 100%);">
        <span>📋 PERSONNEL RECORD ENTRY</span>
      </div>
      <div class="lc-entry-body">
        <div class="lc-entry-row">
          <div class="lc-ef lc-ef-date">
            <label>EFFECTIVE DATE</label>
            <div class="lc-date-row">
              <input id="prc_effectiveDate" class="date-text" type="text" placeholder="mm/dd/yyyy"/>
              <button class="lc-cal-btn" tabindex="-1" data-dp-target="prc_effectiveDate">📅</button>
            </div>
          </div>
          <div class="lc-ef lc-ef-wide">
            <label>DESIGNATION</label>
            <input id="prc_designation" type="text" placeholder="e.g. Teacher I"/>
          </div>
          <div class="lc-ef">
            <label>STATUS (Reg/Perm/Temp/Subt)</label>
            <select id="prc_statusReg">
              <option value="">-- Select --</option>
              <option>Permanent</option>
              <option>Temporary</option>
              <option>Substitute</option>
              <option>Regular</option>
              <option>Casual</option>
            </select>
          </div>
          <div class="lc-ef">
            <label>MO./ANNUAL SALARY</label>
            <input id="prc_salary" type="text" placeholder="e.g. 25000"/>
          </div>
          <div class="lc-ef lc-ef-wide">
            <label>NAME OF DIST./STATION</label>
            <input id="prc_station" type="text" placeholder="e.g. Koronadal City NHS"/>
          </div>
          <div class="lc-ef">
            <label>SOURCE OF FUND</label>
            <select id="prc_sourceOfFund">
              <option value="">-- Select --</option>
              <option>National</option>
              <option>Local</option>
            </select>
          </div>
          <div class="lc-ef lc-ef-date">
            <label>DATE OF LAST PROMOTION</label>
            <div class="lc-date-row">
              <input id="prc_lastPromotion" class="date-text" type="text" placeholder="mm/dd/yyyy"/>
              <button class="lc-cal-btn" tabindex="-1" data-dp-target="prc_lastPromotion">📅</button>
            </div>
          </div>
          <div class="lc-ef lc-ef-wide">
            <label>REMARKS</label>
            <input id="prc_remarks" type="text" placeholder="Optional"/>
          </div>
        </div>
        <div class="lc-entry-row2">
          <div id="prc_err" class="lc-err"></div>
          <button class="btn lc-save-btn" id="prcSaveBtn" type="button"
            style="background:#1e3a6e;">💾 SAVE PERSONNEL RECORD</button>
          <button class="btn lc-cancel-edit-btn" id="prcCancelBtn" type="button"
            style="display:none;">✕ CANCEL EDIT</button>
        </div>
      </div>
    </div>`;
}

function showPersonnelModal(emp, editRecord) {
  // Build modal if it doesn't exist
  if (!document.getElementById('prcModal')) {
    const overlay = document.createElement('div');
    overlay.id = 'prcModal';
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:99998;
      background:rgba(0,0,0,0.75);
      display:flex;align-items:center;justify-content:center;
      padding:16px;
    `;
    overlay.innerHTML = `
      <div style="
        background:#0d0404;border:1px solid #5a0a0a;border-top:3px solid #8b0000;
        border-radius:12px;padding:24px;width:100%;max-width:820px;
        max-height:90vh;overflow-y:auto;position:relative;
        box-shadow:0 20px 60px rgba(0,0,0,0.8);
      ">
        <button id="prcModalClose" style="
          position:absolute;top:12px;right:14px;
          background:none;border:none;color:#888;font-size:20px;
          cursor:pointer;line-height:1;
        ">✕</button>
        <div style="
          font-family:'Barlow Condensed',sans-serif;font-size:11px;
          font-weight:800;letter-spacing:.18em;text-transform:uppercase;
          color:#c0392b;margin-bottom:16px;
        ">📋 PERSONNEL RECORD ENTRY</div>
        <div id="prcModalBody"></div>
      </div>`;
    document.body.appendChild(overlay);
    document.getElementById('prcModalClose').addEventListener('click', () => {
      document.getElementById('prcModal').style.display = 'none';
    });
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.style.display = 'none';
    });
  }

  // Inject the form fields into modal body
  document.getElementById('prcModalBody').innerHTML = `
    <div id="prcModalPanel">
      <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:12px;">
        <div style="display:flex;flex-direction:column;gap:4px;">
          <label style="font-size:9px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#4a2020;">EFFECTIVE DATE</label>
          <div style="display:flex;gap:4px;">
            <input id="pm_effectiveDate" class="date-text" type="text" placeholder="mm/dd/yyyy"
              style="height:34px;padding:0 8px;background:#060202;border:1px solid #2a0808;border-radius:5px;color:#d0d0d0;font-size:13px;width:130px;"/>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;flex:2;min-width:160px;">
          <label style="font-size:9px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#4a2020;">DESIGNATION</label>
          <input id="pm_designation" type="text" placeholder="e.g. Teacher I"
            style="height:34px;padding:0 8px;background:#060202;border:1px solid #2a0808;border-radius:5px;color:#d0d0d0;font-size:13px;width:100%;"/>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          <label style="font-size:9px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#4a2020;">STATUS</label>
          <select id="pm_statusReg"
            style="height:34px;padding:0 8px;background:#060202;border:1px solid #2a0808;border-radius:5px;color:#d0d0d0;font-size:13px;min-width:130px;">
            <option value="">-- Select --</option>
            <option>Permanent</option><option>Temporary</option>
            <option>Substitute</option><option>Regular</option><option>Casual</option>
          </select>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          <label style="font-size:9px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#4a2020;">MO./ANNUAL SALARY</label>
          <input id="pm_salary" type="text" placeholder="e.g. 25000"
            style="height:34px;padding:0 8px;background:#060202;border:1px solid #2a0808;border-radius:5px;color:#d0d0d0;font-size:13px;width:130px;"/>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;flex:2;min-width:160px;">
          <label style="font-size:9px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#4a2020;">NAME OF DIST./STATION</label>
          <input id="pm_station" type="text" placeholder="e.g. Koronadal City NHS"
            style="height:34px;padding:0 8px;background:#060202;border:1px solid #2a0808;border-radius:5px;color:#d0d0d0;font-size:13px;width:100%;"/>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          <label style="font-size:9px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#4a2020;">SOURCE OF FUND</label>
          <select id="pm_sourceOfFund"
            style="height:34px;padding:0 8px;background:#060202;border:1px solid #2a0808;border-radius:5px;color:#d0d0d0;font-size:13px;min-width:110px;">
            <option value="">-- Select --</option>
            <option>National</option><option>Local</option>
          </select>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          <label style="font-size:9px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#4a2020;">DATE OF LAST PROMOTION</label>
          <input id="pm_lastPromotion" class="date-text" type="text" placeholder="mm/dd/yyyy"
            style="height:34px;padding:0 8px;background:#060202;border:1px solid #2a0808;border-radius:5px;color:#d0d0d0;font-size:13px;width:130px;"/>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;flex:3;min-width:160px;">
          <label style="font-size:9px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#4a2020;">REMARKS</label>
          <input id="pm_remarks" type="text" placeholder="Optional"
            style="height:34px;padding:0 8px;background:#060202;border:1px solid #2a0808;border-radius:5px;color:#d0d0d0;font-size:13px;width:100%;"/>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;margin-top:4px;">
        <div id="pm_err" style="color:#e74c3c;font-size:11px;flex:1;"></div>
        <button id="pm_saveBtn" type="button" style="
          height:36px;padding:0 20px;background:#4a0808;border:1px solid #8b0000;
          border-radius:6px;color:#d0d0d0;font-size:12px;font-weight:800;
          letter-spacing:.1em;text-transform:uppercase;cursor:pointer;">
          💾 SAVE RECORD
        </button>
        <button id="pm_cancelBtn" type="button" style="
          display:none;height:36px;padding:0 16px;background:#0a0202;
          border:1px solid #2a0808;border-radius:6px;color:#888;
          font-size:12px;font-weight:800;letter-spacing:.1em;
          text-transform:uppercase;cursor:pointer;">
          ✕ CANCEL
        </button>
      </div>
    </div>`;

  // Wire date-text auto-format
  document.querySelectorAll('#prcModalPanel .date-text').forEach(txt => {
    txt.addEventListener('input', () => { txt.value = fmtDateInput(txt.value); });
  });

  // Pre-fill if editing
  if (editRecord) {
    document.getElementById('pm_effectiveDate').value = editRecord.effectiveDate || '';
    document.getElementById('pm_designation').value   = editRecord.designation   || '';
    document.getElementById('pm_statusReg').value     = editRecord.statusReg     || '';
    document.getElementById('pm_salary').value        = editRecord.salary        || '';
    document.getElementById('pm_station').value       = editRecord.station       || '';
    document.getElementById('pm_sourceOfFund').value  = editRecord.sourceOfFund  || '';
    document.getElementById('pm_lastPromotion').value = editRecord.lastPromotion || '';
    document.getElementById('pm_remarks').value       = editRecord.remarks       || '';
    document.getElementById('pm_saveBtn').textContent = '💾 UPDATE RECORD';
    document.getElementById('pm_cancelBtn').style.display = '';
    document.getElementById('prcModalPanel').dataset.editIdx = editRecord._idx;
  } else {
    document.getElementById('prcModalPanel').dataset.editIdx = '';
    document.getElementById('pm_saveBtn').textContent = '💾 SAVE RECORD';
    document.getElementById('pm_cancelBtn').style.display = 'none';
  }

  document.getElementById('prcModal').style.display = 'flex';

  // Cancel
  document.getElementById('pm_cancelBtn').addEventListener('click', () => {
    document.getElementById('prcModal').style.display = 'none';
  });

  // Save
  document.getElementById('pm_saveBtn').addEventListener('click', async () => {
    const errEl   = document.getElementById('pm_err');
    errEl.textContent = '';
    const panel2  = document.getElementById('prcModalPanel');
    const editIdx = panel2.dataset.editIdx !== '' ? +panel2.dataset.editIdx : null;

    const rec = {
      effectiveDate : document.getElementById('pm_effectiveDate').value.trim(),
      designation   : document.getElementById('pm_designation').value.trim(),
      statusReg     : document.getElementById('pm_statusReg').value,
      salary        : document.getElementById('pm_salary').value.trim(),
      station       : document.getElementById('pm_station').value.trim(),
      sourceOfFund  : document.getElementById('pm_sourceOfFund').value,
      lastPromotion : document.getElementById('pm_lastPromotion').value.trim(),
      remarks       : document.getElementById('pm_remarks').value.trim(),
    };

    if (!rec.effectiveDate && !rec.designation) {
      errEl.textContent = 'Please fill in at least Effective Date or Designation.';
      return;
    }

    const saveBtn = document.getElementById('pm_saveBtn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving…';

    const apiRes = editIdx !== null
      ? await apiCall('update_personnel_record', { employee_id: emp.id, idx: editIdx, record: rec })
      : await apiCall('save_personnel_record',   { employee_id: emp.id, record: rec });

    saveBtn.disabled = false;

    if (!apiRes.ok) {
      errEl.textContent   = apiRes.error || 'Save failed.';
      saveBtn.textContent = editIdx !== null ? '💾 UPDATE RECORD' : '💾 SAVE RECORD';
      return;
    }

    // Update local emp object
    if (!emp.personnelRecords) emp.personnelRecords = [];
    if (editIdx !== null) emp.personnelRecords[editIdx] = rec;
    else emp.personnelRecords.push(rec);

    document.getElementById('prcModal').style.display = 'none';
    renderPersonnelTable(emp);
  });
}

function wirePersonnelEntryForm(emp, editRecord) {
  const panel = document.getElementById('prcEntryPanel');
  if (!panel) return;

  // Wire calendar pickers
  panel.querySelectorAll('.lc-cal-btn').forEach(calBtn => {
    const targetId = calBtn.dataset.dpTarget;
    const txtInput = document.getElementById(targetId);
    const hiddenPicker = document.createElement('input');
    hiddenPicker.type = 'date';
    hiddenPicker.style.cssText =
      'position:fixed;opacity:0;pointer-events:none;width:1px;height:1px;';
    document.body.appendChild(hiddenPicker);
    const newCalBtn = calBtn.cloneNode(true);
    calBtn.parentNode.replaceChild(newCalBtn, calBtn);
    newCalBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (txtInput && txtInput.value) hiddenPicker.value = toISODate(txtInput.value) || '';
      hiddenPicker.showPicker ? hiddenPicker.showPicker() : hiddenPicker.click();
    });
    hiddenPicker.addEventListener('change', () => {
      if (hiddenPicker.value && txtInput) txtInput.value = fmtD(hiddenPicker.value);
      hiddenPicker.value = '';
    });
  });

  panel.querySelectorAll('.date-text').forEach(txt => {
    txt.addEventListener('input', () => { txt.value = fmtDateInput(txt.value); });
  });

  // Pre-fill for edit
  if (editRecord) {
    document.getElementById('prc_effectiveDate').value  = editRecord.effectiveDate  || '';
    document.getElementById('prc_designation').value    = editRecord.designation    || '';
    document.getElementById('prc_statusReg').value      = editRecord.statusReg      || '';
    document.getElementById('prc_salary').value         = editRecord.salary         || '';
    document.getElementById('prc_station').value        = editRecord.station        || '';
    document.getElementById('prc_sourceOfFund').value   = editRecord.sourceOfFund   || '';
    document.getElementById('prc_lastPromotion').value  = editRecord.lastPromotion  || '';
    document.getElementById('prc_remarks').value        = editRecord.remarks        || '';
    panel.dataset.prcEditIdx = editRecord._idx;
    document.getElementById('prcSaveBtn').textContent   = '💾 UPDATE PERSONNEL RECORD';
    document.getElementById('prcCancelBtn').style.display = '';
  } else {
    panel.dataset.prcEditIdx = '';
    document.getElementById('prcSaveBtn').textContent   = '💾 SAVE PERSONNEL RECORD';
    document.getElementById('prcCancelBtn').style.display = 'none';
  }

  // Cancel
  const cancelBtn    = document.getElementById('prcCancelBtn');
  const newCancelBtn = cancelBtn.cloneNode(true);
  cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
  newCancelBtn.addEventListener('click', () => resetPersonnelForm());

  // Save
  const saveBtn    = document.getElementById('prcSaveBtn');
  const newSaveBtn = saveBtn.cloneNode(true);
  saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

  newSaveBtn.addEventListener('click', async () => {
    const errEl = document.getElementById('prc_err');
    errEl.textContent = '';

    const rec = {
      effectiveDate : document.getElementById('prc_effectiveDate').value.trim(),
      designation   : document.getElementById('prc_designation').value.trim(),
      statusReg     : document.getElementById('prc_statusReg').value,
      salary        : document.getElementById('prc_salary').value.trim(),
      station       : document.getElementById('prc_station').value.trim(),
      sourceOfFund  : document.getElementById('prc_sourceOfFund').value,
      lastPromotion : document.getElementById('prc_lastPromotion').value.trim(),
      remarks       : document.getElementById('prc_remarks').value.trim(),
    };

    if (!rec.effectiveDate && !rec.designation) {
      errEl.textContent = 'Please fill in at least Effective Date or Designation.';
      return;
    }

    newSaveBtn.disabled    = true;
    newSaveBtn.textContent = 'Saving…';

    const editIdx = panel.dataset.prcEditIdx !== '' ? +panel.dataset.prcEditIdx : null;
    const apiRes  = editIdx !== null
      ? await apiCall('update_personnel_record', { employee_id: emp.id, idx: editIdx, record: rec })
      : await apiCall('save_personnel_record',   { employee_id: emp.id, record: rec });

    newSaveBtn.disabled = false;

    if (!apiRes.ok) {
      errEl.textContent      = apiRes.error || 'Save failed.';
      newSaveBtn.textContent = editIdx !== null ? '💾 UPDATE PERSONNEL RECORD' : '💾 SAVE PERSONNEL RECORD';
      return;
    }

    // Refresh personnel records on the emp object
    if (!emp.personnelRecords) emp.personnelRecords = [];
    if (editIdx !== null) {
      emp.personnelRecords[editIdx] = rec;
    } else {
      emp.personnelRecords.push(rec);
    }

    resetPersonnelForm();
    renderPersonnelTable(emp);
  });
}

function resetPersonnelForm() {
  const panel = document.getElementById('prcEntryPanel');
  if (!panel) return;
  ['prc_effectiveDate','prc_designation','prc_salary',
   'prc_station','prc_lastPromotion','prc_remarks'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  ['prc_statusReg','prc_sourceOfFund'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  panel.dataset.prcEditIdx = '';
  const saveBtn   = document.getElementById('prcSaveBtn');
  if (saveBtn)   saveBtn.textContent = '💾 SAVE PERSONNEL RECORD';
  const cancelBtn = document.getElementById('prcCancelBtn');
  if (cancelBtn) cancelBtn.style.display = 'none';
  const errEl     = document.getElementById('prc_err');
  if (errEl)     errEl.textContent = '';
}

/* ============================================================
   REPLACEMENTS FOR leavecard-form.js
   Replace the TWO functions below in your existing file:
     1. renderPersonnelTable()  — softer card wrapper, no sharp edges
     2. showPersonnelModal()    — login-page-inspired, easy on the eyes
   ============================================================ */


/* ─────────────────────────────────────────────────────────
   REPLACEMENT 1 of 2
   Find: function renderPersonnelTable(emp) {
   Replace the ENTIRE function with this block.
───────────────────────────────────────────────────────── */
function renderPersonnelTable(emp) {
  const wrap = document.getElementById('prcTableWrap');
  if (!wrap) return;

  const rows    = emp.personnelRecords || [];
  const canEdit = window.state && (window.state.isAdmin || window.state.isEncoder);

  // Inject once — personnel table card styles
  if (!document.getElementById('prc-table-style')) {
    const st = document.createElement('style');
    st.id = 'prc-table-style';
   st.textContent = `
      .prc-card {
        background: linear-gradient(160deg, #fdf5f2 0%, #fbeae4 55%, #f8ddd5 100%);
        border: 1px solid rgba(192, 57, 43, 0.22);
        border-radius: 16px;
        overflow: hidden;
        margin-bottom: 14px;
        box-shadow:
          0 0 0 1px rgba(255, 80, 50, 0.06),
          0 6px 28px rgba(0,0,0,0.12),
          inset 0 1px 0 rgba(255, 120, 90, 0.1);
      }
      .prc-card::before {
        content: '';
        position: absolute; top: 0; left: 0; right: 0; height: 2.5px;
        background: linear-gradient(90deg,
          transparent 0%, rgba(192,57,43,0.5) 25%,
          rgba(220,80,50,0.85) 50%,
          rgba(192,57,43,0.5) 75%, transparent 100%);
        pointer-events: none;
      }
      .prc-card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 13px 20px;
        background: linear-gradient(135deg,
          rgba(192,57,43,0.12) 0%,
          rgba(220,80,50,0.08) 50%,
          rgba(192,57,43,0.06) 100%);
        border-bottom: 1px solid rgba(192, 57, 43, 0.18);
      }
     .prc-card-header span {
        font-family: 'Barlow Condensed', 'Rajdhani', sans-serif;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        color: #2F63C9;
      }
      .prc-card-body {
        padding: 14px 16px 12px;
        overflow-x: auto;
      }
      .prc-empty {
        text-align: center;
        padding: 20px 8px;
        color: rgba(140, 60, 40, 0.4);
        font-size: 12px;
        font-style: italic;
        letter-spacing: 0.05em;
      }
      .prc-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 11.5px;
        table-layout: auto;
      }
      .prc-table thead tr {
        background: rgba(47, 99, 201, 0.08);
      }
      .prc-table thead th {
        padding: 8px 10px;
        text-align: center;
        font-size: 9px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: rgba(130, 35, 15, 0.65);
        border-bottom: 1px solid rgba(192, 57, 43, 0.2);
        white-space: nowrap;
      }
      .prc-table tbody tr {
        border-bottom: 1px solid rgba(192, 57, 43, 0.1);
        transition: background 0.15s;
      }
      .prc-table tbody tr:last-child { border-bottom: none; }
      .prc-table tbody tr:hover { background: rgba(192, 57, 43, 0.05); }
      .prc-table tbody td {
        padding: 8px 10px;
        color: #3a0a0a;
        vertical-align: middle;
        font-size: 11.5px;
        text-align: center;
      }
      .prc-table td.prc-td-left { text-align: left; }
      .prc-table td.prc-td-actions { white-space: nowrap; text-align: center; }
      .prc-edit-btn, .prc-del-btn {
        background: none; border: none; cursor: pointer;
        font-size: 13px; padding: 2px 5px; border-radius: 5px;
        transition: background 0.15s, transform 0.15s; line-height: 1;
      }
      .prc-edit-btn:hover { background: rgba(59,130,246,0.12); transform: scale(1.12); }
      .prc-del-btn:hover  { background: rgba(192,57,43,0.12);  transform: scale(1.12); }
`;
    document.head.appendChild(st);
  }

  const bodyHtml = rows.length === 0
    ? `<p class="prc-empty">No personnel records yet. Click <strong>📋 Personnel Record</strong> to add one.</p>`
    : `<table class="prc-table">
        <thead>
          <tr>
            <th>Effective Date</th>
            <th>Designation</th>
            <th>Status</th>
            <th>Mo./Annual Salary</th>
            <th>Name of Dist./Station</th>
            <th>Source of Fund</th>
            <th>Date of Last Prom.</th>
            <th>Remarks</th>
            ${canEdit ? '<th class="no-print">⋮</th>' : ''}
          </tr>
        </thead>
        <tbody>
          ${rows.map((r, i) => `
            <tr>
              <td>${escHtml(r.effectiveDate || '')}</td>
              <td class="prc-td-left">${escHtml(r.designation || '')}</td>
              <td>${escHtml(r.statusReg || '')}</td>
              <td>${escHtml(r.salary || '')}</td>
              <td class="prc-td-left">${escHtml(r.station || '')}</td>
              <td>${escHtml(r.sourceOfFund || '')}</td>
              <td>${escHtml(r.lastPromotion || '')}</td>
              <td class="prc-td-left">${escHtml(r.remarks || '')}</td>
              ${canEdit ? `
              <td class="prc-td-actions no-print">
                <button class="prc-edit-btn"
                  onclick="showPersonnelModal(window._currentPrcEmp, {...window._currentPrcEmp.personnelRecords[${i}], _idx:${i}})"
                  title="Edit">✏️</button>
                <button class="prc-del-btn"
                  onclick="deletePrcRow(${i})"
                  title="Delete">🗑️</button>
              </td>` : ''}
            </tr>`).join('')}
        </tbody>
      </table>`;

  wrap.innerHTML = `
    <div class="prc-card no-print">
      <div class="prc-card-header">
        <span>📋 Personnel Record</span>
      </div>
      <div class="prc-card-body">
        ${bodyHtml}
      </div>
    </div>`;
}


/* ─────────────────────────────────────────────────────────
   REPLACEMENT 2 of 2
   Find: function showPersonnelModal(emp, editRecord) {
   Replace the ENTIRE function with this block.
───────────────────────────────────────────────────────── */
function showPersonnelModal(emp, editRecord) {
  // Inject styles once
  if (!document.getElementById('prc-modal-style')) {
    const st = document.createElement('style');
    st.id = 'prc-modal-style';
    st.textContent = `
      /* ── Overlay ── */
      #prcModal {
        position: fixed; inset: 0; z-index: 99998;
        background: rgba(16, 6, 4, 0.72);
        backdrop-filter: blur(10px);
        display: flex; align-items: center; justify-content: center;
        padding: 16px;
        animation: prcmo-in 0.28s cubic-bezier(0.22,1,0.36,1) both;
      }
      @keyframes prcmo-in {
        from { opacity: 0; }
        to   { opacity: 1; }
      }

      /* ── Card ── */
      .prcmo-card {
        position: relative;
        width: 100%;
        max-width: 860px;
        max-height: 92vh;
        overflow-y: auto;
        background: linear-gradient(160deg, #fdf5f2 0%, #fbeae4 55%, #f8ddd5 100%);
        border: 1px solid rgba(192, 57, 43, 0.22);
        border-radius: 20px;
        box-shadow:
          0 0 0 1px rgba(255, 80, 50, 0.06),
          0 30px 80px rgba(0, 0, 0, 0.35),
          0 0 60px rgba(192, 57, 43, 0.08),
          inset 0 1px 0 rgba(255, 120, 90, 0.12),
          inset 0 -1px 0 rgba(0,0,0,0.04);
        animation: prcmo-card-in 0.35s cubic-bezier(0.22,1,0.36,1) both;
        scrollbar-width: thin;
        scrollbar-color: rgba(192,57,43,0.3) transparent;
      }
      @keyframes prcmo-card-in {
        from { opacity: 0; transform: translateY(22px) scale(0.97); }
        to   { opacity: 1; transform: none; }
      }
      .prcmo-card::-webkit-scrollbar { width: 5px; }
      .prcmo-card::-webkit-scrollbar-thumb {
        background: rgba(192,57,43,0.25); border-radius: 4px;
      }

      /* Corner rivets */
      .prcmo-card::after {
        content: '';
        position: absolute; top: 14px; left: 14px;
        width: 7px; height: 7px; border-radius: 50%;
        background: radial-gradient(circle at 35% 35%, rgba(220,80,50,0.6), rgba(180,40,20,0.4));
        pointer-events: none;
      }

      /* ── Header ── */
      .prcmo-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 24px 16px;
        background: linear-gradient(135deg,
          rgba(192,57,43,0.12) 0%,
          rgba(220,80,50,0.08) 50%,
          rgba(192,57,43,0.06) 100%);
        border-bottom: 1px solid rgba(192, 57, 43, 0.18);
        border-radius: 20px 20px 0 0;
        position: sticky; top: 0;
        backdrop-filter: blur(12px);
        z-index: 5;
      }
      .prcmo-header::before {
        content: '';
        position: absolute; top: 0; left: 0; right: 0; height: 2.5px;
        background: linear-gradient(90deg,
          transparent 0%, rgba(192,57,43,0.6) 25%,
          rgba(220,80,50,0.9) 50%,
          rgba(192,57,43,0.6) 75%, transparent 100%);
        border-radius: 20px 20px 0 0;
        pointer-events: none;
      }
      .prcmo-title {
        font-family: 'Playfair Display', Georgia, serif;
        font-size: 1.15rem;
        font-weight: 800;
        color: #5a1008;
        letter-spacing: -0.01em;
      }
      .prcmo-close {
        width: 32px; height: 32px;
        background: rgba(192,57,43,0.1);
        border: 1px solid rgba(192,57,43,0.22);
        border-radius: 8px;
        color: rgba(160, 40, 20, 0.7);
        font-size: 15px;
        cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: background 0.18s, color 0.18s, transform 0.18s;
        line-height: 1;
        flex-shrink: 0;
      }
      .prcmo-close:hover {
        background: rgba(192,57,43,0.2);
        color: #7a1010;
        transform: rotate(90deg) scale(1.1);
      }

      /* ── Body ── */
      .prcmo-body {
        padding: 24px 28px;
      }

      /* ── Section label ── */
      .prcmo-section {
        font-family: 'Barlow Condensed', sans-serif;
        font-size: 9px;
        font-weight: 800;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        color: rgba(140, 40, 20, 0.55);
        padding: 12px 0 8px;
        border-bottom: 1px solid rgba(192, 57, 43, 0.15);
        margin-bottom: 14px;
        display: flex; align-items: center; gap: 8px;
      }
      .prcmo-section::before {
        content: '';
        display: inline-block;
        width: 14px; height: 2.5px;
        background: linear-gradient(90deg, #c0392b, rgba(192,57,43,0.4));
        border-radius: 2px;
        flex-shrink: 0;
      }

      /* ── Form grid ── */
      .prcmo-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px 16px;
        margin-bottom: 4px;
      }
      .prcmo-grid-2 { grid-template-columns: repeat(2, 1fr) !important; }
      .prcmo-full  { grid-column: 1 / -1 !important; }

      /* ── Field ── */
      .prcmo-f {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
      .prcmo-f label {
        font-size: 9.5px;
        font-weight: 800;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: rgba(130, 35, 15, 0.72);
      }
      .prcmo-f input,
      .prcmo-f select {
        height: 42px;
        padding: 0 13px;
        background: #ffffff;
        border: 1.5px solid rgba(180, 55, 35, 0.28);
        border-radius: 10px;
        color: #2a0808;
        font-size: 13.5px;
        font-weight: 500;
        font-family: inherit;
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        appearance: auto;
      }
      .prcmo-f input::placeholder { color: rgba(160, 80, 60, 0.35); font-weight: 400; }
      .prcmo-f input:focus,
      .prcmo-f select:focus {
        border-color: rgba(192, 57, 43, 0.6);
        box-shadow: 0 0 0 3px rgba(192, 57, 43, 0.1);
        background: #fffaf9;
      }
      .prcmo-f select option { background: #fff; color: #2a0808; }

      /* ── Error ── */
      .prcmo-err {
        font-size: 11.5px;
        color: #c0392b;
        min-height: 16px;
        padding: 0 2px;
        font-weight: 600;
      }

      /* ── Existing records mini-table ── */
      .prcmo-rec-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 11px;
        margin-top: 6px;
      }
      .prcmo-rec-table thead tr {
        background: rgba(192, 57, 43, 0.08);
      }
      .prcmo-rec-table thead th {
        padding: 7px 9px;
        text-align: center;
        font-size: 9px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: rgba(130, 35, 15, 0.65);
        border-bottom: 1px solid rgba(192, 57, 43, 0.2);
        white-space: nowrap;
      }
      .prcmo-rec-table tbody tr {
        border-bottom: 1px solid rgba(192, 57, 43, 0.1);
        transition: background 0.15s;
      }
      .prcmo-rec-table tbody tr:last-child { border-bottom: none; }
      .prcmo-rec-table tbody tr:hover { background: rgba(192, 57, 43, 0.05); }
      .prcmo-rec-table tbody td {
        padding: 7px 9px;
        color: #3a0a0a;
        text-align: center;
        font-size: 11.5px;
      }
      .prcmo-rec-table td.prcmo-td-left { text-align: left; }
      .prcmo-rec-edit, .prcmo-rec-del {
        background: none; border: none; cursor: pointer;
        font-size: 13px; padding: 2px 4px; border-radius: 5px;
        transition: background 0.15s, transform 0.15s; line-height: 1;
      }
      .prcmo-rec-edit:hover { background: rgba(59,130,246,0.12); transform: scale(1.12); }
      .prcmo-rec-del:hover  { background: rgba(192,57,43,0.12);  transform: scale(1.12); }
      .prcmo-rec-empty {
        text-align: center;
        padding: 14px 8px;
        color: rgba(140, 60, 40, 0.4);
        font-size: 11.5px;
        font-style: italic;
      }

      /* ── Footer ── */
      .prcmo-footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 10px;
        padding: 16px 28px 22px;
        border-top: 1px solid rgba(192, 57, 43, 0.15);
        background: rgba(248, 220, 210, 0.25);
        border-radius: 0 0 20px 20px;
        position: sticky; bottom: 0;
        backdrop-filter: blur(10px);
      }

      /* ── Buttons ── */
      .prcmo-btn {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 10px 22px;
        font-family: 'DM Sans', 'Inter', sans-serif;
        font-size: 11.5px; font-weight: 700; letter-spacing: 0.06em;
        text-transform: uppercase; border: none; border-radius: 10px;
        cursor: pointer;
        transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s ease;
      }
      .prcmo-btn:hover   { transform: translateY(-2px); }
      .prcmo-btn:active  { transform: translateY(0); }
      .prcmo-btn-cancel {
        background: rgba(192,57,43,0.1);
        color: rgba(140, 40, 20, 0.75);
        border: 1px solid rgba(192,57,43,0.25) !important;
      }
      .prcmo-btn-cancel:hover { background: rgba(192,57,43,0.16); color: #7a1010; }
      .prcmo-btn-save {
        background: linear-gradient(135deg, #1e3a6e, #2251b3);
        color: #fff;
        box-shadow: 0 4px 16px rgba(30, 58, 110, 0.4);
      }
      .prcmo-btn-save:hover {
        box-shadow: 0 8px 24px rgba(30, 58, 110, 0.55);
        background: linear-gradient(135deg, #1a3262, #1e48a0);
      }
      .prcmo-btn-save:disabled {
        opacity: 0.6; cursor: not-allowed; transform: none;
      }
    `;
    document.head.appendChild(st);
  }

  // Remove any existing instance
  document.getElementById('prcModal')?.remove();

  const isEdit   = !!editRecord;
  const r        = editRecord || {};
  const STATUS   = ['Permanent','Temporary','Substitute','Regular','Casual'];
  const FUNDS    = ['National','Local'];
  function esc(s) {
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  const overlay = document.createElement('div');
  overlay.id    = 'prcModal';
  overlay.innerHTML = `
    <div class="prcmo-card">

      <div class="prcmo-header">
        <div class="prcmo-title">📋 ${isEdit ? 'Edit' : 'Add'} Personnel Record</div>
        <button class="prcmo-close" id="prcmo_close_btn" type="button">✕</button>
      </div>

      <div class="prcmo-body">

        <div class="prcmo-section">Entry Details</div>
        <div class="prcmo-grid prcmo-grid-2">

          <div class="prcmo-f">
            <label>Effective Date</label>
            <input id="pm_effectiveDate" class="date-text" type="text"
              placeholder="mm/dd/yyyy" value="${esc(r.effectiveDate||'')}"/>
          </div>

          <div class="prcmo-f">
            <label>Date of Last Promotion</label>
            <input id="pm_lastPromotion" class="date-text" type="text"
              placeholder="mm/dd/yyyy" value="${esc(r.lastPromotion||'')}"/>
          </div>

          <div class="prcmo-f prcmo-full">
            <label>Designation</label>
            <input id="pm_designation" type="text"
              placeholder="e.g. Teacher I" value="${esc(r.designation||'')}"/>
          </div>

          <div class="prcmo-f">
            <label>Status (Reg/Perm/Temp/Subt)</label>
            <select id="pm_statusReg">
              <option value="">— Select —</option>
              ${STATUS.map(o=>`<option value="${esc(o)}" ${r.statusReg===o?'selected':''}>${esc(o)}</option>`).join('')}
            </select>
          </div>

          <div class="prcmo-f">
            <label>Mo. / Annual Salary</label>
            <input id="pm_salary" type="text"
              placeholder="e.g. 25000" value="${esc(r.salary||'')}"/>
          </div>

          <div class="prcmo-f prcmo-full">
            <label>Name of Dist. / Station</label>
            <input id="pm_station" type="text"
              placeholder="e.g. Koronadal City NHS" value="${esc(r.station||'')}"/>
          </div>

          <div class="prcmo-f">
            <label>Source of Fund</label>
            <select id="pm_sourceOfFund">
              <option value="">— Select —</option>
              ${FUNDS.map(o=>`<option value="${esc(o)}" ${r.sourceOfFund===o?'selected':''}>${esc(o)}</option>`).join('')}
            </select>
          </div>

          <div class="prcmo-f">
            <label>Remarks <span style="font-weight:400;font-size:9px;opacity:.5;">(optional)</span></label>
            <input id="pm_remarks" type="text"
              placeholder="Optional" value="${esc(r.remarks||'')}"/>
          </div>

        </div>

        <div class="prcmo-err" id="pm_err"></div>

        <div class="prcmo-section" style="margin-top:20px;">Existing Records</div>
        <div id="prcmo_rec_table"></div>

      </div>

      <div class="prcmo-footer">
        <button class="prcmo-btn prcmo-btn-cancel" id="prcmo_cancel_btn" type="button">Cancel</button>
        <button class="prcmo-btn prcmo-btn-save"   id="prcmo_save_btn"   type="button">
          💾 ${isEdit ? 'Update Record' : 'Save Record'}
        </button>
      </div>

    </div>`;

  document.body.appendChild(overlay);

  // ── Wire date auto-format ──
  overlay.querySelectorAll('.date-text').forEach(inp => {
    inp.addEventListener('input', () => { inp.value = fmtDateInput(inp.value); });
  });

  // ── Close handlers ──
  const closeFn = () => {
    overlay.style.transition = 'opacity 0.22s ease';
    overlay.style.opacity    = '0';
    setTimeout(() => overlay.remove(), 230);
  };
  document.getElementById('prcmo_close_btn').addEventListener('click', closeFn);
  document.getElementById('prcmo_cancel_btn').addEventListener('click', closeFn);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeFn(); });

  // ── Render existing records mini-table ──
  function renderPrcMoTable() {
    const tableWrap = document.getElementById('prcmo_rec_table');
    if (!tableWrap) return;
    const rows = emp.personnelRecords || [];
    if (rows.length === 0) {
      tableWrap.innerHTML = `<p class="prcmo-rec-empty">No records yet.</p>`;
      return;
    }
    tableWrap.innerHTML = `
      <table class="prcmo-rec-table">
        <thead>
          <tr>
            <th>Effective Date</th>
            <th>Designation</th>
            <th>Status</th>
            <th>Salary</th>
            <th>Station</th>
            <th>Fund</th>
            <th>Last Prom.</th>
            <th>Remarks</th>
            <th class="no-print">⋮</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row, i) => `
            <tr>
              <td>${esc(row.effectiveDate||'')}</td>
              <td class="prcmo-td-left">${esc(row.designation||'')}</td>
              <td>${esc(row.statusReg||'')}</td>
              <td>${esc(row.salary||'')}</td>
              <td class="prcmo-td-left">${esc(row.station||'')}</td>
              <td>${esc(row.sourceOfFund||'')}</td>
              <td>${esc(row.lastPromotion||'')}</td>
              <td class="prcmo-td-left">${esc(row.remarks||'')}</td>
              <td class="no-print" style="white-space:nowrap;">
                <button class="prcmo-rec-edit" data-edit-i="${i}" title="Edit">✏️</button>
                <button class="prcmo-rec-del"  data-del-i="${i}"  title="Delete">🗑️</button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>`;

    tableWrap.querySelectorAll('.prcmo-rec-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = +btn.dataset.editI;
        const rec = { ...emp.personnelRecords[idx], _idx: idx };
        closeFn();
        setTimeout(() => showPersonnelModal(emp, rec), 240);
      });
    });
    tableWrap.querySelectorAll('.prcmo-rec-del').forEach(btn => {
      btn.addEventListener('click', async () => {
        const idx = +btn.dataset.delI;
        if (!confirm('Delete this personnel record? This cannot be undone.')) return;
        const res = await apiCall('delete_personnel_record', { employee_id: emp.id, idx });
        if (!res.ok) { alert(res.error || 'Delete failed.'); return; }
        emp.personnelRecords.splice(idx, 1);
        if (typeof renderPersonnelTable === 'function') renderPersonnelTable(emp);
        renderPrcMoTable();
      });
    });
  }
  renderPrcMoTable();

  // ── Save handler ──
  document.getElementById('prcmo_save_btn').addEventListener('click', async () => {
    const errEl  = document.getElementById('pm_err');
    errEl.textContent = '';
    const saveBtn = document.getElementById('prcmo_save_btn');

    const rec = {
      effectiveDate : document.getElementById('pm_effectiveDate').value.trim(),
      designation   : document.getElementById('pm_designation').value.trim(),
      statusReg     : document.getElementById('pm_statusReg').value,
      salary        : document.getElementById('pm_salary').value.trim(),
      station       : document.getElementById('pm_station').value.trim(),
      sourceOfFund  : document.getElementById('pm_sourceOfFund').value,
      lastPromotion : document.getElementById('pm_lastPromotion').value.trim(),
      remarks       : document.getElementById('pm_remarks').value.trim(),
    };

    if (!rec.effectiveDate && !rec.designation) {
      errEl.textContent = 'Please fill in at least Effective Date or Designation.';
      return;
    }

    const editIdx = isEdit ? (editRecord._idx ?? null) : null;
    saveBtn.disabled    = true;
    saveBtn.textContent = 'Saving…';

    const apiRes = editIdx !== null
      ? await apiCall('update_personnel_record', { employee_id: emp.id, idx: editIdx, record: rec })
      : await apiCall('save_personnel_record',   { employee_id: emp.id, record: rec });

    saveBtn.disabled = false;

    if (!apiRes.ok) {
      errEl.textContent   = apiRes.error || 'Save failed.';
      saveBtn.textContent = isEdit ? '💾 Update Record' : '💾 Save Record';
      return;
    }

    if (!emp.personnelRecords) emp.personnelRecords = [];
    if (editIdx !== null) emp.personnelRecords[editIdx] = rec;
    else emp.personnelRecords.push(rec);

    if (typeof renderPersonnelTable === 'function') renderPersonnelTable(emp);

    // Refresh table in modal and reset form for next entry
    renderPrcMoTable();
    // Clear form for next entry (don't close — let user add more)
    document.getElementById('pm_effectiveDate').value = '';
    document.getElementById('pm_designation').value   = '';
    document.getElementById('pm_statusReg').value     = '';
    document.getElementById('pm_salary').value        = '';
    document.getElementById('pm_station').value       = '';
    document.getElementById('pm_sourceOfFund').value  = '';
    document.getElementById('pm_lastPromotion').value = '';
    document.getElementById('pm_remarks').value       = '';
    saveBtn.textContent = '💾 Save Record';

    // If it was an edit, close the modal
    if (editIdx !== null) closeFn();
  });
}

async function deletePrcRow(idx) {
  if (!confirm('Delete this personnel record?')) return;
  const emp = window._currentPrcEmp;
  if (!emp) return;
  const res = await apiCall('delete_personnel_record', { employee_id: emp.id, idx });
  if (!res.ok) { alert(res.error || 'Delete failed.'); return; }
  emp.personnelRecords.splice(idx, 1);
  renderPersonnelTable(emp);
}
