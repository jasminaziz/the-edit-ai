# The Edit AI — Claude Project Context

## Project identity

The Edit (theeditai.co.uk) is an opinionated directory of AI tools for
communications teams in charities, cultural organisations and heritage.
Every tool is judged on the questions this sector has to answer before
adopting anything: where the data sits, whether the tool trains on input,
whether a nonprofit tier exists, whether typical use is likely to trigger a
DPIA, and whether you could explain it to your board in one sentence (the
shipped wording, `AboutPanel.tsx:108`). No sponsored listings, no affiliate
links, and no tool appears until it has been through the checks.

**Board or trustee is an open decision, 31 Aug 2026.** The site says both:
three `board` (`AboutPanel.tsx:108`, `PolicyTemplate.tsx:46` and `:151`) and
five `trustee` (`ToolCard.tsx:262`, `FooterEmailCapture.tsx:35`,
`DesignKit.tsx:48`, `PolicyTemplate.tsx:46`, `Submit.tsx:30`), with
`PolicyTemplate.tsx:46` using both in one paragraph. An earlier version of this
line claimed `trustee_note` is a schema name that never renders as a label.
**That was wrong and was asserted without checking**: `ToolCard.tsx:262` renders
`Say this to a trustee` on every expanded card, and it is approved copy from the
B3 microcopy pack, as is the footer string. The decision matters because only
charities have trustees, so the word un-names the local authority museum service
and the university gallery that the audience phrase exists to include: finding 5
of `reports/2026-08-29-audience-phrase-proposal.md`, which called it the deepest
finding in that review. Jasmin has agreed board should win; the replacement
strings are hers to approve because both originals are pack copy.

**The Edit is a comms resource first, with a compliance edge.** Jasmin's
ruling, 2026-08-26, taken after an A5 verdict rewrite drifted into a set of
governance notes. The axis is how tools get filtered and flagged. It is not
what the site is about. Three slots, three jobs, and they do not overlap:

- **The axis filters and gates.** The seven fields and the DPIA chip. It
  answers whether a tool can be adopted safely, and it decides whether a row
  appears at all.
- **The verdict recommends.** What the tool is for, whether it is worth the
  reader's time, where it lets them down. Centre of gravity is the comms work.
  Governance enters a verdict only where a governance fact is the reason to
  use or avoid that specific tool: Copilot, DeepSeek, HubSpot.
- **The trustee note is the sentence for the board.**

A ToolCard already renders five governance elements. A verdict that restates
them makes the card say one thing six times and never say whether the tool is
any good. Verdict voice: first person where it is evidence Jasmin has earned,
second person for the recommendation; the job is sector-specific, the tool
assessment is not re-derived for charities. Full spec and the fifteen worked
examples in `reports/2026-08-26-a5-verdict-drafts.md`.

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

`reports/2026-08-28-positioning-statement.md`, signed off 28 August 2026, is
canonical on what the site is for and who it speaks to, and outranks the
audit's premise paragraph where they conflict. It settles the claim as **been
through the checks**, never "passed", which is what lets the published failures
stay honest, and it carries the six-question test every surface is read
against. `reports/2026-08-28-surface-audit.md` holds one committed verdict per
surface against that test.

## The evaluation axis (the moat)

Seven fields per tool row beyond the basics. Field names are frozen (code
reads them). Allowed values and definitions were locked by Jasmin on
2026-08-23 and live in `reports/2026-08-23-axis-locked.md`, which supersedes
audit section 3 on every value and definition, including the DPIA chip
colours and the three toggle rules.

- `jobs` — one or more of: Research, Appeals & fundraising, Case studies &
  storytelling, Social, Internal comms, Accessibility, Translation.
  Multi-value, comma-separated in the Sheet. `Research` was added by
  amendment on 2026-08-25 and sorts first.
