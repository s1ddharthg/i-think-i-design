'use client';

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

// A small vortex ring, fixed to the viewport — the same circular-motion
// language driving the home page's vortex artwork, condensed into a reading
// progress indicator. The ring fills clockwise with scroll; the whole thing
// spins slowly and continuously, so it reads as "alive" even at rest instead
// of a dead progress bar with a curve for a shape.
const SIZE = 56;
const STROKE = 2;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScrollVortex() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const dashoffset = useTransform(progress, (v) => CIRCUMFERENCE * (1 - v));
  const markerAngle = useTransform(progress, (v) => v * 360 - 90);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-8 left-8 z-40 hidden lg:block"
      style={{ width: SIZE, height: SIZE }}
    >
      <motion.div
        className="absolute inset-0"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={reduce ? undefined : { duration: 18, repeat: Infinity, ease: 'linear' }}
      >
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} fill="none">
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="white"
            strokeOpacity={0.12}
            strokeWidth={STROKE}
          />
          <motion.circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="white"
            strokeOpacity={0.7}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            style={{ strokeDashoffset: reduce ? 0 : dashoffset, rotate: -90 }}
          />
        </svg>
      </motion.div>

      {!reduce && (
        <motion.div
          className="absolute inset-0"
          style={{ rotate: markerAngle }}
        >
          <div
            className="absolute h-1.5 w-1.5 rounded-full bg-white"
            style={{ top: -0.75 + STROKE / 2, left: SIZE / 2 - 3 }}
          />
        </motion.div>
      )}

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
      </div>
    </div>
  );
}
