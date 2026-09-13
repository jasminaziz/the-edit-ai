# Review: `design/site-map` branch, before merge to `main`

Date: 2026-09-13. Reviewer: site-reviewer pass, whole-branch, per `build-plan.md`'s
agent table ("once over the whole branch before the merge request").

Scope: `git log origin/main..HEAD` and `git diff origin/main...HEAD`, all eight
code commits (`36bce7d`, `89bc8a3`, `398d64c`, `40f7c5d`, `e17c7e3`, `1e74eb9`,
`108958a`, `002f3e6`) plus the docs/report commits. All three gate commands run
locally against the current worktree state.

## Verdict: safe to merge

No confirmed defect blocks this branch. `bunx tsc --noEmit`, `bun test` and
`bun run build` all pass clean (tails below). No route was added, removed or
silently broken; `src/App.tsx` has a zero-line diff. No visitor-facing string
was found that isn't traceable to an approved source (build-plan rulings or a
linked judgement/copy-proposal report). Two small items are named below as
non-blocking cleanups, and one process item (the claims register entry) is
Jasmin's, not code's, to close.

---

## Gate output (run myself, tails shown per the project rule against silent failure)

```
$ bunx tsc --noEmit
(no output, exit 0)

$ bun test
bun test v1.3.14 (0d9b296a)
 101 pass
 0 fail
 137 expect() calls
Ran 101 tests across 5 files. [39.00ms]

$ bun run build
✓ 2140 modules transformed.
dist/registerSW.js                     0.13 kB
dist/manifest.webmanifest              0.61 kB
dist/index.html                        5.15 kB │ gzip:   1.98 kB
dist/assets/index-DTZwLEi8.css        33.76 kB │ gzip:   7.64 kB
dist/assets/HomeGravity-01AX2_0j.js  221.59 kB │ gzip:  78.49 kB
dist/assets/index-B7zIb6fY.js        533.16 kB │ gzip: 171.31 kB
(!) Some chunks are larger than 500 kB after minification.
✓ built in 1.30s
```

