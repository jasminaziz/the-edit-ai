import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const STORAGE_KEY = "homePillsDragged";

/**
 * Minimal "DRAG ME" affordance for the homepage pill physics.
 *
 * Style: tiny uppercase lime label + bouncing chevron arrow above
 * (Game Boy-esque, no chip background — sits directly on the periwinkle hero).
 *
 * Position: anchored near the BOTTOM of the gravity canvas, just above where
 * pills settle, so it sits in clear space and is immediately visible without
 * competing with the giant headline typography.
 *
 * Behaviour:
 *  - Hidden during the initial fall (~2s) so it doesn't compete with motion.
 *  - Fades in once pills have settled and stays visible until the user drags.
 *  - Persists across page loads via localStorage flag — only disappears once
 *    the user has actually interacted with a pill.
 *  - Respects prefers-reduced-motion (no bouncing).
 */
export function DragHint() {
  const isMobile = useIsMobile();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Skip permanently if user has dragged a pill before
    try {
      if (localStorage.getItem(STORAGE_KEY)) {
        setDismissed(true);
        return;
      }
    } catch {
      // private mode — show anyway
    }

    // Show after pills have settled
    const showTimer = window.setTimeout(() => setVisible(true), 2000);

    // Dismiss on first interaction anywhere on the gravity canvas
    const onInteract = () => {
      setVisible(false);
      window.setTimeout(() => setDismissed(true), 400);
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // ignore
      }
    };
    window.addEventListener("pointerdown", onInteract, { once: true });

    return () => {
      window.clearTimeout(showTimer);
      window.removeEventListener("pointerdown", onInteract);
    };
  }, []);

  if (dismissed) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-30 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      style={{
        // Anchor near the bottom of the canvas, just above where pills settle
        bottom: isMobile ? 96 : 120,
        opacity: visible ? 1 : 0,
        transition: "opacity 500ms ease-out",
      }}
    >
      <div
        className="drag-hint-arrow-up"
        style={{
          width: isMobile ? 10 : 12,
          height: isMobile ? 10 : 12,
          borderTop: "2px solid #C8F04A",
          borderLeft: "2px solid #C8F04A",
          transform: "rotate(45deg)",
          filter: "drop-shadow(0 0 6px rgba(200, 240, 74, 0.5))",
        }}
      />
      <span
        style={{
          color: "#C8F04A",
          fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
          fontWeight: 700,
          fontSize: isMobile ? 10 : 11,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          textShadow: "0 1px 8px rgba(26, 21, 16, 0.35), 0 0 12px rgba(200, 240, 74, 0.25)",
        }}
      >
        Drag me
      </span>
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .drag-hint-arrow-up {
            animation: dragHintBounceUp 1.4s ease-in-out infinite;
          }
        }
        @keyframes dragHintBounceUp {
          0%, 100% { transform: rotate(45deg) translate(0, 0); }
          50% { transform: rotate(45deg) translate(-3px, -3px); }
        }
      `}</style>
    </div>
  );
}
