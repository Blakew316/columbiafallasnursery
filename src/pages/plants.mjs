/**
 * Display Garden (/display-garden/), Plant Finder (/plants/) and one page
 * per plant (/plants/<slug>/), generated from src/data/plants.json.
 *
 * Finder URL parameters: ?q=text&category=tree|shrub|perennial|grass&light=full-sun|part-shade|full-shade
 */
import { html } from '../lib/html.mjs';
import { mediaUrl } from '../lib/media.mjs';
import { pageHeader } from '../layout.mjs';
import { photo } from '../components.mjs';
import { PHOTOS, pexelsUrl } from '../photos.mjs';
import { icon } from '../art/icons.mjs';
import { business } from '../config.mjs';

const CATEGORY = {
  tree: { label: 'Trees', one: 'Tree' },
  shrub: { label: 'Shrubs', one: 'Shrub' },
  perennial: { label: 'Perennials', one: 'Perennial' },
  grass: { label: 'Grasses', one: 'Ornamental grass' },
};
const ORDER = ['tree', 'shrub', 'perennial', 'grass'];

const plantPhoto = (p, opts) => photo(p.image?.src ? { src: p.image.src, alt: p.name } : null, opts) || html`<figure class="photo" style="--ratio:1 / 1"></figure>`;

function card(p) {
  const search = [p.name, p.botanical, p.family, p.altName].filter(Boolean).join(' ').toLowerCase();
  // Light is matched loosely: "part-shade" also covers part sun.
  const light = new Set(p.lightTags || []);
  if (light.has('part-sun')) light.add('part-shade');
  return html`<li class="plant-card" data-search="${search}" data-category="${p.category}" data-light="${[...light].join(' ')}">
  <a href="/plants/${p.slug}/">
    ${plantPhoto(p, { ratio: '1 / 1', className: 'photo--md', sizes: '(min-width: 900px) 25vw, 50vw' })}
    <span class="plant-card__name">${p.name}</span>
    ${p.botanical && html`<span class="plant-card__latin latin">${p.botanical}</span>`}
  </a>
</li>`;
}

function finderPage(plants) {
  const sorted = [...plants].sort((a, b) => a.name.localeCompare(b.name));
  return {
    path: '/plants/',
    title: 'Plant Finder',
    description: `Search the ${plants.length} trees, shrubs, perennials and grasses in the Columbia Nursery display garden.`,
    bodyClass: 'plants',
    scripts: ['plants'],
    render: () => html`${pageHeader({ title: 'Plants.', lead: `${plants.length} plants growing in our display garden.` })}
<section class="finder container" aria-label="Plant finder">
  <form class="finder__bar" role="search" data-finder onsubmit="return false">
    <div class="search finder__search">
      ${icon('search')}
      <label class="visually-hidden" for="plant-q">Search plants</label>
      <input id="plant-q" type="search" placeholder="Search" autocomplete="off" data-q />
    </div>
    <div class="segmented" role="group" aria-label="Plant type" data-category>
      <button type="button" aria-pressed="true" data-value="">All</button>
      ${ORDER.map((c) => html`<button type="button" aria-pressed="false" data-value="${c}">${CATEGORY[c].label}</button>`)}
    </div>
    <label class="visually-hidden" for="plant-light">Light</label>
    <select class="select finder__light" id="plant-light" data-light>
      <option value="">Any light</option>
      <option value="full-sun">Full sun</option>
      <option value="part-shade">Part shade</option>
      <option value="full-shade">Full shade</option>
    </select>
  </form>
  <p class="finder__count muted" aria-live="polite" data-count>${plants.length} plants</p>
  <ul class="plant-grid" role="list" data-grid>${sorted.map(card)}</ul>
  <p class="finder__empty" data-empty hidden>No plants match. Try a different search.</p>
</section>`,
  };
}

function specs(p) {
  const rows = [
    ['Height', p.height],
    ['Spread', p.spread],
    ['Light', p.light],
    ['Hardy to', p.hardiness],
    ['Zones', p.zones],
    ['Blooms', p.bloom && p.bloom.charAt(0).toUpperCase() + p.bloom.slice(1)],
    ['Soil', p.soil],
    ['Water', p.water],
  ].filter(([, v]) => v);
  return html`<dl class="specs">${rows.map(([k, v]) => html`<div><dt>${k}</dt><dd>${v}</dd></div>`)}</dl>`;
}

