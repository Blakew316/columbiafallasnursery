/**
 * Garden Guides (/educational-handouts/) and Garden Calendar (/garden-calendar/).
 */
import { html, raw } from '../lib/html.mjs';
import { mediaUrl } from '../lib/media.mjs';
import { pageHeader } from '../layout.mjs';
import { photo, more } from '../components.mjs';
import { PHOTOS } from '../photos.mjs';
import { icon } from '../art/icons.mjs';

const BUILD_MONTH = new Date().getMonth() + 1;
const cleanTitle = (t) => t.replace(/\s*[–—]\s*/g, ': ');

function handoutsPage(data) {
  const handouts = (data?.handouts || []).filter((h) => h.href);
  const topics = (data?.topics || []).filter((t) => handouts.some((h) => h.topic === t));
  return {
    path: '/educational-handouts/',
    title: 'Garden Guides',
    description: `${handouts.length} free growing guides from Columbia Nursery for the Flathead Valley.`,
    bodyClass: 'guides',
    scripts: ['guides'],
    render: () => html`${pageHeader({ title: 'Garden guides.', lead: 'Free growing guides from our team.' })}
<div class="container guides__photo">${photo(PHOTOS.potting, { ratio: '21 / 9', eager: true })}</div>
<section class="container guides" aria-label="Guides">
  <form class="search guides__search" role="search" onsubmit="return false">
    ${icon('search')}
    <label class="visually-hidden" for="guide-q">Search guides</label>
    <input id="guide-q" type="search" placeholder="Search" autocomplete="off" data-guide-q />
  </form>
  <p class="guides__cal">${more('/garden-calendar/', 'What to do this month')}</p>
  <div class="guide-groups">
    ${topics.map(
      (t) => html`<section data-group aria-label="${t}">
      <h2 class="guide-group__title">${t}</h2>
      <ul class="guide-list" role="list">
        ${handouts
          .filter((h) => h.topic === t)
          .sort((a, b) => a.title.localeCompare(b.title))
          .map((h) => html`<li data-title="${h.title.toLowerCase()}"><a href="${mediaUrl(h.href)}" target="_blank" rel="noopener">${cleanTitle(h.title)}</a></li>`)}
      </ul>
    </section>`,
    )}
  </div>
  <p class="guides__empty" data-guide-empty hidden>No guides match.</p>
</section>`,
  };
}

function calendarPage(cal, handouts) {
  const pdf = (title) => handouts?.handouts?.find((h) => h.title === title && h.href);
  return {
    path: '/garden-calendar/',
    title: 'Garden Calendar',
    description: 'Month by month gardening for the Flathead Valley and Zones 3 to 5.',
    bodyClass: 'calendar',
    scripts: ['guides'],
    render: () => html`${pageHeader({ title: 'Garden calendar.', lead: 'What to do each month in the Flathead Valley.' })}
<div class="container">${photo(PHOTOS.lavender, { ratio: '21 / 9', eager: true })}</div>
<section class="section container" aria-label="Months">
  <ol class="cal" role="list" data-cal>
    ${(cal?.months || []).map(
      (m) => html`<li class="cal__month" id="${m.name.toLowerCase()}" data-month="${m.month}"${raw(m.month === BUILD_MONTH ? ' aria-current="date"' : '')}>
      <h2 class="cal__name">${m.name}</h2>
      <ul class="cal__tasks" role="list">
        ${m.tasks.map((t) => {
          const p = t.handout && pdf(t.handout);
          return html`<li>${p ? html`<a href="${mediaUrl(p.href)}" target="_blank" rel="noopener">${t.text}</a>` : t.text}</li>`;
        })}
      </ul>
    </li>`,
    )}
  </ol>
</section>`,
  };
}

export default function guidePages(ctx) {
  return [handoutsPage(ctx.data.handouts), calendarPage(ctx.data.calendar, ctx.data.handouts)];
}
