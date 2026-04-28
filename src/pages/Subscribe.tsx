import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Check } from "lucide-react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

type FormState = "idle" | "submitting" | "success" | "duplicate" | "error";

function SuccessMessage() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <div
      style={{
        transition: "opacity 400ms ease-out, transform 400ms ease-out",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "#C8F04A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <Check size={28} color="#1A1510" strokeWidth={3} />
      </div>
      <h2
        className="font-heading"
        style={{ fontWeight: 700, fontSize: 36, color: "#2D35C9", margin: 0 }}
      >
        You're in.
      </h2>
      <p
        className="font-body"
        style={{ fontWeight: 400, fontSize: 15, color: "#9A8F82", marginTop: 8 }}
      >
        Next edition coming soon.
      </p>
    </div>
  );
}

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [context, setContext] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");

  if (!SUPABASE_URL || !SUPABASE_KEY) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setFormState("submitting");

    const { error } = await supabase.from("subscribers" as any).insert({
      email: email.trim(),
      first_name: firstName.trim() || null,
      context: context || null,
      source: "website",
      status: "active",
    } as any);

    if (!error) {
      setFormState("success");
      return;
    }

    if (error.code === "23505") {
      setFormState("duplicate");
    } else {
      setFormState("error");
    }
  };

  const clearError = () => {
    if (formState === "duplicate" || formState === "error") {
      setFormState("idle");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid #E8E2D8",
    borderRadius: 8,
    padding: "14px 16px",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: 400,
    fontSize: 15,
    color: "#1A1510",
    background: "#FFFFFF",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 200ms ease-out",
  };

  return (
    <>
      {/* Hero — mirrors homepage style */}
      <section
        className="relative min-h-[40vh] sm:min-h-[70vh] flex flex-col justify-end overflow-hidden px-4 sm:px-10 md:px-16 pb-10 sm:pb-16 -mt-14 sm:-mt-16 pt-14 sm:pt-16"
        style={{ backgroundColor: "#2D35C9" }}
      >
        <h1
          className="font-heading font-black leading-[0.78] w-full"
          style={{
            fontSize: "clamp(60px, 18vw, 420px)",
            color: "#7B7FD4",
            letterSpacing: "-0.05em",
            marginLeft: "-0.05em",
          }}
        >
          Subscribe.
        </h1>
        <p
          className="font-body font-semibold mt-2 sm:mt-4 text-left"
          style={{
            fontSize: "clamp(16px, 2.5vw, 36px)",
            color: "#C8F04A",
            letterSpacing: "0.01em",
            marginLeft: "-0.04em",
          }}
        >
          The tools and news worth knowing about. Fortnightly.
        </p>
      </section>

      {/* Form section — cream */}
      <section
        style={{ backgroundColor: "#FAF8F4" }}
        className="px-4 sm:px-10 md:px-16 py-16 sm:py-24"
      >
        <div className="max-w-[640px]">
          {formState === "success" ? (
            <SuccessMessage />
          ) : (
            <>
              <h2
                className="font-heading"
                style={{
                  fontWeight: 700,
                  fontSize: "clamp(36px, 5vw, 52px)",
                  color: "#1A1510",
                  textWrap: "balance",
                  lineHeight: 1.1,
                  margin: 0,
                  marginBottom: 16,
                }}
              >
                Cut through the noise
              </h2>
              <p
                className="font-body"
                style={{
                  fontWeight: 500,
                  fontSize: 20,
                  lineHeight: 1.4,
                  color: "#4A4440",
                  margin: 0,
                  marginBottom: 24,
                }}
              >
                A curated round-up of things worth reading, trying, or watching in AI right now. Every other Friday. Written by me, Jasmin Aziz.
              </p>
              <p
                className="font-body"
                style={{
                  fontWeight: 400,
                  fontSize: 17,
                  lineHeight: 1.7,
                  color: "#1A1510",
                  margin: 0,
                  marginBottom: 32,
                }}
              >
                Free to subscribe. You can unsubscribe in one click at any time.
              </p>
              <form onSubmit={handleSubmit} style={{ maxWidth: 520 }}>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  style={{ ...inputStyle, marginBottom: 12 }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#2D35C9")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#E8E2D8")}
                />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError();
                  }}
                  placeholder="your@email.com"
                  style={{ ...inputStyle, marginBottom: 0 }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#2D35C9")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#E8E2D8")}
                />

                {formState === "duplicate" && (
                  <p className="font-body" style={{ fontWeight: 400, fontSize: 13, color: "#9A8F82", marginTop: 8, marginBottom: 0 }}>
                    You're already on the list.
                  </p>
                )}
                {formState === "error" && (
                  <p className="font-body" style={{ fontWeight: 400, fontSize: 13, color: "#E8572A", marginTop: 8, marginBottom: 0 }}>
                    Something went wrong — please try again.
                  </p>
                )}

                <p
                  className="font-body"
                  style={{
                    fontWeight: 400,
                    fontSize: 12,
                    lineHeight: 1.5,
                    color: "#9A8F82",
                    marginTop: 10,
                    marginBottom: 0,
                  }}
                >
                  By subscribing, you agree to our{" "}
                  <Link
                    to="/privacy-policy"
                    style={{ color: "#2D35C9", textDecoration: "underline", textUnderlineOffset: 2 }}
                  >
                    Privacy Policy
                  </Link>
                  . You can unsubscribe at any time.
                </p>

                <div style={{ marginTop: 12, marginBottom: 24 }}>
                  <label
                    className="font-body"
                    style={{ fontWeight: 400, fontSize: 12, color: "#9A8F82", display: "block", marginBottom: 6 }}
                  >
                    I'm mainly...
                  </label>
                  <select
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    style={{
                      ...inputStyle,
                      appearance: "none",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239A8F82' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 16px center",
                      paddingRight: 40,
                      color: context ? "#1A1510" : "#9A8F82",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#2D35C9")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#E8E2D8")}
                  >
                    <option value="" style={{ color: "#9A8F82" }}>Select one — optional</option>
                    <option value="using AI at work">using AI at work</option>
                    <option value="building something on the side">building something on the side</option>
                    <option value="both">both</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={formState === "submitting"}
                  style={{
                    width: "100%",
                    background: "#C8F04A",
                    color: "#1A1510",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: 15,
                    borderRadius: 20,
                    padding: "16px 24px",
                    border: "none",
                    cursor: formState === "submitting" ? "wait" : "pointer",
                    transition: "background 200ms ease-out, color 200ms ease-out, transform 100ms ease",
                    opacity: formState === "submitting" ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#2D35C9";
                    e.currentTarget.style.color = "#FFFFFF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#C8F04A";
                    e.currentTarget.style.color = "#1A1510";
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.96)")}
                  onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  {formState === "submitting" ? "Subscribing…" : "Subscribe"}
                </button>
              </form>

              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid #E8E2D8",
                  margin: "48px 0",
                }}
              />

              <div>
                <p
                  className="font-body"
                  style={{
                    fontWeight: 600,
                    fontSize: 16,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#2D35C9",
                    margin: 0,
                    marginBottom: 12,
                  }}
                >
                  Or read the Substack
                </p>
                <p
                  className="font-body"
                  style={{
                    fontWeight: 400,
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: "#4A4440",
                    margin: 0,
                    marginBottom: 12,
                  }}
                >
                  A longer-form publication from Jasmin. Audio-first, essay format, published when there is something worth saying rather than on a schedule.
                </p>
                <a
                  href="https://jasminaziz.substack.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body"
                  style={{
                    fontWeight: 500,
                    fontSize: 15,
                    color: "#2D35C9",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                >
                  Read on Substack →
                </a>
              </div>

              <p
                className="font-body"
                style={{
                  fontWeight: 400,
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: "#9A8F82",
                  marginTop: 32,
                  marginBottom: 0,
                }}
              >
                Get in touch —{" "}
                <a
                  href="mailto:hello@jasminaziz.co.uk"
                  style={{ color: "#9A8F82", textDecoration: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                >
                  hello@jasminaziz.co.uk
                </a>
              </p>
            </>
          )}
        </div>
      </section>
    </>
  );
}
