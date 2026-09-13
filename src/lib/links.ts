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

// Consultancy website — live.
export const WORK_WITH_ME_HREF = "https://jasminaziz.co.uk/";

// Flip to `true` once the Substack is live to restore all Substack CTAs
// (top nav desktop + mobile, footer link, and the "Or read the Substack"
// section on the Subscribe page).
export const SUBSTACK_LIVE = true;

export const SUBSTACK_URL = "https://jasminaziz.substack.com";

export const SUBSTACK_SUBSCRIBE_URL = "https://jasminaziz.substack.com/subscribe";

// LinkedIn profile.
export const LINKEDIN_URL = "https://www.linkedin.com/in/jasmin-r-aziz/";

/**
 * The How I work hub: the four pages that come from Jasmin rather than from
 * the checks. Ruled 13 Sep 2026 (site map build).
 *
 * One source for each page's label and subheading, because the subheading is
 * shown twice: as the page's own h2, and as its description in the section
 * banner that Layout.tsx renders above those pages. Edit a string here and
 * both change; nothing else holds a copy. The order is the banner's order,
 * which is Jasmin's ruling, landing page first.
 */
export const HUB_PAGES = [
  { to: "/my-stack", label: "My Stack", subheading: "What I'm actually using and why." },
  { to: "/design-kit", label: "Design", subheading: "From blank page to build-ready." },
  {
    to: "/learning",
    label: "Learning",
    subheading: "How I'm staying sharp, and where to start if you're new to all this.",
  },
  { to: "/ai-news", label: "AI News", subheading: "Model updates, releases, and AI gossip." },
] as const;

export type HubRoute = (typeof HUB_PAGES)[number]["to"];

// Typed to the four routes, so a page cannot ask for one that does not exist.
export const hubSubheading = (to: HubRoute) => HUB_PAGES.find((p) => p.to === to)!.subheading;
