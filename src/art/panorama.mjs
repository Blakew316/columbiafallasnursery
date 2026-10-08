/**
 * The home page hero: a generated panorama of the Flathead Valley seen from
 * the nursery — Glacier-country crags, the Columbia Mountain massif, two
 * forested ridges with western larch mixed into the spruce, the Flathead
 * River, and the nursery's own tree rows and hoop greenhouses up front.
 *
 * Every fill is a CSS custom property (see styles/hero.css), so the same
 * markup re-tints for the four seasons and for dark mode: larches go gold in
 * fall and bare in winter, the snowline drops, greenhouses glow at night.
 * Layers carry data-depth for the scroll parallax in scripts/site.js.
 */
import { rng, r1, polyline, conifer, column, shrub, ridge, ridgeFill } from './shapes.mjs';

const W = 2400;
const H = 1000;
const X0 = -60;
const X1 = W + 60;

/** Midpoint-displacement crags between coarse summit/saddle points. */
function crags(rand) {
  let pts = [];
  let x = X0;
  let up = true;
  while (x < X1 + 160) {
    // Taller summits toward the flanks keep the centre open for the headline.
    const flank = Math.min(1, Math.abs(x - W / 2) / (W / 2));
    const y = up ? 360 - flank * 70 + rand() * 110 : 470 + rand() * 70;
    pts.push([x, y]);
    x += 120 + rand() * 120;
    up = !up;
  }
  let rough = 46;
  for (let pass = 0; pass < 4; pass++) {
    const next = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      const [ax, ay] = pts[i - 1];
      const [bx, by] = pts[i];
      next.push([(ax + bx) / 2 + (rand() - 0.5) * rough * 0.4, (ay + by) / 2 + (rand() - 0.5) * rough], pts[i]);
    }
    pts = next;
    rough *= 0.52;
  }
  return pts;
}

/** Snowfield polygon hanging below the ridge down to a jagged snowline. */
function snowfield(rand, ridgePts, snowline, maxDepth) {
  const lower = ridgePts.map(([x, y]) => {
    const streak = (rand() - 0.5) * 34 + Math.sin(x * 0.05) * 10;
    const depth = Math.max(0, Math.min(maxDepth, snowline + streak - y));
    return [x, y + depth];
  });
  return polyline([...ridgePts, ...lower.reverse()], true);
}

/** Trees along a ridge; returns { spruce, larch } path data. */
function forest(rand, fy, { step, minH, maxH, ratio, larch, sink, tiers }) {
  const spruce = [];
  const gold = [];
  for (let x = X0; x < X1; x += step[0] + rand() * (step[1] - step[0])) {
    const h = minH + rand() * (maxH - minH);
    const base = fy(x) + sink + rand() * sink;
    const shape = conifer(rand, x, base, h, h * ratio * (0.85 + rand() * 0.3), tiers, (rand() - 0.5) * h * 0.06);
    (rand() < larch ? gold : spruce).push(shape);
  }
  return { spruce: spruce.join(''), larch: gold.join('') };
}

/**
 * A hoop greenhouse seen from the side: rounded shell, a low knee wall,
 * evenly spaced ribs, a highlight along the ridge and a soft ground shadow.
 */
function quonset(x, base, w, h) {
  const k = h * 0.6; // corner radius of the hoop
  const shell =
    `M${r1(x)} ${r1(base)}L${r1(x)} ${r1(base - h + k)}` +
    `C${r1(x)} ${r1(base - h + k * 0.35)} ${r1(x + k * 0.35)} ${r1(base - h)} ${r1(x + k)} ${r1(base - h)}` +
    `L${r1(x + w - k)} ${r1(base - h)}` +
    `C${r1(x + w - k * 0.35)} ${r1(base - h)} ${r1(x + w)} ${r1(base - h + k * 0.35)} ${r1(x + w)} ${r1(base - h + k)}` +
    `L${r1(x + w)} ${r1(base)}Z`;
  const ribs = [];
  const gap = Math.max(14, h * 0.3);
  for (let rx = x + gap; rx < x + w - gap * 0.6; rx += gap) {
    const edge = Math.min(rx - x, x + w - rx);
    const lift = edge < k ? k - Math.sqrt(Math.max(0, k * k - (k - edge) * (k - edge))) : 0;
    ribs.push(`M${r1(rx)} ${r1(base - h + lift + 1.5)}V${r1(base - h * 0.2)}`);
  }
  const wall = `M${r1(x)} ${r1(base - h * 0.2)}H${r1(x + w)}V${r1(base)}H${r1(x)}Z`;
  const ridgeLine = `M${r1(x + k * 0.8)} ${r1(base - h + 2.5)}H${r1(x + w - k * 0.8)}`;
  const shadow = `M${r1(x - 10)} ${r1(base)}H${r1(x + w + 26)}l-14 ${r1(h * 0.12)}H${r1(x + 4)}Z`;
  return { shell, ribs: ribs.join(''), wall, ridgeLine, shadow };
}

