/**
 * The Databricks architecture brand system for draw.io.
 *
 * One canonical style guide, merged from the 15 measured Databricks solution
 * architecture diagrams and the draw.io format research. It is the single
 * source of truth for the colour tokens, the style strings and the three
 * template tiers.
 *
 * `tools/build.mjs` imports `drawioFiles()` and writes the result to `drawio/`.
 * Nothing here touches the file system.
 */

/** Where the published icons live. `build.mjs` checks this against PROJECT.url. */
export const ICON_BASE = 'https://oieduardorabelo.github.io/databricks-architecture-icons/svg';
const icon = (slug) => `${ICON_BASE}/${slug}.svg`;

/* ------------------------------------------------------------------ tokens */

export const TOKENS = {
  'brand-lava': '#FF5F46',
  'brand-lava-deep': '#FF3621',
  'brand-lava-tint': '#FABFBA',
  'ink-navy': '#143D4A',
  'ink-navy-deep': '#1B3139',
  'ink-navy-soft': '#618794',
  'line-slate': '#A9B8BD',
  'surface-oat-line': '#D9D7CE',
  'surface-oat': '#EEEDE9',
  'surface-oat-light': '#F9F7F4',
  'surface-white': '#FFFFFF',
  'accent-green': '#71C5AD',
  'store-bronze': '#B7584B',
  'store-silver': '#A7B7BB',
  'store-gold': '#A1670F',
};
const T = TOKENS;

const FONT =
  'fontFamily=DM Sans;fontSource=https%3A%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3DDM%2BSans%3A400%2C500%2C700;';

/* ----------------------------------------------------------- style strings */

