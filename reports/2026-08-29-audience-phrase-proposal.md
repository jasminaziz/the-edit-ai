# Audience phrase proposal, 29 August 2026

Branch `overhaul/sector-axis`. Review only: no file in `src/`, `index.html` or
`vite.config.ts` was touched, and no copy has been placed. Every string marked
**PROPOSED** below is a suggestion for your sign-off.

**Method.** Three of the website agents were run in parallel on the fable
model: the copywriter (voice authority), the stranger (cold identification
read) and the gates auditor (scoped to the discoverability question only).
Their findings were reconciled here, and every load-bearing claim was
re-checked against the repo, including two the agents disagreed on.

---

## 0. The inventory is not 13. It is 25.

The brief said 13 instances in two groups. Counted across `src/`, `index.html`
**and `vite.config.ts`**:

| # | Phrasing | Total | Live |
|---|---|---|---|
| A | "charity, cultural and heritage" | 15 | **12** |
| B | "charities, cultural organisations and heritage" | 3 | 3 |
| C | "Charity & Cultural Comms Teams" (title) | 4 | 4 |
| D | "Charity & Heritage Comms" (title) | 1 | 1 |
| E | "for Charities" (title) | 1 | 1 |
| F | "for Charity Comms" (PWA manifest name) | 1 | 1 |
| | **Total** | **25** | **22** |

Four corrections to the brief:

1. **Six phrasings, not two.** The brief reviewed A and B and did not know C to
   F existed. C to F are the title and manifest layer, and that is where the
   only real problems are.
2. **`vite.config.ts` was in no inventory at all**, yet it ships two
   visitor-facing strings: the PWA manifest name (line 24) and description
   (line 27). Any future audit that greps `src/` and `index.html` misses them.
3. **Three instances are dead.** `Subscribe.tsx:9, :37, :72` render nowhere:
   the file is imported by nothing and `/subscribe` is a redirect. Excluded
   throughout.
4. **`index.html` is three tags, not one** (`:7` description, `:34`
   og:description, `:35` twitter:description), plus three title tags at
   `:6, :32, :33`.

---

## 1. The recommendation

**Keep the three-part phrase everywhere it currently appears in descriptions
and body copy, and do not shorten it to "charity" anywhere.** All three agents
reached that independently and it also defeats the argument I started with, so
it is stated plainly: I opened this review thinking the phrase was costing the
site its differentiator in search, because six of ten meta descriptions
overrun the snippet limit and shortening the phrase would recover the tail.
That reasoning was wrong on the facts. In every over-length description the
phrase sits at character 21 to 45 and survives truncation, while the tail that
gets cut is the sacrificial part, which is the right ordering already. The
real problem is not that the phrase is too long. It is that **the phrase is
absent from the layer that decides whether anyone arrives**, and inconsistent
in the three places it does appear there. The rule by surface: **descriptions,
body copy and JSON-LD always carry the full triple**; **titles carry the full
triple where the character budget allows and are ruled deliberately where it
does not**; **"charity" alone is acceptable in exactly one place, the
`/policy-template` title, on a named search-intent trade with a tripwire**.
Two changes follow, one of them the highest-value change available, plus a
rule that needs writing down.

---

## 2. Every instance, with rulings

Repo root `/Users/jasminaziz/Developer/the-edit-ai`.

### Change

| Location | Current | Ruling | Proposed |
|---|---|---|---|
| `index.html:6` | `The Edit \| AI Tools for Charity & Cultural Comms Teams` | **CHANGE** | **PROPOSED:** `The Edit \| AI Tools for Charity, Cultural & Heritage Comms` |
| `index.html:32` (og:title) | same as above | **CHANGE** | same proposed string |
| `index.html:33` (twitter:title) | same as above | **CHANGE** | same proposed string |
| `src/pages/Index.tsx:59` | same as above | **CHANGE** | same proposed string |
| `src/pages/Index.tsx:148` | "An opinionated directory of AI tools for communications teams in charities, cultural organisations and heritage." | **CHANGE**, first sentence only | **PROPOSED:** "An opinionated directory of AI tools for comms teams in this sector: charities, cultural organisations, heritage." Rest of the paragraph unchanged. |

**Why the title change is the single most valuable item here.** Those four
strings are the SERP title, the og:title and the twitter:title. They are the
most-shared strings the site owns, and they drop "heritage" entirely. The one
reader who self-identifies *only* through that word, the cathedral or archive
comms manager who says "I work in heritage", is the one reader the title
excludes. She never clicks, so nothing on the page gets the chance to catch
her. Verified: the proposed string is **58 characters**, inside the roughly
60-character SERP limit, against 54 today.

It compounds with a structural fact about this stack, which I verified in
`vercel.json`: the SPA catch-all rewrites `/(.*)` to `/index.html`, and
`react-helmet-async` injects per-page meta at runtime. Answer engines and
social scrapers do not run JavaScript, so for them **`index.html` is the
entire site on every route**. Its title and description are the only audience
statement Perplexity, ChatGPT search or a link preview will ever read. That
makes `index.html` simultaneously the worst place to shorten the phrase and
the best place to fix the missing noun.

