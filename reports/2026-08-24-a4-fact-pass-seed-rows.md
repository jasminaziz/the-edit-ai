# A4 fact pass: the four seed rows

**Researched 24 August 2026 (Cowork session).** Sourced values for the fact
fields on the four complete seed rows: Canva, ChatGPT, Microsoft Copilot and
DeepSeek. Every value below carries a link to a page that was actually
fetched on that date.

This exists to satisfy the hard gate added to F2 on 23 August: every visible
row's fact fields must have been through A4 with sources before merge, or the
row gets blanked back to hidden. These four are the only visible rows, so this
file is the audit trail for the whole grid as it stands.

**Scope.** Fact fields only: `data_location`, `trains_on_input`,
`nonprofit_tier` and the `cost` column. No `dpia_flag`, no `trustee_note`, no
verdict is written or amended anywhere in this file. Where a fact bears on one
of those three, it is flagged for Jasmin under "For the judgement fields" and
left there.

**The buying-tier rule.** Each value is recorded for the tier a small charity
would actually buy, per `reports/2026-08-23-axis-locked.md`. Where that tier is
itself genuinely ambiguous, `Varies by tier` is the correct value and the
verdict must name the tiers.

---

## Summary of changes

| Row | Field | Currently | Proposed |
|---|---|---|---|
| Canva | `trains_on_input` | No by default | **Varies by tier** |
| Canva | `nonprofit_tier` | Canva Pro free for registered charities | **Canva Nonprofits: free Pro + team tools, up to 50 users** |
| Canva | `cost` | Free tier / Pro from £13/mo | **Free tier / Pro £100 a year / free for charities** |
| ChatGPT | `trains_on_input` | Yes unless you opt out | **Varies by tier** |
| ChatGPT | `nonprofit_tier` | None | **OpenAI for Nonprofits: Business at $8 per user a month** |
| Copilot | `nonprofit_tier` | None | **Microsoft Nonprofit: 15% off Copilot, free Business Basic** |
| Copilot | `cost` | From £24/mo per user | **Copilot Chat included with M365 / add-on £23.10 per user** |
| DeepSeek | `trains_on_input` | Yes | **Yes unless you opt out** |

`data_location` is unchanged and confirmed correct on all four rows. All four
`last_checked` values should move from `23 Aug 2026` to `24 Aug 2026`, which
is the first date on which the stamp is true.

---

## Canva

| Field | Value |
|---|---|
| `data_location` | US (unchanged) |
| `trains_on_input` | Varies by tier (changed) |
| `nonprofit_tier` | Canva Nonprofits: free Pro + team tools, up to 50 users |
| `cost` | Free tier / Pro £100 a year / free for charities |

**Data location.** The Trust Center states "Canva stores your data in the
United States". No UK or EU residency option on any tier. The privacy policy
lists a wider processing footprint including the UK and EU, but as a global
group arrangement rather than a selectable residency, so `US` stands.
Sources: https://www.canva.com/trust/privacy/ and
https://www.canva.com/policies/privacy-policy/

**Training.** This is the correction that matters. Free and Pro content is
used to improve AI features unless the user opts out in Privacy Settings,
which on its own reads as `Yes unless you opt out`. Teams, Business,
Enterprise and Education content is excluded and the control is disabled, which
on its own reads as `No`. Canva does not publish which of those two a **Canva
Nonprofits** account is, and the grant is described as Pro features plus team
tools, which straddles both. That undocumented gap is precisely what
`Varies by tier` is for. Sources:
https://www.canva.com/trust/privacy/ ,
https://www.canva.com/newsroom/news/safe-ai-canva-shield/ ,
https://www.canva.com/policies/ai-product-terms/ (effective 26 June 2026)

**Nonprofit tier.** Free Canva Pro plus team and collaboration tools for one
team of up to 50 members. Eligibility is verified by Goodstack. Government
bodies, schools, universities, social enterprises and grantmaking foundations
are excluded, which catches some heritage and cultural bodies. Extra seats at
50% off Enterprise. Sources: https://www.canva.com/nonprofits/ ,
https://www.canva.com/help/canva-for-nonprofits/ ,
https://www.canva.com/canva-for-nonprofits/eligibility-guidelines/

**Pricing.** UK page shows Pro £100 a year and Business £180 a year per
person, annual figures only. The current cell says £13/mo, which no Canva page
confirmed. Source: https://www.canva.com/en_gb/pricing/

---

## ChatGPT

| Field | Value |
|---|---|
| `data_location` | US (unchanged) |
| `trains_on_input` | Varies by tier (changed) |
| `nonprofit_tier` | OpenAI for Nonprofits: Business at $8 per user a month |
| `cost` | unchanged, with a caveat below |

