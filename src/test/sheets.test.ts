import { describe, it, expect } from 'vitest';
import {
  parseToolRows,
  isComplete,
  normaliseDpiaFlag,
  hasNonprofitPricing,
  doesNotTrainOnInput,
  isDpiaGreen,
  type Tool,
} from '@/lib/sheets';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

/** All 14 columns: the original six, the seven sector-axis fields, and
 *  what_it_does in the Sheet's column N position. */
const FULL_HEADERS = [
  'name', 'category', 'status', 'cost', 'verdict', 'url',
  'jobs', 'data_location', 'trains_on_input', 'nonprofit_tier',
  'dpia_flag', 'trustee_note', 'last_checked', 'what_it_does',
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

  it('maps all 14 columns when present', () => {
    const rows = [
      FULL_HEADERS,
      [
        'Canva', 'Design', 'in_stack', 'Free / Pro £13/mo',
        'Great for comms teams', 'https://canva.com',
        'Social,Appeals & fundraising', 'US', 'No by default',
        'Canva Pro free for registered charities',
        'Green', 'Our design tool, free for us as a charity.', 'Oct 2026',
        'Design platform covering social graphics, presentations, video and print.',
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
    expect(tool.what_it_does).toBe(
      'Design platform covering social graphics, presentations, video and print.',
    );
  });

  // what_it_does is read by header name like every other column, so the same
  // aliases fetchMyStack accepts work here. The column is new (Sheet col N),
  // so a Sheet without it must still parse rather than throw.
  it('accepts "description" header as alias for what_it_does', () => {
    const rows = [
      [...LEGACY_HEADERS, 'description'],
      [...BASE_ROW, 'Sales and marketing CRM with a usable free tier.'],
    ];
    const [tool] = parseToolRows(rows);
    expect(tool.what_it_does).toBe('Sales and marketing CRM with a usable free tier.');
  });

  it('returns an empty what_it_does when the column is absent', () => {
    const [tool] = parseToolRows([LEGACY_HEADERS, BASE_ROW]);
    expect(tool.what_it_does).toBe('');
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

    // The job filter compares with ===, not a substring match, so a single
    // stray full stop in the Sheet silently removes a tool from that filter
    // with no visible error. Found live on the ChatGPT row, 2026-08-25.
    it('strips a trailing full stop so the job still matches the filter', () => {
      const rows = [JOBS_HEADERS, [...BASE_ROW, 'Research, Translation, Accessibility.']];
      const [tool] = parseToolRows(rows);
      expect(tool.jobs).toEqual(['Research', 'Translation', 'Accessibility']);
    });

    it('strips stray semicolons and colons around a job', () => {
      const rows = [JOBS_HEADERS, [...BASE_ROW, ' ;Social: , Internal comms; ']];
      const [tool] = parseToolRows(rows);
      expect(tool.jobs).toEqual(['Social', 'Internal comms']);
    });

    it('keeps the ampersand inside a job value untouched', () => {
      const rows = [JOBS_HEADERS, [...BASE_ROW, 'Appeals & fundraising.']];
      const [tool] = parseToolRows(rows);
      expect(tool.jobs).toEqual(['Appeals & fundraising']);
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

  it('preserves not_recommended status', () => {
    const rows = [
      LEGACY_HEADERS,
      ['DeepSeek', 'Writing', 'not_recommended', 'Free', 'Judged and failed', 'https://deepseek.com'],
    ];
    const [tool] = parseToolRows(rows);
    expect(tool.status).toBe('not_recommended');
  });

  it('accepts a mis-cased or padded status value', () => {
    const rows = [
      LEGACY_HEADERS,
      ['Grok', 'Writing', '  Not_Recommended ', 'Free', 'Judged and failed', 'https://x.ai'],
    ];
    const [tool] = parseToolRows(rows);
    expect(tool.status).toBe('not_recommended');
  });

  it('falls back to on_radar for an unrecognised status value', () => {
    const rows = [
      LEGACY_HEADERS,
      ['Something', 'Writing', 'archived', 'Free', 'A verdict', 'https://example.com'],
    ];
    const [tool] = parseToolRows(rows);
    expect(tool.status).toBe('on_radar');
  });
});

// ---------------------------------------------------------------------------
// Sector-axis predicates
// ---------------------------------------------------------------------------

/** A row with all seven axis fields filled. Overrides blank one field at a time. */
const COMPLETE: Tool = {
  name: 'Canva',
  category: 'Design',
  status: 'in_stack',
  what_it_does: '',
  pricing: 'Free / Pro',
  verdict: 'Some verdict',
  url: 'https://canva.com',
  jobs: ['Social', 'Appeals & fundraising'],
  data_location: 'US',
  trains_on_input: 'No by default',
  nonprofit_tier: 'Canva Pro free for registered charities',
  dpia_flag: 'Green',
  trustee_note: 'Our design tool, free for us as a charity.',
  last_checked: '23 Aug 2026',
};

const tool = (overrides: Partial<Tool> = {}): Tool => ({ ...COMPLETE, ...overrides });

describe('normaliseDpiaFlag', () => {
  it('passes the three canonical values through unchanged', () => {
    expect(normaliseDpiaFlag('Green')).toBe('Green');
    expect(normaliseDpiaFlag('Amber')).toBe('Amber');
    expect(normaliseDpiaFlag('Red')).toBe('Red');
  });

  it('resolves case and surrounding whitespace', () => {
    expect(normaliseDpiaFlag('green')).toBe('Green');
    expect(normaliseDpiaFlag('  AMBER  ')).toBe('Amber');
    expect(normaliseDpiaFlag('rEd')).toBe('Red');
  });

  it('returns "" for a value that is not one of the three', () => {
    expect(normaliseDpiaFlag('Amberish')).toBe('');
    expect(normaliseDpiaFlag('Grey')).toBe('');
    expect(normaliseDpiaFlag('')).toBe('');
    expect(normaliseDpiaFlag('   ')).toBe('');
  });
});

describe('isComplete', () => {
  it('is true when all seven axis fields hold a value', () => {
    expect(isComplete(COMPLETE)).toBe(true);
  });

  it('is false when jobs is empty', () => {
    expect(isComplete(tool({ jobs: [] }))).toBe(false);
  });

  const stringFields: Array<keyof Tool> = [
    'data_location',
    'trains_on_input',
    'nonprofit_tier',
    'dpia_flag',
    'trustee_note',
    'last_checked',
  ];

  for (const field of stringFields) {
    it(`is false when ${field} is blank`, () => {
      expect(isComplete(tool({ [field]: '' } as Partial<Tool>))).toBe(false);
    });

    it(`is false when ${field} is whitespace only`, () => {
      expect(isComplete(tool({ [field]: '   ' } as Partial<Tool>))).toBe(false);
    });
  }

  it('counts "None" as a value — a confirmed absence is a finding, not a gap', () => {
    expect(isComplete(tool({ nonprofit_tier: 'None' }))).toBe(true);
  });

  it('accepts a lower-case dpia_flag', () => {
    expect(isComplete(tool({ dpia_flag: 'green' }))).toBe(true);
  });

  it('is false when dpia_flag is not one of Green / Amber / Red', () => {
    // The chip has no fallback label, so a near-miss value must stay hidden
    // rather than render a chip with nothing in it.
    expect(isComplete(tool({ dpia_flag: 'Amberish' }))).toBe(false);
  });

  it('is false for a legacy row parsed without the axis columns', () => {
    const rows = [
      LEGACY_HEADERS,
      ['Perplexity', 'Research', 'on_radar', 'Free', 'Good for research', 'https://perplexity.ai'],
    ];
    const [parsed] = parseToolRows(rows);
    expect(isComplete(parsed)).toBe(false);
  });

  it('is true for a fully seeded row parsed straight from the Sheet', () => {
    const rows = [
      FULL_HEADERS,
      [
        'Canva', 'Design', 'in_stack', 'Free / Pro',
        'Some verdict', 'https://canva.com',
        'Social,Appeals & fundraising', 'US', 'No by default',
        'Canva Pro free for registered charities',
        'Green', 'Our design tool, free for us as a charity.', '23 Aug 2026',
      ],
    ];
    const [parsed] = parseToolRows(rows);
    expect(isComplete(parsed)).toBe(true);
  });
});

describe('toggle predicates', () => {
  describe('hasNonprofitPricing', () => {
    it('passes any real programme value', () => {
      expect(hasNonprofitPricing(tool({ nonprofit_tier: 'Canva Pro free for charities' }))).toBe(true);
    });

    it('fails on "None", which is a confirmed absence', () => {
      expect(hasNonprofitPricing(tool({ nonprofit_tier: 'None' }))).toBe(false);
      expect(hasNonprofitPricing(tool({ nonprofit_tier: 'none' }))).toBe(false);
    });

    it('fails on a blank cell', () => {
      expect(hasNonprofitPricing(tool({ nonprofit_tier: '' }))).toBe(false);
    });
  });

  describe('doesNotTrainOnInput', () => {
    it('passes "No"', () => {
      expect(doesNotTrainOnInput(tool({ trains_on_input: 'No' }))).toBe(true);
    });

    it('passes "No by default", any casing', () => {
      expect(doesNotTrainOnInput(tool({ trains_on_input: 'No by default' }))).toBe(true);
      expect(doesNotTrainOnInput(tool({ trains_on_input: 'no by default' }))).toBe(true);
    });

    it('does NOT pass "Varies by tier" — the locked rule, do not widen it', () => {
      expect(doesNotTrainOnInput(tool({ trains_on_input: 'Varies by tier' }))).toBe(false);
    });

    it('does not pass either Yes value', () => {
      expect(doesNotTrainOnInput(tool({ trains_on_input: 'Yes' }))).toBe(false);
      expect(doesNotTrainOnInput(tool({ trains_on_input: 'Yes unless you opt out' }))).toBe(false);
    });
  });

  describe('isDpiaGreen', () => {
    it('passes Green only, in any casing', () => {
      expect(isDpiaGreen(tool({ dpia_flag: 'Green' }))).toBe(true);
      expect(isDpiaGreen(tool({ dpia_flag: 'green' }))).toBe(true);
    });

    it('does not pass Amber or Red', () => {
      expect(isDpiaGreen(tool({ dpia_flag: 'Amber' }))).toBe(false);
      expect(isDpiaGreen(tool({ dpia_flag: 'Red' }))).toBe(false);
    });

    it('does not pass a blank or unrecognised flag', () => {
      expect(isDpiaGreen(tool({ dpia_flag: '' }))).toBe(false);
      expect(isDpiaGreen(tool({ dpia_flag: 'Amberish' }))).toBe(false);
    });
  });
});