export const STYLES = {
  /* --- text and rules --- */
  'text-title':
    `text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=18;fontStyle=1;fontColor=${T['ink-navy-deep']};${FONT}`,
  'text-subtitle':
    `text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=11;fontStyle=0;fontColor=${T['ink-navy-soft']};${FONT}`,
  'rule-lava':
    `rounded=0;html=1;fillColor=${T['brand-lava']};strokeColor=none;`,

  /* --- zones and containers --- */
  'zone-platform':
    `swimlane;html=1;whiteSpace=wrap;startSize=52;horizontal=1;fillColor=${T['brand-lava']};swimlaneFillColor=${T['surface-white']};strokeColor=${T['brand-lava']};strokeWidth=4;fontColor=${T['surface-white']};fontSize=18;fontStyle=1;align=center;verticalAlign=middle;container=1;collapsible=0;${FONT}`,
  'zone-external':
    `swimlane;html=1;whiteSpace=wrap;startSize=44;horizontal=1;fillColor=${T['surface-oat-line']};swimlaneFillColor=${T['surface-white']};strokeColor=${T['surface-oat-line']};strokeWidth=2;fontColor=${T['ink-navy-deep']};fontSize=14;fontStyle=1;align=center;verticalAlign=middle;container=1;collapsible=0;${FONT}`,
  'zone-owned':
    `swimlane;html=1;whiteSpace=wrap;startSize=44;horizontal=1;fillColor=${T['ink-navy']};swimlaneFillColor=${T['surface-white']};strokeColor=${T['ink-navy']};strokeWidth=2;fontColor=${T['surface-white']};fontSize=14;fontStyle=1;align=center;verticalAlign=middle;container=1;collapsible=0;${FONT}`,
  'panel-group':
    `swimlane;html=1;whiteSpace=wrap;startSize=38;horizontal=1;fillColor=${T['ink-navy']};swimlaneFillColor=${T['surface-white']};strokeColor=${T['ink-navy']};strokeWidth=2;dashed=1;dashPattern=6 4;fixDash=1;fontColor=${T['surface-white']};fontSize=13;fontStyle=1;align=center;verticalAlign=middle;container=1;collapsible=0;${FONT}`,
  'panel-plain':
    `rounded=0;html=1;whiteSpace=wrap;fillColor=none;strokeColor=${T['ink-navy']};strokeWidth=2;dashed=1;dashPattern=6 4;fixDash=1;container=1;collapsible=0;align=center;verticalAlign=top;fontSize=12;fontStyle=1;fontColor=${T['ink-navy']};${FONT}`,

  /* --- header bars --- */
  'bar-lava':
    `rounded=0;html=1;whiteSpace=wrap;fillColor=${T['brand-lava']};strokeColor=none;align=center;verticalAlign=middle;fontSize=14;fontStyle=1;fontColor=${T['surface-white']};${FONT}`,
  'bar-navy':
    `rounded=0;html=1;whiteSpace=wrap;fillColor=${T['ink-navy']};strokeColor=none;align=center;verticalAlign=middle;fontSize=14;fontStyle=1;fontColor=${T['surface-white']};${FONT}`,
  'bar-oat':
    `rounded=0;html=1;whiteSpace=wrap;fillColor=${T['surface-oat-line']};strokeColor=none;align=center;verticalAlign=middle;fontSize=14;fontStyle=1;fontColor=${T['ink-navy-deep']};${FONT}`,

  /* --- nodes --- */
  'node-platform':
    `rounded=0;html=1;whiteSpace=wrap;fillColor=${T['surface-white']};strokeColor=${T['brand-lava']};strokeWidth=2;align=center;verticalAlign=middle;spacing=6;fontSize=12;fontStyle=1;fontColor=${T['ink-navy-deep']};${FONT}`,
  'node-external':
    `rounded=0;html=1;whiteSpace=wrap;fillColor=${T['surface-white']};strokeColor=${T['surface-oat-line']};strokeWidth=2;align=center;verticalAlign=middle;spacing=6;fontSize=12;fontStyle=1;fontColor=${T['ink-navy-deep']};${FONT}`,
  /* The box is wider than the icon on purpose. `imageAspect=1` keeps the icon
     square and centres it, so the label below gets the full width of the box
     and does not overflow the panel that holds it. */
  'node-capability':
    `shape=image;html=1;whiteSpace=wrap;imageAspect=1;verticalLabelPosition=bottom;verticalAlign=top;labelPosition=center;align=center;fontSize=11;fontStyle=1;fontColor=${T['ink-navy-deep']};${FONT}image=${icon('lakeflow')};`,
  'node-decision':
    `rhombus;html=1;whiteSpace=wrap;fillColor=${T['surface-white']};strokeColor=${T['ink-navy']};strokeWidth=2;align=center;verticalAlign=middle;fontSize=12;fontStyle=1;fontColor=${T['ink-navy-deep']};${FONT}`,
  'node-store':
    `shape=cylinder3;boundedLbl=1;backgroundOutline=1;size=14;html=1;whiteSpace=wrap;fillColor=${T['surface-white']};strokeColor=${T['ink-navy']};strokeWidth=2;align=center;verticalAlign=middle;fontSize=12;fontStyle=1;fontColor=${T['ink-navy-deep']};${FONT}`,
  'node-manual':
    `shape=hexagon;perimeter=hexagonPerimeter2;html=1;whiteSpace=wrap;fillColor=${T['surface-oat']};strokeColor=${T['ink-navy']};strokeWidth=2;align=center;verticalAlign=middle;fontSize=12;fontStyle=1;fontColor=${T['ink-navy-deep']};${FONT}`,
  'ring-bronze':
    `ellipse;html=1;whiteSpace=wrap;fillColor=none;strokeColor=${T['store-bronze']};strokeWidth=3;align=center;verticalAlign=middle;fontSize=12;fontStyle=1;fontColor=${T['ink-navy-deep']};${FONT}`,
  'ring-silver':
    `ellipse;html=1;whiteSpace=wrap;fillColor=none;strokeColor=${T['store-silver']};strokeWidth=3;align=center;verticalAlign=middle;fontSize=12;fontStyle=1;fontColor=${T['ink-navy-deep']};${FONT}`,
  'ring-gold':
    `ellipse;html=1;whiteSpace=wrap;fillColor=none;strokeColor=${T['store-gold']};strokeWidth=3;align=center;verticalAlign=middle;fontSize=12;fontStyle=1;fontColor=${T['ink-navy-deep']};${FONT}`,
  'badge-step':
    `ellipse;html=1;whiteSpace=wrap;fillColor=${T['accent-green']};strokeColor=none;align=center;verticalAlign=middle;fontSize=11;fontStyle=1;fontColor=${T['surface-white']};${FONT}`,

  /* --- furniture --- */
  'note-callout':
    `shape=note;size=16;html=1;whiteSpace=wrap;fillColor=${T['surface-oat-light']};strokeColor=${T['surface-oat-line']};strokeWidth=1;align=left;verticalAlign=top;spacing=8;fontSize=11;fontStyle=0;fontColor=${T['ink-navy-deep']};${FONT}`,
  'legend-box':
    `rounded=0;html=1;whiteSpace=wrap;fillColor=${T['surface-white']};strokeColor=${T['surface-oat-line']};strokeWidth=2;container=1;collapsible=0;align=left;verticalAlign=top;spacingLeft=12;spacingTop=6;fontSize=12;fontStyle=1;fontColor=${T['ink-navy-deep']};${FONT}`,
  'legend-label':
    `text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=10;fontStyle=0;fontColor=${T['ink-navy-deep']};${FONT}`,
  'footer-strip':
    `rounded=0;html=1;whiteSpace=wrap;fillColor=${T['surface-oat']};strokeColor=none;align=left;verticalAlign=middle;spacingLeft=16;fontSize=11;fontStyle=0;fontColor=${T['ink-navy-soft']};${FONT}`,

  /* --- connectors --- */
  'edge-flow':
    `edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;jettySize=auto;orthogonalLoop=1;endArrow=block;endFill=1;strokeColor=${T['ink-navy']};strokeWidth=2;${FONT}`,
  'edge-secondary':
    `edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;jettySize=auto;orthogonalLoop=1;endArrow=open;endFill=0;strokeColor=${T['line-slate']};strokeWidth=2;${FONT}`,
  'edge-derived':
    `edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;jettySize=auto;orthogonalLoop=1;endArrow=block;endFill=1;strokeColor=${T['ink-navy']};strokeWidth=2;dashed=1;dashPattern=6 4;fixDash=1;${FONT}`,
  'edge-two-way':
    `edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;jettySize=auto;orthogonalLoop=1;startArrow=block;startFill=1;endArrow=block;endFill=1;strokeColor=${T['ink-navy']};strokeWidth=2;labelBackgroundColor=${T['surface-white']};fontSize=10;fontStyle=1;fontColor=${T['ink-navy-deep']};${FONT}`,
  'edge-labelled':
    `edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;jettySize=auto;orthogonalLoop=1;endArrow=block;endFill=1;strokeColor=${T['ink-navy']};strokeWidth=2;labelBackgroundColor=${T['surface-white']};fontSize=10;fontStyle=1;fontColor=${T['ink-navy-deep']};${FONT}`,
  'edge-step':
    `edgeStyle=none;rounded=0;html=1;endArrow=block;endFill=1;strokeColor=${T['ink-navy']};strokeWidth=2;${FONT}`,
  'edge-leader':
    `edgeStyle=none;rounded=0;html=1;endArrow=none;strokeColor=${T['line-slate']};strokeWidth=1;dashed=1;dashPattern=4 4;fixDash=1;${FONT}`,
};

