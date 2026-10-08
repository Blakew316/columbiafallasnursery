/**
 * Home: full-bleed photography, few words, one button.
 */
import { html } from '../lib/html.mjs';
import { announcements, business } from '../config.mjs';
import { PHOTOS } from '../photos.mjs';
import { photo, button, more, visitDetails, mapEmbed, todayMD, inWindow, stars } from '../components.mjs';
import { businessJsonLd } from '../layout.mjs';
import { icon } from '../art/icons.mjs';

const TILES = [
  { title: 'Trees & Shrubs', href: '/shop/#trees-shrubs-perennials', p: PHOTOS.pineForest },
  { title: 'Annuals', href: '/shop/#annuals-vegetables', p: PHOTOS.trayOfFlowers },
  { title: 'Perennials', href: '/plants/?category=perennial', p: PHOTOS.pottedGarden },
  { title: 'Houseplants', href: '/shop/#houseplants', p: PHOTOS.plantShop },
  { title: 'Cut Flowers', href: '/shop/#cut-flowers', p: PHOTOS.flowerBuckets },
  { title: 'Bulk Yard', href: '/bulk-yard/', p: PHOTOS.woodChips },
];

function hero() {
  const sale = announcements[0];
  return html`<section class="hero" aria-labelledby="hero-title">
  ${photo(PHOTOS.greenhouse, { ratio: 'auto', className: 'photo--flat hero__photo', eager: true })}
  <div class="hero__scrim" aria-hidden="true"></div>
  <div class="hero__content container">
    <div class="hero__top">
      <h1 id="hero-title" class="hero__title">Grown for Montana.</h1>
      <p class="hero__sub">Columbia Falls, since ${business.founded}.</p>
      ${button('/contact/', 'Plan your visit', { light: true })}
    </div>
    ${sale &&
    html`<a class="hero__sale" href="${sale.href}" data-start="${sale.start}" data-end="${sale.end}"${inWindow(todayMD(), sale.start, sale.end) ? '' : html` hidden`}>
      <span class="hero__sale-title">${sale.title}</span>
      <span class="hero__sale-deal">${sale.deal}</span>
      <span class="hero__sale-until">${sale.until}</span>
    </a>`}
  </div>
</section>`;
}

function statement() {
  return html`<section class="section statement" aria-label="About the nursery">
  <div class="container">
    <p class="statement__text">Seven acres. Sixteen greenhouses. Three generations of growers in the Flathead Valley.</p>
    <p class="statement__link">${more('/about/', 'Our story')}</p>
  </div>
</section>`;
}

/** Seasonal cards from src/data/now.json; site.js re-checks the date in the browser. */
function now(data) {
  const items = data?.items || [];
  if (!items.length) return '';
  const md = todayMD();
  return html`<section class="section section--tight now" aria-labelledby="now-title">
  <div class="container">
    <h2 id="now-title" class="now__title">In the nursery now.</h2>
    <ul class="now__list" role="list">
      ${items.map((it) => {
        const p = it.image ? { src: it.image, alt: it.title } : PHOTOS[it.photo];
        return html`<li data-start="${it.start}" data-end="${it.end}"${inWindow(md, it.start, it.end) ? '' : html` hidden`}>
        <a class="now-card" href="${it.href}">
          ${photo(p, { ratio: '4 / 3', className: 'photo--md', sizes: '(min-width: 900px) 33vw, 100vw' })}
          <span class="now-card__title">${it.title}</span>
          <span class="now-card__text">${it.text}</span>
        </a>
      </li>`;
      })}
    </ul>
  </div>
</section>`;
}

/** Ratings we can source, plus real quotes once the owners add them. */
function reviews(data) {
  if (!data) return '';
  const quotes = data.quotes || [];
  return html`<section class="section section--alt reviews" aria-labelledby="reviews-title">
  <div class="container">
    <h2 id="reviews-title" class="reviews__title">Loved in the valley.</h2>
    <ul class="reviews__ratings" role="list">
      ${(data.ratings || []).map(
        (r) => html`<li><a class="rating" href="${r.href}" target="_blank" rel="noopener">
        <span class="rating__value">${r.value}</span>
        ${r.stars ? stars(r.stars) : ''}
        <span class="rating__label">${r.label}</span>
      </a></li>`,
      )}
    </ul>
    ${quotes.length > 0 &&
    html`<ul class="quotes" role="list">${quotes.map(
      (q) => html`<li><blockquote class="quote"><p>${q.text}</p><footer>${q.name}${q.source ? `, ${q.source}` : ''}</footer></blockquote></li>`,
    )}</ul>`}
    ${data.google &&
    html`<p class="reviews__links">
      <a class="more" href="${data.google.reviews}" target="_blank" rel="noopener">Read our Google reviews</a>
      <a class="more" href="${data.google.write}" target="_blank" rel="noopener">Leave a review</a>
    </p>`}
  </div>
</section>`;
}

