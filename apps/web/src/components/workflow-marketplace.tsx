"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Boxes,
  Check,
  ChevronRight,
  Clock3,
  Copy,
  ImageIcon,
  Layers3,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Workflow,
  X,
} from "lucide-react";
import { normalizeLocale, withLocale, type Locale } from "@/i18n.config";

type AssetCategory = "作品" | "工作流" | "数字员工" | "素材包";
type MarketFilter = "热门" | "最新" | "最多复制" | "免费";

type MarketAsset = {
  id: string;
  category: AssetCategory;
  title: string;
  summary: string;
  description: string;
  author: string;
  avatar: string;
  price: number;
  nodes: number;
  models: string[];
  rating: number;
  copies: number;
  isNew?: boolean;
  official?: boolean;
  image: string;
  nodeFlow: string[];
};

const categories: Array<{ label: AssetCategory; icon: typeof Workflow }> = [
  { label: "作品", icon: ImageIcon },
  { label: "工作流", icon: Workflow },
];

const filters: MarketFilter[] = ["热门", "最新", "最多复制", "免费"];

const assets: MarketAsset[] = [
  {
    id: "rain-chase",
    category: "工作流",
    title: "雨夜追踪：一镜到底动作短片",
    summary: "从故事节拍、角色一致性到镜头运动，完整拆解霓虹雨夜动作短片。",
    description:
      "适合制作具有电影感的城市追逐与动作叙事。工作流会先建立角色与场景参考，再生成镜头计划、首帧和视频任务，最后进入统一剪辑。",
    author: "OpenDirector Studio",
    avatar: "OD",
    price: 0,
    nodes: 18,
    models: ["Seedance 2.0", "GPT-5"],
    rating: 4.9,
    copies: 328,
    official: true,
    image: "/images/home/seedance-wechat-poster.jpg",
    nodeFlow: [
      "导演简报",
      "角色参考",
      "分镜拆解",
      "首帧生成",
      "视频生成",
      "成片剪辑",
    ],
  },
  {
    id: "brand-film",
    category: "工作流",
    title: "品牌发布：高级感商业短片",
    summary: "用产品卖点生成分镜、布光方案和节奏明确的品牌视频。",
    description:
      "面向产品发布、品牌故事和社交广告的商业制作模板，强调材质、灯光与镜头运动的一致性。",
    author: "FrameLab",
    avatar: "FL",
    price: 12,
    nodes: 14,
    models: ["Seedance 2.0", "Flux"],
    rating: 4.8,
    copies: 246,
    isNew: true,
    image: "/images/home/open-director-cyber-glass-poster.png",
    nodeFlow: ["卖点提炼", "视觉基调", "产品首帧", "运镜方案", "视频生成"],
  },
  {
    id: "digital-host",
    category: "数字员工",
    title: "真人口播策划与批量生成专员",
    summary: "自动整理选题、口播文案、画面提示词与批量视频任务。",
    description:
      "适合知识账号、品牌主理人和无人频道。数字员工会把主题转成可拍摄脚本，并准备每段口播对应的画面和字幕建议。",
    author: "YSAI Creator",
    avatar: "YS",
    price: 18,
    nodes: 21,
    models: ["GPT-5", "Seedance 2.0"],
    rating: 4.9,
    copies: 519,
    official: true,
    image: "/images/home/ai-tech-future-poster.png",
    nodeFlow: [
      "选题分析",
      "口播脚本",
      "镜头提示",
      "数字人口播",
      "字幕包装",
      "批量发布",
    ],
  },
  {
    id: "character-pack",
    category: "素材包",
    title: "电影角色一致性参考素材包",
    summary: "包含人物正侧背、表情、服装和常用电影构图参考。",
    description:
      "为连续剧情和多镜头制作准备的角色参考素材，覆盖身份板、服装变化和情绪表演，可直接作为图像或视频模型参考。",
    author: "Character Dept.",
    avatar: "CD",
    price: 8,
    nodes: 9,
    models: ["Flux", "Nano Banana"],
    rating: 4.7,
    copies: 187,
    image: "/images/adv-style-images/cinematic-photoreal.png",
    nodeFlow: ["角色身份板", "服装组", "表情组", "姿态参考", "镜头构图"],
  },
  {
    id: "ink-dream",
    category: "作品",
    title: "山水如梦：国风意识流短片",
    summary: "水墨人物、山水空间与现代镜头语言融合的实验作品。",
    description:
      "展示中国水墨、双重曝光和镜头转场的组合方式，可查看完整制作说明并复用为自己的国风项目。",
    author: "Lin Film Lab",
    avatar: "LF",
    price: 0,
    nodes: 11,
    models: ["Seedance 2.0", "Flux"],
    rating: 4.8,
    copies: 402,
    image: "/images/adv-style-images/ink-wash.png",
    nodeFlow: ["诗意文本", "水墨风格", "人物剪影", "双重曝光", "节奏剪辑"],
  },
  {
    id: "ecommerce-grid",
    category: "工作流",
    title: "电商产品九宫格到动态广告",
    summary: "一张产品图生成九种卖点画面，并自动组织成短视频广告。",
    description:
      "适合电商详情页、社交媒体投放和新品上架。输入产品图与卖点后，自动生成多场景静帧和动态广告结构。",
    author: "Commerce AI",
    avatar: "CA",
    price: 0,
    nodes: 16,
    models: ["Nano Banana", "Seedance 2.0"],
    rating: 4.6,
    copies: 691,
    isNew: true,
    image: "/images/adv-style-images/studio-commercial.png",
    nodeFlow: ["商品识别", "卖点拆分", "九宫格生成", "动态镜头", "广告成片"],
  },
  {
    id: "story-director",
    category: "数字员工",
    title: "连续短剧导演与分镜监督",
    summary: "维护角色目标、冲突节奏与跨集镜头连续性的导演代理。",
    description:
      "适合连续短剧、漫剧与系列内容。它会在每次生成前检查角色状态和情节进度，降低跨集设定漂移。",
    author: "OpenDirector Studio",
    avatar: "OD",
    price: 28,
    nodes: 26,
    models: ["GPT-5", "Seedance 2.0"],
    rating: 5,
    copies: 733,
    official: true,
    image: "/images/adv-style-images/manga-panels.png",
    nodeFlow: [
      "系列圣经",
      "分集规划",
      "角色状态",
      "场景连续性",
      "分镜审查",
      "制作交付",
    ],
  },
  {
    id: "neon-assets",
    category: "素材包",
    title: "霓虹城市电影镜头素材包",
    summary: "雨夜街道、室内灯光、空镜和转场参考素材合集。",
    description:
      "为赛博都市、悬疑和动作内容准备的高质感镜头素材，包含构图参考、环境氛围和可复用提示词。",
    author: "Night Unit",
    avatar: "NU",
    price: 6,
    nodes: 7,
    models: ["Seedance 2.0", "Flux"],
    rating: 4.7,
    copies: 354,
    image: "/images/adv-style-images/neon-realism.png",
    nodeFlow: ["街道空镜", "人物背影", "霓虹反射", "室内布光", "转场参考"],
  },
];

