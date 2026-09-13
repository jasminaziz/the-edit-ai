# The Edit homepage, first-viewport "after" pass (site map build, branch `design/site-map`)

Written 13 September 2026. This is the companion to
`reports/2026-09-13-stranger-first-viewport-baseline.md`, taken after step 1
(checks line), step 2/2b (`?job=` and rail spacing), step 3 (nav and hub) and
step 4b (hero) landed, and with step 4a (homepage rebuild) dropped by Jasmin's
ruling in `build-plan.md`, "Rulings, settled 13 September 2026". Same method,
same two widths, same six questions, so the two reports read side by side.

**Method.** No live fetch (client-rendered site, branch not live; a fetch
would return `<div id="root">`). Judged from two screenshots taken by this
session on 13 September 2026 from the branch on the local dev server (cold
load, fonts loaded, pills settled, viewport asserted) and
`scratchpad/step0-after/measurements.json`, against the equivalent baseline
screenshots and `baseline-2026-09-13-measurements.json` kept at
`~/Developer/the-edit-ai/.superpowers/site-map-boards/cap/`. Every claim below
is cited against one of those four sources. Where a claim cannot be settled
from a still image, it is named as such, not assumed.

**The reader, unchanged from the baseline, for reference against every answer
below.** A comms officer or manager in a charity, cultural organisation or
heritage body, often a team of one. Not shopping for AI tools, short of time.
The profile states plainly that the first screen belongs to the least
confident version of her.

---

## Mobile, 390x844

Confirmed settled: `rafIn500ms` 31, `finalDrift` 0, 7 settle rounds (identical
to baseline). Hero height 500px (baseline: 500px). Page length 2,139px
(baseline: 2,139px). Every `firstY` value in `measurements.json` at this width
is identical to the baseline file, character for character, and the two
screenshots (`home-first-viewport-390.png` against
`baseline-2026-09-13-home-390.png`) show the same page in the same order at
the same scale. This is by design, not an omission: step 4a (the homepage
rebuild) was dropped, and step 4b's hero change was scoped to desktop only,
with "portrait phones unchanged" stated explicitly against measurement in the
build-plan's step 4b row.

### 1. The five-second test, first viewport only

**What is this / who's it for.** Unchanged from baseline. The sector
sentence, "The Edit is my opinionated directory of AI tools for comms teams
in charities, cultural organisations and heritage...", still first appears at
y=605 (`measurements.json`, `firstY.charity`/`firstY.heritage`, both 605),
inside the 844px viewport but the fifth thing on the page, after an unopened
menu, a two-line wordmark with no descriptor, "Drag me" and sixteen unlabelled
brand pills.

**What can I do here.** Unchanged. Nothing actionable sits above y=844 beyond
the unopened "Menu" (y=21) and "Drag me" (y=275). "Browse tools →" is still at
y=1758, "Get the template →" still at y=1969 (both identical to baseline).

**Verdict: fails two of three, exactly as at baseline.** The audience line is
technically in the viewport but is still buried and unstyled as a value
proposition, and there is still no next step at all in the first screen.

### 2. What she meets, in order

Identical sequence and y-positions to baseline: Menu (21) → wordmark (29/100)
→ Drag me (275) → sixteen pills (340–478, same sixteen names) → "There's a lot
to keep up with in AI. This helps." (520/552) → the sector sentence (605).

### 3. Sector fit and the checks claim

Sector fit: **yes**, unchanged, at y=605 (inside 844).
Checks claim: **no**, unchanged. `firstY.checks` is 866, 22px past the fold,
identical to baseline.
DPIA: absent from the homepage at this width, unchanged (`firstY.dpia`:
`null`, matching baseline).

### 4. Is there a route onward from the first screen

No, unchanged. Only the unopened menu and the "Drag me" toy sit inside the
viewport; neither has a stated destination.

### 5. What a nervous reader makes of the pills and "Drag me"

Unchanged. Same sixteen pills, same mix of consumer AI tools and developer or
analytics infrastructure (Vercel, GitHub, Supabase, Plausible, Resend), same
absence of any label naming them as Jasmin's own stack, a curated set, or
part of a directory.

### 6. Most likely to leave, most likely to stay

Unchanged from baseline in both directions. The same four things (menu,
wordmark, drag-toy, sixteen unlabelled logos) sit ahead of the one sentence
that speaks to her sector, and reaching that sentence still leaves her with
no next step inside the viewport.

