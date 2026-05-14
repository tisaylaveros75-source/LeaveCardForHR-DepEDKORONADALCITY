/* ============================================================
   SDO Koronadal City — Leave Card System
   modals.js — All modal / dialog functions
   RED ARMOURED EDITION — Unified, readable, spectacular
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

/* ══ FORCE DARK — override any site-wide white ══ */
.mo .mb { background: linear-gradient(160deg, #1e0c0c 0%, #2a1010 40%, #201010 100%) !important; }
.mo .md { background: transparent !important; }
.mo .mf { background: rgba(0,0,0,.25) !important; }

/* ══ OVERLAY ══ */
.mo {
  position: fixed; inset: 0; z-index: 9990;
  background: rgba(20,6,6,.82) !important;
  backdrop-filter: blur(10px);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
  animation: mo-overlay-in .3s ease both;
}
@keyframes mo-overlay-in { from{opacity:0;} to{opacity:1;} }

/* ══ MODAL BOX ══ */
.mb {
  position: relative;
  background: linear-gradient(160deg, #140303 0%, #1e0606 40%, #160404 100%) !important;
  border: 1px solid rgba(200,50,35,.45);
  border-radius: 20px;
  width: 96%; max-width: 600px; max-height: 90vh;
  overflow-y: auto;
  box-shadow:
    0 40px 100px rgba(0,0,0,.8),
    0 6px 30px rgba(180,30,20,.5),
    inset 0 1px 0 rgba(255,160,100,.15),
    inset 0 -1px 0 rgba(0,0,0,.6);
  scrollbar-width: thin; scrollbar-color: #8b1a1a #140303;
}
.mb::-webkit-scrollbar { width: 5px; }
.mb::-webkit-scrollbar-thumb { background: #8b1a1a; border-radius: 4px; }
.mb::-webkit-scrollbar-track { background: #140303; }
.mb::before {
  content: ''; position: absolute; inset: 0; border-radius: 20px;
  background-image:
    repeating-linear-gradient(90deg, transparent, transparent 48px, rgba(255,255,255,.012) 48px, rgba(255,255,255,.012) 49px),
    repeating-linear-gradient(0deg,  transparent, transparent 48px, rgba(255,255,255,.012) 48px, rgba(255,255,255,.012) 49px);
  pointer-events: none;
}
.mb::after {
  content: ''; position: absolute; top: 14px; left: 14px;
  width: 7px; height: 7px; border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, rgba(255,200,120,.5), rgba(180,60,30,.4));
  box-shadow: 0 1px 3px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,220,150,.3);
}
.mb.xsm { max-width: 520px; }

/* ══ MODAL HEADER ══ */
.mh {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 28px 18px;
  background: linear-gradient(135deg, #5a0a0a 0%, #7a1010 30%, #8b1a1a 65%, #6b0f0f 100%);
  border-bottom: 2px solid rgba(192,57,43,.5);
  border-radius: 20px 20px 0 0;
  position: sticky; top: 0; z-index: 5;
  box-shadow: 0 4px 20px rgba(0,0,0,.4);
  overflow: hidden;
}
.mh::before {
  content: ''; position: absolute; inset: 0;
  background: repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,.018) 40px, rgba(255,255,255,.018) 41px);
  pointer-events: none;
}
.mh::after {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, transparent 0%, rgba(255,140,80,.8) 30%, rgba(255,60,40,1) 50%, rgba(255,140,80,.8) 70%, transparent 100%);
  box-shadow: 0 0 16px rgba(255,60,40,.6);
}
.mh h3 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.25rem; font-weight: 800; color: #fff;
  letter-spacing: -.2px; margin: 0; position: relative; z-index: 1;
  text-shadow: 0 2px 12px rgba(0,0,0,.5);
}

/* ══ MODAL BODY ══ */
.md {
  padding: 28px 32px;
  color: rgba(240,210,190,.82) !important;
  background: transparent !important;
}

/* ══ MODAL FOOTER ══ */
.mf {
  display: flex; gap: 12px; justify-content: flex-end;
  padding: 18px 32px 24px;
  border-top: 1px solid rgba(139,26,26,.3);
  background: rgba(0,0,0,.2) !important;
  border-radius: 0 0 20px 20px;
  position: sticky; bottom: 0;
}

