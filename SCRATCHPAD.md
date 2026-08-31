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
2. ~~Create the localhost-scoped Google Sheets API key and put it in
   .env.local~~ **DONE.** Confirmed working 2026-08-26: the dev server loads
   real Sheet data at localhost:8080, and the key reads the API directly from
   curl with an `http://localhost:8080/` referer.
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

## Found 2026-08-26, not in that session's scope — Jasmin's call

- ~~**`public/sitemap.xml` is materially stale.**~~ **CLOSED 2026-08-28,
  commit `c01a413`.** Rewritten to eleven bare-domain URLs, live routes only,
  each cross-checked against `App.tsx` in both directions. The original
  finding follows, kept for the record. All seven URLs used `www.`,
  which 308s to the bare domain, so every entry points at a host the site
  redirects away from (the bare host became primary on 2026-08-22). It lists
  `/whats-new` and `/subscribe`, both now redirects, and omits `/ai-news`,
  `/policy-template`, `/submit` and the three legal pages. `/stack` was never
  listed, so the 26 Aug cut did not make it worse. Wants owning before the
  October merge, since it is the file search engines are pointed at by
  robots.txt.
- **One visitor-facing em dash survives on the branch**, against the locked
  voice rule: `WhatsNew.tsx`, "Show more — {hiddenCount} remaining". Handover
  B8's "all three visitor-facing em dashes" were the three inside the stack
  files; this is a fourth and pre-existing.
- **Minor, for the record:** B8 says "About 950 lines, three files" while
  naming four files. Four were deleted and the diff was 1,128 lines.

## Blocked

- Conversion layer prompts (Work with me, Subscribe rewrite, Substack link-out):
  drafted, waiting on email confirmation for hello@theeditai.co.uk

---

## Session notes

### 2026-08-31 (code session: palette cleanup finished, homepage columns, byline focus)

Five commits, all on `overhaul/sector-axis` and fast-forwarded to `main`, all
live on production. Local `main` was 124 commits behind at `47a0d1e` and is now
at `00c20e0`. It was updated with `git fetch origin main:main`, not a checkout:
switching to `main` is still blocked by the parallel session's uncommitted
report edits, and a ref update never touches the working tree.

**Hero pills closed** (`319a43c`, `a48b2a8`). The 30 Aug periwinkle entry below
records the pills as "not touched", still carrying `#4A4A9A` and burnt orange
`#E8572A`. Both are now gone. The pills rotate cobalt, forest and ink, with lime
as a roughly 1-in-8 accent. Burnt orange failed twice over: as a badge it
carried white at 3.60:1, and against the lightened `#9B9EDE` hero it sat at
1.42:1, close enough to the ground that it separated on hue alone. Indigo
`#4A4A9A` had no contrast defect and was simply a colour the site never owned.
`a48b2a8` corrected the palette *record*, which claimed burnt orange rendered
nowhere while it was in fact colouring news category badges and hero pills, and
scoped forest green to the In My Stack badge when it also carries the Green DPIA
chip, the DesignKit `free` badge and one of the pills.

**The cobalt hover is settled on ink `#1A1510`** (`0213f66`). Three improvised
hovers had grown up instead: `#1A22A8` on `/learning` and `/submit`, ink on
`/policy-template` and in the news card toggle, and a lime swap on the ToolCard.
Ink won because it was already the majority and is locked, so nothing new
entered the palette; white on it is 18.12:1 against 11.42:1 for `#1A22A8`.
**This left zero off-palette hex in any rendering path**, verified per hex:
every remaining non-palette value in `src/` sits inside a comment or in the
unreachable `Subscribe.tsx`. If a grep turns one up in a rendering path from
here, it is new and it is a regression.

**Homepage columns and header** (`3e599b8`). The 176px gap between the two
AboutPanel columns was arithmetic, not taste: at the 1280 cap the column unit is
48px, and `col-span-5` plus `col-start-7` skips column 6 entirely, so the gap was
48 + 64 + 64. Widening the left column to `col-span-6` collapses it to a single
64px gutter **without moving the right column at all**, so the paragraph's line
breaks do not change by a character. The wider column is what paid for the
clamp, 46px to 56px. Measured at 1440 / 1280 / 1024 / 375: three lines
throughout with "This helps." on its own, no horizontal scroll. The 30px floor
binds below an 804px viewport, so the phone is untouched, which is the usual way
oversized display type breaks. **Do not push past 56px**: the fourth line starts
at roughly 59px in a 608px column, so there is about 5% of margin.

**Byline keyboard focus** (`00c20e0`). The lime underline was applied by
`onMouseEnter` and removed by `onMouseLeave`, so it existed for the mouse and
not for the keyboard: the only outbound link on the homepage gave no indication
when a reader tabbed to it. Hover and `:focus-visible` are now one rule in
`index.css` under `.about-byline`. The inline `textDecoration` had to go with
the handlers, because an inline declaration outranks the stylesheet and would
have beaten the hover rule, which is exactly what the handlers were working
around. The lime stays decoration rather than the focus indicator: it is roughly
1.4:1 on cream, so it sits on top of the browser's own focus ring, which nothing
outside shadcn's `ui/` components overrides, and on ink link text that carries
the meaning by itself.

**Unchanged tonight, still hers:** the thirteen parallel-session reports in
`reports/` (three modified, ten untracked) are still uncommitted and want ruling
on one at a time. The radar tab, `MAX_PILLS` and its mobile cap, the corrected
PDF export from Word, the Substack post and welcome email, and the dead-code
sweep all stand.

### 2026-08-30 RULING: periwinkle moves to #9B9EDE, and the nav is cobalt everywhere

Jasmin: "I love the periwinkle and cobalt combo but we can shift the hex to
meet better accessibility." Implemented on the design agent's recommendation,
every ratio it gave re-verified here before anything was changed.

**The trap, and why one hex could not solve it.** The hero needs periwinkle
*lighter*, because cobalt display type sits on it. The nav needed it *darker*,
because cream and lime text sat on it. Darkening is a dead end: a periwinkle
dark enough for cream at 4.5:1 sits almost on cobalt and erases the wordmark.
So the hero keeps the periwinkle and **the nav gives it up**, becoming cobalt on
every route, which is what every page except home already used.

**Measured, before to after:**

| Pairing | Before | After | Needs |
|---|---|---|---|
| hero wordmark, cobalt on periwinkle | 2.37 | **3.38** | 3 (display) |
| legal and policy h1 on cobalt | 2.37 | **3.38** | 3 (display) |
| homepage nav text, cream on cobalt | 3.40 | **8.03** | 4.5 |
| homepage Menu label, lime on cobalt | 2.75 | **6.50** | 4.5 |
| DesignKit Open bar, ink on periwinkle | 3.60 | **7.20** | 4.5 |
| DragHint label, ink on periwinkle | 2.75 | **7.20** | 4.5 |

The last two were **live failures nobody had listed**, found while sizing the
change. DesignKit's link bar was white on periwinkle at 3.60:1 before any of
this, and lightening the hero would have taken the drag hint from 2.75:1 to
1.92:1, so it had to move in the same commit or the fix would have made it
worse.

**Why #9B9EDE specifically.** Hue unchanged to the decimal (237.3), saturation
50.9 to 50.4, only lightness moves, 65.7 to 73.9. It reads as a softer lilac,
not a different colour. The token `237.3 50.4% 73.9%` round-trips exactly.
3.38:1 clears the display floor with 13% margin; lighter values were available
(76% gives 3.69, 80% gives 4.32) and were rejected to keep the colour's
character, which is the thing Jasmin said she liked.

**Two consequences worth knowing.** White never goes on periwinkle again: it is
2.52:1, so `--secondary-foreground` is now ink. And the "Work with me" pill lost
its white-on-home special case, because its only rationale was the periwinkle
nav ground.

**Not touched:** the hero pills in `HomeGravity.tsx` still carry `#4A4A9A` and
`#E8572A`. On the lighter ground their boundaries shift (indigo just clears 3:1,
forest drops to 2.54, burnt orange to 1.43), but they are decorative and
draggable rather than text, so this is not a WCAG failure. It belongs to the
pending pill ruling.

### 2026-08-30 RULING: the news category colour map is retired

All five categories now use the locked chip pairing, cobalt on `#EEF0FB` at
7.50:1, and the card colour block is cobalt. Two of the five values were off
palette (`#4A4A9A` undocumented, `#E8572A` recorded in CLAUDE.md as rendering
nowhere while it rendered here) and two failed AA at badge size at 3.60:1. The
map existed twice, in `WhatsNewCard.tsx` and `Index.tsx`, so both problems
shipped from two files. The badge carries its own ground and a border, so it
holds on the white body and the cobalt block alike, which removed the need for
the inverted variant. Verified live: one distinct badge style across `/ai-news`
and the homepage strip.


### 2026-08-30 LAUNCHED. The overhaul is live on theeditai.co.uk

`origin/main` fast-forwarded from `47a0d1e` to `2b2d377`, 115 commits, 89 files,
+12197 / -2585. Pushed 15:35:31, live in about 40 seconds. No history rewritten
and no merge commit: main was a direct ancestor.

**Done as a remote fast-forward, `git push origin overhaul/sector-axis:main`,
rather than a local checkout and merge.** Three reports from a parallel session
had uncommitted edits that differ between the branches, so switching locally
would have put that work at risk. Local `main` is therefore still at `47a0d1e`
and needs a `git pull` before anyone works on it directly. The branch is pushed
and identical to main.

**Pre-flight run before pushing.** `.env.local` gitignored and no `.env` tracked;
no API key literal in any tracked file; `dist/` gitignored with zero tracked
files; sitemap and `App.tsx` routes match exactly in both directions; every
canonical non-www; the Substack resolves 200.

**Verified on production, not assumed.**

- `/tools` renders **23 tool cards**, no error state, no empty state. This was
  the biggest launch risk: the production Sheets key is referrer-locked to
  `theeditai.co.uk/*` and a drift in that list would have rendered the
  directory empty. It resolved.
- Homepage: one `h1`, one definition paragraph, the heading reads "There's a
  lot to keep up with in AI. This helps.", the counter and the physics hero
  both render.
- `/policy-template`: `h1` "The AI-use policy template for charities", the CTA
  is a direct `download` of the `.docx`, the new copy is live and both old gate
  lines are gone.
- The `.docx` serves at `application/vnd.openxmlformats-officedocument.wordprocessingml.document`,
  21711 bytes, byte-identical to the repo. The PDF is gone and now returns the
  SPA html, which is the intended result of removing it.
- `robots.txt` updated, `sitemap.xml` 200, and `www` still 308s to the bare
  domain.

**Known and accepted at launch.** The template ships as Word only; the PDF was
pulled because it rendered in substituted faces, and a corrected Word export can
be dropped back into `public/` whenever it exists. The Substack post and welcome
email were never built and are now post-launch work rather than a gate, since
the site delivers the template itself.

**Still open, none of it blocking.** The news category colour ruling is settled
in favour of collapsing to one chip and not yet implemented. The WhatsNewCard
layout, the lime-pill component, the ToolCard CSS moving onto tokens, and the
`/tools` and `/learning` heading question all remain. Four checks still cannot
be closed from a desk: on-device touch, a real 360px device, device rotation
against the physics canvas, and a keyboard and screen-reader pass. And twelve
parallel-session reports are still untracked, plus the three modified ones that
forced the remote-fast-forward route.


### 2026-08-30 RULING: the AI-use policy template is no longer gated

**Decided in session on Jasmin's explicit delegation, with authority to
overturn the standing CLAUDE.md ruling. Do not reopen without a reason that
is not already listed here.**

**The decision.** The template downloads directly from `/policy-template`. No
subscription, no capture, no email step. The Substack invitation survives
everywhere else on the site (nav twice, footer) as an invitation rather than a
toll. Optimised for **trust and reach over subscriber count.**

**What was verified first, not assumed.** Both files exist in `public/` and
serve correctly from the dev server with matching byte counts, `application/pdf`
and the Word MIME type. `robots.txt` disallowed both filenames while leaving
`/policy-template` indexable. `PolicyTemplate.tsx` linked only
`SUBSTACK_SUBSCRIBE_URL` and offered no download. **Nothing else in the codebase
referenced either file.** And a non-existent path returns **200 `text/html`**,
so the gate's own delivery link could never have failed loudly.

