/**
 * URL slugs for tool names.
 *
 * This file existed before and was deleted with the Stack cut on 26 Aug 2026,
 * when nothing slugified a tool name any more. CLAUDE.md's note at that
 * deletion was that if URL encoding is ever needed again, it should come back
 * as one module kept single-source rather than as an inline helper. It is
 * needed again for the `?tool=` deep links on /tools, so here it is, used by
 * both the matcher and the card attribute so the two cannot drift.
 *
 * Matching is deliberately one-way. A slug is generated from each rendered
 * tool name and compared against the parameter; there is no stored slug and no
 * lookup table. So a tool renamed in the Sheet breaks its old link rather than
 * silently resolving to the wrong card, which is the safer failure for a link
 * pasted under a post that makes a claim about that specific tool.
 */
export const toSlug = (name: string): string =>
  name
    .toLowerCase()
    .normalize("NFD")
    // Strip combining marks left by NFD, so an accented name slugs to its
    // unaccented form rather than losing the letter entirely.
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
