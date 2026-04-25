import { Gravity, MatterBody } from "@/components/ui/gravity";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Tool } from "@/lib/sheets";

const PILL_COLOURS = [
  "#2D35C9", // Cobalt
  "#2D6A4F", // Forest
  "#4A4A9A", // Indigo
  "#E8572A", // Orange
];

const BRAND_WORDS = [
  "Honest",
  "Curated",
  "Opinionated",
  "No hot takes",
  "No doom loops",
];

function buildPills(tools: Tool[]): string[] {
  const stackNames = tools
    .filter((t) => t.status === "in_stack")
    .slice(0, 6)
    .map((t) => t.name);
  return [...stackNames, ...BRAND_WORDS];
}

function pillStyle(index: number): React.CSSProperties {
  return {
    backgroundColor: PILL_COLOURS[index % PILL_COLOURS.length],
    color: "#FFFFFF",
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

  // Mobile: static flex-wrap, no physics mounted
  if (isMobile) {
    if (variant === "hero") {
      return (
        <div className="absolute inset-x-0 bottom-6 px-4 flex flex-wrap gap-2 justify-center pointer-events-auto">
          {pills.map((label, i) => (
            <span key={`${label}-${i}`} style={pillStyle(i)}>
              {label}
            </span>
          ))}
        </div>
      );
    }
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

  // Desktop: physics canvas
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
