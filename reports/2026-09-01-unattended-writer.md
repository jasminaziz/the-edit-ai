# The unattended writer, and the final Cowork prompt

> **PARKED, 1 September 2026. Do not build this as written.**
>
> Job 1 of Block 2 gives the Cowork task link-and-name rot across all four
> tabs. Claude Code's Pass 1 already does exactly that and already has a
> tested write path for it (`sheet-write.mjs` writes `design_kit` A and E,
> `learning` I, `tools` A and F). Building this as drafted would put two
> writers on the same columns on different schedules with no coordination,
> which is the collision the write boundary exists to prevent.
>
> Before this is built, one decision has to be taken: **who owns link and
> name rot, Cowork or Claude Code?** Not both. The recommendation is Cowork,
> because link status is mechanical, needs no UK IP and no rendered browser,
> and it is the job that benefits from running unattended. Claude Code would
> then keep *detecting* a dead or repointed URL as an escalation signal about
> whether the row still belongs, and stop *writing* links, keeping the fact
> fields where its UK IP and real browser are the whole reason it exists.
>
> That decision costs an edit to the Claude Code prompt as well as this one.
> Until it is taken, the live setup has one writer and one owner, which is
> the safer place to sit.
>
> The Apps Script in Block 1 is sound and can be built as-is whenever the
> decision is made. It is Block 2's Job 1 that needs rewriting first.

1 September 2026. Two things to paste. Nothing to decide.

This closes the loop you asked for: the site refreshes its safe facts without
you, and the fields that carry trust stay on the path that can verify them.

**Scope, enforced in code, not in a prompt.** The unattended writer may change
names and URLs and nothing else. It cannot touch cost, data location, training
position, nonprofit tier, or the last-checked date. Those need a UK IP, a real
browser, or a judgement, so they stay in Claude Code.

---

## Block 1 of 2: the Apps Script

New standalone Apps Script project. Do **not** add this to the existing
whats_new script. That one is live and working; a separate project means it
carries zero risk from this.

1. script.google.com, New project, name it `The Edit / safe writer`.
2. Delete the stub and paste everything in the block below.
3. Project Settings, Script Properties, add one property:
   `SHARED_TOKEN`, value a long random string. Generate one with
   `openssl rand -hex 32` in your terminal.
4. Deploy, New deployment, type Web app.
   Execute as: **Me**. Who has access: **Anyone**.
   ("Anyone" is required for an unauthenticated POST. The token is what
   protects it, which is the same posture the whats_new script already runs
   on.)
5. Copy the `/exec` URL. Keep it out of the repo, same as the other one.

