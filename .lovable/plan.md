## Goal

Add an interactive falling/draggable pill section to the homepage **without touching** the existing chunky "The / Edit. / Honest verdicts only." hero. The new section sits **between** the hero and the existing "Dashboard Preview Strip" (My Stack / What's New / Tools count).

---

## Decisions locked in (from prior approvals)

- **Placement:** New `<section>` directly below the hero, above the dashboard strip. Hero is untouched.
- **Pill content:** Mix of live tool names from `fetchTools()` (status `in_stack`, first 6) + brand-voice words: `Honest`, `Curated`, `Opinionated`, `No hot takes`, `No doom loops`.
- **Mobile:** Physics disabled below 768px. Static flex-wrap arrangement of the same pills shown instead (no Matter.js mounted at all on mobile — saves bundle execution and avoids scroll/drag conflicts).
- **Colours:** Pill backgrounds rotate through Cobalt `#2D35C9`, Forest `#2D6A4F`, Lilac `#7B7FD4`, Indigo `#4A4A9A`, Orange `#E8572A`. **No Lime fills** (memory rule preserved). Pill text is white. Typography on pills: Plus Jakarta Sans 600, ~14–16px, uppercase optional (will trial both — default lowercase to feel less shouty).
- **Section background:** Cream (page background) so it reads as a quiet editorial moment, not a second hero.
- **Section height:** ~480px desktop, static auto on mobile.
- **Section label (small caps above the canvas):** `A LITTLE PLAYGROUND` — Plus Jakarta Sans 600, 11px, tracking 0.05em, colour `#9A8F82`. Matches the existing dashboard strip label style.

---

## Files to change

### 1. `src/components/ui/gravity.tsx` — NEW
Paste the provided Gravity component, with these fixes to the supplied snippet:
- The pasted JSX in both `MatterBody` return and `Gravity` return is stripped — reconstruct the wrapper `div`s with proper refs, `className`, and `style` (absolute positioning for `MatterBody` children, relative full-size container for `Gravity`).
- Replace `Common.setDecomp(require("poly-decomp"))` with an ES module import: `import decomp from "poly-decomp"` at top, then `Common.setDecomp(decomp)`. `require` is not available in Vite/ESM and will break the build.
- Add proper TypeScript generics on `forwardRef<GravityRef, GravityProps>`.
- Type all `useRef` hooks explicitly (`useRef<HTMLDivElement>(null)`, `useRef<Matter.Render>()`, etc.) to satisfy strict TS.

### 2. `src/components/HomeGravity.tsx` — NEW
A small wrapper component that:
- Accepts `tools: Tool[]` as a prop.
- Builds the pill list: first 6 `in_stack` tool names + 5 brand words.
- Uses `useIsMobile()` from `@/hooks/use-mobile`.
- **Mobile path:** renders a `flex flex-wrap gap-2` of static pills (same colours, same typography). Returns early — Gravity is never mounted.
- **Desktop path:** renders `<Gravity gravity={{ x: 0, y: 1 }} className="h-[480px] w-full">` with one `<MatterBody>` per pill. Each pill gets a randomised `x` (10–90%) and `y` (0–10%) starting position, small random `angle` (-15° to +15°), and `bodyType="rectangle"`. Colour assigned by index modulo the 5-colour palette.
- Pills use `rounded-full px-4 py-2` with the colour palette inline-styled (consistent with the rest of the codebase's inline-style approach).

### 3. `src/pages/Index.tsx` — EDIT
- Import `HomeGravity`.
- Insert a new `<section>` between the existing hero `</section>` (around line 80) and the "Dashboard Preview Strip" `<section>` (around line 82).
- Section markup:
  ```
  <section className="bg-background py-16 px-6 sm:px-12">
    <div className="max-w-[1280px] mx-auto">
      <h2 className="font-body font-semibold text-[11px] uppercase tracking-[0.05em] text-muted mb-4">
        A little playground
      </h2>
      <HomeGravity tools={tools} />
    </div>
  </section>
  ```
- No other homepage changes. Hero, dashboard strip, CTA strip, footer all untouched.

### 4. `package.json` — install dependencies
Add: `matter-js`, `poly-decomp`, `svg-path-commander`, `lodash`, plus types `@types/matter-js`, `@types/lodash`.
Bundle impact: ~150KB gzipped added to the homepage chunk. Acceptable given desktop-only mount and the visual payoff.

---

## What is explicitly NOT changing

- The hero ("The / Edit. / Honest verdicts only.") — typography, colours, spacing, all preserved exactly.
- The dashboard strip (My Stack chips / What's New card / Tools count).
- The Cobalt CTA strip at the bottom of the homepage.
- `Layout.tsx`, footer, footer email capture, nav.
- Any other page.
- Lime accent rule — no Lime fills used.
- Sheets schema, fetch logic, RLS, Subscribe page.

---

## Flags before building

1. **`require("poly-decomp")` in the upstream snippet will break Vite.** I will swap it for an ES import. If the upstream component is ever re-pasted from source, this fix needs to be re-applied.
2. **Bundle weight:** ~150KB gzipped is a real cost for one decorative section. Acceptable for the brand moment, but worth knowing. If you later want it lighter, the alternative is a CSS-only "floating pills" animation (no physics, no drag) — happy to swap if perf becomes a concern.
3. **SSR / hydration:** Project is Vite SPA, so no SSR concerns. Matter.js mounts inside `useEffect` so it's safe.
4. **Mobile fallback is static, not animated.** If you want mobile to also feel alive, the cheapest add is a subtle CSS float/drift animation on the static pills — flag if you want that included now or later.
5. **Pill content updates live** from your sheet. If `in_stack` returns fewer than 6 tools, the brand-voice words still render so the canvas never looks empty.

Once approved, I'll switch to default mode and implement.