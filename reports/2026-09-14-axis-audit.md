# Axis audit, 14 September 2026

Axis audit, 14 Sep 2026: 8 published rows checked. 11 cells updated (7
last_checked stamps, 4 URLs), no vendor position moved. 2 new items needed your
judgement and both are ruled below; 10 carried items remain open. 0 published
rows unreachable.

Run in Claude Code on the audit-due Monday the Cowork trigger named. That
trigger's own run this morning reported the same freshness figures this run
computed independently: oldest check 24 Aug 2026 across ten tools, none within
14 days of 90, none over.

## Row numbering, verified not assumed

All fifteen cell references in `reports/2026-08-28-sheet-edit-pack.md` land on
the rows this parse gives (row 40 now reads Gemini Notebook, as written on
31 Aug). Last data row 68, Zo Computer. `isComplete()` reimplemented with
`normaliseDpiaFlag` lower-casing: 23 published, every flag exact-case, one Green
(Google Workspace AI, 61). Tab sizes read live: tools 67, my_stack 19,
design_kit 44, learning 26.

Triggered set, eight rows: HubSpot (3), Perplexity (39), Claude (57) and ChatGPT
(58) on Pass 1b policy-date drift; Adobe Creative Cloud (28) on drift and, with
Adobe Express (29), on the 1d two-failures escalation; Granola (41) because its
policy lost its date; Google Workspace AI (61) as the Green row.

## 1. Needs your judgement

### Ruled this run

**Components.gallery, design_kit row 24: retire.** Ruled 14 Sep 2026.
Unreachable on three consecutive runs by two methods (31 Aug: timeouts to
fetcher and browser; today: `curl` SSL_ERROR_SYSCALL, Chrome
ERR_CONNECTION_CLOSED). **Not yet done.** `scripts/sheet-write.mjs` writes cells
and cannot delete a row, by design, and no other route may write to the Sheet,
so the row has to come out by hand: delete row 24 on `design_kit`. Rows below
it move up one, which the write script's column A re-read already protects
against.

**Perplexity (39): covered by open ruling 1.** Ruled 14 Sep 2026 on the
recommendation. Its nonprofit tier is Enterprise Pro, where Perplexity says
data is "never used for AI training", while stored I "Yes unless you opt out"
describes Free, Pro and Max. That is the same shape as Gamma, Granola, Notion AI
and Grok, so row 39 has been added to ruling 1's row list in
`reports/axis-rulings.md`. The ruling itself is still yours and still blank.

A related note on Perplexity's J, "Enterprise Pro for not-for-profits, $30 a
seat": its only vendor source is a Perplexity post of 27 June 2024. No current
Perplexity page lists nonprofit pricing, and the Enterprise Pro list price now
reads $34 per seat billed annually. Nothing contradicts the $30, but nothing
current confirms it either.

### Discovery suggestions from the Cowork task, 7 Sep

The 1st-Monday discovery run proposed two additions. Neither is on any tab.

- **Europeana** (`https://www.europeana.eu`), for `design_kit`: digitised
  collections from European museums, libraries and archives. Live 14 Sep. Worth
  knowing before adding it: reuse rights are set per item, so it is not all
  public domain.
- **GOV.UK content design guidance**, for `learning`. The address the run gave
  now redirects to
  `https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/`,
  "Writing to GOV.UK standards". Use that one.

Each came paired with a row to displace (Art of the Title, design_kit 10;
Interactive Typography Cheat Sheet, learning 17). Those pairings are an artefact
of the prompt, not a judgement on the rows: the live Cowork prompt still asks
for "which existing row it displaces" on every addition, a clause that served
the swap rule you deleted on 1 Sep. Confirmed 14 Sep: the live prompt matches
`reports/2026-09-01-cowork-trigger-revised-prompt.md` apart from one trailing
space, so the record's open check is answered and the clause is live.

Adding rows is copy, so both are yours to write if you want them.

