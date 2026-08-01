# How the draw.io libraries and templates were made, and how to do it again

This folder holds four shape libraries, three templates, a style palette and a generated guide.
`tools/drawio-templates.mjs` produces all of it and `tools/build.mjs` writes it out.

The style system is not invented. It is measured from the solution architecture diagrams that
Databricks publishes.

---

## 1. The prompts

Three steps, three prompts. Run them in order.

### Step 1 — collect the source diagrams

> Using a browser, go to <https://www.databricks.com/resources/architectures> and download each
> solution architecture diagram to a local folder, with its description. Create a manifest that
> records the original source of every file.

This produced 15 architecture diagrams and 14 comparison tables from 18 pages. Keep the two
apart: most of the data-model pages give tables, not diagrams, and a table is not a template.

### Step 2 — read the diagrams

> You are a visual design analyst. Produce a detailed design pattern specification for each
> diagram, precise enough that a reader can recreate it from your documentation alone.
>
> PASS 1: Identification — type, dimensions, aspect ratio, subject, reading direction.
> PASS 2: Layout — zones, grid, bands, spacing, alignment.
> PASS 3: Shapes — every shape, its meaning, corner radius, border, fill, default size.
> PASS 4: Connectors — line style, arrowhead, weight, color, what they attach to.
> PASS 5: Color — every hex value, sampled, and the meaning it carries.
> PASS 6: Typography — size, weight, case, color, alignment, per text role.
> PASS 7: Icons — style, stroke, size, placement, and third-party marks.
> PASS 8: Replication recipe — numbered steps to rebuild the diagram from an empty canvas.
>
> End with a cross-diagram summary. Be exhaustive and literal. Do not summarize or skip "obvious"
> details. Estimated measurements are fine, but always give them. If you cannot determine
> something from the image, say so explicitly rather than guessing silently.

Two instructions in that prompt do the heavy lifting:

- **"always give them"** stops the answer becoming "a medium blue". Every value is a number.
- **"say so explicitly rather than guessing silently"** produces the list of things nobody can
  know from a raster export, such as the font family.

Measure, do not eyeball. Sample hex values from the pixels. Find zone edges by scanning for
vertical rules. Count stroke widths in pixels at the native canvas width. Say which values are
measured and which are estimated.

### Step 3 — turn the reading into a system

> You are a draw.io template engineer. Merge the design specifications into a single, unified
> brand system, then produce ready-to-use branded templates at three complexity tiers.
>
> Where the diagrams conflict, pick the most common variant, and log every conflict and your
> resolution in a "Decisions" table.
>
> Output color tokens (name, hex, semantic meaning), a shape legend (shape, meaning, fill token,
> stroke token, stroke width, corner radius, default size), a connector legend (line style,
> arrowhead name, weight, color token, meaning), and typography per text role.
>
> Then write the exact draw.io style string for every entry. Use real draw.io style keys only. Do
> not invent keys.
>
> Tier 1, Simple: 4 to 6 placeholder nodes, one linear flow, title block.
> Tier 2, Standard: 8 to 15 nodes covering every shape in the legend, decision branching,
> grouped zones, a legend box.
> Tier 3, Complex: multi-zone layout matching the documented layout system, 20+ nodes, all
> connector variants, annotations, title block, legend, and a version/footer strip.
>
> Every element must use the style strings. No default draw.io styling anywhere. Use placeholder
> text like "[Process step]". Align to the grid. IDs must be unique. Edges must reference source
> and target node IDs, not floating coordinates.
>
> If any documented brand detail cannot be expressed in draw.io, say so explicitly and give the
> closest achievable approximation.

The last line matters more than it looks. It turns "the icons are the wrong color" from a defect
into a documented limit.

---

## 2. The system that came out

The full guide is generated into `drawio/README.md`. The one rule to keep:

> **Lava `#FF5F46` marks Databricks. Oat `#D9D7CE` marks everything else.**

Twelve of the fifteen diagrams follow one master template. Three data-model diagrams use a
completely different visual language — oat background, rounded corners, solid fills, no icons.
They are not merged in. A replica of one must not borrow from the other.

Conflicts are settled by count: the variant that appears in more diagrams wins. Each decision is
logged with the reason.

