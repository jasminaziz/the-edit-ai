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

/**
 * Ruled 30 Aug 2026: the five-hue category map is retired.
 *
 * It assigned a colour per category, two of which were off palette entirely
 * (#4A4A9A had never been documented, and CLAUDE.md said burnt orange #E8572A
 * "renders nowhere" while it rendered here), and two of which failed AA at
 * badge size: white on periwinkle and white on burnt orange both measured
 * 3.60:1 against a 4.5:1 requirement.
 *
 * Categories now share the locked chip pairing, cobalt on the #EEF0FB tint at
 * 7.50:1, the same treatment the ToolCard job chips use. The label carries the
 * meaning, which is what the never-colour-alone rule requires anyway, and the
 * grid stops reading as confetti sorted by a taxonomy no comms reader browses
 * by. The colour block on each card becomes cobalt, so the card keeps its
 * visual anchor in one brand colour rather than five.
 *
 * The hero pills in HomeGravity.tsx carried the same two colours and were
 * ruled separately later the same day: both are gone from there too.
 */
const CARD_BLOCK = "#2D35C9";

/**
 * One chip for every category. It carries its own ground and a 1px border, so
 * it holds its contrast on the white card body and on the cobalt block alike,
 * which is the same reason the DPIA chips hold through the ToolCard inversion.
 * That removes the need for the old inverted variant.
 */
function CategoryBadge({ category }: { category: string }) {
  if (!category) return null;
  return (
    <span
      className="inline-block uppercase"
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 600,
        fontSize: 11,
        letterSpacing: "0.1em",
        borderRadius: 4,
        padding: "5px 10px",
        backgroundColor: "#EEF0FB",
        color: "#2D35C9",
        border: "1px solid #2D35C9",
      }}
    >
      {category}
    </span>
  );
}

/** Pill-style toggle so it's obviously clickable and won't overlap text. */
function ExpandToggle({ expanded, onClick }: { expanded: boolean; onClick: (e: React.MouseEvent) => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 select-none"
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 600,
        fontSize: 12,
        color: "#2D35C9",
        backgroundColor: "#EEF0FB",
        border: "1px solid #E8E2D8",
        borderRadius: 999,
        padding: "6px 12px",
        minHeight: 32,
        cursor: "pointer",
        transition: "background-color 150ms ease, color 150ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#1A1510";
        e.currentTarget.style.color = "#FFFFFF";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#EEF0FB";
        e.currentTarget.style.color = "#2D35C9";
      }}
      aria-expanded={expanded}
      aria-label={expanded ? "Show less" : "Show more"}
    >
      {expanded ? "↑ Less" : "↓ More"}
    </button>
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

/** Bolder developer label — provider name should pop. */
function DeveloperLabel({ developer, size = "default" }: { developer: string; size?: "default" | "small" }) {
  if (!developer) return null;
  return (
    <p
      className="uppercase"
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 600,
        fontSize: size === "small" ? 12 : 13,
        letterSpacing: "0.1em",
        color: "#1A1510",
        marginBottom: 6,
      }}
    >
      {developer}
    </p>
  );
}

/* ──────────────────────── LEAD CARD ──────────────────────── */

export function LeadCard({ item }: { item: WhatsNew }) {
  const [expanded, setExpanded] = useState(false);
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
      {/* Desktop colour zone — slimmer (was 35%) */}
      <div
        className="shrink-0 hidden sm:block"
        style={{
          width: "22%",
          backgroundColor: CARD_BLOCK,
          borderRadius: "8px 0 0 8px",
          minHeight: 180,
        }}
      />
      {/* Mobile colour bar — much smaller (was 120px) */}
      <div
        className="sm:hidden shrink-0"
        style={{ height: 56, backgroundColor: CARD_BLOCK, borderRadius: "8px 8px 0 0" }}
      />

      {/* Content zone — extra bottom padding so toggle never overlaps text */}
      <div
        className="relative flex-1"
        style={{
          backgroundColor: "#FFFFFF",
          padding: "20px 20px 64px 20px",
        }}
      >
        {/* Category badge top-right */}
        <div className="absolute" style={{ top: 14, right: 14 }}>
          <CategoryBadge category={item.category} />
        </div>

        {/* Reserve right-side space on the first rows so badge never collides */}
        <div style={{ paddingRight: 110 }}>
          <DeveloperLabel developer={item.developer} />
        </div>

        {displayDate && (
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 400,
              fontSize: 12,
              color: "hsl(var(--text-secondary))",
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
            fontSize: 22,
            lineHeight: 1.25,
            color: "#1A1510",
            textWrap: "balance",
            marginBottom: 8,
          }}
        >
          {item.name}
        </h3>

        <div style={{ transition: "height 300ms ease-in-out, opacity 300ms ease-in-out" }}>
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

        {/* Expand toggle bottom-right — pill button, doesn't overlap content */}
        <div className="absolute" style={{ bottom: 14, right: 14 }}>
          <ExpandToggle
            expanded={expanded}
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((p) => !p);
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────── GRID CARD ──────────────────────── */

export function GridCard({ item }: { item: WhatsNew }) {
  const [expanded, setExpanded] = useState(false);
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
      {/* Colour zone — reduced from 120px to 64px to save vertical space */}
      <div
        className="relative shrink-0"
        style={{
          height: 64,
          backgroundColor: CARD_BLOCK,
          borderRadius: "8px 8px 0 0",
        }}
      >
        {/* Category badge bottom-left, inverted for contrast */}
        <div className="absolute" style={{ bottom: 8, left: 10 }}>
          <CategoryBadge category={item.category} />
        </div>
      </div>

      {/* Card body — extra bottom padding for the toggle */}
      <div
        className="relative flex-1 flex flex-col"
        style={{
          backgroundColor: "#FFFFFF",
          padding: "16px 18px 56px 18px",
          border: "1px solid #E8E2D8",
          borderTop: "none",
          borderRadius: "0 0 8px 8px",
        }}
      >
        <DeveloperLabel developer={item.developer} size="small" />

        {displayDate && (
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 400,
              fontSize: 11,
              color: "hsl(var(--text-secondary))",
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

        <div style={{ transition: "height 300ms ease-in-out, opacity 300ms ease-in-out" }}>
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

        {/* Expand toggle — pill, clearly clickable */}
        <div className="absolute" style={{ bottom: 12, right: 12 }}>
          <ExpandToggle
            expanded={expanded}
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((p) => !p);
            }}
          />
        </div>
      </div>
    </div>
  );
}
