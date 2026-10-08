/**
 * Resolve photos and PDFs from the previous WordPress site.
 *
 * `npm run media` downloads every asset listed in src/data/media.json into
 * static/media/. At build time each original URL resolves to that local copy
 * when it exists, otherwise to the original URL (which keeps working for as
 * long as the old site is online). Frames fall back to illustrations if a
 * photo is unavailable, so a missing file never shows as broken.
 */
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const MANIFEST = path.join(ROOT, 'src', 'data', 'media.json');
const STATIC = path.join(ROOT, 'static');

let index = null;

function load() {
  if (index) return index;
  index = new Map();
  if (existsSync(MANIFEST)) {
    const list = JSON.parse(readFileSync(MANIFEST, 'utf8'));
    for (const item of Array.isArray(list) ? list : list.items || []) {
      if (item.url && item.local) index.set(item.url, item);
      if (item.original && item.local) index.set(item.original, item);
    }
  }
  return index;
}

/** Local path of a downloaded copy, or null. */
export function localCopy(url) {
  const item = load().get(url);
  if (!item) return null;
  const rel = item.local.replace(/^\/+/, '');
  return existsSync(path.join(STATIC, rel)) ? `/${rel}` : null;
}

/** Best URL for an original asset: local copy first, then the original. */
export function mediaUrl(url) {
  if (!url) return null;
  return localCopy(url) || url;
}

/** True when every manifest entry has a local copy (used by the README check). */
export function mediaStatus() {
  const items = [...new Set(load().values())];
  const have = items.filter((i) => existsSync(path.join(STATIC, i.local.replace(/^\/+/, '')))).length;
  return { total: items.length, local: have };
}
