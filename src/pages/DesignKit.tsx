import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { fetchDesignKit, type DesignKitItem } from "@/lib/sheets";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorState, EmptyState } from "@/components/ErrorState";
import { CobaltZone } from "@/components/CobaltZone";
import { DesignCard } from "@/components/DesignCard";

interface PhaseConfig {
  key: string;
  number: string;
  name: string;
  explainer: string;
}

const PHASES: PhaseConfig[] = [
  {
    key: "Discover",
    number: "01",
    name: "Discover",
    explainer:
      "Where you find your visual language. Gather references, study what works, and build the brief before any decisions are made.",
  },
  {
    key: "Define",
    number: "02",
    name: "Define",
    explainer:
      "Lock the building blocks. Colour, type, and icons decided here travel through everything you build.",
  },
  {
    key: "Design",
    number: "03",
    name: "Design",
    explainer:
      "Map the structure, design the screens, reference the components. Everything before a single prompt is written.",
  },
  {
    key: "Present",
    number: "04",
    name: "Present",
    explainer:
      "Show the work properly. Device frames and scene mockups turn screenshots into convincing client deliverables.",
  },
  {
    key: "Check",
    number: "05",
    name: "Check",
    explainer:
      "Sign off before building. Contrast, accessibility, and real photography confirmed before anything goes live.",
  },
];

function groupByPhase(items: DesignKitItem[]) {
  const groups: Record<string, DesignKitItem[]> = {};
  for (const item of items) {
    const phase = item.phase?.trim() || "__other__";
    if (!groups[phase]) groups[phase] = [];
    groups[phase].push(item);
  }

  const sections: { config: PhaseConfig | null; items: DesignKitItem[] }[] = [];
  for (const phase of PHASES) {
    if (groups[phase.key]) {
      sections.push({ config: phase, items: groups[phase.key] });
    }
  }

  // Remaining phases not in PHASES list (excluding __other__)
  for (const key of Object.keys(groups)) {
    if (key !== "__other__" && !PHASES.find((p) => p.key === key)) {
      sections.push({
        config: { key, number: "", name: key, explainer: "" },
        items: groups[key],
      });
    }
  }

  // "Other" last — no header band
  if (groups["__other__"]) {
    sections.push({ config: null, items: groups["__other__"] });
  }

  return sections;
}

function useScrollReveal() {
  const refs = useRef<Map<number, HTMLDivElement>>(new Map());

  const setRef = useCallback((index: number, el: HTMLDivElement | null) => {
    if (el) refs.current.set(index, el);
    else refs.current.delete(index);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";

            // Stagger cards
            const cards = el.querySelectorAll<HTMLElement>("[data-card]");
            cards.forEach((card, i) => {
              setTimeout(() => {
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
              }, 400 + i * 60);
            });

            observer.unobserve(el);
          }
        }
      },
      { threshold: 0.15 }
    );

    for (const el of refs.current.values()) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return setRef;
}

const DesignKitPage = () => {
  const [items, setItems] = useState<DesignKitItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const setRef = useScrollReveal();

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

      <section className="bg-background py-10 px-6 sm:px-12">
        <div className="max-w-[1280px] mx-auto">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorState />
          ) : items.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col" style={{ gap: 48 }}>
              {sections.map((section, i) => (
                <div
                  key={section.config?.key ?? "other"}
                  ref={(el) => setRef(i, el)}
                  style={{
                    opacity: 0,
                    transform: "translateY(16px)",
                    transition: "opacity 400ms ease-out, transform 400ms ease-out",
                  }}
                >
                  {/* Phase header band */}
                  {section.config && section.config.number && (
                    <div
                      className="rounded-none"
                      style={{
                        background: "hsl(var(--primary))",
                        padding: "32px 48px",
                        WebkitFontSmoothing: "antialiased",
                      }}
                    >
                      <div
                        className="flex items-baseline"
                        style={{ gap: 24 }}
                      >
                        <span
                          className="font-heading shrink-0"
                          style={{
                            fontSize: 80,
                            fontWeight: 700,
                            color: "hsl(var(--accent))",
                            lineHeight: 1,
                            letterSpacing: "-0.03em",
                            WebkitFontSmoothing: "antialiased",
                          }}
                        >
                          {section.config.number}
                        </span>
                        <div>
                          <h2
                            className="font-heading"
                            style={{
                              fontSize: 36,
                              fontWeight: 700,
                              color: "hsl(var(--primary-foreground))",
                              letterSpacing: "-0.02em",
                              textWrap: "balance",
                              margin: 0,
                            }}
                          >
                            {section.config.name}
                          </h2>
                          {section.config.explainer && (
                            <p
                              className="font-body"
                              style={{
                                fontSize: 16,
                                fontWeight: 400,
                                color: "rgba(255,255,255,0.65)",
                                marginTop: 6,
                                textWrap: "pretty",
                                margin: "6px 0 0",
                              }}
                            >
                              {section.config.explainer}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Phase body — cards */}
                  <div
                    className="bg-card"
                    style={{ padding: "48px 48px 64px" }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {section.items.map((item) => (
                        <div
                          key={item.name + item.url}
                          data-card
                          style={{
                            opacity: 0,
                            transform: "translateY(12px)",
                            transition: "opacity 300ms ease-out, transform 300ms ease-out",
                          }}
                        >
                          <DesignCard item={item} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default DesignKitPage;
