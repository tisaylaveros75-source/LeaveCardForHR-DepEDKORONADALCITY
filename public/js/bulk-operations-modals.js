'use strict';

/* ─── Google Font injection (Orbitron + Rajdhani) ─────── */
(function() {
  if (!document.getElementById('_bop_fonts')) {
    const l = document.createElement('link');
    l.id   = '_bop_fonts';
    l.rel  = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Orbitron:wght@700;900&display=swap';
    document.head.appendChild(l);
  }
})();

/* ─── inject shared CSS once ──────────────────────────── */
(function() {
  if (document.getElementById('_bop_styles')) return;
  const s = document.createElement('style');
  s.id = '_bop_styles';
  s.textContent = `
    .bop-modal-bg{position:fixed;inset:0;z-index:9990;background:rgba(10,2,2,.88);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:20px;}
    .bop-modal{position:relative;width:96%;max-width:620px;max-height:90vh;display:flex;flex-direction:column;background:linear-gradient(160deg,#1c0404 0%,#220505 40%,#180303 100%);border-radius:4px 20px 4px 20px;overflow:hidden;box-shadow:0 0 0 1px rgba(180,40,20,.5),0 0 0 2px rgba(80,10,5,.8),inset 0 1px 0 rgba(255,100,60,.15),inset 0 -1px 0 rgba(120,20,10,.4),0 30px 80px rgba(0,0,0,.9),0 8px 32px rgba(160,20,10,.3);font-family:'Rajdhani',sans-serif;}
    .bop-modal::before{content:'';position:absolute;inset:0;pointer-events:none;z-index:1;background:radial-gradient(circle 4px at 14px 14px,#b03020 60%,transparent 70%),radial-gradient(circle 4px at calc(100% - 14px) 14px,#b03020 60%,transparent 70%),radial-gradient(circle 4px at 14px calc(100% - 14px),#b03020 60%,transparent 70%),radial-gradient(circle 4px at calc(100% - 14px) calc(100% - 14px),#b03020 60%,transparent 70%),linear-gradient(90deg,rgba(180,40,20,.1) 1px,transparent 1px),linear-gradient(0deg,rgba(180,40,20,.1) 1px,transparent 1px);background-size:100% 100%,100% 100%,100% 100%,100% 100%,28px 28px,28px 28px;}
    .bop-modal::after{content:'';position:absolute;inset:0;pointer-events:none;z-index:1;background:linear-gradient(90deg,rgba(220,50,20,.22) 0px,rgba(220,50,20,.04) 3px,transparent 10px),linear-gradient(270deg,rgba(220,50,20,.22) 0px,rgba(220,50,20,.04) 3px,transparent 10px),linear-gradient(180deg,rgba(255,80,30,.18) 0px,rgba(255,80,30,.03) 3px,transparent 12px);}
    .bop-header{position:relative;background:linear-gradient(135deg,#3d0808 0%,#5a0e0e 35%,#7a1515 60%,#5a0e0e 80%,#380707 100%);padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:62px;clip-path:polygon(0 0,100% 0,100% 75%,calc(100% - 24px) 100%,24px 100%,0 75%);flex-shrink:0;}
    .bop-header::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent 20%,rgba(255,100,50,.07) 50%,transparent 80%),repeating-linear-gradient(90deg,rgba(255,80,30,.04) 0px,transparent 1px,transparent 22px,rgba(255,80,30,.04) 23px);pointer-events:none;}
    .bop-title{font-family:'Orbitron',sans-serif;font-size:13px;font-weight:700;color:#fff;text-shadow:0 0 20px rgba(255,100,50,.6),0 1px 2px rgba(0,0,0,.8);letter-spacing:.08em;display:flex;align-items:center;gap:10px;}
    .bop-title-icon{width:28px;height:28px;background:linear-gradient(135deg,#8b1a1a,#c83030);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 8px rgba(200,48,48,.5),inset 0 1px 0 rgba(255,150,100,.2);}
    .bop-close-btn{width:30px;height:30px;background:linear-gradient(135deg,#3a0808,#5a1010);border:1px solid rgba(200,60,40,.4);border-radius:6px;color:rgba(255,180,140,.8);font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:inset 0 1px 0 rgba(255,120,80,.1),0 2px 6px rgba(0,0,0,.5);transition:all .2s;}
    .bop-close-btn:hover{background:linear-gradient(135deg,#5a0808,#8b1a1a);color:#fff;}
    .bop-body{padding:22px 26px;position:relative;z-index:2;overflow-y:auto;flex:1 1 auto;}
    .bop-body::-webkit-scrollbar{width:4px;} .bop-body::-webkit-scrollbar-track{background:rgba(0,0,0,.3);} .bop-body::-webkit-scrollbar-thumb{background:rgba(180,40,20,.5);border-radius:2px;}
    .bop-stats{display:flex;gap:10px;margin-bottom:18px;}
    .bop-stat{flex:1;background:linear-gradient(145deg,rgba(255,255,255,.03) 0%,rgba(139,26,26,.08) 100%);border:1px solid rgba(139,26,26,.25);border-radius:10px;padding:12px 16px;position:relative;overflow:hidden;}
    .bop-stat::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,100,50,.3),transparent);}
    .bop-stat-num{font-family:'Orbitron',sans-serif;font-size:2rem;font-weight:900;line-height:1;}
    .bop-stat-lbl{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,180,130,.5);margin-top:4px;}
    .bop-info{background:linear-gradient(135deg,rgba(100,20,5,.4),rgba(60,10,2,.6));border:1px solid rgba(200,80,30,.25);border-left:3px solid rgba(220,80,30,.6);border-radius:0 10px 10px 0;padding:12px 16px;margin-bottom:18px;font-size:13px;color:rgba(255,215,180,.9);line-height:1.7;position:relative;}
    .bop-info::before{content:'';position:absolute;top:0;left:0;bottom:0;width:3px;background:linear-gradient(180deg,#ff6030,#c03010,#ff6030);border-radius:2px 0 0 2px;}
    .bop-sec-hdr{display:flex;align-items:center;justify-content:space-between;padding:7px 12px;background:linear-gradient(90deg,rgba(139,26,26,.2),transparent);border:1px solid rgba(139,26,26,.2);border-radius:7px 7px 0 0;cursor:pointer;user-select:none;transition:background .2s;}
    .bop-sec-hdr:hover{background:linear-gradient(90deg,rgba(139,26,26,.35),rgba(100,10,10,.1));}
    .bop-sec-left{display:flex;align-items:center;gap:8px;}
    .bop-sec-label{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,180,120,.7);}
    .bop-sec-count{font-family:'Orbitron',sans-serif;font-size:10px;color:rgba(255,140,80,.6);background:rgba(139,26,26,.3);border:1px solid rgba(139,26,26,.3);border-radius:4px;padding:1px 6px;}
    .bop-chevron{font-size:10px;color:rgba(255,140,80,.5);transition:transform .25s ease;display:inline-block;}
    .bop-chevron.open{transform:rotate(180deg);}
    .bop-list{overflow:hidden;max-height:0;transition:max-height .35s cubic-bezier(.4,0,.2,1);background:rgba(0,0,0,.25);border:1px solid rgba(139,26,26,.2);border-top:none;border-radius:0 0 8px 8px;margin-bottom:14px;}
    .bop-list.open{max-height:180px;overflow-y:auto;}
    .bop-list::-webkit-scrollbar{width:4px;} .bop-list::-webkit-scrollbar-track{background:rgba(0,0,0,.3);} .bop-list::-webkit-scrollbar-thumb{background:rgba(180,40,20,.5);border-radius:2px;}
    .bop-row{display:flex;align-items:center;gap:8px;padding:9px 14px;border-bottom:1px solid rgba(139,26,26,.12);transition:background .15s;}
    .bop-row:hover{background:rgba(139,26,26,.1);}
    .bop-row:last-child{border-bottom:none;}
    .bop-row-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:700;font-size:13px;color:rgba(255,220,190,.9);letter-spacing:.03em;}
    .bop-row-id{flex-shrink:0;font-size:10px;color:rgba(255,180,130,.4);font-family:monospace;}
    .bop-prog-wrap{display:none;margin-bottom:16px;}
    .bop-prog-track{width:100%;height:6px;background:rgba(139,26,26,.2);border-radius:3px;overflow:hidden;margin-bottom:6px;}
    .bop-fill{height:100%;background:linear-gradient(90deg,#7a1010,#c0392b,#ff4020,#c0392b,#7a1010);background-size:200% 100%;animation:bopShimmer 1.5s linear infinite;width:0%;transition:width .4s;border-radius:3px;}
    @keyframes bopShimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
    .bop-prog-row{display:flex;justify-content:space-between;}
    .bop-stat-txt{font-size:11px;font-weight:700;color:rgba(255,160,120,.7);text-transform:uppercase;letter-spacing:.06em;}
    .bop-pct{font-family:'Orbitron',sans-serif;font-size:13px;font-weight:700;color:#ff6040;}
    .bop-footer{display:flex;gap:12px;justify-content:flex-end;padding:14px 26px 20px;border-top:1px solid rgba(139,26,26,.2);position:relative;z-index:2;flex-shrink:0;}
    .bop-footer::before{content:'';position:absolute;top:0;left:20%;right:20%;height:1px;background:linear-gradient(90deg,transparent,rgba(255,80,30,.25),transparent);}
    .bop-btn{display:inline-flex;align-items:center;gap:7px;font-family:'Rajdhani',sans-serif;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;border-radius:8px;padding:11px 20px;cursor:pointer;transition:all .2s;position:relative;overflow:hidden;}
    .bop-btn::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent);transition:left .4s;}
    .bop-btn:hover::after{left:150%;}
    .bop-btn-cancel{border:1px solid rgba(200,80,60,.5);background:linear-gradient(135deg,#2a0808,#3a1010);color:rgba(255,200,160,.8);box-shadow:inset 0 1px 0 rgba(255,100,60,.08),0 2px 8px rgba(0,0,0,.4);}
    .bop-btn-cancel:hover{background:linear-gradient(135deg,#3a0a0a,#5a1515);border-color:rgba(220,100,70,.7);}
    .bop-btn-primary{border:none;background:linear-gradient(135deg,#8b1a1a 0%,#c83030 50%,#a02020 100%);color:#fff;box-shadow:0 4px 18px rgba(139,26,26,.6),inset 0 1px 0 rgba(255,150,100,.2);}
    .bop-btn-primary:hover{background:linear-gradient(135deg,#a01e1e,#e03535,#b02525);box-shadow:0 6px 24px rgba(200,30,30,.7),inset 0 1px 0 rgba(255,180,120,.25);transform:translateY(-1px);}
    .bop-btn-primary:active{transform:translateY(0);}
    .bop-btn-danger{border:none;background:linear-gradient(135deg,#7f1d1d 0%,#dc2626 50%,#991b1b 100%);color:#fff;box-shadow:0 4px 18px rgba(127,29,29,.6),inset 0 1px 0 rgba(255,150,100,.2);}
    .bop-btn-danger:hover{background:linear-gradient(135deg,#991b1b,#ef4444,#b91c1c);box-shadow:0 6px 24px rgba(220,38,38,.7);transform:translateY(-1px);}
    .bop-btn-danger:active{transform:translateY(0);}
    .bop-result-ok{background:rgba(5,46,22,.5);border:1px solid rgba(74,222,128,.3);border-radius:10px;padding:14px 18px;font-size:13px;color:rgba(255,215,180,.9);line-height:1.7;}
    .bop-result-err{background:rgba(100,40,5,.5);border:1px solid rgba(251,191,36,.3);border-radius:10px;padding:14px 18px;font-size:13px;color:rgba(255,215,180,.9);line-height:1.7;}
    .bop-done-screen{text-align:center;padding:24px 0;}
    .bop-done-icon{font-size:52px;margin-bottom:14px;}
    .bop-done-title{font-family:'Orbitron',sans-serif;font-size:1rem;font-weight:700;color:#4ade80;margin-bottom:8px;}
    .bop-done-sub{color:rgba(255,215,180,.6);font-size:13px;}
  `;
  document.head.appendChild(s);
})();

