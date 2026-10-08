/**
 * Bulk Yard (/bulk-yard/): 2026 prices, one calculator, delivery FAQ.
 */
import { html, raw } from '../lib/html.mjs';
import { pageHeader } from '../layout.mjs';
import { photo } from '../components.mjs';
import { PHOTOS } from '../photos.mjs';

const ORDER = ['Mulch', 'Compost', 'Soil', 'Sand', 'Rock', 'Other'];

export default {
  path: '/bulk-yard/',
  title: 'Bulk Yard',
  description: '2026 prices per cubic yard for mulch, compost, topsoil, sand and rock in Columbia Falls, MT. From a $5 bucket to a truckload, with Friday delivery.',
  bodyClass: 'bulk',
  scripts: ['bulk'],
  render(ctx) {
    const b = ctx.data.bulk || {};
    const products = b.products || [];
    const groups = ORDER.map((c) => ({ c: c === 'Other' ? 'Specialty' : c, items: products.filter((p) => p.category === c) })).filter((g) => g.items.length);
    const price = (p) => p.priceText.replace('.00', '');
    return html`${pageHeader({ title: 'Bulk yard.', lead: 'Mulch, compost, soil and rock. From a $5 bucket to a truckload.' })}
<div class="container">${photo(PHOTOS.stone, { ratio: '21 / 9', eager: true })}</div>

<section class="section" id="prices" aria-labelledby="prices-title">
  <div class="container">
    <div class="bulk-head">
      <h2 id="prices-title">${b.year || 2026} prices.</h2>
      <p class="muted">Per cubic yard. As little as a quarter yard.</p>
    </div>
    <div class="price-groups">
      ${groups.map(
        (g) => html`<section aria-label="${g.c}">
        <h3 class="price-group__title">${g.c}</h3>
        <ul class="price-list" role="list">${g.items.map((p) => html`<li><span>${p.name}</span><span>${price(p)}</span></li>`)}</ul>
      </section>`,
      )}
    </div>
  </div>
</section>

<section class="section section--alt" id="calculator" aria-labelledby="calc-title">
  <div class="container calc">
    <div>
      <h2 id="calc-title">How much do you need?</h2>
      <form class="calc__form" data-calc onsubmit="return false">
        <div class="field calc__wide">
          <label for="c-product">Product</label>
          <select class="select" id="c-product" data-product>
            <option value="">Choose a product</option>
            ${groups.map((g) => html`<optgroup label="${g.c}">${g.items.map((p) => html`<option value="${p.price}">${p.name}</option>`)}</optgroup>`)}
          </select>
        </div>
        <div class="field"><label for="c-l">Length (ft)</label><input class="input" id="c-l" type="number" inputmode="decimal" min="0" step="0.5" /></div>
        <div class="field"><label for="c-w">Width (ft)</label><input class="input" id="c-w" type="number" inputmode="decimal" min="0" step="0.5" /></div>
        <div class="field"><label for="c-d">Depth (in)</label><input class="input" id="c-d" type="number" inputmode="decimal" min="0" step="0.5" value="3" /></div>
      </form>
    </div>
    <div class="calc__out" aria-live="polite">
      <p class="calc__big"><span data-yards>0</span><span class="calc__unit"> yards</span></p>
      <p class="calc__cost" data-cost></p>
    </div>
  </div>
</section>

<section class="section" id="faq" aria-labelledby="faq-title">
  <div class="container container--narrow">
    <h2 id="faq-title" class="faq__title">Questions.</h2>
    ${(b.faq || []).map(
      (q, i) => html`<details class="disclosure"${raw(i === 0 ? ' open' : '')}>
      <summary>${q.question}</summary>
      <div class="disclosure__body">${q.answer.map((a) => html`<p>${a}</p>`)}</div>
    </details>`,
    )}
  </div>
</section>`;
  },
};
