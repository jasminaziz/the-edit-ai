import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTools, fetchWhatsNew, type Tool, type WhatsNew } from "@/lib/sheets";
import { parseDate } from "@/components/WhatsNewCard";
import { HomeGravity } from "@/components/HomeGravity";
import { Counter } from "@/components/ui/animated-counter";
import { useIsMobile } from "@/hooks/use-mobile";

// Mobile-only scroll cue: a soft, slow-bouncing chevron pinned bottom-centre of the hero.
// Sits above the pills (z-30) but is pointer-events-none so it never blocks dragging.
// Fades out once the user has scrolled past the hero so it doesn't linger.
function ScrollChevron() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <>
      <style>{`
        @keyframes edit-scroll-bounce {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, 6px); }
        }
      `}</style>
      <div
        aria-hidden="true"
        className="sm:hidden absolute left-1/2 bottom-4 z-30 pointer-events-none transition-opacity duration-500"
        style={{
          transform: "translateX(-50%)",
          opacity: hidden ? 0 : 0.7,
          animation: "edit-scroll-bounce 2s ease-in-out infinite",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2D35C9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </>
  );
}

const CATEGORY_COLOURS: Record<string, { bg: string; text: string }> = {
  "New Release": { bg: "#2D35C9", text: "#FFFFFF" },
  "Model Update": { bg: "#7B7FD4", text: "#FFFFFF" },
  "Tool Launch": { bg: "#2D6A4F", text: "#FFFFFF" },
  "Integration": { bg: "#4A4A9A", text: "#FFFFFF" },
  "AI in the News": { bg: "#E8572A", text: "#FFFFFF" },
};





