import { Button } from "@/components/ui/button";
import { Link, useLocation } from "@tanstack/react-router";
import { Dna, Menu, Moon, Search, Sun, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { useState } from "react";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/gallery", label: "Gallery" },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl text-primary shrink-0"
          data-ocid="nav.link"
        >
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Dna className="w-5 h-5 text-primary" />
          </div>
          <span>Hiplot</span>
          <span className="text-xs font-normal text-muted-foreground hidden sm:inline">
            (ORG)
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              data-ocid="nav.link"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hidden sm:flex"
            data-ocid="nav.search_input"
          >
            <Search className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            data-ocid="nav.toggle"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
          <Link to="/gallery" className="hidden sm:block">
            <Button
              size="sm"
              className="h-8 text-sm"
              data-ocid="nav.primary_button"
            >
              Explore Tools
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-ocid="nav.toggle"
          >
            {mobileOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-card overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === link.to
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-ocid="nav.link"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
