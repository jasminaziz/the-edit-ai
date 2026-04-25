import { useEffect, useState } from "react";
import { fetchMyStack, type MyStackItem } from "@/lib/sheets";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorState, EmptyState } from "@/components/ErrorState";
import { CobaltZone } from "@/components/CobaltZone";
import { Reveal, StaggerGrid, RevealItem } from "@/components/Reveal";

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
        bodyText="The tools I've gone deep on. Everything here is earning its subscription."
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
                <Reveal key={cat}>
                  <div className="flex items-center gap-2 mb-4">
                    <span style={{ width: "8px", height: "8px", backgroundColor: "#C8F04A", borderRadius: "50%", flexShrink: 0 }} />
                    <h2 className="font-heading" style={{ fontWeight: 700, fontSize: "22px", color: "#1A1510", letterSpacing: "-0.02em" }}>
                      {cat}
                    </h2>
                  </div>

                  <StaggerGrid className="space-y-4">
                    {catTools.map((tool) => (
                      <RevealItem key={tool.name}>
                      <div
                        className="group hover:shadow-lg transition-all duration-150 overflow-hidden"
                        style={{
                          backgroundColor: "#FFFFFF",
                          border: "0.5px solid #E8E2D8",
                          borderRadius: "12px",
                        }}
                      >
                        {/* Lime top band */}
                        <div style={{ height: "4px", backgroundColor: "#C8F04A" }} />

                        <div style={{ padding: "20px" }}>
                          {/* Name + Cost */}
                          <div className="flex items-center gap-2">
                            <h3 className="font-heading" style={{ fontSize: "16px", fontWeight: 500, color: "#1A1510" }}>
                              {tool.name}
                            </h3>
                            {tool.cost && (
                              <span className="font-body" style={{ fontSize: "12px", color: "#9A8F82" }}>
                                {tool.cost}
                              </span>
                            )}
                          </div>

                          {/* Use case */}
                          {tool.my_use_case && (
                            <p className="font-body mt-2" style={{ fontSize: "14px", color: "#1A1510", lineHeight: 1.5 }}>
                              {tool.my_use_case}
                            </p>
                          )}

                          {/* Divider + Verdict */}
                          {tool.verdict && (
                            <>
                              <hr style={{ border: "none", borderTop: "0.5px solid #E8E2D8", margin: "16px 0" }} />
                              <p className="font-body" style={{ fontSize: "14px", color: "#1A1510", lineHeight: 1.6 }}>
                                {tool.verdict}
                              </p>
                            </>
                          )}

                          {/* Open link */}
                          {tool.url && (
                            <div className="mt-3 flex justify-end">
                              <a
                                href={tool.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-body inline-block"
                                style={{
                                  fontSize: "13px",
                                  fontWeight: 500,
                                  color: "#1A1510",
                                  backgroundColor: "#C8F04A",
                                  borderRadius: "20px",
                                  padding: "10px 20px",
                                  transition: "background-color 0.2s ease-out, color 0.2s ease-out",
                                  textDecoration: "none",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = "#2D35C9";
                                  e.currentTarget.style.color = "#FFFFFF";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = "#C8F04A";
                                  e.currentTarget.style.color = "#1A1510";
                                }}
                              >
                                Open tool →
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                      </RevealItem>
                    ))}
                  </StaggerGrid>
                </Reveal>
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
