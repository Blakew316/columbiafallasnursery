/**
 * Bulk Yard (/bulk-yard/): the 2026 price list, a project calculator that
 * turns a bed size into cubic yards, cost and delivery, the original volume
 * converters, and the delivery FAQ (which never displayed on the old site).
 */
import { html, raw } from '../lib/html.mjs';
import { pageHeader } from '../layout.mjs';
import { frame, button } from '../components.mjs';
import { spot } from '../art/spots.mjs';
import { icon } from '../art/icons.mjs';
import { business } from '../config.mjs';

const CATEGORY_ORDER = ['Mulch', 'Compost', 'Soil', 'Sand', 'Rock', 'Other'];
const SWATCH = { Compost: 'bulk-compost', Mulch: 'bulk-mulch', Soil: 'bulk-soil', Sand: 'bulk-sand', Rock: 'bulk-rock', Other: 'bulk-soil' };
/** Weight class per category for the truck guidance (from the FAQ). */
const WEIGHT = { Compost: 'soil', Mulch: 'bark', Soil: 'soil', Sand: 'soil', Rock: 'rock', Other: 'soil' };

const field = (id, label, attrs = '', hint) => html`<div class="field">
  <label for="${id}">${label}</label>
  <input class="input" id="${id}" type="number" inputmode="decimal" min="0" ${raw(attrs)} />
  ${hint && html`<span class="hint">${hint}</span>`}
</div>`;

