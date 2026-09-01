# ToolCard rebuild brief

Written 29 August 2026. For pasting into a fresh Claude Code session on
`overhaul/sector-axis`, **after** the seven unblocked fixes have landed
(`reports/2026-08-29-unblocked-fixes-brief.md`).

Three rulings that were blocking this are now taken. They are stated as
decisions inside the prompt, not as questions.

---

PROMPT STARTS

---

Repo `~/Developer/the-edit-ai`, branch `overhaul/sector-axis`. Read
`.claude/CLAUDE.md` in full, then `reports/2026-08-29-design-audit-findings.md`,
then the most recent `SCRATCHPAD.md` entry.

You are rebuilding `src/components/ToolCard.tsx`. It is 383 lines with **zero
responsive classes** and 20 inline `style={{}}` blocks, and it renders 18 text
runs: one at 20px and seventeen packed into an 11 to 14px band, with nothing
in between. That flatness and that lack of responsiveness are the job.

Implement the findings report's recommendations for this component. Where the
report specifies values, use them. Where it does not, propose and stop for
sign-off rather than choosing for yourself.

## Rulings already taken. Do not reopen these.

**1. The hover state stays exactly as it looks today.** The card inverts to
cobalt `#2D35C9` on hover and neighbouring cards dim. Jasmin ruled this on
29 August. Do not replace it with a border-and-lift treatment.

**2. But it must not stay inline.** Put a single `is-selected` class on the
card root and drive every child colour from descendant CSS rules. Do not keep
the per-element `isSelected ? a : b` conditionals. The visual result must be
identical; the inline style blocks must be gone. This is the whole reason the
card cannot currently take responsive classes, so it is a precondition for
the rest of the work, not a tidy-up afterwards.

**3. Lime `#C8F04A` stays the primary button on the card.** It measures
6.50:1 on cobalt, so it holds up on the inverted ground. The
punctuation-only line in the design system is amended for this one case.

**4. `#9A8F82` never carries text.** It keeps rules, dividers and icons.
Every place it currently carries text uses the new secondary-text token
**`#6B625A`**, signed off 29 August: 5.62:1 on cream, 5.97:1 on card white,
against `#9A8F82`'s failing 2.99:1. Add it as a token in `index.css` and
Tailwind, do not hardcode it.

## Two changes to fold into the hover, both measured

- **Raise the neighbour dim floor from 45% to 70% opacity.** At 45% the body
  text `#1A1510` composites to `#95928D`, which is 2.92:1 on cream, so every
  dimmed card fails contrast for as long as the effect runs. At 70% it
  measures 6.55:1 and the effect still reads clearly.
- **Fire the same selected state on tap and on `:focus-visible`.** Hover does
  not exist on touch, so today the card's main interaction does nothing at
  all on a phone. This is not optional given the audit's third complaint.

## Constraints

- **Author no visitor-facing copy.** Every string on the card is approved and
  arrives verbatim. If a layout fix seems to need shorter wording, stop and
  flag it as a request.
- **Add no new inline hex.** Tokenisation is the next job and this one must
  not make it bigger. Use existing tokens, plus the new `#6B625A`.
- **The DPIA chips are locked:** Green `#2D6A4F` on `#E4F0E9`, Amber
  `#7A5200` on `#FAF0DB`, Red `#A8261C` on `#FBE9E6`, text and 1px border in
  the same hex. They must hold their locked colours on the inverted cobalt
  card too. Verify that, do not assume it.
- **Never rely on colour alone to carry meaning.** The DPIA flag is a
  text-labelled chip and stays one.
- **All seven axis fields stay on the card.** `jobs`, `data_location`,
  `trains_on_input`, `nonprofit_tier`, `dpia_flag`, `trustee_note`,
  `last_checked`. This is the moat. Reducing the card's busyness means
  hierarchy and spacing, never dropping a field.
- **Do not touch `isComplete()` or anything in `src/lib/sheets.ts`.**
- One job per commit. `bunx tsc --noEmit`, `bun test` and `bun run build`
  before every one. Do not run git: hand Jasmin copy-paste blocks starting
  with the `cd`.
- Do not merge to main.

## One open ruling that affects you

Whether the grid runs two or three columns at 1280px is **not yet decided**.
Build the card so it works at both. Do not assume three, and do not decide it
yourself.

## Verification

`main` is the old pre-overhaul site and tells you nothing. Preview deploys
403 on Sheets data because the production key is referrer-locked to
`theeditai.co.uk/*`. Run the local dev server against live Sheet data.

The directory is **23 complete rows**, not 15. Audit at that density and
again at the 45-row ceiling.

Check at 375, 390, 414, 640, 768, 1024, 1280 and 1440px. For each: the card
at rest, the card hovered, a neighbour dimmed, and the card focused via
keyboard. Screenshot the hover and dim states rather than reasoning about
them; the audit caught a false finding that way.

Also verify on touch, or say plainly that you could not.

## What I want back

The rebuilt component, committed one job at a time, plus a session note in
`SCRATCHPAD.md` recording: the type scale you ended on, the widths you
verified at, confirmation that the inverted card still renders all three DPIA
chip colours correctly, and anything the findings report got wrong.

If any part needs a ruling, stop on that part and ask. Do not decide it.

---

PROMPT ENDS

---

## Note for Jasmin

The one thing to watch in the result is ruling 2. If the session comes back
with the hover working but `ToolCard.tsx` still full of inline styles, it has
done half the job, and the tokenisation work behind it will cost several
times more than it should. The test is simple: search the file for
`isSelected ?` and it should be gone.
