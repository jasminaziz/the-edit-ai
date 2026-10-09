# Prompt for the next code thread: after the geo merges

Written 9 October 2026 at the end of the session that built `geo/crawl-meta`
and finished `geo/prerender-2026-10`. Paste everything below the line into a
new Claude Code thread in `~/Developer/the-edit-ai`.

---

Read `.claude/CLAUDE.md` in full first, especially "Branch discipline",
"Crawlability and GEO", "Routes and canonical URLs", the design system and
"Codebase conventions". Then read the newest entries at the end of
`SCRATCHPAD.md` (the three headed 2026-10-09) and
`reports/site-gates-2026-10-09.md`.

**Re-read before you rely on it.** Branch tips and shared files move while you
work. Check `git fetch` and `git status -sb` in the shared tree before stating
the state of anything, and re-read a shared file immediately before quoting it.

## Where things stand (as at 9 Oct 2026, verify each line)

- `geo/crawl-meta` (tip `c475d50` when written): the crawl and meta fixes, Sheet
  fetch logging, route-level `lazy()` (main chunk 534 to 472 kB), the directory
  watchdog (`.github/workflows/directory-watchdog.yml` plus
  `scripts/check-directory.ts`), the keyboard focus fix (`under-rail`), the
  `?tool=` deep-link landing fix, the lint fixes (`bun run lint` exits 0), the
  Organization schema exemption and the nav named exception in CLAUDE.md.
- `geo/prerender-2026-10` (tip `b039f0f` when written): build-time prerender of
  every route, green on Vercel. Unknown paths get `404.html` with `noindex` and
  a real 404 status; there is no catch-all rewrite any more.
- Neither is merged. Jasmin merges to production herself. If either branch is
  still unmerged, stop after reading and ask her what she wants; do not merge.

## If the branches have been merged: prove production

The merge order is `geo/crawl-meta` first, then `geo/prerender-2026-10`, whose
`vercel.json` is taken whole in the conflict (it carries crawl-meta's three
308 redirects byte for byte). Check that is what happened: `vercel.json` on
`main` must have the three `redirects`, the prerender `buildCommand` and the
per-route `rewrites`, and no `/(.*)` catch-all.

Then, against `https://theeditai.co.uk`, with curl and no JavaScript, and never
trusting a status code on its own:

1. Every sitemap route returns 200 with real body text inside `#root`, its own
   `<title>`, its own `og:title` and its canonical. The three legal pages now
   carry their own titles.
2. `/nope-xyz`, `/tools/nope` and `/Tools` return 404 with
   `noindex, follow`. `/stack`, `/whats-new` and `/subscribe` return 308 to
   `/tools`, `/ai-news` and `/policy-template`.
3. `robots.txt`, `sitemap.xml`, `manifest.webmanifest` and
   `/AI-Use-Policy-Template.docx` serve as their own content types.
4. The live bundle contains a string the merge introduced (for example
   `under-rail`), since a Vite bundle hash does not compare across
   environments.
5. The service worker is still self-destroying (`/sw.js` contains
   `unregister`).

Record the results with the date in `SCRATCHPAD.md`.

## Then, in this order, one commit each

1. **Directory watchdog.** It needs a `SHEETS_API_KEY` repository secret. Ask
   Jasmin whether she has added it; never enter or handle the key yourself.
   Once it is there and the workflow is on `main`, ask her to trigger it once
   with `workflow_dispatch` (or ask before triggering it yourself) and read the
   run's log: it should print `OK: <n> complete rows`.
2. **Re-run the measurements the merge changes**, recorded with dates in
   `SCRATCHPAD.md`: PageSpeed mobile on `/`, `/tools` and `/my-stack` (the
   pre-merge baseline is in SCRATCHPAD: Performance 74 to 80, LCP 4.0 to 4.6s).
   The keyless PageSpeed API quota ran out on 9 Oct; the website worked when
   started in the in-app browser and read headless. Read any animated or
   rendered measurement only with frames running, never in a hidden pane.
3. **Lighthouse accessibility on the seven templates never measured**:
   `/design-kit`, `/learning`, `/ai-news`, `/policy-template`, `/submit`, one
   legal page and the 404. The homepage's 95 is the named nav exception only.
4. **Ask Jasmin whether to run site-geo again.** Its 9 Oct report could not
   score a single page because the served HTML was empty; with the prerender
   live it can. That is an agent run, so dispatch the named agent and report
   what it did.

## Waiting on Jasmin (do not do these; remind her)

- Sign-off of the legal-page titles and descriptions, placed on
  `geo/crawl-meta` as drafts. A concern was raised that "UK GDPR" ends the
  privacy description as a fragment.
- Search Console under hello@jasminaziz.co.uk with the sitemap submitted, an
  uptime monitor, VoiceOver on `/` and `/tools`, and axe.
- Verdict prose in the served HTML: ruled "left for now" on 9 Oct.
- The shared tree holds another session's uncommitted work, including a
  `SCRATCHPAD.md` line that duplicates the staleness line committed on
  `geo/crawl-meta`. One copy needs dropping once both land. Not yours to edit.

## Working rules

- Work in your own worktree, never the shared tree:
  `git worktree add ../the-edit-ai-<name> origin/<branch>`. Do not switch
  branches or stash in `~/Developer/the-edit-ai`. Remove the worktree when
  done.
- bun only, never npm. Add no new dependencies without asking.
- Never push to `main` or `overhaul/sector-axis` and never merge. Push with
  `HEAD:<branch>` and confirm `git rev-parse origin/<branch>` matches `HEAD`.
  Before any push, run
  `git -C ~/Developer/the-edit-ai log origin/<branch>..<branch>` and surface
  anything unpushed.
- Before every commit run `bun run build`, `bun run lint`, `bun run test` and
  `bunx tsc --noEmit`, and show their tails, not a grep.
- UK English, no em dashes. Code sessions place copy; they never author
  visitor-facing strings unless Jasmin asks for a draft to approve.
- The canonical host is the bare domain; the Sheets referer is the one www
  exception. The audience phrase never shortens to "charity" alone. Do not add
  llms.txt or recommend schema as GEO work.
- Verify relationships, not existence, and prove every guard in both
  directions: force the failure and watch it fire.
- At the end, give the preview or production evidence, one line per commit,
  and the rulings still waiting on Jasmin.
