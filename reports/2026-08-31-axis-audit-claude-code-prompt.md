# Axis audit: Claude Code prompt

31 August 2026. Replaces the write-path document of the same date. Scoped to
what Jasmin asked for: accuracy on the tools cards, verdict alerting, link rot
on Tools and My Stack, light add/retire suggestions for design and learning.

Three passes. The expensive one only runs on rows something cheap has flagged.

---

## Three decisions needed before this runs

0. **Done, no action.** Auth is settled: ADC, not a service account. The org
   policy blocks key creation, so the earlier `sheets-sa.json` instruction is
   void. Run `gcloud auth application-default login` with the spreadsheets
   scope before the first write.

1. **`my_stack` writable columns.** Its column is `pricing`, not `cost`, and
   the write boundary is written for `tools`. Report-only, or its own named
   writable set? Undefined means the script refuses the write, which is safe
   but useless.
2. **The rulings file.** Four mapping disagreements came out of the 30 August
   run (Grok, Gemini, Notion, Gamma). Without somewhere to record "this is
   settled", they regenerate every run. Do you want
   `reports/axis-rulings.md`?
3. **Does the 45-row ceiling cover `design_kit` and `learning`?**
   `design_kit` is already at 46 rows. If the ceiling applies, the monthly
   discovery job must propose swaps, not additions.

---

## The prompt

