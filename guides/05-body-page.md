# Guide 05 — Body Page

Template: `templates/05-body-page.html`
Reference: Coffee Village demo, page 3 ("PROJECT BRIEF").

## Purpose

The body page carries the document's actual narrative: a titled block of
reading text set over full-bleed imagery, with an optional pull quote that
distils the page into one line.

## Anatomy

```
┌────────────────────────────────────────────────────────┐
│ PROJECT                                                │
│ BRIEF  (Display LG, cream, 2 lines)                    │
│                                                        │
│ column one        column two            full-bleed     │
│ ~330px wide       ~330px wide           image          │
│ Lato 300          Lato 300                             │
│ 15.5px/1.6        15.5px/1.6         "                 │
│ text runs         …continues         Pull quote        │
│ down…             here               (bold italic,     │
│                                      white, 40px)      │
│ ───────────────────────────────────────────────────────│
│ [footer band]                                          │
└────────────────────────────────────────────────────────┘
```

| Element | Spec |
|---|---|
| Page title | Display LG 88 px, cream, 2 lines, top-left |
| Text columns | Two columns ≤ 330 px, 40 px gutter, Lato 300 15.5 px / 1.6, cream-dim |
| Column flow | Text flows column 1 → column 2 (mid-sentence breaks are acceptable, as in the demo) |
| Pull quote | Oversized `“` marks (Georgia 110 px, cream) + bold italic white 40 px / 1.28, ≤ 460 px, lower-right |
| Ground | Full-bleed image, left scrim behind the text, bottom scrim behind footer |
| Footer | Standard band |

## Rules

- Maximum **two reading columns**; text never overlaps the image's focal area.
- Paragraphs stay short (4–7 lines set). If the text exceeds the two columns,
  it becomes two body pages — never a third column, never smaller type.
- **One pull quote maximum** per page, and it is the only white text on the
  page. Omit it on data-heavy pages.
- Variants built from the same skeleton:
  - *Stat variant* (demo page 4): replace the columns with a `.stat-stack` of
    kicker-style labels + values (SITE CONTEXT / ALTITUDE / PROJECT VISION).
  - *Quote-less variant*: drop the pull quote and let the image carry the right side.

## Customising

1. Set the 2-line title.
2. Pour narrative text into the two columns, balancing their lengths.
3. Write (or omit) the pull quote — present tense, one sentence, ≤ 14 words.
4. Swap `.bg-image`; verify legibility over the scrim at 100 % zoom.