### Carried, still unruled (not re-argued)

1. HubSpot (3) cost string: a structure HubSpot no longer uses. GBP now
   confirmed from the UK page: Starter £18/mo/seat monthly, £7/mo/seat on an
   annual limited-time offer for new customers, 500 HubSpot Credits.
2. HubSpot (3) nonprofit pilot: still Australia, New Zealand, USA and Canada
   only, and never Starter. Unchanged.
3. Adobe Express (29) URL still serves Firefly (30 Aug, 1.3).
4. Windsurf (16) still redirects to Devin Desktop.
5. Smartmockups (tools 35, design_kit 42) still lands on canva.com/mockups.
6. GradeMyPrompt (learning 15): domain still does not resolve.
7. Nano Banana (32): still 404.
8. learning rows 2 and 3 still read "Anthropic Academy — …", stale name and em
   dashes.
9. The Gemini Notebook data-region caveat on the Green row is still on
   Google's page word for word.
10. The four open items in `reports/axis-rulings.md`.

### Closed since the last run

- **Adobe is reachable.** The 31 Aug "unreachable" was a bot-block, not a
  route: Adobe answers headless Chrome's default user agent with
  ERR_HTTP2_PROTOCOL_ERROR and serves normally to a normal one. Rows 28 and 29
  are checked and stamped, and the 1d escalation is closed.
- **Canva (27) D and J confirmed**, unverified on 31 Aug: Pro £100 a year for
  one person; Canva Nonprofits free Pro plus team tools for up to 50 users. Not
  re-stamped, since nothing moved since the 31 Aug stamp.
- **The Gemini Notebook trustee note is renamed.** `tools!L40` now reads
  "Gemini Notebook only ever sees…". `.claude/CLAUDE.md` still says the rename
  is "only half done" and that L40 "still names NotebookLM"; that line is now
  stale.
- `Unclear` in column I: in the write script's legal set since 1 Sep.

## 2. Facts updated, written and confirmed

Eleven cells, every one re-read after writing, and then checked on production
rather than only in the Sheet: `/tools` renders 23 cards, the seven stamped
cards read 14 Sep 2026 and HubSpot still reads 24 Aug; `/learning` links to
platform.claude.com and carries no docs.anthropic.com link; `/radar` (44 cards)
links bfl.ai and runway.com with no old host left; `/my-stack` links chatgpt.com
and not chat.openai.com.

**HubSpot (3) was checked and deliberately not stamped.** Its H, I and J all
hold, but its cost string is the open restructure above, and a fresh date would
tell readers the row is current when its price line is not.

## 3. Could not check

- **Perplexity (39) J** rests on a 2024 vendor post only (see section 1).
- **Diffs the Internet Archive could not serve.** It went offline mid-run, so
  Perplexity's 3 Sep article edit was checked by reading the current text
  rather than by a diff. The value it supports is confirmed either way.
- **Vendors publishing no date**, so Pass 1b has no signal and the 90-day clock
  is the only backstop: Descript's help page, Submagic, Seedance's CapCut trust
  page, Gamma's help article, Wispr Flow's docs, Notion AI (both), Canva's
  trust page, Gemini Notebook, the Google business FAQ, and now Granola. OpenAI
  is off this list: from a UK address both its policies carry dates.

## 4. Became completable

None. The 44 unpublished rows are still missing axis fields.

## 5. The toggles

No I or J value was written, so no row entered or left any filter.
`hasNonprofitPricing()` and `doesNotTrainOnInput()` are both inert this run.
The training filter still holds seven rows (28, 29, 40, 46, 60, 61, 65); three
of them were reconfirmed from the vendor today (28, 29 and 61), including both
Adobe rows the last run could not reach.

## 6. What was written

Diff at `reports/2026-09-14-axis-diff.json`, 11/11 confirmed. To undo:

```
node scripts/sheet-write.mjs reports/2026-09-14-axis-diff.json --rollback --commit
```

