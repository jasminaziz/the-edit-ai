# DPIA speech bubble plan and /radar introduction audit

1 September 2026. Plan and critique only — no code was touched. Method note,
stated once and binding throughout: I read source files (`CobaltZone.tsx`,
`Tools.tsx`, `Radar.tsx`, `ToolCard.tsx`, `index.css`, `App.tsx`,
`use-mobile.tsx`, `AboutPanel.tsx`, `PolicyTemplate.tsx`) and computed
contrast from hex values. I did not render, screenshot or measure a live
layout. Every claim below is marked **OBSERVED IN CODE** (readable directly
from a file and line) or **INFERRED ABOUT RENDERING** (what I expect the
browser to do, unverified). Inferred findings need a visual pass before
anyone reports them fixed.

No prior report at this path exists, so there is nothing to reconcile
against.

---

## JOB 1 — DPIA speech bubble on `/tools`

### Where it renders: a new optional prop on `CobaltZone`, not a Tools.tsx overlay

**Decision, stated plainly: add a new optional prop to `CobaltZone.tsx`**,
e.g. `dpiaBubble?: { trigger: string; answer: string }`, used only by
`Tools.tsx`. Not a Tools.tsx-side overlay.

Reasoning. The position Jasmin asked for — "to the right of the H1" — is
exactly what `rightBadge` already computes: `absolute top-1/2 right-0
-translate-y-1/2` inside CobaltZone's own `relative` wrapper
(`CobaltZone.tsx:60`), which also owns the section's `clamp()` padding and
`max-w-[1280px]` container. Reproducing that from `Tools.tsx` would mean
either duplicating CobaltZone's internal layout constants outside the
component it belongs to (the same anti-pattern the repo already rejects
elsewhere — interaction state and layout ownership stay inside the component
that defines them, not in the page that happens to render it), or exposing a
generic children/slot API on CobaltZone, which is a bigger surface-area
change touching the type signature every one of the seven call sites relies
on. A single narrowly-typed optional prop is the smallest safe change:
**OBSERVED IN CODE**, `rightBadge` was added the same way and the other six
routes that never pass it render unaffected — this is precedent for exactly
this integration pattern in this exact file.

Predicted post-fix state: the six other CobaltZone consumers
(`/learning`, `/my-stack`, `/submit`, `/design-kit`, `/ai-news`,
`/policy-template`) show zero DOM difference, because the prop is `undefined`
for all of them. Disproof: grep `dpiaBubble` outside `Tools.tsx` and
`CobaltZone.tsx` returns a match, or any of those six pages renders new
markup in the cobalt header.

Do not reuse `rightBadge` itself for this. `rightBadge`'s badge is a
single-line sticker (`whiteSpace: "nowrap"`, no wrap handling, no max-width,
a hard `4px 4px 0` drop-shadow) built for short link text like "Source: The
Rundown.ai." The DPIA answer is 196 characters across two sentences (37
words) — see below. Forcing that through a `nowrap` pill either truncates it
silently or breaks the component for its one other consumer. Reuse the
*position*, not the *component*.

### Is a "bubble" the right pattern for 196 characters? Only if it opens on demand

