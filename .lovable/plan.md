## Goal
Make the subheading on **What's New** match the size, weight, and color treatment used on My Stack, Tools, Design, and Learning so all five pages share a consistent header hierarchy.

## Current state
All five pages use the shared `CobaltZone` component, so the **h1** is already consistent (`clamp(56px, 8vw, 96px)`, cream).

The **subheading** is inconsistent:
- My Stack, Tools, Design, Learning → use the `subheading` prop → renders as **lime, semibold, `clamp(20px, 3vw, 32px)`**.
- What's New → uses the `bodyText` prop instead → renders as **faded white, regular, 16px** — visibly smaller and quieter than the others.

## Change
In `src/pages/WhatsNew.tsx`:

- Replace the current long tagline:
  > "Model updates, new releases, and general AI gossip. Updated regularly from The Rundown.ai."
  
  with a split:
  - **`subheading`**: `"Model updates, releases, and AI gossip."` — renders in the lime, semibold, `clamp(20px, 3vw, 32px)` style, matching the other four pages exactly.
  - **`bodyText`**: `"Updated regularly from The Rundown.ai."` — kept as the smaller faded-white attribution line beneath it.

No changes to `CobaltZone` itself, and no changes to the other four pages — they're already aligned.

## File to edit
- `src/pages/WhatsNew.tsx` — pass `subheading` and `bodyText` props to `CobaltZone` instead of only `bodyText`.

## Result
All five pages will share the same header hierarchy:
- H1: 56–96px cream
- Subheading: 20–32px lime semibold
- Optional bodyText: 16px faded white