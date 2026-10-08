/**
 * Custom Baskets (/custom-baskets/): how it works, the two handouts, and
 * the design lookbook (sun or shade).
 */
import { html, raw } from '../lib/html.mjs';
import { mediaUrl } from '../lib/media.mjs';
import { pageHeader } from '../layout.mjs';
import { photo, more } from '../components.mjs';
import { PHOTOS } from '../photos.mjs';
import { icon } from '../art/icons.mjs';

const STEPS = [
  ['Bring your containers', 'Or choose from our baskets, ceramic pots and planters.'],
  ['Tell us what you like', 'Colors, style, sun or shade.'],
  ['We plant and grow them', 'Early in the season, in our greenhouses.'],
  ['Pick them up in bloom', 'With care instructions for the season.'],
];

const SUN = new Set(['full-sun', 'part-sun']);

const LIGHTS = ['Full sun', 'Part sun', 'Part shade', 'Full shade', 'A mix'];

/** Custom basket request (Netlify Forms). */
function orderForm(designs) {
  return html`<section class="section" id="order" aria-labelledby="order-title">
  <div class="container container--narrow">
    <div class="order__head">
      <h2 id="order-title">Start your order.</h2>
      <p class="lead">Tell us what you would like and we will call to confirm your drop-off.</p>
    </div>
    <form class="order" name="custom-basket" method="POST" action="/custom-baskets/thanks/" data-netlify="true" netlify-honeypot="company" data-order>
      <input type="hidden" name="form-name" value="custom-basket" />
      <p class="visually-hidden"><label>Leave empty <input name="company" tabindex="-1" autocomplete="off" /></label></p>
      <div class="order__grid">
        <div class="field"><label for="o-name">Name</label><input class="input" id="o-name" name="name" autocomplete="name" required /></div>
        <div class="field"><label for="o-phone">Phone</label><input class="input" id="o-phone" name="phone" type="tel" autocomplete="tel" required /></div>
        <div class="field order__full"><label for="o-email">Email</label><input class="input" id="o-email" name="email" type="email" autocomplete="email" required /></div>
        <div class="field"><label for="o-count">Number of containers</label><input class="input" id="o-count" name="containers" type="number" inputmode="numeric" min="1" step="1" value="1" required /></div>
        <div class="field"><label for="o-source">Containers</label>
          <select class="select" id="o-source" name="container_source" required>
            <option>I will bring my own</option>
            <option>I would like to choose from yours</option>
          </select>
        </div>
        <div class="field"><label for="o-light">Light where they will hang</label>
          <select class="select" id="o-light" name="light" required>${LIGHTS.map((l) => html`<option>${l}</option>`)}</select>
        </div>
        <div class="field"><label for="o-design">Design</label>
          <select class="select" id="o-design" name="design" data-order-design>
            <option>Your choice</option>
            ${designs.map((d) => html`<option>${d.name}</option>`)}
          </select>
        </div>
        <div class="field order__full"><label for="o-colors">Colors you love</label><input class="input" id="o-colors" name="colors" placeholder="Pinks and whites, nothing orange" /></div>
        <div class="field"><label for="o-date">Preferred drop-off date</label><input class="input" id="o-date" name="drop_off_date" type="date" /></div>
        <div class="field order__full"><label for="o-notes">Anything else</label><textarea class="textarea" id="o-notes" name="notes" rows="4"></textarea></div>
      </div>
      <p class="order__submit"><button class="btn" type="submit">Send request</button></p>
    </form>
  </div>
</section>`;
}

const thanks = {
  path: '/custom-baskets/thanks/',
  title: 'Basket request sent',
  description: 'Your custom basket request was sent.',
  noindex: true,
  render: () => html`${pageHeader({ title: 'Request received.', lead: 'We will call you to confirm your drop-off.' })}
<p class="container center-link">${more('/custom-baskets/', 'Back to custom baskets')}</p>`,
};

const page = {
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
<p class="container order-jump">${more('#order', 'Start your order')}</p>
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
    <div class="lightbox__meta"><p data-caption aria-live="polite"></p><a class="more" href="#order" data-choose>Choose this design</a></div>
    <button type="button" data-next aria-label="Next">${icon('chevron-right')}</button>
  </div>
</dialog>
<script type="application/json" data-look-data>${raw(
      JSON.stringify(designs.map((d) => ({ name: d.name, light: d.light, src: mediaUrl(d.image?.src) }))).replace(/</g, '\\u003c'),
    )}</script>
${orderForm(designs)}`;
  },
};

export default [page, thanks];
