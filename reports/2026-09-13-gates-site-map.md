# Gate report: design/site-map, 13 September 2026

Branch `design/site-map` at `73d624c`, compared against `origin/main` at
`459757d`. Scope: the site-map build only (build-plan.md steps 1, 2, 2b, 3,
4b, 6). Gate 4 here covers operations only; site-security owns the security
half and has not run separately for this branch.

Source: `~/.claude/guides/website-build/web-build-guide.html`, header-stamped
verified 14 Aug 2026, one month old, inside the six-month re-verify window,
so it is current and used as the authority for thresholds and check order.
Its §7/§8 property panels for theeditai.co.uk carry the same 14 Aug date but
describe the pre-overhaul site; they are treated as dated claims throughout,
not fact, per the guide's own rule, and checked against the live tree rather
than assumed. Several are now stale (see "What moved" below). Stack: Vite +
React on Vercel (Appendix B), confirmed from `package.json` and `vite.config.ts`.

Previous report on this project: `reports/site-gates-2026-08-05.md`, five
weeks before the 30 August overhaul launched. Most of its findings are
superseded by that launch, not by this branch; noted below where relevant.

## Verdict

- **Gate 1, Accessibility (WCAG 2.2 AA): FAIL.** Everything this branch adds
  (nav landmarks, `aria-current`, the checks-line and hub-row contrast) checks
  out. The fail is a pre-existing, unrelated defect: placeholder-only search
  inputs on `/tools` and `/radar`, still unlabelled. Manual checks unrecorded.
- **Gate 2, Performance: FAIL, unaffected by this branch.** Pre-existing:
  bundle over the 500KB threshold, one font origin still missing preconnect,
  no PageSpeed mobile score ever recorded since the overhaul relaunch.
- **Gate 3, SEO/AEO: FAIL, this branch's own change is correct.** The
  sitemap edit (removing `/submit`) is right and verified against `App.tsx`.
  Pre-existing gaps persist: no Organization schema, a bare wildcard in
  `robots.txt` with no AI-crawler decisions, legal pages still carry no
  title or description (their canonical, contrary to CLAUDE.md's current
  text, was already fixed 31 Aug, code checked, not assumed), no recorded
  Search Console crawl-report check.
- **Gate 4, Operations only (site-security owns security): PENDING.** No
  serverless functions and no live form or data-write path exist in this
  repo to instrument, so there is nothing for this branch to have broken.
  The three manual checks (uptime monitor, Vercel failure notifications,
  alert destination) have no evidence of ever being run or recorded.

None of the four gates can be marked passed. Gate 1 and Gate 3 fail on
findings this branch did not create and does not need to fix before merge
(they are pre-existing, tracked debt); this branch's own additions pass
every code-level check available to a terminal session. Gate 2 and Gate 4
are unaffected either way and remain open on evidence, not on new code.

---

## Gate 1: Accessibility (WCAG 2.2 AA): FAIL

### This branch's own surfaces: pass

Verified by rendering all twelve routes plus the mobile drawer in headless
Chrome (`node_modules/playwright`, `channel: 'chrome'`, since no Playwright
browser binary is cached on this machine) against the local dev server on
port 8080.

- **Two labelled landmarks.** Every route shows exactly one `<nav
  aria-label="Main">` inside a `<header>`; the four hub routes
  (`/my-stack`, `/design-kit`, `/learning`, `/ai-news`) additionally show
  `<nav aria-label="How I work">`. Opening the phone drawer at 390px
  (`Layout.tsx:379` onward) confirmed the desktop bar's "Main" and the hub
  row are both `aria-hidden` while the drawer renders its own "Main", never
  two exposed at once, and never two navs with the same accessible name
  live simultaneously.
