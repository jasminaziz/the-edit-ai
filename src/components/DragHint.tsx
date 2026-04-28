import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Minimal "DRAG ME" affordance for the homepage pill physics.
 *
 * Style: tiny uppercase lime label + bouncing chevron arrow.
 *
 * Position:
 *  - Mobile: centered above where pills settle.
 *  - Desktop: tucked into the vacant space to the right of the period
 *    after "Edit.", with the chevron pointing diagonally down-and-left
 *    toward where the pills settle.
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
    const showTimer = window.setTimeout(() => setVisible(true), 2000);
    return () => {
      window.clearTimeout(showTimer);
    };
  }, []);

  // On desktop the arrow points down-and-left toward the pills, so the
  // label sits above-right of the arrow. On mobile it points straight down
  // and the label sits directly above it (centered).
  const arrowSize = isMobile ? 10 : 14;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-30 flex"
      style={{
        ...(isMobile
          ? {
              left: "50%",
              transform: "translateX(-50%)",
              bottom: "clamp(150px, 34vh, 190px)",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }
          : {
              // Vacant space to the right of the period after "Edit."
              // Period sits at ~76vw; place hint to the right at ~85vw,
              // vertically aligned with the dot (~7.7vw from hero bottom).
              left: "clamp(560px, 85vw, 1260px)",
              bottom: "clamp(80px, 7.7vw, 130px)",
              transform: "translate(-50%, -50%)",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 8,
            }),
        opacity: visible ? 1 : 0,
        transition: "opacity 500ms ease-out",
      }}
    >
      <span
        style={{
          color: "#C8F04A",
          fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
          fontWeight: 700,
          fontSize: isMobile ? 10 : 12,
          letterSpacing: 0,
          textTransform: "uppercase",
          textShadow: "0 1px 8px rgba(26, 21, 16, 0.35), 0 0 12px rgba(200, 240, 74, 0.25)",
        }}
      >
        Drag me
      </span>
      <div
        className={isMobile ? "drag-hint-arrow-down" : "drag-hint-arrow-down-left"}
        style={{
          width: arrowSize,
          height: arrowSize,
          // Mobile: down chevron (right + bottom borders, rotate 45deg).
          // Desktop: down-LEFT chevron (left + bottom borders, rotate -45deg).
          borderRight: isMobile ? "2px solid #C8F04A" : undefined,
          borderBottom: "2px solid #C8F04A",
          borderLeft: isMobile ? undefined : "2px solid #C8F04A",
          transform: isMobile ? "rotate(45deg)" : "rotate(-45deg)",
          filter: "drop-shadow(0 0 6px rgba(200, 240, 74, 0.5))",
          // Nudge the desktop arrow slightly inward from the label's right edge
          marginRight: isMobile ? 0 : 4,
        }}
      />
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .drag-hint-arrow-down {
            animation: dragHintBounceDown 1.4s ease-in-out infinite;
          }
          .drag-hint-arrow-down-left {
            animation: dragHintBounceDownLeft 1.4s ease-in-out infinite;
          }
        }
        @keyframes dragHintBounceDown {
          0%, 100% { transform: rotate(45deg) translate(0, 0); }
          50% { transform: rotate(45deg) translate(3px, 3px); }
        }
        @keyframes dragHintBounceDownLeft {
          0%, 100% { transform: rotate(-45deg) translate(0, 0); }
          /* In rotated space, "translate(3px, 3px)" moves down-and-left in screen space. */
          50% { transform: rotate(-45deg) translate(3px, 3px); }
        }
      `}</style>
    </div>
  );
}
