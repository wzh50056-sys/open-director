"use client";

import {
  CalendarDays,
  Check,
  FolderOpen,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { BentoGridItem } from "@/components/ui/bento-grid";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";

type ProfileDraggableCardProps = {
  displayName: string;
  email: string;
  userId: string;
  joinedAt: string;
  projectCount: number;
  image?: string | null;
};

export function ProfileDraggableCard({
  displayName,
  email,
  userId,
  joinedAt,
  projectCount,
  image,
}: ProfileDraggableCardProps) {
  return (
    <BentoGridItem className="w-full bg-[#111827]/95 shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-xl">
      <DottedGlowBackground
        className="pointer-events-none z-0 [mask-image:linear-gradient(to_bottom,black,black_78%,transparent)]"
        gap={15}
        radius={1.25}
        color="rgba(100,116,139,0.5)"
        darkColor="rgba(100,116,139,0.5)"
        glowColor="rgba(34,211,238,0.95)"
        darkGlowColor="rgba(167,139,250,0.95)"
        opacity={0.72}
        speedScale={0.8}
      />
      <div className="relative z-10 p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            账号与会员
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            在线
          </span>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-300 to-emerald-600 text-lg font-bold text-white shadow-[0_10px_30px_rgba(16,185,129,0.25)]">
            {image ? (
              <img
                src={image}
                alt="头像"
                draggable={false}
                className="size-full object-cover"
              />
            ) : (
              displayName.slice(0, 1).toUpperCase()
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-semibold text-white">
              {displayName}
            </h2>
            <p className="mt-1 truncate text-xs text-slate-400">{email}</p>
            <p
              className="mt-1 truncate text-[11px] text-slate-600"
              title={userId}
            >
              用户 ID · {userId}
            </p>
          </div>
        </div>

        <div className="my-5 h-px bg-white/[0.07]" />

        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-3xl font-black tracking-tight text-emerald-400">
              已开通
            </p>
            <p className="mt-1 text-sm font-semibold text-white">
              OpenDirector 创作者会员
            </p>
          </div>
          <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
            账户正常
          </span>
        </div>

        <div className="mt-5 space-y-2 rounded-2xl bg-black/20 p-3.5">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="flex items-center gap-2 text-slate-400">
              <ShieldCheck className="size-3.5" />
              会员状态
            </span>
            <span className="font-medium text-white">会员有效</span>
          </div>
          <div className="h-px bg-white/[0.06]" />
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="flex items-center gap-2 text-slate-400">
              <CalendarDays className="size-3.5" />
              加入时间
            </span>
            <span className="font-medium text-white">{joinedAt}</span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-sky-400/[0.07] p-3">
            <Mail className="size-4 text-sky-300" />
            <p className="mt-2 text-[11px] text-slate-500">登录邮箱</p>
            <p
              className="mt-1 truncate text-xs font-medium text-slate-200"
              title={email}
            >
              {email}
            </p>
          </div>
          <div className="rounded-2xl bg-violet-400/[0.07] p-3">
            <FolderOpen className="size-4 text-violet-300" />
            <p className="mt-2 text-[11px] text-slate-500">我的项目</p>
            <p className="mt-1 text-xs font-medium text-slate-200">
              {projectCount} 个项目
            </p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl bg-cyan-400/[0.06] p-3.5">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-xs font-medium text-white">
              <UserRound className="size-4 text-cyan-300" />
              代理信息
            </span>
            <span className="rounded-full bg-white/[0.06] px-2 py-1 text-[10px] text-slate-400">
              未开通
            </span>
          </div>
          <p className="mt-2 text-[11px] leading-5 text-slate-500">
            当前官网账号尚未开通代理身份。
          </p>
          <button
            type="button"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400/10 py-2 text-xs font-medium text-cyan-200 transition hover:bg-cyan-400/20"
          >
            <Check className="size-3.5" />
            查看代理中心
          </button>
        </div>
      </div>
    </BentoGridItem>
  );
}
