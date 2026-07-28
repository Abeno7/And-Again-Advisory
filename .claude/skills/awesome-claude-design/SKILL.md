---
name: awesome-claude-design
description: Reference library of production-grade DESIGN.md aesthetic specs (colors, type scales, component rules, motion) reverse-engineered from real products — Linear, Vercel, Stripe, Apple, Arc, Figma, Canva, Ollama, Warp, ClickHouse, Datadog, PostHog, Claude, Mercury, Granola, BMW, Ferrari, Runway, NVIDIA and more — grouped into nine aesthetic families, plus brand-remix specs and step-by-step design recipes. Use when picking or naming a visual direction, when the user asks for a look "like Linear" / "like Stripe" / "editorial" / "terminal" / "brutalist" / "glassmorphic" / "cinematic dark" / "data-dense", when writing or auditing a DESIGN.md or design-token set, when escaping generic default AI styling, or when running a design workflow such as brand extraction, wireframe-to-hi-fi, repo-to-design-system, or landing page / pitch deck build-out.
---

# Awesome Claude Design

A curated aesthetic reference library, not a generator. Load a spec, then design
*to* it — the value is in committing to one coherent system instead of averaging
every style into mush.

> Provenance: vendored from [rohitg00/awesome-claude-design](https://github.com/rohitg00/awesome-claude-design).
> Upstream ships no `SKILL.md`; this wrapper was authored locally to index the
> library. The reference content in `design-md/`, `recipes/`, and `prompts/` is
> upstream's, unmodified. Full upstream index: `UPSTREAM-README.md`.

## How to use it

1. **Pick a family** from the table below (or run `prompts/family-picker.md` if
   the direction is genuinely undecided).
2. **Read the one spec file** for the closest reference brand. Each is a complete
   DESIGN.md: theme statement, color palette with roles, type scale, component
   rules, motion, and explicit anti-patterns.
3. **Adapt, don't transplant.** Take the *system* — contrast strategy, accent
   discipline, spacing rhythm, motion budget. Substitute the project's own
   palette, wordmark, and typefaces. Never ship a competitor's exact brand
   colors or logo as if they were the client's.
4. Load **one** spec at a time. Two specs at once produce incoherent output.

## Aesthetic families

| Family | Feel | Specs in `design-md/` |
|---|---|---|
| `editorial` | Calm neutrals, one surgical accent, Swiss restraint | `linear`, `vercel` |
| `terminal` | Monospace, black/green, CLI-native | `ollama`, `warp`, `opencode` |
| `warm` | Cream paper, terracotta, serif-adjacent, human | `claude`, `mercury` |
| `data-dense` | Tables and charts first, high information rate | `clickhouse`, `datadog`, `mongodb`, `posthog` |
| `cinematic` | Dark, full-bleed imagery, wide-tracked caps | `cohere`, `runway`, `minimax`, `nvidia`, `tavus`, `bmw`, `ferrari`, `lamborghini`, `renault` |
| `playful` | Saturated color, rounded geometry, motion-forward | `figma`, `canva`, `toss` |
| `glass` | Translucency, blur, soft futurism | `apple`, `arc` |
| `brutalist` | Hard borders, raw hierarchy, no gradients | `the-verge` |
| `indie` | Small-team craft, opinionated and unpolished-on-purpose | `granola` |

**Remixes** (`design-md/remix/`) blend two systems and state which trait wins
where — useful when a single family reads too close to the reference brand:
`linear-x-claude`, `stripe-x-a24`, `mercury-x-linear`, `vercel-x-pitchfork`,
`warp-x-sentry`, `granola-x-criterion`, `notion-x-duolingo`,
`ollama-x-elevenlabs`.

## Workflow recipes (`recipes/`)

| Need | Recipe |
|---|---|
| Derive a DESIGN.md from an existing brand | `brand-extraction.md` |
| Turn a Figma file into a spec | `figma-to-design-md.md` |
| Turn a repo into a design system | `repo-to-design-system.md` |
| Wireframe → high fidelity | `wireframe-to-hifi.md` |
| Screenshot / live site → prototype | `web-capture-to-prototype.md` |
| Landing page, fast | `landing-page-20-min.md` |
| Pitch deck from a README | `pitch-deck-from-readme.md`, `speaker-notes-pitch-deck.md` |
| Audit an existing site | `prompts/audit-live-site.md` |
| Break out of default AI styling | `prompts/break-default-aesthetic.md` |
| Stress-test a direction | `prompts/3-designer-debate.md` |
| Shaders / 3D surfaces | `frontier-3d-shaders.md` |
| Keep spec context small | `token-budget-claude-design.md` |

## Rules

- Cite which spec you used, so the choice is reviewable.
- If the project already has a DESIGN.md or token file, that wins; use this
  library only to fill genuine gaps or to argue for a change explicitly.
- Respect each spec's anti-patterns section — it is the part that actually keeps
  output from drifting generic.
- These are design analyses of public products. Use them as craft references,
  not as a way to pass work off as another company's.
