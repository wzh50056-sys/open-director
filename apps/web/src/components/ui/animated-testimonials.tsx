"use client";

import { useEffect, useState } from "react";
import { IconArrowLeft, IconArrowRight, IconWallet } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";

import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

export type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

export function AnimatedTestimonials({
  testimonials,
  autoplay = false,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) {
  const [active, setActive] = useState(0);
  const [rechargeRequested, setRechargeRequested] = useState(false);

  const handleNext = () => {
    setActive((previous) => (previous + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((previous) => (previous - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (!autoplay || testimonials.length < 2) return;

    const interval = window.setInterval(() => {
      setActive((previous) => (previous + 1) % testimonials.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [autoplay, testimonials.length]);

  if (testimonials.length === 0) return null;

  return (
    <div className="flex h-full min-h-[360px] items-center px-1 py-3 font-sans antialiased sm:px-2">
      <div className="grid w-full grid-cols-1 gap-7 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div className="relative h-48 w-full sm:h-56">
          <AnimatePresence initial={false}>
            {testimonials.map((testimonial, index) => {
              const isActive = index === active;
              const rotation = (index % 2 === 0 ? -1 : 1) * (5 + index * 2);

              return (
                <motion.div
                  key={testimonial.src}
                  initial={{ opacity: 0, scale: 0.9, rotate: rotation }}
                  animate={{
                    opacity: isActive ? 1 : 0.45,
                    scale: isActive ? 1 : 0.92,
                    rotate: isActive ? 0 : rotation,
                    zIndex: isActive ? 20 : testimonials.length - index,
                    y: isActive ? [0, -10, 0] : 8,
                  }}
                  exit={{ opacity: 0, scale: 0.9, rotate: -rotation }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                  className="absolute inset-0 origin-bottom"
                >
                  <Image
                    src={testimonial.src}
                    alt={testimonial.name}
                    fill
                    sizes="(min-width: 1280px) 300px, (min-width: 768px) 40vw, 90vw"
                    draggable={false}
                    className="h-full w-full rounded-2xl bg-black/15 object-contain object-center shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="flex min-h-48 flex-col justify-between py-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              <h3 className="text-xl font-bold text-white">{testimonials[active].name}</h3>
              <p className="mt-1 text-xs text-sky-300/75">{testimonials[active].designation}</p>
              <motion.p className="mt-5 text-sm leading-7 text-slate-300">
                {testimonials[active].quote.split("").map((character, index) => (
                  <motion.span
                    key={`${character}-${index}`}
                    initial={{ filter: "blur(8px)", opacity: 0, y: 4 }}
                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                    transition={{ duration: 0.18, delay: 0.012 * index }}
                    className="inline-block"
                  >
                    {character === " " ? "\u00a0" : character}
                  </motion.span>
                ))}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="上一条创作动态"
                className="group grid size-9 place-items-center rounded-full border border-white/10 bg-white/[0.06] transition hover:bg-white/10"
              >
                <IconArrowLeft className="size-5 text-slate-300 transition-transform group-hover:rotate-12" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="下一条创作动态"
                className="group grid size-9 place-items-center rounded-full border border-white/10 bg-white/[0.06] transition hover:bg-white/10"
              >
                <IconArrowRight className="size-5 text-slate-300 transition-transform group-hover:-rotate-12" />
              </button>
            </div>

            <HoverBorderGradient
              onClick={() => setRechargeRequested(true)}
              duration={1.2}
              containerClassName="shadow-[0_0_24px_rgba(50,117,248,0.18)]"
              className="flex items-center gap-2 bg-[#17181b] px-5 py-2 text-sm font-medium"
            >
                <IconWallet className="size-4" />
                {rechargeRequested ? "即将开放" : "立即开通"}
            </HoverBorderGradient>
          </div>
        </div>
      </div>
    </div>
  );
}
