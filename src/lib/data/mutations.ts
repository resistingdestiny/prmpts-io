"use server";

import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPrompt(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const body = formData.get("body") as string;
  const tagsRaw = formData.get("tags") as string;
  const isPublic = formData.get("is_public") === "true";
  const tags = tagsRaw
    ? tagsRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];
  const slug = slugify(title) + "-" + Date.now().toString(36);

  const { error } = await supabase.from("prompts").insert({
    creator_id: user.id,
    title,
    slug,
    description: description || null,
    body,
    tags,
    is_public: isPublic,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/explore");
  revalidatePath("/library");
  redirect(`/p/${slug}`);
}

export async function updatePrompt(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const body = formData.get("body") as string;
  const tagsRaw = formData.get("tags") as string;
  const isPublic = formData.get("is_public") === "true";
  const tags = tagsRaw
    ? tagsRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const { error } = await supabase
    .from("prompts")
    .update({ title, description: description || null, body, tags, is_public: isPublic })
    .eq("id", id)
    .eq("creator_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/explore");
  revalidatePath("/library");
}

export async function deletePrompt(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("prompts")
    .delete()
    .eq("id", id)
    .eq("creator_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/explore");
  revalidatePath("/library");
}

export async function createWorkflow(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const tagsRaw = formData.get("tags") as string;
  const isPublic = formData.get("is_public") === "true";
  const stepsJson = formData.get("steps") as string;
  const tags = tagsRaw
    ? tagsRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];
  const slug = slugify(title) + "-" + Date.now().toString(36);

  const { data: workflow, error } = await supabase
    .from("workflows")
    .insert({
      creator_id: user.id,
      title,
      slug,
      description: description || null,
      tags,
      is_public: isPublic,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  const steps = JSON.parse(stepsJson) as Array<{
    title: string;
    body: string;
    notes: string;
  }>;

  if (steps.length > 0) {
    const { error: stepsError } = await supabase.from("workflow_steps").insert(
      steps.map((step, i) => ({
        workflow_id: workflow.id,
        title: step.title,
        body: step.body,
        notes: step.notes || null,
        position: i,
      })),
    );
    if (stepsError) throw new Error(stepsError.message);
  }

  revalidatePath("/explore");
  revalidatePath("/library");
  redirect(`/w/${slug}`);
}

export async function updateWorkflow(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const tagsRaw = formData.get("tags") as string;
  const isPublic = formData.get("is_public") === "true";
  const stepsJson = formData.get("steps") as string;
  const tags = tagsRaw
    ? tagsRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const { error } = await supabase
    .from("workflows")
    .update({ title, description: description || null, tags, is_public: isPublic })
    .eq("id", id)
    .eq("creator_id", user.id);

  if (error) throw new Error(error.message);

  // Replace steps
  await supabase.from("workflow_steps").delete().eq("workflow_id", id);

  const steps = JSON.parse(stepsJson) as Array<{
    title: string;
    body: string;
    notes: string;
  }>;

  if (steps.length > 0) {
    await supabase.from("workflow_steps").insert(
      steps.map((step, i) => ({
        workflow_id: id,
        title: step.title,
        body: step.body,
        notes: step.notes || null,
        position: i,
      })),
    );
  }

  revalidatePath("/explore");
  revalidatePath("/library");
}

export async function deleteWorkflow(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("workflows")
    .delete()
    .eq("id", id)
    .eq("creator_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/explore");
  revalidatePath("/library");
}

export async function toggleSave(
  type: "prompt" | "workflow",
  itemId: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const column = type === "prompt" ? "prompt_id" : "workflow_id";

  const { data: existing } = await supabase
    .from("saves")
    .select("id")
    .eq("user_id", user.id)
    .eq(column, itemId)
    .maybeSingle();

  if (existing) {
    await supabase.from("saves").delete().eq("id", existing.id);
  } else {
    await supabase.from("saves").insert({
      user_id: user.id,
      [column]: itemId,
    });
  }

  revalidatePath("/library");
}

export async function logCopy(promptId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("copy_events").insert({
    prompt_id: promptId,
    user_id: user?.id ?? null,
  });
}

export async function duplicatePrompt(promptId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: original } = await supabase
    .from("prompts")
    .select("*")
    .eq("id", promptId)
    .single();

  if (!original) throw new Error("Prompt not found");

  const slug = slugify(original.title) + "-remix-" + Date.now().toString(36);

  const { error } = await supabase.from("prompts").insert({
    creator_id: user.id,
    title: original.title,
    slug,
    description: original.description,
    body: original.body,
    tags: original.tags,
    is_public: false,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/library");
  redirect(`/p/${slug}`);
}

export async function duplicateWorkflow(workflowId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: original } = await supabase
    .from("workflows")
    .select("*, steps:workflow_steps(*)")
    .eq("id", workflowId)
    .single();

  if (!original) throw new Error("Workflow not found");

  const slug = slugify(original.title) + "-remix-" + Date.now().toString(36);

  const { data: workflow, error } = await supabase
    .from("workflows")
    .insert({
      creator_id: user.id,
      title: original.title,
      slug,
      description: original.description,
      tags: original.tags,
      is_public: false,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  if (original.steps?.length > 0) {
    await supabase.from("workflow_steps").insert(
      original.steps.map((step: { title: string; body: string; notes: string | null; position: number }) => ({
        workflow_id: workflow.id,
        title: step.title,
        body: step.body,
        notes: step.notes,
        position: step.position,
      })),
    );
  }

  revalidatePath("/library");
  redirect(`/w/${slug}`);
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const displayName = formData.get("display_name") as string;
  const bio = formData.get("bio") as string;

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: displayName || null,
      bio: bio || null,
    })
    .eq("id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/settings");
}
