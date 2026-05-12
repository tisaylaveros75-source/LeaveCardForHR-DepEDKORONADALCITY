(function () {
'use strict';

/* ============================================================
   leave-application.js  v3
   SDO Koronadal City — Leave Card Management System
   Full-page 4-step wizard  ·  Civil Service Form No. 6 (Rev 2020)
   ============================================================ */

/* ── CSS ─────────────────────────────────────────────────────── */
(function injectCSS() {
  if (document.getElementById('la-v3-css')) return;
  const s = document.createElement('style');
  s.id = 'la-v3-css';
  s.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');

/* ── PAGE ─────────────────────────────────────────── */
#pg-leave-apply {
  background: #f2f4f7;
  min-height: 100vh;
  font-family: 'DM Sans', 'Inter', sans-serif;
  overflow-y: auto;
}
.la-page { max-width: 860px; margin: 0 auto; padding-bottom: 80px; }

/* ── STICKY HEADER ────────────────────────────────── */
.la-page-header {
  background: linear-gradient(135deg, #5a0f16 0%, #8b1a1a 55%, #b02020 100%);
  color: #fff;
  padding: 18px 28px;
  position: sticky; top: 0; z-index: 200;
  box-shadow: 0 3px 20px rgba(90,15,22,.45);
}
.la-header-inner {
  display: flex; align-items: center;
  justify-content: space-between; gap: 16px;
  max-width: 860px; margin: 0 auto;
}
.la-back-btn {
  background: rgba(255,255,255,.14); color: #fff;
  border: 1.5px solid rgba(255,255,255,.3); border-radius: 9px;
  padding: 8px 18px; font-size: 12px; font-weight: 700;
  cursor: pointer; transition: background .2s; white-space: nowrap;
  font-family: 'DM Sans', sans-serif;
}
.la-back-btn:hover { background: rgba(255,255,255,.24); }
.la-header-title { text-align: center; flex: 1; }
.la-header-eyebrow {
  font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase;
  opacity: .65; margin-bottom: 3px;
}
.la-header-main {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.2rem; font-weight: 800; line-height: 1.2;
}
.la-header-sub { font-size: 10.5px; opacity: .7; margin-top: 2px; }
.la-header-spacer { width: 120px; }

/* ── PROGRESS BAR ─────────────────────────────────── */
.la-progress-bar {
  display: flex; align-items: center; justify-content: center;
  padding: 28px 24px 0; gap: 0; max-width: 700px; margin: 0 auto;
}
.la-step { display: flex; flex-direction: column; align-items: center; gap: 7px; }
.la-step-num {
  width: 38px; height: 38px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 800;
  border: 2.5px solid #d8d0d0; background: #fff; color: #bbb;
  transition: all .35s cubic-bezier(.22,1,.36,1);
}
.la-step.active .la-step-num {
  border-color: #8b1a1a; background: #8b1a1a; color: #fff;
  box-shadow: 0 4px 18px rgba(139,26,26,.38);
}
.la-step.done .la-step-num {
  border-color: #059669; background: #059669; color: #fff;
}
.la-step-label {
  font-size: 10px; font-weight: 700; color: #bbb;
  letter-spacing: .5px; text-transform: uppercase; white-space: nowrap;
  transition: color .3s;
}
.la-step.active .la-step-label { color: #8b1a1a; }
.la-step.done  .la-step-label  { color: #059669; }
.la-step-connector {
  flex: 1; height: 2.5px; background: #e0d8d8;
  min-width: 36px; max-width: 110px; margin-bottom: 24px;
  transition: background .35s;
}
.la-step-connector.done { background: #059669; }

/* ── SLIDE ANIMATION ──────────────────────────────── */
@keyframes la-slide-in {
  from { opacity: 0; transform: translateX(32px); }
  to   { opacity: 1; transform: none; }
}
@keyframes la-slide-back {
  from { opacity: 0; transform: translateX(-32px); }
  to   { opacity: 1; transform: none; }
}
.la-form-body { padding: 24px 20px 0; }
.la-form-body.slide-in   { animation: la-slide-in   .32s cubic-bezier(.22,1,.36,1) both; }
.la-form-body.slide-back { animation: la-slide-back .32s cubic-bezier(.22,1,.36,1) both; }

/* ── CARD ─────────────────────────────────────────── */
.la-card {
  background: #fff; border-radius: 18px;
  border: 1.5px solid #ece4e4;
  box-shadow: 0 4px 24px rgba(90,15,22,.07), 0 1px 4px rgba(0,0,0,.04);
  overflow: hidden; margin-bottom: 18px;
}
.la-card-head {
  background: linear-gradient(100deg, #6f1212 0%, #9b1c1c 100%);
  color: #fff; padding: 16px 26px;
  display: flex; align-items: center; gap: 12px;
}
.la-card-head.green { background: linear-gradient(100deg, #064e3b, #059669); }
.la-card-head-icon  { font-size: 20px; }
.la-card-head-title { font-size: 13.5px; font-weight: 800; letter-spacing: .4px; text-transform: uppercase; }
.la-card-head-sub   { font-size: 10.5px; opacity: .72; margin-top: 2px; }
.la-card-body { padding: 26px 28px; }

/* ── FORM FIELDS ──────────────────────────────────── */
.la-field-row { display: grid; gap: 16px; margin-bottom: 20px; }
.la-field-row.col-2 { grid-template-columns: 1fr 1fr; }
.la-field-row.col-3 { grid-template-columns: 1fr 1fr 1fr; }
.la-field-row.col-1 { grid-template-columns: 1fr; }
.la-field { display: flex; flex-direction: column; gap: 6px; }
.la-label {
  font-size: 9.5px; font-weight: 800; letter-spacing: 1.1px;
  text-transform: uppercase; color: #6b3535;
}
.la-req { color: #c0392b; }
.la-input {
  border: 1.5px solid #e4d0d0; border-radius: 10px;
  padding: 10px 14px; font-size: 13px; font-weight: 500;
  color: #1a1a2e; background: #fff; outline: none;
  transition: border-color .2s, box-shadow .2s;
  font-family: 'DM Sans', sans-serif; width: 100%; box-sizing: border-box;
}
.la-input:focus {
  border-color: #8b1a1a;
  box-shadow: 0 0 0 3px rgba(139,26,26,.11);
}
.la-input[type="date"] { color-scheme: light; }
.la-input[readonly]    { background: #fafafa; color: #999; cursor: default; }
.la-hint { font-size: 10px; color: #aaa; margin-top: 3px; line-height: 1.5; }

/* ── LEAVE TYPE ITEMS ─────────────────────────────── */
.la-type-grid { display: flex; flex-direction: column; gap: 6px; }
.la-type-item {
  display: flex; align-items: flex-start; gap: 14px;
  padding: 12px 16px; border-radius: 10px; cursor: pointer;
  border: 1.5px solid transparent;
  transition: background .14s, border-color .14s, transform .14s;
}
.la-type-item:hover {
  background: #fff8f8; border-color: #f0c8c8;
  transform: translateX(3px);
}
.la-type-item.selected {
  background: #fff0f0; border-color: #dc2626;
  transform: translateX(3px);
}
.la-type-cb {
  width: 20px; height: 20px; min-width: 20px;
  border: 2px solid #ccc; border-radius: 5px;
  display: flex; align-items: center; justify-content: center;
  margin-top: 1px; flex-shrink: 0;
  font-size: 12px; font-weight: 900; color: transparent;
  transition: all .15s; background: #fff;
}
.la-type-item.selected .la-type-cb {
  background: #8b1a1a; border-color: #8b1a1a; color: #fff;
}
.la-type-name { font-size: 13px; font-weight: 600; color: #1a1a2e; line-height: 1.3; }
.la-type-cite { font-size: 10px; color: #9a9ab0; margin-top: 2px; line-height: 1.45; }

/* ── RADIO ROWS ───────────────────────────────────── */
.la-radio-row {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 9px 0; cursor: pointer; border-radius: 8px;
}
.la-radio-dot {
  width: 18px; height: 18px; min-width: 18px;
  border: 2px solid #ccc; border-radius: 50%;
  margin-top: 1px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  transition: all .15s;
  position: relative;
}
.la-radio-row.selected .la-radio-dot { border-color: #8b1a1a; background: #8b1a1a; }
.la-radio-dot::after {
  content: ''; width: 7px; height: 7px;
  border-radius: 50%; background: #fff;
  opacity: 0; transition: opacity .15s;
}
.la-radio-row.selected .la-radio-dot::after { opacity: 1; }
.la-radio-label { font-size: 12.5px; color: #2a2a3e; line-height: 1.5; }

/* ── DETAIL SECTIONS (6B) ─────────────────────────── */
.la-detail-section {
  border: 1.5px solid #f0d8d8; border-radius: 12px;
  padding: 18px 20px; margin-bottom: 18px; background: #fffafa;
}
.la-detail-title {
  font-size: 9.5px; font-weight: 800; letter-spacing: 1.1px;
  text-transform: uppercase; color: #7a3030; margin-bottom: 12px;
  display: flex; align-items: center; gap: 10px;
}
.la-detail-title::after { content: ''; flex: 1; height: 1px; background: #f0d8d8; }
.la-sub-input {
  margin-top: 8px; margin-left: 30px;
  animation: la-sub-in .2s ease both;
}
@keyframes la-sub-in {
  from { opacity: 0; transform: translateY(-5px); }
  to   { opacity: 1; transform: none; }
}

/* ── DATE & DAYS SECTION ──────────────────────────── */
.la-date-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 16px; margin-bottom: 18px;
}
.la-days-display {
  background: linear-gradient(135deg, #fff8f0, #fff0e8);
  border: 2px solid #fcd0a0; border-radius: 14px;
  padding: 18px 22px; display: flex; align-items: center;
  gap: 18px; margin-bottom: 18px;
}
.la-days-num  {
  font-family: 'Playfair Display', serif;
  font-size: 2.6rem; font-weight: 800; color: #8b1a1a; line-height: 1;
}
.la-days-meta { flex: 1; }
.la-days-label{ font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .8px; color: #7a3030; }
.la-days-range{ font-size: 11.5px; color: #9a7070; margin-top: 3px; }

/* ── COMMUTATION ROW ──────────────────────────────── */
.la-comm-row { display: flex; gap: 28px; flex-wrap: wrap; }

/* ── FILE UPLOAD ──────────────────────────────────── */
.la-file-zone {
  border: 2.5px dashed #e4c8c8; border-radius: 16px;
  padding: 40px 28px; text-align: center; cursor: pointer;
  transition: border-color .2s, background .2s; background: #fffbfb;
  position: relative; overflow: hidden;
}
.la-file-zone:hover, .la-file-zone.drag-over {
  border-color: #8b1a1a; background: #fff5f5;
}
.la-file-zone.has-file { border-color: #059669; background: #f0fdf8; }
.la-file-zone input[type="file"] {
  position: absolute; inset: 0; opacity: 0;
  cursor: pointer; width: 100%; height: 100%;
}
.la-file-icon  { font-size: 38px; margin-bottom: 12px; display: block; }
.la-file-label { font-size: 13px; color: #9a7070; line-height: 1.65; }
.la-file-name  { font-size: 13px; font-weight: 700; color: #059669; margin-top: 10px; }

/* ── REVIEW SUMMARY ───────────────────────────────── */
.la-review {
  border: 1.5px solid #e4d0d0; border-radius: 14px; overflow: hidden;
}
.la-review-head {
  background: linear-gradient(100deg, #064e3b, #059669);
  color: #fff; padding: 14px 22px;
  font-size: 11px; font-weight: 800; letter-spacing: .8px; text-transform: uppercase;
}
.la-review-body { padding: 0; }
.la-review-row {
  display: flex; gap: 12px; padding: 11px 22px;
  border-bottom: 1px solid #f4eaea;
}
.la-review-row:last-child { border-bottom: none; }
.la-review-key {
  width: 175px; min-width: 175px;
  font-size: 9.5px; font-weight: 800; text-transform: uppercase;
  letter-spacing: .6px; color: #9a7070; padding-top: 2px;
}
.la-review-val { font-size: 13px; font-weight: 600; color: #1a1a2e; flex: 1; }

/* ── FOOTER BUTTONS ───────────────────────────────── */
.la-form-footer {
  padding: 20px 20px 0;
  display: flex; justify-content: space-between; align-items: center;
}
.la-btn-prev {
  padding: 12px 28px; border-radius: 10px;
  font-size: 13px; font-weight: 700; cursor: pointer;
  background: #fff; color: #6b3535;
  border: 2px solid #e4d0d0;
  transition: all .2s; font-family: 'DM Sans', sans-serif;
}
.la-btn-prev:hover { border-color: #c0a0a0; background: #fff5f5; }
.la-btn-next {
  padding: 12px 34px; border-radius: 10px;
  font-size: 13px; font-weight: 700; cursor: pointer;
  background: linear-gradient(135deg, #7f1d1d, #b91c1c);
  color: #fff; border: none;
  box-shadow: 0 4px 18px rgba(139,26,26,.38);
  transition: all .2s; font-family: 'DM Sans', sans-serif;
  display: flex; align-items: center; gap: 8px;
}
.la-btn-next:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(139,26,26,.5); }
.la-btn-submit {
  padding: 13px 36px; border-radius: 10px;
  font-size: 13px; font-weight: 700; cursor: pointer;
  background: linear-gradient(135deg, #064e3b, #059669);
  color: #fff; border: none;
  box-shadow: 0 4px 18px rgba(5,150,105,.38);
  transition: all .2s; font-family: 'DM Sans', sans-serif;
  display: flex; align-items: center; gap: 8px;
}
.la-btn-submit:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(5,150,105,.5); }
.la-btn-submit:disabled,
.la-btn-next:disabled {
  opacity: .5; cursor: not-allowed !important;
  transform: none !important; box-shadow: none !important;
}

/* ── ERROR BOX ────────────────────────────────────── */
.la-err {
  color: #b91c1c; font-size: 12px; font-weight: 600;
  background: #fef2f2; border: 1.5px solid #fca5a5;
  border-radius: 9px; padding: 10px 16px; margin-top: 14px;
  display: none;
}
.la-err.show { display: block; }

/* ── EMPLOYEE HISTORY ─────────────────────────────── */
.emp-apply-btn {
  display: inline-flex; align-items: center; gap: 8px;
  background: linear-gradient(135deg, #8b1a1a, #c83030);
  color: #fff; border: none; border-radius: 12px;
  padding: 13px 28px; font-size: 13px; font-weight: 700;
  cursor: pointer; box-shadow: 0 4px 18px rgba(139,26,26,.45);
  transition: transform .2s, box-shadow .2s; font-family: 'DM Sans', sans-serif;
  text-transform: uppercase;
}
.emp-apply-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(139,26,26,.6); }
.emp-app-history { margin: 20px 0 0; }
.emp-app-history-title {
  font-size: 11px; font-weight: 700; letter-spacing: 1.5px;
  text-transform: uppercase; color: #7a8a9d; margin-bottom: 12px;
}
.emp-app-card {
  background: #fff; border-radius: 14px; border: 1.5px solid #e8d0d0;
  padding: 16px 20px; margin-bottom: 10px;
  box-shadow: 0 2px 10px rgba(139,26,26,.06);
  display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
}
.emp-app-card-status {
  font-size: 10px; font-weight: 800; letter-spacing: 1px;
  text-transform: uppercase; padding: 4px 12px; border-radius: 20px; flex-shrink: 0;
}
.emp-app-card-status.pending  { background:#fef3c7;color:#92400e;border:1px solid #fcd34d; }
.emp-app-card-status.accepted { background:#d1fae5;color:#065f46;border:1px solid #6ee7b7; }
.emp-app-card-status.rejected { background:#fee2e2;color:#991b1b;border:1px solid #fca5a5; }
.emp-app-card-info { flex:1; min-width:0; }
.emp-app-card-type  { font-size:13px; font-weight:700; color:#1a1a2e; }
.emp-app-card-dates { font-size:11px; color:#7a8a9d; margin-top:2px; }
.emp-app-card-reason{ font-size:11.5px; color:#991b1b; margin-top:5px; background:#fff5f5; border-radius:7px; padding:6px 10px; border-left:3px solid #fca5a5; }
.emp-app-card-actions { display:flex; gap:8px; flex-shrink:0; }
.emp-app-action-btn {
  font-size:11px; font-weight:700; padding:6px 14px;
  border-radius:8px; border:none; cursor:pointer;
  transition:transform .15s; font-family:'DM Sans',sans-serif;
}
.emp-app-action-btn:hover { transform:translateY(-1px); }
.emp-app-action-btn.edit   { background:#fef3c7;color:#92400e;border:1px solid #fcd34d; }
.emp-app-action-btn.delete { background:#fee2e2;color:#991b1b;border:1px solid #fca5a5; }

/* ── SUBMISSIONS PAGE (admin) ─────────────────────── */
.sub-page { padding: 20px 24px; }
.sub-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:12px; }
.sub-title { font-family:'Playfair Display',serif; font-size:1.5rem; font-weight:800; color:#1a1a2e; }
.sub-tabs { display:flex; border:1.5px solid #e8d0d0; border-radius:10px; overflow:hidden; }
.sub-tab { padding:9px 20px; font-size:12px; font-weight:700; cursor:pointer; border:none; background:#fff; color:#7a8a9d; letter-spacing:.4px; text-transform:uppercase; transition:background .18s,color .18s; font-family:'DM Sans',sans-serif; }
.sub-tab.active { background:linear-gradient(135deg,#8b1a1a,#c83030); color:#fff; }
.sub-tab:not(:last-child) { border-right:1.5px solid #e8d0d0; }
.sub-card-list { display:flex; flex-direction:column; gap:12px; }
.sub-app-card { background:#fff; border-radius:16px; border:1.5px solid #e8d0d0; padding:20px 24px; box-shadow:0 2px 12px rgba(139,26,26,.07); transition:box-shadow .2s; }
.sub-app-card:hover { box-shadow:0 6px 24px rgba(139,26,26,.13); }
.sub-app-card-top { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; flex-wrap:wrap; margin-bottom:10px; }
.sub-app-card-name { font-size:14px; font-weight:700; color:#1a1a2e; margin-bottom:3px; }
.sub-app-card-meta { font-size:11.5px; color:#7a8a9d; }
.sub-app-card-type { font-size:12px; font-weight:700; color:#8b1a1a; background:#fce8e8; border-radius:8px; padding:3px 12px; white-space:nowrap; }
.sub-app-card-details { display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:8px 16px; font-size:12px; color:#4a4a5a; margin-bottom:12px; }
.sub-app-card-details span { display:flex; flex-direction:column; gap:2px; }
.sub-app-card-details strong { color:#7a8a9d; font-size:10px; font-weight:700; letter-spacing:.6px; text-transform:uppercase; }
.sub-app-card-actions { display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
.sub-btn { font-size:12px; font-weight:700; padding:8px 18px; border-radius:9px; border:none; cursor:pointer; transition:transform .15s; font-family:'DM Sans',sans-serif; display:inline-flex; align-items:center; gap:6px; }
.sub-btn:hover { transform:translateY(-1px); }
.sub-btn.accept { background:linear-gradient(135deg,#064e3b,#10b981); color:#fff; box-shadow:0 3px 12px rgba(16,185,129,.3); }
.sub-btn.reject { background:linear-gradient(135deg,#991b1b,#dc2626); color:#fff; box-shadow:0 3px 12px rgba(220,38,38,.3); }
.sub-btn.view   { background:linear-gradient(135deg,#1e3a6e,#3b82f6); color:#fff; box-shadow:0 3px 12px rgba(59,130,246,.3); }
.sub-app-attachment { font-size:11px; color:#3b82f6; cursor:pointer; text-decoration:underline; }
.sub-rejected-reason { margin-top:10px; padding:10px 14px; background:#fff5f5; border-radius:9px; border-left:3px solid #fca5a5; font-size:12px; color:#991b1b; }
.sub-empty { text-align:center; padding:60px 20px; font-size:13px; color:#7a8a9d; }
.sub-empty span { display:block; font-size:40px; margin-bottom:14px; }
.sub-badge { display:inline-block; font-size:10px; font-weight:800; padding:2px 9px; border-radius:20px; margin-left:8px; }
.sub-badge.pending  { background:#fef3c7; color:#92400e; }
.sub-badge.accepted { background:#d1fae5; color:#065f46; }
.sub-badge.rejected { background:#fee2e2; color:#991b1b; }

/* ── RESPONSIVE ───────────────────────────────────── */
@media (max-width:620px) {
  .la-field-row.col-2, .la-field-row.col-3 { grid-template-columns:1fr; }
  .la-date-grid { grid-template-columns:1fr; }
  .la-header-spacer { display:none; }
  .la-review-key { width:130px; min-width:130px; }
  .la-card-body { padding:18px 16px; }
}
@media print {
  #pg-leave-apply, .emp-apply-btn, .emp-app-history { display:none!important; }
}
  `;
  document.head.appendChild(s);
})();

/* ── LEAVE TYPES ─────────────────────────────────────────────── */
const LA_TYPES = [
  { label:'Vacation Leave',                     cite:'Sec. 51, Rule XVI, Omnibus Rules Implementing E.O. No. 292' },
  { label:'Mandatory/Forced Leave',             cite:'Sec. 25, Rule XVI, Omnibus Rules Implementing E.O. No. 292' },
  { label:'Sick Leave',                         cite:'Sec. 43, Rule XVI, Omnibus Rules Implementing E.O. No. 292' },
  { label:'Maternity Leave',                    cite:'R.A. No. 11210 / IRR issued by CSC, DOLE and SSS' },
  { label:'Paternity Leave',                    cite:'R.A. No. 8187 / CSC MC No. 71, s. 1998, as amended' },
  { label:'Special Privilege Leave',            cite:'Sec. 21, Rule XVI, Omnibus Rules Implementing E.O. No. 292' },
  { label:'Solo Parent Leave',                  cite:'R.A. No. 8972 / CSC MC No. 8, s. 2004' },
  { label:'Study Leave',                        cite:'Sec. 68, Rule XVI, Omnibus Rules Implementing E.O. No. 292' },
  { label:'10-Day VAWC Leave',                  cite:'R.A. No. 9262 / CSC MC No. 15, s. 2005' },
  { label:'Rehabilitation Privilege',           cite:'Sec. 55, Rule XVI, Omnibus Rules Implementing E.O. No. 292' },
  { label:'Special Leave Benefits for Women',   cite:'R.A. No. 9710 / CSC MC No. 25, s. 2010' },
  { label:'Special Emergency (Calamity) Leave', cite:'CSC MC No. 2, s. 2012, as amended' },
  { label:'Adoption Leave',                     cite:'R.A. No. 8552' },
  { label:'Monetization',                       cite:'CSC MC No. 14, s. 1999, as amended' },
  { label:'Others',                        cite:'' },
];

/* Keep original LEAVE_TYPES compatible */
if (typeof LEAVE_TYPES === 'undefined') {
  var LEAVE_TYPES = LA_TYPES.map(t => t.label);
}
window.LEAVE_TYPES = LEAVE_TYPES;

/* ── UTILITIES ───────────────────────────────────────────────── */
function _esc(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
const _escH = () => window.escHtml || _esc;

function computeWorkingDays(from, to) {
  if (!from || !to) return 0;
  const d1 = new Date(from + 'T00:00:00');
  const d2 = new Date(to   + 'T00:00:00');
  if (isNaN(d1) || isNaN(d2) || d1 > d2) return 0;
  let n = 0;
  const cur = new Date(d1);
  while (cur <= d2) {
    const dow = cur.getDay();
    if (dow !== 0 && dow !== 6) n++;
    cur.setDate(cur.getDate() + 1);
  }
  return n;
}

function fmtDateRange(from, to) {
  if (!from) return '';
  const d1  = new Date(from + 'T00:00:00');
  const opt = { month:'long', day:'numeric', year:'numeric' };
  if (!to || from === to) return d1.toLocaleDateString('en-PH', opt);
  const d2 = new Date(to + 'T00:00:00');
  const m1 = d1.toLocaleString('en-PH', { month:'long' });
  const m2 = d2.toLocaleString('en-PH', { month:'long' });
  const y1 = d1.getFullYear(), y2 = d2.getFullYear();
  if (y1 === y2 && m1 === m2)
    return `${m1} ${d1.getDate()}\u2013${d2.getDate()}, ${y1}`;
  return `${d1.toLocaleDateString('en-PH', opt)} to ${d2.toLocaleDateString('en-PH', opt)}`;
}

/* ── WIZARD STATE ────────────────────────────────────────────── */
let _laEmp      = null;
let _laData     = {};
let _laFile     = null;
let _laStep     = 1;
let _laGoingFwd = true;   // for slide direction

/* ── ENTRY POINT — replaces the old modal ─────────────────────── */
function showLeaveApplicationModal(emp, existingApp) {
  _laEmp      = emp;
  _laFile     = null;
  _laStep     = 1;
  _laGoingFwd = true;

  if (existingApp) {
    _laData = { ...existingApp, _isEdit: true };
  } else {
    _laData = {
      _isEdit:         false,
      office_school:   emp?.school || '',
      position:        emp?.pos    || '',
      date_of_filing:  new Date().toISOString().slice(0, 10),
      salary_monthly:  '',
      leave_type:      '',
      leave_type_other:'',
      vacation_detail: '',
      vacation_abroad_specify: '',
      sick_detail:     '',
      sick_specify:    '',
      women_specify:   '',
      study_detail:    '',
      other_purpose:   '',
      date_from:       '',
      date_to:         '',
      num_working_days:'',
      inclusive_dates: '',
      commutation:     'Not Requested',
    };
  }

  /* Get or create page element */
  let pg = document.getElementById('pg-leave-apply');
  if (!pg) {
    pg = document.createElement('div');
    pg.id        = 'pg-leave-apply';
    pg.className = 'page';
    (document.getElementById('s-app') || document.body).appendChild(pg);
  }

  document.querySelectorAll('.page').forEach(p => p.classList.remove('on'));
  pg.classList.add('on');
  window.scrollTo(0, 0);

  _laRenderShell(pg);
}
window.showLeaveApplicationModal = showLeaveApplicationModal;

/* ── SHELL ───────────────────────────────────────────────────── */
function _laRenderShell(pg) {
  const empName = _laEmp
    ? _esc([_laEmp.surname, _laEmp.given, _laEmp.suffix].filter(Boolean).join(', '))
    : 'Employee';

  pg.innerHTML = `
    <div class="la-page">
      <div class="la-page-header">
        <div class="la-header-inner">
          <button class="la-back-btn" id="laBackBtn">← My Leave Card</button>
          <div class="la-header-title">
            <div class="la-header-eyebrow">Civil Service Form No. 6 · Revised 2020</div>
            <div class="la-header-main">Application for Leave</div>
            <div class="la-header-sub">SDO Koronadal City &nbsp;·&nbsp; ${_esc(_laEmp?.school || 'Schools Division Office')}</div>
          </div>
          <div class="la-header-spacer"></div>
        </div>
      </div>

      <div class="la-progress-bar" id="laProgressBar"></div>
      <div class="la-form-body" id="laFormBody"></div>
      <div class="la-form-footer" id="laFormFooter"></div>
    </div>`;

  document.getElementById('laBackBtn').addEventListener('click', () => {
    document.getElementById('pg-leave-apply')?.classList.remove('on');
    /* restore last admin or employee page */
    const prev = document.getElementById('pg-user')
                 || document.getElementById('pg-card-view')
                 || document.getElementById('pg-cards');
    prev?.classList.add('on');
  });

  _laUpdateProgress();
  _laRenderStep();
}

/* ── PROGRESS BAR ────────────────────────────────────────────── */
function _laUpdateProgress() {
  const steps = ['Basic Info', 'Type of Leave', 'Details & Dates', 'Document'];
  const bar   = document.getElementById('laProgressBar');
  if (!bar) return;
  bar.innerHTML = steps.map((label, i) => {
    const n   = i + 1;
    const cls = n < _laStep ? 'done' : n === _laStep ? 'active' : '';
    const ico = n < _laStep ? '✓' : n;
    const connector = n < steps.length
      ? `<div class="la-step-connector ${n < _laStep ? 'done' : ''}"></div>` : '';
    return `<div class="la-step ${cls}"><div class="la-step-num">${ico}</div><div class="la-step-label">${label}</div></div>${connector}`;
  }).join('');
}

/* ── STEP DISPATCHER ─────────────────────────────────────────── */
function _laRenderStep() {
  const body = document.getElementById('laFormBody');
  if (!body) return;
  body.className = 'la-form-body ' + (_laGoingFwd ? 'slide-in' : 'slide-back');
  /* Force reflow so animation restarts */
  void body.offsetWidth;
  switch (_laStep) {
    case 1: _laStep1(); break;
    case 2: _laStep2(); break;
    case 3: _laStep3(); break;
    case 4: _laStep4(); break;
  }
}

function _laNext() { _laGoingFwd = true;  _laStep++; _laUpdateProgress(); _laRenderStep(); window.scrollTo(0, 0); }
function _laPrev() { _laGoingFwd = false; _laStep--; _laUpdateProgress(); _laRenderStep(); window.scrollTo(0, 0); }

/* ════════════════════════════════════════════════════
   STEP 1 — Basic Information
   ════════════════════════════════════════════════════ */
function _laStep1() {
  const body   = document.getElementById('laFormBody');
  const footer = document.getElementById('laFormFooter');

  body.innerHTML = `
    <div class="la-card">
      <div class="la-card-head">
        <span class="la-card-head-icon">📋</span>
        <div>
          <div class="la-card-head-title">1. Basic Information</div>
          <div class="la-card-head-sub">Verify your details before proceeding</div>
        </div>
      </div>
      <div class="la-card-body">
        <div class="la-field-row col-2">
          <div class="la-field">
            <label class="la-label">Name (auto-filled)</label>
            <input class="la-input" type="text" readonly value="${_esc([_laEmp?.surname, _laEmp?.given, _laEmp?.suffix].filter(Boolean).join(', '))}"/>
          </div>
          <div class="la-field">
            <label class="la-label">Date of Filing <span class="la-req">*</span></label>
            <input class="la-input" type="date" id="la1_filing" value="${_esc(_laData.date_of_filing || '')}"/>
          </div>
        </div>
        <div class="la-field-row col-2">
          <div class="la-field">
            <label class="la-label">Office / School</label>
            <input class="la-input" type="text" id="la1_office" value="${_esc(_laData.office_school || '')}"/>
          </div>
          <div class="la-field">
            <label class="la-label">Position</label>
            <input class="la-input" type="text" id="la1_pos" value="${_esc(_laData.position || '')}"/>
          </div>
        </div>
        <div class="la-field-row col-2">
          <div class="la-field">
            <label class="la-label">Monthly Salary (₱)</label>
            <input class="la-input" type="number" id="la1_salary" min="0" step="0.01"
                   placeholder="e.g. 25000.00" value="${_esc(_laData.salary_monthly || '')}"/>
          </div>
        </div>
        <div class="la-err" id="la1Err"></div>
      </div>
    </div>`;

  footer.innerHTML = `
    <div></div>
    <button class="la-btn-next" id="la1Next">Next: Type of Leave &rarr;</button>`;

  document.getElementById('la1Next').addEventListener('click', () => {
    const filing = document.getElementById('la1_filing').value;
    const errEl  = document.getElementById('la1Err');
    errEl.classList.remove('show');
    if (!filing) {
      errEl.textContent = '⚠️ Date of Filing is required.';
      errEl.classList.add('show');
      return;
    }
    _laData.date_of_filing  = filing;
    _laData.office_school   = document.getElementById('la1_office').value.trim();
    _laData.position        = document.getElementById('la1_pos').value.trim();
    _laData.salary_monthly  = document.getElementById('la1_salary').value;
    _laNext();
  });
}

/* ════════════════════════════════════════════════════
   STEP 2 — 6A. Type of Leave
   ════════════════════════════════════════════════════ */
function _laStep2() {
  const body   = document.getElementById('laFormBody');
  const footer = document.getElementById('laFormFooter');

  body.innerHTML = `
    <div class="la-card">
      <div class="la-card-head">
        <span class="la-card-head-icon">☑</span>
        <div>
          <div class="la-card-head-title">6A. Type of Leave</div>
          <div class="la-card-head-sub">Select one — this is required to continue</div>
        </div>
      </div>
      <div class="la-card-body">
        <div class="la-type-grid" id="laTypeGrid">
          ${LA_TYPES.map(t => `
            <div class="la-type-item ${_laData.leave_type === t.label ? 'selected' : ''}"
                 data-lt="${_esc(t.label)}">
              <div class="la-type-cb">${_laData.leave_type === t.label ? '✓' : ''}</div>
              <div>
                <div class="la-type-name">${_esc(t.label)}</div>
                ${t.cite ? `<div class="la-type-cite">(${_esc(t.cite)})</div>` : ''}
              </div>
            </div>`).join('')}
        </div>
        <div class="la-sub-input" id="laOtherWrap" style="${_laData.leave_type === 'Others' ? '' : 'display:none;'}">
          <div class="la-field">
            <label class="la-label">Please specify <span class="la-req">*</span></label>
            <input class="la-input" type="text" id="laOtherText"
                   placeholder="Specify the other leave type…"
                   value="${_esc(_laData.leave_type_other || '')}"/>
          </div>
        </div>
        <div class="la-err" id="la2Err"></div>
      </div>
    </div>`;

  /* Wire type items */
  document.querySelectorAll('.la-type-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.la-type-item').forEach(i => {
        i.classList.remove('selected');
        i.querySelector('.la-type-cb').textContent = '';
      });
      item.classList.add('selected');
      item.querySelector('.la-type-cb').textContent = '✓';
      _laData.leave_type = item.dataset.lt;
      const ow = document.getElementById('laOtherWrap');
      if (ow) ow.style.display = _laData.leave_type === 'Others' ? '' : 'none';
    });
  });

  footer.innerHTML = `
    <button class="la-btn-prev" id="la2Prev">&larr; Back</button>
    <button class="la-btn-next" id="la2Next">Next: Details &amp; Dates &rarr;</button>`;

  document.getElementById('la2Prev').addEventListener('click', _laPrev);
  document.getElementById('la2Next').addEventListener('click', () => {
    const errEl = document.getElementById('la2Err');
    errEl.classList.remove('show');
    if (!_laData.leave_type) {
      errEl.textContent = '⚠️ Please select a type of leave to continue.';
      errEl.classList.add('show'); return;
    }
    if (_laData.leave_type === 'Others') {
      _laData.leave_type_other = document.getElementById('laOtherText')?.value?.trim() || '';
      if (!_laData.leave_type_other) {
        errEl.textContent = '⚠️ Please specify the type of leave.';
        errEl.classList.add('show'); return;
      }
    }
    _laNext();
  });
}

/* ════════════════════════════════════════════════════
   STEP 3 — 6B Details + 6C Dates + 6D Commutation
   ════════════════════════════════════════════════════ */
function _laStep3() {
  const body   = document.getElementById('laFormBody');
  const footer = document.getElementById('laFormFooter');
  const lt     = _laData.leave_type || '';

  const showVacation = ['Vacation Leave', 'Special Privilege Leave'].includes(lt);
  const showSick     = lt === 'Sick Leave';
  const showWomen    = lt === 'Special Leave Benefits for Women';
  const showStudy    = lt === 'Study Leave';
  const showAnyB     = showVacation || showSick || showWomen || showStudy;

  body.innerHTML = `
    ${showAnyB ? `
    <div class="la-card">
      <div class="la-card-head">
        <span class="la-card-head-icon">📝</span>
        <div>
          <div class="la-card-head-title">6B. Details of Leave</div>
          <div class="la-card-head-sub">Applicable details for ${_esc(lt)}</div>
        </div>
      </div>
      <div class="la-card-body">

        ${showVacation ? `
        <div class="la-detail-section">
          <div class="la-detail-title">In case of Vacation / Special Leave</div>
          <div class="la-radio-row ${_laData.vacation_detail === 'Within the Philippines' ? 'selected' : ''}" data-vd="Within the Philippines">
            <div class="la-radio-dot"></div>
            <span class="la-radio-label">Within the Philippines</span>
          </div>
          <div class="la-radio-row ${_laData.vacation_detail === 'Abroad' ? 'selected' : ''}" data-vd="Abroad">
            <div class="la-radio-dot"></div>
            <span class="la-radio-label">Abroad (Specify)</span>
          </div>
          <div class="la-sub-input" id="la3AbroadWrap" style="${_laData.vacation_detail === 'Abroad' ? '' : 'display:none;'}">
            <input class="la-input" type="text" id="la3_abroad" placeholder="Destination country / city"
                   value="${_esc(_laData.vacation_abroad_specify || '')}"/>
          </div>
        </div>` : ''}

        ${showSick ? `
        <div class="la-detail-section">
          <div class="la-detail-title">In case of Sick Leave</div>
          <div class="la-radio-row ${_laData.sick_detail === 'In Hospital' ? 'selected' : ''}" data-sd="In Hospital">
            <div class="la-radio-dot"></div>
            <span class="la-radio-label">In Hospital (Specify Illness)</span>
          </div>
          <div class="la-radio-row ${_laData.sick_detail === 'Out Patient' ? 'selected' : ''}" data-sd="Out Patient">
            <div class="la-radio-dot"></div>
            <span class="la-radio-label">Out Patient (Specify Illness)</span>
          </div>
          <div class="la-sub-input" id="la3SickWrap" style="${_laData.sick_detail ? '' : 'display:none;'}">
            <input class="la-input" type="text" id="la3_sick" placeholder="Illness / Condition"
                   value="${_esc(_laData.sick_specify || '')}"/>
          </div>
        </div>` : ''}

        ${showWomen ? `
        <div class="la-detail-section">
          <div class="la-detail-title">In case of Special Leave Benefits for Women</div>
          <div class="la-field">
            <label class="la-label">Specify Illness</label>
            <input class="la-input" type="text" id="la3_women" placeholder="Specify illness or condition"
                   value="${_esc(_laData.women_specify || '')}"/>
          </div>
        </div>` : ''}

        ${showStudy ? `
        <div class="la-detail-section">
          <div class="la-detail-title">In case of Study Leave</div>
          <div class="la-radio-row ${_laData.study_detail === "Completion of Master's Degree" ? 'selected' : ''}" data-std="Completion of Master's Degree">
            <div class="la-radio-dot"></div>
            <span class="la-radio-label">Completion of Master's Degree</span>
          </div>
          <div class="la-radio-row ${_laData.study_detail === 'Bar/Board Examination Review' ? 'selected' : ''}" data-std="Bar/Board Examination Review">
            <div class="la-radio-dot"></div>
            <span class="la-radio-label">Bar / Board Examination Review</span>
          </div>
        </div>` : ''}

        <div class="la-detail-section">
          <div class="la-detail-title">Other Purpose</div>
          <div class="la-radio-row ${_laData.other_purpose === 'Monetization of Leave Credits' ? 'selected' : ''}" data-op="Monetization of Leave Credits">
            <div class="la-radio-dot"></div>
            <span class="la-radio-label">Monetization of Leave Credits</span>
          </div>
          <div class="la-radio-row ${_laData.other_purpose === 'Termination Leave' ? 'selected' : ''}" data-op="Termination Leave">
            <div class="la-radio-dot"></div>
            <span class="la-radio-label">Termination Leave</span>
          </div>
        </div>
      </div>
    </div>` : `
    <div class="la-card">
      <div class="la-card-head">
        <span class="la-card-head-icon">📝</span>
        <div><div class="la-card-head-title">6B. Details of Leave</div></div>
      </div>
      <div class="la-card-body">
        <div class="la-detail-section">
          <div class="la-detail-title">Other Purpose</div>
          <div class="la-radio-row ${_laData.other_purpose === 'Monetization of Leave Credits' ? 'selected' : ''}" data-op="Monetization of Leave Credits">
            <div class="la-radio-dot"></div><span class="la-radio-label">Monetization of Leave Credits</span>
          </div>
          <div class="la-radio-row ${_laData.other_purpose === 'Termination Leave' ? 'selected' : ''}" data-op="Termination Leave">
            <div class="la-radio-dot"></div><span class="la-radio-label">Termination Leave</span>
          </div>
        </div>
        <p style="font-size:12px;color:#9a9aaa;margin:0;">No specific 6B details required for <strong>${_esc(lt)}</strong>.</p>
      </div>
    </div>`}

    <!-- 6C Dates -->
    <div class="la-card">
      <div class="la-card-head">
        <span class="la-card-head-icon">📅</span>
        <div>
          <div class="la-card-head-title">6C. Working Days &amp; Inclusive Dates</div>
          <div class="la-card-head-sub">Pick a date range — working days are computed automatically</div>
        </div>
      </div>
      <div class="la-card-body">
        <div style="display:grid;grid-template-columns:1fr auto 1fr;align-items:end;gap:12px;margin-bottom:18px;">
          <div class="la-field">
            <label class="la-label">📅 From Date <span class="la-req">*</span></label>
            <div style="position:relative;">
              <input class="la-input" type="date" id="la3_from" value="${_esc(_laData.date_from || '')}"
                style="cursor:pointer;padding-right:40px;"/>
              <span onclick="document.getElementById('la3_from').showPicker()"
                style="position:absolute;right:12px;top:50%;transform:translateY(-50%);
                       font-size:18px;cursor:pointer;pointer-events:auto;user-select:none;">📅</span>
            </div>
          </div>
          <div style="font-size:20px;color:#c0a0a0;font-weight:700;padding-bottom:10px;text-align:center;">→</div>
          <div class="la-field">
            <label class="la-label">📅 To Date <span class="la-req">*</span></label>
            <div style="position:relative;">
              <input class="la-input" type="date" id="la3_to" value="${_esc(_laData.date_to || '')}"
                style="cursor:pointer;padding-right:40px;"/>
              <span onclick="document.getElementById('la3_to').showPicker()"
                style="position:absolute;right:12px;top:50%;transform:translateY(-50%);
                       font-size:18px;cursor:pointer;pointer-events:auto;user-select:none;">📅</span>
            </div>
          </div>
        </div>

        <div class="la-days-display">
          <div class="la-days-num" id="la3DaysNum">${_laData.num_working_days || '—'}</div>
          <div class="la-days-meta">
            <div class="la-days-label">Working Days Applied For</div>
            <div class="la-days-range" id="la3DaysRange">${_laData.inclusive_dates || 'Select dates above'}</div>
          </div>
        </div>

        <div class="la-err" id="la3Err"></div>
      </div>
    </div>

    <!-- 6D Commutation -->
    <div class="la-card">
      <div class="la-card-head">
        <span class="la-card-head-icon">💸</span>
        <div><div class="la-card-head-title">6D. Commutation</div></div>
      </div>
      <div class="la-card-body">
        <div class="la-comm-row">
          <div class="la-radio-row ${(_laData.commutation || 'Not Requested') === 'Not Requested' ? 'selected' : ''}" data-cm="Not Requested">
            <div class="la-radio-dot"></div>
            <span class="la-radio-label">Not Requested</span>
          </div>
          <div class="la-radio-row ${_laData.commutation === 'Requested' ? 'selected' : ''}" data-cm="Requested">
            <div class="la-radio-dot"></div>
            <span class="la-radio-label">Requested</span>
          </div>
        </div>
      </div>
    </div>`;

  /* ── Wire radio groups ── */
  const _wireRadios = (sel, storeProp, onSelect) => {
    document.querySelectorAll(sel).forEach(row => {
      row.addEventListener('click', () => {
        document.querySelectorAll(sel).forEach(r => r.classList.remove('selected'));
        row.classList.add('selected');
        _laData[storeProp] = row.dataset[Object.keys(row.dataset)[0]];
        if (onSelect) onSelect(row.dataset[Object.keys(row.dataset)[0]]);
      });
    });
  };

  /* Vacation */
  document.querySelectorAll('[data-vd]').forEach(row => {
    row.addEventListener('click', () => {
      document.querySelectorAll('[data-vd]').forEach(r => r.classList.remove('selected'));
      row.classList.add('selected');
      _laData.vacation_detail = row.dataset.vd;
      const aw = document.getElementById('la3AbroadWrap');
      if (aw) aw.style.display = _laData.vacation_detail === 'Abroad' ? '' : 'none';
    });
  });

  /* Sick */
  document.querySelectorAll('[data-sd]').forEach(row => {
    row.addEventListener('click', () => {
      document.querySelectorAll('[data-sd]').forEach(r => r.classList.remove('selected'));
      row.classList.add('selected');
      _laData.sick_detail = row.dataset.sd;
      const sw = document.getElementById('la3SickWrap');
      if (sw) sw.style.display = '';
    });
  });

  /* Study */
  document.querySelectorAll('[data-std]').forEach(row => {
    row.addEventListener('click', () => {
      document.querySelectorAll('[data-std]').forEach(r => r.classList.remove('selected'));
      row.classList.add('selected');
      _laData.study_detail = row.dataset.std;
    });
  });

  /* Other Purpose (toggle) */
  document.querySelectorAll('[data-op]').forEach(row => {
    row.addEventListener('click', () => {
      if (row.classList.contains('selected')) {
        row.classList.remove('selected');
        _laData.other_purpose = '';
      } else {
        document.querySelectorAll('[data-op]').forEach(r => r.classList.remove('selected'));
        row.classList.add('selected');
        _laData.other_purpose = row.dataset.op;
      }
    });
  });

  /* Commutation */
  document.querySelectorAll('[data-cm]').forEach(row => {
    row.addEventListener('click', () => {
      document.querySelectorAll('[data-cm]').forEach(r => r.classList.remove('selected'));
      row.classList.add('selected');
      _laData.commutation = row.dataset.cm;
    });
  });

  /* ── Date pickers ── */
  function updateDates() {
    const from = document.getElementById('la3_from')?.value;
    const to   = document.getElementById('la3_to')?.value;
    if (from && to && from <= to) {
      const days    = computeWorkingDays(from, to);
      const dateStr = fmtDateRange(from, to);
      document.getElementById('la3DaysNum').textContent   = days;
      document.getElementById('la3DaysRange').textContent = dateStr;
      _laData.date_from        = from;
      _laData.date_to          = to;
      _laData.num_working_days = days;
      _laData.inclusive_dates  = dateStr;
    }
  }

  document.getElementById('la3_from')?.addEventListener('change', function () {
    const toEl = document.getElementById('la3_to');
    if (toEl) { toEl.min = this.value; if (toEl.value && toEl.value < this.value) toEl.value = this.value; }
    updateDates();
  });
  document.getElementById('la3_to')?.addEventListener('change', updateDates);

  /* ── Footer ── */
  footer.innerHTML = `
    <button class="la-btn-prev" id="la3Prev">&larr; Back</button>
    <button class="la-btn-next" id="la3Next">Next: Upload Document &rarr;</button>`;

  document.getElementById('la3Prev').addEventListener('click', _laPrev);
  document.getElementById('la3Next').addEventListener('click', () => {
    const errEl = document.getElementById('la3Err');
    errEl.classList.remove('show');

    /* Save sub-fields */
    _laData.vacation_abroad_specify = document.getElementById('la3_abroad')?.value?.trim() || '';
    _laData.sick_specify   = document.getElementById('la3_sick')?.value?.trim()   || '';
    _laData.women_specify  = document.getElementById('la3_women')?.value?.trim()  || '';

    if (!_laData.date_from || !_laData.date_to) {
      errEl.textContent = '⚠️ Please select both a From and To date.';
      errEl.classList.add('show'); return;
    }
    if (!_laData.num_working_days || +_laData.num_working_days < 0.5) {
      errEl.textContent = '⚠️ Date range results in 0 working days. Please check your dates.';
      errEl.classList.add('show'); return;
    }
    _laNext();
  });
}

/* ════════════════════════════════════════════════════
   STEP 4 — Supporting Document + Review + Submit
   ════════════════════════════════════════════════════ */
function _laStep4() {
  const body   = document.getElementById('laFormBody');
  const footer = document.getElementById('laFormFooter');
  const isEdit = !!_laData._isEdit;

  const typeLabel = _laData.leave_type === 'Others' && _laData.leave_type_other
    ? `Others: ${_laData.leave_type_other}`
    : _laData.leave_type;

  body.innerHTML = `
    <!-- Document -->
    <div class="la-card">
      <div class="la-card-head">
        <span class="la-card-head-icon">📎</span>
        <div>
          <div class="la-card-head-title">Supporting Document${!isEdit ? ' (Required)' : ''}</div>
          <div class="la-card-head-sub">${
            isEdit && _laData.attachment_name
              ? `Current: <strong>${_esc(_laData.attachment_name)}</strong> — upload a new file to replace`
              : 'PDF, JPG, PNG, or Word document'
          }</div>
        </div>
      </div>
      <div class="la-card-body">
        <div class="la-file-zone" id="la4FileZone">
          <input type="file" id="la4FileInput" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"/>
          <span class="la-file-icon">📎</span>
          <div class="la-file-label">
            ${isEdit && _laData.attachment_name
              ? `Current: <strong>${_esc(_laData.attachment_name)}</strong><br><span style="font-size:11px;color:#b08080;">Drag a new file here or click to replace</span>`
              : 'Click or drag a file here<br><span style="font-size:11px;color:#b08080;">PDF, Image, or Word document · max 10 MB</span>'}
          </div>
          <div class="la-file-name" id="la4FileName"></div>
        </div>
        <div class="la-err" id="la4Err"></div>
      </div>
    </div>

    <!-- Review -->
    <div class="la-card">
      <div class="la-card-head green">
        <span class="la-card-head-icon">🔍</span>
        <div>
          <div class="la-card-head-title">Review Your Application</div>
          <div class="la-card-head-sub">Please check everything before submitting</div>
        </div>
      </div>
      <div class="la-card-body">
        <div class="la-review">
          <div class="la-review-head">📋 APPLICATION SUMMARY — CSF No. 6</div>
          <div class="la-review-body">
            ${[
              ['Name',            [_laEmp?.surname, _laEmp?.given, _laEmp?.suffix].filter(Boolean).join(', ')],
              ['Office / School', _laData.office_school],
              ['Position',        _laData.position],
              ['Date of Filing',  _laData.date_of_filing],
              ['Salary (Monthly)',_laData.salary_monthly ? '₱ ' + parseFloat(_laData.salary_monthly).toLocaleString() : ''],
              ['Type of Leave',   typeLabel],
              _laData.vacation_detail ? ['Vacation Detail', _laData.vacation_detail] : null,
              _laData.vacation_abroad_specify ? ['Destination', _laData.vacation_abroad_specify] : null,
              _laData.sick_detail  ? ['Sick Leave', `${_laData.sick_detail}${_laData.sick_specify ? ' — ' + _laData.sick_specify : ''}`] : null,
              _laData.women_specify? ['Women SLB', _laData.women_specify] : null,
              _laData.study_detail ? ['Study Leave', _laData.study_detail] : null,
              _laData.other_purpose? ['Other Purpose', _laData.other_purpose] : null,
              ['Inclusive Dates', _laData.inclusive_dates],
              ['Working Days',    _laData.num_working_days ? _laData.num_working_days + ' day(s)' : ''],
              ['Commutation',     _laData.commutation || 'Not Requested'],
            ].filter(r => r && r[1]).map(([k, v]) =>
              `<div class="la-review-row"><div class="la-review-key">${k}</div><div class="la-review-val">${_esc(v)}</div></div>`
            ).join('')}
          </div>
        </div>
      </div>
    </div>`;

  /* File zone wiring */
  const fileZone  = document.getElementById('la4FileZone');
  const fileInput = document.getElementById('la4FileInput');
  const fileName  = document.getElementById('la4FileName');

  function setFile(f) {
    if (!f) return;
    _laFile = f;
    fileZone.classList.add('has-file');
    fileName.textContent = '✅ ' + f.name;
  }

  fileZone?.addEventListener('dragover', e => { e.preventDefault(); fileZone.classList.add('drag-over'); });
  fileZone?.addEventListener('dragleave', ()  => fileZone.classList.remove('drag-over'));
  fileZone?.addEventListener('drop', e => { e.preventDefault(); fileZone.classList.remove('drag-over'); setFile(e.dataTransfer?.files?.[0]); });
  fileInput?.addEventListener('change', () => setFile(fileInput.files?.[0]));

  /* Footer */
  footer.innerHTML = `
    <button class="la-btn-prev" id="la4Prev">&larr; Back</button>
    <button class="la-btn-submit" id="la4Submit">
      📤 ${isEdit ? 'Resubmit Application' : 'Submit Application'}
    </button>`;

  document.getElementById('la4Prev').addEventListener('click', _laPrev);

  document.getElementById('la4Submit').addEventListener('click', async () => {
    const errEl     = document.getElementById('la4Err');
    const submitBtn = document.getElementById('la4Submit');
    errEl.classList.remove('show');

    if (!isEdit && !_laFile) {
      errEl.textContent = '⚠️ A supporting document is required. Please attach a file.';
      errEl.classList.add('show'); return;
    }

    submitBtn.disabled    = true;
    submitBtn.textContent = '⏳ Submitting…';

    const fd = new FormData();
    if (isEdit && _laData.id) fd.append('app_id', _laData.id);
    const fields = {
      office_school:           _laData.office_school,
      position:                _laData.position,
      date_of_filing:          _laData.date_of_filing,
      salary_monthly:          _laData.salary_monthly,
      leave_type:              _laData.leave_type,
      leave_type_other:        _laData.leave_type_other,
      vacation_detail:         _laData.vacation_detail,
      vacation_abroad_specify: _laData.vacation_abroad_specify,
      sick_detail:             _laData.sick_detail,
      sick_specify:            _laData.sick_specify,
      women_specify:           _laData.women_specify,
      study_detail:            _laData.study_detail,
      other_purpose:           _laData.other_purpose,
      num_working_days:        _laData.num_working_days,
      inclusive_dates:         _laData.inclusive_dates,
      commutation:             _laData.commutation || 'Not Requested',
    };
    Object.entries(fields).forEach(([k, v]) => fd.append(k, v || ''));
    if (_laFile) fd.append('attachment', _laFile);

    try {
      const API  = window.API_BASE || '/api';
      const csrf = window.CSRF_TOKEN
                || document.querySelector('meta[name="csrf-token"]')?.content
                || '';
      const res  = await fetch(`${API}/submit_leave_application`, {
        method:  'POST',
        headers: { 'X-CSRF-TOKEN': csrf },
        body:    fd,
      });

      let data;
      try { data = await res.json(); } catch { data = { ok: false, error: `Server error ${res.status}` }; }

      if (data.ok) {
        /* Navigate back */
        document.getElementById('pg-leave-apply')?.classList.remove('on');
        document.getElementById('pg-user')?.classList.add('on');

        /* Refresh history if mounted */
        if (_laEmp && typeof injectLeaveApplicationSection === 'function') {
          injectLeaveApplicationSection(_laEmp);
        }
        alert(isEdit ? '✅ Application resubmitted successfully!' : '✅ Leave application submitted!');
      } else {
        errEl.textContent = '⚠️ ' + (data.error || 'Submission failed. Please try again.');
        errEl.classList.add('show');
        submitBtn.disabled    = false;
        submitBtn.textContent = isEdit ? '📤 Resubmit Application' : '📤 Submit Application';
      }
    } catch (err) {
      errEl.textContent = '⚠️ Network error: ' + err.message;
      errEl.classList.add('show');
      submitBtn.disabled    = false;
      submitBtn.textContent = isEdit ? '📤 Resubmit Application' : '📤 Submit Application';
    }
  });
}

/* ── EMPLOYEE HISTORY SECTION ────────────────────────────────── */
async function injectLeaveApplicationSection(emp) {
  const mount = document.getElementById('empLeaveAppMount');
  if (!mount) return;

  const apiCall = window.apiCall;
  if (!apiCall) return;

  const res  = await apiCall('get_my_leave_applications', {}, 'GET');
  const apps = (res.ok ? res.applications : []) || [];

  const pendingCount  = apps.filter(a => a.status === 'pending').length;
  const acceptedCount = apps.filter(a => a.status === 'accepted').length;
  const rejectedCount = apps.filter(a => a.status === 'rejected').length;

  let currentTab = 'pending';

  function renderTab(tab) {
    currentTab = tab;
    const filtered = apps.filter(a => a.status === tab);
    const esc = window.escHtml || (s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'));

    mount.querySelector('#empSubTabPending')?.classList.toggle('active', tab==='pending');
    mount.querySelector('#empSubTabAccepted')?.classList.toggle('active', tab==='accepted');
    mount.querySelector('#empSubTabRejected')?.classList.toggle('active', tab==='rejected');

    const listWrap = mount.querySelector('#empSubList');
    if (!listWrap) return;

    if (filtered.length === 0) {
      listWrap.innerHTML = `
        <div style="text-align:center;padding:40px 20px;color:#9a8a8a;">
          <div style="font-size:32px;margin-bottom:10px;">${tab==='pending'?'📭':tab==='accepted'?'✅':'❌'}</div>
          <div style="font-size:13px;">No ${tab} applications.</div>
        </div>`;
      return;
    }

    listWrap.innerHTML = filtered.map(a => {
      const lbl = a.leave_type === 'Others' && a.leave_type_other
        ? `Others: ${esc(a.leave_type_other)}` : esc(a.leave_type||'—');
      return `
        <div class="emp-app-card" style="margin-bottom:12px;">
          <span class="emp-app-card-status ${a.status}">${a.status.toUpperCase()}</span>
          <div class="emp-app-card-info">
            <div class="emp-app-card-type">${lbl}</div>
            <div class="emp-app-card-dates">
              📅 ${esc(a.inclusive_dates||'—')} &nbsp;·&nbsp; ${a.num_working_days||'—'} day(s)
              &nbsp;·&nbsp; Filed: ${a.date_of_filing||'—'}
            </div>
            <div style="font-size:11px;color:#7a8a9d;margin-top:2px;">
              🏫 ${esc(a.office_school||'')} &nbsp;·&nbsp; Commutation: ${esc(a.commutation||'Not Requested')}
            </div>
            ${a.status==='rejected' && a.rejection_reason
              ? `<div class="emp-app-card-reason">❌ Rejected: ${esc(a.rejection_reason)}</div>` : ''}
            ${a.status==='accepted' && a.reviewed_by
              ? `<div style="font-size:11px;color:#065f46;margin-top:4px;background:#d1fae5;padding:4px 10px;border-radius:7px;">✅ Accepted by ${esc(a.reviewed_by)}</div>` : ''}
          </div>
          <div class="emp-app-card-actions">
            <button class="emp-app-action-btn" data-view-app="${a.id}"
              style="background:#e0e7ff;color:#3730a3;border:1px solid #a5b4fc;">
              🔍 View
            </button>
            ${a.status==='accepted'
              ? `<button class="emp-app-action-btn" data-print-app="${a.id}"
                   style="background:#d1fae5;color:#065f46;border:1px solid #6ee7b7;">
                   🖨 Print
                 </button>` : ''}
            ${a.status==='rejected'
              ? `<button class="emp-app-action-btn edit" data-edit-app="${a.id}">✏ Edit &amp; Resubmit</button>` : ''}
            ${a.status!=='accepted'
              ? `<button class="emp-app-action-btn delete" data-delete-app="${a.id}">🗑 Delete</button>` : ''}
          </div>
        </div>`;
    }).join('');

    /* Wire buttons */
    listWrap.querySelectorAll('[data-view-app]').forEach(btn => {
      const app = apps.find(a => a.id === +btn.dataset.viewApp);
      if (app) btn.addEventListener('click', () => _laViewCSFModal(app, esc));
    });
    listWrap.querySelectorAll('[data-print-app]').forEach(btn => {
      const app = apps.find(a => a.id === +btn.dataset.printApp);
      if (app) btn.addEventListener('click', () => {
        _laViewCSFModal(app, esc);
        /* auto-trigger print after modal opens */
        setTimeout(() => {
          document.getElementById('csfPrintFrame')?.contentWindow?.print();
        }, 800);
      });
    });
    listWrap.querySelectorAll('[data-edit-app]').forEach(btn => {
      const app = apps.find(a => a.id === +btn.dataset.editApp);
      if (app) btn.addEventListener('click', () => showLeaveApplicationModal(emp, app));
    });
    listWrap.querySelectorAll('[data-delete-app]').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Delete this application?')) return;
        const r = await apiCall('delete_leave_application', { app_id: +btn.dataset.deleteApp });
        if (r.ok) injectLeaveApplicationSection(emp);
        else alert(r.error || 'Delete failed.');
      });
    });
  }

  mount.innerHTML = `
    <div style="margin:32px 0 0;border-radius:18px;border:1.5px solid #e8d0d0;overflow:hidden;background:#fff;box-shadow:0 4px 20px rgba(139,26,26,.07);">

      <!-- Header -->
      <div style="background:linear-gradient(135deg,#5a0f16,#8b1a1a);color:#fff;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
        <div>
          <div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;opacity:.65;margin-bottom:3px;">Civil Service Form No. 6</div>
          <div style="font-size:15px;font-weight:800;">My Leave Applications</div>
        </div>
        <button class="emp-apply-btn no-print" id="empApplyLeaveBtn"
          style="padding:10px 22px;font-size:12px;">
          📋 Apply for Leave
        </button>
      </div>

      <!-- Tabs -->
      <div style="display:flex;border-bottom:2px solid #f0e0e0;background:#fdf8f8;">
        <button id="empSubTabPending"
          style="flex:1;padding:12px 8px;font-size:11px;font-weight:800;letter-spacing:.5px;text-transform:uppercase;border:none;cursor:pointer;background:linear-gradient(135deg,#8b1a1a,#c83030);color:#fff;transition:all .2s;">
          ⏳ Pending <span style="background:rgba(255,255,255,.25);border-radius:20px;padding:1px 8px;margin-left:4px;">${pendingCount}</span>
        </button>
        <button id="empSubTabAccepted"
          style="flex:1;padding:12px 8px;font-size:11px;font-weight:800;letter-spacing:.5px;text-transform:uppercase;border:none;cursor:pointer;background:#fff;color:#7a8a9d;border-left:1px solid #f0e0e0;transition:all .2s;">
          ✅ Accepted <span style="background:#d1fae5;color:#065f46;border-radius:20px;padding:1px 8px;margin-left:4px;">${acceptedCount}</span>
        </button>
        <button id="empSubTabRejected"
          style="flex:1;padding:12px 8px;font-size:11px;font-weight:800;letter-spacing:.5px;text-transform:uppercase;border:none;cursor:pointer;background:#fff;color:#7a8a9d;border-left:1px solid #f0e0e0;transition:all .2s;">
          ❌ Rejected <span style="background:#fee2e2;color:#991b1b;border-radius:20px;padding:1px 8px;margin-left:4px;">${rejectedCount}</span>
        </button>
        <button id="empSubTabRecorded"
          style="flex:1;padding:12px 8px;font-size:11px;font-weight:800;letter-spacing:.5px;text-transform:uppercase;border:none;cursor:pointer;background:#fff;color:#7a8a9d;border-left:1px solid #f0e0e0;transition:all .2s;">
          📁 Recorded <span id="empSubRecordedCount" style="background:#dbeafe;color:#1e3a6e;border-radius:20px;padding:1px 8px;margin-left:4px;">…</span>
        </button>
      </div>

      <!-- List -->
      <div id="empSubList" style="padding:20px 24px;min-height:80px;"></div>
    </div>`;

  /* Tab click handlers */
  mount.querySelector('#empSubTabPending')?.addEventListener('click',  () => {
    mount.querySelectorAll('#empSubTabPending,#empSubTabAccepted,#empSubTabRejected').forEach(b => {
      b.style.background = '#fff'; b.style.color = '#7a8a9d';
    });
    mount.querySelector('#empSubTabPending').style.background = 'linear-gradient(135deg,#8b1a1a,#c83030)';
    mount.querySelector('#empSubTabPending').style.color = '#fff';
    renderTab('pending');
  });
  mount.querySelector('#empSubTabAccepted')?.addEventListener('click', () => {
    mount.querySelectorAll('#empSubTabPending,#empSubTabAccepted,#empSubTabRejected').forEach(b => {
      b.style.background = '#fff'; b.style.color = '#7a8a9d';
    });
    mount.querySelector('#empSubTabAccepted').style.background = 'linear-gradient(135deg,#064e3b,#059669)';
    mount.querySelector('#empSubTabAccepted').style.color = '#fff';
    renderTab('accepted');
  });
  mount.querySelector('#empSubTabRejected')?.addEventListener('click', () => {
    mount.querySelectorAll('#empSubTabPending,#empSubTabAccepted,#empSubTabRejected').forEach(b => {
      b.style.background = '#fff'; b.style.color = '#7a8a9d';
    });
    mount.querySelector('#empSubTabRejected').style.background = 'linear-gradient(135deg,#7f1d1d,#dc2626)';
    mount.querySelector('#empSubTabRejected').style.color = '#fff';
    renderTab('rejected');
  });

  mount.querySelector('#empApplyLeaveBtn')?.addEventListener('click', () => showLeaveApplicationModal(emp, null));

  mount.querySelector('#empSubTabRecorded')?.addEventListener('click', () => {
    if (typeof renderRecordedArchivePage === 'function') renderRecordedArchivePage(true);
  });

  /* Load recorded count */
  apiCall('get_my_recorded_applications', {}, 'GET').then(r => {
    const cnt = (r.ok ? r.applications : []).length;
    const badge = mount.querySelector('#empSubRecordedCount');
    if (badge) badge.textContent = cnt;
  });

  /* Default tab */
  renderTab('pending');
}
window.injectLeaveApplicationSection = injectLeaveApplicationSection;

function _laRenderHistory(apps) {
  const esc = _escH();
  return `
    <div class="emp-app-history no-print">
      <div class="emp-app-history-title">📁 My Leave Applications</div>
      ${apps.map(a => `
        <div class="emp-app-card">
          <span class="emp-app-card-status ${a.status}">${a.status.toUpperCase()}</span>
          <div class="emp-app-card-info">
            <div class="emp-app-card-type">${esc(a.leave_type)}${a.leave_type === 'Others' && a.leave_type_other ? ': ' + esc(a.leave_type_other) : ''}</div>
            <div class="emp-app-card-dates">${esc(a.inclusive_dates || '—')} · Filed: ${a.date_of_filing || '—'}</div>
            ${a.status === 'rejected' && a.rejection_reason ? `<div class="emp-app-card-reason">❌ Rejected: ${esc(a.rejection_reason)}</div>` : ''}
          </div>
          <div class="emp-app-card-actions">
            ${a.status === 'rejected'  ? `<button class="emp-app-action-btn edit"   data-edit-app="${a.id}">✏ Edit &amp; Resubmit</button>` : ''}
            ${a.status !== 'accepted'  ? `<button class="emp-app-action-btn delete" data-delete-app="${a.id}">🗑 Delete</button>` : ''}
          </div>
        </div>`).join('')}
    </div>`;
}



function _laSubCard(a, tab, esc) {
  const name = `${esc(a.surname)}, ${esc(a.given)}${a.suffix ? ' ' + esc(a.suffix) : ''}`;
  const lbl  = a.leave_type === 'Others' && a.leave_type_other
    ? `Others: ${esc(a.leave_type_other)}` : esc(a.leave_type || '—');
  return `
    <div class="sub-app-card">
      <div class="sub-app-card-top">
        <div>
          <div class="sub-app-card-name">👤 ${name}</div>
          <div class="sub-app-card-meta">${esc(a.emp_category||'')} &nbsp;·&nbsp; Filed: ${a.date_of_filing||'—'} &nbsp;·&nbsp; ${esc(a.office_school||'—')}</div>
        </div>
        <div class="sub-app-card-type">${lbl}</div>
      </div>
      <div class="sub-app-card-details">
        <span><strong>Inclusive Dates</strong>${esc(a.inclusive_dates||'—')}</span>
        <span><strong>Working Days</strong>${a.num_working_days||'—'}</span>
        <span><strong>Commutation</strong>${esc(a.commutation||'—')}</span>
        ${a.attachment_name
          ? `<span><strong>Attachment</strong><a class="sub-app-attachment" href="${esc(a.attachment_path ? '/storage/' + a.attachment_path : '')}" target="_blank" rel="noopener noreferrer">📎 ${esc(a.attachment_name)}</a></span>`
          : '<span><strong>Attachment</strong>None</span>'}
      </div>
      ${tab === 'rejected' && a.rejection_reason ? `<div class="sub-rejected-reason">❌ ${esc(a.rejection_reason)}</div>` : ''}
      <div class="sub-app-card-actions">
        <button class="sub-btn view" data-sub-view="${a.id}">🔍 View Details</button>
        ${tab === 'pending' ? `
          <button class="sub-btn accept" data-sub-accept="${a.id}">✅ Accept</button>
          <button class="sub-btn reject" data-sub-reject="${a.id}">❌ Reject</button>` : ''}
${tab === 'accepted' && !a.recorded_at ? `
          <button class="sub-btn" data-sub-record="${a.id}"
            style="background:linear-gradient(135deg,#1e3a6e,#4a7cc7);color:#fff;box-shadow:0 3px 12px rgba(74,124,199,.3);">
            📁 Mark as Recorded
          </button>` : ''}
${tab === 'accepted' && a.recorded_at ? `
          <span style="font-size:11px;font-weight:700;color:#1e3a6e;background:#dbeafe;border-radius:8px;padding:5px 12px;border:1px solid #93c5fd;display:inline-flex;align-items:center;gap:5px;">
            📁 Recorded on ${new Date(a.recorded_at).toLocaleDateString('en-PH',{month:'short',day:'numeric',year:'numeric'})}
          </span>` : ''}
      </div>
    </div>`;
}

function _laRejectModal(appId, reloadFn, tab) {
  document.getElementById('laRejectMo')?.remove();
  const html = `
    <div class="mo open" id="laRejectMo" style="z-index:10001;">
      <div class="mb" style="max-width:480px!important;">
        <div class="mh" style="background:linear-gradient(135deg,#7f1d1d,#dc2626);">
          <h3>❌ Reject Application</h3>
          <button class="mo-close-btn" id="laRjClose">✕</button>
        </div>
        <div class="md">
          <div class="f">
            <label>Reason for Rejection *</label>
            <textarea id="laRjText" rows="4"
              style="background:#fff;color:#1a0505;border:1.5px solid rgba(180,40,20,.4);border-radius:9px;padding:10px 13px;font-size:13px;width:100%;box-sizing:border-box;font-family:inherit;resize:vertical;"
              placeholder="State the reason clearly so the employee can correct and resubmit…"></textarea>
          </div>
          <div id="laRjErr" style="color:#f87171;font-size:12px;margin-top:6px;min-height:14px;"></div>
        </div>
        <div class="mf">
          <button class="btn b-slt" id="laRjCancel">Cancel</button>
          <button class="btn b-red" id="laRjConfirm">❌ Confirm Rejection</button>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', html);

  const close = () => document.getElementById('laRejectMo')?.remove();
  document.getElementById('laRjClose')?.addEventListener('click',  close);
  document.getElementById('laRjCancel')?.addEventListener('click', close);
  document.getElementById('laRjConfirm')?.addEventListener('click', async () => {
    const reason = document.getElementById('laRjText')?.value?.trim();
    const errEl  = document.getElementById('laRjErr');
    if (!reason) { errEl.textContent = 'Please provide a reason.'; return; }
    const r = await (window.apiCall || (async()=>({ok:false})))('review_leave_application', { app_id: appId, action: 'reject', reason });
    if (r.ok) { close(); reloadFn(tab); }
    else errEl.textContent = r.error || 'Failed.';
  });
}

function _laViewCSFModal(a, esc) {
  document.getElementById('laViewMo')?.remove();

  const lbl = a.leave_type === 'Others' && a.leave_type_other
    ? `Others: ${esc(a.leave_type_other)}` : (a.leave_type || '—');

  const chk = (condition) => condition
    ? `<span style="display:inline-block;width:11px;height:11px;border:1.5px solid #333;background:#333;margin-right:4px;vertical-align:middle;font-size:9px;color:#fff;line-height:11px;text-align:center;">✓</span>`
    : `<span style="display:inline-block;width:11px;height:11px;border:1.5px solid #555;margin-right:4px;vertical-align:middle;"></span>`;

  const line = (val) => `<span style="display:inline-block;min-width:160px;border-bottom:1px solid #333;padding:0 4px;">${esc(val||'')}</span>`;

  const html = `
    <div class="mo open" id="laViewMo" style="z-index:10001;">
      <div class="mb" style="max-width:780px!important;background:#fff!important;color:#111!important;">
        <div class="mh" style="background:linear-gradient(135deg,#5a0f16,#8b1a1a);">
          <h3>📋 CSF No. 6 — Leave Application</h3>
          <button class="mo-close-btn" id="laVwClose">✕</button>
        </div>
        <div class="md" style="padding:0;">

          <!-- PRINT BUTTON -->
          <div style="padding:12px 20px;background:#f8f8f8;border-bottom:1px solid #ddd;display:flex;gap:10px;justify-content:flex-end;" class="no-print">
            <button onclick="document.getElementById('csfPrintFrame').contentWindow.print()"
              style="background:linear-gradient(135deg,#5a0f16,#8b1a1a);color:#fff;border:none;border-radius:8px;padding:9px 22px;font-size:12px;font-weight:700;cursor:pointer;">
              🖨 Print CSF No. 6
            </button>
<button id="csfDownloadBtn"
              style="background:linear-gradient(135deg,#065f46,#059669);color:#fff;border:none;border-radius:8px;padding:9px 22px;font-size:12px;font-weight:700;cursor:pointer;">
              🖨 Save as PDF
            </button>
            ${a.attachment_path ? `<a href="/storage/${esc(a.attachment_path)}" target="_blank"
              style="background:linear-gradient(135deg,#1e3a6e,#3b82f6);color:#fff;border-radius:8px;padding:9px 22px;font-size:12px;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:6px;">
              📎 View Attachment
            </a>` : ''}
          </div>

          <!-- CSF FORM PREVIEW (iframe for printing isolation) -->
<iframe id="csfPrintFrame" style="width:100%;height:900px;border:none;display:block;"></iframe>
        </div>
        <div class="mf">
          <button class="btn b-slt" id="laVwOk">Close</button>
        </div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML('beforeend', html);

  /* Inject CSF content into iframe */
  const iframe = document.getElementById('csfPrintFrame');
  const iDoc = iframe.contentDocument || iframe.contentWindow.document;
  let _csfHtmlForDownload = '';

  const typeChecks = [
    'Vacation Leave','Mandatory/Forced Leave','Sick Leave','Maternity Leave',
    'Paternity Leave','Special Privilege Leave','Solo Parent Leave','Study Leave',
    '10-Day VAWC Leave','Rehabilitation Privilege','Special Leave Benefits for Women',
    'Special Emergency (Calamity) Leave','Adoption Leave','Others'
  ].map(t => `
    <tr>
      <td style="padding:1px 4px;font-size:9.5px;">
        ${a.leave_type === t ? '☑' : '☐'} ${t === 'Others' ? `Others: <span style="border-bottom:1px solid #333;min-width:80px;display:inline-block;">${esc(a.leave_type_other||'')}</span>` : t}
      </td>
    </tr>`).join('');

  _csfHtmlForDownload = `<!DOCTYPE html><html><head>`;

  iDoc.open();
  iDoc.write(`<!DOCTYPE html><html><head>
    <meta charset="UTF-8"/>
    <style>

body {
        font-family: Arial, sans-serif;
        font-size: 8pt;
        color: #000;
        background: #fff;
        padding: 0;
        margin: 0;
        width: 750px;
        box-sizing: border-box;
      }
@page {
        size: 8.5in 13in portrait;
        margin: 0.3in;
      }
@media print {
        body { padding: 0; }
        .no-print { display: none !important; }
        .form-wrapper { width: 100%; }
      }
     .form-wrapper, .form-wrapper * {
        background-color: #fff !important;
        background-image: none !important;
        box-shadow: none !important;
        text-shadow: none !important;
      }

      /* Outer border around whole form */
      .form-wrapper {
        border: 1pt solid #000;
        width: 100%;
      }

      table { border-collapse: collapse; width: 100%; }
      td, th {
        border: 0.5pt solid #000;
        padding: 1px 3px;
        vertical-align: top;
        font-size: 7.5pt;
      }
      .no-border td, .no-border th { border: none; }

      .center { text-align: center; }
      .bold   { font-weight: bold; }
      .upper  { text-transform: uppercase; }
      .underline { text-decoration: underline; }
      .italic { font-style: italic; }
      .small  { font-size: 8pt; }
      .tiny   { font-size: 7.5pt; }

      .field-label {
        font-size: 7.5pt;
        color: #000;
        display: block;
        margin-bottom: 1px;
      }
      .field-value {
        font-size: 9.5pt;
        font-weight: bold;
        min-height: 14px;
        display: block;
      }
      .sig-line {
        border-top: 0.5pt solid #000;
        text-align: center;
        padding-top: 2px;
        font-size: 7pt;
        margin-top: 6px;
      }
      .form-wrapper {
        border: 1pt solid #000;
        width: 100%;
        min-height: 96vh;
        display: flex;
        flex-direction: column;
      }
      .form-wrapper > table:last-of-type {
        flex: 1;
      }
      .section-title {
        font-weight: bold;
        font-size: 9pt;
        text-transform: uppercase;
        text-align: center;
        background: #fff;
        padding: 3px;
        border-bottom: 0.5pt solid #000;
      }
      .subsection-label {
        font-style: italic;
        font-size: 7pt;
        margin-bottom: 2px;
        margin-top: 5px;
        display: block;
      }
      .chk-row {
        display: flex;
        align-items: flex-start;
        gap: 3px;
        margin-bottom: 2px;
        font-size: 7pt;
        line-height: 1.3;
      }
      .chk-box {
  width: 13px;
  height: 13px;
  border: 1pt solid #000;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11pt;
  font-weight: 900;
  flex-shrink: 0;
  margin-top: 1px;
  line-height: 1;
}
.chk-box.checked { background: #fff; color: #000; border-color: #000; }
      .inline-line {
        border-bottom: 0.5pt solid #000;
        display: inline-block;
        min-width: 100px;
        padding: 0 2px;
        vertical-align: bottom;
        font-size: 9pt;
      }
      .approval-table td { padding: 3px 6px; font-size: 9pt; }
      h1.form-title {
        font-size: 10pt;
        font-weight: bold;
        text-align: center;
        text-transform: uppercase;
        padding: 2px 0;
        border-bottom: 0.5pt solid #000;
        border-top: 0.5pt solid #000;
        margin: 2px 0;
        letter-spacing: 1px;
      }
    </style>
  </head><body>

  <div class="form-wrapper">

    <!-- ══ HEADER ══ -->
    <table class="no-border" style="margin-bottom:0;border-bottom:0.5pt solid #000;">
      <tr>
        <td style="width:28%;border:none;padding:4px 6px;vertical-align:top;">
          <div class="small">Civil Service Form No. 6</div>
          <div class="small">Revised 2020</div>
        </td>
        <td style="width:44%;border:none;text-align:center;padding:4px 0;vertical-align:middle;">
          <div class="small">Republic of the Philippines</div>
          <div class="small bold">Department of Education – Schools Division of Koronadal City</div>
          <div class="tiny">Jaycee Ave. Corner Rizal St., Brgy. Zone IV, Koronadal City, South Cotabato</div>
        </td>
        <td style="width:28%;border:none;text-align:right;padding:4px 6px;vertical-align:top;">
          <div class="small bold">ANNEX A</div>
          <br/>
          <div class="tiny">STAMP OF DATE RECEIVED</div>
        </td>
      </tr>
    </table>

    <!-- ══ TITLE ══ -->
    <h1 class="form-title">Application for Leave</h1>

    <!-- ══ EMPLOYEE INFO ══ -->
    <table>
      <tr>
        <td style="width:32%;">
          <span class="field-label">1. OFFICE/SCHOOL:</span>
          <span class="field-value">${_esc(a.office_school||'')}</span>
        </td>
        <td style="width:22%;">
          <span class="field-label">2. NAME: (LAST)</span>
          <span class="field-value">${_esc(a.surname||'')}</span>
        </td>
        <td style="width:22%;">
          <span class="field-label">(FIRST)</span>
          <span class="field-value">${_esc(a.given||'')}</span>
        </td>
        <td style="width:24%;">
          <span class="field-label">(MIDDLE)</span>
          <span class="field-value">${_esc(a.middle || a.maternal || '')}</span>
        </td>
      </tr>
      <tr>
        <td>
          <span class="field-label">3. DATE OF FILING:</span>
          <span class="field-value">${_esc(a.date_of_filing||'')}</span>
        </td>
        <td colspan="2">
          <span class="field-label">4. POSITION:</span>
          <span class="field-value">${_esc(a.position||'')}</span>
        </td>
        <td>
          <span class="field-label">5. SALARY: (Monthly)</span>
          <span class="field-value">${a.salary_monthly ? '&#8369; ' + parseFloat(a.salary_monthly).toLocaleString() : ''}</span>
        </td>
      </tr>
    </table>

    <!-- ══ SECTION 6 HEADER ══ -->
    <div class="section-title">6. Details of Application</div>

    <!-- ══ 6A + 6B ══ -->
    <table>
      <tr>
        <!-- 6A: Type of Leave -->
        <td style="width:50%;vertical-align:top;padding:5px 6px;">
          <div class="bold small upper" style="margin-bottom:4px;">6. A. Type of Leave:</div>

          ${[
            ['Vacation Leave',                   'Sec. 51, Rule XVI, Omnibus Rules Implementing E.O. No. 292'],
            ['Mandatory/Forced Leave',            'Sec. 25, Rule XVI, Omnibus Rules Implementing E.O. No. 292'],
            ['Sick Leave',                        'Sec. 43, Rule XVI, Omnibus Rules Implementing E.O. No. 292'],
            ['Maternity Leave',                   'R.A. No. 11210 / IRR issued by CSC, DOLE and SSS'],
            ['Paternity Leave',                   'R.A. No. 8187 / CSC MC No. 71, s. 1998, as amended'],
            ['Special Privilege Leave',           'Sec. 21, Rule XVI, Omnibus Rules Implementing E.O. No. 292'],
            ['Solo Parent Leave',                 'R.A. No. 8972 / CSC MC No. 8, s. 2004'],
            ['Study Leave',                       'Sec. 68, Rule XVI, Omnibus Rules Implementing E.O. No. 292'],
            ['10-Day VAWC Leave',                 'R.A. No. 9262 / CSC MC No. 15, s. 2005'],
            ['Rehabilitation Privilege',          'Sec. 55, Rule XVI, Omnibus Rules Implementing E.O. No. 292'],
            ['Special Leave Benefits for Women',  'R.A. No. 9710 / CSC MC No. 25, s. 2010'],
            ['Special Emergency (Calamity) Leave','CSC MC No. 2, s. 2012, as amended'],
            ['Adoption Leave',                    'R.A. No. 8552'],
          ].map(([type, cite]) => `
            <div class="chk-row">
              <div class="chk-box ${a.leave_type === type ? 'checked' : ''}">
                ${a.leave_type === type ? '&#10003;' : ''}
              </div>
              <div>
                <span style="font-size:8.5pt;">${type}</span>
                <span class="tiny" style="color:#333;display:block;">(${cite})</span>
              </div>
            </div>`).join('')}

          <div class="chk-row" style="margin-top:2px;">
            <div class="chk-box ${a.leave_type === 'Others' ? 'checked' : ''}">
              ${a.leave_type === 'Others' ? '&#10003;' : ''}
            </div>
            <div style="font-size:8.5pt;">
              Others:
              <span class="inline-line" style="min-width:80px;">
                ${a.leave_type === 'Others' ? _esc(a.leave_type_other||'') : ''}
              </span>
            </div>
          </div>
        </td>

        <!-- 6B: Details of Leave -->
        <td style="width:50%;vertical-align:top;padding:8px 8px;">
          <div class="bold small upper" style="margin-bottom:6px;">6. B. Details of Leave:</div>

          <span class="subsection-label">In case of vacation/ Special Leave:</span>
          <div class="chk-row">
            <div class="chk-box ${a.vacation_detail==='Within the Philippines'?'checked':''}">
              ${a.vacation_detail==='Within the Philippines'?'&#10003;':''}
            </div>
            <span>Within the Philippines</span>
          </div>
          <div class="chk-row" style="margin-bottom:8px;">
            <div class="chk-box ${a.vacation_detail==='Abroad'?'checked':''}">
              ${a.vacation_detail==='Abroad'?'&#10003;':''}
            </div>
            <span>Abroad (Specify) <span class="inline-line">${_esc(a.vacation_abroad_specify||'')}</span></span>
          </div>

          <span class="subsection-label">In case of Sick Leave:</span>
          <div class="chk-row">
            <div class="chk-box ${a.sick_detail==='In Hospital'?'checked':''}">
              ${a.sick_detail==='In Hospital'?'&#10003;':''}
            </div>
            <span>In Hospital (Specify Illness) <span class="inline-line">${a.sick_detail==='In Hospital'?_esc(a.sick_specify||''):''}</span></span>
          </div>
          <div class="chk-row" style="margin-bottom:8px;">
            <div class="chk-box ${a.sick_detail==='Out Patient'?'checked':''}">
              ${a.sick_detail==='Out Patient'?'&#10003;':''}
            </div>
            <span>Out Patient (Specify Illness) <span class="inline-line">${a.sick_detail==='Out Patient'?_esc(a.sick_specify||''):''}</span></span>
          </div>

          <span class="subsection-label">In case of Special Leave Benefits for Women:</span>
          <div style="font-size:8.5pt;margin-bottom:8px;">
            (Specify Illness) <span class="inline-line">${_esc(a.women_specify||'')}</span>
          </div>

          <span class="subsection-label">In case of Study Leave:</span>
          <div class="chk-row">
            <div class="chk-box ${a.study_detail==="Completion of Master's Degree"?'checked':''}">
              ${a.study_detail==="Completion of Master's Degree"?'&#10003;':''}
            </div>
            <span>Completion of Master's Degree</span>
          </div>
          <div class="chk-row" style="margin-bottom:8px;">
            <div class="chk-box ${a.study_detail==='Bar/Board Examination Review'?'checked':''}">
              ${a.study_detail==='Bar/Board Examination Review'?'&#10003;':''}
            </div>
            <span>Bar/ Board Examination Review</span>
          </div>

          <span class="subsection-label">Other purpose:</span>
          <div class="chk-row">
            <div class="chk-box ${a.other_purpose==='Monetization of Leave Credits'?'checked':''}">
              ${a.other_purpose==='Monetization of Leave Credits'?'&#10003;':''}
            </div>
            <span>Monetization of Leave Credits</span>
          </div>
          <div class="chk-row">
            <div class="chk-box ${a.other_purpose==='Termination Leave'?'checked':''}">
              ${a.other_purpose==='Termination Leave'?'&#10003;':''}
            </div>
            <span>Termination Leave</span>
          </div>
        </td>
      </tr>
    </table>

    <!-- ══ 6C + 6D ══ -->
    <table>
      <tr>
        <td style="width:50%;padding:8px 8px;vertical-align:top;">
          <div class="bold small upper" style="margin-bottom:8px;">
            6. C. Number of Working Days Applied For
          </div>
          <div style="margin:8px 0 6px 4px;">
            <span style="font-size:9.5pt;font-weight:bold;border-bottom:0.5pt solid #000;display:inline-block;min-width:120px;padding:0 4px;">
              ${(() => { const n = parseFloat(a.num_working_days); return isNaN(n) ? (a.num_working_days || '') : (n % 1 === 0 ? String(Math.round(n)) : n.toFixed(1)); })()}
            </span>
          </div>
          <div class="small" style="margin-top:10px;font-style:italic;">Inclusive Dates</div>
          <div style="margin-top:5px;">
            <span style="font-size:9.5pt;font-weight:bold;border-bottom:0.5pt solid #000;display:inline-block;min-width:180px;padding:0 4px;">
              ${_esc(a.inclusive_dates||'')}
            </span>
          </div>
        </td>
        <td style="width:50%;padding:8px 8px;vertical-align:top;">
          <div class="bold small upper" style="margin-bottom:8px;">6. D. Commutation</div>
          <div class="chk-row" style="margin-bottom:6px;">
            <div class="chk-box ${(a.commutation||'Not Requested')==='Not Requested'?'checked':''}">
              ${(a.commutation||'Not Requested')==='Not Requested'?'&#10003;':''}
            </div>
            <span>Not Requested</span>
          </div>
          <div class="chk-row" style="margin-bottom:6px;">
            <div class="chk-box ${a.commutation==='Requested'?'checked':''}">
              ${a.commutation==='Requested'?'&#10003;':''}
            </div>
            <span>Requested</span>
          </div>
          <div class="sig-line" style="margin-top:50px;">(Signature of Applicant)</div>
        </td>
      </tr>
    </table>

    <!-- ══ SECTION 7 HEADER ══ -->
    <div class="section-title">7. Details of Action on Application</div>

    <!-- ══ 7A + 7B ══ -->
    <table>
      <tr>
        <td style="width:50%;padding:5px 6px;vertical-align:top;">
          <div class="bold small upper" style="margin-bottom:3px;">7. A. Certification of Leave Credits</div>
          <div class="small" style="margin-bottom:3px;">
            As of <span class="inline-line" style="min-width:120px;">&nbsp;</span>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;margin-top:4px;">
            <table class="approval-table" style="width:auto;">
              <tr>
                <th style="width:130px;background:#fff;">&nbsp;</th>
              <th style="width:80px;text-align:center;background:#fff;">Vacation Leave</th>
              <th style="width:70px;text-align:center;background:#fff;">Sick Leave</th>
              </tr>
              <tr>
                <td>Total Earned</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>Less this application</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>Balance</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
            </table>
            <div style="text-align:center;margin-top:60px;">
              <div class="bold" style="font-size:8.5pt;">FAIZAL B. MACASAYON</div>
              <div class="small">Administrative Officer IV/ HRMO</div>
            </div>
          </div>
        </td>
        <td style="width:50%;padding:5px 6px;vertical-align:top;">
          <div class="bold small upper" style="margin-bottom:6px;">7. B. Recommendation</div>
          <div class="chk-row">
            <div class="chk-box">&#9633;</div>
            <span>For Approval</span>
          </div>
          <div class="chk-row" style="margin-bottom:4px;">
            <div class="chk-box">&#9633;</div>
            <span>For Disapproval due to
              <span class="inline-line" style="min-width:130px;">&nbsp;</span>
            </span>
          </div>
          <div style="margin-left:16px;">
            <span class="inline-line" style="min-width:200px;display:block;margin-bottom:4px;">&nbsp;</span>
            <span class="inline-line" style="min-width:200px;display:block;">&nbsp;</span>
          </div>
          <div class="sig-line" style="margin-top:70px;">(Authorized Officer)</div>
        </td>
      </tr>
    </table>

    <!-- ══ 7C + 7D + NERISSA ══ -->
    <table style="border-collapse:collapse;">
      <tr>
        <td style="width:50%;padding:5px 6px;vertical-align:top;border-right:none;border-bottom:none;border-top:0.5pt solid #000;">
          <div class="bold small upper" style="margin-bottom:4px;">7. C. Approved For:</div>
          <table style="border:none;margin-top:4px;">
  <tr><td style="border:none;padding:3px 0;font-size:9pt;">
    <span class="inline-line" style="min-width:28px;display:inline-block;">&nbsp;</span>
    &nbsp;Day/s with pay
  </td></tr>
  <tr><td style="border:none;padding:3px 0;font-size:9pt;">
    <span class="inline-line" style="min-width:28px;display:inline-block;">&nbsp;</span>
    &nbsp;Day/s without pay
  </td></tr>
  <tr><td style="border:none;padding:3px 0;font-size:9pt;">
    <span class="inline-line" style="min-width:28px;display:inline-block;">&nbsp;</span>
    &nbsp;Others (Specify)
  </td></tr>
</table>
        </td>
        <td style="width:50%;padding:5px 6px;vertical-align:top;border-left:none;border-bottom:none;border-top:0.5pt solid #000;">
          <div class="bold small upper" style="margin-bottom:4px;">7. D. Disapproved Due To:</div>
          <div>
            <span class="inline-line" style="min-width:220px;display:block;margin-bottom:12px;">&nbsp;</span>
            <span class="inline-line" style="min-width:220px;display:block;margin-bottom:12px;">&nbsp;</span>
            <span class="inline-line" style="min-width:220px;display:block;">&nbsp;</span>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="text-align:center;padding:65px 6px 23px;border-top:0.5pt solid #000;border-left:none;border-right:none;">
          <div class="bold underline" style="font-size:11pt;letter-spacing:0.3px;">NERISSA A. ALFAFARA, CESO VI</div>
          <div style="font-size:8pt;">Assistant Schools Division Superintendent</div>
        </td>
      </tr>
    </table>

  </div><!-- /.form-wrapper -->

  </body></html>`);
  iDoc.close();

  /* Capture the rendered HTML for download */
  const _csfHtmlStr = '<!DOCTYPE html><html>' + iDoc.documentElement.outerHTML + '</html>';

  const close = () => document.getElementById('laViewMo')?.remove();
  document.getElementById('laVwClose')?.addEventListener('click', close);
  document.getElementById('laVwOk')?.addEventListener('click',    close);

document.getElementById('csfDownloadBtn')?.addEventListener('click', async () => {
    const btn = document.getElementById('csfDownloadBtn');
    const frameEl = document.getElementById('csfPrintFrame');
    if (!frameEl) { alert('Form not loaded yet.'); return; }
    const iDoc = frameEl.contentDocument || frameEl.contentWindow.document;
    if (!iDoc) { alert('Could not access form.'); return; }

    btn.disabled = true;
    btn.textContent = '⏳ Generating PDF…';

    const name = ('CSF6_' + (a.surname || '') + '_' + (a.given || '') + '_' + (a.date_of_filing || 'leave'))
      .replace(/\s+/g, '_') + '.pdf';

    /* Load libraries if not already loaded */
    async function loadScript(src) {
      if (document.querySelector(`script[src="${src}"]`)) return;
      return new Promise((res, rej) => {
        const s = document.createElement('script');
        s.src = src; s.onload = res; s.onerror = rej;
        document.head.appendChild(s);
      });
    }

    try {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');

      const formEl = iDoc.querySelector('.form-wrapper') || iDoc.body;

      const canvas = await html2canvas(formEl, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        windowWidth: formEl.scrollWidth,
        windowHeight: formEl.scrollHeight,
      });

      const { jsPDF } = window.jspdf;
      /* Folio: 8.5 x 13 inches */
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'in', format: [8.5, 13] });

      const pageW = 8.5;
      const pageH = 13;
      const margin = 0.3;
      const contentW = pageW - margin * 2;
      const contentH = pageH - margin * 2;

      const imgW = canvas.width;
      const imgH = canvas.height;
      const ratio = imgW / imgH;

      let drawW = contentW;
      let drawH = drawW / ratio;

      if (drawH > contentH) {
        drawH = contentH;
        drawW = drawH * ratio;
      }

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      pdf.addImage(imgData, 'JPEG', margin, margin, drawW, drawH);
      pdf.save(name);

    } catch (err) {
      alert('PDF generation failed: ' + err.message);
    } finally {
      btn.disabled = false;
      btn.textContent = '🖨 Save as PDF';
    }
  });
}

/* ══════════════════════════════════════════════════════════════
   REPLACE these two functions in leave-application.js
   1. injectLeaveApplicationSection
   2. renderEmpSubmissionsPage
   ══════════════════════════════════════════════════════════════ */

/* ── CSS injection for the new layout ── */
(function injectEmpSubmissionsCSS() {
  if (document.getElementById('emp-subs-v4-css')) return;
  const s = document.createElement('style');
  s.id = 'emp-subs-v4-css';
  s.textContent = `
/* ── SUBMISSIONS SHELL ──────────────────── */
.es-shell {
  display: flex;
  min-height: 600px;
  border-radius: 18px;
  border: 1.5px solid #e8d0d0;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 4px 24px rgba(139,26,26,.08);
  margin: 28px 0 0;
  font-family: 'DM Sans', sans-serif;
}

/* ── SIDEBAR ────────────────────────────── */
.es-sidebar {
  width: 200px;
  min-width: 200px;
  background: linear-gradient(180deg, #5a0f16 0%, #8b1a1a 60%, #9b1c1c 100%);
  display: flex;
  flex-direction: column;
  padding: 0;
  flex-shrink: 0;
}
.es-sidebar-header {
  padding: 20px 18px 16px;
  border-bottom: 1px solid rgba(255,255,255,.1);
}
.es-sidebar-eyebrow {
  font-size: 8.5px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255,200,200,.55);
  margin-bottom: 4px;
}
.es-sidebar-title {
  font-family: 'Playfair Display', serif;
  font-size: 14px;
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
}
.es-sidebar-nav {
  flex: 1;
  padding: 12px 0;
}
.es-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 18px;
  cursor: pointer;
  border: none;
  background: transparent;
  color: rgba(255,210,210,.65);
  font-size: 12px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  width: 100%;
  text-align: left;
  transition: background .15s, color .15s;
  position: relative;
  border-left: 3px solid transparent;
}
.es-nav-item:hover {
  background: rgba(255,255,255,.08);
  color: #fff;
}
.es-nav-item.active {
  background: rgba(255,255,255,.14);
  color: #fff;
  border-left-color: #fcd34d;
}
.es-nav-item-icon {
  font-size: 14px;
  flex-shrink: 0;
}
.es-nav-item-label { flex: 1; }
.es-nav-item-badge {
  font-size: 9px;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 20px;
  min-width: 20px;
  text-align: center;
}
.es-badge-pending  { background: #fef3c7; color: #92400e; }
.es-badge-accepted { background: #d1fae5; color: #065f46; }
.es-badge-rejected { background: #fee2e2; color: #991b1b; }
.es-badge-recorded { background: #dbeafe; color: #1e3a6e; }

.es-sidebar-apply {
  padding: 16px;
  border-top: 1px solid rgba(255,255,255,.1);
}
.es-apply-btn {
  width: 100%;
  padding: 10px 14px;
  background: rgba(255,255,255,.15);
  border: 1.5px solid rgba(255,255,255,.25);
  border-radius: 10px;
  color: #fff;
  font-size: 11.5px;
  font-weight: 700;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: background .2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.es-apply-btn:hover { background: rgba(255,255,255,.25); }

/* ── CONTENT AREA ───────────────────────── */
.es-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.es-content-header {
  padding: 20px 24px 16px;
  border-bottom: 1.5px solid #f0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-shrink: 0;
}
.es-content-title {
  font-size: 15px;
  font-weight: 800;
  color: #1a1a2e;
}
.es-content-subtitle {
  font-size: 11px;
  color: #9a8a8a;
  margin-top: 2px;
}
.es-content-list {
  flex: 1;
  padding: 16px 20px;
  overflow-y: auto;
}
.es-content-list.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── APP CARDS ──────────────────────────── */
.es-app-card {
  background: #fff;
  border: 1.5px solid #eee;
  border-radius: 14px;
  padding: 16px 18px;
  margin-bottom: 10px;
  transition: box-shadow .2s, border-color .2s;
}
.es-app-card:hover {
  box-shadow: 0 4px 16px rgba(139,26,26,.09);
  border-color: #e0c0c0;
}
.es-app-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.es-app-card-type {
  font-size: 13.5px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 3px;
}
.es-app-card-meta {
  font-size: 11px;
  color: #7a8a9d;
  line-height: 1.6;
}
.es-status-pill {
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: .8px;
  text-transform: uppercase;
  padding: 4px 11px;
  border-radius: 20px;
  white-space: nowrap;
  flex-shrink: 0;
}
.es-status-pending  { background: #fef3c7; color: #92400e; border: 1px solid #fcd34d; }
.es-status-accepted { background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; }
.es-status-rejected { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }

.es-rejection-box {
  background: #fff5f5;
  border-left: 3px solid #fca5a5;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 11.5px;
  color: #991b1b;
  margin-bottom: 10px;
}
.es-accepted-box {
  background: #f0fdf8;
  border-left: 3px solid #6ee7b7;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 11.5px;
  color: #065f46;
  margin-bottom: 10px;
}
.es-app-card-actions {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
}
.es-action-btn {
  font-size: 11px;
  font-weight: 700;
  padding: 6px 13px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: opacity .15s, transform .15s;
}
.es-action-btn:hover { transform: translateY(-1px); }
.es-action-view   { background: #ede9fe; color: #4c1d95; border: 1px solid #c4b5fd; }
.es-action-print  { background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; }
.es-action-edit   { background: #fef3c7; color: #92400e; border: 1px solid #fcd34d; }
.es-action-delete { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }

/* ── RECORDED CARDS ─────────────────────── */
.es-recorded-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #dbeafe;
  color: #1e3a6e;
  border: 1px solid #93c5fd;
  border-radius: 8px;
  padding: 4px 12px;
  font-size: 10.5px;
  font-weight: 700;
  margin-bottom: 10px;
}

/* ── EMPTY STATE ────────────────────────── */
.es-empty {
  text-align: center;
  padding: 40px 20px;
  color: #9a8a8a;
}
.es-empty-icon { font-size: 36px; margin-bottom: 10px; }
.es-empty-text { font-size: 13px; }

/* ── RESPONSIVE ─────────────────────────── */
@media (max-width: 768px) {
  .es-shell { flex-direction: column; border-radius: 14px; }
  .es-sidebar { width: 100%; min-width: unset; border-radius: 14px 14px 0 0; }
  .es-sidebar-header { padding: 14px 16px 12px; }
  .es-sidebar-nav { display: flex; flex-direction: row; padding: 6px 8px; gap: 3px; overflow-x: auto; flex-wrap: nowrap; }
  .es-nav-item { flex-direction: column; padding: 8px 6px; gap: 3px; border-left: none; border-bottom: 3px solid transparent; min-width: 65px; flex: 1; text-align: center; align-items: center; border-radius: 8px; }
  .es-nav-item.active { border-left-color: transparent; border-bottom-color: #fcd34d; background: rgba(255,255,255,.18); }
  .es-nav-item-label { font-size: 9.5px; }
  .es-nav-item-badge { font-size: 8.5px; padding: 1px 5px; }
  .es-sidebar-apply { padding: 10px 12px; }
  .es-content-header { padding: 14px 16px 12px; }
  .es-content-list { padding: 12px 14px; }
.es-app-card { padding: 13px 14px; }
}

@media print {
  .es-shell { display: none !important; }
}
  `;
  document.head.appendChild(s);
})();


/* ══════════════════════════════════════════════════════════════
   injectLeaveApplicationSection
   Mounted on the employee's leave card page (empLeaveAppMount)
   ══════════════════════════════════════════════════════════════ */
async function injectLeaveApplicationSection(emp) {
  const mount = document.getElementById('empLeaveAppMount');
  if (!mount) return;

  const apiCall = window.apiCall;
  if (!apiCall) return;

  const esc = window.escHtml || (s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'));

  const res  = await apiCall('get_my_leave_applications', {}, 'GET');
  const apps = (res.ok ? res.applications : []) || [];

  const counts = {
    pending:  apps.filter(a => a.status === 'pending').length,
    accepted: apps.filter(a => a.status === 'accepted').length,
    rejected: apps.filter(a => a.status === 'rejected').length,
    recorded: 0,
  };

  /* Load recorded count */
  const recRes = await apiCall('get_my_recorded_applications', {}, 'GET');
  const recApps = (recRes.ok ? recRes.applications : []) || [];
  counts.recorded = recApps.length;

  let currentTab = 'pending';

  /* ── Build shell ── */
  mount.innerHTML = `
    <div class="es-shell" id="esShell">
      <div class="es-sidebar">
        <div class="es-sidebar-header">
          <div class="es-sidebar-eyebrow">Civil Service Form No. 6</div>
          <div class="es-sidebar-title">My Leave Applications</div>
        </div>
        <nav class="es-sidebar-nav" id="esNav">
          <button class="es-nav-item active" data-tab="pending">
            <span class="es-nav-item-icon">⏳</span>
            <span class="es-nav-item-label">Pending</span>
            <span class="es-nav-item-badge es-badge-pending" id="esBadgePending">${counts.pending}</span>
          </button>
          <button class="es-nav-item" data-tab="accepted">
            <span class="es-nav-item-icon">✅</span>
            <span class="es-nav-item-label">Accepted</span>
            <span class="es-nav-item-badge es-badge-accepted" id="esBadgeAccepted">${counts.accepted}</span>
          </button>
          <button class="es-nav-item" data-tab="rejected">
            <span class="es-nav-item-icon">❌</span>
            <span class="es-nav-item-label">Rejected</span>
            <span class="es-nav-item-badge es-badge-rejected" id="esBadgeRejected">${counts.rejected}</span>
          </button>
          <button class="es-nav-item" data-tab="recorded">
            <span class="es-nav-item-icon">📁</span>
            <span class="es-nav-item-label">Recorded</span>
            <span class="es-nav-item-badge es-badge-recorded" id="esBadgeRecorded">${counts.recorded}</span>
          </button>
        </nav>
        <div class="es-sidebar-apply">
          <button class="es-apply-btn" id="esApplyBtn">
            📋 Apply for Leave
          </button>
        </div>
      </div>
      <div class="es-content">
        <div class="es-content-header">
          <div>
            <div class="es-content-title" id="esContentTitle">Pending Applications</div>
            <div class="es-content-subtitle" id="esContentSub">Applications awaiting review</div>
          </div>
        </div>
        <div class="es-content-list" id="esContentList"></div>
      </div>
    </div>`;

  /* ── Tab metadata ── */
  const TAB_META = {
    pending:  { title: 'Pending Applications',  sub: 'Applications awaiting review' },
    accepted: { title: 'Accepted Applications', sub: 'Approved leave applications' },
    rejected: { title: 'Rejected Applications', sub: 'Applications requiring correction' },
    recorded: { title: 'Recorded Applications', sub: 'Officially recorded in the leave card' },
  };

  /* ── Render tab ── */
  function renderTab(tab) {
    currentTab = tab;

    /* Update nav active state */
    mount.querySelectorAll('.es-nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    /* Update header */
    const meta = TAB_META[tab];
    const titleEl = mount.querySelector('#esContentTitle');
    const subEl   = mount.querySelector('#esContentSub');
    if (titleEl) titleEl.textContent = meta.title;
    if (subEl)   subEl.textContent   = meta.sub;

    const list = mount.querySelector('#esContentList');
    if (!list) return;

    if (tab === 'recorded') {
      _esRenderRecorded(recApps, list, esc, emp);
      return;
    }

    const filtered = apps.filter(a => a.status === tab);
    _esRenderApplications(filtered, tab, list, esc, emp, apiCall, apps, renderTab);
  }

  /* ── Wire nav ── */
  mount.querySelectorAll('.es-nav-item').forEach(btn => {
    btn.addEventListener('click', () => renderTab(btn.dataset.tab));
  });

  mount.querySelector('#esApplyBtn')?.addEventListener('click', () => {
    if (typeof showLeaveApplicationModal === 'function') showLeaveApplicationModal(emp, null);
  });

  /* ── Default tab ── */
  renderTab('pending');
}
window.injectLeaveApplicationSection = injectLeaveApplicationSection;


/* ── Render application cards ── */
function _esRenderApplications(filtered, tab, list, esc, emp, apiCall, allApps, renderTab) {
  const icons = { pending: '📭', accepted: '✅', rejected: '❌' };

  if (filtered.length === 0) {
    list.classList.add('empty-state');
    list.innerHTML = `
      <div class="es-empty">
        <div class="es-empty-icon">${icons[tab] || '📂'}</div>
        <div class="es-empty-text">No ${tab} applications yet.</div>
      </div>`;
    return;
  }

  list.classList.remove('empty-state');
  list.innerHTML = filtered.map(a => {
    const lbl = a.leave_type === 'Others' && a.leave_type_other
      ? `Others: ${esc(a.leave_type_other)}` : esc(a.leave_type || '—');

    return `
      <div class="es-app-card">
        <div class="es-app-card-top">
          <div>
            <div class="es-app-card-type">${lbl}</div>
            <div class="es-app-card-meta">
              📅 ${esc(a.inclusive_dates || '—')} &nbsp;·&nbsp; ${a.num_working_days || '—'} day(s)<br>
              Filed: ${a.date_of_filing || '—'} &nbsp;·&nbsp; ${esc(a.office_school || '')}
            </div>
          </div>
          <span class="es-status-pill es-status-${tab}">${tab.toUpperCase()}</span>
        </div>

        ${tab === 'rejected' && a.rejection_reason ? `
          <div class="es-rejection-box">❌ ${esc(a.rejection_reason)}</div>` : ''}

        ${tab === 'accepted' && a.reviewed_by ? `
          <div class="es-accepted-box">✅ Accepted by ${esc(a.reviewed_by)}</div>` : ''}

        <div class="es-app-card-actions">
          <button class="es-action-btn es-action-view" data-view="${a.id}">🔍 View</button>
          ${tab === 'accepted'
            ? `<button class="es-action-btn es-action-print" data-print="${a.id}">🖨 Print CSF No. 6</button>` : ''}
          ${tab === 'rejected'
            ? `<button class="es-action-btn es-action-edit" data-edit="${a.id}">✏ Edit & Resubmit</button>` : ''}
          ${tab !== 'accepted'
            ? `<button class="es-action-btn es-action-delete" data-delete="${a.id}">🗑 Delete</button>` : ''}
        </div>
      </div>`;
  }).join('');

  /* Wire buttons */
  list.querySelectorAll('[data-view]').forEach(btn => {
    const app = allApps.find(a => a.id === +btn.dataset.view);
    if (app && typeof _laViewCSFModal === 'function') {
      btn.addEventListener('click', () => _laViewCSFModal(app, esc));
    }
  });
  list.querySelectorAll('[data-print]').forEach(btn => {
    const app = allApps.find(a => a.id === +btn.dataset.print);
    if (app && typeof _laViewCSFModal === 'function') {
      btn.addEventListener('click', () => {
        _laViewCSFModal(app, esc);
        setTimeout(() => document.getElementById('csfPrintFrame')?.contentWindow?.print(), 800);
      });
    }
  });
  list.querySelectorAll('[data-edit]').forEach(btn => {
    const app = allApps.find(a => a.id === +btn.dataset.edit);
    if (app && typeof showLeaveApplicationModal === 'function') {
      btn.addEventListener('click', () => showLeaveApplicationModal(emp, app));
    }
  });
  list.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Delete this application?')) return;
      const r = await apiCall('delete_leave_application', { app_id: +btn.dataset.delete });
      if (r.ok) injectLeaveApplicationSection(emp);
      else alert(r.error || 'Delete failed.');
    });
  });
}


/* ── Render recorded cards ── */
function _esRenderRecorded(recApps, list, esc, emp) {
  if (recApps.length === 0) {
    list.classList.add('empty-state');
    list.innerHTML = `
      <div class="es-empty">
        <div class="es-empty-icon">📁</div>
        <div class="es-empty-text">No recorded applications yet.</div>
      </div>`;
    return;
  }

  list.classList.remove('empty-state');
  list.innerHTML = recApps.map(a => {
    const lbl = a.leave_type === 'Others' && a.leave_type_other
      ? `Others: ${esc(a.leave_type_other)}` : esc(a.leave_type || '—');

    let recDate = '—';
    if (a.recorded_at) {
      try {
        recDate = new Date(a.recorded_at).toLocaleDateString('en-PH', {
          month: 'long', day: 'numeric', year: 'numeric'
        });
      } catch(e) { recDate = String(a.recorded_at).slice(0, 10); }
    }

    return `
      <div class="es-app-card">
        <div class="es-app-card-top">
          <div>
            <div class="es-app-card-type">${lbl}</div>
            <div class="es-app-card-meta">
              📅 ${esc(a.inclusive_dates || '—')} &nbsp;·&nbsp; ${a.num_working_days || '—'} day(s)<br>
              Filed: ${a.date_of_filing || '—'}
            </div>
          </div>
        </div>
        <div class="es-recorded-badge">📁 Recorded on ${recDate}</div>
        <div class="es-app-card-actions">
          <button class="es-action-btn es-action-view" data-view-rec="${a.id}">🔍 View CSF No. 6</button>
          <button class="es-action-btn es-action-print" data-print-rec="${a.id}">🖨 Print</button>
        </div>
      </div>`;
  }).join('');

  list.querySelectorAll('[data-view-rec]').forEach(btn => {
    const app = recApps.find(a => String(a.id) === String(btn.dataset.viewRec));
    if (app && typeof _laViewCSFModal === 'function') {
      btn.addEventListener('click', () => _laViewCSFModal(app, esc));
    }
  });
  list.querySelectorAll('[data-print-rec]').forEach(btn => {
    const app = recApps.find(a => String(a.id) === String(btn.dataset.printRec));
    if (app && typeof _laViewCSFModal === 'function') {
      btn.addEventListener('click', () => {
        _laViewCSFModal(app, esc);
        setTimeout(() => document.getElementById('csfPrintFrame')?.contentWindow?.print(), 800);
      });
    }
  });
}


/* ══════════════════════════════════════════════════════════════
   renderEmpSubmissionsPage
   Full-page view accessed via hamburger sidebar
   ══════════════════════════════════════════════════════════════ */
async function renderEmpSubmissionsPage(emp) {
  let pg = document.getElementById('pg-emp-submissions');
  if (!pg) {
    pg = document.createElement('div');
    pg.id        = 'pg-emp-submissions';
    pg.className = 'page';
    (document.getElementById('s-app') || document.body).appendChild(pg);
  }

  document.querySelectorAll('.page').forEach(p => p.classList.remove('on'));
  pg.classList.add('on');
  window.scrollTo(0, 0);

  const esc = window.escHtml || (s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'));

  pg.innerHTML = `
    <div style="max-width:100%;margin:0;padding-bottom:80px;font-family:'DM Sans','Inter',sans-serif;">
      <div style="background:linear-gradient(135deg,#5a0f16 0%,#8b1a1a 55%,#b02020 100%);
                  color:#fff;padding:18px 28px;position:sticky;top:0;z-index:200;
                  box-shadow:0 3px 20px rgba(90,15,22,.45);">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;">
          <button id="empSubBackBtn"
            style="background:rgba(255,255,255,.14);color:#fff;border:1.5px solid rgba(255,255,255,.3);
                   border-radius:9px;padding:8px 18px;font-size:12px;font-weight:700;cursor:pointer;
                   font-family:'DM Sans',sans-serif;">← My Leave Card</button>
          <div style="text-align:center;flex:1;">
            <div style="font-size:9px;letter-spacing:2.5px;text-transform:uppercase;opacity:.65;margin-bottom:3px;">Civil Service Form No. 6</div>
            <div style="font-family:'Playfair Display',Georgia,serif;font-size:1.2rem;font-weight:800;">My Leave Applications</div>
            <div style="font-size:10.5px;opacity:.7;margin-top:2px;">SDO Koronadal City &nbsp;·&nbsp; ${esc(emp?.school || 'Schools Division Office')}</div>
          </div>
          <button id="empSubApplyBtn2"
            style="background:rgba(255,255,255,.14);color:#fff;border:1.5px solid rgba(255,255,255,.3);
                   border-radius:9px;padding:8px 18px;font-size:12px;font-weight:700;cursor:pointer;
                   white-space:nowrap;font-family:'DM Sans',sans-serif;">📋 Apply for Leave</button>
        </div>
      </div>
      <div style="padding:20px 24px;">
        <div id="empSubPageMount"></div>
      </div>
    </div>`;

  document.getElementById('empSubBackBtn')?.addEventListener('click', () => {
    pg.classList.remove('on');
    document.getElementById('pg-user')?.classList.add('on');
  });
  document.getElementById('empSubApplyBtn2')?.addEventListener('click', () => {
    if (typeof showLeaveApplicationModal === 'function') showLeaveApplicationModal(emp, null);
  });

  /* Reuse injectLeaveApplicationSection but target new mount */
  const apiCall = window.apiCall;
  if (!apiCall) return;

  const res     = await apiCall('get_my_leave_applications', {}, 'GET');
  const apps    = (res.ok ? res.applications : []) || [];
  const recRes  = await apiCall('get_my_recorded_applications', {}, 'GET');
  const recApps = (recRes.ok ? recRes.applications : []) || [];

  const counts = {
    pending:  apps.filter(a => a.status === 'pending').length,
    accepted: apps.filter(a => a.status === 'accepted').length,
    rejected: apps.filter(a => a.status === 'rejected').length,
    recorded: recApps.length,
  };

  const mount = document.getElementById('empSubPageMount');
  if (!mount) return;

  mount.innerHTML = `
    <div style="display:flex;gap:0;border-bottom:2px solid #f0e0e0;background:#fdf8f8;border-radius:12px 12px 0 0;overflow:hidden;">
      <button class="es-flat-tab active" data-tab2="pending" style="flex:1;padding:13px 8px;font-size:11.5px;font-weight:800;letter-spacing:.4px;text-transform:uppercase;border:none;cursor:pointer;background:linear-gradient(135deg,#8b1a1a,#c83030);color:#fff;font-family:'DM Sans',sans-serif;transition:all .2s;">
        ⏳ Pending <span style="background:rgba(255,255,255,.25);border-radius:20px;padding:1px 8px;margin-left:4px;">${counts.pending}</span>
      </button>
      <button class="es-flat-tab" data-tab2="accepted" style="flex:1;padding:13px 8px;font-size:11.5px;font-weight:800;letter-spacing:.4px;text-transform:uppercase;border:none;border-left:1px solid #f0e0e0;cursor:pointer;background:#fff;color:#7a8a9d;font-family:'DM Sans',sans-serif;transition:all .2s;">
        ✅ Accepted <span style="background:#d1fae5;color:#065f46;border-radius:20px;padding:1px 8px;margin-left:4px;">${counts.accepted}</span>
      </button>
      <button class="es-flat-tab" data-tab2="rejected" style="flex:1;padding:13px 8px;font-size:11.5px;font-weight:800;letter-spacing:.4px;text-transform:uppercase;border:none;border-left:1px solid #f0e0e0;cursor:pointer;background:#fff;color:#7a8a9d;font-family:'DM Sans',sans-serif;transition:all .2s;">
        ❌ Rejected <span style="background:#fee2e2;color:#991b1b;border-radius:20px;padding:1px 8px;margin-left:4px;">${counts.rejected}</span>
      </button>
      <button class="es-flat-tab" data-tab2="recorded" style="flex:1;padding:13px 8px;font-size:11.5px;font-weight:800;letter-spacing:.4px;text-transform:uppercase;border:none;border-left:1px solid #f0e0e0;cursor:pointer;background:#fff;color:#7a8a9d;font-family:'DM Sans',sans-serif;transition:all .2s;">
        📁 Recorded <span style="background:#dbeafe;color:#1e3a6e;border-radius:20px;padding:1px 8px;margin-left:4px;">${counts.recorded}</span>
      </button>
    </div>
    <div id="esContentList2" style="padding:20px;min-height:400px;background:#fff;border-radius:0 0 12px 12px;border:1.5px solid #e8d0d0;border-top:none;"></div>`;

  const TAB_META = {
    pending:  { title: 'Pending Applications',  sub: 'Applications awaiting review' },
    accepted: { title: 'Accepted Applications', sub: 'Approved leave applications' },
    rejected: { title: 'Rejected Applications', sub: 'Applications requiring correction' },
    recorded: { title: 'Recorded Applications', sub: 'Officially recorded in the leave card' },
  };

  function renderTab2(tab) {
    mount.querySelectorAll('.es-nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab2 === tab);
    });
    const meta  = TAB_META[tab];
    const title = mount.querySelector('#esContentTitle2');
    const sub   = mount.querySelector('#esContentSub2');
    if (title) title.textContent = meta.title;
    if (sub)   sub.textContent   = meta.sub;

    const list = document.getElementById('esContentList2');
    if (!list) return;

    if (tab === 'recorded') {
      _esRenderRecorded(recApps, list, esc, emp);
      return;
    }

    const filtered = apps.filter(a => a.status === tab);
    _esRenderApplications(filtered, tab, list, esc, emp, apiCall, apps, renderTab2);
  }

  mount.querySelectorAll('.es-flat-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      mount.querySelectorAll('.es-flat-tab').forEach(b => {
        b.style.background = '#fff';
        b.style.color = '#7a8a9d';
      });
      btn.style.background = 'linear-gradient(135deg,#8b1a1a,#c83030)';
      btn.style.color = '#fff';
      renderTab2(btn.dataset.tab2);
    });
  });

  renderTab2('pending');
}
window.renderEmpSubmissionsPage = renderEmpSubmissionsPage;

/* ── EXPORTS ─────────────────────────────────────────────────── */
window.showLeaveApplicationModal     = showLeaveApplicationModal;
window.injectLeaveApplicationSection = injectLeaveApplicationSection;
window._laViewCSFModal               = _laViewCSFModal;

})();
