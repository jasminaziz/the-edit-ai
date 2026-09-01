# Post-merge design regressions — investigation

Date: 2026-09-01
Investigator: Editorial Senior (design-check agent)
Scope: five reported regressions between the pre-merge tree (git ref `47a0d1e`) and the current `main`, per Jasmin's mobile snapshot comparison.

## Tooling limitation, stated up front

This session's toolset is Read, Glob, Grep, Write only — no Bash. I could not run `git show 47a0d1e:<path>` myself, so I have not independently diffed the pre-merge files. Where a claim is about the pre-merge state, it is either (a) quoted directly from the "established facts" supplied in the task brief, which I treat as given, or (b) explicitly marked as unverified by me. Everything about the **current** tree below is Read/Grep against the live files on disk, cited by path and line.

The second stated limit applies throughout: I read source, I do not render. Every layout and contrast figure below is either a direct computation from CSS values I read (marked OBSERVED IN CODE) or a prediction of what a browser will do with those values (marked INFERRED ABOUT RENDERING). Inferred findings need visual confirmation — a screenshot at the stated viewport — before anyone reports them fixed.

All contrast ratios below are computed by hand using the WCAG relative-luminance formula (sRGB → linear → 0.2126R+0.7152G+0.0722B → (L1+0.05)/(L2+0.05)). I cross-checked the method against every ratio already asserted in the codebase's own comments (cream/cobalt 8.03:1, lime/cobalt 6.50:1, cobalt/periwinkle 3.38:1, Red pill boundary 2.82:1 and label 7.10:1, lime label on lime-pill-ink 13.83:1) and all matched to two decimal places, so I'm confident in the new figures computed the same way.

---

## Finding 1 — Homepage body text: REFUTED as a token change. Confirmed as a perceptual side-effect of a deliberate, documented scale decision.

**File/lines:** `src/components/AboutPanel.tsx:56` (hook, `clamp(30px, calc(4.6vw - 7px), 56px)`, weight 700), `AboutPanel.tsx:102`, `:114`, `:127` (all three body paragraphs, `fontSize: 17`, unchanged).

The paragraph is 17px pre- and post-merge, per the brief's own stated pre-merge figure and my read of the current file — three separate `<p>` blocks at `fontSize: 17, lineHeight: 1.6, color: "#1A1510"` (lines 102, 114, 127). **No body size shrank.** OBSERVED IN CODE.

What changed is the element above it. Pre-merge: a 20px semibold hook (per brief). Post-merge: an `h2` at `clamp(30px, calc(4.6vw - 7px), 56px)`, weight 700, Chillax (line 52-61), documented in the surrounding comment as a deliberate 30 Aug 2026 decision — "56px at 1440 against 46px before... the wider column is what pays for the larger clamp."

Pre-merge the hook:paragraph ratio was 20:17 ≈ 1.18×. Post-merge it's 30-56:17 ≈ 1.76×-3.29× depending on viewport. That's the mechanism: the paragraph didn't shrink, the element above it grew by a documented, ratified amount, and the widened scale gap makes 17px read smaller by contrast (a relative-perception effect, not a token defect). **This is soft drift**, not hard: the spec is silent on the hook:paragraph ratio, and the ratio has simply widened as an unplanned side-effect of a decision that was reasoned through for other reasons (column width, line count).

**Fix, in spec terms:** none required at the token level — 17px is correct and unchanged. If Jasmin wants the paragraph to read less thin next to the enlarged hook, the lever that matches the cause is the *relationship* between the two sizes, not a token that was never touched: either (a) leave it, since the 30 Aug ruling was reasoned and explicit about the clamp and its floor ("do not push past 56px"), or (b) nudge the paragraph to 18-19px, which would take the ratio back down to roughly 1.6×-2.9× — still growing off the same three deliberately-scoped paragraphs.

**Predicted outcome if (b) is taken:** the paragraph column's line breaks will reflow at 18-19px (currently line breaks are locked at 17px/608px column per the AboutPanel comment), so this is not a free change — it may re-open the "do not push past 56px" line-count math the same comment already protects for the hook. Disproof: if line count in the 608px column at 1280px width goes from N to N+1, the fix cost more room than it bought and should be reverted.

I flag this as **the weaker of the five findings**: it is real (the perception is genuine) but it traces to a already-ratified decision, not an unintended regression, and any fix touches a locked line-count constraint.

