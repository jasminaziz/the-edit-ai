# Gap check: Cowork task, Claude Code prompt, and what was actually built

1 September 2026. Written because the retirement recommendation was made
without diffing the Cowork task's prompt against the new setup. This is that
diff. It turns up two things worse than the retirement question.

Sources compared: the Cowork task's own prompt (the checks-engine spec, which
is what this session runs under), `reports/2026-08-31-axis-audit-claude-code-prompt.md`,
`scripts/sheet-write.mjs` as built, the 31 August audit report, and the
published Axis Audit artifact.

---

## Headline

The Cowork task is safe to repurpose. Almost nothing in it is lost, because
Code carried most of it across.

But **the Claude Code prompt is now wrong about the two most important things
in it**: the write boundary and the auth. Anyone pasting it today gets a
document that contradicts the code it drives. That is the urgent fix, not the
Cowork task.

---

## A. Stale in the Claude Code prompt. Fix before 14 September.

### A1. The write boundary is wrong, and it is the file's central rule
The prompt says: *"Never writable, by any route: A name, B category, C status,
E verdict, F url, G jobs, K dpia_flag, L trustee_note, N what_it_does"* and
*"On the tools tab only"*.

What `sheet-write.mjs` actually enforces:

```
tools:      A name, D cost, F url, H data_location,
            I trains_on_input, J nonprofit_tier, M last_checked
my_stack:   A name, E url
design_kit: A name, E url
learning:   I url
```

Four tabs, not one. A and F writable, not refused. That followed your 31
August ruling that a vendor renaming a product or moving a URL is a fact, not
a choice. The ruling is right and the code is right. The prompt was never
updated, so it now argues against the guard it is supposed to describe.

**Fix:** replace that block with the WRITABLE map above and the one-line test
the artifact uses: *writable when an external source determines the correct
value, refused when someone has to choose it.*

### A2. The auth section describes a route that is not the one in use
The prompt says plain ADC with the spreadsheets scope, credentials at
`~/.config/gcloud/application_default_credentials.json`.

What actually runs: gcloud **impersonation** of
`the-edit-audit@the-edit-490220.iam.gserviceaccount.com`, no key on disk,
project `the-edit-490220` rather than `jasmin-gws-cli`.

**Fix:** replace with the impersonation command from the artifact.

### A3. Column I still omits `Unclear`
The prompt lists five values. `schema.md` line 61 adds `Unclear`, added
25 August 2026 for "the vendor publishes no position at all". Two published
rows use it: Blotato row 5, Submagic row 47. The script refuses it, so a
legitimate write is blocked.

**Fix:** one word in the prompt and one entry in the script's legal set. This
is the ruling flagged as 1.5 in the 31 August report and it is still open.

### A4. Two of the three "decisions needed" are already made
`my_stack` writable columns are settled in code (A and E). The rulings file
exists. Only the 45-row ceiling question is genuinely open.

**Fix:** delete the two that are answered so the next reader does not
re-litigate them.

---

## B. In the Cowork prompt, absent from the Claude Code prompt

These are the genuine losses on retirement. Four matter, two do not.

### B1. The column D carve-out. This is a live risk.
Cowork spec: *write column D only when the change is a number or a currency
substituted inside the existing string shape. A change to the tier structure
itself, a plan renamed or a free tier withdrawn, gets flagged and not
written.*

The Claude Code prompt says nothing about this, and `sheet-write.mjs` allows
D unconditionally. So a vendor restructuring its pricing would have the new
shape written straight in, and the cost string carries editorial shape as
well as a number.

**Fix:** carry the carve-out into the prompt, and ideally into the script as a
warn-and-refuse when the new value's shape differs from the old (different
count of `/` separators, or a tier name changing).

### B2. Pricing conventions
Cowork spec: record the vendor's displayed currency verbatim, never convert;
show both figures where a headline price needs a year upfront, e.g.
`"$16/mo billed annually, $24 monthly"`.

