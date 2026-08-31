import { WORK_WITH_ME_HREF } from "@/lib/links";

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
            {/* Two block spans, not a natural wrap: "This helps." is the turn
                in the line and has to start its own, rather than being broken
                across one wherever the column happens to run out. The first
                sentence still wraps freely above it. The space between the
                spans keeps the accessible name reading as one sentence pair. */}
            <span className="block">There's a lot to keep up with in AI.</span>{" "}
            <span className="block">This helps.</span>
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

              **That last cut has a dependency.** The credential now lives only
              in the "Curated by Jasmin Aziz | Strategic Communications
              Consultant" byline directly below. If that byline ever moves or
              goes, the title has to come back into this paragraph.

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
            I'm Jasmin. I work with exactly these teams. This is the resource I wanted to hand them, so I made it.
          </p>
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
            <a
              href={WORK_WITH_ME_HREF}
              target="_blank"
              rel="noopener noreferrer"
              // The lime underline lives in index.css under `.about-byline`,
              // where hover and focus-visible are one rule. It was a pair of
              // mouse handlers here, which meant the keyboard never saw it.
              // `textDecoration` cannot come back into this style block: an
              // inline declaration outranks the stylesheet and would win over
              // the hover rule, which is what the handlers were working around.
              className="about-byline"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 400,
                fontSize: 14,
                color: "#1A1510",
                margin: 0,
                cursor: "pointer",
                transition: "text-decoration-color 0.2s ease",
              }}
            >
              Curated by Jasmin Aziz | Strategic Communications Consultant{" "}
              <span style={{ color: "#C8F04A" }}>→</span>
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