- `data_location` — UK / EU / EU option / US / Your tenant / Other / Unclear
- `trains_on_input` — No / No by default / Yes unless you opt out / Yes /
  Varies by tier / Unclear (added by amendment 2026-08-25: the vendor
  publishes no position at all). Only No and No by default pass the toggle.
- `nonprofit_tier` — free text, or None (confirmed absent, not unchecked)
- `dpia_flag` — Green / Amber / Red
- `trustee_note` — one sentence, sayable at a board meeting
- `last_checked` — date stamped when the fact fields were last verified

Judgement split (hard rule): **the line is whether an external source
determines the correct value, or whether someone has to choose it.** Name, url,
pricing, nonprofit tier, data location and training policy are
machine-verifiable facts and may be maintained by automation with sources. The
DPIA flag, trustee note, verdict, jobs, status and what_it_does are Jasmin's and
are NEVER written by any automation or code session.

Widened on Jasmin's ruling 2026-08-31, from a list that had name and url as
"never writable, by any route". A vendor renaming its product is a fact, and
facts should not queue behind a sign-off. What did not move: a URL that now
points at a *different product* is not a link fix, it is a question about what
the row is, and that stays hers (Windsurf, Smartmockups).

## The Sheet write path

`scripts/sheet-write.mjs` is the **only** path that writes to the Sheet, with 19
tests in `scripts/sheet-write.test.mjs`. Run them with `node --test
scripts/sheet-write.test.mjs`; `bun test` also picks them up, so the project gate
now reports 83 across 4 files, 64 of them the app's and 19 these guards. They sit
outside the vitest `src/**` glob deliberately: this is a script, not the app.

The guard is **per tab, never a global set of column letters**. Column I is
`url` on `learning` and `trains_on_input` on `tools`, so a global set would
accept "No by default" as a URL. Writable: `tools` A, D, F, H, I, J, M;
`my_stack` A and E; `design_kit` A and E; `learning` I. Refused permanently:
everything else, including `learning` column A, because those names are
composite labels Jasmin wrote rather than vendor strings.

Four guards, each because the failure it prevents is silent:

- **Every write must cite a source URL** or it is refused. A cell with no
  citable source is an assertion, not a fact. This is the control that makes the
  wider column list safe, not a short list.
- **Column A is re-read immediately before sending**, and any single name
  mismatch aborts the whole batch. `batchUpdate` addresses cells by position, so
  a row inserted since the diff was written would send every value one row out.
- **Every cell is re-read after writing** and printed as a receipt.
- **A `last_checked` stamp is dropped** for any row whose other writes did not
  land. That date is the site's claim a check happened; it is earned.

`--rollback` replays a run backwards, matching on the post-write name so a
rename can be undone too.

**There is no service account key and there must not be one.** The org enforces
`iam.disableServiceAccountKeyCreation`, which is correct and was deliberately not
switched off. Writes run as:

```
SHEETS_SA_IMPERSONATE=the-edit-audit@the-edit-490220.iam.gserviceaccount.com
```

via gcloud impersonation, so nothing lands on disk or in the repo. That service
account holds Editor on the Sheet. A key file and ADC remain as coded fallbacks.

**A Sheet edit is more live than a git push.** The site fetches Sheets at
runtime, so a written cell is public in seconds with no deploy, no build and no
review. A push takes two or three minutes through Vercel and is watchable. That
asymmetry is the reason the guards are where they are.

`reports/axis-policy-urls.json` is the row-to-policy map the fortnightly audit's
policy-date pass needs: 23 rows, 36 URLs, baseline dates, plus two recorded traps
worth not rediscovering. Google's `knowledge.workspace` pages carry an editorial
date in the body and a site-furniture UTC footer, and reading the footer produces
a false drift flag; and `canva.com/policies/*` serves fine to a real browser
while `canva.com/en_gb/*` is Cloudflare-blocked, which is what made a policy
archive diff possible at all.

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
- Subscriber capture: **none in this repo.** The Supabase `subscribers`
  write path was removed on the branch (2026-08-22). No file in `src/`
  imports the Supabase client or calls `.insert()`. The table still exists
  in the Supabase project but is orphaned: nothing writes to it, nothing
  reads it. Capture is a gated Substack post (see Conversion). Do not
  rebuild against the Supabase table.
