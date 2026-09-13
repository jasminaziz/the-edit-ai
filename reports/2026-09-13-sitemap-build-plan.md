# The site map build: plan for sign-off

**13 September 2026. Code session. Nothing in this plan is built.** It answers
`reports/2026-09-13-sitemap-proposal-judgement.md` item by item, sets the build
order, prices each step, and lists what the plan assumes. The reader profile it
serves is the "Who it's for" section of
`reports/2026-08-28-positioning-statement.md`, which is assumption on its own
face, so everything below is judged against an assumed reader.

No visitor-facing string is proposed here except the hub label shortlist,
which Jasmin asked for as a one-off. Every other string is named as a
dependency and left to her.

---

## Two facts from live data that change the brief

Read through the app's own `fetchTools`, `isComplete` and `fetchLearning`
against the live Sheet on 13 September 2026.

**1. `/learning` is not the beginner's on-ramp.** My sitemap tile said "the
beginner's on-ramp?" with a question mark. The judgement report took it as a
premise, and it does not hold. Of 26 rows, **seven are for people building
software by their own titles**: three Claude Code courses, "ChatGPT Prompt
Engineering for Developers", "Python for Everybody", Tailwind CSS docs and
Lovable docs. The profile names developers and tool builders as not the
audience. **Four are beginner courses by their titles**: the Anthropic AI
Fluency and Nonprofit tracks, AI For Everyone and AI Essentials. The rest are
references and newsletters, one of which is The Rundown, the same source the AI
News feed extracts from. The page's own subheading carries both halves, "How
I'm staying sharp, and where to start if you're new to all this", and the
content is mostly the first half.

So the site has no beginner route today. The four beginner courses are the
nearest thing, and they sit among Tailwind docs. That is a content question,
and it is Jasmin's.

**2. The officer's first-named job is the thinnest.** Complete tools per job:

| Job | Complete | DPIA flags |
|---|---|---|
| Research | 6 | 6 Amber |
| Appeals & fundraising | **2** | 1 Amber, 1 Red |
| Case studies & storytelling | 10 | 8 Amber, 2 Red |
| Social | 6 | 5 Amber, 1 Red |
| Internal comms | 10 | 8 Amber, 1 Red, 1 Green |
| Accessibility | 6 | 6 Amber |
| Translation | 2 | 2 Amber |

The profile's officer has "an appeal email" first on her list this week. A job
chip for her lands on two cards, and one of them is judged not recommended.
`?job=` still ships, since the grid is honest about what exists, but the chip
row will expose the thin jobs on the homepage, where today they sit behind a
filter. That is a content question too: rows filled from the radar, not code.

---

## Where I disagree with the seven

**1. Hub name.** Agreed that "Go further" is wrong. The reason changes, though.
The on-ramp argument rested on `/learning` being beginner material, and fact 1
says it mostly is not. **Taking `/learning` out of the hub as the on-ramp would
put builder material on the bar under a beginner's label.** Taking it out only
works after its content is split, and that is a content job. The shortlist
below is written with this in mind.

**What the report ranks first, the checks line, belongs on the pages, not in
the hub row.** The report is right that this is a claim fix and ranks it
first, and I agree with the ranking. I'd put it somewhere else, though. Placed
in each unchecked page's own header, it:

- is visible on a direct landing from search or a forwarded link, which the
  consequences list's item 2 cares about;
- does not depend on the nav rebuild, so it can ship first and alone;
- keeps the nav purely navigation.

It is built as one shared string rendered by `CobaltZone`, so four pages cannot
drift. The hub row then carries tabs only.

**2. Proposition said twice.** Settled; the hero varies. That makes the hero
line **a fifth string dependency**, and the brief's list of copy decisions
doesn't include it.

**3. Checks strip heading.** Agreed, and it is Jasmin's. It blocks step 4.

**Report, "What it gets right" 3.** Promoting the template "retires a consistency rule" is not
right. Three "Get the template →" links remain (`FooterEmailCapture.tsx:61`,
`Tools.tsx:361`, `PolicyTemplate.tsx:169`), so the keep-them-identical rule
still applies to three rather than five.

**4. `?job=` gates the strip.** Agreed. Two additions. First, the thin jobs
above. Second, **below `lg` the filter rail scrolls sideways**, overflowing by
756px at 360 wide. A deep link to Translation, the last chip, would be active
but off-screen, so the build must scroll the active chip into view.

