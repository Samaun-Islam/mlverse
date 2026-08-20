"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  generateTrainingData,
  getNearestNeighbors,
  classifyPoint,
  CLASS_NAMES,
  CLASS_COLORS,
} from "@/lib/knn";

const trainingData = generateTrainingData();

const DOMAIN_MAX = 10;
const SVG_SIZE = 420;
const PADDING = 30;

function toSvg(p: { x: number; y: number }) {
  const plotSize = SVG_SIZE - PADDING * 2;
  return {
    x: PADDING + (p.x / DOMAIN_MAX) * plotSize,
    y: PADDING + plotSize - (p.y / DOMAIN_MAX) * plotSize,
  };
}

function fromSvg(svgX: number, svgY: number) {
  const plotSize = SVG_SIZE - PADDING * 2;
  const x = ((svgX - PADDING) / plotSize) * DOMAIN_MAX;
  const y = ((PADDING + plotSize - svgY) / plotSize) * DOMAIN_MAX;
  return {
    x: Math.max(0, Math.min(DOMAIN_MAX, parseFloat(x.toFixed(2)))),
    y: Math.max(0, Math.min(DOMAIN_MAX, parseFloat(y.toFixed(2)))),
  };
}

export default function KnnAlgorithmDemo() {
  const [k, setK] = useState(5);
  const [queryPoint, setQueryPoint] = useState<{ x: number; y: number } | null>(
    { x: 5, y: 5 }
  );

  const neighbors = useMemo(
    () => (queryPoint ? getNearestNeighbors(queryPoint, trainingData, k) : []),
    [queryPoint, k]
  );

  const predictedClass = queryPoint
    ? classifyPoint(queryPoint, trainingData, k)
    : null;

  const handleChartClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = SVG_SIZE / rect.width;
    const scaleY = SVG_SIZE / rect.height;
    const svgX = (e.clientX - rect.left) * scaleX;
    const svgY = (e.clientY - rect.top) * scaleY;
    setQueryPoint(fromSvg(svgX, svgY));
  };

  const plotSize = SVG_SIZE - PADDING * 2;
  const queryPointSvg = queryPoint ? toSvg(queryPoint) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
      {/* Chart */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 sm:p-6">
        <p className="text-sm font-medium text-gray-300 mb-3">
         Click anywhere on the chart to place a new query point.
        </p>

        <svg
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          className="w-full h-auto rounded-xl bg-gray-950 cursor-crosshair select-none"
          onClick={handleChartClick}
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

          {/* Connecting lines থেকে neighbors পর্যন্ত */}
          {queryPointSvg &&
            neighbors.map((n, i) => {
              const nSvg = toSvg(n.point);
              return (
                <line
                  key={i}
                  x1={queryPointSvg.x}
                  y1={queryPointSvg.y}
                  x2={nSvg.x}
                  y2={nSvg.y}
                  stroke={CLASS_COLORS[n.point.label]}
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                  opacity={0.7}
                />
              );
            })}

          {/* Training points */}
          {trainingData.map((p, i) => {
            const svgP = toSvg(p);
            const isNeighbor = neighbors.some(
              (n) => n.point.x === p.x && n.point.y === p.y
            );
            return (
              <circle
                key={i}
                cx={svgP.x}
                cy={svgP.y}
                r={isNeighbor ? 7 : 5}
                fill={CLASS_COLORS[p.label]}
                stroke={isNeighbor ? "#f3f4f6" : "#0a0a0f"}
                strokeWidth={isNeighbor ? 2 : 1.5}
              />
            );
          })}

          {/* Query point */}
          {queryPointSvg && (
            <motion.g
              initial={false}
              animate={{ x: 0, y: 0 }}
            >
              <circle
                cx={queryPointSvg.x}
                cy={queryPointSvg.y}
                r={9}
                fill={
                  predictedClass !== null ? CLASS_COLORS[predictedClass] : "#6b7280"
                }
                stroke="#f3f4f6"
                strokeWidth={2.5}
              />
              <circle
                cx={queryPointSvg.x}
                cy={queryPointSvg.y}
                r={3}
                fill="#f3f4f6"
              />
            </motion.g>
          )}
        </svg>

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
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full border-2 border-gray-100 bg-gray-600" />
            Query point 
          </span>
        </div>
      </div>

      {/* Controls + result */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 h-fit space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">K</label>
            <span className="text-sm font-mono text-indigo-400">{k}</span>
          </div>
          <input
            type="range"
            min={1}
            max={15}
            step={1}
            value={k}
            onChange={(e) => setK(parseInt(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>

        {predictedClass !== null && (
          <div
            className="rounded-xl p-4 border"
            style={{
              backgroundColor: `${CLASS_COLORS[predictedClass]}15`,
              borderColor: `${CLASS_COLORS[predictedClass]}40`,
            }}
          >
            <p className="text-xs text-gray-400 mb-1">Predicted Class</p>
            <p
              className="text-lg font-bold"
              style={{ color: CLASS_COLORS[predictedClass] }}
            >
              {CLASS_NAMES[predictedClass]}
            </p>
          </div>
        )}

        <div>
          <p className="text-xs font-medium text-gray-400 mb-2">
            The vote of the 5 nearest neighbors
          </p>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {neighbors.map((n, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-xs bg-gray-800/60 rounded-lg px-2.5 py-1.5"
              >
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: CLASS_COLORS[n.point.label] }}
                  />
                  {CLASS_NAMES[n.point.label]}
                </span>
                <span className="text-gray-500 font-mono">
                  dist {n.distance.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}