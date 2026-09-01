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
Rows: Gamma (62), Granola (41), Notion AI (65), Grok (64).

Where a vendor's position genuinely varies by tier, the Sheet records the
position for the tier a small charity actually buys, not the strict "Varies by
tier". Gamma's Team and Business are permanently excluded from training while
individual plans are opt-out; stored is "Yes unless you opt out", and the
verdict says so explicitly. Granola is the same shape. Notion's EU residency
is Enterprise-only, so H reads US.

**Ruling needed:** is this a standing convention? If yes, one line here closes
all four permanently.

**Ruling:**
**Date:**

---

### 2. Grok data_location: US, or Unclear?
Row 64. The xAI privacy policy (effective 24 Aug 2026, live when you checked
on 28 Aug) says xAI is US-based and never states where data is stored or
processed. Stored H is US. A strict reading of the value set makes an
undisclosed location Unclear; a company's country of incorporation is not a
processing location.

**Ruling:**
**Date:**

---

### 3. Gemini nonprofit_tier: None is deliberate
Row 59. Google for Nonprofits bundles the Gemini app free on Workspace, but
row 61 carries that programme and this row is the consumer app. Your verdict
already resolves it. Moving J here would also pull the consumer row into the
"Has nonprofit pricing" filter, which is the outcome the boundary prevents.

Recorded as almost certainly settled; confirm and the audit stops raising it.

**Ruling:**
**Date:**

---

### 4. Adobe Creative Cloud nonprofit channel
Row 28. Adobe's own nonprofit page (last updated 3 Dec 2025) names TechSoup as
the Creative Cloud channel; the Sheet and your verdict name Charity Digital
Exchange. Charity Digital is TechSoup's UK arm, so this is most likely a
global-page-versus-UK-delivery artefact rather than a change. Could not be
confirmed: charitydigital.org.uk is robots-disallowed to the fetcher and
techsoup.global returned 403.

**Ruling:**
**Date:**

---

## Settled

(none yet)
