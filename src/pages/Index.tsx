import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTools, fetchWhatsNew, type Tool, type WhatsNew } from "@/lib/sheets";
import { RelevanceBadge } from "@/components/StatusBadge";
import { StampBadge } from "@/components/StampBadge";


const TICKER_TEXT = "Honest verdicts · No affiliate links · Built for comms leaders · Updated regularly · No hype · ";

const Index = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [news, setNews] = useState<WhatsNew[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchTools(), fetchWhatsNew()]).then(([t, n]) => {
      setTools(t);
      setNews(n);
      setLoading(false);
    });
  }, []);

  const stackTools = tools.filter((t) => t.status === "in_stack").slice(0, 4);
  const latestNews = news.slice(0, 2);

  return (
    <>
      {/* Hero */}
      <section
        className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden"
        style={{ backgroundColor: "#7B7FD4", padding: "120px 100px 80px" }}
      >
        <GeometricRain />
        <h1
          className="font-heading font-bold leading-[0.85] whitespace-nowrap"
          style={{
            fontSize: "clamp(80px, 14vw, 160px)",
            color: "#2D35C9",
            letterSpacing: "-0.03em",
          }}
        >
          The Edit
        </h1>

        {/* Double squiggle */}
        <div className="mt-8 max-w-[600px] self-end">
          <svg viewBox="0 0 600 40" fill="none" className="w-full">
            <path
              d="M0 10 Q75 -10 150 10 T300 10 T450 10 T600 10"
              stroke="#C8F04A"
              strokeWidth="6"
              fill="none"
            />
            <path
              d="M0 28 Q75 8 150 28 T300 28 T450 28 T600 28"
              stroke="#C8F04A"
              strokeWidth="6"
              fill="none"
            />
          </svg>
        </div>

        <p
          className="font-body font-semibold mt-8 text-left"
          style={{
            fontSize: "clamp(16px, 2.2vw, 28px)",
            color: "#C8F04A",
          }}
        >
          Honest verdicts only.
        </p>
      </section>

      {/* Wavy Ticker Strip */}
      <div className="relative overflow-hidden" style={{ height: 56, backgroundColor: "#C8F04A" }}>
        <div className="absolute inset-0 flex items-center">
          <div className="flex whitespace-nowrap">
            <span className="inline-block animate-ticker font-body font-medium text-[13px] tracking-[0.03em] text-foreground">
              {TICKER_TEXT.repeat(8)}
            </span>
          </div>
        </div>
      </div>

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

          {/* Latest What's New */}
          <div className="space-y-4">
            <h2 className="font-body font-semibold text-[11px] uppercase tracking-[0.05em] text-muted">
              Just dropped
            </h2>
            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-card rounded-lg border border-border p-4 animate-pulse h-16" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {latestNews.map((n) => (
                  <div key={n.name} className="bg-card rounded-lg border border-border p-3.5">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-heading font-semibold text-base text-foreground">{n.name}</h3>
                      <RelevanceBadge level={n.relevance_level} />
                    </div>
                    <p className="font-body text-[13px] text-muted">{n.developer}</p>
                  </div>
                ))}
                {latestNews.length === 0 && (
                  <p className="text-muted text-sm font-body">No news yet.</p>
                )}
              </div>
            )}
            <Link
              to="/whats-new"
              className="inline-block font-body font-medium text-sm text-primary hover:underline"
            >
              See everything →
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
                <p
                  className="font-heading font-bold text-primary"
                  style={{ fontSize: "clamp(56px, 8vw, 80px)" }}
                >
                  {tools.length}
                </p>
                <p className="font-body text-[15px] text-muted">across 11 categories</p>
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

      {/* CTA Strip */}
      <section className="flex items-center justify-center gap-12 py-6" style={{ backgroundColor: "#2D35C9", height: 80 }}>
        <Link
          to="/tools"
          className="font-heading font-semibold text-xl text-primary-foreground hover:text-accent transition-colors duration-150"
        >
          Browse the full stack →
        </Link>
        <Link
          to="/whats-new"
          className="font-heading font-semibold text-xl text-primary-foreground hover:text-accent transition-colors duration-150"
        >
          What's new this week →
        </Link>
      </section>

      <StampBadge />
    </>
  );
};

export default Index;
