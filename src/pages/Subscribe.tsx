import { useState, useEffect } from "react";
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
        style={{
          fontFamily: "'Chillax', sans-serif",
          fontWeight: 700,
          fontSize: 36,
          color: "#2D35C9",
          margin: 0,
        }}
      >
        You're in.
      </h2>
      <p
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 400,
          fontSize: 15,
          color: "#9A8F82",
          marginTop: 8,
        }}
      >
        First edition coming soon.
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
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* Left column — cobalt */}
      <div
        className="subscribe-left"
        style={{
          background: "#2D35C9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative ampersand */}
        <span
          style={{
            position: "absolute",
            fontFamily: "'Chillax', sans-serif",
            fontWeight: 700,
            fontSize: 120,
            color: "#C8F04A",
            opacity: 0.15,
            userSelect: "none",
            lineHeight: 1,
          }}
        >
          &amp;
        </span>

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 32px" }}>
          <p
            style={{
              fontFamily: "'Chillax', sans-serif",
              fontWeight: 700,
              fontSize: 28,
              color: "#FFFFFF",
              margin: 0,
            }}
          >
            The Edit
          </p>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 400,
              fontSize: 15,
              color: "#FFFFFF",
              opacity: 0.7,
              marginTop: 4,
              marginBottom: 0,
            }}
          >
            Honest verdicts only.
          </p>

          <div
            style={{
              marginTop: 32,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 400,
              fontSize: 13,
              color: "#FFFFFF",
              opacity: 0.6,
              lineHeight: 1.8,
            }}
          >
            <p style={{ margin: 0 }}>68 tools reviewed and counting.</p>
            <p style={{ margin: 0 }}>Updated every week.</p>
            <p style={{ margin: 0 }}>No affiliate links. No sponsored content.</p>
          </div>
        </div>
      </div>

      {/* Right column — cream */}
      <div
        className="subscribe-right"
        style={{
          background: "#FAF8F4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ maxWidth: 440, width: "100%" }}>
          {formState === "success" ? (
            <SuccessMessage />
          ) : (
            <>
              {/* Eyebrow */}
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "#9A8F82",
                  marginBottom: 16,
                }}
              >
                THE EDIT DIGEST
              </p>

              {/* Heading */}
              <h1
                style={{
                  fontFamily: "'Chillax', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(28px, 4vw, 40px)",
                  color: "#1A1510",
                  textWrap: "balance",
                  lineHeight: 1.1,
                  margin: 0,
                  marginBottom: 8,
                }}
              >
                Get the tools worth knowing about.
              </h1>

              {/* Subheading */}
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: 15,
                  color: "#9A8F82",
                  marginBottom: 40,
                  marginTop: 0,
                }}
              >
                Curated. Direct. No noise.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {/* First name */}
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  style={{ ...inputStyle, marginBottom: 12 }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#2D35C9")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#E8E2D8")}
                />

                {/* Email */}
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

                {/* Inline messages */}
                {formState === "duplicate" && (
                  <p
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 400,
                      fontSize: 13,
                      color: "#9A8F82",
                      marginTop: 8,
                      marginBottom: 0,
                    }}
                  >
                    You're already on the list.
                  </p>
                )}
                {formState === "error" && (
                  <p
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 400,
                      fontSize: 13,
                      color: "#E8572A",
                      marginTop: 8,
                      marginBottom: 0,
                    }}
                  >
                    Something went wrong — please try again.
                  </p>
                )}

                {/* Context dropdown */}
                <div style={{ marginTop: 12, marginBottom: 24 }}>
                  <label
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 400,
                      fontSize: 12,
                      color: "#9A8F82",
                      display: "block",
                      marginBottom: 6,
                    }}
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
                    <option value="" style={{ color: "#9A8F82" }}>
                      Select one — optional
                    </option>
                    <option value="using AI at work">using AI at work</option>
                    <option value="building something on the side">
                      building something on the side
                    </option>
                    <option value="both">both</option>
                  </select>
                </div>

                {/* Submit */}
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
                    transition:
                      "background 200ms ease-out, color 200ms ease-out, transform 100ms ease",
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
            </>
          )}
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        .subscribe-left {
          width: 45%;
          min-height: 100vh;
        }
        .subscribe-right {
          width: 55%;
          min-height: 100vh;
          padding: 64px 48px;
        }
        @media (max-width: 768px) {
          div:has(> .subscribe-left) {
            flex-direction: column !important;
          }
          .subscribe-left {
            width: 100% !important;
            min-height: 200px !important;
            height: 200px;
          }
          .subscribe-right {
            width: 100% !important;
            min-height: auto !important;
            padding: 40px 24px !important;
          }
        }
      `}</style>
    </div>
  );
}
