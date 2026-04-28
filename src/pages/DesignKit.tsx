import { useEffect, useState, useMemo, useCallback } from "react";
import { fetchDesignKit, type DesignKitItem } from "@/lib/sheets";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorState, EmptyState } from "@/components/ErrorState";
import { CobaltZone } from "@/components/CobaltZone";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { SEO } from "@/components/SEO";

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

// Exact phase order from the brief.
const PHASES: PhaseConfig[] = [
  { name: "Get Inspired", explainer: "Where you find your visual language. Gather references and study what works before any decisions are made." },
  { name: "Define Visual Direction", explainer: "Lock the building blocks. Colour, type, and icons decided here travel through everything you build." },
  { name: "Plan the Build", explainer: "Map the structure and reference the components. Everything before a single prompt is written." },
  { name: "Build the UI", explainer: "Translate the plan into screens and working interfaces." },
  { name: "Present the Work", explainer: "Show the work properly. Device frames and scene mockups turn screenshots into convincing client deliverables." },
  { name: "Check Before You Ship", explainer: "Sign off before building. Contrast, accessibility, and real photography confirmed before anything goes live." },
];

function organise(items: DesignKitItem[]) {
  // Bucket items by phase (case-insensitive match against PHASES).
  const byPhase = new Map<string, DesignKitItem[]>();
  for (const p of PHASES) byPhase.set(p.name, []);
  const orphans: DesignKitItem[] = [];

  for (const item of items) {
    const ph = (item.phase || "").trim();
    const match = PHASES.find((p) => p.name.toLowerCase() === ph.toLowerCase());
    if (match) byPhase.get(match.name)!.push(item);
    else orphans.push(item);
  }

  // Flag empty phases for visibility.
  const emptyPhases = PHASES.filter((p) => byPhase.get(p.name)!.length === 0).map((p) => p.name);
  if (emptyPhases.length) {
    console.warn("[design_kit] phase sections with zero entries:", emptyPhases);
  }
  if (orphans.length) {
    console.warn(
      "[design_kit] items with phase value not matching expected list:",
      orphans.map((o) => ({ name: o.name, phase: o.phase }))
    );
  }

  // Build sections in PHASES order, skipping empty ones.
  const sections = PHASES
    .filter((p) => byPhase.get(p.name)!.length > 0)
    .map((p, i) => {
      const phaseItems = byPhase.get(p.name)!;
      // Group within phase by `group`. Preserve first-seen order.
      const groupOrder: string[] = [];
      const grouped = new Map<string, DesignKitItem[]>();
      for (const it of phaseItems) {
        const g = (it.group || "").trim();
        if (!grouped.has(g)) {
          grouped.set(g, []);
          groupOrder.push(g);
        }
        grouped.get(g)!.push(it);
      }
      const showGroupHeaders = groupOrder.filter((g) => g).length > 1;
      return {
        phase: p,
        number: String(PHASES.indexOf(p) + 1).padStart(2, "0"),
        groups: groupOrder.map((g) => ({ name: g, items: grouped.get(g)! })),
        showGroupHeaders,
        sectionIndex: i,
      };
    });

  return sections;
}

/* ─── Phase Section ─── */
function PhaseSection({
  phase,
  number,
  groups,
  showGroupHeaders,
  isFirst,
}: {
  phase: PhaseConfig;
  number: string;
  groups: { name: string; items: DesignKitItem[] }[];
  showGroupHeaders: boolean;
  isFirst: boolean;
}) {
  return (
    <div style={{ marginTop: isFirst ? 0 : 48 }}>
      {/* Header band */}
      <Reveal>
        <div
          className="px-6 sm:px-12"
          style={{
            backgroundColor: "#2D35C9",
            paddingTop: 32,
            paddingBottom: 32,
            borderRadius: 0,
            WebkitFontSmoothing: "antialiased",
          }}
        >
          <div
            className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6"
            style={{ maxWidth: 1280, margin: "0 auto" }}
          >
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
      </Reveal>

      {/* Card body */}
      <div
        className="px-6 sm:px-12"
        style={{
          backgroundColor: "#FAF8F4",
          paddingTop: 48,
          paddingBottom: 64,
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {groups.map((g, gi) => (
            <div key={g.name || `__nogroup__${gi}`} style={{ marginTop: gi === 0 ? 0 : 40 }}>
              {showGroupHeaders && g.name && (
                <Reveal>
                  <h3
                    className="font-heading"
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#1A1510",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      marginBottom: 16,
                    }}
                  >
                    {g.name}
                  </h3>
                </Reveal>
              )}
              <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {g.items.map((item) => (
                  <RevealItem key={item.name + item.url} className="h-full">
                    <DesignCard item={item} />
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Card ─── */
function DesignCard({ item }: { item: DesignKitItem }) {
  const style = costStyle(item.cost);
  const [expanded, setExpanded] = useState(false);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.boxShadow = "-4px 4px 16px rgba(0,0,0,0.10)";
  }, []);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.boxShadow = "none";
  }, []);

  const hasVerdict = !!item.verdict;

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
        {/* Header row: name + cost pill */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3
            className="font-heading font-semibold text-base leading-tight"
            style={{ color: "#1A1510" }}
          >
            {item.name}
          </h3>
          {item.cost && (
            <span
              className="shrink-0 px-2 py-0.5 rounded-full font-body text-[11px] font-medium"
              style={{ backgroundColor: style.bg, color: style.text }}
            >
              {item.cost}
            </span>
          )}
        </div>

        {/* Group label (small uppercase) */}
        {item.group && (
          <span
            className="font-body"
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#2D35C9",
              marginBottom: 10,
            }}
          >
            {item.group}
          </span>
        )}

        {/* Body: when_to_use */}
        {item.when_to_use && (
          <p className="font-body text-sm leading-relaxed text-foreground mb-3">
            {item.when_to_use}
          </p>
        )}

        {/* Verdict expand */}
        {hasVerdict && expanded && (
          <div className="mb-3">
            <div className="bg-background rounded-lg p-3 font-body text-sm italic text-foreground/80">
              {item.verdict}
            </div>
          </div>
        )}

        {hasVerdict && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((prev) => !prev);
            }}
            className="self-start font-body text-xs font-medium hover:underline"
            style={{ color: "#2D35C9", background: "none", border: "none", padding: 0, cursor: "pointer" }}
          >
            {expanded ? "Why I use it ↑" : "Why I use it ↓"}
          </button>
        )}

        <div className="mt-auto" />
      </div>

      {/* Open link */}
      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block px-5 py-3 font-body text-[13px] font-medium no-underline"
          style={{ backgroundColor: "#7B7FD4", color: "#ffffff" }}
        >
          Open →
        </a>
      )}
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

  const sections = useMemo(() => organise(items), [items]);

  return (
    <>
      <SEO
        title="Design Kit | The Edit"
        description="Curated visual resources for marketing and communications professionals working with AI."
        canonical="https://theeditai.co.uk/design-kit"
      />
      <CobaltZone
        heading=""
        twoLineHeading={{ line1: "Design Workflow", line2: "" }}
        subheading="From blank page to build-ready."
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
                  key={section.phase.name}
                  phase={section.phase}
                  number={section.number}
                  groups={section.groups}
                  showGroupHeaders={section.showGroupHeaders}
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
