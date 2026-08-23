export interface Tool {
  name: string;
  category: string;
  status: 'in_stack' | 'on_radar';
  what_it_does: string;   // vestigial — no Sheet column, always ''
  pricing: string;
  verdict: string;
  url: string;
  // Sector-axis fields (cols G–M). Empty / [] when the column is absent from the Sheet.
  jobs: string[];          // parsed from comma-, ·-, or •-separated cell
  data_location: string;   // UK | EU | EU option | US | Unclear
  trains_on_input: string; // No | No by default | Yes unless you opt out | Yes | Varies by tier
  nonprofit_tier: string;  // programme description, or "None"
  dpia_flag: string;       // Green | Amber | Red (or '' while unverified)
  trustee_note: string;    // one sentence for a board meeting
  last_checked: string;    // date the facts were last verified, e.g. "Oct 2026"
}

export interface WhatsNew {
  name: string;
  developer: string;
  date: string;
  what_it_is: string;
  category: string;
  url: string;
}

/** Strip emoji characters from text — keep only standard text, punctuation, and symbols */
function stripEmoji(str: string): string {
  return str.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').replace(/\s{2,}/g, ' ').trim();
}

function sheetsUrl(tab: string): string {
  const sheetId = import.meta.env.VITE_GOOGLE_SHEETS_ID || '';
  const apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || '';
  return `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(tab)}?key=${apiKey}`;
}

/** Normalise a header cell to a safe identifier key. Matches the pattern used in
 *  fetchMyStack and fetchDesignKit so all fetchers behave consistently. */
