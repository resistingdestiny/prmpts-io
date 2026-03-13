import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { SetupBadge } from "@/components/shared/setup-badge";
import { ContextBadge } from "@/components/shared/context-badge";
import { Bookmark, GitBranch, Wrench, ListOrdered } from "lucide-react";
import type { Workflow, SearchResult } from "@/types";

type WorkflowCardProps = {
  workflow: Workflow | SearchResult;
};

export function WorkflowCard({ workflow }: WorkflowCardProps) {
  const isSearchResult = "type" in workflow;
  const creatorName = isSearchResult
    ? workflow.creator_display_name ?? workflow.creator_username
    : workflow.creator?.display_name ?? workflow.creator?.username ?? "";
  const creatorAvatar = isSearchResult
    ? workflow.creator_avatar_url
    : workflow.creator?.avatar_url;
  const creatorUsername = isSearchResult
    ? workflow.creator_username
    : workflow.creator?.username ?? "";

  const stepCount = !isSearchResult && "steps" in workflow ? workflow.steps?.length ?? 0 : 0;
  const toolCount = (workflow.compatible_tool_ids?.length ?? 0);
  const tools = workflow.compatible_tools ?? [];

  return (
    <Link href={`/w/${workflow.slug}`}>
      <Card className="flex h-full flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar src={creatorAvatar} name={creatorName} size="sm" />
            <span className="text-sm text-muted">{creatorUsername}</span>
          </div>
          <SetupBadge level={workflow.difficulty_level} />
        </div>

        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-accent" />
          <h3 className="font-medium leading-snug">{workflow.title}</h3>
        </div>
        {workflow.description && (
          <p className="line-clamp-2 text-sm text-muted">{workflow.description}</p>
        )}

        {/* Compact metadata row */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
          {stepCount > 0 && (
            <span className="flex items-center gap-1">
              <ListOrdered className="h-3 w-3" />
              {stepCount} steps
            </span>
          )}
          {toolCount > 0 && (
            <span className="flex items-center gap-1">
              <Wrench className="h-3 w-3" />
              {toolCount} tools
            </span>
          )}
          <ContextBadge context={workflow.execution_context} />
        </div>

        {tools.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 text-xs text-muted">
            {tools.slice(0, 3).map((tool) => (
              <span key={tool.id} className="rounded-full border border-border px-1.5 py-0.5">
                {tool.name}
              </span>
            ))}
            {tools.length > 3 && (
              <span>+{tools.length - 3}</span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex flex-wrap gap-1">
            {workflow.tags.slice(0, 3).map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted">
            <span className="flex items-center gap-1">
              <Bookmark className="h-3 w-3" />
              {workflow.save_count}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
