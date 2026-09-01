# Post-merge mobile stranger audit — 1 September 2026

Scope set by the brief: five named questions on mobile behaviour, not a full
cold-pass five-second test. No prior `site-stranger-*` report exists in this
repo to reconcile against.

**Tooling constraint, stated up front rather than worked around:** this
session had no shell/Bash tool and no browser/screenshot tool. `git show` on
the pre-merge commit could not be run. `WebFetch` against `theeditai.co.uk`
returns only the static `index.html` shell (page title, no body) because this
is a client-side SPA that fetches Sheet data at runtime — the tool cannot
execute the JS that renders any card, price or icon. Every visual claim below
is therefore a **code-level finding**, cross-checked against real Sheet
strings where a copy of them exists in the repo's own reports, and every place
that needs an actual rendered look is named as a manual check rather than
assumed. This matches the project's own rule that a status code, a DOM
property, or an unrendered SPA shell is not verification.

---

## Verdict

Would a skeptical stranger stay and act, on a phone? On `/tools` and
`/policy-template`, yes — the funnel (directory → template → work with me) is
intact and the template is a real one-tap download. Two defects sit inside
that path and cost real leads: the Claude icon collision on `/my-stack` (a
credibility hit on the one card built to show off the stack owner's judgement)
and the invisible `/radar` exit on `/tools` (buried below roughly 24 stacked
cards on a phone, which is the practical equivalent of not existing for most
visitors). Neither is fatal to the funnel; both are named fixes below.

---

## Q1. `/my-stack`, Claude icon vs pricing text collision

**Confirmed as a code-level defect, not independently screenshotted.** Element:
`src/pages/MyStack.tsx:170-176`, the mobile-only Claude mark inside
`FeaturedCard`:

```tsx
<div
  aria-hidden="true"
  className="sm:hidden absolute"
  style={{ right: "20px", top: "20px", pointerEvents: "none" }}
>
  <ClaudeStar size={48} color="#C8F04A" />
</div>
```

Mechanism: this `div` is `position: absolute` inside the outer card (`padding:
28px`, `position: relative`, `MyStack.tsx:40-48`), not inside the text
column's flex flow. Absolute positioning reserves no space, so nothing in the
text column (`flex-1 min-w-0`, `MyStack.tsx:52`) is aware the icon exists or
leaves it a gap. The icon sits roughly at `y: 20–68px`, overlapping the
vertical band the `h2` name, the pricing `span`, and the top of the
`what_it_does` paragraph all occupy (`mt-3` puts the paragraph's first line at
roughly `y: 65px`). Text painted later in the DOM does not automatically sit
above an earlier absolutely-positioned sibling at the same stacking level — in
this markup the icon is the *last* child of the row, so it paints on top,
which is why it reads as an overlay rather than the text wrapping around it.

Telling detail already in the code: `pointerEvents: "none"` is set specifically
on this aria-hidden icon. That is only necessary if something clickable can sit
underneath it — the author already knew text or a link could end up under the
icon and pre-emptively made it click-through. That is corroborating evidence
for the defect, not proof it is visible today with today's exact string
lengths, which is why this needs the manual check below before a fix ships.
Only one row can ever hit this: `my_stack` carries a single `featured=true`
entry (Claude — `.claude/schema.md:83`), so this is a one-card bug, but it is
the card built specifically to be the site owner's headline "what I actually
use" statement, which is exactly the wrong card to get wrong.

Fix direction (not code, per the constraint): reserve space for the icon on
mobile — either give the text column a `padding-right`/`max-width` matching
the icon's footprint plus gap, or drop the icon a few px so it clears the
paragraph's first line, or move it into the flex flow instead of `absolute`.

**On "did the text get smaller or did the layout get worse" — could not be
checked as asked.** `git show 47a0d1e:src/pages/MyStack.tsx` needs a shell,
which this session does not have. I did not fabricate numbers to answer this;
here is what the repo's own documentation establishes instead, which changes
the shape of the question:

- `47a0d1e` is not a recent revision of today's page. Per `SCRATCHPAD.md:53`
  ("Live site (`main`, commit `47a0d1e`): unchanged. Old positioning, 66 tool
  rows...") and the multiple entries pinning `main` at `47a0d1e` through
  30 August, that commit is the **pre-overhaul site**, from before the sector
  axis rebuild. The `FeaturedCard`/`ClaudeStar` design being compared against
  it did not exist yet at that commit — the Claude-as-featured-entry treatment
  is downstream of the 26–28 August My Stack restructure work described in
  `.claude/CLAUDE.md`'s "Codebase conventions" and "Current state" sections.
- So "pre-merge the text read larger and the layout worked better" is not
  comparing two sizes of the *same* card. It is comparing today's card against
  a structurally different, older page that most likely did not carry this
  icon treatment at all. That reframes the complaint: there may be a genuine
  readability regression somewhere in the 26–28 August restructure, but it
  cannot be "the same layout, just shrunk," because the layout is not the same
  layout.
- What I can confirm from today's file directly: `StackCard` (the non-featured
  cards, `MyStack.tsx:182-304`) sets the tool name at **16px** (`font-heading`,
  weight 500) and pricing at **12px**. `FeaturedCard` sets the name at
  `clamp(24px, 3.2vw, 32px)` and pricing at 13px, `what_it_does` at 14px on
  both. 16px for a card title is on the small side for a primary heading on a
  phone (18–20px reads more comfortably) but is not itself illegible; it is a
  judgement call, not a defect.
- **Recommendation:** do not treat "pre-merge was better" as settled. It needs
  a session with `git show` (or `git log -p -- src/pages/MyStack.tsx` filtered
  to before the 26 August restructure commits) to see what the immediately
  pre-restructure card actually looked like, not the pre-overhaul page. The
  collision fix above should ship regardless of how that comparison lands.

**Named manual check:** DevTools device toolbar at 375px on `/my-stack`,
featured card only, with today's live Claude row content (name + pricing +
what_it_does), to confirm the exact pixel overlap and pick the fix.

