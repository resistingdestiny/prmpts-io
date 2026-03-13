"use client";

import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { PromptCard } from "@/components/prompts/prompt-card";
import { WorkflowCard } from "@/components/workflows/workflow-card";
import { EmptyState } from "@/components/shared/empty-state";
import { FileText } from "lucide-react";
import type { Prompt, Workflow } from "@/types";

const TABS = [
  { label: "Prompts", value: "prompts" },
  { label: "Workflows", value: "workflows" },
];

type ProfileContentProps = {
  prompts: Prompt[];
  workflows: Workflow[];
};

export function ProfileContent({ prompts, workflows }: ProfileContentProps) {
  const [tab, setTab] = useState("prompts");

  return (
    <div>
      <Tabs tabs={TABS} value={tab} onChange={setTab} className="mb-6" />

      {tab === "prompts" && (
        <>
          {prompts.length === 0 ? (
            <EmptyState
              icon={<FileText className="h-10 w-10" />}
              title="No public prompts"
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {prompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          )}
        </>
      )}

      {tab === "workflows" && (
        <>
          {workflows.length === 0 ? (
            <EmptyState
              icon={<FileText className="h-10 w-10" />}
              title="No public workflows"
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {workflows.map((workflow) => (
                <WorkflowCard key={workflow.id} workflow={workflow} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
