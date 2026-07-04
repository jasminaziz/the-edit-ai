# The Edit AI: security audit and code quality review

Date: 2026-07-04
Scope: full repo (including git history), GitHub Actions workflows, live Supabase project (read-only), npm dependency audit. No changes made. No env values read or touched.

Verified facts this report rests on:

- Repo `jasminaziz/the-edit-ai` is **private** (confirmed via `gh`).
- Live Supabase project for The Edit is `zsoczlgkyessfhobhtgu`. The project referenced in git history and in `supabase/config.toml` (`htimtwbltcpupsjpkqlv`) no longer exists in the account.
- RLS checked live via the Supabase connector, read-only.

---

## Critical (fix immediately)

**No critical findings.** Nothing in the repo, history, workflows, or live database allows data theft, account compromise, or site takeover today. The two things closest to critical are listed first under Moderate because each has a real mitigating factor (private repo; low-value target).

---

## Moderate (fix soon)

### M1. Ops dashboard data lives in The Edit's Supabase project and is publicly readable

- **What/where:** The live project contains five tables, not one: `subscribers`, plus `ops_agent_status` (public SELECT policy, `qual: true`), `ops_secrets` (RLS enabled, no policies), and empty Lovable-era `tools` and `whats_new` tables (public SELECT). Two `SECURITY DEFINER` functions (`ops_report_agent`, `ops_clear_running`) are callable by `anon` via `/rest/v1/rpc/`, gated only by a plaintext token compared against `ops_secrets`.
- **Why it matters:** The Edit's anon key is embedded in the public site bundle by design. Anyone who extracts it (trivial) can read `ops_agent_status` in full: agent names and `current_task` strings for a dashboard you treat as private (noindex URL). They can also call the ops RPCs with unlimited token guesses; there is no rate limiting or lockout. This contradicts the documented architecture ("Supabase is subscriber capture only") and couples two projects' blast radii.
- **Suggested fix (flagged, do not build without deciding):** Either move the ops tables/functions to their own Supabase project, or accept that agent status text is public and keep `current_task` strings free of client/project detail. At minimum, drop the empty `tools` and `whats_new` tables and ensure the ops token is long and random. Any policy change belongs to the ops-dashboard project's session, not this repo.
- **Correction after cross-checking memory (2026-07-04):** much of this is a documented, accepted design, not a discovery. The ops-dashboard decision record (2026-07-03) states the tables deliberately share The Edit's project (free-tier limits), the status table is intentionally world-readable, writes are token-gated, and the hooks send only whitelisted coarse task phrases, never file paths or client names. The audit **verified that design holds** (forged writes rejected, `ops_secrets` unreadable via the API). Genuinely new information is limited to: the empty Lovable-era `tools`/`whats_new` tables, GraphQL schema discoverability, and the absence of rate limiting on token guesses. Severity in practice: low, unless the whitelist discipline in `ops-agent-activity.mjs` ever slips.

### M2. GA4 loads unconditionally; the cookie banner is decorative

- **What/where:** [index.html:11-18](index.html) loads gtag and fires `gtag('config', 'G-QHYYEWC2C0')` on every page view, before any consent. [CookieBanner.tsx](src/components/CookieBanner.tsx) writes the choice to `localStorage` under `theEditCookieConsent`, but nothing anywhere in `src/` reads that key. Accept and decline have identical effect.
- **Why it matters:** Under UK GDPR/PECR, analytics cookies need prior consent. The site currently collects analytics from users who decline, while displaying a banner that implies choice. For a site positioned as a professional proof point, this is a credibility risk as much as a compliance one.
- **Suggested fix:** Implement Google Consent Mode: default `analytics_storage` to `denied` in the inline snippet, then `gtag('consent', 'update', ...)` when the stored choice is read or made. One job, two files (index.html snippet + CookieBanner).

### M3. Apps Script write endpoint is unauthenticated and its URL is committed

