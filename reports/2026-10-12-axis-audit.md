# Axis audit, 12 October 2026

Axis audit, 12 Oct 2026: 5 published rows checked. 4 facts updated. 1 needs
your judgement. 0 unreachable. 3 discovery candidates.

**Decided the same day.** Jasmin approved all three requests on 12 Oct 2026 in
chat. Written: the four stamps, the Anthropic course (learning row 28) and
WebAIM (design_kit row 47). The Digital Culture Network row was held until
she chose its learning `type`, which "yes to all" had not; she chose
Publication the same day and it was written to learning row 29. The six rejected courses are recorded in `reports/axis-rulings.md`.

Run in Claude Code on the 2nd Monday, an audit-due day, from the shared tree,
which was 32 commits behind `origin/overhaul/sector-axis`. None of those commits
touched an axis file: the prompt, `axis-rulings.md` and `axis-policy-urls.json`
were identical to the remote. No vendor's data, training or nonprofit position
moved on any row. The Internet Archive was offline all day.

## Row numbering, verified not assumed

Every row named in `reports/2026-08-28-sheet-edit-pack.md` lands on the same
tool in today's parse (row 40 under its new name, Gemini Notebook). Last data
row 68. `isComplete()` reimplemented with `normaliseDpiaFlag` lower-casing: 23
published, every flag exact-case, one Green (Google Workspace AI, 61). Tab sizes
read live: tools 67, my_stack 19, design_kit 45, learning 26.

No row is due on age: the oldest check is 49 days (24 Aug).

Triggered set, five rows: ElevenLabs (45), Grok (64) and Wispr Flow (63) on
Pass 1b; Microsoft Copilot (60) on Pass 1a; Google Workspace AI (61) as the
Green row, which also drifted.

## 1. Needs your judgement

### New this run

**Microsoft Copilot (60): the cost string can't be reconfirmed, so the row was
not stamped.** Stored:

> Copilot Chat included with M365 / add-on £23.10/user/mo billed annually, £24.26 monthly

The enterprise pricing page still confirms £23.10 a user a month, paid yearly,
and still shows no monthly figure, as it didn't on 30 August. Separately,
Microsoft's business page now sells **Microsoft 365 Copilot Business**, an
add-on for organisations of up to 300 users, at £16.10 a user a month (shown
as a promotion at £13.80), paid yearly, with a pay-monthly option. That's the
add-on a small charity is more likely to buy. Moving the string to it is a
restructure, so it's flagged, not written. The verdict quotes no price, so it's
unaffected. The trustee note is unaffected. Decision needed: what the cost
string should say. No wording is proposed.

Everything else on the row holds: Microsoft's enterprise data protection page is
still dated 18 Aug ("Your data isn't used to train foundation models"), and the
nonprofit page still offers Business Basic free for up to 300 users and the
Copilot add-on at $25.50, which is 15% off the $30 list price.

### Discovery pickup, 5 Oct run plus the 11 Oct course review

From the Cowork trigger's 5 Oct run (two additions, no retirements, final
message read in full and not cut short) and your course review in the same
session on 11 Oct. No earlier report decides this run. All three were checked in
headless Chrome from this machine. None duplicates a name or URL on `tools`,
`my_stack`, `design_kit` or `learning` (compared without scheme, www or trailing
slash).

| Tab | Name | Final URL | Action | Reason given | Verification |
|---|---|---|---|---|---|
| learning | Building effective human-agent teams | `https://academy.claude.com/courses/building-effective-human-agent-teams` | Add | Comms teams need clear human sign-off on agent work | Loads. Anthropic. Beta. 5 lessons, 45 min, 1 quiz, completion badge. "No technical background needed." No price shown; lesson 1 opens without signing in, sign-in only saves progress |
| learning | Digital Culture Network | `https://digitalculturenetwork.org.uk/` | Add | Free Arts Council digital support for English cultural orgs | Loads. Funded by Arts Council England: "There is no charge for any Digital Culture Network support." One-to-one support is limited (see below) |
| design_kit | WebAIM Contrast Checker | `https://webaim.org/resources/contrastchecker/` | Add | Free WCAG colour check for charity web accessibility | Loads. Free, no account. WebAIM is "a non-profit service center at Utah State University" |

Concerns, before you approve anything:

1. **Building effective human-agent teams overlaps learning row 4** (the
   Anthropic Academy full course catalogue), which already points at
   everything Anthropic publishes. It also sits in a collection that goes on to
   promote Claude Tag, Anthropic's Slack product. The course's audience, in its
   own words, is "team leads and innovators whose organizations already use AI
   in single-player mode", so it isn't a beginner course. Its four principles
   are "clear roles, a written north star, gradual release, and the right
   information access". The log's "human sign-off" is a fair reading of roles
   and gradual release, but the page doesn't use those words. "Free" is
   inferred: no price appears and lesson 1 opens signed out.
2. **Digital Culture Network is England-only and arts-only for its main
   offer.** One-to-one support is for "creative and cultural organisations in
   receipt of, or eligible for funding from Arts Council England"; its form
   turns away "Outside England". A general charity, or anyone in Scotland,
   Wales or Northern Ireland, gets the Knowledge Hub, events and podcast only.
   It's also a support service, not a course, and **no existing learning
   `type` fits** (Course, Documentation, Tool, Publication, Newsletter are the
   five in use). Which type should it carry?
3. **WebAIM overlaps design_kit row 43, Delphitools**, which sits in the same
   Accessibility / Check Before You Ship / Check slot and already includes a
   WCAG contrast checker. Coolors (row 12) has one built in too.

Drafted rows follow. **Every copy cell is a draft for your sign-off, and the
first-person lines are yours to make**: I don't know whether you've taken the
course or use WebAIM, so the drafts avoid claiming either, but they print under
"Why I recommend:" on `/learning` and under the verdict toggle on
`/design-kit`, where they read as yours. Contractions follow the repo's voice
rule; the existing learning rows mostly don't use them.

**learning, row 28 (first empty row):**

| Column | Draft |
|---|---|
| name | Building Effective Human-Agent Teams |
| category | Learn |
| type | Course |
| provider | Anthropic |
| what_it_is | Short course on moving a team from using AI one person at a time to working alongside a shared agent: clear roles, gradual release, and what the agent can see. No technical background needed. |
| why_i_recommend | I'd put this in front of any team lead whose organisation already uses AI and is starting to hand work to an agent. It's short, and it's about roles and access rather than the tool. It's in beta, so expect it to change. If your team is newer to AI, do the Nonprofit Track first. |
| time | 45 min |
| cost | Free (beta) |
| url | https://academy.claude.com/courses/building-effective-human-agent-teams |

`Free (beta)` follows learning row 9. The name drops the "Anthropic Academy"
prefix rows 2 to 5 carry, since that prefix uses an em dash; it's your label
either way.

**learning, row 29:**

| Column | Draft |
|---|---|
| name | Digital Culture Network |
| category | Reference |
| type | **Your call** (no existing value fits) |
| provider | Arts Council England |
| what_it_is | Free digital support for creative and cultural organisations in England: one-to-one sessions with specialist Tech Champions, events, a podcast and a Knowledge Hub of guides. |
| why_i_recommend | If you work in an arts organisation, museum or library in England, this is free expert time most teams don't know they can book, on social media, email, websites, accessibility and data. One-to-one support is only for organisations that get, or could get, Arts Council funding. Everyone else can still use the Knowledge Hub. |
| time | As needed |
| cost | Free |
| url | https://digitalculturenetwork.org.uk |

`Reference` is a suggestion: it isn't a course you start and finish. Unchecked:
whether every Knowledge Hub article is open to all; the site doesn't say, but
the hub was readable signed out.

**design_kit, row 47 (first empty row):**

| Column | Draft |
|---|---|
| name | WebAIM Contrast Checker |
| category | Accessibility |
| phase | Check Before You Ship |
| group | Check |
| url | https://webaim.org/resources/contrastchecker/ |
| what_it_does | Enter a text colour and a background colour and it gives the contrast ratio, with a pass or fail against WCAG AA and AAA for normal text, large text and interface components. Free, no account. From WebAIM, a non-profit at Utah State University. |
| when_to_use | When you're checking one colour pair, a button on a brand colour or text over an image, and want a result you can quote. Each check has a permalink you can send to a designer or supplier. |
| cost | Free |
| verdict | WebAIM is a long-standing accessibility non-profit, so a result from its checker carries weight with a designer or supplier. It checks one pair at a time; for a whole palette, Delphitools is quicker. |

