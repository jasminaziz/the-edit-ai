import { useState } from "react";
import { X } from "lucide-react";
import type { Tool } from "@/lib/sheets";

interface ToolCardProps {
  tool: Tool;
  isSelected: boolean;
  isDimmed: boolean;
  isInStack: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onToggleStack: () => void;
  showCoachmark?: boolean;
  onDismissCoachmark?: () => void;
}

export const ToolCard = ({
  tool,
  isSelected,
  isDimmed,
  isInStack,
  onMouseEnter,
  onMouseLeave,
  onToggleStack,
  showCoachmark = false,
  onDismissCoachmark,
}: ToolCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`rounded-xl border p-5 flex flex-col h-full transition-all duration-200 ${
        isDimmed ? "opacity-70 scale-[0.98]" : ""
      }`}
      style={
        isSelected
          ? {
              backgroundColor: "#2D35C9",
              borderColor: "#2D35C9",
              color: "#FAF8F4",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              ...(isInStack ? { borderLeft: "3px solid #2D35C9" } : {}),
            }
          : {
              backgroundColor: "#FFFFFF",
              borderColor: "#E8E2D8",
              ...(isInStack ? { borderLeft: "3px solid #2D35C9" } : {}),
            }
      }
    >
      {/* Tool name as link */}
      {tool.url ? (
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-heading font-semibold text-xl no-underline"
          style={{ color: isSelected ? "#FAF8F4" : "#1A1510" }}
          onClick={(e) => e.stopPropagation()}
        >
          {tool.name}
        </a>
      ) : (
        <h3
          className="font-heading font-semibold text-xl"
          style={{ color: isSelected ? "#FAF8F4" : "#1A1510" }}
        >
          {tool.name}
        </h3>
      )}

      {/* Category + Status badges */}
      <div className="flex flex-wrap gap-2 mt-2">
        <span
          className="inline-block px-2.5 py-0.5 font-body text-[11px] font-semibold uppercase tracking-[0.05em] rounded-full"
          style={
            isSelected
              ? { backgroundColor: "#9B9FE0", color: "#FFFFFF" }
              : { backgroundColor: "#EEF0FB", color: "#2D35C9" }
          }
        >
          {tool.category}
        </span>
        {tool.status === "in_stack" && (
          <span
            className="inline-block px-2.5 py-0.5 font-body text-[11px] font-semibold uppercase tracking-[0.05em] rounded-full"
            style={
              isSelected
                ? { backgroundColor: "rgba(250,248,244,0.15)", color: "#FAF8F4" }
                : { backgroundColor: "#2D6A4F", color: "#FFFFFF" }
            }
          >
            IN MY STACK
          </span>
        )}
      </div>

      {/* Description */}
      <p
        className="mt-3 font-body text-sm leading-relaxed line-clamp-2"
        style={{ color: isSelected ? "#FAF8F4" : "#1A1510" }}
      >
        {tool.what_it_does}
      </p>

      {/* Pricing */}
      {tool.pricing && (
        <p
          className="mt-2 font-body text-[13px]"
          style={{ color: isSelected ? "rgba(250,248,244,0.6)" : "#9A8F82" }}
        >
          {tool.pricing}
        </p>
      )}

      {/* Verdict button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded((v) => !v);
        }}
        className="mt-auto pt-3 text-left font-body font-medium text-[13px] transition-colors"
        style={{ color: isSelected ? "#C8F04A" : "#9B9FE0" }}
      >
        {isExpanded ? "Honest verdict ↑" : "Honest verdict ↓"}
      </button>

      {/* Expanded verdict */}
      {isExpanded && tool.verdict && (
        <div
          className="mt-3 pt-4 font-body text-sm leading-relaxed"
          style={{
            borderLeft: "4px solid #9B9FE0",
            paddingLeft: 16,
            color: isSelected ? "#FAF8F4" : "#1A1510",
          }}
        >
          {tool.verdict}
        </div>
      )}

      {/* Visit tool button — lime pill */}
      {tool.url && (
        <div className="mt-3 flex justify-end">
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="font-body inline-block"
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: isSelected ? "#2D35C9" : "#1A1510",
              backgroundColor: isSelected ? "#FAF8F4" : "#C8F04A",
              borderRadius: "20px",
              padding: "10px 20px",
              transition: "background-color 0.2s ease-out, color 0.2s ease-out",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              if (isSelected) {
                e.currentTarget.style.backgroundColor = "#C8F04A";
                e.currentTarget.style.color = "#1A1510";
              } else {
                e.currentTarget.style.backgroundColor = "#2D35C9";
                e.currentTarget.style.color = "#FFFFFF";
              }
            }}
            onMouseLeave={(e) => {
              if (isSelected) {
                e.currentTarget.style.backgroundColor = "#FAF8F4";
                e.currentTarget.style.color = "#2D35C9";
              } else {
                e.currentTarget.style.backgroundColor = "#C8F04A";
                e.currentTarget.style.color = "#1A1510";
              }
            }}
          >
            Visit tool →
          </a>
        </div>
      )}

      {/* Add to stack button + optional coachmark */}
      <div className="mt-4 relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStack();
            onDismissCoachmark?.();
          }}
          className="w-full font-body transition-colors"
          style={{
            height: 40,
            fontSize: 14,
            fontWeight: 500,
            borderRadius: 8,
            border: isInStack ? "1px solid #2D6A4F" : "1px solid #E8E2D8",
            backgroundColor: isInStack ? "#2D6A4F" : "#FAF8F4",
            color: isInStack ? "#FFFFFF" : "#2D35C9",
            boxShadow: showCoachmark && !isInStack ? "0 0 0 2px #C8F04A" : "none",
          }}
        >
          {isInStack ? "✓ Added" : "+ Add to my stack"}
        </button>

        {showCoachmark && !isInStack && (
          <div
            className="font-body"
            style={{
              position: "absolute",
              bottom: "calc(100% + 10px)",
              left: 0,
              right: 0,
              backgroundColor: "#1A1510",
              color: "#FFFFFF",
              fontSize: 12.5,
              lineHeight: 1.4,
              padding: "10px 28px 10px 12px",
              borderRadius: 6,
              boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
            }}
          >
            <span style={{ color: "#C8F04A", fontWeight: 600 }}>Tap to add</span>
            <span> → builds your stack at the bottom</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDismissCoachmark?.();
              }}
              aria-label="Dismiss"
              style={{
                position: "absolute",
                top: 4,
                right: 4,
                width: 20,
                height: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "none",
                border: "none",
                color: "#9A8F82",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <X size={12} />
            </button>
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: -6,
                left: 24,
                width: 0,
                height: 0,
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: "6px solid #1A1510",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