/* ─── escape html ──────────────────────────────────────── */
function _bopEsc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ─── employee row ─────────────────────────────────────── */
function _bopRow(emp, icon) {
  const name = `${(emp.surname||'').toUpperCase()}, ${emp.given||''}`;
  return `<div class="bop-row">
    <span style="flex-shrink:0;font-size:13px;">${icon}</span>
    <span class="bop-row-name">${_bopEsc(name)}</span>
    <span class="bop-row-id">${_bopEsc(emp.id)}</span>
  </div>`;
}

/* ─── collapsible section ──────────────────────────────── */
function _bopSection(listId, chevId, label, count, rows, startOpen, opacity) {
  const op = opacity ? `style="opacity:${opacity}"` : '';
  const openStyle = startOpen ? 'style="max-height:180px;"' : '';
  return `
    <div class="bop-sec-hdr" onclick="(function(){var l=document.getElementById('${listId}');var c=document.getElementById('${chevId}');var open=l.classList.contains('open');if(open){l.classList.remove('open');l.style.maxHeight='0';c.classList.remove('open');}else{l.classList.add('open');l.style.maxHeight='180px';c.classList.add('open');}})()">
      <div class="bop-sec-left">
        <span class="bop-sec-label">${label}</span>
        <span class="bop-sec-count">${count}</span>
      </div>
      <span class="bop-chevron ${startOpen?'open':''}" id="${chevId}">&#9660;</span>
    </div>
    <div class="bop-list ${startOpen?'open':''}" id="${listId}" ${openStyle} ${op}>
      ${rows || `<div style="padding:10px 14px;font-size:12px;color:rgba(255,200,180,.4);">None</div>`}
    </div>`;
}