const S = STYLES;
const cap = (slug) => S['node-capability'].replace(icon('lakeflow'), icon(slug));

/* ------------------------------------------------------------- xml helpers */

/* for an attribute value */
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* for element text. A quote needs no escape here, and leaving it raw keeps the
   JSON of a library file readable. */
const escText = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const cells = [];
function reset() {
  cells.length = 0;
}
function v(id, value, style, x, y, w, h, parent = '1') {
  cells.push({ kind: 'v', id, value, style, x, y, w, h, parent });
  return id;
}
function e(id, style, source, target, value = '', extra = '') {
  cells.push({ kind: 'e', id, value, style: style + extra, source, target, parent: '1' });
  return id;
}
function render(name, pageW, pageH) {
  const body = cells
    .map((c) =>
      c.kind === 'v'
        ? `        <mxCell id="${c.id}" value="${esc(c.value)}" style="${esc(c.style)}" vertex="1" parent="${c.parent}">\n` +
          `          <mxGeometry x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" as="geometry"/>\n` +
          `        </mxCell>`
        : `        <mxCell id="${c.id}" value="${esc(c.value)}" style="${esc(c.style)}" edge="1" parent="${c.parent}" source="${c.source}" target="${c.target}">\n` +
          `          <mxGeometry relative="1" as="geometry"/>\n` +
          `        </mxCell>`
    )
    .join('\n');
  return (
    `<mxfile host="app.diagrams.net" agent="databricks-architecture-icons" type="device">\n` +
    `  <diagram id="${name}" name="${name}">\n` +
    `    <mxGraphModel dx="1422" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="${pageW}" pageHeight="${pageH}" background="#FFFFFF" math="0" shadow="0">\n` +
    `      <root>\n` +
    `        <mxCell id="0"/>\n` +
    `        <mxCell id="1" parent="0"/>\n` +
    body +
    `\n      </root>\n    </mxGraphModel>\n  </diagram>\n</mxfile>\n`
  );
}

/* ---------------------------------------------------------- shared legend */

/** [label, swatch style, w, h] — a line entry is 2 px tall so it does not read
 *  as a box. */
const LEGEND = [
  ['Databricks boundary', S['rule-lava'], 36, 22],
  ['Outside Databricks', `rounded=0;html=1;fillColor=${T['surface-oat-line']};strokeColor=none;`, 36, 22],
  ['Section header', `rounded=0;html=1;fillColor=${T['ink-navy']};strokeColor=none;`, 36, 22],
  ['Capability group', `rounded=0;html=1;fillColor=none;strokeColor=${T['ink-navy']};strokeWidth=2;dashed=1;dashPattern=6 4;fixDash=1;`, 36, 22],
  ['Step marker', `ellipse;html=1;fillColor=${T['accent-green']};strokeColor=none;`, 22, 22],
  ['Primary flow', `rounded=0;html=1;fillColor=${T['ink-navy']};strokeColor=none;`, 36, 3],
  ['Derived flow', `rounded=0;html=1;fillColor=none;strokeColor=${T['ink-navy']};strokeWidth=2;dashed=1;dashPattern=6 4;fixDash=1;`, 36, 2],
];

/* ------------------------------------------------------- tier 1 — simple */

function tier1() {
  reset();
  v('t1-title', '[Diagram title]', S['text-title'], 60, 40, 900, 32);
  v('t1-sub', '[One line that says what this diagram shows]', S['text-subtitle'], 60, 74, 900, 20);
  v('t1-rule', '', S['rule-lava'], 60, 104, 1080, 4);

  const row = [
    ['t1-n1', '[Source system]', S['node-external']],
    ['t1-n2', '[Ingest step]', S['node-platform']],
    ['t1-n3', '[Transform step]', S['node-platform']],
    ['t1-n4', '[Serve step]', S['node-platform']],
    ['t1-n5', '[Consumer]', S['node-external']],
  ];
  const xs = [60, 290, 520, 750, 980];
  row.forEach(([id, label, style], i) => v(id, label, style, xs[i], 190, 160, 110));
  row.forEach(([id], i) => v(`t1-b${i + 1}`, String(i + 1), S['badge-step'], xs[i] - 14, 176, 28, 28));

  for (let i = 0; i < 4; i++) {
    e(`t1-e${i + 1}`, S['edge-flow'], row[i][0], row[i + 1][0], '', 'exitX=1;exitY=0.5;entryX=0;entryY=0.5;');
  }
  return render('tier1-simple', 1200, 380);
}

/* ----------------------------------------------------- tier 2 — standard */

