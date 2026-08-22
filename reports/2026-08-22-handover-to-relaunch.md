# The Edit — Handover to Relaunch

**Written 22 August 2026.** This is the single briefing document for every
session that takes The Edit from where it is now to a live relaunched site.
Read it end to end before doing anything. Update section 2 and section 5 at
the end of every session.

Jasmin is away shortly and wants the build finished before she goes, with
auditing and refinement on her return. Plan accordingly: prefer finishing a
workstream over starting three.

---

## 0. How to use this document

1. Read this file.
2. Read `.claude/CLAUDE.md` in the repo. It is the operational source of
   truth and it outranks this file on anything technical.
3. Read `SCRATCHPAD.md` for the running session log.
4. Then start work from section 5.

Where this file and the repo conflict, the repo wins and this file gets
corrected. Where this file and `reports/2026-08-22-overhaul-audit.html`
conflict, this file wins: the audit is the strategy, written before the build,
and its implementation detail is stale.

---

## 1. What this project is

The Edit (theeditai.co.uk) was a general AI tools directory for marketing and
comms people. It is being re-pointed to an opinionated directory of AI tools
for communications teams in charities, cultural organisations and heritage.

The moat is not the list. It is the evaluation axis: for every tool, where the
data sits, whether it trains on input, whether there is a nonprofit tier,
whether typical use is likely to trigger a DPIA, and whether it can be
explained to a trustee in one sentence. Nobody else publishes that.

The site is a lead engine for the consultancy at jasminaziz.co.uk. The
consultancy serves "values-led organisations, including charity, heritage,
cultural and community organisations". The Edit deliberately says the narrower
thing. The consultancy is the broad tent; The Edit is the narrow door into it.

The funnel: directory attracts the sector buyer, the AI-use policy template
captures the email through a gated Substack post, the Substack builds trust,
"Work with me" converts.

---

## 2. State of play, as at 22 August 2026

**Live site (`main`, commit `47a0d1e`):** unchanged. Old positioning, 66 tool
rows, six tool-type categories, Supabase email form in the footer. Nothing
about the re-point is public yet.

**Branch `overhaul/sector-axis`:** eleven commits, `da7fe13` through
`88961d5`, pushed. Nothing merged.

Done on the branch:

- `fetchTools` rebuilt to read by header name via exported `parseToolRows`.
  Seven axis fields on the `Tool` interface. 19 vitest tests passing.
- `.claude/CLAUDE.md` fully rewritten for the re-point and placed.
- `.claude/schema.md` corrected.
- `README.md` rewritten. It previously shipped `npm install` instructions,
  which the project forbids, and old-brief positioning.
- All approved copy placed: homepage intro, homepage meta and JSON-LD, the
  static meta and OG tags in `index.html`, the PWA manifest, the About panel
  (new component), the tools page subheading and meta, the counter reframe.
- `/tools` canonical bug fixed. It pointed at a dead `/toolkit` route.
- Email capture swapped off Supabase entirely. Both write points gone.
- `/policy-template` page and route added. `/subscribe` redirects to it.
  `src/pages/Subscribe.tsx` is dead on disk, kept for the dead-code sweep.
- Nav points at `/policy-template` and reads "Get the template →". It
  previously read "Get the digest →", a digest that never existed.
- LinkedIn URL corrected to `https://www.linkedin.com/in/jasmin-r-aziz/`.

