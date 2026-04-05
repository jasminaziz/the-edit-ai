import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type FooterFormState = "idle" | "submitting" | "success" | "duplicate" | "error";

export function FooterEmailCapture() {
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FooterFormState>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setFormState("submitting");

    const { error } = await supabase.from("subscribers" as any).insert({
      email: email.trim(),
      source: "footer",
      status: "active",
    } as any);

    if (!error) {
      setFormState("success");
    } else if (error.code === "23505") {
      setFormState("duplicate");
    } else {
      setFormState("error");
    }
  };

  return (
    <div
      style={{
        borderTop: "1px solid rgba(255,255,255,0.12)",
        paddingTop: 40,
        paddingBottom: 40,
      }}
    >
      <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 600,
            fontSize: 18,
            color: "#FFFFFF",
            margin: 0,
          }}
        >
          Get The Edit in your inbox
        </p>
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 400,
            fontSize: 12,
            color: "rgba(255,255,255,0.5)",
            margin: "4px 0 0",
          }}
        >
          Weekly digest. No noise.
        </p>

        <div style={{ marginTop: 16 }}>
          {formState === "success" ? (
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: 14,
                color: "#C8F04A",
                margin: 0,
              }}
            >
              You're in.
            </p>
          ) : (
            <>
              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", gap: 8, alignItems: "center" }}
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (formState === "duplicate" || formState === "error") setFormState("idle");
                  }}
                  placeholder="your@email.com"
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 8,
                    padding: "10px 14px",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 400,
                    fontSize: 14,
                    color: "#FFFFFF",
                    outline: "none",
                    transition: "border-color 200ms ease-out",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#C8F04A")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)")}
                />
                <button
                  type="submit"
                  disabled={formState === "submitting"}
                  style={{
                    flexShrink: 0,
                    background: "#C8F04A",
                    color: "#1A1510",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: 13,
                    borderRadius: 20,
                    padding: "10px 20px",
                    border: "none",
                    cursor: formState === "submitting" ? "wait" : "pointer",
                    transition: "background 200ms ease-out, color 200ms ease-out",
                    opacity: formState === "submitting" ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#FFFFFF";
                    e.currentTarget.style.color = "#2D35C9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#C8F04A";
                    e.currentTarget.style.color = "#1A1510";
                  }}
                >
                  {formState === "submitting" ? "…" : "Subscribe"}
                </button>
              </form>

              {formState === "duplicate" && (
                <p
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 400,
                    fontSize: 13,
                    color: "rgba(255,255,255,0.5)",
                    marginTop: 10,
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
                    marginTop: 10,
                    marginBottom: 0,
                  }}
                >
                  Something went wrong — please try again.
                </p>
              )}
            </>
          )}
        </div>

        <p style={{ marginTop: 10, marginBottom: 0 }}>
          <Link
            to="/subscribe"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 400,
              fontSize: 12,
              color: "rgba(255,255,255,0.4)",
              textDecoration: "none",
              transition: "color 150ms ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
          >
            Or see the full sign-up page →
          </Link>
        </p>
      </div>
    </div>
  );
}
