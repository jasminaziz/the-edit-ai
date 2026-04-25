import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTools, fetchWhatsNew, type Tool, type WhatsNew } from "@/lib/sheets";
import { HomeGravity } from "@/components/HomeGravity";

const CATEGORY_COLOURS: Record<string, { bg: string; text: string }> = {
  "New Release": { bg: "#2D35C9", text: "#FFFFFF" },
  "Model Update": { bg: "#7B7FD4", text: "#FFFFFF" },
  "Tool Launch": { bg: "#2D6A4F", text: "#FFFFFF" },
  "Integration": { bg: "#4A4A9A", text: "#FFFFFF" },
  "AI in the News": { bg: "#E8572A", text: "#FFFFFF" },
};





const Index = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [news, setNews] = useState<WhatsNew[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchTools(), fetchWhatsNew()]).then(([t, n]) => {
      setTools(t);
      setNews(n);
      setLoading(false);
    });
  }, []);

  const stackTools = tools.filter((t) => t.status === "in_stack").slice(0, 4);
  const latestNews = news.slice(0, 1);

  return (
    <>
      {/* Hero */}
      <section
        className="relative min-h-[40vh] sm:min-h-[100vh] flex flex-col justify-end overflow-hidden px-4 sm:px-10 md:px-16 pb-10 sm:pb-16 -mt-14 sm:-mt-16 pt-14 sm:pt-16"
        style={{ backgroundColor: "#7B7FD4" }}
      >
        {/* Pills layer — sits behind the headlines, fills the hero */}
        <div className="absolute inset-0 z-0">
          {!loading && <HomeGravity tools={tools} variant="hero" />}
        </div>

        {/* Typography layer — pointer-events-none so pills are draggable through it */}
        <div className="relative z-10 pointer-events-none">
          {/* THE — full-width, pushed to edges */}
          <h1
            className="font-heading font-black leading-[0.82] w-full"
            style={{
              fontSize: "clamp(120px, 28vw, 420px)",
              color: "#2D35C9",
              letterSpacing: "-0.04em",
              marginLeft: "-0.04em",
            }}
          >
            The
          </h1>
          {/* EDIT — even bigger, commanding */}
          <h1
            className="font-heading font-black leading-[0.78] w-full"
            style={{
              fontSize: "clamp(160px, 38vw, 560px)",
              color: "#2D35C9",
              letterSpacing: "-0.05em",
              marginLeft: "-0.05em",
              marginTop: "-0.02em",
            }}
          >
            Edit.
          </h1>
        </div>
      </section>


    </>
  );
};

export default Index;
