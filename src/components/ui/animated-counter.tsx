import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface CounterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  start?: number;
  end: number;
  /** Animation duration in seconds. */
  duration?: number;
  /** Pixel font size. Required to be fixed because digit roll height depends on it. */
  fontSize?: number;
  className?: string;
}

const PADDING = 10;

export const Counter = ({
  start = 0,
  end,
  duration = 1.2,
  fontSize = 80,
  className,
  ...rest
}: CounterProps) => {
  const height = fontSize + PADDING;
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isSettled, setIsSettled] = useState(false);

  // Plain motion value — we drive it with `animate()` so it lands EXACTLY on `end`.
  const value = useMotionValue(start);

  // Trigger animation only when the counter is well into view (once).
  // rootMargin shrinks the viewport's bottom edge so the counter must scroll
  // close to the bottom before the observer fires.
  useEffect(() => {
    if (hasAnimated || !containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 1, rootMargin: "0px 0px -25% 0px" }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;
    setIsSettled(false);
    const controls = animate(value, end, {
      duration,
      ease: "easeOut", // strictly monotonic — no overshoot, no jump-back
      onComplete: () => {
        value.set(end);
        setIsSettled(true);
      },
    });
    return controls.stop;
  }, [hasAnimated, end, duration, value]);

  // Determine how many digit columns based on the largest of start/end.
  const places = useMemo(() => {
    const maxVal = Math.max(Math.abs(start), Math.abs(end), 1);
    const digits = Math.floor(Math.log10(maxVal)) + 1;
    return Array.from({ length: digits }, (_, i) => Math.pow(10, digits - 1 - i));
  }, [start, end]);

  return (
    <div
      {...rest}
      ref={containerRef}
      className={cn("flex leading-none font-heading font-bold", className)}
      style={{
        fontSize,
        height,
        ...rest.style,
      }}
    >
      {isSettled ? (
        // Static text once animation finishes — guarantees pixel-perfect alignment.
        <span className="tabular-nums" style={{ lineHeight: `${height}px` }}>
          {end}
        </span>
      ) : (
        places.map((place) => (
          <Digit key={place} place={place} value={value} height={height} />
        ))
      )}
    </div>
  );
};

function Digit({
  place,
  value,
  height,
}: {
  place: number;
  value: MotionValue<number>;
  height: number;
}) {
  const placeValue = useTransform(value, (v) => (v / place) % 10);

  return (
    <div
      style={{ height, width: "0.62em" }}
      className="relative tabular-nums overflow-hidden"
    >
      {Array.from({ length: 10 }, (_, i) => (
        <Numeral key={i} mv={placeValue} number={i} height={height} />
      ))}
    </div>
  );
}

function Numeral({
  mv,
  number,
  height,
}: {
  mv: MotionValue<number>;
  number: number;
  height: number;
}) {
  const y = useTransform(mv, (latest) => {
    let offset = (10 + number - latest) % 10;
    let memo = offset * height;
    if (offset > 5) memo -= 10 * height;
    return memo;
  });

  return (
    <motion.span
      style={{ y }}
      className="absolute inset-0 flex items-center justify-center"
    >
      {number}
    </motion.span>
  );
}
