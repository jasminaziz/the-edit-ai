import { useEffect, useState } from "react";
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

type Variant = "section" | "hero" | "page";

export function HomeGravity({
  tools,
  variant = "section",
}: {
  tools: Tool[];
  variant?: Variant;
}) {
  const isMobile = useIsMobile();
  const pills = buildPills(tools);

  // Stagger reveal — pills mount one at a time for a feathered cascade
  const [visibleCount, setVisibleCount] = useState(0);
  useEffect(() => {
    setVisibleCount(0);
    if (pills.length === 0) return;
    let i = 0;
    const tick = () => {
      i += 1;
      setVisibleCount(i);
      if (i < pills.length) {
        timer = window.setTimeout(tick, 110);
      }
    };
    let timer = window.setTimeout(tick, 80);
    return () => window.clearTimeout(timer);
  }, [pills.length]);

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

  // Physics canvas — desktop everywhere, and mobile in hero/page variants
  const className =
    variant === "hero" || variant === "page"
      ? "h-full w-full"
      : "h-[480px] w-full";

  return (
    <Gravity gravity={{ x: 0, y: 1 }} className={className} autoStart grabCursor addTopWall={false}>
      {pills.slice(0, visibleCount).map((label, i) => {
        const xPct = 8 + ((i * 17) % 84);
        // Spawn just inside the top of the canvas at varied heights so they cascade down
        const yPct = 4 + ((i * 11) % 30);
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
