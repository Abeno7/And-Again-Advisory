# Incubator Monitor — public browser demo

A static, browser-only rebuild of the four-incubator monitoring dashboard in a dark
operations theme: near-black cards, lime accent, pill navigation and filter chips, large
numerals, tick-bar mini charts, a dotted UPS ring and smooth trend curves.
**All readings are synthetic.** No PLC, server or notification service is involved.

- `index.html`, `styles.css`, `app.js`: no build step, no dependencies (Inter from Google Fonts).
- Views: Overview (KPI strip, 4 unit cards, UPS/power card, active alarms, last-hour chart),
  Trends (incubator chips, 1h / 6h / 24h / 7d, hover tooltip, time-in-range bar, CSV export), Alarms (acknowledge keeps the
  condition active), System (inject scenarios as Administrator).
- Scenarios: high temperature, low humidity, high CO₂, sensor fault, utility power failure,
  communication failure.
- Motion: staggered card entrance, value tweens with a lime flash, growing tick bars, UPS ring,
  trend lines drawn in, pulsing critical status dot, refresh ring, toasts. All of it is
  disabled under `prefers-reduced-motion`.
- Trend colours (blue, orange, violet, green) were checked with a colour-vision validator
  against the dark card surface, and always ship with a legend and direct end labels.
  Status colours (green / amber / red / grey) are reserved and always carry a text label.

Run locally: `python3 -m http.server` in this folder, then open http://localhost:8000.
