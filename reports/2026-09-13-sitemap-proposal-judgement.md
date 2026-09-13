# The site map proposal, judged against the reader profile

**13 September 2026.** The four preview boards from the code session, read
against the reader profile ruled the same day in
`reports/2026-08-28-positioning-statement.md` and the consequences list in
`reports/2026-09-13-audience-profile-consequences.md`.

Boards judged: `out-sitemap.png`, `board-home.png`, `board-phone.png`,
`board-nav.png`, in the code session's scratch folder, which is not in this
repo. Claims were checked against `src/` rather than read off the render.

**Verdict: build it. Seven things to settle first, and one of them is the tab
name.** The proposal is the profile made navigable, and it arrived the same
day the profile did without either being written from the other. That is
worth noting rather than glossing: two independent passes reached the same
three-layer structure.

---

## What it gets right

**1. It moves the line between checked and not checked, and that is a claim
fix rather than an IA tidy-up.** The site's whole promise is *been through
the checks*. Today six tabs sit on one flat bar, four of them carrying
content that has been through no checks at all, with nothing on the bar
saying which. A visitor cannot tell `/tools` from `/my-stack` by the
navigation. The proposal draws that line once, at the hub, and says so in a
line of copy.

**The code session files this under grouping. It is bigger than that.** Rank
it first when the work is scheduled: everything else on these boards is
improvement, and this one is the site's own standard applied to its own
navigation. It is purpose three of the positioning statement, the governance
practice shown rather than asserted, reaching the one surface that had
escaped it.

**2. The first screen finally belongs to the profile's primary reader.**
Today the sector and the checks first appear below the fold, and the first
screen is a wordmark plus a field of product names. The proposal puts the
proposition and two routes above the fold at both 1280 and 390. That answers
item 7 of the consequences list, which asked this exact question and could
not answer it from source.

**3. Template promoted from a link to a tab.** The profile says the
forwardables join the officer to the buyer and get the investment. A tab is
that investment. It also takes the identical "Get the template →" links from
five to three, which retires a consistency rule CLAUDE.md has been
maintaining by hand.

**4. A published failure on the homepage.** DeepSeek, judged and not
recommended, on the first screen. The positioning statement calls the
failures the scarcest content the site owns and says they render as a feature
rather than a concession. No failed tool appears anywhere on the homepage
today. The statement said it; this is the first surface that does it.

**5. The grouping reads as the profile's three reader layers**, without
having been written from them. Find a tool is the officer. Take it to your
board is the head of comms and whoever the template is forwarded to. Go
further is the same reader once she is confident. That is the profile's
structure exactly.

---

## Settle these before it is built

### 1. The hub name is wrong, and it is wrong in the beginner's direction

**This is the most important item on the list.**

"Go further" describes the site's ambition for the reader rather than what
she will find. Every other tab is a noun she can act on: Tools, Template. Go
further is an instruction to do more, aimed at a reader the profile
describes as short of time and frightened of using a tool wrong.

The contradiction is sharper than register. **`/learning` is inside the
hub, and the board's own sitemap tile calls it "the beginner's on-ramp?".**
So the most beginner-facing route on the site now sits behind a label that
says advanced. A nervous reader reads "Go further" as *not yet, not me*, and
the on-ramp is what she skips.

Two ways out, and they are genuinely different rather than a preference:
rename the tab so it names its contents, or move `/learning` out of the hub
and leave the hub to the practitioner material. The honest common factor
across Learning, AI News, Design kit and My Stack is not advancement. It is
that they come from Jasmin rather than from the checks, which is exactly what
the hub's own disclaimer line says.

**Jasmin's call, and the label is hers to write.** No string is proposed
here. The board already marks the label a placeholder; this says which
problem the replacement has to solve.

### 2. The proposition is said twice on the homepage again

The hero ink block and the About panel now carry the same first sentence.
The board catches this itself and says one of the two has to change.

