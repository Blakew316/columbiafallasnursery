/**
 * The shared page shell: <head> (SEO, social, structured data, the pre-paint
 * season script), the frosted header, the date-driven announcement ribbon
 * and the forest-edge footer. Page modules only render what goes in <main>.
 */
import { html, raw, esc } from './lib/html.mjs';
import { SITE_URL, business, hours, announcements, nav, footerNav, seasons } from './config.mjs';
import { iconSprite, icon } from './art/icons.mjs';
import { logoMark } from './art/logo.mjs';
import { ridgeBand } from './art/panorama.mjs';

const FOOTER_BAND = ridgeBand(42);

/** Runs in <head> before first paint: marks JS, sets the season. */
function headScript() {
  const map = {};
  for (const s of seasons) for (const m of s.months) map[m] = s.id;
  return `(function(d){d.classList.add('js');try{var m=+new Intl.DateTimeFormat('en-US',{timeZone:${JSON.stringify(
    hours.timeZone,
  )},month:'numeric'}).format(new Date());d.setAttribute('data-season',${JSON.stringify(map)}[m]||'fall')}catch(e){}})(document.documentElement);`;
}

/** schema.org GardenStore description of the business. */
export function businessJsonLd() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const open = hours.week
    .map((h, i) => h && { day: days[i], ...h })
    .filter(Boolean);
  const data = {
    '@context': 'https://schema.org',
    '@type': 'GardenStore',
    '@id': `${SITE_URL}/#business`,
    name: business.name,
    url: `${SITE_URL}/`,
    telephone: business.phone.tel,
    foundingDate: String(business.founded),
    image: `${SITE_URL}/assets/og.png`,
    logo: `${SITE_URL}/assets/icon-512.png`,
    description:
      'Family-owned, third-generation plant nursery and garden center in Columbia Falls, Montana: trees, shrubs, perennials, annuals, houseplants, custom baskets and bulk landscape supplies.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      addressRegion: business.address.region,
      postalCode: business.address.postal,
      addressCountry: business.address.country,
    },
    areaServed: 'Flathead Valley, Montana',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: open.map((o) => o.day),
        opens: open[0].open,
        closes: open[0].close,
      },
    ],
    sameAs: [business.social.instagram, business.social.facebook],
  };
  return raw(`<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`);
}

function header(path) {
  const current = (href) => (href === '/' ? path === '/' : path.startsWith(href));
  return html`<header class="site-header" data-header>
  <div class="site-header__bar container container--wide">
    <a class="brand" href="/" aria-label="${business.name}, home">
      ${logoMark()}
      <span class="brand__name">Columbia Nursery</span>
    </a>
    <nav class="site-nav" aria-label="Primary">
      <ul role="list">
        ${nav.map(
          (item) => html`<li><a href="${item.href}"${raw(current(item.href) ? ' aria-current="page"' : '')}>${item.label}</a></li>`,
        )}
      </ul>
    </nav>
    <div class="site-header__end">
      <a class="status" href="/contact/#hours" data-open-status>
        <span class="status__dot" aria-hidden="true"></span>
        <span class="status__text">${hours.summary.replace('Monday–Saturday', 'Mon–Sat')}</span>
      </a>
      <a class="icon-btn icon-btn--call" href="tel:${business.phone.tel}" aria-label="Call ${business.phone.display}">${icon('phone')}</a>
      <button class="icon-btn menu-btn" type="button" aria-expanded="false" aria-controls="menu-sheet" data-menu-toggle>
        <span class="visually-hidden">Menu</span>
        <span class="menu-btn__lines" aria-hidden="true"></span>
      </button>
    </div>
  </div>
  <div class="menu-sheet" id="menu-sheet" data-menu-sheet hidden>
    <nav class="container" aria-label="Mobile">
      <ul role="list" class="menu-sheet__list">
        <li><a href="/"${raw(path === '/' ? ' aria-current="page"' : '')}>Home</a></li>
        ${nav.map(
          (item) => html`<li><a href="${item.href}"${raw(current(item.href) ? ' aria-current="page"' : '')}>${item.label}</a></li>`,
        )}
      </ul>
      <div class="menu-sheet__foot">
        <a class="btn" href="tel:${business.phone.tel}">${icon('phone')} ${business.phone.display}</a>
        <a class="btn btn--quiet" href="${business.directionsUrl}" target="_blank" rel="noopener">${icon('pin')} Directions</a>
      </div>
    </nav>
  </div>
</header>`;
}

function ribbon() {
  return html`<div class="ribbon" data-announcements hidden>
  ${announcements.map(
    (a) => html`<p class="ribbon__item" data-start="${a.start}" data-end="${a.end}" hidden>
      <a href="${a.href}"><strong>${a.title}</strong> <span class="ribbon__text">${a.text}</span></a>
    </p>`,
  )}
</div>`;
}

