"use client";

import { ArrowUpRight, RefreshCw } from "lucide-react";
import { Button } from "@heroui/react";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import { MarqueeDemo } from "@/components/marquee-demo";

const bars = [28, 51, 35, 16, 43, 22, 25, 30, 8, 42, 36, 31];
const activityTestimonials = [
  {
    quote: "限时抢鲜，连续 7 天每天赠送 100 万 Tokens。",
    name: "抢尝鲜会员",
    designation: "0.99 元 / 7 天",
    src: "/images/membership-showcase/01-trial-member.png",
  },
  {
    quote: "轻度推荐，会员期内共含 3000 万 Tokens。",
    name: "季度会员",
    designation: "29.9 元 · 90 天",
    src: "/images/membership-showcase/02-quarterly-member.png",
  },
  {
    quote: "商家推荐，会员期内共含 6000 万 Tokens。",
    name: "半年会员",
    designation: "49.9 元 · 180 天",
    src: "/images/membership-showcase/03-half-year-member.png",
  },
  {
    quote: "长期划算，会员期内共含 1 亿 Tokens。",
    name: "年度会员",
    designation: "79.9 元 · 365 天",
    src: "/images/membership-showcase/04-annual-member.png",
  },
  {
    quote: "限时早鸟，长期有效并含 1.2 亿 Tokens。",
    name: "终身早鸟会员",
    designation: "99 元 · 长期有效",
    src: "/images/membership-showcase/05-lifetime-member.png",
  },
];

function Trend({
  value,
  positive = true,
}: {
  value: string;
  positive?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${positive ? "bg-emerald-400/10 text-emerald-300" : "bg-rose-400/10 text-rose-300"}`}
    >
      <ArrowUpRight className={`size-3.5 ${positive ? "" : "rotate-90"}`} />
      {value}
    </span>
  );
}

function CardGlow({ dense = false }: { dense?: boolean }) {
  return (
    <DottedGlowBackground
      className="pointer-events-none z-0"
      gap={dense ? 13 : 17}
      radius={dense ? 1 : 1.2}
      color="rgba(100,116,139,0.42)"
      darkColor="rgba(100,116,139,0.42)"
      glowColor="rgba(14,165,233,0.92)"
      darkGlowColor="rgba(103,232,249,0.92)"
      opacity={dense ? 0.58 : 0.48}
      speedScale={0.7}
    />
  );
}

export function ProfileOverview({ projectCount }: { projectCount: number }) {
  const stats = [
    {
      label: "余额",
      value: "¥0.00",
      trend: "可充值",
      positive: true,
    },
    { label: "创作时长", value: "24.6h", trend: "+8.4%", positive: true },
    { label: "素材资产", value: "458", trend: "+3.3%", positive: true },
    { label: "项目完成率", value: "92.4%", trend: "+4.1%", positive: true },
  ];

  return (
    <section className="mt-8" aria-labelledby="overview-title">
      <h2 id="overview-title" className="sr-only">
        创作概览
      </h2>
      <BentoGrid className="sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <BentoGridItem key={stat.label} className="rounded-2xl p-5">
            <CardGlow dense />
            <div className="relative z-10">
              <p className="text-sm text-slate-400">{stat.label}</p>
              <div className="mt-5 flex items-end justify-between gap-3">
                <p className="text-3xl font-semibold tracking-tight text-white">
                  {stat.value}
                </p>
                <Trend value={stat.trend} positive={stat.positive} />
              </div>
            </div>
          </BentoGridItem>
        ))}
      </BentoGrid>

      <BentoGrid className="mt-3 xl:grid-cols-[1.02fr_0.98fr]">
        <BentoGridItem className="p-5 sm:p-6">
          <CardGlow />
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">项目产出</h3>
                <p className="mt-1 text-sm text-slate-400">
                  最近 12 个周期的内容生成数量
                </p>
              </div>
              <Button
                aria-label="刷新项目产出"
                isIconOnly
                variant="tertiary"
                className="text-slate-400 hover:text-white"
              >
                <RefreshCw className="size-4" />
              </Button>
            </div>
            <div className="mt-6 flex items-end gap-3">
              <span className="text-3xl font-semibold text-white">
                {projectCount + 36}
              </span>
              <Trend value="+12.8%" />
            </div>
            <div className="mt-1 text-sm text-slate-400">累计完成项目</div>
            <div className="mt-7 flex h-52 items-end gap-2 border-b border-white/10 px-1 pt-4 sm:gap-3">
              {bars.map((height, index) => (
                <div
                  key={index}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  <div
                    className="w-full max-w-9 rounded-t-xl bg-sky-500 transition hover:bg-sky-300"
                    style={{ height: `${height * 2.65}%` }}
                    title={`${height} 个项目`}
                  />
                  <span className="text-[11px] text-slate-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </BentoGridItem>

        <BentoGridItem className="p-5 sm:p-6">
          <CardGlow />
          <div className="relative z-10 h-full">
            <AnimatedTestimonials
              testimonials={activityTestimonials}
              autoplay
            />
          </div>
        </BentoGridItem>
      </BentoGrid>

      <div className="mt-3">
        <MarqueeDemo />
      </div>
    </section>
  );
}
