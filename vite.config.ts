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
        name: "The Edit: Honest AI Tool Verdicts",
        short_name: "The Edit",
        description:
          "An independent tracker of AI tools, built for people who want a real opinion, not a feature list.",
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
