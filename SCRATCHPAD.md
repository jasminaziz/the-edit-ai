# The Edit AI — Scratchpad

Project: The Edit AI
Live URL: theeditai.co.uk
Repo: github.com/jasminaziz/the-edit-ai
Vercel project: the-edit-ai
Cowork folder: None

---

## Priority queue (as at 2026-08-05)

1. **whats_new automation — fixed 2026-07-11** (separate session, merged into
   this repo 2026-08-05 via rebase, commit 54fce74). Root cause was never the
   PAT: the Routine sandbox proxy strips Authorization headers on
   api.github.com, so curl+PAT dispatch was deterministically broken.
   Verified fix: dispatch via GitHub MCP `actions_run_trigger` instead. Full
   detail in `.claude/CLAUDE.md` Outstanding item 1. Remaining for Jasmin:
   (a) rewrite Routine prompt Step 5 to use the MCP tool, delete the PAT from
   the prompt, (b) revoke PAT 16554137, (c) paste dedupe + shared-secret code
   into the Apps Script, (d) manually delete the duplicate 3/6 Jul batches
   from the Sheet.
2. Create the localhost-scoped Google Sheets API key and put it in .env.local
   (until then local dev renders but data 403s)
3. Update the Make copy in the my_stack tab (and homepage strip) — it still
   credits the retired Make.com automation with the whats_new pipeline
4. About panel (homepage attribution is done; no panel exists in the codebase)
5. Re-run PageSpeed (font-display swap has shipped) to confirm the mobile score
6. Confirm-and-close items: Subscribe copy, favicon, external links audit
   (all flagged unverifiable in the 2026-07-03 doc audit)
7. **Security audit follow-ups (2026-07-04)** — full detail in
   `reports/2026-07-04-security-audit.md`. No critical findings. In rough order:
   - **Submit form discards every submission** (Q1) — `handleSubmit` only flips
     state; wire it to a destination or pull the page
   - GA consent: banner records a choice nothing reads; GA4 fires regardless
     (M2) — decide approach (Consent Mode), then one small change
   - Apps Script doPost shared secret + render only http(s) hrefs in
     WhatsNewCard (M3)
   - subscribers insert constraints: email format CHECK, length limits,
     server-side defaults for source/status (M4) — DB migration, run deliberately
   - Dependency bumps via **bun** (M5) — react-router-dom first; do NOT run
     `npm audit fix` (stale package-lock)
   - Dead-code sweep: ~44 unused shadcn/ui components + orphaned radix deps,
     two unused toast systems in App.tsx, lovable-tagger, boilerplate README,
     .lovable/plan.md, src/vercel.json, stale supabase/config.toml, bun.lockb +
     package-lock.json; lazy-load matter-js/HomeGravity (988K single chunk,
     feeds queue item 5)
