# The Edit AI — Google Sheets Schema

Spreadsheet ID: `1RIO-WY9H75gML_UgdQbHGgDl-R0MfaG3CRPUp3PtAUI`

Tab names are case-sensitive, lowercase with underscores. Content changes go
live immediately without a deploy. The Google Drive connector can read the
spreadsheet but may return only the first tab; for reliable per-tab reads use
the Sheets values API (production key + theeditai.co.uk referer).

Last verified from live data: 2026-07-03.

---

## tools (61 rows)

Status values: `in_stack` (22) or `on_radar` (39). No blank status — both
values are active. Only `in_stack` renders a badge on the site; `on_radar`
displays nothing (see CLAUDE.md, Badge states).

| Col | Field    | Notes                        |
|-----|----------|------------------------------|
| A   | name     |                              |
| B   | category |                              |
| C   | status   | `in_stack` or `on_radar`     |
| D   | cost     | Code maps this to `pricing`  |
| E   | verdict  |                              |
| F   | url      |                              |

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
