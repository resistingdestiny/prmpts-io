import { ToolBadge } from "@/components/shared/tool-badge";
import { ExternalLink as ExternalLinkIcon } from "lucide-react";
import type { Tool, ExternalLink } from "@/types";

type ToolSectionProps = {
  compatibleTools?: Tool[];
  requiredTools?: Tool[];
  optionalTools?: Tool[];
  prerequisites?: string[];
  setupNotes?: string | null;
  externalLinks?: ExternalLink[];
};

export function ToolSection({
  compatibleTools = [],
  requiredTools = [],
  optionalTools = [],
  prerequisites = [],
  setupNotes,
  externalLinks = [],
}: ToolSectionProps) {
  const hasContent =
    compatibleTools.length > 0 ||
    requiredTools.length > 0 ||
    optionalTools.length > 0 ||
    prerequisites.length > 0 ||
    setupNotes ||
    externalLinks.length > 0;

  if (!hasContent) return null;

  return (
    <div className="rounded-lg border border-border p-4 space-y-4">
      {compatibleTools.length > 0 && (
        <div>
          <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Works with</h4>
          <div className="flex flex-wrap gap-1.5">
            {compatibleTools.map((tool) => (
              <ToolBadge key={tool.id} tool={tool} size="md" />
            ))}
          </div>
        </div>
      )}

      {requiredTools.length > 0 && (
        <div>
          <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Requires</h4>
          <div className="flex flex-wrap gap-1.5">
            {requiredTools.map((tool) => (
              <ToolBadge key={tool.id} tool={tool} size="md" />
            ))}
          </div>
        </div>
      )}

      {optionalTools.length > 0 && (
        <div>
          <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Optional</h4>
          <div className="flex flex-wrap gap-1.5">
            {optionalTools.map((tool) => (
              <ToolBadge key={tool.id} tool={tool} size="md" />
            ))}
          </div>
        </div>
      )}

      {prerequisites.length > 0 && (
        <div>
          <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Before you start</h4>
          <ul className="space-y-1">
            {prerequisites.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-muted">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-border" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {setupNotes && (
        <p className="text-sm text-muted italic">{setupNotes}</p>
      )}

      {externalLinks.length > 0 && (
        <div>
          <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Links</h4>
          <div className="flex flex-wrap gap-2">
            {externalLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm transition-colors hover:bg-surface"
              >
                <ExternalLinkIcon className="h-3 w-3 text-muted" />
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
