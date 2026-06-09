import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
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
  const [flash, setFlash] = useState(false);
  const prevCount = useRef(stack.length);
  const count = stack.length;
  const isEmpty = count === 0;

  // Flash the bar briefly when a tool is added (cause→effect signal).
  useEffect(() => {
    if (stack.length > prevCount.current) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 600);
      prevCount.current = stack.length;
      return () => clearTimeout(t);
    }
    prevCount.current = stack.length;
  }, [stack.length]);

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
    const url = `https://www.theeditai.co.uk/stack?stack=${slugs}`;

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
        boxShadow: flash
          ? "inset 0 0 0 2px #C8F04A, 0 -8px 24px rgba(200,240,74,0.25)"
          : "0 -2px 12px rgba(0,0,0,0.06)",
        transition: "box-shadow 250ms ease-out",
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

          <div className="flex flex-col" style={{ gap: 8 }}>
            <button
              onClick={() => navigate("/stack")}
              className="font-body w-full"
              style={{
                height: 44,
                backgroundColor: "#C8F04A",
                color: "#1A1510",
                fontSize: 14,
                fontWeight: 600,
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              See your stack
            </button>
            <button
              onClick={handleShare}
              className="font-body w-full"
              style={{
                height: 40,
                backgroundColor: "transparent",
                color: "#FFFFFF",
                fontSize: 14,
                fontWeight: 500,
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              {copied ? "Link copied ✓" : "Copy link"}
            </button>
          </div>
        </div>
      )}

      {/* Collapsed bar (always rendered, also acts as panel header) */}
      <button
        onClick={() => !isEmpty && setExpanded((v) => !v)}
        disabled={isEmpty}
        className="font-body w-full flex items-center justify-between"
        style={{
          height: 56,
          padding: "0 20px",
          background: "none",
          border: "none",
          color: "#FFFFFF",
          fontSize: 15,
          fontWeight: 500,
          cursor: isEmpty ? "default" : "pointer",
          textAlign: "left",
        }}
      >
        <span className="flex items-center gap-2.5 min-w-0">
          <span
            aria-hidden="true"
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#C8F04A",
              flexShrink: 0,
              animation: isEmpty ? "stack-pulse 2s ease-in-out infinite" : "none",
              boxShadow: isEmpty ? "0 0 0 0 rgba(200,240,74,0.6)" : "none",
            }}
          />
          <span className="truncate">
            {isEmpty
              ? "Your stack is empty — tap any tool to start"
              : `Your stack · ${count}`}
          </span>
        </span>
        {!isEmpty && (
          <span
            className="font-body shrink-0 ml-3"
            style={{
              backgroundColor: "#C8F04A",
              color: "#1A1510",
              fontSize: 12,
              fontWeight: 600,
              padding: "6px 12px",
              borderRadius: 999,
              letterSpacing: "0.02em",
            }}
          >
            {expanded ? "Close ↓" : "View & share →"}
          </span>
        )}
      </button>

      <style>{`
        @keyframes stack-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(200,240,74,0.7); }
          50% { box-shadow: 0 0 0 6px rgba(200,240,74,0); }
        }
      `}</style>
    </div>
  );
};
