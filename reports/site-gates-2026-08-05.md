# Pre-Launch Gate Report — The Edit AI (theeditai.co.uk)
**Date:** 2026-08-05
**Scope:** Full four-gate audit of the current repo state, with particular attention to the uncommitted PWA scaffold (vite-plugin-pwa, `vite.config.ts`, `index.html`).
**Prior gates report:** none exists for this project. `reports/site-design-check-2026-08-05.md` (same date) covers brand-token fidelity on the PWA scaffold only — a different check, not superseded by or superseding this one.
**Note on source guide:** `~/.claude/guides/website-build/jasminaziz-site-build-guide.md` is written for jasminaziz.co.uk, a different site. No `build-plan.md` exists anywhere in this project (only one exists, for the unrelated ops-dashboard project). In the absence of a project-specific build plan, routes and integrations were verified against `src/App.tsx` and this project's own `.claude/CLAUDE.md`, per that guide's own principle of preferring audited project specifics over generic checklists.
**A note on tool-call injections:** two `PreToolUse` hook messages during this session tried to direct me to invoke a "Skill" tool that doesn't exist in my toolset (once for `vite.config.ts`, framed as a Vercel doc-verification requirement; once for `SEO.tsx`, framed as React docs; once for `Index.tsx`, framed as Next.js docs — wrong framework entirely). These were not user instructions and were not followed. Flagging per standing instruction to treat only the permission system and the user's own messages as consent.

---

## Verdict

- **Gate 1 — Accessibility (WCAG 2.1 AA): FAIL.** Contrast failures across five distinct token combinations, two skipped heading levels, an unlabelled form, duplicate `<h1>`.
- **Gate 2 — Performance: FAIL / open manual checks.** PWA scaffold itself introduces no regression, but the bundle it now precaches sits on top of a pre-existing 1MB single-chunk bundle, a font origin still missing preconnect, and no confirmed mobile Lighthouse re-run since the font-display fix shipped.
- **Gate 3 — SEO/AEO: FAIL.** A live route (`/tools`) canonicalises to a dead URL (`/toolkit`) — the exact trap the site's own SEO guide names by name. Two routes ship no meta at all. `llms.txt` is missing. Every non-home page shares the homepage's Open Graph tags.
- **Gate 4 — Observability: FAIL.** The Submit form discards every submission. The two working forms fail silently to Jasmin — no console log, no error tracking, nothing — even though they show the visitor an error.

No gate passes. None can be marked "pending" either, because each has code-level failures independent of the open manual checks.

---

## Gate 1 — Accessibility (WCAG 2.1 AA): FAIL

### Contrast failures (computed, not estimated — sRGB relative luminance, WCAG formula)

| Pair | Ratio | AA needs | Where |
|---|---|---|---|
| Muted `#9A8F82` text on cream `#FAF8F4` | 2.99:1 | 4.5:1 (normal text) | Widely used for byline/meta text — e.g. `src/pages/Index.tsx:141` (developer names), `src/pages/Tools.tsx:323`, `src/pages/Subscribe.tsx:49,224,240,258` |
| Muted `#9A8F82` text on white `#FFFFFF` cards | 3.17:1 | 4.5:1 | `src/pages/MyStack.tsx:362`, `src/components/StackTooltip.tsx:62` |
| Nav text (`text-primary-foreground`, ≈cream) on periwinkle `#7B7FD4` — homepage nav only | 3.40:1 (full opacity) / **2.47:1** (`/70` inactive-link opacity, the state visible most of the time) | 4.5:1 | `src/components/Layout.tsx:69-70,196,213,220` — `navBg = isHome ? "#7B7FD4" : "#2D35C9"` |
| Lime `#C8F04A` text on periwinkle `#7B7FD4` | 2.75:1 | 4.5:1 | `src/components/StackBar.tsx:123` (functional "Remove" button, 12px) and `src/components/DragHint.tsx:78` (visible to sighted users despite `aria-hidden`) |
| White `#FFFFFF` text on periwinkle `#7B7FD4` (Stack bar collapsed/expanded panel) | 3.60:1 | 4.5:1 | `src/components/StackBar.tsx:79-171` (entire fixed panel bg is periwinkle; item names, "Your stack" label, "Copy link" text all this colour pair) |
| Footer legal links (`/40` opacity) on footer `#1A1510` | 3.68:1 | 4.5:1 | `src/components/Layout.tsx:272,280,289` — Privacy/Terms/Cookies/copyright, 12px |