---

## Q2. Scroll-back-to-top — reusable pattern found

Found in `~/Developer/jasmin-aziz`: `scroll-top.js`, `index.html:334-338`, and
`site.css:726-762`. This is a complete, working, small pattern — reuse it
rather than building fresh, as instructed.

**Component/markup** (`index.html:334-338`):
```html
<button id="scroll-top-btn" class="scroll-top-btn" aria-label="Back to top">
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 15V5M5 10l5-5 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</button>
```

**Trigger threshold:** `window.scrollY > 300` (`scroll-top.js:10`) — the
button gains a `.is-visible` class past 300px of scroll and loses it above
that, on a plain `scroll` listener with `{ passive: true }`.

**Click behaviour:** `window.scrollTo({ top: 0, behavior: 'smooth' })`, with a
`prefers-reduced-motion` check that swaps `smooth` for `auto` when the user has
that preference set (`scroll-top.js:18-19`) — accessibility handled at the
animation level, not just visually.

**Position and styling** (`site.css:727-747`): `position: fixed; bottom: 24px;
right: 24px;`, a 48×48px circle (`border-radius: 50%`), background
`var(--cobalt)`, white icon, `box-shadow: 0 2px 8px rgba(0,0,0,0.18)`,
`z-index: 9001`. Hidden state is `opacity: 0; pointer-events: none; transform:
translateY(8px)`, transitioning to visible over 0.2s. **Explicitly hidden on
desktop**: `@media (min-width: 901px) { .scroll-top-btn { display: none; } }`
— it is a mobile/tablet-only affordance by design in the sibling repo, which
matches what's being asked for here.

**Accessibility:** `aria-label="Back to top"` on the button (icon is
`aria-hidden`), 48×48px touch target (clears the 44px minimum), reduced-motion
respected on the scroll animation itself, and it never traps focus or steals
it — it's a simple button, not a dialog.

