# Design ruling: the "My Stack" nav button treatment

**Superseded 13 September 2026.** This treatment was built on 4 September
(`07353ca`) and retired on 13 September (`cefa8e0`), when My Stack became the
last nav tab. The status line below describes the day it was written. Kept as
the record behind the contrast figures `.claude/CLAUDE.md` cites for forest
on the nav: 1.33:1 on cobalt and 1.77:1 on periwinkle.

**Status:** proposal against the locked spec. Nothing is built. This is not a
fidelity audit of shipped code — it is a ruling on a treatment for a change
Jasmin has already decided structurally (My Stack leaves the nav item list,
becomes a distinct button in the top bar). I am ruling on what that button
looks like, not whether the move should happen.

**Limits, stated up front, per standing practice on this project:** my tools
are Read/Glob/Grep. I have not rendered this nav, in either colour state, in
a browser. Every contrast ratio below is computed by hand from the WCAG
relative-luminance formula against the hex values actually in the codebase,
and every ratio is cross-checked against a figure CLAUDE.md already states
for the same colour pair, so the arithmetic is verified, not asserted. But
whether a 1.5px white border actually *reads* as a visible edge at 14px pill
height, and whether forest sitting near lime looks clean or muddy, are both
**INFERRED ABOUT RENDERING** and need a screenshot at both nav grounds
before anyone calls this shipped. I've flagged each such claim individually
below.

## Files checked

- `.claude/CLAUDE.md`, "Design system (locked)" section, in full
- `src/index.css` (full file, 302 lines)
- `src/components/Layout.tsx` (full file, 401 lines) — this is where the nav
  and CTA cluster actually live: `navItems` at lines 9-16, the desktop nav
  render at lines 201-275, the CTA cluster at lines 236-273
- `reports/site-design-check-2026-08-05.md` (prior design-check report) —
  predates this overhaul and the 1 Sep post-merge pass, says nothing about
  nav hierarchy or forest green's job count. No continuity to carry forward.

## Verdict

**Recommend: solid forest-green fill, white 1.5px border, white text,
rounded-full, ranked visually between the plain nav links and the primary
"Work with me" pill by weight and size, not by colour saturation.** Full spec
below. It clears every hard constraint in the brief with real margin on one
ground and a genuinely tight margin on the other, and I say exactly where
that margin is tight rather than rounding it up.

## The three tiers, and what encodes each

This is the part that matters more than the hex, per the brief, so I'm
answering it first.

| Tier | Element | Kind of thing | Encoded by |
|---|---|---|---|
| 3 (lowest) | Home / Tools / Design / Learning / AI News | Tab, not a button | Plain text, no fill, no border. Gets a fill (white pill, `pillStyle` in `Layout.tsx:205-213`) only when active, which is a location indicator, not a call to action |
| 2 (middle) | **My Stack** | Secondary button | Solid fill, but a muted, dark, already-semantic colour (forest), a thin border for edge definition, `font-medium`, smaller padding |
| 1 (highest) | Work with me | Primary CTA | Solid fill in the site's single electric accent (lime on cobalt routes, white on the homepage), `font-semibold`, larger padding, sits alone past a divider |

The ranking is carried by **three independent signals that all point the
same direction** (saturation, weight, size), not by one. That matters
because colour alone is exactly the kind of signal CLAUDE.md already
distrusts (DPIA chips are "text-labelled... never colour alone"): if forest
green were the only thing separating My Stack from Work with me, a
colour-blind reader or a compressed screenshot loses the ranking. Weight and
size hold it up even if colour perception fails.

**Placement:** in the CTA cluster (`Layout.tsx:236-273`), after "Get the
template →", before the `w-px h-5 bg-white/15` divider that currently sits
directly before Work with me. Left to right: nav tabs → Substack/template
text links → **My Stack button** → divider → Work with me pill. This reads
as an ascending weight ramp toward the primary action, which is the point.
Do not put it inside the `navItems` array styled as a pill-shaped tab — that
would make it look like a fancier tab, not a different *kind* of element,
which is the exact confusion the brief is asking me to resolve.

## The recommended treatment, in full

```
Fill (rest):        #2D6A4F  (forest green, locked hex, reused deliberately — see below)
Border (rest):      #FFFFFF, 1.5px solid
Text (rest):        #FFFFFF, font-medium, text-sm (matches nav tab type scale)
Shape:              rounded-full (pill family — same shape language as the
                     active-tab pill and Work with me, signalling "these are
                     all buttons/pills" as a family, ranked by weight not shape)
Padding:            px-4 py-1.5 (nav-tab sizing, one size down from Work with
                     me's px-5 py-2 — the size difference is part of the
                     ranking signal, not decoration)
Fill (hover):       #1A1510 (ink) — matches the sitewide rule, "the cobalt
                     hover is ink #1A1510," ruled 2026-08-30 (CLAUDE.md,
                     Design system section). Border and text unchanged.
Fill (focus-visible): same as hover, plus an explicit 2px white outline,
                     2px offset (see "Focus-visible" below — this is a new
                     decision, not existing precedent, flagged as such)
Transition:         transition-colors duration-150 (matches the nav tab
                     hover transition at Layout.tsx:224, not the 250ms
                     cubic-bezier used for the sliding active-tab pill,
                     which is a positional animation and a different job)
```

