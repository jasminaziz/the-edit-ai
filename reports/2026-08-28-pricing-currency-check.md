# Pricing currency check, all 23 published rows

**28 August 2026. Agent-verified against vendor pricing pages only, never
third-party sites. For Jasmin's review; nothing pasted.** Caveat that
applies throughout: the checks ran from a US egress point, so vendors that
geo-localise showed USD even on UK URLs. Rows marked "could not verify
(GBP)" need one look from a UK browser, which the desktop browser pane can
do on request.

## Verdict table

| Tool | Recorded | Verified 28 Aug | Verdict |
|---|---|---|---|
| HubSpot | Free tier usable / paid scales | Free up to 2 users; Starter from $7/mo/seat annual | MATCH (qualitative) |
| Blotato | Limited trial / From £29/mo | Starter $29/mo USD only; free 7-day trial on every plan | MISMATCH (currency, and "limited trial" is now wrong) |
| Canva | Free tier / Pro £100 a year / free for charities | Confirmed on canva.com/en_gb | MATCH |
| Adobe Creative Cloud | From £55/mo | Restructured: CC Standard £51.98/mo, CC Pro £66.49/mo incl VAT; nothing at £55 | MISMATCH |
| Adobe Firefly / Express | Free tier / From £8/mo | US$9.99 Express Premium as served; GBP not capturable | Could not verify (GBP) |
| Ideogram | Free tier / From £8/mo | Cheapest paid now Plus $20/mo ($15 annual) | MISMATCH |
| Granola | Free tier / Pro from £14/mo | No Pro plan: Business $14/user/mo USD | MISMATCH |
| NotebookLM | Free | Free base holds; higher limits sold via Google AI plans; Google now calls it "Gemini Notebook" in help pages | MATCH (caveat) |
| Perplexity | Free tier / Pro from £17/mo | Pro $20/mo USD only | MISMATCH |
| Descript | Free tier / From £12/mo | Hobbyist $16 annual-billing / $24 monthly, USD | MISMATCH |
| ElevenLabs | Free tier / From £4/mo | Starter $6/mo USD, taxes excluded | MISMATCH |
| Submagic | Free tier / From £17/mo | Starter $19/mo or $12/mo annual, USD | MISMATCH |
| ChatGPT | Free tier / Plus from £20/mo | Help centre: Plus $20/mo; a cheaper "Go" tier now exists; GBP not capturable | Could not verify (GBP) |
| Claude | Free tier / Pro from £18/mo | Pro $17/mo annual ($200 upfront) or $20 monthly, USD as served | Could not verify (GBP) |
| Gamma | Free tier / Plus from £12/mo | Plan names render, figures do not (client-side) | Could not verify |
| Gemini | Free tier / Advanced from £19/mo | "Advanced" no longer exists: Google AI Plus $4.99, Pro $19.99, Ultra $99.99 | MISMATCH (tier renamed) |
| Google Workspace AI | Included with Workspace from £10/mo | Gemini-in-apps NOT available on Business Starter, so the inclusion claim is partly wrong; GBP behind a calculator | Could not verify (GBP), claim needs edit |
| Microsoft Copilot | Copilot Chat included / add-on £23.10 | Confirmed: £23.10 ex VAT paid yearly (£24.26 monthly). New cheaper SMB SKU exists: M365 Copilot Business £13.80/user/mo promo | MATCH (caveats) |
| Notion AI | Free tier / add-on from £8/mo | The AI add-on is DISCONTINUED: AI now included in paid plans, full AI on Business $20/member/mo | MISMATCH (product restructured) |
| Wispr Flow | Free tier / Pro from £12/mo | $12/user/mo annual-billing only; $15 monthly; USD | MISMATCH (currency and annual trap) |
| Seedance | Free via Dreamina / API pay-per-use | Dreamina free credits confirmed; BytePlus API figures failed to render | MATCH (half unverified) |
| DeepSeek | Free / API pay-per-use | Confirmed on vendor pages | MATCH |
| Grok | Requires X Premium from £8/mo | WRONG: Grok is free at grok.com and in its apps; SuperGrok $30/mo; X Premium £8/mo bundles limits but is not required | MISMATCH (access model outdated) |

## The three that matter most

1. **Grok's row makes a false claim** on a published failure row, which is
   the worst place to be wrong. The access model changed under it.
2. **Notion AI's product no longer exists in the form the row describes.**
   The add-on is gone; the A5 verdict draft's tier point ("the full AI
   lives on Business") survives, but the cost cell and any add-on language
   do not.
3. **Gemini's tier renaming** means the row names a product Google retired.

## The systemic ruling, before any paste

Most mismatches are the same root cause: the Sheet records pounds for
vendors that only display dollars. That is conversion, the exact failure
the ChatGPT £16 correction identified. Options: record vendor currency
verbatim (honest, slightly awkward mid-grid), or convert with a visible
convention. One ruling covers eleven rows. The annual-billing trap (a
"from" price that needs a year upfront) also wants a display convention:
Wispr Flow, Ideogram, Submagic and Descript all carry it.

## Needs one UK-browser look

Adobe Express/Firefly, ChatGPT, Claude, Gamma, Google Workspace, and the
Gemini plans: GBP displays where they exist could not be captured from a US
egress. Five minutes in the desktop browser pane settles all six.

---

*Two agent sessions, vendor pages only, 28 August 2026. Companion file:
`2026-08-28-a4-fact-pass-batch2.md`.*
