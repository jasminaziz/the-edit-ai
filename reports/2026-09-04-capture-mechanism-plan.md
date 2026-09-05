# Capture mechanism plan: replacing Substack as the email path

**4 September 2026. Plans the mechanism only. Does not pick the final vendor;
that is running in parallel. This plan constrains what the vendor is allowed
to be.**

## The ruling this plan does not reopen

30 August 2026 (SCRATCHPAD line 709): the template download is not gated.
That stands. Nothing below puts a subscription, a form, or an email field
between a reader and `/AI-Use-Policy-Template.docx`. The question this plan
answers is narrower: how does someone who *wants* to leave an email, leave
one, given that Substack is dead as the mechanism.

## Ruling: optional, not a gate

One answer, not a menu.

**Optional, placed alongside or after the download, never in front of it.**

Three reasons, in order of weight:

1. **The 30 August reasoning does not change.** It rejected the gate on
   trust, positioning and audience grounds, not on the fact that C3 was
   unbuilt. A new gate, built properly this time, still filters for the
   incautious reader over the careful one, and the careful one is the buyer.
   Building the mechanism does not undo the reasoning that removed it.
2. **A gate on a document about honest data practices is the wrong shape.**
   The template's own §12 tells a reader when collecting data crosses into
   DPIA territory. Charging an email to read advice about not over-collecting
   data is the kind of contradiction the site's positioning statement exists
   to avoid.
3. **E9's problem does not need 100% capture to be solved.** The concern is
   a channel to reach people if the law under the template moves (two WRONG-
   class clauses in the dependency register). That needs *some* signal, not
   *every* downloader's address. An optional field that some proportion of
   readers use is sufficient to give Jasmin a list to write to if row 9 or
   row 11 ever changes; it does not need to be complete.

## What this requires of the vendor, so the vendor choice is constrained

Whatever stores the email must clear all of the following before Stage 3
starts. These are gates on the *choice*, not preferences.

- **No new contract or account signup that competes with the admin-week
  budget.** A vendor Jasmin already holds (Supabase, Resend) starts ahead of
  one she does not, purely on onboarding cost.
- **`data_location` answerable precisely**, not "Unclear". EU is acceptable;
  "Unclear" is not, because the privacy policy has to say where the data
  sits and currently says nothing is collected at all.
- **`trains_on_input`: No.** Not negotiable for a list of people who trusted
  the site with an address.
- **`nonprofit_tier` or cost: free or already paid for.** No new recurring
  cost for a feature this small.
- **RLS or equivalent access control available**, so a public anonymous
  write path can be locked to insert-only, validated, rate-limited, and
  never readable by anyone without Jasmin's own credentials.
- **`dpia_flag` closes Green**, not Amber. It closes Green only once the
  write path is rate-limited and validated (Stage 3), not on the vendor's
  default configuration.
- **A `trustee_note` Jasmin can write and mean.** If the one-sentence
  explanation needs a paragraph of caveats, the vendor is wrong, independent
  of everything else.

## My view on the vendor, held loosely, not mine to finalise

**Reuse the existing Supabase `subscribers` table. Do not bring in a new
vendor for this.**

The table already exists, in the project already live for this site
(`zsoczlgkyessfhobhtgu`), with exactly the columns a capture form needs:
`email`, `first_name`, `source`, `context`, `status`, `created_at`. It was
built for this job originally, before the Substack detour, and 0 rows sit in
it now. Standing it up again is smaller than onboarding Formspree, Basin, or
a Mailchimp/ConvertKit account, all of which need a new DPIA-shaped
assessment from nothing. Resend is the one live alternative worth naming,
since Jasmin already runs it for Aziz & Co, but Resend's audiences product is
built for sending campaigns, not for the passive "leave your email, I'll
tell you if this changes" job this feature actually has. Supabase is closer
to the job.

**The current state of that table fails the gate above and cannot be reused
as configured.** Its one RLS policy is "Allow anonymous inserts" with
`WITH CHECK (true)`: no email-format validation, no rate limit, and it is
directly writable by anyone holding the publishable key, which is public in
every page's JS bundle. That is not a capture form, it is an open write
endpoint with a `subscribers` label on it. Stage 2 and Stage 3 below exist
to close that, and the DPIA flag does not go Green until they do.

Worth flagging, not blocking: the same Supabase project holds
`ops_secrets` and `ops_agent_status`, the ops-dashboard tables. Confirm in
Stage 2 that those tables' RLS does not also carry a permissive anonymous
policy while you're in the SQL editor for `subscribers` — a five-minute check
riding along with work already planned, not a new stage.

## Stage-by-stage plan

Each stage's artefact is signed off before the next one starts, per the
build method. Who does each stage: J = Jasmin, C = Claude Code session.

### Stage 1 — Lock the mechanism (J, with this document)

**Produces:** this plan, signed off; the axis assessment below, written by
Jasmin.

**Depends on:** nothing; ground truth already verified.

