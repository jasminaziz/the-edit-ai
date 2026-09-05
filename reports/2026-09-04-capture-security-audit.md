# The Edit AI — email capture security audit

Date: 2026-09-04
Scope: whether and how to add email capture to theeditai.co.uk, now that the
Substack-gate plan is reversed. Audited against the Web Build Guide
(`~/.claude/guides/website-build/web-build-guide.html`, v1.1, verified 14 Aug
2026 — 21 days old, within the six-month re-verify window, not stale) §4 Gate
4 and Appendix D, and against live production: repo, git history, Vercel env,
and the live Supabase project `zsoczlgkyessfhobhtgu` (queried directly over
REST with the current anon/publishable key).

Prior report: `reports/2026-07-04-security-audit.md`. Findings below state
explicitly which of its items are resolved, unchanged, or newly discovered.

## Verdict

**Safe with named fixes as the site stands today.** No secret is currently
exposed to the public internet, and no currently-shipped code path is
vulnerable — because no capture code exists yet.

**Not safe to ship the planned capture as a direct client-side Supabase
`.insert()` against the existing `subscribers` table.** The table's live RLS
policy set contains a working, exploitable email-enumeration oracle
(confirmed live, see Critical finding 1) that only failed to be a public
problem to date because nothing calls it yet. Ship it as designed and the
oracle ships with it. A serverless-function proxy in front of the same
Supabase table, detailed in the recommendation below, closes this without a
new vendor.

## Findings, severity order

### CRITICAL — confirmed live: `subscribers` insert response is an email-enumeration oracle

**Location:** live Supabase project `zsoczlgkyessfhobhtgu`, table
`public.subscribers`, policy `Allow anonymous inserts` (`supabase/migrations/20260328115731_*.sql`), reachable via `POST {SUPABASE_URL}/rest/v1/subscribers` with the anon/publishable key.

