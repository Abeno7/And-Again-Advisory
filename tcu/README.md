# The Craft Union — Offspring Brand Documents

Working source for the two offspring deliverables. Both are authored as HTML on
a 960 × 540 pt canvas — the same geometry as the approved deck — and printed to
PDF with headless Chromium, so the HTML maps 1:1 onto the printed page.

## Deliverables

| Output | Pages | Source |
|---|---|---|
| `out/TCU_Offspring_Guideline_Amended_v2.pdf` | 13 | approved deck (1–9) + `colour-amendment.html` (10–13) |
| `out/TCU_Offspring_Typeface_Alternatives.pdf` | 7 | `typeface-alternatives.html` |

### 1. Colour amendment — pages 10 to 13

Continues the move from one colour per offspring to a five-step palette each.
Pages 1–9 of the approved deck are carried through **untouched**; the build
appends to the original PDF rather than re-rendering it, so nothing already
signed off can shift.

- **10–12** Palette in application, one page per offspring — name bar,
  cover, editorial and digital, plus the rules that govern each.
- **11** also maps the designer's supplied reference swatches onto the
  approved steps.
- **13** Contrast and pairing: WCAG 2.2 ratios for every step against the two
  grounds it will actually sit on.

### 2. Typeface alternatives — 7 pages

Three display alternatives per offspring with written rationale and trade-offs,
live specimens, name-bar proofs, a comparison table and licensing notes. The
parent system's Optima/Pelago supporting typography is unchanged throughout —
only the name treatment is in question.

## Building

```bash
python3 tcu/build.py            # writes both PDFs into out/
python3 tcu/build.py --proof    # also writes PNG page proofs into out/proofs/
```

Requires `pymupdf` and the Chromium under `/opt/pw-browsers`. The approved deck
is read from the path in `TCU_SOURCE_DECK` — override it if the file moves:

```bash
TCU_SOURCE_DECK=/path/to/approved.pdf python3 tcu/build.py
```

## Design system

`assets/tcu.css` reproduces the deck's system, with values sampled directly from
the approved PDF rather than guessed:

| Role | Value |
|---|---|
| Paper | `#F5F1EE` |
| Titles / primary text | `#504F49` |
| Body copy | `#736B65` |
| Folios and rules | `#C5B6A8` |
| Small labels | `#B5ADA4` |

Offspring palettes are bound per page with `data-brand="treesongs|riversprings|whisperlake"`,
which exposes `--c1` (darkest) through `--c5` (paper).

`assets/logo-lockup.png` is the approved endorsement lockup extracted from the
source PDF and decomposed to true alpha, so it composites correctly on any
ground. `assets/logo-lockup-light.png` is the reversed variant for dark pages.

## A note on fonts

Optima LT Pro and Pelago are commercially licensed and are **not** in this
repository. For proofing they are substituted by Marcellus and Lato; the
substitution is declared on page 07 of the typeface document. **Final artwork
must be reset in the licensed faces before release.**

The nine candidate faces *are* included — all are SIL Open Font Licence 1.1.
See `assets/fonts/NOTICE.txt` for per-family copyright and `assets/fonts/OFL.txt`
for the licence.
