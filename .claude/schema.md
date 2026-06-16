# The Edit AI — Google Sheets Schema

Spreadsheet ID: `1RIO-WY9H75gML_UgdQbHGgDl-R0MfaG3CRPUp3PtAUI`

Tab names are case-sensitive, lowercase with underscores. Content changes go
live immediately without a deploy. `google_drive_fetch` cannot read Sheets —
download as .xlsx and upload to the thread.

Last verified from live data: 2026-06-16.

---

## tools (61 rows)

Status values: `in_stack` or `on_radar`. No blank status — both values are active.

| Col | Field    | Notes                        |
|-----|----------|------------------------------|
| A   | name     |                              |
| B   | category |                              |
| C   | status   | `in_stack` or `on_radar`     |
| D   | cost     |                              |
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

## whats_new (228 rows)

Populated daily by the Claude Code Routine via Apps Script.
Deployed under jasminaziz1@gmail.com.

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