- **`aria-current` set by hand, correctly** (`Layout.tsx:83-92`): "page" on
  the current page's own link, and "true" on the hub tab specifically on the
  three hub pages it does not link to (`/design-kit`, `/learning`,
  `/ai-news`); on `/my-stack` itself the hub tab reads "page", since that is
  literally its target. Confirmed by DOM inspection on all four hub routes.
- **Heading order: no skips anywhere.** All twelve routes render h1 → h2 →
  h3 with nothing missing a level (checked by tag sequence, not by eye).
  This closes the h1→h3 skip this branch's own plan flagged as historic
  debt on `/design-kit` and `/learning`; the fix (CobaltZone's subheading as
  a real `<h2>`) predates this branch (1 Sep 2026) and this branch does not
  disturb it.
- **Contrast on the new surfaces, computed, not eyeballed:**
  - Hub-row labels, `rgba(250,248,244,0.75)` on `#2D35C9`
    (`Layout.tsx:388`): blended ratio **5.19:1** against a 4.5:1 floor for
    13px text. Confirmed both by hand (WCAG relative-luminance formula) and
    by reading the rendered `getComputedStyle().color` in Chrome, matches
    the build-plan's stated 5.18:1.
  - Checks-line and header body text, `rgba(250,248,244,0.85)` on
    `#2D35C9` (`CobaltZone.tsx:290,298`): **6.23:1**, matching the stated
    6.24:1. Both clear 4.5:1 comfortably; this is a raise from the previous
    60%/3.86:1, which failed.
  - Subheading lime `#C8F04A` on `#2D35C9` (`CobaltZone.tsx:281`,
    unchanged by this branch): **6.50:1**, well clear.
- **Target size:** hub-row links measure 75–89px wide by 31.5px tall; main
  bar tabs 67–105px by 32px. All comfortably over the WCAG 2.2 24px floor.
  Checked at 390px too, the hub row fits in 358px with no overflow and no
  horizontal page scroll.
