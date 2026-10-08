/*
 * Bulk Yard calculators. Formulas match the previous site's:
 *   cubic yards = length(ft) × width(ft) × depth(in)/12 ÷ 27
 *   cubic feet  = L × W × H (in) ÷ 1728;  ft³ → yd³ ÷ 27
 *   gallons ↔ ft³: × 0.133681 / × 7.48052
 *   bag coverage (sq ft) = 12 × ft³ ÷ depth(in);  bags = ceil(volume ft³ ÷ bag ft³)
 * Delivery and truck guidance come from the bulk yard FAQ.
 */
(function () {
  'use strict';

  var num = function (el) {
    var v = parseFloat(el && el.value);
    return isFinite(v) && v > 0 ? v : 0;
  };
  var fmt = function (n, d) {
    return n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  };
  var money = function (n) {
    return '$' + fmt(n, 2);
  };

  /* Project calculator ---------------------------------------------------- */

  var form = document.querySelector('[data-calc]');
  var result = document.querySelector('[data-calc-result]');
  if (form && result) {
    var $ = function (sel) { return form.querySelector(sel); };
    var out = function (name) { return result.querySelector('[data-out="' + name + '"]'); };
    var line = function (name) { return result.querySelector('[data-line="' + name + '"]'); };
    var product = $('[data-calc-product]');

    // Pounds per cubic yard and what fits in a pickup, from the FAQ.
    var WEIGHTS = { rock: [2200, 2500], bark: [600, 800], soil: [1800, 2200] };
    var TRUCKS = { rock: [['1500-series', 0.25], ['2500-series', 0.5], ['3500-series', 1]], bark: [['1500-series', 1], ['2500-series', 1.5], ['3500-series', 2]] };

    function shape() {
      var r = form.querySelector('input[name="shape"]:checked');
      return r ? r.value : 'rect';
    }

    function area() {
      var s = shape();
      if (s === 'area') return num($('#calc-area'));
      if (s === 'circle') {
        var dia = num($('#calc-diameter'));
        return Math.PI * Math.pow(dia / 2, 2);
      }
      return num($('#calc-length')) * num($('#calc-width'));
    }

    function update() {
      var s = shape();
      form.querySelectorAll('[data-shape]').forEach(function (row) { row.hidden = row.getAttribute('data-shape') !== s; });
      var depth = num($('#calc-depth'));
      form.querySelectorAll('[data-depth]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(parseFloat(b.getAttribute('data-depth')) === depth));
      });
      var yards = (area() * (depth / 12)) / 27;
      var order = yards > 0 ? Math.max(0.25, Math.ceil(yards * 4) / 4) : 0;
      out('yards').textContent = order ? fmt(order, order % 1 ? 2 : 0) : '0';
      out('exact').textContent = yards > 0
        ? 'Exactly ' + fmt(yards, 2) + ' cubic yards, rounded up to the nearest quarter yard (our smallest amount).'
        : 'Enter your measurements to see an estimate.';

      var opt = product.options[product.selectedIndex];
      var price = parseFloat(product.value) || 0;
      line('cost').hidden = !(price && order);
      if (price && order) out('cost').textContent = money(order * price) + ' (' + fmt(order, 2) + ' yd × ' + money(price) + ')';

      var miles = num($('#calc-miles'));
      line('delivery').hidden = !(miles && order);
      if (miles && order) {
        var fee = 135 * Math.max(1, Math.ceil(miles / 10));
        out('delivery').textContent = money(fee) + ' for ' + fmt(miles, 0) + ' miles, delivered on Friday';
      }

      var kind = opt && opt.getAttribute('data-weight');
      var w = kind && WEIGHTS[kind];
      line('weight').hidden = !(w && order);
      if (w && order) out('weight').textContent = fmt(order * w[0], 0) + '–' + fmt(order * w[1], 0) + ' lbs';

      var truck = out('truck');
      var guide = kind && TRUCKS[kind === 'soil' ? 'rock' : kind];
      truck.hidden = !(guide && order);
      if (guide && order) {
        var fits = guide.filter(function (t) { return t[1] >= order; })[0];
        var load = kind === 'bark' ? 14 : 12;
        truck.textContent = fits
          ? 'Fits in a ' + fits[0] + ' pickup in one trip. Please remove any topper before you come.'
          : order > load
            ? 'More than one delivery truck holds (' + load + ' yd). We will plan it with you.'
            : 'Too much for one pickup trip. Delivery trucks hold up to ' + load + ' yards.';
      }
    }

    form.addEventListener('input', update);
    form.addEventListener('change', update);
    form.addEventListener('click', function (e) {
      var b = e.target.closest('[data-depth]');
      if (!b) return;
      $('#calc-depth').value = b.getAttribute('data-depth');
      update();
    });
    update();
  }

  /* Small converters ------------------------------------------------------ */

  var TOOLS = {
    cuft: function (f) {
      var v = (num(f.querySelector('#t1-l')) * num(f.querySelector('#t1-w')) * num(f.querySelector('#t1-h'))) / 1728;
      return v ? fmt(v, 2) + ' cubic feet (' + fmt(v / 27, 2) + ' yd³)' : '—';
    },
    ft2yd: function (f) {
      var v = num(f.querySelector('#t2-cf'));
      return v ? fmt(v / 27, 2) + ' cubic yards' : '—';
    },
    gal: function (f) {
      var v = num(f.querySelector('#t3-v'));
      if (!v) return '—';
      return f.querySelector('#t3-dir').value === 'g2c' ? fmt(v * 0.133681, 2) + ' cubic feet' : fmt(v * 7.48052, 2) + ' gallons';
    },
    cover: function (f) {
      var cf = num(f.querySelector('#t4-cf'));
      var d = num(f.querySelector('#t4-d'));
      return cf && d ? 'Covers ' + fmt((12 * cf) / d, 2) + ' sq ft at ' + d + ' inches deep' : '—';
    },
    bags: function (f) {
      var vol = num(f.querySelector('#t5-l')) * num(f.querySelector('#t5-w')) * (num(f.querySelector('#t5-d')) / 12);
      var bag = num(f.querySelector('#t5-b'));
      return vol && bag ? 'About ' + Math.ceil(vol / bag) + ' bags' : '—';
    },
  };
  document.querySelectorAll('[data-tool]').forEach(function (f) {
    var fn = TOOLS[f.getAttribute('data-tool')];
    var o = f.querySelector('[data-out]');
    var run = function () { o.textContent = fn(f); };
    f.addEventListener('input', run);
    f.addEventListener('change', run);
    run();
  });
})();
