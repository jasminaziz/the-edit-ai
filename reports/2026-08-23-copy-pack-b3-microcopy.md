# Copy pack: B3 card and filter microcopy

**Approved by Jasmin, 23 August 2026 (Cowork session).** These are exact
strings. The B3 session places them verbatim: no rewording, no added
punctuation, no em dashes introduced anywhere, no improvised variants for
states not listed here.

Twelve strings. They did not exist before tonight, and their absence was
found while writing the locked axis spec: the copy pack and its addendum
carried the two C4 CTA strings and nothing else the card needs.

---

## DPIA chip labels

Rendered as the text label inside the DPIA chip, one per `dpia_flag` value.
The label carries the meaning rather than the colour word: relying on
"Green" only works for a reader who already knows the scheme, which lets
colour do the work by proxy, and the site carries AA contrast debt without
adding to it.

**`dpia_flag` = Green:**

```
DPIA unlikely
```

**`dpia_flag` = Amber:**

```
DPIA likely once personal data goes in
```

**`dpia_flag` = Red:**

```
Assume a DPIA before adopting
```

The Red string is phrased as something the organisation does, never as
something the tool needs. That distinction is the sector-precision rule in
CLAUDE.md and it is load-bearing with this audience.

## Card field labels

One per axis field rendered on the ToolCard. They echo the premise
paragraph's own language so the card and the About panel sound like one
voice.

| Field | Label |
|---|---|
| `data_location` | `Where your data sits` |
| `trains_on_input` | `Trains on your content` |
| `nonprofit_tier` | `Nonprofit pricing` |
| `trustee_note` | `Say this to a trustee` |
| `last_checked` | `Checked` |

`Checked` is a prefix, rendering as `Checked 23 Aug 2026` with the
`last_checked` value following it.

## Sector toggle labels

The three toggles above the grid. The first two are the audit's own wording.
The third matches the Green chip label exactly, so the filter and the card
use one vocabulary.

```
Has nonprofit pricing
```

```
Doesn't train on your content
```

```
DPIA unlikely
```

Pass rules for all three are frozen in `reports/2026-08-23-axis-locked.md`
and are not a matter for the code session to decide.

## Filter empty state

Rendered when an active filter or toggle combination matches no visible row.

```
Nothing matches that combination yet. The directory is deliberately small, and it grows as tools come through the checks.
```

---

*Approved 23 August 2026. Live until placed, then historical. The two C4
strings B3 also needs are in `reports/2026-08-22-copy-pack-addendum.md`.*
