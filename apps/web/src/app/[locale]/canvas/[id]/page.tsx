import { redirect } from "next/navigation";
import { InfiniteCanvasEditor } from "@/components/infinite-canvas-shell";
import { normalizeLocale, withLocale } from "@/i18n.config";
import { getCurrentUser } from "@/server/auth/session";

export default async function StoryCanvasPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const currentLocale = normalizeLocale(locale);
  const user = await getCurrentUser();
  if (!user) redirect(withLocale(currentLocale, "/signin"));

  void id;
  return <InfiniteCanvasEditor />;
}
