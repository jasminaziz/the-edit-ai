import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      {/* Cobalt hero */}
      <section
        className="relative w-full overflow-hidden -mt-14 sm:-mt-16 flex flex-col justify-end"
        style={{
          backgroundColor: "#2D35C9",
          minHeight: "60vh",
          padding: "clamp(72px, 10vw, 96px) clamp(20px, 5vw, 48px) clamp(32px, 5vw, 48px)",
          paddingTop: "calc(clamp(72px, 10vw, 96px) + 4rem)",
        }}
      >
        <div className="max-w-[1280px] mx-auto w-full">
          <h1
            className="font-heading font-black leading-[0.82]"
            style={{
              fontSize: "clamp(120px, 28vw, 320px)",
              color: "#7B7FD4",
              letterSpacing: "-0.04em",
            }}
          >
            404
          </h1>
          <p
            className="font-heading font-semibold mt-2"
            style={{
              fontSize: "clamp(20px, 3vw, 40px)",
              color: "#C8F04A",
            }}
          >
            Page not found.
          </p>
          <p
            className="font-body text-[16px] mt-4 max-w-md"
            style={{ color: "rgba(250,248,244,0.6)" }}
          >
            Whatever you were looking for isn't here. It might have moved, or it might never have existed.
          </p>
        </div>
      </section>

      {/* Navigation strip */}
      <section className="bg-background py-16 px-6 sm:px-12">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-body font-semibold text-[11px] uppercase tracking-[0.05em] text-muted mb-6">
            Try one of these instead
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { to: "/tools", label: "Tools", desc: "Browse the full directory" },
              { to: "/whats-new", label: "What's New", desc: "Latest AI updates" },
              { to: "/my-stack", label: "My Stack", desc: "What I'm actually using" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="bg-card rounded-xl border border-border p-5 group hover:shadow-lg transition-all duration-150"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderLeftWidth = "4px";
                  e.currentTarget.style.borderLeftColor = "#C8F04A";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderLeftWidth = "1px";
                  e.currentTarget.style.borderLeftColor = "#E8E2D8";
                }}
              >
                <h3 className="font-heading font-semibold text-lg text-foreground">{link.label}</h3>
                <p className="font-body text-sm text-muted mt-1">{link.desc}</p>
                <span className="inline-block mt-3 font-body font-medium text-[13px]" style={{ color: "#2D35C9" }}>
                  Go →
                </span>
              </Link>
            ))}
          </div>

          <Link
            to="/"
            className="inline-block mt-8 font-heading font-semibold text-base hover:underline"
            style={{ color: "#2D35C9" }}
          >
            ← Back to home
          </Link>
        </div>
      </section>
    </>
  );
};

export default NotFound;
