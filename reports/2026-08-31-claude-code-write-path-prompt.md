# Write path and next steps

Rewritten 31 August 2026, replacing the first version of this file. The first
version led with a claimed outage in the news pipeline. That was wrong and is
withdrawn. Correction first, then the real work, ordered.

---

## Part 1. Correction

**The news pipeline is working.** It has been throughout. Last append 29 August
2026, the live `/whats-new` page is fine, and the alerting is behaving as
designed.

How the error happened, because it is a trap that will recur:

The whole workbook was read in one call through the Google Drive connector.
That read is **truncated**: it stops at 275,482 characters, mid-table, with no
trailing newline. The connector warned that content may be incomplete for
large files, and that warning was ignored. `whats_new` is the last tab in the
workbook, so truncation eats its newest rows first, and the cut landed on 4
August. Every row from 5 to 29 August was simply missing from what was read.

Also withdrawn: the claim that the Apps Script deployment returns 404. That
came from a WebFetch against a `script.google.com/exec` URL. Google blocks
automated fetchers on those URLs. A negative fetch is not evidence of absence.

**What survives.** The axis audit findings stand. The `tools` tab occupies
characters 13,840 to 58,758 of that read, nowhere near the truncation point,
and its row numbering was independently verified against the fifteen cell
references in `reports/2026-08-28-sheet-edit-pack.md`. The Make scenario state
was read directly through the Make API, not the Drive connector.

**Rule going forward:** `whats_new` freshness can never be judged from a
whole-workbook Drive read. The `tools` tab can.

---

## Part 2. The one real fix: stop the weekend false alarms

You already read these alerts correctly. The problem is that they cry wolf
twice a week, which is what makes a real one easy to miss.

**Why it fires.** The Rundown publishes Monday to Friday. The Routine runs
daily at 08:05 UTC and reads the *previous* day's email, stamping rows with the
run date. So appends land Tuesday through Saturday. Sunday and Monday have no
email to process and correctly produce nothing. The watchdog asks every day at
12:00 whether an append succeeded in the last 26 hours, so on Sunday and
Monday the honest answer is no.

**Verified against your actual alerts:** nine of the ten fell on a Sunday or
Monday. Five Sundays, four Mondays. The single Wednesday one, 19 August, was a
different workflow (`Append whats_new rows`) failing once and recovering.

**The fix is one line.** Only ask on days an append should have happened.

In `.github/workflows/whats-new-watchdog.yml`:

```yaml
on:
  schedule:
    - cron: '0 12 * * 2-6'  # Tue-Sat only. The Rundown publishes Mon-Fri and
                            # the Routine processes the previous day's email,
                            # so appends land Tue-Sat. Sun and Mon have nothing
                            # to check and were the source of every false alarm.
  workflow_dispatch: {}
```

Keep the 26-hour window exactly as it is. Widening it to cover the weekend
would blind the watchdog to a genuine two-day outage midweek, which is the one
thing it exists to catch.

Copy-paste block:

```
cd ~/Developer/the-edit-ai
git checkout overhaul/sector-axis
# edit .github/workflows/whats-new-watchdog.yml, change the cron line to '0 12 * * 2-6'
git add .github/workflows/whats-new-watchdog.yml
git commit -m "Watchdog: run Tue-Sat only, ending the Sunday/Monday false alarms"
```

One caveat worth knowing: the workflow has to be on `main` for GitHub to
schedule it. Scheduled workflows only run from the default branch. So this is
the rare change that has to reach `main` to take effect, and it needs your
sign-off to get there.

---

## Part 3. What is actually true

| Thing | State |
|---|---|
| `whats_new` daily pipeline | Working. Appends Tue-Sat. Leave it alone. |
| Watchdog | Working, but noisy on Sun/Mon. One-line fix above. |
| Live site | Working. Reads the Sheet at runtime, so Sheet edits are live with no deploy. |
| Axis audit, 30 Aug run | Done. Seven judgement items waiting on you. |
| Axis audit write path | Does not exist. Make scenario `6908270` never built. |
| Column D checks | Cannot be done from the cloud. Nine of 23 rows had an unreachable field. |
| `isComplete()` mismatch | The audit predicate is stricter than the site's. Latent, no row affected yet. |

---

