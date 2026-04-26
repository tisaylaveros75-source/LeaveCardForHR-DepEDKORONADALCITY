<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="csrf-token" content="{{ csrf_token() }}"/>
  <title>SDO Koronadal City – Leave Card System</title>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>

  <!-- App Stylesheets -->
  <link rel="stylesheet" href="{{ asset('css/app.css') }}"/>
  <link rel="stylesheet" href="{{ asset('css/leavecard.css') }}"/>
  <link rel="stylesheet" href="{{ asset('css/personnel-list.css') }}"/>
  <link rel="stylesheet" href="{{ asset('css/page-layout.css') }}"/>
  <link rel="stylesheet" href="{{ asset('css/logout.css') }}"/>

  <!-- Legal-paper print styles (must come AFTER leavecard.css) -->
  <link rel="stylesheet" href="{{ asset('css/print.css') }}"/>

  <!-- html2pdf library for Download PDF button -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
</head>
<body>

<div id="app">

  <!-- ══════════════════════════════════════════════════════
       LOGIN SCREEN
       ══════════════════════════════════════════════════════ -->
  <div id="s-login" class="screen">
    <div class="lw">
      <div class="split">

        <div class="sl">
          <div class="l-logos">
            <img src="https://upload.wikimedia.org/wikipedia/en/a/a8/DepEd_Koronadal.png"
                 alt="DepEd"
                 onerror="this.style.display='none'"/>
          </div>
          <div class="l-tag">DepEd SDO Koronadal City</div>
          <h1>Leave Card<br/>Management<br/>System</h1>
          <div class="l-rule"></div>
          <p>Official digital leave tracking system for all personnel of the Schools Division Office of Koronadal City.</p>
          <br/><small>SDO KORONADAL CITY — SINCE 2024</small>
        </div>

        <div class="sr">
          <div class="lfw">
            <h2>Welcome Back</h2>
            <div class="lsub">Sign in to your account</div>
            <form id="loginForm" autocomplete="off">
              <div class="lf">
                <label>Email / Employee ID</label>
                <div class="lfi">
                  <input id="lid" type="text" placeholder="your@deped.gov.ph" required/>
                </div>
              </div>
              <div class="lf">
                <label>Password</label>
                <div class="lfi">
                  <input id="lpw" type="password" placeholder="" required/>
                  <button type="button" class="leye" id="eyeBtn">👁</button>
                </div>
              </div>
              <div id="loginErr" class="lerr"></div>
              <button type="submit" class="lbtn">Sign In</button>
            </form>
          </div>
        </div>

      </div>
    </div>
  </div>

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
      <div id="pg-user"    class="page"></div>
    </main>
  </div>

</div><!-- /#app -->


<!-- ══════════════════════════════════════════════════════════
     GLOBAL JS CONFIG
     ══════════════════════════════════════════════════════════ -->
<script>
  window.CSRF_TOKEN = "{{ csrf_token() }}";
  window.API_BASE   = "{{ url('/api') }}";
