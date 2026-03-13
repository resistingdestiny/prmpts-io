export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { searchContent, getAllTools } from "@/lib/data/queries";
import { SearchBar } from "@/components/shared/search-bar";
import { ExploreFilters } from "@/components/shared/explore-filters";
import { PromptCard } from "@/components/prompts/prompt-card";
import { WorkflowCard } from "@/components/workflows/workflow-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { MAX_WIDTH } from "@/lib/constants";
import { cn } from "@/lib/cn";
import type { SearchResult } from "@/types";

type ExplorePageProps = {
  searchParams: Promise<{ q?: string; type?: string; tool?: string; difficulty?: string; context?: string }>;
};

async function ExploreResults({ searchParams }: ExplorePageProps) {
  const params = await searchParams;
  const query = params.q ?? "";
  const type = params.type ?? "all";
  const toolFilter = params.tool;
  const difficultyFilter = params.difficulty;
  const contextFilter = params.context;
  const results = await searchContent(query, type, 20, 0, toolFilter, difficultyFilter, contextFilter);

  if (results.length === 0) {
    return (
      <EmptyState
        icon={<Search className="h-10 w-10" />}
        title="No results found"
        description={query ? `No matches for "${query}"` : "Nothing here yet. Be the first to create!"}
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {results.map((result: SearchResult) =>
        result.type === "prompt" ? (
          <PromptCard key={result.id} prompt={result} />
        ) : (
          <WorkflowCard key={result.id} workflow={result} />
        ),
      )}
    </div>
  );
}

function ResultsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-48" />
      ))}
    </div>
  );
}

export default async function ExplorePage(props: ExplorePageProps) {
  const tools = await getAllTools();

  return (
    <div className={cn("mx-auto px-4 py-8", MAX_WIDTH)}>
      <h1 className="mb-6 text-2xl font-bold">Explore</h1>
      <div className="mb-4">
        <Suspense>
          <SearchBar className="w-full" />
        </Suspense>
      </div>
      <div className="mb-6">
        <Suspense>
          <ExploreFilters tools={tools} />
        </Suspense>
      </div>
      <Suspense fallback={<ResultsSkeleton />}>
        <ExploreResults searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
