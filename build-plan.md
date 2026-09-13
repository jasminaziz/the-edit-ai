# build-plan.md: the site map build

**The contract for branch `design/site-map`, opened 13 September 2026.** The
site agents read this file by name: `site-build-partner`, `site-stranger`,
`site-gates` and `site-reviewer` all treat it as the plan. It is **live**, so
update the Status column in the same commit that finishes a step.

The reasoning lives in three reports and is not restated here:

1. `reports/2026-08-28-positioning-statement.md`, "Who it's for": the reader
   profile. Canonical, and assumption on its own face.
2. `reports/2026-09-13-sitemap-proposal-judgement.md`: Jasmin's read of the
   boards and the seven things to settle.
3. `reports/2026-09-13-sitemap-build-plan.md`: the code session's answer. It
   holds the live-data facts, the costs, the findings and the hub label
   shortlist.

Where this file and those reports differ on **status or order**, this file
wins. On **reasoning**, the reports win. This file exists only on
`design/site-map`; there is deliberately no copy on `overhaul/sector-axis`.

---

## Start of every build session

1. **Work in `~/Developer/the-edit-ai-site-map`**, the worktree on
   `design/site-map`. Never build in `~/Developer/the-edit-ai`: Cowork and other
   sessions share that tree and its checked-out branch. Before the first
   commit, confirm `git rev-parse --show-toplevel` and
   `git rev-parse --abbrev-ref HEAD`.
2. **Read**, in this order: this file, the three reports above, and
   `tasks/lessons.md`. `.claude/CLAUDE.md` loads by itself.
3. **Sync:** `git fetch origin`, then compare `HEAD` with
   `origin/design/site-map`. Pull if another session pushed.
4. **Find the current step** in the Status table and check its blockers
   against the rulings list. A step whose string has not arrived does not
   start.

## Rules for this build

- **One job per commit.** The gate before every commit is `bunx tsc --noEmit`,
  `bun test` and `bun run build`, showing each command's own tail. Read the
  test split from the run; it was 96 passing at branch creation.
- **Push `HEAD:design/site-map` explicitly**, then confirm with
  `git rev-parse origin/design/site-map`. Never push `main` or
  `overhaul/sector-axis` from this worktree. **Nothing merges to `main`
  without Jasmin's explicit sign-off.**
- **No visitor-facing copy is authored or improvised.** The strings this build
  needs are listed under Rulings. A placeholder may appear in a local render,
  never in a commit that could ship.
- **Review surfaces.** Vercel previews are SSO-protected and carry no Sheets
  data: the key is absent from the Preview environment and the production key
  is referrer-locked (per CLAUDE.md, not re-checked on 13 Sep). Steps 1 to 3
  can be reviewed on the preview. Step 4 is reviewed through localhost renders,
  using the tooling below.
- **Measurement** follows the global CLAUDE.md rules. In particular:
  - pump `requestAnimationFrame` for anything on the hero;
  - assert the viewport width inside the measurement;
  - below 500px, use Playwright's viewport emulation, not a headless
    `--window-size`;
  - check an ancestor's opacity before capturing anything inside a reveal
    wrapper.
- **One dev server at a time on 8080**, because the localhost key is
  restricted to that port. `.env.local` was copied into this worktree.

## The agent team

| Agent | When in this build | Brief it with |
|---|---|---|
| `site-build-partner` | Before each step starts, whenever scope moves, and when a fix has failed twice | The proposed change and the step number. It checks against this file and parks new scope in the backlog below |
| `site-stranger` | Step 0 (baseline), and again after step 4 | **Screenshots, not a URL.** The site serves an empty shell to anything that doesn't run JavaScript, so its fetch sees `<div id="root">` and nothing else. Hand it first-viewport PNGs at 390 and 1280 plus the rendered text, and frame it with the profile's first-screen rule |
| `site-copywriter` | Only when Jasmin asks, for the strings under Rulings | It writes proposals to `reports/copy-proposals-*.md`. A string reaches code only after Jasmin approves it |
| `site-design-check` | After steps 3, 4a and 4b | Tell it the locked spec is the "Design system (locked)" section of `.claude/CLAUDE.md`, and give it PNGs, because it reads source and cannot render |
| `site-gates` | Before asking Jasmin to merge | The route list. The points to watch are two labelled nav landmarks, `aria-current`, contrast on the new surfaces, and the homepage chunk once `ToolCard` joins it |
| `site-reviewer` | When a cause is unclear or a fix has failed three times, and once over the whole branch before the merge request | The step and the symptom |
| `site-steward` | Change mode, from `/wrap`, after the merge | Its skill brief. Note that step 1's checks line is a claim living on four surfaces, so the private claims register needs an entry, and the register is Jasmin's |

Not needed, and why:
- `site-security`: the build adds no API, key or data path.
- `site-geo`: no crawlable content changes until `geo/prerender` lands.
- `site-planner`: this file is the plan.

## Status

