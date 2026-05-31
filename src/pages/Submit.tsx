import { useState } from "react";
import { CobaltZone } from "@/components/CobaltZone";
import { FloatingArrow } from "@/components/Illustrations";

const Submit = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    toolName: "",
    toolUrl: "",
    whySuggest: "",
    howUsing: "",
    yourName: "",
    yourEmail: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <CobaltZone
        heading="Submit a Tool"
        subheading="Spotted something worth adding to the stack? Tell me about it."
        illustration={<FloatingArrow />}
      />

      <section className="bg-background py-16 px-6 sm:px-12">
        <div className="max-w-[640px] mx-auto">
          {submitted ? (
            <div className="text-center py-16">
              <h2 className="font-heading font-semibold text-[28px] text-primary mb-6">
                Thank you, I'll take a look.
              </h2>
              <svg viewBox="0 0 300 20" className="mx-auto w-1/2" fill="none">
                <path
                  d="M0 10 Q37.5 -10 75 10 T150 10 T225 10 T300 10"
                  stroke="#C8F04A"
                  strokeWidth="4"
                  fill="none"
                />
              </svg>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField label="Tool name" placeholder="e.g. Notion, Descript, Runway">
                <input
                  type="text"
                  value={form.toolName}
                  onChange={(e) => handleChange("toolName", e.target.value)}
                  placeholder="e.g. Notion, Descript, Runway"
                  required
                  className="form-input"
                />
              </FormField>

              <FormField label="Tool URL" placeholder="https://">
                <input
                  type="url"
                  value={form.toolUrl}
                  onChange={(e) => handleChange("toolUrl", e.target.value)}
                  placeholder="https://"
                  required
                  className="form-input"
                />
              </FormField>

              <FormField label="Why are you suggesting this?" placeholder="What does it do? Who is it useful for?">
                <textarea
                  value={form.whySuggest}
                  onChange={(e) => handleChange("whySuggest", e.target.value)}
                  placeholder="What does it do? Who is it useful for?"
                  className="form-input"
                  style={{ height: 160 }}
                />
              </FormField>

              <FormField label="How are you using it?" placeholder="Be specific — the more context the better.">
                <textarea
                  value={form.howUsing}
                  onChange={(e) => handleChange("howUsing", e.target.value)}
                  placeholder="Be specific — the more context the better."
                  className="form-input"
                  style={{ height: 120 }}
                />
              </FormField>

              <FormField label="Your name" placeholder="First name is fine">
                <input
                  type="text"
                  value={form.yourName}
                  onChange={(e) => handleChange("yourName", e.target.value)}
                  placeholder="First name is fine"
                  className="form-input"
                />
              </FormField>

              <FormField label="Your email" placeholder="So I can follow up if needed">
                <input
                  type="email"
                  value={form.yourEmail}
                  onChange={(e) => handleChange("yourEmail", e.target.value)}
                  placeholder="So I can follow up if needed"
                  className="form-input"
                />
              </FormField>

              <button
                type="submit"
                className="w-full h-14 font-heading font-semibold text-lg rounded-lg text-primary-foreground transition-all duration-150 hover:-translate-y-0.5"
                style={{ backgroundColor: "#2D35C9" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#1A22A8";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(45,53,201,0.3)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#2D35C9";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                Submit suggestion
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
};

function FormField({ label, children }: { label: string; placeholder?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-body font-semibold text-[13px] text-foreground mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

export default Submit;