**Why the intro changes shape rather than being cut.** The homepage currently
says a near-identical self-defining sentence twice within two sections:
`Index.tsx:148` and then `AboutPanel.tsx:31` at `Index.tsx:191`, followed by
the footer making three. That is where precision tips into a site reassuring
itself. The two agents disagreed on which to change: the stranger proposed
cutting the About panel's clause, the copywriter ruled the About panel
canonical because copy pack four keys the JSON-LD to it, and pre-committed to
changing its mind "if a site-stranger pass reports the homepage as reciting
itself". That pass has now reported exactly that, so the tripwire has fired,
and the copywriter's own instruction on which one to vary applies: vary the
intro, never the About panel. The proposed string keeps all three nouns and
only changes the shape, so identification above the fold is not delayed.

### Keep, no change

| Location | Layer | Why |
|---|---|---|
| `index.html:7`, `:34`, `:35` | description, og, twitter | The only crawlable prose for non-JS engines. Never shorten. |
| `vite.config.ts:27` | PWA manifest description | Mirrors `index.html:7`, correctly. |
| `src/pages/Index.tsx:60` | description | Full triple, consistent. |
| `src/pages/Index.tsx:69` | JSON-LD | Keyed to the About panel by copy pack four. Matches. |
| `src/components/AboutPanel.tsx:31` | visible | Ruled canonical premise; anchors the JSON-LD. A "What this is" block that does not say who it is for fails its own heading. |
| `src/pages/Tools.tsx:283` | description | Full triple. Head noun varies ("communications") and reads naturally. |
| `src/pages/Tools.tsx:249` | visible | Names who the *document* was written for, a fact about the template, not audience restatement. The repetition finding is a homepage finding and does not reach this card. |
| `src/pages/Tools.tsx:282` | title | `/tools` is the only title carrying "Heritage". All three nouns will not fit: measured at **68 characters**, over the limit. Leave it. |
| `src/pages/Learning.tsx:37` | description | Its only audience signal; the title carries none. |
| `src/pages/DesignKit.tsx:361` | description | Same, and approved five days ago. |
| `src/pages/PolicyTemplate.tsx:9` | description | "Organisations" is right: a policy binds the organisation, not the comms team. |
| `src/pages/PolicyTemplate.tsx:47` | visible | Same logic, and it corrects any reader the title excluded. |
| `src/components/FooterEmailCapture.tsx:35` | visible | Sitewide footer is the only audience naming on `/ai-news`, `/my-stack`, `/learning`, `/design-kit` and the legal pages. See the flag in section 5. |
| `public/AI-Use-Policy-Template.docx` cover | artefact | Travels without the site's context, so it must name the full audience. |
| `src/pages/Subscribe.tsx:9, :37, :72` | dead | Renders nowhere. Not a copy question; the dead-code sweep removes them. |

### Keep as a judgement call, with a tripwire

| Location | Current | Why it stays |
|---|---|---|
| `src/pages/PolicyTemplate.tsx:8` | `AI-Use Policy Template for Charities \| The Edit` | Exact match on "AI policy template for charities", the highest-intent query the site has. Both the description at `:9` and the on-page intro at `:47` carry the full triple, so a non-charity reader is corrected within one glance of landing. **This is a trade, not an improvement.** Tripwire: if Search Console shows heritage or museum-flavoured queries reaching this page with impressions and no clicks, change it. Held ready, not recommended now: `AI-Use Policy Template for Charity & Heritage Teams \| The Edit` (59 chars). |
| `vite.config.ts:24` | `The Edit: AI Tools for Charity Comms` | Manifest names need brevity and the installer already knows the site. Flagged only because it is the second place "charity" stands alone, and it uses a colon where every title uses a pipe. Cosmetic; not worth a deploy on its own, worth aligning next time the file is opened. |

---

## 3. Headings

**No H1 or H2 should carry the full three-part phrase, and none does.** The
design system's H1s are single-word display type at up to 560px ("The Edit.",
"Tools", "Learning"); a three-noun audience clause cannot live there, and
turning positioning into signage would be the wrong fix. The audience's
correct homes are the first body sentence and the title tag, and after the
change in section 2 it is properly in both.

One exception is worth your ruling, because it is the only H1 on the site that
is already a sentence rather than a label:

- `src/pages/PolicyTemplate.tsx:17`, currently "The AI-use policy template".
  **PROPOSED:** "The AI-use policy template for charities". Every H1 on the
  site is a bare label and H1s are among the strongest on-page signals; this
  is the one page where an audience term fits the existing typographic
  treatment. It carries the same non-charity exclusion cost as the title
  above, so if you keep the title as it stands, this is consistent with it. If
  you ever change the title to the heritage variant, change this in the same
  pass or they will disagree.

A cheaper alternative that touches no heading: the `CobaltZone` subheadings
and `bodyText` are rendered, crawlable and non-heading, and currently carry no
audience term on `/tools` or `/learning`. That is where an audience phrase
could be added as approved copy without going near the display type.

---

## 4. What it costs

