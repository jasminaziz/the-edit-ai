import { useEffect, useState } from "react";
import { fetchTools, type Tool, CATEGORIES, STATUS_MAP } from "@/lib/sheets";
import { StatusBadge } from "@/components/StatusBadge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorState, EmptyState } from "@/components/ErrorState";
import { CobaltZone } from "@/components/CobaltZone";

import { Search } from "lucide-react";

const STATUS_FILTERS = ["ALL", "in_stack", "trialling", "queued", "watch", "know_about"];

const Tools = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [expandedVerdicts, setExpandedVerdicts] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchTools().then((t) => {
      if (t.length === 0 && import.meta.env.VITE_GOOGLE_SHEETS_ID) setError(true);
      setTools(t);
      setLoading(false);
    });
  }, []);

  const toggleVerdict = (name: string) => {
    setExpandedVerdicts((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const handleCardClick = (_name: string) => {
    // Card click no longer selects — cobalt state is hover-only
  };

  const filtered = tools.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch = !q || t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || t.what_it_does.toLowerCase().includes(q);
    const matchCat = category === "ALL" || t.category === category;
    const matchStatus = statusFilter === "ALL" || t.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <>
      <CobaltZone heading="Tools" />

      {/* Filter Bar */}
      <section className="sticky top-16 z-40 bg-background py-5 px-6 sm:px-12 border-b border-border">
        <div className="max-w-[1280px] mx-auto space-y-4">
          {/* Search */}
          <div className="relative max-w-[400px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              placeholder="Search tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg font-body text-[15px] text-foreground placeholder:text-muted focus:border-primary focus:ring-[3px] focus:ring-primary/[0.12] outline-none transition-all"
            />
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3.5 py-1.5 font-body text-xs font-medium uppercase tracking-[0.04em] rounded-full border transition-colors duration-150 ${
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

          {/* Status pills */}
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((s) => {
              const config = STATUS_MAP[s];
              const label = s === "ALL" ? "ALL" : config?.label || s;
              const isActive = statusFilter === s;
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className="px-3.5 py-1.5 font-body text-xs font-medium uppercase tracking-[0.04em] rounded-full border transition-colors duration-150"
                  style={
                    isActive
                      ? { backgroundColor: config?.bg || "#2D35C9", color: "#FFFFFF", borderColor: "transparent" }
                      : { backgroundColor: "transparent", color: config?.bg || "#1A1510", borderColor: config ? `${config.bg}80` : "#E8E2D8" }
                  }
                >
                  {label}
                </button>
              );
            })}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((tool) => {
                const isSelected = hoveredCard === tool.name;
                const isExpanded = expandedVerdicts.has(tool.name);
                const isDimmed = hoveredCard && !isSelected;
                const statusConfig = STATUS_MAP[tool.status];

                return (
                  <div
                    key={tool.name}
                    onMouseEnter={() => setHoveredCard(tool.name)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className={`rounded-xl border p-5 flex flex-col transition-all duration-200 ${
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

                    {/* Status badge */}
                    <div className="mt-2">
                      {isSelected ? (
                        <span
                          className="inline-block px-2.5 py-1 font-body text-[11px] font-semibold rounded-full uppercase tracking-[0.05em]"
                          style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#FAF8F4" }}
                        >
                          {statusConfig?.label}
                        </span>
                      ) : (
                        <StatusBadge status={tool.status} />
                      )}
                    </div>

                    {/* Category badge */}
                    <span
                      className="inline-block self-start mt-2 px-2.5 py-0.5 font-body text-[11px] font-semibold uppercase tracking-[0.05em] rounded-full"
                      style={
                        isSelected
                          ? { backgroundColor: "#9B9FE0", color: "#FFFFFF" }
                          : { backgroundColor: "#EEF0FB", color: "#2D35C9" }
                      }
                    >
                      {tool.category}
                    </span>

                    {/* Description */}
                    <p
                      className="mt-3 font-body text-sm leading-relaxed line-clamp-2"
                      style={{ color: isSelected ? "#FAF8F4" : "#1A1510" }}
                    >
                      {tool.what_it_does}
                    </p>

                    {/* Cost */}
                    <p className="mt-2 font-body text-[13px]" style={{ color: isSelected ? "rgba(250,248,244,0.6)" : "#9A8F82" }}>
                      {tool.free_tier && <span>Free tier: {tool.free_tier}</span>}
                      {tool.free_tier && tool.cost && <span> · </span>}
                      {tool.cost && <span>{tool.cost}</span>}
                    </p>

                    {/* Credibility */}
                    {tool.credibility && (
                      <p className="mt-2 font-body font-semibold text-[13px]" style={{ color: "#C8F04A" }}>
                        {tool.credibility}
                      </p>
                    )}

                    {/* Verdict button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVerdict(tool.name);
                      }}
                      className="mt-auto pt-3 text-left font-body font-medium text-[13px] transition-colors"
                      style={{ color: "#C8F04A" }}
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

                    {/* Visit tool button */}
                    {tool.url && (
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-center gap-[6px] w-full rounded-lg font-body font-semibold text-[13px] transition-all duration-150"
                        style={{
                          height: 40,
                          marginTop: 12,
                          letterSpacing: "0.02em",
                          border: isSelected ? "1px solid rgba(250,248,244,0.4)" : "1px solid #E8E2D8",
                          color: isSelected ? "rgba(250,248,244,0.7)" : "#9A8F82",
                          backgroundColor: "transparent",
                        }}
                        onMouseEnter={(e) => {
                          if (isSelected) {
                            e.currentTarget.style.backgroundColor = "rgba(250,248,244,0.1)";
                            e.currentTarget.style.color = "#FAF8F4";
                          } else {
                            e.currentTarget.style.backgroundColor = "#FAF8F4";
                            e.currentTarget.style.borderColor = "#2D35C9";
                            e.currentTarget.style.color = "#2D35C9";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.borderColor = isSelected ? "rgba(250,248,244,0.4)" : "#E8E2D8";
                          e.currentTarget.style.color = isSelected ? "rgba(250,248,244,0.7)" : "#9A8F82";
                        }}
                      >
                        Visit tool →
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Tools;
