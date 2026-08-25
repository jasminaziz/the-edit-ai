# The evaluation axis, locked

**Locked by Jasmin, 23 August 2026.** This is the frozen axis. It supersedes
audit section 3 on allowed values and definitions, and it supersedes the A1
decision sheet (`reports/2026-08-22-a1-axis-decision-sheet.html`), which is
now historical: the rulings it proposed were all adopted and they are
restated here as settled.

Field names and column order were already frozen by the branch code, which
reads them by normalised header name. Everything else on this page was open
until tonight and is now closed. Do not relitigate. Amendments need Jasmin's
explicit decision, and any amendment to an allowed value set means checking
the seeded rows still validate.

The judgement split is unchanged and absolute: `data_location`,
`trains_on_input`, `nonprofit_tier` and pricing are machine-verifiable facts
that automation may maintain with sources. `dpia_flag`, `trustee_note` and
the verdict are Jasmin's judgement and are never written by any automation
or agent session.

---

## The seven fields

### G · `jobs`

Multi-value, comma-separated in the Sheet. The parser also splits on `·`
and `•`.

**Allowed values, and no others:**

- Appeals & fundraising
- Case studies & storytelling
- Social
- Internal comms
- Accessibility
- Translation

**Definition.** The comms jobs a tool serves, not what the tool is. A tool
may hold more than one job and the filter matches on contains, not equals.
Soft cap of three jobs per tool: a tool that appears to do every job is a
tool whose purpose has not been decided yet.

### H · `data_location`

Single value.

**Allowed values, and no others:**

- UK
- EU
- EU option
- US
- Your tenant
- Other
- Unclear

**Definition.** Where inputs are processed and stored on the tier a small
charity would actually buy. `EU option` means residency exists but must be
chosen or paid for. `Your tenant` means the tool runs inside infrastructure
the organisation already controls, under terms it already accepted, and it
is the value Microsoft Copilot and its like take. `Other` means a
jurisdiction outside the UK, EU and US, named in the verdict; it exists
because the judged-not-recommended rows are exactly the ones the first six
values could not describe, and calling a known jurisdiction `Unclear` would
be a lie. `Unclear` is a legitimate published value and is itself a warning.

**Amended 23 August 2026,** after seeding surfaced that DeepSeek had no
representable value. This is the only amendment to the locked axis so far.

Where a tool differs by tier, one value per row, resolved by the buying-tier
rule above. The fuller story belongs in the verdict.

### I · `trains_on_input`

Single value.

**Allowed values, and no others:**

- No
- No by default
- Yes unless you opt out
- Yes
- Varies by tier

**Definition.** Whether the tool trains on what you type into it, recorded
for the tier a small charity would buy. `Varies by tier` is reserved for
tools where the buying tier is itself genuinely ambiguous for this audience,
and where it is used the verdict must name the tiers.

### J · `nonprofit_tier`

Free text, one line, roughly 60 characters, or the literal value `None`.

**Definition.** The actual programme and what it gives, for example
`Canva Pro free for registered charities`. Eligibility detail and what the
programme unlocks belong in the verdict, not here.

`None` means confirmed absent. An empty cell means unchecked. That
distinction is load-bearing: one is a finding, the other is unfinished work,
and an empty cell keeps the whole row off the grid.

### K · `dpia_flag`

Single value. Never written by any automation or agent session.

**Allowed values, and no others:** `Green`, `Amber`, `Red`.

**Definition.** Not whether the tool needs a DPIA, since organisations do
DPIAs and tools do not. It records whether typical comms use is likely to
trigger one.

- **Green:** used as directed, no personal data leaves you.
- **Amber:** fine for general work, DPIA territory once supporter,
  beneficiary or staff data goes in.
- **Red:** assume a DPIA before adoption.

