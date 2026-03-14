import { ExternalLink } from "lucide-react";

const resources = [
  {
    name: "Anthropic Academy — AI Fluency Track",
    type: "Course",
    provider: "Anthropic",
    free: true,
    description:
      "The right starting point. Built with academics, not marketers. Covers what AI actually is vs what it's claimed to be.",
    url: "https://www.anthropic.com/academy",
  },
  {
    name: "Anthropic Academy — Nonprofit Track",
    type: "Course",
    provider: "Anthropic",
    free: true,
    description:
      "Do this one specifically if your clients are charities or cultural organisations. Gives you a course you can recommend directly to them.",
    url: "https://www.anthropic.com/academy",
  },
  {
    name: "Perplexity Deep Research (just use it)",
    type: "Tool practice",
    provider: "Perplexity",
    free: false,
    description:
      "The fastest way to understand what AI-powered research actually feels like. Run a brief you'd normally spend half a day on. See what comes back.",
    url: "https://www.perplexity.ai",
  },
  {
    name: "Make.com Academy",
    type: "Course",
    provider: "Make.com",
    free: true,
    description:
      "Automation is the skill that compounds. One Make scenario that saves a client 3 hours a week is worth more than any certification.",
    url: "https://academy.make.com",
  },
  {
    name: "Anthropic Prompt Engineering Guide",
    type: "Docs",
    provider: "Anthropic",
    free: true,
    description:
      "The official guide, written by the people who built the model. Better than any third-party course on prompting Claude.",
    url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview",
  },
  {
    name: "Claude Code for Everyone",
    type: "Course",
    provider: "Community",
    free: true,
    description:
      "The clearest introduction to Claude Code for non-developers. Worth doing when you're ready to move past Lovable to more complex builds.",
    url: "https://claudecodeforeveryone.com",
  },
];

const Learning = () => {
  return (
    <>
      <section className="bg-primary py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-heading font-black text-4xl sm:text-5xl text-primary-foreground">Learning</h1>
          <p className="font-heading font-bold text-xl text-accent mt-2">How I'm staying sharp.</p>
          <p className="text-primary-foreground/80 text-sm mt-3 max-w-lg">
            The resources actually worth your time. Not a complete list — a curated one.
          </p>
        </div>
      </section>

      <section className="bg-background py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((r) => (
            <div key={r.name} className="bg-card rounded-lg border border-border p-5 shadow-sm flex flex-col">
              <h3 className="font-heading font-bold text-base mb-2">{r.name}</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-0.5 text-xs rounded-full bg-secondary/50 text-secondary-foreground">
                  {r.type}
                </span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-secondary/50 text-secondary-foreground">
                  {r.provider}
                </span>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                    r.free ? "bg-accent/30 text-accent-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {r.free ? "Free" : "Pro required"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground flex-1 mb-4">{r.description}</p>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 self-start"
              >
                Visit <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom banner */}
      <section className="bg-accent py-10 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-accent-foreground text-sm font-medium">
            More resources are added as I find them worth recommending. Quality over quantity.
          </p>
        </div>
      </section>
    </>
  );
};

export default Learning;
