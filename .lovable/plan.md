Add a LinkedIn profile link to the site footer for credibility and trust.

Placement: footer link cluster, alongside "Work with me →" and "Read the Substack →". Uses the same styling as existing footer text links (font-body text-[12px] sm:text-[13px] text-primary-foreground/40 hover:text-primary-foreground).

Implementation:
1. Add `LINKEDIN_URL` constant to `src/lib/links.ts`.
2. Import and render a "LinkedIn →" link in `src/components/Layout.tsx` footer, positioned after "Work with me →" and before "Read the Substack →".
3. Open in new tab with `target="_blank" rel="noopener noreferrer"`.

Open question: what is your LinkedIn profile URL?