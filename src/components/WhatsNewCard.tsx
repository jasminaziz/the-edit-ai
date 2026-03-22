import { type WhatsNew } from "@/lib/sheets";
import { RelevanceBadge } from "@/components/StatusBadge";

const CATEGORY_COLORS: Record<string, string> = {
  "Writing & Strategy": "#2D35C9",
  "Research & Knowledge": "#7B7FD4",
  "Design & Image": "#C8F04A",
  "Video & Audio": "#4A4A9A",
  "Automation & CRM": "#2D6A4F",
  "Claude & AI Skills": "#2D35C9",
};

const DEFAULT_COLOR = "#9A8F82";

function formatDate(raw: string): string {
  if (!raw) return "";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  const day = d.getDate().toString().padStart(2, "0");
  const month = d.toLocaleString("en-GB", { month: "short" });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

function getCategoryColor(category: string | undefined): string {
  if (!category) return DEFAULT_COLOR;
  return CATEGORY_COLORS[category] || DEFAULT_COLOR;
}

export function WhatsNewCard({
  item,
  expanded,
  onToggle,
}: {
  item: WhatsNew;
  expanded: boolean;
  onToggle: () => void;
}) {
  const fieldColor = getCategoryColor(item.status);

  return (
    <div
      className="rounded-xl overflow-hidden border border-border flex flex-col transition-all duration-200 ease-out hover:-translate-y-1"
      style={{
        boxShadow: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Zone A - Color field */}
      <div
        className="shrink-0"
        style={{ backgroundColor: fieldColor, height: 180 }}
      />

      {/* Zone B - Cobalt header band */}
      <div
        className="flex items-center justify-between px-4 shrink-0"
        style={{ backgroundColor: "#2D35C9", height: 36 }}
      >
        <span className="font-body text-[11px]" style={{ color: "rgba(250,248,244,0.7)" }}>
          {item.developer} · {formatDate(item.launched)}
        </span>
        <RelevanceBadge level={item.relevance_level} />
      </div>

      {/* Zone C - Card body */}
      <div className="bg-card p-5 flex flex-col flex-1" style={{ borderTop: "none" }}>
        <h3
          className="font-heading font-semibold leading-tight mb-2"
          style={{ fontSize: 16, color: "#1A1510" }}
        >
          {item.name}
        </h3>
        <p className="font-body text-sm leading-relaxed text-foreground line-clamp-3 mb-3">
          {item.what_it_is}
        </p>

        {item.status && (
          <span
            className="inline-block px-2 py-0.5 font-body text-[11px] rounded-full mb-3 self-start"
            style={{ backgroundColor: "#EEF0FB", color: "#2D35C9" }}
          >
            {item.status}
          </span>
        )}

        <button
          onClick={onToggle}
          className="block font-body font-medium text-[13px] text-primary hover:underline mt-auto"
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
