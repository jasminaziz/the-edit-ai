export const AboutPanel = () => {
  return (
    <section
      className="pt-6 pb-6 sm:pt-10 sm:pb-10 px-6 sm:px-12"
      style={{ backgroundColor: "#FAF8F4" }}
    >
      <div className="max-w-[1280px] mx-auto">
        <div style={{ maxWidth: 640 }}>
          <h2
            className="font-heading"
            style={{
              fontWeight: 700,
              fontSize: 28,
              color: "#2D35C9",
              margin: 0,
              marginBottom: 12,
            }}
          >
            What this is
          </h2>
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
            The Edit is my opinionated directory of AI tools for comms teams in charities, cultural organisations and heritage. I built it because the lists out there answer none of the questions this sector actually has to ask: where your data sits, whether the tool trains on what you type into it, whether there's a charity price, whether you could explain it to your board in one sentence. So I check. Every tool here has been through those checks before it appears, the ones that failed are published too, and the final call stays yours. No sponsored listings, no affiliate links, nobody paying to be recommended. I'm Jasmin, a strategic communications consultant who works with exactly these teams. This is the resource I wanted to hand people, so I made it.
          </p>
        </div>
      </div>
    </section>
  );
};
