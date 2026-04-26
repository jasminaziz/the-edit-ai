## Audit: why the motion is broken right now

I traced the regression line by line. Two real bugs + two design gaps:

### Bugs
1. **Pills spawn ABOVE the canvas ceiling.** In `HomeGravity.tsx`, desktop pills use `yPct = -10 - ((i * 11) % 30)` — that's `-10%` to `-40%`. The `<Gravity>` component defaults `addTopWall = true`, which inserts a static wall at `y = -10px`. Bodies spawned at negative percentages are *above* that wall and get trapped/ejected from the simulation. Nothing falls into view.
2. **Mobile has no physics at all.** The current code returns a static `flex flex-wrap` for mobile — by design, but that contradicts your goal of "works across desktop and mobile" with impact and play.

### Design gaps vs. your goals
3. **Colors group predictably.** `PILL_COLOURS[i % 5]` cycles the palette in a fixed order, so pills appear in repeating rainbow stripes instead of a natural mix.
4. **No staggered entry.** All pills are mounted at once, so even when physics works they appear as a single dump rather than a playful cascade.

---

## The plan — a ground-up rebuild that satisfies every goal

### Goals (locked in from your brief)
- ✅ Works on **both** desktop and mobile
- ✅ **Has impact** — visible, central, part of the hero
- ✅ **Playful** — natural fall, mix of colors, draggable
- ✅ **Pulls from the stack** (filter `tools.status === 'in_stack'`)
- ✅ **Brand colors** — Cobalt, Forest, Indigo, Orange, Lime
- ✅ **Draggable + interactive** on every screen size
- ✅ **Mixed colors**, not grouped

---

### File: `src/components/HomeGravity.tsx` — full rewrite

**Color shuffling (deterministic mix, not grouping)**
- Replace the index-based color cycling with a deterministic shuffle seeded by the pill name. Each pill gets a color via a hash of its label so the same tool always gets the same color (stable across renders), but adjacent pills look randomly mixed.
- Lime stays rare (~1 in 8 pills) so it pops as an accent — matches your "Lime ONLY for accents" core rule from memory.

**Spawn positions (fix the ceiling bug for good)**
- Spawn pills INSIDE the canvas at `yPct = 5 + ((hash * 25) % 35)` → between 5% and 40% from the top. They fall under gravity and pile up at the bottom.
- Pass `addTopWall={false}` to `<Gravity>` so even if a body bounces upward it can leave the top instead of getting trapped — defensive against future tweaks.
- Distribute `xPct` across `5%` to `92%` using a hash, not a stride pattern — feels more natural.

**Physics tuning for natural cascade**
- Vary `density` (0.0007–0.0013) and `restitution` (0.25–0.45) per pill so they don't all fall identically — heavier pills sink faster, lighter ones bounce a touch more. This creates the "feathered" mix you want.
- Slight rotation jitter (`angle = -15° to +15°`) so they land at varied tilts.

**Staggered entry (the playful cascade)**
- Use a `useEffect` with `setInterval` to incrementally raise `visibleCount` from 0 → `pills.length`, one pill every ~80ms. Each new pill spawns at the top and falls — creates the "raining in" effect.
- Crucially: only mount the `<MatterBody>` for `i < visibleCount`. The previous attempt at this caused glitchiness because mobile + sticky positioning collapsed the canvas to 0 height. With the mobile fix below (fixed full-viewport canvas), staggering will work cleanly.

**Mobile gets real physics, not a static wrap**
- Single code path: same `<Gravity>` canvas on both. Differences are only:
  - **Pill size**: smaller font/padding on mobile (font 13px, padding 8px 14px) so more fit comfortably.
  - **Canvas height**: `h-[420px]` on mobile, `h-[480px]` on desktop.
  - **Touch dragging works** because `gravity.tsx` already removes the touch-blocking listeners and sets `touch-action: pan-y` (preserves vertical scroll, allows horizontal drag of pills).

---

### File: `src/pages/Index.tsx` — hero layout adjustment

**Single gravity layer for both breakpoints**
- Remove the `!isMobile` gate around `<HomeGravity>`. Always render it inside the hero, layered `z-20` over the headline (`z-10`) so pills can be dragged across "The Edit." text on every device.
- Keep the headlines as the visual anchor; pills are the playful overlay.

**Mobile hero needs height to contain the canvas**
- Current mobile hero is `min-h-[40vh]` — that's too short for a 420px gravity canvas + huge headlines. Bump to `min-h-[85vh]` on mobile so the canvas has real room and pills are clearly visible from the first paint.
- Desktop stays `100vh`.

**No `fixed inset-0` page-wide canvas this time** — that approach caused the glitchiness you saw. The canvas lives inside the hero section only, with explicit pixel height, so Matter.js measures it correctly on first render.

---

### Files to edit
- `src/components/HomeGravity.tsx` — full rewrite (color hash, positive spawn, staggered cascade, single mobile/desktop path, pill size variants)
- `src/pages/Index.tsx` — remove `!isMobile` gate on gravity; bump mobile hero `min-h` from `40vh` to `85vh`

### What you'll see after
- **Desktop**: pills cascade in (one every ~80ms) from near the top of the lilac hero, fall in mixed brand colors, pile up at the bottom, draggable across "The Edit." headline. Lime appears as a rare accent.
- **Mobile**: same cascade, scaled down. Touch-and-drag pills around the screen. Vertical page scrolling still works (touch listeners scoped correctly).
- **No grouping**: colors look randomly mixed because they're hashed off pill names, not cycled.
- **Stable**: pills don't disappear, get trapped above ceilings, or glitch on resize — canvas has explicit height inside the hero, no sticky/fixed wrappers.