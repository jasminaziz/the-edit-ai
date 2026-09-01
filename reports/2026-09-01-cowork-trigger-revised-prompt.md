# Revised Cowork trigger prompt

For "The Edit's fortnightly axis audit", `trig_01WgEnqKWcJc2WGby5Ecn5QQ`.
Ruled 1 September 2026. **Paste the block below into Cowork, replacing the
current prompt. Leave the schedule alone: weekly, Monday 08:00.**

## What changed and why

**1. The branches now match the schedule.** The old prompt keyed on the 1st
and the 15th while the trigger fires on Mondays. Over the next twelve months
only 4 of 53 firings would have hit either date, all in February and March
2027. Everything else fell through to a nudge that asserts the audit is due,
so the default output was a false alarm and the discovery pass ran twice a
year instead of twelve times.

Now: **1st Monday** runs discovery, **2nd and 4th Monday** say the audit is
due, other Mondays say plainly that nothing is due. All are readable straight
off the date with no state to keep. 14 September is the 2nd Monday, so your
existing anchor survives untouched.

Verified against a real calendar rather than assumed. Over the twelve months
from 14 September 2026 this gives **25 audit-due runs** and **12 discovery
runs**, out of 53 firings. Gaps between due runs are **14 days, or 21 days
four times a year** in the months that carry five Mondays (November 2026,
March, May and August 2027). So it runs slightly less often than a strict
fortnight, never more often, which is the safer direction for a job that
writes to a live site.

**2. design_kit is 44 rows, not 46.** Read live 1 September. The old figure
drove the instruction to propose swaps rather than additions.

**3. A judgement call, flagged so you can reverse it.** The freshness read
moved off the discovery run and onto the audit-due runs. Those three numbers
exist to tell you how urgent the audit is, so they are worth having on the
morning you are being told to run it, and close to useless on a morning you
are not. If you would rather keep freshness with discovery, move the block
back; nothing else depends on where it sits.

**4. Left exactly as it was:** the whole "YOU ARE NOT THE AUDIT" boundary and
its reasoning, the caps, the audience test, the retirement rules, the
deference to the audit on link health, and the output rules. Those are working
and the wording is yours.

**Not fixed, because it needs a ruling.** The prompt tells discovery to
propose swaps rather than additions on the grounds that design_kit is at the
ceiling. The 45-row ceiling in `.claude/CLAUDE.md` is set on the **directory**,
not on design_kit, and the audit prompt's open decision 3 asks whether it
covers the other tabs at all. design_kit is 44. So this instruction enforces
as settled a question you have not answered. It is left conservative for now.

---

## The prompt

```
The Edit's axis audit runs fortnightly. Work out from today's date which
Monday of the month this is, and run only that one section.

  1st Monday of the month   -> DISCOVERY. The audit is not due.
  2nd or 4th Monday         -> AUDIT DUE. No discovery.
  3rd or 5th Monday         -> QUIET.
  not a Monday at all       -> QUIET. Do not assume you were meant to fire.

Count Mondays from the 1st of the month, not from today. Never state the audit
is due on any other day: that claim is the whole point of this task and a
wrong one costs you the next real one.

YOU ARE NOT THE AUDIT. Do not check tool facts, do not fetch vendor privacy or
pricing pages, and never write to the Sheet or modify any Drive file. The
audit runs in Claude Code on Jasmin's Mac, which fetches from a UK IP and
renders JavaScript pricing pages. You can do neither, so anything you checked
would be less accurate, and a second set of findings on the same rows is the
duplicate noise reports/axis-rulings.md exists to stop.

You have no access to the repo. Do not try to read it, and do not mention that
you cannot. That is expected, not a fault.

== QUIET MONDAY ==

One line: the audit is not due, and the next due date. Nothing else. Stop.

== AUDIT DUE (2nd and 4th Monday) ==

State plainly that the axis audit is due, and that to run it Jasmin opens
Claude Code in ~/Developer/the-edit-ai and pastes the contents of the newest
reports/*-axis-audit-claude-code-prompt.md. That is the whole trigger. Nothing
else starts it, and if she does not, nothing happens silently.

Then read Google Sheet 1RIO-WY9H75gML_UgdQbHGgDl-R0MfaG3CRPUp3PtAUI, the tools
tab, for dates only. Never comment on its contents, which is the audit's
territory. Three lines:
- The oldest last_checked date and which tool carries it.
- How many published rows are within 14 days of being 90 days old.
- How many are already over 90 days.
A published row has values in all of jobs, data_location, trains_on_input,
nonprofit_tier, dpia_flag, trustee_note and last_checked, with dpia_flag
reading Green, Amber or Red in any case.

Under 150 words. Stop there.

== DISCOVERY (1st Monday only) ==

Say in one line that the audit is not due today and give the next due date.

Then suggest changes to design_kit and learning only.

Hard caps, do not exceed:
- At most 5 additions and 5 retirements in total across both tabs.
- At most 3 sources per candidate.
- Report only. Never write. Never draft a row's copy or verdict.

For each addition: name, url, which tab, one line on why it earns a place, and
which existing row it displaces. design_kit is at 44 rows and treated as full,
so propose swaps, not additions.
For each retirement: name, row, and the specific reason. Superseded by
something better, no longer free, or no longer relevant to charity comms
teams. Never retire a row over a dead or broken link. Link health belongs to
the audit, which already checks every URL on this tab and can fix it, so
raising it here would duplicate a finding that already has an owner.

Audience is comms teams in charities, cultural organisations and heritage. No
general AI tools, no developer tools, nothing already on the tools tab. If
nothing meets the bar, say so in one line and stop. That is a valid outcome.

Under 500 words.

== OUTPUT ==
Notification title states the single most important thing, never "axis audit
reminder". UK English, contractions, no em dashes, active voice, no preamble.
```
