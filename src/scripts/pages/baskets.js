/* Custom Baskets: sun/shade filter and the design viewer. */
(function () {
  'use strict';
  var list = document.querySelector('[data-look]');
  var filter = document.querySelector('[data-look-filter]');
  var dialog = document.querySelector('[data-lightbox]');
  if (!list) return;
  var designs = [];
  try { designs = JSON.parse(document.querySelector('[data-look-data]').textContent); } catch (e) {}

  if (filter) {
    filter.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var v = b.getAttribute('data-value');
      filter.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      list.querySelectorAll('li').forEach(function (li) { li.hidden = !!v && li.getAttribute('data-group') !== v; });
    });
  }

  if (!dialog || typeof dialog.showModal !== 'function') return;
  var img = dialog.querySelector('[data-img]');
  var caption = dialog.querySelector('[data-caption]');
  var current = 0;
  var opener = null;
  function visible() {
    return Array.prototype.slice.call(list.querySelectorAll('li:not([hidden]) [data-index]')).map(function (b) { return +b.getAttribute('data-index'); });
  }
  function show(i) {
    current = i;
    var d = designs[i];
    img.src = d.src || '';
    img.alt = d.name + ', ' + d.light;
    caption.textContent = d.name + ', ' + d.light;
  }
  function step(dir) {
    var v = visible();
    show(v[(v.indexOf(current) + dir + v.length) % v.length]);
  }
  list.addEventListener('click', function (e) {
    var b = e.target.closest('[data-index]');
    if (!b) return;
    opener = b;
    show(+b.getAttribute('data-index'));
    dialog.showModal();
  });
  dialog.querySelector('[data-close]').addEventListener('click', function () { dialog.close(); });
  dialog.querySelector('[data-prev]').addEventListener('click', function () { step(-1); });
  dialog.querySelector('[data-next]').addEventListener('click', function () { step(1); });
  dialog.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
  dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
  // Swipe left or right on the photo to move between designs.
  var x0 = null;
  img.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  img.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  });
  dialog.addEventListener('close', function () { if (opener) opener.focus(); });

  // "Choose this design" fills in the order form and takes you there.
  var choose = dialog.querySelector('[data-choose]');
  var designSelect = document.querySelector('[data-order-design]');
  var lightSelect = document.getElementById('o-light');
  if (choose && designSelect) {
    choose.addEventListener('click', function (e) {
      e.preventDefault();
      var d = designs[current];
      designSelect.value = d.name;
      if (lightSelect) {
        Array.prototype.forEach.call(lightSelect.options, function (o) {
          if (o.value.toLowerCase() === String(d.light).toLowerCase()) lightSelect.value = o.value;
        });
      }
      opener = null;
      dialog.close();
      var order = document.getElementById('order');
      order.scrollIntoView();
      designSelect.focus({ preventScroll: true });
    });
  }
})();