function detailPage(p, all, bySlug) {
  const cat = CATEGORY[p.category];
  const related = (p.alsoLikeSlugs || []).map((s) => bySlug.get(s)).filter((x) => x && x.slug !== p.slug);
  const same = all.filter((x) => x.slug !== p.slug && !related.includes(x) && x.category === p.category);
  const more4 = [...related, ...same.filter((x) => x.family === p.family), ...same.filter((x) => x.family !== p.family)].slice(0, 4);
  const first = (p.description?.[0] || '').split(/(?<=\.)\s/)[0];
  return {
    path: `/plants/${p.slug}/`,
    title: p.name,
    description: `${p.name}${p.botanical ? `, ${p.botanical.replace(/[‘’']/g, '')}` : ''}. ${first}`.slice(0, 280),
    bodyClass: 'plant-page',
    render: () => html`<article class="plant container" aria-labelledby="plant-title">
  <nav class="crumbs plant__crumbs" aria-label="Breadcrumb"><ol role="list">
    <li><a href="/plants/">Plants</a></li>
    <li><a href="/plants/?category=${p.category}">${cat.label}</a></li>
  </ol></nav>
  <div class="plant__grid">
    ${plantPhoto(p, { ratio: '1 / 1', eager: true, sizes: '(min-width: 900px) 50vw, 100vw' })}
    <div class="plant__info">
      <h1 id="plant-title" class="plant__name">${p.name}</h1>
      ${p.botanical && html`<p class="plant__latin latin">${p.botanical}</p>`}
      <div class="plant__desc">${(p.description || []).map((d) => html`<p>${d}</p>`)}</div>
      ${specs(p)}
      <p class="plant__call">Growing in our display garden. <a href="tel:${business.phone.tel}">Call ${business.phone.display}</a> for availability.</p>
    </div>
  </div>
  ${more4.length > 0 &&
  html`<section class="plant__related" aria-labelledby="related-title">
    <h2 id="related-title">${related.length ? 'You may also like' : `More ${cat.label.toLowerCase()}`}</h2>
    <ul class="plant-grid" role="list">${more4.map(card)}</ul>
  </section>`}
</article>`,
  };
}

function displayGardenPage(plants, dg) {
  const groups = ORDER.map((c) => ({ c, items: plants.filter((p) => p.category === c).sort((a, b) => a.name.localeCompare(b.name)) }));
  const gardenPhoto = { src: PHOTOS.displayGarden.src, alt: PHOTOS.displayGarden.alt, fallback: pexelsUrl(PHOTOS.lavender.pexels, 2400) };
  return {
    path: '/display-garden/',
    title: 'Display Garden',
    description: 'A living showcase of trees, shrubs, perennials and grasses that thrive in Northwest Montana.',
    bodyClass: 'display-garden',
    render: () => html`${pageHeader({ title: 'Display garden.', lead: 'A walk-through garden of trees, shrubs and perennials that thrive in Northwest Montana. Always changing, always growing.' })}
<div class="container">${photo(gardenPhoto, { ratio: '16 / 9', eager: true })}</div>
<section class="section" aria-label="Plants in the garden">
  <div class="container">
    <div class="dg-head">
      <p class="lead">Everything growing in the garden.</p>
      ${dg?.pdf?.href && html`<a class="more" href="${mediaUrl(dg.pdf.href)}" target="_blank" rel="noopener">Plant list (PDF)</a>`}
    </div>
    ${groups.map(
      ({ c, items }) => html`<section class="dg-group" aria-labelledby="dg-${c}">
      <h2 id="dg-${c}" class="dg-group__title">${CATEGORY[c].label}</h2>
      <ul class="dg-list" role="list">${items.map((p) => html`<li><a href="/plants/${p.slug}/">${p.name}</a></li>`)}</ul>
    </section>`,
    )}
  </div>
</section>`,
  };
}

export default function plantPages(ctx) {
  const plants = ctx.data.plants?.plants || [];
  if (!plants.length) return [];
  const bySlug = new Map(plants.map((p) => [p.slug, p]));
  const ordered = ORDER.flatMap((c) => plants.filter((p) => p.category === c));
  return [displayGardenPage(plants, ctx.data['display-garden']), finderPage(plants), ...ordered.map((p) => detailPage(p, ordered, bySlug))];
}

