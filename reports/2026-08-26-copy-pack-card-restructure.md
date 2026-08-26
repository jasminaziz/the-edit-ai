# Copy pack: the card restructure

**Approved by Jasmin, 26 August 2026 (Cowork session).** These are exact
strings. The code session places them verbatim: no rewording, no added
punctuation, no em dashes introduced anywhere, no improvised variants for states
not listed here.

Three items. They complete the ToolCard restructure proposed in
`reports/2026-08-26-toolcard-restructure.md`, which carries the layout and the
reasoning.

---

## 1. The risk-zone label

Rendered as the heading of the card's second zone, above `Where your data sits`.
A short label with a hairline rule running to the right of it.

```
The checks
```

**Rendering.** Uppercase via CSS, matching the treatment the job chips already
use (`uppercase tracking-[0.05em]`). The string stays in sentence case in the
source, as the job values do.

**Why this and not `Risk`.** The site's headline claim is that no tool appears
until it has been through the checks, and this block is where that claim is
evidenced, so the label makes the promise concrete on every card. `Risk` would
also mislabel its own contents: `Where your data sits: US` is a fact, not a
risk.

## 2. The DPIA definition line

Rendered **once per page** on `/tools`, above the grid, near the sector toggles.
Not on the card, and not repeated.

```
A DPIA is the assessment your organisation carries out before using personal data in a way that could put people at risk. The flag on each card says how likely typical comms use is to trigger one.
```

**Why it exists.** `AboutPanel` is the only thing on the site that explains the
term and it renders on the homepage only. A visitor arriving at `/tools` from a
sector search meets DPIA eleven-plus times, on fifteen chips and a filter
toggle, with no explanation anywhere on the page.

**Phrasing note for anyone tempted to edit it.** It says the organisation
carries out the assessment, matching the policy template's own wording and
CLAUDE.md's sector-precision rule: a DPIA is something an organisation does, not
something a tool needs. Do not reverse that.

## 3. C4(b) placement change

**No new copy.** The string is unchanged and still lives in
`reports/2026-08-22-copy-pack-addendum.md`:

```
Not sure what your policy should say? Start with the template.
```

**What changes is when it fires. Approved 26 August: Red only, not Amber or
Red.**

**Why.** It was scoped when Green was expected to be common. Amendment 4 to the
axis made Green rare, so a line designed to appear sometimes now appears on
**14 of the 15 published cards** and reads as furniture. Restricted to Red it
appears on two, HubSpot and DeepSeek, which are the rows where a reader
genuinely needs a policy before going near the tool.

**The counter, recorded because it is real and was weighed.** Amber is arguably
where people need the policy most, because Amber means fine until supporter data
goes in, and supporter data is exactly what they will put in. The decision went
to Red anyway on two grounds: the template already has three other placements
(the in-grid card after the sixth tool, the nav and the footer), and a prompt
nobody reads captures nothing.

---

## What is still unapproved

The **hero pills label** is drafted and parked, because the pills ruling itself
is outstanding and the source and cap change what the label has to do. Draft,
not approved:

> Everything I run. The directory below is a shorter list.

---

*Approved 26 August 2026. Live until placed, then historical. The card layout
these strings sit in is `reports/2026-08-26-toolcard-restructure.md`.*
