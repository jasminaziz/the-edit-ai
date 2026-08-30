import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTools, fetchWhatsNew, fetchMyStack, isComplete, type Tool, type WhatsNew, type MyStackItem } from "@/lib/sheets";
import { parseDate } from "@/components/WhatsNewCard";
import { HomeGravity } from "@/components/HomeGravity";
import { Counter } from "@/components/ui/animated-counter";
import { useIsMobile } from "@/hooks/use-mobile";
import { SEO } from "@/components/SEO";
import { AboutPanel } from "@/components/AboutPanel";
const CATEGORY_COLOURS: Record<string, { bg: string; text: string }> = {
  "New Release": { bg: "#2D35C9", text: "#FFFFFF" },
  "Model Update": { bg: "#7B7FD4", text: "#FFFFFF" },
  "Tool Launch": { bg: "#2D6A4F", text: "#FFFFFF" },
  "Integration": { bg: "#4A4A9A", text: "#FFFFFF" },
  "AI in the News": { bg: "#E8572A", text: "#FFFFFF" },
};

const Index = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  // Sourced from the my_stack tab, not from tools: my_stack is a personal claim
  // about what Jasmin actually runs, so neither the hero pills nor the
  // "What I'm running" strip can contradict the "tools that have been through
  // the checks" counter further down the page. The strip was re-pointed here from
  // tools.status === "in_stack" by Jasmin's ruling of 28 August 2026.
  const [myStack, setMyStack] = useState<MyStackItem[]>([]);
  const [news, setNews] = useState<WhatsNew[]>([]);
  const [loading, setLoading] = useState(true);
  const pillsSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    Promise.all([fetchTools(), fetchWhatsNew(), fetchMyStack()]).then(([t, n, m]) => {
      setTools(t);
      setNews(n);
      setMyStack(m);
      setLoading(false);
    });
  }, []);

  const stackTools = myStack.slice(0, 4);
  // "Through the checks" counts complete rows, using the same predicate the
  // directory grid renders on, so this number and the cards on /tools cannot
  // disagree. It previously counted a non-empty last_checked, which would have
  // counted a row that carried a date but was still missing its trustee note —
  // a row the grid refuses to show. Reads 0 until the axis fields are filled.
  const checkedTools = tools.filter(isComplete).length;
  const isMobile = useIsMobile();
  const latestNews = [...news]
    .sort((a, b) => {
      const da = parseDate(a.date)?.getTime() || 0;
      const db = parseDate(b.date)?.getTime() || 0;
      return db - da;
    })
    .slice(0, 1);

  return (
    <div className="relative">
      <SEO
        title="The Edit | AI Tools for Charity, Cultural & Heritage Comms"
        description="An opinionated AI tools directory for charity, cultural and heritage comms teams. What each tool is for, what it really costs, and the data and training checks already done. No sponsored lists."
        canonical="https://theeditai.co.uk/"
        googleVerification="2_93U4mtnkpPZgW6fZZJaOIQ7tEKv7__f8JSMuO0HC8"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "The Edit",
          url: "https://theeditai.co.uk",
          description:
            "An opinionated directory of AI tools for communications teams in charities, cultural organisations and heritage. Built and maintained by Jasmin Aziz.",
          author: {
            "@type": "Person",
            name: "Jasmin Aziz",
            url: "https://theeditai.co.uk",
            jobTitle: "Strategic Communications Consultant",
            email: "hello@jasminaziz.co.uk",
          },
        }}
      />
      {/* Hero */}
      <section
        ref={pillsSectionRef}
        className="relative min-h-[78vh] sm:min-h-[100vh] flex flex-col justify-start sm:justify-end overflow-hidden px-4 sm:px-10 md:px-16 pb-10 sm:pb-16 -mt-14 sm:-mt-16 pt-14 sm:pt-16"
        style={{ backgroundColor: "#7B7FD4" }}
      >
        {/* Pills layer — sits IN FRONT of the headlines so they can be dragged across the type, on every device */}
        <div className="absolute inset-0 z-20">
          {!loading && <HomeGravity names={myStack.map((i) => i.name)} />}
        </div>

        {/* Typography layer */}
        <div className="relative z-10 pointer-events-none">
          {/* One h1, two block spans. This was two h1 elements, so the
              homepage announced two first-level headings reading "The" and
              "Edit." separately. As one heading it reads "The Edit." and the
              display treatment is unchanged: every size, colour, leading and
              optical inset below is the value it carried before. */}
          <h1 className="font-heading font-bold w-full" style={{ margin: 0 }}>
            {/* THE — full-width, pushed to edges */}
            <span
              className="block leading-[0.82] w-full"
              style={{
                fontSize: "clamp(120px, 28vw, 420px)",
                color: "#2D35C9",
                letterSpacing: "-0.04em",
                marginLeft: "-0.04em",
              }}
            >
              The
            </span>
            {/* EDIT — even bigger, commanding */}
            <span
              className="block leading-[0.78] w-full"
              style={{
                fontSize: "clamp(160px, 38vw, 560px)",
                color: "#2D35C9",
                letterSpacing: "-0.05em",
                marginLeft: "-0.05em",
                marginTop: "-0.02em",
              }}
            >
              Edit.
            </span>
          </h1>
        </div>

      </section>

      {/* The intro section that sat here was a compressed duplicate of the
          About panel below it: same definition, same checks claim, same
          "No sponsored listings, no affiliate links", same byline. Its two
          unique pieces, the hook and the Curated by line, moved into
          AboutPanel on 30 Aug 2026 and the rest was removed as duplication.
          No wording changed. See AboutPanel.tsx. */}

      <AboutPanel />

      {/* Dashboard Preview Strip */}
      <section className="bg-background pt-4 pb-6 sm:pt-6 sm:pb-12 px-6 sm:px-12">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* My Stack Preview */}
          <div className="space-y-4">
            <h2 className="font-body font-semibold text-[11px] uppercase tracking-[0.05em] text-text-secondary">
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
                  <p className="text-text-secondary text-sm font-body">No stack data yet.</p>
                )}
              </div>
            )}
            <Link
              to="/my-stack"
              className="inline-block font-body font-medium text-sm text-primary hover:underline"
            >
              See everything I use →
            </Link>
          </div>

          {/* AI News */}
          <div className="space-y-4">
            <h2 className="font-body font-semibold text-[11px] uppercase tracking-[0.05em] text-text-secondary">
              AI News
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
                      <p className="font-body text-[11px] uppercase" style={{ color: "hsl(var(--text-secondary))", letterSpacing: "0.06em" }}>{n.developer}</p>
                    </div>
                  );
                })}
                {latestNews.length === 0 && (
                  <p className="text-text-secondary text-sm font-body">No news yet.</p>
                )}
              </div>
            )}
            <Link
              to="/ai-news"
              className="inline-block font-body font-medium text-sm text-primary hover:underline"
            >
              See all AI news →
            </Link>
          </div>

          {/* Tools Count */}
          <div className="space-y-4">
            <h2 className="font-body font-semibold text-[11px] uppercase tracking-[0.05em] text-text-secondary">
              Through the checks
            </h2>
            {loading ? (
              <div className="h-20 bg-border rounded animate-pulse" />
            ) : (
              <>
                <Counter
                  end={checkedTools}
                  fontSize={isMobile ? 56 : 80}
                  className="text-primary"
                />
                <p className="font-body text-[15px] text-text-secondary">tools that have been through the checks</p>
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