/* ══ SECTION DIVIDERS ══ */
.sdiv {
  font-size: 11px; font-weight: 800; letter-spacing: 2px;
  text-transform: uppercase; color: rgba(255,180,120,.9);
  padding: 14px 0 10px;
  border-bottom: 1px solid rgba(180,40,30,.35);
  margin-bottom: 16px;
  display: flex; align-items: center; gap: 10px;
}
.sdiv::before {
  content: ''; display: inline-block; width: 16px; height: 3px;
  background: linear-gradient(90deg, #c83030, #ff6040);
  border-radius: 3px; flex-shrink: 0;
  box-shadow: 0 0 8px rgba(200,48,48,.5);
}

/* ══ FORM FIELDS ══ */
.f { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.f label {
  font-size: 12px; font-weight: 700; letter-spacing: .5px;
  text-transform: uppercase; color: rgba(255,190,140,.85);
}
.f input, .f select, .f textarea, .f .rm-combo-input {
  background: rgba(255,255,255,.12) !important;
  border: 1px solid rgba(200,80,60,.6) !important;
  border-radius: 9px !important;
  color: rgba(235,215,195,.88) !important;
  font-size: 14px !important;
  padding: 11px 14px !important;
  transition: border-color .2s, background .2s, box-shadow .2s;
  outline: none;
}
.f input[type="date"] {
  color-scheme: dark;
}
::-webkit-calendar-picker-indicator {
  filter: invert(1) brightness(2);
  cursor: pointer;
  opacity: 1 !important;
}
.f input:focus, .f select:focus, .f textarea:focus, .f .rm-combo-input:focus {
  border-color: rgba(220,80,60,.7) !important;
  background: rgba(255,255,255,.09) !important;
  box-shadow: 0 0 0 3px rgba(139,26,26,.25) !important;
}
.f input::placeholder, .f .rm-combo-input::placeholder {
  color: rgba(255,180,130,.35) !important;
}
.f select option { background: #200808; color: rgba(255,220,180,.9); }

/* ══ GRID LAYOUTS ══ */
.ig { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px 18px; margin-bottom: 4px; }
.ig-2col { grid-template-columns: repeat(2,1fr) !important; }

/* ══ BUTTONS ══ */
.btn {
  font-family: 'DM Sans', sans-serif;
  font-size: 12px; font-weight: 700; letter-spacing: .5px;
  border: none; border-radius: 10px; padding: 11px 22px;
  cursor: pointer; transition: transform .18s, box-shadow .18s, background .18s;
  display: inline-flex; align-items: center; gap: 6px;
  text-transform: uppercase;
}
.btn:hover { transform: translateY(-2px); }
.btn:active { transform: translateY(0); }

.b-pri { background: linear-gradient(135deg,#8b1a1a,#c83030); color:#fff; box-shadow:0 4px 18px rgba(139,26,26,.5); }
.b-pri:hover { background: linear-gradient(135deg,#a02020,#e04040); box-shadow:0 8px 28px rgba(139,26,26,.6); }
.b-red { background: linear-gradient(135deg,#7f1d1d,#dc2626); color:#fff; box-shadow:0 4px 18px rgba(127,29,29,.5); }
.b-red:hover { box-shadow:0 8px 28px rgba(127,29,29,.6); }
.b-amb { background: linear-gradient(135deg,#78350f,#d97706); color:#fff; box-shadow:0 4px 18px rgba(120,53,15,.4); }
.b-nvy { background: linear-gradient(135deg,#1e3a6e,#3b82f6); color:#fff; box-shadow:0 4px 18px rgba(30,58,110,.4); }
.b-slt { background: rgba(255,255,255,.07); color:rgba(255,220,180,.8); border:1px solid rgba(139,26,26,.4) !important; }
.b-slt:hover { background: rgba(255,255,255,.12); }
.b-sm { padding: 8px 16px !important; font-size: 11px !important; }

.btn[style*='background:#e0e7ef'] {
  background: rgba(255,255,255,.08) !important;
  color: rgba(255,220,180,.75) !important;
  border: 1px solid rgba(139,26,26,.3) !important;
}
.btn[style*='background:#e0e7ef']:hover {
  background: rgba(255,255,255,.14) !important;
  color: rgba(255,220,180,.95) !important;
}

/* ══ CLOSE BUTTON ══ */
.mo-close-btn {
  background: rgba(0,0,0,.3) !important;
  border: 1px solid rgba(255,160,100,.2) !important;
  color: rgba(255,200,150,.8) !important;
  font-size: 16px !important; cursor: pointer;
  width: 34px; height: 34px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  transition: background .18s, color .18s, transform .18s;
  position: relative; z-index: 1; line-height: 1; flex-shrink: 0;
}
.mo-close-btn:hover {
  background: rgba(180,30,30,.6) !important;
  color: #fff !important;
  transform: rotate(90deg) scale(1.1);
}

/* ══ EYE BUTTON in pw-wrap ══ */
.pw-wrap { position: relative; display: flex; align-items: center; }
.pw-wrap input { flex: 1; }
.pw-wrap .eye-btn {
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  background: rgba(80,10,10,.6) !important;
  border: 1px solid rgba(255,150,100,.4) !important;
  border-radius: 7px !important;
  padding: 4px 9px !important; font-size: 16px !important;
  cursor: pointer; color: #ffffff !important;
  filter: brightness(10) !important;
  opacity: 1 !important; line-height: 1;
  transition: background .15s, transform .15s; z-index: 10;
}
.pw-wrap .eye-btn:hover {
  background: rgba(200,50,30,.7) !important;
  transform: translateY(-50%) scale(1.12);
}

/* ══ ERROR HINTS ══ */
#reg_err,#era_err,#aif_err,#saf_err,#myp_err,#enc_err,#sap_err,#reg_id-hint {
  font-size: 12px; min-height: 16px; padding: 0 2px;
}
#reg_id-hint.ok  { color: #4ade80 !important; }
#reg_id-hint.err { color: #f87171 !important; }
#reg_id.id-ok  { border-color: #4ade80 !important; background: rgba(74,222,128,.08) !important; }
#reg_id.id-err { border-color: #f87171 !important; background: rgba(248,113,113,.08) !important; }

/* ══ COMBOBOX ══ */
.rm-combo-wrap { position: relative; }
.rm-combo-input { width: 100%; box-sizing: border-box; padding-right: 28px !important; }
.rm-combo-arrow {
  position: absolute; right: 6px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; font-size: 12px;
  color: rgba(255,180,130,.4); padding: 2px 4px; line-height: 1;
}
.rm-combo-arrow:hover { color: rgba(255,180,130,.9); }
.rm-combo-list {
  position: absolute; top: 100%; left: 0; right: 0;
  background: #1a0505; border: 1px solid rgba(139,26,26,.5);
  border-radius: 9px; box-shadow: 0 8px 32px rgba(0,0,0,.6);
  max-height: 200px; overflow-y: auto; z-index: 9999;
  display: none; margin: 4px 0; padding: 4px 0; list-style: none;
  scrollbar-width: thin; scrollbar-color: #8b1a1a #1a0505;
}
.rm-combo-list::-webkit-scrollbar { width: 4px; }
.rm-combo-list::-webkit-scrollbar-thumb { background: #8b1a1a; }
.rm-combo-item { padding: 9px 14px; cursor: pointer; font-size: 13px; color: rgba(255,220,180,.85); }
.rm-combo-item:hover { background: rgba(139,26,26,.3); color: rgba(255,220,180,1); }

/* ══ TABLES inside modal ══ */
table.arm-table { width: 100%; font-size: 12px; border-collapse: collapse; margin-top: 6px; }
.arm-table thead tr { background: rgba(139,26,26,.25); }
.arm-table thead th {
  padding: 9px 10px; text-align: left; font-size: 10px;
  font-weight: 700; letter-spacing: .8px; text-transform: uppercase;
  color: rgba(255,160,100,.8); border-bottom: 1px solid rgba(139,26,26,.4);
}
.arm-table tbody tr { border-bottom: 1px solid rgba(139,26,26,.15); transition: background .15s; }
.arm-table tbody tr:hover { background: rgba(139,26,26,.1); }
.arm-table tbody td { padding: 9px 10px; color: rgba(255,225,195,.9); vertical-align: middle; }

/* ══ ERROR LIST ══ */
.err-list { list-style: none; margin: 0; padding: 0; }
.err-list li {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 11px 0; border-bottom: 1px solid rgba(139,26,26,.25);
  font-size: 13px; color: rgba(255,190,160,.95);
}
.err-list li:last-child { border-bottom: none; }
.err-list li::before { content: '⚠'; flex-shrink: 0; color: #f87171; }

/* ══ INFO BOX ══ */
.arm-info-box {
  background: linear-gradient(135deg, rgba(100,40,5,.35), rgba(180,90,10,.15));
  border: 1px solid rgba(240,140,30,.3); border-radius: 12px;
  padding: 16px 20px; margin-top: 16px;
  display: flex; align-items: flex-start; gap: 12px;
  box-shadow: inset 0 1px 0 rgba(255,180,60,.1);
}
.arm-info-icon { font-size: 20px; flex-shrink: 0; margin-top: 1px; }
.arm-info-text { font-size: 13px; color: rgba(255,215,150,.95); line-height: 1.7; }

/* ══ READONLY FIELD ══ */
.arm-readonly {
  background: rgba(255,255,255,.04) !important;
  border: 1px solid rgba(139,26,26,.3) !important;
  border-radius: 8px; padding: 10px 14px;
  font-size: 13px; color: rgba(255,220,180,.8);
  display: block; width: 100%; box-sizing: border-box;
}
.arm-readonly-label {
  font-size: 11px; font-weight: 700; letter-spacing: .6px;
  text-transform: uppercase; color: rgba(255,160,100,.6); margin-bottom: 6px; display: block;
}

/* ══ SHOCKWAVE ══ */
@keyframes arm-shockwave { 0%{transform:scale(0);opacity:.7;} 80%{transform:scale(4);opacity:.1;} 100%{transform:scale(5);opacity:0;} }
.arm-shockwave {
  position: absolute; inset: 0; border-radius: inherit;
  background: radial-gradient(circle, rgba(220,50,30,.35) 0%, transparent 70%);
  pointer-events: none; animation: arm-shockwave .5s ease-out forwards; z-index: 10;
}

/* ══ LOGOUT MODAL ══ */
.arm-logout-shield {
  display: block; margin: 0 auto 20px; text-align: center;
  font-size: 80px; line-height: 1;
  animation: arm-shield-drop .6s cubic-bezier(.22,1,.36,1) both, arm-shield-pulse 2.5s ease-in-out .6s infinite;
  filter: drop-shadow(0 0 30px rgba(200,30,10,.7)) drop-shadow(0 0 60px rgba(139,0,0,.4));
}
@keyframes arm-shield-drop {
  from { transform: translateY(-60px) scale(.6) rotate(-8deg); opacity: 0; }
  to   { transform: translateY(0) scale(1) rotate(0deg);       opacity: 1; }
}
@keyframes arm-shield-pulse {
  0%,100% { filter: drop-shadow(0 0 25px rgba(200,30,10,.6)) drop-shadow(0 0 50px rgba(139,0,0,.3)); }
  50%     { filter: drop-shadow(0 0 45px rgba(255,60,30,.8)) drop-shadow(0 0 90px rgba(180,0,0,.5)); }
}
.arm-logout-text {
  text-align: center;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.8rem; font-weight: 900; margin-bottom: 8px;
  background: linear-gradient(90deg, #ffe0b0 0%, #ffb060 35%, #ff6030 65%, #ffb060 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  filter: drop-shadow(0 3px 10px rgba(220,60,30,.5));
}
.arm-logout-divider {
  width: 60px; height: 3px; margin: 14px auto;
  background: linear-gradient(90deg, transparent, #c83030, transparent);
  border-radius: 3px;
  box-shadow: 0 0 10px rgba(200,48,48,.6);
}
.arm-logout-sub {
  text-align: center; font-size: 14px;
  color: rgba(255,215,175,.8); line-height: 1.8;
}

/* ══ CATEGORY WARNING ══ */
.arm-warn-icon {
  font-size: 52px; text-align: center; display: block; margin: 0 auto 16px;
  animation: arm-spin-warn 3s ease-in-out infinite;
}
@keyframes arm-spin-warn {
  0%,100% { transform: scale(1) rotate(0deg); }
  50%     { transform: scale(1.12) rotate(8deg); }
}
.arm-warn-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.15rem; font-weight: 800; color: rgba(253,186,116,.95);
  margin-bottom: 10px; text-align: center;
}
.arm-warn-body { font-size: 13px; color: rgba(255,225,190,.8); line-height: 1.75; }
.arm-from-badge {
  display: inline-block; background: rgba(231,76,60,.2); color: #fca5a5;
  border: 1px solid rgba(231,76,60,.4); padding: 2px 10px; border-radius: 6px;
  font-weight: 700; font-size: 11px;
}
.arm-to-badge {
  display: inline-block; background: rgba(59,130,246,.2); color: #93c5fd;
  border: 1px solid rgba(59,130,246,.4); padding: 2px 10px; border-radius: 6px;
  font-weight: 700; font-size: 11px;
}

/* ══ INLINE ACCENT FORMS ══ */
.acc-inline-form {
  background: rgba(255,255,255,.03) !important;
  border: 1.5px solid rgba(139,26,26,.4) !important;
  border-radius: 12px !important;
  padding: 20px 22px !important;
  margin-top: 12px !important;
  animation: accFormIn .2s ease both;
}
@keyframes accFormIn { from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:none;} }

/* ══ PASSWORD MASK IN TABLES ══ */
.pw-mask { color: rgba(255,210,160,.9); font-size: 12px; letter-spacing: 2px; font-weight: 700; }
.pw-eye-btn {
  background: rgba(139,26,26,.4) !important; border: 1px solid rgba(200,80,50,.4) !important;
  border-radius: 6px !important; cursor: pointer; font-size: 14px;
  opacity: 1 !important; padding: 3px 7px; line-height: 1;
  transition: background .15s, transform .15s;
}
.pw-eye-btn:hover { background: rgba(200,50,30,.6) !important; transform: scale(1.1); }

/* ══ ERA MODAL ══ */
.era-mo-row { margin-bottom: 14px; }
.era-mo-row label {
  display: block; font-size: 11px; font-weight: 700;
  letter-spacing: .6px; text-transform: uppercase;
  color: rgba(255,180,120,.8); margin-bottom: 6px;
}
.era-mo-row select, .era-mo-row input {
  width: 100%; padding: 11px 14px; background: rgba(255,255,255,.06);
  border: 1px solid rgba(180,50,40,.5); border-radius: 9px;
  color: rgba(255,235,210,.95); font-size: 14px; box-sizing: border-box;
  outline: none; transition: border-color .2s, box-shadow .2s;
}
.era-mo-row select:focus, .era-mo-row input:focus {
  border-color: rgba(220,80,60,.7);
  box-shadow: 0 0 0 3px rgba(139,26,26,.25);
}
.era-mo-row select option { background: #200808; }

/* ══ PULSE ORBS ══ */
.mo-orb {
  position: absolute; border-radius: 50%; filter: blur(80px);
  pointer-events: none; z-index: 0;
}
.mo-orb1 { width: 300px; height: 300px; background: #9b1818; opacity: .12; top: -80px; right: -80px; }
.mo-orb2 { width: 200px; height: 200px; background: #6b1a04; opacity: .1; bottom: -60px; left: -40px; }
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
if (typeof _CAPS_SKIP_IDS === 'undefined') var _CAPS_SKIP_IDS = ['reg_pw', 'reg_email'];

function enforceAllCaps(container) {
  // All-caps disabled — keyboard input preserved as-is
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
          <div id="era_err" style="color:#f87171;font-size:12px;margin-top:8px;min-height:14px;"></div>
        </div>
        <div class="mf">
          <button class="btn" style="background:#e0e7ef;color:var(--sl);" onclick="closeMo('eraMo')">Cancel</button>
          <button class="btn b-pri" id="eraModSave">💾 Add Era</button>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', html);

  setTimeout(() => {
    const eraDateEl = document.getElementById('era_date');
    if (eraDateEl && !eraDateEl._flatpickr) flatpickr(eraDateEl, { dateFormat: 'm/d/Y', allowInput: true });
  }, 100);
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
    /* ── Field validation states ── */
  #registerMo .f input.field-ok,
  #registerMo .f select.field-ok,
  #registerMo .f .rm-combo-input.field-ok {
    border-color: #4ade80 !important;
    background: #f0fff4 !important;
    color: #14532d !important;
  }
  #registerMo .f input.field-err,
  #registerMo .f select.field-err,
  #registerMo .f .rm-combo-input.field-err {
    border-color: #f87171 !important;
    background: #fff1f1 !important;
  }

  /* ── Bottom padding so footer never covers last fields ── */
  #registerMo .md {
    padding-bottom: 100px !important;
  }
  #registerMo .mb { max-width: 960px !important; width: 97% !important; }
  #registerMo .ig { grid-template-columns: repeat(3,1fr) !important; }
  #registerMo .ig-2col { grid-template-columns: repeat(2,1fr) !important; }
  #registerMo #reg_id { letter-spacing:1px; font-weight:700; }

  /* ── WHITE INPUTS — match accounts style ── */
  #registerMo .f input,
  #registerMo .f select,
  #registerMo .f textarea,
  #registerMo .f .rm-combo-input {
    background: #ffffff !important;
    color: #1a0505 !important;
    border: 1.5px solid rgba(180,40,20,.4) !important;
    border-radius: 9px !important;
    padding: 11px 14px !important;
    font-size: 14px !important;
    font-weight: 600 !important;
  }
  #registerMo .f input::placeholder,
  #registerMo .f .rm-combo-input::placeholder {
    color: #aaa !important;
    font-weight: 400 !important;
  }
  #registerMo .f input:focus,
  #registerMo .f select:focus,
  #registerMo .f .rm-combo-input:focus {
    background: #ffffff !important;
    color: #1a0505 !important;
    border-color: rgba(200,50,30,.8) !important;
    box-shadow: 0 0 0 3px rgba(180,30,20,.2) !important;
  }
  #registerMo .f select option {
    background: #fff !important;
    color: #1a0505 !important;
  }

  /* ── LABELS — bright golden, always visible ── */
  #registerMo .f label,
  #registerMo .sdiv {
    color: rgba(255,190,140,.95) !important;
  }

  /* ── Employee No. hint text ── */
  #registerMo #reg_id-hint {
    display: block;
    font-size: 12px !important;
    font-weight: 700 !important;
    margin-top: 4px;
  }
  #registerMo #reg_id-hint.ok  { color: #4ade80 !important; }
  #registerMo #reg_id-hint.err { color: #f87171 !important; }
  #registerMo #reg_id-hint:empty { display: none; }

  /* ── Employee No. label small sub-text ── */
  #registerMo .f label span {
    color: rgba(255,190,140,.55) !important;
    font-weight: 400 !important;
  }

  /* ── ID field border states ── */
  #registerMo #reg_id.id-ok  { border-color: #4ade80 !important; background: #f0fff4 !important; color: #14532d !important; }
  #registerMo #reg_id.id-err { border-color: #f87171 !important; background: #fff1f1 !important; }

  /* ── Email suffix badge — white bg ── */
  #registerMo .f > div > span {
    background: rgba(255,255,255,.15) !important;
    border: 1px solid rgba(180,50,40,.4) !important;
    border-left: none !important;
    color: rgba(255,200,150,.8) !important;
    font-size: 12px;
    padding: 0 12px;
    height: 42px;
    display: flex;
    align-items: center;
    border-radius: 0 9px 9px 0 !important;
    white-space: nowrap;
  }
  #registerMo #reg_email {
    border-radius: 9px 0 0 9px !important;
    border-right: none !important;
    text-transform: lowercase !important;
    background: #ffffff !important;
    color: #1a0505 !important;
  }

  /* ── Password field — white ── */
  #registerMo #reg_pw {
    background: #ffffff !important;
    color: #1a0505 !important;
    text-transform: none !important;
  }

  /* ── Calendar / date picker ── */
  #registerMo input[type="date"] {
    color-scheme: light !important;
    background: #ffffff !important;
    color: #1a0505 !important;
    cursor: pointer;
  }
  #registerMo input[type="date"]::-webkit-calendar-picker-indicator {
    filter: none !important;
    opacity: 1 !important;
    cursor: pointer;
    width: 18px;
    height: 18px;
  }
  #registerMo input[type="date"]::-webkit-datetime-edit { color: #1a0505 !important; }
  #registerMo input[type="date"]::-webkit-datetime-edit-fields-wrapper { color: #1a0505 !important; }
  #registerMo input[type="date"]::-webkit-datetime-edit-text { color: #888 !important; }
  #registerMo input[type="date"]::-webkit-datetime-edit-month-field,
  #registerMo input[type="date"]::-webkit-datetime-edit-day-field,
  #registerMo input[type="date"]::-webkit-datetime-edit-year-field { color: #1a0505 !important; }

  /* ── Combobox dropdown — white ── */
  #registerMo .rm-combo-list {
    background: #ffffff !important;
    border: 1.5px solid rgba(180,40,20,.4) !important;
    box-shadow: 0 8px 32px rgba(0,0,0,.25) !important;
  }
  #registerMo .rm-combo-item {
    color: #1a0505 !important;
    font-size: 13px;
  }
  #registerMo .rm-combo-item:hover {
    background: rgba(200,50,30,.12) !important;
    color: #1a0505 !important;
  }
  #registerMo .rm-combo-arrow { color: rgba(180,40,20,.6) !important; }

  /* ── FOOTER — always visible, never hidden ── */
  #registerMo .mf {
    position: sticky !important;
    bottom: 0 !important;
    z-index: 20 !important;
    background: linear-gradient(to top, #140303 80%, rgba(20,3,3,0)) !important;
    padding: 20px 32px 26px !important;
    border-top: 1px solid rgba(139,26,26,.4) !important;
  }
  #registerMo .mf .btn {
    min-width: 140px !important;
    padding: 13px 28px !important;
    font-size: 13px !important;
    font-weight: 700 !important;
  }

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
        <div class="md" style="position:relative;z-index:1;">

          <div class="sdiv">👤 Personal Information</div>
          <div class="ig">
            <div class="f hl">
              <label>Employee No. * <span style="font-weight:400;font-size:10px;opacity:.6;">(exactly 7 digits)</span></label>
              <input id="reg_id" type="text" inputmode="numeric" maxlength="7"
                     value="${_escMo(r.id||'')}" placeholder="e.g. 1234567"/>
              <span id="reg_id-hint" class=""></span>
            </div>
            <div class="f"><label>Surname *</label><input id="reg_surname" type="text" value="${_escMo(r.surname||'')}"/></div>
            <div class="f"><label>Given Name *</label><input id="reg_given" type="text" value="${_escMo(r.given||'')}"/></div>
            <div class="f"><label>Suffix</label><input id="reg_suffix" type="text" value="${_escMo(r.suffix||'')}"/></div>
            <div class="f"><label>Maternal Name</label><input id="reg_maternal" type="text" value="${_escMo(r.maternal||'')}"/></div>
            <div class="f">
              <label>Sex *</label>
              <select id="reg_sex">
                <option value="">—</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div class="f">
              <label>Civil Status</label>
              ${_buildCombobox({ id:'reg_civil', placeholder:'Select or type…', options:CIVIL_STATUS_OPTIONS, value:r.civil||'' })}
            </div>
            <div class="f"><label>Date of Birth *</label><input id="reg_dob" type="text" placeholder="mm/dd/yyyy" value="${r.dob ? fmtD(r.dob) : ''}"/></div>
            <div class="f"><label>Place of Birth</label><input id="reg_pob" type="text" value="${_escMo(r.pob||'')}"/></div>
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
            <div class="f"><label>Date of Appointment</label><input id="reg_appt" type="text" placeholder="mm/dd/yyyy" value="${r.appt ? fmtD(r.appt) : ''}"/></div>
            <div class="f"><label>TIN</label><input id="reg_tin" type="text" value="${_escMo(r.tin||'')}"/></div>
            <div class="f"><label>Rating</label><input id="reg_rating" type="text" value="${_escMo(r.rating||'')}"/></div>
            ${(!window.state?.isSchoolAdmin && !window.state?.isEncoder) ? `
            <div class="f">
              <label>Assigned School Admin <span style="font-weight:400;font-size:10px;opacity:.6;">(optional)</span></label>
              <select id="reg_assigned_sa_id">
                <option value="">— None —</option>
              </select>
            </div>
            <div class="f">
              <label>Assigned Encoder <span style="font-weight:400;font-size:10px;opacity:.6;">(optional)</span></label>
              <select id="reg_assigned_encoder_id">
                <option value="">— None —</option>
              </select>
            </div>` : ''}
          </div>

          <div class="sdiv">🎓 Education &amp; Eligibility</div>
          <div class="ig">
            <div class="f"><label>Highest Education</label><input id="reg_edu" type="text" value="${_escMo(r.edu||'')}"/></div>
            <div class="f"><label>Eligibility / Professional Exam</label><input id="reg_elig" type="text" value="${_escMo(r.elig||'')}"/></div>
            <div class="f"><label>Date of Exam</label><input id="reg_dexam" type="text" placeholder="mm/dd/yyyy" value="${r.dexam ? fmtD(r.dexam) : ''}"/></div>
            <input type="hidden" id="reg_pexam" value="${_escMo(r.pexam||'')}"/>
          </div>

          <div class="sdiv">📍 Contact Information</div>
          <div class="ig ig-2col">
            <div class="f" style="grid-column:1/-1;">
              <label>Present Address *</label>
              <input id="reg_addr" type="text" value="${_escMo(r.addr||'')}"/>
            </div>
            <div class="f"><label>Spouse Name</label><input id="reg_spouse" type="text" value="${_escMo(r.spouse||'')}"/></div>
          </div>

          <div class="sdiv">🔐 Login Credentials</div>
          <div class="ig ig-2col">
            <div class="f">
              <label>Email *</label>
              <div style="display:flex;align-items:center;">
                <input id="reg_email" type="text"
                       value="${_escMo((r.email||'').replace(/@deped\.gov\.ph$/i,''))}"
                       placeholder="username"
                       style="border-radius:9px 0 0 9px!important;flex:1;min-width:0;text-transform:lowercase!important;"/>
                <span style="background:rgba(255,255,255,.05);border:1px solid rgba(180,50,40,.5);border-left:none;
                             padding:0 12px;height:42px;display:flex;align-items:center;
                             font-size:12px;color:rgba(255,180,130,.6);border-radius:0 9px 9px 0;
                             white-space:nowrap;">@deped.gov.ph</span>
              </div>
            </div>
            <div class="f">
              <label>Password ${isEdit ? '<span style="font-weight:400;opacity:.6;font-size:10px;">(blank = keep current)</span>' : '*'}</label>
              <div class="pw-wrap">
                <input id="reg_pw" type="text"
                       value="${_escMo(existingPw)}"
                       placeholder="${isEdit ? 'Leave blank to keep current password' : 'Enter password'}"/>
                <button class="eye-btn" type="button" tabindex="-1" id="regPwEye">👁</button>
              </div>
            </div>
          </div>

          <div id="reg_err" style="color:#f87171;font-size:12px;margin-top:8px;min-height:14px;"></div>
        </div>
