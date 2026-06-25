"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import type { Experience } from "@/lib/experiences";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", { year: "numeric", month: "long" });
}

/** A milestone dot that lights up as the scrolling fill line reaches it. */
function Dot({ progress, fraction }: { progress: MotionValue<number>; fraction: number }) {
  const lit = useTransform(progress, [fraction - 0.015, fraction + 0.015], [0, 1]);
  const backgroundColor = useTransform(lit, (v) => `rgba(255,255,255,${0.2 + v * 0.8})`);
  const boxShadow = useTransform(lit, (v) => `0 0 ${v * 14}px ${v * 4}px rgba(255,255,255,${v * 0.8})`);

  return (
    <motion.span
      aria-hidden
      style={{ backgroundColor, boxShadow }}
      className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full ring-4 ring-[#0a0a0a]"
    />
  );
}

export default function TrayectoriaTimeline({ experiences }: { experiences: Experience[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const articleRefs = useRef<(HTMLElement | null)[]>([]);
  const reduce = useReducedMotion();
  const [fractions, setFractions] = useState<number[]>([]);

  // The line "paints in" as the timeline scrolls through the viewport.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.55"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 30, mass: 0.4 });
  const fillHeight = useTransform(progress, [0, 1], ["0%", "100%"]);

  // Measure each dot's vertical position (as a fraction of the line height) so
  // it can light up exactly when the fill reaches it. Re-measures on any reflow
  // (resize, images loading) via a ResizeObserver.
  useLayoutEffect(() => {
    const container = ref.current;
    if (!container) return;
    const measure = () => {
      const h = container.offsetHeight;
      if (!h) return;
      setFractions(
        articleRefs.current.map((el) =>
          el ? Math.min(1, Math.max(0, (el.offsetTop + 13) / h)) : 0
        )
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, [experiences]);

  if (experiences.length === 0) {
    return (
      <p className="text-center font-sans text-neutral-500">
        Aún no hay experiencias cargadas.
      </p>
    );
  }

  return (
    <div ref={ref} className="relative mx-auto max-w-3xl">
      {/* faint static track */}
      <div className="absolute bottom-0 left-0 top-0 w-px bg-white/10" />

      {/* glowing line that grows from the top as you scroll */}
      {!reduce && (
        <motion.div
          style={{ height: fillHeight }}
          className="absolute left-0 top-0 w-px bg-gradient-to-b from-white/40 via-white/80 to-white shadow-[0_0_8px_1px_rgba(255,255,255,0.45)]"
        />
      )}

      <div className="flex flex-col gap-16 md:gap-20">
        {experiences.map((exp, i) => (
          <motion.article
            key={exp._id}
            ref={(el) => {
              articleRefs.current[i] = el;
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-80px", once: true }}
            transition={{ duration: 0.6 }}
            className="relative pl-8 md:pl-12"
          >
            {reduce ? (
              <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-white ring-4 ring-[#0a0a0a]" />
            ) : (
              <Dot progress={progress} fraction={fractions[i] ?? 1} />
            )}

            <time className="font-serif text-sm uppercase tracking-[0.25em] text-neutral-500">
              {formatDate(exp.date)}
            </time>

            <h3 className="mt-2 break-words font-serif text-2xl text-white md:text-3xl">
              {exp.title}
            </h3>

            {exp.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={exp.imageUrl}
                alt={exp.title}
                className="mt-5 aspect-video w-full max-w-lg rounded-lg object-cover shadow-2xl shadow-black/40"
              />
            )}

            <p className="mt-4 max-w-2xl break-words font-sans text-base leading-relaxed text-neutral-400 md:text-lg">
              {exp.description}
            </p>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
