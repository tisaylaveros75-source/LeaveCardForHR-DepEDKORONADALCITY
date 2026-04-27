/* ============================================================
   SDO Koronadal City — Personnel List Page
   personnel-list.js — Standalone module
   ============================================================ */

'use strict';

/* ─────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────── */
function _esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function _isCardUpdated(emp) {
  if (typeof window.isEmpCardUpdated === 'function') {
    return window.isEmpCardUpdated(emp);
  }
  return false;
}

function _currentMonthLabel() {
  return new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

function _categoryBadge(status) {
  const s = (status || '').toLowerCase();
  if (s === 'teaching')         return `<span class="pl-badge pl-badge--teaching">Teaching</span>`;
  if (s === 'teaching related') return `<span class="pl-badge pl-badge--teaching-related">Teaching Related</span>`;
  return `<span class="pl-badge pl-badge--non-teaching">Non-Teaching</span>`;
}

function _cardStatusBadge(emp) {
  const updated = _isCardUpdated(emp);
  return updated
    ? `<span class="pl-card-status pl-card-status--updated">✅ Updated</span>`
    : `<span class="pl-card-status pl-card-status--pending">⏳ Pending</span>`;
}

function _accountBadge(status) {
  const isActive = (status || 'active') === 'active';
  return `<span class="pl-account-status pl-account-status--${isActive ? 'active' : 'inactive'}">
    <span class="pl-account-dot pl-account-dot--${isActive ? 'active' : 'inactive'}"></span>
    ${isActive ? 'Active' : 'Inactive'}
  </span>`;
}

/* ─────────────────────────────────────────────────────────
   STATS ROW
───────────────────────────────────────────────────────── */
function _buildStats(db) {
  const all        = db;
  const active     = all.filter(e => (e.account_status || 'active') !== 'inactive');
  const teaching   = all.filter(e => (e.status || '').toLowerCase() === 'teaching').length;
  const nt         = all.filter(e => (e.status || '').toLowerCase() === 'non-teaching').length;
  const tr         = all.filter(e => (e.status || '').toLowerCase() === 'teaching related').length;
  const month      = _currentMonthLabel();
  const updated    = active.filter(e => _isCardUpdated(e)).length;
  const notUpdated = active.length - updated;

  const stats = [
    { icon: '👥', num: all.length,   label: 'Total Personnel',    accent: '#8b1a1a', iconBg: '#fce8e8', id: '' },
    { icon: '🏫', num: teaching,     label: 'Teaching',           accent: '#1e3a6e', iconBg: '#ddeeff', id: '' },
    { icon: '📊', num: nt,           label: 'Non-Teaching',       accent: '#8c4a10', iconBg: '#fdf5e6', id: '' },
    { icon: '🔗', num: tr,           label: 'Teaching Related',   accent: '#4e1d95', iconBg: '#ede9fe', id: '' },
    { icon: '✅', num: updated,      label: `Updated (${month})`, accent: '#065f46', iconBg: '#d1fae5', id: 'plStatUpdated', clickable: true },
    { icon: '⏳', num: notUpdated,   label: 'Not Yet Updated',    accent: '#7f1d1d', iconBg: '#fee2e2', id: 'plStatPending', clickable: true },
  ];

  return `<div class="pl-stats">
    ${stats.map(s => `
      <div class="pl-stat ${s.clickable ? 'pl-stat--clickable pl-stat--active-border' : ''}"
           style="--pl-accent:${s.accent};--pl-icon-bg:${s.iconBg};"
           ${s.id ? `id="${s.id}"` : ''}>
        <div class="pl-stat-icon">${s.icon}</div>
        <div class="pl-stat-body">
          <div class="pl-stat-num">${s.num}</div>
          <div class="pl-stat-label">${_esc(s.label)}</div>
        </div>
      </div>`).join('')}
  </div>`;
}

/* ─────────────────────────────────────────────────────────
   RENDER
───────────────────────────────────────────────────────── */
function renderPersonnelList() {
  const el        = document.getElementById('pg-list');
  const canAdmin  = window.state && window.state.isAdmin && !window.state.isEncoder;
  const db        = (window.state && window.state.db) || [];
  const positions = [...new Set(db.filter(e => e.pos).map(e => e.pos))].sort();
  const schools   = [...new Set(db.filter(e => e.school).map(e => e.school))].sort();

  el.innerHTML = `
    ${_buildStats(db)}

    <div class="pl-card">

      <!-- ── Dark header: title + register + search + clear ── -->
      <div class="pl-header">
        <div class="pl-header-left">
          <div class="pl-header-title">👥 Personnel Registry</div>
        </div>
        <div class="pl-header-right">
          <div class="pl-search-wrap">
            <span class="pl-search-icon">🔍</span>
            <input id="plSearch" type="text" placeholder="Search name or ID…" autocomplete="off"/>
          </div>
          <button class="pl-btn-clear" id="plClearBtn">✕ Clear</button>
        </div>
      </div>

      <!-- ── Filter bar ── -->
      <div class="pl-filter-bar">
        <div class="pl-filter-spacer pl-fcol-rownum"></div>
        <div class="pl-filter-spacer pl-fcol-empid"></div>
        <div class="pl-fcol-name" style="display:flex;align-items:center;padding:0 6px;">
          ${canAdmin ? `<button class="pl-btn-register" id="plAddEmpBtn" style="height:30px;font-size:10.5px;padding:0 12px;background:linear-gradient(135deg,#3d0808,#8b1a1a);border:none;color:#fff;border-radius:5px;font-weight:700;cursor:pointer;white-space:nowrap;letter-spacing:.04em;text-transform:uppercase;">＋ Register New Personnel</button>` : ''}
        </div>
        <div class="pl-fcol-cat">
          <select class="pl-select" id="plCatFilter">
            <option value="">All Categories</option>
            <option value="Teaching">Teaching</option>
            <option value="Non-Teaching">Non-Teaching</option>
            <option value="Teaching Related">Teaching Related</option>
          </select>
        </div>
        <div class="pl-fcol-pos">
          <select class="pl-select" id="plPosFilter">
            <option value="">All Positions</option>
            ${positions.map(p => `<option value="${_esc(p)}">${_esc(p)}</option>`).join('')}
          </select>
        </div>
        <div class="pl-fcol-school">
          <select class="pl-select" id="plSchoolFilter">
            <option value="">All Schools/Offices</option>
            ${schools.map(s => `<option value="${_esc(s)}">${_esc(s)}</option>`).join('')}
          </select>
        </div>
        <div class="pl-fcol-card">
          <select class="pl-select" id="plCardFilter">
            <option value="">All Status</option>
            <option value="updated">Updated</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div class="pl-fcol-acc">
          <select class="pl-select" id="plAccFilter">
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div class="pl-filter-spacer pl-fcol-action"></div>
      </div>

      <!-- ── Table ── -->
      <div class="pl-table-wrap">
        <table class="pl-table">
          <thead>
            <tr>
              <th class="pl-th-center pl-tcol-rownum">#</th>
              <th class="pl-tcol-empid">Employee ID</th>
              <th class="pl-tcol-name">Full Name</th>
              <th class="pl-th-center pl-tcol-cat">Category</th>
              <th class="pl-tcol-pos">Position</th>
              <th class="pl-tcol-school">School / Office</th>
              <th class="pl-th-center pl-tcol-card">Card Status</th>
              <th class="pl-th-center pl-tcol-acc">Account</th>
              <th class="pl-th-center pl-tcol-action no-print">Action</th>
            </tr>
          </thead>
          <tbody id="plTableBody"></tbody>
        </table>
      </div>

      <div class="pl-table-footer" id="plFooter"></div>
    </div>`;

  /* ── listeners ── */
  document.getElementById('plAddEmpBtn')?.addEventListener('click', () => {
    if (typeof showRegisterModal === 'function') showRegisterModal(null);
  });

  ['plSearch','plCatFilter','plPosFilter','plSchoolFilter','plCardFilter','plAccFilter'].forEach(id => {
    const el2 = document.getElementById(id);
    if (!el2) return;
    el2.addEventListener(id === 'plSearch' ? 'input' : 'change', filterPersonnelTable);
  });

  document.getElementById('plClearBtn')?.addEventListener('click', () => {
    ['plSearch','plCatFilter','plPosFilter','plSchoolFilter','plCardFilter','plAccFilter'].forEach(id => {
      const el2 = document.getElementById(id);
      if (el2) el2.value = '';
    });
    filterPersonnelTable();
  });

  document.getElementById('plStatUpdated')?.addEventListener('click', () => {
    const f = document.getElementById('plCardFilter');
    if (f) { f.value = f.value === 'updated' ? '' : 'updated'; filterPersonnelTable(); }
  });
  document.getElementById('plStatPending')?.addEventListener('click', () => {
    const f = document.getElementById('plCardFilter');
    if (f) { f.value = f.value === 'pending' ? '' : 'pending'; filterPersonnelTable(); }
  });

  filterPersonnelTable();
}

/* ─────────────────────────────────────────────────────────
   FILTER / RENDER TABLE BODY
───────────────────────────────────────────────────────── */
function filterPersonnelTable() {
  const body   = document.getElementById('plTableBody');
  const footer = document.getElementById('plFooter');
  if (!body) return;

  const db   = (window.state && window.state.db) || [];
  const q    = (document.getElementById('plSearch')?.value       || '').toLowerCase().trim();
  const cat  =  document.getElementById('plCatFilter')?.value    || '';
  const pos  =  document.getElementById('plPosFilter')?.value    || '';
  const sch  =  document.getElementById('plSchoolFilter')?.value || '';
  const card =  document.getElementById('plCardFilter')?.value   || '';
  const acc  =  document.getElementById('plAccFilter')?.value    || '';

  let list = [...db];

  if      (acc === 'inactive') list = list.filter(e => (e.account_status || 'active') === 'inactive');
  else if (acc === 'active')   list = list.filter(e => (e.account_status || 'active') === 'active');
  else                         list = list.filter(e => (e.account_status || 'active') !== 'inactive');

  if (cat)  list = list.filter(e => e.status === cat);
  if (pos)  list = list.filter(e => e.pos === pos);
  if (sch)  list = list.filter(e => e.school === sch);

  if (card === 'updated') list = list.filter(e =>  _isCardUpdated(e));
  if (card === 'pending') list = list.filter(e => !_isCardUpdated(e));

  if (q)    list = list.filter(e => [e.id, e.surname, e.given, e.school, e.pos].some(v => (v || '').toLowerCase().includes(q)));

  list.sort((a, b) => (a.surname || '').localeCompare(b.surname || ''));

  if (list.length === 0) {
    body.innerHTML = `<tr class="pl-empty-row"><td colspan="9">No employees found matching the current filters.</td></tr>`;
    if (footer) footer.innerHTML = `Showing <strong>0</strong> employees`;
    return;
  }

  body.innerHTML = list.map((e, i) => {
    /* ── FIX: suffix rendered bold, same size as surname/given ── */
    const suffixHtml = e.suffix
      ? ` <strong style="font-weight:700;">${_esc(e.suffix)}</strong>`
      : '';
    return `<tr>
      <td class="pl-td-rownum pl-td-center">${i + 1}</td>
      <td class="pl-td-empid">${_esc(e.id)}</td>
      <td class="pl-td-name"><strong style="font-weight:700;">${_esc(e.surname)}</strong>, <strong style="font-weight:700;">${_esc(e.given)}</strong>${suffixHtml}</td>
      <td class="pl-td-center">${_categoryBadge(e.status)}</td>
      <td class="pl-td-pos">${_esc(e.pos || '—')}</td>
      <td class="pl-td-school">${_esc(e.school || '—')}</td>
      <td class="pl-td-center">${_cardStatusBadge(e)}</td>
      <td class="pl-td-center">${_accountBadge(e.account_status)}</td>
      <td class="pl-td-actions no-print">
        <button class="pl-action-btn pl-action-btn--edit" data-pl-edit="${_esc(e.id)}">✏ Edit</button>
      </td>
    </tr>`;
  }).join('');

  if (footer) {
    footer.innerHTML = `Showing <strong>${list.length}</strong> of <strong>${db.length}</strong> employee${db.length !== 1 ? 's' : ''}`;
  }

  body.querySelectorAll('[data-pl-edit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const empId = btn.dataset.plEdit;
      const emp   = (window.state?.db || []).find(e => e.id === empId);
      if (!emp) { alert('Employee not found.'); return; }
      if (typeof showRegisterModal === 'function') showRegisterModal(emp);
      else alert('Edit modal is not available.');
    });
  });
}

/* ─────────────────────────────────────────────────────────
   EXPOSE
───────────────────────────────────────────────────────── */
window.renderPersonnelList  = renderPersonnelList;
window.filterPersonnelTable = filterPersonnelTable;