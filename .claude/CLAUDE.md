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

**Board, not trustee, where the governing body is meant. Ruled 31 Aug 2026,
and the swaps are shipped.** Only charities have trustees; the local authority
museum service, the university gallery, the NHS trust and the cathedral all have
boards, so `trustee` un-named exactly the readers the three-part audience phrase
exists to include. That is finding 5 of
`reports/2026-08-29-audience-phrase-proposal.md`, which called it the deepest
finding in that review.

Changed (`46b7389`): `FooterEmailCapture.tsx:35` to "questions your **board**
will ask", and `ToolCard.tsx:262`'s card label to "Say this to your **board**".
Neither is a new construction: `PolicyTemplate.tsx:151` already said "your board
will ask" and `AboutPanel.tsx:108` "explain it to your board". **Both originals
were approved pack copy** (the B3 microcopy pack and the 22 Aug copy pack
draft), so this supersedes them rather than correcting an error.

**Deliberately left, do not "finish the job":** `PolicyTemplate.tsx:46` keeps
"trustees, funders and supporters", a list of stakeholder groups you report to
rather than the governing body; `Submit.tsx:30` keeps "the trustee test"; and
the field stays `trustee_note`, a Sheet column the code reads by name, so
renaming it is a schema change.

**`DesignKit.tsx:48` was fixed the other way** (`bc121a8`), and the two rulings
must not be harmonised. It said "put in front of trustees and funders" and now
says "put in front of a room". The point there is not that `board` is the better
governance word, it is that **the design kit is about design and no governance
vocabulary belongs on it**, so `board` would have been just as wrong.

An earlier version of this block claimed `trustee_note` is a schema name that
never renders as a label. That was wrong and was asserted without checking:
`ToolCard.tsx:262` renders one. Quote visitor-facing copy from `src/`, never
from this file.

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

**Nothing schedules the axis audit. It runs only when Jasmin pastes
`reports/2026-08-31-axis-audit-claude-code-prompt.md` into Claude Code, and
nothing else starts it.** Ruled 2026-09-01. The fortnightly Cowork task no
longer runs the audit: its prompt is now a reminder plus a monthly
design_kit/learning discovery pass, and it explicitly does not check facts or
write to the Sheet. The only other automation touching this Sheet is the daily
8am `whats_new` Routine, which is a separate pipeline and writes only to that
tab.

So the failure mode is silence. If the prompt is never pasted, the audit does
not happen and nothing reports that it did not. The run itself is manual by
design, because it writes to a live site.

**The thing that fires is a Cowork trigger, "The Edit's fortnightly axis
audit" (`trig_01WgEnqKWcJc2WGby5Ecn5QQ`), created 1 September 2026 and
documented here for the first time on that date.** An earlier version of this
paragraph called the mechanism "a fortnightly calendar reminder (Mondays from
14 September 2026)", which named no system and no owner.

Its settings and its prompt do not agree, and this is unresolved as at
1 September. **Schedule: weekly, Monday 08:00, automatic approval on, "require
this computer" off, so it runs in the cloud whether or not the Mac is on.** Its
prompt branches on the **1st** and the **15th**. Over the twelve months from
7 September 2026 there are 53 Monday firings and exactly 4 land on either date,
all in February and March 2027. There is no fall-through branch, so the other
49 run the every-run nudge, which opens by asserting the audit is due today
with no condition attached. That is the pattern this project has already
watched destroy an alert channel's credibility once, in the whats_new watchdog.
The discovery pass, meanwhile, runs twice in twelve months rather than twelve.

**Ruled 1 September 2026, and NOT yet applied:** move the prompt to the
schedule rather than the schedule to the prompt. Audit due on the **2nd and 4th
Monday** (14 and 28 September, then 12 and 26 October), discovery on the
**first Monday of the month**, silent otherwise. Readable straight off the date
with no state to keep, and it preserves the 14 September anchor. The edit is in
Cowork and is Jasmin's to make; until it lands, the 7 September firing and
every Monday after it will say the audit is due when it is not.

