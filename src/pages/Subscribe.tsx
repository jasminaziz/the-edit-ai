import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

type FormState = "idle" | "submitting" | "success" | "duplicate" | "error";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");

  if (!SUPABASE_URL || !SUPABASE_KEY) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setFormState("submitting");

    const { error } = await supabase.from("subscribers" as any).insert({ email: email.trim() } as any);

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

  return (
    <div
      className="min-h-screen w-full flex items-start justify-center"
      style={{
        background: "#FAF8F4",
        padding: "80px 24px",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <div style={{ maxWidth: 560, width: "100%" }}>
        {/* Eyebrow */}
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 600,
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#9A8F82",
            marginBottom: 16,
          }}
        >
          THE EDIT
        </p>

        {/* Heading */}
        <h1
          style={{
            fontFamily: "'Chillax', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(32px, 5vw, 48px)",
            color: "#1A1510",
            textWrap: "balance",
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          Get The Edit in your inbox
        </h1>

        {/* Subheading */}
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 400,
            fontSize: 16,
            color: "#9A8F82",
            lineHeight: 1.6,
            marginTop: 12,
          }}
        >
          A curated digest of the AI tools and news worth knowing about. No noise.
        </p>

        {/* Form or success */}
        <div style={{ marginTop: 40 }}>
          {formState === "success" ? (
            <p
              style={{
                fontFamily: "'Chillax', sans-serif",
                fontWeight: 700,
                fontSize: 24,
                color: "#2D35C9",
                margin: 0,
              }}
            >
              You're in. First edition coming soon.
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (formState === "duplicate" || formState === "error") {
                    setFormState("idle");
                  }
                }}
                placeholder="your@email.com"
                style={{
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
                }}
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

              <button
                type="submit"
                disabled={formState === "submitting"}
                style={{
                  width: "100%",
                  marginTop: 12,
                  background: "#C8F04A",
                  color: "#1A1510",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  borderRadius: 20,
                  padding: "14px 24px",
                  border: "none",
                  cursor: formState === "submitting" ? "wait" : "pointer",
                  transition: "background 200ms ease-out, color 200ms ease-out, transform 100ms",
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
          )}
        </div>
      </div>
    </div>
  );
}
