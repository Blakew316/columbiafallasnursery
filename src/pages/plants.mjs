/**
 * Display Garden (/display-garden/), the Plant Finder (/plants/) and one
 * page per plant (/plants/<slug>/), all generated from src/data/plants.json.
 *
 * Finder URL contract (also used by links on Home):
 *   ?q=text  &category=perennial|grass|shrub|tree  &light=full-sun,part-shade
 *   &zone=3|4  &feature=deer-resistant,pollinators
 */
import { html } from '../lib/html.mjs';
import { mediaUrl } from '../lib/media.mjs';
import { pageHeader } from '../layout.mjs';
import { frame, button, more } from '../components.mjs';
import { spot } from '../art/spots.mjs';
import { icon } from '../art/icons.mjs';
import { business } from '../config.mjs';

const CATEGORY = {
  perennial: { label: 'Perennials', one: 'Perennial', art: 'perennials' },
  grass: { label: 'Grasses', one: 'Ornamental grass', art: 'grasses' },
  shrub: { label: 'Shrubs', one: 'Shrub', art: 'shrubs' },
  tree: { label: 'Trees', one: 'Tree', art: 'trees' },
};
const CATEGORY_ORDER = ['tree', 'shrub', 'perennial', 'grass'];

const LIGHT = {
  'full-sun': { label: 'Full sun', icon: 'sun' },
  'part-sun': { label: 'Part sun', icon: 'part-sun' },
  'part-shade': { label: 'Part shade', icon: 'part-sun' },
  'full-shade': { label: 'Full shade', icon: 'shade' },
};

const FEATURES = {
  'deer-resistant': { label: 'Deer resistant', icon: 'deer' },
  pollinators: { label: 'Pollinator friendly', icon: 'bee' },
  'drought-tolerant': { label: 'Drought tolerant', icon: 'drop' },
  evergreen: { label: 'Evergreen', icon: 'evergreen' },
  'fall-color': { label: 'Fall color', icon: 'leaf' },
  fragrant: { label: 'Fragrant', icon: 'flower' },
  'shade-loving': { label: 'Shade loving', icon: 'shade' },
};

const art = (p, seed) => spot(CATEGORY[p.category]?.art || 'perennials', { seed });
const seedOf = (slug) => [...slug].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 997, 7);

function lightLine(p) {
  return (p.lightTags || []).map((t) => LIGHT[t]).filter(Boolean);
}

/* Plant card (finder grid and related lists) ---------------------------- */

function card(p, { lazy = true } = {}) {
  const search = [p.name, p.botanical, p.family, p.altName, CATEGORY[p.category]?.one].filter(Boolean).join(' ').toLowerCase();
  return html`<li class="plant-card" data-search="${search}" data-category="${p.category}" data-light="${(p.lightTags || []).join(' ')}" data-zone="${p.zoneMin ?? ''}" data-features="${(p.features || []).join(' ')}" data-height="${parseHeight(p.height)}">
  <a href="/plants/${p.slug}/">
    ${frame({ src: p.image?.src, alt: '', art: art(p, seedOf(p.slug)), ratio: '1 / 1', className: 'frame--md plant-card__media', eager: !lazy })}
    <span class="plant-card__body">
      <span class="plant-card__name">${p.name}</span>
      ${p.botanical && html`<span class="plant-card__latin latin">${p.botanical}</span>`}
      <span class="plant-card__meta">
        <span class="plant-card__lights" aria-label="${lightLine(p).map((l) => l.label).join(', ')}">${lightLine(p)
          .filter((l, i, a) => a.findIndex((x) => x.icon === l.icon) === i)
          .map((l) => icon(l.icon))}</span>
        ${[p.height, p.zones && `Zones ${p.zones}`].filter(Boolean).join(', ')}
      </span>
    </span>
  </a>
</li>`;
}

