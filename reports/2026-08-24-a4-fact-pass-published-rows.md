# A4 fact pass: the published rows

**Researched 24 August 2026 (Cowork session).** Sourced values for the fact
fields on the nineteen rows not covered by
`reports/2026-08-24-a4-fact-pass-seed-rows.md`. Together the two files cover
every row the A3 triage publishes, which is what the F2 hard gate requires
before merge.

**Scope.** Fact fields only: `jobs`, `data_location`, `trains_on_input`,
`nonprofit_tier` and the `cost` column. No `dpia_flag`, no `trustee_note`, no
verdict is written or amended anywhere in this file. Facts bearing on those
three are collected under "For the judgement fields" and left there.

**The buying-tier rule** applies throughout: each value records the tier a
small charity would actually buy, per `reports/2026-08-23-axis-locked.md`.

---

## Three things to decide before this can all go in

### 1. The axis cannot say "the vendor does not publish a position"

`data_location` has `Unclear`, described in the locked spec as a legitimate
published value and itself a warning. `trains_on_input` has no equivalent.

Two vendors publish nothing at all on whether they train on what you give
them. Submagic's privacy notice and terms are silent; the only "improve"
language is scoped to YouTube-derived data. Blotato's only training sentence
is a Google API compliance clause about third-party APIs, not about social
content or connected accounts.

There is no honest value for either. Picking `Yes` would be an accusation and
picking `No` would be a gift. **Both rows stay incomplete and therefore hidden
until either the axis gains a value or the vendors answer an email.** That is
the hidden-row mechanic doing its job, so nothing is broken.

### 2. `None` versus "not published" in `nonprofit_tier`

The locked spec says `None` means confirmed absent and a blank means
unchecked, and calls that distinction load-bearing. Real vendors produce a
third case: no programme is published anywhere, and no vendor statement denies
one exists.

It affects seven of the twenty-three rows: Granola, Blotato, Ideogram, Gamma,
Submagic, Seedance and Grok. For Grok the only source denying a programme is
an uncited secondary site.

Recording `None` on all seven would publish seven findings that were never
made. Leaving them blank hides seven rows that are otherwise complete. This
needs a ruling.

### 3. Google Workspace AI's `data_location`

The research returned `Other`, on the reasoning that processing is global and
residency is only purchasable above the tier a charity buys. `Other` is
defined in the locked spec as a jurisdiction outside the UK, EU and US, named
in the verdict, and it is currently carried by DeepSeek and Seedance.

Putting Google Workspace on the same value as those two would mislead.
**Recommend `Unclear`**, which is what the evidence actually supports: Google
publishes no residency commitment at Business tier and the Cloud DPA permits
processing in any country where Google maintains facilities.

---

## The values

`jobs` values are carried from the A3 triage list. `last_checked` is
`24 Aug 2026` on every row below.

| Tool | data_location | trains_on_input | nonprofit_tier |
|---|---|---|---|
| Adobe Firefly | Unclear | No | Adobe Express Premium for Nonprofits: free, 50 seats |
| Adobe Suite | EU | No by default | Charity Digital Exchange: CC All Apps at a discount |
| Blotato | US | **blocked** | **blocked** |
| Claude | US | Varies by tier | Claude for Nonprofits: Team seats $8 per user a month |
| Descript | US | No by default | NFP and EDU rate: $12 per editor a month |
| ElevenLabs | US | Yes unless you opt out | Impact Program: free access, by application |
| Gamma | US | Yes unless you opt out | **not published** |
| Gemini | Unclear | Yes unless you opt out | None on the consumer product |
| Google Workspace AI | Unclear (see above) | No | Google for Nonprofits: free tier, 75% off Business |
| Granola | US | Yes unless you opt out | **not published** |
| Grok | US | Yes unless you opt out | **not published** |
| HubSpot | EU option | Yes unless you opt out | None for the UK: the offer is North America and Oceania |
| Ideogram | Unclear | Yes | **not published** |
| NotebookLM | Unclear | No by default | Free in Workspace for Nonprofits |
| Notion AI | US | No by default | Notion for Nonprofits: 50% off Business |
| Perplexity | US | Yes unless you opt out | Enterprise Pro for not-for-profits, $30 a seat |
| Seedance | Other | Yes | **not published** |
| Submagic | US | **blocked** | **not published** |
| Wispr Flow | US | Yes unless you opt out | Non-Profit Discount: Flow Pro at $8 a month annual |