const Index = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [news, setNews] = useState<WhatsNew[]>([]);
  const [loading, setLoading] = useState(true);
  const pillsSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    Promise.all([fetchTools(), fetchWhatsNew()]).then(([t, n]) => {
      setTools(t);
      setNews(n);
      setLoading(false);
    });
  }, []);

  const stackTools = tools.filter((t) => t.status === "in_stack").slice(0, 4);
  const isMobile = useIsMobile();
  const latestNews = [...news]
    .sort((a, b) => {
      const da = parseDate(a.date)?.getTime() || 0;
      const db = parseDate(b.date)?.getTime() || 0;
      return db - da;
    })
    .slice(0, isMobile ? 1 : 3);

  return (
    <div className="relative">
      {/* Hero */}
      <section
        ref={pillsSectionRef}
        className="relative min-h-[78vh] sm:min-h-[100vh] flex flex-col justify-start sm:justify-end overflow-hidden px-4 sm:px-10 md:px-16 pb-10 sm:pb-16 -mt-14 sm:-mt-16 pt-14 sm:pt-16"
        style={{ backgroundColor: "#7B7FD4" }}
      >
        {/* Pills layer — sits IN FRONT of the headlines so they can be dragged across the type, on every device */}
        <div className="absolute inset-0 z-20">
          {!loading && <HomeGravity tools={tools} />}
        </div>

        {/* Typography layer */}
        <div className="relative z-10 pointer-events-none">
          {/* THE — full-width, pushed to edges */}
          <h1
            className="font-heading font-black leading-[0.82] w-full"
            style={{
              fontSize: "clamp(120px, 28vw, 420px)",
              color: "#2D35C9",
              letterSpacing: "-0.04em",
              marginLeft: "-0.04em",
            }}
          >
            The
          </h1>
          {/* EDIT — even bigger, commanding */}
          <h1
            className="font-heading font-black leading-[0.78] w-full"
            style={{
              fontSize: "clamp(160px, 38vw, 560px)",
              color: "#2D35C9",
              letterSpacing: "-0.05em",
              marginLeft: "-0.05em",
              marginTop: "-0.02em",
            }}
          >
            Edit.
          </h1>
        </div>

        {/* Mobile-only scroll affordance — soft bouncing chevron, hides after first scroll */}
        <ScrollChevron />
      </section>

      {/* Intro / positioning */}
      <section className="bg-background pt-6 pb-2 sm:pt-16 sm:pb-4 px-6 sm:px-12">
        <div className="max-w-[1280px] mx-auto">
          <div style={{ maxWidth: 640 }}>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: 20,
                color: "#1A1510",
                margin: 0,
                marginBottom: 16,
              }}
            >
              There's a lot to keep up with. This helps.
            </p>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 400,
                fontSize: 17,
                lineHeight: 1.6,
                color: "#1A1510",
                margin: 0,
                marginBottom: 16,
              }}
            >
              A curated directory of AI tools that actually work, with honest verdicts from someone who builds with them every day. Made for people who want to use AI well, without having to become an expert first.
            </p>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 400,
                fontSize: 14,
                color: "#9A8F82",
                margin: 0,
              }}
            >
              Curated by Jasmin Aziz — strategic communications consultant and AI practitioner.
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Strip */}
      <section className="bg-background py-16 px-6 sm:px-12">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* My Stack Preview */}
          <div className="space-y-4">
            <h2 className="font-body font-semibold text-[11px] uppercase tracking-[0.05em] text-muted">
              What I'm running
            </h2>
            {loading ? (
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <span key={i} className="px-3.5 py-1.5 rounded-full bg-border animate-pulse" style={{ width: 80, height: 30 }} />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {stackTools.map((t) => (
                  <span
                    key={t.name}
                    className="px-3.5 py-1.5 rounded-full font-body font-medium text-[13px] text-primary-foreground"
                    style={{ backgroundColor: "#1A1510" }}
                  >
                    {t.name}
                  </span>
                ))}
                {stackTools.length === 0 && (
                  <p className="text-muted text-sm font-body">No stack data yet.</p>
                )}
              </div>
            )}
            <Link
              to="/my-stack"
              className="inline-block font-body font-medium text-sm text-primary hover:underline"
            >
              See full stack →
            </Link>
          </div>

          {/* What's New in AI */}
          <div className="space-y-4">
            <h2 className="font-body font-semibold text-[11px] uppercase tracking-[0.05em] text-muted">
              What's new in AI
            </h2>
            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-card rounded-lg border border-border p-4 animate-pulse h-16" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {latestNews.map((n) => {
                  const cat = CATEGORY_COLOURS[n.category];
                  return (
                    <div key={n.name} className="bg-card rounded-lg border border-border p-3.5">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-heading font-semibold text-base" style={{ color: "#1A1510" }}>{n.name}</h3>
                        {cat && (
                          <span
                            className="font-body font-semibold uppercase shrink-0"
                            style={{
                              fontSize: 10,
                              letterSpacing: "0.06em",
                              borderRadius: 4,
                              padding: "3px 8px",
                              backgroundColor: cat.bg,
                              color: cat.text,
                            }}
                          >
                            {n.category}
                          </span>
                        )}
                      </div>
                      <p className="font-body text-[11px] uppercase" style={{ color: "#9A8F82", letterSpacing: "0.06em" }}>{n.developer}</p>
                    </div>
                  );
                })}
                {latestNews.length === 0 && (
                  <p className="text-muted text-sm font-body">No news yet.</p>
                )}
              </div>
            )}
            <Link
              to="/whats-new"
              className="inline-block font-body font-medium text-sm text-primary hover:underline"
            >
              Discover what's new →
            </Link>
          </div>

          {/* Tools Count */}
          <div className="space-y-4">
            <h2 className="font-body font-semibold text-[11px] uppercase tracking-[0.05em] text-muted">
              In the directory
            </h2>
            {loading ? (
              <div className="h-20 bg-border rounded animate-pulse" />
            ) : (
              <>
                <Counter
                  end={tools.length}
                  fontSize={isMobile ? 56 : 80}
                  className="text-primary"
                  triggerRef={pillsSectionRef}
                />
                <p className="font-body text-[15px] text-muted">AI tools in the directory</p>
              </>
            )}
            <Link
              to="/tools"
              className="inline-block font-body font-medium text-sm text-primary hover:underline"
            >
              Browse tools →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
