# A4 re-check: the two Adobe rows

**25 August 2026.** Triggered by Jasmin asking why two products from the same
vendor carry different facts. She was right, and the rows could not both be
true as they stood.

## What the Sheet said

| Row | data_location | trains_on_input | nonprofit_tier |
|---|---|---|---|
| Adobe Suite | EU | No by default | Charity Digital Exchange: CC All Apps at a discount |
| Adobe Firefly | Unclear | No | Adobe Express Premium for Nonprofits: free, 50 seats |

Same vendor. Two different data locations. Two different training answers, one
implying a setting exists and one implying none is needed. Firefly is the model
sitting inside Creative Cloud and Express, so it is not even a separate purchase.

## What Adobe actually publishes

Checked 25 August 2026 against Adobe's own help pages, not secondary sources.

**Generative AI training: Adobe does not do it.** From the content analysis FAQ,
verbatim: "We do not analyze your content to train generative AI models, unless
you choose to submit content to the Adobe Stock marketplace." The Firefly FAQ
says the same from the other direction: "we don't train on any Creative Cloud
subscribers' personal content." Firefly was trained on licensed Adobe Stock,
openly licensed and public domain content.

**Content analysis for product improvement is a different thing, and it is the
thing the rows were half-remembering.** It is not generative AI training. Adobe
may analyse content processed or stored on its servers, and not content stored
locally. Crucially it differs by account type:

- **Personal accounts are opted in by default** and can turn it off at
  account.adobe.com/privacy.
- **Business, team and school accounts are automatically opted out.**

**The buying-tier rule resolves it.** A charity buying Creative Cloud through
the Charity Digital Exchange gets a business or team licence, which is opted out
of content analysis automatically, and no generative AI training happens on
either tier. So the correct value on the tier a small charity would actually buy
is `No`, for both rows.

The personal-account default is a real catch and it belongs in the verdict: a
charity running individual subscriptions should turn content analysis off, and
Adobe leaves it on.

## Proposed values

| Row | data_location | trains_on_input | nonprofit_tier |
|---|---|---|---|
| Adobe Creative Cloud | **Unclear, pending a source** | **No** | Charity Digital Exchange: CC All Apps at a discount |
| Adobe Express | **Unclear, pending a source** | **No** | Adobe Express Premium for Nonprofits: free, 50 seats |

## Two things this did not settle

**1. Data location is unsourced on both rows, and that is the real defect.**
Adobe's public help pages do not state where Creative Cloud or Firefly content
is processed for a UK customer on a standard plan. The `EU` currently on Adobe
Suite has no source behind it that this pass could find, and an unsourced `EU`
is worse than an honest `Unclear`, because `Unclear` is a published warning and
a wrong `EU` is a false reassurance on the axis the whole site is built on.
Both should read `Unclear` until someone sources it. Adobe publishes regional
storage options for some enterprise products, which is not the tier this
audience buys.

**2. The Firefly row's nonprofit tier describes a different product.** "Adobe
Express Premium for Nonprofits" is Express's programme, not Firefly's. No
charity buys Firefly on its own; they get it inside Express or inside Creative
Cloud. So the row is really an Express row wearing a Firefly name.

**Jasmin's call, and the reason the rows should stay separate:** rename them to
what a charity actually buys. `Adobe Creative Cloud` and `Adobe Express`. The
two nonprofit routes are genuinely different, a paid discount through Charity
Digital Exchange against a free 50-seat Express programme, and that difference
is exactly the kind of thing this directory exists to surface. Keeping a row
called "Adobe Firefly" describes a thing nobody purchases.

## Sources

- Adobe, Content analysis FAQ for Creative Cloud and Document Cloud:
  https://helpx.adobe.com/account/individual/terms-policies-and-regulations/content-analysis-faq.html
- Adobe, Adobe Firefly FAQ:
  https://helpx.adobe.com/firefly/web/get-started/learn-the-basics/adobe-firefly-faq.html

Neither is price-sensitive, so the US-IP currency problem does not apply. The
two nonprofit programme descriptions are unchanged from the original A4 pass and
were not re-verified here.
