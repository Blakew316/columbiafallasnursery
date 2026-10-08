/* Garden Guides search/topic filter, and "this month" on the calendar. */
(function () {
  'use strict';

  var q = document.querySelector('[data-guide-q]');
  var topics = document.querySelector('[data-guide-topics]');
  if (q && topics) {
    var count = document.querySelector('[data-guide-count]');
    var empty = document.querySelector('[data-guide-empty]');
    var groups = document.querySelectorAll('[data-group]');
    var topic = 'all';
    var run = function () {
      var words = q.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
      var total = 0;
      groups.forEach(function (g) {
        var inTopic = topic === 'all' || g.getAttribute('data-group') === topic;
        var shown = 0;
        g.querySelectorAll('[data-title]').forEach(function (li) {
          var t = li.getAttribute('data-title');
          var ok = inTopic && words.every(function (w) { return t.indexOf(w) !== -1; });
          li.hidden = !ok;
          if (ok) shown++;
        });
        g.hidden = shown === 0;
        total += shown;
      });
      count.textContent = total === 1 ? '1 guide' : total + ' guides';
      empty.hidden = total !== 0;
    };
    q.addEventListener('input', run);
    topics.addEventListener('click', function (e) {
      var b = e.target.closest('[data-topic]');
      if (!b) return;
      topic = b.getAttribute('data-topic');
      topics.querySelectorAll('[data-topic]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      run();
    });
    var initial = new URLSearchParams(location.search).get('q');
    if (initial) q.value = initial;
    run();
  }

  var cal = document.querySelector('[data-cal]');
  if (cal && window.CN) {
    var month = parseInt(window.CN.zonedNow().md.slice(0, 2), 10);
    cal.querySelectorAll('[data-month]').forEach(function (li) {
      if (parseInt(li.getAttribute('data-month'), 10) === month) li.setAttribute('aria-current', 'date');
      else li.removeAttribute('aria-current');
    });
  }
})();
