'use strict';

// ── API Base & CSRF ───────────────────────────────────────────
const API = window.API_BASE || '/api';
const getCSRF = () =>
  window.CSRF_TOKEN ||
  document.querySelector('meta[name="csrf-token"]')?.content ||
  '';

async function apiCall(action, body = {}, method = 'POST') {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    let url = `${API}/${action}`;
    const opts = {
      headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': getCSRF() },
      signal: controller.signal,
    };
    if (method === 'GET') {
      url += `?${new URLSearchParams(body)}`;
      opts.method = 'GET';
    } else {
      opts.method = 'POST';
      opts.body = JSON.stringify(body);
    }
    const r = await fetch(url, opts);
    const contentType = r.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return { ok: false, error: `Server error ${r.status}. Check CSRF token or server logs.` };
    }
    return await r.json();
  } catch (e) {
    if (e.name === 'AbortError') return { ok: false, error: 'Request timed out.' };
    return { ok: false, error: e.message };
  } finally {
    clearTimeout(timer);
  }
}

// ── Save row balances ─────────────────────────────────────────
async function saveRowBalances(records, empId, status) {
  const updates = computeRowBalanceUpdates(records, empId, status);
  for (const u of updates) {
    await apiCall('save_row_balance', u);
  }
}

// ── State ─────────────────────────────────────────────────────
const state = {
  db: [], role: null, isAdmin: false, isEncoder: false, isSchoolAdmin: false,
  curId: null, page: 'home',
  adminCfg:       { id: '', password: '', name: 'Administrator' },
  encoderCfg:     { id: '', password: '', name: 'Encoder' },
  schoolAdminCfg: { id: '', dbId: 0,      name: 'School Admin' },
  loading: false,
};

window.state           = state;
window.apiCall         = apiCall;
window.saveRowBalances = saveRowBalances;

const pag = { page: 1, limit: 100, total: 0, loading: false };

// ── Card status helper ────────────────────────────────────────
function isEmpCardUpdated(emp) {
  if (typeof emp.card_status_updated === 'boolean') {
    return emp.card_status_updated;
  }
  return isCardUpdatedThisMonth(emp.records || [], emp.status || '', emp.lastEditedAt);
}
window.isEmpCardUpdated = isEmpCardUpdated;

