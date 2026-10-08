/**
 * Home: the seasonal panorama hero, then a tour of what the nursery offers,
 * each section handing off to its own page.
 */
import { html, raw } from '../lib/html.mjs';
import { announcements, business } from '../config.mjs';
import { panorama } from '../art/panorama.mjs';
import { spot } from '../art/spots.mjs';
import { icon } from '../art/icons.mjs';
import { frame, button, more, visitDetails, mapEmbed } from '../components.mjs';
import { businessJsonLd } from '../layout.mjs';

const WP = 'https://columbiafallsnursery.com/wp-content/uploads';
// Without JS the build month shows; scripts/pages/home.js switches to today's month.
const BUILD_MONTH = new Date().getMonth() + 1;

const DEPARTMENTS = [
  {
    id: 'trees-shrubs-perennials',
    title: 'Trees, shrubs & perennials',
    text: 'Hardy stock for Zones 3–5, from rugged evergreens to perennials that come back year after year.',
    art: 'trees',
    photo: `${WP}/2025/08/Evergreens1-2.jpg`,
    alt: 'Evergreen trees in the nursery yard',
    size: 'lg',
  },
  {
    id: 'annuals-vegetables',
    title: 'Annuals & vegetables',
    text: 'Five greenhouses of seasonal color and strong vegetable starts, chosen for Northwest Montana.',
    art: 'annuals',
    photo: `${WP}/2026/05/Flowers-3-1.jpeg`,
    alt: 'Flowering annuals in one of the greenhouses',
    size: 'lg',
  },
  {
    id: 'houseplants',
    title: 'Houseplants',
    text: 'A 30 × 60-foot greenhouse of houseplants, succulents and cacti, plus pots and soil.',
    art: 'houseplants',
    photo: `${WP}/2026/05/House-Plants-1.jpeg`,
    alt: 'Houseplants in the houseplant greenhouse',
  },
  {
    id: 'cut-flowers',
    title: 'Cut flowers',
    text: 'Dahlias, lisianthus, cosmos and more, grown on site. Build your own bouquet in season.',
    art: 'cut-flowers',
    photo: `${WP}/2025/08/Cut-Flowers-3-1.jpg`,
    alt: 'Fresh cut flowers grown at the nursery',
  },
  {
    id: 'custom-baskets',
    title: 'Custom baskets & pots',
    text: 'Bring a container or choose one of ours. We plant it for your colors and your light.',
    art: 'baskets',
    photo: `${WP}/2025/08/custom-basket1.jpg`,
    alt: 'A custom-planted hanging basket',
    href: '/custom-baskets/',
  },
  {
    id: 'garden-shop',
    title: 'Garden shop',
    text: 'Tools, seeds, books, pottery, weed mat and irrigation supplies.',
    art: 'garden-shop',
    photo: `${WP}/2026/05/Planters-1.jpeg`,
    alt: 'Planters for sale in the garden shop',
  },
  {
    id: 'landscape-supplies',
    title: 'Landscape supplies',
    text: 'Bulk mulch, compost, soil and rock by the bucket or the truckload.',
    art: 'landscape-supplies',
    href: '/bulk-yard/',
  },
  {
    id: 'display-garden',
    title: 'Display garden',
    text: 'Walk through mature trees, shrubs and perennials to see how they grow here.',
    art: 'display-garden',
    photo: `${WP}/2025/08/display-garden-2.jpg`,
    alt: 'Paths and planting beds in the display garden',
    href: '/display-garden/',
  },
];

const QUICK_FILTERS = [
  { label: 'Shade lovers', href: '/plants/?light=full-shade', icon: 'shade' },
  { label: 'Deer resistant', href: '/plants/?feature=deer-resistant', icon: 'deer' },
  { label: 'For pollinators', href: '/plants/?feature=pollinators', icon: 'bee' },
  { label: 'Zone 3 hardy', href: '/plants/?zone=3', icon: 'snowflake' },
];

