# Design fidelity check: the desktop hero (step 4b)

**Date:** 2026-09-13
**Project:** the-edit-ai-site-map, branch `design/site-map`
**Scope:** `src/pages/Index.tsx` (commit `108958a`), `src/components/DragHint.tsx`
(commit `002f3e6`), `src/components/CobaltZone.tsx` (commit `1e74eb9`, the
60%→85% bodyText opacity change).
**Spec:** `.claude/CLAUDE.md`, "Design system (locked)" and the rewritten "1
September post-merge pass" section, specifically the "desktop hero is as tall
as its content" block (lines 1152-1177) and the DragHint block (lines
1141-1150); `build-plan.md` "Rulings, settled 13 September 2026" (lines
100-137) and "Ruled later on 13 September" (lines 139-153).
**Also read:** `~/.claude/guides/website-build/web-build-guide.html` §3 and §6,
and its §7/§8 property tables for theeditai.co.uk (dated 14 Aug 2026, predate
this build; no entry there names the hero, the wordmark clamp, DragHint or
CobaltZone's bodyText opacity, so none of my findings below flips a recorded
claim, no staleness flag needed).
**Previous report:** `reports/2026-09-13-design-check-nav-and-checks-line.md`
covered the nav rebuild and the checks line. Not repeated here. Its finding 3
(the pre-existing 60% bodyText contrast shortfall) is now closed: see "What I
checked and found clean" below.

Two limits stated up front, per my brief. I read source; I do not render.
Every finding is marked OBSERVED IN CODE, OBSERVED IN SCREENSHOT, or INFERRED
ABOUT RENDERING. An inferred finding is not evidence of a defect, only that a
render check hasn't settled it. For every fix I mention, I state what a render
should show afterwards and what would disprove it; where the diagnosis is
compositional and I have no property-level fix that matches it, I say so and
leave the remedy to Jasmin rather than propose one.

---

## Verdict: faithful to the ruling at every board-tested width; one soft-drift point at an untested width, one item worth a direct check to close out

Every rule in the "desktop hero is as tall as its content" block is followed
exactly in code, and every screenshot at the four widths Jasmin's board
covered (1024, 1280, 1440, 1920) matches what the board predicted, line count
for line count. No hard drift: no off-palette hex, no forbidden combination,
no interaction-state regression. The one soft-drift point is at 2560, a width
the board never rendered, where the same formula produces a more lopsided
composition than anything Jasmin actually signed off. The second item is a
gap in the given measured facts, not a defect I can show.

---

## Findings, most costly first

### 1. SOFT DRIFT / OBSERVED IN SCREENSHOT: at 2560 wide, the hero reads as a small wordmark in a mostly-empty field, past what the approved board tested

**File:** `src/pages/Index.tsx:187` ("The" clamp), `:220` ("Edit." clamp).
**Screenshot:** `step4b/desktop-2560.png`, compared against
`hero3/hero-board-2.png` (the approved board).

The wordmark clamp is `min(38vw, 49vh)` for "Edit.", capped at a hard ceiling
of `560px`. At 2560×1440, `38vw` = 972.8px and `49vh` = 705.6px; both exceed
the 560px ceiling, so the wordmark renders at its absolute maximum size
regardless of viewport width. The formula was tuned against four boards , 
1024×768, 1280×800, 1440×900, 1920×1080 (`hero-board-2.png`), and 1920 is
the widest of them. 2560 was never rendered for Jasmin to look at.

In the 2560 screenshot, the wordmark's right edge (the full stop after
"Edit") sits at roughly 47% of the viewport width. The pill layer spreads
nearly the full width as a thin band hugging the very bottom of the hero,
visibly separated from the wordmark by a gap that reads as empty periwinkle
rather than as pills "falling across the type" the way they do at 1280 and
1440, where the pile climbs up the "d", "i" and "t" and reads as one
composition with the letters. At 2560 the pile reads as a decorative strip
along the floor and the wordmark reads as a smaller object floating alone in
the left third of a very wide, largely blank periwinkle field, with the
DRAG ME hint the only other mark in the right two-thirds.

This is soft drift, not hard: the spec is silent on 2560 specifically, the
board stopped at 1920, and nothing in the ruling promises composition at
wider viewports. But the ruling's own stated intent ("the pills falling
across the type" is one of Jasmin's two must-keeps, `build-plan.md:132-134`)
is visibly weaker here than at any width she actually reviewed, and the
degradation is directional: it gets worse, not better, as width increases
past 1920, because the wordmark's height ceiling caps it while the container
keeps growing.

**What would prove this fine or wrong:** render a 2560×1440 board alongside
the four Jasmin already has, using the same "today vs tuned" comparison
format as `hero-board-2.png`, and put the question to her directly: does the
pile still read as falling across the type at this width, or does it read as
two disconnected elements? If she is shown it and accepts the trade the way
she accepted 1920's, this closes as confirmed rather than found.

