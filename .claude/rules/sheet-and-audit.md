---
paths:
  - "scripts/sheet-write.mjs"
  - "scripts/sheet-write.test.mjs"
  - "scripts/check-directory.ts"
  - "src/lib/sheets.ts"
  - ".claude/schema.md"
  - "reports/axis-*"
  - "reports/*axis-audit*"
  - "reports/*-diff.json"
  - ".github/workflows/directory-watchdog.yml"
---

# The Sheet write path and the axis audit

Loads with the files above. The hard constraints (only path, judgement split, approval format, no key) are in `CLAUDE.md`; the history of each rule is in `.claude/history/CLAUDE-md_2026-11-06.md`, sections "The Sheet write path" and "The evaluation axis".

## The script

- Run the guard tests with `node --test scripts/sheet-write.test.mjs`. `bun test` picks them up too, so the project gate's total mixes the app's suite and these guards: read the split from a run, never from a file, and when quoting the suite as evidence a gate is clean, say which side changed. They sit outside the vitest `src/**` glob deliberately, because this is a script, not the app.
- Without `--commit` the script prints a plan and sends nothing. Only `--commit` writes, and a written cell is public in seconds.
- The column guard is per tab, never a global set of letters: column I is `url` on `learning` and `trains_on_input` on `tools`, so a global set would accept "No by default" as a URL. The writable map is `WRITABLE` in the script. `learning` column A is refused as a fact because those names are composite labels Jasmin wrote, not vendor strings.
- An `approved` edit reaches every column on the four content tabs and skips the source-URL and cost-shape rules, since her approval is the source and a restructure is her call. It never reaches `whats_new` or row 1, the headers every fetcher reads by name, and legal values still apply, including Green, Amber or Red on the DPIA flag.
- Column D, cost: only a number or a currency symbol substituted inside the existing string shape may be written without approval, because the string carries editorial shape and the shape is Jasmin's. A restructured tier, renamed plan or withdrawn free tier is flagged, not written (HubSpot's 30 Aug 2026 move to seat-plus-credits is the worked example). A D write carries the old value so `costShape()` has something to compare. `shape_change` is refuse-only: true refuses the write and no value permits one.
- The four guards each stop a silent failure, so never weaken one to get a write through: every unapproved write cites a source URL (a cell with no source is an assertion); column A is re-read just before sending and one mismatch aborts the batch (`batchUpdate` addresses cells by position, so an inserted row would shift every value); every cell is re-read after writing as a receipt; a `last_checked` stamp is dropped for any row whose other writes did not land (that date is the site's claim a check happened).
- The script cannot insert or delete a row. An addition goes into the first empty row below the data on Jasmin's approval of the exact cells, with `"oldName": ""` so the script confirms the row is still blank. Retirements are by hand, and `--rollback` cannot blank a name or cost, so a written row is also removed by hand. `--rollback` replays a run backwards, matching on the post-write name so a rename can be undone.
- The Sheet's revision history cannot be read from a code session (the Drive API is not enabled on `the-edit-490220`), so a hand deletion is confirmed by Jasmin.
- Row 1 headers are read by name, and must normalise to the field names exactly, with one alias (`cost` maps to `pricing`). Renaming a header is a schema change that empties a field on the live site.
- `stripEmoji` in `src/lib/sheets.ts` applies to every text field parsed from the Sheet. Keep it in any fetcher change.
- Fetcher errors (`console.error` in each fetcher) name the HTTP status and `values/<tab>`, never the key or the request URL, which carries it.
- `isComplete()` gates on `trustee_note` and `dpia_flag` but not on `verdict`, so a row could render with an empty verdict.

## What the audit checks, and what nothing checks

- Every surface has a link checker; only `/tools` has a fact checker. Pass 1a sweeps every URL in `tools`, `my_stack`, `design_kit` and `learning`. Pass 1b and Pass 2 are scoped to published rows through `isComplete()`, a `tools` predicate, so `my_stack`, `design_kit`, `learning` and every radar row publish prices and verdicts that nothing re-verifies. `whats_new` is excluded by ruling.
- Ruled 1 Sep 2026: shrink the claim, do not extend the audit. A cheap quiet run is what gets it run at all. A per-card staleness chip on `/radar` was declined (it is true of every row, so it carries no information per card): do not reopen it as an unfinished job.
- The monthly discovery pass lives in the Cowork task alone; never re-add it to the audit prompt, because two copies drift. Pass 4 of the audit picks up the newest first-Monday run through `RemoteTrigger` and verifies each candidate in a real browser. The Cowork run's "not already listed" check cannot be trusted (through the Drive connector it sees about six rows per tab); the audit's duplicate check across all four tabs, by name and by URL without scheme, `www` or trailing slash, is the one that counts.
- The Cowork trigger (`trig_01WgEnqKWcJc2WGby5Ecn5QQ`) runs weekly on Mondays with automatic approval and no Mac required, deliberately; its prompt picks the 2nd and 4th Monday for the audit and the first Monday of the month for discovery and is quiet otherwise. Change the schedule and the prompt together or not at all.
- If the Cowork trigger's prompt is ever edited, update `reports/2026-09-01-cowork-trigger-revised-prompt.md` in the same change. The trigger fired weekly against a prompt that branched on dates, so it hit four times a year; the two drifted exactly that way.
- The 45-row ceiling is set on the directory, not on `design_kit` or `learning`; nothing enforces a ceiling on either.
- `reports/axis-policy-urls.json` is the row-to-policy map for the policy-date pass. Its trap keys are worth reading before a run: Google's `knowledge.workspace` pages carry an editorial date in the body and a site-furniture footer date that produces false drift; `www.adobe.com` and `helpx.adobe.com` refuse HeadlessChrome's default user agent and serve normally to a normal Chrome one; Canva's policy pages serve to a real browser and keep an archive.

## The directory watchdog

- `.github/workflows/directory-watchdog.yml` runs `scripts/check-directory.ts` every six hours from `main`, reads `tools` with the www referer and fails below 20 complete rows, which sends GitHub's failure email. It counts with the app's own `parseToolRows` and `isComplete`; never restate them in the script, or the two will disagree. It reads the Sheet and never writes. It catches a key that loses a referrer host, a revoked key and a renamed header, all of which empty `/tools` silently.
- Unverified: that a failed run reaches Jasmin's inbox (it depends on her GitHub notification settings). GitHub pauses scheduled workflows after 60 days without repo activity.
