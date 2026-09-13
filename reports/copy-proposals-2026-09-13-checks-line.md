# Copy proposals: the checks line

**13 September 2026. `site-copywriter`.** Draft only, per step 1 of
`build-plan.md` and item 2 of "Rulings needed from Jasmin". Nothing here is
placed. Jasmin rules the exact string and whether My Stack's existing second
sentence stays.

## What I read

`src/components/CobaltZone.tsx`, and the four call sites: `MyStack.tsx:347-351`,
`DesignKit.tsx:365-369`, `Learning.tsx:40-43`, `WhatsNew.tsx:180-185` (this is
the `/ai-news` page component). Also `Radar.tsx`'s subheading
(`"Tools I've spotted but haven't put through the checks yet."`) and its
disclaimer above the grid at `:299-313`
(`"These haven't been through the DPIA, data and training checks that get a
tool onto the main directory, so treat them as leads, not recommendations. If
one earns its place, it moves to Tools once it's checked."`).

**One technical fact this changes the brief a little.** `CobaltZoneProps.bodyText`
is typed `string`, not `ReactNode`. `subheading` was widened to `ReactNode` on
1 Sep 2026 specifically so a call site could place a `<br/>` inside approved
copy; `bodyText` was not. So **any candidate below that names "Tools" cannot
render it as a clickable link unless the build widens `bodyText` (or adds a new
prop) to `ReactNode`, the same move already made once for `subheading`.** That
is a code decision, not a copy one, but it gates whether "Tools" can be a link
at all. I've flagged per candidate whether it assumes that widening.

**Current state of the four pages**, for context on where this line lands:
- `/my-stack`: heading, subheading, and a two-sentence bodyText ending "The
  tools directory is the recommended list."
- `/design-kit`: heading, subheading, bodyText, no existing pointer to Tools.
- `/learning`: heading and subheading only. No bodyText today.
- `/ai-news`: heading, subheading, and a `rightBadge` reading "Source: The
  Rundown.ai" (top-right sticker). No bodyText today.

So the same shared string has to stand alone on three of the four pages, with
nothing above it already explaining what "the checks" are.

## Set A: sits beside My Stack's existing sentence, unchanged

These say only the negative half (this page hasn't been through the checks)
and deliberately don't also point at Tools, so they don't duplicate what My
Stack's own "The tools directory is the recommended list." already does. Cost:
on the other three pages, the reader gets the fact but no pointer to where
checked things live.

**1. (recommended) "This page hasn't been through the checks."**
Plainest form of the ruled claim, in its negative. Self-contained on all four
pages, no new terminology, no risk of colliding with anything already on the
page. Risk: bare, on `/learning`, `/design-kit` and `/ai-news`, since nothing
nearby says where checked things do live.

**2. "Nothing on this page has been through the checks."**
"Nothing" scoops in every kind of content on the four pages: tools, courses,
news items, without naming any of them, which matters most on `/learning`
(courses and references) and `/ai-news` (news stories, not tools). Risk:
slightly more clinical than candidate 1, and no real gain over it beyond that
scope.

**3. "This is a different kind of page. It hasn't been through the checks."**
Frames the fact warmly before stating it, which answers the "warmth over
warning" guard directly and the rejected-as-pessimistic line from September.
Risk: two sentences against the one-sentence preference; "different kind of
page" is a soft label that papers over how different `/my-stack`,
`/design-kit`, `/learning` and `/ai-news` actually are from each other, not
just from Tools.

**4. "None of this has been through the checks yet." Do not use as written.**
Included to show why it's out: "yet" promises a future check that nothing on
these four pages re-verifies. That's the exact "always current" problem the
brief rules out. Flagging it rather than silently dropping it, since it's the
first instinct for a warmer register and worth ruling out explicitly.

**5. "This page skips the checks that Tools runs."**
Names Tools, which conflicts with Set A's own logic (it would sit next to My
Stack's "recommended list" sentence and say a version of the same thing
twice). Also swaps the locked verb "been through" for "skips", which reads
breezier but drifts from the ruled phrasing. Included for register range, not
recommended. Assumes a link on "Tools" if used.

## Set B: My Stack's second sentence goes, this line carries the pointer everywhere

These do both jobs: state the fact, and name where checked things live, so the
line is fully self-contained on all four pages and My Stack loses nothing by
losing its old second sentence.

