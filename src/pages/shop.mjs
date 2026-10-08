/**
 * The Nursery (/shop/): every department, one photo and one line each.
 * Anchors match the links on Home.
 */
import { html } from '../lib/html.mjs';
import { pageHeader } from '../layout.mjs';
import { photo, more } from '../components.mjs';
import { PHOTOS, pexelsUrl } from '../photos.mjs';
import { announcements } from '../config.mjs';

const ROWS = [
  { id: 'trees-shrubs-perennials', title: 'Trees, shrubs & perennials', text: 'Hardy stock chosen for Zones 3 to 5, from rugged evergreens to perennials that return every year.', p: PHOTOS.pineForest, link: ['/plants/', 'Browse plants'] },
  { id: 'annuals-vegetables', title: 'Annuals & vegetables', text: 'Five greenhouses of seasonal flowers, hanging baskets and vegetable starts.', p: PHOTOS.greenhouse },
  { id: 'houseplants', title: 'Houseplants', text: 'A 30 by 60 foot greenhouse of houseplants, succulents and cacti, with pots and soil to match.', p: PHOTOS.monstera },
  { id: 'cut-flowers', title: 'Cut flowers', text: 'Dahlias, lisianthus, cosmos and more, grown on site. Build your own bouquet in season.', p: PHOTOS.dahlia },
  { id: 'custom-baskets', title: 'Custom baskets & pots', text: 'Bring your container or choose one of ours. We plant it for your colors and your light.', p: PHOTOS.basket2, link: ['/custom-baskets/', 'See the designs'] },
  { id: 'display-garden', title: 'Display garden', text: 'Mature trees, shrubs and perennials planted together, so you can see how they grow here.', p: { ...PHOTOS.displayGarden, fallback: pexelsUrl(PHOTOS.lavender.pexels, 2400) }, link: ['/display-garden/', 'Visit the garden'] },
  { id: 'garden-shop', title: 'Garden shop', text: 'Tools, seeds, books, pottery, weed mat and irrigation supplies.', p: PHOTOS.pots },
  { id: 'landscape-supplies', title: 'Landscape supplies', text: 'Fabric, edging, fertilizer and bulk rock, mulch, compost and topsoil.', p: PHOTOS.stone, link: ['/bulk-yard/', 'Bulk yard prices'] },
];

export default {
  path: '/shop/',
  title: 'The Nursery',
  description: 'Trees, shrubs, perennials, annuals, houseplants, cut flowers, custom baskets, a garden shop and landscape supplies in Columbia Falls, Montana.',
  bodyClass: 'shop',
  render() {
    const sale = announcements[0];
    return html`${pageHeader({ title: 'The nursery.', lead: 'Everything for the garden, on seven acres in Columbia Falls.' })}
${sale && html`<p class="shop-sale container" data-start="${sale.start}" data-end="${sale.end}" hidden><strong>${sale.title}.</strong> ${sale.text}</p>`}
${ROWS.map(
  (r, i) => html`<section class="dept" id="${r.id}" aria-labelledby="${r.id}-t">
  <div class="container split${i % 2 ? ' split--flip' : ''}">
    ${photo(r.p, { ratio: '4 / 3', sizes: '(min-width: 900px) 55vw, 100vw' })}
    <div class="split__body">
      <h2 id="${r.id}-t" class="dept__title">${r.title}</h2>
      <p class="lead">${r.text}</p>
      ${r.link && html`<p>${more(r.link[0], r.link[1])}</p>`}
    </div>
  </div>
</section>`,
)}`;
  },
};