- SEO: react-helmet-async. `SEO.tsx` emits per-page title, description,
  canonical, `og:title`, `og:description`, `og:url`, `twitter:title` and
  `twitter:description`, all derived from the props each page passes. It
  deliberately does **not** emit `og:image` or `og:type`: the static block in
  `index.html` owns those sitewide, and remains the fallback for scrapers
  that do not run JS. Do not add per-page `og:image` without replacing that
  split deliberately. Every page must pass title, description and canonical;
  `/submit` shipped no meta at all until 2026-08-22. (`/stack` was the other
  offender; it was cut on 2026-08-26.)
- Analytics: none. GA4 and the cookie banner were removed 2026-08-28 (commit d7221c8); the site sets no cookies, and Search Console is the measurement. If analytics ever returns, it returns with consent done properly.

### Branch discipline (the F2 gate is spent, 2026-08-30)

**The overhaul launched on 2026-08-30 and the gate closed behind it.** F2
passed, Jasmin signed off, and `overhaul/sector-axis` was fast-forwarded onto
`main`. The two are now the same commit and both are pushed to on every change:
`git push origin overhaul/sector-axis` then
`git push origin overhaul/sector-axis:main`.

The merge went as a remote fast-forward rather than a local checkout because a
parallel session's uncommitted files block switching to `main`. For the same
reason, update local `main` with `git fetch origin main:main`, which moves the
ref without touching the working tree.

Sessions still work on `overhaul/sector-axis`. That is now habit and a shared
convention, not a safety gate: **main is live, so anything pushed to it is
public within three minutes.**

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
are case-sensitive. Content changes in Sheets go live immediately, with no
deploy, and since the 2026-08-30 launch that cuts harder than it used to:
`main` now runs the header-based fetcher, so **a Sheet edit to any of the
fourteen columns is live to the public immediately, with no deploy and no
review.** Until the merge the axis columns could be populated freely because
main's positional fetcher ignored them. That safety net is gone.

`tools` columns: A name, B category, C status (legacy, being retired),
D cost, E verdict, F url, then G-M the seven axis fields in the order listed
above, then N what_it_does (added 2026-08-26: the one-line description the
card leads with). The fetcher on `overhaul/sector-axis` parses by header name
(same pattern as `fetchMyStack`), so column order no longer breaks it;
main's fetcher is still positional A-F until the merge. Header strings must
normalise to the field names exactly, with one alias: the Sheet header
`cost` maps to `pricing`.

See `.claude/schema.md` for the other tabs (last verified against live data
2026-08-26: `tools` 67 rows of which 15 are complete and render, `my_stack`
19 rows).

The Google Drive connector can read the spreadsheet by ID but may return
only the first tab. For reliable per-tab reads use the Sheets values API
with the production key and a `https://www.theeditai.co.uk/` referer.

## Routes and canonical URLs

Canonical base: `https://theeditai.co.uk` (no www). Every canonical in the
code is non-www. Do not add www. The Sheets API referer header is the
exception and uses `https://www.theeditai.co.uk/`.

Infrastructure matches this as of 2026-08-22: **Vercel serves the bare
domain as primary and www 308s to it.** It was the other way round until
that date, which meant every injected canonical pointed at a host the site
redirected away from. Do not flip it back. The production Sheets API key's
referrer list covers **both** `theeditai.co.uk/*` and
`www.theeditai.co.uk/*`; that is what makes the bare-host primary safe. If
either host is ever removed from that list, data fetches 403 and the
directory renders empty.

Routes: `/`, `/tools`, `/my-stack`, `/design-kit`, `/learning`, `/ai-news`,
`/policy-template`, `/submit`, `/privacy-policy`, `/terms-of-service`,
`/cookie-policy`.