<div class="mf">
          <button class="btn" style="background:rgba(255,255,255,.1);color:rgba(255,220,180,.8);border:1px solid rgba(139,26,26,.4)!important;" onclick="closeMo('registerMo')">Cancel</button>
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

  // ── Load School Admins into dropdown ──
// ── Load School Admins and Encoders into dropdowns ──
  if (!window.state?.isSchoolAdmin && !window.state?.isEncoder) (async () => {
    const saList  = window.state?.schoolAdmins || [];
    const encList = window.state?.encoders     || [];
    const saSelect  = document.getElementById('reg_assigned_sa_id');
    const encSelect = document.getElementById('reg_assigned_encoder_id');
    if (saSelect && saList.length) {
      saList.forEach(sa => {
        const opt = document.createElement('option');
        opt.value = sa.id;
        opt.textContent = sa.name;
        if (r.assigned_sa_id && parseInt(r.assigned_sa_id) === sa.id) opt.selected = true;
        saSelect.appendChild(opt);
      });
    }
    if (encSelect && encList.length) {
      encList.forEach(enc => {
        const opt = document.createElement('option');
        opt.value = enc.id;
        opt.textContent = enc.name;
        if (r.assigned_encoder_id && parseInt(r.assigned_encoder_id) === enc.id) opt.selected = true;
        encSelect.appendChild(opt);
      });
    }
  })();
  setTimeout(() => {
    ['reg_dob','reg_appt','reg_dexam'].forEach(id => {
      const el = document.getElementById(id);
      if (el && !el._flatpickr) flatpickr(el, {
        dateFormat: 'm/d/Y',
        allowInput: true,
        onReady(_, __, fp) {
          fp.altInput && (fp.altInput.placeholder = 'mm/dd/yyyy');
        },
      });
      if (el) {
        el.addEventListener('input', function () {
          const digits = this.value.replace(/\D/g, '').slice(0, 8);
          let out = digits;
          if (digits.length > 2) out = digits.slice(0,2) + '/' + digits.slice(2);
          if (digits.length > 4) out = digits.slice(0,2) + '/' + digits.slice(2,4) + '/' + digits.slice(4);
          if (this.value !== out) {
            const pos = out.length;
            this.value = out;
            this.setSelectionRange(pos, pos);
          }
        });
      }
    });
  }, 100);
  
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
    const pw  = mo.querySelector('#reg_pw');
    const eye = document.getElementById('regPwEye');
    if (pw.type === 'text') { pw.type = 'password'; eye.textContent = '🙈'; }
    else                    { pw.type = 'text';     eye.textContent = '👁'; }
  });

