# Pre-launch gates: The Edit AI (theeditai.co.uk), 9 October 2026

**Scope:** code at `origin/main` `1235918` (detached checkout, nothing installed, nothing built), plus read-only fetches of https://theeditai.co.uk on 9 October 2026 (honest user agent, one second apart). Run as interview preparation: a recruiter will look Jasmin up, so the site is held to her own checks.

**Guide:** `web-build-guide.html` v1.3, verified 14 Aug 2026, so under two months old and inside the six-month window. Used as authority. Its §7 and §8 panels for this property carry the same 14 Aug date and predate the 30 Aug overhaul; treated as dated claims and checked against code and the live site (what moved is below).

**Stack (§2):** Vite + React + TypeScript, so `/public/` is the correct home for `robots.txt` and `sitemap.xml`. No false failure raised there.

**Gate 4 naming:** the guide's Gate 4 is "security and operations". This report audits the operations half only. **site-security owns the rest of Gate 4** (headers, secrets, RLS, key restriction, consent); no Gate 4 pass is awarded here.

**Earlier reports read:** `reports/site-gates-2026-08-05.md` (the one you named) and `reports/2026-09-13-gates-site-map.md` (a second gates report that exists in the checkout; used as the closer baseline).

---

## Verdict

- **Gate 1, Accessibility (WCAG 2.2 AA): FAIL.** The homepage nav ships three known AA contrast failures by ruling; a smaller alpha-contrast miss and a span-as-heading persist. No Lighthouse, axe or VoiceOver run is recorded.
- **Gate 2, Performance: FAIL.** One font origin still unpreconnected, no route-level code splitting, main chunk over the 500KB threshold (13 Sep build figure, not rebuilt today), and no recorded PageSpeed score since relaunch.
- **Gate 3, SEO/AEO: FAIL.** Production serves an empty `<div id="root">` to every non-JavaScript crawler on every route, so the answer-engine case for the site is structurally unmet. `robots.txt` is a bare wildcard, no Organization schema, legal pages carry no title or description, and the three legacy redirects return 200.
- **Gate 4, Operations half: FAIL at code level, plus open manual checks.** Every Sheet fetch failure is swallowed into an empty result with no signal to Jasmin. No uptime monitor is evidenced anywhere.

No gate passes.

**Headline for the interview:** the single worst finding is the empty shell. A recruiter who runs the homepage through any tool that does not execute JavaScript, or asks an answer engine about the site, gets no content. Fix is already built on `geo/prerender`; it is unmerged.

---

## Gate 3: SEO and AEO: FAIL (full audit)

### 3.1 Production serves an empty shell to non-JS crawlers (structural; worst finding)

Verified live, 9 Oct 2026. `/` and `/tools` both returned HTTP 200, `text/html`, **5,145 bytes, identical**. The body is `<div id="root"></div>` and nothing else: no h1, no copy, no tool text, no footer, no "Curated by Jasmin Aziz", no JSON-LD, no canonical. `/whats-new`, `/stack`, `/subscribe` and `/nonexistent-xyz` return the same shell with 200. The shell has grown from 4,380 bytes (4 Sep, `.claude/CLAUDE.md` "Crawlability and GEO") to 5,145 because `<head>` gained tags; the body is still empty. The CLAUDE.md claim matches the live site: confirmed, not assumed.

Consequences for what a non-JS reader (GPTBot-class fetchers, OAI-SearchBot, Claude-SearchBot, PerplexityBot, LinkedIn, Slack, WhatsApp scrapers) can see:
- Every URL presents the **homepage** title, description, og:title and og:description (`index.html:6,29,56-59`), because per-route values come from `SEO.tsx` and only exist after JavaScript runs. The per-route `SEO.tsx` fix to OG (`SEO.tsx:27-31`, now emitting og:title, og:description, og:url, twitter:title, twitter:description) works for browsers and Googlebot, not for scrapers. The 5 Aug finding "every non-home page shares the homepage's Open Graph tags" is therefore **fixed in code and unchanged in effect for every scraper that does not run JS.**
- No canonical in the static head (`index.html` has none), so non-JS readers get no canonical on any URL.
- No noindex on unknown URLs for non-JS readers: the 404 noindex (`SEO.tsx:26`, `NotFound.tsx:90-99`) is JS-injected.
- Authorship is machine-readable only as `<meta name="author">` (`index.html:30`); the visible author text (footer) is JS-rendered.