**One flag per row, never compound.** The chip renders one state, the
template line fires on Amber or Red, and the DPIA green toggle needs a yes
or a no, so the Sheet must hold a single value. Where a tool sits on a
boundary the flag takes the cautious side: the site must never be the reason
someone skipped a DPIA they needed. Conditionals ("Amber if you upload
identifiable beneficiary photos") live in the verdict or the trustee note.

### L · `trustee_note`

One sentence. Never written by any automation or agent session.

**Definition.** The sentence you could say at a board meeting with no
follow-up questions you cannot answer. If it cannot be written, that is the
verdict.

**Format.** Stored bare, with no quote marks, because verdicts ban inline
quote marks and the note renders inside the verdict block. If it should read
as speech on the card, that is a rendering treatment for the B3 session to
propose, not punctuation in the data. Written first person plural, which is
what makes it sayable at a board meeting.

### M · `last_checked`

Date, format `DD MMM YYYY`, strict. For example `23 Aug 2026`.

**Definition.** Stamped when a row's fact fields were last verified against
sources. The same format the `whats_new` pipeline already enforces, so the
Sheet carries one date format throughout.

It marks checked, not passed. A deliberate "judged, not recommended" row
still carries a date.

---

## Row completeness, and what it drives

A row is **complete** when all seven fields G through M hold a non-empty
value. `None` counts as a value; blank does not.

The B3 session introduces a single completeness predicate and uses it twice:

1. **The grid renders complete rows only.** Incomplete rows do not appear.
   This is what lets the site relaunch smaller and grow back verified.
2. **The homepage counter counts complete rows,** using the same predicate.

That second point is a small change to committed code. The counter currently
reads rows with a non-empty `last_checked` (commit `f514b0a`). Since
`last_checked` is one of the seven, every complete row already passes that
test, but a row could carry a date and still be missing its trustee note,
which would count a row the grid refuses to show. One predicate, used for
both, removes the discrepancy. The approved caption is untouched either way.

## The three sector toggles

Above the grid, per the audit. Each passes exactly these values:

| Toggle | Passes |
|---|---|
| Has nonprofit pricing | any `nonprofit_tier` value except `None` |
| Doesn't train on your content | `trains_on_input` of `No` or `No by default` only |
| DPIA green | `dpia_flag` of `Green` only |

`Varies by tier` does not pass the training toggle. Incomplete rows never
reach a toggle, because they never render.

## DPIA chip colours

Text-labelled chips, never colour alone. Each chip is a tinted pill with a
1px border, with the text and border in the same hex. All three pairings
pass WCAG AA for normal text against both the white card and the cream page
ground.

| Flag | Text and border | Tint background | On tint | On white |
|---|---|---|---|---|
| Green | `#2D6A4F` | `#E4F0E9` | 5.46:1 | 6.39:1 |
| Amber | `#7A5200` | `#FAF0DB` | 6.11:1 | 6.92:1 |
| Red | `#A8261C` | `#FBE9E6` | 6.05:1 | 7.10:1 |

The Green chip reuses forest green `#2D6A4F`, which is also the IN MY STACK
badge colour. **Signed off by Jasmin, 23 August 2026.** The badge is a solid
fill and the chip is a pale tint with a text label, so the two treatments
read differently; a second near-identical green would read as drift in a
locked palette.

Burnt orange `#E8572A` is ruled out for the Amber chip on measurement, not
taste: it returns 3.60:1 as text on white and fails AA. Electric lime
`#C8F04A` remains accent only and is never a badge or a category colour.

---

## Still outstanding before B3 can run

The axis is locked, but the ToolCard session needs two more things that do
not exist yet.

1. **Seed rows.** Two or three tools with all seven fields filled, plus one
   kept row deliberately left blank across G to M so the session has a real
   incomplete-row case to build the hidden-row mechanic against.

2. **Card and filter microcopy.** Roughly twelve visitor-facing strings that
   the copy pack does not hold: the three DPIA chip labels, the five card
   field labels, the three toggle labels, and the filter empty state. Code
   sessions place approved strings and never author them, so these must be
   written with Cowork Claude and banked as exact strings first. This is a
   blocker nobody had logged before tonight.

The two approved C4 strings B3 also needs are already banked in
`reports/2026-08-22-copy-pack-addendum.md`.

---

*Locked 23 August 2026. Supersedes audit section 3 and the A1 decision sheet
on every value and definition above. Where this file and `.claude/CLAUDE.md`
disagree on a field name or column position, CLAUDE.md wins; where they
disagree on an allowed value or a definition, this file wins and CLAUDE.md
gets corrected.*


---

# Amendments, 25 August 2026

Three amendments, all taken by Jasmin on 25 August, all forced by real vendor
data rather than by preference. Recorded here in the same way as the `Other`
amendment of 23 August. Everything above stands unless contradicted below.

## 1. `I · trains_on_input` gains `Unclear`

**New allowed value set:** No / No by default / Yes unless you opt out / Yes /
Varies by tier / **Unclear**

`Unclear` means the vendor publishes no position on training at all. It is not
the same as `Varies by tier`, which means the vendor publishes several and the
buying tier is genuinely ambiguous. Forced by Submagic and Blotato, neither of
which publishes anything, so neither row could be completed honestly.

This mirrors `data_location`, where `Unclear` is already a legitimate published
value and a warning in its own right.

**Toggle rule: `Unclear` does not pass "Doesn't train on your content".** This
needs no code change. `passesTrainingToggle` in `src/lib/sheets.ts` is an
allowlist of `No` and `No by default`, so `Unclear` fails it automatically, and
`isComplete` only tests for a non-empty value. Verified 25 August.

## 2. `J · nonprofit_tier` gains an evidence standard for `None`

The definition of `None` as confirmed absent is unchanged. What was missing was
the standard of proof, which left five vendors uncompletable: Granola, Ideogram,
Gamma, Grok and Seedance publish no programme and no denial of one.

**`None` may be recorded when all of these hold:** nothing on the vendor's
pricing page, nothing on any nonprofit or education page they run, and nothing
via TechSoup or the Charity Digital Exchange.

The reasoning, which is why this differs from amendment 1: a nonprofit tier is a
customer-acquisition asset, so vendors advertise it, and silence is close to
conclusive. A training policy is a liability, so vendors are vague about it, and
silence proves nothing. Same evidential question, opposite answers, and the
asymmetry is the reason.

Where a programme exists in some markets but not for UK charities, the cell
still reads `None`, because the cell is one line of roughly sixty characters and
the qualification belongs in the verdict. HubSpot is the live example.

## 3. `G · jobs` gains `Research`

**New allowed value set:** Research / Appeals & fundraising / Case studies &
storytelling / Social / Internal comms / Accessibility / Translation

`Research` goes **first** in the list, so it renders as the first job chip after
`ALL`. Two reasons: it is the shortest label in the set, so it is the chip least
likely to be lost to rail overflow, and research precedes the work the other six
describe.

**Why this was necessary.** Across the 23 published rows the tags fell like
this: Internal comms 11, Case studies & storytelling 11, Social 7,
Accessibility 5, Appeals & fundraising 2, Translation 1. Two generic categories
carried 22 tags between them while the two sector-specific ones carried three.
`Case studies & storytelling` had become a catch-all, and Perplexity and
NotebookLM were sitting in it only because there was nowhere else to put them.
A taxonomy whose largest category is the one that means "other" is not
describing the sector it was built to describe.

The soft cap of three jobs per tool is unchanged.

**This one is not free, and the cost is the filter rail.** `CATEGORIES` in
`src/lib/sheets.ts` currently holds `ALL` plus six jobs, which is the seven
chips F2c measured at a 1470px viewport with `Translation` ending 30px inside
the rail box. An eighth chip will very likely clip at 1470 and almost certainly
at 1366. **F2c is therefore reopened and is now blocking rather than
downgraded.** Adding `Research` did not create that problem; the rail was
already marginal at laptop widths and the confirming measurement was never
taken. It removes the option of continuing to ignore it.

**Code changes required:** add `'Research'` to `CATEGORIES` immediately after
`'ALL'`, and solve the rail overflow treatment. Nothing else. Contains-matching
already handles a new value with no further work.

---

*Amendments recorded 25 August 2026. Jasmin's explicit decision on all three.*

---

# Amendment 4, 25 August 2026: what "used as directed" means

**Jasmin's ruling, 25 August 2026.** The `Green` definition reads "used as
directed, no personal data leaves you." That phrase was doing undeclared work,
and it decides eleven rows rather than one.

**Ruling: "as directed" means the tool as it arrives, in its default
configuration.** Not the tool as a competent administrator would configure it.

**Why.** The reader is a charity with no IT function. They sign up and start
typing without changing a setting, and that is the moment the flag exists to
protect them at. A flag describing well-configured behaviour describes a
situation many readers will never be in.

**Where the better-configured story goes:** the trustee note and the verdict.
Those can and should say what to switch off. Microsoft Copilot is the worked
example: the flag is Amber because web search is on by default and those queries
sit outside the DPA, and the trustee note reads that the organisation has turned
web search off so nothing leaves its tenancy. The flag describes the tool, the
note describes what this organisation did about it.

**The known consequence, accepted rather than discovered.** Green becomes rare.
Almost nothing in this market keeps personal data inside the organisation, which
is arguably the single most useful thing the directory says. It also means the
`DPIA unlikely` toggle returns very few rows. That is a product fact to design
around, not a reason to soften a flag.

**Evidential rule that follows, and it is not the same as caution.** A boundary
case takes the cautious side. An *undocumented* case does not automatically take
the cautious side by analogy to a documented one, because the absence of a
sourced risk can never be proven and treating it as proof would make every row
Amber forever. Where a vendor makes an affirmative, sourced containment claim
and no exception is documented, the claim stands and the open question is
recorded for the next check.
