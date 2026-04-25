## Goal
Replace the static `tools.length` number in the "In the directory" dashboard card with an animated rolling-digit counter that ticks from 0 up to the final count once the Google Sheets fetch resolves.

## Scope
- **One location only:** `src/pages/Index.tsx`, the third dashboard column ("In the directory").
- Hero typography ("The / Edit.") is untouched.
- Other pages untouched.

## Files

### 1. New: `src/components/ui/animated-counter.tsx`
Reconstruct the component properly (the supplied snippet had stripped JSX). Implementation notes:
- Use **`framer-motion`** (standard package), not `motion/react`. Adds one dep: `framer-motion`. `clsx` and `tailwind-merge` already installed.
- Drop `"use client"` (Vite SPA, not Next).
- Use shared `cn` from `@/lib/utils` — no local redefinition.
- Fix the malformed `React.DetailedHTMLProps` type → use `React.HTMLAttributes<HTMLDivElement>`.
- Props: `start = 0`, `end: number`, `duration = 1.2` (seconds), `fontSize = 80`, `className?`.
- Re-trigger animation when `end` changes (so counter animates once Sheets data lands, not stuck at 0).
- Replace the `setInterval`-keyed-by-`value` pattern with a `useSpring` driving the digit columns directly — smoother, no wasted intervals.
- Render as many `<Digit>` columns as digits in `end` (no hardcoded ladder of `value >= 10`, `value >= 100`, etc.). Computed from `String(end).length`.
- Each `<Digit>` is a fixed-height window with a `<motion.span>` per 0–9 numeral; `useTransform` rolls them based on the spring value and digit place.

### 2. Edit: `src/pages/Index.tsx`
In the "In the directory" block (currently lines ~170–180):
- Keep the existing skeleton shimmer while `loading === true`.
- Once loaded, swap the static `<p>{tools.length}</p>` for `<Counter end={tools.length} fontSize={80} />`.
- Preserve the existing Chillax heading font, primary color (`text-primary`), and the "AI tools in the directory" subline.
- Use a fixed `fontSize={80}` on desktop, `fontSize={56}` on mobile (via a small `useIsMobile` check, already used elsewhere in the codebase). Fixed pixel sizing is required because the rolling-digit effect depends on a fixed row height for `translateY` math — `clamp()` won't work.

### 3. Edit: `package.json`
Add `framer-motion` (^11). One new dependency.

## Behavior
- On first paint: skeleton shimmer (existing behavior).
- When `fetchTools()` resolves: counter mounts with `end = tools.length`, springs from 0 to that value over ~1.2s.
- If `tools.length` ever changes (e.g. Sheets refetch), counter re-animates from current → new value smoothly via the spring.

## Flags / decisions for you to confirm
1. **Font size on mobile.** I'm planning fixed 56px mobile / 80px desktop. The current `clamp(56px, 8vw, 80px)` cannot survive the digit-roll math. OK to lose the fluid scaling on this one number?
2. **Animation duration.** 1.2s feels editorial — long enough to notice, short enough not to annoy. Adjust if you want snappier (0.8s) or slower (2s).
3. **Spring vs linear.** Spring gives a natural overshoot/settle. If you want a strict linear count-up (more "metric dashboard" feel), say so and I'll swap.
4. **Scope creep risk.** The component supports any number, so it could later be reused (e.g. subscriber count, # of items in your stack). Not building those now — just flagging the option.
5. **Bundle cost.** `framer-motion` is ~50KB gzipped. Acceptable for a single counter? If not, I can hand-roll the digit roll with CSS transforms + `requestAnimationFrame` and skip the dep entirely. Let me know.