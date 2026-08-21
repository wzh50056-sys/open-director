import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Github, Sparkles } from "lucide-react";
import { HeaderUserButton } from "@/components/header-user-button";
import { ImmersiveDirectorStage } from "@/components/immersive-director-stage";
import { WorkflowMarketplace } from "@/components/workflow-marketplace";
import { LanguageDropdown } from "@/components/language-dropdown";
import { SigninDialog } from "@/components/signin-dialog";
import { normalizeLocale, withLocale, type Locale } from "@/i18n.config";

export async function SiteHeader({ locale = "en" }: { locale?: Locale }) {
  const currentLocale = normalizeLocale(locale);
  const t = await getTranslations({ locale: currentLocale, namespace: "nav" });

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-slate-950/25 backdrop-blur-xl md:left-[88px]">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 md:justify-end md:px-8 lg:justify-between">
        <Link
          href={withLocale(currentLocale)}
          prefetch={true}
          className="flex items-center gap-3 font-semibold md:hidden"
        >
          <span className="inline-flex items-center gap-2 text-2xl font-black tracking-normal text-white">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[linear-gradient(135deg,#ff8a3d,#ff5db1_48%,#8b5cf6)] text-sm shadow-[0_12px_28px_rgba(139,92,246,0.3)]">
              OD
            </span>
            OpenDirector
          </span>
          <span className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 xl:inline">
            Open Source
          </span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium text-slate-300 lg:flex">
          <Link
            className="rounded-full px-4 py-2 transition hover:bg-white/[0.08] hover:text-white"
            href={withLocale(currentLocale, "/space")}
            prefetch={true}
          >
            {t("space")}
          </Link>
          <Link
            className="rounded-full px-4 py-2 transition hover:bg-white/[0.08] hover:text-white"
            href={withLocale(currentLocale, "/chat")}
            prefetch={true}
          >
            {t("studio")}
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <LanguageDropdown locale={currentLocale} />
          <a
            href="https://github.com/seme-org/open-director"
            target="_blank"
            rel="noreferrer"
            aria-label="OpenDirector on GitHub"
            className="hidden h-10 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white sm:inline-flex"
          >
            <Github size={16} />
            <span className="hidden lg:inline">GitHub</span>
          </a>
          <div className="hidden md:block">
            <HeaderUserButton locale={currentLocale} />
          </div>
          <Link
            href={withLocale(currentLocale, "/chat")}
            prefetch={true}
            aria-label={t("start")}
            className="inline-flex size-10 items-center justify-center gap-2 rounded-full border border-white/15 bg-[linear-gradient(135deg,#ff8a3d,#ff5db1_48%,#8b5cf6)] text-sm font-semibold text-white shadow-[0_12px_30px_rgba(139,92,246,0.26)] transition hover:scale-[1.02] sm:h-10 sm:w-auto sm:px-4"
          >
            <span className="hidden sm:inline">{t("start")}</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function AppBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#03040c]">
      <video
        aria-hidden="true"
        autoPlay
        loop
        muted
        playsInline
        poster="/images/home/open-director-data-tunnel-poster.png"
        className="absolute inset-0 h-full w-full object-cover opacity-95"
      >
        <source
          src="/images/home/open-director-data-tunnel.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,transparent_0%,rgba(3,4,12,0.10)_35%,rgba(3,4,12,0.82)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,4,12,0.42),transparent_40%,rgba(3,4,12,0.72))]" />
      <div className="grain absolute inset-0 opacity-[0.03] mix-blend-overlay" />
    </div>
  );
}

export async function HomePage({ locale = "en" }: { locale?: Locale }) {
  const currentLocale = normalizeLocale(locale);

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <AppBackdrop />
      <SigninDialog locale={currentLocale} />
      <div className="relative z-10">
        <ImmersiveDirectorStage locale={currentLocale} />
        <WorkflowMarketplace locale={currentLocale} />
      </div>
    </main>
  );
}

export async function MarketingPage({
  locale = "en",
  eyebrow,
  title,
  body,
}: {
  locale?: Locale;
  eyebrow: string;
  title: string;
  body: string;
}) {
  const currentLocale = normalizeLocale(locale);
  const t = await getTranslations({ locale: currentLocale, namespace: "nav" });
  const tm = await getTranslations({
    locale: currentLocale,
    namespace: "marketing",
  });

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <AppBackdrop />
      <div className="relative z-10">
        <SiteHeader locale={currentLocale} />
        <section className="mx-auto grid min-h-screen max-w-7xl gap-10 px-5 pb-16 pt-32 md:px-8 lg:grid-cols-[1fr_0.82fr] lg:items-center">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              {eyebrow}
            </p>
            <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-normal text-white md:text-7xl">
              {title}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">
              {body}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={withLocale(currentLocale, "/chat")}
                prefetch={true}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/15 bg-[linear-gradient(135deg,#ff8a3d,#ff5db1_48%,#8b5cf6)] px-5 text-sm font-semibold text-white shadow-[0_16px_38px_rgba(139,92,246,0.28)] transition hover:scale-[1.02]"
              >
                {t("startInStudio")}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className="glass-panel overflow-hidden rounded-3xl p-5">
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black/30">
              <video
                className="size-full object-cover"
                src="/images/home/open-director-cyber-glass.mp4"
                poster="/images/home/open-director-cyber-glass-poster.png"
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[tm("directorBrief"), tm("sceneRecipe"), tm("renderPlan")].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/[0.07] p-4"
                  >
                    <p className="text-sm font-semibold text-white">{item}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {tm("keepsStep")}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
