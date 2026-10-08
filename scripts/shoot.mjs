/**
 * Screenshot pages of a built site and report basic problems.
 *
 *   node scripts/shoot.mjs --root public --out .check/shots /about/ /plants/
 *
 * Options:
 *   --root DIR      built site to serve (default public)
 *   --out DIR       where to write PNGs (default .check/shots)
 *   --widths a,b    viewport widths (default 1440,390)
 *   --schemes a,b   light,dark (default both)
 *   --season NAME   force data-season (winter|spring|summer|fall)
 *   --full          full-page screenshots (default: full page)
 *   --viewport      first screen only
 *
 * For each page it prints console errors, failed requests to our own origin,
 * horizontal overflow, images without alt and in-page links that 404.
 * Requests to other hosts are blocked so results are deterministic offline.
 */
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { createServer } from './serve.mjs';

const args = process.argv.slice(2);
const flag = (name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);
const root = path.resolve(flag('--root', 'public'));
const out = path.resolve(flag('--out', '.check/shots'));
const widths = flag('--widths', '1440,390').split(',').map(Number);
const schemes = flag('--schemes', 'light,dark').split(',');
const season = flag('--season', null);
const viewportOnly = args.includes('--viewport');
const valueFlags = new Set(['--root', '--out', '--widths', '--schemes', '--season']);
const pages = args.filter((a, i) => a.startsWith('/') && !valueFlags.has(args[i - 1]));
if (!pages.length) pages.push('/');

mkdirSync(out, { recursive: true });
const server = createServer(root);
await new Promise((r) => server.listen(0, r));
const origin = `http://localhost:${server.address().port}`;
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
let problems = 0;

for (const pagePath of pages) {
  for (const scheme of schemes) {
    for (const width of widths) {
      const height = width < 600 ? 844 : 900;
      const context = await browser.newContext({ viewport: { width, height }, colorScheme: scheme, deviceScaleFactor: 1 });
      await context.route('**/*', (route) => (route.request().url().startsWith(origin) ? route.continue() : route.abort()));
      const page = await context.newPage();
      const issues = [];
      page.on('console', (m) => m.type() === 'error' && !/Failed to load resource/.test(m.text()) && issues.push(`console: ${m.text()}`));
      page.on('pageerror', (e) => issues.push(`pageerror: ${e.message}`));
      page.on('response', (r) => r.url().startsWith(origin) && r.status() >= 400 && issues.push(`HTTP ${r.status()}: ${r.url().replace(origin, '')}`));
      if (season) await page.addInitScript((s) => {
        new MutationObserver(() => document.documentElement.setAttribute('data-season', s)).observe(document.documentElement, { attributes: true, attributeFilter: ['data-season'] });
        document.addEventListener('DOMContentLoaded', () => document.documentElement.setAttribute('data-season', s));
      }, season);
      await page.goto(origin + pagePath, { waitUntil: 'load' });
      await page.waitForTimeout(1600);
      const report = await page.evaluate(() => {
        const doc = document.documentElement;
        const overflow = doc.scrollWidth - doc.clientWidth;
        // Elements poking past the viewport that no ancestor (other than body) clips.
        const clipped = (el) => {
          for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
            if (/(hidden|clip)/.test(getComputedStyle(a).overflowX)) return true;
          }
          return false;
        };
        const wide = overflow > 0
          ? [...document.querySelectorAll('body *')]
              .filter((el) => el.getBoundingClientRect().right > doc.clientWidth + 1 && !clipped(el))
              .slice(0, 5)
              .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`)
          : [];
        const noAlt = [...document.querySelectorAll('img:not([alt])')].map((i) => i.src).slice(0, 5);
        const links = [...new Set([...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href').split('#')[0]))];
        const h1 = document.querySelectorAll('h1').length;
        return { overflow, wide, noAlt, links, h1 };
      });
      if (report.overflow > 0) issues.push(`horizontal overflow ${report.overflow}px: ${report.wide.join(', ')}`);
      if (report.noAlt.length) issues.push(`img without alt: ${report.noAlt.join(', ')}`);
      if (report.h1 !== 1) issues.push(`expected one <h1>, found ${report.h1}`);
      if (scheme === schemes[0] && width === widths[0]) {
        for (const href of report.links) {
          const res = await context.request.get(origin + href, { maxRedirects: 0 }).catch(() => null);
          if (!res || res.status() >= 400) issues.push(`broken link: ${href} (${res ? res.status() : 'error'})`);
        }
      }
      const slug = pagePath.replace(/^\/|\/$/g, '').replace(/[^a-z0-9]+/gi, '-') || 'home';
      const file = path.join(out, `${slug}-${width}-${scheme}${season ? '-' + season : ''}.png`);
      await page.screenshot({ path: file, fullPage: !viewportOnly });
      console.log(`${issues.length ? '✗' : '✓'} ${pagePath} ${width}px ${scheme} → ${path.relative(process.cwd(), file)}`);
      for (const i of issues) console.log(`    ${i}`);
      problems += issues.length;
      await context.close();
    }
  }
}

await browser.close();
server.close();
console.log(problems ? `${problems} issue(s) found.` : 'No issues found.');
process.exitCode = problems ? 1 : 0;
