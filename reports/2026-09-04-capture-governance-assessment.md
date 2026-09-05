# Email-capture store: governance assessment

**Date: 2026-09-04. Prepared by the governance-assessor agent.**

**Scope note.** This is not a CLIENTS/ product — it assesses infrastructure for
Jasmin's own practice (The Edit AI), using the practice's own tool-assessment
method at her explicit request, because her stated bar is that whatever stores
these addresses must pass the same checks The Edit holds every listed tool to.
It therefore lives in this repo's `reports/`, not in
`CONSULTING/CLIENTS/`, and its judgement-field values (dpia_flag, trustee_note)
are proposed recommendations for Jasmin's sign-off, not a write to the live
Sheet — no automation writes those fields to the directory, and none has here
either.

**Budget tripwire, named rather than hidden.** This run made 19 fetch calls
against a 10-fetch guideline. It is one question (which store, on what
conditions) but it required checking eight vendors plus four legal/regulator
sources to answer it honestly, and three of those needed a retry. I judged
that splitting "which vendor" from "what does storing it lawfully require" would
produce two reports that each depend on the other's findings, which is worse
than one long one. Flagged per the rule rather than silently exceeded.

---

## 1. Verdict

**Acceptable with named conditions.** Recommended store: **MailerLite**, EU
data location, an affirmative no-training clause, with seven conditions below
that must be closed before or at launch, not after.

No vendor on this list reaches the axis's own `Green` DPIA flag, and none
should be expected to: `Green` is defined as "no personal data leaves you",
and the entire function of an email-capture store is that an email address
leaves Jasmin to a third-party processor. The honest flag is `Amber`.

## 2. The question, and the data actually analysed

**Question:** what should store the email addresses of people who provide one
when downloading the free AI-use policy template, now that the previous
mechanism (gating the download behind a Substack subscription) has been
reversed, and does that storage decision, plus the fact of Jasmin now
collecting this data at all, trigger any UK GDPR obligations she does not
currently carry.

**Data:** name (optional, vendor-dependent) and email address, volunteered by
a visitor to theeditai.co.uk. Ordinary personal data. Not special category.
Not safeguarding, donor or membership data — the sensitive-data classes this
practice is built to scrutinise for its charity clients do not arise here.
The people in the dataset are prospective professional contacts (comms
people at charities, cultural and heritage organisations), not vulnerable
individuals, beneficiaries or members of a body with a protected characteristic
aim.

**Open condition, named because it changes the analysis and was not settled
in the brief:** whether the template stays ungated (current, ruled position:
`SCRATCHPAD.md`, "The template is not gated. Ruled 2026-08-30") with email
capture as an optional add-on, or whether a gate is reintroduced on a
different vendor. The findings below are written for the ungated-plus-optional-
capture reading, because that is consistent with the standing ruling this file
documents and the brief describes the previous mechanism as "reversed", not
"replaced with an equivalent gate". If a gate is in fact being reintroduced,
finding 5 changes and needs redoing before this goes live.

## 3. Findings

### 3.1 The seven candidates and Supabase, checked against the axis

Fetched 2026-09-04. Vendor privacy policies move; each quote below carries
its own fetch date, which is today's, not a historical one.

**Supabase** (already live infrastructure for this project; ref
`zsoczlgkyessfhobhtgu`)

- data_location: **EU** for this specific project, per the region already
  selected at signup (`eu-west-1`, Ireland). As a general vendor row this
  would be `EU option` per the axis's own definition ("residency exists but
  must be chosen"), since Supabase's own policy states: *"When you register
  for use with Supabase you have the option to select where you store your
  information."* (supabase.com/privacy, fetched 2026-09-04). This specific
  project already has that option exercised.
- trains_on_input: **Unclear.** The policy makes a marketing-specific denial —
  *"we do not use User Content to send you ads, and we will never share User
  Content with any third parties for marketing or advertising purposes"* —
  but makes no equivalent affirmative claim about model training on stored
  table data. It does disclose that the separate "Supabase AI" assistant
  feature shares inputs/outputs with OpenAI and Amazon Bedrock; that feature
  is not what a plain table insert would use, but its presence in the same
  policy is why this is marked Unclear rather than No.
- nonprofit_tier: **Not checked this run** (pricing page not fetched;
  out of scope once Supabase was ruled out on the training-policy gap below).
