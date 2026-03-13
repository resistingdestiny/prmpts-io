import Link from "next/link";
import { MAX_WIDTH } from "@/lib/constants";
import { cn } from "@/lib/cn";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div
        className={cn(
          "mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row",
          MAX_WIDTH,
        )}
      >
        <p className="text-sm text-muted">
          prmpts — share prompts, build workflows.
        </p>
        <div className="flex gap-4 text-sm text-muted">
          <Link href="/explore" className="hover:text-foreground">
            Explore
          </Link>
          <Link href="/login" className="hover:text-foreground">
            Sign in
          </Link>
        </div>
      </div>
    </footer>
  );
}
