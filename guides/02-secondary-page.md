# Guide 02 — Typical Secondary Page

Template: `templates/02-secondary-page.html`
Design: new page type, composed strictly from the demo document's system
(rust display title + espresso pattern ground + copper kickers + standard footer).

## Purpose

The secondary page is the inside cover / document-control sheet. It states who
the document is for, who issued it, its number, status and revision history,
and carries the copyright/confidentiality note. It gives the document
professional traceability before any design content begins.

## Anatomy

```
┌────────────────────────────────────────────────────────┐
│ DOCUMENT (Display LG, rust)                            │
│                                                        │
│ PROJECT           DOCUMENT TITLE      REVISION HISTORY │
│ value + sub       value               ┌ rev table ┐    │
│ PREPARED FOR      DOCUMENT NO.        └───────────┘    │
│ value + sub       value                                │
│ PREPARED BY       ISSUE DATE          italic           │
│ value + sub       STATUS              disclaimer       │
│ ───────────────────────────────────────────────────────│
│ [footer band]                                          │
└────────────────────────────────────────────────────────┘
```

| Element | Spec |
|---|---|
| Page title | Display LG 88 px, **rust** (`#B4714F`) — matches the INDEX title treatment |
| Ground | Espresso + faint geometric pattern (`.bg-pattern`), no photography |
| Field kickers | Copper caps 15 px, +0.30 em tracking |
| Field values | Lato 300, 20 px cream, with 14.5 px faint sub-line |
| Revision table | Copper caps headers, hairline row rules at 12 % cream |
| Disclaimer | Italic note style, cream-faint, max ~5 lines |
| Footer | Standard band, `PAGE 002` |

## Rules

- Keep it to **three columns**: identity / document metadata / revisions+legal.
- No imagery on this page — the pattern ground signals "administrative" pages
  (secondary + content) versus "narrative" pages (image-backed).
- The revision table always shows at least one empty row (`—`) for future issues.
- Do not exceed four fields per column; overflow belongs in an appendix.

## Customising

1. Fill project, client and author fields; keep sub-lines to one line each.
2. Use a consistent document number scheme (`ORG-PROJECT-STAGE-NNN`).
3. Update revision rows on every issue — this page is the audit trail.
