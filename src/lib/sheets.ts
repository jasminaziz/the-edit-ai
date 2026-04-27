export interface Tool {
  name: string;
  category: string;
  status: 'in_stack' | 'on_radar';
  what_it_does: string;
  pricing: string;
  verdict: string;
  url: string;
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

export async function fetchTools(): Promise<Tool[]> {
  try {
    const res = await fetch(sheetsUrl('tools'));
    if (!res.ok) return [];
    const data = await res.json();
    const rows: string[][] = data.values || [];
    if (rows.length < 2) return [];
    return rows.slice(1).filter(r => r.length > 0 && r[0]).map(r => ({
      name: stripEmoji(r[0] || ''),
      category: stripEmoji(r[1] || ''),
      status: (r[2] || 'on_radar') as Tool['status'],
      what_it_does: '',
      pricing: stripEmoji(r[3] || ''),
      verdict: stripEmoji(r[4] || ''),
      url: r[5] || '',
    }));
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
  url: string;
  what_it_does: string;
  when_to_use: string;
  cost: string;
  verdict: string;
  phase: string;
}

export async function fetchDesignKit(): Promise<DesignKitItem[]> {
  try {
    const res = await fetch(sheetsUrl('design_kit'));
    if (!res.ok) return [];
    const data = await res.json();
    const rows: string[][] = data.values || [];
    if (rows.length < 2) return [];
    return rows.slice(1).filter(r => r.length > 0 && r[0]).map(r => ({
      name: stripEmoji(r[0] || ''),
      category: stripEmoji(r[1] || ''),
      url: r[2] || '',
      what_it_does: stripEmoji(r[3] || ''),
      when_to_use: stripEmoji(r[4] || ''),
      cost: stripEmoji(r[5] || ''),
      verdict: stripEmoji(r[6] || ''),
      phase: stripEmoji(r[7] || ''),
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
  why_it_matters: string;
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
      why_it_matters: stripEmoji(r[5] || ''),
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

export const STATUS_MAP: Record<string, { label: string; bg: string; text: string }> = {
  in_stack: { label: 'IN MY STACK', bg: '#2D6A4F', text: '#ffffff' },
  on_radar: { label: 'ON MY RADAR', bg: '#2D35C9', text: '#ffffff' },
};

export const RELEVANCE_MAP: Record<string, { label: string; bg: string; text: string }> = {
  high: { label: 'HIGH', bg: '#2D6A4F', text: '#ffffff' },
  worth_knowing: { label: 'WORTH KNOWING', bg: '#2D35C9', text: '#ffffff' },
  watch: { label: 'WATCH', bg: '#9B7B3A', text: '#ffffff' },
  know_about: { label: 'CAUTION', bg: '#C4461E', text: '#ffffff' },
};

export const CATEGORIES = [
  'ALL',
  'Writing',
  'Research',
  'Design',
  'Video',
  'Automation',
  'Building',
];