Three redirects, all `Navigate ... replace`: `/whats-new` to `/ai-news`,
`/subscribe` to `/policy-template`, and `/stack` to `/tools`. None of the
three renders a page and nothing in the UI links to any of them. The
redirects are kept only to catch old, indexed and external links, so do not
delete them. `/stack` in particular was shared as a link by design, so live
share URLs point at it.

Fixed on the branch: the `/tools` canonical, previously pointing at a dead
`/toolkit` route. New routes need only a React Router entry —
vercel.json has a SPA catch-all.

## Conversion

**The template is not gated. Ruled 2026-08-30**, overturning the previous
subscriber-only ruling; the full reasoning is in `SCRATCHPAD.md` and should be
read before anyone reopens it.

The funnel: the directory attracts the charity, cultural and heritage comms
buyer → the AI-use policy template downloads directly and proves the expertise
→ "Work with me" converts to the consultancy. The Substack is an invitation in
the nav and footer, not a toll on the template. **There is no email capture
anywhere on the site**, and no email infrastructure is built or maintained in
this repo.

Why the gate went, in short: it was never built (C3 delivered nothing), it
leaked by design because the files sit at public URLs that the welcome email
was going to link, it contradicted a positioning built on giving the sector the
answer straight, and it filtered for the incautious reader when the careful one
is the buyer. Optimised for trust and reach over subscriber count.

Live in code as at 2026-08-30: the footer block and both nav links point at
`/policy-template`, all three labelled "Get the template →", and the page's own
CTA carries the same label and downloads `/AI-Use-Policy-Template.docx`
directly. **Keep all four labels identical.** The `.docx` is the linked
artefact because the page promises something ready to adapt; the `.pdf` sits at
`/AI-Use-Policy-Template.pdf`, unlinked, until its font substitution is fixed
by a Word export. `robots.txt` no longer blocks either file.

## Codebase conventions

**ToolCard colour lives in `src/index.css` under `.tool-card`, not in the
component.** Ruled 2026-08-29: the cobalt hover inversion looks exactly as it
did, but it is driven by a `data-selected` attribute on the card root plus
descendant rules, not by per-element ternaries. Those ternaries were why the
component could not carry a single responsive class. `ToolCard.tsx` now holds
zero inline `style={{}}` blocks and zero hex. **Do not put an inline hex back
into that file**; change `index.css`. The DPIA chips are keyed off `data-flag`
and no `[data-selected]` rule targets them, which is what keeps their locked
colours holding on the inverted card.

**The homepage About columns are a 12-column grid where both halves span 6.**
The left column was `col-span-5` against a right column at `col-start-7`, which
skips column 6 entirely, so the gap was an empty 48px column plus its two 64px
gutters: 176px, not the single gutter it looks like. Widening the left column to
`col-span-6` closes it without moving the right column, so the paragraph's line
breaks do not shift. **Do not push the header clamp past 56px**: the fourth line
starts at roughly 59px in a 608px column, and the 30px floor is what keeps the
phone out of it below an 804px viewport.

**Interaction states go in `index.css`, not in mouse handlers.**
`.about-byline` is the second component to move, after ToolCard's
`data-selected`, and the mechanism is the same both times: **an inline `style`
declaration outranks the stylesheet**, so an inline property is what forces a
component into JS handlers in the first place. Do not put `textDecoration` back
into the byline's style block; it would beat the hover rule, which is precisely
what the old `onMouseEnter`/`onMouseLeave` pair existed to work around. Hover
and `:focus-visible` share one rule, because the mouse-only version left the
single outbound link on the homepage with no visible state under the keyboard.

