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
