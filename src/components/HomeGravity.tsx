import { Gravity, MatterBody } from "@/components/ui/gravity";
import { useIsMobile } from "@/hooks/use-mobile";
import { DragHint } from "@/components/DragHint";
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

// FNV-1a-ish hash so the same pill name always maps to the same numbers.
// This keeps colour/position assignments stable across renders but looks
// randomly mixed across pills (decorrelated from list order).
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
  if (h % 8 === 0) return ACCENT_COLOUR; // ~1 in 8 lime accent
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
    display: "inline-block",
  };
}

const MAX_PILLS = 18;

export function HomeGravity({ tools }: { tools: Tool[] }) {
  const isMobile = useIsMobile();
  const pills = tools
    .filter((t) => t.status === "in_stack")
    .map((t) => t.name)
    .slice(0, MAX_PILLS);

  if (pills.length === 0) return null;

  return (
    <div className="relative h-full w-full">
      <Gravity
        gravity={{ x: 0, y: 1 }}
        className="h-full w-full"
        autoStart
        grabCursor
        addTopWall={false}
        // Mobile browsers fire `resize` whenever the URL bar collapses/expands
        // on scroll. Keeping resetOnResize on causes the pills to re-drop every
        // time the user scrolls back up. Lock the simulation in place after the
        // initial fall — it only re-runs on a full page refresh.
        resetOnResize={false}
      >
      {pills.map((label, i) => {
        const h = hash(label);
        // Spread across the canvas width using the hash, not list order
        const xPct = 6 + (h % 86);
        // Spawn INSIDE the canvas near the top so pills always enter the simulation
        const yPct = 6 + ((h * 7) % 28);
        // Small angle jitter so they land at varied tilts
        const angle = (h % 30) - 15;
        // Vary density + restitution per pill — heavier ones sink first, lighter bounce longer
        const density = 0.0008 + ((h % 6) * 0.0001); // 0.0008 – 0.0013
        const restitution = 0.25 + ((h % 5) * 0.04); // 0.25 – 0.41
        return (
          <MatterBody
            key={`${label}-${i}`}
            x={`${xPct}%`}
            y={`${yPct}%`}
            angle={angle}
            matterBodyOptions={{
              friction: 0.35,
              restitution,
              density,
            }}
          >
            <span style={pillStyle(label, isMobile)}>{label}</span>
          </MatterBody>
        );
      })}
      </Gravity>
      <DragHint />
    </div>
  );
}
