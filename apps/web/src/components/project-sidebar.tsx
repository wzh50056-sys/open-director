"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Clapperboard, FolderOpen, Home, Infinity, LogIn, Menu, UserRound} from "lucide-react";
import {cn} from "@/lib/utils";
import {USER_DISPLAY_NAME_EVENT} from "@/lib/user-display-name";
import {withLocale, type Locale} from "@/i18n.config";

const navigation = [
  {label: "首页", href: "", icon: Home},
  {label: "我的项目", href: "/space", icon: FolderOpen},
  {label: "导演台", href: "/chat", icon: Clapperboard},
  {label: "无限画布", href: "/canvas-studio", icon: Infinity},
];

export function ProjectSidebar({locale}: {locale: Locale}) {
  const pathname = usePathname();
  const [displayName, setDisplayName] = useState("粤叔");

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/auth/session", {cache: "no-store", signal: controller.signal})
      .then((response) => response.json())
      .then((payload: {user?: {name?: string | null; email?: string | null} | null}) => {
        const fallbackName = payload.user?.email?.split("@")[0];
        if (payload.user?.name || fallbackName) {
          setDisplayName(payload.user?.name || fallbackName || "粤叔");
        }
      })
      .catch(() => undefined);

    const handleDisplayNameChange = (event: Event) => {
      const nextDisplayName = (event as CustomEvent<string>).detail;
      if (nextDisplayName) setDisplayName(nextDisplayName);
    };
    window.addEventListener(USER_DISPLAY_NAME_EVENT, handleDisplayNameChange);

    return () => {
      controller.abort();
      window.removeEventListener(USER_DISPLAY_NAME_EVENT, handleDisplayNameChange);
    };
  }, []);

  const shortDisplayName = Array.from(displayName).slice(0, 4).join("");

  return (
    <aside className="fixed inset-y-0 left-0 z-[60] hidden w-[88px] flex-col items-center border-r border-white/10 bg-slate-950/90 py-5 shadow-[18px_0_60px_rgba(0,0,0,0.24)] backdrop-blur-2xl md:flex">
      <Link
        href={withLocale(locale)}
        prefetch={true}
        aria-label="OpenDirector 首页"
        title="OpenDirector"
        className="grid size-11 place-items-center rounded-2xl bg-[linear-gradient(135deg,#ff8a3d,#ff5db1_48%,#8b5cf6)] text-sm font-black text-white shadow-[0_12px_30px_rgba(139,92,246,0.36)]"
      >
        {shortDisplayName}
      </Link>

      <nav aria-label="主导航" className="mt-10 flex flex-1 flex-col items-center gap-3">
        {navigation.map(({label, href, icon: Icon}) => {
          const target = withLocale(locale, href);
          const active = href === "" ? pathname === target : pathname === target || pathname.startsWith(`${target}/`);

          return (
            <Link
              key={label}
              href={target}
              prefetch={true}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              title={label}
              className={cn(
                "group relative grid size-12 place-items-center rounded-2xl border border-transparent text-slate-500 transition duration-300 hover:-translate-y-0.5 hover:border-white/10 hover:bg-white/[0.08] hover:text-white",
                active && "border-white/15 bg-white/[0.12] text-white shadow-[0_12px_32px_rgba(0,0,0,0.28)]",
              )}
            >
              <Icon className="size-5" strokeWidth={active ? 2.4 : 1.8} />
              <span className="pointer-events-none absolute left-[62px] top-1/2 -translate-y-1/2 translate-x-1 rounded-lg border border-white/10 bg-slate-950/95 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-white opacity-0 shadow-xl transition group-hover:translate-x-0 group-hover:opacity-100">
                {label}
              </span>
              {active ? <span className="absolute -left-[21px] h-6 w-1 rounded-r-full bg-violet-400 shadow-[0_0_14px_rgba(167,139,250,0.9)]" /> : null}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col items-center gap-3">
        <Link
          href={withLocale(locale, "/profile")}
          prefetch={true}
          aria-label="个人中心"
          title="个人中心"
          className="group relative grid size-12 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
        >
          <UserRound className="size-5" />
          <span className="pointer-events-none absolute left-[62px] top-1/2 -translate-y-1/2 translate-x-1 rounded-lg border border-white/10 bg-slate-950/95 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-white opacity-0 shadow-xl transition group-hover:translate-x-0 group-hover:opacity-100">
            个人中心
          </span>
        </Link>
        <Link
          href={withLocale(locale, "/signin")}
          prefetch={true}
          aria-label="登录"
          title="登录"
          className="grid size-12 place-items-center rounded-2xl border border-white/10 text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
        >
          <LogIn className="size-5" />
        </Link>
        <button type="button" aria-label="更多菜单" title="更多菜单" className="grid size-12 place-items-center rounded-2xl text-slate-500 transition hover:bg-white/[0.08] hover:text-white">
          <Menu className="size-5" />
        </button>
      </div>
    </aside>
  );
}