---

## What the axis actually shows, once populated

**Not one row is UK.** One is EU (Adobe Suite, Dublin, not selectable). One is
`EU option` (HubSpot, and only on paid plans). One is `Your tenant` (Microsoft
Copilot). Everything else is US, `Unclear`, or `Other`.

**Seven of twenty-one completable rows pass the training toggle.** Microsoft
Copilot, Google Workspace AI, NotebookLM, Adobe Suite, Adobe Firefly, Descript
and Notion AI. Fourteen do not.

Those two sentences are the argument for the whole site, and until this pass
nobody could have written them.

---

## Per-tool notes and sources

### Adobe Suite and Adobe Firefly

Creative Cloud storage for UK customers lands in Dublin; the region is
assigned, not chosen, so `EU` rather than `EU option`. Firefly's own
processing location is published nowhere, hence `Unclear` on that row.
Content analysis for product improvement is **on by default on individual
seats and off with no toggle on team and business seats**, which is the
difference between two charities on nominally the same product. Adobe states
it does not train generative models on customer content.
https://www.adobe.com/trust/creative-cloud-hosting-locations.html ·
https://helpx.adobe.com/account/individual/terms-policies-and-regulations/content-analysis-faq.html ·
https://helpx.adobe.com/firefly/web/get-started/learn-the-basics/adobe-firefly-faq.html

UK charity route is the Adobe Donation Programme through Charity Digital
Exchange for Creative Cloud, and direct from Adobe for Express. The GBP
charity price could not be verified: Charity Digital quotes a USD figure,
gives two different discount percentages on two pages, and references an
unquantified admin fee.
https://charitydigital.org.uk/landing-page/the-adobe-donation-programme-create-edit-and-share ·
https://www.adobe.com/uk/nonprofits/express.html

### Claude

Data stored in the US, no UK or EU residency on any tier a charity buys.
Training is the clearest `Varies by tier` case in the whole set: the
commercial terms state plainly that Anthropic may not train on customer
content from Team and Enterprise, while Free, Pro and Max carry a
model-improvement toggle whose retention consequence is five years on and
thirty days off. Claude for Nonprofits puts Team at $8 per user a month,
Goodstack-verified, which is cheaper than consumer Pro and carries the
no-training terms and a DPA.
https://www.anthropic.com/legal/commercial-terms ·
https://privacy.claude.com/en/articles/12109829-how-do-i-change-my-model-improvement-privacy-settings ·
https://claude.com/solutions/nonprofits

Could not verify whether the consumer toggle ships on or off for a new
signup. Treat as "check it on day one".

### Descript

US processing. The help centre states current production AI models use no
Descript user data and that research models use opted-in data only; the
privacy policy is looser. Enterprise drives cannot enable sharing at all. NFP
and EDU rate at $12 per editor a month monthly, $8 annually, open to
"501(c)(3) or equivalent".
https://help.descript.com/account-and-app-settings/data-privacy ·
https://help.descript.com/billing-payments-plans/nfp-edu

### ElevenLabs

US storage. Training is on by default with a universal opt-out; only
Enterprise is excluded by default. The Impact Program gives free access to
nonprofits and cultural institutions by application, museums named
explicitly.
https://elevenlabs.io/docs/help-center/legal/is-my-data-used-to-improve-eleven-labs-ai-models ·
https://elevenlabs.io/impact-program

### Gamma

US, AWS. Individual plans including Free train by default with a real
opt-out; Team and Business are excluded and the setting is locked. Thirty-seven
sub-processors are published, of which eleven are AI providers.
https://help.gamma.app/en/articles/12281928-does-gamma-use-my-content-to-train-its-ai-features ·
https://gamma.app/subprocessors

