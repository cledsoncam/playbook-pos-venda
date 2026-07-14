(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.objection').forEach(function (item) {
      item.addEventListener('click', function () {
        item.classList.toggle('is-open');
      });
    });
  });
})();
