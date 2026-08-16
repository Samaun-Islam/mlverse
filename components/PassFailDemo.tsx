"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { trainingData, trainModel, predictProbability } from "@/lib/passFail";

const model = trainModel(trainingData);

export default function PassFailDemo() {
  const [hours, setHours] = useState(5);
  const [attendance, setAttendance] = useState(70);

  const probability = useMemo(
    () => predictProbability(model, hours, attendance),
    [hours, attendance]
  );

  const willPass = probability >= 0.5;

  // Decision boundary গ্রিড — হালকা রঙের ব্যাকগ্রাউন্ড রিজিওন হিসেবে দেখানো
  const grid = useMemo(() => {
    const cells = [];
    for (let h = 0; h <= 10; h += 0.5) {
      for (let a = 0; a <= 100; a += 5) {
        const prob = predictProbability(model, h, a);
        cells.push({ hours: h, attendance: a, pass: prob >= 0.5 ? 1 : 0 });
      }
    }
    return cells;
  }, []);

  const passGrid = grid.filter((g) => g.pass === 1);
  const failGrid = grid.filter((g) => g.pass === 0);

  const passedPoints = trainingData.filter((d) => d.passed === 1);
  const failedPoints = trainingData.filter((d) => d.passed === 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">
      {/* Input sliders */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 h-fit space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">
              পড়াশোনার ঘন্টা (দৈনিক)
            </label>
            <span className="text-sm font-mono text-emerald-400">
              {hours.toFixed(1)} ঘন্টা
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={10}
            step={0.5}
            value={hours}
            onChange={(e) => setHours(parseFloat(e.target.value))}
            className="w-full accent-emerald-500"
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">
              উপস্থিতি (%)
            </label>
            <span className="text-sm font-mono text-emerald-400">
              {attendance.toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={attendance}
            onChange={(e) => setAttendance(parseFloat(e.target.value))}
            className="w-full accent-emerald-500"
          />
        </div>

        <div className="text-xs text-gray-400 leading-relaxed bg-gray-800/60 rounded-xl p-4">
          <p>
            দুটো factor-ই prediction-কে প্রভাবিত করে — শুধু বেশি ঘন্টা পড়লেই
            না, ক্লাসে উপস্থিতিও গুরুত্বপূর্ণ ভূমিকা রাখে।
          </p>
        </div>
      </div>

      {/* Result + chart */}
      <div className="space-y-6">
        <motion.div
          key={willPass ? "pass" : "fail"}
          initial={{ opacity: 0.6, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className={`rounded-2xl p-7 flex items-center gap-5 border ${
            willPass
              ? "bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border-emerald-500/30"
              : "bg-gradient-to-br from-red-600/20 to-rose-600/20 border-red-500/30"
          }`}
        >
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
              willPass
                ? "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-emerald-950"
                : "bg-gradient-to-br from-red-500 to-rose-500 shadow-red-950"
            }`}
          >
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Prediction</p>
            <p
              className={`text-3xl font-bold ${
                willPass ? "text-emerald-300" : "text-red-300"
              }`}
            >
              {willPass ? "Pass ✓" : "Fail ✗"}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              পাস করার সম্ভাবনা {(probability * 100).toFixed(1)}%
            </p>
          </div>
        </motion.div>

        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 sm:p-6">
          <p className="text-sm font-medium text-gray-300 mb-3">
            পড়াশোনার ঘন্টা বনাম উপস্থিতি — সবুজ অঞ্চলে Pass predict হয়
          </p>
          <ResponsiveContainer width="100%" height={340}>
            <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="#1f2937" />
              <XAxis
                dataKey="hours"
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
                dataKey="attendance"
                type="number"
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: "#9ca3af" }}
              />
              <ZAxis range={[60, 60]} />

              {/* Background decision regions */}
              <Scatter
                data={passGrid}
                dataKey="attendance"
                fill="#34d399"
                fillOpacity={0.08}
                shape="square"
                isAnimationActive={false}
                legendType="none"
              />
              <Scatter
                data={failGrid}
                dataKey="attendance"
                fill="#f87171"
                fillOpacity={0.08}
                shape="square"
                isAnimationActive={false}
                legendType="none"
              />

              {/* Training data */}
              <Scatter data={passedPoints} dataKey="attendance" fill="#34d399" name="Passed" />
              <Scatter data={failedPoints} dataKey="attendance" fill="#f87171" name="Failed" />

              {/* Student input */}
              <Scatter
                data={[{ hours, attendance }]}
                dataKey="attendance"
                fill="#facc15"
                shape="star"
                name="তুমি"
              />
            </ScatterChart>
          </ResponsiveContainer>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              Passed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              Failed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              তোমার ইনপুট
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}