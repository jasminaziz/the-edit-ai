# A4 re-check: Google Workspace AI

**25 August 2026.** Triggered by the row reading `Unclear` on data location while
its behaviour looked like the `Your tenant` pattern that made Copilot Green.

## Finding: `data_location` was wrong and should read `Your tenant`

Google's Generative AI in Google Workspace Privacy Hub states, verbatim:

- "Your interactions with Gemini stay within your organization. Gemini does not
  share your content outside your organization without your permission."
- "User prompts are considered customer data under the Cloud Data Processing
  Addendum. Workspace does not use customer data for training models without
  customer's prior permission or instruction."
- "Your existing Google Workspace protections are automatically applied."

The axis defines `Your tenant` as a tool running inside infrastructure the
organisation already controls, under terms it already accepted. Gemini in
Workspace matches that exactly: the organisation already holds Workspace, the
prompts are customer data under the CDPA it has already signed, and the
interactions stay inside the organisation.

`Unclear` was a false negative on the axis the whole site is built on, in the
opposite direction to the unsourced `EU` found on Adobe the same day.

**Proposed value: `Your tenant`.** `trains_on_input` stays `No`, which the same
source confirms.

## Open verification item

Google's Workspace-with-Gemini business FAQ says nothing about Google Search
grounding, public web access, or whether any such feature is covered by the
CDPA. Microsoft documents the equivalent exception for Copilot plainly, which is
what took Copilot to Amber under amendment 4.

So the two are not evidentially alike. For Copilot the exception is sourced. For
Workspace AI there is a sourced containment claim and no sourced exception.

**Recorded as open:** does Gemini in Google Workspace ground answers against the
public web by default, and if so is that traffic inside or outside the CDPA?
Check this at the next quarterly pass. If it behaves as Copilot does, this row
moves to Amber by the same reasoning and the trustee note changes with it.

## Sources

- Google, Generative AI in Google Workspace Privacy Hub:
  https://knowledge.workspace.google.com/admin/generative-ai/generative-ai-in-google-workspace-privacy-hub
- Google, Workspace with Gemini FAQ for Business:
  https://knowledge.workspace.google.com/admin/generative-ai/workspace-with-gemini/gemini-for-google-workspace-faq-business

Neither is price-sensitive. The nonprofit programme description is unchanged
from the original A4 pass and was not re-verified here.