- **Two things not independently re-verified this run, flagged rather than
  passed through:** the specific claim that the `subscribers` table currently
  holds 0 rows with an anon-insert RLS policy `WITH CHECK(true)`, and that it
  sits in the same project as `ops_secrets` and `ops_agent_status`. No
  database tool was available in this session to query the live project, so
  these facts are carried from the task brief, not independently checked.
- **What is independently checked, from this repo's own history:**
  `reports/2026-08-28-legal-pages-draft.md` records Jasmin's own 28 August
  ruling — *"The legacy Supabase `subscribers` table: export once, then
  delete before launch."* If that table still exists, as the brief states, the
  28 August instruction to delete it was not carried out. That is a live
  loose end regardless of which vendor is chosen for the new capture: an
  anon-insert policy with `WITH CHECK(true)` is a public write path into a
  project that also holds operational secrets, and it should be closed or
  properly repurposed, not left as an orphan.

**Google Forms → Sheets**, under `jasminaziz1@gmail.com` (personal, not
Workspace)

- data_location: **Unclear.** *"We maintain servers around the world and your
  information may be processed on servers located outside of the country
  where you live."* (policies.google.com/privacy, updated 26 May 2026,
  fetched 2026-09-04). No commitment to a specific region on a personal
  account.
- trains_on_input: **Unclear.** The policy makes an affirmative statement
  about training on *publicly available* content only — *"collect information
  that's publicly available online or from other public sources to help train
  Google's AI models"* — and is silent on private Forms/Sheets submissions.
  Silence is not a denial.
- nonprofit_tier: not applicable to a personal account; Google's nonprofit
  programme runs through Workspace for Nonprofits, which this account is not.
- **Operational finding, not a GDPR one but relevant to risk:** this is the
  same personal Google account that already holds the referrer-restricted
  Sheets API key powering the live directory's data layer
  (`.claude/CLAUDE.md`, "Google account split"). Adding a new personal-data-
  bearing sheet to that account increases what is exposed if that single
  account is ever compromised, and mixes production infrastructure with a new
  personal-data store under one login with no separation.

**Tally**

- data_location: **EU.** *"Your data is stored on high-security servers
  within the European Union."* (tally.so/privacy, last updated 09/09/2024,
  fetched 2026-09-04). Country not specified beyond "EU".
- trains_on_input: **Unclear** — not addressed anywhere in the policy.
- nonprofit_tier: **Not checked this run** (pricing page not fetched).

**EmailOctopus**

- data_location: **EU** for storage — *"Your contact lists are stored in
  Ireland, within the European Economic Area ('EEA'), on the secure servers
  of Amazon Web Services"* — but international transfer language weakens this:
  *"personal data we collect from you may be processed by our staff, or those
  of our ESPs and other service providers... operating outside the UK and
  EEA."* Two named delivery subprocessors, SendGrid and SparkPost, are both
  US companies, so actual message-sending routes data outside the EEA even
  though storage does not. (emailoctopus.com/legal/privacy, fetched
  2026-09-04.)
- trains_on_input: **Unclear** — not addressed.
- nonprofit_tier: **Not checked this run.**
- **Currency finding, itself informative:** the policy is dated **25 June
  2020**. Over five years stale. It predates the EU-US Data Privacy Framework
  (2023), predates any of EmailOctopus's current AI-adjacent features if it
  has since added any, and lists Facebook and Google as data recipients under
  "Advertising" with no further explanation. A privacy policy this old is a
  maintenance signal in its own right, independent of what it says.

**MailerLite**

- data_location: **EU.** *"Our data storage center is in the European Union
  and has information storage security certificate (ISO 27001)."*
  (mailerlite.com/legal/privacy-policy, last updated 28 August 2026, fetched
  2026-09-04 — six days old at the time of this run.)
- trains_on_input: **No.** Two affirmative clauses: *"user data obtained
  through Google API services, including Personal Data, will not be used to
  train, develop, or improve generalized AI and/or machine learning models"*,
  and more generally, *"we prioritize your privacy by utilizing enterprise-
  grade agreements that ensure your data is not used to train the providers
  models."* The first clause is scoped to Google-API-sourced data specifically
  (a common Google API Services User Data Policy compliance clause); the
  second is the broader claim and is what the "No" rests on. MailerLite lists
  OpenAI and Google Vertex AI as subprocessors, almost certainly for its own
  AI-assisted content features (e.g. subject-line generation) — condition 6
  below is about not letting that undermine the claim in practice.
