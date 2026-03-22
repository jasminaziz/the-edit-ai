import { useEffect, useState } from "react";
import { fetchWhatsNew, type WhatsNew } from "@/lib/sheets";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorState, EmptyState } from "@/components/ErrorState";
import { CobaltZone } from "@/components/CobaltZone";
import { WhatsNewCard, monthYearKey, parseDate } from "@/components/WhatsNewCard";

function groupByMonth(items: WhatsNew[]): { month: string; items: WhatsNew[] }[] {
  // Sort all items newest first, unparseable dates last
  const sorted = [...items].sort((a, b) => {
    const da = parseDate(a.launched)?.getTime() || 0;
    const db = parseDate(b.launched)?.getTime() || 0;
    return db - da;
  });

  const map = new Map<string, WhatsNew[]>();
  let mostRecentKey: string | null = null;
  const orphans: WhatsNew[] = [];

  for (const item of sorted) {
    const key = monthYearKey(item.launched);
    if (key) {
      if (!mostRecentKey) mostRecentKey = key;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    } else {
      orphans.push(item);
    }
  }

  // Assign orphans to most recent valid group
  if (orphans.length > 0 && mostRecentKey && map.has(mostRecentKey)) {
    map.get(mostRecentKey)!.push(...orphans);
  }

  return Array.from(map.entries()).map(([month, items]) => ({ month, items }));
}

const WhatsNewPage = () => {
  const [items, setItems] = useState<WhatsNew[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchWhatsNew().then((n) => {
      if (n.length === 0 && import.meta.env.VITE_GOOGLE_SHEETS_ID) setError(true);
      setItems(n);
      setLoading(false);
    });
  }, []);

  const groups = groupByMonth(items);

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
                <div key={group.month} style={{ marginTop: gi === 0 ? 48 : 64 }}>
                  <h2
                    className="font-heading"
                    style={{ fontWeight: 700, fontSize: 32, color: "#2D35C9" }}
                  >
                    {group.month}
                  </h2>
                  <hr className="mt-2 mb-6" style={{ borderColor: "#E8E2D8" }} />

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ alignItems: "stretch" }}>
                    {group.items.map((item) => (
                      <WhatsNewCard key={item.name} item={item} />
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
