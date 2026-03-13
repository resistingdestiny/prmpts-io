import { Card } from "@/components/ui/card";
import { PromptBody } from "@/components/prompts/prompt-body";
import { CopyButton } from "@/components/shared/copy-button";
import { ToolBadge } from "@/components/shared/tool-badge";
import type { WorkflowStep } from "@/types";

type StepCardProps = {
  step: WorkflowStep;
  index: number;
  isLast: boolean;
};

export function StepCard({ step, index, isLast }: StepCardProps) {
  return (
    <div className="relative flex gap-4">
      {/* Vertical line and number */}
      <div className="flex flex-col items-center">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-medium text-background">
          {index + 1}
        </div>
        {!isLast && <div className="w-px flex-1 bg-border" />}
      </div>

      {/* Content */}
      <Card className="mb-4 flex-1 p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{step.title}</h4>
            {step.tool && <ToolBadge tool={step.tool} size="sm" />}
          </div>
          <CopyButton text={step.body} />
        </div>
        <PromptBody body={step.body} />
        {step.notes && (
          <p className="mt-2 text-sm text-muted">{step.notes}</p>
        )}
      </Card>
    </div>
  );
}