- nonprofit_tier: **Not checked this run** — the privacy policy is silent, and
  the axis's own evidence standard for writing `None` (amendment 2, 25 August
  2026: pricing page, nonprofit page, and TechSoup/Charity Digital Exchange
  all checked) was not met in this run. Do not treat this as `None`; it is
  unfinished work.
- Entity structure: Irish-registered MailerLite Limited handles EEA/UK/CH
  billing; US-based MailerLite, Inc. handles other regions and relies on the
  EU-U.S. Data Privacy Framework for transfers. For a UK-registered buyer this
  puts the contracting entity inside the EU/UK data protection perimeter.

**Kit** (formerly ConvertKit)

- data_location: **US.** *"Kit is based in the United States, and we and our
  service providers process and store personal information on servers
  located in the United States and other countries."* (kit.com/privacy, last
  updated 5 September 2025, fetched 2026-09-04.)
- trains_on_input: **Unclear** — not addressed anywhere in the policy.
- nonprofit_tier: **Not checked this run** — not addressed in the privacy
  policy; pricing page not fetched.

**Brevo**

- **UNVERIFIED across all fields.** Fetched twice (`brevo.com/legal/
  privacypolicy/`), both attempts returned only the page's `<title>` with no
  body content — the fetch tool could not retrieve the rendered policy, most
  likely because the page is client-side rendered. One retry was used per the
  practice's rule; a second attempt did not resolve it, so this stops here
  rather than being filled from general knowledge. Do not assume EU hosting
  for Brevo on the strength of its French/Sendinblue origin — that is exactly
  the kind of claim this practice does not carry from memory. If Brevo is
  wanted as a live candidate, it needs a fetch from a tool that can render
  JavaScript, or a manually supplied policy text.

**Buttondown**

- data_location: **Unclear** — the privacy policy does not state where data
  is processed or stored, deferring to a separately-referenced Data
  Processing Agreement that was not fetched this run. (buttondown.com/legal/
  privacy, last updated 1 April 2026, fetched 2026-09-04 — the most recently
  maintained policy of the eight.)
- trains_on_input: **Unclear** — not addressed.
- nonprofit_tier: **Not checked this run.**
- Only one subprocessor named in the policy itself (Stripe, for payment data);
  everything else is deferred to the DPA.

### 3.2 Why MailerLite over Supabase, given Supabase is already live infrastructure

Supabase's lower onboarding friction is real — no new vendor relationship, no
new DPA to review — but two things count against it specifically for *this*
purpose: it makes no affirmative no-training claim for stored table data
(Unclear, not No), and using it means Jasmin builds her own consent-recording
and unsubscribe mechanism by hand. A proper ESP (MailerLite, or any of Tally/
EmailOctopus/Kit) carries unsubscribe and consent-state handling as a built-in
product feature, which matters directly to finding 5 below (PECR): getting
opt-out mechanics right in every marketing message is materially easier with
a tool built for it than with a bare Postgres table plus a hand-rolled sender.
That product fact, not just the data-location column, is why the
recommendation is MailerLite and not the infrastructure Jasmin already has an
account with.

### 3.3 DPIA screening (Article 35)

Source: **UK GDPR Article 35**, legislation.gov.uk, fetched 2026-09-04. The
page carries a general "changes yet to be applied" banner; nothing in that
banner touches Article 35 specifically, so it does not qualify what follows.

> **Article 35(1):** "Where a type of processing in particular using new
> technologies, and taking into account the nature, scope, context and
> purposes of the processing, is likely to result in a high risk to the
> rights and freedoms of natural persons, the controller shall, prior to the
> processing, carry out an assessment of the impact of the envisaged
> processing operations on the protection of personal data."

> **Article 35(3):** "A data protection impact assessment... shall in
> particular be required in the case of: (a) a systematic and extensive
> evaluation of personal aspects relating to natural persons which is based
> on automated processing, including profiling, and on which decisions are
> based that produce legal effects... or similarly significantly affect the
> natural person; (b) processing on a large scale of special categories of
> data referred to in Article 9(1)... or (c) a systematic monitoring of a
> publicly accessible area on a large scale."