## Contrast, computed against the hexes actually in the codebase

All figures computed from WCAG relative luminance, cross-checked against a
ratio CLAUDE.md already states for the same colour pair wherever one exists
(shown in brackets), which is how I know the formula is being applied
correctly here and not just asserted.

**1. Text on its own fill — judged against 4.5:1 (AA, normal text).**
White `#FFFFFF` on forest `#2D6A4F` = **6.39:1. Passes**, with real margin —
this is not a boundary case.

**2. Fill against the cobalt nav ground `#2D35C9` — judged against 3:1
(WCAG 1.4.11, non-text/UI-component contrast; this is what tells you whether
the pill has a visible edge at all, distinct from whether its text is
legible).**
Forest fill alone against cobalt = **1.33:1. Fails outright** — a bare
forest pill on the cobalt nav would have almost no visible boundary; it
would read as a slightly darker smudge on the ground, not a button. This is
why the white border is not optional decoration, it is the thing doing the
shape-definition job. **This is the single most important number in this
ruling**, because it means a "just fill it forest, no border" version of
this button would be a structural failure on every non-homepage route.

**3. Border against the cobalt nav ground — judged against 3:1.**
White `#FFFFFF` border against cobalt `#2D35C9` = **8.52:1. Passes** with
large margin. (Cross-check: CLAUDE.md states cobalt text on white card at
8.52:1 — same two colours, same ratio, confirms the arithmetic.)

**4. Fill against the periwinkle nav ground `#7B7FD4` (homepage only) —
judged against 3:1.**
Forest fill alone against periwinkle = **1.77:1. Fails outright.**
(Cross-check: CLAUDE.md states forest fill separation on the periwinkle hero
falls "2.54 to 1.77" when the hero reverted to `#7B7FD4` on 1 Sep — that
1.77 is this exact pair. Confirms the arithmetic independently of my own
working.) Same conclusion as #2: no border, no visible pill, on the
homepage specifically, where the brief already flags this as the trap.

**5. Border against the periwinkle nav ground — judged against 3:1.**
White `#FFFFFF` border against periwinkle `#7B7FD4` = **3.60:1. Passes, but
narrowly** — 0.60 above the floor. (Cross-check: CLAUDE.md's own accepted
figure for cream nav links on this exact ground is 3.40:1, in the same
narrow band; white edges it out slightly because white is marginally
lighter than cream.) **This is the tight number in this ruling and the one
that most needs a screenshot before sign-off.** It clears the non-text floor
on paper; whether a 1.5px line at that ratio actually reads as a crisp edge
against periwinkle, or looks slightly soft, is something I cannot verify
from source.

**6. Hover fill (ink `#1A1510`) — text and edge contrast.**
White text on ink = **18.13:1** (CLAUDE.md states 18.12:1 for this exact
pair — confirms arithmetic). Ink fill against cobalt ground = 2.13:1, ink
fill against periwinkle ground = 5.03:1 — both lower/different from the rest
state, but this doesn't matter for edge-definition on hover because the
white border persists across the hover swap and is still doing that job.