Category, phase and group copy Delphitools (row 43).

Two things to know before writing: `scripts/sheet-write.mjs` can't insert a
row, so each addition goes into the first empty row with `"oldName": ""`; and
`--rollback` can't blank a name or cost, so removing an added row is by hand.

**Rejected, and recorded in `reports/axis-rulings.md` once you confirm:**
LangSmith Fleet no-code agents, LangChain Essentials, Claude Platform 101, MCP
Advanced Topics, the Microsoft agent lab and the MongoDB agents course. All are
coding or developer courses outside the comms-team brief.

### Closed this run

- **Wispr Flow (63) J is reconfirmed.** `wisprflow.ai/for-non-profits` says
  non-profits get "Flow Pro for just $8/mo (on the annual plan)", so the stored
  value stands and the row can be stamped.

### Carried, still unruled (not re-argued)

1. HubSpot (3) cost string: a structure HubSpot no longer uses.
2. HubSpot (3) nonprofit pilot: Australia, New Zealand, USA and Canada only.
3. Adobe Express (29) URL still serves Firefly.
4. Windsurf (16) still redirects to Devin Desktop.
5. Smartmockups (tools 35, design_kit 41) still lands on canva.com/mockups.
6. GradeMyPrompt (learning 15): domain still doesn't resolve.
7. Nano Banana (32): still 404.
8. Learning names with an em dash: rows 2, 3, 4 and 5, not only 2 and 3 as the
   28 Sep report said. All four are the Anthropic Academy rows.
9. Perplexity (39) J rests on a June 2024 post only.
10. The four open items in `reports/axis-rulings.md`. One note for ruling 2:
    xAI's 11 Oct policy still says only that the company is "US-based" and
    names no storage location.

### Noticed, not a defect

- **design_kit rows 45 and 46 (Realtime Colors, Haikei) have an empty
  `what_it_does`.** The 29 Sep copy pass wrote `when_to_use` and the verdict
  only. Nothing on the site shows it: `DesignKit.tsx` never prints
  `what_it_does`. The column stays empty unless you want it filled.

## 2. Facts updated, written and confirmed

Four `last_checked` stamps, from `reports/2026-10-12-axis-diff.json`, each on a
row where every fact field was reconfirmed from the vendor today and nothing
moved. 4/4 re-read from the Sheet after writing. On production `/tools`, on a
fresh load at 1280 wide, 23 cards rendered and "12 Oct 2026" appears exactly
four times, once on each of the four cards.

- **ElevenLabs (45):** policy updated 9 Oct, read directly. Storage in the US,
  trains unless you opt out, Impact Program still free by application,
  Starter $6 (served in USD).
- **Google Workspace AI (61), the Green row:** the 6 Oct update added one
  question, on guardrails when files are shared outside the organisation (an
  out-of-domain banner, and Gemini stops drawing on your Drive and Gmail for
  externally shared files by default). Training is still "No" under the same
  Training Restriction wording; free nonprofit tier and "75%+ off" Business
  Standard unchanged. **No fact moved, so the Green-row escalation does not
  fire.** Recorded because it's the row a board takes on trust.
- **Wispr Flow (63):** training still on by default with an opt-out; privacy
  policy unchanged; nonprofit $8 confirmed; Pro £12 annual, £15 monthly.
- **Grok (64):** policy diffed against xAI's own previous version. No change to
  training, opt-outs or location. One sentence asking users not to put
  personal information in prompts was removed; the verdict and trustee note
  already tell readers to keep supporter content out, so neither is in doubt.

## 3. Could not check

- **The Internet Archive was offline all day**, so ElevenLabs, the Workspace
  hub and Wispr's docs article were read directly rather than diffed. Grok had
  its own previous version.
- **OpenAI's rest-of-world privacy policy** returned a Cloudflare 403 once and
  loaded on retry, still dated 6 Feb. First occurrence, not a failure.
- **Vendors publishing no date**, so the 90-day clock is the only backstop:
  Descript's help page, Submagic, Seedance's CapCut trust page, Gemini
  Notebook, Canva's trust page, Gamma's help article and Notion AI (both).

Pass 1d: nothing failed in both this run and the last. The Perplexity article
that failed on 28 Sep loaded today, still dated 3 Sep.

## 4. Became completable

None. Still 23 published of 67.

## 5. The toggles

