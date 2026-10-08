/**
 * Custom Baskets (/custom-baskets/): how it works, the two handouts, and
 * the design lookbook (sun or shade).
 */
import { html, raw } from '../lib/html.mjs';
import { mediaUrl } from '../lib/media.mjs';
import { pageHeader } from '../layout.mjs';
import { photo } from '../components.mjs';
import { PHOTOS } from '../photos.mjs';
import { icon } from '../art/icons.mjs';

const STEPS = [
  ['Bring your containers', 'Or choose from our baskets, ceramic pots and planters.'],
  ['Tell us what you like', 'Colors, style, sun or shade.'],
  ['We plant and grow them', 'Early in the season, in our greenhouses.'],
  ['Pick them up in bloom', 'With care instructions for the season.'],
];

const SUN = new Set(['full-sun', 'part-sun']);

export default {
  path: '/custom-baskets/',
  title: 'Custom Baskets',
  description: 'Bring your containers or choose ours. We plant them and grow them in our greenhouses until they bloom. Thousands planted each spring in the Flathead Valley.',
  bodyClass: 'baskets',
  scripts: ['baskets'],
  render(ctx) {
    const b = ctx.data.baskets || {};
    const designs = (b.designs || []).map((d) => ({ ...d, group: SUN.has(d.lightTag) ? 'sun' : 'shade' }));
    const pdf = (label) => b.pdfs?.find((p) => p.label === label);
    const dropOff = pdf('Basket Drop Off');
    const care = pdf('Basket Care');
    return html`${pageHeader({ title: 'Custom baskets.', lead: 'Your containers, planted by our growers. Thousands every spring.' })}
<section class="section section--tight" aria-labelledby="how">
  <div class="container split">
    ${photo(PHOTOS.basket, { ratio: '4 / 5', eager: true, sizes: '(min-width: 900px) 55vw, 100vw' })}
    <div class="split__body">
      <h2 id="how" class="baskets__h">How it works.</h2>
      <ol class="steps baskets__steps" role="list">${STEPS.map(([t, d]) => html`<li><div><strong>${t}</strong><span>${d}</span></div></li>`)}</ol>
      <p class="baskets__docs">
        ${dropOff && html`<a class="more" href="${mediaUrl(dropOff.href)}" target="_blank" rel="noopener">Drop-off form</a>`}
        ${care && html`<a class="more" href="${mediaUrl(care.href)}" target="_blank" rel="noopener">Care guide</a>`}
      </p>
    </div>
  </div>
</section>

<section class="section section--alt" id="designs" aria-labelledby="designs-title">
  <div class="container">
    <div class="lookbook__head">
      <h2 id="designs-title">Designs.</h2>
      <div class="segmented" role="group" aria-label="Show designs for" data-look-filter>
        <button type="button" aria-pressed="true" data-value="">All</button>
        <button type="button" aria-pressed="false" data-value="sun">Sun</button>
        <button type="button" aria-pressed="false" data-value="shade">Shade</button>
      </div>
    </div>
    <ul class="lookbook" role="list" data-look>
      ${designs.map(
        (d, i) => html`<li data-group="${d.group}">
        <button class="look" type="button" data-index="${i}" aria-label="${d.name}, ${d.light}">
          ${photo({ src: d.image?.src, alt: '' }, { ratio: '3 / 4', className: 'photo--md', sizes: '(min-width: 900px) 25vw, 50vw' })}
        </button>
        <p class="look__name">${d.name}</p>
        <p class="look__light">${d.light}</p>
      </li>`,
      )}
    </ul>
  </div>
</section>

<dialog class="lightbox" aria-label="Basket design" data-lightbox>
  <button class="lightbox__close" type="button" data-close aria-label="Close">${icon('close')}</button>
  <img class="lightbox__img" alt="" data-img />
  <div class="lightbox__bar">
    <button type="button" data-prev aria-label="Previous">${icon('chevron-left')}</button>
    <p data-caption aria-live="polite"></p>
    <button type="button" data-next aria-label="Next">${icon('chevron-right')}</button>
  </div>
</dialog>
<script type="application/json" data-look-data>${raw(
      JSON.stringify(designs.map((d) => ({ name: d.name, light: d.light, src: mediaUrl(d.image?.src) }))).replace(/</g, '\\u003c'),
    )}</script>`;
  },
};
