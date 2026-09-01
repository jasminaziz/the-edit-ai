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

## First job on the first run — DONE 28 August 2026

**Resolve and verify every source URL.** This register deliberately names
sources rather than pasting URLs in the table above, because a register full
of dead links is worse than no register: it reads as maintained. All eighteen
rows now have a live, verified URL below, dated to when it was checked.

**The find that justified doing this properly.** Row 17, OSCR, was live-checked
against `oscr.org.uk` rather than assumed from training knowledge. OSCR retired
its "notifiable events" process on **1 April 2024** — over two years before this
template was drafted — and replaced it with a "raise a concern" report, used
once trustees cannot resolve the issue themselves. §14 step 3 named "notifiable
event" by that exact word. **It was wrong the day it was written, not a future
drift risk**, which the "Dated" severity tag on this row did not anticipate.
Fixed in the template 28 Aug: the sentence no longer names OSCR's process by a
retired term, and states the 2024 replacement plainly. Nothing else in the
eighteen turned up wrong on live-checking: row 9 (CDPA s9(3), the Copyright and
AI report) held exactly as drafted, and row 1 (trade union membership as an
Article 9 category) checked out on the ICO's own page and was added to §5,
which had omitted it.

## Source URLs, verified 28 August 2026

| Row | Live source | Note |
|---|---|---|
| 1 | [ICO, What is special category data?](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/special-category-data/what-is-special-category-data/) | Confirms all nine categories including trade union membership, added to §5 today |
| 2 | [ICO, When is a contract needed and why is it important?](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/contracts-and-liabilities-between-controllers-and-processors-multi/when-is-a-contract-needed-and-why-is-it-important/) | Also covers row 6 and row 12 |
| 3 | [ICO, What is the right of access?](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/right-of-access/what-is-the-right-of-access/) | Also covers row 7 |
| 4 | UK GDPR Art 30 (statute, no ICO guidance page cited — not watchable, per the table) | |
| 5 | [ICO, A brief guide to international transfers](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/international-transfers/a-brief-guide-to-international-transfers/) | |
| 6 | UK GDPR Art 28(3) (statute) — see row 2's guidance page for the practical explanation | |
| 7 | See row 3 | |
| 8 | [ICO, Guide to accountability and governance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/guide-to-accountability-and-governance/) | |
| 9 | [CDPA 1988 s9 (legislation.gov.uk)](https://www.legislation.gov.uk/ukpga/1988/48/section/9); [HSF Kramer on the March 2026 Copyright and AI report](https://www.hsfkramer.com/notes/ip/2026-03/uk-government-report-on-copyright-and-ai-concludes-more-evidence-is-needed-although-s9-3-cdpa-could-go) | Re-verified today, holds exactly as drafted. The report proposes removing s9(3) for works with no human author, while stating AI-assisted work with genuine human involvement keeps copyright — a nuance the template doesn't need since it doesn't overclaim either way |
| 10 | Provider terms — out of scope, belongs to The Edit | |
| 11 | [ICO, When do we need to do a DPIA?](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/data-protection-impact-assessments-dpias/when-do-we-need-to-do-a-dpia/) | The false "this is the law, not regulator guidance" sentence flagged in the 26 Aug review was found still in the template and deleted 28 Aug |
| 12 | See row 2 (Art 28(3)(f) is the same contract relationship) | |
| 13 | [ICO, Guide to the data protection fee](https://ico.org.uk/for-organisations/data-protection-fee/data-protection-fee/) | Nuance for later: the page describes two different things — a genuine not-for-profit purpose exemption (narrow, self-assessed, pays nothing) and a flat £52 charity-capped tier (most charities, not a full exemption). §12's bracketed choice reads as binary; worth tightening to three states if this gets revisited, not urgent now |
| 14 | [ICO, Personal data breaches: a guide](https://ico.org.uk/for-organisations/report-a-breach/personal-data-breach/personal-data-breaches-a-guide/) | Also covers row 15 |
| 15 | See row 14 | |
| 16 | [GOV.UK, How to report a serious incident in your charity](https://www.gov.uk/guidance/how-to-report-a-serious-incident-in-your-charity) | Charity Commission for England and Wales, current |
| 17 | [OSCR, The Notifiable Events process has been replaced](https://www.oscr.org.uk/news/the-notifiable-events-process-has-been-replaced-changes-in-the-way-charities-report-important-issues-to-oscr/); [OSCR, Raise a concern](https://www.oscr.org.uk/raise-a-concern/concern-form/) | See the finding above — this is the one that turned up wrong |
| 18 | [CCNI, Serious incident reporting](https://www.charitycommissionni.org.uk/concerns-about-a-charity/serious-incident-reporting/) | Current |

