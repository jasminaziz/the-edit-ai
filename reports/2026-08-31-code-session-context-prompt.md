# Code session context prompt

Written 31 August 2026, after the launch wrap. Paste the block below at the
start of a new Claude Code session in `~/Developer/the-edit-ai`.

It is deliberately short. `.claude/CLAUDE.md` loads automatically in that
folder and was corrected on 31 August, so it is accurate on its own. This
prompt carries only what a file cannot know: the state of the working tree on
the day, and the branch answer.

---

## The prompt

```
Read .claude/CLAUDE.md and SCRATCHPAD.md before doing anything. Both were
corrected on 31 August; the pre-launch framing that used to be in them is gone.

Three things that are true and easy to get wrong:

1. The site is LIVE. The overhaul launched 30 August. main is the live site and
   Vercel deploys it, so anything pushed is public in about three minutes. The
   old "nothing merges to main before F2" rule is spent. The three-command gate
   is what protects production now: bunx tsc --noEmit, bun test, bun run build,
   all three, before every commit.

2. main and overhaul/sector-axis are the same commit with no diff between them.
   Work on main. Confirm with git rev-parse --abbrev-ref HEAD, and tell me if
   you ever find the two diverged rather than quietly picking one.

3. A parallel session works in this same folder. As at 31 Aug there are 17
   uncommitted files: sixteen in reports/ plus .github/workflows/
   whats-new-watchdog.yml. None of them are yours to commit. Surface them and
   name them one by one; I rule on each. If a .git/index.lock blocks you,
   verify it is stale first (0 bytes, no git process holding it, .git/index
   intact) and move it aside rather than deleting it.

Two standing rules that bite hardest now: Sheet edits go live immediately with
no deploy and no review, because main runs the header-based fetcher. And never
write dpia_flag, trustee_note or verdict, in code or automation. Those are mine.

The job this session is: <task>
```

---

## Filling in `<task>`

For the axis audit, point at the file rather than re-describing it:

> Read `reports/2026-08-31-axis-audit-claude-code-prompt.md` and follow it.
> Answer its three open decisions with me before running anything.

That file is **untracked**, so it exists only on this machine and is not on
GitHub. It was written by a parallel session that was still working when this
was drafted, so check it has not moved before relying on it.

---

## The three decisions that prompt is blocked on

Quoted from its own opening section. None can be answered by a code session;
all three are Jasmin's.

1. **`my_stack` writable columns.** Its column is `pricing`, not `cost`, and
   the write boundary is written for `tools`. Report-only, or its own named
   writable set? Undefined means the script refuses the write, which is safe
   but useless.
2. **The rulings file.** Four mapping disagreements came out of the 30 August
   run (Grok, Gemini, Notion, Gamma). Without somewhere to record "this is
   settled", they regenerate every run. Does she want `reports/axis-rulings.md`?
3. **Does the 45-row ceiling cover `design_kit` and `learning`?** `design_kit`
   is already at 46 rows. If the ceiling applies, the monthly discovery job
   must propose swaps, not additions.

**Note on decision 2:** `reports/axis-rulings.md` already exists on disk, 78
lines, untracked, written by the parallel session. So either the decision was
taken outside that document, or the file was built in anticipation of a yes.
Worth resolving before a session reads both and treats the question as open.