---

## Finding 2 — Homepage header empty gap: CONFIRMED, and the primary cause is not the one most visible in the diff.

**Files/lines:** `src/pages/Index.tsx:106` (hero `min-h-[78vh]`, unchanged pre/post per brief), `:125` (`font-bold`, was `font-black`, commit `843bd66`), `:130` and `:159` (h1 clamp values, unchanged pre/post per brief), `src/components/HomeGravity.tsx:124-125` (`MAX_PILLS_MOBILE = 12`, was part of a uniform `MAX_PILLS = 18`) and the reasoning comment at `:94-122`.

Confirmed math (OBSERVED IN CODE, arithmetic only, not rendered): at 375px width, `clamp(120px, 28vw, 420px)` evaluates 28vw = 105px, below the 120px floor, so "The" renders at its **floor**, 120px, height 120 × 0.82 = 98.4px. `clamp(160px, 38vw, 560px)` evaluates 38vw = 142.5px, below the 160px floor, so "Edit." also renders at its **floor**, 160px, height 160 × 0.78 = 124.8px, minus the 0.02em negative margin-top (≈ -3.2px). Total h1 height ≈ 220px, matching the brief's measured figure exactly. Hero is `min-h-[78vh]` = 633px at 812px viewport height; the section's `pt-14` (56px) plus 220px puts the h1's bottom edge at 276px, also matching the brief. That leaves 633 - 276 = 357px of empty periwinkle, since mobile uses `justify-start` (`Index.tsx:106`), i.e. content is pinned to the top rather than centred or bottom-aligned.

**The two contributing causes, and which one actually matters more:**

1. **The clamp floors are conservative relative to the hero's own height, and are unchanged pre/post merge** — so this alone cannot be *the* regression, since it was equally true before. Confirmed as a pre-existing condition, not something the merge introduced.

2. **`MAX_PILLS_MOBILE = 12` (`HomeGravity.tsx:125`) is new, and its own governing comment (`:94-122`) states its design goal explicitly: reduce wordmark overlap from 8 pills to 1 at the worst-case 320×568 viewport.** That is the real mechanism. Pre-merge, per the brief, pills were capped at 18 uniformly with no anti-overlap logic documented — which means pills very plausibly piled over and around the wordmark pre-merge, and that overlap **was** the "crowded, fun, playful" read Jasmin wants back, not a bug to have engineered away. Post-merge the system deliberately keeps pills off the type. A deliberate anti-overlap ruling and a "too shy" complaint are describing the same design change from two sides.

This is the one place across all five findings where a documented, ratified decision (the 1 Sep pill-cap split) is very plausibly the direct cause of a complaint raised the same day. INFERRED ABOUT RENDERING — I have not watched the simulation settle, and per the codebase's own documented hazard (`HomeGravity.tsx:116-122`), a frozen/hidden-pane measurement here is worthless; any confirmation needs the pane visible and rAF actually pumping.

**Fix, in spec terms, and why weight is not the lever:** the `font-black` → `font-bold` change (`Index.tsx:125`, commit `843bd66`) was made because Chillax ships only weight 700; requesting 900 (`font-black`) with no 900 face loaded risks browser font-synthesis (faux-bold), which is inconsistent across browsers and was presumably the reason for the fix. **I do not recommend reverting this** — it trades a personality complaint for a rendering-consistency bug, and it doesn't change the 357px figure at all (weight doesn't move box height). This is a case where the diagnosed cause (empty space, pill density) does not match a weight-property remedy, so I'm not proposing one.

