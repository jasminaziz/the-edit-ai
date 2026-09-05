# The Skeptical Stranger — capture audit, AI-use policy template

**Scope note.** This is not the full five-page cold-pass audit. The launching brief asked one narrow question: whether and how to capture an email from a downloader of the policy template, now that the Substack gate is dead. Read in this order per the brief: `.claude/CLAUDE.md`, `reports/2026-08-28-positioning-statement.md`, `SCRATCHPAD.md` lines 657–786 (the 30 Aug ruling in full), `reports/2026-08-25-template-dependency-register.md`, `reports/2026-08-22-handover-to-relaunch.md` (item E9), then the live component code: `src/pages/PolicyTemplate.tsx`, `src/components/FooterEmailCapture.tsx`. A cold fetch of `/policy-template` was attempted first and returned only the page title — client-rendered SPA, no JS execution in the fetch tool — so the cold read below is the component source, which is ground truth for what a browser actually paints.

---

## Verdict

No visitor currently hands over an email on this site, anywhere, for anything — because there is nowhere to type one. `FooterEmailCapture.tsx`, present on every route via `Layout.tsx:258`, contains zero `<input>` elements; its only interactive element is a `Link` back to `/policy-template`. The component's name is the only trace of a capture mechanism that no longer exists.

Would a stranger stay and act on `/policy-template` as built today: **yes**. The page delivers on its promise in one click, states plainly what the reader is agreeing to ("No email, no sign-up"), and the download works. That page currently converts on its own terms. It does not convert email addresses, because it was never asked to and it says so out loud.

---

## Findings, in order of cost

### 1. The component named for the job does not do the job

`src/components/FooterEmailCapture.tsx` renders a heading, a line of copy and a link. No form, no field, no submit handler. It is not a broken capture component; it is a navigation card wearing a capture component's name. Anyone reading the codebase — including, evidently, the web-build guide's own defect log (see Staleness, below) — will reasonably conclude a capture mechanism exists here. It does not. **Cost:** not conversion cost on the live site (nothing is currently promising capture to a visitor), but planning cost: any future work that "restores" or "fixes" `FooterEmailCapture` will be restoring a form that was deliberately removed for a reason (the 30 Aug ruling) rather than repairing a regression. **Fix:** rename the component or add a form to it. Do not touch this without deciding gate-vs-optional first — see the committed answer below.

### 2. The corrections/currency framing is real but currently unbacked

The strongest honest reason to ask for an email on this specific page is the one E9 names: every download is a frozen copy, two clauses in the template (`§11 ownership`, `§12 DPIA trigger`) can become **wrong**, not merely stale, and there is currently no channel that reaches a downloader after the fact. That is a genuine service, not a marketing hook — but as of today it does not run. E2 (rebuild the fortnightly task into a currency watcher) is "Not started" per the handover register, and E8 confirms the two WRONG-class clauses depend partly on legislation.gov.uk, which cannot be fetched automatically from this environment at all — so even once E2 ships, the two highest-stakes rows are covered only by "the quarterly human pass," which is not scheduled or committed anywhere a visitor could see. **Cost:** if the ask goes live before the mechanism does, it is a promise made against a service that does not yet exist — the exact shape of trust failure the 30 Aug ruling's argument 3 was written to avoid, just moved from the download to the corrections list. **Fix:** the copy for this ask cannot claim monitoring or a cadence until one is real. It should state what actually happens today (Jasmin personally reviews it; no automated watch exists yet for the WRONG-class clauses) rather than implying a system that isn't built. Flag for Jasmin: this is a copy constraint, not a copy draft.

### 3. Any version that asks before the download re-opens the argument that closed 30 August

A form ahead of, or gating, the CTA reintroduces exactly what the ruling killed, and does so on a page that states two paragraphs later "No email, no sign-up" — a direct, same-screen contradiction, which is a sharper failure than the abstract case against gating. It also reopens argument 4 verbatim: the careful charity or local-authority comms lead who cannot hand over a work email without asking someone is the buyer, and a pre-download field filters her out first. **Fix:** nothing goes above or inside the CTA. If a capture field is added, it sits below the download link, never beside or before it.

### 4. No version of the ask should live only in the file

The template ships as a `.docx`, one-way, no return channel. A static Word document cannot submit a form. At best its face can print a version number, a last-checked date and a stable URL for corrections (the source markdown at `reports/2026-08-25-ai-use-policy-template-v3.md:457–459` promises exactly this in the footer of every page) — but that is a *reference*, not a *capture mechanism*, and I have not verified it actually made it into the served `.docx` (binary; not machine-readable by the tools used for this audit). **Flag, not a finding:** confirm the footer text is actually in `AI-Use-Policy-Template.docx` before relying on it as a distribution safety net; if it isn't there, the frozen-copy risk E9 names is currently uncushioned even for a reader who never returns to the site.

---

## The six questions

**1. At what exact moment would a stranger give a work email, and what would have to be on the page?**
Not before the download — the page has already promised not to ask, and asking anyway reads as the promise breaking in real time. The only credible moment is *after* the click has already fired and the file is already on their machine: at that point the ask carries no risk to them (they already have what they came for) and can be judged purely on whether the reason given is worth the address. What has to be on the page for that moment to convert: the two WRONG-class risks named specifically (not "keep in the loop" language), and a true statement of what happens next if they give the email — not an implied monitoring service that doesn't exist yet.

