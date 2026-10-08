/**
 * Geometry helpers for the generated landscape art: a seeded RNG and path
 * builders for conifers, shrubs and ridgelines. Everything is deterministic
 * so each build produces byte-identical SVG.
 */

/** Mulberry32: small, fast, seedable PRNG returning floats in [0, 1). */
export function rng(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Round to whole units for compact path data (viewBoxes are large enough). */
export const r1 = (n) => Math.round(n);

/** Join [x, y] points into an SVG path "M…L…" segment string. */
export function polyline(points, close = false) {
  const d = points.map(([x, y], i) => `${i ? 'L' : 'M'}${r1(x)} ${r1(y)}`).join('');
  return close ? `${d}Z` : d;
}

/**
 * A spruce/fir silhouette standing on (x, baseY): a narrow spire with
 * stepped tiers of branches, slightly irregular so a forest never looks
 * stamped. `lean` skews the tip a touch for life.
 */
export function conifer(rand, x, baseY, h, w, tiers = 5, lean = 0) {
  const top = baseY - h;
  const skirt = baseY - h * 0.09; // where the lowest branches end
  const span = skirt - top;
  const droop = (span / tiers) * 0.22;
  const side = (dir) => {
    const pts = [];
    for (let i = 1; i <= tiers; i++) {
      const t = i / tiers;
      const cx = x + lean * (1 - t); // the spire leans, the trunk does not
      const y = top + span * t;
      const reach = (w / 2) * (0.22 + 0.78 * t) * (0.86 + rand() * 0.28);
      pts.push([cx + dir * reach, y]);
      if (i < tiers) pts.push([cx + dir * reach * (0.5 + rand() * 0.14), y + droop]);
    }
    return pts;
  };
  const trunk = Math.max(0.7, w * 0.06);
  const right = side(1);
  const left = side(-1).reverse();
  const pts = [
    [x + lean, top],
    ...right,
    [x + trunk, skirt],
    [x + trunk, baseY],
    [x - trunk, baseY],
    [x - trunk, skirt],
    ...left,
  ];
  return polyline(pts, true);
}

/** A columnar arborvitae-style tree: a soft, tall rounded spire. */
export function column(x, baseY, h, w) {
  const top = baseY - h;
  return (
    `M${r1(x)} ${r1(top)}` +
    `C${r1(x + w * 0.62)} ${r1(top + h * 0.18)} ${r1(x + w * 0.58)} ${r1(baseY - h * 0.2)} ${r1(x + w * 0.32)} ${r1(baseY)}` +
    `L${r1(x - w * 0.32)} ${r1(baseY)}` +
    `C${r1(x - w * 0.58)} ${r1(baseY - h * 0.2)} ${r1(x - w * 0.62)} ${r1(top + h * 0.18)} ${r1(x)} ${r1(top)}Z`
  );
}

/** A rounded shrub (balled-and-burlapped look) sitting on baseY. */
export function shrub(x, baseY, w, h) {
  const rx = w / 2;
  return (
    `M${r1(x - rx)} ${r1(baseY)}` +
    `C${r1(x - rx * 1.05)} ${r1(baseY - h * 0.9)} ${r1(x - rx * 0.4)} ${r1(baseY - h * 1.08)} ${r1(x)} ${r1(baseY - h)}` +
    `C${r1(x + rx * 0.45)} ${r1(baseY - h * 1.1)} ${r1(x + rx * 1.05)} ${r1(baseY - h * 0.85)} ${r1(x + rx)} ${r1(baseY)}Z`
  );
}

/**
 * A smooth ridgeline: summed sines with seeded phases plus fine jitter.
 * Returns a function y(x).
 */
export function ridge(rand, { base, waves }) {
  const phases = waves.map(() => rand() * Math.PI * 2);
  return (x) => waves.reduce((y, [amp, freq], i) => y + amp * Math.sin(x * freq + phases[i]), base);
}

/** Closed polygon from a y(x) function down to `floor`, across [x0, x1]. */
export function ridgeFill(fy, x0, x1, floor, step = 8) {
  const pts = [];
  for (let x = x0; x <= x1; x += step) pts.push([x, fy(x)]);
  pts.push([x1, fy(x1)], [x1, floor], [x0, floor]);
  return polyline(pts, true);
}
