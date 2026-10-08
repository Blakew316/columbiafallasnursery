/* Garden Guides search, and the current month on the calendar. */
(function () {
  'use strict';
  var q = document.querySelector('[data-guide-q]');
  if (q) {
    var groups = document.querySelectorAll('[data-group]');
    var empty = document.querySelector('[data-guide-empty]');
    q.addEventListener('input', function () {
      var words = q.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
      var total = 0;
      groups.forEach(function (g) {
        var shown = 0;
        g.querySelectorAll('[data-title]').forEach(function (li) {
          var t = li.getAttribute('data-title');
          var ok = words.every(function (w) { return t.indexOf(w) !== -1; });
          li.hidden = !ok;
          if (ok) shown++;
        });
        g.hidden = !shown;
        total += shown;
      });
      empty.hidden = total !== 0;
    });
  }
  var cal = document.querySelector('[data-cal]');
  if (cal) {
    var month;
    try {
      month = +new Intl.DateTimeFormat('en-US', { timeZone: 'America/Denver', month: 'numeric' }).format(new Date());
    } catch (e) {
      month = new Date().getMonth() + 1;
    }
    cal.querySelectorAll('[data-month]').forEach(function (li) {
      if (+li.getAttribute('data-month') === month) li.setAttribute('aria-current', 'date');
      else li.removeAttribute('aria-current');
    });
  }
})();