// ── Page reload indicator ─────────────────────────────────────
function showReloadingBanner() {
  if (document.getElementById('lms-reload-banner')) return;

  const banner = document.createElement('div');
  banner.id = 'lms-reload-banner';
  banner.style.cssText = [
    'position:fixed', 'top:0', 'left:0', 'right:0', 'bottom:0',
    'z-index:99999', 'display:flex', 'align-items:center',
    'justify-content:center', 'flex-direction:column',
    'background:radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0a 100%)',
    'overflow:hidden',
  ].join(';');

  banner.innerHTML = `
    <style>
      @keyframes shieldSmash {
        0%   { transform: scale(0.1) translateY(-300px) rotateX(60deg); opacity:0; filter: drop-shadow(0 0 0px #c0392b); }
        40%  { transform: scale(1.4) translateY(20px)  rotateX(-8deg);  opacity:1; filter: drop-shadow(0 0 60px #e74c3c); }
        60%  { transform: scale(0.95) translateY(-5px) rotateX(3deg);   filter: drop-shadow(0 0 30px #c0392b); }
        75%  { transform: scale(1.08) translateY(3px)  rotateX(-2deg);  filter: drop-shadow(0 0 50px #ff6b6b); }
        90%  { transform: scale(0.98) translateY(0px)  rotateX(0deg);   filter: drop-shadow(0 0 20px #c0392b); }
        100% { transform: scale(1.0)  translateY(0px)  rotateX(0deg);   filter: drop-shadow(0 0 25px #e74c3c); }
      }
      @keyframes shieldPulse {
        0%,100% { filter: drop-shadow(0 0 25px #e74c3c) drop-shadow(0 0 50px #8b0000); }
        50%     { filter: drop-shadow(0 0 45px #ff4444) drop-shadow(0 0 90px #cc0000); }
      }
      @keyframes screenShake {
        0%,100% { transform: translate(0,0); }
        10%     { transform: translate(-8px, 4px); }
        20%     { transform: translate(8px, -4px); }
        30%     { transform: translate(-6px, 6px); }
        40%     { transform: translate(6px, -2px); }
        50%     { transform: translate(-4px, 4px); }
        60%     { transform: translate(4px, -4px); }
        70%     { transform: translate(-2px, 2px); }
        80%     { transform: translate(2px, -2px); }
      }
      @keyframes cracksAppear {
        0%   { opacity:0; }
        55%  { opacity:0; }
        60%  { opacity:1; }
        100% { opacity:0.6; }
      }
      @keyframes textFade {
        0%,50% { opacity:0; transform:translateY(10px); }
        70%    { opacity:1; transform:translateY(0); }
        100%   { opacity:1; }
      }
      @keyframes glowPulse {
        0%,100% { opacity:0.15; }
        50%     { opacity:0.35; }
      }
      #shield-wrap {
        animation: shieldSmash 0.8s cubic-bezier(0.25,0.46,0.45,0.94) forwards,
                   shieldPulse 1.5s ease-in-out 0.8s infinite;
        transform-origin: center center;
      }
      #shake-layer { animation: screenShake 0.15s ease-in-out 0.75s 1; }
      #crack-layer { animation: cracksAppear 1.2s ease forwards; }
      #banner-text { animation: textFade 1s ease 0.85s forwards; opacity: 0; }
      #glow-bg     { animation: glowPulse 2s ease-in-out 0.8s infinite; }
    </style>
    <div id="glow-bg" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:600px;height:600px;background:radial-gradient(circle, rgba(180,0,0,0.3) 0%, transparent 70%);border-radius:50%;pointer-events:none;"></div>
    <div id="shake-layer" style="display:flex;flex-direction:column;align-items:center;gap:24px;position:relative;z-index:2;">
      <div id="shield-wrap">
        <svg width="220" height="260" viewBox="0 0 220 260" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="shieldFace" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stop-color="#c0392b"/><stop offset="30%"  stop-color="#922b21"/>
              <stop offset="70%"  stop-color="#641e16"/><stop offset="100%" stop-color="#3b0f0a"/>
            </linearGradient>
            <linearGradient id="shieldLeft" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stop-color="#e74c3c"/><stop offset="100%" stop-color="#c0392b"/>
            </linearGradient>
            <linearGradient id="shieldRight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stop-color="#4a0e0a"/><stop offset="100%" stop-color="#2c0905"/>
            </linearGradient>
            <linearGradient id="shieldTop" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stop-color="#f1948a"/><stop offset="100%" stop-color="#e74c3c"/>
            </linearGradient>
            <linearGradient id="shieldBot" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stop-color="#3b0f0a"/><stop offset="100%" stop-color="#1a0503"/>
            </linearGradient>
            <linearGradient id="gloss" x1="20%" y1="0%" x2="60%" y2="60%">
              <stop offset="0%"   stop-color="rgba(255,255,255,0.35)"/>
              <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
            </linearGradient>
            <filter id="rimGlow">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <polygon points="10,18  38,18  38,222  10,245"   fill="url(#shieldLeft)"  opacity="0.9"/>
          <polygon points="210,18 182,18 182,222 210,245"  fill="url(#shieldRight)" opacity="0.9"/>
          <polygon points="10,18  210,18 182,42  38,42"    fill="url(#shieldTop)"   opacity="0.9"/>
          <polygon points="10,245 38,222 110,260 110,240"  fill="url(#shieldBot)"   opacity="0.85"/>
          <polygon points="210,245 182,222 110,260 110,240" fill="url(#shieldBot)"  opacity="0.6"/>
          <path d="M38,42 L182,42 L182,222 Q110,260 110,260 Q110,260 38,222 Z" fill="url(#shieldFace)"/>
          <path d="M52,56 L168,56 L168,210 Q110,248 110,248 Q110,248 52,210 Z" fill="none" stroke="#e74c3c" stroke-width="2.5" opacity="0.5" filter="url(#rimGlow)"/>
          <circle cx="110" cy="140" r="46" fill="none" stroke="#e74c3c" stroke-width="2" opacity="0.6"/>
          <circle cx="110" cy="140" r="30" fill="rgba(0,0,0,0.35)"/>
          <polygon points="110,100 116,126 140,120 122,138 140,160 114,152 110,178 106,152 80,160 98,138 80,120 104,126" fill="#e74c3c" opacity="0.9"/>
          <circle cx="110" cy="140" r="8" fill="#ff6b6b"/>
          <circle cx="110" cy="140" r="4" fill="white" opacity="0.8"/>
          <path d="M52,56 L130,56 L130,140 Q90,160 52,140 Z" fill="url(#gloss)" opacity="0.5"/>
          <rect x="38" y="18" width="144" height="24" rx="4" fill="url(#shieldTop)" opacity="0.95"/>
          <circle cx="55"  cy="62"  r="4" fill="#922b21" stroke="#e74c3c" stroke-width="1"/>
          <circle cx="165" cy="62"  r="4" fill="#922b21" stroke="#e74c3c" stroke-width="1"/>
          <circle cx="55"  cy="208" r="4" fill="#922b21" stroke="#e74c3c" stroke-width="1"/>
          <circle cx="165" cy="208" r="4" fill="#922b21" stroke="#e74c3c" stroke-width="1"/>
        </svg>
      </div>
      <div id="crack-layer" style="position:absolute;top:0;left:50%;transform:translateX(-50%);pointer-events:none;">
        <svg width="220" height="260" viewBox="0 0 220 260" style="opacity:0.25;">
          <line x1="110" y1="60"  x2="90"  y2="120" stroke="white" stroke-width="1.5"/>
          <line x1="90"  y1="120" x2="70"  y2="140" stroke="white" stroke-width="1"/>
          <line x1="110" y1="60"  x2="130" y2="100" stroke="white" stroke-width="1.5"/>
          <line x1="130" y1="100" x2="155" y2="130" stroke="white" stroke-width="1"/>
          <line x1="110" y1="60"  x2="108" y2="90"  stroke="white" stroke-width="1"/>
        </svg>
      </div>
      <div id="banner-text" style="text-align:center;">
        <div style="font-family:Inter,sans-serif;font-size:13px;font-weight:800;letter-spacing:3px;color:#e74c3c;text-transform:uppercase;text-shadow:0 0 20px #e74c3c,0 0 40px #8b0000;">⟳ &nbsp; LOADING — PLEASE WAIT</div>
        <div style="font-family:Inter,sans-serif;font-size:10px;color:rgba(255,255,255,0.4);margin-top:6px;letter-spacing:1px;">SDO Koronadal City · Leave Card System</div>
      </div>
    </div>`;

  document.body.prepend(banner);
}

function hideReloadingBanner() {
  const banner = document.getElementById('lms-reload-banner');
  if (banner) {
    banner.style.transition = 'opacity 0.4s ease';
    banner.style.opacity = '0';
    setTimeout(() => banner.remove(), 400);
  }
}

// ── Router ────────────────────────────────────────────────────
function setPage(p) {
  state.page = p;
if (state.isSchoolAdmin && (p === 'cards' || p === 'card-view')) {
    p = 'home'; state.page = 'home';
}
  document.querySelectorAll('.page').forEach(el => el.classList.remove('on'));
const pageId = 'pg-' + p;
  const el = document.getElementById(pageId);
  if (el) el.classList.add('on');
  document.querySelectorAll('.sb-item[data-page]').forEach(i => {
    i.classList.toggle('active', i.dataset.page === p);
  });
  // Only call closeSidebar for non-employee roles (employees have no sidebar)
  if (state.role !== 'employee') closeSidebar();
  sessionStorage.setItem('lms_page', p);
  if (p !== 'card-view') sessionStorage.removeItem('lms_empId');
if (p === 'home') {
  if (state.isSchoolAdmin) renderSADashboard();
  else renderHomeDashboard();
}if (p === 'list') {
    if (state.isSchoolAdmin) renderSAPersonnelList();
    else                     renderPersonnelList();
}
  if (p === 'cards')       renderLeaveCards();
if (p === 'user')        renderUserPage();
if (p === 'submissions') renderSubmissionsPage();
}
window.setPage = setPage;

