/**
 * Download every photo and PDF from the previous WordPress site into
 * static/media/ (paths come from src/data/media.json). Run this once, from a
 * machine with internet access, BEFORE the old site is switched off, then
 * commit static/media/. The next build uses the local copies automatically.
 *
 *   npm run media            download anything missing
 *   npm run media -- --force re-download everything
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const list = JSON.parse(readFileSync(path.join(ROOT, 'src/data/media.json'), 'utf8'));
const items = Array.isArray(list) ? list : list.items || [];
const force = process.argv.includes('--force');
let ok = 0;
let skipped = 0;
const failed = [];

async function fetchFirst(urls) {
  for (const url of urls.filter(Boolean)) {
    try {
      const res = await fetch(url, { redirect: 'follow' });
      if (res.ok) return Buffer.from(await res.arrayBuffer());
    } catch {
      /* try the next candidate */
    }
  }
  return null;
}

const queue = [...items];
async function worker() {
  while (queue.length) {
    const item = queue.shift();
    const file = path.join(ROOT, 'static', item.local.replace(/^\/+/, ''));
    if (!force && existsSync(file)) {
      skipped++;
      continue;
    }
    // Prefer the full-size original, fall back to the resized copy the page used.
    const body = await fetchFirst([item.original, item.url]);
    if (!body) {
      failed.push(item.url);
      continue;
    }
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, body);
    ok++;
    if (ok % 25 === 0) console.log(`  ${ok} downloaded…`);
  }
}

await Promise.all(Array.from({ length: 6 }, worker));
console.log(`Downloaded ${ok}, already present ${skipped}, failed ${failed.length}.`);
if (failed.length) console.log(failed.map((u) => `  ✗ ${u}`).join('\n'));
