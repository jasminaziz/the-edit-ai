# The Edit homepage, first-viewport baseline (before the site map build)

Written 13 September 2026. This is a baseline only. It judges what is on the
homepage today, at two widths, against the reader profile in
`reports/2026-08-28-positioning-statement.md` ("Who it's for", revised 13
September 2026). It proposes nothing. It exists so step 4 (the homepage
rebuild) has a "before" to be measured against, in the absence of analytics.

**Method.** No live fetch was made (the site is client-rendered and an
unrendered fetch would return an empty `<div id="root">`, proving nothing).
Judged from two screenshots taken by this session on 13 September 2026 from
production, cold load, empty browser profile, fonts loaded, physics pills
settled, and `scratchpad/step0/measurements.json`, which lists every text
node visible in the first viewport with its y position, plus everything
below the fold with its document y. Every claim below is cited against one
of those two sources. Where a claim cannot be settled from a still image, it
is named as such rather than assumed.

**The reader, briefly, for reference against every answer below.** A comms
officer or manager in a charity, cultural organisation or heritage body,
often a team of one. She uses ChatGPT now and then, has never read a
model's terms, has heard DPIA in a meeting and did not ask. She is not
shopping for AI tools, she is short of time. The profile states plainly
that the first screen belongs to the least confident version of her, and
that the whole profile is assumption because no behavioural data exists
yet. That is the lens applied throughout.

---

## Mobile, 390x844

Confirmed settled: `rafIn500ms` 31 (animation was running, not frozen),
`finalDrift` 0 across 7 settle rounds. Hero height measured at 500px. Page
length 2,139px.

### 1. The five-second test, first viewport only

**What is this.** Not answered until y=605, where the paragraph beginning
"The Edit is my opinionated directory of AI tools for comms teams in
charities, cultural organisations and heritage" appears. That sentence sits
inside the 844px viewport (measurements.json, `visible[20]`), so on a strict
reading it is present without scrolling. But it is the fifth thing on the
page, reached only after a hamburger menu, a two-line display wordmark with
no descriptor, a "Drag me" chevron, and sixteen unlabelled brand pills
(screenshot, `home-first-viewport-390.png`). It arrives as the opening
sentence of a body paragraph under a two-sentence heading, not as a headline
or a label near the top. A
glance rather than a read would very plausibly stop at "This helps." (y=552)
before reaching it.

**Who it's for.** Same sentence, same caveat. The audience is named
("charities, cultural organisations and heritage") but only at y=605,
after four other elements.

**What can I do here.** Nothing actionable sits above y=844 other than
the unopened "Menu" (y=21, contents unknown, see manual checks) and "Drag
me" (y=275), which is a play interaction, not a task. There is no visible
button or link with a destination in the first viewport. "Browse tools →"
is at y=1758, "Get the template →" at y=1969, both roughly a thousand
pixels below the fold (measurements.json, `below`).

**Verdict on the five-second test at 390:** fails two of three. The
audience line is technically inside the viewport but is buried and unstyled
as a value proposition. There is no next step at all in the first screen.

### 2. What she meets, in order, and what each thing tells her

1. **"Menu"** (y=21). Tells her more navigation exists somewhere. Contents
   unknown from a still image (manual check).
2. **Wordmark "The Edit."** (y=29 / y=100). A name in large cobalt display
   type. Tells her nothing about subject or audience. No tagline sits next
   to it.
3. **"Drag me" and a chevron** (y=275). An invitation to interact with
   something below. States no purpose.
4. **Sixteen pills** (y=340–478): ChatGPT, Adobe Suite / Firefly, Canva,
   Notion, Perplexity, Supabase, Vercel, GitHub, Gemini, Lovable, Resend,
   Granola, Claude, Plausible, Google AI Studio, Gemini Notebook. Per this
   task's own framing, these are pulled from Jasmin's own stack (`my_stack`),
   not the checked directory the site is built to sell, but nothing on
   screen tells a visitor that distinction. Consumer AI tools (ChatGPT,
   Canva, Gemini) sit in the same unlabelled pile as build-and-hosting
   infrastructure (Vercel, GitHub, Supabase), with no category, no
   explanation, and no link visible from a static capture.
5. **"There's a lot to keep up with in AI. This helps."** (y=520 / y=552).
   States a problem-and-solution shape but "this" is undefined at this
   point. Could describe any AI content product.
6. **The sector sentence** (y=605, cut off by the fold partway through the
   list of questions it poses). The first and only thing in the first
   viewport that names the audience and the offer in concrete terms.

### 3. Sector fit and the checks claim, first viewport only

Sector fit: **yes**, present within the viewport, at y=605
(measurements.json, `firstY.charity` / `firstY.heritage` both 605, which is
under 844).

