/**
 * Spot illustrations: small layered vignettes in the same flat, hazy style as
 * the hero panorama. They sit under photos in .frame elements (and stand in
 * for them when a photo is unavailable).
 *
 * spot(kind, { seed }) returns trusted SVG markup (viewBox 800×600, sliced to
 * fill any frame). Colours come from the panorama variables plus the --s-*
 * spot variables in styles/components.css, so the art follows the season and
 * dark mode automatically.
 */
import { rng, r1, conifer, shrub, ridge, ridgeFill, polyline } from './shapes.mjs';

export const SPOT_KINDS = [
  'trees', 'shrubs', 'perennials', 'grasses', 'annuals', 'vegetables', 'houseplants', 'cut-flowers',
  'baskets', 'garden-shop', 'landscape-supplies', 'display-garden', 'greenhouse', 'family',
  'bulk-rock', 'bulk-mulch', 'bulk-soil', 'bulk-sand', 'bulk-compost',
];

const W = 800;
const H = 600;
const BLOOMS = ['--s-bloom-1', '--s-bloom-2', '--s-bloom-3', '--s-bloom-4', '--s-bloom-5'];

const p = (cls, d) => (d ? `<path class="${cls}" d="${d}"/>` : '');
const fill = (v, d, extra = '') => (d ? `<path style="fill:var(${v})"${extra} d="${d}"/>` : '');
const circle = (cx, cy, r) => `M${r1(cx - r)} ${r1(cy)}a${r1(r)} ${r1(r)} 0 1 0 ${r1(r * 2)} 0a${r1(r)} ${r1(r)} 0 1 0 ${r1(-r * 2)} 0Z`;
const ellipse = (cx, cy, rx, ry) => `M${r1(cx - rx)} ${r1(cy)}a${r1(rx)} ${r1(ry)} 0 1 0 ${r1(rx * 2)} 0a${r1(rx)} ${r1(ry)} 0 1 0 ${r1(-rx * 2)} 0Z`;

/** Sky and two distant ridges, shared by the outdoor scenes. */
function backdrop(rand, { far = 330, near = 400, trees = true } = {}) {
  const farY = ridge(rand, { base: far, waves: [[20, 0.008], [9, 0.023]] });
  const nearY = ridge(rand, { base: near, waves: [[16, 0.006], [7, 0.019]] });
  const t = [];
  const g = [];
  if (trees) {
    for (let x = -10; x < W + 10; x += 26 + rand() * 22) {
      const h = 26 + rand() * 30;
      (rand() < 0.16 ? g : t).push(conifer(rand, x, nearY(x) + 8, h, h * 0.42, 3));
    }
  }
  return (
    `<rect width="${W}" height="${H}" class="spot-sky"/>` +
    `<ellipse cx="${r1(520 + rand() * 120)}" cy="${far - 10}" rx="260" ry="120" class="spot-sun"/>` +
    p('band-far', ridgeFill(farY, -10, W + 10, H, 10)) +
    p('band-near', ridgeFill(nearY, -10, W + 10, H, 10)) +
    p('band-near-trees', t.join('')) +
    p('pano-larch pano-larch--near', g.join(''))
  );
}

/** Rolling ground in front of the backdrop. */
function ground(rand, base = 470, cls = 'spot-ground') {
  const y = ridge(rand, { base, waves: [[10, 0.005], [4, 0.017]] });
  return p(cls, ridgeFill(y, -10, W + 10, H, 12));
}

/** A daisy-type flower (coneflower, cosmos): petals around a centre. */
function daisy(cx, cy, r, petals, rand) {
  let d = '';
  for (let i = 0; i < petals; i++) {
    const a = (i / petals) * Math.PI * 2 + rand() * 0.2;
    const px = cx + Math.cos(a) * r * 0.62;
    const py = cy + Math.sin(a) * r * 0.36;
    d += ellipse(px, py + r * 0.12, r * 0.46, r * 0.17);
  }
  return d;
}

/** A layered dahlia/peony-like bloom. */
function pompom(cx, cy, r) {
  return circle(cx, cy, r) + circle(cx, cy - r * 0.08, r * 0.7) + circle(cx, cy - r * 0.14, r * 0.42);
}

