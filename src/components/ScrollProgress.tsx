import { useEffect, useState } from "react";

/**
 * Thin cobalt indicator that sits directly under the fixed nav and fills
 * left → right as the visitor scrolls. Hides itself when the page isn't
 * scrollable. Honours prefers-reduced-motion.
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [scrollable, setScrollable] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduceMotion(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    let frame = 0;

    const compute = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      if (max <= 0) {
        setScrollable(false);
        setProgress(0);
        return;
      }
      setScrollable(true);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      setProgress(p);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (!scrollable) return null;

  return (
    <div
      aria-hidden
      className="fixed left-0 right-0 z-40 pointer-events-none top-14 sm:top-16"
      style={{ height: 2 }}
    >
      <div
        style={{
          width: `${progress * 100}%`,
          height: "100%",
          backgroundColor: "#2D35C9",
          transition: reduceMotion ? "none" : "width 80ms linear",
        }}
      />
    </div>
  );
}
