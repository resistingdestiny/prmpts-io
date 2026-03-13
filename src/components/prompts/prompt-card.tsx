import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { SetupBadge } from "@/components/shared/setup-badge";
import { Copy, Bookmark } from "lucide-react";
import type { Prompt, SearchResult } from "@/types";

type PromptCardProps = {
  prompt: Prompt | SearchResult;
};

export function PromptCard({ prompt }: PromptCardProps) {
  const isSearchResult = "type" in prompt;
  const creatorName = isSearchResult
    ? prompt.creator_display_name ?? prompt.creator_username
    : prompt.creator?.display_name ?? prompt.creator?.username ?? "";
  const creatorAvatar = isSearchResult
    ? prompt.creator_avatar_url
    : prompt.creator?.avatar_url;
  const creatorUsername = isSearchResult
    ? prompt.creator_username
    : prompt.creator?.username ?? "";
  const tools = prompt.compatible_tools ?? [];

  return (
    <Link href={`/p/${prompt.slug}`}>
      <Card className="flex h-full flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar src={creatorAvatar} name={creatorName} size="sm" />
            <span className="text-sm text-muted">{creatorUsername}</span>
          </div>
          <SetupBadge level={prompt.difficulty_level} />
        </div>
        <h3 className="font-medium leading-snug">{prompt.title}</h3>
        {prompt.description && (
          <p className="line-clamp-2 text-sm text-muted">{prompt.description}</p>
        )}

        {tools.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 text-xs text-muted">
            <span className="mr-0.5">Works with</span>
            {tools.slice(0, 3).map((tool) => (
              <span key={tool.id} className="rounded-full border border-border px-1.5 py-0.5">
                {tool.name}
              </span>
            ))}
            {tools.length > 3 && (
              <span className="text-muted">+{tools.length - 3}</span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex flex-wrap gap-1">
            {prompt.tags.slice(0, 3).map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted">
            <span className="flex items-center gap-1">
              <Copy className="h-3 w-3" />
              {prompt.copy_count}
            </span>
            <span className="flex items-center gap-1">
              <Bookmark className="h-3 w-3" />
              {prompt.save_count}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