```javascript
/**
 * The Edit / safe writer.
 * Writes ONLY names and URLs. Every other column is refused in code.
 *
 * The line this runs on: a vendor renaming a product or moving a page is a
 * fact an external source determines. Cost, data location, training position,
 * nonprofit tier and last_checked either need a UK IP, a rendered browser, or
 * a judgement, so they are refused here and stay in Claude Code.
 */

var SHEET_ID = '1RIO-WY9H75gML_UgdQbHGgDl-R0MfaG3CRPUp3PtAUI';

// Per tab, the only columns that may ever be written. Fails closed: a tab or
// column absent from this map is refused, whatever the payload says.
var WRITABLE = {
  tools:      { A: 'name', F: 'url' },
  my_stack:   { A: 'name', E: 'url' },
  design_kit: { A: 'name', E: 'url' },
  learning:   { I: 'url' }
};

// Column A holds the tool name on all four tabs. Used to re-verify the row
// before writing, because row numbers shift when rows are inserted.
var NAME_COL = 'A';

function json_(obj, code) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return json_({ ok: true, service: 'the-edit-safe-writer', writes: 'names and urls only' });
}

function doPost(e) {
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ success: false, error: 'body is not valid JSON' });
  }

  var expected = PropertiesService.getScriptProperties().getProperty('SHARED_TOKEN');
  if (!expected || body.token !== expected) {
    return json_({ success: false, error: 'bad token' });
  }

  var edits = body.edits;
  if (!Array.isArray(edits) || edits.length === 0) {
    return json_({ success: false, error: 'no edits supplied' });
  }
  if (edits.length > 25) {
    return json_({ success: false, error: 'batch too large, max 25' });
  }

  var ss = SpreadsheetApp.openById(SHEET_ID);
  var errors = [];
  var planned = [];

  // Validate everything before writing anything. One bad edit refuses the
  // whole batch, so a partial write can never happen.
  for (var i = 0; i < edits.length; i++) {
    var ed = edits[i];
    var where = 'edit ' + i;

    if (!ed || typeof ed !== 'object') { errors.push(where + ': not an object'); continue; }
    if (typeof ed.tab !== 'string' || !WRITABLE[ed.tab]) {
      errors.push(where + ': tab "' + ed.tab + '" is not writable by any route'); continue;
    }
    if (typeof ed.col !== 'string' || !WRITABLE[ed.tab][ed.col]) {
      errors.push(where + ': column ' + ed.col + ' on ' + ed.tab +
                  ' is refused. Writable here: ' + Object.keys(WRITABLE[ed.tab]).join(', ') +
                  '. Facts needing verification and all judgement stay in Claude Code.');
      continue;
    }
    if (!(typeof ed.row === 'number' && ed.row > 1 && ed.row === Math.floor(ed.row))) {
      errors.push(where + ': row must be a whole number greater than 1'); continue;
    }
    if (typeof ed.value !== 'string' || ed.value.trim() === '') {
      errors.push(where + ': value must be a non-empty string'); continue;
    }
    if (typeof ed.source !== 'string' || ed.source.indexOf('http') !== 0) {
      errors.push(where + ': every edit must cite a source URL'); continue;
    }
    if (typeof ed.expectName !== 'string' || ed.expectName.trim() === '') {
      errors.push(where + ': expectName is required so the row can be re-verified'); continue;
    }

    var sheet = ss.getSheetByName(ed.tab);
    if (!sheet) { errors.push(where + ': tab "' + ed.tab + '" not found'); continue; }

    // Re-read the name at that row immediately before writing. Row numbers
    // shift when rows are inserted or deleted, and a shifted row means the
    // write lands on the wrong tool.
    var actualName = String(sheet.getRange(NAME_COL + ed.row).getValue()).trim();
    var expectName = ed.expectName.trim();
    if (actualName !== expectName) {
      errors.push(where + ': row ' + ed.row + ' on ' + ed.tab + ' holds "' +
                  actualName + '", expected "' + expectName +
                  '". Rows have moved. Whole batch refused.');
      continue;
    }

    planned.push({
      sheet: sheet, tab: ed.tab, col: ed.col, row: ed.row,
      field: WRITABLE[ed.tab][ed.col],
      value: ed.value, source: ed.source, name: actualName
    });
  }

  if (errors.length) {
    return json_({ success: false, written: 0, errors: errors });
  }

  // Write, then read back and confirm.
  var receipt = [];
  for (var j = 0; j < planned.length; j++) {
    var p = planned[j];
    var cell = p.sheet.getRange(p.col + p.row);
    var before = String(cell.getValue());
    cell.setValue(p.value);
    SpreadsheetApp.flush();
    var after = String(cell.getValue());
    receipt.push({
      range: p.tab + '!' + p.col + p.row,
      tool: p.name,
      field: p.field,
      old: before,
      "new": after,
      source: p.source,
      confirmed: after === p.value
    });
  }

  var allConfirmed = receipt.every(function (r) { return r.confirmed; });
  return json_({ success: allConfirmed, written: receipt.length, receipt: receipt });
}
```

### What it refuses, on purpose

Send it `tools!E12` and it answers *"column E on tools is refused"*. Same for
D, H, I, J, M, K, L. Send a row whose name has moved and it refuses the whole
batch rather than the offending edit. Send an edit with no source URL and it
refuses. None of that depends on a prompt behaving.

### Test it before pointing anything at it

