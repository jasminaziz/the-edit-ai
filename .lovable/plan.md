## Goal
Restructure the desktop nav so the page links and the CTAs read as two distinct zones — making "Work with me" the clear hero action without crowding the bar.

## Layout structure (desktop)
Switch the nav row from a single centered cluster to a three-zone flex layout:

```
[ Logo / spacer ]   [ Nav links: Home · My Stack · Tools · Design · Learning · What's New ]   [ Substack → · Get the digest → · ⬤ Work with me ]
   left                                  left-aligned                                                                  right-aligned
```

- **Left zone**: small spacer (keeps current `w-16` reserved area for future logo).
- **Middle zone (left-anchored)**: the 6 nav links with the existing sliding white pill behaviour preserved exactly as-is. Move this group out of the centered flex and anchor it to the left side, immediately after the spacer.
- **Right zone (right-anchored)**: the CTA cluster — see below.
- Use `justify-between` on the parent row so the nav links sit left and CTAs sit right, with natural breathing room between them.

## CTA cluster (right side)
Three actions, visually ranked:

1. **"Read the Substack →"** — quiet text link
   - Style: `text-sm font-medium text-primary-foreground/70 hover:text-primary-foreground`
   - No background, no border, just the arrow.
   - Moves *up from the footer* into the nav. (Footer keeps it too — that's fine, footer is a sitemap.)

2. **"Get the digest →"** — quiet text link
   - Same treatment as Substack link above.
   - Routes to `/subscribe` (unchanged).

3. **"Work with me"** — the hero pill (primary action)
   - Solid filled pill, distinct from everything else in the nav.
   - On the Home page (lilac nav `#7B7FD4`): white pill with cobalt text — `bg-white text-primary`.
   - On all other pages (cobalt nav `#2D35C9`): lime pill with cobalt text — `bg-[hsl(var(--lime))] text-primary` (uses the brand lime accent which per memory is reserved for accents — this is exactly that use case).
   - Slightly bolder weight: `font-semibold`.
   - Drop the arrow — the solid pill shape is the affordance.
   - Hover: subtle lift via `hover:opacity-90` + `transition`.
   - Padding bumped slightly: `px-5 py-2` to feel more substantial than the surrounding text links.

Cluster spacing: `gap-5` between the two text links, then `gap-3` before the solid pill, so the pill visually separates from the secondary actions.

A subtle vertical divider (`w-px h-5 bg-white/15`) sits between the nav-links group and the CTA cluster to reinforce the two zones.

## Mobile
The mobile sheet menu already lists "Work with me" and "Get the digest" as text rows. Updates:
- Add **"Read the Substack →"** as a third CTA row in the sheet (currently missing on mobile).
- Pin **"Work with me"** to the bottom of the sheet as a full-width solid lime pill (`bg-[hsl(var(--lime))] text-primary font-semibold rounded-full py-3 text-center`) so the hierarchy matches desktop.
- "Get the digest" and "Read the Substack" stay as the existing quiet rows above it.

## Files to edit
- **`src/components/Layout.tsx`** — the only file changing.
  - Restructure the desktop `<div ref={navContainerRef}>` block: split into a left-anchored nav-links group and a right-anchored CTA cluster, with the parent row using `justify-between`.
  - Replace the two existing `<a>` / `<Link>` CTA elements with the new 3-CTA cluster (Substack + Get the digest as text links, Work with me as the solid pill).
  - Add the Substack `<a>` to the mobile `SheetContent` and convert "Work with me" there to a pinned solid pill.
  - The sliding active-pill logic (`pillStyle`, `updatePill`, refs) is unchanged — it only tracks the 6 `navItems`, which still live in the same group.

## Footer
No changes needed. The footer's "Read the Substack →" stays as part of the sitemap row — it's a different context (not a CTA, just a link).

## Out of scope
- No changes to colors in `tailwind.config.ts` / `index.css` — uses existing `--lime`, `--primary`, `--primary-foreground` tokens.
- No changes to nav links' active-pill animation or routing.