/* ─── progress helpers ─────────────────────────────────── */
function _bopProgress(moId, pct, txt) {
  const fill  = document.querySelector(`#${moId} .bop-fill`);
  const stat  = document.querySelector(`#${moId} .bop-stat-txt`);
  const pctEl = document.querySelector(`#${moId} .bop-pct`);
  if (fill)  fill.style.width  = Math.min(100,pct)+'%';
  if (stat)  stat.textContent  = txt||'';
  if (pctEl) pctEl.textContent = Math.round(pct)+'%';
}

/* ─── open modal helper ────────────────────────────────── */
function _bopOpen(id, titleHtml, bodyHtml, footerHtml) {
  document.getElementById(id)?.remove();
  const html = `
  <div id="${id}" class="bop-modal-bg">
    <div class="bop-modal">
      <div class="bop-header">
        <div class="bop-title">${titleHtml}</div>
        <button class="bop-close-btn" onclick="closeMo('${id}')">&#x2715;</button>
      </div>
      <div class="bop-body">${bodyHtml}</div>
      <div class="bop-footer">${footerHtml}</div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
}

/* ══════════════════════════════════════════════════════════
   MODAL 1 — POST MONTHLY NT/TR ACCRUAL
══════════════════════════════════════════════════════════ */
async function showAccrualModal() {
  const now        = new Date();
  const monthLabel = now.toLocaleString('en-US',{month:'long',year:'numeric'});
  const y = now.getFullYear(), m = now.getMonth()+1;

  const ntTrAll = (window.state?.db||[]).filter(e => {
    const s = (e.status||'').toLowerCase();
    return (s==='non-teaching'||s==='teaching related') && (e.account_status||'active')==='active';
  });

  for (const emp of ntTrAll) {
    if (!emp.records||!emp.records.length) {
      const r = await apiCall('get_records',{employee_id:emp.id},'GET');
      if (r.ok) emp.records = r.records||[];
    }
  }

  const checks = await Promise.all(ntTrAll.map(async emp => {
    const r = await apiCall('check_accrual_status',{employee_id:emp.id,year:y,month:m},'GET');
    return {emp, done: r.ok ? r.applied : false};
  }));

  const done    = checks.filter(x=> x.done).map(x=>x.emp);
  const pending = checks.filter(x=>!x.done).map(x=>x.emp);
  const allDone = pending.length === 0;

  const titleHtml = `<div class="bop-title-icon">&#9745;</div> POST MONTHLY NT/TR ACCRUAL`;

  if (allDone) {
    _bopOpen('accrualMo', titleHtml,
      `<div class="bop-done-screen">
        <div class="bop-done-icon">&#x2705;</div>
        <div class="bop-done-title">ALL DONE FOR ${_bopEsc(monthLabel.toUpperCase())}!</div>
        <p class="bop-done-sub">All ${ntTrAll.length} NT/TR employee(s) already received their accrual this month.</p>
      </div>`,
      `<button class="bop-btn bop-btn-cancel" onclick="closeMo('accrualMo')">&#x2715; Close</button>`
    );
    return;
  }

  const pendingRows = pending.map(e=>_bopRow(e,'&#x23F3;')).join('');
  const doneRows    = done.map(e=>_bopRow(e,'&#x2705;')).join('');

  const body = `
    <div class="bop-stats">
      <div class="bop-stat"><div class="bop-stat-num" style="color:#fbbf24;">${pending.length}</div><div class="bop-stat-lbl">Will Receive</div></div>
      <div class="bop-stat"><div class="bop-stat-num" style="color:#4ade80;">${done.length}</div><div class="bop-stat-lbl">Already Done</div></div>
    </div>
    <div class="bop-info">
      Each of the <strong>${pending.length} pending</strong> employee(s) will receive <strong>+1.25 days</strong> added to both <strong>VL and SL</strong> for <strong>${_bopEsc(monthLabel)}</strong>.
    </div>
    ${_bopSection('accrualPendingList','accrualPendingChev',`Will receive +1.25 days`,pending.length,pendingRows,true)}
    ${_bopSection('accrualDoneList','accrualDoneChev',`Already received this month`,done.length,doneRows,true,'.6')}
    <div class="bop-prog-wrap" id="accrualProgressWrap">
      <div class="bop-prog-track"><div class="bop-fill"></div></div>
      <div class="bop-prog-row"><span class="bop-stat-txt"></span><span class="bop-pct"></span></div>
    </div>
    <div id="accrualResult"></div>`;

  _bopOpen('accrualMo', titleHtml, body,
    `<button class="bop-btn bop-btn-cancel" id="accrualCancelBtn" onclick="closeMo('accrualMo')">&#x2715; Cancel</button>
     <button class="bop-btn bop-btn-primary" id="accrualConfirmBtn">&#9745; Post Accrual for ${pending.length} Employee${pending.length!==1?'s':''}</button>`
  );

  document.getElementById('accrualConfirmBtn').addEventListener('click', async () => {
    const confirmBtn = document.getElementById('accrualConfirmBtn');
    const cancelBtn  = document.getElementById('accrualCancelBtn');
    if (confirmBtn) { confirmBtn.disabled=true; confirmBtn.style.opacity='.5'; }
    if (cancelBtn)  { cancelBtn.disabled=true;  cancelBtn.style.opacity='.4'; }
    document.getElementById('accrualProgressWrap').style.display='block';

    let ok=0, fail=0; const errors=[];

    for (let i=0; i<pending.length; i++) {
      const emp = pending[i];
      _bopProgress('accrualMo', Math.round((i/pending.length)*95),
        `Posting: ${(emp.surname||'').toUpperCase()}, ${emp.given||''} (${i+1}/${pending.length})`);

      const res = await apiCall('save_record',{
        employee_id: emp.id,
        record:{ so:'',prd:monthLabel,from:'',to:'',fromPeriod:'WD',toPeriod:'WD',
          spec:`Monthly Accrual - ${monthLabel}`,action:'Monthly Accrual',
          earned:1.25,forceAmount:0,monAmount:0,monDisAmt:0,
          monV:0,monS:0,monDV:0,monDS:0,trV:0,trS:0 },
      });

      if (res.ok) {
        ok++;
        const r2 = await apiCall('get_records',{employee_id:emp.id},'GET');
        if (r2.ok) emp.records=r2.records||[];
        await saveRowBalances(emp.records,emp.id,emp.status);
        const r3 = await apiCall('get_records',{employee_id:emp.id},'GET');
        if (r3.ok) emp.records=r3.records||[];
        emp.card_status_updated=true;
      } else {
        fail++;
        errors.push(`${(emp.surname||'').toUpperCase()}, ${emp.given}: ${res.error||'Unknown error'}`);
      }
    }

    _bopProgress('accrualMo',100,'Complete!');

    const resultEl = document.getElementById('accrualResult');
    if (resultEl) {
      const isSuccess = fail===0;
      const msg = isSuccess
        ? `&#x2705; Accrual posted for ${ok} employee${ok!==1?'s':''}! Leave cards updated.`
        : `&#x26A0;&#xFE0F; ${ok} succeeded, ${fail} failed:<br>${errors.map(e=>`&bull; ${_bopEsc(e)}`).join('<br>')}`;
      resultEl.innerHTML=`<div class="${isSuccess?'bop-result-ok':'bop-result-err'}">${msg}</div>`;
    }

    const footer = document.querySelector(`#accrualMo .bop-footer`);
    if (footer) footer.innerHTML=`<button class="bop-btn bop-btn-cancel" onclick="closeMo('accrualMo');if(typeof filterCardList==='function')filterCardList();">&#x2713; Close</button>`;
    if (typeof filterCardList==='function') filterCardList();
  });
}