function buildScene() {
  const rand = rng(1993);

  // Far crags with four seasonal snowlines.
  const cragPts = crags(rand);
  const peaks = polyline([...cragPts, [X1 + 160, H], [X0, H]], true);
  const snow = {
    winter: snowfield(rand, cragPts, 620, 400),
    spring: snowfield(rand, cragPts, 470, 140),
    summer: snowfield(rand, cragPts, 392, 40),
    fall: snowfield(rand, cragPts, 418, 70),
  };

  // Columbia Mountain: a broad massif right of centre.
  const massifWaves = ridge(rand, { base: 0, waves: [[18, 0.0042], [7, 0.012], [3, 0.031]] });
  const massifY = (x) => {
    const t = (x - 1580) / 980;
    return 486 + 150 * t * t + massifWaves(x);
  };
  const massif = ridgeFill((x) => Math.min(massifY(x), 640), X0, X1, H, 10);

  const farY = ridge(rand, { base: 648, waves: [[20, 0.0021], [11, 0.0063], [4, 0.017]] });
  const far = ridgeFill(farY, X0, X1, H, 10);
  const farTrees = forest(rand, farY, { step: [8, 15], minH: 18, maxH: 34, ratio: 0.42, larch: 0.16, sink: 4, tiers: 4 });

  const nearY = ridge(rand, { base: 742, waves: [[26, 0.0017], [12, 0.0052], [5, 0.014]] });
  const near = ridgeFill(nearY, X0, X1, H, 10);
  const nearTrees = forest(rand, nearY, { step: [13, 26], minH: 40, maxH: 84, ratio: 0.38, larch: 0.17, sink: 7, tiers: 6 });
  // A second, lower stand gives the slope canopy texture instead of a flat fill.
  const understory = forest(rand, (x) => nearY(x) + 34, { step: [16, 30], minH: 34, maxH: 60, ratio: 0.4, larch: 0.12, sink: 10, tiers: 5 });
  nearTrees.spruce += understory.spruce;
  nearTrees.larch += understory.larch;

  const valleyY = ridge(rand, { base: 836, waves: [[5, 0.003], [2, 0.011]] });
  const valley = ridgeFill(valleyY, X0, X1, H, 16);

  // The nursery: a field planted in tidy rows, with the greenhouses at its heart.
  const fieldY = ridge(rand, { base: 866, waves: [[4, 0.0026], [2, 0.009]] });
  const field = ridgeFill(fieldY, X0, X1, H, 16);
  const houses = [
    { x: 960, base: 912, w: 280, h: 56 },
    { x: 1300, base: 910, w: 310, h: 60 },
    { x: 1110, base: 940, w: 350, h: 76 },
  ];
  const rows = [
    { y: 902, s: 0.8, kind: 'spruce', gap: 26, clear: null },
    { y: 950, s: 1.16, kind: 'shrub', gap: 30, clear: [930, 1650] },
    { y: 1008, s: 1.6, kind: 'alternate', gap: 34, clear: [1060, 1500] },
  ];
  const strips = [];
  const back = [];
  const front = [];
  rows.forEach((row, ri) => {
    const s = row.s;
    // Mown strip in front of each planted row reads as cultivation.
    strips.push(`M${X0} ${r1(row.y + 3 * s)}H${X1}v${r1(9 * s)}H${X0}Z`);
    const step = row.gap * s;
    let i = 0;
    for (let x = X0 + (ri * step) / 3; x < X1; x += step, i++) {
      if (row.clear && x > row.clear[0] && x < row.clear[1]) continue;
      let d;
      let bucket = 'spruce';
      const jitter = 0.94 + rand() * 0.12; // planted, so only a little variety
      if (row.kind === 'shrub') {
        d = shrub(x, row.y + 1, 20 * s * jitter, 14 * s * jitter);
        bucket = 'shrub';
      } else if (row.kind === 'alternate' && i % 2) {
        d = column(x, row.y + 1, 36 * s * jitter, 12 * s);
      } else {
        const h = 32 * s * jitter;
        d = conifer(rand, x, row.y + 1, h, h * 0.5, 5, 0);
      }
      (ri < 1 ? back : front).push([bucket, d]);
    }
  });
  const gh = houses.map((h) => quonset(h.x, h.base, h.w, h.h));

  return {
    peaks,
    snow,
    massif,
    far,
    farTrees,
    near,
    nearTrees,
    valley,
    field,
    strips: strips.join(''),
    back,
    front,
    gh,
  };
}

const scene = buildScene();

