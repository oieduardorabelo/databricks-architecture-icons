#!/usr/bin/env node
/**
 * Builds every artifact in Databricks Architecture Icons from the official SVGs in sources/.
 *
 *   node tools/build.mjs
 *
 * Outputs: svg/ svg-mono/ svg-tile/ png/ png-tile/ logos/ iconify/
 *          catalog.json catalog.csv CATALOG.md index.html
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PRODUCTS, CATEGORIES, LOGOS, BRAND, PROJECT } from './products.mjs';
import { createZip } from './zip.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCES = path.join(ROOT, 'sources');
const CANVAS = 48;
const PAD = 2;
const PNG_SIZE = 256;

let sharp = null;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.warn('! sharp not installed - the PNG files will not be rebuilt. Run `npm install` in tools/ to enable.');
}

const out = (...p) => path.join(ROOT, ...p);

// Rendering a PNG needs sharp. Serving one does not: the rendered files are
// committed to the repository. So the catalog, the page and the archives key
// off whether the PNG files exist, not off whether this machine can rebuild
// them. Without this split, a build on a machine with no sharp silently strips
// every PNG reference from the site while the files sit untouched in png/.
const hasPng = () =>
  sharp ||
  PRODUCTS.every(
    (p) =>
      fs.existsSync(path.join(ROOT, 'png', `${p.slug}.png`)) &&
      fs.existsSync(path.join(ROOT, 'png-tile', `${p.slug}.png`)),
  );
const PNG_AVAILABLE = hasPng();
const fresh = (dir) => {
  fs.rmSync(out(dir), { recursive: true, force: true });
  fs.mkdirSync(out(dir), { recursive: true });
};

// ---------------------------------------------------------------- svg helpers

/** Pull the viewBox and inner markup out of a source SVG. */
function parse(svg) {
  const openTag = svg.match(/<svg[^>]*>/i);
  if (!openTag) throw new Error('no <svg> element');
  const attrs = openTag[0];

  let vb = attrs.match(/viewBox\s*=\s*"([^"]+)"/i)?.[1];
  if (vb) {
    vb = vb.trim().split(/[\s,]+/).map(Number);
  } else {
    const w = parseFloat(attrs.match(/\bwidth\s*=\s*"([\d.]+)/i)?.[1] ?? '0');
    const h = parseFloat(attrs.match(/\bheight\s*=\s*"([\d.]+)/i)?.[1] ?? '0');
    if (!w || !h) throw new Error('no viewBox and no usable width/height');
    vb = [0, 0, w, h];
  }
  if (vb.length !== 4 || vb.some((n) => !Number.isFinite(n))) throw new Error(`bad viewBox: ${vb}`);

  const body = svg
    .slice(svg.indexOf(openTag[0]) + openTag[0].length, svg.lastIndexOf('</svg>'))
    .trim();

  return { vb, body };
}

/**
 * Rewrite every id / url(#id) / class so two icons can safely coexist in one
 * document (Mermaid inlines icon bodies; index.html would otherwise leak
 * gradients and clip paths between tiles).
 */
function namespaceIds(body, prefix) {
  const ids = new Set();
  for (const m of body.matchAll(/\sid\s*=\s*"([^"]+)"/g)) ids.add(m[1]);
  for (const m of body.matchAll(/\.([A-Za-z_][\w-]*)\s*\{/g)) ids.add(m[1]);
  let outBody = body;
  for (const id of ids) {
    const esc = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    outBody = outBody
      .replace(new RegExp(`(\\sid\\s*=\\s*")${esc}(")`, 'g'), `$1${prefix}-${id}$2`)
      .replace(new RegExp(`url\\(#${esc}\\)`, 'g'), `url(#${prefix}-${id})`)
      .replace(new RegExp(`(xlink:href\\s*=\\s*")#${esc}(")`, 'g'), `$1#${prefix}-${id}$2`)
      .replace(new RegExp(`(\\shref\\s*=\\s*")#${esc}(")`, 'g'), `$1#${prefix}-${id}$2`)
      .replace(new RegExp(`\\.${esc}(\\s*[,{])`, 'g'), `.${prefix}-${id}$1`)
      .replace(new RegExp(`(class\\s*=\\s*")${esc}(")`, 'g'), `$1${prefix}-${id}$2`);
  }
  return outBody;
}

// Databricks product icons are duotone: a Lava foreground (#FF5F46 / #FF3621)
// over a light Lava tint (#FABFBA), occasionally on a white plate. Recolouring
// has to keep those three roles apart or the tint and the plate merge into the
// foreground and the mark turns into a blob.
const WHITEISH = /^(#fff(?:fff)?|#fefefe|white)$/i;

function luminance(colour) {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(colour.trim());
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Run a rewrite over drawable markup only. Shapes inside <clipPath>, <mask>
 * and friends are geometry or alpha channels, not artwork - recolouring or
 * removing them silently clips the whole icon away.
 */
const PROTECTED = /<(defs|clipPath|mask|pattern|filter|linearGradient|radialGradient|symbol)\b[\s\S]*?<\/\1\s*>/gi;
function outsideDefs(body, fn) {
  let cursor = 0;
  let result = '';
  for (const m of body.matchAll(PROTECTED)) {
    result += fn(body.slice(cursor, m.index)) + m[0];
    cursor = m.index + m[0].length;
  }
  return result + fn(body.slice(cursor));
}

/** 'skip' | 'plate' (white background) | 'tint' (light secondary) | 'fg' */
function role(colour) {
  if (!colour) return 'skip';
  const c = colour.trim();
  if (!c || c === 'none' || c === 'currentColor' || c.startsWith('url(')) return 'skip';
  if (WHITEISH.test(c)) return 'plate';
  const l = luminance(c);
  return l !== null && l > 0.7 ? 'tint' : 'fg';
}

/**
 * Recolour a body for a target surface.
 *   mode 'mono' -> foreground becomes currentColor, tint becomes a faded
 *                  currentColor, white plates drop out entirely.
 *   mode 'tile' -> foreground becomes white, tint becomes faded white, white
 *                  plates become the tile colour so knock-outs still read.
 */
function recolour(body, mode, tileColour) {
  const map = {
    mono: { plate: 'none', tint: 'currentColor', fg: 'currentColor' },
    tile: { plate: tileColour, tint: '#FFFFFF', fg: '#FFFFFF' },
  }[mode];

  return outsideDefs(body, (chunk) => chunk.replace(/<([a-zA-Z][\w:.-]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)(\/?)>/g, (tag, el, attrs, close) => {
    if (el === 'style') return tag;
    let sawTint = false;
    let next = attrs;

    for (const prop of ['fill', 'stroke']) {
      next = next.replace(new RegExp(`(\\s${prop}\\s*=\\s*")([^"]*)(")`, 'i'), (_m, a, val, c) => {
        const r = role(val);
        if (r === 'skip') return a + val + c;
        if (r === 'tint') sawTint = true;
        return a + map[r] + c;
      });
    }
    next = next.replace(/(\s(?:style)\s*=\s*")([^"]*)(")/i, (_m, a, css, c) => {
      const patched = css.replace(/\b(fill|stroke)\s*:\s*([^;]+)/gi, (mm, prop, val) => {
        const r = role(val);
        if (r === 'skip') return mm;
        if (r === 'tint') sawTint = true;
        return `${prop}:${map[r]}`;
      });
      return a + patched + c;
    });

    if (sawTint && !/\sopacity\s*=/.test(next)) next += ' opacity="0.45"';
    return `<${el}${next}${close}>`;
  }));
}

/**
 * Drop a full-bleed white background plate. A handful of Databricks product
 * icons ship on a white rounded square, which reads as an opaque box on any
 * dark diagram background. Only shapes covering >=92% of the canvas go.
 */
function stripPlate(body, vb) {
  const [vx, vy, vw, vh] = vb;
  return outsideDefs(body, (chunk) => chunk.replace(/<(path|rect)((?:"[^"]*"|'[^']*'|[^>"'])*?)\/?>/g, (tag, el, attrs) => {
    const fill = /\sfill\s*=\s*"([^"]*)"/i.exec(attrs)?.[1];
    if (!fill || !WHITEISH.test(fill.trim())) return tag;

    let box;
    if (el === 'rect') {
      const num = (n) => parseFloat(new RegExp(`\\s${n}\\s*=\\s*"([-\\d.]+)`).exec(attrs)?.[1] ?? 'NaN');
      box = [num('x') || 0, num('y') || 0, num('width'), num('height')];
    } else {
      const d = /\sd\s*=\s*"([^"]*)"/i.exec(attrs)?.[1];
      if (!d) return tag;
      const nums = (d.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi) || []).map(Number);
      if (nums.length < 4) return tag;
      const xs = nums.filter((_, i) => i % 2 === 0);
      const ys = nums.filter((_, i) => i % 2 === 1);
      const [x0, x1] = [Math.min(...xs), Math.max(...xs)];
      const [y0, y1] = [Math.min(...ys), Math.max(...ys)];
      box = [x0, y0, x1 - x0, y1 - y0];
    }
    if (!Number.isFinite(box[2]) || !Number.isFinite(box[3])) return tag;
    const coverage = (box[2] * box[3]) / (vw * vh);
    const aligned = Math.abs(box[0] - vx) < vw * 0.05 && Math.abs(box[1] - vy) < vh * 0.05;
    return coverage >= 0.92 && aligned ? '' : tag;
  }));
}