**Gate:** Jasmin reads this plan and either signs it off as written or
corrects it before anything is built. This is the plan sign-off gate and it
is not optional.

**Decision to flag now, not later:** where the capture field lives.
Recommendation is `/policy-template` only for v1, not the sitewide footer.
`FooterEmailCapture` renders on every route; turning it into a real capture
form would put a live write path and a consent question on every page at
once, which is a bigger compliance surface than the admin-week budget or the
E9 problem actually needs. Ship it on the one page the ask makes sense on,
and widen later if it earns it. Flag if Jasmin disagrees; this is a
judgement call, not a technical constraint.

**The axis assessment, run against the site's own bar before building
anything, because that is the discipline the site holds every listed tool
to and it should not exempt itself.** Not a Sheet row — this is
infrastructure, not a recommended tool — but the same seven-field
discipline, and written by Jasmin per the standing rule that judgement
fields are never automated:

| Field | Value |
|---|---|
| `data_location` | EU (Ireland) — Supabase project region, not UK. State this plainly in the privacy policy rather than implying UK. |
| `trains_on_input` | No |
| `nonprofit_tier` | Free tier, already provisioned, no new cost |
| `dpia_flag` | Amber until Stage 3 ships validation and rate limiting; Green after |
| `trustee_note` | Jasmin's to write in Stage 6, once the real shape is built rather than guessed at |

### Stage 2 — Account and console groundwork (J only)

Nothing in this stage can be done by a code session; all of it needs
account access.

**Produces:** a locked-down Supabase project ready for a server-side write
path; a Vercel project holding the new secret.

**How:**
1. In the Supabase dashboard (confirm which Google account owns this
   project first — likely `jasminaziz1@gmail.com`, not the Workspace
   account; check before doing anything, per the standing rule on the
   account split), open the SQL editor and drop the `WITH CHECK (true)`
   anonymous insert policy on `subscribers`. Replace it with no anonymous
   write access at all. Only the service role, used server-side, will
   write to this table from now on.
2. While there, check `ops_secrets` and `ops_agent_status` do not carry an
   equivalent permissive policy.
3. Generate or confirm the project's service role key. This is a secret,
   never a `VITE_`-prefixed variable, never in the repo, never in
   `.env.local`.
4. In the Vercel project dashboard, add the service role key as an
   environment variable scoped to server-side functions only (Production
   and Preview, not exposed to the client bundle).

**Gate:** a direct `curl` insert against the Supabase REST endpoint using
the public anon key, run by Jasmin or asked of the code session to
demonstrate, returns a permissions error, not a written row. That is the
artefact: a failed write, on record, before Stage 3 builds the path that
is supposed to replace it.

**Risk:** this is the step most likely to be skipped because it produces
nothing visible. Flag it explicitly rather than let Stage 3 quietly build
against the open policy because it still technically works.

### Stage 3 — Build (C, one Claude Code session, plan-mode sign-off first)

**Produces:** one serverless function (`api/subscribe.ts` or equivalent),
one small form on `/policy-template`, `.gitignore` and `.env.local`
confirmed untouched by any new secret.

**Depends on:** Stage 2 closed. Building against the open policy first and
tightening it after is backwards; a code session should refuse to proceed
if the anon policy is still permissive.

**How:**
- Plan-mode sign-off before the first prompt, as a named gate, per the
  build method.
- CLAUDE.md updated first: the new env var name, the new `api/` directory
  (first one this project has had — it has been a pure static SPA on
  Vercel until now), the RLS state, and a note that `Conversion` section is
  stale and gets corrected in the same change.
- The function validates email format server-side, checks a honeypot field,
  and rate-limits by IP (a simple window is enough at this volume; no new
  infrastructure needed for it). It writes with the service role key,
  never the anon key.
- Error capture on the function: a try/catch that logs to Vercel's function
  logs at minimum, wired at build time not bolted on after, per the
  universal rule that failure alerting is wired when the endpoint is built.
- The form: a single email field, optional first name, a submit button,
  placed below the existing download CTA on `/policy-template`, visually
  and structurally separate from it so the download's "No email, no
  sign-up" line stays true of the download itself.
- Copy is Jasmin's, not the code session's, with one exception precedent
  already set on this page (30 August, two lines, explicit delegation). Two
  strings are owed before this ships: the microcopy inviting the optional
  email, and the confirmation state after submit. Do not improvise them.

**Decisions to flag:** whether "first name" is worth asking for at all
given it adds a field to a form whose whole value is being easy to skip;
recommendation is drop it for v1 and take email only, but that is Jasmin's
call, not a default to build against without asking.

**Risk:** a code session with no engineering resource behind it and no
review is the single point of failure on the RLS-then-function ordering.
Getting this backwards reopens exactly the open-write-endpoint problem
Stage 2 closes.

### Stage 4 — Test (C, then J or one other person who is not the builder)

