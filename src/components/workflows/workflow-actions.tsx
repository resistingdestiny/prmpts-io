"use client";

import { Button } from "@/components/ui/button";
import { Bookmark, Share2, Copy } from "lucide-react";
import { toggleSave, duplicateWorkflow } from "@/lib/data/mutations";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";

type WorkflowActionsProps = {
  workflowId: string;
  saved: boolean;
  isOwner: boolean;
};

export function WorkflowActions({
  workflowId,
  saved: initialSaved,
  isOwner,
}: WorkflowActionsProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);

  async function handleSave() {
    if (!user) {
      router.push("/login");
      return;
    }
    setSaved(!saved);
    await toggleSave("workflow", workflowId);
  }

  async function handleDuplicate() {
    if (!user) {
      router.push("/login");
      return;
    }
    await duplicateWorkflow(workflowId);
  }

  async function handleShare() {
    await navigator.clipboard.writeText(window.location.href);
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleSave}>
        <Bookmark className={`mr-1.5 h-3.5 w-3.5 ${saved ? "fill-current" : ""}`} />
        {saved ? "Saved" : "Save"}
      </Button>
      <Button variant="outline" size="sm" onClick={handleDuplicate}>
        <Copy className="mr-1.5 h-3.5 w-3.5" />
        Duplicate
      </Button>
      <Button variant="ghost" size="sm" onClick={handleShare}>
        <Share2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
