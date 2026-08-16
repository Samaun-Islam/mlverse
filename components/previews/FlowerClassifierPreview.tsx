"use client";

import { motion } from "framer-motion";

const clusters = [
  { cx: 40, cy: 30, color: "#818cf8" },
  { cx: 90, cy: 65, color: "#fb923c" },
  { cx: 140, cy: 35, color: "#34d399" },
];

function scatterAround(cx: number, cy: number, seed: number) {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + seed;
    const r = 10 + (i % 3) * 4;
    pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r * 0.6 });
  }
  return pts;
}

export default function FlowerClassifierPreview() {
  return (
    <svg viewBox="0 0 180 100" className="w-full h-full">
      {clusters.map((c, ci) =>
        scatterAround(c.cx, c.cy, ci).map((p, i) => (
          <motion.circle
            key={`${ci}-${i}`}
            cx={p.x}
            cy={p.y}
            r="3"
            fill={c.color}
            fillOpacity={0.75}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: (ci * 6 + i) * 0.04, duration: 0.3 }}
          />
        ))
      )}

      <motion.circle
        cx="90"
        cy="65"
        r="6"
        fill="none"
        stroke="#f3f4f6"
        strokeWidth="2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.4 }}
      />
      <motion.line
        x1="90"
        y1="65"
        x2="95"
        y2="60"
        stroke="#f3f4f6"
        strokeWidth="1.5"
        strokeDasharray="2 2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1.2, duration: 0.3 }}
      />
    </svg>
  );
}