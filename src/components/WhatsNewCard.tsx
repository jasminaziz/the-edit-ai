import { useState } from "react";
import { type WhatsNew } from "@/lib/sheets";

/** Parse a date string, handling range formats like "Feb 17–18, 2026" */
export function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  let d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d;
  const cleaned = dateStr.replace(/[–—-]\s*\d+/, "");
  d = new Date(cleaned);
  if (!isNaN(d.getTime())) return d;
  return null;
}

/** Extract MMMM YYYY from a date string for grouping */
export function monthYearKey(dateStr: string): string | null {
  const d = parseDate(dateStr);
  if (!d) return null;
  return d.toLocaleString("en-GB", { month: "long", year: "numeric" });
}

function formatDate(raw: string): string {
  if (!raw) return "";
  const d = parseDate(raw);
  if (!d) return raw;
  const day = d.getDate().toString().padStart(2, "0");
  const month = d.toLocaleString("en-GB", { month: "short" });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

const CATEGORY_COLOURS: Record<string, string> = {
  "New Release": "#2D35C9",
  "Model Update": "#7B7FD4",
  "Tool Launch": "#2D6A4F",
  "Integration": "#4A4A9A",
  "AI in the News": "#E8572A",
};

function getCategoryColour(category: string): string {
  return CATEGORY_COLOURS[category] || "#7B7FD4";
}

function CategoryBadge({ category }: { category: string }) {
  if (!category) return null;
  const bg = getCategoryColour(category);
  const isLime = category === "Tool Launch";
  return (
    <span
      className="inline-block uppercase"
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 600,
        fontSize: 10,
        letterSpacing: "0.06em",
        borderRadius: 4,
        padding: "3px 8px",
        backgroundColor: bg,
        color: isLime ? "#1A1510" : "#FFFFFF",
      }}
    >
      {category}
    </span>
  );
}

function ExpandToggle({ expanded }: { expanded: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1 select-none cursor-pointer"
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 12,
        color: "#9A8F82",
        minWidth: 40,
        minHeight: 40,
        justifyContent: "center",
        transition: "opacity 200ms ease, transform 200ms ease",
      }}
    >
      {expanded ? "↑ Less" : "↓ More"}
    </span>
  );
}

function ReadMoreButton({ url }: { url: string }) {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="inline-block"
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 500,
        fontSize: 13,
        backgroundColor: "#C8F04A",
        color: "#1A1510",
        borderRadius: 20,
        padding: "10px 20px",
        textDecoration: "none",
        marginTop: 16,
        transition: "background-color 200ms ease-out, color 200ms ease-out",
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
  );
}

/* ──────────────────────── LEAD CARD ──────────────────────── */

export function LeadCard({ item }: { item: WhatsNew }) {
  const [expanded, setExpanded] = useState(false);
  const colour = getCategoryColour(item.category);
  const displayDate = formatDate(item.date);

  return (
    <div
      onClick={() => setExpanded((p) => !p)}
      className="cursor-pointer overflow-hidden flex flex-col sm:flex-row"
      style={{
        border: "1px solid #E8E2D8",
        borderRadius: 8,
        transition: expanded
          ? "none"
          : "transform 200ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 200ms cubic-bezier(0.34,1.56,0.64,1)",
      }}
      onMouseEnter={(e) => {
        if (!expanded) {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Colour zone */}
      <div
        className="shrink-0 hidden sm:block"
        style={{
          width: "35%",
          backgroundColor: colour,
          borderRadius: "8px 0 0 8px",
          minHeight: 200,
        }}
      />
      {/* Mobile colour bar */}
      <div
        className="sm:hidden shrink-0"
        style={{ height: 120, backgroundColor: colour, borderRadius: "8px 8px 0 0" }}
      />

      {/* Content zone */}
      <div className="relative flex-1 p-8" style={{ backgroundColor: "#FFFFFF" }}>
        {/* Category badge top-right */}
        <div className="absolute" style={{ top: 16, right: 16 }}>
          <CategoryBadge category={item.category} />
        </div>

        {item.developer && (
          <p
            className="uppercase"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 400,
              fontSize: 12,
              letterSpacing: "0.08em",
              color: "#9A8F82",
              marginBottom: 12,
            }}
          >
            {item.developer}
          </p>
        )}

        {displayDate && (
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 400,
              fontSize: 12,
              color: "#9A8F82",
              marginBottom: 12,
            }}
          >
            {displayDate}
          </p>
        )}

        <h3
          className="font-heading"
          style={{
            fontWeight: 700,
            fontSize: 24,
            color: "#1A1510",
            textWrap: "balance",
            marginBottom: 8,
          }}
        >
          {item.name}
        </h3>

        <div
          style={{
            transition: "height 300ms ease-in-out, opacity 300ms ease-in-out",
          }}
        >
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 400,
              fontSize: 15,
              color: "#1A1510",
              lineHeight: 1.7,
              textWrap: "pretty",
              display: "-webkit-box",
              WebkitLineClamp: expanded ? 9999 : 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {item.what_it_is}
          </p>

          {expanded && (
            <div style={{ opacity: 1, transition: "opacity 300ms ease-in-out" }}>
              <hr style={{ borderColor: "#E8E2D8", margin: "16px 0" }} />
              <ReadMoreButton url={item.url} />
            </div>
          )}
        </div>

        {/* Expand chevron bottom-right */}
        <div className="absolute" style={{ bottom: 16, right: 16 }}>
          <ExpandToggle expanded={expanded} />
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────── GRID CARD ──────────────────────── */

