## Why pills aren't falling

Two regressions from the recent "stagger + cascade" pass:

### 1. Pills spawn ABOVE the top wall (desktop + mobile)
In `HomeGravity.tsx`, pills now spawn at negative y (`yPct = -4 to -44%`) so they could "cascade in from above." But `Gravity` defaults to `addTopWall = true`, which inserts a static wall at `y = -10px`. Bodies spawned at `y = -30px` (or further negative) are *above* that wall and get trapped/pushed out of the canvas — so nothing visible falls.

### 2. Mobile `sticky` inside `absolute` produces a 0-height canvas
On mobile, `Index.tsx` wraps the gravity layer in:
```
<div className="absolute inset-0 z-0 pointer-events-none">
  <div className="sticky top-0 h-screen w-full pointer-events-auto">
    <HomeGravity variant="page" />
```
`sticky` needs a normal-flow scroll ancestor — it doesn't behave correctly inside an `absolute` parent. The inner div ends up with no laid-out height in many browsers, and `Gravity` reads `offsetHeight = 0`, so spawn coords collapse to ~0 and walls overlap. Pills exist in the engine but never render visibly.

---

## The fix

### `src/components/HomeGravity.tsx`
- **Spawn pills INSIDE the canvas, near the top:** change `yPct` from negative to a small positive range, e.g. `yPct = 4 + ((i * 11) % 30)` (spawns between 4% and ~33% from the top). They still cascade because the stagger timer is unchanged, and they fall under gravity to the bottom.
- **Pass `addTopWall={false}` to `<Gravity>`** so even tiny upward bounces from spawning never escape — and so future tweaks to spawn position can't re-trigger this bug.
- Keep the existing density/restitution variation (already gives the feathered feel once they actually fall).

### `src/pages/Index.tsx` (mobile only)
Replace the `absolute inset-0` + inner `sticky` wrapper with a `fixed inset-0` layer that is reliably full-viewport:
```tsx
{isMobile && !loading && (
  <div
    className="fixed inset-0 z-0 pointer-events-none"
    aria-hidden="true"
  >
    <div className="absolute inset-0 pointer-events-auto">
      <HomeGravity tools={tools} variant="page" />
    </div>
  </div>
)}
```
- `fixed inset-0` guarantees a full-viewport canvas with real height, so Matter.js measures it correctly.
- The hero already sits at `z-30` (mobile type) over this `z-0` layer, so the headline still reads on top.
- Pills will fall and settle at the bottom of the viewport (just above the footer-of-viewport area), matching the intent of the "page" variant.

No changes to `src/components/ui/gravity.tsx` itself.

---

## Files to edit
- `src/components/HomeGravity.tsx` — flip `yPct` to positive, add `addTopWall={false}` on `<Gravity>`.
- `src/pages/Index.tsx` — swap mobile `absolute + sticky` wrapper for `fixed inset-0`.

## What you'll see after
- **Desktop hero:** pills cascade in (one every ~110ms) from near the top of the cobalt hero and pile up at the bottom, draggable across "The Edit." text.
- **Mobile:** pills cascade behind the white "The Edit." headline and settle at the bottom of the viewport.
