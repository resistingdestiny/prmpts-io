export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import {
  getProfileByUsername,
  getPublicPromptsByUsername,
  getPublicWorkflowsByUsername,
} from "@/lib/data/queries";
import { Avatar } from "@/components/ui/avatar";
import { ProfileContent } from "@/components/shared/profile-content";
import { MAX_WIDTH } from "@/lib/constants";
import { cn } from "@/lib/cn";

type ProfilePageProps = {
  params: Promise<{ username: string }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);
  if (!profile) notFound();

  const [prompts, workflows] = await Promise.all([
    getPublicPromptsByUsername(username),
    getPublicWorkflowsByUsername(username),
  ]);

  return (
    <div className={cn("mx-auto px-4 py-8", MAX_WIDTH)}>
      <div className="mb-8 flex items-center gap-4">
        <Avatar
          src={profile.avatar_url}
          name={profile.display_name}
          size="lg"
        />
        <div>
          <h1 className="text-xl font-bold">
            {profile.display_name ?? profile.username}
          </h1>
          <p className="text-sm text-muted">@{profile.username}</p>
          {profile.bio && <p className="mt-1 text-sm">{profile.bio}</p>}
        </div>
      </div>

      <ProfileContent prompts={prompts} workflows={workflows} />
    </div>
  );
}
