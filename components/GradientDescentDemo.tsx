"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Scatter,
} from "recharts";
import {
  runGradientDescent,
  generateCurvePoints,
  type DescentStep,
} from "@/lib/gradientDescent";

const curvePoints = generateCurvePoints();

export default function GradientDescentDemo() {
  const [learningRate, setLearningRate] = useState(0.1);
  const [startX, setStartX] = useState(-7);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
      <DescentChart
        key={`${learningRate}-${startX}`}
        learningRate={learningRate}
        startX={startX}
      />

      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 h-fit space-y-7">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">
              Learning Rate
            </label>
            <span className="text-sm font-mono text-indigo-400">
              {learningRate.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min={0.01}
            max={1.05}
            step={0.01}
            value={learningRate}
            onChange={(e) => setLearningRate(parseFloat(e.target.value))}
            className="w-full accent-indigo-500"
          />
          
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">
              Starting Point (x)
            </label>
            <span className="text-sm font-mono text-indigo-400">
              {startX.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            min={-9}
            max={9}
            step={0.5}
            value={startX}
            onChange={(e) => setStartX(parseFloat(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}

function DescentChart({
  learningRate,
  startX,
}: {
  learningRate: number;
  startX: number;
}) {
  const [revealedCount, setRevealedCount] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const path: DescentStep[] = useMemo(
    () => runGradientDescent(startX, learningRate),
    [startX, learningRate]
  );

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (revealedCount >= path.length) {
        setIsPlaying(false);
      } else {
        setRevealedCount((c) => c + 1);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [isPlaying, revealedCount, path.length]);

  const visiblePath = path.slice(0, revealedCount);
  const currentPoint = visiblePath[visiblePath.length - 1];
  const isFinished = revealedCount >= path.length;
  const hasConverged = isFinished && Math.abs(currentPoint?.x ?? 99) < 0.5;
  const hasDiverged = Math.abs(currentPoint?.x ?? 0) > 40;

  const handleReset = () => {
    setRevealedCount(1);
    setIsPlaying(false);
  };

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 sm:p-6">
      <ResponsiveContainer width="100%" height={380}>
        <ComposedChart margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="#1f2937" />
          <XAxis
            dataKey="x"
            type="number"
            domain={[-10, 10]}
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            allowDuplicatedCategory={false}
          />
          <YAxis
            dataKey="y"
            type="number"
            domain={[0, 105]}
            tick={{ fontSize: 12, fill: "#9ca3af" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#f3f4f6",
            }}
            formatter={(value) => {
              const num = typeof value === "number" ? value : Number(value);
              return num.toFixed(2);
            }}
            labelFormatter={(label) => `x = ${label}`}
          />
          <Line
            data={curvePoints}
            dataKey="y"
            stroke="#4338ca"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            name="Loss curve"
          />
          <Line
            data={visiblePath.map((p) => ({ x: p.x, y: p.loss }))}
            dataKey="y"
            stroke="#818cf8"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "#818cf8" }}
            isAnimationActive={false}
            name="Descent path"
          />
          {currentPoint && (
            <Scatter
              data={[{ x: currentPoint.x, y: currentPoint.loss }]}
              fill="#c084fc"
              shape="circle"
              legendType="none"
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 font-medium">
          Step {revealedCount - 1} / {path.length - 1}
        </span>
        <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 font-medium">
          x = {currentPoint?.x.toFixed(3)}
        </span>
        <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 font-medium">
          loss = {currentPoint?.loss.toFixed(3)}
        </span>
        {hasConverged && (
          <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 font-medium">
            Converged ✓
          </span>
        )}
        {hasDiverged && (
          <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 font-medium">
            Diverged — learning rate too high
          </span>
        )}
      </div>

      <div className="flex gap-3 mt-5">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsPlaying((p) => !p)}
          disabled={isFinished}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold shadow-md shadow-indigo-950 disabled:opacity-50"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          {isPlaying ? "Pause" : "Play"}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleReset}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 text-gray-200 text-sm font-semibold"
        >
          <RotateCcw className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}