enforceAllCaps(mo);
  mo.querySelectorAll('input[type="text"], input[type="number"]').forEach(inp => {
    inp.addEventListener('paste', e => e.stopPropagation());
  });
  
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
      pexam:          getVal('reg_elig').toUpperCase(),
      dexam:          mo.querySelector('#reg_dexam').value,
      appt:           mo.querySelector('#reg_appt').value,
      status:         mo.querySelector('#reg_status').value,
      account_status: mo.querySelector('#reg_accstatus').value,
      pos:            getVal('reg_pos').toUpperCase(),
      school:         getVal('reg_school').toUpperCase(),
      email:          emailUsername.toLowerCase().normalize('NFC') + '@deped.gov.ph',
      password:       mo.querySelector('#reg_pw').value,
      assigned_sa_id: window.state?.isSchoolAdmin
        ? (window.state.schoolAdminCfg?.dbId || null)
        : (parseInt(mo.querySelector('#reg_assigned_sa_id')?.value) || null),
      assigned_encoder_id: window.state?.isEncoder
        ? (window.state.encoderCfg?.dbId || null)
        : (parseInt(mo.querySelector('#reg_assigned_encoder_id')?.value) || null),
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

  // ── Live green/red validation for all required fields ──
  function markField(el, valid) {
    if (!el) return;
    el.classList.toggle('field-ok',  valid);
    el.classList.toggle('field-err', !valid);
  }
  function clearField(el) {
    if (!el) return;
    el.classList.remove('field-ok', 'field-err');
  }

  function makeValidator(id, getFn) {
    const el = mo.querySelector(`#${id}`);
    if (!el) return;
    const check = () => {
      const v = getFn ? getFn() : el.value.trim();
      if (!v) clearField(el);
      else    markField(el, v.length > 0);
    };
    el.addEventListener('input',  check);
    el.addEventListener('change', check);
    el.addEventListener('blur',   check);
    if (isEdit && (getFn ? getFn() : el.value.trim())) check();
  }

  // Surname, Given Name
  makeValidator('reg_surname');
  makeValidator('reg_given');

  // Sex (select)
  makeValidator('reg_sex', () => mo.querySelector('#reg_sex').value);

  // Position (combobox)
  makeValidator('reg_pos');

  // School (combobox)
  makeValidator('reg_school');

  // Address
  makeValidator('reg_addr');

  // Email username
  makeValidator('reg_email');

  // Password — required only for new employees
  if (!isEdit) {
    const pwEl = mo.querySelector('#reg_pw');
    if (pwEl) {
      const checkPw = () => {
        const v = pwEl.value;
        if (!v) clearField(pwEl);
        else    markField(pwEl, v.length >= 1);
      };
      pwEl.addEventListener('input', checkPw);
      pwEl.addEventListener('blur',  checkPw);
    }
  }

  // DOB — optional but highlight when filled
  const dobEl = mo.querySelector('#reg_dob');
  if (dobEl) {
    const checkDob = () => {
      if (!dobEl.value) clearField(dobEl);
      else markField(dobEl, true);
    };
    dobEl.addEventListener('change', checkDob);
    if (isEdit && dobEl.value) checkDob();
  }
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
            This will automatically create a <strong style="color:rgba(255,200,130,.9);">new Conversion Era</strong> on the
            employee's leave card when saved. The leave card will then use a
            <strong style="color:rgba(255,200,130,.9);">different computation</strong> from the conversion point forward.
          </p>
          <p class="arm-warn-body" style="opacity:.65;">
            Current balances will be carried forward into the new era.
            This action cannot be undone without manually removing the era.
          </p>
        </div>
        <div class="mf">
          <button class="btn" style="background:#e0e7ef;color:var(--sl);" id="catWarnRevert">↩ Revert Change</button>
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
   PERSONNEL RECORD MODAL
   Add this function to the bottom of modals.js
