'use strict';

function _saEsc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function _saCategoryBadge(status) {
  const s = (status || '').toLowerCase();
  if (s === 'teaching')         return `<span class="pl-badge pl-badge--teaching">Teaching</span>`;
  if (s === 'teaching related') return `<span class="pl-badge pl-badge--teaching-related">Teaching Related</span>`;
  return `<span class="pl-badge pl-badge--non-teaching">Non-Teaching</span>`;
}

function _saAccountBadge(status) {
  const isActive = (status || 'active') === 'active';
  return `<span class="pl-account-status pl-account-status--${isActive ? 'active' : 'inactive'}">
    <span class="pl-account-dot pl-account-dot--${isActive ? 'active' : 'inactive'}"></span>
    ${isActive ? 'Active' : 'Inactive'}
  </span>`;
}

// ── INJECT CSS ────────────────────────────────────────────────────────────
(function injectSADashCSS() {
  if (document.getElementById('sa-dash-css')) return;
  const s = document.createElement('style');
  s.id = 'sa-dash-css';
  s.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');

.sa-dash {
  font-family: 'DM Sans', sans-serif;
  padding: 20px 24px;
  animation: sa-fade-in .45s ease both;
  width: 100%; max-width: 100%;
  margin: 0; box-sizing: border-box;
}
@keyframes sa-fade-in {
  from { opacity:0; transform:translateY(14px); }
  to   { opacity:1; transform:none; }
}

/* ── HERO ─────────────────────────────────────────────── */
.sa-hero {
  position:relative; overflow:hidden;
  background:linear-gradient(130deg,#0d0000 0%,#2a0404 30%,#5a0a0a 65%,#8b1a1a 100%);
  border-radius:20px; padding:44px 50px 48px; margin-bottom:24px;
  color:#fff;
  box-shadow:0 16px 56px rgba(139,26,26,.5),0 2px 8px rgba(0,0,0,.3),
             inset 0 1px 0 rgba(255,180,120,.12),inset 0 -1px 0 rgba(0,0,0,.4);
  border:1px solid rgba(180,60,60,.3);
}
.sa-hero::after {
  content:''; position:absolute; inset:0;
  background-image:
    repeating-linear-gradient(90deg,transparent,transparent 48px,rgba(255,255,255,.018) 48px,rgba(255,255,255,.018) 49px),
    repeating-linear-gradient(0deg,transparent,transparent 48px,rgba(255,255,255,.018) 48px,rgba(255,255,255,.018) 49px);
  pointer-events:none; border-radius:20px;
}
.sa-hero-bg { position:absolute; inset:0; background:url('https://depedkoronadalcity.wordpress.com/wp-content/uploads/2012/09/city-division-office1.jpg') center/cover no-repeat; opacity:.04; }
.sa-hero-grain { position:absolute; inset:0; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.025'/%3E%3C/svg%3E"); pointer-events:none; }
.sa-hero-rivets { position:absolute; inset:0; pointer-events:none; }
.sa-hero-rivets::before,.sa-hero-rivets::after { content:''; position:absolute; width:8px; height:8px; border-radius:50%; background:radial-gradient(circle at 35% 35%,rgba(255,200,120,.6),rgba(180,60,30,.4)); box-shadow:0 1px 3px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,220,150,.3); }
.sa-hero-rivets::before { top:16px; left:16px; }
.sa-hero-rivets::after  { top:16px; right:16px; }
.sa-hero-orbs { position:absolute; inset:0; pointer-events:none; }
.sa-orb { position:absolute; border-radius:50%; filter:blur(80px); }
.sa-orb1 { width:400px; height:400px; background:#9b1818; opacity:.25; top:-120px; right:-100px; }
.sa-orb2 { width:240px; height:240px; background:#6b1a04; opacity:.2; bottom:-80px; left:6%; }
.sa-orb3 { width:180px; height:180px; background:#4a0c08; opacity:.28; top:25%; right:20%; }
.sa-hero-content { position:relative; z-index:2; display:flex; align-items:center; justify-content:space-between; gap:24px; flex-wrap:wrap; }
.sa-hero-left { flex:1; min-width:260px; }
.sa-hero-eyebrow { display:inline-flex; align-items:center; gap:8px; font-size:9px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:rgba(255,200,140,.5); margin-bottom:16px; }
.sa-hero-pulse { width:6px; height:6px; border-radius:50%; background:#f09070; animation:sa-pulse 2s infinite; box-shadow:0 0 6px rgba(240,144,112,.6); }
@keyframes sa-pulse { 0%,100%{opacity:1;transform:scale(1);box-shadow:0 0 6px rgba(240,144,112,.6);}50%{opacity:.5;transform:scale(1.6);box-shadow:0 0 14px rgba(240,144,112,.3);} }
.sa-hero-title { font-family:'Playfair Display',Georgia,serif; font-size:2.8rem; font-weight:900; line-height:1.06; margin-bottom:12px; letter-spacing:-.5px; text-shadow:0 2px 16px rgba(0,0,0,.5); }
.sa-hero-name { background:linear-gradient(90deg,#ffd0a0,#f0a060,#d06040,#e08050); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; filter:drop-shadow(0 2px 8px rgba(200,80,40,.4)); }
.sa-hero-meta { font-size:.8rem; color:rgba(255,200,150,.4); margin-top:6px; }
.sa-hero-right { display:flex; flex-direction:column; gap:10px; flex-shrink:0; }
.sa-quick-tile { display:flex; align-items:center; gap:12px; background:rgba(255,255,255,.06); border:1px solid rgba(255,160,100,.15); border-radius:12px; padding:12px 18px; cursor:pointer; transition:background .2s,transform .2s,border-color .2s; min-width:200px; box-shadow:inset 0 1px 0 rgba(255,200,120,.08),0 2px 8px rgba(0,0,0,.2); }
.sa-quick-tile:hover { background:rgba(255,255,255,.12); border-color:rgba(255,160,100,.3); transform:translateX(-3px); }
.sa-quick-tile-icon { font-size:20px; }
.sa-quick-tile-text { font-size:11.5px; font-weight:600; color:rgba(255,220,180,.9); }
.sa-quick-tile-sub  { font-size:9.5px; color:rgba(255,180,130,.4); margin-top:1px; }

/* ── STAT CARDS ───────────────────────────────────────── */
.sa-stats { display:grid; grid-template-columns:repeat(5,1fr); gap:14px; margin-bottom:6px; }
@media(max-width:1100px){ .sa-stats{ grid-template-columns:repeat(3,1fr); } }
@media(max-width:650px)  { .sa-stats{ grid-template-columns:repeat(2,1fr); } }
.sa-stat {
  background:linear-gradient(160deg,#fff 0%,#fdf7f7 100%);
  border-radius:16px; border:1px solid #e8d0d0;
  padding:20px 18px; display:flex; flex-direction:column; gap:6px;
  position:relative; overflow:hidden;
  box-shadow:0 2px 12px rgba(139,26,26,.07),0 1px 3px rgba(0,0,0,.06);
  transition:transform .22s,box-shadow .22s; cursor:default;
}
.sa-stat:hover { transform:translateY(-5px); box-shadow:0 12px 36px rgba(139,26,26,.18),0 2px 8px rgba(0,0,0,.08); }
.sa-stat::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,var(--ds-accent,#8b1a1a),color-mix(in srgb,var(--ds-accent,#8b1a1a) 60%,#fff)); border-radius:3px 3px 0 0; }
.sa-stat::after { content:''; position:absolute; top:10px; right:12px; width:5px; height:5px; border-radius:50%; background:radial-gradient(circle at 35% 35%,rgba(255,200,120,.5),var(--ds-accent,#8b1a1a)); opacity:.35; }
.sa-stat.clickable { cursor:pointer; }
.sa-stat.clickable:hover { background:linear-gradient(160deg,var(--ds-soft,#fff0f0),#fff); }
.sa-stat.active-filter { background:var(--ds-soft,#fff0f0); box-shadow:0 0 0 2px var(--ds-accent,#8b1a1a),0 10px 32px rgba(139,26,26,.2); }
.sa-stat-icon { width:44px; height:44px; border-radius:12px; background:var(--ds-soft,#fce8e8); display:flex; align-items:center; justify-content:center; font-size:20px; margin-bottom:4px; box-shadow:inset 0 1px 2px rgba(0,0,0,.06),0 1px 4px rgba(139,26,26,.1); }
.sa-stat-num { font-family:'Playfair Display',Georgia,serif; font-size:2rem; font-weight:800; color:var(--ds-accent,#1a1a2e); line-height:1; transition:transform .3s; }
.sa-stat-label { font-size:10px; font-weight:600; color:#7a8a9d; text-transform:uppercase; letter-spacing:.7px; }
.sa-stat-chevron { position:absolute; right:14px; top:50%; transform:translateY(-50%); font-size:20px; color:var(--ds-accent,#8b1a1a); opacity:.25; transition:opacity .2s,transform .2s; }
.sa-stat.active-filter .sa-stat-chevron { opacity:.7; transform:translateY(-50%) rotate(90deg); }
.sa-stat-glow { position:absolute; bottom:-24px; right:-24px; width:90px; height:90px; border-radius:50%; background:var(--ds-accent,#8b1a1a); opacity:.06; pointer-events:none; }

/* ── FUN CLICK EFFECTS ─────────────────────────────────── */
@keyframes sa-shockwave { 0%{transform:scale(0);opacity:.7;} 80%{transform:scale(4);opacity:.1;} 100%{transform:scale(5);opacity:0;} }
.sa-shockwave { position:absolute; inset:0; border-radius:16px; background:radial-gradient(circle,rgba(255,80,40,.35) 0%,transparent 70%); pointer-events:none; animation:sa-shockwave .5s ease-out forwards; z-index:10; }
@keyframes sa-shard-fly { 0%{transform:translate(0,0) rotate(0deg) scale(1);opacity:1;} 100%{transform:translate(var(--tx),var(--ty)) rotate(var(--tr)) scale(0);opacity:0;} }
.sa-shard { position:fixed; width:10px; height:5px; border-radius:2px; background:linear-gradient(90deg,#c83030,#e05020); pointer-events:none; z-index:99999; animation:sa-shard-fly .65s cubic-bezier(.22,1,.36,1) forwards; box-shadow:0 0 6px rgba(200,50,20,.6); }
.sa-shard-gold { background:linear-gradient(90deg,#f0b030,#ffd060); box-shadow:0 0 6px rgba(240,176,48,.6); }
@keyframes sa-num-bounce { 0%{transform:scale(1);} 30%{transform:scale(1.45) rotate(-4deg);} 60%{transform:scale(0.85) rotate(3deg);} 80%{transform:scale(1.12) rotate(-1deg);} 100%{transform:scale(1);} }
.sa-num-bounce { animation:sa-num-bounce .55s cubic-bezier(.22,1,.36,1); }
.sa-emoji-float { position:fixed; font-size:22px; pointer-events:none; z-index:99999; animation:sa-emoji-up .9s cubic-bezier(.22,1,.36,1) forwards; }
@keyframes sa-emoji-up { 0%{opacity:1;transform:translateY(0) scale(1) rotate(0deg);} 100%{opacity:0;transform:translateY(-90px) scale(1.6) rotate(var(--er,20deg));} }
.sa-firework { position:fixed; width:6px; height:6px; border-radius:50%; pointer-events:none; z-index:99999; animation:sa-firework-fly .8s cubic-bezier(.22,1,.36,1) forwards; }
@keyframes sa-firework-fly { 0%{transform:translate(0,0) scale(1);opacity:1;} 100%{transform:translate(var(--fx),var(--fy)) scale(0);opacity:0;} }
.sa-stat-tooltip { position:absolute; bottom:calc(100% + 8px); left:50%; transform:translateX(-50%); background:#1a0808; color:#fff; font-size:10px; font-weight:600; letter-spacing:.3px; padding:5px 12px; border-radius:8px; white-space:nowrap; z-index:20; pointer-events:none; animation:sa-tip-in .2s ease both; box-shadow:0 4px 16px rgba(0,0,0,.3); }
.sa-stat-tooltip::after { content:''; position:absolute; top:100%; left:50%; transform:translateX(-50%); border:5px solid transparent; border-top-color:#1a0808; }
@keyframes sa-tip-in { from{opacity:0;transform:translateX(-50%) translateY(4px);}to{opacity:1;transform:translateX(-50%) translateY(0);} }

/* ── DROPDOWN PANELS ─────────────────────────────────── */
.sa-dropdown { background:#fff; border:1px solid #e8d0d0; border-radius:14px; box-shadow:0 8px 32px rgba(139,26,26,.14),0 2px 8px rgba(0,0,0,.08); margin-bottom:20px; overflow:hidden; animation:sa-drop-in .25s cubic-bezier(.22,1,.36,1); }
@keyframes sa-drop-in { from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none} }
.sa-dropdown-head { padding:12px 20px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid #f0e0e0; background:linear-gradient(90deg,#fdf0f0,#fff); }
.sa-dropdown-title { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.8px; color:#3a0808; display:flex; align-items:center; gap:8px; }
.sa-dropdown-badge { background:#fce8e8; color:#8b1a1a; font-size:10px; font-weight:800; border-radius:20px; padding:2px 10px; }
.sa-dropdown-badge.green { background:#d1fae5; color:#065f46; }
.sa-dropdown-badge.blue  { background:#dbeafe; color:#1e40af; }
.sa-dropdown-close { background:none; border:none; color:#aaa; font-size:18px; cursor:pointer; padding:2px 6px; border-radius:5px; line-height:1; transition:color .15s,background .15s; }
.sa-dropdown-close:hover { color:#333; background:#f0e8e8; }
.sa-dropdown-body { max-height:320px; overflow-y:auto; }
.sa-dropdown-body::-webkit-scrollbar { width:4px; }
.sa-dropdown-body::-webkit-scrollbar-thumb { background:#e0c8c8; border-radius:4px; }
.sa-emp-row { display:flex; align-items:center; gap:10px; padding:11px 20px; border-bottom:1px solid #faf2f2; }
.sa-emp-row:last-child { border-bottom:none; }
.sa-emp-avatar { width:34px; height:34px; border-radius:10px; background:linear-gradient(135deg,#7a1010,#c02828); color:white; font-size:12px; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow:0 2px 6px rgba(139,26,26,.3); }
.sa-emp-info { flex:1; min-width:0; }
.sa-emp-name  { font-size:12.5px; font-weight:600; color:#1a1a2e; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.sa-emp-school{ font-size:10.5px; color:#7a8a9d; margin-top:1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.sa-emp-badge-wrap { flex-shrink:0; }
.sa-panel-empty { padding:32px 20px; text-align:center; font-size:12.5px; color:#7a8a9d; }
.sa-panel-empty span { display:block; font-size:28px; margin-bottom:8px; }

/* ── CONTENT ROW ─────────────────────────────────────── */
.sa-content-row { display:grid; grid-template-columns:1fr 1fr 1fr; gap:20px; margin-bottom:24px; align-items:stretch; width:100%; }
@media(max-width:1000px){ .sa-content-row{grid-template-columns:1fr 1fr;} }
@media(max-width:650px) { .sa-content-row{grid-template-columns:1fr;} }
.sa-progress-card,.sa-cat-card,.sa-activity-card { background:linear-gradient(160deg,#ffffff 0%,#fdf8f8 100%); border-radius:16px; border:1px solid #e8d0d0; box-shadow:0 2px 12px rgba(139,26,26,.07),0 1px 3px rgba(0,0,0,.05); padding:24px 22px; min-width:0; height:100%; box-sizing:border-box; display:flex; flex-direction:column; position:relative; overflow:hidden; }
.sa-progress-card::before,.sa-cat-card::before,.sa-activity-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#8b1a1a,#d43030,#8b1a1a); opacity:.5; }
.sa-card-title { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.8px; color:#3a0808; margin-bottom:20px; display:flex; align-items:center; gap:8px; flex-shrink:0; }
.sa-card-title-dot { width:6px; height:6px; border-radius:50%; background:#8b1a1a; flex-shrink:0; box-shadow:0 0 4px rgba(139,26,26,.5); }
.sa-ring-wrap { display:flex; justify-content:center; margin-bottom:20px; flex:1; align-items:center; }
.sa-ring-track { fill:none; stroke:#f0e0e0; stroke-width:10; }
.sa-ring-fill  { fill:none; stroke:url(#saRingGrad); stroke-width:10; stroke-linecap:round; transition:stroke-dashoffset 1.2s cubic-bezier(.22,1,.36,1); transform:rotate(-90deg); transform-origin:60px 60px; }
.sa-ring-label { font-family:'Playfair Display',Georgia,serif; font-size:28px; font-weight:800; fill:#8b1a1a; }
.sa-ring-sub   { font-size:10px; fill:#7a8a9d; font-weight:600; }
.sa-legend { display:flex; flex-direction:column; gap:10px; flex-shrink:0; }
.sa-legend-row { display:flex; align-items:center; gap:10px; }
.sa-legend-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
.sa-legend-text { font-size:12px; color:#4a4a5a; flex:1; }
.sa-legend-val  { font-size:12px; font-weight:700; color:#1a1a2e; }
.sa-bar-row { display:flex; flex-direction:column; gap:14px; flex:1; justify-content:space-between; }
.sa-bar-label-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:5px; }
.sa-bar-name  { font-size:11.5px; font-weight:600; color:#3a0808; }
.sa-bar-count { font-size:11px; font-weight:700; color:#7a8a9d; }
.sa-bar-track { background:#f0e4e4; border-radius:99px; height:8px; overflow:hidden; }
.sa-bar-fill  { height:100%; border-radius:99px; transition:width 1.1s cubic-bezier(.22,1,.36,1); }
.sa-bar-fill.t  { background:linear-gradient(90deg,#1e3a6e,#4a7cc7); }
.sa-bar-fill.nt { background:linear-gradient(90deg,#7a1010,#c83030); }
.sa-bar-fill.tr { background:linear-gradient(90deg,#7c2d12,#ea7b3a); }
.sa-activity-list { display:flex; flex-direction:column; gap:0; flex:1; }
.sa-activity-item { display:flex; align-items:flex-start; gap:12px; padding:10px 0; border-bottom:1px solid #faf2f2; position:relative; flex:1; }
.sa-activity-item:last-child { border-bottom:none; }
.sa-activity-dot  { width:8px; height:8px; border-radius:50%; flex-shrink:0; margin-top:5px; box-shadow:0 0 4px currentColor; }
.sa-activity-body { flex:1; min-width:0; }
.sa-activity-label { font-size:12px; font-weight:600; color:#1a1a2e; line-height:1.4; }
.sa-activity-sub   { font-size:10.5px; color:#7a8a9d; margin-top:2px; }
.sa-activity-val   { font-size:11px; font-weight:700; color:#8b1a1a; flex-shrink:0; align-self:center; }
.sa-month-badge { display:inline-flex; align-items:center; gap:6px; background:linear-gradient(90deg,#fce8e8,#fff5f5); border:1px solid #e8d0d0; border-radius:8px; padding:5px 12px; font-size:10.5px; font-weight:700; color:#8b1a1a; margin-bottom:20px; letter-spacing:.3px; box-shadow:inset 0 1px 0 rgba(255,255,255,.8); }

/* ── WHY SECTION ─────────────────────────────────────── */
.sa-why { background:linear-gradient(145deg,#080c12 0%,#150404 50%,#0e0a0a 100%); border-radius:20px; padding:48px 44px; margin-bottom:24px; position:relative; overflow:hidden; box-shadow:0 10px 48px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,160,100,.1),inset 0 -1px 0 rgba(0,0,0,.5); border:1px solid rgba(140,40,30,.3); }
.sa-why-pattern { position:absolute; inset:0; opacity:.7; pointer-events:none; background-image:radial-gradient(circle at 1px 1px,rgba(255,255,255,.035) 1px,transparent 0),repeating-linear-gradient(90deg,transparent,transparent 80px,rgba(180,60,40,.06) 80px,rgba(180,60,40,.06) 81px); background-size:28px 28px,100% 100%; }
.sa-why-inner { position:relative; z-index:1; }
.sa-why-eyebrow { font-size:9px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:#e08050; margin-bottom:8px; text-shadow:0 0 12px rgba(224,128,80,.4); }
.sa-why-title { font-family:'Playfair Display',Georgia,serif; font-size:2.1rem; font-weight:800; color:#fff; margin-bottom:32px; letter-spacing:-.3px; text-shadow:0 2px 16px rgba(0,0,0,.5); }
.sa-why-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(210px,1fr)); gap:16px; }
.sa-why-card { background:rgba(255,255,255,.03); border:1px solid rgba(200,80,60,.15); border-radius:14px; padding:24px 22px; backdrop-filter:blur(8px); transition:background .22s,transform .22s,border-color .22s; position:relative; cursor:pointer; }
.sa-why-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,rgba(200,80,60,.4),transparent); border-radius:14px 14px 0 0; }
.sa-why-card:hover { background:rgba(255,255,255,.07); border-color:rgba(200,80,60,.3); transform:translateY(-4px); }
.sa-why-card-icon { font-size:30px; margin-bottom:14px; }
.sa-why-card h3 { font-size:13px; font-weight:700; color:#f8c880; margin-bottom:8px; }
.sa-why-card p  { font-size:11.5px; color:rgba(255,255,255,.5); line-height:1.75; }

/* ── DEVELOPERS TEASER CARD ──────────────────────────── */
.sa-devs-teaser {
  position:relative; overflow:hidden;
  background:linear-gradient(145deg,#fff0f8 0%,#ffe4f2 35%,#ffd6ee 70%,#ffe8f4 100%);
  border:2px solid #f9b8d8; border-radius:20px;
  padding:28px 40px; margin-bottom:20px;
  box-shadow:0 10px 48px rgba(240,80,160,.14),0 2px 10px rgba(220,60,140,.08);
  display:flex; align-items:center; justify-content:space-between; gap:24px; flex-wrap:wrap;
  cursor:pointer; transition:transform .25s,box-shadow .25s;
}
.sa-devs-teaser:hover { transform:translateY(-4px); box-shadow:0 18px 60px rgba(240,80,160,.22); }
.sa-devs-teaser-blobs { position:absolute; inset:0; pointer-events:none; overflow:hidden; }
.sa-teaser-blob { position:absolute; border-radius:50%; filter:blur(60px); }
.sa-teaser-blob1 { width:260px; height:260px; background:#ffb3d9; opacity:.3; top:-80px; right:-60px; }
.sa-teaser-blob2 { width:180px; height:180px; background:#ff9ec8; opacity:.2; bottom:-60px; left:-40px; }
.sa-devs-teaser-left { position:relative; z-index:1; }
.sa-devs-teaser-eyebrow { font-size:9px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:#d44090; margin-bottom:6px; }
.sa-devs-teaser-title { font-family:'Playfair Display',Georgia,serif; font-size:1.9rem; font-weight:800; background:linear-gradient(100deg,#c01870,#e84090,#d02080); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin-bottom:6px; }
.sa-devs-teaser-sub { font-size:12px; color:#c05090; }
.sa-devs-teaser-right { position:relative; z-index:1; display:flex; align-items:center; gap:16px; }
.sa-devs-teaser-avatars { display:flex; }
.sa-devs-teaser-avatar { width:56px; height:56px; border-radius:50%; object-fit:cover; object-position:top center; border:3px solid #fff; box-shadow:0 4px 14px rgba(230,60,140,.3); background:#ffe0f0; margin-left:-14px; transition:transform .2s; }
.sa-devs-teaser-avatar:first-child { margin-left:0; }
.sa-devs-teaser-avatars:hover .sa-devs-teaser-avatar { transform:translateY(-4px); }
.sa-devs-teaser-btn { background:linear-gradient(135deg,#e84090,#c01870); color:#fff; border:none; border-radius:12px; padding:10px 22px; font-size:11.5px; font-weight:700; letter-spacing:.4px; cursor:pointer; transition:transform .2s,box-shadow .2s; box-shadow:0 4px 16px rgba(200,40,120,.3); white-space:nowrap; }
.sa-devs-teaser-btn:hover { transform:scale(1.06); box-shadow:0 8px 24px rgba(200,40,120,.4); }
@keyframes sa-heartbeat { 0%,100%{transform:scale(1)}50%{transform:scale(1.14)} }

/* ── DEVELOPERS MODAL ────────────────────────────────── */
.sa-devs-overlay {
  position:fixed; inset:0; z-index:99990;
  background:rgba(10,0,10,.75); backdrop-filter:blur(12px);
  display:flex; align-items:center; justify-content:center;
  padding:20px; animation:sa-overlay-in .3s ease both;
}
@keyframes sa-overlay-in { from{opacity:0;} to{opacity:1;} }
.sa-devs-modal {
  position:relative; z-index:99991;
  background:linear-gradient(145deg,#fff0f8 0%,#ffe4f2 40%,#ffd6ee 75%,#ffe8f4 100%);
  border:2px solid #f9b8d8; border-radius:28px;
  padding:48px 44px 44px; width:100%; max-width:720px;
  box-shadow:0 32px 96px rgba(240,60,160,.25),0 4px 20px rgba(0,0,0,.15);
  animation:sa-modal-pop .4s cubic-bezier(.22,1,.36,1) both;
  overflow:hidden; max-height:90vh; overflow-y:auto;
}
@keyframes sa-modal-pop { from{opacity:0;transform:scale(.85) translateY(30px);} to{opacity:1;transform:none;} }
.sa-devs-modal-blobs { position:absolute; inset:0; pointer-events:none; overflow:hidden; }
.sa-modal-blob { position:absolute; border-radius:50%; filter:blur(70px); }
.sa-modal-blob1 { width:380px; height:380px; background:#ffb3d9; opacity:.3; top:-120px; right:-100px; }
.sa-modal-blob2 { width:280px; height:280px; background:#ff9ec8; opacity:.22; bottom:-90px; left:-70px; }
.sa-modal-blob3 { width:200px; height:200px; background:#ffd6ec; opacity:.3; top:40%; left:30%; }
.sa-devs-modal-close {
  position:absolute; top:18px; right:22px; z-index:10;
  background:rgba(255,255,255,.7); border:1.5px solid #f9b8d8; color:#c01870;
  width:34px; height:34px; border-radius:50%; font-size:16px; font-weight:800;
  cursor:pointer; display:flex; align-items:center; justify-content:center;
  transition:background .2s,transform .2s; box-shadow:0 2px 8px rgba(200,40,120,.2);
}
.sa-devs-modal-close:hover { background:#fff; transform:rotate(90deg) scale(1.1); }
.sa-devs-modal-eyebrow { position:relative; z-index:1; font-size:9px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:#d44090; margin-bottom:6px; text-align:center; }
.sa-devs-modal-title { position:relative; z-index:1; font-family:'Playfair Display',Georgia,serif; font-size:2.4rem; font-weight:800; background:linear-gradient(100deg,#c01870,#e84090,#d02080); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin-bottom:4px; text-align:center; }
.sa-devs-modal-sub { position:relative; z-index:1; font-size:12.5px; color:#c05090; margin-bottom:36px; text-align:center; }

/* ── EQUAL DEV CARDS ─────────────────────────────────── */
.sa-devs-grid {
  position:relative; z-index:1;
  display:grid; grid-template-columns:1fr 1fr; gap:24px;
}
@media(max-width:560px){ .sa-devs-grid{ grid-template-columns:1fr; } }

.sa-dev-card {
  background:#fff; border-radius:22px;
  overflow:hidden;
  box-shadow:0 8px 36px rgba(230,60,140,.18),0 1px 6px rgba(210,40,120,.1);
  border:2px solid #ffc8e0;
  transition:transform .3s cubic-bezier(.22,1,.36,1),box-shadow .3s;
  position:relative; cursor:pointer;
  /* Equal height */
  display:flex; flex-direction:column;
}
.sa-dev-card:hover { transform:translateY(-8px) rotate(.3deg); box-shadow:0 24px 60px rgba(230,60,140,.28); }

/* Tilt on hover via JS */
.sa-dev-card.tilting { transition:none; }

.sa-dev-ribbon { height:88px; background:linear-gradient(135deg,#ffd6ec 0%,#ffb0ce 100%); position:relative; flex-shrink:0; }
.sa-dev-shimmer { position:absolute; inset:-100%; background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.5) 50%,transparent 60%); animation:sa-shimmer 3.5s 1s infinite; }
@keyframes sa-shimmer { 0%{transform:translateX(-60%) translateY(-60%);}100%{transform:translateX(60%) translateY(60%);} }

.sa-dev-avatar-wrap { position:relative; z-index:1; width:110px; height:110px; margin:-55px auto 14px; }
.sa-dev-avatar {
  width:110px; height:110px; border-radius:50%;
  object-fit:cover; object-position:top center;
  border:4px solid #fff; box-shadow:0 6px 24px rgba(230,60,140,.3);
  background:#ffe0f0; display:block;
  transition:transform .3s cubic-bezier(.22,1,.36,1);
}
.sa-dev-card:hover .sa-dev-avatar { transform:scale(1.08) rotate(-2deg); }
.sa-dev-ring { position:absolute; inset:-5px; border-radius:50%; background:conic-gradient(#ff80b8,#ff40a0,#e8208e,#ff40a0,#ff80b8); z-index:-1; animation:sa-spin 7s linear infinite; }
@keyframes sa-spin { to{transform:rotate(360deg)} }

/* Rainbow ring on hover */
.sa-dev-card:hover .sa-dev-ring { animation:sa-spin .8s linear infinite; }

.sa-dev-content { padding:0 22px 24px; flex:1; display:flex; flex-direction:column; align-items:center; text-align:center; }
.sa-dev-tag { display:inline-block; background:linear-gradient(90deg,#ffd6ec,#ffb0d8); color:#b01860; font-size:9px; font-weight:800; letter-spacing:1.2px; text-transform:uppercase; padding:4px 12px; border-radius:20px; margin-bottom:8px; }
.sa-dev-name { font-family:'Playfair Display',Georgia,serif; font-size:1.2rem; font-weight:800; color:#7a1040; margin-bottom:8px; line-height:1.2; }
.sa-dev-bio  { font-size:11px; color:#a04878; line-height:1.75; margin-bottom:14px; flex:1; }
.sa-dev-skills { display:flex; flex-wrap:wrap; gap:5px; justify-content:center; margin-bottom:12px; }
.sa-dev-skill { background:#ffe0f0; color:#b02060; border:1px solid #ffb8d8; font-size:9px; font-weight:700; letter-spacing:.3px; padding:3px 9px; border-radius:20px; }
.sa-dev-hearts { font-size:16px; letter-spacing:4px; animation:sa-heartbeat 2.2s ease-in-out infinite; }

/* ── PHOTO CLICK EFFECTS ─────────────────────────────── */
/* Confetti burst from photo */
.sa-photo-confetti {
  position:fixed; width:8px; height:8px; border-radius:50%;
  pointer-events:none; z-index:99999;
  animation:sa-confetti-fly .8s cubic-bezier(.22,1,.36,1) forwards;
}
@keyframes sa-confetti-fly {
  0%   { transform:translate(0,0) scale(1) rotate(0deg); opacity:1; }
  100% { transform:translate(var(--cx),var(--cy)) scale(0) rotate(var(--cr,360deg)); opacity:0; }
}
/* Sparkle ring around photo */
@keyframes sa-sparkle-ring {
  0%   { transform:scale(.5); opacity:1; }
  100% { transform:scale(2.5); opacity:0; }
}
.sa-sparkle-ring {
  position:absolute; inset:-4px; border-radius:50%;
  border:3px solid #ff80b8; pointer-events:none;
  animation:sa-sparkle-ring .6s ease-out forwards;
  z-index:5;
}
/* Star burst */
.sa-star-burst {
  position:fixed; font-size:20px; pointer-events:none; z-index:99999;
  animation:sa-star-up .8s cubic-bezier(.22,1,.36,1) forwards;
}
@keyframes sa-star-up {
  0%   { opacity:1; transform:translateY(0) scale(1); }
  100% { opacity:0; transform:translateY(var(--sy,-80px)) scale(1.8) rotate(var(--sr,30deg)); }
}
/* Wobble animation */
@keyframes sa-card-wobble {
  0%,100% { transform:translateY(-8px) rotate(.3deg); }
  25%     { transform:translateY(-8px) rotate(-3deg) scale(1.03); }
  50%     { transform:translateY(-8px) rotate(3deg)  scale(1.03); }
  75%     { transform:translateY(-8px) rotate(-2deg) scale(1.01); }
}
.sa-dev-card.wobbling { animation:sa-card-wobble .5s ease; }

/* ── MODAL FOOTER ────────────────────────────────────── */
.sa-devs-modal-footer { position:relative; z-index:1; display:flex; align-items:center; gap:16px; margin-top:28px; }
.sa-devs-footer-line { flex:1; height:1px; background:linear-gradient(90deg,transparent,#f0a0cc,transparent); }
.sa-devs-footer-text { font-size:10px; color:#c06090; white-space:nowrap; font-weight:600; letter-spacing:.4px; }

@media(max-width:700px){
  .sa-hero{padding:26px 22px;} .sa-hero-title{font-size:1.9rem;}
  .sa-why{padding:30px 20px;} .sa-why-title{font-size:1.5rem;}
  .sa-devs-teaser{padding:20px;} .sa-devs-modal{padding:32px 18px 28px;}
  .sa-devs-modal-title{font-size:1.8rem;}
  .sa-hero-right{display:none;} .sa-dash{padding:12px 14px;}
}
`;
  document.head.appendChild(s);
})();

// ── EFFECTS ──────────────────────────────────────────────────────────────
function _saExplode(el, variant) {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width  / 2;
  const cy = rect.top  + rect.height / 2;
  for (let i = 0; i < 14; i++) {
    const shard = document.createElement('div');
    shard.className = 'sa-shard' + (variant === 'gold' ? ' sa-shard-gold' : '');
    const angle = (i / 14) * 360, dist = 60 + Math.random() * 80;
    const rad = angle * Math.PI / 180;
    const tx = Math.cos(rad) * dist, ty = Math.sin(rad) * dist;
    const tr = (Math.random() - 0.5) * 720;
    shard.style.cssText = `left:${cx}px;top:${cy}px;--tx:${tx}px;--ty:${ty}px;--tr:${tr}deg;`;
    document.body.appendChild(shard);
    setTimeout(() => shard.remove(), 700);
  }
  const wave = document.createElement('div');
  wave.className = 'sa-shockwave';
  el.appendChild(wave);
  setTimeout(() => wave.remove(), 500);
}

function _saFloatEmoji(el, emojis) {
  const rect = el.getBoundingClientRect();
  const selected = emojis[Math.floor(Math.random() * emojis.length)];
  const floater = document.createElement('div');
  floater.className = 'sa-emoji-float';
  floater.textContent = selected;
  const ox = (Math.random() - 0.5) * 60;
  floater.style.cssText = `left:${rect.left + rect.width/2 + ox}px;top:${rect.top}px;--er:${(Math.random()-.5)*40}deg;`;
  document.body.appendChild(floater);
  setTimeout(() => floater.remove(), 1000);
}

function _saFireworks(el, color) {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
  for (let i = 0; i < 18; i++) {
    const fw = document.createElement('div');
    fw.className = 'sa-firework';
    const angle = (i / 18) * 360, dist = 50 + Math.random() * 70;
    const rad = angle * Math.PI / 180;
    fw.style.cssText = `left:${cx}px;top:${cy}px;--fx:${Math.cos(rad)*dist}px;--fy:${Math.sin(rad)*dist}px;background:${color || '#f0b030'};`;
    document.body.appendChild(fw);
    setTimeout(() => fw.remove(), 900);
  }
}

function _saBounceNum(el) {
  const numEl = el.querySelector('.sa-stat-num');
  if (!numEl) return;
  numEl.classList.remove('sa-num-bounce');
  void numEl.offsetWidth;
  numEl.classList.add('sa-num-bounce');
  setTimeout(() => numEl.classList.remove('sa-num-bounce'), 600);
}

function _saShowTooltip(el, text) {
  el.querySelectorAll('.sa-stat-tooltip').forEach(t => t.remove());
  const tip = document.createElement('div');
  tip.className = 'sa-stat-tooltip';
  tip.textContent = text;
  el.style.position = 'relative';
  el.appendChild(tip);
  setTimeout(() => tip.remove(), 2200);
}

// ── PHOTO CARD INTERACTIONS ───────────────────────────────────────────────
function _saWireDevCard(card, confettiColors, starEmojis) {
  const avatarWrap = card.querySelector('.sa-dev-avatar-wrap');
  const avatar     = card.querySelector('.sa-dev-avatar');
  if (!avatar || !avatarWrap) return;

  // Tilt on mousemove
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-8px) rotateY(${x * 14}deg) rotateX(${-y * 10}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });

  // Click photo → confetti + sparkle + stars
  avatar.addEventListener('click', (e) => {
    e.stopPropagation();
    const rect = avatarWrap.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;

    // Sparkle ring
    const ring = document.createElement('div');
    ring.className = 'sa-sparkle-ring';
    avatarWrap.appendChild(ring);
    setTimeout(() => ring.remove(), 700);

    // Confetti burst
    for (let i = 0; i < 22; i++) {
      const c = document.createElement('div');
      c.className = 'sa-photo-confetti';
      c.style.background = confettiColors[i % confettiColors.length];
      const angle = (i / 22) * 360 + Math.random() * 16;
      const dist  = 50 + Math.random() * 90;
      const rad   = angle * Math.PI / 180;
      c.style.cssText += `left:${cx}px;top:${cy}px;--cx:${Math.cos(rad)*dist}px;--cy:${Math.sin(rad)*dist}px;--cr:${(Math.random()-.5)*720}deg;`;
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 900);
    }

    // Star emojis floating up
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const star = document.createElement('div');
        star.className = 'sa-star-burst';
        star.textContent = starEmojis[Math.floor(Math.random() * starEmojis.length)];
        const ox = (Math.random() - 0.5) * 80;
        star.style.cssText = `left:${cx + ox}px;top:${cy}px;--sy:${-(60+Math.random()*50)}px;--sr:${(Math.random()-.5)*60}deg;`;
        document.body.appendChild(star);
        setTimeout(() => star.remove(), 900);
      }, i * 80);
    }

    // Wobble the card
    card.classList.remove('wobbling');
    void card.offsetWidth;
    card.classList.add('wobbling');
    setTimeout(() => card.classList.remove('wobbling'), 600);
  });
}

// ── DEVELOPERS MODAL ─────────────────────────────────────────────────────
function _saOpenDevsModal() {
  if (document.getElementById('sa-devs-overlay')) return;

  const overlay = document.createElement('div');
  overlay.className = 'sa-devs-overlay';
  overlay.id = 'sa-devs-overlay';
  overlay.innerHTML = `
    <div class="sa-devs-modal" id="sa-devs-modal">
      <div class="sa-devs-modal-blobs">
        <div class="sa-modal-blob sa-modal-blob1"></div>
        <div class="sa-modal-blob sa-modal-blob2"></div>
        <div class="sa-modal-blob sa-modal-blob3"></div>
      </div>
      <button class="sa-devs-modal-close" id="sa-devs-modal-close">✕</button>
      <div class="sa-devs-modal-eyebrow">🩷 MADE WITH LOVE</div>
      <div class="sa-devs-modal-title">Meet the Developers</div>
      <p class="sa-devs-modal-sub">The two humans who stayed up late so HR could sleep early ✨<br><small style="opacity:.7;">Click on a photo for a surprise! 🎉</small></p>

      <div class="sa-devs-grid">
        <!-- Jeoan -->
        <div class="sa-dev-card" id="sa-dev-card-jeoan">
          <div class="sa-dev-ribbon">
            <div class="sa-dev-shimmer"></div>
          </div>
          <div class="sa-dev-avatar-wrap">
            <div class="sa-dev-ring"></div>
            <img class="sa-dev-avatar" src="/img/jeoan.jpg"
                 onerror="this.src='https://ui-avatars.com/api/?name=Jeoan+Gran&background=ffd6ec&color=b01860&size=200&bold=true'"
                 alt="Jeoan Gwyneth Dajay Gran"/>
          </div>
          <div class="sa-dev-content">
            <div class="sa-dev-tag">Frontend Developer</div>
            <div class="sa-dev-name">Jeoan Gwyneth Dajay Gran</div>
            <div class="sa-dev-bio">Designed every pixel of this system — from the deep crimson headers to the buttery gold balance cells. She also architected the entire leave computation logic: how credits are earned, deducted, forfeited, and monetized. Every formula behind the numbers flows from her mind.</div>
            <div class="sa-dev-skills">
              <span class="sa-dev-skill">🎨 UI Design</span>
              <span class="sa-dev-skill">💅 CSS/HTML</span>
              <span class="sa-dev-skill">🧮 Leave Logic</span>
            </div>
            <div class="sa-dev-hearts">🩷 🌸 🩷</div>
          </div>
        </div>

        <!-- Janice -->
        <div class="sa-dev-card" id="sa-dev-card-janice">
          <div class="sa-dev-ribbon">
            <div class="sa-dev-shimmer"></div>
          </div>
          <div class="sa-dev-avatar-wrap">
            <div class="sa-dev-ring"></div>
            <img class="sa-dev-avatar" src="/img/janice.jpg"
                 onerror="this.src='https://ui-avatars.com/api/?name=Janice+Laveros&background=ffd6ec&color=b01860&size=200&bold=true'"
                 alt="Janice Luis Laveros"/>
          </div>
          <div class="sa-dev-content">
            <div class="sa-dev-tag">Backend Developer</div>
            <div class="sa-dev-name">Janice Luis Laveros</div>
            <div class="sa-dev-bio">Built the engine that makes it all run — database schema, API routes, server logic, and the data pipelines that connect every part of the system. She turned Jeoan's computation designs into working backend code that handles every accrual, deduction, and balance entry reliably.</div>
            <div class="sa-dev-skills">
              <span class="sa-dev-skill">🗄️ Database Analysis</span>
              <span class="sa-dev-skill">⚙️ API Logic</span>
              <span class="sa-dev-skill">🔧 Server</span>
            </div>
            <div class="sa-dev-hearts">🩷 🌺 🩷</div>
          </div>
        </div>
      </div>

      <div class="sa-devs-modal-footer">
        <div class="sa-devs-footer-line"></div>
        <span class="sa-devs-footer-text">SDO Koronadal City · Leave Card Management System · Built with 🩷 for HR</span>
        <div class="sa-devs-footer-line"></div>
      </div>
    </div>`;

  document.body.appendChild(overlay);

  // Close on overlay click or button
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) _saCloseDevsModal();
  });
  document.getElementById('sa-devs-modal-close')?.addEventListener('click', _saCloseDevsModal);

  // ESC key
  const escHandler = (e) => { if (e.key === 'Escape') { _saCloseDevsModal(); document.removeEventListener('keydown', escHandler); } };
  document.addEventListener('keydown', escHandler);

  // Wire photo interactions
  const jeoanCard  = document.getElementById('sa-dev-card-jeoan');
  const janiceCard = document.getElementById('sa-dev-card-janice');
  if (jeoanCard)  _saWireDevCard(jeoanCard,  ['#ff80b8','#ffd6ec','#ff40a0','#ffe0f0','#e8208e','#ffb3d9'], ['🌸','🩷','✨','🎨','💕','⭐']);
  if (janiceCard) _saWireDevCard(janiceCard, ['#a78bfa','#fbbf24','#34d399','#f472b6','#60a5fa','#fb923c'], ['🌺','💜','✨','⚙️','💚','🌟']);

  // Pop-in entrance effect
  setTimeout(() => {
    const modal = document.getElementById('sa-devs-modal');
    if (modal) {
      _saFireworks(modal, '#ff80b8');
      for (let i = 0; i < 6; i++) {
        setTimeout(() => _saFloatEmoji(modal, ['🩷','🌸','✨','💕','🌺','🎉']), i * 100);
      }
    }
  }, 300);
}

function _saCloseDevsModal() {
  const overlay = document.getElementById('sa-devs-overlay');
  if (!overlay) return;
  overlay.style.transition = 'opacity .25s ease';
  overlay.style.opacity = '0';
  setTimeout(() => overlay.remove(), 260);
}

// ── HELPERS ──────────────────────────────────────────────────────────────
function _saInitials(surname, given) {
  return ((surname || '').charAt(0) + (given || '').charAt(0)).toUpperCase() || '?';
}
function _saMonthLabel() {
  return new Date().toLocaleDateString('en-PH', { month: 'long', year: 'numeric' });
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────
function renderSADashboard() {
  const el = document.getElementById('pg-home');
  if (!el) return;

  const db          = (window.state && window.state.db) || [];
  const saName      = (window.state?.schoolAdminCfg?.name) || 'School Admin';
  const teaching    = db.filter(e => (e.status || '').toLowerCase() === 'teaching').length;
  const nonTeaching = db.filter(e => (e.status || '').toLowerCase() === 'non-teaching').length;
  const teachingRel = db.filter(e => (e.status || '').toLowerCase() === 'teaching related').length;
  const active      = db.filter(e => (e.account_status || 'active') !== 'inactive').length;
  const inactive    = db.length - active;
  const month       = _saMonthLabel();
  const maxCat      = Math.max(teaching, nonTeaching, teachingRel, 1);

  const totalCat  = teaching + nonTeaching + teachingRel || 1;
  const teachPct  = Math.round(teaching / totalCat * 100);
  const R = 52, CIRC = 2 * Math.PI * R;
  const offset = CIRC - (teachPct / 100) * CIRC;

  const activeList   = db.filter(e => (e.account_status || 'active') !== 'inactive');
  const teachingList = db.filter(e => (e.status || '').toLowerCase() === 'teaching');
  const ntList       = db.filter(e => (e.status || '').toLowerCase() === 'non-teaching');

  const activities = [
    { dot:'#4a7cc7', label:`${teaching} Teaching personnel`,            sub:'Active teaching staff records',   val:'' },
    { dot:'#c83030', label:`${nonTeaching} Non-Teaching personnel`,     sub:'Administrative & support staff',  val:'' },
    { dot:'#ea7b3a', label:`${teachingRel} Teaching Related personnel`, sub:'Instructional support records',   val:'' },
    { dot:'#10b981', label:`${active} Active account${active!==1?'s':''}`,   sub:'Personnel with system access', val:'' },
    { dot:'#94a3b8', label:`${inactive} Inactive account${inactive!==1?'s':''}`, sub:'Archived / deactivated', val:'' },
    { dot:'#f59e0b', label:`${db.length} Total personnel on record`,    sub:'Complete registry',                val:'' },
  ];

  el.innerHTML = `
<div class="sa-dash">

<div class="sa-hero">
  <div class="sa-hero-bg"></div><div class="sa-hero-grain"></div><div class="sa-hero-rivets"></div>
  <div class="sa-hero-orbs"><div class="sa-orb sa-orb1"></div><div class="sa-orb sa-orb2"></div><div class="sa-orb sa-orb3"></div></div>
  <div class="sa-hero-content">
    <div class="sa-hero-left">
      <div class="sa-hero-eyebrow"><span class="sa-hero-pulse"></span>LEAVE MANAGEMENT SYSTEM · SDO KORONADAL CITY</div>
      <h1 class="sa-hero-title">Welcome back,<br><span class="sa-hero-name">${_saEsc(saName)}</span></h1>
      <p class="sa-hero-meta">🏫 School Administrator · Personnel Overview · ${db.length} Total Personnel</p>
    </div>
    <div class="sa-hero-right">
      <div class="sa-quick-tile" id="sa-hero-goto-list"><div class="sa-quick-tile-icon">👥</div><div><div class="sa-quick-tile-text">Personnel List</div><div class="sa-quick-tile-sub">${active} active members</div></div></div>
      <div class="sa-quick-tile" id="sa-hero-register"><div class="sa-quick-tile-icon">➕</div><div><div class="sa-quick-tile-text">Register Personnel</div><div class="sa-quick-tile-sub">Add new employee</div></div></div>
    </div>
  </div>
</div>

<div class="sa-month-badge">📅 Showing data for <strong style="margin-left:4px;">${_saEsc(month)}</strong></div>

<div class="sa-stats">
  <div class="sa-stat clickable" id="sa-stat-total" style="--ds-accent:#8b1a1a;--ds-soft:#fce8e8;">
    <div class="sa-stat-icon">👥</div><div class="sa-stat-num">${db.length}</div><div class="sa-stat-label">Total Personnel</div><div class="sa-stat-chevron">›</div><div class="sa-stat-glow"></div>
  </div>
  <div class="sa-stat clickable" id="sa-stat-teaching" style="--ds-accent:#1e3a6e;--ds-soft:#ddeeff;">
    <div class="sa-stat-icon">🏫</div><div class="sa-stat-num">${teaching}</div><div class="sa-stat-label">Teaching</div><div class="sa-stat-chevron">›</div><div class="sa-stat-glow"></div>
  </div>
  <div class="sa-stat clickable" id="sa-stat-nonteaching" style="--ds-accent:#7c1a1a;--ds-soft:#fdf0e6;">
    <div class="sa-stat-icon">📊</div><div class="sa-stat-num">${nonTeaching}</div><div class="sa-stat-label">Non-Teaching</div><div class="sa-stat-chevron">›</div><div class="sa-stat-glow"></div>
  </div>
  <div class="sa-stat clickable" id="sa-stat-tr" style="--ds-accent:#78350f;--ds-soft:#fef3c7;">
    <div class="sa-stat-icon">🔗</div><div class="sa-stat-num">${teachingRel}</div><div class="sa-stat-label">Teaching Related</div><div class="sa-stat-chevron">›</div><div class="sa-stat-glow"></div>
  </div>
  <div class="sa-stat clickable" id="sa-stat-active" style="--ds-accent:#065f46;--ds-soft:#d1fae5;">
    <div class="sa-stat-icon" style="background:#d1fae5;">✅</div><div class="sa-stat-num" style="color:#065f46;">${active}</div><div class="sa-stat-label">Active Accounts</div><div class="sa-stat-chevron">›</div><div class="sa-stat-glow" style="background:#065f46;"></div>
  </div>
</div>

<div id="sa-stat-dropdown" style="display:none;"></div>

<div class="sa-content-row">
  <div class="sa-progress-card">
    <div class="sa-card-title"><span class="sa-card-title-dot"></span>📈 Category Distribution</div>
    <div class="sa-ring-wrap">
      <svg width="130" height="130" viewBox="0 0 120 120">
        <defs><linearGradient id="saRingGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#1e3a6e"/><stop offset="100%" stop-color="#4a7cc7"/></linearGradient></defs>
        <circle class="sa-ring-track" cx="60" cy="60" r="${R}"/>
        <circle class="sa-ring-fill" cx="60" cy="60" r="${R}" stroke-dasharray="${CIRC}" stroke-dashoffset="${offset}"/>
        <text x="60" y="58" text-anchor="middle" dominant-baseline="middle" class="sa-ring-label" style="fill:#1e3a6e;">${teachPct}%</text>
        <text x="60" y="76" text-anchor="middle" class="sa-ring-sub">Teaching</text>
      </svg>
    </div>
    <div class="sa-legend">
      <div class="sa-legend-row"><div class="sa-legend-dot" style="background:#4a7cc7;"></div><span class="sa-legend-text">Teaching</span><span class="sa-legend-val">${teaching}</span></div>
      <div class="sa-legend-row"><div class="sa-legend-dot" style="background:#c83030;"></div><span class="sa-legend-text">Non-Teaching</span><span class="sa-legend-val">${nonTeaching}</span></div>
      <div class="sa-legend-row"><div class="sa-legend-dot" style="background:#ea7b3a;"></div><span class="sa-legend-text">Teaching Related</span><span class="sa-legend-val">${teachingRel}</span></div>
    </div>
  </div>
  <div class="sa-cat-card">
    <div class="sa-card-title"><span class="sa-card-title-dot"></span>👥 Personnel by Category</div>
    <div class="sa-bar-row">
      <div><div class="sa-bar-label-row"><span class="sa-bar-name">Teaching</span><span class="sa-bar-count">${teaching} personnel</span></div><div class="sa-bar-track"><div class="sa-bar-fill t" id="sa-bar-t" style="width:0%"></div></div></div>
      <div><div class="sa-bar-label-row"><span class="sa-bar-name">Non-Teaching</span><span class="sa-bar-count">${nonTeaching} personnel</span></div><div class="sa-bar-track"><div class="sa-bar-fill nt" id="sa-bar-nt" style="width:0%"></div></div></div>
      <div><div class="sa-bar-label-row"><span class="sa-bar-name">Teaching Related</span><span class="sa-bar-count">${teachingRel} personnel</span></div><div class="sa-bar-track"><div class="sa-bar-fill tr" id="sa-bar-tr" style="width:0%"></div></div></div>
      <div style="margin-top:8px;padding-top:12px;border-top:1px solid #f5e8e8;"><div class="sa-bar-label-row"><span class="sa-bar-name" style="color:#7a8a9d;">Active Accounts</span><span class="sa-bar-count">${active} of ${db.length}</span></div><div class="sa-bar-track"><div class="sa-bar-fill" id="sa-bar-active" style="width:0%;background:linear-gradient(90deg,#065f46,#10b981);"></div></div></div>
    </div>
  </div>
  <div class="sa-activity-card">
    <div class="sa-card-title"><span class="sa-card-title-dot"></span>📌 Summary Overview</div>
    <div class="sa-activity-list">
      ${activities.map(a => `<div class="sa-activity-item"><div class="sa-activity-dot" style="background:${a.dot};"></div><div class="sa-activity-body"><div class="sa-activity-label">${_saEsc(a.label)}</div><div class="sa-activity-sub">${_saEsc(a.sub)}</div></div>${a.val ? `<div class="sa-activity-val">${_saEsc(String(a.val))}</div>` : ''}</div>`).join('')}
    </div>
  </div>
</div>

<div class="sa-why">
  <div class="sa-why-pattern"></div>
  <div class="sa-why-inner">
    <div class="sa-why-eyebrow">📖 THE STORY BEHIND THE SYSTEM</div>
    <h2 class="sa-why-title">Built to End the Chaos</h2>
    <div class="sa-why-grid">
      <div class="sa-why-card" id="why-card-1"><div class="sa-why-card-icon">🗂️</div><h3>The Cabinet Problem</h3><p>Leave cards were buried inside physical filing cabinets. HR staff had to manually dig through hundreds of folders just to find a single employee's record — slow, error-prone, and exhausting.</p></div>
      <div class="sa-why-card" id="why-card-2"><div class="sa-why-card-icon">🧮</div><h3>Manual Computation Errors</h3><p>HR officers were computing leave balances by hand. Miscalculations were common — costing employees their rightful leave credits and creating disputes that took days to resolve.</p></div>
      <div class="sa-why-card" id="why-card-3"><div class="sa-why-card-icon">🚶‍♀️</div><h3>The Office Stampede</h3><p>Every leave balance check required a physical trip to the HR office — long queues, crowded corridors, and disrupted work schedules. A daily stampede nobody wanted.</p></div>
      <div class="sa-why-card" id="why-card-4"><div class="sa-why-card-icon">💻</div><h3>The Solution: This System</h3><p>Employees now look up their leave cards online — anytime, anywhere. No more trips to the office. No more manual errors. Just clean, fast, reliable digital leave records for everyone.</p></div>
    </div>
  </div>
</div>

<!-- DEVELOPERS TEASER (click to open modal) -->
<div class="sa-devs-teaser" id="sa-devs-teaser">
  <div class="sa-devs-teaser-blobs"><div class="sa-teaser-blob sa-teaser-blob1"></div><div class="sa-teaser-blob sa-teaser-blob2"></div></div>
  <div class="sa-devs-teaser-left">
    <div class="sa-devs-teaser-eyebrow">🩷 MADE WITH LOVE</div>
    <div class="sa-devs-teaser-title">Meet the Developers</div>
    <div class="sa-devs-teaser-sub">The minds behind this system ✨ Click to meet them!</div>
  </div>
  <div class="sa-devs-teaser-right">
    <div class="sa-devs-teaser-avatars">
      <img class="sa-devs-teaser-avatar" src="/img/jeoan.jpg"
           onerror="this.src='https://ui-avatars.com/api/?name=Jeoan+Gran&background=ffd6ec&color=b01860&size=200&bold=true'" alt="Jeoan"/>
      <img class="sa-devs-teaser-avatar" src="/img/janice.jpg"
           onerror="this.src='https://ui-avatars.com/api/?name=Janice+Laveros&background=ffd6ec&color=b01860&size=200&bold=true'" alt="Janice"/>
    </div>
    <button class="sa-devs-teaser-btn" id="sa-devs-open-btn">Meet Us 🩷</button>
  </div>
</div>

</div>`;

  // ── Animate bars ─────────────────────────────────────────────
  requestAnimationFrame(() => {
    setTimeout(() => {
      const bT      = document.getElementById('sa-bar-t');
      const bNT     = document.getElementById('sa-bar-nt');
      const bTR     = document.getElementById('sa-bar-tr');
      const bActive = document.getElementById('sa-bar-active');
      if (bT)      bT.style.width      = `${(teaching    / maxCat * 100).toFixed(1)}%`;
      if (bNT)     bNT.style.width     = `${(nonTeaching / maxCat * 100).toFixed(1)}%`;
      if (bTR)     bTR.style.width     = `${(teachingRel / maxCat * 100).toFixed(1)}%`;
      if (bActive) bActive.style.width = `${db.length ? (active / db.length * 100).toFixed(1) : 0}%`;
    }, 80);
  });

  // ── Hero tiles ────────────────────────────────────────────────
  document.getElementById('sa-hero-goto-list')?.addEventListener('click', () => {
    if (typeof window.setPage === 'function') window.setPage('list');
  });
  document.getElementById('sa-hero-register')?.addEventListener('click', () => {
    if (typeof showRegisterModal === 'function') showRegisterModal(null);
  });

  // ── Developers modal trigger ──────────────────────────────────
  document.getElementById('sa-devs-teaser')?.addEventListener('click', _saOpenDevsModal);
  document.getElementById('sa-devs-open-btn')?.addEventListener('click', (e) => { e.stopPropagation(); _saOpenDevsModal(); });

  // ── Dropdown builder ──────────────────────────────────────────
  function buildDropdown(list, title, badgeClass, emptyIcon, emptyMsg) {
    const badge = `${list.length} employee${list.length !== 1 ? 's' : ''}`;
    const rows = list.length === 0
      ? `<div class="sa-panel-empty"><span>${emptyIcon}</span>${emptyMsg}</div>`
      : list.map(e => `
          <div class="sa-emp-row">
            <div class="sa-emp-avatar">${_saEsc(_saInitials(e.surname, e.given))}</div>
            <div class="sa-emp-info">
              <div class="sa-emp-name">${_saEsc(e.surname)}, ${_saEsc(e.given)}</div>
              <div class="sa-emp-school">${_saEsc(e.school || '')}</div>
            </div>
            <div class="sa-emp-badge-wrap">${_saCategoryBadge(e.status)}</div>
          </div>`).join('');
    return `
      <div class="sa-dropdown">
        <div class="sa-dropdown-head">
          <span class="sa-dropdown-title">${title} <span class="sa-dropdown-badge ${badgeClass}">${badge}</span></span>
          <button class="sa-dropdown-close" id="sa-dropdown-close-btn">✕</button>
        </div>
        <div class="sa-dropdown-body">${rows}</div>
      </div>`;
  }

  // ── Stat card interactions ────────────────────────────────────
  const dropSlot = document.getElementById('sa-stat-dropdown');
  let openStatId = null;

  const statConfig = {
    'sa-stat-total':      { emoji:['👥','🎉','🔥','💪','✨'], effect:'explode', tooltip:'🔥 Full team assembled!', list:() => db, title:'👥 All Personnel', badgeClass:'', emptyIcon:'😶', emptyMsg:'No personnel registered yet.' },
    'sa-stat-teaching':   { emoji:['🏫','📚','✏️','🎓','⭐'], effect:'firework', fwColor:'#4a7cc7', tooltip:'🎓 Teachers rock!', list:() => teachingList, title:'🏫 Teaching Personnel', badgeClass:'blue', emptyIcon:'📭', emptyMsg:'No teaching staff found.' },
    'sa-stat-nonteaching':{ emoji:['📊','⚙️','🛠️','💼','🌟'], effect:'explode', tooltip:'💼 Support heroes!', list:() => ntList, title:'📊 Non-Teaching Personnel', badgeClass:'', emptyIcon:'📭', emptyMsg:'No non-teaching staff found.' },
    'sa-stat-tr':         { emoji:['🔗','🌈','🦋','💫','🎯'], effect:'explode', tooltip:'🎯 Bridging the gap!', list:() => db.filter(e => (e.status||'').toLowerCase()==='teaching related'), title:'🔗 Teaching Related Personnel', badgeClass:'', emptyIcon:'📭', emptyMsg:'No teaching related staff found.' },
    'sa-stat-active':     { emoji:['✅','🟢','⚡','🚀','💚'], effect:'firework', fwColor:'#10b981', tooltip:'🚀 All systems active!', list:() => activeList, title:'✅ Active Accounts', badgeClass:'green', emptyIcon:'😶', emptyMsg:'No active accounts.' },
  };

  Object.entries(statConfig).forEach(([id, cfg]) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('click', () => {
      _saBounceNum(btn);
      _saShowTooltip(btn, cfg.tooltip);
      for (let i = 0; i < 3; i++) setTimeout(() => _saFloatEmoji(btn, cfg.emoji), i * 120);
      if (cfg.effect === 'firework') _saFireworks(btn, cfg.fwColor);
      else _saExplode(btn, 'gold');
      const isOpen = openStatId === id;
      openStatId = isOpen ? null : id;
      Object.keys(statConfig).forEach(sid => document.getElementById(sid)?.classList.remove('active-filter'));
      if (!isOpen) {
        btn.classList.add('active-filter');
        dropSlot.innerHTML = buildDropdown(cfg.list(), cfg.title, cfg.badgeClass, cfg.emptyIcon, cfg.emptyMsg);
        dropSlot.style.display = '';
        document.getElementById('sa-dropdown-close-btn')?.addEventListener('click', () => {
          dropSlot.style.display = 'none'; dropSlot.innerHTML = '';
          openStatId = null; btn.classList.remove('active-filter');
        });
      } else {
        dropSlot.style.display = 'none'; dropSlot.innerHTML = '';
      }
    });
  });

  // ── Why card effects ──────────────────────────────────────────
  const whyEmojis = {
    'why-card-1':['🗂️','📁','😩','🗃️'],
    'why-card-2':['🧮','💀','😱','🔢'],
    'why-card-3':['🚶‍♀️','😤','⏳','😫'],
    'why-card-4':['💻','🎉','🚀','✨'],
  };
  Object.entries(whyEmojis).forEach(([id, emojis]) => {
    document.getElementById(id)?.addEventListener('click', () => {
      for (let i = 0; i < 4; i++) setTimeout(() => _saFloatEmoji(document.getElementById(id), emojis), i * 100);
    });
  });
}

window.renderSADashboard = renderSADashboard;


// ── PERSONNEL LIST ────────────────────────────────────────────────────────
function renderSAPersonnelList() {
  const el = document.getElementById('pg-list');
  if (!el) return;

  const db        = (window.state && window.state.db) || [];
  const positions = [...new Set(db.filter(e => e.pos).map(e => e.pos))].sort();
  const schools   = [...new Set(db.filter(e => e.school).map(e => e.school))].sort();

  el.innerHTML = `
    <div class="pl-card">
      <div class="pl-header">
        <div class="pl-header-left">
          <div class="pl-header-title">👥 Personnel Registry</div>
          <button class="pl-btn-register" id="saAddEmpBtn">＋ Register New Personnel</button>
        </div>
        <div class="pl-header-right">
          <div class="pl-search-wrap">
            <span class="pl-search-icon">🔍</span>
            <input id="saPlSearch" type="text" placeholder="Search name or ID…" autocomplete="off"/>
          </div>
          <button class="pl-btn-clear" id="saPlClearBtn">✕ Clear</button>
        </div>
      </div>
      <div class="pl-filter-bar">
        <div class="pl-filter-spacer pl-fcol-rownum"></div>
        <div class="pl-filter-spacer pl-fcol-empid"></div>
        <div class="pl-filter-spacer pl-fcol-name"></div>
        <div class="pl-fcol-cat"><select class="pl-select" id="saPlCatFilter"><option value="">All Categories</option><option value="Teaching">Teaching</option><option value="Non-Teaching">Non-Teaching</option><option value="Teaching Related">Teaching Related</option></select></div>
        <div class="pl-fcol-pos"><select class="pl-select" id="saPlPosFilter"><option value="">All Positions</option>${positions.map(p => `<option value="${_saEsc(p)}">${_saEsc(p)}</option>`).join('')}</select></div>
        <div class="pl-fcol-school"><select class="pl-select" id="saPlSchoolFilter"><option value="">All Schools/Offices</option>${schools.map(s => `<option value="${_saEsc(s)}">${_saEsc(s)}</option>`).join('')}</select></div>
        <div class="pl-fcol-acc"><select class="pl-select" id="saPlAccFilter"><option value="">All Accounts</option><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
        <div class="pl-filter-spacer pl-fcol-action"></div>
      </div>
      <div class="pl-table-wrap">
        <table class="pl-table">
          <thead><tr>
            <th class="pl-th-center pl-tcol-rownum">#</th>
            <th class="pl-tcol-empid">Employee ID</th>
            <th class="pl-tcol-name">Full Name</th>
            <th class="pl-th-center pl-tcol-cat">Category</th>
            <th class="pl-tcol-pos">Position</th>
            <th class="pl-tcol-school">School / Office</th>
            <th class="pl-th-center pl-tcol-acc">Account</th>
            <th class="pl-th-center pl-tcol-action no-print">Action</th>
          </tr></thead>
          <tbody id="saPlTableBody"></tbody>
        </table>
      </div>
      <div class="pl-table-footer" id="saPlFooter"></div>
    </div>`;

  document.getElementById('saAddEmpBtn')?.addEventListener('click', () => {
    if (typeof showRegisterModal === 'function') showRegisterModal(null);
  });
  ['saPlSearch','saPlCatFilter','saPlPosFilter','saPlSchoolFilter','saPlAccFilter'].forEach(id => {
    document.getElementById(id)?.addEventListener(id === 'saPlSearch' ? 'input' : 'change', filterSAPersonnelTable);
  });
  document.getElementById('saPlClearBtn')?.addEventListener('click', () => {
    ['saPlSearch','saPlCatFilter','saPlPosFilter','saPlSchoolFilter','saPlAccFilter'].forEach(id => { const e = document.getElementById(id); if (e) e.value = ''; });
    filterSAPersonnelTable();
  });
  filterSAPersonnelTable();
}

window.renderSAPersonnelList = renderSAPersonnelList;

function filterSAPersonnelTable() {
  const body   = document.getElementById('saPlTableBody');
  const footer = document.getElementById('saPlFooter');
  if (!body) return;

  const db  = (window.state && window.state.db) || [];
  const q   = (document.getElementById('saPlSearch')?.value       || '').toLowerCase().trim();
  const cat =  document.getElementById('saPlCatFilter')?.value    || '';
  const pos =  document.getElementById('saPlPosFilter')?.value    || '';
  const sch =  document.getElementById('saPlSchoolFilter')?.value || '';
  const acc =  document.getElementById('saPlAccFilter')?.value    || '';

  let list = [...db];
  if      (acc === 'inactive') list = list.filter(e => (e.account_status || 'active') === 'inactive');
  else if (acc === 'active')   list = list.filter(e => (e.account_status || 'active') === 'active');
  else                         list = list.filter(e => (e.account_status || 'active') !== 'inactive');
  if (cat) list = list.filter(e => e.status === cat);
  if (pos) list = list.filter(e => e.pos === pos);
  if (sch) list = list.filter(e => e.school === sch);
  if (q)   list = list.filter(e => [e.id, e.surname, e.given, e.school, e.pos].some(v => (v || '').toLowerCase().includes(q)));
  list.sort((a, b) => (a.surname || '').localeCompare(b.surname || ''));

  if (list.length === 0) {
    body.innerHTML = `<tr class="pl-empty-row"><td colspan="8">No employees found matching the current filters.</td></tr>`;
    if (footer) footer.innerHTML = `Showing <strong>0</strong> employees`;
    return;
  }

  body.innerHTML = list.map((e, i) => `
    <tr>
      <td class="pl-td-rownum pl-td-center">${i + 1}</td>
      <td class="pl-td-empid">${_saEsc(e.id)}</td>
      <td class="pl-td-name">${_saEsc(e.surname)}, ${_saEsc(e.given)}${e.suffix ? ` <span>${_saEsc(e.suffix)}</span>` : ''}</td>
      <td class="pl-td-center">${_saCategoryBadge(e.status)}</td>
      <td class="pl-td-pos">${_saEsc(e.pos || '—')}</td>
      <td class="pl-td-school">${_saEsc(e.school || '—')}</td>
      <td class="pl-td-center">${_saAccountBadge(e.account_status)}</td>
      <td class="pl-td-actions no-print"><button class="pl-action-btn pl-action-btn--edit" data-sa-edit="${_saEsc(e.id)}">✏ Edit</button></td>
    </tr>`).join('');

  if (footer) footer.innerHTML = `Showing <strong>${list.length}</strong> of <strong>${db.length}</strong> employee${db.length !== 1 ? 's' : ''}`;

  body.querySelectorAll('[data-sa-edit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const emp = (window.state?.db || []).find(e => e.id === btn.dataset.saEdit);
      if (!emp) { alert('Employee not found.'); return; }
      if (typeof showRegisterModal === 'function') showRegisterModal(emp);
      else alert('Edit modal is not available.');
    });
  });
}

window.filterSAPersonnelTable = filterSAPersonnelTable;


// ── PROFILE MODAL — READ-ONLY for School Admin ────────────────────────────
function showSAProfileModal() {
  document.getElementById('saProfMo')?.remove();

  if (!document.getElementById('sa-prof-style')) {
    const s = document.createElement('style');
    s.id = 'sa-prof-style';
    s.textContent = `
      .mo-close-btn{background:none;border:none;color:rgba(255,255,255,.7);font-size:18px;cursor:pointer;padding:2px 6px;border-radius:5px;line-height:1;transition:color .15s,background .15s;}
      .mo-close-btn:hover{color:#fff;background:rgba(255,255,255,.15);}
      .sa-prof-readonly { background:#f8f9fb; border:1px solid #e2e8f0; border-radius:8px; padding:10px 14px; font-size:13px; color:#4a5568; display:block; width:100%; box-sizing:border-box; }
      .sa-prof-readonly-label { font-size:10.5px; font-weight:600; color:#7a8a9d; text-transform:uppercase; letter-spacing:.6px; margin-bottom:6px; display:block; }
      .sa-prof-info-box { background:linear-gradient(135deg,#fff7ed,#fef3c7); border:1px solid #fcd34d; border-radius:10px; padding:12px 16px; margin-top:16px; display:flex; align-items:flex-start; gap:10px; }
      .sa-prof-info-icon { font-size:18px; flex-shrink:0; margin-top:1px; }
      .sa-prof-info-text { font-size:11.5px; color:#92400e; line-height:1.6; }
    `;
    document.head.appendChild(s);
  }

  const cfg = window.state?.schoolAdminCfg || {};

  document.body.insertAdjacentHTML('beforeend', `
    <div class="mo open" id="saProfMo">
      <div class="mb xsm">
        <div class="mh">
          <h3>👤 My Profile</h3>
          <button class="mo-close-btn" id="saProfClose" type="button">✕</button>
        </div>
        <div class="md">
          <div style="margin-bottom:14px;">
            <span class="sa-prof-readonly-label">Display Name</span>
            <span class="sa-prof-readonly">${_saEsc(cfg.name || 'School Admin')}</span>
          </div>
          <div style="margin-bottom:4px;">
            <span class="sa-prof-readonly-label">Login ID</span>
            <span class="sa-prof-readonly">${_saEsc(cfg.id || '—')}</span>
          </div>
          <div class="sa-prof-info-box">
            <span class="sa-prof-info-icon">🔒</span>
            <span class="sa-prof-info-text">Your account details are managed by the system administrator. Please contact your admin if you need to update your name or password.</span>
          </div>
        </div>
        <div class="mf">
          <button class="btn b-pri" id="saProfOk" type="button">Got it 👍</button>
        </div>
      </div>
    </div>`);

  document.getElementById('saProfClose')?.addEventListener('click', () => closeMo('saProfMo'));
  document.getElementById('saProfOk')?.addEventListener('click',    () => closeMo('saProfMo'));
}

window.showSAProfileModal = showSAProfileModal;