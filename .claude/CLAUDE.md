# The Edit AI

Resident file for every session in this repo: preferences, hard constraints, gotchas with their reason, pointers. Under 200 lines (Decision 087). Topic rules in `.claude/rules/` load when a session reads a file they name. The pre-cut file, with every incident, measurement and dated ruling, is frozen at `.claude/history/CLAUDE-md_2026-11-06.md`: search it for the why behind a rule; where it disagrees with this file or a rule file, they win. This repo is public.

## What the site is

- The Edit (theeditai.co.uk) is an opinionated directory of AI tools for communications teams in charities, cultural organisations and heritage, built and maintained by Jasmin Aziz, and the lead engine for her consultancy at jasminaziz.co.uk. Charity-sector framing is the premise, not a contamination risk. No sponsored listings and no affiliate links: the pair is locked shipped copy on the About panel, the Submit page and the meta descriptions, so no row, link or placement may carry either.
- It is a comms resource first with a compliance edge (Jasmin, 26 Aug 2026). The axis (seven fields and the DPIA chip) filters and gates; the verdict recommends; the trustee note is the sentence for the board. A verdict brings in governance only where a governance fact is the reason to use or avoid that tool, because the card already shows five governance elements and a verdict that restates them never says whether the tool is any good.
- The claim is "been through the checks", never "passed": most counted rows are Amber and some are Red, and "passed" was ruled against twice.
- The funnel: the directory attracts the buyer, the ungated AI-use policy template proves the expertise, "Work with me" converts. There is no email capture and no email infrastructure in this repo.

## Canonical documents

- `reports/2026-08-28-positioning-statement.md` is canonical on what the site is for and who it speaks to. Its "Who it's for" section is the only reader profile: never create a second one, because two canonical descriptions of one reader drift and this project has paid for that twice. The profile is marked as assumption.
- `reports/2026-08-23-axis-locked.md`: allowed values and definitions of the seven axis fields, the DPIA chip colours and the toggle rules. Field names are frozen because the code reads them.
- `reports/2026-08-26-a5-verdict-drafts.md`: verdict voice (first person where it is evidence Jasmin has earned, second person for the recommendation) and the worked examples.
- `reports/2026-08-22-overhaul-audit.html`: its strategy is canonical and its implementation detail is stale. Where they conflict on implementation, the code and this file win; where its premise disagrees with the positioning statement, the positioning statement wins.
- The claims register is private at `~/.claude/steward/claims-the-edit-ai.md`, never in this repo. Changing a claim means changing every surface its `Lives on:` line names, or the register.

## Where things live

- Current state and the queue: the latest "Where we got to" in `SCRATCHPAD.md`, then `git log`. Nothing in this file is a status report.
- Corrections: `tasks/lessons.md`. Tab schemas: `.claude/schema.md`. Rulings on Sheet rows: `reports/axis-rulings.md`.
- Judgement work is in two files with different names, `reports/2026-08-26-a5-verdict-drafts.md` and `reports/2026-08-28-batch2-judgement-drafts.md`. Search report contents for a phrase from the row, never filenames: a filename search finds only the first and invents a gap of eight rows.
- Many choices here look unfinished and are rulings. Before "finishing" an asymmetry, restoring something removed or harmonising two rulings, search the rule files and the record for it.

## Hard constraints

