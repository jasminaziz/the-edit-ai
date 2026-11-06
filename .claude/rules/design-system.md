---
paths:
  - "src/**/*.tsx"
  - "src/**/*.css"
  - "tailwind.config.ts"
---

# Design system and component conventions

Loads with any component or stylesheet. The always-on design rules are in `CLAUDE.md`. History: `.claude/history/CLAUDE-md_2026-11-06.md`, sections "Design system (locked)", "The 1 September post-merge pass" and "Codebase conventions".

## Palette (locked; hex, never names)

- `#FAF8F4` page, `#FFFFFF` card, `#2D35C9` cobalt (display type, nav, CTAs, month headers), `#1A1510` ink text, `#6B625A` secondary text (`--text-secondary`), `#E8E2D8` borders.
- Periwinkle is `#9B9EDE` as the `--secondary` token and `#7B7FD4` on the homepage nav and hero. The token stays `#9B9EDE` because cobalt on it is 3.38:1 and clears the 3:1 display floor on the legal and policy `h1`s; never revert it. The homepage nav and hero must be the same `#7B7FD4`, because a nav one step off the hero is the defect the colour exists to fix. The "Work with me" pill is white with cobalt text on the homepage (lime on periwinkle is 1.92:1) and lime elsewhere.
- The homepage on `#7B7FD4` is a named exception on Gate 1 (Jasmin, 9 Oct 2026, chosen over a cobalt bar and a darker nav): cream links 3.40:1, inactive tabs and drawer rows at `text-white/70` 2.59, the drawer's How I work links at `white/80` on their cream-8% panel 2.63, lime "Menu" 2.75, against 4.5; the cobalt wordmark on the hero 2.37 against 3. No periwinkle clears every nav text short of `#3F45C1`, which loses the hero. Homepage only: on cobalt the same classes measure 4.97 and 5.22.
- Periwinkle never carries white text (2.52:1); its foreground is ink at 7.20:1.
- Muted `#9A8F82` never carries text: 2.99:1 on cream and 3.17:1 on the card fails AA at every size. It keeps rules, dividers and icons.
- Lime `#C8F04A` is accent only. Whether something is an accent is settled by area: the largest lime on any page is a CTA of roughly 160x40, and the band that was cut measured 38 times the next lime element.
- Forest `#2D6A4F` identifies Jasmin's own stack: the In My Stack badge, the Green DPIA chip, the DesignKit `free` badge and one hero pill colour. It measures 1.33:1 against the cobalt nav and 1.77:1 against the periwinkle, so a bare forest fill on the nav has no visible edge.
- The cobalt hover is ink `#1A1510` (white on it 18.12:1). There is no other hover colour.
- `#EEF0FB` cobalt tint with `#2D35C9` text is the chip and badge background.
- DPIA chips: Green `#2D6A4F` on `#E4F0E9`, Amber `#7A5200` on `#FAF0DB`, Red `#A8261C` on `#FBE9E6`, text and 1px border in the same hex, AA on white and cream.
- Burnt orange `#E8572A` is retired (white on it 3.60:1); it returns only with a darker variant and a ruling. The one approved off-palette hex is the hero pill orange `#C2410C` (white 5.18:1). Any other non-palette hex in a rendering path is new and a regression.
- Before adding or editing a token, compute what it renders and compare it to the locked hex: an integer HSL triple almost never round-trips, and seventeen once did not, which is why components had hardcoded hex.
- Fonts: Chillax 700 display (Fontshare); Plus Jakarta Sans 400, 500 and 600 body (Google Fonts).

## Component conventions

- ToolCard colour lives in `src/index.css` under `.tool-card`, driven by `data-selected` on the card root; never put an inline hex back into `ToolCard.tsx`. The DPIA chips key off `data-flag`, and no `[data-selected]` rule targets them, which keeps their colours on the inverted card.
- Interaction states go in `index.css`, never in mouse handlers. An inline `style` outranks the stylesheet, which is what forces a component into JS handlers in the first place: never put `textDecoration` in a link's inline style. Hover and `:focus-visible` share one rule, because a mouse-only state leaves the keyboard nothing visible.
- Loading states hold a screen's height: `LoadingSpinner` is `min-h-screen` and the route `<Suspense>` fallback is a `min-h-screen` div, never `null`. Either one short lets the footer rise and fall, a layout shift. Measure CLS frame by frame on a cold load with a chunk held back to force the race; a single Lighthouse run catches it only when the race goes the wrong way.
- `FooterEmailCapture` renders from `Layout.tsx` on every route, so anything it names is multiplied across the site.
- `CobaltZone`'s subheading is an `h2` and tool card names are `h3` wrapping the link, so `/tools` and `/radar` run h1, h2, h3 with no skip. `subheading` is a `ReactNode` so a call site can place a line break inside an approved string without changing its text.
- `CobaltZone`'s `helpBubble` is a disclosure, not a tooltip: ARIA tooltips must not hold substantial content, and `src/components/ui/tooltip.tsx` is the wrong primitive. Its answer renders only while open, so nothing in it reaches the prerendered HTML and it can carry nothing meant for a crawler. The section drops `overflow-hidden` when a bubble is present, which is safe only while no route relying on that overflow (an illustration or `rightBadge`) also passes a bubble. The bubble sits in a flex column, not an overlay: an absolute bubble reserves no space, and a transform on its wrapper creates a stacking context that scoped its `z-50` below the sticky filter bar.
- The breakpoint contract: `MOBILE_BREAKPOINT` in `src/hooks/use-mobile.tsx` governs chrome (nav, homepage counter, hero pills, drag hint) at 1024, Tailwind's `sm:` governs content layout at 640, and no element consults both. When the hook was 768, "Work with me" sat off-screen from 768 to about 1086px, clipped silently by an `overflow-hidden`.
- The homepage About columns are a 12-column grid where both halves span 6; skipping column 6 made a 176px gap that looked like one gutter. Do not push the About header clamp past 56px: the fourth line starts at about 59px in the 608px column, and the 30px floor keeps phones out of it below an 804px viewport.
- `cardSelectionProps` ignores a `pointerenter` with zero movement: a card scrolling under a still cursor genuinely enters hover, and with the grid sharing one hovered value the inversion chased down the column on every scroll.
- `src/components/ui/` holds four components (`animated-counter`, `gravity`, `sheet`, `tooltip`). Dead code is found by transitive reachability from `main.tsx`, not by hand. `lovable-tagger` is not dead: `vite.config.ts` imports it. `supabase/migrations/` stays whole: it is the only local record of what was applied to a project that also hosts the ops-dashboard tables. Removing unreachable modules moves the CSS, not the JS (Tailwind scans them; Rollup already tree-shakes), so verify a sweep against the built `dist/`, which `tsc` cannot see.
