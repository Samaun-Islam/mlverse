"use client";

import { motion } from "framer-motion";

export default function PassFailPreview() {
  const curvePath =
    "M 15,25 C 45,25 60,25 75,50 C 90,75 105,75 165,75";

  return (
    <svg viewBox="0 0 180 100" className="w-full h-full">
      <line x1="10" y1="85" x2="170" y2="85" stroke="#374151" strokeWidth="1" />
      <line x1="10" y1="10" x2="10" y2="85" stroke="#374151" strokeWidth="1" />

      <motion.path
        d={curvePath}
        fill="none"
        stroke="#34d399"
        strokeWidth="2.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.3, ease: "easeOut" }}
      />

      {[
        { cx: 25, cy: 78, fail: true },
        { cx: 45, cy: 72, fail: true },
        { cx: 130, cy: 22, fail: false },
        { cx: 155, cy: 18, fail: false },
      ].map((p, i) => (
        <motion.circle
          key={i}
          cx={p.cx}
          cy={p.cy}
          r="3"
          fill={p.fail ? "#f87171" : "#34d399"}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.9 + i * 0.1, duration: 0.3 }}
        />
      ))}

      <motion.circle
        cx="80"
        cy="55"
        r="5"
        fill="#facc15"
        stroke="#f3f4f6"
        strokeWidth="1.5"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.3, 1] }}
        transition={{ delay: 1.4, duration: 0.5 }}
      />
    </svg>
  );
}