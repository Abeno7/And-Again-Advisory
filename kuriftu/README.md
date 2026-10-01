# Kuriftu Resorts — website redesign (Direction I · The Heirloom)

A static, dependency-free redesign of the Kuriftu Resorts & Spa homepage, built on
the **Heirloom** direction from *Kuriftu Brand Identity — Third Draft* (Rhodonite, Sept 2026).

- `index.html` · `styles.css` · `main.js` — no build step; open `index.html` or serve the folder.
- `assets/brand/` — the Heirloom mark and KURIFTU wordmark, extracted as vectors from the brand book
  (inlined in the page as `<symbol>`s so they take `currentColor`).
- `assets/img/` — photography taken from the brand book, resized for web.
- `assets/fonts/` — Cormorant Garamond, Hanken Grotesk, Noto Serif Ethiopic (SIL OFL), self-hosted.

## Brand rules applied
- Palette from materials: Gold `#AE8A4E` (brass), Olive `#6D6854` (eucalyptus), Ink `#1E1E1B` (basalt), Paper `#EDE7DC` (cotton).
- Destinations carry no colour — only an atmosphere tint (hover rule under each place name).
- Programmes take one accent on the name only: Peacock teal `#2E6A6E`, Artist clay `#A35D3F`, always endorsed "by Kuriftu".
- Line: *Timeless hospitality. Held by nature.* · Serving since 2002.

## Before launch
- The reserve drawer and newsletter are front-end only; wire them to the booking engine / CRM.
- Swap in per-destination photography where a place currently uses a brand-book mood image.
- Wordmark typeface (Mainlux) is used only via the extracted SVG; "Resorts" descriptors are set in Hanken Grotesk.