**The breakpoint contract.** `MOBILE_BREAKPOINT` in `src/hooks/use-mobile.tsx`
governs *chrome* (nav, homepage counter, hero pills, drag hint) at **1024**;
Tailwind's `sm:` governs *content layout* at **640**. No element should consult
both. 1024 is Tailwind's `lg`, so JS and CSS agree wherever they meet. The
desktop nav needs 1087px to lay out and every child is `whitespace-nowrap`, so
the nav gutter and item padding tighten at `lg` and return at `xl`; 1280 and
above renders as it always did. Before 2026-08-29 the hook was 768, which put
"Work with me" entirely off-screen from 768 to about 1086px, silently, because
`Layout.tsx:70`'s `overflow-hidden` clipped it rather than producing a
scrollbar.

`src/utils/slugify.ts` was deleted with the Stack cut on 2026-08-26. It
existed only to build `?stack=` share URLs, and nothing slugifies a tool name
any more. If URL encoding is ever needed again, add one module and keep it
single-source, as that file was.

`stripEmoji` in `src/lib/sheets.ts` applies to all text fields parsed from
the Sheet. Preserve it in any fetcher change.

Dead on disk, deliberately: `src/pages/Subscribe.tsx` is unimported and
unreachable since `/subscribe` became a redirect. It is retained for the
dead-code sweep in SCRATCHPAD queue item 7. Do not "fix" it by wiring it
back into the router.

Badge states: only IN MY STACK renders (forest green `#2D6A4F`,
`status === "in_stack"`, ToolCard.tsx). `on_radar` is live data but nothing
renders it. Blank status cells fall back to `on_radar`, so blanks and
`on_radar` are indistinguishable to the site. `StatusBadge.tsx` and
`STATUS_MAP` were both deleted on 2026-07-03 (commit `3e55953`); this
paragraph claimed they were still on disk until 2026-08-26.

## Design system (locked)

Colours (hex only, never names):
- `#FAF8F4` page bg · `#FFFFFF` card · `#9B9EDE` periwinkle · `#2D35C9` cobalt
  (display type, nav, CTAs, month headers)
- **Periwinkle moved from `#7B7FD4` to `#9B9EDE` on 2026-08-30**, on Jasmin's
  ruling that the periwinkle and cobalt combination stays but the hex may move
  to fix accessibility. Cobalt on it went 2.37:1 to **3.38:1**, clearing the 3:1
  display-type floor it had been failing on the homepage wordmark and on every
  legal and policy `h1`. Hue is unchanged to the decimal (237.3) and saturation
  barely moves; only lightness, 65.7 to 73.9.
- **Periwinkle never carries white text**: white measures 2.52:1 on it. Its
  foreground is ink `#1A1510` at 7.20:1, which is what `--secondary-foreground`
  is now set to.
- **The nav is cobalt on every route, including home.** It used to be
  periwinkle on the homepage, which put cream nav text at 3.40:1 and the lime
  "Menu" label at 2.75:1. A periwinkle dark enough to rescue them would have
  landed almost on cobalt and erased the wordmark, so the nav gave up the
  colour and the hero kept it. The "Work with me" pill lost its white-on-home
  special case with it and is lime everywhere.
- `#C8F04A` electric lime (accent/punctuation only — never a category
  colour or badge) · `#1A1510` text · `#9A8F82` muted · `#E8E2D8` borders
- `#6B625A` secondary text, token `--text-secondary`. **Muted `#9A8F82` never
  carries text**, ruled 2026-08-29: it measures 2.99:1 on cream and 3.17:1 on
  the card, so it fails AA at every size and sits below even the 3:1
  large-text floor. Muted keeps rules, dividers and icons. `#6B625A` is
  5.62:1 on cream and 5.97:1 on the card and replaces it wherever it carried
  words.