8. **Gates audit follow-ups (2026-08-05)** — full detail in
   `reports/site-gates-2026-08-05.md`. All four gates failed, all pre-existing
   site debt unrelated to that session's PWA scaffold. In rough order:
   - **`/tools` canonicalises to a dead `/toolkit` route** (`Tools.tsx:303`) —
     new finding, not previously logged; the site's own SEO guide already
     names this exact trap once before, so it's recurred
   - Accessibility: five colour pairs fail AA contrast (worst: nav text and
     StackBar text on periwinkle, 2.47:1 and 2.75:1), DesignKit/Learning skip
     h1→h3 with no h2, homepage has two `<h1>`s, Subscribe form fields have no
     `<label>` (placeholder-only)
   - Performance: `matter-js` ships on every route despite being homepage-hero
     only (feeds queue item 5's lazy-load note); no `preconnect` for Fontshare
     despite the site's own guide naming it as the cause of the 64/100 mobile
     score (still unverified since font-display:swap shipped, see queue item 5)
   - SEO: `/submit` and `/stack` ship no meta at all; every non-home page
     reuses the homepage's OG/Twitter card (`SEO.tsx` never overrides them)
   - Observability: Submit form data loss (already queue item 7/Q1, still
     unfixed); Subscribe/footer capture show a generic error on failure with
     no logging anywhere
9. **iOS status bar branding (2026-08-05, deferred)** — `black-translucent`
   shipped then reverted same day after it broke the mobile header (see
   `tasks/lessons.md`). Worth revisiting only alongside proper safe-area CSS
   on the fixed nav in `Layout.tsx` (`viewport-fit=cover` + `padding-top:
   env(safe-area-inset-top)`) and on-device or simulator verification before
   shipping — no full Xcode install on this Mac as at 2026-08-05, so no
   local iOS Simulator testing available until that's set up.

Done since the 2026-06-16 queue: my_stack live (21 rows), design_kit live
(45 rows), nav/footer IA restructure, homepage attribution, font-display swap,
whats_new automation fixed via MCP dispatch (2026-07-11), PWA install
scaffold shipped and live-tested (2026-08-05) — manifest, iOS meta tags,
maskable icon, plus two same-day regression fixes confirmed on device
(status bar reverted to default, html background-color set to stop white
flashes on iOS elastic scroll bounce).

## Blocked

- Conversion layer prompts (Work with me, Subscribe rewrite, Substack link-out):
  drafted, waiting on email confirmation for hello@theeditai.co.uk

---

## Session notes

### 2026-08-22 (overhaul data layer — branch overhaul/sector-axis)

**Branch: overhaul/sector-axis** — all work is on this branch. Nothing has
merged to main. The live site is unchanged. Next code session MUST start with
`git checkout overhaul/sector-axis`, not main.

Context: an overhaul audit (reports/2026-08-22-overhaul-audit.html, prepared
same day) diagnoses the site's current positioning as incoherent and lays out
a full re-point to charities, cultural organisations and heritage. The audit
supersedes the "never charity-sector framing" rule in CLAUDE.md (that rule is
live and will fight future build sessions until CLAUDE.md is rewritten —
audit action list item 4, scheduled for October admin week).

Built and verified this session:
- `Tool` interface extended with seven sector-axis fields: `jobs` (typed as
  `string[]`), `data_location`, `trains_on_input`, `nonprofit_tier`,
  `dpia_flag`, `trustee_note`, `last_checked`. All default to `[]` / `''`
  when absent — safe before the Sheet is updated.
- `fetchTools()` rebuilt to use header-name lookup (matching the pattern of
  `fetchMyStack` and `fetchDesignKit`) via a new exported `parseToolRows()`
  function. Fixed-index column reading retired. "cost" accepted as alias for
  "pricing" (the Sheet header is "cost").
- `parseToolRows()` extracted and exported so it can be tested without mocking
  fetch or import.meta.env.
- 19 vitest tests written and passing (`src/test/sheets.test.ts`): full
  columns, absent columns, jobs splitting on `,` `·` `•`, whitespace trim,
  emoji strip on text fields, url not stripped, status fallback, empty-name
  row skipped.
- `bun test`: 19 pass, 0 fail. `bunx tsc --noEmit`: clean.
- `.claude/schema.md` updated to document new column layout (G–M), the
  fixed-position constraint (now retired), and allowed values per field.
- Branch pushed to remote:
  github.com/jasminaziz/the-edit-ai/tree/overhaul/sector-axis

Three outstanding actions before code session one (October):
1. **Localhost API key** — create a new Google Sheets API key in Cloud
   Console (`jasminaziz1@gmail.com`), restrict to Sheets API and referrer
   `http://localhost:8080/*` (this project's dev port — confirmed in
   vite.config.ts), and replace `VITE_GOOGLE_SHEETS_API_KEY` in `.env.local`
   with it. Until then local data loads fail with 403.
2. **Add header columns to the Sheet** — append `jobs`, `data_location`,
   `trains_on_input`, `nonprofit_tier`, `dpia_flag`, `trustee_note`,
   `last_checked` as column headers G–M in the tools tab. The fetcher is
   already reading them; the Sheet just needs the headers.
3. **October triage and research pass** — row triage (keep/cut/judged-not-
   recommended per audit section 4), then fill sector fields for the top 10
   rows with verified sources before code session one (ToolCard, filters,
   DPIA chip).

### 2026-08-05 (PWA install scaffold)

Scaffold only: manifest and plugin config for an installable iPhone PWA.
Existing locked favicon set reused as-is, no icons regenerated except one
new maskable-safe padded variant (see below).

- `vite-plugin-pwa` installed via bun, configured in `vite.config.ts`:
  `registerType: autoUpdate`, manifest (name/short_name/description reused
  verbatim from existing `index.html` meta, theme_color `#2D35C9`,
  background_color `#FAF8F4`, display standalone), no runtime caching rules
  (offline caching for Sheets data stays explicitly out of scope).
- `index.html`: added `theme-color`, `apple-mobile-web-app-capable`,
  `apple-mobile-web-app-status-bar-style`, and `apple-mobile-web-app-title`
  ("The Edit"). Existing favicon/apple-touch-icon links untouched.
- Generated `public/favicon-512-maskable.png`: same artwork as
  `favicon-512.png`, padded (scaled to 74%, centred on the same cobalt
  background) so it survives Android's circular maskable-icon crop. No
  redesign, added to the manifest as a third icon entry (`purpose: maskable`).
- Ran `site-design-check`: verdict Faithful, no hard drift. Ran `site-gates`:
  all four gates failed, but confirmed clean on the scaffold itself — every
  failure is pre-existing site debt (logged as queue item 8 above), except
  one real new cost this session added: the service worker precaches the
  full ~1MB main JS chunk in the background after first load. Non-blocking
  (deferred past load, doesn't touch LCP/FCP) but real added weight, worth
  remembering if bundle size work happens later.
- Verify after deploy: PWA install behaviour on an iPhone (Safari share
  sheet → Add to Home Screen), not just local build — manifest/service
  worker need confirming against the live `vercel.json` SPA rewrite.
- **Live regression found and fixed same day**: shipped with
  `status-bar-style: black-translucent` (site-design-check's suggestion to
  brand the one native iOS chrome element). Jasmin reported the header
  visually detaching from the top of the screen on scroll in the installed
  home-screen app. Root cause: the fixed nav in `Layout.tsx` has no
  `safe-area-inset-top` handling and the viewport meta has no
  `viewport-fit=cover`, so content draws under the status bar in standalone
  mode. Reverted to `default` (see `tasks/lessons.md`) rather than build out
  safe-area CSS — that's real component work, out of scaffold scope, and
  unverifiable locally (no full Xcode install on this Mac, so no simulator
  testing). Branding the status bar is a real v2 idea if the safe-area work
  gets done properly and tested on-device first.
- **Second related regression, same report**: Jasmin also saw white flashes
  (against the brand cream/cobalt) on horizontal scroll bounce, "didn't feel
  fixed on the screen". Root cause: `<html>` had no background-color set —
  only `<body>` did (`bg-background`). iOS Safari's elastic overscroll
  reveals the `<html>` background in the bounce region, not `<body>`'s, so
  it defaulted to white. Fix: added `@apply bg-background` to the `html`
  selector in `src/index.css`. This is a page-wide fix (not PWA/iOS-specific
  code), so it also corrects the same white-flash bounce in a normal mobile
  Safari tab, not just the installed app.

### 2026-08-11 (mobile header detach — actual root cause found and fixed)

Continuation of 2026-08-05's saga. After the status-bar and html-background
fixes, Jasmin reported the header was still detaching on scroll. A third
attempt (GPU compositing hint — `transform: translateZ(0)` on the nav) also
didn't fix it. Stopped guessing narrower CSS patches and researched current
sources instead: this is a well-documented WebKit bug where `position:
fixed` elements move *with* the document during iOS rubber-band bounce, and
`overscroll-behavior: none` (the usual fix) doesn't work inside WKWebView
(what installed PWAs run on). Full writeup in `tasks/lessons.md`.

Real fix: locked `<body>`/`<html>` from scrolling at all (scoped to
`Layout.tsx`'s own wrapper — `/stack` bypasses `Layout` and was left on
normal document scroll), moved scrolling to a new inner `#app-scroll` div.
Nav no longer needs `position: fixed` at all. Migrated 4 window-scroll
dependents (`Layout.tsx`, `DragHint.tsx`, `StackBar.tsx`, `Tools.tsx`) to
track `#app-scroll` instead, each with a `window` fallback. Verified on
desktop via the dev preview (created `.claude/launch.json`, didn't exist
before): `document.body.scrollHeight` now exactly equals
`window.innerHeight` (zero document-level scroll), nav stays pinned through
a programmatic scroll, StackBar's footer-offset tracking still works.
Commits `c377653` (fix) and `ce39fd5` (launch.json). Still can't verify the
actual iOS bounce behaviour without a device — no full Xcode install on
this Mac, still queue item 9's blocker. **Needs Jasmin's on-device
confirmation before this can be marked closed.**

### 2026-07-04 (security audit + code quality review)

Findings-only audit, no code changed. Report: `reports/2026-07-04-security-audit.md`.
Covered full git history, workflows, live Supabase (read-only), npm audit, dead code.

Verified clean: historic .env leak is inert (anon key for the dead Lovable
project htimtwbltcpupsjpkqlv; live project is zsoczlgkyessfhobhtgu; repo
private); Sheets key never in git history; subscribers RLS INSERT-only, list
unreadable; both workflows minimally scoped, no fork-PR exposure.

Biggest genuine finds: Submit form silently bins submissions; cookie banner is
decorative (GA4 unconditional); Apps Script write endpoint unauthenticated with
the URL committed; whats_new `url` column rendered straight into href (forged
row could plant a javascript: link).

Two self-corrections made at wrap and annotated in the report: (1) npm audit
was run against the stale package-lock.json — bun.lock is canonical, re-check
via bun before acting; (2) finding M1 (ops tables in the shared Supabase
project) largely re-verified the documented, accepted ops-dashboard design —
new information is only the empty Lovable tables, GraphQL discoverability, and
unthrottled token guessing.

### 2026-06-16/17

Built out all project MD files from scratch (.claude/CLAUDE.md, .claude/schema.md,
tasks/lessons.md, SCRATCHPAD.md). Schema verified against live Sheets data via
Apps Script doGet endpoint.

Rebuilt whats_new automation end to end. Routines sandbox blocks
script.google.com, so built a GitHub Actions proxy layer:
Routine → GitHub dispatch API → .github/workflows/append-whats-new.yml →
Apps Script doPost → Sheets. Pipeline confirmed working.

Issues fixed along the way:
- Workflow file not pushed to remote (first 404)
- Python multi-line block in YAML caused trigger parse issue → rewrote with env: pattern
- Apps Script doPost missing: doGet was missing closing `}`, so doPost was nested inside it
- New deployment URL (AKfycbxGOh2...) needed explicit new version after code save
- curl -L -X POST forced POST on 302 redirect → removed -X POST, fixed

**ACTION NEEDED:** Delete the test row from the whats_new tab in Google Sheets:
"Test / Test / 16 Jun 2026 / Test. / Tool Launch / (blank)"

### 2026-07-03 (second session — automation fix)

Full audit of stalled pipeline. Findings: PAT confirmed expired (seven green
daily runs 17–23 Jun, then zero dispatches; Routine transcript confirmed
403 "Resource not accessible by integration"). Second blocker found: Routines
sandbox proxy now requires repo connected via "add_repo" before GitHub API
calls succeed — Jasmin connected jasminaziz/the-edit-ai, proxy blocker
resolved. Watchdog workflow shipped (commit 5d6e1e7). WHATS_NEW_PAT secret
deleted (referenced by nothing). Pipeline still stalled pending new PAT.

### 2026-07-03 (first session — local dev + doc rewrite)

Local dev environment set up; Claude Code is now the primary build path
(Lovable relabelled legacy in all docs).

- bun is the package manager (bun.lock canonical). `bun install
  --frozen-lockfile`, dev server at localhost:8080.
- .env.local pulled via `vercel env pull` — it holds the production Sheets
  key, which is referrer-blocked from localhost, so the Tools page renders
  but data 403s until a localhost-scoped key is created.
- .claude/CLAUDE.md and schema.md rewritten and verified line-by-line against
  the live repo, Sheets, and site. Committed 0d04e39, pushed, deployed clean.
  Global ~/.claude/CLAUDE.md entry stripped to a pointer.
- whats_new automation diagnosed as stalled (see priority queue item 1):
  zero Actions dispatches since 23 Jun 08:03 UTC, Apps Script doGet healthy,
  sheet clean at 260 rows. PAT expiry is the prime suspect (created 16 Jun,
  exactly seven days of green runs).
- Verified live Sheets state: tools 61 rows (in_stack 22 / on_radar 39, no
  blanks, col D is `cost`); my_stack 21; design_kit 45; learning 26.
- Dead code found: StatusBadge.tsx unused; STATUS_MAP.on_radar renders
  nowhere (background task chip spawned for cleanup).
