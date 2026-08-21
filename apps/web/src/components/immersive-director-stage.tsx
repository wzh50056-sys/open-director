"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bot,
  Clapperboard,
  Eye,
  ImageIcon,
  Pause,
  Play,
  Sparkles,
  Workflow,
} from "lucide-react";
import { normalizeLocale, withLocale, type Locale } from "@/i18n.config";

const tools = [
  {
    label: "短剧工作室",
    kicker: "STORY TO SCREEN",
    title: "让一个故事，长成一部完整短剧",
    description:
      "从故事梗概、角色设定到分镜与成片，让 AI 导演保持叙事节奏和人物一致性。",
    image: "/images/home/seedance-wechat-poster.jpg",
    video: "/images/home/seedance-wechat.mp4",
    icon: Clapperboard,
    accent: "#fb7185",
    href: "/space",
  },
  {
    label: "无限画布",
    kicker: "VISUAL WORKFLOW",
    title: "把灵感放进一张可编排的画布",
    description:
      "自由连接图片、视频、文件与智能节点，快速搭建可复用的创作流程。",
    image: "/images/home/open-director-data-tunnel-poster.png",
    video: "/images/home/open-director-data-tunnel.mp4",
    icon: Workflow,
    accent: "#22d3ee",
    href: "/canvas-studio",
  },
  {
    label: "图像创作",
    kicker: "IMAGE STUDIO",
    title: "建立稳定、统一的视觉世界",
    description:
      "从角色身份板到场景概念图，多风格、多比例生成并保留视觉连续性。",
    image: "/images/adv-style-images/cinematic-photoreal.png",
    icon: ImageIcon,
    accent: "#fbbf24",
    href: "/image",
  },
  {
    label: "精英员工",
    kicker: "AI CREW",
    title: "让专业智能员工加入你的片场",
    description:
      "导演、编剧、分镜师和视觉策划协同推进，把复杂制作拆成清晰任务。",
    image: "/images/home/ai-tech-future-poster.png",
    video: "/images/home/ai-tech-future.mp4",
    icon: Bot,
    accent: "#34d399",
    href: "/agents",
  },
  {
    label: "导演台",
    kicker: "OPEN DIRECTOR",
    title: "从一句想法开始，掌控整条创作链路",
    description:
      "与 AI 导演持续沟通，生成策划、角色、场景与分镜，并随时回到创作决策。",
    image: "/images/home/open-director-particle-warp-poster.png",
    video: "/images/home/open-director-particle-warp.mp4",
    icon: Sparkles,
    accent: "#f472b6",
    href: "/chat",
  },
] as const;

export function ImmersiveDirectorStage({
  locale = "zh-CN",
}: {
  locale?: Locale;
}) {
  const currentLocale = normalizeLocale(locale);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const active = tools[activeIndex];

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(
      () => setActiveIndex((index) => (index + 1) % tools.length),
      6500,
    );
    return () => window.clearInterval(timer);
  }, [playing]);

  const selectTool = (index: number) => {
    setActiveIndex(index);
    setPlaying(false);
  };

  return (
    <section className="relative px-4 pb-10 pt-8 md:ml-[88px] md:px-8 md:pb-16 md:pt-8">
      <div className="mx-auto max-w-[1480px]">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.28em] text-cyan-300">
              OPEN DIRECTOR · FEATURED
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              沉浸式导演选片台
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              选择一种创作能力，主舞台会同步呈现它的画面、定位与入口。
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPlaying((value) => !value)}
            aria-label={playing ? "暂停自动轮播" : "继续自动轮播"}
            aria-pressed={!playing}
            className="inline-flex h-11 w-fit items-center gap-2 rounded-full border border-white/15 bg-black/35 px-4 text-sm font-medium text-white backdrop-blur-xl transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
            {playing ? "暂停轮播" : "继续轮播"}
          </button>
        </div>

        <div className="grid overflow-hidden rounded-[32px] border border-white/10 bg-[#050711]/90 shadow-[0_36px_120px_rgba(0,0,0,.55)] lg:grid-cols-[260px_1fr]">
          <div className="order-2 grid grid-cols-2 gap-2 border-t border-white/10 bg-black/30 p-3 sm:grid-cols-3 lg:order-1 lg:grid-cols-1 lg:border-r lg:border-t-0 lg:p-4">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              const selected = index === activeIndex;
              return (
                <button
                  key={tool.label}
                  type="button"
                  onClick={() => selectTool(index)}
                  aria-pressed={selected}
                  className={`group flex min-h-16 items-center gap-3 rounded-2xl border px-3 text-left transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 lg:min-h-20 lg:px-4 ${selected ? "border-white/20 bg-white/[0.11] text-white" : "border-transparent text-slate-400 hover:bg-white/[0.06] hover:text-white"}`}
                >
                  <span
                    className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-black/30"
                    style={
                      selected
                        ? {
                            color: tool.accent,
                            boxShadow: `0 0 28px ${tool.accent}33`,
                          }
                        : undefined
                    }
                  >
                    <Icon size={20} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">
                      {tool.label}
                    </span>
                    <span className="mt-1 hidden text-[10px] tracking-wider text-slate-600 lg:block">
                      0{index + 1} / 06
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="order-1 relative min-h-[590px] overflow-hidden lg:order-2 lg:min-h-[680px]">
            <div
              key={active.label}
              className="director-stage-content absolute inset-0"
            >
              {"video" in active ? (
                <video
                  className="size-full object-cover"
                  src={active.video}
                  poster={active.image}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <Image
                  src={active.image}
                  alt=""
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1200px"
                />
              )}
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,5,13,.88)_0%,rgba(3,5,13,.44)_48%,rgba(3,5,13,.14)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(3,5,13,.92),transparent_60%)]" />
            <div
              key={`${active.label}-copy`}
              className="director-stage-copy relative z-10 flex min-h-[590px] max-w-3xl flex-col justify-end p-6 sm:p-10 lg:min-h-[680px] lg:p-16"
            >
              <p
                className="text-xs font-bold tracking-[0.3em]"
                style={{ color: active.accent }}
              >
                {active.kicker}
              </p>
              <h2 className="mt-4 text-balance text-4xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
                {active.title}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                {active.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={withLocale(currentLocale, active.href)}
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
                >
                  进入工作台 <ArrowRight size={16} />
                </Link>
                <a
                  href="#workflow-marketplace"
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 bg-black/30 px-5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
                >
                  <Eye size={16} /> 查看能力
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
