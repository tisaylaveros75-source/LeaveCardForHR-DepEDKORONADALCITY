/*
  WHAT THIS FILE DOES:
  This file builds and displays the leave card table — the main grid where
  all leave records are shown for a selected employee.

  WHAT IT COVERS:
  1. RENDERING the table — reads the employee's records and generates the
     full HTML table, grouped by "era" (e.g. Teaching → Non-Teaching).
  2. ERA BANNERS — each group has a collapsible header showing what era it
     belongs to, how many entries it has, and a delete button (if admin).
  3. TABLE ROWS — each leave record becomes one row in the table, showing
     dates, balances (Set A and Set B), and remarks.
  4. ROW ACTION MENUS — the ⋮ button on each row opens a small menu with:
       - ✏️ Edit   → opens the entry form pre-filled with that record
       - ➕ Insert Below → adds a new record directly after that row
       - 🗑️ Delete → removes that record after confirmation

  KEY FUNCTIONS:
  - renderLeaveCardTable()    → main function; clears and redraws the entire table
  - buildTableForSegment()    → builds the <table> HTML for one era's records
  - buildLeaveRow()           → builds one <tr> row for a single leave record
  - wireRowMenus()            → attaches click events to all ✏️ / ➕ / 🗑️ menu buttons
  - closeAllMenus()           → closes any open ⋮ dropdown menus
*/
'use strict';

// ── Close all open row-action drop-downs ──────────────────────────────
function closeAllMenus() {
  document.querySelectorAll('.row-menu-dd.open')
    .forEach(m => m.classList.remove('open'));
  document.getElementById('row-menu-portal')?.remove();
  
}

// ── Render the full leave card table into #lcTableWrap ────────────────
function renderLeaveCardTable(emp) {
  const wrap = document.getElementById('lcTableWrap');
  if (!wrap) return;

  const records = emp.records || [];
  const canEdit = state.isAdmin || state.isEncoder;

  // Split records into era segments at every conversion marker
  const segments = [];
  let cur = { conv: null, recs: [] };
  for (const r of records) {
    if (r._conversion) { segments.push(cur); cur = { conv: r, recs: [] }; }
    else cur.recs.push(r);
  }
  segments.push(cur);

  let html = '';
  segments.forEach((seg, si) => {
    const isFirst    = si === 0;
    const eraStatus  = seg.conv ? seg.conv.toStatus : (isFirst ? emp.status : '');
    const segIsT     = (eraStatus || '').toLowerCase() === 'teaching';
    const collapseId = `era-collapse-${si}`;
    const rowCount   = seg.recs.length;

    html += `<div class="era-wrapper">`;

    // ── Era banner ──
    if (seg.conv) {
      const fromS = escHtml(seg.conv.fromStatus || 'Previous');
      const toS   = escHtml(seg.conv.toStatus   || 'New');
      html += `
      <div class="era-banner" data-target="${collapseId}" data-era-si="${si}">
        <div class="era-banner-shine"></div>
        <div class="era-label-wrap">
          <span class="era-icon-pill">🔄</span>
          <span class="era-label-text">
            <span class="era-from-badge">${fromS}</span>
            <span class="era-arrow"> → </span>
            <span class="era-to-badge">${toS}</span>
          </span>
          <span class="era-record-count">${rowCount === 0 ? 'Forward balance only' : rowCount + ' entr' + (rowCount === 1 ? 'y' : 'ies')}</span>
        </div>
        <div class="era-chevron-wrap">
          ${canEdit ? `
            <button class="era-del-btn no-print"
              data-delera="${escHtml(emp.id)}"
              data-eraid="${seg.conv._record_id}"
              data-era-rowcount="${rowCount}"
              onclick="event.stopPropagation()">
              🗑️ Remove Era
            </button>` : ''}
          <span class="era-chevron" id="era-chev-${si}">▼</span>
        </div>
      </div>`;
    } else {
      const hasConversions = segments.length > 1;
      if (hasConversions) {
        html += `
        <div class="era-banner era-banner--first" data-target="${collapseId}" data-era-si="${si}">
          <div class="era-banner-shine"></div>
          <div class="era-label-wrap">
            <span class="era-icon-pill">📋</span>
            <span class="era-label-text">Initial Era</span>
            <span class="era-record-count">${rowCount === 0 ? 'No entries yet' : rowCount + ' entr' + (rowCount === 1 ? 'y' : 'ies')}</span>
          </div>
          <div class="era-chevron-wrap">
            <span class="era-chevron" id="era-chev-${si}">▼</span>
          </div>
        </div>`;
      }
    }

    html += `<div class="era-collapse-body era-collapse-open" id="${collapseId}">`;
    html += buildTableForSegment(seg.recs, segIsT, emp, canEdit, si, isFirst, seg.conv);
    html += `</div></div>`; // close era-collapse-body + era-wrapper
  });

  wrap.innerHTML = html;

  // ── Wire era-banner toggles ──
  wrap.querySelectorAll('.era-banner').forEach(banner => {
    banner.addEventListener('click', () => {
      const target  = document.getElementById(banner.dataset.target);
      const si      = banner.dataset.eraSi;
      const chevron = document.getElementById(`era-chev-${si}`);
      if (!target) return;
      const isOpen = target.classList.toggle('era-collapse-open');
      if (chevron) chevron.classList.toggle('collapsed', !isOpen);
      banner.classList.toggle('is-collapsed', !isOpen);
    });
  });

  // ── Wire delete-era buttons ──
  wrap.querySelectorAll('[data-delera]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const rowCount = +btn.dataset.eraRowcount;
      if (rowCount > 0) {
        showEraDeleteError(
          `Cannot remove this era — it contains ${rowCount} data entr${rowCount === 1 ? 'y' : 'ies'}. ` +
          `Delete all entries inside this era first.`
        );
        return;
      }
      if (!confirm('Remove this conversion era marker? The forwarded balance row will also be removed.')) return;

      const res = await apiCall('delete_era', {
        record_id:   +btn.dataset.eraid,
        employee_id: btn.dataset.delera,
      });
      if (!res.ok) { showEraDeleteError(res.error || 'Failed to remove era.'); return; }
      emp.records = emp.records.filter(r => r._record_id !== +btn.dataset.eraid);
      renderLeaveCardTable(emp);
      wireLeaveEntryForm(emp, null);
    });
  });

