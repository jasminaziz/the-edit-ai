# Axis audit, 28 September 2026

Axis audit, 28 Sep 2026: 7 published rows checked. 10 facts updated. 3 need
your judgement. 0 published rows unreachable. 2 discovery candidates.

Run in Claude Code on the 4th Monday, an audit-due day. No vendor's data or
training position moved on any row. The ten writes are five `last_checked`
stamps, three cost strings now in the pounds a UK visitor is served, and one URL
on two tabs.

## Row numbering, verified not assumed

All cell references in `reports/2026-08-28-sheet-edit-pack.md` land on the rows
this parse gives. Last data row 68, Zo Computer. `isComplete()` reimplemented
with `normaliseDpiaFlag` lower-casing: 23 published, every flag exact-case, one
Green (Google Workspace AI, 61). Tab sizes read live: tools 67, my_stack 19,
design_kit 43, learning 26. `design_kit` is one down because Components.gallery
is gone, so the 14 Sep retirement is done.

No row is due on age: the oldest check is 35 days (24 Aug).

Triggered set, seven rows: HubSpot (3), Adobe Creative Cloud (28), Gemini (59),
Gamma (62) and Wispr Flow (63) on Pass 1b policy-date drift; Gemini Notebook
(40) on Pass 1a; Google Workspace AI (61) as the Green row.

## 1. Needs your judgement

### New this run

**Gamma (62): a verdict sentence is now in doubt.** Pass 3, fired by the cost
write. The verdict says, verbatim:

> No charity price, and the pricing page keeps its numbers to itself, so check
> what you'd pay before you commit.

Today `gamma.app/pricing` shows its prices to a signed-out visitor from the UK:
Plus £10 a seat a month paying monthly, £7 paying annually; Pro £20, or £15
annually; Ultra £75, or £66.75 annually. "No charity price" still holds. The
trustee note is unaffected:

> We use it for internal presentations, training is turned off, and nothing
> about a named person goes into it.

Decision needed: whether the verdict's pricing clause stays. No wording is
proposed.

**Gemini Notebook URL: written on your ruling, recorded here.** Approved 28 Sep
2026. `notebook.google.com` now sends a signed-out visitor to a Google sign-in
page. Both `tools!F40` and `my_stack!E12` now point at `https://notebook.google/`,
Google's public page for the same product, which `notebooklm.google` and
`notebook.google.com/about` both redirect to.

**Wispr Flow (63) J cannot be reconfirmed.** Stored: "Non-Profit Discount: Flow
Pro at $8 a month annual". The pricing FAQ now says only "We also offer
discounted Flow Pro to nonprofit organizations", with no figure, and
`wisprflow.ai/nonprofits` is a 404. Nothing contradicts the $8, but nothing
current confirms it. J was left alone, and so was the row's stamp, because a
fresh date would claim a check this cell did not pass. The cost string next to
it now reads in pounds while J reads in dollars; that is what each source
serves.

### Discovery pickup, 25 Sep addendum

These candidates come from your own check on 25 Sep 2026, which ran alongside
the 7 Sep Cowork run. The 7 Sep run's own pair (Europeana, GOV.UK guidance) was
decided on 14 Sep and is not raised again. On your instruction the URLs were not
re-checked in a browser. The duplicate check was run: neither name nor host is
on any of the four tabs.

| Tab | Name | URL | Action | Reason | Verification |
|---|---|---|---|---|---|
| design_kit | Realtime Colors | `https://www.realtimecolors.com` | Add | Previews palette and font pairing on a real layout, exports CSS/Tailwind/SCSS | Checked live by you 25 Sep; no duplicate |
| design_kit | Haikei | `https://haikei.app` | Add | Browser SVG shape and background generator, no sign-up | Checked live by you 25 Sep; no duplicate |
| design_kit | bklit.com (Bklit UI) | n/a | Not a candidate | A developer component library on shadcn/ui, not a no-code tool | Checked by you 25 Sep |

`learning`: no additions this round, as you specified.

