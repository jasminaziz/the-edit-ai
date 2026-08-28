import { useState } from "react";
import { CobaltZone } from "@/components/CobaltZone";
import { FloatingArrow } from "@/components/Illustrations";
import { SEO } from "@/components/SEO";

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
      <SEO
        title="Submit a Tool | The Edit"
        description="Suggest an AI tool for The Edit. Everything goes through the same checks: data, training policy, nonprofit pricing and the trustee test. No sponsored listings."
        canonical="https://theeditai.co.uk/submit"
      />
      <CobaltZone
        heading="Submit a Tool"
        subheading="Spotted something worth putting through the checks? Tell me about it."
        illustration={<FloatingArrow />}
      />

      <section className="bg-background py-16 px-6 sm:px-12">
        <div className="max-w-[640px] mx-auto">
          <a
            href="mailto:hello@jasminaziz.co.uk"
            className="flex items-center justify-center w-full h-14 font-heading font-semibold text-lg rounded-lg text-primary-foreground transition-all duration-150 hover:-translate-y-0.5"
            style={{ backgroundColor: "#2D35C9", textDecoration: "none" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "#1A22A8";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(45,53,201,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "#2D35C9";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            hello@jasminaziz.co.uk
          </a>
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
