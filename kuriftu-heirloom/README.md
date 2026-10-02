# Kuriftu Resorts & Spa — website (Direction I · The Heirloom)

A static, dependency-free redesign of kurifturesorts.com built on the rebrand's Heirloom direction
(Rhodonite, *Brand Identity — Third Draft*, September 2026).

- `index.html` — home: hero, premise, destinations, materiality, stay, spa, dine (buna), experiences, programmes, the Heirloom story, reservations.
- `destination.html?place=bishoftu|entoto|awash-falls|lake-tana|african-village` — one template, content in `assets/js/site.js`.
- `assets/brand/` — the Heirloom mark, Mainlux wordmark and descriptor, extracted as vectors from the brand book (`sprite.svg`).
- `assets/img/` — photography from the brand book, converted to WebP.
- Type: Cormorant Garamond (self-hosted) for display, Satoshi (Fontshare) for text, Manrope as local fallback.
- Palette: Gold `#AE8A4E`, Olive `#6D6854`, Ink `#1E1E1B`, Paper `#EDE7DC`; programme accents Peacock Teal `#2E6A6E`, Clay `#A35D3F`.

Run locally: `npx http-server kuriftu-heirloom` (the SVG sprite needs to be served over http, not opened from `file://`).
Deploy: Vercel project with Root Directory `kuriftu-heirloom`, no build step.
