import { createClient } from "@/lib/supabase/server";
import {
  isDemo,
  mockPrompts,
  mockWorkflows,
  mockProfiles,
  mockSaves,
  mockSearchContent,
  mockTools,
  getToolBySlug as mockGetToolBySlug,
  getPromptsByToolId as mockGetPromptsByToolId,
  getWorkflowsByToolId as mockGetWorkflowsByToolId,
} from "@/lib/data/mock";
import type { Prompt, Workflow, SearchResult, Profile, Save, Tool } from "@/types";

export async function getPromptBySlug(slug: string): Promise<Prompt | null> {
  if (isDemo()) return mockPrompts.find((p) => p.slug === slug) ?? null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("prompts")
    .select("*, creator:profiles(*)")
    .eq("slug", slug)
    .single();
  return data;
}

export async function getWorkflowBySlug(slug: string): Promise<Workflow | null> {
  if (isDemo()) return mockWorkflows.find((w) => w.slug === slug) ?? null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("workflows")
    .select("*, creator:profiles(*), steps:workflow_steps(*)")
    .eq("slug", slug)
    .single();
  if (data?.steps) {
    data.steps.sort((a: { position: number }, b: { position: number }) => a.position - b.position);
  }
  return data;
}

export async function searchContent(
  query: string = "",
  type: string = "all",
  limit: number = 20,
  offset: number = 0,
  toolFilter?: string,
  difficultyFilter?: string,
  contextFilter?: string,
): Promise<SearchResult[]> {
  if (isDemo()) return mockSearchContent(query, type, toolFilter, difficultyFilter, contextFilter).slice(offset, offset + limit);
  const supabase = await createClient();
  const { data } = await supabase.rpc("search_content", {
    search_query: query,
    content_type: type,
    result_limit: limit,
    result_offset: offset,
  });
  return data ?? [];
}

export async function getRecentPrompts(limit: number = 6): Promise<Prompt[]> {
  if (isDemo()) return mockPrompts.slice(0, limit);
  const supabase = await createClient();
  const { data } = await supabase
    .from("prompts")
    .select("*, creator:profiles(*)")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getUserPrompts(userId: string): Promise<Prompt[]> {
  if (isDemo()) return mockPrompts;
  const supabase = await createClient();
  const { data } = await supabase
    .from("prompts")
    .select("*, creator:profiles(*)")
    .eq("creator_id", userId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getUserWorkflows(userId: string): Promise<Workflow[]> {
  if (isDemo()) return mockWorkflows;
  const supabase = await createClient();
  const { data } = await supabase
    .from("workflows")
    .select("*, creator:profiles(*)")
    .eq("creator_id", userId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getUserSaves(userId: string): Promise<Save[]> {
  if (isDemo()) return mockSaves;
  const supabase = await createClient();
  const { data } = await supabase
    .from("saves")
    .select("*, prompt:prompts(*, creator:profiles(*)), workflow:workflows(*, creator:profiles(*))")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getProfileByUsername(username: string): Promise<Profile | null> {
  if (isDemo()) return mockProfiles.find((p) => p.username === username) ?? null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();
  return data;
}

export async function getPublicPromptsByUsername(username: string): Promise<Prompt[]> {
  if (isDemo()) {
    const profile = mockProfiles.find((p) => p.username === username);
    if (!profile) return [];
    return mockPrompts.filter((p) => p.creator_id === profile.id);
  }
  const profile = await getProfileByUsername(username);
  if (!profile) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("prompts")
    .select("*, creator:profiles(*)")
    .eq("is_public", true)
    .eq("creator_id", profile.id)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getPublicWorkflowsByUsername(username: string): Promise<Workflow[]> {
  if (isDemo()) {
    const profile = mockProfiles.find((p) => p.username === username);
    if (!profile) return [];
    return mockWorkflows.filter((w) => w.creator_id === profile.id);
  }
  const profile = await getProfileByUsername(username);
  if (!profile) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("workflows")
    .select("*, creator:profiles(*)")
    .eq("is_public", true)
    .eq("creator_id", profile.id)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function isPromptSaved(userId: string, promptId: string): Promise<boolean> {
  if (isDemo()) return false;
  const supabase = await createClient();
  const { data } = await supabase
    .from("saves")
    .select("id")
    .eq("user_id", userId)
    .eq("prompt_id", promptId)
    .maybeSingle();
  return !!data;
}

export async function isWorkflowSaved(userId: string, workflowId: string): Promise<boolean> {
  if (isDemo()) return false;
  const supabase = await createClient();
  const { data } = await supabase
    .from("saves")
    .select("id")
    .eq("user_id", userId)
    .eq("workflow_id", workflowId)
    .maybeSingle();
  return !!data;
}

// ----------- Tool queries -----------

export async function getAllTools(): Promise<Tool[]> {
  if (isDemo()) return mockTools;
  const supabase = await createClient();
  const { data } = await supabase
    .from("tools")
    .select("*")
    .order("name");
  return data ?? [];
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  if (isDemo()) return mockGetToolBySlug(slug) ?? null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("tools")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

export async function getPromptsByTool(toolId: string): Promise<Prompt[]> {
  if (isDemo()) return mockGetPromptsByToolId(toolId);
  const supabase = await createClient();
  const { data } = await supabase
    .from("prompts")
    .select("*, creator:profiles(*)")
    .eq("is_public", true)
    .contains("compatible_tool_ids", [toolId]);
  return data ?? [];
}

export async function getWorkflowsByTool(toolId: string): Promise<Workflow[]> {
  if (isDemo()) return mockGetWorkflowsByToolId(toolId);
  const supabase = await createClient();
  const { data } = await supabase
    .from("workflows")
    .select("*, creator:profiles(*)")
    .eq("is_public", true)
    .contains("compatible_tool_ids", [toolId]);
  return data ?? [];
}
