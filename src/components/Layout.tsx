import { NavLink, useLocation } from "react-router-dom";
import { ReactNode, useEffect, useState, useRef, useCallback } from "react";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/tools", label: "Tools" },
  { to: "/whats-new", label: "What's New" },
  { to: "/my-stack", label: "My Stack" },
  { to: "/learning", label: "Learning" },
];


export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const navRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const navContainerRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });


  const updatePill = useCallback(() => {
    const activeItem = navItems.find((item) =>
      item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to)
    );
    if (!activeItem || !navContainerRef.current) return;
    const el = navRefs.current[activeItem.to];
    if (!el) return;
    const containerRect = navContainerRef.current.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setPillStyle({
      left: elRect.left - containerRect.left,
      width: elRect.width,
    });
  }, [location.pathname]);

  useEffect(() => {
    updatePill();
    window.addEventListener("resize", updatePill);
    return () => window.removeEventListener("resize", updatePill);
  }, [updatePill]);

  const textColor = "text-primary-foreground";
  const pillBg = "bg-white";
  const pillText = "text-primary";

  return (
    <div className="min-h-screen flex flex-col">
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{ backgroundColor: isHome ? "#7B7FD4" : "#2D35C9" }}
      >
        <div className="max-w-[1280px] mx-auto px-6 sm:px-12">
          <div className="flex items-center justify-between h-16">
            <div className="w-16" />
            <div ref={navContainerRef} className="relative flex items-center gap-2 sm:gap-[40px]">
              {/* Sliding active pill */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 h-8 rounded-[20px] ${pillBg} transition-all duration-[250ms]`}
                style={{
                  left: pillStyle.left,
                  width: pillStyle.width,
                  transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              />
              {navItems.map((item) => {
                const isActive = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    ref={(el) => { navRefs.current[item.to] = el; }}
                    onMouseEnter={() => setHoveredItem(item.to)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`relative z-10 font-body text-sm font-medium px-4 py-1.5 rounded-[20px] whitespace-nowrap transition-colors duration-150 ${
                      isActive
                        ? pillText
                        : `${textColor} hover:bg-white/[0.15]`
                    }`}
                  >
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 pt-16">{children}</main>
      <footer className="h-16 flex items-center px-6 sm:px-12" style={{ backgroundColor: "#1A1510" }}>
        <div className="max-w-[1280px] mx-auto w-full flex items-center justify-between">
          <span className="font-body font-semibold text-[13px] text-primary-foreground">
            The Edit — built by Jasmin
          </span>
          <div className="flex items-center gap-6">
            <span className="font-body text-[13px] text-primary-foreground/40">
              Built with Lovable
            </span>
            <span className="font-body text-[13px] text-primary-foreground/40">
              © 2026
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
