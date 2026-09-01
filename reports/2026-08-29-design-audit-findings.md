# Design audit findings, 29 August 2026

Branch `overhaul/sector-axis`. No files were changed this session apart from
this one. Implementation is a separate session against an approved subset of
what follows.

**Method.** Four of the website design agents were run in parallel on the
fable model (design fidelity, UI visual audit, accessibility, and the cold
stranger read), and their findings were reconciled here. Every claim that
mattered was then re-verified in this session against the local dev server on
`http://localhost:8080` with live Sheet data, because three of the four
agents correctly flagged their strongest structural claims as arithmetic they
could not observe. Where a finding is measured, the measurement is given.
Where it is inferred, it says so and names the check still owed.

**One correction to the brief before anything else.** The directory is no
longer 15 rows. It renders **23 tool cards plus the spliced template card**,
counted in the DOM at every width. The Sheet has been filled since the
2026-08-26 note in `CLAUDE.md`. The ten-row merge floor in F2 is cleared with
room to spare, and the grid density questions below are answered at 23, not
15, with the 45-row ceiling treated separately.

---

## 1. The five things to fix first

1. **`src/components/ToolCard.tsx` has no responsive classes at all, and 17 of
   its 18 text runs sit inside an 11px to 14px band**, which is complaints 2
   and 3 sharing one cause in the one component the whole product rests on.
2. **`src/components/Layout.tsx:201-232` pushes "Work with me" completely
   off-screen between 768px and roughly 1086px**, so the consultancy link the
   site exists to feed is invisible on an iPad in portrait and on small
   laptops, and it fails silently because `Layout.tsx:70` clips it.
3. **`src/pages/Tools.tsx:114-142` collapses the category rail into a 128px
   track between 640px and roughly 1000px**, clipping two of the seven comms
   jobs off-screen and forcing horizontal page scroll from 640px to 739px.
4. **`src/pages/Tools.tsx:107` sticks the filter bar 64px below the nav**, so
   tool cards scroll visibly through the gap at every width; it is a
   one-class fix.
5. **`src/pages/PolicyTemplate.tsx:35` and `src/pages/Index.tsx:124` pin body
   copy hard left inside full-width sections**, leaving 736px and 720px of
   dead cream at 1440px, which is complaint 1 stated in code.

---

## 2. Findings

### F1. The tool card is one fixed layout asked to survive three widths

**Symptom.** On desktop every card reads as a dense, evenly weighted data
sheet with nothing leading the eye after the name. On a phone the identical
markup renders at identical sizes and identical padding, with tap targets
under half the recommended minimum.

**Where.** `src/components/ToolCard.tsx`, all 383 lines. Confirmed zero
`sm:`, `md:`, `lg:` or `xl:` prefixes in the file. Key lines: `:72` card
padding `p-5` at every width; `:95` name 20px; `:117` description 14px;
`:131` job chips 11px; `:182` pricing 13px; `:191`/`:197` nonprofit label
11px and value 13px; `:217` "The checks" 11px; `:241` DPIA chip 12px; `:266`
template link 12px; `:32`/`:38` AxisLine label 11px and value 13px, rendered
twice at `:275-280`; `:291` verdict toggle 13px; `:298` Checked stamp 11px;
`:311` verdict body 14px; `:349` Visit pill 13px. The grid it must survive is
`src/pages/Tools.tsx:314`.

**Cause, measured not inferred.** The HubSpot card at 1440px measures 386px
wide and 467px tall and contains **18 discrete text runs**. Their sizes:

| Size | Runs |
|---|---|
| 20px | 1 |
| 14px | 1 |
| 13px | 6 |
| 12px | 2 |
| 11px | 8 |

Seventeen of eighteen runs live in a 3px band. There is one element at 20px
and then nothing at all until 14px. Weight does no work either: 400, 500 and
600 are distributed with no correlation to importance, so "The checks"
divider label is 600 while the verdict body is 400. The label-above-value
pattern repeats six times per card with the only distinction a 2px size step
and a colour change from `#9A8F82` to `#1A1510`. That is why the card reads
as texture: it has plenty of difference and almost no hierarchy.

Measured card widths across the grid: 307px at 375, 321px at 390, 344px at
414, 244px at 640, 304px at 767, 305px at 768, 276px at 1024, 356px at 1280,
386px at 1440. The 244px rendering at 640px is the worst case and gets
exactly the same 20px padding and type as the 386px one.

**Proposed change.**
- Restore a scale step and cut a size. Description `:117` `text-sm` to
  `text-[15px] leading-relaxed`; DPIA chip `:241` 12px to 13px; template link
  `:266` 12px to 13px. Result is four sizes with roles: 11px labels and
  stamps, 13px metadata and chips, 15px reading text, 20px name.
- Collapse the two stacked axis rows. Rewrite `AxisLine` (`:30-44`) to the
  baseline-flex pattern the nonprofit row already uses at `:189-203`:
  `flex flex-wrap items-baseline gap-x-2 gap-y-0.5`, label 11px `#9A8F82`,
  value 13px 600 `#1A1510`. Saves roughly 34px per card and drops the stacked
  label-value repetitions from six to four.
- Same for pricing and nonprofit tier (`:180-203`):
  `flex items-baseline justify-between gap-3`.
- Promote the verdict toggle (`:285-295`) to `text-[14px] font-semibold`,
  colour `#2D35C9`, `min-h-[44px]` with padding absorbing the difference. See
  F6: it is currently the lowest-contrast text on the card at 2.49:1.
- Mobile padding `:72`: `p-4 sm:p-5`.
- Grid `Tools.tsx:314`: `grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6`, so
  a card never renders narrower than roughly 330px. At 23 rows this changes
  the row count at 1280 from 8 to 12, which is acceptable; see the ruling.

**Blast radius.** The template card at `Tools.tsx:225-258` shares the grid and
the `p-5` idiom and needs the padding change applied by hand. Nothing else
imports `AxisLine`. Card height equalisation via `h-full` is unaffected. The
grid change also affects `/my-stack` only if the same class string is reused
there, which it is not.

**Needs a ruling.** Yes, one: **at 1280px, is a two-column grid of wider,
calmer cards preferable to today's three columns of 356px cards?** Three
columns is denser and shows more of the 23 rows at once; two columns gives
the card room to breathe and makes the type scale fix land harder. I
recommend keeping three columns at `xl` and moving the second column to `md`,
which is what the class string above does, but the density trade is yours.