**Data location.** US. OpenAI's EU privacy policy states processing on servers
outside the EEA, Switzerland and the UK, in the United States. A data
residency programme exists, but the business-data page lists Enterprise, Edu,
Healthcare and API as the eligible plans and does not list Business, and the
Business help article says residency is rolling out and not yet available to
all customers. Separately, abuse-monitoring logs are stored in the US
regardless of any region selected, and storage residency does not include
inference residency. `US` is the honest value and `EU option` would overstate
it. Sources: https://openai.com/policies/eu-privacy-policy/ ,
https://openai.com/business-data/ ,
https://help.openai.com/en/articles/20001418-where-your-chatgpt-business-content-is-stored

**Training.** Free, Plus, Pro and Go train on user content by default with an
opt-out at Settings, Data Controls, "Improve the model for everyone", which is
`Yes unless you opt out`. Business, Enterprise and the API do not train by
default, which is `No`. A small charity plausibly sits on any of them, and the
nonprofit rate makes Business cheaper than Plus, so the buying tier is
genuinely undecided for this audience. `Varies by tier`. Sources:
https://help.openai.com/en/articles/5722486-how-your-data-is-used-to-improve-model-performance ,
https://openai.com/business-data/

**Nonprofit tier.** Real and previously recorded as absent. ChatGPT Business
at $8 per user a month billed annually, or $10 billed monthly, against $20 and
$25 list. Standard seats only, minimum two seats, no API discount. Eligibility
validated by Goodstack. UK eligibility is not stated explicitly on either
page. Sources:
https://help.openai.com/en/articles/9359041-openai-for-nonprofits ,
https://goodstack.org/software-discounts/openai

**Pricing caveat.** OpenAI publishes no GBP price anywhere, including on its
en-GB pages, though it does bill UK customers in GBP with VAT added at
checkout. The £16/mo in the current cell comes from a third-party comparison
site, not from OpenAI. Left unchanged rather than replaced with a converted
figure. Source: https://help.openai.com/en/articles/10421635-multicurrency-billing

---

## Microsoft Copilot

| Field | Value |
|---|---|
| `data_location` | Your tenant (unchanged, confirmed) |
| `trains_on_input` | No (unchanged, confirmed) |
| `nonprofit_tier` | Microsoft Nonprofit: 15% off Copilot, free Business Basic |
| `cost` | Copilot Chat included with M365 / add-on £23.10 per user |

These values describe the commercial work-account product, Microsoft 365
Copilot and Copilot Chat signed in with an Entra work account, both under
Enterprise Data Protection. The free consumer Copilot on a personal Microsoft
account is a different product and gets consumer protections only.

**Data location.** Prompts, responses and the semantic index are stored at
rest in the tenant's local region geography, and the UK is an eligible local
region. Microsoft states this content stays within the Microsoft 365 service
boundary. `Your tenant` is correct. Sources:
https://learn.microsoft.com/en-us/microsoft-365/enterprise/m365-dr-service-copilot ,
https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-privacy

**Training.** "Prompts, responses, and data accessed through Microsoft Graph
aren't used to train foundation LLMs". Restated under Enterprise Data
Protection, and data is not shared with OpenAI or used to train OpenAI models.
Thumbs-up and thumbs-down feedback is also excluded. Source:
https://learn.microsoft.com/en-us/microsoft-365/copilot/enterprise-data-protection

**Nonprofit tier.** The predicted correction. Microsoft's UK nonprofit page
gives 15% off Microsoft 365 Copilot and 75% off Business Premium, and Business
Basic is free for up to 300 users. Copilot Chat is included at no extra charge
with those subscriptions, which is the route most small charities will
actually take. Note: as at a Microsoft staff post of 1 December 2025 there was
no nonprofit pricing on Microsoft 365 Copilot **Business** specifically, and no
later statement was found. Sources:
https://www.microsoft.com/en-gb/nonprofits/microsoft-365 ,
https://www.microsoft.com/en-gb/microsoft-365/business/nonprofit-plans-and-pricing ,
https://www.microsoft.com/en-us/nonprofits/offers-for-nonprofits

**Pricing.** UK list, ex VAT, annual commitment: Copilot Chat £0 included,
Copilot Business add-on £16.10, Microsoft 365 Copilot add-on £23.10. The
nonprofit Copilot price is published in USD only at $25.50 per user a month
paid yearly. Sources:
https://www.microsoft.com/en-gb/microsoft-365-copilot/pricing/enterprise ,
https://www.microsoft.com/en-gb/microsoft-365/business/additional-services-plans-and-pricing

---

## DeepSeek

