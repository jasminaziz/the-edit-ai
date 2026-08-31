# Axis audit, 31 August 2026

23 published rows checked. 9 cells updated across 6 rows. 6 need your
judgement. 3 unreachable.

## Read this first: no vendor position moved, and that is the result

Every triggered row came back with its stored values intact. Not one
`data_location`, `trains_on_input`, `nonprofit_tier` or `cost` value changed.
The nine cells written are three `last_checked` stamps, one product rename
Google made on 16 July carried across both tabs that name it, and four dead or
stale URLs replaced with verified live ones.

**The write path was built, used and verified this run.** `scripts/sheet-write.mjs`
with `scripts/sheet-write.test.mjs` alongside it: 19 tests, all passing. An
E-column write is refused, a single name mismatch aborts the whole batch, every
write must cite a source URL, and `--rollback` replays any run backwards.

The boundary moved during the run, on Jasmin's ruling, and that is worth stating
plainly rather than leaving in the diff. The original brief said column A and
column F were "never writable, by any route", and that building a write for any
other column was "an abort, not a warning". Jasmin overrode that on 31 August:
a vendor renaming its product or moving its URL is a fact, and facts should not
queue behind a sign-off. The line the guard now runs on is **writable when an
external source determines the correct value, refused when someone has to choose
it**. Verdict, DPIA flag, trustee note, jobs, status and what_it_does stay
refused permanently, as does column A on the `learning` tab, where the names are
composite labels rather than vendor strings.

Credentials: the org enforces `iam.disableServiceAccountKeyCreation`, which is a
sensible default and was not switched off. The service account
`the-edit-audit@the-edit-490220` is reached by gcloud impersonation instead, so
no key file exists anywhere on disk or in the repo.

## Row numbering, verified not assumed

Every cell reference in `reports/2026-08-28-sheet-edit-pack.md` lands on the row
this parse gives: E3 HubSpot, E27:E29 Canva / Adobe Creative Cloud / Adobe
Express, E39:E40 Perplexity / NotebookLM, E45:E46 ElevenLabs / Descript,
E57:E58 Claude / ChatGPT, E60:E61 Microsoft Copilot / Google Workspace AI, E63
Wispr Flow, E65:E66 Notion AI / DeepSeek, and the loose "row 58, ChatGPT". All
fifteen match. `isComplete()` was reimplemented exactly, `normaliseDpiaFlag`
lower-casing included, and gives 23 published rows.

Triggered set: **three rows**. Canva (27) and Google Workspace AI (61) on Pass 1b
policy drift, NotebookLM (40) on a Pass 1a host change. Google Workspace AI is
also the single Green row, so it is checked every run regardless. No row is due
on age until 22 November.

## 1. Needs your judgement

### 1.1 Gemini Notebook (row 40): the rename is done, the copy still says otherwise
Sources: Google's Workspace privacy hub, `notebooklm.google.com` and
`support.google.com/notebooklm/*`, all followed 31 Aug 2026.
Written: name and url, both tabs. Current dpia_flag: Amber.

Google renamed NotebookLM to Gemini Notebook on 16 July. Three independent
signals, all confirmed this run: `notebooklm.google.com` now resolves to
`notebook.google.com`, `support.google.com/notebooklm/*` redirects to
`support.google.com/gemininotebook/*`, and Google's own privacy hub calls it
"Gemini Notebook (formerly known as NotebookLM)".

The name and URL are fixed on both `tools` row 40 and `my_stack` row 12, so the
directory and the stack page no longer disagree. All four fact fields were
reverified and none moved. H reading `Unclear` is now positively evidenced
rather than merely unfound: Google states, verbatim, "Your organization's file
sharing and data region settings do not apply to data in Gemini Notebook", and
still does not say where that data sits.

**What is left is yours.** The trustee note still names the old product:

> "NotebookLM only ever sees the documents we choose to upload, so the decision
> is what goes in the folder, and we check that because Google doesn't publish
> where those documents are processed."

Its substance is intact, including the claim that Google does not publish the
processing location, which I confirmed word for word today. Only the name is
stale. The verdict does not name the product and needs nothing.