**Fix:** merge `geo/prerender` once the dashboard setting it waits on is done. `origin/geo/prerender` is 4 commits ahead of its merge base and **67 commits behind `origin/main`** (last commit 5 Sep 2026), so it needs a rebase before it can merge and a re-proof against the current route set. The blocker recorded in CLAUDE.md is `VITE_GOOGLE_SHEETS_API_KEY` missing from Vercel's Preview environment (not re-verified today; needs a dashboard check). Until it lands, the guide's wording applies: this is a structural finding, not a tuning item (§4 Gate 3, SPA caveat).

**Open on the same branch (recorded in CLAUDE.md, not re-verified):** even prerendered, the verdict prose sits behind a conditional render, so 23 toggles reach the HTML and zero verdicts do. That is Jasmin's call per the file.

### 3.2 `robots.txt` is a bare wildcard: an unmade decision

`public/robots.txt:1-2` is `User-agent: *` / `Allow: /`. Live copy is byte-identical (532 bytes, `text/plain`). No AI crawler is named. The guide's position (August 2026) is to allow OAI-SearchBot, Claude-SearchBot and PerplexityBot explicitly and decide GPTBot, ClaudeBot and Google-Extended separately. For a site whose job is being cited, naming the three answer-engine bots is the minimum. **Fix:** add explicit `User-agent:` blocks for the three citation bots with `Allow: /`, and a recorded per-property decision on the three training bots. This is still a recorded gap from 13 Sep; it persists. The sitemap pointer (`robots.txt:12`) uses the canonical host: correct.

### 3.3 No Organization schema

`src/pages/Index.tsx:81-103`: `WebSite` with a nested `author` of type `Person`. No `Organization`. The guide's gate asks for Person and Organization on the homepage. The JSON-LD is built with `JSON.stringify` (`SEO.tsx:36`) so it parses; the `Person.url` points at jasminaziz.co.uk, which is correct and ties the entity graph. No FAQ content exists, so no FAQPage is owed. Persists from 5 Aug and 13 Sep.

**Conflict to be ruled by Jasmin, not by me.** The repo's CLAUDE.md ("Two things are NOT levers", `.claude/CLAUDE.md` Crawlability section) says schema markup showed no uplift in her own GEO evidence table and "must never be recommended as GEO work". The guide still lists Person and Organization as a Gate 3 check. I have reported against the guide because the gate is the guide's. Options: add a minimal `Organization` block (minutes of work, no claimed GEO benefit), or record a ruling that exempts this property from that line. Either way note that all JSON-LD is JS-injected and invisible to non-JS crawlers until 3.1 ships.

### 3.4 Legal pages ship no title and no description

`src/components/LegalPage.tsx:28-31` renders a Helmet with a canonical only. `/privacy-policy`, `/terms-of-service` and `/cookie-policy` are in the sitemap (`public/sitemap.xml:35-46`). The file's own comment records the side effect: mounting Helmet removes the `data-rh` static fallback tags, so these pages now carry no description at all. With no `<title>` in the Helmet, helmet leaves the document title as whatever the previous route set; I have not confirmed that in a browser, so that part is unverified. **Fix:** add `title` and `description` props to `LegalPage` and pass them from the three pages (the copy is Jasmin's to write per the file's own note). Persists from 13 Sep.

### 3.5 The three legacy redirects return 200, not 301

`src/App.tsx:36,38,43` use client-side `<Navigate replace>`. Live: `/whats-new`, `/stack` and `/subscribe` each return HTTP 200 with the shell. A client-side redirect consolidates nothing for any crawler or scraper that does not run JS, and `/stack` is a path live share links point at by design (CLAUDE.md). The sitemap lists none of the three, so no redirecting URL is listed. **Fix:** add three `redirects` entries with `permanent: true` to `vercel.json` (they evaluate before the catch-all rewrite): `/whats-new` to `/ai-news`, `/stack` to `/tools`, `/subscribe` to `/policy-template`. Keep the client `Navigate` routes as a fallback. Note a stray second copy of the rewrite config at `src/vercel.json`; Vercel ignores it from there, but it will mislead whoever edits it.

### 3.6 Soft 404

`vercel.json:2-3` is a single catch-all rewrite, so `/nonexistent-xyz` returns 200 (verified live). The JS noindex covers Googlebot only. A real 404 status needs a prerender or an edge rule; it resolves with 3.1. Recorded, not separately blocking.