───────────────────────────────────────────────────────── */
function showPersonnelRecordModal(emp, editRecord) {
  document.getElementById('prcMo')?.remove();

  const isEdit = !!editRecord;
  const r = editRecord || {};

  const STATUS_OPTS = ['Permanent','Temporary','Substitute','Regular','Casual'];
  const FUND_OPTS   = ['National','Local'];

  function esc(s) {
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  const html = `
    <div class="mo open" id="prcMo" style="z-index:10002;">
      <div class="mb" style="max-width:700px;width:97%;">
        <div class="mo-orb mo-orb1"></div>
        <div class="mo-orb mo-orb2"></div>

        <div class="mh" style="background:linear-gradient(135deg,#0d1a3a 0%,#1a2d6b 40%,#2251b3 100%);">
          <h3>📋 ${isEdit ? 'Edit' : 'Add'} Personnel Record</h3>
          <button class="mo-close-btn" onclick="closeMo('prcMo')">✕</button>
        </div>

        <div class="md" style="padding-bottom:80px;">

          <div class="ig ig-2col" style="grid-template-columns:1fr 1fr;gap:14px 20px;">

            <div class="f">
              <label>Effective Date</label>
              <input id="prc_mo_effectiveDate" type="text" placeholder="mm/dd/yyyy"
                     value="${esc(r.effectiveDate||'')}"/>
            </div>

            <div class="f">
              <label>Date of Last Promotion</label>
              <input id="prc_mo_lastPromotion" type="text" placeholder="mm/dd/yyyy"
                     value="${esc(r.lastPromotion||'')}"/>
            </div>

            <div class="f" style="grid-column:1/-1;">
              <label>Designation</label>
              <input id="prc_mo_designation" type="text" placeholder="e.g. Teacher I"
                     value="${esc(r.designation||'')}"/>
            </div>

            <div class="f">
              <label>Status (Reg/Perm/Temp/Subt)</label>
              <select id="prc_mo_statusReg">
                <option value="">-- Select --</option>
                ${STATUS_OPTS.map(o=>`<option value="${esc(o)}" ${r.statusReg===o?'selected':''}>${esc(o)}</option>`).join('')}
              </select>
            </div>

            <div class="f">
              <label>Mo. / Annual Salary</label>
              <input id="prc_mo_salary" type="text" placeholder="e.g. 25000"
                     value="${esc(r.salary||'')}"/>
            </div>

            <div class="f" style="grid-column:1/-1;">
              <label>Name of Dist. / Station</label>
              <input id="prc_mo_station" type="text" placeholder="e.g. Koronadal City NHS"
                     value="${esc(r.station||'')}"/>
            </div>

            <div class="f">
              <label>Source of Fund</label>
              <select id="prc_mo_sourceOfFund">
                <option value="">-- Select --</option>
                ${FUND_OPTS.map(o=>`<option value="${esc(o)}" ${r.sourceOfFund===o?'selected':''}>${esc(o)}</option>`).join('')}
              </select>
            </div>

<div class="f">
              <label>Place of Exam <span style="font-weight:400;font-size:10px;opacity:.6;">(optional)</span></label>
              <input id="prc_mo_placeOfExam" type="text" placeholder="e.g. PBET - Koronadal City"
                     value="${esc(r.placeOfExam||'')}"/>
            </div>

            <div class="f">
              <label>Remarks <span style="font-weight:400;font-size:10px;opacity:.6;">(optional)</span></label>
              <input id="prc_mo_remarks" type="text" placeholder="Optional"
                     value="${esc(r.remarks||'')}"/>
            </div>

          </div>

          <div id="prc_mo_err" style="color:#f87171;font-size:12px;margin-top:10px;min-height:14px;"></div>
        </div>

        <div class="mf" style="
          background:linear-gradient(to top,#0d1228 80%,rgba(13,18,40,0)) !important;
          border-top:1px solid rgba(34,81,179,.35) !important;">
          <button class="btn"
            style="background:rgba(255,255,255,.08);color:rgba(200,220,255,.8);
                   border:1px solid rgba(34,81,179,.4)!important;"
            onclick="closeMo('prcMo')">Cancel</button>
          <button class="btn" id="prcMoSave"
            style="background:linear-gradient(135deg,#1e3a6e,#2251b3);color:#fff;
                   box-shadow:0 4px 18px rgba(30,58,110,.5);">
            💾 ${isEdit ? 'Update Record' : 'Save Record'}
          </button>
        </div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML('beforeend', html);
  const mo = document.getElementById('prcMo');

  // Wire date inputs — auto-format as user types (mm/dd/yyyy)
  ['prc_mo_effectiveDate','prc_mo_lastPromotion'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    // Use flatpickr if available, else raw input formatting
    if (typeof flatpickr !== 'undefined' && !el._flatpickr) {
      flatpickr(el, { dateFormat: 'm/d/Y', allowInput: true });
    } else {
      el.addEventListener('input', function () {
        const digits = this.value.replace(/\D/g,'').slice(0,8);
        let out = digits;
        if (digits.length > 2) out = digits.slice(0,2)+'/'+digits.slice(2);
        if (digits.length > 4) out = digits.slice(0,2)+'/'+digits.slice(2,4)+'/'+digits.slice(4);
        if (this.value !== out) { this.value = out; }
      });
    }
  });

  // Save handler
  document.getElementById('prcMoSave').addEventListener('click', async () => {
    const errEl = document.getElementById('prc_mo_err');
    errEl.textContent = '';

    const rec = {
const rec = {
      effectiveDate : document.getElementById('prc_mo_effectiveDate').value.trim(),
      designation   : document.getElementById('prc_mo_designation').value.trim(),
      statusReg     : document.getElementById('prc_mo_statusReg').value,
      salary        : document.getElementById('prc_mo_salary').value.trim(),
      station       : document.getElementById('prc_mo_station').value.trim(),
      sourceOfFund  : document.getElementById('prc_mo_sourceOfFund').value,
      lastPromotion : document.getElementById('prc_mo_lastPromotion').value.trim(),
      placeOfExam   : document.getElementById('prc_mo_placeOfExam').value.trim(),
      remarks       : document.getElementById('prc_mo_remarks').value.trim(),
    };

    if (!rec.effectiveDate && !rec.designation) {
      errEl.textContent = 'Please fill in at least Effective Date or Designation.';
      return;
    }

    const saveBtn = document.getElementById('prcMoSave');
    saveBtn.disabled    = true;
    saveBtn.textContent = 'Saving…';

    const editIdx = isEdit ? editRecord._idx : null;
    const apiRes  = editIdx !== null
      ? await apiCall('update_personnel_record', { employee_id: emp.id, idx: editIdx, record: rec })
      : await apiCall('save_personnel_record',   { employee_id: emp.id, record: rec });

    saveBtn.disabled = false;

    if (!apiRes.ok) {
      errEl.textContent   = apiRes.error || 'Save failed.';
      saveBtn.textContent = isEdit ? '💾 Update Record' : '💾 Save Record';
      return;
    }

    // Update local emp object
    if (!emp.personnelRecords) emp.personnelRecords = [];
    if (editIdx !== null) {
      emp.personnelRecords[editIdx] = rec;
    } else {
      emp.personnelRecords.push(rec);
    }

    closeMo('prcMo');
    if (typeof renderPersonnelTable === 'function') renderPersonnelTable(emp);
  });
}
window.showPersonnelRecordModal = showPersonnelRecordModal;

/* ─────────────────────────────────────────────────────────
   LOGOUT MODAL — Red Armoured Spectacular
───────────────────────────────────────────────────────── */
function showLogoutModal() {
  document.getElementById('logoutMo')?.remove();
  const html = `
    <div class="mo open" id="logoutMo">
      <div class="mb xsm" style="max-width:460px;">
        <div class="mo-orb mo-orb1" style="background:#c83030;opacity:.18;top:-60px;right:-60px;width:260px;height:260px;"></div>
        <div class="mo-orb mo-orb2" style="background:#8b1a1a;opacity:.14;bottom:-40px;left:-30px;width:200px;height:200px;"></div>
        <div class="mh">
          <h3>🔐 Confirm Logout</h3>
          <button class="mo-close-btn" onclick="closeMo('logoutMo')">✕</button>
        </div>
        <div class="md" style="text-align:center;padding:36px 32px 28px;position:relative;z-index:1;background:transparent!important;">
          <span class="arm-logout-shield">🛡️</span>
          <div class="arm-logout-text">Leaving so soon?</div>
          <div class="arm-logout-divider"></div>
          <p class="arm-logout-sub">
            You will be securely signed out of the<br>
            <strong style="color:rgba(255,180,100,.9);font-size:15px;">SDO Koronadal City Leave Card System.</strong><br><br>
            <span style="color:rgba(255,180,130,.5);font-size:13px;">Any unsaved changes will be lost.</span>
          </p>
        </div>
        <div class="mf" style="justify-content:center;gap:16px;">
          <button class="btn" style="background:rgba(255,255,255,.08);color:rgba(255,220,180,.8);border:1px solid rgba(139,26,26,.4)!important;min-width:130px;" onclick="closeMo('logoutMo')">↩ Stay Here</button>
          <button class="btn b-red" id="confirmLogout" style="min-width:160px;">🚪 Yes, Logout</button>
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
