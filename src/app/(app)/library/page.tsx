export const dynamic = "force-dynamic";

import { getServerUser } from "@/lib/data/auth";
import { getUserPrompts, getUserWorkflows, getUserSaves } from "@/lib/data/queries";
import { LibraryTabs } from "@/components/shared/library-tabs";
import { MAX_WIDTH } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { redirect } from "next/navigation";
import { isDemo } from "@/lib/data/mock";

export default async function LibraryPage() {
  const user = await getServerUser();

  if (!user && !isDemo()) redirect("/login");

  const userId = user?.id ?? "demo";
  const [prompts, workflows, saves] = await Promise.all([
    getUserPrompts(userId),
    getUserWorkflows(userId),
    getUserSaves(userId),
  ]);

  return (
    <div className={cn("mx-auto px-4 py-8", MAX_WIDTH)}>
      <h1 className="mb-6 text-2xl font-bold">Library</h1>
      <LibraryTabs prompts={prompts} workflows={workflows} saves={saves} />
    </div>
  );
}
