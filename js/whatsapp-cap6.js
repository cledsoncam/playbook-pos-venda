(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var buttons = document.querySelectorAll('.msg-picker [data-msg]');
    var bubble = document.querySelector('[data-msg-output]');
    if (!buttons.length || !bubble) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        bubble.textContent = btn.getAttribute('data-msg');
      });
    });
  });
})();
