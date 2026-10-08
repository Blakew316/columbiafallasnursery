/**
 * Render the PNG icons and the social share image into static/ from the
 * brand mark and the hero panorama. Run after changing the logo or hero:
 *   node scripts/icons.mjs
 */
import { chromium } from 'playwright';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { faviconSvg } from '../src/art/logo.mjs';
import { panorama } from '../src/art/panorama.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = (f) => path.join(ROOT, 'static', f);
const mark = faviconSvg().replace('<svg ', '<svg width="100%" height="100%" ');
const css = ['tokens.css', 'panorama.css'].map((f) => readFileSync(path.join(ROOT, 'src/styles', f), 'utf8')).join('\n');
const font = path.join(ROOT, 'static/fonts/inter-var-latin.woff2');

const browser = await chromium.launch();
const page = await browser.newPage({ colorScheme: 'light' });

for (const [file, size, pad, bg] of [
  ['favicon-32.png', 32, 2, 'transparent'],
  ['apple-touch-icon.png', 180, 30, '#f2f5f1'],
  ['icon-192.png', 192, 30, '#f2f5f1'],
  ['icon-512.png', 512, 80, '#f2f5f1'],
]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<body style="margin:0;background:${bg}"><div style="width:${size}px;height:${size}px;padding:${pad}px;box-sizing:border-box">${mark}</div></body>`);
  await page.screenshot({ path: out(file), omitBackground: bg === 'transparent' });
}

await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(`<html data-season="fall"><head><style>
@font-face{font-family:'Inter Var';src:url('file://${font}') format('woff2');font-weight:100 900}
${css}
body{margin:0}
.og{position:relative;width:1200px;height:630px;overflow:hidden;background:radial-gradient(40% 40% at 66% 70%,var(--sun),transparent 70%),linear-gradient(var(--sky-top),var(--sky-mid) 55%,var(--sky-low))}
.og .pano{position:absolute;left:0;right:0;bottom:0;width:100%;height:62%}
.og h1{position:absolute;top:70px;left:0;right:0;margin:0;text-align:center;font:700 92px/1 'Inter Var',sans-serif;letter-spacing:-.04em;color:#14241f}
.og p{position:absolute;top:186px;left:0;right:0;margin:0;text-align:center;font:500 30px/1.2 'Inter Var',sans-serif;letter-spacing:-.015em;color:#47574f}
</style></head><body><div class="og"><h1>Grown for Montana.</h1><p>Columbia Nursery &amp; Landscape, Columbia Falls, Montana</p>${panorama()}</div></body></html>`);
await page.waitForTimeout(300);
await page.screenshot({ path: out('og.png') });
await browser.close();
console.log('Wrote favicon-32.png, apple-touch-icon.png, icon-192.png, icon-512.png and og.png to static/.');