---

### F2. The consultancy CTA is off-screen between 768px and roughly 1086px

**Symptom.** On an iPad in portrait, and on any laptop window under about
1086px, the desktop navigation renders but "Get the template" is half cut off
and **"Work with me" is entirely invisible**. There is no horizontal
scrollbar and no visual clue anything is missing.

**Where.** `src/hooks/use-mobile.tsx:3` (`MOBILE_BREAKPOINT = 768`),
`src/components/Layout.tsx:70` (`overflow-hidden`), `:75` (container
`px-4 sm:px-12`), `:167` (nav item row), `:201-232` (the CTA cluster and the
"Work with me" pill).

**Cause, measured at 768px.** The nav's own content requires 991px plus 96px
of horizontal padding, so it needs a **1087px viewport to fit**. Measured
item positions at a 768px viewport:

| Item | Left | Right |
|---|---|---|
| Home | 48 | 121 |
| My Stack | 129 | 222 |
| Tools | 230 | 297 |
| Design | 305 | 384 |
| Learning | 392 | 481 |
| AI News | 489 | 574 |
| Read the Substack | 574 | 716 |
| Get the template | 736 | **866** |
| Work with me | 907 | **1039** |

Viewport is 768. Everything past 768 is gone. Every nav child carries
`whitespace-nowrap`, so nothing can shrink or wrap, and `Layout.tsx:70`'s
`overflow-hidden` clips the overflow instead of producing a scrollbar, which
is why this has never shown up as a broken page. The hook hands over from the
hamburger to the desktop nav at 768, roughly 320px too early.

**Proposed change.** `src/hooks/use-mobile.tsx:3`, `MOBILE_BREAKPOINT = 768`
becomes `1024`. That is not quite the 1087px the nav needs, so pair it with
one of: reduce the desktop nav gap at `Layout.tsx:167` from `sm:gap-2` to
`lg:gap-1`, or drop the secondary link cluster's `gap-5` to `gap-4` at
`:201`. Measured, those two together recover roughly 60px, which brings the
requirement under 1024. All four hook consumers degrade correctly at 768 to
1023: `Layout.tsx` keeps the hamburger, which works at any width;
`HomeGravity.tsx` serves its 13px pills; `DragHint.tsx` its mobile variant;
and the `Index.tsx` counter renders at 56px instead of 80px.

This also resolves the 640 to 767 mismatch the brief asked about, by making
the contract explicit and writeable in one line in the hook file: **the JS
breakpoint governs chrome at 1024, Tailwind `sm:` governs content layout at
640, and no element consults both.**

**Blast radius.** One constant, four consumers. The nav height pair
`h-14 sm:h-16` at `Layout.tsx:76` should move to `h-14 md:h-16` in the same
change, and that ripples to the `-mt-14 sm:-mt-16` hero offsets in
`CobaltZone.tsx:57`, `Index.tsx:82`, `PolicyTemplate.tsx:14` and
`LegalPage.tsx:14`. Do them in one commit or the phantom offsets return.

**Needs a ruling.** No for the breakpoint. Yes if you would rather cut nav
items than raise the breakpoint: **should the desktop nav lose the
"Read the Substack" secondary link, which would let the bar fit at 1024
without tightening any gaps?** I recommend raising the breakpoint and keeping
all three links, because the links are the conversion path.

---

### F3. The category rail collapses between 640px and roughly 1000px

**Symptom.** At a large phone in landscape or a small tablet, the seven comms
jobs stack into a narrow ragged column pushed to the right of the search box,
two of them clipped off the right edge of the screen, and from 640px to 739px
the whole page scrolls sideways.

**Where.** `src/pages/Tools.tsx:114` (the row container),
`:118-122` (search, `sm:max-w-[400px]`), `:135` (rail wrapper,
`sm:flex-1 min-w-0`), `:142` (the rail itself,
`flex gap-2 flex-nowrap overflow-x-auto ... sm:flex-wrap sm:overflow-visible`),
`:165` (the fade, now `sm:hidden`).

**Cause, measured at 640px.** At `sm` and up the row becomes horizontal, the
search box takes its 400px maximum, and the rail gets what is left. Measured
rail track: **128px**. Measured chip widths: ALL 52, Research 98, Appeals and
fundraising 188, Case studies and storytelling 228, Social 78, Internal comms
144, Accessibility 124, Translation 117. The widest chip is 228px, which is
100px wider than its own track. Because `sm:` also turns the mobile
horizontal scroller off (`sm:overflow-visible`), the chip has nowhere to go
and escapes the viewport: measured page `scrollWidth` **692px against a 640px
viewport**. Confirmed by screenshot: the rail renders one chip per line down
the right-hand side with "Appeals & fundraising" and "Case studies &
storytelling" running off the edge.

The break resolves at 740px, where the track finally exceeds 228px, and I
measured no overflow at 739 or 745 because the browser rounds; treat 740 as
the boundary. But the rail stays visually broken well past that: at 739px and
at 900px it is still a narrow right-hand column stacking one or two chips per
line. It only reads correctly from about 1024px, which I confirmed by
screenshot.

This is a side effect of the F2c ruling of 26 August, which was right for
wide screens. Making the rail wrap at `sm` and up removed the scroller in a
band where the track is still far too narrow to wrap into.

**Proposed change.** Move the wrap to the width where the track can actually
hold the widest chip. At `Tools.tsx:142`, replace
`sm:flex-wrap sm:overflow-visible` with `lg:flex-wrap lg:overflow-visible`,
and at `:165` replace `sm:hidden` with `lg:hidden` so the fade follows the
scroller as it was designed to. Then give the rail its own row rather than
sharing one with the search box below `lg`: at `:114` change
`sm:flex-row sm:items-center` to `lg:flex-row lg:items-center`, and at `:120`
change `sm:w-[260px] sm:shrink-0` / `sm:max-w-[400px]` to the `lg:`
equivalents. Below `lg` the search box goes full width on its own line and
the rail scrolls horizontally underneath it, which is exactly the mobile
behaviour that already works at 375px.

**Blast radius.** `/tools` only. The scrolled and unscrolled compact states
both key off the same class strings, so both need the change together. No
other page uses this rail.

