import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTools, fetchWhatsNew, type Tool, type WhatsNew } from "@/lib/sheets";
import { HomeGravity } from "@/components/HomeGravity";

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

  useEffect(() => {
    Promise.all([fetchTools(), fetchWhatsNew()]).then(([t, n]) => {
      setTools(t);
      setNews(n);
      setLoading(false);
    });
  }, []);

  const stackTools = tools.filter((t) => t.status === "in_stack").slice(0, 4);
  const latestNews = news.slice(0, 1);

  return (
    <>
      {/* Hero */}
      <section
        className="relative min-h-[40vh] sm:min-h-[100vh] flex flex-col justify-end overflow-hidden px-4 sm:px-10 md:px-16 pb-10 sm:pb-16 -mt-14 sm:-mt-16 pt-14 sm:pt-16"
        style={{ backgroundColor: "#7B7FD4" }}
      >
        {/* Pills layer — sits behind the headlines, fills the hero */}
        <div className="absolute inset-0 z-0">
          {!loading && <HomeGravity tools={tools} variant="hero" />}
        </div>

        {/* Typography layer — pointer-events-none so pills are draggable through it */}
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

      {/* CTA Strip */}
      <section className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-12 py-6 px-6" style={{ backgroundColor: "#2D35C9" }}>
        <Link
          to="/tools"
          className="font-heading font-semibold text-base sm:text-xl text-primary-foreground hover:text-accent transition-colors duration-150 text-center"
        >
          Browse the full stack →
        </Link>
        <Link
          to="/whats-new"
          className="font-heading font-semibold text-base sm:text-xl text-primary-foreground hover:text-accent transition-colors duration-150 text-center"
        >
          What's new this week →
        </Link>
      </section>
    </>
  );
};

export default Index;
