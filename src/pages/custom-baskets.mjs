/**
 * Custom Baskets (/custom-baskets/): how the program works, the drop-off
 * and care handouts, and the 17-design lookbook filterable by light.
 */
import { html, raw } from '../lib/html.mjs';
import { mediaUrl } from '../lib/media.mjs';
import { pageHeader } from '../layout.mjs';
import { frame, button } from '../components.mjs';
import { spot } from '../art/spots.mjs';
import { icon } from '../art/icons.mjs';
import { business } from '../config.mjs';

const LIGHTS = [
  ['full-sun', 'Full sun', 'sun'],
  ['part-sun', 'Part sun', 'part-sun'],
  ['part-shade', 'Part shade', 'part-sun'],
  ['full-shade', 'Full shade', 'shade'],
];

export default {
  path: '/custom-baskets/',
  title: 'Custom Hanging Baskets & Container Planting',
  description:
    'Bring your own containers or choose ours, tell us your colors and light, and our growers plant and grow them in the greenhouse until they are full and blooming. Thousands planted each spring in the Flathead Valley.',
  bodyClass: 'baskets',
  scripts: ['baskets'],
  render(ctx) {
    const b = ctx.data.baskets || {};
    const steps = b.steps || [];
    const designs = b.designs || [];
    const pdf = (label) => b.pdfs?.find((p) => p.label === label);
    const dropOff = pdf('Basket Drop Off');
    const care = pdf('Basket Care');
    const intro = (b.intro || [])[0]?.replace(/\s*Check out our idea portfolio\.?$/, '') ||
      'Our custom planting program is one of the most popular services at Columbia Nursery.';
    const counts = Object.fromEntries(LIGHTS.map(([tag]) => [tag, designs.filter((d) => d.lightTag === tag).length]));

    return html`${pageHeader({
      title: 'Let us bring your flower dreams to life.',
      lead: intro,
      seed: 53,
      actions: html`${button('#designs', 'Browse basket designs')}${button('#how-it-works', 'How it works', { variant: 'glass' })}`,
    })}
<section class="section section--flush" id="how-it-works" aria-labelledby="how-title">
  <div class="container container--wide basket-how">
    ${frame({ src: 'https://columbiafallsnursery.com/wp-content/uploads/2025/08/Basket1-2.jpg', alt: 'A hanging basket planted by our growers', art: spot('baskets', { seed: 7 }), ratio: '4 / 5', className: 'basket-how__media', eager: true })}
    <div class="basket-how__body">
      <h2 id="how-title">How it works.</h2>
      <ol class="steps" role="list">
        ${steps.map((s, i) => {
          const title = s.title || s.text.split(/(?<=[.—])\s/)[0];
          const rest = s.title ? s.text : s.text.slice(title.length).trim();
          return html`<li class="step"><span class="step__num" aria-hidden="true">${i + 1}</span><span><strong>${title.replace(/\.$/, '')}</strong>${rest ? html`<br /><span class="muted">${rest}</span>` : ''}</span></li>`;
        })}
      </ol>
      <div class="basket-docs" id="drop-off">
        ${dropOff && html`<a class="doc-link" href="${mediaUrl(dropOff.href)}" target="_blank" rel="noopener">${icon('document')}<span><strong>Basket drop-off form</strong><span class="muted small">PDF, print and bring with your containers</span></span></a>`}
        ${care && html`<a class="doc-link" href="${mediaUrl(care.href)}" target="_blank" rel="noopener">${icon('document')}<span><strong>Basket care guide</strong><span class="muted small">PDF, keep your baskets blooming all season</span></span></a>`}
      </div>
    </div>
  </div>
</section>

<section class="section section--surface" aria-labelledby="why-title">
  <div class="container container--wide">
    <div class="section-head">
      <h2 id="why-title">Why choose custom planting?</h2>
      ${b.customers && html`<p class="lead">${b.customers}</p>`}
    </div>
    <ul class="benefits" role="list">
      ${(b.benefits || []).map(
        (x, i) => html`<li class="benefit">${icon(['clock', 'sparkle', 'flower', 'leaf'][i % 4])}<h3>${x.title}</h3>${x.text && html`<p class="muted">${x.text}</p>`}</li>`,
      )}
    </ul>
  </div>
</section>

<section class="section lookbook" id="designs" aria-labelledby="designs-title">
  <div class="container container--wide">
    <div class="section-head">
      <h2 id="designs-title">Looking for inspiration?</h2>
      <p class="lead">${b.inspiration || 'Color combinations, trailing varieties and sun or shade arrangements from past seasons.'}</p>
    </div>
    <div class="lookbook__filters" role="group" aria-label="Filter designs by light" data-lookbook-filters>
      <button class="chip" type="button" aria-pressed="true" data-light="all">All ${designs.length}</button>
      ${LIGHTS.filter(([t]) => counts[t]).map(
        ([t, label, ic]) => html`<button class="chip" type="button" aria-pressed="false" data-light="${t}">${icon(ic)}${label} <span class="muted">${counts[t]}</span></button>`,
      )}
    </div>
    <ul class="lookbook__grid" role="list" data-lookbook>
      ${designs.map(
        (d, i) => html`<li class="look" data-light="${d.lightTag}">
        <button class="look__btn" type="button" data-index="${i}" aria-label="View ${d.name}, ${d.light.toLowerCase()} design">
          ${frame({ src: d.image?.src, alt: '', art: spot('baskets', { seed: 100 + i }), ratio: '3 / 4', className: 'frame--md' })}
        </button>
        <p class="look__name">${d.name}</p>
        <p class="look__light muted small">${d.light}</p>
      </li>`,
      )}
    </ul>
  </div>
</section>

<dialog class="lightbox" aria-label="Basket design" data-lightbox>
  <div class="lightbox__inner">
    <button class="icon-btn lightbox__close" type="button" data-lightbox-close aria-label="Close">${icon('close')}</button>
    <div class="lightbox__stage">
      <img class="lightbox__img" alt="" data-lightbox-img />
      <div class="lightbox__art" aria-hidden="true">${raw(spot('baskets', { seed: 999 }))}</div>
    </div>
    <div class="lightbox__bar">
      <button class="icon-btn" type="button" data-lightbox-prev aria-label="Previous design">${icon('chevron-left')}</button>
      <p class="lightbox__caption" data-lightbox-caption aria-live="polite"></p>
      <button class="icon-btn" type="button" data-lightbox-next aria-label="Next design">${icon('chevron-right')}</button>
    </div>
  </div>
</dialog>
<script type="application/json" data-lookbook-data>${JSON.stringify(
      designs.map((d) => ({ name: d.name, light: d.light, src: mediaUrl(d.image?.src) })),
    ).replace(/</g, '\\u003c')}</script>

<section class="section closing-cta" aria-labelledby="basket-cta">
  <div class="container closing-cta__inner">
    <h2 id="basket-cta">One basket or a hundred.</h2>
    <p class="lead">Homeowners, local businesses, landscapers, vacation properties and resorts: drop off your containers or stop in to get started.</p>
    <div class="cluster">${button(`tel:${business.phone.tel}`, `Call ${business.phone.display}`, { iconName: 'phone' })}${button('/contact/#message', 'Send us a message', { variant: 'quiet' })}</div>
  </div>
</section>`;
  },
};
