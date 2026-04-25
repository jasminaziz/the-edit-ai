## Goal

Pull the gravity pill component **into** the lilac hero section so the falling/draggable pills become part of the "The Edit." moment. Remove the lime "Honest verdicts only." tagline. Remove the standalone "A little playground" section underneath since it'd be redundant.

---

## What changes

### 1. `src/pages/Index.tsx` — EDIT

**Remove:**
- The lime `<p>` tagline "Honest verdicts only." inside the hero `<section>`.
- The entire standalone "Gravity playground" `<section>` that currently sits between hero and dashboard strip (including its "A little playground" small-caps label).

**Add inside the hero `<section>`:**
- An absolutely-positioned `<HomeGravity tools={tools} />` layer that fills the hero, sitting **behind** the "The / Edit." headlines so the typography stays the hero anchor and pills tumble around/behind it.
- Render the pills only once `!loading` (same guard as before) so they don't pop in empty.

**Hero structure (conceptual):**
```
<section class="relative ... bg-lilac">
  {/* Pills layer — absolute, full hero, z-0, pointer-events controlled */}
  <div class="absolute inset-0 z-0">
    {!loading && <HomeGravity tools={tools} />}
  </div>

  {/* Typography layer — relative, z-10, pointer-events-none so pills stay draggable */}
  <div class="relative z-10 pointer-events-none">
    <h1>The</h1>
    <h1>Edit.</h1>
  </div>
</section>
```

The typography wrapper gets `pointer-events-none` so mouse drags hit the pill canvas underneath. The pill `<span>`s themselves remain interactive (Matter.js mouse constraint lives on its own canvas).

### 2. `src/components/HomeGravity.tsx` — EDIT

Currently hard-codes `h-[480px] w-full`. To fill the hero we need it to fill its parent instead.

- Change desktop `<Gravity>` className from `h-[480px] w-full` to `h-full w-full`.
- Mobile fallback: keep the static flex-wrap, but constrain it so it doesn't dominate the hero on small screens. Render it absolutely at the bottom of the hero (`absolute inset-x-0 bottom-6 px-4 flex flex-wrap gap-2 justify-center`) — the parent in `Index.tsx` controls positioning by passing through.

Cleanest split: accept an optional `variant?: "section" | "hero"` prop, defaulting to current behaviour, and let `Index.tsx` pass `variant="hero"` so the component knows to fill its parent and use the centered mobile layout. This keeps the component reusable if you ever want the standalone section back.

### 3. Pill colour palette — minor adjustment

Hero background is Lilac `#7B7FD4`. Lilac is currently in the pill palette, so any lilac pills will disappear into the background.

- Remove Lilac `#7B7FD4` from `PILL_COLOURS` in `HomeGravity.tsx`.
- Remaining palette: Cobalt, Forest, Indigo, Orange. Still respects the no-Lime rule. Adds enough contrast against lilac.
- Optional: add Cream `#F5EFE6` or white-outlined pills to lighten the mix — flagging as a follow-up, not doing it now unless you ask.

---

## What is NOT changing

- "The / Edit." typography — sizes, weight, colour `#2D35C9`, all preserved.
- Hero height, padding, lilac background.
- Dashboard preview strip, CTA strip, footer, nav.
- Mobile fallback strategy (still no physics on mobile).
- Lime accent rule — Lime is now fully removed from the hero, only used elsewhere as accent per memory.
- `gravity.tsx`, dependencies, sheets logic.

---

## Flags before building

1. **Hero now has no tagline.** "The Edit." + falling pills carries the whole message. If you later want a small line back (e.g. "Honest verdicts only." in cobalt or cream instead of lime), it's a 2-line add.
2. **Pointer events:** typography layer becomes `pointer-events-none` so pills are draggable through it. This means you cannot select the "The Edit." text with a cursor. Acceptable for a hero; flagging in case it matters for accessibility tooling.
3. **Mobile hero gets shorter content.** With pills moved into the hero and the playground section deleted, mobile users see hero → dashboard strip directly. The static mobile pills will sit at the bottom of the hero. If the hero feels cramped on small phones, we can drop the mobile pills entirely and keep them desktop-only — let me know.
4. **Lilac removed from pill palette** to avoid camouflage. If you want lilac pills back with a darker outline instead, say so before I build.
5. **Z-index / stacking:** Matter.js renders to its own canvas inside the Gravity wrapper. Pills will visually appear behind "The Edit." headlines (z-0 vs z-10). If you want pills in front of the type, swap the z-index — flag your preference.

Once approved I'll switch to default mode and ship.