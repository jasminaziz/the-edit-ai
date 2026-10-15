# Copy proposals: the close of the homepage About section

12 October 2026. Surface: homepage `AboutPanel`, right column, from "I'm Jasmin." to the byline. Nothing here is placed. Jasmin chooses.

Governing voice: this project's `.claude/CLAUDE.md` ("Voice rules", "Project identity", "Audience phrasing") and `reports/2026-08-28-positioning-statement.md` (the six-question test, the reader profile). The Edit is not the consultancy, so the consultancy voice spec does not govern. Its anti-slop rules (25 September 2026) are applied as hard flags, because they bind every pass.

Read: the live component (`AboutPanel.live.tsx`, lines 109 to 222), the desktop (1280) and mobile (390) screenshots, `src/lib/links.ts`, the 4 September candidates report (where the current consultancy line came from), and the consultancy's `services.html`, `about.html` and `index.html` for service names and the claims about who she works with.

---

## 1. Critique of the current close

**Verdict: the close does three jobs in three voices and names her three times in about sixty words. The switch Jasmin felt is real, and it is the main fault. Cut and convert; do not redraft from scratch.**

1. **The voice switch.** "I'm Jasmin. I work with exactly these teams..." is first person. "Jasmin also runs a consultancy" is third person, with "also" pointing back at a person the reader has just heard speak. The byline then names her a third time, in the third person again. Test 3 of the positioning statement ("Can you hear Jasmin?") passes on the first line and fails on the second, where the voice steps out of the room to describe her. The fix is mechanical: the consultancy line goes into first person.

2. **"I'm Jasmin" is an introduction the page has already made.** The h2 and the two approved paragraphs say "my directory" and "So I check", and the byline, one block below, says who "I" is. The line announces a name the panel then prints again. Cut it. Nothing is lost: "I work with these teams" carries the claim. The 30 August audit cut "I built it because" as motivation stated before value; "the resource I wanted to hand them, so I made it" is the same move at the close. It is approved and short, so I keep it, but it is the weakest sentence in the run.

3. **"exactly these teams" over-claims.** "Exactly" is an intensifier. The consultancy site says "My experience is in charity, heritage and the third sector" (`services.html:408`) and sells to "values-led organisations" (`index.html:10`). "Work with these teams" is supportable. "Exactly" is not. Verified: `index.html:223` says "the teams I work with needed it", `index.html:157` names "charity, heritage, cultural and community organisations".

4. **The service list is stale and ambiguous.** It lists five services; the consultancy now lists six, in this order: Communications audit, AI, trust and communications, GEO audit, Brand and positioning, Campaign strategy and plan, Content and editorial system (`services.html:552-672`, anchor bar order Audit, AI, GEO, Brand, Campaign, Content). GEO is missing and the order differs. Separately, "content systems, and AI, trust and communications" reads as six items, not five, because the last service name carries its own commas. Any list that ends or sits among commas with that name has the problem.

5. **GEO is an unexplained acronym on a first-moment surface.** Test 5 and the Vocabulary section: "no acronym unexplained" for the primary reader, who "has heard DPIA in a meeting and did not ask." If GEO goes in by name, it needs a gloss or it breaks the profile. The consultancy's own gloss is "how visible, and how accurately, your organisation appears in AI search and answer engines" (`services.html:602`).

6. **Two links, one destination, 35px apart (rendered, desktop).** "Get in touch" and the byline both go to `WORK_WITH_ME_HREF`, which is `https://jasminaziz.co.uk/` (no `www`; your brief said `https://www.jasminaziz.co.uk/`, so check which you mean). Both carry a lime underline. A reader who has decided to follow one has been offered it twice. Also: the label says "Get in touch" and the destination is a homepage, not a contact page. That is a link change, not copy, and it is yours to rule on. A `/contact` target would match the label; a `/services` target would match a service list. Neither is proposed here.

7. **Rendered hierarchy is inverted.** Desktop: the consultancy line, which holds the only call to action, is the lightest text in the section (15px, `#6B625A`), and the byline below it is the darkest (14px, `#1A1510`, underlined). The body paragraphs above are 17px. Size and colour step down at exactly the point the voice switches, so the third person also looks like small print. All three closing blocks sit on the same 16px gap, so nothing groups them.

8. **Mobile (390).** The byline wraps with "Consultant →" alone on the last line, the arrow orphaned from the title. The consultancy line runs four lines before "Get in touch." The CTA arrives last in the longest block.

9. **Anti-slop pass on the current close.** No questions, reframes, em dashes or triads. The service list is a literal list of real things, which passes. Nothing to flag beyond the above.

