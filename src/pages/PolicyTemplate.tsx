import { SEO } from "@/components/SEO";
import { CobaltZone } from "@/components/CobaltZone";

export default function PolicyTemplate() {
  return (
    <>
      <SEO
        title="AI-Use Policy Template for Charities | The Edit"
        description="A free, adaptable AI-use policy template for charity, cultural and heritage organisations. What to say about data, tools, DPIAs and disclosure."
        canonical="https://theeditai.co.uk/policy-template"
      />
      {/* Was a bespoke hero mirroring the deleted Subscribe page: a full
          sentence as the h1 at clamp(48px, 12vw, 300px), wrapping to three
          lines, with no subheading. It was the one page not using CobaltZone,
          so it broke the short-h1-plus-subheading shape that /tools,
          /learning, /my-stack and /submit all share. Moved onto CobaltZone
          1 Sep 2026 with approved copy.

          It also lifts this page's heading contrast. #9B9EDE on #2D35C9
          measures 3.38:1, which clears the 3:1 display-type floor but nothing
          more; CobaltZone's cream #FAF8F4 on the same ground is 8.03:1.

          It does NOT retire periwinkle-on-cobalt from the app. LegalPage.tsx:41
          still sets that pair for the h1 on all three legal pages, and the
          design audit's open homepage-wordmark ruling is separate again.
          Neither is touched here. */}
      <CobaltZone
        heading="Policy Template"
        subheading="A free, adaptable AI-use policy template for charity, cultural and heritage organisations."
      />

      {/* Template section: cream */}
      <section
        style={{ backgroundColor: "#FAF8F4" }}
        className="px-4 sm:px-10 md:px-16 py-16 sm:py-24"
      >
        <div className="max-w-[640px] mx-auto">
          {/* Split into three paragraphs 1 Sep 2026. NOT A COPY CHANGE: every
              word, every full stop and the order are exactly as approved, and
              the two breaks fall on full stops that were already there. Only
              the tag boundaries moved.

              It was one 93-word block of eight sentences, which measured 16
              lines at 375px, and the page it opens is the one asking a reader
              to trust the document enough to download it.

              The breaks are where the block already changes job: framing, then
              the four questions the template answers, then the credibility
              close. The four fragments are deliberately fragments and stay
              together, because they are the list that sentence two promises
              ("the questions that actually come up") and each one alone is not
              a sentence.

              marginBottom moves from 24 to 12 between them so the three read as
              one block rather than three sections, and the last keeps 24 to
              hold the gap above the download line. */}
          <p
            className="font-body"
            style={{
              fontWeight: 500,
              fontSize: 20,
              lineHeight: 1.4,
              color: "#1A1510",
              margin: 0,
              marginBottom: 12,
            }}
          >
            Most AI policies are written for organisations with a legal team. This one is written for yours: a working AI-use policy for charity, cultural and heritage organisations, covering the questions that actually come up.
          </p>
          <p
            className="font-body"
            style={{
              fontWeight: 500,
              fontSize: 20,
              lineHeight: 1.4,
              color: "#1A1510",
              margin: 0,
              marginBottom: 12,
            }}
          >
            Which tools staff can use and for what. What must never go into them. How to work out whether your organisation needs to do a DPIA. What you tell trustees, funders and supporters.
          </p>
          <p
            className="font-body"
            style={{
              fontWeight: 500,
              fontSize: 20,
              lineHeight: 1.4,
              color: "#1A1510",
              margin: 0,
              marginBottom: 24,
            }}
          >
            It's the starting point I use with consultancy clients, ready to adapt to your organisation. It's the document you can put in front of your board.
          </p>
          {/* THESE TWO LINES WERE WRITTEN BY A CODE SESSION, 30 Aug 2026, on
              Jasmin's explicit instruction to implement the copy changes as
              well. That is an exception to the standing rule that visitor
              facing copy arrives as approved strings, and it is flagged here
              so the exception is visible rather than silent. Read them.

              They replace "It's free. Subscribe and you'll get the link
              straight away." and "Delivered through my Substack. Unsubscribe
              any time; the template is yours either way.", both of which
              described a subscription step that no longer exists.

              Written against the locked voice rules: UK English, contractions,
              no em dashes, direct, name the thing plainly. "No email, no
              sign-up" deliberately echoes the homepage's "No sponsored
              listings, no affiliate links", which is the site's established
              construction for saying what it does not do to you. */}
          <p
            className="font-body"
            style={{
              fontWeight: 400,
              fontSize: 17,
              lineHeight: 1.7,
              color: "#1A1510",
              margin: 0,
              marginBottom: 32,
            }}
          >
            It's free, and it downloads straight away. No email, no sign-up.
          </p>

          {/* Direct download. The gate is dropped: see the 30 Aug ruling in
              SCRATCHPAD. The .docx is the artefact the intro promises ("ready
              to adapt to your organisation"), and it is the only one the site
              serves: the PDF was removed from public/ before launch on Jasmin's
              call, because it rendered in substituted faces and shipping an
              off-brand download was worse than shipping one format. The source
              PDF is kept at reports/AI-Use-Policy-Template.pdf. Same origin, so
              `download` is honoured. */}
          <a
            href="/AI-Use-Policy-Template.docx"
            download
            style={{
              display: "block",
              maxWidth: 320,
              textAlign: "center",
              background: "#2D35C9",
              color: "#FAF8F4",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: 15,
              borderRadius: 20,
              padding: "16px 24px",
              textDecoration: "none",
              transition: "background 200ms ease-out",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1A1510")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#2D35C9")}
          >
            Get the template →
          </a>

          <p
            className="font-body"
            style={{
              fontWeight: 400,
              fontSize: 13,
              lineHeight: 1.6,
              color: "hsl(var(--text-secondary))",
              marginTop: 12,
              marginBottom: 0,
            }}
          >
            It's a Word document, so you can make it yours. If you want more of this thinking, I write it up on the Substack.
          </p>

          {/* Ungated DPIA explainer, ruled 28 Aug: this page owns the term, so
              the explanation sits on the page itself and never behind the
              subscribe gate. Placed below the intro block rather than between
              the intro and the CTA, so it does not interrupt the conversion
              path. Approved strings, copy pack four item 10(b). */}
          <h2
            className="font-heading"
            style={{
              fontWeight: 700,
              fontSize: 22,
              color: "#2D35C9",
              margin: 0,
              marginTop: 48,
              marginBottom: 12,
            }}
          >
            What's a DPIA, and why does everyone keep saying it?
          </h2>
          <p
            className="font-body"
            style={{
              fontWeight: 400,
              fontSize: 17,
              lineHeight: 1.7,
              color: "#1A1510",
              margin: 0,
            }}
          >
            A Data Protection Impact Assessment is the structured look your organisation takes before using personal data in a way that could put people at risk. It's something you do, not something a tool has. It matters here because supporter and beneficiary data is exactly the kind that raises the stakes, and because your board will ask. The template walks you through when one's needed and what to write down.
          </p>
        </div>
      </section>
    </>
  );
}
