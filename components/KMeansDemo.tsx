"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";
import { generatePoints, runKMeans, CENTROID_COLORS, type Point } from "@/lib/kmeans";

const points = generatePoints();

const DOMAIN_MAX = 10;
const SVG_SIZE = 420;
const PADDING = 30;

function toSvg(p: Point) {
  const plotSize = SVG_SIZE - PADDING * 2;
  return {
    x: PADDING + (p.x / DOMAIN_MAX) * plotSize,
    y: PADDING + plotSize - (p.y / DOMAIN_MAX) * plotSize,
  };
}

export default function KMeansDemo() {
  const [k, setK] = useState(3);
  const [seed, setSeed] = useState(1);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = useMemo(() => runKMeans(points, k, seed), [k, seed]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => {
      if (stepIndex >= steps.length - 1) {
        setIsPlaying(false);
      } else {
        setStepIndex((s) => s + 1);
      }
    }, 900);
    return () => clearTimeout(timer);
  }, [isPlaying, stepIndex, steps.length]);

  const currentStep = steps[Math.min(stepIndex, steps.length - 1)];
  const isFinished = stepIndex >= steps.length - 1;

  const plotSize = SVG_SIZE - PADDING * 2;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
      {/* Chart */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 sm:p-6">
        <svg
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          className="w-full h-auto rounded-xl bg-gray-950"
        >
          {Array.from({ length: 6 }, (_, i) => {
            const pos = PADDING + (i / 5) * plotSize;
            return (
              <g key={i}>
                <line x1={PADDING} y1={pos} x2={PADDING + plotSize} y2={pos} stroke="#1f2937" />
                <line x1={pos} y1={PADDING} x2={pos} y2={PADDING + plotSize} stroke="#1f2937" />
              </g>
            );
          })}

          {/* Data points, তাদের বর্তমান cluster অনুযায়ী রঙিন */}
          {points.map((p, i) => {
            const svgP = toSvg(p);
            const clusterId = currentStep.assignments[i];
            return (
              <motion.circle
                key={i}
                cx={svgP.x}
                cy={svgP.y}
                r={5}
                fill={CENTROID_COLORS[clusterId]}
                stroke="#0a0a0f"
                strokeWidth={1.2}
                animate={{ fill: CENTROID_COLORS[clusterId] }}
                transition={{ duration: 0.4 }}
              />
            );
          })}

          {/* Centroids — বড়, তারকা-আকৃতির মতো */}
          {currentStep.centroids.map((c) => {
            const svgC = toSvg(c);
            return (
              <motion.g
                key={c.id}
                animate={{ x: 0, y: 0 }}
              >
                <motion.circle
                  animate={{ cx: svgC.x, cy: svgC.y }}
                  transition={{ type: "spring", stiffness: 120, damping: 18 }}
                  r={10}
                  fill={CENTROID_COLORS[c.id]}
                  stroke="#f3f4f6"
                  strokeWidth={2.5}
                  fillOpacity={0.9}
                />
                <motion.circle
                  animate={{ cx: svgC.x, cy: svgC.y }}
                  transition={{ type: "spring", stiffness: 120, damping: 18 }}
                  r={3}
                  fill="#f3f4f6"
                />
              </motion.g>
            );
          })}
        </svg>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-400">
          {currentStep.centroids.map((c) => (
            <span key={c.id} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: CENTROID_COLORS[c.id] }}
              />
              Cluster {c.id + 1}
            </span>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 font-medium">
            Iteration {stepIndex} / {steps.length - 1}
          </span>
          {isFinished && (
            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 font-medium">
              Converged ✓
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 h-fit space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">
              K (Number of  cluster)
            </label>
            <span className="text-sm font-mono text-indigo-400">{k}</span>
          </div>
          <input
            type="range"
            min={2}
            max={5}
            step={1}
            value={k}
            onChange={(e) => {
              setK(parseInt(e.target.value));
              setStepIndex(0);
              setIsPlaying(false);
            }}
            className="w-full accent-indigo-500"
          />
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsPlaying((p) => !p)}
            disabled={isFinished}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold shadow-md shadow-indigo-950 disabled:opacity-50"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? "Pause" : "Play"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setSeed((s) => s + 1);
              setStepIndex(0);
              setIsPlaying(false);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 text-gray-200 text-sm font-semibold"
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="text-xs text-gray-400 leading-relaxed bg-gray-800/60 rounded-xl p-4 space-y-2">
          <p>
            <strong className="text-gray-200">Big Circle</strong>is
            centroid The center of each cluster.
          </p>
          <p>
            Press Play to see the centroids move toward the average position of their nearest points at each step.
          </p>
          <p>
            The Reset button starts again with new random initial positions. Notice that different starting positions can sometimes lead to different results!
          </p>
        </div>
      </div>
    </div>
  );
}