**Needs a ruling.** No. This restores behaviour that already works at 375px
to the band where it is currently missing, and it does not reopen F2c: at
`lg` and up the rail still wraps and no job is hidden.

---

### F4. The sticky filter bar sits 64px below the nav

**Symptom.** Scroll `/tools` and tool cards slide visibly through a band
between the navigation bar and the search and filter bar. Fragments of card
text, chips and pricing are permanently visible in that strip.

**Where.** `src/pages/Tools.tsx:107` (`sticky top-14 sm:top-16`),
`src/components/Layout.tsx:70` (the `h-dvh flex flex-col overflow-hidden`
shell) and `:239-244` (the `#app-scroll` pane).

**Cause, observed.** `sticky` offsets resolve against the nearest scrolling
ancestor, which is `#app-scroll`, not the window. The nav is a flex sibling
above that pane, not an overlay, so the pane's top edge already sits at the
nav's bottom edge. `top-14 sm:top-16` therefore reserves a second, phantom
nav height. Measured at 1280px with the pane scrolled to 700px: nav bottom
64px, pane top 64px, bar top **128px**, computed sticky offset **64px**,
giving a 64px gap. Confirmed by screenshot: card content including
"APPEALS & FUNDRAISING", "Free CRM / Marketing Starter from £18 a month" and
"IN MY STACK" is clearly visible scrolling through the band. The classes are
a relic of a window-scrolling layout with a fixed nav; the pane change made
for the iOS bounce bug silently invalidated them.

**Proposed change.** `Tools.tsx:107`, `sticky top-14 sm:top-16` becomes
`sticky top-0`.

**Blast radius.** No other file uses `sticky top-14`. The `-mt-14 sm:-mt-16`
hero offsets are the same stale-shell pattern but are self-cancelling
(negative margin plus equal padding) and cosmetically harmless; leave them
unless F2's nav height change lands, in which case do them together.

**Needs a ruling.** No.

---

### F5. Body copy pinned hard left inside full-width sections

**Symptom.** On a 1440px screen the main pages read as a narrow ribbon of
text down the left with half the viewport empty cream. On the homepage it
happens twice in a row.

**Where and measured at 1440px.**

| Location | Content width | Left | Right | Dead space right |
|---|---|---|---|---|
| `src/pages/PolicyTemplate.tsx:35` | 640px | 64 | 704 | **736px (51%)** |
| `src/pages/Index.tsx:124` intro | 640px | 80 | 720 | **720px (50%)** |
| `src/components/AboutPanel.tsx:8` | 640px | 80 | 720 | **720px (50%)** |
| `src/pages/Tools.tsx:300` DPIA note | 720px | 80 | 800 | 640px |

`PolicyTemplate.tsx:35` is the worst: measured `margin-left: 0px`,
`margin-right: 0px`, so it is not centred and has no container at all, just
`md:px-16` on the section. `Index.tsx:124` and `AboutPanel.tsx:8` are two
consecutive sections at exactly half the container each, so the homepage runs
two full screens' width of nothing before the three-column strip finally uses
the page.

`src/components/LegalPage.tsx:49` is the proof the codebase already knows the
right idiom: `mx-auto` with `maxWidth: 800`, and it measures correctly.

**Correction to the brief.** `Tools.tsx:98` (`maxWidth: 520`) is **not** a
dead-space instance. Its parent at `Tools.tsx:95` is
`flex flex-col items-center justify-center py-20 text-center`, so it renders
centred. Verified in the source and in the DOM. Do not count it.

**Proposed change.** The measures themselves are right and should not be
widened: 640px at 17px is about 75 characters per line, which is the
legibility target. The problem is compositional, so the fix is to put
existing content in the empty half, not to stretch the column.

- `PolicyTemplate.tsx:35`: add `mx-auto`. One class, matches
  `LegalPage.tsx:49`, and it is the single highest-value character in this
  finding.
- `Index.tsx:123-124` and `AboutPanel.tsx:7-8`: compose the intro and
  "What this is" into one 12-column grid at `lg`. Wrap both in
  `lg:grid lg:grid-cols-12 lg:gap-x-16`, intro `lg:col-span-6`, About
  `lg:col-span-5 lg:col-start-8`. Existing content fills the void, the page
  gets materially shorter, and no new copy is needed.
- `Tools.tsx:300`: leave the 720px measure. It is a deliberate reading width
  above a full-width grid and it only reads as dead space because the
  homepage established the pattern. Fix the homepage and this stops reading
  as a fault.

**Blast radius.** `PolicyTemplate` is one class and changes nothing else.
The homepage change alters the source order relationship between the intro
and the About panel at `lg` only; below `lg` the current stack is preserved
exactly. The dashboard strip at `Index.tsx:195` is untouched.

**Needs a ruling.** Yes, one: **may the homepage intro and the "What this is"
panel sit side by side at 1024px and up, rather than stacked?** It changes
the reading order of the page's opening argument, which is yours to place.

---

### F6. The verdict, the thing no other directory publishes, is the least
visible text on the card

**Symptom.** The "Honest verdict" toggle is the faintest interactive element
on a tool card, while the lime "Visit tool" pill that sends the reader away
is the loudest thing on it.

**Where.** `src/components/ToolCard.tsx:292` (toggle colour `#9B9FE0`),
`:313` (verdict border `#9B9FE0`), `:134` (selected job chip background
`#9B9FE0`), `:339-380` (the lime pill).

**Cause, measured.** `#9B9FE0` on `#FFFFFF` computes to **2.49:1** against a
4.5:1 AA requirement at 13px, and against 3:1 for a user interface component.
I confirmed the rendered colour in the browser as `rgb(155, 159, 224)`.
`#9B9FE0` is not in the locked palette at all, so it is free to change
without a ruling. Meanwhile the lime pill is the only element on the card
styled as a primary button, and it repeats once per card, which at 23 cards
makes lime the de facto colour of "outbound link" across the grid. The locked
rule is that electric lime is accent punctuation only, never a category
colour or a badge.

**Proposed change.**
- `:292` `#9B9FE0` to `#2D35C9` (measured **8.52:1**), weight 500 to 600, per
  F1's promotion of the toggle to a 44px row.
