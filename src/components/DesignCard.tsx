import type { DesignKitItem } from "@/lib/sheets";

const COST_STYLES: Record<string, { bg: string; text: string }> = {
  free: { bg: "#2D6A4F", text: "#ffffff" },
  freemium: { bg: "#9B7B3A", text: "#ffffff" },
  paid: { bg: "#6B7280", text: "#ffffff" },
};

function costStyle(cost: string) {
  const key = cost.toLowerCase().trim();
  return COST_STYLES[key] || COST_STYLES.paid;
}

export function DesignCard({ item }: { item: DesignKitItem }) {
  const style = costStyle(item.cost);

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-xl overflow-hidden border border-border bg-card flex flex-col hover:translate-x-1.5 transition-all duration-200 no-underline"
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
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-heading font-semibold text-base leading-tight text-foreground">
            {item.name}
          </h3>
          <span
            className="shrink-0 px-2 py-0.5 rounded-full font-body text-[11px] font-medium"
            style={{ backgroundColor: style.bg, color: style.text }}
          >
            {item.cost}
          </span>
        </div>

        {item.category && (
          <span
            className="inline-block self-start px-2 py-0.5 rounded-full font-body text-[11px] mb-3"
            style={{ backgroundColor: "hsl(var(--category-badge))", color: "hsl(var(--primary))" }}
          >
            {item.category}
          </span>
        )}

        <p className="font-body text-sm leading-relaxed text-foreground mb-3">
          {item.what_it_does}
        </p>

        {item.when_to_use && (
          <p className="font-body text-xs text-muted-foreground mb-3">
            <strong>When to use:</strong> {item.when_to_use}
          </p>
        )}

        {item.verdict && (
          <div className="mt-auto bg-background rounded-lg p-3 font-body text-sm italic text-foreground/80">
            {item.verdict}
          </div>
        )}
      </div>

      <div
        className="px-5 py-3 font-body text-[13px] font-medium"
        style={{ backgroundColor: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
      >
        Open →
      </div>
    </a>
  );
}