Send this with your real token, to a row you can eyeball. It should refuse.

```json
{"token":"YOUR_TOKEN","edits":[{"tab":"tools","col":"E","row":27,"value":"test","source":"https://example.com","expectName":"Canva"}]}
```

Then send a real one: a URL you know is stale, with the correct `expectName`.
Check the cell, then check the card on the live site.

---

## Block 2 of 2: the Cowork task prompt

Replaces what is in the task now. Cloud, no Mac, no repo access.

Add the `/exec` URL and token as they are, in the task's own configuration if
Cowork supports it, or inline here if not.

```
The Edit's fortnightly axis audit is due today.

WHAT YOU ARE
You keep the directory's links and product names correct. You do not audit
facts and you do not form judgements. Two jobs: fix link rot and renames, and
remind Jasmin the real audit is due.

WHAT YOU MAY CHANGE
Names and URLs only, through the safe-writer endpoint, which refuses anything
else in its own code. You cannot change cost, data location, training
position, nonprofit tier or last_checked, and you must not try. Those need a
UK IP, a rendered browser or a judgement, and they run in Claude Code on
Jasmin's Mac.

Never stamp last_checked. That date is the site's claim that a check happened
and you are not equipped to earn it.

Do not use any Drive tool to write, update or delete. The safe-writer endpoint
is your only write path.

JOB 1: LINK AND NAME ROT
Read the tools, my_stack, design_kit and learning tabs of Google Sheet
1RIO-WY9H75gML_UgdQbHGgDl-R0MfaG3CRPUp3PtAUI.

Fetch every URL. For each one, record the status and the final URL after
redirects. Then act only in these two cases:

1. A permanent redirect to the same product on the same brand. Example,
   notion.so to notion.com. Update the URL.
2. A vendor has renamed the product and its own page says so. Update the name,
   and the URL if the host moved with it.

Everything else you REPORT and do not touch:
- A 404 with no obvious replacement.
- A URL now serving a different product. Windsurf now serves Devin Desktop;
  Smartmockups folded into Canva. Changing those would quietly turn one row
  into another, which is a question about what the row is. That is Jasmin's.
- Anything you are not certain about.

For each change, POST to the safe writer with tab, col, row, value, source and
expectName, where expectName is the name currently in column A of that row. If
it refuses, report the refusal verbatim and do not retry with different
values. A refusal is the guard working.

JOB 2: THE NUDGE
State that the axis audit is due, and that to run it Jasmin opens Claude Code
in ~/Developer/the-edit-ai and pastes the newest
reports/*-axis-audit-claude-code-prompt.md. That is the whole trigger. Nothing
else starts it, and if she does not, nothing happens silently.

You have no access to the repo. Do not try to read it and do not report its
absence as a fault. That is expected.

From the tools tab, add three lines on freshness:
- The oldest last_checked date and which tool carries it.
- How many published rows are within 14 days of 90 days old.
- How many are already over 90.
A published row has values in all of jobs, data_location, trains_on_input,
nonprofit_tier, dpia_flag, trustee_note and last_checked, with dpia_flag
reading Green, Amber or Red in any case.

JOB 3, ON THE 1st ONLY: design_kit and learning suggestions
Skip on the 15th.

At most 5 additions and 5 retirements in total across both tabs, at most 3
sources each. Report only, never write these. For an addition: name, url, tab,
one line on why it earns a place, and which row it displaces. design_kit is at
46 rows, so propose swaps. For a retirement: name, row, reason.

Audience is comms teams in charities, cultural organisations and heritage. No
general AI tools, no developer tools, nothing already on tools. If nothing
meets the bar, say so in one line. That is a valid outcome.

OUTPUT
Lead with what changed. If you wrote nothing, say "no link or name changes"
and move on; that is the expected result most runs.
Then the nudge and the freshness lines. Then, on the 1st, the suggestions.
Notification title states the single most important thing, never "axis audit
reminder".
Under 200 words on the 15th, under 600 on the 1st.
UK English, contractions, no em dashes, active voice, no preamble.
```
