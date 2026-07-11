# The Edit AI — Claude Project Context

## Project identity

The Edit (theeditai.co.uk) is a live, curated AI tools directory and news feed.
Built and maintained by Jasmin Aziz. Serves two jobs: a genuinely useful AI
fluency reference for smart women in marketing and communications, and a
portfolio-quality proof of build capability for prospective consultancy clients.
Positioning: horizontal AI fluency. Charity framing belongs on the consultancy
site, never here.

## Tech stack

- Build environment: **Claude Code (primary)** — local edits in
  `~/Developer/the-edit-ai`. Lovable is legacy/optional, see the Lovable
  section below.
- Repository: GitHub (jasminaziz/the-edit-ai)
- Hosting: Vercel — auto-deploys from GitHub main (2-3 min)
- Framework: Vite + React + TypeScript
- Package manager: **bun** — `bun.lock` is canonical; `package-lock.json` is
  stale (Jan 2025). Never `npm install` or `npm audit fix` (both resolve
  against and rewrite the stale lockfile). Audits and updates go through bun.
- Styling: Tailwind
- Data layer: Google Sheets (all content lives here)
- Subscriber capture: Supabase (the **site** touches the `subscribers` table
  only — written from two points: FooterEmailCapture and the Subscribe page.
  Not the content layer. Note: the Supabase *project* (zsoczlgkyessfhobhtgu)
  also hosts the ops-dashboard tables — documented accepted design, see
  memory decisions.md — plus empty Lovable-era `tools`/`whats_new` tables
  that are dead weight.)
- SEO: react-helmet-async
- Analytics: GA4 (G-QHYYEWC2C0)

### Deployment pipeline (default)

```
local edit → git commit → push to GitHub main → Vercel auto-redeploy (2-3 min)
```

Legacy fallback (Lovable): prompt in Lovable → Lovable pushes to GitHub main →
Vercel auto-redeploy. Optional, no longer the default path.

### Environment variables

```
VITE_GOOGLE_SHEETS_ID
VITE_GOOGLE_SHEETS_API_KEY
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY (must be this exact name — NOT VITE_SUPABASE_ANON_KEY)
```

Production values live in Vercel only, never in the repo. The production
Sheets API key is referrer-restricted to `theeditai.co.uk/*` and returns 403
from localhost.

Local dev uses a **separate Google Sheets API key scoped to localhost only**,
kept in `.env.local` (gitignored) — never in Vercel and never committed. The
production key stays restricted to `theeditai.co.uk/*`. If asked to debug a
local data-loading failure, check this before anything else.

> Status 2026-07-03: the localhost-scoped key has not been created yet.
> `.env.local` currently holds the production key (pulled via
> `vercel env pull`), so local data loads fail with 403
> API_KEY_HTTP_REFERRER_BLOCKED until the separate key exists.

## Google account split

Two separate Google accounts are in use. This is a live inconsistency flagged for migration.

- **hello@jasminaziz.co.uk** (Workspace): Search Console, GA4, Cloud Console
- **jasminaziz1@gmail.com** (personal): Sheets API key, Apps Script Web App

Always confirm which account applies before touching anything Google-authenticated.

## Data layer

Spreadsheet ID: `1RIO-WY9H75gML_UgdQbHGgDl-R0MfaG3CRPUp3PtAUI`

Tab names are case-sensitive, lowercase with underscores. Content changes in
Sheets go live immediately — no deploy needed.

Tabs: `tools`, `my_stack`, `design_kit`, `learning`, `whats_new`

See @schema.md for per-tab column schemas (last verified against live data
2026-07-03).

The Google Drive connector CAN read the spreadsheet (`read_file_content` on
the spreadsheet ID), but may return only the first tab. For reliable per-tab
reads, use the Sheets values API with the production key and a
`https://www.theeditai.co.uk/` referer.

## Routes and canonical URLs

Canonical base: `www.theeditai.co.uk`

