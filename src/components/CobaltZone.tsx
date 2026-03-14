import { ReactNode } from "react";

interface CobaltZoneProps {
  heading: string;
  subheading?: string;
  bodyText?: string;
  illustration?: ReactNode;
  twoLineHeading?: { line1: string; line2: string; line2Color?: string };
}

export function CobaltZone({ heading, subheading, bodyText, illustration, twoLineHeading }: CobaltZoneProps) {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "#2D35C9", padding: "clamp(72px, 10vw, 96px) clamp(20px, 5vw, 48px) clamp(32px, 5vw, 48px)" }}
    >
      <div className="max-w-[1280px] mx-auto relative">
        {twoLineHeading ? (
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
          <p className="font-body text-[16px] mt-4 max-w-lg" style={{ color: "rgba(250,248,244,0.6)" }}>
            {bodyText}
          </p>
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