// ── Wire row-action menu open/close ──
  wrap.querySelectorAll('.row-menu-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
  e.stopPropagation();
  const existing = document.getElementById('row-menu-portal');
  if (existing) {
    existing.remove();
    if (existing._sourceBtn === btn) return; // same button → just close
  }
  closeAllMenus();
      const dd = btn.nextElementSibling;
      if (!dd) return;

      const rect  = btn.getBoundingClientRect();
      const menuW = 165;
      const menuH = 130;
let top  = rect.bottom + 4;
let left = rect.right - menuW;
if (left < 8) left = 8;
if (left + menuW > window.innerWidth - 8) left = window.innerWidth - menuW - 8;

// Flip upward if menu would overflow the bottom of the viewport
if (top + menuH > window.innerHeight - 8) {
  top = rect.top - menuH - 4;
  if (top < 8) top = 8;
}

      // Clone to body — escapes overflow/transform parents completely
      const portal = dd.cloneNode(true);
      portal.id = 'row-menu-portal';
      portal.style.cssText =
        `position:fixed;top:${top}px;left:${left}px;z-index:99999;display:block;`;
      document.body.appendChild(portal);
portal._sourceBtn = btn; // ← add this

      // Delegate portal clicks → original wired buttons in wrap
      portal.querySelectorAll('button').forEach(pBtn => {
        pBtn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          const sel = pBtn.dataset.editRec      ? `[data-edit-rec="${pBtn.dataset.editRec}"]`
                    : pBtn.dataset.delRec       ? `[data-del-rec="${pBtn.dataset.delRec}"]`
                    : pBtn.dataset.insertAfter  ? `[data-insert-after="${pBtn.dataset.insertAfter}"]`
                    : null;
          if (sel) wrap.querySelector(sel)?.click();
          document.getElementById('row-menu-portal')?.remove();
        });
      });

      // Close when clicking anywhere outside
      setTimeout(() => {
        document.addEventListener('click', function _closePortal() {
          document.getElementById('row-menu-portal')?.remove();
          document.removeEventListener('click', _closePortal);
        });
      }, 0);
    });
  });

  wireRowMenus(emp);
}

