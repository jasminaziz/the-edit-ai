# The Edit AI — Google Sheets Schema

Spreadsheet ID: `1RIO-WY9H75gML_UgdQbHGgDl-R0MfaG3CRPUp3PtAUI`

Tab names are case-sensitive, lowercase with underscores. Content changes go
live immediately without a deploy. The Google Drive connector can read the
spreadsheet but may return only the first tab; for reliable per-tab reads use
the Sheets values API (production key + theeditai.co.uk referer).

Last verified from live data: 2026-09-01 (row counts, read per tab through
the Sheets API). Column notes below were last verified 2026-08-26. Sector-axis columns G–M are
populated and read by the site on `overhaul/sector-axis`; column N
(`what_it_does`) was added and populated 2026-08-26.

---

## tools (67 rows as at 2026-09-01, 23 of them complete)

**Column layout is read by header name** on `overhaul/sector-axis`:
`parseToolRows()` matches normalised header strings, so column order no
longer breaks the site. One alias: the header `cost` maps to `pricing`.
Header strings themselves are load-bearing and must match the field names.
On `main` the fetcher is still positional A-F until the merge, so do not
reorder columns before then.

Status values: `in_stack` or `on_radar`. Only `in_stack` renders a badge.
Status column is legacy and still awaiting retirement (see overhaul audit,
section 06).

**Only complete rows render.** `isComplete()` requires all seven axis fields,
with `dpia_flag` one of the canonical three. 23 of the 67 rows passed as at
2026-09-01; the other 44 are on the radar. The homepage counter uses the same
predicate, so the count and the grid cannot disagree.

**They are no longer invisible.** This paragraph said the incomplete rows were
"invisible to the site" until 1 September 2026, when `/radar` shipped and began
publishing all 44, leading each card with the `verdict`. `isComplete()` still
decides which of the two pages a row appears on, and a row appears on exactly
one, but it no longer decides whether a row is published at all.

### Original columns A–F (live, unchanged)

| Col | Field    | Notes                                    |
|-----|----------|------------------------------------------|
| A   | name     |                                          |
| B   | category | Legacy tool-type categories (Writing, Research, Design, Video, Automation, Building). Superseded in the UI by `jobs`: the card renders job chips, not this. Still parsed and still searchable, and it is stale in places (the A3 triage has HubSpot as `Automation`), so do not restore it to the card. Column N is what answers "what kind of thing is this" |
| C   | status   | `in_stack` or `on_radar` (legacy, retiring) |
| D   | cost     | Code maps this to `pricing`              |
| E   | verdict  | Jasmin's judgement, never written by automation. Rewritten against the sector axis for the top rows; see reports/2026-08-26-a5-verdict-drafts.md |
| F   | url      |                                          |

### Sector-axis columns G–M (appended 2026-08-22, populated)

All values are strings. Empty cells are still safe — `parseToolRows()` returns
an empty string for an unpopulated cell and an empty array for `jobs` — but a
row with any axis field blank fails `isComplete()` and does not render at all.

Allowed values below are frozen by `reports/2026-08-23-axis-locked.md`, which
outranks the overhaul audit on every value and definition. Do not widen them
here. `dpia_flag`, `trustee_note` and `verdict` are Jasmin's judgement and are
never written by automation or a code session.

