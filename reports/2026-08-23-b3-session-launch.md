# B3 session launch guide

**The Edit · ToolCard and filters · Claude Code on the Mac, 23 August 2026**

Everything B3 was blocked on is now cleared: the axis is locked, the Sheet
headers are in, the seed rows are yours to add tonight, and the twelve
microcopy strings are approved and banked. This is the last big code block
before the relaunch check.

---

## 1 · Terminal

Two tabs.

**Tab 1, dev server:**

```bash
cd ~/Developer/the-edit-ai && bun run dev
```

Serves on `http://localhost:8080`. Open it before you start. Data will 403
unless `.env.local` holds the localhost-scoped key, which B1 created.

**Tab 2, Claude Code:**

```bash
cd ~/Developer/the-edit-ai && claude
```

**Repo identity check, before any git command in the session:**

```bash
git rev-parse --show-toplevel   # must print /Users/jasminaziz/Developer/the-edit-ai
git rev-parse --abbrev-ref HEAD # must print overhaul/sector-axis
```

If the branch is anything else, stop and `git checkout overhaul/sector-axis`
before touching a file.

**Housekeeping before you start.** There are four uncommitted doc changes
from tonight's Cowork session and a `_to_delete/stale-git-locks/` folder that
can be binned:

```bash
git add -A && git commit -m "docs: amend the axis with Other, gate F2 on A4"
rm -rf _to_delete
```

---

## 2 · First message to paste

> Read these four files from this project before doing anything else, in this
> order: `.claude/CLAUDE.md`, `reports/2026-08-23-axis-locked.md`,
> `reports/2026-08-22-handover-to-relaunch.md` and `SCRATCHPAD.md`. Also read
> `tasks/lessons.md`.
>
> Confirm back to me: which project this is, which branch you are on, what
> the current state of the branch is, and what the locked evaluation axis
> says. Do not touch a file until you have done that.
>
> Two standing rules that override anything you might infer. Nothing merges
> to `main` without my explicit sign-off, and you never author
> visitor-facing copy: approved strings arrive from the copy packs and you
> place them verbatim. If a UI state needs a string that is not in
> `reports/2026-08-23-copy-pack-b3-microcopy.md` or
> `reports/2026-08-22-copy-pack-addendum.md`, stop and ask me rather than
> writing one.
>
> Today's focus: task B3, the ToolCard and filters session.

---

## 3 · First task prompt

Paste this once Claude Code has confirmed the state.

