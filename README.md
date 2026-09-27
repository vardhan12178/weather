# Weatherly

A live weather app: current conditions, a 24-hour and 7-day forecast, air
quality, alerts and advice, saved places, and a weather-reactive backdrop.

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
| `npm run preview`   | Serve the production build locally               |
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
    weather/    dashboard sections, data hooks (TanStack Query), alert/advice rules
    search/     search box with live suggestions, recent searches
    favorites/  saved places with live conditions
    scene/      3D weather backdrop (lazy-loaded)
  components/   app-wide pieces: header, footer, icons, error handling
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
- **Heavy code loads on demand**: charts when the chart view opens, the 3D
  backdrop after the forecast has loaded (and never with reduced motion on).
