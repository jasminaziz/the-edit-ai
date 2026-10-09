/**
 * Does the live Sheet still give /tools a directory? Run by the scheduled
 * directory watchdog (.github/workflows/directory-watchdog.yml) with
 * `bun scripts/check-directory.ts`.
 *
 * WHY THIS EXISTS. Every fetcher in src/lib/sheets.ts turns a failed read into
 * an empty list, and since 9 Oct 2026 logs it, but only to the visitor's
 * browser console. If the key loses a host from its referrer list, or a header
 * in the tools tab is renamed, /tools renders empty and nothing reaches
 * Jasmin. This reads the tab the way the site does and fails loudly; a failed
 * scheduled run sends GitHub's failure email. Ruled 9 Oct 2026 over client
 * error capture, which needs a new dependency and a third party.
 *
 * It imports the app's own parseToolRows and isComplete rather than restating
 * them, so "a row that renders" means exactly what the grid means by it. The
 * audit prompt once reimplemented isComplete in prose; this does not.
 *
 * THE FLOOR. 23 rows were complete on 9 Oct 2026. The broken cases measure 0:
 * a refused key returns no rows, and a renamed header leaves every row
 * incomplete. 20 sits between them and matches the /tools card floor in the
 * prerender. If rows are retired on purpose and the count falls below 20, the
 * watchdog firing is correct: look, then move the number deliberately.
 *
 * The request URL carries the key, so it is never printed.
 */
import { isComplete, parseToolRows } from "../src/lib/sheets";

const FLOOR = 20;
const REFERER = "https://www.theeditai.co.uk/";

const key = process.env.SHEETS_API_KEY;
const id = process.env.SHEETS_ID;
if (!key || !id) {
  console.error("FAIL: SHEETS_API_KEY and SHEETS_ID must both be set.");
  process.exit(1);
}

const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}/values/tools?key=${key}`, {
  headers: { Referer: process.env.SHEETS_REFERER ?? REFERER },
});
if (!res.ok) {
  console.error(`FAIL: HTTP ${res.status} on values/tools. The live /tools page will be empty.`);
  console.error("A 403 usually means the key's referrer list lost theeditai.co.uk or www.theeditai.co.uk.");
  process.exit(1);
}

const data = await res.json();
const tools = parseToolRows(data.values || []);
const complete = tools.filter(isComplete).length;
if (complete < FLOOR) {
  console.error(`FAIL: ${complete} complete rows of ${tools.length}, below the floor of ${FLOOR}.`);
  console.error("Check the tools tab headers first: a renamed header empties every row at once.");
  process.exit(1);
}

console.log(`OK: ${complete} complete rows of ${tools.length}.`);