- **What/where:** [append-whats-new.yml](.github/workflows/append-whats-new.yml) POSTs to the Apps Script URL with no shared secret. The Apps Script (deployed as "anyone can access", by design, since it must accept unauthenticated POSTs from Actions) will append whatever rows it receives to the `whats_new` tab.
- **Why it matters:** Anyone who obtains the URL can append arbitrary rows that render on the live site. Row text is safely escaped by React, but the `url` column is rendered directly as `href` in [WhatsNewCard.tsx:130](src/components/WhatsNewCard.tsx), so a `javascript:` URL in a forged row becomes a clickable script link on theeditai.co.uk. Today the URL's secrecy rests on the repo being private; the URL is also in `.claude/CLAUDE.md` and workflow logs.
- **Suggested fix:** Two small hardenings: (1) have `doPost` require a shared secret field in the JSON and reject without it (secret lives in the Routine payload and Apps Script properties, not the repo); (2) in `WhatsNewCard` (and `ToolCard` for consistency), only render the link when the URL starts with `http://` or `https://`.

### M4. Subscribers table accepts unbounded anonymous inserts

- **What/where:** Policy `Allow anonymous inserts` on `public.subscribers` is `WITH CHECK (true)` (confirmed live; also [supabase/migrations](supabase/migrations)). The client inserts `email`, `first_name`, `context`, `source`, `status` from [Subscribe.tsx:71](src/pages/Subscribe.tsx:71) and [FooterEmailCapture.tsx](src/components/FooterEmailCapture.tsx). Supabase's own security advisor flags this policy.
- **Why it matters:** Anyone with the anon key (i.e. anyone) can script inserts of junk rows at volume: fake emails, arbitrary `source`/`status` values, garbage `context`. That pollutes the subscriber list you will eventually mail. Secondary: the duplicate-key response (23505) lets an outsider test whether a given email is subscribed (enumeration). No SQL injection risk exists; supabase-js parameterises, and React escapes on render.
- **Suggested fix (keep it simple):** Add a `CHECK` constraint on email format and sensible length limits on the text columns, and restrict the `status`/`source` columns to known values (or set them via column defaults instead of from the client). A captcha is overkill for current traffic; revisit if spam appears. Any constraint change is a database change: run it deliberately, not as part of a code deploy.

### M5. Dependency vulnerabilities: 10 high, 0 critical, one actually reachable

- **What/where:** `npm audit`: 16 findings (10 high, 6 moderate). Production-graph highs: `react-router`/`react-router-dom` (open redirect / XSS via untrusted paths, installed 6.30.1), plus `glob`, `lodash`, `minimatch`, `picomatch`, `postcss`, `yaml`.
- **Why it matters (reachability checked, as requested):** The only one shipped to browsers is **react-router-dom**. Exposure is limited because all routes in [App.tsx](src/App.tsx) are static and no redirect targets come from user input, but it is in the bundle and the fix is a patch bump. The rest (ReDoS/prototype pollution in glob, minimatch, lodash, and the vite/esbuild/rollup dev-server findings) sit in build tooling and are not reachable from the production site.
- **Caveat added at wrap (2026-07-04):** this audit was run with `npm audit`, which reads `package-lock.json`. Per the 2026-07-03 decision, **bun is the package manager and `bun.lock` is canonical**, while `package-lock.json` is stale (Jan 2025), so the flagged versions may not match what is actually installed. Re-check with `bun audit` (or `bunx npm-check-updates`) before acting, and never run `npm audit fix` (it would rewrite the stale npm lockfile). The react-router-dom concern stands either way: `package.json` pins `^6.30.1` and the advisory covers all of 6.x below 6.30.3.
- **Suggested fix:** bump the affected packages via bun (`bun update react-router-dom` first), verify locally, deploy.

---

## Low priority / nice to have

### L1. Historic `.env` leak is real but defused

