# Post-merge copy pass — 1 September 2026

Governing spec for this project: no project-local voice/brand doc exists in
`the-edit-ai`, so the applicable authority is `.claude/CLAUDE.md` (Voice rules
section) plus `reports/2026-08-28-positioning-statement.md`, which is
explicitly canonical on the site's claims and outranks everything but the live
site itself. Humanizer's catalogue applied as a mechanical pass only, filtered
through the fence (nothing in this batch triggers a flag the spec wouldn't
also agree with — no em dashes, no filler, no promotional hedging in any of
the current live strings reviewed below).

I do not edit files. Nothing below is placed. Candidates are marked as
candidates throughout; Jasmin chooses and places.

---

## ITEM A — the homepage counter caption. FLAGGED, not placed.

**Verdict: do not make this change as instructed. It reopens a ruling
Jasmin signed off three days ago, for a reason the positioning statement
names explicitly.**

### What "passed" would newly assert

"Been through the checks" is a **process claim**: this row was run through
the seven-field axis and the fact-check pipeline. It says nothing about the
outcome.

"Passed the checks" is an **outcome claim**: it asserts the tool cleared
them — succeeded, was approved, is safe to use. That is a materially
different and stronger statement than "been through."

### Would any currently rendering row make that assertion false?

Yes, and this isn't hypothetical. `reports/2026-08-26-a5-verdict-drafts.md`
confirms two of the 23 rendering rows carry a **Red DPIA flag**: HubSpot
(row 3) and DeepSeek (row 66). Red is the site's most serious caution
signal — the flag literally means typical comms use in this sector is likely
to trigger a Data Protection Impact Assessment. These rows are published
specifically so the site can warn the reader off default use, not to certify
them.

A caption reading "23 tools that have passed the checks," sitting under a
number that includes HubSpot and DeepSeek, tells the reader something the
site does not believe: that these tools were evaluated and cleared. That is
the exact contradiction the positioning statement rules out by name:

> "And it never claims a tool 'passed': the claim is **been through the
> checks**, which is what lets the failures stay honest." — positioning
> statement, "What it is not"

> Test question 6: "Does it say been through the checks, never passed?"

And `.claude/CLAUDE.md`: this wording is "what lets the published failures
stay honest." The homepage previously read "Passed the checks," was ruled
against on 28 August, and was changed to the current wording by copy pack
four for this exact reason. Reverting it isn't a fresh edit, it's undoing a
dated, signed-off ruling — silently, if placed without comment.

There's a second, smaller reason "passed" reads as a weaker claim even set
aside the failures: `/radar` publishes 44 tools nothing has checked at all.
"Passed" invites the inference that the other 44 failed, when in fact they
were simply never run — the site's own "checked so far, not checked
everything" framing (`filterEmptyState`, `radarSignpost`) depends on that
distinction holding.

### The legitimate complaint, and three alternatives that fix it without moving to "passed"

Jasmin's actual objection — "THROUGH THE CHECKS" as the eyebrow label
directly above a caption that also says "through the checks" — is real
duplication and worth fixing. Label kept exactly as instructed. Number and
`Counter` component untouched. Only the caption string changes. All three
below cut the repeated "through" and stay on the process side of the claim.

**Candidate A1** (plain, casual register):
> tools checked so far

Shortest of the three. Drops "been through" as a phrase but keeps "checked"
as a pure process word with no outcome implication. Trade-off: loses some of
the specific weight of "the checks" as this site's named mechanism; leans on
the label above to carry that.

**Candidate A2** (neutral, closest register match to the current line):
> tools that have completed the checks

Keeps "the checks" as the named object and the "have [verb]" construction of
the current line, so it reads as the smallest possible edit. Trade-off:
"completed" sits closer to "passed" than A1 or A3 do — a literal reading is
still process-only (the check process ran to completion; it says nothing
about the result), but it's the one of the three most likely to be misread
by a fast skim as "made it through successfully." Worth Jasmin's own ear on
this one specifically before it goes anywhere near live.

