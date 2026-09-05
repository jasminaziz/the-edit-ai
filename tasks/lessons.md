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

- **`tsc --noEmit` is not the build. Run `bun run build` before every commit.**
  Added 2026-08-26. The pre-commit gate had been tsc plus vitest. A code
  session ran `bun run build` for the first time and found it exercises a
  different path: Vite resolves imports, assets and plugin config at bundle
  time and can fail on things tsc passes cleanly. Combined with the silent
  Vercel failure above, a build nobody ran locally is a deploy that dies
  quietly and serves stale content. Three commands, every commit: `bunx tsc
  --noEmit`, `bun test`, `bun run build`. The chunk-size warning is the known
  matter-js debt, not a failure.

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

- **Measure it yourself before writing "verified" into a permanent record
  (2026-08-22).** When Jasmin reported the domain flip verified from her side,
  the right move was still to re-run all three checks locally, because the
  result was about to be committed as a closure. Transcribing someone else's
  reading as your own verification is how an unchecked claim becomes
  permanent. Cheap checks get re-run; that is the point of them.

- **Three instrument artifacts in one day, all of which would have caused
  real changes if acted on (2026-08-22).** (1) Dev-server DOM reads showed
  helmet injecting nothing; live measurement showed it working. (2) A cloud
  sandbox got 403s from the npm mirror; a normal network got 200s. (3) One
  browser trial showed helmet tags going stale on SPA navigation; a
  timestamped second measurement showed 300ms updates. Rule: a negative
  result from a constrained environment (dev server, sandbox, eval context)
  is a hypothesis, not a finding. Reproduce from the environment that
  matters before recording it or acting on it.

- **Check a headline count against its own detail (2026-08-22).** A handover
  note read "blocked on two approved strings from Jasmin (title + description
  for each)" of two pages, which is four, not two. The contradiction was
  inside the same sentence and got repeated downstream because the headline
  number was taken at face value. When a document states a count next to an
  enumeration, do the arithmetic.

- **Verify the precondition that would make a config change fail, before
  making it (2026-08-22).** Flipping Vercel's primary domain to the bare host
  would have 403'd every Sheets fetch and rendered the live directory empty
  if the API key's referrer restriction had not included the bare form. The
  key had only ever been exercised on www. Before an infrastructure change,
  ask what the site depends on that is scoped to the old state. Say plainly
  when the check needs a console you cannot reach, and who must run it.

- **Follow redirects before calling a registry dead (2026-08-22).** A bare
  `curl -I` against the npm mirror returns 307 for most packages, which reads
  like a failure. `curl -sL` returns 200 with the real tarball. Use
  `-w "%{http_code} %{size_download}"` with `-L` so the payload size confirms
  a real download rather than a redirect stub.

- **Do not commit another session's uncommitted work without asking
  (2026-08-22).** A Cowork session deliberately left `SEO.tsx` and its test
  uncommitted with "Commit is Jasmin's call" in its own notes. Report what is
  there, run the check it asked for, recommend, then wait. Passing tests are
  not authorisation.

- **To test a component whose content fields you are forbidden from authoring,
  patch `fetch` in the browser with obviously-marked placeholder data
  (2026-08-23).** B3 had to prove the ToolCard, the DPIA chips, the job filter
  and the three toggles all worked, but no Sheet row passed the completeness
  predicate yet and this project forbids any session from writing `dpia_flag`,
  `trustee_note` or a verdict. Waiting for Jasmin to seed rows would have meant
  shipping eight commits with no render check at all.

  The method: in the dev-server tab, wrap `window.fetch` so a request whose URL
  contains `values/tools` resolves to `{ok: true, json: () => ({values: ROWS})}`
  with a hand-built header row plus data rows, and everything else falls
  through to the original. Then force the component to remount by clicking
  through the SPA nav (a page reload discards the patch). Nothing is written to
  disk, to the repo or to the Sheet.

  Three rules that make it safe rather than a way of faking a green result:
  1. **Mark the invented text.** Every verdict and trustee note in the fixture
     read "PLACEHOLDER ..." so a screenshot could never be mistaken for real
     copy, and so no fabricated sentence could leak into a report as if it
     were Jasmin's judgement.
  2. **Reload afterwards and confirm the fixture is gone**, then re-read the
     real state. Leaving a patched `fetch` in the tab would have left the next
     person looking at synthetic data believing it was live.
  3. **Say in the wrap that the check was fixture-based, and record the re-run
     checklist.** A fixture proves the code paths; it does not prove the thing
     works on real data. B3 was recorded as "built, not finally verified" for
     exactly this reason and F2 was gated on repeating the checks for real.

  Use the fixture to exercise the case that is hardest to get from real data:
  here, a row with `trains_on_input: "Varies by tier"` that was otherwise
  complete and Green, to prove the training toggle refused it. That single row
  tested the locked rule most likely to be silently widened later. The
  constraint that forced this will recur on every judgement field this project
  has, so reach for the fixture rather than for a weaker check.

- **A completeness gate stated as "every visible row has X" is vacuously true
  when nothing is visible (2026-08-23).** The F2 relaunch check read "every
  visible row has its axis fields", which an empty directory passes perfectly.
  Since B3 also made the grid hide incomplete rows, the failure mode and the
  gate cancelled each other out: the emptier the site, the cleaner the check.
  Fixed by adding an explicit floor (no merge below ten complete rows). When a
  quality gate is written as a universal over a filtered set, ask what it says
  when the set is empty, and put a floor under it.

- **When correcting a document for staleness, verify every factual claim in
  it, not just the ones the brief named (2026-08-26).** Job 7 was "correct the
  stale Current state block". I corrected the five named items and rewrote the
  block around them — and in doing so *carried forward* a claim that
  `StatusBadge.tsx` was dead code on disk. The file was deleted on 2026-07-03
  in commit `3e55953`, along with `STATUS_MAP`, which the same document also
  still asserted existed. Both survived a rewrite whose entire purpose was
  removing stale statements, because I treated the brief's list as the scope
  of the staleness rather than as the symptoms of it. The fix is mechanical
  and cheap: when a doc block names a file, a symbol or a count, check it
  against the tree before you re-commit the sentence around it. A one-line
  `ls` and `grep` over every named artefact would have caught both.