Not done: everything in section 5 except B2, closed in the 22 Aug evening
verification session: react-helmet-async injects on live (homepage canonical
count 1, `/tools` full-load canonical count 1, pointing at the known dead
`/toolkit` route exactly as expected on main). The placed SEO strings are not
inert and B4 is unblocked. Two new findings from the same session live in
SCRATCHPAD queue items 12 and 13: the live site redirects non-www to www
while every canonical is non-www (Jasmin's Vercel decision), and helmet tags
may go stale on SPA navigation (one trial, unverified).

Also done 22 Aug, late evening, same session: B4(a), per-page OG in
`SEO.tsx`, uncommitted on the working tree awaiting Jasmin's Mac-side check
and commit. And a queue item 11 escalation: the Lovable registry mirror
403'd on multiple packages during a sandbox frozen install — reproduce from
a neutral network; if real, cold Vercel builds are exposed today. Details in
SCRATCHPAD.

**The Sheet:** 66 rows in `tools`, untriaged. Columns G to M do not exist yet.

---

## 3. Where everything lives

### Repo, `~/Developer/the-edit-ai`

| File | What it is |
|---|---|
| `.claude/CLAUDE.md` | Operational source of truth. Stack, data layer, automation mechanics, rules. |
| `.claude/schema.md` | Per-tab Sheet schemas including the G to M axis columns. |
| `SCRATCHPAD.md` | Running priority queue and session log. Update every session. |
| `reports/2026-08-22-overhaul-audit.html` | The rebuild brief. Strategy canonical, implementation stale. |
| `reports/2026-08-22-claude-md-rewrite-draft.md` | The approved CLAUDE.md draft. Already placed. Historical. |
| `reports/2026-08-22-copy-pack-draft.md` | The approved copy pack. Already placed, and amended in the placement session. Historical: the placed strings are the truth, not this file. |
| `reports/2026-08-22-ai-use-policy-template-draft.md` | The policy template first draft. Awaiting Jasmin's edit. |
| `reports/2026-08-22-cowork-project-seed.md` | Project instructions seed. Historical. |
| `reports/2026-07-04-security-audit.md` | Security audit. Findings still partly open. |
| `reports/site-gates-2026-08-05.md` | Accessibility, performance, SEO, observability audit. Mostly parked. |

### Google

- **Sheet:** `1RIO-WY9H75gML_UgdQbHGgDl-R0MfaG3CRPUp3PtAUI`. Tabs: `tools`,
  `my_stack`, `design_kit`, `learning`, `whats_new`. Content changes go live
  immediately with no deploy.
- **Account split:** `hello@jasminaziz.co.uk` (Workspace) owns Search Console,
  GA4 and Cloud Console. `jasminaziz1@gmail.com` (personal) owns the Sheets
  API key and the Apps Script. Confirm which applies before touching anything
  Google-authenticated.
- **Training suite**, Drive folder `1CzEvlPyrMtQvUyxWDGk0j4oT0vQFfZ3V`:
  `BNJC_AI-Training-Day-Plan_v1.md`, `_v2.md`,
  `BNJC_Leadership-AI-Session_v1.md`. All BNJC-branded, facilitator-only.
  These are the source material for the policy template. There is no
  standalone policy document anywhere; the template is being written, not
  scrubbed.

### Notion

- **"The Edit — gate the AI-use policy template behind an email capture"**,
  the task page. Note: it claims the template is already built. It is not.
- **"AI Governance Desk"** is a DIFFERENT PROJECT. It is Jasmin's career
  transition into AI governance (ERA, GovAI, BlueDot). It carries a protected
  break to 25 October 2026 and a disclosure rule keeping Jewish and
  antisemitism framing out of anything published from it. Do not pull material
  from it into Edit work without asking. The one exception already agreed: the
  five-step frame from Position 4, "Minimum viable governance for
  deployment-edge institutions", is the spine of the policy template.

### Channels

- Live site: theeditai.co.uk (canonical is non-www, never add www)
- Consultancy: jasminaziz.co.uk
- Substack: jasminaziz.substack.com (Jasmin's own publication, NOT a separate
  Edit publication, and the copy says "my Substack" for that reason)
- LinkedIn: https://www.linkedin.com/in/jasmin-r-aziz/
- Rundown daily Routine: `trig_01288KFUKoGh4wWrewE7JqC2`, lives in claude.ai
  Routines, fires 8am UK
- Fortnightly checks task: a desktop task in the Cowork app

---

## 4. Locked decisions, do not relitigate

- **Positioning is "charities, cultural organisations and heritage."** Not
  "values-led organisations". Asked and answered 22 Aug: the axis is
  sector-specific (trustees, nonprofit tiers, DPIA), the search demand sits on
  "charity", and values-led re-widens toward the general directory the row
  ceiling exists to prevent. The consultancy site says values-led. The Edit
  says the narrower thing. That layering is deliberate.
- **The row ceiling is 45.** Target roughly 40. Any new row past the ceiling
  displaces an existing one. Never widen back toward general AI tools.
- **Machines maintain facts, Jasmin owns judgement.** Data location, training
  policy, nonprofit tier and pricing may be maintained by automation with
  sources. The DPIA flag, the trustee note and the verdict are never written
  by any automation or agent session.
- **Three or four "judged, not recommended" rows stay public** (DeepSeek,
  Grok). The axis made visible. Not a licence to pad.
- **No cadence is promised anywhere on The Edit.** The old site promised a
  fortnightly digest that never existed. See item D3 for the complication.
- **Capture is a gated Substack post.** No email infrastructure gets built.
  The Supabase `subscribers` table takes no new writes and stays as a
  historical record.
- **Voice is unchanged by the re-point.** UK English, contractions, no em
  dashes anywhere including meta tags and OG titles, no inline quote marks in
  verdicts, "your stack" not "my stack", verdicts name the catch.
- **Code sessions place approved strings. They never author visitor-facing
  copy.** Copy is written with Cowork Claude and arrives as exact strings.
- **Canonical base is `https://theeditai.co.uk`, no www.**
- **New buttons on cream grounds are cobalt `#2D35C9` with `#FAF8F4` text.**
  Lime `#C8F04A` stays on dark grounds and is never a category colour or badge.
- **Nothing merges to `main` without Jasmin's explicit sign-off.**

---

## 5. What happens next

Owner column: **J** means only Jasmin can do it. **S** means a session can do
it. **J+S** means a session drafts and Jasmin decides.

### A. Content and the axis — the critical path

| # | Task | Owner | Status |
|---|---|---|---|
| A1 | **Lock the evaluation axis.** Ninety minutes with audit section 3. The seven fields, their allowed values, the Green/Amber/Red definitions, the trustee-note format. Amend, then freeze. Everything below depends on it. | J | Not started |
| A2 | Add headers `jobs`, `data_location`, `trains_on_input`, `nonprofit_tier`, `dpia_flag`, `trustee_note`, `last_checked` to cells G1:M1 of the `tools` tab. Safe any time; main's fetcher ignores them. | J | Not started |
| A3 | **Row triage.** One pass through the 66 rows against the locked axis: keep, cut, or judged-not-recommended. Delete the cuts. Roughly 21 of 66 are developer tooling (Cursor, Windsurf, Replit and similar) which belongs on My Stack, not in the buyer-facing directory. | J | Not started |
| A4 | **Fact research for the top ten rows.** Data location, training policy on the specific tier, nonprofit tier, pricing, each with a source link. A session can do this and hand over a table. | J+S | Not started |
| A5 | **Verdict sprint.** Rewrite the top ten verdicts against the axis, including the public failures. This is the tone-of-voice change made real: the old verdicts speak to a general reader, the new ones name the sector catch. Jasmin writes these. | J | Not started |
| A6 | Fill `dpia_flag` and `trustee_note` for the same ten rows. Never automated. | J | Not started |

### B. Code

| # | Task | Owner | Status |
|---|---|---|---|
| B1 | Create the localhost Sheets API key. Cloud Console as `jasminaziz1@gmail.com`, restricted to the Sheets API and referrer `http://localhost:8080/*`, then replace `VITE_GOOGLE_SHEETS_API_KEY` in `.env.local`. Without it local dev renders but every page 403s. | J | Not started |
| B2 | **Verify react-helmet-async actually injects tags.** Done 22 Aug (evening session, real Chrome via the desktop bridge). Homepage canonical count 1, `/tools` full-load canonical count 1. Both non-zero, closed. Full numbers and two new findings (www redirect, possible SPA-navigation staleness) in SCRATCHPAD items 10, 12 and 13. | J | **Closed 22 Aug** |
| B3 | **ToolCard and filters session.** Render the axis fields on the card, DPIA flag as a text-labelled chip (never colour alone), nonprofit tier as a highlighted line, trustee note inside the expanded verdict. `CATEGORIES` becomes the six comms jobs with contains-matching for multi-tagged tools. Three sector toggles above the grid: Has nonprofit pricing, Doesn't train on your content, DPIA green. Needs B1 and two or three filled rows from A4. Needs two CTA strings authored first (see C4). | S | Not started |
| B4 | **SEO repairs.** (a) per-page OG in `SEO.tsx`: **done 22 Aug** (late evening session) — og:title/og:description/og:url plus twitter:title/twitter:description derived from the existing props, 5 new tests, suite 24/24, tsc clean; verified in the cloud sandbox against a fresh resolve, so run `bunx tsc --noEmit && bun test` on the Mac before committing (uncommitted at wrap). (b) meta for `/submit` and `/stack`: needs Jasmin to author the strings first (visitor-facing copy rule). Full notes in SCRATCHPAD. | S | (a) done, uncommitted; (b) waits on strings |
| B5 | New `og-image.png`. The current one carries the old brand message. Design work, not code. | J | Not started |
| B6 | **Decide the Submit form.** It silently discards every submission (`handleSubmit` only flips state). Either wire it to a destination or pull the page. Do not relaunch with a form that bins what people send it. | J+S | Not started |
| B7 | Dead-code sweep: `src/pages/Subscribe.tsx` (now unrouted), `StatusBadge.tsx`, roughly 44 unused shadcn components, `lovable-tagger`, `bun.lockb`, `package-lock.json`. Optional before relaunch. | S | Not started |

### C. The capture layer

| # | Task | Owner | Status |
|---|---|---|---|
| C1 | **Edit the policy template draft.** `reports/2026-08-22-ai-use-policy-template-draft.md`. Known gaps flagged in it: no training section despite step five of the frame promising one; section 7 (where AI does not belong) is deliberately unfinished and needs a real list; consider adding retention/deletion of chat histories and a line on copyright in AI-generated images. | J | Draft delivered |
| C2 | **Decide the template's brand** and produce the branded file. The Edit (cobalt, Chillax) or the consultancy (ochre, Source Serif 4). Currently credited to Jasmin as consultant with The Edit as the channel. Also decide the format: the copy promises a document "written to be adapted", so an editable file matters more than a beautiful PDF. | J | Not started |
| C3 | **Publish the gated Substack post** that delivers the template, and confirm the whole flow works from a clean browser. Until this exists, the footer, the nav and `/policy-template` all point at nothing. This is the hard blocker on the merge. | J | Not started |
| C4 | Author two CTA strings the ToolCard session needs: the in-grid template card after the first six tools, and the line under every Amber or Red DPIA flag ("Not sure what your policy should say? Start with the template"). | J+S | Not started |

### D. Cross-channel reference wording

Everything below currently describes The Edit in the old positioning. All of
it should change at or just after the merge, not before, so nothing points at
a site that does not match.

| # | Task | Owner | Status |
|---|---|---|---|
| D1 | **Consultancy site.** jasminaziz.co.uk currently says: "A live working inventory of the AI tools I use in practice, with first-person verdicts on each one." That is the old brief. Replace with the sector directory and the evaluation axis. Keep the consultancy's own "values-led organisations" framing; only the Edit description changes. | J+S | Not started |
| D2 | **Substack about page.** Currently describes the publication as "The AI newsletter for people who don't read AI newsletters" and "a weekly Substack for humans who already use AI quietly and want to use it properly". That is the old horizontal audience. The Edit will now send charity comms leads there expecting sector material. Decide whether the Substack re-points too, or whether The Edit's copy should stop implying it will. Also update its description of The Edit as "a live AI tools directory". | J | Not started |
| D3 | **The cadence contradiction.** The Edit deliberately promises no cadence. The Substack it sends people to publicly promises weekly. Either the Substack drops the weekly claim, or The Edit is quietly relying on a promise made elsewhere that may not be kept. Decide which. | J | Not started |
| D4 | **LinkedIn.** Profile featured section, about text, and any pinned post describing The Edit. Same rewrite as D1. | J | Not started |
| D5 | **Launch announcement.** A post explaining the re-point and why a smaller directory is the product. The "no tool appears until it has been through the checks" line does the work. | J | Not started |

### E. Automations

| # | Task | Owner | Status |
|---|---|---|---|
| E1 | **Trim the fortnightly Cowork task to flag-only.** Do this first, before anything else in this section. It currently writes tool rows against the old brief, so every fortnight adds rows the triage has to delete. Flag-only means it still sweeps and reports to Jasmin but writes nothing to the Sheet. Two minutes in the Cowork app. | J | Not started |
| E2 | **Rebuild it as the checks engine.** Its job becomes: re-fetch the sources behind the fact fields for every live row, update them with a source link, stamp `last_checked`, and where a factual change touches a judgement field, flag it and write nothing. | J+S | Not started |
| E3 | **Re-point the Rundown daily Routine.** One prompt edit changes the extraction rule from "up to 5 stories" to "only stories touching tools in the directory or the sector: nonprofit programmes, data and training policy changes, regulation, accessibility". Zero-story days become correct behaviour. Do NOT pause this Routine; it writes dated rows and gaps are painful to backfill. | J | Not started |
| E4 | **Revoke PAT 16554137.** Named in the Routine prompt and in transcripts. GitHub never sees it (the sandbox proxy strips it), so it is exposure with no function. Security item, open since July. | J | Not started |
| E5 | Rewrite the Routine prompt's dispatch step to use the GitHub MCP tool `actions_run_trigger` and delete the curl instructions and the PAT from it. | J | Not started |
| E6 | Paste the dedupe and shared-secret code into the Apps Script. Delete the duplicate 3 and 6 July `whats_new` batches from the Sheet by hand. | J | Not started |
| E7 | Optional, after relaunch: collapse the pipeline. script.google.com is reachable from the Cowork cloud environment (verified 22 Aug, redirect behaviour still unverified). If it verifies, both writers become task to Apps Script to Sheet, and the GitHub relay and its watchdog get deleted. Changes nothing a visitor sees. | S | Not started |

### F. Relaunch

| # | Task | Owner | Status |
|---|---|---|---|
| F1 | **The counter blocker.** The homepage now reads "Passed the checks" over "tools that passed the checks", above `tools.length`. With 66 untriaged rows and empty axis columns that is untrue. A3 must be done before the merge, or the counter must change. This is the single item that would embarrass publicly. | J | Blocking |
| F2 | **Relaunch check.** The live site reads sector-first on every surface reachable in two clicks. Every visible row has its axis fields. The gate delivers the template end to end from a clean browser. Rows without completed fields stay hidden, so the site relaunches smaller and grows back verified. | J+S | Not started |
| F3 | **Merge to `main`.** Only with Jasmin's explicit sign-off, and only when she has a clear day afterwards to watch the deploy. Vercel builds silently: a failed build serves the last good deploy, so check the Deployments tab if nothing changes within five minutes. | J | Blocked on C3, F1 |
| F4 | Then D1 to D5, in any order. | J | Blocked on F3 |

### G. On return, the audit pass

- Rolling re-verdicts for the remaining keep-rows, roughly 25 at 15 to 20
  minutes each. Rows stay hidden until done.
- Gates-audit debt: five AA contrast failures (worst are nav text and StackBar
  text on periwinkle at 2.47:1 and 2.75:1), heading-level skips, two `<h1>`s
  on the homepage, `matter-js` shipping on every route.
- GA4 consent mode. The cookie banner records a choice nothing reads.
- Dependency bumps through bun. Never `npm audit fix`.
- `bun.lock` resolves `react-helmet-async` from a Lovable-era private registry
  mirror. Availability risk if that mirror stops serving, including on Vercel.
- Confirm the mobile header fix from 11 August on a real iPhone. Still
  unverified, still needs a device.

---

## 6. Working rules for any session

- Start with `git checkout overhaul/sector-axis` and confirm with
  `git rev-parse --abbrev-ref HEAD`. Never work on `main`.
- One job per change. Before editing, state what must not be touched.
- Never run `npm install` or `npm audit fix`. `bun.lock` is canonical and
  `package-lock.json` is stale. Use bun for everything.
- Never author visitor-facing copy. It arrives as approved strings.
- Never write `dpia_flag`, `trustee_note` or any verdict from a session.
- Hex codes and pixel values, never vague adjectives.
- The production Sheets key is referrer-locked and 403s from localhost and
  from Vercel preview URLs. Verify data logic with vitest or the localhost
  key, never previews.
- Update `SCRATCHPAD.md` and section 2 and 5 of this file at every wrap.

---

## 7. Open questions

1. ~~Does react-helmet-async inject anything?~~ Answered 22 Aug: yes, it
   injects on live. B2 closed, B4 unblocked. Two successor questions from the
   same measurements: which host is primary, www or bare domain (SCRATCHPAD
   item 12, Jasmin's Vercel decision), and does helmet go stale on SPA
   navigation (item 13, needs a second measurement).
2. Which brand does the policy template carry? See C2.
3. Does the Substack re-point, or does The Edit stop implying it will? See D2
   and D3.
4. Wire the Submit form or pull the page? See B6.

---

*Written 22 August 2026 against the live repo, the live Sheet, the live
consultancy site and the live Substack. Commit hashes and row counts verified
same day.*
