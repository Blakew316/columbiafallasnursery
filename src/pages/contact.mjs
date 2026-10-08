/**
 * Visit (/contact/): hours, address, the map and a message form (Netlify
 * Forms). Also the form's thank-you page and the site 404.
 */
import { html } from '../lib/html.mjs';
import { pageHeader, businessJsonLd } from '../layout.mjs';
import { mapEmbed, more } from '../components.mjs';
import { business, hours } from '../config.mjs';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const t12 = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return `${h % 12 || 12}${m ? `:${String(m).padStart(2, '0')}` : ''} ${h >= 12 ? 'pm' : 'am'}`;
};

const visit = {
  path: '/contact/',
  title: 'Visit',
  description: `${business.address.street}, Columbia Falls, MT ${business.address.postal}. ${hours.summary}. ${business.phone.display}.`,
  bodyClass: 'contact',
  jsonLd: businessJsonLd(),
  render: () => html`${pageHeader({ title: 'Visit.', lead: `${business.address.street}, Columbia Falls, Montana.` })}
<section class="container visit" aria-label="Hours and location">
  <div class="visit__info">
    <h2 class="visit__h">Hours</h2>
    <table class="hours">
      <tbody>${[1, 2, 3, 4, 5, 6, 0].map((d) => {
        const h = hours.week[d];
        return html`<tr><th scope="row">${DAYS[d]}</th><td>${h ? `${t12(h.open)} to ${t12(h.close)}` : 'Closed'}</td></tr>`;
      })}</tbody>
    </table>
    <h2 class="visit__h">Contact</h2>
    <p><a href="tel:${business.phone.tel}">${business.phone.display}</a></p>
    <p><a href="${business.directionsUrl}" target="_blank" rel="noopener">${business.address.street}<br />${business.address.city}, ${business.address.region} ${business.address.postal}</a></p>
  </div>
  ${mapEmbed()}
</section>

<section class="section" id="message" aria-labelledby="message-title">
  <div class="container container--narrow">
    <h2 id="message-title" class="message__title">Send a message.</h2>
    <form class="message" name="contact" method="POST" action="/contact/thanks/" data-netlify="true" netlify-honeypot="company">
      <input type="hidden" name="form-name" value="contact" />
      <p class="visually-hidden"><label>Leave empty <input name="company" tabindex="-1" autocomplete="off" /></label></p>
      <div class="message__row">
        <div class="field"><label for="f-name">Name</label><input class="input" id="f-name" name="name" autocomplete="name" required /></div>
        <div class="field"><label for="f-email">Email</label><input class="input" id="f-email" name="email" type="email" autocomplete="email" required /></div>
      </div>
      <div class="field"><label for="f-message">Message</label><textarea class="textarea" id="f-message" name="message" required></textarea></div>
      <p><button class="btn" type="submit">Send</button></p>
    </form>
  </div>
</section>`,
};

const thanks = {
  path: '/contact/thanks/',
  title: 'Message sent',
  description: 'Thanks for your message.',
  noindex: true,
  render: () => html`${pageHeader({ title: 'Thank you.', lead: 'We will be in touch soon.' })}
<p class="container center-link">${more('/', 'Home')}</p>`,
};

const notFound = {
  path: '/404.html',
  title: 'Page not found',
  description: 'Page not found.',
  noindex: true,
  render: () => html`${pageHeader({ title: 'Page not found.', lead: 'This page may have moved.' })}
<p class="container center-link">${more('/', 'Home')}</p>`,
};

export default [visit, thanks, notFound];
