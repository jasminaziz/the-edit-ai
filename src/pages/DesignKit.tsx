import { useEffect, useState, useMemo } from "react";
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

const DesignKitPage = () => {
  const [items, setItems] = useState<DesignKitItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState("ALL");

  useEffect(() => {
    fetchDesignKit().then((data) => {
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
      <CobaltZone
        heading="Design Kit"
        subheading="What I reach for at the start of any visual project."
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
                    border: `1px solid ${activeCategory === cat ? "#2D35C9" : "#D1D5DB"}`,
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item) => (
                <DesignCard key={item.name + item.url} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

function DesignCard({ item }: { item: DesignKitItem }) {
  const style = costStyle(item.cost);

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-xl overflow-hidden border border-border bg-card flex flex-col hover:translate-x-1.5 transition-all duration-200 no-underline"
      style={{
        transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        boxShadow: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "-4px 4px 16px rgba(0,0,0,0.10)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-heading font-semibold text-base leading-tight" style={{ color: "#1A1510" }}>
            {item.name}
          </h3>
          <span
            className="shrink-0 px-2 py-0.5 rounded-full font-body text-[11px] font-medium"
            style={{ backgroundColor: style.bg, color: style.text }}
          >
            {item.cost}
          </span>
        </div>

        {item.category && (
          <span
            className="inline-block self-start px-2 py-0.5 rounded-full font-body text-[11px] mb-3"
            style={{ backgroundColor: "#EEF0FB", color: "#2D35C9" }}
          >
            {item.category}
          </span>
        )}

        <p className="font-body text-sm leading-relaxed text-foreground mb-3">
          {item.what_it_does}
        </p>

        {item.when_to_use && (
          <p className="font-body text-xs text-muted-foreground mb-3">
            <strong>When to use:</strong> {item.when_to_use}
          </p>
        )}

        {item.verdict && (
          <div className="mt-auto bg-background rounded-lg p-3 font-body text-sm italic text-foreground/80">
            {item.verdict}
          </div>
        )}
      </div>

      <div
        className="px-5 py-3 font-body text-[13px] font-medium"
        style={{ backgroundColor: "#2D35C9", color: "#ffffff" }}
      >
        Open →
      </div>
    </a>
  );
}

export default DesignKitPage;
