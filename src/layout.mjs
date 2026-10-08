/**
 * The shared page shell: <head>, header with the nursery's logo, and footer.
 * Page modules render only what goes inside <main>.
 */
import { html, raw, esc } from './lib/html.mjs';
import { mediaUrl } from './lib/media.mjs';
import { SITE_URL, business, hours, nav, footerNav } from './config.mjs';
import { PHOTOS, pexelsUrl } from './photos.mjs';
import { iconSprite } from './art/icons.mjs';

const ICON = (size) =>
  mediaUrl(`https://columbiafallsnursery.com/wp-content/uploads/2025/07/cropped-601b007be6373b06b291cbd3_Columbia-Nursery-Landscape_IMG-1-${size}x${size}.png`);

/** schema.org GardenStore description of the business. */
export function businessJsonLd() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const open = hours.week.map((h, i) => h && { day: days[i], ...h }).filter(Boolean);
  const data = {
    '@context': 'https://schema.org',
    '@type': 'GardenStore',
    '@id': `${SITE_URL}/#business`,
    name: business.name,
    url: `${SITE_URL}/`,
    telephone: business.phone.tel,
    foundingDate: String(business.founded),
    logo: mediaUrl(PHOTOS.logo),
    image: pexelsUrl(PHOTOS.glacierLake.pexels, 1600),
    description: 'Family-owned plant nursery and garden center in Columbia Falls, Montana, since 1993.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      addressRegion: business.address.region,
      postalCode: business.address.postal,
      addressCountry: business.address.country,
    },
    areaServed: 'Flathead Valley, Montana',
    openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: open.map((o) => o.day), opens: open[0].open, closes: open[0].close }],
    sameAs: [business.social.instagram, business.social.facebook],
  };
  return raw(`<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`);
}

function logo() {
  return html`<a class="brand" href="/" aria-label="${business.name}, home">
  <img class="brand__logo" src="${mediaUrl(PHOTOS.logo)}" alt="${business.name}" width="330" height="180" />
  <span class="brand__text" aria-hidden="true">Columbia Nursery</span>
</a>`;
}

function header(path) {
  const current = (href) => path.startsWith(href);
  return html`<header class="site-header" data-header>
  <div class="site-header__bar container">
    ${logo()}
    <nav class="site-nav" aria-label="Primary">
      <ul role="list">${nav.map((item) => html`<li><a href="${item.href}"${raw(current(item.href) ? ' aria-current="page"' : '')}>${item.label}</a></li>`)}</ul>
    </nav>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu" data-menu-toggle>Menu</button>
  </div>
  <nav class="menu" id="menu" aria-label="Menu" data-menu hidden>
    <div class="container">
      <ul role="list">
        <li><a href="/"${raw(path === '/' ? ' aria-current="page"' : '')}>Home</a></li>
        ${nav.map((item) => html`<li><a href="${item.href}"${raw(current(item.href) ? ' aria-current="page"' : '')}>${item.label}</a></li>`)}
      </ul>
      <p class="menu__info">
        <a href="tel:${business.phone.tel}">${business.phone.display}</a>
        <a href="${business.directionsUrl}" target="_blank" rel="noopener">${business.address.street}, ${business.address.city}</a>
      </p>
    </div>
  </nav>
</header>`;
}

function footer() {
  const a = business.address;
  return html`<footer class="site-footer">
  <div class="container">
    <div class="site-footer__top">
      <a class="site-footer__logo" href="/"><img src="${mediaUrl(PHOTOS.logo)}" alt="${business.name}" width="330" height="180" loading="lazy" /></a>
      <div class="site-footer__info">
        <p><a href="${business.directionsUrl}" target="_blank" rel="noopener">${a.street}, ${a.city}, ${a.region} ${a.postal}</a></p>
        <p><a href="tel:${business.phone.tel}">${business.phone.display}</a></p>
        <p>${hours.summary}</p>
      </div>
    </div>
    <nav class="site-footer__nav" aria-label="Footer">
      <ul role="list">${footerNav.map((l) => html`<li><a href="${l.href}">${l.label}</a></li>`)}</ul>
    </nav>
    <div class="site-footer__fine">
      <p>Copyright ${new Date().getFullYear()} ${business.name}.</p>
      <p><a href="${business.social.instagram}" target="_blank" rel="noopener">Instagram</a><a href="${business.social.facebook}" target="_blank" rel="noopener">Facebook</a></p>
    </div>
  </div>
</footer>`;
}

/** Render a full HTML document. */
export function documentHtml(page, main, assets) {
  const fullTitle = page.path === '/' ? page.title : `${page.title} | ${business.name}`;
  const url = `${SITE_URL}${page.path}`;
  const og = page.ogImage || pexelsUrl(PHOTOS.glacierLake.pexels, 1600);
  const scripts = [assets.js, ...(page.scripts || [])];
  return `<!doctype html>
<html lang="en-US">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(page.description)}" />
<link rel="canonical" href="${esc(url)}" />
${page.noindex ? '<meta name="robots" content="noindex" />' : ''}
<meta name="theme-color" content="#ffffff" />
<meta name="apple-mobile-web-app-title" content="${esc(business.shortName)}" />
<link rel="manifest" href="/site.webmanifest" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="${esc(business.name)}" />
<meta property="og:title" content="${esc(fullTitle)}" />
<meta property="og:description" content="${esc(page.description)}" />
<meta property="og:url" content="${esc(url)}" />
<meta property="og:image" content="${esc(og)}" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="icon" href="${esc(ICON(32))}" sizes="32x32" />
<link rel="icon" href="${esc(ICON(192))}" sizes="192x192" />
<link rel="apple-touch-icon" href="${esc(ICON(180))}" />
<link rel="preconnect" href="https://images.pexels.com" />
<link rel="preload" href="/assets/fonts/inter-var-latin.woff2" as="font" type="font/woff2" crossorigin />
<link rel="stylesheet" href="${assets.css}" />
<script>document.documentElement.classList.add('js')</script>
<script type="application/json" id="site-config">${JSON.stringify({ hours }).replace(/</g, '\\u003c')}</script>
${scripts.map((src) => `<script src="${src}" defer></script>`).join('\n')}
${page.jsonLd ? String(page.jsonLd) : ''}
</head>
<body class="${esc(page.bodyClass || '')}">
<a class="skip-link" href="#main">Skip to content</a>
${iconSprite()}
${header(page.path)}
<main id="main" tabindex="-1">
${main}
</main>
${footer()}
</body>
</html>
`;
}

/** Interior page title. */
export function pageHeader({ title, lead, crumbs }) {
  return html`<header class="page-head container">
  ${crumbs &&
  html`<nav class="crumbs" aria-label="Breadcrumb"><ol role="list">${crumbs.map(
    (c, i) => html`<li>${i < crumbs.length - 1 ? html`<a href="${c.href}">${c.label}</a>` : html`<span aria-current="page">${c.label}</span>`}</li>`,
  )}</ol></nav>`}
  <h1>${title}</h1>
  ${lead && html`<p class="lead page-head__lead">${lead}</p>`}
</header>`;
}