| # | Step | Blocked on | Done when | Status |
|---|---|---|---|---|
| 0 | Stranger baseline of today's first viewport, production, at 390 and 1280. No code; propose nothing | nothing | Report in `reports/` says what a beginner meets before scrolling | **done 13 Sep**: `reports/2026-09-13-stranger-first-viewport-baseline.md`; captures kept in the review folder |
| 1 | The checks line on `/learning`, `/design-kit`, `/ai-news` and `/my-stack`: one shared string rendered by `CobaltZone`, the four pages pass a flag, `/radar` keeps its own | Rulings 2 | Renders on all four at 375 and 1280 on a cold direct load; the claims register updated by Jasmin | not started |
| 2 | `?job=` on `/tools`: match by `toSlug` against `CATEGORIES`, set the chip, scroll it into view in the rail; an unknown value loads normally; tests for the matcher | nothing | Verified at 360, 768 and 1280 on a cold load, the last chip included | **done 13 Sep**: 15 cases on the dev server, cold Playwright loads, chip inside the rail and grid filtered each time; fonts re-centre proven; `?tool=` unaffected |
| 3 | Nav and hub: three tabs plus the hub; the second row on hub routes; a grouped drawer; the phone second row; both "Get the template →" links out of the chrome; labelled landmarks; `aria-current` | Rulings 1 and 7 | Measured at 375, 1040 and 1280; the pill is correct on every route; the CLAUDE.md nav block and link inventory rewritten in the same set of commits | not started |
| 4a | Homepage order (hero, checks, About, template, Go further). The checks strip reuses `ToolCard` unchanged, on the card rule; desktop row, phone sideways rail; the template block moved up with `FooterEmailCapture` skipped on `/`; compact Go further on phone | Steps 2 and 3; Rulings 3, 5 and 6 | Page length measured and reported against today's 1,834 (1280) and 2,139 (390) | not started |
| 4b | Hero: desktop wordmark on a clamp with a px cap; the proposition above the pills layer; DragHint re-anchored; 640 to 1023 designed; the phone untouched | Ruling 4 | Measured at 1024, 1280, 1440 and 1920 and at 640 to 1023; the pile measured over several runs with rAF pumped; CLAUDE.md hero rulings rewritten, not carried | not started |
| 5 | AI News re-point (E3): the Routine's prompt, not this repo's code | Jasmin | Outside this build | not started |

Steps 0 and 2 can start at once. Costs are in the plan report; about four days
of session time in all.

## Rulings needed from Jasmin

1. **Hub label**, from the shortlist in the plan report; which page the tab
   lands on (recommended: My Stack); and whether `/learning` stays in the hub.
2. **The checks line**, one string for four pages, and whether My Stack's
   existing "The tools directory is the recommended list." stays beside it.
3. **The checks-strip heading**: approve the `/tools` line for the homepage, or
   write the homepage its own.
4. **The hero line.** The About panel is canonical and the hero varies,
   settled on the 29 August precedent.
5. **The card rule.** Recommended: the two most recently checked non-Red
   rows, then the most recently checked Red.
6. **The AI News tile**: off the new homepage until the re-point
   (recommended).
7. **Reopening the 13 September nav ruling**, which signing off step 3 does.

These are content questions, not code, and are raised in the plan report:
- the thin jobs (Appeals & fundraising and Translation, two complete tools
  each);
- `/learning`'s mix of builder and beginner material;
- `/submit`, which is linked from nowhere.

## Open, outside this build

- **`main` is behind.** It trails `overhaul/sector-axis` by the 13 September
  doc commits, which touch no served file. Check with
  `git log origin/main..overhaul/sector-axis`, and level it only on Jasmin's
  say-so.
- **A Sheets key for Preview** would let step 4 be reviewed on a preview, and
  would also unblock `geo/prerender`. It is a console decision, and it is
  Jasmin's.
- **Consequences-list items 2, 3, 6 and 8**, and the end-of-October evidence
  read with the `/policy-template` title tripwire.

## Review tooling

`~/Developer/the-edit-ai/.superpowers/site-map-boards/` holds the 13 September
boards, the mock HTML they were built from, the live captures in `cap/`, and
the Playwright scripts. The folder is git-ignored and local to this Mac.

- `capture*.mjs` and `cap-about.mjs` need the dev server running on 8080.
- `render.mjs` and `render-boards.mjs` render the local HTML and refuse to
  write if a font is missing, an image is broken or the page overflows
  sideways.

The scripts were written for a one-off, so they are starting points rather than
tools: read one before running it.

## Backlog (parked, not this build)

- The Agent & Skill Workshop, Field Notes, and the budget stacks (13 September
  brief). They become tabs in the hub once they exist.
- Per-route share cards, when `geo/prerender` lands.
- **`?job=` and `?tool=` in one link**, found at step 2. If the tool does not
  carry that job, the job filter removes its card and the tool link does
  nothing. Nothing generates such a link, so it is not fixed.
- **The last chip sits under the rail's edge fade at the end of the scroll**
  below `lg`. Pre-existing for anyone scrolling to the end, and now also where
  `?job=translation` lands. The label stays readable; the fade is a design
  choice recorded in CLAUDE.md, so it is Jasmin's to change.
