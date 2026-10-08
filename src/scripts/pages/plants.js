/* Plant finder: search, type and light, mirrored in the URL. */
(function () {
  'use strict';
  var form = document.querySelector('[data-finder]');
  var grid = document.querySelector('[data-grid]');
  if (!form || !grid) return;
  var cards = Array.prototype.slice.call(grid.children);
  var q = form.querySelector('[data-q]');
  var seg = form.querySelector('[data-category]');
  var light = form.querySelector('[data-light]');
  var count = document.querySelector('[data-count]');
  var empty = document.querySelector('[data-empty]');

  function category() {
    var on = seg.querySelector('[aria-pressed="true"]');
    return on ? on.getAttribute('data-value') : '';
  }
  function setCategory(v) {
    seg.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-value') === v)); });
  }

  function apply(write) {
    var words = q.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    var c = category();
    var l = light.value;
    var shown = 0;
    cards.forEach(function (card) {
      var hay = card.getAttribute('data-search');
      var ok = words.every(function (w) { return hay.indexOf(w) !== -1; }) &&
        (!c || card.getAttribute('data-category') === c) &&
        (!l || card.getAttribute('data-light').split(' ').indexOf(l) !== -1);
      card.hidden = !ok;
      if (ok) shown++;
    });
    count.textContent = shown === 1 ? '1 plant' : shown + ' plants';
    empty.hidden = shown !== 0;
    if (write) {
      var p = new URLSearchParams();
      if (q.value.trim()) p.set('q', q.value.trim());
      if (c) p.set('category', c);
      if (l) p.set('light', l);
      history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p : ''));
    }
  }

  var params = new URLSearchParams(location.search);
  q.value = params.get('q') || '';
  setCategory(params.get('category') || '');
  var lv = params.get('light');
  if (lv === 'part-sun') lv = 'part-shade';
  if (lv && light.querySelector('option[value="' + lv + '"]')) light.value = lv;

  seg.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    setCategory(b.getAttribute('data-value'));
    apply(true);
  });
  q.addEventListener('input', function () { apply(true); });
  light.addEventListener('change', function () { apply(true); });
  apply(false);
})();
