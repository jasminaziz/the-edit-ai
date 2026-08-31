# Mobile, functionality, SEO/GEO and hygiene: findings

Written 31 August 2026 against `main` at `34458f9`, as an investigation pass
with nothing changed.

**Status after Jasmin said "do all" (same session).** Everything in the
unblocked list at the foot of this document was then actioned, in eight
commits, one job each: the dead-code sweep (six commits), the matter-js
lazy-load, and the doc corrections across `.claude/CLAUDE.md`, `SCRATCHPAD.md`
and `tasks/lessons.md`. **Nothing in the "needs a ruling" list was touched**,
and no visitor-facing copy, judgement field or Sheet cell was written.

Two things changed as the work went in, and the body below is left as first
written rather than retro-fitted. The sweep grew a sixth commit when a grep
showed the two toast systems were genuinely never invoked, which made my own
draft correction to SCRATCHPAD wrong and the original entry right. And the
`sm` versus `lg` filter-rail discrepancy resolved in the code's favour:
`ffcc6e9` moved it deliberately on 29 August to stop a horizontal scroll
between 640 and 739px, so ruling 9 below is answered and the doc was simply
behind.

Gate baseline, taken before any of the work below: `bunx tsc --noEmit` exit 0;
`bun test` 83 pass / 0 fail across 4 files; `bun run build` succeeds, 792.06 kB
JS (260.76 kB gzip), one chunk, the known matter-js size warning. **I wrote none
of those 83 tests**, so the count is an independent baseline rather than my own
work counted back at you. The gate was re-run before every one of the eight
commits and the final state is recorded at the end of this file.

Every claim below is either a file:line, a measured number, or a production
reading with a second confirming signal. Where I could not close something I
say so rather than approximating it.

---

## The headline: two findings that were not in the brief

### 1. Every `<SEO>` page carries **duplicate** meta tags, and the wrong one is first

This is the most consequential thing I found and it is not in any project doc.

`index.html` declares `description`, `og:title`, `og:description`,
`twitter:title` and `twitter:description` statically. `SEO.tsx` emits the same
five per page. **react-helmet-async appends its tags; it does not replace static
tags it never created.** So both survive, and the static homepage copy sits
*first* in document order.

Measured on production, `/tools`, with the pane painting frames:

| tag | 1st in DOM (`data-rh` absent) | 2nd in DOM (`data-rh` present) |
|---|---|---|
| `meta[name=description]` | 177 chars, "An opinionated AI tools directory…" | 175 chars, "Curated AI tools for…" |
| `meta[property=og:title]` | "The Edit \| AI Tools for Charity…" | "AI Tools Directory for Charity & Heritage Comms \| The Edit" |
| `meta[property=og:description]` | 177, homepage copy | 175, page copy |
| `meta[name=twitter:title]` | homepage copy | page copy |
| `meta[name=twitter:description]` | 177, homepage copy | 175, page copy |

Same shape on `/`: two descriptions, 177 static and 193 injected, different
strings on one page.

`canonical` and `og:url` are **not** duplicated, because `index.html` declares
neither — helmet is their only source. `og:image` and `og:type` are correctly
single, from the static block only. So the half of the split design that
CLAUDE.md describes works exactly as intended; it is the other half that
misfires. The doc says the static block "remains the fallback for scrapers that
do not run JS". In practice it is not a fallback, it is a co-resident, and a
consumer taking the first match gets the homepage description on seven routes.

**Ruling needed.** The fix is a decision, not a keystroke: either strip the five
duplicated tags from `index.html` (which removes the no-JS fallback the doc
deliberately kept), or have `SEO.tsx` own and overwrite them. Both change a
documented, deliberate split. I have not touched it.

### 2. Three live routes and the 404 ship no meta at all

`PrivacyPolicy.tsx`, `TermsOfService.tsx` and `CookiePolicy.tsx` all render
through `LegalPage.tsx`, which contains no `Helmet` and no `SEO` (confirmed:
their only import is `LegalPage`, and `LegalPage.tsx` has no meta of any kind).
`NotFound.tsx` imports only `react-router-dom` and `react`.

