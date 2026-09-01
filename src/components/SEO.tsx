import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonical: string;
  googleVerification?: string;
  jsonLd?: Record<string, unknown>;
  /**
   * Keeps a route out of the index. Added 1 Sep 2026 for the 404 only.
   *
   * vercel.json is a SPA catch-all, so an unknown URL returns 200 with a full
   * page body rather than a 404 status. Without this, every junk URL is an
   * indexable page carrying a self-referential canonical. index.html emits no
   * robots tag, so there is no static tag for this to coexist with and it needs
   * no data-rh counterpart.
   */
  noindex?: boolean;
}

export const SEO = ({ title, description, canonical, googleVerification, jsonLd, noindex }: SEOProps) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    {noindex && <meta name="robots" content="noindex, follow" />}
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    {googleVerification && (
      <meta name="google-site-verification" content={googleVerification} />
    )}
    {jsonLd && (
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    )}
  </Helmet>
);
