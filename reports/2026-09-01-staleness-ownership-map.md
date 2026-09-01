# Who keeps each surface accurate, and what nobody is watching

1 September 2026. Written after `/radar` shipped, because adding a new place
that publishes tool information raised the question of whether every existing
place has something responsible for keeping it true.

Method: the surface list comes from the routes in `App.tsx` and the fetchers in
`src/lib/sheets.ts`. The ownership claims come from reading the passes in
`reports/2026-08-31-axis-audit-claude-code-prompt.md` and the per-tab write
boundary in `scripts/sheet-write.mjs`, not from what any summary says they do.

---

## Headline

**Every surface has a link checker. Only one surface has a fact checker.**

Pass 1a of the audit sweeps every URL in `tools`, `my_stack`, `design_kit` and
`learning`, roughly 159 of them, so link rot is covered almost everywhere.
Pass 1b and Pass 2, the passes that check whether a *claim* is still true, are
both scoped by the word **published**, which the prompt defines by
reimplementing `isComplete()`. That predicate is a `tools` predicate. So the
fact-checking machinery reaches 23 rows on one tab, and nothing else on the
site is ever re-checked for truth by anything.

That was defensible while "not published" meant "not visible". `/radar` ended
that yesterday.

---

## The map

| Surface | Route | Source | What can go stale | Link check | Fact check |
|---|---|---|---|---|---|
| Directory cards | `/tools`, homepage counter and strip | `tools`, 23 published rows | the seven axis fields, cost, verdict, what_it_does | Pass 1a | **Pass 1b + Pass 2** |
| Radar cards | `/radar` | `tools`, 44 unpublished rows | name, category, cost, verdict, url | Pass 1a | **none** |
| My stack | `/my-stack`, homepage strip, hero pills | `my_stack`, 19 rows | what_it_does, pricing, verdict | Pass 1a | **none** |
| Design kit | `/design-kit` | `design_kit`, 44 rows | cost badge, what_it_does, when_to_use, verdict | Pass 1a | **none** |
| Learning | `/learning` | `learning`, 26 rows | provider, what_it_is, time, cost | Pass 1a | **none** |
| AI news | `/ai-news` | `whats_new`, 260+ rows | the external links | **none** | none, correctly |

`whats_new` is excluded from Pass 1a by name, and the prompt says at line 57
"Do not touch the whats_new tab". Not re-checking the *claims* is right: a
dated news item is a record of a moment, not an assertion about the present.
Not checking its 260 outbound **links** is a separate decision that appears to
have been inherited rather than taken.

---

## 1. `/radar` is published information with no fact owner

The sharpest gap, and new as of yesterday.

- Pass 1a **does** fetch radar URLs, so a dead link is reported.
- Pass 1b is "for every **published** tools row" (line 107). Radar rows are by
  definition not published, so no policy-date drift check.
- Pass 2 opens "A **published** row is checked if ANY of" (line 143). Even the
  "Pass 1 flagged it" trigger cannot fire, because the sentence's subject is
  already narrowed to published rows.

So a radar row gets its link watched and nothing else.

What that leaves live: `RadarCard` renders `verdict` as its main text slot on
all 44 rows, because `what_it_does` is empty on every one of them. **Verdict is
a judgement field that no automation may ever write.** The audit's only lever
on a verdict is Pass 3, which quotes a sentence back to you when a fact moves
underneath it, and no facts are being checked on these rows, so that trigger is
structurally unreachable. Forty-four early takes are public with nothing
watching them at all.

`cost` is the same shape: rendered on the card, never checked, and outside the
column D carve-out's reach because that carve-out governs writes, not reads.

**The word "radar" appears zero times** in the audit prompt, in
`reports/2026-09-01-axis-prompt-gap-check.md`, and in
`reports/2026-09-01-unattended-writer.md`. All three were written before the
page existed.

## 2. Three tabs render prices and descriptions that nothing checks

`my_stack`, `design_kit` and `learning` each get Pass 1a and nothing more.
The audit prompt's own summary line says it works "on Tools and My Stack, light
add/retire suggestions for design and learning", but Pass 2 has no trigger that
can select a `my_stack` row: that tab has no `last_checked` column and no
`dpia_flag`, so all three of Pass 2's conditions are inapplicable.

Concretely public and unwatched: 44 design kit cost badges rendering free,
freemium or paid; 26 learning rows with cost and provider; 19 my stack rows
with pricing and a verdict.

The monthly Cowork discovery pass covers `design_kit` and `learning`, but by
its own description it suggests additions and retirements and never writes.
Discovery is not the same job as verification.