What does match the diagnosed cause:
- **Raise `MAX_PILLS_MOBILE`** back toward the pre-merge density (test candidates: 16-18), which directly answers "boldly oversized... don't be shy" by restoring controlled overlap onto the wordmark instead of avoiding it. Predicted outcome: at 320×568 the pile again touches the wordmark (the comment's own worst-case table shows 18-19 pills overlapping the type). That's not a bug under the "crowded, fun, playful" brief — it's the target — but it directly contradicts the comment's stated goal ("leaves 'The Edit.' fully readable"), so this is a genuine trade-off Jasmin needs to rule on, not a free fix. Disproof of the fix: if the pile fully occludes the wordmark rather than crowding around it, density went too far the other way.
- **Separately, and only if the pile-based fix isn't enough on its own:** raise the mobile clamp floors (e.g. "The" 120px → ~150px, "Edit." 160px → ~200px) to shrink the 357px gap directly. Predicted outcome: h1 height grows roughly proportionally (both terms are floor-bound below 428px), narrowing the gap from 357px toward roughly 220-250px. Disproof: measure `h1.getBoundingClientRect().height` at 375×812 after the change: if it isn't visibly larger than 220px, the floor edit didn't take.
- **These two fixes interact and must not be applied blind.** `HomeGravity.tsx:94-122`'s pill-count math is derived from the hero ending at 276px. Raising the h1 floor moves that number, and the comment's own worked table (390×844, 360×780, 320×568) goes stale the moment either value changes. Whichever fix ships, the other file's comment needs re-deriving in the same change, or the next reader inherits a document arguing with the code exactly the pattern this project has already been burned by once.

---

## Finding 3 — Nav colour: periwinkle-on-homepage would fail AA hard on every current foreground colour. Ink is the fix, but it must be homepage-conditional, and one CTA needs a separate look.

**File/lines:** `src/components/Layout.tsx:69` (`const navBg = "#2D35C9"`, applied identically on every route including home, per the comment at `:64-68` recording the 30 Aug ruling), `:70-72` (`textColor = "text-primary-foreground"`, `pillText = "text-primary"`), `:99-106` (mobile "Menu" label, lime `#C8F04A`), `:197-201` (desktop nav item text), `:217-227` (secondary CTA links at `/70` opacity).

**Current nav colour is cobalt everywhere, confirmed.** No route conditional exists on `navBg` in the current file — I grepped the file for `isHome` and it is used only for the mobile-open-state scroll-reset (`:24`, `:34-37`), never for nav colour.

Computed contrast, current nav foregrounds **against `#9B9EDE` periwinkle** (i.e. what would happen if `navBg` were swapped to periwinkle with no other change):

| Element | Current colour | Contrast vs cobalt (today, works) | Contrast vs periwinkle (if swapped) | AA needed | Verdict |
|---|---|---|---|---|---|
| Inactive nav links, `text-primary-foreground` | cream `#FAF8F4` | 8.03:1 | **2.37:1** | 4.5:1 (small text) | **fails, by 2.13** |
| "Menu" label + hamburger fill | lime `#C8F04A` | 6.50:1 | **1.92:1** | 4.5:1 | **fails, by 2.58** |
| Secondary CTA links (`/70` opacity cream) | cream 70% on bg | 4.72:1 (passes today, barely) | **1.88:1** | 4.5:1 | **fails, by 2.62** |
| Active-pill text, `text-primary` cobalt-on-white | cobalt `#2D35C9` on white pill | n/a (pill is white regardless of nav bg) | unaffected — text sits on a white pill, not directly on navBg | — | unaffected |

The nav's own governing comment (`:64-68`) already states the reason periwinkle was dropped: cream measured 3.40:1 and lime 2.75:1 **against the old, darker periwinkle** `#7B7FD4`. Since periwinkle lightened on 30 Aug (65.7% → 73.9% lightness), the same two foregrounds are now measurably **worse** against the new hex, not better — 2.37:1 and 1.92:1 respectively, both roughly a point below the old failing numbers. Reinstating periwinkle nav with the current foregrounds would be a harder failure than the one that got it removed. This is OBSERVED IN CODE (computed from locked hex values), not a rendering guess.

**The fix that lets periwinkle come back and pass:** ink `#1A1510`, already locked as `--secondary-foreground` for exactly this reason (7.20:1 on periwinkle, confirmed against the CLAUDE.md figure and independently recomputed here). Concretely:

- Swap inactive nav link text and the two secondary CTA links from cream/cream-70% to ink, **on the homepage route only**. Predicted outcome: 7.20:1, clears AA with margin.
- Swap the mobile "Menu" label and hamburger fill from lime to ink, **homepage only**. Predicted outcome: 7.20:1, clears AA; the `textShadow` glow at `:102-103` (added originally to help lime read against the busy hero) becomes unnecessary and should come off with the colour change, since ink doesn't need a glow to separate from a light background.
- **This must be conditional on `isHome`, not a global swap** — every other route's nav stays cobalt with cream (already correct at 8.03:1), and ink-on-cobalt would itself fail (18.12:1 is white-on-ink, not the case here; ink-text-on-cobalt-bg would be near-invisible since both are dark-adjacent... actually cobalt bg is light-ish blue not dark, so this specific combination doesn't arise, but the point stands: any single foreground choice must not be forced onto both nav states).

