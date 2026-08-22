# The Edit AI — Google Sheets Schema

Spreadsheet ID: `1RIO-WY9H75gML_UgdQbHGgDl-R0MfaG3CRPUp3PtAUI`

Tab names are case-sensitive, lowercase with underscores. Content changes go
live immediately without a deploy. The Google Drive connector can read the
spreadsheet but may return only the first tab; for reliable per-tab reads use
the Sheets values API (production key + theeditai.co.uk referer).

Last verified from live data: 2026-07-03. Sector-axis columns added to schema 2026-08-22 (branch overhaul/sector-axis); Sheet columns G–M not yet populated.

---

## tools (66 rows as at 2026-08-22)

**Column layout is read by header name** on `overhaul/sector-axis`:
`parseToolRows()` matches normalised header strings, so column order no
longer breaks the site. One alias: the header `cost` maps to `pricing`.
Header strings themselves are load-bearing and must match the field names.
On `main` the fetcher is still positional A-F until the merge, so do not
reorder columns before then.

Status values: `in_stack` or `on_radar`. Only `in_stack` renders a badge.
Status column is legacy; it will be retired once the sector-axis fields are
populated and the UI is updated (see overhaul audit, section 06).

### Original columns A–F (live, unchanged)

| Col | Field    | Notes                                    |
|-----|----------|------------------------------------------|
| A   | name     |                                          |
| B   | category | Legacy tool-type categories (Writing, Research, Design, Video, Automation, Building). Will be replaced by `jobs` in the UI once G–M are populated. |
| C   | status   | `in_stack` or `on_radar` (legacy, retiring) |
| D   | cost     | Code maps this to `pricing`              |
| E   | verdict  | Being rewritten against the sector axis in Oct 2026 |
| F   | url      |                                          |

### Sector-axis columns G–M (appended 2026-08-22, empty until Oct research pass)

All values are strings. Empty cells are safe — `fetchTools()` returns empty
string for unpopulated rows, and no UI currently reads these fields.

| Col | Field            | Allowed values / format                                    |
|-----|------------------|------------------------------------------------------------|
| G   | jobs             | Comma-separated comms jobs: `Appeals & fundraising`, `Case studies & storytelling`, `Social`, `Internal comms`, `Accessibility`, `Translation`. Multi-value, e.g. `"Social · Appeals & fundraising"` |
| H   | data_location    | `UK` · `EU` · `EU option` · `US` · `Unclear`              |
| I   | trains_on_input  | `No` · `No by default` · `Yes unless you opt out` · `Yes` · `Varies by tier` |
| J   | nonprofit_tier   | Programme description, e.g. `"Canva Pro free for registered charities"`, or `"None"` (confirmed absent, not unchecked) |
| K   | dpia_flag        | `Green` · `Amber` · `Red` · `` (empty = unverified). Green: no personal data leaves you in typical comms use. Amber: DPIA territory if supporter/beneficiary data goes in. Red: assume DPIA before adoption. |
| L   | trustee_note     | One sentence for a board meeting with no follow-up questions |
| M   | last_checked     | Date facts were last verified, e.g. `Oct 2026`            |

---

## my_stack (21 rows)

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

## design_kit (45 rows)

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

## learning (26 rows)

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