## Part 4. Next steps, in order

**1. Fix the watchdog cron.** Ten minutes. Ends two false alarms a week and
makes the next real one legible. Needs a merge to `main` to take effect.

**2. Clear the seven judgement items** from `reports/2026-08-30-axis-audit.md`.
Only you can do these. Roughly in order of consequence:
   - Adobe Express (row 29): the row points at Firefly and reads as two
     products. Decide which it is.
   - HubSpot (row 3): new nonprofit programme excludes the UK. Writing it into
     column J moves a Red row into the "Has nonprofit pricing" filter.
   - Seedance (row 49): the verdict names servers in the US, Singapore and
     Malaysia and the current vendor policy names no country at all. What was
     your 28 August source?
   - NotebookLM (row 40): Google renamed it Gemini Notebook on 16 July.
   - Google Workspace AI (row 61): Gemini Notebook sits outside org
     data-region settings, which touches the Green trustee note.
   - Notion (row 65) and Gamma (row 62): both mapping calls, lower stakes.

**3. Set up the service account** so Claude Code can write the Sheet. Fifteen
minutes, done once, listed in Part 5.

**4. Run the bootstrap prompt.** Builds `sheet-write.mjs` with the write
boundary enforced in code, plus an `/axis-audit` slash command. This is the
step that fixes column D: fetching from your Mac gets GBP pricing from
geo-priced vendors, and the Playwright already in the repo reads the
JS-rendered pricing pages. Seven of the nine unreachable fields become
reachable.

**5. Retire Make.** No urgency. Disable scenario `6908270` once the Claude Code
path has three clean runs. Nothing depends on it and it has never written to
`tools`.

**Not on this list, deliberately:** anything touching `whats_new` beyond step
1. It works, it runs unattended daily, and it must keep running when your Mac
is shut. Claude Code is the wrong home for it.

---

## Part 5. The bootstrap

### Before you run it

Writes need a Google service account. The API key in `.env.local` is
referrer-locked to theeditai.co.uk.

1. Google Cloud console, enable the Google Sheets API.
2. Create a service account. No project-level roles needed.
3. Create a JSON key and download it.
4. `mkdir -p ~/.config/the-edit && mv ~/Downloads/<key>.json ~/.config/the-edit/sheets-sa.json && chmod 600 ~/.config/the-edit/sheets-sa.json`
5. Open the Sheet, Share, paste the service account's `client_email`, give it
   **Editor**, untick notify.

### The prompt