**Verdict, mobile: unchanged, and this is a "left alone" result, not a
missed one.** Every measured figure and every visible pixel matches the
baseline. All of the baseline's mobile findings stand exactly as filed. This
was Jasmin's deliberate scope: the phone hero, pill count and section order
were named must-keeps in the 4b ruling, and 4a (the section-reorder that
would have addressed the "buried sector line" finding) was dropped.

**One thing this pass could not check that the baseline also could not.**
The mobile drawer now lists different items behind "Menu" (per the nav
rebuild in step 3: Home, Tools, Template, "How I work" plus, inside the hub,
My Stack, Design, Learning, AI News, per `build-plan.md`'s Rulings section).
None of this is visible in a closed-menu screenshot at either point in time,
so whether the new drawer is an improvement on the old one is still a named
manual check, not a measured finding, in both reports.

---

## Desktop, 1280x800

Confirmed settled: `rafIn500ms` 31, `finalDrift` 1px (rounding), 25 settle
rounds (baseline: `rafIn500ms` 31, `finalDrift` 1px, 25 rounds, matched).
Hero height now **662px**, against 800px (the full viewport) at baseline.
Page length now **1,696px**, against 1,834px at baseline.

### 1. The five-second test, first viewport only

**What is this.** **Now partially answered, where baseline had nothing.**
The sector sentence, "The Edit is my opinionated directory of AI tools for
comms teams in charities, cultural organisations and heritage...", begins at
y=704 (`measurements.json`, `firstY.charity`/`firstY.heritage`, both 704),
inside the 800px viewport. The screenshot
(`home-first-viewport-1280.png`) shows the opening clause, "The Edit is my
opinionated directory of AI tools for comms teams", rendering in full before
the fold.

**Who it's for.** **Now answered**, same sentence, same evidence: "in
charities, cultural organisations and heritage" is fully visible in the
screenshot, on the second line of the paragraph, before the text is cut off
mid-clause after "whether there's a charity" at the very bottom edge of the
frame.

**Caveat on both, because the evidence is right at the edge.** This is the
sixth thing on the page (nav, wordmark, "Drag me", nineteen pills, the "This
helps" heading's first line, then this sentence), and the sentence that
answers both questions sits in the last visible strip of the fold, with the
sentence itself continuing to be cut off mid-word. A production browser's
chrome (address bar, any extension toolbar) eats into the usable viewport
height and was not modelled here; this pass asserts an innerHeight of 800,
not a browser window of any particular real height. A stranger on a slightly
shorter real window, or one who does not read to the very last pixel row of
her screen, will not see it. Fixed in this capture; fragile by margin.

**What can I do here.** The nav at y=23 now reads Home, Tools, Template, "How
I work", plus "Work with me", five clickable items, against baseline's eight
(Home, Tools, Design, Learning, AI News, My Stack, "Get the template →",
"Work with me"). Still a set of choices made before she has read anything,
since the nav sits above the wordmark and the sentence that explains the
site. Nothing here is presented as the one thing to do next; "Template" names
a specific document she has not yet been told exists or why she'd want it.

**Verdict on the five-second test at 1280: passes two of three (what is
this, who's it for), fails the third (one clear next step).** This is an
improvement on baseline's "fails two of three, partially passes the third",
but it does not clear the bar Check 1 sets, which is a "yes" on all three.

### 2. What she meets, in order

1. **Nav bar** (y=23): Home, Tools, Template, "How I work", "Work with me".
   Fewer items than baseline (five against eight) and each one names
   something more concrete; still no subject or audience stated here.
2. **Wordmark "The Edit."** Visibly smaller than baseline: the hero itself
   is 662px against a full 800px viewport, and comparing the two screenshots
   directly, baseline's "t" in "Edit." runs to the very bottom edge of the
   frame, where the after capture leaves clear cream-on-periwinkle space
   below the wordmark before the fold. This matches the build-plan's step
   4b note that the wordmark is now capped at roughly 81% of its old size.
3. **"Drag me"** (y=556, was y=693), moved up because the hero shrank.
4. **Nineteen pills** (y=502–635): the same nineteen tools as baseline
   (ChatGPT, Adobe Suite/Firefly, Canva, Notion, Perplexity, Supabase,
   Vercel, GitHub, Gemini, Lovable, Resend, Granola, Claude, Plausible,
   Google AI Studio, Gemini Notebook, Microsoft Copilot, Google Workspace AI,
   Wispr Flow). Unchanged in count, content, and lack of labelling.
5. **"There's a lot to keep up with in AI."** (y=695), now inside the
   viewport for the first time; its second line, "This helps.", falls at
   y=804, 4px past the 800px fold (`measurements.json`, `below[0]`), so the
   heading is functionally whole but the last three words are, strictly,
   clipped.
6. **The sector sentence** (y=704). See above.

### 3. Sector fit and the checks claim

Sector fit: **now yes**, where baseline was **no**. `firstY.charity` /
`firstY.heritage` moved from 842 (42px below the 800px fold) to 704 (96px
inside it). This is the single clearest fix in this pass.

Checks claim: **still no**. `firstY.checks` moved from 994 to 856. The gap
to the fold narrowed from 194px to 56px, but the sentence "So I check. Every
tool here has been through those checks before it appears..." is still below
the fold and still not part of the first-viewport read.

DPIA: still absent from the homepage at this width. `firstY.dpia` is `null`
in both the after and baseline measurement files. Unchanged.

**A measurement caveat, so it isn't misread later.** `measurements.json`
reports `firstY.template: 23` at 1280 in the after capture. This is the nav
tab literally labelled "Template" matching the search string "template", not
the AI-use policy template offer itself, which still sits at y=1432
(`below`, "Get the AI-use policy template"). Do not read `firstY.template: 23`
as evidence that the template offer moved into the fold; it did not, and the
metric's meaning shifted because the nav changed under it.

### 4. Is there a route onward from the first screen

Same shape as baseline: real, clickable nav items and one CTA pill sit
inside the viewport without scrolling, but none of them is tied to what she
has just read at the very bottom of her screen, so the choice is still made
blind. The set is smaller (five items against eight), which is a real
reduction in how much she has to weigh before clicking, but the fundamental
problem, that clicking anything here happens before the sentence names the
offer, is unchanged.

### 5. What a nervous reader makes of the pills and "Drag me"

Unchanged from baseline. Nineteen unlabelled pills, same mix of consumer AI
tools and developer or analytics infrastructure, no legend, no stated
relationship to "the checks" the site's name for its own process.

### 6. Most likely to leave, most likely to stay

**Most likely to leave.** The nav still asks her to choose before reading,
and the pills are still unexplained. But the specific baseline finding that
"neither the subject nor the audience is stated anywhere on the visible
screen" no longer holds at this width: both now appear, if only in the last
visible strip of the fold.

**Most likely to stay.** The sector sentence, now inside the first viewport
without scrolling, is a stronger draw than at baseline: a reader who reads to
the bottom of her screen meets a precise match to her situation without
needing to scroll at all. Whether a real reader's eye actually reaches that
last strip before deciding to leave is a plausible read, not a measured one.

**Verdict, desktop: improved, not fixed.** Two of the five-second test's
three questions now pass, against one pass and one partial at baseline. The
third (one clear next step) still fails. Read plainly: a stranger arriving at
1280 today can now tell what this is and who it's for without scrolling,
provided she reads to the very bottom of her screen; she still cannot tell
what to do about it without scrolling further.

---

## What changed against the baseline, stated plainly

**Fixed, at 1280 only:**
- "What is this" was a flat no, now a yes, evidenced by the sector
  sentence's opening clause sitting inside the 800px fold (`firstY.charity`
  704, was 842).
- "Who is this for": same fix, same evidence.
- The nav choice is smaller: five items instead of eight at y=23. It does not
  remove the "blind choice" problem, but it is measurably less of one.
- The page is shorter (1,696px, was 1,834px), so everything below the fold,
  including the checks claim and both CTAs, is reached with less scrolling.

**Standing, unchanged at both widths:**
- No single clear next step exists inside the first viewport at either width.
  This is the one baseline finding that ranked ahead of everything else and
  it still stands at both 390 and 1280.
- The checks claim is still below the fold at both widths: 866/844 at mobile
  (unchanged), 856/800 at desktop (narrowed from 994/800 but not fixed).
- "DPIA" appears nowhere on the homepage at either width, in either capture.
- The pills are still unlabelled, unexplained, and mix consumer AI tools with
  developer and analytics infrastructure, at both widths, in identical counts
  (16 at 390, 19 at 1280) to baseline.
- Every mobile finding stands exactly as filed, because the mobile homepage
  is pixel-for-pixel and figure-for-figure identical to baseline. This is the
  deliberate result of dropping step 4a and scoping step 4b to desktop; it is
  not an oversight, and it should not be re-argued as one.

**Nothing found to have got worse.** No measurement or screenshot in this
pass shows a regression against the baseline at either width. The smaller
wordmark at 1280 (roughly 81% of its old size, per the build-plan's step 4b
entry) is a deliberate trade Jasmin made to fit the sector sentence into the
fold, overriding her own "full-screen wordmark" must-keep; judged purely on
the five-second test, it is a net gain, not a loss, since it is what let the
sentence in. The collapse of "Design", "Learning", "AI News" and "My Stack"
into a single "How I work" hub tab could plausibly cost a confident
practitioner-type visitor a one-click route to a page she already knows she
wants, but that visitor is a secondary reader in the profile, not the one
this test judges by, and nothing in these captures shows what the hub's
second row looks like or whether it is one click away or two. Named as an
open question, not a finding, below.

---

## What could not be told from a still image (unchanged from baseline, still open)

- **The mobile drawer's contents**, now different from what the baseline
  drawer held (per the step 3 nav rebuild), still unverified visually in
  either report, because "Menu" is captured unopened in both.
- **The hub's second row** ("How I work" opening to reveal My Stack, Design,
  Learning, AI News, per `build-plan.md`'s Rulings section), not shown in
  either capture, so whether it is genuinely one click deep or effectively
  two is unverified here.
- **Whether the pills are clickable, hoverable, or link anywhere.** No cursor
  state or destination can be read from a static screenshot, at either point
  in time.
- **Any state that depends on interacting with "Drag me".** Only the
  post-settle resting position is shown in either capture.
- **Real device rendering**, including whether a real browser's chrome (an
  address bar, a bookmarks bar) pushes the desktop sector sentence below what
  a genuine 1280x800 window shows. Both captures here and at baseline are
  emulated viewports asserted at exactly 1280x800; nothing here confirms that
  height in an actual browser window.

---

## Facts, before and after, for the record

| Measure | Baseline (13 Sep, live site) | After (13 Sep, this branch) |
|---|---|---|
| Hero height, 390 | 500px | 500px (unchanged) |
| Hero height, 1280 | 800px (full viewport) | 662px |
| Page length, 390 | 2,139px | 2,139px (unchanged) |
| Page length, 1280 | 1,834px | 1,696px |
| Sector wording first appears, 390 | y=605 (inside 844 fold) | y=605 (unchanged) |
| Sector wording first appears, 1280 | y=842 (below 800 fold) | y=704 (inside 800 fold) |
| Checks claim first appears, 390 | y=866 (22px below fold) | y=866 (unchanged) |
| Checks claim first appears, 1280 | y=994 (194px below fold) | y=856 (56px below fold) |
| "DPIA" anywhere on homepage | absent, both widths | absent, both widths (unchanged) |
| Pill count, 390 / 1280 | 16 / 19 | 16 / 19 (unchanged) |
| Nav items visible without scrolling, 1280 | 8 (6 tabs, "Get the template →", "Work with me") | 5 (3 tabs, "How I work" hub, "Work with me") |

Sources: `scratchpad/step0-after/measurements.json`,
`scratchpad/step0-after/home-first-viewport-390.png`,
`scratchpad/step0-after/home-first-viewport-1280.png`, against
`~/Developer/the-edit-ai/.superpowers/site-map-boards/cap/baseline-2026-09-13-measurements.json`,
`...-home-390.png` and `...-home-1280.png`.

---

## Note from the main session, 13 September 2026

Checked against the measurements before commit: "Drag me" at y=556, the pills
from 502 to 635, "This helps." at 804 and the template offer at 1432 all match
`step0-after/measurements.json`. Two slips were corrected: the table's baseline
column said "30 Aug build" when the baseline is the live site captured on 13
September, and eight em dashes were replaced.

The two open questions about the new navigation were settled in step 3, which
opened the drawer and measured the hub row on cold loads:
- **The drawer** at 375 lists Home, Tools, Template, then a "How I work" label
  over My Stack, Design, Learning and AI News, then "Read the Substack →", with
  Work with me at its foot.
- **Depth.** From the homepage, My Stack is one click (the How I work tab lands
  on it) and Design, Learning and AI News are two (the tab, then the second
  row). On a phone all four are one tap once the drawer is open. So the cost
  this report names for a confident practitioner is real on desktop: one
  extra click to three pages that used to be on the bar.
