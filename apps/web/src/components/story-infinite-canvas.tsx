"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type WheelEvent } from "react";
import { ArrowLeft, Download, Hand, ImageIcon, LayoutGrid, MousePointer2, Redo2, RotateCcw, Upload, ZoomIn, ZoomOut } from "lucide-react";
import { withLocale, type Locale } from "@/i18n.config";

type StoryBlock = { id: string; order: number; title: string; script: string | null; visualPrompt: string | null };
type StoryAsset = { id: string; blockId: string | null; type: string; title: string; url: string | null };
type CanvasNode = StoryBlock & { x: number; y: number; width: number; height: number; imageUrl?: string };
type Viewport = { x: number; y: number; scale: number };
type Snapshot = { nodes: CanvasNode[]; viewport: Viewport };

const NODE_WIDTH = 296;
const NODE_HEIGHT = 238;
const STORAGE_PREFIX = "open-director:infinite-canvas:";

function initialNodes(blocks: StoryBlock[], assets: StoryAsset[]): CanvasNode[] {
  return blocks.map((block, index) => {
    const image = assets.find((asset) => asset.blockId === block.id && asset.type === "IMAGE" && asset.url);
    return {
      ...block,
      x: 120 + (index % 4) * 380,
      y: 100 + Math.floor(index / 4) * 330,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      imageUrl: image?.url || undefined,
    };
  });
}