---

## 3. Build

```bash
node tools/build.mjs
```

`tools/drawio-templates.mjs` holds the tokens, the style strings and the three tier layouts. It
touches no files. It returns a map of file name to content. The build validates each file, then
writes it.

### 3.1 What the validator checks

A malformed template opens as an empty page with no error, so the build checks it instead:

- every id is unique
- every `parent` names a cell that exists
- every edge names a `source` and a `target` that exist
- every style key is a real draw.io key, from an allow list
- every child sits inside the bounds of its parent
- no two siblings overlap

The build fails on any of these.

### 3.2 What the validator cannot check

**Whether it looks right.** Render the templates and look at them. The draw.io static viewer does
this, and it needs no application:

```bash
curl -sO https://viewer.diagrams.net/js/viewer-static.min.js
# a page that reads the XML and calls GraphViewer.processElements(), then screenshot it
```

That step caught two defects that the validator passed. Icon labels went over the border of their
panel. Two edges crossed a header bar and struck through its text.

---

## 4. Traps that cost time

1. **An `mxlibrary` file must be well-formed XML.** draw.io parses it with an XML parser. The JSON
   sits in the element text, so `<`, `>` and `&` must be escaped. jgraph documents this: *"For
   uncompressed `xml` properties, `<` must be written as `&lt;`, `>` must be written as `&gt;`"*.
   An early version wrote them raw. `DOMParser` returned a parse error and the import did nothing,
   with no message. Test it:

   ```js
   const doc = new DOMParser().parseFromString(text, 'text/xml');
   doc.getElementsByTagName('parsererror').length === 0   // must be true
   JSON.parse(doc.getElementsByTagName('mxlibrary')[0].textContent).length
   ```

2. **Give `mxlibrary` a `title` attribute.** draw.io reads it to name the section in the shape
   panel. Without it the name falls back to a file name.

3. **draw.io fetches only four domains directly**: `raw.githubusercontent.com`,
   `icons.diagrams.net` and the two Google Fonts hosts. Everything else goes through
   `app.diagrams.net/proxy`. Both work, but a raw URL removes the hop. The `clibs` parameter takes
   a semicolon-separated list, each entry prefixed with `U`:

   ```
   https://app.diagrams.net/?splash=0&clibs=U<encoded>;U<encoded>;U<encoded>
   ```

4. **Ship a template as a library entry, not only as a file.** `clibs` is the mechanism draw.io
   documents and it is well travelled. Opening a diagram from a URL with `#U<encoded>` is a
   different, less-used path.

5. **Headless Chrome cannot verify a draw.io link.** The shape panel does not render, and a
   known-good link from the index that jgraph publishes fails the same way. If a headless test
   fails, test the
   file, not the page: fetch it, parse it the way draw.io does, and count the entries.

6. **`imageAspect=1` on an icon node.** With `imageAspect=0`, the label is only as wide as the
   icon, and a two-word label overflows the panel below it. Make the box wider than the icon and
   set `imageAspect=1`: the icon stays square and centered, and the label gets the full width.

7. **`fixDash=1`** makes `dashPattern=6 4` mean 6 points on and 4 off whatever the stroke width.
   Without it draw.io scales the dash by the stroke width.

---

## 5. What draw.io cannot do

Stated in full in `drawio/README.md`. The short list:

| Wanted | Why not | Shipped instead |
|---|---|---|
| Navy line-art icons | no navy set is published. The mono set uses `fill="currentColor"`, which does not resolve inside a draw.io image cell | the official lava icons |
| A named style registry | draw.io has no global named style. A style is a string on a cell | a shape library and a palette page |
| The Databricks mark on the platform header | the mark is lava on a transparent field and disappears on a lava bar. No white variant is published | the words only |
| Type that scales with the canvas | draw.io font size is absolute | a fixed scale, with the ratios between roles kept |

---

## 6. Change something

| Goal | Do this |
|---|---|
| A color, a style string, a template layout | edit `tools/drawio-templates.mjs`, then rebuild |
| The icon library | edit `tools/products.mjs`, then rebuild |
| The guide in `drawio/README.md` | it is generated. Edit the `readme()` function |

After any change: rebuild, then render the three templates and look at them.
