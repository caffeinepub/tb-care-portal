import { Button } from "@/components/ui/button";
import type { Tool } from "@/lib/tools";
import { Link } from "@tanstack/react-router";

const CATEGORY_COLORS: Record<string, string> = {
  basic: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  statistical:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  clinical: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  omics:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  "multi-omics":
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
};

interface ToolCardProps {
  tool: Tool;
  compact?: boolean;
}

export default function ToolCard({ tool, compact = false }: ToolCardProps) {
  return (
    <div
      className="bg-card border border-border rounded-lg p-4 flex flex-col gap-3 shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5 group"
      data-ocid="tool.card"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-3xl leading-none">{tool.icon}</div>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[tool.category]}`}
        >
          {tool.category}
        </span>
      </div>
      <div>
        <div className="font-semibold text-foreground text-sm">{tool.name}</div>
        {!compact && (
          <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {tool.description}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-xs text-muted-foreground">
          {(tool.usageCount / 1000).toFixed(1)}K uses
        </span>
        <Link to="/tool/$toolId" params={{ toolId: tool.id }}>
          <Button
            size="sm"
            variant="default"
            className="h-7 text-xs px-3"
            data-ocid="tool.open_button"
          >
            Open
          </Button>
        </Link>
      </div>
    </div>
  );
}