function tier2() {
  reset();
  v('t2-title', '[Diagram title]', S['text-title'], 40, 28, 1000, 32);
  v('t2-sub', '[Scope, audience and the question this diagram answers]', S['text-subtitle'], 40, 62, 1000, 20);
  v('t2-rule', '', S['rule-lava'], 40, 90, 1520, 4);

  /* zone A — sources */
  v('t2-src', '[Data sources]', S['zone-external'], 40, 130, 250, 470);
  ['[Source 1]', '[Source 2]'].forEach((l, i) =>
    v(`t2-src${i + 1}`, l, S['node-external'], 20, 70 + i * 190, 210, 170, 't2-src')
  );

  /* zone C — the platform */
  v('t2-plat', '[Databricks Data Intelligence Platform]', S['zone-platform'], 330, 130, 940, 690);
  v('t2-orch', '[Orchestration — Lakeflow Jobs]', S['bar-navy'], 30, 70, 880, 40, 't2-plat');

  v('t2-p1', '[Capability group]', S['panel-group'], 30, 130, 520, 220, 't2-plat');
  [
    ['t2-c1', '[Ingest]', 'lakeflow-connect'],
    ['t2-c2', '[Transform]', 'spark-declarative-pipelines'],
    ['t2-c3', '[Govern]', 'unity-catalog'],
  ].forEach(([id, label, slug], i) => v(id, label, cap(slug), 30 + i * 160, 90, 140, 60, 't2-p1'));

  v('t2-dec', '[Quality gate?]', S['node-decision'], 590, 130, 320, 90, 't2-plat');
  v('t2-man', '[Manual review]', S['node-manual'], 590, 260, 150, 60, 't2-plat');
  v('t2-pub', '[Publish step]', S['node-platform'], 760, 260, 150, 60, 't2-plat');

  v('t2-stobar', '[Governed storage — Unity Catalog]', S['bar-navy'], 30, 420, 880, 36, 't2-plat');
  v('t2-sto', '', S['panel-plain'], 30, 480, 880, 180, 't2-plat');
  v('t2-r1', 'Bronze', S['ring-bronze'], 60, 30, 120, 120, 't2-sto');
  v('t2-r2', 'Silver', S['ring-silver'], 240, 30, 120, 120, 't2-sto');
  v('t2-r3', 'Gold', S['ring-gold'], 420, 30, 120, 120, 't2-sto');
  v('t2-cyl', '[Serving table]', S['node-store'], 640, 40, 140, 100, 't2-sto');

  /* zone E — consumers */
  v('t2-con', '[Consumers]', S['zone-external'], 1310, 130, 250, 470);
  ['[Consumer 1]', '[Consumer 2]'].forEach((l, i) =>
    v(`t2-con${i + 1}`, l, S['node-external'], 20, 70 + i * 190, 210, 170, 't2-con')
  );

  /* furniture */
  v('t2-note', '[Annotation]\n\nUse a note for a caveat, an SLA or an owner. Keep it to two lines.', S['note-callout'], 40, 630, 250, 190);
  v('t2-leg', 'Legend', S['legend-box'], 1310, 630, 250, 190);
  LEGEND.forEach(([label, style, w, h], i) => {
    v(`t2-lsw${i + 1}`, '', style, 12, 40 + i * 21 - Math.round(h / 2) + 11, w, h, 't2-leg');
    v(`t2-ltx${i + 1}`, label, S['legend-label'], 56, 40 + i * 21, 180, 22, 't2-leg');
  });

  /* step markers */
  v('t2-b1', '1', S['badge-step'], 26, 116, 28, 28);
  v('t2-b2', '2', S['badge-step'], 316, 116, 28, 28);
  v('t2-b3', '3', S['badge-step'], 1296, 116, 28, 28);

  /* connectors */
  e('t2-e1', S['edge-flow'], 't2-src', 't2-plat', '', 'exitX=1;exitY=0.4;entryX=0;entryY=0.3;');
  e('t2-e2', S['edge-flow'], 't2-plat', 't2-con', '', 'exitX=1;exitY=0.3;entryX=0;entryY=0.4;');
  e('t2-e3', S['edge-flow'], 't2-p1', 't2-dec', '', 'exitX=1;exitY=0.6;entryX=0;entryY=0.5;');
  e('t2-e4', S['edge-labelled'], 't2-dec', 't2-man', '[No]', 'exitX=0.25;exitY=1;entryX=0.5;entryY=0;');
  e('t2-e5', S['edge-labelled'], 't2-dec', 't2-pub', '[Yes]', 'exitX=0.75;exitY=1;entryX=0.5;entryY=0;');
  e('t2-e6', S['edge-secondary'], 't2-man', 't2-p1', '', 'exitX=0;exitY=0.5;entryX=1;entryY=0.8;');
  e('t2-e7', S['edge-flow'], 't2-pub', 't2-stobar', '', 'exitX=0.5;exitY=1;entryX=0.91;entryY=0;');
  e('t2-e8', S['edge-step'], 't2-r1', 't2-r2', '', 'exitX=1;exitY=0.5;entryX=0;entryY=0.5;');
  e('t2-e9', S['edge-step'], 't2-r2', 't2-r3', '', 'exitX=1;exitY=0.5;entryX=0;entryY=0.5;');
  e('t2-e10', S['edge-derived'], 't2-r3', 't2-cyl', '', 'exitX=1;exitY=0.5;entryX=0;entryY=0.5;');

  return render('tier2-standard', 1600, 900);
}

/* ------------------------------------------------------ tier 3 — complex */

