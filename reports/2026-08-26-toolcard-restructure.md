# ToolCard restructure, and the verdict sector rule

**26 August 2026. PROPOSAL, not approved.** Worked out with Jasmin in
conversation after she stopped the first A5 verdict pass. Recorded here because
none of it exists anywhere else.

---

## 1. The user journey, Jasmin's framing

A visitor to `/tools` wants to:

1. **Explore the tool.** What is it, what could we adopt it for.
2. **Understand the governance risk.**
3. **Take action.**

**The card has no step one.** The only element that says what a tool is for is
the verdict, and it sits at the bottom behind a toggle. Everything visible above
it is governance and price, so a visitor scanning the grid never learns what any
of these things are.

**And the slot exists but was never filled.** `ToolCard` renders a description
paragraph, but `parseToolRows` in `src/lib/sheets.ts` hardcodes
`what_it_does: ''` because the `tools` tab has no such column. Measured live 26
Aug: fifteen empty paragraphs, height 0, 12px top margin each.

**This is very likely why the A5 first pass drifted into governance.** The card's
entire visible surface is governance, so the verdict had nothing else to be.

## 2. "It is a CRM tool"

Jasmin's second objection, and it is the same hole from another angle. The
`jobs` taxonomy answers **which of my problems does this solve**. It does not
answer **what kind of thing is this**. Retiring tool-type categories was right
for filtering and wrong for comprehension.

**Restoring column B is not the fix.** It is stale and imprecise: the A3 triage
sheet has HubSpot filed as `Automation`. The one-line description is the fix and
it carries CRM naturally.

`my_stack` already has a `what_it_does` column and its lines are the right
register, for example: *Design platform covering social graphics, presentations,
video and print, with Brand Kit for consistent identity across projects.*

## 3. Grouping correction

An earlier version of this proposal put **nonprofit pricing** in one spec block
with **data location** and **trains on input**. That groups by data model.
Nonprofit pricing is a **buying** fact; the other two are **risk** facts. The
journey splits them and so does the card below.

## 4. The proposed card

Everything below renders. Nothing is annotation.

```
┌──────────────────────────────────────────────────┐
│ HubSpot                                          │
│ Sales and marketing CRM with a usable free tier. │
│ ▢APPEALS & FUNDRAISING  ▢INTERNAL COMMS          │
│                                                  │
│ Free CRM / Marketing Starter from £18 a month    │
│ Nonprofit pricing  None                          │
│                                                  │
│ ─ RISK ─────────────────────────────────────     │
│ Where your data sits    EU option                │
│ Trains on your content  Yes unless you opt out   │
│ (Assume a DPIA before adopting)                  │
│ Not sure what your policy should say? Start      │
│ with the template.                               │
│                                                  │
│ Honest verdict ↓            Checked 24 Aug 2026  │
│                              [ Visit tool → ]    │
└──────────────────────────────────────────────────┘
```

**Only one new label renders: `RISK`.** The job chips sit under the description
with no heading, as now. Everything else that reads as a label is already
approved microcopy: `Nonprofit pricing`, `Where your data sits`, `Trains on your
content`, `Checked`, `Honest verdict ↓`, `Visit tool →`.

**Only the risk zone gets a label.** A name, a description, job chips and a
price are self-evident, so a heading over them would state the obvious and cost
a line. The risk zone earns one because it contains an acronym and it is the
part nobody else publishes.

## 5. The change list

