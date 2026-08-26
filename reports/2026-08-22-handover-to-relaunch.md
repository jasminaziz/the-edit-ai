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

**Branch `overhaul/sector-axis`:** pushed, nothing merged. Eleven commits
`da7fe13` through `88961d5` from the 22 Aug sessions, then three doc commits on
23 Aug, then the eight B3 commits `54e8a6a` through `aabc6f2` (23 Aug, this
Mac). Test suite went 24 to 56.

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

**The Sheet:** roughly 66 rows in `tools`, untriaged. **Columns G to M now
exist:** the A2 headers were added 23 Aug and verified independently through
the Drive connector, which read row 1 as name, category, status, cost,
verdict, url, jobs, data_location, trains_on_input, nonprofit_tier,
dpia_flag, trustee_note, last_checked. That same read parsed 67 data rows
rather than 66; the connector is flaky enough that this is a glance-at-it
during A3, not a correction. Seed rows are Jasmin's to add and must be
confirmed in the Sheet before any session builds against them.

**Re-read 23 Aug, late.** The headers are there. **No seed rows exist: G
through M are empty on every row**, so nothing passes the completeness
predicate, the grid renders nothing and the counter reads 0, all correct
behaviour. Every row emitted all thirteen cells, so this is a positive read
of emptiness rather than truncated trailing blanks. The row count read 67
again; two reads agree but both came from the Drive connector, so treat 67
as likely and confirm by eye during A3. Note for any session planning a
verification: `sheets.googleapis.com` is blocked from both the cloud sandbox
and the device shell, so the Drive connector is the only Sheet read path a
session has, and the localhost key can only be exercised in Jasmin's own
browser.

**As at 25 August 2026.** Sheet re-verified directly, two Drive reads: 67 rows,
4 complete, 12 at five of seven missing only K and L, 5 at three of seven, 2 at
two of seven. Twelve flags and twelve trustee notes take the grid from 4 to 16
and clear the ten-row floor. Three axis rulings taken: `None` is recorded for
the five vendors publishing no nonprofit programme, with an evidence standard
going into the axis file; `trains_on_input` gains `Unclear`, which costs no code
because the toggle predicate is an allowlist and completeness only tests for
non-empty; and a session may draft trustee notes with Jasmin supplying the flag.
**The four entries already in column L are verdicts, not trustee notes**, so
they are rewrites rather than a pattern to copy, and the originals move to column
E. Microsoft Copilot is ruled **Amber**, with the web-grounding nuance carried by
the trustee note rather than the chip. Still unruled: the radar's location and
whether the ceiling of 45 counts published rows. The capture track moved: C1 is
done as v2, C2 is built as two `.docx` variants, and C3's post and welcome email
are drafted. **Jasmin deferred the template's line-by-line review to one final
check before launch.**

**As at 26 August 2026.** Sheet re-read through a second instrument, the live
Sheets API on the localhost key rather than the Drive connector, and it agrees:
**67 rows, 15 complete, 52 hidden**, with 19.1KB of the 39.8KB payload being
verdict text on rows that never render. `my_stack` holds **19** rows, not the 21
in schema.md. **F2c is measured** at 1280 and 1366 in both scroll states and
reproduces everywhere; the 24 Aug reading turned out to be the compact scrolled
state, not the desktop one, which means the 23 Aug wrap finding was never an
artifact. **B3 closes at ten of ten.** The policy template took three edits, a
spacing audit and five spacing fixes, and **the brand PDF now exists** at
`reports/AI-Use-Policy-Template.pdf`, rendered here from the brand-font `.docx`
once Jasmin connected her Fonts folder, so Word and Font Book are no longer on
the critical path. It sits in `reports/` and not `public/` until the content is
signed off. **A5 is drafted**, all fifteen, at
`reports/2026-08-26-a5-verdict-drafts.md`, and the open question is answered:
the existing verdicts do not clear F2, so the merge follows the verdict sprint.
Four rulings are outstanding: the F2c treatment, the radar tab, Build Your Own
Stack, and the pills. **A fifth was taken and closed the same day: the site's
identity.** The Edit is a comms resource first, with a compliance edge, now in
CLAUDE.md with the three-slot split between the axis, the verdict and the
trustee note. Nothing was committed to `src/`.