export function GridCard({ item }: { item: WhatsNew }) {
  const [expanded, setExpanded] = useState(false);
  const colour = getCategoryColour(item.category);
  const displayDate = formatDate(item.date);

  return (
    <div
      onClick={() => setExpanded((p) => !p)}
      className="cursor-pointer flex flex-col"
      style={{
        transition: expanded
          ? "none"
          : "transform 200ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 200ms cubic-bezier(0.34,1.56,0.64,1)",
      }}
      onMouseEnter={(e) => {
        if (!expanded) {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Colour zone */}
      <div
        className="relative shrink-0"
        style={{
          height: 120,
          backgroundColor: colour,
          borderRadius: "8px 8px 0 0",
        }}
      >
        {/* Category badge bottom-left */}
        <div className="absolute" style={{ bottom: 10, left: 10 }}>
          <CategoryBadge category={item.category} />
        </div>
      </div>

      {/* Card body */}
      <div
        className="relative flex-1 flex flex-col"
        style={{
          backgroundColor: "#FFFFFF",
          padding: 20,
          border: "1px solid #E8E2D8",
          borderTop: "none",
          borderRadius: "0 0 8px 8px",
        }}
      >
        {item.developer && (
          <p
            className="uppercase"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 400,
              fontSize: 11,
              letterSpacing: "0.08em",
              color: "#9A8F82",
              marginBottom: 6,
            }}
          >
            {item.developer}
          </p>
        )}

        {displayDate && (
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 400,
              fontSize: 11,
              color: "#9A8F82",
              marginBottom: 8,
            }}
          >
            {displayDate}
          </p>
        )}

        <h3
          className="font-heading"
          style={{
            fontWeight: 600,
            fontSize: 17,
            lineHeight: 1.3,
            color: "#1A1510",
            textWrap: "balance",
            marginBottom: 10,
          }}
        >
          {item.name}
        </h3>

        <div
          style={{
            transition: "height 300ms ease-in-out, opacity 300ms ease-in-out",
          }}
        >
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 400,
              fontSize: 13,
              color: "#1A1510",
              lineHeight: 1.6,
              textWrap: "pretty",
              display: "-webkit-box",
              WebkitLineClamp: expanded ? 9999 : 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {item.what_it_is}
          </p>

          {expanded && (
            <div style={{ opacity: 1, transition: "opacity 300ms ease-in-out" }}>
              <hr style={{ borderColor: "#E8E2D8", margin: "16px 0" }} />
              <ReadMoreButton url={item.url} />
            </div>
          )}
        </div>

        {/* Expand chevron bottom-right */}
        <div className="absolute" style={{ bottom: 12, right: 12 }}>
          <ExpandToggle expanded={expanded} />
        </div>
      </div>
    </div>
  );
}