**The Cowork task's "never write to the Sheet" is prose, not a control.**
Ruled 1 September 2026 to leave it that way, and recorded here as a known risk
rather than left to be rediscovered. The prompt forbids writes and forbids fact
checks, and it is well argued: the audit runs from a UK IP and renders
JavaScript pricing pages, which that environment cannot do, and duplicate
findings are what `reports/axis-rulings.md` exists to stop. But the same prompt
hands the model the spreadsheet ID, approval is automatic and nobody is
present. The boundary holds while the model keeps following an instruction.
**Do not describe this and `sheet-write.mjs` as equivalent safeguards.** One is
enforced per tab and per column in code with tests behind it; the other is a
sentence. If that ever needs to become real, the lever is the Cowork
connector's scope, not more emphasis in the prompt.

The monthly discovery pass (design_kit and learning suggestions, capped, never
writes) lives in the Cowork task alone. **It was deleted from the audit prompt
on 2026-09-01 so the two cannot drift.** Do not re-add it here.

`scripts/sheet-write.mjs` is the **only** path that writes to the Sheet, with 24
tests in `scripts/sheet-write.test.mjs` as at 2026-09-01. Run them with `node
--test scripts/sheet-write.test.mjs`; `bun test` also picks them up, so the
project gate reports **88 across 4 files, 64 of them the app's and 24 these
guards**. They sit outside the vitest `src/**` glob deliberately: this is a
script, not the app.

The guard count moves as guards are added — it went 19 to 24 on 2026-09-01 when
`c536d5a` added the cost-string checks — so **read the split from a run rather
than trusting the number here**, and when quoting the suite as evidence a gate
is clean, say which side of the split changed.

The guard is **per tab, never a global set of column letters**. Column I is
`url` on `learning` and `trains_on_input` on `tools`, so a global set would
accept "No by default" as a URL. Writable: `tools` A, D, F, H, I, J, M;
`my_stack` A and E; `design_kit` A and E; `learning` I. Refused permanently:
everything else, including `learning` column A, because those names are
composite labels Jasmin wrote rather than vendor strings.

**Column D carries one extra rule.** Only a number or a currency symbol
substituted inside the existing string shape may be written. A restructured
tier, a renamed plan or a withdrawn free tier is **flagged, not written**,
because that string carries editorial shape as well as a number, and the shape
is Jasmin's. HubSpot's 30 August move from a flat monthly fee to
seat-plus-credits is the worked example. `costShape()` enforces it by
normalising out digits and currency symbols and comparing what is left, and a D
write must carry the old value so there is something to compare. The
`shape_change` field is **refuse-only**: setting it true refuses the write and
no value permits one, so it cannot be used to force a restructure through.

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

**Every surface has a link checker. Only `/tools` has a fact checker.** Mapped
1 September 2026, after `/radar` shipped and made the question unavoidable.
Pass 1a sweeps every URL in `tools`, `my_stack`, `design_kit` and `learning`,
about 156 of them. Pass 1b and Pass 2, the passes that check whether a *claim*
is still true, are both scoped by the word **published**, which the audit prompt
defines by reimplementing `isComplete()` — and that is a `tools` predicate.

So fact-checking reaches 23 rows on one tab. `my_stack`, `design_kit`,
`learning` and all 44 radar rows publish prices, descriptions and verdicts that
nothing re-verifies. `whats_new` is excluded from the sweep as well, ruled
deliberately and now written into the prompt.

`/radar` is the sharp end and the reason this got looked at. `RadarCard` leads
with `verdict` on all 44 rows because `what_it_does` is empty on every one, and
**verdict is a judgement field no automation may write**, so the audit's only
lever on it is Pass 3, which fires when a fact moves underneath a verdict. No
facts are checked on those rows, so that trigger is structurally unreachable.

