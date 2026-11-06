---
paths:
  - "src/pages/Tools.tsx"
  - "src/pages/Radar.tsx"
  - "src/pages/MyStack.tsx"
  - "src/pages/PolicyTemplate.tsx"
  - "src/pages/Submit.tsx"
  - "src/components/ToolCard.tsx"
  - "src/components/CobaltZone.tsx"
  - "src/utils/slugify.ts"
  - "src/index.css"
---

# Tools, radar, My Stack, template and submit pages

Loads with the files above. History and every measurement: `.claude/history/CLAUDE-md_2026-11-06.md`, sections "Routes and canonical URLs", "Conversion", "Codebase conventions" and "The 1 September post-merge pass".

## /tools and /radar

- Radar rows are selected by `!isComplete()`, never by `status === "on_radar"`: finished, published rows can still carry `on_radar`, and `isComplete()` is the predicate the grid and the homepage counter share, so a row appears on exactly one of the two pages.
- `RadarCard` is not `ToolCard`: ToolCard's "THE CHECKS" heading renders unconditionally, over fields that are empty by definition on a radar row. RadarCard's Visit link uses `tc-policy-link`, not the lime `tc-visit` pill, so a lead does not read as a recommendation, and it carries no IN MY STACK badge.
- The radar signpost renders above the grid from `sm` up and below it on a phone, never both, because on a phone the above-grid signpost took the first screen from a reader still working out what `/tools` is. A third phone-only signpost is spliced into the grid at 12, away from the template card at 6, so two CTAs never land back to back. `sm:hidden` stays on the `RevealItem`, not the div inside it, or the empty grid slot stretches to the row height and leaves a hole in the desktop grid.
- The filter rail wraps at `lg`, not `sm`: wrapping from `sm` let a chip escape the viewport between 640 and 739px and dragged the page into horizontal scroll. Below `lg` the rail scrolls behind a 40px fade with 40px of end spacing; its overflow on a phone is the design.
- Only IN MY STACK renders as a badge (forest, `status === "in_stack"`). `on_radar` is live data that nothing renders, and a blank status falls back to `on_radar`.

## Deep links

- `/tools?tool=<slug>` opens one card's verdict and scrolls to it: a query parameter, not `/tools/:slug`, because the job is a shareable link, not 23 indexable pages to maintain. `src/utils/slugify.ts` is the single source of slugging.
- Matching is one-way and deliberately brittle: parameter and tool name are both slugged, with no stored slug, so a renamed tool breaks its old link rather than opening the wrong card. An unmatched parameter loads the page with nothing open.
- No `behavior: "smooth"`: a smooth scroll runs on `requestAnimationFrame` and stalls where frames are not produced. The scroll is computed from `offsetTop`, not `scrollIntoView`, because the card is still in its hidden reveal state when the scroll starts.
- `.tool-card` carries a two-value `scroll-margin-top`, because the sticky filter rail is a different height below and above `lg` and compacts once scrolled; a deep link that opens the right verdict but hides the tool's name is not finished. Measure a landing only after the page settles, by sampling until nothing moves.
- `under-rail` on the content section of `/tools` and `/radar` is load-bearing: every link and button inside it carries the card's scroll margin, which keeps keyboard focus from landing behind the rail (WCAG 2.2 AA 2.4.11). It sits on the section, not the scroll pane, because padding on the pane would push deep links down. Re-check with a Tab and Shift+Tab sweep if either page's layout changes.

## The template CTA

- Three links carry "Get the template →": the footer (every route), the template card in the `/tools` grid, and `/policy-template`, which downloads the `.docx` directly. Keep all three labels identical. The nav's Template tab is a place, not this CTA. `ToolCard`'s Red-gated link to the same route carries a deliberately different sentence.
- `/policy-template`'s intro is three paragraphs for readability; no word of it changed.

## My Stack and Submit

- `/my-stack` has no "How I built this" section and must not get one back: its claim was "always current", and `my_stack` is the tab with no fact owner (no `last_checked`, nothing checks its prices or verdicts). The page's body text leads with the personal claim.
- The `my_stack` featured card's header row is `pr-[52px]` below `sm`, derived from the absolutely positioned 48px mark, which reserves no space.
- `/submit` offers a mailto link; the form never sent anything. Its leftover form state is unreachable code inside a live route.
