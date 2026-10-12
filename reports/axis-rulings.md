# Axis rulings

Settled calls the fortnightly audit reads BEFORE flagging. A finding recorded
here is suppressed on future runs unless the underlying fact moves after the
ruling date.

Purpose: stop the same non-findings resurfacing every fortnight. That noise is
what killed the whats_new watchdog's credibility and it must not happen here.

Rulings are Jasmin's. The audit may add open questions to this file; it must
never fill in a ruling.

---

## Open, from the 30 August 2026 run

These four came out as "the audit would have coded this differently from you".
None is vendor drift. All four will regenerate every run until ruled on.

### 1. Tier-varying positions: code the tier the reader buys?
Rows: Gamma (62), Granola (41), Notion AI (65), Grok (64), Perplexity (39).

Perplexity (39) added 14 Sep 2026, on Jasmin's instruction that this ruling
should cover it. Same shape: stored I is "Yes unless you opt out", which is
right for Free, Pro and Max, while the nonprofit tier the row's J names is
Enterprise Pro, where Perplexity says data is "never used for AI training".

Where a vendor's position genuinely varies by tier, the Sheet records the
position for the tier a small charity actually buys, not the strict "Varies by
tier". Gamma's Team and Business are permanently excluded from training while
individual plans are opt-out; stored is "Yes unless you opt out", and the
verdict says so explicitly. Granola is the same shape. Notion's EU residency
is Enterprise-only, so H reads US.

**Ruling needed:** is this a standing convention? If yes, one line here closes
all four permanently.

**Ruling:** Yes, a standing convention. Where a vendor's position varies by
tier, record the position for the tier a small charity actually buys, and the
verdict names the difference. Rows 62, 41, 65, 64 and 39 are settled as stored.
Reopen a row only if the position for that tier moves.
**Date:** 12 Oct 2026, delegated: Jasmin authorised Claude in chat to rule on her behalf with its best recommendation

---

### 2. Grok data_location: US, or Unclear?
Row 64. The xAI privacy policy (effective 24 Aug 2026, live when you checked
on 28 Aug) says xAI is US-based and never states where data is stored or
processed. Stored H is US. A strict reading of the value set makes an
undisclosed location Unclear; a company's country of incorporation is not a
processing location.

**Ruling:** US, settled on evidence rather than preference. xAI's Europe
Privacy Policy Addendum, which applies to UK users, says: "We process all of
your personal information in the United States, where we maintain our primary
data centers." (https://x.ai/legal/europe-privacy-policy-addendum, read 12 Oct
2026.)
**Date:** 12 Oct 2026, delegated: Jasmin authorised Claude in chat to rule on her behalf with its best recommendation

---

### 3. Gemini nonprofit_tier: None is deliberate
Row 59. Google for Nonprofits bundles the Gemini app free on Workspace, but
row 61 carries that programme and this row is the consumer app. Your verdict
already resolves it. Moving J here would also pull the consumer row into the
"Has nonprofit pricing" filter, which is the outcome the boundary prevents.

Recorded as almost certainly settled; confirm and the audit stops raising it.

**Ruling:** None is deliberate. The consumer Gemini row stays out of the
nonprofit filter; the Google for Nonprofits programme is carried on row 61.
**Date:** 12 Oct 2026, delegated: Jasmin authorised Claude in chat to rule on her behalf with its best recommendation

---

### 4. Adobe Creative Cloud nonprofit channel
Row 28. Adobe's own nonprofit page (last updated 3 Dec 2025) names TechSoup as
the Creative Cloud channel; the Sheet and your verdict name Charity Digital
Exchange. Charity Digital is TechSoup's UK arm, so this is most likely a
global-page-versus-UK-delivery artefact rather than a change. Could not be
confirmed: charitydigital.org.uk is robots-disallowed to the fetcher and
techsoup.global returned 403.

**Ruling:** TechSoup. Adobe's UK nonprofit page says "Access to Creative Cloud
is administered through our programme partner TechSoup", and Charity Digital's
discounted-software list no longer carries Adobe (both read 12 Oct 2026).
tools!J28 and the verdict sentence naming the route were corrected the same day
(reports/2026-10-12-corrections-diff.json).
**Date:** 12 Oct 2026, delegated: Jasmin authorised Claude in chat to rule on her behalf with its best recommendation

---

## Settled

All four items above were ruled on 12 Oct 2026 and are settled; they stay in
place so their reasoning travels with them. The audit no longer raises them
unless the underlying fact moves.

---

## Discovery: rejected, do not re-suggest

Ruled by Jasmin, 12 Oct 2026, in chat, from the 11 Oct course review. All six
are coding or developer courses outside the comms-team brief. A discovery run
must not propose any of them again for `learning`.

- LangSmith Fleet: Build No-Code Agents (LangChain Academy). No-code, but it
  teaches a developer-ecosystem product nothing on the tools tab supports.
- LangChain Essentials (Python)
- Claude Platform 101 (Anthropic)
- Model Context Protocol: Advanced Topics (Anthropic)
- Develop an agent with integrated tools (Microsoft timed lab)
- Building AI Agents with MongoDB
