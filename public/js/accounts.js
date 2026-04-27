/* ============================================================
   SDO Koronadal City — Leave Card System
   accounts.js — Account Management Modal & Profile Logic
   RED ARMOURED EDITION — Unified, readable, stunning
   ============================================================ */

'use strict';

/* ─────────────────────────────────────────────────────────
   INJECT ACCOUNTS CSS (once)
───────────────────────────────────────────────────────── */
function injectAccFormStyle() {
  if (document.getElementById('acc-form-style')) return;
  const s = document.createElement('style');
  s.id = 'acc-form-style';
  s.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');

/* ── ADMIN PROFILE MODAL — Extra wide ── */
#adminProfMo .mb { max-width: 860px !important; width: 97% !important; }
#encProfMo .mb   { max-width: 560px !important; width: 96% !important; }
#saProfMo .mb    { max-width: 560px !important; width: 96% !important; }

/* ── Profile Hero ── */
.arm-prof-hero {
  background: linear-gradient(135deg, #3a0000 0%, #6b0a0a 25%, #9b1515 55%, #7a0e0e 80%, #2a0000 100%);
  border-radius: 16px; padding: 32px 34px; margin-bottom: 20px;
  position: relative; overflow: hidden;
  box-shadow: 0 12px 48px rgba(139,26,26,.55), inset 0 2px 0 rgba(255,120,80,.15), inset 0 -2px 0 rgba(0,0,0,.4);
  border: 1px solid rgba(220,60,40,.35);
}
.arm-prof-hero::before {
  content: ''; position: absolute; inset: 0;
  background-image:
    repeating-linear-gradient(90deg, transparent, transparent 48px, rgba(255,255,255,.02) 48px, rgba(255,255,255,.02) 49px),
    repeating-linear-gradient(0deg,  transparent, transparent 48px, rgba(255,255,255,.02) 48px, rgba(255,255,255,.02) 49px);
  pointer-events: none;
}
.arm-prof-hero::after {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, transparent 0%, rgba(255,140,80,.7) 30%, rgba(255,80,60,.9) 50%, rgba(255,140,80,.7) 70%, transparent 100%);
  pointer-events: none;
}
.arm-prof-hero-role {
  font-size: 11px; font-weight: 800; letter-spacing: 3px;
  text-transform: uppercase; color: rgba(255,200,130,.9);
  margin-bottom: 12px; display: flex; align-items: center; gap: 8px;
  position: relative; z-index: 1;
}
.arm-prof-pulse {
  width: 7px; height: 7px; border-radius: 50%; background: #ff7050;
  animation: arm-pulse 2s infinite; box-shadow: 0 0 8px rgba(255,100,60,.7);
}
@keyframes arm-pulse {
  0%,100% { opacity:1; transform:scale(1); }
  50%     { opacity:.5; transform:scale(1.7); }
}
.arm-prof-hero-name {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2rem; font-weight: 900;
  line-height: 1.1; margin-bottom: 10px;
  background: linear-gradient(90deg, #ffe0b0 0%, #ffb060 35%, #ff7040 65%, #ffb060 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  filter: drop-shadow(0 3px 12px rgba(255,80,30,.5));
  position: relative; z-index: 1;
}
.arm-prof-hero-id {
  font-size: 13px; color: rgba(255,210,160,.8);
  letter-spacing: 1px; position: relative; z-index: 1;
  background: rgba(0,0,0,.25); display: inline-block;
  padding: 4px 14px; border-radius: 20px;
  border: 1px solid rgba(255,120,60,.2);
}

/* ── My Profile section ── */
.arm-myprofile-box {
  background: linear-gradient(160deg, rgba(80,5,5,.45) 0%, rgba(35,5,5,.55) 100%);
  border: 1px solid rgba(200,48,48,.3);
  border-radius: 16px; padding: 24px 28px; margin-bottom: 6px;
  position: relative; overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,.3), inset 0 0 60px rgba(139,26,26,.08);
}
.arm-myprofile-box::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, transparent, #c83030 20%, #ff5030 50%, #c83030 80%, transparent);
  box-shadow: 0 0 12px rgba(220,48,30,.6);
}
.arm-myprofile-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px 22px;
}

/* ── Section Labels ── */
.arm-section-label {
  font-size: 12px; font-weight: 800; letter-spacing: 2px;
  text-transform: uppercase; color: rgba(255,180,120,.95);
  padding: 18px 0 12px;
  border-bottom: 1px solid rgba(180,40,30,.35);
  margin-bottom: 16px;
  display: flex; align-items: center; gap: 10px;
}
.arm-section-label::before {
  content: ''; display: inline-block; width: 18px; height: 3px;
  background: linear-gradient(90deg, #c83030, #ff6040);
  border-radius: 3px; flex-shrink: 0;
  box-shadow: 0 0 8px rgba(200,48,48,.6);
}

/* ── Add account buttons row ── */
.arm-add-btn-row { margin-top: 14px; }

/* ── VALID STATE — green glow like employee no. ── */
  #registerMo .f input.field-ok,
  #registerMo .f select.field-ok,
  #registerMo .f .rm-combo-input.field-ok {
    border-color: #4ade80 !important;
    background: #f0fff4 !important;
    color: #14532d !important;
  }
  #registerMo .f input.field-err,
  #registerMo .f select.field-err,
  #registerMo .f .rm-combo-input.field-err {
    border-color: #f87171 !important;
    background: #fff1f1 !important;
  }

  /* ── FIX: bottom inputs not clipped by sticky footer ── */
  #registerMo .md {
    padding-bottom: 100px !important;
  }

  /* ── FIX: email field bottom line — remove stray border ── */
  #registerMo #reg_email {
    border-bottom: 1.5px solid rgba(180,40,20,.4) !important;
  }
  #registerMo .f > div {
    display: flex;
    align-items: stretch;
  }
    