**Ruled 1 September: shrink the claim, do not extend the audit.** Checking 67
rows instead of 23 breaks the design point that makes a quiet fortnight nearly
free, and a cheap run is what makes it get run at all. The radar carries a
staleness signal as a **per-card chip**, not a line above the grid, because a
card is seen alone in a screenshot where a page-level disclaimer is not there to
qualify it. That also closes the open "radar status chip" item with one string.
**Still blocked on that approved string**; code sessions place copy and never
author it.

**Read row counts live, never carry them.** `design_kit` is **44**. It was 45 in
`.claude/schema.md` and 46 in both the audit prompt and the Cowork task, so no
document had it right and there was no majority to trust. The Cowork task still
tells discovery the tab is full on the strength of that number, and the 45-row
ceiling it invokes is set on the **directory** in this file, not on
`design_kit`. Whether it reaches the other tabs is the audit prompt's own open
decision 3. **That is an unruled question being enforced as settled, and it was
left conservative on purpose rather than quietly corrected.**

## Tech stack

- Build environment: Claude Code — local edits in `~/Developer/the-edit-ai`
- Repository: GitHub (jasminaziz/the-edit-ai)
- Hosting: Vercel — auto-deploys from GitHub main (2-3 min)
- Framework: Vite + React + TypeScript
- Package manager: **bun** — `bun.lock` is canonical. `package-lock.json` and
  `bun.lockb` were deleted on 2026-08-31, so the stale-lockfile hazard is gone
  rather than merely documented. Never `npm install` or `npm audit fix`;
  audits and updates go through bun.
- **Service worker: DISABLED, and it must stay that way.** Ruled 2026-08-31
  after Jasmin reported that most links still showed a cached version of the
  site. `vite.config.ts` sets `selfDestroying: true`, which ships a 608-byte
  worker that unregisters itself, deletes every cache and calls
  `client.navigate(client.url)`. **Do not remove that flag to "re-enable the
  PWA".** It has to remain until every returning visitor's browser has run it
  once, and taking it out reinstates the bug.
  The bug: the generated worker registered
  `NavigationRoute(createHandlerBoundToURL("index.html"))`, so every navigation
  was answered from the precache and never from the network, and that shell
  carries the hashed asset names. `registerType: "autoUpdate"` was set and did
  not help — the plugin only performs the reload when you register through
  `virtual:pwa-register`, and this project uses the injected script, a bare
  `navigator.serviceWorker.register('/sw.js')` with no callback. So the new
  worker took control while the tab kept running the old bundle, and since this
  is an SPA, internal link clicks do no document fetch and never picked up a new
  build. Every deploy from 5 to 31 August reached returning visitors a visit
  late.
  **The manifest, icons, theme colour and standalone display are untouched**, so
  the site is still installable; only offline caching is gone, and it was never
  a requirement. Sheet data was never affected, being fetched at runtime — it
  was the code that lagged. Verified on production: planting a stale workbox
  cache and registering the worker left `caches.keys()` empty, the planted entry
  unreadable and `getRegistrations()` at 0.
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
  **`data-rh="true"` on the five static tags in `index.html` is
  load-bearing. Do not remove it.** react-helmet-async only ever removes tags
  carrying that attribute — its DOM routine does
  `querySelectorAll(type + '[data-rh]')` — so without it a static tag does not
  act as a fallback, it **coexists** with the injected one. That was live from
  launch until 2026-08-31: every page using `<SEO>` carried two descriptions,
  two `og:title`s, two `og:description`s and two twitter equivalents, with the
  static homepage copy **first in document order**, so anything taking the
  first match read the homepage description on seven routes. Marking them lets
  helmet adopt and replace them, which keeps the no-JS fallback instead of
  deleting it. `og:image`, `og:type` and `twitter:card` stay **unmarked**
  because `SEO.tsx` never emits them; marking those would make helmet strip
  them. Any tag added to `index.html` that `SEO.tsx` also emits needs
  `data-rh` too.
  Consequence, so it is not read later as a regression: a client-side
  navigation to a route rendering no `<SEO>` now removes the adopted tags,
  because helmet unmounts and cleans up what it owns. A direct load of that URL
  is unaffected, which is what crawlers do.
