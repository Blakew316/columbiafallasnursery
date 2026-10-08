/*
 * Plant Finder: filters the server-rendered cards in place and mirrors the
 * state in the URL (?q, category, light, zone, feature) so searches can be
 * shared and the back button works.
 */
(function () {
  'use strict';
  var form = document.querySelector('[data-finder-form]');
  var grid = document.querySelector('[data-finder-grid]');
  if (!form || !grid) return;

  var cards = Array.prototype.slice.call(grid.children);
  var input = form.querySelector('[data-finder-q]');
  var count = form.querySelector('[data-finder-count]');
  var sort = form.querySelector('[data-finder-sort]');
  var empty = document.querySelector('[data-finder-empty]');
  var clears = document.querySelectorAll('[data-finder-clear]');
  var activeCount = form.querySelector('[data-active-count]');
  var filters = form.querySelector('[data-filters]');
  var groups = {};
  form.querySelectorAll('[data-filter]').forEach(function (fs) {
    groups[fs.getAttribute('data-filter')] = fs;
  });
  var original = cards.slice();

  function selected(name) {
    var fs = groups[name];
    if (!fs) return [];
    return Array.prototype.slice
      .call(fs.querySelectorAll('[aria-pressed="true"]'))
      .map(function (b) { return b.getAttribute('data-value'); });
  }

  function setSelected(name, values) {
    var fs = groups[name];
    if (!fs) return;
    fs.querySelectorAll('[data-value]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(values.indexOf(b.getAttribute('data-value')) !== -1));
    });
  }

  function words(s) {
    return s.toLowerCase().trim().split(/\s+/).filter(Boolean);
  }

  function apply(pushUrl) {
    var q = words(input.value);
    var cat = selected('category');
    var light = selected('light');
    var zone = selected('zone')[0];
    var feat = selected('feature');
    var shown = 0;
    cards.forEach(function (card) {
      var hay = card.getAttribute('data-search');
      var ok = q.every(function (w) { return hay.indexOf(w) !== -1; });
      if (ok && cat.length) ok = cat.indexOf(card.getAttribute('data-category')) !== -1;
      if (ok && light.length) {
        var l = card.getAttribute('data-light').split(' ');
        ok = light.some(function (x) { return l.indexOf(x) !== -1; });
      }
      if (ok && zone) {
        var z = card.getAttribute('data-zone');
        ok = z !== '' && parseInt(z, 10) <= parseInt(zone, 10);
      }
      if (ok && feat.length) {
        var f = card.getAttribute('data-features').split(' ');
        ok = feat.every(function (x) { return f.indexOf(x) !== -1; });
      }
      card.hidden = !ok;
      if (ok) shown++;
    });
    count.textContent = shown === 1 ? '1 plant' : shown + ' plants';
    empty.hidden = shown !== 0;
    var nActive = cat.length + light.length + (zone ? 1 : 0) + feat.length;
    var any = nActive + q.length > 0;
    clears.forEach(function (b) { if (b.closest('form')) b.hidden = !any; });
    activeCount.hidden = !nActive;
    activeCount.textContent = nActive ? String(nActive) : '';
    if (pushUrl) writeUrl({ q: input.value.trim(), category: cat, light: light, zone: zone ? [zone] : [], feature: feat });
  }

  function writeUrl(state) {
    var params = new URLSearchParams();
    if (state.q) params.set('q', state.q);
    ['category', 'light', 'zone', 'feature'].forEach(function (k) {
      if (state[k].length) params.set(k, state[k].join(','));
    });
    if (sort.value !== 'name') params.set('sort', sort.value);
    var url = location.pathname + (params.toString() ? '?' + params.toString() : '');
    history.replaceState(null, '', url);
  }

  function readUrl() {
    var params = new URLSearchParams(location.search);
    input.value = params.get('q') || '';
    ['category', 'light', 'zone', 'feature'].forEach(function (k) {
      setSelected(k, (params.get(k) || '').split(',').filter(Boolean));
    });
    var s = params.get('sort');
    if (s && sort.querySelector('option[value="' + s + '"]')) sort.value = s;
  }

  function reorder() {
    var mode = sort.value;
    var list = original.slice();
    if (mode !== 'name') {
      list.sort(function (a, b) {
        var ha = parseFloat(a.getAttribute('data-height'));
        var hb = parseFloat(b.getAttribute('data-height'));
        if (isNaN(ha)) return 1;
        if (isNaN(hb)) return -1;
        return mode === 'height-asc' ? ha - hb : hb - ha;
      });
    }
    var frag = document.createDocumentFragment();
    list.forEach(function (c) { frag.appendChild(c); });
    grid.appendChild(frag);
  }

  form.addEventListener('click', function (e) {
    var chip = e.target.closest('.chip[data-value]');
    if (!chip) return;
    var fs = chip.closest('[data-filter]');
    var on = chip.getAttribute('aria-pressed') !== 'true';
    if (fs.hasAttribute('data-single')) {
      fs.querySelectorAll('[data-value]').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
    }
    chip.setAttribute('aria-pressed', String(on));
    apply(true);
  });

  var t;
  input.addEventListener('input', function () {
    clearTimeout(t);
    t = setTimeout(function () { apply(true); }, 120);
  });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
  });
  sort.addEventListener('change', function () { reorder(); apply(true); });
  clears.forEach(function (b) {
    b.addEventListener('click', function () {
      input.value = '';
      Object.keys(groups).forEach(function (k) { setSelected(k, []); });
      apply(true);
      input.focus();
    });
  });

  // Collapse the filter panel on small screens unless filters are in use.
  var small = window.matchMedia('(max-width: 760px)');
  readUrl();
  if (small.matches && filters && !location.search.match(/category|light|zone|feature/)) filters.open = false;
  reorder();
  apply(false);
})();