Your ruling needed on: the trustee note's wording.

### 1.2 Windsurf (row 16): the URL now serves a different company's product
Source: `https://windsurf.com`, followed 31 Aug 2026 in a real browser.
Row is not published, so nothing is live to a reader.

`windsurf.com` redirects to `devin.ai/desktop`, page title "Devin Desktop |
Devin", h1 "Devin Desktop". This is a Cognition property now, not the editor the
row is about.

Not urgent, because the row fails `isComplete()` and does not render. Raised
because it changes what the row is, and that decision is better made before
someone fills in the axis fields for it.

### 1.3 Smartmockups (tools row 35, design_kit row 42): folded into Canva
Source: `https://smartmockups.com`, followed 31 Aug 2026.

Both rows' URLs now land on `https://www.canva.com/mockups/`. The redirect
target is confirmed; the destination page itself sits behind a Cloudflare
challenge, so I could not read it to see whether a standalone Smartmockups
product still exists under that path.

Two rows, two tabs, one decision. Neither is on the tools axis track.

### 1.4 Two rows whose product is simply gone
Both followed in a real browser as well as by fetcher, so neither is a bot-block
misread.

- **GradeMyPrompt, learning row 15.** `https://grademyprompt.com` no longer
  resolves at all: `ERR_NAME_NOT_RESOLVED`, and `ENOTFOUND` to the fetcher. The
  domain is gone, not the page, so there is no URL to write.
- **Nano Banana, tools row 32.** `https://deepmind.google/technologies/imagen-4`
  returns 404, h1 "Page not found". Row is not published.

Also worth one look: **Components.gallery, design_kit row 24** timed out to both
fetcher and browser. Possibly transient, but it failed twice by two methods.

The two Anthropic Academy rows that sat here on the first pass are fixed. The
Academy moved to `academy.claude.com` and both courses still exist, including
the nonprofit one, so those were link rot and are written.

### 1.5 The write script will refuse a legal value, and that needs a ruling
Not a vendor finding. A conflict between two of your own documents, found while
building the guard.

