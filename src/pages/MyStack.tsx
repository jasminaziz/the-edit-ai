import { useEffect, useState } from "react";
import { fetchMyStack, type MyStackItem } from "@/lib/sheets";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorState, EmptyState } from "@/components/ErrorState";
import { CobaltZone } from "@/components/CobaltZone";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { AnimatePresence, motion } from "framer-motion";

// Claude starburst mark — accurate 4-pointed asymmetric petal logo
const ClaudeStar = ({ size = 12, color = "#C8F04A" }: { size?: number; color?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    aria-hidden="true"
    style={{ display: "block" }}
  >
    <path
      fill={color}
      d="M100 0 C104 52 108 64 122 78 C136 92 148 96 200 100 C148 104 136 108 122 122 C108 136 104 148 100 200 C96 148 92 136 78 122 C64 108 52 104 0 100 C52 96 64 92 78 78 C92 64 96 52 100 0 Z"
    />
  </svg>
);

const FeaturedCard = ({ tool }: { tool: MyStackItem }) => {
  const [open, setOpen] = useState(false);
  const hasMore = Boolean(tool.verdict);

  return (
    <div
      style={{
        backgroundColor: "#2D35C9",
        borderRadius: "16px",
        padding: "24px",
        color: "#FFFFFF",
        width: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative Claude star on the right */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: "-30px",
          top: "50%",
          transform: "translateY(-50%) rotate(12deg)",
          opacity: 0.22,
          pointerEvents: "none",
        }}
        className="hidden sm:block"
      >
        <ClaudeStar size={180} color="#C8F04A" />
      </div>

      <div style={{ position: "relative", zIndex: 1 }} className="sm:pr-32">
        <div className="flex items-center gap-2 mb-3">
          <div
            className="flex items-center gap-1.5"
            style={{
              padding: "4px 10px 4px 8px",
              borderRadius: "999px",
              border: "1px solid rgba(200, 240, 74, 0.4)",
              backgroundColor: "transparent",
            }}
            aria-label="Featured tool"
          >
            <ClaudeStar size={11} color="#C8F04A" />
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
        </div>

        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2
            className="font-heading"
            style={{
              fontSize: "clamp(24px, 3.2vw, 32px)",
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
            className="font-body mt-3"
            style={{ fontSize: "14px", color: "#FFFFFF", lineHeight: 1.55, opacity: 0.95 }}
          >
            {tool.what_it_does}
          </p>
        )}

        <AnimatePresence initial={false}>
          {open && tool.verdict && (
            <motion.div
              key="featured-verdict"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{ overflow: "hidden" }}
            >
              <hr style={{ border: "none", borderTop: "1px solid rgba(200,240,74,0.35)", margin: "16px 0" }} />
              <p
                className="font-body"
                style={{ fontSize: "14px", color: "#FFFFFF", lineHeight: 1.65, whiteSpace: "pre-wrap" }}
              >
                {tool.verdict}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
          {hasMore ? (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="font-body"
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#C8F04A",
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
              aria-expanded={open}
            >
              {open ? "− Less" : "+ More"}
            </button>
          ) : (
            <span />
          )}

          {tool.url && (
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body inline-block"
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#1A1510",
                backgroundColor: "#C8F04A",
                borderRadius: "999px",
                padding: "10px 20px",
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
          )}
        </div>
      </div>
    </div>
  );
};

const StackCard = ({ tool }: { tool: MyStackItem }) => {
  const [open, setOpen] = useState(false);
  const hasMore = Boolean(tool.verdict);

  return (
    <div
      className="group transition-all duration-200 overflow-hidden h-full flex"
      style={{
        backgroundColor: "#FFFFFF",
        border: open ? "0.5px solid #2D35C9" : "0.5px solid #E8E2D8",
        borderRadius: "12px",
        boxShadow: open ? "0 8px 24px rgba(45, 53, 201, 0.12)" : "none",
      }}
    >
      {/* Left accent bar — thickens and shifts to cobalt when open */}
      <div
        style={{
          width: open ? "6px" : "4px",
          backgroundColor: open ? "#2D35C9" : "#C8F04A",
          flexShrink: 0,
          transition: "width 0.2s ease-out, background-color 0.2s ease-out",
        }}
      />

      <div style={{ padding: "20px" }} className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-heading" style={{ fontSize: "16px", fontWeight: 500, color: "#1A1510" }}>
            {tool.name}
          </h3>
          {tool.pricing && (
            <span className="font-body ml-auto" style={{ fontSize: "12px", color: "#9A8F82" }}>
              {tool.pricing}
            </span>
          )}
        </div>

        {tool.what_it_does && (
          <p
            className="font-body mt-2"
            style={{
              fontSize: "14px",
              color: "#1A1510",
              lineHeight: 1.5,
              ...(open
                ? {}
                : {
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical" as const,
                    overflow: "hidden",
                  }),
            }}
          >
            {tool.what_it_does}
          </p>
        )}

        <AnimatePresence initial={false}>
          {open && tool.verdict && (
            <motion.div
              key="verdict"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{ overflow: "hidden" }}
            >
              <hr style={{ border: "none", borderTop: "0.5px solid #C8F04A", margin: "16px 0" }} />
              <p
                className="font-body"
                style={{ fontSize: "14px", color: "#1A1510", lineHeight: 1.6, whiteSpace: "pre-wrap" }}
              >
                {tool.verdict}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-auto pt-4 flex items-center justify-between gap-3">
          {hasMore ? (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="font-body"
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#2D35C9",
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
                letterSpacing: "0.04em",
              }}
              aria-expanded={open}
            >
              {open ? "− Less" : "+ More"}
            </button>
          ) : (
            <span />
          )}

          {tool.url && (
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
          )}
        </div>
      </div>
    </div>
  );
};

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
                          <StackCard tool={tool} />
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