/* ══════════════════════════════════════════════════════════
   MODAL 2 — POST MANDATORY LEAVE (-5 VL)
══════════════════════════════════════════════════════════ */
async function showForceLeaveModal() {
  const now = new Date();
  const y   = now.getFullYear();

  const allActive = (window.state?.db||[]).filter(e=>{
  const s = (e.status||'').toLowerCase();
  return (e.account_status||'active')==='active' && (s==='non-teaching'||s==='teaching related');
});

  for (const emp of allActive) {
    if (!emp.records||!emp.records.length) {
      const r = await apiCall('get_records',{employee_id:emp.id},'GET');
      if (r.ok) emp.records=r.records||[];
    }
  }

  const checks = await Promise.all(allActive.map(async emp => {
    const r = await apiCall('check_force_leave_status',{employee_id:emp.id},'GET');
    return {emp, done: r.ok ? r.applied : false};
  }));

  const done    = checks.filter(x=> x.done).map(x=>x.emp);
  const pending = checks.filter(x=>!x.done).map(x=>x.emp);
  const allDone = pending.length===0;

  const titleHtml = `<div class="bop-title-icon">&#x26A0;</div> POST MANDATORY LEAVE (-5 VL)`;

  if (allDone) {
    _bopOpen('forceMo', titleHtml,
      `<div class="bop-done-screen">
        <div class="bop-done-icon">&#x2705;</div>
        <div class="bop-done-title">ALL DONE FOR ${y}!</div>
        <p class="bop-done-sub">All ${allActive.length} active employee(s) already received the Mandatory Leave deduction for ${y}.</p>
      </div>`,
      `<button class="bop-btn bop-btn-cancel" onclick="closeMo('forceMo')">&#x2715; Close</button>`
    );
    return;
  }

  const pendingRows = pending.map(e=>_bopRow(e,'&#x23F3;')).join('');
  const doneRows    = done.map(e=>_bopRow(e,'&#x2705;')).join('');

  const body = `
    <div class="bop-stats">
      <div class="bop-stat"><div class="bop-stat-num" style="color:#f87171;">${pending.length}</div><div class="bop-stat-lbl">Will Be Deducted</div></div>
      <div class="bop-stat"><div class="bop-stat-num" style="color:#4ade80;">${done.length}</div><div class="bop-stat-lbl">Already Applied</div></div>
    </div>
    <div class="bop-info">
      Each of the <strong>${pending.length} pending</strong> employee(s) will have <strong>5 days DEDUCTED from VL</strong> for <strong>${y}</strong>. <strong style="color:#f87171;">This action is irreversible.</strong>
    </div>
    ${_bopSection('forcePendingList','forcePendingChev',`Will receive -5 VL deduction`,pending.length,pendingRows,true)}
    ${_bopSection('forceDoneList','forceDoneChev',`Already applied this year`,done.length,doneRows,true,'.6')}
    <div class="bop-prog-wrap" id="forceProgressWrap">
      <div class="bop-prog-track"><div class="bop-fill"></div></div>
      <div class="bop-prog-row"><span class="bop-stat-txt"></span><span class="bop-pct"></span></div>
    </div>
    <div id="forceResult"></div>`;

  _bopOpen('forceMo', titleHtml, body,
    `<button class="bop-btn bop-btn-cancel" id="forceCancelBtn" onclick="closeMo('forceMo')">&#x2715; Cancel</button>
     <button class="bop-btn bop-btn-danger" id="forceConfirmBtn">&#x26A0; Deduct -5 VL from ${pending.length} Employee${pending.length!==1?'s':''}</button>`
  );

  document.getElementById('forceConfirmBtn').addEventListener('click', async () => {
    const confirmBtn = document.getElementById('forceConfirmBtn');
    const cancelBtn  = document.getElementById('forceCancelBtn');
    if (confirmBtn) { confirmBtn.disabled=true; confirmBtn.style.opacity='.5'; }
    if (cancelBtn)  { cancelBtn.disabled=true;  cancelBtn.style.opacity='.4'; }
    document.getElementById('forceProgressWrap').style.display='block';

    let ok=0, fail=0; const errors=[];

    for (let i=0; i<pending.length; i++) {
      const emp = pending[i];
      _bopProgress('forceMo', Math.round((i/pending.length)*95),
        `Posting: ${(emp.surname||'').toUpperCase()}, ${emp.given||''} (${i+1}/${pending.length})`);

      const res = await apiCall('apply_force_leave',{employee_id:emp.id,amount:5});

      if (res.ok) {
        ok++;
        const r2 = await apiCall('get_records',{employee_id:emp.id},'GET');
        if (r2.ok) emp.records=r2.records||[];
        await saveRowBalances(emp.records,emp.id,emp.status);
        const r3 = await apiCall('get_records',{employee_id:emp.id},'GET');
        if (r3.ok) emp.records=r3.records||[];
        emp.force_leave_applied=true;
      } else {
        fail++;
        errors.push(`${(emp.surname||'').toUpperCase()}, ${emp.given}: ${res.error||'Unknown error'}`);
      }
    }

    _bopProgress('forceMo',100,'Complete!');

    const resultEl = document.getElementById('forceResult');
    if (resultEl) {
      const isSuccess = fail===0;
      const msg = isSuccess
        ? `&#x2705; Mandatory Leave posted for ${ok} employee${ok!==1?'s':''}! Leave cards updated.`
        : `&#x26A0;&#xFE0F; ${ok} succeeded, ${fail} failed:<br>${errors.map(e=>`&bull; ${_bopEsc(e)}`).join('<br>')}`;
      resultEl.innerHTML=`<div class="${isSuccess?'bop-result-ok':'bop-result-err'}">${msg}</div>`;
    }

    const footer = document.querySelector(`#forceMo .bop-footer`);
    if (footer) footer.innerHTML=`<button class="bop-btn bop-btn-cancel" onclick="closeMo('forceMo');if(typeof filterCardList==='function')filterCardList();">&#x2713; Close</button>`;
    if (typeof filterCardList==='function') filterCardList();
  });
}

/* ─── expose ──────────────────────────────────────────── */
window.postMonthlyAccrual  = showAccrualModal;
window.postMandatoryLeave  = showForceLeaveModal;
window.showAccrualModal    = showAccrualModal;
window.showForceLeaveModal = showForceLeaveModal;
