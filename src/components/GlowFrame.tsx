"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * Wraps an image (or any block) and renders an animated white light glow
 * *behind* it — a soft conic halo that slowly rotates and peeks out around the
 * edges. The glow is revealed as the element scrolls into view, matching the
 * white-light aesthetic of the side scroll beam. Nothing is drawn on top of
 * the image itself.
 */
export default function GlowFrame({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 30, mass: 0.4 });
  const opacity = useTransform(smooth, [0, 0.3, 1], [0, 0.6, 1]);

  return (
    <div ref={ref} className="relative isolate">
      {!reduce && (
        <motion.div
          aria-hidden
          style={{ opacity }}
          className="pointer-events-none absolute -inset-6 -z-10"
        >
          {/* Rotating conic glow that bleeds out from behind the image edges */}
          <motion.div
            className="absolute inset-0 rounded-[2rem] blur-2xl"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.55) 55deg, transparent 150deg, rgba(255,255,255,0.4) 250deg, transparent 330deg)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          />
          {/* Soft steady core so the halo never fully disappears between arcs */}
          <div className="absolute inset-4 rounded-[2rem] bg-white/10 blur-2xl" />
        </motion.div>
      )}
      {children}
    </div>
  );
}
