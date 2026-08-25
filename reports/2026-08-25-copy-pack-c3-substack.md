# Copy pack: C3, the gated Substack post and welcome email

**DRAFT, 25 August 2026. NOT APPROVED. Revised after the governance review.** Written with Cowork Claude. Jasmin
rules on these at the final check before launch, together with the policy
template itself. Nothing here is an exact string yet. Once approved, this file
becomes the third approved copy pack alongside the addendum and the B3
microcopy.

C3 is Gate 2. Until the post and the welcome email exist and the flow has been
tested from a clean browser, the nav, the footer and `/policy-template` all
point at nothing.

---

## The finding that reshaped C3

`/policy-template` links `SUBSTACK_SUBSCRIBE_URL`, the subscribe page, not a
post. The placed copy reads "Subscribe and you'll get the link straight away."
So the thing that actually delivers the template is the Substack **welcome
email**, not the post. C3 is therefore two pieces of copy, not one. A welcome
email that is never configured fails silently: the site looks correct right up
until a real person subscribes.

## Decided: where the files live

**Option A.** Files attached to the gated post. Reader must be logged into
Substack to open it. Failure mode: subscribe on a phone, tap the link, not
logged in, hit a gate again, subscriber lost.

**Option B, recommended.** Both files at public URLs on theeditai.co.uk
(`public/`, served by Vercel), linked directly from the welcome email and also
from the post. The subscribe is the gate; the download is frictionless. Cost:
the file could be hotlinked and the gate skipped. Not new infrastructure, two
static files.

**DECIDED 25 August 2026: Option B.** Both files go to `public/` and serve from
the bare domain; the welcome email links them directly and the post carries the
same links so it still works as something shareable. The subscribe is the gate.
Accepted cost: the file could be hotlinked and the form skipped.

Code job that follows: place `AI-Use-Policy-Template.docx` and the exported PDF
in `public/`, confirm both serve from `https://theeditai.co.uk/...` on the bare
host, and put the resolved URLs back into this file before the copy is final.

---

## The post

**Title**

```
Your staff are already using AI. Here's the policy.
```

**Subtitle**

```
A free AI-use policy template for charity, cultural and heritage teams. Fill in the brackets, argue about section 7, take it to your board.
```

**Above the gate**

```
Somebody in your organisation put something into ChatGPT this week. Possibly a draft appeal. Possibly a supporter's complaint, pasted in whole so it could be reworded more gently.

You may not know which. That's the problem a policy solves. Not the using. The not knowing.

Most charities I work with are in the same position. AI is in the building, nobody decided to let it in, and the person who'd have to answer to the board about it hasn't been asked yet. When the question comes, it comes as three:

What are we using, and for what?
What happens to the information we put into it?
Who is accountable when something goes wrong?

A document that can answer those is a short one. Most AI policies I've read are not short, and they're written for organisations with a legal team, an IT department, and someone whose job includes reading them.

So I wrote one for the rest of us.

**What it is.** A working template. Fifteen short sections and two appendices you can print. Everything you have to decide sits in square brackets. It covers which tools staff can use and for what, what must never go into them, how to check a new tool before you adopt it, how to work out whether your use triggers a DPIA, who owns an AI-generated image and who it is allowed to depict, how anyone actually learns any of this, what you say to trustees and funders, and what to do when something goes wrong.

It also has a section on where AI does not belong. That's the part that matters most and the part I can't write for you. There's a starting list of eleven things in it. Your job is to argue with it.

**What it isn't.** It isn't legal advice, and it says so. It isn't a document you adopt unchanged. And it won't do much for you sitting in a shared drive nobody opens. A policy PDF in a folder is not governance. Governance is a named person, a gate, and a data rule. The template sets up all three. You still have to run them.

Expect two meetings and an afternoon.
```

**Gate sits here.**

**Below the gate**

```
**Download it**

Word, for filling in. PDF, for reading and forwarding.

[Word link]
[PDF link]

**Where to start**

Section 4. Name your AI lead. It doesn't need to be someone technical, it needs to be someone who'll keep a list and escalate what they can't answer. Everything else hangs off that one name.

Then section 7, with your team in the room. That's the argument worth having.

Then the rest, in whatever order suits you.

**If you get stuck**

The parts that need judgement are the ones you can't copy from anyone else: which tasks stay human, what triggers a DPIA in your organisation, and what you tell funders. If you're stuck on one of those, reply to this email and tell me where you've got to.

I also keep The Edit, a directory of AI tools checked for where the data sits, whether they train on what you type, whether there's a nonprofit tier, and whether typical use is likely to trigger a DPIA. Four of the questions in section 8, answered before you get to them.
```

---

## The welcome email

Substack sends one welcome email to every new subscriber whatever brought them
in, so the second paragraph carries readers who did not come for the template.

**Subject**

```
The AI-use policy template, and hello
```

**Body**

```
Here's the AI-use policy template: [Word] · [PDF]

Word file for filling in. PDF if you'd rather read it on your phone first.

If you subscribed for something else and this is news to you, it's a free template for charity, cultural and heritage teams who need an AI policy and don't have a legal department. Take it anyway.

Where to start. Section 4, name your AI lead. It doesn't need to be someone technical. Then take section 7, where AI does not belong, to your team and let them argue about it. That argument is what makes a policy real rather than filed.

If you get stuck on something the template can't decide for you, reply to this email and tell me where you've got to.

I'm Jasmin. I do strategic communications for charity, cultural and heritage organisations. I write here about AI, trust and doing communications work properly, and I keep The Edit, a directory of AI tools checked for where the data sits, whether they train on what you type, and whether there's a nonprofit tier.
```

---

## Notes on the drafts

- **No cadence promise anywhere**, deliberately. D3 is still open: the Substack
  publicly promises weekly and The Edit promises nothing.
- The post's opener assumes a charity reader from the first line. If the
  Substack list still skews to the old horizontal audience, that is a real
  risk worth weighing.
- "That's the problem a policy solves. Not the using. The not knowing." carries
  the whole argument. If it does not sound like Jasmin, it is the first
  sentence to rewrite.
- Voice checked: UK English, contractions, no em dashes.

## What is left on C3 after these are approved

1. Put both files in `public/` and confirm they serve from the bare domain.
   Resolve the two URLs and paste them into the drafts above, replacing
   `[Word]`, `[PDF]`, `[Word link]` and `[PDF link]`.
2. Publish the post, subscriber-only.
3. Configure the Substack welcome email. **This is the step that fails
   silently if skipped.**
4. Test the whole flow from a clean browser with a real address: site, gate,
   subscribe, template in hand. That test is Gate 2.


---

## Revisions after the governance sense-check, 25 August 2026

Three overclaim findings applied.

- "when your use is likely to trigger a DPIA" became "how to work out whether
  your use triggers a DPIA". The template states the legal test and gives
  bracketed triggers for the organisation to decide; it does not answer the
  question for the reader. This was the only real overclaim in the copy.
- "Every tool on it has been through the same questions this policy asks"
  named three checks and then claimed all of them. Now names four and says
  four.
- The contents list was under-claiming: it omitted images and rights, and
  training, which are the two newest sections and the two least likely to
  appear in any other free charity AI policy.

**Escalation, needs Jasmin.** The same DPIA overclaim sits in *approved copy
already placed on the branch*. `/policy-template` lists what the template
covers and includes "When a DPIA is needed." The template asks that question
rather than answering it, exactly as the post did. Changing a placed approved
string needs Jasmin's sign-off, so it is flagged rather than fixed. Suggested
replacement, unapproved: `How to work out whether a DPIA is needed.`
