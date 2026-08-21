"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

export function BentoGrid({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("grid auto-rows-auto gap-3", className)}>{children}</div>
  );
}

export function BentoGridItem({
  className,
  title,
  description,
  header,
  icon,
  children,
}: {
  className?: string;
  title?: ReactNode;
  description?: ReactNode;
  header?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      variants={{
        rest: { y: 0, scale: 1 },
        hover: { y: -5, scale: 1.006 },
      }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn(
        "group/bento relative overflow-hidden rounded-3xl border border-white/10 bg-[#17181b] shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition-shadow duration-300 hover:border-sky-300/25 hover:shadow-[0_24px_70px_rgba(14,165,233,0.12)]",
        className,
      )}
    >
      {children ?? (
        <>
          {header}
          <div className="relative z-10 transition-transform duration-300 group-hover/bento:translate-x-1">
            {icon}
            <div className="mt-2 font-semibold text-white">{title}</div>
            <div className="mt-1 text-sm text-slate-400">{description}</div>
          </div>
        </>
      )}
    </motion.div>
  );
}
