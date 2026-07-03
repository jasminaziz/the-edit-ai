# The Edit AI — Scratchpad

Project: The Edit AI
Live URL: theeditai.co.uk
Repo: github.com/jasminaziz/the-edit-ai
Vercel project: the-edit-ai
Cowork folder: None

---

## Priority queue (as at 2026-07-03)

1. **Fix the stalled whats_new automation** (next) — last write 23 Jun.
   Downstream verified clean; prime suspect is the whats-new-routine PAT
   expiring on a 7-day lifetime. Check
   github.com/settings/personal-access-tokens/15903659 and the Routines UI,
   recreate the token with a longer expiry, update the Routine prompt and
   the WHATS_NEW_PAT secret.
2. Create the localhost-scoped Google Sheets API key and put it in .env.local
   (until then local dev renders but data 403s)
3. Update the Make copy in the my_stack tab (and homepage strip) — it still
   credits the retired Make.com automation with the whats_new pipeline
4. About panel (homepage attribution is done; no panel exists in the codebase)
5. Re-run PageSpeed (font-display swap has shipped) to confirm the mobile score
6. Confirm-and-close items: Subscribe copy, favicon, external links audit
   (all flagged unverifiable in the 2026-07-03 doc audit)

Done since the 2026-06-16 queue: my_stack live (21 rows), design_kit live
(45 rows), nav/footer IA restructure, homepage attribution, font-display swap.

## Blocked

- Conversion layer prompts (Work with me, Subscribe rewrite, Substack link-out):
  drafted, waiting on email confirmation for hello@theeditai.co.uk

---

## Session notes

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

### 2026-07-03

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