/** Fit the source viewBox into a padded 48x48 square. */
function fitTransform(vb) {
  const [vx, vy, vw, vh] = vb;
  const scale = (CANVAS - PAD * 2) / Math.max(vw, vh);
  const tx = (CANVAS - vw * scale) / 2 - vx * scale;
  const ty = (CANVAS - vh * scale) / 2 - vy * scale;
  return `translate(${round(tx)} ${round(ty)}) scale(${round(scale)})`;
}

const round = (n) => Number(n.toFixed(4));

/**
 * WCAG relative luminance, used to prove the white glyph on each category tile
 * clears SC 1.4.11 (3:1 for non-text content). The brand guidelines are
 * explicit about this: "Readability is important. Please follow accessibility
 * standards for contrast."
 */
function relativeLuminance(hex) {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4]
    .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const contrastWithWhite = (hex) => 1.05 / (relativeLuminance(hex) + 0.05);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function wrap(inner, { title, extra = '' } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${CANVAS}" height="${CANVAS}" viewBox="0 0 ${CANVAS} ${CANVAS}" fill="none" role="img" aria-label="${esc(title)}">
<title>${esc(title)}</title>${extra}
${inner}
</svg>
`;
}

// -------------------------------------------------------------------- build

fresh('svg');
fresh('svg-mono');
fresh('svg-tile');
fresh('logos');
fresh('iconify');
if (sharp) {
  fresh('png');
  fresh('png-tile');
}

// sources/MANIFEST.md records the URL each file came from. Parsing it here
// puts that provenance in catalog.json too, so a consumer can verify any icon
// against the Databricks page it was published on without reading a Markdown
// table by hand.
const SOURCE_URLS = Object.fromEntries(
  [...fs.readFileSync(path.join(SOURCES, 'MANIFEST.md'), 'utf8').matchAll(/^\|\s*`([^`]+)`\s*\|\s*(\S+)\s*\|/gm)]
    .map((m) => [m[1], m[2]]),
);

const pngJobs = [];
const catalog = [];
const iconifyIcons = {};
const iconifyColorIcons = {};
const problems = [];

for (const [key, c] of Object.entries(CATEGORIES)) {
  const ratio = contrastWithWhite(c.color);
  c.contrast = Number(ratio.toFixed(2));
  if (ratio < 3) problems.push(`category ${key}: white on ${c.color} is ${ratio.toFixed(2)}:1, below the 3:1 floor`);
}

