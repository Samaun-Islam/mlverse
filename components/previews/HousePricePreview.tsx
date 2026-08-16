"use client";

import { motion } from "framer-motion";

export default function HousePricePreview() {
  const points = [
    { x: 20, y: 75 },
    { x: 45, y: 60 },
    { x: 70, y: 55 },
    { x: 95, y: 42 },
    { x: 120, y: 38 },
    { x: 145, y: 25 },
  ];

  return (
    <svg viewBox="0 0 180 100" className="w-full h-full">
      <line x1="10" y1="90" x2="170" y2="90" stroke="#374151" strokeWidth="1" />
      <line x1="10" y1="10" x2="10" y2="90" stroke="#374151" strokeWidth="1" />

      <motion.line
        x1="15"
        y1="80"
        x2="155"
        y2="20"
        stroke="#818cf8"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {points.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="3.5"
          fill="#818cf8"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15 + i * 0.08, duration: 0.3 }}
        />
      ))}

      <motion.circle
        cx="160"
        cy="20"
        r="5"
        fill="#c084fc"
        stroke="#f3f4f6"
        strokeWidth="1.5"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.3, 1] }}
        transition={{ delay: 1.1, duration: 0.5 }}
      />
    </svg>
  );
}