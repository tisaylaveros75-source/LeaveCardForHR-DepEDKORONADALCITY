/* ============================================================
   SDO Koronadal City — Leave Card System
   dashboard.js — renderHomeDashboard()
   ============================================================ */

'use strict';

/* ── Inject dashboard CSS once ───────────────────────────────── */
(function injectDashCSS() {
  if (document.getElementById('dash-enhanced-css')) return;
  const s = document.createElement('style');
  s.id = 'dash-enhanced-css';
  s.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');

/* ── Force home page to fill its container ──────────────────── */
#pg-home {
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

/* ── Base wrap ──────────────────────────────────────────────── */
.edb-wrap {
  font-family: 'DM Sans', sans-serif;
  padding: 20px 24px;
  animation: edb-fade-in .45s ease both;
  width: 100%;
  max-width: 100%;
  margin: 0;
  box-sizing: border-box;
}
@keyframes edb-fade-in {
  from { opacity:0; transform:translateY(12px); }
  to   { opacity:1; transform:none; }
}

/* ── HERO ───────────────────────────────────────────────────── */
.edb-hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(130deg, #0d0000 0%, #2a0404 30%, #5a0a0a 65%, #8b1a1a 100%);
  border-radius: 20px;
  padding: 44px 50px 48px;
  margin-bottom: 24px;
  color: #fff;
  box-shadow:
    0 16px 56px rgba(139,26,26,.5),
    0 2px 8px rgba(0,0,0,.3),
    inset 0 1px 0 rgba(255,180,120,.12),
    inset 0 -1px 0 rgba(0,0,0,.4);
  border: 1px solid rgba(180,60,60,.3);
}
.edb-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(90deg, transparent, transparent 48px, rgba(255,255,255,.018) 48px, rgba(255,255,255,.018) 49px),
    repeating-linear-gradient(0deg,  transparent, transparent 48px, rgba(255,255,255,.018) 48px, rgba(255,255,255,.018) 49px);
  pointer-events: none;
  border-radius: 20px;
}
.edb-hero-bg-img {
  position: absolute; inset: 0;
  background: url('https://depedkoronadalcity.wordpress.com/wp-content/uploads/2012/09/city-division-office1.jpg') center/cover no-repeat;
  opacity: .04;
}
.edb-hero-grain {
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.025'/%3E%3C/svg%3E");
  pointer-events: none;
}
.edb-hero-orbs { position:absolute; inset:0; pointer-events:none; }
.edb-orb { position:absolute; border-radius:50%; filter:blur(80px); }
.edb-orb1 { width:400px; height:400px; background:#9b1818; opacity:.25; top:-120px; right:-100px; }
.edb-orb2 { width:240px; height:240px; background:#6b1a04; opacity:.2;  bottom:-80px; left:6%; }
.edb-orb3 { width:180px; height:180px; background:#4a0c08; opacity:.28; top:25%; right:20%; }
.edb-hero-rivets { position:absolute; inset:0; pointer-events:none; }
.edb-hero-rivets::before,
.edb-hero-rivets::after {
  content:''; position:absolute;
  width:8px; height:8px; border-radius:50%;
  background: radial-gradient(circle at 35% 35%, rgba(255,200,120,.6), rgba(180,60,30,.4));
  box-shadow: 0 1px 3px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,220,150,.3);
}
.edb-hero-rivets::before { top:16px; left:16px; }
.edb-hero-rivets::after  { top:16px; right:16px; }
.edb-hero-content {
  position: relative; z-index: 2;
  display: flex; align-items: center;
  justify-content: space-between;
  gap: 24px; flex-wrap: wrap;
}
.edb-hero-left { flex:1; min-width:260px; }
.edb-hero-eyebrow {
  display: inline-flex; align-items: center; gap:8px;
  font-size: 9px; font-weight: 700; letter-spacing: 2.5px;
  text-transform: uppercase; color: rgba(255,200,140,.5);
  margin-bottom: 16px;
}
.edb-hero-pulse {
  width:6px; height:6px; border-radius:50%;
  background:#f09070; animation: edb-pulse 2s infinite;
  box-shadow: 0 0 6px rgba(240,144,112,.6);
}
@keyframes edb-pulse {
  0%,100% { opacity:1; transform:scale(1);   box-shadow:0 0 6px  rgba(240,144,112,.6); }
  50%     { opacity:.5; transform:scale(1.6); box-shadow:0 0 14px rgba(240,144,112,.3); }
}
.edb-hero-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2.8rem; font-weight: 900;
  line-height: 1.06; margin-bottom: 12px; letter-spacing: -.5px;
  text-shadow: 0 2px 16px rgba(0,0,0,.5);
}
.edb-hero-name {
  background: linear-gradient(90deg,#ffd0a0,#f0a060,#d06040,#e08050);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 8px rgba(200,80,40,.4));
}
.edb-hero-meta { font-size:.8rem; color:rgba(255,200,150,.4); margin-top:6px; }
.edb-hero-right { display:flex; flex-direction:column; gap:10px; flex-shrink:0; }
.edb-quick-tile {
  display:flex; align-items:center; gap:12px;
  background:rgba(255,255,255,.06);
  border:1px solid rgba(255,160,100,.15);
  border-radius:12px; padding:12px 18px; cursor:pointer;
  transition:background .2s,transform .2s,border-color .2s;
  min-width:200px;
  box-shadow:inset 0 1px 0 rgba(255,200,120,.08), 0 2px 8px rgba(0,0,0,.2);
}
.edb-quick-tile:hover { background:rgba(255,255,255,.12); border-color:rgba(255,160,100,.3); transform:translateX(-3px); }
.edb-quick-tile-icon { font-size:20px; }
.edb-quick-tile-text { font-size:11.5px; font-weight:600; color:rgba(255,220,180,.9); }
.edb-quick-tile-sub  { font-size:9.5px;  color:rgba(255,180,130,.4); margin-top:1px; }

/* ── STAT CARDS ─────────────────────────────────────────────── */
.edb-stats {
  display:grid;
  grid-template-columns:repeat(6,1fr);
  gap:14px; margin-bottom:6px;
}
@media(max-width:1100px){ .edb-stats{ grid-template-columns:repeat(3,1fr); } }
@media(max-width:650px) { .edb-stats{ grid-template-columns:repeat(2,1fr); } }
.edb-stat {
  background:linear-gradient(160deg,#fff 0%,#fdf7f7 100%);
  border-radius:16px; border:1px solid #e8d0d0;
  padding:20px 18px;
  display:flex; flex-direction:column; gap:6px;
  position:relative; overflow:hidden;
  box-shadow:0 2px 12px rgba(139,26,26,.07),0 1px 3px rgba(0,0,0,.06);
  transition:transform .22s,box-shadow .22s;
  cursor:default;
}
.edb-stat:hover { transform:translateY(-5px); box-shadow:0 12px 36px rgba(139,26,26,.18),0 2px 8px rgba(0,0,0,.08); }
.edb-stat::before {
  content:''; position:absolute; top:0; left:0; right:0; height:3px;
  background:linear-gradient(90deg,var(--ds-accent,#8b1a1a),color-mix(in srgb,var(--ds-accent,#8b1a1a) 60%,#fff));
  border-radius:3px 3px 0 0;
}
.edb-stat::after {
  content:''; position:absolute; top:10px; right:12px;
  width:5px; height:5px; border-radius:50%;
  background:radial-gradient(circle at 35% 35%,rgba(255,200,120,.5),var(--ds-accent,#8b1a1a));
  opacity:.35;
}
.edb-stat.clickable { cursor:pointer; }
.edb-stat.clickable:hover { background:linear-gradient(160deg,var(--ds-soft,#fff0f0),#fff); }
.edb-stat.active-filter {
  background:var(--ds-soft,#fff0f0);
  box-shadow:0 0 0 2px var(--ds-accent,#8b1a1a),0 10px 32px rgba(139,26,26,.2);
}
.edb-stat-icon {
  width:44px; height:44px; border-radius:12px;
  background:var(--ds-soft,#fce8e8);
  display:flex; align-items:center; justify-content:center;
  font-size:20px; margin-bottom:4px;
  box-shadow:inset 0 1px 2px rgba(0,0,0,.06),0 1px 4px rgba(139,26,26,.1);
}
.edb-stat-num {
  font-family:'Playfair Display',Georgia,serif;
  font-size:2rem; font-weight:800;
  color:var(--ds-accent,#1a1a2e); line-height:1;
}
.edb-stat-label { font-size:10px; font-weight:600; color:#7a8a9d; text-transform:uppercase; letter-spacing:.7px; }
.edb-stat-chevron {
  position:absolute; right:14px; top:50%; transform:translateY(-50%);
  font-size:20px; color:var(--ds-accent,#8b1a1a); opacity:.25;
  transition:opacity .2s,transform .2s;
}
.edb-stat.active-filter .edb-stat-chevron { opacity:.7; transform:translateY(-50%) rotate(90deg); }
.edb-stat-glow {
  position:absolute; bottom:-24px; right:-24px;
  width:90px; height:90px; border-radius:50%;
  background:var(--ds-accent,#8b1a1a); opacity:.06; pointer-events:none;
}

/* ── DROPDOWN PANELS ────────────────────────────────────────── */
.edb-dropdown {
  background:#fff; border:1px solid #e8d0d0;
  border-radius:14px;
  box-shadow:0 8px 32px rgba(139,26,26,.14),0 2px 8px rgba(0,0,0,.08);
  margin-bottom:20px; overflow:hidden;
  animation:edb-drop-in .25s cubic-bezier(.22,1,.36,1);
}
@keyframes edb-drop-in { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:none} }
.edb-dropdown-head {
  padding:12px 20px; display:flex; align-items:center;
  justify-content:space-between; border-bottom:1px solid #f0e0e0;
  background:linear-gradient(90deg,#fdf0f0,#fff);
}
.edb-dropdown-title {
  font-size:11px; font-weight:700; text-transform:uppercase;
  letter-spacing:.8px; color:#3a0808;
  display:flex; align-items:center; gap:8px;
}
.edb-dropdown-badge { background:#fce8e8; color:#8b1a1a; font-size:10px; font-weight:800; border-radius:20px; padding:2px 10px; }
.edb-dropdown-badge.green { background:#d1fae5; color:#065f46; }
.edb-dropdown-close {
  background:none; border:none; color:#aaa;
  font-size:18px; cursor:pointer; padding:2px 6px;
  border-radius:5px; line-height:1;
  transition:color .15s,background .15s;
}
.edb-dropdown-close:hover { color:#333; background:#f0e8e8; }
.edb-dropdown-body { max-height:320px; overflow-y:auto; }
.edb-dropdown-body::-webkit-scrollbar { width:4px; }
.edb-dropdown-body::-webkit-scrollbar-thumb { background:#e0c8c8; border-radius:4px; }
.edb-emp-row {
  display:flex; align-items:center; gap:10px;
  padding:11px 20px; border-bottom:1px solid #faf2f2;
}
.edb-emp-row:last-child { border-bottom:none; }
.edb-emp-row.link { cursor:pointer; }
.edb-emp-row.link:hover { background:#fff5f5; }
.edb-emp-avatar {
  width:34px; height:34px; border-radius:10px;
  background:linear-gradient(135deg,#7a1010,#c02828);
  color:white; font-size:12px; font-weight:800;
  display:flex; align-items:center; justify-content:center; flex-shrink:0;
  box-shadow:0 2px 6px rgba(139,26,26,.3);
}
.edb-emp-avatar.green { background:linear-gradient(135deg,#065f46,#10b981); }
.edb-emp-info { flex:1; min-width:0; }
.edb-emp-name   { font-size:12.5px; font-weight:600; color:#1a1a2e; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.edb-emp-school { font-size:10.5px; color:#7a8a9d; margin-top:1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.edb-emp-status { font-size:10px; font-weight:700; padding:3px 9px; border-radius:20px; flex-shrink:0; }
.edb-emp-status.ok  { background:#d1fae5; color:#065f46; }
.edb-emp-status.pnd { background:#fee2e2; color:#7f1d1d; }
.edb-emp-arr { color:#8b1a1a; opacity:.4; font-size:14px; flex-shrink:0; }
.edb-panel-empty { padding:32px 20px; text-align:center; font-size:12.5px; color:#7a8a9d; }
.edb-panel-empty span { display:block; font-size:28px; margin-bottom:8px; }

/* ── MAIN CONTENT ROW ───────────────────────────────────────── */
.edb-content-row {
  display:grid;
  grid-template-columns:1fr 1fr 1fr;
  gap:20px; margin-bottom:24px;
  align-items:stretch;
  width:100%;
}
@media(max-width:1000px){ .edb-content-row{ grid-template-columns:1fr 1fr; } }
@media(max-width:650px) { .edb-content-row{ grid-template-columns:1fr; } }
.edb-progress-card,
.edb-cat-card,
.edb-activity-card {
  background:linear-gradient(160deg,#ffffff 0%,#fdf8f8 100%);
  border-radius:16px; border:1px solid #e8d0d0;
  box-shadow:0 2px 12px rgba(139,26,26,.07),0 1px 3px rgba(0,0,0,.05);
  padding:24px 22px; min-width:0;
  height:100%; box-sizing:border-box;
  display:flex; flex-direction:column;
  position:relative; overflow:hidden;
}
.edb-progress-card::before,
.edb-cat-card::before,
.edb-activity-card::before {
  content:''; position:absolute; top:0; left:0; right:0; height:2px;
  background:linear-gradient(90deg,#8b1a1a,#d43030,#8b1a1a); opacity:.5;
}
.edb-progress-card::after,
.edb-cat-card::after,
.edb-activity-card::after {
  content:''; position:absolute; top:10px; right:14px;
  width:5px; height:5px; border-radius:50%;
  background:radial-gradient(circle at 35% 35%,rgba(255,180,100,.4),#8b1a1a);
  opacity:.25;
}
.edb-card-title {
  font-size:11px; font-weight:700; text-transform:uppercase;
  letter-spacing:.8px; color:#3a0808; margin-bottom:20px;
  display:flex; align-items:center; gap:8px; flex-shrink:0;
}
.edb-card-title-dot { width:6px; height:6px; border-radius:50%; background:#8b1a1a; flex-shrink:0; box-shadow:0 0 4px rgba(139,26,26,.5); }
.edb-ring-wrap { display:flex; justify-content:center; margin-bottom:20px; flex:1; align-items:center; }
.edb-ring-track { fill:none; stroke:#f0e0e0; stroke-width:10; }
.edb-ring-fill {
  fill:none; stroke:url(#ringGrad); stroke-width:10; stroke-linecap:round;
  transition:stroke-dashoffset 1.2s cubic-bezier(.22,1,.36,1);
  transform:rotate(-90deg); transform-origin:60px 60px;
}
.edb-ring-label { font-family:'Playfair Display',Georgia,serif; font-size:28px; font-weight:800; fill:#8b1a1a; }
.edb-ring-sub   { font-size:10px; fill:#7a8a9d; font-weight:600; }
.edb-legend { display:flex; flex-direction:column; gap:10px; flex-shrink:0; }
.edb-legend-row { display:flex; align-items:center; gap:10px; }
.edb-legend-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
.edb-legend-text { font-size:12px; color:#4a4a5a; flex:1; }
.edb-legend-val  { font-size:12px; font-weight:700; color:#1a1a2e; }
.edb-bar-row { display:flex; flex-direction:column; gap:14px; flex:1; justify-content:space-between; }
.edb-bar-label-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:5px; }
.edb-bar-name  { font-size:11.5px; font-weight:600; color:#3a0808; }
.edb-bar-count { font-size:11px; font-weight:700; color:#7a8a9d; }
.edb-bar-track { background:#f0e4e4; border-radius:99px; height:8px; overflow:hidden; }
.edb-bar-fill  { height:100%; border-radius:99px; transition:width 1.1s cubic-bezier(.22,1,.36,1); }
.edb-bar-fill.t  { background:linear-gradient(90deg,#1e3a6e,#4a7cc7); }
.edb-bar-fill.nt { background:linear-gradient(90deg,#7a1010,#c83030); }
.edb-bar-fill.tr { background:linear-gradient(90deg,#7c2d12,#ea7b3a); }
.edb-activity-list { display:flex; flex-direction:column; gap:0; flex:1; }
.edb-activity-item {
  display:flex; align-items:flex-start; gap:12px;
  padding:10px 0; border-bottom:1px solid #faf2f2;
  position:relative; flex:1;
}
.edb-activity-item:last-child { border-bottom:none; }
.edb-activity-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; margin-top:5px; box-shadow:0 0 4px currentColor; }
.edb-activity-body { flex:1; min-width:0; }
.edb-activity-label { font-size:12px; font-weight:600; color:#1a1a2e; line-height:1.4; }
.edb-activity-sub   { font-size:10.5px; color:#7a8a9d; margin-top:2px; }
.edb-activity-val   { font-size:11px; font-weight:700; color:#8b1a1a; flex-shrink:0; align-self:center; }
.edb-month-badge {
  display:inline-flex; align-items:center; gap:6px;
  background:linear-gradient(90deg,#fce8e8,#fff5f5);
  border:1px solid #e8d0d0; border-radius:8px;
  padding:5px 12px; font-size:10.5px; font-weight:700;
  color:#8b1a1a; margin-bottom:20px; letter-spacing:.3px;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.8);
}

/* ── WHY SECTION ────────────────────────────────────────────── */
.edb-why {
  background:linear-gradient(145deg,#080c12 0%,#150404 50%,#0e0a0a 100%);
  border-radius:20px; padding:48px 44px;
  margin-bottom:24px; position:relative; overflow:hidden;
  box-shadow:0 10px 48px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,160,100,.1),inset 0 -1px 0 rgba(0,0,0,.5);
  border:1px solid rgba(140,40,30,.3);
}
.edb-why-pattern {
  position:absolute; inset:0; opacity:.7; pointer-events:none;
  background-image:
    radial-gradient(circle at 1px 1px,rgba(255,255,255,.035) 1px,transparent 0),
    repeating-linear-gradient(90deg,transparent,transparent 80px,rgba(180,60,40,.06) 80px,rgba(180,60,40,.06) 81px);
  background-size:28px 28px,100% 100%;
}
.edb-why-inner { position:relative; z-index:1; }
.edb-why-eyebrow { font-size:9px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:#e08050; margin-bottom:8px; text-shadow:0 0 12px rgba(224,128,80,.4); }
.edb-why-title { font-family:'Playfair Display',Georgia,serif; font-size:2.1rem; font-weight:800; color:#fff; margin-bottom:32px; letter-spacing:-.3px; text-shadow:0 2px 16px rgba(0,0,0,.5); }
.edb-why-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(210px,1fr)); gap:16px; }
.edb-why-card {
  background:rgba(255,255,255,.03); border:1px solid rgba(200,80,60,.15);
  border-radius:14px; padding:24px 22px; backdrop-filter:blur(8px);
  transition:background .22s,transform .22s,border-color .22s; position:relative;
}
.edb-why-card::before {
  content:''; position:absolute; top:0; left:0; right:0; height:2px;
  background:linear-gradient(90deg,transparent,rgba(200,80,60,.4),transparent);
  border-radius:14px 14px 0 0;
}
.edb-why-card:hover { background:rgba(255,255,255,.07); border-color:rgba(200,80,60,.3); transform:translateY(-4px); }
.edb-why-card-icon { font-size:30px; margin-bottom:14px; }
.edb-why-card h3 { font-size:13px; font-weight:700; color:#f8c880; margin-bottom:8px; }
.edb-why-card p  { font-size:11.5px; color:rgba(255,255,255,.5); line-height:1.75; }

/* ── STAT CARD EFFECTS ────────────────────────────────────── */
@keyframes edb-shockwave { 0%{transform:scale(0);opacity:.7;} 80%{transform:scale(4);opacity:.1;} 100%{transform:scale(5);opacity:0;} }
.edb-shockwave { position:absolute; inset:0; border-radius:16px; background:radial-gradient(circle,rgba(139,26,26,.4) 0%,transparent 70%); pointer-events:none; animation:edb-shockwave .5s ease-out forwards; z-index:10; }
@keyframes edb-shard-fly { 0%{transform:translate(0,0) rotate(0deg) scale(1);opacity:1;} 100%{transform:translate(var(--tx),var(--ty)) rotate(var(--tr)) scale(0);opacity:0;} }
.edb-shard { position:fixed; width:10px; height:5px; border-radius:2px; background:linear-gradient(90deg,#8b1a1a,#c83030); pointer-events:none; z-index:99999; animation:edb-shard-fly .65s cubic-bezier(.22,1,.36,1) forwards; box-shadow:0 0 6px rgba(139,26,26,.6); }
.edb-shard-gold { background:linear-gradient(90deg,#f0b030,#ffd060); box-shadow:0 0 6px rgba(240,176,48,.6); }
@keyframes edb-num-bounce { 0%{transform:scale(1);} 30%{transform:scale(1.45) rotate(-4deg);} 60%{transform:scale(0.85) rotate(3deg);} 80%{transform:scale(1.12) rotate(-1deg);} 100%{transform:scale(1);} }
.edb-num-bounce { animation:edb-num-bounce .55s cubic-bezier(.22,1,.36,1); }
.edb-emoji-float { position:fixed; font-size:22px; pointer-events:none; z-index:99999; animation:edb-emoji-up .9s cubic-bezier(.22,1,.36,1) forwards; }
@keyframes edb-emoji-up { 0%{opacity:1;transform:translateY(0) scale(1) rotate(0deg);} 100%{opacity:0;transform:translateY(-90px) scale(1.6) rotate(var(--er,20deg));} }
.edb-firework { position:fixed; width:6px; height:6px; border-radius:50%; pointer-events:none; z-index:99999; animation:edb-firework-fly .8s cubic-bezier(.22,1,.36,1) forwards; }
@keyframes edb-firework-fly { 0%{transform:translate(0,0) scale(1);opacity:1;} 100%{transform:translate(var(--fx),var(--fy)) scale(0);opacity:0;} }
.edb-stat-tooltip { position:absolute; bottom:calc(100% + 8px); left:50%; transform:translateX(-50%); background:#1a0505; color:#fff; font-size:10px; font-weight:600; letter-spacing:.3px; padding:5px 12px; border-radius:8px; white-space:nowrap; z-index:20; pointer-events:none; animation:edb-tip-in .2s ease both; box-shadow:0 4px 16px rgba(0,0,0,.3); }
.edb-stat-tooltip::after { content:''; position:absolute; top:100%; left:50%; transform:translateX(-50%); border:5px solid transparent; border-top-color:#1a0505; }
@keyframes edb-tip-in { from{opacity:0;transform:translateX(-50%) translateY(4px);}to{opacity:1;transform:translateX(-50%) translateY(0);} }

/* ── DEVS TEASER CARD ────────────────────────────────────── */
.edb-devs-teaser {
  position:relative; overflow:hidden;
  background:linear-gradient(145deg,#fff0f8 0%,#ffe4f2 35%,#ffd6ee 70%,#ffe8f4 100%);
  border:2px solid #f9b8d8; border-radius:20px;
  padding:28px 40px; margin-bottom:20px;
  box-shadow:0 10px 48px rgba(240,80,160,.14),0 2px 10px rgba(220,60,140,.08);
  display:flex; align-items:center; justify-content:space-between; gap:24px; flex-wrap:wrap;
  cursor:pointer; transition:transform .25s,box-shadow .25s;
}
.edb-devs-teaser:hover { transform:translateY(-4px); box-shadow:0 18px 60px rgba(240,80,160,.22); }
.edb-teaser-blobs { position:absolute; inset:0; pointer-events:none; overflow:hidden; }
.edb-teaser-blob { position:absolute; border-radius:50%; filter:blur(60px); }
.edb-teaser-blob1 { width:260px; height:260px; background:#ffb3d9; opacity:.3; top:-80px; right:-60px; }
.edb-teaser-blob2 { width:180px; height:180px; background:#ff9ec8; opacity:.2; bottom:-60px; left:-40px; }
.edb-devs-teaser-left { position:relative; z-index:1; }
.edb-devs-teaser-eyebrow { font-size:9px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:#d44090; margin-bottom:6px; }
.edb-devs-teaser-title { font-family:'Playfair Display',Georgia,serif; font-size:1.9rem; font-weight:800; background:linear-gradient(100deg,#c01870,#e84090,#d02080); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin-bottom:6px; }
.edb-devs-teaser-sub { font-size:12px; color:#c05090; }
.edb-devs-teaser-right { position:relative; z-index:1; display:flex; align-items:center; gap:16px; }
.edb-devs-teaser-avatars { display:flex; }
.edb-devs-teaser-avatar { width:56px; height:56px; border-radius:50%; object-fit:cover; object-position:top center; border:3px solid #fff; box-shadow:0 4px 14px rgba(230,60,140,.3); background:#ffe0f0; margin-left:-14px; transition:transform .2s; }
.edb-devs-teaser-avatar:first-child { margin-left:0; }
.edb-devs-teaser-avatars:hover .edb-devs-teaser-avatar { transform:translateY(-4px); }
.edb-devs-teaser-btn { background:linear-gradient(135deg,#e84090,#c01870); color:#fff; border:none; border-radius:12px; padding:10px 22px; font-size:11.5px; font-weight:700; letter-spacing:.4px; cursor:pointer; transition:transform .2s,box-shadow .2s; box-shadow:0 4px 16px rgba(200,40,120,.3); white-space:nowrap; }
.edb-devs-teaser-btn:hover { transform:scale(1.06); box-shadow:0 8px 24px rgba(200,40,120,.4); }

/* ── DEVS MODAL ──────────────────────────────────────────── */
.edb-devs-overlay { position:fixed; inset:0; z-index:99990; background:rgba(10,0,10,.75); backdrop-filter:blur(12px); display:flex; align-items:center; justify-content:center; padding:20px; animation:edb-overlay-in .3s ease both; }
@keyframes edb-overlay-in { from{opacity:0;} to{opacity:1;} }
.edb-devs-modal { position:relative; z-index:99991; background:linear-gradient(145deg,#fff0f8 0%,#ffe4f2 40%,#ffd6ee 75%,#ffe8f4 100%); border:2px solid #f9b8d8; border-radius:28px; padding:48px 44px 44px; width:100%; max-width:720px; box-shadow:0 32px 96px rgba(240,60,160,.25),0 4px 20px rgba(0,0,0,.15); animation:edb-modal-pop .4s cubic-bezier(.22,1,.36,1) both; overflow:hidden; max-height:92vh; overflow-y:auto; }@keyframes edb-modal-pop { from{opacity:0;transform:scale(.85) translateY(30px);} to{opacity:1;transform:none;} }
.edb-modal-blobs { position:absolute; inset:0; pointer-events:none; overflow:hidden; }
.edb-modal-blob { position:absolute; border-radius:50%; filter:blur(70px); }
.edb-modal-blob1 { width:380px; height:380px; background:#ffb3d9; opacity:.3; top:-120px; right:-100px; }
.edb-modal-blob2 { width:280px; height:280px; background:#ff9ec8; opacity:.22; bottom:-90px; left:-70px; }
.edb-modal-blob3 { width:200px; height:200px; background:#ffd6ec; opacity:.3; top:40%; left:30%; }
.edb-devs-modal-close { position:absolute; top:18px; right:22px; z-index:10; background:rgba(255,255,255,.7); border:1.5px solid #f9b8d8; color:#c01870; width:34px; height:34px; border-radius:50%; font-size:16px; font-weight:800; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .2s,transform .2s; box-shadow:0 2px 8px rgba(200,40,120,.2); }
.edb-devs-modal-close:hover { background:#fff; transform:rotate(90deg) scale(1.1); }
.edb-devs-modal-eyebrow { position:relative; z-index:1; font-size:9px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:#d44090; margin-bottom:6px; text-align:center; }
.edb-devs-modal-title { position:relative; z-index:1; font-family:'Playfair Display',Georgia,serif; font-size:2.4rem; font-weight:800; background:linear-gradient(100deg,#c01870,#e84090,#d02080); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin-bottom:4px; text-align:center; }
.edb-devs-modal-sub { position:relative; z-index:1; font-size:12.5px; color:#c05090; margin-bottom:36px; text-align:center; }
.edb-devs-grid-modal { position:relative; z-index:1; display:grid; grid-template-columns:1fr 1fr; gap:24px; }
@media(max-width:560px){ .edb-devs-grid-modal{ grid-template-columns:1fr; } }
.edb-dev-card-modal { background:#fff; border-radius:22px; overflow:hidden; box-shadow:0 8px 36px rgba(230,60,140,.18),0 1px 6px rgba(210,40,120,.1); border:2px solid #ffc8e0; transition:transform .3s cubic-bezier(.22,1,.36,1),box-shadow .3s; position:relative; cursor:pointer; display:flex; flex-direction:column; }
.edb-dev-card-modal:hover { transform:translateY(-8px) rotate(.3deg); box-shadow:0 24px 60px rgba(230,60,140,.28); }
.edb-dev-ribbon-modal { height:88px; background:linear-gradient(135deg,#ffd6ec 0%,#ffb0ce 100%); position:relative; flex-shrink:0; }
.edb-dev-shimmer-modal { position:absolute; inset:-100%; background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.5) 50%,transparent 60%); animation:edb-shimmer 3.5s 1s infinite; }
@keyframes edb-shimmer { 0%{transform:translateX(-60%) translateY(-60%);}100%{transform:translateX(60%) translateY(60%);} }
.edb-dev-avatar-wrap-modal { position:relative; z-index:1; width:110px; height:110px; margin:-55px auto 14px; }
.edb-dev-avatar-modal { width:110px; height:110px; border-radius:50%; object-fit:cover; object-position:top center; border:4px solid #fff; box-shadow:0 6px 24px rgba(230,60,140,.3); background:#ffe0f0; display:block; transition:transform .3s cubic-bezier(.22,1,.36,1); }
.edb-dev-card-modal:hover .edb-dev-avatar-modal { transform:scale(1.08) rotate(-2deg); }
.edb-dev-ring-modal { position:absolute; inset:-5px; border-radius:50%; background:conic-gradient(#ff80b8,#ff40a0,#e8208e,#ff40a0,#ff80b8); z-index:-1; animation:edb-spin-modal 7s linear infinite; }
@keyframes edb-spin-modal { to{transform:rotate(360deg)} }
.edb-dev-card-modal:hover .edb-dev-ring-modal { animation:edb-spin-modal .8s linear infinite; }
.edb-dev-content-modal { padding:0 22px 24px; flex:1; display:flex; flex-direction:column; align-items:center; text-align:center; }
.edb-dev-tag-modal { display:inline-block; background:linear-gradient(90deg,#ffd6ec,#ffb0d8); color:#b01860; font-size:9px; font-weight:800; letter-spacing:1.2px; text-transform:uppercase; padding:4px 12px; border-radius:20px; margin-bottom:8px; }
.edb-dev-name-modal { font-family:'Playfair Display',Georgia,serif; font-size:1.2rem; font-weight:800; color:#7a1040; margin-bottom:8px; line-height:1.2; }
.edb-dev-bio-modal { font-size:11px; color:#a04878; line-height:1.75; margin-bottom:14px; flex:1; }
.edb-dev-skills-modal { display:flex; flex-wrap:wrap; gap:5px; justify-content:center; margin-bottom:12px; }
.edb-dev-skill-modal { background:#ffe0f0; color:#b02060; border:1px solid #ffb8d8; font-size:9px; font-weight:700; letter-spacing:.3px; padding:3px 9px; border-radius:20px; }
.edb-dev-hearts-modal { font-size:16px; letter-spacing:4px; animation:edb-heartbeat 2.2s ease-in-out infinite; }
@keyframes edb-heartbeat { 0%,100%{transform:scale(1)}50%{transform:scale(1.14)} }
.edb-devs-modal-footer { position:relative; z-index:1; display:flex; align-items:center; gap:16px; margin-top:28px; }
.edb-devs-footer-line { flex:1; height:1px; background:linear-gradient(90deg,transparent,#f0a0cc,transparent); }
.edb-devs-footer-text { font-size:10px; color:#c06090; white-space:nowrap; font-weight:600; letter-spacing:.4px; }
.edb-photo-confetti { position:fixed; width:8px; height:8px; border-radius:50%; pointer-events:none; z-index:99999; animation:edb-confetti-fly .8s cubic-bezier(.22,1,.36,1) forwards; }
@keyframes edb-confetti-fly { 0%{transform:translate(0,0) scale(1) rotate(0deg);opacity:1;} 100%{transform:translate(var(--cx),var(--cy)) scale(0) rotate(var(--cr,360deg));opacity:0;} }
.edb-sparkle-ring { position:absolute; inset:-4px; border-radius:50%; border:3px solid #ff80b8; pointer-events:none; animation:edb-sparkle-ring .6s ease-out forwards; z-index:5; }
@keyframes edb-sparkle-ring { 0%{transform:scale(.5);opacity:1;} 100%{transform:scale(2.5);opacity:0;} }
.edb-star-burst { position:fixed; font-size:20px; pointer-events:none; z-index:99999; animation:edb-star-up .8s cubic-bezier(.22,1,.36,1) forwards; }
@keyframes edb-star-up { 0%{opacity:1;transform:translateY(0) scale(1);} 100%{opacity:0;transform:translateY(var(--sy,-80px)) scale(1.8) rotate(var(--sr,30deg));} }
@keyframes edb-card-wobble { 0%,100%{transform:translateY(-8px) rotate(.3deg);} 25%{transform:translateY(-8px) rotate(-3deg) scale(1.03);} 50%{transform:translateY(-8px) rotate(3deg) scale(1.03);} 75%{transform:translateY(-8px) rotate(-2deg) scale(1.01);} }
.edb-dev-card-modal.wobbling { animation:edb-card-wobble .5s ease; }

/* ── Responsive ─────────────────────────────────────────────── */
@media(max-width:700px){
  .edb-hero { padding:26px 22px; }
  .edb-hero-title { font-size:1.9rem; }
  .edb-why { padding:30px 20px; }
  .edb-why-title { font-size:1.5rem; }
  .edb-devs-teaser { padding:22px 20px; }
  .edb-devs-teaser-title { font-size:1.4rem; }
  .edb-hero-right { display:none; }
  .edb-wrap { padding:12px 14px; }
}
/* ── SPECIAL THANKS SECTION ─────────────────────────────────── */
.edb-thanks {
  position: relative; overflow: hidden;
  background: linear-gradient(145deg, #0a0c18 0%, #0e1428 40%, #111830 100%);
  border-radius: 20px; padding: 44px 44px 40px;
  margin-bottom: 24px;
  box-shadow: 0 10px 48px rgba(0,0,0,.35),
              inset 0 1px 0 rgba(180,160,80,.12),
              inset 0 -1px 0 rgba(0,0,0,.5);
  border: 1px solid rgba(180,160,60,.25);
}
.edb-thanks-pattern {
  position: absolute; inset: 0; pointer-events: none;
  background-image:
    radial-gradient(circle at 1px 1px, rgba(255,255,255,.025) 1px, transparent 0),
    repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(180,160,40,.05) 80px, rgba(180,160,40,.05) 81px);
  background-size: 28px 28px, 100% 100%;
}
.edb-thanks-inner { position: relative; z-index: 1; }
.edb-thanks-eyebrow {
  font-size: 9px; font-weight: 700; letter-spacing: 3px;
  text-transform: uppercase; color: #c8a840; margin-bottom: 8px;
  text-shadow: 0 0 12px rgba(200,168,64,.4);
}
.edb-thanks-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2rem; font-weight: 800; color: #fff;
  margin-bottom: 8px; letter-spacing: -.3px;
  text-shadow: 0 2px 16px rgba(0,0,0,.5);
}
.edb-thanks-sub {
  font-size: 12px; color: rgba(255,255,255,.4);
  margin-bottom: 32px; line-height: 1.6;
}
.edb-thanks-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
@media (max-width: 700px) { .edb-thanks-grid { grid-template-columns: 1fr; } }
.edb-thanks-card {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(200,168,60,.2);
  border-radius: 16px; padding: 26px 24px;
  display: flex; align-items: flex-start; gap: 18px;
  transition: background .22s, transform .22s, border-color .22s;
  position: relative; overflow: hidden;
}
.edb-thanks-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, rgba(200,168,60,.5), transparent);
  border-radius: 16px 16px 0 0;
}
.edb-thanks-card:hover {
  background: rgba(255,255,255,.07);
  border-color: rgba(200,168,60,.4);
  transform: translateY(-4px);
}
.edb-thanks-avatar {
  width: 72px; height: 72px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, #1e3a6e, #4a7cc7);
  display: flex; align-items: center; justify-content: center;
  font-size: 26px; font-weight: 800; color: #fff;
  border: 3px solid rgba(200,168,60,.35);
  box-shadow: 0 4px 18px rgba(0,0,0,.4), 0 0 0 0 rgba(200,168,60,.2);
  font-family: 'Playfair Display', serif;
}
.edb-thanks-body { flex: 1; min-width: 0; }
.edb-thanks-badge {
  display: inline-block;
  background: rgba(200,168,60,.15);
  border: 1px solid rgba(200,168,60,.3);
  color: #c8a840; font-size: 8.5px; font-weight: 800;
  letter-spacing: 1.2px; text-transform: uppercase;
  padding: 3px 10px; border-radius: 20px; margin-bottom: 8px;
}
.edb-thanks-name {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.1rem; font-weight: 800; color: #fff;
  margin-bottom: 4px; line-height: 1.2;
}
.edb-thanks-role {
  font-size: 10.5px; color: rgba(255,255,255,.45);
  font-weight: 600; letter-spacing: .3px; margin-bottom: 10px;
}
.edb-thanks-desc {
  font-size: 11.5px; color: rgba(255,255,255,.5);
  line-height: 1.75;
}
.edb-thanks-quote {
  margin-top: 12px;
  padding: 10px 14px;
  background: rgba(200,168,60,.07);
  border-left: 3px solid rgba(200,168,60,.4);
  border-radius: 0 8px 8px 0;
  font-size: 11px; color: rgba(200,168,60,.8);
  font-style: italic; line-height: 1.6;
}
.edb-thanks-footer {
  position: relative; z-index: 1;
  display: flex; align-items: center; gap: 16px;
  margin-top: 28px;
}
.edb-thanks-footer-line {
  flex: 1; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(200,168,60,.3), transparent);
}
.edb-thanks-footer-text {
  font-size: 10px; color: rgba(200,168,60,.5);
  white-space: nowrap; font-weight: 600; letter-spacing: .4px;
}
  `;
  document.head.appendChild(s);
})();

/* ── Helpers ─────────────────────────────────────────────────── */
function _esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function _monthLabel() {
  return new Date().toLocaleDateString('en-PH',{month:'long',year:'numeric'});
}
function _initials(surname,given) {
  return ((surname||'').charAt(0)+(given||'').charAt(0)).toUpperCase()||'?';
}

/* ── EFFECT FUNCTIONS ───────────────────────────────────────── */
function _edbExplode(el, variant) {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
  for (let i = 0; i < 14; i++) {
    const shard = document.createElement('div');
    shard.className = 'edb-shard' + (variant === 'gold' ? ' edb-shard-gold' : '');
    const angle = (i / 14) * 360, dist = 60 + Math.random() * 80;
    const rad = angle * Math.PI / 180;
    shard.style.cssText = `left:${cx}px;top:${cy}px;--tx:${Math.cos(rad)*dist}px;--ty:${Math.sin(rad)*dist}px;--tr:${(Math.random()-.5)*720}deg;`;
    document.body.appendChild(shard);
    setTimeout(() => shard.remove(), 700);
  }
  const wave = document.createElement('div');
  wave.className = 'edb-shockwave';
  el.appendChild(wave);
  setTimeout(() => wave.remove(), 500);
}

function _edbFloatEmoji(el, emojis) {
  const rect = el.getBoundingClientRect();
  const floater = document.createElement('div');
  floater.className = 'edb-emoji-float';
  floater.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  const ox = (Math.random() - .5) * 60;
  floater.style.cssText = `left:${rect.left + rect.width/2 + ox}px;top:${rect.top}px;--er:${(Math.random()-.5)*40}deg;`;
  document.body.appendChild(floater);
  setTimeout(() => floater.remove(), 1000);
}

function _edbFireworks(el, color) {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
  for (let i = 0; i < 18; i++) {
    const fw = document.createElement('div');
    fw.className = 'edb-firework';
    const angle = (i / 18) * 360, dist = 50 + Math.random() * 70;
    const rad = angle * Math.PI / 180;
    fw.style.cssText = `left:${cx}px;top:${cy}px;--fx:${Math.cos(rad)*dist}px;--fy:${Math.sin(rad)*dist}px;background:${color||'#f0b030'};`;
    document.body.appendChild(fw);
    setTimeout(() => fw.remove(), 900);
  }
}

function _edbBounceNum(el) {
  const numEl = el.querySelector('.edb-stat-num');
  if (!numEl) return;
  numEl.classList.remove('edb-num-bounce');
  void numEl.offsetWidth;
  numEl.classList.add('edb-num-bounce');
  setTimeout(() => numEl.classList.remove('edb-num-bounce'), 600);
}

function _edbShowTooltip(el, text) {
  el.querySelectorAll('.edb-stat-tooltip').forEach(t => t.remove());
  const tip = document.createElement('div');
  tip.className = 'edb-stat-tooltip';
  tip.textContent = text;
  el.style.position = 'relative';
  el.appendChild(tip);
  setTimeout(() => tip.remove(), 2200);
}

function _edbWireDevCard(card, confettiColors, starEmojis) {
  const avatarWrap = card.querySelector('.edb-dev-avatar-wrap-modal');
  const avatar     = card.querySelector('.edb-dev-avatar-modal');
  if (!avatar || !avatarWrap) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - .5;
    const y = (e.clientY - rect.top)  / rect.height - .5;
    card.style.transform = `translateY(-8px) rotateY(${x*14}deg) rotateX(${-y*10}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });

  avatar.addEventListener('click', (e) => {
    e.stopPropagation();
    const rect = avatarWrap.getBoundingClientRect();
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;

    const ring = document.createElement('div');
    ring.className = 'edb-sparkle-ring';
    avatarWrap.appendChild(ring);
    setTimeout(() => ring.remove(), 700);

    for (let i = 0; i < 22; i++) {
      const c = document.createElement('div');
      c.className = 'edb-photo-confetti';
      c.style.background = confettiColors[i % confettiColors.length];
      const angle = (i / 22) * 360 + Math.random() * 16;
      const dist  = 50 + Math.random() * 90;
      const rad   = angle * Math.PI / 180;
      c.style.cssText += `left:${cx}px;top:${cy}px;--cx:${Math.cos(rad)*dist}px;--cy:${Math.sin(rad)*dist}px;--cr:${(Math.random()-.5)*720}deg;`;
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 900);
    }
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const star = document.createElement('div');
        star.className = 'edb-star-burst';
        star.textContent = starEmojis[Math.floor(Math.random() * starEmojis.length)];
        const ox = (Math.random() - .5) * 80;
        star.style.cssText = `left:${cx+ox}px;top:${cy}px;--sy:${-(60+Math.random()*50)}px;--sr:${(Math.random()-.5)*60}deg;`;
        document.body.appendChild(star);
        setTimeout(() => star.remove(), 900);
      }, i * 80);
    }
    card.classList.remove('wobbling');
    void card.offsetWidth;
    card.classList.add('wobbling');
    setTimeout(() => card.classList.remove('wobbling'), 600);
  });
}

function _edbOpenDevsModal() {
  if (document.getElementById('edb-devs-overlay')) return;
  const overlay = document.createElement('div');
  overlay.className = 'edb-devs-overlay';
  overlay.id = 'edb-devs-overlay';
  overlay.innerHTML = `
    <div class="edb-devs-modal" id="edb-devs-modal">
      <div class="edb-modal-blobs">
        <div class="edb-modal-blob edb-modal-blob1"></div>
        <div class="edb-modal-blob edb-modal-blob2"></div>
        <div class="edb-modal-blob edb-modal-blob3"></div>
      </div>
      <button class="edb-devs-modal-close" id="edb-devs-modal-close">✕</button>
      <div class="edb-devs-modal-eyebrow">🩷 MADE WITH LOVE</div>
      <div class="edb-devs-modal-title">Meet the Developers</div>
      <p class="edb-devs-modal-sub">The two humans who stayed up late so HR could sleep early ✨<br><small style="opacity:.7;">Click on a photo for a surprise! 🎉</small></p>
      <div class="edb-devs-grid-modal">
        <div class="edb-dev-card-modal" id="edb-dev-jeoan">
          <div class="edb-dev-ribbon-modal"><div class="edb-dev-shimmer-modal"></div></div>
          <div class="edb-dev-avatar-wrap-modal">
            <div class="edb-dev-ring-modal"></div>
            <img class="edb-dev-avatar-modal" src="/img/jeoan.jpg"
                 onerror="this.src='https://ui-avatars.com/api/?name=Jeoan+Gran&background=ffd6ec&color=b01860&size=200&bold=true'" alt="Jeoan"/>
          </div>
          <div class="edb-dev-content-modal">
            <div class="edb-dev-tag-modal">Frontend Developer</div>
            <div class="edb-dev-name-modal">Jeoan Gwyneth Dajay Gran</div>
            <div class="edb-dev-bio-modal">Designed every pixel of this system — from the deep crimson headers to the buttery gold balance cells. She also architected the entire leave computation logic: how credits are earned, deducted, forfeited, and monetized.</div>
            <div class="edb-dev-skills-modal">
              <span class="edb-dev-skill-modal">🎨 UI Design</span>
              <span class="edb-dev-skill-modal">💅 CSS/HTML</span>
              <span class="edb-dev-skill-modal">🧮 Leave Logic</span>
            </div>
            <div class="edb-dev-hearts-modal">🩷 🌸 🩷</div>
          </div>
        </div>
        <div class="edb-dev-card-modal" id="edb-dev-janice">
          <div class="edb-dev-ribbon-modal"><div class="edb-dev-shimmer-modal"></div></div>
          <div class="edb-dev-avatar-wrap-modal">
            <div class="edb-dev-ring-modal"></div>
            <img class="edb-dev-avatar-modal" src="/img/janice.jpg"
                 onerror="this.src='https://ui-avatars.com/api/?name=Janice+Laveros&background=ffd6ec&color=b01860&size=200&bold=true'" alt="Janice"/>
          </div>
          <div class="edb-dev-content-modal">
            <div class="edb-dev-tag-modal">Backend Developer</div>
            <div class="edb-dev-name-modal">Janice Luis Laveros</div>
            <div class="edb-dev-bio-modal">Built the engine that makes it all run — database schema, API routes, server logic, and the data pipelines that connect every part of the system. Every accrual, deduction, and balance entry flows through her backend.</div>
            <div class="edb-dev-skills-modal">
              <span class="edb-dev-skill-modal">🗄️ Database</span>
              <span class="edb-dev-skill-modal">⚙️ API Logic</span>
              <span class="edb-dev-skill-modal">🔧 Server</span>
            </div>
            <div class="edb-dev-hearts-modal">🩷 🌺 🩷</div>
          </div>
        </div>
      </div>
<!-- ── Special Thanks ── -->
      <div class="edb-thanks" style="margin-top:28px;padding:28px 26px 24px;border-radius:16px;">
        <div class="edb-thanks-pattern"></div>
        <div class="edb-thanks-inner">
          <div class="edb-thanks-eyebrow">🏅 WITH GRATITUDE</div>
          <h2 class="edb-thanks-title" style="font-size:1.5rem;margin-bottom:6px;">Special Thanks</h2>
          <p class="edb-thanks-sub" style="margin-bottom:20px;">
            This system would not exist without the vision and trust of these two remarkable individuals.
          </p>
          <div class="edb-thanks-grid">

            <!-- Sir Faizal -->
            <div class="edb-thanks-card">
              <div class="edb-thanks-avatar">FM</div>
              <div class="edb-thanks-body">
                <div class="edb-thanks-badge">🏢 HR Administration</div>
                <div class="edb-thanks-name">Sir Faizal B. Macasayon</div>
                <div class="edb-thanks-role">Administrative Officer IV / HRMO</div>
                <div class="edb-thanks-desc">
                  The first believer. Sir Fyke championed this system from proposal to deployment —
                  trusting two developers to modernize a process done by hand for decades.
                </div>
                <div class="edb-thanks-quote">
                  "He opened the door for digital leave management in SDO Koronadal City." 🗝️
                </div>
              </div>
            </div>

            <!-- Sir Gregory -->
            <div class="edb-thanks-card">
              <div class="edb-thanks-avatar" style="background:linear-gradient(135deg,#065f46,#059669);">GJ</div>
              <div class="edb-thanks-body">
                <div class="edb-thanks-badge" style="background:rgba(5,150,105,.15);border-color:rgba(5,150,105,.3);color:#10b981;">📐 Consultancy</div>
                <div class="edb-thanks-name">Sir John Gregory D. Jabido</div>
                <div class="edb-thanks-role">Education Program Supervisor</div>
                <div class="edb-thanks-desc">
                  Our systems consultant and compass. Sir Greg's guidance transformed a functional
                  tool into a reliable, well-designed system built for everyone here.
                </div>
                <div class="edb-thanks-quote" style="border-left-color:rgba(5,150,105,.4);color:rgba(16,185,129,.8);">
                  "He shaped what 'better' looks like for every feature in this system." ✨
                </div>
              </div>
            </div>

          </div>
          <div class="edb-thanks-footer">
            <div class="edb-thanks-footer-line"></div>
            <span class="edb-thanks-footer-text">SDO Koronadal City · Thank you for making this possible 🙏</span>
            <div class="edb-thanks-footer-line"></div>
          </div>
        </div>
      </div><!-- /.edb-thanks -->

      <div class="edb-devs-modal-footer">
        <div class="edb-devs-footer-line"></div>
        <span class="edb-devs-footer-text">SDO Koronadal City · Leave Card Management System · Built with 🩷</span>
        <div class="edb-devs-footer-line"></div>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  overlay.addEventListener('click', (e) => { if (e.target === overlay) _edbCloseDevsModal(); });
  document.getElementById('edb-devs-modal-close')?.addEventListener('click', _edbCloseDevsModal);
  const escH = (e) => { if (e.key === 'Escape') { _edbCloseDevsModal(); document.removeEventListener('keydown', escH); } };
  document.addEventListener('keydown', escH);

  _edbWireDevCard(document.getElementById('edb-dev-jeoan'),  ['#ff80b8','#ffd6ec','#ff40a0','#ffe0f0','#e8208e','#ffb3d9'], ['🌸','🩷','✨','🎨','💕','⭐']);
  _edbWireDevCard(document.getElementById('edb-dev-janice'), ['#a78bfa','#fbbf24','#34d399','#f472b6','#60a5fa','#fb923c'], ['🌺','💜','✨','⚙️','💚','🌟']);

  setTimeout(() => {
    const modal = document.getElementById('edb-devs-modal');
    if (modal) {
      _edbFireworks(modal, '#ff80b8');
      for (let i = 0; i < 6; i++) setTimeout(() => _edbFloatEmoji(modal, ['🩷','🌸','✨','💕','🌺','🎉']), i * 100);
    }
  }, 300);
}

function _edbCloseDevsModal() {
  const overlay = document.getElementById('edb-devs-overlay');
  if (!overlay) return;
  overlay.style.transition = 'opacity .25s ease';
  overlay.style.opacity = '0';
  setTimeout(() => overlay.remove(), 260);
}

/* ── renderHomeDashboard ─────────────────────────────────────── */
function renderHomeDashboard() {
  const el = document.getElementById('pg-home');
  if (!el) return;

  const all         = (window.state && window.state.db) || [];
  const active      = all.filter(e => (e.account_status||'active') !== 'inactive');
  const inactive    = all.length - active.length;
  const teaching    = all.filter(e => (e.status||'').toLowerCase() === 'teaching').length;
  const nonTeaching = all.filter(e => (e.status||'').toLowerCase() === 'non-teaching').length;
  const teachingRel = all.filter(e => (e.status||'').toLowerCase() === 'teaching related').length;
  const month       = _monthLabel();

  const _isUpdated = (typeof window.isEmpCardUpdated === 'function')
    ? (e) => window.isEmpCardUpdated(e)
    : () => false;

  const updatedList = [], pendingList = [];
  const byName = arr => [...arr].sort((a,b) => (a.surname||'').localeCompare(b.surname||''));

  for (const e of active) {
    if (_isUpdated(e)) updatedList.push(e);
    else               pendingList.push(e);
  }

  const updated = byName(updatedList);
  const pending = byName(pendingList);
  const pct = active.length ? Math.round(updated.length / active.length * 100) : 0;

  const s = window.state || {};
  const roleName =
    s.role === 'admin'        ? (s.adminCfg||{}).name        || 'Administrator'
    : s.role === 'encoder'    ? (s.encoderCfg||{}).name      || 'Encoder'
    : s.role === 'school_admin' ? (s.schoolAdminCfg||{}).name || 'School Admin'
    : 'User';

  const R = 52, CIRC = 2 * Math.PI * R;
  const offset = CIRC - (pct / 100) * CIRC;
  const maxCat = Math.max(teaching, nonTeaching, teachingRel, 1);

  const activities = [
    { dot:'#10b981', label:`${updated.length} card${updated.length!==1?'s':''} updated this month`,   sub:month,                val: updated.length ? `${pct}%` : '—' },
    { dot:'#f87171', label:`${pending.length} card${pending.length!==1?'s':''} pending update`,        sub:'Requires attention', val: pending.length || '—' },
    { dot:'#4a7cc7', label:`${teaching} Teaching personnel`,                                           sub:'Active records',     val: '' },
    { dot:'#c83030', label:`${nonTeaching} Non-Teaching personnel`,                                    sub:'Active records',     val: '' },
    { dot:'#ea7b3a', label:`${teachingRel} Teaching Related personnel`,                                sub:'Active records',     val: '' },
    { dot:'#94a3b8', label:`${inactive} Inactive account${inactive!==1?'s':''}`,                      sub:'Archived',           val: '' },
  ];

  /* ── Render HTML ─────────────────────────────────────────── */
  el.innerHTML = `
<div class="edb-wrap">

<!-- ── HERO ────────────────────────────────────────────────── -->
<div class="edb-hero">
  <div class="edb-hero-bg-img"></div>
  <div class="edb-hero-grain"></div>
  <div class="edb-hero-rivets"></div>
  <div class="edb-hero-orbs">
    <div class="edb-orb edb-orb1"></div>
    <div class="edb-orb edb-orb2"></div>
    <div class="edb-orb edb-orb3"></div>
  </div>
  <div class="edb-hero-content">
    <div class="edb-hero-left">
      <div class="edb-hero-eyebrow">
        <span class="edb-hero-pulse"></span>
        LEAVE MANAGEMENT SYSTEM · SDO KORONADAL CITY
      </div>
      <h1 class="edb-hero-title">
        Welcome back,<br>
        <span class="edb-hero-name">${_esc(roleName)}</span>
      </h1>
      <p class="edb-hero-meta">📅 ${_esc(month)} · Dashboard Overview · ${all.length} Total Personnel</p>
    </div>
    <div class="edb-hero-right">
      <div class="edb-quick-tile" id="hero-goto-cards">
        <div class="edb-quick-tile-icon">📋</div>
        <div>
          <div class="edb-quick-tile-text">Leave Cards</div>
          <div class="edb-quick-tile-sub">${pending.length} pending update</div>
        </div>
      </div>
      <div class="edb-quick-tile" id="hero-goto-list">
        <div class="edb-quick-tile-icon">👥</div>
        <div>
          <div class="edb-quick-tile-text">Personnel List</div>
          <div class="edb-quick-tile-sub">${active.length} active members</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ── MONTH BADGE ───────────────────────────────────────────── -->
<div class="edb-month-badge">
  📅 Showing data for <strong style="margin-left:4px;">${_esc(month)}</strong>
</div>

<!-- ── STAT CARDS ────────────────────────────────────────────── -->
<div class="edb-stats">
  <div class="edb-stat" style="--ds-accent:#8b1a1a;--ds-soft:#fce8e8;">
    <div class="edb-stat-icon">👥</div>
    <div class="edb-stat-num">${all.length}</div>
    <div class="edb-stat-label">Total Personnel</div>
    <div class="edb-stat-glow"></div>
  </div>
  <div class="edb-stat" style="--ds-accent:#1e3a6e;--ds-soft:#ddeeff;">
    <div class="edb-stat-icon">🏫</div>
    <div class="edb-stat-num">${teaching}</div>
    <div class="edb-stat-label">Teaching</div>
    <div class="edb-stat-glow"></div>
  </div>
  <div class="edb-stat" style="--ds-accent:#7c1a1a;--ds-soft:#fdf0e6;">
    <div class="edb-stat-icon">📊</div>
    <div class="edb-stat-num">${nonTeaching}</div>
    <div class="edb-stat-label">Non-Teaching</div>
    <div class="edb-stat-glow"></div>
  </div>
  <div class="edb-stat" style="--ds-accent:#78350f;--ds-soft:#fef3c7;">
    <div class="edb-stat-icon">🔗</div>
    <div class="edb-stat-num">${teachingRel}</div>
    <div class="edb-stat-label">Teaching Related</div>
    <div class="edb-stat-glow"></div>
  </div>
  <!-- Clickable: Updated -->
  <div class="edb-stat clickable" id="edb-upd-btn" style="--ds-accent:#065f46;--ds-soft:#d1fae5;">
    <div class="edb-stat-icon" style="background:#d1fae5;">✅</div>
    <div class="edb-stat-num" style="color:#065f46;">${updated.length}</div>
    <div class="edb-stat-label">Updated · ${_esc(month)}</div>
    <div class="edb-stat-chevron" id="edb-upd-chev">›</div>
    <div class="edb-stat-glow" style="background:#065f46;"></div>
  </div>
  <!-- Clickable: Pending -->
  <div class="edb-stat clickable" id="edb-pen-btn" style="--ds-accent:#7f1d1d;--ds-soft:#fee2e2;">
    <div class="edb-stat-icon" style="background:#fee2e2;">⏳</div>
    <div class="edb-stat-num" style="color:#7f1d1d;">${pending.length}</div>
    <div class="edb-stat-label">Pending Update</div>
    <div class="edb-stat-chevron" id="edb-pen-chev">›</div>
    <div class="edb-stat-glow" style="background:#7f1d1d;"></div>
  </div>
</div>

<!-- ── DROPDOWN SLOTS ─────────────────────────────────────────── -->
<div id="edb-upd-dropdown" style="display:none;"></div>
<div id="edb-pen-dropdown" style="display:none;"></div>

<!-- ── CONTENT ROW ───────────────────────────────────────────── -->
<div class="edb-content-row">

  <!-- Progress ring -->
  <div class="edb-progress-card">
    <div class="edb-card-title">
      <span class="edb-card-title-dot"></span>
      📈 Month Completion Rate
    </div>
    <div class="edb-ring-wrap">
      <svg width="130" height="130" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="#7a1010"/>
            <stop offset="100%" stop-color="#d43030"/>
          </linearGradient>
        </defs>
        <circle class="edb-ring-track" cx="60" cy="60" r="${R}"/>
        <circle class="edb-ring-fill"  cx="60" cy="60" r="${R}"
          stroke-dasharray="${CIRC}" stroke-dashoffset="${offset}" id="edb-ring-fill-el"/>
        <text x="60" y="62" text-anchor="middle" dominant-baseline="middle" class="edb-ring-label">${pct}%</text>
        <text x="60" y="78" text-anchor="middle" class="edb-ring-sub">of ${active.length}</text>
      </svg>
    </div>
    <div class="edb-legend">
      <div class="edb-legend-row">
        <div class="edb-legend-dot" style="background:#10b981;"></div>
        <span class="edb-legend-text">Updated Cards</span>
        <span class="edb-legend-val">${updated.length}</span>
      </div>
      <div class="edb-legend-row">
        <div class="edb-legend-dot" style="background:#f87171;"></div>
        <span class="edb-legend-text">Pending Cards</span>
        <span class="edb-legend-val">${pending.length}</span>
      </div>
      <div class="edb-legend-row">
        <div class="edb-legend-dot" style="background:#e0e8f8; border:2px solid #93a8d8;"></div>
        <span class="edb-legend-text">Inactive</span>
        <span class="edb-legend-val">${inactive}</span>
      </div>
    </div>
  </div>

  <!-- Category bars -->
  <div class="edb-cat-card">
    <div class="edb-card-title">
      <span class="edb-card-title-dot"></span>
      👥 Personnel by Category
    </div>
    <div class="edb-bar-row">
      <div class="edb-bar-item">
        <div class="edb-bar-label-row">
          <span class="edb-bar-name">Teaching</span>
          <span class="edb-bar-count">${teaching} personnel</span>
        </div>
        <div class="edb-bar-track"><div class="edb-bar-fill t" id="bar-t" style="width:0%"></div></div>
      </div>
      <div class="edb-bar-item">
        <div class="edb-bar-label-row">
          <span class="edb-bar-name">Non-Teaching</span>
          <span class="edb-bar-count">${nonTeaching} personnel</span>
        </div>
        <div class="edb-bar-track"><div class="edb-bar-fill nt" id="bar-nt" style="width:0%"></div></div>
      </div>
      <div class="edb-bar-item">
        <div class="edb-bar-label-row">
          <span class="edb-bar-name">Teaching Related</span>
          <span class="edb-bar-count">${teachingRel} personnel</span>
        </div>
        <div class="edb-bar-track"><div class="edb-bar-fill tr" id="bar-tr" style="width:0%"></div></div>
      </div>
      <div class="edb-bar-item" style="margin-top:8px;padding-top:12px;border-top:1px solid #f5e8e8;">
        <div class="edb-bar-label-row">
          <span class="edb-bar-name" style="color:#7a8a9d;">Active Accounts</span>
          <span class="edb-bar-count">${active.length} of ${all.length}</span>
        </div>
        <div class="edb-bar-track">
          <div class="edb-bar-fill" id="bar-active" style="width:0%;background:linear-gradient(90deg,#065f46,#10b981);"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Activity summary -->
  <div class="edb-activity-card">
    <div class="edb-card-title">
      <span class="edb-card-title-dot"></span>
      📌 Summary Overview
    </div>
    <div class="edb-activity-list">
      ${activities.map(a => `
        <div class="edb-activity-item">
          <div class="edb-activity-dot" style="background:${a.dot};"></div>
          <div class="edb-activity-body">
            <div class="edb-activity-label">${_esc(a.label)}</div>
            <div class="edb-activity-sub">${_esc(a.sub)}</div>
          </div>
          ${a.val ? `<div class="edb-activity-val">${_esc(String(a.val))}</div>` : ''}
        </div>`).join('')}
    </div>
  </div>

</div><!-- /.edb-content-row -->

<!-- ── WHY WE BUILT THIS ──────────────────────────────────────── -->
<div class="edb-why">
  <div class="edb-why-pattern"></div>
  <div class="edb-why-inner">
    <div class="edb-why-eyebrow">📖 THE STORY BEHIND THE SYSTEM</div>
    <h2 class="edb-why-title">Built to End the Chaos</h2>
    <div class="edb-why-grid">
      <div class="edb-why-card">
        <div class="edb-why-card-icon">🗂️</div>
        <h3>The Cabinet Problem</h3>
        <p>Leave cards were buried inside physical filing cabinets. HR staff had to manually dig through hundreds of folders just to find a single employee's record — slow, error-prone, and exhausting.</p>
      </div>
      <div class="edb-why-card">
        <div class="edb-why-card-icon">🧮</div>
        <h3>Manual Computation Errors</h3>
        <p>HR officers were computing leave balances by hand. Miscalculations were common — costing employees their rightful leave credits and creating disputes that took days to resolve.</p>
      </div>
      <div class="edb-why-card">
        <div class="edb-why-card-icon">🚶‍♀️</div>
        <h3>The Office Stampede</h3>
        <p>Every leave balance check required a physical trip to the HR office — long queues, crowded corridors, and disrupted work schedules. A daily stampede nobody wanted.</p>
      </div>
      <div class="edb-why-card">
        <div class="edb-why-card-icon">💻</div>
        <h3>The Solution: This System</h3>
        <p>Employees now look up their leave cards online — anytime, anywhere. No more trips to the office. No more manual errors. Just clean, fast, reliable digital leave records for everyone.</p>
      </div>
    </div>
  </div>
</div>

<!-- ── DEVELOPERS INLINE DRAWER ─────────────────────────────────────── -->
<div id="edb-dev-drawer-mount"></div>

</div><!-- /.edb-wrap -->
`;
  /* ── Animate bars ─────────────────────────────────────────── */
  requestAnimationFrame(() => {
    setTimeout(() => {
      const bT      = document.getElementById('bar-t');
      const bNT     = document.getElementById('bar-nt');
      const bTR     = document.getElementById('bar-tr');
      const bActive = document.getElementById('bar-active');
      if (bT)      bT.style.width      = `${(teaching     / maxCat * 100).toFixed(1)}%`;
      if (bNT)     bNT.style.width     = `${(nonTeaching  / maxCat * 100).toFixed(1)}%`;
      if (bTR)     bTR.style.width     = `${(teachingRel  / maxCat * 100).toFixed(1)}%`;
      if (bActive) bActive.style.width = `${all.length ? (active.length / all.length * 100).toFixed(1) : 0}%`;
    }, 80);
  });

  /* ── Wire hero quick-action tiles ────────────────────────── */
  document.getElementById('hero-goto-cards')?.addEventListener('click', () => {
    if (typeof window.setPage === 'function') window.setPage('cards');
  });
  document.getElementById('hero-goto-list')?.addEventListener('click', () => {
    if (typeof window.setPage === 'function') window.setPage('list');
  });

  /* ── Dropdown builder ────────────────────────────────────── */
  function buildDropdown(list, type) {
    const isUpdated = type === 'updated';
    const title     = isUpdated ? '✅ Updated This Month' : '⏳ Pending Update';
    const badge     = `${list.length} employee${list.length!==1?'s':''}`;
    const badgeCls  = isUpdated ? 'green' : '';
    const dropId    = isUpdated ? 'edb-upd-dropdown' : 'edb-pen-dropdown';
    const rows = list.length === 0
      ? `<div class="edb-panel-empty"><span>${isUpdated ? '📭' : '🎉'}</span>${isUpdated ? 'No employees updated yet.' : 'All cards are up to date!'}</div>`
      : list.map(e => `
          <div class="edb-emp-row${isUpdated ? '' : ' link'}" ${isUpdated ? '' : `data-empid="${_esc(e.id)}"`}>
            <div class="edb-emp-avatar${isUpdated ? ' green' : ''}">${_esc(_initials(e.surname,e.given))}</div>
            <div class="edb-emp-info">
              <div class="edb-emp-name">${_esc(e.surname)}, ${_esc(e.given)}</div>
              <div class="edb-emp-school">${_esc(e.school||'')}</div>
            </div>
            <span class="edb-emp-status ${isUpdated?'ok':'pnd'}">${isUpdated?'Updated':'Pending'}</span>
            ${!isUpdated ? '<span class="edb-emp-arr">›</span>' : ''}
          </div>`).join('');
    return `
      <div class="edb-dropdown">
        <div class="edb-dropdown-head">
          <span class="edb-dropdown-title">${title} <span class="edb-dropdown-badge ${badgeCls}">${badge}</span></span>
          <button class="edb-dropdown-close" data-close-dropdown="${dropId}">✕</button>
        </div>
        <div class="edb-dropdown-body">${rows}</div>
      </div>`;
  } /* ← end buildDropdown */

  /* ── Wire stat card toggles ──────────────────────────────── */
  const updBtn  = document.getElementById('edb-upd-btn');
  const penBtn  = document.getElementById('edb-pen-btn');
  const updDrop = document.getElementById('edb-upd-dropdown');
  const penDrop = document.getElementById('edb-pen-dropdown');
  let updOpen = false, penOpen = false;

  updBtn?.addEventListener('click', () => {
    updOpen = !updOpen;
    if (updOpen) {
      updDrop.innerHTML = buildDropdown(updated, 'updated');
      updDrop.style.display = '';
      updBtn.classList.add('active-filter');
      penOpen = false; penDrop.style.display = 'none'; penBtn?.classList.remove('active-filter');
      wireClose();
    } else {
      updDrop.style.display = 'none'; updBtn.classList.remove('active-filter');
    }
  });

  penBtn?.addEventListener('click', () => {
    penOpen = !penOpen;
    if (penOpen) {
      penDrop.innerHTML = buildDropdown(pending, 'pending');
      penDrop.style.display = '';
      penBtn.classList.add('active-filter');
      updOpen = false; updDrop.style.display = 'none'; updBtn?.classList.remove('active-filter');
      wireClose();
      penDrop.querySelectorAll('.edb-emp-row.link[data-empid]').forEach(row => {
        row.addEventListener('click', () => {
          if (typeof window.setPage === 'function') window.setPage('cards');
        });
      });
    } else {
      penDrop.style.display = 'none'; penBtn.classList.remove('active-filter');
    }
  });

  function wireClose() {
    el.querySelectorAll('[data-close-dropdown]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id   = btn.dataset.closeDropdown;
        const drop = document.getElementById(id);
        if (drop) drop.style.display = 'none';
        if (id === 'edb-upd-dropdown') { updOpen = false; updBtn?.classList.remove('active-filter'); }
        if (id === 'edb-pen-dropdown') { penOpen = false; penBtn?.classList.remove('active-filter'); }
      });
    });
  }

/* ── Inject inline developer drawer (same as employee view) ── */
  const edbDevMount = document.getElementById('edb-dev-drawer-mount');
  if (edbDevMount) {
    edbDevMount.innerHTML = _buildEmpDevDrawer();
    _wireEmpDevDrawer();
  }

  /* ── Wire stat card effects ───────────────────────────────── */
  const edbStatConfig = [
    { emoji:['👥','🎉','🔥','💪','✨'], effect:'explode', tooltip:'🔥 Full team assembled!' },
    { emoji:['🏫','📚','✏️','🎓','⭐'], effect:'firework', fwColor:'#1e3a6e', tooltip:'🎓 Teachers rock!' },
    { emoji:['📊','⚙️','🛠️','💼','🌟'], effect:'explode', tooltip:'💼 Support heroes!' },
    { emoji:['🔗','🌈','🦋','💫','🎯'], effect:'explode', tooltip:'🎯 Bridging the gap!' },
  ];

  document.querySelectorAll('.edb-stat:not(.clickable)').forEach((stat, i) => {
    const cfg = edbStatConfig[i];
    if (!cfg) return;
    stat.classList.add('clickable');
    stat.addEventListener('click', () => {
      _edbBounceNum(stat);
      _edbShowTooltip(stat, cfg.tooltip);
      for (let j = 0; j < 3; j++) setTimeout(() => _edbFloatEmoji(stat, cfg.emoji), j * 120);
      if (cfg.effect === 'firework') _edbFireworks(stat, cfg.fwColor);
      else _edbExplode(stat, 'gold');
    });
  });

  [
    { id:'edb-upd-btn', emoji:['✅','🟢','⚡','🚀','💚'], effect:'firework', fwColor:'#10b981', tooltip:'🚀 Cards looking good!' },
    { id:'edb-pen-btn', emoji:['⏳','📋','🔔','⚠️','📌'], effect:'explode',  tooltip:'📌 Time to update these!' },
  ].forEach(cfg => {
    const btn = document.getElementById(cfg.id);
    if (!btn) return;
    btn.addEventListener('click', () => {
      _edbBounceNum(btn);
      _edbShowTooltip(btn, cfg.tooltip);
      for (let j = 0; j < 3; j++) setTimeout(() => _edbFloatEmoji(btn, cfg.emoji), j * 120);
      if (cfg.effect === 'firework') _edbFireworks(btn, cfg.fwColor);
      else _edbExplode(btn, 'gold');
    });
  });
} /* ← end renderHomeDashboard */

window.renderHomeDashboard = renderHomeDashboard;
