"use client";

import { Button } from "@/components/ui/button";
import { Bookmark, Share2, Shuffle } from "lucide-react";
import { toggleSave, duplicatePrompt } from "@/lib/data/mutations";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";

type PromptActionsProps = {
  promptId: string;
  saved: boolean;
  isOwner: boolean;
  slug: string;
};

export function PromptActions({ promptId, saved: initialSaved, isOwner, slug }: PromptActionsProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);

  async function handleSave() {
    if (!user) {
      router.push("/login");
      return;
    }
    setSaved(!saved);
    await toggleSave("prompt", promptId);
  }

  async function handleShare() {
    await navigator.clipboard.writeText(window.location.href);
  }

  async function handleRemix() {
    if (!user) {
      router.push("/login");
      return;
    }
    await duplicatePrompt(promptId);
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleSave}>
        <Bookmark className={`mr-1.5 h-3.5 w-3.5 ${saved ? "fill-current" : ""}`} />
        {saved ? "Saved" : "Save"}
      </Button>
      <Button variant="outline" size="sm" onClick={handleRemix}>
        <Shuffle className="mr-1.5 h-3.5 w-3.5" />
        Remix
      </Button>
      <Button variant="ghost" size="sm" onClick={handleShare}>
        <Share2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
