# Axis audit, 30 August 2026

23 published rows checked. 0 facts updated. 7 need your judgement.
9 unreachable.

## Before anything else: nothing was written, and nothing could have been

The write path does not exist yet. Scenario `6908270` was read with
`scenarios_get` this run and it is unchanged since 11 August: `hookId: null`,
`scheduling: on-demand`, one Google Sheets module whose body is still the
hardcoded Zo Computer literal writing to `tools!A68:F68`. Build steps 1 to 9
in the pipeline spec have not been carried out. There is no webhook, no
filter, no `{{1.body_json}}` mapping.

Separately, the webhook URL and shared secret reached this run as unfilled
placeholders, so even a built webhook could not have been called.

So this is a read-only run. Every finding below is flagged, none is written,
and no `last_checked` stamp was touched on any row. That is the correct
outcome given the state of the pipeline, not a failure of the run.

Two things follow. The scenario needs building before the 15 September run, or
that run produces another read-only report. And the shared secret needs to
reach the run some way that isn't a placeholder in the task text.

## The other structural finding: column D cannot be checked from here

This session fetches from a US-geolocated environment. Every vendor that
geo-prices its pages served USD and ignored UK paths. That hit HubSpot,
Claude, ChatGPT and Adobe Express directly: their stored column D values are
in GBP and none of them could be reverified.

Assumption 5 in the spec says the GBP question folds into the pipeline and
becomes a standing part of every run. It doesn't. Not for GBP-served vendors,
not from this environment. A second class of failure sits alongside it:
Gamma, Gemini and Seedance render prices client-side, so a static fetch
returns tier names and no numbers.

Between them that is nine of the 23 rows where at least one field could not be
reached. Fixing it needs a rendering browser with a UK exit, or those figures
stay a manual job.

## 1. Needs your judgement

### 1.1 HubSpot (row 3), nonprofit_tier: None -> a programme now exists
Source: https://www.hubspot.com/nonprofits, checked 30 Aug 2026, no
last-updated date published.
Fact written to the Sheet: no. Current dpia_flag: Red.

HubSpot now runs its own nonprofit pilot: 40% off list on Professional and
Enterprise, new customers only, one-year commitment, and currently limited to
North America, Australia and New Zealand. Starter is excluded.

Trustee note, verbatim: "We ran a DPIA before switching on HubSpot's AI
features, because they sit on top of our supporter database and HubSpot trains
on what we put in unless we turn that off."

Nothing in the verdict or the trustee note quotes the absence of a nonprofit
tier, so neither is contradicted. The question is column J alone, and it is a
real one: the programme exists but a UK charity cannot use it.

There is a mechanical consequence, which I missed on the first pass and which
sharpens this. `hasNonprofitPricing()` in `src/lib/sheets.ts` passes any J
value except None. So writing the programme into J does not just change a
line of text: it moves a Red-flagged row into the "Has nonprofit pricing"
filter, where a UK reader will find it by filtering for exactly the thing they
cannot have. The stored None is currently doing filter work, not just
descriptive work.

Your ruling needed on: whether J stays None for a programme that excludes the
UK, or records it with the geography attached and accepts the filter entry.

### 1.2 HubSpot (row 3), cost: the tier structure moved, not just the number
Source: https://www.hubspot.com/pricing/marketing, checked 30 Aug 2026, no
last-updated date published.
Fact written to the Sheet: no, and it falls outside the column D carve-out.

Marketing Hub Starter is no longer a flat monthly fee. It is now seat plus
credit based: $20 per seat monthly or $7 per seat annually, bundling 500
HubSpot Credits and 1,000 marketing contacts. The stored string, "Free CRM /
Marketing Starter from £18 a month", describes a pricing model HubSpot has
stopped using.

The GBP figure could not be confirmed, per the geolocation limit above, so
even the number is open.

Your ruling needed on: the new shape for column D. This is a structure change,
so the pipeline flags it and leaves it alone by design.

### 1.3 Adobe Express (row 29), url points at a different product
Source: https://firefly.adobe.com, checked 30 Aug 2026.
Fact written to the Sheet: no. Column F is yours. Current dpia_flag: Amber.