**5. Phone card proportion.** Agreed on the diagnosis. My solution: **on a
phone, the same three cards as desktop in a sideways scroll-snap row**, failure
last, the next card peeking. The proportion matches desktop at one in three,
and the height is one card instead of two. It is the pattern the `/tools` rail
already uses on a phone, with no JavaScript. The cost is that the failure is
the card seen least. Putting it second instead of last is the lever if that
matters more than matching desktop.

**6. The person off the end.** Agreed. The fix is the order: **hero, checks,
About, template, Go further.** That reads as what the site is, then the proof,
then who holds it, then the forwardable, then the rest. On a phone, the Go
further tiles shrink to a two-by-two block of links. **Estimated** phone
length drops from the boards' 3,805px to about 2,800px, against 2,139px today:
roughly 31% longer rather than 78%. It is an estimate until built and measured.

**7. Template on the bar and above every footer.** Agreed: look once built.
One sharpening. The homepage would carry four routes to one page on or near
its first screen: the tab, the hero button, the Red card's template link and
the moved block.

---

## Build order and cost

Estimates are session time and exclude waiting on copy. Each step is one job,
committed separately, on a feature branch in its **own git worktree**, so it
cannot collide with Cowork in the shared tree. The branch is pushed for
preview, and nothing reaches `main` without Jasmin's sign-off.

| # | Step | Blocked on | Cost |
|---|---|---|---|
| 0 | Stranger pass on today's first viewport, 390 and 1280, framed by the profile's first-screen rule. Consequences item 7, and the "before" for step 4, since there is no analytics to judge the "after". No code | nothing | 1 hour |
| 1 | The checks line on `/learning`, `/design-kit`, `/ai-news`, `/my-stack`: one shared string in `CobaltZone`, four pages pass a flag. `/radar` keeps its own | the line (Jasmin), and whether My Stack's existing sentence stays beside it | 2 hours |
| 2 | `?job=` on `/tools`: read the parameter, match by `toSlug` against `CATEGORIES`, set the chip, scroll it into view; an unknown value loads normally. Tests for the matcher | nothing | 3 hours |
| 3 | Nav and hub: three tabs plus the hub; the second row on hub routes; a grouped drawer; the phone second row; both "Get the template →" links out of the chrome; labelled nav landmarks and `aria-current`; measured at 375, 1040 and 1280; the CLAUDE.md nav block and link inventory rewritten | the label; which page the hub lands on | 1 day |
| 4a | Homepage order and checks strip: `ToolCard` reused unchanged; the card rule below; desktop row and phone rail; the template block moved up with `FooterEmailCapture` skipped on `/`; About after the checks; compact Go further on phone | steps 2 and 3; the checks heading ruling | 1 day |
| 4b | Hero: desktop wordmark on a clamp with a px cap, measured at 1024, 1280, 1440 and 1920; the proposition block **above** the pills layer; DragHint re-anchored; 640 to 1023 designed; the phone left alone; the pile measured over several runs with `requestAnimationFrame` pumped | the hero line | 1 day |
| 5 | AI News re-point (E3). A change to the Routine's prompt, not this repo's code | Jasmin | outside this build |

**About four days of session time.** Steps 1 and 2 are independent and can go
now: step 1 the moment its line exists, step 2 today. Step 3 waits only on the
label. Step 4 waits on two strings and on step 2.

**The card rule for step 4a, for ruling:** the two most recently checked
non-Red rows, then the most recently checked Red. It is deterministic, needs no
Sheet column, and refreshes itself each time the audit restamps
`last_checked`. The alternative is an editorial pick held in the Sheet, which
is a schema change and one more thing for Jasmin to maintain. Hardcoding three
names is ruled out, because a rename or cut breaks it silently.

**The AI News tile, for ruling:** on today's homepage it shows the one stream
the profile says is off-audience, general AI news. I'd leave it off the new
homepage until the re-point, and keep the route in the hub.

---

## Found that neither pass looked at

1. **The pills would swallow clicks on the hero buttons.** The `HomeGravity`
   layer covers the whole hero at `z-20` and takes pointer events for
   dragging, so buttons beneath it are unclickable. The proposition block has
   to sit above the pills, which means pills slide under the text rather than
   over it. That is a visible change from today's "drag across the type", and
   Jasmin should see it rendered.
