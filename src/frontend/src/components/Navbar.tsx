import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Patient Entry", href: "/patient" },
  { label: "Questionnaire", href: "/questionnaire" },
  { label: "Drug Resistance Info", href: "/resistance" },
  { label: "Contact", href: "/contact" },
  { label: "Admin", href: "/admin" },
];

export default function Navbar() {
  const { location } = useRouterState();
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-xs">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center gap-8">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl text-primary shrink-0"
          data-ocid="nav.link"
        >
          <span className="text-2xl">🩺</span>
          <span>TB Care Portal</span>
        </Link>
        <nav className="flex items-center gap-1 flex-1 flex-wrap">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              data-ocid="nav.link"
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