None of the three apply on the facts as given: no automated decision-making
or profiling is planned on this data; email addresses are ordinary personal
data, not Article 9(1) special category data, so (b) does not engage
regardless of volume; there is no public-area monitoring. **35(3) is not
triggered.**

The supplementary ICO list (the practical expansion of "likely high risk"
that sits alongside Article 35(3)) could not be independently re-fetched this
run: `ico.org.uk/.../data-protection-impact-assessments-dpias/` and its
"when do we need to do a DPIA" subpage both returned 403 Forbidden, twice
each, across two different URLs, despite the source register recording this
page as cleanly fetchable as of 2026-08-31. Rather than assert its contents
from memory, I am using the practice's own pre-vetted store,
`memory/verified-facts.md`, which carries this entry with its own caveat
("research current to 24 August 2026") and is not on that file's do-not-repeat
list:

> "The ICO's Article 35(4) list adds ten more, including innovative
> technology (AI named explicitly), denial of service via automated
> decisions on access to benefits, large-scale profiling, data matching,
> invisible processing, and targeting vulnerable groups." — *verified-facts.md,
> sourced to ICO, current to 24 Aug 2026, not independently re-fetched live
> today.*

Against that list: this is not innovative technology (a mailing-list tool is
not AI), no automated decisions on access to anything, no profiling planned,
no data matching against another dataset (worth asking again if that ever
changes — see review triggers), collection is visible and consented-to by the
person submitting their own email, and template downloaders are not, as a
class, a vulnerable group. **No trigger on this list either, on the facts as
given.**

**Screening verdict: DPIA not triggered.** This is a screening conclusion on
the stated facts, not a finished DPIA and not a substitute for one if the
facts change — see review triggers.

### 3.4 Lawful basis, and the Article 7(4) bundling problem in the old design

Two UK GDPR provisions govern this, and a third UK statutory instrument
(PECR) governs a related but distinct question that the brief did not ask but
that a governance-clean answer cannot ignore.

**What the old design did.** Gating the free template behind a Substack
subscription made access to one thing (the document) conditional on
agreeing to another (a standing newsletter subscription, itself a form of
ongoing processing). Source: **UK GDPR Article 7(4)**, legislation.gov.uk,
fetched 2026-09-04 (unrelated future amendment banner present — a s.386
insertion at Article 4(A2A), nothing to do with Article 7 substance):

> "When assessing whether consent is freely given, utmost account shall be
> taken of whether, *inter alia*, the performance of a contract, including
> the provision of a service, is conditional on consent to the processing of
> personal data that is not necessary for the performance of that contract."

The provision of the document did not require a newsletter subscription to
exist as a service; the subscription was not necessary to give someone a
Word file. Article 7(4) directs "utmost account" to exactly this pattern when
judging whether consent was freely given, which is a strong signal against
that consent being valid. This is the legal grounding for the ruling already
recorded in `.claude/CLAUDE.md` reversing the gate — worth having on record
with the clause quoted, since the file's own reasoning cites trust and
positioning, not this provision.

**What the new design must not repeat.** If email capture is added as an
optional field on an otherwise-ungated download, this problem does not recur:
nothing is conditional on providing an email, so Article 7(4) does not bite.
If a gate is reintroduced on a different vendor, the same analysis returns in
a new coat — the fix was never "leave Substack", it was "stop bundling", and
this needs restating before any new gate design is approved.

**Lawful basis, on the ungated-plus-optional-field reading.** For simply
storing an email someone volunteers, with no immediate onward use stated,
legitimate interests (Article 6(1)(f)) is available in principle — but only
covers the purpose actually specified at collection. If the real intent is to
build a list to email later about the consultancy (which the brief's framing,
"capture the email address... for the practice", suggests), that is a
marketing purpose, and:

**PECR is the other regime, not covered by the vendor axis, and not fetched
this run.** The Privacy and Electronic Communications Regulations 2003
govern whether Jasmin may *send* marketing email to an address she holds, as
distinct from whether she may lawfully *store* it. Regulation 22's "soft
opt-in" exemption from needing prior consent applies only where the recipient
is an existing customer, the marketing is for similar products or services,
and an opt-out was offered at collection and in every message. Template
downloaders are prospects, not existing customers, so soft opt-in is unlikely
to apply cleanly — but this is a genuine open question, not a settled one, and
**this run did not fetch PECR's text**, so the reg 22 test above is stated as
the generally-understood shape of the regime rather than a verified quotation,
and is flagged accordingly. **UNVERIFIED: PECR reg 22 mechanics, not fetched
this run.** Do not rely on the paragraph above as a citable clause; treat it
as the question to take to source (or to a lawyer) before this list is ever
used for marketing, not as cleared.

