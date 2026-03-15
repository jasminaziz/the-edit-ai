import { Link } from "react-router-dom";

const ServerError = () => {
  return (
    <>
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
            500
          </h1>
          <p
            className="font-heading font-semibold mt-2"
            style={{
              fontSize: "clamp(20px, 3vw, 40px)",
              color: "#C8F04A",
            }}
          >
            Something broke.
          </p>
          <p
            className="font-body text-[16px] mt-4 max-w-md"
            style={{ color: "rgba(250,248,244,0.6)" }}
          >
            This one's on us. The server hit a problem it couldn't recover from. Try refreshing, or come back in a minute.
          </p>
        </div>
      </section>

      <section className="bg-background py-16 px-6 sm:px-12">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-lg font-heading font-semibold text-[15px] text-primary-foreground transition-all duration-150 hover:-translate-y-0.5"
            style={{ backgroundColor: "#2D35C9" }}
          >
            Refresh page
          </button>
          <Link
            to="/"
            className="px-6 py-3 rounded-lg font-heading font-semibold text-[15px] border border-border text-foreground hover:bg-card transition-all duration-150"
          >
            ← Back to home
          </Link>
        </div>
      </section>
    </>
  );
};

export default ServerError;
