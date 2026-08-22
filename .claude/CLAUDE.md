# The Edit AI — Claude Project Context

## Project identity

The Edit (theeditai.co.uk) is an opinionated directory of AI tools for
communications teams in charities, cultural organisations and heritage.
Every tool is judged on the questions this sector has to answer before
adopting anything: where the data sits, whether the tool trains on input,
whether a nonprofit tier exists, whether typical use is likely to trigger a
DPIA, and whether it can be explained to a trustee in one sentence. No
sponsored listings, no affiliate links, and no tool appears until it has
been through the checks.

Built and maintained by Jasmin Aziz. The site is a lead engine for the
consultancy at jasminaziz.co.uk: the audience it serves is exactly the
audience the consultancy sells to. Charity-sector framing is the premise of
this site, not a contamination risk. (The old rule banning charity framing
enforced a firewall that was lifted in July 2026; it is gone deliberately.)

The rebuild brief is `reports/2026-08-22-overhaul-audit.html`. Its strategy
is canonical; its implementation detail is not. The audit predates this
branch and is stale in three places: it says five axis fields (there are
seven), columns G-L (they run G-M), and a fixed-position A-F fetcher
(retired, the branch reads by header). Where the two conflict on
implementation, this file wins.

## The evaluation axis (the moat)

Seven fields per tool row beyond the basics. Field names are frozen (code
reads them); definitions live in the audit, section 3.

- `jobs` — one or more of: Appeals & fundraising, Case studies &
  storytelling, Social, Internal comms, Accessibility, Translation.
  Multi-value, comma-separated in the Sheet.
- `data_location` — UK / EU / EU option / US / Unclear
- `trains_on_input` — No / No by default / Yes unless you opt out / Yes /
  Varies by tier
- `nonprofit_tier` — free text, or None (confirmed absent, not unchecked)
- `dpia_flag` — Green / Amber / Red
- `trustee_note` — one sentence, sayable at a board meeting
- `last_checked` — date stamped when the fact fields were last verified

Judgement split (hard rule): pricing, nonprofit tier, data location and
training policy are machine-verifiable facts and may be maintained by
automation with sources. The DPIA flag, trustee note and verdict are
Jasmin's judgement and are NEVER written by any automation or code session.

## Tech stack

- Build environment: Claude Code — local edits in `~/Developer/the-edit-ai`
- Repository: GitHub (jasminaziz/the-edit-ai)
- Hosting: Vercel — auto-deploys from GitHub main (2-3 min)
- Framework: Vite + React + TypeScript
- Package manager: **bun** — `bun.lock` is canonical; `package-lock.json`
  is stale. Never `npm install` or `npm audit fix`. Audits and updates go
  through bun.
- Styling: Tailwind
- Data layer: Google Sheets (all content lives here)
- Subscriber capture: Supabase `subscribers` table — legacy, write-only,
  nothing reads or sends from it. The capture mechanism is moving to a
  gated Substack post (see Conversion below); do not build on the Supabase
  table.
- SEO: react-helmet-async
- Analytics: GA4 (G-QHYYEWC2C0)

### Branch discipline (until the October 2026 relaunch)

All overhaul work lives on `overhaul/sector-axis`. Nothing merges to main
before the 19-23 October admin week: Vercel deploys main, and the live site
must not change until the relaunch is ready. Every session starts with
`git checkout overhaul/sector-axis` and confirms with
`git rev-parse --abbrev-ref HEAD`.

### Environment variables

```
VITE_GOOGLE_SHEETS_ID
VITE_GOOGLE_SHEETS_API_KEY (must be this exact name)
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY (must be this exact name — NOT VITE_SUPABASE_ANON_KEY)
```

Production values live in Vercel only, never in the repo. The production
Sheets key is referrer-restricted to `theeditai.co.uk/*` and 403s from
localhost. Local dev needs a separate localhost-scoped key in `.env.local`
(gitignored), restricted to `http://localhost:8080/*` — this project's dev
port, not Vite's default. If local data loading fails, check this first.

## Google account split

- **hello@jasminaziz.co.uk** (Workspace): Search Console, GA4, Cloud Console
- **jasminaziz1@gmail.com** (personal): Sheets API key, Apps Script Web App

Always confirm which account applies before touching anything
Google-authenticated.

## Data layer

Spreadsheet ID: `1RIO-WY9H75gML_UgdQbHGgDl-R0MfaG3CRPUp3PtAUI`

Tabs: `tools`, `my_stack`, `design_kit`, `learning`, `whats_new`. Tab names
are case-sensitive. Content changes in Sheets go live immediately — no
deploy needed — which is why row edits against the new axis wait for the
October week even though code lives safely on the branch.

