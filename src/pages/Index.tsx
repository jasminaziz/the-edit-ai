import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTools, fetchWhatsNew, type Tool, type WhatsNew } from "@/lib/sheets";
import { RelevanceBadge } from "@/components/StatusBadge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ArrowRight } from "lucide-react";

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
      <section className="relative bg-hero min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-heading font-black text-6xl sm:text-8xl lg:text-9xl text-primary/70 leading-none mb-4">
          The Edit
        </h1>
        <p className="font-heading font-bold text-xl sm:text-2xl text-accent mb-4">
          Honest verdicts only.
        </p>
        <p className="text-primary-foreground/80 text-sm max-w-lg">
          An independent tracker of AI tools — built for people who want a real opinion, not a feature list.
        </p>
      </section>

      {/* Wavy divider */}
      <div className="relative -mt-1">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
          <path
            d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z"
            fill="hsl(var(--background))"
          />
          <path
            d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40"
            stroke="#C8F135"
            strokeWidth="3"
            fill="none"
          />
        </svg>
      </div>

      {/* Content sections */}
      <section className="bg-background py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* My Stack Preview */}
          <div className="space-y-4">
            <h2 className="font-heading font-bold text-sm uppercase tracking-widest text-muted-foreground">
              What I'm running
            </h2>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="flex flex-wrap gap-2">
                {stackTools.map((t) => (
                  <span
                    key={t.name}
                    className="px-3 py-1.5 rounded-full text-sm font-medium bg-foreground text-background"
                  >
                    {t.name}
                  </span>
                ))}
                {stackTools.length === 0 && (
                  <p className="text-muted-foreground text-sm">No stack data yet.</p>
                )}
              </div>
            )}
            <Link
              to="/my-stack"
              className="inline-flex items-center gap-1 text-primary font-medium text-sm hover:underline"
            >
              See full stack <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Latest What's New */}
          <div className="space-y-4">
            <h2 className="font-heading font-bold text-sm uppercase tracking-widest text-muted-foreground">
              Just dropped
            </h2>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="space-y-3">
                {latestNews.map((n) => (
                  <div key={n.name} className="bg-card rounded-lg p-4 shadow-sm border border-border">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-heading font-bold text-sm">{n.name}</h3>
                      <RelevanceBadge level={n.relevance_level} />
                    </div>
                    <p className="text-muted-foreground text-xs">{n.developer}</p>
                  </div>
                ))}
                {latestNews.length === 0 && (
                  <p className="text-muted-foreground text-sm">No news yet.</p>
                )}
              </div>
            )}
            <Link
              to="/whats-new"
              className="inline-flex items-center gap-1 text-primary font-medium text-sm hover:underline"
            >
              See everything <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Tools Count */}
          <div className="space-y-4">
            <h2 className="font-heading font-bold text-sm uppercase tracking-widest text-muted-foreground">
              In the directory
            </h2>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                <p className="font-heading font-black text-6xl text-primary">{tools.length}</p>
                <p className="text-muted-foreground text-sm">across 11 categories</p>
              </>
            )}
            <Link
              to="/tools"
              className="inline-flex items-center gap-1 text-primary font-medium text-sm hover:underline"
            >
              Browse tools <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
