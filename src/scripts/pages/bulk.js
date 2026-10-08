/*
 * Bulk Yard calculator. Same formula as the yard:
 * cubic yards = length (ft) x width (ft) x depth (in) / 12 / 27,
 * rounded up to the nearest quarter yard (the smallest amount sold).
 */
(function () {
  'use strict';
  var form = document.querySelector('[data-calc]');
  if (!form) return;
  var yardsEl = document.querySelector('[data-yards]');
  var costEl = document.querySelector('[data-cost]');
  var n = function (id) {
    var v = parseFloat(document.getElementById(id).value);
    return isFinite(v) && v > 0 ? v : 0;
  };
  function update() {
    var exact = (n('c-l') * n('c-w') * (n('c-d') / 12)) / 27;
    var order = exact > 0 ? Math.max(0.25, Math.ceil(exact * 4) / 4) : 0;
    yardsEl.textContent = order ? String(order) : '0';
    var price = parseFloat(form.querySelector('[data-product]').value) || 0;
    costEl.textContent = price && order ? 'About $' + Math.round(order * price).toLocaleString('en-US') : '';
  }
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  update();
})();
