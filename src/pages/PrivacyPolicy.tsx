import { LegalPage } from "@/components/LegalPage";

export default function PrivacyPolicy() {
  return (
    <LegalPage title="Privacy Policy." lastUpdated="April 2026">
      <h2>1. Introduction</h2>
      <p>
        The Edit (The Edit AI) is committed to protecting your privacy. This policy explains how Jasmin Aziz, trading as The Edit, handles your data. We operate in accordance with UK GDPR.
      </p>

      <h2>2. Data Collection</h2>
      <p>
        We collect your email address when you voluntarily subscribe to our newsletter. This data is processed based on your consent.
      </p>

      <h2>3. Use of Data &amp; Storage</h2>
      <p>
        We use your email address exclusively to send you AI verdicts and updates. We use Supabase as our data processor to securely store your information. We do not sell or share your data with third parties.
      </p>

      <h2>4. Your Rights</h2>
      <p>
        You have the right to access, update, or delete your data at any time. You can withdraw consent by clicking 'Unsubscribe' in any email or by contacting us at <a href="mailto:hello@jasminaziz.co.uk">hello@jasminaziz.co.uk</a>.
      </p>

      <h2>5. Contact</h2>
      <p>
        The Edit is based in Brighton, UK. For privacy inquiries, please email <a href="mailto:hello@jasminaziz.co.uk">hello@jasminaziz.co.uk</a>.
      </p>
    </LegalPage>
  );
}