- `main` is live: anything pushed to it is public within about three minutes. `main` and `overhaul/sector-axis` are the same commit and are pushed together, `git push origin HEAD:overhaul/sector-axis` then `git push origin HEAD:main`, remote refs verified after.
- Push authority (29 Sep 2026, scoped 6 Nov 2026): a commit touching only reports, records, docs, `.claude/`, `tasks/` or `SCRATCHPAD.md` is pushed to both branches straight after committing, and Jasmin is told afterwards. A commit touching `src/`, `scripts/`, `api/`, `.github/workflows/` or config waits for her yes, because each changes what runs in production: the prerender script runs in every Vercel build, the workflows run on GitHub's schedule and `sheet-write.mjs` writes to the live Sheet. Approving a Sheet write also approves committing and pushing its record file.
- The gate before a push that touches `src/`, `scripts/`, `api/`, `.github/workflows/`, config or dependencies is four commands: `bunx tsc --noEmit`, `bun test`, `bun run build`, `bun run lint`, each read from its own output. Vercel build failures are silent (it keeps serving the last good deploy), and `tsc` passes imports, assets and plugin config that Vite fails on at bundle time. Lint exits 0 with warnings only (six on 6 Nov 2026), so a new error shows; read the warning count from a run. If Vite's chunk-size warning returns, something large has landed in the main chunk. A commit touching only `reports/`, `.claude/` or `tasks/` needs no gate.
- Update local `main` with `git fetch origin main:main`, because a parallel session's uncommitted files usually block switching to it. A build big enough to need it gets its own branch in its own worktree and a contract file, and reaches `main` only on Jasmin's sign-off.
- The package manager is bun and `bun.lock` is canonical. Never `npm install` or `npm audit fix`: they create a second lockfile.
- Code sessions place approved strings; they never author or improvise visitor-facing copy. They may draft it when Jasmin asks, for her sign-off, flagging anything unverified. Quote visitor-facing copy from `src/`, never from this file or the record, which misquoted shipped strings twice.
- The judgement split: the line is whether an external source determines the value or someone has to choose it. Name, url, pricing, nonprofit tier, data location and training policy are facts that automation may maintain with sources. DPIA flag, trustee note, verdict, jobs, status and what_it_does are Jasmin's and are never written by any automation.
- A code session may write any column on the four content tabs once Jasmin has approved that exact value in chat. Before she approves, flag any concern and say which parts are opinion or unchecked. The edit carries `"approved": "<DD MMM YYYY>, in chat"`; a delegated choice carries `"approved": "<DD MMM YYYY>, in chat (delegated: Jasmin authorised Claude to choose the value)"`, so the record never shows her approving a value she did not see. This is recorded, not enforced: the script cannot tell a real approval from a claimed one. Delegation never reaches row deletions, which go back to her as an exact list. A URL that now points at a different product is a question about what the row is, and stays hers.
- `scripts/sheet-write.mjs` is the only path that writes to the Sheet, and a write with `--commit` is public in seconds, with no deploy, build or review, because the site fetches the Sheet at runtime. Never write to the Sheet any other way. Rules for the script load from `.claude/rules/sheet-and-audit.md`.
- There is no service account key and there must not be one: the org enforces `iam.disableServiceAccountKeyCreation`. Writes run through gcloud impersonation with `SHEETS_SA_IMPERSONATE=the-edit-audit@the-edit-490220.iam.gserviceaccount.com`, so nothing lands on disk.
- The axis audit runs only when Jasmin pastes `reports/2026-08-31-axis-audit-claude-code-prompt.md` into Claude Code; nothing schedules it, so its failure mode is silence. The run is manual by design, because it writes to a live site: never schedule or automate it. The Cowork trigger "The Edit's fortnightly axis audit" only reminds and runs the monthly discovery pass, and its "never write to the Sheet" is prose, not a control: never describe it as a safeguard equal to `sheet-write.mjs`. If that boundary ever needs to be real, the lever is the connector's scope.
- The directory's row ceiling is 45, and every row serves the charity, cultural and heritage comms audience or is a deliberate public "judged, not recommended" entry. Never widen it toward general AI tools.
- The architecture is locked: Claude Code, GitHub, Vercel, Google Sheets. Sheets is the content layer. Supabase holds the legacy `subscribers` table and, since 15 Oct 2026, the push tables written only by `api/`; it is never the content layer. Never suggest deviating.
- `subscribers` holds six real addresses that Jasmin ruled stay, and its anon-insert RLS policy is a working email-enumeration oracle (201 for a new address, 409 for one present). Never ship a client-side insert and never rebuild capture against that table.
- The template is never gated: making the document conditional on an email is an Article 7(4) bundled-consent problem. Capture, decided 4 Sep 2026 and not built, is a hosted MailerLite list linked from `/policy-template` and never embedded, because an embed drops cookies and needs CSP origins and the site sets no cookies. Reasons in `reports/2026-09-04-capture-*.md`.
- The site sets no cookies and runs no analytics; Search Console is the measurement. Analytics returns only with consent done properly.
- `selfDestroying: true` in `vite.config.ts` stays. Removing it to "re-enable the PWA" brings back the bug where every navigation was answered from a stale precache. No service worker of any kind is added: push uses Declarative Web Push without one.
- Never write a token, a key or the Apps Script exec URL into a tracked file: the repo is public.

## Gotchas

