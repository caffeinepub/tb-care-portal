import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Patient Entry", href: "/patient" },
  { label: "Questionnaire", href: "/questionnaire" },
  { label: "Drug Resistance Info", href: "/resistance" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`;
  return (
    <footer
      style={{ background: "oklch(0.18 0.02 220)" }}
      className="text-white mt-16"
    >
      <div className="max-w-[1200px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 font-bold text-xl mb-3">
            <span>🩺</span>
            <span>TB Care Portal</span>
          </div>
          <p className="text-sm" style={{ color: "oklch(0.75 0.02 220)" }}>
            Comprehensive care management for Tuberculosis patients. Empowering
            healthcare providers with modern tools.
          </p>
        </div>
        <div>
          <h3
            className="font-semibold mb-3 text-sm uppercase tracking-wider"
            style={{ color: "oklch(0.75 0.02 220)" }}
          >
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link
                  to={l.href}
                  className="hover:text-white transition-colors"
                  style={{ color: "oklch(0.75 0.02 220)" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3
            className="font-semibold mb-3 text-sm uppercase tracking-wider"
            style={{ color: "oklch(0.75 0.02 220)" }}
          >
            Contact
          </h3>
          <ul
            className="space-y-2 text-sm"
            style={{ color: "oklch(0.75 0.02 220)" }}
          >
            <li>👤 Sonu Kumar</li>
            <li>📧 sonuamikumar@gmail.com</li>
            <li>📞 +91 8290317570</li>
            <li>📍 GT Road, Ghall Kalan, Moga, Punjab, India</li>
          </ul>
        </div>
      </div>
      <div className="border-t" style={{ borderColor: "oklch(0.28 0.02 220)" }}>
        <div
          className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm"
          style={{ color: "oklch(0.65 0.02 220)" }}
        >
          <span>© {year} TB Care Portal. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-400" /> using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white underline"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
