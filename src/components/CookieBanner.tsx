import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "theEditCookieConsent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Small delay so it doesn't pop in instantly on first paint
        const t = setTimeout(() => setVisible(true), 600);
        return () => clearTimeout(t);
      }
    } catch {
      // localStorage may be blocked — show banner anyway
      setVisible(true);
    }
  }, []);

  const handleChoice = (choice: "accepted" | "declined") => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice, ts: Date.now() }));
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      style={{
        position: "fixed",
        left: 12,
        right: 12,
        bottom: 12,
        zIndex: 100,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          pointerEvents: "auto",
          width: "100%",
          maxWidth: 720,
          background: "#1A1510",
          color: "#FFFFFF",
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.12)",
          padding: "16px 18px",
          boxShadow: "0 12px 40px -8px rgba(0,0,0,0.35)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <p
          className="font-body"
          style={{
            margin: 0,
            fontWeight: 500,
            fontSize: 14,
            lineHeight: 1.5,
            color: "rgba(255,255,255,0.9)",
          }}
        >
          We use essential cookies to keep the site running smoothly. See our{" "}
          <Link
            to="/cookie-policy"
            style={{ color: "#C8F04A", textDecoration: "underline", textUnderlineOffset: 2 }}
          >
            Cookie Policy
          </Link>{" "}
          for details.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={() => handleChoice("declined")}
            className="font-body"
            style={{
              background: "transparent",
              color: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 20,
              padding: "8px 18px",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              transition: "color 150ms ease, border-color 150ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#FFFFFF";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.7)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            }}
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => handleChoice("accepted")}
            className="font-body"
            style={{
              background: "#C8F04A",
              color: "#1A1510",
              border: "none",
              borderRadius: 20,
              padding: "8px 20px",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              transition: "background 150ms ease, color 150ms ease",
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
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
