import { useEffect, useState } from "react";
import { fetchTools, type Tool, CATEGORIES } from "@/lib/sheets";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorState, EmptyState } from "@/components/ErrorState";
import { CobaltZone } from "@/components/CobaltZone";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { SEO } from "@/components/SEO";

import { Search } from "lucide-react";

const Tools = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [expandedVerdicts, setExpandedVerdicts] = useState<Set<string>>(new Set());
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    fetchTools().then((t) => {
      if (t.length === 0 && import.meta.env.VITE_GOOGLE_SHEETS_ID) setError(true);
      setTools(t);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  const toggleVerdict = (name: string) => {
    setExpandedVerdicts((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const filtered = tools.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch = !q || t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || t.what_it_does.toLowerCase().includes(q);
    const matchCat = category === "ALL" || t.category === category;
    return matchSearch && matchCat;
  });

  return (
    <>
      <SEO
        title="AI Toolkit | The Edit"
        description="49 curated AI tools across Writing, Research, Design, Video, Automation and Building. Honest verdicts from someone who uses them."
        canonical="https://theeditai.co.uk/toolkit"
      />
      <CobaltZone
        heading="Tools"
        subheading="Things on my radar. Breadth matters."
      />

      {/* Filter Bar — flush against nav. Mobile: stacked (search + dedicated pills row with edge fade). Desktop: compacts on scroll. */}
      <section
        className={`sticky top-14 sm:top-16 z-40 bg-background border-b transition-[padding,box-shadow,border-color] duration-200 px-4 sm:px-12 ${
          scrolled
            ? "py-2.5 sm:py-3 border-border shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            : "py-3 sm:py-5 border-border/60"
        }`}
      >
        <div
          className={`max-w-[1280px] mx-auto flex flex-col gap-2.5 sm:gap-0 sm:flex-row sm:items-center ${
            scrolled ? "sm:gap-3" : "sm:gap-4"
          }`}
        >
          {/* Search */}
          <div
            className={`relative w-full ${
              scrolled ? "sm:w-[260px] sm:shrink-0" : "sm:max-w-[400px]"
            }`}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              placeholder="Search tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-10 pr-3 bg-card border border-border rounded-lg font-body text-foreground placeholder:text-muted focus:border-primary focus:ring-[3px] focus:ring-primary/[0.12] outline-none transition-all ${
                scrolled ? "py-1.5 text-sm" : "py-2.5 text-[15px]"
              }`}
            />
          </div>

          {/* Category pills row — full-width on mobile with right-edge fade hinting horizontal scroll */}
          <div className="relative w-full sm:flex-1 min-w-0">
            <div
              className={`flex gap-2 flex-nowrap overflow-x-auto no-scrollbar scroll-smooth ${
                scrolled ? "" : "sm:flex-wrap sm:overflow-visible"
              }`}
            >
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`shrink-0 px-3.5 py-1.5 font-body text-xs font-medium uppercase tracking-[0.04em] rounded-full border transition-colors duration-150 ${
                    category === c
                      ? "text-foreground border-transparent"
                      : "bg-transparent border-border text-foreground hover:bg-card"
                  }`}
                  style={category === c ? { backgroundColor: "#C8F04A" } : undefined}
                >
                  {c}
                </button>
              ))}
            </div>
            {/* Edge fade — visible on mobile (and desktop while scrolled, where pills also scroll) */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute top-0 right-0 h-full w-10 bg-gradient-to-l from-background to-transparent ${
                scrolled ? "" : "sm:hidden"
              }`}
            />
          </div>
        </div>
      </section>

      {/* Tool Grid */}
      <section className="bg-background py-10 px-6 sm:px-12">
        <div className="max-w-[1280px] mx-auto">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorState />
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <RevealGroup
              key={`${category}-${search}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((tool) => {
                const isSelected = hoveredCard === tool.name;
                const isExpanded = expandedVerdicts.has(tool.name);
                const isDimmed = hoveredCard && !isSelected;

                return (
                  <RevealItem key={tool.name}>
                    <div
                      onMouseEnter={() => setHoveredCard(tool.name)}
                      onMouseLeave={() => setHoveredCard(null)}
                      className={`rounded-xl border p-5 flex flex-col h-full transition-all duration-200 ${
                        isDimmed ? "opacity-70 scale-[0.98]" : ""
                      }`}
                      style={
                        isSelected
                          ? {
                              backgroundColor: "#2D35C9",
                              borderColor: "#2D35C9",
                              color: "#FAF8F4",
                              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                            }
                          : {
                              backgroundColor: "#FFFFFF",
                              borderColor: "#E8E2D8",
                            }
                      }
                    >
                      {/* Tool name as link */}
                      {tool.url ? (
                        <a
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-heading font-semibold text-xl no-underline"
                          style={{ color: isSelected ? "#FAF8F4" : "#1A1510" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {tool.name}
                        </a>
                      ) : (
                        <h3
                          className="font-heading font-semibold text-xl"
                          style={{ color: isSelected ? "#FAF8F4" : "#1A1510" }}
                        >
                          {tool.name}
                        </h3>
                      )}

                      {/* Category + Status badges */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span
                          className="inline-block px-2.5 py-0.5 font-body text-[11px] font-semibold uppercase tracking-[0.05em] rounded-full"
                          style={
                            isSelected
                              ? { backgroundColor: "#9B9FE0", color: "#FFFFFF" }
                              : { backgroundColor: "#EEF0FB", color: "#2D35C9" }
                          }
                        >
                          {tool.category}
                        </span>
                        {tool.status && (
                          <span
                            className="inline-block px-2.5 py-0.5 font-body text-[11px] font-semibold uppercase tracking-[0.05em] rounded-full"
                            style={
                              isSelected
                                ? { backgroundColor: "rgba(250,248,244,0.15)", color: "#FAF8F4" }
                                : tool.status === "in_stack"
                                ? { backgroundColor: "#2D6A4F", color: "#FFFFFF" }
                                : { backgroundColor: "#2D35C9", color: "#FFFFFF" }
                            }
                          >
                            {tool.status === "in_stack" ? "IN MY STACK" : "ON MY RADAR"}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p
                        className="mt-3 font-body text-sm leading-relaxed line-clamp-2"
                        style={{ color: isSelected ? "#FAF8F4" : "#1A1510" }}
                      >
                        {tool.what_it_does}
                      </p>

                      {/* Pricing */}
                      {tool.pricing && (
                        <p className="mt-2 font-body text-[13px]" style={{ color: isSelected ? "rgba(250,248,244,0.6)" : "#9A8F82" }}>
                          {tool.pricing}
                        </p>
                      )}

                      {/* Verdict button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleVerdict(tool.name);
                        }}
                        className="mt-auto pt-3 text-left font-body font-medium text-[13px] transition-colors"
                        style={{ color: isSelected ? "#C8F04A" : "#9B9FE0" }}
                      >
                        {isExpanded ? "Honest verdict ↑" : "Honest verdict ↓"}
                      </button>

                      {/* Expanded verdict */}
                      {isExpanded && tool.verdict && (
                        <div
                          className="mt-3 pt-4 font-body text-sm leading-relaxed"
                          style={{
                            borderLeft: "4px solid #9B9FE0",
                            paddingLeft: 16,
                            color: isSelected ? "#FAF8F4" : "#1A1510",
                          }}
                        >
                          {tool.verdict}
                        </div>
                      )}

                      {/* Visit tool button — lime pill */}
                      {tool.url && (
                        <div className="mt-3 flex justify-end">
                          <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="font-body inline-block"
                            style={{
                              fontSize: "13px",
                              fontWeight: 500,
                              color: isSelected ? "#2D35C9" : "#1A1510",
                              backgroundColor: isSelected ? "#FAF8F4" : "#C8F04A",
                              borderRadius: "20px",
                              padding: "10px 20px",
                              transition: "background-color 0.2s ease-out, color 0.2s ease-out",
                              textDecoration: "none",
                            }}
                            onMouseEnter={(e) => {
                              if (isSelected) {
                                e.currentTarget.style.backgroundColor = "#C8F04A";
                                e.currentTarget.style.color = "#1A1510";
                              } else {
                                e.currentTarget.style.backgroundColor = "#2D35C9";
                                e.currentTarget.style.color = "#FFFFFF";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (isSelected) {
                                e.currentTarget.style.backgroundColor = "#FAF8F4";
                                e.currentTarget.style.color = "#2D35C9";
                              } else {
                                e.currentTarget.style.backgroundColor = "#C8F04A";
                                e.currentTarget.style.color = "#1A1510";
                              }
                            }}
                          >
                            Visit tool →
                          </a>
                        </div>
                      )}
                    </div>
                  </RevealItem>
                );
              })}
            </RevealGroup>
          )}
        </div>
      </section>
    </>
  );
};

export default Tools;
