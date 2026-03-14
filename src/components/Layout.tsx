import { NavLink } from "react-router-dom";
import { ReactNode } from "react";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/tools", label: "Tools" },
  { to: "/whats-new", label: "What's New" },
  { to: "/my-stack", label: "My Stack" },
  { to: "/learning", label: "Learning" },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <NavLink to="/" className="font-heading font-black text-lg text-primary">
              The Edit
            </NavLink>
            <div className="flex items-center gap-1 sm:gap-4 overflow-x-auto">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `text-sm font-medium px-2 py-1 rounded-md whitespace-nowrap transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1">{children}</main>
      <footer className="bg-footer text-footer-foreground py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <span>The Edit — built by Jasmin</span>
          <span>Built with Lovable</span>
        </div>
      </footer>
    </div>
  );
}