Routes (from `src/App.tsx`, verified 2026-07-03):
`/`, `/tools`, `/stack` (visitor's own Build Your Own Stack page), `/my-stack`,
`/design-kit`, `/learning`, `/ai-news`, `/subscribe`, `/submit`,
`/privacy-policy`, `/terms-of-service`, `/cookie-policy`.
`/whats-new` is a permanent redirect to `/ai-news`.

`vercel.json` contains a single SPA catch-all rewrite (`/(.*) → /index.html`),
so **new routes need only a React Router entry** — no per-route vercel.json
rule. (Earlier docs said otherwise; that was wrong.)

## Codebase conventions

`src/utils/slugify.ts` is the single source of truth for URL encoding: lowercase,
strip parentheses and their contents, replace spaces with hyphens, strip remaining
special characters. Tool names store as raw strings in localStorage; slugs are for
URL construction only. Never duplicate this logic elsewhere.

## Badge states (verified against live code 2026-07-03)

- Only ONE badge renders on the Tools grid: **IN MY STACK** (forest green
  `#2D6A4F`), shown when `status === "in_stack"` (`ToolCard.tsx`).
- `on_radar` is still a live data value (39 of 61 tools rows) and still exists
  in `STATUS_MAP` in `src/lib/sheets.ts` (styled cobalt, not burnt orange),
  but **no component renders an On My Radar badge** — `StatusBadge.tsx` is
  unused dead code.
- Blank status cells parse as `on_radar` (`sheets.ts` fallback), so blanks and
  `on_radar` are indistinguishable to the site.

## Design system (locked)

Colours (hex only, never names):
- `#FAF8F4` page bg
- `#FFFFFF` card
- `#7B7FD4` periwinkle (homepage hero only)
- `#2D35C9` cobalt (display type, nav active, CTAs, month headers)
- `#C8F04A` electric lime (accent/punctuation only — exactly one job, never a category colour or badge)
- `#1A1510` text
- `#9A8F82` muted
- `#E8E2D8` borders
- `#2D6A4F` forest green (In My Stack badge)
- `#E8572A` burnt orange (On My Radar badge)

Fonts:
- Chillax 700 — display (Fontshare)
- Plus Jakarta Sans 400/500/600 — body (Google Fonts)
- DM Mono permanently retired

Pixel values only in Lovable prompts, never vague adjectives.

## Voice rules (locked)

- No em dashes anywhere, including meta tags and OG titles
- No inline quote marks in verdicts
- UK English, contractions throughout
- "Your stack" not "my stack" in all visitor-facing copy
- Verdicts: direct, frank, name the catch, do not bury limitations

## Current state (as at 2026-07-03)

Live and working: Home, AI Toolkit, AI News, My Stack (21 rows, full verdicts,
Claude featured), Design Kit (45 rows, 6 phases), Learning, Subscribe, Build
Your Own Stack, SEO/AEO, security audit. Homepage attribution live ("Curated
by Jasmin Aziz | Strategic Communications Consultant"). Nav/footer IA
restructured (Design, AI News, Substack links). font-display: swap shipped for
both Fontshare and Google Fonts.

Outstanding:
1. whats_new automation — root cause found 2026-07-11: the Routine sandbox
   proxy strips Authorization headers on api.github.com and injects its own
   scoped credential, which cannot dispatch workflows (403 "Resource not
   accessible by integration"). curl+PAT is deterministically broken there
   regardless of the PAT; the intermittent successes (6, 10 Jul) were runs
   where the agent happened to use the GitHub MCP tool instead. Verified fix
   2026-07-11: dispatch via GitHub MCP `actions_run_trigger`. Remaining for
   Jasmin: (a) rewrite Routine prompt Step 5 to use the MCP tool and delete
   the PAT from the prompt, (b) revoke PAT 16554137 (exposed in prompt and
   transcripts, no longer needed), (c) paste the dedupe + shared-secret code
   into the Apps Script. Watchdog tightened to 26h. All sheet gaps backfilled
   2026-07-11 (50 rows across 24 Jun-8 Jul, plus 9 and 11 Jul). Dates 28-29
   Jun and 5 Jul are legitimately empty: The Rundown publishes weekdays only.
   Known data wart: the 3 Jul and 6 Jul batches are the same five stories
   twice (the Jul 6 run re-read the Jul 3 newsletter over the long weekend);
   likewise 20-22 Jun rows likely repeat 19 Jun's stories. Delete the extra
   batches in the Sheet by hand; dedupe in the Apps Script prevents
   recurrence.
2. Create the localhost-scoped Google Sheets API key and put it in `.env.local`
   (see Environment variables above). Until then local data loads 403.
3. About panel — homepage attribution is done, but no about panel/component
   exists in the codebase.
4. Mobile/desktop audit — the font-display fix has shipped; re-run PageSpeed
   to confirm the 64/100 score has improved.
5. Make copy review — the live my_stack verdict for Make (and the homepage
   "What I'm Running" strip) still describes Make.com as running the whats_new
   automation. It's retired; the copy needs updating in the Sheet.
6. Subscribe page copy — live copy reads finished ("Cut through the noise",
   fortnightly digest framing); confirm this is the rewritten version before
   closing it out.
7. External links audit — not verifiable from the repo; status unknown.
8. Favicon — a full favicon set has been live since April 2026; confirm
   whether it's the intended replacement before closing this out.
9. Security audit follow-ups (2026-07-04) — full detail and priorities in
   `reports/2026-07-04-security-audit.md` and SCRATCHPAD queue item 7. No
   critical findings. Named here because it's user-facing: **the Submit a
   Tool form discards every submission** (`handleSubmit` only flips state) —
   wire it to a destination or pull the page. Also queued: GA consent mode
   (the cookie banner records a choice nothing reads), Apps Script shared
   secret, subscribers insert constraints, dependency bumps via bun,
   Lovable dead-code sweep.

Blocked: conversion layer prompts drafted, waiting on email confirmation for
hello@theeditai.co.uk (not verifiable from the repo; the live footer currently
uses hello@jasminaziz.co.uk).

## whats_new automation

Daily Claude Code Routine (trig_01288KFUKoGh4wWrewE7JqC2 — lives in claude.ai
Routines, not verifiable locally) fires at 8am UK. Reads Gmail
(news@daily.therundown.ai), extracts up to 5 stories, dispatches a GitHub
Actions workflow that POSTs to the Apps Script, which appends rows to the
`whats_new` tab.

GitHub Actions is the relay because the Routine sandbox blocks
script.google.com egress (network policy CONNECT 403, re-verified
2026-07-11). GitHub Actions can reach Google.

Workflow: `.github/workflows/append-whats-new.yml` in this repo.
Trigger: `workflow_dispatch` with `payload_b64` input (base64-encoded JSON).

Dispatch mechanism (the load-bearing part): the Routine MUST dispatch via the
GitHub MCP tool `actions_run_trigger` (method `run_workflow`, workflow_id
`append-whats-new.yml`, ref `main`). Raw `curl` to api.github.com CANNOT work
from the Routine sandbox: its proxy strips whatever Authorization header is
sent and injects the session's own scoped credential, which cannot dispatch
workflows (403 "Resource not accessible by integration"). A PAT in the
Routine prompt is therefore useless — GitHub never sees it. This was proven
2026-07-11 by sending a fake token and no token: both authenticated fine.
The repo connection ("add_repo") is the only credential the pipeline needs.
No PATs, no repo secrets.

> Status 2026-07-11: MCP dispatch verified end to end (run 29156307002,
> success, rows appended). History for the record: the June stall was the
> original 7-day PAT expiring; the July intermittency was agents sometimes
> following the prompt's broken curl instructions and sometimes reaching for
> the MCP tool. Remaining actions live in Outstanding item 1.

Apps Script URL (deployed under jasminaziz1@gmail.com, matches the workflow
file):
`https://script.google.com/macros/s/AKfycbxGOh2fvk986AMMh_f57uZRAftaCuJGT-E9XOC_0FI36zGSCGVOF2OY81bn3LxCR0I/exec`

This URL serves both `doGet` (schema inspection) and `doPost` (write rows).
The old URL (AKfycbyn23...) is dead — do not reintroduce it.

curl note: use `-d @file` without `-X POST` when calling Apps Script. The 302
redirect must be followed with GET to read the echo response; `-X POST` breaks it.

Schema: name, developer, date (DD MMM YYYY strict), what_it_is, category, url
Column order: A=name B=developer C=date D=what_it_is E=category F=url

Date format is load-bearing. It drives the month-grouping parser on the live site
and breaks it if wrong. No ranges, no "Unknown".

## Working discipline — Claude Code (default)

No prompt template needed, but keep the same discipline as the Lovable era:

- One job per change, never combine two changes
- Before editing, state what must not be touched
- Structure before styling; hex codes and pixel values, never vague adjectives
- Verify on the local dev server first, then on the production URL after the
  deploy lands
- Never assume the production Sheets API key will resolve locally — it's
  referrer-restricted to `theeditai.co.uk/*` and 403s from localhost

## If working in Lovable (legacy path — not the default)

- One job per prompt, never combine two changes
- Always include a DO NOT CHANGE list
- Always include a FLAG BEFORE BUILDING section for data dependencies and risks
- Hex codes only, never colour names
- Pixel values only, never vague adjectives
- Structure before styling
- Verify on the production URL, never trust the Lovable preview (env vars are
  Vercel-only, data never loads in preview)

## Vercel behaviours

- Build failures are silent. Vercel serves the last successful deploy. If a change
  has not appeared after 5 min, check the Deployments tab for a red failed build.
- New routes need a React Router entry only — vercel.json already has a SPA
  catch-all rewrite.
- New Google Sheets tabs need a fetch function in `src/lib/sheets.ts` plus a
  component/page to render them.
- Local dev uses a separate Google Sheets API key scoped to localhost only,
  kept in `.env.local`, never in Vercel and never committed. The production
  key stays restricted to `theeditai.co.uk/*`. If asked to debug a local
  data-loading failure, check this before anything else.

## What Claude must not do

- Never suggest deviating from the locked architecture (Claude Code + GitHub +
  Vercel + Google Sheets + Supabase; Lovable available as a legacy path only)
- Never confuse Supabase with the content layer — Google Sheets is content,
  Supabase is subscriber capture only
- Never reintroduce DM Mono
- Never use electric lime (#C8F04A) as a category colour or badge
- Never put charity-sector framing on the site
