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