/* ── Inline form slot ── */
.acc-inline-form {
  background: linear-gradient(160deg, rgba(60,5,5,.5) 0%, rgba(25,3,3,.6) 100%) !important;
  border: 1.5px solid rgba(200,50,30,.4) !important;
  border-radius: 14px !important;
  padding: 22px 26px !important;
  margin-top: 14px !important;
  animation: accFormIn .22s ease both;
  position: relative; overflow: hidden;
}
.acc-inline-form::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, rgba(200,80,40,.7), transparent);
}
@keyframes accFormIn {
  from { opacity:0; transform:translateY(-8px); }
  to   { opacity:1; transform:none; }
}
.acc-inline-form-title {
  font-size: 11px; font-weight: 800; letter-spacing: 2px;
  text-transform: uppercase; color: rgba(255,170,110,.8); margin-bottom: 16px;
}
.acc-inline-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 14px 20px;
}

/* ── ALL inputs inside accounts modal — white bg, black text ── */
.arm-myprofile-box input,
.arm-myprofile-box select,
.acc-inline-form input,
.acc-inline-form select,
#encProfMo .f input,
#encProfMo .f select,
#saProfMo .f input,
#saProfMo .f select {
  background: #ffffff !important;
  color: #1a0505 !important;
  border: 1.5px solid rgba(180,40,20,.4) !important;
  border-radius: 9px !important;
  padding: 11px 14px !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  width: 100%; box-sizing: border-box;
  transition: border-color .2s, box-shadow .2s;
  text-transform: none !important;
}
.arm-myprofile-box input::placeholder,
.acc-inline-form input::placeholder,
#encProfMo .f input::placeholder,
#saProfMo .f input::placeholder {
  color: #999 !important; font-weight: 400 !important;
  text-transform: none !important;
}
.arm-myprofile-box input:focus,
.arm-myprofile-box select:focus,
.acc-inline-form input:focus,
.acc-inline-form select:focus,
#encProfMo .f input:focus,
#saProfMo .f input:focus {
  background: #ffffff !important;
  color: #1a0505 !important;
  border-color: rgba(200,50,30,.8) !important;
  box-shadow: 0 0 0 3px rgba(180,30,20,.2) !important;
  outline: none;
}

/* ── Labels inside profile/form ── */
.arm-myprofile-box .f label,
.acc-inline-form .f label,
#encProfMo .f label,
#saProfMo .f label {
  font-size: 12px !important;
  font-weight: 700 !important;
  color: rgba(255,190,140,.9) !important;
  letter-spacing: .5px !important;
  text-transform: uppercase !important;
}

/* ── Eye button — always visible ── */
.pw-wrap .eye-btn {
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  background: rgba(139,26,26,.7) !important;
  border: 1px solid rgba(200,60,40,.6) !important;
  border-radius: 7px !important;
  padding: 4px 9px !important; font-size: 16px !important;
  cursor: pointer; color: #1a0000 !important;
  opacity: 1 !important; line-height: 1;
  transition: background .15s, transform .15s; z-index: 10;
}
.pw-wrap .eye-btn:hover {
  background: rgba(180,30,10,.9) !important;
  color: #fff !important;
  transform: translateY(-50%) scale(1.12);
}

