# Copy candidates: Privacy Policy §2 and a route back to Jasmin

Drafted 2026-09-04. Governing voice: this project's own `.claude/CLAUDE.md`
("Voice rules (locked)" and "Conversion"), plus `reports/2026-08-28-positioning-statement.md`.
The Edit is not the consultancy; the consultancy's voice spec does not apply
here. Nothing in this file is placed. Jasmin chooses.

---

## JOB 1: Privacy Policy §2 (`src/pages/PrivacyPolicy.tsx`)

### Verdict

Both sentences in the current section are false, for different reasons, and
the second is the more serious of the two: it asserts an absence of data that
does not hold. Fix is available as a wording change for sentence 1; sentence
2 needs Jasmin to make a factual decision before any wording is final, because
the honest sentence depends on a retention position she hasn't stated yet.

### Findings

1. **"When you subscribe to get the AI-use policy template..."**: the gate
   this describes was removed 30 August 2026 (`the-edit-ai` `.claude/CLAUDE.md`,
   Conversion section: "The template is not gated"). The template downloads
   directly as a `.docx` with no email step. This sentence describes a flow
   the site no longer has. **Cut and replace**, don't soften.

2. **"The Edit itself runs no email capture and holds no subscriber list."**:
   the first half is true (no capture mechanism exists or is scheduled). The
   second half is false: the Supabase `subscribers` table holds six real rows
   collected March to June 2026, three of them third parties, verified live.
   This is the more important error because it's a factual assertion about
   data held, in a document whose entire job is accurate factual assertion
   about data held. **Do not repeat the error in new words.** A rewrite that
   keeps asserting "nothing is held" is worse than the current line, because
   it would be freshly signed rather than merely stale.

3. **Collects vs. holds is the fault line, and the current draft conflates
   them.** "Runs no email capture" (present-tense mechanism) and "holds no
   subscriber list" (present-tense state of the data store) are different
   claims. The first is true today. The second requires naming what exists:
   a dormant legacy list nobody is adding to. Any candidate that doesn't
   separate these two clauses reproduces the bug.

4. **The heading "2. The newsletter and the template" bundles two now-unrelated
   data stories.** Before the gate was removed, the newsletter and the
   template were one relationship (subscribe to get one, get the other).
   They're now separate: the template involves no data collection at all;
   the newsletter is an optional Substack subscription; the legacy rows are a
   third, older story that predates both. Whether to keep one section or
   split it is a structural decision, not a wording one, flagged below rather
   than decided here.

5. **Section 5 ("Your rights") already covers the legacy rows without
   editing.** Its existing generic clause (ask what we hold, ask for
   correction or deletion, complain to the ICO) applies to anyone whose data
   the site holds, including the six legacy rows. No change needed there;
   it's worth Jasmin knowing the safety net already exists so §2 doesn't have
   to duplicate it.

6. **Mechanical pass (humanizer catalogue):** the current sentence is clean:
   no em dashes, contractions present and consistent with the rest of the
   page, UK spelling correct. The defect here is factual, not stylistic. No
   humanizer finding to file.

### Candidates

All three keep the "no email, no sign-up" wording, which is reused verbatim
from the already-approved `/policy-template` copy ("It's free, and it
downloads straight away. No email, no sign-up.") rather than invented fresh.

**Candidate 1: single section, minimal, closest to the current shape**

> The AI-use policy template downloads straight from this site. No email, no
> sign-up: nothing is collected when you get it.
>
> The Edit runs no email capture of its own. It still holds a short list of
> email addresses collected while people tested an early version of the site,
> between March and June 2026; nothing has been added to it since and none of
> it is used for marketing. Jasmin's separate Substack publication is
> optional and linked from the nav and footer. If you subscribe to it,
> Substack is the controller of that relationship and their privacy policy
> applies to it.

Trade-off: cheapest to place (no heading or renumbering change), but it asks
one section to carry three different data stories (template, legacy list,
newsletter) in two paragraphs, which is a lot of ground for "plain, short,
checkable" copy to cover cleanly.

**Candidate 2: split into two (or three) headed sections**

> **2. The template.**
> The AI-use policy template downloads directly from the site. No email, no
> sign-up: nothing is collected when you get it.
>
> **3. The newsletter.**
> Jasmin also publishes a separate Substack newsletter, linked in the nav and
> footer. It has nothing to do with the template. If you subscribe, Substack
> is the controller of that relationship and their privacy policy applies to
> it.
>
> **4. A small legacy list.**
> Between March and June 2026, before this policy and before the template
> existed, a small number of people gave an email address while testing an
> earlier version of the site. Nothing has been added to that list since, and
> none of it is used for marketing.

Trade-off: cleanest separation of three genuinely different claims, each
checkable on its own. Costs a renumbering of every section after it (current
3, 4, 5 become 5, 6, 7), and Jasmin has to decide whether the legacy list is
important enough to earn its own numbered heading or should stay folded into
prose.

**Candidate 3: shortest, defers detail to the existing rights clause**

> Getting the AI-use policy template needs no email and no sign-up: it
> downloads straight from the site. The Edit runs no live email capture. A
> small number of addresses from early testing of the site remain on file and
> aren't used for marketing; see "Your rights" below for how to ask about
> them. Jasmin's separate Substack publication is optional, and if you
> subscribe to it, Substack is the controller of that relationship and their
> privacy policy applies to it.

Trade-off: shortest option and the least new detail to get wrong, but it does
the least of what the brief calls for: it names that something is held
without saying much about what, leaning entirely on §5 to answer "and what
happens to it."

### Decisions that are Jasmin's, not wording choices

- **Whether to name Supabase.** The current page already names Substack as
  the controller of the newsletter relationship. Parallel treatment would
  name Supabase as the store for the legacy rows. Not naming it is defensible
  too: the legal question is who controls the data, not which vendor's
  database it sits in. Either is honest; it's a specificity choice.
- **Whether to state a retention position on the six rows**, beyond "kept,
  no action needed." The operational ruling (leave them, they're known
  friends) isn't the same claim as a public retention statement (kept
  indefinitely? kept until someone asks? no policy yet?). None of the three
  candidates above commits to one; all three would need a sentence added if
  she wants to state one.