An always-visible 196-character paragraph sitting beside a 56–96px display
H1 is a different visual weight class from anything else in that header —
the header currently carries a display headline, a lime subheading and,
optionally, a 13px nowrap sticker. Permanently rendering two sentences of
13–15px body copy there would either force the header taller at every width
(new content, same section) or crowd the H1 (the same crowding problem the
site already ruled against once, for the audience phrase, in
`CLAUDE.md`'s "meta strings cannot crowd each other... on-page copy is read
in sequence" principle).

So the pattern is: a **compact trigger, permanently visible, that opens a
collapsed panel on click**. This is a disclosure, not a tooltip, and I want
to be precise about that distinction because the repo has the wrong
primitive sitting ready to be reached for. `src/components/ui/tooltip.tsx`
survived the dead-code sweep (`App.tsx:29`'s comment notes it is currently
inert, kept so a future `<Tooltip>` "just works"). **Do not use it for this.**
ARIA tooltip semantics are for supplementary, transient, hover/focus-only
content and explicitly should not hold interactive or substantial content —
196 characters that a touch user needs to be able to open, read at leisure
and dismiss is a disclosure/popover pattern, not a tooltip, and Radix's
`ui/popover.tsx` was one of the 44 components removed in the sweep. Build
this as a plain controlled disclosure (`<button aria-expanded>` plus a
panel), not by reviving the tooltip primitive or re-adding popover.

**Recommendation on the paragraph: move it, do not duplicate it.**
`Tools.tsx:320-325`'s existing `<p>` is deleted from its current position and
its exact JSX — text, `font-body text-[13px] leading-relaxed`, colour
`hsl(var(--text-secondary))` — is relocated unchanged into the panel. No new
styling decision is needed for the paragraph itself, only for its container.

One tension to name rather than silently resolve. Jasmin's framing was "the
DPIA explanation is lost on the page" — i.e., a passively-read paragraph
wasn't being read. A collapsed-by-default disclosure makes the *entry point*
more visible (a permanent header-level trigger, in view at every scroll
position within the hero) but makes the *explanation itself* less visible
than today's always-rendered paragraph, trading passive reading for active
discovery. Given she explicitly asked for "a speech bubble type feature,"
I read this as her having already made that trade-off — I'm naming the
mechanism change so it can be confirmed, not second-guessing the ruling.

AboutPanel no longer explains DPIA at all — **OBSERVED IN CODE**: I grepped
`AboutPanel.tsx` for "DPIA" and "assessment" and found nothing. It was
rewritten on 30 Aug and the term dropped. So `Tools.tsx:306-310`'s own
comment ("AboutPanel is the only other thing on the site that explains the
term") is now stale — a documentation-only drift, not a copy defect, worth a
one-line correction whenever that comment is next touched, but not
blocking. `PolicyTemplate.tsx:142-154` carries a longer, differently-worded
DPIA explainer ("What's a DPIA, and why does everyone keep saying it?") —
different string, different page, no duplication risk, leave it as is.

### Structure

**Trigger** (permanently visible, replaces nothing):
- Text: exactly "What is a DPIA?" (approved copy, unchanged).
- Shape: rounded-full pill, `padding: 10px 18px`, `border-radius: 999px`.
- Background `#FFFFFF`, text `#2D35C9`, `border: 1px solid #E8E2D8`.
- Deliberately **not** the lime/cobalt sticker treatment `rightBadge` uses.
  Lime-on-cobalt already means "CTA" everywhere else on the site (the
  "Work with me" pill, the template card button, `rightBadge` itself). A
  cream/white surface with cobalt text reverses the header's own H1
  treatment (cream text on cobalt ground → cobalt text on a cream/white
  surface) and reads as a floating card, which is the actual visual grammar
  of a speech bubble — not another CTA sticker. It also avoids the
  "two identical pills compete" problem the signpost's own code comment
  already reasons about for the template card.
- Font-body, 14px, weight 600 (within the locked body weight set,
  400/500/600 — do not go to 700).
- Icon: optional. A small `HelpCircle` or `MessageCircleQuestion` glyph from
  `lucide-react` (already a dependency, used for `Search` at `Tools.tsx:20`),
  16px, cobalt, `aria-hidden`. Nice-to-have, not required for the fix.

**Panel** (opens on click, closed by default):
- `width: min(340px, calc(100vw - 40px))` — the viewport clamp is the safety
  net; on desktop it sits inside CobaltZone's own padded container so the
  fixed 340px governs, on a 360px phone the viewport term takes over and
  shrinks it, so it can never overflow regardless of screen width.
- `padding: 20px`, `border-radius: 12px`, background `#FFFFFF`,
  `border: 1px solid #E8E2D8`, `box-shadow: 0 8px 24px rgba(26,21,16,0.18)`
  (an alpha variant of the locked ink `#1A1510` — no new hex, matching the
  existing convention of alpha-varying locked colours, e.g.
  `rgba(250,248,244,0.6)` elsewhere in this same file).
- Content: the relocated paragraph exactly as it renders today (13px,
  `leading-relaxed`, `#6B625A`). No visible repeated heading inside the
  panel — see accessibility note below for how the question is still
  available to assistive tech without visually duplicating it.
- Tail: a 12px square rotated 45°, background `#FFFFFF`, `border-top` and
  `border-left` `1px solid #E8E2D8`, positioned centred under the trigger so
  the panel reads as anchored to it, sitting behind the panel's own
  box-shadow.

### Colour and contrast, every pairing

| Element / state | Text | Ground | Ratio | Source |
|---|---|---|---|---|
| Trigger, default | `#2D35C9` | `#FFFFFF` | **8.52:1** | Locked pair, already used sitewide (`CLAUDE.md`) |
| Trigger, hover / focus-visible | `#2D35C9` | `#EEF0FB` | **7.50:1** | Locked cobalt-tint pair, already used for job chips |
| Panel body text | `#6B625A` | `#FFFFFF` | **5.97:1** | Locked `--text-secondary` value, "5.97:1 on the card" per `CLAUDE.md` |
| Trigger, open state (border only) | — | border `#2D35C9` on `#FFFFFF` fill | non-text | Structural cue only, not a text pairing |

All body text meets the stricter 4.5:1 floor (13px and 14px are not "large
text" under either WCAG's size definition or the task's own 4.5:1/3:1 split,
so I did not claim a large-text exemption for the 14px semibold trigger
label even though it would likely qualify — both states clear 4.5:1 with
wide margin regardless). Zero new hex introduced; every value above is
already locked or an alpha variant of a locked value.

I independently recomputed cobalt-on-lime as a sanity check against
`CLAUDE.md`'s existing "lime on cobalt 6.50:1" figure and got the same
6.50:1 in the reverse direction — the ratio is symmetric, as it should be —
but I am **not** proposing that pairing here; it's recorded only to confirm
my arithmetic agrees with the locked figures before I relied on them.

### Interaction states

- **Default → hover/focus-visible**: background `#FFFFFF` to `#EEF0FB`,
  `transition: background-color 150ms ease`, matching the 150ms convention
  already used on the filter-chip and toggle buttons in the same file
  (`Tools.tsx:158`, `:197`) rather than inventing a new timing value. Hover
  and `:focus-visible` share one rule, the same pattern `.about-byline`
  already establishes in `index.css` (mouse-only hover left the one
  keyboard-reachable link on the homepage with no visible state — do not
  repeat that here).
- **Open state**: `aria-expanded="true"`, border changes from `#E8E2D8` to
  solid `#2D35C9` so the trigger visibly reads as "engaged" while its panel
  is showing.
- **Panel entrance/exit**: a fast, independent 150–180ms opacity + 4px
  translateY transition. Do **not** reuse `sign-drop`
  (`tailwind.config.ts:113-118,132`) for this. That keyframe is a 1.1s bounce
  built for a one-time mount entrance on a small sticker shape (rotating
  from -18° to a final -2° tilt) — appropriate, if anything, for the
  *trigger's* one-time appearance on page load (optional, matches the
  `rightBadge` precedent), but wrong for an open/close toggle a user will
  fire repeatedly: a 1.1s bounce on every click reads as sluggish, and the
  rotation doesn't suit a text-bearing pill the way it suits a short badge.
- **Dismissal**: click the trigger again (toggle), click outside the panel,
  or `Escape` while focus is inside it. I recommend against a dedicated
  close "×" as a requirement — the toggle-trigger and click-outside already
  cover mouse, touch and keyboard — but it's a safe, cheap addition if
  preferred (44×44 minimum hit area, matching the site's established
  `min-h-[44px]` tap-target convention).

### Accessibility

- `aria-controls` on the trigger pointing at the panel's `id`.
- The panel gets no visible repeated "What is a DPIA?" heading (avoids
  duplicating the trigger's own visible text), but carries
  `aria-labelledby` pointing back to the trigger button, so a screen reader
  still announces the question as the panel's accessible name.
- Focus moves into the panel on open (to the panel container or its first
  focusable element) and returns to the trigger on close — standard
  disclosure/popover behaviour, not build-critical detail I'm dictating, but
  flagging so it isn't skipped.

### Responsive behaviour, all four widths

**Governing breakpoint: Tailwind `md` (768px), matching `rightBadge`'s own
existing `hidden md:block` / `md:hidden` split — not the JS `1024` hook.**
`CobaltZone`'s badge is not one of the four named consumers of
`MOBILE_BREAKPOINT` in `use-mobile.tsx` (nav, homepage counter, hero pills,
drag hint), so this isn't a new violation of that contract, but it is worth
naming: the header already runs two different breakpoint systems for
different jobs, and giving the bubble trigger the *same* breakpoint as the
badge it sits beside is the more important consistency to preserve — two
elements in one header switching layout at two different widths would be a
new, self-inflicted inconsistency I'm not willing to introduce.

- **375px.** `md:hidden` branch: trigger renders below the subheading,
  `mt-6` (24px gap), left-aligned, matching the badge's exact mobile
  fallback. For **this specific page**, the H1 ("Tools", 5 characters) will
  **not** wrap to two lines at any width — the general warning about the H1
  wrapping applies to longer headings elsewhere in the shared component, not
  to `/tools`. The subheading ("Pick the tool for the job. The checks give
  you a head start; the final call is yours.", ~85 characters) will wrap to
  several lines at the 20px clamp floor in a ~335px column — **INFERRED**,
  roughly 4–5 lines, unverified without a render. Panel opens below the
  trigger, left-aligned to it (natural flow, no `right-0` context to anchor
  against), width `min(340px, calc(100vw - 40px))` so it stays inside a
  335px container.

  **Soft-drift flag, not a defect in my proposal but worth naming
  honestly:** stacking a new trigger below an already-long wrapped
  subheading adds height to a mobile hero the prior design audit already
  flagged as verbose (F9, "the mobile homepage spends its first screen on
  decoration" — a different page, but the same shape of problem: content
  compounding in the cobalt zone before the reader reaches the grid). This
  is a genuine open question rather than something I'll silently resolve by
  picking a property: does the trigger belong inside the cobalt header on
  mobile at all, or should `Tools.tsx` render it separately, closer to the
  grid, on narrow widths only? Jasmin's instruction was explicit about "the
  header section," so I've designed for that, but I'm flagging the
  compounding-height cost rather than pretending it isn't there.

- **768px.** Right at the `md` boundary, so the desktop position already
  applies (Tailwind `md:` is `min-width: 768px`, inclusive). H1 evaluates to
  ~61px at this width (`8vw × 768 = 61.44px`, between the 56px floor and
  96px cap), subheading ~23px. Trigger sits `absolute top-1/2 right-0
  -translate-y-1/2` inside the same relative container the badge uses,
  vertically centred against the H1+subheading block (Tools.tsx passes no
  `bodyText`, so that block is only those two elements — the centring lands
  genuinely beside the H1, which is what was asked for). Panel anchors
  right-edge-to-right-edge with the trigger and extends left, staying inside
  the container.

- **1024px.** No new behaviour at this width specifically — it is not a
  breakpoint for this component, only for the sitewide chrome contract.
  Same desktop position and panel anchor as 768px, just more horizontal
  room (H1 ≈82px here).

- **1440px.** H1 at its 96px cap. Same position and anchor logic. Container
  right edge sits `clamp(20px,5vw,48px)` ≈ 48px in from the viewport edge at
  this width, so a 340px panel anchored to the trigger's right edge and
  extending left has no overflow risk in either direction.

**Dependency worth flagging, not currently true but easy to break later:**
the "beside the H1" claim above relies on `Tools.tsx` never passing
`bodyText` to this `CobaltZone` call. If a future change adds `bodyText`
there, the block's vertical centre shifts down and the trigger drifts away
from the H1. Not a problem today; worth a comment at the call site when
built.

---

## JOB 2 — How `/radar` is introduced and linked

Ranked by severity. **B** = blocking, **H** = high, **M** = moderate,
**L** = low / nice-to-have.

### 1. [H, blocking-adjacent] The radar card carries no marker of "unchecked" on the card itself, and its outbound CTA is pixel-identical to a vetted tool's

**OBSERVED IN CODE.** `RadarCard` (`Radar.tsx:53-166`) and `ToolCard`
(`ToolCard.tsx:111-334`) both carry the class `tool-card` and both style
their "Visit tool →" link with the identical class `tc-visit`
(`Radar.tsx:158`, `ToolCard.tsx:326`), which resolves in `index.css:234-237`
to the same lime `#C8F04A` fill, ink `#1A1510` text, and the same
cobalt-on-hover. Every other visual element the two cards share is also
identical: the `tc-chip-job` category chip, the name typography, the
`data-selected` cobalt inversion and neighbour-dimming on hover
(`Radar.tsx:70-73` imports `cardSelectionProps` directly from `ToolCard.tsx`
for exactly this parity).

What's genuinely absent from `RadarCard`, correctly, is the entire "THE
CHECKS" zone: no DPIA chip, no data-location line, no trains-on-input line —
because that data doesn't exist for these 44 rows. But that absence is a
**negative signal only legible by comparison** to a full `ToolCard`. Nothing
on the radar card itself *asserts* "this hasn't been checked" the way the
DPIA chips, the failure badge, or "IN MY STACK" all assert their status
directly on a normal tool card. The site's own established rule — "the label
carries the meaning, so the chip never relies on colour alone" — is applied
consistently to the DPIA trio and the failure badge, but the same
principle (don't rely on the reader noticing an absence) isn't applied to
the radar card as a whole.

**Risk, and where it's sharpest, INFERRED but code-grounded:** if a radar
row happens to carry `status === "in_stack"` in the Sheet, `RadarCard.tsx:98-102`
renders the "IN MY STACK" badge — a strong personal endorsement — on the
exact page whose own body copy says "treat them as leads, not
recommendations." I can't check live Sheet data from here to confirm whether
any of the current 44 rows are in that state; the code path exists and would
fire silently if they are. Worth a one-query check: does any row with
`status === in_stack` also fail `isComplete()`?

**Fix in structural terms, matched to the diagnosis.** The diagnosis is "no
card-level marker of unchecked status," so the fix is a card-level marker,
not a page-level copy tweak (a page-level disclaimer already exists and
evidently isn't enough, per Jasmin's own "shouldn't confuse the user"
framing). Two changes, both properties on the existing card, not new
content:
- Add a small chip on every `RadarCard`, analogous to the DPIA chips and the
  "Judged, not recommended" badge, that states its status directly on the
  card (exact wording is Jasmin's to write — I am not proposing a string —
  but it must survive the card being seen alone, out of page context: a
  share, a screenshot, a scroll past the header).
- Demote the radar "Visit tool →" link from the shared `tc-visit` lime pill
  to a plain text link: `color: #2D35C9`, no fill, trailing arrow kept,
  14px weight 500 — visually distinct from the vetted directory's CTA
  without inventing a new colour (this exact demotion was already proposed,
  unbuilt, for the *main* `ToolCard` in the 29 Aug design audit's F6; I'm
  not resurrecting that ruling for `/tools`, only recommending the *radar*
  card adopt the lower-commitment treatment specifically because it needs
  to read as lower-commitment, and the main card currently doesn't need to).

**Predicted post-fix state:** `RadarCard`'s rendered "Visit tool" link has
`background-color: transparent`, not `#C8F04A`; a new status chip is present
in the card's DOM regardless of scroll position or page context. **Disproof
of the fix:** inspecting a radar card's Visit link still resolves to the
`tc-visit` class or a computed `#C8F04A` background, or the new chip is
absent from the card markup and exists only in the page-level copy above the
grid.

### 2. [H] The signpost sits before the grid, offering the exit before the entrance

**OBSERVED IN CODE.** `Tools.tsx:344-354`: the radar signpost renders
immediately after the DPIA definition paragraph and before a single tool
card. The very first interactive, CTA-styled element a first-time visitor
meets on `/tools` — after the search box and filter chips — is an invitation
to leave the vetted directory for the 44 unchecked rows, before they've seen
any of the 23 checked ones.

This runs against the site's own stated positioning: the whole premise
(`CLAUDE.md`, "The Edit is a comms resource first... judged against every
row before it appears") is that the checked directory is the scarce,
valuable thing. Sending attention to the unvetted list before the vetted one
loads works against that, even though the signpost text is itself accurate
and not misleading on its own terms.

**This is a design decision, not a pure defect — flagging for a ruling, not
asserting a single correct answer.** The brief invited "before, after, or
both" as options. I recommend **after the grid, single placement, not
both**: the site already carries an explicit anti-duplication principle
("meta strings cannot crowd each other... on-page copy is read in sequence,
that's where crowding is real," `CLAUDE.md`) developed for exactly this kind
of repeated-CTA question, and applying it here favours one placement over
two competing ones. Given `/radar` is deliberately not a nav-level
destination (its own code comments describe it as "a secondary view... not
a seventh destination"), it reads as correct for it to be reached only after
a visitor has engaged with the primary content, not before.

**What I can't decide for Jasmin:** whether losing the pre-grid placement
costs a meaningful number of visitors who specifically wanted the unchecked
list and don't want to scroll a lengthening grid (23 rows today, up to 45 at
the ceiling) to find it. That's a traffic/intent question, not a
structural one, so it's hers.

### 3. [M] "The checks" means two different things in two adjacent blocks

**OBSERVED IN CODE.** `Tools.tsx:324`: "The flag on each card says how
likely typical comms use is to trigger **one**" — "the checks" here, in the
paragraph immediately above, refers specifically to the DPIA assessment.
Three lines later, `Tools.tsx:346`: "Tools I've spotted but haven't put
through **the checks** yet" — here "the checks" means the full seven-field
axis (`isComplete()`), of which DPIA is only one field. Same phrase, two
referents, in two consecutive blocks a visitor reads in sequence. A reader
who just absorbed "the checks = the DPIA assessment" from the first
paragraph has a reasonable, code-supported basis for misreading the second
sentence as "these tools haven't had their DPIA checked" rather than
"these tools haven't been through any of the seven fields yet."

This is a wording problem, not a structural one, so **I'm not proposing
replacement copy** — that's Jasmin's per the standing rule. What the fix
needs to *do*: disambiguate "the checks" in the signpost sentence (or the
radar page's own body copy) so it's unambiguous that it means the full
evaluation axis, not the DPIA specifically, given the DPIA paragraph has
just primed the reader to read "the checks" narrowly. This gets easier if
finding 2 is also actioned, since separating the two paragraphs by the
length of the grid removes the adjacency that causes the collision.

### 4. [L] "On My Radar" — consistent with an existing site pattern, not an isolated problem, but worth naming a discovery made in checking it

I initially expected this to read as a violation of the locked voice rule
`'"Your stack" not "my stack" in all visitor-facing copy'` (`CLAUDE.md`). It
doesn't, on the evidence: **OBSERVED IN CODE**, `/my-stack`'s own H1 is "My
Stack" (`MyStack.tsx:337`), its subheading is "What I'm actually using and
why" (`:338`), the nav label is "My Stack" (`Layout.tsx:11`), and the badge
is "IN MY STACK" (`ToolCard.tsx:176`, `Radar.tsx:100`) — all first person,
all live. "On My Radar" follows the exact same pattern: a first-person page
label immediately followed by a first-person subheading that does the
disambiguating work ("Tools I've spotted but haven't put through the checks
yet" mirrors "What I'm actually using and why" structurally). Read this way,
"On My Radar" isn't a rogue instance, it's consistent with an established
site-wide editorial voice choice, and I don't think it should be singled out
for correction on its own.

**Separate discovery, flagged because I found it while checking this:** the
locked rule `'"Your stack" not "my stack"'` appears to be directly
contradicted by the live H1, nav label and badge named above. I can't tell
from the files whether this rule is stale (superseded by a later decision
not reflected back into that line, which is a documented recurring pattern
in this project's `CLAUDE.md`) or whether "My Stack" is unresolved drift
against it. I'm naming it rather than resolving it — it's adjacent to this
audit, not part of it, and deciding which is authoritative isn't a call I
can make from source alone.

**If** the persona is ever revisited, "On My Radar" and "My Stack" should be
decided together, not separately — they're the same choice made twice.

### 5. [L] No contextual return link from `/radar` to `/tools`

**OBSERVED IN CODE.** `App.tsx:31` confirms `Radar` renders inside `Layout`,
so the persistent top nav (including a "Tools" link) is present on `/radar`
— the return path exists and isn't broken. But it's an *ambient* path, not a
*contextual* one: a visitor who arrived via the signpost's specific CTA
arguably expects a specific way back, not a scan back up to the nav bar.
`Radar.tsx:272`'s body paragraph already names "Tools" in prose ("moves to
Tools once it's checked") without linking it. Cheapest possible fix: wrap
that existing word in an anchor to `/tools`. No new copy, one `<Link>`.
Nice-to-have, not blocking, since the nav already covers the requirement.

### 6. [Confirmed asset, not a finding against] The repeated subheading sentence

The brief asked whether the identical sentence appearing as both the
`/tools` signpost text and the `/radar` subheading is a problem or an
asset. **OBSERVED IN CODE**, and it's an asset: `Tools.tsx:346` and
`Radar.tsx:217` are the same string, and the signpost's CTA label
("On My Radar →") matches the destination's own H1 exactly
(`Tools.tsx:352`, `Radar.tsx:216`) — link text predicting its destination is
established good practice, not an accident here; the code comment at
`Tools.tsx:334-337` shows this was deliberate. What a visitor is promised
before the click is exactly what they read after it. Leave this as is.

### 7. [Informational, not a new finding] `/radar`'s SEO strings are still marked unapproved by the code itself

`Radar.tsx:206-213`'s own comment flags the title and description as
placeholders pending Jasmin's copy pack, not asserted as final. Noting it
here only so it isn't lost, not claiming it as something I discovered.

---

## What I would action first, if it were one change

Finding 1 (Job 2). It's the only one where the diagnosis is genuinely
structural — a missing card-level status marker and an identical CTA — and
the property fix I've proposed matches that diagnosis exactly: a chip and a
button treatment, not a copy edit layered on top of an unchanged card. It's
also the one with the clearest cost if left: a visitor who never reads the
page-level disclaimer, or arrives at a card out of context, has no way to
tell a lead from a recommendation.
