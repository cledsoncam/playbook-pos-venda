(function () {
  'use strict';

  var TOTAL_CHAPTERS = 15;
  var STORAGE_KEY = 'pv-progress-v1';
  var CHAPTER_TITLES = {
    1: 'O papel do pós-venda e por que ele gera receita',
    2: 'Segmentação e ticket médio',
    3: 'Portfólio de serviços e como precificar',
    4: 'Estrutura de custos e precificação dos serviços',
    5: 'Jornada do cliente e o pitch certo em cada etapa',
    6: 'Mensagens automáticas (disparo via WhatsApp)',
    7: 'Gestão de feedback e melhoria contínua (NPS)',
    8: 'Regra de indicação',
    9: 'Estratégia de abordagem',
    10: 'Técnicas de vendas consultivas',
    11: 'Contornando as objeções mais comuns',
    12: 'Gestão de reclamações e resolução de problemas',
    13: 'Estratégia de rentabilização com monitoramento',
    14: 'Checklist rápido antes de abordar',
    15: 'Indicadores e metas',
  };

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

    var quickstart = document.querySelector('[data-quickstart]');
    if (quickstart) {
      var next = 1;
      for (var i = 1; i <= TOTAL_CHAPTERS; i++) {
        if (!isDone(progress, i)) { next = i; break; }
        next = i;
      }
      var allDone = done >= TOTAL_CHAPTERS;
      var padded = String(next).padStart(2, '0');
      quickstart.setAttribute('href', 'cap-' + padded + '.html');
      var qLabel = quickstart.querySelector('[data-quickstart-label]');
      var qValue = quickstart.querySelector('[data-quickstart-value]');
      if (qLabel) qLabel.textContent = done === 0 ? 'Começar curso' : (allDone ? 'Revisar curso' : 'Continuar curso');
      if (qValue) qValue.textContent = 'Capítulo ' + padded + ' — ' + CHAPTER_TITLES[next];
    }

    var ringFill = document.querySelector('[data-progress-ring-fill]');
    var pctLabel = document.querySelector('[data-progress-pct]');
    if (ringFill) {
      var circumference = 2 * Math.PI * 25;
      ringFill.style.strokeDasharray = circumference;
      ringFill.style.strokeDashoffset = circumference * (1 - pct / 100);
    }
    if (pctLabel) pctLabel.textContent = pct + '%';
  }

  function initReveal() {
    var container = document.querySelector('.content');
    if (!container) return;
    var children = Array.prototype.slice.call(container.children);
    if (!children.length) return;

    children.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.setProperty('--reveal-delay', (i % 6) * 60 + 'ms');
    });

    if (!('IntersectionObserver' in window)) {
      children.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

    children.forEach(function (el) { observer.observe(el); });
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
    initReveal();

    var markBtn = document.querySelector('[data-mark-done]');
    if (markBtn) markBtn.addEventListener('click', toggleCurrentChapter);

    var menuBtn = document.querySelector('[data-menu-toggle]');
    if (menuBtn) {
      menuBtn.addEventListener('click', function () {
        document.body.classList.toggle('sidebar-open');
      });
    }

    var scrim = document.querySelector('[data-sidebar-scrim]');
    if (scrim) {
      scrim.addEventListener('click', function () {
        document.body.classList.remove('sidebar-open');
      });
    }

    document.querySelectorAll('.sidebar__link').forEach(function (link) {
      link.addEventListener('click', function () {
        document.body.classList.remove('sidebar-open');
      });
    });
  });
})();
