import { ReactNode } from "react";

interface LegalPageProps {
  title: string;
  lastUpdated?: string;
  children: ReactNode;
}

export function LegalPage({ title, lastUpdated, children }: LegalPageProps) {
  return (
    <>
      {/* Hero — mirrors Subscribe page style */}
      <section
        className="relative min-h-[30vh] sm:min-h-[40vh] flex flex-col justify-end overflow-hidden px-4 sm:px-10 md:px-16 pb-8 sm:pb-12 -mt-14 sm:-mt-16 pt-14 sm:pt-16"
        style={{ backgroundColor: "#2D35C9" }}
      >
        <h1
          className="font-heading font-black leading-[0.85] w-full"
          style={{
            fontSize: "clamp(48px, 12vw, 200px)",
            color: "#7B7FD4",
            letterSpacing: "-0.04em",
            marginLeft: "-0.03em",
          }}
        >
          {title}
        </h1>
        {lastUpdated && (
          <p
            className="font-body font-semibold mt-2 sm:mt-4 text-left"
            style={{
              fontSize: "clamp(13px, 1.4vw, 18px)",
              color: "#C8F04A",
              letterSpacing: "0.02em",
            }}
          >
            Last Updated: {lastUpdated}
          </p>
        )}
      </section>

      {/* Body — cream */}
      <section
        style={{ backgroundColor: "#FAF8F4" }}
        className="px-4 sm:px-10 md:px-16 py-16 sm:py-24"
      >
        <article
          className="legal-prose mx-auto"
          style={{ maxWidth: 800 }}
        >
          {children}
        </article>
      </section>

      <style>{`
        .legal-prose h2 {
          font-family: 'Chillax', sans-serif;
          font-weight: 700;
          font-size: clamp(22px, 3vw, 30px);
          color: #1A1510;
          letter-spacing: -0.01em;
          margin: 40px 0 12px;
          line-height: 1.2;
        }
        .legal-prose h2:first-child {
          margin-top: 0;
        }
        .legal-prose p {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 400;
          font-size: 17px;
          line-height: 1.7;
          color: #1A1510;
          margin: 0 0 16px;
        }
        .legal-prose a {
          color: #2D35C9;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .legal-prose a:hover {
          color: #1A1510;
        }
      `}</style>
    </>
  );
}