- **A source document's claim is not verification, even a ruling you are
  executing (2026-08-26).** Handover B8 said the Stack cut closes "all three
  visitor-facing em dashes on the branch". I repeated that in a commit message,
  which reads as *the branch now has none*. It does not: `WhatsNew.tsx` still
  renders "Show more — {hiddenCount} remaining", against the locked voice rule.
  B8's three were the ones inside the stack files and its claim was true as far
  as it went; the sentence I wrote was broader than the fact. Before restating
  a source's claim as an outcome of your own work, run the check that would
  falsify it. Same class as the earlier lesson about counts contradicting their
  own enumeration — B8 also says "three files" while naming four.

- **`tsc --noEmit` is not a build (2026-08-26).** Seven commits went in on
  typecheck plus vitest alone; `bun run build` was not run until the audit at
  the end. It passed, but it exercises a different path (Vite transform,
  rollup, the PWA plugin's precache manifest) and this repo's own rule is that
  Vercel build failures are silent and serve the last good deploy. Run
  `bun run build` before the final commit of any session that deletes modules
  or changes imports — a dangling import can typecheck clean against a stale
  incremental cache and still break the bundle.

- **The static `index.html` title is the confounder when SPA meta looks broken
  (2026-08-26).** Chasing an apparently stale `document.title` on `/tools`, the
  browser eval context reported the homepage title, zero `[data-rh]` nodes and
  no canonical — the exact artifact signature already recorded above, confirmed
  again by `window.innerWidth: 0` on a page rendering at 800px. The extra
  wrinkle worth banking: Vite serves the same `index.html` for every route, so
  the "wrong" title was simply the pre-hydration static one, which `curl`
  confirms in a second. When helmet looks broken, `curl` the route and compare
  against `index.html`'s own `<title>` before opening any investigation. The
  session's own first `get_page_text` had already shown the injected title,
  which was the disconfirming evidence sitting in the transcript.

- **A ruling that names one conditional may still have a sibling keyed on the
  same state (2026-08-26).** F2c said to delete
  `scrolled ? "" : "sm:flex-wrap sm:overflow-visible"` so the filter rail always
  wraps. The gradient fade beside the rail is keyed on the same `scrolled`
  flag and exists only to signal horizontal overflow; left conditional it would
  have drawn a 40px strip over the right edge of the newly wrapped chips, which
  is the clipping the ruling exists to stop. Fixing only the named line would
  have satisfied the letter of the ruling and reintroduced its symptom. When a
  ruling removes a state-dependent behaviour, grep for every other use of that
  state in the same block before committing.

- **A forbidden-pattern grep can match legitimate content (2026-08-28).**
  After rewriting `sitemap.xml` to bare-domain, `grep -c "www\." public/sitemap.xml`
  returned 1. The hit was `www.sitemaps.org` in the `xmlns`, which must stay.
  Reported as a clean pass only after re-grepping for `www\.theeditai`
  specifically. Scope a negative check tightly enough that it cannot match
  legitimate content, and when it does hit, identify the hit before recording
  either a pass or a finding. Same family as the standing rule that an HTTP
  200 is never verification.

- **Verify a route inventory in both directions (2026-08-28).** The positioning
  statement named eleven routes for the sitemap. Checking each `<loc>` against
  a `path=` entry in `App.tsx` proves nothing invented; checking every `path=`
  against the sitemap proves nothing omitted, and is what confirmed the only
  unlisted routes were the three redirects and the `*` catch-all. One direction
  alone would have passed a sitemap missing a live route.

- **A comment naming one consumer of shared state goes stale when you add a
  second (2026-08-28, second occurrence).** The comment above `myStack` in
  `Index.tsx` explained the tab was read "because the hero pills are
  decoration". Re-pointing the strip at the same state made that false in the
  same commit. The 26 Aug session shipped `b4c5a7cb` "Fix a comment that was
  stale the moment it was written" for the same class of error. When adding a
  consumer to existing state, read the comment above its declaration before
  committing: it usually names the old consumer as the only one.

- **A commit message that cites a file is a dependency on that file existing
  (2026-08-28).** Two code commits and one report cite
  `reports/2026-08-28-positioning-statement.md` as the ruling authority, but
  the file was still untracked and Jasmin ruled it not ready to commit. The
  history is correct and the reference is currently dangling. Where a commit
  message must cite an uncommitted document, say so, and carry closing the gap
  as an open item rather than assuming a later session will notice.

- **A styled element inside an unrevealed animation wrapper reports unstyled
  computed values (2026-08-29).** `RevealItem` holds cards at `opacity: 0` with
  `transform: scale(0.95)` until the IntersectionObserver fires. Measuring a
  card in that state returned base colours for rules that were present, correct
  and higher-specificity, and `getBoundingClientRect` returned 41px for an
  element whose real height was 44px because the transform scaled it. I spent
  eight tool calls chasing a cascade bug that did not exist, and came close to
  writing it up. **Before trusting any computed style or box measurement on
  this grid: check `el.parentElement.style.opacity` is not "0", use
  `offsetHeight`/`offsetWidth` rather than `getBoundingClientRect` where a
  transform may apply, and confirm with a screenshot.** This is the same class
  of error the global rule about `window.innerWidth` already names, one layer
  further in.

- **Do not measure a component after poking its DOM by hand (2026-08-29).**
  I set `data-selected` with `setAttribute` to test CSS, and React never removed
  it, because React only clears attributes it set itself. Later counts of
  "how many cards are selected" were then reading my own leftovers, which
  produced a confident and completely false regression report. Reload before
  measuring, and prefer driving the real event path over mutating the DOM.

- **The physical cursor is part of the test fixture (2026-08-29).** After
  `scrollIntoView`, a card moved under the real mouse pointer and React
  genuinely selected it, so the "rest state" I measured was a hover state. When
  measuring hover-sensitive components, measure an element you know the pointer
  is not over, and check the state attribute rather than assuming.

- **Integer HSL almost never round-trips to a given hex (2026-08-29).**
  Seventeen tokens in `index.css` rendered a different colour from the locked
  palette they encoded, which is why every component hardcoded hex and bypassed
  the token layer. **Before swapping an inline hex for `hsl(var(--token))`,
  compute what the token actually renders and compare.** Corrected values need
  a decimal place, and the check belongs in any future tokenisation work.

- **Assert the occurrence count before any find-and-replace (2026-08-29).**
  The homepage intro sentence appears twice in `Index.tsx`: once as visible copy
  and once inside the JSON-LD, which copy pack four keys to the About panel. A
  file-wide replace would have silently rewritten structured data. Separately,
  `color: "#9A8F82",` matched two sites where one also carried `letterSpacing`,
  so the general pattern had to run after the specific one. Both were caught
  only because the script asserted counts. **Assert, target by line where the
  string is not unique, and order specific patterns before general ones.**

- **A brief's inventory is a claim, not a count (2026-08-29).** The audience
  review brief said 13 instances in two phrasings; there were 25 in six, three
  of them in a dead file and two in `vite.config.ts`, which is outside every
  copy inventory the project keeps. The design brief likewise instructed
  "raise the dim floor from 45% to 70%" when the card was already at 70% and no
  45% existed anywhere, an instruction that would have been implemented,
  changed nothing, and been reported as done. **Re-derive the counts a brief
  asserts before building on them, and check that an instruction's starting
  state is real.**

- **Argue the case you did not open with (2026-08-29).** I opened the audience
  review believing the three-noun phrase was costing the site its search
  differentiator, because six meta descriptions overrun the snippet limit. It
  was wrong: the phrase sits at character 21 to 45 and survives truncation,
  and the sacrificial tail is the right thing to lose. All three agents landed
  the other way. Say so in the deliverable rather than quietly dropping the
  argument, because the reasoning is what she is checking.

- **Sequential edit-gate-commit beats staging when one file carries two jobs
  (2026-08-29).** Seven fixes across four shared files could not be split into
  seven path-staged commits, because `git add <path>` stages every change in
  the file. Editing one job, gating it, committing it, and only then starting
  the next keeps "one job per commit" intact without interactive staging. Use
  this whenever a planned commit series touches any file twice.

- **An absence of evidence is not a finding, and a filename search is not a
  content search (2026-08-30).** I reported that eight of the 23 rendering rows
  carried judgement fields with no A5 record, and wrote it into
  `.claude/CLAUDE.md` and SCRATCHPAD as a live launch blocker. It was wrong.
  The drafts existed all along in
  `reports/2026-08-28-batch2-judgement-drafts.md`, committed, covering all
  eight. My search had grepped report *filenames* for "a5" and "verdict"; that
  file is named "judgement-drafts" and did not match. Two rules follow.
  **Search the contents of the reports directory for a distinctive phrase from
  the artefact you are looking for, never the filenames**, because this project
  names related documents inconsistently by design (`a5-verdict-drafts`,
  `batch2-judgement-drafts`, `sheet-edit-pack` all carry judgement content).
  And **when the check only shows that you did not find something, say exactly
  that**: "I found no record of X" is a different claim from "X did not
  happen", and only the first was earned. The giveaway was in front of me a
  step earlier: the eight verdicts read unmistakably like Jasmin's voice, first
  person where earned and naming the catch, which should have prompted a second
  look before the claim was written anywhere permanent.

- **A hidden browser pane freezes CSS transitions, so a mid-transition computed
  value is an artefact (2026-08-31).** Verifying the byline focus underline, I
  read `text-decoration-color` three times and got ink, the *start* value, when
  the rule sets lime. It looked like the declaration was not applying. It was:
  `document.hidden` was `true` and `requestAnimationFrame` fired **0 times in
  700ms**, so the 200ms transition never advanced. The instant a frame ticked
  the value resolved to `rgb(200, 240, 74)`, exactly `#C8F04A`. **Before
  believing any computed value on a transitioned property, check
  `document.hidden` and count frames**; timers still fire in a hidden pane, so
  an `await setTimeout` proves nothing about whether the animation ran. This
  belongs with the existing traps (opacity-0 reveal wrappers, `scale()` and
  `getBoundingClientRect`, hand-mutated attributes, the physical cursor): the
  pane is part of the fixture, not a neutral window onto the page.

- **A query returning nothing is not proof the thing is absent (2026-08-31).**
  My walk over `document.styleSheets` for rules matching `.about-byline`
  returned an empty array, which read as "the CSS never applied". Dumping the
  raw text of every `<style>` tag found the rule present and correct, verbatim.
  The walk was faulty, not the code. This is the same failure as the eight-rows
  claim one day earlier, in a different medium: **when a search comes back
  empty, verify the search before reporting the absence**, especially when a
  second signal already contradicts it — the underline and its 3px offset were
  visibly applying at the time, which no default style would explain.

- **An internal doc's paraphrase of shipped copy is not the copy (2026-08-31).**
  Writing a prompt for the consultancy site, I said the axis tests whether a
  tool "can be explained to a trustee in one sentence". The live wording is
  **board**, in three places (`AboutPanel.tsx:108`, `PolicyTemplate.tsx:46` and
  `:151`). I had taken it from `.claude/CLAUDE.md`, which paraphrased it wrong,
  and a parallel thread caught it against the deployed site. Two rules follow.
  **Quote visitor-facing copy from `src/`, never from a project doc**, however
  canonical that doc is on rules and architecture: it is authoritative on
  decisions and derivative on strings. And **when a schema field and the copy
  disagree, the field name is not the copy** — `trustee_note` is a column, it
  has never rendered as a label, and "trustee" reaching a visitor-facing
  sentence came purely from the field name leaking into prose. The CLAUDE.md
  line has been corrected and now cites the file it quotes.

  Worth keeping for the consultancy site specifically: "board" is also the
  wider word. Housing associations, universities, NHS trusts and foundations
  all have boards; only charities have trustees. Under that repo's CREDENTIAL
  vs GATE rule, "trustee" narrows where "board" does not.

- **An animated counter's `innerText` contains every digit it could show
  (2026-08-31).** Verifying the nine Sheet writes on production, I regexed the
  homepage for the published count and read **9** against a known 23. The
  counter is an odometer: its text node carries both reels, `0 1 2 3 4 5 6 7 8
  9` twice, and the displayed value is produced by a CSS transform. My pattern
  grabbed the last digit before the label. The authoritative check was one
  element away, `document.querySelectorAll('.tool-card').length`, which returned
  23 exactly. **Count the rendered things, never parse a number out of prose**,
  and treat any digit adjacent to an animation as a reel until proven otherwise.
  This is the same family as the hidden-pane transition trap logged above: the
  rendering mechanism is part of the fixture.

- **When a poll returns zero for the new value, check whether it also returns
  zero for the old one (2026-08-31).** Six seconds after `domcontentloaded` I
  found neither replacement `academy.claude.com` link on `/learning` and read it
  as a failed write. The tell was in the same output and I nearly missed it: the
  **old** `anthropic.com/academy` links also counted zero, and something had to
  be there. The Sheets fetch had not resolved. **If the thing you replaced is
  also missing, you polled too early, not wrongly.** A `waitUntil` that fires
  before a runtime data fetch proves nothing about content on this site, because
  every page gets its rows from Sheets after load.

- **Two empty fetches produce a convincing false diff (2026-08-31).** Diffing
  Canva's archived privacy policy against the live one, my comparison printed
  `DATA LOCATION: CHANGED` for all three clauses. Both archive URLs had returned
  nothing, so every clause compared `null` against real text. Had I reported it,
  it would have been a fabricated vendor change on a published row. One of the
  two URLs was a Cloudflare 403 and the other was fine. **A comparison must
  assert both sides are non-empty before it is allowed to say "changed"**, and a
  diff where *every* field changed is a fetch failure until proven otherwise.

- **A 403 or 429 from a fetcher is a bot-block, not a defect (2026-08-31).**
  Roughly two dozen of 156 URLs returned non-2xx to a plain fetch. Re-followed in
  a real browser, almost all were healthy: Cloudflare interstitials on Canva,
  Midjourney, Pexels and Make Academy, and Gemini and Krea failed only on a
  fetch-library header limit. Four were genuinely dead and those were the
  findings. **Never record a status code as a broken link without a second,
  different signal** — and note the split this run found, that
  `canva.com/policies/*` serves fine while `canva.com/en_gb/*` is hard-blocked,
  so "Canva blocks us" would itself have been too coarse a conclusion.

- **A page can carry two last-updated dates, and only one of them means
  anything (2026-08-31).** The policy-date pass flagged the Green row as
  drifting because Google's `knowledge.workspace.google.com` pages print a
  site-furniture footer, "Last updated 2026-08-26 UTC", alongside an editorial
  "Last updated: August 14, 2026" in the body. Only the body date means the
  policy moved, and 14 August predated the stored check. **Prefer the body date
  where both exist**; a footer that regenerates with the site is a build stamp.
  Recorded in `reports/axis-policy-urls.json` under `_trap` so the next run does
  not repeat it.

- **Read access does not imply write access, and the failure arrives late
  (2026-08-31).** The service account read the Sheet happily, which I took as
  "shared and ready"; it was inheriting link-level view access and had never been
  granted Editor. The 403 landed on the `batchUpdate`, after the pre-send name
  check had already passed. No harm, because the write is a single call and
  nothing part-landed, but **the access test must exercise the verb you intend
  to use**, not a weaker one.

- **Report the composition of a test count, not just the number (2026-08-31).**
  I wrote "`bun test` 77 passing" into the audit report as evidence the gate was
  clean, implying an app baseline. Sixty-four were the app's and thirteen were
  guard tests I had written minutes earlier, which `bun test` discovers outside
  the vitest glob. A number that includes my own new tests is not independent
  evidence that I broke nothing. **When quoting a suite as a gate, say what is in
  it** if the count changed because of this session's work.

- **`git push origin main` pushes the ref named main, not what is checked out
  (2026-08-31).** After I switched the working tree to `main`, the parallel
  session switched it back to `overhaul/sector-axis`. Seven of my commits
  landed there, and every `git push origin main` afterwards pushed local
  `main` to itself: a successful no-op. My `&& echo pushed` then printed
  "pushed", which proved the command exited 0 and nothing else. Three rules.
  **`echo` after `&&` is not verification of anything but exit status** — the
  push line already prints `old..new` when a ref moves, and silence under `-q`
  means nothing moved. **Confirm a push with `git rev-parse origin/<branch>`
  and compare it to `HEAD`.** And **re-check the branch before every commit in
  a shared working tree**, because another session can move it under you: this
  is the same shared-worktree hazard as the stale `index.lock` earlier the same
  day, and it cost more because it failed silently.

- **A search for the term you expect can only return instances that already
  have it (2026-08-31).** Auditing the audience phrase, I grepped for
  `heritage` and reported that every instance carried the full three-part
  phrase. The PWA manifest name read "for Charity Comms", so it could not
  appear in the results: the string had already dropped the word I was
  searching for. **To find droppage, search the stem the instances share
  (`charit`) and read what follows**, never the term you are hoping to see.
  CLAUDE.md had even warned that `vite.config.ts` sits outside every copy
  inventory; I included the file and still missed the string, because the
  search term was wrong rather than the file list.

- **The hidden-pane artefact has a cause, and it is `requestAnimationFrame`
  (2026-08-31).** This file already records three separate encounters with the
  same signature: zero `[data-rh]` nodes, no canonical, no JSON-LD, the static
  homepage title, and `window.innerWidth: 0` alongside. Each time it was logged
  as an instrument artefact and each time the mechanism was left open. It is
  this: **react-helmet-async commits its DOM changes inside
  `requestAnimationFrame`, and a hidden browser pane fires zero frames.** The
  head is therefore genuinely un-injected at the moment you read it. The page is
  not broken and helmet is not misconfigured; the commit has not run yet and,
  while the pane stays hidden, never will.
  The proof is cleaner than the symptom. An `await` on a rAF loop in that state
  does not return a low frame count, it **never resolves at all** — mine hit the
  45s tool timeout. Timers still fire, so `setTimeout` polling returns
  confidently wrong answers, which is exactly how this keeps passing for a real
  finding.
  **The fix is one call: take a screenshot, which forces a paint, then read.**
  The same page that had returned zeros then gave `innerWidth: 1280`, the
  correct per-page title, the correct canonical and 7 `[data-rh]` nodes.
  Two things follow. Before writing up any missing-meta finding, **check the
  source for `HelmetProvider` first** — it is at `main.tsx:7` and has been all
  along, which settles the question in one grep and costs nothing. And note that
  body DOM reads stay *accurate* in this state (`.tool-card` counted 23
  correctly while the head read as empty), so "some of my reads are obviously
  right" is not evidence that the rest are.

- **Reachability is not usage, and a delete list built from one will lie to you
  (2026-08-31).** I generated the dead-code sweep by walking imports
  transitively from `main.tsx`, which is the right tool for finding orphaned
  modules and found 49 of them. But anything `App.tsx` *renders* is reachable by
  construction, so four toast modules survived the sweep as "live", and I wrote
  `hooks/use-toast.ts` into CLAUDE.md as "the live toast hook". Nothing in `src/`
  calls `toast()`, `useToast`, or imports sonner. Both toasters were mounted and
  could never fire.
  Worse, I had SCRATCHPAD's own entry naming "two unused toast systems in
  App.tsx" in front of me and started *correcting it* on the strength of my
  reachability output. The check that caught it was one grep, run only because
  the rule here is to verify a claim before committing the sentence around it.
  **Reachability answers "is this module imported". It does not answer "does
  this code ever run". For anything mounted rather than called, grep for the
  call site.** Removing them was the largest single saving of the sweep, 51 kB
  off the main chunk, because sonner is a whole library.

- **A bundle split needs verifying in both directions (2026-08-31).** Lazy-loading
  HomeGravity is the kind of change that looks right in the build output and can
  still be wrong on the page. One direction is not enough: confirming the pills
  still render on `/` says nothing about whether the chunk stopped shipping
  elsewhere, and confirming the chunk is absent from `/tools` says nothing about
  whether the feature survived. Check both — `performance.getEntriesByType('resource')`
  filtered to `assets/*.js` names the chunks a route actually fetched — and check
  them against the **built `dist/`**, not the dev server, which does not split or
  purge the way the build does.
  Related, and the reason the headline number needed hedging: the PWA plugin adds
  the new chunk to its **precache manifest**, so the service worker still fetches
  it in the background. The honest claim is that the split takes matter-js out of
  the *blocking* path on every non-homepage route, not that those visitors never
  download it.

- **On a PWA, a browser reading can be a fortnight old; curl is the
  authoritative one (2026-08-31).** Verifying that a bundle split had deployed,
  the browser reported asset hashes matching nothing I had built and **no
  HomeGravity chunk in `performance.getEntriesByType('resource')`** — which
  reads exactly like "the lazy-load did not ship". A curl of the same URL
  seconds earlier and seconds later returned different, consistent hashes. The
  browser was being served a **precached build by the registered service
  worker**; `vite-plugin-pwa` precaches the whole manifest, so a returning
  visitor's browser can run code from any earlier deploy until the worker
  updates. `curl` has no service worker and bypasses it entirely.
  The tell was that the browser's resource list contained *only* one chunk while
  the live `index.html` named two. **Compare the browser's asset hashes against
  a curl of `index.html` before concluding anything about what deployed**, and
  treat a browser-observed "missing chunk" on this site as a cache reading until
  a curl agrees.

- **The shared working tree can push your work for you (2026-08-31).** This file
  already records the hazard in one direction: a parallel session moved the
  branch under me and `git push origin main` became a silent no-op. It runs the
  other way too. I made 13 commits this session and ran `git push` exactly zero
  times, and eight of them were on `origin/main` — and live, Vercel having
  deployed them — by the time I looked. The parallel session pushed local `main`
  and carried my commits with it.
  The consequence is worth stating plainly: **in a shared tree, committing is
  not a private act.** Anything committed to a branch someone else pushes can go
  public without you initiating it, so the decision that matters is the commit,
  not the push. Check `git rev-parse origin/<branch>` against `HEAD` at the
  *end* of a session as well as before each commit, and if the work is not meant
  to ship yet, do not commit it to a shared branch on the assumption that
  withholding the push is enough.

- **A precaching service worker silently pins visitors to an old build, and
  `registerType: 'autoUpdate'` does not prevent it (2026-08-31).** Jasmin
  reported that most links still showed a cached version of the site. Three
  things had to line up, and each looked fine on its own.
  `vite-plugin-pwa`'s generated worker registers
  `NavigationRoute(createHandlerBoundToURL("index.html"))`, so **every
  navigation is answered from the precache, never the network** — and the shell
  is what carries the hashed asset names, so the visitor is pinned to a whole
  build, not just one file. `autoUpdate` was set, and the plugin's docs are
  explicit that it only reloads when you register via `virtual:pwa-register`,
  whose `onNeedReload` defaults to `location.reload()`; the injected
  `registerSW.js` is a bare `navigator.serviceWorker.register('/sw.js')` with no
  callback. And because the site is an SPA, **internal link clicks do no
  document fetch at all**, so a visitor browsing by links never picks up a new
  build however long they stay.
  Net effect: every deploy reached returning visitors one visit late, for 26
  days, invisibly. Nothing in the build output, the deploy log or a `curl` shows
  this — `curl` has no service worker, so it always reports the site as correct.
  **When someone says the site looks stale and the CDN headers are right, check
  for a service worker before doubting them.** `curl` and the browser disagreeing
  is the tell, and the browser is the one telling the truth about what visitors
  see.
  Two details worth keeping. `selfDestroying: true` is the only exit that frees
  already-stuck visitors on their *next* load rather than their second, because
  the generated worker calls `client.navigate(client.url)` on activation — and
  when testing it, the tool error "the page navigated or was closed
  mid-evaluation" **is the success signal**, not a failure. And that flag must
  stay in the config until every returning browser has run it once; removing it
  as dead configuration reinstates the bug.

- **A service worker will not register from localhost in this browser pane
  (2026-08-31).** Verifying the self-destroying worker, every
  `navigator.serviceWorker.register('/sw.js')` against `http://localhost:8080`
  failed with "an unknown error occurred when fetching the script", while `curl`
  returned the same file at 200 with the right content type. The identical
  registration succeeded immediately against `https://theeditai.co.uk`. So
  service-worker behaviour **cannot be exercised on the local preview here** and
  has to be checked on production. This is the constrained-environment rule
  again: the local failure was not a result, and reporting the worker as broken
  on the strength of it would have been wrong in both directions — it works.

- **react-helmet-async cannot see static tags, so a "fallback" block silently
  becomes a duplicate (2026-08-31).** `index.html` and `SEO.tsx` both declared
  `description`, `og:title`, `og:description`, `twitter:title` and
  `twitter:description`. The project doc described the static block as the
  fallback for scrapers that do not run JS, and it read as a clean split. It is
  not: helmet's DOM routine collects only
  `headElement.querySelectorAll(type + '[data-rh]')` and removes only what it
  finds, so a hand-written tag with no `data-rh` is invisible to it and survives
  forever. Result: two of each tag on seven routes, **with the static homepage
  copy first in document order**, for anything that takes the first match.
  The fix is to add `data-rh="true"` to the static tags, which makes helmet
  adopt and replace them — keeping the fallback for non-JS crawlers instead of
  deleting it. **A static tag and a helmet tag of the same type do not compete;
  they coexist.** Whenever both a static head block and a helmet component
  declare the same tag, assume duplication until counted:
  `document.querySelectorAll('meta[name=description]').length` settles it in one
  line. Only mark the tags the component actually emits — `og:image` and
  `og:type` here are sitewide-only and must stay unmarked, or helmet will strip
  them.
  Consequence worth knowing before it looks like a regression: once marked, a
  client-side navigation to a route that renders no `<SEO>` removes the tags
  entirely, because helmet unmounts and cleans up what it owns. A direct load of
  that URL is unaffected, which is what crawlers do.

- **Never record a derived number as a fingerprint; record the invariant
  (2026-08-31).** I wrote into CLAUDE.md that a missing file on this site
  returns "200 `text/html` at 3,071 bytes" and called the byte count "the
  reliable fingerprint". Adding a comment to `index.html` **in the same
  session** took the shell to 4,380 bytes, so the number was stale within the
  hour — and a stale fingerprint is worse than none, because the check reports a
  missing file as present. The durable signal was sitting next to it in the same
  sentence: `content-type`. It does not move when `index.html` is edited.
  The general form, and it is not only about byte counts: **before writing a
  number into a permanent doc, ask what changes it.** If the answer is "an
  ordinary edit anyone might make, including me, later today", write the rule
  that survives instead. Same family as the hand-maintained `lastmod` in
  `sitemap.xml` and the commit tally that went stale twice in one report.

- **Helmet reconciles every tag type it manages, so a one-tag Helmet is not a
  one-tag change (2026-08-31).** Adding a canonical to the legal pages meant
  mounting `<Helmet><link rel="canonical" .../></Helmet>`. That is not additive:
  helmet recomputes *all* the tag types it owns from the mounted instances, so
  emitting no `meta` means removing every `data-rh`-marked meta on the page —
  including the static fallback block, which had just been marked so helmet
  would adopt it. Measured on the built dist before shipping: canonical 1 and
  correct, description 0, with `og:image` and `og:type` surviving only because
  they are deliberately unmarked.
  **Before adding a Helmet that emits one tag type, check what else on the page
  helmet already owns.** The trade here was judged acceptable and disclosed (a
  missing description beats a wrong one, and search engines generate a snippet
  from content), but it was a trade, not a clean win, and it would have been
  invisible on a typecheck.

- **When a user reports a second odd symptom just after a caching bug, suspect
  the same root cause before hunting a new one (2026-08-31).** Jasmin reported
  the footer LinkedIn linking to the wrong person. `links.ts` has held the
  correct slug since 22 August and the live bundle contained only that slug, so
  there was no defect to find. The wrong slug shipped on 6 June and was fixed on
  22 August — **after** the service worker shipped on 5 August — so a cached
  build had been serving it ever since. Two symptoms she reported in one
  session, one cause.
  The check is cheap and should come first: **`git log -S` the reported string
  and compare the fix date against the date the caching layer shipped.** If the
  fix lands inside the caching window, the report is about a stale build, and
  the answer is "already fixed, now visible" rather than a code change.

- **Check provenance before proposing to change visitor-facing copy
  (2026-08-31).** Two strings I was about to treat as fixable inconsistencies
  turned out to be signed-off pack copy: "Say this to a trustee" from the B3
  microcopy pack, "the questions your trustees will ask" from the 22 August
  copy pack draft, and the design kit's "trustees and funders" from copy pack
  four, three days old. **Grep `reports/` for the exact string first.** It
  changes the ask from "shall I fix this" to "this supersedes an approved
  string, here are the candidates", which is the honest framing and the one
  she can rule on. Where a pack recorded no reasoning, say so, so she knows
  she is superseding a string rather than overturning an argument.

- **A document that instructs an agent to use a script is untested code
  (2026-09-01).** `reports/2026-08-31-axis-audit-claude-code-prompt.md` said
  columns A and F were "never writable, by any route" and that tools was the
  only writable tab. `scripts/sheet-write.mjs`, written the same day, writes A
  and F across four tabs. Both were correct when written and the ruling that
  separated them was Jasmin's, but nothing failed when they diverged: no test
  covers a prose file, and the prompt is only read by a human pasting it. Anyone
  running the audit on 14 September would have got a document arguing with its
  own guard, and the likeliest outcome is the agent believing the prompt over
  the code. **When a doc tells an agent to use a script, changing the script
  means changing the doc in the same commit**, and the doc should quote the
  script's own structure rather than paraphrasing it.

- **An advisory report's list of instances is not the full set (2026-09-01).**
  The gap-check flagged the prompt's auth section as describing plain ADC.
  Fixing only what it cited would have left three more: two further ADC
  references in the guard description and the constraints block, and a spent
  "if sheet-write.mjs does not exist yet, build it first" clause. The report was
  right about the defect and incomplete about its extent, which is the normal
  shape of a good review. **Grep for the pattern the finding describes, not just
  the lines it quotes.** This sits alongside the existing rule that an advisory
  agent's diagnosis and its remedy are separate claims: so is its inventory.

- **A control that can be switched off by asserting it does not apply is not a
  control (2026-09-01).** The brief for the column D carve-out asked that the
  diff carry `"shape_change": false` to confirm the check had happened. Built as
  described, the field would have been an honesty box: the one case it exists to
  catch is a restructure, and a run that had misjudged a restructure would write
  `false` and sail through. Built refuse-only instead, `true` refuses the write
  and no value permits one, with the shape comparison running regardless. **Ask
  of any proposed safeguard: what does the failure case write here?** If the
  answer is "whatever gets it past", the safeguard is documentation.

- **A hidden browser pane freezes requestAnimationFrame, so any rAF-driven
  simulation reads as settled when it is frozen (2026-09-01).** matter-js
  advances on rAF. Measuring the homepage pills in a hidden pane returned every
  pill at its spawn point, 6–34% of hero height and directly across the
  wordmark, with positions identical between samples. That reads exactly like a
  settled pile jammed on the type, and `movedCount: 0` reads as "settled" when
  it means "no frames ran". Confirmed with 0 rAF callbacks in one second at
  `visibilityState: hidden`. The 1 Sep brief's mobile figures were taken that
  way and were wrong; so was my first diagnosis, which invented an arch-and-jam
  mechanism to explain an artefact. **Before believing any measurement of an
  animated or simulated system, count rAF firings.** The fix that worked was to
  replace `requestAnimationFrame` with a queue and pump it by hand, which
  advances the simulation deterministically regardless of visibility. This
  extends the existing transitioned-property rule from CSS transitions to
  anything driven by frames.

- **Never pipe a build through a grep that can only match success
  (2026-09-01).** Running `bun run build 2>&1 | grep "built in"` prints nothing
  when the build fails, and nothing is easy to read as fine. A malformed JSX
  comment broke the bundle and I carried on for two more steps, debugging a
  z-index that was never being served, because the browser was still on the last
  good build. `tsc --noEmit` passed throughout, which is the documented reason
  the build is a separate gate. **Show the build's own tail, never a
  success-only filter.**

- **Verifying the property you designed for is not looking at the render
  (2026-09-01).** The DPIA trigger overlapped the subheading. My check asked
  whether it sat beside the h1; it did, so the check passed while the defect was
  in the same screenshot I had just taken. Jasmin caught it. **When a check
  passes, ask what it did not ask** — and for anything positioned, test overlap
  against every neighbour, not just alignment with the intended one.

- **Absolute positioning reserves no space, and a transform creates a stacking
  context (2026-09-01).** Two separate bugs in one element. The trigger was
  `absolute right-0`, so the full-width subheading ran underneath it; the fix is
  a real flex column, not padding, because padding is a magic number that breaks
  when the string gets longer. And its wrapper carried `-translate-y-1/2`, which
  establishes a stacking context on its own, so the panel's `z-50` was scoped
  inside the wrapper's `z-20` and lost to a sticky bar at `z-40`. The bar
  painted over the text and cut it off mid-sentence, which looks exactly like
  clipping by `overflow: hidden` and is not. **Check the stacking chain for
  transforms before assuming a clip.**

- **A responsive component can put two copies of the same control in the DOM,
  and `.find()` will grab the hidden one (2026-09-01).** The bubble renders a
  desktop instance and a mobile instance, one `display:none` at any width.
  `[...querySelectorAll('button')].find(...)` returned the hidden desktop one at
  375px and reported a zero-size rect, which read as "the trigger is missing" on
  a page where the screenshot plainly showed it. **When a component has
  breakpoint variants, filter to the one with a non-zero box before measuring.**

- **`git push origin <branch>` pushes the ref of that NAME, not HEAD, and the
  trap has a mirror image (2026-09-01).** The global rules document one
  direction: HEAD on a feature branch, `git push origin main` pushes main to
  itself and exits 0. I hit the mirror. HEAD was on `main`, and the project
  convention is `git push origin overhaul/sector-axis` then
  `...:main`, so both commands pushed the *local* `overhaul/sector-axis` ref,
  still sitting at the old commit, to itself and to main. Seven commits went
  nowhere and both commands exited 0. Caught only because the verification step
  compares `git rev-parse` against a fresh fetch rather than trusting exit
  codes. **Push `HEAD:<target>` explicitly.** It is unambiguous whatever branch
  is checked out, and it makes the convention immune to which branch a parallel
  session left checked out.

- **Three documents can state a count and all be wrong (2026-09-01).**
  `design_kit` was 45 in `schema.md`, 46 in the audit prompt, and 46 in the
  Cowork task, which used that number to instruct discovery that the tab was
  full and could only take swaps. Live it is 44. There was no majority to trust
  and no way to tell from the documents which was stale. **Read the source
  before repeating any count, and prefer a live read to the most recent
  document.** The two counts that did match `schema.md`, learning 26 and
  my_stack 19, are what proved the method rather than the memory.

- **A stale document is most dangerous where it is most confident
  (2026-09-01).** The artifact's wrongest claims were its two most emphatic
  sections, "It is not a scheduled task" and "Nothing tells you", both set in
  the lede treatment reserved for the thing most worth knowing. Both were true
  for about twenty-four hours. **When a document asserts an absence, date the
  assertion inside the sentence**, because an absence is exactly the claim that
  a single new thing falsifies, silently, from somewhere the document cannot
  see.

- **Republishing an artifact requires having viewed the live version in the
  current session (2026-09-01).** Reading the copy saved by a *previous*
  session does not count, and neither does re-reading the file a refusal hands
  you. The sequence that works: `action: "read"` on the URL, then Read every
  line of the file it saves under the current session's directory, then
  publish. Budget two extra round trips for any artifact update.

- **The scoped ceiling is not the global one (2026-09-01).** `CLAUDE.md`'s
  45-row ceiling is set on the tools directory. The Cowork task applies it to
  `design_kit`, and the audit prompt's own open decision 3 asks whether it
  should. An unruled question was being obeyed as settled. **When a rule names
  a scope, check the scope before enforcing it somewhere else** — and when you
  find it already being enforced out of scope, flag it rather than quietly
  correcting it, because the enforcement may be the intent.

- **react-helmet-async writes on `requestAnimationFrame`, so meta tags cannot
  be verified in a hidden pane (2026-09-01).** `Helmet.defaultProps` sets
  `defer: true`, which schedules the DOM write in a frame callback. In a hidden
  pane no frames run, so the write never happens and every route shows
  `index.html`'s static tags: the homepage title, the homepage description, and
  **no canonical at all**, because `SEO.tsx` is the only thing that emits one.
  Verified on production and reported as a live site-wide SEO failure before
  checking `document.hidden`. It was `hidden: true` with **0 rAF callbacks in
  1016ms**.

  This is the existing rAF rule reaching somewhere nobody would look for it.
  The documented cases are animations and physics, things that obviously tick.
  Nothing about a `<meta>` tag suggests a frame loop, which is what makes this
  the most convincing false positive available: the page renders perfectly, the
  h1 and all 44 cards are correct, and only the head is wrong, which reads
  exactly like a broken SEO component rather than a stopped clock.

  **Before reporting any head-tag defect, check `document.hidden` and count rAF
  firings.** Fronting the tab does not help when the pane itself is hidden. The
  technique that works: replace `window.requestAnimationFrame` with a
  queue-capturing stub, trigger a client-side navigation so helmet schedules an
  update through the stub, then call the captured callbacks by hand. Two
  callbacks were enough, and the correct title, description, canonical and
  og:url all appeared at once.

## 2026-09-01 — post-merge design pass

- **A physics hero cannot be measured at all in a hidden pane, and the fix is
  to drive the clock yourself.** Every homepage figure this session was
  worthless until I hijacked `requestAnimationFrame` into a queue and pumped it
  by hand. The recipe that works: navigate, install the stub IMMEDIATELY in the
  next call (the pills are lazy-loaded behind three Sheets fetches, so there is
  a one to two second window before matter-js boots), then pump in bursts while
  waiting, then pump hard and **sample twice and diff**. Settled means under a
  pixel of drift across 400 extra frames. Do not infer settling from elapsed
  time. Client-side navigating to the route after patching does NOT work: the
  component never re-requested a frame and the probe found zero pills.

- **A fix that relocates a symptom is not a fix, and it will be obvious to
  everyone but me.** Asked to close the gap under the wordmark, I centred it,
  which produced an identical gap above. I reported it as done with
  measurements. Before claiming a spacing fix, measure BOTH sides of the thing
  moved, not just the side complained about.

- **When one side of a gap is a fixed height and the other scales with the
  viewport, the gap is not a constant and cannot be tuned to one.** The
  wordmark floors at a fixed 212px below ~393px wide while a vh hero does not,
  so 60vh produced a 24px gap on one phone and 64px on another from identical
  code. **If the content has a clamp floor, size its container in pixels too.**
  What varies after that is the pile, which tracks screen WIDTH, so measure
  across widths and not just heights.

- **Porting a working script from another repo: verify its assumptions, not its
  code.** The consultancy's scroll-to-top is correct and battle-tested, and it
  would have shipped completely dead here, because it listens on `window`
  scroll and calls `window.scrollTo` while this site locks body scroll and
  scrolls an inner pane. `window.scrollY` reads 0 at any depth. It would have
  thrown no error and logged nothing. **Prove the host's assumptions hold
  before reusing anything, and prove it by measurement.**

- **`sm:hidden` on the inner div of a grid child hides the content and keeps
  the cell.** The slot survived and stretched to the row height, leaving a
  471px hole in the desktop grid. Caught only by counting grid children at
  1280px and comparing total against visible. The class belongs on the element
  that IS the grid child.

- **Removing a component means auditing the file's own prose for arguments that
  depend on it.** After the pill rim came out, four sentences still reasoned
  from a rim that existed, including the colour line citing its number as the
  orange's. Found in a completeness audit, not by me. **After deleting
  anything, grep the file for its name and read every hit.**

- **Three agents, three inventory errors, all in the same direction.** The copy
  pass found two Red rows where live data has three; the stranger concluded a
  component predated a ref when the diff is 14 lines; the design pass declared a
  bright orange impossible without considering a border. Each diagnosis was
  sound and each inventory was short. **Take the finding, re-count the extent
  yourself** — and note two of the three told me their own tooling limits
  unprompted, which is the signal to check hardest.

- **An animated counter's `innerText` carries every digit reel.** The homepage
  counter reads `01234567890123456789` to a text query. Already documented
  globally; met it live this session. Count rendered elements, never parse.

### Later the same day

- **"It renders" is not "it works", and every presence check will pass on
  something useless.** The desktop drag hint was in the viewport, had both its
  children, had target opacity 1 and measured cleanly. It was also pointing at
  empty margin, because the pill pile ends 71px to its left. Every check I had
  written would have gone green. **For an affordance, verify its RELATIONSHIP
  to the thing it refers to** — that the arrow has something to point at, that
  the label sits near what it labels — not merely that it exists and is
  on-screen.

- **Whether something is still an accent is a measurement.** The lime band was
  arguable as taste and settled in one query: compute the rendered area of
  every element with that background and sort. 249,600px2 against 6,480 for the
  next largest is not a matter of opinion. **When a design rule uses a word like
  "accent" or "sparingly", compute the distribution rather than arguing about
  the word.**

- **A copy claim that promises an operation can be checked against the
  operation.** "What you see here is always current" was falsifiable in about a
  minute against the ownership map: `my_stack` has no fact owner, so nothing
  re-verifies what that page publishes. **When visitor-facing copy promises
  something ongoing — current, checked, monitored, updated — go and find the
  mechanism that would have to deliver it, and confirm it covers that surface.**
  Copy is Jasmin's, but whether a claim is backed is checkable and mine to raise.

## 2026-09-04 — capture, deep links, the nav, and the GEO prerender

- **Ask what the failure case writes, then go and make it write it.** I built a
  prerender guard that refused any page under 400 characters of text. A Vercel
  build then went green while producing seven broken pages: the Sheets fetch
  failed there, every data-driven route prerendered its empty state, and an
  empty state still carries the nav, the headings and the footer, which clears
  400 easily. **A floor the failure state clears is documentation, not a
  control.** The fix was per-route floors set between a measured good value and
  the measured broken value, plus a rendered card count on the two grid pages,
  because counting elements beats measuring prose. Then I forced the failure
  by building with an invalid key and watched the guard fire. **Prove a
  safeguard in both directions, or you have only proved it does not fire.**

- **A row count from an API can be an estimate, and estimates read zero.**
  Supabase's `list_tables` reported `rows: 0` for `subscribers`. I repeated that
  to Jasmin twice. A `SELECT` returned six real addresses, three of them third
  parties, collected March to June 2026. The count comes from planner
  statistics, which sit at zero until the table is analysed. **Never report a
  row count that came from a listing; run the query.** The cost here was not
  academic: the live privacy policy claimed the site "holds no subscriber list",
  and on the wrong number I would have left it standing.

- **The browser pane reports a 0x0 viewport when hidden, and every measurement
  taken then is fiction.** A 0-width viewport wrapped the filter rail from 149px
  to 226px, which flipped a "does the name clear the sticky bar" check from pass
  to fail. Twice. The tell is `window.innerWidth` reading 0 on a page that
  screenshots fine, which this project's global file already names. **The fix is
  `resize_window` with explicit width and height, and asserting the viewport is
  non-zero inside the same measurement you are about to trust.**

- **A smooth scroll is an animation and cannot be verified in a hidden pane.**
  `scrollIntoView({behavior:"smooth"})` is driven by requestAnimationFrame, so
  it stalled part-way and left the card 75px high. I diagnosed that as a sticky
  rail shrinking on scroll and was about to write that mechanism into a
  permanent comment. Measuring it disproved it: `railDelta 0`, `cardDelta 0`,
  nothing moved. **The invented mechanism was plausible and wrong, which is the
  dangerous combination.** The real cause was the frozen pane. An instant scroll
  removed the dependency altogether and works in a background tab as a bonus.

- **Verify the relationship, not the existence — the deep-link version.** A
  `?tool=` link that opens the right verdict is not finished if the reader lands
  with the tool's own name behind the sticky filter rail. The check that matters
  is "can they see which tool this verdict belongs to", not "did the card
  expand". And it needed a different answer at every breakpoint: the rail is
  188px below `lg` and 149px above it, so one `scroll-margin-top` was wrong on
  half the devices.

- **A branch is not proven because the push succeeded.** The first prerender
  commit changed `vercel.json`'s catch-all to `/app.html` but left the build
  command as the plain Vite build, so Vercel produced neither the prerendered
  files nor `app.html`, and every route rewrote to something that did not
  exist. Found by reading the deployment, not by assuming the push was the end
  of the job. **When a change depends on the build producing something new,
  check the build produced it.**

- **An SSO-protected preview cannot be curled, and returns 200 with a full body
  when you try.** Vercel's deployment protection here is
  `all_except_custom_domains`, so every `*.vercel.app` URL sits behind auth.
  That was worth finding before promising a curl-based proof rather than after.
  Build logs are still readable through the API, which is what made the Chromium
  and Sheets diagnoses possible without ever fetching the site.