**The title change (recommended).** Costs four characters of budget and
nothing else. It does mean the homepage title and the `/tools` title no longer
divide the nouns between them, which the copywriter read as deliberate
complementary keyword coverage. I have overruled that, because a reader sees
one title, not both: coverage that only works when you read the whole site is
not coverage. Low risk, and reversible in one commit.

**The intro reshape (recommended).** Costs nothing measurable. The risk is
purely editorial: a colon list reads differently from a flowing sentence, and
you may simply not like it. It is a judgement call on rhythm, not an
improvement I can prove, and the current sentence is approved copy from pack
four. If you prefer the current shape, the alternative is to accept the
homepage repetition, which is tolerable rather than broken.

**Not shortening the phrase (recommended).** Costs the crowded head term. "AI
tools for charities" is contested by established sector publishers with years
of authority and a small directory on new positioning will not displace them
at launch. Keeping the full phrase means competing on the long tail instead,
where the site has something close to open ground. This is the trade the
positioning statement already made, and the copy should not quietly unmake it.

**Keeping "for Charities" on the policy template title (judgement call).**
Costs identification with the local-authority museum service and the
university gallery, the exact non-charity institutions the brief names, at the
moment of highest intent. Marked as a trade, with the tripwire above.

**One thing none of this fixes.** Six of ten meta descriptions still exceed
the roughly 155 to 160 character snippet limit and lose their tails:
`index.html:7/:34/:35` at 177 characters truncating "No sponsored lists.",
`Index.tsx:60` at 193 truncating "already done. No sponsored lists.",
`Tools.tsx:283` at 175, `DesignKit.tsx:361` at 168. The audience phrase is not
the right thing to cut to fix that, but something is: "No sponsored lists" is
the site's scarcest claim and it is currently invisible in search on the
homepage. **That is a separate copy job and I am not proposing strings for it
here**, because trimming those descriptions well means rewriting sentences,
which is authoring rather than reviewing.

---

## 5. Found, and not asked about

1. **The title layer has never been ruled.** Copy pack four says "title
   unchanged" three times, which grandfathered three mutually different
   audience compressions plus the manifest's fourth without anyone choosing
   them. They should be chosen, not inherited. One line in the next pack
   closes it.
2. **`vite.config.ts` is outside every copy inventory** including this brief's,
   yet it ships two visitor-facing strings. Worth a line in `.claude/CLAUDE.md`
   so the next audit greps it.
3. **The two phrasings are grammar, not drift, and the rule should be written
   down.** Phrasing B is the nominal form and belongs where the audience is the
   object of the sentence. Phrasing A is the adjectival form and belongs where
   the triple modifies a noun. You cannot write "charities, cultural
   organisations and heritage teams"; the compression is forced. Both were
   approved on the same day, which suggests the split was managed rather than
   accidental, but nothing states it, so it reads as inconsistency to every
   fresh pair of eyes. Proposed rule for the voice block: *the audience takes
   the nominal form when it is the object of the sentence, and the adjectival
   form only when modifying a noun.*
4. **The footer's "Free for" reads as an eligibility gate.**
   `FooterEmailCapture.tsx:35` says "Free for charity, cultural and heritage
   comms teams", which implies others pay. The template is free to anyone; the
   phrase is describing who it was written for. This is a genuine ambiguity
   rather than a style preference. Raised as a copy request, not drafted:
   the fix is one preposition and it is yours to choose.
5. **The non-charity readers are named by the list and then un-named by the
   vocabulary around it.** "Whether there's a charity price"
   (`AboutPanel.tsx:31`), "what you tell trustees, funders and supporters"
   (`PolicyTemplate.tsx:47`), "the questions your trustees will ask"
   (`FooterEmailCapture.tsx:35`). A local authority museum service has no
   trustees, no supporters and no charity price. The phrase invites her in and
   the next three sentences are not about her. This is the deepest finding in
   the review and it is not solvable by editing the audience phrase at all.
   It is also in tension with the site's spine vocabulary, since `trustee_note`
   is a locked axis field. Flagged for a decision, not fixed.
6. **`/my-stack`, `/ai-news` and `/submit` carry no audience term in title or
   description.** Correct for `/submit` and `/ai-news`. Worth a glance for
   `/my-stack`, which is proof-of-practice content a sector buyer might land on.

---

## Separated, per the brief: the audience definition itself

**No challenge from any of the three agents, and none from me.** The
definition catches all four test readers, which is what a three-part phrase
has to do to justify its length. Cutting to "charity" loses the local
authority museum service and the university gallery as a matter of fact, since
they are not charities, and the cathedral or archive as a matter of identity.
The lock is right. Everything above is about expression and frequency, exactly
as instructed.

---

## If you approve, the work is

Four strings in three files for the title change (`index.html:6, :32, :33`,
`src/pages/Index.tsx:59`), one sentence in one file for the intro
(`src/pages/Index.tsx:148`), and optionally one H1
(`src/pages/PolicyTemplate.tsx:17`). One commit, no logic, no dependencies.
Everything else in this document is either "keep" or a flag for a later
decision.