**Candidate A3** (slightly more emphatic, matches the site's "no shortcuts"
register elsewhere — e.g. "No sponsored listings, no affiliate links"):
> tools that have had every check

Restructures to "had" rather than "been through," keeping "check" as the
object, without repeating "through." Trade-off: "every" adds a rigour claim
that is true (all axis fields complete = the full set of checks run) but
slightly more declarative than the current line's tone.

**My read**: A1 is the safest — it has zero outcome-adjacent vocabulary at
all. A2 is closest to the current voice but carries the small residual risk
above. Jasmin's call.

---

## ITEM B — `/tools` subheading. Report only, no replacement drafted.

Current exact string, `src/pages/Tools.tsx:350-352`:

```
Pick the tool for the job. The checks give you a head start;{" "}
<br className="hidden md:inline" />
the final call is yours.
```

Renders as one sentence to a screen reader and in `textContent` (the space
before the `<br>` is deliberately kept for that): **"Pick the tool for the
job. The checks give you a head start; the final call is yours."**

Correct: no "AI" anywhere in it. It reads as a general statement about
picking *a* tool for *a* job — nothing in the sentence itself signals the
domain. The page's `<h1>` is just "Tools" (`:340`), also with no "AI." The
word only appears on this route in the `<SEO>` block (`:328-330`: title "AI
Tools Directory for Charity & Heritage Comms," description "Curated AI
tools for..."), which is meta, not visible copy, and per the working
principle already established in `.claude/CLAUDE.md` ("meta strings cannot
crowd each other, because nobody reads two"), meta carrying the word does
not satisfy a reader who never opens the `<title>` tag or a search snippet.

Constraints for whatever Jasmin drafts: the locked three-part audience
phrase ("charities, cultural organisations and heritage" nominal / "charity,
cultural and heritage" adjectival) never shortens to "charity" alone; no em
dashes; UK English, contractions fine per the locked voice rules.

**Other visitor-facing surfaces with the same omission**, so this can be
ruled on as a batch rather than page by page. Checked every `CobaltZone`
subheading in `src/pages/`:

| Route | Subheading (exact) | Mentions AI? |
|---|---|---|
| `/tools` | "Pick the tool for the job. The checks give you a head start; the final call is yours." | No |
| `/my-stack` | "What I'm actually using and why." (`MyStack.tsx:338`) | No — bodyText also doesn't (`:339`) |
| `/learning` | "How I'm staying sharp, and where to start if you're new to all this." (`Learning.tsx:42`) | No |
| `/radar` | "Tools I've spotted but haven't put through the checks yet." (`Radar.tsx:248`) | No |
| `/submit` | "Spotted something worth putting through the checks? Tell me about it." (`Submit.tsx:35`) | No |
| `/design-kit` | "From blank page to build-ready." (`DesignKit.tsx:367`) | No — but its bodyText does: "…making their own things with AI…" (`:368`) |
| `/policy-template` | "A free, adaptable AI-use policy template for charity, cultural and heritage organisations." (`PolicyTemplate.tsx:29`) | Yes |
| `/ai-news` | "Model updates, releases, and AI gossip." (`WhatsNew.tsx:183`) | Yes |
| `/` (homepage) | H1 is the wordmark "The Edit." only; `AboutPanel.tsx:108` body copy: "The Edit is my opinionated directory of **AI** tools for comms teams in charities, cultural organisations and heritage…" | Yes, in body copy |

So five surfaces omit it entirely from visible copy: `/tools`, `/my-stack`,
`/learning`, `/radar`, `/submit`. `/design-kit` half-does (bodyText only, not
subheading). This reads less like an isolated `/tools` gap and more like a
pattern worth Jasmin ruling on once, for all five/six at once, rather than
patching `/tools` alone and leaving the same gap open next to it.

---

## ITEM C — `/my-stack` subheading. Three candidates, one recommended.

Current live string, `src/pages/MyStack.tsx:339` (`bodyText` under the
`CobaltZone` on `/my-stack`, sitting directly beneath the subheading "What
I'm actually using and why." at `:338`):

> "The directory is what I'd recommend for your organisation. This is
> everything I run myself, including the tools that build this site."

Agreed this is confusing: it opens by pointing away, at the directory, then
pivots to "this is everything I run" without first establishing what "this"
(My Stack) is. Jasmin's steer correctly reverses that: personal claim first,
directory pointer second.

**One thing worth flagging before drafting**: her steer text opens "What I
actually use myself…", which is very close to the subheading sitting
directly above it, "What I'm actually using and why." Two adjacent lines
both opening on "what I actually use" reads as a stutter on the page even
though each is individually fine. I've varied the opening verb in two of the
three candidates below specifically to avoid that echo; the third keeps her
wording closest to verbatim so she can judge whether the echo actually
bothers her in context (it may not — "and why" versus a flat statement is a
real distinction, and it's her call).

All three: UK English, contractions, no em dashes, first person, "my stack"
never "your stack" (per the 1 Sep 2026 ruling), personal claim first /
directory pointer second per her steer.

**Candidate C1** (closest to her literal steer):
> "What I actually use, including the tools that build this site. The tools
> directory is the recommended list."

Cut "myself" from her draft — "I actually use" already carries the
reflexive sense, so "myself" reads as a small redundancy on top of it.
Trade-off: most literal to what she asked for; carries the most subheading
echo of the three.

**Candidate C2** — recommended:
> "These are the tools I run every day, including the ones that build this
> site. The tools directory is the recommended list."

Trade-off: swaps "use" for "run every day," which is more concrete (a claim
about actual daily practice, not a general statement of preference) and
sidesteps the echo with the subheading entirely. Keeps her second sentence
verbatim — it had no echo problem. This is the one I'd place if it were my
call: plainest, most direct, matches the "first-person workflow voice"
the positioning statement names for this exact page ("My Stack is the proof
that someone real runs the checks").

**Candidate C3** (gentlest edit, closest to the current live phrasing):
> "Everything here is what I run myself, including the tools that build
> this site. For a recommendation, that's the tools directory."

Trade-off: opens with "Everything here is…", a phrase already approved once
in the current live string ("This is everything I run myself…"), so it's
the smallest departure from what's already shipped. Second sentence is more
conversational and slightly less direct than her steer's flat declarative,
which is a real trade against the site's "direct, frank" voice rule.

---

## ITEM D — simple placements, verify only

**D1. "Curated by Jasmin Aziz" underline.**
`AboutPanel.tsx:146-169` renders it as an `<a className="about-byline">`.
The rule, `src/index.css:253-259`:

```css
.about-byline { text-decoration: none; }
.about-byline:hover,
.about-byline:focus-visible {
  text-decoration: underline;
  text-decoration-color: #C8F04A;
  text-underline-offset: 3px;
}
```

**Currently hover/focus-visible only, not persistent.** The base state is
explicitly `text-decoration: none`. If "should be underlined in lime" means
what's already there — hover and keyboard focus show the lime underline —
this is done and needs no change. If it means the underline should be
visible at rest, unconditionally, that's the opposite of what's coded and
is a real change, not a confirmation. The comment at `:243-251` explains the
current choice deliberately: the lime sits at ~1.4:1 on cream (not
reliably visible to every reader on its own), so it's layered as decoration
on top of ink link text that already carries the meaning, plus the browser's
own focus ring. Flagging for Jasmin to say which she means before this is
called verified.

**D2. Substack mention on `/policy-template`.**
`PolicyTemplate.tsx:123`, currently **plain text, not a link**:

> "It's a Word document, so you can make it yours. If you want more of this
> thinking, I write it up on the Substack."

No `<a>` tag, no `href`, no `.about-byline`-style class. To make it a link
carrying the lime underline it would need to point at `SUBSTACK_URL`
(`src/lib/links.ts:22`, `"https://jasminaziz.substack.com"`), which is
already the centralised constant every other Substack CTA on the site reads
from and is gated live (`SUBSTACK_LIVE = true`). This is a real code change
(wrap "the Substack" in an anchor), not a verification of something already
there — flagging so it isn't waved through as already-done alongside D1.

**D3. Mobile homepage subheading forced break.**
`AboutPanel.tsx:63-69`:

```jsx
<span className="block">There's a lot to keep up with in AI.</span>{" "}
<span className="block">This helps.</span>
```

Both spans are unconditionally `block` — **no responsive modifier at all**,
so the forced break currently applies at every breakpoint including mobile,
not just desktop. "Removing it on mobile" is therefore a new, scoped change
(adding a breakpoint split), not lifting an existing desktop-only rule.

Is scoping it to mobile-only coherent? Structurally yes — this codebase
already does exactly this pattern in reverse at `Tools.tsx:351`
(`hidden md:inline` on a `<br>`) and at `Tools.tsx:374,394` (the radar
signpost rendering above vs below the grid by breakpoint). A responsive
split here is a normal idiom in this file, not a novel risk.

But there's a substantive question underneath the mechanical one: **will
removing the forced break actually produce one line on a phone?** The h1 is
sized `clamp(30px, calc(4.6vw - 7px), 56px)`, with the 30px floor binding
below an 804px viewport per the existing comment at `:47-49` — so mobile
sits at or near the 30px floor. "There's a lot to keep up with in AI. This
helps." is roughly 44 characters in a display face at 30px inside a column
that's full-width minus padding on a ~375-430px phone. That's very unlikely
to fit on one visual line regardless of the span markup — removing the
forced break won't produce "no wrap," it will just let the sentence wrap
wherever the column happens to run out, which is precisely the thing the
`:63-67` comment says the forced break exists to prevent ("rather than
being broken across one wherever the column happens to run out"). If
Jasmin's goal is genuinely one line on a phone, the break isn't the
blocker — the column width and the 30px floor are, and removing the spans
alone won't get there. If her goal is just "stop forcing 'This helps.' onto
its own deliberate line and let it wrap naturally, wherever that lands,"
then removing the block spans on mobile does exactly that.

Accessible name: unaffected either way. The `{" "}` between the two spans
already keeps `textContent` reading as one continuous sentence
("There's a lot to keep up with in AI. This helps.") — that's what the
comment at `:67` documents as the reason the space is there. Removing the
`block` display (or the spans entirely) on mobile doesn't change what's in
the DOM as text, only how it's laid out visually, so nothing changes for a
screen reader.

One documentation note for whoever implements this, not a copy point: the
comment at `AboutPanel.tsx:63-66` states the break is deliberate, full stop,
with no breakpoint carve-out. If this becomes mobile-scoped, that comment
needs updating in the same change, or the next person to read this file
gets a comment that no longer matches what the code does — the exact
failure pattern `.claude/CLAUDE.md` has flagged repeatedly elsewhere in this
project (docs asserting something the code no longer does).

---

## Summary for Jasmin

- **Item A: do not place "passed" as instructed.** It reopens the 28 August
  ruling and would misstate HubSpot and DeepSeek's Red-flagged rows as
  cleared. Three non-"passed" alternatives above, A1 recommended as safest.
- **Item B: reported, not drafted.** Same gap exists on five other surfaces
  (`/my-stack`, `/learning`, `/radar`, `/submit`, half on `/design-kit`) —
  worth ruling once rather than patching `/tools` alone.
- **Item C: three candidates, C2 recommended** for resolving the echo with
  the subheading directly above it while keeping her order and meaning.
- **Item D: D1 needs a yes/no from Jasmin on hover-only vs persistent before
  it's "done"; D2 is a real code change (currently plain text, not a link);
  D3 is coherent as a mobile-only scope change but likely won't achieve a
  literal single line at the 30px floor — worth confirming the actual goal
  (stop the forced early break vs guarantee one line) before it's built.**