**1. (recommended) "This page hasn't been through the checks. Everything on
Tools has."**
The second sentence elides the same verb rather than restating it, which
keeps it to two short clauses instead of introducing a new noun phrase for
Tools. It's also the closest in rhythm to the parallel construction the
positioning statement itself uses ("Not a general AI directory... Not a
governance manual..."). Risk: the ellipsis asks the reader to carry the verb
across a full stop, which is ordinary English but is very slightly more work
than a plain repeat. Assumes "Tools" reads as the page name (it does, it's the
nav label) rather than needing a link, though it can carry one if `bodyText`
is widened.

**2. "This page hasn't been through the checks. Tools is the checked list."**
Says the same thing without the ellipsis, so it reads a beat slower but
nothing has to be carried across the full stop. Risk: "the checked list" is a
new descriptor for Tools not used elsewhere in the copy (the SEO meta and My
Stack's own retiring sentence both say "the tools directory"), so it adds a
third way of naming the same page. Assumes a link on "Tools" if used.

**3. "This page hasn't been through the checks that Tools has."**
One sentence, no ellipsis, no new noun phrase. Risk: "the checks that Tools
has" reads a little compressed grammatically (checks that Tools has [been
through]), and could want a small polish pass before it ships. Assumes a link
on "Tools" if used.

**4. "The checks are on Tools. This page hasn't been through them."**
Leads with where the checks live before saying this page lacks them, which is
the more positive-first ordering the "warmth over warning" guard asks for.
Risk: opens with "the checks" as though the reader already knows the term,
which is less safe on a cold landing (search, forwarded link) than opening
with "this page".

**5. "This page hasn't been through the checks. Tools has."**
The tightest possible version of the ellipsis in candidate 1, dropping
"Everything on" entirely. Risk: "Tools has" on its own, with no "Everything
on" to anchor it, reads slightly more like a fragment and less like a
complete thought at a glance; worth testing rendered before ruling it out or
in against candidate 1.

## Which set, and why

**I recommend Set B, candidate 1.** Reasoning: the build deliberately made
this one shared string precisely so the four pages can't drift, and Set A
keeps an asymmetry inside that design, where a visitor landing on `/my-stack`
gets the full picture (the fact, plus a pointer, because the old sentence
survives) while a visitor landing cold on `/learning`, `/design-kit` or
`/ai-news`, which is exactly the direct-landing-from-search scenario this fix
exists for, gets only the fact and no pointer at all. Set B closes that gap by
making the single shared line do the whole job everywhere, and lets My Stack
retire a sentence that becomes redundant once it does.

**"This page hasn't been through the checks. Everything on Tools has."**
against the six questions in "The test":

1. *Does it help the reader do her job first, and flag what to mind second?*
   It's not task content, it's a disclosure, so it doesn't compete with the
   page's own job-helping copy above or below it. It does the flagging job
   cleanly and gets out of the way.
2. *Would someone arriving nervous leave more capable, not more audited?*
   Yes. No DPIA, no due-diligence language, no claim that this page is unsafe,
   just a plain fact plus a place to go. It doesn't audit the reader or the
   page.
3. *Can you hear Jasmin?* Closer than the alternatives: the elided second
   clause has the same clipped, parallel rhythm as "Not a general AI
   directory... Not a governance manual... And it never claims a tool
   passed" in the positioning statement itself.
4. *Does it press an advantage: a failure named, a price told straight,
   something worth forwarding?* No, and it isn't meant to. This is a claim
   correction, not one of the pressed advantages, and forcing it to do that
   job would overload one sentence.
5. *Does precise vocabulary stay in the board layer, translated where it's
   first met?* N/A here; the line uses no board vocabulary at all, which is
   correct for a first-moment surface that all four of these pages are.
6. *Does it say been through the checks, never passed?* Yes, both in the
   negative ("hasn't been through the checks") and in the elided positive
   ("Everything on Tools has [been through the checks]").

## What's already right and doesn't need a line

Nothing to report here: none of the four pages currently makes a false claim
of being checked, they simply say nothing on the subject, which is the gap
step 1 exists to close. There's no existing string on any of the four
`CobaltZone` calls that needs cutting for accuracy; My Stack's "recommended
list" sentence is accurate as written, and Set B proposes retiring it only
because the new line makes it redundant, not because it's wrong.

---

## Note from the main session, 13 September 2026

Checked against the code before relaying. `bodyText` is typed `string` and
`/learning` and `/ai-news` pass none, as stated above. The caveat that a
candidate naming Tools cannot carry a link does not apply to this build,
though: step 1 renders the checks line as its own element inside `CobaltZone`,
switched on by a flag the four pages pass, not through `bodyText`. So any
candidate can link "Tools" to `/tools` without widening a type. One em dash in
the draft was removed.