So those four pages emit **no title, no description and no canonical**. All
three legal routes are listed in `public/sitemap.xml`. Titles and descriptions
are copy, so this is a proposal, not a change — but note the canonical is not
copy and is currently absent on three indexed URLs.

---

## Job 1. Mobile

Driven at 360×780 with touch emulation active (Pixel 8 UA, `maxTouchPoints` 5).

**The homepage hero at 360px is the real defect.** Settled state, identical at
0s, 3s and 6s, so this is where the physics comes to rest, not a transient:

- 19 pills render. **15 of them overlap the `<h1>` bounding box.**
- **7 sit above y=56**, i.e. behind the nav bar.
- One has `top: -42` — entirely off the top of the viewport.
- All pills come to rest within the top 402px; the bottom 206px of the hero
  holds none.

The screenshot bears this out: "The Edit." is barely legible under four layers
of pills. On desktop the same 18 spread across 1280px and the wordmark reads
cleanly. `MAX_PILLS = 18` at `HomeGravity.tsx:73` has no mobile branch. **This
is your open ruling on a mobile cap, and it now has evidence behind it rather
than a hunch.**

**Hero height.** `min-h-[78vh]` gives a 608px hero at 360×780. The wordmark ends
at y=276, leaving **332px — 55% of the hero — below it**, holding the drag hint
and nothing else. Your open ruling; that is the number.

**What is fine, measured not assumed:**

- No horizontal page scroll at 360px (`documentElement.scrollWidth` 360 =
  `innerWidth` 360). The wordmark's 9px `scrollWidth` overrun is the deliberate
  `-0.04em` optical inset and stays inside the viewport; nothing is clipped.
- About header clamp behaves exactly as documented: 30px, 3 lines at 360px. The
  arithmetic checks out — `4.6vw - 7 = 30` at 804.3px, so the floor binds below
  ~804px as the doc says.
- The breakpoint contract holds. All five `useIsMobile` consumers are chrome
  (nav switch `Layout.tsx:87`, counter size `Index.tsx:239`, pill sizing
  `HomeGravity.tsx:63-64`, drag hint, plus dead `ui/sidebar.tsx`). Nothing
  consults both systems.
- The 768–1086px "Work with me" bug stays fixed: at 800px the nav is the mobile
  hamburger and no nav link overflows.
- No card was stuck inverted. At 800px a card *looked* stuck cobalt in a
  screenshot; `data-selected` was `null` on every card and exactly one card
  matched `:hover` — the physical pointer resting on it after a resize. That is
  the fixture trap in `lessons.md`, not a bug, and I am flagging that I nearly
  wrote it up.

**Could not close, and not approximated:**

- **Real on-device touch on the ToolCard.** I could not drive a single tap. The
  browser pane goes hidden between calls in this session; screenshots still
  capture but `left_click` times out with "the Browser pane is currently
  hidden". Touch emulation was active and ready; the input path was not
  available. The pointer-events fix remains unverified against a real finger.
- **A real 360px device.** Emulated only.
- **Rotation against the matter-js canvas.** Not attempted; needs a real device.

---

## Job 2. Functionality

**Template download: verified, and the trap is real.** Measured by
content-type and byte count, never by status code:

| URL | code | content-type | bytes |
|---|---|---|---|
| `/AI-Use-Policy-Template.docx` | 200 | `…wordprocessingml.document` | **21,711** |
| `/AI-Use-Policy-Template.pdf` | 200 | **`text/html`** | **3,071** |
| `/llms.txt` | 200 | **`text/html`** | **3,071** |

3,071 bytes of `text/html` is the SPA shell — the exact byte size of
`dist/index.html`. That is the reliable fingerprint for "this file does not
exist" on this site. Every route, including `/nonexistent-page-xyz`, returns the
same 3,071 bytes with a 200.