// ── Build the <table> HTML for one era segment ────────────────────────
function buildTableForSegment(recs, isT, emp, canEdit, segIdx, isFirst, conv) {
  const fwdRow = conv ? `
    <tr class="era-fwd-row">
      <td colspan="2" style="text-align:left;padding-left:8px;font-style:italic;">
        ↪ Forward Balance from ${escHtml(conv.fromStatus || 'previous era')}
      </td>
      <td></td><td></td><td class="bc">${h3(conv.fwdBV || 0)}</td><td></td>
      <td></td><td></td><td class="bc">${h3(conv.fwdBS || 0)}</td><td></td>
      <td class="remarks-cell"></td>
      ${canEdit ? '<td></td>' : ''}
    </tr>` : '';

  const setAHead = `<th class="tha" colspan="4">STUDY / VACATION / FORCE PERSONAL / SPECIAL LEAVE</th>`;
  const setBHead = `<th class="thb" colspan="4">SICK / MATERNITY / PATERNITY LEAVE</th>`;
  const setASub  = `<th class="ths tha">EARNED</th><th class="ths tha">ABS W/P</th><th class="ths tha">BALANCE</th><th class="ths tha">W/O P</th>`;
  const setBSub  = `<th class="ths thb">EARNED</th><th class="ths thb">ABS W/P</th><th class="ths thb">BALANCE</th><th class="ths thb">W/O P</th>`;

  return `<div class="tw"><table>
    <thead>
      <tr>
        <th rowspan="2">SO #</th>
        <th rowspan="2">PERIOD</th>
        ${setAHead}${setBHead}
        <th rowspan="2">REMARKS / TYPE OF LEAVE</th>
        ${canEdit ? '<th rowspan="2" class="no-print">⋮</th>' : ''}
      </tr>
      <tr>${setASub}${setBSub}</tr>
    </thead>
    <tbody>
      ${fwdRow}
      ${recs.map((r, i) => buildLeaveRow(r, i, isT, emp, canEdit)).join('')}
    </tbody>
  </table></div>`;
}

// ── Build one <tr> for a single leave record ──────────────────────────
function buildLeaveRow(r, idx, isNT, emp, canEdit) {
  const setAE = h3(r.setA_earned  || 0), setAA = h3(r.setA_abs_wp  || 0);
  const setAB = h3(r.setA_balance || 0), setAW = h3(r.setA_wop     || 0);
  const setBE = h3(r.setB_earned  || 0), setBA = h3(r.setB_abs_wp  || 0);
  const setBB = h3(r.setB_balance || 0), setBW = h3(r.setB_wop     || 0);

  const fromStr = fmtD(r.from || '');
  const toStr   = fmtD(r.to   || '');
  const fpTag   = (r.fromPeriod === 'AM' || r.fromPeriod === 'PM')
    ? ` <span style="font-size:9.5px;color:var(--mu);">(${r.fromPeriod})</span>` : '';
  const tpTag   = (r.toPeriod   === 'AM' || r.toPeriod   === 'PM')
    ? ` <span style="font-size:9.5px;color:var(--mu);">(${r.toPeriod})</span>`   : '';

  // Normalize prd display
  function normalizePrd(prd) {
    if (!prd) return '';
    prd = prd.trim();
    // yyyy only → display as-is (just the year)
    if (/^\d{4}$/.test(prd)) return prd;
    // yyyy-mm-dd → convert to mm/dd/yyyy
    if (/^\d{4}-\d{2}-\d{2}$/.test(prd)) {
      const [y, m, d] = prd.split('-');
      return `${m}/${d}/${y}`;
    }
    // already mm/dd/yyyy or any other text → as-is
    return prd;
  }

let periodHtml = '';

  // Build the from/to display string for dedup comparison
  let dateLineStr = '';
  if (fromStr && toStr && fromStr !== toStr) {
    dateLineStr = `${fromStr} – ${toStr}`;
  } else if (fromStr) {
    dateLineStr = fromStr;
  }

  // Only show prd if it's not a duplicate of the from/to display
  if (r.prd) {
    const prdDisplay = normalizePrd(r.prd);
    const isDupe = prdDisplay === fromStr
                || prdDisplay === toStr
                || prdDisplay === dateLineStr;
    if (!isDupe) {
      periodHtml += `<span style="display:block;font-size:10px;color:var(--mu);margin-bottom:2px;">${escHtml(prdDisplay)}</span>`;
    }
  }

  if (fromStr && toStr && fromStr !== toStr) {
    periodHtml += `<span class="prd-date">${escHtml(fromStr)}${fpTag} – ${escHtml(toStr)}${tpTag}</span>`;
  } else if (fromStr) {
    periodHtml += `<span class="prd-date">${escHtml(fromStr)}${fpTag}</span>`;
  } else if (r.prd) {
    // No from/to at all — show prd as the only date line
    periodHtml += `<span class="prd-date">${escHtml(normalizePrd(r.prd))}</span>`;
  }

  const menuHtml = canEdit ? `<td class="no-print">
    <div class="row-menu-wrap">
      <button class="row-menu-btn">⋮</button>
      <div class="row-menu-dd" id="menu_${r._record_id || idx}">
        <button data-edit-rec="${r._record_id}"    data-empid="${escHtml(emp.id)}">✏️ Edit</button>
        <button data-insert-after="${r.sort_order}" data-empid="${escHtml(emp.id)}">➕ Insert Below</button>
        <div class="menu-div"></div>
        <button class="danger" data-del-rec="${r._record_id}" data-empid="${escHtml(emp.id)}">🗑️ Delete</button>
      </div>
    </div>
  </td>` : '';

  const remarksText = [r.action || '', r.spec ? `(${r.spec})` : ''].filter(Boolean).join(' ');

  return `<tr>
    <td class="nc">${escHtml(r.so || '')}</td>
    <td class="period-cell">${periodHtml}</td>
    <td class="nc">${setAE}</td><td class="nc">${setAA}</td><td class="bc">${setAB}</td><td class="nc ${setAW ? 'rdc' : ''}">${setAW}</td>
    <td class="nc">${setBE}</td><td class="nc">${setBA}</td><td class="bc">${setBB}</td><td class="nc ${setBW ? 'rdc' : ''}">${setBW}</td>
    <td class="remarks-cell">${escHtml(remarksText)}</td>
    ${menuHtml}
  </tr>`;
}