Absent from the Claude Code prompt. It is in your `pricing-conventions`
memory but nothing in the run reads that.

**Fix:** two lines into the prompt.

### B3. The escalation table, and specifically the Green-row rule
The Claude Code prompt has Pass 3 and the two toggle consequences. It does not
have the five fact-movement mappings, and the one most worth keeping is:

> Any fact change at all on a Green row escalates `dpia_flag` and
> `trustee_note`, always.

Green rows are the ones a reader takes to a board without checking behind
them. One row is Green today, so the cost of the rule is near zero and the
cost of losing it is the whole point of the audit.

**Fix:** paste the escalation table into Pass 3.

### B4. "Any source unreachable on two consecutive runs"
Cowork spec surfaces this. Nothing in the Claude Code setup has run-to-run
memory, so it cannot.

**It has already fired and nobody noticed.** Adobe rows 28 and 29 were
unreachable on 30 August and unreachable again on 31 August. That is two
consecutive runs, and the rule exists precisely because once is a blip and
twice is a vendor that moved something. Both rows sit inside "Doesn't train on
your content", the site's strongest claim.

**Fix:** the diff file already persists per run. Have Pass 1 read the previous
`*-axis-diff.json` and the previous audit report's "Could not check" section,
and escalate anything failing twice.

### B5. Drop order under time pressure. Minor.
Cowork spec: if the run is going long, drop Amber and Red rows checked within
90 days first; never drop a Green row, never drop a row whose URL failed. Not
encoded anywhere. Harmless while the triggered set is one to four rows, live
again from 22 November when the whole cohort comes due.

### B6. "Became completable". Already covered, by accident.
The Claude Code prompt does not name it, but says to match the section order
of the 30 August report, which has it, so the 31 August report carried it as
section 4. That works until someone uses a newer report as the template.

**Fix:** name it explicitly rather than inheriting it.

---

## C. Reflecting Code's recommendations

**Agreed:** `.claude/CLAUDE.md:786` still lists "the fortnightly Cowork task is
rebuilt as the checks engine" as planned work. Stale, and it would send a
future session rebuilding something that exists. Fix it.

**Agreed:** leave the daily `whats_new` Routine alone.

**Correction:** Code says to leave the monthly discovery job alone as
"genuinely different work". It is different work, but **it is not a task**. It
is a prompt block inside
`reports/2026-08-31-axis-audit-claude-code-prompt.md` and nothing runs it.
Same trap as the audit itself: documented as though scheduled, with no
mechanism. Either give it a schedule or stop describing it as a job.

**Agreed and sharpened:** Code's point that the Cowork task's judgement is
calibrated to the pre-repositioning directory is right, and it is an argument
for replacing its prompt rather than keeping it running.

---

## D. Revised recommendation on the Cowork task

Unchanged in direction, better grounded now: **keep the task, keep the
schedule, replace the prompt with a reminder.** It is the only mechanism in
the whole setup that fires on time, and the artifact names "nothing tells you
it is due" as the weakest link.

The reminder cannot carry B1 to B4. Those belong in the Claude Code prompt and
that is where they should go.

---

## E. Order of work

1. **Fix A1 and A2 in the Claude Code prompt.** It is wrong about the write
   boundary and the auth. Ten minutes, and it stops the next run arguing with
   its own guard.
2. **Rule on `Unclear` (A3).** One word, unblocks a refused write.
3. **Carry B1, B2, B3 into the prompt.** The D carve-out is the one with a
   live risk attached.
4. **Add B4's two-consecutive-runs check**, and treat Adobe 28 and 29 as
   already qualifying.
5. **Fix `tools!L40`.** The card says Gemini Notebook, the trustee note still
   says NotebookLM, and that is wrong on the live site right now.
6. **Rewrite the Cowork task prompt** as the reminder.
7. **Fix `CLAUDE.md:786`.**
8. **Close the four open rulings** in `axis-rulings.md` before they
   regenerate on 14 September.