function tiles() {
  return html`<section class="section section--tight tiles-section" aria-labelledby="grow-title">
  <div class="container">
    <h2 id="grow-title" class="tiles-title">What we grow.</h2>
    <ul class="tiles" role="list">
      ${TILES.map(
        (t) => html`<li><a class="tile" href="${t.href}">
        ${photo(t.p, { ratio: '4 / 5', sizes: '(min-width: 900px) 33vw, (min-width: 600px) 50vw, 100vw' })}
        <span class="tile__title">${t.title}</span>
      </a></li>`,
      )}
    </ul>
  </div>
</section>`;
}

function finder(count) {
  return html`<section class="section section--alt finder-band" aria-labelledby="finder-title">
  <div class="container container--narrow">
    <h2 id="finder-title">Find your plant.</h2>
    <form class="search search--large" action="/plants/" method="get" role="search">
      ${icon('search')}
      <label class="visually-hidden" for="home-q">Search plants</label>
      <input id="home-q" name="q" type="search" placeholder="Hydrangea, spruce, lavender" autocomplete="off" />
    </form>
    <p class="finder-band__link">${more('/plants/', `Browse all ${count} plants`)}</p>
  </div>
</section>`;
}

function baskets() {
  return html`<section class="section split-section" aria-labelledby="baskets-title">
  <div class="container split">
    ${photo(PHOTOS.basket, { ratio: '4 / 5', sizes: '(min-width: 900px) 50vw, 100vw' })}
    <div class="split__body">
      <h2 id="baskets-title">Custom baskets.</h2>
      <p class="lead">Bring your containers. We plant them and grow them in our greenhouses until they bloom.</p>
      <p>${more('/custom-baskets/', 'See the designs')}</p>
    </div>
  </div>
</section>`;
}

function band() {
  return html`<section class="band" aria-labelledby="band-title">
  ${photo(PHOTOS.montanaPeaks, { ratio: 'auto', className: 'photo--flat band__photo' })}
  <div class="band__scrim" aria-hidden="true"></div>
  <div class="band__content container">
    <h2 id="band-title">Rooted in the Flathead Valley.</h2>
    <p>${more('/about/', 'Our story', { light: true })}</p>
  </div>
</section>`;
}

function bulk(b) {
  const pick = ['Glacier Gold Compost', 'Shredded Cedar', 'Top Soil', 'Pea Gravel', 'River Rock'];
  const items = (b?.products || []).filter((p) => pick.includes(p.name));
  return html`<section class="section bulk-home" aria-labelledby="bulk-title">
  <div class="container split split--even">
    <div class="split__body">
      <h2 id="bulk-title">Bulk yard.</h2>
      <p class="lead">Mulch, soil and rock. From a $5 bucket to a truckload.</p>
      <p>${more('/bulk-yard/', 'All prices')}</p>
    </div>
    <ul class="prices" role="list">
      ${items.map((p) => html`<li><span>${p.name}</span><span>${p.priceText.replace('.00', '')} / yard</span></li>`)}
    </ul>
  </div>
</section>`;
}

function visit() {
  return html`<section class="section section--alt" aria-labelledby="visit-title">
  <div class="container split split--even">
    <div class="split__body">
      <h2 id="visit-title">Visit.</h2>
      ${visitDetails()}
    </div>
    ${mapEmbed()}
  </div>
</section>`;
}

export default {
  path: '/',
  title: 'Columbia Nursery & Landscape | Columbia Falls, Montana',
  description: 'Family-owned nursery and garden center in Columbia Falls, Montana, since 1993. Trees, shrubs, perennials, annuals, houseplants, custom baskets and bulk landscape supplies.',
  bodyClass: 'home',
  jsonLd: businessJsonLd(),
  render(ctx) {
    return html`${hero()}${statement()}${now(ctx.data.now)}${tiles()}${finder(ctx.data.plants?.plants?.length || 153)}${baskets()}${band()}${reviews(ctx.data.reviews)}${bulk(ctx.data.bulk)}${visit()}`;
  },
};
