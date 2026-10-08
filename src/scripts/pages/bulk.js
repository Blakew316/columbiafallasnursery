/*
 * Bulk Yard calculator and delivery request.
 *
 * Calculator: cubic yards = length (ft) x width (ft) x depth (in) / 12 / 27,
 * rounded up to the nearest quarter yard (the smallest amount sold).
 * Its product and yards carry into the delivery form until the customer
 * edits those fields themselves. The Friday list is the next eight Fridays
 * in the nursery's time zone.
 */
(function () {
  'use strict';

  var DELIVERY_BASE = 135;
  var money = function (n) { return '$' + Math.round(n).toLocaleString('en-US'); };
  var num = function (el) {
    var v = parseFloat(el && el.value);
    return isFinite(v) && v > 0 ? v : 0;
  };

  /* Delivery form ---------------------------------------------------------- */

  var del = document.querySelector('[data-delivery]');
  var delProduct = del && del.querySelector('[data-del-product]');
  var delYards = del && del.querySelector('[data-del-yards]');
  var estimate = del && del.querySelector('[data-del-estimate]');
  var edited = { product: false, yards: false };

  function updateEstimate() {
    if (!del) return;
    var opt = delProduct.options[delProduct.selectedIndex];
    var price = opt ? parseFloat(opt.getAttribute('data-price')) || 0 : 0;
    var yards = num(delYards);
    estimate.textContent = price && yards
      ? 'About ' + money(price * yards + DELIVERY_BASE) + ' with delivery within 10 miles.'
      : '';
  }

  if (del) {
    delProduct.addEventListener('change', function () { edited.product = true; updateEstimate(); });
    delYards.addEventListener('input', function () { edited.yards = true; updateEstimate(); });

    var fridays = del.querySelector('[data-fridays]');
    try {
      var parts = {};
      new Intl.DateTimeFormat('en-US', { timeZone: 'America/Denver', year: 'numeric', month: '2-digit', day: '2-digit' })
        .formatToParts(new Date())
        .forEach(function (p) { parts[p.type] = p.value; });
      var today = new Date(Date.UTC(+parts.year, +parts.month - 1, +parts.day));
      var ahead = (5 - today.getUTCDay() + 7) % 7 || 7; // next Friday, never today
      var fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', weekday: 'long', month: 'long', day: 'numeric' });
      fridays.innerHTML = '';
      for (var i = 0; i < 8; i++) {
        var d = new Date(today.getTime() + (ahead + i * 7) * 86400000);
        var label = fmt.format(d);
        var o = document.createElement('option');
        o.value = label;
        o.textContent = label;
        fridays.appendChild(o);
      }
    } catch (e) { /* keep "Next available Friday" */ }
  }

  /* Calculator ------------------------------------------------------------- */

  var form = document.querySelector('[data-calc]');
  if (!form) return;
  var yardsEl = document.querySelector('[data-yards]');
  var costEl = document.querySelector('[data-cost]');
  var calcProduct = form.querySelector('[data-product]');

  function update() {
    var exact = (num(document.getElementById('c-l')) * num(document.getElementById('c-w')) * (num(document.getElementById('c-d')) / 12)) / 27;
    var order = exact > 0 ? Math.max(0.25, Math.ceil(exact * 4) / 4) : 0;
    yardsEl.textContent = order ? String(order) : '0';
    var price = parseFloat(calcProduct.value) || 0;
    costEl.textContent = price && order ? 'About ' + money(order * price) : '';

    if (del) {
      if (order && !edited.yards) delYards.value = order;
      var name = calcProduct.value ? calcProduct.options[calcProduct.selectedIndex].text : '';
      if (name && !edited.product) delProduct.value = name;
      updateEstimate();
    }
  }
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  update();
})();
