import { cn } from "@/lib/cn";

type PromptBodyProps = {
  body: string;
  className?: string;
};

export function PromptBody({ body, className }: PromptBodyProps) {
  const parts = body.split(/(\{\{\w+\}\})/g);

  return (
    <pre
      className={cn(
        "whitespace-pre-wrap rounded-lg bg-surface p-4 font-mono text-sm leading-relaxed",
        className,
      )}
    >
      {parts.map((part, i) =>
        /^\{\{\w+\}\}$/.test(part) ? (
          <span
            key={i}
            className="rounded bg-accent/10 px-1 py-0.5 font-semibold text-accent"
          >
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </pre>
  );
}