- `:313` verdict border `#9B9FE0` to `#2D35C9`.
- `:134` selected job chip background `#9B9FE0` with white text (2.49:1)
  to `rgba(250,248,244,0.15)` with `#FAF8F4` text, which is exactly what the
  IN MY STACK badge already does in the selected state at `:146`.
- Demote the Visit pill (`:339-380`) to a text link: 14px, weight 500,
  `#2D35C9`, keeping the trailing arrow, placed in the act row opposite the
  verdict toggle. This removes 23 lime stamps from the grid, returns lime to
  punctuation, saves roughly 46px of card height, and leaves the template
  card's lime button as the only lime on the page, which is the emphasis it
  should have had.

**Blast radius.** ToolCard only for the colour changes. The pill demotion
changes the visual weight of the outbound link on every card, and the same
hand-copied lime pill pattern exists in four other places
(`Tools.tsx:244-251`, `WhatsNewCard.tsx:135-146`, `MyStack.tsx:278-287`,
`FooterEmailCapture.tsx:39-51`); this finding does not propose touching
those, but they are the reason a single shared pill component would be worth
having later.

**Needs a ruling.** Yes, one, and it is the important one in this document:
**should the lime pill stop being the site's primary button?** The locked
rule says lime is punctuation only and cobalt carries CTAs, but lime buttons
are established in at least five places and clearly work. Either the buttons
move to cobalt or the lock gains a "lime is the primary button fill" line.
I recommend demoting it on the tool card specifically, because there it
competes with the verdict, and leaving the other four alone pending a
separate decision.

---

### F7. The 404 page renders its message invisibly

**Symptom.** The "Page not found" message cannot be seen. The page is also
entirely off-brand: mud-brown ground, no cream, no cobalt.

**Where.** `src/index.css:28-29` and `src/pages/NotFound.tsx:12,15`.

**Cause, observed.** `--muted: 30 11% 55%` and `--muted-foreground:
30 11% 55%` are the identical HSL triple. `NotFound.tsx:12` puts `bg-muted`
on the wrapper and `:15` puts `text-muted-foreground` on the message, giving
a **1.00:1** contrast ratio. Confirmed in the browser: computed colour
`rgb(153, 140, 128)` on computed background `rgb(153, 140, 128)`, identical,
and confirmed by screenshot showing "404" and "Return to Home" on a brown
field with no visible message between them. The "Return to Home" link below
it measures 2.69:1, also a fail.

`NotFound.tsx` also carries zero locked palette values and zero responsive
classes; it is untouched shadcn boilerplate.

**Proposed change.** Two parts, and take both.
- Token: make `--muted-foreground` a genuinely darker value. `#9A8F82` is the
  locked muted hex and it is what `--muted` currently resolves to, so the
  clean fix is to leave `--muted` as the surface and set `--muted-foreground`
  to the ink, `30 20% 8%`. That also stops any other `text-muted-foreground`
  use rendering at 3.17:1.
- Page: rebuild `NotFound.tsx` on the locked palette. `bg-[#FAF8F4]`, h1 in
  `font-heading` at `#1A1510`, body at `#1A1510`, link at `#2D35C9`. No new
  copy: the existing strings stay exactly as they are.

**Blast radius.** Changing `--muted-foreground` affects every
`text-muted-foreground` consumer. Grep before changing; the search input
placeholder at `Tools.tsx:129` uses `placeholder:text-muted` and would
darken, which is an improvement, but check it.

**Needs a ruling.** No. This is a defect, not a design choice.

---

### F8. The tools grid delegates its hierarchy to the cursor

**Symptom.** Moving the mouse across `/tools` makes the whole page churn:
the card under the pointer inverts to solid cobalt while every other card
drops to 70% opacity and 98% scale. On a touch device the same state is
reached by tapping and does not clear.

**Where.** `src/pages/Tools.tsx:199-213` (`hoveredCard`, `isSelected`,
`isDimmed` and the two mouse handlers), `src/components/ToolCard.tsx:70-71`
(the handlers), `:72-87` (the inversion), and the roughly 20 `style={{}}`
blocks that branch on `isSelected`.

**Cause.** Verified in the browser: with one card in the selected state, that
card measured `rgb(45, 53, 201)` at opacity 1 and every one of its five
sampled neighbours measured opacity **0.7**. The state persisted across
several subsequent measurements with no pointer leaving the card.

Verified in the source: `ToolCard` and `Tools` use `onMouseEnter` and
`onMouseLeave` only. There is no hover-capability gate, no pointer or touch
handling, and no timeout. That is a code fact, not an inference.

The touch consequence follows from those two facts: a tap produces a
compatibility `mouseenter` with no matching `mouseleave` until another
element receives one, so the card stays inverted and the rest of the grid
stays dimmed. I reproduced the stuck state and its persistence in the
browser, but **not on a real touch device**, so the on-device confirmation is
still owed before this specific sentence is repeated as an outcome.

The inversion is also the reason ToolCard is written almost entirely in
inline styles rather than classes, which is what disconnects it from the
token system, and it is where the off-palette `#9B9FE0` came from.

**Proposed change.** Delete the inversion and the sibling dimming. In
`ToolCard.tsx:72-87`, hover becomes `borderColor: "#2D35C9"` plus the
existing shadow; remove the `isDimmed` opacity and scale, and remove the
`isSelected` colour fork throughout. In `Tools.tsx:199-213`, drop
`hoveredCard` and pass nothing. This converts most of the card's inline
styles to static Tailwind classes in one move, which is the beachhead for the
token work in section 5.

If you want to keep the flourish, the minimum safe version is to gate it:
read `window.matchMedia("(hover: hover) and (pointer: fine)").matches` once
into state in `Tools.tsx` and pass no-op handlers when false. I do not
recommend it. A full colour inversion plus sibling dimming is a great deal of
ceremony for a hover, and it is the direct cause of three separate problems.

**Blast radius.** `Tools.tsx` and `ToolCard.tsx`. The DPIA chips and the
failure badge already hold their own backgrounds through the inversion, so
nothing locked changes appearance.

**Needs a ruling.** Yes: **may the cobalt hover inversion and the
neighbour dimming be removed outright?** It is a deliberate piece of the
current design and I am recommending deleting it, so it is your call.

---

### F9. The mobile homepage spends its first screen on decoration

**Symptom.** On a 375px phone the first screen is a periwinkle wall: a nav
bar containing only the word "Menu", display type largely buried under
falling tool pills, a large empty periwinkle void, and no statement anywhere
of what the site is or who it is for. The proposition sits below the fold.