No H, I or J value was proposed, so no row enters or leaves any filter.
`hasNonprofitPricing()` and `doesNotTrainOnInput()` are both inert this run.
The training filter still holds seven rows (28, 29, 40, 46, 60, 61, 65); two
were reconfirmed from the vendor today (60 and 61).

## 6. What was written

22 cells, every one re-read from the Sheet after writing. A full re-read of all
four tabs against the morning's snapshot found no other cell changed: tools 4
cells, learning 9 (row 28), design_kit 9 (row 47), my_stack none.

| Cell | Field | Old | New |
|---|---|---|---|
| `tools!M45` | last_checked | 24 Aug 2026 | 12 Oct 2026 |
| `tools!M61` | last_checked | 28 Sep 2026 | 12 Oct 2026 |
| `tools!M63` | last_checked | 24 Aug 2026 | 12 Oct 2026 |
| `tools!M64` | last_checked | 28 Aug 2026 | 12 Oct 2026 |
| `learning!A28:I28` | new row | (blank) | Building Effective Human-Agent Teams, as drafted in section 1 |
| `design_kit!A47:I47` | new row | (blank) | WebAIM Contrast Checker, as drafted in section 1 |
| `learning!A29:I29` | new row | (blank) | Digital Culture Network, as drafted in section 1, type Publication |

The Digital Culture Network row is in `reports/2026-10-12-dcn-addition-diff.json`,
written later the same day: 9/9 re-read, no other learning cell changed, and
`/learning` shows it once with its "Why I recommend:" line and link. The first
two rows are in `reports/2026-10-12-discovery-additions-diff.json`, each
cell carrying `"approved": "12 Oct 2026, in chat"`. Checked live: `/learning`
shows the course once, with its "Why I recommend:" line and link;
`/design-kit` shows WebAIM once, with `when_to_use` on the card and the verdict
opening under "Why I use it".

To undo the stamps:

```
node scripts/sheet-write.mjs reports/2026-10-12-axis-diff.json --rollback --commit
```

The two rows are removed by hand: the guard refuses a blank name or cost, so
`--rollback` cannot empty them.

## 7. Sources log

Every position is from the vendor's own page, loaded 12 Oct 2026 from this
machine in headless Chrome (the installed Chrome, normal user agent, UK
locale). Per-cell sources are in the diff file.

- **Pass 1a:** 157 URLs across the four tabs. curl flagged 31; every non-2xx
  one was re-followed in Chrome. All resolved to the expected live page except
  claude.ai (three addresses, a Cloudflare challenge) and SVG Repo (a Vercel
  checkpoint), both bot checks, plus the carried Nano Banana 404 and
  GradeMyPrompt's DNS failure.
- **Pass 1b:** 36 policy URLs for the 23 published rows. Newer than baseline:
  ElevenLabs (9 Oct), Workspace hub (6 Oct), Grok (11 Oct), Wispr docs
  (relative, about 9 Oct). Everything else matched its baseline.
- **Copilot (60):** enterprise data protection page (18 Aug), UK enterprise
  pricing page, UK business pricing page, nonprofit offers page.
- **Discovery:** each candidate's own page, plus the Digital Culture Network's
  About, FAQ and Ask a Tech Champion pages and WebAIM's About page.

## 8. Assumptions this run depends on

1. The published set was computed fresh from per-tab reads, never carried.
2. Every compared pair was checked non-empty first. The Grok diff compared 312
   sentences on each side, and only 14 changed, so it wasn't a fetch failure.
3. Bot checks weren't reported as defects.
4. Same-brand domain moves are not findings and were not written:
   notion.so, klingai.com, zocomputer.com, v0.dev, and new this run
   copilot.microsoft.com to copilot.com (tools 60, my_stack 18), which lands on
   Microsoft's Copilot page with a sign-in prompt.
5. Prices are recorded as served to a UK machine: ElevenLabs and SuperGrok in
   USD, the rest in GBP.
6. `reports/axis-policy-urls.json` now carries this run's baselines
   (ElevenLabs' new address, the Workspace hub, Grok and its previous-version
   link) and notes on OpenAI's intermittent challenge and Wispr's nonprofit
   page.
7. Playwright's bundled browser isn't installed for the repo's current version,
   so the installed Chrome was used (`channel: 'chrome'`). Nothing was
   downloaded.
