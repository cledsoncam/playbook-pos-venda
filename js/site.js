(function () {
  'use strict';

  var TOTAL_CHAPTERS = 15;
  var STORAGE_KEY = 'pv-progress-v1';

  function getProgress() {
    try {
      var raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return raw && typeof raw === 'object' ? raw : {};
    } catch (e) {
      return {};
    }
  }

  function saveProgress(progress) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {}
  }

  function isDone(progress, num) {
    return !!progress[String(num)];
  }

  function countDone(progress) {
    var n = 0;
    for (var i = 1; i <= TOTAL_CHAPTERS; i++) if (isDone(progress, i)) n++;
    return n;
  }

  function renderProgressUI() {
    var progress = getProgress();
    var done = countDone(progress);
    var pct = Math.round((done / TOTAL_CHAPTERS) * 100);

    var fill = document.querySelector('[data-progress-fill]');
    var label = document.querySelector('[data-progress-label]');
    if (fill) fill.style.width = pct + '%';
    if (label) label.textContent = done + '/' + TOTAL_CHAPTERS;

    document.querySelectorAll('.sidebar__link[data-num]').forEach(function (link) {
      var num = link.getAttribute('data-num');
      link.classList.toggle('is-done', isDone(progress, num));
    });

    document.querySelectorAll('[data-chapter-badge]').forEach(function (badge) {
      var num = badge.getAttribute('data-chapter-badge');
      var d = isDone(progress, num);
      badge.classList.toggle('is-done', d);
      badge.textContent = d ? 'Concluído ✓' : 'Não iniciado';
    });

    var markBtn = document.querySelector('[data-mark-done]');
    if (markBtn) {
      var current = markBtn.getAttribute('data-mark-done');
      var done_ = isDone(progress, current);
      markBtn.classList.toggle('is-done', done_);
      markBtn.textContent = done_ ? 'Concluído ✓' : 'Marcar como concluído';
    }
  }

  function toggleCurrentChapter() {
    var markBtn = document.querySelector('[data-mark-done]');
    if (!markBtn) return;
    var current = markBtn.getAttribute('data-mark-done');
    var progress = getProgress();
    progress[current] = !isDone(progress, current);
    saveProgress(progress);
    renderProgressUI();
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderProgressUI();

    var markBtn = document.querySelector('[data-mark-done]');
    if (markBtn) markBtn.addEventListener('click', toggleCurrentChapter);

    var menuBtn = document.querySelector('[data-menu-toggle]');
    if (menuBtn) {
      menuBtn.addEventListener('click', function () {
        document.body.classList.toggle('sidebar-open');
      });
    }

    document.querySelectorAll('.sidebar__link').forEach(function (link) {
      link.addEventListener('click', function () {
        document.body.classList.remove('sidebar-open');
      });
    });
  });
})();