**Where.** `src/pages/Index.tsx:82` (hero `min-h-[78vh]`), `:93-116` (the two
`h1` elements), `:86` (the `HomeGravity` pill layer at `z-20 inset-0`),
`src/components/Layout.tsx:78-81` (the empty mobile masthead slots).

**Cause, observed.** Confirmed by screenshot at 375px. Measured: the "Edit."
`h1` renders at its 160px clamp floor and is **clipped by 2px**
(`scrollWidth` 345 against `clientWidth` 343), because at 375px the `38vw`
term computes to 142.5px so the floor wins and the word sets wider than the
proportional fit. The hero reserves 78vh and the pills settle over the type,
leaving the lower half of the hero empty.

**Proposed change.**
- `Index.tsx:82`: `min-h-[78vh]` to `min-h-[56svh]`, leaving `sm:min-h-[100vh]`
  untouched, so the existing intro line crests the fold on a phone. Use `svh`
  rather than `vh`: because the window itself never scrolls (`Layout.tsx:70`),
  mobile browsers never collapse the URL bar, so `vh` overstates the usable
  height.
- `Index.tsx:108`: `clamp(160px, 38vw, 560px)` to `clamp(120px, 38vw, 560px)`
  so the vw term governs on phones and the word fills rather than clips.
  Apply the same to "The" at `:96`.
- `Layout.tsx:80`: put the site name in the empty left slot on mobile,
  `font-heading` 700 at 18px, `#FAF8F4`, linking to `/`. **The exact wordmark
  string is a copy call and I am not supplying it**; request it from the copy
  process.

**Blast radius.** Homepage hero and the mobile nav row only. The hero clamp
also governs where the pills settle, since the canvas height follows the
hero. Desktop is untouched.

**Needs a ruling.** Yes, two: **may the mobile hero come down to roughly 56svh
so the intro line is visible without scrolling?** and **what is the exact
wordmark string for the mobile masthead?**

---

### F10. Requested font weights that the site does not load

**Symptom.** The largest display type on the site renders slightly smeared
rather than crisp, and the news card labels look muddy.

**Where.** `index.html:30` loads Chillax at 400, 500, 600 and 700 only.
`index.html:31` loads Plus Jakarta Sans at 400, 500 and 600 only. Against
that: `font-black` (900) is requested at `Index.tsx:94` and `:106`,
`PolicyTemplate.tsx:18` and `LegalPage.tsx:18`; `fontWeight: 800` on the body
face at `WhatsNewCard.tsx:55`, `:75` and `:169`; `fontWeight: 700` on the body
face at `WhatsNewCard.tsx:261` and `Layout.tsx:90`.

**Cause, verified in the browser.** The loaded font face list is Chillax 400,
500, 600, 700 and Plus Jakarta Sans 400, 500, 600. There is no 800 or 900
face for either family, so the browser synthesises those weights. Note that
`document.fonts.check()` returns `true` for them, because it reports whether
the text can be rendered at all, not whether the exact weight exists; the
face list is the reliable signal.

**Proposed change.** `font-black` to `font-bold` in the four display
locations. Body-face 700 and 800 to 600 in the five locations above, which
also restores the locked rule that body weights are 400, 500 and 600.

**Blast radius.** Visual weight of the homepage hero, the policy and legal
page heroes, and the news card labels. All get lighter and cleaner. No layout
reflow, since the metrics of a synthesised weight and its base are close.

**Needs a ruling.** Soft. If 900 display type is the intent, the locked line
should read "Chillax 400 to 700, 700 default" and the heroes should load a
real heavier face rather than faking one. Flagged, not folded into the fix.

---

### F11. Off-palette hex values in live render paths

**Symptom.** Colours appear on the site that are not in the locked system.

**Where and counts**, from a full scan of `src/pages` and `src/components`
excluding `ui/`:

| Value | Count | Where | Job it has taken |
|---|---|---|---|
| `#9B9FE0` | 3 | `ToolCard.tsx:134,292,313` | A fourth blue. Dies with F6 |
| `#4A4A9A` | 3 | `Index.tsx:15`, `WhatsNewCard.tsx:36`, `HomeGravity.tsx:10` | A live news category colour |
| `#E8572A` | 3 | `Index.tsx:16`, `WhatsNewCard.tsx:37`, `HomeGravity.tsx:11` | A live news category colour and hero pill |
| `#F5F0E8` | 2 | `WhatsNewCard.tsx:102` | Near-cream invention |
| `#4A4440` | 2 | `PolicyTemplate.tsx:42` | A third text colour |
| `#1A22A8` | 2 | `Learning.tsx:147` | Improvised cobalt hover |
| `#D1D5DB` | 1 | `Learning.tsx:58` | Tailwind grey standing in for the locked border |
| `#9B7B3A` | 1 | `DesignKit.tsx:11` | Invented ochre badge |
| `#6B7280` | 1 | `DesignKit.tsx:12` | Grey used as a badge |

Also 5 instances of lowercase `#ffffff` against 33 uppercase, which is
cosmetic but worth normalising whenever those lines are touched.

**Proposed change.** The unambiguous ones now: `Learning.tsx:58` `#D1D5DB` to
`#E8E2D8`; `PolicyTemplate.tsx:42` `#4A4440` to `#1A1510`;
`WhatsNewCard.tsx:102` `#F5F0E8` to `#EEF0FB` with `#2D35C9` text;
`DesignKit.tsx:11-12` both badges to the established `#EEF0FB` with `#2D35C9`
text, since the word carries the meaning and the never-colour-alone rule
applies. `#9B9FE0` is handled by F6.

**Needs a ruling.** Yes, two, and they are gaps in the locked spec rather
than code bugs.
1. **The news category colour map.** It holds five values, two of them off
   palette, and it lives in three files. `CLAUDE.md` says burnt orange
   `#E8572A` "renders nowhere"; it renders in three places. Either the
   palette gains two entries or the categories collapse to one chip style.
   **Which?**
2. **Cobalt buttons have no locked hover state.** Sessions have improvised
   `#1A22A8` in Learning, `#1A1510` in PolicyTemplate, and a lime swap in
   ToolCard. **What is the locked cobalt hover?**

---