The stored URL resolves cleanly, but it serves Adobe Firefly, not Adobe
Express. Firefly is the standalone generative studio; Express is the design
app. The row is named Adobe Express and its cost and nonprofit values are
Express values.

Verdict sentence in doubt, verbatim: "The AI image generator to reach for when
the picture is going out under your name, because Firefly is trained on Adobe
Stock and licensed content rather than whatever was scraped."

That sentence is about Firefly. So is the URL. The name, the price and the
nonprofit tier are about Express. The row is currently two products.

Your ruling needed on: which product this row is, then the URL or the name
follows from that.

### 1.4 NotebookLM (row 40), the product has been renamed
Source: https://workspaceupdates.googleblog.com/2026/07/notebooklm-now-gemini-notebook.html,
checked 30 Aug 2026, published 16 Jul 2026.
Fact written to the Sheet: no. Column A is yours. Current dpia_flag: Amber.

Google renamed NotebookLM to Gemini Notebook on 16 July. Old links redirect,
so nothing is broken, but the name in column A, the verdict and the trustee
note all use a name Google has retired.

Trustee note, verbatim: "NotebookLM only ever sees the documents we choose to
upload, so the decision is what goes in the folder, and we check that because
Google doesn't publish where those documents are processed."

Worth saying plainly: the rename predates the row's 24 August check by five
weeks, so this was missed at the time rather than drifting since.

All four fact fields were reverified and are unchanged.

Your ruling needed on: the name, and whether the verdict and trustee note get
rewritten with it.

### 1.5 Seedance (row 49), the verdict states specifics the vendor no longer publishes
Source: https://dreamina.capcut.com/clause/dreamina-privacy-policy, checked
30 Aug 2026, page last updated 30 Apr 2026. Also checked
https://www.capcut.com/trust/privacy, no last-updated date published.
Fact written to the Sheet: no. Current dpia_flag: Red.

Verdict sentence in doubt, verbatim: "The hosted product is ByteDance's: your
data sits on servers in the US, Singapore and Malaysia under a Singapore-law
policy, it trains on what you give it, and there's no opt-out and no UK
footing to speak of."

The training claim holds: the policy says input is used "to train and improve
our technology" with no opt-out offered. The location claim could not be
re-sourced. Neither the Dreamina privacy policy nor the CapCut trust centre
names a processing or storage country anywhere. The trust centre names the US,
EEA and Singapore as where the privacy team sits, which is not the same claim.

That leaves column H reading "Other" on a basis this run could not find. I am
not proposing a change to it: on a Red row, moving H toward Unclear on the
strength of an absence would weaken a flag rather than inform it, and the
sentence may rest on a source I didn't reach.

This is the one genuinely ambiguous item in the run. What would settle it: the
source you used on 28 August for the US, Singapore and Malaysia claim. If it
was a sub-processor list or a regional terms page rather than the main policy,
the verdict stands and only the sources log needs it.

Your ruling needed on: whether the verdict sentence survives, and what H rests
on.

### 1.6 Google Workspace AI (row 61), the Green row, and a caveat inside it
Sources: https://knowledge.workspace.google.com/admin/generative-ai/generative-ai-in-google-workspace-privacy-hub,
checked 30 Aug 2026, page last updated 14 Aug 2026; and
https://knowledge.workspace.google.com/admin/generative-ai/workspace-with-gemini/gemini-for-google-workspace-faq-business,
checked 30 Aug 2026, page last updated 26 Aug 2026.
Fact written to the Sheet: no change to write. Current dpia_flag: Green.

This row was checked because it is Green, which the spec makes non-droppable
every run. All four fact fields are unchanged and well sourced. The 26 August
FAQ update postdates the row's 25 August check, which is a trigger in its own
right, and the position it states is the same one.

No value moved, so this is not an escalation. It is a caveat found while
checking, and it touches the Green trustee note.

Trustee note, verbatim: "Workspace AI runs inside the Google account we
already use, under the data terms we already signed, so using it doesn't move
our information anywhere new."

The privacy hub singles out Gemini Notebook as an exception where an
organisation's data-region settings do not apply. On a Green row whose trustee
note turns on nothing moving anywhere new, a named feature that sits outside
the org's data-region controls is the sort of thing a trustee would want to
have been told.