### 3.7 Titles use a pipe, not the guide's colon

Every title is "Page | The Edit" (`Learning.tsx:37`, `Tools.tsx:482`, `Index.tsx:77`, `index.html:6`, others). The guide's format is "Title: Subtitle". No em dashes found in any title or description string (grepped `src/pages`, `src/components`, `src/lib`, `index.html`, `public`), so the hard rule holds. The pipe is a convention mismatch. The `Stack.tsx` export em dashes cited on 5 Aug are gone because the file no longer exists. I report this as a low-severity deviation, not a fail; confirm whether the house format now permits the pipe before changing 12 titles.

### 3.8 What passes (checked)

- **Canonical host:** apex is canonical and enforced. Live: `http://theeditai.co.uk/` returns 308 to https; `https://www.theeditai.co.uk/` and `/tools` return **308** to the apex. Canonicals (every `SEO` call, `LegalPage.tsx:30`), all 11 sitemap `<loc>` values and the robots sitemap pointer use the apex. Internal consistency holds. This fixes the 14 Aug house record (307, www/apex mismatch). One note: `http://www.theeditai.co.uk/` redirects first to `https://www...` and then to the apex, two hops, both permanent.
- **Sitemap against routes:** live sitemap is byte-identical to `public/sitemap.xml` (1,157 bytes, `application/xml`). Its 11 URLs match the live routes in `src/App.tsx` character for character: `/`, `/tools`, `/radar`, `/my-stack`, `/ai-news`, `/policy-template`, `/design-kit`, `/learning` and the three legal pages. `/submit` is correctly absent (a mailto page, `Submit.tsx:39-53`, in the 13 Sep sitemap change). No `/toolkit`, no `/whats-new`, no www anywhere (`grep` over `src`, `public`, `index.html`, `vite.config.ts`, `vercel.json`: no matches outside the intentional Sheets referer). This closes the 5 Aug dead-canonical and wrong-sitemap-entry findings.
- **Unique title, description and canonical on all indexable routes except the three legal pages (3.4).** Descriptions differ per route.
- **OG and Twitter, static layer:** `og:image` and `twitter:image` are `https://theeditai.co.uk/og-edit-2026-09.png` (`index.html:65,69`), permanent self-hosted PNG, **1200 x 630, 40,383 bytes** (checked on disk and live: `image/png`, 40,383 bytes), under the 600KB cap, not SVG, not a signed URL. Alt text present. This closes the 5 Aug OG-image items.
- **Shared meta component:** `SEO.tsx` overrides OG and Twitter title, description and url per route in the browser, and the `data-rh` mechanism removes the duplicate static tags (`index.html:7-28`). Works as designed for JS-running readers; see 3.1 for scrapers.
- **Authorship:** `<meta name="author" content="Jasmin Aziz">` (`index.html:30`) plus visible author text (JS-rendered, so subject to 3.1).
- **SPA txt/xml caveat:** `robots.txt` (`text/plain`), `sitemap.xml` (`application/xml`) and `manifest.webmanifest` (`application/manifest+json`) each serve as their own type on the live URL. They are real files, not the catch-all.
- **llms.txt:** absent. Live `/llms.txt` returns 200 `text/html` at the shell's 5,145 bytes, which is the catch-all, not a file. Not a gate item since August; **no failure raised**. A draft exists at `reports/2026-08-31-llms-txt-draft.md`, and CLAUDE.md rules it out; expect nothing from it either way.
- **FAQ schema:** no FAQ content, none owed.

### 3.9 Manual checks (Gate 3)
- [ ] Search Console (hello@jasminaziz.co.uk): property verified (token present, `index.html:31`), sitemap submitted, coverage report checked 48 to 72 hours after the next submission, **and the result recorded in `reports/`**. No record exists anywhere in the repo for any crawl check (the May check stayed open per the guide).
- [ ] opengraph.xyz on `/`, `/tools`, `/my-stack`, `/policy-template`, `/learning`. Expect the homepage card for every URL until 3.1 ships.
- [ ] Google Rich Results Test on the homepage JSON-LD.
- [ ] After any prerender merge, curl every route without JS and confirm body text, canonical and per-route title in the served HTML.

---

## Gate 1: Accessibility (WCAG 2.2 AA): FAIL

