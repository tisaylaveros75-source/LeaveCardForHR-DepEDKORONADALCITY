/* ============================================================
   SDO Koronadal City — Leave Card System
   modals.js — All modal / dialog functions
   RED ARMOURED EDITION — Wider cards, shocking effects
   ============================================================ */

'use strict';

/* ─────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────── */
const SCHOOL_OPTIONS = [
  'Bacongco NHS','Concepcion NHS',
  'Marbel 5 NHS (Esperanza NHS – Annex, San Jose Campus)',
  'Esperanza NHS','Gov. Sergio B. Morales NHS','Koronadal NCHS',
  'Marbel 7 NHS','Rotonda NHS','Saravia NHS',
  'Bacongco (San Isidro) ES','Caloocan ES','Carpenter Hill ES',
  'Chua ES','Crossing Diaz ES','Dungan Lahek ES','El Gawel ES',
  'Engkong ES','Esimos Cataluña ES','Esperanza ES',
  'Flaviano T. Deocampo, Sr. ES','Guadalupe ES','Imba Primary School',
  'Kakub ES','Koronadal Central I ES','Koronadal Central II ES',
  'Lasang ES','Mabini ES','Magsaysay ES','Mama Mapambukol PS',
  'Mambucal ES','Mangga ES','Manuel Dondiego ES','Marbel 1 CES',
  'Marbel 3 ES','Marbel 4 ES','Marbel 5 CES','Marbel 6 ES',
  'Marbel 7 CES','Marbel 8 ES','Mariano Villegas ES','Matulas ES',
  'Morales ES','Namnama ES','Nelmida ES','Olu-mlao ES','Osita CES',
  'Rotonda ES','Sabino ES','Salkan ES','San Roque ES','Siodina ES',
  'Siok ES','Sto. Nino ES','Supon ES',
  'SDO - Office of the Schools Division Superintendent',
  'SDO - Curriculum Implementation Division',
  'SDO - School Governance and Operations Division',
  'SDO - Finance Division','SDO - Human Resource',
  'SDO - Information and Communication Technology',
  'SDO - Legal Unit','SDO - Administrative',
];

const POSITION_OPTIONS = [
  'Teacher I','Teacher II','Teacher III',
  'Master Teacher I','Master Teacher II','Master Teacher III','Master Teacher IV',
  'Head Teacher I','Head Teacher II','Head Teacher III',
  'Head Teacher IV','Head Teacher V','Head Teacher VI',
  'Principal I','Principal II','Principal III','Principal IV',
  'School Principal I','School Principal II','School Principal III','School Principal IV',
  'Education Program Supervisor','Public Schools District Supervisor',
  'Superintendent','Assistant Schools Division Superintendent',
  'Schools Division Superintendent',
  'Administrative Officer I','Administrative Officer II',
  'Administrative Officer III','Administrative Officer IV','Administrative Officer V',
  'Administrative Assistant I','Administrative Assistant II','Administrative Assistant III',
  'Administrative Aide I','Administrative Aide II','Administrative Aide III',
  'Administrative Aide IV','Administrative Aide V','Administrative Aide VI',
  'Accountant I','Accountant II','Accountant III',
  'Budget Officer I','Budget Officer II','Budget Officer III',
  'Cashier I','Cashier II','Cashier III',
  'Human Resource Management Officer I','Human Resource Management Officer II',
  'Human Resource Management Officer III',
  'Information Technology Officer I',
  'Lawyer I','Legal Officer I','Legal Officer II',
  'Nurse I','Nurse II',
  'Utility Worker I','Utility Worker II','Security Guard',
  'Project Development Officer I','Project Development Officer II',
];

const CIVIL_STATUS_OPTIONS = [
  'Single','Married','Widowed','Legally Separated','Annulled',
];

