# The Edit AI — Claude Project Context

## Project identity

The Edit (theeditai.co.uk) is a live, curated AI tools directory and news feed.
Built and maintained by Jasmin Aziz. Serves two jobs: a genuinely useful AI
fluency reference for smart women in marketing and communications, and a
portfolio-quality proof of build capability for prospective consultancy clients.
Positioning: horizontal AI fluency. Charity framing belongs on the consultancy
site, never here.

## Tech stack

- Build environment: Lovable (all code changes via prompts)
- Repository: GitHub (jasminaziz/the-edit-ai) — auto-receives every Lovable push
- Hosting: Vercel — auto-deploys from GitHub main (2-3 min)
- Framework: Vite + React + TypeScript
- Styling: Tailwind
- Data layer: Google Sheets (all content lives here)
- Subscriber capture: Supabase (subscribers table only — not the content layer)
- SEO: react-helmet-async
- Analytics: GA4 (G-QHYYEWC2C0)

### Environment variables (Vercel only, never in repo)

```
VITE_GOOGLE_SHEETS_ID
VITE_GOOGLE_SHEETS_API_KEY    (restricted to theeditai.co.uk/*)
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY (must be this exact name — NOT VITE_SUPABASE_ANON_KEY)
```

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

See @schema.md for per-tab column schemas.

`google_drive_fetch` cannot read Google Sheets. Download as .xlsx and upload
to the thread instead.

## Routes and canonical URLs

Canonical base: `www.theeditai.co.uk`

Routes: `/`, `/tools`, `/my-stack`, `/design-kit`, `/whats-new`, `/learning`, `/subscribe`

New routes need both a React Router entry and a `vercel.json` rewrite rule or
they 404 on production.

## Codebase conventions

`src/utils/slugify.ts` is the single source of truth for URL encoding: lowercase,
strip parentheses and their contents, replace spaces with hyphens, strip remaining
special characters. Tool names store as raw strings in localStorage; slugs are for
URL construction only. Never duplicate this logic elsewhere.

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

## Current state (as at 2026-06-16)

Live and working: Home, AI Toolkit, What's New, My Stack, Design Kit, Learning,
Subscribe, Build Your Own Stack, SEO/AEO, security audit, whats_new automation.

Priority order:
1. Paste my_stack v4 into Sheets, then run My Stack Lovable prompt (immediate next)
2. Paste design_kit into Sheets, then run Design Kit prompt
3. Desktop layout + mobile audit (PageSpeed 64/100 — fix is font-display swap for Fontshare and Google Fonts)
4. Nav/footer IA restructure
5. Put Jasmin into the site (homepage attribution, about panel)
6. Subscribe page copy rewrite
7. External links audit
8. Favicon replacement

Blocked: conversion layer prompts are drafted but waiting on email confirmation
for hello@theeditai.co.uk.

## whats_new automation

Daily Claude Code Routine fires at 8am UK. Reads Gmail (news@daily.therundown.ai),
extracts top 5 stories, POSTs to Apps Script Web App, appends rows to `whats_new` tab.

Apps Script URL:
`https://script.google.com/macros/s/AKfycbxGOh2fvk986AMMh_f57uZRAftaCuJGT-E9XOC_0FI36zGSCGVOF2OY81bn3LxCR0I/exec`

Deployed under jasminaziz1@gmail.com, access: Anyone.

Schema: name, developer, date (DD MMM YYYY strict), what_it_is, category, url
Column order: A=name B=developer C=date D=what_it_is E=category F=url

Date format is load-bearing. It drives the month-grouping parser on the live site
and breaks it if wrong. No ranges, no "Unknown".

## Lovable prompt discipline (non-negotiable)

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
- New routes need a React Router entry plus a vercel.json rewrite rule or they 404 live.
- New Google Sheets tabs need a Lovable prompt to wire them to the site.

## What Claude must not do

- Never suggest deviating from the locked architecture (Lovable, GitHub, Vercel,
  Google Sheets, Supabase)
- Never confuse Supabase with the content layer — Google Sheets is content,
  Supabase is subscriber capture only
- Never reintroduce DM Mono
- Never use electric lime (#C8F04A) as a category colour or badge
- Never put charity-sector framing on the site