Checks claim: **no**. `firstY.checks` is 866, which is 22px past the 844px
fold. The word "DPIA" does not appear on the homepage at all at this width
(`firstY.dpia`: null).

### 4. Is there a route onward from the first screen

No. The only interactive elements at y<844 are the unopened menu and the
"Drag me" toy. Neither leads anywhere a stranger could point to. The
first genuine link ("Browse tools →") is 914px further down the page than
the fold.

### 5. What a nervous reader makes of the pills and "Drag me"

The profile describes someone who is "not frightened of the tools, she is
frightened of using one wrong." A pile of unlabelled brand names she is
invited to drag around, several of which she will not recognise (Supabase,
Vercel, GitHub, Plausible, Resend are developer and analytics
infrastructure, not comms tools), gives her no reason to conclude the site
has vetted anything for her. Read cold, it can as easily signal "this is a
developer's website" as "this is a directory of tools for me." Nothing
labels the pills as the site owner's own stack, a curated set, or a
directory at all. Whether the pills are clickable or link anywhere cannot
be told from a still image (manual check).

### 6. Most likely to make her leave, most likely to make her stay

**Most likely to leave.** The four things she meets before the one
sentence that speaks to her sector (menu, wordmark, drag-toy, sixteen
unlabelled tool logos including ones she won't recognise) give her nothing
to act on, and even once she reaches the sentence that does name her, there
is no next step anywhere on the screen. A time-poor reader who is not
shopping for tools has no reason yet to keep going.

**Most likely to stay.** If she reads as far as y=605, the sentence is a
precise match to her situation, naming her sector exactly and echoing her
stated worry almost word for word ("whether you could explain it to your
board in one sentence").

**Verdict, mobile.** By the profile's own bar (a nervous reader should not
have to dig), the first screen at 390 fails. The sector match exists but is
buried behind decoration, and there is no way to act on it without
scrolling roughly 900px further.

---

## Desktop, 1280x800

Confirmed settled: `rafIn500ms` 31, `finalDrift` 1px (rounding), 25 settle
rounds. Hero height measured at 800px, the entire first viewport. Page
length 1,834px.

### 1. The five-second test, first viewport only

**What is this.** Not stated anywhere in the first viewport. The nav bar
(Home, Tools, Design, Learning, AI News, My Stack, "Get the template →",
"Work with me") names sections but not a subject. The wordmark "The Edit."
carries no descriptor. It fills almost the whole screen, and both words are
whole in the screenshot (`home-first-viewport-1280.png`). The y=-16 in the
measurements is the top of the text's line box at a very large size, not the
top of the letters. The sector sentence sits at y=842, 42px past the 800px fold
(measurements.json, `firstY.charity` / `firstY.heritage`).

**Who it's for.** Not stated in the first viewport, for the same reason.

**What can I do here.** Yes, unlike mobile there are real, clickable
destinations visible at y=23: Home, Tools, Design, Learning, AI News, My
Stack, "Get the template →", "Work with me". But she would be choosing
between them with no idea yet what any of them contains, since nothing on
the visible screen has told her what the site is or that it applies to her
work.

**Verdict on the five-second test at 1280:** fails two of three (what is
this, who is for) and only partially passes the third, since the "clear
thing to do" is six unexplained nav items plus two CTAs rather than one
obvious next step tied to a stated offer.

### 2. What she meets, in order, and what each thing tells her

1. **Nav bar** (y=23, one row): Home, Tools, Design, Learning, AI News, My
   Stack, "Get the template →", "Work with me". Names site sections and
   one specific promise ("the template") with no context yet for what the
   template is or why she'd want it.
2. **Wordmark "The Edit."** (y=-16 to roughly 700s, oversized enough to run
   off the top of the viewport). Brand name only.
3. **"Drag me"** (y=693), right-aligned near the pills.
4. **Nineteen pills** (y=658–773): the same sixteen as mobile, plus
   Microsoft Copilot, Google Workspace AI, and Wispr Flow. Same lack of
   labelling as mobile, at a larger count.

Nothing else is in the first viewport at this width. The About heading,
the sector sentence, the checks sentence and "I'm Jasmin" all sit below
y=800.

### 3. Sector fit and the checks claim, first viewport only

Sector fit: **no**. `firstY.charity` / `firstY.heritage` are both 842,
below the 800px fold.

Checks claim: **no**. `firstY.checks` is 994, well below the fold. "DPIA"
does not appear at this width either (`firstY.dpia`: null).

This confirms, at this width specifically, the claim in
`reports/2026-09-13-sitemap-proposal-judgement.md` that "today the sector
and the checks first appear below the fold." At 390 that is only true of
the checks sentence. The sector sentence is inside the viewport there. The
two widths should not be quoted interchangeably.

### 4. Is there a route onward from the first screen

Yes, in the narrow sense that clickable nav items and two CTAs are visible
without scrolling. Whether it is a route she would actually take is a
different question. She would be clicking on section names and a template
offer with no stated context, which is a blind choice rather than a next
step that follows from something she has just been told.

### 5. What a nervous reader makes of the pills and "Drag me"

Same observation as mobile, at greater density. There are nineteen unlabelled brand
pills including developer and analytics infrastructure (Vercel, GitHub,
Supabase, Plausible, Resend) alongside consumer AI tools, no legend, no
stated relationship to "the checks" the site's own name for its process.
Larger scale does not add explanation. Whether hovering or clicking a pill
does anything cannot be told from a still image (manual check).

### 6. Most likely to make her leave, most likely to make her stay

**Most likely to leave.** Neither the subject nor the audience is stated
anywhere on the visible screen. A nav bar full of unexplained section
names and an oversized wordmark ask her to either click blind or
scroll before she learns anything about whether this is for her.

**Most likely to stay.** The nav gives her low-risk options to click
without reading further (Tools, My Stack), and the visual confidence of
the page (bold type, an interactive toy) may read as credible enough to
prompt a scroll. This is a plausible read, not a measured one. Whether it
holds cannot be told from a still image.

**Verdict, desktop.** Fails the profile's bar on the same two questions as
mobile. It offers more clickable surface area than mobile does, but every
one of those clicks is made without the visitor yet knowing what she would
be clicking into.

---

## What could not be told from a still image

Named rather than assumed, per the brief:

- **The mobile menu drawer's contents.** "Menu" is visible and unopened at
  390, the only width where it appears. What it lists, and whether it repeats
  or extends what the desktop nav shows, is unknown from these captures.
- **Whether the pills are clickable, hoverable, or link anywhere.** No
  cursor state, click target, or destination can be read from a static
  screenshot.
- **Any state that depends on interaction with "Drag me".** The chevron and
  label are visible. What happens on drag, beyond the pills already being
  in a settled post-drop position, is not shown.
- **Scroll behaviour and reveal animation.** The measurements confirm no
  element in the captured viewports is held at reduced opacity by a reveal
  animation at rest, but what a visitor sees while scrolling, rather than
  at the two fixed scroll-zero states captured, is not evidence here.
- **Real device rendering.** Both captures are emulated viewports (390x844
  and 1280x800). A pass on an actual phone and an actual desktop browser
  would be needed to confirm nothing here is an emulation artefact.

---

## Facts for step 4 to be measured against

- Hero height: 500px at 390, 800px (full first viewport) at 1280.
- Page length: 2,139px at 390, 1,834px at 1280.
- Pill count: 16 settled at 390, 19 settled at 1280.
- First appearance of sector wording ("charity"/"heritage"): y=605 at 390
  (inside the 844px viewport), y=842 at 1280 (42px below the 800px
  viewport).
- First appearance of "checks": y=866 at 390 (22px below fold), y=994 at
  1280 (194px below fold).
- "DPIA" appears nowhere on the homepage at either width.
- No CTA or link with a stated destination exists inside the first
  viewport at 390. Six nav items plus two CTAs exist inside the first
  viewport at 1280, none tied to a stated offer within that same viewport.
- Page `<title>` is "The Edit | AI Tools for Charity, Cultural & Heritage
  Comms" (measurements.json, `title`). This states subject and audience
  clearly, but it renders in the browser tab and in search results, not on
  the page itself, so it does not reach a visitor who has already landed.

---

## Note from the main session, 13 September 2026

**Where the captures live.** The scratchpad paths above were session-only.
The two screenshots and the measurements are kept at
`~/Developer/the-edit-ai/.superpowers/site-map-boards/cap/` as
`baseline-2026-09-13-home-390.png`, `baseline-2026-09-13-home-1280.png` and
`baseline-2026-09-13-measurements.json`, with the script that took them beside
the folder as `baseline-capture.mjs`. That folder is git-ignored and local to
this Mac. Step 4 should re-run the same script against its own build so the
before and after are taken the same way.

**Corrected before commit.** Two claims in the agent's draft were checked
against the captures and were wrong. It said the wordmark was cropped at the
top at 1280. The screenshot shows both words whole, and the y=-16 it cited is
the text's line box, not the letters. And it said a phone reader must scroll
roughly 1,100px to act, where "Browse tools →" at y=1758 comes into view after
about 900px, which its own section 4 already said. Both are fixed above. The
title's em dash and four mid-sentence colons and semicolons were also
rewritten. Every other figure was re-checked against the measurements and
stands, including "Get the template →" at y=1969 on the phone.