## 3. Owners whose picture of the site is out of date

**The published artifact, "The Axis Audit"** (updated 31 August). Its central
claim is a section headed "It is not a scheduled task", asserting there is "no
cron job and no scheduled task for the axis audit, on this machine or anywhere
else", and separately "There is no reminder, no calendar entry and no
notification". A Cowork trigger created 1 September and a calendar reminder
documented at `.claude/CLAUDE.md:134` both postdate it. The artifact is the
most confident document in the set and it is now wrong about the thing it is
most confident about.

**The Cowork trigger itself** is documented nowhere in the repo, and its
schedule and its prompt were built against two different calendars. See the
next section: this is the most actionable defect in the set.

**The audit prompt** carries one unfixed finding from its own gap check.
Commit `8317da6` landed the write boundary and the column D carve-out, but
line 164's legal values for column I still read
`No | No by default | Yes unless you opt out | Yes | Varies by tier`, omitting
`Unclear`, which the axis lock includes. A3 is still open.

**`.claude/schema.md`** says "15 of the 67 rows passed" with 52 on the radar.
It is 23 and 44. The file is honestly dated 2026-08-26, but it is what a new
session reads to learn the shape of the data.

**The whats_new watchdog** has an uncommitted fix sitting in the working tree
narrowing its cron to Tue-Sat, with a good rationale about false alarms landing
on Sundays and Mondays. It is not live. It is not mine to commit.

---

## 4. The Cowork trigger fires weekly and is written for the 1st and the 15th

The prompt has three branches: an every-run nudge, "On the 15th that is the
entire run", and a section headed "ON THE 1st ONLY" carrying the whole
discovery pass. The trigger is scheduled **weekly, Monday 08:00**, with
automatic approval on and "require this computer" off.

Mondays almost never land on the 1st or the 15th. Over the twelve months from
7 September 2026 there are **53 Monday firings, and exactly 4** fall on either
date, all four clustered in February and March 2027:

    2027-02-01   2027-02-15   2027-03-01   2027-03-15

Three consequences:

- **49 of 53 firings hit no branch** and fall through to the every-run nudge,
  which opens by asserting "The Edit's fortnightly axis audit is due today".
  That is a flat claim with no condition on it, so it is false roughly 49 times
  a year. This is precisely the accumulating noise the artifact says destroyed
  the old watchdog's credibility, rebuilt in a new place.
- **The monthly discovery pass runs twice in twelve months**, not twelve times,
  then not again for about eleven months. `design_kit` and `learning` are
  already the two tabs with no fact checker. Their only active owner fires
  twice a year by accident.
- **The first firing is a false alarm.** The trigger was created Tuesday 1
  September, so it first fires Monday 7 September. The audit is not due until
  the 14th.

There is no fall-through branch. On a day that is neither the 1st nor the 15th
the prompt runs the nudge and the "ON THE 1st ONLY" section simply does not
apply, so those 49 runs behave exactly like a 15th: nudge, stop.

The near-miss is the tell. 14 September 2026 is a Monday and the 15th is a
Tuesday, so `CLAUDE.md`'s "Mondays from 14 September" and the prompt's
"on the 15th" describe the same intended run one day apart. The prompt wants a
semi-monthly 1st-and-15th cadence; the schedule delivers weekly Mondays.
Fixing the schedule alone would leave the every-run nudge still unconditional.

## 5. "Never write" is prose, not a control

Two settings change what the trigger's own guardrails are worth.

**Automatic approval is on**, so no tool call pauses for a human. **"Require
this computer" is off**, so it runs in the cloud whether or not the Mac is on.
The prompt is correct to assume this: its reasoning for not fact-checking is
that the audit "runs in Claude Code on Jasmin's Mac, which fetches from a UK IP
and renders JavaScript pricing pages. You can do neither." The setting and the
self-description agree.

But the prompt's safety boundary is entirely prose. "Never write to the Sheet
or modify any Drive file" and "Report only. Never write" are instructions to a
model, and the prompt hands that model the spreadsheet ID and tells it to read
the workbook. Nothing in the schedule enforces the boundary.

This is the test from the global rules: *what does the failure case write
here?* A control that holds only while the model keeps following prose, on an
unattended cloud run with approval switched off, is documentation. The real
control is the Cowork connector's own scope. **If the Google Sheets connector
is read-only, the boundary is genuine and the prose is a helpful restatement.
If it carries write scope, the only thing standing between a cloud process and
the live directory is the model's compliance**, and a Sheet edit is public in
seconds with no deploy and no review.

