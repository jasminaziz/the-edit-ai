import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonical: string;
  googleVerification?: string;
}

export const SEO = ({ title, description, canonical, googleVerification }: SEOProps) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    {googleVerification && (
      <meta name="google-site-verification" content={googleVerification} />
    )}
  </Helmet>
);
