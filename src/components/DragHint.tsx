import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Minimal "DRAG ME" affordance for the homepage pill physics.
 *
 * Style: tiny uppercase lime label + bouncing chevron arrow below
 * (Game Boy-esque, no chip background — sits directly on the periwinkle hero).
 *
 * Position: anchored near the BOTTOM of the gravity canvas, just above where
 * pills settle, so it sits in clear space and is immediately visible without
 * competing with the giant headline typography.
 *
 * Behaviour:
 *  - Hidden during the initial fall (~2s) so it doesn't compete with motion.
 *  - Fades in once pills have settled and stays visible until the user drags.
 *  - Respects prefers-reduced-motion (no bouncing).
 */
export function DragHint() {
  const isMobile = useIsMobile();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show after pills have settled
    const showTimer = window.setTimeout(() => setVisible(true), 2000);

    return () => {
      window.clearTimeout(showTimer);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-30 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      style={{
        // Anchor near the bottom of the canvas, just above where pills settle
        bottom: isMobile ? "clamp(180px, 39vh, 230px)" : 120,
        opacity: visible ? 1 : 0,
        transition: "opacity 500ms ease-out",
      }}
    >
      <span
        style={{
          color: "#C8F04A",
          fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
          fontWeight: 700,
          fontSize: isMobile ? 10 : 11,
          letterSpacing: 0,
          textTransform: "uppercase",
          textShadow: "0 1px 8px rgba(26, 21, 16, 0.35), 0 0 12px rgba(200, 240, 74, 0.25)",
        }}
      >
        Drag me
      </span>
      <div
        className="drag-hint-arrow-down"
        style={{
          width: isMobile ? 10 : 12,
          height: isMobile ? 10 : 12,
          borderRight: "2px solid #C8F04A",
          borderBottom: "2px solid #C8F04A",
          transform: "rotate(45deg)",
          filter: "drop-shadow(0 0 6px rgba(200, 240, 74, 0.5))",
        }}
      />
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .drag-hint-arrow-down {
            animation: dragHintBounceDown 1.4s ease-in-out infinite;
          }
        }
        @keyframes dragHintBounceDown {
          0%, 100% { transform: rotate(45deg) translate(0, 0); }
          50% { transform: rotate(45deg) translate(3px, 3px); }
        }
      `}</style>
    </div>
  );
}
