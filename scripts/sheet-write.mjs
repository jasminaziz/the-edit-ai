#!/usr/bin/env node
/**
 * The Edit — the ONLY path that writes to the Sheet.
 *
 * The rule, in Jasmin's words (31 Aug 2026): facts get updated, judgement waits
 * for her. So a vendor renaming its product, moving its URL, changing its price
 * or its data position is writable. A verdict, a DPIA flag, a trustee note or
 * any visitor-facing description is not, ever, by any route.
 *
 * WRITABLE                                  REFUSED, and why
 *   tools!A  name          fact               tools!B  category      editorial, legacy
 *   tools!D  cost          fact               tools!C  status        her call on her stack
 *   tools!F  url           fact               tools!E  verdict       judgement
 *   tools!H  data_location fact               tools!G  jobs          editorial classification
 *   tools!I  trains_on_..  fact               tools!K  dpia_flag     judgement
 *   tools!J  nonprofit_..  fact               tools!L  trustee_note  judgement
 *   tools!M  last_checked  fact               tools!N  what_it_does  visitor-facing copy
 *   my_stack!A/E   name,url         ...and every other column on the
 *   design_kit!A/E name,url            other three tabs. learning!A is
 *   learning!I     url                 refused: those names are composite
 *                                      labels Jasmin wrote, not vendor strings.
 *
 * The line the guard runs on: writable when an external source determines the
 * correct value, refused when someone has to choose it. Every write must also
 * cite a source URL, or it is refused.
 *
 * Column D carries one extra rule: only a number or currency substituted inside
 * the existing string shape may be written. A restructured tier is editorial.
 *
 * Note the collision this guard exists to prevent: column I is `url` on the
 * learning tab and `trains_on_input` on tools. The spec is per tab, never a
 * global set of column letters.
 *
 * Usage:
 *   node scripts/sheet-write.mjs <diff.json>                       dry run
 *   node scripts/sheet-write.mjs <diff.json> --commit              write, verify
 *   node scripts/sheet-write.mjs <diff.json> --rollback --commit   undo that run
 *
 * Credentials, in the order tried: a service account key at SHEETS_SA; gcloud
 * impersonation of SHEETS_SA_IMPERSONATE; gcloud ADC as the signed-in user.
 * No credential ever enters the repo.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

export const SHEET_ID = '1RIO-WY9H75gML_UgdQbHGgDl-R0MfaG3CRPUp3PtAUI';

export const LEGAL = {
  data_location:   ['UK', 'EU', 'EU option', 'US', 'Your tenant', 'Other', 'Unclear'],
  trains_on_input: ['No', 'No by default', 'Yes unless you opt out', 'Yes', 'Varies by tier', 'Unclear'],
};
export const M_RE = /^(0?[1-9]|[12][0-9]|3[01]) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) [0-9]{4}$/;
const URL_RE = /^https?:\/\/[^\s"<>]+$/;

/** Per tab, the columns that may be written and what each one is. Fails closed:
 *  a tab absent here, or a column absent from its map, is refused. */
export const WRITABLE = {
  tools:      { A: 'name', D: 'cost', F: 'url', H: 'data_location', I: 'trains_on_input', J: 'nonprofit_tier', M: 'last_checked' },
  my_stack:   { A: 'name', E: 'url' },
  design_kit: { A: 'name', E: 'url' },
  learning:   { I: 'url' },
};

export const RANGE_RE = /^([a-z_]+)!([A-Z]+)([0-9]+)$/;
export function parseRange(range) {
  const m = typeof range === 'string' ? RANGE_RE.exec(range) : null;
  return m ? { tab: m[1], col: m[2], row: Number(m[3]) } : null;
}
export const fieldOf = range => { const p = parseRange(range); return p ? WRITABLE[p.tab]?.[p.col] ?? null : null; };

/**
 * The shape of a cost string, with the parts that are allowed to change removed.
 * Substituting a number or a currency symbol inside the existing shape is a
 * write; changing the shape itself is a restructure and is Jasmin's.
 *
 *   "Pro £100 a year"  -> "pro ¤# a year"
 *   "Pro $120 a year"  -> "pro ¤# a year"   same shape, allowed
 *   "$20 per seat/mo"  -> different shape,  refused
 */
