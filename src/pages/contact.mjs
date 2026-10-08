/**
 * Visit (/contact/): hours, directions, map and a message form (Netlify
 * Forms), plus the form's thank-you page and the site 404.
 */
import { html } from '../lib/html.mjs';
import { pageHeader, businessJsonLd } from '../layout.mjs';
import { button, visitDetails, mapEmbed, more } from '../components.mjs';
import { icon } from '../art/icons.mjs';
import { business, hours } from '../config.mjs';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const t12 = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'pm' : 'am'}`;
};

const TOPICS = ['General question', 'Plants & availability', 'Custom baskets', 'Bulk yard & delivery', 'Something else'];

function contactPage(pages) {
  const about = pages?.contact?.sections?.find((s) => /served the Flathead/.test(s.heading || ''));
  return {
    path: '/contact/',
    title: 'Visit Columbia Nursery: Hours, Directions & Contact',
    description: `Columbia Nursery & Landscape, ${business.address.street}, Columbia Falls, MT ${business.address.postal}. Open ${hours.summary}. Call ${business.phone.display} or send us a message.`,
    bodyClass: 'contact',
    jsonLd: businessJsonLd(),
    render: () => html`${pageHeader({
      title: 'Come see us in Columbia Falls.',
      lead: 'Walk the greenhouses, wander the display garden or bring your truck to the bulk yard. Our team is here to help.',
      seed: 97,
      actions: html`${button(business.directionsUrl, 'Get directions', { external: true, iconName: 'pin' })}${button(`tel:${business.phone.tel}`, business.phone.display, { variant: 'glass', iconName: 'phone' })}`,
    })}
<section class="section section--flush" id="hours" aria-labelledby="hours-title">
  <div class="container container--wide visit-grid">
    <div class="visit-card">
      <h2 id="hours-title" class="visit-card__title">Hours</h2>
      <p class="visit-status" data-open-status><span class="status__dot" aria-hidden="true"></span><span class="status__text">${hours.summary}</span></p>
      <table class="hours-table">
        <caption class="visually-hidden">Opening hours</caption>
        <tbody>
          ${[1, 2, 3, 4, 5, 6, 0].map((d) => {
            const h = hours.week[d];
            return html`<tr data-day="${d}"><th scope="row">${DAYS[d]}</th><td>${h ? `${t12(h.open)} – ${t12(h.close)}` : 'Closed'}</td></tr>`;
          })}
        </tbody>
      </table>
      <p class="muted small visit-card__note">The growing season runs through about October 31. Please call ahead for winter hours.</p>
      <h2 class="visit-card__title visit-card__title--gap">Find us</h2>
      ${visitDetails()}
    </div>
    ${mapEmbed()}
  </div>
</section>

<section class="section" id="message" aria-labelledby="message-title">
  <div class="container container--wide message-grid">
    <div class="message-grid__intro">
      <h2 id="message-title">Send us a message.</h2>
      <p class="lead">Questions about a plant, a custom basket order or a bulk delivery? We will get back to you as soon as we can. For anything urgent, call <a href="tel:${business.phone.tel}">${business.phone.display}</a>.</p>
      ${about && html`<div class="message-grid__about">${about.paragraphs.slice(0, 2).map((p) => html`<p>${p}</p>`)}</div>`}
    </div>
    <form class="message-form" name="contact" method="POST" action="/contact/thanks/" data-netlify="true" netlify-honeypot="company">
      <input type="hidden" name="form-name" value="contact" />
      <p class="visually-hidden"><label>Leave this empty: <input name="company" tabindex="-1" autocomplete="off" /></label></p>
      <div class="message-form__row">
        <div class="field"><label for="f-name">Name</label><input class="input" id="f-name" name="name" type="text" autocomplete="name" required /></div>
        <div class="field"><label for="f-email">Email</label><input class="input" id="f-email" name="email" type="email" autocomplete="email" required /></div>
      </div>
      <div class="message-form__row">
        <div class="field"><label for="f-phone">Phone <span class="muted">(optional)</span></label><input class="input" id="f-phone" name="phone" type="tel" autocomplete="tel" /></div>
        <div class="field"><label for="f-topic">Topic</label>
          <select class="select" id="f-topic" name="topic">${TOPICS.map((t) => html`<option>${t}</option>`)}</select>
        </div>
      </div>
      <div class="field"><label for="f-message">Message</label><textarea class="textarea" id="f-message" name="message" rows="6" required></textarea></div>
      <div class="message-form__foot">
        <button class="btn" type="submit">Send message</button>
        <p class="muted small">We only use your details to reply to you.</p>
      </div>
    </form>
  </div>
</section>`,
  };
}

const thanksPage = {
  path: '/contact/thanks/',
  title: 'Message sent',
  description: 'Thanks for contacting Columbia Nursery & Landscape.',
  noindex: true,
  render: () => html`${pageHeader({
    title: 'Message sent.',
    lead: `Thanks for reaching out. We will reply as soon as we can. If it is urgent, call us at ${business.phone.display}.`,
    seed: 5,
    actions: html`${button('/', 'Back to home')}${button('/plants/', 'Browse the plant finder', { variant: 'glass' })}`,
  })}`,
};

const notFound = {
  path: '/404.html',
  title: 'Page not found',
  description: 'This page could not be found.',
  noindex: true,
  render: () => html`${pageHeader({
    title: 'This path is overgrown.',
    lead: 'We could not find that page. It may have moved when we rebuilt our site.',
    seed: 404,
    actions: html`${button('/', 'Go to the home page')}${button('/plants/', 'Search plants', { variant: 'glass', iconName: 'search' })}`,
  })}
<section class="section section--flush">
  <div class="container">
    <ul class="lost-links" role="list">
      <li>${more('/shop/', 'The Nursery')}</li>
      <li>${more('/custom-baskets/', 'Custom Baskets')}</li>
      <li>${more('/bulk-yard/', 'Bulk Yard prices')}</li>
      <li>${more('/educational-handouts/', 'Garden Guides')}</li>
      <li>${more('/contact/', 'Hours & directions')}</li>
    </ul>
  </div>
</section>`,
};

export default function contactPages(ctx) {
  return [contactPage(ctx.data.pages), thanksPage, notFound];
}

