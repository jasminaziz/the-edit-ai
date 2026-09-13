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
| 1 | The checks line on `/learning`, `/design-kit`, `/ai-news` and `/my-stack`: one shared string rendered by `CobaltZone`, the four pages pass a flag, `/radar` keeps its own | nothing: string approved 13 Sep | Renders on all four at 375 and 1280 on a cold direct load; the claims register updated by Jasmin | **built 13 Sep**, verified on 12 cold loads (four pages plus `/radar` and `/tools` as controls), in the first screen on every page at both widths. **Not done until Jasmin adds the claims register entry** |
| 2 | `?job=` on `/tools`: match by `toSlug` against `CATEGORIES`, set the chip, scroll it into view in the rail; an unknown value loads normally; tests for the matcher | nothing | Verified at 360, 768 and 1280 on a cold load, the last chip included | **done 13 Sep**: 15 cases on the dev server, cold Playwright loads, chip inside the rail and grid filtered each time; fonts re-centre proven; `?tool=` unaffected |
| 2b | Rail end spacing below `lg`, so the last chip clears the 40px edge fade at the end of the scroll. Ruled 13 Sep | nothing | Translation clear of the fade at 360 and 768 on `?job=translation`; nothing changes from 1024 up | **done 13 Sep**: the 15 step 2 cases re-run, Translation clear of the fade at 360 and 768, every 1280 figure unchanged |
| 3 | Nav and hub: three tabs plus the hub; the second row on hub routes; a grouped drawer; the phone second row; both "Get the template →" links out of the chrome; labelled landmarks; `aria-current` | nothing: rulings 1 and 7 settled 13 Sep | Measured at 375, 1040 and 1280; the pill is correct on every route; the CLAUDE.md nav block and link inventory rewritten in the same set of commits | not started |
| 4a | Homepage order (hero, checks, About, template, Go further). The checks strip reuses `ToolCard` unchanged, on the card rule; desktop row, phone sideways rail; the template block moved up with `FooterEmailCapture` skipped on `/`; compact Go further on phone | n/a | n/a | **dropped 13 Sep**: the homepage keeps today's layout and section order, on Jasmin's ruling. Rulings 3 and 5 fall with it |
| 4b | Hero, desktop only, redefined 13 Sep: today's layout kept; the hero stops being full-height and the wordmark is sized by the smaller of width and height (rendered as `min(28vw,39vh)` and `min(38vw,53vh)`), so the About heading and the sector sentence reach the first screen; the pills still fall across the type; the full stop of "Edit." clear of the pile; DragHint still points at the pile; 640 to 1023 checked; the phone untouched | nothing | Measured at 1024, 1280, 1440 and 1920 and at 640 to 1023, with the sector lines in view reported against the render (3 of 5 at 1280, 4 at 1440, 5 at 1920); the pile measured over several runs; CLAUDE.md hero rulings rewritten, not carried | not started |
| 6 | `/submit` out of `sitemap.xml`; the route stays. Ruled 13 Sep | nothing | The sitemap lists every live route except `/submit`, checked both ways against `App.tsx`; `/submit` still renders | not started |
| 5 | AI News re-point (E3): the Routine's prompt, not this repo's code | Jasmin | Outside this build | not started |

Order from 13 September: 1, 2b, 6, 3, 4b. With 4a dropped the build is about
two and a half days of session time.

## Rulings, settled 13 September 2026

All seven were ruled through the question tool on 13 September, with the
options and trade-offs on screen. Where a ruling departs from the plan report,
this list wins.

1. **Hub label: "How I work"**, landing on **My Stack**, with `/learning`
   inside the hub. The label came from the one-off shortlist.
2. **The checks line: "This page hasn't been through the checks. Everything on
   Tools has."** (candidate B1 in `reports/copy-proposals-2026-09-13-checks-line.md`).
   My Stack's "The tools directory is the recommended list." comes out, because
   the line now does that job on all four pages. The question noted that
   "Tools" can link to `/tools`; the link was not ruled on separately, so it is
   built and shown on the preview for sign-off.
3. **The checks-strip heading: moot.** No checks strip is being built.
4. **The hero line: moot.** The homepage keeps its layout, and the fix is to
   bring the existing About heading and sector sentence into the first screen,
   not to add a new line. Jasmin chose the capped wordmark from a rendered
   board of three options (today, padding trimmed, wordmark capped) at 1280,
   1440 and 1920, knowing it overrides her "full-screen wordmark" must-keep on
   laptops.
5. **The card rule: moot**, with 4a dropped. Found while pricing it, and worth
   keeping: `last_checked` is a date only and the audit stamps in batches, so
   "most recently checked" is mostly decided by row order in the Sheet.
6. **The AI News tile stays** while today's layout stays. The earlier "off"
   answer applied only to the rebuilt homepage.
7. **The 13 September nav ruling is reopened** and step 3 goes ahead.

**The homepage was reopened by Jasmin on 13 September** ("can the homepage not
stay a similar layout to what it is now?"). Step 4a and the plan report's
homepage order (its point 6) are superseded. Her must-keeps: the pills falling
across the type, and the full-screen wordmark, overridden on laptops by her own
hero choice above.

Also ruled the same day: `/submit` comes out of the sitemap (step 6), and the
rail gets end spacing (step 2b).

Still open, and content rather than code:
- the thin jobs (Appeals & fundraising and Translation, two complete tools
  each);
- `/learning`'s mix of builder and beginner material.

## Open, outside this build

- ~~**`main` is behind.**~~ Closed: checked 13 September, `origin/main` and
  `origin/overhaul/sector-axis` are the same commit.
- **A Sheets key for Preview** would let step 4b be reviewed on a preview, and
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
- ~~**The last chip sits under the rail's edge fade.**~~ Ruled and fixed 13 Sep
  as step 2b.
