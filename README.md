# Weatherly

A live weather app in the style of modern phone weather apps: a condition-
coloured sky, the current temperature up front, an hourly strip with a
one-line summary, a 7-day list, tappable detail tiles with charts, saved places,
and alerts for real warnings. Mobile-first; two columns on desktop.

It's also an installable **PWA**: add it to your home screen and it opens
instantly with your last forecast, works offline, and supports
pull-to-refresh.

Weather data comes from [Open-Meteo](https://open-meteo.com/) (no API key
needed) and place names from [OpenStreetMap Nominatim](https://nominatim.org/).

## Getting started

Requires Node 20.19+ (22 recommended).

```bash
npm install
npm run dev        # http://localhost:3000 — also prints a Network URL you can open on your phone
```

| Command             | What it does                                     |
| ------------------- | ------------------------------------------------ |
| `npm run dev`       | Dev server with hot reload                       |
| `npm run build`     | Type-check, then build to `dist/`                |
| `npm run preview`   | Serve the production build locally (the service worker only runs here, not in `dev`) |
| `npm test`          | Unit tests (Vitest)                              |
| `npm run typecheck` | TypeScript only                                  |
| `npm run lint`      | ESLint                                           |

Deploys on Netlify use `netlify.toml` (build `npm run build`, publish `dist`).

## Project structure

```
src/
  api/          Open-Meteo + Nominatim clients, raw → app model normalisation
  lib/          units (°C/°F, km/h/mph…), time zones, storage, small hooks
  types/        the app's weather model (always metric; converted for display)
  context/      user settings (unit), persisted
  features/
    weather/    screen sections, tiles, detail sheets + SVG charts, sky theme,
                data hooks (TanStack Query), alert/summary rules
    places/     places sheet: search, my location, saved, recent
    search/     live suggestions, recent searches
    favorites/  saved places
    settings/   settings sheet (units, refresh)
  components/   app-wide pieces: top bar, bottom sheet, icon button, icons, errors
  features/pwa/ service-worker updates, install prompt, pull-to-refresh
  styles/       Tailwind theme + the CSS weather backdrop (sky.css)
  pages/        Home — wires the hooks to the UI
```

Key ideas:

- **Metric in, units out.** The API is always queried in metric; `lib/units`
  converts at display time, so switching °C/°F is instant and never refetches.
- **Times are real instants.** The API returns unix timestamps; `lib/time`
  formats them in the *location's* time zone, not the viewer's.
- **Server state lives in TanStack Query** (caching, retries, refetch on focus);
  `features/weather/usePlace` decides which place is shown (GPS, search, saved,
  or the last place viewed).
- **No heavy libraries.** The sky (rain, snow, stars, clouds, lightning) is
  CSS animated with `transform` only; charts are small hand-written SVG. The
  whole app is ~100 KB of JavaScript gzipped.
- **Offline-first PWA.** The service worker (Workbox via `vite-plugin-pwa`)
  precaches the app shell and font. Forecasts are persisted by TanStack Query
  to localStorage — not cached by the service worker — so offline data keeps its
  real "updated" time. The app reopens on the last place whose forecast loaded,
  then refines "my location" with GPS in the background.
- **Accessible by default**: 44 px touch targets, nothing under 12 px, WCAG
  4.5:1 text contrast on every sky, sheets built on `<dialog>`, charts readable
  with arrow keys and as a table, and all motion off with "reduce motion".

## Installing on a phone

- **Android / Chrome / Edge:** open the site, then tap **Install** in the
  banner (or ⋯ → Settings → Install app).
- **iPhone / iPad:** open in Safari → **Share** → **Add to Home Screen**.

To test the installed experience locally, run `npm run build && npm run preview`
and open the Network URL on your phone (service workers need `localhost` or
HTTPS, so installing from a LAN address works best on the deployed site).
