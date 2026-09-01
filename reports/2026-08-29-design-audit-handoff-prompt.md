# Design-Audit Handoff Prompt

Written 29 August 2026, Cowork handover thread. For pasting into a fresh
Claude Code session on `overhaul/sector-axis`.

The block between the two markers is the prompt. Paste all of it, nothing
else. The evidence section is deliberately inside the prompt: it is what
stops the agents spending their first pass rediscovering things already
verified from the repo tonight.

One assumption flagged, not guessed past: I could not read your website
design agent definitions from here. `.claude/` in this repo holds only
`CLAUDE.md`, `schema.md`, `launch.json` and `settings.local.json`, there is
no `agents/` directory anywhere in the repo, and `~/.claude` is not a folder
connected to this session. So the prompt tells the code session to find its
own website design agents and refuses a general-purpose substitute, rather
than naming an agent I have not read. If you would rather name them
explicitly, replace the second paragraph with the names.

---

PROMPT STARTS

---

You are auditing the look and feel of The Edit AI. Repo `~/Developer/the-edit-ai`,
branch `overhaul/sector-axis`. Read `.claude/CLAUDE.md` in full first, then
`reports/2026-08-22-overhaul-audit.html`, then the most recent dated entry in
`SCRATCHPAD.md`.

Run this through my website design agents. List the subagents available to
you, pick the ones whose remit is website or UI design, and run them on the
**fable** model. If more than one applies, run them in parallel and reconcile
their findings into a single report rather than handing me two. If none of
your available agents is a website design agent, stop and tell me. Do not
substitute a general-purpose agent for this.

**This session changes no files.** Not one. It produces a findings document
and stops. Implementation is a separate session against an approved subset of
these findings.

## The three complaints, in my words

1. **Too much left-aligned column text with dead space on the main pages.**
   Content sits in a narrow left-hand column inside a very wide container and
   the right two-thirds of the viewport does nothing.
2. **Tool card pages read busy and overwhelming on desktop.** Too many stacked
   information blocks at near-identical small type sizes, nothing leading the
   eye.
3. **It does not work on mobile.** Not "could be better on mobile". Does not
   work.

Your job is to explain each of these mechanically, in the code, and propose
specific fixes in hex codes and pixel values. Not adjectives.

## What is already verified from the repo, so you do not re-derive it

Checked against the branch on 29 August 2026:

- **`src/components/ToolCard.tsx` contains zero responsive classes.** 383
  lines, no `sm:`, `md:`, `lg:` or `xl:` anywhere, and 20 inline `style={{}}`
  blocks. A 375px phone and a 1440px desktop get identical type sizes,
  identical padding and identical stacking. This is very likely the single
  root cause under complaints 2 and 3 at once, and it is where I would start.
- **`src/components/WhatsNewCard.tsx`**: 435 lines, 3 responsive classes, 29
  inline style blocks. Second worst.
- **Responsive coverage is wildly uneven per file.** `src/pages/Tools.tsx` has
  19 responsive classes, `Index.tsx` 15, `Learning.tsx` 2, `WhatsNew.tsx` 3,
  and `NotFound.tsx`, `PrivacyPolicy.tsx`, `CookiePolicy.tsx` and
  `TermsOfService.tsx` have none at all.
- **Two responsive systems run side by side and disagree.** Tailwind's CSS
  breakpoints (`sm:` fires at 640px) and a JavaScript hook,
  `src/hooks/use-mobile.tsx`, whose `MOBILE_BREAKPOINT` is 768. The hook is
  used in `Layout.tsx`, `HomeGravity.tsx`, `DragHint.tsx` and `Index.tsx`.
  Between 640px and 767px the CSS has already switched to its wider layout
  while the JS still reports mobile. Check what that actually renders on a
  small tablet or a large phone in landscape.
- **The dead space is hardcoded inline pixel values inside a 1280px
  container.** `Tools.tsx:98` sets `maxWidth: 520`, `Tools.tsx:300` sets
  `maxWidth: 720`, `Index.tsx:124` sets `maxWidth: 640`, each nested inside
  `max-w-[1280px] mx-auto`. None of them is responsive and none is a token.
  That is complaint 1, stated in code.
- **The design tokens exist but are not the source of truth in practice.**
  `src/index.css` defines the palette as HSL custom properties and
  `tailwind.config.ts` maps them to Tailwind colours, yet components hardcode
  the same colours as inline hex strings (`#1A1510`, `#9A8F82`, `#2D35C9`,
  `#C8F04A`, `#E8E2D8`, `#A8261C`). Any change to a token today does not reach
  the cards.
- **The tools grid is `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`**
  (`Tools.tsx:314`). The card has to survive three widths; today it is written
  for one.
- **Contrast debt worth measuring.** `CLAUDE.md` says the site already carries
  AA contrast debt and forbids adding to it. `#9A8F82` muted text measures
  roughly 3.2:1 against `#FFFFFF` and 3.0:1 against `#FAF8F4`, against a 4.5:1
  AA requirement for normal text, and ToolCard uses it at 11px in several
  places. Verify that calculation yourself and quantify the debt properly:
  you are about to propose changes to type sizes, so this is the moment to
  price it.

