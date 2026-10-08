/**
 * Bulk Yard (/bulk-yard/): 2026 prices, one calculator, delivery FAQ.
 */
import { html, raw } from '../lib/html.mjs';
import { pageHeader } from '../layout.mjs';
import { photo, more } from '../components.mjs';
import { PHOTOS } from '../photos.mjs';

const ORDER = ['Mulch', 'Compost', 'Soil', 'Sand', 'Rock', 'Other'];

/** Friday delivery request (Netlify Forms), prefilled from the calculator. */
function deliveryForm(groups, d) {
  const base = d?.baseFee ?? 135;
  const radius = d?.baseRadiusMiles ?? 10;
  return html`<section class="section" id="delivery" aria-labelledby="delivery-title">
  <div class="container container--narrow">
    <div class="delivery__head">
      <h2 id="delivery-title">Friday delivery.</h2>
      <p class="lead">$${base} within ${radius} miles of the nursery, plus $${d?.extraFee ?? 135} for each extra ${d?.extraPerMiles ?? 10} miles. Up to 12 yards of rock or 14 of bark per load.</p>
    </div>
    <form class="delivery" name="bulk-delivery" method="POST" action="/bulk-yard/thanks/" data-netlify="true" netlify-honeypot="bot-field" data-delivery>
      <input type="hidden" name="form-name" value="bulk-delivery" />
      <p class="visually-hidden"><label>Leave empty <input name="bot-field" tabindex="-1" autocomplete="off" /></label></p>
      <div class="order__grid">
        <div class="field"><label for="d-product">Product</label>
          <select class="select" id="d-product" name="product" required data-del-product>
            <option value="">Choose a product</option>
            ${groups.map((g) => html`<optgroup label="${g.c}">${g.items.map((p) => html`<option value="${p.name}" data-price="${p.price}">${p.name}</option>`)}</optgroup>`)}
          </select>
        </div>
        <div class="field"><label for="d-yards">Yards</label><input class="input" id="d-yards" name="yards" type="number" inputmode="decimal" min="0.25" step="0.25" required data-del-yards /></div>
        <div class="field order__full"><label for="d-address">Delivery address</label><input class="input" id="d-address" name="address" autocomplete="street-address" required /></div>
        <div class="field"><label for="d-town">Town</label><input class="input" id="d-town" name="town" autocomplete="address-level2" required /></div>
        <div class="field"><label for="d-friday">Friday</label>
          <select class="select" id="d-friday" name="friday" required data-fridays><option>Next available Friday</option></select>
        </div>
        <div class="field order__full"><label for="d-placement">Where should we leave it?</label><input class="input" id="d-placement" name="placement" placeholder="Driveway, left side" /></div>
        <div class="field"><label for="d-name">Name</label><input class="input" id="d-name" name="name" autocomplete="name" required /></div>
        <div class="field"><label for="d-phone">Phone</label><input class="input" id="d-phone" name="phone" type="tel" autocomplete="tel" required /></div>
        <div class="field order__full"><label for="d-email">Email</label><input class="input" id="d-email" name="email" type="email" autocomplete="email" /></div>
      </div>
      <p class="delivery__estimate" aria-live="polite" data-del-estimate></p>
      <p class="order__submit"><button class="btn" type="submit">Request delivery</button></p>
    </form>
  </div>
</section>`;
}

const thanks = {
  path: '/bulk-yard/thanks/',
  title: 'Delivery requested',
  description: 'Your delivery request was sent.',
  noindex: true,
  render: () => html`${pageHeader({ title: 'Delivery requested.', lead: 'We will call to confirm your Friday and your total.' })}
<p class="container center-link">${more('/bulk-yard/', 'Back to the bulk yard')}</p>`,
};

const page = {
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
        <ul class="price-list" role="list">${g.items.map(
          (p) => html`<li>${photo(p.image?.src ? { src: p.image.src, alt: '' } : null, { ratio: '1 / 1', className: 'photo--sm swatch', sizes: '48px' })}<span class="price-list__name">${p.name}</span><span class="price-list__price">${price(p)}</span></li>`,
        )}</ul>
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
      <p class="calc__deliver">${more('#delivery', 'Have it delivered')}</p>
    </div>
  </div>
</section>

${deliveryForm(groups, b.delivery)}

<section class="section section--alt" id="faq" aria-labelledby="faq-title">
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

export default [page, thanks];
