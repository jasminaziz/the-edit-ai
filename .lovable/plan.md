# Sticky Scroll Progress Bar

Add a thin cobalt indicator that sits **directly under the fixed nav** and fills left → right as the visitor scrolls down the page. Active on:

- `/my-stack`
- `/tools`
- `/design-kit`
- `/learning`
- `/whats-new`

Home (`/`) is intentionally excluded.

## Visual spec

- **Height:** 2px
- **Track:** transparent (no background) — keeps it minimal and editorial
- **Fill color:** cobalt `#2D35C9` (matches active nav state)
- **Position:** `fixed`, `top: 56px` (mobile, matches `h-14` nav) / `top: 64px` (desktop, matches `h-16` nav), full width, `z-40` (just under the nav at `z-50`)
- **Behavior:** width grows from 0% → 100% based on `scrollY / (documentHeight - viewportHeight)`
- **Smoothing:** `transition: width 80ms linear` so it feels responsive without lag
- **No animation on mount** — starts at whatever the current scroll position is

## Implementation

### 1. New component: `src/components/ScrollProgress.tsx`

- Listens to `window` scroll + resize via `requestAnimationFrame` throttling
- Computes progress as `scrollTop / (scrollHeight - clientHeight)`, clamped 0–1
- Renders a single fixed `div` with the cobalt fill
- Hides itself (returns `null`) if the page isn't scrollable (content fits viewport)
- Respects `prefers-reduced-motion` by removing the width transition

### 2. Mount in `src/components/Layout.tsx`

- Define an allow-list of pathnames where the bar should appear
- Render `<ScrollProgress />` conditionally just inside the layout root, so it sits above page content but below the nav z-index
- No changes to nav structure, hero, or page padding needed

## Out of scope (saved for later)

- Section reveal-on-scroll animations
- Hero `ContainerScroll` rotate/scale effect
- Parallax on hero headline
- Applying the progress bar to Home, Submit, or Subscribe

Once you approve, I'll add the component and wire it into the layout.