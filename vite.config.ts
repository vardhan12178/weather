/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // Ask before swapping in a new version (see components/UpdateToast)
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['favicon.svg', 'favicon-32.png', 'icons/apple-touch-icon-180.png'],
      manifest: {
        id: '/',
        name: 'Weatherly — Live Weather',
        short_name: 'Weatherly',
        description: 'Live weather, hourly and 7-day forecasts, air quality and alerts for any city.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#0e1a33',
        theme_color: '#1a5bbd',
        categories: ['weather', 'utilities'],
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        shortcuts: [
          {
            name: 'Search for a city',
            short_name: 'Search',
            url: '/?action=search',
            icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
          },
        ],
      },
      workbox: {
        // App shell + the Latin font file. Weather API responses are NOT cached
        // here: the forecast is persisted by TanStack Query (with its real
        // "updated" time), so offline data is never passed off as fresh.
        globPatterns: ['**/*.{js,css,html,svg,png,webmanifest}', '**/plus-jakarta-sans-latin-wght-normal-*.woff2'],
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // Other font subsets (Cyrillic, Vietnamese…) when a place name needs them
            urlPattern: ({ request }) => request.destination === 'font',
            handler: 'CacheFirst',
            options: { cacheName: 'fonts', expiration: { maxEntries: 20, maxAgeSeconds: 365 * 24 * 60 * 60 } },
          },
        ],
      },
    }),
  ],
  server: {
    port: 3000,
    host: true, // reachable from a phone on the same Wi-Fi via the "Network" URL
  },
  preview: {
    port: 4173,
    host: true,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
