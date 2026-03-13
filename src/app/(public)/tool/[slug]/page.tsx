export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getToolBySlug, getPromptsByTool, getWorkflowsByTool, getAllTools } from "@/lib/data/queries";
import { PromptCard } from "@/components/prompts/prompt-card";
import { WorkflowCard } from "@/components/workflows/workflow-card";
import { ToolBadge } from "@/components/shared/tool-badge";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { MAX_WIDTH } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { ExternalLink, FileText } from "lucide-react";

type ToolPageProps = {
  params: Promise<{ slug: string }>;
};

const typeLabels: Record<string, string> = {
  model: "AI Model",
  app: "Application",
  repo: "Repository",
  api: "API",
  template: "Template",
  dataset: "Dataset",
  extension: "Extension",
  script: "Script",
  integration: "Integration",
  platform: "Platform",
};

const pricingLabels: Record<string, string> = {
  free: "Free",
  freemium: "Freemium",
  paid: "Paid",
  "open-source": "Open source",
};

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) notFound();

  const [prompts, workflows, allTools] = await Promise.all([
    getPromptsByTool(tool.id),
    getWorkflowsByTool(tool.id),
    getAllTools(),
  ]);

  // Related tools: same type or overlapping tags
  const relatedTools = allTools
    .filter(
      (t) =>
        t.id !== tool.id &&
        (t.type === tool.type || t.tags.some((tag) => tool.tags.includes(tag))),
    )
    .slice(0, 6);

  return (
    <div className={cn("mx-auto px-4 py-8", MAX_WIDTH)}>
      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <Badge variant="accent">{typeLabels[tool.type] ?? tool.type}</Badge>
          <Badge>{pricingLabels[tool.pricing_type]}</Badge>
        </div>
        <h1 className="text-2xl font-bold">{tool.name}</h1>
        {tool.description && (
          <p className="mt-2 text-muted">{tool.description}</p>
        )}
        {tool.url && (
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {tool.url.replace(/^https?:\/\//, "")}
          </a>
        )}
      </div>

      {/* Prompts using this tool */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-medium">Prompts using {tool.name}</h2>
        {prompts.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {prompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<FileText className="h-8 w-8" />}
            title="No prompts yet"
            description={`No prompts are using ${tool.name} yet.`}
          />
        )}
      </section>

      {/* Workflows using this tool */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-medium">Workflows using {tool.name}</h2>
        {workflows.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {workflows.map((workflow) => (
              <WorkflowCard key={workflow.id} workflow={workflow} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<FileText className="h-8 w-8" />}
            title="No workflows yet"
            description={`No workflows are using ${tool.name} yet.`}
          />
        )}
      </section>

      {/* Related tools */}
      {relatedTools.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-medium">Related tools</h2>
          <div className="flex flex-wrap gap-2">
            {relatedTools.map((t) => (
              <ToolBadge key={t.id} tool={t} size="md" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
