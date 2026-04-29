<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="csrf-token" content="{{ csrf_token() }}"/>
  <title>SDO Koronadal City – Leave Card System</title>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Rajdhani:wght@500;600;700&family=Barlow+Condensed:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>

  <!-- App Stylesheets -->
  <link rel="stylesheet" href="{{ asset('css/app.css') }}"/>
  <link rel="stylesheet" href="{{ asset('css/leavecard.css') }}"/>
  <link rel="stylesheet" href="{{ asset('css/personnel-list.css') }}"/>
  <link rel="stylesheet" href="{{ asset('css/page-layout.css') }}"/>
  <link rel="stylesheet" href="{{ asset('css/logout.css') }}"/>
  <link rel="stylesheet" href="{{ asset('css/print.css') }}"/>

  <!-- html2pdf library -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
  <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
  
  <style>
    /* ═══════════════════════════════════════════════════
       RED ARMOUR — SPLIT LOGIN
       ═══════════════════════════════════════════════════ */

    #s-login {
      position: fixed !important;
      inset: 0 !important;
      display: none;
      align-items: stretch !important;
      justify-content: stretch !important;
      background: #080000 !important;
      overflow: hidden;
    }
    #s-login.active { display: flex !important; }

    /* Full-screen ember canvas */
    #ra-canvas {
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    }

    /* Scanlines */
    #ra-scanlines {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 1;
      background: repeating-linear-gradient(
        0deg,
        rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px,
        rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px
      );
    }

    .ra-lw {
      position: relative;
      z-index: 2;
      display: flex;
      width: 100%;
      height: 100vh;
      overflow: hidden;
    }

    /* ── LEFT PANEL ── */
    .ra-sl {
      position: relative;
      width: 45%;
      min-width: 320px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      padding: 60px 52px;
      overflow: hidden;
      background:
        linear-gradient(155deg, rgba(16,0,0,0.93) 0%, rgba(5,0,0,0.97) 100%),
        url('https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Koronadal_City_Hall.jpg/1280px-Koronadal_City_Hall.jpg')
        center/cover no-repeat;
      border-right: 1px solid rgba(192,57,43,0.3);
      box-shadow: inset -40px 0 80px rgba(0,0,0,0.6);
    }

    /* Gold top bar */
    .ra-sl::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: linear-gradient(90deg,
        transparent, rgba(176,125,44,0.8),
        rgba(240,190,100,0.95), rgba(176,125,44,0.8), transparent);
      animation: ra-gold-glow 2s ease-in-out infinite;
      z-index: 3;
    }

    /* Red right edge glow */
    .ra-sl::after {
      content: '';
      position: absolute;
      top: 0; right: -1px; bottom: 0;
      width: 1px;
      background: linear-gradient(180deg,
        transparent 0%, rgba(220,60,40,0.8) 30%,
        rgba(220,60,40,0.8) 70%, transparent 100%);
      box-shadow: 0 0 20px rgba(220,60,40,0.5);
      z-index: 3;
    }

    .ra-rivet {
      position: absolute;
      width: 8px; height: 8px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 30%,
        rgba(255,200,120,0.9), rgba(139,26,26,0.8));
      border: 1px solid rgba(255,160,80,0.4);
      box-shadow: 0 0 6px rgba(220,80,40,0.4);
      z-index: 4;
    }
    .ra-rivet-tl { top: 14px; left: 14px; }
    .ra-rivet-tr { top: 14px; right: 14px; }
    .ra-rivet-bl { bottom: 14px; left: 14px; }
    .ra-rivet-br { bottom: 14px; right: 14px; }

    .ra-embers {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
      z-index: 1;
    }
    .ra-ember {
      position: absolute;
      bottom: -6px;
      border-radius: 50%;
      background: radial-gradient(circle, #f0d060, #c04020);
      opacity: 0;
      animation: ra-ember-float var(--dur,4s) var(--delay,0s) ease-in infinite;
    }

    /* Shield watermark */
    .ra-shield-deco {
      position: absolute;
      bottom: -30px; right: -30px;
      width: 220px; height: 260px;
      opacity: 0.055;
      pointer-events: none;
      z-index: 1;
      filter: drop-shadow(0 0 20px rgba(220,60,40,1));
    }

    /* Logo row */
    .ra-logo-row {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      gap: 18px;
      margin-bottom: 30px;
    }

    .ra-logo-img {
      width: 84px;
      height: 84px;
      border-radius: 50%;
      object-fit: contain;
      background: rgba(255,255,255,0.07);
      padding: 6px;
      border: 2px solid rgba(192,57,43,0.6);
      box-shadow:
        0 0 0 4px rgba(139,26,26,0.2),
        0 0 24px rgba(220,60,40,0.55),
        0 0 55px rgba(139,0,0,0.35);
      animation: ra-logo-pulse 2.8s ease-in-out infinite;
      flex-shrink: 0;
    }

    .ra-logo-text { position: relative; z-index: 2; }
    .ra-logo-sup {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color: rgba(176,125,44,0.8);
      margin-bottom: 4px;
    }
    .ra-logo-title {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 1.9rem;
      font-weight: 700;
      color: #fff;
      line-height: 1.1;
      text-shadow: 0 0 30px rgba(220,60,40,0.4);
    }
    .ra-logo-accent { color: #e74c3c; }

    .ra-sl-tag {
      position: relative; z-index: 2;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 10px; font-weight: 700;
      letter-spacing: 3px; text-transform: uppercase;
      color: rgba(220,100,80,0.65);
      margin-bottom: 14px;
    }

    .ra-sl-h1 {
      position: relative; z-index: 2;
      font-family: 'Barlow Condensed', 'Rajdhani', sans-serif;
      font-size: clamp(2rem, 3.5vw, 3.2rem);
      font-weight: 900;
      line-height: 1.0;
      letter-spacing: -0.5px;
      text-transform: uppercase;
      color: #fff;
      text-shadow: 0 0 40px rgba(220,60,40,0.5), 0 2px 4px rgba(0,0,0,0.8);
      margin-bottom: 20px;
    }
    .ra-sl-h1 .ra-accent { color: #e74c3c; }

    .ra-rule {
      position: relative; z-index: 2;
      width: 55%; height: 2px;
      border-radius: 2px;
      background: linear-gradient(90deg,
        transparent, rgba(176,125,44,0.9),
        rgba(240,200,100,1), rgba(176,125,44,0.9), transparent);
      margin-bottom: 20px;
      animation: ra-gold-glow 2.2s ease-in-out infinite;
    }

    .ra-sl-p {
      position: relative; z-index: 2;
      font-family: 'Inter', sans-serif;
      font-size: 13px; font-weight: 400;
      color: rgba(255,200,180,0.45);
      line-height: 1.75;
      max-width: 340px;
      margin-bottom: 24px;
    }

    .ra-sl-small {
      position: relative; z-index: 2;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 9px; font-weight: 700;
      letter-spacing: 2.5px; text-transform: uppercase;
      color: rgba(192,57,43,0.4);
    }

    /* ── RIGHT PANEL ── */
    .ra-sr {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 32px;
      background:
        linear-gradient(168deg, rgba(18,0,0,0.88), rgba(8,0,0,0.96)),
        url('https://depedkoronadalcity.wordpress.com/wp-content/uploads/2012/09/city-division-office1.jpg')
        center/cover no-repeat;
      overflow: hidden;
    }
    .ra-sr::before {
      content: '';
      position: absolute;
      top: -100px; right: -100px;
      width: 400px; height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(139,0,0,0.18) 0%, transparent 65%);
      pointer-events: none;
    }

    /* Forge card */
    .ra-card {
      position: relative;
      width: 100%;
      max-width: 430px;
      background: linear-gradient(160deg, #1a0303 0%, #120202 50%, #0a0101 100%);
      border: 1px solid rgba(192,57,43,0.5);
      border-radius: 18px;
      padding: 32px 32px 26px;
      box-shadow:
        0 0 0 1px rgba(255,60,40,0.06),
        0 0 40px rgba(139,0,0,0.5),
        0 0 90px rgba(139,0,0,0.2),
        0 30px 60px rgba(0,0,0,0.9),
        inset 0 1px 0 rgba(255,100,80,0.1),
        inset 0 -1px 0 rgba(0,0,0,0.5);
      animation: ra-card-enter 0.8s cubic-bezier(0.22,1,0.36,1) 0.3s both;
      overflow: hidden;
    }
    .ra-card::before {
      content: '';
      position: absolute;
      inset: 8px;
      border-radius: 12px;
      border: 1px solid rgba(192,57,43,0.1);
      pointer-events: none;
    }
    .ra-card::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(110deg,
        transparent 0%, transparent 35%,
        rgba(255,255,255,0.025) 50%,
        transparent 65%, transparent 100%);
      background-size: 200% 100%;
      animation: ra-shimmer 6s ease-in-out infinite;
      pointer-events: none;
      border-radius: inherit;
    }

    .ra-card-rivet {
      position: absolute;
      width: 9px; height: 9px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%,
        #ff6040 0%, #991010 60%, #4a0808 100%);
      box-shadow: 0 0 6px rgba(255,80,60,0.5),
                  inset 0 1px 0 rgba(255,200,180,0.2);
    }
    .ra-card-rivet-tl { top: 14px; left: 14px; }
    .ra-card-rivet-tr { top: 14px; right: 14px; }
    .ra-card-rivet-bl { bottom: 14px; left: 14px; }
    .ra-card-rivet-br { bottom: 14px; right: 14px; }

    /* Card header */
    .ra-card-head {
      position: relative; z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 20px;
    }

    .ra-mini-shield {
      width: 68px; height: 82px;
      margin-bottom: 14px;
      filter:
        drop-shadow(0 0 12px rgba(220,60,40,0.8))
        drop-shadow(0 0 30px rgba(139,0,0,0.5));
      animation:
        ra-shield-enter 0.9s cubic-bezier(0.22,1,0.36,1) both,
        ra-shield-float 4s ease-in-out 0.9s infinite;
    }

    .ra-card-title-row {
      display: flex; align-items: center; gap: 10px; width: 100%;
    }
    .ra-card-title-line {
      flex: 1; height: 1px;
      background: linear-gradient(90deg, transparent 0%, rgba(192,57,43,0.5) 100%);
    }
    .ra-card-title-line-r {
      background: linear-gradient(90deg, rgba(192,57,43,0.5) 0%, transparent 100%);
    }
    .ra-card-title-text { text-align: center; flex-shrink: 0; }
    .ra-card-org {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 14px; font-weight: 800;
      letter-spacing: 0.18em; text-transform: uppercase;
      color: #f5d0c0;
      text-shadow: 0 0 12px rgba(220,80,60,0.5);
      line-height: 1.2;
    }
    .ra-card-sys {
      font-family: 'Inter', sans-serif;
      font-size: 9px; font-weight: 500;
      letter-spacing: 0.12em; text-transform: uppercase;
      color: rgba(255,160,140,0.4);
      margin-top: 2px;
    }

    .ra-welcome {
      position: relative; z-index: 1;
      text-align: center;
      margin-bottom: 18px;
    }
    .ra-welcome-h2 {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 1.55rem; font-weight: 700;
      color: #fff; letter-spacing: 0.02em;
      text-shadow: 0 0 20px rgba(220,60,40,0.3);
      margin-bottom: 4px;
    }
    .ra-welcome-sub {
      font-family: 'Inter', sans-serif;
      font-size: 10px;
      color: rgba(255,160,140,0.38);
      letter-spacing: 0.1em; text-transform: uppercase;
    }

    .ra-divider {
      position: relative; z-index: 1;
      display: flex; align-items: center; gap: 10px;
      margin-bottom: 20px;
    }
    .ra-div-line { flex: 1; height: 1px; background: rgba(139,26,26,0.35); }
    .ra-div-badge {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 9px; font-weight: 700;
      letter-spacing: 0.18em; text-transform: uppercase;
      color: rgba(255,120,100,0.38);
      padding: 3px 10px;
      border: 1px solid rgba(139,26,26,0.28);
      border-radius: 4px;
      background: rgba(139,0,0,0.1);
      white-space: nowrap;
    }

    /* Form */
    .ra-form {
      position: relative; z-index: 1;
      display: flex; flex-direction: column; gap: 18px;
    }
    .ra-field { display: flex; flex-direction: column; gap: 6px; }
    .ra-label {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 9.5px; font-weight: 700;
      letter-spacing: 0.16em; text-transform: uppercase;
      color: rgba(220,100,80,0.7);
    }
    .ra-input-wrap { position: relative; display: flex; align-items: center; }
    .ra-input-icon {
      position: absolute; left: 12px;
      font-size: 14px;
      color: rgba(192,57,43,0.5);
      pointer-events: none; line-height: 1;
      transition: color 0.2s;
    }
    .ra-input {
      width: 100%; height: 48px;
      padding: 0 44px 0 38px;
      background: rgba(0,0,0,0.45);
      border: 1px solid rgba(139,26,26,0.4);
      border-radius: 10px;
      color: #f5e8e0;
      font-family: 'Inter', sans-serif;
      font-size: 13.5px; font-weight: 500;
      outline: none;
      transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    }
    .ra-input::placeholder { color: rgba(255,160,140,0.22); font-weight: 400; }
    .ra-input:focus {
      background: rgba(30,4,4,0.65);
      border-color: rgba(220,80,60,0.75);
      box-shadow: 0 0 0 3px rgba(192,57,43,0.12),
                  inset 0 1px 0 rgba(255,80,60,0.06);
    }
    .ra-input:focus ~ .ra-input-bar { width: 100%; }
    .ra-input-wrap:focus-within .ra-input-icon { color: rgba(220,80,60,0.9); }
    .ra-input-bar {
      position: absolute; bottom: -1px; left: 0;
      height: 2px; width: 0%;
      background: linear-gradient(90deg, #8b1a1a, #e53e3e, #8b1a1a);
      border-radius: 0 0 10px 10px;
      transition: width 0.35s cubic-bezier(0.4,0,0.2,1);
    }
    .ra-eye {
      position: absolute; right: 10px;
      background: none; border: none; cursor: pointer;
      font-size: 15px; color: rgba(255,120,100,0.4);
      padding: 4px; line-height: 1; transition: color 0.15s;
    }
    .ra-eye:hover { color: rgba(220,80,60,0.85); }

    .ra-err {
      background: rgba(139,0,0,0.25);
      border: 1px solid rgba(220,60,40,0.4);
      border-left: 3px solid #e53e3e;
      border-radius: 8px;
      padding: 10px 14px;
      font-family: 'Inter', sans-serif;
      font-size: 12px; font-weight: 600;
      color: #fca5a5; letter-spacing: 0.02em;
      animation: ra-shake 0.4s cubic-bezier(0.36,0.07,0.19,0.97);
    }

    /* Submit */
    .ra-submit {
      position: relative;
      width: 100%; height: 52px;
      margin-top: 4px;
      border: none; border-radius: 12px;
      cursor: pointer; overflow: hidden; outline: none;
      transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s ease;
      background: linear-gradient(160deg,
        #6b0e0e 0%, #8b1a1a 15%, #c0392b 40%,
        #e53e3e 55%, #c0392b 70%, #8b1a1a 85%, #5a0808 100%);
      box-shadow:
        0 1px 0 rgba(255,255,255,0.12) inset,
        0 -3px 0 rgba(0,0,0,0.55) inset,
        0 7px 0 #5a0606, 0 8px 0 #3d0404,
        0 10px 20px rgba(139,0,0,0.65),
        0 20px 45px rgba(139,0,0,0.28),
        0 0 0 1px rgba(192,57,43,0.65);
      animation: ra-btn-pulse 2.5s ease-in-out infinite;
    }
    .ra-submit:hover {
      transform: translateY(-2px); animation: none;
      box-shadow:
        0 1px 0 rgba(255,255,255,0.15) inset,
        0 -3px 0 rgba(0,0,0,0.55) inset,
        0 9px 0 #5a0606, 0 10px 0 #3d0404,
        0 14px 30px rgba(139,0,0,0.75),
        0 26px 55px rgba(139,0,0,0.32),
        0 0 0 1px rgba(220,60,40,0.85);
    }
    .ra-submit:active {
      transform: translateY(5px); animation: none;
      box-shadow:
        0 1px 0 rgba(255,255,255,0.1) inset,
        0 2px 0 #5a0606, 0 3px 0 #3d0404,
        0 5px 12px rgba(139,0,0,0.5),
        0 0 0 1px rgba(192,57,43,0.65);
    }
    .ra-submit:disabled { cursor: not-allowed; filter: saturate(0.4) brightness(0.65); animation: none; }
    .ra-submit::before {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(180deg,
        rgba(255,255,255,0.13) 0%,
        rgba(255,255,255,0.04) 45%, transparent 100%);
      border-radius: inherit; pointer-events: none;
    }
    .ra-submit-inner {
      position: relative; z-index: 1;
      display: flex; align-items: center;
      justify-content: center; gap: 10px;
    }
    .ra-submit-icon { font-size: 16px; line-height: 1; }
    .ra-submit-text {
      font-family: 'Barlow Condensed', 'Rajdhani', sans-serif;
      font-size: 16px; font-weight: 800;
      letter-spacing: 0.22em; text-transform: uppercase;
      color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,0.6);
    }
    .ra-submit-shine {
      position: absolute; top: 0; left: -100%;
      width: 60%; height: 100%;
      background: linear-gradient(105deg,
        transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%);
      animation: ra-submit-shimmer 3.5s ease-in-out infinite;
      pointer-events: none; border-radius: inherit;
    }

    /* Card footer */
    .ra-card-foot {
      position: relative; z-index: 1;
      display: flex; align-items: center;
      justify-content: center; gap: 8px;
      margin-top: 20px;
    }
    .ra-foot-dot {
      width: 4px; height: 4px; border-radius: 50%;
      background: rgba(192,57,43,0.35);
    }
    .ra-foot-text {
      font-family: 'Inter', sans-serif;
      font-size: 9px; font-weight: 500;
      letter-spacing: 0.1em; text-transform: uppercase;
      color: rgba(255,160,140,0.22);
    }

    /* ── KEYFRAMES ── */
    @keyframes ra-gold-glow   { 0%,100%{opacity:.7} 50%{opacity:1} }
    @keyframes ra-logo-pulse  {
      0%,100%{ box-shadow:0 0 0 4px rgba(139,26,26,.2),0 0 24px rgba(220,60,40,.55),0 0 55px rgba(139,0,0,.35); }
      50%    { box-shadow:0 0 0 6px rgba(139,26,26,.35),0 0 40px rgba(220,60,40,.8),0 0 80px rgba(139,0,0,.55); }
    }
    @keyframes ra-card-enter  { from{opacity:0;transform:translateY(28px) scale(0.96)} to{opacity:1;transform:none} }
    @keyframes ra-shimmer     { 0%,70%,100%{background-position:200% 0} 35%{background-position:-100% 0} }
    @keyframes ra-shield-enter{
      from{transform:translateY(-60px) scale(0.4) rotateX(40deg);opacity:0}
      60% {transform:translateY(6px) scale(1.08) rotateX(-6deg);opacity:1}
      100%{transform:none;opacity:1}
    }
    @keyframes ra-shield-float{
      0%,100%{transform:translateY(0) rotateX(0) rotateY(0)}
      25%    {transform:translateY(-5px) rotateX(3deg) rotateY(4deg)}
      50%    {transform:translateY(-8px) rotateX(0) rotateY(0)}
      75%    {transform:translateY(-5px) rotateX(-3deg) rotateY(-4deg)}
    }
    @keyframes ra-btn-pulse   {
      0%,100%{box-shadow:0 1px 0 rgba(255,255,255,.12) inset,0 -3px 0 rgba(0,0,0,.55) inset,0 7px 0 #5a0606,0 8px 0 #3d0404,0 10px 20px rgba(139,0,0,.65),0 0 0 1px rgba(192,57,43,.65)}
      50%    {box-shadow:0 1px 0 rgba(255,255,255,.12) inset,0 -3px 0 rgba(0,0,0,.55) inset,0 7px 0 #5a0606,0 8px 0 #3d0404,0 14px 36px rgba(139,0,0,.9),0 0 0 2px rgba(220,60,40,.85)}
    }
    @keyframes ra-submit-shimmer{ 0%,70%,100%{left:-100%;opacity:0} 40%{left:120%;opacity:1} }
    @keyframes ra-shake        { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
    @keyframes ra-ember-float  {
      0%  {opacity:0;transform:translateY(0) translateX(0) scale(1)}
      12% {opacity:.9}
      85% {opacity:.3}
      100%{opacity:0;transform:translateY(-400px) translateX(var(--drift)) scale(.3)}
    }
    @keyframes ra-slam-in      {
      0%  {opacity:0;transform:translateY(-100px) scale(1.04) rotate(-.8deg)}
      55% {opacity:1;transform:translateY(8px) scale(.98) rotate(.3deg)}
      75% {transform:translateY(-3px) scale(1.01)}
      100%{opacity:1;transform:none}
    }
    @keyframes ra-page-flash   { 0%,25%{opacity:1} 100%{opacity:0} }

    /* Responsive */
    @media (max-width: 768px) {
      .ra-lw { flex-direction: column; }
      .ra-sl { width:100%; min-width:unset; padding:28px 20px 24px; }
      .ra-sr { padding:24px 14px; }
      .ra-sl-h1 { font-size:1.8rem; }
      .ra-shield-deco { display:none; }
      .ra-logo-img { width:64px; height:64px; }
    }
  </style>
</head>
<body>

<!-- Red flash jumpscare -->
<div id="ra-flash" style="
  position:fixed;inset:0;z-index:99999;pointer-events:none;
  background:#8b0000;
  animation:ra-page-flash 1.1s cubic-bezier(.22,1,.36,1) forwards;
"></div>

<!-- Global ember canvas + scanlines -->
<canvas id="ra-canvas"></canvas>
<div id="ra-scanlines"></div>

<div id="app">

  <!-- ══════════════════════════════════════════════════════
       LOGIN SCREEN
       ══════════════════════════════════════════════════════ -->
  <div id="s-login" class="screen">

    <div class="ra-lw" id="ra-lw">

      <!-- ── LEFT PANEL ── -->
      <div class="ra-sl">

        <!-- Armour rivets -->
        <div class="ra-rivet ra-rivet-tl"></div>
        <div class="ra-rivet ra-rivet-tr"></div>
        <div class="ra-rivet ra-rivet-bl"></div>
        <div class="ra-rivet ra-rivet-br"></div>

        <!-- Floating ember particles -->
        <div class="ra-embers" id="ra-embers"></div>

        <!-- Shield watermark (bottom-right decoration) -->
        <svg class="ra-shield-deco" viewBox="0 0 220 260" xmlns="http://www.w3.org/2000/svg">
          <path d="M38,42 L182,42 L182,222 Q110,260 110,260 Q110,260 38,222 Z" fill="#e74c3c"/>
          <polygon points="10,18 38,18 38,222 10,245"       fill="#e74c3c" opacity="0.7"/>
          <polygon points="210,18 182,18 182,222 210,245"   fill="#e74c3c" opacity="0.5"/>
          <polygon points="10,18 210,18 182,42 38,42"       fill="#e74c3c" opacity="0.8"/>
        </svg>

        <!-- DepEd Logo + Title -->
        <div class="ra-logo-row">
          <img class="ra-logo-img"
               src="/img/sdo.jpg"
               onerror="this.src='https://upload.wikimedia.org/wikipedia/en/a/a8/DepEd_Koronadal.png'"
               alt="DepEd SDO Koronadal City"/>
          <div class="ra-logo-text">
            <div class="ra-logo-sup">Schools Division Office</div>
            <div class="ra-logo-title">Koronadal <span class="ra-logo-accent">City</span></div>
          </div>
        </div>

        <div class="ra-sl-tag">DepEd SDO Koronadal City</div>
        <h1 class="ra-sl-h1">
          Leave Card<br/>
          <span class="ra-accent">Management</span><br/>
          System
        </h1>
        <div class="ra-rule"></div>
        <p class="ra-sl-p">
          Official digital leave tracking system for all personnel
          of the Schools Division Office of Koronadal City.
        </p>
        <small class="ra-sl-small">SDO Koronadal City — Since 2002</small>

      </div><!-- /ra-sl -->

      <!-- ── RIGHT PANEL ── -->
      <div class="ra-sr">

        <div class="ra-card" id="ra-card">

          <!-- Corner rivets -->
          <div class="ra-card-rivet ra-card-rivet-tl"></div>
          <div class="ra-card-rivet ra-card-rivet-tr"></div>
          <div class="ra-card-rivet ra-card-rivet-bl"></div>
          <div class="ra-card-rivet ra-card-rivet-br"></div>

          <!-- Card header with floating shield -->
          <div class="ra-card-head">
            <svg class="ra-mini-shield" viewBox="0 0 220 260" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="rg-face"  x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%"   stop-color="#c0392b"/>
                  <stop offset="40%"  stop-color="#8b1414"/>
                  <stop offset="100%" stop-color="#3b0f0a"/>
                </linearGradient>
                <linearGradient id="rg-left"  x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stop-color="#e74c3c"/>
                  <stop offset="100%" stop-color="#c0392b"/>
                </linearGradient>
                <linearGradient id="rg-right" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stop-color="#4a0e0a"/>
                  <stop offset="100%" stop-color="#1a0404"/>
                </linearGradient>
                <linearGradient id="rg-top"   x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%"   stop-color="#f1948a"/>
                  <stop offset="100%" stop-color="#e74c3c"/>
                </linearGradient>
                <linearGradient id="rg-gloss" x1="20%" y1="0%" x2="60%" y2="70%">
                  <stop offset="0%"   stop-color="rgba(255,255,255,0.28)"/>
                  <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
                </linearGradient>
                <filter id="rg-glow">
                  <feGaussianBlur stdDeviation="4" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              <polygon points="10,18 38,18 38,222 10,245"       fill="url(#rg-left)"  opacity="0.92"/>
              <polygon points="210,18 182,18 182,222 210,245"   fill="url(#rg-right)" opacity="0.92"/>
              <polygon points="10,18 210,18 182,42 38,42"       fill="url(#rg-top)"   opacity="0.92"/>
              <polygon points="10,245 38,222 110,260 110,240"   fill="#3b0f0a" opacity="0.88"/>
              <polygon points="210,245 182,222 110,260 110,240" fill="#1a0404" opacity="0.65"/>
              <path d="M38,42 L182,42 L182,222 Q110,260 110,260 Q110,260 38,222 Z" fill="url(#rg-face)"/>
              <path d="M52,56 L168,56 L168,210 Q110,248 110,248 Q110,248 52,210 Z"
                    fill="none" stroke="#e74c3c" stroke-width="2" opacity="0.4" filter="url(#rg-glow)"/>
              <circle cx="110" cy="140" r="46" fill="none" stroke="#e74c3c" stroke-width="1.5" opacity="0.5"/>
              <circle cx="110" cy="140" r="30" fill="rgba(0,0,0,0.4)"/>
              <polygon points="110,100 116,126 140,120 122,138 140,160 114,152 110,178 106,152 80,160 98,138 80,120 104,126"
                       fill="#e74c3c" opacity="0.95" filter="url(#rg-glow)"/>
              <circle cx="110" cy="140" r="8"  fill="#ff6b6b"/>
              <circle cx="110" cy="140" r="4"  fill="white" opacity="0.85"/>
              <path d="M52,56 L130,56 L130,140 Q90,160 52,140 Z" fill="url(#rg-gloss)" opacity="0.45"/>
              <rect x="38" y="18" width="144" height="24" rx="4" fill="url(#rg-top)" opacity="0.95"/>
              <circle cx="55"  cy="62"  r="4" fill="#922b21" stroke="#e74c3c" stroke-width="1"/>
              <circle cx="165" cy="62"  r="4" fill="#922b21" stroke="#e74c3c" stroke-width="1"/>
              <circle cx="55"  cy="208" r="4" fill="#922b21" stroke="#e74c3c" stroke-width="1"/>
              <circle cx="165" cy="208" r="4" fill="#922b21" stroke="#e74c3c" stroke-width="1"/>
            </svg>

            <div class="ra-card-title-row">
              <div class="ra-card-title-line"></div>
              <div class="ra-card-title-text">
                <div class="ra-card-org">SDO Koronadal City</div>
                <div class="ra-card-sys">Leave Card Management System</div>
              </div>
              <div class="ra-card-title-line ra-card-title-line-r"></div>
            </div>
          </div>

          <!-- Welcome -->
          <div class="ra-welcome">
            <div class="ra-welcome-h2">Welcome Back</div>
            <div class="ra-welcome-sub">Sign in to your account</div>
          </div>

          <!-- Divider -->
          <div class="ra-divider">
            <div class="ra-div-line"></div>
            <div class="ra-div-badge">🔐 SECURE ACCESS</div>
            <div class="ra-div-line"></div>
          </div>

          <!-- Login Form — IDs preserved for app.js -->
          <form id="loginForm" autocomplete="off" class="ra-form">

            <div class="ra-field">
              <label class="ra-label" for="lid">EMAIL</label>
              <div class="ra-input-wrap">
                <span class="ra-input-icon">◈</span>
                <input id="lid" type="text" class="ra-input"
                       placeholder="your@deped.gov.ph"
                       autocomplete="username" required/>
                <div class="ra-input-bar"></div>
              </div>
            </div>

            <div class="ra-field">
              <label class="ra-label" for="lpw">PASSWORD</label>
              <div class="ra-input-wrap">
                <span class="ra-input-icon">⬡</span>
                <input id="lpw" type="password" class="ra-input"
                       placeholder="Enter your password…"
                       autocomplete="current-password" required/>
                <button type="button" id="eyeBtn" class="ra-eye" title="Toggle password">👁</button>
                <div class="ra-input-bar"></div>
              </div>
            </div>

            <div id="loginErr" class="ra-err" style="display:none;"></div>

            <button type="submit" class="ra-submit">
              <span class="ra-submit-inner">
                <span class="ra-submit-icon">⚔</span>
                <span class="ra-submit-text">Sign In</span>
              </span>
              <div class="ra-submit-shine"></div>
            </button>

          </form>

          <!-- Footer -->
          <div class="ra-card-foot">
            <span class="ra-foot-dot"></span>
            <span class="ra-foot-text">DepEd · Region XII · SDO City of Koronadal</span>
            <span class="ra-foot-dot"></span>
          </div>

        </div><!-- /ra-card -->

      </div><!-- /ra-sr -->

    </div><!-- /ra-lw -->

  </div><!-- /#s-login -->

  <!-- ══════════════════════════════════════════════════════
       APP SCREEN
       ══════════════════════════════════════════════════════ -->
  <div id="s-app" class="screen">
    <div id="sbOverlay" class="sb-overlay"></div>
    <div id="sidebar"   class="sidebar"></div>
    <header class="topbar"><div id="topbar"></div></header>
    <main class="ca">
      <div id="pg-home"    class="page"></div>
      <div id="pg-list"    class="page"></div>
      <div id="pg-cards"   class="page"></div>
      <div id="pg-nt"      class="page"></div>
      <div id="pg-t"       class="page"></div>
      <div id="pg-sa"      class="page"></div>
      <div id="pg-sa-list" class="page"></div>
      <div id="pg-user"         class="page"></div>
<div id="pg-submissions"  class="page"></div>
    </main>
  </div>

</div><!-- /#app -->


<!-- ══════════════════════════════════════════════════════════
     RED ARMOUR ENGINE
     ══════════════════════════════════════════════════════════ -->
<script>
(function () {

  /* ── Global ember canvas ── */
  function initCanvas() {
    const canvas = document.getElementById('ra-canvas');
    if (!canvas) return;
    canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);
    function rand(a,b) { return Math.random()*(b-a)+a; }
    function spawn() {
      particles.push({
        x: rand(0,W), y: H+10,
        vx: rand(-0.5,0.5), vy: rand(-1.6,-0.5),
        r: rand(1,3.2), life: 1,
        fade: rand(0.003,0.009), hue: rand(0,28)
      });
    }
    function frame() {
      ctx.clearRect(0,0,W,H);
      if (Math.random()<0.38) spawn();
      particles = particles.filter(p=>p.life>0);
      for (const p of particles) {
        p.x+=p.vx; p.y+=p.vy; p.life-=p.fade;
        ctx.save();
        ctx.globalAlpha = Math.max(0,p.life)*0.7;
        const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);
        g.addColorStop(0,   `hsla(${p.hue},100%,80%,1)`);
        g.addColorStop(0.5, `hsla(${p.hue},90%,50%,0.8)`);
        g.addColorStop(1,   `hsla(${p.hue},80%,30%,0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
        ctx.restore();
      }
      requestAnimationFrame(frame);
    }
    frame();
  }

  /* ── Left panel ember particles ── */
  function initEmbers() {
    const wrap = document.getElementById('ra-embers');
    if (!wrap) return;
    for (let i=0; i<20; i++) {
      const e = document.createElement('div');
      e.className = 'ra-ember';
      const size = 2+Math.random()*5;
      e.style.cssText = `
        left:${Math.random()*95}%;
        width:${size}px; height:${size}px;
        --dur:${3+Math.random()*5}s;
        --delay:${Math.random()*7}s;
        --drift:${(Math.random()-.5)*80}px;
      `;
      wrap.appendChild(e);
    }
  }

  /* ── Slam-in when login screen becomes active ── */
  function initSlam() {
    const login = document.getElementById('s-login');
    if (!login) return;
    const observer = new MutationObserver(() => {
      if (!login.classList.contains('active')) return;
      observer.disconnect();
      const lw = document.getElementById('ra-lw');
      if (lw) lw.style.animation = 'ra-slam-in 0.75s cubic-bezier(0.22,1,0.36,1) both';
    });
    observer.observe(login, { attributes:true, attributeFilter:['class'] });
  }

  /* ── Remove page flash ── */
  setTimeout(() => {
    const f = document.getElementById('ra-flash');
    if (f) { f.style.transition='opacity 0.3s'; f.style.opacity='0'; setTimeout(()=>f.remove(),300); }
  }, 900);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { initCanvas(); initEmbers(); initSlam(); });
  } else {
    initCanvas(); initEmbers(); initSlam();
  }

})();
</script>

<!-- ══════════════════════════════════════════════════════════
     GLOBAL JS CONFIG
     ══════════════════════════════════════════════════════════ -->
<script>
  window.CSRF_TOKEN = "{{ csrf_token() }}";
  window.API_BASE   = "{{ url('/api') }}";
</script>

<!-- ══════════════════════════════════════════════════════════
     SCRIPTS — ORDER MATTERS
     ══════════════════════════════════════════════════════════ -->
<script src="{{ asset('js/leave-logic.js') }}"></script>
<script src="{{ asset('js/leave-compute-teaching.js') }}"></script>
<script src="{{ asset('js/leave-compute-nonteaching.js') }}"></script>
<script src="{{ asset('js/leavecard-styles.js') }}"></script>
<script src="{{ asset('js/leavecard-sort.js') }}"></script>
<script src="{{ asset('js/leavecard-era.js') }}"></script>
<script src="{{ asset('js/leavecard-table.js') }}"></script>
<script src="{{ asset('js/leavecard-form.js') }}"></script>
<script src="{{ asset('js/leavecard.js') }}"></script>
<script src="{{ asset('js/personnel-list.js') }}"></script>
<script src="{{ asset('js/dashboard.js') }}"></script>
<script src="{{ asset('js/modals.js') }}"></script>
<script src="{{ asset('js/accounts.js') }}"></script>
<script src="{{ asset('js/school-admin.js') }}"></script>
<script src="{{ asset('js/app.js') }}"></script>
<script src="{{ asset('js/employee.js') }}"></script>
<script src="{{ asset('js/leave-application.js?v=2.0') }}"></script>
<script src="{{ asset('js/bulk-operations-modals.js') }}"></script>

<!-- Print & Download PDF — load ONCE, LAST -->
<script src="{{ asset('js/print-download.js?v=5.8') }}"></script>
<script src="{{ asset('js/pdf-export.js?v=4.0') }}"></script>
<script src="{{ asset('js/bulk-export.js?v=1.1') }}"></script>
<script src="{{ asset('js/logout.js') }}"></script>
</body>
</html>