**No fourth AA failure is being introduced.** The three homepage failures
CLAUDE.md documents (cream nav links 3.40:1, lime "Menu" 2.75:1, cobalt
wordmark 2.37:1) are all **text or display-type** failures against the 4.5:1
or 3:1 *text* floors. Every number in this proposal that sits below 4.5:1
(the two border figures, #3 and #5) is a **non-text UI-component** contrast
judged against the 3:1 floor, and both pass it. Say this plainly rather than
letting a low-looking number get conflated with the three known failures:
none of mine are failures on the threshold they're actually judged against.
The one I'd flag for a human look regardless is #5, because 3.60:1 is a
pass with a thin enough margin that it belongs on a "confirm visually"
list, not a "trust the number and move on" list.

## Lime ruled out — the brief's instinct is right, with numbers

The brief says lime is off the table because "Work with me" already owns
it and a second lime pill would compete with the one real conversion CTA.
Agreed. Adding a number to it: lime `#C8F04A` on white text fails outright
(this is why `.tc-visit` in `index.css:254` pairs lime with ink `#1A1510`,
never white — lime is a light, saturated colour that cannot carry light
text). More to the point, CLAUDE.md is explicit that lime is "accent and
punctuation only, never a section ground," and a second full pill in the
same nav bar as the first lime pill is exactly a second "punctuation" mark
competing with the first, which the locked spec already rules out on its
own terms without needing my numbers. No disagreement to register.

## Forest green — checked against both hard constraints in the brief

**Contrast: covered above, sections 1-5.** Passes as a fill (with a border)
on both grounds; fails outright as a bare fill or as text-on-ground on
either.

**Does a forest pill next to a lime pill read cleanly or muddily?**
Checked by hue, not by eye, since I can't render it: lime `#C8F04A` sits at
hue ~74° (yellow-green); forest `#2D6A4F` sits at hue ~153° (blue-green,
teal-leaning). That's a 79° separation — roughly a fifth of the wheel apart,
and forest is also much darker (relative luminance 0.114 vs lime's 0.62-ish
in the same units) and far less saturated in appearance. This is not the
"two close hues directly adjacent" forbidden combination the spec's own list
names: that pattern is about near-duplicate hues blurring into each other
(e.g. two similar blues), and 79° apart with a large lightness gap is the
opposite of that. **I'd call this a pass, but it is INFERRED ABOUT
RENDERING** — hue math says "clearly different colours," a screenshot is
what actually confirms whether a small pill at 14-18px height reads that way
in practice, particularly at the anti-aliased edge where the white border
meets each fill. Confirm before treating this line as closed.

## The colour-job question, answered directly rather than left open

Forest green currently carries two real semantic jobs, both meaning
something like "this is the trusted/good thing": the IN MY STACK badge
(`.tc-chip-stack`, `index.css:221`) and the Green DPIA chip
(`.tc-dpia[data-flag="Green"]`, `index.css:235`). It also appears as one of
four rotating hero-pill fills, but CLAUDE.md is explicit that those pills
are "decorative draggable objects" with no semantic assignment per colour,
so that occurrence doesn't count as a "job" in the sense the spec's ceiling
cares about.

Using it a third time, for the button that navigates to the page the IN MY
STACK badge is describing, is **the same job extended to its own front
door**, not a new job bolted on. A reader who has met the forest badge on a
tool card and then sees a forest button labelled "My Stack" in the nav is
being told the same thing twice in a coherent way: forest = Jasmin's stack,
whether it's marking a card or naming the page. That is different in kind
from, say, giving forest to a fourth, unrelated concept (a filter chip, a
category label) which would be the genuine ceiling breach the spec is
worried about. I'd write this down as the one-line rule if it isn't already
somewhere: **forest green's job is "identifies Jasmin's own stack, on a
card or as a destination," and this button sits inside that job rather than
adding to it.**

## What would prove this wrong

- **Screenshot both nav grounds at the built pill height** (mobile is a
  separate question, see below) and check the white border actually reads
  as a line, not a blur, especially on periwinkle at the 3.60:1 margin.
  Failure mode to watch for: at small pill heights, 1.5px can anti-alias
  into invisibility on some displays even when the flat-colour ratio
  clears 3:1, because that ratio assumes a clean edge, not a
  sub-pixel-rendered one.
- **Screenshot the CTA cluster with My Stack sitting next to Work with me**
  on a cobalt route, and separately on the homepage, and check the forest
  pill doesn't read as "a duller lime" out of the corner of the eye at
  normal browsing distance. My hue-separation number says it shouldn't; a
  screenshot is what actually settles it.
- If either check fails, the fix is **not** a different hex chosen by eye —
  it's a wider border (2px instead of 1.5px) or a size increase, which are
  the same two levers already identified above, not a new colour needing a
  fresh ruling.

## Mobile — flagged as a scope question, not decided here

The brief's example ("Home / Tools / Design / Learning / AI News, with My
Stack as a distinct button") describes the desktop horizontal bar. The
mobile nav is a different layout entirely — a slide-out sheet
(`Layout.tsx:147-198`) where items are already full-width vertical rows, not
a bar with a text/pill distinction to make. I have not been asked to rule on
mobile and haven't decided it here, but flagging the gap rather than letting
it default silently: if My Stack should carry the same tier-2 identity on
mobile, the natural equivalent is styling its row with the same forest
fill/white text treatment sitting between the plain nav rows and the
full-width Work with me pill at the sheet's foot, rather than leaving it
identical to Home/Tools/Design/Learning/AI News as it is today. That is a
recommendation, not a ruling — it needs the same sign-off this desktop
treatment needs before anyone builds it.

## One thing I will not do

I have not proposed a token or component change. Nothing here should be
read as "go add `--stack-button` to `index.css`" — that's an implementation
decision for whoever builds this, and CLAUDE.md's own note that "an integer
HSL triple almost never round-trips" means whoever writes the token needs to
compute what it renders and check it against `#2D6A4F` exactly, the same
discipline that caught seventeen wrong tokens on 29 August. If this ships as
an HSL triple rather than the hex written above, that check is not optional.

## Summary of the hard constraints, one line each

- Nav ground works on both colours: **yes**, given the border (fails without
  it on both, see contrast #2 and #4 above)
- Lime avoided: **yes**, no disagreement with the brief's reasoning
- Forest checked on both grounds: **yes**, fails as bare fill, passes as
  fill+border; numbers above
- No fourth AA failure: **no new failure**, both borderline figures are
  non-text and judged against 3:1, not 4.5:1, and both clear it
- No new hex: **yes**, only locked hexes used (`#2D6A4F`, `#FFFFFF`,
  `#1A1510`) — no off-palette value proposed, so no ruling needed on that
  front the way `#C2410C` needed one
- Token round-trip warning: **flagged**, not yet applicable since nothing is
  built
- Hierarchy: **three tiers, three independent signals** (saturation, font
  weight, size), not colour alone