**Nothing links the PDF.** The only two mentions in the tree are explanatory
comments: `PolicyTemplate.tsx:84` (accurate — it says the source PDF lives at
`reports/AI-Use-Policy-Template.pdf`, and it does, 142,558 bytes) and a comment
in `robots.txt`. Confirmed clean.

**The CTA labels: there are five, not four.** All identical, so the rule holds,
but the inventory in CLAUDE.md is short by one:

1. `Layout.tsx:145` (mobile nav) 2. `Layout.tsx:226` (desktop nav)
3. `FooterEmailCapture.tsx:61` 4. `PolicyTemplate.tsx:106` (the download)
5. **`Tools.tsx:265`** — not named in the doc.

`ToolCard.tsx:213` is a sixth link to `/policy-template` with a deliberately
different label, gated to Red, and its comment explains why. Correct as is.

**Sheet data: 23 rows render, and the site agrees with the Sheet.** Two
independent counts matched exactly: applying `isComplete()` to the live `tools`
tab (67 data rows, 14 headers A–N) gives **23**; `document.querySelectorAll('.tool-card').length`
on production gives **23**. DPIA distribution matched too — Amber 19, Green 1,
Red 3, from the Sheet and from `[data-flag]` in the DOM. Job chips, the three
toggles, the DPIA chips and `Checked <date>` all render.

**New content finding: 8 of the 23 rendering rows have an empty `what_it_does`.**
Blotato, Ideogram, Granola, Submagic, Seedance, Gemini, Gamma, Grok — exactly
the batch-two eight from `reports/2026-08-28-batch2-judgement-drafts.md`. They
got their judgement fields and never got column N. `ToolCard.tsx:111` guards
with `&&` so no empty hole renders, but the card loses the line it is meant to
lead with, and `Tools.tsx:68` searches that field, so those eight are less
findable. **Yours to write — it is on the never-automate list.**

**Row 40 rename still half done, as documented.** `tools` row 40 reads "Gemini
Notebook" with `notebook.google.com`; `L40` still opens "NotebookLM only ever
sees the documents we choose to upload…". Unchanged, still yours.

---

## Job 3. SEO and GEO

Beyond the two headline findings:

**Meta description overruns — the brief's three, plus a fourth that matters
more.** Against a ~155 character snippet limit:

| page | chars | what truncation loses |
|---|---|---|
| `/` (`Index.tsx:58`) | **193** | "…checks already done. No sponsored lists." |
| **`index.html` static** | **177** | "…l. No sponsored lists." |
| `/tools` | **175** | "…done on every card." |
| `/design-kit` | **168** | "…final check." |
| `/submit` | 159 | "…ngs." |

The static 177 is the fourth, and given finding 1 it is the string that actually
gets read first on seven routes. On both homepage strings the sentence lost is
**"No sponsored lists"** — the differentiator. The three-part audience phrase
sits at roughly character 21–45 in every case and survives truncation intact, so
it is not what is costing you the space. Any rewrite is copy and comes to you.

**Canonicals and sitemap: clean.** Every canonical in the code is bare-domain
`https://theeditai.co.uk`; production returns 200 on the bare host and 308s www
to it. `sitemap.xml` is 11 bare-domain URLs, no `lastmod`, no `changefreq`,
redirects absent. Cross-checked **both directions** against `App.tsx`: every
`<loc>` has a route, every page-rendering route has a `<loc>`, and the only
absentees are the three redirects and the catch-all.

**Structured data: valid.** The homepage JSON-LD parses (`JSON.parse` clean),
renders once, and is well-formed `schema.org/WebSite`. Two observations, both
judgement calls:

- `author.url` is `https://theeditai.co.uk` — the Person's URL points at The
  Edit rather than at jasminaziz.co.uk. For an answer engine trying to connect
  the two properties, that is the one link that would do it, and it currently
  points back at itself.
- `url` is `https://theeditai.co.uk` while the canonical is
  `https://theeditai.co.uk/`. Cosmetic.
- No `ItemList` on `/tools`. That is the largest GEO opportunity on the site and
  it is a build, so it needs a ruling before anyone starts.