No price figure could be retrieved from any Gamma page, in any currency: the
pricing page renders client-side. The `cost` cell stays as it is.

### Gemini, Google Workspace AI, NotebookLM

Three different answers from one vendor, which is the useful part.

Consumer Gemini trains on chats by default with a "Keep activity" opt-out, and
a subset of chats is human-reviewed and kept up to three years even after
deletion. Workspace AI does not train on customer data and is covered by the
Cloud DPA with UK GDPR terms and SCCs. NotebookLM does not train unless the
user submits thumbs-up or thumbs-down feedback, and on a Workspace account not
even then.
https://support.google.com/gemini/answer/13594961?hl=en-GB ·
https://workspace.google.com/security/ai-privacy/ ·
https://support.google.com/notebooklm/answer/17004255?hl=en-GB

The nonprofit detail that matters: the free Workspace for Nonprofits edition
includes the standalone Gemini app and NotebookLM but **not** Gemini inside
Gmail, Docs and Sheets. That requires the discounted Business Standard plan.
https://support.google.com/nonprofits/answer/16345471?hl=en

Data regions for Gemini features need Enterprise Plus or the Assured Controls
add-on, so neither the free nonprofit edition nor Business Standard can turn
residency on.

### Granola

US, AWS. Audio is not retained once transcribed. Transcripts are kept for the
life of the account with no published retention period below Enterprise.
Training is on by default for Basic and Business on de-identified data, with
third-party model providers contractually barred from training. DPA on
request rather than incorporated.
https://docs.granola.ai/help-center/policies/privacy-policy ·
https://www.granola.ai/security

### Grok

US, with UK and EU Article 27 representatives published and DPF plus SCC
coverage in place. Training is opt-out, and **there are two separate opt-outs**:
one in xAI's own settings for Grok prompts, and one in X's settings for public
X data and Grok-on-X interactions. Opting out of the second still leaves Grok
learning from interactions with X features it powers.
https://x.ai/legal/faq · https://help.x.com/en/using-x/about-grok

### HubSpot

`EU option` is exact: an EU region exists in Germany, there is no UK region,
and changing region requires a paid Starter or above. A free-tools-only
account is assigned to the US. AI processing follows the account's region,
which was the load-bearing question.
https://www.hubspot.com/data-centers ·
https://knowledge.hubspot.com/hubspot-ai-cloud-infrastructure-frequently-asked-questions

Training on HubSpot's own models is on by default across all products and
plans, with an admin opt-out at Settings, AI, Access. Named AI sub-processors
are OpenAI, Google and AWS.
https://knowledge.hubspot.com/account-management/hubspot-ai-mode-training ·
https://legal.hubspot.com/sub-processors-page

**The nonprofit programme does not reach a UK charity.** Eligibility requires
registration in North America, Australia or New Zealand, and it excludes
Starter tier products. `None` is the correct value and the reason belongs in
the verdict.
https://www.hubspot.com/nonprofits

### Ideogram

No processing country is named anywhere, hence `Unclear`. Training is by
stated purpose under legitimate interest with no published opt-out and no
plan-based difference. Commercial use rights are clear and favourable on all
tiers, and Ideogram assigns whatever rights exist in outputs, while taking no
position on whether copyright subsists at all.
https://ideogram.ai/legal/privacy · https://ideogram.ai/legal/tos

### Notion AI

US by default; EU residency is Enterprise-only and sales-assisted. Notion and
its AI sub-processors do not train on customer data by default across all
tiers, and the DPA is incorporated by reference rather than separately
signed. What varies by tier is retention by the LLM providers: thirty days or
fewer below Enterprise, zero at Enterprise. Notion for Nonprofits gives 50%
off Business, which is where full AI lives.
https://www.notion.com/help/notion-ai-security-practices ·
https://www.notion.com/help/data-residency · https://www.notion.com/nonprofits

### Perplexity

