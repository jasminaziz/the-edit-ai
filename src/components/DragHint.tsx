import { useEffect, useState } from "react";
import { Hand, MousePointer2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const SESSION_KEY = "homePillsDragHintSeen";

/**
 * Subtle affordance overlay for the homepage pill physics.
 *
 * Behaviour:
 *  - Hidden during the initial fall (~2.5s) so it doesn't compete with motion.
 *  - Fades in once pills have settled, auto-dismisses on a timer.
 *  - Dismisses immediately on first interaction with the gravity canvas.
 *  - Sets a sessionStorage flag so it never shows twice in the same session.
 *  - Respects prefers-reduced-motion (no bobbing, instant fade).
 */
export function DragHint() {
  const isMobile = useIsMobile();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Skip if user has already seen it this session
    if (typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY)) {
      setDismissed(true);
      return;
    }

    // Show after pills have settled
    const showTimer = window.setTimeout(() => setVisible(true), 2500);

    // Auto-dismiss after display window
    const dismissDelay = isMobile ? 5000 : 7000;
    const hideTimer = window.setTimeout(() => {
      setVisible(false);
      window.setTimeout(() => setDismissed(true), 400);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // ignore (private mode)
      }
    }, 2500 + dismissDelay);

    // Dismiss on first interaction anywhere on the gravity canvas
    const onInteract = () => {
      setVisible(false);
      window.setTimeout(() => setDismissed(true), 400);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // ignore
      }
    };
    window.addEventListener("pointerdown", onInteract, { once: true });

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
      window.removeEventListener("pointerdown", onInteract);
    };
  }, [isMobile]);

  if (dismissed) return null;

  const Icon = isMobile ? Hand : MousePointer2;
  const label = isMobile ? "Tap & drag" : "Drag me";

  // Mobile: centered above pills near the top. Desktop: top-right of canvas.
  const positionStyle: React.CSSProperties = isMobile
    ? {
        top: 12,
        left: "50%",
        transform: "translateX(-50%)",
      }
    : {
        top: 20,
        right: 24,
      };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-30"
      style={{
        ...positionStyle,
        opacity: visible ? 1 : 0,
        transition: "opacity 400ms ease-out",
      }}
    >
      <div
        className="drag-hint-chip flex items-center gap-2 rounded-full"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          color: "#2D35C9",
          padding: isMobile ? "6px 12px" : "8px 14px",
          fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
          fontWeight: 700,
          fontSize: isMobile ? 12 : 13,
          letterSpacing: "0.01em",
          boxShadow: "0 6px 20px rgba(45, 53, 201, 0.18)",
          border: "1.5px solid rgba(45, 53, 201, 0.15)",
        }}
      >
        <Icon size={isMobile ? 14 : 16} strokeWidth={2.5} />
        <span>{label}</span>
      </div>
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .drag-hint-chip {
            animation: dragHintBob 2.2s ease-in-out infinite;
          }
        }
        @keyframes dragHintBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
