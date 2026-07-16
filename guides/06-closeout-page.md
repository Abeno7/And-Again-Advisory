# Guide 06 — Close-out Page

Template: `templates/06-closeout-page.html`
Design: mirrors the cover (brand block returns, full-bleed image, no footer)
so the document closes the way it opened — reference: demo page 2's
"CLOSING VISION" index entry.

## Purpose

The close-out page ends the document deliberately: a thank-you / closing
vision statement, the studio's contact details, and a formal end-of-document
marker. It is the page a client sees last — and the one they act on.

## Anatomy

```
┌──────────────────────────────────────────────┬─────────┐
│                                              │ BRAND   │
│ CLOSING VISION (copper kicker)               │ BLOCK   │ ← bleeds off top edge
│ THANK YOU (Display LG, cream)                └─────────┤
│ closing statement (italic 26px,                        │
│ cream-dim, ≤ 720px, 2–3 lines)                         │
│                                                        │
│ STUDIO          CONTACT           DOCUMENT             │
│ name            email             title                │
│ city            phone             stage + date         │
│                                                        │
│ END OF DOCUMENT (letter-spaced caps, faint)            │
└────────────────────────────────────────────────────────┘
```

| Element | Spec |
|---|---|
| Brand block | Same 200 × 190 px terracotta square as the cover, top-right, bleeding off the top |
| Kicker | Copper caps 15 px — use the closing section's name ("CLOSING VISION") |
| Title | Display LG 88 px, cream — "THANK YOU" or an equivalent closing phrase |
| Statement | Lato italic 300, 26 px / 1.5, cream-dim, one sentence of vision, ≤ 720 px |
| Contact row | Three kicker + value groups: Studio / Contact / Document |
| End marker | "END OF DOCUMENT", 13 px caps, +0.30 em tracking, cream-faint, bottom-left — replaces the footer band |
| Ground | Full-bleed image, the quietest in the document (wide shot, heavier scrim) |

## Rules

- **No footer band and no page number** — the end marker takes their place.
  Cover and close-out are the only footer-less pages; that symmetry is the
  design intent.
- The closing statement should echo the cover blurb / document tagline, giving
  the narrative a full circle.
- Exactly three contact groups; legal boilerplate lives on the secondary page,
  not here.
- Choose the calmest image available — this page should feel like an exhale.

## Customising

1. Update the brand block, closing statement, and the three contact groups.
2. Match the "Document" group's title and date to the secondary page exactly.
3. Swap `.bg-image` for the closing photograph.
