import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Site-wide scroll progress bar. Sits below the fixed nav.
 *
 * Visibility-across-backgrounds approach:
 *  - Track row uses a faint dark wash (visible on cobalt, lilac, lime, cream).
 *  - Fill is cobalt (brand) with a lime accent edge so it remains legible
 *    when the underlying section is also cobalt — the lime separator gives it
 *    contrast against any background colour we use on the site.
 *  - 3px tall — present without being heavy.
 */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.4,
  });

  return (
    <div
      className="fixed left-0 right-0 z-[60] pointer-events-none"
      style={{
        top: "var(--nav-height, 56px)",
        height: 3,
        backgroundColor: "rgba(26,21,16,0.08)",
      }}
      aria-hidden="true"
    >
      <motion.div
        style={{
          scaleX,
          transformOrigin: "0% 50%",
          height: "100%",
          width: "100%",
          backgroundColor: "#2D35C9",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.35), 0 1px 0 0 #C8F04A",
        }}
      />
    </div>
  );
}
