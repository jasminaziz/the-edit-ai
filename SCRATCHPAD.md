# The Edit AI — Scratchpad

Project: The Edit AI
Live URL: theeditai.co.uk
Repo: github.com/jasminaziz/the-edit-ai
Vercel project: the-edit-ai
Cowork folder: None

---

## Priority queue (as at 2026-08-05)

1. **whats_new automation — fixed 2026-07-11** (separate session, merged into
   this repo 2026-08-05 via rebase, commit 54fce74). Root cause was never the
   PAT: the Routine sandbox proxy strips Authorization headers on
   api.github.com, so curl+PAT dispatch was deterministically broken.
   Verified fix: dispatch via GitHub MCP `actions_run_trigger` instead. Full
   detail in `.claude/CLAUDE.md` Outstanding item 1. Remaining for Jasmin:
   (a) rewrite Routine prompt Step 5 to use the MCP tool, delete the PAT from
   the prompt, (b) revoke PAT 16554137, (c) paste dedupe + shared-secret code
   into the Apps Script, (d) manually delete the duplicate 3/6 Jul batches
   from the Sheet.
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
9. **iOS status bar branding (2026-08-05, deferred)** — `black-translucent`
   shipped then reverted same day after it broke the mobile header (see
   `tasks/lessons.md`). Worth revisiting only alongside proper safe-area CSS
   on the fixed nav in `Layout.tsx` (`viewport-fit=cover` + `padding-top:
   env(safe-area-inset-top)`) and on-device or simulator verification before
   shipping — no full Xcode install on this Mac as at 2026-08-05, so no
   local iOS Simulator testing available until that's set up.

10. **react-helmet-async runtime injection — RESOLVED 2026-08-22 (evening
    session): helmet works on live.** Measured in a real Chrome on
    theeditai.co.uk (builds from main, untouched by the branch), per handover
    B2. Homepage after settle: `link[rel=canonical]` 1 (href
    `https://theeditai.co.uk/`), `[data-rh]` 4 (canonical, description,
    google-site-verification, JSON-LD), JSON-LD 1. `/tools` on a full load:
    canonical 1 (href `https://theeditai.co.uk/toolkit` — the known dead-route
    bug, confirmed live; the fix is already on the branch), `[data-rh]` 2,
    title "AI Toolkit | The Edit". Both numbers non-zero, so B2 closes: the
    dev-server zeros were an instrument artifact and every SEO string placed
    on the branch is live-capable, not inert. B4 (SEO repairs) is unblocked.
    Two new findings from the same measurements are logged as items 12 and 13.

11. **bun.lock resolves react-helmet-async from a Lovable-era registry
    mirror (2026-08-22)** — the lock entry for `react-helmet-async@3.0.0`
    points at `europe-west4-npm.pkg.dev/lovable-core-prod/sandbox-npm-cache`
    rather than the public registry. The package itself is a genuine upstream
    release, so this is not a supply-chain problem. The risk is availability:
    if that mirror stops serving, a clean `bun install --frozen-lockfile`
    fails, including on Vercel. Not urgent. Re-resolve against the public
    registry at some later point.
    **Escalation closed 2026-08-22.** The late-evening session saw 403s from
    the mirror on several packages and flagged that its own sandbox egress
    proxy might be the cause. Reproduced from the Mac on a normal network:
    all four named tarballs serve, `react-helmet-async@3.0.0` (25,690b),
    `gopd@1.2.0` (4,584b), `math-intrinsics@1.1.0` (6,355b) and
    `call-bind-apply-helpers@1.0.2` (6,067b), each HTTP 200 following the
    307 the registry issues. The sandbox proxy was the 403. A cold install
    does **not** fail today, so no lockfile re-resolve is needed before
    relaunch. Item stays as originally filed: an availability risk for
    later, not urgent.

12. **Live site redirects non-www to www (2026-08-22, new finding).**
    Opening `https://theeditai.co.uk/` in Chrome lands on
    `https://www.theeditai.co.uk/`. Every canonical in the code is non-www
    and CLAUDE.md locks the canonical base as non-www, so the injected
    canonicals point at a host the site redirects away from. Almost
    certainly Vercel domain config (www set as primary). Jasmin's decision:
    either flip Vercel so the bare domain is primary (matches the locked
    canonical base, no code change), or relitigate the canonical base
    (currently a locked decision). No session should change canonicals
    before that call.
    **CLOSED 2026-08-22. Vercel flipped, bare domain is primary.** Decision:
    keep the locked non-www base and align reality to it, rather than
    relitigate a www preference nobody chose deliberately. Relitigating would
    have meant touching every canonical, the JSON-LD, the og:url now emitted
    by SEO.tsx, and CLAUDE.md.
    Precondition checked first by Jasmin in Cloud Console
    (jasminaziz1@gmail.com): the production Sheets key's referrer list covers
    both `theeditai.co.uk/*` and `www.theeditai.co.uk/*`. This was
    load-bearing. The key had only ever been exercised on www, because every
    visitor arrived there; had the bare host been absent, flipping would have
    403'd every data fetch and rendered the live directory empty.
    Verified after the flip, independently from the Mac:
    `https://www.theeditai.co.uk/` returns **308** with
    `location: https://theeditai.co.uk/`; `https://theeditai.co.uk/` returns
    **200**, no redirect; and `https://theeditai.co.uk/tools` renders real
    tool data in a browser (names, categories, pricing, IN MY STACK badges,
    no error state), confirming the Sheets API accepted the bare-host
    referer. The live directory never went empty.
    Canonicals, JSON-LD and og:url now point at the host the site actually
    serves. No code change was needed.

