import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTools, type Tool } from "@/lib/sheets";

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

  return (
    <div style={{ backgroundColor: "#FAF8F4", minHeight: "100vh" }}>
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
            marginBottom: 40,
          }}
        >
          Add more tools or remove the ones that don't fit.
        </p>

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
