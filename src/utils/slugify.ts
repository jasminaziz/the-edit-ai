/**
 * Convert a tool name into a URL-safe slug.
 *
 * Rules (applied in this exact order):
 *  1. lowercase
 *  2. strip parentheses and their contents
 *  3. replace remaining spaces with hyphens
 *  4. strip any remaining special characters except hyphens
 *
 * Example: "Google AI Studio (Gemini)" -> "google-ai-studio-gemini"
 *
 * NOTE: This is for URL generation only. localStorage always stores and
 * reads raw tool name strings, never slugs.
 */
export function slugifyToolName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\([^)]*\)/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
