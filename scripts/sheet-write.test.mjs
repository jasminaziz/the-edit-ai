/**
 * Guards on the only path that writes to the Sheet.
 * Run: node --test scripts/sheet-write.test.mjs
 * Kept out of the vitest glob (src/**) on purpose: this is a script, not the app.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { checkEdit, checkBatch, checkNames, gateMStamps, invert, costShape, parseRange, fieldOf, WRITABLE } from './sheet-write.mjs';

test('a cost write that only substitutes a number or currency is allowed', () => {
  const base = { range: 'tools!D27', name: 'Canva', source: 'https://x.com/pricing' };
  assert.deepEqual(checkEdit({ ...base, old: 'Free tier / Pro £100 a year', value: 'Free tier / Pro £120 a year' }), []);
  assert.deepEqual(checkEdit({ ...base, old: 'Pro £100 a year', value: 'Pro $100 a year' }), []);  // currency swap ok
});

test('a cost RESTRUCTURE is refused, not written', () => {
  const base = { range: 'tools!D3', name: 'HubSpot', source: 'https://x.com/pricing' };
  // the real 30 August HubSpot case: flat monthly fee -> seat plus credits
  const errs = checkEdit({ ...base,
    old: 'Free CRM / Marketing Starter from £18 a month',
    value: '$20 per seat monthly, 500 credits, 1,000 contacts' });
  assert.ok(errs.length > 0);
  assert.match(errs[0], /SHAPE changed/);
  // a free tier being withdrawn is a shape change too
  assert.ok(checkEdit({ ...base, old: 'Free tier / Pro £100 a year', value: 'Pro £100 a year' }).length > 0);
});

test('shape_change can only refuse, never force a write through', () => {
  const base = { range: 'tools!D27', name: 'Canva', source: 'https://x.com/p',
                 old: 'Pro £100 a year', value: 'Pro £120 a year' };
  assert.deepEqual(checkEdit(base), []);                        // allowed without the flag
  const errs = checkEdit({ ...base, shape_change: true });      // declaring a restructure
  assert.ok(errs.length > 0);
  assert.match(errs[0], /restructure. Flag it/);
  // and it cannot be used to bypass the shape check either
  assert.ok(checkEdit({ ...base, value: '$20 per seat', shape_change: false }).length > 0);
});

test('a cost write without the old value is refused', () => {
  assert.ok(checkEdit({ range: 'tools!D27', name: 'Canva', value: 'Pro £120 a year',
                        source: 'https://x.com/p' }).length > 0);
});

test('costShape normalises only numbers and currency', () => {
  assert.equal(costShape('Pro £100 a year'), costShape('Pro $120 a year'));
  assert.notEqual(costShape('Free tier / Pro £100'), costShape('Pro £100'));
});

test('the writable fact columns are allowed', () => {
  for (const [r, v] of [
    ['tools!A40', 'Gemini Notebook'],  ['tools!F40', 'https://notebook.google.com'],
    ['tools!H27', 'US'], ['tools!I27', 'No by default'], ['tools!J27', 'None'], ['tools!M27', '31 Aug 2026'],
    ['my_stack!E12', 'https://notebook.google.com'], ['design_kit!E42', 'https://www.canva.com/mockups/'],
    ['learning!I2', 'https://academy.claude.com/courses/ai-fluency-framework-foundations'],
  ]) assert.deepEqual(checkEdit({ range: r, name: 'X', value: v, source: 'https://example.com/policy' }), [], `${r} should be allowed`);
});

test('an E-column write on tools is REFUSED (verdict is Jasmin\'s judgement)', () => {
  const errs = checkEdit({ range: 'tools!E27', name: 'Canva', value: 'anything at all' });
  assert.ok(errs.length > 0);
  assert.match(errs[0], /not writable/);
  assert.throws(() => checkBatch([{ range: 'tools!M27', name: 'Canva', value: '31 Aug 2026' },
                                  { range: 'tools!E27', name: 'Canva', value: 'x' }]), /REFUSED, batch not sent/);
});

test('judgement and copy columns on tools are refused', () => {
  for (const c of ['B', 'C', 'E', 'G', 'K', 'L', 'N'])
    assert.ok(checkEdit({ range: `tools!${c}27`, name: 'Canva', value: 'x' }).length > 0, `tools!${c} must be refused`);
});

test('column I is url on learning but trains_on_input on tools, and the guard knows', () => {
  assert.equal(fieldOf('learning!I2'), 'url');
  assert.equal(fieldOf('tools!I27'), 'trains_on_input');
  // a legal trains_on_input value is NOT a legal url on learning
  assert.ok(checkEdit({ range: 'learning!I2', name: 'X', value: 'No by default' }).length > 0);
  // and a url is not a legal trains_on_input on tools
  assert.ok(checkEdit({ range: 'tools!I27', name: 'X', value: 'https://example.com' }).length > 0);
});

test('non-url columns on the other tabs are refused', () => {
  for (const r of ['learning!A2', 'learning!F2', 'my_stack!F2', 'my_stack!C2', 'design_kit!I2', 'design_kit!C2'])
    assert.ok(checkEdit({ range: r, name: 'X', value: 'x' }).length > 0, `${r} must be refused`);
});

test('unknown tabs are refused, whats_new especially', () => {
  for (const r of ['whats_new!A2', 'whats_new!F2', 'Sheet1!A1', 'TOOLS!M27'])
    assert.ok(checkEdit({ range: r, name: 'X', value: 'x' }).length > 0, `${r} must be refused`);
});

test('malformed ranges fail closed', () => {
  for (const r of ['tools!M27:M28', 'tools!m27', 'M27', 'tools!M', 'tools!27', '', null, undefined, 42])
    assert.ok(checkEdit({ range: r, name: 'X', value: '31 Aug 2026' }).length > 0, `${String(r)} must be refused`);
});

test('illegal H and I values refused, legal ones pass', () => {
  assert.ok(checkEdit({ range: 'tools!H27', name: 'C', value: 'USA' }).length > 0);
  assert.ok(checkEdit({ range: 'tools!H27', name: 'C', value: 'us' }).length > 0);   // case matters
  assert.ok(checkEdit({ range: 'tools!I27', name: 'C', value: 'Maybe' }).length > 0);
  assert.deepEqual(checkEdit({ range: 'tools!I27', name: 'C', value: 'Varies by tier', source: 'https://example.com/p' }), []);
});

test('last_checked must be DD MMM YYYY', () => {
  for (const v of ['2026-08-31', '31 August 2026', '31 Aug 26', 'Aug 31 2026', '32 Aug 2026', ''])
    assert.ok(checkEdit({ range: 'tools!M27', name: 'C', value: v }).length > 0, `${v} must be refused`);
  assert.deepEqual(checkEdit({ range: 'tools!M27', name: 'C', value: '5 Sep 2026', source: 'https://example.com/p' }), []);
});

test('urls must be http(s) and names must not be blank', () => {
  for (const v of ['notebook.google.com', 'javascript:alert(1)', 'ftp://x.com', ''])
    assert.ok(checkEdit({ range: 'tools!F40', name: 'X', value: v }).length > 0, `${v} must be refused`);
  assert.ok(checkEdit({ range: 'tools!A40', name: 'X', value: '   ' }).length > 0);
  assert.ok(checkEdit({ range: 'tools!J27', name: 'X', value: '  ' }).length > 0);
});

test('a single name mismatch ABORTS THE WHOLE BATCH, across tabs', () => {
  const tools = Array(70).fill(''); tools[26] = 'Canva'; tools[39] = 'NotebookLM';
  const learning = Array(30).fill(''); learning[1] = 'SOMETHING ELSE';
  const edits = [
    { range: 'tools!M27', name: 'Canva', value: '31 Aug 2026' },
    { range: 'learning!I2', name: 'Anthropic Academy - AI Fluency Track', value: 'https://academy.claude.com/x' },
  ];
  assert.throws(() => checkNames(edits, { tools, learning }), /ABORTED, whole batch, name mismatch/);
  learning[1] = 'Anthropic Academy - AI Fluency Track';
  assert.equal(checkNames(edits, { tools, learning }), true);
});

test('a shifted row is caught (batchUpdate addresses by position)', () => {
  const tools = Array(70).fill(''); tools[27] = 'Canva';   // moved 27 -> 28
  assert.throws(() => checkNames([{ range: 'tools!M27', name: 'Canva', value: '31 Aug 2026' }], { tools }), /ABORTED/);
});

test('a rename matches on oldName, so renaming a row is not self-blocking', () => {
  const tools = Array(70).fill(''); tools[39] = 'NotebookLM';
  const e = [{ range: 'tools!A40', name: 'Gemini Notebook', oldName: 'NotebookLM', value: 'Gemini Notebook' }];
  assert.equal(checkNames(e, { tools }), true);
  tools[39] = 'Something Else';
  assert.throws(() => checkNames(e, { tools }), /ABORTED/);
});

test('last_checked is not stamped when its row had a write that did not land', () => {
  const edits = [
    { range: 'tools!H27', name: 'Canva', value: 'US' },
    { range: 'tools!M27', name: 'Canva', value: '31 Aug 2026' },
    { range: 'tools!M61', name: 'Google Workspace AI', value: '31 Aug 2026' },
  ];
  const { keep, dropped } = gateMStamps(edits, new Set(['tools!M27', 'tools!M61']));  // H27 did NOT verify
  assert.deepEqual(dropped.map(e => e.range), ['tools!M27']);
  assert.ok(keep.some(e => e.range === 'tools!M61'));    // stamp-only row unaffected
  assert.equal(gateMStamps(edits, new Set(['tools!H27', 'tools!M27', 'tools!M61'])).dropped.length, 0);
});

test('an empty diff is refused', () => {
  assert.throws(() => checkBatch([]), /no edits/);
  assert.throws(() => checkBatch(null), /no edits/);
});

test('the writable map itself has not silently grown', () => {
  assert.deepEqual(Object.keys(WRITABLE).sort(), ['design_kit', 'learning', 'my_stack', 'tools']);
  assert.deepEqual(Object.keys(WRITABLE.tools).sort(), ['A', 'D', 'F', 'H', 'I', 'J', 'M']);
  assert.deepEqual(Object.keys(WRITABLE.my_stack).sort(), ['A', 'E']);
  assert.deepEqual(Object.keys(WRITABLE.design_kit).sort(), ['A', 'E']);
  assert.deepEqual(Object.values(WRITABLE.learning), ['url'], 'learning may only write url');
  assert.equal(parseRange('tools!M27').row, 27);
});

test('a cell with no citable source is refused', () => {
  const base = { range: 'tools!M27', name: 'Canva', value: '31 Aug 2026' };
  for (const src of [undefined, '', '   ', 'the vendor page', 'canva.com'])
    assert.ok(checkEdit({ ...base, source: src }).length > 0, `source "${src}" must be refused`);
  assert.deepEqual(checkEdit({ ...base, source: 'https://www.canva.com/policies/privacy-policy/' }), []);
});

test('rollback turns a diff round, including a rename', () => {
  const fwd = [
    { range: 'tools!A40', name: 'Gemini Notebook', oldName: 'NotebookLM', old: 'NotebookLM', value: 'Gemini Notebook', source: 'https://x.com/a' },
    { range: 'tools!M40', name: 'Gemini Notebook', oldName: 'NotebookLM', old: '24 Aug 2026', value: '31 Aug 2026', source: 'https://x.com/b' },
  ];
  const back = invert(fwd);
  assert.equal(back[0].value, 'NotebookLM');
  assert.equal(back[1].value, '24 Aug 2026');
  // after the forward write column A reads "Gemini Notebook", so that is what
  // the rollback must match on
  const tools = Array(70).fill(''); tools[39] = 'Gemini Notebook';
  assert.equal(checkNames(back, { tools }), true);
  tools[39] = 'NotebookLM';                       // forward write never landed
  assert.throws(() => checkNames(back, { tools }), /ABORTED/);
  assert.deepEqual(checkBatch(back), true);       // still passes every guard
  assert.deepEqual(invert(back).map(e => e.value), ['Gemini Notebook', '31 Aug 2026']);  // round trip
});

test('name is writable on my_stack and design_kit, still refused on learning', () => {
  const src = 'https://example.com/p';
  assert.deepEqual(checkEdit({ range: 'my_stack!A12', name: 'X', value: 'Gemini Notebook', source: src }), []);
  assert.deepEqual(checkEdit({ range: 'design_kit!A5', name: 'X', value: 'Something', source: src }), []);
  assert.ok(checkEdit({ range: 'learning!A2', name: 'X', value: 'Claude Academy', source: src }).length > 0);
});