/* ─────────────────────────────────────────────────────────
   INJECT GLOBAL ARMOURED MODAL CSS (once)
───────────────────────────────────────────────────────── */
(function injectArmouredModalCSS() {
  if (document.getElementById('armoured-modal-css')) return;
  const s = document.createElement('style');
  s.id = 'armoured-modal-css';
  s.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');

/* ══ BASE MODAL OVERLAY — Red Armoured ══ */
.mo {
  position: fixed; inset: 0; z-index: 9990;
  background: rgba(6,0,0,.92);
  backdrop-filter: blur(16px);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
  animation: mo-overlay-in .3s ease both;
}
@keyframes mo-overlay-in { from{opacity:0;} to{opacity:1;} }

/* ── Modal Box ── */
.mb {
  position: relative;
  background: linear-gradient(160deg, #1c0404 0%, #240606 40%, #1c0404 100%);
  border: 1px solid rgba(220,60,40,.55);
  border-radius: 20px;
  width: 96%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-sizing: border-box;
  box-shadow:
    0 40px 100px rgba(0,0,0,.9),
    0 6px 30px rgba(200,40,20,.5),
    inset 0 1px 0 rgba(255,160,100,.18),
    inset 0 -1px 0 rgba(0,0,0,.5);
}
.mb::-webkit-scrollbar { width: 5px; }
.mb::-webkit-scrollbar-thumb { background: #8b1a1a; border-radius: 4px; }
.mb::-webkit-scrollbar-track { background: #1a0505; }

/* Armour plate texture */
.mb::before {
  content: '';
  position: absolute; inset: 0; border-radius: 20px;
  background-image:
    repeating-linear-gradient(90deg, transparent, transparent 48px, rgba(255,255,255,.015) 48px, rgba(255,255,255,.015) 49px),
    repeating-linear-gradient(0deg,  transparent, transparent 48px, rgba(255,255,255,.015) 48px, rgba(255,255,255,.015) 49px);
  pointer-events: none;
  z-index: 0;
}

.mb.xsm { max-width: 520px; }

/* ── Modal Header ── */
.mh {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 28px 18px;
  background: linear-gradient(135deg, #5a0a0a 0%, #7a1010 30%, #8b1a1a 65%, #6b0f0f 100%);
  border-bottom: 2px solid rgba(220,70,50,.55);
  border-radius: 20px 20px 0 0;
  position: sticky; top: 0; z-index: 10;
  box-shadow: 0 4px 20px rgba(0,0,0,.5);
  overflow: hidden;
}
.mh::before {
  content: '';
  position: absolute; inset: 0;
  background: repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,.025) 40px, rgba(255,255,255,.025) 41px);
  pointer-events: none;
}
.mh::after {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, transparent 0%, rgba(255,140,80,.9) 30%, rgba(255,60,40,1) 50%, rgba(255,140,80,.9) 70%, transparent 100%);
  box-shadow: 0 0 18px rgba(255,60,40,.7), 0 0 36px rgba(200,30,10,.4);
}
.mh h3 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.35rem; font-weight: 800; color: #fff;
  letter-spacing: -.2px; margin: 0; position: relative; z-index: 1;
  text-shadow: 0 2px 12px rgba(0,0,0,.6);
}

/* ── Modal Body ── */
.md {
  padding: 28px 32px;
  color: #ffe8d0;   /* ← solid warm white — max readable */
  background: transparent;
  position: relative;
  z-index: 2;
}

/* ── Modal Footer ── */
.mf {
  display: flex; gap: 12px; justify-content: flex-end;
  padding: 18px 32px 24px;
  border-top: 1px solid rgba(180,40,40,.35);
  background: rgba(0,0,0,.3);
  border-radius: 0 0 20px 20px;
  position: sticky; bottom: 0;
  z-index: 10;
}

/* ── Pulse orbs — decorative, never block clicks ── */
.mo-orb {
  position: absolute; border-radius: 50%; filter: blur(80px);
  pointer-events: none;
  z-index: 1;
}
.mo-orb1 { width:300px; height:300px; background:#9b1818; opacity:.12; top:-80px; right:-80px; }
.mo-orb2 { width:200px; height:200px; background:#6b1a04; opacity:.09; bottom:-60px; left:-40px; }

/* ── Section dividers ── */
.sdiv {
  font-size: 10.5px; font-weight: 800; letter-spacing: 2px;
  text-transform: uppercase; color: #ffb870;   /* ← much brighter amber */
  padding: 14px 0 10px;
  border-bottom: 1px solid rgba(180,50,40,.5);
  margin-bottom: 16px;
  display: flex; align-items: center; gap: 8px;
}
.sdiv::before {
  content: '';
  display: inline-block; width: 14px; height: 2px;
  background: #e04040; border-radius: 2px; flex-shrink: 0;
  box-shadow: 0 0 6px rgba(224,64,64,.5);
}

/* ── Form fields ── */
.f { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }

.f label {
  font-size: 11.5px; font-weight: 700; letter-spacing: .4px;
  text-transform: uppercase;
  color: #ffcf96;   /* ← bright warm gold — fully readable */
}

/* ── DATE INPUT ── */
.f input[type="date"] {
  background: rgba(255,255,255,.13) !important;
  border: 1px solid rgba(210,80,60,.75) !important;
  border-radius: 8px !important;
  color: #ffe8c0 !important;
  font-size: 13.5px !important;
  padding: 10px 12px !important;
  outline: none;
  width: 100%; box-sizing: border-box;
  transition: border-color .2s, box-shadow .2s;
  color-scheme: dark;
}
.f input[type="date"]:focus {
  border-color: rgba(255,100,70,.9) !important;
  box-shadow: 0 0 0 3px rgba(160,30,30,.35) !important;
  background: rgba(255,255,255,.17) !important;
}
::-webkit-calendar-picker-indicator {
  filter: invert(1) sepia(1) saturate(3) hue-rotate(320deg);
  cursor: pointer; opacity: .9;
}

/* ── All other inputs / selects / textareas ── */
.f input:not([type="date"]),
.f select,
.f textarea,
.f .rm-combo-input {
  background: rgba(255,255,255,.1) !important;
  border: 1px solid rgba(200,60,45,.7) !important;
  border-radius: 8px !important;
  color: #fff5e8 !important;   /* ← near-white input text */
  font-size: 13.5px !important;
  padding: 11px 14px !important;
  transition: border-color .2s, background .2s, box-shadow .2s;
  outline: none;
  width: 100%; box-sizing: border-box;
}
.f input:not([type="date"]):focus,
.f select:focus,
.f textarea:focus,
.f .rm-combo-input:focus {
  border-color: rgba(255,100,70,.85) !important;
  background: rgba(255,255,255,.14) !important;
  box-shadow: 0 0 0 3px rgba(160,30,30,.32) !important;
}
.f input::placeholder, .f .rm-combo-input::placeholder {
  color: rgba(255,200,160,.4) !important;
}
.f select option { background: #200808; color: #ffd0a0; }

/* Number inputs */
.f input[type="number"] {
  color: #fff5e8 !important;
  background: rgba(255,255,255,.1) !important;
  border: 1px solid rgba(200,60,45,.7) !important;
  border-radius: 8px !important;
  padding: 11px 14px !important;
  font-size: 13.5px !important;
  width: 100%; box-sizing: border-box; outline: none;
}
.f input[type="number"]:focus {
  border-color: rgba(255,100,70,.85) !important;
  box-shadow: 0 0 0 3px rgba(160,30,30,.32) !important;
}

/* ── Era modal rows ── */
.era-mo-row { margin-bottom: 14px; }
.era-mo-row label {
  display: block; font-size: 11px; font-weight: 700;
  letter-spacing: .5px; text-transform: uppercase;
  color: #ffbf7a;   /* ← bright, readable label */
  margin-bottom: 6px;
}
.era-mo-row select,
.era-mo-row input {
  width: 100%; padding: 10px 13px;
  background: rgba(255,255,255,.1);
  border: 1px solid rgba(180,55,40,.7); border-radius: 8px;
  color: #fff5e8; font-size: 13px; box-sizing: border-box;
  outline: none; transition: border-color .2s, box-shadow .2s;
}
.era-mo-row input[type="date"] {
  color: #ffe8c0 !important;
  color-scheme: dark;
}
.era-mo-row select:focus,
.era-mo-row input:focus {
  border-color: rgba(255,100,70,.85);
  box-shadow: 0 0 0 3px rgba(160,30,30,.32);
}
.era-mo-row select option { background: #200808; color: #ffd0a0; }

/* ── Grid layouts ── */
.ig {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px 18px;
  margin-bottom: 4px;
}
.ig-2col { grid-template-columns: repeat(2, 1fr) !important; }

/* ── Buttons ── */
.btn {
  font-family: 'DM Sans', sans-serif;
  font-size: 12px; font-weight: 700; letter-spacing: .5px;
  border: none; border-radius: 10px; padding: 11px 22px;
  cursor: pointer; transition: transform .18s, box-shadow .18s, background .18s;
  display: inline-flex; align-items: center; gap: 6px;
  text-transform: uppercase;
  position: relative; z-index: 2;
}
.btn:hover { transform: translateY(-2px); }
.btn:active { transform: translateY(0) scale(.97); }

.b-pri {
  background: linear-gradient(135deg, #8b1a1a, #c83030);
  color: #fff !important;
  box-shadow: 0 4px 18px rgba(139,26,26,.55);
}
.b-pri:hover { background: linear-gradient(135deg, #a02020, #e04040); box-shadow: 0 8px 28px rgba(139,26,26,.7); }

.b-red {
  background: linear-gradient(135deg, #7f1d1d, #dc2626);
  color: #fff !important;
  box-shadow: 0 4px 18px rgba(127,29,29,.55);
}
.b-red:hover { box-shadow: 0 8px 28px rgba(127,29,29,.7); }

.b-amb {
  background: linear-gradient(135deg, #78350f, #d97706);
  color: #fff !important;
  box-shadow: 0 4px 18px rgba(120,53,15,.45);
}
.b-amb:hover { box-shadow: 0 8px 28px rgba(120,53,15,.6); }

.b-nvy {
  background: linear-gradient(135deg, #1e3a6e, #3b82f6);
  color: #fff !important;
  box-shadow: 0 4px 18px rgba(30,58,110,.45);
}

.b-slt {
  background: rgba(255,255,255,.08);
  color: #ffd4a0 !important;   /* ← brighter slate text */
  border: 1px solid rgba(180,50,40,.5) !important;
}
.b-slt:hover { background: rgba(255,255,255,.15); color: #fff !important; }

.b-sm { padding: 7px 14px !important; font-size: 10.5px !important; }

/* Cancel / neutral button */
.btn[style*='background:#e0e7ef'],
button.btn-cancel {
  background: rgba(255,255,255,.1) !important;
  color: #ffd4a8 !important;   /* ← readable warm cancel text */
  border: 1px solid rgba(180,50,40,.4) !important;
}
.btn[style*='background:#e0e7ef']:hover,
button.btn-cancel:hover {
  background: rgba(255,255,255,.16) !important;
  color: #fff !important;
}

/* ── Close button ── */
.mo-close-btn {
  background: rgba(0,0,0,.35) !important;
  border: 1px solid rgba(255,160,100,.3) !important;
  color: #ffcfa0 !important;   /* ← bright close button */
  font-size: 16px !important; cursor: pointer;
  width: 32px; height: 32px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  transition: background .18s, color .18s, transform .18s;
  position: relative; z-index: 11;
  line-height: 1; flex-shrink: 0;
}
.mo-close-btn:hover {
  background: rgba(200,30,30,.6) !important;
  color: #fff !important;
  transform: rotate(90deg) scale(1.1);
}

/* ── Error / hint text ── */
#reg_err, #era_err, #aif_err, #saf_err, #myp_err, #enc_err, #sap_err {
  font-size: 11.5px; min-height: 16px; padding: 0 2px;
  color: #fc8080;   /* ← brighter red error */
}
#reg_id-hint { font-size: 11px; min-height: 16px; padding: 0 2px; }
#reg_id-hint.ok  { color: #4ade80 !important; }
#reg_id-hint.err { color: #fc8080 !important; }
#reg_id.id-ok  { border-color: #4ade80 !important; background: rgba(74,222,128,.1) !important; }
#reg_id.id-err { border-color: #fc8080 !important; background: rgba(252,128,128,.1) !important; }

/* ── Password wrap ── */
.pw-wrap {
  position: relative; display: flex; align-items: center;
}
.pw-wrap input { flex: 1; padding-right: 40px !important; }
.pw-wrap .eye-btn {
  position: absolute; right: 8px;
  background: none; border: none;
  cursor: pointer; font-size: 16px; padding: 0 3px;
  color: rgba(255,200,150,.6); transition: color .15s;
  z-index: 3;
}
.pw-wrap .eye-btn:hover { color: rgba(255,210,170,1); }
.f.ew { position: relative; }
.f.ew input { padding-right: 40px !important; }
.f.ew .eye-btn {
  top: 50%; transform: translateY(-50%);
  position: absolute; right: 8px; z-index: 3;
}

/* ── Combobox ── */
.rm-combo-wrap { position: relative; }
.rm-combo-input { width: 100%; box-sizing: border-box; padding-right: 28px !important; }
.rm-combo-arrow {
  position: absolute; right: 6px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; font-size: 12px;
  color: rgba(255,200,150,.55); padding: 2px 4px; line-height: 1;
  z-index: 3;
}
.rm-combo-arrow:hover { color: rgba(255,210,170,1); }
.rm-combo-list {
  position: absolute; top: 100%; left: 0; right: 0;
  background: #200707; border: 1px solid rgba(180,40,40,.6);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0,0,0,.7);
  max-height: 200px; overflow-y: auto; z-index: 9999;
  display: none; margin: 4px 0; padding: 4px 0; list-style: none;
  scrollbar-width: thin; scrollbar-color: #8b1a1a #1a0505;
}
.rm-combo-list::-webkit-scrollbar { width: 4px; }
.rm-combo-list::-webkit-scrollbar-thumb { background: #8b1a1a; }
.rm-combo-item {
  padding: 8px 14px; cursor: pointer;
  font-size: 12.5px; color: #ffd8b0;   /* ← bright dropdown item text */
}
.rm-combo-item:hover { background: rgba(160,30,30,.4); color: #fff; }

/* ── Tables inside modal ── */
table.arm-table {
  width: 100%; font-size: 12.5px; border-collapse: collapse; margin-top: 6px;
}
.arm-table thead tr { background: rgba(160,30,30,.3); }
.arm-table thead th {
  padding: 8px 10px; text-align: left; font-size: 10px;
  font-weight: 700; letter-spacing: .8px; text-transform: uppercase;
  color: #ffb870;   /* ← bright table header */
  border-bottom: 1px solid rgba(180,50,40,.45);
}
.arm-table tbody tr { border-bottom: 1px solid rgba(160,40,30,.2); transition: background .15s; }
.arm-table tbody tr:hover { background: rgba(160,30,30,.12); }
.arm-table tbody td { padding: 8px 10px; color: #ffdcb8; vertical-align: middle; }   /* ← bright table cells */

/* ── Error list ── */
.err-list { list-style: none; margin: 0; padding: 0; }
.err-list li {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 10px 0; border-bottom: 1px solid rgba(180,40,40,.3);
  font-size: 13px; color: #ffd0b0;   /* ← bright error list text */
}
.err-list li:last-child { border-bottom: none; }
.err-list li::before { content: '⚠'; flex-shrink: 0; color: #fc8080; }

/* ── Info box ── */
.arm-info-box {
  background: linear-gradient(135deg, rgba(120,53,15,.3), rgba(217,119,6,.12));
  border: 1px solid rgba(217,119,6,.4); border-radius: 10px;
  padding: 14px 18px; margin-top: 16px;
  display: flex; align-items: flex-start; gap: 12px;
}
.arm-info-icon { font-size: 20px; flex-shrink: 0; margin-top: 1px; }
.arm-info-text {
  font-size: 13px; color: #ffd090; line-height: 1.7;   /* ← brighter info text */
}

/* ── Readonly field ── */
.arm-readonly {
  background: rgba(255,255,255,.07) !important;
  border: 1px solid rgba(180,45,40,.4) !important;
  border-radius: 8px; padding: 10px 14px;
  font-size: 13px; color: #ffd8b0;   /* ← readable readonly text */
  display: block; width: 100%; box-sizing: border-box;
}
.arm-readonly-label {
  font-size: 10.5px; font-weight: 700; letter-spacing: .6px;
  text-transform: uppercase; color: #ff9a5a; margin-bottom: 6px; display: block;   /* ← bright label */
}

/* ── Shockwave & shard effects ── */
@keyframes arm-shockwave { 0%{transform:scale(0);opacity:.7;} 80%{transform:scale(4);opacity:.1;} 100%{transform:scale(5);opacity:0;} }
.arm-shockwave {
  position: absolute; inset: 0; border-radius: inherit;
  background: radial-gradient(circle, rgba(220,50,30,.4) 0%, transparent 70%);
  pointer-events: none; animation: arm-shockwave .5s ease-out forwards; z-index: 10;
}
@keyframes arm-shard-fly { 0%{transform:translate(0,0) rotate(0deg) scale(1);opacity:1;} 100%{transform:translate(var(--tx),var(--ty)) rotate(var(--tr)) scale(0);opacity:0;} }
.arm-shard {
  position: fixed; width: 10px; height: 5px; border-radius: 2px;
  background: linear-gradient(90deg, #c83030, #e05020);
  pointer-events: none; z-index: 99999;
  animation: arm-shard-fly .65s cubic-bezier(.22,1,.36,1) forwards;
  box-shadow: 0 0 6px rgba(200,50,20,.6);
}

/* ══════════════════════════════════════════════════════════
   LOGOUT MODAL — Full Red Armoured (no emoji as main visual)
══════════════════════════════════════════════════════════ */
.arm-logout-crest {
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 24px; width: 96px; height: 96px;
  position: relative;
}
/* Outer ring pulse */
.arm-logout-crest::before {
  content: '';
  position: absolute; inset: -6px; border-radius: 50%;
  border: 2px solid rgba(220,60,30,.5);
  animation: arm-crest-ring 2.2s ease-in-out infinite;
}
@keyframes arm-crest-ring {
  0%,100% { transform: scale(1); opacity: .5; }
  50%      { transform: scale(1.1); opacity: 1; box-shadow: 0 0 24px rgba(220,60,30,.5); }
}
/* The SVG shield itself is injected inline in the modal HTML */

@keyframes arm-shield-float {
  0%,100% { transform: translateY(0) rotate(-2deg); filter: drop-shadow(0 0 18px rgba(220,60,30,.55)) drop-shadow(0 0 40px rgba(180,20,10,.3)); }
  50%     { transform: translateY(-8px) rotate(2deg); filter: drop-shadow(0 0 28px rgba(255,80,40,.75)) drop-shadow(0 0 56px rgba(220,30,10,.45)); }
}
.arm-logout-shield {
  animation: arm-shield-float 2.6s ease-in-out infinite;
  display: block;
}

.arm-logout-text {
  text-align: center;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.65rem; font-weight: 900; color: #fff; margin-bottom: 10px;
  background: linear-gradient(90deg, #ffd0a0, #ff8050, #ffd0a0);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  filter: drop-shadow(0 3px 10px rgba(220,60,30,.55));
  letter-spacing: -.3px;
}
.arm-logout-sub {
  text-align: center;
  font-size: 14px;          /* ← bigger */
  color: #ffd0a0;           /* ← solid warm — fully readable */
  line-height: 1.85;
}
.arm-logout-sub strong {
  color: #ff9060;           /* ← stands out clearly */
}

/* Divider line in logout */
.arm-logout-divider {
  width: 60px; height: 2px; margin: 18px auto;
  background: linear-gradient(90deg, transparent, #c83030, transparent);
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(200,48,48,.4);
}

/* ── Category warning modal ── */
.arm-warn-icon {
  font-size: 52px; text-align: center; display: block;
  margin: 0 auto 16px;
  animation: arm-spin-warn 3s ease-in-out infinite;
}
@keyframes arm-spin-warn {
  0%,100% { transform: scale(1) rotate(0deg); }
  50%     { transform: scale(1.12) rotate(8deg); }
}
.arm-warn-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.15rem; font-weight: 800; color: #ffd080;   /* ← bright */
  margin-bottom: 10px; text-align: center;
}
.arm-warn-body {
  font-size: 13.5px;      /* ← larger */
  color: #ffd8b0;         /* ← solid bright — fully readable */
  line-height: 1.75;
}
.arm-warn-body strong { color: #ffcf70; }
.arm-from-badge {
  display: inline-block; background: rgba(231,76,60,.3);
  color: #ffa0a0; border: 1px solid rgba(231,76,60,.5);
  padding: 3px 12px; border-radius: 6px; font-weight: 700; font-size: 12px;
}
.arm-to-badge {
  display: inline-block; background: rgba(59,130,246,.3);
  color: #a0c8ff; border: 1px solid rgba(59,130,246,.5);
  padding: 3px 12px; border-radius: 6px; font-weight: 700; font-size: 12px;
}

/* ── Account management inline forms ── */
.acc-inline-form {
  background: rgba(255,255,255,.05) !important;
  border: 1.5px solid rgba(180,40,40,.5) !important;
  border-radius: 12px !important;
  padding: 20px 22px !important;
  margin-top: 12px !important;
  animation: accFormIn .2s ease both;
}
@keyframes accFormIn { from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:none;} }

/* ── Password mask in tables ── */
.pw-mask {
  color: #ffd0a0; font-size: 13px; letter-spacing: 3px; font-weight: 700;
}
.pw-eye-btn {
  background: rgba(160,30,30,.4) !important;
  border: 1px solid rgba(220,80,50,.45) !important;
  border-radius: 6px !important;
  cursor: pointer; font-size: 15px;
  padding: 3px 7px; line-height: 1;
  transition: background .15s, transform .15s;
}
.pw-eye-btn:hover {
  background: rgba(220,50,30,.65) !important;
  transform: scale(1.1);
}

/* ── Generic note / reminder blocks used throughout ── */
.arm-note {
  background: rgba(180,40,20,.15);
  border-left: 3px solid #c83030;
  border-radius: 0 8px 8px 0;
  padding: 12px 16px; margin: 12px 0;
  font-size: 13px; color: #ffd0a0; line-height: 1.7;
}
.arm-note strong { color: #ff9060; }

.arm-reminder {
  background: rgba(120,53,15,.25);
  border: 1px solid rgba(217,119,6,.45);
  border-radius: 10px;
  padding: 13px 17px; margin: 12px 0;
  font-size: 13px; color: #ffd090; line-height: 1.7;
}
.arm-reminder strong { color: #ffbf60; }
`;

  document.head.appendChild(s);
})();

/* ─────────────────────────────────────────────────────────
   COMBOBOX HELPERS
───────────────────────────────────────────────────────── */
function _buildCombobox({ id, placeholder, options, value = '' }) {
  const e = s => String(s || '').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  return `
    <div class="rm-combo-wrap" id="wrap_${id}">
      <input type="text" id="${id}" class="rm-combo-input"
             placeholder="${e(placeholder)}" value="${e(value)}" autocomplete="off"/>
      <button type="button" class="rm-combo-arrow" data-for="${id}" tabindex="-1">▾</button>
      <ul class="rm-combo-list" id="list_${id}">
        ${options.map(o => `<li class="rm-combo-item" data-val="${e(o)}">${e(o)}</li>`).join('')}
      </ul>
    </div>`;
}

function _wireCombobox(id) {
  const input = document.getElementById(id);
  const list  = document.getElementById('list_' + id);
  const arrow = document.querySelector(`.rm-combo-arrow[data-for="${id}"]`);
  if (!input || !list) return;

  const show = (filter = '') => {
    const f = filter.toLowerCase();
    let any = false;
    list.querySelectorAll('.rm-combo-item').forEach(li => {
      const match = !f || li.dataset.val.toLowerCase().includes(f);
      li.style.display = match ? '' : 'none';
      if (match) any = true;
    });
    list.style.display = any ? 'block' : 'none';
  };
  const hide = () => setTimeout(() => { list.style.display = 'none'; }, 160);

  input.addEventListener('focus', () => show(input.value));
  input.addEventListener('input', () => show(input.value));
  input.addEventListener('blur',  hide);
  arrow?.addEventListener('mousedown', e => {
    e.preventDefault();
    list.style.display === 'block' ? (list.style.display = 'none') : (input.focus(), show(''));
  });
  list.querySelectorAll('.rm-combo-item').forEach(li => {
    li.addEventListener('mousedown', e => {
      e.preventDefault();
      input.value = li.dataset.val;
      list.style.display = 'none';
      input.dispatchEvent(new Event('input'));
    });
  });
}

/* ─────────────────────────────────────────────────────────
   UTILITY
───────────────────────────────────────────────────────── */
function closeMo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.transition = 'opacity .22s ease';
  el.style.opacity = '0';
  setTimeout(() => el.remove(), 230);
}
window.closeMo = closeMo;

function _escMo(s) {
  return String(s || '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function _armExplode(el) {
  const wave = document.createElement('div');
  wave.className = 'arm-shockwave';
  el.style.position = 'relative';
  el.style.overflow = 'hidden';
  el.appendChild(wave);
  setTimeout(() => wave.remove(), 520);
}

/* ─────────────────────────────────────────────────────────
   ALL CAPS ENFORCEMENT
───────────────────────────────────────────────────────── */
const _CAPS_SKIP_IDS = ['reg_pw', 'reg_email'];

function enforceAllCaps(container) {
  container.querySelectorAll('input[type=text], input:not([type])').forEach(inp => {
    if (['password','date','number','hidden','checkbox','radio','email'].includes(inp.type)) return;
    if (_CAPS_SKIP_IDS.includes(inp.id)) return;
    inp.addEventListener('input', function () {
      const pos = this.selectionStart;
      this.value = this.value.toUpperCase();
      try { this.setSelectionRange(pos, pos); } catch(e) {}
    });
    inp.addEventListener('blur', function () { this.value = this.value.toUpperCase(); });
  });
}
window.enforceAllCaps = enforceAllCaps;

/* ─────────────────────────────────────────────────────────
   SAVE EMPLOYEE + ERA HANDLER
───────────────────────────────────────────────────────── */
async function saveEmployeeAndHandleEra(body, onSuccess) {
  const res = await apiCall('save_employee', body);
  if (res.ok) {
    if (typeof onSuccess === 'function') onSuccess(res);
    if (res.era_created) {
      alert(
        `✅ Employee updated!\n\n` +
        `Category changed from "${res.old_status}" → "${res.new_status}".\n\n` +
        `A new Conversion Era has been automatically created on the leave card ` +
        `carrying the current balances forward.`
      );
    }
  }
  return res;
}
window.saveEmployeeAndHandleEra = saveEmployeeAndHandleEra;

/* ─────────────────────────────────────────────────────────
   CONVERSION ERA MODAL
───────────────────────────────────────────────────────── */
function showEraModal(emp) {
  document.getElementById('eraMo')?.remove();
  const html = `
    <div class="mo open" id="eraMo">
      <div class="mb xsm" style="max-width:480px;">
        <div class="mo-orb mo-orb1"></div>
        <div class="mo-orb mo-orb2"></div>
        <div class="mh">
          <h3>🔄 Add Conversion Era</h3>
          <button class="mo-close-btn" onclick="closeMo('eraMo')">✕</button>
        </div>
        <div class="md">
          <div class="era-mo-row"><label>From Status</label>
            <select id="era_from">
              <option value="Teaching">Teaching</option>
              <option value="Non-Teaching">Non-Teaching</option>
              <option value="Teaching Related">Teaching Related</option>
            </select>
          </div>
          <div class="era-mo-row"><label>To Status</label>
            <select id="era_to">
              <option value="Non-Teaching">Non-Teaching</option>
              <option value="Teaching">Teaching</option>
              <option value="Teaching Related">Teaching Related</option>
            </select>
          </div>
          <div class="era-mo-row"><label>Conversion Date</label>
            <input id="era_date" type="date"/>
          </div>
          <div class="era-mo-row"><label>Forward VL Balance</label>
            <input id="era_bv" type="number" step="any" value="0"/>
          </div>
          <div class="era-mo-row"><label>Forward SL Balance</label>
            <input id="era_bs" type="number" step="any" value="0"/>
          </div>
          <div id="era_err" style="color:#fc8080;font-size:11.5px;margin-top:8px;min-height:14px;"></div>
        </div>
        <div class="mf">
          <button class="btn" style="background:#e0e7ef;" onclick="closeMo('eraMo')">Cancel</button>
          <button class="btn b-pri" id="eraModSave">💾 Add Era</button>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', html);

  document.getElementById('eraModSave').addEventListener('click', async () => {
    const fromS = document.getElementById('era_from').value;
    const toS   = document.getElementById('era_to').value;
    const date  = document.getElementById('era_date').value;
    const bv    = +document.getElementById('era_bv').value || 0;
    const bs    = +document.getElementById('era_bs').value || 0;
    const rec = {
      _conversion: true, fromStatus: fromS, toStatus: toS, date,
      fwdBV: bv, fwdBS: bs,
      so: '', prd: '', from: '', to: '', spec: '', action: 'Conversion',
      earned: 0, forceAmount: 0, monAmount: 0, monDisAmt: 0,
      monV: 0, monS: 0, monDV: 0, monDS: 0, trV: 0, trS: 0,
    };
    const res = await apiCall('save_record', { employee_id: emp.id, record: rec });
    if (!res.ok) { document.getElementById('era_err').textContent = res.error; return; }
    closeMo('eraMo');
    const res2 = await apiCall('get_records', { employee_id: emp.id }, 'GET');
    if (res2.ok) emp.records = res2.records || [];
    renderLeaveCardTable(emp);
  });
}
window.showEraModal = showEraModal;

/* ─────────────────────────────────────────────────────────
   REGISTER / EDIT EMPLOYEE MODAL
───────────────────────────────────────────────────────── */
function showRegisterModal(emp) {
  const isEdit = !!emp;
  const r = emp || {};

  if (!document.getElementById('reg-modal-style')) {
    const s = document.createElement('style');
    s.id = 'reg-modal-style';
    s.textContent = `
      #registerMo .mb { max-width: 960px !important; width: 97% !important; }
      #registerMo .ig { grid-template-columns: repeat(3,1fr) !important; }
      #registerMo .ig-2col { grid-template-columns: repeat(2,1fr) !important; }
      #registerMo #reg_suffix { font-weight:700 !important; font-size:12px !important; }
      #registerMo #reg_id { letter-spacing:1px; font-weight:700; }
      #registerMo input[type=text]:not(#reg_pw):not(#reg_email),
      #registerMo input:not([type]):not(#reg_pw):not(#reg_email) { text-transform:uppercase; }
      #registerMo #reg_pw, #registerMo #reg_email { text-transform:none !important; }
      #regErrorMo .mb { max-width: 520px !important; }
      #catWarnMo  .mb { max-width: 500px !important; }
    `;
    document.head.appendChild(s);
  }

  const existingPw = isEdit ? (r.password || '') : '';

  const html = `
    <div class="mo open" id="registerMo">
      <div class="mb">
        <div class="mo-orb mo-orb1"></div>
        <div class="mo-orb mo-orb2"></div>
        <div class="mh">
          <h3>${isEdit ? '✏️ Edit Employee' : '➕ Register Employee'}</h3>
          <button class="mo-close-btn" onclick="closeMo('registerMo')">✕</button>
        </div>
        <div class="md" style="position:relative;z-index:2;">

          <div class="sdiv">👤 Personal Information</div>
          <div class="ig">
            <div class="f hl">
              <label>Employee No. * <span style="font-weight:400;font-size:10px;color:rgba(255,200,140,.6);">(exactly 7 digits)</span></label>
              <input id="reg_id" type="text" inputmode="numeric" maxlength="7"
                     value="${_escMo(r.id||'')}" placeholder="e.g. 1234567"/>
              <span id="reg_id-hint"></span>
            </div>
            <div class="f">
              <label>Surname *</label>
              <input id="reg_surname" type="text" value="${_escMo(r.surname||'')}"/>
            </div>
            <div class="f">
              <label>Given Name *</label>
              <input id="reg_given" type="text" value="${_escMo(r.given||'')}"/>
            </div>
            <div class="f">
              <label>Suffix</label>
              <input id="reg_suffix" type="text" value="${_escMo(r.suffix||'')}"/>
            </div>
            <div class="f">
              <label>Maternal Name</label>
              <input id="reg_maternal" type="text" value="${_escMo(r.maternal||'')}"/>
            </div>
            <div class="f">
              <label>Sex *</label>
              <select id="reg_sex">
                <option value="">— Select —</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div class="f">
              <label>Civil Status</label>
              ${_buildCombobox({ id:'reg_civil', placeholder:'Select or type…', options:CIVIL_STATUS_OPTIONS, value:r.civil||'' })}
            </div>
            <div class="f">
              <label>Date of Birth *</label>
              <input id="reg_dob" type="date" value="${r.dob||''}"/>
            </div>
            <div class="f">
              <label>Place of Birth</label>
              <input id="reg_pob" type="text" value="${_escMo(r.pob||'')}"/>
            </div>
          </div>

          <div class="sdiv">🏢 Employment Details</div>
          <div class="ig">
            <div class="f">
              <label>Category *</label>
              <select id="reg_status">
                <option value="Teaching">Teaching</option>
                <option value="Non-Teaching">Non-Teaching</option>
                <option value="Teaching Related">Teaching Related</option>
              </select>
            </div>
            <div class="f">
              <label>Account Status</label>
              <select id="reg_accstatus">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div class="f">
              <label>Position *</label>
              ${_buildCombobox({ id:'reg_pos', placeholder:'Select or type…', options:POSITION_OPTIONS, value:r.pos||'' })}
            </div>
            <div class="f">
              <label>School / Office *</label>
              ${_buildCombobox({ id:'reg_school', placeholder:'Select or type…', options:SCHOOL_OPTIONS, value:r.school||'' })}
            </div>
            <div class="f">
              <label>Date of Appointment</label>
              <input id="reg_appt" type="date" value="${r.appt||''}"/>
            </div>
            <div class="f">
              <label>TIN</label>
              <input id="reg_tin" type="text" value="${_escMo(r.tin||'')}"/>
            </div>
            <div class="f">
              <label>Rating</label>
              <input id="reg_rating" type="text" value="${_escMo(r.rating||'')}"/>
            </div>
          </div>

          <div class="sdiv">🎓 Education &amp; Eligibility</div>
          <div class="ig">
            <div class="f">
              <label>Highest Education</label>
              <input id="reg_edu" type="text" value="${_escMo(r.edu||'')}"/>
            </div>
            <div class="f">
              <label>Eligibility</label>
              <input id="reg_elig" type="text" value="${_escMo(r.elig||'')}"/>
            </div>
            <div class="f">
              <label>Professional Exam</label>
              <input id="reg_pexam" type="text" value="${_escMo(r.pexam||'')}"/>
            </div>
            <div class="f">
              <label>Date of Exam</label>
              <input id="reg_dexam" type="date" value="${r.dexam||''}"/>
            </div>
          </div>

          <div class="sdiv">📍 Contact Information</div>
          <div class="ig ig-2col">
            <div class="f" style="grid-column:1/-1;">
              <label>Present Address *</label>
              <input id="reg_addr" type="text" value="${_escMo(r.addr||'')}"/>
            </div>
            <div class="f">
              <label>Spouse Name</label>
              <input id="reg_spouse" type="text" value="${_escMo(r.spouse||'')}"/>
            </div>
          </div>

          <div class="sdiv">🔐 Login Credentials</div>
          <div class="ig ig-2col">
            <div class="f">
              <label>Email *</label>
              <div style="display:flex;align-items:center;">
                <input id="reg_email" type="text"
                       value="${_escMo((r.email||'').replace(/@deped\.gov\.ph$/i,''))}"
                       placeholder="username"
                       style="border-radius:8px 0 0 8px!important;flex:1;min-width:0;text-transform:lowercase!important;"/>
                <span style="background:rgba(255,255,255,.08);border:1px solid rgba(180,50,40,.6);border-left:none;
                             padding:0 12px;height:42px;display:flex;align-items:center;
                             font-size:11.5px;color:#ff9860;border-radius:0 8px 8px 0;
                             white-space:nowrap;">@deped.gov.ph</span>
              </div>
            </div>
            <div class="f">
              <label>Password ${isEdit ? '<span style="font-weight:400;color:rgba(255,180,120,.65);font-size:10px;">(blank = keep current)</span>' : '*'}</label>
              <div class="pw-wrap">
                <input id="reg_pw" type="text"
                       value="${_escMo(existingPw)}"
                       placeholder="${isEdit ? 'Leave blank to keep current password' : 'Enter password'}"/>
                <button class="eye-btn" type="button" tabindex="-1" id="regPwEye">👁</button>
              </div>
            </div>
          </div>

          <div id="reg_err" style="color:#fc8080;font-size:11.5px;margin-top:8px;min-height:14px;"></div>
        </div>
        <div class="mf">
          <button class="btn" style="background:#e0e7ef;" onclick="closeMo('registerMo')">Cancel</button>
          <button class="btn b-pri" id="regSave">💾 ${isEdit ? 'Update Employee' : 'Register Employee'}</button>
        </div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML('beforeend', html);
  const mo = document.getElementById('registerMo');
  mo.querySelector('#reg_sex').value       = r.sex            || '';
  mo.querySelector('#reg_status').value    = r.status         || 'Teaching';
  mo.querySelector('#reg_accstatus').value = r.account_status || 'active';

  _wireCombobox('reg_civil');
  _wireCombobox('reg_pos');
  _wireCombobox('reg_school');

  if (isEdit) {
    const originalStatus = r.status || 'Teaching';
    mo.querySelector('#reg_status').addEventListener('change', function () {
      if (this.value !== originalStatus) showCatChangeWarning(originalStatus, this.value, this);
    });
  }

  const idInput = mo.querySelector('#reg_id');
  const idHint  = mo.querySelector('#reg_id-hint');
  function validateIdField() {
    const digitsOnly = idInput.value.replace(/\D/g, '');
    if (digitsOnly !== idInput.value) idInput.value = digitsOnly;
    if (digitsOnly.length === 0) {
      idInput.classList.remove('id-ok','id-err'); idHint.textContent = ''; idHint.className = '';
    } else if (digitsOnly.length === 7) {
      idInput.classList.add('id-ok'); idInput.classList.remove('id-err');
      idHint.textContent = '✓ Valid Employee ID'; idHint.className = 'ok';
    } else {
      idInput.classList.add('id-err'); idInput.classList.remove('id-ok');
      idHint.textContent = `${digitsOnly.length}/7 digits — must be exactly 7`; idHint.className = 'err';
    }
  }
  idInput.addEventListener('input', validateIdField);
  idInput.addEventListener('paste', () => setTimeout(validateIdField, 0));
  if (isEdit) validateIdField();

  document.getElementById('regPwEye')?.addEventListener('click', () => {
    const pw = mo.querySelector('#reg_pw');
    const eye = document.getElementById('regPwEye');
    if (pw.type === 'text') { pw.type = 'password'; eye.textContent = '🙈'; }
    else                    { pw.type = 'text';     eye.textContent = '👁'; }
  });

  enforceAllCaps(mo);

  document.getElementById('regSave').addEventListener('click', async () => {
    const errEl = document.getElementById('reg_err');
    errEl.textContent = '';
    const getVal = id => mo.querySelector(`#${id}`)?.value?.trim() || '';
    const rawId = getVal('reg_id').replace(/\D/g, '');
    if (!/^\d{7}$/.test(rawId)) {
      showRegErrorModal(['Employee ID must be exactly 7 digits (numbers only).']);
      mo.querySelector('#reg_id').focus(); return;
    }
    const errors = [];
    if (!getVal('reg_surname'))  errors.push('Surname is required.');
    if (!getVal('reg_given'))    errors.push('Given Name is required.');
    if (!mo.querySelector('#reg_sex').value) errors.push('Sex is required.');
    if (!getVal('reg_pos'))      errors.push('Position is required.');
    if (!getVal('reg_school'))   errors.push('School / Office is required.');
    if (!getVal('reg_addr'))     errors.push('Present Address is required.');
    const emailUsername = getVal('reg_email');
    if (!emailUsername)          errors.push('Email username is required.');
    if (!isEdit && !mo.querySelector('#reg_pw').value) errors.push('Password is required.');
    if (errors.length > 0) { showRegErrorModal(errors); return; }

    const body = {
      originalId:     isEdit ? r.id : '',
      id:             rawId,
      surname:        getVal('reg_surname').toUpperCase(),
      given:          getVal('reg_given').toUpperCase(),
      suffix:         getVal('reg_suffix').toUpperCase(),
      maternal:       getVal('reg_maternal').toUpperCase(),
      sex:            mo.querySelector('#reg_sex').value,
      civil:          getVal('reg_civil').toUpperCase(),
      dob:            mo.querySelector('#reg_dob').value,
      pob:            getVal('reg_pob').toUpperCase(),
      addr:           getVal('reg_addr').toUpperCase(),
      spouse:         getVal('reg_spouse').toUpperCase(),
      edu:            getVal('reg_edu').toUpperCase(),
      elig:           getVal('reg_elig').toUpperCase(),
      rating:         getVal('reg_rating').toUpperCase(),
      tin:            getVal('reg_tin').toUpperCase(),
      pexam:          getVal('reg_pexam').toUpperCase(),
      dexam:          mo.querySelector('#reg_dexam').value,
      appt:           mo.querySelector('#reg_appt').value,
      status:         mo.querySelector('#reg_status').value,
      account_status: mo.querySelector('#reg_accstatus').value,
      pos:            getVal('reg_pos').toUpperCase(),
      school:         getVal('reg_school').toUpperCase(),
      email:          emailUsername.toLowerCase() + '@deped.gov.ph',
      password:       mo.querySelector('#reg_pw').value,
    };

    const res = await saveEmployeeAndHandleEra(body, (result) => {
      closeMo('registerMo');
      if (isEdit) {
        const idx = state.db.findIndex(e => e.id === r.id);
        if (idx >= 0) {
          state.db[idx] = {
            ...state.db[idx], ...body, id: body.id,
            records: result.era_created ? [] : (state.db[idx].records || []),
          };
        }
      } else {
        state.db.push({ ...body, records: [], conversionLog: [] });
      }
      if (typeof filterPersonnelTable   === 'function') filterPersonnelTable();
      if (typeof filterSAPersonnelTable === 'function') filterSAPersonnelTable();
      if (!result.era_created) alert(isEdit ? '✅ Employee updated!' : '✅ Employee registered!');
    });
    if (!res.ok) showRegErrorModal([res.error || 'Save failed. Please try again.']);
  });
}
window.showRegisterModal = showRegisterModal;

/* ─────────────────────────────────────────────────────────
   REGISTRATION ERROR MODAL
───────────────────────────────────────────────────────── */
function showRegErrorModal(errors) {
  document.getElementById('regErrorMo')?.remove();
  const items = errors.map(e => `<li>${_escMo(e)}</li>`).join('');
  const html = `
    <div class="mo open" id="regErrorMo" style="z-index:10001;">
      <div class="mb" style="max-width:520px;">
        <div class="mh" style="background:linear-gradient(135deg,#4a0808,#7f1d1d,#dc2626);">
          <h3>⚠️ Please Fix the Following</h3>
          <button class="mo-close-btn" onclick="closeMo('regErrorMo')">✕</button>
        </div>
        <div class="md">
          <ul class="err-list">${items}</ul>
        </div>
        <div class="mf">
          <button class="btn b-red" onclick="closeMo('regErrorMo')">Got It 👊</button>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
}
window.showRegErrorModal = showRegErrorModal;

/* ─────────────────────────────────────────────────────────
   CATEGORY CHANGE WARNING MODAL
───────────────────────────────────────────────────────── */
function showCatChangeWarning(fromCat, toCat, selectEl) {
  document.getElementById('catWarnMo')?.remove();
  const html = `
    <div class="mo open" id="catWarnMo" style="z-index:10001;">
      <div class="mb" style="max-width:500px;">
        <div class="mh" style="background:linear-gradient(135deg,#3a1a04,#78350f,#d97706);">
          <h3>⚠️ Category Change Warning</h3>
          <button class="mo-close-btn" onclick="closeMo('catWarnMo')">✕</button>
        </div>
        <div class="md">
          <div class="arm-warn-icon">🔄</div>
          <p class="arm-warn-title">Changing Category</p>
          <p class="arm-warn-body" style="margin-bottom:12px;">
            You are changing the category from
            <span class="arm-from-badge">${_escMo(fromCat)}</span>
            &nbsp;→&nbsp;
            <span class="arm-to-badge">${_escMo(toCat)}</span>.
          </p>
          <p class="arm-warn-body" style="margin-bottom:10px;">
            This will automatically create a <strong>new Conversion Era</strong> on the
            employee's leave card when saved. The leave card will then use a
            <strong>different computation</strong> from the conversion point forward.
          </p>
          <p class="arm-warn-body" style="color:#ffb090;">
            Current balances will be carried forward into the new era.
            This action cannot be undone without manually removing the era.
          </p>
        </div>
        <div class="mf">
          <button class="btn" style="background:#e0e7ef;" id="catWarnRevert">↩ Revert Change</button>
          <button class="btn b-amb" onclick="closeMo('catWarnMo')">I Understand, Proceed</button>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
  document.getElementById('catWarnRevert').addEventListener('click', () => {
    selectEl.value = fromCat;
    closeMo('catWarnMo');
  });
}
window.showCatChangeWarning = showCatChangeWarning;

/* ─────────────────────────────────────────────────────────
   LOGOUT MODAL  —  Full Red Armoured, SVG Shield
───────────────────────────────────────────────────────── */
/* Inline SVG: armoured shield with crossed swords motif */
const _LOGOUT_SHIELD_SVG = `
<svg class="arm-logout-shield" width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shieldGrad" x1="48" y1="2" x2="48" y2="94" gradientUnits="userSpaceOnUse">
      <stop offset="0%"  stop-color="#c83030"/>
      <stop offset="50%" stop-color="#8b1a1a"/>
      <stop offset="100%" stop-color="#5a0a0a"/>
    </linearGradient>
    <linearGradient id="shieldEdge" x1="0" y1="0" x2="96" y2="96" gradientUnits="userSpaceOnUse">
      <stop offset="0%"  stop-color="#ff9060" stop-opacity="0.9"/>
      <stop offset="50%" stop-color="#e04030" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#c83030" stop-opacity="0.2"/>
    </linearGradient>
    <radialGradient id="shieldGlow" cx="48" cy="38" r="36" gradientUnits="userSpaceOnUse">
      <stop offset="0%"  stop-color="#ff6040" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#8b1a1a" stop-opacity="0"/>
    </radialGradient>
    <filter id="shieldShadow">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#c83030" flood-opacity="0.55"/>
    </filter>
  </defs>
  <!-- Shield body -->
  <path d="M48 4 L88 18 L88 50 C88 70 70 84 48 92 C26 84 8 70 8 50 L8 18 Z"
        fill="url(#shieldGrad)" stroke="url(#shieldEdge)" stroke-width="2.5"
        filter="url(#shieldShadow)"/>
  <!-- Inner glow -->
  <path d="M48 4 L88 18 L88 50 C88 70 70 84 48 92 C26 84 8 70 8 50 L8 18 Z"
        fill="url(#shieldGlow)"/>
  <!-- Armour ridge lines -->
  <path d="M48 10 L82 22 L82 50 C82 67 66 80 48 87" stroke="rgba(255,160,100,.22)" stroke-width="1" fill="none"/>
  <path d="M48 10 L14 22 L14 50 C14 67 30 80 48 87" stroke="rgba(255,160,100,.22)" stroke-width="1" fill="none"/>
  <!-- Centre line -->
  <line x1="48" y1="10" x2="48" y2="87" stroke="rgba(255,140,80,.18)" stroke-width="1.5"/>
  <!-- Horizontal band -->
  <path d="M10 40 L86 40" stroke="rgba(255,140,80,.16)" stroke-width="1"/>
  <!-- Crossed swords -->
  <!-- Sword 1: top-left to bottom-right -->
  <line x1="30" y1="26" x2="66" y2="62" stroke="#ffcfa0" stroke-width="2.8" stroke-linecap="round"/>
  <!-- Sword 2: top-right to bottom-left -->
  <line x1="66" y1="26" x2="30" y2="62" stroke="#ffcfa0" stroke-width="2.8" stroke-linecap="round"/>
  <!-- Sword 1 guard -->
  <line x1="36" y1="22" x2="36" y2="32" stroke="#ff9060" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Sword 2 guard -->
  <line x1="60" y1="22" x2="60" y2="32" stroke="#ff9060" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Sword 1 pommel -->
  <circle cx="30" cy="63" r="3" fill="#ff8050"/>
  <!-- Sword 2 pommel -->
  <circle cx="66" cy="63" r="3" fill="#ff8050"/>
  <!-- Centre gem -->
  <circle cx="48" cy="44" r="5.5" fill="#ff6040" stroke="#ffcfa0" stroke-width="1.5"
          style="filter:drop-shadow(0 0 6px rgba(255,96,64,.9))"/>
  <!-- Top crown notch -->
  <path d="M38 4 L48 10 L58 4" stroke="rgba(255,180,120,.5)" stroke-width="1.5" fill="none" stroke-linejoin="round"/>
</svg>`;

function showLogoutModal() {
  document.getElementById('logoutMo')?.remove();
  const html = `
    <div class="mo open" id="logoutMo">
      <div class="mb xsm" style="max-width:460px;">
        <div class="mo-orb mo-orb1" style="background:#c83030;opacity:.14;top:-60px;right:-60px;width:240px;height:240px;"></div>
        <div class="mo-orb mo-orb2" style="background:#8b1a1a;opacity:.12;bottom:-40px;left:-30px;width:200px;height:200px;"></div>
        <div class="mh">
          <h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="vertical-align:-3px;margin-right:7px;" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="#ffb880" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="16 17 21 12 16 7" stroke="#ffb880" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke="#ffb880" stroke-width="2.2" stroke-linecap="round"/>
            </svg>
            Confirm Logout
          </h3>
          <button class="mo-close-btn" onclick="closeMo('logoutMo')">✕</button>
        </div>
        <div class="md" style="text-align:center;padding:36px 32px 24px;position:relative;z-index:2;background:transparent!important;">
          <div class="arm-logout-crest">
            ${_LOGOUT_SHIELD_SVG}
          </div>
          <div class="arm-logout-text">Leaving so soon?</div>
          <div class="arm-logout-divider"></div>
          <p class="arm-logout-sub">
            You will be securely signed out of the<br>
            <strong>SDO Koronadal City Leave Card System.</strong><br><br>
            Any unsaved changes will be lost.
          </p>
        </div>
        <div class="mf" style="justify-content:center;gap:16px;padding-bottom:28px;">
          <button class="btn" style="background:#e0e7ef;min-width:130px;" onclick="closeMo('logoutMo')">Stay Here</button>
          <button class="btn b-red" id="confirmLogout" style="min-width:160px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:-1px;">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="16 17 21 12 16 7" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>
            </svg>
            Yes, Logout
          </button>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', html);

  document.getElementById('confirmLogout').addEventListener('click', () => {
    _armExplode(document.querySelector('#logoutMo .mb'));
    setTimeout(() => {
      closeMo('logoutMo');
      doLogout();
    }, 200);
  });
}
window.showLogoutModal = showLogoutModal;