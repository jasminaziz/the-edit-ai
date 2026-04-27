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
    const rows: string[][] = data.values || [];
    if (rows.length < 2) return [];
    // Header row: name, category, what_it_does, pricing, url, verdict, featured
    const header = (rows[0] || []).map(h => (h || '').toLowerCase().trim());
    const idx = (key: string) => header.indexOf(key);
    const iName = idx('name');
    const iCategory = idx('category');
    const iWhat = idx('what_it_does');
    const iPricing = idx('pricing');
    const iUrl = idx('url');
    const iVerdict = idx('verdict');
    const iFeatured = idx('featured');
    return rows.slice(1).filter(r => r.length > 0 && r[iName >= 0 ? iName : 0]).map(r => {
      const featuredRaw = (iFeatured >= 0 ? (r[iFeatured] || '') : '').toString().trim().toLowerCase();
      return {
        name: stripEmoji(r[iName >= 0 ? iName : 0] || ''),
        category: stripEmoji(r[iCategory >= 0 ? iCategory : 1] || ''),
        what_it_does: stripEmoji(r[iWhat >= 0 ? iWhat : 2] || ''),
        pricing: stripEmoji(r[iPricing >= 0 ? iPricing : 3] || ''),
        url: r[iUrl >= 0 ? iUrl : 4] || '',
        verdict: stripEmoji(r[iVerdict >= 0 ? iVerdict : 5] || ''),
        featured: featuredRaw === 'true' || featuredRaw === 'yes' || featuredRaw === '1',
      };
    });
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
