## Problem

The footer currently puts everything in one wrapping row:

`Privacy · Terms · Cookies · Work with me → · LinkedIn → · Read the Substack → · © 2026`

That mixes three different things (legal, connect CTAs, copyright) at one visual weight, and on narrow screens it wraps into an awkward block of 7 items.

## Proposed tidy-up

Split the footer's bottom strip into **three clear groups**, keeping the existing styling tokens (no new colors/fonts):

```text
─────────────────────────────────────────────────────────────
Curated by Jasmin Aziz · hello@jasminaziz.co.uk
                                Work with me →  LinkedIn →  Read the Substack →
─────────────────────────────────────────────────────────────
Privacy   Terms   Cookies                                © 2026
```

### Layout details
- **Row 1 (existing):** "Curated by Jasmin Aziz · email" stays as-is on the left. On the right, a new **Connect** group with the three external CTAs (Work with me, LinkedIn, Substack). Same lime-on-hover treatment as today, slightly brighter than legal links so CTAs feel like CTAs.
- **Row 2 (new thin divider above):** Legal links (Privacy / Terms / Cookies) on the left, © 2026 on the right. Muted `text-primary-foreground/40` styling — these recede.
- **Mobile:** stack vertically, centered, in the same order (brand → connect → legal+©). The connect group stays on one line; legal stays on one line.

### What changes vs. stays
- No new links added or removed.
- No copy changes.
- No color/typography changes — uses existing `font-body`, `text-primary-foreground/40`, lime hover.
- Substack link stays gated on `SUBSTACK_LIVE`.
- All hrefs continue to read from `src/lib/links.ts`.

### Files touched
- `src/components/Layout.tsx` — restructure only the footer's bottom block (roughly lines 240–305).

If you'd rather a different split (e.g. keep everything in one row but add subtle separators, or drop "Work with me" from the footer since it already lives in the top nav), say the word and I'll adjust before building.