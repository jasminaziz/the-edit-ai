import { useEffect, useState } from "react";
import { fetchMyStack, type MyStackItem } from "@/lib/sheets";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorState, EmptyState } from "@/components/ErrorState";
import { CobaltZone } from "@/components/CobaltZone";

const MyStack = () => {
  const [items, setItems] = useState<MyStackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchMyStack().then((data) => {
      if (data.length === 0 && import.meta.env.VITE_GOOGLE_SHEETS_ID) setError(true);
      setItems(data);
      setLoading(false);
    });
  }, []);

  const grouped = items.reduce<Record<string, MyStackItem[]>>((acc, t) => {
    if (!acc[t.category]) acc[t.category] = [];
    acc[t.category].push(t);
    return acc;
  }, {});

  return (
    <>
      <CobaltZone
        heading="My Stack"
        subheading="What I'm actually using and why."
        bodyText="The AI tools I open every day and what I use them for."
      />

      <section className="bg-background py-10 px-6 sm:px-12">
        <div className="max-w-[1280px] mx-auto">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorState />
          ) : items.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-10">
              {Object.entries(grouped).map(([cat, catTools]) => (
                <div key={cat}>
                  <h2
                    className="font-body font-semibold text-[11px] uppercase tracking-[0.06em] mb-4 pl-3"
                    style={{
                      color: "#9A8F82",
                      borderLeft: "3px solid #2D35C9",
                    }}
                  >
                    {cat}
                  </h2>

                  <div className="space-y-4">
                    {catTools.map((tool) => (
                      <div
                        key={tool.name}
                        className="bg-card rounded-xl border border-border p-6 group hover:shadow-lg transition-all duration-150"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderLeftWidth = "4px";
                          e.currentTarget.style.borderLeftColor = "#C8F04A";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderLeftWidth = "1px";
                          e.currentTarget.style.borderLeftColor = "#E8E2D8";
                        }}
                      >
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="md:w-[40%]">
                            <h3 className="font-heading font-semibold text-xl text-foreground">
                              {tool.name}
                            </h3>
                            <p className="font-body text-sm text-muted mt-1">
                              {tool.what_it_does}
                            </p>
                            {tool.my_use_case && (
                              <p className="font-body text-xs text-muted-foreground mt-1">
                                <strong>My use case:</strong> {tool.my_use_case}
                              </p>
                            )}
                            <p className="font-body text-[13px] mt-2" style={{ color: "#9A8F82" }}>
                              {tool.cost}
                            </p>
                          </div>

                          <div className="md:w-[60%]">
                            {tool.verdict && (
                              <div
                                className="rounded-lg p-4 font-body text-[15px] leading-[1.7] text-foreground"
                                style={{ backgroundColor: "#F0EBFF" }}
                              >
                                {tool.verdict}
                              </div>
                            )}
                            {tool.url && (
                              <a
                                href={tool.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-3 font-body text-[13px] font-medium text-primary hover:underline"
                              >
                                Open →
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 px-6 sm:px-12" style={{ backgroundColor: "#C8F04A" }}>
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-heading font-bold text-[28px] text-foreground mb-3">How I built this</h2>
          <p className="font-body text-[15px] text-foreground max-w-2xl">
            This stack is tracked in a living spreadsheet and updated every time something changes. The site pulls
            directly from that data — so what you see here is always current.
          </p>
        </div>
      </section>
    </>
  );
};

export default MyStack;
