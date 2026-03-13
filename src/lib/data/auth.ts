import { createClient } from "@/lib/supabase/server";
import { isDemo } from "@/lib/data/mock";
import type { User } from "@supabase/supabase-js";

export async function getServerUser(): Promise<User | null> {
  if (isDemo()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
