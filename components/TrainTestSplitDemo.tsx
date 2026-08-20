"use client";

import { useMemo, useState } from "react";
import {
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  generateClassificationDataset,
  splitDataset,
  trainLogisticRegression,
  computeAccuracy,
  getBoundaryLine,
} from "@/lib/trainTestSplit";

export default function TrainTestSplitDemo() {
  const [trainRatio, setTrainRatio] = useState(0.7);

  const allPoints = useMemo(() => generateClassificationDataset(), []);

  const { train, test } = useMemo(
    () => splitDataset(allPoints, trainRatio),
    [allPoints, trainRatio]
  );

  const model = useMemo(() => trainLogisticRegression(train), [train]);
  const boundaryLine = useMemo(() => getBoundaryLine(model), [model]);

  const trainAccuracy = useMemo(
    () => computeAccuracy(model, train),
    [model, train]
  );
  const testAccuracy = useMemo(
    () => computeAccuracy(model, test),
    [model, test]
  );

  const trainClass0 = train.filter((p) => p.label === 0);
  const trainClass1 = train.filter((p) => p.label === 1);
  const testClass0 = test.filter((p) => p.label === 0);
  const testClass1 = test.filter((p) => p.label === 1);

  const testTooSmall = test.length < 6;

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
              domain={[-1.5, 1.5]}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              allowDuplicatedCategory={false}
            />
            <YAxis
              dataKey="y"
              type="number"
              domain={[-1.5, 1.5]}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
            />
            {/* Decision boundary */}
            <Line
              data={boundaryLine}
              dataKey="y"
              stroke="#f3f4f6"
              strokeWidth={2}
              strokeDasharray="5 3"
              dot={false}
              isAnimationActive={false}
              name="Decision boundary"
            />
            {/* Train points, class 0 */}
            <Scatter data={trainClass0} fill="#818cf8" name="Train — Class A" />
            {/* Train points, class 1 */}
            <Scatter data={trainClass1} fill="#c084fc" name="Train — Class B" />
            {/* Test points, class 0 (outline style feel দিতে ভিন্ন রঙ) */}
            <Scatter data={testClass0} fill="#38bdf8" name="Test — Class A" />
            {/* Test points, class 1 */}
            <Scatter data={testClass1} fill="#fb923c" name="Test — Class B" />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
            Train — Class A
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
            Train — Class B
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            Test — Class A
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
            Test — Class B
          </span>
        </div>

        {/* Status */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 font-medium">
            Train: {train.length} points
          </span>
          <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 font-medium">
            Test: {test.length} points
          </span>
          <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 font-medium">
            Train Accuracy: {(trainAccuracy * 100).toFixed(1)}%
          </span>
          <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-300 font-medium">
            Test Accuracy: {(testAccuracy * 100).toFixed(1)}%
          </span>
          {testTooSmall && (
            <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 font-medium">
              ⚠️ Test set খুব ছোট — accuracy অবিশ্বাস্য
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 h-fit space-y-7">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">
              Train / Test Split
            </label>
            <span className="text-sm font-mono text-indigo-400">
              {Math.round(trainRatio * 100)} / {Math.round((1 - trainRatio) * 100)}
            </span>
          </div>
          <input
            type="range"
            min={0.1}
            max={0.9}
            step={0.05}
            value={trainRatio}
            onChange={(e) => setTrainRatio(parseFloat(e.target.value))}
            className="w-full accent-indigo-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            e training data generally means a better-trained model, but too little test data makes the accuracy measurement unreliable.
          </p>
        </div>

        <div className="text-xs text-gray-400 leading-relaxed bg-gray-800/60 rounded-xl p-4 space-y-2.5">
          <p>
            Toal <strong className="text-gray-200">{allPoints.length}</strong>{" "}
            Point = Changing the split ratio will also change which data points are used for training and which are used for testing.
          </p>
          <p>
            if the training split is too small (e.g., 10/90), the model cannot learn well. If the training split is too large (e.g., 90/10), the test set becomes so small that the accuracy measurement becomes unreliable.
          </p>
        </div>
      </div>
    </div>
  );
}