### F12. The news card leads with the wrong element, and reserves space in
fixed pixels

**Symptom.** On `/ai-news` the developer name reads as the headline and the
story title as a subtitle. On a phone each card carries a large blank band at
the bottom, and long titles risk running under the category badge.

**Where.** `src/components/WhatsNewCard.tsx:162-179` (developer at 12px
weight 800 uppercase above a 17px weight 600 title), `:55`/`:75` (the same
inversion in LeadCard at 13px 800 against 22px 700), `:231` (LeadCard padding
`20px 20px 64px`), `:240` (`paddingRight: 110` reserving space for an
absolutely positioned badge, applied to the developer row only and not the
title), `:360` (GridCard's 56px bottom reserve), `:322` and `:424` (two
separate expand affordances doing one job).

**Cause.** An 800-weight uppercase near-black label beats a 17px semibold
headline, so the eye reads the vendor as the story. The bottom padding exists
to protect an absolutely positioned toggle, and the right padding to protect
an absolutely positioned badge; both are hand-sized for desktop and neither
adapts, so on a phone they are simply dead space and an unguarded collision
risk.

**Proposed change.** Title first, then one 11px `#9A8F82` line carrying
developer and date together; developer weight 800 to 600 and tracking 0.1em
to 0.05em. Reordering is structure, not copy, and no strings change. Put the
badge in flow as a `flex items-start justify-between gap-3` row and delete
`paddingRight: 110`. Put the toggle in flow at the card foot with
`mt-auto pt-3` inside the existing flex column and delete the 64px and 56px
reserves. Roughly 40px shorter per card on a phone and no collision at any
width. Drop the whole-card `onClick` at `:322` so there is one affordance.

**Blast radius.** LeadCard and GridCard, so all of `/ai-news` and the
homepage news strip. The hover lift is untouched.

**Needs a ruling.** No for the layout. The category colour question is F11.

---

## 3. The width matrix

Every page against every width the brief listed. Measured on the local dev
server against live Sheet data. **W** works, **D** degraded, **B** broken.

| Page | 375 | 390 | 414 | 640 | 767 | 768 | 1024 | 1280 | 1440 |
|---|---|---|---|---|---|---|---|---|---|
| `/` | D | D | D | D | D | D | W | D | D |
| `/tools` | D | D | D | **B** | **B** | D | D | D | D |
| `/ai-news` | D | D | D | D | D | D | W | W | W |
| `/my-stack` | D | D | D | D | D | D | W | W | W |
| `/design-kit` | D | D | D | D | D | D | W | W | W |
| `/learning` | D | D | D | D | D | D | W | W | W |
| `/policy-template` | W | W | W | W | W | W | D | D | **B** |
| legal (`LegalPage`) | W | W | W | W | W | W | W | W | W |

Notes on every degraded and broken cell.

- **`/` at 375, 390, 414.** Hero reserves 78vh, display type partly obscured
  by the settled pill layer, "Edit." clipped by 2px at its clamp floor, and
  the site's proposition sits below the fold. No horizontal scroll. F9.
- **`/` at 640, 767, 768.** Same hero problem, plus the nav at 768 loses
  "Work with me" entirely and clips "Get the template". F2, F9.
- **`/` at 1024.** Works. Nav fits, hero is a deliberate full-height brand
  moment at desktop, dead space not yet pronounced.
- **`/` at 1280, 1440.** Two consecutive left-pinned 640px columns leaving
  720px of dead cream each at 1440. F5.
- **`/tools` at 375, 390, 414.** Grid is a clean single column and the
  category rail scrolls horizontally as designed. Degraded, not broken, for
  three reasons: 30 tap targets under 24px, the 64px sticky gap, and the card
  type scale. F1, F4.
- **`/tools` at 640.** **Broken.** Page scrolls sideways, measured
  `scrollWidth` 692 against a 640 viewport; two of seven job filters clipped
  off-screen; cards render at 244px with 20px desktop padding. F3, F1.
- **`/tools` at 767.** **Broken.** No horizontal overflow at this exact
  width, but the rail is still a one-chip-per-line column pinned right of the
  search box and unusable as a filter. F3.
- **`/tools` at 768.** Rail still cramped, nav CTA off-screen, sticky gap.
  Degraded rather than broken because nothing is clipped beyond the viewport
  on the page itself. F2, F3, F4.
- **`/tools` at 1024.** Rail finally reads correctly. Still degraded by the
  sticky gap and the card type scale. F1, F4.
- **`/tools` at 1280, 1440.** Same, plus 386px cards carrying 18 text runs in
  a 3px type band. F1, F4.
- **`/ai-news`, `/my-stack`, `/design-kit`, `/learning` at 375 to 768.**
  Degraded for the shared reasons: sub-24px tap targets (51 on `/design-kit`,
  26 on `/my-stack`), fixed-pixel padding reserves on the news cards, and the
  nav CTA loss at 768. F2, F12, and the contrast table below.
- **`/policy-template` at 1024, 1280.** Left-pinned 640px column, 320px and
  576px dead respectively. F5.
- **`/policy-template` at 1440.** **Broken** by the brief's own standard:
  736px of dead space, 51% of the viewport, measured margins 0 and 0, no
  container. It is the worst instance on the site. F5.
- **Legal pages.** Work at every width. `LegalPage.tsx` carries ten
  responsive classes and `clamp()` type, and its body column is properly
  centred at `maxWidth: 800`.

**Correction to the brief.** The brief listed `NotFound.tsx`,
`PrivacyPolicy.tsx`, `CookiePolicy.tsx` and `TermsOfService.tsx` as having no
responsive classes at all. That is literally true and materially misleading
for three of the four: the legal pages are content-only wrappers that render
through `LegalPage.tsx`, which is one of the better-built components on the
site. They need no responsive classes of their own. `NotFound.tsx` is the
real offender and it is a different problem, F7.

**At the 45-row ceiling.** The grid is 23 cards today, not 15. At 1280px in
three columns that is 8 rows; at 45 rows it becomes 15 rows of scroll. Two
things follow. First, the F1 card height reduction of roughly 80px to 100px
is worth about 1.5 screens of scroll at the ceiling, so it pays for itself
twice over. Second, at 45 rows the filter rail stops being a convenience and
becomes the primary navigation, which raises the priority of F3 rather than
lowering it.

---

## 4. Contrast audit

