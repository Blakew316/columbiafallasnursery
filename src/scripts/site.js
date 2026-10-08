/*
 * Site-wide behaviour (no animation anywhere):
 *   - mobile menu
 *   - photo fallbacks: try data-fallback, then leave the stone frame
 *   - logo fallback to the text wordmark
 *   - date-ranged notices ([data-start]/[data-end], "MM-DD")
 */
(function () {
  'use strict';

  function today() {
    try {
      var parts = {};
      new Intl.DateTimeFormat('en-US', { timeZone: 'America/Denver', month: '2-digit', day: '2-digit' })
        .formatToParts(new Date())
        .forEach(function (p) { parts[p.type] = p.value; });
      return parts.month + '-' + parts.day;
    } catch (e) {
      var d = new Date();
      return ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    }
  }

  function dated() {
    var md = today();
    document.querySelectorAll('[data-start][data-end]').forEach(function (el) {
      var s = el.getAttribute('data-start');
      var e = el.getAttribute('data-end');
      el.hidden = !(s <= e ? md >= s && md <= e : md >= s || md <= e);
    });
  }

  function photos() {
    document.querySelectorAll('.photo > img').forEach(function (img) {
      var fail = function () {
        var fb = img.getAttribute('data-fallback');
        if (fb && img.getAttribute('src') !== fb) {
          img.removeAttribute('srcset');
          img.removeAttribute('data-fallback');
          img.src = fb;
        } else {
          img.parentNode.classList.add('is-failed');
        }
      };
      if (img.complete && img.naturalWidth === 0) fail();
      img.addEventListener('error', fail);
    });
    var logos = document.querySelectorAll('.brand__logo, .site-footer__logo img');
    logos.forEach(function (img) {
      var fail = function () { img.closest('a').classList.add('is-text'); };
      if (img.complete && img.naturalWidth === 0) fail();
      img.addEventListener('error', fail);
    });
  }

  function menu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-menu]');
    if (!toggle || !panel) return;
    var behind = document.querySelectorAll('main, .site-footer');
    var set = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Close' : 'Menu';
      panel.hidden = !open;
      document.documentElement.classList.toggle('menu-open', open);
      behind.forEach(function (el) { el.inert = open; });
    };
    toggle.addEventListener('click', function () { set(toggle.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) { set(false); toggle.focus(); }
    });
    window.matchMedia('(min-width: 900px)').addEventListener('change', function (mq) { if (mq.matches) set(false); });
    // Swiping back to a page restores it from cache; never with the menu open.
    window.addEventListener('pageshow', function (e) { if (e.persisted) set(false); });
  }

  function init() {
    // iOS Safari only shows :active press states when a touch listener exists.
    document.addEventListener('touchstart', function () {}, { passive: true });
    dated();
    photos();
    menu();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
