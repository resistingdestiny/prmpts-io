"use client";

import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { PromptCard } from "@/components/prompts/prompt-card";
import { WorkflowCard } from "@/components/workflows/workflow-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { deletePrompt, deleteWorkflow } from "@/lib/data/mutations";
import { FileText, GitBranch, Bookmark, Plus } from "lucide-react";
import Link from "next/link";
import type { Prompt, Workflow, Save } from "@/types";

const TABS = [
  { label: "My Prompts", value: "prompts" },
  { label: "My Workflows", value: "workflows" },
  { label: "Saved", value: "saved" },
];

type LibraryTabsProps = {
  prompts: Prompt[];
  workflows: Workflow[];
  saves: Save[];
};

export function LibraryTabs({ prompts, workflows, saves }: LibraryTabsProps) {
  const [tab, setTab] = useState("prompts");

  return (
    <div>
      <Tabs tabs={TABS} value={tab} onChange={setTab} className="mb-6" />

      {tab === "prompts" && (
        <>
          {prompts.length === 0 ? (
            <EmptyState
              icon={<FileText className="h-10 w-10" />}
              title="No prompts yet"
              description="Create your first prompt to get started."
              action={
                <Link href="/create/prompt">
                  <Button>
                    <Plus className="mr-1.5 h-4 w-4" />
                    Create prompt
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {prompts.map((prompt) => (
                <div key={prompt.id} className="group relative">
                  <PromptCard prompt={prompt} />
                  <button
                    onClick={async () => {
                      if (confirm("Delete this prompt?")) {
                        await deletePrompt(prompt.id);
                        window.location.reload();
                      }
                    }}
                    className="absolute right-2 top-2 hidden cursor-pointer rounded bg-background px-2 py-1 text-xs text-red-500 shadow-sm hover:bg-red-50 group-hover:block"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "workflows" && (
        <>
          {workflows.length === 0 ? (
            <EmptyState
              icon={<GitBranch className="h-10 w-10" />}
              title="No workflows yet"
              description="Create your first workflow to get started."
              action={
                <Link href="/create/workflow">
                  <Button>
                    <Plus className="mr-1.5 h-4 w-4" />
                    Create workflow
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {workflows.map((workflow) => (
                <div key={workflow.id} className="group relative">
                  <WorkflowCard workflow={workflow} />
                  <button
                    onClick={async () => {
                      if (confirm("Delete this workflow?")) {
                        await deleteWorkflow(workflow.id);
                        window.location.reload();
                      }
                    }}
                    className="absolute right-2 top-2 hidden cursor-pointer rounded bg-background px-2 py-1 text-xs text-red-500 shadow-sm hover:bg-red-50 group-hover:block"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "saved" && (
        <>
          {saves.length === 0 ? (
            <EmptyState
              icon={<Bookmark className="h-10 w-10" />}
              title="Nothing saved yet"
              description="Explore and save prompts or workflows you like."
              action={
                <Link href="/explore">
                  <Button variant="outline">Explore</Button>
                </Link>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {saves.map((save) =>
                save.prompt ? (
                  <PromptCard key={save.id} prompt={save.prompt} />
                ) : save.workflow ? (
                  <WorkflowCard key={save.id} workflow={save.workflow} />
                ) : null,
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