**The axis:** locked 23 Aug. `reports/2026-08-23-axis-locked.md` is the frozen
spec and outranks audit section 3 on all allowed values and definitions. The
A1 decision sheet is historical now that its rulings are settled.

**B3: built, NOT finally verified.** The eight commits above deliver the whole
of B3 against the locked spec, tsc clean and 56/56 at every commit. But no row
in the Sheet passes the completeness predicate yet, so the directory currently
renders empty and the counter reads 0, and every browser check ran against a
throwaway browser-side fixture rather than real data. The code is trustworthy;
the claim that it works on the real Sheet is not yet earned. The re-run
checklist is in the B3 row of section 5. **F2 cannot be signed off until those
checks have been repeated against real Sheet data.**

Confirmed same session, correcting this document: the localhost Sheets key
works. Live tool names rendered from the real Sheet on the homepage hero. B1 is
done.

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
| `reports/2026-08-22-copy-pack-addendum.md` | Approved exact strings for C4 and B4(b), plus the B6 decision and spec. Live until placed, then historical. |
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
- **No second, general, rebranded directory.** Asked and answered 23 Aug.
  The roughly 21 developer rows A3 removes move to My Stack rather than being
  lost, so there is nothing to rescue. A general directory carries no
  evaluation axis and therefore no moat, generality needs a row count one
  person cannot keep checked, and a mainstream audience is traffic the
  consultancy cannot sell to. The cost is the permanent maintenance load, not
  the build. A broader impulse belongs in the Substack decisions D2 and D3,
  not in a second product.
- **Nothing merges to `main` without Jasmin's explicit sign-off.**

---

## 5. What happens next

Owner column: **J** means only Jasmin can do it. **S** means a session can do
it. **J+S** means a session drafts and Jasmin decides.

### A. Content and the axis — the critical path