</script>
<script>
/* ── RED ARMOUR LOGIN ENHANCER v2 ── */
(function () {

  /* ─── 1. Full-screen RED FLASH jumpscare ─────────────────── */
  const flash = document.createElement('div');
  flash.id = 'js-flash';
  flash.style.cssText = `
    position:fixed;inset:0;z-index:99998;pointer-events:none;
    background:#8b0000;
    animation:jsFlash 1.1s cubic-bezier(.22,1,.36,1) forwards;
  `;
  const flashStyle = document.createElement('style');
  flashStyle.textContent = `
    @keyframes jsFlash{0%{opacity:1}25%{opacity:1}100%{opacity:0}}
    @keyframes jsSlamIn{
      0%  {opacity:0;transform:translateY(-180px) scale(1.1) rotate(-1.5deg)}
      55% {opacity:1;transform:translateY(14px) scale(.97) rotate(.4deg)}
      72% {transform:translateY(-6px) scale(1.01) rotate(-.2deg)}
      88% {transform:translateY(3px) scale(.99)}
      100%{opacity:1;transform:none}
    }
    @keyframes jsShake{
      10%,90%{transform:translate(-5px,-2px) rotate(-.4deg)}
      20%,80%{transform:translate(7px,2px)  rotate(.4deg)}
      30%,50%,70%{transform:translate(-5px,2px) rotate(-.3deg)}
      40%,60%{transform:translate(5px,-2px) rotate(.3deg)}
      100%{transform:none}
    }
    @keyframes shockwave{
      0%  {transform:translate(-50%,-50%) scale(0);opacity:.6}
      100%{transform:translate(-50%,-50%) scale(8);opacity:0}
    }
    @keyframes emberFloat{
      0%  {opacity:0;transform:translateY(0) translateX(0) scale(1)}
      12% {opacity:.9}
      85% {opacity:.3}
      100%{opacity:0;transform:translateY(-420px) translateX(var(--drift)) scale(.3)}
    }
    @keyframes glowPulse{
      0%,100%{box-shadow:0 0 0 3px rgba(176,125,44,.3),0 0 18px rgba(176,125,44,.2)}
      50%    {box-shadow:0 0 0 6px rgba(176,125,44,.6),0 0 36px rgba(176,125,44,.5)}
    }
    @keyframes shieldIdle{
      0%,100%{filter:drop-shadow(0 0 14px rgba(181,32,32,.7)) drop-shadow(0 8px 20px rgba(0,0,0,.5))}
      50%    {filter:drop-shadow(0 0 28px rgba(240,60,60,.9)) drop-shadow(0 8px 30px rgba(139,0,0,.6))}
    }
    @keyframes scanMove{
      0%  {background-position:0 0}
      100%{background-position:0 100px}
    }
    @keyframes btnPulse{
      0%,100%{box-shadow:0 4px 18px rgba(139,26,26,.5)}
      50%    {box-shadow:0 6px 32px rgba(181,32,32,.8),0 0 0 4px rgba(139,26,26,.18)}
    }
    @keyframes auGlow{
      0%,100%{opacity:.7} 50%{opacity:1}
    }

    /* ── Shockwave ring (fires on impact) ── */
    .js-shockwave{
      position:absolute;top:50%;left:50%;
      width:200px;height:200px;border-radius:50%;
      border:3px solid rgba(220,60,60,.6);
      pointer-events:none;
      animation:shockwave .7s ease-out forwards;
    }

    /* ── Slam override ── */
    .js-slam{ animation:jsSlamIn .7s cubic-bezier(.22,1,.36,1) both !important; }
    .js-shake{ animation:jsShake .5s ease both; }

    /* ── SDO shield SVG container ── */
    .js-sdo-wrap{
      position:relative;z-index:2;
      display:flex;align-items:center;gap:20px;
      margin-bottom:22px;
    }
    .js-sdo-logo{
      width:72px;height:72px;border-radius:50%;object-fit:contain;
      background:rgba(255,255,255,.12);padding:5px;
      border:3px solid rgba(176,125,44,.5);
      animation:glowPulse 2.8s ease-in-out infinite;
      position:relative;z-index:2;
    }
    .js-title-block{position:relative;z-index:2;}
    .js-title-sub{
      font-size:9px;font-weight:700;letter-spacing:2.5px;
      text-transform:uppercase;color:rgba(176,125,44,.7);
      margin-bottom:4px;
    }
    .js-title-main{
      font-family:'Cormorant Garamond',Georgia,serif;
      font-size:1.7rem;font-weight:700;color:#fff;
      line-height:1.1;letter-spacing:-.2px;
    }
    .js-title-accent{color:#e0a060;}

    /* ── Scanline overlay on left panel ── */
    .js-scanlines{
      position:absolute;inset:0;pointer-events:none;z-index:1;
      background:repeating-linear-gradient(
        0deg,transparent,transparent 3px,
        rgba(0,0,0,.055) 3px,rgba(0,0,0,.055) 4px
      );
      border-radius:inherit;
      animation:scanMove 3s linear infinite;
    }

    /* ── Ember particles ── */
    .js-embers{position:absolute;inset:0;pointer-events:none;overflow:hidden;border-radius:inherit;z-index:1;}
    .js-ember{
      position:absolute;bottom:-6px;border-radius:50%;
      background:radial-gradient(circle,#f0d060,#c04020);
      animation:emberFloat var(--dur,4s) var(--delay,0s) ease-in infinite;
      opacity:0;
    }

    /* ── Armour bolt rivets ── */
    .js-rivets{position:absolute;inset:0;pointer-events:none;z-index:2;}
    .js-rivet{
      position:absolute;width:7px;height:7px;border-radius:50%;
      background:radial-gradient(circle at 35% 30%,rgba(255,200,120,.8),rgba(120,40,20,.6));
      border:1px solid rgba(255,180,80,.3);
    }

    /* ── Gold accent bar at top of left panel ── */
    .js-gold-bar{
      position:absolute;top:0;left:0;right:0;height:3px;
      background:linear-gradient(90deg,transparent,rgba(176,125,44,.8),rgba(240,190,100,.9),rgba(176,125,44,.8),transparent);
      z-index:3;
      animation:auGlow 2s ease-in-out infinite;
    }

    /* ── Login button ── */
    .lbtn{ animation:btnPulse 2.5s ease-in-out infinite; }
    .lbtn:hover,.lbtn:focus{ animation:none; }

    /* ── Enhanced form panel overlay ── */
    .sr{
      background:
        linear-gradient(168deg,rgba(26,0,0,.82),rgba(10,0,0,.92)),
        url('https://depedkoronadalcity.wordpress.com/wp-content/uploads/2012/09/city-division-office1.jpg')
        center/cover !important;
    }

    /* ── Shimmering gold rule on left panel ── */
    .l-rule{
      background:linear-gradient(90deg,transparent,rgba(176,125,44,.9),rgba(240,200,100,1),rgba(176,125,44,.9),transparent) !important;
      width:60% !important;height:2px !important;border-radius:2px !important;
      animation:auGlow 2.2s ease-in-out infinite;
    }

    /* ── Input focus glow ── */
    .lfi input:focus{
      box-shadow:0 0 0 3px rgba(176,125,44,.28),0 0 18px rgba(139,26,26,.2) !important;
    }
  `;
  document.head.appendChild(flashStyle);
  document.body.prepend(flash);
  setTimeout(() => flash.remove(), 1100);

  /* ─── 2. Inject enhancements when login screen activates ─── */
  function enhance() {
    const login = document.getElementById('s-login');
    if (!login) return;

    const observer = new MutationObserver(() => {
      if (!login.classList.contains('active')) return;
      observer.disconnect();
      run(login);
    });
    observer.observe(login, { attributes: true, attributeFilter: ['class'] });
  }

  function run(login) {
    const sl    = login.querySelector('.sl');
    const split = login.querySelector('.split');
    const lw    = login.querySelector('.lw');

    if (!sl || !split) return;

    /* ── Gold bar at very top of left panel ── */
    if (!sl.querySelector('.js-gold-bar')) {
      sl.insertAdjacentHTML('afterbegin', '<div class="js-gold-bar"></div>');
    }

    /* ── Scanline texture ── */
    if (!sl.querySelector('.js-scanlines')) {
      sl.insertAdjacentHTML('afterbegin', '<div class="js-scanlines"></div>');
    }

    /* ── Armour rivets ── */
    if (!sl.querySelector('.js-rivets')) {
      sl.insertAdjacentHTML('afterbegin', `
        <div class="js-rivets">
          <div class="js-rivet" style="top:12px;left:12px;"></div>
          <div class="js-rivet" style="top:12px;right:12px;"></div>
          <div class="js-rivet" style="bottom:12px;left:12px;"></div>
          <div class="js-rivet" style="bottom:12px;right:12px;"></div>
        </div>`);
    }

    /* ── Replace logo row with SDO logo + branded title block ── */
    const logoWrap = sl.querySelector('.l-logos');
    if (logoWrap && !sl.querySelector('.js-sdo-wrap')) {
      const sdoWrap = document.createElement('div');
      sdoWrap.className = 'js-sdo-wrap';
      sdoWrap.innerHTML = `
        <img class="js-sdo-logo" src="/img/sdo.jpg"
             onerror="this.src='https://upload.wikimedia.org/wikipedia/en/a/a8/DepEd_Koronadal.png'"
             alt="SDO Koronadal City Logo"/>
        <div class="js-title-block">
          <div class="js-title-sub">Schools Division Office</div>
          <div class="js-title-main">Koronadal <span class="js-title-accent">City</span></div>
        </div>`;
      logoWrap.replaceWith(sdoWrap);
    }

    /* ── Ember particles ── */
    if (!sl.querySelector('.js-embers')) {
      const embers = document.createElement('div');
      embers.className = 'js-embers';
      for (let i = 0; i < 16; i++) {
        const e = document.createElement('div');
        e.className = 'js-ember';
        const size = 2 + Math.random() * 5;
        e.style.cssText = `
          left:${Math.random()*95}%;
          width:${size}px;height:${size}px;
          --dur:${3 + Math.random()*5}s;
          --delay:${Math.random()*6}s;
          --drift:${(Math.random()-.5)*70}px;
        `;
        embers.appendChild(e);
      }
      sl.appendChild(embers);
    }

    /* ── Shockwave at impact point ── */
    if (!split.querySelector('.js-shockwave')) {
      const sw = document.createElement('div');
      sw.className = 'js-shockwave';
      sw.style.cssText = 'position:absolute;top:50%;left:50%;z-index:10;pointer-events:none;';
      split.style.position = 'relative';
      split.style.overflow = 'visible';
      split.appendChild(sw);
      setTimeout(() => sw.remove(), 800);
    }

    /* ── Slam animation ── */
    setTimeout(() => {
      split.classList.add('js-slam');
      setTimeout(() => lw?.classList.add('js-shake'), 350);
    }, 200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhance);
  } else {
    enhance();
  }
})();
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
<script src="{{ asset('js/employee.js') }}"></script>  
<script src="{{ asset('js/app.js') }}"></script>

<!-- Print & Download PDF — load ONCE, LAST -->
<script src="{{ asset('js/print-download.js?v=5.8') }}"></script>
<script src="{{ asset('js/pdf-export.js?v=4.0') }}"></script>
<script src="{{ asset('js/logout.js') }}"></script>
</body>
</html>