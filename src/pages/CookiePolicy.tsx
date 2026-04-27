import { LegalPage } from "@/components/LegalPage";

export default function CookiePolicy() {
  return (
    <LegalPage title="Cookies.">
      <h2>1. What are Cookies?</h2>
      <p>
        Cookies are small files used to enhance your experience.
      </p>

      <h2>2. How We Use Them</h2>
      <p>
        We use essential cookies via Supabase to manage site functionality and your subscription session. These are necessary for the site to work correctly.
      </p>

      <h2>3. Management</h2>
      <p>
        You can accept or decline non-essential cookies via our consent banner or via your browser settings. For questions, contact <a href="mailto:hello@jasminaziz.co.uk">hello@jasminaziz.co.uk</a>.
      </p>
    </LegalPage>
  );
}