| # | Task | Owner | Status |
|---|---|---|---|
| A1 | **Lock the evaluation axis.** Done 23 Aug (Cowork sitting). Twelve rulings taken, all adopted: `Your tenant` added as a sixth `data_location` value, one DPIA flag per row (never compound, cautious on boundaries), `last_checked` in DD MMM YYYY, trustee notes stored bare and first person plural, toggle pass rules fixed, chip colours signed off including the forest green reuse. Frozen spec is `reports/2026-08-23-axis-locked.md` and it now outranks audit section 3 on values and definitions. | J | **Locked 23 Aug, amended 25 Aug (three amendments: `Unclear` for training, a `None` evidence standard, and `Research` added to `jobs`)** |
| A2 | Add headers `jobs`, `data_location`, `trains_on_input`, `nonprofit_tier`, `dpia_flag`, `trustee_note`, `last_checked` to cells G1:M1 of the `tools` tab. Safe any time; main's fetcher ignores them. **Done. Headers confirmed in the Sheet 23 Aug and re-confirmed by a second read the same night: row 1 of `tools` reads name, category, status, cost, verdict, url, jobs, data_location, trains_on_input, nonprofit_tier, dpia_flag, trustee_note, last_checked.** | J | **Done 23 Aug** |
| A3 | **Row triage.** One pass through the 66 rows against the locked axis: keep, cut, or judged-not-recommended. Delete the cuts. Roughly 21 of 66 are developer tooling (Cursor, Windsurf, Replit and similar) which belongs on My Stack, not in the buyer-facing directory. **Done 24 Aug.** 20 keeps, 3 public failure rows, 8 to My Stack, 36 to the radar, so **23 published rather than the ~40 assumed**. Nothing deleted: cuts go to the radar, which is the tracker the hidden-row mechanic already provides. Decision list at `reports/2026-08-24-a3-triage-decision-list-v2.xlsx`. | J | **Done 24 Aug** |
| A4 | **Fact research for the top ten rows.** Data location, training policy on the specific tier, nonprofit tier, pricing, each with a source link. A session can do this and hand over a table. **Done 24 Aug for every published row**, not just the top ten. Sourced working in `reports/2026-08-24-a4-fact-pass-seed-rows.md` and `reports/2026-08-24-a4-fact-pass-published-rows.md`; twelve rows pasted the same day. Two rows are blocked because `trains_on_input` has no value for a vendor that publishes no position; five wait on the `None` versus not-published ruling. | J+S | **Done 24 Aug** |
| A5 | **Verdict sprint.** Jasmin's four original column L entries are preserved at `reports/2026-08-25-preserved-column-L.md` as source material: they were verdicts written into the trustee-note column, and column E already holds a different real verdict on each of those four rows, so merging the two is this task. Rewrite the top ten verdicts against the axis, including the public failures. This is the tone-of-voice change made real: the old verdicts speak to a general reader, the new ones name the sector catch. Jasmin writes these. **All fifteen drafted 26 Aug at `reports/2026-08-26-a5-verdict-drafts.md`,** as proposals with the reasoning shown against the locked definitions, under the 25 Aug drafting rule. **The open question is answered: the existing fifteen do not clear F2's sector-first test, and not marginally.** None names a charity, a trustee, a funder, a supporter or a beneficiary; four address the consultancy's buyer rather than the site's; several are My Stack's first person singular; the nonprofit tier never appears in a verdict; Copilot's never names the catch that made it Amber; and DeepSeek, a public failure row, reads as a buying case. **So the merge follows the verdict sprint rather than preceding it.** **The first pass was wrong and Jasmin stopped it:** every verdict had become a governance note. A ToolCard already renders five governance elements, so a sixth in the verdict makes the card say one thing six times and never say whether the tool is any good. The audit settles it, since the seven fields were added because the verdict could not answer adoption questions, so **A5 is an audience change, not a subject change**. **Identity ruled 26 Aug and placed in CLAUDE.md: The Edit is a comms resource first, with a compliance edge.** The axis filters and gates, the verdict recommends, the trustee note is the sentence for the board, and governance enters a verdict only where it is the reason to use or avoid that tool. Voice ruled: first person where it is earned evidence, second person for the recommendation. Sector translation ruled: the job is sector-specific, the tool assessment is not. Second pass written to the same file with the spec and the error recorded. | J | **Second pass drafted 26 Aug, awaiting Jasmin's editing pass** |
| A6 | Fill `dpia_flag` and `trustee_note`. **Done 25 Aug for eleven rows, plus four trustee-note rewrites. The grid renders 15, verified against the completeness predicate: 2 Red, 12 Amber, 1 Green, no invalid values.** The rule changed to get here: Jasmin extended session drafting from trustee notes to flags, on a draft-with-reasoning-for-sign-off basis. **Nothing reaches the Sheet without her explicit sign-off, but a session may now propose all three judgement fields.** | J+S | **Done 25 Aug** |

### B. Code