Every ratio below was computed from the hex values using WCAG relative
luminance and independently reproduced in this session. AA is 4.5:1 for
normal text and 3:1 for large text (18.66px and above regular, or 14px and
above bold) and for user interface components.

### Fails

| Pair | Ratio | Size and use | Where | Smallest fix |
|---|---|---|---|---|
| `#9B9FE0` on `#FFFFFF` | **2.49:1** | 13px w500, the verdict toggle | `ToolCard.tsx:292` | `#2D35C9`, gives 8.52:1. Off-palette value, no ruling needed |
| `#FFFFFF` on `#9B9FE0` | **2.49:1** | 11px w600 job chips, selected card | `ToolCard.tsx:134` | `rgba(250,248,244,0.15)` ground with `#FAF8F4` text, matching `:146` |
| `text-muted-foreground` on `bg-muted` | **1.00:1** | 20px, the 404 message | `index.css:28-29`, `NotFound.tsx:15` | Set `--muted-foreground` to `30 20% 8%` |
| `#9A8F82` on `#FAF8F4` | **2.99:1** | 11px to 18px, widespread | `Tools.tsx:98,300`, `Index.tsx:198,233,266,285,297`, `PolicyTemplate.tsx:93`, `ErrorState.tsx:6,16` | Locked value, flagged below |
| `#9A8F82` on `#FFFFFF` | **3.17:1** | 11px and 13px, 7 uses per tool card | `ToolCard.tsx:33,183,192,218,299,323`, `WhatsNewCard.tsx:251,375`, `MyStack.tsx:212,366`, `Learning.tsx:116,123,134` | Locked value, flagged below |
| `rgba(250,248,244,0.6)` on `#2D35C9` | **3.86:1** | 11px to 16px, selected card | `ToolCard.tsx:33,183,192,299,323`, `CobaltZone.tsx:128` | Raise alpha to 0.80, gives 5.69:1 |
| `rgba(255,255,255,0.65)` on `#2D35C9` | **4.49:1** | 16px w400 | `DesignKit.tsx:156` | Alpha 0.75, gives 5.18:1. Fails by 0.01 |
| `#FAF8F4` on `#7B7FD4` | **3.40:1** | 14px w500 nav, homepage only | `Layout.tsx:64,188-192` | `#1A1510` gives 5.03:1, or run the cobalt nav on the homepage too |
| `rgba(255,255,255,0.7)` on `#7B7FD4` | **2.59:1** | 16px w500 mobile menu, homepage | `Layout.tsx:121-124` | Full white is still only 3.60:1; use ink, or a cobalt sheet ground |
| `#C8F04A` on `#7B7FD4` | **2.75:1** | 11px w700 "Menu" and the hamburger glyph | `Layout.tsx:89-97` | `#1A1510` on the homepage, gives 5.03:1 |
| `rgba(250,248,244,0.4)` on `#1A1510` | **3.69:1** | 12px footer legal links | `Layout.tsx:300-319` | Alpha 0.6, gives roughly 7:1 |
| `#FFFFFF` on `#7B7FD4` | **3.60:1** | 10px to 11px w800 news badge | `WhatsNewCard.tsx:32-38,80-84`, `Index.tsx:13,251-263` | Darker variant, e.g. `#5157B5` at 6.21:1. Palette question, F11 |
| `#FFFFFF` on `#E8572A` | **3.60:1** | 10px to 11px w800 news badge | Same | Darker variant, e.g. `#B83E1C` at 5.61:1. Palette question, F11 |
| `#FFFFFF` on `#9B7B3A` | **3.97:1** | 11px w500 freemium pill | `DesignKit.tsx:11` | `#86682B` gives 5.21:1, or take the `#EEF0FB` chip from F11 |
| `#7B7FD4` on `#2D35C9` | **2.37:1** | 48px to 200px display h1 | `LegalPage.tsx:17-27`, `PolicyTemplate.tsx:17-27` | Locked pair, flagged below |
| `#2D35C9` on `#7B7FD4` | **2.37:1** | 120px to 560px homepage hero | `Index.tsx:93-116` | Locked pair, flagged below |

### Passes, recorded so the type-scale change does not undo them

Every DPIA chip passes with real margin: Green `#2D6A4F` on `#E4F0E9`
**5.46:1**, Amber `#7A5200` on `#FAF0DB` **6.11:1**, Red `#A8261C` on
`#FBE9E6` **6.05:1**. The failure badge, white on `#A8261C`, measures
**7.10:1**, so the "roughly 7:1" comment at `ToolCard.tsx:161` is accurate.
IN MY STACK, white on `#2D6A4F`, is **6.39:1**. Cobalt on the chip tint is
**7.50:1**, cobalt on cream **8.03:1**, cobalt on white **8.52:1**, ink on
cream **17.09:1**, ink on white **18.12:1**, ink on lime **13.83:1**, lime on
cobalt **6.50:1**.

**Two squeaks to watch, because a type-scale change is being proposed.**
White at 0.7 alpha on cobalt measures 4.95:1 and desktop secondary nav links
measure about 4.72:1. Both pass now at 16px and 14px, with under half a point
of headroom. Do not reduce either tint or either size.

### Flagged locked-palette items, for your ruling and not for a code session

1. **Muted `#9A8F82` cannot carry text on cream at any size.** It measures
   2.99:1, which is below even the 3:1 large-text floor. On white it is
   3.17:1. It is used for the majority of the labels on the tool card, at
   11px. The smallest palette change that fixes it is darkening muted to
   about `#78706A`, which measures 4.58:1 on cream and 4.85:1 on white. The
   alternative is ratifying that muted is decorative and never carries text,
   which would mean rewriting roughly 19 usages. **Which?**
2. **Periwinkle and cobalt against each other measure 2.37:1 in both
   directions**, and that pair carries the homepage hero wordmark and the
   `h1` on every legal and policy page. As real text it is subject to 1.4.3
   at every size. Options: `#FAF8F4` on cobalt at 8.03:1, or `#C8F04A` on
   cobalt at 6.50:1, or ship the homepage wordmark as an image with
   equivalent alt text and accept the hero as decoration. **Which?**
3. **The news badge colours cannot pass at badge sizes** in either direction,
   which is the same decision as F11's category map.

