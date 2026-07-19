# Weatherly

Weatherly is a responsive weather application focused on clear, trustworthy everyday planning. It provides current conditions, location-aware hourly forecasts, a seven-day outlook, air quality, saved places, unit switching, and practical weather insights.

## Data sources

- Weather and air quality: [Open-Meteo](https://open-meteo.com/)
- Reverse geocoding: [OpenStreetMap Nominatim](https://nominatim.org/)

The in-app weather insights are derived from current conditions and are clearly labelled as non-official. They must not be treated as emergency alerts.

## Local development

```bash
npm install
npm start
```

The app runs at `http://localhost:3000`.

## Validation

```bash
npm test -- --watchAll=false
npm run build
```

## Product behaviour

- The last successfully viewed location and preferred unit are stored on the device.
- Geolocation is requested only after the user selects **My location**.
- Saved places and recent searches stay on the current device.
- Search supports worldwide Open-Meteo geocoding suggestions.
