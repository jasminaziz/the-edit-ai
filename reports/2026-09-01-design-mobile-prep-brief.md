# Design and mobile prep brief, for the next code session

Written 1 September 2026, Cowork session, against production `theeditai.co.uk`
and `main` at `5f22419`. This is an issue list, not a decision list — the
code session has the repo's full context (CLAUDE.md, the design audit, live
browser iteration) and should use its own judgement on implementation, values
and technique. What's below is the evidence so it doesn't have to re-derive
any of it: file:line references, live measurements, and what's already been
ruled on versus what's still open. Where Jasmin has already stated a firm
requirement (the behaviour she wants, not how to build it), that's flagged as
such rather than folded in as one option among several.

Copy is the one exception — visitor-facing strings are supplied exact and
approved at the bottom, per the standing split (code sessions place copy,
they don't author it).

**Branch note.** Local `main` currently contains everything
`overhaul/sector-axis` has (`git log main..overhaul/sector-axis` is empty)
and more. The project brief says branch discipline holds until relaunch —
all code on `overhaul/sector-axis`, nothing merges to `main` without
sign-off — but the checkout is sitting on `main` right now and the last
several SCRATCHPAD sessions describe committing there directly. Worth
confirming with Jasmin before the first commit rather than assuming either
way.

---

## Issue 1: homepage H1 — the ascender on "the"

Confirmed on production at 1440px. The lowercase "h" in "The" carries its
type family's normal ascender overshoot, so its top sits visibly above the
cap height of the "T" beside it. Jasmin wants the h's tip shortened to match
the T's cap line, on both desktop and mobile.

Nothing about the current markup isolates the "h" — it's plain text inside
the H1's first `<span>` in `Index.tsx`, sized by `clamp(120px, 28vw, 420px)`.
Whatever technique gets used needs to keep working across that whole
responsive range, so a fixed pixel value is probably wrong and something
relative to the glyph's own box is probably right — clip-path, a transform,
a font-feature — pick whichever renders cleanest against the actual glyph
once you can see it live, since none of the readings I could take through
this session's browser pane got close enough to measure the overshoot in
pixels.

Two things worth knowing before you touch this file: the "d" in "Edit."
directly below has the same ascender overshoot and Jasmin didn't ask about
it — leave it unless she says otherwise. And the H1 sits on the design
audit's still-open ruling about periwinkle-on-cobalt contrast at 2.37:1
(`reports/2026-08-29-design-audit-findings.md`) — a live AA failure on the
exact element you're editing. Not today's job, but flag it rather than
letting the h-fix commit read as "H1 handled."

---

## Issue 2: mobile card interaction — tap should hold, not flash

Jasmin's requirement, stated directly: tapping a card should turn it cobalt
and keep it that way, the way clicking works now, not hover-simulate and
revert.

`ToolCard.tsx`'s own comment names the current mechanism and its side
effect: pointer events "are created and destroyed per touch, so the state
now clears when the finger lifts." That's accurate, and it's the glitch —
on a real tap the card inverts for the instant the finger is down and
reverts the moment it lifts, which reads as broken rather than selected. It
was built this way deliberately to fix a worse bug (a card stuck inverted
with no matching pointer-leave on touch), so whatever replaces it needs to
keep that fix while losing the flash.

Desktop hover is not in scope — Jasmin ruled on 29 August that hover stays
exactly as built there, and nothing here reopens it. The two files involved
are `ToolCard.tsx` (owns the pointer/focus handlers and the `data-selected`
attribute) and `Tools.tsx` (owns the single `hoveredCard` string the whole
grid keys off, including the neighbour-dim). Worth checking while you're in
here: two fixes from the 29 August audit were ruled on but, as far as I can
tell, never shipped — the neighbour-dim floor is still 45% opacity, which
measures 2.92:1 on body text while it's active (a real contrast fail), and
the ruling on record says raise it to 70%. Confirm current state before
assuming either way.

---

## Issue 3: "drag me" hint on desktop

Not a bug, more a status check. `DragHint.tsx` already runs on mobile —
`if (!isMobile || hasScrolled) return null` means it's been live there the
whole time, lime label, bouncing chevron, reduced-motion handling, the lot.
Desktop is switched off by that same condition, and the component's own
comment calls it "temporarily hidden," with the full desktop positioning
math (top-right of the hero, next to the period after "Edit.") already
written and just not running.

Jasmin's asking whether to bring it back on desktop. If the answer's yes,
the mechanism is already there — worth a look at *why* it was paused before
just flipping it back on, since "temporarily" suggests someone had a reason
that isn't in the code.

---

## Issue 4: pill colour and pill count

**Colour.** Burnt orange left the rotation on 30 August for two measured
reasons, both in `HomeGravity.tsx`'s own comments: its white label read at
3.60:1 (a real AA text failure), and its edge against the lightened hero
background measured 1.43:1, close enough to luminance-matched that the pill
nearly disappeared into the ground. Jasmin's asking whether a new colour
joins the palette to bring some of that fun back. Whatever's chosen needs to
clear the same bar the current three colours clear — Forest's edge-contrast
of 2.54:1 against the hero is the softest precedent already accepted, so
that's roughly the floor to measure against, and the label needs to hold
AA on white or on ink, whichever pairing gets used. Run the actual value
through a contrast checker before it ships rather than eyeballing it.

**Pill count, desktop.** The backlog already carries raising `MAX_PILLS`
from 18 to 30 (`HomeGravity.tsx:73` as at 29 August), and it's worth knowing
why: `my_stack` currently holds 19 rows, so 18 is truncating one real pill,
not limiting a longer list for pacing. Raising the cap mostly means "stop
hiding a true one," with headroom for the stack to grow — the pills are a
personal claim by design, so more of them has to mean real ones, not
padding the rotation.

**Pill count, mobile.** No cap exists today — `MAX_PILLS` is one constant,
shared across breakpoints. The 31 August findings measured the current
uncapped mobile hero at settle: 19 pills, 15 overlapping the H1's bounding
box, 7 sitting behind the nav bar, one entirely off the top of the viewport,
all of them resting inside the top two-thirds of the hero. That's real
evidence a mobile-specific cap is needed; what the number should be is a
visual call the code session is better placed to make than I am, using the
same method the 31 August report used — screenshot at 360×780, check pill
boxes against the H1's bounding box, adjust until the wordmark reads clearly
underneath them.

---

## Issue 5: H1/H2 consistency, and the desktop column check

**The pattern already mostly holds.** `Tools`, `Learning`, `My Stack` and
`Submit a Tool` all use `CobaltZone` with a short one-to-three-word H1 and a
longer subheading underneath — the shape Jasmin's asking to standardise on.
`/policy-template` is the one page that doesn't: it's a bespoke hero, not
`CobaltZone`, with a full sentence as the H1 ("The AI-use policy template
for charities," confirmed live, wraps to three lines) and no subheading at
all. That's the outlier to bring in line; approved copy for it is in the
copy section below.

Two small things worth a look while auditing headers, not really design
decisions: `WhatsNew.tsx` builds "AI News" via a two-line-inline prop where
a plain heading string would render the same thing, and `DesignKit.tsx` has
the mirror image — an empty `heading=""` alongside a `twoLineHeading` whose
second line is also empty. Both look like leftover plumbing from an earlier
version of the component; simplify if you're already in the file.

**The desktop column / empty-space question.** I looked for this directly
rather than guessing, since it's a specific enough complaint to check. Live
DOM measurement at 1728px on `/tools` (3-column grid) and `/my-stack` came
back with every container correctly at the full 1280px, centred — I
couldn't reproduce a column split leaving dead space on the right on either
page. Worth flagging honestly: a first screenshot of `/my-stack` at that
width looked exactly like the bug — narrow left-pinned column, large empty
right side — and I nearly wrote it up as one before cross-checking with
`getBoundingClientRect()`. That mismatch is worth having in mind if the code
session's own screenshots produce something similar; it may be a rendering
artifact of the tooling rather than the site (this session's pane runs at
devicePixelRatio 2 with custom viewport emulation).

The one place this exact pattern was a *real, already-fixed* bug is
`AboutPanel.tsx` — before 30 August it capped content at 640px, left-pinned
inside a 1280px container, leaving 720px of dead cream on the right, twice
over (both blocks did it). If Jasmin's remembering that, it's resolved. If
she's seeing something live and recent, worth getting the specific page and
width from her rather than re-auditing broadly — and worth knowing that any
`grid-cols-2`/`grid-cols-3` block will strand a half-empty last row the
moment its item count doesn't divide evenly, which is ordinary grid
behaviour rather than a defect, currently invisible only because
`/my-stack`'s "Building" grid happens to hold exactly 2 items.

---

## Issue 6: "On My Radar" page

Not a new idea — this is Jasmin's own ruling from 28 August ("Radar: own
tab, before merge," recorded in SCRATCHPAD), getting picked back up rather
than reopened. The reasoning on record: an uncapped radar list sharing a
page with the capped, complete directory is how the 45-row ceiling erodes.

What's already there to build on: `tools` rows that fail `isComplete()` (44
of 67 as at the last full read) still carry `name`, `url`, `what_it_does`
and `verdict` — `isComplete()` only requires the seven axis fields, not
those four. `verdict` is documented as "Jasmin's judgement, never written by
automation," which already matches "my initial thoughts" — no new Sheet
column needed. Route and nav naming are open; `/radar` and a one-word nav
entry would match the existing pattern (`My Stack`, `Tools`, `Design`,
`Learning`, `AI News`), but that's a call for whoever builds it.

One real thing to solve, not just a style question: `ToolCard.tsx`'s "THE
CHECKS" header and its rule render unconditionally, before any of the axis
fields it introduces. Every field under it is correctly guarded and won't
render when empty — but the section label and rule would still show, above
nothing, on a radar card that has no axis data at all. That reads as
"checked, found nothing" on a page whose whole point is "not checked yet."
Reusing `ToolCard` as-is would ship that contradiction; whether the fix is a
lighter dedicated card, a conditional wrapper, or something else is a build
call.

Data hygiene worth folding in since the status field will get touched
either way: Blotato and Grok are both complete, published rows that still
carry `on_radar` in the Sheet's status column from before they were
finished. Filtering the radar page on `status === "on_radar"` would
wrongly list two rows that already live on `/tools`; filtering on
`!isComplete()` avoids it, since that's the predicate the rest of the site
already trusts.

**Checked against the fortnightly axis audit specifically, since Jasmin
asked whether this page could break it — it can't, on any of the three
layers involved.** The Cowork scheduled task ("The edit fortnightly audit")
is a reminder, not the audit itself: it nudges Jasmin to run the real thing
locally and, on the 1st of the month only, reads `tools` for `last_checked`
freshness and suggests swaps to `design_kit`/`learning`. It never reads the
`status` column and has no concept of a radar page at all. The real audit
(`reports/*-axis-audit-claude-code-prompt.md`, pasted into local Claude Code
by hand — confirmed via both the prompt file and "The Axis Audit" artifact)
already fetches URLs across every `tools` row regardless of completeness
("all four tabs, about 159 of them"), so a radar page surfacing the same
incomplete rows gives it nothing new to check. And `status` is in the write
script's permanent refusal list — `scripts/sheet-write.mjs:12` documents it
as "her call on her stack," `:75` hard-refuses writing it, so the audit
cannot write to that column under any circumstance regardless of what the
radar page does with it. The only way to actually create a conflict here
would be a future session renaming or repurposing the `status` column
itself without checking that refusal list first — not something building
this page does on its own.

---

## Issue 7: 404 page

Read `jasmin-aziz/404.html` for the reference, as asked — it's a separate
repo and stack (static HTML there, React here), so nothing copies over
directly, but the shape is portable. Its page chrome isn't something The
Edit needs: `NotFound.tsx` already renders inside `Layout` (confirmed in
`App.tsx`), so nav and footer already wrap it. What's missing is everything
between them — the consultancy page has a heading that names the situation
plainly, a couple of short paragraphs of actual voice, one pill CTA home,
and a 30-second auto-redirect with a visible countdown that cancels on
click. The Edit's current version is four lines with no voice: name, "Oops!
Page not found," a bare underlined link, straight shadcn tokens.

Jasmin's ask is to match that structure and warmth, not the consultancy's
literal content or its `--periwinkle-text` styling — periwinkle is scoped to
the homepage hero only in The Edit's design system, so cobalt or ink is
what's available for the heading here. The countdown-redirect mechanic
itself isn't consultancy-specific and is worth keeping.

Worth folding in since it's the same file: the 31 August findings noted the
404 currently ships no meta of its own (title, description, canonical all
absent), so every unknown URL soft-404s as the homepage. Giving it its own
`<SEO>` block closes that finding outright rather than leaving it open
alongside everything else on that report's ruling list.

---

## Copy, approved, exact strings

Code sessions place copy, they don't write it — these are final, not a
starting point.

**`/policy-template` hero, moving onto `CobaltZone`:**
- H1: `Policy Template`
- Subheading: `A free, adaptable AI-use policy template for charity,
  cultural and heritage organisations.` (the first sentence of the page's
  existing approved SEO description, reused verbatim, not new copy)

**`/radar`, if built this session — otherwise leave for whoever builds it:**
- H1: `On My Radar`
- Subheading: `Tools I've spotted but haven't put through the checks yet.`
- Body text: `These haven't been through the DPIA, data and training checks
  that get a tool onto the main directory, so treat them as leads, not
  recommendations. If one earns its place, it moves to Tools once it's
  checked.`
- Verdict-toggle label on the radar card: `First look` (not "Honest
  verdict," which promises the same rigor as a published row)

**404 page:**
- H1: `Page not found`
- Body: `That link's dead, or that page never existed. Either way, you're
  not where you meant to be.`
- Body: `Everything else on the site is where it should be — the directory,
  the stack, the policy template. Home's the fastest way back to all of
  it.`
- CTA: `Back to home`
- Redirect note: `Taking you home in {n} seconds…`, counting down from 30,
  cancelling on click
- `<SEO>` title: `Page Not Found | The Edit`
- `<SEO>` description: `That page doesn't exist. Here's how to find your way
  back to The Edit.`

---

## What this doesn't cover

The periwinkle-on-cobalt H1 contrast (2.37:1), the mobile hero's 332px of
empty space below the wordmark, the meta-description rewrites, and the
duplicate-meta-tags question from the 31 August report are all still open
and none of them are touched above. Don't fold them into this job without
asking Jasmin first — this brief only covers what she asked about today.
