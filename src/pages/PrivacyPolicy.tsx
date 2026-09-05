import { LegalPage } from "@/components/LegalPage";

/**
 * Approved text, reports/2026-08-28-legal-pages-draft.md, signed by Jasmin.
 * Do not edit the wording here: this is content she signs, not copy-pack
 * strings a code session places.
 *
 * Section 4's no-analytics claim rests on the GA4 removal of 28 Aug 2026 and
 * was verified again on 4 Sep: there is no analytics script of any kind in
 * src/ or index.html, and no third-party script tag at all.
 *
 * Section 2 was rewritten on 4 Sep 2026 (copywriter candidate 1, approved by
 * Jasmin, reports/2026-09-04-copy-candidates-privacy-and-conversion.md). Both
 * of its previous sentences had become false and they failed differently,
 * which is worth keeping because the second is the one that matters:
 *
 *  - It described subscribing to Substack in order to get the template. That
 *    gate was removed on 30 Aug 2026 and the template now downloads directly.
 *    Stale, and merely stale.
 *  - It claimed The Edit "holds no subscriber list". That was false, not
 *    stale. The Supabase `subscribers` table holds six addresses collected
 *    March to June 2026, three of them third parties. Jasmin ruled on 4 Sep
 *    that they are friends who tested the site and stay.
 *
 * The distinction the new text turns on is between what the site COLLECTS
 * (nothing, no mechanism exists) and what it HOLDS (a dormant legacy list).
 * Conflating those two is what produced the false claim. Do not "tidy" this
 * back into a single sentence saying nothing is held.
 *
 * Supabase is named on Jasmin's explicit call, for parallel treatment with
 * Substack. No retention position is stated, also her call: section 5 already
 * gives people the route to ask.
 *
 * Section 4 lost its closing clause, "and we can't lose what we never
 * collected", in the same change and on Jasmin's call. It was scoped to
 * cookies and analytics by the two clauses before it and was true in that
 * reading, but standing two paragraphs below a section that now admits a
 * legacy list, it read as a claim to hold nothing. Do not restore it while
 * section 2 says what it says.
 */
export default function PrivacyPolicy() {
  return (
    <LegalPage title="Privacy Policy." lastUpdated="September 2026">
      <h2>1. Who we are.</h2>
      <p>
        The Edit (theeditai.co.uk) is run by Jasmin Aziz, the strategic communications consultancy at jasminaziz.co.uk, based in Brighton, UK. This policy explains what happens to your data when you use the site. We operate under UK GDPR.
      </p>

      <h2>2. The newsletter and the template.</h2>
      <p>
        The AI-use policy template downloads straight from this site. No email, no sign-up: nothing is collected when you get it.
      </p>
      <p>
        The Edit runs no email capture of its own. It still holds a short list of email addresses in a Supabase database, collected while people tested an early version of the site between March and June 2026; nothing has been added to it since and none of it is used for marketing. Jasmin's separate Substack publication is optional and linked from the nav and footer. If you subscribe to it, Substack is the controller of that relationship and their privacy policy applies to it.
      </p>

      <h2>3. If you email us.</h2>
      <p>
        If you contact <a href="mailto:hello@jasminaziz.co.uk">hello@jasminaziz.co.uk</a>, we keep the correspondence for as long as the conversation needs and use it for nothing else.
      </p>

      <h2>4. What we don't do.</h2>
      <p>
        The site sets no cookies and runs no analytics. We don't sell data, we don't share it.
      </p>

      <h2>5. Your rights.</h2>
      <p>
        You can ask what we hold about you, ask for it to be corrected or deleted, and complain to the ICO (ico.org.uk) if you think we've handled your data badly. For anything in this policy: <a href="mailto:hello@jasminaziz.co.uk">hello@jasminaziz.co.uk</a>. For your Substack subscription, Substack's own tools let you unsubscribe or delete your account at any time.
      </p>
    </LegalPage>
  );
}