**Verified directly against production**, not inferred: inserting a new email
returns `201`; re-inserting the same email returns `409` with
`{"code":"23505", "message":"duplicate key value violates unique constraint
\"subscribers_email_key\""}`. That is a clean, machine-readable yes/no oracle
for "is this address already on the list" — no authentication needed beyond
the publishable key that any capture form necessarily ships to the browser.
An attacker with a list of addresses (e.g. a charity's staff directory) can
script `POST` requests and learn, address by address, who has and hasn't
signed up, entirely outside whatever UI the site presents.

This is the same mechanism the 2026-07-04 report flagged as a theoretical
risk under M4 ("the duplicate-key response... lets an outsider test whether a
given email is subscribed"). Today it is confirmed working end to end against
the live table, not inferred from the migration file. It is not live-exploited
today only because no client code calls it. **This is the finding that makes
a direct client-side insert unsafe to ship**, not a fixable-later nice-to-have.

**Fix:** never let the browser talk to Supabase directly for this write. Route
submissions through a Vercel serverless function that always returns the same
generic success response regardless of whether the underlying insert hit
`23505` or not. The duplicate-key branch becomes server-side-only information
(fine to log, never fine to echo).

### CRITICAL for the planned feature, not yet live — no rate limiting exists, and unlimited flood is confirmed possible

Five sequential test inserts against the live `subscribers` table all
succeeded (`201` each, no throttling, no captcha, no delay). There is no
Vercel KV, no Upstash, no persistent store anywhere in this repo, and no
serverless function at all (`find … -iname api` returns nothing — this repo
has never had one, unlike `jasmin-aziz`'s `api/contact.js`). Per the guide's
Gate 4 test: **rate limiting counts only with a persistent store; nothing here
even reaches the in-memory-Map anti-pattern, because there is no server-side
code in the path today.** Combined with finding 1, an unauthenticated caller
can both flood the table with junk rows and enumerate real ones at whatever
rate Supabase's own connection limits allow.

**Fix:** same serverless function as above, backed by Vercel KV or Upstash for
a real per-IP/per-email rate limit, plus the honeypot and minimum-fill-time
check from Appendix D on the form itself.

### Test artefacts left in the live table — needs manual cleanup, not done by this audit

Proving findings 1 and 2 required real writes against the live table (there is
no way to prove an oracle or a flood ceiling by reading code). Per this
audit's standing instruction never to perform a deletion, these rows were
**not** removed. They are easy to find and remove from the Supabase dashboard
(Table Editor → `subscribers`, filter `email` `ilike` `audit-%4sep%`):

- `audit-test-4sep-retry2@example.invalid`
- `audit-oracle-test-4sep@example.invalid`
- `audit-flood-test-1-4sep@example.invalid` through `audit-flood-test-5-4sep@example.invalid`

One useful side effect of testing: attempts to `UPDATE` and `DELETE` these
rows via the anon key returned HTTP `204` (looks like success) but a follow-up
oracle check (re-inserting a "deleted" email and getting `409`, not `201`)
proved the row was still there. **This is the guide's own "an HTTP status code
is never verification" rule biting on a Supabase REST call**, not just a
frontend one: RLS silently no-ops writes with no matching `USING` policy and
PostgREST still reports `204`. Net result confirmed: **the `subscribers`
table genuinely is INSERT-only for anon — no working SELECT, UPDATE or
DELETE** — which corrects my own first read of the raw status codes and
matches what the guide's Live Status panel and the July audit both claim.
That specific claim is **reconfirmed, not stale.**

### SHOULD FIX — `vercel.json` still ships no security headers (persisting P1, confirmed still true)

**Location:** `/Users/jasminaziz/Developer/the-edit-ai/vercel.json`, current
full contents:
```
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
No `X-Frame-Options`, no `X-Content-Type-Options`, no `Referrer-Policy`, no
`Permissions-Policy`, no `Content-Security-Policy`. This is exactly the guide's
14 Aug 2026 house record ("theeditai.co.uk D on a bare vercel.json") and
defect #4, unchanged as of today's read — a **persisting** finding, not a new
one. It predates and is independent of the capture decision, but the capture
decision makes it more urgent: whichever backend is chosen needs a `connect-src`
entry, and there is currently no CSP to add one to.

Current third-party origins actually in use, for scoping the CSP:
`sheets.googleapis.com` (data fetch), `fonts.googleapis.com`,
`fonts.gstatic.com`, `api.fontshare.com` (fonts). No analytics, no Supabase
call today. Appendix D's SPA snippet is the right starting block; trim its
`connect-src` to only these origins plus whatever the capture backend adds
(same-origin `/api/*` needs nothing extra in `connect-src`).

**Fix:** add the Appendix D SPA header block to `vercel.json` in its own
commit, verify at securityheaders.com, record the grade and date.

### SHOULD FIX — hardcoded Sheets key ships with no access-control comment (ratified rule, currently unmet)

**Location:** `src/lib/sheets.ts:34-36`
```
function sheetsUrl(tab: string): string {
  const sheetId = import.meta.env.VITE_GOOGLE_SHEETS_ID || '';
  const apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || '';
  return `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(tab)}?key=${apiKey}`;
}
```
The guide's ratified rule (2 Jul 2026): any committed file hardcoding a
service URL or publishable/API key carries a comment naming the specific
access-control measure that makes it safe and where to verify it. This site
site does have that control (referrer restriction to `theeditai.co.uk/*` and
`www.theeditai.co.uk/*`, documented in `.claude/CLAUDE.md`) but the comment
does not exist at the point of use in `sheets.ts` itself. Anyone reading this
file cold cannot tell the risk posture from the file alone, which is exactly
what the rule exists to prevent.

**Fix:** one-line comment above `apiKey`, e.g. `// referrer-restricted to
theeditai.co.uk/* and www.theeditai.co.uk/*, Google Cloud Console →
Credentials`. Small, unrelated to the capture decision, caught in the same
sweep.

### SHOULD FIX / cleanup — unused Supabase env vars live in Vercel production for a dead path

`VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are set in Vercel
Production, Preview and Development (confirmed via `vercel env ls`, both
"160d ago") for a path nothing in `src/` currently calls —
`@supabase/supabase-js` is in `package.json` but unimported anywhere, matching
`.claude/CLAUDE.md`'s own record. Because nothing references
`import.meta.env.VITE_SUPABASE_*`, Vite does not currently inline these values
into the production bundle, so **today they are not shipped to visitors** —
but they are live, decrypted secrets sitting in a deploy target for a feature
that does not exist.

Both values also currently point at the **live** project
(`zsoczlgkyessfhobhtgu`), not the dead Lovable-era one — confirmed by
decoding the `ref` field. This is not the historic leak (see below); it is
current, correct, and simply currently unused.

**This finding resolves itself the moment the capture recommendation below is
built** (the vars become live and referenced). If the third-party-vendor
route is chosen instead, remove these two vars from Vercel as cleanup.

### RESOLVED / persisting-closed — historic `.env` leak of a dead Supabase project

Confirmed again via full `git log --all -p` pattern search: `.env` was added
in one historic commit and removed in a later one, and the only credential it
ever carried was the anon key and URL for project `htimtwbltcpupsjpkqlv`.
That project ref does not match the live project (`zsoczlgkyessfhobhtgu`) and
was already independently confirmed dead in the 2026-07-04 report. **Unchanged
from July: no action needed.** No `.env` file is committed anywhere in the
current tree; `.env.local` remains gitignored and was never committed
(confirmed by `git log --all --diff-filter=A --name-only | grep '^\.env'`
returning only the one historic `.env`, never `.env.local`).

### RESTATED, unchanged — shared Supabase project blast radius holds correctly

Re-verified live today, not assumed from the July report: the same project
that would host `subscribers` also holds `ops_secrets` (RLS enabled, **zero**
policies — confirmed `INSERT` with the anon key returns `401`, unreadable and
unwritable via REST, exactly as documented) and `ops_agent_status` (public
`SELECT` by design — confirmed readable with the anon key; `UPDATE`/`DELETE`
both no-op under RLS, confirmed by the same before/after check used on
`subscribers`). **This is an accepted, working design, not a new hole.**
Residual risk, stated so the acceptance stays informed: anyone holding the
anon key that a capture form will ship can read agent names and coarse
`current_task` strings from the ops dashboard's status table. That has been
true and accepted since the 2026-07-03 ops-dashboard decision record; adding
capture does not widen it, because the same anon key already carries that
reach today, unused.

### NOTED — no session-based exposure of secrets beyond git and env (accepted)

Neither `AIzaSy`, `sk-ant`, nor `eyJhbGci`-pattern secrets appear anywhere in
the current working tree outside `.env.local` (gitignored) and Vercel's own
encrypted store. Nothing beyond the one historic dead `.env` commit appears in
`git log --all -p`.

**Local-disk exposure, separate from the git-history check, as instructed:**
both the current live Supabase publishable key and the current live Google
Sheets API key appear verbatim in local Claude Code session transcripts under
`~/.claude/projects/`:
- Supabase key: `~/.claude/projects/-Users-jasminaziz-Developer-ops-dashboard/53a10a91-fdf0-4c20-a888-84f275c7a198.jsonl` and `~/.claude/projects/-Users-jasminaziz-Developer-the-edit-ai/e5c5fe70-d6bd-434d-b2fc-bb57863c801d.jsonl`
- Sheets key: `~/.claude/projects/-Users-jasminaziz-Developer-the-edit-ai/2ffe0bf5-c9fe-4ba8-8db5-af8135b59a01.jsonl`

This is local-disk only, not public, and both keys are already publishable-
class (referrer-restricted / anon-class) rather than secret-class. Named per
instruction; rotation is left entirely as Jasmin's judgement call, not
recommended by default here.

### ACCEPTED TRADE-OFF — `VITE_GOOGLE_SHEETS_API_KEY` in the public bundle

Confirmed still referenced in `src/lib/sheets.ts` and therefore still
compiled into the production JS bundle. Accepted per `.claude/CLAUDE.md`:
referrer-restricted to `theeditai.co.uk/*` and `www.theeditai.co.uk/*`,
API-scoped to Sheets only (per prior audits; restriction itself is a manual
Cloud Console check, see checklist). **Residual risk:** anyone can read the
key out of the shipped bundle and use it from an allowed referrer, but cannot
use it from anywhere else, and it grants read-only access to a spreadsheet
that is already the site's own public content source. No write capability.

### N/A today, becomes the build requirement — escaping, honeypot, rate limiting, proof of delivery

No `<form>` and no `onSubmit` exist anywhere in `src/` today (confirmed by
grep). There is nothing to escape, no honeypot to check, and no delivery to
prove, because the feature does not exist yet. These become mandatory build
requirements for whatever ships:

- **Escaping:** if the chosen design ever builds an HTML confirmation/welcome
  email from user input (name, email, context), every value is escaped
  individually with the guide's Appendix D `escapeHtml` before interpolation
  — entities `& < > " '`, applied per field, never to the assembled string. A
  plain-text fallback is not protection.
- **Honeypot + minimum-fill-time:** the Appendix D pattern (hidden `website`
  field, hidden `renderedAt` timestamp, server-side check that drops a
  missing, forged, or too-fast timestamp, not just a fast one) belongs on the
  form and its handler from the first commit, not retrofitted.
- **Proof of delivery:** whichever backend is chosen, "the form rendered,
  validated, and thanked the visitor" is not evidence. This repo's own
  `Submit.tsx` already carries a dead-form precedent — `handleSubmit` used to
  only flip local state — so this project specifically cannot assume delivery
  from a success message. Put the end-to-end production test on the manual
  checklist below.
- **Sourcemaps:** `vite.config.ts` sets no `build.sourcemap`, so it defaults
  to `false` — confirmed clean, no readable source shipped to production.

## The recommendation

**Reuse the existing Supabase project's `subscribers` table. Do not send the
capture to a third-party vendor, and do not let the browser insert into it
directly.**

Put a single Vercel serverless function (`api/subscribe.ts`, matching the
pattern already proven on `jasmin-aziz`'s `api/contact.js`) between the form
and the table. That one change closes every finding above at once:

- **Kills the enumeration oracle (Critical 1):** the function catches the
  `23505` duplicate-key response server-side and always returns the same
  generic "thanks, you're on the list" response to the browser regardless.
  The oracle becomes server-side-only information, safe to log.
- **Makes rate limiting real (Critical 2):** the function is the one place a
  persistent store (Vercel KV or Upstash) can sit in front of the insert.
  There is nowhere for an in-memory-Map anti-pattern to hide because there
  was no server-side code before.
- **Adds the honeypot and minimum-fill-time check server-side**, where a
  client-side-only check is trivially bypassed.
- **Removes the CSP cost of the decision.** The browser never talks to
  Supabase directly; it calls the site's own `/api/subscribe`, same-origin,
  which needs nothing added to `connect-src`. Compare this to any third-party
  vendor: a hosted-form iframe needs a new `frame-src` entry, and any
  JS-widget vendor (MailerLite, Brevo, Kit-style embed scripts) needs new
  `script-src` and `connect-src` entries and, worse, **reintroduces the exact
  cookie/consent problem this site deliberately shed on 2026-08-28 when GA4
  came out.** The site's current honest claim — no cookies, no banner, no
  consent debt — does not survive an embedded third-party JS widget; the site
  can no longer vouch for what that widget does inside its own script.
- **Proves delivery properly.** A serverless function's own logs
  (`console.error` on the catch path, per the guide's observability rule) give
  Jasmin a place to see failures that a hosted-vendor form's dashboard would
  otherwise be the only record of. Either way the manual end-to-end test
  below still applies — code alone never proves delivery.
- **No new vendor, no new blast radius.** The `ops_secrets`/`ops_agent_status`
  sharing arrangement is unchanged and already re-verified safe today.
  `subscribers` stays its own table with its own policy, exactly as designed.

The only genuinely new work is the one serverless function, the KV/Upstash
binding, and a database migration to add an email-format `CHECK` constraint
and sensible length limits (`supabase/migrations/`, run deliberately, not
folded into a code deploy — matching this repo's own `sheet-write.mjs`
discipline of never mixing a schema change into a routine push).

A third-party vendor is the right call when Jasmin wants managed list
hygiene, unsubscribe handling and deliverability reputation she does not want
to build herself — genuine reasons, just not security reasons, and not this
decision's job to weigh. On the security question specifically, reusing the
existing table behind a proxy function is safer than any embed-based vendor
and no worse than a redirect-based one, while keeping the funnel on-site.

## Manual checklist — cannot verify from the filesystem

- **Google API key restrictions (Sheets key):** Cloud Console, jasminaziz1@gmail.com → APIs & Services → Credentials → the Sheets key → confirm HTTP referrer restriction covers exactly `theeditai.co.uk/*` and `www.theeditai.co.uk/*`, and API restriction is scoped to the Sheets API only.
- **Supabase RLS state, full picture:** dashboard (project `zsoczlgkyessfhobhtgu`) → Authentication → Policies. Confirm `subscribers` shows only the one INSERT policy this audit exercised (this audit could not read `pg_policies` directly via the anon key — its findings are behavioural, from live HTTP tests, not a policy-table dump). Add the new email-format `CHECK` constraint via a migration here, not by hand in the SQL editor, so it lands in `supabase/migrations/` too.
- **Vercel KV / Upstash provisioning:** Vercel dashboard → the-edit-ai project → Storage. Needs creating before the rate limiter can be real.
- **Anthropic or other AI keys:** not applicable to this feature; no AI key is involved in email capture.
- **Kill-switch list for the new integration, once built:** where to revoke the Supabase anon key if it is ever compromised (Supabase dashboard → Project Settings → API → regenerate), and what breaks meanwhile (the `/api/subscribe` function 500s; the rest of the site, which reads Sheets not Supabase, is unaffected). Write this down before launch, per Gate 4's kill-switch rule — there is currently no kill-switch list for this project's Supabase usage at all, which is itself a finding once the feature ships.
- **Sheet sharing:** not applicable to this feature (the capture destination is Supabase, not Sheets). The known jasminraziz1@gmail.com / hello@jasminaziz.co.uk account-split trap on the Sheets API key is unrelated and already documented in `.claude/CLAUDE.md`.
- **End-to-end production test, once built:** submit the live form on theeditai.co.uk, then confirm the row actually lands in the Supabase `subscribers` table (Table Editor, not the success message on the page). Repeat for the duplicate-email path and confirm it still shows the same generic success message to the visitor while not creating a second row.
- **Test-artefact cleanup:** remove the eight `audit-*-4sep@example.invalid` rows this audit left in the live `subscribers` table (listed above) via the Supabase dashboard.
- **Local session-transcript exposure:** the two `~/.claude/projects/` files listed above hold the current live Supabase and Sheets keys in plain text. Rotating is Jasmin's call; both are already publishable-class keys, not secrets.

## Staleness flag

Appended to `SCRATCHPAD.md`:
`web-build-guide stale: [live email-enumeration oracle confirmed on subscribers table, and RLS INSERT-only claim reconfirmed via oracle test not status code; see reports/2026-09-04-capture-security-audit.md]`
