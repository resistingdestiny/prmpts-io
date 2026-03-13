export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getPromptBySlug, isPromptSaved } from "@/lib/data/queries";
import { getServerUser } from "@/lib/data/auth";
import { PromptBody } from "@/components/prompts/prompt-body";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/shared/copy-button";
import { PromptActions } from "@/components/prompts/prompt-actions";
import { PromptVariables } from "@/components/prompts/prompt-variables";
import { ToolSection } from "@/components/shared/tool-section";
import { SetupBadge } from "@/components/shared/setup-badge";
import { ContextBadge } from "@/components/shared/context-badge";
import { MAX_WIDTH } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { extractVariables } from "@/lib/variables";
import Link from "next/link";

type PromptPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PromptPage({ params }: PromptPageProps) {
  const { slug } = await params;
  const prompt = await getPromptBySlug(slug);
  if (!prompt) notFound();

  const user = await getServerUser();

  const saved = user ? await isPromptSaved(user.id, prompt.id) : false;
  const variables = extractVariables(prompt.body);

  return (
    <div className={cn("mx-auto px-4 py-8", MAX_WIDTH)}>
      <div className="mb-6">
        {prompt.creator && (
          <Link
            href={`/u/${prompt.creator.username}`}
            className="mb-3 flex items-center gap-2"
          >
            <Avatar
              src={prompt.creator.avatar_url}
              name={prompt.creator.display_name}
              size="sm"
            />
            <span className="text-sm text-muted hover:text-foreground">
              {prompt.creator.display_name ?? prompt.creator.username}
            </span>
          </Link>
        )}
        <h1 className="text-2xl font-bold">{prompt.title}</h1>
        {prompt.description && (
          <p className="mt-2 text-muted">{prompt.description}</p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <SetupBadge level={prompt.difficulty_level} />
          <ContextBadge context={prompt.execution_context} />
          {prompt.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <CopyButton text={prompt.body} promptId={prompt.id} />
        <PromptActions
          promptId={prompt.id}
          saved={saved}
          isOwner={user?.id === prompt.creator_id}
          slug={prompt.slug}
        />
      </div>

      <PromptBody body={prompt.body} />

      {variables.length > 0 && (
        <div className="mt-6">
          <PromptVariables body={prompt.body} variables={variables} promptId={prompt.id} />
        </div>
      )}

      <div className="mt-6">
        <ToolSection
          compatibleTools={prompt.compatible_tools}
          requiredTools={prompt.required_tools}
          optionalTools={prompt.optional_tools}
          prerequisites={prompt.prerequisites}
          setupNotes={prompt.setup_notes}
          externalLinks={prompt.external_links}
        />
      </div>
    </div>
  );
}
