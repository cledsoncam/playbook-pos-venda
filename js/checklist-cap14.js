(function () {
  'use strict';
  var STORAGE_KEY = 'playbook-checklist';

  document.addEventListener('DOMContentLoaded', function () {
    var items = document.querySelectorAll('.checklist li');
    if (!items.length) return;

    var saved = [];
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch (e) {}
    if (!Array.isArray(saved)) saved = [];

    var counter = document.querySelector('[data-checklist-count]');

    function updateCounter() {
      var done = document.querySelectorAll('.checklist li.is-checked').length;
      if (counter) counter.textContent = done + '/' + items.length + ' concluídos';
    }

    function save() {
      var state = Array.prototype.map.call(items, function (li) {
        return li.classList.contains('is-checked');
      });
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
    }

    items.forEach(function (li, i) {
      if (saved[i]) li.classList.add('is-checked');
      li.addEventListener('click', function () {
        li.classList.toggle('is-checked');
        save();
        updateCounter();
      });
    });

    updateCounter();
  });
})();
