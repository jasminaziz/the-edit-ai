import { Gravity, MatterBody } from "@/components/ui/gravity";
import type { Tool } from "@/lib/sheets";

const PILL_COLOURS = [
  { bg: "#2D35C9", fg: "#FFFFFF" }, // Cobalt
  { bg: "#2D6A4F", fg: "#FFFFFF" }, // Forest
  { bg: "#4A4A9A", fg: "#FFFFFF" }, // Indigo
  { bg: "#E8572A", fg: "#FFFFFF" }, // Orange
  { bg: "#C8F04A", fg: "#1A1510" }, // Lime
];

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
  const pills = tools
    .filter((t) => t.status === "in_stack")
    .map((t) => t.name);

  if (pills.length === 0) return null;

  return (
    <Gravity
      gravity={{ x: 0, y: 1 }}
      className="h-full w-full"
      autoStart
      grabCursor
    >
      {pills.map((label, i) => {
        const xPct = 8 + ((i * 17) % 84);
        const angle = ((i * 53) % 30) - 15;
        return (
          <MatterBody
            key={`${label}-${i}`}
            x={`${xPct}%`}
            y={20}
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
