"use client";

import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Point = { x: number; y: number };

export function DraggableCardContainer({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("relative isolate touch-none", className)}>{children}</div>;
}

export function DraggableCardBody({
  children,
  className,
  initialOffset = { x: 0, y: 0 },
  initialRotation = 0,
}: {
  children: ReactNode;
  className?: string;
  initialOffset?: Point;
  initialRotation?: number;
}) {
  const [offset, setOffset] = useState<Point>(initialOffset);
  const [isDragging, setIsDragging] = useState(false);
  const pointerStart = useRef<Point | null>(null);
  const offsetStart = useRef<Point>(initialOffset);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerStart.current = { x: event.clientX, y: event.clientY };
    offsetStart.current = offset;
    setIsDragging(true);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!pointerStart.current) return;
    setOffset({
      x: offsetStart.current.x + event.clientX - pointerStart.current.x,
      y: offsetStart.current.y + event.clientY - pointerStart.current.y,
    });
  };

  const stopDragging = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    pointerStart.current = null;
    setIsDragging(false);
  };

  return (
    <div
      className={cn(
        "absolute cursor-grab select-none rounded-3xl border border-white/15 bg-[#121722] shadow-[0_24px_60px_rgba(0,0,0,0.32)] transition-[box-shadow,transform] duration-200 ease-out will-change-transform active:cursor-grabbing",
        isDragging && "z-20 shadow-[0_30px_80px_rgba(0,0,0,0.46)]",
        className,
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      style={{
        translate: `${offset.x}px ${offset.y}px`,
        transform: initialRotation ? `rotate(${initialRotation}deg)` : undefined,
        transitionDuration: isDragging ? "0ms" : undefined,
      }}
    >
      {children}
    </div>
  );
}