// ── Data loading ──────────────────────────────────────────────
async function loadAllPersonnel() {
  pag.page = 1; pag.total = 0; state.db = [];
  await loadPersonnelPage();
}

async function loadPersonnelPage() {
  if (pag.loading) return;
  pag.loading = true;
  const res = await apiCall('get_personnel', { page: pag.page, limit: pag.limit }, 'GET');
  pag.loading = false;
  if (!res.ok) return;
  const incoming = res.data || [];
  if (pag.page === 1) state.db = incoming;
  else state.db = [...state.db, ...incoming];
  pag.total = res.total || state.db.length;
  if (state.db.length < pag.total) { pag.page++; await loadPersonnelPage(); }
}

async function ensureRecords(empId) {
  const emp = state.db.find(e => e.id === empId);
  if (!emp) return null;
  if (emp.records && emp.records.length > 0) return emp;
  const res = await apiCall('get_records', { employee_id: empId }, 'GET');
  if (res.ok) emp.records = res.records || [];
  sortRecordsInPlace(emp.records);
  return emp;
}
window.ensureRecords = ensureRecords;

// ── After saving: update in-memory card_status_updated ────────
function refreshEmpCardStatus(emp) {
  if (!emp) return;
  const now = new Date();
  const year  = now.getFullYear();
  const month = now.getMonth() + 1;
  const cat   = (emp.status || '').toLowerCase();
  const isNTorTR = cat === 'non-teaching' || cat === 'teaching related';
  if (isNTorTR) {
    emp.card_status_updated = hasAccrualThisMonthInRecords(emp.records || [], year, month);
  } else {
    emp.card_status_updated = hasTeachingEntryThisMonth(emp.records || [], year, month);
  }
}
window.refreshEmpCardStatus = refreshEmpCardStatus;

function hasTeachingEntryThisMonth(records, year, month) {
  if (!records || records.length === 0) return false;
  return records.some(r => {
    if (r._conversion) return false;
    for (const field of ['from', 'to']) {
      const ds = r[field] || '';
      if (!ds) continue;
      const d = new Date(ds + 'T00:00:00');
      if (d.getFullYear() === year && (d.getMonth() + 1) === month) return true;
    }
    const prd = (r.prd || '').trim();
    if (prd) {
      const now = new Date(year, month - 1, 1);
      const monthLabel = now.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      const mmStr = String(month).padStart(2, '0');
      if (
        prd.toLowerCase().includes(monthLabel.toLowerCase()) ||
        prd.includes(`${mmStr}/${year}`) ||
        prd.includes(`${mmStr}-${year}`) ||
        prd.startsWith(`${mmStr}/`) ||
        prd.startsWith(`${mmStr}-`)
      ) {
        const fullDateMatch = prd.match(/^(\d{2})[\/\-](\d{2})[\/\-](\d{4})/);
        if (fullDateMatch) {
          return parseInt(fullDateMatch[1]) === month && parseInt(fullDateMatch[3]) === year;
        }
        return true;
      }
    }
    return false;
  });
}
window.hasTeachingEntryThisMonth = hasTeachingEntryThisMonth;

function hasAccrualThisMonthInRecords(records, year, month) {
  if (!records || records.length === 0) return false;
  const now = new Date(year, month - 1, 1);
  const monthLabel = now.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const mmStr = String(month).padStart(2, '0');
  return records.some(r => {
    if (r._conversion) return false;
    const a = (r.action || '').toLowerCase();
    const isAccrual = a.includes('monthly accrual') || a.includes('service credit');
    if (!isAccrual) return false;
    if (r.created_at) {
      const d = new Date(r.created_at);
      if (d.getFullYear() === year && (d.getMonth() + 1) === month) return true;
    }
    const prd  = (r.prd  || '').toLowerCase();
    const spec = (r.spec || '').toLowerCase();
    const label = monthLabel.toLowerCase();
    return (
      prd.includes(label) || spec.includes(label) ||
      prd.includes(`${mmStr}/${year}`) || prd.includes(`${mmStr}-${year}`)
    );
  });
}
window.hasAccrualThisMonthInRecords = hasAccrualThisMonthInRecords;

// ── LOGIN ─────────────────────────────────────────────────────
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('s-' + name)?.classList.add('active');
}

function initLogin() {
  const form    = document.getElementById('loginForm');
  const err     = document.getElementById('loginErr');
  const eyeBtn  = document.getElementById('eyeBtn');
  const pwInput = document.getElementById('lpw');

  eyeBtn?.addEventListener('click', () => {
    pwInput.type = pwInput.type === 'password' ? 'text' : 'password';
    eyeBtn.textContent = pwInput.type === 'password' ? '👁' : '🙈';
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    err.style.display = 'none';
    const btn = form.querySelector('button[type=submit]');
    btn.textContent = 'Signing in…'; btn.disabled = true;
    const id       = document.getElementById('lid').value.trim();
    const password = pwInput.value;
    const res = await apiCall('login', { id, password });
    btn.textContent = 'Sign In'; btn.disabled = false;
    if (!res.ok) {
      err.textContent = res.error || 'Login failed.';
      err.style.display = 'block';
      return;
    }
    await doLogin(res);
  });
}

