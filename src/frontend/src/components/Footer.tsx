import { Github, Heart } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div>
            <div className="font-bold text-lg text-primary mb-2">
              Hiplot (ORG)
            </div>
            <p className="text-sm text-muted-foreground">
              Cloud-based biomedical data visualization platform, supported and
              maintained by the openbiox community.
            </p>
          </div>
          <div>
            <div className="font-semibold text-sm text-foreground mb-2">
              Resources
            </div>
            <ul className="space-y-1">
              <li>
                <span className="text-sm text-muted-foreground cursor-default">
                  Documentation
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground cursor-default">
                  API Reference
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground cursor-default">
                  Changelog
                </span>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-sm text-foreground mb-2">
              Community
            </div>
            <ul className="space-y-1">
              <li>
                <a
                  href="https://github.com/openbiox"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" /> GitHub
                </a>
              </li>
              <li>
                <span className="text-sm text-muted-foreground cursor-default">
                  openbiox Community
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground cursor-default">
                  Contribute
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {year} Hiplot (ORG). Open source, community maintained.</span>
          <span className="flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-400 fill-red-400" />{" "}
            using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
