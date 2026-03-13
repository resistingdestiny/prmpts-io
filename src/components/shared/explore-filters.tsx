"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs } from "@/components/ui/tabs";
import type { Tool, DifficultyLevel, ExecutionContext } from "@/types";

const TYPE_TABS = [
  { label: "All", value: "all" },
  { label: "Prompts", value: "prompts" },
  { label: "Workflows", value: "workflows" },
];

const DIFFICULTY_OPTIONS: { label: string; value: DifficultyLevel | "" }[] = [
  { label: "Any setup", value: "" },
  { label: "Instant", value: "instant" },
  { label: "Light setup", value: "light-setup" },
  { label: "Technical", value: "technical-setup" },
];

const CONTEXT_OPTIONS: { label: string; value: ExecutionContext | "" }[] = [
  { label: "Any context", value: "" },
  { label: "Chat-based", value: "chat-based" },
  { label: "Dev workflow", value: "dev-workflow" },
  { label: "Research stack", value: "research-stack" },
  { label: "No-code", value: "no-code-automation" },
  { label: "API-based", value: "api-based" },
  { label: "Design", value: "design-workflow" },
  { label: "Local", value: "local-workflow" },
];

type ExploreFiltersProps = {
  tools: Tool[];
};

export function ExploreFilters({ tools }: ExploreFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentType = searchParams.get("type") ?? "all";
  const currentTool = searchParams.get("tool") ?? "";
  const currentDifficulty = searchParams.get("difficulty") ?? "";
  const currentContext = searchParams.get("context") ?? "";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/explore?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Type + Difficulty row */}
      <div className="flex flex-wrap items-center gap-2">
        <Tabs
          tabs={TYPE_TABS}
          value={currentType}
          onChange={(v) => updateParam("type", v === "all" ? "" : v)}
        />

        {/* Difficulty pills */}
        <div className="flex gap-1">
          {DIFFICULTY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateParam("difficulty", opt.value)}
              className={`cursor-pointer rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                currentDifficulty === opt.value
                  ? "bg-foreground text-background"
                  : "border border-border text-muted hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Context + Tool row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Context pills */}
        <div className="flex flex-wrap gap-1">
          {CONTEXT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateParam("context", opt.value)}
              className={`cursor-pointer rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                currentContext === opt.value
                  ? "bg-foreground text-background"
                  : "border border-border text-muted hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Tool select */}
        <select
          value={currentTool}
          onChange={(e) => updateParam("tool", e.target.value)}
          className="cursor-pointer rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-muted focus:border-accent focus:outline-none"
        >
          <option value="">All tools</option>
          {tools.map((tool) => (
            <option key={tool.id} value={tool.id}>
              {tool.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