Your ruling needed on: whether the trustee note takes an exception, or the
caveat is too narrow to earn a sentence.

### 1.7 Notion AI (row 65), data_location: an EU option exists, gated to Enterprise
Sources: https://www.notion.com/help/data-residency and https://trust.notion.com,
both checked 30 Aug 2026, neither publishes a last-updated date.
Fact written to the Sheet: no. Current dpia_flag: Amber.

Notion offers data residency in EU-Central-1 (Frankfurt), plus Tokyo and
Seoul, free of charge, to Enterprise plan customers only. The default for
everyone else stays the US.

Trustee note, verbatim: "Notion AI can read whatever we already keep in
Notion, so what we store there is the real decision, and it processes in the
US."

That note is accurate for anyone your readers actually are. The charity route
is 50% off Business, and Business does not get data residency.

Neither page carries a date, so I cannot tell whether this is new since 24
August or whether you mapped H to US deliberately because the option is out of
reach for the audience. If it was deliberate, this needs no action beyond a
line in the sources log. What would settle it: your note from the 24 August
check.

Your ruling needed on: whether H records an option the audience cannot buy.
The same question will recur on every vendor that gates residency to
Enterprise.

## 2. Facts updated, already written and confirmed

None. There is no write path. See the top of this report.

## 3. Could not check

`last_checked` was not stamped on any row this run, so nothing here needed
protecting from a false stamp. Listed anyway, because these are the fields a
working pipeline would still fail on.

Geolocation, GBP figures served as USD with no UK path available:

- HubSpot (row 3), cost. https://www.hubspot.com/pricing/marketing
- Adobe Express (row 29), cost. https://www.adobe.com/express/pricing
- Claude (row 57), cost. https://claude.com/pricing served $17 annual, $20
  monthly. Proportionate to the stored £15 and £18, which is an inference, not
  a check.
- ChatGPT (row 58), cost. https://openai.com/business/pricing/ served USD.

Client-side rendering, tier names visible, figures absent from the HTML:

- Gamma (row 62), cost figures. https://gamma.app/pricing
- Gemini (row 59), cost. Google AI plan pages either 404 or render prices in
  script. Secondary reporting disagrees with itself on the AI Plus price, so
  the stored $4.99 is unverified and has a live lead against it.
- Seedance (row 49), cost. Dreamina pricing is app or login gated.

Other:

- Seedance (row 49), nonprofit_tier. No vendor page confirms a programme and
  none confirms the absence of one. Stored "None" is unconfirmed in both
  directions.
- Microsoft Copilot (row 60), the monthly figure. The enterprise pricing page
  now lists only the £23.10 annual-commitment price and routes monthly
  enquiries to sales. £23.10 annual confirmed at
  https://www.microsoft.com/en-gb/microsoft-365-copilot/pricing/enterprise.
  The stored £24.26 monthly is not on the page any more.
- Adobe Creative Cloud (row 28), nonprofit channel. Adobe's own nonprofit page
  (https://helpx.adobe.com/enterprise/using/non-profit.html, last updated
  3 Dec 2025) names TechSoup as the Creative Cloud channel, not Charity
  Digital Exchange. Charity Digital is TechSoup's UK arm, so this is most
  likely a global-page-versus-UK-delivery artefact rather than a change, and
  the Adobe page predates your 25 August check. I could not confirm it:
  charitydigital.org.uk is robots-disallowed to this fetcher and
  techsoup.global returned 403. Your verdict sentence "Charity Digital
  Exchange is the route to the discount and it's a meaningful one" is not
  contradicted by anything I found. Flagged as a lead, not a finding, and
  worth one manual look.

Descript (row 46) is deliberately not in this list. The pricing page rendered
its monthly and annual labels transposed to the fetcher, giving an incoherent
"$16 monthly, $24 annual, saving up to 35%". The page's own 35% saving figure
resolves it: 35% off $24 is $15.60, so $24 is monthly and $16 is annual,
exactly as stored. No change.

## 4. Became completable

None. All 44 unpublished rows are missing all seven axis fields, not just the
three judgement ones. Nothing has entered the queue.

## 5. The two toggles, and the check that came back clean

Reading `src/lib/sheets.ts` this run turned up something the first pass of this
report did not say, and it is the most reassuring result in it.