function tier3() {
  reset();
  v('t3-title', '[Reference architecture title]', S['text-title'], 40, 20, 1400, 32);
  v('t3-sub', '[Industry] · [Use case] · [Cloud] — what this architecture delivers, in one line', S['text-subtitle'], 40, 54, 1400, 20);
  v('t3-rule', '', S['rule-lava'], 40, 88, 2480, 4);

  /* zone A — data sources */
  v('t3-src', '[Data sources]', S['zone-external'], 40, 110, 280, 1130);
  for (let i = 0; i < 6; i++) {
    v(`t3-src${i + 1}`, `[Source system ${i + 1}]`, S['node-external'], 20, 70 + i * 170, 240, 160, 't3-src');
  }

  /* zone B — connectivity, in two boxes */
  v('t3-conn', '[Connectivity and protocols]', S['zone-external'], 360, 110, 280, 530);
  ['[Managed connector]', '[Federation]', '[API or SFTP]'].forEach((l, i) =>
    v(`t3-conn${i + 1}`, l, S['node-external'], 20, 70 + i * 140, 240, 120, 't3-conn')
  );
  v('t3-msg', '[Message store]', S['zone-external'], 360, 680, 280, 560);
  ['[Event stream 1]', '[Event stream 2]', '[Event stream 3]'].forEach((l, i) =>
    v(`t3-msg${i + 1}`, l, S['node-external'], 20, 70 + i * 140, 240, 120, 't3-msg')
  );

  /* zone C — the platform */
  v('t3-plat', '[Databricks Data Intelligence Platform]', S['zone-platform'], 680, 110, 1440, 1130);
  v('t3-orch', '[Orchestration — Lakeflow Jobs for [workload]]', S['bar-navy'], 30, 80, 1380, 44, 't3-plat');

  v('t3-p1', '[Design patterns with declarative pipelines]', S['panel-group'], 30, 150, 680, 420, 't3-plat');
  [
    ['[Change data capture]', 'lakeflow-connect'],
    ['[Incremental load]', 'auto-loader'],
    ['[Data quality]', 'data-quality-monitoring'],
    ['[Lineage graph]', 'data-lineage'],
    ['[PII masking]', 'enterprise-security'],
    ['[Backfill support]', 'spark-declarative-pipelines'],
  ].forEach(([label, slug], i) => {
    const col = i % 3;
    const rowIdx = Math.floor(i / 3);
    v(`t3-c1${i + 1}`, label, cap(slug), 50 + col * 220, 80 + rowIdx * 170, 140, 60, 't3-p1');
  });

  v('t3-p2', '[Analytics with Databricks SQL]', S['panel-group'], 750, 150, 660, 210, 't3-plat');
  [
    ['[Operational report]', 'databricks-sql'],
    ['[Business metric]', 'ai-bi-dashboards'],
    ['[Natural language query]', 'genie'],
  ].forEach(([label, slug], i) => v(`t3-c2${i + 1}`, label, cap(slug), 50 + i * 200, 70, 160, 60, 't3-p2'));

  v('t3-p3', '[Machine learning with Mosaic AI]', S['panel-group'], 750, 380, 660, 190, 't3-plat');
  [
    ['[Model training]', 'model-training'],
    ['[Model serving]', 'model-serving'],
    ['[Agent system]', 'agent-bricks'],
  ].forEach(([label, slug], i) => v(`t3-c3${i + 1}`, label, cap(slug), 50 + i * 200, 60, 160, 60, 't3-p3'));

  /* branch row */
  v('t3-dec', '[Meets the SLA?]', S['node-decision'], 30, 600, 240, 100, 't3-plat');
  v('t3-re', '[Reprocess]', S['node-platform'], 330, 600, 200, 45, 't3-plat');
  v('t3-pub', '[Publish]', S['node-platform'], 330, 655, 200, 45, 't3-plat');
  v('t3-note1', '[Annotation] Name the owner, the refresh interval and the retention rule for this branch.', S['note-callout'], 750, 595, 660, 110, 't3-plat');

  /* storage band */
  v('t3-stobar', '[Governed storage — Unity Catalog]', S['bar-navy'], 30, 740, 1380, 44, 't3-plat');
  v('t3-sto', '', S['panel-plain'], 30, 810, 1380, 200, 't3-plat');
  v('t3-r1', 'Bronze', S['ring-bronze'], 60, 40, 120, 120, 't3-sto');
  v('t3-r2', 'Silver', S['ring-silver'], 300, 40, 120, 120, 't3-sto');
  v('t3-r3', 'Gold', S['ring-gold'], 540, 40, 120, 120, 't3-sto');
  v('t3-cyl1', '[Managed table]', S['node-store'], 800, 50, 200, 100, 't3-sto');
  v('t3-cyl2', '[External table]', S['node-store'], 1060, 50, 200, 100, 't3-sto');

  ['[Delta Lake]', '[Apache Spark]', '[Unity Catalog]', '[Lakebase]'].forEach((l, i) =>
    v(`t3-os${i + 1}`, l, S['node-platform'], 30 + i * 350, 1040, 330, 60, 't3-plat')
  );

  /* zone E — consumers */
  v('t3-e1', '[Business intelligence]', S['zone-external'], 2160, 110, 360, 360);
  ['[BI tool]', '[Spreadsheet]'].forEach((l, i) =>
    v(`t3-e1n${i + 1}`, l, S['node-external'], 20, 70 + i * 130, 320, 110, 't3-e1')
  );
  v('t3-e2', '[Databricks Apps]', S['zone-owned'], 2160, 500, 360, 360);
  ['[Internal app]', '[Agent endpoint]'].forEach((l, i) =>
    v(`t3-e2n${i + 1}`, l, S['node-platform'], 20, 70 + i * 130, 320, 110, 't3-e2')
  );
  v('t3-e3', '[Secure data sharing]', S['zone-external'], 2160, 890, 360, 350);
  ['[Partner]', '[Marketplace listing]'].forEach((l, i) =>
    v(`t3-e3n${i + 1}`, l, S['node-external'], 20, 70 + i * 130, 320, 110, 't3-e3')
  );

  /* legend, annotations, footer */
  v('t3-leg', 'Legend', S['legend-box'], 40, 1270, 1400, 90);
  LEGEND.forEach(([label, style, w, h], i) => {
    v(`t3-lsw${i + 1}`, '', style, 20 + i * 197, 55 - Math.round(h / 2), w, h, 't3-leg');
    v(`t3-ltx${i + 1}`, label, S['legend-label'], 64 + i * 197, 44, 130, 22, 't3-leg');
  });
  v('t3-note2', '[Annotation] Replace every bracketed label. Delete a zone you do not use; do not recolour one.', S['note-callout'], 1480, 1270, 500, 90);
  v('t3-note3', '[Annotation] Lava marks Databricks. Oat marks every system that is not Databricks.', S['note-callout'], 2020, 1270, 500, 90);
  v('t3-foot', '[Project] · [Owner] · v[0.1] · [YYYY-MM-DD] · [Source of truth link]', S['footer-strip'], 40, 1385, 2480, 35);

  /* step markers */
  [
    ['1', 24, 94],
    ['2', 344, 94],
    ['3', 344, 664],
    ['4', 664, 94],
    ['5', 2144, 94],
    ['6', 2144, 484],
    ['7', 2144, 874],
  ].forEach(([n, x, y], i) => v(`t3-b${i + 1}`, n, S['badge-step'], x, y, 32, 32));

  /* connectors */
  e('t3-x1', S['edge-flow'], 't3-src', 't3-conn', '', 'exitX=1;exitY=0.2;entryX=0;entryY=0.4;');
  e('t3-x2', S['edge-secondary'], 't3-src', 't3-msg', '', 'exitX=1;exitY=0.8;entryX=0;entryY=0.4;');
  e('t3-x3', S['edge-flow'], 't3-conn', 't3-plat', '', 'exitX=1;exitY=0.5;entryX=0;entryY=0.2;');
  e('t3-x4', S['edge-flow'], 't3-msg', 't3-plat', '', 'exitX=1;exitY=0.5;entryX=0;entryY=0.7;');
  e('t3-x5', S['edge-flow'], 't3-plat', 't3-e1', '', 'exitX=1;exitY=0.2;entryX=0;entryY=0.5;');
  e('t3-x6', S['edge-two-way'], 't3-plat', 't3-e2', '', 'exitX=1;exitY=0.5;entryX=0;entryY=0.5;');
  e('t3-x7', S['edge-flow'], 't3-plat', 't3-e3', '', 'exitX=1;exitY=0.85;entryX=0;entryY=0.5;');
  e('t3-x8', S['edge-flow'], 't3-p1', 't3-dec', '', 'exitX=0.2;exitY=1;entryX=0.5;entryY=0;');
  e('t3-x9', S['edge-labelled'], 't3-dec', 't3-re', '[No]', 'exitX=1;exitY=0.25;entryX=0;entryY=0.5;');
  e('t3-x10', S['edge-labelled'], 't3-dec', 't3-pub', '[Yes]', 'exitX=1;exitY=0.75;entryX=0;entryY=0.5;');
  e('t3-x11', S['edge-secondary'], 't3-re', 't3-p1', '', 'exitX=1;exitY=0.5;entryX=0.84;entryY=1;');
  e('t3-x12', S['edge-flow'], 't3-pub', 't3-stobar', '', 'exitX=0.5;exitY=1;entryX=0.29;entryY=0;');
  e('t3-x13', S['edge-step'], 't3-r1', 't3-r2', '', 'exitX=1;exitY=0.5;entryX=0;entryY=0.5;');
  e('t3-x14', S['edge-step'], 't3-r2', 't3-r3', '', 'exitX=1;exitY=0.5;entryX=0;entryY=0.5;');
  e('t3-x15', S['edge-step'], 't3-r3', 't3-cyl1', '', 'exitX=1;exitY=0.5;entryX=0;entryY=0.5;');
  e('t3-x16', S['edge-derived'], 't3-cyl1', 't3-cyl2', '', 'exitX=1;exitY=0.5;entryX=0;entryY=0.5;');
  e('t3-x17', S['edge-leader'], 't3-note1', 't3-pub', '', 'exitX=0;exitY=0.5;entryX=1;entryY=0.5;');

  return render('tier3-complex', 2560, 1440);
}

