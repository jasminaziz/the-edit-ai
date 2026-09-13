# Design fidelity check: nav rebuild and checks line

**Date:** 2026-09-13
**Project:** the-edit-ai-site-map, branch `design/site-map`
**Scope:** step 3 of `build-plan.md`, `src/components/Layout.tsx` (commit `e17c7e3`) and `src/components/CobaltZone.tsx` (commit `89bc8a3`, step 1, reviewed here because step 3's checks line depends on it).
**Spec:** the "Design system (locked)" and "Codebase conventions" sections of `.claude/CLAUDE.md`, cross-checked against `build-plan.md`'s "Rulings, settled 13 September 2026" and the approved mock `~/Developer/the-edit-ai/.superpowers/site-map-boards/board-nav.png` (its "Go further" label and "one line" slot are superseded per the brief).
**Also read:** `~/.claude/guides/website-build/web-build-guide.html` §3 (Stage 2 and Stage 3) and §6 (ratified learnings), and its §7/§8 property-status tables for theeditai.co.uk.

**Two limits stated up front, per my brief.** I read source; I do not render. Every finding below is marked OBSERVED IN CODE or INFERRED ABOUT RENDERING. Where I had a screenshot to check a claim against, I say so; where I did not, I say that too, because an inferred finding is not evidence something is broken, only that it hasn't been looked at. Second, for every fix I mention below, I state what a render should show afterwards and what would prove the fix wrong, and where a diagnosis is "unverified," I have not prescribed a code change, because verifying and editing are different jobs.

**Previous report:** `reports/site-design-check-2026-08-05.md` exists but scoped to the PWA manifest scaffold (`vite.config.ts`, `index.html`) on jasmin-aziz's sibling review pattern, no overlap with nav, hub or CobaltZone. Nothing there is corrected or persists in this scope.

---

## Verdict: faithful, with four named soft-drift points, one of which needs a render before it can be signed off

No hard drift found in the two changed files. Every hex value introduced or reused by this step is an exact match to the locked palette, doing the job the spec already gives it. No forbidden combination appears (lime is never a ground or category colour here; muted `#9A8F82` never carries text; periwinkle carries no white text in the touched code). Interaction states are built in Tailwind utility classes and CSS, not mouse-only JS handlers, which is the specific failure pattern this project has been bitten by twice before (`ToolCard`, `.about-byline`). The soft-drift points below are things the spec is silent on, one genuine verification gap, and one pre-existing, already-disclosed contrast shortfall that now sits next to a passing line and is worth naming again.

---

## Findings, most costly first

### 1. SOFT DRIFT / INFERRED: the one page combining `rightBadge` and `checksLine` was never rendered at desktop width in this review's evidence

**File:** `src/components/CobaltZone.tsx:192-197` (badge slot), `:296-304` (checksLine); `src/pages/WhatsNew.tsx:180-186` (the call site).

`/ai-news` is the only one of the four checks-line pages that also passes `rightBadge` (`{ text: "Source: The Rundown.ai", url: ... }`). The badge is rendered as:

```
{badge && (
  <div className="hidden md:block absolute top-1/2 right-0 -translate-y-1/2 z-10">
```

`top-1/2` / `-translate-y-1/2` centres the badge against the height of its positioned ancestor, the same `relative` wrapper that now also holds the checksLine paragraph (CobaltZone.tsx:191, 212-312). Before `checksLine` existed, that wrapper's height was heading + subheading only; now it's heading + subheading + a 16px paragraph with a 16px top margin, roughly 40px of added height on a page with no `bodyText` to already be carrying that. The badge's vertical centring was tuned against the shorter box.

Every documented reasoning about this slot's geometry in the file's own comments, the `helpBubble`-vs-`rightBadge` overlap note (:199-211), the `bodyText`-vs-bubble opacity note (:291-295), predates `checksLine` and never mentions it, and no page combines `helpBubble` with `checksLine` for comparison. This specific pair (`rightBadge` + `checksLine`, live only on `/ai-news`) was not part of any comment's reasoning and is not in the screenshot set I was given: I have `bar-375-ai-news.png` (nav chrome only) and `ai-news-375.png` (mobile, where the badge drops to `md:hidden` flow below the text and cannot overlap anything, confirmed in that screenshot, badge sits cleanly under the checksLine paragraph). There is no `/ai-news` capture at 1280 or 1440, before or after this step.

This is not a large shift, the h1 clamp alone runs up to 96px, so a ~40px addition to a ~200px+ tall block moves the centre point by roughly 20px, not by a card's height, but it is exactly the kind of change a percentage-based absolute position won't announce as broken; it just quietly re-centres.

**What would prove this fine or wrong:** render `/ai-news` at 1280 and 1440 and measure the "SOURCE: THE RUNDOWN.AI" badge's vertical position relative to the h1's cap-height band. If it still sits level with (or just below) the "AI News" heading, as it did before `checksLine` was added, this is fine and can be closed as checked, not just inferred. If it has visibly dropped toward the checksLine paragraph, or the two are close enough to look associated when they aren't, that is the trigger to fix it.

**Fix in spec terms, only if the render shows a problem:** stop centring the badge against the whole stack and pin it to the heading row specifically, the same move already made for `helpBubble` at :199-211, which was rebuilt from an overlay position into a real flex column specifically because "reserves no space" broke the moment a sibling prop changed the block's height. That is a positioning-property change matched to a positioning-diagnosis, so it is the right kind of fix if the render confirms the problem; I am not proposing it pre-emptively.

### 2. SOFT DRIFT / needs a ruling: hub row order departs from the approved mock with no ruling on record for the reorder itself

**File:** `src/components/Layout.tsx:23-28`.

```
const hubItems = [
  { to: "/my-stack", label: "My Stack" },
  { to: "/design-kit", label: "Design" },
  { to: "/learning", label: "Learning" },
  { to: "/ai-news", label: "AI News" },
];
```

`board-nav.png`'s "DESIGN KIT IN THE HUB, PHONE" panel shows the hub row as Learning, AI News, Design kit, My Stack, My Stack last. The shipped order puts My Stack first. My brief says only the mock's "Go further" label and "one line" slot are superseded by the rulings; `build-plan.md` ruling 1 (line 106) settles the hub's *label* ("How I work") and its *landing page* (My Stack) but does not say anything about the order of the other three items in the row. Landing-page-leads-its-own-row is a defensible reading, but it is not written down anywhere I can find, and it is exactly the kind of structural choice this project's own convention says should be a named decision rather than an inference (the entity-identity ratified learning makes the adjacent point for a different kind of change: an undocumented choice made to resolve a spec gap is worth writing down, not just shipping).

**This is not a code defect.** I am not proposing a reorder. The finding is that the order was changed from the reference without a ruling that names it, and it should get one on record (even if the answer is "leave it, My Stack-first was always intended") so the next person reading `board-nav.png` against the live nav doesn't have to guess whether this was a decision or a drift.

### 3. SOFT DRIFT, pre-existing and disclosed: `bodyText`'s 60%-opacity shortfall is unchanged but now sits next to a line built specifically to avoid it

**File:** `src/components/CobaltZone.tsx:286-289` (bodyText, `rgba(250,248,244,0.6)`, 3.86:1) against `:291-304` (checksLine, `rgba(250,248,244,0.85)`, 6.24:1, with a comment explaining exactly why it does not reuse the 60% value).

This was flagged to me as a known, deliberately-left shortfall, and I confirm it in the code: it fails the 4.5:1 AA floor for 16px text at every size, and it was not touched by this step. It is site-gates' remit, not a new regression from step 3, and I'm not asking for a fix here. Worth recording because the two paragraphs now run back to back on `/my-stack` and `/design-kit` (both pass `bodyText`) with a visibly different measured contrast for a reason that is only documented in a source comment, not on the page, a reader can't see why one line is crisper than the one above it, only that it is.

### 4. SOFT / cosmetic, matches the approved mock: drawer grouping reads as a label, not a nested group

**File:** `src/components/Layout.tsx:228-253`, confirmed against `drawer-375-learning.png`.

The "HOW I WORK" label (11px, uppercase, `px-4 pb-1`) and its four child links (`px-4 py-3`) share the same left inset as the ungrouped Home/Tools/Template links above them. The screenshot confirms this: My Stack, Design, Learning and AI News sit flush left with Home, Tools and Template, with no indent to mark them as nested under the label, the only grouping cue is the label text itself plus a `mt-3` gap. Read cold, as the art-director test asks: the drawer reads as "one list, with a caption partway down," not as "three primary destinations, then a sub-group." This is not a step-3 regression, the approved mock's own drawer proposal (`board-nav.png`, "DRAWER PROPOSED") is equally flat, using a small chip-style divider rather than an indent, so I am recording it as an observation matching the reference, not a fix.

---

## What I checked and found clean (stated, not just implied)

- **Hex fidelity:** cobalt `#2D35C9`, periwinkle `#7B7FD4` (homepage only, unchanged scope), lime `#C8F04A` (underline decoration only, never a ground or badge fill in the touched code), cream `#FAF8F4` / `rgba(250,248,244,…)`, ink `#1A1510`, every value in `Layout.tsx` and `CobaltZone.tsx` matches the locked palette exactly. No near-match drift, no new off-palette hex.
- **Forbidden combinations:** no lime-on-cream, no grey-as-badge, no muted-as-text (`HelpBubble`'s answer text correctly uses `#6B625A`, not `#9A8F82`, CobaltZone.tsx:130), no periwinkle-with-white-text in the reviewed code (`text-primary-foreground` resolves to cream `hsl(40.0 37.5% 96.9%)`, not pure white, confirmed against `index.css:30-31`, and this is the same pre-existing, disclosed homepage-only AA shortfall CLAUDE.md already names at 3.40:1, not a new one).
- **Interaction states:** the hub row's current/inactive states and hover/`focus-visible` (Layout.tsx:374-378) are Tailwind utility classes evaluated in CSS, not `onMouseEnter`/`onMouseLeave` handlers, the exact fix pattern this project adopted for `.about-byline` and `.lime-link` (`index.css:277-301`) after the mouse-only bug shipped twice before. `.lime-link` (used by the checksLine's "Tools" link) shares its hover/focus-visible thickening rule in one CSS block, matching the `.about-byline` convention exactly.
- **Landmarks:** two labelled nav regions as specified, `aria-label="Main"` on the bar (and again on the portalled drawer, which Radix's Dialog hides the background for while open) and `aria-label="How I work"` on the second row (Layout.tsx:152-154, 205, 364). `aria-current` is set by hand per the documented "page" vs "true" split (Layout.tsx:83-84) rather than relying on `NavLink`, which could only ever mark the one page the hub tab links to.
- **Copy match:** the checksLine string in code, "This page hasn't been through the checks. Everything on Tools has.", is character-for-character the ruled string (build-plan.md ruling 2), and MyStack's superseded line ("The tools directory is the recommended list.") is confirmed removed by grep, not just claimed removed.
- **Scope discipline:** `/radar` renders `CobaltZone` without `checksLine` (Radar.tsx:246), so it keeps its own wording rather than inheriting this one, exactly as ruled.
- **Header height arithmetic:** the measured facts state 64px desktop / 105px with the hub row, 56px phone / 97px with it. I can confirm this from the code rather than just take it on trust: the bar is `h-14 sm:h-16` (56/64px) and the hub row is `h-10` (40px) plus a 1px top border, giving 56+41=97 and 64+41=105, the numbers in the brief and the numbers implied by the Tailwind classes agree exactly.
- **Screenshots checked directly:** `bar-1280-learning.png`, `bar-1040-tools.png`, `bar-1040-home.png`, `bar-1280-policy-template.png`, `bar-375-ai-news.png`, `drawer-375-learning.png` all show what the code says they should, the pill hugging the active tab with no visible gap, the hub row's current-page lime underline, the second row present on mobile without a separate variant, and the drawer's flat grouping (finding 4). `my-stack-1280.png`, `learning-375.png` and `ai-news-375.png` are step-1 captures (old six-tab bar, no hub row) and were read for the checksLine's in-context appearance, not for the nav rebuild itself.

---

## The art-director test

**Homepage, cold:** a confident, high-contrast editorial voice, cobalt and lime doing exactly two jobs each (brand ground/CTA, and accent/punctuation) with nothing softened into a gradient or a stock SaaS blue. Reads as a curated list with an opinion, not a directory.

**One inner page, cold (`/learning`):** the same voice extends cleanly, the checks line does real work here: it's the one sentence on the page that admits this content hasn't been through the same rigour as `/tools`, in the site's own voice rather than a disclaimer tone. That is a point of view a stranger could name.

**One-sentence answer:** an opinionated, self-auditing directory that tells you plainly which of its own pages have been checked and which haven't, dressed in a deliberately narrow cobalt-and-lime palette rather than a generic AI-tool gradient.

---

## Guide staleness: none flagged

I checked `web-build-guide.html` §7 and §8 for theeditai.co.uk. Both are dated 14 August 2026 and describe accessibility and structural states (nav contrast, canonical URLs, form wiring) that predate this build entirely and are already known-stale for reasons unrelated to this step. None of my four findings above contradicts a specific claim currently recorded in §7 or §8, the guide says nothing about the hub nav, the checks line or `CobaltZone`'s prop interactions, so there is nothing there for these findings to flip from correct to incorrect. Per my brief, the staleness flag is for when a finding changes the property's *recorded* state, not for restating that the table is old in general. No `SCRATCHPAD.md` line added.

## Proposed learning

Appended to `~/AI Work/cowork/PROJECTS/CHIEF OF STAFF/Claude Setup/LEARNINGS.md` (below), because finding 1 is a pattern this project hasn't named yet and is likely to hit again: a shared layout component gained a new boolean prop (`checksLine`) that changes the height of a block another, older prop (`rightBadge`) positions itself against with a percentage-based absolute offset, and the two props' only live combination shipped with no render check of that specific pairing.

```
## 2026-09-13 · site-design-check · the-edit-ai-site-map
**What happened:** `CobaltZone.tsx` gained a `checksLine` prop (step 1) that adds a paragraph to its header block. The pre-existing `rightBadge` prop centres itself with `top-1/2 -translate-y-1/2` against that same block's total height. `/ai-news` (`WhatsNew.tsx`) is the only page passing both, and no screenshot at any desktop width exists of that specific combination, before or after `checksLine` shipped, every other documented reasoning about this slot's geometry (the `helpBubble` overlap fix, the `bodyText` opacity note) predates the new prop and doesn't mention it.
**Proposed rule:** when a shared layout component gains a prop that can change the height of a container another prop already positions itself against with a percentage-based absolute offset (top/left as `%`, not a flex sibling), the step that adds the new prop is not done until every live page combining the two props has been rendered and measured at desktop width at least once, not just the combinations that existed before the new prop landed.
**Belongs in:** web-build-guide.html, section 6 (ratified learnings), design-check class, adjacent to the existing placeholder-slot and entity-identity learnings from 18/26 June 2026, this is the same family of "a sizing/positioning contract written for one shape silently breaks when a sibling gains new content," one level up at the component-prop level rather than the placeholder-slot level.
```


---

## Note from the main session, 13 September 2026

**Finding 1, rendered.** `/ai-news` measured at 1280 and 1440 against the live
site as the before. The badge's centre sat 30px below the h1's centre before
and sits 50px below it now: it moved down 20px, level with the subheading
rather than between heading and subheading, because it centres on a block the
checks line made taller. It does not overlap anything and still reads as the
feed's source label. Recorded as acceptable and put to Jasmin with the two
captures rather than pinned to the heading row; the pin is the fix if she
wants it.

**Finding 2, on record now.** Jasmin chose the hub row order from the question
preview on 13 September, which showed "My Stack · Design · Learning · AI News",
the landing page first. `build-plan.md` ruling 1 now states the order.

**Finding 3** is put to Jasmin as a one-line option. **Finding 4** matches the
approved mock and needs nothing.

The agent appended a proposed learning to
`~/AI Work/cowork/PROJECTS/CHIEF OF STAFF/Claude Setup/LEARNINGS.md`, outside
this repo; it is surfaced to Jasmin to ratify or reject. Em dashes in the draft
were replaced before commit.
