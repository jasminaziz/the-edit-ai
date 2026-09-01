# Unblocked design fixes: implementation brief

Written 29 August 2026 from `reports/2026-08-29-design-audit-findings.md`.
For pasting into a fresh Claude Code session on `overhaul/sector-axis`.

These seven fixes need no ruling from Jasmin. They are defects and
off-palette values, not design choices. Everything that needs a decision is
excluded, and the ToolCard rebuild is explicitly out of scope because it
sits behind three open rulings.

---

PROMPT STARTS

---

Repo `~/Developer/the-edit-ai`, branch `overhaul/sector-axis`. Read
`.claude/CLAUDE.md` in full, then
`reports/2026-08-29-design-audit-findings.md`.

You are implementing seven fixes from that report. Every one is already
decided. **Do not implement anything else from the report**, and in
particular do not touch `ToolCard.tsx`: the card rebuild is blocked on three
open rulings and will be a separate session.

## Working rules, from CLAUDE.md

- **One job per commit.** Seven fixes, seven commits, in the order below.
  The one exception is fix 5, which must land as a single commit because a
  partial change leaves the nav broken at a width it currently works at.
- **Before every commit, run all three:** `bunx tsc --noEmit`, `bun test`,
  `bun run build`. The build is not optional; Vercel build failures are
  silent and it keeps serving the last good deploy.
- **State what must not be touched before each edit.**
- **Author no visitor-facing copy.** If a fix seems to need a wording
  change, stop and flag it. None of these seven should.
- **Add no new inline hex.** The tokenisation job comes straight after this
  one, and this session must not make it bigger. Where you are already
  editing a line that carries an inline hex, move it to the existing token
  if one exists; otherwise leave it and note it.
- **Do not merge to main.** Do not run git at all: write the files, and hand
  Jasmin a copy-paste block starting with the `cd` for each commit.

## The seven, in order

**1. Sticky filter bar gap.** `Tools.tsx:107` → `sticky top-0`. Card content
currently scrolls visibly through a 64px gap between the nav and the filter
bar. Smallest possible change, most visible defect.

**2. Worst dead space.** `PolicyTemplate.tsx:35` → add `mx-auto`. At 1440px
this page leaves 736px unused, 51% of the viewport, with margins at 0px/0px
because the container is missing. One class.

**3. 404 invisible text.** `index.css:29`, `--muted-foreground` → `30 20%
8%`. It is currently the identical HSL triple to `--muted`, so the 404
message renders at 1.00:1 against its own background. Then rebuild
`NotFound.tsx` on the palette. Check nothing else was relying on the two
tokens being identical.

**4. Filter rail collapse.** `Tools.tsx` lines 142, 165, 114 and 120 → move
the wrap from `sm:` to `lg:`. Between 640px and roughly 1000px the rail
collapses to a 128px track while the widest chip is 228px, and from 640 to
739px the page scrolls sideways (scrollWidth 692 against a 640 viewport).
This is a side effect of the F2c ruling: wrapping at `sm` removed the
horizontal scroller in a band where the track is far too narrow to wrap
into. Verify the horizontal scroll is gone at 640, 700 and 739px.

**5. Nav CTA off-screen. One commit, all parts together.**
`use-mobile.tsx:3`, `MOBILE_BREAKPOINT` → `1024`, plus `h-14 md:h-16` and
the four hero offsets. At 768px the desktop nav engages but needs 1087px,
so "Work with me" renders at x=907–1039 inside a 768px viewport and is
entirely off-screen. `Layout.tsx:70` clips it rather than producing a
scrollbar, so it fails silently. This is the consultancy conversion link, so
it is the most commercially expensive defect in the report. Changing the
hook affects `Layout.tsx`, `HomeGravity.tsx`, `DragHint.tsx` and
`Index.tsx`; check all four at 640, 768, 1023 and 1024px before committing.

**6. Synthetic font weights.** `font-black` → `font-bold` in four places,
and body weights 700/800 → 600 in five. The weights being asked for are not
in the loaded font files, so the browser synthesises them.

**7. Four off-palette hexes.** The Learning border, the PolicyTemplate text
colour, the WhatsNewCard toggle and the DesignKit badges. Replace with the
locked palette values. **Only these four.** The report lists nine
off-palette hexes; the other five sit behind open rulings and stay exactly
as they are.

## Verification

The live site on `main` is the old pre-overhaul site and tells you nothing.
Preview deploys 403 on Sheets data because the production key is
referrer-locked to `theeditai.co.uk/*`. Run the local dev server against
live Sheet data, as the audit session did.

Check every fix at 375, 640, 700, 739, 768, 1023, 1024, 1280 and 1440px.
Fixes 4 and 5 are the reason the odd widths are in that list; do not round
them off.

The directory is 23 complete rows, not 15. Audit against that.

## What I want back

A short session note appended to `SCRATCHPAD.md`, and per-commit copy-paste
blocks for Jasmin. For each fix: what changed, the widths you verified it
at, and anything you found that the report did not.

If any fix turns out to need a ruling after all, stop on that one, leave it
unimplemented, and say why. Do not decide it yourself.

---

PROMPT ENDS

---

## Note for Jasmin

Fixes 1 and 2 are two class changes and between them clear the most visible
defect on the site and its worst dead-space instance. If you want proof of
life before commissioning the rest, ask for those two alone and look at the
result.

Fix 5 is the one with commercial weight. Your consultancy link, the thing
The Edit exists to feed, is invisible on an iPad and on small laptops, and
has been failing silently.