/** Pick a few photogenic plants from different categories for the teaser. */
function featuredPlants(plants) {
  if (!plants?.plants?.length) return [];
  const wanted = ['little-lime', 'jack-frost', 'karl-foerster', 'echinacea', 'hosta'];
  const picks = [];
  for (const key of wanted) {
    const p = plants.plants.find((x) => x.slug.includes(key) && x.image && !picks.includes(x));
    if (p && !picks.some((q) => q.category === p.category)) picks.push(p);
    if (picks.length === 3) break;
  }
  for (const cat of ['shrub', 'perennial', 'grass', 'tree']) {
    if (picks.length >= 3) break;
    const p = plants.plants.find((x) => x.category === cat && !picks.some((q) => q.category === cat));
    if (p) picks.push(p);
  }
  return picks.slice(0, 3);
}

const CATEGORY_ART = { tree: 'trees', shrub: 'shrubs', perennial: 'perennials', grass: 'grasses' };

function hero() {
  return html`<section class="hero" data-parallax aria-labelledby="hero-title">
  <div class="hero__sky" aria-hidden="true"></div>
  <div class="hero__art" aria-hidden="true">${raw(panorama())}</div>
  <div class="hero__content container">
    ${announcements.map(
      (a) => html`<a class="hero__note" href="${a.href}" data-start="${a.start}" data-end="${a.end}" hidden>
        <span class="hero__note-dot" aria-hidden="true"></span><strong>${a.short.split(':')[0]}</strong><span>${a.short.split(':').slice(1).join(':').trim()}</span>
      </a>`,
    )}
    <h1 id="hero-title" class="hero__title">Grown for Montana.</h1>
    <p class="hero__lead">Trees, shrubs, perennials and flowers raised in Columbia Falls for Northwest Montana winters. Family-owned since ${business.founded}.</p>
    <div class="cluster hero__actions">
      ${button('/contact/', 'Plan your visit')}
      ${button('/plants/', 'Find a plant', { variant: 'glass' })}
    </div>
  </div>
</section>`;
}

function statement() {
  return html`<section class="section statement" aria-label="About the nursery">
  <div class="container">
    <p class="statement__text">Seven acres and sixteen greenhouses on the west side of Columbia Falls, run by the third generation of our family. Everything we grow and stock is chosen to handle the cold winters and dry summers of Zones 3–5.</p>
    <p class="statement__more">${more('/about/', 'Our story')}</p>
  </div>
</section>`;
}

function departments() {
  return html`<section class="section section--flush departments" aria-labelledby="departments-title">
  <div class="container container--wide">
    <div class="section-head">
      <h2 id="departments-title">Everything for the garden, in one place.</h2>
      <p class="lead">Walk the nursery yard, the greenhouses and the garden shop. Our greenhouse team is on site and happy to help you choose.</p>
    </div>
    <ul class="dept-grid" role="list">
      ${DEPARTMENTS.map(
        (d, i) => html`<li class="dept dept--${d.size || 'sm'}">
        <a class="dept__link" href="${d.href || `/shop/#${d.id}`}">
          ${frame({ src: d.photo, alt: d.alt, art: spot(d.art, { seed: i + 3 }), ratio: d.size === 'lg' ? '16 / 10' : '4 / 3', className: 'dept__media' })}
          <span class="dept__body">
            <span class="dept__title">${d.title}</span>
            <span class="dept__text">${d.text}</span>
          </span>
        </a>
      </li>`,
      )}
    </ul>
  </div>
</section>`;
}

