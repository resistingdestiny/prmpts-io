import { cn } from "@/lib/cn";
import type { ExecutionContext } from "@/types";

const labels: Record<ExecutionContext, string> = {
  "chat-based": "Chat-based",
  "api-based": "API-based",
  "local-workflow": "Local workflow",
  "no-code-automation": "No-code automation",
  "research-stack": "Research stack",
  "design-workflow": "Design workflow",
  "dev-workflow": "Dev workflow",
};

type ContextBadgeProps = {
  context: ExecutionContext;
  className?: string;
};

export function ContextBadge({ context, className }: ContextBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border px-2 py-0.5 text-xs text-muted",
        className,
      )}
    >
      {labels[context]}
    </span>
  );
}