The sharpest contrast in the set. AI data retention is enabled by default for
Free, Pro and Max, and Perplexity's own help centre states that if the toggle
is on, data is being collected for AI training. Opt-out is forward-only. The
DPA covers business customers only, so **a charity on Free or Pro has no DPA
at all**. The nonprofit offer sits on Enterprise Pro at $30 a seat, more
expensive than consumer Pro, and its only source is a June 2024 blog post.
https://www.perplexity.ai/help-center/en/articles/11564572-data-collection-at-perplexity ·
https://www.perplexity.ai/hub/legal/dpa ·
https://www.perplexity.ai/hub/blog/bringing-perplexity-to-education-and-not-for-profits

### Seedance

Storage in the United States, Singapore and Malaysia, controller ByteDance
Pte Ltd in Singapore, with UK and EEA Article 27 representatives published.
China is not named as a storage location and no clause confirms or excludes
Chinese access. Training is stated as a purpose under legitimate interest with
a right to object but no self-serve toggle found. The terms grant a
perpetual, irrevocable, sub-licensable licence over uploads and outputs.
https://sf16-draftcdn-sg.ibytedtos.com/obj/ies-hotsoon-draft-sg/terms-policy/dreamina_privacy_policy.html ·
https://sf19-draftcdn-sg.ibytedtos.com/obj/ies-hotsoon-draft-sg/terms-policy/dreamina_terms_of_service.html

### Submagic

French controller, TURBO STUDIO S.A.S., US hosting. No published position on
training at all, which is what blocks the row. No security page, trust centre,
published DPA or sub-processor list. Retention is a 60-day retrieval window
against a two-year outer limit, with no video-specific period.
https://www.submagic.co/privacy · https://www.submagic.co/terms-of-use

### Blotato

US, with the privacy policy acknowledging transfer outside the EEA and naming
no transfer mechanism, no SCCs, no UK Addendum. No DPA published or
referenced. GDPR is not mentioned in either document; the policy addresses
California residents only. No published position on training, which blocks the
row. The terms take a perpetual, irrevocable, sub-licensable licence over user
content.
https://www.blotato.com/privacy-policy · https://www.blotato.com/terms-of-service

### Wispr Flow

US only, no regional processing. Training is on by default for trial and
standard accounts; Enterprise and HIPAA default to Privacy Mode on.
Transcripts and audio are stored by default under Cloud Sync, transcription
is always cloud-side, and an optional Context Awareness feature can read
on-screen content from the app in use. Non-profit discount puts Flow Pro at $8
a month annual.
https://wisprflow.ai/data-controls · https://wisprflow.ai/privacy-policy ·
https://wisprflow.ai/for-non-profits

---

## For the judgement fields

Facts only. Nothing here is a flag, a note or a verdict, and nothing here has
been written into the Sheet.

**Ideogram publishes your images by default.** Its own documentation: images
are public unless you choose private generation, and private generation
requires a paid plan. The privacy policy confirms the generated image is
publicly available alongside information that may identify you, including your
account handle and picture. A charity on the free tier is publishing its
prompts and its outputs.
https://docs.ideogram.ai/using-ideogram/generation-settings/private-generations

**Granola does not tell the other people in the meeting.** It joins no bot, so
there is no visible indicator, and the documentation places the duty on the
user. Transparency features exist and are opt-in.
https://docs.granola.ai/help-center/consent-security-privacy/getting-consent

**Wispr Flow can read the screen.** Context Awareness may collect content from
the app in use; a Screen OCR sub-feature is opt-in and captures a screenshot
of the display containing the cursor. Dictated audio is stored by default.
https://wisprflow.ai/data-controls

**Descript processes biometric data.** Voiceprints and facial geometry for
Overdub, AI Speakers and avatars, retained up to three years after last
account access. No published server-side retention for uploaded media.
https://www.descript.com/privacy

**ElevenLabs verifies only self-cloning.** Professional Voice Clones require
the speaker to record verification lines. Instant and uploaded voices rely on
a user warranty with no published proof-of-consent step.
https://elevenlabs.io/docs/help-center/product/voice-customization/voice-cloning/can-i-create-a-professional-voice-clone-of-someone-elses-voice