const grad = (id, y1, y2, top, bottom) =>
  `<linearGradient id="${id}" x1="0" y1="${y1}" x2="0" y2="${y2}" gradientUnits="userSpaceOnUse">` +
  `<stop offset="0" style="stop-color:var(${top})"/><stop offset="1" style="stop-color:var(${bottom})"/></linearGradient>`;

const group = (bucket, items) =>
  items
    .filter(([b]) => b === bucket)
    .map(([, d]) => d)
    .join('');

/** Inline SVG markup for the hero panorama. */
export function panorama() {
  const s = scene;
  const ghShells = s.gh
    .map(
      (g) =>
        `<path class="pano-gh-shadow" d="${g.shadow}"/><path class="pano-gh" d="${g.shell}"/><path class="pano-gh-wall" d="${g.wall}"/>` +
        `<path class="pano-gh-ribs" d="${g.ribs}"/><path class="pano-gh-ridge" d="${g.ridgeLine}"/>`,
    )
    .join('');
  return `<svg class="pano" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
<defs>
${grad('pg-peaks', 330, 760, '--p-peaks', '--p-haze')}
${grad('pg-massif', 470, 780, '--p-massif', '--p-haze')}
${grad('pg-far', 620, 860, '--p-far', '--p-far-low')}
${grad('pg-near', 700, 940, '--p-near', '--p-near-low')}
<linearGradient id="pg-mist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--p-mist);stop-opacity:0"/><stop offset=".55" style="stop-color:var(--p-mist);stop-opacity:.75"/><stop offset="1" style="stop-color:var(--p-mist);stop-opacity:0"/></linearGradient>
</defs>
<g class="pano__layer" data-depth="0.42">
<path fill="url(#pg-peaks)" d="${s.peaks}"/>
${Object.entries(s.snow)
  .map(([season, d]) => `<path class="pano-snow pano-snow--${season}" d="${d}"/>`)
  .join('\n')}
<g class="pano-birds"><path d="M1830 250q9-7 18 0q9-7 18 0M1876 232q7-5 14 0q7-5 14 0M1904 262q6-4 12 0q6-4 12 0M1806 274q6-4 12 0q6-4 12 0"/></g>
</g>
<g class="pano__layer" data-depth="0.34"><path fill="url(#pg-massif)" d="${s.massif}"/></g>
<g class="pano__layer" data-depth="0.26">
<path fill="url(#pg-far)" d="${s.far}"/>
<path class="pano-far-trees" d="${s.farTrees.spruce}"/>
<path class="pano-larch pano-larch--far" d="${s.farTrees.larch}"/>
</g>
<g class="pano__mist" aria-hidden="true"><rect x="-200" y="632" width="2800" height="96" fill="url(#pg-mist)"/></g>
<g class="pano__layer" data-depth="0.16">
<path fill="url(#pg-near)" d="${s.near}"/>
<path class="pano-near-trees" d="${s.nearTrees.spruce}"/>
<path class="pano-larch pano-larch--near" d="${s.nearTrees.larch}"/>
</g>
<g class="pano__layer" data-depth="0.07">
<path class="pano-valley" d="${s.valley}"/>
<path class="pano-field" d="${s.field}"/>
<path class="pano-row-lines" d="${s.strips}"/>
<path class="pano-row-shrub" d="${group('shrub', s.back)}"/>
<path class="pano-row-spruce" d="${group('spruce', s.back)}"/>
${ghShells}
<path class="pano-row-shrub" d="${group('shrub', s.front)}"/>
<path class="pano-row-spruce" d="${group('spruce', s.front)}"/>
</g>
</svg>`;
}

/**
 * A short ridge-and-forest band for interior page headers, reusing the same
 * palette variables so every page shares the hero's horizon.
 */
export function ridgeBand(seed = 7) {
  const rand = rng(seed);
  const w = 2400;
  const h = 260;
  const farY = ridge(rand, { base: 120, waves: [[16, 0.0024], [8, 0.007], [3, 0.02]] });
  const nearY = ridge(rand, { base: 176, waves: [[18, 0.0019], [9, 0.0058], [4, 0.016]] });
  const far = ridgeFill(farY, -60, w + 60, h, 12);
  const near = ridgeFill(nearY, -60, w + 60, h, 12);
  const farT = forest(rand, farY, { step: [16, 28], minH: 18, maxH: 32, ratio: 0.42, larch: 0.15, sink: 3, tiers: 3 });
  const nearT = forest(rand, nearY, { step: [22, 38], minH: 34, maxH: 64, ratio: 0.4, larch: 0.16, sink: 5, tiers: 4 });
  return `<svg class="band" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
<path class="band-far" d="${far}"/><path class="band-far-trees" d="${farT.spruce}"/><path class="pano-larch pano-larch--far" d="${farT.larch}"/>
<path class="band-near" d="${near}"/><path class="band-near-trees" d="${nearT.spruce}"/><path class="pano-larch pano-larch--near" d="${nearT.larch}"/>
</svg>`;
}
