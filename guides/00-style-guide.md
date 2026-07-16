# Master Style Guide — RAAS Document Template System

Derived from the *Coffee Village — Concept Design Presentation* (RAAS Architects, July 2026).
This guide defines the shared design system used by all six page templates in `/templates`.

---

## 1. Canvas & Grid

| Property | Value |
|---|---|
| Page size | 1920 × 1080 px (16:9 landscape) |
| Outer margin — horizontal | 64 px left and right |
| Outer margin — vertical | 56 px top (interior pages), footer band bottom |
| Footer band | 96 px tall, spans margin-to-margin, topped by a 2 px cream rule |
| Column width (body text) | ~330 px per reading column, 40 px gutter |

All live content sits inside the margins. Only three things ever bleed:
full-page imagery, the terracotta **brand block** (bleeds off the top edge),
and background scrims.

## 2. Colour Palette

| Token | Hex / value | Use |
|---|---|---|
| Espresso | `#29241F` | Base page ground (pattern pages) |
| Espresso deep | `#16120E` | Image shadows, darkest ground |
| Cream | `#EAE0CD` | Display type, headings, footer rule |
| Cream dim | `rgba(234,224,205,.72)` | Body text |
| Cream faint | `rgba(234,224,205,.45)` | Captions, italic notes, metadata |
| Terracotta | `#9C5C43` | Brand block, date chip, key accents |
| Copper | `#C99672` | Index numerals, section numbers, kickers |
| Rust | `#B4714F` | Oversized display titles (INDEX, DOCUMENT) |
| White | `#FDFBF7` | Pull quotes, cover title, highest emphasis |

**Rules**

- The document is always light-on-dark. Never place dark text on a light panel.
- Terracotta is reserved for *solid blocks* (brand block, chips). Copper and rust
  are *type-only* accents. Don't swap them.
- Use white sparingly — cover title and pull quotes only. Everything else is cream.

## 3. Typography

Two typefaces only:

| Role | Face | Notes |
|---|---|---|
| Display | **Julius Sans One** (thin geometric caps) | Titles, numerals, wordmark. Always uppercase. |
| Text | **Lato** (300 / 400 / 700, + italics) | Body, labels, captions, quotes. |

Type scale (at 1920 px width):

| Style | Size / leading | Colour | Use |
|---|---|---|---|
| Display XL | 158 px / 0.92 | White | Cover title only |
| Section numeral | 210 px / 0.9 | Copper | Section separator pages |
| Display LG | 88 px / 1.02 | Cream (or rust) | Page titles, section titles |
| Display MD | 44 px / 1.1 | Cream | Sub-headers, cover subtitle |
| Index numeral | 74 px / 1.0 | Copper | Content-page entries |
| Pull quote | 40 px / 1.28, bold italic | White | One per body page maximum |
| Stat label | 30 px display | Cream | Fact stacks |
| Kicker | 15 px, bold, +0.30 em tracking, caps | Copper | Labels above values |
| Body | 15.5 px / 1.6, Lato 300 | Cream dim | Reading text |
| Italic note | 14 px italic 300 | Cream faint | Teasers, disclaimers, captions |
| Footer meta | 12–13 px | Cream / faint | Footer band content |

**Rules**

- Display type breaks into **two short lines** whenever possible
  (`COFFEE / VILLAGE`, `PROJECT / BRIEF`) — never let a title run wide.
- Body text never exceeds ~330 px column width. Long content = more columns
  or more pages, never wider columns.

## 4. Imagery

- Photography/renders are **full-bleed** and set the mood: dark, atmospheric,
  warm lantern-glow highlights against deep forest/architectural tones.
- Text is always protected by a **scrim**: a left gradient (`.bg-scrim-left`)
  behind text columns, a bottom gradient (`.bg-scrim-bottom`) behind the footer.
- Non-image pages (secondary, content) use the solid espresso ground with the
  faint geometric line motif (`.bg-pattern`) at ≤ 5 % opacity — visible only
  on close inspection.
- In the templates, `.bg-image` is a gradient placeholder with a dashed
  "replace me" marker. Swap it for a real image
  (`background: url(...) center / cover;`) and the marker disappears when you
  remove the `::after` rule (or simply overwrite the background).

## 5. Footer Band (interior pages)

Anatomy, left to right:

1. **Wordmark** — `RAAS` display caps with `ARCHITECTS` letter-spaced beneath.
2. **Document label** — two lines, bold caps 12.5 px: project name / document stage.
3. **Tagline** — centred, italicised-tone light text, one to two lines, max 420 px.
4. **Page number** — right-aligned, `PAGE 001` format, zero-padded to three digits.

The footer appears on **every page except the cover and the close-out**.
Its content never changes within a document except the page number.

## 6. Page Inventory

| # | Template | File | Background |
|---|---|---|---|
| 1 | Cover page | `templates/01-cover-page.html` | Full-bleed hero image |
| 2 | Secondary page (document control) | `templates/02-secondary-page.html` | Espresso + pattern |
| 3 | Content page (index) | `templates/03-content-page.html` | Espresso + pattern |
| 4 | Section / separator page | `templates/04-section-page.html` | Full-bleed image |
| 5 | Body page | `templates/05-body-page.html` | Full-bleed image |
| 6 | Close-out page | `templates/06-closeout-page.html` | Full-bleed image |

A typical document assembles as:
**Cover → Secondary → Content → (Section → Body ×n) ×sections → Close-out.**

## 7. Adapting to Another Project / Brand

1. Replace the wordmark text in `.brand-block` and `.footer .wordmark`.
2. Update the document label, tagline and page numbers in every footer.
3. Swap `.bg-image` placeholders for project photography that matches the
   dark-atmospheric grading (underexpose bright images; keep highlights warm).
4. If rebranding the palette, change only `--terracotta`, `--copper` and
   `--rust` in `templates/assets/template.css`; keep the espresso/cream
   neutrals — they are what make the system read as one document.