function plantFinder(plants) {
  const count = plants?.plants?.length;
  const picks = featuredPlants(plants);
  return html`<section class="section section--surface finder-teaser" aria-labelledby="finder-title">
  <div class="container container--wide finder-teaser__grid">
    <div class="finder-teaser__intro">
      <h2 id="finder-title">Find the right plant for your yard.</h2>
      <p class="lead">Look up ${count ? `the ${count} ` : 'the '}trees, shrubs, perennials and grasses growing in our display garden, with height, light and hardiness for each.</p>
      <form class="finder-search" action="/plants/" method="get" role="search">
        <label class="visually-hidden" for="home-plant-search">Search plants</label>
        ${icon('search')}
        <input class="finder-search__input" id="home-plant-search" name="q" type="search" placeholder="Try hydrangea, spruce or lavender" autocomplete="off" />
        <button class="btn btn--small" type="submit">Search</button>
      </form>
      <ul class="cluster finder-teaser__chips" role="list">
        ${QUICK_FILTERS.map((f) => html`<li><a class="chip" href="${f.href}">${icon(f.icon)}${f.label}</a></li>`)}
      </ul>
    </div>
    ${picks.length > 0 &&
    html`<ul class="mini-plants" role="list">
      ${picks.map(
        (p, i) => html`<li class="mini-plant">
        <a href="/plants/${p.slug}/">
          ${frame({ src: p.image?.src, alt: p.image?.alt || p.name, art: spot(CATEGORY_ART[p.category] || 'perennials', { seed: 20 + i }), ratio: '1 / 1', className: 'frame--md' })}
          <span class="mini-plant__name">${p.name}</span>
          ${p.botanical && html`<span class="mini-plant__latin latin">${p.botanical}</span>`}
          <span class="mini-plant__meta">${[p.height && `${p.height} tall`, p.zones && `Zones ${p.zones}`].filter(Boolean).join(', ')}</span>
        </a>
      </li>`,
      )}
    </ul>`}
  </div>
</section>`;
}

function baskets() {
  const steps = [
    ['Bring or choose a container', 'Drop off your own pots, or pick from our hanging baskets, ceramic floor pots and planters.'],
    ['Tell us what you love', 'Colors, style, and whether the spot gets sun or shade.'],
    ['We plant and grow it on', 'We plant early in the season and grow your containers in our greenhouses.'],
    ['Pick it up in bloom', 'It comes home mature and full of flowers, with care instructions.'],
  ];
  return html`<section class="section baskets-feature" aria-labelledby="baskets-title">
  <div class="container container--wide baskets-feature__grid">
    ${frame({
      src: `${WP}/2025/08/custom-basket-1.jpg`,
      alt: 'A custom basket planted by the Columbia Nursery team',
      art: spot('baskets', { seed: 41 }),
      ratio: '4 / 5',
      className: 'baskets-feature__media',
    })}
    <div class="baskets-feature__body">
      <h2 id="baskets-title">Your containers, planted by our growers.</h2>
      <p class="lead">Our custom planting program is one of the most popular things we do. Each spring we plant thousands of baskets and pots for homes, businesses and resorts across the Flathead Valley.</p>
      <ol class="steps" role="list">
        ${steps.map(
          ([title, text], i) => html`<li class="step"><span class="step__num" aria-hidden="true">${i + 1}</span><span><strong>${title}</strong><br />${text}</span></li>`,
        )}
      </ol>
      <div class="cluster">${button('/custom-baskets/', 'See basket designs')}${more('/custom-baskets/#how-it-works', 'How drop-off works')}</div>
    </div>
  </div>
</section>`;
}

function thisMonth(calendar, handouts) {
  if (!calendar?.months?.length) return '';
  const pdfFor = (title) => handouts?.handouts?.find((h) => h.title === title && h.href);
  return html`<section class="section section--alt month" aria-labelledby="month-title">
  <div class="container container--wide month__grid">
    <div class="month__intro">
      <h2 id="month-title">In the garden this month.</h2>
      <p class="lead">What to do now in the Flathead Valley, with our free guides for each job.</p>
      <p>${more('/garden-calendar/', 'See the full garden calendar')}</p>
    </div>
    <div class="month__panels">
      ${calendar.months.map(
        (m) => html`<div class="month__panel" data-month="${m.month}"${raw(m.month === BUILD_MONTH ? '' : ' hidden')}>
        <h3 class="month__name">${m.name}</h3>
        ${m.summary && html`<p class="muted">${m.summary}</p>`}
        <ul class="month__tasks" role="list">
          ${(m.tasks || []).slice(0, 5).map((t) => {
            const pdf = t.handout && pdfFor(t.handout);
            return html`<li>${icon('leaf')}<span>${t.text}${pdf ? html` <a class="text-link month__guide" href="${pdf.href}">${t.handout} guide</a>` : ''}</span></li>`;
          })}
        </ul>
      </div>`,
      )}
    </div>
  </div>
</section>`;
}

