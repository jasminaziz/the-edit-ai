# Edit Audit Pipeline Specification

Written 29 August 2026, Cowork handover thread. One consolidated
specification for evolving Make scenario **"The Edit / Audit Writer"**
(scenario `6908270`, team `1224722`, org `6888280`) into the checks engine.

This is a specification, not a build. Nothing in Make has been changed and
the scenario has not been run. Its current state below was read with
`scenarios_get`.

---

## 1. What exists today

Read from the live blueprint, 29 August 2026:

- **Scheduling:** `on-demand`. `hookId: null`. `nextExec: null`. Active
  (`isActive: true`), not paused, not invalid.
- **One module.** `google-sheets:makeAPICall`, version 2, connection
  `__IMTCONN__: 5848538`.
- **Method:** `POST`. **Header:** `Content-Type: application/json`.
- **URL:** `spreadsheets/1RIO-WY9H75gML_UgdQbHGgDl-R0MfaG3CRPUp3PtAUI/values:batchUpdate`
- **Body:** a hardcoded literal. `valueInputOption: RAW`, a single `data`
  entry, range `tools!A68:F68`, and one row of values, the Zo Computer radar
  entry, verdict text and all.
- Created 11 August 2026, last edited 11 August 2026 13:08. Never touched
  since.

So it is a proven write path with a single hardcoded payload. Everything that
varies is baked into a string.

**The constraint that decides the architecture:** the Make plan is Free,
capped at two active scenarios, and this is the only active one. So this
scenario gets evolved. Nothing gets added alongside it.

---

## 2. The architecture, committed

**Cowork thinks. Make writes. Nothing else changes hands.**

Make gets no research role, no scheduling role and no judgement role. It stays
one dumb, parameterised writer behind a webhook. Cowork does the reading, the
source checking, the diffing and the reporting, then hands Make a
fully-formed request body.

Why this shape and not the alternatives:

- **Not Make's own scheduler running the checks.** The checks require fetching
  vendor privacy policies and pricing pages and judging whether a stated
  position has actually moved. Make cannot do that. Building an HTTP-plus-parse
  chain that tries would burn operations, add a second failure surface, and
  produce worse answers than the thing already doing the reading.
- **Not a second scenario.** Two active scenarios is the whole budget. The
  second slot stays free for the `whats_new` relay if that ever moves off
  GitHub Actions.
- **Not Make reading the Sheet.** Cowork reads the `tools` tab directly via
  the Sheets values API. A read through Make would cost operations and give
  Cowork the same data one hop later.

**Trigger: a custom webhook, called by a Cowork scheduled task.** The webhook
replaces `on-demand` scheduling. A webhook-triggered scenario runs instantly
when called and idles the rest of the time, which is what the Free plan wants.

Operations cost: 2 per run, one for the webhook, one for the Sheets call. On a
fortnightly cadence that is 4 operations a month against a 1,000 allowance.
Cost is not a design constraint here, so the design does not need to
compromise for it.

### Target module chain

```
1. Custom webhook  (gateway:CustomWebHook)   -- new, becomes module 1
   |
   |-- Filter: token equals the shared secret. Anything else stops here.
   |
2. Google Sheets: Make an API Call            -- the existing module, kept
   (google-sheets:makeAPICall v2, conn 5848538)
   URL, method and headers unchanged
   Body becomes: {{1.body_json}}
```

Webhook data structure, two fields, both text, both required:

| Field | Contents |
|---|---|
| `token` | Shared secret. Compared in the filter. Rotate it if it ever appears in a report, a commit or a screenshot. |
| `body_json` | The entire `values:batchUpdate` request body, already serialised to a JSON string by Cowork. |

That is the whole parameterisation. The mapper stops holding data because it
stops holding anything: the body field becomes a single mapped variable and
every varying value lives on the Cowork side, where the thing that computed it
also validates it. No Iterator, no Array aggregator, no per-row module, no
extra operations.

**Verify at build time, before trusting it:** that Make inserts `{{1.body_json}}`
into the body field verbatim, without escaping or re-encoding the JSON string.
Test it against a scratch tab (section 8), not against `tools`.

### Example payload from Cowork