/* ── Account table — armoured ── */
.arm-acc-table {
  width: 100%; font-size: 13px; border-collapse: separate;
  border-spacing: 0; margin-top: 10px;
  border: 1px solid rgba(200,50,30,.35);
  border-radius: 12px; overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,.4), 0 0 0 1px rgba(200,60,40,.25);
}
.arm-acc-table thead tr {
  background: linear-gradient(135deg, #5a0a0a 0%, #7a1212 60%, #6b0f0f 100%);
}
.arm-acc-table thead th {
  padding: 13px 16px; text-align: left;
  font-size: 11.5px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;
  color: rgba(255,220,160,1); border-bottom: 2px solid rgba(200,60,40,.5);
  text-shadow: 0 1px 4px rgba(0,0,0,.4);
}
.arm-acc-table tbody tr {
  background: rgba(255,255,255,.03);
  border-bottom: 1px solid rgba(180,40,30,.2);
  transition: background .18s;
}
.arm-acc-table tbody tr:nth-child(even) { background: rgba(139,26,26,.1); }
.arm-acc-table tbody tr:hover           { background: rgba(200,50,30,.18) !important; }
.arm-acc-table tbody tr:last-child td   { border-bottom: none; }
.arm-acc-table tbody td {
  padding: 14px 16px; color: rgba(255,240,215,1);
  vertical-align: middle; font-size: 13.5px;
  border-bottom: 1px solid rgba(180,40,30,.15);
}
.arm-acc-empty {
  font-size: 13px; color: rgba(255,180,130,.5);
  padding: 16px 0 6px; font-style: italic;
}

/* ── Password mask ── */
.pw-mask {
  color: rgba(255,210,160,.9); font-size: 13px; letter-spacing: 3px; font-weight: 700;
}
.pw-eye-btn {
  background: rgba(139,26,26,.4) !important;
  border: 1px solid rgba(200,80,50,.4) !important;
  border-radius: 6px !important;
  cursor: pointer; font-size: 15px;
  opacity: 1; padding: 3px 8px; line-height: 1;
  filter: brightness(10) !important;
  transition: background .15s, transform .15s;
}
.pw-eye-btn:hover {
  background: rgba(200,50,30,.6) !important;
  filter: none !important;
  transform: scale(1.1);
}

/* ── Info box ── */
.arm-info-box {
  background: linear-gradient(135deg, rgba(100,40,5,.35), rgba(180,90,10,.15));
  border: 1px solid rgba(240,140,30,.3);
  border-radius: 12px; padding: 18px 22px; margin-top: 18px;
  display: flex; align-items: flex-start; gap: 14px;
  box-shadow: inset 0 1px 0 rgba(255,180,60,.1), 0 4px 16px rgba(0,0,0,.25);
}
.arm-info-icon { font-size: 22px; flex-shrink: 0; margin-top: 1px; }
.arm-info-text { font-size: 14px; color: rgba(255,215,150,.95); line-height: 1.8; }

/* ── Save button pulse ── */
@keyframes arm-save-pulse {
  0%,100% { box-shadow: 0 4px 18px rgba(139,26,26,.5); }
  50%     { box-shadow: 0 6px 28px rgba(200,50,30,.75); }
}
#mypSave:not(:disabled) { animation: arm-save-pulse 2.5s ease-in-out infinite; }

/* ── Firework effect ── */
.arm-firework {
  position: fixed; width: 6px; height: 6px; border-radius: 50%;
  pointer-events: none; z-index: 99999;
  animation: arm-firework-fly .8s cubic-bezier(.22,1,.36,1) forwards;
}
@keyframes arm-firework-fly {
  0%   { transform:translate(0,0) scale(1); opacity:1; }
  100% { transform:translate(var(--fx),var(--fy)) scale(0); opacity:0; }
}

/* ── Error in inline forms ── */
.aif_err_text, .saf_err_text {
  color: #f87171; font-size: 12px; min-height: 16px; padding: 3px 0;
}
`;
  document.head.appendChild(s);
}

/* ─────────────────────────────────────────────────────────
   EFFECTS
───────────────────────────────────────────────────────── */
function _accFireworks(el, color) {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
  for (let i = 0; i < 16; i++) {
    const fw = document.createElement('div');
    fw.className = 'arm-firework';
    const angle = (i / 16) * 360, dist = 45 + Math.random() * 65;
    const rad = angle * Math.PI / 180;
    fw.style.cssText = `left:${cx}px;top:${cy}px;--fx:${Math.cos(rad)*dist}px;--fy:${Math.sin(rad)*dist}px;background:${color||'#c83030'};`;
    document.body.appendChild(fw);
    setTimeout(() => fw.remove(), 900);
  }
}

/* ─────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────── */
function _escA(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

/* ─────────────────────────────────────────────────────────
   RENDER: Account table rows (Admin/Encoder)
───────────────────────────────────────────────────────── */
function renderAccountList(accounts, role) {
  if (!accounts.length) {
    return `<p class="arm-acc-empty">No accounts yet.</p>`;
  }
  return `
    <table class="arm-acc-table">
      <thead><tr>
        <th>Name</th>
        <th>Login Email</th>
        <th>Password</th>
        <th class="no-print" style="text-align:right;">Actions</th>
      </tr></thead>
      <tbody>
        ${accounts.map(a => `
          <tr>
            <td>${_escA(a.name)}</td>
            <td style="opacity:.8;">${_escA(a.login_id)}</td>
            <td>
              <div style="display:flex;align-items:center;gap:8px;">
                <span class="pw-mask" data-pw="${_escA(a.password || '')}">••••••••</span>
                <button class="pw-eye-btn" title="Show/hide" type="button">👁</button>
              </div>
            </td>
            <td class="no-print" style="text-align:right;">
              <button class="btn b-slt b-sm" data-editacc="${a.id}" data-role="${_escA(role)}"
                data-acc-name="${_escA(a.name)}" data-acc-login="${_escA(a.login_id)}" type="button">✏️ Edit</button>
              <button class="btn b-red b-sm" data-delacc="${a.id}" data-role="${_escA(role)}" type="button">🗑️</button>
            </td>
          </tr>`).join('')}
      </tbody>
    </table>`;
}

/* ─────────────────────────────────────────────────────────
   RENDER: School Admin account table rows
───────────────────────────────────────────────────────── */
function renderSAAccountList(saList) {
  if (!saList.length) {
    return `<p class="arm-acc-empty">No school admin accounts yet.</p>`;
  }
  return `
    <table class="arm-acc-table">
      <thead><tr>
        <th>Name</th>
        <th>Login Email</th>
        <th>Password</th>
        <th class="no-print" style="text-align:right;">Actions</th>
      </tr></thead>
      <tbody>
        ${saList.map(sa => `
          <tr>
            <td>${_escA(sa.name)}</td>
            <td style="opacity:.8;">${_escA(sa.login_id)}</td>
            <td>
              <div style="display:flex;align-items:center;gap:8px;">
                <span class="pw-mask" data-pw="${_escA(sa.password || '')}">••••••••</span>
                <button class="pw-eye-btn" title="Show/hide" type="button">👁</button>
              </div>
            </td>
            <td class="no-print" style="text-align:right;">
              <button class="btn b-slt b-sm" data-editsa="${sa.id}"
                data-sa-name="${_escA(sa.name)}" data-sa-login="${_escA(sa.login_id)}" type="button">✏️ Edit</button>
              <button class="btn b-red b-sm" data-delsa="${sa.id}" type="button">🗑️</button>
            </td>
          </tr>`).join('')}
      </tbody>
    </table>`;
}

/* ─────────────────────────────────────────────────────────
   RENDER: Inline form for Admin / Encoder
───────────────────────────────────────────────────────── */
function renderAccInlineForm(acc, role) {
  const isEdit = !!(acc && acc.id);
  const label = isEdit ? '✏️ Editing Account' : `➕ New ${role === 'admin' ? 'Admin' : 'Encoder'}`;
  return `
    <div class="acc-inline-form" id="accInlineForm">
      <div class="acc-inline-form-title">${label}</div>
      <div class="acc-inline-grid">
        <div class="f" style="margin:0;">
          <label>Full Name *</label>
          <input id="aif_name" value="${_escA(acc?.name || '')}" autocomplete="off"/>
        </div>
        <div class="f" style="margin:0;">
          <label>Login Email *</label>
          <input id="aif_email" value="${_escA(acc?.login_id || '')}" autocomplete="off"/>
        </div>
        <div class="f" style="margin:0;grid-column:1/-1;">
          <label>Password ${isEdit ? '<span style="font-weight:400;opacity:.5;font-size:11px;">(blank = keep current)</span>' : '*'}</label>
          <div class="pw-wrap">
            <input id="aif_pw" type="password" placeholder="${isEdit ? 'Leave blank to keep current' : 'Enter password'}"/>
            <button class="eye-btn" id="aif_eye" tabindex="-1" type="button">👁</button>
          </div>
        </div>
      </div>
      <div id="aif_err" class="aif_err_text" style="margin-top:8px;"></div>
      <div style="margin-top:16px;display:flex;gap:10px;justify-content:flex-end;">
        <button class="btn b-sm" style="background:rgba(255,255,255,.07);color:rgba(255,220,180,.7);border:1px solid rgba(139,26,26,.3);" id="aif_cancel" type="button">Cancel</button>
        <button class="btn b-pri b-sm" id="aif_save" type="button">💾 ${isEdit ? 'Update' : 'Create Account'}</button>
      </div>
    </div>`;
}

/* ─────────────────────────────────────────────────────────
   RENDER: Inline form for School Admin
───────────────────────────────────────────────────────── */
function renderSAInlineForm(sa) {
  const isEdit = !!sa;
  return `
    <div class="acc-inline-form" id="saInlineForm" style="border-color:rgba(30,58,110,.5)!important;">
      <div class="acc-inline-form-title" style="color:rgba(147,197,253,.8);">${isEdit ? '✏️ Editing School Admin' : '➕ New School Admin'}</div>
      <div class="acc-inline-grid">
        <div class="f" style="margin:0;">
          <label>Display Name *</label>
          <input id="saf_name" value="${_escA(sa?.name || '')}" autocomplete="off"/>
        </div>
        <div class="f" style="margin:0;">
          <label>Login Email *</label>
          <input id="saf_email" value="${_escA(sa?.login_id || '')}" autocomplete="off"/>
        </div>
        <div class="f" style="margin:0;grid-column:1/-1;">
          <label>Password ${isEdit ? '<span style="font-weight:400;opacity:.5;font-size:11px;">(blank = keep current)</span>' : '*'}</label>
          <div class="pw-wrap">
            <input id="saf_pw" type="password" placeholder="${isEdit ? 'Leave blank to keep current' : 'Enter password'}"/>
            <button class="eye-btn" id="saf_eye" tabindex="-1" type="button">👁</button>
          </div>
        </div>
      </div>
      <div id="saf_err" class="saf_err_text" style="margin-top:8px;"></div>
      <div style="margin-top:16px;display:flex;gap:10px;justify-content:flex-end;">
        <button class="btn b-sm" style="background:rgba(255,255,255,.07);color:rgba(255,220,180,.7);border:1px solid rgba(139,26,26,.3);" id="saf_cancel" type="button">Cancel</button>
        <button class="btn b-nvy b-sm" id="saf_save" type="button">💾 ${isEdit ? 'Update' : 'Create Account'}</button>
      </div>
    </div>`;
}

/* ─────────────────────────────────────────────────────────
   WIRE: Inline Admin / Encoder form
───────────────────────────────────────────────────────── */
function wireAccInlineForm(acc, role, onSuccess) {
  document.getElementById('aif_eye')?.addEventListener('click', () => {
    const pw  = document.getElementById('aif_pw');
    const eye = document.getElementById('aif_eye');
    if (!pw) return;
    const showing = pw.type === 'text';
    pw.type = showing ? 'password' : 'text';
    eye.textContent = showing ? '👁' : '🙈';
  });
  document.getElementById('aif_cancel')?.addEventListener('click', () => {
    document.getElementById('accInlineForm')?.remove();
  });
  document.getElementById('aif_save')?.addEventListener('click', async () => {
    const nameEl  = document.getElementById('aif_name');
    const emailEl = document.getElementById('aif_email');
    const pwEl    = document.getElementById('aif_pw');
    const errEl   = document.getElementById('aif_err');
    const saveBtn = document.getElementById('aif_save');
    if (!nameEl || !emailEl || !pwEl || !errEl || !saveBtn) return;
    const name     = nameEl.value.trim();
    const login_id = emailEl.value.trim().toLowerCase();
    const password = pwEl.value;
    errEl.textContent = '';
    if (!name)     { errEl.textContent = 'Full name is required.';   return; }
    if (!login_id) { errEl.textContent = 'Login email is required.'; return; }
    if (!acc && !password) { errEl.textContent = 'Password is required for new accounts.'; return; }
    saveBtn.disabled = true; saveBtn.textContent = 'Saving…';
    const res = await apiCall('save_admin', { role, account_id: acc?.id || 0, name, login_id, password });
    saveBtn.disabled = false; saveBtn.textContent = acc ? '💾 Update' : '💾 Create Account';
    if (!res.ok) { errEl.textContent = res.error || 'Save failed. Please try again.'; return; }
    if (role === 'admin' && login_id === state.adminCfg.id) {
      if (name)     state.adminCfg.name = name;
      if (login_id) state.adminCfg.id   = login_id;
      renderTopbar(); renderSidebar();
    }
    document.getElementById('accInlineForm')?.remove();
    if (typeof onSuccess === 'function') onSuccess();
  });
}

/* ─────────────────────────────────────────────────────────
   WIRE: Inline School Admin form
───────────────────────────────────────────────────────── */
function wireSAInlineForm(sa, onSuccess) {
  document.getElementById('saf_eye')?.addEventListener('click', () => {
    const pw  = document.getElementById('saf_pw');
    const eye = document.getElementById('saf_eye');
    if (!pw) return;
    const showing = pw.type === 'text';
    pw.type = showing ? 'password' : 'text';
    eye.textContent = showing ? '👁' : '🙈';
  });
  document.getElementById('saf_cancel')?.addEventListener('click', () => {
    document.getElementById('saInlineForm')?.remove();
  });
  document.getElementById('saf_save')?.addEventListener('click', async () => {
    const nameEl  = document.getElementById('saf_name');
    const emailEl = document.getElementById('saf_email');
    const pwEl    = document.getElementById('saf_pw');
    const errEl   = document.getElementById('saf_err');
    const saveBtn = document.getElementById('saf_save');
    if (!nameEl || !emailEl || !pwEl || !errEl || !saveBtn) return;
    const name     = nameEl.value.trim();
    const login_id = emailEl.value.trim().toLowerCase();
    const password = pwEl.value;
    errEl.textContent = '';
    if (!name)     { errEl.textContent = 'Display name is required.'; return; }
    if (!login_id) { errEl.textContent = 'Login email is required.';  return; }
    if (!sa && !password) { errEl.textContent = 'Password is required for new accounts.'; return; }
    saveBtn.disabled = true; saveBtn.textContent = 'Saving…';
    const res = await apiCall('save_school_admin', { sa_id: sa?.id || 0, name, login_id, password });
    saveBtn.disabled = false; saveBtn.textContent = sa ? '💾 Update' : '💾 Create Account';
    if (!res.ok) { errEl.textContent = res.error || 'Save failed. Please try again.'; return; }
    document.getElementById('saInlineForm')?.remove();
    if (typeof onSuccess === 'function') onSuccess();
  });
}

/* ─────────────────────────────────────────────────────────
   MAIN MODAL: showAdminProfileModal
───────────────────────────────────────────────────────── */
async function showAdminProfileModal() {
  document.getElementById('adminProfMo')?.remove();
  injectAccFormStyle();

  const res   = await apiCall('get_admin_cfg',     { role: 'admin' },   'GET');
  const enc   = await apiCall('get_admin_cfg',     { role: 'encoder' }, 'GET');
  const saRes = await apiCall('get_school_admins', {},                  'GET');

  const accounts    = res.accounts        || [];
  const encAccounts = enc.accounts        || [];
  const saList      = saRes.school_admins || [];
  const myAccount   = accounts.find(a => a.login_id === state.adminCfg.id) || accounts[0] || {};

  const html = `
    <div class="mo open" id="adminProfMo">
      <div class="mb">
        <div class="mo-orb mo-orb1"></div>
        <div class="mo-orb mo-orb2"></div>
        <div class="mh">
          <h3>⚙️ ${_escA(state.adminCfg.name)} — Account Settings</h3>
          <button class="mo-close-btn" id="adminProfClose" type="button">✕</button>
        </div>
        <div class="md" style="position:relative;z-index:1;">

          <div class="arm-prof-hero">
            <div class="arm-prof-hero-role">
              <span class="arm-prof-pulse"></span> ADMINISTRATOR
            </div>
            <div class="arm-prof-hero-name">${_escA(state.adminCfg.name || 'Administrator')}</div>
            <div class="arm-prof-hero-id">🔑 ${_escA(state.adminCfg.id || '—')}</div>
          </div>

          <div class="arm-section-label">👤 My Profile</div>
          <div class="arm-myprofile-box">
            <div class="arm-myprofile-grid">
              <div class="f" style="margin:0;">
                <label>Display Name</label>
                <input id="myp_name" value="${_escA(myAccount.name || state.adminCfg.name || '')}" autocomplete="off"/>
              </div>
              <div class="f" style="margin:0;">
                <label>Login Email</label>
                <input id="myp_email" value="${_escA(myAccount.login_id || state.adminCfg.id || '')}" autocomplete="off"/>
              </div>
              <div class="f" style="margin:0;grid-column:1/-1;">
                <label>New Password <span style="font-weight:400;opacity:.5;font-size:10px;">(blank = keep current)</span></label>
                <div class="pw-wrap">
                  <input id="myp_pw" type="password" placeholder="Leave blank to keep current password"/>
                  <button class="eye-btn" id="mypEye" tabindex="-1" type="button">👁</button>
                </div>
              </div>
            </div>
            <div id="myp_err" style="color:#f87171;font-size:12px;margin-top:8px;min-height:14px;"></div>
            <div style="margin-top:18px;display:flex;gap:10px;justify-content:flex-end;">
              <button class="btn b-pri b-sm" id="mypSave" type="button">💾 Save My Profile</button>
            </div>
          </div>

          <div class="arm-section-label" style="margin-top:22px;">🔴 Admin Accounts</div>
          <div id="adminAccList">${renderAccountList(accounts, 'admin')}</div>
          <div id="adminFormSlot"></div>
          <div class="arm-add-btn-row">
            <button class="btn b-pri b-sm" id="addAdminBtn" type="button">➕ Add Admin</button>
          </div>

          <div class="arm-section-label" style="margin-top:22px;">🟡 Encoder Accounts</div>
          <div id="encAccList">${renderAccountList(encAccounts, 'encoder')}</div>
          <div id="encFormSlot"></div>
          <div class="arm-add-btn-row">
            <button class="btn b-amb b-sm" id="addEncBtn" type="button">➕ Add Encoder</button>
          </div>

          <div class="arm-section-label" style="margin-top:22px;">🟢 School Admin Accounts</div>
          <div id="saAccList">${renderSAAccountList(saList)}</div>
          <div id="saFormSlot"></div>
          <div class="arm-add-btn-row">
            <button class="btn b-nvy b-sm" id="addSABtn" type="button">➕ Add School Admin</button>
          </div>

        </div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML('beforeend', html);
  const mo = document.getElementById('adminProfMo');

  document.getElementById('adminProfClose').addEventListener('click', () => closeMo('adminProfMo'));
  setTimeout(() => _accFireworks(mo.querySelector('.mb'), '#c83030'), 200);

  document.getElementById('mypEye').addEventListener('click', () => {
    const pw  = document.getElementById('myp_pw');
    const eye = document.getElementById('mypEye');
    if (!pw) return;
    const showing = pw.type === 'text';
    pw.type = showing ? 'password' : 'text';
    eye.textContent = showing ? '👁' : '🙈';
  });

  document.getElementById('mypSave').addEventListener('click', async () => {
    const name     = document.getElementById('myp_name').value.trim();
    const login_id = document.getElementById('myp_email').value.trim().toLowerCase();
    const password = document.getElementById('myp_pw').value;
    const errEl    = document.getElementById('myp_err');
    const btn      = document.getElementById('mypSave');
    errEl.textContent = '';
    if (!name)     { errEl.textContent = 'Display name is required.'; return; }
    if (!login_id) { errEl.textContent = 'Login email is required.';  return; }
    btn.disabled = true; btn.textContent = 'Saving…';
    const saveRes = await apiCall('save_admin', { role:'admin', account_id: myAccount.id || 0, name, login_id, password });
    btn.disabled = false; btn.textContent = '💾 Save My Profile';
    if (!saveRes.ok) { errEl.textContent = saveRes.error || 'Save failed.'; return; }
    state.adminCfg.name = name;
    state.adminCfg.id   = login_id;
    closeMo('adminProfMo');
    renderTopbar(); renderSidebar();
    showAdminProfileModal();
  });

  mo.addEventListener('click', e => {
    const btn = e.target.closest('.pw-eye-btn');
    if (!btn) return;
    const span = btn.previousElementSibling;
    if (!span?.classList.contains('pw-mask')) return;
    const hidden = span.textContent === '••••••••';
    span.textContent  = hidden ? (span.dataset.pw || '(not set)') : '••••••••';
    btn.style.opacity = hidden ? '1' : '.4';
  });

  document.getElementById('addAdminBtn').addEventListener('click', () => {
    document.getElementById('accInlineForm')?.remove();
    document.getElementById('saInlineForm')?.remove();
    const slot = document.getElementById('adminFormSlot');
    slot.innerHTML = renderAccInlineForm(null, 'admin');
    wireAccInlineForm(null, 'admin', () => { closeMo('adminProfMo'); showAdminProfileModal(); });
    slot.scrollIntoView({ behavior:'smooth', block:'nearest' });
  });

  document.getElementById('addEncBtn').addEventListener('click', () => {
    document.getElementById('accInlineForm')?.remove();
    document.getElementById('saInlineForm')?.remove();
    const slot = document.getElementById('encFormSlot');
    slot.innerHTML = renderAccInlineForm(null, 'encoder');
    wireAccInlineForm(null, 'encoder', () => { closeMo('adminProfMo'); showAdminProfileModal(); });
    slot.scrollIntoView({ behavior:'smooth', block:'nearest' });
  });

  document.getElementById('addSABtn').addEventListener('click', () => {
    document.getElementById('accInlineForm')?.remove();
    document.getElementById('saInlineForm')?.remove();
    const slot = document.getElementById('saFormSlot');
    slot.innerHTML = renderSAInlineForm(null);
    wireSAInlineForm(null, () => { closeMo('adminProfMo'); showAdminProfileModal(); });
    slot.scrollIntoView({ behavior:'smooth', block:'nearest' });
  });

  mo.querySelectorAll('[data-editacc]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('accInlineForm')?.remove();
      document.getElementById('saInlineForm')?.remove();
      const acc  = { id: +btn.dataset.editacc, name: btn.dataset.accName, login_id: btn.dataset.accLogin };
      const role = btn.dataset.role;
      const slot = role === 'admin' ? document.getElementById('adminFormSlot') : document.getElementById('encFormSlot');
      slot.innerHTML = renderAccInlineForm(acc, role);
      wireAccInlineForm(acc, role, () => { closeMo('adminProfMo'); showAdminProfileModal(); });
      slot.scrollIntoView({ behavior:'smooth', block:'nearest' });
    });
  });

  mo.querySelectorAll('[data-delacc]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Delete this account? This cannot be undone.')) return;
      const res2 = await apiCall('save_admin', { _delete: true, account_id: +btn.dataset.delacc, role: btn.dataset.role });
      if (!res2.ok) { alert(res2.error || 'Delete failed.'); return; }
      closeMo('adminProfMo'); showAdminProfileModal();
    });
  });

  mo.querySelectorAll('[data-editsa]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('accInlineForm')?.remove();
      document.getElementById('saInlineForm')?.remove();
      const sa = saList.find(s => s.id == btn.dataset.editsa);
      if (!sa) return;
      const slot = document.getElementById('saFormSlot');
      slot.innerHTML = renderSAInlineForm(sa);
      wireSAInlineForm(sa, () => { closeMo('adminProfMo'); showAdminProfileModal(); });
      slot.scrollIntoView({ behavior:'smooth', block:'nearest' });
    });
  });

  mo.querySelectorAll('[data-delsa]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Delete this School Admin account?')) return;
      const res2 = await apiCall('delete_school_admin', { sa_id: +btn.dataset.delsa });
      if (!res2.ok) { alert(res2.error || 'Delete failed.'); return; }
      closeMo('adminProfMo'); showAdminProfileModal();
    });
  });
}

