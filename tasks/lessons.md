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
