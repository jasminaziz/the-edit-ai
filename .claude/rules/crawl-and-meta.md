---
paths:
  - "index.html"
  - "vercel.json"
  - "vite.config.ts"
  - "src/App.tsx"
  - "src/components/SEO.tsx"
  - "src/components/LegalPage.tsx"
  - "scripts/prerender.mjs"
  - "public/**"
  - "assets-src/**"
---

# Meta, prerender, routes and static files

Loads with the files above. History: `.claude/history/CLAUDE-md_2026-11-06.md`, sections "Tech stack", "Routes and canonical URLs", "Conversion" and "Crawlability and GEO".

## Meta

- `SEO.tsx` emits per-page title, description, canonical, `og:title`, `og:description`, `og:url`, `twitter:title` and `twitter:description` from the props each page passes. Every page passes title, description and canonical. It deliberately emits no `og:image` or `og:type`: the static block in `index.html` owns those sitewide and is the fallback for scrapers that run no JS. Do not add a per-page `og:image` without replacing that split deliberately.
- `data-rh="true"` on the static tags in `index.html` that `SEO.tsx` also emits is load-bearing. react-helmet-async removes only tags carrying it, so without it a static tag coexists with the injected one and the homepage description comes first in document order on every route. `og:image`, `og:type` and `twitter:card` stay unmarked, because `SEO.tsx` never emits them and marking them would make helmet strip them. Any tag added to `index.html` that `SEO.tsx` also emits needs `data-rh`.
- A client-side navigation to a route rendering no `<SEO>` removes the adopted tags, because helmet cleans up what it owns. That is not a regression: a direct load, which is what crawlers do, is unaffected.

## Prerender

- `scripts/prerender.mjs` serves the built `dist`, drives each route in Chromium so the effects run and the Sheet responds, and writes the HTML beside the bundle. No file in `src/` takes part and the data flow is untouched. A crawler that runs no JavaScript therefore sees real pages; before 11 Oct 2026 it saw an empty root.
- `react-dom/server` cannot do this job: every page fetches in a `useEffect`, and `renderToString` never runs effects, so it prerenders the spinner. Hand-written static HTML was rejected as two renderers for one set of content with nothing failing when they disagree.
- Vercel needs `@sparticuz/chromium`: the build image has none of Chromium's shared libraries and `--with-deps` shells out to apt on Amazon Linux.
- The Sheets request is sent from Node, because Chromium ignores a Referer override under `route.continue`, Google then sees `localhost:8080`, and the production key refuses it. The script's guard refuses to write pages that would look finished and say nothing; keep it.
- The prerender freezes a Sheet snapshot at build time: readers get live data, a non-JS crawler sees rows as of the last deploy. The lever, if that window ever matters, is a scheduled rebuild. The app mounts with `createRoot`, not hydrate, so a cold `/tools` paints the prerendered cards, swaps to the spinner, then repaints; Jasmin accepted that flash on 11 Oct 2026.
- The verdicts are not in the served HTML: they sit behind a conditional render, so the strongest GEO lever (quotations from a named person) is missing. Rendering always and toggling visibility is the better fix and is Jasmin's call; ruled 9 Oct 2026, left for now.
- To read a preview (deployment protection is SSO), open the Vercel connector's `get_access_to_vercel_url` link once into a curl cookie jar and curl every route with that jar; check each body for the real page and for "Log in to Vercel", because the jar stops working within the hour.
- There are no tool pages and there should not be: the directory is one page, and `/tools?tool=<slug>` is a shareable link, not an indexable route. An audit asking for "tool pages" is describing pages that do not exist.

## Routes, redirects and files

- A new route needs `App.tsx`, `ROUTES` in `prerender.mjs`, a rewrite in `vercel.json` and an entry in `public/sitemap.xml`. Case variants such as `/Tools` 404 for a crawler while the router, which ignores case, renders them for a reader.
- Three legacy paths 308 (`/stack`, `/whats-new`, `/subscribe`). Nothing links to them; keep them for old, indexed and shared links (`/stack` was shared by design).
- `public/sitemap.xml` lists live routes only, bare-domain, with no `lastmod` or `changefreq`: a hand-maintained date on every route goes stale and then lies. `/submit` is out of it by ruling (nothing on the site links to it); the route stays.
- The template is `/AI-Use-Policy-Template.docx`. There is no PDF served; the source PDF is `reports/AI-Use-Policy-Template.pdf` and is not deployed until Jasmin's corrected export from Word replaces it.
- `public/favicon.svg` is the single icon source. `assets-src/render-icons.py` draws every raster from it; never hand-edit a PNG, rerun the script. The share card is one card for every route; a changed card gets a new filename (`og-<card>-YYYY-MM.png`), never an overwrite, because platforms cache by URL. No counts on any card or icon. `assets-src/` is never deployed.
- A per-route share card was parked until the prerender landed, which it did on 11 Oct 2026; it has not been revisited.
- `vite.config.ts` keeps `selfDestroying: true` (see `CLAUDE.md`) and carries two visitor-facing manifest strings that no copy inventory covers. The manifest, icons, theme colour and standalone display are untouched, so the site is still installable.
