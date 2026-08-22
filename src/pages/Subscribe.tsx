import { SUBSTACK_SUBSCRIBE_URL } from "@/lib/links";
import { SEO } from "@/components/SEO";

export default function Subscribe() {
  return (
    <>
      <SEO
        title="Get the AI-Use Policy Template | The Edit"
        description="A free AI-use policy template for charity, cultural and heritage organisations. What your policy should say about data, tools and disclosure."
        canonical="https://theeditai.co.uk/subscribe"
      />
      {/* Hero — mirrors homepage style */}
      <section
        className="relative min-h-[40vh] sm:min-h-[70vh] flex flex-col justify-end overflow-hidden px-4 sm:px-10 md:px-16 pb-10 sm:pb-16 -mt-14 sm:-mt-16 pt-14 sm:pt-16"
        style={{ backgroundColor: "#2D35C9" }}
      >
        <h1
          className="font-heading font-black leading-[0.78] w-full"
          style={{
            fontSize: "clamp(60px, 18vw, 420px)",
            color: "#7B7FD4",
            letterSpacing: "-0.05em",
            marginLeft: "-0.05em",
          }}
        >
          Subscribe.
        </h1>
        <p
          className="font-body font-semibold mt-2 sm:mt-4 text-left"
          style={{
            fontSize: "clamp(16px, 2.5vw, 36px)",
            color: "#C8F04A",
            letterSpacing: "0.01em",
            marginLeft: "-0.04em",
          }}
        >
          Free AI-use policy template for charity, cultural and heritage teams.
        </p>
      </section>

      {/* Template section: cream */}
      <section
        style={{ backgroundColor: "#FAF8F4" }}
        className="px-4 sm:px-10 md:px-16 py-16 sm:py-24"
      >
        <div className="max-w-[640px]">
          <h2
            className="font-heading"
            style={{
              fontWeight: 700,
              fontSize: "clamp(36px, 5vw, 52px)",
              color: "#1A1510",
              textWrap: "balance",
              lineHeight: 1.1,
              margin: 0,
              marginBottom: 16,
            }}
          >
            Start with the policy template
          </h2>
          <p
            className="font-body"
            style={{
              fontWeight: 500,
              fontSize: 20,
              lineHeight: 1.4,
              color: "#4A4440",
              margin: 0,
              marginBottom: 24,
            }}
          >
            The AI-use policy template for charity, cultural and heritage organisations: what your policy should say about data, tools and disclosure, written to be adapted, not admired. It's free, in exchange for your email.
          </p>
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
            Subscribers also get my Substack: what changed in the checks, what's worth your attention, and what it means for your comms.
          </p>

          <a
            href={SUBSTACK_SUBSCRIBE_URL}
            target="_blank"
            rel="noopener noreferrer"
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
              fontSize: 15,
              lineHeight: 1.6,
              color: "#9A8F82",
              marginTop: 32,
              marginBottom: 0,
            }}
          >
            Get in touch:{" "}
            <a
              href="mailto:hello@jasminaziz.co.uk"
              style={{ color: "#9A8F82", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              hello@jasminaziz.co.uk
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