`tools` columns: A name, B category, C status (legacy, being retired),
D cost, E verdict, F url, then G-M the seven axis fields in the order
listed above. The fetcher on `overhaul/sector-axis` parses by header name
(same pattern as `fetchMyStack`), so column order no longer breaks it;
main's fetcher is still positional A-F until the merge. Header strings must
normalise to the field names exactly, with one alias: the Sheet header
`cost` maps to `pricing`.

See `.claude/schema.md` for the other tabs (last verified 2026-07-03;
tools count verified at 66 rows on 2026-08-22).

The Google Drive connector can read the spreadsheet by ID but may return
only the first tab. For reliable per-tab reads use the Sheets values API
with the production key and a `https://www.theeditai.co.uk/` referer.

## Routes and canonical URLs

Canonical base: `https://theeditai.co.uk` (no www). Every canonical in the
code is non-www. Do not add www. The Sheets API referer header is the
exception and uses `https://www.theeditai.co.uk/`.

Routes: `/`, `/tools`, `/stack` (visitor's own Build Your Own Stack page),
`/my-stack`, `/design-kit`, `/learning`, `/ai-news`, `/subscribe`,
`/submit`, `/privacy-policy`, `/terms-of-service`, `/cookie-policy`. `/whats-new` redirects to
`/ai-news`. `/policy-template` is being added on the branch.

Fixed on the branch: the `/tools` canonical, previously pointing at a dead
`/toolkit` route. New routes need only a React Router entry —
vercel.json has a SPA catch-all.

## Conversion

The funnel: directory attracts the charity/cultural/heritage comms buyer →
the AI-use policy template, gated as a subscriber-only Substack post,
captures the email → the Substack builds trust → "Work with me" converts to
the consultancy. The `/policy-template` page presents the template and
links the Substack subscribe flow. No email infrastructure is built or
maintained in this repo.

## Codebase conventions

`src/utils/slugify.ts` is the single source of truth for URL encoding.
Tool names store as raw strings in localStorage; slugs are for URL
construction only. Never duplicate this logic elsewhere.

`stripEmoji` in `src/lib/sheets.ts` applies to all text fields parsed from
the Sheet. Preserve it in any fetcher change.

Badge states: only IN MY STACK renders (forest green `#2D6A4F`,
`status === "in_stack"`, ToolCard.tsx). `on_radar` is live data and still in
`STATUS_MAP`, but nothing renders it; `StatusBadge.tsx` is unused dead code.
Blank status cells fall back to `on_radar`, so blanks and `on_radar` are
indistinguishable to the site.

## Design system (locked)

Colours (hex only, never names):
- `#FAF8F4` page bg · `#FFFFFF` card · `#7B7FD4` periwinkle (homepage hero
  only) · `#2D35C9` cobalt (display type, nav active, CTAs, month headers)
- `#C8F04A` electric lime (accent/punctuation only — never a category
  colour or badge) · `#1A1510` text · `#9A8F82` muted · `#E8E2D8` borders
- `#2D6A4F` forest green (In My Stack badge only) · `#E8572A` burnt orange
  (legacy On My Radar badge, renders nowhere)

Fonts: Chillax 700 display (Fontshare); Plus Jakarta Sans 400/500/600 body
(Google Fonts). DM Mono permanently retired.

DPIA flags render as text-labelled chips, never colour alone (the site
already carries AA contrast debt; do not add to it). Chip colours are not
yet assigned: do not reuse forest green or burnt orange for Green/Amber/Red
without Jasmin's sign-off.

## Voice rules (locked — unchanged by the re-point)

The re-point changes who the site speaks to, not how it sounds.

- No em dashes anywhere, including meta tags and OG titles
- No inline quote marks in verdicts
- UK English, contractions throughout
- "Your stack" not "my stack" in all visitor-facing copy
- Verdicts: direct, frank, name the catch, do not bury limitations
- Sector precision is credibility: a DPIA is something an organisation
  does, not something a tool "needs" — the flag means typical comms use is
  likely to trigger one

Positioning and page copy are authored by Jasmin with Cowork Claude and
arrive as exact strings (see `reports/` copy pack). Code sessions place
strings; they never author or improvise visitor-facing copy.

## Current state (as at 2026-08-22)

Live site (main): unchanged old-brief site, 66 tool rows, six tool-type
categories. Branch `overhaul/sector-axis`: header-based `fetchTools` with
the seven axis fields (vitest-verified against fixtures), pushed to remote.
Sheet: awaiting G1:M1 headers (safe to add any time; main's fetcher ignores
them). Localhost API key: not yet created.

Remaining before relaunch, in order: ToolCard + filters session (DPIA chip,
jobs chips with contains-matching, three sector toggles, last_checked
display); SEO repairs (/submit and /stack meta, per-page OG in SEO.tsx);
October content week (axis final-lock, row triage, top-10 field fill and
verdicts); capture live (template scrub, gated Substack post); merge and
relaunch check. The full sequence with estimates is the audit, section 7.

Pre-existing debt not in overhaul scope: gates-audit findings (contrast,
heading skips, matter-js weight), Submit form discarding submissions, GA
consent mode, dependency bumps. Parked, tracked in SCRATCHPAD.md.

Also parked, SCRATCHPAD queue item 1: the Routine prompt still instructs
curl dispatch and still contains PAT 16554137 (revoke it, GitHub never sees
it, so it is exposure with no function); the Apps Script still has no dedupe
and no shared secret; the duplicate 3 and 6 Jul whats_new batches need
deleting by hand.

## whats_new automation

Daily Claude Code Routine (trig_01288KFUKoGh4wWrewE7JqC2) fires at 8am UK.
Reads Gmail (news@daily.therundown.ai), extracts up to 5 stories,
dispatches `.github/workflows/append-whats-new.yml`
(workflow_dispatch, one input `payload_b64`, base64-encoded JSON), which POSTs to the Apps Script,
which appends rows to the `whats_new` tab.

Dispatch MUST go through the GitHub MCP tool `actions_run_trigger`
(method `run_workflow`, workflow_id `append-whats-new.yml`,
ref `main`). Raw curl to api.github.com cannot work
from the Routine sandbox: the proxy strips the Authorization header and
injects a scoped credential that cannot dispatch workflows. No PATs, no
repo secrets — the repo connection (`add_repo`) is the only credential the
pipeline needs.

The relay exists because the Routine sandbox blocks egress to
script.google.com (network policy CONNECT 403, re-verified 2026-07-11). Do
not delete it on the assumption it is redundant.

Apps Script URL (deployed under jasminaziz1@gmail.com):
`https://script.google.com/macros/s/AKfycbxGOh2fvk986AMMh_f57uZRAftaCuJGT-E9XOC_0FI36zGSCGVOF2OY81bn3LxCR0I/exec`
Serves doGet (schema inspection) and doPost (write rows). The old URL
(AKfycbyn23...) is dead. Never reintroduce it. curl note: use
`-d @file` without `-X POST`; the 302 must be followed with GET.

Schema: name, developer, date (DD MMM YYYY strict, load-bearing, drives
the month parser), what_it_is, category, url. Columns A-F in that order.
No ranges, no "Unknown".

Planned changes (October, see audit): the Routine's extraction rule
re-points to sector-relevant stories only (zero-story days are correct
behaviour); the fortnightly Cowork task is rebuilt as the checks engine
(facts with sources, last_checked stamps, judgement flagged never
written). Post-relaunch option: script.google.com is reachable from the
Cowork cloud environment (verified 22 Aug), so if a direct Apps Script
call passes a redirect check, the GitHub relay and watchdog can be
deleted and the shared secret added.

## Working discipline

- One job per change, never combine two changes
- Before editing, state what must not be touched
- Structure before styling; hex codes and pixel values, never vague
  adjectives
- Verify with vitest or the local dev server first, then on the production
  URL after a deploy lands (branch work: vitest and preview only)
- Never assume the production Sheets key resolves locally — it is
  referrer-restricted and 403s from localhost

## Vercel behaviours

- Build failures are silent; Vercel serves the last successful deploy.
  Check the Deployments tab if a change has not appeared in 5 minutes.
- New routes need a React Router entry only.
- New Sheets tabs need a fetch function in `src/lib/sheets.ts` plus a
  component to render them.
- Preview deploys (`*.vercel.app`) 403 on Sheets data — the production key
  is referrer-locked to `theeditai.co.uk/*`. Verify data logic with vitest
  or the localhost key, not previews.

## What Claude must not do

- Never merge `overhaul/sector-axis` (or any overhaul work) to main before
  the October relaunch is signed off by Jasmin
- Never author or improvise visitor-facing copy — copy arrives as exact
  approved strings
- Never write the judgement fields (dpia_flag, trustee_note, verdict) from
  any automation or session — they are Jasmin's alone
- Never widen the directory back toward general AI tools: the row ceiling
  is 45, and every row must serve the charity/cultural/heritage comms
  audience or be a deliberate public "judged, not recommended" entry
- Never suggest deviating from the locked architecture (Claude Code +
  GitHub + Vercel + Google Sheets; Supabase is legacy capture only)
- Never confuse Supabase with the content layer — Google Sheets is content
- Never reintroduce DM Mono; never use electric lime as a category colour
  or badge; never rely on colour alone to carry meaning
