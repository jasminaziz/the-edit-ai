import { useEffect, useState } from "react";
import { fetchWhatsNew, type WhatsNew } from "@/lib/sheets";
import { RelevanceBadge } from "@/components/StatusBadge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorState, EmptyState } from "@/components/ErrorState";
import { CobaltZone } from "@/components/CobaltZone";

const WhatsNewPage = () => {
  const [items, setItems] = useState<WhatsNew[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchWhatsNew().then((n) => {
      if (n.length === 0 && import.meta.env.VITE_GOOGLE_SHEETS_ID) setError(true);
      setItems(n.reverse());
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

  return (
    <>
      <CobaltZone
        heading=""
        twoLineHeading={{ line1: "What's New —", line2: "in AI" }}
        bodyText="Model updates, new releases, and changes to this directory. Updated regularly from The Rundown.ai."
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {items.map((item) => (
                <NewsCard
                  key={item.name}
                  item={item}
                  expanded={expanded.has(item.name)}
                  onToggle={() => toggle(item.name)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

function NewsCard({
  item,
  expanded,
  onToggle,
}: {
  item: WhatsNew;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="rounded-xl p-8 transition-colors duration-150 ease-in-out"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E8E2D8",
        borderRadius: 12,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#2D35C9";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#E8E2D8";
      }}
    >
      {/* Top line: date + badge */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="font-body"
          style={{ fontSize: 13, color: "#9A8F82" }}
        >
          {item.launched}
        </span>
        <RelevanceBadge level={item.relevance_level} />
      </div>

      {/* Title */}
      <h3
        className="font-heading font-bold leading-tight mb-3 line-clamp-2"
        style={{ fontSize: 22, color: "#1A1510" }}
      >
        {item.name}
      </h3>

      {/* Summary */}
      <p
        className="font-body leading-relaxed line-clamp-3 mb-4"
        style={{ fontSize: 15, color: "rgba(26, 21, 16, 0.7)" }}
      >
        {item.what_it_is}
      </p>

      {/* Read more toggle */}
      <button
        onClick={onToggle}
        className="font-body font-medium"
        style={{ fontSize: 14, color: "#2D35C9", background: "none", border: "none", padding: 0, cursor: "pointer" }}
      >
        {expanded ? "← Less" : "Read more →"}
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="mt-4 space-y-2 font-body text-sm bg-background p-4 rounded-lg">
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
  );
}

export default WhatsNewPage;
