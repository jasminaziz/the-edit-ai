import { CobaltZone } from "@/components/CobaltZone";


const resources = [
  {
    name: "Anthropic Academy — AI Fluency Track",
    type: "Course",
    provider: "Anthropic",
    free: true,
    description: "The right starting point. Built with academics, not marketers. Covers what AI actually is vs what it's claimed to be.",
    url: "https://www.anthropic.com/academy",
  },
  {
    name: "Anthropic Academy — Nonprofit Track",
    type: "Course",
    provider: "Anthropic",
    free: true,
    description: "Do this one specifically if your clients are charities or cultural organisations. Gives you a course you can recommend directly to them.",
    url: "https://www.anthropic.com/academy",
  },
  {
    name: "Perplexity Deep Research (just use it)",
    type: "Tool practice",
    provider: "Perplexity",
    free: false,
    description: "The fastest way to understand what AI-powered research actually feels like. Run a brief you'd normally spend half a day on. See what comes back.",
    url: "https://www.perplexity.ai",
  },
  {
    name: "Make.com Academy",
    type: "Course",
    provider: "Make.com",
    free: true,
    description: "Automation is the skill that compounds. One Make scenario that saves a client 3 hours a week is worth more than any certification.",
    url: "https://academy.make.com",
  },
  {
    name: "Anthropic Prompt Engineering Guide",
    type: "Docs",
    provider: "Anthropic",
    free: true,
    description: "The official guide, written by the people who built the model. Better than any third-party course on prompting Claude.",
    url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview",
  },
  {
    name: "Claude Code for Everyone",
    type: "Course",
    provider: "Community",
    free: true,
    description: "The clearest introduction to Claude Code for non-developers. Worth doing when you're ready to move past Lovable to more complex builds.",
    url: "https://claudecodeforeveryone.com",
  },
];

const Learning = () => {
  return (
    <>
      <CobaltZone
        heading="Learning"
        subheading="How I'm staying sharp."
        bodyText="The resources actually worth your time. Not a complete list — a curated one."
        illustration={<OpenBook />}
      />

      <section className="bg-background py-10 px-6 sm:px-12">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((r) => (
            <div
              key={r.name}
              className="bg-card rounded-xl border border-border p-6 flex flex-col group transition-all duration-150"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderLeftWidth = "4px";
                e.currentTarget.style.borderLeftColor = "#C8F04A";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderLeftWidth = "1px";
                e.currentTarget.style.borderLeftColor = "#E8E2D8";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <h3 className="font-heading font-semibold text-xl text-foreground">{r.name}</h3>

              <div className="flex flex-wrap gap-2 mt-3">
                <span
                  className="px-2.5 py-0.5 font-body text-[11px] font-semibold uppercase rounded-full"
                  style={{ backgroundColor: "#EEF0FB", color: "#2D35C9" }}
                >
                  {r.type}
                </span>
                <span
                  className="px-2.5 py-0.5 font-body text-[11px] font-semibold uppercase rounded-full"
                  style={{ backgroundColor: "#EEF0FB", color: "#2D35C9" }}
                >
                  {r.provider}
                </span>
                <span
                  className="px-2.5 py-0.5 font-body text-xs font-medium rounded-full"
                  style={r.free ? { color: "#2D6A4F" } : { color: "#9A8F82" }}
                >
                  {r.free ? "Free" : "Pro required"}
                </span>
              </div>

              <p className="font-body text-sm leading-relaxed text-foreground mt-3 mb-4 flex-1">
                {r.description}
              </p>

              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block self-start px-5 py-2.5 font-heading font-semibold text-[15px] rounded-lg text-primary-foreground transition-all duration-150 hover:-translate-y-0.5"
                style={{ backgroundColor: "#2D35C9" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#1A22A8";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#2D35C9";
                }}
              >
                Open resource →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom band */}
      <section className="py-10 px-6 sm:px-12 text-center" style={{ backgroundColor: "#C8F04A" }}>
        <p className="font-body font-medium text-base text-foreground max-w-xl mx-auto">
          More resources are added as I find them worth recommending. Quality over quantity.
        </p>
      </section>
    </>
  );
};

export default Learning;
