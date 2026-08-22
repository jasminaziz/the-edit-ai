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
            The Edit is an opinionated directory of AI tools for communications teams in charities, cultural organisations and heritage. Every tool here is judged on the questions this sector actually has to answer before adopting anything: where your data sits, whether the tool trains on what you type into it, whether there is a nonprofit price, whether using it is likely to need a DPIA, and whether you could explain it to a trustee in one sentence. No sponsored listings, no affiliate links, and no tool appears until it has been through the checks. Built and maintained by Jasmin Aziz, a strategic communications consultant who works with exactly these teams.
          </p>
        </div>
      </div>
    </section>
  );
};