`doesNotTrainOnInput()` passes only "No" and "No by default". "Varies by tier"
deliberately does not pass. Seven published rows currently sit inside that
filter: Adobe Creative Cloud (28), Adobe Express (29), NotebookLM (40),
Descript (46), Microsoft Copilot (60), Google Workspace AI (61) and Notion AI
(65). One of them is the Green row.

Those seven are where the site makes its strongest claim, and a move on any of
them drops the row out of the filter silently, with no visible breakage. All
seven were reverified against vendor sources this run and none moved. Adobe's
content-analysis FAQ (4 Jun 2026), Descript's help-centre data-privacy page,
Microsoft's enterprise data protection page (18 Aug 2026), the Workspace
Gemini FAQ (26 Aug 2026) and Notion's AI product page all state the same
position they stated at the last check.

That is the sentence worth taking from this run: the filter that carries the
most weight has not moved.

## 6. Mapping disagreements, not changes

These are cases where I read the same source you did and would have coded it
differently. None is drift, so none is an escalation, and they are listed here
so the difference is on the record rather than resurfacing as a finding every
fortnight.

Four of them share one shape, and it is worth naming as a convention rather
than re-litigating row by row. Where a vendor's position genuinely varies by
tier, you have coded the tier your reader actually buys. That is defensible
and consistent, and on my first pass I recorded it for Grok, Gemini and Notion
and quietly let two others through as "same". Both belong here:

- Gamma (row 62), trains_on_input. Team and Business are permanently excluded
  from training and cannot opt in; individual plans are opt-out with the
  default on. Strictly that is Varies by tier. Stored is "Yes unless you opt
  out", which is the individual position, and your verdict says so explicitly:
  "on the individual plans a small team would buy, it trains on your content
  unless you switch that off in settings". Source:
  https://help.gamma.app/en/articles/12281928-does-gamma-use-my-content-to-train-its-ai-features,
  checked 30 Aug 2026.
- Granola (row 41), trains_on_input. Enterprise workspaces are opted out by
  default; individual and Business are opt-out with the default on. Same
  shape, same convention. Source:
  https://docs.granola.ai/help-center/policies/privacy-policy, checked 30 Aug
  2026, page effective 24 Jul 2026.

Neither changes filter membership, because both rows sit outside the
"Doesn't train on your content" toggle either way. If you want the convention
written down rather than re-derived, that is a one-line ruling and it would
close all four.

The other two:

- Grok (row 64), data_location. The xAI privacy policy
  (https://x.ai/legal/privacy-policy, effective 24 Aug 2026, checked 30 Aug
  2026) says xAI is US-based and never states where data is stored or
  processed. Stored H is US. That policy version was live on your 28 August
  check, so you saw it. On a strict reading of the value set, an undisclosed
  location is Unclear and a company's country of incorporation is not a
  processing location.
- Gemini (row 59), nonprofit_tier. Google for Nonprofits bundles the Gemini
  app free on Workspace. Stored J is None, and your verdict already resolves
  why: "On the free Google for Nonprofits edition you get the same Gemini app
  on Workspace terms, where it doesn't train on your chats." The boundary is
  deliberate and row 61 carries the programme. Moving J here would also pull
  the consumer row into the "Has nonprofit pricing" filter, which is the
  outcome the boundary exists to prevent. No action needed. Recording it so
  the next run does not raise it again.

## 7. Sources log