**2. Does "tell me where to send corrections" read as service or trick? Attacked, not confirmed.**
It is the strongest available framing and it still has three holes. First, the mechanism it promises (E2/E8's currency watcher) is not built, so today it is a promise against nothing — the ask would be collecting an asset now for a service that arrives later, if it arrives. Second, the highest-stakes risk it's supposedly protecting against (statute-based clauses 9 and 11) is explicitly outside what any agent here can watch — legislation.gov.uk is blocked — so the part of the pitch that sounds most technical and reassuring ("I'll tell you when the law moves") is the part that is actually running on a human's unscheduled attention, not a system. Third, if placed anywhere near the CTA rather than clearly after and below it, it reads as the subscribe gate back in a legal costume, on the same page that just said it wouldn't ask. It survives as service only if it is optional, placed after the download, and honest about being a manual review rather than a monitored feed.

**3. Is there a version that makes the site less trustworthy than today's ungated page? Name it.**
Three, all avoidable: (a) re-gating the download itself, which contradicts "No email, no sign-up" printed on the same screen and reopens the exact reader-exclusion problem the 30 Aug ruling closed; (b) shipping the corrections-list ask with copy that implies active monitoring while E2 is unbuilt and the statute-dependent clauses are unwatchable by design; (c) placing any email field above or beside "No email, no sign-up" rather than clearly after it, which a stranger reads as bait-and-switch regardless of whether it is technically optional.

**4. Gate vs optional — which converts better for this audience, which serves the funnel, which metric should the mechanism optimise for?**
For this specific audience — comms leads at charities, cultural bodies and heritage organisations who often need permission to hand over a work email — a gate converts worse, not better; this is not a hypothesis, it is the reasoning already tested and ruled on 30 Aug (argument 4, "the careful reader is the buyer"). For the consultancy funnel, the positioning statement ranks "feed the consultancy" second, carried by the standing Work with me links, and states the directory content itself never pitches — an email asset gained by coercion is a colder lead for a consultancy sale than one given freely by someone who read the whole page and cared enough to ask about legal currency. **The mechanism should optimise for lead quality, not subscriber count.** A large list built on a re-gate would actively work against both of the site's own stated priorities: purpose 1 (trust and reach) and purpose 2 (a warm lead for the consultancy).

**5. Where does the ask belong — before, after, on the page, in the file, all of the above?**
After the download completes, on `/policy-template` itself, below the existing DPIA explainer — the same placement principle already used for that section ("placed below the intro block... so it does not interrupt the conversion path"). Never as an interstitial or modal on click, which would functionally re-gate the experience even while being technically "after" the click event. Never in the file alone — a `.docx` cannot capture anything; at most its face can point back to a stable URL, which is a hygiene item for E9, not a capture mechanism.

**6. Mobile: does it survive a phone?**
Structurally, yes, if built inside the existing container. The page already runs `max-w-[640px] mx-auto` with `px-4` gutters at the base breakpoint, and the CTA (`display:block`, `maxWidth:320`, `padding:16px 24px`) is a comfortable single-column tap target. A secondary, optional field below the DPIA section needs to stack full-width inside that same container, match the CTA's vertical padding so it isn't a visually "smaller" or lower-priority tap target than the primary download, and be visibly separated (rule, spacing, an explicit "optional") from both the CTA above it and the DPIA copy around it, so a thumb-scrolling reader reads it as *after*, not *instead of*. This is a build-time requirement, not something the current code proves or disproves, because the field does not exist yet.

---

## Staleness flag

The web-build guide's own defect log is now describing components that do not exist in the form it names. `web-build-guide.html` §8 (Open defects), row 10 and row 12, and §7 (Live status), the Edit's accessibility-gate row, all cite `Subscribe.tsx` and `FooterEmailCapture.tsx` for unlabelled placeholder-only inputs and unhandled Supabase insert-failure catch paths. `Subscribe.tsx` was deleted in the 2026-08-31 dead-code sweep (recorded in `.claude/CLAUDE.md`). `FooterEmailCapture.tsx`, read in full for this audit, contains no `<input>` and no catch path — it is a heading, a line of copy and a `Link`. A repo-wide grep for `<input` in `src/` returns exactly two matches, both search filters on `/tools` and `/radar`, neither an email field. The defects the guide is tracking describe a form that was removed, not a form that still needs fixing. Anyone opening the guide today and working from §8's row 10/12 will "fix" code that is not there.

---

## Named manual checks (not run here)

- Real download on a phone: confirm `download` on `<a href="/AI-Use-Policy-Template.docx">` actually saves rather than opens an in-browser Word viewer on iOS Safari and Android Chrome — file-download behaviour on mobile browsers is not verifiable from source alone.
- Open the served `.docx` and confirm whether the version-number and last-checked footer promised in the source markdown (`reports/2026-08-25-ai-use-policy-template-v3.md:457–459`) is actually present on the page face — binary file, not machine-readable by the tools used here.
- DevTools device toolbar at 375px on `/policy-template` once any secondary capture element is built, to confirm the separation from the CTA reads correctly and the new field is not visually competing with "Get the template →".

---

## Committed answer

**Optional, not gated — the download stays exactly as it is, one click, no field, no interruption.** A capture field, if built, goes below the DPIA section on `/policy-template`, after the CTA, framed narrowly around the two named legal risks that can go from dated to wrong, not around "stay in the loop." It ships only once its promise is true — E2's currency watcher live, or copy that honestly says the check is manual rather than implying a monitor that doesn't exist. Optimise for lead quality over subscriber count; that is the metric the site's own positioning already ranks. `FooterEmailCapture.tsx` gets renamed or rebuilt to match whichever of those it ends up being — it should not go on being called a capture component while capturing nothing.

**One sentence a stranger would use to describe this:** "You can just download it, no email needed" — true today, and the one thing any capture mechanism added later must not cost.
