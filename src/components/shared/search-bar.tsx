"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useEffect } from "react";

type SearchBarProps = {
  className?: string;
};

export function SearchBar({ className }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentQuery = searchParams.get("q") ?? "";

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleChange(value: string) {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      router.push(`/explore?${params.toString()}`);
    }, 300);
  }

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        ref={inputRef}
        type="text"
        placeholder="Search prompts and workflows..."
        defaultValue={currentQuery}
        onChange={(e) => handleChange(e.target.value)}
        className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm placeholder:text-muted focus:border-accent focus:outline-none"
      />
    </div>
  );
}
