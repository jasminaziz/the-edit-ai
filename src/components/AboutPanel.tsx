import { CONTACT_HREF } from "@/lib/links";

/**
 * The homepage's single "what this is" block.
 *
 * Rebuilt 30 Aug 2026. It used to be two consecutive sections that said much
 * the same thing: an intro in Index.tsx and this panel directly below it. Both
 * opened "opinionated directory of AI tools for comms teams in <sector>", both
 * said the tools had been through the checks, both said "No sponsored listings,
 * no affiliate links", and both identified Jasmin as a strategic communications
 * consultant. Four overlapping claims, one after the other, which read as a site
 * reassuring itself rather than getting on with it.
 *
 * The intro's only unique content was the hook and the byline, so they moved
 * here and the intro section was deleted. **No wording changed.** The duplicate
 * paragraph was removed whole; every string that survives is the approved one.
 *
 * It is also a 12-column grid at lg. Both blocks were capped at 640px and
 * left-pinned inside a 1280px container, so at 1440px they left 720px of empty
 * cream down the right, twice over. Now the label and hook sit left and the
 * paragraph sits right, and the section uses the width it occupies.
 */
export const AboutPanel = () => {
  return (
    <section
      className="pt-6 pb-6 sm:pt-10 sm:pb-10 px-6 sm:px-12"
      style={{ backgroundColor: "#FAF8F4" }}
    >
      <div className="max-w-[1280px] mx-auto lg:grid lg:grid-cols-12 lg:gap-x-16 lg:items-start">
        {/* The proposition, set as display type.

            "What this is" was here as a 28px cobalt label above a 20px hook.
            Ruled 30 Aug: the label was doing nothing the block did not already
            say, so it is gone and the hook takes its place at display scale.
            It is the h2, which is a better outline entry than a filing label:
            a screen reader hears the proposition rather than "What this is".
            Chillax and cobalt because this is display type, which is what the
            locked palette scopes cobalt to.

            Widened from col-span-5 to col-span-6 the same day. The grid was
            skipping column 6 entirely, because the left column spanned 5 while
            the right started at 7, so the two sat 176px apart: the empty column
            plus its two 64px gutters. Both are now 608px at the 1280 cap with a
            single gutter between them, and the right column's width and line
            breaks do not move by a character.

            The wider column is what pays for the larger clamp. 56px at 1440
            against 46px before, still three lines, and the 30px floor binds
            below an 804px viewport so the phone is untouched. Do not push past
            56: the fourth line starts at roughly 59px in a 608px column. */}
        <div className="lg:col-span-6">
          <h2
            className="font-heading"
            style={{
              fontWeight: 700,
              fontSize: "clamp(30px, calc(4.6vw - 7px), 56px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "#2D35C9",
              margin: 0,
            }}
          >
            {/* Two spans that only become blocks at sm. "This helps." is the
                turn in the line and starts its own from 640px up, where the
                column is wide enough for the first sentence to hold one line
                and the break is a display decision.

                BELOW sm THEY ARE INLINE AND WRAP NATURALLY. Ruled 1 Sep 2026:
                the break was unconditional, so on a phone it forced a two-line
                render on a column that cannot fit the first sentence anyway,
                which stacked a hard break on top of a natural one. Do not put
                the unconditional `block` back.

                Note this changes where the sentence wraps on a phone rather
                than making it one line: at the 30px clamp floor the first
                sentence needs roughly 525px and a 375px screen gives the column
                343. The space between the spans keeps the accessible name
                reading as one sentence pair at every width. */}
            <span className="sm:block">There's a lot to keep up with in AI.</span>{" "}
            <span className="sm:block">This helps.</span>
          </h2>
        </div>

        {/* The explanation, and the byline that used to sit under the intro */}
        <div className="lg:col-span-6 lg:col-start-7 mt-4 lg:mt-0">
          {/* Trimmed and split three ways, 30 Aug 2026, on a copy audit run at
              Jasmin's request. 130 words to 114, in 60 / 33 / 21.

              Cut: "I built it because" (motivation stated before value, and the
              paragraph was opening and closing on the maker); "actually" (a
              defensive intensifier the list disproves on its own); "into it"
              (the reader had it at "type"); "nobody paying to be recommended"
              (a third beat restating the two locked clauses before it); and
              "a strategic communications consultant" from the body.

              **That last cut had a dependency, and it has now been paid.** The
              credential lived only in the "Curated by Jasmin Aziz | Strategic
              Communications Consultant" byline. On 12 Oct 2026 the byline became
              the name alone, so the title came back into the body, in the
              third paragraph below. If it ever leaves that sentence, it has to
              reappear somewhere on this panel: the positioning statement keeps
              "strategic communications consultant" on it.

              Kept, and deliberately: the four questions. The cards demonstrate
              them 23 times as instances, but this is the only surface that
              states them as a rule before a visitor has seen a single card, and
              "the questions this sector has to ask" without the list is a
              gesture rather than a claim. Also kept verbatim: the locked
              audience phrase in nominal form, "been through those checks before
              it appears" and never "passed", the published failures, the final
              call staying with the reader, and the locked no-sponsored pair. */}
          <p
            className="font-body"
            style={{
              fontWeight: 400,
              fontSize: 17,
              lineHeight: 1.6,
              color: "#1A1510",
              margin: 0,
            }}
          >
            The Edit is my opinionated directory of AI tools for comms teams in charities, cultural organisations and heritage. The lists out there answer none of the questions this sector has to ask: where your data sits, whether the tool trains on what you type, whether there's a charity price, whether you could explain it to your board in one sentence.
          </p>
          <p
            className="font-body"
            style={{
              fontWeight: 400,
              fontSize: 17,
              lineHeight: 1.6,
              color: "#1A1510",
              margin: 0,
              marginTop: 16,
            }}
          >
            So I check. Every tool here has been through those checks before it appears, the ones that failed are published too, and the final call stays yours. No sponsored listings, no affiliate links.
          </p>
          <p
            className="font-body"
            style={{
              fontWeight: 400,
              fontSize: 17,
              lineHeight: 1.6,
              color: "#1A1510",
              margin: 0,
              marginTop: 16,
            }}
          >
            I work with these teams as a strategic communications consultant. This is the resource I wanted to hand them, so I made it.
          </p>
          {/* The close, rewritten 12 Oct 2026: copywriter candidate 3 in
              reports/copy-proposals-2026-10-12-about-close.md, chosen by
              Jasmin. It had opened "I'm Jasmin", switched to the third person
              for "Jasmin also runs a consultancy" and named her again in a
              linked byline, so it spoke in three voices and named her three
              times in sixty words. Now it is first person throughout, names
              her once and has one link. The title moved into the paragraph
              above, which is what the dependency note further up requires.

              The consultancy hand-off stays here rather than on /tools, in the
              footer, or in a section of its own: /tools is the site's
              highest-trust surface and already has a documented history of CTA
              crowding, the footer renders on every route and has had wording
              cut from it for that same reason, and a CobaltZone section would
              give the hand-off the same visual weight as the checks system and
              read as an advert bolted onto a resource.

              "Get in touch" is deliberately not "Work with me", the label every
              other outbound link on this site uses: a lighter link than the
              standing nav CTA, Jasmin's call of 4 Sep 2026, so the
              identical-labels rule in CLAUDE.md is untouched by it. Since
              12 Oct it goes to the consultancy's contact page (CONTACT_HREF),
              because a contact label should land on one. */}
          <p
            className="font-body"
            style={{
              fontWeight: 400,
              fontSize: 15,
              lineHeight: 1.6,
              color: "hsl(var(--text-secondary))",
              margin: 0,
              marginTop: 16,
            }}
          >
            My consultancy covers communications audits, brand and positioning, campaign strategy, content systems and AI work.{" "}
            <a
              href={CONTACT_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="lime-link"
            >
              Get in touch
            </a>
            .
          </p>
          {/* Plain text since 12 Oct 2026: the name alone, no link, no arrow.
              The title it used to carry is in the body above. */}
          <p
            className="font-body"
            style={{
              fontWeight: 400,
              fontSize: 14,
              color: "hsl(var(--text-secondary))",
              margin: 0,
              marginTop: 16,
            }}
          >
            Curated by Jasmin Aziz
          </p>
        </div>
      </div>
    </section>
  );
};
