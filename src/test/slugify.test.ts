import { describe, it, expect } from "vitest";
import { toSlug } from "@/utils/slugify";

/**
 * Guards the `?tool=` deep links on /tools. The matcher slugs both sides, so
 * these cases are really about which URLs resolve to which card.
 */
describe("toSlug", () => {
  it("lowercases and hyphenates a multi-word name", () => {
    expect(toSlug("Gemini Notebook")).toBe("gemini-notebook");
  });

  it("is idempotent, so slugging an already-slugged param is safe", () => {
    // This is the property the matcher relies on: the parameter is passed
    // through toSlug whether the reader typed the name or the slug.
    expect(toSlug(toSlug("Gemini Notebook"))).toBe("gemini-notebook");
  });

  it("collapses punctuation rather than dropping the separator", () => {
    expect(toSlug("Adobe Firefly (beta)")).toBe("adobe-firefly-beta");
    expect(toSlug("Notion AI / Q&A")).toBe("notion-ai-q-a");
  });

  it("trims leading and trailing separators", () => {
    expect(toSlug("  Descript  ")).toBe("descript");
    expect(toSlug("!Canva!")).toBe("canva");
  });

  it("strips accents to the base letter instead of losing it", () => {
    // Without the NFD pass this returns "cr-ative", quietly breaking the link.
    expect(toSlug("Créative")).toBe("creative");
  });

  it("keeps digits, which several tool names carry", () => {
    expect(toSlug("GPT-4o")).toBe("gpt-4o");
    expect(toSlug("Seedance 1.0")).toBe("seedance-1-0");
  });

  it("returns an empty string for a name with nothing sluggable", () => {
    // The matcher must not treat this as a wildcard: an empty parameter is
    // filtered out before it reaches the comparison.
    expect(toSlug("!!!")).toBe("");
  });

  it("distinguishes names that differ only by punctuation position", () => {
    expect(toSlug("Copy.ai")).not.toBe(toSlug("Copyai"));
  });
});