Fact cells, in the tab's own conventions:

| name | category | phase | group | cost | url |
|---|---|---|---|---|---|
| Realtime Colors | Colour | Define Visual Direction | Colour | Free | https://www.realtimecolors.com |
| Haikei | Illustrations | Build the UI | Motion and Illustration | Free / Pro (TBD) | https://haikei.app |

Haikei's category is a suggestion: Illustrations is the value Storyset carries
in the same group. Its cost string is yours as given; the nearest existing
convention on the tab is "Free / Pro available". **Copy cells are blank and
yours:** `what_it_does`, `when_to_use` and `verdict` on both. The write script
cannot add rows, so both are pasted by hand once written.

### Carried, still unruled (not re-argued)

1. HubSpot (3) cost string: a structure HubSpot no longer uses.
2. HubSpot (3) nonprofit pilot: Australia, New Zealand, USA and Canada only.
3. Adobe Express (29) URL still serves Firefly.
4. Windsurf (16) still redirects to Devin Desktop.
5. Smartmockups (tools 35, design_kit 41) still lands on canva.com/mockups. Now
   design_kit row 41, one up after the Components.gallery deletion.
6. GradeMyPrompt (learning 15): domain still does not resolve.
7. Nano Banana (32): still 404.
8. learning rows 2 and 3 still read "Anthropic Academy — …".
9. Perplexity (39) J rests on a June 2024 post only.
10. The four open items in `reports/axis-rulings.md`. Two notes for them: the
    Gamma article now names the plans in ruling 1's shape exactly (individual
    Free, Plus, Pro and Ultra opt-out; Enterprise, Business and Teams always
    off); and for ruling 2, the xAI privacy policy, still effective 24 Aug,
    now names "SpaceXAI LLC" as the company.

## 2. Facts updated, written and confirmed

Ten cells, every one re-read from the Sheet after writing, then checked on
production. `/tools` rendered 23 cards on a cold load at 1280 wide. The three
new pound strings each appear once and the three old dollar strings nowhere.
"28 Sep 2026" appears on exactly the five stamped cards, and the page links
`notebook.google/` twice with no `notebook.google.com` link left. `/my-stack`
links `notebook.google/` once, with no old link.

**HubSpot (3) was checked and again not stamped.** Its Terms were modified 16
Sep. Diffed against the Internet Archive's 15 Sep capture: Commerce Hub is
renamed Revenue Hub and the definition of overages is reworded. Section 5.5,
the hosting clause H rests on, is identical word for word, and nothing about
training moved. The cost string is still the open restructure.

## 3. Could not check

- **Perplexity's data-collection article** failed three ways today: a 500 and
  then two timeouts in Chrome, and a 403 to `curl`. It loaded on 14 Sep, so this
  is its first failure and it is not escalated. Row 39 was not in the triggered
  set, and its main privacy notice loaded, unchanged since 8 Jul.
- **Adobe's hosting page** was republished 16 Sep and the archive holds no copy,
  so it was read directly rather than diffed.
- **Gemini's privacy page** has no archive copy. The notice date (29 Jun) did
  not move, so the clauses were read directly.
- **Wispr's docs article** dates itself relatively ("2 days ago") and has moved
  address, so it was read directly.
- **Vendors publishing no date**, so the 90-day clock is the only backstop:
  Descript's help page, Submagic, Seedance's CapCut trust page, Wispr Flow's
  docs, Notion AI (both; the trust centre's dates are compliance-report
  notices, not policy changes), Canva's trust page and Gemini Notebook. Granola
  is off this list: its policy reads "Effective from 8th September 2026" again.

## 4. Became completable

None. The 44 unpublished rows are still missing axis fields.

## 5. The toggles

No H, I or J value was written, so no row entered or left any filter.
`hasNonprofitPricing()` and `doesNotTrainOnInput()` are both inert this run.
The training filter still holds seven rows (28, 29, 40, 46, 60, 61, 65); three
were reconfirmed from the vendor today (28, 40 and 61).

