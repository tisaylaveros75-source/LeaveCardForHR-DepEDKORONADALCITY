/* ============================================================
   SDO Koronadal City — Leave Card System
   logout.js — Logout logic (doLogout)

   Depends on: app.js (apiCall, state, showScreen)
   Load order in HTML:
     <script src="js/leave-logic.js"></script>
     <script src="js/leave-card.js"></script>
     <script src="js/modals.js"></script>
     <script src="js/personnel-list.js"></script>
     <script src="js/logout.js"></script>
     <script src="js/app.js"></script>
   ============================================================ */

'use strict';

async function doLogout() {
  try {
    await apiCall('logout', {}, 'POST');
  } catch (e) {
    // Even if the server call fails, still clear the client session
    console.warn('Logout API call failed, clearing client session anyway.', e);
  }

  // Clear all session/local storage
  sessionStorage.clear();

  // Reset app state
  state.role          = null;
  state.isAdmin       = false;
  state.isEncoder     = false;
  state.isSchoolAdmin = false;
  state.db            = [];
  state.curId         = null;
  state.page          = 'home';

  state.adminCfg       = { id: '', password: '', name: 'Administrator' };
  state.encoderCfg     = { id: '', password: '', name: 'Encoder' };
  state.schoolAdminCfg = { id: '', dbId: 0,      name: 'School Admin' };

  // Remove dynamically created card-view page if present
  document.getElementById('pg-card-view')?.remove();

  // Clear all open row menus
  document.querySelectorAll('.row-menu-dd.open').forEach(m => m.classList.remove('open'));

  // Close any open modals
  ['eraMo','registerMo','logoutMo','adminProfileMo','encoderProfileMo','saProfileMo'].forEach(id => {
    document.getElementById(id)?.remove();
  });

  // Navigate back to login screen
  showScreen('login');

  // Clear login form fields
  const lid = document.getElementById('lid');
  const lpw = document.getElementById('lpw');
  const err = document.getElementById('loginErr');
  if (lid) lid.value = '';
  if (lpw) { lpw.value = ''; lpw.type = 'password'; }
  if (err) { err.textContent = ''; err.style.display = 'none'; }

  // Reset eye button
  const eyeBtn = document.getElementById('eyeBtn');
  if (eyeBtn) eyeBtn.textContent = '👁';
}

window.doLogout = doLogout;