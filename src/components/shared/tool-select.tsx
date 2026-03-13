"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Tool } from "@/types";

type ToolSelectProps = {
  tools: Tool[];
  selected: string[];
  onChange: (ids: string[]) => void;
  label?: string;
  className?: string;
};

export function ToolSelect({ tools, selected, onChange, label, className }: ToolSelectProps) {
  const selectedTools = selected.map((id) => tools.find((t) => t.id === id)).filter(Boolean) as Tool[];
  const available = tools.filter((t) => !selected.includes(t.id));

  function add(id: string) {
    onChange([...selected, id]);
  }

  function remove(id: string) {
    onChange(selected.filter((s) => s !== id));
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <label className="block text-sm font-medium">{label}</label>}
      <div className="flex flex-wrap gap-1.5">
        {selectedTools.map((tool) => (
          <span
            key={tool.id}
            className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/5 px-2.5 py-1 text-xs font-medium"
          >
            {tool.name}
            <button
              type="button"
              onClick={() => remove(tool.id)}
              className="cursor-pointer text-muted hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        {available.length > 0 && (
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) add(e.target.value);
            }}
            className="cursor-pointer rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted focus:border-accent focus:outline-none"
          >
            <option value="">+ Add tool</option>
            {available.map((tool) => (
              <option key={tool.id} value={tool.id}>
                {tool.name}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
