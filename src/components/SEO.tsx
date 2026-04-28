import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonical: string;
  googleVerification?: string;
  jsonLd?: Record<string, unknown>;
}

export const SEO = ({ title, description, canonical, googleVerification, jsonLd }: SEOProps) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    {googleVerification && (
      <meta name="google-site-verification" content={googleVerification} />
    )}
    {jsonLd && (
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    )}
  </Helmet>
);
