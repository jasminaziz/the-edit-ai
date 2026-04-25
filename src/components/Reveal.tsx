import { motion, type Variants, type HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";

/**
 * Editorial-baseline reveal-on-scroll primitives.
 * Uses framer-motion `whileInView` so animations fire once when the element
 * enters the viewport. Calm, ~14px lift + fade-in.
 */

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

interface RevealProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  /** Delay in seconds before the reveal animation starts. */
  delay?: number;
  /** Distance in pixels the element lifts from. Defaults to 14. */
  y?: number;
  /** Override the once-only behaviour. Defaults to true. */
  once?: boolean;
}

/**
 * Wrap any block to fade + lift it in once when scrolled into view.
 */
export function Reveal({
  children,
  delay = 0,
  y = 14,
  once = true,
  ...rest
}: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

interface StaggerGridProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  /** Override the once-only behaviour. Defaults to true. */
  once?: boolean;
}

/**
 * Wrap a grid/list. Direct children must be <RevealItem> to participate
 * in the stagger sequence.
 */
export function StaggerGrid({
  children,
  once = true,
  ...rest
}: StaggerGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-60px" }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

interface RevealItemProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
}

/**
 * A single staggered item inside <StaggerGrid>.
 */
export function RevealItem({ children, ...rest }: RevealItemProps) {
  return (
    <motion.div
      variants={itemVariants}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