**Soft 404s.** Every unknown URL returns 200 with the homepage's title and
description. Google will class these as soft 404s; an answer engine will read
them as the homepage. Related to finding 2 — the 404 page has no meta of its own
to distinguish itself.

**`og-image.png` is 474,794 bytes (463.7 KiB)**, measured on production and on
disk. Large for a scraper fetch but within every platform's limit (Facebook and
X cap at 5 MB, LinkedIn 5 MB). Not urgent; worth a re-export if you are in there
anyway.

**`llms.txt` genuinely absent** (3,071-byte SPA shell, as above), while
jasminaziz.co.uk has one. Proposal only, per your instruction. My view, for what
it is worth: finding 1 is the higher-value fix, because an `llms.txt` describing
the site correctly does not help while seven routes are also serving the
homepage's description as their first meta tag.

**One thing worth banking, and it nearly cost me a false report.** My first
production read of `/tools` returned zero `[data-rh]` nodes, no canonical, no
JSON-LD and the homepage title — the exact artefact signature in `lessons.md`,
confirmed by `innerWidth: 0`. I checked the source before writing it up:
`HelmetProvider` is correctly wired at `main.tsx:7`. The mechanism, which the
lesson records as a correlation but not a cause: **react-helmet-async commits its
DOM changes inside `requestAnimationFrame`, and a hidden pane fires zero
frames.** An `await` on a rAF loop in that state never resolves at all — mine hit
the 45s timeout, which is itself the proof. Force a paint (a screenshot will do
it), then read. After that the same page returned `innerWidth: 1280`, the correct
per-page title, the correct canonical and 7 `[data-rh]` nodes. This is worth
adding to `lessons.md` as the cause behind the existing entry.

---

## Job 4. Docs and code

**Stale, confirmed against the tree or production:**

- `.claude/CLAUDE.md:326-327` — "the `.pdf` sits at `/AI-Use-Policy-Template.pdf`,
  unlinked". It does not; the file is not in `public/` and the URL serves the SPA
  shell. `PolicyTemplate.tsx:84` already describes the true state correctly.
- `.claude/CLAUDE.md:325` — "**Keep all four labels identical**". There are five.
- `.claude/CLAUDE.md` — "the filter rail set to always wrap at `sm` and up (F2c)".
  **The code is `lg`.** `Tools.tsx:152` reads
  `flex-nowrap overflow-x-auto … lg:flex-wrap lg:overflow-visible`. Confirmed by
  render: at 800px the rail is still `nowrap`, `scrollWidth` 1084 against
  `clientWidth` 704. So the whole 640–1023px band scrolls where the doc says it
  wraps. At 360px it overflows by 756px with only 2 chips fully visible; the 40px
  gradient fade is present and correct, so the affordance exists.
- `SCRATCHPAD.md:2653` — "og-image.png: still not started". It exists (474,794
  bytes) and `index.html` wires it at both `og:image` and `twitter:image`.
- `SCRATCHPAD.md:48` — "988K single chunk". It is now **792.06 kB**.

**Accurate, checked rather than assumed** (every file:line in CLAUDE.md I could
test): `AboutPanel.tsx:108`, `Tools.tsx:250`, `PolicyTemplate.tsx:46`,
`ToolCard.tsx:262` ("Say this to your board"), `FooterEmailCapture.tsx:35`
("your board will ask") and `Layout.tsx:258` all verify verbatim.
`src/utils/slugify.ts` is gone. Nothing in `src/` imports Supabase. Sheet is 67
rows, 23 complete, 0 complete rows with an empty verdict — all as documented.

**SCRATCHPAD.md is 2,716 lines.** An archive split is worth doing; I have not
proposed a cut line because that is a call about what you still want in front of
you. Nothing should be deleted.

**Dead code, measured by transitive reachability from `main.tsx`:** 89 modules,
**40 reachable, 49 unreachable**.

