import { LegalPage } from "@/components/LegalPage";

/**
 * Approved text, reports/2026-08-28-legal-pages-draft.md, signed by Jasmin.
 * Do not edit the wording here: this is content she signs, not copy-pack
 * strings a code session places.
 *
 * The version this replaced described newsletter capture into Supabase. That
 * write path was removed from the repo on 22 August, so the page had been
 * describing processing the site does not do. Capture is a Substack
 * subscription on Substack's infrastructure, and after the GA4 removal in the
 * previous commit the site runs no analytics at all, which is what lets
 * section 4 make the claim it makes.
 */
export default function PrivacyPolicy() {
  return (
    <LegalPage title="Privacy Policy." lastUpdated="August 2026">
      <h2>1. Who we are.</h2>
      <p>
        The Edit (theeditai.co.uk) is run by Jasmin Aziz, the strategic communications consultancy at jasminaziz.co.uk, based in Brighton, UK. This policy explains what happens to your data when you use the site. We operate under UK GDPR.
      </p>

      <h2>2. The newsletter and the template.</h2>
      <p>
        Email subscription is handled entirely by Substack. When you subscribe to get the AI-use policy template, you're subscribing to Jasmin's Substack publication, and Substack is the controller of that relationship; their privacy policy applies to it. The Edit itself runs no email capture and holds no subscriber list.
      </p>

      <h2>3. If you email us.</h2>
      <p>
        If you contact <a href="mailto:hello@jasminaziz.co.uk">hello@jasminaziz.co.uk</a>, we keep the correspondence for as long as the conversation needs and use it for nothing else.
      </p>

      <h2>4. What we don't do.</h2>
      <p>
        The site sets no cookies and runs no analytics. We don't sell data, we don't share it, and we can't lose what we never collected.
      </p>

      <h2>5. Your rights.</h2>
      <p>
        You can ask what we hold about you, ask for it to be corrected or deleted, and complain to the ICO (ico.org.uk) if you think we've handled your data badly. For anything in this policy: <a href="mailto:hello@jasminaziz.co.uk">hello@jasminaziz.co.uk</a>. For your Substack subscription, Substack's own tools let you unsubscribe or delete your account at any time.
      </p>
    </LegalPage>
  );
}
