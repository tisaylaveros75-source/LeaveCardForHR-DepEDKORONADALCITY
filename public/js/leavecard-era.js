/*
  WHAT THIS FILE DOES:
  This is a small utility file for showing error messages related to "eras".

  An "era" is a section of the leave card that represents a period under
  a specific employment category (e.g. Teaching or Non-Teaching).
  When someone tries to delete an era that still has records inside it,
  this file shows a warning toast (a small popup message at the bottom of the screen).

  KEY FUNCTION:
  - showEraDeleteError(msg) → displays a temporary error toast with the given message.
                              The toast disappears automatically after 4 seconds.
*/
'use strict';

function showEraDeleteError(msg) {
  let toast = document.getElementById('era-del-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id        = 'era-del-toast';
    toast.className = 'era-del-error';
    document.body.appendChild(toast);
  }
  toast.textContent = '⚠️  ' + msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 4000);
}