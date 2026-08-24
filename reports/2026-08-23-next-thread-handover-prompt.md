# Handover prompt for the next Cowork thread

**Written 23 August 2026 at the close of the B3 session.** Paste the block
below as the opening message of a new thread. It works cold and assumes
nothing about what happened after this file was written, which is deliberate:
the two assumptions that bit this project today were both about state
somebody had recorded but nobody had checked.

---

Picking up The Edit relaunch build. The decision in force: the relaunch
finishes before October. Read these five, in order, before doing anything or
asking me anything:

1. `reports/2026-08-22-pre-october-roadmap.html`, the sequencing plan: merge
   gates, sittings, sessions, dependencies
2. `reports/2026-08-22-handover-to-relaunch.md`, the canonical state ledger;
   its section 5 statuses outrank the roadmap on status, the roadmap outranks
   it on timing
3. `reports/2026-08-23-axis-locked.md`, the frozen evaluation axis, locked 23
   Aug. It supersedes audit section 3 on every allowed value, definition,
   toggle rule and chip colour. Where it and CLAUDE.md disagree on a field
   name or column position, CLAUDE.md wins; on values and definitions, this
   file wins
4. `.claude/CLAUDE.md`, operational source of truth, outranks all of the
   above on anything technical
5. `SCRATCHPAD.md`, running session log; the 22 and 23 Aug notes cover
   everything recent

Approved exact strings live in two files and nowhere else:
`reports/2026-08-22-copy-pack-addendum.md` (the two C4 CTA strings, the B4b
metas, the B6 decision) and `reports/2026-08-23-copy-pack-b3-microcopy.md`
(the twelve card and filter strings). If a surface needs a string that is not
in one of those, it does not exist yet and I write it with you, never a code
session.

**Where things stand.** A1 is locked and A2's headers are in. B3 is built on
`overhaul/sector-axis` in eight commits, `54e8a6a` through `aabc6f2`, suite at
56. E1 is confirmed flag-only. Everything else in handover section 5 is open.

**The honest read on B3.** The code is trustworthy and the tests hold the
rules that matter, particularly `Varies by tier` failing the training toggle.
What is not yet earned is the claim that it works against the real Sheet:
every browser check ran against a throwaway fixture, because no row passed the
completeness predicate at the time. Closing that gap is a checklist run, not a
rebuild. Do not re-open B3.

**The seed rows are the single gate on everything.** Until four rows carry all
seven axis fields, the directory renders empty, the counter reads 0, and the
B3 checklist cannot run, which means F2 cannot be signed off no matter how
much other work lands. Verify this in the Sheet yourself rather than trusting
any status line, including this one.

**Two tracks run from here** and they only converge at the relaunch check. The
axis track is seed rows, then re-verifying B3 against real data, then A3
triage, A4 fact research, and the A5 and A6 judgement sprint. The capture
track is C1 the template edit, C2 the brand and format decision, and C3 the
gated Substack post. **C3 is Gate 2 and nothing has started on it,** so treat
the capture track as the likeliest thing to become the critical path, not the
axis work.

**Hold in mind throughout:** nothing merges to `main` without my explicit
sign-off; the positioning is "charities, cultural organisations and heritage",
never "values-led organisations"; machines maintain facts and I own judgement,
so no session ever writes a DPIA flag, a trustee note or a verdict; the row
ceiling is 45; UK English, contractions, no em dashes anywhere. Project memory
holds the measurement false-alarms rule: reproduce any surprising sandbox or
dev-server reading from a neutral context before acting on it, and the same
caution applies to positive results from synthetic fixtures.

**Still undecided and mine to call:** the template's brand and format (C2),
whether the Substack re-points and which side gives on the cadence
contradiction (D2 and D3), and whether the homepage hero makes a checked claim
or a personal one (F2a). A paid tier is deliberately deferred to the new year.

**First job:** tell me the true current state of the Sheet and the branch,
then recommend which of the two tracks I should spend my next sitting on and
why. Tell me what you are starting, what it depends on, and what you need from
me before you can begin. Do not start work in the same message as the summary.
