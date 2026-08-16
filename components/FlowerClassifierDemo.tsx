"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Flower2 } from "lucide-react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { irisDataset, FEATURE_RANGES, SPECIES_COLORS } from "@/lib/irisData";
import { classifyFlower } from "@/lib/irisClassifier";

const FEATURE_LABELS: Record<keyof typeof FEATURE_RANGES, string> = {
  sepalLength: "Sepal Length (cm)",
  sepalWidth: "Sepal Width (cm)",
  petalLength: "Petal Length (cm)",
  petalWidth: "Petal Width (cm)",
};

export default function FlowerClassifierDemo() {
  const [sepalLength, setSepalLength] = useState(5.8);
  const [sepalWidth, setSepalWidth] = useState(3.0);
  const [petalLength, setPetalLength] = useState(4.0);
  const [petalWidth, setPetalWidth] = useState(1.2);

  const query = { sepalLength, sepalWidth, petalLength, petalWidth };
  const result = useMemo(() => classifyFlower(query, 5), [
    sepalLength,
    sepalWidth,
    petalLength,
    petalWidth,
  ]);

  const setters: Record<keyof typeof FEATURE_RANGES, (v: number) => void> = {
    sepalLength: setSepalLength,
    sepalWidth: setSepalWidth,
    petalLength: setPetalLength,
    petalWidth: setPetalWidth,
  };
  const values: Record<keyof typeof FEATURE_RANGES, number> = {
    sepalLength,
    sepalWidth,
    petalLength,
    petalWidth,
  };

  const isNeighbor = (f: { petalLength: number; petalWidth: number }) =>
    result.neighbors.some(
      (n) =>
        n.flower.petalLength === f.petalLength &&
        n.flower.petalWidth === f.petalWidth
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">
      {/* Input sliders */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 h-fit space-y-6">
        {(Object.keys(FEATURE_RANGES) as (keyof typeof FEATURE_RANGES)[]).map(
          (key) => {
            const range = FEATURE_RANGES[key];
            return (
              <div key={key}>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-medium text-gray-300">
                    {FEATURE_LABELS[key]}
                  </label>
                  <span className="text-xs font-mono text-indigo-400">
                    {values[key].toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min={range.min}
                  max={range.max}
                  step={range.step}
                  value={values[key]}
                  onChange={(e) => setters[key](parseFloat(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
            );
          }
        )}
      </div>

      {/* Result + chart */}
      <div className="space-y-6">
        <motion.div
          key={result.species}
          initial={{ opacity: 0.6, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl p-7 flex items-center gap-5 border"
          style={{
            background: `linear-gradient(135deg, ${SPECIES_COLORS[result.species]}22, ${SPECIES_COLORS[result.species]}08)`,
            borderColor: `${SPECIES_COLORS[result.species]}40`,
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
            style={{ backgroundColor: SPECIES_COLORS[result.species] }}
          >
            <Flower2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Predicted Species</p>
            <p
              className="text-3xl font-bold"
              style={{ color: SPECIES_COLORS[result.species] }}
            >
              Iris {result.species}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {(result.confidence * 100).toFixed(0)}% প্রতিবেশী একমত
            </p>
          </div>
        </motion.div>

        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 sm:p-6">
          <p className="text-sm font-medium text-gray-300 mb-3">
            Petal Length বনাম Petal Width — এই দুই feature দিয়েই species সবচেয়ে ভালোভাবে আলাদা হয়
          </p>
          <ResponsiveContainer width="100%" height={340}>
            <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="#1f2937" />
              <XAxis
                dataKey="petalLength"
                type="number"
                domain={[1, 7]}
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                label={{
                  value: "Petal Length (cm)",
                  position: "insideBottom",
                  offset: -5,
                  fill: "#6b7280",
                  fontSize: 11,
                }}
              />
              <YAxis
                dataKey="petalWidth"
                type="number"
                domain={[0, 2.6]}
                tick={{ fontSize: 12, fill: "#9ca3af" }}
              />
              <ZAxis range={[50, 50]} />

              {(["Setosa", "Versicolor", "Virginica"] as const).map((species) => (
                <Scatter
                  key={species}
                  data={irisDataset.filter((f) => f.species === species)}
                  fill={SPECIES_COLORS[species]}
                  fillOpacity={0.55}
                  name={species}
                />
              ))}

              {/* Nearest neighbors হাইলাইট */}
              <Scatter
                data={result.neighbors.map((n) => n.flower)}
                fill="none"
                stroke="#f3f4f6"
                strokeWidth={2}
                shape="circle"
                legendType="none"
              />

              {/* Query point */}
              <Scatter
                data={[{ petalLength, petalWidth }]}
                fill="#f3f4f6"
                shape="star"
                name="তোমার ইনপুট"
              />
            </ScatterChart>
          </ResponsiveContainer>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-400">
            {(["Setosa", "Versicolor", "Virginica"] as const).map((species) => (
              <span key={species} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: SPECIES_COLORS[species] }}
                />
                {species}
              </span>
            ))}
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full border-2 border-gray-100" />
              Nearest neighbor
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}