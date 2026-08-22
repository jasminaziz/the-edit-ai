# Copy pack addendum — C4 and B4b strings, plus the B6 decision

**Approved by Jasmin, 22 August 2026 (Cowork session).** These are exact
strings. Code sessions place them verbatim: no rewording, no added
punctuation, no em dashes introduced anywhere.

---

## B4(b) — `/stack` meta

Place via the `SEO` component in `src/pages/Stack.tsx` (page currently
ships no meta at all). Canonical: `https://theeditai.co.uk/stack`.

**Title:**

```
Build Your AI Stack | The Edit
```

**Description:**

```
Pick the tools that fit your organisation and build your own AI stack. Every tool checked for data location, training policy and nonprofit pricing first.
```

## B4(b) — `/submit` meta

Place via the `SEO` component in `src/pages/Submit.tsx` (page currently
ships no meta at all). Canonical: `https://theeditai.co.uk/submit`.

**Title:**

```
Submit a Tool | The Edit
```

**Description:**

```
Suggest an AI tool for The Edit. Everything goes through the same checks: data, training policy, nonprofit pricing and the trustee test. No sponsored listings.
```

---

## C4(a) — in-grid template card

Rendered by the B3 ToolCard/filters session, after the first six tool
cards in the grid. Links to `/policy-template`. The CTA label must stay
identical to the nav and footer labels ("Get the template"), per
CLAUDE.md.

**Heading:**

```
The tools are the easy part
```

**Body:**

```
If your organisation doesn't have an AI-use policy yet, start there. Free, written for charity, cultural and heritage teams, and written to be adapted.
```

**CTA label:**

```
Get the template
```

## C4(b) — line under every Amber or Red DPIA flag

Rendered by the B3 session beneath the DPIA chip when the flag is Amber
or Red. The whole line links to `/policy-template`.

```
Not sure what your policy should say? Start with the template.
```

---

## B6 decision — Submit form

Decided by Jasmin, 22 August 2026: **keep the page, swap the form for an
email link.** No new infrastructure. The form currently discards every
submission (`handleSubmit` only flips state); it must not relaunch in
that state.

- Address: `hello@jasminaziz.co.uk`
- The page keeps its heading, subheading and layout. The form block is
  replaced with a link block inviting suggestions by email (the
  `FooterEmailCapture` link-block conversion from the placement session
  is the pattern to follow).
- Any visible copy for the replacement block beyond the strings above
  must come back to Jasmin before placement; do not improvise it.
