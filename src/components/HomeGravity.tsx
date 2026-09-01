import { Gravity, MatterBody } from "@/components/ui/gravity";
import { useIsMobile } from "@/hooks/use-mobile";
import { DragHint } from "@/components/DragHint";

/**
 * Hero pill palette. Lime is rare-only, assigned to roughly 1 in 8 pills.
 *
 * Ruled 30 Aug 2026, the last of the off-palette cleanup. Two colours left the
 * rotation and one locked colour joined it.
 *
 * Burnt orange #E8572A went for two independent reasons. Its label was white
 * at 3.60:1, a real AA text failure rather than a decorative one, and against
 * the lightened hero #9B9EDE it measures 1.43:1, so it was close to
 * luminance-matched with the ground and separated from it by hue alone.
 *
 * Indigo #4A4A9A went because it was off palette and undocumented. It was not
 * a defect: 7.67:1 label, 3.05:1 boundary. It simply was not a colour this
 * site owns.
 *
 * Ink joined because it is the strongest option available and it is locked:
 * white on it is 18.12:1 and it sits at 7.20:1 against the hero. Ink is already
 * used as a ground in the footer, so this is not a new role for it.
 *
 * Forest stays. Its boundary against the lighter hero is 2.54:1, which is soft,
 * but the pills are decorative draggable objects rather than text or controls,
 * its own label passes at 6.39:1, and green against lilac separates on hue with
 * room to spare. Same reasoning for the lime accent at 1.92:1.
 *
 * Red #A8261C joined on 1 Sep 2026, on Jasmin's ruling, restoring some of the
 * warmth burnt orange used to carry. It is a locked hex rather than a new one:
 * it is the Red DPIA ink and the "Judged, not recommended" badge. That reuse is
 * deliberate and has precedent, since forest green already serves as the In My
 * Stack badge, the Green DPIA chip, a DesignKit cost badge and a pill.
 *
 * It was chosen over reviving burnt orange because the two converge. The hero
 * is light enough that any warm colour clearing the 2.54:1 boundary floor has
 * to be dark, and #E8572A's own hue only clears it at about 36% lightness,
 * which lands on #A63512 and reads almost identically to this. Given the
 * choice between a near-identical new hex and a locked one, the locked one
 * wins.
 *
 * Boundary against the hero 2.82:1, above Forest's accepted 2.54:1. White label
 * 7.10:1. Both measured, not assumed.
 *
 * Note this changes every pill's colour, not just the new one: colourFor()
 * indexes with `h % CORE_COLOURS.length`, so going from three to four
 * reshuffles the whole rotation. That is expected.
 *
 * Every label pairing here now clears 4.5:1.
 */
const CORE_COLOURS = [
  { bg: "#2D35C9", fg: "#FFFFFF" }, // Cobalt, label 8.52:1, boundary 3.38:1
  { bg: "#2D6A4F", fg: "#FFFFFF" }, // Forest, label 6.39:1, boundary 2.54:1
  { bg: "#1A1510", fg: "#FFFFFF" }, // Ink,    label 18.12:1, boundary 7.20:1
  { bg: "#A8261C", fg: "#FFFFFF" }, // Red,    label 7.10:1, boundary 2.82:1
];
const ACCENT_COLOUR = { bg: "#C8F04A", fg: "#1A1510" }; // Lime, label 13.83:1

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

/**
 * Pill caps, split by breakpoint 1 Sep 2026. One constant could not serve both.
 *
 * Desktop 30, up from 18. my_stack holds 19 rows, so 18 truncated exactly one
 * real pill; 30 is headroom for the stack to grow, not a target to fill. All 19
 * settle in the bottom 160px of a 900px hero at 1440x900 with the wordmark
 * completely clear.
 *
 * Mobile 12, because the hero is short, not because the count is high. The
 * pills fall to the floor and stack, so the pile height is what matters and the
 * space available is heroHeight (78vh) minus the wordmark, which ends at 276px
 * on every phone width (the clamp floors at 120px below 428px wide).
 *
 *   390x844  hero 658, room 382  19 pills fit with room to spare
 *   360x780  hero 608, room 332  19 pills fit, 0 overlapping
 *   320x568  hero 443, room 167  19 pills overflow, 8 overlap the wordmark
 *
 * So only short phones are affected, and 12 is the count whose pile fits the
 * worst case: at 320x568 it drops overlaps from 8 to 1 and leaves "The Edit."
 * fully readable. Capping is legitimate here because the pills are decoration
 * rather than a claim, per the 25 Aug ruling below.
 *
 * MEASURE THIS WITH THE CLOCK RUNNING. matter-js advances on
 * requestAnimationFrame, so in a hidden tab or a headless pane no frames run,
 * every pill sits at its spawn point (6-34% of hero height, i.e. across the
 * wordmark) and nothing moves. That reads exactly like a settled pile jammed on
 * top of the type, and it is not: it is a frozen simulation. The 1 Sep brief's
 * mobile figures were taken that way and describe spawn positions, not resting
 * ones. Pump rAF manually before believing any measurement here.
 */
const MAX_PILLS_DESKTOP = 30;
const MAX_PILLS_MOBILE = 12;

/**
 * The falling pills are decoration, not a claim. Jasmin's ruling, 2026-08-25.
 *
 * They take plain names rather than any data shape, because the component has
 * no business knowing what a Tool is. Index.tsx sources them from the `my_stack`
 * tab, which is a personal claim by definition, so the pills can never
 * contradict the directory counter beneath them. They previously filtered the
 * `tools` array on status === "in_stack", which meant the hero drifted every
 * time the triage changed and could name tools the directory refuses to show.
 */
export function HomeGravity({ names }: { names: string[] }) {
  const isMobile = useIsMobile();
  const pills = names.slice(0, isMobile ? MAX_PILLS_MOBILE : MAX_PILLS_DESKTOP);

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
