import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Tool } from "@/types";

type ToolBadgeProps = {
  tool: Tool;
  size?: "sm" | "md";
  linked?: boolean;
  className?: string;
};

export function ToolBadge({ tool, size = "sm", linked = true, className }: ToolBadgeProps) {
  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-background font-medium transition-colors",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        linked && "hover:border-accent/40 hover:bg-accent/5",
        className,
      )}
    >
      <span className="text-muted">{toolTypeIcon(tool.type)}</span>
      {tool.name}
    </span>
  );

  if (linked) {
    return <Link href={`/tool/${tool.slug}`}>{content}</Link>;
  }
  return content;
}

function toolTypeIcon(type: string): string {
  switch (type) {
    case "model": return "\u2726";
    case "app": return "\u25CB";
    case "repo": return "\u2387";
    case "api": return "\u27A4";
    case "template": return "\u25A1";
    case "dataset": return "\u25A6";
    case "extension": return "\u29C9";
    case "script": return ">";
    case "integration": return "\u21C4";
    case "platform": return "\u25C7";
    default: return "\u00B7";
  }
}