- **The token layer is now accurate, and was not before.** Seventeen HSL
  triples in `index.css` did not round-trip to the hex they encode: `--accent`
  rendered `#CEF047` against a locked `#C8F04A`, `--secondary` `#8084D0`
  against `#7B7FD4`, `--foreground` `#181410` against `#1A1510`. That is why
  components hardcoded hex and bypassed the tokens, and it meant the one
  token-driven lime on the site, the "Work with me" CTA, rendered a different
  lime from the other 44. Corrected 2026-08-29 to one decimal, each verified.
  **Before adding or editing any token, compute what it renders and compare to
  the locked hex. An integer triple almost never round-trips.**
- `#2D6A4F` forest green: the In My Stack badge, the Green DPIA chip, the
  DesignKit `free` cost badge and one of the three hero pill colours. The old
  "In My Stack badge only" scope had not been true for some time.
- **`#E8572A` burnt orange is retired, 2026-08-30.** It was the legacy On My
  Radar badge, and this file claimed it rendered nowhere while it was in fact
  colouring news category badges and hero pills. Both uses are gone: as a badge
  it carried white at 3.60:1, and against the lightened periwinkle hero it sat
  at 1.42:1, close enough to the ground that it separated on hue alone. If it
  ever returns it needs a darker variant and a ruling.
- **Hero pills** (`HomeGravity.tsx`) rotate cobalt, forest and ink `#1A1510`,
  with lime as a roughly 1-in-8 accent. Indigo `#4A4A9A` was removed in the
  same pass: no contrast defect, simply a colour the site never owned.
- **The cobalt hover is ink `#1A1510`. Ruled 2026-08-30.** A cobalt surface
  darkens to ink on hover, white text on it at 18.12:1. Three improvised
  hovers had grown up instead: `#1A22A8` on `/learning` and `/submit`, ink on
  `/policy-template` and in the news card toggle, and a lime swap on the
  ToolCard. Ink won because it was already the majority and it is locked, so
  nothing new entered the palette. `#1A22A8` is gone.
- **As at 2026-08-30 there is no off-palette hex left in live code.** Every
  remaining non-palette value in `src/` sits inside an explanatory comment or
  in `Subscribe.tsx`, which is unreachable dead code awaiting the sweep. If a
  grep turns one up in a rendering path, it is new and it is a regression.
- `#EEF0FB` cobalt tint, the established chip and badge background paired
  with `#2D35C9` text (index.css, ToolCard job chips, Learning). Documented
  2026-08-23: it was already in four places and missing from this list. The
  Stack page was the fourth and is gone; ToolCard's nonprofit-pricing block
  dropped the tint in the 2026-08-26 restructure, so job chips are now its
  only use on the card.
- DPIA chips, locked 2026-08-23: Green `#2D6A4F` on `#E4F0E9`, Amber
  `#7A5200` on `#FAF0DB`, Red `#A8261C` on `#FBE9E6`, text and 1px border in
  the same hex. AA-verified against both `#FFFFFF` and `#FAF8F4`.

Fonts: Chillax 700 display (Fontshare); Plus Jakarta Sans 400/500/600 body
(Google Fonts). DM Mono permanently retired.

DPIA flags render as text-labelled chips, never colour alone (the site
already carries AA contrast debt; do not add to it). The chip colours are the
locked trio listed above, signed off 2026-08-23. That sign-off included the
deliberate reuse of forest green `#2D6A4F` for the Green chip, so the earlier
instruction not to reuse it is spent and has been removed: it contradicted
the locked palette three lines above it.

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

**Closed 2026-08-28 by copy pack four.** The homepage counter used to read
"Passed the checks", against the ruled claim. It now reads "tools that have
been through the checks" (`Index.tsx:304`). Verified 2026-08-29: the string
"passed the checks" appears nowhere in `src/` or `index.html`.