- Outside `ui/`: `src/pages/Subscribe.tsx`, `src/integrations/supabase/client.ts`,
  `src/integrations/supabase/types.ts`, and **`src/components/NavLink.tsx`** —
  that last one is not named in any project doc. (`vite-env.d.ts` also shows
  unreachable; it is a type declaration and must stay.)
- Inside `ui/`: **44 of 51** unreachable. Only 7 are live: `animated-counter`,
  `gravity`, `sheet`, `sonner`, `toast`, `toaster`, `tooltip`.
- **Two `use-toast` files that differ**: `src/hooks/use-toast.ts` is live via
  `toaster.tsx:1`; `src/components/ui/use-toast.ts` is dead.
- `matter-js` reaches the bundle only through `ui/gravity.tsx` → `HomeGravity`
  → `Index`. Homepage only, confirmed. `matter.min.js` is 83,476 bytes, so
  roughly **10.5% of the 792 kB bundle** ships to every route to serve one hero.
- `package-lock.json` still present and stale; `bun.lock` canonical.

---

## What needs a ruling from you

1. **The duplicate meta tags.** Strip the five from `index.html`, or have
   `SEO.tsx` overwrite them. Either way you are changing a documented split.
2. **Meta descriptions.** Four rewrites (193, 177, 175, 168) plus `/submit` at
   159 if you want it. Copy, so yours.
3. **Title and description for the three legal pages and the 404.** Copy.
4. **`llms.txt`** — build or not.
5. **`ItemList` structured data on `/tools`**, and whether `author.url` should
   point at jasminaziz.co.uk.
6. **Mobile `MAX_PILLS` cap** — the 360px evidence is above.
7. **Hero `min-h-[78vh]`** — 332px of empty hero at 360px.
8. **The mobile wordmark string** — still needs approved copy.
9. **The filter rail breakpoint** — is `lg` right and the doc wrong, or the
   reverse?
10. **`what_it_does` for the batch-two eight** — yours to write.

## What I would do without a ruling, on your word

The doc corrections in Job 4 (six stale statements), as separate commits, one
job each. The dead-code sweep. Lazy-loading matter-js. Adding the
`requestAnimationFrame` mechanism to `lessons.md`. None of these touch copy,
judgement fields or the Sheet.

---

## Final state after the work (31 August 2026)

Eight commits on `main`, `34458f9` to `8cdd9db` plus this file's own update.
The three-command gate was re-run before every one of them and is clean at the
end: `bunx tsc --noEmit` exit 0, `bun test` 83 pass / 0 fail across 4 files,
`bun run build` succeeds.

| | before | after | change |
|---|---|---|---|
| main JS chunk | 792.06 kB | **520.66 kB** | −34% |
| main JS, gzip | 260.76 kB | **167.94 kB** | −36% |
| CSS | 69.84 kB | **30.83 kB** | −56% |
| CSS, gzip | 12.92 kB | **7.13 kB** | −45% |
| PWA precache | 845.10 KiB | **757.72 KiB** | −10% |
| `src/components/ui/` | 51 files | **4 files** | −47 |

`HomeGravity` is now a separate 220.93 kB chunk fetched only on `/`, confirmed
in both directions against the built `dist/`.

None of this was taken on a passing typecheck alone. Verified on the built
output: `/`, `/tools`, `/my-stack`, `/policy-template` and `/privacy-policy`
all render, `/tools` shows 23 cards and 23 DPIA chips, the homepage draws its
18 pills and its "tools that have been through the checks" counter, and the
policy CTA still points at `/AI-Use-Policy-Template.docx` with its `download`
attribute intact. The only console errors were service-worker registration
failures caused by my own restarts of the preview server; `sw.js` and
`registerSW.js` both serve 200 from `dist/`.

**Still not done, and still needing you:** all ten ruling items above except
number 9, which the `ffcc6e9` history answered. Nothing visitor-facing was
written, no judgement field was touched, and no Sheet cell was changed.

**Not pushed.** Every commit is local. `main` is the live site and a push is
public in about three minutes, so that call is yours.
