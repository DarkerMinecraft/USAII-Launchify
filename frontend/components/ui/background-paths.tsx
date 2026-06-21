"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const PATH_COLORS = ["#c2692a", "#6f93c4", "#6fa37e"] as const;

function FloatingPaths({
  position,
  paletteOffset,
}: {
  position: number;
  paletteOffset: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.65 + i * 0.04,
    duration: 20 + i * 0.15,
    opacity: Math.min(0.18 + i * 0.016, 0.74),
    color: PATH_COLORS[(i + paletteOffset) % PATH_COLORS.length],
  }));

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 696 316"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {paths.map((path) => (
        <motion.path
          key={path.id}
          d={path.d}
          stroke={path.color}
          strokeWidth={path.width}
          strokeOpacity={path.opacity}
          initial={
            prefersReducedMotion
              ? { pathLength: 1, opacity: 0.68 }
              : { pathLength: 0.3, opacity: 0.58 }
          }
          animate={
            prefersReducedMotion
              ? { pathLength: 1, pathOffset: 0, opacity: 0.68 }
              : {
                  pathLength: 1,
                  pathOffset: [0, 1, 0],
                  opacity: [0.45, 0.9, 0.45],
                }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : {
                  duration: path.duration,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }
          }
          style={{ filter: `drop-shadow(0 0 5px ${path.color}88)` }}
        />
      ))}
    </svg>
  );
}

export function BackgroundPaths({ className }: { className?: string }) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      <FloatingPaths position={1} paletteOffset={0} />
      <FloatingPaths position={-1} paletteOffset={1} />
    </div>
  );
}
