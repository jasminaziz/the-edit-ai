import { useEffect, useState } from "react";
import { fetchWhatsNew, type WhatsNew } from "@/lib/sheets";
import { RelevanceBadge } from "@/components/StatusBadge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorState, EmptyState } from "@/components/ErrorState";
import { Zap } from "lucide-react";

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
  const rest = items.slice(1);

  return (
    <>
      <section className="bg-primary py-12 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-heading font-black text-4xl sm:text-5xl text-primary-foreground">
            What's New —
          </h1>
          <p className="font-heading font-black text-3xl sm:text-4xl text-accent">in AI</p>
          <p className="text-primary-foreground/80 text-sm mt-3 max-w-lg">
            Model updates, new releases, and changes to this directory. Updated regularly.
          </p>
        </div>
        <Zap className="absolute top-6 right-8 h-10 w-10 text-accent opacity-80" />
      </section>

      <section className="bg-background py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorState />
          ) : items.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-8">
              {/* Featured */}
              {featured && (
                <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
                  <div className="h-2 bg-primary" />
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {featured.developer} · {featured.launched}
                        </p>
                        <h2 className="font-heading font-bold text-xl">{featured.name}</h2>
                      </div>
                      <RelevanceBadge level={featured.relevance_level} />
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-5 mb-3">
                      {featured.what_it_is}
                    </p>
                    <button
                      onClick={() => toggle(featured.name)}
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      {expanded.has(featured.name) ? "← Less" : "→ Read more"}
                    </button>
                    {expanded.has(featured.name) && (
                      <div className="mt-3 space-y-2 text-sm bg-muted p-4 rounded-md">
                        {featured.verdict && <p><strong>Verdict:</strong> {featured.verdict}</p>}
                        {featured.watch_out_for && <p><strong>Watch out for:</strong> {featured.watch_out_for}</p>}
                        {featured.key_integrations && <p><strong>Key integrations:</strong> {featured.key_integrations}</p>}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Rest */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rest.map((item, i) => (
                  <div key={item.name} className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
                    <div className="h-2" style={{ backgroundColor: i % 2 === 0 ? "#2D2DE5" : "#C8F135" }} />
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            {item.developer} · {item.launched}
                          </p>
                          <h3 className="font-heading font-bold text-base">{item.name}</h3>
                        </div>
                        <RelevanceBadge level={item.relevance_level} />
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{item.what_it_is}</p>
                      <button
                        onClick={() => toggle(item.name)}
                        className="text-sm font-semibold text-primary hover:underline"
                      >
                        {expanded.has(item.name) ? "← Less" : "→ Read more"}
                      </button>
                      {expanded.has(item.name) && (
                        <div className="mt-3 space-y-2 text-sm bg-muted p-4 rounded-md">
                          {item.verdict && <p><strong>Verdict:</strong> {item.verdict}</p>}
                          {item.watch_out_for && <p><strong>Watch out for:</strong> {item.watch_out_for}</p>}
                          {item.key_integrations && <p><strong>Key integrations:</strong> {item.key_integrations}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default WhatsNewPage;