**On a fix, since the diagnosis is compositional, not a property mismatch:**
I am not proposing one. Raising the vh/vw ceiling would make the wordmark
bigger but risks reopening the very fold problem the ruling exists to solve,
and it wasn't the diagnosis I'm making (the wordmark size looks correct in
isolation; it's the relationship between wordmark and pile that thins out).
Widening pill spread, adding more pills at very wide viewports, or accepting
the trade as-is are all live options and none of them is implied by "the
wordmark is too small", that would be a property fix answering a different
diagnosis. This is Jasmin's call once she has seen it, not a code change to
make unprompted.

### 2. SOFT / needs one render to close: the 1024 width is absent from the given "arrow crosses pills" measurement, and I can't independently confirm it from a compressed screenshot

**File:** `src/components/DragHint.tsx:115-122` (desktop offset block).
**Screenshot:** `step4b/desktop-1024.png`.

The brief's measured facts state the hint's arrow line crosses pills "at
every desktop width from 1280 to 2560", 1024 is not in that list, even
though `useIsMobile()` (`use-mobile.tsx:26`, `1024 < 1024` is false) puts
1024 on the desktop branch of `DragHint`, which the screenshot confirms: the
left-pointing chevron and "DRAG ME" render top-right of the pile, not
stacked with a down arrow.

Working through the clamp itself: `clamp(80px, 7.7vw, 100px)`. At 1024,
`7.7vw` = 78.8px, which is below the 80px floor, so the offset clamps to
80px, the *smallest* value it takes anywhere in the tested range (1280
computes to 98.6px, and everything from about 1299px up sits at the 100px
ceiling). A smaller bottom offset sits the hint closer to the hero floor,
which if anything makes crossing a pill more likely, not less, so there's no
mechanism in the formula that would make 1024 behave worse than 1280.
Reading the screenshot, the hint at 1024 sits in the same horizontal band as
the "Microsoft Copilot" and "Resend" pills, the same relationship the
1280–2560 screenshots show, and the pile's top edge is closer to the hint at
1024 than at any wider desktop screenshot I reviewed.

This is INFERRED, not confirmed: a static screenshot at reduced resolution
is not the pixel-accurate line intersection the brief's other measurements
were taken with, so I can't sign this off as fact the way the given
1280–2560 figures are signed off. I read this as very likely fine and
probably just omitted from the tested set rather than a real gap, but it is
the one item in this review I'm flagging as needing the same treatment as
the widths already measured rather than one I can close from what I have.

**What would prove this fine or wrong:** run the same arrow-line-crosses-a-
pill measurement used for 1280–2560 at 1024. If it crosses, extend the
existing CLAUDE.md line to read "1024 to 2560" and this is done. If it
doesn't, that would be the one width where the hint points at nothing, which
is exactly the failure the 130px→100px cap change was made to fix elsewhere
in the range.

---

## What I checked and found clean

- **The `sm:min-h-0` / content-height hero is built exactly as ruled.**
  `Index.tsx:106` sets `min-h-[500px] sm:min-h-0 ... pb-10 sm:pb-16`, which is
  the flat 500px mobile floor and the 64px kept under the type from `sm` up,
  both matching CLAUDE.md's description word for word.
- **Both wordmark clamps match the locked values exactly.** "The" is
  `clamp(110px, min(28vw, 36vh), 420px)` (`Index.tsx:187`) and "Edit." is
  `clamp(160px, min(38vw, 49vh), 560px)` (`Index.tsx:220`), character for
  character against CLAUDE.md:1156-1157.
- **Sector-line visibility matches the board at every width it covers.**
  Comparing `desktop-1024.png`, `desktop-1280.png` and `desktop-1440.png`
  against `hero3/hero-board-2.png`'s "tuned" column: 1024 shows 3 lines of the
  sector paragraph before the fold (board: "3 of 7 lines in view"), 1280
  shows 3 (board: "3 of 5"), 1440 shows all 5 (board: "All 5 lines in view").
  The 1920 screenshot also shows all 5, matching the board. This is the
  clearest confirmation available that the shipped code is the code the board
  was rendered from, not a close approximation of it.
- **The full stop's exposure to the pills varies between screenshots, as
  documented.** At 1280 it sits mostly clear in this capture; CLAUDE.md
  already documents this as a from-run-to-run variance rather than a fixed
  state, and Jasmin's ruling explicitly declines to guarantee it. Nothing here
  contradicts that.
- **Portrait tablets and phones are genuinely untouched.** `mid-640x960.png`,
  `mid-768x1024.png` and `mid-820x1180.png` all show the same composition , 
  full wordmark, pile settled at the hero floor, About heading directly below
 , which is what "sm:min-h-0" combined with width-dominant clamps produces
  on a tall narrow viewport (the `min(vw, vh)` term picks the smaller of the
  two, and on a portrait screen `vw` is the smaller term, so these compute the
  same as the pre-existing behaviour).
- **The 640–1023 "chrome is mobile" hint placement is confirmed as
  pre-existing, not a step 4b regression.** `mid-1023x768.png` and
  `mid-844x390.png` both show the stacked "DRAG ME" hint sitting directly
  over the "d"/"i" of "Edit", exactly as CLAUDE.md:1175-1177 describes and
  attributes to a condition ("equally true before step 4b") rather than to
  this change. `mid-932x430.png` and `mid-820x1180.png` show the same
  pattern at two more sizes in that range. Nothing here needs raising as new.
- **The phone hero is provably unchanged.** `phone-live-390.png` and
  `phone-branch-390.png` are visually identical: same wordmark position, same
  pile, same centred stacked hint. This matches the brief's own measured
  claim and I have no reason to doubt it from the images.
- **DragHint's desktop cap change is in code exactly as described.**
  `DragHint.tsx:121`, `bottom: "clamp(80px, 7.7vw, 100px)"`, replacing a flat
  130px cap; the comment at `:116-120` states the reasoning (a 130px anchor
  on a roughly 115px-tall pile at 1920 pointed at nothing) and matches
  CLAUDE.md:1145-1146 exactly.
- **CobaltZone's bodyText contrast fix is in code and closes the item my
  previous report flagged.** `CobaltZone.tsx:286-292`: both `bodyText` and
  `checksLine` now render at `rgba(250,248,244,0.85)` (6.24:1), replacing the
  60% value (3.86:1) that failed AA. This has no effect on the homepage , 
  `Index.tsx` never imports `CobaltZone`, so it sits outside "hero" scope
  proper, but it is exactly the change `build-plan.md:148-149` records, and it
  resolves finding 3 of `reports/2026-09-13-design-check-nav-and-checks-
  line.md` (the two paragraphs no longer differ in measured contrast for a
  reason only visible in a source comment).
- **No off-palette hex and no forbidden combination introduced.** Every value
  in the three changed files is a locked hex used in its documented job:
  `#7B7FD4` (homepage periwinkle ground), `#2D35C9` (cobalt wordmark),
  `#C8F04A` (DragHint label and chevron, decorative, aria-hidden), `#1A1510`
  (ink, the "What I'm running" pill background and the DragHint text-shadow
  colour in rgba form). Nothing new, nothing near-matched.
- **No interaction-state or placeholder-slot regression.** `DragHint` is
  `aria-hidden="true"` and decorative; it carries no interactive state to
  regress. The `Suspense fallback={null}` for `HomeGravity` is explicitly
  justified in the surrounding comment (an absolutely-positioned decorative
  layer that reflows nothing on arrival), not an unsized placeholder slot in
  the sense the 18 June ratified learning targets.

---

## The art-director test

**Homepage, cold, at the widths the board actually tested (1024 to 1920):** a
confident, oversized cobalt wordmark on periwinkle, with a pile of the
tools Jasmin actually uses spilling across and out of the letterforms like
something mid-collapse, caught before it settles. The sector paragraph now
reaching the first screen at 1440 and up gives the hero somewhere to lead a
reader after the wordmark, which it did not do before this step. That's a
point of view a stranger could name: a directory confident enough to let its
own name take up most of the first screen, with the evidence of what it
actually recommends literally piled on top of it.

**At 2560, that point of view thins out.** The same wordmark, capped at its
ceiling, now occupies a modest fraction of a very wide field, and the pile
reads as a separate strip along the bottom rather than something spilling
out of the letters. It isn't a different aesthetic, nothing generic or
SaaS-shaped has crept in, no gradient, no stock blue, but it is a weaker
version of the same one, at a width nobody has actually looked at yet.

**One inner page, cold (`/tools`, unchanged by this step):** not re-reviewed
here; see the previous report.

---

## Guide staleness: none flagged

Checked `web-build-guide.html` §7 and §8 for theeditai.co.uk (dated 14 Aug
2026). The entries there predate the nav rebuild, the checks line, the hero
rework and DragHint's tuning entirely, and none of them makes a claim about
wordmark sizing, hero height, or the drag-hint's position that either of my
findings above would flip from correct to incorrect. Per my brief, the
staleness flag is for a finding that changes a property's *recorded* state,
not for noting the table predates a whole build. No `SCRATCHPAD.md` line
added.

## Proposed learning

None. Both findings here are instances of patterns this project has already
named (a ruling tested at a bounded set of widths not automatically holding
at an untested extreme; a measured-facts list with one width missing without
a stated reason) rather than a new failure mode worth adding to the
ratified-learnings queue.


---

## Note from the main session, 13 September 2026

**Finding 2 closed.** 1024 was measured: the first step 4b verification run had
the hint's arrow line crossing six pills at 1024 on all three runs, and the
100px cap does not reach 1024 (its offset is on the 80px floor there). CLAUDE.md
now lists 1024 (`5626351`).

**Finding 1 put to Jasmin with the capture.** At 2560 the wordmark sits at its
560px limit, which is not new: the same limit applied to the full-height hero,
which left even more empty periwinkle above it. The change made the hero more
compact there, not less. Em dashes in the draft were replaced before commit.