**The reasoning, in the order it decided the question.**

1. **The gate does not exist.** C3 was never built: the CTA pointed at a
   subscribe page and no welcome email delivered anything. This was not a
   working gate with a known leak, it was an unbuilt gate blocking launch.
   Keeping it meant keeping launch blocked on Substack work; dropping it
   unblocks launch now, which is the stated priority.
2. **The gate leaks by design and that was already accepted.** The files sit at
   public URLs so the welcome email can link them, and `robots.txt` is a
   request, not access control. One forward of the email defeats it. The gate
   was therefore never protecting the asset, only adding friction to the honest
   route.
3. **It contradicts the positioning.** The site's claim is that it gives the
   sector the hard answer straight and publishes the failures too. The template
   is the most concrete proof of that claim, and charging an email toll for the
   proof works against the trust play that the whole re-point rests on.
4. **It excludes the exact reader the consultancy sells to.** A charity or
   local-authority comms lead often cannot hand a work email to a newsletter
   without asking someone. The careful reader is the buyer, and the gate
   filtered for the incautious one.
5. **The acquisition case is weak.** Most subscribers arrive through the
   Substack app and network, not this gate, so it was doing little of the work
   it was designed for while costing the asset its reach.

**Options rejected, and why.** *Full gate as now:* requires building C3 and
keeps launch blocked, for a gate that leaks. *PDF open, Word gated:* the worst
of both, because it still needs the Substack delivery built, so it does not
unblock launch, and it gates the adaptable artefact while giving away the
read-only one. *Fully open with no invitation:* throws away reach for no gain,
since the subscribe CTA costs nothing to keep alongside.

**What changed.** `PolicyTemplate.tsx`: the CTA now points at
`/AI-Use-Policy-Template.docx` with `download`, keeping the approved
"Get the template →" label, so all four instances of that label stay identical
and the journey finally matches the promise. `robots.txt`: both `Disallow`
lines removed, since blocking a file the site now links as its primary call to
action would be self-contradictory.

**The .docx, not the .pdf**, because the intro promises something "ready to
adapt to your organisation". The PDF stays at its URL and is unlinked only
because a second button needs a label that does not exist yet.

**TWO STRINGS OWED FROM JASMIN. The page is incomplete until they arrive.**
Two approved lines were removed rather than rewritten, because they described a
subscription step that no longer exists and would otherwise have stated
something untrue beside a direct download:
  1. replacing "It's free. Subscribe and you'll get the link straight away." a
     line under the CTA saying the template is free and downloads directly;
  2. replacing "Delivered through my Substack. Unsubscribe any time; the
     template is yours either way." a line inviting the Substack as an option
     rather than a toll.
Both are marked in a comment at the removal site in `PolicyTemplate.tsx`.

**Consequences for the launch gate.** C3 as originally scoped is no longer a
blocker on the merge: the template is delivered by the site itself. The
Substack post and welcome email become post-launch work rather than a gate.
`CLAUDE.md`'s Conversion section still describes the gated flow and is now
stale; correcting it is a follow-up, flagged rather than done here to keep one
job per commit.


### 2026-08-29 (launch gate assessed against F2, nothing changed)

Read against F2 and F3 in `reports/2026-08-22-handover-to-relaunch.md` rather
than from memory. **This is the state to start the next session from.**

**Cleared.** Ten-row merge floor: 23 complete rows on the live Sheet. A4 hard
gate: all 23 visible rows appear in an A4 fact-pass doc with sources. B3 closed
26 Aug at ten of ten. F1 closed, F2b moot, F2c closed and preserved by the
29 Aug breakpoint change.

**Blocking: one thing, C3.** (A second was recorded here and was wrong; see below.)

1. **C3, the Substack gate.** Named in the handover as the hard blocker on the
   merge, and F3 is explicitly blocked on it. Two pieces, not one: the gated
   post *and* the Substack welcome email, which is what actually delivers the
   template. Both drafted 25 Aug, neither published. Until it exists the
   footer, both nav links and `/policy-template` point at nothing.
   Attached to it: `public/AI-Use-Policy-Template.pdf` is **untracked** and the
   `.docx` is **modified and uncommitted**. If they are not committed they do
   not deploy, and because `vercel.json` rewrites `/(.*)` to `index.html` a
   missing file returns **200 with `text/html`, never a 404**. The link would
   look like it works while serving HTML to someone who just gave their email.
   The clean-browser test must check content type and byte size on
   `theeditai.co.uk`, not that the link resolves. Both files came from a
   parallel session, so they are Jasmin's to rule on.

2. ~~**Eight of the 23 visible rows carry judgement fields with no A5
   record.**~~ **WRONG, corrected 2026-08-30. Not a blocker.** All eight are
   covered by `reports/2026-08-28-batch2-judgement-drafts.md`, committed at
   `2b89b76`, which drafts flag, trustee note and verdict for each against the
   locked axis and the verdict sector rule. The content reached the Sheet and
   the jobs that file flagged as assumed match the Sheet, so they were
   confirmed too. **Judgement coverage across all 23 rendering rows is
   complete.**

   The error is worth keeping: the search was for report *filenames* matching
   "a5" or "verdict", and the batch-two file is named "judgement-drafts", so it
   was missed. An absence of evidence was then reported as a live blocker, in
   stronger terms than the check supported, and written into `.claude/CLAUDE.md`
   before being caught. Search report contents for a distinctive phrase, not
   filenames.

   One real observation survives it: `isComplete()` gates on `trustee_note` and
   `dpia_flag` but not on `verdict`, so a row could render with an empty
   verdict. None currently does.

**F2 itself is "Not started"**, which is the sign-off pass rather than a task.

**Recommended order:** commit the two template files once the PDF is final; do
C3 and test it on production; then F2 sign-off and merge on a day she can watch
the deploy, since Vercel fails silently.

Not blocking and can follow the relaunch: the news category colour ruling
(settled 29 Aug in favour of collapsing to the one locked chip pairing,
deprioritised by Jasmin), the WhatsNewCard layout, the lime-pill component, the
homepage dead-space composition, the ToolCard CSS moving onto tokens, and the
four device checks nobody can close from a desk.


### 2026-08-29 (code session: clearing the unblocked half of the outstanding list)

Three commits, `221767f` through `56a4180`. Gate clean before each. Everything
here was a defect or the consistent application of a ruling already taken, so
none of it needed a new decision. What did need one is listed at the end and was
left alone.

**1. `221767f` The colour tokens now render the locked palette.** Seventeen HSL
triples in `index.css` did not round-trip to the hex they claim to encode:
`--accent` rendered `#CEF047` against a locked `#C8F04A`, `--secondary` and
`--hero` `#8084D0` against `#7B7FD4`, `--foreground` `#181410` against
`#1A1510`, `--border` `#E8E1D9` against `#E8E2D8`, and more. Integer HSL almost
never round-trips, and nobody had checked.

This had a live consequence, confirmed in the browser before and after: the
"Work with me" CTA is the only lime driven from the token (`bg-accent`), while
the other 44 limes are inline hex, so **the site's primary conversion link was a
different lime from every other lime on the same page**. It now measures
`#C8F04A` like the rest.

Values now carry one decimal and each was verified to round-trip. **This was the
blocker on the tokenisation job**: swapping an inline hex for its token would
have silently shifted the colour, which is almost certainly why components
bypassed the token layer in the first place. That swap is now safe.

**2. `53394ee` Muted stops carrying text anywhere.** The 29 Aug ruling had only
reached the ToolCard. `--muted-foreground` was the identical triple to `--muted`,
which is what rendered the 404 message at 1.00:1. It now points at the secondary
text value, which fixes `Learning.tsx:123, :134` and `ErrorState.tsx:6, :16`
**without touching a component**. Six homepage labels and the search placeholder
moved to the token class, and eleven inline `#9A8F82` text values became
`hsl(var(--text-secondary))` rather than another hardcoded hex, so the
tokenisation job does not have to revisit them. Muted keeps the search icon and
the ToolCard divider, which is what the ruling scopes it to. Verified rendering
`#6B625A` on `/learning` and `/`.

**3. `56a4180` Heading structure and filter state.** The homepage rendered two
`h1`s ("The" and "Edit."); `/design-kit` rendered two, the second **empty**,
because `CobaltZone`'s two-line branch emits one per line and that page passes
`line2: ""`. Both are now one `h1` with block spans, display treatment
unchanged, confirmed by screenshot. The `/tools` and `/learning` filters carried
active state in background colour alone; both now set `aria-pressed`, matching
the three sector toggles four lines away. Verified: one `h1` and zero empty on
both pages, 11 buttons exposing `aria-pressed`.

**Still outstanding, and why each was left.**

Needs Jasmin's ruling, not a code decision:
- Two or three grid columns at 1280.
- Homepage intro and About panel side by side at `lg` (the remaining dead space;
  `/policy-template` was fixed on 29 Aug).
- Mobile hero height, and the exact wordmark string for the mobile masthead.
- The news category colour map: `#4A4A9A` and `#E8572A` are off-palette and
  live, and CLAUDE.md says burnt orange renders nowhere. It renders in three
  places.
- The locked cobalt hover state: three different improvised values exist.
- Periwinkle on cobalt at 2.37:1, which carries the homepage wordmark and every
  legal and policy `h1`.
- The three copy flags from `reports/2026-08-29-audience-phrase-proposal.md`:
  the `/policy-template` title trade, the footer's "Free for" reading as an
  eligibility gate, and the charity-specific vocabulary that un-names the
  non-charity readers.
- The untracked `reports/2026-08-29-*` files from parallel sessions.

Needs approved copy:
- `NotFound` ships no meta at all. Adding `SEO` needs a title and description.
- Whether `/tools` and `/learning` should carry an `h2` above their grids.

Deferred deliberately, not blocked:
- The lime pill is hand-copied in five places with five hover handlers and has
  already drifted once (`MyStack` uses weight 600 and a 999px radius). One
  shared component would end it. Not a defect, so it waits.
- `WhatsNewCard`: title and developer are the wrong way round, and the fixed
  56/64px padding reserves and `paddingRight: 110` are desktop-sized and never
  adapt. The layout half is actionable; it is entangled with the category
  colour ruling above, so it moves as one job once that is settled.
- The ToolCard's CSS can now move onto tokens. Left as hex because it is a
  separate change with its own verification.

Checks still owed, which no session can close from here: on-device touch, a real
360px device, device rotation against the physics canvas, and a keyboard and
screen-reader pass with real assistive tech.

### 2026-08-29 (code session: the ToolCard rebuild)

Five commits, `8949879` through `748d5c9`, from
`reports/2026-08-29-toolcard-rebuild-brief.md` with three corrections applied
(below). Gate clean before each: `bunx tsc --noEmit` 0 errors, `bun test` 64
pass, `bun run build` succeeds. `main` untouched. `sheets.ts` and
`isComplete()` never opened. No string changed anywhere on the card.

**The type scale it ended on: four steps.** 11px labels, badges and stamps;
13px metadata, chips and the Visit pill; 15px reading text; 20px name.
Measured on a fully populated card: 20px x1, 15px x2, 13px x7, 11px x8. The
12px and 14px steps are gone. Before, 17 of 18 runs sat in an 11 to 14px band
with nothing between 14px and 20px, which is why the card read busy: plenty of
difference, almost no hierarchy. The verdict toggle went 13px medium to 15px
semibold and is now the second-largest thing on the card.

**Ruling 2 passes its own test.** `grep "isSelected ?" ToolCard.tsx` returns
nothing. Inline `style={{}}` blocks went 20 to 0, the file 383 lines to 289,
and zero inline hex remains. Colour lives in `index.css` under `.tool-card`,
keyed off `data-selected`, and the hover looks exactly as it did.

**All three DPIA chips hold on the inverted card**, checked rather than
assumed, and twice. Live: Green `#E4F0E9`/`#2D6A4F`, Amber `#FAF0DB`/`#7A5200`,
Red `#FBE9E6`/`#A8261C`, byte-identical in rest and selected states.
Structurally: no `[data-selected]` rule targets `.tc-dpia` at all, so the
inversion cannot reach them. Also confirmed visually on a cobalt card.

