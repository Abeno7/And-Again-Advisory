# RAAS Document Template System

A six-page document template system with accompanying design guides, derived
from the *Coffee Village — Concept Design Presentation* (RAAS Architects).

Dark, cinematic, editorial: full-bleed imagery, thin geometric display caps in
cream, terracotta brand blocks, copper numerals, and a consistent footer band.

## Contents

| Page type | Template | Guide |
|---|---|---|
| Master style guide | — | [`guides/00-style-guide.md`](guides/00-style-guide.md) |
| 1. Typical cover page | [`templates/01-cover-page.html`](templates/01-cover-page.html) | [`guides/01-cover-page.md`](guides/01-cover-page.md) |
| 2. Typical secondary page | [`templates/02-secondary-page.html`](templates/02-secondary-page.html) | [`guides/02-secondary-page.md`](guides/02-secondary-page.md) |
| 3. Content page (index) | [`templates/03-content-page.html`](templates/03-content-page.html) | [`guides/03-content-page.md`](guides/03-content-page.md) |
| 4. Section / separator page | [`templates/04-section-page.html`](templates/04-section-page.html) | [`guides/04-section-page.md`](guides/04-section-page.md) |
| 5. Body page | [`templates/05-body-page.html`](templates/05-body-page.html) | [`guides/05-body-page.md`](guides/05-body-page.md) |
| 6. Close-out page | [`templates/06-closeout-page.html`](templates/06-closeout-page.html) | [`guides/06-closeout-page.md`](guides/06-closeout-page.md) |
| Design resources & contrast audit | — | [`guides/07-design-resources.md`](guides/07-design-resources.md) |

Shared design system: [`templates/assets/template.css`](templates/assets/template.css)
All-pages preview: [`templates/preview.html`](templates/preview.html)
Resource list (git submodule): [`vendor/awesome-web-design`](vendor/awesome-web-design). Run `git submodule update --init` after cloning.

## Usage

1. Open any template in a browser — each page is a fixed 1920 × 1080 canvas.
2. Edit the sample (Coffee Village) content in place; the guides list every
   replaceable field and the rules that keep the layout on-system.
3. Replace each `.bg-image` placeholder with real photography
   (`background: url(...) center / cover;`) — a dashed marker labels every
   image zone until you do.
4. Export: print each page to PDF at 1920 × 1080 (or screenshot at 100 %
   zoom), then assemble in page order:
   **Cover → Secondary → Content → (Section → Body ×n) → Close-out.**

## Assembly order

```
01 Cover  →  02 Secondary  →  03 Content (index)
   →  04 Section separator  →  05 Body page(s)   (repeat per section)
   →  06 Close-out
```

Fonts are loaded from Google Fonts (Julius Sans One + Lato); an internet
connection is needed for accurate previews, with system fallbacks otherwise.
