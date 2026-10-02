# Design Resources — Applying *Awesome Web Design* to the RAAS System

The curated list [nicolesaidy/awesome-web-design](https://github.com/nicolesaidy/awesome-web-design)
(CC0) is vendored as a git submodule at
[`vendor/awesome-web-design`](../vendor/awesome-web-design/README.md).
This guide picks the entries that are useful for this template system and says
how each one applies. Some listed links are old, so check that a site is still
up before you rely on it.

```bash
# first checkout
git submodule update --init
# pull the latest list
git submodule update --remote vendor/awesome-web-design
```

---

## 1. Colour — palette audit

These tools are on the list:
[Adobe Color](https://color.adobe.com/), [Coolors](https://coolors.co/),
[Colorzilla](http://colorzilla.com), [Sip](http://sipapp.io/) (Mac picker).

WCAG 2.x contrast ratios for each token on the espresso ground (`#29241F`).
Alpha tokens were blended onto espresso before measuring.

| Token | Ratio | Small text (≥ 4.5) | Large / display (≥ 3.0) | Verdict |
|---|---|---|---|---|
| Cream | 11.74 | ✅ | ✅ | — |
| White | 14.87 | ✅ | ✅ | — |
| Cream dim (.72) | 6.77 | ✅ | ✅ | Fine for body text |
| Copper | 5.92 | ✅ | ✅ | — |
| Rust | 3.96 | ❌ | ✅ | Display sizes only, which is how the guide uses it |
| **Cream faint (.45)** | **3.57** | ❌ | ✅ | **Too low for the 12–14 px captions, notes and footer tagline it's used for** |
| Terracotta | 2.95 | ❌ | ❌ | Fine as a solid block. Never use it for type. |
| White on terracotta | 5.05 | ✅ | ✅ | Brand-block text is fine |

**Recommendation:** raising `--cream-faint` to `rgba(234, 224, 205, 0.55)`
gives **4.57 : 1**, which passes AA for small text and still sits visibly below
cream dim. It is a one-token change in `templates/assets/template.css`. These
ratios are measured on the solid espresso ground. Over photography, the
`.bg-scrim-*` layers have to keep the backdrop at least this dark.

When you rebrand (style guide §7), run any new `--terracotta`, `--copper` or
`--rust` through the same check. Copper is used for the 15 px kicker, so it
needs ≥ 4.5 : 1.

## 2. Typography

From the list: [Type Scale](http://type-scale.com/),
[Fontpair](http://fontpair.co), [Typewolf](https://www.typewolf.com/),
[WhatTheFont](https://www.myfonts.com/WhatTheFont/),
[Google Fonts](http://fonts.google.com).

- **Scale check:** Display MD → LG → XL runs 44 → 88 → 158 px, close to a
  ×2 / ×1.8 progression. Body is 15.5 px. Display MD to body is about ×2.8, so
  there is no step in between. If a page needs a mid-level heading, use
  Type Scale with a 1.5 ratio from a 15.5 px base (23 → 35 px) instead of
  picking a size by eye.
- **Pairing / substitution:** Julius Sans One + Lato are both Google Fonts and
  are self-hosted in `templates/assets/fonts/`. If you need to swap a face,
  look for alternatives on Typewolf or Fontpair. Keep it to one thin
  geometric display face plus one humanist sans.
- **Matching client fonts:** if a client supplies a logo image, use
  WhatTheFont to identify its typeface before you set the brand block.

## 3. Imagery

From the list: [Unsplash](https://unsplash.com), [Pexels](https://pexels.com),
[Pixabay](https://pixabay.com/). All three allow commercial use.

- Use these to fill `.bg-image` placeholders in drafts until project renders
  are ready. Search terms that match the style guide's grading: *"forest night
  lanterns"*, *"timber pavilion dusk"*, *"dark architecture warm light"*.
- Grade stock to match the system: underexpose, keep highlights warm, and
  avoid blue daylight skies (style guide §4).
- Note the photographer's credit for each stock image and remove all stock
  before client issue unless it is licensed for the deliverable.

## 4. Icons

From the list: [The Noun Project](https://thenounproject.com/),
[Material Icons](https://material.io/icons/),
[Flat Icon](http://flaticon.com).

The system has no icon set today. If one is added, for example for stat stacks
or a site legend, choose **thin, single-weight line icons** in cream to match
Julius Sans One. Avoid filled or multi-colour icons.

## 5. Layout & UX principles

From the list: [Laws of UX](https://lawsofux.com/),
*Don't Make Me Think*, *The Design of Everyday Things*.

Principles the templates already follow, and should keep following:

- **Miller's Law / chunking:** the content-page index and fact stacks group
  information into short numbered chunks. Keep index pages to about 7 entries
  and split longer contents across two pages.
- **Law of Prägnanz / proximity:** the footer anatomy (wordmark, label, tagline,
  page no.) is the same on every page, so readers stop looking at it. Don't
  vary it between pages.
- **Von Restorff (isolation) effect:** white type and the terracotta block
  stand out only because they are rare. Keep the "one pull quote per body page"
  rule.

## 6. Tools for producing documents

From the list: [Figma](http://figma.com), [Canva](http://canva.com),
[Zeplin](https://zeplin.io/).

The HTML templates are the source of truth. If collaborators work in Figma or
Canva, set the frames to 1920 × 1080 and copy the tokens from `:root` in
`template.css`. Don't re-derive them from screenshots.
