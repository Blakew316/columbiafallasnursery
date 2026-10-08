/**
 * Shared building blocks for page modules. Keep page-specific markup in the
 * page module; anything used by two or more pages belongs here.
 */
import { html, raw } from './lib/html.mjs';
import { mediaUrl } from './lib/media.mjs';
import { icon } from './art/icons.mjs';
import { business, hours } from './config.mjs';

/**
 * A rounded media frame: an illustration underneath and, when a photo URL
 * is known, the photo on top (it fades in once loaded; on failure the
 * illustration stays). `art` is trusted SVG markup.
 */
export function frame({ src, alt = '', art = '', ratio = '4 / 3', className = '', eager = false, sizes, width, height }) {
  const url = mediaUrl(src);
  return html`<figure class="frame ${className}" style="--ratio:${ratio}">
  <div class="frame__art" aria-hidden="true">${raw(art)}</div>
  ${url &&
  html`<img src="${url}" alt="${alt}" ${raw(eager ? 'fetchpriority="high"' : 'loading="lazy"')} decoding="async"${raw(
    sizes ? ` sizes="${sizes}"` : '',
  )}${raw(width ? ` width="${width}"` : '')}${raw(height ? ` height="${height}"` : '')} />`}
</figure>`;
}

/** Primary/quiet button link. */
export function button(href, label, { variant = '', iconName, external = false } = {}) {
  return html`<a class="btn ${variant ? `btn--${variant}` : ''}" href="${href}"${raw(external ? ' target="_blank" rel="noopener"' : '')}>${
    iconName ? icon(iconName) : ''
  }${label}</a>`;
}

/** “Learn more”-style text link with a drawn chevron. */
export function more(href, label) {
  return html`<a class="more" href="${href}">${label}</a>`;
}

/** Section heading block. */
export function sectionHead({ title, intro, center = false, level = 2, id }) {
  const h = level === 3 ? html`<h3${raw(id ? ` id="${id}"` : '')}>${title}</h3>` : html`<h2${raw(id ? ` id="${id}"` : '')}>${title}</h2>`;
  return html`<div class="section-head${center ? ' section-head--center' : ''}">${h}${intro && html`<p class="lead">${intro}</p>`}</div>`;
}

/** Address, phone and hours, used on Home and Visit. */
export function visitDetails() {
  const a = business.address;
  return html`<dl class="visit-list">
  <div><dt>${icon('pin')}<span>Address</span></dt><dd><a href="${business.directionsUrl}" target="_blank" rel="noopener">${a.street}<br />${a.city}, ${a.region} ${a.postal}</a></dd></div>
  <div><dt>${icon('clock')}<span>Hours</span></dt><dd>${hours.summary}<br /><span class="muted small" data-open-status-text>Closed Sundays</span></dd></div>
  <div><dt>${icon('phone')}<span>Phone</span></dt><dd><a href="tel:${business.phone.tel}">${business.phone.display}</a></dd></div>
</dl>`;
}

/** Lazy map: a static card that becomes a Google Map on request. */
export function mapEmbed({ title = 'Map to Columbia Nursery & Landscape' } = {}) {
  return html`<div class="map" data-map data-src="${business.mapEmbedUrl}" data-title="${title}">
  <div class="map__placeholder">
    <div class="map__pin" aria-hidden="true">${icon('pin')}</div>
    <p class="map__addr"><strong>${business.address.street}</strong><br />${business.address.city}, ${business.address.region} ${business.address.postal}</p>
    <div class="cluster map__actions">
      <button class="btn btn--small" type="button" data-map-load>Show map</button>
      <a class="btn btn--small btn--quiet" href="${business.directionsUrl}" target="_blank" rel="noopener">Get directions</a>
    </div>
  </div>
</div>`;
}