`.env` was committed by the Lovable bot in commit `92758b4` (Mar 2026) and deleted in `2d64ec3` (May 2026). It contained only the Supabase **anon** key and URL for project `htimtwbltcpupsjpkqlv`, which no longer exists in the account. The anon key is publishable-class anyway, the project is dead, and the repo is private. The Google Sheets API key has **never** been in git history (full-history pattern scan for Google/GitHub/OpenAI/Supabase token shapes found nothing else). No service-role key appears anywhere in code or history. **Action:** none required. If the repo is ever made public, scrub history first as a matter of hygiene even though the key is dead.

### L2. The Sheets API key is in the shipped bundle, by design; the restrictions are the control

[sheets.ts:26-29](src/lib/sheets.ts:26) reads the key from `import.meta.env.VITE_GOOGLE_SHEETS_API_KEY`. Correct pattern for this repo, but be clear: any `VITE_`-prefixed var is embedded in the public JS at build time. That is inherent to a client-side Sheets fetch and is fine **only while** the key is (a) referrer-restricted to `theeditai.co.uk/*` and (b) API-restricted to the Sheets API only. Neither is verifiable from the repo. **Manual checklist:** Google Cloud Console (jasminaziz1@gmail.com) → APIs & Services → Credentials → the key → confirm both Application restrictions (HTTP referrers) and API restrictions (Google Sheets API only). Item 2 in CLAUDE.md (separate localhost-scoped key; production key currently sitting in `.env.local`) remains open and correct as written.

### L3. Stale `supabase/config.toml`

[supabase/config.toml](supabase/config.toml) pins `project_id = "htimtwbltcpupsjpkqlv"` (the dead project) and declares `verify_jwt = false` for a `sheets` edge function that does not exist in the repo or the live project. Harmless today; a confusing trap later, and if a `sheets` function were ever recreated it would deploy unauthenticated. Update the project id or delete the file.

### L4. `target="_blank"` links without `rel`

15 external links across ToolCard, WhatsNewCard, MyStack, Learning, DesignKit, Stack, Index, Layout, Subscribe, CobaltZone open with `target="_blank"` and no `rel="noopener noreferrer"`. Modern browsers imply `noopener` for `target="_blank"`, so this is defence-in-depth plus referrer hygiene, not an active hole.

### L5. `lovable-tagger` still installed and running in dev

[vite.config.ts:4,15](vite.config.ts) runs `componentTagger()` in development mode, and `lovable-agent-playwright-config` drives [playwright.config.ts](playwright.config.ts). Dev-only, never in the production bundle, but they are third-party packages from retired infrastructure executing on your machine on every `npm run dev`. Remove both, plus the plugin line.

### L6. Workflow posture is good; two notes for the record

