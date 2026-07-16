# Guide 04 — Section / Separator Page

Template: `templates/04-section-page.html`
Design: composed from the demo's system — the oversized copper numeral scale of
the index, the display titles of the body pages, and a full-bleed image ground
(as on demo pages 3–4).

## Purpose

Separator pages punctuate the document between major sections. They give the
reader a breath, announce what comes next, and re-anchor the atmosphere with a
single strong image.

## Anatomy

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│  03  (giant copper numeral)                            │
│  SECTION THREE  (copper kicker)          full-bleed    │
│  DESIGN                                  section       │
│  VISION  (Display LG, cream, 2 lines)    image         │
│  italic one-sentence introduction                      │
│                                                        │
│ ───────────────────────────────────────────────────────│
│ [footer band]                                          │
└────────────────────────────────────────────────────────┘
```

| Element | Spec |
|---|---|
| Section numeral | Display face 210 px, copper, zero-padded — the page's dominant element |
| Kicker | "SECTION THREE" — copper caps 15 px, +0.30 em tracking |
| Section title | Display LG 88 px, cream, 2 lines, matches its wording on the content page |
| Intro line | Lato italic 300, 19 px / 1.55, cream-dim, one sentence, ≤ 520 px |
| Content block | Left-aligned at the 64 px margin, vertically centred |
| Ground | Full-bleed image + left/bottom scrims |
| Footer | Standard band, page number = the numeral shown on the content page |

## Rules

- One idea only: number, name, one sentence. **No body text, no lists, no
  stats** — those belong on body pages.
- The numeral, section name and starting page must agree with the content page.
- Choose an image that previews the section's subject (site photo for context,
  render for design chapters); keep the right two-thirds visually clean so the
  image breathes.
- The intro sentence may be omitted; the numeral and title may not.

## Customising

1. Set the numeral, kicker ordinal ("SECTION THREE") and 2-line title.
2. Write a one-sentence intro — ideally reuse the teaser from the content page.
3. Swap `.bg-image` for the section image.