async function doLogin(res) {
  if (res.role === 'admin' || res.role === 'encoder') {
    const isEnc = res.role === 'encoder';
    state.isAdmin = true; state.isEncoder = isEnc; state.isSchoolAdmin = false;
    state.role = res.role;
    if (!isEnc) state.adminCfg   = { ...state.adminCfg, id: res.login_id, name: res.name };
    else        state.encoderCfg = { id: res.login_id, name: res.name };
  } else if (res.role === 'school_admin') {
    state.isSchoolAdmin = true; state.isAdmin = false; state.isEncoder = false;
    state.role = 'school_admin';
    state.schoolAdminCfg = { id: res.login_id, dbId: res.db_id, name: res.name };
  } else {
    state.role = 'employee'; state.curId = res.employee_id;
    state.isAdmin = state.isEncoder = state.isSchoolAdmin = false;
  }

  showScreen('app');
  renderTopbar();
  renderSidebar();
  await loadAllPersonnel();
  const saRes = await apiCall('get_school_admins', {}, 'GET');
  if (saRes.ok) window.state.schoolAdmins = saRes.school_admins || [];

  if (state.role === 'employee') setPage('user');
  else                           setPage('home');
}

// ── LOGOUT ────────────────────────────────────────────────────
async function doLogout() {
  try { await apiCall('logout', {}); } catch (e) {}
  state.db = [];
  state.role = null;
  state.isAdmin = false;
  state.isEncoder = false;
  state.isSchoolAdmin = false;
  state.curId = null;
  state.adminCfg       = { id: '', password: '', name: 'Administrator' };
  state.encoderCfg     = { id: '', password: '', name: 'Encoder' };
  state.schoolAdminCfg = { id: '', dbId: 0, name: 'School Admin' };
  sessionStorage.removeItem('lms_page');
  sessionStorage.removeItem('lms_empId');
  document.getElementById('pg-card-view')?.remove();
  showScreen('login');
}
window.doLogout = doLogout;