> Read `src/components/ToolCard.tsx`, `src/pages/Tools.tsx`,
> `src/lib/sheets.ts` and `src/pages/Index.tsx`. We are building B3. Before
> writing any code, show me your plan: what you will change in each file, in
> what order, and where each approved string lands.
>
> **Scope, in the order I want it built.**
>
> 1. **A completeness predicate in `src/lib/sheets.ts`,** exported and
>    tested. A row is complete when all seven axis fields hold a non-empty
>    value: `jobs`, `data_location`, `trains_on_input`, `nonprofit_tier`,
>    `dpia_flag`, `trustee_note`, `last_checked`. `None` counts as a value,
>    blank does not.
>
> 2. **The grid renders complete rows only.** Incomplete rows do not appear
>    anywhere in the directory.
>
> 3. **The homepage counter uses the same predicate.** `src/pages/Index.tsx`
>    currently counts rows with a non-empty `last_checked` (line 37, commit
>    `f514b0a`). Replace that with the shared predicate so the number and the
>    grid can never disagree. Do not touch the caption, which is approved
>    copy.
>
> 4. **Axis fields on the ToolCard.** Jobs as chips. The DPIA flag as a
>    text-labelled chip, never colour alone. Nonprofit pricing as a
>    highlighted line. The trustee note inside the expanded verdict. The
>    checked date on the card. Labels come from the microcopy copy pack
>    exactly as written.
>
> 5. **`CATEGORIES` becomes the six comms jobs** with contains-matching, not
>    equals, because a tool can hold more than one job.
>
> 6. **Three sector toggles above the grid,** with the pass rules exactly as
>    the locked axis spec defines them. Do not invent or widen a rule.
>
> 7. **Place the two C4 strings** from
>    `reports/2026-08-22-copy-pack-addendum.md`: the in-grid template card
>    after the first six tool cards, and the line beneath every Amber or Red
>    DPIA chip. Both link to `/policy-template`. The CTA label stays
>    identical to the nav and footer.
>
> 8. **Correct the stale comment** on `last_checked` in `src/lib/sheets.ts`
>    line 16. It says `e.g. "Oct 2026"`; the locked format is `DD MMM YYYY`.
>
> **DPIA chip colours, exact.** Text and border in the same hex on a tint
> background, 1px border. Green `#2D6A4F` on `#E4F0E9`. Amber `#7A5200` on
> `#FAF0DB`. Red `#A8261C` on `#FBE9E6`. These are AA-verified against both
> the white card and the cream ground. Do not substitute, do not use forest
> green as a solid fill here, and never use electric lime `#C8F04A` as a
> badge or category colour.
>
> **Do not touch:** `index.html` and its static OG block, `SEO.tsx`,
> `src/pages/Subscribe.tsx`, `StatusBadge.tsx` or any other dead code marked
> for the B7 sweep, and anything on `main`. Never write a verdict, a
> `dpia_flag` or a `trustee_note`. Never run `npm install` or
> `npm audit fix`; `bun.lock` is canonical.
>
> **Verification before each commit:** `bunx tsc --noEmit` clean and
> `bun test` green, then check it in the browser at `localhost:8080`. The
> Sheet holds four seeded rows and one deliberately blank keeper, Descript,
> which must not render. Confirm the toggles filter correctly and that the
> counter matches the number of cards on screen.
>
> **Commits:** one job per commit, on `overhaul/sector-axis` only. Nothing
> merges to `main`.

---

## 4 · Cheat sheet

| | |
|---|---|
| **Project** | The Edit, theeditai.co.uk. Opinionated AI tools directory for comms teams in charities, cultural organisations and heritage |
| **Directory** | `~/Developer/the-edit-ai` |
| **Branch** | `overhaul/sector-axis`. Never `main`. Two commits ahead of remote before tonight's doc commit |
| **Remote** | github.com/jasminaziz/the-edit-ai |
| **Dev server** | `bun run dev`, `http://localhost:8080` |
| **Package manager** | bun. Never npm |
| **Read at session start** | `.claude/CLAUDE.md`, `reports/2026-08-23-axis-locked.md`, `reports/2026-08-22-handover-to-relaunch.md`, `SCRATCHPAD.md`, `tasks/lessons.md` |
| **Approved strings** | `reports/2026-08-23-copy-pack-b3-microcopy.md` (twelve card and filter strings), `reports/2026-08-22-copy-pack-addendum.md` (two C4 CTA strings) |
| **Frozen axis** | `reports/2026-08-23-axis-locked.md`. Outranks audit section 3 on every value, definition, toggle rule and chip colour |
| **Sheet** | `1RIO-WY9H75gML_UgdQbHGgDl-R0MfaG3CRPUp3PtAUI`, `tools` tab, headers A to M, seeded rows Canva, ChatGPT, Microsoft Copilot, DeepSeek, plus Descript left blank on purpose |
| **Test commands** | `bunx tsc --noEmit && bun test`. Suite was 24/24 before this session |

**Wrap before closing.** Update `SCRATCHPAD.md` with the session note and
sections 2 and 5 of the handover. If anything in the axis spec turned out to
be wrong or unbuildable, say so in the wrap rather than working around it
quietly: the spec is locked, but it is locked so it can be amended
deliberately, not so it can be ignored.

**After B3 lands,** the remaining path is A3 triage, A4 fact research, the
A5 and A6 judgement sprint, the C1 to C3 capture track, the admin hour, then
F2 and the merge with sign-off.
