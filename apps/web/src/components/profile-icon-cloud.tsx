"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  Box,
  Check,
  Clapperboard,
  FileVideo2,
  FolderOpen,
  Image,
  LoaderCircle,
  Mic2,
  Pencil,
  Sparkles,
  WandSparkles,
  Workflow,
  X,
} from "lucide-react";

const icons = [
  { icon: Box, color: "text-cyan-300", position: "left-[82%] top-1/2" },
  { icon: Clapperboard, color: "text-amber-300", position: "left-[74%] top-[76%]" },
  { icon: FileVideo2, color: "text-rose-300", position: "left-1/2 top-[88%]" },
  { icon: FolderOpen, color: "text-yellow-200", position: "left-[24%] top-[76%]" },
  { icon: Image, color: "text-violet-300", position: "left-[12%] top-1/2" },
  { icon: Mic2, color: "text-emerald-300", position: "left-[20%] top-[23%]" },
  { icon: Sparkles, color: "text-pink-300", position: "left-[40%] top-[10%]" },
  { icon: WandSparkles, color: "text-blue-300", position: "left-[65%] top-[14%]" },
  { icon: Workflow, color: "text-orange-300", position: "left-[78%] top-[30%]" },
];

type ProfileIconCloudProps = {
  displayName: string;
  onDisplayNameChange: (displayName: string) => Promise<void>;
};

export function ProfileIconCloud({
  displayName,
  onDisplayNameChange,
}: ProfileIconCloudProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(displayName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editing) setDraft(displayName);
  }, [displayName, editing]);

  function closeEditor() {
    if (saving) return;
    setDraft(displayName);
    setError("");
    setEditing(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextDisplayName = draft.trim();
    const characterCount = Array.from(nextDisplayName).length;
    if (characterCount < 1 || characterCount > 12) {
      setError("请输入 1-12 个字符");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await onDisplayNameChange(nextDisplayName);
      setEditing(false);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }

  const shortDisplayName = Array.from(displayName).slice(0, 4).join("");

  return (
    <div className="relative mx-auto h-48 w-60 overflow-visible" aria-label="创作工具">
      <div className="absolute inset-3 animate-[spin_18s_linear_infinite] motion-reduce:animate-none">
        <div className="absolute left-1/2 top-1/2 h-20 w-40 rounded-full border border-white/10 bg-white/[0.03] shadow-[0_0_55px_rgba(96,165,250,0.15)] [transform:translate(-50%,-50%)_rotateX(62deg)]" />
        <div className="absolute left-1/2 top-1/2 h-14 w-28 rounded-full border border-violet-300/15 [transform:translate(-50%,-50%)_rotateX(62deg)_rotateZ(30deg)]" />
        {icons.map(({ icon: Icon, color, position }, index) => (
          <div key={index} className={`absolute grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-lg border border-white/15 bg-slate-950/85 shadow-[0_6px_18px_rgba(0,0,0,0.35)] ${position}`}>
            <Icon className={`size-3.5 ${color}`} strokeWidth={1.8} />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => {
          setDraft(displayName);
          setError("");
          setEditing(true);
        }}
        aria-label={`修改昵称，当前昵称：${displayName}`}
        title="点击修改昵称"
        className="group absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 animate-pulse place-items-center rounded-xl border border-white/20 bg-gradient-to-br from-orange-400 via-pink-500 to-violet-500 px-1 text-sm font-black text-white shadow-[0_0_32px_rgba(236,72,153,0.38)] outline-none transition hover:scale-105 focus-visible:ring-2 focus-visible:ring-cyan-300 motion-reduce:animate-none"
      >
        <span className="max-w-full truncate">{shortDisplayName}</span>
        <span className="absolute inset-0 grid place-items-center rounded-xl bg-slate-950/65 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
          <Pencil className="size-4" aria-hidden="true" />
        </span>
      </button>

      {editing ? (
        <form
          onSubmit={handleSubmit}
          className="absolute left-1/2 top-[calc(50%+2.2rem)] z-20 w-56 -translate-x-1/2 rounded-2xl border border-white/15 bg-slate-950/95 p-3 shadow-2xl backdrop-blur-xl"
        >
          <label htmlFor="profile-display-name" className="text-xs font-medium text-slate-300">
            修改昵称
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="profile-display-name"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") closeEditor();
              }}
              autoFocus
              maxLength={12}
              disabled={saving}
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/60"
              placeholder="输入新昵称"
            />
            <button
              type="submit"
              disabled={saving}
              aria-label="保存昵称"
              className="grid size-9 shrink-0 place-items-center rounded-xl bg-cyan-400/15 text-cyan-200 transition hover:bg-cyan-400/25 disabled:cursor-wait disabled:opacity-60"
            >
              {saving ? <LoaderCircle className="size-4 animate-spin" /> : <Check className="size-4" />}
            </button>
            <button
              type="button"
              onClick={closeEditor}
              disabled={saving}
              aria-label="取消修改"
              className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-slate-400 transition hover:bg-white/[0.1] hover:text-white disabled:opacity-50"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between gap-2 text-[10px]">
            <span className={error ? "text-rose-300" : "text-slate-500"}>
              {error || "保存后会同步到个人资料"}
            </span>
            <span className="shrink-0 text-slate-600">{Array.from(draft).length}/12</span>
          </div>
        </form>
      ) : null}
    </div>
  );
}
