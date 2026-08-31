# Mobile, functionality, SEO/GEO and hygiene: session prompt

Written 31 August 2026 at the close of the vocabulary session. Paste the block
below into a new Claude Code session in `~/Developer/the-edit-ai`.

Facts in it were checked against the repo and production on the day. Anything
marked "verify" is a claim for the session to re-check, not a finding.

---

## The prompt

```
Read .claude/CLAUDE.md, SCRATCHPAD.md and tasks/lessons.md before doing
anything. All three were corrected on 31 August. lessons.md matters more than
usual this session: it holds the browser-measurement traps, and half this work
is measurement.

STANDING CONTEXT

The site is LIVE. main is the live site, Vercel deploys it, anything pushed is
public in about three minutes. The three-command gate before every commit:
bunx tsc --noEmit, bun test, bun run build.

A parallel session shares this working tree. It has switched the branch under
me mid-session and left a stale index.lock. So: check git rev-parse
--abbrev-ref HEAD before each commit, and verify every push by comparing
git rev-parse origin/main to HEAD. A push that exits 0 has proved nothing.
Its uncommitted files in reports/ and .github/ are not yours to commit.

Never author visitor-facing copy. Before proposing to change any visible
string, grep reports/ for it: several are signed-off pack copy, which changes
the ask from "shall I fix this" to "this supersedes an approved string, here
are the candidates". Never write dpia_flag, trustee_note or verdict.

THE TRAP THAT WILL CATCH YOU FIRST

vercel.json has a SPA catch-all, so a file that does not exist returns 200
text/html rather than 404. Confirmed today: /AI-Use-Policy-Template.pdf
returns 200 with content-type text/html because the file was removed at
launch. Never verify a URL by status code. Check content-type, content-length,
or grep the body for a string only the real thing contains.

JOB 1. MOBILE

The breakpoint contract, already documented: MOBILE_BREAKPOINT in
use-mobile.tsx governs chrome at 1024, Tailwind sm: governs content layout at
640, and no element should consult both. Check nothing new violates that.

Emulator work is fair game, but the checks that actually matter here have
never been done and cannot be done from a desk. Tell me plainly which of these
you could not close, rather than approximating them:
  - real on-device touch, especially the ToolCard. It uses pointer events
    because a tap once raised a mouseenter with no mouseleave and left the
    grid stuck inverted. That fix is unverified on a real finger.
  - a real 360px device
  - device rotation against the matter-js physics canvas on the homepage

Known-fragile, worth measuring rather than eyeballing:
  - the homepage About header clamp. 30px floor binds below an 804px
    viewport. Do not push past 56px; the fourth line starts near 59px in a
    608px column.
  - hero min-h-[78vh] on mobile. Open ruling, mine.
  - HomeGravity MAX_PILLS and whether it needs a mobile cap. Open ruling.
  - the mobile wordmark string. Open ruling, needs approved copy.

JOB 2. FUNCTIONALITY

  - The template download. Verified 31 Aug: /AI-Use-Policy-Template.docx
    returns 21,711 bytes, content-type application/vnd.openxmlformats-
    officedocument.wordprocessingml.document. Re-verify, and check the whole
    path from every entry point: two nav links, the footer block and the page
    CTA, all four labelled "Get the template". Keep those four labels
    identical.
  - The PDF is gone from public/ deliberately: it shipped Word-only at launch
    because Chillax is a webfont with no file in the repo and the cover
    rendered in a substituted face. Nothing should link it. Confirm nothing
    does.
  - Sheet data loading. The production key is referrer-locked to
    theeditai.co.uk/*, so it 403s from localhost and from preview deploys.
    Local dev needs the localhost-scoped key in .env.local. If data looks
    empty, check this before anything else.
  - The three sector toggles, the job-chip filters, the DPIA chip and
    last_checked against real Sheet data.

JOB 3. SEO AND GEO

The one fact that governs this whole job: react-helmet-async injects per-page
meta at RUNTIME. The static block in index.html is what a crawler that does
not run JS sees, and that includes some answer engines. SEO.tsx deliberately
does not emit og:image or og:type; index.html owns those sitewide. Do not
split that without deciding it deliberately.

Concrete, found on 31 Aug, all to re-verify:
  - There is no llms.txt. jasminaziz.co.uk has one. Whether The Edit should
    is a judgement, so propose rather than build.
  - Three meta descriptions overrun the ~155 character snippet limit: 193,
    175 and 168. Report which pages and what gets truncated. Any rewrite is
    copy and comes to me.
  - NotFound ships no meta at all. Needs a title and description, which is
    copy, so propose.
  - og-image.png is 474KB. Large for a scraper fetch. Measure before advising.
  - Check every canonical is bare-domain https://theeditai.co.uk. www 308s to
    it. sitemap.xml should be eleven bare-domain live routes, no redirects, no
    lastmod.
  - Structured data: the JSON-LD in Index.tsx. Validate it.

JOB 4. TIDYING, DOCS AND CODE

Docs first, because two are provably stale and I only found them by accident:
  - .claude/CLAUDE.md:327 says the .pdf "sits at /AI-Use-Policy-Template.pdf,
    unlinked". The file was removed at launch. Wrong.
  - SCRATCHPAD says og-image.png is "still not started". public/og-image.png
    exists and index.html wires it at lines 36 and 37. Wrong.
  - Sweep both files for other claims about the live site and check each
    against the code or production. Doc drift is the recurring defect in this
    project.
  - SCRATCHPAD.md is past 2,600 lines. Propose an archive split; do not
    delete history.

Code, all long-parked and none urgent:
  - src/pages/Subscribe.tsx is unreachable dead code, retained deliberately
    for this sweep. Submit.tsx's form code is likewise unreachable.
  - Unused shadcn/ui components, two toast systems in App.tsx, lovable-tagger,
    stale supabase/config.toml, and package-lock.json which is stale because
    bun.lock is canonical. Never npm install.
  - matter-js ships on every route inside one large chunk though it only
    serves the homepage hero. Lazy-loading it is the known fix.

Do these as separate commits, one job each. Start by telling me what you find
before changing anything, and flag which jobs need a ruling from me rather
than a decision from you.
```
