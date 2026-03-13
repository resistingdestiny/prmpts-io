import { type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-background p-6 transition-shadow hover:shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