function bulk(bulkData) {
  const featured = ['Glacier Gold Compost', 'Shredded Cedar', 'Top Soil', 'Pea Gravel', 'River Rock'];
  const items = bulkData?.products?.filter((p) => featured.includes(p.name)) || [];
  const unit = bulkData?.priceUnit === 'cubic yard' ? 'per yard' : '';
  return html`<section class="section bulk-feature" aria-labelledby="bulk-title">
  <div class="container container--wide bulk-feature__grid">
    <div class="bulk-feature__body">
      <h2 id="bulk-title">Mulch, soil and rock, by the bucket or the truckload.</h2>
      <p class="lead">Load up at our bulk yard during business hours, starting at a quarter yard or a $5 bucket. Friday delivery is available across the valley.</p>
      <div class="cluster">${button('/bulk-yard/#calculator', 'Estimate your project')}${more('/bulk-yard/', 'See all 2026 prices')}</div>
    </div>
    ${items.length > 0 &&
    html`<div class="price-card" aria-label="Sample 2026 bulk prices">
      <p class="price-card__title">2026 bulk prices</p>
      <ul role="list">
        ${items.map((p) => html`<li><span>${p.name}</span><span class="price-card__dots" aria-hidden="true"></span><span class="price-card__price">${p.priceText}${unit && html`<span class="muted"> ${unit}</span>`}</span></li>`)}
      </ul>
    </div>`}
  </div>
</section>`;
}

function story() {
  return html`<section class="section section--surface story" aria-labelledby="story-title">
  <div class="container container--wide story__grid">
    ${frame({
      src: `${WP}/2026/05/Family-Picture-2-1024x576.png`,
      alt: 'The family that runs Columbia Nursery & Landscape',
      art: spot('family', { seed: 52 }),
      ratio: '16 / 10',
      className: 'story__media',
    })}
    <div class="story__body">
      <h2 id="story-title">Three generations, one valley.</h2>
      <p class="lead">Columbia Nursery has served Columbia Falls and the greater Flathead Valley since ${business.founded}. We are a family of growers, designers and plant lovers working side by side, and we still love helping you find the right plant.</p>
      <p>${more('/about/', 'Read our story')}</p>
    </div>
  </div>
</section>`;
}

function visit() {
  return html`<section class="section visit" aria-labelledby="visit-title">
  <div class="container container--wide visit__grid">
    <div class="visit__body">
      <h2 id="visit-title">Come walk the nursery.</h2>
      <p class="lead">We are on 9th Street West, just west of downtown Columbia Falls. Bring a truck for the bulk yard, or just come for a stroll through the greenhouses.</p>
      ${visitDetails()}
      <div class="cluster visit__actions">
        ${button(business.directionsUrl, 'Get directions', { external: true, iconName: 'pin' })}
        ${button('/contact/#message', 'Send us a message', { variant: 'quiet' })}
      </div>
    </div>
    ${mapEmbed()}
  </div>
</section>`;
}

export default {
  path: '/',
  title: 'Columbia Nursery & Landscape | Plant Nursery & Garden Center in Columbia Falls, MT',
  description:
    'Family-owned since 1993: trees, shrubs, perennials, annuals, houseplants, custom baskets and bulk landscape supplies on seven acres in Columbia Falls, Montana. Open Monday–Saturday.',
  bodyClass: 'home has-hero-announcement',
  scripts: ['home'],
  jsonLd: businessJsonLd(),
  render(ctx) {
    return html`${hero()}
${statement()}
${departments()}
${plantFinder(ctx.data.plants)}
${baskets()}
${thisMonth(ctx.data.calendar, ctx.data.handouts)}
${bulk(ctx.data.bulk)}
${story()}
${visit()}`;
  },
};
