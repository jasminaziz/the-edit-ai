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
- Unclear

**Definition.** Where inputs are processed and stored on the tier a small
charity would actually buy. `EU option` means residency exists but must be
chosen or paid for. `Your tenant` means the tool runs inside infrastructure
the organisation already controls, under terms it already accepted, and it
is the value Microsoft Copilot and its like take. `Unclear` is a legitimate
published value and is itself a warning.

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