- **`/privacy-policy`, `/terms-of-service`, `/cookie-policy` and the 404 ship
  no meta at all.** The three legal pages render through `LegalPage.tsx`, which
  has no `Helmet`; `NotFound.tsx` imports only react and react-router-dom. No
  title, no description, **no canonical**, and all three legal routes are in
  `sitemap.xml`. Found 2026-08-31 and still open: titles and descriptions are
  copy and are Jasmin's, but the canonical is not copy and could be fixed on
  its own.
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

Routes: `/`, `/tools`, `/radar`, `/my-stack`, `/design-kit`, `/learning`,
`/ai-news`, `/policy-template`, `/submit`, `/privacy-policy`,
`/terms-of-service`, `/cookie-policy`.

**`/radar` is deliberately NOT in the main nav.** Added 1 Sep 2026 on Jasmin's
28 August ruling that the radar gets its own tab, then kept out of the nav on
her ruling of 1 September that it should link off `/tools` instead. It is a
secondary view of the same directory, not a seventh destination, and a seventh
nav item measured scrollWidth 1046 against clientWidth 1024 and silently
clipped "Work with me" — the same failure this file records for 768-1086px. The
signpost on `/tools` is therefore the only route in, which makes it
load-bearing rather than decorative. It renders above the grid from `sm` up and
below the grid beneath it, never both, because on a phone it took the first
screen away from a reader still working out what `/tools` is.

**Radar rows are selected by `!isComplete()`, never by `status === "on_radar"`.**
Blotato and Grok are finished, published rows still carrying `on_radar` from
before they were completed, so a status filter would list two tools that already
live on `/tools`. `isComplete()` is the predicate the grid and the homepage
counter already share, so a row appears on exactly one of the two pages. As at
1 Sep: 23 render on `/tools`, 44 on `/radar`.

`ToolCard` is **not** reused there. Its "THE CHECKS" heading renders
unconditionally, above fields that are empty by definition on a radar row, so it
would print a checks header over nothing on the one page whose point is "not
checked yet". `RadarCard` mirrors the pre-axis tools card instead — name,
category chip, price, a "What it is" toggle and a plain Visit link — and shares
the real look and feel through the same `.tool-card` and `tc-*` classes. Its
Visit link uses `tc-policy-link`, not the directory's lime `tc-visit` pill, so a
lead does not read as a recommendation, and it carries **no IN MY STACK badge**:
seven of the 44 rows carry `status === "in_stack"`, and that badge on a page
saying "treat them as leads, not recommendations" was the sharpest contradiction
on it.

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

Live in code, re-counted 2026-08-31: **five** links carry "Get the template →",
not four. `Layout.tsx:145` (mobile nav), `Layout.tsx:226` (desktop nav),
`FooterEmailCapture.tsx:61`, `Tools.tsx:265` and `PolicyTemplate.tsx:106`, which
is the one that downloads `/AI-Use-Policy-Template.docx` directly. **Keep all
five labels identical.** The `Tools.tsx` one was missing from this list; the
labels themselves were already consistent, so the rule held and only the
inventory was short. `ToolCard.tsx:213` is a sixth link to the same route,
gated to Red, and carries a deliberately different sentence.

**There is no PDF at `/AI-Use-Policy-Template.pdf`.** An earlier version of this
block said it "sits at" that URL, unlinked. It does not: the file was removed
from `public/` before launch and the URL returns the SPA shell. The source PDF
is at `reports/AI-Use-Policy-Template.pdf` (142,558 bytes) and is not served.
`PolicyTemplate.tsx:84` had this right all along. Nothing in the tree links the
`.pdf`; the only two mentions are that comment and one in `robots.txt`, which no
longer blocks either file.