### 3.5 ICO registration and the fee

**UNVERIFIED this run.** `ico.org.uk/for-organisations/data-protection-fee/
data-protection-fee/` returned 403 Forbidden twice. This practice's own
dependency register (`reports/2026-08-25-template-dependency-register.md`,
row 13) recorded on 28 August 2026 that the page describes two different
things — a narrow, self-assessed not-for-profit exemption paying nothing, and
a flat £52 charity-capped tier that most charities actually fall into — and
flagged that as a nuance worth tightening. That is the practice's own prior
documented finding, not this run's verification, and I am not re-asserting
its specific figures as checked today. Jasmin is not a charity, so the
charity-capped tier is not her question in any case; the question for her own
consultancy is whether processing personal data solely for her own
organisation's staff administration, or advertising, marketing and PR for her
own business, sits inside the self-assessed exemption. **Do not treat this as
resolved.** The actionable step is ICO's own self-assessment checker, run by
Jasmin, not asserted here from an unfetched page.

### 3.6 What Jasmin owes as a controller that she does not owe today

- **The live privacy policy becomes false the moment capture goes live.**
  `src/pages/PrivacyPolicy.tsx:25` states: *"The Edit itself runs no email
  capture and holds no subscriber list."* That sentence, and the section 2
  framing that Substack alone is the controller of any subscriber
  relationship, must be rewritten in the same change that ships the new
  capture — not scheduled for afterward. This is copy Jasmin signs
  (`PrivacyPolicy.tsx`'s own header comment), not a code session's to draft,
  so it needs her sign-off before it ships, same as the rest of the site's
  legal text.
- **A retention period does not currently exist for this data and needs
  setting.** Nothing in the practice's documents states how long a captured
  email is kept, or on what trigger it is deleted.
- **A SAR/deletion route exists in principle** — the privacy policy already
  directs people to hello@jasminaziz.co.uk for access and deletion requests —
  but that route only works if it actually reaches whatever store is chosen.
  Confirm someone (Jasmin) will check the new vendor's list when a request
  comes in; it is not automatic.
- **Article 28 requires a written contract with any processor.** Accepting
  MailerLite's (or any vendor's) standard online DPA is the mechanism; it
  needs to actually be reviewed and accepted for this specific processing
  purpose, not assumed to already be in place because an account exists.

## 4. DPIA position

**Not triggered**, on the facts analysed in 3.3: ordinary personal data, no
special category data, no automated decision-making or profiling, low
volume, transparent collection, no vulnerable-group targeting. This is a
screening verdict, not a finished DPIA and not a permanent clearance — see
review triggers.

## 5. Board summary

Jasmin needs a place to store the emails people give her for the free policy
template, now that the Substack gate is gone, and the vendor she picks must
pass the exact bar The Edit holds every listed tool to. MailerLite is the
recommended store: it holds data in the EU, makes an affirmative written
promise not to train AI models on it, and — unlike using the site's existing
database — handles unsubscribe and consent tracking as a built-in feature
rather than something built by hand. The decision needed now is whether the
template stays freely downloadable with email as an optional add-on (which
keeps this simple) or whether a gate returns in a different form (which
reopens the exact consent problem the Substack gate was reversed to fix); if
neither is decided and the site simply starts collecting emails informally,
the live privacy policy will be actively false the day it happens, which is
the concrete risk of deferring this.

## 6. Where a lawyer is needed

- **PECR regulation 22 (soft opt-in), before this list is ever used to send
  marketing email**, not before it is used purely to store an address. This
  practice did not fetch PECR's text this run and should not be treated as
  having cleared it; a lawyer or a completed ICO self-assessment is needed
  before Jasmin emails this list about anything beyond delivering the
  document itself.
- **Nowhere, on the DPIA screening question.** The Article 35(3) analysis is
  reasoned from the fetched statute and is not close to any of its
  boundaries on these facts.
- **Nowhere, on accepting a vendor's standard-form DPA**, as a routine
  business decision within a certified GDPR practitioner's own competence —
  unless Jasmin wants bespoke terms, which would be a contract question for
  a lawyer, not a governance one.

