

# The Edit — AI Tools Intelligence Tracker

## Overview
A 5-page editorial-style website that tracks AI tools with honest verdicts. All tool data is fetched dynamically from Google Sheets. The design is bold, high-contrast, and magazine-inspired.

## Pages

### 1. Home ( / )
- Full-viewport hero with periwinkle (#7B7FD4) background
- "The Edit" in oversized blue-on-blue text, "Honest verdicts only." in acid green
- Wavy SVG divider in acid green transitioning to off-white content
- Three preview sections: My Stack pills, Latest What's New cards, Tools count — all fetched from Google Sheets
- Near-black footer with "Built by Jasmin" and "Built with Lovable"

### 2. Tools Directory ( /tools )
- Blue header with "Tools" heading and decorative starburst
- Search bar + category filter + status filter (client-side filtering)
- 3-column responsive grid of tool cards with status badges, category pills, truncated descriptions
- "Honest verdict +" expands inline on click — cards are not links

### 3. What's New ( /whats-new )
- Blue header with "What's New — in AI" (acid green), lightning bolt icon
- Editorial layout: first entry as large featured card, rest in 2-column grid
- Coloured header bands alternating blue/green, relevance badges, expandable verdicts
- Batch labels to group by month

### 4. My Stack ( /my-stack )
- Blue header with "My Stack" and "What I'm actually using."
- Filters to in_stack tools only, grouped by category
- Full-width horizontal cards with verdict shown on light purple background
- "How I built this" note section in acid green at bottom

### 5. Learning ( /learning )
- Blue header with "Learning" and "How I'm staying sharp."
- 6 hardcoded learning resource cards in 2-column grid
- Each card: name, type/provider tags, free/paid indicator, description, link button
- Acid green banner at bottom

## Data Architecture
- `src/lib/sheets.ts` — single data service with `fetchTools()` and `fetchWhatsNew()`
- TypeScript interfaces for Tool and WhatsNew
- Google Sheets API v4 via `VITE_GOOGLE_SHEETS_ID` and `VITE_GOOGLE_SHEETS_API_KEY`
- Graceful error handling: loading spinners, error messages, empty states — never crashes

## Shared Components
- Persistent nav bar (Home, Tools, What's New, My Stack, Learning)
- Footer on all pages
- Status badge component with defined colour mappings
- Loading spinner and error state components

## Design System
- Colors: #2D2DE5 (primary), #7B7FD4 (hero), #C8F135 (accent), #F5F5F0 (content bg), #0A0A0A (footer)
- Typography: Figtree Black for headings, Inter Regular for body (loaded via Google Fonts)
- Cards: 8px radius, white bg, subtle shadows
- Fully responsive across desktop, tablet, and mobile