**Never verify a file on this site by status code.** `vercel.json` is a SPA
catch-all, so a missing file returns **200 with `content-type: text/html`** and
the body of `dist/index.html`. **Check the content-type**, or grep the body for
a string only the real thing contains. Verified 2026-08-31: the `.docx` returns
21,711 bytes with the correct wordprocessingml MIME type, while `/llms.txt` and
`/AI-Use-Policy-Template.pdf` both return `text/html`.

Do **not** memorise the shell's byte count as the fingerprint. An earlier
version of this block named 3,071 bytes, and that number was stale within the
hour: adding a comment to `index.html` in the same session took it to 4,380. Any
edit to `index.html` moves it. Compare against the current `dist/index.html` if
you want a size check, and treat content-type as the durable signal.

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

**`FooterEmailCapture` renders from `Layout.tsx:258`, so it is on every route.**
Anything it names is multiplied across the whole site, and on a page that also
names the audience in body copy the reader meets it twice: `/tools` and
`/policy-template` both did. It carried the three-part audience phrase until
2026-08-31 for exactly that reason, and the phrase was cut from it (`3c812b1`),
leaving "Free. The document that answers the questions your board will ask."

The working principle that came out of it: **meta strings cannot crowd each
other, because nobody reads two.** A search result shows one, an answer engine
reads one, so the full phrase is free there and earns its length. On-page copy
is read in sequence, so that is where crowding is real and where the phrase has
to justify itself. It now appears in visible copy in three places only:
`AboutPanel.tsx:108`, `Tools.tsx:250` and `PolicyTemplate.tsx:46`.

**`CobaltZone` carries a `helpBubble` disclosure, and its subheading is an
`h2`.** Both added 1 Sep 2026.

`helpBubble` takes `{ question, answer }` and renders a cream pill beside the
heading that opens a white panel with a tail. It exists because Jasmin reported
the DPIA explanation was "lost on the page" as a paragraph above the grid; that
paragraph moved into it and the string now appears once in the tree. Only
`Tools.tsx` passes it, and the prop is named generically rather than
`dpiaBubble` because the component serves seven routes.

Three things about it that are not obvious and cost real time:

- **It is a disclosure, not a tooltip.** ARIA tooltip semantics are for
  transient supplementary content and must not hold interactive or substantial
  content. `src/components/ui/tooltip.tsx` survives in the tree and is the
  wrong primitive here. Do not reach for it.
- **The section drops `overflow-hidden` when a bubble is present**, because it
  would clip the open panel. Safe only because the routes relying on that
  overflow pass an illustration or the rotating `rightBadge`, and none passes a
  bubble.
- **The bubble sits in a flex column, not an overlay.** It was absolutely
  positioned at `right-0` like `rightBadge`, which reserves no space, so the
  full-width subheading ran underneath it. Padding would be a magic number that
  breaks when the question string lengthens. Related: its old wrapper carried
  `-translate-y-1/2`, and **a transform creates a stacking context**, so the
  panel's `z-50` was scoped inside the wrapper's `z-20` and lost to the sticky
  filter bar at `z-40` — which painted over the answer and looked exactly like
  clipping.

The subheading renders as `<h2>`, not `<p>`, and tool card names render as
`<h3>` wrapping the link rather than a bare anchor. Together these close the
documented heading-skip debt for the directory: `/tools` and `/radar` now run
h1, h2, h3 with no level skip, where before every page went h1 straight to h3
and 22 of 23 card names were not headings at all. Tailwind's preflight strips a
heading's own size, weight and margin, so both render identically to what they
replaced. Worth knowing if revisited: these subheadings are taglines rather than
section titles, so the `h2` is a structural fix rather than a semantic ideal.

`subheading` is typed `ReactNode`, not `string`, so a call site can place a line
break inside an approved string. `/tools` uses a `<br className="hidden
md:inline" />` after the semicolon; the rendered `textContent` is unchanged, so
it still reads as one sentence to a screen reader.

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

