"use client";

import { useEffect, useRef, useState } from "react";

type DottedGlowBackgroundProps = {
  className?: string;
  gap?: number;
  radius?: number;
  color?: string;
  darkColor?: string;
  glowColor?: string;
  darkGlowColor?: string;
  opacity?: number;
  backgroundOpacity?: number;
  speedMin?: number;
  speedMax?: number;
  speedScale?: number;
};

export function DottedGlowBackground({
  className,
  gap = 12,
  radius = 2,
  color = "rgba(148,163,184,0.45)",
  darkColor,
  glowColor = "rgba(34,211,238,0.9)",
  darkGlowColor,
  opacity = 0.6,
  backgroundOpacity = 0,
  speedMin = 0.4,
  speedMax = 1.3,
  speedScale = 1,
}: DottedGlowBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [resolvedColor, setResolvedColor] = useState(color);
  const [resolvedGlowColor, setResolvedGlowColor] = useState(glowColor);

  useEffect(() => {
    const compute = () => {
      const root = document.documentElement;
      const isDark = root.classList.contains("dark") ||
        (!root.classList.contains("light") && window.matchMedia("(prefers-color-scheme: dark)").matches);
      setResolvedColor(isDark ? darkColor || color : color);
      setResolvedGlowColor(isDark ? darkGlowColor || glowColor : glowColor);
    };

    compute();
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", compute);
    const observer = new MutationObserver(compute);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      media.removeEventListener("change", compute);
      observer.disconnect();
    };
  }, [color, darkColor, darkGlowColor, glowColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let stopped = false;
    let isVisible = true;
    let dots: { x: number; y: number; phase: number; speed: number }[] = [];
    const dpr = Math.min(Math.max(1, window.devicePixelRatio || 1), 2);

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${Math.floor(width)}px`;
      canvas.style.height = `${Math.floor(height)}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      dots = [];
      const columns = Math.ceil(width / gap) + 2;
      const rows = Math.ceil(height / gap) + 2;
      const minimum = Math.min(speedMin, speedMax);
      const maximum = Math.max(speedMin, speedMax);
      for (let column = -1; column < columns; column += 1) {
        for (let row = -1; row < rows; row += 1) {
          dots.push({
            x: column * gap + (row % 2 === 0 ? 0 : gap * 0.5),
            y: row * gap,
            phase: Math.random() * Math.PI * 2,
            speed: minimum + Math.random() * Math.max(maximum - minimum, 0),
          });
        }
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const draw = (now: number) => {
      if (stopped) return;
      if (!isVisible) {
        frame = requestAnimationFrame(draw);
        return;
      }

      const { width, height } = container.getBoundingClientRect();
      context.clearRect(0, 0, width, height);

      if (backgroundOpacity > 0) {
        const gradient = context.createRadialGradient(
          width * 0.5,
          height * 0.4,
          Math.min(width, height) * 0.1,
          width * 0.5,
          height * 0.5,
          Math.max(width, height) * 0.7,
        );
        gradient.addColorStop(0, "rgba(0,0,0,0)");
        gradient.addColorStop(1, `rgba(0,0,0,${Math.min(Math.max(backgroundOpacity, 0), 1)})`);
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
      }

      const time = (now / 1000) * Math.max(speedScale, 0);
      context.fillStyle = resolvedColor;
      for (const dot of dots) {
        const mod = (time * dot.speed + dot.phase) % 2;
        const linear = mod < 1 ? mod : 2 - mod;
        const alpha = 0.25 + 0.55 * linear;
        const glow = alpha > 0.6 ? (alpha - 0.6) / 0.4 : 0;
        context.shadowColor = glow > 0 ? resolvedGlowColor : "transparent";
        context.shadowBlur = 7 * glow;
        context.globalAlpha = alpha * opacity;
        context.beginPath();
        context.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
      context.shadowBlur = 0;
      frame = requestAnimationFrame(draw);
    };

    const visibilityObserver = new IntersectionObserver((entries) => {
      isVisible = entries[0]?.isIntersecting ?? true;
    }, { threshold: 0.1 });
    visibilityObserver.observe(container);
    frame = requestAnimationFrame(draw);

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
    };
  }, [backgroundOpacity, gap, opacity, radius, resolvedColor, resolvedGlowColor, speedMax, speedMin, speedScale]);

  return (
    <div ref={containerRef} className={className} style={{ position: "absolute", inset: 0 }} aria-hidden="true">
      <canvas ref={canvasRef} className="block size-full" />
    </div>
  );
}