// ── TOPBAR ────────────────────────────────────────────────────
function renderTopbar() {
  const tb = document.getElementById('topbar');

  // ── EMPLOYEE: clean topbar, no hamburger ──
  if (state.role === 'employee') {
    const emp = state.db.find(e => e.id === state.curId);
    const name = emp
      ? escHtml([emp.surname, emp.given].filter(Boolean).join(', '))
      : 'Employee';
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
            Logged in as <strong>${name}</strong>
          </span>
          <button class="nb out" id="empLogoutBtn">🚪 Logout</button>
        </div>
      </div>`;
    document.getElementById('empLogoutBtn')?.addEventListener('click', () => showLogoutModal());
    return;
  }

  // ── ADMIN / ENCODER / SCHOOL ADMIN ──
  const roleName =
    state.role === 'admin'          ? state.adminCfg.name
    : state.role === 'encoder'      ? state.encoderCfg.name
    : state.role === 'school_admin' ? state.schoolAdminCfg.name
    : 'Employee';

  const canAdmin = state.isAdmin && !state.isEncoder;
  let navHtml = '';
  if (canAdmin) {
    navHtml = `<button class="nb" id="accountsBtn" title="Manage Accounts &amp; Profile">⚙️ ${escHtml(roleName)}</button>`;
  } else if (state.isSchoolAdmin) {
    navHtml = `<button class="nb" id="saProfileBtn" title="My Profile">👤 ${escHtml(roleName)}</button>`;
  } else if (state.isEncoder) {
    navHtml = `<button class="nb" id="encoderProfileBtn" title="My Profile">✏️ ${escHtml(roleName)}</button>`;
  } else {
    navHtml = `<span style="font-size:11px;color:var(--mu);margin-right:8px;">Logged in as <strong>${escHtml(roleName)}</strong></span>
               <button class="nb out" id="logoutBtn">🚪 Logout</button>`;
  }

  tb.innerHTML = `
    <div class="tb-in">
      <div class="tb-brand">
        <button class="sb-toggle" id="sbToggle" title="Menu">☰</button>
        <img class="tb-logo" src="/img/sdo.jpg"
             onerror="this.src='https://upload.wikimedia.org/wikipedia/en/a/a8/DepEd_Koronadal.png'"
             alt="DepEd"/>
        <div class="tb-divider"></div>
        <div>
          <div class="tb-title">SDO Koronadal City</div>
          <div class="tb-sub">Leave Card Management System</div>
        </div>
      </div>
      <div class="tb-nav">${navHtml}</div>
    </div>`;

  document.getElementById('sbToggle')?.addEventListener('click', openSidebar);
  document.getElementById('accountsBtn')?.addEventListener('click', () => showAdminProfileModal());
  document.getElementById('saProfileBtn')?.addEventListener('click', () => showSAProfileModal());
  document.getElementById('encoderProfileBtn')?.addEventListener('click', () => showEncoderProfileModal());
  document.getElementById('logoutBtn')?.addEventListener('click', () => showLogoutModal());
}

// ── SIDEBAR ───────────────────────────────────────────────────
function renderSidebar() {
  const sb = document.getElementById('sidebar');

  // ── EMPLOYEE: no sidebar ──
  if (state.role === 'employee') {
    sb.innerHTML = '';
    sb.classList.remove('open');
    document.getElementById('sbOverlay')?.classList.remove('open');
    return;
  }

  // ── ADMIN / ENCODER / SCHOOL ADMIN ──
  const canEncode = state.isAdmin || state.isEncoder;
  let navItems = '';

 if (state.isSchoolAdmin) { navItems = ` <div class="sb-item" data-page="home"><span class="sb-icon">🏠</span>Dashboard</div> <div class="sb-item" data-page="list"><span class="sb-icon">👥</span>Personnel List</div>`;
  } else {
    navItems = `<div class="sb-item" data-page="home"><span class="sb-icon">🏠</span>Dashboard</div>`;
    if (canEncode) {
  navItems += `
    <div class="sb-item" data-page="list"><span class="sb-icon">👥</span>Personnel List</div>
    <div class="sb-item" data-page="cards"><span class="sb-icon">📋</span>Leave Cards</div>
    <div class="sb-item" data-page="submissions"><span class="sb-icon">📨</span>Submissions</div>
    <div class="sb-item" id="sbRecordedArchive" style="cursor:pointer;"><span class="sb-icon">📁</span>Recorded Archive</div>`;
}
  }

  sb.innerHTML = `
    <div class="sb-head">
      <img class="sb-logo" src="/img/sdo.jpg"
           onerror="this.src='https://upload.wikimedia.org/wikipedia/en/a/a8/DepEd_Koronadal.png'"
           alt=""/>
      <div class="sb-brand">
        <div class="sb-brand-title">SDO Koronadal City</div>
        <div class="sb-brand-sub">Leave Card System</div>
      </div>
      <button class="sb-close" id="sbClose">✕</button>
    </div>
    <nav class="sb-nav">
      ${navItems}
      <div class="sb-divider"></div>
      <div class="sb-item danger" id="sbLogout"><span class="sb-icon">🚪</span>Logout</div>
    </nav>`;

  document.getElementById('sbClose')?.addEventListener('click', closeSidebar);
  document.getElementById('sbLogout')?.addEventListener('click', () => showLogoutModal());
  document.getElementById('sbRecordedArchive')?.addEventListener('click', () => {
    closeSidebar();
    if (typeof renderRecordedArchivePage === 'function') renderRecordedArchivePage(false);
  });
  sb.querySelectorAll('.sb-item[data-page]').forEach(item => {
    item.addEventListener('click', () => setPage(item.dataset.page));
  });
}

function openSidebar()  {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sbOverlay').classList.add('open');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sbOverlay').classList.remove('open');
}

function closeAllMenus() {
  document.querySelectorAll('.row-menu-dd.open').forEach(dd => dd.classList.remove('open'));
}
window.closeAllMenus = closeAllMenus;

// ── LEAVE CARDS PAGE ──────────────────────────────────────────
function renderLeaveCards() {
  if (state.isSchoolAdmin) { setPage('home'); return; }
  const el = document.getElementById('pg-cards');
  const canEdit = state.isAdmin || state.isEncoder;

  el.innerHTML = `
    <div class="lc-list-card">
      <div class="ch grn" style="justify-content:space-between;align-items:center;">
        <span>■ LEAVE CARDS</span>
        <div class="srch" style="width:240px;">
          <span class="sri">🔍</span>
          <input id="cardSearch" type="text" placeholder="Search name or ID…" style="width:100%;"/>
        </div>
      </div>
      <div class="lc-list-topbar">
        <span class="lc-list-hint">Click an employee to open their leave card.</span>
      </div>
      <div class="lc-filter-bar">
        <select class="lc-pill" id="cardCatFilter">
          <option value="">All Categories</option>
          <option value="Teaching">Teaching</option>
          <option value="Non-Teaching">Non-Teaching</option>
          <option value="Teaching Related">Teaching Related</option>
        </select>
        <select class="lc-pill" id="cardPosFilter"><option value="">All Positions</option></select>
        <select class="lc-pill" id="cardSchoolFilter"><option value="">All Schools/Offices</option></select>
        <select class="lc-pill" id="cardStatusFilter">
          <option value="">All Card Status</option>
          <option value="updated">Updated</option>
          <option value="pending">Pending</option>
        </select>
        <select class="lc-pill" id="cardAccFilter">
          <option value="">All Accounts</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div class="lc-action-bar">
        <div class="lc-action-left">
          <button class="lc-btn-print" id="lcPrintAll">🖨 PRINT ALL CARDS <span class="lc-count-badge" id="lcPrintCount">0</span></button>
          <button class="lc-btn-dl"    id="lcDownloadAll">↓ DOWNLOAD ALL <span class="lc-count-badge" id="lcDlCount">0</span></button>
        </div>
        ${canEdit ? `
        <div class="lc-action-right">
          <button class="lc-btn-accrual" id="lcPostAccrual">☑ POST MONTHLY NT/TR ACCRUAL (1.25 EACH) — <span id="lcAccrualPending">0</span> PENDING</button>
          <button class="lc-btn-force"   id="lcPostForce">⚠ POST MANDATORY LEAVE (−5 VL) — <span id="lcForcePending">0</span> PENDING</button>
        </div>` : ''}
      </div>
      <div class="lc-emp-list"    id="cardListBody"></div>
      <div class="lc-list-footer" id="cardListFooter"></div>
    </div>`;

  const positions = [...new Set(state.db.filter(e => e.pos).map(e => e.pos))].sort();
  const schools   = [...new Set(state.db.filter(e => e.school).map(e => e.school))].sort();
  const posSel = document.getElementById('cardPosFilter');
  const schSel = document.getElementById('cardSchoolFilter');
  positions.forEach(p => { const o = document.createElement('option'); o.value = p; o.textContent = p; posSel.appendChild(o); });
  schools.forEach(s =>   { const o = document.createElement('option'); o.value = s; o.textContent = s; schSel.appendChild(o); });

  ['cardSearch','cardCatFilter','cardPosFilter','cardSchoolFilter','cardStatusFilter','cardAccFilter'].forEach(id => {
    const el2 = document.getElementById(id);
    if (!el2) return;
    el2.addEventListener(id === 'cardSearch' ? 'input' : 'change', filterCardList);
  });

  filterCardList();

// Handled by bulk-export.js via event delegation — do not wire here
//   document.getElementById('lcDownloadAll')?.addEventListener('click', () => alert('PDF export coming soon'));
  document.getElementById('lcPostAccrual')?.addEventListener('click', () => postMonthlyAccrual());
  document.getElementById('lcPostForce')?.addEventListener('click',   () => postMandatoryLeave());
}

function filterCardList() {
  const q   = (document.getElementById('cardSearch')?.value || '').toLowerCase();
  const cat = document.getElementById('cardCatFilter')?.value || '';
  const pos = document.getElementById('cardPosFilter')?.value || '';
  const sch = document.getElementById('cardSchoolFilter')?.value || '';
  const st  = document.getElementById('cardStatusFilter')?.value || '';
  const acc = document.getElementById('cardAccFilter')?.value || '';

  const body   = document.getElementById('cardListBody');
  const footer = document.getElementById('cardListFooter');
  if (!body) return;

  let list = state.db;
  if (acc === 'inactive') list = list.filter(e => (e.account_status || 'active') === 'inactive');
  else if (!acc)          list = list.filter(e => (e.account_status || 'active') !== 'inactive');
  else                    list = list.filter(e => (e.account_status || 'active') === acc);

  if (cat) list = list.filter(e => e.status === cat);
  if (pos) list = list.filter(e => e.pos === pos);
  if (sch) list = list.filter(e => e.school === sch);

  if (st === 'updated') list = list.filter(e =>  isEmpCardUpdated(e));
  if (st === 'pending') list = list.filter(e => !isEmpCardUpdated(e));

  if (q) list = list.filter(e => [e.id, e.surname, e.given, e.school, e.pos].some(v => (v || '').toLowerCase().includes(q)));

  list = [...list].sort((a, b) => (a.surname || '').localeCompare(b.surname || ''));

  const cnt = list.length;
  const printBadge = document.getElementById('lcPrintCount');
  const dlBadge    = document.getElementById('lcDlCount');
  if (printBadge) printBadge.textContent = cnt;
  if (dlBadge)    dlBadge.textContent    = cnt;

  const ntTrActive = state.db.filter(e => {
    const s = (e.status || '').toLowerCase();
    return (s === 'non-teaching' || s === 'teaching related')
        && (e.account_status || 'active') === 'active';
  });

  const accrualPending = ntTrActive.filter(e => !isEmpCardUpdated(e)).length;
  const forcePending   = state.db.filter(e => {
    const s = (e.status || '').toLowerCase();
    return (e.account_status || 'active') === 'active'
        && (s === 'non-teaching' || s === 'teaching related')
        && !e.force_leave_applied;
  }).length;

  const apEl = document.getElementById('lcAccrualPending');
  const fpEl = document.getElementById('lcForcePending');
  if (apEl) apEl.textContent = accrualPending;
  if (fpEl) fpEl.textContent = forcePending;

  const accrualBtn = document.getElementById('lcPostAccrual');
  if (accrualBtn) {
    accrualBtn.disabled = accrualPending === 0;
    accrualBtn.style.opacity = accrualPending === 0 ? '0.5' : '1';
    accrualBtn.style.cursor  = accrualPending === 0 ? 'not-allowed' : 'pointer';
  }
  const forceBtn = document.getElementById('lcPostForce');
  if (forceBtn) {
    forceBtn.disabled = forcePending === 0;
    forceBtn.style.opacity = forcePending === 0 ? '0.5' : '1';
    forceBtn.style.cursor  = forcePending === 0 ? 'not-allowed' : 'pointer';
  }

  if (list.length === 0) {
    body.innerHTML = `<div class="lc-emp-empty">No employees found.</div>`;
  } else {
    body.innerHTML = list.map(e => {
      const isUpdated = isEmpCardUpdated(e);
      const catClass  = e.status === 'Teaching'         ? 'lc-badge-t'
                      : e.status === 'Teaching Related' ? 'lc-badge-tr'
                      : 'lc-badge-nt';
      const statusIcon = isUpdated
        ? `<span class="lc-status-icon lc-status-ok"      title="Updated">✅</span>`
        : `<span class="lc-status-icon lc-status-pending" title="Pending">⏳</span>`;
      return `<div class="lc-emp-row" data-empid="${escHtml(e.id)}">
        <span class="lc-emp-badge ${catClass}">${escHtml(e.status || '')}</span>
        <span class="lc-emp-name">${escHtml(e.surname)}, ${escHtml(e.given)}${e.suffix ? ' <strong>' + escHtml(e.suffix) + '</strong>' : ''}</span>
        <span class="lc-emp-id">${escHtml(e.id)}</span>
        ${statusIcon}
      </div>`;
    }).join('');
  }

  if (footer) footer.textContent =
    `Showing 1–${list.length} of ${list.length} employee${list.length !== 1 ? 's' : ''}`;

  body.querySelectorAll('.lc-emp-row').forEach(row => {
    row.addEventListener('click', async () => {
      const emp = await ensureRecords(row.dataset.empid);
      if (emp) openLeaveCard(emp);
    });
  });
}

function hasForceLeaveThisYearLocal(records) {
  return (records || []).some(r => {
    if (r._conversion) return false;
    const a = (r.action || '').toLowerCase();
    return (a.includes('force') || a.includes('mandatory')) && !a.includes('disapproved');
  });
}

// ── POST MONTHLY NT/TR ACCRUAL ────────────────────────────────
async function postMonthlyAccrual() {
  const now        = new Date();
  const monthLabel = now.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const y          = now.getFullYear();
  const m          = now.getMonth() + 1;

  const ntTrAll = state.db.filter(e => {
    const s = (e.status || '').toLowerCase();
    return (s === 'non-teaching' || s === 'teaching related')
        && (e.account_status || 'active') === 'active';
  });

  if (ntTrAll.length === 0) { alert('No active Non-Teaching or Teaching-Related employees found.'); return; }

  for (const emp of ntTrAll) {
    if (!emp.records || emp.records.length === 0) {
      const res = await apiCall('get_records', { employee_id: emp.id }, 'GET');
      if (res.ok) emp.records = res.records || [];
    }
  }

  const statusResults = await Promise.all(ntTrAll.map(async emp => {
    const res = await apiCall('check_accrual_status', { employee_id: emp.id, year: y, month: m }, 'GET');
    return { emp, alreadyHas: res.ok ? res.applied : false };
  }));

  const alreadyDone = statusResults.filter(x =>  x.alreadyHas).map(x => x.emp);
  const pending     = statusResults.filter(x => !x.alreadyHas).map(x => x.emp);

  if (pending.length === 0) {
    alert(`✅ All ${ntTrAll.length} NT/TR employee(s) have already received their accrual for ${monthLabel}.\n\nNo action needed.`);
    filterCardList(); return;
  }

  const alreadyNames = alreadyDone.length > 0 ? alreadyDone.map(e => `  ✅ ${e.surname}, ${e.given}`).join('\n') : '  (none)';
  const pendingNames = pending.map(e => `  ⏳ ${e.surname}, ${e.given}`).join('\n');
  const msg = `POST MONTHLY ACCRUAL — ${monthLabel}\n────────────────────────────────────────\n\nAlready received this month (${alreadyDone.length}):\n${alreadyNames}\n\nWill receive +1.25 days now (${pending.length}):\n${pendingNames}\n\nEach employee gets +1.25 added to both Set A (VL) and Set B (SL).\n\nProceed?`;
  if (!confirm(msg)) return;

  let successCount = 0, failCount = 0;
  const errors = [];

  for (const emp of pending) {
    const res = await apiCall('save_record', {
      employee_id: emp.id,
      record: { so:'',prd:monthLabel,from:'',to:'',fromPeriod:'WD',toPeriod:'WD',spec:`Monthly Accrual — ${monthLabel}`,action:'Monthly Accrual',earned:1.25,forceAmount:0,monAmount:0,monDisAmt:0,monV:0,monS:0,monDV:0,monDS:0,trV:0,trS:0 },
    });
    if (res.ok) {
      successCount++;
      const r2 = await apiCall('get_records', { employee_id: emp.id }, 'GET');
      if (r2.ok) emp.records = r2.records || [];
      await saveRowBalances(emp.records, emp.id, emp.status);
      const r3 = await apiCall('get_records', { employee_id: emp.id }, 'GET');
      if (r3.ok) emp.records = r3.records || [];
      emp.card_status_updated = true;
    } else {
      failCount++;
      errors.push(`${emp.surname}, ${emp.given}: ${res.error || 'Unknown error'}`);
    }
  }

  let resultMsg = `✅ Monthly Accrual posted for ${successCount} employee(s) for ${monthLabel}.`;
  if (failCount > 0) resultMsg += `\n\n⚠️ Failed for ${failCount}:\n` + errors.join('\n');
  alert(resultMsg);
  filterCardList();
}

// ── POST MANDATORY LEAVE (−5 VL) ─────────────────────────────
async function postMandatoryLeave() {
  const now = new Date();
  const y   = now.getFullYear();
  const allActive = state.db.filter(e => {
    const s = (e.status || '').toLowerCase();
    return (e.account_status || 'active') === 'active'
        && (s === 'non-teaching' || s === 'teaching related');
  });
  if (allActive.length === 0) { alert('No active Non-Teaching or Teaching-Related employees found.'); return; }

  for (const emp of allActive) {
    if (!emp.records || emp.records.length === 0) {
      const res = await apiCall('get_records', { employee_id: emp.id }, 'GET');
      if (res.ok) emp.records = res.records || [];
    }
  }

  const statusResults = await Promise.all(allActive.map(async emp => {
    const res = await apiCall('check_force_leave_status', { employee_id: emp.id }, 'GET');
    return { emp, alreadyHas: res.ok ? res.applied : false };
  }));

  const alreadyDone = statusResults.filter(x =>  x.alreadyHas).map(x => x.emp);
  const pending     = statusResults.filter(x => !x.alreadyHas).map(x => x.emp);

  if (pending.length === 0) {
    alert(`✅ All ${allActive.length} active employee(s) have already received Mandatory Leave for ${y}.\n\nNo action needed.`);
    filterCardList(); return;
  }

  const alreadyNames = alreadyDone.length > 0 ? alreadyDone.map(e => `  ✅ ${e.surname}, ${e.given}`).join('\n') : '  (none)';
  const pendingNames = pending.map(e => `  ⏳ ${e.surname}, ${e.given}`).join('\n');
  const msg = `POST MANDATORY LEAVE — ${y}\n────────────────────────────────────────\n\nAlready received this year (${alreadyDone.length}):\n${alreadyNames}\n\nWill receive −5 VL deduction now (${pending.length}):\n${pendingNames}\n\nEach employee has 5 days DEDUCTED from Set A (VL).\n\nProceed?`;
  if (!confirm(msg)) return;

  let successCount = 0, failCount = 0;
  const errors = [];

  for (const emp of pending) {
    const res = await apiCall('apply_force_leave', { employee_id: emp.id, amount: 5 });
    if (res.ok) {
      successCount++;
      const r2 = await apiCall('get_records', { employee_id: emp.id }, 'GET');
      if (r2.ok) emp.records = r2.records || [];
      await saveRowBalances(emp.records, emp.id, emp.status);
      const r3 = await apiCall('get_records', { employee_id: emp.id }, 'GET');
      if (r3.ok) emp.records = r3.records || [];
      emp.force_leave_applied = true;
    } else {
      failCount++;
      errors.push(`${emp.surname}, ${emp.given}: ${res.error || 'Unknown error'}`);
    }
  }

  let resultMsg = `✅ Mandatory Leave posted for ${successCount} employee(s) for ${y}.`;
  if (failCount > 0) resultMsg += `\n\n⚠️ Failed for ${failCount}:\n` + errors.join('\n');
  alert(resultMsg);
  filterCardList();
}

// ── LEAVE CARD VIEW ───────────────────────────────────────────
async function openLeaveCard(emp) {
  if (!emp.records || emp.records.length === 0) {
    const res = await apiCall('get_records', { employee_id: emp.id }, 'GET');
    if (res.ok) emp.records = res.records || [];
  }
  state.curId = emp.id;
  sessionStorage.setItem('lms_page',  'card-view');
  sessionStorage.setItem('lms_empId', emp.id);

  state.page = 'card-view';
  document.querySelectorAll('.page').forEach(el => el.classList.remove('on'));
  let pg = document.getElementById('pg-card-view');
  if (!pg) {
    pg = document.createElement('div');
    pg.id = 'pg-card-view';
    pg.className = 'page ca';
    const appEl = document.getElementById('s-app') || document.body;
    appEl.appendChild(pg);
  }
  pg.classList.add('on');
  document.querySelectorAll('.sb-item[data-page]').forEach(i => i.classList.remove('active'));

  const statusLC      = (emp.status || '').toLowerCase();
  const isT           = statusLC === 'teaching';
  const isTR          = statusLC === 'teaching related';
  const canEdit       = state.isAdmin || state.isEncoder;
  const categoryLabel = isT ? 'TEACHING' : isTR ? 'TEACHING RELATED' : 'NON-TEACHING';

  const _lcField = (typeof lcField === 'function')
    ? lcField
    : (label, val) => `<div class="lc-pf"><div class="lc-pf-label">${escHtml(label)}</div><div class="lc-pf-value">${escHtml(val || '—')}</div></div>`;

  pg.innerHTML = `
    <div class="lc-view">
      <div class="lc-topbar no-print">
        <button class="btn lc-back-btn" id="lcBackBtn">← BACK TO LIST</button>
        <div style="display:flex;gap:10px;align-items:center;margin-left:auto;">
          <button class="btn lc-dl-btn"    id="lcDlBtn">⬇ DOWNLOAD PDF</button>
          <button class="btn lc-print-btn" id="lcPrintBtn">🖨 PRINT</button>
        </div>
      </div>
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
      ${canEdit ? buildLeaveEntryForm(emp) : ''}
      <div id="lcTableWrap"></div>
    </div>`;

  document.getElementById('lcBackBtn')?.addEventListener('click', () => {
    state.curId = null;
    sessionStorage.removeItem('lms_empId');
    setPage('cards');
  });
  document.getElementById('lcPrintBtn')?.addEventListener('click', () => pdfExportPrint(emp));
  document.getElementById('lcDlBtn')?.addEventListener('click', () => pdfExportDownload(emp));

  sortRecordsInPlace(emp.records);
lcPrimeForPrint(emp); // ← ADD THIS LINE
renderLeaveCardTable(emp);
if (canEdit) wireLeaveEntryForm(emp, null);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── USER PAGE ─────────────────────────────────────────────────
// NOTE: This function is overridden by employee.js which loads after this file.
// It is kept here only as a fallback.
async function renderUserPage() {
  const el = document.getElementById('pg-user');
  if (!el) return;
  el.innerHTML = `<div style="text-align:center;padding:40px;color:var(--mu);">Loading your leave card…</div>`;
  const emp = await ensureRecords(state.curId);
  if (!emp) { el.innerHTML = `<p style="color:var(--rd);">Employee not found.</p>`; return; }

  const statusLC      = (emp.status || '').toLowerCase();
  const isT           = statusLC === 'teaching';
  const isTR          = statusLC === 'teaching related';
  const categoryLabel = isT ? 'TEACHING' : isTR ? 'TEACHING RELATED' : 'NON-TEACHING';

  const _lcField = (typeof lcField === 'function')
    ? lcField
    : (label, val) => `<div class="lc-pf"><div class="lc-pf-label">${escHtml(label)}</div><div class="lc-pf-value">${escHtml(val || '—')}</div></div>`;

  el.innerHTML = `
    <div class="lc-view">
      <div class="lc-topbar no-print">
        <div style="display:flex;gap:10px;align-items:center;margin-left:auto;">
          <button class="btn lc-dl-btn"    id="empDlBtn">⬇ DOWNLOAD PDF</button>
          <button class="btn lc-print-btn" id="empPrintBtn">🖨 PRINT</button>
        </div>
      </div>
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
      <div id="lcTableWrap"></div>
    </div>`;

  if (typeof sortRecordsInPlace === 'function') sortRecordsInPlace(emp.records);
  if (typeof renderLeaveCardTable === 'function') renderLeaveCardTable(emp);

  document.getElementById('empPrintBtn')?.addEventListener('click', () => {
    if (typeof pdfExportPrint === 'function') pdfExportPrint(emp);
    else window.print();
  });
  document.getElementById('empDlBtn')?.addEventListener('click', () => {
    if (typeof pdfExportDownload === 'function') pdfExportDownload(emp);
    else if (typeof lcDownloadPDF === 'function') lcDownloadPDF(emp);
  });
}

// ── UTILITIES ─────────────────────────────────────────────────
function escHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function profileField(label, val) {
  return `<div class="pi"><label>${escHtml(label)}</label><span>${escHtml(String(val || ''))}</span></div>`;
}

window.escHtml       = escHtml;
window.profileField  = profileField;
window.openLeaveCard = openLeaveCard;

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  // Wire overlay click to closeSidebar — guarded for employee role
  document.getElementById('sbOverlay')?.addEventListener('click', () => {
    if (state.role !== 'employee') closeSidebar();
  });

  initLogin();

  document.addEventListener('click', e => {
    if (!e.target.closest('.row-menu-wrap')) closeAllMenus();
  });

  showReloadingBanner();

  const savedPage  = sessionStorage.getItem('lms_page')  || '';
  const savedEmpId = sessionStorage.getItem('lms_empId') || '';

  try {
    const res = await apiCall('session_check', {}, 'GET');
    if (res && res.ok && res.role) {
      await doLogin(res);
      hideReloadingBanner();

      if (state.isSchoolAdmin) {
    const safePage = (savedPage === 'home' || savedPage === 'list') ? savedPage : 'home';
    setPage(safePage);
    return;
}

      if (savedPage === 'card-view' && savedEmpId) {
        const emp = await ensureRecords(savedEmpId);
        if (emp) { openLeaveCard(emp); return; }
      }

      if (savedPage && savedPage !== 'card-view') {
        setPage(savedPage);
      }
      return;
    }
  } catch (e) {
    console.warn('[app] session_check failed:', e.message);
  }

  hideReloadingBanner();
  showScreen('login');
});
