import { redirect } from "next/navigation";
import { ProfileDashboard } from "@/components/profile-dashboard";
import { ImagesSlider } from "@/components/ui/images-slider";
import { normalizeLocale, withLocale } from "@/i18n.config";
import { getCurrentUser } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";

export const dynamic = "force-dynamic";

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const currentLocale = normalizeLocale(locale);
  const user = await getCurrentUser();
  if (!user) redirect(withLocale(currentLocale, "/signin"));

  const projectCount = await prisma.thread.count({ where: { userId: user.id, isDeleted: false } }).catch(() => 0);
  const displayName = user.name || user.email.split("@")[0] || "用户";
  const joinedAt = new Intl.DateTimeFormat(currentLocale, { year: "numeric", month: "short", day: "numeric" }).format(user.createdAt);
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#071326] text-white">
      <ImagesSlider
        images={[
          "/images/home/open-director-cyber-glass-poster.png",
          "/images/home/open-director-data-tunnel-poster.png",
          "/images/home/ai-tech-future-poster.png",
        ]}
        className="pointer-events-none absolute inset-0 z-0 min-h-screen"
        overlayClassName="bg-[linear-gradient(180deg,rgba(7,19,38,0.48),rgba(3,8,20,0.68)),radial-gradient(circle_at_78%_18%,rgba(14,116,180,0.08),transparent_42%)]"
      />
      <div className="relative z-10">
      <div className="mx-auto max-w-[1500px] px-5 pb-16 pt-12 md:px-8">
        <ProfileDashboard
          displayName={displayName}
          email={user.email}
          userId={user.id}
          joinedAt={joinedAt}
          projectCount={projectCount}
          image={user.image}
        />
      </div>
      </div>
    </main>
  );
}