```
You are setting up the Sheet write path for The Edit (theeditai.co.uk). Read
.claude/CLAUDE.md, .claude/schema.md and reports/2026-08-30-axis-audit.md
before you start. Work on overhaul/sector-axis.

CONTEXT
The directory's facts live in Google Sheet
1RIO-WY9H75gML_UgdQbHGgDl-R0MfaG3CRPUp3PtAUI, tab "tools", columns A-N. The
site reads the Sheet at runtime, so a Sheet write is live immediately with no
deploy and no merge. A service account key is at
~/.config/the-edit/sheets-sa.json with Editor on the Sheet.

Do not touch the whats_new tab or anything in .github/workflows. That pipeline
works and is out of scope.

THE WRITE BOUNDARY. This is the whole point of the task.
Writable by machine: D cost, H data_location, I trains_on_input,
J nonprofit_tier, M last_checked.
Never writable by machine, by any route: A name, B category, C status,
E verdict, F url, G jobs, K dpia_flag, L trustee_note, N what_it_does.
E, K and L are Jasmin's judgement. The site's entire value is that a named
person wrote them. Building a write for any other column is an abort, not a
warning.

BUILD ONE: scripts/sheet-write.mjs
The only path that ever writes to the Sheet. Node, googleapis package.
- Takes a JSON file of proposed writes: [{row, column, oldValue, newValue,
  source, checkedDate}].
- Rejects, non-zero exit, any column outside D/H/I/J/M. Rejects any range
  spanning more than one column or row. Regex the constructed A1 range against
  ^tools![DHIJM][0-9]+$ and refuse anything else. Fail closed.
- Validates before sending. H exactly one of: UK, EU, EU option, US, Your
  tenant, Other, Unclear. I exactly one of: No, No by default, Yes unless you
  opt out, Yes, Varies by tier. J non-empty (blank un-publishes a row; the
  word None is a finding, blank is unfinished work). M matches DD MMM YYYY.
- Requires --commit. Default is dry run: print the full diff, exit 0, touch
  nothing.
- Immediately before sending, re-read column A and confirm the tool name at
  every target row matches the name the write was computed for. Abort the
  ENTIRE batch on any single mismatch. batchUpdate addresses cells by
  position, so a row inserted between read and write silently corrupts it.
- After sending, re-read the written cells and confirm they hold the new
  values. Print a receipt: row, column, old, new, source, confirmed y/n.
- Never write M for a row whose other write did not land. That date is the
  site's claim a check happened; it is earned, not scheduled.

Write tests for the guards specifically. I want a test proving an E-column
write is refused, and one proving a name mismatch aborts the whole batch
rather than just the offending row.

BUILD TWO: .claude/commands/axis-audit.md
A slash command that runs the fortnightly audit.
- Read the tools tab and compute the published set every run. A row is
  published when jobs, data_location, trains_on_input, nonprofit_tier,
  dpia_flag, trustee_note and last_checked all hold a value and dpia_flag
  normalises to Green, Amber or Red. Reimplement isComplete() from
  src/lib/sheets.ts EXACTLY, including that normaliseDpiaFlag lower-cases
  before matching, so a K reading "green" counts. The current audit is
  stricter than the site and would silently drop such a row. Never carry a
  remembered count.
- Verify row numbering before trusting it: every cell reference in
  reports/2026-08-28-sheet-edit-pack.md must land on the row the parse gives.
  Abort if any disagree.
- Check every published row whose last_checked is over 90 days old, every row
  flagged Green regardless of date, and every row whose source page publishes
  a last-updated date newer than its last_checked.
- Fetch vendor pages with curl from this machine, NOT a hosted fetcher. This
  machine is in the UK, so geo-priced vendors serve GBP. That alone fixes four
  rows the cloud run could not check.
- For client-side-rendered pricing, use the Playwright already in this repo to
  load the page and read the rendered numbers. Gamma, Gemini and Seedance are
  the known cases.
- Never accept a third-party summary, review site or aggregator as a sole
  source. If only a secondary source exists, report the row unchecked and note
  the lead.
- Record for every check: source URL, date checked, and the source page's own
  stated last-updated date where it publishes one.
- Produce reports/YYYY-MM-DD-axis-audit.md matching the section order of
  reports/2026-08-30-axis-audit.md. Read that file first.

THE GATE. Non-negotiable.
Never write to the Sheet without showing me the full diff and waiting for my
explicit yes. Print every proposed cell as row, column, old -> new, with its
source URL, then stop. On approval run sheet-write.mjs --commit and show me
the receipt.

ESCALATION, NOT RESOLUTION
When a fact change puts a judgement in doubt, state what changed, quote the
affected verdict sentence and trustee note verbatim, name the decision needed,
and stop. Never propose a value for dpia_flag, trustee_note or verdict.
Two mechanical consequences to check every time: hasNonprofitPricing() passes
any nonprofit_tier except None, so writing a programme into a J reading None
moves that row INTO the nonprofit filter. doesNotTrainOnInput() passes only No
and No by default, so a move to Varies by tier drops a row OUT of the training
filter silently.

CONSTRAINTS
- Do not merge to main. Do not push without telling me first.
- Do not author visitor-facing copy. Code sessions place approved strings only.
- The service account JSON never enters the repo. Add *sheets-sa.json to
  .gitignore defensively.
- Never call the Make MCP tool named after the scenario; it executes a live
  write.
- UK English, contractions, no em dashes, in every file you write.

Start by reading the three files named above and telling me your plan. Do not
write code until I have seen it.
```

### After that, the fortnightly run is

```
/axis-audit
```

---

## Part 6. Loose ends, not urgent

- `Weekly drift scan` is paused: `enabled` unset, `next_run_at` stuck at 17
  August. Bring it back or delete it.
- `Ops dashboard weekly sync` has fifteen connectors and a 33-second last run.
  Short, but short is not proof of anything. Worth one look, not a finding.
- The 19 August `Append whats_new rows` failure was a genuine one-off that
  recovered by itself. Nothing to do unless it repeats.