**Audience phrasing, ruled 2026-08-29** (full reasoning in
`reports/2026-08-29-audience-phrase-proposal.md`). The three-part phrase stays
everywhere it appears in descriptions and body copy, and is never shortened to
"charity" alone: cutting it loses the local-authority museum service and the
university gallery as a matter of fact, and the cathedral or archive as a
matter of identity. Two forms, and the split is grammar rather than drift: the
**nominal** form "charities, cultural organisations and heritage" where the
audience is the object of the sentence, the **adjectival** form "charity,
cultural and heritage" where it modifies a noun (teams, organisations, comms).
Note that `vite.config.ts` ships two visitor-facing strings in the PWA manifest
and sits outside every copy inventory the project keeps: an audit that greps
`src/` and `index.html` will miss them.

## Current state (as at 2026-08-31)

**Live site (main): the overhaul.** It launched 2026-08-30. The sector axis,
the rebuilt ToolCard, the three toggles, the DPIA chip and the ungated policy
template are all what a visitor now sees at theeditai.co.uk. The paragraph that
stood here until 31 August said the live site was the unchanged old-brief site
and that nothing from the overhaul had reached it; that was true until the
merge and is now the opposite of the truth.

Sheet: `tools` is 67 rows with headers A-N. The seven axis columns G-M are
populated and column N (`what_it_does`) was added and filled on 2026-08-26.
**23 rows are complete and render**; the other 44 fail `isComplete()` and are
invisible to the site, which is the radar working as designed. Verified against
live Sheet data 2026-08-29, which clears the ten-row merge floor with room.

**Judgement coverage: complete, checked 2026-08-30.** All 23 rendering rows
have their judgement fields on file. Fifteen are in
`reports/2026-08-26-a5-verdict-drafts.md`; the other eight (Blotato, Ideogram,
Granola, Submagic, Seedance, Gemini, Gamma, Grok) are in
`reports/2026-08-28-batch2-judgement-drafts.md`, and the jobs that file flagged
as assumed match the Sheet, so they were confirmed too.

**Note for anyone auditing this again:** the judgement work lives in two files
with different naming, `a5-verdict-drafts` and `batch2-judgement-drafts`. A
filename search for "a5" or "verdict" finds only the first and produces a false
gap of exactly eight rows. That happened on 29 August and was written into this
file as a live blocker before being corrected. Search the report *contents* for
a distinctive phrase from the row, not the filenames.

One real observation stands, unrelated to the above: `isComplete()` gates on
`trustee_note` and `dpia_flag` but **not** on `verdict`, so a row could in
principle render with an empty verdict. None currently does.

**Row 40 is now Gemini Notebook, and the rename is only half done.** Google
renamed NotebookLM on 16 July 2026; the audit of 31 August wrote the new name and
URL to `tools` row 40 and `my_stack` row 12, so the directory and the stack page
agree. **`tools!L40`, the trustee note, still names NotebookLM.** Its substance
is intact and was reconfirmed word for word that day, including the claim that
Google does not publish where the documents are processed. Only the name is
stale, and it is Jasmin's to rewrite. Do not record the rename as finished.

Branch `overhaul/sector-axis`: header-based `fetchTools` reading all fourteen
columns; the DPIA chip, job chips with contains-matching, the three sector
toggles and `last_checked` all built and rendering against real Sheet data.
The localhost-scoped API key now exists in `.env.local`, so the dev server
loads live data.

Done 2026-08-26 (this session, seven commits): `what_it_does` wired into
`parseToolRows`; Build Your Own Stack cut; ToolCard restructured into explore,
buying and checks zones; the filter rail set to always wrap at `sm` and up
(F2c); C4(b) restricted to Red; the two approved card strings placed; these
docs corrected.

Done 2026-08-28 (three commits, both code jobs ruled and copy-free):

- **The homepage "What I'm running" strip reads `my_stack`** (`20f722a`), on
  Jasmin's ruling in the positioning statement. It had filtered `tools` on
  `status === "in_stack"` while the hero pills directly above it read
  `my_stack`, so the page made one claim from two sources. `fetchMyStack` was
  already in state for the pills, so this was a source swap, not a new fetch.
  Rows are taken in sheet order; whether the strip should honour the `featured`
  boolean that `/my-stack` sorts on is an open ruling.
