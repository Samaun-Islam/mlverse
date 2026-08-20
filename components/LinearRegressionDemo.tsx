"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Eraser } from "lucide-react";
import {
  generatePresetData,
  computeRegression,
  predict,
  type Point,
} from "@/lib/linearRegression";

const DOMAIN_MAX = 10;
const SVG_SIZE = 420;
const PADDING = 30;

function dataToSvg(p: Point) {
  const plotSize = SVG_SIZE - PADDING * 2;
  return {
    x: PADDING + (p.x / DOMAIN_MAX) * plotSize,
    y: PADDING + plotSize - (p.y / DOMAIN_MAX) * plotSize,
  };
}

function svgToData(svgX: number, svgY: number): Point {
  const plotSize = SVG_SIZE - PADDING * 2;
  const x = ((svgX - PADDING) / plotSize) * DOMAIN_MAX;
  const y = ((PADDING + plotSize - svgY) / plotSize) * DOMAIN_MAX;
  return {
    x: Math.max(0, Math.min(DOMAIN_MAX, parseFloat(x.toFixed(2)))),
    y: Math.max(0, Math.min(DOMAIN_MAX, parseFloat(y.toFixed(2)))),
  };
}

export default function LinearRegressionDemo() {
  const [points, setPoints] = useState<Point[]>(() => generatePresetData());
  const [showResiduals, setShowResiduals] = useState(false);

  const result = computeRegression(points);

  const handleChartClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = SVG_SIZE / rect.width;
    const scaleY = SVG_SIZE / rect.height;
    const svgX = (e.clientX - rect.left) * scaleX;
    const svgY = (e.clientY - rect.top) * scaleY;
    const newPoint = svgToData(svgX, svgY);
    setPoints((prev) => [...prev, newPoint]);
  };

  const lineStart = dataToSvg({ x: 0, y: predict(result, 0) });
  const lineEnd = dataToSvg({
    x: DOMAIN_MAX,
    y: predict(result, DOMAIN_MAX),
  });

  const plotSize = SVG_SIZE - PADDING * 2;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
      {/* Chart */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 sm:p-6">
        <p className="text-sm font-medium text-gray-300 mb-3">
          Click anywhere on the chart to add a new data point.
        </p>

        <svg
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          className="w-full h-auto rounded-xl bg-gray-950 cursor-crosshair select-none"
          onClick={handleChartClick}
        >
          {/* Grid lines */}
          {Array.from({ length: 6 }, (_, i) => {
            const pos = PADDING + (i / 5) * plotSize;
            return (
              <g key={i}>
                <line
                  x1={PADDING}
                  y1={pos}
                  x2={PADDING + plotSize}
                  y2={pos}
                  stroke="#1f2937"
                  strokeWidth={1}
                />
                <line
                  x1={pos}
                  y1={PADDING}
                  x2={pos}
                  y2={PADDING + plotSize}
                  stroke="#1f2937"
                  strokeWidth={1}
                />
              </g>
            );
          })}

          {/* Axes */}
          <line
            x1={PADDING}
            y1={PADDING + plotSize}
            x2={PADDING + plotSize}
            y2={PADDING + plotSize}
            stroke="#4b5563"
            strokeWidth={1.5}
          />
          <line
            x1={PADDING}
            y1={PADDING}
            x2={PADDING}
            y2={PADDING + plotSize}
            stroke="#4b5563"
            strokeWidth={1.5}
          />

          {/* Residual lines (optional) */}
          {showResiduals &&
            points.map((p, i) => {
              const actual = dataToSvg(p);
              const predicted = dataToSvg({ x: p.x, y: predict(result, p.x) });
              return (
                <line
                  key={`res-${i}`}
                  x1={actual.x}
                  y1={actual.y}
                  x2={predicted.x}
                  y2={predicted.y}
                  stroke="#fb923c"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  opacity={0.6}
                />
              );
            })}

          {/* Best-fit line */}
          {points.length >= 2 && (
            <motion.line
              x1={lineStart.x}
              y1={lineStart.y}
              x2={lineEnd.x}
              y2={lineEnd.y}
              stroke="#818cf8"
              strokeWidth={2.5}
              initial={false}
              animate={{ x1: lineStart.x, y1: lineStart.y, x2: lineEnd.x, y2: lineEnd.y }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            />
          )}

          {/* Data points */}
          {points.map((p, i) => {
            const svgP = dataToSvg(p);
            return (
              <circle
                key={i}
                cx={svgP.x}
                cy={svgP.y}
                r={5}
                fill="#818cf8"
                stroke="#0a0a0f"
                strokeWidth={1.5}
              />
            );
          })}
        </svg>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowResiduals((s) => !s)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
              showResiduals
                ? "bg-orange-500/10 text-orange-300"
                : "bg-gray-800 text-gray-400"
            }`}
          >
            {showResiduals ? "Residuals দেখাচ্ছে ✓" : "Residuals দেখাও"}
          </button>
        </div>
      </div>

      {/* Controls + stats */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 h-fit space-y-6">
        <div className="space-y-3">
          <StatRow label="Slope (m)" value={result.slope.toFixed(3)} />
          <StatRow label="Intercept (b)" value={result.intercept.toFixed(3)} />
          <StatRow label="R² Score" value={result.r2.toFixed(3)} highlight />
        </div>

        <div className="text-xs text-gray-400 bg-gray-800/60 rounded-xl p-4">
          <p className="font-mono text-gray-300 mb-2">
            y = {result.slope.toFixed(2)}x + {result.intercept.toFixed(2)}
          </p>
          <p>
            The closer R² is to 1, the better the line explains the data.
          </p>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setPoints(generatePresetData())}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold shadow-md shadow-indigo-950"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setPoints([])}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 text-gray-200 text-sm font-semibold"
          >
            <Eraser className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function StatRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-gray-400">{label}</span>
      <span
        className={`text-sm font-mono font-semibold ${
          highlight ? "text-indigo-300" : "text-gray-200"
        }`}
      >
        {value}
      </span>
    </div>
  );
}