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