```json
{
  "token": "<shared secret>",
  "body_json": "{\"valueInputOption\":\"RAW\",\"data\":[{\"range\":\"tools!M12\",\"values\":[[\"12 Sep 2026\"]]},{\"range\":\"tools!I12\",\"values\":[[\"No by default\"]]}]}"
}
```

Single-cell ranges, one per field changed. Never a row-wide range: a row-wide
write is how a judgement column gets overwritten by an automation that only
meant to update a date.

---

## 3. The write boundary

This is the rule the whole pipeline exists to respect, so it is enforced in
three places, not one.

**The machine may write only these columns:**

| Col | Field | Why it is a fact |
|---|---|---|
| D | `cost` | Published price, with a source |
| H | `data_location` | Vendor's stated hosting position |
| I | `trains_on_input` | Vendor's stated training position |
| J | `nonprofit_tier` | Published programme, or confirmed absent |
| M | `last_checked` | A stamp the pipeline itself earns |

**The machine may never write these, by any route:**

| Col | Field | Why |
|---|---|---|
| A | `name` | Identity |
| B | `category` | Legacy, retiring, stale by design |
| C | `status` | Editorial, and `not_recommended` is a published judgement |
| E | `verdict` | **Jasmin's judgement** |
| F | `url` | Changing it silently repoints a row |
| G | `jobs` | Editorial classification against the locked list |
| K | `dpia_flag` | **Jasmin's judgement** |
| L | `trustee_note` | **Jasmin's judgement** |
| N | `what_it_does` | Authored copy in a set register |

Enforcement:

1. **Cowork side.** Building a write for any range outside `D`, `H`, `I`, `J`,
   `M` is an abort, not a warning. The run stops and reports.
2. **Payload shape.** Single-cell ranges only. A range spanning more than one
   column is an abort.
3. **Make side.** The filter after the webhook rejects any `body_json`
   containing a range that matches a forbidden column letter. Belt and braces,
   because the Make module is the thing with credentials.

**The `last_checked` stamp is a claim, not a timestamp.** It is written only
when a live primary source was actually reached and read on that run. A run
that could not reach the source leaves the date alone and reports the row as
unchecked. Stamping a row the pipeline failed to verify would make the one
field that says "this was checked" the least trustworthy field on the Sheet.

**One exception carved into `cost`.** The machine writes column D only when
the change is a substitution inside the existing string shape, a number or a
currency. A change to the tier structure itself, a plan renamed, a free tier
withdrawn, is flagged for Jasmin and not written, because that string carries
editorial shape as well as a number.

---

## 4. What gets checked, against what

Only **published rows**, meaning rows that pass `isComplete()` in
`src/lib/sheets.ts`: all seven axis fields non-empty, `dpia_flag` one of Green,
Amber, Red. Fifteen rows as at 26 August 2026, against 52 incomplete ones. The
pipeline reimplements that predicate exactly. If the site's definition of
published changes, this changes with it.

| Field | Primary source, in order | Counts as a change |
|---|---|---|
| `data_location` | Vendor DPA, then trust or security centre, then privacy policy | The stated processing or storage region moves between the locked values |
| `trains_on_input` | Vendor privacy policy or terms, then the tier-specific policy page | The stated position moves, or the position now varies by tier where it did not |
| `nonprofit_tier` | The vendor's own charity or nonprofit page, then their pricing page | A programme appears, is withdrawn, or changes eligibility |
| `cost` | The vendor's pricing page, GBP where the vendor serves GBP | The figure or the currency changes |
| `url` | The stored URL itself | 404, or a redirect to a different product |

**Never a third-party summary as a sole source.** Not a review site, not an
aggregator, not another directory. If only a secondary source can be found,
the row is reported as unchecked, with the secondary source noted as a lead.

Every check records the source URL, the date checked, and the source page's own
stated last-updated date where it publishes one. Those three things go in the
sources log at the bottom of the report. A check with no recorded source did
not happen.

**Staleness triggers a check even when nothing looks wrong:**

- Any published row whose `last_checked` is more than 90 days old.
- Any published row carrying a **Green** `dpia_flag`, every run. Green rows are
  the ones a reader takes to a board without checking behind them. They earn
  the most attention, not the least.
- Any published row whose source page publishes a last-updated date newer than
  the row's `last_checked`.

---

## 5. Governance and verdicts: how a fact change escalates

The pipeline never writes judgement. What it does instead, and this is the
point of the whole thing, is notice when a fact has moved far enough that a
judgement built on it is now in doubt, and say so precisely.