**What ink does not solve, and I'm flagging rather than silently fixing:** the "Work with me" pill (`bg-accent` lime, `:236`, `:166`) sits on the nav background as a filled shape, not just text-on-bg. Its own internal contrast (ink text on lime fill) is unaffected by nav colour and stays fine. But its **boundary** against the nav background is a separate, non-text contrast question: lime (`L=0.7508`) against periwinkle (`L=0.36696`) computes to **1.92:1**, against cobalt (`L=0.07335`) it's **6.49:1** today. A pill that reads as a strong assertive stamp on cobalt would nearly disappear as a shape on periwinkle — two light, close-luminance colours sitting directly adjacent, the documented forbidden pattern from the design system's own accent-colour rule ("accent colours on their own light tints"). This is not something a foreground-text fix touches; it needs either a border on the pill (e.g. a 1-2px cobalt or ink outline) or Jasmin ruling that the CTA looks different on the homepage nav specifically. I'm not proposing a specific border spec because I can't verify visually that it reads correctly — this is INFERRED ABOUT RENDERING and needs a screenshot before it's called fixed.

**Sticky/scroll behaviour, confirmed:** grepped `Layout.tsx` for `sticky`, `fixed`, `position:` — no matches. The nav is a normal-flow flex child (`shrink-0`, `:76-77`) sitting above a separately-scrolling sibling (`#app-scroll`, `overflow-y-auto`, `:248-252`). It behaves *as if* sticky (always visible) purely by never being inside the scrolling region — there's no scroll-linked colour change or reveal/hide behaviour to worry about. The practical consequence: whatever colour the nav is, the seam against the hero is a **constant, static edge at the very top of the page**, not something that gets worse on scroll. So the "jarring band" read is about the colour choice itself, not a scroll interaction — confirming Jasmin's fix target (colour) is the right lever, and there's no separate scroll-behaviour bug to chase. OBSERVED IN CODE.

One structural note worth surfacing, not a finding in itself: `Index.tsx:106`'s hero section carries `-mt-14 sm:-mt-16 pt-14 sm:pt-16`, a negative-margin-plus-equal-padding pair that exactly cancels the nav's own height. That pattern is the standard technique for letting a section's background show through behind a *transparent/overlay* nav — it has no visible effect against the current opaque cobalt nav. It's plausibly a leftover from when the homepage nav was periwinkle and rendered as an overlay rather than a normal-flow bar (before the 30 Aug ruling). INFERRED, not confirmed — I don't have the pre-merge nav's positioning to check this against, and it costs nothing to leave as-is regardless of the colour ruling above, but it's worth someone confirming whether it's inert dead code before this file is touched for the nav-colour fix.

---

## Finding 4 — Hero pills: colour and density both changed; new orange candidates computed with the physics that ruled out the old one.

**File/lines:** `src/components/HomeGravity.tsx:51-56` (current `CORE_COLOURS`), `:57` (lime accent), `:124-125` (pill caps), `Index.tsx:113` (`myStack.map((i) => i.name)`, sourcing from `my_stack` not `tools`).

Per the brief: pre-merge colours were Cobalt / Forest / Indigo `#4A4A9A` / Orange `#E8572A`; current file (`:51-56`, read directly) confirms Cobalt / Forest / Ink `#1A1510` / Red `#A8261C`. Both Indigo and the old Orange are gone, replaced by Ink and Red, per the file's own dated comment (`:6-50`) which I read in full — it documents exactly why: Orange failed both its own label (white on it, 3.60:1) and its boundary against the lightened hero (1.43:1); Indigo was undocumented rather than defective (7.67:1 label, 3.05:1 boundary) and left simply because it wasn't an owned colour.

