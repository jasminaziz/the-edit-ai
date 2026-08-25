# Dependency register: the AI use policy template

**Created 25 August 2026.** The map from clause to source. Its job is that an
alert can say "section 11, second paragraph, CDPA s9(3)" and the blast radius is
obvious in five seconds, instead of every alert costing a full re-read of a
fifteen-section document.

Built against `reports/2026-08-25-ai-use-policy-template-v3.md`. Rebuild the row
references whenever the template renumbers.

**The template names tiers, not tools.** That is what makes this list short
enough to watch. Provider terms move monthly and belong to The Edit, which is
built to absorb them. This document only tracks law, regulator guidance and
regulator process. The one place it names tools, section 2's "Claude, ChatGPT,
Gemini and Copilot are the common ones", is illustrative and carries no claim
about any provider's terms, so it is not a dependency.

## Failure mode is the column that matters

**Dated** means the clause becomes stale, and a reader who acts on it is
inconvenienced rather than exposed.

**Wrong** means the clause becomes false, and a reader who acts on it can be
led into a breach or a bad legal assumption. Only two clauses are in this
class. Neither is ever amended without Jasmin reading the source herself.

---

## The register

| # | Clause | The claim it rests on | Source | Type | Watchable | Failure |
|---|---|---|---|---|---|---|
| 1 | §5 rule two | Special category data is a higher bar than ordinary personal data | UK GDPR Art 9; ICO special category guidance | Statute + guidance | ICO only | Dated |
| 2 | §6 tier ladder, positions 1 and 2 | A written contract is required before a processor handles personal data, and consumer and paid-individual plans rarely provide one | UK GDPR Art 28; ICO contracts guidance | Statute + guidance | ICO only | Dated |
| 3 | §6 retention block | A chat history containing personal data is in scope for a subject access request | UK GDPR Art 15; ICO right of access | Statute + guidance | ICO only | Dated |
| 4 | §6 register, ROPA line | The tool register is most of a record-of-processing entry | UK GDPR Art 30 | Statute | No | Dated |
| 5 | §8 q3 | Personal data held outside the UK needs a transfer mechanism | UK GDPR Ch V; ICO international transfers | Statute + guidance | ICO only | Dated |
| 6 | §8 q5 | Art 28 requires a written data processing agreement | UK GDPR Art 28(3) | Statute | No | Dated |
| 7 | §8 q9 | A SAR requires search and export | UK GDPR Art 15 | Statute | No | Dated |
| 8 | §10 accountability clause | Training is part of the accountability obligation | UK GDPR Arts 5(2), 24, 32; ICO accountability framework | Statute + guidance | ICO only | Dated |
| 9 | **§11 para 2, ownership** | s9(3) makes the author the person making the arrangements; whether that is the prompter is untested; the Government proposed removing it | CDPA 1988 s9(3) and s178; Copyright and AI report, 18 Mar 2026 | Statute + policy report | **No** | **WRONG** |
| 10 | §11, commercial rights by tier | Some tools grant commercial rights on paid plans only | Provider terms | Provider | Out of scope, belongs to The Edit | Dated |
| 11 | **§12 para 1, DPIA trigger** | Art 35 requirement; AI often meets the bar because innovative technology plus a second risk factor | UK GDPR Art 35; ICO "when do we need a DPIA"; ICO high-risk examples; forthcoming ICO statutory AI code | Statute + guidance | ICO only | **WRONG** |
| 12 | §12 para 2 | A processor must assist with the controller's DPIA | UK GDPR Art 28(3)(f) | Statute | No | Dated |
| 13 | §12 last line | The ICO runs a not-for-profit fee exemption, so registration is not universal | ICO data protection fee exemptions | Regulator process | Yes | Dated |
| 14 | §14 step 2, clock | 72 hours runs from awareness, and only where a risk arises | UK GDPR Art 33(1); ICO breach guide | Statute + guidance | ICO only | Dated |
| 15 | §14 step 2, individuals | Art 34 requires telling affected people at a higher bar | UK GDPR Art 34; ICO breach guide | Statute + guidance | ICO only | Dated |
| 16 | §14 step 3, E&W | Serious incident reporting | Charity Commission serious incident guidance | Regulator process | Yes | Dated |
| 17 | §14 step 3, Scotland | Notifiable events | OSCR notifiable events guidance | Regulator process | Yes | Dated |
| 18 | §14 step 3, NI | Serious incident reporting | CCNI serious incident guidance | Regulator process | Yes | Dated |

Eighteen clauses, not the nine or ten a first pass suggests. The three charity
regulators and the ICO's separate guidance pages are what expand it.

§13, disclosure to supporters and funders, rests on nothing statutory. It is a
voluntary position and needs no watching.

---

## The finding that changes the design

**legislation.gov.uk cannot be fetched automatically from this environment.**
Tested 25 August 2026: the section HTML, the `/enacted` variant, the crossheading
page and the `/data.xml` endpoint all return a robots block. One section, s178,
came through once, which suggests flakiness rather than a firm policy, and
flakiness is not something to build a control on.

That is not a minor operational note. **Both clauses in the WRONG class rest
partly on primary statute**, and statute is the one source class that cannot be
watched here. So for rows 9 and 11 the quarterly human pass is not a backstop
behind an agent. It is the only control there is, and the agent covers the ICO
half of row 11 and nothing of row 9.

ICO pages fetch cleanly. Verified 25 August 2026 against the DPIA trigger page,
which also independently confirmed the mechanism now written into §12.

## Detected, diarised, or neither

A hash-and-diff watcher only catches changes that surface on a page already
being watched. Three categories, and only the first suits a detector.

**Detected.** ICO guidance pages and the three charity regulators' reporting
pages. Rows 1, 2, 3, 5, 8, 11 (ICO half), 13, 14, 15, 16, 17, 18. Monthly is
ample; anything faster is theatre.

**Diarised.** Known future events that will not appear as a diff on any current
page. The forthcoming ICO statutory AI code is the live example: it is coming,
its arrival date is roughly knowable, and it lands as a new document rather than
an edit to an old one. These go in a calendar, not a watchlist.

**Neither.** A court ruling on s9(3), a regulator's position shifting in a
speech, a consultation outcome. Nothing catches these but reading. Row 9 lives
here almost entirely.

## Two rules, which are not new

The agent never edits a published document, only proposes. The agent never
touches rows 9 or 11 without Jasmin reading the source herself.

These are the project's existing rule, machines maintain facts and Jasmin owns
judgement, applied to a new surface. They do not need separate debate.

## First job on the first run

**Resolve and verify every source URL.** This register deliberately names
sources rather than pasting URLs, because a register full of dead links is worse
than no register: it reads as maintained. Only the ICO DPIA trigger page has
been verified live so far. Verifying the rest is step one, not an afterthought.