**Adobe's Firefly indemnity does not cover the free nonprofit tier.** The
generative AI product terms limit the IP indemnity to Creative Cloud for teams
or enterprise customers on qualifying plans, capped at $10,000 per output.
Commercial use rights exist on all tiers, but permission to use is not the
same as being defended against a claim.
https://wwwimages2.adobe.com/content/dam/cc/en/legal/servicetou/adobe-generative-ai-product-specific-terms-en-us-20250617.pdf

**Gamma's DPA forbids special category data.** Section 11.4 states customers
shall not make available health information, biometric data or payment card
information. Gamma also lists Ideogram among its sub-processors, so content
generated in Gamma may reach a vendor that publishes images by default.
https://gamma.app/dpa · https://gamma.app/subprocessors

**Perplexity Free and Pro have no DPA.** The DPA forms part of an agreement
with a business customer only.
https://www.perplexity.ai/hub/legal/dpa

**Grok's regulatory record, primary sources only.** Irish DPC High Court
proceedings August 2024, concluded September 2024 with a permanent undertaking
to stop processing EU and EEA public posts for Grok training. A separate DPC
statutory inquiry opened 11 April 2025 into training on EU and EEA public
posts, no outcome found, treat as open. European Commission fined X €120m
under the DSA on 5 December 2025, a decision that does not mention Grok.
Ofcom opened an Online Safety Act investigation on 12 January 2026 over Grok
sexualised imagery, still ongoing as at 15 January 2026. Commission opened
formal DSA proceedings on 26 January 2026 over risk assessment of Grok's
deployment into X. DPC opened a further inquiry on 17 February 2026 into
non-consensual sexualised images generated via Grok.
https://www.dataprotection.ie/en/news-media/press-releases/data-protection-commission-welcomes-conclusion-proceedings-relating-xs-ai-tool-grok ·
https://www.dataprotection.ie/en/news-media/latest-news/data-protection-commission-announces-commencement-inquiry-x-internet-unlimited-company-xiuc ·
https://ec.europa.eu/commission/presscorner/detail/en/ip_25_2934 ·
https://www.ofcom.org.uk/online-safety/illegal-and-harmful-content/ofcom-launches-investigation-into-x-over-grok-sexualised-imagery ·
https://ec.europa.eu/commission/presscorner/detail/en/ip_26_203 ·
https://www.dataprotection.ie/en/news-media/press-releases/data-protection-commission-opens-investigation-x-xiuc

**Seedance: do not borrow TikTok's record.** No UK or EU data protection
finding, investigation or restriction against Seedance or Dreamina
specifically was found, and the absence may reflect that Seedance 2.0 launched
in February 2026. The €530m Irish DPC fine of 2 May 2025, including the
finding that TikTok had given the inquiry inaccurate information about EEA
data stored on servers in China, concerns a different ByteDance entity. The
2023 UK government device ban is likewise TikTok-specific. Using either as if
it were about Seedance would overstate, which is the failure mode a
judged-not-recommended row exists to avoid. The well-sourced Seedance
controversy is intellectual property and US-originating.
https://www.dataprotection.ie/en/news-media/latest-news/irish-data-protection-commission-fines-tiktok-eu530-million-and-orders-corrective-measures-following

---

## Not verified

- Any GBP price from Anthropic, OpenAI, Perplexity, Granola, Wispr Flow,
  Notion, ElevenLabs, Descript, Submagic, Blotato, Ideogram, Gamma, Google or
  Seedance. None publishes one. No conversions were invented.
- Any price at all for Gamma, in any currency.
- The GBP charity price for Adobe Creative Cloud.
- Whether Claude's consumer model-improvement toggle ships on or off.
- UK charity eligibility for the Wispr Flow, Notion and Claude nonprofit
  programmes, all of which describe global or unspecified eligibility.
- Whether Submagic or Blotato train on user content. Neither publishes a
  position; both rows are blocked on it.
- The status of the Irish DPC's April 2025 Grok training inquiry.
- Whether Dreamina data is accessible from China.

---

*Researched 24 August 2026 against live vendor documentation and primary
regulator sources. Fact fields only. The DPIA flag, the trustee note and the
verdict are untouched.*