2. **Vercel previews cannot review step 4.** Per CLAUDE.md, the Sheets key is
   absent from the Preview environment and the production key is
   referrer-locked, so the preview renders no cards, counter or pills. (This
   was not re-checked today.) Steps 1 to 3 can be reviewed on a preview. Step 4
   gets reviewed through localhost renders like today's boards, or on a local
   run.
3. **Two viewport ranges were never mocked.** From 640 to 1023 the chrome is
   mobile while the hero is on its desktop sizing, and the proposition has no
   obvious place. Above 1280, the wordmark is on `vw` with no cap, so at 1920
   "Edit." would be about 440px of type and the proposition would fall below
   the fold again.
4. **The two nav landmarks need distinct accessible names**, and the hub row
   needs `aria-current`. Two unlabelled `nav` elements read as the same thing
   twice.
5. **`/submit` is linked from nowhere** but sits in `sitemap.xml`. It is
   indexable and unreachable. That is a ruling on whether to link it or drop it
   from the sitemap, and it is not part of this build.

---

## Assumptions, surfaced before any of it starts

1. **The reader is assumed.** If the October read moves the primary reader to
   the head of comms, steps 1 to 3 and the structure of step 4 still hold,
   because they help any reader. What would move is the register of the hero
   and chips, and that is copy, not code.
2. **This build doesn't affect the October read.** Titles, meta and canonicals
   are untouched, so Search Console arrivals measure the same thing before and
   after.
3. **`ToolCard` is reused as it is.** It takes a tool and a local selection
   state, and nothing on `/tools` changes.
4. **The 1 September hero measurements reopen with step 4b.** They were taken
   against the current hero height, and the pile, gap and DragHint figures in
   CLAUDE.md all get re-measured and rewritten, not carried.
5. **Five strings gate the build:** the hub label, the checks line, the hero
   line, the checks-strip heading, and whether My Stack keeps its existing
   sentence. Nothing gates step 2.
6. **Today's nav ruling reopens.** My Stack became the last tab this morning.
   Signing off step 3 reopens that ruling, and it should be a conscious
   decision.

---

## The hub label: shortlist for Jasmin's ruling

The hub holds My Stack, Design kit, Learning and AI News, with Workshop and
Field Notes to come. As the judgement report says, what they share is that they
come from Jasmin, not from the checks. The label should name that without
reading as advanced, and without reading as more endorsed than Tools, which
would invert the claim the checks line exists to make. **Whatever the label,
I'd land the tab on My Stack**, "What I'm actually using and why", which gives
the person the positioning statement presses its own front door.

1. **"How I work"** (my pick). It's first person, like the rulings on My Stack
   and On My Radar. It describes the pages rather than recommending them:
   My Stack is what I use, Design Workflow is literally the design kit page's
   H1, Learning is "how I'm staying sharp", and Workshop and Field Notes both
   fit. A beginner reads it as a person's practice, not as a next level.
   **Risk:** it sits beside "Work with me" on the bar and nearly echoes it,
   and a reader may expect the consultancy's process. The positioning
   statement says the directory never pitches.
2. **"My picks."** It names the common factor directly and warmly, and a
   beginner reads it as recommendations. **Risk:** "picks" reads as *more*
   endorsed than "Tools", so a nervous reader may trust the unchecked pages
   over the checked ones, the exact inversion the checks line exists to
   prevent. And AI News isn't a pick; it's an automated feed.
3. **"Resources."** It's the most legible to a beginner and the least
   loaded. **Risk:** it says nothing about checked against not checked. And
   the template is the site's resource in every other sense, so "Template"
   beside "Resources" blurs.
4. **"Learn."** It names what a beginner does, and the tab would land on
   Learning. **Risk:** it promises a beginner something the landing page
   mostly doesn't give (fact 1), and My Stack and the design kit aren't
   lessons.
5. **Structural: take `/learning` out as its own tab, and name what's left
   "My Stack".** The bar would read Home, Tools, Template, Learning, My Stack.
   That reuses a ruled label in its ruled last position, and the consequences
   list's item 4 already says "stack" is right where the reader arrives
   confident. **Risk:** it only works once Learning's content is split, or the
   bar sends the officer to Tailwind docs under a beginner's tab. AI News and
   the design kit also sit awkwardly under "My Stack".

None of these is placed in code.
