import { ReactNode } from "react";

interface CobaltZoneProps {
  heading: string;
  subheading?: string;
  bodyText?: string;
  illustration?: ReactNode;
  rightBadge?: string | { text: string; url: string };
  twoLineHeading?: { line1: string; line2: string; line2Color?: string; inline?: boolean };
}

export function CobaltZone({ heading, subheading, bodyText, illustration, rightBadge, twoLineHeading }: CobaltZoneProps) {
  const badge = rightBadge ? (
    <span
      className="font-heading animate-sign-drop"
      style={{
        display: "inline-block",
        backgroundColor: "#C8F04A",
        color: "#2D35C9",
        fontWeight: 700,
        fontSize: 13,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "10px 16px",
        borderRadius: 8,
        boxShadow: "4px 4px 0 #1A1510",
        whiteSpace: "nowrap",
        lineHeight: 1,
        transformOrigin: "top center",
        willChange: "transform",
      }}
    >
      {rightBadge}
    </span>
  ) : null;

  return (
    <section
      className="relative w-full overflow-hidden -mt-14 sm:-mt-16"
      style={{ backgroundColor: "#2D35C9", padding: "clamp(72px, 10vw, 96px) clamp(20px, 5vw, 48px) clamp(32px, 5vw, 48px)", paddingTop: "calc(clamp(72px, 10vw, 96px) + 4rem)" }}
    >
      <div className="max-w-[1280px] mx-auto relative">
        {/* Desktop badge — top right, vertically centered against the heading */}
        {badge && (
          <div className="hidden md:block absolute top-1/2 right-0 -translate-y-1/2 z-10">
            {badge}
          </div>
        )}

        {twoLineHeading ? (
          twoLineHeading.inline ? (
            <h1
              className="font-heading font-bold leading-[0.95]"
              style={{
                fontSize: "clamp(56px, 8vw, 96px)",
                color: "#FAF8F4",
                letterSpacing: "-0.02em",
              }}
            >
              {twoLineHeading.line1}{" "}
              <span style={{ color: twoLineHeading.line2Color || "#C8F04A" }}>
                {twoLineHeading.line2}
              </span>
            </h1>
          ) : (
            <>
              <h1
                className="font-heading font-bold leading-[0.95]"
                style={{
                  fontSize: "clamp(56px, 8vw, 96px)",
                  color: "#FAF8F4",
                  letterSpacing: "-0.02em",
                }}
              >
                {twoLineHeading.line1}
              </h1>
              <h1
                className="font-heading font-bold leading-[0.95]"
                style={{
                  fontSize: "clamp(56px, 8vw, 96px)",
                  color: twoLineHeading.line2Color || "#C8F04A",
                  letterSpacing: "-0.02em",
                }}
              >
                {twoLineHeading.line2}
              </h1>
            </>
          )
        ) : (
          <h1
            className="font-heading font-bold leading-[0.95]"
            style={{
              fontSize: "clamp(56px, 8vw, 96px)",
              color: "#FAF8F4",
              letterSpacing: "-0.02em",
            }}
          >
            {heading}
          </h1>
        )}
        {subheading && (
          <p
            className="font-heading font-semibold mt-3"
            style={{ fontSize: "clamp(20px, 3vw, 32px)", color: "#C8F04A" }}
          >
            {subheading}
          </p>
        )}
        {bodyText && (
          <p className="font-body text-[16px] mt-4 max-w-3xl" style={{ color: "rgba(250,248,244,0.6)" }}>
            {bodyText}
          </p>
        )}
        {/* Mobile badge — drops below subheading/body, left-aligned */}
        {badge && (
          <div className="md:hidden mt-6">
            {badge}
          </div>
        )}
        {illustration && (
          <div className="absolute top-0 right-0">
            {illustration}
          </div>
        )}
      </div>
    </section>
  );
}