Code reading only; contrast figures computed with the WCAG relative-luminance formula against the tokens in `src/index.css` and the hex values in components. LC17 to LC20 are cited where a finding maps to the launch compliance accessibility rows; I have not re-read that checklist file in this run, so the mapping is by row group, **unverified against the file**, and site-compliance should confirm the IDs.

### 1.1 Homepage nav ships three known AA failures (ruled, still a fail)

`src/components/Layout.tsx:130-150`, `navBg = isHome ? "#7B7FD4" : "#2D35C9"` (line 148). The file records that this "knowingly reinstates three AA failures": cream nav links 3.40:1, lime "Menu" label 2.75:1 (recomputed today: 3.40 and 2.75, exact), and the cobalt wordmark on the hero 2.37:1 against the 3:1 display floor. Jasmin ruled it on 1 Sep 2026. A ruling explains why it is there; it does not turn the gate into a pass. Also on the homepage nav: inactive links at `text-white/70` on periwinkle (`Layout.tsx:218`, 270) compute to **2.59:1**, and white at 80% (line 256) to 2.89:1. The same classes on cobalt, every other route, pass (4.95:1 and 6.03:1).
**Options, neutrally:** (a) accept the failure on the homepage and record it as a named exception on the gate; (b) keep periwinkle hero and move the nav to a cobalt bar so the text clears 4.5:1, which loses the blended look; (c) use a darker periwinkle for the nav only. The file's own computation says no single value clears both nav text and wordmark. Because the homepage is the first page a recruiter opens, I flag this as the Gate 1 item most worth Jasmin's decision. (LC17 to LC20 contrast row group.)

### 1.2 Alpha text under 0.75 on a non-white background

- `src/pages/DesignKit.tsx:174`: phase explainer at `rgba(255,255,255,0.65)` on `#2D35C9`, 16px normal weight. Blended **4.49:1** against a 4.5:1 floor. A miss by 0.01, but a miss. **Fix:** raise to 0.70 (4.95:1) or 0.75.
- `src/components/Layout.tsx:528,534,540,544`: footer legal links and copyright at `text-primary-foreground/40` (cream) on `#1A1510` at 12px. Blended about **3.8:1** (white at 40% computes to 3.85:1; cream is marginally lower). Fails 4.5:1. This was in the 5 Aug report as `/40` and **persists**. **Fix:** `/60` (about 7.0:1) or `/70`.
- `src/App.css:14`: `.form-input::placeholder` is `#9A8F82` (2.99:1 on cream, 3.17:1 on white). I found no consumer of `.form-input` in `src/` besides the CSS itself, so I treat it as dead code, not a live failure; delete it or recolour to `#6B625A`.

### 1.3 Prominent heading built as a styled span

`src/pages/DesignKit.tsx:139-148` (and the sibling span at 154): the six phase names ("Get Inspired" and so on) are `<span>`s in a cobalt band, the most visually prominent text on `/design-kit` and invisible to screen-reader heading navigation. This is the exact named failure in the guide. Persists from 5 Aug. **Fix:** make the phase name an `<h2>` and demote the card-title and group `<h3>`s to follow it. Note the page's `CobaltZone` already supplies an `h2` subheading (`CobaltZone.tsx:282`), so a second `h2` per phase is fine but check the order reads sensibly. (LC17 to LC20 heading row group.)

### 1.4 What is fixed since 5 Aug (verified in code)

- **Duplicate h1 on the homepage:** now one `<h1>` (`Index.tsx:171`). Fixed.
- **Heading skips:** h1 then h2 (`CobaltZone.tsx:282` renders the subheading as a real `<h2>`) then h3 on `/learning` and `/design-kit`. The 13 Sep report also checked by tag sequence on all twelve routes. Fixed apart from 1.3.
- **Unlabelled inputs:** the Subscribe page and the capture form no longer exist; `FooterEmailCapture.tsx` is now a link to `/policy-template`; `Submit.tsx` is a mailto link. The `/tools` and `/radar` search inputs now have `aria-label="Search tools"` (`Tools.tsx:232`, `Radar.tsx:262`), closing the 13 Sep finding. Fixed.
- **Muted text token:** `--muted` (`#9A8F82`) is recorded as never carrying text (`index.css:41-52`); `--muted-foreground` is `#6B625A` at 5.62:1 on cream. Fixed.
- **Hub banner and drawer contrast:** the file's figures (5.18:1, 5.22:1) match my recomputation at 75% and 80% on cobalt.
- **Images:** no `<img>` tags in `src/`, so alt text has nothing to fail.
- **Dark theme:** no `.dark` class or `prefers-color-scheme` block found in `src/index.css`; one theme ships, so one set of tokens was measured.