Treat all of the above as leads, not conclusions. Confirm each one before you
build a finding on it, and tell me if any of it is wrong.

## Constraints that are not up for discussion

- **Do not change any file this session.** Findings only.
- **Do not write, rewrite or improvise any visitor-facing copy.** Copy arrives
  as approved exact strings from a separate process. If a layout fix needs a
  shorter label, say so as a request, do not write the label.
- **The design system is locked.** Cobalt `#2D35C9`, cream `#FAF8F4`, card
  `#FFFFFF`, periwinkle `#7B7FD4` (homepage hero only), electric lime
  `#C8F04A` (accent punctuation only, never a category colour or a badge),
  text `#1A1510`, muted `#9A8F82`, borders `#E8E2D8`, chip tint `#EEF0FB`,
  In My Stack badge `#2D6A4F`, DPIA chips Green `#2D6A4F` on `#E4F0E9` /
  Amber `#7A5200` on `#FAF0DB` / Red `#A8261C` on `#FBE9E6`. Chillax 700
  display, Plus Jakarta Sans 400/500/600 body. DM Mono is permanently
  retired. Never rely on colour alone to carry meaning. Propose changes to
  layout, spacing, hierarchy, type scale and responsive behaviour. If you
  believe a locked value is wrong, raise it as a separate flagged item at the
  end and give the reasoning, do not fold it into a fix.
- **Never touch `dpia_flag`, `trustee_note` or `verdict`** as data or as
  content. Their rendering is fair game, their values are not.
- **Nothing merges to main.** Not this session, not the implementation
  session.
- The row ceiling is 45 and the directory serves charity, cultural and
  heritage comms teams. Do not propose anything that reads as a general AI
  tools directory.

## How to look at it

The live site on `main` is the old pre-overhaul site, so it tells you nothing
about this branch. Preview deploys return 403 on Sheets data because the
production API key is referrer-locked to `theeditai.co.uk/*`. Run the local
dev server and audit that. If the local Sheets key is not resolving, build
fixtures from `reports/2026-08-28-sheet-edit-pack.md` rather than auditing
empty states and calling it a layout finding.

Only 15 of the 67 rows are complete, and only complete rows render
(`isComplete()` in `src/lib/sheets.ts`). So the real grid is 15 cards, not 67.
Audit the grid at its real density, and separately at the density it will have
at the 45-row ceiling.

Check every one of these widths and report each: 375, 390, 414, 640, 767, 768,
1024, 1280, 1440. The 767/768 pair is not padding, it is where the two
breakpoint systems disagree.

Pages to cover: `/` (Index), `/tools` (Tools plus ToolCard), `/whats-new`,
`/my-stack`, `/design-kit`, `/learning`, `/policy-template`, and the legal
pages via `LegalPage.tsx`.

## What I want back

One file, `reports/2026-08-29-design-audit-findings.md`. No other file
changes.

Structure it like this:

1. **The five things to fix first**, ranked, each in one sentence with the
   file it lives in. I want to be able to read this section alone and know
   what to commission.
2. **Findings**, one block each, in this shape:
   - Symptom, in the terms a visitor would notice
   - `file.tsx:line` for every place it lives
   - Cause, mechanically
   - Proposed change, in hex codes, pixel values, breakpoint names and class
     strings
   - Blast radius: what else renders differently if this changes
   - Whether it needs my ruling before implementation, and if so, the exact
     question
3. **The width matrix**: every page against every width listed above, marked
   works / degraded / broken, with a one-line note on each degraded or broken
   cell.
4. **Contrast audit**: every text colour and size pairing that fails AA, with
   the measured ratio and the smallest change that fixes it.
5. **Structural recommendation**: whether the inline-style-plus-hardcoded-hex
   pattern should be converted to tokens and Tailwind classes as part of this
   work or kept as a separate job. Give me one answer, with the reasoning, not
   both options.
6. **Anything you found that I did not ask about**, including anything above
   that turned out to be wrong.

Give me committed recommendations throughout. If two approaches are genuinely
balanced, pick one, say why, and note what would change your mind in a single
line. Do not hand me a menu.

UK English. No em dashes.

---

PROMPT ENDS

---

## Notes for Jasmin, not part of the prompt

- The prompt bans file changes on purpose. Design audits that are allowed to
  fix things as they go come back as a diff you cannot evaluate, and this one
  touches the card that carries the whole moat.
- The strongest finding available before anyone runs anything: ToolCard has no
  responsive classes at all. If that holds, complaints 2 and 3 have one shared
  cause and one shared fix, which is a much cheaper piece of work than three
  separate ones.
- The 640 versus 768 breakpoint mismatch is the kind of defect that reads as
  "the site is broken on my phone" without ever showing up on a desktop
  browser resized by hand. Worth its own check.
- The structural question in section 5 is the one with real cost attached.
  Converting the inline hex to tokens is the right thing and it touches nearly
  every component, so it wants to be a decision you make deliberately, not a
  side effect of a spacing fix.
