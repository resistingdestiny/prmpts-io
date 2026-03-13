"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { updateProfile } from "@/lib/data/mutations";
import { MAX_WIDTH } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { useRouter } from "next/navigation";
import type { Profile } from "@/types";

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (data) {
        setProfile(data);
        setDisplayName(data.display_name ?? "");
        setBio(data.bio ?? "");
      }
    }
    load();
  }, [supabase]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData();
    formData.set("display_name", displayName);
    formData.set("bio", bio);
    await updateProfile(formData);
    setSaving(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (!profile) {
    return (
      <div className={cn("mx-auto px-4 py-8", MAX_WIDTH)}>
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className={cn("mx-auto px-4 py-8", MAX_WIDTH)}>
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>

      <div className="mb-6 flex items-center gap-4">
        <Avatar src={profile.avatar_url} name={profile.display_name} size="lg" />
        <div>
          <p className="font-medium">{profile.display_name ?? profile.username}</p>
          <p className="text-sm text-muted">@{profile.username}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="flex max-w-md flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Display name</label>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Bio</label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
            className="min-h-[80px]"
          />
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </form>

      <div className="mt-8 border-t border-border pt-6">
        <Button variant="outline" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    </div>
  );
}