- **Whether to give a count or date range at all.** All three candidates say
  "a small number" / "March to June 2026" rather than "six." I'd default to
  no exact count in public copy, since a number that changes (if a row is
  later deleted) makes the policy go stale in a way "a small number" doesn't.
  Her call.
- **Whether §2 stays one section or splits (Candidate 2).** This changes
  section numbers throughout the page, which is a bigger edit than the two
  sentences in question.

---

## JOB 2: A route from The Edit back to Jasmin

### Verdict

The gap is real and correctly diagnosed: every existing link hands a
convinced reader to a homepage, not to an answer. But the fix has a live
tension with the site's own signed positioning, and the brief's framing
("product page for service line five") is ahead of that document, not a
restatement of it. I've drafted inside the existing hierarchy rather than the
proposed reframe, and named where they diverge.

### Critique

1. **The positioning statement (28 Aug, signed, governing) ranks purposes and
   states a hard limit on this exact thing.** Purpose 2 is "feed the
   consultancy," but it's ranked second, and it's explicit about the
   mechanism: "carried by the standing Work with me links in the nav and
   footer and the soft hand-off in the About line. **The directory content
   itself never pitches.**" The task's framing states that "The Edit is
   becoming the product page for the consultancy's service line five, not a
   second brand." That describes a reframe. It isn't in the signed document.
   I'm not treating that framing as authority to widen what the site pitches;
   I've drafted a block that adds information (what working with Jasmin looks
   like), not persuasion (why you need it), and flagged that formally
   elevating purpose 2 is a positioning-statement edit for Jasmin to make,
   not something a copy pass can do on its own steam.

2. **Name the risk plainly, as asked.** The Edit's whole credibility argument
   is "no sponsored listings, no affiliate links," proven by publishing the
   failures. A block that reads as marketing copy for the consultancy
   (benefit language, urgency, a generic "ready to transform your comms?"
   hook) is functionally the same thing the site swears off, just
   self-sponsored instead of paid-for. The guard the positioning statement
   puts on purpose 3, "a site that audits its readers contradicts the lens it
   exists to demonstrate," is the same shape of risk here: a directory that
   pitches contradicts the trust it exists to build. The fix is register, not
   avoidance: descriptive and factual, in the same plain first-person the
   About panel already uses ("I'm Jasmin. I work with exactly these teams."),
   not superlative or urgent.