| # | Task | Owner | Status |
|---|---|---|---|
| B1 | Create the localhost Sheets API key. Cloud Console as `jasminaziz1@gmail.com`, restricted to the Sheets API and referrer `http://localhost:8080/*`, then replace `VITE_GOOGLE_SHEETS_API_KEY` in `.env.local`. Without it local dev renders but every page 403s. **Confirmed done 23 Aug** by the B3 session: real Sheet data rendered on localhost:8080. | J | **Done** |
| B2 | **Verify react-helmet-async actually injects tags.** Done 22 Aug (evening session, real Chrome via the desktop bridge). Homepage canonical count 1, `/tools` full-load canonical count 1. Both non-zero, closed. Full numbers and two new findings (www redirect, possible SPA-navigation staleness) in SCRATCHPAD items 10, 12 and 13. | J | **Closed 22 Aug** |
| B3 | **ToolCard and filters session. BUILT 23 Aug, NOT finally verified.** Eight commits, `54e8a6a` through `aabc6f2`, one job each, tsc clean and green at every one; suite 24 to 56. Delivered: `isComplete()` in `sheets.ts` driving both the grid and the homepage counter; `dpia_flag` canonicalised so a near-miss value (`Amberish`) fails completeness rather than rendering a chip with no label; the three toggle pass rules extracted as tested predicates so `Varies by tier` cannot quietly start passing; the seven axis fields on the card with all twelve microcopy strings placed verbatim; jobs chips replacing the legacy category chip; `CATEGORIES` as the six comms jobs with case-insensitive contains-matching; the three toggles as `aria-pressed` buttons, cobalt on cream; the approved filter empty state, shown only when a filter is active; and both C4 strings. **The CTA renders as `Get the template →`, with the arrow, on Jasmin's explicit ruling of 23 Aug — the addendum banks it without one. Do not strip it back off.** **Why not verified:** no Sheet row passes the predicate, so every browser check ran against a throwaway fixture. **Re-run checklist, once the seed rows are in — do not reconstruct this, and do not run it against a fixture:** (1) the grid shows exactly the complete rows and Descript does not appear; (2) the homepage counter equals the number of cards on screen; (3) all three DPIA chips render their locked colours, and hold them on the hovered cobalt card; (4) a job filter returns multi-job tools as well as single-job ones; (5) a row with `Varies by tier` fails the training toggle; (6) `Has nonprofit pricing` excludes every `None` row; (7) C4(b) appears under Amber and Red and never under Green; (8) the template card sits after the sixth card and vanishes under any active filter; (9) all four `Get the template →` labels are identical; (10) an empty filter combination shows the approved string, not "Back to Home". | S | **CLOSED 26 Aug at ten of ten.** Item 8 verified against fifteen real rows: 16 grid items with the template card at position 7, and it disappears under an active filter. Item 1 passes read against the corrected expectation, since Descript is complete now and should appear. The fourth `Get the template` label confirmed identical by source inspection, `Layout.tsx:142` against `Layout.tsx:224`. Prior status follows. **Verified 24 Aug against real Sheet rows: 9 of 10 pass.** Item 8's first half (template card after the sixth card) needs seven complete rows and waits for the ten-row floor; its second half passes. Chip hover verified structurally (inline styles, no hover rule targets them) rather than with a pointer. Three of the four `Get the template →` labels confirmed identical; the fourth is the mobile nav, which renders only with the menu open at a narrow width. Full result in SCRATCHPAD, 24 Aug. |
| B4 | **SEO repairs.** (a) per-page OG in `SEO.tsx`: **done 22 Aug** (late evening session) — og:title/og:description/og:url plus twitter:title/twitter:description derived from the existing props, 5 new tests, suite 24/24, tsc clean; verified in the cloud sandbox against a fresh resolve; the Mac check was then run against `bun.lock` (tsc clean, 24/24) and it is **committed** as `869dc5f`. (b) meta for `/submit` and `/stack`: **done and committed 22 Aug** as `6b7b221`. All four approved strings placed verbatim via the `SEO` component. Stack.tsx bypasses the Layout chrome, so its placement was verified in-browser rather than assumed: the app-level `HelmetProvider` covers it and both tab titles resolve correctly on a forced reload. **B4 is now fully closed.** | S | Closed. (a) `869dc5f`, (b) `6b7b221` |
| B5 | New `og-image.png`. The current one carries the old brand message. Design work, not code. | J | Not started |
| B6 | **Decide the Submit form.** Decided by Jasmin 22 Aug (night): keep the page, swap the form for an email link to `hello@jasminaziz.co.uk`. No new infrastructure, nothing gets binned. Implementation spec in `reports/2026-08-22-copy-pack-addendum.md` (follow the FooterEmailCapture link-block pattern); any new visible copy comes back to Jasmin first. **Implemented and committed 22 Aug** as `e3e1add`. No new visitor-facing copy was needed: the CobaltZone heading and subheading already carry the invitation, so the email address itself is the only visible text in the block, and it reuses the old submit button's exact classes, colours and hover. The form's dead code (FormField, the state hooks, handleSubmit, handleChange) is left in place for B7. | J+S | Done, `e3e1add` |
| B7 | Dead-code sweep: `src/pages/Subscribe.tsx` (now unrouted), `StatusBadge.tsx`, roughly 44 unused shadcn components, `lovable-tagger`, `bun.lockb`, `package-lock.json`. Optional before relaunch. | S | Not started |

### C. The capture layer

