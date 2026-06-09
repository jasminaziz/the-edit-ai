## Problem

On mobile, visitors arrive at `/tools` and see a search bar, category pills, and a grid of cards with an "Add to stack" button. Three signposting issues hide the build-your-stack flow:

1. **No headline intent.** Nothing above the grid tells visitors they can *curate* a stack — only that they can browse tools.
2. **The tooltip is shy.** `StackTooltip` only fires when localStorage flag is unset, delays 1.5s, sits low above a half-transparent bar, and dismisses on first add — so returning visitors and anyone who scrolls past the first second never see it.
3. **The persistent bar is invisible until used.** `StackBar` renders at 50% opacity with the label "Your stack (0)" when empty — on mobile this reads as a disabled footer chrome, not an interactive prompt. The "↑" affordance only appears once items are added.

## Goal

Make it unmistakable on mobile that:
(a) each tool can be added to a personal stack, (b) the bottom bar is where the stack lives, and (c) tapping it leads somewhere (share / view).

## Plan

### 1. Add a mobile intent banner above the grid

Just under the filter bar, on mobile only (`sm:hidden`), add a slim lilac strip:

> **Build your stack** — Tap *Add to stack* on any tool. Share it in one link.

- Background `#7B7FD4` (matches the StackBar so the eye connects the two surfaces).
- White heading (Chillax 15px/600), white/80 body (Plus Jakarta 13px).
- Small lime arrow (↓) on the right hinting at the cards below.
- Dismissible via an `×`, persisted to localStorage (`stack-banner-seen`). Hidden when `?stack=` is present (shared-stack view already explains itself).

### 2. Upgrade the empty StackBar into an active call-to-action

Today: 50% opacity, label "Your stack (0)", non-interactive.

Change empty state to:
- Full opacity, same lilac background.
- Label: **"Your stack is empty — tap any tool to start"** with a small lime pulsing dot on the left.
- Keep the bar non-expandable when empty, but make it feel alive (subtle 2s pulse on the dot).

When count > 0, behavior is unchanged but:
- Label becomes **"Your stack · {count}"** with a lime "View & share →" chip on the right (replacing the bare ↑/↓ arrow), so the action is obvious without expanding.

### 3. Replace the timed tooltip with a one-time coachmark on the first card

Remove the floating `StackTooltip` (or keep it desktop-only). On mobile, until `stack-coachmark-seen` is set, overlay a small lime arrow + caption pointing at the **first card's "Add to stack" button**:

> *Tap to add → builds your stack at the bottom*

- Inline, attached to the first `ToolCard`, so it can't be missed and doesn't fight the StackBar for the same screen real estate.
- Auto-dismisses on first add or on `×`.

### 4. Strengthen the per-card affordance

Minor card tweaks for mobile clarity:
- Rename the empty-state button label from "Add to stack" to **"+ Add to my stack"** (the `+` reads as an action at a glance).
- When added, keep "✓ Added" but also briefly flash the StackBar (200ms lime outline) so the cause→effect link is visible — this is what teaches the pattern.

### 5. Preserve desktop

All four changes are mobile-first; desktop keeps the current hover-driven flow. The intent banner and coachmark are `sm:hidden`; the StackBar copy change applies on all sizes (it improves desktop too); the card flash is universal.

## Technical notes

- Files touched: `src/pages/Tools.tsx` (banner + coachmark wiring), `src/components/StackBar.tsx` (empty-state copy, pulsing dot, View & share chip, flash-on-add via a ref or `key`-bump), `src/components/ToolCard.tsx` (button label, first-card coachmark slot via an optional `showCoachmark` prop), retire or hide `src/components/StackTooltip.tsx` on mobile.
- New localStorage keys: `stack-banner-seen`, `stack-coachmark-seen` (existing `stack-tooltip-seen` stays for desktop or gets removed).
- No data-model or routing changes; share/View links already exist.
- Colors stay within the locked palette: lilac `#7B7FD4`, lime `#C8F04A`, cream `#FAF8F4`, ink `#1A1510`.

## Out of scope

- No changes to `/stack` (MyStack page) or share-link behavior.
- No changes to filter bar, search, or category pills.
- No new analytics events (can be added later if needed).