13. **Helmet tags may go stale on SPA navigation — CLOSED 2026-08-22, not
    reproduced.** Second measurement, fresh Chrome tab on live, timestamped
    probe snapshots instead of ad hoc reads: on a client-side click from `/`
    to `/tools`, title, canonical and `[data-rh]` all updated to the correct
    per-route values within 250ms and held at 1s, 3s and 8s; a second hop
    `/tools` to `/my-stack` updated within 300ms. Helmet tracks SPA
    navigation correctly on live. The first trial's staleness was an
    instrument artifact (the third false measurement of the day, alongside
    the dev-server helmet zeros and the sandbox mirror 403s). The per-page
    OG tags added in B4(a) inherit this correct behaviour. Nothing to fix.

14. **CLAUDE.md contradicts itself on the DPIA chip colours
    (2026-08-23).** Its design system section documents the locked pairings
    (Green `#2D6A4F` on `#E4F0E9`, Amber `#7A5200` on `#FAF0DB`, Red
    `#A8261C` on `#FBE9E6`) and then states thirty lines later that chip
    colours are not yet assigned and that forest green must not be reused
    without Jasmin's sign-off. Both sit in the operational source of truth,
    so a code session could correctly refuse the locked Green. Also stale in
    the same file: the "Current state" block still says the Sheet awaits its
    G1:M1 headers and that the localhost key does not exist. Both are done.
    Fix in one pass alongside the October timing language, which the roadmap
    already books for merge.

Done since the 2026-06-16 queue: my_stack live (21 rows), design_kit live
(45 rows), nav/footer IA restructure, homepage attribution, font-display swap,
whats_new automation fixed via MCP dispatch (2026-07-11), PWA install
scaffold shipped and live-tested (2026-08-05) — manifest, iOS meta tags,
maskable icon, plus two same-day regression fixes confirmed on device
(status bar reverted to default, html background-color set to stop white
flashes on iOS elastic scroll bounce).

## Blocked

- Conversion layer prompts (Work with me, Subscribe rewrite, Substack link-out):
  drafted, waiting on email confirmation for hello@theeditai.co.uk

---

## Session notes

### 2026-08-24 (afternoon: A3 triage, A4 on the published set, currency correction)

**A3 done.** 67 rows sorted against the locked axis. 20 keeps, 3 public
failure rows (Grok, DeepSeek, Seedance), 8 to My Stack, 36 to the radar.
**23 rows published, not the roughly 40 the roadmap assumed.** A strict read of
the axis lands far short of the ceiling, so the exercise turned out to be what
is missing rather than what to cut. Named gaps: Translation has one row,
ElevenLabs, and DeepL is absent; Appeals and fundraising is thin.

Jasmin's rulings during triage: HubSpot reinstated (it serves Appeals and
fundraising, the thinnest job), Notion AI kept and the Notion platform row cut,
Recraft cut, Grok Imagine cut with Grok staying as the public failure row.
Working file `reports/2026-08-24-a3-triage-decision-list-v2.xlsx`.

**Nothing is deleted.** The hidden-row mechanic and the unused `on_radar`
status already give Jasmin the tool tracker she founded the site to keep, so
A3 is a publishing decision rather than a cull. Open: whether the radar lives
in its own tab or stays in `tools` with blank axis fields. Settle also that the
ceiling of 45 counts published rows, not rows in the Sheet.

**A4 done for every published row.** Sourced values with links in
`reports/2026-08-24-a4-fact-pass-published-rows.md`, which together with the
seed-row file is the audit trail the F2 hard gate requires. Twelve rows pasted
by Jasmin the same afternoon.

**Sheet state at wrap, read directly:** 4 rows complete (the seeds), 12 rows at
five of seven fields, 5 rows at three of seven, 2 rows at two of seven, 67 rows
total. **The only fields missing on those twelve are K and L.** The entire
remaining axis blocker is Jasmin's judgement work.

**Two gaps in the locked axis, both surfaced by real vendors, both needing a
ruling.** `trains_on_input` has no equivalent of `Unclear`, and Submagic and
Blotato publish no position on training at all, so neither row can be completed
honestly. And `None` in `nonprofit_tier` means confirmed absent, while the
common real case is a vendor that publishes no programme and denies nothing:
that affects Granola, Ideogram, Gamma, Grok and Seedance. Same shape as the
DeepSeek `Other` amendment on 23 Aug.

**Currency: a real methodological fault, caught by Jasmin.** The research
agents fetched from a US IP, so several vendors served dollars and "no GBP
published" was recorded as a fact about the vendor. Re-checked through Chrome
on Jasmin's UK connection: Claude (£15 annual, £18 monthly), ChatGPT (Plus
**£20**, not the £16 currently in the Sheet, which came from a third-party
comparison site), Notion (£8.50 and £16.50), Gamma (from £7, against an earlier
finding of no price in any currency) and Wispr Flow (£12) all publish sterling.
ElevenLabs, Descript, Granola and Ideogram genuinely bill in dollars even to a
UK visitor. Perplexity, HubSpot, Submagic and Seedance were not re-checked.
**Policy applied: GBP where the vendor publishes GBP, the published currency
plus a "billed in USD" note where they do not, and nothing converted.** A
converted figure is an unchecked number on a site that promises everything is
checked, and it goes stale silently.

