# The Edit AI — Scratchpad

Project: The Edit AI
Live URL: theeditai.co.uk
Repo: github.com/jasminaziz/the-edit-ai
Vercel project: the-edit-ai
Cowork folder: None

---

## Priority queue (as at 2026-07-03)

1. **whats_new automation — FIXED 2026-07-12.** Root cause: Routine sandbox
   proxy strips Authorization headers on api.github.com; curl+PAT was always
   broken. Fix: dispatch via GitHub MCP `actions_run_trigger`. All actions done:
   Routine prompt updated (MCP dispatch, PAT removed, freshness check), PAT
   16554137 revoked, Apps Script doPost replaced (dedupe by name+url,
   all-or-nothing validation, optional SHARED_SECRET). Watchdog tightened to 26h.
   All sheet gaps backfilled (50 rows, 24 Jun-11 Jul). Remaining: delete the 6 Jul
   duplicate batch from the Sheet (same 5 stories as 3 Jul); check 20-22 Jun rows.
   Known caveat: watchdog fires false-alert emails on Saturday mornings (no weekend
   newsletter = no dispatch = stale check triggers); safe to ignore or change cron
   to `0 12 * * 1-5`.
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

Done since the 2026-06-16 queue: my_stack live (21 rows), design_kit live
(45 rows), nav/footer IA restructure, homepage attribution, font-display swap.

## Blocked

- Conversion layer prompts (Work with me, Subscribe rewrite, Substack link-out):
  drafted, waiting on email confirmation for hello@theeditai.co.uk

---

## Session notes

### 2026-07-12 (whats_new automation full fix)

Full audit of why the automation kept breaking. Root cause proved: Routine
sandbox proxy strips Authorization headers on api.github.com and injects its
own scoped credential, which cannot dispatch workflows (403 "Resource not
accessible by integration"). Proved by sending a fake token and no token —
both authenticated as jasminaziz. curl+PAT is therefore permanently broken
from the sandbox; GitHub MCP `actions_run_trigger` is the only working path.

All fixes applied this session:
- Routine prompt rewritten: Step 5 uses MCP tool, PAT removed, freshness check
  added (stops without dispatching if email >24h old)
- PAT 16554137 revoked by Jasmin
- Apps Script doPost replaced: dedupe by name+url (catches weekend re-reads),
  all-or-nothing row validation (6 fields, date format, category whitelist),
  optional SHARED_SECRET via Script Properties
- Watchdog tightened from 48h to 26h; failure message updated
- All sheet gaps backfilled: 50 rows across 24 Jun-8 Jul plus 9 and 11 Jul
  (two 25-row dispatch chunks due to Apps Script JSON parse limit)
- Branch merged to main (PR #1)

Known caveat: watchdog sends false-alert emails on weekends (no newsletter =
no dispatch = 26h check triggers). Can fix with `0 12 * * 1-5` cron.
Remaining manual task: delete 6 Jul duplicate batch from the Sheet.

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