// ── Wire row-action menus (edit / insert-below / delete) ─────────────
function wireRowMenus(emp) {
  const wrap = document.getElementById('lcTableWrap');
  if (!wrap) return;

  // Edit
  wrap.querySelectorAll('[data-edit-rec]').forEach(btn => {
    btn.addEventListener('click', () => {
      closeAllMenus();
      const rid = +btn.dataset.editRec;
      const rec = emp.records.find(r => r._record_id === rid);
      if (rec) {
        wireLeaveEntryForm(emp, rec);
        document.getElementById('leaveEntryPanel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Delete
  wrap.querySelectorAll('[data-del-rec]').forEach(btn => {
    btn.addEventListener('click', async () => {
      closeAllMenus();
      if (!confirm('Delete this leave record?')) return;
      const rid = +btn.dataset.delRec;
      const res = await apiCall('delete_record', { record_id: rid, employee_id: emp.id });
      if (!res.ok) { alert(res.error); return; }
      emp.records = emp.records.filter(r => r._record_id !== rid);
      await saveRowBalances(emp.records, emp.id, emp.status);
      const res2 = await apiCall('get_records', { employee_id: emp.id }, 'GET');
      if (res2.ok) emp.records = res2.records || [];
      if (typeof refreshEmpCardStatus === 'function') refreshEmpCardStatus(emp);
      renderLeaveCardTable(emp);
      wireLeaveEntryForm(emp, null);
    });
  });

  // Insert below
  wrap.querySelectorAll('[data-insert-after]').forEach(btn => {
    btn.addEventListener('click', async () => {
      closeAllMenus();
      const afterSort = +btn.dataset.insertAfter;
      const panel = document.getElementById('leaveEntryPanel');
      if (!panel) return;
      resetLeaveEntryForm(panel);
      panel.dataset.insertAfter = afterSort;

      const saveBtn    = document.getElementById('leaveEntrySave');
      const newSaveBtn = saveBtn.cloneNode(true);
      newSaveBtn.textContent = '💾 INSERT BELOW';
      saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

      newSaveBtn.addEventListener('click', async () => {
        const errEl = document.getElementById('le_err');
        errEl.textContent = '';
        const rec = collectEntryForm(panel);
        const res = await apiCall('insert_record_at', {
          employee_id:  emp.id,
          record:       rec,
          after_sort_order: afterSort,
        });
        if (!res.ok) { errEl.textContent = res.error; return; }
        resetLeaveEntryForm(panel);
        const res2 = await apiCall('get_records', { employee_id: emp.id }, 'GET');
        if (res2.ok) emp.records = res2.records || [];
        await saveRowBalances(emp.records, emp.id, emp.status);
        const res3 = await apiCall('get_records', { employee_id: emp.id }, 'GET');
        if (res3.ok) emp.records = res3.records || [];
        sortRecordsInPlace(emp.records);
        if (typeof refreshEmpCardStatus === 'function') refreshEmpCardStatus(emp);
        renderLeaveCardTable(emp);
        wireLeaveEntryForm(emp, null);
      }, { once: true });

      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}