| Cell | Field | Old | New |
|---|---|---|---|
| `tools!M28` | last_checked | 25 Aug 2026 | 14 Sep 2026 |
| `tools!M29` | last_checked | 25 Aug 2026 | 14 Sep 2026 |
| `tools!M39` | last_checked | 24 Aug 2026 | 14 Sep 2026 |
| `tools!M41` | last_checked | 28 Aug 2026 | 14 Sep 2026 |
| `tools!M57` | last_checked | 24 Aug 2026 | 14 Sep 2026 |
| `tools!M58` | last_checked | 24 Aug 2026 | 14 Sep 2026 |
| `tools!M61` | last_checked | 31 Aug 2026 | 14 Sep 2026 |
| `learning!I10` | url | docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview | platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview |
| `tools!F38` | url | blackforestlabs.ai | bfl.ai |
| `tools!F52` | url | runwayml.com | runway.com |
| `my_stack!E16` | url | chat.openai.com | chatgpt.com |

## 7. Sources log

Every position is from the vendor's own page, followed 14 Sep 2026 from this
machine in headless Chrome with a normal user agent. Per-cell sources are in the
diff file. The checks that decided a stamp:

- **Adobe CC (28):** hosting-locations page (28 Aug) diffed against the
  Internet Archive's 22 Aug capture (dated 19 Jul): ten content lines, about
  2,000 characters each side, only the date line differs. Content analysis FAQ
  (4 Jun). UK plans and nonprofit pages.
- **Adobe Express (29):** Firefly FAQ (13 May), UK Express pricing, UK
  nonprofit FAQ.
- **HubSpot (3):** AI model training article (8 Sep), which adds that accounts
  with Sensitive Data on are opted out and cannot opt in; Terms of Service
  §5.5 (14 Apr); UK pricing; nonprofit eligibility criteria.
- **Perplexity (39):** data collection article (3 Sep), individual and
  enterprise pricing, June 2024 not-for-profit post.
- **Granola (41):** privacy policy (undated), pricing.
- **Claude (57):** privacy policy (10 Sep) diffed against Anthropic's archived
  8 Jul version, 354 against 366 paragraphs; pricing; nonprofit page.
- **ChatGPT (58):** EU services privacy policy (25 Aug) diffed against OpenAI's
  archived 4 Jun revision, 417 against 409 paragraphs; pricing; OpenAI for
  Nonprofits help article (updated about 1 Sep, which also gives $10 billed
  monthly, a detail J leaves out).
- **Google Workspace AI (61):** privacy hub (body date 14 Aug), nonprofit
  offers page.

## 8. Assumptions this run depends on

1. The published set was computed fresh from per-tab reads, never carried.
2. Every compared pair was checked non-empty before a "changed" or "unchanged"
   was allowed: the Adobe, Anthropic and OpenAI diffs all had real content on
   both sides and differed in only some lines.
3. Bot-blocks were not reported as defects. Seventeen URLs returned 403, 429
   or 401 to `curl`, and each was re-followed in Chrome. Thirteen resolved to
   the expected live page. ChatGPT (both addresses) hit a Cloudflare challenge
   (`cf-mitigated: challenge`) and SVG Repo a Vercel security checkpoint, both
   bot checks. Windsurf is the carried Devin redirect. Components.gallery and
   GradeMyPrompt failed by both methods.
4. Same-brand domain moves that still redirect (notion.so, klingai.com,
   zocomputer.com, v0.dev) are not findings and were not written. Four vendor
   host moves were.
5. Google's footer date is site furniture: it moved to 10 Sep on both Google
   pages at once while the body date held at 14 Aug. The 31 Aug note calling the
   FAQ footer a real content timestamp was wrong, and the policy map now says so.
6. `reports/axis-policy-urls.json` was updated with this run's moves, corrected
   baselines and the Adobe user-agent finding.