export default {
  path: '/bulk-yard/',
  title: 'Bulk Yard: Mulch, Compost, Soil & Rock Prices and Calculator',
  description:
    '2026 bulk prices per cubic yard for mulch, compost, topsoil, sand and rock in Columbia Falls, MT. Buy from a 5-gallon bucket to a truckload, estimate your project, and get Friday delivery.',
  bodyClass: 'bulk',
  scripts: ['bulk'],
  render(ctx) {
    const b = ctx.data.bulk || {};
    const products = b.products || [];
    const groups = CATEGORY_ORDER.map((c) => ({ c, items: products.filter((p) => p.category === c) })).filter((g) => g.items.length);
    const d = b.delivery || {};
    const unit = b.priceUnit === 'cubic yard' ? 'per yard' : '';

    return html`${pageHeader({
      title: 'Mulch, soil and rock. By the bucket or the truckload.',
      lead: 'A wide selection for professional landscaping and home projects. Our bulk yard is open during business hours, with staff ready to help, and delivery is available.',
      seed: 61,
      actions: html`${button('#calculator', 'Estimate your project')}${button('#prices', 'See 2026 prices', { variant: 'glass' })}`,
    })}
<section class="section section--flush bulk-quick" aria-label="Buying basics">
  <div class="container container--wide">
    <ul class="bulk-facts" role="list">
      <li>${icon('ruler')}<span><strong>Sold by the cubic yard</strong><span class="muted">As little as ${b.minimumPurchase || '1/4 yd'}, as much as a dump-truck load.</span></span></li>
      <li>${icon('basket')}<span><strong>$${b.bucketPrice?.price ?? 5} bucket fill</strong><span class="muted">Bring a 5-gallon bucket and fill it with any product.</span></span></li>
      <li>${icon('truck')}<span><strong>Friday delivery</strong><span class="muted">$${d.baseFee ?? 135} within ${d.baseRadiusMiles ?? 10} miles of the nursery.</span></span></li>
      <li>${icon('clock')}<span><strong>Open during business hours</strong><span class="muted">Monday–Saturday, 9:00 am – 5:30 pm.</span></span></li>
    </ul>
  </div>
</section>

<section class="section" id="prices" aria-labelledby="prices-title">
  <div class="container container--wide">
    <div class="section-head">
      <h2 id="prices-title">${b.year || 2026} price list.</h2>
      <p class="lead">Prices are ${unit || 'as listed'}. Ask in the yard if you would like to see a product before you load.</p>
    </div>
    <div class="price-groups">
      ${groups.map(
        (g) => html`<section class="price-group" aria-labelledby="pg-${g.c.toLowerCase()}">
        <h3 id="pg-${g.c.toLowerCase()}" class="price-group__title">${g.c === 'Other' ? 'Specialty' : g.c}</h3>
        <ul class="products" role="list">
          ${g.items.map(
            (p, i) => html`<li class="product">
            ${frame({ src: p.image?.src, alt: '', art: spot(SWATCH[p.category] || 'bulk-soil', { seed: 300 + products.indexOf(p) }), ratio: '1 / 1', className: 'frame--sm product__swatch' })}
            <span class="product__name">${p.name}</span>
            <span class="product__price">${p.priceText}${unit && html`<span class="muted"> ${unit.replace('per ', '/ ')}</span>`}</span>
          </li>`,
          )}
        </ul>
      </section>`,
      )}
    </div>
  </div>
</section>

<section class="section section--surface" id="calculator" aria-labelledby="calc-title">
  <div class="container container--wide calc">
    <div class="calc__intro">
      <h2 id="calc-title">How much do you need?</h2>
      <p class="lead">Enter the size of your bed, path or patio. We will work out the cubic yards, what it costs and whether it fits in your truck.</p>
      <p class="muted small">Estimates use the ${b.year || 2026} prices and the same formula as our yard: length × width × depth ÷ 27. Final quantities and prices are confirmed at the nursery.</p>
    </div>
    <form class="calc__form" data-calc novalidate onsubmit="return false">
      <div class="field">
        <label for="calc-product">Product</label>
        <select class="select" id="calc-product" data-calc-product>
          <option value="">Volume only</option>
          ${groups.map(
            (g) => html`<optgroup label="${g.c === 'Other' ? 'Specialty' : g.c}">${g.items.map(
              (p) => html`<option value="${p.price}" data-weight="${WEIGHT[p.category]}">${p.name}, ${p.priceText}</option>`,
            )}</optgroup>`,
          )}
        </select>
      </div>
      <fieldset class="field calc__shape">
        <legend class="label">Measure by</legend>
        <div class="segmented" role="radiogroup" aria-label="Measure by">
          <label><input type="radio" name="shape" value="rect" checked /> <span>Length × width</span></label>
          <label><input type="radio" name="shape" value="area" /> <span>Square feet</span></label>
          <label><input type="radio" name="shape" value="circle" /> <span>Circle</span></label>
        </div>
      </fieldset>
      <div class="calc__row" data-shape="rect">
        ${field('calc-length', 'Length (feet)', 'step="0.5" placeholder="20"')}
        ${field('calc-width', 'Width (feet)', 'step="0.5" placeholder="4"')}
      </div>
      <div class="calc__row" data-shape="area" hidden>
        ${field('calc-area', 'Area (square feet)', 'step="1" placeholder="80"')}
      </div>
      <div class="calc__row" data-shape="circle" hidden>
        ${field('calc-diameter', 'Diameter (feet)', 'step="0.5" placeholder="8"')}
      </div>
      <div class="field">
        <label for="calc-depth">Depth (inches)</label>
        <div class="calc__depth">
          <input class="input" id="calc-depth" type="number" inputmode="decimal" min="0" step="0.5" value="3" />
          <div class="calc__presets" role="group" aria-label="Common depths">
            ${[2, 3, 4, 6].map((n) => html`<button class="chip" type="button" data-depth="${n}">${n}″</button>`)}
          </div>
        </div>
      </div>
      ${field('calc-miles', 'Delivery distance (miles, optional)', 'step="1" placeholder="Leave blank to pick up"')}
    </form>
    <div class="calc__result" aria-live="polite" data-calc-result>
      <p class="calc__label">You need about</p>
      <p class="calc__big"><span data-out="yards">0</span> <span class="calc__unit">cubic yards</span></p>
      <p class="muted small" data-out="exact">Enter your measurements to see an estimate.</p>
      <dl class="calc__lines">
        <div data-line="cost" hidden><dt>Estimated product cost</dt><dd data-out="cost"></dd></div>
        <div data-line="delivery" hidden><dt>Delivery</dt><dd data-out="delivery"></dd></div>
        <div data-line="weight" hidden><dt>Approximate weight</dt><dd data-out="weight"></dd></div>
      </dl>
      <p class="calc__truck small" data-out="truck" hidden></p>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="tools-title">
  <div class="container container--wide">
    <div class="section-head">
      <h2 id="tools-title">More calculators.</h2>
      <p class="lead">The converters from our old site, now all working on one page.</p>
    </div>
    <div class="tools">
      <form class="tool" data-tool="cuft" onsubmit="return false">
        <h3>Cubic feet from inches</h3>
        <div class="tool__fields">
          ${field('t1-l', 'Length (in)', 'placeholder="48"')}${field('t1-w', 'Width (in)', 'placeholder="48"')}${field('t1-h', 'Height (in)', 'placeholder="12"')}
        </div>
        <p class="tool__out" aria-live="polite" data-out>—</p>
      </form>
      <form class="tool" data-tool="ft2yd" onsubmit="return false">
        <h3>Cubic feet to cubic yards</h3>
        <div class="tool__fields">${field('t2-cf', 'Cubic feet', 'placeholder="54"')}</div>
        <p class="tool__out" aria-live="polite" data-out>—</p>
      </form>
      <form class="tool" data-tool="gal" onsubmit="return false">
        <h3>Gallons and cubic feet</h3>
        <div class="tool__fields">
          ${field('t3-v', 'Amount', 'placeholder="10"')}
          <div class="field"><label for="t3-dir">Convert</label>
            <select class="select" id="t3-dir"><option value="g2c">Gallons to cubic feet</option><option value="c2g">Cubic feet to gallons</option></select>
          </div>
        </div>
        <p class="tool__out" aria-live="polite" data-out>—</p>
      </form>
      <form class="tool" data-tool="cover" onsubmit="return false">
        <h3>Bag coverage</h3>
        <div class="tool__fields">${field('t4-cf', 'Cubic feet in bag', 'step="0.01" value="2"')}${field('t4-d', 'Depth (in)', 'step="0.25" value="2"')}</div>
        <p class="tool__out" aria-live="polite" data-out>—</p>
      </form>
      <form class="tool" data-tool="bags" onsubmit="return false">
        <h3>Bags required</h3>
        <div class="tool__fields">
          ${field('t5-l', 'Length (ft)', 'placeholder="10"')}${field('t5-w', 'Width (ft)', 'placeholder="6"')}${field('t5-d', 'Depth (in)', 'placeholder="4"')}${field('t5-b', 'Cubic feet per bag', 'step="0.01" placeholder="2"')}
        </div>
        <p class="tool__out" aria-live="polite" data-out>—</p>
      </form>
    </div>
  </div>
</section>

<section class="section section--alt" id="delivery" aria-labelledby="faq-title">
  <div class="container container--wide faq">
    <div class="faq__intro">
      <h2 id="faq-title">Delivery and pickup questions.</h2>
      <p class="lead">${d.sourceText ? `Our delivery partner runs every Friday. ${d.truckCapacity ? `Each truck holds up to ${d.truckCapacity}.` : ''}` : ''}</p>
      <div class="cluster">${button(`tel:${business.phone.tel}`, 'Call to schedule', { iconName: 'phone' })}</div>
    </div>
    <div class="faq__list" id="faq">
      ${(b.faq || []).map(
        (q, i) => html`<details class="disclosure"${i === 0 ? raw(' open') : ''}>
        <summary>${q.question}</summary>
        <div class="disclosure__body">${q.answer.map((a) => html`<p>${a}</p>`)}</div>
      </details>`,
      )}
    </div>
  </div>
</section>`;
  },
};