/* -------------------------------------------------- style palette + library */

const PALETTE = [
  ['zone-platform', 'Databricks platform boundary', 260, 120, '[Databricks Data Intelligence Platform]'],
  ['zone-external', 'Zone outside Databricks', 260, 120, '[Data sources]'],
  ['zone-owned', 'Databricks zone outside the platform', 260, 120, '[Databricks Apps]'],
  ['panel-group', 'Capability group', 260, 120, '[Capability group]'],
  ['panel-plain', 'Unlabelled dashed group', 260, 120, ''],
  ['bar-lava', 'Platform title bar', 260, 44, '[Platform title]'],
  ['bar-navy', 'Section header bar', 260, 44, '[Section header]'],
  ['bar-oat', 'External zone header bar', 260, 44, '[External header]'],
  ['node-platform', 'Databricks component', 180, 70, '[Process step]'],
  ['node-external', 'Non-Databricks system', 180, 70, '[External system]'],
  ['node-capability', 'Capability, icon over label', 140, 60, '[Capability]'],
  ['node-decision', 'Decision', 180, 90, '[Decision?]'],
  ['node-store', 'Data store', 180, 100, '[Data store]'],
  ['node-manual', 'Manual or offline step', 180, 70, '[Manual step]'],
  ['ring-bronze', 'Bronze layer', 110, 110, 'Bronze'],
  ['ring-silver', 'Silver layer', 110, 110, 'Silver'],
  ['ring-gold', 'Gold layer', 110, 110, 'Gold'],
  ['badge-step', 'Step marker', 32, 32, '1'],
  ['note-callout', 'Annotation', 220, 90, '[Annotation]'],
  ['legend-box', 'Legend box', 220, 90, 'Legend'],
  ['footer-strip', 'Version and footer strip', 260, 40, '[Project] · v[0.1]'],
  ['text-title', 'Diagram title', 260, 32, '[Diagram title]'],
  ['text-subtitle', 'Diagram subtitle', 260, 22, '[Subtitle]'],
];

