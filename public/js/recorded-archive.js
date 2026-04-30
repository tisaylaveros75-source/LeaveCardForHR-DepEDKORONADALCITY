(function () {
'use strict';

/* ── Inject CSS once ── */
(function injectCSS() {
  if (document.getElementById('ra-arch-css')) return;
  const s = document.createElement('style');
  s.id = 'ra-arch-css';
  s.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

#pg-recorded-archive,
#pg-emp-recorded {
  font-family: 'DM Sans', sans-serif;
  background: #f2f4f7;
  min-height: 100vh;
}
.ra-arch-page { max-width: 960px; margin: 0 auto; padding-bottom: 80px; }

.ra-arch-header {
  background: linear-gradient(135deg, #1e3a6e 0%, #2d5aa0 55%, #4a7cc7 100%);
  color: #fff; padding: 18px 28px;
  position: sticky; top: 0; z-index: 200;
  box-shadow: 0 3px 20px rgba(30,58,110,.45);
}
.ra-arch-header-inner {
  display: flex; align-items: center;
  justify-content: space-between; gap: 16px;
  max-width: 960px; margin: 0 auto;
}
.ra-arch-back-btn {
  background: rgba(255,255,255,.14); color: #fff;
  border: 1.5px solid rgba(255,255,255,.3); border-radius: 9px;
  padding: 8px 18px; font-size: 12px; font-weight: 700;
  cursor: pointer; font-family: 'DM Sans', sans-serif;
  white-space: nowrap;
}
.ra-arch-back-btn:hover { background: rgba(255,255,255,.24); }

.ra-arch-stats-row {
  display: flex; gap: 12px; padding: 20px 20px 0; flex-wrap: wrap;
}
.ra-arch-stat-chip {
  background: #fff; border: 1.5px solid #c8daf0;
  border-radius: 12px; padding: 12px 20px;
  font-size: 11px; font-weight: 700; color: #2a3a5e;
  box-shadow: 0 1px 6px rgba(30,58,110,.07);
}
.ra-arch-stat-chip span {
  font-size: 22px; font-weight: 800; color: #1e3a6e;
  display: block; font-family: 'Playfair Display', serif;
}

.ra-arch-search-bar {
  display: flex; gap: 10px; padding: 16px 20px 0;
  align-items: center; flex-wrap: wrap;
}
.ra-arch-search-input {
  flex: 1; min-width: 220px;
  border: 1.5px solid #c8daf0; border-radius: 10px;
  padding: 10px 16px 10px 40px; font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  outline: none; background: #fff;
  transition: border-color .2s, box-shadow .2s;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%232d5aa0' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: 12px center;
}
.ra-arch-search-input:focus {
  border-color: #2d5aa0;
  box-shadow: 0 0 0 3px rgba(45,90,160,.11);
}
.ra-arch-filter-select {
  border: 1.5px solid #c8daf0; border-radius: 10px;
  padding: 10px 14px; font-size: 12px;
  font-family: 'DM Sans', sans-serif; background: #fff;
  cursor: pointer; color: #2a3a5e;
  transition: border-color .2s; min-width: 130px;
}
.ra-arch-filter-select:focus { border-color: #2d5aa0; outline: none; }

.ra-arch-list-wrap { padding: 8px 20px 0; }

.ra-arch-month-group { margin-bottom: 8px; }
.ra-arch-month-label {
  display: flex; align-items: center; gap: 10px;
  font-size: 10px; font-weight: 800; letter-spacing: 1.5px;
  text-transform: uppercase; color: #2d5aa0;
  margin-bottom: 10px; padding-top: 16px;
}
.ra-arch-month-label::after {
  content: ''; flex: 1; height: 1.5px;
  background: linear-gradient(90deg, #c8daf0, transparent);
}
.ra-arch-month-count {
  font-size: 9px; font-weight: 600; color: #7a8a9d; margin-left: 2px;
}

.ra-arch-app-card {
  background: #fff; border-radius: 14px;
  border: 1.5px solid #d0dff0;
  padding: 18px 22px; margin-bottom: 10px;
  box-shadow: 0 2px 10px rgba(30,58,110,.06);
  transition: box-shadow .2s, transform .2s;
}
.ra-arch-app-card:hover {
  box-shadow: 0 6px 24px rgba(30,58,110,.13);
  transform: translateY(-2px);
}
.ra-arch-card-top {
  display: flex; align-items: flex-start;
  justify-content: space-between; gap: 16px;
  flex-wrap: wrap; margin-bottom: 10px;
}
.ra-arch-emp-name {
  font-size: 14px; font-weight: 700; color: #1a1a2e; margin-bottom: 3px;
}
.ra-arch-card-meta { font-size: 11.5px; color: #7a8a9d; }
.ra-arch-leave-type {
  font-size: 12px; font-weight: 700; color: #1e3a6e;
  background: #dbeafe; border-radius: 8px;
  padding: 4px 12px; white-space: nowrap; flex-shrink: 0;
}
.ra-arch-card-details {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(180px,1fr));
  gap: 6px 16px; font-size: 12px; color: #4a4a5a; margin-bottom: 12px;
}
.ra-arch-card-details strong {
  font-size: 9px; font-weight: 700; letter-spacing: .6px;
  text-transform: uppercase; color: #7a8a9d; display: block;
  margin-bottom: 1px;
}
.ra-arch-recorded-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: #dbeafe; color: #1e3a6e;
  border: 1px solid #93c5fd; border-radius: 8px;
  padding: 5px 14px; font-size: 11px; font-weight: 700;
}
.ra-arch-card-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.ra-arch-btn {
  font-size: 11px; font-weight: 700; padding: 7px 16px;
  border-radius: 8px; border: none; cursor: pointer;
  transition: transform .15s, box-shadow .15s;
  font-family: 'DM Sans', sans-serif;
}
.ra-arch-btn:hover { transform: translateY(-1px); }
.ra-arch-btn-view {
  background: #ede9fe; color: #4c1d95;
  border: 1px solid #c4b5fd;
}
.ra-arch-btn-print {
  background: #d1fae5; color: #065f46;
  border: 1px solid #6ee7b7;
}

.ra-arch-empty {
  text-align: center; padding: 60px 20px;
  font-size: 13px; color: #7a8a9d;
}
.ra-arch-empty span { display: block; font-size: 44px; margin-bottom: 14px; }

@media (max-width: 600px) {
  .ra-arch-card-details { grid-template-columns: 1fr 1fr; }
  .ra-arch-search-bar { flex-direction: column; }
  .ra-arch-search-input, .ra-arch-filter-select { width: 100%; min-width: unset; }
}
  `;
  document.head.appendChild(s);
})();

/* ══════════════════════════════════════════════════════
   MAIN ENTRY — called from admin Recorded tab
   OR from employee Recorded tab (isEmployee = true)
   ══════════════════════════════════════════════════════ */
async function renderRecordedArchivePage(isEmployee) {
  const pageId = isEmployee ? 'pg-emp-recorded' : 'pg-recorded-archive';

  let pg = document.getElementById(pageId);
  if (!pg) {
    pg = document.createElement('div');
    pg.id        = pageId;
    pg.className = 'page';
    (document.getElementById('s-app') || document.body).appendChild(pg);
  }
  document.querySelectorAll('.page').forEach(p => p.classList.remove('on'));
  pg.classList.add('on');
  window.scrollTo(0, 0);

  const backLabel = isEmployee ? '← My Applications' : '← Submissions';

  pg.innerHTML = `
    <div class="ra-arch-page">
      <div class="ra-arch-header">
        <div class="ra-arch-header-inner">
          <button class="ra-arch-back-btn" id="raArchBackBtn">${backLabel}</button>
          <div style="text-align:center;flex:1;">
            <div style="font-size:9px;letter-spacing:2.5px;text-transform:uppercase;opacity:.65;margin-bottom:3px;">
              ${isEmployee ? 'My Recorded Applications' : 'Admin — All Recorded'}
            </div>
            <div style="font-family:'Playfair Display',Georgia,serif;font-size:1.2rem;font-weight:800;">
              📁 Recorded Leave Applications
            </div>
            <div style="font-size:10.5px;opacity:.7;margin-top:2px;">
              SDO Koronadal City · Leave Card Management System
            </div>
          </div>
          <div style="width:140px;"></div>
        </div>
      </div>
      <div id="raArchInner">
        <div class="ra-arch-empty"><span>⏳</span>Loading…</div>
      </div>
    </div>`;

  /* Back button */
  document.getElementById('raArchBackBtn')?.addEventListener('click', () => {
    pg.classList.remove('on');
    if (isEmployee) {
      /* Try both employee page containers */
      const empPg = document.getElementById('pg-emp-submissions') || document.getElementById('pg-user');
      if (empPg) empPg.classList.add('on');
    } else {
      const subPg = document.getElementById('pg-submissions');
      if (subPg) {
        subPg.classList.add('on');
        if (typeof renderSubmissionsPage === 'function') renderSubmissionsPage();
      } else if (typeof window.setPage === 'function') {
        window.setPage('submissions');
      }
    }
  });

  const apiCall = window.apiCall;
  if (!apiCall) return;
  const esc = window.escHtml || (s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'));

  const endpoint = isEmployee ? 'get_my_recorded_applications' : 'get_recorded_applications';
  const res      = await apiCall(endpoint, {}, 'GET');
  const allApps  = (res.ok ? res.applications : []) || [];

  _raArchRenderInner(allApps, esc, isEmployee, pg);
}
window.renderRecordedArchivePage = renderRecordedArchivePage;

/* ── Build search/filter UI and initial list ── */
function _raArchRenderInner(allApps, esc, isEmployee, pg) {
  const inner = document.getElementById('raArchInner');
  if (!inner) return;

  /* Unique years from date_of_filing */
  const years = [...new Set(
    allApps.map(a => a.date_of_filing ? new Date(a.date_of_filing + 'T00:00:00').getFullYear() : null)
           .filter(Boolean)
  )].sort((a,b) => b - a);

  const uniqueEmps = isEmployee ? 0 : new Set(allApps.map(a => a.employee_id)).size;

  inner.innerHTML = `
    <div class="ra-arch-stats-row">
      <div class="ra-arch-stat-chip">
        <span>${allApps.length}</span>
        Total Recorded
      </div>
      ${!isEmployee ? `
      <div class="ra-arch-stat-chip">
        <span>${uniqueEmps}</span>
        Employees
      </div>` : ''}
    </div>

    <div class="ra-arch-search-bar">
      <input class="ra-arch-search-input" id="raArchSearch"
        placeholder="Search name, leave type, dates, school…"/>
      <select class="ra-arch-filter-select" id="raArchYearFilter">
        <option value="">All Years</option>
        ${years.map(y => `<option value="${y}">${y}</option>`).join('')}
      </select>
      <select class="ra-arch-filter-select" id="raArchMonthFilter">
        <option value="">All Months</option>
        ${['January','February','March','April','May','June',
           'July','August','September','October','November','December']
          .map((m,i) => `<option value="${i+1}">${m}</option>`).join('')}
      </select>
      ${!isEmployee ? `
      <select class="ra-arch-filter-select" id="raArchCatFilter" style="min-width:160px;">
        <option value="">All Categories</option>
        <option value="Teaching">Teaching</option>
        <option value="Non-Teaching">Non-Teaching</option>
        <option value="Teaching Related">Teaching Related</option>
      </select>` : ''}
    </div>

    <div class="ra-arch-list-wrap" id="raArchListWrap"></div>`;

  function doFilter() {
    const q   = (document.getElementById('raArchSearch')?.value   || '').toLowerCase();
    const yr  = document.getElementById('raArchYearFilter')?.value  || '';
    const mo  = document.getElementById('raArchMonthFilter')?.value || '';
    const cat = document.getElementById('raArchCatFilter')?.value   || '';

    let list = allApps;

    if (q) list = list.filter(a => {
      const haystack = [
        a.surname||'', a.given||'', a.leave_type||'',
        a.inclusive_dates||'', a.office_school||'', a.emp_category||''
      ].join(' ').toLowerCase();
      return haystack.includes(q);
    });

    if (yr) list = list.filter(a => {
      const d = a.date_of_filing;
      return d && new Date(d + 'T00:00:00').getFullYear() === +yr;
    });

    if (mo) list = list.filter(a => {
      const d = a.date_of_filing;
      return d && (new Date(d + 'T00:00:00').getMonth() + 1) === +mo;
    });

    if (cat) list = list.filter(a => (a.emp_category||'') === cat);

    _raArchRenderList(list, esc, isEmployee);
  }

  document.getElementById('raArchSearch')?.addEventListener('input',  doFilter);
  document.getElementById('raArchYearFilter')?.addEventListener('change',  doFilter);
  document.getElementById('raArchMonthFilter')?.addEventListener('change', doFilter);
  document.getElementById('raArchCatFilter')?.addEventListener('change',   doFilter);

  /* Initial render */
  _raArchRenderList(allApps, esc, isEmployee);
}

/* ── Render grouped list ── */
function _raArchRenderList(apps, esc, isEmployee) {
  const wrap = document.getElementById('raArchListWrap');
  if (!wrap) return;

  if (apps.length === 0) {
    wrap.innerHTML = `
      <div class="ra-arch-empty">
        <span>📁</span>
        No recorded applications found.
      </div>`;
    return;
  }

  /* Group by Month-Year of date_of_filing */
  const groups = {};
  apps.forEach(a => {
    const raw = a.date_of_filing;
    let key = 'Unknown Date';
    if (raw) {
      const d = new Date(raw + 'T00:00:00');
      if (!isNaN(d)) key = d.toLocaleString('en-PH', { month: 'long', year: 'numeric' });
    }
    if (!groups[key]) groups[key] = [];
    groups[key].push(a);
  });

  /* Sort groups newest first using a comparable date value */
  const sortedKeys = Object.keys(groups).sort((keyA, keyB) => {
    const toMs = k => {
      if (k === 'Unknown Date') return 0;
      const d = new Date(k);
      return isNaN(d) ? 0 : d.getTime();
    };
    return toMs(keyB) - toMs(keyA);
  });

  wrap.innerHTML = sortedKeys.map(key => {
    const list = groups[key];
    return `
      <div class="ra-arch-month-group">
        <div class="ra-arch-month-label">
          📅 ${key}
          <span class="ra-arch-month-count">(${list.length} application${list.length!==1?'s':''})</span>
        </div>
        ${list.map(a => _raArchBuildCard(a, esc, isEmployee)).join('')}
      </div>`;
  }).join('');

  /* Wire View and Print buttons */
  wrap.querySelectorAll('[data-ra-view]').forEach(btn => {
    const app = apps.find(a => String(a.id) === String(btn.dataset.raView));
    if (app && typeof _laViewCSFModal === 'function') {
      btn.addEventListener('click', () => _laViewCSFModal(app, esc));
    }
  });

  wrap.querySelectorAll('[data-ra-print]').forEach(btn => {
    const app = apps.find(a => String(a.id) === String(btn.dataset.raPrint));
    if (app && typeof _laViewCSFModal === 'function') {
      btn.addEventListener('click', () => {
        _laViewCSFModal(app, esc);
        setTimeout(() => {
          document.getElementById('csfPrintFrame')?.contentWindow?.print();
        }, 800);
      });
    }
  });
}

/* ── Build a single card ── */
function _raArchBuildCard(a, esc, isEmployee) {
  const lbl = (a.leave_type === 'Others' && a.leave_type_other)
    ? `Others: ${esc(a.leave_type_other)}`
    : esc(a.leave_type || '—');

  let recDateStr = '—';
  if (a.recorded_at) {
    try {
      recDateStr = new Date(a.recorded_at).toLocaleDateString('en-PH', {
        month: 'long', day: 'numeric', year: 'numeric'
      });
    } catch(e) { recDateStr = String(a.recorded_at).slice(0, 10); }
  }

  const recBy = a.recorded_by ? ` by <strong>${esc(a.recorded_by)}</strong>` : '';

  return `
    <div class="ra-arch-app-card">
      <div class="ra-arch-card-top">
        <div>
          ${!isEmployee ? `
          <div class="ra-arch-emp-name">👤 ${esc(a.surname||'')}, ${esc(a.given||'')}${a.suffix?' '+esc(a.suffix):''}</div>
          <div class="ra-arch-card-meta">
            ${esc(a.emp_category||'')} &nbsp;·&nbsp; ${esc(a.office_school||'—')}
          </div>` : `
          <div class="ra-arch-card-meta">Filed: ${a.date_of_filing||'—'}</div>`}
          ${isEmployee ? '' : `<div class="ra-arch-card-meta" style="margin-top:2px;">Filed: ${a.date_of_filing||'—'}</div>`}
        </div>
        <div class="ra-arch-leave-type">${lbl}</div>
      </div>

      <div class="ra-arch-card-details">
        <span>
          <strong>Inclusive Dates</strong>
          ${esc(a.inclusive_dates||'—')}
        </span>
        <span>
          <strong>Working Days</strong>
          ${a.num_working_days||'—'}
        </span>
        <span>
          <strong>Commutation</strong>
          ${esc(a.commutation||'Not Requested')}
        </span>
        ${a.attachment_name ? `
        <span>
          <strong>Attachment</strong>
          <a href="/storage/${esc(a.attachment_path||'')}" target="_blank"
            style="color:#3b82f6;text-decoration:none;">
            📎 ${esc(a.attachment_name)}
          </a>
        </span>` : ''}
      </div>

      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
        <div class="ra-arch-recorded-badge">
          📁 Recorded on ${recDateStr}${recBy}
        </div>
        <div class="ra-arch-card-actions">
          <button class="ra-arch-btn ra-arch-btn-view" data-ra-view="${a.id}">
            🔍 View CSF No. 6
          </button>
          <button class="ra-arch-btn ra-arch-btn-print" data-ra-print="${a.id}">
            🖨 Print
          </button>
        </div>
      </div>
    </div>`;
}

})();