`append-whats-new.yml` is `workflow_dispatch` only: no `pull_request`/`pull_request_target` triggers, so fork-PR secret exposure does not apply, and the workflow uses no repo secrets at all (auth lives in the caller's PAT, correctly). The watchdog uses the built-in `github.token` with `permissions: actions: read`, which is minimal and right. Notes: the append workflow `cat`s the full payload into run logs (fine while the repo is private), and the whole chain's integrity currently rests on the Apps Script URL staying secret (see M3).

---

## Code quality observations

### Q1. The Submit a Tool form discards every submission

[Submit.tsx:16-19](src/pages/Submit.tsx:16): `handleSubmit` calls `setSubmitted(true)` and nothing else. No insert, no email, no fetch. The user is told "Thank you, I'll take a look" and their submission evaporates. This is the most important non-security finding in the audit: either wire it to a `submissions` destination (a Supabase table with the same INSERT-only pattern would fit the locked architecture) or remove the page until it works.

### Q2. Roughly 44 of 50 shadcn/ui components are dead code, dragging ~27 unused dependencies

An import scan found no consumer outside `src/components/ui/` for 44 components (accordion, button, card, dialog, form, table, sidebar, chart, calendar, carousel...). The pages use bespoke inline-styled elements instead. Worse, [App.tsx](src/App.tsx) mounts `<Toaster />`, `<Sonner />` and `TooltipProvider`, yet nothing in the app ever calls `toast()` or `useToast`, so two toast systems ship in the bundle unused. `src/hooks/use-toast.ts` duplicates `src/components/ui/use-toast.ts`. Deleting the unused ui files and their orphaned `@radix-ui/*`, `embla-carousel-react`, `recharts`, `react-day-picker`, `input-otp`, `vaul`, `cmdk` etc. dependencies would shrink install, audit surface (several M5 findings live in this tree), and cognitive load. This is Lovable scaffolding, same category as the removed StatusBadge.

### Q3. Bundle is one 988K JavaScript chunk

`dist/assets/index-*.js` is 988K with no route-level code splitting. The heavy contributors are `matter-js` (physics for [HomeGravity](src/components/HomeGravity.tsx)/[gravity.tsx](src/components/ui/gravity.tsx), homepage only) and `framer-motion`, loaded for every visitor on every page. Lazy-loading the homepage gravity component (`React.lazy`) and splitting routes would cut initial load materially, which also serves outstanding item 4 (PageSpeed).

### Q4. Lovable-era leftovers to sweep

- [README.md](README.md): still the Lovable boilerplate with `REPLACE_WITH_PROJECT_ID` links.
- `.lovable/plan.md`: tracked in git.
- Three lockfiles tracked: `package-lock.json`, `bun.lock`, `bun.lockb`. **Corrected at wrap:** bun is the documented package manager (2026-07-03 decision) and `bun.lock` is canonical; it is `package-lock.json` (stale, Jan 2025) and the legacy binary `bun.lockb` that should go, so nothing ever resolves against them by accident.
- [src/vercel.json](src/vercel.json): byte-identical duplicate of root `vercel.json`; Vercel only reads the root one.
- Playwright config + fixture with zero spec files; [example.test.ts](src/test/example.test.ts) is a placeholder asserting `1+1=2`.
- No Make.com references anywhere in the repo (clean retirement; the stale Make copy lives in the Sheet, already tracked as outstanding item 5).

### Q5. Inconsistent Sheets parsing between eras

[sheets.ts](src/lib/sheets.ts) has five near-identical fetchers. The newer `fetchDesignKit` resolves columns by header name (resilient to column moves); the Lovable-era `fetchTools`/`fetchWhatsNew`/others use fixed positions. One generic header-based fetcher would remove the duplication and make all tabs equally robust. Related: `supabase.from("subscribers" as any)` in both capture components shows [types.ts](src/integrations/supabase/types.ts) was generated before the table existed (and against the old project); regenerating types against `zsoczlgkyessfhobhtgu` removes the casts.

### Q6. Small consolidations

- Footer and Subscribe page duplicate the insert-and-branch-on-23505 logic; a tiny shared `subscribe(email, extras)` helper would keep the two in step.
- `slugify.ts` remains the single source of URL logic: no duplicates found. Good.

---

## Flag before building (requires keys, policies, or production config)

1. **Apps Script shared secret (M3):** edit the Apps Script under jasminaziz1@gmail.com to check a secret field, redeploy (same URL), add the secret to the Routine payload. Coordinate with the pending PAT replacement so the pipeline is only re-tested once.
2. **GA Consent Mode (M2):** code change in this repo, but confirm desired behaviour first (default denied vs. denied only until choice).
3. **Subscribers constraints (M4):** database migration on the live project. Run via Supabase SQL editor or migration, not from this repo's deploy path.
4. **Ops table separation (M1):** decision belongs with the ops-dashboard project. Do not change policies from here.
5. **Sheets key restrictions (L2):** manual verification in Google Cloud Console, jasminaziz1@gmail.com account.
6. **`npm audit fix` (M5):** a dependency change and deploy; run it as its own one-job session with local verification.
