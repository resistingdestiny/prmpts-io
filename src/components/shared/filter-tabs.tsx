"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs } from "@/components/ui/tabs";

const FILTER_TABS = [
  { label: "All", value: "all" },
  { label: "Prompts", value: "prompts" },
  { label: "Workflows", value: "workflows" },
];

export function FilterTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentType = searchParams.get("type") ?? "all";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("type");
    } else {
      params.set("type", value);
    }
    router.push(`/explore?${params.toString()}`);
  }

  return <Tabs tabs={FILTER_TABS} value={currentType} onChange={handleChange} />;
}