for (const p of PRODUCTS) {
  const srcPath = path.join(SOURCES, `${p.src}.svg`);
  if (!fs.existsSync(srcPath)) {
    problems.push(`${p.slug}: missing source ${p.src}.svg`);
    continue;
  }

  const cat = CATEGORIES[p.category];
  let vb, rawBody;
  try {
    ({ vb, body: rawBody } = parse(fs.readFileSync(srcPath, 'utf8')));
  } catch (err) {
    problems.push(`${p.slug}: ${err.message}`);
    continue;
  }

  const isLogo = p.kind === 'logo';
  const body = stripPlate(namespaceIds(rawBody, p.slug), vb);
  const transform = fitTransform(vb);

  // 1. colour variant - the artwork Databricks publishes, fitted to the canvas
  const colourSvg = wrap(`<g transform="${transform}">${body}</g>`, { title: p.name });
  fs.writeFileSync(out('svg', `${p.slug}.svg`), colourSvg);

  // 2. mono variant - inherits currentColor, for theming in CSS / Mermaid / Lucid
  const monoBody = isLogo ? body : recolour(body, 'mono');
  const monoSvg = wrap(`<g transform="${transform}">${monoBody}</g>`, { title: p.name });
  fs.writeFileSync(out('svg-mono', `${p.slug}.svg`), monoSvg);

  // 3. tile variant - white glyph on a category-coloured rounded square
  const tileBg = isLogo ? BRAND.white : cat.color;
  const glyph = isLogo
    ? `<g transform="${transform}">${body}</g>`
    : `<g transform="${transform}">${recolour(body, 'tile', tileBg)}</g>`;
  const tileSvg = wrap(
    `<rect width="${CANVAS}" height="${CANVAS}" rx="10" fill="${tileBg}"/>
<g transform="translate(${CANVAS / 2} ${CANVAS / 2}) scale(0.82) translate(${-CANVAS / 2} ${-CANVAS / 2})">${glyph}</g>`,
    { title: `${p.name} (tile)` },
  );
  fs.writeFileSync(out('svg-tile', `${p.slug}.svg`), tileSvg);

  // 4. Iconify / Mermaid pack entry (mono, so Mermaid can colour it)
  // Two packs from the same geometry. The mono pack inherits currentColor, so
  // Mermaid paints it with the text color of the diagram. The color pack keeps
  // the Databricks artwork, so the icons stay Lava in any theme.
  // fill="none" on the group is load-bearing. Each source <svg> carries that
  // attribute on its root, and shapes that draw with a stroke only rely on it.
  // Mermaid inlines this body into its own <svg>, which has no such default, so
  // without it those shapes fall back to fill:black and the icon turns solid.
  iconifyIcons[p.slug] = { body: `<g fill="none" transform="${transform}">${monoBody}</g>` };
  iconifyColorIcons[p.slug] = { body: `<g fill="none" transform="${transform}">${body}</g>` };

  if (sharp) {
    pngJobs.push(
      sharp(Buffer.from(colourSvg), { density: 384 })
        .resize(PNG_SIZE, PNG_SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toFile(out('png', `${p.slug}.png`)),
      sharp(Buffer.from(tileSvg), { density: 384 })
        .resize(PNG_SIZE, PNG_SIZE)
        .png()
        .toFile(out('png-tile', `${p.slug}.png`)),
    );
  }

  if (!SOURCE_URLS[`${p.src}.svg`]) problems.push(`${p.slug}: ${p.src}.svg is not in sources/MANIFEST.md`);

  const files = {
    svg: `svg/${p.slug}.svg`,
    svgMono: `svg-mono/${p.slug}.svg`,
    svgTile: `svg-tile/${p.slug}.svg`,
    ...(PNG_AVAILABLE ? { png: `png/${p.slug}.png`, pngTile: `png-tile/${p.slug}.png` } : {}),
  };

  catalog.push({
    slug: p.slug,
    name: p.name,
    aka: p.aka ?? null,
    description: p.desc,
    category: p.category,
    categoryLabel: cat.label,
    categoryColor: cat.color,
    docs: p.docs,
    kind: p.kind,
    source: `sources/${p.src}.svg`,
    sourceUrl: SOURCE_URLS[`${p.src}.svg`] ?? null,
    sourceRawUrl: `${PROJECT.url}sources/${p.src}.svg`,
    // Relative paths work in a clone; the absolute ones are ready to paste
    // into a document, a board or an <img> tag.
    files,
    urls: Object.fromEntries(Object.entries(files).map(([k, v]) => [k, PROJECT.url + v])),
  });
}

// full-colour brand lockups, copied through untouched
for (const l of LOGOS) {
  const srcPath = path.join(SOURCES, `${l.src}.svg`);
  if (!fs.existsSync(srcPath)) {
    problems.push(`logo ${l.slug}: missing source ${l.src}.svg`);
    continue;
  }
  fs.copyFileSync(srcPath, out('logos', `${l.slug}.svg`));
}

// ------------------------------------------------------------------ catalog

const byCategory = Object.entries(CATEGORIES).map(([key, c]) => ({
  key,
  ...c,
  products: catalog.filter((p) => p.category === key),
}));

fs.writeFileSync(
  out('catalog.json'),
  JSON.stringify(
    {
      name: PROJECT.name,
      tagline: PROJECT.tagline,
      official: false,
      url: PROJECT.url,
      repository: PROJECT.repository,
      generated: process.env.SOURCE_DATE ?? null,
      canvas: `${CANVAS}x${CANVAS}`,
      pngSize: PNG_SIZE,
      artworkSource: 'Official Databricks SVGs (databricks.com and @databricks/design-system)',
      categories: CATEGORIES,
      brand: BRAND,
      count: catalog.length,
      products: catalog,
    },
    null,
    2,
  ) + '\n',
);

const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
fs.writeFileSync(
  out('catalog.csv'),
  [
    ['slug','name','aka','description','category','category_color','svg','png','svg_url','png_url','docs','source_url'].join(','),
    ...catalog.map((p) =>
      [p.slug, p.name, p.aka, p.description, p.categoryLabel, p.categoryColor, p.files.svg, p.files.png ?? '',
       p.urls.svg, p.urls.png ?? '', p.docs, p.sourceUrl ?? '']
        .map(csvCell)
        .join(','),
    ),
  ].join('\n') + '\n',
);

const md = [
  '# Databricks product catalog',
  '',
  `${catalog.length} products across ${byCategory.filter((c) => c.products.length).length} categories.`,
  'Every icon is official Databricks artwork - see [README.md](README.md) for provenance.',
  '',
];
for (const c of byCategory) {
  if (!c.products.length) continue;
  md.push(`## ${c.label}  <sub>\`${c.color}\`</sub>`, '');
  md.push('| | Product | Description |', '|---|---|---|');
  for (const p of c.products) {
    const aka = p.aka ? `<br><sub>${p.aka}</sub>` : '';
    md.push(
      `| <img src="${p.files.svg}" width="28" height="28" alt=""> | **[${p.name}](${p.docs})**<br><code>${p.slug}</code>${aka} | ${p.description} |`,
    );
  }
  md.push('');
}
fs.writeFileSync(out('CATALOG.md'), md.join('\n'));

// ------------------------------------------------------- iconify pack (mermaid)

const makePack = (prefix, name, icons) => ({
  prefix,
  info: {
    name,
    author: { name: 'Databricks (artwork)', url: 'https://www.databricks.com/' },
    license: { title: 'Databricks artwork - see README.md' },
    total: Object.keys(icons).length,
  },
  width: CANVAS,
  height: CANVAS,
  icons,
});

const iconPack = makePack('databricks', 'Databricks Products (mono)', iconifyIcons);
const colorPack = makePack('databricks-color', 'Databricks Products (color)', iconifyColorIcons);

fs.writeFileSync(out('iconify', 'databricks.json'), JSON.stringify(iconPack, null, 2) + '\n');
fs.writeFileSync(out('iconify', 'databricks-color.json'), JSON.stringify(colorPack, null, 2) + '\n');

// The same pack as a classic script that assigns a global. A browser blocks
// fetch() of a file:// URL, so a page opened by a double-click cannot read the
// JSON file and Mermaid then draws a "?" for every icon. A classic <script src>
// has no such restriction. Load this file to make a page work from disk and
// from a server.
fs.writeFileSync(
  out('iconify', 'databricks.js'),
  `/* Databricks Architecture Icons - Iconify packs for Mermaid.
   Use this file when the page must also work from file://, where fetch() is
   blocked. It sets two globals and adds no dependency.

     databricksColorIconPack  the Databricks artwork, Lava colors
     databricksIconPack       one color, inherits currentColor

     <script src="iconify/databricks.js"></script>
     mermaid.registerIconPacks([
       { name: 'databricks-color', icons: window.databricksColorIconPack },
       { name: 'databricks', icons: window.databricksIconPack },
     ]);

   Then write databricks-color:lakeflow for the Lava artwork, or
   databricks:lakeflow for an icon that takes the color of the diagram.
*/
window.databricksColorIconPack = ${JSON.stringify(colorPack)};
window.databricksIconPack = ${JSON.stringify(iconPack)};
`,
);

// ------------------------------------------------------------------------ zips

// PNGs are written asynchronously; the archives read them back off disk, so
// they have to be on disk first.
if (sharp) {
  await Promise.all(pngJobs);
  pngJobs.length = 0;
}

fresh('zips');

const ZIP_PREFIX = 'databricks-architecture-icons';
const VARIANT_HINTS = {
  svg: 'Official colour artwork',
  'svg-mono': 'currentColor, themeable',
  'svg-tile': 'White glyph on a category tile',
  png: `${PNG_SIZE}px transparent`,
  'png-tile': `${PNG_SIZE}px tiles`,
  logos: 'Full-colour brand lockups',
};
const VARIANT_DIRS = ['svg', 'svg-mono', 'svg-tile', ...(PNG_AVAILABLE ? ['png', 'png-tile'] : []), 'logos'];

const readDir = (dir) =>
  fs
    .readdirSync(out(dir))
    .sort()
    .map((f) => ({ name: `${dir}/${f}`, data: fs.readFileSync(out(dir, f)) }));

const downloads = [];
function addZip(group, id, label, hint, entries) {
  const file = `zips/${ZIP_PREFIX}-${id}.zip`;
  const buf = createZip(entries);
  fs.writeFileSync(out(file), buf);
  downloads.push({ group, id, label, hint, file, count: entries.length, bytes: buf.length });
  return file;
}

const fmtBytes = (n) => (n < 1024 * 1024 ? `${Math.round(n / 1024)} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`);

for (const dir of VARIANT_DIRS) {
  addZip('variant', dir, `${dir}/`, VARIANT_HINTS[dir], readDir(dir));
}

addZip('all', 'all', 'Everything', 'Every variant plus the catalog', [
  ...VARIANT_DIRS.flatMap(readDir),
  ...readDir('iconify'),
  ...['catalog.json', 'catalog.csv', 'CATALOG.md', 'README.md']
    .filter((f) => fs.existsSync(out(f)))
    .map((f) => ({ name: f, data: fs.readFileSync(out(f)) })),
]);

// One archive per category, holding every variant of that category's products,
// so "give me just the AI icons" is a single click.
const categoryZips = {};
for (const c of byCategory) {
  if (!c.products.length) continue;
  const entries = c.products.flatMap((p) =>
    Object.values(p.files).map((rel) => ({ name: rel, data: fs.readFileSync(out(rel)) })),
  );
  categoryZips[c.key] = addZip(
    'category',
    `category-${c.key}`,
    c.label,
    `${c.products.length} products, every variant`,
    entries,
  );
}

// ------------------------------------------------------------------- index.html

// Order matters: this is the order the download links appear on every card.
const VARIANT_LABELS = [
  ['svg', 'SVG'],
  ['svgMono', 'Mono'],
  ['svgTile', 'Tile'],
  ['png', 'PNG'],
  ['pngTile', 'PNG tile'],
];

// The grid shows the PNG renders, so a thumbnail matches what most people drop
// into a slide or a board. If sharp was not installed there is no PNG, and the
// SVG stands in.
const thumb = (p) => ({
  flat: p.files.png ?? p.files.svg,
  tile: p.files.pngTile ?? p.files.svgTile,
});

const fileLinks = (p) =>
  [
    ...VARIANT_LABELS.filter(([key]) => p.files[key]).map(
      ([key, label]) => `<a href="${p.files[key]}" target="_blank" rel="noreferrer">${label}</a>`,
    ),
    `<a href="${p.source}" target="_blank" rel="noreferrer" class="src" title="Built from ${esc(p.sourceUrl ?? p.source)}">Source</a>`,
    `<a href="${p.docs}" target="_blank" rel="noreferrer" class="docs">Docs &nearr;</a>`,
  ].join('');

const cards = byCategory
  .filter((c) => c.products.length)
  .map(
    (c) => `
    <section class="cat" data-cat="${c.key}">
      <h2><span class="dot" style="background:${c.color}"></span>${c.label}
        <span class="hex">${c.color}</span>
        <span class="count">${c.products.length}</span>
        <a class="zip" href="${categoryZips[c.key]}" download title="Every variant of the ${esc(c.label)} icons">ZIP</a>
      </h2>
      <div class="grid">
        ${c.products
          .map(
            (p) => `<figure class="card" data-name="${esc((p.name + ' ' + p.slug + ' ' + (p.aka ?? '') + ' ' + p.description).toLowerCase())}" data-slug="${p.slug}">
          <div class="art"><img src="${thumb(p).flat}" alt="${esc(p.name)}" width="${CANVAS}" height="${CANVAS}" loading="lazy" decoding="async"><img class="tile" src="${thumb(p).tile}" alt="" width="${CANVAS}" height="${CANVAS}" loading="lazy" decoding="async"></div>
          <figcaption>
            <strong>${esc(p.name)}</strong>
            <code>${p.slug}</code>
            <p>${esc(p.description)}</p>
            ${p.aka ? `<p class="aka">${esc(p.aka)}</p>` : ''}
            <nav class="files">${fileLinks(p)}</nav>
          </figcaption>
        </figure>`,
          )
          .join('\n        ')}
      </div>
    </section>`,
  )
  .join('\n');

fs.writeFileSync(
  out('index.html'),
  `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${PROJECT.name}</title>
<meta name="description" content="${esc(PROJECT.tagline)} Build architecture diagrams for ${catalog.length} Databricks products. SVG files and PNG files for any diagram tool, and an Iconify pack for Mermaid. An unofficial community resource.">
<meta property="og:title" content="${PROJECT.name}">
<meta property="og:description" content="${esc(PROJECT.tagline)} ${catalog.length} products, official Databricks artwork.">
<meta property="og:image" content="${PROJECT.url}preview.png">
<meta property="og:url" content="${PROJECT.url}">
<link rel="canonical" href="${PROJECT.url}">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<!-- Neutral favicon: a Lava 600 tile. The Databricks mark is deliberately not
     used as this site's icon, to avoid implying an official association. -->
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='10' fill='%23FF3621'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
<style>
  /* Palette and type follow the published Databricks brand guidelines:
     primary colours Lava 600 / Navy 800 / Oat / White, extended greys for
     text and rules, DM Sans as the primary typeface and DM Mono for code.
     Sizes sit on an 8px scale (4 or 2 below 20px), body line-height 150%,
     headlines 120%, as the type guidance asks. */
  :root{
    --lava:${BRAND.lava}; --navy800:${BRAND.navy800}; --navy900:${BRAND.navy900};
    --navy700:${BRAND.navy700}; --oat-light:${BRAND.oatLight}; --oat-medium:${BRAND.oatMedium};
    --gray-text:${BRAND.grayText}; --gray-lines:${BRAND.grayLines};
    --bg:var(--oat-light); --fg:var(--navy800); --card:${BRAND.white};
    --line:var(--gray-lines); --muted:var(--gray-text);
  }
  [data-theme=dark]{
    --bg:var(--navy900); --fg:var(--oat-light); --card:var(--navy800);
    --line:var(--navy700); --muted:#90A5B1;
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--fg);
       font:16px/1.5 "DM Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
       -webkit-font-smoothing:antialiased}
  .wrap{max-width:1440px;margin:0 auto;padding:0 32px}
  a{color:var(--lava)}

  /* Navy is a primary large-area background in the guidelines; Lava is the pop. */
  .topbar{background:var(--lava);color:#fff;padding:8px 0;font-size:14px;line-height:1.5}
  .topbar .wrap{display:flex;align-items:center;justify-content:center;gap:6px}
  .topbar a{color:#fff;text-decoration:underline;text-underline-offset:2px}
  .topbar a:hover{color:var(--oat-medium)}
  .hero{background:var(--navy800);color:var(--oat-light);padding:48px 0 40px}
  .eyebrow{margin:0 0 16px;font:500 12px/1.5 "DM Mono",ui-monospace,Menlo,monospace;
           letter-spacing:.12em;text-transform:uppercase;color:#90A5B1}
  .eyebrow b{color:var(--lava);font-weight:500}
  .hero h1{margin:0;font-size:40px;line-height:1.2;font-weight:700;letter-spacing:-.02em}
  .hero .lede{margin:16px 0 0;max-width:64ch;font-size:16px;line-height:1.5;color:#C4CCD6}
  .stats{margin:24px 0 0;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:8px}
  .stats li{font:500 12px/1 "DM Mono",ui-monospace,Menlo,monospace;letter-spacing:.04em;
            padding:8px 12px;border:1px solid #143D4A;border-radius:8px;color:#C4CCD6}
  .hero nav{margin:24px 0 0;display:flex;flex-wrap:wrap;gap:8px}
  .hero nav a{font-size:14px;text-decoration:none;color:var(--oat-light);
              border:1px solid #143D4A;border-radius:8px;padding:8px 16px}
  .hero nav a:hover{border-color:var(--lava);color:var(--lava)}
  .hero nav a.primary{background:var(--lava);border-color:var(--lava);color:#fff}
  .hero nav a.primary:hover{background:#BD2B26;border-color:#BD2B26;color:#fff}

  .more{margin:24px 0 0;border-top:1px solid #143D4A;padding:16px 0 0}
  .more summary{cursor:pointer;font:500 12px/1.5 "DM Mono",ui-monospace,Menlo,monospace;
                letter-spacing:.12em;text-transform:uppercase;color:#90A5B1;list-style:none}
  .more summary::-webkit-details-marker{display:none}
  .more summary::before{content:"+ ";color:var(--lava)}
  .more[open] summary::before{content:"- "}
  .more summary:hover{color:var(--oat-light)}
  .more .dl-row{margin-top:16px}
  .downloads{margin:32px 0 0;padding:24px 0 0;border-top:1px solid #143D4A}
  .dl-head{margin:0 0 12px;font:500 12px/1.5 "DM Mono",ui-monospace,Menlo,monospace;
           letter-spacing:.12em;text-transform:uppercase;color:#90A5B1}
  .dl-row{display:flex;flex-wrap:wrap;gap:8px}
  a.dl{display:flex;flex-direction:column;gap:2px;min-width:140px;padding:12px 16px;
       border:1px solid #143D4A;border-radius:8px;color:var(--oat-light);text-decoration:none}
  a.dl:hover{border-color:var(--lava)}
  a.dl b{font-size:14px;line-height:1.2;font-weight:700}
  a.dl span{font:400 12px/1.4 "DM Mono",ui-monospace,Menlo,monospace;color:#90A5B1}
  a.dl.primary{background:var(--lava);border-color:var(--lava)}
  a.dl.primary:hover{background:#BD2B26;border-color:#BD2B26}
  a.dl.primary span{color:#FFDBD5}
  .dl-note{margin:12px 0 0;font-size:12px;line-height:1.5;color:#90A5B1}
  h2 a.zip{margin-left:8px;font:400 12px/1 "DM Mono",ui-monospace,Menlo,monospace;
           letter-spacing:.04em;text-transform:none;font-weight:400;text-decoration:none;
           color:var(--muted);border:1px solid var(--line);border-radius:6px;padding:5px 8px}
  h2 a.zip:hover{border-color:var(--lava);color:var(--lava)}

  .toolbar{position:sticky;top:0;z-index:9;background:var(--bg);
           border-bottom:1px solid var(--line);padding:16px 0}
  .bar{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  input[type=search]{flex:1;min-width:240px;padding:12px 16px;border:1px solid var(--line);
    border-radius:8px;background:var(--card);color:var(--fg);font-family:inherit;font-size:14px}
  input[type=search]:focus{outline:2px solid var(--lava);outline-offset:-1px;border-color:var(--lava)}
  button{padding:12px 16px;border:1px solid var(--line);border-radius:8px;background:var(--card);
         color:var(--fg);cursor:pointer;font-family:inherit;font-size:14px}
  button:hover{border-color:var(--lava)}
  button.on{background:var(--lava);border-color:var(--lava);color:#fff}

  /* .wrap is a class and main is an element, so .wrap{padding:0 32px} wins on
     specificity and zeroes the vertical padding. Qualify the selector. */
  main.wrap{padding-top:56px;padding-bottom:80px}
  /* the toolbar is sticky, so an anchored section needs to clear it */
  .cat{margin-bottom:48px;scroll-margin-top:88px}
  h2{display:flex;align-items:center;gap:8px;margin:0 0 16px;font-size:12px;line-height:1.2;
     font-weight:700;text-transform:uppercase;letter-spacing:.12em}
  .dot{width:12px;height:12px;border-radius:50%;display:inline-block;flex:0 0 auto}
  .hex{font:400 12px/1.2 "DM Mono",ui-monospace,Menlo,monospace;color:var(--muted);
       letter-spacing:.04em;text-transform:none;font-weight:400}
  .count{margin-left:auto;color:var(--muted);font-size:12px;letter-spacing:0;font-weight:400}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(304px,1fr));gap:16px}
  .card{margin:0;background:var(--card);border:1px solid var(--line);border-radius:12px;
        padding:16px;display:flex;gap:16px;transition:border-color .15s,transform .15s}
  .card:hover{border-color:var(--lava);transform:translateY(-2px)}
  .card.hide{display:none}
  .art{position:relative;flex:0 0 48px;height:48px}
  .art img{width:48px;height:48px;display:block}
  .art .tile{position:absolute;inset:0;opacity:0}
  body.tiles .art img{opacity:0}
  body.tiles .art .tile{opacity:1}
  figcaption{min-width:0}
  figcaption strong{display:block;font-size:16px;line-height:1.2;font-weight:700}
  figcaption code{display:inline-block;margin-top:4px;cursor:copy;color:var(--muted);
                  font:400 12px/1.5 "DM Mono",ui-monospace,Menlo,monospace}
  figcaption code:hover{color:var(--lava)}
  figcaption p{margin:8px 0 0;font-size:14px;line-height:1.5;color:var(--muted)}
  figcaption .aka{font-style:italic}
  .files{display:flex;flex-wrap:wrap;gap:4px;margin-top:12px}
  .files a{font:400 12px/1 "DM Mono",ui-monospace,Menlo,monospace;padding:6px 8px;
           border:1px solid var(--line);border-radius:6px;color:var(--muted);
           text-decoration:none;white-space:nowrap}
  .files a:hover{border-color:var(--lava);color:var(--lava)}
  .files a.src{border-style:dashed}
  .files a.docs{color:var(--lava);border-color:transparent}
  .files a.docs:hover{border-color:var(--lava)}
  .empty{color:var(--muted);padding:40px 0}

  footer{background:var(--navy800);color:#C4CCD6;padding:64px 0;font-size:14px;line-height:1.5}
  footer h3{margin:0 0 16px;font-size:20px;line-height:1.2;font-weight:700;color:var(--oat-light)}
  footer h4{margin:32px 0 8px;font-size:14px;line-height:1.2;font-weight:700;color:var(--oat-light)}
  footer p{margin:0 0 16px;max-width:78ch}
  footer a{color:#8ACAFF}
  footer a:hover{color:var(--lava)}
  footer code{font:400 13px/1.5 "DM Mono",ui-monospace,Menlo,monospace;color:var(--oat-light)}
  footer .rule{height:1px;background:#143D4A;border:0;margin:40px 0}
  footer .fine{color:#90A5B1;font-size:12px;line-height:1.5}

  #toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(32px);
    background:var(--navy800);color:#fff;padding:12px 16px;border-radius:8px;font-size:14px;
    opacity:0;transition:.2s;pointer-events:none;border:1px solid var(--lava)}
  #toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
  @media (max-width:640px){ .hero h1{font-size:32px} .wrap{padding:0 16px} }
</style>
</head>
<body>
<div class="topbar">
  <div class="wrap">Made with <span aria-hidden="true">&hearts;</span> by
    <a href="https://github.com/oieduardorabelo" target="_blank" rel="noreferrer">@oieduardorabelo</a>
  </div>
</div>
<header class="hero">
  <div class="wrap">
    <p class="eyebrow"><b>Unofficial</b> &middot; not affiliated with Databricks</p>
    <h1>${PROJECT.name}</h1>
    <p class="lede">The set has ${catalog.length} products in ${Object.values(CATEGORIES).filter((c) => catalog.some((x) => x.categoryLabel === c.label)).length} categories.
      It gives SVG files and PNG files for any diagram tool.</p>
    <nav>
      <a class="primary" href="${downloads.find((d) => d.group === 'all').file}" download>Download all
        &middot; ${fmtBytes(downloads.find((d) => d.group === 'all').bytes)}</a>
      <a href="examples/mermaid-architecture.html">Mermaid demo</a>
      <a href="${PROJECT.repository}" target="_blank" rel="noreferrer">GitHub</a>
      <a href="#provenance">Where these come from</a>
    </nav>
    <details class="more">
      <summary>More downloads</summary>
      <div class="dl-row">
        ${downloads
          .filter((d) => d.group === 'variant')
          .map((d) => `<a class="dl" href="${d.file}" download><b>${esc(d.label)}</b><span>${d.count} files &middot; ${fmtBytes(d.bytes)}</span></a>`)
          .join('\n        ')}
      </div>
      <p class="dl-note">Each category has its own archive. The link is on the heading of that
        category. The icons work with Mermaid, Miro, Lucidchart, draw.io, Excalidraw, Figma,
        PowerPoint, Keynote and Google Slides.</p>
    </details>
  </div>
</header>
<div class="toolbar">
  <div class="wrap bar">
    <input type="search" id="q" placeholder="Search products, slugs, descriptions&hellip;" autocomplete="off" aria-label="Search products">
    <button id="tiles">Tile view</button>
    <button id="theme">Dark</button>
  </div>
</div>
<main class="wrap">
${cards}
  <p class="empty" id="empty" hidden>No products match that search.</p>
</main>
<footer id="provenance">
  <div class="wrap">
    <h3>Where these icons come from, and the terms</h3>
    <p>Every icon in this library is an official Databricks SVG file. Nothing is redrawn, traced or
      approximated. The files come from Databricks URLs. These are the named product marks and the Lava
      line-icon set on databricks.com. The <code>sources/</code> directory holds each original file next
      to a <a href="sources/MANIFEST.md">manifest</a> that gives its source URL. Two marks are
      different: Apache Spark and Apache Iceberg are project logos of the Apache Software Foundation.</p>

    <h4>What the build changes</h4>
    <p>The build applies four mechanical transforms and makes no other change. It fits each source
      file into a padded ${CANVAS}&times;${CANVAS} canvas and keeps the aspect ratio. It adds the product
      slug to each internal id, each <code>url(#&hellip;)</code> reference and each CSS class. Then icons
      can share a page, and their gradients and clip paths do not collide.</p>
    <p>The build also recolors the mono and tile variants. It keeps the three Databricks color roles
      separate: foreground, light tint and white plate. If it joins these roles, a mark becomes a blob.
      Last, it removes a full-bleed white background plate, because such a plate looks like an opaque box
      on a dark diagram. The <code>svg/</code> directory holds the published artwork with the fit step and
      the namespace step only.</p>

    <h4>Color and type</h4>
    <p>The category colors are exact values from the Databricks primary palette and extended palette.
      This page uses DM Sans and DM Mono on the 8px type scale from the guidelines. Databricks gives this
      purpose for the extended palette: &ldquo;a functional need for additional shades of color to
      enhance the comprehension of a message or to provide additional clarity through visual
      hierarchy&rdquo;. A color code on a diagram layer has this purpose. The build calculates the
      contrast of the white glyph on each tile. If one value is less than 3:1, the build fails.</p>

    <h4>Trademarks, and what this project is not</h4>
    <p>Databricks, the Databricks logo and the product names are trademarks of Databricks,&nbsp;Inc.
      Apache Spark and Apache Iceberg are trademarks of the Apache Software Foundation. This is an
      independent reference from public documentation. Databricks does not sponsor or endorse it. This
      site does not use the Databricks logo as its own logo or favicon.</p>
    <p>The Databricks logo mark is unaltered. The build never sends it to the recolor step, because
      <a href="https://brandguides.brandfolder.com/databricks-extended-brand-guidelines/logo">the brand
      guidelines</a> give the instruction &ldquo;don't recolor the logo&rdquo;. A label on a Databricks
      product in a technical diagram is a descriptive use. Before you use these assets commercially or in
      public material, read the
      <a href="https://brandguides.brandfolder.com/databricks-extended-brand-guidelines">brand
      guidelines</a> and speak to Databricks.</p>

    <hr class="rule">
    <p class="fine">The product names, the descriptions and the groups come from research on
      databricks.com and docs.databricks.com. They show the published information at build time.
      Databricks changes product names often. Make sure that a name is current before you publish a
      diagram. The <a href="README.md">README</a> explains how to add a product to this set.</p>
  </div>
</footer>
<div id="toast"></div>
<script>
  const q = document.getElementById('q');
  const cards = [...document.querySelectorAll('.card')];
  const cats = [...document.querySelectorAll('.cat')];
  const empty = document.getElementById('empty');
  q.addEventListener('input', () => {
    const t = q.value.trim().toLowerCase();
    cards.forEach(c => c.classList.toggle('hide', t && !c.dataset.name.includes(t)));
    let any = false;
    cats.forEach(s => {
      const vis = [...s.querySelectorAll('.card')].some(c => !c.classList.contains('hide'));
      s.hidden = !vis; any = any || vis;
    });
    empty.hidden = any;
  });
  document.getElementById('tiles').addEventListener('click', e => {
    document.body.classList.toggle('tiles');
    e.target.classList.toggle('on');
  });
  document.getElementById('theme').addEventListener('click', e => {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', dark ? 'light' : 'dark');
    e.target.textContent = dark ? 'Dark' : 'Light';
  });
  const toast = document.getElementById('toast');
  document.addEventListener('click', e => {
    if (e.target.tagName !== 'CODE') return;
    navigator.clipboard.writeText(e.target.textContent).then(() => {
      toast.textContent = 'Copied ' + e.target.textContent;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 1300);
    });
  });
</script>
</body>
</html>
`,
);

// GitHub Pages runs Jekyll by default, which would skip any future underscore
// directory and slow the build down for no benefit. This site is plain static.
fs.writeFileSync(out('.nojekyll'), '');

// ------------------------------------------ examples: the generated icon sheet

// The Mermaid demo page is hand-written, but the icon sheet at the bottom of it
// has to track the catalog. The build replaces everything between the two
// markers, so the sheet always covers every icon and the rest of the page stays
// editable by hand.
{
  const PER_ROW = 6;
  const panels = byCategory
    .filter((c) => c.products.length)
    .map((c) => {
      const nodes = [];
      const chains = [];
      let idx = 0;
      for (let i = 0; i < c.products.length; i += PER_ROW) {
        const ids = [];
        for (const p of c.products.slice(i, i + PER_ROW)) {
          const id = `${c.key}${idx++}`;
          ids.push(id);
          nodes.push(`    ${id}@{ icon: "databricks-color:${p.slug}", form: "square", label: "${p.slug}", pos: "b" }`);
        }
        // '~~~' is an invisible link: it lays the row out side by side without
        // drawing an edge between the nodes.
        if (ids.length > 1) chains.push(`    ${ids.join(' ~~~ ')}`);
      }
      return `<h2 class="cat"><span class="dot" style="background:${c.color}"></span>${esc(c.label)}<span class="n">${c.products.length}</span></h2>
<div class="panel">
  <pre class="mermaid">
---
config:
  flowchart:
    htmlLabels: true
---
flowchart LR
${nodes.join('\n')}

${chains.join('\n')}
  </pre>
</div>`;
    })
    .join('\n');

  const page = out('examples', 'mermaid-architecture.html');
  const html = fs.readFileSync(page, 'utf8');
  const START = '<!-- ALL-ICONS:START -->';
  const END = '<!-- ALL-ICONS:END -->';
  const a = html.indexOf(START);
  const b = html.indexOf(END);
  if (a < 0 || b < 0) {
    problems.push('examples/mermaid-architecture.html: the ALL-ICONS markers are missing');
  } else {
    fs.writeFileSync(page, html.slice(0, a + START.length) + '\n' + panels + '\n' + html.slice(b));
  }
}

// ---------------------------------------------------------------- preview.png

if (sharp) {
  const COLS = 9;
  const CELL = 112;
  const TILE = 60;
  const ROW = 116;
  const HEAD = 42;
  const PADX = 28;

  let y = 30;
  const blocks = [];
  for (const c of byCategory) {
    if (!c.products.length) continue;
    blocks.push({ head: c, y });
    y += HEAD;
    const rows = Math.ceil(c.products.length / COLS);
    c.products.forEach((p, i) => {
      blocks.push({
        product: p,
        x: PADX + (i % COLS) * CELL + (CELL - TILE) / 2,
        y: y + Math.floor(i / COLS) * ROW,
      });
    });
    y += rows * ROW + 14;
  }
  const W = PADX * 2 + COLS * CELL;
  const H = y + 16;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="${BRAND.oatLight}"/>`;
  for (const b of blocks) {
    if (b.head) {
      svg += `<circle cx="${PADX + 5}" cy="${b.y + 14}" r="5" fill="${b.head.color}"/>`;
      svg += `<text x="${PADX + 18}" y="${b.y + 19}" font-family="DM Sans,Helvetica,sans-serif" font-size="14" font-weight="600" letter-spacing="1.4" fill="${BRAND.navy800}">${esc(b.head.label.toUpperCase())}</text>`;
      continue;
    }
    const data = fs.readFileSync(out('svg-tile', `${b.product.slug}.svg`)).toString('base64');
    svg += `<image x="${b.x}" y="${b.y}" width="${TILE}" height="${TILE}" xlink:href="data:image/svg+xml;base64,${data}"/>`;
    const words = b.product.slug.split('-');
    const lines = [''];
    for (const w of words) {
      if ((lines[lines.length - 1] + ' ' + w).trim().length > 15) lines.push(w);
      else lines[lines.length - 1] = (lines[lines.length - 1] + ' ' + w).trim();
    }
    lines.slice(0, 3).forEach((ln, j) => {
      svg += `<text x="${b.x + TILE / 2}" y="${b.y + TILE + 15 + j * 12}" font-family="ui-monospace,Menlo,monospace" font-size="10" fill="#5b6b73" text-anchor="middle">${esc(ln)}</text>`;
    });
  }
  svg += '</svg>';
  pngJobs.push(sharp(Buffer.from(svg), { density: 144 }).png().toFile(out('preview.png')));
}

// ---------------------------------------------------------------------- done

if (sharp) await Promise.all(pngJobs);

console.log(`${PROJECT.name}: built ${catalog.length} products`);
console.log(`  svg/ svg-mono/ svg-tile/${PNG_AVAILABLE ? ' png/ png-tile/' : ''} logos/ iconify/`);
if (!sharp && PNG_AVAILABLE) console.log('  (PNG files kept from the last build - sharp is only needed to rebuild them)');
console.log(`  catalog.json catalog.csv CATALOG.md index.html${sharp ? ' preview.png' : ''} .nojekyll`);
console.log('  category contrast (white glyph, WCAG 1.4.11 floor is 3:1):');
for (const c of Object.values(CATEGORIES)) {
  console.log(`    ${c.color}  ${String(c.contrast).padStart(5)}:1  ${c.note.padEnd(20)} ${c.label}`);
}
if (problems.length) {
  console.log('\nproblems:');
  for (const p of problems) console.log('  ! ' + p);
  process.exitCode = 1;
}
