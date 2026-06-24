"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * A thin glowing white line on each side of the page whose bright "head"
 * travels vertically as the user scrolls (driven by scroll progress, not a
 * one-shot animation). A faint track sits behind it and a trail draws in
 * behind the head as you move down the page.
 */
function Beam({ side }: { side: "left" | "right" }) {
  const { scrollYProgress } = useScroll();
  // Smooth the raw scroll value so the light glides instead of snapping.
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 30, mass: 0.4 });
  const trailHeight = useTransform(progress, [0, 1], ["0%", "100%"]);
  const headTop = useTransform(progress, [0, 1], ["0%", "100%"]);

  // On mobile sit almost flush to the right edge (less intrusive); roomier on desktop.
  const pos = side === "left" ? "left-4 md:left-10" : "right-1 md:right-10";

  return (
    <div className={`pointer-events-none fixed inset-y-0 z-40 w-px ${pos}`}>
      {/* faint static track */}
      <div className="absolute inset-0 bg-white/[0.06]" />

      {/* glowing trail that grows from the top as you scroll */}
      <motion.div
        style={{ height: trailHeight }}
        className="absolute left-0 top-0 w-px bg-gradient-to-b from-transparent via-white/40 to-white/90 shadow-[0_0_10px_1px_rgba(255,255,255,0.45)]"
      />

      {/* bright travelling head + soft halo (smaller glow on mobile so it doesn't bleed into content) */}
      <motion.div
        style={{ top: headTop }}
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="h-24 w-px bg-gradient-to-b from-transparent via-white to-transparent shadow-[0_0_12px_3px_rgba(255,255,255,0.7)] md:shadow-[0_0_22px_7px_rgba(255,255,255,0.85)]" />
        <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/15 blur-2xl md:h-28 md:w-28 md:blur-3xl" />
      </motion.div>
    </div>
  );
}

export default function ScrollBeam() {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return <Beam side="right" />;
}
