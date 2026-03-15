import { useEffect, useState } from "react";
import { fetchWhatsNew, type WhatsNew, RELEVANCE_MAP } from "@/lib/sheets";
import { RelevanceBadge } from "@/components/StatusBadge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorState, EmptyState } from "@/components/ErrorState";
import { CobaltZone } from "@/components/CobaltZone";


const COLOR_FIELDS = ["#7B7FD4", "#2D35C9", "#C8F04A", "#9B7B3A", "#2D6A4F", "#4A4A9A"];

const WhatsNewPage = () => {
  const [items, setItems] = useState<WhatsNew[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchWhatsNew().then((n) => {
      if (n.length === 0 && import.meta.env.VITE_GOOGLE_SHEETS_ID) setError(true);
      setItems(n);
      setLoading(false);
    });
  }, []);

  const toggle = (name: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const featured = items[0];
  const stacked = items.slice(1, 3);
  const rest = items.slice(3);

  return (
    <>
      <CobaltZone
        heading=""
        twoLineHeading={{ line1: "What's New —", line2: "in AI" }}
        bodyText="Model updates, new releases, and changes to this directory. Updated regularly."
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
            <div className="space-y-6">
              {/* Row 1: Hero + stacked */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* Hero card - 60% */}
                {featured && (
                  <NewsCard
                    item={featured}
                    colorIndex={0}
                    isHero
                    expanded={expanded.has(featured.name)}
                    onToggle={() => toggle(featured.name)}
                    className="md:col-span-3"
                  />
                )}
                {/* Stacked cards - 40% */}
                {stacked.length > 0 && (
                  <div className="md:col-span-2 flex flex-col gap-4">
                    {stacked.map((item, i) => (
                      <NewsCard
                        key={item.name}
                        item={item}
                        colorIndex={i + 1}
                        expanded={expanded.has(item.name)}
                        onToggle={() => toggle(item.name)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Row 2+: 3-column grid */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((item, i) => (
                    <NewsCard
                      key={item.name}
                      item={item}
                      colorIndex={i + 3}
                      expanded={expanded.has(item.name)}
                      onToggle={() => toggle(item.name)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

function NewsCard({
  item,
  colorIndex,
  isHero,
  expanded,
  onToggle,
  className = "",
}: {
  item: WhatsNew;
  colorIndex: number;
  isHero?: boolean;
  expanded: boolean;
  onToggle: () => void;
  className?: string;
}) {
  const fieldColor = COLOR_FIELDS[colorIndex % COLOR_FIELDS.length];
  const fieldHeight = isHero ? 220 : 150;

  return (
    <div
      className={`rounded-xl overflow-hidden border border-border group sm:hover:translate-x-1.5 transition-all duration-200 ${className}`}
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
      {/* Zone A - Color field */}
      <div
        className="relative overflow-hidden group-hover:brightness-[1.08] transition-[filter] duration-200"
        style={{ backgroundColor: fieldColor, height: fieldHeight }}
      >
        <span
          className="absolute bottom-3 left-4 font-body font-bold"
          style={{
            fontSize: isHero ? 18 : 14,
            color: "rgba(255,255,255,0.25)",
          }}
        >
          {item.developer}
        </span>
      </div>

      {/* Zone B - Cobalt header band */}
      <div
        className="flex items-center justify-between px-4"
        style={{ backgroundColor: "#2D35C9", height: 36 }}
      >
        <span className="font-body text-[11px]" style={{ color: "rgba(250,248,244,0.7)" }}>
          {item.developer} · {item.launched}
        </span>
        <RelevanceBadge level={item.relevance_level} />
      </div>

      {/* Zone C - Card body */}
      <div className="bg-card p-5" style={{ borderTop: "none" }}>
        <h3
          className="font-heading font-semibold leading-tight mb-2"
          style={{ fontSize: isHero ? 20 : 16, color: "#1A1510" }}
        >
          {item.name}
        </h3>
        <p
          className={`font-body text-sm leading-relaxed text-foreground ${isHero ? "line-clamp-5" : "line-clamp-3"} mb-3`}
        >
          {item.what_it_is}
        </p>

        {/* Model tag if status exists */}
        {item.status && (
          <span
            className="inline-block px-2 py-0.5 font-body text-[11px] rounded-full mb-3"
            style={{ backgroundColor: "#EEF0FB", color: "#2D35C9" }}
          >
            {item.status}
          </span>
        )}

        <button
          onClick={onToggle}
          className="block font-body font-medium text-[13px] text-primary hover:underline"
        >
          {expanded ? "← Less" : "→ Read more"}
        </button>

        {expanded && (
          <div className="mt-3 space-y-2 font-body text-sm bg-background p-4 rounded-lg">
            {item.verdict && (
              <p><strong className="text-foreground">Verdict:</strong> {item.verdict}</p>
            )}
            {item.watch_out_for && (
              <p><strong className="text-foreground">Watch out for:</strong> {item.watch_out_for}</p>
            )}
            {item.key_integrations && (
              <p><strong className="text-foreground">Key integrations:</strong> {item.key_integrations}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default WhatsNewPage;
