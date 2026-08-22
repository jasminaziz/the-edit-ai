# The Edit AI — Claude Project Context

> DRAFT for Jasmin's review, 22 Aug 2026. On approval this file replaces
> `.claude/CLAUDE.md` wholesale, committed to the `overhaul/sector-axis`
> branch. Operational sections (env vars, automation mechanics, Vercel
> behaviours) are carried over from the current file unchanged unless marked;
> positioning, data layer and rules sections are rewritten for the re-point.

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

The rebuild brief is `reports/2026-08-22-overhaul-audit.html`. Where this
file and the audit conflict, the audit wins until this file catches up.

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
normalise to the field names exactly.

See `.claude/schema.md` for the other tabs (last verified 2026-07-03;
tools count verified at 66 rows on 2026-08-22).

## Routes and canonical URLs

Canonical base: `www.theeditai.co.uk`

Routes: `/`, `/tools`, `/stack`, `/my-stack`, `/design-kit`, `/learning`,
`/ai-news`, `/subscribe`, `/submit`, `/privacy-policy`,
`/terms-of-service`, `/cookie-policy`. `/whats-new` redirects to
`/ai-news`. `/policy-template` is being added on the branch.

Known bug being fixed on the branch: `/tools` canonicalises to a dead
`/toolkit` route (Tools.tsx). New routes need only a React Router entry —
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

## Design system (locked)

Colours (hex only, never names):
- `#FAF8F4` page bg · `#FFFFFF` card · `#7B7FD4` periwinkle (homepage hero
  only) · `#2D35C9` cobalt (display type, nav active, CTAs, month headers)
- `#C8F04A` electric lime (accent/punctuation only — never a category
  colour or badge) · `#1A1510` text · `#9A8F82` muted · `#E8E2D8` borders
- `#2D6A4F` forest green · `#E8572A` burnt orange

Fonts: Chillax 700 display (Fontshare); Plus Jakarta Sans 400/500/600 body
(Google Fonts). DM Mono permanently retired.

DPIA flags render as text-labelled chips, never colour alone (the site
already carries AA contrast debt; do not add to it).

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

Remaining before relaunch, in order: this file placed; copy pack placed
(homepage, meta/OG/JSON-LD, About panel, Tools subheading, Subscribe,
footer, /policy-template page); ToolCard + filters session (DPIA chip, jobs
chips with contains-matching, three sector toggles, last_checked display);
SEO repairs (canonical fix, /submit and /stack meta, per-page OG); October
content week (axis final-lock, row triage, top-10 field fill and verdicts);
capture live (template scrub, gated Substack post); merge and relaunch
check. The full sequence with estimates is the audit, section 7.

Pre-existing debt not in overhaul scope: gates-audit findings (contrast,
heading skips, matter-js weight), Submit form discarding submissions, GA
consent mode, dependency bumps. Parked, tracked in SCRATCHPAD.md.

## whats_new automation

Daily Claude Code Routine (trig_01288KFUKoGh4wWrewE7JqC2) fires at 8am UK.
Reads Gmail (news@daily.therundown.ai), extracts up to 5 stories,
dispatches the GitHub Actions workflow `append-whats-new.yml`
(workflow_dispatch, `payload_b64` input), which POSTs to the Apps Script,
which appends rows to the `whats_new` tab.

Dispatch MUST go through the GitHub MCP tool `actions_run_trigger`
(method `run_workflow`, ref `main`). Raw curl to api.github.com cannot work
from the Routine sandbox: the proxy strips the Authorization header and
injects a scoped credential that cannot dispatch workflows. No PATs, no
repo secrets — the repo connection is the only credential needed.

Apps Script URL (deployed under jasminaziz1@gmail.com):
`https://script.google.com/macros/s/AKfycbxGOh2fvk986AMMh_f57uZRAftaCuJGT-E9XOC_0FI36zGSCGVOF2OY81bn3LxCR0I/exec`
Serves doGet (schema inspection) and doPost (write rows). curl note: use
`-d @file` without `-X POST`; the 302 must be followed with GET.

Schema: name, developer, date (DD MMM YYYY strict — load-bearing, drives
the month parser), what_it_is, category, url. Columns A-F in that order.

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