**The dead-code sweep ran on 2026-08-31 and `src/pages/Subscribe.tsx` is now
deleted**, along with the rest of it. The paragraph that stood here retained
that file deliberately for the sweep; the sweep is what it was waiting for.
`/subscribe` remains a redirect to `/policy-template` and must stay.

What went, in five commits, one job each. The list was generated by transitive
reachability from `main.tsx`, not by hand:

- the two `src/integrations/supabase/` files, unimported since the capture path
  was removed on 22 August
- `src/pages/Subscribe.tsx` and `src/components/NavLink.tsx`, the latter a
  Lovable-era compat wrapper nothing ever imported. Worth noting for anyone
  re-reading `Layout.tsx`: it does import `NavLink` at `:126` and `:191`, but
  **from `react-router-dom`**, not from the deleted module
- 44 of the 51 `src/components/ui/` components, plus the duplicate
  `ui/use-toast.ts`. **Four remain: `animated-counter`, `gravity`, `sheet`,
  `tooltip`.** Corrected 1 Sep 2026. This line previously named seven, adding
  `sonner`, `toast` and `toaster`, and said the live toast hook was
  `src/hooks/use-toast.ts`. None of those four files exists: the toasters went
  in this same sweep and `App.tsx:22-27` records why, so the paragraph was
  describing the state before its own commit. `src/hooks/` holds
  `use-mobile.tsx` and nothing else
- `bun.lockb` and `package-lock.json`. Deleting the stale npm lockfile is what
  actually removes the "never run `npm install` here" hazard, rather than
  restating the rule. `bun install --frozen-lockfile` still resolves clean

**The measurable effect was in the CSS, not the JS.** Removing unreachable
modules left the JS bundle byte-identical, because Rollup was already
tree-shaking them. But Tailwind was scanning those 44 files and generating
utilities for classes nothing rendered: **CSS fell from 69.84 kB to 35.26 kB**,
gzip 12.92 to 7.73. Roughly half the stylesheet on every route existed for dead
components. Verified against the built `dist/`, not just a passing typecheck,
because purging is content-scanned and `tsc` cannot see it.

Deliberately left: `supabase/` (its `migrations/` is the only local record of
what was applied to a project that still hosts the ops-dashboard tables),
`@supabase/supabase-js` and the orphaned radix packages in `package.json`
(removing them means a lockfile re-resolve, which is its own job with its own
verification), and `lovable-tagger`, which is **not** dead — `vite.config.ts:4`
imports it.

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
- **Hero pills** (`HomeGravity.tsx`) rotate cobalt, forest, ink `#1A1510` and
  red `#A8261C`, with lime as a roughly 1-in-8 accent. Indigo `#4A4A9A` was
  removed in the 30 Aug pass: no contrast defect, simply a colour the site never
  owned. **Red joined on 1 Sep 2026**, on Jasmin's ruling, restoring some of the
  warmth burnt orange carried. It is a locked hex rather than a new one, so this
  is the Red DPIA ink and the "Judged, not recommended" badge doing a third job;
  that reuse has precedent, since forest already serves as a badge, a chip and a
  pill. It was chosen over reviving burnt orange because the two converge: the
  hero is light enough that any warm colour clearing the 2.54:1 boundary floor
  has to be dark, and `#E8572A`'s own hue only clears it near 36% lightness,
  which lands on `#A63512` and reads almost identically. Boundary 2.82:1, white
  label 7.10:1. Note the rotation is indexed `h % CORE_COLOURS.length`, so
  adding a colour reshuffles every pill, not just the new ones.
- **The cobalt hover is ink `#1A1510`. Ruled 2026-08-30.** A cobalt surface
  darkens to ink on hover, white text on it at 18.12:1. Three improvised
  hovers had grown up instead: `#1A22A8` on `/learning` and `/submit`, ink on
  `/policy-template` and in the news card toggle, and a lime swap on the
  ToolCard. Ink won because it was already the majority and it is locked, so
  nothing new entered the palette. `#1A22A8` is gone.
