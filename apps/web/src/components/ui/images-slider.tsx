"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

export function ImagesSlider({
  images,
  children,
  overlay = true,
  overlayClassName,
  className,
  autoplay = true,
  direction = "up",
}: {
  images: string[];
  children?: React.ReactNode;
  overlay?: React.ReactNode;
  overlayClassName?: string;
  className?: string;
  autoplay?: boolean;
  direction?: "up" | "down";
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    Promise.all(
      images.map(
        (image) =>
          new Promise<string>((resolve, reject) => {
            const element = new window.Image();
            element.src = image;
            element.onload = () => resolve(image);
            element.onerror = reject;
          }),
      ),
    )
      .then((loaded) => {
        if (!cancelled) setLoadedImages(loaded);
      })
      .catch((error) => console.error("Failed to load slider images", error));

    return () => {
      cancelled = true;
    };
  }, [images]);

  useEffect(() => {
    if (loadedImages.length === 0) return;

    const handleNext = () => {
      setCurrentIndex((previous) => (previous + 1) % loadedImages.length);
    };
    const handlePrevious = () => {
      setCurrentIndex((previous) =>
        previous === 0 ? loadedImages.length - 1 : previous - 1,
      );
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") handleNext();
      if (event.key === "ArrowLeft") handlePrevious();
    };

    window.addEventListener("keydown", handleKeyDown);
    const interval = autoplay ? window.setInterval(handleNext, 5000) : undefined;

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (interval) window.clearInterval(interval);
    };
  }, [autoplay, loadedImages.length]);

  const slideVariants = {
    initial: { scale: 0.96, opacity: 0, rotateX: 12 },
    visible: {
      scale: 1,
      rotateX: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.645, 0.045, 0.355, 1] as const },
    },
    upExit: { opacity: 0, y: "-35%", transition: { duration: 0.8 } },
    downExit: { opacity: 0, y: "35%", transition: { duration: 0.8 } },
  };

  const areImagesLoaded = loadedImages.length > 0;

  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden",
        className,
      )}
      style={{ perspective: "1000px" }}
      aria-hidden="true"
    >
      {areImagesLoaded && children}
      {areImagesLoaded && overlay && (
        <div className={cn("absolute inset-0 z-40 bg-black/60", overlayClassName)} />
      )}
      {areImagesLoaded && (
        <AnimatePresence mode="popLayout">
          <motion.img
            key={currentIndex}
            src={loadedImages[currentIndex]}
            alt=""
            initial="initial"
            animate="visible"
            exit={direction === "up" ? "upExit" : "downExit"}
            variants={slideVariants}
            className="absolute inset-0 h-full w-full scale-105 object-cover object-center brightness-[0.78] saturate-[1.18]"
          />
        </AnimatePresence>
      )}
    </div>
  );
}