function normHeader(s: unknown): string {
  return String(s ?? '')
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

/**
 * Parse raw Sheets rows (including header row) into Tool objects.
 * Exported so it can be unit-tested without mocking fetch.
 *
 * Column lookup is by header name, not fixed position, so adding or reordering
 * Sheet columns does not silently break anything. The header row must be row 0.
 * "cost" is accepted as an alias for "pricing" (the Sheet uses "cost").
 */
export function parseToolRows(rows: string[][]): Tool[] {
  if (rows.length < 2) return [];

  const header = (rows[0] || []).map(normHeader);
  const findIdx = (...keys: string[]): number => {
    for (const k of keys) {
      const i = header.indexOf(k);
      if (i >= 0) return i;
    }
    return -1;
  };

  const iName     = findIdx('name');
  const iCategory = findIdx('category');
  const iStatus   = findIdx('status');
  const iPricing  = findIdx('pricing', 'cost'); // Sheet header is "cost"
  const iVerdict  = findIdx('verdict');
  const iUrl      = findIdx('url');
  // Sector-axis — absent until the Sheet columns are added; findIdx returns -1,
  // cell() returns '', which is the safe default.
  const iJobs         = findIdx('jobs');
  const iDataLocation = findIdx('data_location');
  const iTrains       = findIdx('trains_on_input');
  const iNonprofit    = findIdx('nonprofit_tier');
  const iDpia         = findIdx('dpia_flag');
  const iTrustee      = findIdx('trustee_note');
  const iLastChecked  = findIdx('last_checked');

  const cell = (r: string[], i: number): string =>
    i >= 0 && i < r.length ? r[i] : '';

  return rows
    .slice(1)
    .filter(r => r.length > 0 && cell(r, iName))
    .map(r => {
      const rawJobs = cell(r, iJobs);
      return {
        name:            stripEmoji(cell(r, iName)),
        category:        stripEmoji(cell(r, iCategory)),
        status:          (cell(r, iStatus) || 'on_radar') as Tool['status'],
        what_it_does:    '',
        pricing:         stripEmoji(cell(r, iPricing)),
        verdict:         stripEmoji(cell(r, iVerdict)),
        url:             cell(r, iUrl),
        jobs:            rawJobs
                           ? rawJobs.split(/[,·•]+/).map(s => stripEmoji(s).trim()).filter(Boolean)
                           : [],
        data_location:   stripEmoji(cell(r, iDataLocation)),
        trains_on_input: stripEmoji(cell(r, iTrains)),
        nonprofit_tier:  stripEmoji(cell(r, iNonprofit)),
        dpia_flag:       stripEmoji(cell(r, iDpia)),
        trustee_note:    stripEmoji(cell(r, iTrustee)),
        last_checked:    stripEmoji(cell(r, iLastChecked)),
      };
    });
}

// ---------------------------------------------------------------------------
// Sector-axis predicates
// ---------------------------------------------------------------------------

/** Trim and lowercase. The single normalisation used for every axis value
 *  comparison, so casing or stray whitespace in the Sheet never changes
 *  behaviour. */
function normValue(s: string): string {
  return String(s ?? '').trim().toLowerCase();
}

/**
 * Resolve a raw dpia_flag cell to its canonical value, or '' when it is not
 * one of the three allowed values. "green", " Green " and "GREEN" all
 * resolve; "Amberish" does not.
 *
 * The DPIA chip has no fallback rendering, so an unrecognised flag must never
 * reach the card. isComplete() uses this to keep such a row hidden, and the
 * chip lookup uses it so a lower-case Sheet value still renders.
 */
export function normaliseDpiaFlag(flag: string): 'Green' | 'Amber' | 'Red' | '' {
  switch (normValue(flag)) {
    case 'green': return 'Green';
    case 'amber': return 'Amber';
    case 'red':   return 'Red';
    default:      return '';
  }
}

/**
 * A row is complete when all seven axis fields hold a value. "None" counts as
 * a value (a confirmed finding); blank does not (unfinished work). dpia_flag
 * must additionally be a canonical Green / Amber / Red.
 *
 * Used in exactly two places, deliberately: the directory grid renders
 * complete rows only, and the homepage counter counts them. One predicate
 * means the number on the homepage and the cards on the grid cannot disagree.
 * See reports/2026-08-23-axis-locked.md.
 */
export function isComplete(tool: Tool): boolean {
  return (
    tool.jobs.length > 0 &&
    tool.data_location.trim() !== '' &&
    tool.trains_on_input.trim() !== '' &&
    tool.nonprofit_tier.trim() !== '' &&
    tool.trustee_note.trim() !== '' &&
    tool.last_checked.trim() !== '' &&
    normaliseDpiaFlag(tool.dpia_flag) !== ''
  );
}

// The three sector toggles. Pass rules are frozen in the locked axis spec and
// must not be widened here. Incomplete rows never reach a toggle because they
// never render.

/** Toggle "Has nonprofit pricing": any nonprofit_tier value except None. */
export function hasNonprofitPricing(tool: Tool): boolean {
  const v = normValue(tool.nonprofit_tier);
  return v !== '' && v !== 'none';
}

/** Toggle "Doesn't train on your content": No and No by default only.
 *  "Varies by tier" deliberately does not pass. */
export function doesNotTrainOnInput(tool: Tool): boolean {
  const v = normValue(tool.trains_on_input);
  return v === 'no' || v === 'no by default';
}

/** Toggle "DPIA unlikely": a dpia_flag of Green only. Named for the data
 *  value it reads, not the chip label it drives. Do not rename it to match
 *  the microcopy: the label can change, the Sheet value cannot. */
export function isDpiaGreen(tool: Tool): boolean {
  return normaliseDpiaFlag(tool.dpia_flag) === 'Green';
}

export async function fetchTools(): Promise<Tool[]> {
  try {
    const res = await fetch(sheetsUrl('tools'));
    if (!res.ok) return [];
    const data = await res.json();
    return parseToolRows(data.values || []);
  } catch {
    return [];
  }
}

export async function fetchWhatsNew(): Promise<WhatsNew[]> {
  try {
    const res = await fetch(sheetsUrl('whats_new'));
    if (!res.ok) return [];
    const data = await res.json();
    const rows: string[][] = data.values || [];
    if (rows.length < 2) return [];
    return rows.slice(1).filter(r => r.length > 0 && r[0]).map(r => ({
      name: stripEmoji(r[0] || ''),
      developer: stripEmoji(r[1] || ''),
      date: stripEmoji(r[2] || ''),
      what_it_is: stripEmoji(r[3] || ''),
      category: stripEmoji(r[4] || ''),
      url: r[5] || '',
    }));
  } catch {
    return [];
  }
}

export interface DesignKitItem {
  name: string;
  category: string;
  phase: string;
  group: string;
  url: string;
  when_to_use: string;
  cost: string;
  verdict: string;
}

export async function fetchDesignKit(): Promise<DesignKitItem[]> {
  try {
    const res = await fetch(sheetsUrl('design_kit'));
    if (!res.ok) return [];
    const data = await res.json();
    const rows: string[][] = data.values || [];
    if (rows.length < 2) return [];

    // Header-name lookup — column positions in the sheet may change.
    const norm = (s: unknown) =>
      String(s ?? '')
        .toLowerCase()
        .trim()
        .replace(/[\s-]+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
    const header = (rows[0] || []).map(norm);
    const findIdx = (...keys: string[]) => {
      for (const k of keys) {
        const i = header.indexOf(k);
        if (i >= 0) return i;
      }
      return -1;
    };
    const iName = findIdx('name');
    const iCategory = findIdx('category');
    const iPhase = findIdx('phase');
    const iGroup = findIdx('group');
    const iUrl = findIdx('url');
    const iWhenToUse = findIdx('when_to_use');
    const iCost = findIdx('cost');
    const iVerdict = findIdx('verdict');

    // Surface missing required columns once for debugging.
    const missing: string[] = [];
    if (iPhase < 0) missing.push('phase');
    if (iGroup < 0) missing.push('group');
    if (iWhenToUse < 0) missing.push('when_to_use');
    if (iVerdict < 0) missing.push('verdict');
    if (missing.length) {
      console.warn('[design_kit] missing expected columns:', missing.join(', '), 'headers seen:', header);
    }

    const cell = (r: string[], i: number) => (i >= 0 && i < r.length ? r[i] : '');

    return rows.slice(1)
      .filter(r => r.length > 0 && (iName >= 0 ? r[iName] : r[0]))
      .map(r => ({
        name: stripEmoji(cell(r, iName)),
        category: stripEmoji(cell(r, iCategory)),
        phase: stripEmoji(cell(r, iPhase)),
        group: stripEmoji(cell(r, iGroup)),
        url: cell(r, iUrl) || '',
        when_to_use: stripEmoji(cell(r, iWhenToUse)),
        cost: stripEmoji(cell(r, iCost)),
        verdict: stripEmoji(cell(r, iVerdict)),
      }));
  } catch {
    return [];
  }
}

export interface LearningItem {
  name: string;
  category: string;
  type: string;
  provider: string;
  what_it_is: string;
  why_i_recommend: string;
  time: string;
  cost: string;
  url: string;
}

export async function fetchLearning(): Promise<LearningItem[]> {
  try {
    const res = await fetch(sheetsUrl('learning'));
    if (!res.ok) return [];
    const data = await res.json();
    const rows: string[][] = data.values || [];
    if (rows.length < 2) return [];
    return rows.slice(1).filter(r => r.length > 0 && r[0]).map(r => ({
      name: stripEmoji(r[0] || ''),
      category: stripEmoji(r[1] || ''),
      type: stripEmoji(r[2] || ''),
      provider: stripEmoji(r[3] || ''),
      what_it_is: stripEmoji(r[4] || ''),
      why_i_recommend: stripEmoji(r[5] || ''),
      time: stripEmoji(r[6] || ''),
      cost: stripEmoji(r[7] || ''),
      url: r[8] || '',
    }));
  } catch {
    return [];
  }
}

export interface MyStackItem {
  name: string;
  category: string;
  what_it_does: string;
  pricing: string;
  url: string;
  verdict: string;
  featured: boolean;
}

export async function fetchMyStack(): Promise<MyStackItem[]> {
  try {
    const res = await fetch(sheetsUrl('my_stack'));
    if (!res.ok) return [];
    const data = await res.json();
    const rows: (string | boolean)[][] = data.values || [];
    if (rows.length < 2) return [];
    // Normalize header: lowercase, trim, collapse spaces -> underscores, strip non-alphanumerics
    const norm = (s: unknown) =>
      String(s ?? '')
        .toLowerCase()
        .trim()
        .replace(/[\s-]+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
    const header = (rows[0] || []).map(norm);
    const findIdx = (...keys: string[]) => {
      for (const k of keys) {
        const i = header.indexOf(k);
        if (i >= 0) return i;
      }
      return -1;
    };
    const iName = findIdx('name', 'tool', 'tool_name');
    const iCategory = findIdx('category');
    const iWhat = findIdx('what_it_does', 'whatitdoes', 'description');
    const iPricing = findIdx('pricing', 'price', 'cost');
    const iUrl = findIdx('url', 'link', 'website');
    const iVerdict = findIdx('verdict', 'review', 'notes');
    const iFeatured = findIdx('featured', 'is_featured', 'feature');

    const cell = (row: (string | boolean)[], i: number) =>
      i >= 0 && i < row.length ? row[i] : '';

    const items: MyStackItem[] = [];
    for (const r of rows.slice(1)) {
      const nameVal = String(cell(r, iName) ?? '').trim();
      if (!nameVal) continue;
      const featuredRaw = String(cell(r, iFeatured) ?? '').trim().toLowerCase();
      items.push({
        name: stripEmoji(String(cell(r, iName) ?? '')),
        category: stripEmoji(String(cell(r, iCategory) ?? '')),
        what_it_does: stripEmoji(String(cell(r, iWhat) ?? '')),
        pricing: stripEmoji(String(cell(r, iPricing) ?? '')),
        url: String(cell(r, iUrl) ?? '').trim(),
        verdict: stripEmoji(String(cell(r, iVerdict) ?? '')),
        featured: featuredRaw === 'true' || featuredRaw === 'yes' || featuredRaw === '1' || featuredRaw === 'y',
      });
    }
    return items;
  } catch {
    return [];
  }
}

/**
 * The filter rail above the directory grid: the six comms jobs from the locked
 * axis, not tool types. The re-point judges a tool by the job it serves, so
 * "Writing / Research / Design / Video / Automation / Building" is retired.
 *
 * A tool can hold more than one job, so the filter matches on contains, not
 * equals. See reports/2026-08-23-axis-locked.md.
 */
export const CATEGORIES = [
  'ALL',
  'Appeals & fundraising',
  'Case studies & storytelling',
  'Social',
  'Internal comms',
  'Accessibility',
  'Translation',
];
