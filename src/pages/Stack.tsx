import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTools, type Tool } from "@/lib/sheets";
import { slugifyToolName } from "@/utils/slugify";
import { SEO } from "@/components/SEO";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildStackHtml(items: Array<{ name: string; tool?: Tool }>): string {
  const date = new Date().toLocaleDateString("en-GB");
  const cards = items
    .map(({ name, tool }) => {
      const safeName = escapeHtml(name);
      const category = tool?.category
        ? `<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#9A8F82;margin-bottom:10px;">${escapeHtml(tool.category)}</div>`
        : "";
      const verdict = tool?.verdict
        ? `<p style="font-size:14px;line-height:1.6;color:#1A1510;margin:0 0 12px 0;">${escapeHtml(tool.verdict)}</p>`
        : "";
      const url = tool?.url
        ? `<a href="${escapeHtml(tool.url)}" style="font-size:13px;color:#2D35C9;text-decoration:none;" target="_blank" rel="noopener noreferrer">${escapeHtml(tool.url)}</a>`
        : "";
      return `<div style="background:#FFFFFF;border:1px solid #E8E2D8;border-left:3px solid #2D35C9;border-radius:6px;padding:20px;margin-bottom:16px;">
  <h2 style="font-size:18px;font-weight:700;color:#1A1510;margin:0 0 6px 0;">${safeName}</h2>
  ${category}
  ${verdict}
  ${url}
</div>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>My AI Stack — The Edit</title>
</head>
<body style="background:#FAF8F4;font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#1A1510;margin:0;">
<div style="max-width:680px;margin:0 auto;padding:40px 24px;">
  <h1 style="font-size:28px;font-weight:700;color:#2D35C9;margin:0 0 4px 0;">My AI Stack</h1>
  <p style="font-size:14px;color:#9A8F82;margin:0 0 40px 0;">Built using The Edit — theeditai.co.uk</p>
  ${cards}
  <footer style="margin-top:48px;border-top:1px solid #E8E2D8;padding-top:16px;font-size:12px;color:#9A8F82;">
    Built on The Edit · theeditai.co.uk · ${escapeHtml(date)}
  </footer>
</div>
</body>
</html>`;
}


const STACK_KEY = "the-edit-stack";

function readStack(): string[] {
  try {
    const raw = localStorage.getItem(STACK_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

function writeStack(names: string[]) {
  try {
    localStorage.setItem(STACK_KEY, JSON.stringify(names));
  } catch {
    // ignore
  }
}

export default function Stack() {
  const [stackNames, setStackNames] = useState<string[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setStackNames(readStack());
    fetchTools().then((t) => {
      setTools(t);
      setLoaded(true);
    });
  }, []);

  const remove = (name: string) => {
    setStackNames((prev) => {
      const next = prev.filter((n) => n !== name);
      writeStack(next);
      return next;
    });
  };

  const items = stackNames
    .map((name) => ({ name, tool: tools.find((t) => t.name === name) }));

  const handleDownload = () => {
    const html = buildStackHtml(items);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-stack-the-edit.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  const handleCopyLink = async () => {
    const slugs = stackNames.map((n) => slugifyToolName(n)).filter(Boolean).join(",");
    const url = `https://www.theeditai.co.uk/stack?stack=${slugs}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // ignore
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ backgroundColor: "#FAF8F4", minHeight: "100vh" }}>
      <SEO
        title="Build Your AI Stack | The Edit"
        description="Pick the tools that fit your organisation and build your own AI stack. Every tool checked for data location, training policy and nonprofit pricing first."
        canonical="https://theeditai.co.uk/stack"
      />
      {/* Top bar */}
      <header
        style={{
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E8E2D8",
          height: 64,
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          to="/"
          style={{
            fontFamily: "Chillax, sans-serif",
            fontWeight: 700,
            fontSize: 20,
            color: "#2D35C9",
            textDecoration: "none",
          }}
        >
          The Edit
        </Link>
        <Link
          to="/tools"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 500,
            fontSize: 14,
            color: "#2D35C9",
            textDecoration: "none",
          }}
        >
          Back to tools
        </Link>
      </header>

      <main style={{ maxWidth: 800, margin: "0 auto", padding: "48px 32px" }}>
        <h1
          style={{
            fontFamily: "Chillax, sans-serif",
            fontWeight: 700,
            fontSize: 36,
            color: "#1A1510",
            margin: 0,
          }}
        >
          Your stack, built on The Edit
        </h1>
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 400,
            fontSize: 16,
            color: "#9A8F82",
            marginTop: 12,
            marginBottom: 24,
          }}
        >
          Add more tools or remove the ones that don't fit.
        </p>

        {stackNames.length > 0 && (
          <div style={{ display: "flex", gap: 12, marginBottom: 40, flexWrap: "wrap" }}>
            <button
              onClick={handleDownload}
              style={{
                backgroundColor: "#2D35C9",
                color: "#FFFFFF",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: 14,
                height: 44,
                padding: "0 24px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
              }}
            >
              Download your stack
            </button>
            <button
              onClick={handleCopyLink}
              style={{
                backgroundColor: "#FAF8F4",
                color: "#2D35C9",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: 14,
                height: 44,
                padding: "0 24px",
                borderRadius: 6,
                border: "1px solid #E8E2D8",
                cursor: "pointer",
              }}
            >
              {copied ? "Link copied ✓" : "Copy link"}
            </button>
          </div>
        )}


        {stackNames.length === 0 ? (
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 400,
              fontSize: 16,
              color: "#9A8F82",
              textAlign: "center",
              marginTop: 48,
            }}
          >
            Your stack is empty.{" "}
            <Link to="/tools" style={{ color: "#2D35C9", textDecoration: "none" }}>
              Go build it
            </Link>
            .
          </p>
        ) : (
          <>
            {items.map(({ name, tool }) => (
              <div
                key={name}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E8E2D8",
                  borderLeft: "3px solid #2D35C9",
                  borderRadius: 8,
                  padding: 24,
                  marginBottom: 16,
                }}
              >
                <h2
                  style={{
                    fontFamily: "Chillax, sans-serif",
                    fontWeight: 700,
                    fontSize: 20,
                    color: "#1A1510",
                    margin: 0,
                  }}
                >
                  {name}
                </h2>

                {tool?.category && (
                  <div style={{ margin: "8px 0" }}>
                    <span
                      className="inline-block px-2.5 py-0.5 font-body text-[11px] font-semibold uppercase tracking-[0.05em] rounded-full"
                      style={{ backgroundColor: "#EEF0FB", color: "#2D35C9" }}
                    >
                      {tool.category}
                    </span>
                  </div>
                )}

                {tool?.verdict && (
                  <p
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 400,
                      fontSize: 15,
                      color: "#1A1510",
                      lineHeight: 1.6,
                      margin: "12px 0",
                    }}
                  >
                    {tool.verdict}
                  </p>
                )}

                {!tool && loaded && (
                  <p
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 400,
                      fontSize: 14,
                      color: "#9A8F82",
                      margin: "12px 0",
                    }}
                  >
                    Tool details unavailable.
                  </p>
                )}

                {tool?.url && (
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 400,
                      fontSize: 13,
                      color: "#2D35C9",
                      textDecoration: "none",
                    }}
                  >
                    {tool.url}
                  </a>
                )}

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                  <button
                    onClick={() => remove(name)}
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 500,
                      fontSize: 13,
                      color: "#E8572A",
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                    }}
                  >
                    Remove from stack
                  </button>
                </div>
              </div>
            ))}

            <div style={{ textAlign: "center", marginTop: 32 }}>
              <Link
                to="/tools"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 15,
                  color: "#2D35C9",
                  textDecoration: "none",
                }}
              >
                Add more tools
              </Link>
            </div>
          </>
        )}

        <footer
          style={{
            marginTop: 64,
            borderTop: "1px solid #E8E2D8",
            paddingTop: 20,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 400,
              fontSize: 13,
              color: "#9A8F82",
              margin: 0,
            }}
          >
            theeditai.co.uk
          </p>
        </footer>
      </main>
    </div>
  );
}