### 1.5 Not checkable from code

Focus obscured by the sticky filter bar (`Radar.tsx:~252`, `Tools.tsx` filter bar is `sticky top-0 z-40`) when tabbing down the card list: needs a keyboard pass. The 24px target-size minimum was measured by the 13 Sep report for the nav (31.5px tall); other controls not measured. Drag: the homepage pills (`HomeGravity`) are draggable; I did not verify a non-drag alternative, and the `/tools` grid is reachable without it.

### 1.6 Manual checks (Gate 1)
- [ ] Lighthouse Accessibility on every page template (home, tools, radar, my-stack, design-kit, learning, ai-news, policy-template, submit, a legal page, 404): target 100 or a named reason per deduction. None recorded.
- [ ] axe DevTools on the same set.
- [ ] Keyboard pass: focus never hidden behind the sticky filter bar or the mobile drawer; focus enters and returns on drawer open and close.
- [ ] VoiceOver on the homepage and on `/tools` (the search-bearing page; `/submit` has no form).

---

## Gate 2: Performance: FAIL

I did not build, so bundle figures are the 13 Sep build's, flagged below. Today I changed nothing and measured nothing in a browser.

### 2.1 `api.fontshare.com` has no preconnect

`index.html:52-55`: preconnects to `fonts.googleapis.com` and `fonts.gstatic.com` only; Chillax loads from `api.fontshare.com` (line 54) with no hint. Two external font sources is the documented primary mobile drag. `display=swap` is present on both stylesheets (lines 54, 55). Persists from 5 Aug and 13 Sep. **Fix:** add `<link rel="preconnect" href="https://api.fontshare.com" crossorigin />` beside line 53. Better, self-host Chillax and Plus Jakarta Sans and drop both origins (Fontshare's CSS also pulls font files from a second host, which would need its own preconnect).

### 2.2 No route-level code splitting; main chunk over the threshold

`src/App.tsx:5-17`: all twelve pages imported statically; no `React.lazy` in `App.tsx`. Only `HomeGravity` is lazy (`Index.tsx:21-23`), which fixes the 5 Aug matter-js finding. The 13 Sep clean build reported the main chunk at **533.16 kB / 171.31 kB gzip**, over Vite's 500 kB warning, which the guide treats as a gate item. Not rebuilt today. **Fix:** `lazy()` the eleven non-home routes behind one `Suspense`; rebuild and record the new figure.

### 2.3 No dev tooling in production: clean

Audited every script tag in the one HTML entry point. Source `index.html:74`: one module script, `/src/main.tsx`. Live served HTML (9 Oct): one module script (`/assets/index-nVWYj4tA.js`) and `registerSW.js` injected by vite-plugin-pwa. No dev builds, no Babel Standalone, no tweak panel, no debug widget. `lovable-tagger` is gated to `mode === "development"` (`vite.config.ts:19`). `sw.js` is the self-destroying worker (`vite.config.ts` comment, ruled 31 Aug) and serves as `application/javascript`.

### 2.4 Images and animation

No `<img>`; the share card is 40KB. No hero image to preload. The homepage hero physics (`HomeGravity`) is lazy, mounts after the heading paints, and the file records the pills render after data loads, so I flag no LCP cost from code alone; PageSpeed has the last word.

### 2.5 No recorded PageSpeed run

No file in `reports/` records a Lighthouse or PageSpeed number since the 30 Aug relaunch. The only confirmed score anywhere is 64 from May on a build that no longer exists. `SCRATCHPAD.md:87` still lists the re-run as open. An unrecorded run does not exist; the gate cannot close.

### 2.6 Manual checks (Gate 2)
- [ ] PageSpeed Insights mobile on `https://theeditai.co.uk/`, `/tools`, `/my-stack`: Performance 90+, LCP under 2.5s, CLS under 0.1, INP under 200ms. Record score and date in `reports/`.
- [ ] Re-run after the preconnect and route-splitting fixes.

---

## Gate 4: Observability (operations half): FAIL at code level

Owner of the rest of Gate 4: **site-security**. Not audited here.

### 4.1 Sheet fetch failures are swallowed and surface to nobody

`src/lib/sheets.ts:226-228` and `246-248` (and the catch paths at 318, 353, 417): `fetchTools` and `fetchWhatsNew` return `[]` on any non-OK response or exception, with no `console.error` and no report. The visitor sees `ErrorState` on every data page (`Tools.tsx:533`, `Learning.tsx:73`, `WhatsNew.tsx:194`, `Radar.tsx:322`, `DesignKit.tsx:381`, `MyStack.tsx:360`), so the visitor half is met. Jasmin sees nothing. This is a live risk, not hypothetical: CLAUDE.md records that if either host is dropped from the API key's referrer list, "data fetches 403 and the directory renders empty". The directory is the product. No error-tracking dependency exists in `package.json`; the only `console.*` calls in `src/` are the 404 logger (`NotFound.tsx:42`) and three data-shape warnings (`sheets.ts:301`, `DesignKit.tsx:69,72`), none on the fetch failure path. **Fix:** at minimum `console.error` the status and URL path (never the key) in each catch; for an alert path, a free error-capture service on the client (the failure is in the browser, there are no serverless functions) or an uptime check that asserts directory content is present, not just a 200.

### 4.2 What passes or has moved

- **Submit form data loss: gone.** `Submit.tsx` was a `setSubmitted(true)` stub that discarded every submission (5 Aug). It is now a mailto link (`Submit.tsx:39-53`); the 13 Sep report agrees. There is no form or data-write path left in `src/` to fail silently. `supabase/migrations/` still holds two migrations from March 2026, which `site-security` should reconcile (not my half).
- **No serverless functions:** no `api/` directory, so no function error capture is owed.
- **Pipeline watchdog:** `.github/workflows/whats-new-watchdog.yml` fails loudly (GitHub failure email) if the daily `whats_new` append has not succeeded within 26 hours, Tue to Sat. That covers the news pipeline only, not the site being up and not the Sheet read path.

### 4.3 Manual checks (Gate 4, operations)
- [ ] Uptime monitor pointed at `https://theeditai.co.uk` (free tier suffices). No evidence in `SCRATCHPAD.md`, `.claude/CLAUDE.md` or `reports/` that one has ever been set up.
- [ ] Vercel deployment failure notifications switched on.
- [ ] Alert destination confirmed as an inbox Jasmin reads.
- [ ] Vercel runtime log retention confirmed (about an hour; an empty log proves nothing).

---

## What moved since the earlier reports

**Fixed since 5 Aug 2026 (verified in code or live):**
- `/tools` canonical pointing at `/toolkit` (all canonicals now apex and correct).
- `www`/apex disagreement; apex is primary with a 308 from www, verified live.
- Sitemap `/whats-new` entry replaced; `/submit` and `/stack` handled; robots sitemap pointer now matches the sitemap host.
- `Submit` and `Stack` meta: `Submit.tsx` has `SEO`; `Stack` is a redirect.
- OG image: renamed `og-edit-2026-09.png`, 1200 x 630, 40KB, absolute apex URL; per-route OG overrides in `SEO.tsx` with the `data-rh` duplicate fix.
- Duplicate homepage h1; DesignKit and Learning h1-to-h3 skips; unlabelled inputs and the form pages themselves; muted-text token; the Submit form that discarded data; the Stack.tsx em dashes (file gone); matter-js lazy-loaded.

**Persist from 5 Aug / 13 Sep:**
- Third font origin unpreconnected (`index.html:52-55`).
- No route-level code splitting; main chunk over 500 kB (13 Sep figure).
- No recorded PageSpeed score.
- No Organization schema.
- Bare wildcard `robots.txt`.
- Legal pages with no title or description.
- DesignKit phase names as spans.
- Footer legal links at `/40`.
- No uptime monitor or recorded failure alert; no recorded Search Console crawl check.
- No `llms.txt` (no longer a failure).

**New or newly clear today:**
- The three legacy redirects return 200, not 301 (3.5).
- `DesignKit.tsx:174` at 4.49:1.
- Sheet-fetch failures unreported (4.1).
- `geo/prerender` is 67 commits behind `main` (3.1).

**§7 and §8 of the guide vs the repo (verification, not assumption):** the guide's panel says the Edit is a Lovable-origin site on a bare `vercel.json` with a D header grade, an always-discarding Submit form and a 307 apex. Today: the form is gone, the redirect is a 308 to the apex, and `vercel.json` is still rewrite-only. I did not re-grade headers (site-security's). The guide's panel is stale for this property and should say so.

