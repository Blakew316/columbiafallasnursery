/**
 * Shared building blocks for page modules.
 */
import { html, raw } from './lib/html.mjs';
import { mediaUrl } from './lib/media.mjs';
import { pexelsUrl } from './photos.mjs';
import { icon } from './art/icons.mjs';
import { business, hours } from './config.mjs';

const WIDTHS = [640, 1024, 1600, 2400, 3840];

/**
 * A photo in a rounded frame. Accepts a PHOTOS entry ({ pexels } or { src })
 * plus overrides. Pexels photos get a responsive srcset up to 3840px; if a
 * photo fails, site.js swaps in `fallback`, and if that fails too the frame
 * keeps its quiet stone tone.
 */
export function photo(p, { ratio = '4 / 3', className = '', eager = false, sizes = '100vw', alt } = {}) {
  if (!p) return '';
  const label = alt ?? p.alt ?? '';
  let img;
  if (p.pexels) {
    const srcset = WIDTHS.map((w) => `${pexelsUrl(p.pexels, w)} ${w}w`).join(', ');
    img = html`<img src="${pexelsUrl(p.pexels, 1600)}" srcset="${srcset}" sizes="${sizes}" alt="${label}"${raw(
      p.fallback ? ` data-fallback="${mediaUrl(p.fallback)}"` : '',
    )} ${raw(eager ? 'fetchpriority="high"' : 'loading="lazy"')} decoding="async" />`;
  } else {
    img = html`<img src="${mediaUrl(p.src)}" alt="${label}"${raw(p.fallback ? ` data-fallback="${mediaUrl(p.fallback)}"` : '')} ${raw(
      eager ? 'fetchpriority="high"' : 'loading="lazy"',
    )} decoding="async" />`;
  }
  return html`<figure class="photo ${className}" style="--ratio:${ratio}">${img}</figure>`;
}

/** A single primary button. Use at most one per section. */
export function button(href, label, { light = false, external = false, iconName } = {}) {
  return html`<a class="btn${light ? ' btn--light' : ''}" href="${href}"${raw(external ? ' target="_blank" rel="noopener"' : '')}>${
    iconName ? icon(iconName) : ''
  }${label}</a>`;
}

/** Quiet text link with a chevron. */
export function more(href, label, { light = false } = {}) {
  return html`<a class="more${light ? ' more--light' : ''}" href="${href}">${label}</a>`;
}

/** Address, hours and phone. */
export function visitDetails() {
  const a = business.address;
  return html`<dl class="visit-list">
  <div><dt>Address</dt><dd><a href="${business.directionsUrl}" target="_blank" rel="noopener">${a.street}<br />${a.city}, ${a.region} ${a.postal}</a></dd></div>
  <div><dt>Hours</dt><dd>${hours.summary}</dd></div>
  <div><dt>Phone</dt><dd><a href="tel:${business.phone.tel}">${business.phone.display}</a></dd></div>
</dl>`;
}

/** The real Google Map. */
export function mapEmbed() {
  return html`<div class="map"><iframe src="${business.mapEmbedUrl}" title="Map to Columbia Nursery & Landscape" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>`;
}

/** Today's "MM-DD" in the nursery's time zone (used at build time). */
export function todayMD(timeZone = 'America/Denver') {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', { timeZone, month: '2-digit', day: '2-digit' }).formatToParts(new Date()).map((x) => [x.type, x.value]),
  );
  return `${parts.month}-${parts.day}`;
}

/** True when "MM-DD" falls in the inclusive window (wraps over New Year). */
export function inWindow(md, start, end) {
  return start <= end ? md >= start && md <= end : md >= start || md <= end;
}

/** Five stars, filled to `value` out of 5. */
export function stars(value) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  const row = Array.from({ length: 5 }, () => icon('star'));
  return html`<span class="stars" role="img" aria-label="${value} out of 5 stars"><span class="stars__base">${row}</span><span class="stars__fill" style="width:${pct.toFixed(1)}%">${row}</span></span>`;
}
