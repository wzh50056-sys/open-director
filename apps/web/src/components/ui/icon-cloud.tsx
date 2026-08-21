"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function IconCloud({ icons, className }: { icons: ReactNode[]; className?: string }) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let animationFrame = 0;
    const animate = (now: number) => {
      setRotation((now / 1000) * 0.22);
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className={cn("relative h-[23rem] w-full overflow-hidden", className)}>
      <div className="absolute left-1/2 top-1/2 h-48 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/[0.04] shadow-[0_0_100px_rgba(96,165,250,0.14)] [transform:translate(-50%,-50%)_rotateX(62deg)]" />
      <div className="absolute left-1/2 top-1/2 h-32 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-300/15 [transform:translate(-50%,-50%)_rotateX(62deg)_rotateZ(30deg)]" />
      {icons.map((icon, index) => {
        const baseAngle = (index / icons.length) * Math.PI * 2;
        const angle = baseAngle + rotation * (index % 2 === 0 ? 1 : -0.82);
        const radiusX = 120 + (index % 3) * 19;
        const radiusY = 70 + (index % 4) * 11;
        const x = Math.cos(angle) * radiusX;
        const y = Math.sin(angle) * radiusY;
        const depth = (Math.sin(angle) + 1) / 2;
        const scale = 0.78 + depth * 0.3;

        return (
          <div
            key={index}
            className="absolute left-1/2 top-1/2 grid size-12 place-items-center rounded-2xl border border-white/15 bg-slate-950/80 text-sky-200 shadow-[0_8px_30px_rgba(0,0,0,0.32)] backdrop-blur-md will-change-transform"
            style={{
              marginLeft: -24,
              marginTop: -24,
              zIndex: Math.round(depth * 20),
              opacity: 0.58 + depth * 0.42,
              transform: `translate(${x}px, ${y}px) scale(${scale})`,
            }}
          >
            {icon}
          </div>
        );
      })}
      <div className="absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-3xl border border-white/20 bg-gradient-to-br from-orange-400 via-pink-500 to-violet-500 text-2xl font-black text-white shadow-[0_0_45px_rgba(236,72,153,0.35)]">
        OD
      </div>
    </div>
  );
}