| Row | Field | Source | Checked | Source last updated |
|---|---|---|---|---|
| 3 HubSpot | data_location | https://legal.hubspot.com/hubspot-regional-data-hosting-policy | 30 Aug 2026 | 14 Apr 2026 |
| 3 HubSpot | trains_on_input | https://knowledge.hubspot.com/account-management/hubspot-ai-mode-training | 30 Aug 2026 | 10 Jul 2026 |
| 3 HubSpot | nonprofit_tier | https://www.hubspot.com/nonprofits | 30 Aug 2026 | none published |
| 3 HubSpot | cost | https://www.hubspot.com/pricing/marketing | 30 Aug 2026 | none published |
| 5 Blotato | data_location | https://www.blotato.com/privacy-policy | 30 Aug 2026 | not established (one pass returned 17 Oct 2024) |
| 5 Blotato | trains_on_input | https://www.blotato.com/privacy-policy, https://www.blotato.com/terms-of-service | 30 Aug 2026 | ToS 18 May 2026 |
| 5 Blotato | nonprofit_tier, cost | https://blotato.com/pricing | 30 Aug 2026 | none published |
| 27 Canva | data_location | https://www.canva.com/trust/privacy/ | 30 Aug 2026 | none published |
| 27 Canva | trains_on_input | https://www.canva.com/policies/privacy-policy/ | 30 Aug 2026 | 25 Aug 2026 |
| 27 Canva | nonprofit_tier | https://www.canva.com/nonprofits/ | 30 Aug 2026 | none published |
| 27 Canva | cost | https://www.canva.com/en_gb/pricing/ | 30 Aug 2026 | none published |
| 28 Adobe CC | data_location | https://www.adobe.com/trust/creative-cloud-hosting-locations.html | 30 Aug 2026 | 19 Jul 2026 |
| 28 Adobe CC | trains_on_input | https://helpx.adobe.com/account/individual/terms-policies-and-regulations/content-analysis-faq.html | 30 Aug 2026 | 4 Jun 2026 |
| 28 Adobe CC | nonprofit_tier | https://helpx.adobe.com/enterprise/using/non-profit.html | 30 Aug 2026 | 3 Dec 2025 |
| 28 Adobe CC | cost | https://www.adobe.com/uk/creativecloud/plans.html | 30 Aug 2026 | none published |
| 29 Adobe Express | url | https://firefly.adobe.com | 30 Aug 2026 | none published |
| 29 Adobe Express | trains_on_input | https://helpx.adobe.com/firefly/web/get-started/learn-the-basics/adobe-firefly-faq.html | 30 Aug 2026 | 2 Sep 2025 |
| 29 Adobe Express | nonprofit_tier | https://www.adobe.com/be_en/nonprofits/express.html | 30 Aug 2026 | none published |
| 33 Ideogram | data_location, trains_on_input | https://ideogram.ai/legal/privacy | 30 Aug 2026 | 15 Jan 2025 |
| 33 Ideogram | nonprofit_tier, cost | https://ideogram.ai/pricing | 30 Aug 2026 | none published |
| 39 Perplexity | data_location | https://www.perplexity.ai/hub/legal/privacy-notice | 30 Aug 2026 | 8 Jul 2026 |
| 39 Perplexity | trains_on_input | https://www.perplexity.ai/help-center/en/articles/11564572-data-collection-at-perplexity | 30 Aug 2026 | 16 Jul 2026 |
| 39 Perplexity | nonprofit_tier | https://www.perplexity.ai/hub/blog/bringing-perplexity-to-education-and-not-for-profits | 30 Aug 2026 | none published |
| 39 Perplexity | cost | https://www.perplexity.ai/hub/pricing | 30 Aug 2026 | none published |
| 40 NotebookLM | name | https://workspaceupdates.googleblog.com/2026/07/notebooklm-now-gemini-notebook.html | 30 Aug 2026 | 16 Jul 2026 |
| 40 NotebookLM | data_location, trains_on_input | https://support.google.com/notebooklm/answer/17004255 | 30 Aug 2026 | none published |
| 40 NotebookLM | nonprofit_tier | https://support.google.com/nonprofits/answer/16345471 | 30 Aug 2026 | none published |
| 41 Granola | data_location, trains_on_input | https://docs.granola.ai/help-center/policies/privacy-policy | 30 Aug 2026 | 24 Jul 2026 |
| 41 Granola | nonprofit_tier, cost | https://www.granola.ai/pricing | 30 Aug 2026 | none published |
| 45 ElevenLabs | data_location, trains_on_input | https://elevenlabs.io/privacy | 30 Aug 2026 | 20 May 2026 |
| 45 ElevenLabs | nonprofit_tier | https://elevenlabs.io/impact-program | 30 Aug 2026 | none published |
| 45 ElevenLabs | cost | https://elevenlabs.io/pricing | 30 Aug 2026 | none published |
| 46 Descript | data_location | https://descript.com/privacy | 30 Aug 2026 | 14 Apr 2025 |
| 46 Descript | trains_on_input | https://help.descript.com/account-and-app-settings/data-privacy | 30 Aug 2026 | none published |
| 46 Descript | nonprofit_tier | https://help.descript.com/billing-payments-plans/nfp-edu | 30 Aug 2026 | none published |
| 46 Descript | cost | https://descript.com/pricing | 30 Aug 2026 | none published |
| 47 Submagic | data_location, trains_on_input | https://submagic.co/privacy | 30 Aug 2026 | not captured |
| 47 Submagic | nonprofit_tier, cost | https://submagic.co/pricing | 30 Aug 2026 | none published |
| 49 Seedance | data_location, trains_on_input | https://dreamina.capcut.com/clause/dreamina-privacy-policy | 30 Aug 2026 | 30 Apr 2026 |
| 49 Seedance | data_location | https://www.capcut.com/trust/privacy | 30 Aug 2026 | none published |
| 57 Claude | data_location | https://privacy.claude.com/en/articles/7996890-where-are-your-servers-located-do-you-host-your-models-on-eu-servers | 30 Aug 2026 | 15 Jun 2026 |
| 57 Claude | trains_on_input | https://www.anthropic.com/legal/privacy | 30 Aug 2026 | 8 Jul 2026 |
| 57 Claude | nonprofit_tier | https://claude.com/solutions/nonprofits | 30 Aug 2026 | none published |
| 57 Claude | cost | https://claude.com/pricing | 30 Aug 2026 | none published |
| 58 ChatGPT | data_location | https://openai.com/policies/row-privacy-policy/ | 30 Aug 2026 | 6 Feb 2026 |
| 58 ChatGPT | trains_on_input | https://openai.com/policies/privacy-policy | 30 Aug 2026 | 18 May 2026 |
| 58 ChatGPT | nonprofit_tier | https://help.openai.com/en/articles/9359041-openai-for-nonprofits | 30 Aug 2026 | none published |
| 58 ChatGPT | cost | https://openai.com/business/pricing/ | 30 Aug 2026 | none published |
| 59 Gemini | data_location, trains_on_input | https://support.google.com/gemini/answer/13594961 | 30 Aug 2026 | 10 Aug 2026 |
| 59 Gemini | nonprofit_tier | https://support.google.com/nonprofits/answer/15873832 | 30 Aug 2026 | none published |
| 60 Copilot | data_location, trains_on_input | https://learn.microsoft.com/en-us/microsoft-365/copilot/enterprise-data-protection | 30 Aug 2026 | 18 Aug 2026 |
| 60 Copilot | nonprofit_tier | https://www.microsoft.com/en-us/nonprofits/offers-for-nonprofits | 30 Aug 2026 | none published |
| 60 Copilot | cost | https://www.microsoft.com/en-gb/microsoft-365-copilot/pricing/enterprise | 30 Aug 2026 | none published |
| 61 Google Workspace AI | data_location | https://knowledge.workspace.google.com/admin/generative-ai/generative-ai-in-google-workspace-privacy-hub | 30 Aug 2026 | 14 Aug 2026 |
| 61 Google Workspace AI | trains_on_input | https://knowledge.workspace.google.com/admin/generative-ai/workspace-with-gemini/gemini-for-google-workspace-faq-business | 30 Aug 2026 | 26 Aug 2026 |
| 61 Google Workspace AI | nonprofit_tier, cost | https://www.google.com/nonprofits/offerings/workspace/ | 30 Aug 2026 | none published |
| 62 Gamma | data_location | https://gamma.app/privacy | 30 Aug 2026 | 10 Apr 2025 |
| 62 Gamma | trains_on_input | https://help.gamma.app/en/articles/12281928-does-gamma-use-my-content-to-train-its-ai-features | 30 Aug 2026 | none published |
| 62 Gamma | nonprofit_tier, cost | https://gamma.app/pricing | 30 Aug 2026 | none published |
| 63 Wispr Flow | data_location | https://wisprflow.ai/privacy-policy | 30 Aug 2026 | 19 Aug 2026 |
| 63 Wispr Flow | trains_on_input | https://docs.wisprflow.ai/articles/4709791908-understanding-privacy-mode-and-cloud-sync | 30 Aug 2026 | none published |
| 63 Wispr Flow | nonprofit_tier | https://wisprflow.ai/for-non-profits | 30 Aug 2026 | none published |
| 63 Wispr Flow | cost | https://wisprflow.ai/pricing | 30 Aug 2026 | none published |
| 64 Grok | data_location, trains_on_input | https://x.ai/legal/privacy-policy | 30 Aug 2026 | 24 Aug 2026 |
| 64 Grok | nonprofit_tier, cost | https://x.ai/pricing | 30 Aug 2026 | none published |
| 64 Grok | cost | https://help.x.com/en/using-x/x-premium | 30 Aug 2026 | none published |
| 65 Notion AI | data_location | https://www.notion.com/help/data-residency, https://trust.notion.com | 30 Aug 2026 | none published |
| 65 Notion AI | trains_on_input | https://www.notion.com/product/ai | 30 Aug 2026 | none published |
| 65 Notion AI | nonprofit_tier | https://www.notion.com/nonprofits | 30 Aug 2026 | none published |
| 65 Notion AI | cost | https://www.notion.com/pricing | 30 Aug 2026 | none published |
| 66 DeepSeek | data_location, trains_on_input | https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html | 30 Aug 2026 | 10 Feb 2026 |
| 66 DeepSeek | nonprofit_tier | https://www.deepseek.com/nonprofit (404) | 30 Aug 2026 | n/a |
| 66 DeepSeek | cost | https://api-docs.deepseek.com/quick_start/pricing | 30 Aug 2026 | none published |