The audit spec's legal set for column I is `No | No by default | Yes unless you
opt out | Yes | Varies by tier`. The axis lock
(`reports/2026-08-23-axis-locked.md`) and `.claude/schema.md` both also carry
**`Unclear`**, added by amendment on 25 August, and two published rows use it
today: Blotato (5) and Submagic (47).

I implemented the spec's narrower list, because refusing a write is the safe
direction and silently widening a frozen value set is not mine to do. The
consequence is that `scripts/sheet-write.mjs` would refuse to write `Unclear` to
column I. Nothing this run needed it.

Your ruling needed on: add `Unclear` to the script's I set, or leave it refused.

### 1.6 The two learning row names are stale, and carry em dashes
`learning` rows 2 and 3 read "Anthropic Academy — AI Fluency Track" and
"Anthropic Academy — Nonprofit Track". Their URLs are fixed, but the labels
still say Anthropic Academy, which is now Claude Academy, and the courses are
"AI Fluency: Framework & Foundations" and "AI Fluency for nonprofits".

Two reasons this is yours and not mine. The names are composite labels you
wrote rather than vendor strings, so there is no mechanical substitution; and
both contain an em dash, against the voice rules, on a page a visitor reads.
`learning` column A is refused by the guard for exactly this reason.

## Status of the 30 August items (not new findings)
The four items in `reports/axis-rulings.md` all still have empty **Ruling:**
lines, so all four regenerated as expected and are suppressed here rather than
re-argued: the tier-varying convention (Gamma, Granola, Notion AI, Grok), Grok's
`data_location`, Gemini's `nonprofit_tier`, and the Adobe nonprofit channel.

One 30 August finding I can now confirm has **not** been overtaken by events.
Its section 1.6 flagged that the privacy hub singles out Gemini Notebook as an
exception to organisational data-region settings, on the Green row whose trustee
note turns on nothing moving anywhere new. Google has since made Gemini Notebook
a Workspace core service, which might have resolved it. It did not. The sentence
is still there today, word for word: "Your organization's file sharing and data
region settings do not apply to data in Gemini Notebook." That caveat is still
live and still unruled.

## 2. Facts updated, already written and confirmed

Nine cells, every one re-read after writing and confirmed. Receipt in section 6.
Verified on production afterwards, not just in the Sheet: `/tools` renders 23
cards with "Gemini Notebook" and no "NotebookLM", and links to
`notebook.google.com` with none left pointing at the old host; `/my-stack`
matches; `/learning` carries both new `academy.claude.com` URLs and no dead
`anthropic.com/academy` link.

## 3. Could not check

Three published rows, all of them a route problem rather than a vendor change.

**Adobe, rows 28 and 29. Both are in the training filter.**
`helpx.adobe.com` and `www.adobe.com` are unreachable from this machine.
Chromium returns `ERR_HTTP2_PROTOCOL_ERROR`, retrying with HTTP/2 disabled times
out at 60s, and three curl attempts at 90s each returned 0 bytes. Four failures,
three methods. Three policy URLs affected: the content-analysis FAQ, the Creative
Cloud hosting-locations page and the Firefly FAQ.

This is the one that matters most in this section. Rows 28 and 29 both sit inside
"Doesn't train on your content", which is where the site makes its strongest
claim, and they are now the two rows in that filter whose sources this pipeline
cannot reach at all. The 30 August run reached them from a US environment. This
one cannot from the UK.

**Canva, row 27, columns D and J.** `canva.com/en_gb/pricing/` and
`canva.com/en_gb/nonprofits/` both return 403 with a Cloudflare interstitial, in
a real headless browser, after a 12-second wait, with automation flags
suppressed. So the stored `£100 a year` and the `up to 50 users` cap are
unverified this run. Note the split, because it is useful: `canva.com/policies/*`
serves fine, which is why the policy diff below was possible at all.

**Vendors publishing no date at all.** Pass 1b has no signal on these rows,
because there is nothing to compare `last_checked` against: OpenAI (58, both
policies), ElevenLabs (45), DeepSeek (66), Submagic (47), Notion AI (65, both
pages), Gemini Notebook (40). That is not drift and not a defect. It does mean
the 90-day clock is the only backstop those rows have.

## 4. Became completable

None. The 44 unpublished rows are still missing all seven axis fields, not just
the judgement three. Nothing has entered the queue.

## 5. The toggles

**No filter movement, because no I or J write is proposed.** Both mechanical
consequences were checked explicitly and both are inert this run:

- `hasNonprofitPricing()` passes any `nonprofit_tier` except None. No J write is
  proposed, so no row enters or leaves the nonprofit filter.
- `doesNotTrainOnInput()` passes only No and No by default. No I write is
  proposed, so no row silently drops out of the training filter.

Seven rows sit inside the training filter: Adobe Creative Cloud (28), Adobe
Express (29), NotebookLM (40), Descript (46), Microsoft Copilot (60), Google
Workspace AI (61) and Notion AI (65). Of the three I checked this run, two are in
it, 40 and 61, and both were reconfirmed from the vendor's own page. The other
five were not triggered. Two of them, 28 and 29, are the Adobe rows this machine
cannot reach; that gap is now the weakest point in the filter that carries the
most weight.

## 6. What was written

Diff at `reports/2026-08-31-axis-diff.json`. Every cell re-read after writing
and confirmed, 9 of 9. To undo the whole run:

```
node scripts/sheet-write.mjs reports/2026-08-31-axis-diff.json --rollback --commit
```

| Cell | Field | Old | New |
|---|---|---|---|
| `tools!M27` | last_checked | 24 Aug 2026 | 31 Aug 2026 |
| `tools!A40` | name | NotebookLM | Gemini Notebook |
| `tools!F40` | url | notebooklm.google.com | notebook.google.com |
| `tools!M40` | last_checked | 24 Aug 2026 | 31 Aug 2026 |
| `tools!M61` | last_checked | 25 Aug 2026 | 31 Aug 2026 |
| `learning!I2` | url | anthropic.com/academy (404) | academy.claude.com/courses/ai-fluency-framework-foundations |
| `learning!I3` | url | anthropic.com/academy (404) | academy.claude.com/courses/ai-fluency-for-nonprofits |
| `my_stack!A12` | name | NotebookLM | Gemini Notebook |
| `my_stack!E12` | url | notebooklm.google.com | notebook.google.com |

**Canva (27).** Its privacy policy republished on 25 August, one day after the
stored check, which is exactly the drift Pass 1b exists to catch. Rather than
guess whether anything material changed, I diffed it: Canva keeps a policy
archive, and the version superseded on 25 August is dated 15 April 2026. Its
data-location clause and its Service-improvement/training clause are **word for
word identical** to the live policy's. So `H = US` and `I = Varies by tier` both
stand, and the 25 August republish did not touch either. The stamp records a
check that happened and found nothing.

**Gemini Notebook (40).** All four fact fields reverified from Google's own pages
and unchanged, and the name and URL corrected to match what Google now publishes.

**Google Workspace AI (61).** The Green row, so it is checked every run. `H = Your
tenant` and `I = No` reconfirmed verbatim from the privacy hub. J and D
reconfirmed too, more precisely than before: Google publishes Business Standard
at **75%+ off**, $3.50 per user per month on a one-year commitment, on two
separate pages. The stored 75% figure is exact.

A correction to my own first pass, because it would otherwise become a finding
you had to argue with. Pass 1b initially flagged row 61's privacy hub as drifting
to 26 August. It has not. Those Google pages carry two dates: an editorial "Last
updated: August 14, 2026" in the body, and a site-furniture footer "Last updated
2026-08-26 UTC". Only the body date means the policy moved, and 14 August
predates the stored check. The business FAQ has only the footer form, and its 26
August value has held steady across two runs five days apart, so it is a real
content timestamp rather than a rolling one. The trap is now recorded in
`reports/axis-policy-urls.json` so the next run does not fall into it.

## 7. What this run added to the repo

- `reports/axis-policy-urls.json`: the row to policy URL map Pass 1b needs, 23
  rows, 36 URLs, with baseline dates. Also records the two traps found this run:
  the Google double-date, and the Canva split where `/policies/*` serves but
  marketing paths do not.
- `scripts/sheet-write.mjs`: the only path that writes to the Sheet.
- `scripts/sheet-write.test.mjs`: 19 guard tests, run with
  `node --test scripts/sheet-write.test.mjs`. Deliberately outside the vitest
  glob (`src/**`), so the app's test config is untouched.
- `reports/2026-08-31-axis-diff.json`: the nine written cells, with sources, and
  the input to `--rollback`.

Gate run clean before any of this was reported: `bunx tsc --noEmit` silent,
`bun test` 83 passing across 4 files, of which 64 are the app's and 19 are these
guards, and `bun run build` succeeded.

## 8. Assumptions this run depends on

1. The published set was computed fresh from a per-tab read, never carried. 23 of
   67 rows pass. `isComplete()` was reimplemented exactly, including
   `normaliseDpiaFlag` lower-casing, so a K reading "green" would count. None
   does today: all 23 flags are exact-case.
2. Row numbering is confirmed against all fifteen references in the 28 August
   sheet edit pack, plus the last data row at 68 matching the Make blueprint's
   `tools!A68:F68`.
3. Every position here is from a vendor page. No third-party summary, review site
   or aggregator was used as a source anywhere.
4. Bot-blocks were not reported as defects. Roughly two dozen URLs returned 403
   or 429 to the fetcher; each was re-followed in a real browser, and those that
   resolved to a live page with the expected host are absent from this report.
   The four in section 1.4 failed by both methods. Gemini (59) and Krea (37)
   looked like errors to the fetcher and are fine in a browser, so they are not
   findings.
5. Canva's "nothing moved" rests on a clause-level diff of two archived policy
   versions, not on the absence of a visible change. That is the strongest form
   of evidence available for this check and it is why the stamp is proposed.
6. The Adobe unreachability is a property of this machine's route to Adobe, not a
   statement about Adobe's policies. Rows 28 and 29 are unchecked, not unchanged.
