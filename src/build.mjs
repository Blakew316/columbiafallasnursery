/**
 * Static site build: renders every page module in src/pages into public/,
 * bundles CSS and JS with content hashes, copies static assets and writes
 * sitemap.xml, robots.txt, _redirects and the web manifest.
 *
 * Page modules export default either a page object, an array of them, or a
 * function (ctx) returning either. A page object is:
 *   { path, title, description, render(ctx) -> SafeHtml,
 *     scripts?: ['name'], bodyClass?, jsonLd?, head?, noindex?, sitemap? }
 * where scripts names files in src/scripts/pages/<name>.js.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, existsSync, cpSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { documentHtml } from './layout.mjs';
import { SITE_URL, business } from './config.mjs';
import { faviconSvg } from './art/logo.mjs';
import { mediaStatus } from './lib/media.mjs';
import { takeSpotDefs } from './art/spots.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
// BUILD_OUT lets several people preview in parallel without clobbering public/.
const OUT = process.env.BUILD_OUT ? path.resolve(process.env.BUILD_OUT) : path.join(ROOT, 'public');
// ONLY=a.mjs,b.mjs renders just those page modules (handy while one page is in progress).
const ONLY = process.env.ONLY ? process.env.ONLY.split(',').map((s) => s.trim()) : null;
const started = performance.now();

/** Stylesheets in cascade order; page sheets are appended alphabetically. */
const CSS_ORDER = ['tokens.css', 'base.css', 'panorama.css', 'layout.css', 'components.css', 'home.css'];

const hash = (text) => createHash('sha256').update(text).digest('hex').slice(0, 10);

function write(rel, content) {
  const file = path.join(OUT, rel);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, content);
}

function readJson(name) {
  const file = path.join(SRC, 'data', `${name}.json`);
  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null;
}

function bundleCss() {
  const dir = path.join(SRC, 'styles');
  const pageDir = path.join(dir, 'pages');
  const files = [
    ...CSS_ORDER.filter((f) => existsSync(path.join(dir, f))).map((f) => path.join(dir, f)),
    ...(existsSync(pageDir) ? readdirSync(pageDir).filter((f) => f.endsWith('.css')).sort().map((f) => path.join(pageDir, f)) : []),
  ];
  const css = files.map((f) => `/* ${path.relative(SRC, f)} */\n${readFileSync(f, 'utf8')}`).join('\n');
  const name = `assets/site.${hash(css)}.css`;
  write(name, css);
  return `/${name}`;
}

function bundleJs() {
  const site = readFileSync(path.join(SRC, 'scripts', 'site.js'), 'utf8');
  const siteName = `assets/site.${hash(site)}.js`;
  write(siteName, site);
  const pages = {};
  const dir = path.join(SRC, 'scripts', 'pages');
  if (existsSync(dir)) {
    for (const f of readdirSync(dir).filter((f) => f.endsWith('.js'))) {
      const code = readFileSync(path.join(dir, f), 'utf8');
      const name = `assets/${f.replace(/\.js$/, '')}.${hash(code)}.js`;
      write(name, code);
      pages[f.replace(/\.js$/, '')] = `/${name}`;
    }
  }
  return { site: `/${siteName}`, pages };
}

async function loadPages(ctx) {
  const dir = path.join(SRC, 'pages');
  const pages = [];
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.mjs') && (!ONLY || ONLY.includes(f))).sort()) {
    const mod = await import(pathToFileURL(path.join(dir, f)).href);
    let value = mod.default;
    if (typeof value === 'function') value = await value(ctx);
    for (const page of [value].flat().filter(Boolean)) pages.push({ ...page, module: f });
  }
  const seen = new Map();
  for (const p of pages) {
    if (seen.has(p.path)) throw new Error(`Duplicate page path ${p.path} in ${p.module} and ${seen.get(p.path)}`);
    seen.set(p.path, p.module);
  }
  return pages;
}

function outFile(pagePath) {
  if (pagePath.endsWith('.html')) return pagePath.slice(1);
  return path.join(pagePath.slice(1), 'index.html');
}

/** Old WordPress URLs → new pages (Netlify _redirects format). */
const REDIRECTS = [
  ['/full-service-nursery-in-northwest-montana-columbia-nursery/', '/about/'],
  ['/full-service-nursery-in-northwest-montana-columbia-nursery', '/about/'],
  ['/about-us/', '/about/'],
  ['/about-us', '/about/'],
  ['/our-shop/', '/shop/'],
  ['/our-shop', '/shop/'],
  ['/display-garden-4/', '/display-garden/'],
  ['/display-garden-4', '/display-garden/'],
  ['/display-garden-plants/', '/plants/'],
  ['/display-garden-plants', '/plants/'],
  ['/display-garden-plant/', '/plants/'],
  ['/display-garden-plant', '/plants/'],
  ['/elementor-hf/*', '/'],
];

async function main() {
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });

  // Static assets.
  const staticDir = path.join(ROOT, 'static');
  if (existsSync(path.join(staticDir, 'fonts'))) cpSync(path.join(staticDir, 'fonts'), path.join(OUT, 'assets', 'fonts'), { recursive: true });
  if (existsSync(path.join(staticDir, 'media'))) cpSync(path.join(staticDir, 'media'), path.join(OUT, 'media'), { recursive: true });
  for (const f of existsSync(staticDir) ? readdirSync(staticDir) : []) {
    const full = path.join(staticDir, f);
    if (statSync(full).isFile()) cpSync(full, path.join(OUT, 'assets', f));
  }
  write('assets/favicon.svg', faviconSvg());

  const css = bundleCss();
  const js = bundleJs();

  const data = new Proxy({}, { get: (cache, key) => (key in cache ? cache[key] : (cache[key] = readJson(String(key)))) });
  const ctx = { data, siteUrl: SITE_URL, asset: (name) => js.pages[name] };
  const pages = await loadPages(ctx);

  for (const page of pages) {
    const scripts = (page.scripts || []).map((name) => {
      if (!js.pages[name]) throw new Error(`Page ${page.path} wants missing script src/scripts/pages/${name}.js`);
      return js.pages[name];
    });
    takeSpotDefs(); // discard anything rendered outside this page
    const main = page.render(ctx);
    const defs = takeSpotDefs();
    write(outFile(page.path), documentHtml({ ...page, scripts, defs }, main, { css, js: js.site }));
  }

  const listed = pages.filter((p) => p.sitemap !== false && !p.noindex && !p.path.endsWith('.html'));
  write(
    'sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${listed
      .map((p) => `  <url><loc>${SITE_URL}${p.path}</loc></url>`)
      .join('\n')}\n</urlset>\n`,
  );
  write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
  write('_redirects', REDIRECTS.map(([from, to]) => `${from}  ${to}  301`).join('\n') + '\n');
  write(
    'site.webmanifest',
    JSON.stringify(
      {
        name: business.name,
        short_name: business.shortName,
        start_url: '/',
        display: 'browser',
        background_color: '#f2f5f1',
        theme_color: '#1e3a34',
        icons: [
          { src: '/assets/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/assets/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/assets/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
        ],
      },
      null,
      2,
    ),
  );

  const m = mediaStatus();
  const ms = Math.round(performance.now() - started);
  console.log(`Built ${pages.length} pages into public/ in ${ms} ms. Media: ${m.local}/${m.total} downloaded locally.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
