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
      registerType: "autoUpdate",
      // Reuse the existing brand icon set as-is — never regenerate or reinterpret.
      includeAssets: ["favicon.ico", "favicon.svg", "favicon-16.png", "favicon-32.png", "favicon-64.png"],
      manifest: {
        // The audience phrase is locked and the manifest is not exempt. This
        // read "for Charity Comms" until 31 Aug 2026, the one form the rule
        // forbids. It is visitor-facing, shown when the site is installed to a
        // home screen, and it sits outside every copy inventory the project
        // greps, which is how it survived the 29 Aug audience pass: a search
        // for "heritage" cannot return a string that dropped the word.
        // short_name carries the constrained case, so name can run full length.
        name: "The Edit: AI Tools for Charity, Cultural & Heritage Comms",
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
