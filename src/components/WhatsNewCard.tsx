import { type WhatsNew } from "@/lib/sheets";
import { RelevanceBadge } from "@/components/StatusBadge";

function formatDate(raw: string): string {
  if (!raw) return "";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  const day = d.getDate().toString().padStart(2, "0");
  const month = d.toLocaleString("en-GB", { month: "short" });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

export function formatDateWithFallback(date: string, batch: string): string {
  if (date) {
    const parsed = new Date(date);
    if (!isNaN(parsed.getTime())) {
      return formatDate(date);
    }
  }
  // Fallback: try to extract month from batch
  if (batch) {
    const parsed = new Date(batch);
    if (!isNaN(parsed.getTime())) {
      return parsed.toLocaleString("en-GB", { month: "short", year: "numeric" });
    }
  }
  return "";
}

export function normaliseBatch(batch: string): string {
  if (!batch || !batch.trim()) {
    const now = new Date();
    return now.toLocaleString("en-GB", { month: "long", year: "numeric" });
  }
  // Try parsing as date
  const d = new Date(batch);
  if (!isNaN(d.getTime())) {
    return d.toLocaleString("en-GB", { month: "long", year: "numeric" });
  }
  // Already a readable string like "March 2026" — return as-is
  return batch.trim();
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
  const displayDate = formatDateWithFallback(item.launched, item.batch);

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col transition-all duration-200 ease-out hover:-translate-y-1"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E8E2D8",
        boxShadow: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Top band */}
      <div className="shrink-0 w-full" style={{ height: 8, backgroundColor: "#2D35C9" }} />

      {/* Card body */}
      <div className="p-6 flex flex-col flex-1">
        {displayDate && (
          <span className="font-body text-[13px] mb-2" style={{ color: "#9A8F82" }}>
            {displayDate}
          </span>
        )}

        <h3
          className="font-heading font-semibold leading-tight mb-2 line-clamp-2"
          style={{ fontSize: 24, color: "#1A1510", fontWeight: 700 }}
        >
          {item.name}
        </h3>

        <p
          className="font-body leading-relaxed line-clamp-3 mb-3"
          style={{ fontSize: 15, color: "rgba(26, 21, 16, 0.7)" }}
        >
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
          className="block font-body font-medium text-[14px] hover:underline mt-auto text-left"
          style={{ color: "#2D35C9" }}
        >
          {expanded ? "← Less" : "Read more →"}
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
