import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Site-wide scroll progress bar — lime pill that grows from the left.
 *
 * Sits just under the fixed nav. Lime against the dark/cobalt nav reads
 * cleanly, and against cream / lime page sections it's lifted off its track
 * by the dark wash beneath. Pill-shaped to match the brand.
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
      className="fixed left-0 right-0 z-[60] pointer-events-none px-3 sm:px-6"
      style={{
        top: "calc(var(--nav-height, 56px) + 6px)",
      }}
      aria-hidden="true"
    >
      <div
        className="relative mx-auto"
        style={{
          maxWidth: 1280,
          height: 6,
          backgroundColor: "rgba(26,21,16,0.18)",
          borderRadius: 9999,
          overflow: "hidden",
        }}
      >
        <motion.div
          style={{
            scaleX,
            transformOrigin: "0% 50%",
            height: "100%",
            width: "100%",
            backgroundColor: "#C8F04A",
            borderRadius: 9999,
            boxShadow: "0 0 8px rgba(200,240,74,0.55)",
          }}
        />
      </div>
    </div>
  );
}
