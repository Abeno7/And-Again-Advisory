# Guide 03 — Content Page (Index)

Template: `templates/03-content-page.html`
Reference: Coffee Village demo, page 2 ("INDEX").

## Purpose

The content page maps the whole document as a scannable grid — each section
gets a page numeral, a title and a one-line teaser, so the reader can preview
the narrative arc before entering it.

## Anatomy

```
┌────────────────────────────────────────────────────────┐
│ INDEX (Display LG, rust)                               │
│                                                        │
│  01        04        07        10        13        18  │
│  TITLE     TITLE     TITLE     TITLE     TITLE     …   │
│  teaser    teaser    teaser    teaser    teaser        │
│                                                        │
│  26        29        32        37        44        50  │
│  TITLE     TITLE     TITLE     TITLE     TITLE     …   │
│  teaser    teaser    teaser    teaser    teaser        │
│ ───────────────────────────────────────────────────────│
│ [footer band]                                          │
└────────────────────────────────────────────────────────┘
```

| Element | Spec |
|---|---|
| Page title | Display LG 88 px, rust, top-left |
| Grid | 6 columns × 2 rows, 44 px column gap, 76 px row gap |
| Numerals | Display face 74 px, **copper**, zero-padded (`01`, `04` …) — these are *page numbers*, not sequence numbers |
| Entry titles | Lato bold 16.5 px caps, cream, broken to 2 lines |
| Teasers | Lato italic 300, 13.5 px, cream-faint, ≤ 2 lines |
| Ground | Espresso + faint pattern, no photography |
| Footer | Standard band |

## Rules

- Capacity is **12 entries** (6 × 2). Fewer sections: keep 6 columns and use
  one row, or drop to fewer columns per row only if below 5 entries.
  More than 12: consolidate sections — do not shrink the type.
- Numerals show the **starting page** of each section and must match the
  footer page numbers exactly.
- Every entry needs a teaser; an entry without one breaks the rhythm.
- Titles break as two roughly-equal lines ("PROJECT / OVERVIEW", "CONTEXT & /
  OPPORTUNITY").

## Customising

1. Edit the 12 `.index-entry` blocks — numeral, 2-line title, teaser.
2. Delete surplus entries from the end; the grid re-flows automatically.
3. Update numerals whenever pagination changes — do this last, after the
   document is assembled.