| # | Change | Type | Status |
|---|---|---|---|
| 1 | Add `what_it_does` column to the `tools` tab | Sheet | needs the column plus 15 lines |
| 2 | `parseToolRows` reads it. **2 lines**, `fetchMyStack` already does exactly this | code | ready |
| 3 | Card reordered into explore / risk / act | layout | ready |
| 4 | Delete nothing: the empty paragraph becomes the description | layout | ready |
| 5 | Nonprofit pricing loses its `#EEF0FB` tint, value goes bold, moves up to sit with price | layout | ready |
| 6 | Verdict toggle and `Checked` share one row, `Checked` at 11px muted | layout | ready |
| 7 | C4(b) template line restricted to **Red only** | placement | **APPROVED 26 Aug** |
| 8 | `Add to my stack` removed, `Visit tool` becomes the only CTA | layout | **UNBLOCKED. Stack cut, ruled 26 Aug** |
| 9 | The zone label. **APPROVED 26 Aug as `The checks`**, rendered uppercase like the job chips. Banked in `reports/2026-08-26-copy-pack-card-restructure.md` | copy | **APPROVED** |

**Chip labels stay unchanged.** An earlier version proposed rewriting all three.
That was wrong: the three states are genuinely different kinds of statement, a
prediction, a condition and a precondition, so the differing grammar follows the
meaning. In the new layout the card has room for the long Amber label.

**What it buys:** thirteen elements to eight or nine, five separately coloured
regions to two, roughly 190px off a card of about 490px. Figures computed from
the CSS, not measured, because the dev server was down.

## 6. The DPIA literacy gap

**`AboutPanel` is the only thing on the site that explains what a DPIA is, and
it renders on the homepage only.** It is not on `/tools`. So a visitor arriving
at `/tools` from a sector search meets the term eleven-plus times, on fifteen
chips and a filter toggle, with no explanation anywhere on the page.

**Keep the term.** It is the word their board and their DPO use, it is the
search term, and it is the field nobody else publishes. Softening the chips to
plain language makes the differentiator generic, against CLAUDE.md's own rule
that sector precision is credibility.

The `RISK` label does part of this work by signposting before the acronym
arrives. A one-line definition above the grid is still worth having and is
cheaper now. Draft, unapproved:

> A DPIA is the assessment your organisation does before processing personal
> data in a risky way. The flag on each tool says how likely typical comms use
> is to trigger one.

**Separate finding: C4(b) fires on 14 of 15 cards.** It was scoped when Green
was expected to be common, and amendment 4 made Green rare, so a line designed
to appear sometimes now appears nearly always and reads as furniture.
Restricting it to Red puts it on 2 cards. The template already has three other
placements: the in-grid card, the nav and the footer.

---

## 7. The verdict sector rule

Jasmin's objection: the second A5 pass over-references funder reports and
appeals. Counted across the fifteen: **appeal in 5, funder report in 2, and 6 of
15 carry funder, appeal or board pack.**

**Two rules fix it.**

**a) The sector example comes from the row's own `jobs` values.** Two drafts
currently contradict the chips directly above them on the card: Adobe Express is
tagged Social and Case studies but the draft says *going in an appeal or a
funder report*; ChatGPT is tagged Research, Translation and Accessibility but
the draft says *your appeal copy*. Neither row is tagged Appeals & fundraising.

**b) Keep the detail only where the advice would change for a non-charity.**

Earns its place:

- *It thinks in deals rather than donations.* Only true of a fundraising use.
- *Editing someone's testimony by deleting words from a transcript.* Beneficiary
  testimony is a sector-specific ethical problem.
- *Pay a designer once to build reusable branded templates.* Written for a team
  with no designer.

Decorative:

- *The image is going in an appeal or a funder report.* The provenance argument
  is identical for any publisher. The load-bearing half is the next clause, that
  you are publishing to people who will ask where things came from.
- *Your appeal copy* in ChatGPT. Sycophancy is universal.

**On that test, four of the fifteen need editing and eleven do not.**

---

*Recorded 26 August 2026. **Build Your Own Stack was cut on 26 Aug, so the
card's bottom is settled and change 8 is unblocked.** **All three remaining copy calls were approved the
same day** and are banked in `reports/2026-08-26-copy-pack-card-restructure.md`:
the zone label `The checks`, the DPIA definition line, and C4(b) restricted to
Red. **The card work has everything it needs for a code session.**
