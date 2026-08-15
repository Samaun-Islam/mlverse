"use client";

import { useMemo, useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  generateTrainingData,
  computeDecisionGrid,
  CLASS_NAMES,
  CLASS_COLORS,
} from "@/lib/knn";

const trainingData = generateTrainingData();

export default function KnnDemo() {
  const [k, setK] = useState(5);

  const grid = useMemo(() => computeDecisionGrid(trainingData, k), [k]);

  const gridByClass = useMemo(() => {
    return [0, 1, 2].map((label) => grid.filter((g) => g.label === label));
  }, [grid]);

  const pointsByClass = useMemo(() => {
    return [0, 1, 2].map((label) =>
      trainingData.filter((p) => p.label === label)
    );
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
      {/* Chart */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 sm:p-6">
        <ResponsiveContainer width="100%" height={420}>
          <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="#1f2937" />
            <XAxis
              dataKey="x"
              type="number"
              domain={[0, 10]}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
            />
            <YAxis
              dataKey="y"
              type="number"
              domain={[0, 10]}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
            />
            <ZAxis range={[70, 70]} />

            {/* Background decision regions — হালকা করে আঁকা */}
            {gridByClass.map((cells, i) => (
              <Scatter
                key={`bg-${i}`}
                data={cells}
                fill={CLASS_COLORS[i]}
                fillOpacity={0.13}
                shape="square"
                isAnimationActive={false}
                legendType="none"
              />
            ))}

            {/* আসল training points — গাঢ় করে উপরে */}
            {pointsByClass.map((pts, i) => (
              <Scatter
                key={`pts-${i}`}
                data={pts}
                fill={CLASS_COLORS[i]}
                shape="circle"
                isAnimationActive={false}
                name={CLASS_NAMES[i]}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-400">
          {CLASS_NAMES.map((name, i) => (
            <span key={name} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: CLASS_COLORS[i] }}
              />
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 h-fit space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">
              K (কতগুলো প্রতিবেশী দেখবে)
            </label>
            <span className="text-sm font-mono text-indigo-400">{k}</span>
          </div>
          <input
            type="range"
            min={1}
            max={30}
            step={1}
            value={k}
            onChange={(e) => setK(parseInt(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>

        <div className="text-xs text-gray-400 leading-relaxed bg-gray-800/60 rounded-xl p-4 space-y-2">
          <p>
            <strong className="text-gray-200">ছোট K (1-3):</strong> সীমানা
            অসমান, খাঁজকাটা — প্রতিটা বিন্দুকে খুব বেশি গুরুত্ব দেয়, noise-এর
            প্রতি sensitive।
          </p>
          <p>
            <strong className="text-gray-200">বড় K (20+):</strong> সীমানা
            মসৃণ, কিন্তু ছোট ক্লাস্টার হারিয়ে যেতে পারে (over-smoothing)।
          </p>
        </div>
      </div>
    </div>
  );
}