**Orange candidates, computed against the same floor the file already accepts (2.54:1, Forest's number) and against both label backgrounds requested:**

The governing physics, stated in the file's own comment and independently reconfirmed by me: the hero (`#9B9EDE`, luminance 0.367) is light enough that any warm colour clearing a 2.5:1+ boundary against it has to sit at background luminance ≤ ~0.114 — which is dark, regardless of hue. A "bright" orange cannot clear this floor. I confirmed this by testing Tailwind's `orange-500` (`#F97316`, a genuinely bright orange): boundary against the hero computes to **1.11:1** and its white label to **2.80:1** — both fail badly, for the same reason `#E8572A` did. So "brighter" and "passes the boundary floor" are in direct tension on this hero colour; the honest answer is a *hue* fix, not a *lightness* fix.

Two candidates, both dark enough to clear the floor but hue-shifted away from Red's near-brick 4.3° toward a more legibly orange 15-22°:

| Hex | Hue (approx) | Boundary vs `#9B9EDE` | White label | Ink label | Verdict |
|---|---|---|---|---|---|
| `#A8261C` (current Red, for comparison) | 4.3° | 2.82:1 | 7.10:1 | fails | in code today |
| `#9A3412` (Tailwind orange-800) | 15° | **2.90:1** | **7.31:1** | 2.48:1, fails | clears floor, more orange than Red |
| `#963D0A` | 22° | **2.81:1** | **7.08:1** | 2.56:1, fails | most orange-reading candidate that still clears |

Both are **new hexes, not currently in the locked palette** — flagging explicitly per the brief's instruction: adopting either needs Jasmin's ruling before it goes in, the same way Red's adoption on 1 Sep did. Neither passes with an ink label (both fail 4.5:1 by a wide margin), so if either ships, the label stays white, matching every other core pill's convention already in the file.

My recommendation if a ruling is wanted: `#963D0A` — its hue (22°) reads more distinctly as orange against Red's near-red 4°, which is the actual complaint ("the red may be the wrong choice... a brighter orange"), while its boundary (2.81:1) and label (7.08:1) sit within a rounding error of Red's own accepted numbers, so it's not trading legibility for hue.

**Predicted outcome if adopted:** `colourFor()`'s hash indexing (`:71-75`) reshuffles on any change to `CORE_COLOURS.length` or its members — the file's own comment (`:45-47`) already flags this, so swapping Red for a new orange reshuffles which *names* get which colour, not just adding a new one. Disproof of a bad swap: if a pill that reads clearly on the hero at 2.5×+ boundary now reads flat/low-contrast, the swap picked the wrong candidate — re-run the boundary computation against the actual hex shipped, don't eyeball it.

**Pill density on mobile — is 12 too few:** see Finding 2 above; this is the same root cause from the other side. `MAX_PILLS_MOBILE = 12` (`:125`) is a deliberate anti-overlap cap, reasoned against the current h1 floor values. If Finding 2's fix raises the mobile pill count, or the pill orange changes, both changes touch the same 357px of vertical space and the same reasoning comment — they should ship together or at minimum be re-verified together, not as two independent PRs each assuming the other hasn't moved.

---

## Finding 5 — Tool cards flipping cobalt/white "too readily on scroll": CONFIRMED mechanism, and it's a known browser behaviour the project has already documented as a measurement hazard elsewhere.

**File/lines:** `src/components/ToolCard.tsx:75-100` (`cardSelectionProps`), `:132-133` (`data-selected`/`data-dimmed` attributes), `src/index.css:163-168` (`.tool-card[data-selected]` → cobalt bg, cream text), `src/pages/Tools.tsx:212-220` (single `hoveredCard` state drives every card's `isSelected`/`isDimmed`).

**Mechanism, fully traced (OBSERVED IN CODE):**

1. `Tools.tsx:212-213` computes `isSelected = hoveredCard === tool.name` and `isDimmed = !!hoveredCard && !isSelected` for every card off **one** piece of parent state, `hoveredCard`.
2. `ToolCard.tsx:132` sets `data-selected={isSelected || undefined}` on the card root — this is the attribute `index.css:163` keys the cobalt inversion off.
3. `cardSelectionProps` (`ToolCard.tsx:85-99`) sets `hoveredCard` via **pointer events**, split by `pointerType`: mouse fires `onActivate`/`onDeactivate` on `pointerenter`/`pointerleave` (`:85-90`); touch instead toggles on `pointerdown`, deliberately not on `pointerenter` (`:91-96`, with the reasoning in the comment above it about why touch can't use hover semantics); focus/blur also drive it (`:97-98`), for keyboard reachability.

So there are three independent triggers, and the reported "flips too readily on scroll" complaint is separate from all three named entry points, which points to a fourth mechanism: **`pointerenter` fires when a card scrolls underneath a stationary mouse cursor**, not only when the cursor itself moves. On a page where the mouse sits still and the user scrolls with a wheel or trackpad, every card that passes under the pointer's fixed screen position triggers `pointerenter`/`pointerleave` as it enters and exits that position — so the single-card cobalt inversion appears to "chase" down the page as the user scrolls, even though nobody moved the mouse. This is INFERRED ABOUT RENDERING (I can't watch a browser), but it's the same hazard this project's own CLAUDE.md already names as a fixture problem: *"the physical cursor is part of the fixture: after a programmatic scroll, an element can move under the pointer and genuinely enter its hover state."* That guidance was written for a different context (test measurement), but the underlying browser behaviour is the same one causing the reported symptom here — it isn't test-only, it's a real end-user interaction on any page where hover state is scroll-position-dependent and the cursor is stationary.

This is separate from, and additional to, the already-known mobile tap glitch the task excluded — that one is `pointerdown`-driven (touch), this one is `pointerenter`-driven (mouse-during-scroll). Both share the same root design: **one shared `hoveredCard` value drives every card on the page**, so any spurious pointer event anywhere flips the whole grid's visual state, not just one card.

**Fix, in spec terms:** this is an interaction-state design question, not a token or colour question, so I'm not proposing a colour change. The two candidate levers that actually match the diagnosed cause (spurious `pointerenter` from scroll, not from real mouse movement):
- Debounce/guard `onPointerEnter` against firing without an intervening `pointermove` since the last scroll event — i.e. only trust `pointerenter` as "the user is hovering" if the pointer's coordinates actually changed since the page last scrolled.
- Or, drop the mouse-hover trigger's sensitivity to scroll-induced enters specifically by tracking `event.movementX`/`movementY` — `pointerenter` events caused by content moving under a still cursor report 0 movement deltas relative to a genuine hover; this is a reliable signal to distinguish the two without touching touch or focus handling at all.

**Predicted outcome:** scrolling the `/tools` grid with the mouse stationary should leave every card in its resting white state throughout the scroll, with cobalt inversion only appearing when the cursor itself moves onto a card. Disproof: if a card still inverts mid-scroll with the pointer not moving (confirmed via a `pointermove` listener logging zero events during the scroll), the guard isn't catching the right event.

---

## Priority order (cost to design intent)

1. **Finding 2 / Finding 4 together** — the emptiness and the flattened pill density are the same 357px of vertical space fought over by two rulings (the mobile pill anti-overlap cap and the unchanged clamp floors) made independently and both technically correct in isolation. This is the biggest single hit to "boldly oversized... don't be shy," and it needs one combined decision, not two separate patches.
2. **Finding 3** — nav colour is a real, computed AA failure waiting to happen if periwinkle comes back with no other change (2.37:1, 1.92:1, 1.88:1 against a 4.5:1 floor). Ink is a locked, already-proven fix; the CTA-pill boundary is the one open question that needs a visual call before shipping.
3. **Finding 5** — a genuine interaction bug, but scoped to one page (`/tools`) and one input method (mouse-during-scroll); doesn't touch tokens or the locked palette.
4. **Finding 1** — real perception, traceable to a ratified decision elsewhere; the weakest case for a code change of the five.

## Hard drift vs soft drift

- **Hard drift (spec/AA actually violated if shipped as literally requested):** Finding 3's contrast figures if periwinkle nav ships with unchanged foregrounds.
- **Soft drift (spec silent, intent weakened by a side-effect of an otherwise-correct decision):** Findings 1, 2, 4 — none of these breaks a locked rule; all three are the compounding effect of independently-reasoned changes that were never checked against each other for their combined visual weight.
- **Not drift, a real bug:** Finding 5 — this is an interaction-state defect (spurious trigger), not a design-token or spec question.

## The one-sentence point of view

I can't answer the art-director test from this brief — that requires reading the rendered homepage and an inner page cold, which is outside what Read/Glob/Grep can do. What the code supports is narrower: the homepage's typography and colour tokens are still entirely on-spec (no off-palette hex found in any file read this session), but two independently-correct 30 Aug/1 Sep rulings (the pill anti-overlap cap, the unchanged clamp floors) have quietly cost the hero the density that made it read as "crowded, fun, playful" rather than merely "on-brand." That is a measurable, named mechanism, not a taste call — but whether the fixed version reads as bold-not-shy again needs eyes on a render, not another line of arithmetic.
