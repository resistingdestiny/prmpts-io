export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getWorkflowBySlug, isWorkflowSaved } from "@/lib/data/queries";
import { getServerUser } from "@/lib/data/auth";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StepCard } from "@/components/workflows/step-card";
import { WorkflowActions } from "@/components/workflows/workflow-actions";
import { ToolSection } from "@/components/shared/tool-section";
import { SetupBadge } from "@/components/shared/setup-badge";
import { ContextBadge } from "@/components/shared/context-badge";
import { MAX_WIDTH } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { ListOrdered, Wrench } from "lucide-react";
import Link from "next/link";

type WorkflowPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function WorkflowPage({ params }: WorkflowPageProps) {
  const { slug } = await params;
  const workflow = await getWorkflowBySlug(slug);
  if (!workflow) notFound();

  const user = await getServerUser();
  const saved = user ? await isWorkflowSaved(user.id, workflow.id) : false;
  const stepCount = workflow.steps?.length ?? 0;
  const toolCount = new Set([
    ...workflow.compatible_tool_ids,
    ...workflow.required_tool_ids,
  ]).size;

  return (
    <div className={cn("mx-auto px-4 py-8", MAX_WIDTH)}>
      {/* Header */}
      <div className="mb-6">
        {workflow.creator && (
          <Link
            href={`/u/${workflow.creator.username}`}
            className="mb-3 flex items-center gap-2"
          >
            <Avatar
              src={workflow.creator.avatar_url}
              name={workflow.creator.display_name}
              size="sm"
            />
            <span className="text-sm text-muted hover:text-foreground">
              {workflow.creator.display_name ?? workflow.creator.username}
            </span>
          </Link>
        )}
        <h1 className="text-2xl font-bold">{workflow.title}</h1>
        {workflow.description && (
          <p className="mt-2 text-muted">{workflow.description}</p>
        )}

        {/* Metadata row */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <SetupBadge level={workflow.difficulty_level} />
          <ContextBadge context={workflow.execution_context} />
          {stepCount > 0 && (
            <span className="flex items-center gap-1 text-xs text-muted">
              <ListOrdered className="h-3 w-3" />
              {stepCount} steps
            </span>
          )}
          {toolCount > 0 && (
            <span className="flex items-center gap-1 text-xs text-muted">
              <Wrench className="h-3 w-3" />
              {toolCount} tools
            </span>
          )}
          {workflow.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <WorkflowActions
          workflowId={workflow.id}
          saved={saved}
          isOwner={user?.id === workflow.creator_id}
        />
      </div>

      {/* Two-column layout: steps + tool sidebar */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Steps */}
        <div className="flex-1">
          <h2 className="mb-4 text-lg font-medium">Steps</h2>
          {workflow.steps && workflow.steps.length > 0 ? (
            <div>
              {workflow.steps.map((step, i) => (
                <StepCard
                  key={step.id}
                  step={step}
                  index={i}
                  isLast={i === workflow.steps!.length - 1}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No steps yet.</p>
          )}
        </div>

        {/* Tool sidebar */}
        <div className="w-full shrink-0 lg:w-72">
          <ToolSection
            compatibleTools={workflow.compatible_tools}
            requiredTools={workflow.required_tools}
            optionalTools={workflow.optional_tools}
            prerequisites={workflow.prerequisites}
            setupNotes={workflow.setup_notes}
            externalLinks={workflow.external_links}
          />
        </div>
      </div>
    </div>
  );
}
