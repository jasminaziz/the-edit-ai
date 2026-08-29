import { useEffect, useState, useMemo } from "react";
import { fetchLearning, type LearningItem } from "@/lib/sheets";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorState, EmptyState } from "@/components/ErrorState";
import { CobaltZone } from "@/components/CobaltZone";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { SEO } from "@/components/SEO";

const Learning = () => {
  const [items, setItems] = useState<LearningItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState("ALL");

  useEffect(() => {
    fetchLearning().then((data) => {
      if (data.length === 0 && import.meta.env.VITE_GOOGLE_SHEETS_ID) setError(true);
      setItems(data);
      setLoading(false);
    });
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(items.map((i) => i.category).filter(Boolean)));
    return ["ALL", ...cats];
  }, [items]);

  const filtered = useMemo(() => {
    if (activeCategory === "ALL") return items;
    return items.filter((i) => i.category === activeCategory);
  }, [items, activeCategory]);

  return (
    <>
      <SEO
        title="Learning | The Edit"
        description="Start here if AI still feels like someone else's subject. Learning resources chosen for charity, cultural and heritage comms teams."
        canonical="https://theeditai.co.uk/learning"
      />
      <CobaltZone
        heading="Learning"
        subheading="How I'm staying sharp, and where to start if you're new to all this."
      />

      <section className="bg-background py-10 px-6 sm:px-12">
        <div className="max-w-[1280px] mx-auto">
          {/* Category filters */}
          {!loading && !error && items.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-4 py-1.5 rounded-full font-body text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: activeCategory === cat ? "#2D35C9" : "transparent",
                    color: activeCategory === cat ? "#ffffff" : "#1A1510",
                    border: `1px solid ${activeCategory === cat ? "#2D35C9" : "#E8E2D8"}`,
                  }}
                >
                  {cat === "ALL" ? "All" : cat}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorState />
          ) : items.length === 0 ? (
            <EmptyState />
          ) : (
            <RevealGroup
              key={activeCategory}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {filtered.map((r) => (
                <RevealItem key={r.name + r.url}>
                  <div
                    className="bg-card rounded-xl border border-border p-6 flex flex-col h-full group transition-all duration-150"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderLeftWidth = "4px";
                      e.currentTarget.style.borderLeftColor = "#C8F04A";
                      e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderLeftWidth = "1px";
                      e.currentTarget.style.borderLeftColor = "#E8E2D8";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                  <h3 className="font-heading font-semibold text-xl text-foreground">{r.name}</h3>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {r.type && (
                      <span
                        className="px-2.5 py-0.5 font-body text-[11px] font-semibold uppercase rounded-full"
                        style={{ backgroundColor: "#EEF0FB", color: "#2D35C9" }}
                      >
                        {r.type}
                      </span>
                    )}
                    {r.provider && (
                      <span
                        className="px-2.5 py-0.5 font-body text-[11px] font-semibold uppercase rounded-full"
                        style={{ backgroundColor: "#EEF0FB", color: "#2D35C9" }}
                      >
                        {r.provider}
                      </span>
                    )}
                    {r.cost && (
                      <span
                        className="px-2.5 py-0.5 font-body text-xs font-medium rounded-full"
                        style={{
                          color: r.cost.toLowerCase().includes("free") ? "#2D6A4F" : "hsl(var(--text-secondary))",
                        }}
                      >
                        {r.cost}
                      </span>
                    )}
                    {r.time && (
                      <span className="px-2.5 py-0.5 font-body text-xs font-medium rounded-full text-muted-foreground">
                        {r.time}
                      </span>
                    )}
                  </div>

                  <p className="font-body text-sm leading-relaxed text-foreground mt-3 mb-1 flex-1">
                    {r.what_it_is}
                  </p>

                  {r.why_i_recommend && (
                    <p className="font-body text-xs text-muted-foreground mb-4">
                      <strong>Why I recommend:</strong> {r.why_i_recommend}
                    </p>
                  )}

                  {r.url && (
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block self-start px-5 py-2.5 font-heading font-semibold text-[15px] rounded-lg text-primary-foreground transition-all duration-150 hover:-translate-y-0.5"
                      style={{ backgroundColor: "#2D35C9" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "#1A22A8";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "#2D35C9";
                      }}
                    >
                      Open resource →
                    </a>
                  )}
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </div>
      </section>

    </>
  );
};

export default Learning;