/** Tallest height in inches, for sorting ("4–6 ft" → 72). */
function parseHeight(h) {
  if (!h) return '';
  const m = String(h).match(/([\d.]+)(?:\s*[–-]\s*([\d.]+))?\s*(ft|in|')/i);
  if (!m) return '';
  const top = parseFloat(m[2] || m[1]);
  return Math.round(/ft|'/i.test(m[3]) ? top * 12 : top);
}

/* Finder ------------------------------------------------------------------ */

function chipGroup(name, label, options, { single = false } = {}) {
  return html`<fieldset class="filter-group" data-filter="${name}"${single ? html` data-single` : ''}>
  <legend class="filter-group__label">${label}</legend>
  <div class="filter-group__chips">
    ${options.map(
      ([value, text, ic]) => html`<button class="chip" type="button" aria-pressed="false" data-value="${value}">${ic ? icon(ic) : ''}${text}</button>`,
    )}
  </div>
</fieldset>`;
}

function finderPage(plants) {
  const sorted = [...plants].sort((a, b) => a.name.localeCompare(b.name));
  return {
    path: '/plants/',
    title: 'Plant Finder: Trees, Shrubs & Perennials for Northwest Montana',
    description: `Search the ${plants.length} trees, shrubs, perennials and grasses in the Columbia Nursery display garden. Filter by light, hardiness zone, deer resistance and pollinator value.`,
    bodyClass: 'plants',
    scripts: ['plants'],
    render: () => html`${pageHeader({
      title: 'Find a plant that thrives here.',
      lead: `All ${plants.length} trees, shrubs, perennials and grasses growing in our display garden, with size, light and hardiness for each. Ask our team about what is in stock.`,
      seed: 31,
    })}
<section class="finder" aria-label="Plant finder">
  <div class="container container--wide">
    <form class="finder__tools" role="search" data-finder-form onsubmit="return false">
      <div class="finder__search finder-search">
        ${icon('search')}
        <label class="visually-hidden" for="plant-q">Search plants</label>
        <input class="finder-search__input" id="plant-q" name="q" type="search" placeholder="Search by name, like hydrangea or spruce" autocomplete="off" data-finder-q />
      </div>
      <details class="finder__filters" data-filters open>
        <summary class="finder__filters-toggle"><span>Filters</span><span class="finder__active-count" data-active-count hidden></span></summary>
        <div class="finder__groups">
          ${chipGroup('category', 'Plant type', CATEGORY_ORDER.map((c) => [c, CATEGORY[c].label]), { single: true })}
          ${chipGroup('light', 'Light', Object.entries(LIGHT).map(([k, v]) => [k, v.label, v.icon]))}
          ${chipGroup('zone', 'Hardy to', [['3', 'Zone 3'], ['4', 'Zone 4']], { single: true })}
          ${chipGroup('feature', 'Good to know', Object.entries(FEATURES).filter(([k]) => k !== 'shade-loving').map(([k, v]) => [k, v.label, v.icon]))}
        </div>
      </details>
      <div class="finder__status">
        <p class="finder__count" aria-live="polite" data-finder-count>${plants.length} plants</p>
        <div class="finder__status-end">
          <label class="finder__sort"><span class="visually-hidden">Sort by</span>
            <select class="select select--small" data-finder-sort>
              <option value="name">Name A–Z</option>
              <option value="height-asc">Shortest first</option>
              <option value="height-desc">Tallest first</option>
            </select>
          </label>
          <button class="btn btn--small btn--quiet" type="button" data-finder-clear hidden>Clear filters</button>
        </div>
      </div>
    </form>
    <ul class="plant-grid" role="list" data-finder-grid>
      ${sorted.map((p, i) => card(p, { lazy: i > 7 }))}
    </ul>
    <div class="finder__empty" data-finder-empty hidden>
      <h2>No plants match those filters.</h2>
      <p class="muted">Try removing a filter or searching a broader name. Our team can also suggest something for your spot.</p>
      <div class="cluster">
        <button class="btn" type="button" data-finder-clear>Clear filters</button>
        <a class="btn btn--quiet" href="tel:${business.phone.tel}">${icon('phone')}Call ${business.phone.display}</a>
      </div>
    </div>
    <noscript><p class="note">Turn on JavaScript to search and filter. All plants are listed above.</p></noscript>
  </div>
</section>`,
  };
}

/* Detail pages ------------------------------------------------------------ */

function specs(p) {
  const rows = [
    p.height && ['height', 'Height', p.height],
    p.spread && ['spread', 'Spread', p.spread],
    p.light && ['sun', 'Light', p.light],
    p.hardiness && ['thermometer', 'Hardy to', p.hardiness],
    p.zones && ['snowflake', 'USDA zones', p.zones],
    p.bloom && ['flower', 'Blooms', p.bloom.charAt(0).toUpperCase() + p.bloom.slice(1)],
    p.soil && ['shovel', 'Soil', p.soil],
    p.water && ['drop', 'Water', p.water],
  ].filter(Boolean);
  return html`<dl class="specs">${rows.map(
    ([ic, k, v]) => html`<div class="specs__row"><dt>${icon(ic)}${k}</dt><dd>${v}</dd></div>`,
  )}</dl>`;
}

function detailPage(p, all, bySlug) {
  const cat = CATEGORY[p.category];
  const related = (p.alsoLikeSlugs || []).map((s) => bySlug.get(s)).filter((x) => x && x.slug !== p.slug);
  const fill = all.filter((x) => x.slug !== p.slug && !related.includes(x) && (x.family === p.family || x.category === p.category));
  const more4 = [...related, ...fill.filter((x) => x.family === p.family), ...fill.filter((x) => x.family !== p.family)].slice(0, 4);
  const peers = all.filter((x) => x.category === p.category);
  const idx = peers.indexOf(p);
  const prev = peers[(idx - 1 + peers.length) % peers.length];
  const next = peers[(idx + 1) % peers.length];
  const gallery = [...new Set([p.image?.src, ...(p.gallery || [])].filter(Boolean))].slice(0, 3);
  const firstSentence = (p.description?.[0] || '').split(/(?<=\.)\s/)[0];
  const desc = `${p.name}${p.botanical ? ` (${p.botanical.replace(/[‘’']/g, '')})` : ''}: ${firstSentence} ${[
    p.height && `Height ${p.height}.`,
    p.zones && `Zones ${p.zones}.`,
  ]
    .filter(Boolean)
    .join(' ')} Growing in the Columbia Nursery display garden, Columbia Falls, MT.`.slice(0, 300);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Plant Finder', item: 'https://columbiafallsnursery.com/plants/' },
      { '@type': 'ListItem', position: 2, name: p.name, item: `https://columbiafallsnursery.com/plants/${p.slug}/` },
    ],
  };

  return {
    path: `/plants/${p.slug}/`,
    title: `${p.name}${p.botanical ? ` (${p.botanical.replace(/[‘’']/g, '')})` : ''}`,
    description: desc,
    bodyClass: 'plant-detail',
    jsonLd: { toString: () => `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>` },
    render: () => html`<article class="plant" aria-labelledby="plant-title">
  <div class="plant__top container container--wide">
    <nav class="crumbs" aria-label="Breadcrumb"><ol role="list">
      <li><a href="/plants/">Plant Finder</a></li>
      <li><a href="/plants/?category=${p.category}">${cat.label}</a></li>
      <li><span aria-current="page">${p.name}</span></li>
    </ol></nav>
  </div>
  <div class="plant__grid container container--wide">
    <div class="plant__media">
      ${frame({ src: gallery[0], alt: p.image?.alt || p.name, art: art(p, seedOf(p.slug)), ratio: '1 / 1', eager: true, className: 'plant__photo' })}
      ${gallery.length > 1 &&
      html`<div class="plant__thumbs">${gallery.slice(1).map((src, i) =>
        frame({ src, alt: `${p.name}, photo ${i + 2}`, art: art(p, seedOf(p.slug) + i + 1), ratio: '1 / 1', className: 'frame--md' }),
      )}</div>`}
    </div>
    <div class="plant__info">
      <p class="plant__kind">${cat.one}${p.family && p.family.toLowerCase() !== p.name.toLowerCase() ? html` <span aria-hidden="true">in the</span> <span>${p.family} family</span>` : ''}</p>
      <h1 id="plant-title" class="plant__name">${p.name}</h1>
      ${p.botanical && html`<p class="plant__latin latin">${p.botanical}</p>`}
      <div class="plant__desc">${(p.description || []).map((d) => html`<p>${d}</p>`)}</div>
      ${p.features?.length > 0 &&
      html`<ul class="plant__tags" role="list">${p.features.filter((f) => FEATURES[f]).map((f) => html`<li><a class="chip" href="/plants/?feature=${f}">${icon(FEATURES[f].icon)}${FEATURES[f].label}</a></li>`)}</ul>`}
      ${specs(p)}
      <div class="plant__visit">
        <p><strong>Growing in our display garden.</strong> Stop by to see it at its mature size, and ask our team about current availability.</p>
        <div class="cluster">
          ${button(`tel:${business.phone.tel}`, 'Ask about availability', { iconName: 'phone' })}
          ${button('/display-garden/', 'About the display garden', { variant: 'quiet' })}
        </div>
      </div>
    </div>
  </div>
  ${more4.length > 0 &&
  html`<section class="section plant__related" aria-labelledby="related-title">
    <div class="container container--wide">
      <h2 id="related-title" class="plant__related-title">${related.length ? 'You may also like' : `More ${cat.label.toLowerCase()} in the garden`}</h2>
      <ul class="plant-grid plant-grid--related" role="list">${more4.map((x) => card(x))}</ul>
    </div>
  </section>`}
  <nav class="container container--wide plant__pager" aria-label="More ${cat.label.toLowerCase()}">
    <a class="plant__pager-link" href="/plants/${prev.slug}/" rel="prev">${icon('chevron-left')}<span><span class="muted small">Previous</span><br />${prev.name}</span></a>
    <a class="plant__pager-link plant__pager-link--next" href="/plants/${next.slug}/" rel="next"><span><span class="muted small">Next</span><br />${next.name}</span>${icon('chevron-right')}</a>
  </nav>
</article>`,
  };
}

/* Display garden ------------------------------------------------------------ */

function displayGardenPage(plants, dg) {
  const intro = dg?.intro || [];
  const groups = CATEGORY_ORDER.map((c) => ({ c, items: plants.filter((p) => p.category === c).sort((a, b) => a.name.localeCompare(b.name)) }));
  return {
    path: '/display-garden/',
    title: 'Display Garden: Hardy Plants for Northwest Montana',
    description:
      'Walk through the Columbia Nursery display garden: a living showcase of trees, shrubs, perennials and grasses that thrive in Northwest Montana, with ideas for sun, shade and four-season color.',
    bodyClass: 'display-garden',
    render: () => html`${pageHeader({
      title: 'Inspiration grows here.',
      lead: intro[0],
      seed: 47,
      actions: html`${button('/plants/', 'Open the plant finder')}${dg?.pdf?.href ? button(mediaUrl(dg.pdf.href), 'Download the plant list (PDF)', { variant: 'glass', iconName: 'download' }) : ''}`,
    })}
<section class="section section--flush">
  <div class="container container--wide split split--media">
    ${frame({ src: 'https://columbiafallsnursery.com/wp-content/uploads/2025/08/display-garden-2.jpg', alt: 'Planting beds and paths in the display garden', art: spot('display-garden', { seed: 12 }), ratio: '4 / 3', eager: true })}
    <div class="prose dg-prose">
      ${intro.slice(1).map((p) => html`<p class="${p.startsWith('Visit often') ? 'dg-pull' : ''}">${p}</p>`)}
    </div>
  </div>
</section>
<section class="section section--surface" aria-labelledby="dg-plants">
  <div class="container container--wide">
    <div class="section-head">
      <h2 id="dg-plants">What is growing in the garden.</h2>
      <p class="lead">${plants.length} plants across four groups. Choose any plant for its size, light and hardiness.</p>
    </div>
    <div class="dg-groups">
      ${groups.map(
        ({ c, items }) => html`<section class="dg-group" aria-labelledby="dg-${c}">
        <div class="dg-group__head">
          <h3 id="dg-${c}">${CATEGORY[c].label}</h3>
          <a class="more" href="/plants/?category=${c}">Filter ${items.length} ${CATEGORY[c].label.toLowerCase()}</a>
        </div>
        <ul class="dg-list" role="list">${items.map((p) => html`<li><a href="/plants/${p.slug}/">${p.name}</a></li>`)}</ul>
      </section>`,
      )}
    </div>
  </div>
</section>
<section class="section closing-cta" aria-labelledby="dg-visit">
  <div class="container closing-cta__inner">
    <h2 id="dg-visit">Visit often. The garden is always changing.</h2>
    <p class="lead">Open Monday through Saturday at ${business.address.street}, Columbia Falls.</p>
    <div class="cluster">${button('/contact/', 'Plan your visit')}${more('/plants/', 'Search the plant finder')}</div>
  </div>
</section>`,
  };
}

export default function plantPages(ctx) {
  const plants = ctx.data.plants?.plants || [];
  if (!plants.length) return [];
  const bySlug = new Map(plants.map((p) => [p.slug, p]));
  const ordered = CATEGORY_ORDER.flatMap((c) => plants.filter((p) => p.category === c));
  return [displayGardenPage(plants, ctx.data['display-garden']), finderPage(plants), ...ordered.map((p) => detailPage(p, ordered, bySlug))];
}