/** Leaf shape pointing in direction a (radians) from (x, y). */
function leaf(x, y, len, width, a) {
  const tx = x + Math.cos(a) * len;
  const ty = y + Math.sin(a) * len;
  const nx = -Math.sin(a) * width;
  const ny = Math.cos(a) * width;
  const mx = (x + tx) / 2;
  const my = (y + ty) / 2;
  return `M${r1(x)} ${r1(y)}Q${r1(mx + nx)} ${r1(my + ny)} ${r1(tx)} ${r1(ty)}Q${r1(mx - nx)} ${r1(my - ny)} ${r1(x)} ${r1(y)}Z`;
}

/* Scenes ------------------------------------------------------------------ */

const SCENES = {
  trees(rand) {
    let out = backdrop(rand) + ground(rand, 480);
    const spruce = [];
    const larch = [];
    [[150, 300, 0], [300, 380, 0], [470, 260, 1], [610, 340, 0], [720, 230, 0]].forEach(([x, h, gold]) => {
      (gold ? larch : spruce).push(conifer(rand, x + rand() * 30, 520 + rand() * 20, h, h * 0.42, 8));
    });
    out += p('spot-tree', spruce.join('')) + p('pano-larch pano-larch--near', larch.join(''));
    // a young deciduous tree
    out += fill('--s-wood', 'M396 540h8l-2-120h-4Z') + fill('--s-leaf', circle(400, 400, 54) + circle(368, 430, 40) + circle(432, 432, 42));
    return out;
  },

  shrubs(rand) {
    let out = backdrop(rand) + ground(rand, 460);
    const bushes = [[120, 520, 220, 150], [330, 540, 260, 190], [560, 520, 230, 160], [740, 540, 220, 150]];
    bushes.forEach(([x, y, w, h], i) => {
      out += fill(i % 2 ? '--s-leaf-dark' : '--s-leaf', shrub(x, y, w, h));
      let blooms = '';
      for (let k = 0; k < 14; k++) {
        const a = rand() * Math.PI;
        const rr = rand() * 0.42;
        blooms += circle(x + Math.cos(a) * w * rr, y - h * 0.45 - Math.sin(a) * h * 0.4, 9 + rand() * 9);
      }
      out += fill(i % 2 ? '--s-bloom-4' : '--s-bloom-1', blooms, ' opacity=".92"');
    });
    return out;
  },

  perennials(rand) {
    let out = backdrop(rand, { far: 300, near: 370 }) + ground(rand, 430);
    let stems = '';
    let leaves = '';
    const heads = [[], []];
    for (let i = 0; i < 16; i++) {
      const x = 40 + i * 48 + rand() * 20;
      const top = 260 + rand() * 120;
      stems += `M${r1(x)} 600Q${r1(x + (rand() - 0.5) * 30)} ${r1((600 + top) / 2)} ${r1(x)} ${r1(top)}`;
      leaves += leaf(x, 520 - rand() * 60, 60, 12, -Math.PI / 2 + (rand() - 0.5) * 1.6);
      heads[i % 2].push([x, top]);
    }
    out += `<path class="spot-stem" d="${stems}"/>` + fill('--s-leaf', leaves);
    heads.forEach((hs, k) => {
      let petals = '';
      let centres = '';
      hs.forEach(([x, y]) => {
        petals += daisy(x, y, 34, 12, rand);
        centres += circle(x, y - 4, 11);
      });
      out += fill(k ? '--s-bloom-2' : '--s-bloom-1', petals) + fill('--s-centre', centres);
    });
    return out;
  },

  grasses(rand) {
    let out = backdrop(rand, { far: 310, near: 380 }) + ground(rand, 440);
    let blades = '';
    let plumes = '';
    [[150, 1], [400, 1.25], [650, 1.05]].forEach(([cx, s]) => {
      for (let i = 0; i < 26; i++) {
        const a = -Math.PI / 2 + (i / 25 - 0.5) * 1.9;
        const len = (180 + rand() * 120) * s;
        const tx = cx + Math.cos(a) * len * 0.9;
        const ty = 590 + Math.sin(a) * len;
        blades += `M${cx} 590Q${r1(cx + Math.cos(a) * len * 0.3)} ${r1(590 + Math.sin(a) * len * 0.75)} ${r1(tx)} ${r1(ty)}`;
        if (i % 4 === 0) plumes += ellipse(tx, ty - 10, 6, 24);
      }
    });
    return out + `<path class="spot-blade" d="${blades}"/>` + fill('--s-bloom-3', plumes, ' opacity=".85"');
  },

  annuals(rand) {
    let out = backdrop(rand, { far: 280, near: 340 }) + ground(rand, 380, 'spot-bed');
    for (let row = 0; row < 4; row++) {
      const y = 430 + row * 52;
      const r = 14 + row * 5;
      let leaves = '';
      const blooms = [[], [], []];
      for (let x = -10 + (row % 2) * 30; x < W + 20; x += r * 3) {
        leaves += ellipse(x, y + r * 0.6, r * 1.5, r * 0.8);
        blooms[(((Math.floor(x / (r * 3)) + row) % 3) + 3) % 3].push(circle(x + (rand() - 0.5) * 8, y, r));
      }
      out += fill('--s-leaf-dark', leaves) + blooms.map((b, i) => fill(BLOOMS[[0, 4, 2][i]], b.join(''))).join('');
    }
    return out;
  },

  vegetables(rand) {
    let out = backdrop(rand) + ground(rand, 440);
    out += fill('--s-wood', 'M60 470h680v40H60Z') + fill('--s-soil', 'M70 478h660v26H70Z');
    let heads = '';
    for (let x = 100; x < 720; x += 70) {
      for (let k = 0; k < 6; k++) heads += leaf(x, 482, 46 + rand() * 18, 16, -Math.PI / 2 + (k - 2.5) * 0.42);
    }
    out += fill('--s-leaf', heads);
    out += fill('--s-wood', 'M120 600V330h6v270ZM680 600V330h6v270Z');
    let toms = '';
    for (let i = 0; i < 10; i++) toms += circle(150 + rand() * 520, 360 + rand() * 80, 11 + rand() * 6);
    return out + fill('--s-bloom-5', toms);
  },

  houseplants(rand) {
    let out = `<rect width="${W}" height="${H}" style="fill:var(--s-wall)"/>`;
    out += `<rect x="470" y="60" width="250" height="330" rx="10" class="spot-sky"/>` + fill('--s-wall-shade', 'M470 222h250v6H470ZM592 60h6v330h-6Z');
    out += fill('--s-shelf', 'M0 470h800v130H0Z');
    let leaves = '';
    for (let i = 0; i < 9; i++) {
      const a = -Math.PI / 2 + (i / 8 - 0.5) * 2.4;
      leaves += leaf(300, 380, 150 + rand() * 60, 52, a);
    }
    out += fill('--s-leaf-dark', leaves);
    out += fill('--s-pot', 'M230 380h140l-16 110h-108Z');
    let small = '';
    for (let i = 0; i < 7; i++) small += leaf(600, 420, 70 + rand() * 20, 16, -Math.PI / 2 + (i / 6 - 0.5) * 2);
    return out + fill('--s-leaf', small) + fill('--s-pot', 'M560 420h80l-8 60h-64Z');
  },

  'cut-flowers'(rand) {
    let out = backdrop(rand, { far: 300, near: 360 }) + ground(rand, 420);
    let stems = '';
    const heads = BLOOMS.map(() => []);
    for (let i = 0; i < 14; i++) {
      const x = 30 + i * 56 + rand() * 20;
      const top = 230 + rand() * 150;
      stems += `M${r1(x)} 600L${r1(x + (rand() - 0.5) * 20)} ${r1(top)}`;
      heads[i % 5].push(pompom(x, top, 30 + rand() * 12));
    }
    return out + `<path class="spot-stem" d="${stems}"/>` + heads.map((h, i) => fill(BLOOMS[i], h.join(''))).join('');
  },

  baskets(rand) {
    let out = `<rect width="${W}" height="${H}" class="spot-sky"/>` + fill('--s-wall', 'M0 0h800v90H0Z') + fill('--s-wood', 'M0 84h800v14H0Z');
    out += `<path class="spot-chain" d="M400 98L300 300M400 98L500 300M400 98V300"/>`;
    // trailing foliage
    let trails = '';
    for (let i = 0; i < 12; i++) {
      const x = 290 + i * 20;
      trails += `M${x} 330Q${r1(x + (rand() - 0.5) * 60)} ${r1(420 + rand() * 60)} ${r1(x + (rand() - 0.5) * 40)} ${r1(470 + rand() * 90)}`;
    }
    out += `<path class="spot-trail" d="${trails}"/>`;
    out += fill('--s-leaf-dark', ellipse(400, 300, 150, 70));
    const tone = Math.floor(rand() * 5);
    const bloom = [[], [], []];
    for (let i = 0; i < 34; i++) {
      const a = rand() * Math.PI * 2;
      const rr = Math.sqrt(rand());
      bloom[i % 3].push(circle(400 + Math.cos(a) * 140 * rr, 280 + Math.sin(a) * 60 * rr - 10, 12 + rand() * 9));
    }
    out += bloom.map((b, i) => fill(BLOOMS[(tone + i * 2) % 5], b.join(''))).join('');
    for (let i = 0; i < 9; i++) out += fill(BLOOMS[(tone + i) % 5], circle(300 + rand() * 200, 420 + rand() * 140, 9 + rand() * 6));
    return out + fill('--s-basket', 'M250 320Q400 420 550 320L530 360Q400 440 270 360Z');
  },

  'garden-shop'(rand) {
    let out = `<rect width="${W}" height="${H}" style="fill:var(--s-wall)"/>`;
    out += fill('--s-wood', 'M60 250h680v14H60ZM60 430h680v14H60Z') + fill('--s-shelf', 'M0 520h800v80H0Z');
    let pots = '';
    let leaves = '';
    for (let x = 90; x < 720; x += 110) {
      const s = 0.8 + rand() * 0.4;
      pots += `M${x} ${r1(250 - 70 * s)}h${r1(80 * s)}l${r1(-10 * s)} ${r1(70 * s)}h${r1(-60 * s)}Z`;
      for (let k = 0; k < 5; k++) leaves += leaf(x + 40 * s, 250 - 70 * s, 50 * s, 12 * s, -Math.PI / 2 + (k - 2) * 0.5);
    }
    out += fill('--s-leaf', leaves) + fill('--s-pot', pots);
    out += fill('--s-glacier', 'M150 430v-90h90v90ZM240 360c40 0 60-20 70-40l10 6c-12 26-36 46-80 46Z');
    out += fill('--s-pot', 'M420 430l10-110h120l10 110Z') + fill('--s-bloom-4', 'M600 430v-120h80v120Z');
    return out;
  },

  'landscape-supplies'(rand) {
    let out = backdrop(rand, { far: 300, near: 360 }) + ground(rand, 420, 'spot-gravel');
    const piles = [['--s-mulch', 170, 300], ['--s-rock', 420, 280], ['--s-soil', 650, 260]];
    piles.forEach(([v, x, w]) => {
      out += fill(v, `M${x - w / 2} 560Q${x - w / 4} ${360 + rand() * 30} ${x} 350Q${x + w / 4} ${360 + rand() * 30} ${x + w / 2} 560Z`);
      let dots = '';
      for (let i = 0; i < 40; i++) dots += circle(x + (rand() - 0.5) * w * 0.7, 400 + rand() * 150, 2 + rand() * 4);
      out += fill('--s-speck', dots, ' opacity=".35"');
    });
    // wheelbarrow
    return out + fill('--s-glacier', 'M500 520h150l-20 40h-110Z') + `<path class="spot-chain" d="M640 525l60-20M540 560l-10 30"/>` + fill('--s-tyre', circle(560, 580, 16));
  },

  'display-garden'(rand) {
    let out = backdrop(rand) + ground(rand, 440);
    out += fill('--s-path', 'M330 600C360 520 470 500 450 450S380 400 410 380L440 380C420 400 500 420 490 460S420 520 470 600Z');
    let beds = '';
    const blooms = [[], []];
    [[120, 520], [210, 470], [620, 520], [700, 470], [560, 450]].forEach(([x, y]) => {
      beds += shrub(x, y, 120 + rand() * 40, 70 + rand() * 30);
      for (let i = 0; i < 6; i++) blooms[i % 2].push(circle(x + (rand() - 0.5) * 90, y - 30 - rand() * 40, 7 + rand() * 6));
    });
    out += fill('--s-leaf', beds) + fill('--s-bloom-1', blooms[0].join('')) + fill('--s-bloom-3', blooms[1].join(''));
    out += p('spot-tree', conifer(rand, 90, 460, 260, 110, 8)) + p('pano-larch pano-larch--near', conifer(rand, 740, 450, 230, 96, 7));
    return out;
  },

  greenhouse(rand) {
    let out = backdrop(rand) + ground(rand, 440);
    const house = (x, y, w, h) => {
      const k = h * 0.6;
      let ribs = '';
      for (let rx = x + 30; rx < x + w - 20; rx += 30) ribs += `M${rx} ${y - h + 4}V${y}`;
      return (
        `<path class="pano-gh" d="M${x} ${y}V${y - h + k}C${x} ${y - h} ${x} ${y - h} ${x + k} ${y - h}H${x + w - k}C${x + w} ${y - h} ${x + w} ${y - h} ${x + w} ${y - h + k}V${y}Z"/>` +
        `<path class="pano-gh-wall" d="M${x} ${y - h * 0.22}H${x + w}V${y}H${x}Z"/><path class="pano-gh-ribs" d="${ribs}"/>`
      );
    };
    out += house(60, 470, 320, 120) + house(430, 480, 330, 130);
    let rows = '';
    for (let x = 20; x < 800; x += 46) rows += shrub(x, 560, 34, 26);
    return out + fill('--s-leaf-dark', rows);
  },

  family(rand) {
    // The grounds at golden hour (we do not draw people).
    return SCENES.greenhouse(rand) + `<ellipse cx="640" cy="200" rx="70" ry="70" class="spot-sun-disc"/>`;
  },
};

