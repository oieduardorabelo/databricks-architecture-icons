# Databricks Architecture Icons

Build architecture diagrams with official Databricks artwork. 71 products in 8 categories, five
file variants for each, plus packs for Mermaid and draw.io.

**Website: <https://oieduardorabelo.github.io/databricks-architecture-icons/>**

Browse the icons, search them, and download what you need there. This file covers the repository.

> **Unofficial.** An independent community set. Databricks does not sponsor or endorse it.

![Every icon in the library, in category groups](preview.png)

---

## Where the artwork comes from

Every icon is an official Databricks SVG file. Nothing is redrawn or traced. `icons/sources/`
holds each original file next to [a manifest](icons/sources/MANIFEST.md) that gives its source URL.

The build applies four mechanical transforms and makes no other change:

- It fits each file into a padded 48x48 canvas.
- It adds the product slug to every internal id.
- It recolors the mono and tile variants.
- It removes a full-bleed white background plate.

The Databricks logo mark never goes to the recolor step. The brand guidelines forbid it.

[The website explains each transform, the color choices, and the
terms.](https://oieduardorabelo.github.io/databricks-architecture-icons/#provenance)

---

## Layout

```
icons/       the artwork, the source files and the catalog
mermaid/     two Iconify packs and the demo page
drawio/      three shape libraries, three templates and a style palette
zips/        one archive for each collection and each category
tools/       the product list and the build script
index.html   the website
```

Each of the three folders holds a `HANDOVER.md`. It gives the prompt and the steps that made the
folder, so you can repeat the work or extend it.

| Folder | Read this |
|---|---|
| `icons/` | [HANDOVER.md](icons/HANDOVER.md) - how the artwork was found, downloaded and built |
| `mermaid/` | [HANDOVER.md](mermaid/HANDOVER.md) - how the Iconify packs were made |
| `drawio/` | [HANDOVER.md](drawio/HANDOVER.md) - how the brand system and the templates were made |

### Inside `icons/`

`tile` and `outline` are the two boxed variants. A tile puts a white glyph on the category color,
so the color says which category the product is in. An outline puts the artwork in a white box
with a lava hairline, so it reads on a light background and on a dark one.

| Directory | Holds |
|---|---|
| `svg/` | the published artwork. Use this one |
| `svg-mono/` | one color, `fill="currentColor"`, for a theme |
| `svg-tile/` | a white glyph on a category-colored rounded square |
| `svg-outline/` | the artwork in a white rounded square with a lava hairline |
| `png/`, `png-tile/`, `png-outline/` | 256px, for a tool that rejects SVG |
| `logos/` | full-color brand lockups |
| `sources/` | the original Databricks files and their manifest |
| `catalog.json`, `catalog.csv`, `CATALOG.md` | the index, for a program and for a person |

---

## Use the icons

### Mermaid

You do not download anything. The packs are hosted, and the server permits any origin.

```js
const PACKS = 'https://oieduardorabelo.github.io/databricks-architecture-icons/mermaid';

mermaid.registerIconPacks([
  { name: 'databricks-color', loader: () => fetch(`${PACKS}/databricks-color.json`).then((r) => r.json()) },
  { name: 'databricks',       loader: () => fetch(`${PACKS}/databricks.json`).then((r) => r.json()) },
]);
```

Then write an icon as `databricks-color:<slug>`.

**[The demo page](https://oieduardorabelo.github.io/databricks-architecture-icons/mermaid/)** gives
live diagrams, the full setup, and every icon drawn by Mermaid.

### draw.io

**[Open draw.io with the libraries loaded](https://app.diagrams.net/?splash=0&clibs=Uhttps%3A%2F%2Fraw.githubusercontent.com%2Foieduardorabelo%2Fdatabricks-architecture-icons%2Fmain%2Fdrawio%2Fdatabricks-architecture-icons.xml;Uhttps%3A%2F%2Fraw.githubusercontent.com%2Foieduardorabelo%2Fdatabricks-architecture-icons%2Fmain%2Fdrawio%2Fdatabricks-brand-styles.xml;Uhttps%3A%2F%2Fraw.githubusercontent.com%2Foieduardorabelo%2Fdatabricks-architecture-icons%2Fmain%2Fdrawio%2Fdatabricks-templates.xml)**

One click loads three shape libraries: the 71 icons, 30 brand styles, and the three templates.
Drag a template onto an empty page. [drawio/README.md](drawio/README.md) gives every color token
and every style string.

### Other tools

Drag the files from `icons/svg/` onto the canvas. Miro, Lucidchart, Excalidraw, Figma, Keynote and
PowerPoint keep the vector data. Google Slides is the exception: use `icons/png/`.

A renderer that you do not control, such as a GitHub README, removes an image from a diagram node.
Put the icons near the diagram and not in it. A Markdown table of `icons/svg-tile/` images always
works. The build makes `icons/CATALOG.md` in this way.

---

## Build it

```bash
node tools/build.mjs
```

`tools/products.mjs` is the only file written by hand. It holds one entry for each product. The
build reads `icons/sources/` and makes everything else, then checks the result. It stops if a
category tile is below the WCAG contrast floor of 3:1, or if a draw.io template has a bad
reference.

`sharp` renders the PNG files. It is optional, because the PNG files are in the repository. Without
`sharp` the build keeps them and prints a message.

To add a product, read [icons/HANDOVER.md](icons/HANDOVER.md).

---

## Limits

- **The product list is a snapshot.** The research used databricks.com and docs.databricks.com in
  August 2026. Databricks releases new products frequently. Make sure that the names are current
  before you publish a diagram.
- **Some product-to-icon assignments are an interpretation.** Databricks does not publish a mark
  for every product. Some entries use the nearest icon from the Databricks set. The `source` field
  in `icons/catalog.json` always gives the exact file.
- **`apache-spark` and `apache-iceberg` are wide lockups.** In a square canvas they get a border on
  the top and the bottom. They are correct at diagram size, because a diagram node is wider than it
  is high.

---

## Terms

Databricks, the Databricks logo and the product names are trademarks of Databricks, Inc. Apache
Spark and Apache Iceberg are trademarks of the Apache Software Foundation. Mermaid and draw.io are
the marks of their own projects.

This project claims no rights over the artwork. It gives the artwork the structure that a diagram
tool needs. Read the Databricks brand guidelines before you use a mark in a commercial document.
The code in `tools/` is free to use.
