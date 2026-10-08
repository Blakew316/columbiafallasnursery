/**
 * Garden Guides (/educational-handouts/): the free PDF handouts, searchable
 * and grouped by topic. Garden Calendar (/garden-calendar/): month-by-month
 * jobs for the Flathead Valley, each linked to its handout.
 */
import { html, raw } from '../lib/html.mjs';
import { mediaUrl } from '../lib/media.mjs';
import { pageHeader } from '../layout.mjs';
import { button, more } from '../components.mjs';
import { icon } from '../art/icons.mjs';
import { business } from '../config.mjs';

const TOPIC_ICON = {
  'Vegetables & herbs': 'leaf',
  'Fruit & berries': 'basket',
  'Trees, shrubs & roses': 'evergreen',
  'Flowers & bulbs': 'flower',
  Houseplants: 'sparkle',
  'Soil, water & lawn care': 'drop',
  'Seeds & season extension': 'calendar',
  'Pests & garden products': 'bee',
};

const BUILD_MONTH = new Date().getMonth() + 1;

function handoutsPage(data) {
  const handouts = data?.handouts || [];
  const topics = (data?.topics || Object.keys(TOPIC_ICON)).filter((t) => handouts.some((h) => h.topic === t));
  return {
    path: '/educational-handouts/',
    title: 'Garden Guides: Free Growing Handouts for Northwest Montana',
    description: `${handouts.length} free gardening handouts from Columbia Nursery: vegetables, fruit, trees and shrubs, flowers and bulbs, houseplants, soil, watering and seed starting for the Flathead Valley.`,
    bodyClass: 'guides',
    scripts: ['guides'],
    render: () => html`${pageHeader({
      title: 'Free guides for growing here.',
      lead: `${handouts.length} handouts written by our growers, from seed starting to fall watering. Open one on your phone in the garden or print it at home.`,
      seed: 71,
      actions: html`${button('/garden-calendar/', 'What to do this month', { iconName: 'calendar' })}`,
    })}
<section class="section section--flush guides" aria-label="Handout library">
  <div class="container container--wide">
    <div class="guides__tools">
      <form class="finder-search guides__search" role="search" onsubmit="return false">
        ${icon('search')}
        <label class="visually-hidden" for="guide-q">Search guides</label>
        <input class="finder-search__input" id="guide-q" type="search" placeholder="Search guides, like tomatoes or pruning" autocomplete="off" data-guide-q />
      </form>
      <div class="guides__topics" role="group" aria-label="Filter by topic" data-guide-topics>
        <button class="chip" type="button" aria-pressed="true" data-topic="all">All topics</button>
        ${topics.map((t) => html`<button class="chip" type="button" aria-pressed="false" data-topic="${t}">${icon(TOPIC_ICON[t] || 'leaf')}${t}</button>`)}
      </div>
      <p class="muted small" aria-live="polite" data-guide-count>${handouts.length} guides</p>
    </div>
    <div class="guide-groups">
      ${topics.map(
        (t) => html`<section class="guide-group" data-group="${t}" aria-labelledby="t-${t.replace(/\W+/g, '-').toLowerCase()}">
        <h2 class="guide-group__title" id="t-${t.replace(/\W+/g, '-').toLowerCase()}">${icon(TOPIC_ICON[t] || 'leaf')}${t}</h2>
        <ul class="guide-list" role="list">
          ${handouts
            .filter((h) => h.topic === t)
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((h) =>
              h.href
                ? html`<li data-title="${h.title.toLowerCase()}"><a class="guide" href="${mediaUrl(h.href)}" target="_blank" rel="noopener">${icon('document')}<span class="guide__title">${h.title}</span><span class="guide__type">PDF</span></a></li>`
                : html`<li data-title="${h.title.toLowerCase()}"><span class="guide guide--ask">${icon('document')}<span class="guide__title">${h.title}</span><span class="guide__type">Ask in store</span></span></li>`,
            )}
        </ul>
      </section>`,
      )}
    </div>
    <div class="guides__empty" data-guide-empty hidden>
      <h2>No guides match that search.</h2>
      <p class="muted">Try a shorter word, or call us at <a href="tel:${business.phone.tel}">${business.phone.display}</a> and we will point you in the right direction.</p>
    </div>
  </div>
</section>`,
  };
}

function calendarPage(cal, handouts) {
  const pdf = (title) => handouts?.handouts?.find((h) => h.title === title && h.href);
  return {
    path: '/garden-calendar/',
    title: 'Flathead Valley Garden Calendar: What to Do Each Month',
    description:
      'Month-by-month gardening jobs for the Flathead Valley and Zones 3–5: seed starting, planting after frost, fall watering, bulbs and garlic, with a free guide for each task.',
    bodyClass: 'calendar',
    scripts: ['guides'],
    render: () => html`${pageHeader({
      title: 'A year in a Flathead Valley garden.',
      lead: 'What to plant, prune and protect each month, with one of our free guides for every job.',
      seed: 83,
    })}
<section class="section section--flush" aria-label="Garden calendar">
  <div class="container container--wide">
    ${cal?.note && html`<p class="note cal-note">${icon('snowflake')}<span>${cal.note}</span></p>`}
    <ol class="cal" role="list" data-cal>
      ${(cal?.months || []).map(
        (m) => html`<li class="cal__month" id="${m.name.toLowerCase()}" data-month="${m.month}"${raw(m.month === BUILD_MONTH ? ' aria-current="date"' : '')}>
        <div class="cal__head">
          <h2 class="cal__name">${m.name}</h2>
          <span class="cal__now" aria-hidden="true">This month</span>
        </div>
        <p class="cal__summary">${m.summary}</p>
        <ul class="cal__tasks" role="list">
          ${m.tasks.map((t) => {
            const p = t.handout && pdf(t.handout);
            return html`<li>${icon('leaf')}<span>${t.text}${p ? html` <a class="text-link cal__guide" href="${mediaUrl(p.href)}" target="_blank" rel="noopener">${t.handout}</a>` : ''}</span></li>`;
          })}
        </ul>
      </li>`,
      )}
    </ol>
    <p class="cal__more">${more('/educational-handouts/', 'Browse all garden guides')}</p>
  </div>
</section>`,
  };
}

export default function guidePages(ctx) {
  return [handoutsPage(ctx.data.handouts), calendarPage(ctx.data.calendar, ctx.data.handouts)];
}
