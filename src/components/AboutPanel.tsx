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
            a screen reader now hears the proposition rather than "What this
            is". Chillax and cobalt because this is display type, which is what
            the locked palette scopes cobalt to. */}
        <div className="lg:col-span-5">
          <h2
            className="font-heading"
            style={{
              fontWeight: 700,
              fontSize: "clamp(30px, 3.4vw, 46px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "#2D35C9",
              margin: 0,
            }}
          >
            There's a lot to keep up with. This helps.
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
              className="group"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 400,
                fontSize: 14,
                color: "#1A1510",
                margin: 0,
                textDecoration: "none",
                cursor: "pointer",
                transition: "text-decoration-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = "underline";
                e.currentTarget.style.textUnderlineOffset = "3px";
                e.currentTarget.style.textDecorationColor = "#C8F04A";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = "none";
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
