## Desktop top nav — three stacked pills

Replace the current right cluster (`Read the Substack →` text · `Get the digest →` text · divider · `Work with me` solid pill) with a vertical stack of three compact pills on the right side.

### Visual

```text
┌──────────────────────────────────────────────────────────────────┐
│ Home  My Stack  Tools  Design  Learning  What's New   [ Work with me ] │
│                                                       [ Get the digest ] │
│                                                       [ Read the Substack ] │
└──────────────────────────────────────────────────────────────────┘
```

- **Work with me** — top of the stack, primary solid pill (white on Home, lime accent elsewhere — same as today).
- **Get the digest** — outline/ghost pill: transparent fill, 1px `white/30` border, white text, `hover:bg-white/10`.
- **Read the Substack** — same outline/ghost pill style as Get the digest.
- Compact sizing: `text-xs font-medium`, `px-4 py-1`, `rounded-full`, `gap-1.5` between rows so the stack stays tight.
- Right-aligned, vertically centered against the nav items on the left.

### Nav bar height

Stacking three pills needs more vertical room than the current `h-16` (64px). Plan:
- Desktop nav bar height grows to roughly **`h-[104px]`** (enough for 3 × ~28px pills + ~10px internal gaps + padding).
- Mobile nav bar height stays at `h-14` (hamburger sheet is unchanged).
- Update `<main>`'s top padding from `sm:pt-16` to `sm:pt-[104px]` so hero sections aren't hidden behind the taller nav.
- Substack pill stays gated on `SUBSTACK_LIVE`. If it's off, the stack collapses to two pills and the bar still feels balanced — height stays the same so layout doesn't jump.

### Out of scope

- Mobile sheet stays exactly as it is.
- Footer is unchanged (we just tidied it).
- No copy, color-token, or link changes; reuses existing `accent` / `primary-foreground` tokens.

### Files touched

- `src/components/Layout.tsx` only:
  - Desktop CTA cluster (~lines 196–227) → vertical stack of three pills.
  - Nav container height + `<main>` top padding (~lines 80, 234).

### Heads-up

A taller fixed nav eats more above-the-fold space on desktop. If after seeing it you'd rather a shorter bar, the quick fallback is the side-by-side three-pill layout — say the word and I'll switch.