## 8. Assumptions this run depends on

1. The published set was computed fresh, not carried. 23 rows of 67 pass the
   seven-field test with dpia_flag in Green, Amber or Red. That matches the 23
   axis-track rows you pasted on 28 August.
2. The Sheet was read through the Drive connector in one pass, and the row
   numbering is confirmed, not assumed. Every cell reference in
   `reports/2026-08-28-sheet-edit-pack.md` lands on the row this parse gives:
   E3 HubSpot, E27:E29 Canva / Adobe Creative Cloud / Adobe Express, E39:E40
   Perplexity / NotebookLM, E45:E46 ElevenLabs / Descript, E57:E58 Claude /
   ChatGPT, E60:E61 Microsoft Copilot / Google Workspace AI, E63 Wispr Flow,
   E65:E66 Notion AI / DeepSeek, and the loose "row 58, ChatGPT" note. Fifteen
   rows, matched against a pack you wrote by hand two days ago. Secondary
   check: the last data row is Zo Computer at 68, the row the Make blueprint
   addresses as `tools!A68:F68`. Total is 67 data rows, which reconciles with
   the spec's 15 published plus 52 incomplete at 26 August.
3. Every position below is from a vendor page. No third-party summary was used
   as a source anywhere. Where only secondary sources existed, the field is in
   section 3 with the lead named.
