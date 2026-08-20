"use client";

import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  computeBiasVarianceCurve,
  generateSampleFits,
  generateTrueCurve,
} from "@/lib/biasVariance";

export default function BiasVarianceDemo() {
  const [degree, setDegree] = useState(3);

  const curveData = useMemo(() => computeBiasVarianceCurve(10), []);
  const sampleFits = useMemo(() => generateSampleFits(degree, 6), [degree]);
  const trueCurve = useMemo(() => generateTrueCurve(), []);

  const current = curveData.find((d) => d.degree === degree)!;

  return (
    <div className="space-y-8">
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 sm:p-6">
        <p className="text-sm text-gray-400 mb-4">
          The spread among models fitted on six different datasets with the same underlying problem but slightly different noise is called Variance.{" "}
          <strong className="text-gray-200">Variance</strong>
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="#1f2937" />
            <XAxis
              dataKey="x"
              type="number"
              domain={[-1.1, 1.1]}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              allowDuplicatedCategory={false}
            />
            <YAxis
              dataKey="y"
              type="number"
              domain={[-1.3, 1.3]}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#f3f4f6",
              }}
            />
            <Line
              data={trueCurve}
              dataKey="y"
              stroke="#f3f4f6"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              isAnimationActive={false}
              name="True function"
            />
            {sampleFits.map((curve, i) => (
              <Line
                key={i}
                data={curve}
                dataKey="y"
                stroke="#818cf8"
                strokeWidth={1.5}
                strokeOpacity={0.5}
                dot={false}
                isAnimationActive={false}
                name={`Fit ${i + 1}`}
                legendType="none"
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
        <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <span
              className="w-4 h-0.5"
              style={{ borderTop: "2px dashed #f3f4f6" }}
            />
            True function
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-indigo-400" />
            Fitted models (6 resamples)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 sm:p-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={curveData}
              margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
            >
              <CartesianGrid stroke="#1f2937" />
              <XAxis
                dataKey="degree"
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                label={{
                  value: "Model Complexity (Polynomial Degree)",
                  position: "insideBottom",
                  offset: -5,
                  fill: "#6b7280",
                  fontSize: 12,
                }}
              />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#f3f4f6",
                }}
              />
              <Line
                type="monotone"
                dataKey="bias2"
                stroke="#fb923c"
                strokeWidth={2.5}
                dot={false}
                name="Bias²"
              />
              <Line
                type="monotone"
                dataKey="variance"
                stroke="#c084fc"
                strokeWidth={2.5}
                dot={false}
                name="Variance"
              />
              <Line
                type="monotone"
                dataKey="totalError"
                stroke="#818cf8"
                strokeWidth={2.5}
                strokeDasharray="5 3"
                dot={false}
                name="Total Error"
              />
              <ReferenceLine x={degree} stroke="#f3f4f6" strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-300 font-medium">
              Bias² = {current.bias2}
            </span>
            <span className="px-3 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-300 font-medium">
              Variance = {current.variance}
            </span>
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 font-medium">
              Total Error = {current.totalError}
            </span>
          </div>
        </div>

        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 h-fit space-y-7">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">
                Model Complexity
              </label>
              <span className="text-sm font-mono text-indigo-400">
                degree {degree}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={degree}
              onChange={(e) => setDegree(parseInt(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div className="text-xs text-gray-400 leading-relaxed bg-gray-800/60 rounded-xl p-4 space-y-2.5">
            <p>
              <strong className="text-orange-300">Bias²</strong> A high value means the model is too simple and makes systematic errors (tends toward underfitting).
            </p>
            <p>
              <strong className="text-fuchsia-300">Variance</strong> A high value means the model gives very different predictions even with small changes in the dataset (tends toward overfitting).
            </p>
            <p>
              The best degree is where{" "}
              <strong className="text-indigo-300">Total Error</strong>{" "}
              The lowest value=take the white dashed line to that degree.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}