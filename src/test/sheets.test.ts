import { describe, it, expect } from 'vitest';
import { parseToolRows } from '@/lib/sheets';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

/** All 13 columns: the original six plus the seven sector-axis fields. */
const FULL_HEADERS = [
  'name', 'category', 'status', 'cost', 'verdict', 'url',
  'jobs', 'data_location', 'trains_on_input', 'nonprofit_tier',
  'dpia_flag', 'trustee_note', 'last_checked',
];

/** Only the original six columns — simulates the Sheet before Oct columns are added. */
const LEGACY_HEADERS = ['name', 'category', 'status', 'cost', 'verdict', 'url'];

const BASE_ROW = ['Tool', 'Category', 'on_radar', 'Free', 'Some verdict', 'https://example.com'];

// ---------------------------------------------------------------------------
// parseToolRows
// ---------------------------------------------------------------------------

describe('parseToolRows', () => {
  // -------------------------------------------------------------------------
  // Edge cases
  // -------------------------------------------------------------------------

  it('returns [] when given no rows', () => {
    expect(parseToolRows([])).toEqual([]);
  });

  it('returns [] when only a header row is present (no data rows)', () => {
    expect(parseToolRows([FULL_HEADERS])).toEqual([]);
  });

  it('skips data rows with an empty name cell', () => {
    const rows = [
      LEGACY_HEADERS,
      ['', 'Research', 'on_radar', 'Free', 'Some verdict', 'https://example.com'],
      ['Perplexity', 'Research', 'on_radar', 'Free', 'Good for research', 'https://perplexity.ai'],
    ];
    const result = parseToolRows(rows);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Perplexity');
  });

  // -------------------------------------------------------------------------
  // All 13 columns present
  // -------------------------------------------------------------------------

  it('maps all 13 columns when present', () => {
    const rows = [
      FULL_HEADERS,
      [
        'Canva', 'Design', 'in_stack', 'Free / Pro £13/mo',
        'Great for comms teams', 'https://canva.com',
        'Social,Appeals & fundraising', 'US', 'No by default',
        'Canva Pro free for registered charities',
        'Green', 'Our design tool, free for us as a charity.', 'Oct 2026',
      ],
    ];
    const [tool] = parseToolRows(rows);

    expect(tool.name).toBe('Canva');
    expect(tool.category).toBe('Design');
    expect(tool.status).toBe('in_stack');
    expect(tool.pricing).toBe('Free / Pro £13/mo');
    expect(tool.verdict).toBe('Great for comms teams');
    expect(tool.url).toBe('https://canva.com');
    expect(tool.data_location).toBe('US');
    expect(tool.trains_on_input).toBe('No by default');
    expect(tool.nonprofit_tier).toBe('Canva Pro free for registered charities');
    expect(tool.dpia_flag).toBe('Green');
    expect(tool.trustee_note).toBe('Our design tool, free for us as a charity.');
    expect(tool.last_checked).toBe('Oct 2026');
  });

  it('accepts "cost" header as alias for pricing', () => {
    const rows = [
      LEGACY_HEADERS, // uses 'cost', not 'pricing'
      ['Notion', 'Research', 'on_radar', 'Free / £10 per user', 'Good for wikis', 'https://notion.so'],
    ];
    const [tool] = parseToolRows(rows);
    expect(tool.pricing).toBe('Free / £10 per user');
  });

  // -------------------------------------------------------------------------
  // Sector-axis columns absent (legacy Sheet, only A–F)
  // -------------------------------------------------------------------------

  it('returns empty jobs array and empty strings for sector fields when columns absent', () => {
    const rows = [
      LEGACY_HEADERS,
      ['Notion', 'Research', 'on_radar', 'Free', 'Good for wikis', 'https://notion.so'],
    ];
    const [tool] = parseToolRows(rows);
    expect(tool.jobs).toEqual([]);
    expect(tool.data_location).toBe('');
    expect(tool.trains_on_input).toBe('');
    expect(tool.nonprofit_tier).toBe('');
    expect(tool.dpia_flag).toBe('');
    expect(tool.trustee_note).toBe('');
    expect(tool.last_checked).toBe('');
  });

  // -------------------------------------------------------------------------
  // Jobs splitting
  // -------------------------------------------------------------------------

  describe('jobs parsing', () => {
    const JOBS_HEADERS = [...LEGACY_HEADERS, 'jobs'];

    it('splits on comma (primary Sheet separator)', () => {
      const rows = [JOBS_HEADERS, [...BASE_ROW, 'Social,Appeals & fundraising']];
      const [tool] = parseToolRows(rows);
      expect(tool.jobs).toEqual(['Social', 'Appeals & fundraising']);
    });

    it('splits on middle dot ·  (U+00B7)', () => {
      const rows = [JOBS_HEADERS, [...BASE_ROW, 'Social·Internal comms']];
      const [tool] = parseToolRows(rows);
      expect(tool.jobs).toEqual(['Social', 'Internal comms']);
    });

    it('splits on bullet •  (U+2022)', () => {
      const rows = [JOBS_HEADERS, [...BASE_ROW, 'Accessibility•Translation']];
      const [tool] = parseToolRows(rows);
      expect(tool.jobs).toEqual(['Accessibility', 'Translation']);
    });

    it('trims whitespace around each job after splitting', () => {
      const rows = [JOBS_HEADERS, [...BASE_ROW, ' Social , Appeals & fundraising ']];
      const [tool] = parseToolRows(rows);
      expect(tool.jobs).toEqual(['Social', 'Appeals & fundraising']);
    });

    it('returns [] when the jobs cell is empty', () => {
      const rows = [JOBS_HEADERS, [...BASE_ROW, '']];
      const [tool] = parseToolRows(rows);
      expect(tool.jobs).toEqual([]);
    });

    it('handles a single job with no separator', () => {
      const rows = [JOBS_HEADERS, [...BASE_ROW, 'Case studies & storytelling']];
      const [tool] = parseToolRows(rows);
      expect(tool.jobs).toEqual(['Case studies & storytelling']);
    });
  });

  // -------------------------------------------------------------------------
  // Emoji stripping
  // -------------------------------------------------------------------------

  describe('emoji stripping', () => {
    it('strips emoji from the name field', () => {
      const rows = [LEGACY_HEADERS, ['Gamma 🎨', 'Design', 'on_radar', 'Free', 'Good for decks', 'https://gamma.app']];
      const [tool] = parseToolRows(rows);
      expect(tool.name).toBe('Gamma');
    });

    it('strips emoji from the verdict field', () => {
      const rows = [LEGACY_HEADERS, ['Gamma', 'Design', 'on_radar', 'Free', 'Good for decks 🚀', 'https://gamma.app']];
      const [tool] = parseToolRows(rows);
      expect(tool.verdict).toBe('Good for decks');
    });

    it('strips emoji from sector-axis text fields', () => {
      const rows = [
        FULL_HEADERS,
        [
          'Tool', 'Category', 'on_radar', 'Free', 'Verdict', 'https://example.com',
          'Social', 'US 🇺🇸', 'No', 'None', 'Green', 'Safe to use ✅', 'Oct 2026',
        ],
      ];
      const [tool] = parseToolRows(rows);
      expect(tool.data_location).toBe('US');
      expect(tool.trustee_note).toBe('Safe to use');
    });

    it('does not mutate the url field (urls are not stripped)', () => {
      const rows = [LEGACY_HEADERS, ['Canva', 'Design', 'in_stack', 'Free', 'Good', 'https://canva.com']];
      const [tool] = parseToolRows(rows);
      expect(tool.url).toBe('https://canva.com');
    });
  });

  // -------------------------------------------------------------------------
  // Status fallback
  // -------------------------------------------------------------------------

  it('falls back to on_radar when status cell is empty', () => {
    const rows = [
      LEGACY_HEADERS,
      ['Perplexity', 'Research', '', 'Free', 'Good for research', 'https://perplexity.ai'],
    ];
    const [tool] = parseToolRows(rows);
    expect(tool.status).toBe('on_radar');
  });

  it('preserves in_stack status', () => {
    const rows = [
      LEGACY_HEADERS,
      ['Claude', 'Writing', 'in_stack', 'Pro £18/mo', 'Primary assistant', 'https://claude.ai'],
    ];
    const [tool] = parseToolRows(rows);
    expect(tool.status).toBe('in_stack');
  });
});
