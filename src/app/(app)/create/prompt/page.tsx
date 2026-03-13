"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { TagInput } from "@/components/shared/tag-input";
import { ToolSelect } from "@/components/shared/tool-select";
import { PromptBody } from "@/components/prompts/prompt-body";
import { createPrompt } from "@/lib/data/mutations";
import { extractVariables } from "@/lib/variables";
import { MAX_WIDTH } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isDemo, mockTools } from "@/lib/data/mock";
import type { Tool, DifficultyLevel, ExecutionContext } from "@/types";

const DIFFICULTY_OPTIONS: { label: string; value: DifficultyLevel }[] = [
  { label: "Instant", value: "instant" },
  { label: "Light setup", value: "light-setup" },
  { label: "Technical setup", value: "technical-setup" },
];

const CONTEXT_OPTIONS: { label: string; value: ExecutionContext }[] = [
  { label: "Chat-based", value: "chat-based" },
  { label: "Dev workflow", value: "dev-workflow" },
  { label: "Research stack", value: "research-stack" },
  { label: "No-code automation", value: "no-code-automation" },
  { label: "API-based", value: "api-based" },
  { label: "Design workflow", value: "design-workflow" },
  { label: "Local workflow", value: "local-workflow" },
];

export default function CreatePromptPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  // Tooling fields
  const [showTools, setShowTools] = useState(false);
  const [compatibleToolIds, setCompatibleToolIds] = useState<string[]>([]);
  const [requiredToolIds, setRequiredToolIds] = useState<string[]>([]);
  const [optionalToolIds, setOptionalToolIds] = useState<string[]>([]);
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>("instant");
  const [executionContext, setExecutionContext] = useState<ExecutionContext>("chat-based");
  const [setupNotes, setSetupNotes] = useState("");
  const [prerequisites, setPrerequisites] = useState<string[]>([]);

  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    async function loadTools() {
      if (isDemo()) {
        setTools(mockTools);
        return;
      }
      const supabase = createClient();
      const { data } = await supabase.from("tools").select("*").order("name");
      if (data) setTools(data);
    }
    loadTools();
  }, []);

  const variables = extractVariables(body);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData();
    formData.set("title", title);
    formData.set("description", description);
    formData.set("body", body);
    formData.set("tags", tags.join(","));
    formData.set("is_public", String(isPublic));
    formData.set("difficulty_level", difficultyLevel);
    formData.set("execution_context", executionContext);
    formData.set("setup_notes", setupNotes);
    formData.set("prerequisites", JSON.stringify(prerequisites));
    formData.set("compatible_tool_ids", JSON.stringify(compatibleToolIds));
    formData.set("required_tool_ids", JSON.stringify(requiredToolIds));
    formData.set("optional_tool_ids", JSON.stringify(optionalToolIds));
    await createPrompt(formData);
  }

  return (
    <div className={cn("mx-auto px-4 py-8", MAX_WIDTH)}>
      <h1 className="mb-6 text-2xl font-bold">Create prompt</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="mb-1 block text-sm font-medium">Title</label>
          <Input
            placeholder="e.g. Blog post writer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <Input
            placeholder="Brief description of what this prompt does"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium">Prompt body</label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? "Edit" : "Preview"}
            </Button>
          </div>
          {showPreview ? (
            <PromptBody body={body} />
          ) : (
            <Textarea
              placeholder="Write your prompt here. Use {{variable_name}} for dynamic variables."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-[200px] font-mono"
              required
            />
          )}
          {variables.length > 0 && (
            <p className="mt-1 text-xs text-muted">
              Detected variables: {variables.map((v) => `{{${v}}}`).join(", ")}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Tags</label>
          <TagInput value={tags} onChange={setTags} />
        </div>

        {/* Tools & setup — progressive disclosure */}
        <div className="rounded-lg border border-border">
          <button
            type="button"
            onClick={() => setShowTools(!showTools)}
            className="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium"
          >
            Add tools and setup info
            {showTools ? <ChevronUp className="h-4 w-4 text-muted" /> : <ChevronDown className="h-4 w-4 text-muted" />}
          </button>

          {showTools && (
            <div className="space-y-4 border-t border-border px-4 py-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Setup level</label>
                  <div className="flex gap-1">
                    {DIFFICULTY_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setDifficultyLevel(opt.value)}
                        className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          difficultyLevel === opt.value
                            ? "bg-foreground text-background"
                            : "border border-border text-muted hover:text-foreground"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Execution context</label>
                  <select
                    value={executionContext}
                    onChange={(e) => setExecutionContext(e.target.value as ExecutionContext)}
                    className="w-full cursor-pointer rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  >
                    {CONTEXT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <ToolSelect tools={tools} selected={compatibleToolIds} onChange={setCompatibleToolIds} label="Works with" />
              <ToolSelect tools={tools} selected={requiredToolIds} onChange={setRequiredToolIds} label="Requires" />
              <ToolSelect tools={tools} selected={optionalToolIds} onChange={setOptionalToolIds} label="Optional" />

              <div>
                <label className="mb-1 block text-sm font-medium">Prerequisites</label>
                <TagInput value={prerequisites} onChange={setPrerequisites} />
                <p className="mt-1 text-xs text-muted">e.g. API key, database access, GitHub repo</p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Setup notes</label>
                <Input
                  placeholder="Any setup instructions or tips"
                  value={setupNotes}
                  onChange={(e) => setSetupNotes(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPublic(!isPublic)}
            className="flex cursor-pointer items-center gap-2 text-sm"
          >
            {isPublic ? (
              <Eye className="h-4 w-4 text-accent" />
            ) : (
              <EyeOff className="h-4 w-4 text-muted" />
            )}
            {isPublic ? "Public" : "Private"}
          </button>
        </div>

        <Button type="submit" size="lg" disabled={!title || !body}>
          Publish prompt
        </Button>
      </form>
    </div>
  );
}
