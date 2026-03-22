import { type WhatsNew } from "@/lib/sheets";

function formatDate(raw: string): string {
  if (!raw) return "";
  const d = parseDate(raw);
  if (!d) return raw;
  const day = d.getDate().toString().padStart(2, "0");
  const month = d.toLocaleString("en-GB", { month: "short" });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

/** Parse a date string, handling range formats like "Feb 17–18, 2026" */
export function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  // Try direct parse first
  let d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d;
  // Handle range formats: take everything before en-dash/hyphen + keep year
  const cleaned = dateStr.replace(/[–—-]\s*\d+/, "");
  d = new Date(cleaned);
  if (!isNaN(d.getTime())) return d;
  return null;
}

/** Extract MMMM YYYY from a date string for grouping */
export function monthYearKey(dateStr: string): string | null {
  const d = parseDate(dateStr);
  if (!d) return null;
  return d.toLocaleString("en-GB", { month: "long", year: "numeric" });
}

export function WhatsNewCard({ item }: { item: WhatsNew }) {
  const displayDate = formatDate(item.launched);

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
      <div className="shrink-0 w-full" style={{ height: 8, backgroundColor: "#C8F04A" }} />

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
          className="font-body leading-relaxed mb-3"
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

        <a
          href={item.url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-body font-medium text-[13px] mt-auto self-start transition-colors duration-200 ease-out"
          style={{
            backgroundColor: "#C8F04A",
            color: "#1A1510",
            borderRadius: 20,
            padding: "12px 20px",
            border: "none",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#2D35C9";
            e.currentTarget.style.color = "#FFFFFF";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#C8F04A";
            e.currentTarget.style.color = "#1A1510";
          }}
        >
          Read more →
        </a>
      </div>
    </div>
  );
}
