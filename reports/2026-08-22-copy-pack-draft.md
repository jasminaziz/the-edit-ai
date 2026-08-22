# The Edit — Copy Pack for the Sector Re-point

> DRAFT for Jasmin's review, 22 Aug 2026. On approval, a code session
> places these strings exactly as written, on `overhaul/sector-axis`.
> Code sessions place strings; they never author or improvise copy.
> Voice rules apply throughout: UK English, contractions, no em dashes,
> no inline quote marks, direct.
>
> Two items marked [CONFIRM] need Jasmin's decision before placement.

---

## 1. Homepage intro block — `src/pages/Index.tsx`

**Lead line (bold, unchanged):**

> There's a lot to keep up with. This helps.

Kept deliberately: it is audience-neutral, it works, and the paragraph
below now does the positioning work.

**Body paragraph (replaces "A curated directory of AI tools that actually
work… without having to become an expert first."):**

> An honest directory of AI tools for communications teams in charities,
> cultural organisations and heritage. Every tool is judged on the
> questions your sector actually has to answer: where your data sits,
> whether the tool learns from what you type into it, whether there's a
> charity price, and whether you could explain it to a trustee. No
> sponsored listings, no affiliate links.

**Byline link (unchanged):**

> Curated by Jasmin Aziz | Strategic Communications Consultant →

---

## 2. Homepage meta — `src/pages/Index.tsx` SEO block

**Title (replaces "The Edit | Curated AI Tools for Marketing & Comms
Professionals"):**

> The Edit | AI Tools for Charity & Cultural Comms Teams

**Description (replaces "An opinionated AI tools directory built by Jasmin
Aziz. Real verdicts, no sponsored lists. Updated regularly."):**

> An honest AI tools directory for charity, cultural and heritage comms
> teams. Data location, training policy and nonprofit pricing checked on
> every tool. No sponsored lists.

**JSON-LD `description` (replaces the current WebSite description):**

> An opinionated directory of AI tools for communications teams in
> charities, cultural organisations and heritage. Built and maintained by
> Jasmin Aziz.

OG title and description mirror the meta title and description above
(SEO.tsx currently reuses homepage OG everywhere; per-page OG is a
code-session fix in the SEO repairs task).

---

## 3. About panel — new component, homepage

**Heading:**

> What this is

**Body (the audit's section 2 paragraph, the canonical positioning
statement):**

> The Edit is an opinionated directory of AI tools for communications
> teams in charities, cultural organisations and heritage. Every tool here
> is judged on the questions this sector actually has to answer before
> adopting anything: where your data sits, whether the tool trains on what
> you type into it, whether there is a nonprofit price, whether using it
> is likely to need a DPIA, and whether you could explain it to a trustee
> in one sentence. No sponsored listings, no affiliate links, and no tool
> appears until it has been through the checks. Built and maintained by
> Jasmin Aziz, a strategic communications consultant who works with
> exactly these teams.

---

## 4. Tools page — `src/pages/Tools.tsx`

**CobaltZone subheading (replaces "Things on my radar. Breadth
matters."):**

> Every tool judged on data, cost and whether you could defend it to a
> trustee.

**SEO title (replaces "AI Toolkit | The Edit"):**

> AI Toolkit for Charity Comms | The Edit

**SEO description (replaces "49 curated AI tools across Writing, Research,
Design, Video, Automation and Building…"):**

> Curated AI tools for charity, cultural and heritage communications, with
> data location, training policy, nonprofit pricing and a DPIA flag on
> every verdict.

**Canonical (bug fix, same edit):** `https://theeditai.co.uk/tools`
(currently points at the dead `/toolkit`).

---

## 5. Footer capture — `src/components/FooterEmailCapture.tsx`

The mechanism changes with the copy: the Supabase form is replaced by a
link block to `/policy-template`. No more writes to the subscribers table.

**Heading (replaces "Get The Edit in your inbox"):**

> Get the AI-use policy template

**Sub-line (new):**

> Free for charity, cultural and heritage comms teams. The document that
> answers the questions your trustees will ask.

**Button:**

> Get the template →

Links to `/policy-template`. The small "Or see the full sign-up page"
link is removed; the Subscribe page becomes the same offer (section 6).

---

## 6. Subscribe page — `src/pages/Subscribe.tsx`

**Headline (replaces "Cut through the noise"):**

> Start with the policy template

**Body:**

> The AI-use policy template for charity, cultural and heritage
> organisations: what your policy should say about data, tools and
> disclosure, written to be adapted, not admired. It's free, in exchange
> for your email.
>
> Subscribers also get The Edit on Substack: what changed in the checks,
> what's worth your attention, and what it means for your comms.

[CONFIRM] The old copy promised a fortnightly digest that doesn't exist.
This draft promises no cadence. If you want to name one, it has to be one
you'll keep.

**Button:**

> Get the template →

Links to the Substack subscribe URL (the gated post delivers the
template). The first-name and email fields are removed; Substack handles
capture.

---

## 7. /policy-template page — new route

**Heading:**

> The AI-use policy template

**Body:**

> Most AI policies are written for organisations with a legal team. This
> one is written for yours: a working AI-use policy for charity, cultural
> and heritage organisations, covering the questions that actually come
> up. Which tools staff can use and for what. What must never go into
> them. When a DPIA is needed. What you tell trustees, funders and
> supporters. It's the same starting point I use with consultancy clients,
> ready to adapt to your organisation.
>
> It's free. Subscribe and it arrives in the welcome email.

**Button:**

> Get the template →

Links to the Substack subscribe URL.

**Small print under the button:**

> Delivered through The Edit's Substack. Unsubscribe any time; the
> template is yours either way.

[CONFIRM] "The same starting point I use with consultancy clients" — one
sentence of claim. Keep only if the public scrub leaves the template
recognisably that document.

---

## Not in this pack, on purpose

The 30 tool verdicts (October, after the axis research). My Stack, Design
Kit, Learning and AI News page copy (out of overhaul scope). Anything that
makes the gate live before the gated Substack post exists: this copy ships
on the branch and reaches the live site only at the October merge, by
which point section 7's page and the Substack post must both exist.
