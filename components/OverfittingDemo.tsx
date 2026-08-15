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
} from "recharts";
import {
  generateDataset,
  fitPolynomial,
  computeMSE,
  generateCurve,
} from "@/lib/overfitting";

export default function OverfittingDemo() {
  const [degree, setDegree] = useState(2);

  const { train, test } = useMemo(() => generateDataset(), []);

  const coeffs = useMemo(() => fitPolynomial(train, degree), [train, degree]);
  const curve = useMemo(() => generateCurve(coeffs), [coeffs]);

  const trainMSE = useMemo(() => computeMSE(coeffs, train), [coeffs, train]);
  const testMSE = useMemo(() => computeMSE(coeffs, test), [coeffs, test]);

  let status: "underfitting" | "good" | "overfitting" = "good";
  if (trainMSE > 0.09) status = "underfitting";
  else if (testMSE > trainMSE * 2.5 && testMSE > 0.06) status = "overfitting";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 sm:p-6">
        <ResponsiveContainer width="100%" height={380}>
          <ComposedChart margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="#1f2937" />
            <XAxis
              dataKey="x"
              type="number"
              domain={[-1.2, 1.2]}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              allowDuplicatedCategory={false}
            />
            <YAxis
              dataKey="y"
              type="number"
              domain={[-1.5, 1.5]}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
            />
            <Line
              data={curve}
              dataKey="y"
              stroke="#818cf8"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
              name="Fitted curve"
            />
            <Scatter data={train} fill="#818cf8" name="Train data" />
            <Scatter data={test} fill="#fb923c" name="Test data" />
          </ComposedChart>
        </ResponsiveContainer>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
            Train data
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
            Test data
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-indigo-400" />
            Fitted curve
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 font-medium">
            Train MSE: {trainMSE.toFixed(4)}
          </span>
          <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-300 font-medium">
            Test MSE: {testMSE.toFixed(4)}
          </span>
          {status === "underfitting" && (
            <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-300 font-medium">
              ⚠️ Underfitting 
            </span>
          )}
          {status === "overfitting" && (
            <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 font-medium">
              ⚠️ Overfitting 
            </span>
          )}
          {status === "good" && (
            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 font-medium">
              Good fit ✓
            </span>
          )}
        </div>
      </div>

      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 h-fit space-y-7">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">
              Polynomial Degree
            </label>
            <span className="text-sm font-mono text-indigo-400">
              {degree}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={12}
            step={1}
            value={degree}
            onChange={(e) => setDegree(parseInt(e.target.value))}
            className="w-full accent-indigo-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Lower degree = Straighter line; Higher degree = More curved.
          </p>
        </div>

        <div className="text-xs text-gray-400 leading-relaxed bg-gray-800/60 rounded-xl p-4">
          <p className="mb-2">
            <strong className="text-gray-200">Blue points</strong> are used to train the model.
          </p>
          <p>
            <strong className="text-gray-200">Orange points</strong> are unseen by the model and reveal its true performance.
          </p>
        </div>
      </div>
    </div>
  );
}