/**
 * Tiny HTML templating for the static build.
 *
 * `html` is a tagged template: interpolated strings are escaped, while values
 * produced by `html`/`raw` (instances of SafeHtml) pass through untouched.
 * Arrays are flattened and joined, and null/undefined/false render nothing,
 * so `${cond && html`...`}` and `${items.map(...)}` both work.
 */

export class SafeHtml {
  constructor(value) {
    this.value = String(value);
  }
  toString() {
    return this.value;
  }
}

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escape a value for use in HTML text or a quoted attribute. */
export function esc(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ESCAPES[ch]);
}

/** Mark a trusted string (e.g. hand-written SVG) as safe to inline. */
export function raw(value) {
  return value instanceof SafeHtml ? value : new SafeHtml(value ?? '');
}

function render(value) {
  if (value === null || value === undefined || value === false || value === true) return '';
  if (value instanceof SafeHtml) return value.value;
  if (Array.isArray(value)) return value.map(render).join('');
  return esc(value);
}

export function html(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i++) out += render(values[i]) + strings[i + 1];
  return new SafeHtml(out);
}

/** Build a class attribute value from a mix of strings and {name: bool} maps. */
export function cx(...parts) {
  const names = [];
  for (const part of parts) {
    if (!part) continue;
    if (typeof part === 'string') names.push(part);
    else for (const [name, on] of Object.entries(part)) if (on) names.push(name);
  }
  return names.join(' ');
}

/** Lowercase kebab-case slug, ASCII only. */
export function slugify(text) {
  return String(text)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’']/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
