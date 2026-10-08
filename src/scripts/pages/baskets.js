/* Custom Baskets: lookbook light filter and the design lightbox. */
(function () {
  'use strict';
  var grid = document.querySelector('[data-lookbook]');
  var bar = document.querySelector('[data-lookbook-filters]');
  var dialog = document.querySelector('[data-lightbox]');
  var dataEl = document.querySelector('[data-lookbook-data]');
  if (!grid) return;
  var designs = [];
  try { designs = JSON.parse(dataEl.textContent); } catch (e) {}

  if (bar) {
    bar.addEventListener('click', function (e) {
      var chip = e.target.closest('[data-light]');
      if (!chip) return;
      var light = chip.getAttribute('data-light');
      bar.querySelectorAll('[data-light]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === chip)); });
      grid.querySelectorAll('.look').forEach(function (li) {
        li.hidden = light !== 'all' && li.getAttribute('data-light') !== light;
      });
    });
  }

  if (!dialog || typeof dialog.showModal !== 'function') return;
  var img = dialog.querySelector('[data-lightbox-img]');
  var caption = dialog.querySelector('[data-lightbox-caption]');
  var current = 0;
  var opener = null;

  function visibleIndexes() {
    return Array.prototype.slice.call(grid.querySelectorAll('.look:not([hidden]) [data-index]'))
      .map(function (b) { return parseInt(b.getAttribute('data-index'), 10); });
  }
  function show(i) {
    current = i;
    var d = designs[i];
    if (!d) return;
    dialog.classList.remove('has-photo');
    img.alt = d.name + ', ' + d.light.toLowerCase() + ' basket design';
    img.onload = function () { dialog.classList.add('has-photo'); };
    img.onerror = function () { dialog.classList.remove('has-photo'); };
    if (d.src) img.src = d.src; else img.removeAttribute('src');
    caption.innerHTML = '';
    var strong = document.createElement('strong');
    strong.textContent = d.name;
    caption.appendChild(strong);
    caption.appendChild(document.createTextNode(' ' + d.light));
  }
  function step(dir) {
    var list = visibleIndexes();
    var pos = list.indexOf(current);
    show(list[(pos + dir + list.length) % list.length]);
  }

  grid.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-index]');
    if (!btn) return;
    opener = btn;
    show(parseInt(btn.getAttribute('data-index'), 10));
    dialog.showModal();
  });
  dialog.querySelector('[data-lightbox-close]').addEventListener('click', function () { dialog.close(); });
  dialog.querySelector('[data-lightbox-prev]').addEventListener('click', function () { step(-1); });
  dialog.querySelector('[data-lightbox-next]').addEventListener('click', function () { step(1); });
  dialog.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
  dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', function () { if (opener) opener.focus(); });
})();
