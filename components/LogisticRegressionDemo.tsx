"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import {
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
} from "recharts";
import {
  generatePresetData,
  trainLogisticRegression,
  predictProbability,
  computeDecisionBoundary,
  type LabeledPoint,
} from "@/lib/logisticRegression";

export default function LogisticRegressionDemo() {
  const [points, setPoints] = useState<LabeledPoint[]>(() =>
    generatePresetData()
  );
  const [threshold, setThreshold] = useState(0.5);

  const result = useMemo(() => trainLogisticRegression(points), [points]);

  const curveData = useMemo(() => {
    const data = [];
    for (let x = 0; x <= 10; x += 0.1) {
      data.push({
        x: parseFloat(x.toFixed(1)),
        probability: predictProbability(result, x),
      });
    }
    return data;
  }, [result]);

  const boundary = computeDecisionBoundary(result);

  const failPoints = points
    .filter((p) => p.label === 0)
    .map((p) => ({ x: p.x, y: 0.02 }));
  const passPoints = points
    .filter((p) => p.label === 1)
    .map((p) => ({ x: p.x, y: 0.98 }));

  // Threshold অনুযায়ী কতগুলো সঠিকভাবে classify হচ্ছে
  const accuracy = useMemo(() => {
    if (points.length === 0) return 0;
    const correct = points.filter((p) => {
      const prob = predictProbability(result, p.x);
      const predictedLabel = prob >= threshold ? 1 : 0;
      return predictedLabel === p.label;
    }).length;
    return correct / points.length;
  }, [points, result, threshold]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
      {/* Chart */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 sm:p-6">
        <ResponsiveContainer width="100%" height={380}>
          <ComposedChart margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="#1f2937" />
            <XAxis
              dataKey="x"
              type="number"
              domain={[0, 10]}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              label={{
                value: "পড়াশোনার ঘন্টা",
                position: "insideBottom",
                offset: -5,
                fill: "#6b7280",
                fontSize: 11,
              }}
            />
            <YAxis
              domain={[0, 1]}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              label={{
                value: "Pass Probability",
                angle: -90,
                position: "insideLeft",
                fill: "#6b7280",
                fontSize: 11,
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#f3f4f6",
              }}
            />

            {/* Threshold ও Decision boundary রেফারেন্স লাইন */}
            <ReferenceLine
              y={threshold}
              stroke="#fbbf24"
              strokeDasharray="4 4"
              label={{
                value: `threshold = ${threshold.toFixed(2)}`,
                fill: "#fbbf24",
                fontSize: 10,
                position: "right",
              }}
            />
            <ReferenceLine
              x={parseFloat(boundary.toFixed(2))}
              stroke="#6b7280"
              strokeDasharray="4 4"
            />

            {/* Sigmoid curve */}
            <Line
              data={curveData}
              dataKey="probability"
              stroke="#818cf8"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
              name="Sigmoid curve"
            />

            {/* ডেটা পয়েন্ট — Fail নিচে, Pass উপরে */}
            <Scatter data={failPoints} fill="#f87171" name="Fail" />
            <Scatter data={passPoints} fill="#34d399" name="Pass" />
          </ComposedChart>
        </ResponsiveContainer>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            Fail
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            Pass
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-indigo-400" />
            Sigmoid probability
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 font-medium">
            Accuracy: {(accuracy * 100).toFixed(0)}%
          </span>
          <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 font-medium">
            Decision boundary ≈ {boundary.toFixed(2)} ঘন্টা
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 h-fit space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">
              Decision Threshold
            </label>
            <span className="text-sm font-mono text-indigo-400">
              {threshold.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min={0.05}
            max={0.95}
            step={0.05}
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            className="w-full accent-indigo-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            If the probability exceeds this value, the model predicts &quot;Pass&quot;
          </p>
        </div>

        <div className="text-xs text-gray-400 leading-relaxed bg-gray-800/60 rounded-xl p-4 space-y-2">
          <p>
            <strong className="text-gray-200">Threshold Decresse:</strong> More students will be predicted as &quot;Pass&qout; but the chance of false-positive predictions will increase.
          </p>
          <p>
            <strong className="text-gray-200">Threshold Increase:</strong>{" "}
            The model will be more conservative,if it is not confident, it will predict &qout;Fail&qout;
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setPoints(generatePresetData());
            setThreshold(0.5);
          }}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold shadow-md shadow-indigo-950"
        >
          <RotateCcw className="w-4 h-4" />
          Start again with new data.
        </motion.button>
      </div>
    </div>
  );
}