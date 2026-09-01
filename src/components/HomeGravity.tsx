import { Gravity, MatterBody } from "@/components/ui/gravity";
import { useIsMobile } from "@/hooks/use-mobile";
import { DragHint } from "@/components/DragHint";

/**
 * Hero pill palette. Lime is rare-only, assigned to roughly 1 in 8 pills.
 *
 * REWRITTEN 1 Sep 2026, when the hero went back to #7B7FD4. Everything the
 * previous version of this block reasoned about was measured against the
 * lightened #9B9EDE, so it would have been a comment arguing with its own file.
 *
 * The hero is now DARKER than the palette work of 30 August assumed, and that
 * inverts the arithmetic. Fills that separated on #9B9EDE lose most of it:
 * cobalt 3.38 to 2.37, forest 2.54 to 1.77, red 2.82 to 1.97, and the orange
 * below 2.06 to 1.44. Light colours go the other way, so the lime accent
 * improves from 1.92 to 2.75.
 *
 * A 2px ink rim briefly carried that separation instead of the fill. It is
 * GONE, removed 1 Sep 2026 on Jasmin's ruling that it looked wrong, and it
 * should not come back without her.
 *
 * So separation is on the fill alone and is genuinely softer than it was on the
 * lighter hero. That is accepted rather than overlooked: the pills are
 * decorative draggable objects rather than text or controls, they separate on
 * hue against a lilac ground, and every LABEL still clears 4.5:1, which is the
 * part that carries meaning. The orange is the softest at 1.44:1 and is here on
 * Jasmin"s explicit approval.
 *
 * Orange #C2410C replaced Red #A8261C on Jasmin's ruling. She asked for a
 * brighter, warmer orange than the Red, which had been standing in for the
 * retired burnt orange #E8572A since 1 Sep. It is a NEW HEX, outside the
 * locked palette, and it is here on her explicit approval rather than by
 * precedent. Its white label is 5.18:1, which is the number that matters. Its
 * fill boundary against the hero is 1.44:1, the softest here, and it is on the
 * page because Jasmin approved the colour knowing that.
 *
 * Burnt orange #E8572A was reconsidered and still not revived. Its boundary is
 * no worse, at 1.43:1, but its white LABEL is 3.60:1, and a label is text: that
 * is a real AA failure rather than a soft edge, where #C2410C clears 4.5.
 *
 * Cobalt, forest and ink stay. Ink is much the strongest at 5.03:1 against the
 * hero, and it is already a ground in the footer.
 *
 * Note colourFor() indexes with `h % CORE_COLOURS.length`, so swapping a
 * colour reshuffles every pill rather than just the one. That is expected.
 *
 * Every label pairing here clears 4.5:1.
 */
const CORE_COLOURS = [
  { bg: "#2D35C9", fg: "#FFFFFF" }, // Cobalt, label 8.52:1, boundary 3.38:1
  { bg: "#2D6A4F", fg: "#FFFFFF" }, // Forest, label 6.39:1, boundary 2.54:1
  { bg: "#1A1510", fg: "#FFFFFF" }, // Ink,    label 18.12:1, boundary 7.20:1
  { bg: "#C2410C", fg: "#FFFFFF" }, // Orange, label 5.18:1, boundary 1.44:1
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
 * Mobile is capped because the hero is short, not because the count is high.
 * The pills fall to the floor and stack, so the pile height is what matters and
 * the space available is heroHeight (78vh) minus the wordmark.
 *
 * THE TABLE BELOW IS NOW A FLOOR, NOT A MEASUREMENT. It was taken when the
 * "The" clamp floored at 120px and the wordmark ended at 276px on every phone
 * width. That floor is 150px as of 1 Sep 2026, so the wordmark is roughly 25px
 * taller and every "room" figure here is about 25px generous. Re-measure with
 * the clock running before trusting it, rather than adjusting it on paper.
 *
 *   390x844  hero 658, room ~357
 *   360x780  hero 608, room ~307
 *   320x568  hero 443, room ~142   the binding case
 *
 * So only short phones are affected. Capping is legitimate here because the
 * pills are decoration rather than a claim, per the 25 Aug ruling below.
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
// Raised 12 to 16 on 1 Sep 2026, on Jasmin's ruling, to put back the crowding
// the merge took out: it was 18 on every device before the overhaul. 16 rather
// than 18 halves the worst case, where the table above shows a 320x568 phone
// has only 167px of room beneath the wordmark. Some pills will pile onto the
// type on the smallest phones again, and that overlap is the playful read
// rather than a defect.
const MAX_PILLS_MOBILE = 16;

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