export function costShape(v) {
  return String(v ?? '')
    .replace(/[£$€¥]/g, '¤')        // currency substitution is allowed
    .replace(/\d[\d,.]*/g, '#')     // number substitution is allowed
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/** Guard one proposed edit. Returns reasons; empty means allowed. */
export function checkEdit(edit) {
  const errs = [];
  const { range, value, name } = edit ?? {};
  const p = parseRange(range);
  if (!p) { errs.push(`range "${range}" is not <tab>!<COL><ROW> — refused`); return errs; }
  if (!WRITABLE[p.tab]) { errs.push(`${range}: tab "${p.tab}" is not writable by any route`); return errs; }
  const field = WRITABLE[p.tab][p.col];
  if (!field) {
    const allowed = Object.keys(WRITABLE[p.tab]).join(', ');
    errs.push(`${range}: column ${p.col} on ${p.tab} is not writable (writable: ${allowed}) — judgement and copy are never written`);
    return errs;
  }
  if (typeof name !== 'string' || name.trim() === '') errs.push(`${range}: no tool name given to check column A against`);
  // A widened column list is only safe if every value is traceable. A cell with
  // no citable source is an assertion, not a fact, so it is refused outright.
  if (typeof edit.source !== 'string' || !/^https?:\/\//.test(edit.source.trim())) {
    errs.push(`${range}: no source URL. Every write must cite the page it came from.`);
  }
  if (typeof value !== 'string') { errs.push(`${range}: value must be a string`); return errs; }

  if (field === 'last_checked' && !M_RE.test(value)) errs.push(`${range}: "${value}" is not DD MMM YYYY`);
  if (field === 'url' && !URL_RE.test(value)) errs.push(`${range}: "${value}" is not an http(s) URL`);
  if (LEGAL[field] && !LEGAL[field].includes(value)) errs.push(`${range}: "${value}" is not a legal ${field} (${LEGAL[field].join(' | ')})`);
  // Column D carve-out. A cost string carries editorial shape as well as a
  // number, so only a substitution inside the existing shape may be written.
  // Note shape_change can only ever REFUSE: it is the agent declaring a
  // restructure, never a way to force one through.
  if (field === 'cost') {
    if (edit.shape_change === true) {
      errs.push(`${range}: shape_change is true, so this is a pricing restructure. Flag it, do not write it.`);
    }
    if (typeof edit.old !== 'string') {
      errs.push(`${range}: a cost write must carry the old value so its shape can be compared`);
    } else if (costShape(edit.old) !== costShape(value)) {
      errs.push(`${range}: cost SHAPE changed, not just a number.\n      was: "${edit.old}"\n      now: "${value}"\n      A restructured tier, a renamed plan or a withdrawn free tier is Jasmin's call. Flag it.`);
    }
  }
  if (['nonprofit_tier', 'cost', 'name'].includes(field) && value.trim() === '') {
    errs.push(`${range}: ${field} must not be blank${field === 'nonprofit_tier' ? ' — use the literal "None"' : ''}`);
  }
  return errs;
}

/** Guard the whole batch. Throws on the first refusal, so nothing part-lands. */
export function checkBatch(edits) {
  if (!Array.isArray(edits) || edits.length === 0) throw new Error('diff contains no edits');
  const errs = edits.flatMap(checkEdit);
  if (errs.length) throw new Error(`REFUSED, batch not sent:\n  - ${errs.join('\n  - ')}`);
  return true;
}

/**
 * Compare column A as just read against the name each edit expects.
 * batchUpdate addresses cells by position, so a row inserted since the diff was
 * written would send every value to the wrong tool. Any single mismatch aborts
 * the ENTIRE batch, across every tab.
 *
 * colAByTab: { tools: [...], learning: [...] }, index 0 being sheet row 1.
 * A row whose name is legitimately being changed passes `oldName` to match on.
 */
export function checkNames(edits, colAByTab) {
  const bad = [];
  for (const e of edits) {
    const p = parseRange(e.range);
    const col = colAByTab[p.tab];
    if (!col) { bad.push(`${e.range}: column A of "${p.tab}" was not read`); continue; }
    const actual = (col[p.row - 1] ?? '').trim();
    const expect = (e.oldName ?? e.name).trim();
    if (actual !== expect) bad.push(`${e.range}: expected "${expect}", column A row ${p.row} of ${p.tab} reads "${actual}"`);
  }
  if (bad.length) throw new Error(`ABORTED, whole batch, name mismatch:\n  - ${bad.join('\n  - ')}`);
  return true;
}

/**
 * Turn a diff round, so a run can be undone in one command.
 * After a forward write, column A holds the forward `name`, so that becomes the
 * value the pre-send name check must match on the way back.
 */
export function invert(edits) {
  return edits.map(e => ({
    ...e,
    value:   e.old,
    old:     e.value,
    name:    e.oldName ?? e.name,
    oldName: e.name,
  }));
}

/** M is the site's claim that a check happened, so it is earned, not scheduled.
 *  Drop the stamp for any row whose other writes did not all verify. */
export function gateMStamps(edits, verifiedRanges) {
  const key = e => { const p = parseRange(e.range); return `${p.tab}!${p.row}`; };
  const failed = new Set(edits.filter(e => fieldOf(e.range) !== 'last_checked' && !verifiedRanges.has(e.range)).map(key));
  return {
    keep:    edits.filter(e => fieldOf(e.range) !== 'last_checked' || !failed.has(key(e))),
    dropped: edits.filter(e => fieldOf(e.range) === 'last_checked' && failed.has(key(e))),
  };
}

// ---------------------------------------------------------------- google auth
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
const saPath = () => process.env.SHEETS_SA || path.join(os.homedir(), '.config/the-edit/sheets-sa.json');

function gcloudToken(args) {
  const r = spawnSync('gcloud', args, { encoding: 'utf8' });
  if (r.status !== 0) return { ok: false, err: (r.stderr || r.error?.message || '').trim().slice(-300) };
  const tok = (r.stdout || '').trim();
  return tok ? { ok: true, tok } : { ok: false, err: 'gcloud returned an empty token' };
}

async function keyFileToken(p) {
  const sa = JSON.parse(fs.readFileSync(p, 'utf8'));
  const now = Math.floor(Date.now() / 1000);
  const b64 = o => Buffer.from(JSON.stringify(o)).toString('base64url');
  const head = b64({ alg: 'RS256', typ: 'JWT' });
  const body = b64({ iss: sa.client_email, scope: SCOPE, aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 });
  const sig = crypto.createSign('RSA-SHA256').update(`${head}.${body}`).sign(sa.private_key).toString('base64url');
  const res = await fetch('https://oauth2.googleapis.com/token', { method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${head}.${body}.${sig}` }) });
  if (!res.ok) throw new Error(`token exchange failed ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return (await res.json()).access_token;
}

export async function token() {
  const tried = [];
  const p = saPath();
  if (fs.existsSync(p)) { console.log(`auth: service account key at ${p}`); return keyFileToken(p); }
  tried.push(`no key file at ${p}`);

  const imp = process.env.SHEETS_SA_IMPERSONATE;
  if (imp) {
    const r = gcloudToken(['auth', 'print-access-token', `--impersonate-service-account=${imp}`, `--scopes=${SCOPE}`]);
    if (r.ok) { console.log(`auth: gcloud impersonating ${imp}`); return r.tok; }
    tried.push(`impersonating ${imp} failed: ${r.err}`);
  } else tried.push('SHEETS_SA_IMPERSONATE not set');

  const adc = gcloudToken(['auth', 'application-default', 'print-access-token']);
  if (adc.ok) { console.log('auth: gcloud ADC (writing as the signed-in user)'); return adc.tok; }
  tried.push(`ADC failed: ${adc.err}`);

  throw new Error(`no usable credential. Tried:\n  - ${tried.join('\n  - ')}`);
}

const api = async (tok, url, init = {}) => {
  const res = await fetch(url, { ...init, headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json', ...(init.headers || {}) } });
  if (!res.ok) throw new Error(`${init.method || 'GET'} ${url.slice(0, 90)} -> ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
};
const readRange = async (tok, range) =>
  (await api(tok, `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}`)).values || [];

// ---------------------------------------------------------------------- main
async function main() {
  const args = process.argv.slice(2);
  const file = args.find(a => !a.startsWith('--'));
  const commit = args.includes('--commit');
  if (!file) throw new Error('usage: node scripts/sheet-write.mjs <diff.json> [--commit]');

  const rollback = args.includes('--rollback');
  const diff = JSON.parse(fs.readFileSync(file, 'utf8'));
  const edits = rollback ? invert(diff.edits ?? []) : (diff.edits ?? []);
  checkBatch(edits);

  console.log(`\n${rollback ? 'ROLLBACK plan' : 'Plan'} (${edits.length} cell${edits.length === 1 ? '' : 's'}) from ${file}:`);
  for (const e of edits) {
    console.log(`  ${e.range.padEnd(16)} ${(fieldOf(e.range) || '').padEnd(16)} ${e.name}`);
    console.log(`${' '.repeat(4)}"${e.old ?? ''}"\n${' '.repeat(4)}  -> "${e.value}"`);
    console.log(`${' '.repeat(4)}source: ${e.source || '(none given)'}\n`);
  }
  if (!commit) { console.log('DRY RUN. Nothing sent. Re-run with --commit to write.\n'); return; }

  const tok = await token();

  const tabs = [...new Set(edits.map(e => parseRange(e.range).tab))];
  const colAByTab = {};
  for (const t of tabs) colAByTab[t] = (await readRange(tok, `${t}!A:A`)).map(r => r[0] ?? '');
  checkNames(edits, colAByTab);
  console.log(`\nColumn A re-read on ${tabs.join(', ')}: all ${edits.length} target row name(s) still match.`);

  await api(tok, `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values:batchUpdate`, {
    method: 'POST',
    body: JSON.stringify({ valueInputOption: 'RAW', data: edits.map(e => ({ range: e.range, values: [[e.value]] })) }),
  });

  const verified = new Set();
  const receipt = [];
  for (const e of edits) {
    const got = ((await readRange(tok, e.range))[0]?.[0] ?? '').trim();
    const ok = got === e.value;
    if (ok) verified.add(e.range);
    receipt.push(`  ${ok ? 'OK  ' : 'FAIL'} ${e.range.padEnd(16)} ${e.name.padEnd(24)} now reads "${got}"`);
  }
  const { dropped } = gateMStamps(edits, verified);

  console.log('\n=== RECEIPT ===');
  receipt.forEach(l => console.log(l));
  if (dropped.length) {
    console.log('\nlast_checked stamps to roll back (their row had a write that did not land):');
    dropped.forEach(e => console.log(`  ${e.range} -> restore "${e.old}"`));
    process.exitCode = 1;
  }
  console.log(`\n${verified.size}/${edits.length} cells written and confirmed.\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) main().catch(e => { console.error(`\n${e.message}\n`); process.exit(1); });
