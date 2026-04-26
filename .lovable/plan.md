## Bold "Source" Badge — What's New Header

Replace the body text on the **What's New** page with a bold badge anchored to the right of the heading. Badge will be trimmed to **"SOURCE: THE RUNDOWN.AI"** and styled to match the site's bold, high-contrast design language (cobalt + lime + Chillax).

### Design treatment

A solid **lime block** (not an outline pill) with **cobalt text**, slight rotation for personality, and Chillax bold typography — sitting confidently in the top-right of the cobalt header zone.

- **Background**: Solid `#C8F04A` (electric lime accent)
- **Text color**: `#2D35C9` (cobalt) — high contrast against lime
- **Typography**: Chillax Bold, uppercase, ~13–14px, letter-spacing `0.08em`
- **Shape**: Rounded rectangle, `border-radius: 8px` (not full pill — matches the bold blocky feel of hero badges elsewhere on the site)
- **Padding**: `10px 16px`
- **Rotation**: Subtle `-2deg` tilt for character (consistent with playful pill motion on home)
- **Shadow**: Hard offset shadow `4px 4px 0 #1A1510` for the bold sticker/print feel

### Layout

- **Desktop (≥768px)**: Badge absolutely positioned top-right of the `CobaltZone` inner container, vertically centered against the heading block.
- **Mobile (<768px)**: Badge drops below the subheading, left-aligned `inline-flex` so it doesn't overlap the large heading.

### Files to edit

**`src/components/CobaltZone.tsx`**
- Add optional `rightBadge?: string` prop.
- Render badge with the styling above; remove the existing `bodyText` rendering when `rightBadge` is present (or keep both — `bodyText` still works for other pages).
- Use a flex container at the top so heading + badge sit on one row on desktop, stack on mobile.

**`src/pages/WhatsNew.tsx`**
- Remove `bodyText="Updated regularly from The Rundown.ai."`.
- Add `rightBadge="Source: The Rundown.ai"` (component will uppercase it via CSS).

### Out of scope
- No changes to other pages using `CobaltZone` (Tools, My Stack, Design, Learning) — `rightBadge` is opt-in.
- No changes to `bodyText` behavior for backward compatibility.