**Already right, keep:** "Get in touch" as a lighter label than "Work with me" (Jasmin's call, 4 September). "Curated by Jasmin Aziz" as the attribution. The dry register of the 4 September candidate C: no benefit language, no price, no turnaround. Every candidate below keeps that.

---

## 2. Candidates

Each is given as it would render. Text in `[square brackets]` is link text. All links point to `WORK_WITH_ME_HREF` (`https://jasminaziz.co.uk/`) unless stated. I have not changed the destination in any of them.

The title "strategic communications consultant" stays on the panel in every candidate. Where it moves, I say so.

### Candidate 1: convert and keep the shape (smallest change)

> I work with these teams. This is the resource I wanted to hand them, so I made it.
>
> I also run a consultancy: communications audit; AI, trust and communications; GEO audit; brand and positioning; campaign strategy; and content systems. [Get in touch].
>
> [Curated by Jasmin Aziz | Strategic Communications Consultant →]

Links: "Get in touch" and the whole byline, both to `https://jasminaziz.co.uk/`.
Title: stays in the byline, unmoved.

Reasoning: "I'm Jasmin" and "exactly" go, the consultancy line becomes first person, and the six services match the consultancy's order and names. Semicolons stop "AI, trust and communications" reading as three items. Nothing else in the panel changes.

Trade-offs, unverified, opinion:
- Still two links to one place. My view is that is one too many, but it is the cheapest edit.
- "GEO audit" is an unexplained acronym (finding 5). Fix by dropping it or glossing it, which makes the line longer.
- Six names with semicolons is the heaviest line of the three candidates. It will run about three lines on desktop and five on a phone.
- The visual hierarchy problem (finding 7) is untouched.

### Candidate 2: one link, the byline carries it

> This is the resource I wanted to hand the teams I work with, so I made it. I also run a consultancy: audits, brand and positioning, campaigns, content systems, and AI work.
>
> [Curated by Jasmin Aziz | Strategic Communications Consultant →]

Links: the byline only, to `https://jasminaziz.co.uk/`. "Get in touch" is cut.
Title: stays in the byline, unmoved. The locked positioning ruling is untouched.
Name: once, in the byline.

Reasoning: the personal line and the consultancy line become one paragraph in one voice, at body size, so the section ends on a single signature and a single way out. "AI work" compresses two consultancy services (AI, trust and communications; GEO audit) into words a first-moment reader does not need glossed. The arrow does the inviting.

Trade-offs, unverified, opinion:
- It cuts "Get in touch", which was a deliberate call. The byline arrow is a weaker invitation than a labelled link, and nothing says what the link is for. If the 4 September choice of a labelled, lighter link still stands, this candidate breaks it.
- "AI work" is a summary, not a service name. It does not rename anything, but the consultancy's two AI services are not distinguishable from it. Your call whether that is acceptable.
- Five items in a list, all real services.

### Candidate 3: the title moves into the body, the byline shrinks to a name

> I work with these teams as a strategic communications consultant. This is the resource I wanted to hand them, so I made it.
>
> My consultancy covers communications audits, brand and positioning, campaign strategy, content systems and AI work. [Get in touch].
>
> Curated by Jasmin Aziz

Links: "Get in touch" only, to `https://jasminaziz.co.uk/`. The byline is plain text, no link, no arrow.
**Title: moves from the byline into the first sentence.** This is the move the component's own comment anticipates ("If that byline ever moves or goes, the title has to come back into this paragraph"). It reverses the 28 August positioning ruling that the byline stays "strategic communications consultant", which Jasmin has reopened. It stays on the panel, once.
Name: once. Title: once. Link: once.

Reasoning: the credential arrives in the sentence that introduces her role, in the first person at 17px, so the third-person switch disappears and no sentence announces a name. "My consultancy" keeps the voice first person and the register dry. The one link keeps the 4 September "Get in touch" call, and the byline becomes a plain attribution with no weight to compete with it.

Trade-offs, unverified, opinion:
- "as a strategic communications consultant" in the body reads closer to a CV line than the rest of the paragraph. The 30 August audit cut the title from the body for that reason. This candidate undoes that.
- The consultancy itself says "Strategic marketing and communications consultant" (`about.html:7`) and "Strategic Marketing & Communications" (`index.html:6`). The Edit's title is shorter. That predates this pass and is not a new inconsistency, but it is visible when the title sits in the body.
- The byline loses its link and arrow. That is a component change (an `<a>` becomes plain text), not a string edit.
- "AI work" has the same summary-not-name caveat as Candidate 2.

---

## 3. Recommendation

**Candidate 3**, with Candidate 2 as the fallback if the byline ruling should not move.

It removes all three faults at once: no "I'm Jasmin", no third-person line, one link. It keeps "Get in touch", which Candidate 2 cuts. It keeps the dry register of the line Jasmin approved on 4 September. And it needs the title to move, which the component comment already provides for. Candidate 1 is the cheapest, but it leaves two links and the long semicolon list. If she does not want the credential in the body paragraph, Candidate 2 is the right choice.

---

## 4. Flagged, not decided

- **Link target.** `WORK_WITH_ME_HREF` is `https://jasminaziz.co.uk/` (no `www`), a homepage. "Get in touch" promises a contact page. Whether to add a second constant pointing at `/contact` (or at `/services`, if a service list stays) is Jasmin's call and a code change.
- **GEO.** Candidates 2 and 3 leave it out by name, inside "AI work". Candidate 1 includes it unglossed. If Jasmin wants GEO named, the consultancy's own gloss ("how visible, and how accurately, your organisation appears in AI search and answer engines") is the source for it.
- **Layout.** The inverted hierarchy and the mobile orphan (findings 7, 8) are layout, for site-design-check. Candidate 3 changes what the byline carries, which removes the orphan by shortening the byline to one line. That is a side effect, not a layout fix.
- **Evidence.** Nothing here asserts a client, number, count or result. "I work with these teams" is sourced to `services.html:408` and `index.html:157` and `:223`.

No learning proposed. Nothing here revealed a rule the project's own voice rules lack.
