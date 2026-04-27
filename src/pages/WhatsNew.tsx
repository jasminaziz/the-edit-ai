import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { fetchWhatsNew, type WhatsNew } from "@/lib/sheets";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorState, EmptyState } from "@/components/ErrorState";
import { CobaltZone } from "@/components/CobaltZone";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
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

/** A collapsible month section. The most recent month opens by default. */
function MonthSection({
  group,
  defaultOpen,
  isFirst,
}: {
  group: { month: string; items: WhatsNew[] };
  defaultOpen: boolean;
  isFirst: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [lead, ...rest] = group.items;
  const count = group.items.length;

  return (
    <div style={{ marginTop: isFirst ? 48 : 32 }}>
      {/* Collapsible header — the whole row is clickable */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 group"
        style={{
          background: "transparent",
          border: "none",
          borderBottom: "1px solid #E8E2D8",
          padding: "12px 0",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div className="flex items-baseline gap-3 flex-wrap">
          <h2
            className="font-heading"
            style={{
              fontWeight: 700,
              fontSize: "clamp(24px, 3vw, 38px)",
              color: "#2D35C9",
              textWrap: "balance",
              margin: 0,
            }}
          >
            {group.month}
          </h2>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: "0.08em",
              color: "#9A8F82",
              textTransform: "uppercase",
            }}
          >
            {count} {count === 1 ? "update" : "updates"}
          </span>
        </div>
        <ChevronDown
          className="shrink-0 transition-transform duration-200"
          style={{
            color: "#2D35C9",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
          size={24}
          strokeWidth={2.5}
        />
      </button>

      {/* Content */}
      {open && (
        <div style={{ marginTop: 24 }}>
          {lead && <LeadCard item={lead} />}
          {rest.length > 0 && (
            <RevealGroup
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6"
              style={{ gap: 24 }}
            >
              {rest.map((item) => (
                <RevealItem key={item.name}>
                  <GridCard item={item} />
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </div>
      )}
    </div>
  );
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
        twoLineHeading={{ line1: "What's New", line2: "in AI", inline: true }}
        subheading="Model updates, releases, and AI gossip."
        rightBadge={{ text: "Source: The Rundown.ai", url: "https://www.therundown.ai" }}
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
            <Reveal>
              <div>
                {groups.map((group, gi) => (
                  <MonthSection
                    key={group.month}
                    group={group}
                    defaultOpen={gi === 0}
                    isFirst={gi === 0}
                  />
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </div>
  );
};

export default WhatsNewPage;