- **No new keyboard traps, no new div-as-button.** The nav is `<Link>`
  throughout (swapped from `NavLink` deliberately, per the file's own
  comment, because `NavLink` could not mark the hub tab "true" on pages it
  doesn't link to); the drawer's hub group uses `role="group"
  aria-labelledby`, not a second unlabelled list.
- **No console or page errors** on any of the twelve routes on a cold load.

### Pre-existing fail, not touched by this branch

**`src/pages/Tools.tsx:225` and `src/pages/Radar.tsx:257`**, the "Search
tools..." `<input>` on both pages has a `placeholder` and no `<label>`, no
`aria-label`, no `aria-labelledby`. This is the guide's named common failure
("placeholder-only is a fail", §4 Gate 1 rule 3) and it is live on the two
busiest filter surfaces on the site. Neither file is touched by this
branch's diff, so this is not new, but it is not fixed either, and reporting
it as pending would understate it: it is a code-level fail today.

**Fix:** add a visually-hidden `<label htmlFor="tools-search">Search
tools</label>` (or `aria-label="Search tools"`) to both inputs. Ten minutes,
no visual change.

### What this branch closes from the 5 August report

Duplicate `<h1>` on the homepage, the DesignKit/Learning heading skips, and
the unlabelled Subscribe/FooterEmailCapture inputs are all gone, not
because this branch fixed them, but because the pages and components that
carried them (`Subscribe.tsx`, the old FooterEmailCapture form) were removed
or rebuilt between 5 August and today, confirmed by their absence from the
current tree and by the render check above.

### Manual checks (named, not run this session)

- [ ] Lighthouse Accessibility, every page template, target 100
- [ ] axe DevTools, every page template
- [ ] VoiceOver, homepage plus one form-bearing page (`/submit`, mailto only
     , or `/tools`/`/radar` for the search input above once labelled)

---

## Gate 2: Performance: FAIL, unaffected by this branch

Nothing in this branch's diff touches `index.html`, fonts, or bundling.
Checked anyway, since a merge gate is not scoped only to the diff:

- **`bun run build`** (clean run, this session): main chunk
  `dist/assets/index-B7zIb6fY.js` **533.16 kB / 171.31 kB gzip**, over the
  500KB warning threshold Vite itself raises and the guide names as a gate
  item, not noise (§4 Gate 2 rule 4). `matter-js`/`HomeGravity` is already
  split into its own 221.59 kB chunk (fixed 31 Aug, per CLAUDE.md), so this
  is real progress on the old ~1MB single bundle, but the remaining chunk
  still fails the threshold. No route-level `React.lazy` exists in
  `src/App.tsx`, every one of the twelve routes still ships in the one
  chunk.
- **Fonts:** `index.html:52-55` preconnects to `fonts.googleapis.com` and
  `fonts.gstatic.com` only. `api.fontshare.com`, the second external font
  origin serving Chillax, has no preconnect. `display=swap` is present on
  both font `<link>` tags. This is the exact "two external font origins"
  drag the guide names by name (§4 Gate 2 rule 2) and it is still half
  unfixed.
- **No dev tooling in production:** confirmed clean. `index.html` has one
  script tag (`/src/main.tsx`, dev-time module entry); the built `dist/`
  output is hashed bundles only, no Babel Standalone, no tweak panel.
- **No PageSpeed/Lighthouse mobile score has ever been recorded for this
  property since the 30 August relaunch.** `reports/` holds no file
  matching Lighthouse, PageSpeed or performance. Per the guide, an
  unrecorded run does not exist, and the last confirmed number anywhere is
  64 from May, against a build that no longer exists.

**Fix (all pre-existing, none blocking this branch specifically):** add the
second preconnect; route-split with `React.lazy`; run and record PSI mobile.

### Manual check

- [ ] PageSpeed Insights mobile on the production URL, target 90+, LCP
      ≤2.5s, CLS ≤0.1, INP ≤200ms, record the score and date in `reports/`.

---

## Gate 3: SEO and AEO: FAIL, this branch's own change is correct

### This branch's change: verified correct

`public/sitemap.xml` had its `/submit` entry removed (build-plan step 6,
ruled 13 Sep). Checked both ways against `src/App.tsx`:

- Sitemap now lists 11 URLs: `/`, `/tools`, `/radar`, `/my-stack`,
  `/ai-news`, `/policy-template`, `/design-kit`, `/learning`,
  `/privacy-policy`, `/terms-of-service`, `/cookie-policy`. Every one is a
  live route in `App.tsx`; none is a redirect (`/whats-new`, `/subscribe`,
  `/stack` correctly absent); `/submit` is the one deliberate omission and
  the route itself still renders (confirmed: its `<h1>Submit a Tool</h1>`
  renders and its own title/description/canonical are intact, so the page
  is not broken, only unindexed, which is what was ruled).
  All URLs use the bare `theeditai.co.uk` host, consistent throughout.
- Live host check (production, since this is infrastructure, not branch
  code): `theeditai.co.uk` → 200; `www.theeditai.co.uk` → **308** to the
  bare host. Permanent, not the temporary 307 the 14 Aug guide panel still
  describes, that panel is stale on this point, confirmed fixed 22 Aug per
  CLAUDE.md and reconfirmed live today. Robots.txt's sitemap pointer and
  every sitemap URL agree on the same bare host.
- Per-route title, description, canonical and OG/Twitter all differ by
  route (checked by rendering all twelve routes and reading the actual head
  tags, not assuming from `SEO.tsx`'s code): confirms the `data-rh` fix
  (31 Aug, pre-existing) still holds and this branch does not disturb it.
- `og-edit-2026-09.png`: confirmed 1200×630 PNG, 40,383 bytes, self-hosted,
  well under 600KB.
- Author: `<meta name="author" content="Jasmin Aziz">` and visible
  "Curated by Jasmin Aziz" in the footer, both present, unaffected.
- No em dashes in any live title, description or the new checks-line
  string. (Em dashes found elsewhere in the tree are all inside code
  comments, not visitor-facing strings.)

### Pre-existing failures, not introduced or fixed by this branch

- **No Organization JSON-LD.** `src/pages/Index.tsx:76-97` carries `WebSite`
  with a nested `Person` author only. The guide requires both Person and
  Organization on the homepage (§4 Gate 3 rule 5, Appendix D). This is
  defect #18 from 14 Aug, still open.
- **`public/robots.txt` is a bare wildcard**, unchanged by this branch:
  `User-agent: *` / `Allow: /`, no named answer-engine bots
  (OAI-SearchBot, Claude-SearchBot, PerplexityBot), no per-property
  training-bot decision (GPTBot, ClaudeBot, Google-Extended). Per the
  guide's August 2026 position, a bare wildcard is an unmade decision, not
  a neutral default.
- **Legal pages ship no title or description.** `src/components/LegalPage.tsx`
  sets a canonical only (fixed 31 Aug, its own comment records this, and
  CLAUDE.md's current text describing "no canonical" for these routes is
  now wrong and should be corrected there, not here). Title and description
  are copy and remain Jasmin's to write; until then, `/privacy-policy`,
  `/terms-of-service` and `/cookie-policy` all report the static homepage
  title to anything reading `document.title`, confirmed by rendering all
  three.
- **No recorded Search Console crawl-report check** since the site
  relaunched 30 August. `reports/` holds nothing under
  `hello@jasminaziz.co.uk` for this property post-relaunch.
- `llms.txt` is absent. Per the guide's August 2026 downgrade this is
  optional hygiene, not a gate item, and is correctly not being chased.

### Manual checks

- [ ] Search Console: verified, sitemap resubmitted (it changed this
      branch), coverage report checked 48–72h later, result recorded, under
      hello@jasminaziz.co.uk
- [ ] opengraph.xyz per page, including the four hub pages and `/tools`
      with a `?job=` deep link

---

## Gate 4: Operations (site-security owns the security half): PENDING

This branch adds no route, API, key or data path (confirmed against the
diff stat: no file under `src/pages/Submit.tsx`, `FooterEmailCapture.tsx`,
or any Supabase integration is touched). Checked the current state anyway,
since a merge gate should say what it found, not only what changed:

- **No serverless functions exist in this repo** (`api/` does not exist),
  so there is no server-side catch path to check for error capture.
- **No live form or enquiry endpoint writes data.** `Submit.tsx` is a
  `mailto:` link (fixed since the 5 August report, which flagged the old
  `handleSubmit` as discarding every submission, that code is gone).
  `FooterEmailCapture.tsx` is now a link to `/policy-template`, not a form.
  There is therefore nothing on the live site today whose silent failure
  would lose Jasmin a lead; the observability gap the 5 August report
  named against those two components no longer applies to them because the
  components no longer do the thing that could fail.
- Nothing found in `reports/` recording an uptime monitor, Vercel
  deployment-failure notifications being switched on, or a confirmed alert
  inbox, for this property since the relaunch.

Gate 4 stays pending rather than passing by default: a site with no
failure signal configured does not pass this gate even where nothing is
currently writable to fail. The security half of Gate 4 (secrets, headers,
RLS, kill switches) is out of scope for this report; `vercel.json` still
ships no headers block at all as of this session, which is site-security's
finding to make formally, not this one's.

### Manual checks

- [ ] Uptime monitor on theeditai.co.uk (free tier sufficient)
- [ ] Vercel deployment-failure notifications switched on
- [ ] Alert destination confirmed as an inbox Jasmin reads

---

## What moved since the guide's 14 August panel

The guide's §7/§8 theeditai.co.uk entries, dated 14 Aug 2026, describe a
site that no longer exists in several material ways, confirmed by this
session's own checks rather than taken on the panel's word:

- The temporary 307 host redirect is now a permanent 308 (fixed 22 Aug).
- The dead `/toolkit` canonical, the `/whats-new` sitemap entry, and the
  homepage-OG-on-every-share problem are all gone (canonicals and OG are
  now per-route, fixed by 31 Aug's `data-rh` correction).
- The five-plus token contrast failures are mostly gone (token corrections
  29 Aug); three specific homepage exceptions remain but are Jasmin's own
  ruling, not an unaddressed failure.
- The Submit-form-discards-everything defect is gone (replaced with a
  mailto link).
- The GA4-without-consent contradiction is gone (GA4 removed entirely,
  28 Aug; the site now sets no cookies).
- New, not on the panel at all: the nav/hub rebuild, the `?job=` deep link,
  and the sitemap's `/submit` removal, all from this branch.

Gate 1 and Gate 3 move from unqualified fail to fail-on-narrower-grounds;
Gate 2 and Gate 4 are essentially unchanged (evidence still missing rather
than code still broken). None of the four gates can be marked passed on
this panel's word, which is exactly why it needs updating rather than
re-read.

---

## Files referenced

- `/Users/jasminaziz/Developer/the-edit-ai-site-map/src/components/Layout.tsx`
- `/Users/jasminaziz/Developer/the-edit-ai-site-map/src/components/CobaltZone.tsx`
- `/Users/jasminaziz/Developer/the-edit-ai-site-map/src/pages/Tools.tsx`
- `/Users/jasminaziz/Developer/the-edit-ai-site-map/src/pages/Radar.tsx`
- `/Users/jasminaziz/Developer/the-edit-ai-site-map/src/pages/Index.tsx`
- `/Users/jasminaziz/Developer/the-edit-ai-site-map/src/pages/Submit.tsx`
- `/Users/jasminaziz/Developer/the-edit-ai-site-map/src/pages/DesignKit.tsx`
- `/Users/jasminaziz/Developer/the-edit-ai-site-map/src/pages/Learning.tsx`
- `/Users/jasminaziz/Developer/the-edit-ai-site-map/src/pages/WhatsNew.tsx`
- `/Users/jasminaziz/Developer/the-edit-ai-site-map/src/pages/MyStack.tsx`
- `/Users/jasminaziz/Developer/the-edit-ai-site-map/src/components/FooterEmailCapture.tsx`
- `/Users/jasminaziz/Developer/the-edit-ai-site-map/src/components/LegalPage.tsx`
- `/Users/jasminaziz/Developer/the-edit-ai-site-map/src/lib/sheets.ts`
- `/Users/jasminaziz/Developer/the-edit-ai-site-map/index.html`
- `/Users/jasminaziz/Developer/the-edit-ai-site-map/vercel.json`
- `/Users/jasminaziz/Developer/the-edit-ai-site-map/public/sitemap.xml`
- `/Users/jasminaziz/Developer/the-edit-ai-site-map/public/robots.txt`
- `/Users/jasminaziz/Developer/the-edit-ai-site-map/public/og-edit-2026-09.png`
- `/Users/jasminaziz/Developer/the-edit-ai-site-map/build-plan.md`
- `/Users/jasminaziz/Developer/the-edit-ai-site-map/reports/site-gates-2026-08-05.md`


---

## Note from the main session, 13 September 2026

Two claims were checked before commit. The "Search tools..." inputs at
`Tools.tsx:227` and `Radar.tsx:257` have a placeholder and no label or
aria-label, as stated; both predate this branch. `LegalPage.tsx` does mount a
Helmet with a canonical, so `.claude/CLAUDE.md`'s line saying the legal pages
ship no canonical has been stale since 31 August; also not from this branch.
Both are put to Jasmin as follow-ups rather than folded into the merge.

The agent took this worktree's two untracked reports for a parallel session's.
They were this session's own and were committed as `d808bbd`. Its staleness
flag in `SCRATCHPAD.md` is committed with this report. Em dashes in the draft
were replaced before commit.
