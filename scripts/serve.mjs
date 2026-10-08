/**
 * Minimal static server for previewing the built site: serves public/ (or
 * --root DIR) with pretty URLs (/about/ → /about/index.html), applies the
 * 301s in _redirects and falls back to 404.html.
 *
 *   node scripts/serve.mjs [--root public] [--port 8080]
 */
import http from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

export function createServer(root) {
  const redirects = [];
  const rfile = path.join(root, '_redirects');
  if (existsSync(rfile)) {
    for (const line of readFileSync(rfile, 'utf8').split('\n')) {
      const [from, to, code] = line.trim().split(/\s+/);
      if (from && to) redirects.push({ from, to, code: Number(code) || 301 });
    }
  }
  return http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    let pathname = decodeURIComponent(url.pathname);
    for (const r of redirects) {
      const match = r.from.endsWith('*') ? pathname.startsWith(r.from.slice(0, -1)) : pathname === r.from;
      if (match && !existsSync(path.join(root, pathname, 'index.html'))) {
        res.writeHead(r.code, { Location: r.to });
        return res.end();
      }
    }
    let file = path.join(root, pathname);
    if (!file.startsWith(root)) {
      res.writeHead(403);
      return res.end();
    }
    if (existsSync(file) && statSync(file).isDirectory()) {
      if (!pathname.endsWith('/')) {
        res.writeHead(301, { Location: `${pathname}/${url.search}` });
        return res.end();
      }
      file = path.join(file, 'index.html');
    }
    if (!existsSync(file)) {
      const notFound = path.join(root, '404.html');
      res.writeHead(404, { 'Content-Type': TYPES['.html'] });
      return res.end(existsSync(notFound) ? readFileSync(notFound) : 'Not found');
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(readFileSync(file));
  });
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const args = process.argv.slice(2);
  const get = (flag, fallback) => (args.includes(flag) ? args[args.indexOf(flag) + 1] : fallback);
  const root = path.resolve(get('--root', 'public'));
  const port = Number(get('--port', process.env.PORT || 8080));
  createServer(root).listen(port, () => console.log(`Serving ${root} at http://localhost:${port}`));
}