/* ─────────────────────────────────────────────────────────
   MODAL: Encoder Profile
───────────────────────────────────────────────────────── */
async function showEncoderProfileModal() {
  document.getElementById('encProfMo')?.remove();
  injectAccFormStyle();

  const res      = await apiCall('get_admin_cfg', { role: 'encoder' }, 'GET');
  const accounts = res.accounts || [];
  const me       = accounts.find(a => a.login_id === state.encoderCfg.id) || accounts[0] || {};

  const html = `
    <div class="mo open" id="encProfMo">
      <div class="mb xsm">
        <div class="mo-orb mo-orb1"></div>
        <div class="mo-orb mo-orb2"></div>
        <div class="mh">
          <h3>✏️ Encoder Profile</h3>
          <button class="mo-close-btn" id="encProfClose" type="button">✕</button>
        </div>
        <div class="md" style="position:relative;z-index:1;">
          <div class="arm-prof-hero" style="margin-bottom:20px;">
            <div class="arm-prof-hero-role"><span class="arm-prof-pulse"></span> ENCODER</div>
            <div class="arm-prof-hero-name">${_escA(me?.name || state.encoderCfg.name || 'Encoder')}</div>
            <div class="arm-prof-hero-id">✉️ ${_escA(me?.login_id || state.encoderCfg.id || '—')}</div>
          </div>
          <div class="f">
            <label>Display Name</label>
            <input id="enc_name" value="${_escA(me?.name || state.encoderCfg.name || '')}" autocomplete="off"/>
          </div>
          <div id="enc_err" style="color:#f87171;font-size:12px;min-height:14px;margin-top:4px;"></div>
          <div class="arm-info-box" style="margin-top:16px;">
            <span class="arm-info-icon">🔒</span>
            <span class="arm-info-text">To change your login email or password, please contact your system administrator.</span>
          </div>
        </div>
        <div class="mf">
          <button class="btn" style="background:rgba(255,255,255,.07);color:rgba(255,220,180,.7);border:1px solid rgba(139,26,26,.3);" id="encProfCancel" type="button">Cancel</button>
          <button class="btn b-pri" id="encSave" type="button">💾 Save</button>
        </div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML('beforeend', html);
  document.getElementById('encProfClose').addEventListener('click',  () => closeMo('encProfMo'));
  document.getElementById('encProfCancel').addEventListener('click', () => closeMo('encProfMo'));
  document.getElementById('encSave').addEventListener('click', async () => {
    const name  = document.getElementById('enc_name').value.trim();
    const errEl = document.getElementById('enc_err');
    const btn   = document.getElementById('encSave');
    errEl.textContent = '';
    if (!name) { errEl.textContent = 'Name is required.'; return; }
    btn.disabled = true; btn.textContent = 'Saving…';
    const res2 = await apiCall('save_encoder', { name });
    btn.disabled = false; btn.textContent = '💾 Save';
    if (!res2.ok) { errEl.textContent = res2.error || 'Save failed.'; return; }
    state.encoderCfg.name = name;
    closeMo('encProfMo');
    renderTopbar(); renderSidebar();
  });
}

/* ─────────────────────────────────────────────────────────
   MODAL: School Admin Profile
───────────────────────────────────────────────────────── */
async function showSAProfileModal() {
  document.getElementById('saProfMo')?.remove();
  injectAccFormStyle();

  const html = `
    <div class="mo open" id="saProfMo">
      <div class="mb xsm">
        <div class="mo-orb mo-orb1"></div>
        <div class="mo-orb mo-orb2"></div>
        <div class="mh">
          <h3>👤 School Admin Profile</h3>
          <button class="mo-close-btn" id="saProfClose" type="button">✕</button>
        </div>
        <div class="md" style="position:relative;z-index:1;">
          <div class="arm-prof-hero" style="margin-bottom:20px;">
            <div class="arm-prof-hero-role"><span class="arm-prof-pulse"></span> SCHOOL ADMINISTRATOR</div>
            <div class="arm-prof-hero-name">${_escA(state.schoolAdminCfg.name || 'School Admin')}</div>
            <div class="arm-prof-hero-id">🏫 ${_escA(state.schoolAdminCfg.id || '—')}</div>
          </div>
          <div class="f">
            <label>Display Name</label>
            <input id="sap_name" value="${_escA(state.schoolAdminCfg.name || '')}" autocomplete="off"/>
          </div>
          <div id="sap_err" style="color:#f87171;font-size:12px;min-height:14px;margin-top:4px;"></div>
          <div class="arm-info-box" style="margin-top:16px;">
            <span class="arm-info-icon">🔒</span>
            <span class="arm-info-text">To update your login credentials, contact the system administrator.</span>
          </div>
        </div>
        <div class="mf">
          <button class="btn" style="background:rgba(255,255,255,.07);color:rgba(255,220,180,.7);border:1px solid rgba(139,26,26,.3);" id="saProfCancel" type="button">Cancel</button>
          <button class="btn b-pri" id="sapSave" type="button">💾 Save</button>
        </div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML('beforeend', html);
  document.getElementById('saProfClose').addEventListener('click',  () => closeMo('saProfMo'));
  document.getElementById('saProfCancel').addEventListener('click', () => closeMo('saProfMo'));
  document.getElementById('sapSave').addEventListener('click', async () => {
    const name  = document.getElementById('sap_name').value.trim();
    const errEl = document.getElementById('sap_err');
    const btn   = document.getElementById('sapSave');
    errEl.textContent = '';
    if (!name) { errEl.textContent = 'Name is required.'; return; }
    btn.disabled = true; btn.textContent = 'Saving…';
    const res = await apiCall('save_school_admin', {
      sa_id: state.schoolAdminCfg.dbId, name,
      login_id: state.schoolAdminCfg.id, password: '',
    });
    btn.disabled = false; btn.textContent = '💾 Save';
    if (!res.ok) { errEl.textContent = res.error || 'Save failed.'; return; }
    state.schoolAdminCfg.name = name;
    closeMo('saProfMo');
    renderTopbar(); renderSidebar();
  });
}