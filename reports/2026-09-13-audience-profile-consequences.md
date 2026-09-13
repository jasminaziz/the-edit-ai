# Audience profile: what it puts in question

**13 September 2026. Companion to the rewritten "Who it's for" section of
`reports/2026-08-28-positioning-statement.md`, which is canonical.**

**No string is proposed here and no copy was authored.** This is the list of
surfaces the profile calls into question, for the code session and for
Jasmin's ruling. Every item is either a gap to fill, a question to answer or
a settled decision that now has a different reason attached to it. Nothing on
this list is a defect until Jasmin says it is.

Branch `overhaul/sector-axis`. Line numbers checked against the working tree
on 13 September 2026.

---

## 1. The practitioner surfaces now have a job

`/my-stack`, `/design-kit` and `/learning` are where the primary reader goes
once she is confident. The profile puts them on the map as the same reader
later, not as a second identity.

The positioning statement's "Surfaces earn their keep" section says
`/learning` and `/design-kit` are "retained rather than chosen" and leaves
`/my-stack`'s framing open. That disposition was written before the profile
existed. **On audience grounds they are now chosen.** Whether they earn their
keep on effort, maintenance or quality is a separate question and this does
not answer it.

**For Jasmin:** confirm, and the surface audit's verdicts on those three get
revisited against the profile rather than against the old open question.

## 2. Those same surfaces name no audience at all

`FooterEmailCapture.tsx:35` now reads "Free. The document that answers the
questions your board will ask." The 29 August review recorded that string as
the only audience naming on `/ai-news`, `/my-stack`, `/learning`,
`/design-kit` and the legal pages. The audience phrase left it in the 31
August board swap, correctly, and nothing replaced it.

So a visitor who lands on `/my-stack` from a search or a forwarded link meets
no statement of who the site is for anywhere on the page. That gap mattered
less when those routes were undecided. It matters more now that item 1 makes
`/my-stack` proof-of-practice content a sector buyer might land on directly,
which is exactly what finding 6 of the 29 August review flagged and nobody
has acted on.

**For Jasmin:** a decision on whether those surfaces need an audience line,
and if so, on which of them. Copy would follow separately.

## 3. "Whether there's a charity price"

`AboutPanel.tsx:119`, in the homepage proposition.

This is the last live instance of finding 5 of the 29 August review, the one
that review called its deepest. The audience phrase invites in the local
authority museum service and the university gallery, and the sentence
immediately after it describes something neither of them has. Two of the
three instances were fixed by the 31 August board swap. This one was not, and
it sits in the canonical premise paragraph.

The profile keeps both of those readers explicitly inside the audience and
names corporates outside it, so the tension is now written down in two places
rather than one.

**For Jasmin:** this is a live copy question on approved pack copy in the
canonical block. Worth a ruling before relaunch rather than after.

## 4. The word "stack" on low-context surfaces

Flagged open in the positioning statement. The profile gives it a reason to
settle: "stack" is a practitioner's word and the first screen belongs to the
least confident reader. It follows that "My Stack" is right where the reader
arrives already confident, and a question where she does not.

Note the boundary. The 1 September ruling settled the **possessive**, first
person throughout, and that is not reopened by anything here. What is open is
whether the word "stack" identifies the page to a beginner meeting it cold in
a nav or a search result.

**For Jasmin:** yours, and not urgent.

## 5. The policy template title tripwire now has a date

`PolicyTemplate.tsx:8` keeps "for Charities" as a named search-intent trade,
with a tripwire from the 29 August review: change it if Search Console shows
heritage or museum-flavoured queries reaching the page with impressions and
no clicks. The held-ready alternative is in that report.

The profile sets an end-of-October 2026 read of Search Console, LinkedIn and
enquiries. **That is the same read.** Do them in one sitting, and check
`PolicyTemplate.tsx:17`'s H1 in the same pass, since the 29 August review
tied the two together.

## 6. The DPIA disclosure against the vocabulary rule

The profile's vocabulary rule: a board word arriving untranslated in the
officer's layer is a defect. The DPIA chip renders on every card on `/tools`,
which is her layer, and the explanation sits behind a disclosure that a
reader has to open.

**This is a question, not a finding, and it must not be used to reopen a
settled decision by the back door.** The disclosure was ruled on 1 September
for a different and good reason: the explanation had been a paragraph above
the grid and Jasmin reported nobody was reading it. A collapsed answer people
open beats a paragraph people skip. The only question the profile adds is
whether a click counts as "translated where first met" or whether the chip
labels carry enough on their own, which two of the three arguably do.

**For Jasmin:** a yes or no. If yes, nothing changes.

## 7. The homepage first screen

The profile rules the first screen belongs to the least confident reader in
the sector. Nobody has assessed the current first screen against that rule,
because the rule did not exist until today.

The specific thing to assess is the hero: display wordmark, then
`HomeGravity` rendering the `my_stack` tool names as draggable pills. A
nervous beginner meets a field of product names before she meets a sentence
telling her what the site is or that it is for her. That may read as
inviting, or it may read as a room where everyone already knows the
vocabulary. **It needs eyes on the render, not a judgement from source.**

**For the code session:** a stranger pass on the first viewport at 390px and
at desktop, framed by this rule rather than by design quality. Report what a
beginner meets before scrolling. Propose nothing.

## 8. "Trustees, funders and supporters"

`PolicyTemplate.tsx:46`. CLAUDE.md marks this **deliberately left** in the 31
August board ruling, as a list of stakeholder groups you report to rather
than the governing body, and says not to finish the job.

The profile names the data protection officer as a reader in her own right,
arriving cold with the forwarded template. She is not in that list.

**Flagged only.** Adding her may be right or may clutter a sentence that is
doing a different job. Raising it is not a recommendation to change it.

---

## What the profile does not touch

- **The sector definition.** Locked 29 August, unchanged, and the profile
  narrows on it rather than widening it.
- **The three-part audience phrase and its two grammatical forms.** Unchanged.
- **The 45-row ceiling.** The profile gives it a second justification and
  moves it not at all.
- **"Been through the checks", never "passed".** Unchanged.
- **The board-not-trustee ruling and the `trustee_note` field name.**
  Unchanged.
- **Verdict voice and the three-slots rule.** Unchanged. The profile says who
  reads a verdict; it does not touch how one is written.
