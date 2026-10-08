/* Home: show this month's garden tasks (in the nursery's time zone). */
(function () {
  'use strict';
  function run() {
    var panels = document.querySelectorAll('.month__panel[data-month]');
    if (!panels.length || !window.CN) return;
    var month = parseInt(window.CN.zonedNow().md.slice(0, 2), 10);
    panels.forEach(function (p) {
      p.hidden = parseInt(p.getAttribute('data-month'), 10) !== month;
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