const EDGE_PALETTE = [
  ['edge-flow', 'Primary flow'],
  ['edge-secondary', 'Secondary or return path'],
  ['edge-derived', 'Derived or logical flow'],
  ['edge-two-way', 'Two-way exchange'],
  ['edge-labelled', 'Labelled branch'],
  ['edge-step', 'Short straight step'],
  ['edge-leader', 'Annotation leader'],
];

function palette() {
  reset();
  v('p-title', 'Databricks architecture — style palette', S['text-title'], 40, 30, 900, 32);
  v('p-sub', 'Copy a shape, then use Edit > Copy Style and Edit > Paste Style to apply it elsewhere.', S['text-subtitle'], 40, 64, 900, 20);
  v('p-rule', '', S['rule-lava'], 40, 92, 1120, 4);

  let y = 130;
  PALETTE.forEach(([key, label, w, h, value], i) => {
    const col = i % 3;
    const rowIdx = Math.floor(i / 3);
    const x = 40 + col * 380;
    const yy = 130 + rowIdx * 190;
    v(`p-s${i + 1}`, value, S[key], x, yy, w, h);
    v(`p-l${i + 1}`, `${key} — ${label}`, S['legend-label'], x, yy + 140, 340, 24);
    y = yy;
  });

  let ey = y + 220;
  EDGE_PALETTE.forEach(([key, label], i) => {
    const yy = ey + i * 60;
    v(`p-ea${i + 1}`, '', `${S['node-external']}opacity=0;`, 40, yy, 10, 10);
    v(`p-eb${i + 1}`, '', `${S['node-external']}opacity=0;`, 300, yy, 10, 10);
    e(`p-ee${i + 1}`, S[key], `p-ea${i + 1}`, `p-eb${i + 1}`, '', 'exitX=1;exitY=0.5;entryX=0;entryY=0.5;');
    v(`p-el${i + 1}`, `${key} — ${label}`, S['legend-label'], 340, yy - 10, 400, 30);
  });

  return render('style-palette', 1200, ey + EDGE_PALETTE.length * 60 + 80);
}

function library() {
  const entries = [];
  for (const [key, label, w, h, value] of PALETTE) {
    const xml =
      `<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/>` +
      `<mxCell id="2" value="${esc(value)}" style="${esc(S[key])}" vertex="1" parent="1">` +
      `<mxGeometry x="0" y="0" width="${w}" height="${h}" as="geometry"/></mxCell>` +
      `</root></mxGraphModel>`;
    entries.push({ xml, w, h, aspect: 'fixed', title: `${label} (${key})` });
  }
  for (const [key, label] of EDGE_PALETTE) {
    const xml =
      `<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/>` +
      `<mxCell id="2" value="" style="${esc(S[key])}" edge="1" parent="1">` +
      `<mxGeometry relative="1" as="geometry">` +
      `<mxPoint x="0" y="0" as="sourcePoint"/><mxPoint x="160" y="0" as="targetPoint"/>` +
      `</mxGeometry></mxCell></root></mxGraphModel>`;
    entries.push({ xml, w: 160, h: 10, title: `${label} (${key})` });
  }
  /* The JSON sits in the text of the element, so `<`, `>` and `&` must be escaped.
     Without that the file is not well-formed XML and draw.io refuses to open it. */
  return `<mxlibrary title="Databricks Brand Styles">${escText(JSON.stringify(entries))}</mxlibrary>\n`;
}

/* ------------------------------------------------------------- validation */

function validate(name, xml) {
  const problems = [];
  const ids = [...xml.matchAll(/<mxCell id="([^"]+)"/g)].map((m) => m[1]);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) problems.push(`duplicate ids: ${[...new Set(dupes)].join(', ')}`);

  const known = new Set(ids);
  for (const m of xml.matchAll(/parent="([^"]+)"/g)) {
    if (!known.has(m[1])) problems.push(`parent ${m[1]} does not exist`);
  }
  for (const m of xml.matchAll(/source="([^"]+)" target="([^"]+)"/g)) {
    if (!known.has(m[1])) problems.push(`edge source ${m[1]} does not exist`);
    if (!known.has(m[2])) problems.push(`edge target ${m[2]} does not exist`);
  }

  /* every style key must be on the allow list */
  const ALLOWED = new Set(
    ('rounded whiteSpace html fillColor strokeColor strokeWidth dashed dashPattern fixDash ' +
      'align verticalAlign fontSize fontStyle fontColor fontFamily fontSource container collapsible ' +
      'swimlane startSize horizontal swimlaneFillColor shape perimeter image imageAspect aspect ' +
      'verticalLabelPosition labelPosition spacing spacingLeft spacingTop size boundedLbl ' +
      'backgroundOutline edgeStyle jettySize orthogonalLoop endArrow endFill startArrow startFill ' +
      'exitX exitY entryX entryY labelBackgroundColor opacity shadow text ellipse rhombus arcSize ' +
      'absoluteArcSize curved').split(' ')
  );
  for (const m of xml.matchAll(/style="([^"]*)"/g)) {
    for (const pair of m[1].split(';')) {
      if (!pair) continue;
      const key = pair.split('=')[0];
      if (!ALLOWED.has(key)) problems.push(`unknown style key "${key}"`);
    }
  }

  /* geometry: children inside their parent, no sibling overlap */
  const cellRe = /<mxCell id="([^"]+)"[^>]*parent="([^"]+)"[^>]*>\s*<mxGeometry x="(-?\d+)" y="(-?\d+)" width="(\d+)" height="(\d+)"/g;
  const box = {};
  for (const m of xml.matchAll(cellRe)) {
    box[m[1]] = { parent: m[2], x: +m[3], y: +m[4], w: +m[5], h: +m[6] };
  }
  for (const [id, b] of Object.entries(box)) {
    const p = box[b.parent];
    if (p && (b.x < 0 || b.y < 0 || b.x + b.w > p.w || b.y + b.h > p.h)) {
      problems.push(`${id} sits outside its parent ${b.parent}`);
    }
  }
  const skip = (id) => /-(b\d+|rule|note\d+|lsw|ltx)/.test(id) || /-b\d+$/.test(id);
  const bySib = {};
  for (const [id, b] of Object.entries(box)) (bySib[b.parent] ||= []).push([id, b]);
  for (const list of Object.values(bySib)) {
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const [ia, a] = list[i];
        const [ib, bb] = list[j];
        if (skip(ia) || skip(ib)) continue;
        const hit = a.x < bb.x + bb.w && bb.x < a.x + a.w && a.y < bb.y + bb.h && bb.y < a.y + a.h;
        if (hit) problems.push(`${ia} overlaps ${ib}`);
      }
    }
  }

  return problems;
}

