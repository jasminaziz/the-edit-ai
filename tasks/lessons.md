# The Edit AI — Lessons

Session corrections and rules built up over time. Add entries; do not delete history.

---

- **Supabase env var naming:** `VITE_SUPABASE_PUBLISHABLE_KEY` is the correct
  name — NOT `VITE_SUPABASE_ANON_KEY`. Mismatch causes silent 401 errors. Always
  verify the exact variable name in generated client code.

- **Supabase vs content layer:** Supabase was auto-initialised by Lovable with
  content tables the site never reads. Google Sheets is the actual content source.
  Do not confuse the two or treat Supabase as the content layer.

- **google_drive_fetch cannot read Google Sheets.** Download the spreadsheet as
  .xlsx and upload it to the thread. This is the only reliable workaround.

- **Vercel build failures are silent.** Vercel continues to serve the last
  successful deploy. If a change has not appeared after 5 min, check the
  Deployments tab manually for a red failed build.

- **Google account split:** Sheets API key and Apps Script Web App are under
  jasminaziz1@gmail.com. All other Google tools (Search Console, GA4, Cloud
  Console) are under hello@jasminaziz.co.uk. Always check which account applies
  before authenticating — they are not interchangeable.

- **Google Sheets tab names are case-sensitive** and must exactly match what the
  site fetches. Tabs: `tools`, `my_stack`, `design_kit`, `learning`, `whats_new`.

- **Routines sandbox egress blocks script.google.com, *.supabase.co, and Make
  webhooks (hook.eu1.make.com).** Only api.github.com is confirmed reachable.
  The whats_new automation uses GitHub Actions as a proxy to work around this:
  Routine dispatches a workflow via the GitHub API → GitHub Actions POSTs to
  Apps Script from its own infrastructure where there are no egress restrictions.

- **curl -L -X POST breaks Apps Script calls.** Apps Script web apps return a
  302 redirect to a `script.googleusercontent.com/macros/echo?...` URL. That
  echo URL must be fetched with GET to read the script result. `-X POST` forces
  curl to POST on the redirect too, which returns a Google Drive 404. Fix: use
  `-d @file` without `-X POST` — curl posts the first request (implied by `-d`)
  then converts to GET on the redirect.

- **Apps Script: saving code does not update the live deployment.** After
  editing the script, you must go to Deploy > Manage deployments > edit the
  active deployment > New version > Deploy. Without this step the web app still
  serves the old version.

- **Apps Script: missing closing `}` on doGet nests doPost inside it.** This
  produces "Script function not found: doPost" at runtime. Always check that
  both functions are at the top level before deploying.

- **Apps Script URL changed (2026-06-16).** The old URL
  (AKfycbyn23sj7EbwNfzKDB8kP9vhB_...) is now dead. The active URL is
  AKfycbxGOh2fvk986AMMh_... — this serves both doGet (schema) and doPost
  (write rows). Do not reintroduce the old URL anywhere.

- **The production Sheets key is referrer-locked (2026-07-03).** Localhost
  gets 403 API_KEY_HTTP_REFERRER_BLOCKED — expected until a separate
  localhost-scoped key exists in .env.local. From curl, read the sheet by
  sending `-e "https://www.theeditai.co.uk/"` as the referer. Check the key
  before debugging any local data-loading failure.

- **Superseded (2026-07-03): the Drive connector CAN read the spreadsheet**
  via read_file_content on the spreadsheet ID, but returns only the first
  tab. For per-tab reads use the Sheets values API with the referer trick
  above. (Supersedes the earlier "google_drive_fetch cannot read Sheets"
  entry.)

- **bun is the package manager (2026-07-03).** bun.lock (Apr 2026) is
  canonical; package-lock.json (Jan 2025) is stale. `bun install
  --frozen-lockfile` — never `npm install`, which would resolve against the
  stale lockfile and rewrite it.

- **`vercel link` silently edits .gitignore** (appends `.vercel` and
  `.env*`). Check `git status` after linking if the session isn't supposed
  to touch project files.

- **An expired fine-grained PAT stops workflow_dispatch silently
  (2026-07-03).** The dispatch call 401s, so NO workflow run is created —
  Actions shows nothing, and Sheets/Apps Script never error. `gh` cannot
  show a token's expiry and GitHub's creation email doesn't state it; only
  the token settings page does. When a daily automation stops cleanly with
  no error trail, check token expiry first and pick a long expiry (or diary
  the renewal) when creating dispatch PATs.

- **Guard PAT-dependent dispatch chains with a watchdog workflow on
  github.token (2026-07-03).** A scheduled GitHub Actions workflow using the
  built-in `github.token` (no PAT, cannot expire) can check daily whether the
  main workflow ran successfully in the last 48 hours and exit 1 if not. A
  failed scheduled run triggers GitHub's failure email automatically. This is
  the reliable silent-failure guard: `.github/workflows/whats-new-watchdog.yml`
  is the live example. One caveat: GitHub pauses scheduled workflows after 60
  days of repo inactivity, but emails a warning before disabling.

