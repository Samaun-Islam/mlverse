"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";

// Neural network node positions (percentage based, so it scales)
const nodes = [
  { x: 10, y: 20 }, { x: 25, y: 55 }, { x: 8, y: 80 },
  { x: 40, y: 15 }, { x: 45, y: 50 }, { x: 38, y: 85 },
  { x: 65, y: 25 }, { x: 60, y: 60 }, { x: 70, y: 88 },
  { x: 90, y: 40 }, { x: 85, y: 70 }, { x: 95, y: 15 },
];

const connections = [
  [0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5],
  [3, 6], [4, 7], [5, 8], [6, 7], [7, 8], [6, 9], [7, 10],
  [8, 10], [9, 11], [9, 10],
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/60 via-white to-white">
      {/* Animated neural network background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.35]"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {connections.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke="url(#lineGradient)"
            strokeWidth="0.15"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: i * 0.05, ease: "easeInOut" }}
          />
        ))}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        {nodes.map((node, i) => (
          <motion.circle
            key={i}
            cx={node.x}
            cy={node.y}
            r="0.8"
            fill="#6366f1"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.3, 1] }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
          >
            <animate
              attributeName="opacity"
              values="0.5;1;0.5"
              dur={`${2 + (i % 3)}s`}
              repeatCount="indefinite"
            />
          </motion.circle>
        ))}
      </svg>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="max-w-3xl">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100/80 text-indigo-700 text-sm font-medium mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            Learn by touching the math, not just reading it
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1]"
          >
            Machine Learning,{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              made visible.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl"
          >
           Every concept here reacts to your touch. Nudge a slider, watch the math move. This is how machine learning starts to make sense, not on a whiteboard, but under your fingers.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link href="/concepts">
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-shadow"
              >
                Start Exploring
                <ArrowRight className="w-4 h-4" />
              </motion.span>
            </Link>

            <Link href="/playground">
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-gray-800 font-semibold border border-gray-200 hover:border-gray-300 shadow-sm transition-colors"
              >
                <PlayCircle className="w-4 h-4 text-indigo-600" />
                Try Live Playground
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}