# Spectacle Events® — website

Static site for [spectacle-events.vercel.app](https://spectacle-events.vercel.app/).
No build step, no dependencies — plain HTML, CSS, and JavaScript.

## Pages

| File | What it is |
|---|---|
| `index.html` | Homepage — intro splash, hero slider, stats, story, services, gallery preview, process, impact, clients, **Start Planning Your Event**, contact form, map, footer |
| `plan-event.html` | Five-step event planner — visitors build a brief and submit it to Spectacle Events |
| `gallery.html` | Full event gallery with lightbox |

## Assets

| File | What it is |
|---|---|
| `assets/site.css` | The whole design system — shared by all three pages |
| `assets/site.js` | Shared behaviour — intro splash, cursor, background, hero slider, reveals, counters, mobile menu |
| `assets/planner.js` | The event planner (validation, draft saving, submission) |
| `assets/gallery.js` | Gallery lightbox |
| `assets/favicon.svg` | Brand mark favicon |
| `assets/img/` | Photography (`hero-*`, `service-*`, `story`, `founder`) and client logos (`logos/`) |

Images were extracted out of the original single-file build, so the pages load in
kilobytes instead of an 18 MB document, and every photo is cached separately.

## The event planner

`plan-event.html` walks a visitor through five steps — event basics, date and
scale, services, their details, then a review — and submits the brief to
Spectacle Events.

- Required fields are validated per step; the visitor cannot skip ahead past an
  incomplete one.
- Progress is saved to `localStorage` as they type, so a refresh does not lose
  the brief. It is cleared once the brief is submitted.
- Every submission gets a reference number (`SPE-YYMMDD-XXXX`) shown on the
  confirmation screen and included in the message.
- Deep links prefill the form: `plan-event.html?type=Gala%20Dinner%20%2F%20Awards`
  (the eight cards in the homepage *Start Planning Your Event* section use these).

### Where submissions go

Open `assets/planner.js` and look at the top:

```js
var PLAN_ENDPOINT = '';                        // e.g. 'https://formspree.io/f/xxxxxxx'
var PLAN_EMAIL    = 'info@spectacleevent.com';
```

- **`PLAN_ENDPOINT` empty (current setting)** — no backend needed. Submitting
  opens the visitor's mail app with the complete brief pre-composed and addressed
  to `PLAN_EMAIL`; the confirmation screen also offers a *Copy brief summary*
  button as a fallback.
- **`PLAN_ENDPOINT` set** — the brief is POSTed as JSON to that URL and lands in
  your inbox without the visitor doing anything else. Any form-to-email service
  works (Formspree, Web3Forms, Getform) as does your own API route. If the
  request fails, it falls back to the mail-app path above.

Setting an endpoint is the recommended next step — it is the only change needed
to make submissions arrive automatically.

## Running it locally

```sh
cd spectacle-events
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploying to Vercel

The repository root carries a `vercel.json` with `"outputDirectory": "spectacle-events"`,
so a Vercel project pointed at this repo serves this folder with no build step and
no further configuration. Alternatively set the project's **Root Directory** to
`spectacle-events` and delete that key.