- **Dependency tooling must go through bun in this repo, not just installs
  (2026-07-04).** `npm audit` resolves against the stale package-lock.json and
  can misreport what is actually installed; `npm audit fix` would rewrite that
  stale lockfile. Extend the bun rule above to audits and updates: `bun update
  <pkg>`, and treat any npm-lockfile-derived result as provisional until
  checked against bun.lock. (Caught at wrap on 2026-07-04 — the security audit
  initially assumed npm was the package manager.)

- **Check the ops-dashboard decision record before flagging the shared
  Supabase project (2026-07-04).** The Edit's Supabase project deliberately
  hosts the ops-dashboard tables (`ops_agent_status` world-readable,
  `ops_secrets` locked, token-gated SECURITY DEFINER writes) — documented
  accepted design in ~/AI Work/memory/decisions.md (ops-dashboard section),
  not a vulnerability. Future audits should verify the design holds rather
  than re-raise it. The empty Lovable-era `tools`/`whats_new` tables in the
  same project ARE dead weight and can go.

- **`apple-mobile-web-app-status-bar-style: black-translucent` broke the
  mobile header (2026-08-05).** Set as part of the PWA scaffold on
  site-design-check's suggestion (branding the status bar with cobalt
  instead of leaving it generic grey). Confirmed live regression in the
  installed home-screen app: the fixed nav in `Layout.tsx` has no
  `safe-area-inset-top` handling and `index.html`'s viewport meta has no
  `viewport-fit=cover`, so content draws under the status bar and the header
  visually detaches from the top of the screen on scroll. Reverted to
  `default`. `black-translucent` is only safe to use if the fixed nav gets
  proper safe-area CSS (`viewport-fit=cover` + `padding-top:
  env(safe-area-inset-top)` on the nav, adjusted `<main>` offset) at the
  same time — don't re-apply it without that work, and verify on an actual
  device or simulator first (no full Xcode install on this Mac as at
  2026-08-05, so no local simulator testing available).
  **Superseded 2026-08-11 — this was not the (whole) cause, see below.**

