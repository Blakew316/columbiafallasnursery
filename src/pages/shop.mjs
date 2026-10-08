/**
 * The Nursery (/shop/): every department on the grounds, one row each, with
 * anchors the home page links to. Copy comes from the previous site.
 */
import { html } from '../lib/html.mjs';
import { pageHeader } from '../layout.mjs';
import { frame, button, more } from '../components.mjs';
import { spot } from '../art/spots.mjs';
import { icon } from '../art/icons.mjs';
import { announcements } from '../config.mjs';

/** Department rows: heading in pages.json → anchor, art and next step. */
const ROWS = {
  'Garden Shop': { id: 'garden-shop', art: 'garden-shop', title: 'Garden shop' },
  Houseplants: { id: 'houseplants', art: 'houseplants', title: 'Houseplants' },
  'Explore Our Display Garden': {
    id: 'display-garden',
    art: 'display-garden',
    title: 'Display garden',
    cta: ['/display-garden/', 'Explore the display garden'],
  },
  'Annuals & Vegetables': { id: 'annuals-vegetables', art: 'annuals', title: 'Annuals & vegetables' },
  'Cut Flower Program': { id: 'cut-flowers', art: 'cut-flowers', title: 'Cut flowers' },
  'Custom Baskets & Pots': {
    id: 'custom-baskets',
    art: 'baskets',
    title: 'Custom baskets & pots',
    cta: ['/custom-baskets/', 'See basket designs'],
  },
  'Trees, Shrubs, Perennials': {
    id: 'trees-shrubs-perennials',
    art: 'trees',
    title: 'Trees, shrubs & perennials',
    cta: ['/plants/', 'Browse the plant finder'],
  },
  'Landscape Supplies': {
    id: 'landscape-supplies',
    art: 'landscape-supplies',
    title: 'Landscape supplies',
    cta: ['/bulk-yard/', 'See bulk yard prices'],
  },
};

const sentence = (s) => (s ? s.charAt(0) + s.slice(1).toLowerCase() : s);

function row(section, i) {
  const meta = ROWS[section.heading];
  const img = section.images?.[0];
  return html`<section class="dept-row" id="${meta.id}" aria-labelledby="${meta.id}-title">
  <div class="container container--wide dept-row__grid${i % 2 ? ' dept-row__grid--flip' : ''}">
    ${frame({ src: img?.largest || img?.src, alt: img?.alt || meta.title, art: spot(meta.art, { seed: 60 + i }), ratio: '5 / 4', className: 'dept-row__media' })}
    <div class="dept-row__body">
      <h2 id="${meta.id}-title">${meta.title}</h2>
      ${section.subheading && html`<p class="dept-row__sub">${sentence(section.subheading.replace(/ • /g, ', '))}</p>`}
      <div class="prose dept-row__prose">
        ${section.paragraphs.filter((p) => p !== 'Our selection includes:').map((p) => html`<p>${p}</p>`)}
        ${section.list &&
        html`<ul class="ticks" role="list">${section.list.map((li) => html`<li>${icon('check')}<span>${li}</span></li>`)}</ul>`}
      </div>
      ${meta.cta && html`<p class="dept-row__cta">${more(meta.cta[0], meta.cta[1])}</p>`}
    </div>
  </div>
</section>`;
}

export default {
  path: '/shop/',
  title: 'The Nursery: Trees, Perennials, Houseplants & Garden Shop',
  description:
    'Explore Columbia Nursery: trees, shrubs and perennials for Zones 3–5, five greenhouses of annuals and vegetables, houseplants, cut flowers, custom baskets, a garden shop and landscape supplies.',
  bodyClass: 'shop',
  render(ctx) {
    const sections = (ctx.data.pages?.shop?.sections || []).filter((s) => ROWS[s.heading]);
    const sale = announcements.find((a) => a.id === 'fall-sale');
    return html`${pageHeader({
      title: 'Everything for the garden, grown and gathered here.',
      lead: 'Seven acres of trees and shrubs, greenhouses full of flowers and houseplants, a garden shop and a landscape yard. Here is what you will find on the grounds.',
      seed: 11,
      children: html`<nav class="jump" aria-label="On this page"><ul role="list">${sections.map(
        (s) => html`<li><a class="chip" href="#${ROWS[s.heading].id}">${ROWS[s.heading].title}</a></li>`,
      )}</ul></nav>`,
    })}
${sale &&
html`<div class="container container--wide" data-start="${sale.start}" data-end="${sale.end}" hidden>
  <p class="note sale-note">${icon('sparkle')}<span><strong>${sale.title}.</strong> ${sale.text}</span></p>
</div>`}
<div class="dept-rows">${sections.map(row)}</div>
<section class="section closing-cta" aria-labelledby="shop-visit">
  <div class="container closing-cta__inner">
    <h2 id="shop-visit">See it in person.</h2>
    <p class="lead">Our greenhouse team is on site Monday through Saturday and happy to help you choose.</p>
    <div class="cluster">${button('/contact/', 'Plan your visit')}${button('/plants/', 'Find a plant', { variant: 'quiet' })}</div>
  </div>
</section>`;
  },
};