3. **Placement: homepage AboutPanel, not `/tools`, not the footer, not a new
   CobaltZone section.**
   - **`/tools` is the wrong surface.** It's the highest-trust page on the
     site: the checks, the DPIA chips, the exact place the "no sponsorship"
     claim has to hold. Landing a consultancy hand-off there is the closest
     this could come to looking like what the site says it doesn't do. It
     also already carries the template CTA and the radar signpost, and
     `.claude/CLAUDE.md` already documents CTA-crowding as a real, previously
     fixed problem on this page (the radar signpost was deliberately spliced
     away from the template card "so two CTAs do not land back to back").
   - **The footer is the wrong surface.** It renders on every route
     (`Layout.tsx:258` for `FooterEmailCapture`; the "Work with me" link
     itself sits in the footer too). `.claude/CLAUDE.md` records exactly why
     wording was cut from the footer once already: "meta strings cannot
     crowd each other, because nobody reads two... on-page copy is read in
     sequence, so that is where crowding is real." A persuasive paragraph
     that repeats on every page in a session is the fastest way to make
     itself feel like a pitch, regardless of what it says.
   - **A new full-width CobaltZone section is the wrong register for a first
     move.** CobaltZone is the site's big cobalt callout, used for page
     titles and the DPIA explainer, visual weight the site currently spends
     on the checks system, not on the consultancy. Giving the hand-off the
     same weight risks it reading as a stand-alone advert bolted onto a
     resource, which is the specific failure the brief names.
   - **AboutPanel is the right surface.** It's the one place the positioning
     statement already sanctions this ("the soft hand-off in the About
     line"), it's seen once (homepage, not sitewide), and it sits directly
     after the paragraph that already does the site's credibility work ("So
     I check... No sponsored listings, no affiliate links... I'm Jasmin. I
     work with exactly these teams."). A short, factual addition there reads
     as a continuation of that paragraph, not a swerve into sales.

4. **What I checked before drafting, so I'm not inventing a service.** I
   fetched jasminaziz.co.uk live. The real service categories are
   Communications Audit, Brand and Positioning, Campaign Strategy and Plan,
   Content and Editorial System, and AI, Trust and Communications (service
   line five). Engagement models are Fractional, Advisory and Per Project.
   The site's own soft CTA phrasing is "Tell me what you're working on" and
   "Get in touch." None of my candidates below names a price or promises a
   turnaround; all of them use the consultancy's own names for its own
   services rather than paraphrasing them into something punchier.

5. **The existing byline line is locked and none of these candidates touch
   it.** "Curated by Jasmin Aziz | Strategic Communications Consultant" with
   its arrow (`AboutPanel.tsx:178`) is preserved verbatim per the 28 Aug
   positioning statement's own ruling ("The About byline stays 'strategic
   communications consultant'"). All three candidates below add material
   before it, not instead of it.

### Candidates

All three are additions to `AboutPanel.tsx`, placed after the existing "I'm
Jasmin. I work with exactly these teams. This is the resource I wanted to
hand them, so I made it." paragraph and before the byline link. One sentence
to one short paragraph each; the block should stay smaller than the "So I
check..." paragraph above it, since it's the least load-bearing claim on the
page.

**Candidate A: plainest, lowest register, append-only**

> If what you need is bigger than a tool, this is also what I do for a
> living: comms audits, brand and positioning work, campaign strategy, and
> AI, trust and communications, run fractional, advisory or project by
> project.

Trade-off: purely descriptive, lowest risk of reading as a pitch, but has no
verb telling the reader what to do next: it leans entirely on the unchanged
byline link below it to carry the action. Cheapest to approve.

**Candidate B: names the services, adds a direct invitation**

> The consultancy side of this is Jasmin Aziz: comms audits, brand and
> positioning, campaign strategy, and AI, trust and communications, worked
> fractional, advisory or project by project. If that's what you're actually
> short of, say so.

Trade-off: warmer and more visibly a next step ("say so" is a real
invitation, not a slogan), but it's the first line on the page that could be
misread as a pitch if a reader is primed to look for one. The mitigation is
that it names real service categories rather than benefits ("say so", not
"unlock your comms potential"). Worth Jasmin's eye on whether "say so" reads
right for this page or slightly too casual next to the plainer paragraph
above it.

**Candidate C: shortest, driest, could survive even in a lower-trust slot**

> Jasmin also runs a consultancy: comms audits, brand and positioning,
> campaign strategy, content systems, and AI, trust and communications. Get
> in touch.

Trade-off: the least risk, the least new information, and the least of what
the brief actually asked for. It reads as a directory listing for the
consultancy rather than a description of what working with her looks like.
Reuses the consultancy's own "Get in touch" phrasing rather than the site's
usual "Work with me," a deliberate signal that this is a different, lighter
kind of link than the standing nav CTA, but that's a judgement call, not a
locked choice.

### Flagged, not decided

- **Whether purpose 2 gets formally elevated** in the positioning statement,
  which would license a stronger version of any of these (a dedicated
  section, more visual weight, a repeated version elsewhere). Not done here;
  that's Jasmin's document to amend, not a copy pass's call.
- **"Say so" in Candidate B**, flagged above as the one register choice that
  most needs Jasmin's ear rather than a rule.
- **Whether to reuse "Get in touch" (Candidate C) or keep everything under
  "Work with me"** for consistency with the rest of the site's CTA
  vocabulary, a wording choice, hers to make.

### No learning proposed

Nothing here revealed a gap in this project's own voice spec: `.claude/CLAUDE.md`'s
locked voice rules and the positioning statement covered every question this
pass raised. No entry proposed to LEARNINGS.md.
