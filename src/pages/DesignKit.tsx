import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { fetchDesignKit, type DesignKitItem } from "@/lib/sheets";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorState, EmptyState } from "@/components/ErrorState";
import { CobaltZone } from "@/components/CobaltZone";

const COST_STYLES: Record<string, { bg: string; text: string }> = {
  free: { bg: "#2D6A4F", text: "#ffffff" },
  freemium: { bg: "#9B7B3A", text: "#ffffff" },
  paid: { bg: "#6B7280", text: "#ffffff" },
};

function costStyle(cost: string) {
  const key = cost.toLowerCase().trim();
  return COST_STYLES[key] || COST_STYLES.paid;
}

interface PhaseConfig {
  name: string;
  explainer: string;
}

const PHASES: PhaseConfig[] = [
  {
    name: "Discover",
    explainer:
      "Where you find your visual language. Gather references, study what works, and build the brief before any decisions are made.",
  },
  {
    name: "Define",
    explainer:
      "Lock the building blocks. Colour, type, and icons decided here travel through everything you build.",
  },
  {
    name: "Design",
    explainer:
      "Map the structure, design the screens, reference the components. Everything before a single prompt is written.",
  },
  {
    name: "Present",
    explainer:
      "Show the work properly. Device frames and scene mockups turn screenshots into convincing client deliverables.",
  },
  {
    name: "Check",
    explainer:
      "Sign off before building. Contrast, accessibility, and real photography confirmed before anything goes live.",
  },
];

function groupByPhase(items: DesignKitItem[]) {
  const groups: Record<string, DesignKitItem[]> = {};

  for (const item of items) {
    const phase = item.phase?.trim() || "";
    const key = phase || "__other__";
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }

  const sections: { phase: PhaseConfig | null; number: string; items: DesignKitItem[] }[] = [];

  PHASES.forEach((p, i) => {
    if (groups[p.name]) {
      sections.push({
        phase: p,
        number: String(i + 1).padStart(2, "0"),
        items: groups[p.name],
      });
    }
  });

  // Any phase values not in PHASES (excluding empty)
  for (const key of Object.keys(groups)) {
    if (key !== "__other__" && !PHASES.some((p) => p.name === key)) {
      sections.push({
        phase: { name: key, explainer: "" },
        number: String(sections.length + 1).padStart(2, "0"),
        items: groups[key],
      });
    }
  }

  // Empty phase → "Other" at the bottom with no header band
  if (groups["__other__"]) {
    sections.push({
      phase: null,
      number: "",
      items: groups["__other__"],
    });
  }

  return sections;
}