That is not a claim that anything has gone wrong. It is one setting to check,
and it decides whether this owner is safe by design or safe by luck.

Minor, and not a defect: 08:00 Monday is also when the daily `whats_new`
Routine fires. Different systems, different tabs, no write collision, but the
Monday notification will land alongside the news pipeline.

## What the owners know about each other

Better than expected, and the failure is in the documentation rather than the
machinery.

- The Cowork trigger opens "YOU ARE NOT THE AUDIT", forbids fact checks and
  Sheet writes, and gives a sound reason: the audit runs from a UK IP and
  renders JavaScript pricing pages, and duplicate findings are what
  `axis-rulings.md` exists to stop. It names that file correctly.
- It also declines to retire a row over a dead link, on the grounds that link
  health belongs to the audit "which already checks every URL on this tab".
  That is true: Pass 1a covers `design_kit` and `learning`, and `sheet-write`
  permits `design_kit` E and `learning` I. This is the one clean handoff in the
  system.
- The audit prompt reciprocates at line 316, "The monthly discovery job lives
  in Cowork, not here".

So the two operational owners each know the other exists and defer correctly.
The stale picture belongs to the artifact, which knows about neither.

Two smaller drifts fall out of the trigger text:

- **`isComplete()` now has three implementations**: the code in
  `src/lib/sheets.ts`, prose in the audit prompt, and prose in the Cowork
  trigger. All three currently agree, including the case-insensitive
  `dpia_flag` match. Nothing keeps them agreeing.
- **`design_kit` row count is wrong in all three documents.** Live it is **44**.
  The Cowork trigger and the audit prompt both say 46; `schema.md` says 45. The
  trigger's instruction "design_kit is at 46 rows, so propose swaps, not
  additions" is therefore driven by a number two too high.
- **The 45-row ceiling is being applied to the wrong tab.** `CLAUDE.md` sets it
  on the directory: "Never widen the directory back toward general AI tools:
  the row ceiling is 45". `tools` renders 23, so the directory has room. The
  audit prompt's open decision 3 asks whether that ceiling also covers
  `design_kit` and `learning`, and the Cowork trigger has already answered yes
  by assuming it. That is an unruled question being enforced as though settled.

And the radar gap is now explicit rather than inferred. The trigger is told to
read the tools tab for dates only and "never comment on its contents, which is
the audit's territory". The audit reaches only published rows. So the 44 radar
rows sit between an owner instructed not to look and an owner that does not
reach them. The trigger's freshness count is scoped to published rows too, so
they have no early warning either.

## Counts, verified live 1 September 2026

Read per tab through the Sheets API with the localhost key, not taken from any
document:

    tools        67 data rows   23 published   44 radar
    design_kit   44
    learning     26
    my_stack     19

`learning` and `my_stack` match `schema.md`. `tools` matches `CLAUDE.md`.
`design_kit` matches nothing.

Still unchecked: whether the Cowork trigger has fired yet. Created 1 Sep, first
Monday is the 7th.

---

## Rulings, 1 September 2026

All seven settled by Jasmin in one pass.

1. **The Cowork write boundary stays prose, and is recorded as a known risk.**
   The connector is not being scoped down. The failure case is a cloud process
   holding the spreadsheet ID, with auto-approve on and nobody present, held
   only by the model continuing to follow an instruction. Named here rather
   than assumed safe. `sheet-write.mjs` enforces the same intent in code with
   tests behind it; these are not equivalent mechanisms and should not be
   described as if they were.
2. **Cadence: move the prompt to the schedule.** Audit due on the 2nd and 4th
   Monday, discovery on the first Monday of the month, silent otherwise.
   Keeps the 14 September anchor and takes discovery from twice a year to
   twelve times.
3. **Radar: shrink the claim rather than extend the audit.** The audit stays
   scoped to published rows, because a cheap run is what makes it get run.
4. **`Unclear` joins column I** in the audit prompt and in
   `LEGAL.trains_on_input`. The axis lock is canonical on allowed values.
5. **`whats_new` links stay out of the URL sweep**, and the exclusion becomes
   explicit in the prompt so the next reader knows it was chosen.
6. **The watchdog Tue-Sat fix is committed.**
7. **The radar staleness signal is a per-card chip**, which closes the open
   "radar status chip" item from the wrap with the same string. Chosen over a
   page-level line on the codebase's own recorded reasoning: a disclaimer above
   the grid does not survive a card seen alone in a screenshot or a share.

**Blocked on copy:** the chip needs an approved string. Code sessions place
strings and never author them, so this is the one ruling that cannot be
executed here.