## 7. Review triggers

- **The ungated-vs-gated decision is made.** If a gate is reintroduced on the
  new vendor, redo finding 3.4 — the Article 7(4) analysis depends on the
  UX flow, not the vendor.
- **This list is ever used to send marketing content**, as opposed to
  delivering the document. Triggers the PECR question in 3.4 becoming live
  rather than prospective.
- **The nonprofit-tier check is completed** for MailerLite (or whichever
  vendor is finally chosen) against its pricing page, nonprofit page, and
  TechSoup/Charity Digital Exchange, per the axis's own evidence standard —
  not done in this run.
- **MailerLite's AI-assisted features (subject-line generation etc.) are
  used on this list.** The no-training claim this assessment relies on is
  strongest for plain storage; using the vendor's own AI features needs a
  fresh look at what data reaches OpenAI/Vertex AI as subprocessors.
- **The legacy Supabase `subscribers` table is resolved** — deleted per the
  28 August ruling, or, if kept, its RLS policy tightened from
  `anon-insert WITH CHECK(true)` to something reviewed. This should happen
  regardless of which vendor is chosen for the new capture.
- **ICO's fee/exemption page becomes fetchable again**, or Jasmin completes
  the self-assessment tool directly — 3.5 is currently an open question, not
  a cleared one.
- **A vendor terms change** on whichever store is chosen — the practice's own
  rule (vendor terms are never treated as stable) applies here as it would to
  any client assessment.

## 8. Sources fetched

**Fetched successfully, 2026-09-04:**
- UK GDPR Article 35, legislation.gov.uk/eur/2016/679/article/35 — quoted 35(1) and 35(3); register `Last verified` updated to today after this fetch.
- UK GDPR Article 7, legislation.gov.uk/eur/2016/679/article/7 — quoted 7(4); not in the source register, so no register write made for it.
- supabase.com/privacy
- policies.google.com/privacy (updated 26 May 2026 per the page)
- tally.so/privacy (policy dated 09/09/2024 per the page)
- emailoctopus.com/legal/privacy (policy dated 25 June 2020 per the page)
- mailerlite.com/legal/privacy-policy (policy dated 28 August 2026 per the page)
- kit.com/privacy (policy dated 5 September 2025 per the page)
- buttondown.com/legal/privacy (policy dated 1 April 2026 per the page)

**Attempted, failed, not filled from memory:**
- ico.org.uk DPIA guidance (both the landing page and the "when do we need to do a DPIA" subpage) — 403 Forbidden, two URLs, one retry each. Used verified-facts.md's pre-vetted, caveated entry instead (source: ICO, current to 24 Aug 2026, not independently re-fetched today).
- ico.org.uk/for-organisations/data-protection-fee/data-protection-fee/ — 403 Forbidden, one retry. Not in the source register. Marked UNVERIFIED in finding 3.5; this practice's own 28 August dependency register's prior characterisation is cited as such, not as this run's verification.
- brevo.com/legal/privacypolicy/ — returned page title only, no body, twice. Marked UNVERIFIED across all fields for Brevo.
- PECR (Privacy and Electronic Communications Regulations 2003) — not fetched this run at all. The reg 22 soft-opt-in description in 3.4 is flagged UNVERIFIED and named as a lawyer/self-check item, not cited as a verified clause.

**Read, not fetched (internal sources of truth and project files):**
- ~/AI Work/cowork/PROJECTS/AI GOVERNANCE/AGENTS/source-register.md
- ~/AI Work/cowork/PROJECTS/AI GOVERNANCE/REFERENCE/ai-governance-reference.md
- ~/AI Work/cowork/PROJECTS/AI GOVERNANCE/memory/verified-facts.md (including its do-not-repeat list — nothing on it bears on this question)
- the-edit-ai/.claude/CLAUDE.md
- the-edit-ai/reports/2026-08-25-template-dependency-register.md
- the-edit-ai/reports/2026-08-23-axis-locked.md
- the-edit-ai/reports/2026-08-28-legal-pages-draft.md
- the-edit-ai/src/pages/PrivacyPolicy.tsx

**Register write made this run:** UK GDPR Article 35's `Last verified` date
updated from 2026-08-31 to 2026-09-04 after today's successful fetch. No
other field touched; no entries added or removed.
