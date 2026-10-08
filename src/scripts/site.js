/*
 * Site-wide behaviour. No dependencies; loaded with `defer` on every page.
 *   - header state and the mobile menu sheet
 *   - live open/closed status in the nursery's time zone
 *   - date-ranged announcements ([data-start]/[data-end], "MM-DD")
 *   - photo frames that fall back to their illustration
 *   - hero panorama parallax
 *   - click-to-load Google Map
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var config = readConfig();
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function readConfig() {
    var el = document.getElementById('site-config');
    try {
      return el ? JSON.parse(el.textContent) : {};
    } catch (e) {
      return {};
    }
  }

  /* Time in the nursery's zone ------------------------------------------ */

  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function zonedNow() {
    var tz = (config.hours && config.hours.timeZone) || 'America/Denver';
    var parts = {};
    try {
      new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        weekday: 'short',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
      })
        .formatToParts(new Date())
        .forEach(function (p) {
          parts[p.type] = p.value;
        });
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), minutes: d.getHours() * 60 + d.getMinutes(), md: pad(d.getMonth() + 1) + '-' + pad(d.getDate()) };
    }
    return {
      day: DAYS.indexOf(parts.weekday),
      minutes: (parseInt(parts.hour, 10) % 24) * 60 + parseInt(parts.minute, 10),
      md: parts.month + '-' + parts.day,
    };
  }

  function pad(n) {
    return (n < 10 ? '0' : '') + n;
  }

  function toMinutes(hhmm) {
    var p = hhmm.split(':');
    return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
  }

  function formatTime(hhmm) {
    var m = toMinutes(hhmm);
    var h = Math.floor(m / 60);
    var min = m % 60;
    var suffix = h >= 12 ? 'pm' : 'am';
    var h12 = h % 12 || 12;
    return h12 + (min ? ':' + pad(min) : '') + ' ' + suffix;
  }

  /** True when "MM-DD" `md` falls in the inclusive window, wrapping New Year. */
  function inWindow(md, start, end) {
    return start <= end ? md >= start && md <= end : md >= start || md <= end;
  }

  /* Open status ----------------------------------------------------------- */

  function openStatus() {
    var h = config.hours;
    if (!h || !h.week) return null;
    var now = zonedNow();
    var off = h.offSeason;
    if (off && inWindow(now.md, off.start, off.end)) {
      return { state: 'season', short: 'Call for winter hours', long: 'Winter hours vary, so please call before visiting.' };
    }
    var today = h.week[now.day];
    if (today && now.minutes >= toMinutes(today.open) && now.minutes < toMinutes(today.close)) {
      var closing = toMinutes(today.close) - now.minutes <= 30;
      return {
        state: closing ? 'closing' : 'open',
        short: (closing ? 'Closing at ' : 'Open now until ') + formatTime(today.close),
        long: 'Open today until ' + formatTime(today.close) + '.',
      };
    }
    if (today && now.minutes < toMinutes(today.open)) {
      return { state: 'closed', short: 'Opens today at ' + formatTime(today.open), long: 'Opens today at ' + formatTime(today.open) + '.' };
    }
    for (var i = 1; i <= 7; i++) {
      var d = (now.day + i) % 7;
      var next = h.week[d];
      if (next) {
        var when = i === 1 ? 'tomorrow' : DAY_NAMES[d];
        return {
          state: 'closed',
          short: 'Closed now. Opens ' + (i === 1 ? 'tomorrow' : DAYS[d]) + ' ' + formatTime(next.open),
          long: 'Closed now. Opens ' + when + ' at ' + formatTime(next.open) + '.',
        };
      }
    }
    return null;
  }

  function renderStatus() {
    var s = openStatus();
    if (!s) return;
    document.querySelectorAll('[data-open-status]').forEach(function (el) {
      el.setAttribute('data-state', s.state);
      var text = el.querySelector('.status__text');
      if (text) text.textContent = s.short;
    });
    document.querySelectorAll('[data-open-status-text]').forEach(function (el) {
      el.textContent = s.long;
    });
    var today = zonedNow().day;
    document.querySelectorAll('tr[data-day]').forEach(function (tr) {
      tr.classList.toggle('is-today', parseInt(tr.getAttribute('data-day'), 10) === today);
    });
  }

  /* Announcements and other date-ranged content -------------------------- */

  function renderDated() {
    var md = zonedNow().md;
    var anyRibbon = false;
    document.querySelectorAll('[data-start][data-end]').forEach(function (el) {
      var on = inWindow(md, el.getAttribute('data-start'), el.getAttribute('data-end'));
      el.hidden = !on;
      if (on && el.closest('[data-announcements]')) anyRibbon = true;
    });
    var ribbon = document.querySelector('[data-announcements]');
    if (ribbon) {
      // One ribbon item at a time: the first active one.
      var first = true;
      ribbon.querySelectorAll('[data-start]').forEach(function (el) {
        if (!el.hidden) {
          if (!first) el.hidden = true;
          first = false;
        }
      });
      ribbon.hidden = !anyRibbon || document.body.classList.contains('has-hero-announcement');
    }
  }

  /* Header and menu ------------------------------------------------------- */

  function initHeader() {
    var header = document.querySelector('[data-header]');
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 4);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    var toggle = header.querySelector('[data-menu-toggle]');
    var sheet = header.querySelector('[data-menu-sheet]');
    if (!toggle || !sheet) return;

    function focusables() {
      return Array.prototype.slice.call(sheet.querySelectorAll('a[href], button:not([disabled])'));
    }
    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('.visually-hidden').textContent = open ? 'Close menu' : 'Menu';
      header.classList.toggle('is-menu-open', open);
      root.classList.toggle('menu-open', open);
      if (open) {
        sheet.hidden = false;
        requestAnimationFrame(function () {
          sheet.classList.add('is-open');
        });
        var first = focusables()[0];
        if (first) first.focus({ preventScroll: true });
      } else {
        sheet.classList.remove('is-open');
        var hide = function () {
          if (!sheet.classList.contains('is-open')) sheet.hidden = true;
        };
        if (reduceMotion.matches) hide();
        else setTimeout(hide, 280);
      }
    }
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    sheet.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      if (e.key === 'Escape') {
        setOpen(false);
        toggle.focus();
      } else if (e.key === 'Tab') {
        var items = [toggle].concat(focusables());
        var i = items.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          items[items.length - 1].focus();
        } else if (!e.shiftKey && i === items.length - 1) {
          e.preventDefault();
          items[0].focus();
        }
      }
    });
    window.matchMedia('(min-width: 1080px)').addEventListener('change', function (mq) {
      if (mq.matches) setOpen(false);
    });
  }

  /* Photo frames ---------------------------------------------------------- */

  function initFrames() {
    document.querySelectorAll('.frame > img').forEach(function (img) {
      var frame = img.parentNode;
      var done = function () {
        if (img.naturalWidth > 0) frame.classList.add('is-loaded');
        else frame.classList.add('is-failed');
      };
      if (img.complete) done();
      else {
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', function () {
          frame.classList.add('is-failed');
        }, { once: true });
      }
    });
  }

  /* Hero parallax --------------------------------------------------------- */

  function initParallax() {
    var hero = document.querySelector('[data-parallax]');
    if (!hero) return;
    var svg = hero.querySelector('svg');
    var layers = Array.prototype.slice.call(hero.querySelectorAll('[data-depth]'));
    if (!svg || !layers.length) return;
    var ticking = false;
    var visible = true;
    function apply() {
      ticking = false;
      if (reduceMotion.matches) {
        layers.forEach(function (l) {
          l.style.transform = '';
        });
        return;
      }
      var rect = svg.getBoundingClientRect();
      var scale = Math.max(rect.width / 2400, rect.height / 1000) || 1;
      var y = Math.max(0, Math.min(window.scrollY, hero.offsetHeight));
      layers.forEach(function (l) {
        var depth = parseFloat(l.getAttribute('data-depth')) || 0;
        l.style.transform = 'translate3d(0,' + ((y * depth) / scale).toFixed(2) + 'px,0)';
      });
    }
    function request() {
      if (!ticking && visible) {
        ticking = true;
        requestAnimationFrame(apply);
      }
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) request();
      }).observe(hero);
    }
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    reduceMotion.addEventListener('change', request);
    apply();
  }

  /* Map ------------------------------------------------------------------- */

  function initMaps() {
    document.querySelectorAll('[data-map]').forEach(function (map) {
      var btn = map.querySelector('[data-map-load]');
      if (!btn) return;
      btn.addEventListener('click', function () {
        var iframe = document.createElement('iframe');
        iframe.src = map.getAttribute('data-src');
        iframe.title = map.getAttribute('data-title') || 'Map';
        iframe.loading = 'lazy';
        iframe.referrerPolicy = 'no-referrer-when-downgrade';
        iframe.setAttribute('allowfullscreen', '');
        map.classList.add('is-live');
        map.appendChild(iframe);
        iframe.focus();
      });
    });
  }

  function init() {
    renderStatus();
    renderDated();
    initHeader();
    initFrames();
    initParallax();
    initMaps();
    setInterval(function () {
      renderStatus();
    }, 60 * 1000);
    root.classList.add('is-ready');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // Expose helpers for page scripts that need the same clock.
  window.CN = { zonedNow: zonedNow, inWindow: inWindow, formatTime: formatTime, config: config };
})();