- **Mobile header "detaching" on scroll took four attempts to actually fix
  (2026-08-05 → 2026-08-11).** Three targeted fixes each addressed a real,
  separate, confirmed-live bug — but the header kept detaching after every
  one, because none of them were the actual root cause:
  1. `status-bar-style: black-translucent` → `default` (see entry above) —
     fixed content drawing under the status bar, didn't fix the detach.
  2. `<html>` had no `background-color` → added it — fixed white flashes on
     bounce, didn't fix the detach.
  3. `transform: translateZ(0)` / `will-change: transform` on the fixed nav
     (GPU compositing hint) — the standard fix for iOS "fixed element jank",
     didn't fix the detach either.

  The actual cause, found only after researching current sources rather
  than guessing further: this is a well-documented, long-standing WebKit
  bug where `position: fixed` elements genuinely move *with* the document
  during iOS's rubber-band bounce — no CSS compositing hint changes that.
  `overscroll-behavior: none` (the standard desktop fix) is also a dead
  end here: it doesn't work inside WKWebView, which is what an installed
  home-screen PWA runs on. The only reliable fix is architectural: stop
  `<body>`/`<html>` from scrolling at all and move scrolling to a
  dedicated inner pane, so fixed elements are never part of a bouncing
  scroll context in the first place. Implemented by scoping `h-dvh
  overflow-hidden` to `Layout.tsx`'s own wrapper (not global `html`/`body`
  CSS — the `/stack` route bypasses `Layout` entirely and needed to stay
  on normal document scroll). Nav no longer needs to be `position: fixed`
  at all once this is in place — it's just a normal flex item above the
  new `#app-scroll` scrollable div.

  **Anything that reads `window.scrollY` / listens on `window` for
  `scroll` no longer fires** once this is in place — scrolling happens on
  `document.getElementById('app-scroll')` instead. Four call sites needed
  migrating (`Layout.tsx` route-change reset, `DragHint.tsx`,
  `StackBar.tsx`, `Tools.tsx`'s sticky-header state) — check for this
  pattern before adding any new scroll-position-dependent feature.

  Lesson for next time this class of bug shows up: don't keep guessing
  narrower CSS patches after the first "should be it" fix doesn't hold on
  a re-test — search current sources for the specific symptom early, this
  is a decade-old, well-catalogued WebKit issue with a known fix pattern,
  not something worth rediscovering by trial and error.

- **Use header-based column lookup in all Sheets fetchers, never fixed index
  (2026-08-22).** `fetchTools()` was rebuilt from fixed-index (r[0], r[1]…)
  to header-name lookup, matching the pattern `fetchMyStack` and
  `fetchDesignKit` already use. Fixed-index breaks silently if a column is
  inserted before an existing one, or if the Sheet header row ever shifts.
  Header-name lookup is resilient to both. Pattern: `norm()` → `header =
  rows[0].map(norm)` → `findIdx(...keys)` → `cell(r, i)`. Apply this to any
  new fetcher added in future.

- **Extract a pure parse function from Sheets fetchers for unit testability
  (2026-08-22).** `fetchTools()` now calls `parseToolRows(rows)`, which is
  exported and tested directly. This avoids the need to mock `fetch` or
  `import.meta.env` in tests — the parsing logic is a pure function of the
  raw row data. Pattern: `export function parseFooRows(rows)` + slim
  `fetchFoo()` that calls it. Applied in `src/test/sheets.test.ts` (19 tests,
  all passing via `bun test`).

- **Multi-value Sheet fields must be typed string[] from the start
  (2026-08-22).** `jobs` was initially typed as `string` in the first
  session's interface draft, then corrected to `string[]` this session. The
  Sheet stores it as a comma- (or ·- or •-) separated string; parse it
  immediately in the fetcher with `.split(/[,·•]+/).map(s => s.trim()).filter
  (Boolean)`. A `string` type in the interface misleads consumers and makes
  the array type a breaking change later.

- **This project's dev server runs on port 8080, not the Vite default 5173
  (2026-08-22).** Confirmed in `vite.config.ts` (`port: 8080`) and
  `.claude/launch.json`. The localhost-scoped Google Sheets API key referrer
  restriction must be `http://localhost:8080/*` — not `http://localhost:5173/*`.
  Wrong port = 403 on every local Sheets fetch despite the key existing.

- **The Routines sandbox proxy requires repos to be explicitly connected
  (2026-07-03).** Even with a valid PAT, the Routine's GitHub API dispatch
  call returns HTTP 403 "GitHub access to this repository is not enabled for
  this session. Use add_repo to request access." The repo must be connected to
  the session via the GitHub connector in the claude.ai interface. This is a
  one-time configuration on the Routine itself (persists across runs), not a
  per-run step. Confirmed reachable once connected: api.github.com dispatch
  proceeds. Note: "Resource not accessible by integration" is GitHub's error
  for BOTH an expired PAT AND insufficient permissions — check expiry first,
  then permissions.

- **Verify a DOM finding with a screenshot before reporting it as a bug
  (2026-08-22).** The browser `javascript_tool` eval context reported
  `[data-rh]` 0, zero canonical tags and zero JSON-LD on pages that were
  rendering them correctly. The tell was in the same payload: it also
  reported `window.innerWidth` as 0 while the page was visibly rendering at
  800px, and reported a nav link as absent that a screenshot showed present.
  A DOM query returning zeros from a context that misreports the viewport is
  not evidence. Screenshot first, or confirm via a second signal (the browser
  tab title updates on real navigation), before writing a serious finding into
  a permanent queue item.

- **Do not infer a supply-chain problem from a registry mirror URL
  (2026-08-22).** `bun.lock` resolving `react-helmet-async@3.0.0` from
  `europe-west4-npm.pkg.dev/lovable-core-prod/sandbox-npm-cache` was read as a
  fabricated package because "3.0.0 isn't on public npm". It is a genuine
  upstream release from `staylor/react-helmet-async`, and the URL is a mirror,
  not an origin. Check the installed package's actual contents and upstream
  releases before calling a dependency suspect. The real risk in a private
  mirror entry is availability (a clean `--frozen-lockfile` install fails if
  the mirror dies), not authenticity.

- **A guard clause placed above the hero can blank an entire page
  (2026-08-22).** `Subscribe.tsx` opened with
  `if (!SUPABASE_URL || !SUPABASE_KEY) return null;` — intended to hide a
  form, but positioned above the component's whole return, so any environment
  missing those vars rendered the page as nothing. When removing a feature,
  check for guards that were scoped to that feature but placed at component
  top level.

- **Adding a link before its route exists creates a site-wide dead link
  (2026-08-22).** A footer CTA pointing at `/policy-template` shipped one
  commit before the route did, and the footer renders on every page, so for
  one commit every page carried a link into the `NotFound` catch-all. When a
  step sequence separates a link from its destination, say so at the time and
  confirm the route lands in the same session.

- **Redirect an emptied page rather than leaving two near-duplicates
  (2026-08-22).** `/subscribe` and `/policy-template` briefly both existed
  with near-identical copy, near-identical meta descriptions and distinct
  canonicals — a thin-duplicate signal to search engines. Resolved with
  `<Route path="/subscribe" element={<Navigate to="/policy-template" replace />} />`,
  matching the existing `/whats-new` → `/ai-news` pattern. Keep the redirect
  even after removing every in-app link to it: it still catches indexed and
  external links. Use `replace` so the dead URL does not accumulate history
  entries.
