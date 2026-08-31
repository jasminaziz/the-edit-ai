import { Link } from "react-router-dom";

export function FooterEmailCapture() {
  return (
    <div
      className="pb-4 sm:pb-10"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.12)",
        paddingTop: 40,
      }}
    >
      <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 600,
            fontSize: 24,
            color: "#FFFFFF",
            margin: 0,
          }}
        >
          Get the AI-use policy template
        </p>
        <p
          className="font-body"
          style={{
            fontWeight: 400,
            fontSize: 14,
            lineHeight: 1.5,
            color: "rgba(255,255,255,0.7)",
            marginTop: 16,
            marginBottom: 0,
          }}
        >
          Free. The document that answers the questions your trustees will ask.
        </p>
        <Link
          to="/policy-template"
          style={{
            display: "inline-block",
            marginTop: 20,
            background: "#C8F04A",
            color: "#1A1510",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 600,
            fontSize: 13,
            borderRadius: 20,
            padding: "10px 20px",
            textDecoration: "none",
            transition: "background 200ms ease-out, color 200ms ease-out",
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
          Get the template →
        </Link>
      </div>
    </div>
  );
}