**Escalation rules:**

| Fact movement | What it puts in doubt |
|---|---|
| `data_location` moves from UK, EU or EU option toward US, Other or Unclear | `dpia_flag` and `trustee_note` |
| `trains_on_input` moves from No or No by default to Yes, Yes unless you opt out, or Varies by tier | `dpia_flag`, plus a note that the row silently leaves the "Doesn't train on your content" filter |
| `nonprofit_tier` moves to None from a named programme | `verdict`, and `trustee_note` if it mentions the programme |
| Any fact change at all on a row flagged **Green** | `dpia_flag` and `trustee_note`, always |
| Any fact change on a row whose `verdict` quotes a price, a tier name, or a policy position | `verdict`, with the specific sentence quoted back |
| A row's `url` 404s or redirects to a different product | The whole row |

**The verdict text check is a string check, and it is worth doing properly.**
Before flagging, the pipeline scans the verdict for price figures, currency
symbols, named tiers, and phrases asserting a data or training position. When
a fact change contradicts one, the report quotes that exact sentence. That is
far more useful than "the verdict may be stale", because it hands over the
sentence to rewrite.

**The report never proposes a flag value.** Not for `dpia_flag`, not for
`trustee_note`, not for `verdict`. It states what changed, quotes what is now
in doubt, and asks the question. A suggested Amber becomes a default that has
to be argued against, and defaults get accepted when someone is tired. The
whole moat is that a person wrote those three fields.

---

## 6. Flag versus noise

**Surface it:**

- Any fact-field change on a published row, whether or not it was written.
- Any escalation from section 5.
- Any published row whose URL is dead or repointed.
- Any published row more than 90 days unverified.
- Any source unreachable on two consecutive runs. Once is a blip, twice is a
  vendor that moved something.
- Any incomplete row that became completable, meaning the facts are now all
  findable and only Jasmin's three judgement fields are missing. That is a
  queue for her, not a defect.

**Do not surface it:**

- Anything on an incomplete row, other than the completable case above.
- Cosmetic price formatting. "£12/month" becoming "£12 per month" is not a
  price change.
- Marketing copy rewrites on a policy page with no change to the stated
  position.
- A row whose only change is its own `last_checked` stamp.
- Anything the pipeline wrote itself. The facts-updated section lists them; it
  does not flag them.

**Zero-flag runs are the expected case and get one line, not a document.** The
same ruling that made zero-story days correct for the Rundown Routine applies
here. A pipeline that produces a report every fortnight regardless trains you
to stop opening it, and the one run that mattered arrives looking exactly like
the eleven that did not.

---

## 7. Output format

Two outputs per run.

**One line in chat**, always:

> `Axis audit, 12 Sep 2026: 15 published rows checked. 3 facts updated. 2 need your judgement. 1 unreachable.`

**One report file**, written to `reports/YYYY-MM-DD-axis-audit.md`, only when
something needs attention. Fixed section order, judgement first, always:

```
# Axis audit, 12 September 2026

15 published rows checked. 3 facts updated. 2 need your judgement.
1 unreachable.

## Needs your judgement

### Canva, trains_on_input: No by default -> Varies by tier
Source: <url>, checked 12 Sep 2026, page last updated 3 Sep 2026
Fact written to the Sheet: yes, column I
Current dpia_flag: Green
Current trustee note: "<quoted verbatim>"
Verdict sentence now in doubt: "<quoted verbatim>"
What changed underneath the judgement: the Green flag and the trustee
note both rest on the training position that has just moved.
Your ruling needed on: dpia_flag, trustee_note, verdict.

## Facts updated, already written

- Claude, cost: $20/mo -> £15/mo (col D). Source: <url>
- Otter, last_checked: 14 Jun 2026 -> 12 Sep 2026 (col M)

## Could not check

- Descript, nonprofit_tier. The charity page 404s. Second consecutive
  failure. last_checked left at 2 Jul 2026, deliberately not stamped.

## Became completable

- Notion. All fact fields now sourced. Needs dpia_flag, trustee_note and
  verdict from you.

## Sources log

| Row | Field | Source | Checked | Source last updated |
```