/* Bulk material swatches ----------------------------------------------------- */

function texture(rand, base, speck, shape) {
  let out = `<rect width="${W}" height="${H}" style="fill:var(${base})"/>`;
  const layers = [[], [], []];
  for (let i = 0; i < 220; i++) layers[i % 3].push(shape(rand() * W, rand() * H, rand));
  return out + layers.map((l, i) => fill(speck[i], l.join(''))).join('');
}

const SWATCHES = {
  'bulk-rock': (rand) => texture(rand, '--s-rock', ['--s-rock-1', '--s-rock-2', '--s-rock-3'], (x, y, rd) => ellipse(x, y, 16 + rd() * 22, 12 + rd() * 16)),
  'bulk-mulch': (rand) =>
    texture(rand, '--s-mulch', ['--s-mulch-1', '--s-mulch-2', '--s-mulch-3'], (x, y, rd) => leaf(x, y, 30 + rd() * 40, 4 + rd() * 4, rd() * Math.PI)),
  'bulk-soil': (rand) => texture(rand, '--s-soil', ['--s-soil-1', '--s-soil-2', '--s-soil-3'], (x, y, rd) => circle(x, y, 3 + rd() * 7)),
  'bulk-sand': (rand) => texture(rand, '--s-sand', ['--s-sand-1', '--s-sand-2', '--s-sand-3'], (x, y, rd) => circle(x, y, 1.5 + rd() * 3)),
  'bulk-compost': (rand) =>
    texture(rand, '--s-compost', ['--s-soil-1', '--s-mulch-1', '--s-compost-1'], (x, y, rd) => (rd() < 0.5 ? circle(x, y, 3 + rd() * 6) : leaf(x, y, 14 + rd() * 16, 3, rd() * Math.PI))),
};