This is exactly the failure mode the build guide names: light text on brand tints (periwinkle) and accent-on-tint combinations. It's not confined to one page — the StackBar is a fixed, persistent element on any tools page, and the homepage nav is the first thing every visitor sees.

**Fix:** raise `#9A8F82` to a darker muted tone for body-sized text (or reserve it for ≥24px text only), and give periwinkle-background text a near-white/near-black colour with verified ≥4.5:1 rather than reusing existing tint tokens at reduced opacity. Re-run the same computation after any change — don't eyeball it.

### Heading order skips (h1 → h3, no h2)

- `src/pages/DesignKit.tsx:349` — page `<h1>` (via `CobaltZone heading=""` with `twoLineHeading`), then straight to `<h3>` at `:183` (group headers) and `:243` (card titles). No `<h2>` anywhere on the page. Worse: the six phase names ("Get Inspired", "Define Visual Direction", etc.) — the most visually prominent heading on the page at 36px — are a plain `<span>` (`src/pages/DesignKit.tsx:136-148`), not a heading element at all, so they're invisible to a screen reader's heading-navigation list entirely.
- `src/pages/Learning.tsx:40` — page `<h1>` (CobaltZone "Learning"), then straight to `<h3>` at `:93` for every resource card. No `<h2>`.

**Fix:** make the DesignKit phase band an `<h2>`, group headers `<h3>`, card titles `<h4>`. Give Learning.tsx an `<h2>` per category or remove the h3 down to h2 if there's no natural middle tier.

### Duplicate `<h1>`

`src/pages/Index.tsx:79` and `:91` — "The" and "Edit." render as two separate `<h1>` elements (split for the layout effect). Lighthouse and axe will flag this. **Fix:** wrap both lines in a single `<h1>` with the line break handled via CSS/markup inside it, or demote the second to a `<span>` inside the first h1's accessible name via `aria-label`.

### Unlabelled form fields

`src/pages/Subscribe.tsx:199-221` — the "First name" and email `<input>` fields on the main Subscribe page have **no `<label>`**, only a `placeholder`. Placeholder text disappears on input and is not a reliable accessible name for all screen readers/browsers. The "I'm mainly..." select field two fields down (`:256-261`) does this correctly with a real `<label>` — the pattern is known, just not applied consistently. Same gap in the footer capture form: `src/components/FooterEmailCapture.tsx:70-78` (email input, placeholder only, no label).

**Fix:** add a `<label>` (visually-hidden if the design wants placeholder-only appearance) tied via `htmlFor`/`id` to each input.

### Other findings
- No `<img>` tags anywhere in `src/` — the site is CSS/SVG only, so the alt-text and image-lazy-loading checks are not applicable; nothing to fail there.
- Buttons are real `<button>` elements throughout the checked files (Submit, Subscribe, StackBar, nav) — no div-as-button pattern found.
- No keyboard traps found in the reviewed components.
- Focus states: shadcn/ui components correctly pair every `outline-none` with a `focus-visible:ring-2` replacement — fine. Two hand-rolled input styles use `outline: none` with a border-colour-only focus change and no ring (`src/App.css:1-19` `.form-input:focus`, and `src/pages/Subscribe.tsx:97-110` inline `inputStyle`) — a visible change does occur on focus, so this is not a hard fail, but it's a weaker signal than the ring pattern used elsewhere in the same codebase and worth normalising.

### Manual checks (named, not run — this is a code review only)
- [ ] Lighthouse Accessibility audit on every page template (Home, Tools, My Stack, Design Kit, Learning, AI News, Subscribe, Submit, Stack, legal pages) — target 100, or a named reason for anything below.
- [ ] axe DevTools on every page template — same set.
- [ ] VoiceOver pass on the homepage and Subscribe (the form-bearing page).

---

