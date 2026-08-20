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
  buildTree,
  computeDecisionGrid,
} from "@/lib/decisionTree";
import TreeDiagram from "@/components/TreeDiagram";

const trainingData = generateTrainingData();
const CLASS_COLORS = ["#818cf8", "#fb923c"];
const CLASS_NAMES = ["Class 0", "Class 1"];

export default function DecisionTreeDemo() {
  const [maxDepth, setMaxDepth] = useState(2);

  const tree = useMemo(() => buildTree(trainingData, maxDepth), [maxDepth]);
  const grid = useMemo(() => computeDecisionGrid(tree), [tree]);

  const gridByClass = [0, 1].map((label) =>
    grid.filter((g) => g.label === label)
  );
  const pointsByClass = useMemo(
    () => [0, 1].map((label) => trainingData.filter((p) => p.label === label)),
    []
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Decision boundary chart */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 sm:p-6">
          <ResponsiveContainer width="100%" height={380}>
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
              <ZAxis range={[65, 65]} />

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
                Max Depth
              </label>
              <span className="text-sm font-mono text-indigo-400">
                {maxDepth}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={6}
              step={1}
              value={maxDepth}
              onChange={(e) => setMaxDepth(parseInt(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              The deeper the tree, the more complex and precise the decision boundary becomes.
            </p>
          </div>

          <div className="text-xs text-gray-400 leading-relaxed bg-gray-800/60 rounded-xl p-4 space-y-2">
            <p>
              <strong className="text-gray-200"> Lower Depth (1-2):</strong>{" "}
              Simple, large rectangular regions, which may lead to underfitting.
            </p>
            <p>
              <strong className="text-gray-200">Higher Depth (5-6):</strong>{" "}
             Many small regions, with almost every point treated separately, increasing the risk of overfitting.
            </p>
          </div>
        </div>
      </div>

      {/* Tree diagram */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 sm:p-6">
        <p className="text-sm font-medium text-gray-300 mb-4">
          The actual decision tree behind this boundary
        </p>
        <TreeDiagram tree={tree} />
      </div>
    </div>
  );
}