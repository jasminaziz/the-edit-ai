import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { slugifyToolName } from "@/utils/slugify";

interface StackBarProps {
  stack: string[];
  onRemove: (name: string) => void;
}

export const StackBar = ({ stack, onRemove }: StackBarProps) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [footerOffset, setFooterOffset] = useState(0);
  const count = stack.length;
  const isEmpty = count === 0;

  // Push the bar up so it rests just above the footer when the footer enters view.
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const update = () => {
      const rect = footer.getBoundingClientRect();
      const overlap = window.innerHeight - rect.top;
      setFooterOffset(overlap > 0 ? overlap : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const handleShare = async () => {
    const slugs = stack.map(slugifyToolName).join(",");
    const url = `https://www.theeditai.co.uk/tools?stack=${slugs}`;

    const fallback = () => {
      try {
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {
        /* ignore */
      }
    };

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        fallback();
      }
    } catch {
      fallback();
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed left-0 right-0 z-50"
      style={{
        bottom: footerOffset,
        backgroundColor: "#7B7FD4",
        opacity: isEmpty ? 0.5 : 1,
        transition: "opacity 200ms ease-out",
      }}
    >
      {/* Expanded panel */}
      {expanded && !isEmpty && (
        <div
          style={{
            padding: "20px 24px",
            maxHeight: 320,
            overflowY: "auto",
            backgroundColor: "#7B7FD4",
          }}
        >
          <ul className="flex flex-col gap-2 mb-4">
            {stack.map((name) => (
              <li
                key={name}
                className="flex items-center justify-between gap-3"
              >
                <span
                  className="font-body"
                  style={{ fontSize: 14, fontWeight: 400, color: "#FFFFFF" }}
                >
                  {name}
                </span>
                <button
                  onClick={() => onRemove(name)}
                  className="font-body"
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: 12,
                    color: "#C8F04A",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={handleShare}
            className="font-body w-full"
            style={{
              height: 44,
              backgroundColor: "#C8F04A",
              color: "#1A1510",
              fontSize: 14,
              fontWeight: 600,
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            {copied ? "Link copied ✓" : "Share my stack"}
          </button>
        </div>
      )}

      {/* Collapsed bar (always rendered, also acts as panel header) */}
      <button
        onClick={() => !isEmpty && setExpanded((v) => !v)}
        disabled={isEmpty}
        className="font-body w-full flex items-center justify-between"
        style={{
          height: 52,
          padding: "0 24px",
          background: "none",
          border: "none",
          color: "#FFFFFF",
          fontSize: 16,
          fontWeight: 500,
          cursor: isEmpty ? "default" : "pointer",
        }}
      >
        <span>Your stack ({count})</span>
        {!isEmpty && <span style={{ fontSize: 18 }}>{expanded ? "↓" : "↑"}</span>}
      </button>
    </div>
  );
};
