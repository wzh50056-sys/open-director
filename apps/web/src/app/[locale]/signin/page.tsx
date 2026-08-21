import Link from "next/link";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { AuthForm } from "@/components/auth-form";
import { AppBackdrop } from "@/components/site-shell";
import { normalizeLocale, withLocale } from "@/i18n.config";

export default async function SignInPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const currentLocale = normalizeLocale(locale);
  const t = await getTranslations({ locale: currentLocale, namespace: "signin" });

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <AppBackdrop />
      <section className="relative z-10 min-h-screen">
        <div className="grid min-h-screen grid-rows-[auto_1fr]">
          <div className="flex items-start justify-start p-5 md:p-12">
            <Link href={withLocale(currentLocale)} className="inline-flex items-center gap-2 text-2xl font-black tracking-normal text-white">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[linear-gradient(135deg,#ff8a3d,#ff5db1_48%,#8b5cf6)] text-sm shadow-[0_12px_28px_rgba(139,92,246,0.3)]">
                OD
              </span>
              OpenDirector
            </Link>
          </div>
          <div className="flex items-center justify-center px-5 pb-12 md:px-12">
            <Suspense>
              <AuthForm mode="signin" locale={currentLocale} />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}