- **As at 2026-08-30 there is no off-palette hex left in live code.** Every
  remaining non-palette value in `src/` sits inside an explanatory comment. The
  other exception this line used to name, `Subscribe.tsx`, was deleted in the
  2026-08-31 sweep, so the carve-out for it is spent and the claim is now
  simply stronger. If a grep turns one up in a rendering path, it is new and it
  is a regression.
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
- **"My stack", first person, throughout. Ruled 1 Sep 2026.** This line used to
  read `"Your stack" not "my stack" in all visitor-facing copy`, and **that rule
  is spent**. It belonged to Build Your Own Stack, the feature where a visitor
  assembled a stack of their own and the possessive genuinely was theirs. That
  feature was cut on 2026-08-26 (`792360a`), and with it the only context in
  which "your stack" made sense. What remains is Jasmin's own stack, so the
  possessive is hers.

  The code was already right and never drifted: `MyStack.tsx:337` is "My Stack",
  `Layout.tsx:11` is "My Stack", the subheading is "What I'm actually using and
  why", and the badge is "IN MY STACK". `/radar`'s "On My Radar" is the same
  choice made again and is correct for the same reason. Verified 1 Sep: the
  string "your stack" appears nowhere in `src/`, `index.html` or
  `vite.config.ts`.

  The design agent flagged this as a rule-versus-code conflict and was right to
  raise it; it could not tell from source which side was stale. It was the rule.
  **Do not "restore" the old wording**
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

**The rail wraps at `lg`, not `sm`. F2c's `sm` was superseded three days
later** by `ffcc6e9` on 2026-08-29, and this file went on quoting the 26 August
state. `Tools.tsx:152` reads `lg:flex-wrap lg:overflow-visible`, and the
gradient fade at `:177` is `lg:hidden` to match. The move was deliberate and
correct: wrapping from `sm` left the rail a 128px track beside a 400px search
box while the widest chip is 228px, so between 640 and 739px a chip escaped the
viewport and dragged the page into horizontal scroll. Below `lg` the search
takes its own row and the rail keeps the scroller. **At `lg` and up nothing
changed, so the F2c ruling still holds** — only the breakpoint that delivers it
moved. Do not "restore" `sm`: it reintroduces the horizontal scroll.

Consequence worth knowing before anyone reads the rail as broken on a phone: at
360px it overflows by 756px with two chips fully visible, and at 800px by 380px.
That is the design below `lg`, and the 40px fade is present and correct as the
affordance.

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
5. ~~The dead-code sweep~~ **done 2026-08-31.** See the sweep block under
   Codebase conventions for what went and what was deliberately left.

Note on timing: both the October window and the F2 gate are gone. The site
launched 2026-08-30. Any doc still framing merge, content or capture as
waiting for October or for F2 is stale.

Pre-existing debt not in overhaul scope: gates-audit findings (contrast,
heading skips), GA consent mode, dependency bumps. Parked, tracked in
SCRATCHPAD.md. **matter-js weight came off this list on 2026-08-31**: it is
lazy-loaded and no longer ships to any route but `/`.

Closed 2026-08-22: the Submit form discarded every submission (`handleSubmit`
only flipped state). The page now offers a mailto link instead. Its form code
is unreachable but still on disk: it sits inside `Submit.tsx`, which is a live
route, so the 2026-08-31 sweep could not take it the way it took the
free-standing `Subscribe.tsx`. Removing it means editing a rendering file, not
deleting one. (`StatusBadge.tsx` was long gone; see Badge states.)

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
behaviour). **The "rebuild the fortnightly Cowork task as the checks engine"
item is DONE and has been removed from this list.** The checks engine shipped
on 2026-08-31 as `scripts/sheet-write.mjs` plus the audit prompt, running in
Claude Code, not in Cowork. Do not rebuild it. Post-relaunch option: script.google.com is reachable from the
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