function footer() {
  const { address: a } = business;
  return html`<footer class="site-footer">
  <div class="site-footer__edge" aria-hidden="true">${raw(FOOTER_BAND)}</div>
  <div class="site-footer__body">
    <div class="container container--wide site-footer__grid">
      <div class="site-footer__brand">
        <a class="brand brand--footer" href="/">${logoMark({ size: 34 })}<span class="brand__name">Columbia Nursery<span class="brand__sub"> &amp; Landscape</span></span></a>
        <p>Family-grown in Columbia Falls since ${business.founded}. Three generations of growers raising plants that thrive in Northwest Montana.</p>
        <div class="site-footer__social">
          <a class="icon-btn" href="${business.social.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${icon('instagram')}</a>
          <a class="icon-btn" href="${business.social.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${icon('facebook')}</a>
        </div>
      </div>
      <div class="site-footer__visit">
        <h2 class="site-footer__title">Visit</h2>
        <address>
          <a href="${business.directionsUrl}" target="_blank" rel="noopener">${a.street}<br />${a.city}, ${a.region} ${a.postal}</a>
        </address>
        <p><a href="tel:${business.phone.tel}">${business.phone.display}</a></p>
        <p class="site-footer__hours">${hours.summary}</p>
      </div>
      ${footerNav.map(
        (group) => html`<nav class="site-footer__col" aria-label="${group.title}">
        <h2 class="site-footer__title">${group.title}</h2>
        <ul role="list">${group.links.map((l) => html`<li><a href="${l.href}">${l.label}</a></li>`)}</ul>
      </nav>`,
      )}
    </div>
    <div class="container container--wide site-footer__fine">
      <p>© <span data-year>${new Date().getFullYear()}</span> ${business.name}. ${a.street}, ${a.city}, Montana.</p>
      <p><a href="/contact/">Contact us</a></p>
    </div>
  </div>
</footer>`;
}

/**
 * Render a full HTML document.
 * @param {object} page   { path, title, description, bodyClass, head, scripts, jsonLd, ogImage, noindex }
 * @param {SafeHtml} main the page body
 * @param {object} assets { css, js } hashed URLs from the build
 */
export function documentHtml(page, main, assets) {
  const fullTitle = page.path === '/' ? page.title : `${page.title} | ${business.name}`;
  const url = `${SITE_URL}${page.path}`;
  const og = page.ogImage || `${SITE_URL}/assets/og.png`;
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
<meta name="theme-color" content="#f2f5f1" media="(prefers-color-scheme: light)" />
<meta name="theme-color" content="#0e1a16" media="(prefers-color-scheme: dark)" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="${esc(business.name)}" />
<meta property="og:title" content="${esc(fullTitle)}" />
<meta property="og:description" content="${esc(page.description)}" />
<meta property="og:url" content="${esc(url)}" />
<meta property="og:image" content="${esc(og)}" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
<link rel="icon" href="/assets/favicon-32.png" sizes="32x32" type="image/png" />
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
<link rel="preload" href="/assets/fonts/inter-var-latin.woff2" as="font" type="font/woff2" crossorigin />
<link rel="stylesheet" href="${assets.css}" />
<script>${headScript()}</script>
<script type="application/json" id="site-config">${JSON.stringify({ hours }).replace(/</g, '\\u003c')}</script>
${scripts.map((src) => `<script src="${src}" defer></script>`).join('\n')}
${page.jsonLd ? String(page.jsonLd) : ''}
${page.head ? String(page.head) : ''}
</head>
<body class="${esc(page.bodyClass || '')}">
<a class="skip-link" href="#main">Skip to content</a>
${iconSprite()}
${page.defs || ''}
${ribbon()}
${header(page.path)}
<main id="main" tabindex="-1">
${main}
</main>
${footer()}
</body>
</html>
`;
}

/**
 * Interior page header: title and intro over a pale sky, with the forest
 * ridge dissolving into the page like valley fog.
 */
export function pageHeader({ title, lead, crumbs, actions, align = 'center', seed = 7, children }) {
  return html`<header class="page-head page-head--${align}">
  <div class="page-head__sky" aria-hidden="true"></div>
  <div class="page-head__inner container">
    ${crumbs &&
    html`<nav class="crumbs" aria-label="Breadcrumb"><ol role="list">${crumbs.map(
      (c, i) => html`<li>${i < crumbs.length - 1 ? html`<a href="${c.href}">${c.label}</a>` : html`<span aria-current="page">${c.label}</span>`}</li>`,
    )}</ol></nav>`}
    <h1>${title}</h1>
    ${lead && html`<p class="lead page-head__lead">${lead}</p>`}
    ${actions && html`<div class="cluster page-head__actions">${actions}</div>`}
    ${children}
  </div>
  <div class="page-head__band" aria-hidden="true">${raw(ridgeBand(seed))}</div>
</header>`;
}