/* ─── Scroll entrance hook ─── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

/* ─── Phase Section ─── */
function PhaseSection({
  phase,
  number,
  items,
  isFirst,
}: {
  phase: PhaseConfig | null;
  number: string;
  items: DesignKitItem[];
  isFirst: boolean;
}) {
  const { ref, visible } = useScrollReveal();

  return (
    <div ref={ref} style={{ marginTop: isFirst ? 0 : 48 }}>
      {/* Header band */}
      {phase && (
        <div
          className="px-6 sm:px-12"
          style={{
            backgroundColor: "#2D35C9",
            paddingTop: 32,
            paddingBottom: 32,
            borderRadius: 0,
            WebkitFontSmoothing: "antialiased",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transitionProperty: "opacity, transform",
            transitionDuration: "400ms",
            transitionTimingFunction: "ease-out",
          }}
        >
          <div
            className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6"
            style={{
              maxWidth: 1280,
              margin: "0 auto",
            }}
          >
            {/* Phase number */}
            <span
              className="font-heading"
              style={{
                fontSize: 80,
                fontWeight: 700,
                color: "#C8F04A",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                WebkitFontSmoothing: "antialiased",
                flexShrink: 0,
              }}
            >
              {number}
            </span>

            {/* Name + explainer */}
            <div>
              <span
                className="font-heading"
                style={{
                  display: "block",
                  fontSize: 36,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  letterSpacing: "-0.02em",
                  textWrap: "balance",
                }}
              >
                {phase.name}
              </span>
              {phase.explainer && (
                <span
                  className="font-body"
                  style={{
                    display: "block",
                    fontSize: 16,
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.65)",
                    marginTop: 6,
                    textWrap: "pretty",
                  }}
                >
                  {phase.explainer}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Card body */}
      <div
        className="px-6 sm:px-12"
        style={{
          backgroundColor: "#FFFFFF",
          paddingTop: 48,
          paddingBottom: 64,
        }}
      >
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{ maxWidth: 1280, margin: "0 auto" }}
        >
          {items.map((item, i) => (
            <div
              key={item.name + item.url}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transitionProperty: "opacity, transform",
                transitionDuration: "400ms",
                transitionTimingFunction: "ease-out",
                transitionDelay: visible ? `${400 + i * 60}ms` : "0ms",
              }}
            >
              <DesignCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Card with uniform height + read more/less ─── */
function DesignCard({ item }: { item: DesignKitItem }) {
  const style = costStyle(item.cost);
  const [expanded, setExpanded] = useState(false);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.boxShadow = "-4px 4px 16px rgba(0,0,0,0.10)";
  }, []);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.boxShadow = "none";
  }, []);

  const hasExtra = !!(item.when_to_use || item.verdict);

  return (
    <div
      className="rounded-xl overflow-hidden border border-border bg-card flex flex-col h-full"
      style={{
        transitionProperty: "transform, box-shadow",
        transitionDuration: "200ms",
        transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        boxShadow: "none",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="p-5 flex flex-col flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3
            className="font-heading font-semibold text-base leading-tight"
            style={{ color: "#1A1510" }}
          >
            {item.name}
          </h3>
          <span
            className="shrink-0 px-2 py-0.5 rounded-full font-body text-[11px] font-medium"
            style={{ backgroundColor: style.bg, color: style.text }}
          >
            {item.cost}
          </span>
        </div>

        {/* Category badge */}
        {item.category && (
          <span
            className="inline-block self-start px-2 py-0.5 rounded-full font-body text-[11px] mb-3"
            style={{ backgroundColor: "#EEF0FB", color: "#2D35C9" }}
          >
            {item.category}
          </span>
        )}

        {/* Description – always visible, clamped when collapsed */}
        <p
          className="font-body text-sm leading-relaxed text-foreground mb-3"
          style={
            !expanded
              ? {
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }
              : undefined
          }
        >
          {item.what_it_does}
        </p>

        {/* Expandable extra content */}
        {hasExtra && expanded && (
          <div className="space-y-3 mb-3">
            {item.when_to_use && (
              <p className="font-body text-xs text-muted-foreground">
                <strong>When to use:</strong> {item.when_to_use}
              </p>
            )}
            {item.verdict && (
              <div className="bg-background rounded-lg p-3 font-body text-sm italic text-foreground/80">
                {item.verdict}
              </div>
            )}
          </div>
        )}

        {/* Read more / less toggle */}
        {hasExtra && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((prev) => !prev);
            }}
            className="mt-auto self-start font-body text-xs font-medium hover:underline"
            style={{ color: "#2D35C9", background: "none", border: "none", padding: 0, cursor: "pointer" }}
          >
            {expanded ? "Read less ↑" : "Read more ↓"}
          </button>
        )}

        {/* Spacer when no extra content */}
        {!hasExtra && <div className="mt-auto" />}
      </div>

      {/* Open link */}
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block px-5 py-3 font-body text-[13px] font-medium no-underline"
        style={{ backgroundColor: "#7B7FD4", color: "#ffffff" }}
      >
        Open →
      </a>
    </div>
  );
}

/* ─── Page ─── */
const DesignKitPage = () => {
  const [items, setItems] = useState<DesignKitItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchDesignKit().then((data) => {
      if (data.length === 0 && import.meta.env.VITE_GOOGLE_SHEETS_ID) setError(true);
      setItems(data);
      setLoading(false);
    });
  }, []);

  const sections = useMemo(() => groupByPhase(items), [items]);

  return (
    <>
      <CobaltZone
        heading=""
        twoLineHeading={{ line1: "Design Kit", line2: "" }}
        bodyText="The workflow I follow at the start of every visual project. Step by step, from blank page to build-ready."
      />

      <section className="bg-background px-0" style={{ paddingTop: 0, paddingBottom: 40 }}>
        <div className="mx-auto" style={{ maxWidth: "100%" }}>
          {loading ? (
            <div className="px-6 sm:px-12">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="px-6 sm:px-12">
              <ErrorState />
            </div>
          ) : items.length === 0 ? (
            <div className="px-6 sm:px-12">
              <EmptyState />
            </div>
          ) : (
            <div>
              {sections.map((section, i) => (
                <PhaseSection
                  key={section.phase?.name || "other"}
                  phase={section.phase}
                  number={section.number}
                  items={section.items}
                  isFirst={i === 0}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default DesignKitPage;
