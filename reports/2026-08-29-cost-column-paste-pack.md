# Column D paste pack, 29 August 2026

Applies the two conventions Jasmin ruled 29 Aug:

1. **Record the vendor's displayed currency verbatim.** No conversion. GBP
   only where the vendor genuinely publishes GBP.
2. **Show both prices where the headline figure needs a year upfront.**
   `$16/mo billed annually, $24 monthly`.

**Read this first: the Sheet is in better shape than the 28 Aug currency
report says.** That report found thirteen mismatches. Jasmin corrected most
of them on the Sheet this morning (last modified 29 Aug 11:18), so under the
new conventions only **six rows** need an edit, and **no verdict needs
rewriting** — the verdicts were checked for price figures, tier names and
policy claims, and only HubSpot and Adobe Express mention pricing at all,
both still true.

## Ready to paste

| Row | Tool | Current cell | Paste this |
|---|---|---|---|
| 29 | Adobe Express | `Free tier / Express Premium free for charities` | `Free tier / Premium £9.98/mo incl VAT / free for registered charities` |
| 46 | Descript | `Free tier / Hobbyist from $16/mo annual` | `Free tier / Hobbyist $16/mo billed annually, $24 monthly` |
| 62 | Gamma | `Free tier / paid plans from £7 a month` | `Free tier / Plus $12/mo, $9/mo billed annually` |
| 60 | Microsoft Copilot | `Copilot Chat included with M365 / add-on £23.10 per user` | `Copilot Chat included with M365 / add-on £23.10/user/mo billed annually, £24.26 monthly` |

Sources, captured 29 Aug 2026 in the desktop browser:

- Adobe Express: `adobe.com/uk/express/pricing`. Free £0.00, Premium
  £9.98/mo incl VAT, Firefly Pro £19.99/mo incl VAT. GBP is genuine here,
  served off Adobe's `/uk/` path, so the convention keeps pounds.
  Firefly Pro deliberately left out of the cell: the Adobe Creative Cloud
  row covers that product.
- Gamma: `gamma.app/pricing`, both billing toggles read. Free US$0, Plus
  US$12/seat/month billed monthly, US$9/seat/month billed annually
  (US$108/seat/year). This closes the "could not verify, client-side
  rendering" gap from 28 Aug.
- Descript and Copilot figures carry over from the 28 Aug vendor-page pass;
  only the display convention changes.

## Needs one check before pasting

| Row | Tool | Current cell | The question |
|---|---|---|---|
| 3 | HubSpot | `Free CRM / Marketing Starter from £18 a month` | HubSpot publishes GBP for UK buyers, so pounds may be correct here rather than a conversion. The 28 Aug pass saw `Starter from $7/mo/seat annual` from a US egress. Confirm the UK figure and whether it is per seat. |
| 57 | Claude | `Free tier / Pro £15 a month annual, £18 monthly / nonprofit Team $8` | Mixes converted GBP with USD in one cell. The 28 Aug pass saw `$17/mo annual, $20 monthly` as served. If Anthropic publishes GBP to UK customers, keep pounds and drop the USD; if not, the cell becomes `Free tier / Pro $17/mo billed annually, $20 monthly / nonprofit Team $8`. |
| 58 | ChatGPT | `Free tier / Plus from £20/mo` | Under the convention this becomes `Free tier / Plus $20/mo`. Separately, a cheaper **Go** tier now exists and is not in the cell. Its USD price could not be captured. |

## Why these three could not be settled here

The desktop browser does not resolve to the UK. OpenAI's pricing page served
shekels (₪0 / ₪25 / ₪70 / ₪310) and Google Workspace served euros (€3.40 /
€6.80 / €10.55) even on the `en_uk` path. Only vendors with a hard
country URL path, like Adobe's `/uk/`, gave GBP.

So the note in `2026-08-28-pricing-currency-check.md` saying five minutes in
the browser pane settles all six rows is wrong, and should not be retried as
written. This is also the strongest argument for the convention Jasmin
ruled: GBP display depends on the visitor's own account and location rather
than the vendor's actual price, so a pound figure in the Sheet is not a fact
anyone can verify from a source page.

## Verdict check, no action needed

All 23 published verdicts were scanned for price figures, currency symbols,
named tiers and policy claims. Two mention pricing:

- **HubSpot**: "The free tier is genuinely usable..." and the free-tier
  control point. Both still true.
- **Adobe Express**: "Free Premium for charities on 50 seats." A factual
  claim about the charity programme, not a price, and unaffected by the
  £9.98 figure. Worth confirming the 50-seat number at some point; it is
  not a currency issue.

The 28 Aug report flagged Grok, Notion AI and Gemini as rows whose verdicts
might contradict the new facts. They do not: those three verdicts carry no
price or tier language, and their cost cells were already corrected.

---

*Compiled 29 August 2026. Vendor pages only. Nothing pasted; column D is
machine-writable in principle but this pack is for Jasmin to paste, since
the pipeline that would write it does not exist yet.*