**Buyer widening: assessed, not decided.** A strategy prompt proposed
redefining the buyer by problem shape, any organisation holding sensitive data
and answering to a board, rather than by sector. Assessment given in thread:
the code is sector-neutral apart from `nonprofit_tier` being a completeness
requirement and `Appeals & fundraising` being a data value on every row;
everything else is strings. Jasmin's own conclusion was to widen the
consultancy site rather than The Edit, then to park it and finish the build.
Recorded as open. A related question was raised and left open: whether what she
described is a wider comms consultancy or the AI governance practice arriving
early.

**Operational lessons worth keeping.** The Drive connector is the only Sheet
read path a session has, and it served a stale export once today, so read twice
before reporting a blank cell. Chrome reads run against whichever tab is
focused unless a tab id is passed. Research agents fetching from a US IP
misreport currency and sometimes whether a price exists at all. And sessions
should not run git in this repo: the device shell has no identity and cannot
unlink its own lock files, which left a stale `.git/index.lock` for Jasmin to
clear.

**Next:** C1, the policy template edit. The axis track has nothing left that a
session can do until the verdicts and trustee notes exist, and C3 remains
Gate 2 with nothing started.

### 2026-08-24 (A4 fact pass, then the B3 checklist against real rows)

Two jobs, no code changed, nothing committed by the session.

**A4 for the four seed rows.** Sourced values with links in
`reports/2026-08-24-a4-fact-pass-seed-rows.md`, which is the audit trail the
F2 hard gate requires for every visible row. Both `None` values were wrong:
OpenAI runs a nonprofit programme putting ChatGPT Business at $8 per user
against $20 list, and Microsoft gives 15% off Copilot with Copilot Chat
included free on a Microsoft 365 subscription. Canva and ChatGPT both became
`Varies by tier`, each for a documented reason: Canva does not publish whether
a Nonprofits account is treated as Pro (opt-out live) or Teams (excluded), and
ChatGPT's free, Plus and nonprofit Business tiers give opposite training
answers with no single tier a charity obviously lands on. DeepSeek moved from
`Yes` to `Yes unless you opt out` because an opt-out toggle exists. Jasmin
placed all twelve cells by hand. `last_checked` now reads 24 Aug 2026 on all
four, which is the first date the stamp is true.

**B3 re-run checklist, against real Sheet rows in a real browser.** Nine of
ten pass. Item 8's first half is the only one outstanding and it is not a
defect: proving the template card sits after the sixth card needs seven
complete rows, and there are four. Its second half, vanishing under any active
filter, passes.

Passing: grid renders the four complete rows and Descript stays hidden; the
homepage counter reads 4 against four cards; all three chips render the locked
hex values exactly, text and 1px border matching; contains-matching returns
multi-job and single-job tools together; **both `Varies by tier` rows fail the
training toggle**, which is the rule the predicates were extracted to protect;
the nonprofit toggle excludes the `None` row; the template line fires under
Amber and Red and never under Green; the empty state renders the approved
string verbatim with no Back to Home; and three of the four
`Get the template →` labels are identical and point at `/policy-template`.

Two caveats on method, both honest limits rather than findings. The chip hover
condition was verified structurally, not with a real pointer: the chip colours
are inline styles and no hover rule in any stylesheet targets them, so a
hovered card cannot recolour them. And the fourth `Get the template →` label
lives in the mobile nav, which only renders with the menu open at a narrow
width; three of four confirmed.

**F2c does not reproduce at full desktop width.** At a 1470px viewport the
rail lays out on one line, all seven chips visible, `Translation` ending at
1345px inside a rail box ending at 1375px. Nothing clips and nothing wraps.
The wrap and clip seen on 23 August was a narrow-window artifact. The margin
is 30px, so a 1280 or 1366 laptop will very likely clip; that needs one
measurement at a narrower width before F2c can be closed rather than
downgraded.

**F2a confirmed, and larger than logged.** The homepage hero names eighteen
tools. Three of them are in the directory. The other fifteen sit directly
above the line reading 4 tools that passed the checks, and the What I'm
running strip names Lovable, Vercel, GitHub and Claude Code, all four of which
A3 removes from the directory entirely. Still Jasmin's positioning call, now
with numbers on it.

**Instrument note.** Page reads through the Chrome bridge run against
whichever tab is focused unless a tab id is passed, which produced one round
of nonsense results mid-session. Every check above was re-run pinned to the
tools tab from a clean filter reset. Pass a tab id.

**Outstanding for Jasmin:** the trustee-note drafting rule; whether Copilot
stays Green given Bing web grounding sits outside the DPA and the EU Data
Boundary by default with an admin switch to disable it; DeepSeek's note now
that the Italy ban, the Berlin DSA report and the ICO letter are on file; and
the three over-long notes, which are verdicts sitting in the wrong column.

### 2026-08-23 (late — Cowork state check, no code changed)

Verification only. Nothing in `src/` touched, nothing committed to code.
Branch confirmed as `overhaul/sector-axis` at `e6b3d27`, in sync with origin,
tree clean apart from two untracked files (`.claude/settings.local.json`,
`reports/2026-08-23-next-thread-handover-prompt.md`). `main` still `47a0d1e`.

**The Sheet, read rather than trusted.** The `tools` tab carries the G1:M1
headers, so A2 is done and its section 5 status was stale. **No seed rows
exist: G through M are empty on every row.** Every row emits all thirteen
cells in the export, so this is a positive read of emptiness rather than an
export dropping trailing blanks. The directory correctly renders nothing and
the counter correctly reads 0.

**Row count is 67, not 66.** Two reads now agree, but both came from the
Drive connector, so it is one instrument twice. Confirm by eye during A3.

