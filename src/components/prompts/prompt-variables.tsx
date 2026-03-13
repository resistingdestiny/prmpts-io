"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PromptBody } from "@/components/prompts/prompt-body";
import { CopyButton } from "@/components/shared/copy-button";
import { replaceVariables } from "@/lib/variables";

type PromptVariablesProps = {
  body: string;
  variables: string[];
  promptId: string;
};

export function PromptVariables({ body, variables, promptId }: PromptVariablesProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);

  const filledBody = replaceVariables(body, values);
  const allFilled = variables.every((v) => values[v]?.trim());

  return (
    <div className="rounded-lg border border-border p-4">
      <h3 className="mb-3 text-sm font-medium">Variables</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {variables.map((v) => (
          <div key={v}>
            <label className="mb-1 block text-xs text-muted">{`{{${v}}}`}</label>
            <Input
              placeholder={v}
              value={values[v] ?? ""}
              onChange={(e) => setValues({ ...values, [v]: e.target.value })}
            />
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          disabled={!allFilled}
        >
          {showPreview ? "Hide preview" : "Preview"}
        </Button>
        {allFilled && <CopyButton text={filledBody} promptId={promptId} />}
      </div>
      {showPreview && allFilled && (
        <div className="mt-3">
          <PromptBody body={filledBody} />
        </div>
      )}
    </div>
  );
}
