/* ============================================================
   SDO Koronadal City — Leave Card System
   accounts.js — Account Management Modal & Profile Logic
   RED ARMOURED EDITION — Wider, stunning, shocking effects
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
#adminProfMo .mb {
  max-width: 860px !important;
  width: 97% !important;
}

/* ── ENCODER PROFILE MODAL ── */
#encProfMo .mb {
  max-width: 560px !important;
  width: 96% !important;
}

/* ── SCHOOL ADMIN PROFILE MODAL (in accounts.js version) ── */
#saProfMo .mb {
  max-width: 560px !important;
  width: 96% !important;
}

/* ── My Profile section inside admin modal ── */
.arm-myprofile-box {
  background: rgba(255,255,255,.03);
  border: 1px solid rgba(139,26,26,.35);
  border-radius: 14px; padding: 22px 26px; margin-bottom: 6px;
  position: relative; overflow: hidden;
}
.arm-myprofile-box::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, #8b1a1a, #d43030, #8b1a1a); opacity: .6;
}
.arm-myprofile-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 14px 20px;
}

/* ── Section label inside modal body ── */
.arm-section-label {
  font-size: 10px; font-weight: 800; letter-spacing: 2px;
  text-transform: uppercase; color: rgba(255,160,100,.5);
  padding: 16px 0 10px;
  border-bottom: 1px solid rgba(139,26,26,.25);
  margin-bottom: 14px;
  display: flex; align-items: center; gap: 8px;
}
.arm-section-label::before {
  content: ''; display: inline-block; width: 12px; height: 2px;
  background: #8b1a1a; border-radius: 2px; flex-shrink: 0;
}

/* ── Add account buttons row ── */
.arm-add-btn-row { margin-top: 12px; }

/* ── Inline form slot ── */
.acc-inline-form {
  background: rgba(255,255,255,.03) !important;
  border: 1.5px solid rgba(139,26,26,.4) !important;
  border-radius: 12px !important;
  padding: 20px 24px !important;
  margin-top: 14px !important;
  animation: accFormIn .2s ease both;
  position: relative; overflow: hidden;
}
.acc-inline-form::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, rgba(139,26,26,.6), transparent);
}
@keyframes accFormIn {
  from { opacity:0; transform:translateY(-8px); }
  to   { opacity:1; transform:none; }
}
.acc-inline-form-title {
  font-size: 10px; font-weight: 800; letter-spacing: 1.8px;
  text-transform: uppercase; color: rgba(255,160,100,.55); margin-bottom: 14px;
}
.acc-inline-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px 18px;
}

/* ── Account table ── */
.arm-acc-table {
  width: 100%; font-size: 12px; border-collapse: collapse; margin-top: 8px;
}
.arm-acc-table thead tr {
  background: rgba(139,26,26,.2);
}
.arm-acc-table thead th {
  padding: 9px 12px; text-align: left; font-size: 10px; font-weight: 700;
  letter-spacing: .8px; text-transform: uppercase;
  color: rgba(255,160,100,.6); border-bottom: 1px solid rgba(139,26,26,.35);
}
.arm-acc-table tbody tr {
  border-bottom: 1px solid rgba(139,26,26,.15);
  transition: background .15s;
}
.arm-acc-table tbody tr:hover { background: rgba(139,26,26,.08); }
.arm-acc-table tbody td {
  padding: 9px 12px; color: rgba(255,220,180,.8); vertical-align: middle;
}
.arm-acc-empty {
  font-size: 12px; color: rgba(255,180,130,.35);
  padding: 12px 0 4px; font-style: italic;
}

