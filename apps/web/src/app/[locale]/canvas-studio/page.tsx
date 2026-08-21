import { redirect } from "next/navigation";
import { InfiniteCanvasLibrary } from "@/components/infinite-canvas-shell";
import { normalizeLocale, withLocale } from "@/i18n.config";
import { getCurrentUser } from "@/server/auth/session";

export const dynamic = "force-dynamic";

export default async function CanvasStudioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const currentLocale = normalizeLocale(locale);
  const user = await getCurrentUser();
  if (!user) redirect(withLocale(currentLocale, "/signin"));

  return <InfiniteCanvasLibrary />;
}
