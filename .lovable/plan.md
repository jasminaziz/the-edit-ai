## Goal
Fix two issues with the homepage gravity pills:
1. **Mobile**: Pills cover "The Edit" text — move pills behind the type, turn type white, and extend the fall zone all the way down to just above the footer.
2. **Desktop**: Pills currently drop as one synchronized bulk — stagger their spawn timing and vary their density/start heights for a feathered, organic cascade.

---

## Changes

### 1. `src/pages/Index.tsx` — Mobile layout restructure

**Hero section (mobile only)**:
- Swap z-index: pills layer becomes `z-10` (behind), typography becomes `z-20` (in front).
- Change `"The"` and `"Edit."` color from `#2D35C9` (cobalt) to `#FFFFFF` (white) so they read against the periwinkle background with pills behind them.
- Keep desktop behaviour identical: on `md+`, pills stay at `z-20` (in front, draggable across type) and type stays cobalt.
- Use Tailwind responsive classes (`md:`) to swap z-index and color, OR conditionally apply via `isMobile` (already imported).

**Mobile-only full-page gravity canvas**:
- Wrap the entire page in a relative container.
- Add a second `HomeGravity` instance positioned `absolute inset-0` covering hero + dashboard + CTA strip (everything except the footer), with `pointer-events-none` on its wrapper and a `z-0` so it sits behind all content.
- This second instance is **mobile-only** and uses a new variant (e.g. `variant="page"`) that renders a tall full-height canvas.
- The existing in-hero canvas is hidden on mobile when this page-wide one is active (to avoid double pills).
- Bottom wall of the gravity canvas becomes the natural settling line just above the footer.

### 2. `src/components/HomeGravity.tsx` — Add `page` variant + desktop stagger/density

**New `page` variant for mobile fall-through**:
- Add `"page"` to the `Variant` type union.
- When `variant === "page"` (mobile): render a `Gravity` canvas with `className="h-full w-full"` (parent provides height via absolute positioning), pills spread across the width with starting `y` positions clustered near the top so they fall the full distance.

**Desktop: stagger + vary density (applies to `hero` and `section` variants on desktop)**:
- **Stagger spawn**: Replace the current "all pills mounted immediately" approach with a state-driven reveal. Use a `useEffect` + `setTimeout` (or `useState` with an incrementing visible count) to mount pills one at a time with ~100ms delay between each. Only mounted pills are rendered as `MatterBody` children.
- **Vary density**: In the `matterBodyOptions`, replace fixed `density: 0.001` with a per-pill value derived from index, e.g. `density: 0.0008 + ((i * 37) % 10) * 0.00005` so each pill has a slightly different mass.
- **Vary start height**: Expand the current `yPct = (i * 7) % 12` (0–12% range) to `yPct = -((i * 11) % 40)` (negative values so pills spawn above the canvas at varied heights from -0% to -40%), giving each a different fall distance before hitting the floor or other pills.
- **Vary restitution slightly**: Add small per-pill variation `restitution: 0.3 + ((i * 13) % 5) * 0.02` for less uniform bouncing.

The stagger + density variation combine to produce a natural confetti-like settle rather than a synchronized drop.

### 3. Mobile-specific: hide the in-hero gravity instance
- In `Index.tsx`, the existing `<HomeGravity tools={tools} variant="hero" />` inside the hero is wrapped so it only renders on `md+` (desktop). On mobile, the page-wide canvas takes over.
- Alternatively: keep the hero instance but make it non-interactive/empty on mobile, and the new full-page canvas owns all pills. (Cleaner: just gate the hero instance behind `!isMobile`.)

---

## Files to edit
- `src/pages/Index.tsx`
- `src/components/HomeGravity.tsx`

## Out of scope
- No changes to footer, dashboard cards, or `Gravity`/`MatterBody` core component.
- No changes to pill colors, fonts, or sizing.

## Risks / notes
- The full-page mobile canvas uses physics across a tall area — performance should be fine (Matter.js handles a few dozen bodies easily) but worth a visual check on a real mobile viewport after implementation.
- Pills falling past the dashboard sections will visually overlap them; with `pointer-events-none` on the gravity wrapper, dashboard cards remain interactive. Pills will appear to drift behind/in front depending on z-index — plan is `z-0` for gravity layer, content sits at `z-10+` so pills stay behind dashboard content.