Why this order. The judgement asks are the only part that costs you time, so
they go first and they arrive complete: the row, the movement, the source, the
quoted sentences at risk, and the specific decision. The facts section is a
receipt, read once. Anything that failed is visible rather than absent, because
a silent failure in a staleness checker is worse than no checker.

---

## 8. Build steps

Whoever builds this in Make, in order:

1. **Create the scratch tab first.** Duplicate `tools` to `audit_test` in the
   same spreadsheet. Every step below points at `audit_test` until step 8.
2. **Create the webhook.** A custom webhook on team `1224722`. Data structure:
   `token` (text, required), `body_json` (text, required). Keep the URL out of
   any file that lands in the repo.
3. **Add it as module 1** of scenario `6908270`, ahead of the existing Sheets
   module. Scheduling changes from `on-demand` to the webhook. Do not delete
   the Sheets module and rebuild it; keep connection `5848538` and its
   existing URL, method and headers intact.
4. **Add the filter** between the two modules: `token` equals the shared
   secret, and `body_json` contains no range matching a forbidden column
   letter (A, B, C, E, F, G, K, L, N). Fail closed.
5. **Replace the body.** The hardcoded Zo Computer literal comes out. The body
   field becomes exactly `{{1.body_json}}` and nothing else.
6. **Test the escaping.** Send one write to `audit_test`, a single cell, a
   simple string. Confirm the cell holds the value and not an escaped JSON
   fragment. Then send one containing an apostrophe, a comma and a pound sign,
   because the fields being written contain all three.
7. **Test the filter.** Send a payload with a wrong token, confirm it stops.
   Send a valid token with a range of `audit_test!E5`, confirm it stops. That
   second test is the one that matters: it is the verdict column.
8. **Repoint to `tools`** only after steps 6 and 7 both pass, and only after
   Jasmin has seen the test results.
9. **Validate the blueprint** with `validate_blueprint_schema` before applying
   any blueprint edit, and read the scenario back with `scenarios_get`
   afterwards to confirm what actually landed.

**Never invoke the exposed MCP tool named after this scenario.** Calling it
executes the scenario for real against the live Sheet. Inspect with
`scenarios_get`, edit with `scenarios_update`, and drive real runs through the
webhook.

## Cadence

A Cowork scheduled task, fortnightly, on the 1st and 15th of each month at
06:00 UTC, which is 07:00 during British Summer Time. Cron: `0 6 1,15 * *`.
Fixed dates rather than "every other week" because a fortnightly cron drifts
and this needs to be a date you can predict when a report does not arrive.

The task runs the checks, calls the webhook, writes the report, and posts the
one-line summary. It is not created by this specification. It goes in once the
scenario tests pass.

---

## 9. Assumptions flagged, not guessed past

1. **Make inserts `{{1.body_json}}` verbatim.** Build step 6 exists to test
   this. If Make escapes the string, the fallback is a defined webhook data
   structure with a `writes` array plus an Iterator and an Array aggregator,
   which costs roughly one operation per row and adds two modules. Test before
   assuming either way.
2. **The Sheets connection `5848538` still has write scope.** It last wrote on
   11 August 2026. Not re-verified, because verifying it means writing, and
   the only safe write target is the scratch tab from step 1.
3. **The published set is 15 rows.** That is the 26 August figure from
   `schema.md`, and the four undrafted axis rows plus any further sign-offs
   move it. The pipeline computes the set itself every run rather than
   carrying a number.
4. **Row numbers are read fresh every run.** `batchUpdate` addresses cells by
   A1 range, so a row inserted or deleted between the read and the write
   silently corrupts the write. Mitigation, and this is not optional: Cowork
   re-reads column A immediately before sending, confirms the name at each
   target row still matches the row it computed the change for, and aborts the
   entire payload on any mismatch.
5. **The GBP question folds in here.** Six USD-served vendors currently need a
   manual GBP check. Column D is machine-writable under this spec with the
   vendor's own pricing page as the source, so that check becomes a standing
   part of every run instead of recurring as a backlog item. It still needs
   doing once by hand before the pipeline exists.
6. **`what_it_does` (column N) is treated as authored copy, not a fact.** It
   is a one-line description in a set register, so it sits with the copy rules
   rather than the fact rules and the machine never writes it. If you would
   rather the pipeline maintained it, that is a decision to take deliberately,
   because it moves a voice-carrying field across the machine/judgement line.
