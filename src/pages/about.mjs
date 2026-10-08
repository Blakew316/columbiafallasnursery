/**
 * Our Story (/about/): the family, the grounds and what "full-service"
 * means, in the previous site's words, plus the photo gallery.
 */
import { html } from '../lib/html.mjs';
import { pageHeader, businessJsonLd } from '../layout.mjs';
import { frame, button, more } from '../components.mjs';
import { spot } from '../art/spots.mjs';
import { icon } from '../art/icons.mjs';

const GALLERY_ART = ['greenhouse', 'trees', 'annuals', 'perennials', 'shrubs', 'garden-shop', 'houseplants', 'cut-flowers', 'display-garden', 'landscape-supplies'];

const FACTS = [
  ['Since 1993', 'Family-owned and operated, now in our third generation of growers.'],
  ['7 acres', 'The largest full-service nursery in Northwest Montana.'],
  ['16 greenhouses', 'Five open to shoppers, eleven growing our custom baskets and cut flowers.'],
  ['Zones 3–5', 'Plants chosen for cold hardiness, drought tolerance and four-season beauty.'],
];

export default {
  path: '/about/',
  title: 'Our Story: A Family Nursery in Columbia Falls Since 1993',
  description:
    'Columbia Nursery has served Columbia Falls and the Flathead Valley since 1993. Family-owned, third generation, 7 acres and 16 greenhouses: the largest full-service nursery in Northwest Montana.',
  bodyClass: 'about',
  jsonLd: businessJsonLd(),
  render(ctx) {
    const s = Object.fromEntries((ctx.data.pages?.about?.sections || []).map((x, i) => [x.heading || `_${i}`, x]));
    const rooted = s['Rooted in the Flathead Valley'];
    const largest = s['The Largest Full-Service Nursery in Northwest Montana'];
    const full = s['What Makes Us a Full-Service Nursery'];
    const gallery = Object.values(s).find((x) => x.kind === 'gallery');
    const behind = s['Beauty Behind the Scenes'];
    const display = s['A Display Garden to Inspire'];
    const growing = s['Growing With You Since 1993'];
    const local = s['Local Roots, Community Focus'];
    const img = (sec) => sec?.images?.[0] && (sec.images[0].largest || sec.images[0].src);

    return html`${pageHeader({
      title: 'Rooted in the Flathead Valley.',
      lead: rooted?.paragraphs?.[0],
      seed: 23,
    })}
<section class="section section--flush">
  <div class="container container--wide">
    ${frame({ src: img(rooted), alt: 'The family behind Columbia Nursery & Landscape', art: spot('family', { seed: 3 }), ratio: '21 / 9', className: 'about-hero-photo', eager: true })}
  </div>
</section>

<section class="section facts" aria-label="At a glance">
  <div class="container container--wide">
    <dl class="facts__list">
      ${FACTS.map(([term, text]) => html`<div class="facts__item"><dt>${term}</dt><dd>${text}</dd></div>`)}
    </dl>
  </div>
</section>

<section class="section section--surface" aria-labelledby="full-service">
  <div class="container container--wide split">
    <div class="split__lead">
      <h2 id="full-service">The largest full-service nursery in Northwest Montana.</h2>
      ${largest?.paragraphs?.map((p) => html`<p class="lead">${p}</p>`)}
    </div>
    <div class="split__body">
      ${full?.paragraphs?.map((p) => html`<p>${p}</p>`)}
      <ul class="ticks" role="list">${(full?.list || []).map((li) => html`<li>${icon('check')}<span>${li}</span></li>`)}</ul>
      ${(full?.paragraphsAfterList || []).map((x) => html`<p>${x}</p>`)}
    </div>
  </div>
</section>

${gallery?.images?.length &&
html`<section class="section gallery" aria-labelledby="gallery-title">
  <div class="container container--wide">
    <div class="section-head">
      <h2 id="gallery-title">A look around the grounds.</h2>
      <p class="lead">Watering, potting and planting: a season at the nursery.</p>
    </div>
    <ul class="gallery__grid" role="list">
      ${gallery.images.map(
        (g, i) => html`<li class="gallery__item gallery__item--${i % 5}">${frame({
          src: g.src,
          alt: g.alt ? `${g.alt} at Columbia Nursery` : 'Columbia Nursery',
          art: spot(GALLERY_ART[i % GALLERY_ART.length], { seed: 80 + i }),
          ratio: i % 5 === 0 ? '4 / 5' : '4 / 3',
          className: 'frame--md',
        })}</li>`,
      )}
    </ul>
  </div>
</section>`}

<section class="section section--alt" aria-labelledby="behind">
  <div class="container container--wide duo">
    <article class="duo__item">
      ${frame({ src: 'https://columbiafallsnursery.com/wp-content/uploads/2026/05/Drone-of-Yard-1.jpeg', alt: 'Aerial view of the nursery greenhouses and yard', art: spot('greenhouse', { seed: 5 }), ratio: '3 / 2', className: 'frame--md' })}
      <h2 id="behind" class="duo__title">Beauty behind the scenes.</h2>
      ${behind?.paragraphs?.map((p) => html`<p>${p}</p>`)}
    </article>
    <article class="duo__item">
      ${frame({ src: img(display), alt: 'The walk-through display garden', art: spot('display-garden', { seed: 6 }), ratio: '3 / 2', className: 'frame--md' })}
      <h2 class="duo__title">A display garden to inspire.</h2>
      ${display?.paragraphs?.map((p) => html`<p>${p}</p>`)}
      <p>${more('/display-garden/', 'Visit the display garden')}</p>
    </article>
  </div>
</section>

<section class="section" aria-labelledby="growing">
  <div class="container container--wide split split--media">
    ${frame({ src: img(local), alt: 'The Columbia Nursery staff', art: spot('family', { seed: 9 }), ratio: '4 / 3' })}
    <div>
      <h2 id="growing">Growing with you since 1993.</h2>
      ${growing?.paragraphs?.map((p) => html`<p class="about-p">${p}</p>`)}
      <h3 class="about-sub">Local roots, community focus</h3>
      ${local?.paragraphs?.map((p) => html`<p class="about-p">${p}</p>`)}
      <div class="cluster about-actions">${button('/contact/', 'Plan your visit')}${button('/shop/', 'Explore the nursery', { variant: 'quiet' })}</div>
    </div>
  </div>
</section>`;
  },
};