/* ── Inline form inputs — always black text on white ── */
.acc-inline-form input,
.acc-inline-form select,
.acc-inline-form textarea {
  background: #ffffff !important;
  color: #111111 !important;
  border: 1px solid rgba(139,26,26,.45) !important;
  border-radius: 8px !important;
  padding: 9px 12px !important;
  font-size: 12.5px !important;
  width: 100%; box-sizing: border-box;
}
.acc-inline-form input::placeholder { color: #aaaaaa !important; }
.acc-inline-form input:focus,
.acc-inline-form select:focus {
  border-color: rgba(220,80,60,.7) !important;
  box-shadow: 0 0 0 3px rgba(139,26,26,.2) !important;
  outline: none;
}
.acc-inline-form select option { background: #ffffff; color: #111111; }

/* ── My Profile box inputs — black text ── */
.arm-myprofile-box input,
.arm-myprofile-box select {
  background: #ffffff !important;
  color: #111111 !important;
  border: 1px solid rgba(139,26,26,.45) !important;
  border-radius: 8px !important;
  padding: 9px 12px !important;
  font-size: 12.5px !important;
  width: 100%; box-sizing: border-box;
}
.arm-myprofile-box input::placeholder { color: #aaaaaa !important; }
.arm-myprofile-box input:focus,
.arm-myprofile-box select:focus {
  border-color: rgba(220,80,60,.7) !important;
  box-shadow: 0 0 0 3px rgba(139,26,26,.2) !important;
  outline: none;
}

/* ── Profile modal (encoder/SA) inputs — black text ── */
#encProfMo .f input, #encProfMo .f select,
#saProfMo  .f input, #saProfMo  .f select {
  background: #ffffff !important;
  color: #111111 !important;
}
#encProfMo .f input::placeholder,
#saProfMo  .f input::placeholder { color: #aaaaaa !important; }

/* ── My Profile — save button pulse ── */
@keyframes arm-save-pulse {
  0%,100% { box-shadow: 0 4px 18px rgba(139,26,26,.5); }
  50%     { box-shadow: 0 6px 28px rgba(200,50,30,.75); }
}
#mypSave:not(:disabled) { animation: arm-save-pulse 2.5s ease-in-out infinite; }

/* ── Profile hero (Encoder / School Admin) ── */
.arm-prof-hero {
  background: linear-gradient(135deg, #5a0a0a 0%, #7a1010 30%, #8b1a1a 65%, #6b0f0f 100%);
  border-radius: 14px; padding: 28px 30px; margin-bottom: 20px;
  position: relative; overflow: hidden;
  box-shadow: 0 8px 32px rgba(139,26,26,.35), inset 0 1px 0 rgba(255,180,120,.1);
  border: 1px solid rgba(180,60,60,.3);
}
.arm-prof-hero::after {
  content: '';
  position: absolute; inset: 0;
  background-image:
    repeating-linear-gradient(90deg, transparent, transparent 48px, rgba(255,255,255,.015) 48px, rgba(255,255,255,.015) 49px),
    repeating-linear-gradient(0deg, transparent, transparent 48px, rgba(255,255,255,.015) 48px, rgba(255,255,255,.015) 49px);
  pointer-events: none;
}
.arm-prof-hero-role {
  font-size: 9px; font-weight: 700; letter-spacing: 2.5px;
  text-transform: uppercase; color: rgba(255,200,140,.45);
  margin-bottom: 8px; display: flex; align-items: center; gap: 6px;
}
.arm-prof-pulse {
  width: 6px; height: 6px; border-radius: 50%; background: #f09070;
  animation: arm-pulse 2s infinite; box-shadow: 0 0 6px rgba(240,144,112,.6);
}
@keyframes arm-pulse {
  0%,100% { opacity:1; transform:scale(1); }
  50%     { opacity:.5; transform:scale(1.6); }
}
.arm-prof-hero-name {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.8rem; font-weight: 900; color: #fff;
  line-height: 1.1; margin-bottom: 6px;
  background: linear-gradient(90deg,#ffd0a0,#f0a060,#e08050);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  filter: drop-shadow(0 2px 8px rgba(200,80,40,.4));
  position: relative; z-index: 1;
}
.arm-prof-hero-id {
  font-size: 11px; color: rgba(255,200,150,.4);
  letter-spacing: .5px; position: relative; z-index: 1;
}

/* ── Readonly in profile modal ── */
.arm-readonly-label {
  font-size: 10px; font-weight: 700; letter-spacing: .6px;
  text-transform: uppercase; color: rgba(255,160,100,.45); margin-bottom: 6px; display: block;
}
.arm-readonly-val {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(139,26,26,.3);
  border-radius: 8px; padding: 10px 14px;
  font-size: 13px; color: rgba(255,220,180,.75);
  display: block; width: 100%; box-sizing: border-box;
}

/* ── Info box ── */
.arm-info-box {
  background: linear-gradient(135deg, rgba(120,53,15,.2), rgba(217,119,6,.08));
  border: 1px solid rgba(217,119,6,.25);
  border-radius: 12px; padding: 16px 20px; margin-top: 18px;
  display: flex; align-items: flex-start; gap: 12px;
}
.arm-info-icon { font-size: 20px; flex-shrink: 0; margin-top: 1px; }
.arm-info-text { font-size: 12px; color: rgba(253,186,116,.8); line-height: 1.65; }

/* ── Photo confetti (from school-admin.js style) ── */
.arm-photo-confetti {
  position: fixed; width: 8px; height: 8px; border-radius: 50%;
  pointer-events: none; z-index: 99999;
  animation: arm-confetti-fly .8s cubic-bezier(.22,1,.36,1) forwards;
}
@keyframes arm-confetti-fly {
  0%   { transform:translate(0,0) scale(1) rotate(0deg); opacity:1; }
  100% { transform:translate(var(--cx),var(--cy)) scale(0) rotate(var(--cr,360deg)); opacity:0; }
}
@keyframes arm-sparkle-ring {
  0%   { transform:scale(.5); opacity:1; }
  100% { transform:scale(2.5); opacity:0; }
}
.arm-sparkle-ring {
  position: absolute; inset: -4px; border-radius: 50%;
  border: 3px solid rgba(220,80,50,.7); pointer-events: none;
  animation: arm-sparkle-ring .6s ease-out forwards; z-index: 5;
}
.arm-star-burst {
  position: fixed; font-size: 18px; pointer-events: none; z-index: 99999;
  animation: arm-star-up .8s cubic-bezier(.22,1,.36,1) forwards;
}
@keyframes arm-star-up {
  0%   { opacity:1; transform:translateY(0) scale(1); }
  100% { opacity:0; transform:translateY(var(--sy,-80px)) scale(1.8) rotate(var(--sr,30deg)); }
}

/* ── Firework ── */
.arm-firework {
  position: fixed; width: 6px; height: 6px; border-radius: 50%;
  pointer-events: none; z-index: 99999;
  animation: arm-firework-fly .8s cubic-bezier(.22,1,.36,1) forwards;
}
@keyframes arm-firework-fly {
  0%   { transform:translate(0,0) scale(1); opacity:1; }
  100% { transform:translate(var(--fx),var(--fy)) scale(0); opacity:0; }
}


/* ── Inline form inputs — white bg, black text ── */
.acc-inline-form .f input,
.acc-inline-form .f select,
.acc-inline-form input,
.acc-inline-form select {
  background: #ffffff !important;
  color: #111111 !important;
  border: 1px solid rgba(139,26,26,.45) !important;
}
.acc-inline-form input::placeholder { color: #999999 !important; }
.acc-inline-form .f input:focus,
.acc-inline-form .f select:focus,
.acc-inline-form input:focus,
.acc-inline-form select:focus {
  border-color: rgba(180,30,20,.9) !important;
  box-shadow: 0 0 0 3px rgba(139,26,26,.2) !important;
  outline: none;
}
/* ── My Profile box inputs ── */
.arm-myprofile-box input,
.arm-myprofile-box select {
  background: #ffffff !important;
  color: #111111 !important;
  border: 1px solid rgba(139,26,26,.45) !important;
}
.arm-myprofile-box input::placeholder { color: #999999 !important; }
.arm-myprofile-box input:focus,
.arm-myprofile-box select:focus {
  border-color: rgba(180,30,20,.9) !important;
  box-shadow: 0 0 0 3px rgba(139,26,26,.2) !important;
  outline: none;
}
/* ── Error in inline forms ── */
.aif_err_text, .saf_err_text {
  color: #f87171; font-size: 11px; min-height: 16px; padding: 2px 0;
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
            <td style="opacity:.7;">${_escA(a.login_id)}</td>
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
            <td style="opacity:.7;">${_escA(sa.login_id)}</td>
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
          <input id="aif_name" value="${_escA(acc?.name || '')}"/>
        </div>
        <div class="f" style="margin:0;">
          <label>Login Email *</label>
          <input id="aif_email" value="${_escA(acc?.login_id || '')}"/>
        </div>
        <div class="f" style="margin:0;grid-column:1/-1;position:relative;">
          <label>Password ${isEdit ? '<span style="font-weight:400;opacity:.5;font-size:10px;">(blank = keep current)</span>' : '*'}</label>
          <input id="aif_pw" type="password" placeholder="${isEdit ? 'Leave blank to keep current' : 'Enter password'}" style="padding-right:38px!important;"/>
          <button class="eye-btn" id="aif_eye" tabindex="-1" type="button" style="position:absolute;right:8px;bottom:9px;">👁</button>
        </div>
      </div>
      <div id="aif_err" class="aif_err_text" style="margin-top:8px;"></div>
      <div style="margin-top:14px;display:flex;gap:10px;justify-content:flex-end;">
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
      <div class="acc-inline-form-title" style="color:rgba(147,197,253,.6);">${isEdit ? '✏️ Editing School Admin' : '➕ New School Admin'}</div>
      <div class="acc-inline-grid">
        <div class="f" style="margin:0;">
          <label>Display Name *</label>
          <input id="saf_name" value="${_escA(sa?.name || '')}"/>
        </div>
        <div class="f" style="margin:0;">
          <label>Login Email *</label>
          <input id="saf_email" value="${_escA(sa?.login_id || '')}"/>
        </div>
        <div class="f" style="margin:0;grid-column:1/-1;position:relative;">
          <label>Password ${isEdit ? '<span style="font-weight:400;opacity:.5;font-size:10px;">(blank = keep current)</span>' : '*'}</label>
          <input id="saf_pw" type="password" placeholder="${isEdit ? 'Leave blank to keep current' : 'Enter password'}" style="padding-right:38px!important;"/>
          <button class="eye-btn" id="saf_eye" tabindex="-1" type="button" style="position:absolute;right:8px;bottom:9px;">👁</button>
        </div>
      </div>
      <div id="saf_err" class="saf_err_text" style="margin-top:8px;"></div>
      <div style="margin-top:14px;display:flex;gap:10px;justify-content:flex-end;">
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
    const pw = document.getElementById('aif_pw');
    if (pw) pw.type = pw.type === 'password' ? 'text' : 'password';
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
    const pw = document.getElementById('saf_pw');
    if (pw) pw.type = pw.type === 'password' ? 'text' : 'password';
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
   MAIN MODAL: showAdminProfileModal — Red Armoured wide
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

          <!-- ── HERO ── -->
          <div class="arm-prof-hero">
            <div class="arm-prof-hero-role">
              <span class="arm-prof-pulse"></span> ADMINISTRATOR
            </div>
            <div class="arm-prof-hero-name">${_escA(state.adminCfg.name || 'Administrator')}</div>
            <div class="arm-prof-hero-id">🔑 ${_escA(state.adminCfg.id || '—')}</div>
          </div>

          <!-- ── MY PROFILE ── -->
          <div class="arm-section-label">👤 My Profile</div>
          <div class="arm-myprofile-box">
            <div class="arm-myprofile-grid">
              <div class="f" style="margin:0;">
                <label>Display Name</label>
                <input id="myp_name" value="${_escA(myAccount.name || state.adminCfg.name || '')}"/>
              </div>
              <div class="f" style="margin:0;">
                <label>Login Email</label>
                <input id="myp_email" value="${_escA(myAccount.login_id || state.adminCfg.id || '')}"/>
              </div>
              <div class="f" style="margin:0;grid-column:1/-1;position:relative;">
                <label>New Password <span style="font-weight:400;opacity:.5;font-size:10px;">(leave blank to keep current)</span></label>
                <input id="myp_pw" type="password" placeholder="Enter new password to change…" style="padding-right:38px!important;"/>
                <button class="eye-btn" id="mypEye" tabindex="-1" type="button" style="position:absolute;right:8px;bottom:9px;">👁</button>
              </div>
            </div>
            <div id="myp_err" style="color:#f87171;font-size:11px;margin-top:8px;min-height:14px;"></div>
            <div style="margin-top:16px;display:flex;gap:10px;justify-content:flex-end;">
              <button class="btn b-pri b-sm" id="mypSave" type="button">💾 Save My Profile</button>
            </div>
          </div>

          <!-- ── ADMIN ACCOUNTS ── -->
          <div class="arm-section-label" style="margin-top:22px;">🔴 Admin Accounts</div>
          <div id="adminAccList">${renderAccountList(accounts, 'admin')}</div>
          <div id="adminFormSlot"></div>
          <div class="arm-add-btn-row">
            <button class="btn b-pri b-sm" id="addAdminBtn" type="button">➕ Add Admin</button>
          </div>

          <!-- ── ENCODER ACCOUNTS ── -->
          <div class="arm-section-label" style="margin-top:22px;">🟡 Encoder Accounts</div>
          <div id="encAccList">${renderAccountList(encAccounts, 'encoder')}</div>
          <div id="encFormSlot"></div>
          <div class="arm-add-btn-row">
            <button class="btn b-amb b-sm" id="addEncBtn" type="button">➕ Add Encoder</button>
          </div>

          <!-- ── SCHOOL ADMIN ACCOUNTS ── -->
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

  /* Close */
  document.getElementById('adminProfClose').addEventListener('click', () => closeMo('adminProfMo'));

  /* Fireworks on open */
  setTimeout(() => _accFireworks(mo.querySelector('.mb'), '#c83030'), 200);

  /* Eye toggles */
  document.getElementById('mypEye').addEventListener('click', () => {
    const pw = document.getElementById('myp_pw');
    if (pw) pw.type = pw.type === 'password' ? 'text' : 'password';
  });

  /* My Profile save */
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

  /* Password eye in tables */
  mo.addEventListener('click', e => {
    const btn = e.target.closest('.pw-eye-btn');
    if (!btn) return;
    const span = btn.previousElementSibling;
    if (!span?.classList.contains('pw-mask')) return;
    const hidden = span.textContent === '••••••••';
    span.textContent  = hidden ? (span.dataset.pw || '(not set)') : '••••••••';
    btn.style.opacity = hidden ? '1' : '.4';
  });

  /* Add Admin */
  document.getElementById('addAdminBtn').addEventListener('click', () => {
    document.getElementById('accInlineForm')?.remove();
    document.getElementById('saInlineForm')?.remove();
    const slot = document.getElementById('adminFormSlot');
    slot.innerHTML = renderAccInlineForm(null, 'admin');
    wireAccInlineForm(null, 'admin', () => { closeMo('adminProfMo'); showAdminProfileModal(); });
    slot.scrollIntoView({ behavior:'smooth', block:'nearest' });
  });

  /* Add Encoder */
  document.getElementById('addEncBtn').addEventListener('click', () => {
    document.getElementById('accInlineForm')?.remove();
    document.getElementById('saInlineForm')?.remove();
    const slot = document.getElementById('encFormSlot');
    slot.innerHTML = renderAccInlineForm(null, 'encoder');
    wireAccInlineForm(null, 'encoder', () => { closeMo('adminProfMo'); showAdminProfileModal(); });
    slot.scrollIntoView({ behavior:'smooth', block:'nearest' });
  });

  /* Add School Admin */
  document.getElementById('addSABtn').addEventListener('click', () => {
    document.getElementById('accInlineForm')?.remove();
    document.getElementById('saInlineForm')?.remove();
    const slot = document.getElementById('saFormSlot');
    slot.innerHTML = renderSAInlineForm(null);
    wireSAInlineForm(null, () => { closeMo('adminProfMo'); showAdminProfileModal(); });
    slot.scrollIntoView({ behavior:'smooth', block:'nearest' });
  });

  /* Edit Admin / Encoder */
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

  /* Delete Admin / Encoder */
  mo.querySelectorAll('[data-delacc]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Delete this account? This cannot be undone.')) return;
      const res2 = await apiCall('save_admin', { _delete: true, account_id: +btn.dataset.delacc, role: btn.dataset.role });
      if (!res2.ok) { alert(res2.error || 'Delete failed.'); return; }
      closeMo('adminProfMo'); showAdminProfileModal();
    });
  });

  /* Edit School Admin */
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

  /* Delete School Admin */
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
   MODAL: Encoder Profile — Red Armoured
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
        <div class="mo-orb mo-orb1" style="background:#c83030;opacity:.12;"></div>
        <div class="mo-orb mo-orb2" style="background:#8b1a1a;opacity:.1;"></div>
        <div class="mh">
          <h3>✏️ Encoder Profile</h3>
          <button class="mo-close-btn" id="encProfClose" type="button">✕</button>
        </div>
        <div class="md" style="position:relative;z-index:1;">

          <!-- Hero -->
          <div class="arm-prof-hero" style="margin-bottom:20px;">
            <div class="arm-prof-hero-role">
              <span class="arm-prof-pulse"></span> ENCODER
            </div>
            <div class="arm-prof-hero-name">${_escA(me?.name || state.encoderCfg.name || 'Encoder')}</div>
            <div class="arm-prof-hero-id">✉️ ${_escA(me?.login_id || state.encoderCfg.id || '—')}</div>
          </div>

          <div class="f">
            <label>Display Name</label>
            <input id="enc_name" value="${_escA(me?.name || state.encoderCfg.name || '')}"/>
          </div>
          <div id="enc_err" style="color:#f87171;font-size:11px;min-height:14px;margin-top:4px;"></div>

          <div class="arm-info-box" style="margin-top:16px;">
            <span class="arm-info-icon">🔒</span>
            <span class="arm-info-text">
              To change your login email or password, please contact your system administrator.
            </span>
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
   MODAL: School Admin Profile — Red Armoured
   (This version in accounts.js is used for the API-saving path)
───────────────────────────────────────────────────────── */
async function showSAProfileModal() {
  document.getElementById('saProfMo')?.remove();
  injectAccFormStyle();

  const html = `
    <div class="mo open" id="saProfMo">
      <div class="mb xsm">
        <div class="mo-orb mo-orb1" style="background:#c83030;opacity:.12;"></div>
        <div class="mo-orb mo-orb2" style="background:#8b1a1a;opacity:.1;"></div>
        <div class="mh">
          <h3>👤 School Admin Profile</h3>
          <button class="mo-close-btn" id="saProfClose" type="button">✕</button>
        </div>
        <div class="md" style="position:relative;z-index:1;">

          <!-- Hero -->
          <div class="arm-prof-hero" style="margin-bottom:20px;">
            <div class="arm-prof-hero-role">
              <span class="arm-prof-pulse"></span> SCHOOL ADMINISTRATOR
            </div>
            <div class="arm-prof-hero-name">${_escA(state.schoolAdminCfg.name || 'School Admin')}</div>
            <div class="arm-prof-hero-id">🏫 ${_escA(state.schoolAdminCfg.id || '—')}</div>
          </div>

          <div class="f">
            <label>Display Name</label>
            <input id="sap_name" value="${_escA(state.schoolAdminCfg.name || '')}"/>
          </div>
          <div id="sap_err" style="color:#f87171;font-size:11px;min-height:14px;margin-top:4px;"></div>

          <div class="arm-info-box" style="margin-top:16px;">
            <span class="arm-info-icon">🔒</span>
            <span class="arm-info-text">
              To update your login credentials, contact the system administrator.
            </span>
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
      sa_id:    state.schoolAdminCfg.dbId,
      name,
      login_id: state.schoolAdminCfg.id,
      password: '',
    });
    btn.disabled = false; btn.textContent = '💾 Save';
    if (!res.ok) { errEl.textContent = res.error || 'Save failed.'; return; }
    state.schoolAdminCfg.name = name;
    closeMo('saProfMo');
    renderTopbar(); renderSidebar();
  });
}