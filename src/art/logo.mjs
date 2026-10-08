/**
 * Brand mark: a spruce standing in front of a western larch. The spruce
 * takes the text colour; the larch is always larch-gold, the one warm note
 * in the identity.
 */
import { raw } from '../lib/html.mjs';

const MARK_PATHS =
  '<path class="mark-larch" d="M23 8.6 27.6 15.4H25.4L29.2 21.6H16.8L20.6 15.4H18.4ZM22.2 21.4h1.6V26h-1.6Z"/>' +
  '<path class="mark-spruce" d="M12 2.6 17.6 10.2H15.1L19.7 16.8H16.6L21.8 23.8H2.2L7.4 16.8H4.3L8.9 10.2H6.4ZM10.9 23.6h2.2V28.4h-2.2Z"/>';

export function logoMark({ size = 30, className = 'logo-mark' } = {}) {
  return raw(
    `<svg class="${className}" width="${size}" height="${size}" viewBox="0 0 32 32" aria-hidden="true" focusable="false">${MARK_PATHS}</svg>`,
  );
}

/** Standalone SVG favicon (light and dark aware). */
export function faviconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><style>.mark-spruce{fill:#1e3a34}.mark-larch{fill:#c99a2e}@media (prefers-color-scheme:dark){.mark-spruce{fill:#e9f0eb}}</style>${MARK_PATHS}</svg>`;
}