This project's stack is Vite/React with no dynamic write path today. This
feature adds one, which changes what the test gate is. Per the method: a
flat static site treats the Stage 6 launch gates as its test suite; once
there is dynamic behaviour to protect, automated coverage stops being
optional.

**Produces:** a small Playwright suite covering this one flow, running in
CI on push.

**Minimum coverage, sized to the feature rather than to the ten-tests
floor written for a full app build:**
1. Valid email submits and confirms.
2. Invalid email format is rejected client- and server-side.
3. Honeypot-triggered submission is silently dropped, not written.
4. The download link itself still works with no email step, proving the
   optional-not-gate ruling holds in the built code, not just in this plan.

**Gate:** these pass in CI, and one person who did not write the code
submits the live form on the production preview and confirms a row lands
in Supabase. Stage 6 does not close without that second pair of eyes,
per the method.

### Stage 5 — Deploy and verify

**Produces:** the feature live at `theeditai.co.uk/policy-template`, a
dated verification note.

**How:** env vars confirmed in Vercel (Jasmin, console access), deploy,
then verify on the production URL, not the preview — this project's
Supabase reads are not referrer-locked the way the Sheets key is, but the
habit of checking production rather than trusting a preview holds anyway.
Confirm the `curl`-against-anon-key test from Stage 2 still fails against
the live project, not just the pre-build state.

**Risk:** none new beyond what Stage 2 and 4 already cover, provided the
order was not skipped.

### Stage 6 — Compliance close-out (J, code session drafts for her sign-off)

This is the stage that makes the feature honest, not just working.

**Produces:** `PrivacyPolicy.tsx` section 2 rewritten; `CLAUDE.md`'s
Conversion section corrected; the trustee note finalised.

**How:**
- Section 2 currently says "The Edit itself runs no email capture and
  holds no subscriber list." That sentence is false the moment this ships
  and must be rewritten before or in the same deploy, not after. Replace it
  with what actually happens: an optional email field on one page, stored
  in Supabase (EU, Ireland), used only to notify of material changes to the
  template, never sold, never used for marketing, never automated. Jasmin's
  words, not a code session's improvisation, per the standing rule — a code
  session may draft for her sign-off, as happened once before on this page.
- Confirm the existing ICO registration already covers this processing
  activity; it is a new purpose (notification) on data already within the
  organisation's registered scope, but check rather than assume.
- Write the trustee note. A working draft, hers to adopt or replace: *"An
  email field on the policy template page is optional and only tells me
  who to warn if something in the template's legal basis changes; it's
  stored in Ireland, never sold, and nothing automated writes to it."*
- Correct `CLAUDE.md`'s Conversion section, which still describes the dead
  gated flow.

**Gate:** the privacy policy states the true current state and no file in
the repo contradicts it. Grep for "no email capture" and "holds no
subscriber list" after the edit; both strings must be gone.

## Rollback

Additive and optional by design, so rollback never touches the download.
If abuse, spam, or a legal concern surfaces:

1. Remove or hide the form component. One component, one page; no routing
   or CTA elsewhere depends on it.
2. The serverless endpoint can be disabled by removing the route or having
   it return 410 without touching anything else.
3. RLS already denies direct writes outside the function, so there is no
   data-leak path to close in a hurry — only the UI surface needs pulling.
4. At near-zero rows, truncating the table is a real option if the whole
   feature is abandoned; there is nothing meaningful to migrate away from.

## Time estimate

Admin-week sized, sequenced rather than compressed. Do not read the total
as five consecutive days; each stage's gate is a natural pause point and
several stages are console work Jasmin does on her own schedule.

| Stage | Effort | Who |
|---|---|---|
| 1. Lock the mechanism | 0.5 day | J |
| 2. Account and console groundwork | 0.5 day | J |
| 3. Build | 1.5–2 days | C |
| 4. Test | 0.5 day | C, then J or a second reader |
| 5. Deploy and verify | 0.25 day | J + C |
| 6. Compliance close-out | 0.5–1 day | J, drafted by C |

Roughly four to five days of total effort. Against an admin-week budget
that is not five hours a day on this alone, expect this to run over one to
two calendar weeks, gated by Jasmin's own availability for Stages 1, 2 and
6 rather than by the code work, which is the fast part.

## What this plan does not cover

- Which exact vendor: constrained above, not chosen. If the parallel
  vendor assessment lands on something other than Supabase, re-run the
  gate checklist against it before Stage 2 starts.
- The welcome message or any follow-up sent to someone who leaves an
  email. Nothing in this plan sends mail; it only stores an address. A
  send path (even a manual one, Jasmin emailing a BCC list by hand when
  row 9 or row 11 actually changes) is a separate, smaller decision for
  later and does not block this shipping.
- Reopening the footer sitewide, or any surface beyond `/policy-template`.
- The two outstanding legal strings owed on the page since 30 August
  (the "It's free" and "Delivered through" replacements) — those are
  already resolved in the current copy and are unrelated to this feature.
- A PDF export of the template. Separate, already tracked, unrelated.
