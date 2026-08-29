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
 *    after "Edit.", with the chevron centered beneath the label.
 *
 * Behaviour:
 *  - Hidden during the initial fall (~2s) so it doesn't compete with motion.
 *  - Fades in once pills have settled and stays visible until the user drags.
 *  - Respects prefers-reduced-motion (no bouncing).
 */
export function DragHint() {
  const isMobile = useIsMobile();
  const [visible, setVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const showTimer = window.setTimeout(() => setVisible(true), 2000);
    // Scrolling happens inside Layout's #app-scroll pane, not the window
    // (body scroll is locked to stop iOS Safari's fixed-header bounce bug).
    const scrollEl = document.getElementById("app-scroll");
    const onScroll = () => {
      const scrollTop = scrollEl ? scrollEl.scrollTop : window.scrollY;
      if (scrollTop > 8) {
        setHasScrolled(true);
        setVisible(false);
        window.clearTimeout(showTimer);
      }
    };

    const target: EventTarget = scrollEl ?? window;
    target.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(showTimer);
      target.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Desktop hint is temporarily hidden — only show on mobile.
  if (!isMobile || hasScrolled) return null;

  // The label and arrow stay centered as a pair on both mobile and desktop.
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
              // Period sits at ~76vw; place hint further right at ~97vw,
              // vertically aligned with the dot (~7.7vw from hero bottom).
              left: "clamp(720px, 97vw, 1460px)",
              bottom: "clamp(80px, 7.7vw, 130px)",
              transform: "translate(-50%, -50%)",
              flexDirection: "column",
              alignItems: "center",
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
          fontWeight: 600,
          fontSize: isMobile ? 10 : 12,
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
          width: arrowSize,
          height: arrowSize,
          // Down chevron (right + bottom borders, rotate 45deg).
          borderRight: "2px solid #C8F04A",
          borderBottom: "2px solid #C8F04A",
          transform: "rotate(45deg)",
          filter: "drop-shadow(0 0 6px rgba(200, 240, 74, 0.5))",
          marginRight: 0,
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