**The precedent decides which.** The 29 August review ruled the About panel
canonical because copy pack four keys the JSON-LD to it, and the copywriter's
standing instruction is to vary the intro and never the About panel. So the
hero block is the one that changes. Applying that here rather than
re-arguing it is the point of having ruled it in August.

### 3. The checks strip heading is approved copy, approved for a different page

"Pick the tool for the job. The checks give you a head start; the final call
is yours." is `Tools.tsx:439`, verbatim. Reusing it on the homepage puts the
same sentence on two routes, which is the self-reciting problem the 29 August
review raised about this page.

CLAUDE.md's rule is that copy arrives as exact approved strings. **A new
placement is a new decision, not an inherited approval.** Either it gets
approved for the homepage or the homepage gets its own line.

### 4. The job chips promise a filter that does not exist

The sitemap says "Tools · entry by job, `/tools?job=`". Verified in
`src/pages/Tools.tsx`: `useSearchParams` is there and reads `?tool=`. **There
is no `?job=` handling.**

This matters more than a missing feature, because entry by job is the single
most profile-aligned element on the board. The officer arrives with a job to
do, and the chips are the site meeting her at it. If they ship inert, or as
decoration above cards they do not filter, the checks strip has not earned
the height it takes.

**Treat `?job=` as the dependency that gates the strip**, not as a follow-up.

### 5. The phone shows one failure in two cards

Desktop shows three cards with the failure last, which is the right
proportion and the right order. The phone board pulls one card to control
length, and the two that remain are ChatGPT and DeepSeek.

**So the reader most likely to be the nervous beginner meets a fifty per cent
failure rate**, with "JUDGED, NOT RECOMMENDED" and "Assume a DPIA before
adopting" in red, in her first screenful of cards. The live grid is 19 Amber
and 3 Red of 23. That is not the site.

This is the failure mode `positioning-balance` names, arriving by a route
nobody planned: not a governance verdict this time, but a length lever that
happens to double the visible failure rate. Keep the failure on the phone,
and either keep two recommended cards with it or move it below them.

### 6. The person ends up unreachable on a phone

The page grows from 2,139px to 3,805px on a phone, which the board states
honestly. What it does not state is what lands at the bottom. **The About
panel is the block carrying "I'm Jasmin. I work with exactly these teams",
and at roughly 3,500px it is effectively unread.**

The positioning statement presses the person as one of four advantages: the
failures show the standard works, My Stack shows who holds it, and a site
with the failures but not the person is a standards body. On the proposed
phone page the failure is at the top and the person is off the end.

**Decision needed:** the person moves up, or something above her comes out.
Not a copy question.

### 7. Template on the bar and above every footer

Template becomes a tab and the template block stays above the footer on every
route. The leader's artefact then has permanent priority on the officer's
surfaces.

**Flagged, not a finding.** It is the right promotion and the profile
supports it. It is also the direction `positioning-balance` warns about, so
it is worth a look once built rather than an argument now.

---

## What it does not fix, from the consequences list

- **Item 3, "whether there's a charity price"** at `AboutPanel.tsx:119`.
  Untouched, and now further down a longer page. Still a live copy question.
- **Item 2, no audience naming on the hub's four routes.** The hub gives them
  a shared frame and a disclaimer, which is real progress, but none of those
  pages says who it is for. Partly addressed, not closed.
- **Item 8, "trustees, funders and supporters"**, and **item 6, the `/tools`
  DPIA disclosure.** Both untouched, both correct.

## What it correctly leaves alone

The sector phrase and its two grammatical forms. The 45-row ceiling. Been
through the checks, never passed. Board rather than trustee. The verdict
voice and the three-slots rule. Every existing URL: the hub lands on its
first page, so nothing redirects and no link breaks. `/radar` stays off the
bar. Measured contrast on both new surfaces, 5.03:1 and 5.15:1, which clears
AA for normal text.
