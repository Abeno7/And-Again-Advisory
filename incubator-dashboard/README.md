# Incubator Monitor — public browser demo

A static, browser-only rebuild of the four-incubator monitoring dashboard,
following the "Environmental Operations Desk" design system (DESIGN.md).
**All readings are synthetic.** No PLC, server or notification service is involved.

- `index.html`, `styles.css`, `app.js`: no build step, no dependencies (Carlito from Google Fonts).
- Views: Overview (4 unit cards, last-hour chart, facility power/network, active alarms),
  Trends (1h / 6h / 24h / 7d, hover tooltip, CSV export), Alarms (acknowledge keeps the
  condition active), System (inject scenarios as Administrator).
- Scenarios: high temperature, low humidity, high CO₂, sensor fault, utility power failure,
  communication failure.
- Motion: staggered card entrance, value tweens with a brief highlight, live sparklines,
  trend lines drawn in, pulsing critical status dot, refresh ring, toasts. All of it is
  disabled under `prefers-reduced-motion`.
- Trend colours were checked with a colour-vision validator. The two teal series in
  DESIGN.md (`series-2` vs `teal`) were too close to distinguish, so the trends use blue,
  orange, violet and green, always with a legend and direct labels.

Run locally: `python3 -m http.server` in this folder, then open http://localhost:8000.
