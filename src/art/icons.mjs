/**
 * Line icons drawn on a 24px grid with a 1.6px stroke, shipped as an inline
 * <symbol> sprite so every page can reference them with <use>.
 */
import { raw } from '../lib/html.mjs';

const ICONS = {
  sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/>',
  'part-sun': '<path d="M12 7.8a4.2 4.2 0 0 1 0 8.4Z" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/>',
  shade: '<path d="M7 18.5h9.5a4 4 0 0 0 .6-7.96A5.5 5.5 0 0 0 6.6 9.3 4.6 4.6 0 0 0 7 18.5Z"/>',
  snowflake: '<path d="M12 2.5v19M3.8 7.25l16.4 9.5M3.8 16.75l16.4-9.5"/><path d="M9.5 4l2.5 2.4L14.5 4M9.5 20l2.5-2.4 2.5 2.4M4.4 10.3l3.3-.9-.9-3.3M19.6 13.7l-3.3.9.9 3.3M6.8 17.2l.9-3.3-3.3-.9M17.2 6.8l-.9 3.3 3.3.9"/>',
  height: '<path d="M12 3v18M8.5 6.5 12 3l3.5 3.5M8.5 17.5 12 21l3.5-3.5"/>',
  spread: '<path d="M3 12h18M6.5 8.5 3 12l3.5 3.5M17.5 8.5 21 12l-3.5 3.5"/>',
  leaf: '<path d="M5 19c0-8.5 5.5-14 15-14 0 9.5-5.5 15-14 15"/><path d="M5 19c3.2-4.8 6.3-7.6 10-9.5"/>',
  bee: '<ellipse cx="12" cy="14" rx="4.2" ry="5.5"/><path d="M8 12.5h8M8.3 16h7.4M10 8.8 8.4 5.6M14 8.8l1.6-3.2"/><path d="M11 9.6c-2.4-3.4-6.4-3-7 .2-.5 2.6 2.6 3.8 7 2.4M13 9.6c2.4-3.4 6.4-3 7 .2.5 2.6-2.6 3.8-7 2.4"/>',
  deer: '<path d="M8 3.5c0 2 1 3.3 2.5 3.8M16 3.5c0 2-1 3.3-2.5 3.8M6 5.5 8 6M18 5.5 16 6"/><path d="M9 8.5c-1.6.3-3 1.4-3.5 2.6 1.6.6 3 .4 3.8-.4L10 15c.4 2.4 1 4.4 2 5.5 1-1.1 1.6-3.1 2-5.5l.7-4.3c.8.8 2.2 1 3.8.4-.5-1.2-1.9-2.3-3.5-2.6-1-.6-2-.8-3-.8s-2 .2-3 .8Z"/>',
  drop: '<path d="M12 3.5c3.6 4.2 6 7.6 6 10.7a6 6 0 0 1-12 0c0-3.1 2.4-6.5 6-10.7Z"/>',
  evergreen: '<path d="M12 2.8 7 9.4h2.6L6 14.6h3L5.4 19.6h13.2L15 14.6h3l-3.6-5.2H17L12 2.8ZM12 19.6v2"/>',
  flower: '<circle cx="12" cy="9" r="2.2"/><path d="M12 6.8c-.9-2.6.2-4.3 0-4.3s.9 1.7 0 4.3ZM12 11.2V21M12 17c-2.5 0-4-1.4-4.5-3.4 2.4-.2 4 1 4.5 3.4ZM12 15c2.5 0 4-1.4 4.5-3.4-2.4-.2-4 1-4.5 3.4Z"/><path d="M9.9 8.3c-2.6-.7-3.9-2.3-3.7-2.4.2-.2 2 .3 3.7 2.4ZM14.1 8.3c2.6-.7 3.9-2.3 3.7-2.4-.2-.2-2 .3-3.7 2.4ZM10.2 10.4c-2.2 1.5-4.2 1.2-4.2 1 0-.2 1.6-1.4 4.2-1ZM13.8 10.4c2.2 1.5 4.2 1.2 4.2 1 0-.2-1.6-1.4-4.2-1Z"/>',
  phone: '<path d="M6.6 3.5h2.6l1.4 4.4-1.9 1.3a11 11 0 0 0 6.1 6.1l1.3-1.9 4.4 1.4v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z"/>',
  pin: '<path d="M12 21.2s6.5-6 6.5-11.2a6.5 6.5 0 1 0-13 0c0 5.2 6.5 11.2 6.5 11.2Z"/><circle cx="12" cy="10" r="2.4"/>',
  clock: '<circle cx="12" cy="12" r="8.8"/><path d="M12 7.2V12l3.2 2"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.8h17M8 3v4M16 3v4"/>',
  instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.9"/><circle cx="17.1" cy="6.9" r=".9" fill="currentColor" stroke="none"/>',
  facebook: '<path d="M14.2 21v-7.6h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.2H8.6v3h2.6V21"/>',
  download: '<path d="M12 3.5v11.5M7.5 10.5 12 15l4.5-4.5M4.5 16.5v2a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2"/>',
  document: '<path d="M14 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5L14 3.5Z"/><path d="M14 3.5v5h5M8.5 13h7M8.5 16.5h5"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.6"/><path d="m15.6 15.6 4.9 4.9"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  menu: '<path d="M4 8h16M4 16h16"/>',
  'chevron-down': '<path d="m6.5 9.5 5.5 5.5 5.5-5.5"/>',
  'chevron-right': '<path d="m9.5 6.5 5.5 5.5-5.5 5.5"/>',
  'chevron-left': '<path d="m14.5 6.5-5.5 5.5 5.5 5.5"/>',
  truck: '<path d="M3 6.5h10.5v9.5H3zM13.5 10h4l3 3.2V16h-7"/><circle cx="7" cy="17.5" r="1.9"/><circle cx="17" cy="17.5" r="1.9"/>',
  basket: '<path d="M4 10.5h16l-1.6 8a2 2 0 0 1-2 1.6H7.6a2 2 0 0 1-2-1.6L4 10.5ZM8 10.5 11 4M16 10.5 13 4M9 14v3M12 14v3M15 14v3"/>',
  shovel: '<path d="M14.5 9.5 5 19M17.5 3.5l3 3-3.6 3.6-3-3 3.6-3.6ZM3.5 17.5l3 3"/>',
  sparkle: '<path d="M12 3.5c.6 4.4 2.6 6.4 7 7-4.4.6-6.4 2.6-7 7-.6-4.4-2.6-6.4-7-7 4.4-.6 6.4-2.6 7-7Z"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  'arrow-up-right': '<path d="M7 17 17 7M9 7h8v8"/>',
  ruler: '<path d="M3.5 15.5 15.5 3.5l5 5-12 12-5-5Z"/><path d="m7.5 11.5 2 2M10 9l1.5 1.5M12.5 6.5l2 2"/>',
  star: '<path d="M12 2.8l2.85 5.8 6.4.93-4.63 4.5 1.1 6.37L12 17.4l-5.72 3l1.1-6.37-4.63-4.5 6.4-.93Z" fill="currentColor" stroke="none"/>',
  thermometer: '<path d="M10 14.2V5a2 2 0 1 1 4 0v9.2a4 4 0 1 1-4 0Z"/><path d="M12 9v7"/>',
};

/** The hidden sprite, placed once at the top of <body>. */
export function iconSprite() {
  const symbols = Object.entries(ICONS)
    .map(([name, body]) => `<symbol id="i-${name}" viewBox="0 0 24 24">${body}</symbol>`)
    .join('');
  return raw(`<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">${symbols}</svg>`);
}

/** An inline icon reference. Decorative unless a label is given. */
export function icon(name, { label, className = '' } = {}) {
  if (!ICONS[name]) throw new Error(`Unknown icon: ${name}`);
  const a11y = label ? `role="img" aria-label="${label.replace(/"/g, '&quot;')}"` : 'aria-hidden="true" focusable="false"';
  return raw(`<svg class="icon ${className}" ${a11y}><use href="#i-${name}"/></svg>`);
}

export const iconNames = Object.keys(ICONS);
