# llms.txt — structure draft, awaiting copy

Built 31 August 2026 on Jasmin's ruling: I draft the structure, every
visitor-facing sentence is hers.

**This file is deliberately NOT in `public/`.** An `llms.txt` containing
`[YOUR COPY]` placeholders would be read verbatim by the answer engines it
exists to inform, which is worse than having no file. It ships by moving the
fenced block below to `public/llms.txt` once the placeholders are filled.

## What I checked so you do not have to

**No route wiring is needed.** Vercel serves files in `public/` before applying
the `vercel.json` catch-all, confirmed on production: `/robots.txt` returns 200
`text/plain` at 532 bytes and `/sitemap.xml` returns 200 `application/xml` at
1,158 bytes, both real files despite the rewrite of `/(.*)` to `/index.html`.
So `public/llms.txt` will serve as `text/plain` with no config change. The
current `/llms.txt` returns the 3,071-byte SPA shell, which is this project's
fingerprint for "no such file".

**Convention.** `llms.txt` is markdown: an H1 name, a blockquote one-liner,
optional prose, then H2 sections of links with short descriptions. Answer
engines read it as a map of the site written by its owner rather than inferred.

## What is already filled in, and why

Everything below that is **not** a placeholder is either a locked schema fact or
a route, not copy:

- the seven axis field names and their allowed values, from
  `reports/2026-08-23-axis-locked.md` as amended 2026-08-25
- the eight `jobs` values, `Research` first as the 2026-08-25 amendment requires
- the live routes, cross-checked against `App.tsx` in both directions
- the three DPIA flag values

I have deliberately **not** assembled your existing approved strings into new
prose. `AboutPanel.tsx:108`, `PolicyTemplate.tsx:46` and
`reports/2026-08-28-positioning-statement.md` all carry sentences that would fit
the placeholders, but choosing and joining them is composing, which is yours.
Paste what you want where the brackets are.

---

```markdown
# The Edit

> [ONE LINE: what The Edit is and who it is for. This is the single sentence an
> answer engine is most likely to quote. The three-part audience phrase in its
> nominal form — "charities, cultural organisations and heritage" — belongs
> here, and per the 29 Aug ruling must not be shortened to "charity" alone.]

[ONE SHORT PARAGRAPH: what the site does and what makes it different. The
"been through the checks" claim is the ruled wording — never "passed". Worth
stating plainly that there are no sponsored listings and no affiliate links,
since that is the scarcest thing about the directory and the thing most likely
to be lost to snippet truncation elsewhere.]

Built and maintained by Jasmin Aziz (https://jasminaziz.co.uk).

## How tools are judged

Every tool is assessed on seven fields before it appears. A row that is missing
any of them does not render.

- **jobs** — one or more of: Research, Appeals & fundraising, Case studies &
  storytelling, Social, Internal comms, Accessibility, Translation
- **data_location** — UK, EU, EU option, US, Your tenant, Other, or Unclear
- **trains_on_input** — No, No by default, Yes unless you opt out, Yes, Varies
  by tier, or Unclear
- **nonprofit_tier** — the nonprofit or charity pricing, or None where its
  absence has been confirmed rather than left unchecked
- **dpia_flag** — Green, Amber or Red: how likely typical comms use is to
  trigger a Data Protection Impact Assessment
- **trustee_note** — one sentence a comms lead can say to their board
- **last_checked** — the date the factual fields above were last verified

[OPTIONAL, ONE OR TWO SENTENCES: why these seven and not others. The
"questions this sector has to answer before adopting anything" framing is
already live at AboutPanel.tsx:108 if you want it.]

A DPIA is an assessment an organisation carries out, not something a tool
needs. The flag describes how likely typical comms use is to trigger one.

## Pages

- [The directory](https://theeditai.co.uk/tools): [ONE LINE]
- [AI-use policy template](https://theeditai.co.uk/policy-template): [ONE LINE.
  Free, no email required, downloads as .docx.]
- [My stack](https://theeditai.co.uk/my-stack): [ONE LINE]
- [Design kit](https://theeditai.co.uk/design-kit): [ONE LINE]
- [Learning](https://theeditai.co.uk/learning): [ONE LINE]
- [AI news](https://theeditai.co.uk/ai-news): [ONE LINE]
- [Submit a tool](https://theeditai.co.uk/submit): [ONE LINE]

## About

- [Jasmin Aziz](https://jasminaziz.co.uk): [ONE LINE on the consultancy]
- [Substack](https://jasminaziz.substack.com): [ONE LINE]
```

---

## Decisions worth taking before this ships

1. **Does it list the tools themselves?** It could name the 23 rendering rows
   with their DPIA flag, which is the most quotable thing on the site. Against:
   it duplicates `/tools`, goes stale the moment the Sheet changes, and this
   file is hand-maintained. The `lastmod` reasoning from `sitemap.xml` applies —
   a hand-maintained field goes stale and then lies. My recommendation is to
   leave the tools out and let `/tools` be the source, which is also the
   argument for doing `ItemList` structured data instead. You did not select
   `ItemList`, so at present neither exists.
2. **Does it name the failures?** The positioning statement calls the published
   failures the site's scarcest asset. An answer engine describing The Edit as
   "a directory that also says which tools not to use" is a stronger
   description than a neutral one. That is a positioning call, not a copy one.
3. **Nothing here is verified against an answer engine.** Adoption of
   `llms.txt` is uneven and no major engine has committed to it publicly. This
   is cheap and low-risk rather than known-effective, and should be described
   that way rather than as a fix.