Instrument note: `sheets.googleapis.com` is blocked from both the cloud
sandbox and the device shell, so the localhost key cannot be exercised from
a session at all. The Drive connector is the only Sheet read path a session
currently has. Worth knowing before anyone plans a verification around it.

**Three stale lines found in the docs.** Section 5 showed A2 as not started
and E1 as not started; both corrected in the handover, E1 confirmed
flag-only. `.claude/CLAUDE.md` still says chip colours are not yet assigned
and forest green must not be reused without sign-off, roughly thirty lines
below the locked pairings the same file now documents. A code session obeying
the source of truth would refuse the locked Green chip. Logged as queue item
14.

**Decision taken, logged in handover section 4: no second, general,
rebranded directory.** Asked and answered 23 Aug. The developer rows A3
removes move to My Stack, so there is nothing to rescue; a general directory
has no axis and therefore no moat; generality needs a row count one person
cannot keep checked; and a mainstream audience is traffic the consultancy
cannot sell to. The cost is the standing maintenance load, not the build. A
broader impulse belongs in D2 and D3, not in a second product.

**Next, unchanged:** the seed rows (Canva, ChatGPT, Microsoft Copilot and
DeepSeek complete, Descript deliberately blank across G to M), then the B3
re-run checklist against real rows in a real browser, capturing F2a and F2c
for Jasmin in the same pass. Seed row mechanics, including the Sheets
date-coercion trap on column M, were written out in the Cowork thread.

### 2026-08-23 (B3: ToolCard and filters — branch overhaul/sector-axis)

**Branch: overhaul/sector-axis.** Eight commits, `54e8a6a` through `aabc6f2`,
one job each. `bunx tsc --noEmit` clean and `bun test` green before every
commit. Suite 24 to 56 (32 new tests). Nothing merged to main.

Built, in the order Jasmin set:

1. `54e8a6a` — `isComplete()` in `sheets.ts`, plus `normaliseDpiaFlag()` and the
   three toggle predicates `hasNonprofitPricing`, `doesNotTrainOnInput`,
   `isDpiaGreen`. All exported and tested.
2. `d06041b` — the directory renders complete rows only, filtered once at the
   fetch site so grid, search and shared-stack all work off the same list.
3. `457d9c9` — the homepage counter uses the same predicate. Caption untouched.
4. `c9ab5d0` — the seven axis fields on the ToolCard.
5. `108b9f4` — `CATEGORIES` becomes the six comms jobs, contains-matching.
6. `b7f7180` — the three sector toggles, plus the approved filter empty state.
7. `f1da4a2` — the two C4 strings placed.
8. `aabc6f2` — stale allowed-value comments corrected.

**Two decisions taken during the session, both Jasmin's:**

- `dpia_flag` must match Green / Amber / Red canonically (case-insensitive,
  trimmed) for a row to count as complete. It is the only field driving a
  visual with no fallback, so `Amberish` would otherwise have left a complete,
  visible row rendering a chip with no label. The same normalisation feeds the
  chip lookup, so a lower-case Sheet value still resolves. `isDpiaGreen` is
  named for the data value, not the chip label: **do not rename it to match
  the microcopy.**
- The in-grid CTA renders `Get the template →`, with the arrow, though the
  addendum banks it without one. The arrow is the affordance the nav and footer
  already carry and CLAUDE.md requires a visitor to see identical labels.
  Recorded in the commit message so a later reader does not "correct" it back.

**Status: BUILT, NOT FINALLY VERIFIED.** No row in the Sheet passes the
predicate yet, so the directory renders empty and the counter reads 0 — both
correct behaviour. Every browser check therefore ran against a throwaway
browser-side fixture, not real data. The ten-point re-run checklist lives in
the B3 row of section 5 of the handover. **F2 cannot be signed off until it has
been repeated against real Sheet rows.**

**Confirmed, correcting the handover:** the localhost Sheets key works. Real
tool names rendered from the live Sheet on the homepage hero. B1 is done.

**Next step:** Jasmin adds the four seed rows (Canva, ChatGPT, Microsoft
Copilot, DeepSeek) plus the deliberately blank Descript keeper, then a session
runs the B3 checklist against them. After that: A3 triage, A4 fact research,
the A5 and A6 judgement sprint, the C1 to C3 capture track, then F2.

**Three items raised for the relaunch check, all needing Jasmin not code:**
F2a homepage hero pills (positioning question, logged 23 Aug), F2b shared-stack
links dropping incomplete tools (confirmed correct behaviour, logged so it is
not read as a regression), and **F2c, new: filter rail overflow** — the six job
labels are far longer than the six tool types they replace, so the rail wraps
to two lines on desktop and clips its last chip when scrolled. Pre-existing
treatment, made prominent by the longer labels. Wanted before the merge, not
after, because the six jobs are the taxonomy the re-point is expressed in.

**F2 gained a floor:** the merge does not proceed with fewer than ten complete
rows in the grid. "Every visible row has its axis fields" was vacuously true
with nothing visible, so an empty directory would have passed the gate.

### 2026-08-23 (Cowork sitting: A1, the axis is locked)

No code changed. The evaluation axis is frozen and the spec is
`reports/2026-08-23-axis-locked.md`, which now supersedes audit section 3 on
every allowed value and definition. Twelve rulings were put to Jasmin as
committed recommendations and all twelve were adopted.

