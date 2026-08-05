# Site Design Check — The Edit AI
**Date:** 2026-08-05
**Scope:** PWA scaffold only — `vite.config.ts` (VitePWA plugin) and `index.html` (meta tags). No visual UI, no new pages or components. No prior design-check report exists for this project; this is the first.

**Spec referenced:** No standalone Brand Application Spec / design direction one-pager / visual reference sheet exists as a separate document in the project folder. The "Design system (locked)" section of `.claude/CLAUDE.md` is the only locked spec in the repo (palette with named roles, typography with named placements, voice rules) and is treated as the contract for this check, per the project's own convention of keeping brand law in CLAUDE.md rather than a separate file. Also read `~/.claude/guides/website-build/website-build-roadmap-lovable-stack.md` (Phase 1.2, Phase 2 editorial checks, ratified learnings) as the standard held.

---

## Verdict: Faithful

Every hex value introduced by this session's changes is an exact match to the locked palette, doing a job the spec already gives that colour. No forbidden combination, no off-palette value, no near-match drift. This is a clean session on the token-fidelity axis. Three soft-drift points are worth recording because the spec is silent on PWA chrome and that silence is where risk sits — none of them are spec violations.

---

## Hard drift

None found.

- `theme_color: "#2D35C9"` (`vite.config.ts:28`) and `<meta name="theme-color" content="#2D35C9" />` (`index.html:30`) — exact match to locked cobalt. Job (browser/OS chrome colour, standing in for the site's primary brand identifier) is a reasonable extension of cobalt's documented role (CTAs, nav-active, display type) rather than a new, competing job. No ceiling breach.
- `background_color: "#FAF8F4"` (`vite.config.ts:29`) — exact match to locked page bg, used for the PWA splash screen while the app shell loads. Same job as its documented role. No drift.
- No electric lime (`#C8F04A`), no off-palette hex, appears anywhere in either file.
- `manifest.name`, `short_name`, and `description` (`vite.config.ts:24-27`) are copied verbatim from the existing `<title>` and `<meta name="description">` in `index.html` (lines 6-7) rather than freshly written, so there is no wording drift to check against voice rules — it's a direct reuse of already-approved copy.

---

## Soft drift (spec silent, intent weakened)

**1. `apple-mobile-web-app-status-bar-style` set to `"default"` flattens the one native UI element the manifest could brand**
`index.html:32`. Spec gives cobalt the job of signalling primary brand presence (CTAs, nav-active, display type, and now theme-color). `"default"` renders the iOS status bar as light background with dark text — it does not pick up `theme-color` at all (that meta tag is a web-standard fallback iOS Safari mostly ignores for standalone apps; the status bar style keys are the actual iOS control). The result: when the PWA is installed and launched standalone on iOS, the one piece of native chrome the site can brand shows as generic light-grey/white, sitting above a cobalt-toned app, rather than carrying the brand through. Fix in spec terms: use `"black-translucent"` (full-bleed content under a transparent status bar, letting the cobalt/cream app content show through) rather than `"default"`, if the intent is for the installed app to read as branded rather than as a generic web view. This is soft drift — the spec has no PWA section to violate — but it is the kind of gap this check exists to name before it's mistaken for a deliberate choice.

**2. No maskable-purpose icon variant; the reused mark risks losing its edges on Android**
`vite.config.ts:33-36`. The manifest supplies `favicon-192.png` and `favicon-512.png` with no `purpose` field, which defaults to `"any"`. I opened `public/favicon-512.png` directly: it's the existing cobalt-square, lime-bars mark, full-bleed to the edge, no safe-zone padding. Checked against the maskable-icon safe-zone standard (content must sit inside an 80%-diameter circle centred on the icon): the top and bottom bars' corners sit outside that circle by a meaningful margin (the top bar's outer corner is roughly 261px from centre against a 205px safe radius on the 512px icon). Because no `"maskable"` purpose icon is declared, Android/Chrome will not crop this — current behaviour is to pad and add a backdrop rather than crop when only an `"any"` icon is offered — but the practical effect is the same complaint from a different angle: the crisp full-bleed mark that reads correctly as a browser-tab favicon is not guaranteed to reach an Android home screen unaltered. This wasn't a problem before this session because the asset had never been asked to survive OS-level icon shaping; using it as a PWA home-screen icon is a new context, not a new asset, and the fidelity risk belongs to that context change. This is a legitimate instance of "reusing the icon holds up as asset fidelity (no reinterpretation, correct hex) but not as presentation fidelity (no safe zone for the shape it will now be forced into)." Fix in spec terms: if a maskable icon is wanted, produce one with the lime bars inset to fit inside an 80%-diameter safe circle on a solid `#2D35C9` backdrop, added with `"purpose": "maskable"` alongside the existing `"any"` entries — not a redesign of the mark, a re-crop of the existing one.

**3. Lime's job ceiling is untested at home-screen scale**
`public/favicon-512.png`, now referenced at `vite.config.ts:34-35`. The locked spec gives `#C8F04A` exactly one job: "accent/punctuation only, never a category colour or badge." At favicon scale (16-32px, a tab-strip chip), the lime bars read as texture — the job stays "accent." Promoted to a PWA home-screen icon, the same asset is now a persistent 60-180px mark sitting on the user's home screen next to their other apps, doing the job of primary app identity, not punctuation. The hex and the artwork are unchanged (correctly — this session did not regenerate or reinterpret it, which is the right call for a scaffold session), but the context did the job-expansion the spec exists to prevent when done to a colour deliberately. Nothing to fix inside this session's scope — no new asset was created — but flag it for whoever next touches app iconography: if a maskable/adaptive icon is produced per point 2 above, do not let that redesign opportunity quietly promote lime from accent to identity colour without it being a named decision.

---

## Structural drift, interaction states, forbidden combinations

Not applicable to this session. No navigation, page hierarchy, component states, or new pages were touched. No forbidden combination from the spec's list (lime on cream, grey as badge, adjacent close hues, accent on its own light tint) appears in either changed file.

---

## The art-director test

Out of full scope for a two-file scaffold session (no homepage or inner-page copy changed), but the meta layer this session touched either reinforces or undercuts the existing point of view, so it's answered briefly: the cobalt-on-cream theme/background pairing carries the site's established identity correctly into the install experience; the flattened iOS status bar (point 1) is the one place this session's additions read as generic rather than authored — a plain grey-white bar is the same status bar any of fifty SaaS PWAs would ship.

**One-sentence point of view:** A confident, opinionated cobalt-and-cream editorial voice that tells you what's actually worth using, undercut on install by one unbranded strip of native iOS chrome.

---

## Learnings

No new learning proposed. The maskable-icon safe-zone point (soft drift #2) is a specific, one-off technical/design intersection rather than a recurring pattern seen across builds — not proposing it to LEARNINGS.md on a single instance. If it recurs on another project's PWA scaffold, it should go into the guide as: "PWA icons reused from favicon assets get a maskable-purpose variant with 80%-safe-zone padding before the manifest ships, or Android home-screen presentation is unverified."