**Widths verified**, all with no horizontal scroll: 375 (1 col, 327px card),
414 (1 col, 366px), 640 (2 cols, 260px), 1024 (3 cols, 293px), 1280 (3 cols,
379px), 1440 (3 cols, 411px). Tap targets 44px at every width.

**Three corrections to the brief, all measured before acting:**

1. **The "raise the dim floor from 45% to 70%" instruction was a no-op.** The
   card was already at `opacity-70` and there is no 45% anywhere in it. The
   arithmetic in the brief was right and the starting value was invented. Not
   implemented, because there was nothing to implement.
2. **Ruling 4 collided with ruling 1 and the brief did not say so.**
   `#6B625A` on the cobalt card is 1.43:1. The selected-state secondary text
   was `rgba(250,248,244,0.6)`, which composites to `#A8AAE3` at 3.86:1 and
   already failed AA. Because ruling 1 keeps the hover, that failure would
   have been permanent. Now 0.8, giving `#D1D1EB` at 5.69:1.
3. **Ruling 3 makes the verdict promotion load-bearing**, so it was treated as
   a headline change rather than an implied one: 13px `#9B9FE0` at 2.49:1
   becomes 15px semibold cobalt at 8.52:1.

**Found, and not in the findings report or the brief:**

- **The existing HSL tokens do not round-trip to the locked palette.**
  `--accent` renders `#CEF047` against a locked `#C8F04A`, `--foreground`
  `#181410` against `#1A1510`, `--border` `#E8E1D9` against `#E8E2D8`, and
  four more. Seven of nine drift. This is almost certainly *why* components
  hardcode hex inline, and it means **the tokenisation job cannot simply swap
  hex for tokens**: the token values have to be corrected first or every
  surface shifts. The card's CSS therefore uses exact hex deliberately.
  `--text-secondary` is exact and is used as a token.
- **The verdict rule needed a selected-state value.** Moving it to cobalt for
  the rest state would have made it 1.00:1 on the cobalt card, invisible. It
  takes cream at 0.5, 3.12:1, clearing the 3:1 non-text threshold.
- **Selected job chips were `#FFFFFF` on `#9B9FE0`, 2.49:1.** Not flagged
  anywhere. Now the translucent-cream treatment IN MY STACK already used,
  5.80:1.
- **The card did not get shorter.** The findings report predicted 80 to 100px
  off. Cards are 517px at 1280 against roughly 500px before: the 44px tap
  targets cost more than the inline axis lines save. The hierarchy is fixed,
  the height is not, and at the 45-row ceiling that wants its own decision.
- **The pinch points are 640 and 1024, not 1280.** Cards are narrowest and
  tallest at 640 (260px wide, 581px tall) and 1024 (293px, 583px). The open
  two-versus-three-column ruling matters less at 1280 than the grid does at
  those two widths.
- **`p-4 sm:p-5` gives the narrowest card the larger padding**, because the
  padding keys off viewport while the card width keys off column count. Minor,
  and not worth a container query today, but it is backwards.
- Not done, and flagged rather than skipped silently: the report also wanted
  pricing and nonprofit tier on one `justify-between` row. At 260 to 293px
  both strings wrap and it reads worse than the stack.

**Verification honesty.** Two things are reasoned, not observed. Touch
behaviour is verified through the real React pointer path in a browser, not on
hardware, so the on-device check is still owed. And I could not capture one
screenshot showing hover and dim together with every card revealed: the Reveal
IntersectionObserver does not fire reliably when the pane is driven
programmatically. That flakiness also produced several false readings during
this session, off-screen cards reporting unstyled values and `getBoundingClientRect`
distorted by the reveal `scale(0.95)`, which is worth knowing before anyone
trusts a computed-style measurement on this grid again.

### 2026-08-29 (code session: the seven unblocked design fixes)

Implemented from `reports/2026-08-29-unblocked-fixes-brief.md`, which was
written from `reports/2026-08-29-design-audit-findings.md` earlier the same
day. **Nothing committed: files are written and the commit blocks are with
Jasmin.** Gate run after all seven, clean: `bunx tsc --noEmit` 0 errors,
`bun test` 64 pass, `bun run build` succeeds (chunk warning is the known
matter-js debt). `main` untouched. ToolCard.tsx deliberately not opened: the
card rebuild is blocked on three rulings.

Verified on the local dev server against live Sheet data at 375, 640, 700,
739, 768, 1023, 1024, 1280 and 1440. Fresh page load at each width, because
the mobile hook reads its breakpoint at mount and a resized-but-not-reloaded
page reports the old value.

1. **Sticky filter bar** (`Tools.tsx:107` to `sticky top-0`). Gap between nav
   and bar measured 64px before, **0px after**, at every width.
2. **Policy template centring** (`PolicyTemplate.tsx:35`, added `mx-auto`).
   At 1440 the column was 64px left / 736px right; it is now **400px / 400px**.
3. **404 invisible text** (`NotFound.tsx` rebuilt on the palette). Message and
   link now legible on cream. **Deviation, deliberate: `index.css` was NOT
   changed.** See below.
4. **Filter rail collapse** (`Tools.tsx`, wrap moved from `sm:` to `lg:` in
   five class strings). Horizontal scroll at 640 was scrollWidth 692 against a
   640 viewport; **gone at 640, 700 and 739**. Below lg the search box takes
   its own full-width row and the rail keeps the scroller it already had at
   375. At lg and up nothing changed, so F2c still holds.
5. **Nav CTA off-screen** (`use-mobile.tsx` breakpoint 768 to 1024, plus
   `lg:px-8 xl:px-12` on the nav container and `px-3 xl:px-4` on nav items).
   Handover verified: **1023 hamburger, 1024 desktop nav, nothing off-screen
   at either.** 1280 and 1440 unchanged.
6. **Synthetic font weights.** Chillax loads 400-700 and Plus Jakarta Sans
   400-600, so `font-black` (900) and body 700/800 were being faked. Display
   h1s now render at a real 700, and `/ai-news` went from three elements at
   weight 800 to **zero**.
7. **Four off-palette hexes.** Learning border to `#E8E2D8`, PolicyTemplate
   intro to `#1A1510`, WhatsNewCard toggle to the `#EEF0FB`/`#2D35C9` chip
   pairing, DesignKit freemium and paid badges to the same pairing. All
   confirmed in computed styles. The other five off-palette values were left
   exactly as they are: they sit behind open rulings.

**Found, and not in the report or the brief:**

- **Raising the breakpoint to 1024 is not on its own sufficient.** Measured:
  the desktop nav needs 1087px, so at 1024 "Work with me" still ended at
  1039. The brief's fix 5 as written would have moved the defect from
  768-1086 to 1024-1086 rather than closing it. The two padding changes close
  it, and are scoped so 1280 and up renders exactly as before.
- **`index.css` muted tokens were left alone on purpose.** `--muted` and
  `--muted-foreground` are the same HSL triple, but `--muted-foreground` is
  read as text by `Learning.tsx:123,134` and `ErrorState.tsx:6,16`, so
  darkening it silently restyles those two components, and the muted colour
  is one of the open contrast rulings. Rebuilding NotFound fixes the reported
  defect on its own. The identical-token trap remains and belongs with that
  ruling.
- **`WhatsNewCard.tsx:261` is `font-heading`, not body**, so its weight 700 is
  a real loaded Chillax weight and was correctly left alone. The design audit
  findings list it as a body-face offender; that line is wrong.
- **`MyStack.tsx:111` was a sixth body-font offender** neither the report nor
  the brief listed, at weight 700. Its sibling button at `:253` was already
  600, so the pair was inconsistent; both are now 600.
- **Every design_kit row is currently `free`**, all 28 badges. The freemium
  and paid colours changed in fix 7 therefore render nowhere today, so that
  change carries no visual risk now. It also means the flag below is latent
  rather than live.
- **Flag, not decided here:** freemium and paid now render identically,
  because the locked palette has no third badge colour (lime is barred from
  badges, periwinkle is homepage-hero only, burnt orange is legacy). The
  labels carry the distinction. `free` keeps forest green, which CLAUDE.md
  scopes to the In My Stack badge, so its use as a cost badge belongs to the
  same ruling.
- **The seven fixes cannot be committed as seven path-staged commits.** Four
  files carry changes for more than one job: `Tools.tsx` (1 and 4),
  `PolicyTemplate.tsx` (2, 6 and 7), `Layout.tsx` (5 and 6) and
  `WhatsNewCard.tsx` (6 and 7). Splitting them needs `git add -p`. Options
  are in the handover.

### 2026-08-28 (late): three rulings for the record
**The October window is dissolved: launch whenever the F2 gates pass.**
F3's timing constraint is Jasmin's-sign-off-plus-a-clear-day only; CLAUDE.md's
"19-23 October" branch note is stale against this ruling. Phone-width
verification was done in the code session. Legal pages signed off, placement
running as a code task. Sheet edit pack at
reports/2026-08-28-sheet-edit-pack.md consolidates every pending cell change.

### 2026-08-28 (Cowork: positioning thread — statement signed, audit run, copy pack four)

