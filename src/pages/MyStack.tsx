import { useEffect, useState } from "react";
import { fetchMyStack, type MyStackItem } from "@/lib/sheets";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorState, EmptyState } from "@/components/ErrorState";
import { CobaltZone } from "@/components/CobaltZone";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";

const FeaturedCard = ({ tool }: { tool: MyStackItem }) => (
  <div
    style={{
      backgroundColor: "#2D35C9",
      borderRadius: "16px",
      padding: "32px",
      color: "#FFFFFF",
      width: "100%",
    }}
  >
    <div className="flex items-center gap-2 mb-3">
      <div
        className="flex items-center gap-2"
        style={{
          padding: "4px 10px 4px 6px",
          borderRadius: "999px",
          border: "1px solid rgba(200, 240, 74, 0.4)",
          backgroundColor: "transparent",
        }}
        aria-label="Featured tool"
      >
        {/* Claude-style diamond mark */}
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M6 0 L12 6 L6 12 L0 6 Z" fill="#C8F04A" />
        </svg>
        <span
          className="font-body"
          style={{
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#C8F04A",
            lineHeight: 1,
          }}
        >
          Featured Tool
        </span>
      </div>
      {tool.category && (
        <span
          className="font-body"
          style={{ fontSize: "12px", color: "#FFFFFF", opacity: 0.8, letterSpacing: "0.04em" }}
        >
          {tool.category}
        </span>
      )}
    </div>

    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <h2
        className="font-heading"
        style={{
          fontSize: "clamp(28px, 4vw, 40px)",
          fontWeight: 700,
          color: "#C8F04A",
          letterSpacing: "-0.02em",
          lineHeight: 1.05,
        }}
      >
        {tool.name}
      </h2>
      {tool.pricing && (
        <span className="font-body" style={{ fontSize: "13px", color: "#FFFFFF", opacity: 0.85 }}>
          {tool.pricing}
        </span>
      )}
    </div>

    {tool.what_it_does && (
      <p
        className="font-body mt-4"
        style={{ fontSize: "15px", color: "#FFFFFF", lineHeight: 1.55, opacity: 0.95 }}
      >
        {tool.what_it_does}
      </p>
    )}

    {tool.verdict && (
      <>
        <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.18)", margin: "20px 0" }} />
        <p
          className="font-body"
          style={{ fontSize: "15px", color: "#FFFFFF", lineHeight: 1.65, whiteSpace: "pre-wrap" }}
        >
          {tool.verdict}
        </p>
      </>
    )}

    {tool.url && (
      <div className="mt-6">
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-body inline-block"
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#1A1510",
            backgroundColor: "#C8F04A",
            borderRadius: "999px",
            padding: "12px 24px",
            textDecoration: "none",
            transition: "background-color 0.2s ease-out, color 0.2s ease-out",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#FFFFFF";
            e.currentTarget.style.color = "#2D35C9";
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
);

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

  const featured = items.filter((t) => t.featured);
  const standard = items.filter((t) => !t.featured);

  const grouped = standard.reduce<Record<string, MyStackItem[]>>((acc, t) => {
    const key = t.category || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});

  return (
    <>
      <CobaltZone heading="My Stack" subheading="What I'm actually using and why." />

      <section className="bg-background py-10 px-6 sm:px-12">
        <div className="max-w-[1280px] mx-auto">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorState />
          ) : items.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Featured */}
              {featured.length > 0 ? (
                <Reveal>
                  <div className="mb-12 space-y-6">
                    {featured.map((tool) => (
                      <FeaturedCard key={`featured-${tool.name}`} tool={tool} />
                    ))}
                  </div>
                </Reveal>
              ) : (
                <div
                  className="mb-10 font-body"
                  style={{
                    fontSize: "13px",
                    color: "#9A8F82",
                    border: "1px dashed #E8E2D8",
                    borderRadius: "12px",
                    padding: "16px 20px",
                  }}
                >
                  No featured tool currently flagged in the sheet (set <code>featured = true</code> on a row to highlight it here).
                </div>
              )}

              {/* Standard grid grouped by category */}
              <div className="space-y-10">
                {Object.entries(grouped).map(([cat, catTools]) => (
                  <Reveal key={cat}>
                    <div className="flex items-center gap-2 mb-4">
                      <span style={{ width: "8px", height: "8px", backgroundColor: "#C8F04A", borderRadius: "50%", flexShrink: 0 }} />
                      <h2 className="font-heading" style={{ fontWeight: 700, fontSize: "22px", color: "#1A1510", letterSpacing: "-0.02em" }}>
                        {cat}
                      </h2>
                    </div>

                    <RevealGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {catTools.map((tool) => (
                        <RevealItem key={tool.name}>
                          <div
                            className="group hover:shadow-lg transition-all duration-150 overflow-hidden h-full flex flex-col"
                            style={{
                              backgroundColor: "#FFFFFF",
                              border: "0.5px solid #E8E2D8",
                              borderRadius: "12px",
                            }}
                          >
                            <div style={{ height: "4px", backgroundColor: "#C8F04A" }} />

                            <div style={{ padding: "20px" }} className="flex flex-col flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-heading" style={{ fontSize: "16px", fontWeight: 500, color: "#1A1510" }}>
                                  {tool.name}
                                </h3>
                                {tool.category && (
                                  <span className="font-body" style={{ fontSize: "11px", color: "#9A8F82", letterSpacing: "0.04em" }}>
                                    {tool.category}
                                  </span>
                                )}
                                {tool.pricing && (
                                  <span className="font-body ml-auto" style={{ fontSize: "12px", color: "#9A8F82" }}>
                                    {tool.pricing}
                                  </span>
                                )}
                              </div>

                              {tool.what_it_does && (
                                <p className="font-body mt-2" style={{ fontSize: "14px", color: "#1A1510", lineHeight: 1.5 }}>
                                  {tool.what_it_does}
                                </p>
                              )}

                              {tool.verdict && (
                                <>
                                  <hr style={{ border: "none", borderTop: "0.5px solid #E8E2D8", margin: "16px 0" }} />
                                  <p className="font-body" style={{ fontSize: "14px", color: "#1A1510", lineHeight: 1.6 }}>
                                    {tool.verdict}
                                  </p>
                                </>
                              )}

                              {tool.url && (
                                <div className="mt-auto pt-4 flex justify-end">
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
                                    Read more →
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        </RevealItem>
                      ))}
                    </RevealGroup>
                  </Reveal>
                ))}
              </div>
            </>
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
