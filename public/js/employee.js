/* ============================================================
   SDO Koronadal City — Leave Card System
   employee.js  — Employee Leave Card View
   ============================================================ */
'use strict';

/* ─────────────────────────────────────────────────────────────
   INJECT COQUETTE DEV DRAWER CSS
   ───────────────────────────────────────────────────────────── */
(function injectEmpDevDrawerCSS() {
  if (document.getElementById('emp-dev-drawer-css')) return;
  const s = document.createElement('style');
  s.id = 'emp-dev-drawer-css';
  s.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

/* ── DRAWER TRIGGER BAR ────────────────────────────── */
.emp-dev-trigger {
  position: relative;
  margin: 28px 0 0;
  border-radius: 20px 20px 0 0;
  background: linear-gradient(135deg, #fff0f7 0%, #ffe4f0 40%, #ffd6ea 70%, #ffe8f4 100%);
  border: 2px solid #f9b8d8;
  border-bottom: none;
  padding: 18px 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  overflow: hidden;
  transition: background 0.25s, box-shadow 0.25s;
  box-shadow: 0 -4px 24px rgba(240,80,160,0.10);
  user-select: none;
}
.emp-dev-trigger:hover {
  background: linear-gradient(135deg, #ffe4f2 0%, #ffd0e8 40%, #ffc2de 70%, #ffdaf0 100%);
  box-shadow: 0 -8px 32px rgba(240,80,160,0.18);
}
.emp-dev-trigger-blobs {
  position: absolute; inset: 0; pointer-events: none; overflow: hidden;
}
.emp-tblob {
  position: absolute; border-radius: 50%; filter: blur(40px);
}
.emp-tblob1 { width: 180px; height: 180px; background: #ffb3d9; opacity: 0.25; top: -60px; right: -40px; }
.emp-tblob2 { width: 120px; height: 120px; background: #ff9ec8; opacity: 0.18; bottom: -40px; left: -20px; }

.emp-dev-trigger-left {
  position: relative; z-index: 1;
  display: flex; align-items: center; gap: 14px;
}
.emp-dev-bow {
  font-size: 26px;
  animation: emp-bow-sway 3s ease-in-out infinite;
  display: inline-block; transform-origin: center bottom;
}
@keyframes emp-bow-sway {
  0%,100% { transform: rotate(-8deg) scale(1); }
  50%     { transform: rotate(8deg)  scale(1.08); }
}
.emp-dev-trigger-text { }
.emp-dev-trigger-eyebrow {
  font-size: 9px; font-weight: 700; letter-spacing: 2.5px;
  text-transform: uppercase; color: #d44090; margin-bottom: 3px;
}
.emp-dev-trigger-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.25rem; font-weight: 800;
  background: linear-gradient(100deg, #c01870, #e84090, #d02080);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text; line-height: 1.2;
}
.emp-dev-trigger-sub {
  font-size: 11px; color: #c05090; margin-top: 2px;
  font-family: 'DM Sans', sans-serif;
}

.emp-dev-trigger-right {
  position: relative; z-index: 1;
  display: flex; align-items: center; gap: 14px;
}
.emp-dev-mini-avatars { display: flex; }
.emp-dev-mini-avatar {
  width: 42px; height: 42px; border-radius: 50%;
  object-fit: cover; object-position: top center;
  border: 2.5px solid #fff;
  box-shadow: 0 3px 10px rgba(230,60,140,0.28);
  background: #ffe0f0; margin-left: -12px;
  transition: transform 0.22s;
}
.emp-dev-mini-avatar:first-child { margin-left: 0; }
.emp-dev-trigger:hover .emp-dev-mini-avatar { transform: translateY(-4px); }

.emp-dev-chevron-pill {
  background: linear-gradient(135deg, #e84090, #c01870);
  color: #fff; border-radius: 20px; padding: 6px 14px;
  font-size: 10.5px; font-weight: 700; letter-spacing: 0.4px;
  display: flex; align-items: center; gap: 6px;
  box-shadow: 0 3px 12px rgba(200,40,120,0.3);
  transition: transform 0.2s, box-shadow 0.2s;
  white-space: nowrap;
}
.emp-dev-trigger:hover .emp-dev-chevron-pill {
  transform: scale(1.06);
  box-shadow: 0 6px 18px rgba(200,40,120,0.4);
}
.emp-dev-chevron-arrow {
  display: inline-block;
  transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
  font-style: normal;
}
.emp-dev-chevron-arrow.open { transform: rotate(180deg); }

/* ── DRAWER BODY ───────────────────────────────────── */
.emp-dev-drawer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.55s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease;
  opacity: 0;
  border: 2px solid #f9b8d8;
  border-top: none;
  border-radius: 0 0 20px 20px;
  background: linear-gradient(160deg, #fff0f8 0%, #ffe4f2 40%, #ffd6ee 75%, #ffe8f4 100%);
  position: relative;
  overflow: hidden;
}
.emp-dev-drawer.emp-dev-open {
  max-height: 1600px;
  opacity: 1;
}
.emp-dev-drawer-blobs {
  position: absolute; inset: 0; pointer-events: none; overflow: hidden;
}
.emp-dblob {
  position: absolute; border-radius: 50%; filter: blur(60px);
}
.emp-dblob1 { width: 300px; height: 300px; background: #ffb3d9; opacity: 0.22; top: -80px; right: -60px; }
.emp-dblob2 { width: 200px; height: 200px; background: #ff9ec8; opacity: 0.16; bottom: -60px; left: -50px; }
.emp-dblob3 { width: 160px; height: 160px; background: #ffd6ec; opacity: 0.22; top: 40%; left: 40%; }

.emp-dev-drawer-inner {
  position: relative; z-index: 1; padding: 32px 36px 36px;
}

.emp-dev-drawer-header {
  text-align: center; margin-bottom: 28px;
}
.emp-dev-drawer-eyebrow {
  font-size: 9px; font-weight: 700; letter-spacing: 3px;
  text-transform: uppercase; color: #d44090; margin-bottom: 6px;
}
.emp-dev-drawer-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.9rem; font-weight: 800;
  background: linear-gradient(100deg, #c01870, #e84090, #d02080);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text; margin-bottom: 4px;
}
.emp-dev-drawer-sub {
  font-size: 11.5px; color: #c05090;
  font-family: 'DM Sans', sans-serif;
}

/* ── DEV CARDS GRID ─────────────────────────────────── */
.emp-dev-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
}
@media (max-width: 600px) { .emp-dev-grid { grid-template-columns: 1fr; } }

.emp-dev-card {
  background: #fff; border-radius: 20px; overflow: hidden;
  border: 2px solid #ffc8e0;
  box-shadow: 0 6px 28px rgba(230,60,140,0.14), 0 1px 5px rgba(210,40,120,0.08);
  display: flex; flex-direction: column;
  transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s;
  position: relative; cursor: pointer;
}
.emp-dev-card:hover {
  transform: translateY(-7px) rotate(0.3deg);
  box-shadow: 0 20px 50px rgba(230,60,140,0.24);
}

/* Ribbon */
.emp-dev-ribbon {
  height: 72px;
  background: linear-gradient(135deg, #ffd6ec 0%, #ffb0ce 100%);
  position: relative; flex-shrink: 0; overflow: hidden;
}
.emp-dev-shimmer {
  position: absolute; inset: -100%;
  background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.55) 50%, transparent 60%);
  animation: emp-shimmer 3.5s 1s infinite;
}
@keyframes emp-shimmer {
  0%   { transform: translateX(-60%) translateY(-60%); }
  100% { transform: translateX(60%)  translateY(60%); }
}

/* Avatar */
.emp-dev-avatar-wrap {
  position: relative; z-index: 1;
  width: 96px; height: 96px;
  margin: -48px auto 12px; flex-shrink: 0;
}
.emp-dev-avatar {
  width: 96px; height: 96px; border-radius: 50%;
  object-fit: cover; object-position: top center;
  border: 4px solid #fff;
  box-shadow: 0 5px 20px rgba(230,60,140,0.28);
  background: #ffe0f0; display: block;
  transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
}
.emp-dev-card:hover .emp-dev-avatar { transform: scale(1.08) rotate(-2deg); }
.emp-dev-ring {
  position: absolute; inset: -5px; border-radius: 50%;
  background: conic-gradient(#ff80b8, #ff40a0, #e8208e, #ff40a0, #ff80b8);
  z-index: -1; animation: emp-spin 7s linear infinite;
}
.emp-dev-card:hover .emp-dev-ring { animation-duration: 0.8s; }
@keyframes emp-spin { to { transform: rotate(360deg); } }

/* Content */
.emp-dev-content {
  padding: 0 18px 22px;
  flex: 1; display: flex; flex-direction: column;
  align-items: center; text-align: center;
}
.emp-dev-role-tag {
  display: inline-block;
  background: linear-gradient(90deg, #ffd6ec, #ffb0d8);
  color: #b01860; font-size: 8.5px; font-weight: 800;
  letter-spacing: 1.2px; text-transform: uppercase;
  padding: 3px 10px; border-radius: 20px; margin-bottom: 7px;
}
.emp-dev-name {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.05rem; font-weight: 800; color: #7a1040;
  margin-bottom: 7px; line-height: 1.25;
}
.emp-dev-bio {
  font-size: 10.5px; color: #a04878; line-height: 1.75;
  margin-bottom: 12px; flex: 1;
  font-family: 'DM Sans', sans-serif;
}
.emp-dev-skills {
  display: flex; flex-wrap: wrap; gap: 4px;
  justify-content: center; margin-bottom: 10px;
}
.emp-dev-skill {
  background: #ffe0f0; color: #b02060;
  border: 1px solid #ffb8d8;
  font-size: 8.5px; font-weight: 700; letter-spacing: 0.3px;
  padding: 2px 8px; border-radius: 20px;
}
.emp-dev-hearts {
  font-size: 15px; letter-spacing: 4px;
  animation: emp-heartbeat 2.2s ease-in-out infinite;
}
@keyframes emp-heartbeat {
  0%,100% { transform: scale(1); }
  50%     { transform: scale(1.15); }
}

/* ── FOOTER ─────────────────────────────────────────── */
.emp-dev-footer {
  display: flex; align-items: center; gap: 14px;
  margin-top: 24px;
}
.emp-dev-footer-line {
  flex: 1; height: 1px;
  background: linear-gradient(90deg, transparent, #f0a0cc, transparent);
}
.emp-dev-footer-text {
  font-size: 9.5px; color: #c06090; white-space: nowrap;
  font-weight: 600; letter-spacing: 0.4px;
  font-family: 'DM Sans', sans-serif;
}

/* ── INTERACTIONS — photo click effects ──────────────── */
@keyframes emp-confetti-fly {
  0%   { transform: translate(0,0) scale(1) rotate(0deg); opacity: 1; }
  100% { transform: translate(var(--cx),var(--cy)) scale(0) rotate(var(--cr,360deg)); opacity: 0; }
}
.emp-photo-confetti {
  position: fixed; width: 7px; height: 7px; border-radius: 50%;
  pointer-events: none; z-index: 99999;
  animation: emp-confetti-fly 0.8s cubic-bezier(0.22,1,0.36,1) forwards;
}
@keyframes emp-sparkle-ring {
  0%   { transform: scale(0.5); opacity: 1; }
  100% { transform: scale(2.6); opacity: 0; }
}
.emp-sparkle-ring {
  position: absolute; inset: -4px; border-radius: 50%;
  border: 3px solid #ff80b8; pointer-events: none;
  animation: emp-sparkle-ring 0.55s ease-out forwards; z-index: 5;
}
@keyframes emp-star-up {
  0%   { opacity: 1; transform: translateY(0) scale(1); }
  100% { opacity: 0; transform: translateY(var(--sy,-80px)) scale(1.8) rotate(var(--sr,30deg)); }
}
.emp-star-burst {
  position: fixed; font-size: 20px; pointer-events: none; z-index: 99999;
  animation: emp-star-up 0.8s cubic-bezier(0.22,1,0.36,1) forwards;
}
@keyframes emp-card-wobble {
  0%,100% { transform: translateY(-7px) rotate(0.3deg); }
  25%     { transform: translateY(-7px) rotate(-3deg) scale(1.03); }
  50%     { transform: translateY(-7px) rotate(3deg)  scale(1.03); }
  75%     { transform: translateY(-7px) rotate(-2deg) scale(1.01); }
}
.emp-dev-card.emp-wobbling { animation: emp-card-wobble 0.5s ease; }

/* ── FIREWORKS ───────────────────────────────────────── */
@keyframes emp-firework-fly {
  0%   { transform: translate(0,0) scale(1); opacity: 1; }
  100% { transform: translate(var(--fx),var(--fy)) scale(0); opacity: 0; }
}
.emp-firework {
  position: fixed; width: 6px; height: 6px; border-radius: 50%;
  pointer-events: none; z-index: 99999;
  animation: emp-firework-fly 0.8s cubic-bezier(0.22,1,0.36,1) forwards;
}

/* ── RIBBON CLICK BURST ──────────────────────────────── */
@keyframes emp-bow-burst {
  0%   { transform: scale(1) rotate(-8deg); }
  30%  { transform: scale(1.8) rotate(15deg); }
  60%  { transform: scale(0.9) rotate(-10deg); }
  80%  { transform: scale(1.2) rotate(5deg); }
  100% { transform: scale(1) rotate(-8deg); }
}
.emp-bow-burst { animation: emp-bow-burst 0.6s cubic-bezier(0.22,1,0.36,1) !important; }

/* ── DRAWER OPEN ENTRANCE FIREWORKS ─────────────────── */
@keyframes emp-drawer-pop {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: none; }
}
.emp-drawer-popped { animation: emp-drawer-pop 0.4s cubic-bezier(0.22,1,0.36,1) both; }

/* ── SPECIAL THANKS (inside drawer) ─────────────────── */
.emp-thanks-section {
  margin-top: 32px;
  background: linear-gradient(145deg, #0a0c18 0%, #0e1428 40%, #111830 100%);
  border-radius: 18px; padding: 32px 28px 28px;
  position: relative; overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,.35),
              inset 0 1px 0 rgba(180,160,80,.1);
  border: 1px solid rgba(180,160,60,.2);
}
.emp-thanks-section-pattern {
  position: absolute; inset: 0; pointer-events: none;
  background-image:
    radial-gradient(circle at 1px 1px, rgba(255,255,255,.025) 1px, transparent 0),
    repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(180,160,40,.04) 80px, rgba(180,160,40,.04) 81px);
  background-size: 28px 28px, 100% 100%;
}
.emp-thanks-inner { position: relative; z-index: 1; }
.emp-thanks-eyebrow {
  font-size: 9px; font-weight: 700; letter-spacing: 3px;
  text-transform: uppercase; color: #c8a840; margin-bottom: 6px;
  text-shadow: 0 0 12px rgba(200,168,64,.4);
  font-family: 'DM Sans', sans-serif;
}
.emp-thanks-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.6rem; font-weight: 800; color: #fff;
  margin-bottom: 6px;
  text-shadow: 0 2px 12px rgba(0,0,0,.5);
}
.emp-thanks-sub {
  font-size: 11px; color: rgba(255,255,255,.38);
  margin-bottom: 24px; line-height: 1.6;
  font-family: 'DM Sans', sans-serif;
}
.emp-thanks-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
}
@media (max-width: 600px) { .emp-thanks-grid { grid-template-columns: 1fr; } }
.emp-thanks-card {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(200,168,60,.18);
  border-radius: 14px; padding: 20px 18px;
  display: flex; align-items: flex-start; gap: 14px;
  transition: background .22s, transform .22s, border-color .22s;
  position: relative; overflow: hidden;
}
.emp-thanks-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, rgba(200,168,60,.45), transparent);
  border-radius: 14px 14px 0 0;
}
.emp-thanks-card:hover {
  background: rgba(255,255,255,.07);
  border-color: rgba(200,168,60,.38);
  transform: translateY(-3px);
}
.emp-thanks-avatar {
  width: 60px; height: 60px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, #1e3a6e, #4a7cc7);
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; font-weight: 800; color: #fff;
  border: 2px solid rgba(200,168,60,.3);
  box-shadow: 0 3px 14px rgba(0,0,0,.4);
  font-family: 'Playfair Display', serif;
}
.emp-thanks-body { flex: 1; min-width: 0; }
.emp-thanks-badge {
  display: inline-block;
  background: rgba(200,168,60,.14);
  border: 1px solid rgba(200,168,60,.28);
  color: #c8a840; font-size: 8px; font-weight: 800;
  letter-spacing: 1.2px; text-transform: uppercase;
  padding: 2px 8px; border-radius: 20px; margin-bottom: 6px;
  font-family: 'DM Sans', sans-serif;
}
.emp-thanks-name {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: .95rem; font-weight: 800; color: #fff;
  margin-bottom: 3px; line-height: 1.2;
}
.emp-thanks-role {
  font-size: 10px; color: rgba(255,255,255,.4);
  font-weight: 600; letter-spacing: .3px; margin-bottom: 8px;
  font-family: 'DM Sans', sans-serif;
}
.emp-thanks-desc {
  font-size: 10.5px; color: rgba(255,255,255,.48);
  line-height: 1.75; font-family: 'DM Sans', sans-serif;
}
.emp-thanks-quote {
  margin-top: 10px; padding: 8px 12px;
  background: rgba(200,168,60,.06);
  border-left: 3px solid rgba(200,168,60,.38);
  border-radius: 0 7px 7px 0;
  font-size: 10px; color: rgba(200,168,60,.75);
  font-style: italic; line-height: 1.6;
  font-family: 'DM Sans', sans-serif;
}
.emp-thanks-footer {
  display: flex; align-items: center; gap: 12px; margin-top: 22px;
}
.emp-thanks-footer-line {
  flex: 1; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(200,168,60,.28), transparent);
}
.emp-thanks-footer-text {
  font-size: 9px; color: rgba(200,168,60,.45);
  white-space: nowrap; font-weight: 600; letter-spacing: .4px;
  font-family: 'DM Sans', sans-serif;
}

/* ── NO PRINT ────────────────────────────────────────── */
@media print {
  .emp-dev-trigger, .emp-dev-drawer { display: none !important; }
}
  `;
  document.head.appendChild(s);
})();

/* ─────────────────────────────────────────────────────────────
   _empFireworks  — burst of coloured dots from element center
   ───────────────────────────────────────────────────────────── */
function _empFireworks(el, color) {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width  / 2;
  const cy = rect.top  + rect.height / 2;
  for (let i = 0; i < 20; i++) {
    const fw = document.createElement('div');
    fw.className = 'emp-firework';
    const angle = (i / 20) * 360;
    const dist  = 45 + Math.random() * 75;
    const rad   = angle * Math.PI / 180;
    fw.style.cssText = `left:${cx}px;top:${cy}px;--fx:${Math.cos(rad)*dist}px;--fy:${Math.sin(rad)*dist}px;background:${color || '#ff80b8'};`;
    document.body.appendChild(fw);
    setTimeout(() => fw.remove(), 900);
  }
}

/* ─────────────────────────────────────────────────────────────
   _empWireDevCard  — tilt + photo-click interactions
   ───────────────────────────────────────────────────────────── */
function _empWireDevCard(card, confettiColors, starEmojis) {
  const avatarWrap = card.querySelector('.emp-dev-avatar-wrap');
  const avatar     = card.querySelector('.emp-dev-avatar');
  if (!avatar || !avatarWrap) return;

  /* 3-D tilt on hover */
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-7px) rotateY(${x * 14}deg) rotateX(${-y * 10}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });

  /* Photo click → confetti + sparkle + stars + wobble */
  avatar.addEventListener('click', (e) => {
    e.stopPropagation();
    const rect = avatarWrap.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;

    /* Sparkle ring */
    const ring = document.createElement('div');
    ring.className = 'emp-sparkle-ring';
    avatarWrap.appendChild(ring);
    setTimeout(() => ring.remove(), 650);

    /* Confetti */
    for (let i = 0; i < 24; i++) {
      const c = document.createElement('div');
      c.className = 'emp-photo-confetti';
      c.style.background = confettiColors[i % confettiColors.length];
      const angle = (i / 24) * 360 + Math.random() * 15;
      const dist  = 55 + Math.random() * 95;
      const rad   = angle * Math.PI / 180;
      c.style.cssText += `left:${cx}px;top:${cy}px;--cx:${Math.cos(rad)*dist}px;--cy:${Math.sin(rad)*dist}px;--cr:${(Math.random()-.5)*720}deg;`;
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 900);
    }

    /* Stars floating up */
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const star = document.createElement('div');
        star.className = 'emp-star-burst';
        star.textContent = starEmojis[Math.floor(Math.random() * starEmojis.length)];
        const ox = (Math.random() - 0.5) * 90;
        star.style.cssText = `left:${cx + ox}px;top:${cy}px;--sy:${-(60+Math.random()*55)}px;--sr:${(Math.random()-.5)*60}deg;`;
        document.body.appendChild(star);
        setTimeout(() => star.remove(), 950);
      }, i * 75);
    }

    /* Wobble card */
    card.classList.remove('emp-wobbling');
    void card.offsetWidth;
    card.classList.add('emp-wobbling');
    setTimeout(() => card.classList.remove('emp-wobbling'), 600);
  });
}

/* ─────────────────────────────────────────────────────────────
   _buildEmpDevDrawer
   Returns the HTML string for the coquette developer section.
   Call this AFTER renderLeaveCardTable() injects #lcTableWrap.
   ───────────────────────────────────────────────────────────── */
function _buildEmpDevDrawer() {
  return `
<!-- ── COQUETTE DEVELOPER DRAWER ── -->
<div class="emp-dev-trigger no-print" id="empDevTrigger">
  <div class="emp-dev-trigger-blobs">
    <div class="emp-tblob emp-tblob1"></div>
    <div class="emp-tblob emp-tblob2"></div>
  </div>
  <div class="emp-dev-trigger-left">
    <span class="emp-dev-bow" id="empDevBow">🎀</span>
    <div class="emp-dev-trigger-text">
      <div class="emp-dev-trigger-eyebrow">🩷 Made with Love</div>
      <div class="emp-dev-trigger-title">Meet the Developers</div>
      <div class="emp-dev-trigger-sub">The minds behind your leave card ✨</div>
    </div>
  </div>
  <div class="emp-dev-trigger-right">
    <div class="emp-dev-mini-avatars">
      <img class="emp-dev-mini-avatar"
           src="/img/jeoan.jpg"
           onerror="this.src='https://ui-avatars.com/api/?name=Jeoan+Gran&background=ffd6ec&color=b01860&size=200&bold=true'"
           alt="Jeoan"/>
      <img class="emp-dev-mini-avatar"
           src="/img/janice.jpg"
           onerror="this.src='https://ui-avatars.com/api/?name=Janice+Laveros&background=ffd6ec&color=b01860&size=200&bold=true'"
           alt="Janice"/>
    </div>
    <div class="emp-dev-chevron-pill">
      <span>Peek inside</span>
      <em class="emp-dev-chevron-arrow" id="empDevArrow">▲</em>
    </div>
  </div>
</div>

<div class="emp-dev-drawer no-print" id="empDevDrawer">
  <div class="emp-dev-drawer-blobs">
    <div class="emp-dblob emp-dblob1"></div>
    <div class="emp-dblob emp-dblob2"></div>
    <div class="emp-dblob emp-dblob3"></div>
  </div>
  <div class="emp-dev-drawer-inner">
    <div class="emp-dev-drawer-header">
      <div class="emp-dev-drawer-eyebrow">🩷 SDO Koronadal City · Leave Card Management System</div>
      <div class="emp-dev-drawer-title">The Dream Team 🌸</div>
      <div class="emp-dev-drawer-sub">Two humans who stayed up late so you could sleep easy ✨<br>
        <small style="opacity:.7;">Click on a photo for a little surprise! 🎉</small>
      </div>
    </div>

    <div class="emp-dev-grid">

      <!-- Jeoan -->
      <div class="emp-dev-card" id="empDevCardJeoan">
        <div class="emp-dev-ribbon"><div class="emp-dev-shimmer"></div></div>
        <div class="emp-dev-avatar-wrap">
          <div class="emp-dev-ring"></div>
          <img class="emp-dev-avatar"
               src="/img/jeoan.jpg"
               onerror="this.src='https://ui-avatars.com/api/?name=Jeoan+Gran&background=ffd6ec&color=b01860&size=200&bold=true'"
               alt="Jeoan Gwyneth Dajay Gran"/>
        </div>
        <div class="emp-dev-content">
          <div class="emp-dev-role-tag">Frontend Developer</div>
          <div class="emp-dev-name">Jeoan Gwyneth Dajay Gran</div>
          <div class="emp-dev-bio">Designed every pixel of this system — from the deep crimson headers to the buttery gold balance cells. She also architected the entire leave computation logic. Every formula behind your leave balance flows from her mind.</div>
          <div class="emp-dev-skills">
            <span class="emp-dev-skill">🎨 UI Design</span>
            <span class="emp-dev-skill">💅 CSS / HTML</span>
            <span class="emp-dev-skill">🧮 Leave Logic</span>
          </div>
          <div class="emp-dev-hearts">🩷 🌸 🩷</div>
        </div>
      </div>

      <!-- Janice -->
      <div class="emp-dev-card" id="empDevCardJanice">
        <div class="emp-dev-ribbon"><div class="emp-dev-shimmer"></div></div>
        <div class="emp-dev-avatar-wrap">
          <div class="emp-dev-ring"></div>
          <img class="emp-dev-avatar"
               src="/img/janice.jpg"
               onerror="this.src='https://ui-avatars.com/api/?name=Janice+Laveros&background=ffd6ec&color=b01860&size=200&bold=true'"
               alt="Janice Luis Laveros"/>
        </div>
        <div class="emp-dev-content">
          <div class="emp-dev-role-tag">Backend Developer</div>
          <div class="emp-dev-name">Janice Luis Laveros</div>
          <div class="emp-dev-bio">Built the engine that makes it all run — database schema, API routes, server logic, and the data pipelines that power your leave records. She turned design into real, working backend code that handles every entry reliably.</div>
          <div class="emp-dev-skills">
            <span class="emp-dev-skill">🗄️ Database</span>
            <span class="emp-dev-skill">⚙️ API Logic</span>
            <span class="emp-dev-skill">🔧 Server</span>
          </div>
          <div class="emp-dev-hearts">🩷 🌺 🩷</div>
        </div>
      </div>

</div><!-- /.emp-dev-grid -->

    <!-- ── Special Thanks ── -->
    <div class="emp-thanks-section">
      <div class="emp-thanks-section-pattern"></div>
      <div class="emp-thanks-inner">
        <div class="emp-thanks-eyebrow">🏅 WITH GRATITUDE</div>
        <div class="emp-thanks-title">Special Thanks</div>
        <div class="emp-thanks-sub">
          This system — and your digital leave card — would not exist without the vision and trust of these two remarkable individuals.
        </div>
        <div class="emp-thanks-grid">

          <!-- Sir Faizal -->
          <div class="emp-thanks-card">
            <div class="emp-thanks-avatar">FM</div>
            <div class="emp-thanks-body">
              <div class="emp-thanks-badge">🏢 HR Administration</div>
              <div class="emp-thanks-name">Sir Faizal B. Macasayon</div>
              <div class="emp-thanks-role">Administrative Officer IV / HRMO</div>
              <div class="emp-thanks-desc">
                The first believer. Sir Fyke championed this system from proposal to deployment —
                trusting two developers to modernize a process done by hand for decades.
              </div>
              <div class="emp-thanks-quote">
                "He opened the door so you never have to walk to HR again." 🗝️
              </div>
            </div>
          </div>

          <!-- Sir Gregory -->
          <div class="emp-thanks-card">
            <div class="emp-thanks-avatar" style="background:linear-gradient(135deg,#065f46,#059669);">GJ</div>
            <div class="emp-thanks-body">
              <div class="emp-thanks-badge" style="background:rgba(5,150,105,.14);border-color:rgba(5,150,105,.28);color:#10b981;">📐 Consultancy</div>
              <div class="emp-thanks-name">Sir John Gregory D. Jabido</div>
              <div class="emp-thanks-role">Education Program Supervisor</div>
              <div class="emp-thanks-desc">
                Our systems consultant and compass. Sir Greg's guidance transformed a functional
                tool into a reliable, well-designed system built with you in mind.
              </div>
              <div class="emp-thanks-quote" style="border-left-color:rgba(5,150,105,.38);color:rgba(16,185,129,.75);">
                "He shaped what 'better' looks like for every feature you see here." ✨
              </div>
            </div>
          </div>

        </div>
        <div class="emp-thanks-footer">
          <div class="emp-thanks-footer-line"></div>
          <span class="emp-thanks-footer-text">SDO Koronadal City · Thank you for making this possible 🙏</span>
          <div class="emp-thanks-footer-line"></div>
        </div>
      </div>
    </div><!-- /.emp-thanks-section -->

    <div class="emp-dev-footer">
      <div class="emp-dev-footer-line"></div>
      <span class="emp-dev-footer-text">SDO Koronadal City · Leave Card System · Built with 🩷 for every employee</span>
      <div class="emp-dev-footer-line"></div>
    </div>

  </div><!-- /.emp-dev-drawer-inner -->
</div><!-- /.emp-dev-drawer -->
  `;
}

/* ─────────────────────────────────────────────────────────────
   _wireEmpDevDrawer  — all interactivity after HTML is in DOM
   ───────────────────────────────────────────────────────────── */
function _wireEmpDevDrawer() {
  const trigger = document.getElementById('empDevTrigger');
  const drawer  = document.getElementById('empDevDrawer');
  const arrow   = document.getElementById('empDevArrow');
  const bow     = document.getElementById('empDevBow');
  if (!trigger || !drawer) return;

  let isOpen = false;

  trigger.addEventListener('click', () => {
    isOpen = !isOpen;

    if (isOpen) {
      drawer.classList.add('emp-dev-open');
      arrow.classList.add('open');

      /* Bow burst animation on open */
      if (bow) {
        bow.classList.remove('emp-bow-burst');
        void bow.offsetWidth;
        bow.classList.add('emp-bow-burst');
        setTimeout(() => bow.classList.remove('emp-bow-burst'), 700);
      }

      /* Fireworks burst from trigger */
      _empFireworks(trigger, '#ff80b8');
      setTimeout(() => _empFireworks(trigger, '#ffd6ec'), 180);
      setTimeout(() => _empFireworks(trigger, '#e040a0'), 340);

      /* Floating stars */
      const starList = ['🌸','🩷','✨','🌺','💕','⭐','🎀'];
      const rect = trigger.getBoundingClientRect();
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          const star = document.createElement('div');
          star.className = 'emp-star-burst';
          star.textContent = starList[Math.floor(Math.random() * starList.length)];
          const ox = (Math.random() - 0.5) * (rect.width * 0.8);
          star.style.cssText = `left:${rect.left + rect.width/2 + ox}px;top:${rect.top + rect.height/2}px;--sy:${-(50+Math.random()*60)}px;--sr:${(Math.random()-.5)*50}deg;`;
          document.body.appendChild(star);
          setTimeout(() => star.remove(), 1000);
        }, i * 70);
      }

      /* Pop-in entrance for drawer inner */
      setTimeout(() => {
        drawer.querySelector('.emp-dev-drawer-inner')?.classList.add('emp-drawer-popped');
      }, 80);

    } else {
      drawer.classList.remove('emp-dev-open');
      arrow.classList.remove('open');
      drawer.querySelector('.emp-dev-drawer-inner')?.classList.remove('emp-drawer-popped');
    }
  });

  /* Wire dev card photo interactions */
  const jeoanCard  = document.getElementById('empDevCardJeoan');
  const janiceCard = document.getElementById('empDevCardJanice');

  if (jeoanCard) {
    _empWireDevCard(
      jeoanCard,
      ['#ff80b8','#ffd6ec','#ff40a0','#ffe0f0','#e8208e','#ffb3d9'],
      ['🌸','🩷','✨','🎨','💕','⭐','🎀']
    );
  }
  if (janiceCard) {
    _empWireDevCard(
      janiceCard,
      ['#a78bfa','#fbbf24','#34d399','#f472b6','#60a5fa','#fb923c'],
      ['🌺','💜','✨','⚙️','💚','🌟','🔧']
    );
  }
}

/* ─────────────────────────────────────────────────────────────
   _empRenderTopbar
   ───────────────────────────────────────────────────────────── */
function _empRenderTopbar(emp) {
  const tb = document.getElementById('topbar');
  if (!tb) return;

  const firstName = escHtml(emp?.given   || '');
  const lastName  = escHtml(emp?.surname || '');
  const fullName  = [lastName, firstName].filter(Boolean).join(', ') || 'Employee';

  tb.innerHTML = `
    <div class="tb-in">
      <div class="tb-brand">
        <button class="sb-toggle" id="empMenuBtn" title="Menu">☰</button>
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
          Logged in as <strong>${fullName}</strong>
        </span>
      </div>
    </div>`;

  document.getElementById('empMenuBtn')?.addEventListener('click', () => {
    const sb = document.getElementById('empSidebar');
    const overlay = document.getElementById('empSbOverlay');
    sb?.classList.toggle('open');
    overlay?.classList.toggle('open');
  });
}
/* ─────────────────────────────────────────────────────────────
   _empHideSidebar
   ───────────────────────────────────────────────────────────── */
function _empHideSidebar() {
  const mainSb  = document.getElementById('sidebar');
  const overlay = document.getElementById('sbOverlay');
  if (mainSb)  mainSb.innerHTML = '';
  if (overlay) overlay.style.display = 'none';

  // Remove old employee sidebar if exists
  document.getElementById('empSidebar')?.remove();
  document.getElementById('empSbOverlay')?.remove();

  const emp = (window.state?.db || []).find(e => e.id === window.state?.curId);

  // Create employee sidebar
  const sb = document.createElement('div');
  sb.id = 'empSidebar';
  sb.className = 'sidebar';
  sb.innerHTML = `
    <div class="sb-head">
      <img class="sb-logo" src="/img/sdo.jpg"
           onerror="this.src='https://upload.wikimedia.org/wikipedia/en/a/a8/DepEd_Koronadal.png'" alt=""/>
      <div class="sb-brand">
        <div class="sb-brand-title">SDO Koronadal City</div>
        <div class="sb-brand-sub">Leave Card System</div>
      </div>
      <button class="sb-close" id="empSbClose">✕</button>
    </div>
    <nav class="sb-nav">
      <div class="sb-item" id="empSbApplyLeave">
        <span class="sb-icon">📋</span>Apply for Leave
      </div>
      <div class="sb-item" id="empSbMySubmissions">
        <span class="sb-icon">📨</span>My Submissions
      </div>
      <div class="sb-divider"></div>
      <div class="sb-item danger" id="empSbLogout">
        <span class="sb-icon">🚪</span>Logout
      </div>
    </nav>`;

  // Create overlay
  const ov = document.createElement('div');
  ov.id = 'empSbOverlay';
  ov.className = 'sb-overlay';

  document.body.appendChild(sb);
  document.body.appendChild(ov);

  const closeEmpSb = () => {
    sb.classList.remove('open');
    ov.classList.remove('open');
  };

  document.getElementById('empSbClose')?.addEventListener('click', closeEmpSb);
  ov.addEventListener('click', closeEmpSb);

  document.getElementById('empSbLogout')?.addEventListener('click', () => {
    closeEmpSb();
    if (typeof showLogoutModal === 'function') showLogoutModal();
    else if (typeof doLogout === 'function') doLogout();
  });

  document.getElementById('empSbApplyLeave')?.addEventListener('click', () => {
    closeEmpSb();
    if (emp && typeof showLeaveApplicationModal === 'function') {
      showLeaveApplicationModal(emp, null);
    }
  });

  document.getElementById('empSbMySubmissions')?.addEventListener('click', () => {
    closeEmpSb();
    if (typeof renderEmpSubmissionsPage === 'function') renderEmpSubmissionsPage(emp);
  });
}
/* ─────────────────────────────────────────────────────────────
   renderUserPage  — overrides app.js version
   ───────────────────────────────────────────────────────────── */
async function renderUserPage() {
  const el = document.getElementById('pg-user');
  if (!el) return;

  el.innerHTML = `
    <div style="text-align:center;padding:60px 20px;color:#9a8a8a;
                font-family:Inter,sans-serif;">
      <div style="font-size:32px;margin-bottom:12px;">⏳</div>
      <div style="font-size:13px;">Loading your leave card…</div>
    </div>`;

  const emp = await ensureRecords(state.curId);
  if (!emp) {
    el.innerHTML = `
      <div style="padding:48px;text-align:center;color:#c0392b;
                  font-family:Inter,sans-serif;">
        <div style="font-size:32px;margin-bottom:12px;">⚠️</div>
        Employee record not found.
      </div>`;
    return;
  }

  _empRenderTopbar(emp);
  _empHideSidebar();

  if (typeof sortRecordsInPlace === 'function') sortRecordsInPlace(emp.records);

  const statusLC      = (emp.status || '').toLowerCase();
  const isT           = statusLC === 'teaching';
  const isTR          = statusLC === 'teaching related';
  const categoryLabel = isT  ? 'TEACHING'
                      : isTR ? 'TEACHING RELATED'
                             : 'NON-TEACHING';

  const _lcField = (typeof lcField === 'function')
    ? lcField
    : (label, val) => `
        <div class="lc-pf">
          <div class="lc-pf-label">${escHtml(label)}</div>
          <div class="lc-pf-value">${escHtml(val || '') || '&mdash;'}</div>
        </div>`;

  el.innerHTML = `
    <div class="lc-view">

      <!-- ── Action bar ── -->
      <div class="lc-topbar no-print">
        <div style="display:flex;gap:10px;align-items:center;margin-left:auto;">
          <button class="btn lc-dl-btn"    id="empDlBtn">⬇ DOWNLOAD PDF</button>
          <button class="btn lc-print-btn" id="empPrintBtn">🖨 PRINT</button>
        </div>
      </div>

      <!-- ── Profile card ── -->
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

      <!-- ── Leave records table ── -->
      <div id="lcTableWrap"></div>

     <!-- submissions moved to full page via hamburger -->

<!-- ── Coquette Developer Drawer (injected below) ── -->
<div id="empDevDrawerMount"></div>

    </div>`;

  /* Render leave table */
  if (typeof renderLeaveCardTable === 'function') {
    renderLeaveCardTable(emp);
  }

  /* Inject leave application submissions section */
  const appMount = document.getElementById('empLeaveAppMount');
  if (appMount && typeof injectLeaveApplicationSection === 'function') {
    injectLeaveApplicationSection(emp);
  }

  /* Inject coquette dev drawer after the table */
  const mount = document.getElementById('empDevDrawerMount');
  if (mount) {
    mount.innerHTML = _buildEmpDevDrawer();
    /* Inject leave application section */

    _wireEmpDevDrawer();
  }

  /* Wire Print */
  document.getElementById('empPrintBtn')?.addEventListener('click', () => {
    if (typeof pdfExportPrint   === 'function') pdfExportPrint(emp);
    else if (typeof lcPrint     === 'function') lcPrint(emp);
    else window.print();
  });

  /* Wire Download PDF */
  document.getElementById('empDlBtn')?.addEventListener('click', () => {
    if (typeof pdfExportDownload === 'function') pdfExportDownload(emp);
    else if (typeof lcDownloadPDF === 'function') lcDownloadPDF(emp);
    else alert('PDF download is not available.');
  });
}

/* ─────────────────────────────────────────────────────────────
   Expose — overrides app.js versions.
   employee.js MUST be loaded AFTER app.js.
   ───────────────────────────────────────────────────────────── */
window.renderUserPage = renderUserPage;