```
You are running the fortnightly axis audit for The Edit (theeditai.co.uk).
Read .claude/CLAUDE.md, .claude/schema.md, reports/2026-08-30-axis-audit.md
and reports/axis-rulings.md (if it exists) before you start. Work on
overhaul/sector-axis.

Google Sheet 1RIO-WY9H75gML_UgdQbHGgDl-R0MfaG3CRPUp3PtAUI.

AUTH: gcloud impersonation of a service account. NOT a key file, and NOT
plain ADC. An org policy (iam.disableServiceAccountKeyCreation) blocks key
downloads, correctly, so there is no key file and you must not look for one or
suggest creating one. Writes run as:

  SHEETS_SA_IMPERSONATE=the-edit-audit@the-edit-490220.iam.gserviceaccount.com

That service account holds Editor on the Sheet, and the signed-in user holds
roles/iam.serviceAccountTokenCreator on it, so `gcloud auth print-access-token
--impersonate-service-account=<sa> --scopes=.../spreadsheets` mints a
short-lived token and nothing lands on disk. Project is the-edit-490220.
scripts/sheet-write.mjs handles this itself; a key file and plain ADC remain
as coded fallbacks only. Writes appear in version history as the service
account, not as Jasmin.

Do not touch the whats_new tab or .github/workflows. That pipeline works.

READ THE SHEET PER TAB, NOT THE WHOLE WORKBOOK. A whole-workbook read
truncates around 275k characters and silently drops the tail. Read the tools
tab on its own via the Sheets API.

=== THE WRITE BOUNDARY ===
The test, and everything below follows from it: WRITABLE WHEN AN EXTERNAL
SOURCE DETERMINES THE CORRECT VALUE, REFUSED WHEN SOMEONE HAS TO CHOOSE IT.

Writable, exactly as scripts/sheet-write.mjs enforces it, per tab:

  tools:      A name, D cost, F url, H data_location,
              I trains_on_input, J nonprofit_tier, M last_checked
  my_stack:   A name, E url
  design_kit: A name, E url
  learning:   I url

Refused permanently: tools B category, C status, E verdict, G jobs,
K dpia_flag, L trustee_note, N what_it_does; and every column on the other
three tabs except the ones listed above, INCLUDING learning column A, whose
names are composite labels Jasmin wrote rather than vendor strings.

E, K and L are Jasmin's judgement. G is the filter, so it is editorial. N is
visitor-facing copy. Building a write for any of those is an abort, not a
warning.

The guard is PER TAB, never a global set of column letters: column I is `url`
on learning and `trains_on_input` on tools, so a global set would accept
"No by default" as a URL.

Name and url became writable on Jasmin's ruling of 31 August 2026, widening an
earlier boundary that refused them: a vendor renaming its product or moving its
page is a fact. What did NOT move: a URL that now points at a DIFFERENT PRODUCT
is not a link fix, it is a question about what the row is, and it goes to
Jasmin (Windsurf, Smartmockups).

Every write must cite a source URL or it is refused. That control, not a short
column list, is what makes the wider boundary safe.

=== PASS 1: CHEAP SIGNALS. No LLM reasoning. Script it. ===

1a. URL status. Fetch every URL in tools, my_stack, design_kit and learning
    (~156: 67 + 19 + 44 + 26 as at 1 Sep 2026; recount, do not trust this).
    whats_new is deliberately excluded and this is a decision, not an
    oversight. Ruled 1 September 2026. Its 260 rows would nearly triple this
    pass every run, and they are a dated news archive: a link that dies six
    months after the story ran is normal decay, not a defect in a claim the
    site is making today. Do not add it back without a ruling.
    Record status code, final URL after redirects, and hop count.
    Report a row ONLY if: non-2xx, or the final host differs from the stored
    host. A www or .so-to-.com redirect on the same brand is not a finding.
    Do not judge whether a redirect is "a different product" here; just report
    the target. Materiality is Pass 2's job.

1b. Policy-date drift. THIS IS THE MOST IMPORTANT CHECK IN THE RUN. For every
    published tools row, fetch its privacy policy / DPA / trust page and regex
    for a published "last updated" or "effective" date. Compare to that row's
    last_checked. Flag any row whose source page is newer.
    Without this, a vendor moving trains_on_input from "No by default" to
    "Yes" goes unseen until the 90-day clock fires, and that change silently
    drops the row out of the site's "Doesn't train on your content" filter.
    Keep a small map of row -> policy URL in the repo so this does not need
    rediscovering each run.

1c. Do NOT check prices here. "Is it still free" is not a string match; almost
    every free tool's pricing page also lists paid tiers. Price changes arrive
    through 1b and the 90-day clock.

1d. TWO CONSECUTIVE FAILURES. Before reporting, read the PREVIOUS run's
    artefacts: the most recent reports/*-axis-diff.json and the "Could not
    check" section of the most recent reports/*-axis-audit.md. Anything that
    failed to fetch or verify in BOTH that run and this one is escalated to
    section 1 as a finding, not left in "Could not check" a second time.

    Once is a blip. Twice is a vendor that moved something, or a route that has
    closed, and it needs a decision rather than another line in a list nobody
    acts on.

    ALREADY QUALIFYING as at 1 September 2026: Adobe Creative Cloud (row 28)
    and Adobe Express (row 29). helpx.adobe.com and www.adobe.com were
    unreachable on 30 August and again on 31 August, by three different
    methods. Both rows sit inside "Doesn't train on your content", the site's
    strongest claim, so this is the highest-value unreachability in the set.
    Treat them as escalated on the next run unless a route has been found.

OUTPUT DISCIPLINE: print exceptions only. Never print 159 status lines. When
you surface a matched line from a fetched page, cap it at that line plus a
small window. This pass should cost almost nothing.

=== PASS 2: FACT CHECK. Only on triggered rows. ===

A published row is checked if ANY of:
  - last_checked is more than 90 days old
  - dpia_flag is Green (always, every run, never droppable)
  - Pass 1 flagged it
Nothing else. As at 31 Aug 2026 no row is due on age until 22 November and
exactly one row is Green, so a normal run here is 1 to 4 rows, not 23.

Compute the published set yourself every run, never a remembered count. A row
is published when jobs, data_location, trains_on_input, nonprofit_tier,
dpia_flag, trustee_note and last_checked all hold a value and dpia_flag
normalises to Green, Amber or Red. Reimplement isComplete() from
src/lib/sheets.ts EXACTLY, including that normaliseDpiaFlag lower-cases before
matching, so a K reading "green" counts. The current spec is stricter than the
site and would drop such a row.

Verify row numbering before trusting it: every cell reference in
reports/2026-08-28-sheet-edit-pack.md must land on the row your parse gives.
Abort if any disagree.

Legal values. Writing anything else corrupts the row silently.
  H: UK | EU | EU option | US | Your tenant | Other | Unclear
  I: No | No by default | Yes unless you opt out | Yes | Varies by tier | Unclear
  J: the programme description, or the literal word None. Never blank.
  M: DD MMM YYYY.
If the true position does not fit, leave the cell and flag it. Never pick the
nearest value.

=== COLUMN D CARVE-OUT. Read before writing any cost. ===
Write D ONLY when a number or a currency symbol is substituted inside the
EXISTING STRING SHAPE. "Pro GBP 100 a year" becoming "Pro GBP 120 a year" is a
write.

FLAG, never write, when the shape itself moved: a tier restructured, a plan
renamed, a free tier withdrawn or added, a per-seat model replacing a flat fee.
That string carries editorial shape as well as a number, and the shape is
Jasmin's. HubSpot on 30 August is the worked example: Marketing Starter went
from a flat monthly fee to seat-plus-credits, which is a restructure and was
correctly left alone.

scripts/sheet-write.mjs enforces this. A D write must carry the old value, and
its shape is compared: numbers and currency symbols are normalised out, so a
substitution passes and anything else is refused. There is no override. If you
have concluded the change is a restructure you may set "shape_change": true,
which REFUSES the write; the flag can only ever refuse, never permit, so it
cannot be used to force one through.

=== PRICING CONVENTIONS ===
Record the vendor's displayed currency VERBATIM. Never convert, never
normalise, never annotate with an approximate conversion. This machine is in
the UK, so geo-priced vendors serve GBP; a US-served figure is recorded in USD
and flagged as US-served rather than silently converted.

Where a headline price requires a year upfront, show BOTH figures, in the
vendor's own words, e.g. "$16/mo billed annually, $24 monthly". A single
annualised figure hides the commitment, which is exactly the thing a small
charity needs to see.

Fetch with curl from this machine, not a hosted fetcher. This machine is in
the UK, so geo-priced vendors serve GBP. For pricing pages that render in
script, use the Playwright already in this repo. Between them these fix seven
of the nine fields the 30 August cloud run could not reach.

Never accept a third-party summary, review site or aggregator as a sole
source. If only a secondary source exists, report the row unchecked and note
the lead. Record for every check: source URL, date checked, and the source
page's own last-updated date where it publishes one.

Before flagging anything, check reports/axis-rulings.md. A finding already
ruled on there is suppressed unless the underlying fact has moved since the
ruling. Do not re-raise settled mapping calls.

=== PASS 3: VERDICT ALERTING. Only when Pass 2 found a fact that moved. ===

Costs nothing when nothing moved, which will be most fortnights.

For each moved fact, scan that row's verdict for price figures, currency
symbols, named tiers, and stated data or training positions. Quote the exact
sentence now in doubt, verbatim. Quote the trustee note verbatim. State what
changed underneath it and name the decision needed.

Never propose a value for dpia_flag, trustee_note or verdict. A suggested flag
becomes a default Jasmin has to argue against.

=== THE GREEN-ROW RULE. Non-negotiable. ===
ANY fact change at all on a Green row puts dpia_flag AND trustee_note in doubt,
always, with no threshold and no judgement call about whether the change looks
material. Escalate both, every time.

The reason is the reader, not the data: a Green row is the one taken to a board
without anyone checking behind it. Green is the site saying "you can adopt this
without a DPIA", so a fact moving underneath that claim is the single highest
consequence event in this whole audit.

One row is Green today (Google Workspace AI, row 61), so the rule costs almost
nothing to hold and the whole point of the audit is lost without it.

Escalation mapping for the other rows, so a moved fact reaches the right field:
  - trains_on_input moves       -> dpia_flag and trustee_note in doubt
  - data_location moves         -> dpia_flag and trustee_note in doubt
  - nonprofit_tier appears/goes -> verdict in doubt (it often names the tier)
  - cost shape moves            -> verdict in doubt (it often quotes a price)
  - ANY change on a Green row   -> dpia_flag and trustee_note, always

Always check these two mechanical consequences, they are easy to miss:
  - hasNonprofitPricing() passes any nonprofit_tier except None, so writing a
    programme into a J reading None moves that row INTO the nonprofit filter.
  - doesNotTrainOnInput() passes only No and No by default, so a move to
    Varies by tier drops a row OUT of the training filter silently.

=== WRITING ===

Never write without showing the full diff and waiting for an explicit yes.
Print every proposed cell as row, column, old -> new, with its source URL,
then stop.

Write the proposed diff to reports/YYYY-MM-DD-axis-diff.json before asking.
If a previous diff file exists and is under seven days old, reuse its verified
findings rather than re-fetching those sources. An abandoned run should not
cost twice.

On approval, write via scripts/sheet-write.mjs --commit. That script is the
only path that touches the Sheet, and it must:
  - reject any tab/column pair outside the WRITE BOUNDARY map above, and any
    range not matching ^<tab>!<COL><ROW>$. Fail closed. The check is per tab.
  - refuse any edit with no source URL.
  - validate every value against the legal sets above before sending.
  - immediately before sending, re-read column A and confirm the tool name at
    every target row still matches. Abort the ENTIRE batch on any single
    mismatch. batchUpdate addresses cells by position.
  - after sending, re-read the written cells and confirm. Print a receipt.
  - never stamp M for a row whose other write did not land. That date is the
    site's claim a check happened; it is earned, not scheduled.
scripts/sheet-write.mjs exists, with 19 tests in scripts/sheet-write.test.mjs.
Run `node --test scripts/sheet-write.test.mjs` before trusting it. Do not
rebuild it. --rollback replays a run backwards if a write needs undoing.

=== OUTPUT ===

One line, always:
"Axis audit, [date]: N published rows checked. M facts updated. K need your
judgement. J unreachable."

A report at reports/YYYY-MM-DD-axis-audit.md ONLY if something needs
attention. Required sections, in this order, named here rather than inherited
from any previous report so a newer template cannot silently drop one:

  1. Needs your judgement       (first, always)
  2. Facts updated, written and confirmed
  3. Could not check
  4. Became completable         (rows that gained their last missing axis
                                 field and can now be published; say "None"
                                 rather than omitting the section)
  5. The toggles                (filter movement, and the two mechanical
                                 consequences)
  6. What was written           (the receipt)
  7. Sources log
  8. Assumptions this run depends on

Judgement first. A run with nothing to flag gets the one line and no document.
That is the expected outcome most fortnights and it is correct.

=== CONSTRAINTS ===
- Do not merge to main. Do not push without telling me first.
- Do not author visitor-facing copy. Place approved strings only.
- Never write credentials into the repo, and never propose creating a service
  account key. Key creation is blocked by org policy; gcloud impersonation of
  the-edit-audit@the-edit-490220 is the route.
- Never call the Make MCP tool named after the scenario.
- UK English, contractions, no em dashes.
```

---

## The monthly discovery job lives in Cowork, not here

Deleted from this file on 1 September 2026. The design_kit and learning
discovery pass is now the Cowork task's prompt and is not run from here.
Keeping it in two places guarantees they drift. Do not re-add it.

## What this run costs, roughly

- Pass 1: scripted, exceptions-only output. Negligible.
- Pass 2 until 22 November: one Green row plus whatever Pass 1 flags.
- Pass 2 from 22 November: the whole 23-row cohort comes due at once. Worth
  staggering by hand before then so it does not all land in one run.
- Pass 3: zero most fortnights.

The 30 August run cost what it did because it was a one-off catch-up across
all 23 rows. That does not repeat.
