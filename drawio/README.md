# Databricks architecture templates for draw.io

Three templates, a shape library of the 71 icons, a shape library of the brand styles, and a
style palette. All of it follows one brand system, taken from the Databricks solution
architecture diagrams.

## The files

| File | What it is |
|---|---|
| `template-simple.drawio` | 5 nodes, one linear flow, title block. 1200 x 380 |
| `template-standard.drawio` | 14 nodes, every shape in the legend, a branch, three zones, a legend box. 1600 x 900 |
| `template-complex.drawio` | 42 nodes, five zones, every connector variant, annotations, legend, footer strip. 2560 x 1440 |
| `databricks-architecture-icons.xml` | a shape library of all 71 product icons |
| `databricks-architecture-icons-outline.xml` | the same 71 icons, each in a white box with a lava hairline |
| `databricks-brand-styles.xml` | a shape library of the 32 brand styles |
| `databricks-templates.xml` | a shape library holding the three templates. Drag one onto a blank page |
| `style-palette.drawio` | one labeled example of every style, for Copy Style and Paste Style |

## Open a template

1. Open [app.diagrams.net](https://app.diagrams.net) or the desktop application.
2. Select **File > Open From > Device**.
3. Select the template you want.

## Install a shape library

Select **File > Open Library from > Device**, then select the `.xml` file. A new section
appears in the shape panel. Drag a shape onto the canvas and it arrives with the brand style
already on it.

## Apply a style to a shape you already have

Open `style-palette.drawio`, select the swatch you want and press Ctrl+C. Go to your diagram,
select your shape, then **Edit > Paste Style**. Or copy a string from the table below, select
your shape, press Ctrl+E and replace the text.

## What to change

1. **Every label in square brackets.** They are placeholders. Replace all of them.
2. **The title block**, and the footer strip in the complex template.
3. **Delete a zone you do not use.** Do not recolor one.
4. **The icons.** Each capability node names an icon in its `image=` key. Change the slug.
   `catalog.json` lists all 71 slugs.

## The rule that matters

**Lava `#FF5F46` marks Databricks. Oat `#D9D7CE` marks
everything that is not Databricks.** Every other rule supports that one.

## Color tokens

| Token | Hex |
|---|---|
| `brand-lava` | `#FF5F46` |
| `brand-lava-deep` | `#FF3621` |
| `brand-lava-tint` | `#FABFBA` |
| `ink-navy` | `#143D4A` |
| `ink-navy-deep` | `#1B3139` |
| `ink-navy-soft` | `#618794` |
| `line-slate` | `#A9B8BD` |
| `surface-oat-line` | `#D9D7CE` |
| `surface-oat` | `#EEEDE9` |
| `surface-oat-light` | `#F9F7F4` |
| `surface-white` | `#FFFFFF` |
| `accent-green` | `#71C5AD` |
| `store-bronze` | `#B7584B` |
| `store-silver` | `#A7B7BB` |
| `store-gold` | `#A1670F` |

## Style strings

| Name | draw.io style string |
|---|---|
| `text-title` | `text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=18;fontStyle=1;fontColor=#1B3139;fontFamily=DM Sans;fontSource=https%3A%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3DDM%2BSans%3A400%2C500%2C700;` |
| `text-subtitle` | `text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=11;fontStyle=0;fontColor=#618794;fontFamily=DM Sans;fontSource=https%3A%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3DDM%2BSans%3A400%2C500%2C700;` |
| `rule-lava` | `rounded=0;html=1;fillColor=#FF5F46;strokeColor=none;` |
| `zone-platform` | `swimlane;html=1;whiteSpace=wrap;startSize=52;horizontal=1;fillColor=#FF5F46;swimlaneFillColor=#FFFFFF;strokeColor=#FF5F46;strokeWidth=4;fontColor=#FFFFFF;fontSize=18;fontStyle=1;align=center;verticalAlign=middle;container=1;collapsible=0;fontFamily=DM Sans;fontSource=https%3A%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3DDM%2BSans%3A400%2C500%2C700;` |
| `zone-external` | `swimlane;html=1;whiteSpace=wrap;startSize=44;horizontal=1;fillColor=#D9D7CE;swimlaneFillColor=#FFFFFF;strokeColor=#D9D7CE;strokeWidth=2;fontColor=#1B3139;fontSize=14;fontStyle=1;align=center;verticalAlign=middle;container=1;collapsible=0;fontFamily=DM Sans;fontSource=https%3A%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3DDM%2BSans%3A400%2C500%2C700;` |
| `zone-owned` | `swimlane;html=1;whiteSpace=wrap;startSize=44;horizontal=1;fillColor=#143D4A;swimlaneFillColor=#FFFFFF;strokeColor=#143D4A;strokeWidth=2;fontColor=#FFFFFF;fontSize=14;fontStyle=1;align=center;verticalAlign=middle;container=1;collapsible=0;fontFamily=DM Sans;fontSource=https%3A%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3DDM%2BSans%3A400%2C500%2C700;` |
| `panel-group` | `swimlane;html=1;whiteSpace=wrap;startSize=38;horizontal=1;fillColor=#143D4A;swimlaneFillColor=#FFFFFF;strokeColor=#143D4A;strokeWidth=2;dashed=1;dashPattern=6 4;fixDash=1;fontColor=#FFFFFF;fontSize=13;fontStyle=1;align=center;verticalAlign=middle;container=1;collapsible=0;fontFamily=DM Sans;fontSource=https%3A%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3DDM%2BSans%3A400%2C500%2C700;` |
| `panel-plain` | `rounded=0;html=1;whiteSpace=wrap;fillColor=none;strokeColor=#143D4A;strokeWidth=2;dashed=1;dashPattern=6 4;fixDash=1;container=1;collapsible=0;align=center;verticalAlign=top;fontSize=12;fontStyle=1;fontColor=#143D4A;fontFamily=DM Sans;fontSource=https%3A%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3DDM%2BSans%3A400%2C500%2C700;` |
| `bar-lava` | `rounded=0;html=1;whiteSpace=wrap;fillColor=#FF5F46;strokeColor=none;align=center;verticalAlign=middle;fontSize=14;fontStyle=1;fontColor=#FFFFFF;fontFamily=DM Sans;fontSource=https%3A%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3DDM%2BSans%3A400%2C500%2C700;` |
| `bar-navy` | `rounded=0;html=1;whiteSpace=wrap;fillColor=#143D4A;strokeColor=none;align=center;verticalAlign=middle;fontSize=14;fontStyle=1;fontColor=#FFFFFF;fontFamily=DM Sans;fontSource=https%3A%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3DDM%2BSans%3A400%2C500%2C700;` |
| `bar-oat` | `rounded=0;html=1;whiteSpace=wrap;fillColor=#D9D7CE;strokeColor=none;align=center;verticalAlign=middle;fontSize=14;fontStyle=1;fontColor=#1B3139;fontFamily=DM Sans;fontSource=https%3A%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3DDM%2BSans%3A400%2C500%2C700;` |
| `node-platform` | `rounded=0;html=1;whiteSpace=wrap;fillColor=#FFFFFF;strokeColor=#FF5F46;strokeWidth=2;align=center;verticalAlign=middle;spacing=6;fontSize=12;fontStyle=1;fontColor=#1B3139;fontFamily=DM Sans;fontSource=https%3A%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3DDM%2BSans%3A400%2C500%2C700;` |
| `node-external` | `rounded=0;html=1;whiteSpace=wrap;fillColor=#FFFFFF;strokeColor=#D9D7CE;strokeWidth=2;align=center;verticalAlign=middle;spacing=6;fontSize=12;fontStyle=1;fontColor=#1B3139;fontFamily=DM Sans;fontSource=https%3A%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3DDM%2BSans%3A400%2C500%2C700;` |
| `node-capability` | `shape=image;html=1;whiteSpace=wrap;imageAspect=1;verticalLabelPosition=bottom;verticalAlign=top;labelPosition=center;align=center;fontSize=11;fontStyle=1;fontColor=#1B3139;fontFamily=DM Sans;fontSource=https%3A%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3DDM%2BSans%3A400%2C500%2C700;image=https://oieduardorabelo.github.io/databricks-architecture-icons/icons/svg/lakeflow.svg;` |
| `node-decision` | `rhombus;html=1;whiteSpace=wrap;fillColor=#FFFFFF;strokeColor=#143D4A;strokeWidth=2;align=center;verticalAlign=middle;fontSize=12;fontStyle=1;fontColor=#1B3139;fontFamily=DM Sans;fontSource=https%3A%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3DDM%2BSans%3A400%2C500%2C700;` |
| `node-store` | `shape=cylinder3;boundedLbl=1;backgroundOutline=1;size=14;html=1;whiteSpace=wrap;fillColor=#FFFFFF;strokeColor=#143D4A;strokeWidth=2;align=center;verticalAlign=middle;fontSize=12;fontStyle=1;fontColor=#1B3139;fontFamily=DM Sans;fontSource=https%3A%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3DDM%2BSans%3A400%2C500%2C700;` |
| `node-manual` | `shape=hexagon;perimeter=hexagonPerimeter2;html=1;whiteSpace=wrap;fillColor=#EEEDE9;strokeColor=#143D4A;strokeWidth=2;align=center;verticalAlign=middle;fontSize=12;fontStyle=1;fontColor=#1B3139;fontFamily=DM Sans;fontSource=https%3A%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3DDM%2BSans%3A400%2C500%2C700;` |
| `ring-bronze` | `ellipse;html=1;whiteSpace=wrap;fillColor=none;strokeColor=#B7584B;strokeWidth=3;align=center;verticalAlign=middle;fontSize=12;fontStyle=1;fontColor=#1B3139;fontFamily=DM Sans;fontSource=https%3A%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3DDM%2BSans%3A400%2C500%2C700;` |
| `ring-silver` | `ellipse;html=1;whiteSpace=wrap;fillColor=none;strokeColor=#A7B7BB;strokeWidth=3;align=center;verticalAlign=middle;fontSize=12;fontStyle=1;fontColor=#1B3139;fontFamily=DM Sans;fontSource=https%3A%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3DDM%2BSans%3A400%2C500%2C700;` |
| `ring-gold` | `ellipse;html=1;whiteSpace=wrap;fillColor=none;strokeColor=#A1670F;strokeWidth=3;align=center;verticalAlign=middle;fontSize=12;fontStyle=1;fontColor=#1B3139;fontFamily=DM Sans;fontSource=https%3A%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3DDM%2BSans%3A400%2C500%2C700;` |
| `badge-step` | `ellipse;html=1;whiteSpace=wrap;fillColor=#71C5AD;strokeColor=none;align=center;verticalAlign=middle;fontSize=11;fontStyle=1;fontColor=#FFFFFF;fontFamily=DM Sans;fontSource=https%3A%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3DDM%2BSans%3A400%2C500%2C700;` |
| `note-callout` | `shape=note;size=16;html=1;whiteSpace=wrap;fillColor=#F9F7F4;strokeColor=#D9D7CE;strokeWidth=1;align=left;verticalAlign=top;spacing=8;fontSize=11;fontStyle=0;fontColor=#1B3139;fontFamily=DM Sans;fontSource=https%3A%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3DDM%2BSans%3A400%2C500%2C700;` |
| `legend-box` | `rounded=0;html=1;whiteSpace=wrap;fillColor=#FFFFFF;strokeColor=#D9D7CE;strokeWidth=2;container=1;collapsible=0;align=left;verticalAlign=top;spacingLeft=12;spacingTop=6;fontSize=12;fontStyle=1;fontColor=#1B3139;fontFamily=DM Sans;fontSource=https%3A%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3DDM%2BSans%3A400%2C500%2C700;` |
| `legend-label` | `text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=10;fontStyle=0;fontColor=#1B3139;fontFamily=DM Sans;fontSource=https%3A%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3DDM%2BSans%3A400%2C500%2C700;` |
| `footer-strip` | `rounded=0;html=1;whiteSpace=wrap;fillColor=#EEEDE9;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=16;fontSize=11;fontStyle=0;fontColor=#618794;fontFamily=DM Sans;fontSource=https%3A%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3DDM%2BSans%3A400%2C500%2C700;` |
| `edge-flow` | `edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;jettySize=auto;orthogonalLoop=1;endArrow=block;endFill=1;strokeColor=#143D4A;strokeWidth=2;fontFamily=DM Sans;fontSource=https%3A%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3DDM%2BSans%3A400%2C500%2C700;` |
| `edge-secondary` | `edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;jettySize=auto;orthogonalLoop=1;endArrow=open;endFill=0;strokeColor=#A9B8BD;strokeWidth=2;fontFamily=DM Sans;fontSource=https%3A%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3DDM%2BSans%3A400%2C500%2C700;` |
| `edge-derived` | `edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;jettySize=auto;orthogonalLoop=1;endArrow=block;endFill=1;strokeColor=#143D4A;strokeWidth=2;dashed=1;dashPattern=6 4;fixDash=1;fontFamily=DM Sans;fontSource=https%3A%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3DDM%2BSans%3A400%2C500%2C700;` |
| `edge-two-way` | `edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;jettySize=auto;orthogonalLoop=1;startArrow=block;startFill=1;endArrow=block;endFill=1;strokeColor=#143D4A;strokeWidth=2;labelBackgroundColor=#FFFFFF;fontSize=10;fontStyle=1;fontColor=#1B3139;fontFamily=DM Sans;fontSource=https%3A%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3DDM%2BSans%3A400%2C500%2C700;` |
| `edge-labeled` | `edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;jettySize=auto;orthogonalLoop=1;endArrow=block;endFill=1;strokeColor=#143D4A;strokeWidth=2;labelBackgroundColor=#FFFFFF;fontSize=10;fontStyle=1;fontColor=#1B3139;fontFamily=DM Sans;fontSource=https%3A%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3DDM%2BSans%3A400%2C500%2C700;` |
| `edge-step` | `edgeStyle=none;rounded=0;html=1;endArrow=block;endFill=1;strokeColor=#143D4A;strokeWidth=2;fontFamily=DM Sans;fontSource=https%3A%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3DDM%2BSans%3A400%2C500%2C700;` |
| `edge-leader` | `edgeStyle=none;rounded=0;html=1;endArrow=none;strokeColor=#A9B8BD;strokeWidth=1;dashed=1;dashPattern=4 4;fixDash=1;fontFamily=DM Sans;fontSource=https%3A%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3DDM%2BSans%3A400%2C500%2C700;` |
