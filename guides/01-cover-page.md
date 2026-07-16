# Guide 01 — Typical Cover Page

Template: `templates/01-cover-page.html`
Reference: Coffee Village demo, page 1.

## Purpose

The cover sells the document in one glance: project identity, document type,
issuing brand, and date — all carried by a single cinematic hero image.

## Anatomy

```
┌──────────────────────────────────────────────┬─────────┐
│ PROJECT TITLE (Display XL,                   │ BRAND   │
│ white, 2 lines, top-left)                    │ BLOCK   │  ← bleeds off top edge
│                                              └─────────┤
│                                                        │
│              FULL-BLEED HERO IMAGE                     │
│                                                        │
│ DOCUMENT SUBTITLE (Display MD, cream, 2 lines)         │
│ short positioning blurb (Lato 300, ≤ 330px, 2–4 lines) │
│ [ DATE CHIP — terracotta ]                             │
└────────────────────────────────────────────────────────┘
```

| Element | Spec |
|---|---|
| Project title | Display XL 158 px, white, uppercase, 2 lines, top-left at 64 px margin, 44 px from top |
| Brand block | 200 × 190 px terracotta square, flush to top edge, right margin 64 px |
| Subtitle | Display MD ~40 px, cream, 2 lines (e.g. "CONCEPT DESIGN / PRESENTATION") |
| Blurb | Lato 300, 16 px / 1.55, cream-dim, max 330 px wide, one sentence |
| Date chip | Terracotta block, white 21 px text, format "JULY, 2026" |
| Scrims | Left + bottom gradients keep the title and lower cluster legible |

## Rules

- **No footer, no page number** on the cover.
- The hero image must be dark and atmospheric with a warm light source;
  if the source photo is bright, grade it down before placing.
- Title is the only white element besides the brand block text.
- Keep the lower-left cluster (subtitle → blurb → chip) inside 420 px width —
  it must never compete with the image's focal point on the right.

## Customising

1. Replace the two title lines — keep each line ≤ 8 characters if possible so
   the letterforms stay monumental.
2. Update subtitle, blurb, and date chip.
3. Swap `.bg-image` for the hero photograph (`center / cover`).
