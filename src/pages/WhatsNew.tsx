import { useEffect, useState } from "react";
import { fetchWhatsNew, type WhatsNew } from "@/lib/sheets";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorState, EmptyState } from "@/components/ErrorState";
import { CobaltZone } from "@/components/CobaltZone";
import { LeadCard, GridCard, monthYearKey, parseDate } from "@/components/WhatsNewCard";

function groupByMonth(items: WhatsNew[]): { month: string; items: WhatsNew[] }[] {
  const sorted = [...items].sort((a, b) => {
    const da = parseDate(a.date)?.getTime() || 0;
    const db = parseDate(b.date)?.getTime() || 0;
    return db - da;
  });

  const map = new Map<string, WhatsNew[]>();
  let mostRecentKey: string | null = null;
  const orphans: WhatsNew[] = [];

  for (const item of sorted) {
    const key = monthYearKey(item.date);
    if (key) {
      if (!mostRecentKey) mostRecentKey = key;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    } else {
      orphans.push(item);
    }
  }

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
    <div style={{ WebkitFontSmoothing: "antialiased" }}>
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
              {groups.map((group, gi) => {
                const [lead, ...rest] = group.items;
                return (
                  <div key={group.month} style={{ marginTop: gi === 0 ? 48 : 64 }}>
                    {/* Section header */}
                    <h2
                      className="font-heading"
                      style={{
                        fontWeight: 700,
                        fontSize: "clamp(28px, 3.5vw, 42px)",
                        color: "#2D35C9",
                        marginBottom: 24,
                        textWrap: "balance",
                      }}
                    >
                      {group.month}
                    </h2>

                    {/* Lead card */}
                    {lead && <LeadCard item={lead} />}

                    {/* Grid cards */}
                    {rest.length > 0 && (
                      <div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6"
                        style={{ gap: 24 }}
                      >
                        {rest.map((item) => (
                          <GridCard key={item.name} item={item} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default WhatsNewPage;
