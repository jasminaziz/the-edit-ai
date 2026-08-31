import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      /**
       * The service worker is DELIBERATELY DISABLED. Ruled 31 Aug 2026.
       *
       * `selfDestroying` ships a worker that unregisters itself, deletes every
       * cache and calls `client.navigate(client.url)` on activation. Do not
       * remove this flag to "re-enable the PWA": it has to stay until every
       * returning visitor's browser has run it once, and taking it out simply
       * reinstates the bug below.
       *
       * What went wrong. The generated worker registered
       * `NavigationRoute(createHandlerBoundToURL("index.html"))`, so every
       * navigation was served the precached shell from cache and never from
       * the network. Since that shell carries the hashed asset names, a
       * returning visitor was pinned to whatever build their worker had
       * cached. `registerType: "autoUpdate"` was set and did not help:
       * vite-plugin-pwa only performs the reload when you register through
       * `virtual:pwa-register`, whose `onNeedReload` defaults to
       * `location.reload()`. This project used the injected script instead,
       * which is a bare `navigator.serviceWorker.register('/sw.js')` with no
       * reload callback. So the new worker took control via skipWaiting and
       * clientsClaim while the tab carried on running the old bundle, and
       * because this is an SPA, internal link clicks do no document fetch at
       * all and never picked up a new build. Net effect: every deploy since
       * the PWA shipped on 5 Aug 2026 reached returning visitors one visit
       * late, and only ever on a full page load.
       *
       * Why removal rather than a fix. Offline support was never a
       * requirement here and was never chosen: the config comment below said
       * "scaffold only, no runtime caching strategy", so the precache was a
       * side effect rather than a decision. The site's premise is that a Sheet
       * edit is public in seconds and a push in about three minutes, which a
       * cached app shell directly contradicts. Removal is also the only option
       * that frees already-stuck visitors on their next page load instead of
       * their second, because of the `client.navigate` call above.
       *
       * The manifest below is untouched, so the site keeps its name, icons,
       * theme colour and standalone display. Sheet data was never affected
       * either way: it is fetched at runtime, so rows and verdicts were always
       * live. It was the code that lagged.
       */
      selfDestroying: true,
      registerType: "autoUpdate",
      // Reuse the existing brand icon set as-is — never regenerate or reinterpret.
      includeAssets: ["favicon.ico", "favicon.svg", "favicon-16.png", "favicon-32.png", "favicon-64.png"],
      manifest: {
        name: "The Edit: AI Tools for Charity Comms",
        short_name: "The Edit",
        description:
          "An opinionated AI tools directory for charity, cultural and heritage comms teams. Data location, training policy and nonprofit pricing checked on every tool. No sponsored lists.",
        theme_color: "#2D35C9",
        background_color: "#FAF8F4",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          { src: "/favicon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/favicon-512.png", sizes: "512x512", type: "image/png" },
          { src: "/favicon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      // Scaffold only — no runtime caching strategy for Sheets/API data (out of scope).
      // Default generateSW precaches the built app shell (JS/CSS/HTML) only.
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
