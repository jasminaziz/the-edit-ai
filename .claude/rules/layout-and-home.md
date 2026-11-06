---
paths:
  - "src/components/Layout.tsx"
  - "src/lib/links.ts"
  - "src/hooks/use-mobile.tsx"
  - "src/pages/Index.tsx"
  - "src/components/HomeGravity.tsx"
  - "src/components/DragHint.tsx"
  - "src/components/AboutPanel.tsx"
  - "src/components/FooterEmailCapture.tsx"
---

# Nav, hub, homepage hero

Loads with the files above. History and every measurement: `.claude/history/CLAUDE-md_2026-11-06.md`, sections "Routes and canonical URLs" and "The 1 September post-merge pass". The closed record of the nav build is `build-plan.md` on `main`.

## The nav (ruled 13 Sep 2026)

- The bar is Home, Tools, Template and the How I work hub, then "Work with me". The line it draws is checked against not checked: Tools is the checked directory, and the hub holds the four pages that come from Jasmin rather than the checks.
- The hub tab links to `/my-stack` and is active on all four hub pages. Each hub page's label and subheading live once, in `HUB_PAGES` in `src/lib/links.ts`, read by both the banner and the page's own h2 through `hubSubheading()`; edit a subheading there so the two copies cannot drift.
- The section banner shows on `/my-stack`, `/design-kit`, `/learning` and `/ai-news` only, never the homepage. The checks line ("This page hasn't been through the checks. Everything on Tools has.") lives in the banner from `lg` only, so on a phone the hub pages carry no checks claim at all. That is the ruling, not an omission: do not restore it without Jasmin.
- The drawer's How I work panel links are white at 80%, not 70%: on the panel's lighter ground 70% is 4.39:1, under AA.
- Links set `aria-current` by hand ("page" on the current page, "true" on the hub tab for the hub pages it does not link to), because `NavLink` could mark the hub tab only on the one page it links to.
- Do not bring back a My Stack button in the CTA cluster: it was a place dressed as a call to action, and both earlier moves had one goal, Tools second, which the hub keeps.
- "Read the Substack" is out of the desktop bar and deliberately still in the drawer. The asymmetry is the decision: do not "finish the job". The width argument that removed it no longer holds; the link stays out until Jasmin rules otherwise.
- `/radar` is deliberately not in the nav (1 Sep 2026): it is a secondary view of the directory, and the signposts on `/tools` are the only way in, so they are load-bearing.
- The sliding active pill re-measures once web fonts load, because on a first visit it was measured against the fallback font and sat up to 14px off its tab. Prove any change to it on a cold load; a warm reload has the fonts cached and cannot show the bug.
- `Layout.tsx`'s mobile back-to-top button reads and writes `scrollRef`, the inner scroll pane, never `window`: body scroll is locked, so a straight port of a window-scroll script ships dead. It is gated on `isMobile` and consults no Tailwind breakpoint.

## The homepage hero (ruled 1 and 13 Sep 2026)

- The desktop hero is as tall as its content, not full-screen, and the wordmark is capped by screen height as well as width, so the sector line reaches the first screen. The full stop is not protected from the pills, by ruling: the pile settles differently run to run, and Jasmin chose this over an invisible matter-js disc. Do not add the disc without her.
- The mobile hero is `min-h-[500px]` flat, wordmark at the top, because below about 393px wide both type clamps sit on their floors, so the wordmark is a fixed height while a vh hero is not. 500 is derived: 56 top inset, 212 wordmark, 44 gap, 188 pile. The mobile pill count, not the hero height, is the lever if the gap needs tightening. Centring the wordmark was tried and rejected: it opens an identical gap above.
- The pills rotate cobalt, forest, ink and orange `#C2410C` with lime as a roughly 1-in-8 accent; the rotation is indexed by position, so swapping one colour reshuffles every pill. Mobile cap 16, desktop 30. A 2px ink rim was removed on Jasmin's ruling that it looked wrong; do not reintroduce it. Separation rests on the fill, accepted because the pills are decorative and every label clears 4.5:1.
- The DragHint points down on mobile and left on desktop, because on desktop the pile ends before the strip where the hint sits. Verify it by relationship: count the pills on the arrow's line, never only that the hint is on screen.
- Never measure the hero in a hidden pane: matter-js runs on `requestAnimationFrame`, so a frozen pile reads exactly like a settled one. Take over `requestAnimationFrame`, pump it by hand, and confirm rest by sampling twice and checking the drift.
- The homepage "What I'm running" strip reads `my_stack`, the same source as the pills above it, so the page makes one claim from one source. Whether it should honour the `featured` flag is an open ruling.