4. Descript's cost is confirmed by arithmetic on the vendor's own stated 35%
   annual saving, not by reading the toggle. That is an inference and it is
   flagged as one.
5. Claude's GBP price is not confirmed. The USD figures observed are
   proportionate to the stored GBP ones, which is suggestive and not a check.
6. Nine rows carry a field this environment cannot reach at all. That is a
   property of the pipeline, not of this run, and it will repeat every
   fortnight until the fetching changes.
7. The published-set predicate I ran is very slightly stricter than the site's,
   and you should know where. `isComplete()` in `src/lib/sheets.ts` tests
   `normaliseDpiaFlag(dpia_flag) !== ''`, which lower-cases before matching, so
   the site publishes a row whose K reads "green". My run required an exact
   "Green", "Amber" or "Red", per the task instruction. No row is affected
   today: all 23 published flags are exact-case and all 44 blanks are truly
   blank. But a lower-case paste would publish on the site and disappear from
   the audit, which is the worst direction for that error to run. Worth
   aligning the predicate before the next run.
8. Perplexity's nonprofit rate (row 39) rests on softer ground than the
   sources log makes it look. The only vendor page stating $30 a seat is the
   original announcement blog, which carries no date, and standard Enterprise
   Pro has since moved to $40 a seat. The programme is not in doubt; the
   figure has no current programme page behind it. Not raised as a judgement
   item, flagged so it is not mistaken for a firm check.