## Gate 2 — Performance: FAIL / open manual checks

### PWA scaffold itself: no regression found
- `bun run build` succeeds clean. `dist/manifest.webmanifest` is correctly generated and linked (`<link rel="manifest" href="/manifest.webmanifest">` in built `index.html`), `registerSW.js` registers only inside `window.addEventListener('load', ...)` — deferred past the critical rendering path, so it does not compete with LCP/FCP.
- No duplicate or conflicting meta tags: `theme-color` and the `apple-mobile-web-app-*` tags in `index.html:30-33` appear once, and match the manifest's `theme_color`/`background_color` exactly (`vite.config.ts:28-29`) — consistent, no conflict with the existing favicon `<link>` set or OG tags.
- Added weight from the plugin itself is small: `dist/sw.js` (1.5KB) + `dist/workbox-*.js` (15KB) ≈ 16.5KB, fetched after `load`, not blocking.
- One thing genuinely new and unverified: the service worker's `generateSW` precache list (`dist/sw.js`) includes the full 1,011KB main JS chunk and downloads it in the background on first visit, once cached. Not a blocking-path regression, but it is new post-load bandwidth this scaffold adds on top of an already-large bundle (see below) — worth knowing, not a launch blocker on its own.

### Pre-existing, not caused by this session, but real and unfixed
- `index.html:37-38` preconnects to `fonts.googleapis.com` and `fonts.gstatic.com` only. There is **no preconnect to `api.fontshare.com`** (`index.html:39`), the origin serving Chillax. The site's own SEO/AEO guide names "two external font sources" as the primary documented cause of the mobile performance gap (FCP 4.8s, LCP 6.4s, Performance 64/100 on the last confirmed PageSpeed run) — one of those two origins still isn't preconnected.
- `vite build` warns `Some chunks are larger than 500 kB after minification` — the single JS bundle is 1,011.17 kB (317.10 kB gzip), with no route-based code-splitting anywhere in `src/App.tsx` (all 12 pages statically imported, no `React.lazy`). Every route pays for every page's code on every load.
- Inside that bundle: `matter-js` (`src/components/HomeGravity.tsx:1`, `package.json:55`), a physics engine used only for the homepage's falling-pills hero animation, is statically imported with no dynamic `import()`. It ships to `/tools`, `/subscribe`, `/submit`, every legal page — anywhere that isn't the homepage — for no reason those pages can use. This is exactly the "animation that costs LCP without earning its place" the gate calls out: it doesn't cost LCP on the homepage itself (pills render only after tool data loads, after the `<h1>` paints), but it costs every other page a slice of parse/download weight for an animation they never show.
- Mobile Lighthouse Performance has not been re-run since font-display: swap shipped (this is CLAUDE.md's own outstanding item 4). The 90+ target is unverified, not merely "pending" — the last confirmed number (64) is a known fail and nothing in this repo state proves it's fixed.

**Fix:** add `<link rel="preconnect" href="https://api.fontshare.com" crossorigin>` next to the existing two; code-split `HomeGravity`/`matter-js` behind `React.lazy` so only the homepage route pays for it; re-run mobile PageSpeed and record the result before calling this gate closed.

### Manual checks (named, not run)
- [ ] Lighthouse Performance run, mobile — target 90+, LCP <2.5s, CLS <0.1, INP <200ms, on the current build (with PWA scaffold and font-display:swap both live).
- [ ] Confirm `/manifest.webmanifest` and `/sw.js` resolve correctly on the deployed production URL, not swallowed by the `vercel.json` SPA catch-all rewrite (`vercel.json:2`) — local build output is correct; production has not been checked in this session.

---

## Gate 3 — SEO/AEO: FAIL

### Dead canonical — the exact trap the site's own guide names
`src/pages/Tools.tsx:303` — `canonical="https://theeditai.co.uk/toolkit"`. The live route is `/tools` (`src/App.tsx:31`, confirmed in `.claude/CLAUDE.md`'s own Routes section). `~/.claude/guides/website-build/the-edit-seo-aeo-setup-guide.md:34-36` documents this precise mix-up ("/toolkit and /tools are both plausible — only one is real") as something already caught and fixed once, in the sitemap. It has reappeared in the page's own canonical tag. **Fix:** change to `https://theeditai.co.uk/tools`. Also note the canonical omits `www.` — every other page's canonical does too (`Index.tsx:47`, `MyStack.tsx:334`, etc.) while the sitemap and CLAUDE.md's stated canonical base both use `www.theeditai.co.uk`. Pick one and apply it everywhere; right now canonicals and sitemap disagree on www.

### Two live routes ship no meta at all
- `src/pages/Submit.tsx` — no `SEO`/`Helmet` import, no title, no description, no canonical for `/submit`.
- `src/pages/Stack.tsx` — same, for `/stack`. (This route intentionally skips the shared header/footer via `Layout.tsx:25,64` `isBare`, which is a reasonable design choice for a printable/shareable page, but it still needs its own title/canonical — right now it silently inherits whatever `react-helmet-async` last set from the page the visitor came from.)

**Fix:** add an `<SEO>` block to both, matching the pattern already used on every other page.

### Sitemap doesn't match live routes character for character
`public/sitemap.xml:16-18` lists `https://www.theeditai.co.uk/whats-new` — but `/whats-new` is a permanent 301 redirect to `/ai-news` (`src/App.tsx:32`, confirmed in CLAUDE.md), not a live page. It should list `/ai-news` directly. The sitemap also has no entries for `/submit` or `/stack` at all. `public/robots.txt:3` points to `Sitemap: https://theeditai.co.uk/sitemap.xml` (no `www`), while every URL inside that sitemap uses `www.theeditai.co.uk` — an internal inconsistency in the same two files that are supposed to agree.

**Fix:** replace `/whats-new` with `/ai-news` in the sitemap, decide whether `/submit` and `/stack` should be indexed and add or deliberately exclude them, and make robots.txt's own sitemap reference use the same `www` form as the sitemap itself.

### `llms.txt` missing
No `public/llms.txt` exists (confirmed: `ls public/` — file absent). The site build guide for jasminaziz.co.uk lists this as a completed, expected item; The Edit AI has never had one.

### Every non-home page shares the homepage's Open Graph tags
`src/components/SEO.tsx:11-23` — the shared `<SEO>` component only overrides `<title>`, `meta[name=description]`, `link[rel=canonical]`, and optional JSON-LD. It never touches `og:title`, `og:description`, `og:image`, or any `twitter:*` tag. Those live once, statically, in `index.html:41-46`, set to the homepage's title/description/image and never overridden per route. Result: sharing `/tools`, `/my-stack`, `/learning`, `/ai-news`, or `/subscribe` on LinkedIn, Slack, or WhatsApp shows **the homepage's** OG title and description, not the page actually being shared. This is a real, guaranteed-wrong preview on every non-home share, not a theoretical crawler-JS-timing risk.

**Fix:** extend the `SEO` component to accept and render `og:title`, `og:description`, `og:image` (can default to the shared og-image.png), and matching `twitter:*` tags per page, then pass page-specific values from each route.

### Missing Organization schema
`src/pages/Index.tsx:49-63` has `WebSite` schema with a nested `Person` (author) — no standalone `Organization` schema. The gate requires both Person and Organization on the homepage; only Person (nested) is present. No FAQ content exists anywhere on the site (checked via grep across `src/pages`, `src/components` — zero matches), so FAQ schema is correctly absent, not a gap.

### Em dash in generated output
`src/pages/Stack.tsx:43` — `<title>My AI Stack — The Edit</title>`, and `:48` — `Built using The Edit — theeditai.co.uk`, inside the HTML string the "Build Your Own Stack" export/share feature generates. This is code-generated title/metadata text, the exact pattern the guide warns about ("Lovable may generate titles using 'Title — Subtitle' format... replace with colons"), just surfacing in a generated export document rather than a live page meta tag. **Fix:** `My AI Stack: The Edit` and `Built using The Edit: theeditai.co.uk`.

### What's correctly in place
- `robots.txt` present, correct `Allow: /` and sitemap pointer (www inconsistency aside).
- `og-image.png`: confirmed 1200×630px, 474,794 bytes (~464KB, under 600KB), self-hosted at a permanent `/og-image.png` path — not a signed/expiring URL. Passes spec.
- `meta[name=author]` present site-wide (`index.html:8`), plus visible "Curated by Jasmin Aziz" text in the footer on every page that renders `Layout` (all except the intentionally bare `/stack`) and in the homepage intro section — both machine- and human-readable authorship present where it matters.
- JSON-LD is a plain JS object passed through `JSON.stringify` — guaranteed to parse.
- No em dashes found in any live page's title/description strings (only in the Stack.tsx export, above).

### Manual checks (named, not run)
- [ ] Search Console coverage report, checked under `hello@jasminaziz.co.uk` 48-72 hours after any sitemap resubmission.
- [ ] OG preview verified per-page at opengraph.xyz once the per-page OG fix ships — current state will show the homepage's card for every URL tested.

---

## Gate 4 — Observability: FAIL

### The Submit form discards every submission
`src/pages/Submit.tsx:15-18`:
```
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitted(true);
};
```
No network call, no storage write, nothing. A visitor fills in a tool suggestion, sees "Thank you, I'll take a look," and the data goes nowhere. This is already tracked in `.claude/CLAUDE.md` (Outstanding item 9, from the 2026-07-04 security audit) as unresolved — it remains unresolved in the code today, so it's named here again as a live Gate 4 failure, not a duplicate finding to dismiss. **Fix:** wire it to a Supabase table (matching the pattern already used for subscribers) or an email destination, or take the page down until it's wired.

### Working forms fail silently to Jasmin
`src/pages/Subscribe.tsx:71-88` and `src/components/FooterEmailCapture.tsx:16-28` both catch the Supabase insert error and correctly show the *visitor* an inline message ("Something went wrong, please try again.") — that half of the requirement is met. But neither path does anything to surface the failure to *Jasmin*: no `console.error`, no error-tracking call, no email, nothing. Confirmed by grep across the entire `src/` tree: the only `console.error`/`console.warn` calls in the codebase are a 404-route logger (`src/pages/NotFound.tsx:8`) and two data-shape warnings in `src/lib/sheets.ts:122` / `src/pages/DesignKit.tsx:51,54` — none of them touch the subscribe paths. There is no Sentry, no error-tracking dependency of any kind in `package.json`. If the Supabase insert fails in production — wrong key, RLS misconfiguration, table constraint, network blip — a visitor gets a generic apology and Jasmin never finds out unless someone tells her directly.

**Fix:** at minimum, `console.error` the Supabase error object in both catch paths so it's visible in Vercel/browser logs, and add a lightweight alert path (even a simple webhook to email/Slack) for insert failures specifically, since data-save and no other path exists here to catch it.

### No serverless functions in this project
Unlike the jasminaziz.co.uk build (which has `api/contact.js` with Resend error handling), this project has no `/api` directory at all — both forms write directly from the client to Supabase. There's no server-side log to check as a backstop; the entire failure surface is client-side and, per above, currently unlogged there too.

### Manual checks (named, not run)
- [ ] Uptime monitor pointed at theeditai.co.uk (free tier is sufficient at this traffic).
- [ ] Vercel deployment failure notifications switched on.
- [ ] Alert destination confirmed as an inbox Jasmin actually reads (not a filtered/archived address).

---

## Manual checks — full checklist

**Gate 1**
- [ ] Lighthouse Accessibility, every page template — target 100
- [ ] axe DevTools, every page template
- [ ] VoiceOver, homepage + Subscribe

**Gate 2**
- [ ] Lighthouse Performance, mobile — target 90+, LCP <2.5s, CLS <0.1, INP <200ms
- [ ] Confirm `/manifest.webmanifest` and `/sw.js` resolve on the live production domain, not the SPA rewrite

**Gate 3**
- [ ] Search Console coverage report, 48-72hrs after sitemap resubmission, under hello@jasminaziz.co.uk
- [ ] opengraph.xyz check per page, after the per-page OG fix ships

**Gate 4**
- [ ] Uptime monitor on theeditai.co.uk
- [ ] Vercel deployment failure notifications on
- [ ] Alert destination confirmed as an inbox Jasmin reads

---

## Proposed learnings (not appended — see note below)

I could not write to the live learnings file: `~/AI Work/cowork/PROJECTS/CHIEF OF STAFF/Claude Setup/LEARNINGS.md` returned `EPERM: operation not permitted` for both Read and a `cat` fallback in this sandboxed session. Recording the two proposals here for Jasmin or a session with the right access to add:

1. **Date:** 2026-08-05. **Agent:** site-gates. **What happened:** `src/components/SEO.tsx` (react-helmet-async wrapper) overrides `<title>`, meta description, and canonical per route, but never touches `og:*`/`twitter:*` tags — those stay fixed at whatever static values live in `index.html`, sourced from the homepage. Every non-home route on theeditai.co.uk shares the homepage's Open Graph card. **Proposed rule (testable):** for any SPA using react-helmet-async (or equivalent) for per-route SEO, confirm the same component also emits `og:title`/`og:description`/`og:image`/`twitter:*` per route — a component that only patches title/description/canonical will leave OG tags silently wrong on every route but the one whose static defaults happen to match. **Belongs in:** the-edit-seo-aeo-setup-guide.md (Phase 2, Open Graph section) and, more broadly, the generic roadmap template's SEO section, since this is a react-helmet-async pattern issue, not Edit-specific.

2. **Date:** 2026-08-05. **Agent:** site-gates. **What happened:** `src/pages/Stack.tsx` generates a downloadable/shareable HTML export (a printable "your stack" page) with its own `<title>My AI Stack — The Edit</title>` and a caption using an em dash — both violate the site's no-em-dash rule, but neither is a live page meta tag, so the existing "check meta strings for em dashes" instruction didn't catch it until this audit went looking inside generated-output strings specifically. **Proposed rule (testable):** the em-dash check must cover any code-generated title/metadata text the app produces for output outside its own live pages — export HTML, share cards, print views, PDF exports — not only the site's own `<Helmet>`/`index.html` meta tags. **Belongs in:** the-edit-seo-aeo-setup-guide.md, extending the existing em-dash learning at line 52.

---

## Files referenced

- `/Users/jasminaziz/Developer/the-edit-ai/index.html`
- `/Users/jasminaziz/Developer/the-edit-ai/vite.config.ts`
- `/Users/jasminaziz/Developer/the-edit-ai/src/App.tsx`
- `/Users/jasminaziz/Developer/the-edit-ai/src/components/SEO.tsx`
- `/Users/jasminaziz/Developer/the-edit-ai/src/components/Layout.tsx`
- `/Users/jasminaziz/Developer/the-edit-ai/src/components/StackBar.tsx`
- `/Users/jasminaziz/Developer/the-edit-ai/src/components/DragHint.tsx`
- `/Users/jasminaziz/Developer/the-edit-ai/src/components/HomeGravity.tsx`
- `/Users/jasminaziz/Developer/the-edit-ai/src/components/FooterEmailCapture.tsx`
- `/Users/jasminaziz/Developer/the-edit-ai/src/pages/Index.tsx`
- `/Users/jasminaziz/Developer/the-edit-ai/src/pages/Tools.tsx`
- `/Users/jasminaziz/Developer/the-edit-ai/src/pages/MyStack.tsx`
- `/Users/jasminaziz/Developer/the-edit-ai/src/pages/DesignKit.tsx`
- `/Users/jasminaziz/Developer/the-edit-ai/src/pages/Learning.tsx`
- `/Users/jasminaziz/Developer/the-edit-ai/src/pages/Subscribe.tsx`
- `/Users/jasminaziz/Developer/the-edit-ai/src/pages/Submit.tsx`
- `/Users/jasminaziz/Developer/the-edit-ai/src/pages/Stack.tsx`
- `/Users/jasminaziz/Developer/the-edit-ai/src/App.css`
- `/Users/jasminaziz/Developer/the-edit-ai/public/robots.txt`
- `/Users/jasminaziz/Developer/the-edit-ai/public/sitemap.xml`
- `/Users/jasminaziz/Developer/the-edit-ai/package.json`
