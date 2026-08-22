import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { SEO } from '@/components/SEO';

// ---------------------------------------------------------------------------
// Fixtures — test-only strings, not visitor-facing copy
// ---------------------------------------------------------------------------

const PROPS = {
  title: 'Fixture Title | The Edit',
  description: 'Fixture description for the SEO component test.',
  canonical: 'https://theeditai.co.uk/fixture',
};

/**
 * Render through Helmet's SSR context so tag output is synchronous.
 * jsdom makes Helmet take the browser path (async, writes to document.head),
 * so force the server path via the documented canUseDOM test hook.
 */
const renderSEO = (props: Parameters<typeof SEO>[0]) => {
  (HelmetProvider as unknown as { canUseDOM: boolean }).canUseDOM = false;
  try {
    const context: { helmet?: { title: object; meta: object; link: object } } = {};
    renderToStaticMarkup(
      <HelmetProvider context={context}>
        <SEO {...props} />
      </HelmetProvider>,
    );
    const helmet = context.helmet!;
    return {
      title: String(helmet.title),
      meta: String(helmet.meta),
      link: String(helmet.link),
    };
  } finally {
    (HelmetProvider as unknown as { canUseDOM: boolean }).canUseDOM = true;
  }
};

describe('SEO component', () => {
  it('emits title, description and canonical as before', () => {
    const out = renderSEO(PROPS);
    expect(out.title).toContain('Fixture Title | The Edit');
    expect(out.meta).toContain('Fixture description for the SEO component test.');
    expect(out.link).toContain('rel="canonical"');
    expect(out.link).toContain('https://theeditai.co.uk/fixture');
  });

  it('emits per-page og tags derived from the same props', () => {
    const out = renderSEO(PROPS);
    expect(out.meta).toContain('property="og:title"');
    expect(out.meta).toContain('property="og:description"');
    expect(out.meta).toContain('property="og:url"');
    expect(out.meta).toMatch(/og:url"[^>]*content="https:\/\/theeditai\.co\.uk\/fixture"|content="https:\/\/theeditai\.co\.uk\/fixture"[^>]*og:url"/);
  });

  it('emits per-page twitter title and description', () => {
    const out = renderSEO(PROPS);
    expect(out.meta).toContain('name="twitter:title"');
    expect(out.meta).toContain('name="twitter:description"');
  });

  it('does not emit og:image or og:type (sitewide statics own those until B5)', () => {
    const out = renderSEO(PROPS);
    expect(out.meta).not.toContain('og:image');
    expect(out.meta).not.toContain('og:type');
  });

  it('omits google-site-verification and JSON-LD unless provided', () => {
    const out = renderSEO(PROPS);
    expect(out.meta).not.toContain('google-site-verification');
    const withExtras = renderSEO({
      ...PROPS,
      googleVerification: 'fixture-token',
      jsonLd: { '@type': 'WebSite' },
    });
    expect(withExtras.meta).toContain('fixture-token');
  });
});
