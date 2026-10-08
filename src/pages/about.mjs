/**
 * About (/about/): the family, the grounds, the team.
 */
import { html } from '../lib/html.mjs';
import { pageHeader, businessJsonLd } from '../layout.mjs';
import { photo } from '../components.mjs';
import { PHOTOS } from '../photos.mjs';

const FACTS = [
  ['1993', 'Founded'],
  ['7 acres', 'In Columbia Falls'],
  ['16', 'Greenhouses'],
  ['3', 'Generations'],
];

export default {
  path: '/about/',
  title: 'Our Story',
  description: 'Columbia Nursery has served Columbia Falls and the Flathead Valley since 1993. Family owned, third generation, 7 acres and 16 greenhouses.',
  bodyClass: 'about',
  jsonLd: businessJsonLd(),
  render() {
    return html`${pageHeader({ title: 'Our story.', lead: 'Family owned and operated since 1993. Three generations of growers, designers and plant lovers in Columbia Falls.' })}
<div class="container">${photo(PHOTOS.family, { ratio: '16 / 9', eager: true })}</div>

<section class="section" aria-label="At a glance">
  <div class="container">
    <dl class="facts">${FACTS.map(([n, l]) => html`<div><dt>${n}</dt><dd>${l}</dd></div>`)}</dl>
  </div>
</section>

<section class="section section--alt" aria-labelledby="largest">
  <div class="container container--narrow about-text">
    <h2 id="largest">The largest full-service nursery in Northwest Montana.</h2>
    <p class="lead">We grow plants, design with them and help you keep them thriving. Five greenhouses are open to you. Eleven more grow our custom baskets and cut flowers.</p>
  </div>
</section>

<section class="section" aria-label="Around the nursery">
  <div class="container">
    <ul class="photo-grid" role="list">${PHOTOS.gallery.map((g) => html`<li>${photo(g, { ratio: '1 / 1', className: 'photo--md', sizes: '(min-width: 900px) 33vw, 50vw' })}</li>`)}</ul>
  </div>
</section>

<section class="section section--alt" aria-labelledby="roots">
  <div class="container split">
    ${photo(PHOTOS.staff, { ratio: '4 / 3', sizes: '(min-width: 900px) 55vw, 100vw' })}
    <div class="split__body">
      <h2 id="roots">Local roots.</h2>
      <p class="lead">We support local schools, events and agriculture. Our team is always here with advice and a friendly smile.</p>
    </div>
  </div>
</section>`;
  },
};
