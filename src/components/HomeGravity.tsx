import { Gravity, MatterBody } from "@/components/ui/gravity";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Tool } from "@/lib/sheets";

const PILL_COLOURS = [
  { bg: "#2D35C9", fg: "#FFFFFF" }, // Cobalt
  { bg: "#2D6A4F", fg: "#FFFFFF" }, // Forest
  { bg: "#4A4A9A", fg: "#FFFFFF" }, // Indigo
  { bg: "#E8572A", fg: "#FFFFFF" }, // Orange
  { bg: "#C8F04A", fg: "#1A1510" }, // Lime (dark text for contrast)
];

function buildPills(tools: Tool[]): string[] {
  return tools
    .filter((t) => t.status === "in_stack")
    .map((t) => t.name);
}

function pillStyle(index: number): React.CSSProperties {
  const c = PILL_COLOURS[index % PILL_COLOURS.length];
  return {
    backgroundColor: c.bg,
    color: c.fg,
    fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
    fontWeight: 600,
    fontSize: 15,
    padding: "10px 18px",
    borderRadius: 9999,
    whiteSpace: "nowrap",
    userSelect: "none",
    lineHeight: 1,
  };
}

type Variant = "section" | "hero";

export function HomeGravity({
  tools,
  variant = "section",
}: {
  tools: Tool[];
  variant?: Variant;
}) {
  const isMobile = useIsMobile();
  const pills = buildPills(tools);

  if (pills.length === 0) return null;

  // Standalone section variant on mobile: keep static flex-wrap (no fixed height parent)
  if (isMobile && variant === "section") {
    return (
      <div className="flex flex-wrap gap-2.5">
        {pills.map((label, i) => (
          <span key={`${label}-${i}`} style={pillStyle(i)}>
            {label}
          </span>
        ))}
      </div>
    );
  }

  // Physics canvas — desktop everywhere, and mobile in hero variant
  const className = variant === "hero" ? "h-full w-full" : "h-[480px] w-full";

  return (
    <Gravity gravity={{ x: 0, y: 1 }} className={className} autoStart grabCursor>
      {pills.map((label, i) => {
        const xPct = 12 + ((i * 17) % 76);
        const yPct = (i * 7) % 12;
        const angle = ((i * 53) % 30) - 15;
        return (
          <MatterBody
            key={`${label}-${i}`}
            x={`${xPct}%`}
            y={`${yPct}%`}
            angle={angle}
            matterBodyOptions={{
              friction: 0.4,
              restitution: 0.35,
              density: 0.001,
            }}
          >
            <span style={pillStyle(i)}>{label}</span>
          </MatterBody>
        );
      })}
    </Gravity>
  );
}
