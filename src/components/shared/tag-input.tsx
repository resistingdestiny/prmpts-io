"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

type TagInputProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  className?: string;
};

export function TagInput({ value, onChange, className }: TagInputProps) {
  const [input, setInput] = useState("");

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = input.trim().toLowerCase();
      if (tag && !value.includes(tag)) {
        onChange([...value, tag]);
      }
      setInput("");
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  return (
    <div
      className={cn(
        "flex flex-wrap gap-1.5 rounded-lg border border-border bg-background px-3 py-2",
        className,
      )}
    >
      {value.map((tag) => (
        <Badge key={tag} className="gap-1">
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="cursor-pointer hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? "Add tags..." : ""}
        className="min-w-[80px] flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
      />
    </div>
  );
}