| Col | Field            | Allowed values / format                                    |
|-----|------------------|------------------------------------------------------------|
| G   | jobs             | Comma-separated comms jobs: `Research`, `Appeals & fundraising`, `Case studies & storytelling`, `Social`, `Internal comms`, `Accessibility`, `Translation`. `Research` added 2026-08-25 and sorts first. Multi-value, e.g. `"Social · Appeals & fundraising"` |
| H   | data_location    | `UK` · `EU` · `EU option` · `US` · `Your tenant` · `Other` · `Unclear`. `Your tenant` is the Copilot case; `Unclear` is a legitimate published value and is itself a warning |
| I   | trains_on_input  | `No` · `No by default` · `Yes unless you opt out` · `Yes` · `Varies by tier` · `Unclear` (added 2026-08-25: the vendor publishes no position at all). Only `No` and `No by default` pass the training toggle |
| J   | nonprofit_tier   | Programme description, e.g. `"Canva Pro free for registered charities"`, or `"None"` (confirmed absent, not unchecked) |
| K   | dpia_flag        | `Green` · `Amber` · `Red` · `` (empty = unverified). Green: no personal data leaves you in typical comms use. Amber: DPIA territory if supporter/beneficiary data goes in. Red: assume DPIA before adoption. |
| L   | trustee_note     | One sentence for a board meeting with no follow-up questions |
| M   | last_checked     | Date the fact fields were last verified. `DD MMM YYYY`, strict, e.g. `23 Aug 2026` |

### Column N (added and populated 2026-08-26)

| Col | Field        | Notes                                                    |
|-----|--------------|----------------------------------------------------------|
| N   | what_it_does | One line saying what kind of thing the tool is, in the register `my_stack` already uses. Read by `parseToolRows()` and rendered as the card's description. It answers "what is this", where `jobs` answers "which of my problems does it solve" |

---

## my_stack (19 rows as at 2026-09-01)

Claude is the single featured entry (`featured=true`), covering the full
ecosystem (chat, Code, Cowork, Design, Skills). Adobe Suite and Firefly
combined into one row. Nano Banana merged into Google AI Studio.

| Col | Field        | Notes                        |
|-----|--------------|------------------------------|
| A   | name         |                              |
| B   | category     |                              |
| C   | what_it_does |                              |
| D   | pricing      |                              |
| E   | url          |                              |
| F   | verdict      |                              |
| G   | featured     | `true` or blank; Claude only |

---

## design_kit (44 rows as at 2026-09-01)

Phases (in order): Get Inspired, Define Visual Direction, Plan the Build,
Build the UI, Present the Work, Check Before You Ship. Each phase contains
named sub-groups.

| Col | Field        | Notes                          |
|-----|--------------|--------------------------------|
| A   | name         |                                |
| B   | category     |                                |
| C   | phase        | One of the 6 phase names above |
| D   | group        | Sub-group within the phase     |
| E   | url          |                                |
| F   | what_it_does |                                |
| G   | when_to_use  |                                |
| H   | cost         |                                |
| I   | verdict      |                                |

---

## learning (26 rows as at 2026-09-01)

Categories: Learn, Reference, Stay Current.

| Col | Field           | Notes                            |
|-----|-----------------|----------------------------------|
| A   | name            |                                  |
| B   | category        | Learn / Reference / Stay Current |
| C   | type            |                                  |
| D   | provider        |                                  |
| E   | what_it_is      |                                  |
| F   | why_i_recommend |                                  |
| G   | time            |                                  |
| H   | cost            |                                  |
| I   | url             |                                  |

---

## whats_new (260 rows as at 2026-07-03, grows daily when the Routine runs)

Populated daily by the Claude Code Routine via GitHub Actions → Apps Script
(deployed under jasminaziz1@gmail.com). Dispatch goes through the GitHub MCP
tool — see CLAUDE.md, whats_new automation. Gaps from the June-July stalls
were backfilled 2026-07-11; 28-29 Jun and 5 Jul are legitimately empty (no
weekend editions). Known duplicates to hand-delete: 3 Jul vs 6 Jul batch,
and likely 20-22 Jun repeating 19 Jun; see CLAUDE.md Outstanding item 1.

| Col | Field      | Notes                                    |
|-----|------------|------------------------------------------|
| A   | name       |                                          |
| B   | developer  |                                          |
| C   | date       | DD MMM YYYY strict — drives month parser |
| D   | what_it_is |                                          |
| E   | category   |                                          |
| F   | url        |                                          |

Date format is load-bearing. No ranges, no "Unknown". Breaking it silently
breaks the month-grouping display on the live site.
