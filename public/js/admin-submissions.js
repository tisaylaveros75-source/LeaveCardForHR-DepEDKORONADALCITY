/* ============================================================
   admin-submissions.js
   SDO Koronadal City — Leave Card Management System
   Admin: Submissions + Recorded Archive pages
   ============================================================ */
'use strict';

(function () {

/* ── CSS ──────────────────────────────────────────────────── */
(function injectAdminSubCSS() {
  if (document.getElementById('admin-sub-css')) return;
  const s = document.createElement('style');
  s.id = 'admin-sub-css';
  s.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');

/* ── PAGE WRAPPER ─────────────────────────── */
.as-page {
  min-height: 100vh;
  background: #f5f1ee;
  font-family: 'DM Sans', sans-serif;
}

/* ── TOP HEADER BAR ───────────────────────── */
.as-header {
  background: linear-gradient(135deg, #3b0a0a 0%, #6b1414 50%, #8b1a1a 100%);
  color: #fff;
  padding: 0 28px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  position: sticky;
  top: 0;
  z-index: 300;
  box-shadow: 0 2px 20px rgba(59,10,10,.5);
}
.as-header-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}
.as-header-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.05rem;
  font-weight: 800;
  line-height: 1.1;
}
.as-header-sub {
  font-size: 9.5px;
  opacity: .6;
  letter-spacing: .5px;
  margin-top: 1px;
}
.as-header-pills {
  display: flex;
  gap: 6px;
}
.as-header-pill {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  border: 1.5px solid rgba(255,255,255,.2);
  background: transparent;
  color: rgba(255,255,255,.7);
  transition: all .2s;
  font-family: 'DM Sans', sans-serif;
  white-space: nowrap;
}
.as-header-pill:hover,
.as-header-pill.active {
  background: rgba(255,255,255,.15);
  color: #fff;
  border-color: rgba(255,255,255,.4);
}

/* ── TAB BAR ──────────────────────────────── */
.as-tabbar {
  background: #fff;
  border-bottom: 2px solid #ede0dc;
  display: flex;
  align-items: center;
  padding: 0 28px;
  gap: 0;
  position: sticky;
  top: 64px;
  z-index: 200;
  box-shadow: 0 2px 8px rgba(0,0,0,.05);
}
.as-tab {
  padding: 16px 22px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .4px;
  text-transform: uppercase;
  color: #9a8a8a;
  cursor: pointer;
  border: none;
  background: transparent;
  border-bottom: 3px solid transparent;
  transition: all .2s;
  display: flex;
  align-items: center;
  gap: 7px;
  font-family: 'DM Sans', sans-serif;
  white-space: nowrap;
  margin-bottom: -2px;
}
.as-tab:hover { color: #5a1010; }
.as-tab.active {
  color: #8b1a1a;
  border-bottom-color: #8b1a1a;
}
.as-tab-badge {
  font-size: 9.5px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 20px;
  min-width: 20px;
  text-align: center;
}
.as-badge-pending  { background: #fef3c7; color: #92400e; }
.as-badge-accepted { background: #d1fae5; color: #065f46; }
.as-badge-rejected { background: #fee2e2; color: #991b1b; }
.as-badge-recorded { background: #dbeafe; color: #1e3a6e; }

/* ── CONTENT BODY ─────────────────────────── */
.as-body {
  max-width: 1100px;
  margin: 0 auto;
  padding: 28px 24px 80px;
}

/* ── SEARCH / FILTER BAR ──────────────────── */
.as-filterbar {
  display: flex;
  gap: 12px;
  margin-bottom: 22px;
  flex-wrap: wrap;
  align-items: center;
}
.as-search {
  flex: 1;
  min-width: 200px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1.5px solid #e4d0d0;
  border-radius: 12px;
  padding: 10px 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,.04);
}
.as-search input {
  border: none;
  outline: none;
  font-size: 13px;
  color: #1a1a2e;
  background: transparent;
  flex: 1;
  font-family: 'DM Sans', sans-serif;
}
.as-search-icon { color: #c0a0a0; font-size: 15px; flex-shrink: 0; }
.as-filter-count {
  background: #fff;
  border: 1.5px solid #e4d0d0;
  border-radius: 12px;
  padding: 10px 18px;
  font-size: 12px;
  font-weight: 700;
  color: #7a5050;
  box-shadow: 0 2px 8px rgba(0,0,0,.04);
  white-space: nowrap;
}

/* ── APPLICATION CARD ─────────────────────── */
.as-card {
  background: #fff;
  border-radius: 16px;
  border: 1.5px solid #ede0dc;
  padding: 0;
  margin-bottom: 14px;
  box-shadow: 0 2px 12px rgba(139,26,26,.05);
  overflow: hidden;
  transition: box-shadow .2s, transform .15s;
}
.as-card:hover {
  box-shadow: 0 6px 28px rgba(139,26,26,.12);
  transform: translateY(-1px);
}

.as-card-accent {
  height: 4px;
  background: linear-gradient(90deg, #8b1a1a, #c83030);
}
.as-card-accent.accepted { background: linear-gradient(90deg, #059669, #10b981); }
.as-card-accent.rejected { background: linear-gradient(90deg, #7f1d1d, #dc2626); }
.as-card-accent.recorded { background: linear-gradient(90deg, #1e3a6e, #3b82f6); }

.as-card-body {
  padding: 18px 22px;
}
.as-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}
.as-card-left { flex: 1; min-width: 0; }
.as-card-name {
  font-size: 15px;
  font-weight: 800;
  color: #1a1a2e;
  margin-bottom: 3px;
}
.as-card-meta {
  font-size: 11.5px;
  color: #7a8a9d;
  line-height: 1.7;
}
.as-card-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
}
.as-leave-type-pill {
  font-size: 11px;
  font-weight: 700;
  padding: 5px 13px;
  border-radius: 20px;
  background: #fff0f0;
  color: #8b1a1a;
  border: 1px solid #f0c8c8;
  white-space: nowrap;
}
.as-status-pill {
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: .8px;
  text-transform: uppercase;
  padding: 4px 11px;
  border-radius: 20px;
  white-space: nowrap;
}
.as-status-pending  { background: #fef3c7; color: #92400e; border: 1px solid #fcd34d; }
.as-status-accepted { background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; }
.as-status-rejected { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
.as-status-recorded { background: #dbeafe; color: #1e3a6e; border: 1px solid #93c5fd; }

/* ── CARD DETAILS GRID ────────────────────── */
.as-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 8px 16px;
  margin-bottom: 14px;
  padding: 12px 14px;
  background: #faf7f5;
  border-radius: 10px;
  border: 1px solid #ede0dc;
}
.as-card-detail {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.as-card-detail-key {
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .7px;
  color: #9a7070;
}
.as-card-detail-val {
  font-size: 12.5px;
  font-weight: 600;
  color: #1a1a2e;
}

/* ── REJECTION / ACCEPTED NOTICE ──────────── */
.as-notice {
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.5;
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.as-notice.rejected { background: #fff5f5; border-left: 3px solid #fca5a5; color: #991b1b; }
.as-notice.accepted { background: #f0fdf8; border-left: 3px solid #6ee7b7; color: #065f46; }
.as-notice.recorded { background: #eff6ff; border-left: 3px solid #93c5fd; color: #1e3a6e; }

/* ── CARD ACTIONS ─────────────────────────── */
.as-card-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}
.as-action {
  font-size: 11.5px;
  font-weight: 700;
  padding: 7px 16px;
  border-radius: 9px;
  border: none;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: all .2s;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.as-action:hover { transform: translateY(-1px); }
.as-action-view    { background: #ede9fe; color: #4c1d95; border: 1px solid #c4b5fd; }
.as-action-accept  { background: linear-gradient(135deg, #064e3b, #10b981); color: #fff; box-shadow: 0 3px 12px rgba(5,150,105,.3); }
.as-action-reject  { background: linear-gradient(135deg, #7f1d1d, #dc2626); color: #fff; box-shadow: 0 3px 12px rgba(220,38,38,.3); }
.as-action-record  { background: linear-gradient(135deg, #1e3a6e, #3b82f6); color: #fff; box-shadow: 0 3px 12px rgba(59,130,246,.28); }
.as-action-attach  { background: #fff; color: #3b82f6; border: 1.5px solid #93c5fd; }
.as-action:disabled { opacity: .5; cursor: not-allowed; transform: none !important; box-shadow: none !important; }

/* ── RECORDED STAMP ───────────────────────── */
.as-recorded-stamp {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #dbeafe;
  color: #1e3a6e;
  border: 1px solid #93c5fd;
  border-radius: 9px;
  padding: 5px 14px;
  font-size: 11px;
  font-weight: 700;
}

/* ── EMPTY STATE ──────────────────────────── */
.as-empty {
  text-align: center;
  padding: 80px 20px;
  color: #9a8a8a;
}
.as-empty-icon { font-size: 48px; margin-bottom: 16px; display: block; }
.as-empty-title { font-family: 'Playfair Display', serif; font-size: 1.2rem; color: #5a4040; margin-bottom: 8px; }
.as-empty-sub { font-size: 13px; color: #9a8a8a; }

/* ── LOADING STATE ────────────────────────── */
.as-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 14px;
  color: #9a8a8a;
  font-size: 13px;
}
.as-spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #f0d8d8;
  border-top-color: #8b1a1a;
  border-radius: 50%;
  animation: as-spin .8s linear infinite;
}
@keyframes as-spin { to { transform: rotate(360deg); } }

/* ── STATS ROW ────────────────────────────── */
.as-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 24px;
}
.as-stat-card {
  background: #fff;
  border-radius: 14px;
  border: 1.5px solid #ede0dc;
  padding: 16px 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,.04);
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.as-stat-label {
  font-size: 9.5px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .8px;
  color: #9a7070;
}
.as-stat-num {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
  color: #1a1a2e;
}
.as-stat-num.pending  { color: #92400e; }
.as-stat-num.accepted { color: #065f46; }
.as-stat-num.rejected { color: #991b1b; }
.as-stat-num.recorded { color: #1e3a6e; }

/* ── REJECT MODAL ─────────────────────────── */
.as-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(20,5,5,.55);
  z-index: 9000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  backdrop-filter: blur(3px);
  animation: as-fade-in .2s ease;
}
@keyframes as-fade-in { from { opacity: 0; } to { opacity: 1; } }
.as-modal {
  background: #fff;
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(0,0,0,.28);
  animation: as-modal-up .25s cubic-bezier(.22,1,.36,1);
}
@keyframes as-modal-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
.as-modal-head {
  padding: 18px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.as-modal-head.reject { background: linear-gradient(135deg, #7f1d1d, #dc2626); color: #fff; }
.as-modal-head.view   { background: linear-gradient(135deg, #3b0a0a, #8b1a1a); color: #fff; }
.as-modal-head-title { font-size: 14px; font-weight: 800; }
.as-modal-close {
  width: 30px; height: 30px;
  border-radius: 50%;
  background: rgba(255,255,255,.15);
  border: none;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  transition: background .15s;
}
.as-modal-close:hover { background: rgba(255,255,255,.28); }
.as-modal-body { padding: 24px; }
.as-modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #f0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.as-textarea {
  width: 100%;
  border: 1.5px solid #e4d0d0;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  color: #1a1a2e;
  resize: vertical;
  outline: none;
  transition: border-color .2s, box-shadow .2s;
  box-sizing: border-box;
  min-height: 110px;
}
.as-textarea:focus {
  border-color: #8b1a1a;
  box-shadow: 0 0 0 3px rgba(139,26,26,.1);
}
.as-modal-err {
  color: #dc2626;
  font-size: 11.5px;
  font-weight: 600;
  margin-top: 8px;
  min-height: 16px;
}

.as-btn {
  padding: 10px 22px;
  border-radius: 10px;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  font-family: 'DM Sans', sans-serif;
  transition: all .2s;
}
.as-btn:hover { transform: translateY(-1px); }
.as-btn-ghost {
  background: #fff;
  color: #7a5050;
  border: 1.5px solid #e4d0d0;
}
.as-btn-ghost:hover { border-color: #c0a0a0; background: #fff5f5; }
.as-btn-danger {
  background: linear-gradient(135deg, #7f1d1d, #dc2626);
  color: #fff;
  box-shadow: 0 4px 14px rgba(220,38,38,.35);
}

@media (max-width: 768px) {
  .as-stats { grid-template-columns: repeat(2,1fr); }
  .as-tabbar { padding: 0 12px; overflow-x: auto; }
  .as-body { padding: 16px 14px 60px; }
  .as-header { padding: 0 16px; }
}
@media (max-width: 500px) {
  .as-stats { grid-template-columns: 1fr 1fr; }
  .as-card-grid { grid-template-columns: 1fr 1fr; }
}
@media print {
  .as-page { display: none !important; }
}
  `;
  document.head.appendChild(s);
})();

/* ── ESCAPE ───────────────────────────────────────────────── */
const esc = window.escHtml || (s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'));

/* ── STATE ────────────────────────────────────────────────── */
let _currentTab = 'pending';
let _allApps    = [];
let _recApps    = [];
let _counts     = { pending:0, accepted:0, rejected:0, recorded:0 };
let _searchQ    = '';

/* ══════════════════════════════════════════════════════════
   renderSubmissionsPage  — main admin entry point
   ══════════════════════════════════════════════════════════ */
async function renderSubmissionsPage() {
  const el      = document.getElementById('pg-submissions');
  if (!el) return;
  const apiCall = window.apiCall || (async () => ({ ok: false }));

  /* Shell */
  el.innerHTML = `
    <div class="as-page">
      <div class="as-header">
        <div class="as-header-brand">
          <img src="/img/sdo.jpg"
               onerror="this.src='https://upload.wikimedia.org/wikipedia/en/a/a8/DepEd_Koronadal.png'"
               style="width:36px;height:36px;border-radius:8px;object-fit:cover;flex-shrink:0;" alt="SDO"/>
          <div>
            <div class="as-header-title">Leave Submissions</div>
            <div class="as-header-sub">SDO Koronadal City — Admin View</div>
          </div>
        </div>
      </div>

      <!-- Tab bar -->
      <div class="as-tabbar" id="asTabBar">
        <button class="as-tab active" data-atab="pending">
          ⏳ Pending
          <span class="as-tab-badge as-badge-pending" id="asBadgePending">…</span>
        </button>
        <button class="as-tab" data-atab="accepted">
          ✅ Accepted
          <span class="as-tab-badge as-badge-accepted" id="asBadgeAccepted">…</span>
        </button>
        <button class="as-tab" data-atab="rejected">
          ❌ Rejected
          <span class="as-tab-badge as-badge-rejected" id="asBadgeRejected">…</span>
        </button>
        <button class="as-tab" data-atab="recorded">
          📁 Recorded
          <span class="as-tab-badge as-badge-recorded" id="asBadgeRecorded">…</span>
        </button>
      </div>

      <!-- Body -->
      <div class="as-body">
        <!-- Stats -->
        <div class="as-stats" id="asStats">
          <div class="as-stat-card">
            <div class="as-stat-label">Pending</div>
            <div class="as-stat-num pending" id="asStatPending">—</div>
          </div>
          <div class="as-stat-card">
            <div class="as-stat-label">Accepted</div>
            <div class="as-stat-num accepted" id="asStatAccepted">—</div>
          </div>
          <div class="as-stat-card">
            <div class="as-stat-label">Rejected</div>
            <div class="as-stat-num rejected" id="asStatRejected">—</div>
          </div>
          <div class="as-stat-card">
            <div class="as-stat-label">Recorded</div>
            <div class="as-stat-num recorded" id="asStatRecorded">—</div>
          </div>
        </div>

        <!-- Filter bar -->
        <div class="as-filterbar">
          <div class="as-search">
            <span class="as-search-icon">🔍</span>
            <input type="text" id="asSearchInput" placeholder="Search by name, leave type, school…"/>
          </div>
          <div class="as-filter-count" id="asFilterCount">Loading…</div>
        </div>

        <!-- List -->
        <div id="asListWrap">
          <div class="as-loading"><div class="as-spinner"></div> Loading submissions…</div>
        </div>
      </div>
    </div>`;

  /* Load all data */
  await _asLoadAll(apiCall);

  /* Wire tabs */
  el.querySelectorAll('[data-atab]').forEach(btn => {
    btn.addEventListener('click', () => {
      el.querySelectorAll('[data-atab]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      _currentTab = btn.dataset.atab;
      _searchQ    = '';
      const inp = document.getElementById('asSearchInput');
      if (inp) inp.value = '';
      _asRenderList(apiCall);
    });
  });

  /* Wire search */
  document.getElementById('asSearchInput')?.addEventListener('input', function () {
    _searchQ = this.value.trim().toLowerCase();
    _asRenderList(apiCall);
  });

  _asRenderList(apiCall);
}

/* ── Load all data ─────────────────────────────────────────── */
async function _asLoadAll(apiCall) {
  const [pendRes, accRes, rejRes, recRes] = await Promise.all([
    apiCall('get_leave_applications', { status: 'pending'  }, 'GET'),
    apiCall('get_leave_applications', { status: 'accepted' }, 'GET'),
    apiCall('get_leave_applications', { status: 'rejected' }, 'GET'),
    apiCall('get_recorded_applications', {}, 'GET'),
  ]);

  const pend = pendRes.ok  ? (pendRes.applications  || []) : [];
  const acc  = accRes.ok   ? (accRes.applications   || []) : [];
  const rej  = rejRes.ok   ? (rejRes.applications   || []) : [];
  _recApps   = recRes.ok   ? (recRes.applications   || []) : [];

  _allApps = { pending: pend, accepted: acc, rejected: rej };

  _counts = {
    pending:  pend.length,
    accepted: acc.length,
    rejected: rej.length,
    recorded: _recApps.length,
  };

  /* Update badges & stats */
  const set = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
  set('asBadgePending',   _counts.pending);
  set('asBadgeAccepted',  _counts.accepted);
  set('asBadgeRejected',  _counts.rejected);
  set('asBadgeRecorded',  _counts.recorded);
  set('asStatPending',    _counts.pending);
  set('asStatAccepted',   _counts.accepted);
  set('asStatRejected',   _counts.rejected);
  set('asStatRecorded',   _counts.recorded);
}

/* ── Render list ───────────────────────────────────────────── */
function _asRenderList(apiCall) {
  const wrap = document.getElementById('asListWrap');
  if (!wrap) return;

  const tab  = _currentTab;
  const apps = tab === 'recorded' ? _recApps : (_allApps[tab] || []);

  /* Filter */
  const filtered = _searchQ
    ? apps.filter(a => {
        const hay = [a.surname, a.given, a.leave_type, a.office_school, a.inclusive_dates]
          .join(' ').toLowerCase();
        return hay.includes(_searchQ);
      })
    : apps;

  /* Count */
  const countEl = document.getElementById('asFilterCount');
  if (countEl) countEl.textContent = `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    const icons = { pending:'📭', accepted:'✅', rejected:'❌', recorded:'📁' };
    const labels = { pending:'pending submissions', accepted:'accepted applications', rejected:'rejected applications', recorded:'recorded applications' };
    wrap.innerHTML = `
      <div class="as-empty">
        <span class="as-empty-icon">${icons[tab]}</span>
        <div class="as-empty-title">${_searchQ ? 'No results found' : 'Nothing here yet'}</div>
        <div class="as-empty-sub">${_searchQ ? `No ${labels[tab]} match "${_searchQ}"` : `There are no ${labels[tab]} at the moment.`}</div>
      </div>`;
    return;
  }

  wrap.innerHTML = filtered.map(a => _asCardHTML(a, tab)).join('');

  /* Wire buttons */
  wrap.querySelectorAll('[data-as-view]').forEach(btn => {
    const all = tab === 'recorded' ? _recApps : (_allApps[tab] || []);
    const app = all.find(a => String(a.id) === String(btn.dataset.asView));
    if (app && typeof window._laViewCSFModal === 'function') {
      btn.addEventListener('click', () => window._laViewCSFModal(app, esc));
    }
  });

  wrap.querySelectorAll('[data-as-accept]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Accept this leave application?')) return;
      btn.disabled = true; btn.textContent = '⏳';
      const r = await apiCall('review_leave_application', { app_id: +btn.dataset.asAccept, action: 'accept' });
      if (r.ok) { await _asLoadAll(apiCall); _asRenderList(apiCall); }
      else { alert(r.error || 'Failed.'); btn.disabled = false; btn.textContent = '✅ Accept'; }
    });
  });

  wrap.querySelectorAll('[data-as-reject]').forEach(btn => {
    btn.addEventListener('click', () => _asRejectModal(+btn.dataset.asReject, apiCall));
  });

  wrap.querySelectorAll('[data-as-record]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const app = (_allApps.accepted || []).find(a => String(a.id) === String(btn.dataset.asRecord));
      if (!app) return;
      if (!confirm(`Mark as Recorded?\n\nEmployee: ${app.surname}, ${app.given}\nLeave Type: ${app.leave_type}\nDates: ${app.inclusive_dates}\n\nThis confirms the leave has been officially recorded.`)) return;
      btn.disabled = true; btn.textContent = '⏳ Recording…';
      const r = await apiCall('mark_as_recorded', { app_id: +btn.dataset.asRecord });
      if (r.ok) {   _currentTab = 'accepted';   await _asLoadAll(apiCall);   _asRenderList(apiCall); }
      else { alert(r.error || 'Failed.'); btn.disabled = false; btn.textContent = '📁 Mark as Recorded'; }
    });
  });
}

/* ── Card HTML ─────────────────────────────────────────────── */
function _asCardHTML(a, tab) {
  const name = `${esc(a.surname||'')}, ${esc(a.given||'')}${a.suffix ? ' ' + esc(a.suffix) : ''}`;
  const lbl  = a.leave_type === 'Others' && a.leave_type_other
    ? `Others: ${esc(a.leave_type_other)}` : esc(a.leave_type || '—');
  const accentCls = tab === 'accepted' ? 'accepted' : tab === 'rejected' ? 'rejected' : tab === 'recorded' ? 'recorded' : '';

  let recDate = '';
  if (a.recorded_at) {
    try {
      recDate = new Date(a.recorded_at).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch(e) { recDate = String(a.recorded_at).slice(0,10); }
  }

  return `
    <div class="as-card">
      <div class="as-card-accent ${accentCls}"></div>
      <div class="as-card-body">
        <div class="as-card-top">
          <div class="as-card-left">
            <div class="as-card-name">👤 ${name}</div>
            <div class="as-card-meta">
              ${esc(a.emp_category||'')} &nbsp;·&nbsp;
              Filed: ${esc(a.date_of_filing||'—')} &nbsp;·&nbsp;
              ${esc(a.office_school||'—')}
            </div>
          </div>
          <div class="as-card-right">
            <div class="as-leave-type-pill">${lbl}</div>
            <div class="as-status-pill as-status-${tab === 'recorded' ? 'recorded' : tab}">${tab.toUpperCase()}</div>
          </div>
        </div>

        <div class="as-card-grid">
          <div class="as-card-detail">
            <span class="as-card-detail-key">Inclusive Dates</span>
            <span class="as-card-detail-val">${esc(a.inclusive_dates||'—')}</span>
          </div>
          <div class="as-card-detail">
            <span class="as-card-detail-key">Working Days</span>
            <span class="as-card-detail-val">${a.num_working_days||'—'} day(s)</span>
          </div>
          <div class="as-card-detail">
            <span class="as-card-detail-key">Commutation</span>
            <span class="as-card-detail-val">${esc(a.commutation||'Not Requested')}</span>
          </div>
          <div class="as-card-detail">
            <span class="as-card-detail-key">Attachment</span>
            <span class="as-card-detail-val">
              ${a.attachment_name
                ? `<a href="${esc(a.attachment_path ? '/storage/' + a.attachment_path : '')}" target="_blank" rel="noopener noreferrer"
                style="color:#3b82f6;text-decoration:none;font-size:11.5px;" onclick="event.stopPropagation();">
                📎 ${esc(a.attachment_name)}</a>`
                : '—'}
            </span>
          </div>
        </div>

        ${tab === 'rejected' && a.rejection_reason
          ? `<div class="as-notice rejected">❌ <span>${esc(a.rejection_reason)}</span></div>` : ''}
        ${tab === 'accepted' && a.reviewed_by
          ? `<div class="as-notice accepted">✅ Accepted by <strong>${esc(a.reviewed_by)}</strong></div>` : ''}
        ${tab === 'recorded' && recDate
          ? `<div class="as-notice recorded">📁 Recorded on <strong>${recDate}</strong></div>` : ''}
        ${tab === 'accepted' && a.recorded_at
          ? `<div class="as-notice recorded">📁 Recorded on <strong>${recDate}</strong></div>` : ''}

        <div class="as-card-actions">
          <button class="as-action as-action-view" data-as-view="${a.id}">🔍 View CSF No. 6</button>

          ${tab === 'pending' ? `
            <button class="as-action as-action-accept" data-as-accept="${a.id}">✅ Accept</button>
            <button class="as-action as-action-reject" data-as-reject="${a.id}">❌ Reject</button>
          ` : ''}

          ${tab === 'accepted' && !a.recorded_at ? `
            <button class="as-action as-action-record" data-as-record="${a.id}">📁 Mark as Recorded</button>
          ` : ''}
        </div>
      </div>
    </div>`;
}

/* ── Reject modal ──────────────────────────────────────────── */
function _asRejectModal(appId, apiCall) {
  document.getElementById('asRejectMo')?.remove();
  const mo = document.createElement('div');
  mo.id = 'asRejectMo';
  mo.className = 'as-modal-overlay';
  mo.innerHTML = `
    <div class="as-modal">
      <div class="as-modal-head reject">
        <div class="as-modal-head-title">❌ Reject Application</div>
        <button class="as-modal-close" id="asRjClose">✕</button>
      </div>
      <div class="as-modal-body">
        <label style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;color:#7a3030;display:block;margin-bottom:8px;">
          Reason for Rejection <span style="color:#dc2626;">*</span>
        </label>
        <textarea class="as-textarea" id="asRjText"
          placeholder="State the reason clearly so the employee can correct and resubmit…"></textarea>
        <div class="as-modal-err" id="asRjErr"></div>
      </div>
      <div class="as-modal-footer">
        <button class="as-btn as-btn-ghost" id="asRjCancel">Cancel</button>
        <button class="as-btn as-btn-danger" id="asRjConfirm">❌ Confirm Rejection</button>
      </div>
    </div>`;
  document.body.appendChild(mo);

  const close = () => mo.remove();
  mo.addEventListener('click', e => { if (e.target === mo) close(); });
  document.getElementById('asRjClose')?.addEventListener('click',  close);
  document.getElementById('asRjCancel')?.addEventListener('click', close);
  document.getElementById('asRjConfirm')?.addEventListener('click', async () => {
    const reason = document.getElementById('asRjText')?.value?.trim();
    const errEl  = document.getElementById('asRjErr');
    if (!reason) { errEl.textContent = 'Please provide a reason.'; return; }
    document.getElementById('asRjConfirm').disabled = true;
    const r = await apiCall('review_leave_application', { app_id: appId, action: 'reject', reason });
    if (r.ok) { close(); await _asLoadAll(apiCall); _asRenderList(apiCall); }
    else { errEl.textContent = r.error || 'Failed.'; document.getElementById('asRjConfirm').disabled = false; }
  });
}

/* ── Exports ───────────────────────────────────────────────── */
window.renderSubmissionsPage = renderSubmissionsPage;

})();