| # | Task | Owner | Status |
|---|---|---|---|
| C1 | **Edit the policy template draft.** `reports/2026-08-22-ai-use-policy-template-draft.md`. Known gaps flagged in it: no training section despite step five of the frame promising one; section 7 (where AI does not belong) is deliberately unfinished and needs a real list; consider adding retention/deletion of chat histories and a line on copyright in AI-generated images. **Done 25 Aug, then revised to v3 after a governance sense-check: `reports/2026-08-25-ai-use-policy-template-v3.md`. Fourteen sourced findings applied, including the Article 35 attribution, the Article 28 contract as the real dividing line in the section 6 tier ladder, the Article 34 duty to tell affected people, and a serious-incident report to the Charity Commission, OSCR or CCNI, which was the biggest sector gap. Two items held for Jasmin: a provenance confirmation on the Article 9 clause, and a placed approved string on `/policy-template` that carries the same DPIA overclaim the review caught in the post. v2 at `reports/2026-08-25-ai-use-policy-template-v2.md`; the 22 Aug draft is untouched as the audit trail.** All gaps closed: new section 10 on training, built from Jasmin's own published position that the event is not the thing; a real eleven-item exclusion list in section 7 replacing six bracketed blanks; a retention block in section 6 covering chat histories as records; new section 11 on images, rights and attribution; plus a closing "If you get stuck" block carrying the email, which is the only route back to Jasmin on a forwarded copy. Old sections 10 to 13 renumber to 12 to 15. Three lines await Jasmin at the final check: the "community none of us belongs to" exclusion, the "composite face in a fundraising appeal" sentence, and the copyright claim in section 11, which is the only genuine legal claim in a document that says it is not legal advice. | J | **v3 25 Aug. Reviewed 26 Aug, two calls outstanding.** Both held lines stay unchanged, reasoning in the 26 Aug SCRATCHPAD entry. Section 5's Article 9 list is confirmed clean of anything from the AI governance project: two Article 9 mentions in the file, no `9(2)`, no inference-of-belief framing. Suggested addition, one phrase: **trade union membership**. **Found unasked: section 12 closes on the claim that this is the law rather than regulator guidance, attached to the ICO's two-factor screening test, which the ICO itself calls not a strict rule.** Article 35(1) and 35(3) are the law; the trigger test is guidance. Jasmin's to rule. Three edits also applied 26 Aug: lime rule below the title block, headings to Plus Jakarta Sans, template version number removed. Removing the version forced a rewrite of the section 15 sentence that explained the version collision, and **that rewrite is unapproved**. |
| C2 | **Decide the template's brand** and produce the branded file. The Edit (cobalt, Chillax) or the consultancy (ochre, Source Serif 4). Currently credited to Jasmin as consultant with The Edit as the channel. Also decide the format: the copy promises a document "written to be adapted", so an editable file matters more than a beautiful PDF. **Decided and built 25 Aug: The Edit brand (cobalt, Chillax), `.docx` primary with a PDF secondary.** The PDF question was Jasmin's and improved the answer: once the PDF carries the proof job, the `.docx` body font can be chosen purely for reliability. Two variants exist because both brand fonts are CDN webfonts with no font files anywhere in the repo: `reports/AI-Use-Policy-Template.docx` (Calibri, the one subscribers download) and `reports/AI-Use-Policy-Template-brand-fonts.docx` (the one Jasmin opens in Word and exports the PDF from). Eleven pages, lime rule over the cobalt title, cream callout for the closing block, Appendix A as a one-page form. **Unverified: whether Chillax is actually installed in Word on Jasmin's Mac.** If it is not, the brand variant is useless and the PDF becomes the safe variant exported. | J+S | **Built 25 Aug. PDF exists as of 26 Aug, spacing fixed, final review pending.** Jasmin connected her Fonts folder, so the brand PDF now renders here through LibreOffice with Chillax and Plus Jakarta Sans installed: **Word and Font Book are off the critical path.** 12 pages, Appendix A on one page verified against the render, fonts embedded and subsetted. A spacing audit found four faults and one dead numbering definition, all fixed: 31 hand-typed numbered items became real Word lists sharing the bullets' marker column at x=81.1 with all text at 100.1, tables went from 10.1/29.4 to 21.1/21.4, sub-headings got 12pt above, lists close at 7pt. **Licence checked: PDF embedding is explicitly permitted, all fonts carry `fsType = 0x0000`, so the PDF stays unencrypted, and self-hosting the webfonts in `public/` post-launch is permitted after all.** The PDF is in `reports/`, not `public/`, until the content is signed off. |
| C3 | **Publish the gated Substack post** that delivers the template, and confirm the whole flow works from a clean browser. Until this exists, the footer, the nav and `/policy-template` all point at nothing. This is the hard blocker on the merge. **Copy drafted 25 Aug at `reports/2026-08-25-copy-pack-c3-substack.md`, marked draft rather than approved.** **Finding: C3 is two pieces of copy, not one.** `/policy-template` links `SUBSTACK_SUBSCRIBE_URL`, the subscribe page rather than a post, and the placed copy promises the link straight away, so the **Substack welcome email** is what actually delivers the template. An unconfigured welcome email fails silently: the site looks correct right up until a real person subscribes. Both the post and the welcome email are drafted, with no cadence promised in either because D3 is open. **Decided 25 Aug: the files live at public URLs on theeditai.co.uk (`public/`, served by Vercel), linked straight from the welcome email and also from the post.** The subscribe is the gate; post attachments were rejected because they require a Substack login and lose the subscriber who taps the link on a phone. Accepted cost: the file could be hotlinked. | J+S | **Drafted 25 Aug, blocked on the template being final.** **Gate 2 finding, 26 Aug: a missing file will never 404.** `vercel.json` rewrites `/(.*)` to `/index.html` and Vercel serves `public/` before applying rewrites, so a file that exists serves correctly and a file that does not returns **200 with `text/html`**. Confirmed on the dev server: the `.docx` returns 200 and 21437 bytes matching disk, the `.pdf` also returns 200 and no PDF exists. **So the clean-browser test has to check content type and file size, not that the link resolves**, and it has to run on `theeditai.co.uk` after the deploy rather than on the dev server. |
| C4 | Author two CTA strings the ToolCard session needs: the in-grid template card after the first six tools, and the line under every Amber or Red DPIA flag. Done 22 Aug (night): both authored with Cowork Claude and approved. Exact strings banked in `reports/2026-08-22-copy-pack-addendum.md` for the B3 session to place. | J+S | Done, banked for B3 |

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
| E1 | **Trim the fortnightly Cowork task to flag-only.** Do this first, before anything else in this section. It currently writes tool rows against the old brief, so every fortnight adds rows the triage has to delete. Flag-only means it still sweeps and reports to Jasmin but writes nothing to the Sheet. Two minutes in the Cowork app. **Confirmed done 23 Aug: the task is in flag-only mode.** | J | **Done, confirmed 23 Aug** |
| E2 | **Rebuild it as the checks engine.** Its job becomes: re-fetch the sources behind the fact fields for every live row, update them with a source link, stamp `last_checked`, and where a factual change touches a judgement field, flag it and write nothing. | J+S | Not started |
| E3 | **Re-point the Rundown daily Routine.** One prompt edit changes the extraction rule from "up to 5 stories" to "only stories touching tools in the directory or the sector: nonprofit programmes, data and training policy changes, regulation, accessibility". Zero-story days become correct behaviour. Do NOT pause this Routine; it writes dated rows and gaps are painful to backfill. | J | Not started |
| E4 | **Revoke PAT 16554137.** Named in the Routine prompt and in transcripts. GitHub never sees it (the sandbox proxy strips it), so it is exposure with no function. Security item, open since July. | J | Not started |
| E5 | Rewrite the Routine prompt's dispatch step to use the GitHub MCP tool `actions_run_trigger` and delete the curl instructions and the PAT from it. | J | Not started |
| E6 | Paste the dedupe and shared-secret code into the Apps Script. Delete the duplicate 3 and 6 July `whats_new` batches from the Sheet by hand. | J | Not started |
| E7 | Optional, after relaunch: collapse the pipeline. script.google.com is reachable from the Cowork cloud environment (verified 22 Aug, redirect behaviour still unverified). If it verifies, both writers become task to Apps Script to Sheet, and the GitHub relay and its watchdog get deleted. Changes nothing a visitor sees. | S | Not started |
| E8 | **Currency infrastructure for the policy template.** Proposed 25 Aug from a second thread and assessed here. **Dependency register built: `reports/2026-08-25-template-dependency-register.md`**, eighteen clauses mapped to source, not the nine or ten a first pass suggests; the three charity regulators and the ICO's separate guidance pages are what expand it. Two clauses can become **wrong** rather than merely dated, §11 ownership and §12 DPIAs, and both rest partly on primary statute. **Finding that reshapes the design: legislation.gov.uk cannot be fetched automatically from this environment at all**, including `/data.xml`, `/enacted` and crossheading routes, so statute cannot be watched by any agent here. For those two clauses the quarterly human pass is the only control, not a backstop. ICO pages fetch cleanly, verified 25 Aug. **This is E2 pointed at a second watchlist, not a separate build:** E2's spec already says re-fetch sources, update with a source link, stamp the date, and flag rather than write where a change touches judgement. One engine, two lists. **Split: the register and the currency line ship pre-launch; the change detector is post-launch.** Gate 2 is unstarted and the relaunch has to finish before October. | J+S | **Register done 25 Aug, detector deferred to post-launch** |
| E9 | **Distribution and recall for the template.** Every download is a frozen copy, so the subscriber list is the only channel that can reach anyone after an amendment. Needs: a template version and a "last checked against UK law and ICO guidance on [date]" line on the face of the document, a canonical URL in the footer that always serves latest (the Option B files in `public/` already give this), and a short changelog at a stable address. **Design point found here: the version numbers collide.** §15's table is the *adopting organisation's* policy version. The template's own version is a different number, and conflating them breaks the recall channel because a subscriber cannot tell whose v1.2 is whose. **Copy consequence, needs Jasmin:** saying so on `/policy-template` means changing placed approved copy, and "subscribe so I can tell you when the law moves under it" is a stronger reason to subscribe than the one currently there. | J+S | Not started |