These three are the whole of the "existing AA debt" the brief asked me to
price. Item 1 is the expensive one: it is not a colour tweak, it is roughly
19 call sites and it touches the component the moat lives in.

---

## 5. Structural recommendation: tokens now, or a separate job?

**A separate job, scheduled immediately after the layout fixes, with one rule
binding the layout work in the meantime: it may not add a single new inline
hex.**

The reasoning, in one line each.

The repo's own working discipline is "one job per change, never combine two
changes", and it is right here more than anywhere. The layout fixes in F1 to
F5 are reviewable as pure structure diffs; folding a colour-source migration
across roughly twenty files into those same commits makes every diff a mixed
structure-and-colour change, in precisely the codebase where colour drift is
the documented failure mode.

More decisively: **you cannot tokenise a value until you have ruled on what
it should have been.** F11 lists nine off-palette hexes, and three of them
sit behind open questions you have not yet answered (the news category map,
the cobalt hover, the lime button). A tokenisation pass run today would have
to invent answers to all three, which is exactly how the drift happened in
the first place.

There is also a sequencing benefit. F8 removes the hover inversion, and that
alone converts most of `ToolCard`'s twenty inline style blocks into static
classes, because the inversion is why they are inline. Do F8 first and the
tokenisation job gets substantially smaller before it starts.

So: fix layout, take the F6 and F11 rulings, then one dedicated commit
converting inline hex to the tokens that already exist in `src/index.css` and
`tailwind.config.ts` and are merely bypassed.

**What would change my mind:** if F1 turns into a wholesale rewrite of
`ToolCard.tsx` rather than a set of edits, tokenise inside that rewrite,
because the whole file is new either way and a second pass over it would be
waste.

---

## 6. Things you did not ask about, and things that turned out to be wrong

### Corrections to the brief's evidence

1. **The directory is 23 rows, not 15.** Counted in the DOM at every width:
   23 tool cards plus the template card. The Sheet has been filled since
   26 August. This is good news for the F2 merge floor and it changes the
   density arithmetic throughout.
2. **`Tools.tsx:98` is not a dead-space instance.** Its parent at `:95` is
   `items-center text-center`, so the 520px block renders centred. Verified
   in source and in the DOM. Three of the four listed dead-space instances
   are real; this one is not.
3. **The legal pages' "no responsive classes" is misleading.**
   `PrivacyPolicy.tsx`, `CookiePolicy.tsx` and `TermsOfService.tsx` are
   content-only wrappers around `LegalPage.tsx`, which carries ten responsive
   classes and `clamp()` type and works at every width tested. `NotFound.tsx`
   is the genuine offender in that group.
4. **The 640 versus 768 breakpoint mismatch is real but it is not the main
   event.** The brief expected the damage to show up in that band as a
   layout disagreement. What actually breaks there is the filter rail losing
   its horizontal scroller while its track is still 128px wide (F3), and the
   nav handing over to a desktop layout that needs 1087px (F2). The hook
   mismatch is a contributing cause of the second, not a defect in itself.
5. **The homepage horizontal overflow I first measured was a resize
   artefact, not a defect.** Sweeping widths without reloading leaves the
   matter-js canvas at its old size with pills positioned far outside the
   viewport. On a fresh load at 375px the canvas measures 375px and there is
   no horizontal scroll. I am recording this because it would have made a
   confident and completely false finding. It does raise a real question
   about device rotation, which is listed below as an owed check.

### Found, not asked about

6. **`NotFound.tsx` is untouched boilerplate.** Beyond the invisible text
   (F7) it carries no locked palette value, no responsive class and no `SEO`
   component, so it also ships no meta. It is the one page on the site that
   looks like a different product.
7. **`src/pages/Subscribe.tsx` still carries `font-black` and ten responsive
   classes** and is still on disk and unreachable, as documented. Noted only
   so the F10 weight fix is not applied to a dead file by mistake.
8. **The lime pill is hand-copied in five places** with five separate hover
   handlers (`ToolCard.tsx:348`, `Tools.tsx:244`, `WhatsNewCard.tsx:135`,
   `MyStack.tsx:278`, `FooterEmailCapture.tsx:39`), and the `MyStack`
   instance has already drifted to weight 600 and a 999px radius. One shared
   component would end it. Not proposed as part of this work.
9. **`MyStack.tsx:59` sets a tool name in electric lime**, which is display
   type in an accent colour and beyond "punctuation only" on the same reading
   that makes the Visit pill a problem. Same ruling as F6 covers it.
10. **The category filter chips and the Learning filters carry no
    `aria-pressed`**, so their active state is invisible to assistive
    technology, while the three sector toggles four lines away at
    `Tools.tsx:183` do it correctly. Copy that pattern.
11. **The homepage renders two `<h1>` elements** ("The" and "Edit.",
    `Index.tsx:93-116`), and `CobaltZone.tsx:85-105` renders a second `h1`
    that `DesignKit.tsx` populates with an empty string, so `/design-kit`
    ships an empty `h1`. Both are one-line fixes: one `h1` with inner spans.
12. **Tap targets.** Measured 30 elements under 24px tall on `/tools` at
    375px, 51 on `/design-kit`, 26 on `/my-stack`. The worst offender is the
    verdict toggle at 96x18px, which F1 fixes. WCAG 2.2 target size minimum
    is 24x24; 44x44 is the usability target.

### Checks still owed, that this session could not close

- **On-device touch confirmation of F8.** I reproduced the stuck selected
  state and its persistence in the browser, and the code path is
  unambiguous, but I did not tap a real phone. Do that before the sentence
  "tapping a card breaks the grid" is repeated as a finding anywhere
  permanent.
- **Device rotation.** The physics canvas does not appear to re-initialise on
  viewport change. On a fresh load it is correct at every width, so this is
  not a load-time defect, but a portrait-to-landscape rotation is worth one
  check on a real device.
- **Real-device pass at 360px.** The narrowest width tested here was 375px,
  where "Edit." clips by 2px. Small Android devices are 360px and will clip
  more.
- **Keyboard and screen reader pass.** Only the search input has an explicit
  focus style; everything else rides the browser default. Not audited here.

---

## What I would commission first, if it were one commit

F4 and the `mx-auto` half of F5. Between them they are two class changes,
they need no ruling, they fix a defect visible on every width and the single
worst dead-space instance on the site, and they can ship before any of the
larger questions are answered.
