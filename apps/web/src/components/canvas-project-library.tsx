"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImageIcon, Infinity, LoaderCircle, Plus, Trash2 } from "lucide-react";
import { withLocale, type Locale } from "@/i18n.config";

type CanvasProject = { id: string; title: string; description: string | null; updatedAt: string; blockCount: number; assetCount: number; coverUrl: string | null };

export function CanvasProjectLibrary({ locale, initialProjects }: { locale: Locale; initialProjects: CanvasProject[] }) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function createCanvas() {
    if (creating) return;
    setCreating(true);
    try {
      const response = await fetch("/api/threads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: `无限画布 ${projects.length + 1}`, description: "在 OpenDirector 中创建的无限画布" }) });
      if (!response.ok) throw new Error("创建画布失败");
      const payload = await response.json() as { thread: { id: string } };
      router.push(withLocale(locale, `/canvas/${payload.thread.id}`));
    } finally { setCreating(false); }
  }

  async function deleteCanvas(id: string) {
    if (deletingId) return;
    setDeletingId(id);
    try {
      const response = await fetch(`/api/threads/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("删除画布失败");
      setProjects((items) => items.filter((item) => item.id !== id));
    } finally { setDeletingId(null); }
  }

  return (
    <main className="min-h-dvh bg-[#070911] text-white">
      <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-white/10 bg-[#090c16]/90 px-4 backdrop-blur-xl sm:px-6">
        <Link href={withLocale(locale, "/space")} className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"><ArrowLeft className="size-4" />返回项目</Link>
        <div className="flex items-center gap-2 text-sm font-semibold"><Infinity className="size-5 text-cyan-300" />无限画布</div>
        <button type="button" onClick={() => void createCanvas()} disabled={creating} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-cyan-400 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60">{creating ? <LoaderCircle className="size-4 animate-spin" /> : <Plus className="size-4" />}新建画布</button>
      </header>
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="mb-8"><p className="text-xs font-medium tracking-[0.24em] text-cyan-300 uppercase">OpenDirector Canvas</p><h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">在一个画布里组织全部故事内容</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">直接使用主项目的数据、登录状态和路由，不再依赖 3003 端口或外部页面。</p></div>
        {projects.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{projects.map((project) => (
            <article key={project.id} className="group overflow-hidden rounded-2xl border border-white/10 bg-[#101522] shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-cyan-300/40">
              <Link href={withLocale(locale, `/canvas/${project.id}`)} className="block focus-visible:ring-2 focus-visible:ring-cyan-300">
                <div className="relative h-44 overflow-hidden bg-[#0a0e18]">{project.coverUrl ? <img src={project.coverUrl} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_center,rgba(34,211,238,.13),transparent_65%)]"><ImageIcon className="size-10 text-slate-600" /></div>}<span className="absolute left-3 top-3 rounded-lg border border-white/10 bg-black/60 px-2.5 py-1 text-xs text-cyan-200 backdrop-blur">{project.blockCount} 个故事节点</span></div>
                <div className="p-5"><h2 className="truncate text-lg font-semibold">{project.title}</h2><p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-400">{project.description || "打开画布，开始整理故事节点、图片和镜头。"}</p><div className="mt-4 flex items-center justify-between text-xs text-slate-500"><span>{project.assetCount} 个素材</span><span>{new Date(project.updatedAt).toLocaleDateString("zh-CN")}</span></div></div>
              </Link>
              <div className="border-t border-white/10 px-4 py-2 text-right"><button type="button" aria-label={`删除 ${project.title}`} disabled={deletingId === project.id} onClick={() => void deleteCanvas(project.id)} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-xs text-slate-500 transition hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"><Trash2 className="size-3.5" />删除</button></div>
            </article>
          ))}</div>
        ) : (
          <div className="grid min-h-[440px] place-items-center rounded-3xl border border-dashed border-white/15 bg-white/[0.02] text-center"><div><Infinity className="mx-auto size-12 text-cyan-300" /><h2 className="mt-5 text-xl font-semibold">还没有画布</h2><p className="mt-2 text-sm text-slate-400">创建第一个画布，内容会直接保存在 OpenDirector 项目中。</p><button type="button" onClick={() => void createCanvas()} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-cyan-400 px-5 text-sm font-semibold text-slate-950"><Plus className="size-4" />新建画布</button></div></div>
        )}
      </section>
    </main>
  );
}