---

## Fix list, worst first

1. **Merge `geo/prerender`** after rebasing onto `main` and setting the Preview env var; re-prove across all routes, curl without JS. (Gate 3, 3.1)
2. **`public/robots.txt:1-2`**: add explicit blocks for OAI-SearchBot, Claude-SearchBot and PerplexityBot; record the training-bot decision. (3.2)
3. **`vercel.json`**: add three permanent redirects (`/whats-new`, `/stack`, `/subscribe`). (3.5)
4. **`src/components/LegalPage.tsx:28-31`** and the three legal pages: add title and description. (3.4)
5. **`src/pages/Index.tsx:81-103`**: add a minimal `Organization` or record an exemption ruling. (3.3)
6. **`src/components/Layout.tsx:148` and 218,256,270**: decide the homepage nav contrast exception. (1.1)
7. **`src/pages/DesignKit.tsx:139-154,174`**: real `<h2>` for phase names; raise 0.65 to 0.70 or more. (1.2, 1.3)
8. **`src/components/Layout.tsx:528-544`**: footer legal links from `/40` to `/60`. (1.2)
9. **`index.html:53`**: preconnect `api.fontshare.com`, or self-host both fonts. (2.1)
10. **`src/App.tsx:5-17`**: route-level `lazy()`; rebuild and record chunk size. (2.2)
11. **`src/lib/sheets.ts:226,246,318,353,417`**: log and report Sheet failures. (4.1)
12. Manual checks: PageSpeed run recorded with date; Lighthouse and axe on every template; VoiceOver; Search Console record; opengraph.xyz per page; uptime monitor; Vercel failure notifications; alert inbox.
13. Housekeeping: delete `src/vercel.json`; delete dead `.form-input` CSS (`src/App.css`); `index.html` title format (3.7), if the colon rule applies.