- **`public/sitemap.xml` rewritten** (`c01a413`) to eleven bare-domain URLs,
  live routes only. Every URL had been `www.`, pointing at a host the site has
  308'd away from since the 22 August flip, so the one file `robots.txt` points
  search engines at disagreed with every canonical the code emits. It also
  listed two redirects and omitted six live routes. Each entry is now checked
  against a `path=` in `App.tsx` in both directions; the only routes absent are
  the three redirects and the catch-all. No `lastmod` or `changefreq`: a
  hand-maintained date field on eleven routes goes stale and then lies.
- **The pre-launch surface audit committed** (`2122b6e`). Two findings the
  relaunch gate needs: the legal pages describe the Supabase capture path
  removed on 22 August and claim session cookies that do not exist, while GA4
  processing goes unmentioned; and the failures the positioning statement
  presses as the site's scarcest asset are invisible on `/tools`.

Remaining after launch, none of it blocking:
1. **Content.** Fill the axis fields and verdicts for the rows still short of
   complete. 23 of 67 render; the rest are the radar working as designed. A4
   fact pass with sources, A5 verdicts against the sector rule.
2. **Outstanding rulings.** The homepage pills (`HomeGravity`, `MAX_PILLS` and
   a mobile cap) and their label, and the radar tab.
3. **The Substack post and welcome email.** Post-launch, and **no longer a
   gate**: the template gate was dropped on 2026-08-30, so nothing about the
   download depends on the post existing.
4. **The corrected PDF export from Word**, then re-link it. The template ships
   Word-only until then.
5. **The dead-code sweep**, including `src/pages/Subscribe.tsx`.

Note on timing: both the October window and the F2 gate are gone. The site
launched 2026-08-30. Any doc still framing merge, content or capture as
waiting for October or for F2 is stale.

Pre-existing debt not in overhaul scope: gates-audit findings (contrast,
heading skips, matter-js weight), GA consent mode, dependency bumps. Parked,
tracked in SCRATCHPAD.md.

Closed 2026-08-22: the Submit form discarded every submission (`handleSubmit`
only flipped state). The page now offers a mailto link instead. Its form code
is unreachable but still on disk for the dead-code sweep, alongside
`Subscribe.tsx`. (`StatusBadge.tsx` was long gone; see Badge states.)

Also parked, SCRATCHPAD queue item 1: the Routine prompt still instructs
curl dispatch and still contains PAT 16554137 (revoke it, GitHub never sees
it, so it is exposure with no function); the Apps Script still has no dedupe
and no shared secret, **and that understates it: its `doGet` returns the entire
`tools` tab, unpublished rows and draft verdicts included, to anyone with the
URL and no authentication at all** (verified 2026-08-31 with a plain curl and no
credential). The endpoint is a read of everything, not just a write of news rows.
The URL sits in this private repo so exposure is limited, but it is the reason
tools writes were NOT routed through this script: making it write arbitrary cells
would widen an already-open endpoint into the live directory; the duplicate 3 and 6 Jul whats_new batches need
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

Planned changes, still outstanding (see audit): the Routine's extraction rule
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
- **The gate before every commit is three commands, not two:**
  `bunx tsc --noEmit`, `bun test`, and **`bun run build`**. Added 2026-08-26
  after a code session ran the build for the first time and found that
  `tsc --noEmit` does not exercise the same path: Vite resolves imports,
  assets and plugin config at bundle time and can fail on things tsc passes.
  Vercel runs the build, and **Vercel build failures are silent** — it keeps
  serving the last good deploy — so a build nobody ran locally is a deploy
  that dies quietly. The chunk-size warning is the known matter-js debt and
  is not a failure.
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

- Never push to main without running the three-command gate first. The
  never-merge-before-F2 rule that stood here is spent: it merged on
  2026-08-30. What replaces it is that **main is live**, so an unbuilt or
  unverified push is visible to the public in about three minutes
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
