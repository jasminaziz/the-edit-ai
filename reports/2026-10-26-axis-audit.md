# Axis audit, 26 October 2026

Axis audit, 26 Oct 2026: 4 published rows checked. 2 facts updated. 4 need
your judgement. 1 unreachable. 0 discovery candidates.

**Decided the same day.** Jasmin approved both stamps on 26 Oct 2026 in chat,
and both are written and confirmed (section 6). The four judgement items in
section 1 are still open.

Run in Claude Code on the 4th Monday, an audit-due day, from a detached
worktree at `origin/overhaul/sector-axis` (`4e5568c`), not the shared tree. The
shared tree was 53 commits behind and its copies of `axis-rulings.md` and
`axis-policy-urls.json` predated the 12 Oct rulings, so it would have re-raised
settled findings. The prompt and `scripts/sheet-write.mjs` were identical on
both. The Internet Archive was up, and rate-limited its availability API once.

## Row numbering, verified not assumed

**The edit-pack check failed, and the cause is understood.** The prompt says to
abort when a cell reference in `reports/2026-08-28-sheet-edit-pack.md` lands on
the wrong row. 27 of 30 did. Every one lands correctly after an offset of 0
above row 16, 1 between 16 and 35, and 2 below 35, because **Windsurf (16) and
Smartmockups (35) are no longer on `tools`**. The other three are Seedance,
named "Seedance (ByteDance)" since before 12 Oct. GradeMyPrompt is gone from
`learning` too. Those are exactly the three deletions the 12 Oct report held
for you.

So this run aborted positional trust, not the run: every check below is keyed
by name, `sheet-write.mjs` re-reads column A before it writes anything, and
`axis-policy-urls.json` has been re-keyed by name to today's rows.

Tab sizes read live: tools 65 (67 less two), my_stack 19, design_kit 46 (45
plus WebAIM), learning 27 (26 plus two additions, less GradeMyPrompt).
Published set computed with the app's own `parseToolRows` and `isComplete`,
imported from `src/lib/sheets.ts` rather than restated: **23 published, one
Green (Google Workspace AI, now row 59).** No row is due on age: the oldest
check is 24 Aug, 63 days.

Triggered set, four rows: Perplexity (37), Gemini (57) and Notion AI (63) on
Pass 1b; Google Workspace AI (59) as the Green row. Pass 1a flagged no `tools`
row.

## 1. Needs your judgement

### New this run

**1. The three hand deletions aren't recorded anywhere, and the row-number
check will now fail every run.** No commit or report since 12 Oct mentions
Windsurf, Smartmockups or GradeMyPrompt going. Two decisions: confirm the
deletions were yours (the Sheet's version history will say), and decide what
the prompt's edit-pack check should become. As written it compares fixed row
numbers from 28 Aug, so it now aborts on every run, and it will drift further
with each retirement. No wording is proposed.

**2. Perplexity (37): the cost string can't be reconfirmed, so the row isn't
stamped.** Stored:

> Free tier / Pro $20/mo

On 14 Sep the pricing page showed "Pro $20/month". Today the pricing hub and
`/pro` both show Pro only as "US$17 /month or equivalent, when billed
annually", and no Perplexity page gives a monthly figure (pricing hub, `/pro`,
and the four billing help articles, one modified 20 Oct). Moving to the annual
figure adds a billing qualifier, so it's a shape change: flagged, not written.
The verdict quotes no price and the trustee note names none, so neither is in
doubt. Decision needed: what the cost string should say.

**3. Notion AI (63): the cost string is loose, so the row isn't stamped.**
Stored:

> AI included in paid plans / full AI on Business $20/member/mo

