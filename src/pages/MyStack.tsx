import { useEffect, useState } from "react";
import { fetchTools, type Tool } from "@/lib/sheets";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorState, EmptyState } from "@/components/ErrorState";

const MyStack = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchTools().then((t) => {
      if (t.length === 0 && import.meta.env.VITE_GOOGLE_SHEETS_ID) setError(true);
      setTools(t);
      setLoading(false);
    });
  }, []);

  const stackTools = tools.filter((t) => t.status === "in_stack");

  // Group by category
  const grouped = stackTools.reduce<Record<string, Tool[]>>((acc, t) => {
    if (!acc[t.category]) acc[t.category] = [];
    acc[t.category].push(t);
    return acc;
  }, {});

  return (
    <>
      <section className="bg-primary py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-heading font-black text-4xl sm:text-5xl text-primary-foreground">My Stack</h1>
          <p className="font-heading font-bold text-xl text-accent mt-2">What I'm actually using.</p>
          <p className="text-primary-foreground/80 text-sm mt-3 max-w-lg">
            Not what I'm considering. Not what I think sounds good. The tools I open every day and what I use them for.
          </p>
        </div>
      </section>

      <section className="bg-background py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorState />
          ) : stackTools.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-10">
              {Object.entries(grouped).map(([cat, catTools]) => (
                <div key={cat}>
                  <h2 className="font-heading font-bold text-sm uppercase tracking-widest text-foreground border-l-4 border-primary pl-3 mb-4">
                    {cat}
                  </h2>
                  <div className="space-y-3">
                    {catTools.map((tool) => (
                      <div key={tool.name} className="bg-card rounded-lg border border-border p-5 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <h3 className="font-heading font-bold text-lg">{tool.name}</h3>
                          <span className="text-sm text-muted-foreground">{tool.what_it_does}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
                          {tool.cost && <span>{tool.cost}</span>}
                          {tool.key_integrations &&
                            tool.key_integrations.split(",").map((tag) => (
                              <span
                                key={tag.trim()}
                                className="px-2 py-0.5 bg-muted rounded-full"
                              >
                                {tag.trim()}
                              </span>
                            ))}
                        </div>
                        {tool.verdict && (
                          <div className="p-3 rounded-md text-sm" style={{ backgroundColor: "#EDE9FF" }}>
                            {tool.verdict}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How I built this */}
      <section className="bg-accent py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading font-bold text-2xl text-accent-foreground mb-3">How I built this</h2>
          <p className="text-accent-foreground text-sm max-w-2xl">
            This stack is tracked in a living spreadsheet and updated every time something changes. The site pulls
            directly from that data — so what you see here is always current.
          </p>
        </div>
      </section>
    </>
  );
};

export default MyStack;