## 6. What was written

Diff at `reports/2026-09-28-axis-diff.json`, 10/10 confirmed by a re-read of
both tabs. To undo:

```
node scripts/sheet-write.mjs reports/2026-09-28-axis-diff.json --rollback --commit
```

| Cell | Field | Old | New |
|---|---|---|---|
| `tools!M28` | last_checked | 14 Sep 2026 | 28 Sep 2026 |
| `tools!D59` | cost | Free tier / Google AI Plus $4.99/mo / Pro $19.99/mo | Free tier / Google AI Plus £4.49/mo / Pro £18.99/mo |
| `tools!M59` | last_checked | 28 Aug 2026 | 28 Sep 2026 |
| `tools!M61` | last_checked | 14 Sep 2026 | 28 Sep 2026 |
| `tools!D62` | cost | Free tier / Plus $12/mo, $9/mo billed annually | Free tier / Plus £10/mo, £7/mo billed annually |
| `tools!M62` | last_checked | 28 Aug 2026 | 28 Sep 2026 |
| `tools!D63` | cost | Free tier / Pro $12/mo annual ($15/mo monthly) | Free tier / Pro £12/mo annual (£15/mo monthly) |
| `tools!M40` | last_checked | 31 Aug 2026 | 28 Sep 2026 |
| `tools!F40` | url | https://notebook.google.com | https://notebook.google/ |
| `my_stack!E12` | url | https://notebook.google.com | https://notebook.google/ |

## 7. Sources log

Every position is from the vendor's own page, followed 28 Sep 2026 from this
machine in headless Chrome with a normal user agent and a UK locale. Per-cell
sources are in the diff file. The checks that decided a write:

- **Adobe CC (28):** hosting-locations page (16 Sep), content-analysis FAQ
  (4 Jun), UK plans page, UK nonprofit FAQ ("Creative Cloud individual one-year
  memberships at a discount", "administered through our programme partner
  TechSoup").
- **Gemini (59):** Gemini Apps privacy hub (page 24 Sep, notice 29 Jun),
  accordions expanded; UK subscriptions page.
- **Google Workspace AI (61):** privacy hub (body date 14 Aug), nonprofit
  offers page.
- **Gamma (62):** training help article, diffed against the Internet Archive
  capture of 7 Aug; privacy policy (10 Apr 2025); UK pricing page with the
  monthly and annual toggles both read.
- **Wispr Flow (63):** data-sharing docs article (moved address), privacy
  policy (19 Aug), UK pricing page with both toggles read, pricing FAQ.
- **Gemini Notebook (40):** privacy help article, Google for Nonprofits
  article 16345471, `notebook.google` landing page.
- **HubSpot (3):** Terms of Service (16 Sep) diffed against the Internet
  Archive's 15 Sep capture; AI training article (8 Sep, unchanged).

## 8. Assumptions this run depends on

1. The published set was computed fresh from per-tab reads, never carried.
2. Every compared pair was checked non-empty before a "changed" or "unchanged"
   was allowed. The first HubSpot diff reported every line changed, because the
   archive served the page gzip-compressed. It was treated as a fetch failure,
   decompressed and re-run, and only then read.
3. Bot-blocks were not reported as defects. Of the 35 URLs `curl` flagged, every
   non-2xx one was re-followed in Chrome. All resolved to the expected live page
   except claude.ai (three addresses, a Cloudflare challenge) and SVG Repo (a
   Vercel checkpoint), both bot checks, plus the carried Nano Banana 404 and
   GradeMyPrompt's DNS failure.
4. The three cost writes record the currency this UK machine is served,
   verbatim, per the pricing convention. The underlying prices were not claimed
   to have moved.
5. Same-brand domain moves (notion.so, klingai.com, zocomputer.com, v0.dev,
   make.com) are not findings and were not written.
6. `reports/axis-policy-urls.json` was updated with this run's new baselines
   (HubSpot Terms, Adobe hosting, Granola, Gemini) and Wispr's moved article.
