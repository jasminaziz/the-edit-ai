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

export function HomeGravity({ tools }: { tools: Tool[] }) {
  const isMobile = useIsMobile();
  const pills = buildPills(tools);

  if (pills.length === 0) return null;

  // On mobile, render as a static flex-wrap (no physics).
  if (isMobile) {
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

  // Desktop: physics canvas inside the hero.
  return (
    <Gravity gravity={{ x: 0, y: 1 }} className="h-[480px] w-full" autoStart grabCursor>
      {pills.map((label, i) => {
        const xPct = 8 + ((i * 17) % 84);
        const yPct = -10 - ((i * 11) % 30);
        const angle = ((i * 53) % 30) - 15;
        const density = 0.0008 + ((i * 37) % 10) * 0.00005;
        const restitution = 0.3 + ((i * 13) % 5) * 0.02;
        return (
          <MatterBody
            key={`${label}-${i}`}
            x={`${xPct}%`}
            y={`${yPct}%`}
            angle={angle}
            matterBodyOptions={{
              friction: 0.4,
              restitution,
              density,
            }}
          >
            <span style={pillStyle(i)}>{label}</span>
          </MatterBody>
        );
      })}
    </Gravity>
  );
}