101 passing matches the expected trajectory (96 at branch creation per
`build-plan.md`, +5 from the new `jobFromParam` suite in `sheets.test.ts`). The
chunk-size warning is the documented matter-js debt (`CLAUDE.md`, "Vercel
behaviours"), not a new failure. `vercel.json` is present and unchanged at the
repo root (`{"rewrites":[{"source":"/(.*)","destination":"/index.html"}]}`),
so the SPA catch-all is not at risk from this branch.

---

## Findings

### 1. SUSPICION, not exploitable today: `onRoute`'s prefix match has no word-boundary guard

**File:** `src/components/Layout.tsx:39-40`

```ts
const onRoute = (pathname: string, to: string) =>
  to === "/" ? pathname === "/" : pathname.startsWith(to);
```

This drives `isActive`, `isHubRoute`, `currentFor` and `updatePill` across the
whole nav. It is asked for by name in the brief ("route matching in `onRoute`
including prefix collisions such as a future route that starts with an
existing one"), so I checked it directly against the live route table
(`src/App.tsx:33-48`, unchanged by this branch): `/`, `/tools`, `/radar`,
`/stack`, `/ai-news`, `/whats-new`, `/my-stack`, `/learning`, `/submit`,
`/design-kit`, `/subscribe`, `/policy-template`, `/privacy-policy`,
`/terms-of-service`, `/cookie-policy`. None of these is a prefix of another
(the closest pair, `/ai-news` and `/whats-new`, share no prefix relationship),
so there is no live collision and nothing in this branch is mismatched today.

The risk is structural, not present: `startsWith` with no trailing-slash or
exact-match fallback means a future route such as `/tools-archive`,
`/my-stack-legacy` or `/ai-news-2027` would silently be treated as *under*
the existing `/tools`, `/my-stack` or `/ai-news` nav item the moment it is
added to `App.tsx`, the sliding pill would land on the wrong tab, the hub row
would show as current on an unrelated page, and `aria-current` would be set on
the wrong link, all with no build error and no test to catch it (there is no
test file for `Layout.tsx`'s routing logic; `src/test/` covers `sheets.ts`,
`SEO.tsx` and `slugify.ts` only).

**Recommended fix, if this is ever hardened:** `pathname === to || pathname.startsWith(to + "/")`.
Not urgent, nothing today triggers it, but worth doing in the same commit as
whichever future route would otherwise collide, or sooner if cheap.

### 2. SUSPICION / stale comment: the `?job=` deep link has no live caller in this branch

**File:** `src/pages/Tools.tsx:94-96`, `src/lib/sheets.ts:441-459`

The `?job=` matcher and its centring effect are built, tested (15 cases per
`build-plan.md` step 2, plus the 5 new unit tests) and correct on their own
terms, I re-verified `jobFromParam` against `toSlug` by hand and the round
trip holds for every entry in `CATEGORIES`, including the ampersand in
"Appeals & fundraising" and the case-insensitive match. But I could not find
any link in the codebase that actually sets `?job=` on `/tools`:

```
$ grep -rn "/tools?" src/
(no results)
```

The feature's own doc comment says it exists "so a link from elsewhere (the
homepage job chips, in the site map build) lands on the directory already
filtered", but the homepage job chips were step 4a, and 4a was dropped by
Jasmin's ruling the same day (`build-plan.md`, "Rulings, settled 13 September
2026", item 4a). So as merged, this branch ships a fully tested feature with
zero entry points: nothing on the site currently produces a `?job=` URL. Not a
defect (nothing is broken; a hand-typed or externally-linked `?job=` URL works
exactly as documented), but the comment is now inaccurate about where its
caller lives, and worth a one-line correction so the next reader doesn't go
looking for homepage chips that were never built on this branch.

### 3. Minor / pre-existing, not introduced by this branch: a stale line number in `.claude/CLAUDE.md`

**File:** `.claude/CLAUDE.md` (rewritten conversion block, "Live in code,
re-counted 2026-09-13"), citing `ToolCard.tsx:289`.

The actual line is `ToolCard.tsx:293`:

```
$ grep -n "Not sure what your policy" src/components/ToolCard.tsx
293:              Not sure what your policy should say? Start with the template.
```

Checked against `origin/main`: the wrong line number (289) was already there
before this branch (`git show origin/main:.claude/CLAUDE.md | grep ToolCard.tsx:289`
returns the same stale citation). This branch's rewrite of the surrounding
paragraph (dropping the count from five links to three) carried the stale
number forward rather than introducing it. Not blocking, but since the
paragraph was touched anyway, worth fixing in the same family of edits next
time this file is opened.

### 4. Process note: the site-stranger "after" report is on disk but not committed

**File:** `reports/2026-09-13-stranger-first-viewport-after.md` (untracked,
confirmed via `git status`).

This is the step-4 companion to the committed baseline
(`reports/2026-09-13-stranger-first-viewport-baseline.md`) and is exactly the
artefact `build-plan.md`'s agent table calls for ("`site-stranger` ... Step 0
(baseline), and again after step 4"). Its content is sound, I read it in
full and its own before/after table matches the code: hero height 800→662px
at 1280, wordmark ~81% of its old size, sector sentence moving from y=842
(below the 800px fold) to y=704 (inside it), nav item count 8→5, all
consistent with the `108958a` and `002f3e6` diffs. Its most load-bearing
finding, that the "How I work" hub puts Design, Learning and AI News two
clicks deep from the homepage for a confident-practitioner reader, against one
click on the old six-tab bar, is not a defect (that reader is the profile's
secondary audience, not the one the five-second test judges by) but it is a
real, named trade-off that should be visible to whoever signs off the merge.
Recommend committing this file before or alongside the merge so it isn't lost
from the record the way an untracked file can be.

### 5. Outstanding, not code: the claims register entry for the checks line

`build-plan.md` step 1's own "Done when" column: "the claims register updated
by Jasmin" is still marked not done ("**Not done until Jasmin adds the claims
register entry**"). The claims register lives outside this repo
(`~/.claude/steward/claims-the-edit-ai.md`) and per the project's own rule a
claim living on four surfaces (the checks line now renders on `/learning`,
`/design-kit`, `/ai-news`, `/my-stack`) needs an entry there. This is Jasmin's
action, not something a code session can close, and it doesn't block a code
merge, but it should not be forgotten once the branch lands.

---

## What I checked and found clean

- **`?tool=` / `?job=` interaction.** Both read `useSearchParams()` once and
  each is independently guarded (empty/unsluggable/unknown → `null`/no-op).
  If both parameters are present and the job filter would hide the named
  tool's card, the `?tool=` scroll effect's `querySelector` simply finds
  nothing and no-ops silently, this is the same behaviour already recorded
  in `build-plan.md`'s backlog ("`?job=` and `?tool=` in one link... Nothing
  generates such a link, so it is not fixed") and I found no place that
  generates such a combined link, so this is a known, accepted, currently
  unreachable edge case, not a new one.
- **Effect cleanup.** The `?job=` centring effect (`Tools.tsx:116-135`) guards
  its `document.fonts.ready.then(centre)` continuation with a `live` flag set
  false in the cleanup function, so it cannot call `scrollTo` on an unmounted
  page. The pill-measurement effect in `Layout.tsx` uses the equivalent
  `cancelled` flag pattern for the same reason. Both correct.
- **Pill measurement keyed by `to`.** `navItems` has four unique `to` values
  (`/`, `/tools`, `/policy-template`, `/my-stack` for the hub tab); `navRefs`
  is keyed by the same strings and only populated in the desktop branch, so
  there is no collision and no stale-ref risk from My Stack no longer being a
  standalone top-level item.
- **`aria-current` values.** `"page"` and `"true"` are both valid WAI-ARIA
  tokens for this attribute; the split (page on the exact link, true on the
  hub tab when a different hub page is current) matches the code comment and
  is a reasonable choice given `NavLink` cannot express "current section, not
  current page" on its own.
- **Sitemap.** `public/sitemap.xml` parses as valid XML, lists exactly the 11
  live, non-redirect, non-catch-all routes, `/submit` correctly absent, and
  `/submit` itself still renders (`App.tsx:41`, untouched).
- **Checks-line copy.** The string in `CobaltZone.tsx:296-303` is
  character-for-character the ruled string (`build-plan.md` ruling 2,
  candidate B1), and it renders only via the new `checksLine` boolean prop on
  exactly the four ruled pages (`DesignKit.tsx`, `Learning.tsx`,
  `MyStack.tsx`, `WhatsNew.tsx`); `Radar.tsx` and `Tools.tsx` do not pass it,
  so `/radar` keeps its own wording as ruled.
- **Contrast bump.** `CobaltZone.tsx`'s `bodyText` colour moved from
  `rgba(250,248,244,0.6)` (3.86:1) to `0.85` (6.24:1), matching both the
  commit and the CLAUDE.md ruling; the pre-existing failure this replaces was
  never a silent one, it's named directly in the same comment block.
- **Hero sizing.** `Index.tsx`'s diff is scoped entirely to the hero section;
  nothing else in the file changed, matching "4a dropped, 4b desktop-only."
  The `min(28vw,36vh)` / `min(38vw,49vh)` clamps correctly degrade to the old
  vw-only behaviour on portrait phones (the vh term only binds below roughly
  a 0.78 height:width ratio, as documented), consistent with the "portrait
  phones unchanged" claim.
- **DragHint cap.** `bottom: clamp(80px, 7.7vw, 100px)` (was 130), desktop
  only; mobile branch untouched.
- **No unauthorised copy.** Every new visitor-facing string I could find
  traces to a ruling or a linked report: "How I work" and the hub landing
  page (ruling 1), the checks line (ruling 2), "Template" as a tab label
  (`reports/2026-09-13-sitemap-proposal-judgement.md:44`). I found no string
  that looks authored in the branch without a paper trail.
- **No env, data-layer or Sheets change.** This branch touches no fetch
  function, no tab name, no column reference. `git diff` confirms zero lines
  changed in any `fetchX` function in `src/lib/sheets.ts` other than the new,
  additive `jobFromParam`.
- **`.gitignore` and doc-only commits** are exactly what they claim: ignoring
  `.claude/settings.local.json`, and report/CLAUDE.md prose.

---

## What I could not verify from the filesystem alone

- **The measured layout numbers in the rewritten CLAUDE.md** (514px of slack
  at 1040px, ~526px needed for the hub bar at `lg`, the hub row fitting
  without scrolling at 375, the pill sitting within 1px of the right tab on
  11 routes) are all stated as measured by the build session on cold
  Playwright loads. I did not re-render the branch in a browser to confirm
  them; I checked them for internal consistency against the code (e.g. the
  `h-14 sm:h-16` / `h-10` arithmetic for header height, which the
  `site-design-check` report also re-derived independently and matched) but
  did not re-take the screenshots. **Check:** if this matters before sign-off,
  re-run the branch's own Playwright captures in
  `~/Developer/the-edit-ai/.superpowers/site-map-boards/` at 1040 and 375.
- **Whether Radix's Dialog correctly hides the header's `aria-label="Main"`
  nav from assistive tech while the mobile drawer's own `aria-label="Main"`
  is open**, so that only one "Main" landmark is ever exposed at once. The
  `site-design-check` report asserts this from Radix's known behaviour but
  did not run a screen reader against it. **Check:** VoiceOver or the
  accessibility tree in Chrome DevTools with the drawer open on a phone
  viewport.
- **Vercel preview build status for this branch.** Preview deploys on this
  project are SSO-protected and carry no Sheets data by design (`build-plan.md`,
  "Review surfaces"), so I could not fetch or confirm a green preview build
  from here. The local build gate passed, which is the stronger signal per
  this project's own rule that Vercel build failures are silent, but the
  Vercel **Deployments tab** for `design/site-map` is the place to confirm
  before merge, since a local `bun run build` and Vercel's build of the same
  commit can in principle diverge (different Node/bun version, different env
  availability).
- **The hub row's actual fit at 375px and the "no scroll needed" claim**,
  and whether "My Stack · Design · Learning · AI News" wraps or truncates on
  the very smallest supported phone width (360px, which this project
  elsewhere treats as its narrowest case), not separately measured in any
  report I found; the closest figure is "fits without scrolling at 375."
  **Check:** render `/my-stack` at 360×the DragHint's own convention.

---

## Learnings

None proposed to `~/AI Work/cowork/PROJECTS/CHIEF OF STAFF/Claude Setup/LEARNINGS.md`
from this pass specifically, the one general pattern I found (finding 1,
string-prefix route matching with no boundary guard) is a real, generalisable
trap for any React Router nav that highlights by `pathname.startsWith(to)`,
but it did not fire in this branch (no live collision exists), so per the
"propose only what you actually hit" rule I am naming it here as a suspicion
rather than filing it as a learning against a guide section. If a future
route ever does collide, that is the moment to file it.

The `site-design-check` agent's proposed learning from earlier the same day
(the `checksLine`/`rightBadge` percentage-position interaction, already
appended to LEARNINGS.md per `reports/2026-09-13-design-check-nav-and-checks-line.md`)
stands; I have nothing to add to it, and confirmed it was already put to
Jasmin as unrated rather than assumed ratified.


---

## Note from the main session, 13 September 2026

Acted on before the merge request:
- **Finding 1 fixed** (`95a7302`): `onRoute` now matches a route exactly or a
  path beneath it after a slash. The step 3 check was re-run, 33 cold loads,
  all passing.
- **Finding 2 fixed** (`7872c90`): the `?job=` comment now says the link serves
  posts, the Substack and email, and that nothing on the site links to it yet.
- **Finding 3 not changed.** `ToolCard.tsx:289` is the `to=` line of that link
  (the `<Link` opens at 288, its label is at 293), so the citation points at the
  link as intended.
- **Finding 4 closed**: the after stranger report was committed as `73d624c`.
- **Finding 5** stays with Jasmin.

Two of the "could not verify" items were measured on the dev server: the hub
row fits at 360 with no overflow and the current item fully visible; and with
the phone drawer open, the page behind it is aria-hidden and Chrome's
accessibility tree exposes exactly one navigation landmark, "Main". The Vercel
preview for each push was checked READY through the Vercel API. Em dashes in
the draft were replaced before commit.