export function StoryInfiniteCanvas({ locale, threadId, title, blocks, assets }: { locale: Locale; threadId: string; title: string; blocks: StoryBlock[]; assets: StoryAsset[] }) {
  const defaults = useMemo(() => initialNodes(blocks, assets), [blocks, assets]);
  const [nodes, setNodes] = useState(defaults);
  const [viewport, setViewport] = useState<Viewport>({ x: 60, y: 40, scale: 0.8 });
  const [tool, setTool] = useState<"select" | "pan">("select");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [future, setFuture] = useState<Snapshot[]>([]);
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const importRef = useRef<HTMLInputElement>(null);
  const interaction = useRef<{ mode: "pan" | "drag"; startX: number; startY: number; originX: number; originY: number; nodeId?: string; before: Snapshot } | null>(null);

  const snapshot = useCallback((): Snapshot => ({ nodes, viewport }), [nodes, viewport]);
  const commit = useCallback((before: Snapshot) => {
    setHistory((items) => [...items.slice(-39), before]);
    setFuture([]);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}${threadId}`);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<Snapshot>;
        if (Array.isArray(parsed.nodes) && parsed.nodes.length) setNodes(parsed.nodes);
        if (parsed.viewport && typeof parsed.viewport.scale === "number") setViewport(parsed.viewport);
      }
    } catch {
      // Invalid local layouts are ignored and replaced by the generated layout.
    }
    setReady(true);
  }, [threadId]);

  useEffect(() => {
    if (!ready) return;
    const timer = window.setTimeout(() => localStorage.setItem(`${STORAGE_PREFIX}${threadId}`, JSON.stringify({ nodes, viewport })), 350);
    return () => window.clearTimeout(timer);
  }, [nodes, ready, threadId, viewport]);

  const changeScale = useCallback((nextScale: number, clientX?: number, clientY?: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const scale = Math.min(2, Math.max(0.25, nextScale));
    const px = (clientX ?? rect.left + rect.width / 2) - rect.left;
    const py = (clientY ?? rect.top + rect.height / 2) - rect.top;
    setViewport((current) => {
      const worldX = (px - current.x) / current.scale;
      const worldY = (py - current.y) / current.scale;
      return { x: px - worldX * scale, y: py - worldY * scale, scale };
    });
  }, []);

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    changeScale(viewport.scale * Math.exp(-event.deltaY * 0.0015), event.clientX, event.clientY);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    const nodeElement = target.closest<HTMLElement>("[data-story-node]");
    const before = snapshot();
    if (nodeElement && tool === "select") {
      const node = nodes.find((item) => item.id === nodeElement.dataset.storyNode);
      if (!node) return;
      setSelectedId(node.id);
      interaction.current = { mode: "drag", startX: event.clientX, startY: event.clientY, originX: node.x, originY: node.y, nodeId: node.id, before };
    } else {
      setSelectedId(null);
      interaction.current = { mode: "pan", startX: event.clientX, startY: event.clientY, originX: viewport.x, originY: viewport.y, before };
    }
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const active = interaction.current;
    if (!active) return;
    const dx = event.clientX - active.startX;
    const dy = event.clientY - active.startY;
    if (active.mode === "pan") setViewport((current) => ({ ...current, x: active.originX + dx, y: active.originY + dy }));
    if (active.mode === "drag" && active.nodeId) {
      setNodes((items) => items.map((node) => node.id === active.nodeId ? { ...node, x: active.originX + dx / viewport.scale, y: active.originY + dy / viewport.scale } : node));
    }
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    const active = interaction.current;
    if (!active) return;
    if (Math.abs(event.clientX - active.startX) > 2 || Math.abs(event.clientY - active.startY) > 2) commit(active.before);
    interaction.current = null;
  }

  function undo() {
    const previous = history.at(-1);
    if (!previous) return;
    setFuture((items) => [snapshot(), ...items].slice(0, 40));
    setHistory((items) => items.slice(0, -1));
    setNodes(previous.nodes);
    setViewport(previous.viewport);
  }

  function redo() {
    const next = future[0];
    if (!next) return;
    setHistory((items) => [...items, snapshot()].slice(-40));
    setFuture((items) => items.slice(1));
    setNodes(next.nodes);
    setViewport(next.viewport);
  }

  function autoLayout() {
    const before = snapshot();
    setNodes((items) => items.map((node, index) => ({ ...node, x: 120 + (index % 4) * 380, y: 100 + Math.floor(index / 4) * 330 })));
    setViewport({ x: 60, y: 40, scale: 0.8 });
    commit(before);
  }

  function exportCanvas() {
    const blob = new Blob([JSON.stringify({ version: 1, title, nodes, viewport }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title || "故事画布"}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function importCanvas(file: File) {
    try {
      const parsed = JSON.parse(await file.text()) as Partial<Snapshot>;
      if (!Array.isArray(parsed.nodes) || !parsed.viewport) return;
      const before = snapshot();
      setNodes(parsed.nodes);
      setViewport(parsed.viewport);
      commit(before);
    } finally {
      if (importRef.current) importRef.current.value = "";
    }
  }

  const worldWidth = Math.max(1700, ...nodes.map((node) => node.x + node.width + 120));
  const worldHeight = Math.max(900, ...nodes.map((node) => node.y + node.height + 120));

  return (
    <main className="flex min-h-dvh flex-col overflow-hidden bg-[#070911] text-white">
      <header className="z-20 flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-[#090c16]/95 px-4 backdrop-blur-xl">
        <div className="flex min-w-0 items-center gap-3">
          <Link href={withLocale(locale, `/creation/${threadId}`)} className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-300">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />返回编辑器
          </Link>
          <div className="hidden min-w-0 border-l border-white/10 pl-4 sm:block">
            <h1 className="truncate text-sm font-semibold">{title}</h1>
            <p className="text-xs text-slate-500">无限故事画布 · {nodes.length} 集 · 自动保存</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ToolbarButton label="导入画布" onClick={() => importRef.current?.click()}><Upload /></ToolbarButton>
          <ToolbarButton label="导出画布" onClick={exportCanvas}><Download /></ToolbarButton>
          <input ref={importRef} className="hidden" type="file" accept="application/json" onChange={(event) => event.target.files?.[0] && void importCanvas(event.target.files[0])} />
        </div>
      </header>

      <div className="relative min-h-0 flex-1">
        <div className="absolute left-4 top-4 z-20 flex items-center gap-1 rounded-xl border border-white/10 bg-[#111522]/95 p-1.5 shadow-2xl shadow-black/30">
          <ToolbarButton label="选择工具" active={tool === "select"} onClick={() => setTool("select")}><MousePointer2 /></ToolbarButton>
          <ToolbarButton label="平移工具" active={tool === "pan"} onClick={() => setTool("pan")}><Hand /></ToolbarButton>
          <span className="mx-1 h-6 w-px bg-white/10" />
          <ToolbarButton label="撤销" disabled={!history.length} onClick={undo}><RotateCcw /></ToolbarButton>
          <ToolbarButton label="重做" disabled={!future.length} onClick={redo}><Redo2 /></ToolbarButton>
          <ToolbarButton label="自动排版" onClick={autoLayout}><LayoutGrid /></ToolbarButton>
        </div>

        <div
          ref={containerRef}
          role="region"
          aria-label="无限故事画布"
          className={`absolute inset-0 overflow-hidden ${tool === "pan" ? "cursor-grab active:cursor-grabbing" : "cursor-default"}`}
          style={{ backgroundColor: "#080b13", backgroundImage: "radial-gradient(circle, rgba(148,163,184,.18) 1px, transparent 1px)", backgroundSize: `${32 * viewport.scale}px ${32 * viewport.scale}px`, backgroundPosition: `${viewport.x}px ${viewport.y}px` }}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="absolute left-0 top-0 origin-top-left" style={{ width: worldWidth, height: worldHeight, transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})` }}>
            <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
              <defs><marker id="story-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#22d3ee" /></marker></defs>
              {nodes.slice(0, -1).map((node, index) => {
                const next = nodes[index + 1];
                const x1 = node.x + node.width;
                const y1 = node.y + node.height / 2;
                const x2 = next.x;
                const y2 = next.y + next.height / 2;
                return <path key={`${node.id}-${next.id}`} d={`M ${x1} ${y1} C ${x1 + 70} ${y1}, ${x2 - 70} ${y2}, ${x2} ${y2}`} fill="none" stroke="#22d3ee" strokeOpacity=".55" strokeWidth="3" markerEnd="url(#story-arrow)" />;
              })}
            </svg>
            {nodes.map((node) => (
              <article
                key={node.id}
                data-story-node={node.id}
                tabIndex={0}
                aria-label={`第 ${node.order} 集：${node.title}`}
                className={`absolute overflow-hidden rounded-2xl border bg-[#111522] shadow-2xl transition-[border-color,box-shadow] focus-visible:ring-4 focus-visible:ring-cyan-300/30 ${selectedId === node.id ? "border-cyan-300 shadow-cyan-500/20" : "border-white/10 shadow-black/40 hover:border-white/25"}`}
                style={{ left: node.x, top: node.y, width: node.width, height: node.height }}
                onPointerDown={(event) => event.stopPropagation()}
                onPointerDownCapture={(event) => handlePointerDown(event as ReactPointerEvent<HTMLDivElement>)}
              >
                <div className="relative h-28 overflow-hidden bg-[#0b0e18]">
                  {node.imageUrl ? <img src={node.imageUrl} alt="" className="h-full w-full object-cover" draggable={false} /> : <div className="grid h-full place-items-center text-slate-600"><ImageIcon className="h-8 w-8" aria-hidden="true" /></div>}
                  <span className="absolute left-3 top-3 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-cyan-200 backdrop-blur">第 {node.order} 集</span>
                </div>
                <div className="p-4">
                  <h2 className="line-clamp-1 text-base font-semibold text-white">{node.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">{node.script || node.visualPrompt || "等待补充故事内容"}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1 rounded-xl border border-white/10 bg-[#111522]/95 p-1.5 shadow-xl">
          <ToolbarButton label="缩小" onClick={() => changeScale(viewport.scale / 1.2)}><ZoomOut /></ToolbarButton>
          <button className="min-h-11 min-w-16 rounded-lg px-2 text-xs font-medium text-slate-300 hover:bg-white/10" onClick={() => changeScale(1)} aria-label="重置缩放">{Math.round(viewport.scale * 100)}%</button>
          <ToolbarButton label="放大" onClick={() => changeScale(viewport.scale * 1.2)}><ZoomIn /></ToolbarButton>
        </div>

        <div className="absolute bottom-4 right-4 z-20 hidden h-36 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#111522]/95 p-2 shadow-xl sm:block" aria-label="小地图">
          <div className="relative h-full w-full overflow-hidden rounded-lg bg-[#080b13]">
            {nodes.map((node) => <span key={node.id} className={`absolute rounded-sm ${selectedId === node.id ? "bg-cyan-300" : "bg-slate-500"}`} style={{ left: `${(node.x / worldWidth) * 100}%`, top: `${(node.y / worldHeight) * 100}%`, width: `${Math.max(4, (node.width / worldWidth) * 100)}%`, height: `${Math.max(5, (node.height / worldHeight) * 100)}%` }} />)}
          </div>
        </div>

        <p className="pointer-events-none absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 rounded-lg bg-black/40 px-3 py-2 text-xs text-slate-500 lg:block">滚轮缩放 · 拖动画布平移 · 拖动卡片编排故事</p>
      </div>
    </main>
  );
}

function ToolbarButton({ label, active, disabled, onClick, children }: { label: string; active?: boolean; disabled?: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" aria-label={label} title={label} aria-pressed={active} disabled={disabled} onClick={onClick} className={`grid min-h-11 min-w-11 place-items-center rounded-lg transition focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:cursor-not-allowed disabled:opacity-30 ${active ? "bg-cyan-400/15 text-cyan-200" : "text-slate-400 hover:bg-white/10 hover:text-white"}`}>{<span className="[&>svg]:h-4 [&>svg]:w-4">{children}</span>}</button>;
}
