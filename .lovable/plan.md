## Goal — back to the original prompt

The reference demo (`gravity.tsx` + `demo.tsx`) is a single physics canvas with pills laid out as children. Each pill is given a unique `x="X%"` and `y="Y%"` spawn coordinate, all mount at once, and the **natural cascade emerges from the physics engine**, not from JS staggering. Pills are draggable via the Matter.js `MouseConstraint` already wired into the canvas.

I drifted from that pattern in two ways that have caused the recent glitchiness:
1. **Staggered `setInterval` mounting** — pills get added after the engine is running, which competes with the resize-debounce/reset cycle and produces flicker, dropped bodies, and the "nothing falls" state.
2. **Spawning at `y` values too close to the canvas top** — combined with `addTopWall={true}` defaults and tight hero heights on mobile, bodies clip walls and pop out of the simulation.

The plan below returns to the demo's pattern and layers in your three explicit requirements: mixed brand colours, real data from the stack, true mobile responsiveness.

---

## 1. Rewrite `src/components/HomeGravity.tsx` faithful to the demo

**Mount model — match the demo exactly:**
- Remove all `visibleCount` / `setInterval` staggering. All pills mount on first render once `tools` is loaded.
- The "cascade" feel comes from spawning pills at varied `x%` across the width and varied `y%` near the top — physics does the rest. This is the pattern the original demo uses and the only one the engine handles cleanly.

**Physics container:**
- One `<Gravity gravity={{x:0, y:1}} addTopWall={false} grabCursor autoStart>` wrapping all pills.
- `addTopWall={false}` so spawn points slightly above the canvas (if any) don't trap bodies — but we'll spawn inside anyway.
- `resetOnResize` left at default `true` so rotation/landscape works.

**Data — pull from the stack:**
- Input: `tools: Tool[]` (already passed in).
- Filter to `status === "in_stack"` (these are the things you actually run). Cap at ~18 pills so the canvas doesn't get crowded on mobile.

**Mixed brand colours (deterministic, never grouped):**
- Core rotation: Cobalt `#2D35C9`, Forest `#2D6A4F`, Indigo `#4A4A9A`, Orange `#E8572A` — all with white text.
- Accent: Lime `#C8F04A` with `#1A1510` text, used as a rare ~1-in-8 highlight (never adjacent by coincidence because we hash the label, not the index).
- Use a small FNV-1a hash on the pill name → pick a colour bucket. Same name always gets the same colour (stable across renders), but neighbouring pills look mixed because the hash decorrelates from list order. This satisfies "mix of colours instead of grouping them by colour".

**Per-pill spawn variation (the cascade):**
- `xPct = 6 + (hash % 86)` — spread across full canvas width (6%–92%).
- `yPct = 6 + ((hash * 7) % 28)` — all spawn well **inside** the canvas near the top (6%–34%), so nothing clips the (absent) top wall.
- `angle = (hash % 30) - 15` — −15° to +15° tilt jitter.
- `density = 0.0008 + (hash % 6) * 0.0001` — slight weight variance so heavy pills sink first and light ones bounce longer (natural-feeling fall).
- `restitution = 0.25 + (hash % 5) * 0.04` — varied bounciness.
- `friction = 0.35`.

**Pill styling — same component on mobile and desktop, just scaled:**
- Rounded-full span, `font-body font-semibold`, `whitespace-nowrap`, `select-none`, `line-height: 1`.
- Mobile (`useIsMobile()` true): `font-size: 13px`, `padding: 8px 14px`.
- Desktop: `font-size: 15px`, `padding: 10px 18px`.
- No static fallback layout — physics runs on every device. This is the playful hero feature.

**Canvas height:**
- Mobile: `h-[420px]`.
- Desktop: `h-[480px]`.
- The hero section already gives `min-h-[85vh]` mobile / `min-h-[100vh]` desktop, so the absolutely-positioned `inset-0` wrapper around `<HomeGravity />` will fill the hero. We pass an explicit canvas height through the `Gravity` className so Matter has measurable dimensions even before layout settles.

**Render guard:**
- Return `null` until `tools.filter(in_stack).length > 0`. Index already gates on `!loading`, but this is a safety net so we never initialise the engine with zero bodies (which is fine, but skips a pointless mount/teardown when data refreshes).

---

## 2. Minor tweak in `src/pages/Index.tsx`

Current structure is already correct (single absolutely-positioned wrapper at `z-20`, headlines behind at `z-10` with `pointer-events-none`). Two small fixes:

- Keep the `{!loading && <HomeGravity tools={tools} />}` gate.
- No mobile-vs-desktop branching for the gravity feature — one component, one canvas, both viewports. Remove any leftover code paths that try to swap in a static flex-wrap.
- Headlines stay in cobalt `#2D35C9` on the lilac `#7B7FD4` background (already correct).

No other section of the page changes.

---

## Why this will actually work this time

- **One mount, no stagger** = no race between React re-render cycles and Matter's runner. This was the root cause of "nothing falls" and the flicker.
- **Spawn inside the canvas** (yPct ≥ 6%) + **`addTopWall={false}`** = bodies always live inside the simulation regardless of small layout shifts.
- **Hash-based colour assignment** = guaranteed mixed look, with lime appearing only as a true accent, matching brand rules.
- **Same physics on mobile and desktop**, only the pill chrome scales — the feature is consistently playful everywhere.
- **Drag works for free** because Matter's `MouseConstraint` is already installed in `Gravity` and pills use `pointer-events: none` so drags hit the canvas underneath (this is already in the existing `gravity.tsx`).

## Files to change

- `src/components/HomeGravity.tsx` — full rewrite to the model above.
- `src/pages/Index.tsx` — confirm the single-canvas layout, no mobile fork.

No new dependencies. No changes to `gravity.tsx`, brand tokens, data fetching, or any other page.
