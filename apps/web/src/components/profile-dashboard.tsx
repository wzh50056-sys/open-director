"use client";

import { useState } from "react";
import { ProfileDraggableCard } from "@/components/profile-draggable-card";
import { ProfileIconCloud } from "@/components/profile-icon-cloud";
import { ProfileOverview } from "@/components/profile-overview";
import { USER_DISPLAY_NAME_EVENT } from "@/lib/user-display-name";

type ProfileDashboardProps = {
  displayName: string;
  email: string;
  userId: string;
  joinedAt: string;
  projectCount: number;
  image?: string | null;
};

export function ProfileDashboard(props: ProfileDashboardProps) {
  const [displayName, setDisplayName] = useState(props.displayName);

  async function updateDisplayName(nextDisplayName: string) {
    const response = await fetch("/api/profile/display-name", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName: nextDisplayName }),
    });
    const payload = (await response.json().catch(() => null)) as
      | { data?: { displayName?: string }; error?: { message?: string } }
      | null;

    if (!response.ok) {
      throw new Error(payload?.error?.message ?? "昵称保存失败，请稍后重试");
    }

    const savedDisplayName = payload?.data?.displayName ?? nextDisplayName;
    setDisplayName(savedDisplayName);
    window.dispatchEvent(
      new CustomEvent(USER_DISPLAY_NAME_EVENT, { detail: savedDisplayName }),
    );
  }

  return (
    <div className="grid items-start gap-6 xl:grid-cols-[310px_minmax(0,1fr)]">
      <div>
        <ProfileIconCloud
          displayName={displayName}
          onDisplayNameChange={updateDisplayName}
        />
        <ProfileDraggableCard {...props} displayName={displayName} />
      </div>
      <div className="min-w-0 [&>section]:mt-0">
        <ProfileOverview projectCount={props.projectCount} />
      </div>
    </div>
  );
}