Three had real consequence. `Your tenant` joins `data_location` as a sixth
allowed value, because the audit's own Copilot example produced a value the
set could not hold and tenant-resident tools are the proof case for the
re-point. `dpia_flag` holds one value per row and never a compound, judged on
typical comms use, taking the cautious side on boundaries, with conditionals
pushed into the verdict or trustee note; the chip, the template line and the
green toggle all need a single value. And the Green chip reuses forest green
`#2D6A4F` with Jasmin's explicit sign-off, despite it also being the IN MY
STACK badge colour, because a solid badge and a tinted labelled chip read
differently and a second near-identical green would be palette drift.

Chip colours settled and AA-verified against both the white card and cream
ground: Green `#2D6A4F` on `#E4F0E9` (5.46:1), Amber `#7A5200` on `#FAF0DB`
(6.11:1), Red `#A8261C` on `#FBE9E6` (6.05:1). Burnt orange `#E8572A` was
ruled out on measurement, not taste: 3.60:1 on white, fails AA.

The nine mechanical rulings: six job names stand, soft cap of three jobs per
tool, `Varies by tier` reserved for genuinely ambiguous buying tiers,
`nonprofit_tier` one line of roughly 60 characters, trustee notes stored bare
and first person plural, `last_checked` in DD MMM YYYY matching `whats_new`,
and fixed pass rules for all three toggles.

**Two findings that were not on anyone's list.**

1. **B3 needs microcopy that does not exist.** Roughly twelve visitor-facing
   strings: three DPIA chip labels, five card field labels, three toggle
   labels, the filter empty state. The copy pack and its addendum hold none
   of them, and code sessions never author copy. This blocks B3 alongside the
   seed rows and needs a short Cowork authoring sitting.

2. **The counter and the grid should share one predicate.** B3 hides
   incomplete rows; the counter currently reads non-empty `last_checked`
   (`f514b0a`). A row could carry a date and still be missing its trustee
   note, so the counter would count a row the grid refuses to show. The
   locked spec defines completeness once, for both.

Measurement note: the cloud sandbox could not read the Sheet to verify
whether the G1:M1 headers exist. `sheets.googleapis.com` returns a 403 on
CONNECT through the egress proxy. Instrument, not site, and consistent with
the sandbox 403s already logged in queue item 11. Not chased.

Also committed this session: the pre-October roadmap and the A1 decision
sheet, both of which had been sitting untracked on disk since they were
written.

**Amendment, same evening.** Seeding surfaced that the `data_location` set
could not describe DeepSeek: its data sits in China, and calling a known
jurisdiction `Unclear` would be a lie. `Other` added as a seventh value,
defined as a jurisdiction outside the UK, EU and US, named in the verdict.
The judged-not-recommended rows are exactly the ones the original six values
could not hold, which is why it surfaced on the fourth seed rather than the
first three.

**Second finding, logged as a hard gate on F2.** Seed rows carry provisional
fact values from the audit's worked examples and a `last_checked` stamp,
which makes them complete, so the grid shows them and the counter counts
them. Before merge every visible row must have been through A4 with sources
or be blanked back to hidden. Without that gate the homepage claims rows
passed checks that never happened, which is F1 returning through a side door.

**Headers verified in the Sheet, 23 Aug.** Row 1 of `tools` reads name,
category, status, cost, verdict, url, jobs, data_location, trains_on_input,
nonprofit_tier, dpia_flag, trustee_note, last_checked. A2 done. Read through
the Drive connector, which also parsed 67 tool rows rather than the 66 the
handover records; the connector is flaky enough that this is a glance-at-it
during triage, not a fact.

**Next:** A2 headers and seed rows (Jasmin, ~20 min in the Sheet), then the
microcopy sitting, then B3 is clear to run.

### 2026-08-22 (night — copy authoring: C4 and B4b strings, B6 decided)

Cowork session, no code changed. Six visitor-facing strings authored with
Cowork Claude and approved by Jasmin as exact strings, banked in
`reports/2026-08-22-copy-pack-addendum.md`: the C4 pair (in-grid template
card heading/body/CTA, and the line under Amber/Red DPIA flags) for the
B3 session, and the B4(b) pair (`/submit` and `/stack` title +
description) ready for a small placement session. The C4a CTA label is
"Get the template", identical to the nav and footer per CLAUDE.md.

B6 decided in the same sitting: keep the Submit page, swap the form for
an email link to `hello@jasminaziz.co.uk` (the hello@theeditai.co.uk
address is still unconfirmed, see Blocked). No new infrastructure. Spec
in the addendum; follow the FooterEmailCapture link-block pattern. That
answers handover open question 4 — the only section 7 questions left are
the template brand (C2) and the Substack pair (D2/D3).

Next code session: place the B4(b) metas and implement the B6 swap, two
commits, one job each.

### 2026-08-22 (late evening — B4a: per-page OG in SEO.tsx)

Same Cowork session as the B2 verification below, continued into the B4
mechanical half. One job: `SEO.tsx` now also emits `og:title`,
`og:description`, `og:url`, `twitter:title` and `twitter:description`,
every value derived from the existing `title`/`description`/`canonical`
props the seven pages already pass. No new copy authored anywhere. Not
touched: `index.html` (its static OG block stays as the sitewide fallback
for non-JS scrapers, which is most of them), every page file, `main.tsx`,
`package.json`, `bun.lock`. No per-page `og:image` or `og:type` — the
statics own those until B5 delivers the new artwork.

New test file `src/test/seo.test.tsx`: 5 tests through Helmet's SSR
context (`HelmetProvider.canUseDOM = false`, the documented test hook,
since jsdom otherwise sends Helmet down the async browser path). Asserts
the og/twitter emission, the og:image/og:type absence, and the existing
title/description/canonical behaviour.