No code written from this thread; two code sessions briefed and run by Jasmin
(strip to my_stack + sitemap; then the five-job session placing copy pack
four, the card reorder, the failure badge, GA4/banner removal and the legal
pages). Produced and in reports/, all dated 2026-08-28: **positioning
statement (SIGNED OFF, the ruler for every surface call)**, surface audit
(verdict per page), **copy pack four, thirteen items approved** (items 1-3
revised same day for the empowerment framing and Jasmin's register), legal
pages final drafts, A4 fact pass batch two (eight rows, agent-researched,
sourced), pricing currency check (23 rows; Grok access claim wrong, Notion
AI add-on discontinued, Gemini Advanced renamed).

Rulings taken 28 Aug, all Jasmin's: premise rewritten comms-first; claim is
been through the checks, never passed; board-reference line owns capture
surfaces; DPIA explained ungated on /policy-template; one reader two
moments; lightness testable pair; purposes ranked with the fellowship
guard; failure rows get a `not_recommended` status value and the badge
(white on #A8261C); checks zone reorders chip-first; /design-kit KEPT and
re-pointed (not parked); currency recorded in vendor's displayed currency,
never converted; **GA4 and the cookie banner removed at launch** (closes
consent-mode debt by deletion; Search Console is the measurement); legacy
Supabase subscribers table: export once then delete; legal identity is
"run by Jasmin Aziz, the strategic communications consultancy at
jasminaziz.co.uk", no trading-as.

Open from this thread: judgement drafts (flags, trustee notes, verdicts)
for the eight batch-two rows, owed by the positioning thread; pills label
string and radar tab ruling still outstanding; GBP checks for six vendors
need a UK browser; phone-width pass of /tools owed before F2.


### 2026-08-28 (code session: copy pack four, card, GA4, legal pages)

**Six commits, `f8843b8` through `1aa0d81`, one per job (two for the legal
pages), gate clean before each, `main` untouched.** Five jobs from the
positioning thread, all ruled in advance.

1. `f8843b8` Place copy pack four
2. `ac6ced1` Reorder the ToolCard checks zone: DPIA chip first
3. `e56b420` Add the failure-row badge, driven by a not_recommended status
4. `d7221c8` Remove GA4 and the cookie banner
5. `2534adc` Rewrite the privacy policy to the signed draft
6. `1aa0d81` Rewrite the cookie policy to the signed draft

**Verified in the browser, not assumed.** The site now sets no cookies:
`document.cookie` empty, `localStorage` and `sessionStorage` empty,
`window.gtag` and `window.dataLayer` undefined on a clean load of `/` and
`/tools`, and no GA reference in the built `dist`. That check is what earns
the legal pages' claim, which is why they land one commit later. The checks
zone reorder was confirmed against a live Red row: chip, then template link,
then the two fact lines.

**Next step.** Jasmin sets `not_recommended` on the three failure rows
(Seedance, DeepSeek, Grok) in column C. The badge is built and renders nowhere
until she does; nothing was written to the Sheet.

**Open, flagged not fixed:**

- **All three legal pages ship no meta** (no title, description or canonical),
  so they fall back to the static `index.html` title. Same class as `/submit`
  before 22 Aug. Needs authored description copy, so it is Jasmin's call.
- **`.claude/CLAUDE.md` still says "Analytics: GA4 (G-QHYYEWC2C0)".** That line
  became false at `d7221c8` and was left alone because CLAUDE.md was outside
  this session's stated wrap scope. One line, wants correcting.
- The ICO reference on the privacy page is plain text, not a link. Deliberate:
  linking is a decision on copy Jasmin signs.
- Returning visitors keep an orphaned `theEditCookieConsent` localStorage key
  that nothing now reads. Not a cookie, clears with site data.

**Git hazard worth banking.** This repo now has two sessions working the same
tree, so the index is shared. A `git commit` with no pathspec commits whatever
is staged, including the other session's files: one commit here swept in
`reports/2026-08-28-batch2-signoff.md` and had to be redone. A stale
`.git/index.lock` also appeared from the two sessions racing. **Use
`git commit --only <paths>` in this repo until the parallel work stops.**

### 2026-08-28 (code session: the strip re-point and the sitemap)

**Three commits, `20f722a`, `c01a413`, `2122b6e`, one job each, gate clean
before each, `main` untouched.** Both code jobs were ruled and copy-free; no
visitor-facing string was authored or changed. `HomeGravity`, `MAX_PILLS` and
the pills label were named out of scope and not touched.

1. `20f722a` Point the homepage "What I'm running" strip at `my_stack`
2. `c01a413` Rewrite `sitemap.xml`: bare domain, live routes only
3. `2122b6e` Add the 28 August pre-launch surface audit

Both code commits close items logged in this file: the strip closes the 25 Aug
correction at the foot of these notes, the sitemap closes the 26 Aug finding
above.

**Next step.** Copy pack four, which the surface audit specifies but
deliberately does not draft. It is the gate on most of the remaining surface
work, since almost every "needs work" verdict resolves to an approved string.

**Open, flagged and not acted on:**

- The homepage counter reads "Passed the checks" (heading) and "tools that
  passed the checks" (caption), against the ruled "been through the checks"
  claim. Both are visitor-facing copy, so they wait for the copy pack. This is
  the site's most prominent claim and it currently fails the positioning
  statement's own test question 6.
- Whether the strip should order featured-first rather than sheet order. One
  line either way, needs a ruling.
- Three reports from the parallel session are still untracked at Jasmin's
  instruction, since she may still be editing them:
  `2026-08-28-positioning-statement.md`, `-a4-fact-pass-batch2.md`,
  `-pricing-currency-check.md`. Until the positioning statement is committed,
  three commit messages on this branch cite a file that is not in the repo.
  Worth closing before the October merge.


### 2026-08-26 (code session: the card restructure, the Stack cut, F2c)

**Nine commits, `75792c1f` through `b4c5a7cb`, one job each, tree clean, `main`
untouched at `47a0d1e`.** All nine items on the restructure change list are in
the code. No residual stack references anywhere in the repo. No test file
references anything deleted.

1. `75792c1f` `parseToolRows` reads `what_it_does` from the Sheet
2. `792360a5` Cut Build Your Own Stack
3. `b7e9f2ec` Restructure ToolCard into explore, buying and checks zones
4. `719f8edb` F2c: the filter rail always wraps at `sm` and up
5. `8d14ae6e` C4(b) fires on Red only
6. `786b643e` Place the two approved card-restructure strings
7. `6749ada2` Correct CLAUDE.md and schema.md against live data
8. `4f6eb0f8` Correct two false claims in CLAUDE.md badge states
9. `b4c5a7cb` Fix a comment that was stale the moment it was written

**The finding worth keeping, and it is Jasmin's.** She ran `bun run build` for
the first time, which nobody had done, and pointed out that **`tsc --noEmit`
does not exercise the same path**: Vite resolves imports, assets and plugin
config at bundle time and can fail on things tsc passes. Combined with the
lessons.md entry that **Vercel build failures are silent**, a build nobody ran
locally is a deploy that dies quietly and keeps serving stale content. **The
pre-commit gate is now three commands, not two:** `bunx tsc --noEmit`,
`bun test`, `bun run build`. Written into CLAUDE.md's working discipline and
`tasks/lessons.md`. The build succeeds; the chunk-size warning is the known
matter-js debt.

**Two false claims found in CLAUDE.md by the code session.**
`StatusBadge.tsx` and `STATUS_MAP` were **deleted on 2026-07-03 in commit
`3e55953`** and have not been on disk since. CLAUDE.md, the handover's B7 row
and the 2026-07-04 security audit all carried them as live dead code for seven
weeks, so the dead-code sweep would have gone hunting for a file that was
already gone. B7's sweep list corrected.

**B3 re-run checklist item 7 is now stale and is flagged in place.** It reads
"C4(b) appears under Amber and Red and never under Green". C4(b) now fires on
**Red only**, so run as written the item would record correct behaviour as a
failure. **That is the second time this checklist has sprung the same trap**,
after item 1's Descript line, so the item now carries the correction inline
rather than a note elsewhere.

**UNPUSHED at the time of writing.** Local tip `b4c5a7cb`, `origin` still at
`0f307e2f`. All nine commits exist only on the Mac.

**Not verified in a browser.** The card changed structurally and nothing has
been looked at on localhost:8080. That is an F2 prerequisite and the next thing
to do.

**Not in scope and untouched, correctly:** `HomeGravity`, `MAX_PILLS` and
everything to do with the homepage pills. That ruling is still outstanding.

### 2026-08-26 (code session: seven briefed jobs, Stack cut, card restructure)

Branch `overhaul/sector-axis`. **Nine commits, `75792c1` to `b4c5a7c`.** tsc
clean and 61 tests green before every commit; `bun run build` verified at the
end. Nothing merged. `main` untouched at `47a0d1e`.

**The seven briefed jobs, one commit each, in Jasmin's stated order** (the
order was load-bearing: the Stack cut removes props from ToolCard, so it had
to land first):

1. `75792c1` — `parseToolRows` reads `what_it_does` from Sheet column N, by
   header name with `fetchMyStack`'s aliases. The card had rendered an empty
   paragraph for it all along. Two tests added.
2. `792360a` — **Build Your Own Stack cut** (handover B8). 1,128 lines.
   `Stack.tsx`, `StackBar.tsx`, `StackTooltip.tsx`, `slugify.ts` deleted; stack
   state, share-link merge, mobile banner, tooltip, coachmark and the duplicated
   `hasStackParam` branch stripped from `Tools.tsx`; add control and coachmark
   removed from `ToolCard`; `Layout`'s `isBare` branch removed with them.
   `/stack` is now `Navigate replace` to `/tools` — the third redirect. Closes
   F2b, the StackBar www bug, one AA contrast failure, one design-system
   violation, and the card's competing CTAs.
3. `b7e9f2e` — **ToolCard restructured into explore / buying / checks / act.**
   Description now precedes the job chips. Nonprofit pricing moved to sit with
   the price, `#EEF0FB` tint dropped, value bold. Verdict toggle and `Checked`
   share one row, `Checked` at 11px muted. Description guarded like every other
   field.
4. `719f8ed` — **F2c closed.** Filter rail always wraps at `sm` and up. The
   gradient fade became mobile-only as a consequence (see below).
5. `8d14ae6` — **C4(b) fires on Red only.** String unchanged, condition moved.
6. `786b643` — the two approved strings placed verbatim: `The checks` as the
   risk-zone label, and the DPIA definition line on `/tools`.
7. `6749ada` — `.claude/CLAUDE.md` and `.claude/schema.md` corrected.

**Plus two from the self-audit at the end:** `4f6eb0f` (CLAUDE.md asserted
`STATUS_MAP` and `StatusBadge.tsx` still exist; both deleted 2026-07-03 in
`3e55953`, and I had carried the StatusBadge claim *forward* into the block I
was correcting) and `b4c5a7c` (a code comment that was stale when written).

**Verified against live Sheet data, not fixtures.** This partially discharges
the B3 "built, not finally verified" caveat. `tools` is 67 rows, headers A-N.
**15 rows complete and rendering; 12 Amber, 2 Red, 1 Green.** All 15 carry a
`what_it_does`. `my_stack` is **19 rows, not 21** as the docs claimed. Checked
in the browser: zone order as specified, C4(b) on HubSpot alone, rail wrapping
with all eight chips visible in *both* scroll states, `/stack?stack=...`
redirecting, no console errors.

**Judgement call made in-session and flagged:** the gradient fade beside the
filter rail is keyed on the same `scrolled` state F2c named. Left conditional
it would have washed a 40px strip over the right edge of the newly wrapped
chips — the clipping F2c exists to stop. Made unconditionally `sm:hidden`.

**Sequencing call, flagged up front and not objected to:** job 3 shipped the
checks zone's hairline rule without its label; job 6 placed the label. Keeps
copy placement auditable in one commit.

**Chased and dismissed, not a defect:** page titles read stale in the browser.
It is the static `index.html` title Vite serves pre-hydration, read by an eval
context that also reported `innerWidth: 0` on a page rendering at 800px. The
session's own first `get_page_text` had shown the injected title. See
`tasks/lessons.md`.

**Two findings flagged, NOT fixed — outside the seven jobs, Jasmin's call:**

- **`public/sitemap.xml` is materially stale.** All seven URLs use `www.`,
  which 308s to the bare domain, so every entry points at a host the site
  redirects away from. Lists `/whats-new` and `/subscribe`, both now redirects.
  Omits `/ai-news`, `/policy-template`, `/submit` and the three legal pages.
  `/stack` was never in it, so the cut did not make this worse. Wants owning
  before the October merge.
- **One visitor-facing em dash survives on the branch:** `WhatsNew.tsx`,
  "Show more — {hiddenCount} remaining", against the locked voice rule. B8's
  "all three visitor-facing em dashes" were the ones inside the stack files;
  this is a fourth and pre-existing.

**Deliberately untouched, per the brief:** `HomeGravity`, `MAX_PILLS` and
anything to do with the homepage pills — that ruling is outstanding, and its
parked label sits in the card copy pack.

**Next step:** the remaining content pass (axis fields and verdicts for rows
still short of complete, A4 with sources and A5 against the sector rule), then
the two outstanding rulings (homepage pills, radar tab), then capture live,
then merge in the 19-23 October week against F2's gates. The ten-row merge
floor is already cleared at 15.

**Timing note worth carrying:** the content work was pulled forward into
August, so October is the merge-and-relaunch window, not the do-the-work
window. Any doc still reading "waits for October" against content is stale.


### 2026-08-26 (Cowork: F2c measured, B3 closed, template spacing, A5 drafted)

No code changed, nothing committed to `src/`. Four files written to `reports/`,
two `.docx` and one `.pdf` rebuilt, `public/` kept in step.

**F2c measured and a two-day-old reading corrected.** The rail has two
layouts and they had been treated as one. Unscrolled it is
`sm:flex-wrap sm:overflow-visible` and wraps, so it never clips. Scrolled it is
`flex-nowrap overflow-x-auto` behind a 40px gradient, so it does. Chip content
is **1084.2px** at every width; chip widths do not change with viewport.

Measured at 1261 (Jasmin's window), then at simulated container widths of 1184
and 1270 by overriding the section's own width in the DOM. That is exact rather
than approximate: the filter bar carries **no `xl:` or `2xl:` classes**, checked
in the rendered HTML, so nothing between 1261 and 1366 changes except the
container, which is `min(1280, viewport - 96)`.

| Viewport | Unscrolled | Scrolled |
|---|---|---|
| 1261 | 749 box, wraps 5 + 3 | 893 box, **191px hidden**, Translation gone |
| 1280 | 768 box, wraps 5 + 3 | 912 box, **172px hidden**, Translation gone |
| 1366 | 854 box, wraps 6 + 2 | 998 box, **86px hidden**, Translation 31 of 117px and all of it under the gradient |

**The correction.** The 24 Aug reading, recorded as "at a 1470px viewport the
rail is one line, all seven chips visible, `Translation` ending 30px inside the
rail box", was the **compact scrolled state**, not the desktop unscrolled one.
Run the model at 1470 with seven chips and scrolled: chips start at 367,
`Translation` ends at **1345.3**, rail box ends at **1375**. Two independent
numbers matching the record to a tenth of a pixel. So the 23 Aug "wraps to two
lines on desktop" finding was never a narrow-window artifact, the 24 Aug "does
not reproduce at desktop width" conclusion measured a different state, and the
30px margin everyone reasoned from belonged to the other state. Amendment 3's
note that an eighth chip would clip is right about the compact state and
understates the unscrolled one, which was already wrapping.

**Recommended treatment, not yet ruled:** delete the
`scrolled ? "" : "sm:flex-wrap sm:overflow-visible"` conditional so the rail
always wraps at `sm` and up. One conditional, no copy, no axis amendment, 38px
of vertical cost in the compact state. Ruled out: shortening labels (they are
`jobs` values, so it needs an amendment or a display map that gives the filter
and the card two vocabularies), and shrinking the search box or chip padding
(`px-3.5` to `px-3` saves 32px against a gap of 86 to 172).

**B3 closes at ten of ten.** Item 8 passes: 16 grid items, template card at
position 7, gone under an active `Social` filter which returns 2. Item 1 passes
read against the corrected expectation, Descript appears. The fourth
`Get the template` label is confirmed identical to the desktop one by source
inspection, `Layout.tsx:142` against `Layout.tsx:224`, byte for byte including
the arrow. Recorded as source inspection, not a browser check.

**Sheet re-read through a second instrument.** The live Sheets API on the
localhost key, not the Drive connector, and it agrees: **67 rows, 15 complete,
52 hidden.** Payload 39.8KB of which **19.1KB is verdict text on rows that never
render**. `my_stack` holds **19** rows, not the 21 in schema.md. The
"What I'm running" strip currently names **Lovable, Vercel, GitHub, Claude
Code**, all four of which A3 removes.

**Rulings put to Jasmin, all outstanding.**

1. **Radar: own tab, before merge. RULED 28 Aug: yes.** Reasoning: 19.1KB of
   unpublished verdict copy ships to every visitor; `tools` is doing two jobs
   with one mechanism so every sentence about it needs a qualifier; an
   unbounded research list sharing a tab with a capped published one is how the
   cap erodes. Costs no code, and the A3 sheet already has the four-way sort.
   Side effect: moving the radar rows out takes the four dev tools out of the
   strip by accident, which argued for pointing the strip at `my_stack`
   deliberately — done independently 28 Aug, commit `20f722a`. Code job for the
   radar tab itself is still outstanding.
2. **The ceiling counts published rows.** It caps maintenance load, and a radar
   row costs a line in a Sheet. Counting Sheet rows would put it at 67 against
   45 today and force deleting research to publish a tool.
3. **Build Your Own Stack: cut it.** Case both ways written up. Against: the
   proposition thinned when the directory did; five interruptions on `/tools`
   for the feature that captures nothing against one card for the one that
   captures the email; F2b decays as E2 blanks rows; no nav entry, so it needs
   the coachmark, tooltip and banner to be found; four "my stack" labels meaning
   two things. Cost of cutting: ~950 lines, three files, `Tools.tsx` loses its
   duplicated `hasStackParam` render branch, `/stack` becomes a redirect,
   **no new copy needed**, and the B4(b) meta is the whole loss.
4. **Pills: keep `my_stack` as the source.** `my_stack` has 19 names,
   `MAX_PILLS` is 18, so one is already dropped, and the published directory has
   15, so sourcing from the tools page gives **fewer** pills. Raise the cap to
   30, add a mobile cap via the `useIsMobile` already in the component, and the
   gap between pills and counter becomes the argument rather than the problem.
   Label **APPROVED 28 Aug**: `Everything I run. The directory below is a
   shorter list.` Source is already `my_stack` in code as of today (`20f722a`).
   Still outstanding: raising `MAX_PILLS` from 18 to 30, the mobile cap, and
   placing the approved label string — one code job.

**Found in `src/`, no decision needed.**

- `StackBar.tsx:55` builds the share URL as `https://www.theeditai.co.uk/stack`.
  **With www.** Every shared link takes a 308 hop since the 22 Aug flip.
- All three visitor-facing em dashes on the branch are in the Stack feature:
  `Stack.tsx:44`, `Stack.tsx:49`, `StackBar.tsx:207`. None went through the
  approved-strings process.
- `HomeGravity` is measured clean on desktop: 230 frames, mean 16.67ms, p95
  17.7, zero long tasks at 18 pills. But `Gravity` runs matter-js's own
  `Render` alongside the DOM transform loop, and every body is created with
  `fillStyle: "#00000000"` and `lineWidth: 0`. **It draws nothing, every frame,
  at `devicePixelRatio`.** Deleting `Render` is free and it is the half that
  scales worst on a phone. `enableSleeping = false` is the deliberate mobile
  Safari fix and should stay.
- `App.tsx` has no lazy routes, so matter-js ships to every visitor including
  anyone landing straight on `/policy-template` from the welcome email.
- `tool.what_it_does` is vestigial with no Sheet column, but ToolCard still
  renders its `<p class="line-clamp-2">`. Measured live: 15 empty paragraphs,
  height 0, 12px top margin each. Dead markup for B7.
- Mobile-device measurement is still not possible from here.

**Template: three edits, then a spacing audit, then five fixes.**

Jasmin attached the Fonts folder, which changed what was possible. Chillax OTF
and WEB builds and Plus Jakarta Sans statics are all there, so **the brand PDF
now renders here through LibreOffice with no Word and no Font Book**. Two
Chillax OTFs (Medium, Bold) are hardlinked in iCloud and refuse to stage; the
`CHILLAX/WEB/fonts/` TTFs of the same weights work. Only Chillax Bold appears in
the document.

Edits Jasmin asked for, all applied to both `.docx` variants: the lime rule
moved from above the title block to below it, cover spacing opened up
(96 / 8+14 / 11 / 20 / 16 / rule 130 / 4 / 5), the 19 Chillax heading runs
retyped to Plus Jakarta Sans leaving the cover title as the only Chillax in the
document, and the template version number removed from the cover line and from
the footer on all twelve pages.

**Consequence that needed a decision: removing the version broke section 15.**
The sentence existed to stop the template's version colliding with the adopting
organisation's. Rewritten, **unapproved, Jasmin's to rule**:
`The table below records [ORGANISATION]'s own policy versions. The date this
template was last checked against UK law and ICO guidance is in the footer of
every page. Adopting a newer template does not renumber your policy.`

**Spacing audit, measured off the rendered PDF rather than the docx settings.**
Consistent: all 18 headings identical, all 78 body paragraphs identical, all 53
list items 4.5pt apart, the bold-question-then-regular-explanation pattern holds.
Four real faults plus one dead definition:

1. **Numbered lists were not lists.** 22 items used real Word bullets, **31 were
   hand-typed `1.` `2.` into paragraphs indented 400/400 twips.** Bullet markers
   sat at x=81.1 with text at 92.1; numbered markers sat at x=72.1 with text
   landing between **84.05 and 91.45** depending on the width of the typed
   number, and wraps at 92.1, so no first line aligned with its own wrap and
   item 10 sat 7.4pt right of item 1 in the same list.
2. **Tables had 10.1pt above and 29.4pt below**, and 63.1pt below the section 15
   table because the callout was preceded by two stacked empty paragraphs.
3. **Sub-headings had 5.7pt above, the same as body**, against 11.6 for a
   heading. Three levels of hierarchy, two of spacing. Two paragraphs affected.
4. **Lists did not close:** 3.2pt from last item to the next paragraph, against
   5.7 between paragraphs.
5. A second numbering definition, Word's default at `left 720 hanging 360`,
   defined and referenced by nothing.

**All five fixed.** Numbered lists became real Word lists on a new decimal
definition at `left 560 hanging 380`, chosen so the marker lands at 180 twips,
the same column as the bullets, and the 380 hanging clears `10.` so a two-digit
item cannot push its own text. After: **markers all at 81.1, text all at 100.1,
wraps at 100.1.** Tables now 21.1 above and 21.4 below. Sub-headings 12pt above,
between body's 7 and a heading's 20. List endings 7pt. Dead definition deleted.

**One thing had to be added back:** Word merges adjacent `w:tbl` elements, so
removing every spacer left the section 15 table and the callout touching. A 1pt
separator paragraph carries the gap without a line of its own.

Verified after: 12 pages, Appendix A on 11 and B on 12 so the one-page claim
holds against the render, fonts embedded and subsetted, zero leftover manual
indents, zero leftover typed numbers, 53 list items in both variants.

**Licence, checked properly because the first reading was wrong.** Clause 03
explicitly permits PDF embedding and unlimited distribution of the resulting
PDFs, and all thirteen font files carry `fsType = 0x0000`, Installable
Embedding, the least restrictive setting. **So the PDF should stay unencrypted**;
"secured, read-only mode" is satisfied by the subsetted embed, and encrypting
would cost screen-reader access for no licence benefit. Clause 02's ban on
transmitting the font "in font serving or for font replacement by means of
technologies such as EOT, Cufon, sIFR" reads like a ban on self-hosting, and is
not: clause 01 grants use in Web, and the download ships a `CHILLAX/WEB/` folder
whose README gives step-by-step self-hosting instructions. **The post-launch plan
to put fonts in `public/` stands.** Accepted caveat: a file in `public/` is
hotlinkable. Plus Jakarta Sans is OFL.

**Gate 2 finding.** `vercel.json` rewrites `/(.*)` to `/index.html`, and Vercel
serves `public/` before applying rewrites, so a file that exists serves and a
file that does not **returns 200 with `text/html`, never 404**. Confirmed on the
dev server: the `.docx` returns 200 and 21437 bytes matching disk, the
`.pdf` also returns 200 and there is no PDF. So the clean-browser test must
check **content type and file size**, not that the link resolves, and it must run
on `theeditai.co.uk` after the deploy.

**PDF is in `reports/`, deliberately not `public/`.** The content is not final
until the section 12 sentence, the section 5 addition and the section 15 rewrite
are ruled. Every page carries `Last checked 25 Aug 2026`, so the date moves to
the sign-off date and the PDF is rebuilt then. It is the last thing built before
C3, not the first.

**Template review, the three lines Jasmin held.** Both stay unchanged. Section
7's community-none-of-us-belongs-to line is the only exclusion in the list that
names a failure mode rather than a category, and the preamble already invites
deletion, so the risk is bounded by design. Section 11's composite-face sentence
sits under the operative rule as its justification, so an organisation that
finds it strong deletes it and still has the rule. **Section 5's Article 9 list
is clean:** two mentions of Article 9 in the whole file, no `9(2)`, no
inference-of-belief framing, nothing from the governance project. Suggested
addition, one phrase: **trade union membership**, the omitted Article 9 category
this audience is likeliest to hit and least likely to guess.

**Found unasked, section 12.** The paragraph closes on "This is the law, not
regulator guidance" attached to a mechanism that is regulator guidance. The
ICO's own wording: "In most cases, a combination of two of these factors
indicates the need for a DPIA. However, this is not a strict rule." Article
35(1) and 35(3) are the law; the two-factor screening test is the ICO's and is
explicitly not strict. Reads as the governance review's Article 35 correction
over-rotating one step. Jasmin's to rule.

**A5 drafted.** All fifteen verdicts, `reports/2026-08-26-a5-verdict-drafts.md`,
proposals with the reasoning shown against the locked definitions.

**The finding that settles Jasmin's open question:** the existing fifteen do not
clear F2's sector-first test, and it is not marginal. **Not one names a charity,
a trustee, a funder, a supporter or a beneficiary.** Four are written for the
consultancy's buyer (client deliverables, client work). Several are My Stack's
first person singular. The nonprofit tier never appears in a verdict, including
Canva's. Copilot's never names the catch that made it Amber. **DeepSeek is a
public failure row whose verdict reads as a buying case**, closing on frontier
capability becoming a commodity with nothing about data location or training.
So: **merge after the verdict sprint, not before it.**

Drafts run 410 to 676 characters against 265 to 596, mean 331 to 517. That costs
nothing in layout: the verdict renders only inside the expanded panel behind the
`Honest verdict` toggle, so collapsed card height is unaffected.

**Fact error found while drafting:** ChatGPT's column D still reads
`Plus from £16/mo`. The 24 Aug currency re-check established **£20**, and the
£16 came from a third-party comparison site. Recorded then, never pasted.

**The first A5 pass was wrong and Jasmin stopped it. The correction is the
useful part.** Every one of the fifteen had turned into a governance note. Her
words: the verdicts need to be centred on the use of the tools, and this is not
a governance-only website.

**The structural proof.** A ToolCard already renders `Where your data sits`,
`Trains on your content`, `Nonprofit pricing`, the DPIA chip and
`Say this to a trustee`. **Five governance elements.** A sixth in the verdict
makes the card say one thing six times and never say whether the tool is any
good. The drafting notes for pass one contained the right test, that a verdict
must not restate the fields, and then failed it.

**The audit settles it and should have been read on day one.** Its diagnosis was
that the rows carried name, category, status, cost, verdict and url, and that
not one field answered where the data sits, whether it trains on input, whether
a nonprofit tier exists, whether adoption triggers a DPIA, whether it can be
explained to a trustee. **The seven fields were added because the verdict could
not answer those questions.** The audit never asked for the verdict to become
one, and it describes rows like Canva's as otherwise fine. **A5 is an audience
change, not a subject change.**

**The model was already in the Sheet.** Nineteen `my_stack` verdicts in Jasmin's
own voice, and only one is about data governance: Microsoft Copilot, where
governance is the reason to use the tool. Pass one took Copilot's shape and
applied it to all fifteen.

**Identity ruled by Jasmin, 26 Aug: The Edit is a comms resource first, with a
compliance edge.** Placed in `.claude/CLAUDE.md` under project identity, because
that file steers every future session and its absence is what let this drift.
Three slots recorded there: **the axis filters and gates**, **the verdict
recommends**, **the trustee note is the sentence for the board.** Governance
enters a verdict only where a governance fact is the reason to use or avoid that
specific tool, which is Copilot, DeepSeek and HubSpot.

**Two more rulings taken the same moment.** Voice: **first person where it is
evidence Jasmin has earned, second person for the recommendation**; four of the
fifteen carry it. Sector translation: **the job is sector-specific** (a funder
report, an appeal, a board pack, an exhibition text, a supporter's testimony),
**the tool assessment is not re-derived for charities**, because Descript
removing the barrier to captioning is true everywhere.

**Catch, read wider than pass one read it.** The catch is whatever disappoints:
a free tier that is useless, a setup cost, a learning curve, output needing more
editing than writing fresh, an editorial line you should not cross. Sometimes it
is the data problem. Usually it is not. The second pass carries catches like
HubSpot thinking in deals rather than donations, Adobe being worthless to a team
with nobody who can drive it, ChatGPT telling you your appeal copy is strong
when it is not, and Descript making it far too easy to reshape a beneficiary's
testimony by deleting words from a transcript.

**Second pass written, same file.** `reports/2026-08-26-a5-verdict-drafts.md`
now holds the settled spec, the record of what pass one got wrong, and fifteen
use-led drafts. **Length note, flagged rather than fixed:** originals averaged
331 characters, pass one 517, pass two 534. So the rewrite fixed the subject and
not the length. Jasmin's own `my_stack` verdicts run to this length, and the
verdict renders only inside the expanded panel, so it costs nothing in layout.
A tighter pass toward the originals' punchier register is available if she wants
it.

**Card architecture reopened by Jasmin, and it found the biggest hole on the
site.** Full proposal at `reports/2026-08-26-toolcard-restructure.md`.

**The card has no step one.** Jasmin's journey is explore the tool, understand
the governance risk, take action. The only element that says what a tool is for
is the verdict, at the bottom behind a toggle, so a visitor scanning the grid
never learns what any of these things are. **The slot exists and was never
filled:** `ToolCard` renders a description paragraph but `parseToolRows`
hardcodes `what_it_does: ''`, because the `tools` tab has no such column.
**This is very likely why the A5 first pass drifted governance:** the card's
entire visible surface is governance, so the verdict had nothing else to be.

**"It is a CRM tool."** Same hole from another angle. `jobs` answers which of my
problems does this solve, not what kind of thing is this. Restoring column B is
not the fix; it is stale, and the A3 sheet has HubSpot filed as `Automation`.
The one-line description is the fix and it carries CRM naturally. `my_stack`
already has the column and the right register.

**Grouping correction.** An earlier version of the proposal put nonprofit
pricing in one spec block with data location and trains on input. That groups by
data model. **Nonprofit pricing is a buying fact, the other two are risk facts**,
and the journey splits them.

**Proposed card: three zones.** Name, one-line description, job chips, price and
nonprofit price, then a `RISK` block holding data location, trains, the DPIA
chip and the C4(b) line, then the verdict toggle sharing a row with `Checked`,
then `Visit tool`. **Only one new label renders, `RISK`,** and it is Jasmin's
string; `THE CHECKS` is the alternative and ties the card to the headline claim.
Only the risk zone gets a label, because the rest is self-evident. Thirteen
elements to eight or nine, five coloured regions to two, roughly 190px off a
~490px card, computed rather than measured.

**Chip labels stay unchanged.** An earlier proposal to rewrite all three was
withdrawn: the three states are a prediction, a condition and a precondition, so
the differing grammar follows the meaning, and the new layout gives the long
Amber label room.

**DPIA literacy gap, checked in code.** `AboutPanel` is the only thing on the
site that explains the term and **it renders on the homepage only**, not on
`/tools`. So a visitor arriving from a sector search meets DPIA eleven-plus
times with no explanation on the page. Keep the term, because it is what the
board and the DPO use and it is the field nobody else publishes; add one
definition line above the grid. Draft is in the restructure file.

**C4(b) fires on 14 of 15 cards.** Scoped when Green was expected to be common,
and amendment 4 made Green rare, so a line meant to appear sometimes now appears
nearly always and reads as furniture. Restricting it to Red puts it on 2.

**Add to my stack is not just crowding, it is outranking.** It renders full
width while `Visit tool` is a right-aligned pill, so the secondary action is
styled as the primary one. **Sixth argument for cutting Stack, and it is the
ruling that gates the card work**, because the bottom of the card cannot be
settled while an unresolved feature sits in it.

**Verdict sector rule, after Jasmin flagged over-reference to funder reports and
appeals.** Counted: appeal in 5 of 15, funder report in 2, six of fifteen carry
funder, appeal or board pack. Two rules fix it. **The sector example comes from
the row's own `jobs` values**, which two drafts currently contradict: Adobe
Express is tagged Social and Case studies but says appeal and funder report,
ChatGPT is tagged Research, Translation and Accessibility but says appeal copy.
**And keep the detail only where the advice would change for a non-charity.**
Deals rather than donations earns it; the image going in an appeal does not. On
that test **four of the fifteen need editing and eleven do not.**

**Two rulings taken 26 Aug, late.**

**1. Build Your Own Stack is CUT.** Jasmin's ruling. Scope of the cut, all
subtractive: delete `src/pages/Stack.tsx` (401 lines),
`src/components/StackBar.tsx` (237), `src/components/StackTooltip.tsx` (86) and
`src/utils/slugify.ts` (24, no other consumer). Strip the stack machinery from
`Tools.tsx`: three localStorage keys, five state blocks, three dismiss handlers,
`toggleStack`, both `?stack=` effects, the `matchedSharedTools` memo, the mobile
banner, and **the entire `hasStackParam` branch that duplicates the grid
section**, which is what makes `Tools.tsx` a materially simpler file
afterwards. Remove the add control and coachmark from `ToolCard`. Point
`/stack` at `/tools` with the same `Navigate replace` pattern `/subscribe`
already uses, so indexed and shared links land somewhere real. Roughly **950
lines and three files gone**, and **no new copy is needed**.

What the cut also closes, without anyone having to do it separately:

- **F2b is moot.** Shared `?stack=` links dropping incomplete rows stops being
  a decaying property because the links stop existing.
- **The `StackBar.tsx:55` www bug is moot.** It built the share URL as
  `https://www.theeditai.co.uk/stack`, taking a 308 hop since the 22 Aug flip.
- **All three visitor-facing em dashes on the branch go**, at `Stack.tsx:44`,
  `Stack.tsx:49` and `StackBar.tsx:207`. None had been through the
  approved-strings process.
- **One of the five known AA contrast failures goes**, StackBar text on
  periwinkle at 2.75:1.
- **A design-system violation goes.** StackBar painted itself periwinkle
  `#7B7FD4`, which is reserved for the homepage hero.
- **The card's bottom resolves.** `Visit tool` becomes the only CTA, so the
  secondary action stops being styled as the primary one.

Accepted cost: the approved B4(b) `/stack` title and description are spent.
That is the whole loss.

**2. F2c: always wrap.** Jasmin took the recommendation. Delete the
`scrolled ? "" : "sm:flex-wrap sm:overflow-visible"` conditional so the rail
wraps at `sm` and up in both scroll states. One conditional, no copy, no axis
amendment, **38px of vertical cost in the compact state**, and nothing is ever
hidden behind the gradient again. **F2c closes on the code job.**

**ChatGPT's price corrected in the Sheet** by Jasmin the same session, from the
third-party `£16` to the sourced `£20`.

**The fifteen `what_it_does` descriptions are signed off and pasted** into a new
column N. Nothing renders until `parseToolRows` stops hardcoding the field
empty, which is two lines mirroring `fetchMyStack`.

**All three card copy calls approved 26 Aug** and banked as a third copy pack,
`reports/2026-08-26-copy-pack-card-restructure.md`: the zone label **`The
checks`** rendered uppercase like the job chips, the DPIA definition line for
above the grid, and **C4(b) restricted to Red**, taking it from 14 cards to 2.
`The checks` won over `Risk` because the site's headline claim is that no tool
appears until it has been through them, and because `Risk` would mislabel its
own contents: `Where your data sits: US` is a fact, not a risk. The Amber
counter-argument on C4(b) is recorded in the pack rather than lost.

**The hero pills label, RULED 28 Aug: approved as drafted** — `Everything I
run. The directory below is a shorter list.` Source (`my_stack`) and the label
are both settled; the cap raise (18 to 30 plus a mobile cap) is the remaining
code job.

**Next:** the code session now has everything it needs for the card restructure,
the Stack cut and F2c. Still outstanding: the radar and pills rulings, Jasmin's
editing pass on the fifteen verdicts, and the template's section 12 and section
5 calls. C3 and Gate 2 remain the merge blocker and are Jasmin's alone. Then Jasmin's editing pass on the
verdicts, the radar and pills rulings, the template's section 12 and section 5
calls, then one code session takes the lot.
C3 and Gate 2 remain the merge blocker and are Jasmin's alone.

### 2026-08-25 (Cowork: rulings, C1 v2, C2 built, C3 drafted)

No code changed, nothing committed to `src/`. Four files written to `reports/`.

**Sheet verified directly before anything else, two Drive reads.** 67 rows in
`tools`. 4 complete, 12 at five of seven, 5 at three of seven, 2 at two of
seven, 44 empty across G to M. The twelve are missing K and L only and all
twelve already carry `last_checked` of 24 Aug 2026: HubSpot, Adobe Suite,
Adobe Firefly, Perplexity, NotebookLM, ElevenLabs, Descript, Claude, Gemini,
Google Workspace AI, Wispr Flow, Notion AI. The 24 Aug ledger line is exact.
Twelve flags and twelve notes takes the grid from 4 to 16 and clears the
ten-row floor with six to spare. Method caveat: both reads returned
byte-identical exports, consistent with a true read and also with one cached
response served twice.

**Rulings taken.**

1. **`None` versus blank in `nonprofit_tier`: record `None`** for Granola,
   Ideogram, Gamma, Grok and Seedance. The asymmetry that settles it is that a
   nonprofit tier is a customer-acquisition asset vendors advertise, so silence
   is near-conclusive, whereas silence on a training policy serves the vendor.
   An evidence standard goes into the axis file: nothing on the vendor's
   pricing, nonprofit or education pages, and nothing via TechSoup or Charity
   Digital Exchange. Note these five sit at three of seven, so this unblocks
   nothing on its own.
2. **`trains_on_input` gains `Unclear`.** Costs no code, verified in
   `sheets.ts`: `passesTrainingToggle` is an allowlist of `No` and
   `No by default`, so `Unclear` fails the toggle automatically, and
   `isComplete` only tests for non-empty. One line in the axis file. Mirrors
   `data_location`, where `Unclear` is already a published value and a warning
   in itself. Unblocks Submagic and Blotato.
3. **Trustee notes may be drafted by a session, with Jasmin supplying the
   flag.** Refined mid-session by a real finding: **the four entries already in
   column L are verdicts, not trustee notes.** Canva's runs four sentences and
   recommends hiring a brand designer; ChatGPT's and Copilot's are first person
   singular; none is the single first-person-plural sentence the axis
   specifies. Pattern-matching off them would have produced twelve more
   verdicts under a card label reading "Say this to a trustee". Two worked
   extractions approved instead, both pulled out of Jasmin's own existing text:

   > We use Copilot for anything sensitive because it keeps our data inside our
   > own Microsoft tenancy, and we've turned web search off so nothing we type
   > goes out to Bing.

   > We don't put anything about a real person into DeepSeek, because it trains
   > on what we type unless we turn that off and it's processed outside the UK
   > and EU.

   Plan: ten new notes plus four rewrites, with the long originals moved to
   column E as verdict text so nothing written is lost. **Blocked on the twelve
   flags, which remain Jasmin's alone.**
4. **Microsoft Copilot goes Amber**, with the nuance in the trustee note rather
   than the chip. Checked against Microsoft's current documentation rather than
   memory, and it is narrower than the framing suggested: the prompt does not
   go to Bing, Copilot generates a condensed few-word query from it, and
   Microsoft states plainly that the DPA, HIPAA and the EU Data Boundary do not
   apply to those generated queries. Web search is on by default in commercial
   tenants, disabled via the Cloud Policy "Allow web search in Copilot" setting
   or a per-user toggle. Named cost of Amber: Copilot is probably the most-used
   AI tool in this audience because of charity M365 licensing, so the
   "DPIA unlikely" toggle now excludes the tool most readers already have.
5. **C2 format and brand: The Edit's cobalt and Chillax, `.docx` primary with a
   PDF secondary.** The PDF question came from Jasmin and improved the answer.
   Once the PDF carries the proof job, the `.docx` no longer has to, so its body
   font can be chosen purely for reliability at no cost.
6. **F2a: the cascading hero pills are decoration, deliberately.** Jasmin's
   ruling, and it beats both options that were offered. Not a checked claim, and
   the drag interaction stays. Consequence found in code: the pills currently
   filter `tools` on `status === "in_stack"` (19 rows) while the
   "What I'm running" strip below already reads the separate `my_stack` tab
   (19 rows, growing to about 27 once A3's eight dev rows land there). Point
   both at `my_stack`: one Sheet-editable list, a count that grows rather than
   thins, and permanent immunity from the directory counter because My Stack is
   a personal claim by definition. `in_stack` in `tools` then means only
   "render the badge", which is what CLAUDE.md already says it does.

**Radar: RULED 28 Aug, own tab, before merge** (see the ruling above). Still
open: confirmation that the ceiling of 45 counts published rows.

**C1 done, v2 at `reports/2026-08-25-ai-use-policy-template-v2.md`.** The 22 Aug
draft is untouched as the audit trail. Four changes plus a closing block. New
section 10, How people learn this, built from Jasmin's own published position on
training rather than a generic commitment: the event is not the thing, so the
section commits to induction, the arrival of a new tool as the training moment,
somewhere to ask, and a check-in already in the diary. Section 7 now carries a
real list of eleven exclusions rather than six bracketed blanks. Section 6
gained a retention block covering chat histories as records. New section 11
covers images, rights and attribution. Old sections 10 to 13 shift to 12 to 15
and the one moved cross-reference is fixed. Section 13 lost its induction
sentences and its AI-images bullet, both now owned properly elsewhere.

**Three lines in v2 flagged for Jasmin, deliberately not resolved.** The
"community none of us belongs to" exclusion and the "composite face in a
fundraising appeal is a lie about who we serve" sentence are both more
opinionated than their neighbours. And section 11's "UK law does not clearly
grant copyright in a wholly AI-generated image" is the only genuine legal claim
in a document that says it is not legal advice. It is defensible because of
"clearly", since CDPA section 9(3) exists and whether it survives contact with
modern generative AI is exactly what is contested, but it is the line a lawyer
would poke.

**C2 built, two variants.** `reports/AI-Use-Policy-Template.docx` (Calibri, the
one subscribers download) and `reports/AI-Use-Policy-Template-brand-fonts.docx`
(Chillax and Plus Jakarta Sans, the one Jasmin exports the PDF from on a machine
that has the fonts). Eleven pages. Lime rule over the cobalt title, cobalt
headings and bullet markers, `#EEF0FB` table headers, `#E8E2D8` borders, the
"If you get stuck" block as a cream callout with a cobalt left rule, Appendix A
on its own page as a one-page form with fill-in-height rows. Footer on every
page carrying Jasmin's name and both URLs.

**Font finding.** Chillax and Plus Jakarta Sans are both webfonts loaded from
CDNs (`index.html` line 39 pulls Chillax from Fontshare); there are no font
files anywhere in the repo, and both CDNs are blocked from the cloud sandbox, so
a brand-accurate PDF cannot be rendered here. Hence the two-variant split.
**Unverified: whether Chillax is actually installed on Jasmin's Mac.** If Word
substitutes there too, the brand-font variant is useless and the PDF becomes the
safe variant exported. Post-relaunch option worth noting: putting both font
files in `public/fonts/` would fix this permanently and drop two CDN
dependencies off the live site, which is the same class of availability risk as
the Lovable registry mirror already on the books.

**C3 drafted, banked at `reports/2026-08-25-copy-pack-c3-substack.md`, marked
draft rather than approved.**

**The C3 finding.** `/policy-template` links `SUBSTACK_SUBSCRIBE_URL`, the
subscribe page, not a post, and the placed copy reads "Subscribe and you'll get
the link straight away". So the thing that actually delivers the template is the
**Substack welcome email**, not the post. C3 is two pieces of copy, not one, and
a welcome email that never gets configured fails silently: the site looks
correct right up until a real person subscribes. Both pieces are drafted. No
cadence is promised anywhere in either, deliberately, because D3 is still open.

**Open C3 decision: where the files live.** Attached to the gated post means the
reader must be logged into Substack, which loses the subscriber who taps the
link on a phone. Public URLs on theeditai.co.uk (`public/`, served by Vercel)
linked straight from the welcome email makes the subscribe itself the gate.
Recommendation is the second, links in both places, accepting that the file
could be hotlinked.

**Deliberately deferred by Jasmin: the final review of the template.** Not read
line by line this session, on the reasoning that changes are likely anyway. It
goes into one final check before launch alongside the C3 copy.

**Code jobs this session created, none of them started.** Point `HomeGravity` at
`my_stack`; add `Unclear` to the `trains_on_input` comment in `sheets.ts` (no
logic change needed); a label string near the hero pills, which needs Jasmin's
copy first; put both template files in `public/`.

**Governance sense-check run, and applied. v3 at
`reports/2026-08-25-ai-use-policy-template-v3.md`.** Jasmin ran both documents
through her AI governance Cowork project against a prompt written in this
thread. Twenty-nine findings, sourced. Fourteen applied to the template, three
to the C3 copy. The `.docx` pair was rebuilt from v3: twelve pages now, and
Appendix A still fits on one, so the one-page claim holds.

**Verification done here before applying finding 5.** The reviewer flagged that
legislation.gov.uk had blocked its fetch, so the CDPA wording came from
secondary sources. Re-checked: section 178's definition of computer-generated
came back verbatim from legislation.gov.uk and matches; section 9 is
robots-blocked there, but an independent legal source confirms the section 9(3)
wording exactly, confirms it is in force though rarely relied on, and adds that
a prompter is unlikely to qualify as the person making the arrangements unless
the input is detailed enough to be expression rather than idea. The March 2026
Copyright and AI report and its proposal to remove section 9(3) are corroborated
across several independent firms.

**The substantive corrections.** DPIAs are an Article 35 requirement, not "an
ICO requirement", and the "often" now carries its mechanism (innovative
technology plus a second risk factor, which this sector nearly always supplies).
The tier ladder in section 6 was organised by plan name when the thing that
actually varies is the Article 28 written contract, so tiers 1 and 2 now say
so; that was the sharpest structural finding in the review. Section 14 gained
the 72-hour clock running from awareness, the Article 34 duty to tell the people
affected, and **a serious-incident report to the Charity Commission, OSCR or
CCNI**, which was the biggest sector-specific gap and the only place in the
document where the three UK charity regulators matter. The gate went from eight
questions to ten, adding the data processing agreement and whether a subject
access request could be answered from the tool at all. Section 9 went from three
questions to five, adding connector scope and logging, both of which section 2
had already set up as risks and the check had omitted. The ICO registration line
is now bracketed as a choice, because the not-for-profit fee exemption means it
is often untrue for this audience. Section 11 names section 9(3) and the
Government's proposal to remove it, and the loose "we may not be able to stop
anyone else using it" clause is cut.

**Two things held back for Jasmin, deliberately.**

1. **Provenance.** Finding 22 imported framing from the AI GOVERNANCE project
   (the Article 9 and 9(2)(d) analysis in the Deployment-Edge Primer), flagged
   by the reviewer as instructed. Only the plain Article 9 list went into the
   template, which is standard UK GDPR. The intends-to-infer-belief nuance was
   **not** carried across. Jasmin confirms that line.
2. **A placed approved string overclaims.** `/policy-template` lists "When a
   DPIA is needed" among what the template covers. The template asks that
   question rather than answering it, which is the same overclaim the review
   caught in the Substack post. Changing placed approved copy needs Jasmin's
   sign-off, so it is flagged, not fixed. Suggested replacement, unapproved:
   `How to work out whether a DPIA is needed.`

**One judgement call made rather than asked:** the connector review default
moved from `[ANNUALLY]` to `[QUARTERLY / TWICE A YEAR]` to match section 10.
Easily reverted.

**Findings not taken, consciously:** output that infringes a third party's
rights (the style and supplied-material clauses cover the behaviour that causes
it), abuse-monitoring and retention continuing regardless of the training toggle
(too deep for this document), and a lawful basis section (the reviewer agreed it
belongs in the data protection policy, not here). The three-versus-five framing
inconsistency is not an error: the three are what governance is, the five are
what the policy sets up.

**Currency infrastructure assessed and started, logged as E8 and E9 in the
handover.** Dependency register built at
`reports/2026-08-25-template-dependency-register.md`. Eighteen clauses, each
mapped to its source and marked dated or wrong. Key finding: legislation.gov.uk
is unreachable to automated fetching from here on every route tried, so the two
clauses that can become wrong rather than dated cannot be agent-watched at all,
and the quarterly human pass is the only control on them. ICO fetches cleanly
and independently confirmed the §12 mechanism. Assessed as **E2 with a second
watchlist rather than a new build**. Register and currency line pre-launch,
change detector post-launch.

**Three axis amendments taken, recorded in `reports/2026-08-23-axis-locked.md`
under a new Amendments section.** `trains_on_input` gains `Unclear` (no code
change, the toggle is an allowlist). `nonprofit_tier` gains an evidence standard
for `None`. `jobs` gains **`Research`, placed first in the list.**

**Why `Research` was forced, from the data rather than from taste.** Job tags
across the 23 published rows: Internal comms 11, Case studies & storytelling 11,
Social 7, Accessibility 5, Appeals & fundraising 2, Translation 1. Two generic
categories carried 22 tags; the two sector-specific ones carried three. Case
studies & storytelling had become the catch-all, and Perplexity and NotebookLM
were in it only because there was nowhere else. Jasmin spotted it from the rows,
not from the numbers.

**F2c is reopened and is now blocking, not downgraded.** `CATEGORIES` holds
`ALL` plus six jobs, which is the seven chips measured at 1470px with
`Translation` ending 30px inside the rail. An eighth chip very likely clips at
1470 and almost certainly at 1366. Adding `Research` did not create the problem;
it removes the option of ignoring a measurement that was owed since 24 Aug.
Needs the dev server running on Jasmin's Mac at a narrow width.

**A4 re-checked on the two Adobe rows, at Jasmin's prompting, and she was right
that they could not both be true.** Written up at
`reports/2026-08-25-a4-adobe-recheck.md` with sources. Adobe's own help pages
settle the training question: no generative AI training on customer content at
all, and content analysis for product improvement is a separate thing that is
on by default for personal accounts and **automatically off for business, team
and school accounts**. Buying-tier rule therefore gives `No` on both rows. The
personal-account default belongs in the verdict as a real catch.

**Two things the re-check did not settle, both material.** Data location is
unsourced on both rows: the `EU` on Adobe Suite has no source this pass could
find, and an unsourced `EU` is worse than an honest `Unclear` because it is a
false reassurance on the axis the site is built on. Proposed `Unclear` on both
pending a source. And the Firefly row's nonprofit tier describes Adobe Express,
not Firefly, because nobody buys Firefly standalone. **Proposed to Jasmin:
rename the rows to `Adobe Creative Cloud` and `Adobe Express`**, keeping them
separate because the two nonprofit routes genuinely differ.

**Flagging paused deliberately.** Jasmin's five edits turned out to be fact and
taxonomy problems rather than flags, and flagging on top of unsettled facts
would bake errors into the one field nobody can quietly correct later. The
twelve go back to her once Adobe and the job retags land.

**ELEVEN FLAGS AND FIFTEEN NOTES LANDED. The grid renders 15.** Verified
against the real completeness predicate rather than the paste: 15 complete rows,
no invalid job values, no non-canonical `dpia_flag`, every `last_checked` in
`DD MMM YYYY`. Flags: 2 Red, 12 Amber, 1 Green.

**The rule changed to get here, and Jasmin took it deliberately.** She extended
the drafting permission from trustee notes to the DPIA flags themselves, on a
draft-for-sign-off basis. Every flag was proposed with its reasoning shown
against her own locked definitions so what she signed was auditable rather than
handed down. **The standing rule is now: a session may draft flags, notes and
verdicts as proposals; nothing reaches the Sheet without Jasmin's explicit
sign-off.** That is a real loosening of the original absolute and should be read
as such by later sessions.

**Amendment 4 to the axis, and it decided eleven rows at once.** "Used as
directed" in the Green definition means the tool **as it arrives, in default
configuration**, not as a competent admin would configure it. Recorded in
`reports/2026-08-23-axis-locked.md`. Consequence accepted rather than
discovered: Green is rare, the `DPIA unlikely` toggle returns one row, and the
better-configured story lives in the trustee note. Microsoft Copilot moved
Green to Amber on this ruling.

**Two more A4 fact corrections, both on the axis the site is built on, both
found by Jasmin questioning a row rather than by any check.** Adobe: two rows
that could not both be true, resolved at
`reports/2026-08-25-a4-adobe-recheck.md`, renamed to `Adobe Creative Cloud` and
`Adobe Express`, both to `No` on training (Adobe does not train generative AI on
customer content at all; content analysis for product improvement is a separate
thing that is off by default for business accounts), both to `Unclear` on
location because the previous `EU` had no source. Google Workspace AI:
`Unclear` was a false negative, corrected to `Your tenant` with sources at
`reports/2026-08-25-a4-workspace-ai-recheck.md`, which is what makes it the
single Green row.

**Evidential rule established, worth keeping.** A boundary case takes the
cautious side. An *undocumented* case does not automatically take the cautious
side by analogy to a documented one. Copilot went Amber on a sourced exception;
Workspace AI stays Green on a sourced containment claim with no sourced
exception, and the open question (does Workspace Gemini ground against the
public web by default, and is that inside the CDPA) is recorded for the
quarterly pass.

**Jasmin's four original column L entries preserved** at
`reports/2026-08-25-preserved-column-L.md` before they were replaced. They were
verdicts, not trustee notes, and column E already held real verdicts on all four
rows, so they could not simply be moved. They are source material for **A5**,
which is hers and has not started.

**Two things this unblocks.** F2's ten-row floor is cleared with five to spare.
And **B3 item 8 is finally testable**: proving the in-grid template card sits
after the sixth tool card needed seven complete rows and there were four. B3 can
close at ten of ten rather than nine.

**Stale check to fix before anyone re-runs the B3 list:** item 1 reads "the grid
shows exactly the complete rows and Descript does not appear." Descript is
complete now and should appear. Read literally, a pass would now be recorded as
a failure.

**Next:** the radar ruling, the three copy calls, the template's final review,
then C3. F2c's rail measurement is blocking and needs the dev server.

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

**Correction, 25 Aug, recorded because it was asserted as fact and repeated into
the handover.** The homepage "What I'm running" strip did **not** read the
`my_stack` tab. `Index.tsx` filtered the same `tools` array on
`status === "in_stack"` for both the strip and the gravity pills, and
`fetchMyStack` was called only by `MyStack.tsx`. Caught when the code session
opened the file. The strip still reads `tools`; only the pills were moved.

**Closed 2026-08-28, commit `20f722a`.** The strip now reads `my_stack`, on
Jasmin's ruling in the 28 Aug positioning statement, so the claim that was
false when it was made is now true. `fetchMyStack` was already called and
already in state for the pills, so this was a source swap, not a new fetch.
Rows are taken in sheet order, not featured-first: `my_stack` carries a
`featured` boolean that `/my-stack` sorts on, but no ruling covers the strip,
so that ordering stays open.

### 2026-08-28 (Cowork session: batch-two sign-off, template pass, C3 copy, rulings, Sheet paste)

**All 23 axis-track rows (fifteen A5 + eight batch-two) pasted to the Sheet by
Jasmin tonight.** Verified directly by reading the live Sheet via the Drive
connector rather than trusting the report: spot-checked Blotato, Granola,
Grok and Seedance against the signed-off values. All four correct, including
the two flags that moved from drafted Red to Amber (Granola on the Wispr Flow
precedent, Grok on the ChatGPT precedent) and Grok's rewritten verdict, which
was the one row where a stale draft could easily have been pasted by mistake.
This closes the axis track's whole remaining blocker: "Jasmin's judgement
work" from the 24 Aug handover is now done for these 23 rows. Four rows from
the original twelve (see `overhaul-state.md`) are still undrafted.

**Found on the live Sheet, not yet a problem, will be:** Blotato and Grok
both still carry `on_radar` in status column C from before tonight. Harmless
now, since `isComplete()` on the seven axis fields drives the grid, not
status. But the radar ruling below means the next code session needs to
either sweep every complete row off `on_radar`, or make the radar/tools split
key off completeness rather than trust the stale status column.

**Two rulings taken tonight:**
- **Radar: own tab, before merge.** Reasoning on record since 25 Aug: 19.1KB
  of unpublished verdict copy currently ships to every visitor; an uncapped
  radar list sharing a tab with the capped published one is how the 45-row
  ceiling erodes; costs no code, the A3 sheet already has the sort.
- **Pills label: approved.** `Everything I run. The directory below is a
  shorter list.` Source (`my_stack`) already in code as of today (`20f722a`).
  Outstanding code job: raise `MAX_PILLS` from 18 to 30, add a mobile cap.

**Template (`2026-08-25-ai-use-policy-template-v3.md`) closed out.** Trade
union membership added to §5's Article 9 list. §12's false "this is the law,
not regulator guidance" sentence deleted. §7's exclusion line lightened to
"Speaking for a community that isn't yours to speak for." §11's composite-face
and copyright lines approved unchanged, the copyright claim (CDPA s9(3), the
March 2026 Copyright and AI report) re-verified live and holds. §14 found and
fixed: it named OSCR's "notifiable events" process, retired 1 April 2024 and
replaced with a "raise a concern" report — wrong since before the document
was even drafted, not a future drift risk. Dependency register
(`2026-08-25-template-dependency-register.md`) now carries a live, dated
source URL for all eighteen legal claims in the template, not just names.

**C3 copy approved, not published.** Post and welcome email in
`2026-08-25-copy-pack-c3-substack.md` stand as drafted. Deliberately NOT
placing the docx/PDF in `public/` or touching Substack tonight: those files
predate tonight's template edits and would ship stale content under a
live-looking URL. That's item 6 (date stamp, PDF rebuild, files to
`public/`), a later session, and publishing/welcome-email configuration wait
for the merge so no real subscriber can hit a broken download link in the
gap. The `/policy-template` DPIA overclaim ("When a DPIA is needed") is the
same issue the post draft already fixed — left alone tonight on Jasmin's
call, flagged for whenever that placed string gets touched.

**Supabase subscribers table:** export-then-delete ruling stands from 28 Aug
(see `standing-decisions.md`), but execution didn't happen tonight. Jasmin
believes it's already empty; unconfirmed — the connector couldn't reach the
paused project (three attempts, connection timeout). Not urgent: the write
path was removed from `src/` on 22 Aug, so nothing new can have landed
regardless.

**og-image.png:** still not started (handover B5). Parked again tonight.

---

## Session 2026-08-31 (second) — the fortnightly axis audit, and the write path

**Where we got to.** The audit ran end to end and, for the first time, wrote.
The 30 August run could only report because no write path existed. There is one
now, and it is committed but not pushed.

**Nine cells written and live** (a Sheet edit is public in seconds, no deploy):
`tools!M27`, `tools!A40`, `tools!F40`, `tools!M40`, `tools!M61`, `learning!I2`,
`learning!I3`, `my_stack!A12`, `my_stack!E12`. Verified in the Sheet by re-read
and then on production: `/tools` renders 23 cards naming Gemini Notebook, no
`notebooklm.google.com` link survives anywhere, and `/learning` carries both new
`academy.claude.com` URLs with no dead `anthropic.com/academy` link.

**No vendor position moved.** No `data_location`, `trains_on_input`,
`nonprofit_tier` or `cost` changed on any of the 23 published rows. Canva's
policy republished the day after its stored check, and the archived pre-update
version diffs word for word identical on the data-location and training clauses.

**Undo the whole run with:**
`node scripts/sheet-write.mjs reports/2026-08-31-axis-diff.json --rollback --commit`

**Two commits, NOT pushed:** `84b1896` (write path) and `aacbf85` (audit).
Note before pushing: a parallel session committed `878bafd` to this branch
mid-run, touching `.claude/CLAUDE.md` and `tasks/lessons.md`, so a push carries
three commits and that one is unreviewed by this session. This clone also has no
remote-tracking refs for the branch or main, so the real gap to origin is unknown
until someone fetches.

### Next step

1. **Push, once `878bafd` is ruled on.** `git fetch` first to see the true gap.
   Pushing to main puts all three live in about three minutes.
2. **The six judgement items**, in `reports/2026-08-31-axis-audit.md` section 1.
   Biggest is the **Gemini Notebook trustee note** (`tools!L40`), which still
   names NotebookLM though its substance holds and was reconfirmed verbatim.
   Then Windsurf (row 16, URL serves Devin Desktop), Smartmockups (tools 35 and
   design_kit 42, folded into Canva), GradeMyPrompt (learning 15) and Nano Banana
   (tools 32) whose products are gone, and the two `learning` row names, which
   are stale and carry em dashes.
3. **Rule the `Unclear` conflict.** The audit spec's legal set for column I omits
   it; the axis lock and `.claude/schema.md` include it, and rows 5 and 47 use it
   today. `scripts/sheet-write.mjs` refuses it until ruled.
4. **Adobe rows 28 and 29 cannot be reached from this machine at all** — four
   attempts across three methods, `ERR_HTTP2_PROTOCOL_ERROR` and curl timeouts
   with zero bytes. Both sit inside the "Doesn't train on your content" filter,
   so this is the site's strongest claim with two rows behind it the pipeline
   can no longer verify. Needs a different route before the 14 September run.

### Standing state for the next audit

- `reports/axis-policy-urls.json` is the row-to-policy map Pass 1b needs, 23
  rows, 36 URLs, with baseline dates and two recorded traps (Google's double
  date, and Canva's `/policies/*`-serves-while-`/en_gb/*`-blocks split).
- Credential: **no key file, and there should not be one.** The org enforces
  `iam.disableServiceAccountKeyCreation`. Run writes as:
  `SHEETS_SA_IMPERSONATE=the-edit-audit@the-edit-490220.iam.gserviceaccount.com`
- The whats_new Apps Script is **not** a usable write path for `tools`, and
  should not be made into one. Separately worth noting on the security queue: its
  `doGet` returns the entire `tools` tab, unpublished rows and draft verdicts
  included, to anyone with the URL and no authentication at all.
