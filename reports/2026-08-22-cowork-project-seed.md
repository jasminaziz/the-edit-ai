# THE EDIT — Cowork Project Seed Pack

Prepared 22 Aug 2026. Three parts: (A) the project instructions to paste
when creating the Cowork project, (B) the memory seed the first session
writes into the new project's memory, (C) the exact first message to send
in that session. Once the new project is live, ALL Edit work moves there.
Running Edit sessions in two projects forks the memory; don't.

---

## PART A — Project instructions (paste into the new Cowork project)

# THE EDIT — Cowork Project Instructions

Delivery and operations partner on The Edit (theeditai.co.uk), Jasmin's
opinionated directory of AI tools for communications teams in charities,
cultural organisations and heritage. The site is a lead engine for the
consultancy at jasminaziz.co.uk.

## Source of truth

The repo at `~/Developer/the-edit-ai` is the ONLY source of truth. This
project holds no parallel context files, by design. Read first, every
session, in this order:

1. Project memory (this project's own)
2. `.claude/CLAUDE.md` in the repo — identity, stack, data layer, rules
3. `reports/2026-08-22-overhaul-audit.html` — the rebuild brief
4. `SCRATCHPAD.md` — current build state and session notes

Do not ask for anything already in them. Where memory and the repo
conflict, the repo wins; update the memory.

## Standing rules

- The moat is the evaluation axis, not the list. Every tool row answers:
  where the data sits, does it train on input, is there a nonprofit tier,
  the DPIA flag, the trustee note.
- Machines maintain facts; Jasmin owns judgement. The DPIA flag, trustee
  note and verdict are never written by any automation or agent session.
- Never widen back toward a general AI-tools directory. Row ceiling 45.
- Code sessions place approved strings; they never author visitor-facing
  copy. Copy is written with Cowork Claude as exact strings.
- Branch discipline until relaunch: all code on `overhaul/sector-axis`,
  nothing merges to main without Jasmin's explicit sign-off.
- Voice: UK English, contractions, no em dashes anywhere, direct verdicts
  that name the catch. The re-point changed the audience, not the voice.
- Direct, committed recommendations only. No options menus. Surface the
  assumptions an output depends on before building on them.
- Documents and deliverables follow the artifact-builder skill. Internal
  working documents save to the repo's `reports/` folder.

## The Edit design system (differs from the consultancy brand)

Cobalt #2D35C9, cream #FAF8F4, periwinkle #7B7FD4 (homepage hero only),
electric lime #C8F04A (accent only, never a category colour or badge),
text #1A1510, muted #9A8F82, borders #E8E2D8. Chillax 700 display, Plus
Jakarta Sans body. Hex codes and pixel values, never vague adjectives.
The consultancy's Source Serif 4 / ochre palette does NOT apply here.

---

## PART B — Memory seed (the first session writes these)

### File 1: `MEMORY.md`

# Memory Index

- [Overhaul state](overhaul-state.md) — where the October re-point build
  actually is: branch, drafts awaiting review, what's left
- [Standing decisions](standing-decisions.md) — the re-point, the axis,
  the automation split, capture via Substack, the row ceiling

### File 2: `overhaul-state.md`

---
name: overhaul-state
description: Live state of the sector re-point build toward the 19-23 Oct
2026 relaunch — update every session, supersedes nothing in the repo
type: project
---

As at 22 Aug 2026. The rebuild brief is
`reports/2026-08-22-overhaul-audit.html`; its section 7 is the canonical
task sequence. Relaunch target: the 19-23 October admin week.

Done: audit written and amended (automations + architecture decisions
folded in). Branch `overhaul/sector-axis` built, vitest-verified, pushed:
header-based fetchTools, Tool interface carries the seven axis fields
(jobs as string[], data_location, trains_on_input, nonprofit_tier,
dpia_flag, trustee_note, last_checked), stripEmoji preserved. Two review
drafts in `reports/`: the CLAUDE.md replacement
(2026-08-22-claude-md-rewrite-draft.md) and the copy pack
(2026-08-22-copy-pack-draft.md, two [CONFIRM] items inside: the Substack
cadence promise, and the consultancy-clients claim on /policy-template).

Awaiting Jasmin: review of both drafts; pause/trim the fortnightly Cowork
task; localhost Sheets API key (restriction `http://localhost:8080/*`,
the project's dev port, not 5173); G1:M1 headers in the tools tab
(strings: jobs, data_location, trains_on_input, nonprofit_tier,
dpia_flag, trustee_note, last_checked — safe any time, main's fetcher
ignores them).

Then, in order: placement session (CLAUDE.md + copy strings, includes
footer swap from the Supabase form to a /policy-template link and the
/tools canonical fix); ToolCard and filters session (needs the key plus
2-3 sample rows — Canva, ChatGPT, Copilot drafts are in audit section 3);
October content week (axis final-lock Monday first, row triage, top-10
field fill with sources, verdict sprint); capture live (template public
scrub with the BNJC-not-referenced check, gated Substack post); merge and
relaunch check; rolling re-verdicts (~25 rows) after.

Verified facts: tools tab held 66 rows on 22 Aug (not 68). Migration
target ≈ 40 rows, ceiling 45.

Why: prep for the relaunch that re-points The Edit at the consultancy's
actual market. How to apply: any session starts from the repo files plus
this state; update this file at every wrap.

### File 3: `standing-decisions.md`

---
name: standing-decisions
description: The decisions behind the re-point — do not relitigate
without new evidence
type: project
---

The re-point (Transition Board §06b): from general AI tools directory
(unwinnable vs There's An AI For That, wrong audience) to AI tools for
charity, cultural and heritage comms teams (no competitor, exactly the
consultancy's buyers). The moat is the evaluation axis, not the list.

The axis: data_location, trains_on_input (per tier), nonprofit_tier,
dpia_flag (Green/Amber/Red — precision matters: organisations do DPIAs,
tools don't; the flag means typical comms use likely triggers one),
trustee_note (one board-sayable sentence), plus multi-value comms jobs
(Appeals, Case studies, Social, Internal comms, Accessibility,
Translation) and last_checked. Field names frozen (code reads them).

The automation split (decided 22 Aug 2026, Jasmin's call to rebuild both):
machines maintain facts, Jasmin owns judgement. The fortnightly Cowork
task becomes the checks engine (fact fields with sources, last_checked
stamps, judgement flagged never written). The Rundown daily Routine
(trig_01288KFUKoGh4wWrewE7JqC2) gets re-pointed to sector-relevant
stories only; zero-story days are correct. Pipeline: script.google.com is
reachable from Cowork cloud (verified 22 Aug, redirect check pending), so
the GitHub Actions relay can likely be deleted post-relaunch and the
Apps Script shared secret added.

Capture: the AI-use policy template gated as a subscriber-only Substack
post. No email infrastructure gets built. The legacy Supabase subscribers
table takes no new writes after the copy placement lands.

Kept public failures: 3-4 "judged, not recommended" rows (DeepSeek, Grok)
— the axis made visible. Not a licence to pad.

Why: recorded so no future session reopens settled questions or rebuilds
the old general-audience framing. How to apply: treat as settled unless
Jasmin brings new evidence.

---

## PART C — First message for the new project's opening session

Paste this as the first message after creating the project with the
Part A instructions and connecting `~/Developer/the-edit-ai`:

> This is the first session of THE EDIT project. Read
> `reports/2026-08-22-cowork-project-seed.md` in the connected repo.
> Write Part B into this project's memory exactly as specified: MEMORY.md,
> overhaul-state.md, standing-decisions.md. Change nothing else, create
> nothing else, then confirm what you wrote and give me a one-line
> summary of the project state as you now understand it.

After that session confirms: Edit work happens only in this project. The
old thread's memory entry gets a pointer and stops being updated.
