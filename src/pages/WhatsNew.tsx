import { useEffect, useState } from "react";
import { fetchWhatsNew, type WhatsNew } from "@/lib/sheets";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorState, EmptyState } from "@/components/ErrorState";
import { CobaltZone } from "@/components/CobaltZone";
import { WhatsNewCard, normaliseBatch } from "@/components/WhatsNewCard";

function groupByBatch(items: WhatsNew[]): { batch: string; items: WhatsNew[] }[] {
  const map = new Map<string, WhatsNew[]>();
  for (const item of items) {
    const key = normaliseBatch(item.batch);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }
  return Array.from(map.entries()).map(([batch, items]) => ({ batch, items }));
}

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

  const groups = groupByBatch(items);

  return (
    <>
      <CobaltZone
        heading=""
        twoLineHeading={{ line1: "What's New —", line2: "in AI" }}
        bodyText="Model updates, new releases, and general AI gossip. Updated regularly from The Rundown.ai."
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
            <div>
              {groups.map((group, gi) => (
                <div key={group.batch} style={{ marginTop: gi === 0 ? 48 : 64 }}>
                  <h2
                    className="font-heading"
                    style={{ fontWeight: 700, fontSize: 32, color: "#2D35C9" }}
                  >
                    {group.batch}
                  </h2>
                  <hr className="mt-2 mb-6" style={{ borderColor: "#E8E2D8" }} />

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ alignItems: "stretch" }}>
                    {group.items.map((item) => (
                      <WhatsNewCard
                        key={item.name}
                        item={item}
                        expanded={expanded.has(item.name)}
                        onToggle={() => toggle(item.name)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default WhatsNewPage;
