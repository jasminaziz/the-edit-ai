# The Edit AI — Scratchpad

Project: The Edit AI
Live URL: theeditai.co.uk
Repo: github.com/jasminaziz/the-edit-ai
Vercel project: the-edit-ai
Cowork folder: None

---

## Priority queue (as at 2026-07-03)

1. **Fix the stalled whats_new automation** — last write 23 Jun. Two blockers
   found and partially resolved (2026-07-03 second session):
   - **PAT confirmed expired**: Routine transcript shows HTTP 403 "Resource not
     accessible by integration" on the dispatch call; original 7-day token lapsed
     ~23 Jun. Action: create a new fine-grained PAT (jasminaziz/the-edit-ai only,
     Actions: read and write, 366-day expiry) and paste into the Routine's
     `Authorization: Bearer` line. (WHATS_NEW_PAT repo secret deleted — vestigial.)
   - **Proxy blocker**: the Routine sandbox now routes GitHub API calls through a
     proxy that requires the repo to be connected via "add_repo". Jasmin connected
     jasminaziz/the-edit-ai to the session — this is now resolved.
   - **Watchdog shipped**: `.github/workflows/whats-new-watchdog.yml` (commit
     5d6e1e7) runs daily at 12:00 UTC on github.token and fails loudly if
     append-whats-new hasn't succeeded in 48h. Test run confirmed it correctly
     detects the current stall.
   - **Next action (Jasmin)**: create replacement PAT → paste into Routine → re-run.
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

Done since the 2026-06-16 queue: my_stack live (21 rows), design_kit live
(45 rows), nav/footer IA restructure, homepage attribution, font-display swap,
PWA install scaffold (manifest + iOS meta tags, 2026-08-05).

## Blocked

- Conversion layer prompts (Work with me, Subscribe rewrite, Substack link-out):
  drafted, waiting on email confirmation for hello@theeditai.co.uk

---

## Session notes

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
  `apple-mobile-web-app-status-bar-style` (`black-translucent`, so the
  status bar shows app content instead of generic grey), and
  `apple-mobile-web-app-title` ("The Edit"). Existing favicon/apple-touch-icon
  links untouched.
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