- Board, not trustee, where the governing body is meant (31 Aug 2026): only charities have trustees, and the museum service, university gallery, NHS trust and cathedral all have boards. Deliberately left: `PolicyTemplate.tsx`'s "trustees, funders and supporters" (stakeholders reported to), `Submit.tsx`'s "the trustee test", and the `trustee_note` field, a Sheet column the code reads by name. `DesignKit.tsx` says "a room" because no governance word belongs on the design kit; never harmonise the two rulings.
- Read row counts and complete-row counts live; never carry them from a file. No document has ever held the right count for long. Row numbers move when Jasmin deletes rows by hand, so match rows on name.
- The canonical host is bare `theeditai.co.uk`, and www 308s to it; never add www to a canonical. The Sheets API referer is the exception, `https://www.theeditai.co.uk/`, and the production key's referrer list must keep both hosts or `/tools` renders empty.
- The production Sheets key 403s from localhost and from preview deployments. Local dev uses a localhost-scoped key in `.env.local` for port 8080, this project's dev port, not Vite's default; if local data fails, check that first. Verify data logic with vitest or the localhost key, never a preview.
- The Google Drive connector can read the spreadsheet but may return only the first tab. Read per tab through the Sheets values API with the production key and the www referer.
- Google accounts are split: hello@jasminaziz.co.uk (Workspace) holds Search Console and Cloud Console; jasminaziz1@gmail.com (personal) holds the Sheets API key and the Apps Script. Confirm which applies before touching anything Google-authenticated.
- Pushing both branches queues the production build behind the `overhaul/sector-axis` preview, so production can lag a push by minutes. Read the deployment's state before calling a lag a failure.
- A new route needs four entries in step: `App.tsx`, `ROUTES` in `scripts/prerender.mjs`, a rewrite in `vercel.json` and `public/sitemap.xml`. Unknown paths serve the prerendered `404.html` with a real 404 status since 11 Oct 2026; the record's "SPA catch-all returns 200" is history. Check content-type and body all the same.
- A new Sheets tab needs a fetch function in `src/lib/sheets.ts` and a component to render it.
- This site locks body scroll and scrolls an inner pane (`scrollRef` in `Layout.tsx`), so `window.scrollY` reads 0 however far down the page is. Measure and script scrolling against the pane.
- Load `verify-rendered` before measuring any page here. The homepage pills (matter-js on `requestAnimationFrame`) and the nav's sliding pill (measured against the fallback font on a first visit) are where a hidden pane or a warm cache gives a false reading.
- Two named exceptions for gate runs, reported as exempt, not failed: homepage nav and hero contrast on `#7B7FD4` (Gate 1, 9 Oct 2026, figures in `.claude/rules/design-system.md`), and no Organization JSON-LD (Gate 3, 9 Oct 2026: schema is no GEO lever on the evidence table, `WebSite.author.url` already makes the entity link, and The Edit is not a registered organisation; reopen only if it becomes a legal entity).
- Schema markup and llms.txt are never recommended as GEO work: on the evidence table in `~/AI Work/cowork/PROJECTS/CONSULTING/GEO AUDIT/CONSULTANCY_GEO-Audit-Product_v1.html` neither moves citation. Neither has been added and neither should be.

## Voice rules (locked)

- No em dashes anywhere, including meta tags and OG titles. No inline quote marks in verdicts. UK English, contractions throughout.
- "My Stack", first person, throughout: it is Jasmin's own stack. "Your stack" belonged to Build Your Own Stack, cut on 26 Aug 2026; never restore it.
- Verdicts are direct and frank, name the catch and never bury a limitation.
- Sector precision is credibility: a DPIA is something an organisation does, not something a tool "needs"; the flag means typical comms use is likely to trigger one.
- The audience phrase is three-part and never shortened to "charity" alone, because that loses the local-authority museum service and the university gallery as a matter of fact and the cathedral or archive as a matter of identity. Nominal form where the audience is the object: "charities, cultural organisations and heritage". Adjectival form where it modifies a noun: "charity, cultural and heritage".
- Meta strings can carry the full phrase, because nobody reads two of them. On-page copy is read in sequence, which is where crowding is real and the phrase has to earn its place.
- `vite.config.ts` ships two visitor-facing strings in the PWA manifest, outside every copy inventory: an audit that greps `src/` and `index.html` misses them.
- A line placed here that describes another of Jasmin's properties, or a line elsewhere that mentions The Edit, is searched before it is offered against the host page's captured text and the other property's locked terms. "The checks" is The Edit's tool vetting; a shared word ("checks", "gate", "board", "governance", "agents") used in a different sense is cut, or its object named.
- "AI" is absent from the visible subline on `/tools`, `/my-stack`, `/learning`, `/radar` and `/submit` by ruling, since it is in every title, meta description and the site name.

## Design, always

- Colours are hex, never names. Electric lime `#C8F04A` is accent and punctuation only: never a category colour, a badge or a section ground. Never rely on colour alone to carry meaning, because the site already carries contrast debt: DPIA flags are text-labelled chips, and links in running text are underlined at rest (`.lime-link`, after Lighthouse failed the footer email on WCAG 1.4.1). DM Mono is retired. The palette, its contrast figures and the component rules load from `.claude/rules/design-system.md`.

## Working discipline

- One job per change, never two combined. Before editing, state what must not be touched. Structure before styling; hex codes and pixel values, never adjectives.
- Verify with vitest or the local dev server first, then on the production URL once the deploy lands (branch work: vitest and the preview only, and never the preview for Sheet data).
