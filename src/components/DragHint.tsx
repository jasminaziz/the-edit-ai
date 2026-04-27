import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const STORAGE_KEY = "homePillsDragged";

/**
 * Minimal "DRAG ME" affordance for the homepage pill physics.
 *
 * Style: tiny uppercase lime label + bouncing chevron arrow below
 * (Game Boy-esque, no chip background — sits directly on the periwinkle hero).
 *
 * Behaviour:
 *  - Hidden during the initial fall (~2.5s) so it doesn't compete with motion.
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
    const showTimer = window.setTimeout(() => setVisible(true), 2500);

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
      className="pointer-events-none absolute z-30 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      style={{
        top: isMobile ? 16 : 24,
        opacity: visible ? 1 : 0,
        transition: "opacity 500ms ease-out",
      }}
    >
      <span
        style={{
          color: "#C8F04A",
          fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
          fontWeight: 700,
          fontSize: isMobile ? 9 : 10,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          textShadow: "0 1px 6px rgba(26, 21, 16, 0.25)",
        }}
      >
        Drag me
      </span>
      <div
        className="drag-hint-arrow"
        style={{
          width: isMobile ? 9 : 10,
          height: isMobile ? 9 : 10,
          borderBottom: "2px solid #C8F04A",
          borderRight: "2px solid #C8F04A",
          transform: "rotate(45deg)",
          filter: "drop-shadow(1px 1px 4px rgba(200, 240, 74, 0.35))",
        }}
      />
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .drag-hint-arrow {
            animation: dragHintBounce 1.4s ease-in-out infinite;
          }
        }
        @keyframes dragHintBounce {
          0%, 100% { transform: rotate(45deg) translate(0, 0); }
          50% { transform: rotate(45deg) translate(3px, 3px); }
        }
      `}</style>
    </div>
  );
}
