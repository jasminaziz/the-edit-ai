import * as React from "react";
import { useEffect, useMemo } from "react";
import { motion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface CounterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  start?: number;
  end: number;
  /** Animation duration in seconds (approx; spring physics will refine it). */
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

  // One spring drives all digit columns.
  const spring = useSpring(start, {
    mass: 1,
    stiffness: 90,
    damping: 22,
    duration: duration * 1000,
  });

  useEffect(() => {
    spring.set(end);
  }, [end, spring]);

  // Determine how many digit columns based on the largest of start/end.
  const places = useMemo(() => {
    const maxVal = Math.max(Math.abs(start), Math.abs(end), 1);
    const digits = Math.floor(Math.log10(maxVal)) + 1;
    // Build place values from highest to lowest: e.g. 247 → [100, 10, 1]
    return Array.from({ length: digits }, (_, i) => Math.pow(10, digits - 1 - i));
  }, [start, end]);

  return (
    <div
      {...rest}
      className={cn("flex leading-none font-heading font-bold", className)}
      style={{
        fontSize,
        height,
        ...rest.style,
      }}
    >
      {places.map((place) => (
        <Digit key={place} place={place} value={spring} height={height} />
      ))}
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
  // Floats so digit roll animates between integers.
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
    const placeValue = latest;
    let offset = (10 + number - placeValue) % 10;
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
