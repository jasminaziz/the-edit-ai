import { LegalPage } from "@/components/LegalPage";

/**
 * Approved text, reports/2026-08-28-legal-pages-draft.md, signed by Jasmin.
 * Do not edit the wording here: this is content she signs, not copy-pack
 * strings a code session places.
 *
 * The version this replaced claimed essential cookies via Supabase managing a
 * subscription session, which was false, never mentioned analytics cookies,
 * and pointed readers at a consent banner that recorded a choice nothing
 * read. GA4 and that banner were removed in the commit before last, so the
 * page can now make the simplest claim available: there are no cookies.
 */
export default function CookiePolicy() {
  return (
    <LegalPage title="Cookies.">
      <h2>1. The short version.</h2>
      <p>
        The Edit sets no cookies. This page exists so you can check.
      </p>

      <h2>2. The slightly longer version.</h2>
      <p>
        No analytics, no tracking, no third-party scripts storing anything in your browser. If that ever changes, this page changes first and a consent banner arrives with it.
      </p>

      <h2>3. Questions.</h2>
      <p>
        <a href="mailto:hello@jasminaziz.co.uk">hello@jasminaziz.co.uk</a>.
      </p>
    </LegalPage>
  );
}
