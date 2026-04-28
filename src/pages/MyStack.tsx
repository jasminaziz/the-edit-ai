import { useEffect, useState } from "react";
import { fetchMyStack, type MyStackItem } from "@/lib/sheets";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorState, EmptyState } from "@/components/ErrorState";
import { CobaltZone } from "@/components/CobaltZone";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { AnimatePresence, motion } from "framer-motion";

// Official Claude AI symbol — path data from Wikimedia Commons (Anthropic brand mark)
const CLAUDE_PATH =
  "M 233.959793 800.214905 L 468.644287 668.536987 L 472.590637 657.100647 L 468.644287 650.738403 L 457.208069 650.738403 L 417.986633 648.322144 L 283.892639 644.69812 L 167.597321 639.865845 L 54.926208 633.825623 L 26.577238 627.785339 L 3.3e-05 592.751709 L 2.73832 575.27533 L 26.577238 559.248352 L 60.724873 562.228149 L 136.187973 567.382629 L 249.422867 575.194763 L 331.570496 580.026978 L 453.261841 592.671082 L 472.590637 592.671082 L 475.328857 584.859009 L 468.724915 580.026978 L 463.570557 575.194763 L 346.389313 495.785217 L 219.543671 411.865906 L 153.100723 363.543762 L 117.181267 339.060425 L 99.060455 316.107361 L 91.248367 266.01355 L 123.865784 230.093994 L 167.677887 233.073853 L 178.872513 236.053772 L 223.248367 270.201477 L 318.040283 343.570496 L 441.825592 434.738342 L 459.946411 449.798706 L 467.194672 444.64447 L 468.080597 441.020203 L 459.946411 427.409485 L 392.617493 305.718323 L 320.778564 181.932983 L 288.80542 130.630859 L 280.348999 99.865845 C 277.369171 87.221436 275.194641 76.590698 275.194641 63.624268 L 312.322174 13.20813 L 332.8591 6.604126 L 382.389313 13.20813 L 403.248352 31.328979 L 434.013519 101.71814 L 483.865753 212.537048 L 561.181274 363.221497 L 583.812134 407.919434 L 595.892639 449.315491 L 600.40271 461.959839 L 608.214783 461.959839 L 608.214783 454.711609 L 614.577271 369.825623 L 626.335632 265.61084 L 637.771851 131.516846 L 641.718201 93.745117 L 660.402832 48.483276 L 697.530334 24.000122 L 726.52356 37.852417 L 750.362549 72 L 747.060486 94.067139 L 732.886047 186.201416 L 705.100708 330.52356 L 686.979919 427.167847 L 697.530334 427.167847 L 709.61084 415.087341 L 758.496704 350.174561 L 840.644348 247.490051 L 876.885925 206.738342 L 919.167847 161.71814 L 946.308838 140.29541 L 997.61084 140.29541 L 1035.38269 196.429626 L 1018.469849 254.416199 L 965.637634 321.422852 L 921.825562 378.201538 L 859.006714 462.765259 L 819.785278 530.41626 L 823.409424 535.812073 L 832.75177 534.92627 L 974.657776 504.724915 L 1051.328979 490.872559 L 1142.818848 475.167786 L 1184.214844 494.496582 L 1188.724854 514.147644 L 1172.456421 554.335693 L 1074.604126 578.496765 L 959.838989 601.449829 L 788.939636 641.879272 L 786.845764 643.409485 L 789.261841 646.389343 L 866.255127 653.637634 L 899.194702 655.409424 L 979.812134 655.409424 L 1129.932861 666.604187 L 1169.154419 692.537109 L 1192.671265 724.268677 L 1188.724854 748.429688 L 1128.322144 779.194641 L 1046.818848 759.865845 L 856.590759 714.604126 L 791.355774 698.335754 L 782.335693 698.335754 L 782.335693 703.731567 L 836.69812 756.885986 L 936.322205 846.845581 L 1061.073975 962.81897 L 1067.436279 991.490112 L 1051.409424 1014.120911 L 1034.496704 1011.704712 L 924.885986 929.234924 L 882.604126 892.107544 L 786.845764 811.48999 L 780.483276 811.48999 L 780.483276 819.946289 L 802.550415 852.241699 L 919.087341 1027.409424 L 925.127625 1081.127686 L 916.671204 1098.604126 L 886.469849 1109.154419 L 853.288696 1103.114136 L 785.073914 1007.355835 L 714.684631 899.516785 L 657.906067 802.872498 L 650.979858 806.81897 L 617.476624 1167.704834 L 601.771851 1186.147705 L 565.530212 1200 L 535.328857 1177.046997 L 519.302124 1139.919556 L 535.328857 1066.550537 L 554.657776 970.792053 L 570.362488 894.68457 L 584.536926 800.134277 L 592.993347 768.724976 L 592.429626 766.630859 L 585.503479 767.516968 L 514.22821 865.369263 L 405.825531 1011.865906 L 320.053711 1103.677979 L 299.516815 1111.812256 L 263.919525 1093.369263 L 267.221497 1060.429688 L 287.114136 1031.114136 L 405.825531 880.107361 L 477.422913 786.52356 L 523.651062 732.483276 L 523.328918 724.671265 L 520.590698 724.671265 L 205.288605 929.395935 L 149.154434 936.644409 L 124.993355 914.01355 L 127.973183 876.885986 L 139.409409 864.80542 L 234.201385 799.570435 L 233.879227 799.8927 Z";

const ClaudeStar = ({ size = 12, color = "#C8F04A", pulse = true }: { size?: number; color?: string; pulse?: boolean }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 1200 1200"
    aria-hidden="true"
    style={{
      display: "block",
      animation: pulse ? "claude-pulse 3s ease-in-out infinite" : undefined,
    }}
  >
    <path fill={color} d={CLAUDE_PATH} />
    <style>{`
      @keyframes claude-pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.03); opacity: 0.9; }
      }
    `}</style>
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
        padding: "28px",
        color: "#FFFFFF",
        width: "100%",
        position: "relative",
      }}
    >
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 sm:items-stretch">
        {/* Text column */}
        <div className="flex-1 min-w-0 flex flex-col">
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

        {/* Claude mark column — sits beside text on desktop, top-right on mobile */}
        <div
          aria-hidden="true"
          className="hidden sm:flex shrink-0 items-center justify-center"
          style={{
            width: "140px",
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.18))",
          }}
        >
          <ClaudeStar size={140} color="#C8F04A" />
        </div>
        <div
          aria-hidden="true"
          className="sm:hidden absolute"
          style={{ right: "20px", top: "20px", pointerEvents: "none" }}
        >
          <ClaudeStar size={48} color="#C8F04A" />
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
            style={{ fontSize: "14px", color: "#1A1510", lineHeight: 1.5 }}
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
            directly from that data, so what you see here is always current.
          </p>
        </div>
      </section>
    </>
  );
};

export default MyStack;
