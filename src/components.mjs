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