Nothing moved since the 24 Aug check: the Internet Archive capture of 23 Aug
already showed Plus with only a "Trial of Notion AI" and Business at "$20 per
member / month". But two parts don't hold as written. Plus doesn't include AI
beyond a trial, and served to this UK machine Business is **£16.50 per seat a
month paying yearly, £19.50 paying monthly** (Plus £8.50 and £10). The pricing
convention wants both figures, so this is a shape change: flagged, not
written. The verdict ("half price on Business, which is the tier where the full
AI lives, so free and Plus won't give you what you've read about") is
consistent with the page and not in doubt. Decision needed: what the cost
string should say.

**4. SVG Repo (design_kit 31): unverifiable two runs running, so escalated
under Pass 1d.** It returns a Vercel Security Checkpoint (429) to curl and to
headless Chrome, as it did on 12 Oct. It's almost certainly a bot check rather
than a dead link, but nothing automated can confirm that. Opening
`https://www.svgrepo.com` once in your own browser settles it. A visible-browser
check from this session was refused by the permission check, so it wasn't
retried another way. Decision needed: whether to record it in
`axis-rulings.md` as a known bot check, so the audit stops escalating it.

### Noticed, not a defect (no field moves)

- **Perplexity dropped its Data Privacy Framework certification from its
  privacy notice on 23 Oct.** The whole EU-U.S. DPF section, UK Extension and
  ICO complaint route included, is gone. Transfers now cite Standard
  Contractual Clauses only. H stays US. No axis field records the transfer
  mechanism, but it's the kind of thing a DPIA asks about. Unchecked: whether
  Perplexity is still listed on dataprivacyframework.gov.
- **Gemini's 13 Oct notice widens training slightly.** With Keep Activity on,
  "transcripts of your Live chats and uploads you share with Gemini Live are
  used to improve Google services, including AI models". Uploads are new. The
  row already reads "Yes unless you opt out", so the value doesn't move.

### Carried, still unruled

None. Every item carried on 12 Oct was closed by that day's corrections and is
confirmed in today's Sheet: Copilot's cost string, HubSpot's cost and J, Adobe
Express's URL, Nano Banana's link, Perplexity's J, Adobe Creative Cloud's J,
the learning names (rows 2 to 5 now use a colon) and Canva Mockups on
design_kit. All four rulings in `axis-rulings.md` are settled.

## 2. Facts updated, written and confirmed

Two `last_checked` stamps, from `reports/2026-10-26-axis-diff.json`, each on a
row where every fact field was reconfirmed from the vendor today and nothing
moved. 2/2 re-read from the Sheet after writing. On production `/tools`, on a
fresh load at 1280 wide, 23 cards rendered and "26 Oct 2026" appears on exactly
two, Gemini and Google Workspace AI.

- **Gemini (57):** the Gemini Apps Privacy Notice moved from 29 Jun to 13 Oct.
  Diffed in full, collapsed sections included, against the Internet Archive
  capture of 11 Oct: 414 sentences unchanged, 33 out, 50 in. Spark renamed
  Tasks in Gemini; Memory summary and permission settings added; Live uploads
  added to training (above). I, H, J and D all hold, and the verdict's factual
  claims stand word for word ("Human reviewers ... review some of the data",
  "Retained for up to 3 years").
- **Google Workspace AI (59), the Green row:** hub body date still 6 Oct, the
  same page that was stamped on 12 Oct. "Your interactions with Gemini stay
  within your organization"; "not human reviewed or otherwise used for
  Generative AI model training outside your domain without permission"; "Google
  Workspace for Nonprofits $0 USD / user / month"; Business Standard "75%+ off
  standard pricing". **No fact moved, so the Green-row escalation doesn't
  fire.**

## 3. Could not check

- **SVG Repo**, escalated to section 1 under Pass 1d.
- **Vendors publishing no date**, so the 90-day clock is the only backstop:
  Canva's trust page, Gemini Notebook, Descript's help page, Submagic,
  Seedance's CapCut trust page, Wispr's docs article and Notion AI (both).
  Notion's trust centre does carry dates, but they're an announcements feed
  (19 Oct was a security white paper for Notion Workers), not policy dates.
- **The 22 Nov age cliff is close.** Thirteen rows were last checked between 24
  Aug and 14 Sep and come due between 22 Nov and 13 Dec: Blotato, Canva, Adobe
  Express, Ideogram, Perplexity, Granola, Descript, Submagic, Seedance, Claude,
  ChatGPT, Notion AI and DeepSeek. The prompt suggests staggering by hand
  before then. Perplexity and Notion AI would come off the list if their cost
  strings are settled and stamped now.

Pass 1d: SVG Repo is the only thing that failed in both this run and the last.
OpenAI's rest-of-world policy, which returned a 403 once on 12 Oct, loaded
first time.

## 4. Became completable

None. Still 23 published of 65.

## 5. The toggles

No H, I or J value was proposed, so no row enters or leaves any filter.
`hasNonprofitPricing()` and `doesNotTrainOnInput()` are both inert this run.
The training filter still holds seven rows (27, 28, 38, 44, 58, 59, 63 under
today's numbering); two were reconfirmed from the vendor today (59 and 63).

## 6. What was written

2 cells, both re-read from the Sheet after writing, on Jasmin's approval of 26
Oct 2026 in chat. `node --test scripts/sheet-write.test.mjs` passed 31 of 31
before the write, and the column A re-read matched both names. A full re-read
of all four tabs against the morning's snapshot found no other cell changed.

| Cell | Field | Old | New |
|---|---|---|---|
| `tools!M57` | last_checked | 28 Sep 2026 | 26 Oct 2026 |
| `tools!M59` | last_checked | 12 Oct 2026 | 26 Oct 2026 |

To undo:

```
node scripts/sheet-write.mjs reports/2026-10-26-axis-diff.json --rollback --commit
```

## 7. Sources log

Every position is from the vendor's own page, loaded 26 Oct 2026 from this
machine in headless Chrome (the installed Chrome, normal user agent, UK locale).
Per-cell sources are in the diff file.

- **Pass 1a:** 157 URLs across the four tabs. curl flagged 27: four same-brand
  host moves (below) and 23 bot-check responses (401, 403, 429), each
  re-followed in Chrome. All reached the expected page except SVG Repo.
  `claude.ai/design` now lands on `claude.com/product/design`, same brand.
- **Pass 1b:** 36 policy URLs for the 23 published rows, all loaded. Newer than
  baseline: Perplexity's privacy notice (23 Oct), Gemini's notice (13 Oct) and
  hub (23 Oct). Notion's trust feed (19 Oct) read and set aside.
- **Diffs:** Perplexity against the Archive's 17 Oct capture (245 sentences
  unchanged, about 25 changed); Gemini against the 11 Oct capture (414
  unchanged). Both sides checked non-empty first.
- **Pass 2:** Perplexity pricing hub, `/pro`, data-collection article, enterprise
  pricing FAQ and billing articles; Gemini subscriptions; Google for Nonprofits
  Workspace offer; Notion pricing (both billing states), nonprofits page, AI
  security practices and data residency; Notion pricing as archived 23 Aug.
- **Pass 4:** `RemoteTrigger list_runs` on `trig_01WgEnqKWcJc2WGby5Ecn5QQ`. The
  newest 1st-Monday run is 5 Oct, decided in the 12 Oct report. Today's 08:14 run
  is a 4th-Monday reminder. Next discovery run: Monday 2 Nov.

## 8. Assumptions this run depends on

1. The published set was computed fresh from per-tab reads, never carried.
2. Rows were matched by name, not position, because the numbering moved.
3. Every compared pair was checked non-empty first.
4. Bot checks weren't reported as defects, except SVG Repo under Pass 1d.
5. Same-brand domain moves are not findings and were not written: notion.so,
   klingai.com, zocomputer.com, v0.dev.
6. Prices are recorded as served to a UK machine: Perplexity and Google's
   nonprofit offer in USD, Gemini and Notion in GBP.
7. `reports/axis-policy-urls.json` is re-keyed to today's rows and carries this
   run's baselines: Perplexity 23 Oct and its help article corrected to 31 Aug
   (the 3 Sep baseline was misread), Gemini 23 Oct with the notice at 13 Oct,
   Gamma's help article 24 Sep, plus notes on Gemini's collapsed sections and
   Notion's announcements feed.
8. Playwright 1.59.1 was loaded read-only from the shared tree's
   `node_modules` and drove the installed Chrome. Nothing was installed or
   downloaded.