/* Each kind has a few variants. A page renders each variant once, as a <g>
   in a hidden <defs> block, and every frame points at it with <use>, so a
   grid of 150 plants costs a dozen drawings, not 150. */
const VARIANTS = 2;
const cache = new Map();
const used = new Set();

function drawing(key, kind, variant) {
  if (!cache.has(key)) {
    const rand = rng((variant + 1) * 7919 + kind.length * 131);
    const draw = SCENES[kind] || SWATCHES[kind] || SCENES.trees;
    cache.set(key, `<g id="${key}">${draw(rand)}</g>`);
  }
  return cache.get(key);
}

/** Spot illustration markup for `kind` (a reference to a shared drawing). */
export function spot(kind = 'trees', { seed = 1 } = {}) {
  const k = SCENES[kind] || SWATCHES[kind] ? kind : 'trees';
  const variant = Math.abs(Math.round(seed)) % VARIANTS;
  const key = `spot-${k}-${variant}`;
  drawing(key, k, variant);
  used.add(key);
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" class="spot spot--${k}"><use href="#${key}"/></svg>`;
}

/** Hidden <defs> for every drawing used since the last call (one page). */
export function takeSpotDefs() {
  if (!used.size) return '';
  const defs = [...used].map((key) => cache.get(key)).join('');
  used.clear();
  const sun = '<radialGradient id="spot-sun-g"><stop offset="0" style="stop-color:var(--sun)"/><stop offset="1" style="stop-color:var(--sun);stop-opacity:0"/></radialGradient>';
  return `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>${sun}${defs}</defs></svg>`;
}
