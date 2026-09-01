# Audience phrase review: handoff prompt

Written 29 August 2026. For pasting into a fresh Claude Code session on
`overhaul/sector-axis`. Review and proposal only, no code changes, no
committed copy.

---

PROMPT STARTS

---

Repo `~/Developer/the-edit-ai`, branch `overhaul/sector-axis`. Read
`.claude/CLAUDE.md` in full, paying particular attention to the voice rules
and the project identity, then `reports/2026-08-22-overhaul-audit.html` for
the re-point.

Run this through my website design agents. List the subagents available to
you, pick the ones whose remit covers site copy, information design or UX
writing, and run them on the **fable** model. Reconcile them into one
proposal rather than handing me several. If none of your agents fits, say so
rather than substituting a general-purpose agent.

**Change no files.** This session produces a proposal document and stops.

## The question

The site describes its audience as "charity, cultural and heritage". I want
to know whether that phrase is right, whether it is in the right places, and
whether "charity" alone would be clearer, particularly in headings.

Already verified in the repo, so do not re-derive it, but do confirm it:

- The phrase appears **13 times**.
- **Seven are meta descriptions** (`Index.tsx`, `Subscribe.tsx`,
  `Learning.tsx`, `PolicyTemplate.tsx`, `Tools.tsx`, `DesignKit.tsx`,
  `index.html` including the OG and Twitter tags). These are read by search
  engines and by strangers deciding whether to click.
- **Six are visible copy**: `FooterEmailCapture.tsx:35`, `Subscribe.tsx:37`,
  `Subscribe.tsx:72`, `PolicyTemplate.tsx:47`, `Tools.tsx:238`, and the cover
  of the policy template at `public/AI-Use-Policy-Template.docx`.
- **It appears in no H1 anywhere.** If you think it should, or that a heading
  elsewhere is carrying the audience badly, say so.

## What is not up for discussion

**The audience definition itself is locked.** The re-point from a general AI
tools directory to charity, cultural and heritage comms teams is a settled
standing decision. You are reviewing how that audience is *expressed and how
often*, not who it is. If your honest recommendation is that the audience
should change, put it in a clearly separated section at the end with the
reasoning, and do not fold it into any string proposal.

**Never author copy that gets placed.** Every proposal is a suggestion for
Jasmin's sign-off. Change nothing.

## What to weigh

Argue both sides properly before you land, and make the case for keeping the
phrase as hard as the case for cutting it.

- **Identification.** Most museums, galleries and archives are charities in
  law, but a comms officer at one may not self-describe as a charity. Some
  are not registered charities at all, including local authority museum
  services and university galleries.
- **Discoverability.** "AI policy for charities" is a crowded search phrase.
  "Heritage" is not. Assess what dropping the two words actually costs, and
  say whether the meta descriptions and the visible copy should follow the
  same rule or different ones.
- **Repetition.** Thirteen instances of the same three-noun phrase. Jasmin's
  own voice rules treat rule-of-three lists as filler. Is the problem the
  phrase or the repetition?
- **Second person.** Where the audience is already established by context,
  consider whether "your organisation" or "your team" beats naming the
  category at all.
- **Voice rules, all locked:** UK English, contractions, no em dashes
  anywhere including meta tags and OG titles, "your stack" not "my stack",
  direct and frank, name the catch.

## What I want back

One file, `reports/2026-08-29-audience-phrase-proposal.md`.

1. **The recommendation in one paragraph.** One answer, not a menu. If the
   answer differs between meta descriptions and visible copy, say so plainly
   and give the rule for each.
2. **A table of all 13 instances**: `file:line`, the current string verbatim,
   keep or change, the proposed exact replacement string where changed, and
   one line of reasoning each.
3. **Headings specifically.** Whether any H1 or H2 should carry the audience,
   and if so which and what it should say.
4. **What it costs.** Your honest read on the SEO and identification downside
   of every change you propose. If a change is a judgement call rather than
   an improvement, mark it as one.
5. **Anything you found that I did not ask about**, including any place the
   audience is described inconsistently.

Committed recommendations throughout. Where two options are genuinely
balanced, pick one, say why, and give the one thing that would change your
mind.

---

PROMPT ENDS

---

## Note for Jasmin

The proposal comes back as exact strings, so approving it is a read-and-tick
job and then one commit of placed copy. Watch for a session that quietly
proposes narrowing the audience rather than the wording. The prompt separates
those two, and they should stay separate.
