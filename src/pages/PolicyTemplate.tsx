import { SEO } from "@/components/SEO";

export default function PolicyTemplate() {
  return (
    <>
      <SEO
        title="AI-Use Policy Template for Charities | The Edit"
        description="A free, adaptable AI-use policy template for charity, cultural and heritage organisations. What to say about data, tools, DPIAs and disclosure."
        canonical="https://theeditai.co.uk/policy-template"
      />
      {/* Hero: mirrors Subscribe */}
      <section
        className="relative min-h-[40vh] sm:min-h-[70vh] flex flex-col justify-end overflow-hidden px-4 sm:px-10 md:px-16 pb-10 sm:pb-16 -mt-14 sm:-mt-16 pt-14 sm:pt-16"
        style={{ backgroundColor: "#2D35C9" }}
      >
        <h1
          className="font-heading font-bold leading-[0.78] w-full"
          style={{
            fontSize: "clamp(48px, 12vw, 300px)",
            color: "#7B7FD4",
            letterSpacing: "-0.05em",
            marginLeft: "-0.05em",
          }}
        >
          The AI-use policy template for charities
        </h1>
      </section>

      {/* Template section: cream */}
      <section
        style={{ backgroundColor: "#FAF8F4" }}
        className="px-4 sm:px-10 md:px-16 py-16 sm:py-24"
      >
        <div className="max-w-[640px] mx-auto">
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
            Most AI policies are written for organisations with a legal team. This one is written for yours: a working AI-use policy for charity, cultural and heritage organisations, covering the questions that actually come up. Which tools staff can use and for what. What must never go into them. How to work out whether your organisation needs to do a DPIA. What you tell trustees, funders and supporters. It's the starting point I use with consultancy clients, ready to adapt to your organisation. It's the document you can put in front of your board.
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
              to adapt to your organisation"); the PDF sits at
              /AI-Use-Policy-Template.pdf and stays unlinked only because
              labelling a second button needs a string that does not exist yet.
              Same origin, so `download` is honoured. */}
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
