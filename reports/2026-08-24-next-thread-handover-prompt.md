# New thread prompt, 24 August 2026

Paste everything below the line into a fresh Cowork thread.

---

Picking up The Edit relaunch build. The decision in force: the relaunch
finishes before October. Read these, in order, before doing anything or asking
me anything:

1. `reports/2026-08-22-pre-october-roadmap.html`, the sequencing plan: merge
   gates, sittings, sessions, dependencies.
2. `reports/2026-08-22-handover-to-relaunch.md`, the canonical state ledger;
   its section 5 statuses outrank the roadmap on status, the roadmap outranks
   it on timing.
3. `reports/2026-08-23-axis-locked.md`, the frozen evaluation axis. It
   supersedes audit section 3 on every allowed value, definition, toggle rule
   and chip colour. Where it and CLAUDE.md disagree on a field name or column
   position, CLAUDE.md wins; on values and definitions, this file wins.
4. `.claude/CLAUDE.md`, operational source of truth, outranks all of the above
   on anything technical.
5. `SCRATCHPAD.md`, running session log. The 22, 23 and 24 Aug notes cover
   everything recent.

Approved exact strings live in `reports/2026-08-22-copy-pack-addendum.md` and
`reports/2026-08-23-copy-pack-b3-microcopy.md` and nowhere else. If a surface
needs a string that is not in one of those, it does not exist yet and I write
it with you, never a code session.

## Where things stand

A1 locked, A2 done, B3 built and verified, A3 done, A4 done. That is the whole
axis track except my own judgement work.

**B3 verified 24 Aug against real Sheet rows, nine of ten checks pass.** The
tenth needs seven complete rows to prove the template card sits after the sixth
and waits for the ten-row floor. Chip hover was verified structurally rather
than with a pointer. Three of four `Get the template →` labels confirmed
identical; the fourth is the mobile nav. **Do not re-open B3.**

**A3 published 23 rows, not the ~40 the roadmap assumed.** 20 keeps, 3 public
failure rows, 8 to My Stack, 36 to the radar. Nothing was deleted: the
hidden-row mechanic and the `on_radar` status are the tool tracker, so cuts are
unpublished rather than lost.

**A4 is done for every published row, with sources**, in the two
`2026-08-24-a4-fact-pass-*` files. Twelve rows are pasted.

**The Sheet as at the wrap, read directly rather than assumed:** 4 rows
complete, 12 rows at five of seven, 5 at three of seven, 2 at two of seven, 67
rows total. **The only fields missing on those twelve are K and L, the DPIA
flag and the trustee note.** Verify this yourself rather than trusting any
status line, including this one.

So the grid still renders 4. It renders 16 the moment I write twelve flags and
twelve notes, which clears the ten-row floor F2 needs.

## What I want from this thread

The capture track, in order: C1 the policy template edit, C2 the brand and
format decision, C3 the gated Substack post. C3 is Gate 2 and nothing has
started. There is nothing left on the axis track a session can do until the
verdicts exist, so treat the capture track as the critical path.

## Rulings I owe you, and you should ask for early

1. **`None` versus not published in `nonprofit_tier`.** The spec says `None`
   means confirmed absent. Five rows have no published programme and no vendor
   statement denying one: Granola, Ideogram, Gamma, Grok, Seedance. Recording
   `None` publishes findings nobody made; leaving blank hides five otherwise
   complete rows.
2. **`trains_on_input` has no `Unclear`.** Submagic and Blotato publish no
   position at all, so neither row can be completed honestly. Both stay hidden
   until the axis gains a value or the vendors answer.
3. **Whether you may draft trustee notes to spec for my approval**, the way the
   C4 and microcopy strings were made, with me supplying the flag and the
   governance claim. Unanswered so far. Until I answer, the rule stands: no
   session writes a DPIA flag, a trustee note or a verdict.
4. **Does Microsoft Copilot stay Green** given Bing web grounding sits outside
   the DPA and the EU Data Boundary by default, with an admin switch to disable
   it.
5. **C2**, the template's brand and format. The format half can be decided
   without the edited draft.
6. **F2a**, whether the homepage hero makes a checked claim or a personal one.
   The hero names eighteen tools; three are in the directory; the counter says
   four.
7. **The radar**, whether it gets its own tab or stays in `tools` with blank
   axis fields, and confirmation that the ceiling of 45 counts published rows.

Parked deliberately, do not reopen unless I raise it: widening the buyer beyond
charity, cultural and heritage. Assessed 24 Aug, not decided, and my own
conclusion was that any widening belongs on the consultancy site rather than
here.

## Standing rules

Nothing merges to `main` without my explicit sign-off. Positioning is
"charities, cultural organisations and heritage", never "values-led
organisations". Machines maintain facts and I own judgement, so no session ever
writes a DPIA flag, a trustee note or a verdict. Row ceiling 45. UK English,
contractions, no em dashes anywhere. Copy arrives as approved exact strings;
code sessions place them and never author them. Wraps update SCRATCHPAD and
sections 2 and 5 of the handover, every session.

## How this environment actually behaves, learned the hard way

- **The Drive connector is the only Sheet read path a session has.** The Sheets
  API is blocked from both the cloud sandbox and the device shell. The
  connector served a stale export once on 24 Aug, so read twice before
  reporting a cell as blank.
- **You cannot write to the Sheet.** No connector writes cells, the Apps Script
  only appends `whats_new` rows, and the browser tool that can type is not
  connected. Hand me paste-ready blocks laid out in the same column order as
  the Sheet, so I can copy G to M in one action per row.
- **Pass a tab id on every Chrome call.** Reads run against whichever tab has
  focus otherwise, which produced a round of nonsense results on 24 Aug.
- **Research agents fetch from a US IP.** They will report "no GBP published"
  for vendors that do publish sterling to a UK visitor. Re-check any price
  through Chrome on my connection before recording it. Never convert a
  currency: record the published one and say which it is.
- **Do not run git in this repo.** The device shell has no git identity and
  cannot delete its own lock files. Write files, then give me the commands to
  run, always starting with the `cd`.
- Terminal commands come to me as one complete copy-paste block, `cd` first.
