import { useEffect, useState } from "react";
import { Gravity, MatterBody } from "@/components/ui/gravity";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Tool } from "@/lib/sheets";

// Brand palette. Lime is rare-only (used as accent), so we exclude it from the
// main rotation and only assign it to ~1 in 8 pills.
const CORE_COLOURS = [
  { bg: "#2D35C9", fg: "#FFFFFF" }, // Cobalt
  { bg: "#2D6A4F", fg: "#FFFFFF" }, // Forest
  { bg: "#4A4A9A", fg: "#FFFFFF" }, // Indigo
  { bg: "#E8572A", fg: "#FFFFFF" }, // Orange
];
const ACCENT_COLOUR = { bg: "#C8F04A", fg: "#1A1510" }; // Lime

// Simple deterministic hash so the same pill name always maps to the same
// numbers. This keeps colour/position assignments stable across renders but
// looks randomly mixed across pills.
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function colourFor(label: string) {
  const h = hash(label);
  // ~1 in 8 pills get the lime accent
  if (h % 8 === 0) return ACCENT_COLOUR;
  return CORE_COLOURS[h % CORE_COLOURS.length];
}

function pillStyle(label: string, isMobile: boolean): React.CSSProperties {
  const c = colourFor(label);
  return {
    backgroundColor: c.bg,
    color: c.fg,
    fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
    fontWeight: 600,
    fontSize: isMobile ? 13 : 15,
    padding: isMobile ? "8px 14px" : "10px 18px",
    borderRadius: 9999,
    whiteSpace: "nowrap",
    userSelect: "none",
    lineHeight: 1,
  };
}

function buildPills(tools: Tool[]): string[] {
  return tools.filter((t) => t.status === "in_stack").map((t) => t.name);
}

export function HomeGravity({ tools }: { tools: Tool[] }) {
  const isMobile = useIsMobile();
  const pills = buildPills(tools);

  // Staggered cascade — pills mount one at a time
  const [visibleCount, setVisibleCount] = useState(0);
  useEffect(() => {
    setVisibleCount(0);
    if (pills.length === 0) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setVisibleCount(i);
      if (i >= pills.length) window.clearInterval(id);
    }, 80);
    return () => window.clearInterval(id);
  }, [pills.length]);

  if (pills.length === 0) return null;

  const canvasHeight = isMobile ? "h-[420px]" : "h-[480px]";

  return (
    <Gravity
      gravity={{ x: 0, y: 1 }}
      className={`${canvasHeight} w-full`}
      autoStart
      grabCursor
      addTopWall={false}
    >
      {pills.slice(0, visibleCount).map((label, i) => {
        const h = hash(label);
        // Spread across the canvas width using the hash, not a stride
        const xPct = 5 + (h % 87);
        // Spawn INSIDE the canvas near the top so pills always enter the simulation
        const yPct = 5 + ((h * 7) % 35);
        // Small angle jitter so they land at varied tilts
        const angle = ((h * 13) % 30) - 15;
        // Vary density + restitution per pill — heavier ones sink, lighter bounce
        const density = 0.0007 + ((h % 7) * 0.0001); // 0.0007 – 0.0013
        const restitution = 0.25 + ((h % 5) * 0.05); // 0.25 – 0.45
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
            <span style={pillStyle(label, isMobile)}>{label}</span>
          </MatterBody>
        );
      })}
    </Gravity>
  );
}