/* ---------------------------------------------------------------- exports */

/** The generated guide that ships next to the files. */
function readme() {
  const rows = Object.entries(STYLES)
    .map(([k, v]) => `| \`${k}\` | \`${v}\` |`)
    .join('\n');
  return `# Databricks architecture templates for draw.io

Three templates, a shape library of the 71 icons, a shape library of the brand styles, and a
style palette. All of it follows one brand system, taken from the Databricks solution
architecture diagrams.

## The files

| File | What it is |
|---|---|
| \`template-simple.drawio\` | 5 nodes, one linear flow, title block. 1200 x 380 |
| \`template-standard.drawio\` | 14 nodes, every shape in the legend, a branch, three zones, a legend box. 1600 x 900 |
| \`template-complex.drawio\` | 42 nodes, five zones, every connector variant, annotations, legend, footer strip. 2560 x 1440 |
| \`databricks-architecture-icons.xml\` | a shape library of all 71 product icons |
| \`databricks-brand-styles.xml\` | a shape library of the ${Object.keys(STYLES).length} brand styles |
| \`databricks-templates.xml\` | a shape library holding the three templates. Drag one onto a blank page |
| \`style-palette.drawio\` | one labelled example of every style, for Copy Style and Paste Style |

## Open a template

1. Open [app.diagrams.net](https://app.diagrams.net) or the desktop application.
2. Select **File > Open From > Device**.
3. Select the template you want.

## Install a shape library

Select **File > Open Library from > Device**, then select the \`.xml\` file. A new section
appears in the shape panel. Drag a shape onto the canvas and it arrives with the brand style
already on it.

## Apply a style to a shape you already have

Open \`style-palette.drawio\`, select the swatch you want and press Ctrl+C. Go to your diagram,
select your shape, then **Edit > Paste Style**. Or copy a string from the table below, select
your shape, press Ctrl+E and replace the text.

## What to change

1. **Every label in square brackets.** They are placeholders. Replace all of them.
2. **The title block**, and the footer strip in the complex template.
3. **Delete a zone you do not use.** Do not recolour one.
4. **The icons.** Each capability node names an icon in its \`image=\` key. Change the slug.
   \`catalog.json\` lists all ${71} slugs.

## The rule that matters

**Lava \`${TOKENS['brand-lava']}\` marks Databricks. Oat \`${TOKENS['surface-oat-line']}\` marks
everything that is not Databricks.** Every other rule supports that one.

## Colour tokens

| Token | Hex |
|---|---|
${Object.entries(TOKENS).map(([k, v]) => `| \`${k}\` | \`${v}\` |`).join('\n')}

## Style strings

| Name | draw.io style string |
|---|---|
${rows}
`;
}

/** The templates as a shape library, so one clibs link loads them with the rest.
 *  draw.io only promises to fetch a URL for a short allow list of domains, and
 *  clibs is the mechanism its own library index uses. Shipping the templates
 *  this way avoids a second, less-travelled code path. */
function templateLibrary() {
  const model = (xml) => xml.slice(xml.indexOf('<mxGraphModel'), xml.indexOf('</mxGraphModel>') + 15);
  const entries = [
    ['Simple template — 5 nodes, one flow', tier1(), 1200, 380],
    ['Standard template — 14 nodes, every shape', tier2(), 1600, 900],
    ['Complex template — 42 nodes, five zones', tier3(), 2560, 1440],
  ].map(([title, xml, w, h]) => ({ xml: model(xml), w, h, title }));
  return `<mxlibrary title="Databricks Templates">${escText(JSON.stringify(entries))}</mxlibrary>\n`;
}

/** Every file that belongs in `drawio/`, keyed by file name. */
export function drawioFiles() {
  return {
    'template-simple.drawio': tier1(),
    'template-standard.drawio': tier2(),
    'template-complex.drawio': tier3(),
    'style-palette.drawio': palette(),
    'databricks-brand-styles.xml': library(),
    'databricks-templates.xml': templateLibrary(),
    'README.md': readme(),
  };
}

export { validate as validateDrawio, escText as escapeXmlText };