### F. Relaunch

| # | Task | Owner | Status |
|---|---|---|---|
| F1 | ~~**The counter blocker.**~~ **Closed 22 Aug, commit `f514b0a`.** The counter was reading `tools.length` under "tools that passed the checks" with 66 untriaged rows. Fixed by changing the number, not the approved caption: it now counts rows with a non-empty `last_checked`, the field stamped when a row's facts are verified. Reads 0 until the October triage fills columns G-M, then rises on its own with no further code change, and fails safe if triage slips. Caveat: `last_checked` marks checked, not passed, so a "judged, not recommended" row would count; no field distinguishes them today. **No longer blocking the merge, and A3 no longer gates it.** | J+S | Closed |
| F2a | **Homepage hero consistency, Jasmin's ruling needed.** `HomeGravity` draws up to 18 pills from every `in_stack` row regardless of completeness, and the "What I'm running" strip has the same property, so the hero can name tools the directory refuses to show while the counter reads 4. Found by the B3 session 23 Aug. Not a bug fix: it is a positioning question, because the fix direction depends on whether the hero makes a checked claim or a personal one. Filter to complete rows, or reword the strip. **Ruled 25 Aug: the cascading pills are decoration, deliberately, and the drag interaction stays.** Neither offered option was taken. Consequence found in code: the pills filter `tools` on `status === "in_stack"` (19 rows) while the "What I'm running" strip below reads the same `tools` array, not the `my_stack` tab. **Corrected 25 Aug: the earlier claim in this thread that the strip already read `my_stack` was wrong and was asserted without opening the file. Nothing on the homepage touched that tab; `fetchMyStack` was called only by `MyStack.tsx`.** **Action taken 25 Aug: the pills now read `my_stack`; the strip still reads `tools` and is a separate open decision. Point `my_stack`.** One Sheet-editable list, a count that grows rather than thins, and permanent immunity from the counter because My Stack is a personal claim by definition. `in_stack` in `tools` then means only "render the badge", which is what CLAUDE.md already says it does. Still open: a label string near the pills so a first-time visitor knows they are a toy, and the "What I'm running" strip, which is a claim in words and names four tools A3 removed. | J+S | **Ruled 25 Aug, code job outstanding** |
| F2b | **Shared stack links drop incomplete tools.** A saved `?stack=` link naming a row that is no longer complete quietly drops it, and `/stack` shows its "Tool details unavailable" fallback for the same rows. Correct behaviour, logged so the relaunch check does not read it as a regression. | S | Confirmed correct |
| F2c | **Filter rail overflow, Jasmin's design judgement needed BEFORE merge.** The six comms jobs are much longer strings than the six tool types they replace ("Case studies & storytelling" against "Design"), so the filter rail now wraps to two lines on desktop, and in its compact scrolled state it becomes a horizontal scroller with the last chip clipped behind the existing gradient fade. The overflow treatment is pre-existing and was not introduced by B3; the longer labels are what made it prominent. This is a judgement call, not a bug fix, and it is wanted before the merge rather than after: the six jobs are the taxonomy the whole re-point is expressed in, and a clipped chip hides part of that taxonomy from the visitor. Found by the B3 session 23 Aug. **Do not fix it against a fixture** — it needs the real rail at real widths. | J | **MEASURED 26 Aug. Reproduces at every desktop width, in both states. Needs a ruling on the treatment, not more measurement.** Chip content is 1084.2px at every width. Unscrolled the rail wraps and hides nothing: 5 + 3 chips at 1280, 6 + 2 at 1366. Scrolled it clips: 172px hidden at 1280 with `Translation` gone entirely, 86px at 1366 with `Translation` at 31 of 117px and all of it behind the gradient. **Correction to the record: the 24 Aug reading was the compact scrolled state, not the desktop unscrolled one**, which the layout model reproduces to a tenth of a pixel, so the 23 Aug two-line finding was never a narrow-window artifact. **Recommended: delete the `scrolled ? "" : "sm:flex-wrap sm:overflow-visible"` conditional so the rail always wraps at `sm` and up.** One conditional, no copy, no axis amendment, 38px of vertical cost in the compact state. Prior status follows. **REOPENED 25 Aug and now blocking.** Adding `Research` to `jobs` takes `CATEGORIES` from seven chips to eight, and the 24 Aug measurement left only 30px of margin at 1470px, so a clip at 1366 is near-certain. The measurement owed since 24 Aug now has to happen before merge. Needs the dev server at a narrow width. Prior finding follows. **Does not reproduce at desktop width, 24 Aug.** At a 1470px viewport the rail is one line, all seven chips visible, `Translation` ending 30px inside the rail box. The 23 Aug wrap and clip was a narrow-window artifact. The 30px margin means a 1280 or 1366 laptop will very likely clip, so this downgrades to one measurement at a narrower width rather than a design decision. |
| F2 | **Relaunch check.** The live site reads sector-first on every surface reachable in two clicks. Every visible row has its axis fields. The gate delivers the template end to end from a clean browser. Rows without completed fields stay hidden, so the site relaunches smaller and grows back verified. **Hard gate added 23 Aug: every visible row's fact fields must have been through A4 with sources before merge, or the row gets blanked back to hidden.** The seed rows carry provisional values from the audit's worked examples plus a `last_checked` stamp, which makes them complete, visible and countable. Left unchecked that lets the homepage claim rows passed checks that never happened, which is the F1 problem returning through a side door. **Floor added 23 Aug: the merge does not proceed with fewer than ten complete rows rendering in the grid.** As originally written, "every visible row has its axis fields" is vacuously true when nothing is visible, so an empty directory would have passed this gate. Ten tracks the A4 and A5 top-ten pass, so it is achievable rather than arbitrary. **Also required before sign-off: the B3 re-run checklist, against real Sheet data.** See F2a, F2b and F2c for the three items this gate inherits. | J+S | Not started |
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
   injects on live. B2 closed, B4 unblocked. Both successor questions are now
   closed too. Helmet staleness on SPA navigation (item 13): not reproduced
   on a second measurement, tags update within 300ms per hop. Primary host
   (item 12): **decided and done, the bare domain is primary and www 308s to
   it.** The locked non-www canonical base stands; reality was aligned to the
   decision rather than the decision to reality. The Sheets key's referrer
   list was confirmed to cover the bare host before the flip, which was the
   load-bearing precondition, and live `/tools` served real data immediately
   after. No code change was required and none should be made: canonicals,
   JSON-LD and `og:url` already pointed at the bare host.
2. Which brand does the policy template carry? See C2.
3. Does the Substack re-point, or does The Edit stop implying it will? See D2
   and D3.
4. ~~Wire the Submit form or pull the page?~~ Answered 22 Aug: keep the
   page, swap the form for an email link to hello@jasminaziz.co.uk. See B6
   and the copy-pack addendum.

---

*Written 22 August 2026 against the live repo, the live Sheet, the live
consultancy site and the live Substack. Commit hashes and row counts verified
same day.*