**Verification caveat.** Her machine's `node_modules` has macOS natives and
the device VM is Linux, so the suite ran in the Cowork cloud sandbox from a
source snapshot with a FRESH public-registry resolve, not `bun.lock`:
`tsc --noEmit` clean, 24/24 tests pass (19 existing + 5 new). Jasmin should
run `bunx tsc --noEmit && bun test` on the Mac as the canonical check
before committing. Snapshot tarball left at
`_to_delete/verify-snapshot-2026-08-22.tgz` (sessions can't delete files);
bin the folder.

**Queue item 11 escalation, same session:** `bun install --frozen-lockfile`
in the sandbox got HTTP 403 from the Lovable mirror on MULTIPLE packages
(gopd, math-intrinsics, call-bind-apply-helpers, and it stopped there), not
just react-helmet-async. Caveat: the sandbox egress proxy may itself be the
403, so reproduce from a neutral network before panicking. If it 403s from
the Mac too, a cold install fails today, including any cold Vercel build,
and item 11 stops being "not urgent".

Working tree at wrap (branch `overhaul/sector-axis`, nothing committed by
the session): modified `SEO.tsx`, `SCRATCHPAD.md`, handover report; new
`src/test/seo.test.tsx`. Commit is Jasmin's call.
**Since committed** (later session, same day): `SEO.tsx` and its test as
`869dc5f`, docs as `be6d3bc`. The Mac check the session asked for was run
first against `bun.lock`: `tsc --noEmit` clean, 24/24 pass.

**Remaining in B4:** the `/submit` and `/stack` meta half, blocked on **four**
approved strings from Jasmin: a title and a description for each of the two
pages. (An earlier note here said two, which contradicted its own
parenthetical; corrected 2026-08-22.) Counting the two C4 CTA strings the
ToolCard session needs, **six strings in total** are waiting on Jasmin before
B3 and B4b can run. The new-thread prompt states the same six; use it as
written.

### 2026-08-22 (evening — B2 verification, no code changed)

Verification only. No checkout, no file in `src/` touched, nothing
committed. Ran handover task B2 against the live site in a real Chrome via
the desktop bridge (Cowork session; the cloud sandbox cannot reach
theeditai.co.uk, and Chrome needed "Allow JavaScript from Apple Events"
enabled first).

- **B2 closed: react-helmet-async injects on live.** Homepage canonical
  count 1, second route canonical count 1. Full numbers in queue item 10,
  now marked resolved. The placed SEO strings on the branch are not inert.
- `/tools` canonical → `/toolkit` confirmed live on main, exactly as queue
  item 8 recorded. The branch fix is correct and waiting on the merge.
- Two new findings logged: the non-www to www redirect against non-www
  canonicals (item 12, needs Jasmin's Vercel decision) and possible helmet
  staleness on SPA navigation (item 13, one trial, unverified).
- Handover updated: B2 status, open question 1 answered, B4 unblocked with
  a note that `/submit` and `/stack` meta strings must come from Jasmin
  before that half of B4 can be placed.

**Next step:** B4's mechanical half (per-page OG in `SEO.tsx` reusing the
approved placed titles and descriptions) can start any time. The `/submit`
and `/stack` meta half waits on Jasmin's strings. B3 still waits on B1,
A4 rows and C4 strings.

### 2026-08-22 (placement session — branch overhaul/sector-axis)

**Branch: overhaul/sector-axis.** Nothing merged to main. The live site is
unchanged. Ten commits, pushed to the branch remote only. No PR opened.
An eleventh follow-up commit points the desktop and mobile nav straight at
`/policy-template` and relabels it "Get the template", since "Get the
digest" no longer described where it went. The `/subscribe` redirect stays
in place for old and external links.

Second session of the day. Purpose was placement, not authorship: every
visitor-facing string came in pre-approved and was placed verbatim.

**Preflight (three commits).** The tree was dirty at the start, so it was
cleaned before any placement work.
- `README.md` rewritten against the sector positioning and the bun rules. The
  old one still carried the Lovable boilerplate and, worse, instructed
  `npm install` — the one command this repo must never run, since it resolves
  against and rewrites the stale `package-lock.json`. It now documents bun,
  port 8080, the four env var names, and the referrer-restricted production
  Sheets key.
- `.superpowers/` added to `.gitignore` (local brainstorming mockups).
- The four 22 Aug report artefacts committed as produced. They were untracked
  despite `.claude/CLAUDE.md` already pointing at the audit HTML.

**`.claude/CLAUDE.md` replaced** with the approved rewrite from
`reports/2026-08-22-claude-md-rewrite-draft.md` (left in place, unmodified),
DRAFT blockquote removed and twelve amendments applied. Two are load-bearing:
- The audit no longer outranks CLAUDE.md on implementation detail. The audit
  is canonical on strategy only; it predates this branch and is stale in three
  places (five axis fields not seven, G-L not G-M, and a fixed-position A-F
  fetcher that has been retired). Where they conflict on implementation,
  CLAUDE.md wins.
- The canonical base is **non-www**. Every canonical in the code is non-www.
  The Sheets API referer header is the only www exception.

**`.claude/schema.md` corrected.** The tools tab note said column layout is
fixed-position and read by index. True of main, false of this branch, where
`parseToolRows()` matches normalised headers. Now says so, with the warning
that main stays positional until the merge.

**Copy placed.** Homepage (`Index.tsx` SEO, JSON-LD, intro paragraph, counter
block), `index.html` (title, description, og and twitter title/description),
the PWA manifest in `vite.config.ts`, and the tools page. New `AboutPanel.tsx`
on the homepage between the intro and the dashboard strip: presentational
only, no props, no state, no fetching, `h2` at 28px so the page gains no third
`h1`.

**`/tools` canonical bug fixed.** It pointed at `https://theeditai.co.uk/toolkit`,
a route that does not exist, so every crawl of `/tools` was told the real page
lived somewhere dead. The site's own SEO guide had already documented this
exact trap once before. Now `/tools`. Zero `toolkit` references remain in the
codebase.

**Supabase capture killed.** Both write points are gone and no file in `src/`
imports the Supabase client or calls `.insert()`.
- `FooterEmailCapture.tsx` is now a link block, not a form. Keeps its
  container, border, padding, 480px column and heading typography.
- `Subscribe.tsx` had a load-bearing bug: it opened with
  `if (!SUPABASE_URL || !SUPABASE_KEY) return null;` **above the hero**, so any
  environment missing those vars rendered the whole page as nothing. Removed
  with the form.
- `links.ts` gains `SUBSTACK_SUBSCRIBE_URL` and corrects `LINKEDIN_URL`, which
  pointed at a dead profile slug.

**`/policy-template` added** as the gated destination, mirroring the Subscribe
layout with no new colours or components. **`/subscribe` now redirects to it**
(`Navigate ... replace`, following the existing `/whats-new` to `/ai-news`
pattern), so **`src/pages/Subscribe.tsx` is dead on disk**: still present,
unimported, unreachable. It joins the dead-code sweep in queue item 7. It was
deliberately not deleted. `Layout.tsx` is untouched; the nav still links to
`/subscribe` and the redirect handles it.

**Verified:** `bunx tsc --noEmit` clean, `bun test` 19 pass / 0 fail
throughout. All routes checked on the dev server at port 8080 (data 403s
everywhere, expected, no localhost-scoped key yet).

**Two new queue items added (10 and 11)** covering the possible
react-helmet-async runtime problem and the `bun.lock` registry mirror. Item 10
is explicitly unverified and names the live-site check as the first step.

**FLAG for the relaunch check — the counter now lies.** The homepage counter
reads "Passed the checks" over "tools that passed the checks", but it still
renders `tools.length`, and the Sheet still holds 66 untriaged rows with
columns G-M empty. Nothing has passed any check yet. The copy only becomes
true after the October triage. **If triage slips, this must not reach main.**
Either the triage lands or the caption reverts.

**RESOLVED 2026-08-22 (night), commit `f514b0a`.** Fixed the number, not the
words, so the approved caption is untouched and no copy was authored. The
counter now renders `tools.filter(t => t.last_checked.trim() !== "").length`
instead of `tools.length`. `last_checked` is stamped when a row's fact fields
are verified, so it is the marker for a row that has been through the checks.
Reads 0 while columns G-M are empty and rises on its own as the October
triage fills them, so no code change is needed at triage. It also fails safe:
if triage slips the homepage shows 0 rather than a false 66. Known
imprecision: `last_checked` marks a row as checked, not as passed, so a
deliberate "judged, not recommended" row would be counted. No field
distinguishes them today; the overcount is bounded and far smaller than
counting every untriaged row. **No longer a merge blocker.**

**Still open, explicitly not this session:** per-page OG in `SEO.tsx` (it emits
no OG or Twitter tags at all today, so social cards fall back to the static
`index.html` block sitewide), `/submit` and `/stack` meta, new `og-image.png`
artwork for the re-point, the ToolCard and filters session (DPIA chip, jobs
chips with contains-matching, three sector toggles, `last_checked` display),
and the October content week.

**Next step (updated 2026-08-22, night):** B3, the ToolCard and filters
session. It is unblocked: the two C4 CTA strings it needs are approved and
sit in `reports/2026-08-22-copy-pack-addendum.md` (the in-grid template card
after the first six tools, and the line under every Amber or Red DPIA flag).

**B4 is fully closed.** (a) per-page OG in `SEO.tsx` as `869dc5f`; (b) meta
for `/submit` and `/stack` as `6b7b221`, all four approved strings placed
verbatim. Stack.tsx bypasses the Layout chrome so its placement was verified
in-browser rather than assumed; the app-level `HelmetProvider` covers it.

**B6 is implemented** as `e3e1add`: the Submit form, which discarded every
submission, is now a mailto link to hello@jasminaziz.co.uk. No new
visitor-facing copy was needed or authored, because the CobaltZone heading
and subheading already carry the invitation. The form's dead code is left in
place for the queue item 7 sweep.

Queue items 10, 11, 12 and 13 are all closed.

**Earlier next-step note, still true for the branch itself:** the ToolCard
and filters session is the next code work. Nothing else on the branch
needs doing first. The three pre-October actions from the previous session
still stand (localhost API key on port 8080, Sheet headers G-M, row triage),
and the localhost key is the one that unblocks real local verification: every
route in this session was checked against 403ing data.

### 2026-08-22 (overhaul data layer — branch overhaul/sector-axis)

**Branch: overhaul/sector-axis** — all work is on this branch. Nothing has
merged to main. The live site is unchanged. Next code session MUST start with
`git checkout overhaul/sector-axis`, not main.

Context: an overhaul audit (reports/2026-08-22-overhaul-audit.html, prepared
same day) diagnoses the site's current positioning as incoherent and lays out
a full re-point to charities, cultural organisations and heritage. The audit
supersedes the "never charity-sector framing" rule in CLAUDE.md (that rule is
live and will fight future build sessions until CLAUDE.md is rewritten —
audit action list item 4, scheduled for October admin week).

Built and verified this session:
- `Tool` interface extended with seven sector-axis fields: `jobs` (typed as
  `string[]`), `data_location`, `trains_on_input`, `nonprofit_tier`,
  `dpia_flag`, `trustee_note`, `last_checked`. All default to `[]` / `''`
  when absent — safe before the Sheet is updated.
- `fetchTools()` rebuilt to use header-name lookup (matching the pattern of
  `fetchMyStack` and `fetchDesignKit`) via a new exported `parseToolRows()`
  function. Fixed-index column reading retired. "cost" accepted as alias for
  "pricing" (the Sheet header is "cost").
- `parseToolRows()` extracted and exported so it can be tested without mocking
  fetch or import.meta.env.
- 19 vitest tests written and passing (`src/test/sheets.test.ts`): full
  columns, absent columns, jobs splitting on `,` `·` `•`, whitespace trim,
  emoji strip on text fields, url not stripped, status fallback, empty-name
  row skipped.
- `bun test`: 19 pass, 0 fail. `bunx tsc --noEmit`: clean.
- `.claude/schema.md` updated to document new column layout (G–M), the
  fixed-position constraint (now retired), and allowed values per field.
- Branch pushed to remote:
  github.com/jasminaziz/the-edit-ai/tree/overhaul/sector-axis

Three outstanding actions before code session one (October):
1. **Localhost API key** — create a new Google Sheets API key in Cloud
   Console (`jasminaziz1@gmail.com`), restrict to Sheets API and referrer
   `http://localhost:8080/*` (this project's dev port — confirmed in
   vite.config.ts), and replace `VITE_GOOGLE_SHEETS_API_KEY` in `.env.local`
   with it. Until then local data loads fail with 403.
2. **Add header columns to the Sheet** — append `jobs`, `data_location`,
   `trains_on_input`, `nonprofit_tier`, `dpia_flag`, `trustee_note`,
   `last_checked` as column headers G–M in the tools tab. The fetcher is
   already reading them; the Sheet just needs the headers.
3. **October triage and research pass** — row triage (keep/cut/judged-not-
   recommended per audit section 4), then fill sector fields for the top 10
   rows with verified sources before code session one (ToolCard, filters,
   DPIA chip).

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
  `apple-mobile-web-app-status-bar-style`, and `apple-mobile-web-app-title`
  ("The Edit"). Existing favicon/apple-touch-icon links untouched.
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
- **Live regression found and fixed same day**: shipped with
  `status-bar-style: black-translucent` (site-design-check's suggestion to
  brand the one native iOS chrome element). Jasmin reported the header
  visually detaching from the top of the screen on scroll in the installed
  home-screen app. Root cause: the fixed nav in `Layout.tsx` has no
  `safe-area-inset-top` handling and the viewport meta has no
  `viewport-fit=cover`, so content draws under the status bar in standalone
  mode. Reverted to `default` (see `tasks/lessons.md`) rather than build out
  safe-area CSS — that's real component work, out of scaffold scope, and
  unverifiable locally (no full Xcode install on this Mac, so no simulator
  testing). Branding the status bar is a real v2 idea if the safe-area work
  gets done properly and tested on-device first.
- **Second related regression, same report**: Jasmin also saw white flashes
  (against the brand cream/cobalt) on horizontal scroll bounce, "didn't feel
  fixed on the screen". Root cause: `<html>` had no background-color set —
  only `<body>` did (`bg-background`). iOS Safari's elastic overscroll
  reveals the `<html>` background in the bounce region, not `<body>`'s, so
  it defaulted to white. Fix: added `@apply bg-background` to the `html`
  selector in `src/index.css`. This is a page-wide fix (not PWA/iOS-specific
  code), so it also corrects the same white-flash bounce in a normal mobile
  Safari tab, not just the installed app.

### 2026-08-11 (mobile header detach — actual root cause found and fixed)

Continuation of 2026-08-05's saga. After the status-bar and html-background
fixes, Jasmin reported the header was still detaching on scroll. A third
attempt (GPU compositing hint — `transform: translateZ(0)` on the nav) also
didn't fix it. Stopped guessing narrower CSS patches and researched current
sources instead: this is a well-documented WebKit bug where `position:
fixed` elements move *with* the document during iOS rubber-band bounce, and
`overscroll-behavior: none` (the usual fix) doesn't work inside WKWebView
(what installed PWAs run on). Full writeup in `tasks/lessons.md`.

Real fix: locked `<body>`/`<html>` from scrolling at all (scoped to
`Layout.tsx`'s own wrapper — `/stack` bypasses `Layout` and was left on
normal document scroll), moved scrolling to a new inner `#app-scroll` div.
Nav no longer needs `position: fixed` at all. Migrated 4 window-scroll
dependents (`Layout.tsx`, `DragHint.tsx`, `StackBar.tsx`, `Tools.tsx`) to
track `#app-scroll` instead, each with a `window` fallback. Verified on
desktop via the dev preview (created `.claude/launch.json`, didn't exist
before): `document.body.scrollHeight` now exactly equals
`window.innerHeight` (zero document-level scroll), nav stays pinned through
a programmatic scroll, StackBar's footer-offset tracking still works.
Commits `c377653` (fix) and `ce39fd5` (launch.json). Still can't verify the
actual iOS bounce behaviour without a device — no full Xcode install on
this Mac, still queue item 9's blocker. **Needs Jasmin's on-device
confirmation before this can be marked closed.**

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