---

## Method notes and limits

- No build, no browser, no install; contrast computed numerically from tokens, not rendered. A few figures (footer cream at 40% on `#1A1510`) are computed for white and noted as marginally optimistic for cream.
- Bundle size is carried from the 13 Sep clean build, not re-measured.
- The CLAUDE.md claim that the prerender is blocked by a Preview env var was not re-verified (needs the Vercel dashboard).
- Live checks: read-only GETs and HEADs, 9 Oct 2026, bodies checked for known strings (the shell's `<div id="root">`, the manifest JSON, the sitemap `<loc>` entries), not just status codes.
- The launch compliance LC17 to LC20 mapping in Gate 1 is by row group and was not checked against the checklist file this run.

---

## Staleness flag (contract §1) and proposed learnings (§2)

**Staleness line, not appended.** The brief limited my writes in the real repo to this one file because the tree holds another session's uncommitted work, so I did not touch `SCRATCHPAD.md`. The line for the caller to append:

`web-build-guide stale: theeditai.co.uk §7/§8 predate the 30 Aug overhaul: apex 308 enforced, Submit form replaced by mailto, OG card 1200x630 40KB; open: empty-shell prerender unmerged (67 behind main), bare-wildcard robots, 3 client-side redirects returning 200, Sheet-fetch failures unreported (see reports/site-gates-2026-10-09.md)`

**Proposed learnings** (written to `LEARNINGS.md`: see the note on the write at the foot of the final message; this section holds them in full regardless):

```
## 2026-10-09 · site-gates · the-edit-ai
**What happened:** A client-side <Navigate replace> redirect returned HTTP 200 for three renamed routes, so the "permanent redirect" the repo documents consolidates nothing for any crawler that does not run JavaScript.
**Proposed rule:** For every renamed route, curl the old path and require 301 or 308 with a Location header; a router-level redirect is a fallback, never the redirect.
**Belongs in:** Web Build Guide §4 Gate 3 (canonical-host and renamed-route bullets).
```

```
## 2026-10-09 · site-gates · the-edit-ai
**What happened:** A per-route meta component was fixed to emit og:title, og:description and og:url, and the earlier "every page shares the homepage card" finding read as closed, yet every scraper that does not run JavaScript still receives the homepage values on every URL.
**Proposed rule:** Mark a per-route OG fix as closed only when curl without JavaScript returns that route's own og:title; a fix verified in a browser or in the component code is open for scrapers.
**Belongs in:** Web Build Guide §4 Gate 3 (OG bullet) and the SPA caveat.
```