| Field | Value |
|---|---|
| `data_location` | Other (unchanged, confirmed) |
| `trains_on_input` | Yes unless you opt out (changed) |
| `nonprofit_tier` | None (unchanged) |
| `cost` | Free / API pay-per-use (unchanged) |

**Data location.** The privacy policy, last updated 10 February 2026, states
"we directly collect, process and store your Personal Data in People's
Republic of China", and repeats that sentence in the section headed European
Economic Area, Switzerland, and UK. So China storage is the answer that
applies specifically to UK users, not a default that a UK user escapes. No UK
or EU residency option. Source:
https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html

**Training.** The terms permit use of inputs and outputs to develop and
improve the services, and state "you can opt out by turning off 'Improve the
model for everyone'". That is `Yes unless you opt out`, not `Yes`. This reads
as a softening and it is not: the value records the mechanism, and the
severity lives in the flag and the verdict, which are untouched here. Source:
https://cdn.deepseek.com/policies/en-US/deepseek-terms-of-use.html

**Nonprofit tier.** None. DeepSeek publishes no plans page and no programme.
Recorded as `None`, which the axis defines as confirmed absent, on the basis
that no programme is published anywhere on its site. Source:
https://api-docs.deepseek.com/quick_start/pricing

---

## For the judgement fields

Facts only. Nothing below is a flag, a note or a verdict, and nothing below
has been written into the Sheet.

**Microsoft Copilot, the web-grounding carve-out.** Microsoft's own
documentation states that for generated Bing web search queries, the Data
Protection Addendum does not apply, the EU Data Boundary does not apply, and
Microsoft acts as an independent data controller under the Microsoft Services
Agreement. Microsoft states only a short generated query is sent, with user
and tenant identifiers removed, never the full prompt or attached files, and
that the queries are not used for advertising or to train foundation models.
An admin policy, "Allow web search in Copilot", turns it off. Separately,
models provided by Anthropic as a subprocessor are currently excluded from the
EU Data Boundary, and admins choose whether to enable third-party models.
Source: https://learn.microsoft.com/en-us/microsoft-365-copilot/manage-public-web-access

**DeepSeek, the regulatory record.** Italy's Garante ordered an urgent
limitation on processing of Italian users' data on 30 January 2025 and the ban
was still reported in force in March 2026. Berlin's data protection
commissioner reported the app to Apple and Google under Article 16 of the
Digital Services Act on 27 June 2025, stating it unlawfully transfers German
users' data to servers in China. The ICO confirmed it has written to DeepSeek
requesting information on its approach to UK data protection; no UK ban and no
enforcement action found. DeepSeek has appointed Prighter as its Article 27
representative for the EEA, Switzerland and the UK, but has no EU
establishment, so the one-stop-shop does not apply and any member-state
authority may act independently. No monetary penalty found anywhere.
Sources: https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/10097450 ,
https://www.bleepingcomputer.com/news/security/germany-asks-google-apple-remove-deepseek-ai-from-app-stores/ ,
https://europeanlawblog.eu/establish-then-escape-how-the-court-of-rome-the-one-stop-shop-and-a-single-word-opened-an-ai-enforcement-gap/

**Canva, the nonprofit DPA question.** Canva's Trust Center says the Data
Processing Addendum is automatically incorporated for Business and Enterprise
customers and available on request for Education. It does not say whether a
Canva Nonprofits account has it. Source:
https://www.canva.com/trust/privacy/

**ChatGPT, the UK contracting entity.** OpenAI's DPA names OpenAI Ireland Ltd
for EEA and Swiss data but OpenAI OpCo LLC, the US entity, for UK data, with
transfers under SCCs as amended by the UK Addendum. Source:
https://openai.com/policies/data-processing-addendum/

---

## Not verified

- Whether a Canva Nonprofits account counts as Teams for the AI training
  exclusion, or as Pro with a live opt-out toggle. The single most
  consequential gap for this audience, and the reason Canva reads
  `Varies by tier`.
- Whether the Canva DPA is automatically incorporated for Nonprofits accounts.
- Whether Europe or the UK is currently a selectable storage region for
  ChatGPT Business specifically.
- Whether UK registered charities are confirmed eligible for the OpenAI
  nonprofit rate.
- Whether UK in-country LLM processing for Microsoft Copilot is live and
  default today, or requires Advanced Data Residency.
- Whether nonprofit pricing reached Microsoft 365 Copilot Business after
  December 2025.
- Any GBP figure from OpenAI or DeepSeek. Neither publishes one, and no
  conversion was invented.

---

*Researched 24 August 2026 against live vendor documentation. Fact fields
only. The DPIA flag, the trustee note and the verdict are untouched.*