function priceLabel(price: number) {
  return price === 0 ? "免费" : `¥${price}`;
}

export function WorkflowMarketplace({ locale = "en" }: { locale?: Locale }) {
  const currentLocale = normalizeLocale(locale);
  const [category, setCategory] = useState<AssetCategory>("工作流");
  const [filter, setFilter] = useState<MarketFilter>("热门");
  const [query, setQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset | null>(null);
  const [notice, setNotice] = useState("");
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const visibleAssets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    let result = assets.filter((asset) => asset.category === category);
    if (normalizedQuery) {
      result = result.filter((asset) =>
        `${asset.title} ${asset.summary} ${asset.author} ${asset.models.join(" ")}`
          .toLowerCase()
          .includes(normalizedQuery),
      );
    }
    if (filter === "免费") return result.filter((asset) => asset.price === 0);
    if (filter === "最新")
      return [...result].sort(
        (a, b) =>
          Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)) ||
          b.copies - a.copies,
      );
    if (filter === "最多复制")
      return [...result].sort((a, b) => b.copies - a.copies);
    return [...result].sort(
      (a, b) => b.rating - a.rating || b.copies - a.copies,
    );
  }, [category, filter, query]);

  useEffect(() => {
    if (!selectedAsset) return;
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedAsset(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedAsset]);

  function handleCopy(asset: MarketAsset) {
    if (asset.price > 0) {
      setNotice("付费复制需要接入后端订单与支付系统，目前仅展示商品状态。");
      return;
    }
    setNotice("免费工作流已准备好，进入导演台后即可建立自己的项目副本。");
  }

  return (
    <section
      id="workflow-marketplace"
      className="mx-auto w-full max-w-[1500px] scroll-mt-24 px-4 pb-20 pt-10 sm:px-6 md:ml-[88px] md:w-[calc(100%-88px)] lg:px-8 lg:pt-16"
      aria-labelledby="market-heading"
    >
      <div className="mb-8 grid items-end gap-6 xl:grid-cols-[minmax(0,1fr)_520px]">
        <div>
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.22em] text-cyan-300">
            <Sparkles className="size-4" aria-hidden="true" />
            OPEN DIRECTOR MARKET
          </p>
          <h1
            id="market-heading"
            className="max-w-4xl text-balance text-4xl font-semibold leading-[1.03] tracking-[-0.035em] text-white sm:text-5xl xl:text-[62px]"
          >
            发现、评估并复制专业 AI 创作资产。
          </h1>
          <p className="mt-4 max-w-3xl text-pretty text-sm leading-7 text-slate-400 sm:text-base">
            从完整作品到可复用工作流，把成熟的创作方法直接带入你的下一个项目。
          </p>
        </div>
        <label className="flex min-h-14 items-center gap-3 rounded-2xl border border-white/10 bg-[#0b0e16]/85 px-5 text-slate-400 shadow-[0_16px_50px_rgba(0,0,0,0.24)] backdrop-blur-xl focus-within:border-cyan-300/60 focus-within:ring-2 focus-within:ring-cyan-300/20">
          <Search className="size-5 shrink-0" aria-hidden="true" />
          <span className="sr-only">搜索市场资产</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-slate-600"
            placeholder="搜索名称、作者或模型"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="清除搜索"
              className="grid size-10 cursor-pointer place-items-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </label>
      </div>

      <div className="mb-6 rounded-[26px] border border-white/10 bg-[#090c13]/88 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-xl">
        <div
          className="grid grid-cols-2 gap-2 md:grid-cols-4"
          role="tablist"
          aria-label="市场分类"
        >
          {categories.map(({ label, icon: Icon }) => {
            const active = category === label;
            const count = assets.filter(
              (asset) => asset.category === label,
            ).length;
            return (
              <button
                key={label}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(label)}
                className={`flex min-h-16 cursor-pointer items-center justify-between rounded-2xl border px-4 text-left transition duration-200 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none ${active ? "border-white/20 bg-white text-slate-950" : "border-transparent bg-white/[0.025] text-slate-400 hover:border-white/10 hover:bg-white/[0.065] hover:text-white"}`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="size-[19px]" aria-hidden="true" />
                  <span className="text-sm font-semibold">{label}</span>
                </span>
                <span
                  className={`text-xs tabular-nums ${active ? "text-slate-500" : "text-slate-600"}`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" aria-label="排序与筛选">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
              className={`min-h-11 cursor-pointer rounded-full border px-4 text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none ${filter === item ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-200" : "border-white/10 bg-white/[0.03] text-slate-500 hover:bg-white/[0.07] hover:text-white"}`}
            >
              {item}
            </button>
          ))}
        </div>
        <p className="text-sm text-slate-500">
          找到{" "}
          <span className="font-semibold text-white">
            {visibleAssets.length}
          </span>{" "}
          个{category}
        </p>
      </div>

      {visibleAssets.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleAssets.map((asset) => (
            <button
              key={asset.id}
              type="button"
              onClick={() => {
                setSelectedAsset(asset);
                setNotice("");
              }}
              className="group cursor-pointer overflow-hidden rounded-[26px] border border-white/10 bg-[#0a0d14]/95 text-left shadow-[0_24px_70px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_30px_90px_rgba(0,0,0,0.44)] focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={asset.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.035]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080a10] via-transparent to-black/20" />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span
                    className={`rounded-full border px-3 py-1.5 text-xs font-bold backdrop-blur-xl ${asset.price === 0 ? "border-emerald-300/30 bg-emerald-400/18 text-emerald-200" : "border-amber-200/30 bg-amber-300/18 text-amber-100"}`}
                  >
                    {priceLabel(asset.price)}
                  </span>
                  {asset.official ? (
                    <span className="rounded-full border border-violet-300/30 bg-violet-400/18 px-3 py-1.5 text-xs font-semibold text-violet-100 backdrop-blur-xl">
                      官方精选
                    </span>
                  ) : asset.isNew ? (
                    <span className="rounded-full border border-cyan-300/30 bg-cyan-400/18 px-3 py-1.5 text-xs font-semibold text-cyan-100 backdrop-blur-xl">
                      新增
                    </span>
                  ) : null}
                </div>
                <div className="absolute right-4 bottom-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-xl">
                  <Layers3 className="size-3.5" aria-hidden="true" />
                  {asset.nodes} 节点
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-500">
                      {asset.author}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold leading-7 text-white">
                      {asset.title}
                    </h2>
                  </div>
                  <ChevronRight
                    className="mt-1 size-5 shrink-0 text-slate-600 transition group-hover:translate-x-1 group-hover:text-white"
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-slate-400">
                  {asset.summary}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {asset.models.map((model) => (
                    <span
                      key={model}
                      className="rounded-lg border border-white/[0.08] bg-white/[0.035] px-2.5 py-1 text-[11px] font-medium text-slate-400"
                    >
                      {model}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-white/[0.08] pt-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Star
                      className="size-3.5 fill-amber-300 text-amber-300"
                      aria-hidden="true"
                    />
                    <span className="font-semibold text-amber-100">
                      {asset.rating.toFixed(1)}
                    </span>
                  </span>
                  <span>{asset.copies} 次复制</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="grid min-h-72 place-items-center rounded-[26px] border border-dashed border-white/10 bg-white/[0.02] text-center">
          <div>
            <Boxes className="mx-auto size-8 text-slate-600" />
            <h2 className="mt-4 text-lg font-semibold text-white">
              没有匹配的资产
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              尝试更换分类、筛选条件或搜索关键词。
            </p>
          </div>
        </div>
      )}

      {selectedAsset ? (
        <div
          className="fixed inset-0 z-[100]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="asset-drawer-title"
        >
          <button
            type="button"
            aria-label="关闭详情"
            onClick={() => setSelectedAsset(null)}
            className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
          />
          <aside className="market-drawer absolute inset-y-0 right-0 flex w-full max-w-[620px] flex-col overflow-y-auto border-l border-white/10 bg-[#080b12] shadow-[-30px_0_100px_rgba(0,0,0,0.62)]">
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#080b12]/90 px-5 py-4 backdrop-blur-xl sm:px-7">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.2em] text-cyan-300">
                  ASSET DETAILS
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedAsset.category}
                </p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setSelectedAsset(null)}
                aria-label="关闭详情抽屉"
                className="grid size-11 cursor-pointer place-items-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="p-5 sm:p-7">
              <div className="relative aspect-video overflow-hidden rounded-[22px] border border-white/10">
                <Image
                  src={selectedAsset.image}
                  alt={`${selectedAsset.title}预览`}
                  fill
                  sizes="620px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute right-4 bottom-4 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                  {priceLabel(selectedAsset.price)}
                </div>
              </div>
              <div className="mt-7 flex items-start gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-sm font-bold text-white">
                  {selectedAsset.avatar}
                </span>
                <div>
                  <p className="text-sm text-slate-500">
                    {selectedAsset.author}
                  </p>
                  <h2
                    id="asset-drawer-title"
                    className="mt-1 text-3xl font-semibold leading-tight tracking-[-0.025em] text-white"
                  >
                    {selectedAsset.title}
                  </h2>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Star className="size-4 fill-amber-300 text-amber-300" />
                  {selectedAsset.rating.toFixed(1)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Copy className="size-4" />
                  {selectedAsset.copies} 次复制
                </span>
                <span className="flex items-center gap-1.5">
                  <Layers3 className="size-4" />
                  {selectedAsset.nodes} 节点
                </span>
              </div>
              <section className="mt-8">
                <h3 className="text-sm font-semibold text-white">工作流说明</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {selectedAsset.description}
                </p>
              </section>
              <section className="mt-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">节点结构</h3>
                  <span className="text-xs text-slate-600">
                    {selectedAsset.nodeFlow.length} 个核心阶段
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  {selectedAsset.nodeFlow.map((node, index) => (
                    <div
                      key={node}
                      className="flex min-h-12 items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4"
                    >
                      <span className="grid size-6 place-items-center rounded-full bg-cyan-300/10 text-[10px] font-bold text-cyan-200">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium text-slate-300">
                        {node}
                      </span>
                      {index < selectedAsset.nodeFlow.length - 1 ? (
                        <ArrowRight className="ml-auto size-3.5 text-slate-700" />
                      ) : (
                        <Check className="ml-auto size-3.5 text-emerald-400" />
                      )}
                    </div>
                  ))}
                </div>
              </section>
              <section className="mt-8">
                <h3 className="text-sm font-semibold text-white">支持模型</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedAsset.models.map((model) => (
                    <span
                      key={model}
                      className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-slate-300"
                    >
                      {model}
                    </span>
                  ))}
                </div>
              </section>
              {notice ? (
                <div
                  role="status"
                  className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/[0.07] p-4 text-sm leading-6 text-amber-100"
                >
                  {notice}
                </div>
              ) : null}
            </div>
            <div className="sticky bottom-0 mt-auto border-t border-white/10 bg-[#080b12]/92 p-5 backdrop-blur-xl sm:p-7">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">当前价格</p>
                  <p className="mt-1 text-2xl font-semibold text-white">
                    {priceLabel(selectedAsset.price)}
                  </p>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-emerald-300">
                  <ShieldCheck className="size-4" />
                  资产信息已校验
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(selectedAsset)}
                className="flex min-h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-bold text-slate-950 transition hover:bg-cyan-100 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080b12] focus-visible:outline-none"
              >
                <Copy className="size-4" />
                {selectedAsset.price === 0
                  ? "复制到我的项目"
                  : `${priceLabel(selectedAsset.price)} · 购买并复制`}
              </button>
              {selectedAsset.price > 0 ? (
                <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-600">
                  <Clock3 className="size-3.5" />
                  真实付费需接入后端订单系统
                </p>
              ) : (
                <Link
                  href={withLocale(currentLocale, "/chat")}
                  className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-cyan-300 hover:text-cyan-200"
                >
                  进入导演台建立项目
                  <ArrowRight className="size-3.5" />
                </Link>
              )}
            </div>
          </aside>
        </div>
      ) : null}
    </section>
  );
}
