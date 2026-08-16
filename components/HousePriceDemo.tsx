"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import {
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  trainingData,
  trainModel,
  predictPrice,
  LOCATIONS,
  type Location,
} from "@/lib/housePrice";

const model = trainModel();

export default function HousePriceDemo() {
  const [area, setArea] = useState(1400);
  const [bedrooms, setBedrooms] = useState(3);
  const [location, setLocation] = useState<Location>("Suburb");

  const predictedPrice = useMemo(
    () => predictPrice(model, area, bedrooms, location),
    [area, bedrooms, location]
  );

  // একই location-এর ডেটা দেখাচ্ছি, যাতে area বনাম price-এর সম্পর্কটা পরিষ্কার দেখা যায়
  const filteredData = useMemo(
    () => trainingData.filter((d) => d.location === location),
    [location]
  );

  const trendLine = useMemo(() => {
    const points = [];
    for (let a = 600; a <= 3000; a += 100) {
      points.push({ area: a, price: predictPrice(model, a, bedrooms, location) });
    }
    return points;
  }, [bedrooms, location]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">
      {/* Input form */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 h-fit space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">
              আয়তন (Area)
            </label>
            <span className="text-sm font-mono text-indigo-400">
              {area.toLocaleString()} sq ft
            </span>
          </div>
          <input
            type="range"
            min={500}
            max={3500}
            step={50}
            value={area}
            onChange={(e) => setArea(parseInt(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-300 block mb-2">
            বেডরুম সংখ্যা
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setBedrooms(n)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  bedrooms === n
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/50"
                    : "bg-gray-800/60 text-gray-400 border border-gray-700 hover:border-gray-600"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-300 block mb-2">
            এলাকা
          </label>
          <div className="flex flex-col gap-2">
            {LOCATIONS.map((loc) => (
              <button
                key={loc}
                onClick={() => setLocation(loc)}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  location === loc
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/50"
                    : "bg-gray-800/60 text-gray-400 border border-gray-700 hover:border-gray-600"
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result + chart */}
      <div className="space-y-6">
        <motion.div
          key={predictedPrice.toFixed(1)}
          initial={{ opacity: 0.6, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl p-7 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 flex items-center gap-5"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-950">
            <Home className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Predicted Price</p>
            <p className="text-3xl font-bold text-white">
              ৳{(predictedPrice * 1000).toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
              <span className="text-base text-gray-400 font-normal ml-1">
                হাজার
              </span>
            </p>
          </div>
        </motion.div>

        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 sm:p-6">
          <p className="text-sm font-medium text-gray-300 mb-3">
            {location}-এ {bedrooms} বেডরুমের বাড়ির দাম, আয়তন অনুযায়ী
          </p>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="#1f2937" />
              <XAxis
                dataKey="area"
                type="number"
                domain={[500, 3500]}
                tick={{ fontSize: 12, fill: "#9ca3af" }}
              />
              <YAxis
                dataKey="price"
                type="number"
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
                data={trendLine}
                dataKey="price"
                stroke="#818cf8"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
                name="Model trend"
              />
              <Scatter
                data={filteredData}
                dataKey="price"
                fill="#4b5563"
                name="Training data"
              />
              <Scatter
                data={[{ area, price: predictedPrice }]}
                fill="#c084fc"
                shape="star"
                name="তোমার বাড়ি"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}