**What changes for The Edit's locked palette:** `var(--cobalt)` in the sibling
repo happens to already be a cobalt-family colour, but not the same hex — swap
it for `#2D35C9` (the locked cobalt) with hover `#1A1510` (the locked cobalt
hover, per `.claude/CLAUDE.md`'s Design system section), not the sibling's own
`--cobalt-hover: #1a3fcf`, which is off The Edit's palette. Icon stays white
(cobalt carries white fine, unlike periwinkle). The rest — position, size,
threshold, motion handling, `aria-label` — needs no change to fit.

**Which routes need it most.** Longest phone scrolls, ranked:
1. **`/tools`** — up to 23 tool cards plus the spliced template card in a
   single mobile column (`grid-cols-1` below `sm`, `Tools.tsx:385`), each card
   carrying a checks zone with several `AxisLine` rows, a DPIA chip and a
   buying zone (`ToolCard.tsx`). This is the longest page on the site by a
   wide margin.
2. **`/radar`** — up to 44 cards, same single-column mobile grid
   (`Radar.tsx:324`), even longer than `/tools` by row count, though each
   `RadarCard` is lighter (no checks zone).
3. **`/my-stack`** — 19 rows across a featured card plus grouped category
   sections (`MyStack.tsx:377-396`), shorter than the two directory pages but
   still a genuine scroll.
4. **`/learning`** and **`/ai-news`** — not read in this session, worth a
   quick length check before deciding whether the button ships site-wide or
   only on the three worst pages.

If it ships everywhere via `Layout.tsx` (which already renders the footer and
`FooterEmailCapture` on every route, so precedent exists for a global,
route-agnostic component), the 901px desktop cutoff means it costs nothing on
desktop and needs no per-page wiring.

---

## Q3. `/radar` signpost — should there be an additional mobile CTA elsewhere?

**No — not elsewhere.** Recommendation is to fix the placement on the page
that already carries it, not to add a second entry point on another page.

**Reasoning against "elsewhere":**
- `/radar` is deliberately positioned as secondary: "treat them as leads, not
  recommendations" (`Radar.tsx:243`), no IN MY STACK badge, no lime CTA pill —
  every design choice on that page down-ranks it against `/tools`. Giving it a
  second, independent entry point (homepage, nav, footer) fights the page's
  own stated priority and dilutes attention from the actual money path
  (`/tools` → `/policy-template` → "Work with me").
- The nav overflow reasoning (`scrollWidth 1046` vs `clientWidth 1024`,
  documented in both `Tools.tsx:238-244` and `Radar.tsx:19-23`) is a
  **desktop** horizontal-nav constraint. I checked `Layout.tsx`: the mobile
  nav is a vertical `Sheet` drawer (`Layout.tsx:120-171`), not width-limited
  the same way, so a mobile-only nav entry is technically free of that
  specific overflow bug. But the width bug was the trigger for the decision,
  not the reasoning — the reasoning is "secondary view of the same directory,
  not a seventh destination" (`Radar.tsx:19-20`), and that argument applies
  equally on mobile. Reopening it on a technicality (mobile drawer has room)
  contradicts a ruling made twice (28 August, then again 1 September) for a
  content reason, not a layout one.
- Adding it to the footer (site-wide, every route) has the same problem as a
  nav entry: it would make `/radar` a permanent fixture on every page rather
  than something surfaced in the one context where it's relevant — someone
  already looking at the vetted directory and wondering what else is out
  there.

**What is a real problem, on the same page:** the mobile signpost currently
renders **after the entire grid** (`Tools.tsx:394`, `sm:hidden mt-12`), and the
grid holds up to 23 tool cards plus the spliced template card — roughly 24
stacked items, each with a checks zone, axis lines and a DPIA chip
(`ToolCard.tsx`). That is a long scroll before a mobile visitor ever sees "On
My Radar." The top-of-page placement was rejected for a documented reason
("Ruled 1 Sep: on a phone this cannot sit at the top, because it takes the
first screen away from a reader still working out what `/tools` is" —
`Tools.tsx:366-368`), which is sound and shouldn't be reopened either.

The middle path that respects both rulings: `Tools.tsx` already splices a
second element into the grid mid-list — the `templateCard`, inserted after the
6th card (`Tools.tsx:318-323`, `gridItems()`). The same mechanic could carry
the radar signpost further down the same single-column grid (for example after
card 12, roughly the midpoint) instead of only at the very bottom, so a mobile
visitor who scrolls even partway through the directory meets it, without
taking the first screen and without adding a new page-level entry point. That
is a same-page repositioning, not an "elsewhere" CTA, and it is a genuine gap
worth closing given how long the grid runs on a phone. I'd weight this above
the current bottom-only placement but stop short of recommending a second
entry point on a different page.

---

## Q4. `/policy-template` intro paragraph, mobile density

Source: `PolicyTemplate.tsx:38-50`. The intro is a single `<p>`, no internal
breaks, `fontSize: 20`, `fontWeight: 500`, `lineHeight: 1.4`, inside a `640px`
max-width container with `px-4` (16px) side padding below `sm`.

**Count:** 93 words, 8 sentences, one unbroken paragraph.

1. "Most AI policies are written for organisations with a legal team."
2. "This one is written for yours: a working AI-use policy for charity,
   cultural and heritage organisations, covering the questions that actually
   come up."
3. "Which tools staff can use and for what."
4. "What must never go into them."
5. "How to work out whether your organisation needs to do a DPIA."
6. "What you tell trustees, funders and supporters."
7. "It's the starting point I use with consultancy clients, ready to adapt to
   your organisation."
8. "It's the document you can put in front of your board."

**Line-count estimate at 375px** (named as an estimate — the manual DevTools
check below should confirm the exact number): container width at 375px is
343px (375 − 32px padding; the 640px max-width never binds below `sm`). At
20px Plus Jakarta Sans medium, roughly 32–33 characters fit per line. The
paragraph runs to roughly 540–550 characters including spaces and punctuation,
which comes out to **approximately 16–17 lines** with zero visual break before
the CTA button. That is a genuinely dense wall of text on a phone, more than
"dense" — it is one unbroken block a stranger has to get through before the
"Get the template" button even comes into view without scrolling past the
copy.

**Judgement: split it.** Not a rewrite — the sentence boundaries already carry
a natural three-part structure that maps to three existing full stops:

- **Break 1**, after sentence 2 ("...come up."): sentences 1–2 are the
  positioning statement (what kind of document this is and who it's for).
- **Break 2**, after sentence 6 ("...supporters."): sentences 3–6 are a
  four-item list of what the template actually covers — currently run
  together as prose, they'd read as a scannable cluster on their own.
- Sentences 7–8 close on credibility and audience ("starting point I use with
  consultancy clients" / "document you can put in front of your board").

That gives three shorter paragraphs from existing sentence boundaries only —
no new copy, no reworded text, just where the `<p>` tag breaks. This is the
recommendation; the actual paragraph split is Jasmin's to place, not mine to
draft.

**Named manual check:** DevTools at 375px on `/policy-template` to confirm the
16–17 line estimate and re-check after any paragraph split.

---

## Q5. DPIA reference on `/policy-template` — does it need a linked source?

**Yes, link it.** Definite answer, with the reasoning the ratified-learnings
rule already half-supplies:

The site's own 15 June 2026 learning says a jargon term used to sell an offer
needs its definition within the first scroll — that's a copy-placement rule
and `/policy-template` already satisfies it differently (it defines DPIA
itself, in prose, at `PolicyTemplate.tsx:142-154`, further down the page under
"What's a DPIA, and why does everyone keep saying it?"). The question here is
narrower and different: not whether the term is defined, but whether the
definition is backed by an **authoritative external source** rather than
resting entirely on Jasmin's own paraphrase.

Three reasons this specific page needs it, not just any page:

1. **This is the credibility page.** The whole site's pitch is "sector
   precision is credibility" (`.claude/CLAUDE.md`, Voice rules) and this page
   is where a reader decides whether to trust the document enough to put it in
   front of a board. An unlinked, self-sourced definition of a regulatory term
   is exactly the kind of thing a careful reader (a comms lead who *is* the
   buyer, per the site's own positioning) will want to verify before repeating
   it upward.
2. **The claim is doing real governance work.** The paragraph tells the reader
   "your board will ask" about DPIAs and positions the free template as the
   thing that walks them through "when one's needed." That is advice with
   consequences if wrong. A regulator citation is the difference between "a
   consultant's opinion" and "here's where I got this."
3. **Scale.** The site makes DPIA claims on 23 live tool cards via the chip
   (`ToolCard.tsx`, `DPIA_CHIP`) plus this page's prose definition — 24
   places, all resting on the same underlying regulatory concept. One
   authoritative link on the page that actually explains the term is cheap
   insurance for all 24 uses; right now none of them cites anything.

**Named URL:** the ICO's own DPIA guidance —
`https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/guide-to-data-protection/accountability-and-governance/data-protection-impact-assessments-dpias/`
— is the correct authoritative source: it's the UK's data protection
regulator, it's free, it's written for organisations rather than lawyers, and
it matches the audience (no legal team) the template itself is written for.

**Verification status, stated honestly rather than assumed:** `WebFetch`
against `ico.org.uk` returned `403 Forbidden` on every attempt in this
session, including the direct URL above and general searches routed through
it. That is very likely this tool being blocked (ico.org.uk sits behind bot
protection), not evidence the page doesn't exist — but a 403 is not a 200, and
per this project's own rule an HTTP status is never verification either way.
**I could not independently confirm this exact URL resolves.** Before it goes
into the page, open it in a real browser and confirm the heading and content
match "Data Protection Impact Assessments," and check it against whatever
`axis-policy-urls.json`-style URL-checking convention the project already
uses for tool rows, since that machinery already exists for exactly this
problem (`reports/axis-policy-urls.json`).

**Placement, following the same-page pattern already in use:** the existing
DPIA explainer sits below the CTA on purpose ("so it does not interrupt the
conversion path," `PolicyTemplate.tsx:126-130`) — keep that placement and add
the citation as a single linked phrase inside or immediately after the
existing explainer paragraph, not as a new block. This doesn't touch the
first-scroll rule (that rule is about *where the definition sits*, which is
already settled for this page); it's about whether the definition, wherever
it sits, is backed by something a reader can click through to.

---

## Dead-end pages

None found in the five routes examined for this brief (`/tools`, `/radar`,
`/my-stack`, `/policy-template`). All four end on a clear next step: `/tools`
and `/radar` end the grid with the radar signpost / return-to-Tools link
respectively, `/my-stack` ends on a "How I built this" strip (a soft close,
not a dead end — arguably could use its own CTA, but that's outside this
brief's scope), `/policy-template` ends on the DPIA explainer directly under
the CTA. Not exhaustive — `/design-kit`, `/learning`, `/ai-news`, `/submit`
and the legal pages were not read in this session.

---

## Named manual checks (not performed — no browser tool this session)

1. **DevTools device toolbar, 375px, `/my-stack`** — confirm the Claude icon
   collision against today's live `featured` row content, before choosing a
   fix.
2. **DevTools device toolbar, 375px, `/policy-template`** — confirm the
   16–17-line estimate for the intro paragraph.
3. **Real phone pass, `/tools` and `/radar`** — confirm the practical scroll
   length to the radar signpost / bottom of grid, and how the recommended
   mid-grid signpost would actually feel at roughly the halfway point.
4. **A real browser hit on the ICO URL above** — confirm it resolves and the
   content still matches "Data Protection Impact Assessments" before it's
   published on the page.
5. **`git show 47a0d1e:src/pages/MyStack.tsx` (or `git log -p` filtered to
   before the 26 August restructure commits)** — from a session with shell
   access, to settle the pre-merge font-size/layout comparison properly rather
   than leaving it open.

---

## One sentence for a friend

"It's a well-checked list of AI tools for charity comms people, but the page
showing off what the site's own creator actually uses has her favourite tool's
name half-covered by its own logo on a phone." Not generic — it's the specific
defect a stranger would actually notice and mention, which is the point.
