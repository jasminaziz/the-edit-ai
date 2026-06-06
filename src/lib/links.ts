/**
 * Centralised external links + feature flags.
 *
 * Reverting to the public website / re-enabling Substack is a one-line change:
 *
 *  - To restore the website CTA: change WORK_WITH_ME_HREF back to
 *    "https://jasminaziz.co.uk" (and remove `mailto:` callers' assumption).
 *  - To re-enable all Substack CTAs: set SUBSTACK_LIVE to true.
 *
 * Nothing else needs to change — every "Work with me" link reads from
 * WORK_WITH_ME_HREF, and every Substack CTA is gated on SUBSTACK_LIVE.
 */

// Temporary while jasminaziz.co.uk is being built — points at email instead.
export const WORK_WITH_ME_HREF = "mailto:hello@jasminaziz.co.uk";

// Flip to `true` once the Substack is live to restore all Substack CTAs
// (top nav desktop + mobile, footer link, and the "Or read the Substack"
// section on the Subscribe page).
export const SUBSTACK_LIVE = true;

export const SUBSTACK_URL = "https://jasminaziz.substack.com";

// LinkedIn profile — update with your actual profile URL.
export const LINKEDIN_URL = "https://www.linkedin.com/in/jasminaziz";
