export interface Tool {
  name: string;
  category: string;
  what_it_does: string;
  my_use_case: string;
  free_tier: string;
  cost: string;
  status: 'in_stack' | 'trialling' | 'queued' | 'watch' | 'know_about';
  credibility: string;
  quick_notes: string;
  key_integrations: string;
  verdict: string;
  url: string;
}

export interface WhatsNew {
  name: string;
  developer: string;
  launched: string;
  what_it_is: string;
  key_integrations: string;
  watch_out_for: string;
  relevance: string;
  status: string;
  verdict: string;
  relevance_level: 'high' | 'worth_knowing' | 'watch' | 'know_about';
  batch: string;
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
    if (!res.ok) {
      const { MOCK_TOOLS } = await import('./mockData');
      return MOCK_TOOLS;
    }
    const data = await res.json();
    const rows: string[][] = data.values || [];
    if (rows.length < 2) {
      const { MOCK_TOOLS } = await import('./mockData');
      return MOCK_TOOLS;
    }
    return rows.slice(1).filter(r => r.length > 0 && r[0]).map(r => ({
      name: stripEmoji(r[0] || ''),
      category: stripEmoji(r[1] || ''),
      what_it_does: stripEmoji(r[2] || ''),
      my_use_case: stripEmoji(r[3] || ''),
      free_tier: stripEmoji(r[4] || ''),
      cost: stripEmoji(r[5] || ''),
      status: (r[6] || 'know_about') as Tool['status'],
      credibility: stripEmoji(r[7] || ''),
      quick_notes: stripEmoji(r[8] || ''),
      key_integrations: stripEmoji(r[9] || ''),
      verdict: stripEmoji(r[10] || ''),
      url: r[11] || '',
    }));
  } catch {
    const { MOCK_TOOLS } = await import('./mockData');
    return MOCK_TOOLS;
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
      launched: stripEmoji(r[2] || ''),
      what_it_is: stripEmoji(r[3] || ''),
      key_integrations: stripEmoji(r[4] || ''),
      watch_out_for: stripEmoji(r[5] || ''),
      relevance: stripEmoji(r[6] || ''),
      status: stripEmoji(r[7] || ''),
      verdict: stripEmoji(r[8] || ''),
      relevance_level: (r[9] || 'know_about') as WhatsNew['relevance_level'],
      batch: stripEmoji(r[10] || ''),
    }));
  } catch {
    return [];
  }
}

export const STATUS_MAP: Record<string, { label: string; bg: string; text: string }> = {
  in_stack: { label: 'IN STACK', bg: '#2D6A4F', text: '#ffffff' },
  trialling: { label: 'TRIALLING', bg: '#2D35C9', text: '#ffffff' },
  queued: { label: 'QUEUED', bg: '#4A4A9A', text: '#ffffff' },
  watch: { label: 'WATCH', bg: '#9B7B3A', text: '#ffffff' },
  know_about: { label: 'KNOW ABOUT', bg: '#9A8F82', text: '#ffffff' },
};

export const RELEVANCE_MAP: Record<string, { label: string; bg: string; text: string }> = {
  high: { label: 'HIGH', bg: '#2D6A4F', text: '#ffffff' },
  worth_knowing: { label: 'WORTH KNOWING', bg: '#2D35C9', text: '#ffffff' },
  watch: { label: 'WATCH', bg: '#9B7B3A', text: '#ffffff' },
  know_about: { label: 'CAUTION', bg: '#C4461E', text: '#ffffff' },
};

export const CATEGORIES = [
  'ALL',
  'Writing & Strategy',
  'Research & Knowledge',
  'Design & Image',
  'Video & Audio',
  'Automation & CRM',
  'Building & Deployment',
  'App Infrastructure',
  'Claude & AI Skills',
  'Productivity & Voice',
  'API & Developer Tools',
  'CV & Prior Experience',
];
