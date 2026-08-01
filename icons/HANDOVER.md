# How the icon set was made, and how to do it again

This folder holds 71 product icons in five variants, the eight brand lockups, and the original
Databricks files they came from. Nothing here is drawn by hand. Every file starts as an SVG that
Databricks publishes.

Read this before you add a product, refresh the artwork, or repeat the work for another vendor.

---

## 1. The prompt

The work started from one request. Keep it, because it sets the rule that everything else follows.

> Deep research Databricks products. I want to create a library of:
> 1. product name
> 2. short description
> 3. high quality icon for diagram usage (Mermaid, Miro, Lucidchart and so on)
>
> Download the icons from Databricks, or resize their images. Do not create new logos.
> Use the Databricks brand guidelines: <https://brandguides.brandfolder.com/databricks-extended-brand-guidelines>

The second paragraph is the whole method. **A redrawn icon is a wrong icon.** If a product has no
official mark, it gets no icon.

---

## 2. Find the artwork

Databricks does not publish an icon set as a download. The files are on the marketing site, one
at a time, inside product pages.

### 2.1 Collect the pages

```bash
# the product index and the platform pages
curl -s https://www.databricks.com/product/ > /tmp/index.html
grep -o 'href="/product/[^"]*"' /tmp/index.html | sort -u
```

Fetch each product page. Also fetch the solutions pages and the glossary pages: several marks
appear only there.

### 2.2 Pull every SVG reference

```bash
grep -o 'https://www.databricks.com/sites/default/files/[^"]*\.svg' page.html | sort -u
```

Three naming families carry the product marks. Nothing else on the site is a product icon.

| Pattern | What it is |
|---|---|
| `icon-*.svg` | the older product icon set |
| `primary-icon-orange-*.svg` | the current Lava line-icon set |
| `*Icon.svg` | one-off marks, camel case, orange outline |

That search found 155 files. Download all of them. Sort them later.

### 2.3 Look at them before you map them

This step is not optional, and skipping it caused the worst mistakes in the first attempt. A file
name does not tell you what a mark shows. `primary-icon-orange-automation.svg` is the Terraform
mark. `codeIcon.svg` is the IDE mark.

Render every downloaded file into one sheet and look at it:

```bash
# a contact sheet of every source file, 8 to a row
montage icons/sources/*.svg -tile 8x -geometry 96x96+8+8 -background white /tmp/sheet.png
```

Map file to product only after you have seen the drawing.

### 2.4 Record where each file came from

Write `icons/sources/MANIFEST.md` as you download, one row per file: the file name, the product it
belongs to, and the full source URL. `tools/build.mjs` parses this file and copies the URL into
`catalog.json`, so anybody can check any icon against its origin. A file with no manifest row gets
no provenance, and the claim on the website stops being true.

---

## 3. Choose one visual family

The 155 files are not one set. They are several sets from several years. Mixing them gives a
library that looks wrong at a glance.

Two candidates existed:

| Set | Style | Verdict |
|---|---|---|
| The Lava line icons on databricks.com | line art, no fill, one weight | **chosen** |
| The DuBois design-system glyphs | solid, 16px, UI-sized | rejected |

DuBois is built for buttons and menus. At diagram size the solid glyphs read as blobs next to the
line icons. One family, or the set looks assembled rather than designed.

---

## 4. Write the catalog

`tools/products.mjs` is the only hand-written file in the pipeline. One entry per product:

```js
{
  slug: 'lakeflow-connect',
  name: 'Lakeflow Connect',
  aka: null,
  desc: 'Managed connectors that land data from a SaaS application or a database.',
  category: 'engineering',
  docs: 'https://www.databricks.com/product/lakeflow-connect',
  src: 'primary-icon-orange-data-ingestion',   // the file in icons/sources, with no .svg
}
```

Rules that matter:

- `slug` is the file name everywhere: `icons/svg/<slug>.svg`, the Iconify id, the Lucidchart
  search key. Change a slug and you break every one of those.
- `desc` is one sentence, and it says what the product does, not what the category is.
- `kind: 'logo'` marks the Databricks mark itself. The build never recolors it. The brand
  guidelines forbid it, and the first version of this project broke that rule.

---

## 5. Build

```bash
node tools/build.mjs
```

It reads `icons/sources/`, applies four mechanical transforms, and writes everything else. It
makes no other change.

| Step | What it does | Why |
|---|---|---|
| Fit | scales each file into a padded 48x48 canvas, aspect kept | the source files have several viewBoxes |
| Namespace | adds the slug to every internal id, `url(#…)` and CSS class | else two icons on one page collide |
| Recolor | separates three color roles: foreground, light tint, white plate | for the mono and tile variants |
| Strip plate | removes a full-bleed white background rectangle | a white plate looks like an opaque box on a dark diagram |

The build fails if a category tile drops below the WCAG 2.2 contrast floor of 3:1 for white text.

### 5.1 What comes out

| Directory | Holds |
|---|---|
| `icons/svg/` | the published artwork, fitted and namespaced. Nothing else changed |
| `icons/svg-mono/` | one color, `fill="currentColor"`, for theming |
| `icons/svg-tile/` | a white glyph on a category-colored rounded square |
| `icons/svg-outline/` | the artwork in a white box with a 1 px lava hairline |
| `icons/png/`, `icons/png-tile/`, `icons/png-outline/` | 256px, for tools that reject SVG |
| `icons/logos/` | full-color brand lockups, copied through untouched |
| `icons/catalog.json`, `.csv`, `CATALOG.md` | the machine-readable and human-readable index |

### 5.2 Why two boxed variants

A **tile** puts a white glyph on the category color. The color carries the category, which helps in
a grid or a legend. On a dark canvas the solid color goes muddy.

An **outline** puts the artwork in a white box with a 1 px lava hairline. The Databricks community
uses this pattern often. It reads the same on a light background and on a dark one, so it suits a
diagram that you do not control. `OUTLINE` in `tools/build.mjs` holds the four numbers: stroke 1,
radius 10, icon scale 62 %, color `#FF3621`. Four candidates were built and compared at 1, 2, 3
and 4 px. The hairline won.

`sharp` renders the PNG files. It is optional: the PNG files are committed, and the build keeps
them when `sharp` is missing. It checks the disk, not whether `sharp` loaded. An earlier version
conflated the two and silently stripped every PNG reference from a published page while the files
sat untouched on disk.

---

## 6. Traps that cost time

- **The largest image on a page is not the product icon.** It is the promotional banner. Match the
  file name against the product slug instead.
- **A product page can carry the icon of a different product.** A related-products strip does
  this. Trust an image only when the page uses it for itself.
- **A page description is not in the first paragraph.** Read `og:description`. The visible text at
  the top of the page is often a navigation menu.
- **`fill="currentColor"` does not resolve everywhere.** It works in HTML and in Mermaid. It does
  not work inside a draw.io image cell, which renders the icon black or empty.
- **Check a clip path after any transform.** An early version of the recolor step emptied every
  `<clipPath>` rectangle, which clipped whole icons away. The fix is a guard that never touches the
  contents of `defs`, `clipPath`, `mask`, `pattern`, `filter`, a gradient or `symbol`.

---

## 7. Add one product

1. Find the official SVG on databricks.com. If there is none, stop. Do not draw one.
2. Save it to `icons/sources/` under the file name Databricks uses.
3. Add a row to `icons/sources/MANIFEST.md` with the source URL.
4. Add an entry to `tools/products.mjs`.
5. Run `node tools/build.mjs`.
6. Open `index.html` and look at the new tile. Check that the mark is not a blob and that the
   label is right.
