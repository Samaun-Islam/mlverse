"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { computeMetrics, presets, type ConfusionCounts } from "@/lib/confusionMatrix";

export default function ConfusionMatrixDemo() {
  const [counts, setCounts] = useState<ConfusionCounts>({
    tp: 45,
    fp: 8,
    tn: 42,
    fn: 5,
  });

  const metrics = useMemo(() => computeMetrics(counts), [counts]);

  const updateField = (field: keyof ConfusionCounts, value: string) => {
    const num = Math.max(0, parseInt(value) || 0);
    setCounts((prev) => ({ ...prev, [field]: num }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
      {/* Left: Matrix input + result cards */}
      <div className="space-y-6">
        {/* Confusion matrix grid */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
          <p className="text-sm font-medium text-gray-300 mb-5">
            Enter your own numbers: 
          </p>

          <div className="grid grid-cols-[auto_1fr_1fr] gap-2 max-w-md">
            <div />
            <div className="text-center text-xs font-medium text-gray-400 pb-2">
              Predicted Positive
            </div>
            <div className="text-center text-xs font-medium text-gray-400 pb-2">
              Predicted Negative
            </div>

            <div className="flex items-center justify-center text-xs font-medium text-gray-400 pr-2 [writing-mode:vertical-rl] rotate-180">
              Actual Positive
            </div>
            <MatrixCell
              label="True Positive"
              value={counts.tp}
              onChange={(v) => updateField("tp", v)}
              color="bg-green-500/10 border-green-500/30 text-green-300"
            />
            <MatrixCell
              label="False Negative"
              value={counts.fn}
              onChange={(v) => updateField("fn", v)}
              color="bg-red-500/10 border-red-500/30 text-red-300"
            />

            <div className="flex items-center justify-center text-xs font-medium text-gray-400 pr-2 [writing-mode:vertical-rl] rotate-180">
              Actual Negative
            </div>
            <MatrixCell
              label="False Positive"
              value={counts.fp}
              onChange={(v) => updateField("fp", v)}
              color="bg-red-500/10 border-red-500/30 text-red-300"
            />
            <MatrixCell
              label="True Negative"
              value={counts.tn}
              onChange={(v) => updateField("tn", v)}
              color="bg-green-500/10 border-green-500/30 text-green-300"
            />
          </div>

          <p className="text-xs text-gray-500 mt-4">
            মোট sample: <span className="text-gray-300">{metrics.total}</span>
          </p>
        </div>

        {/* Result cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MetricCard
            label="Accuracy"
            value={metrics.accuracy}
            hint="How many of the predictions are correct"
          />
          <MetricCard
            label="Precision"
            value={metrics.precision}
            hint="Of the predictions labeled positive, how many are actually correct"
          />
          <MetricCard
            label="Recall"
            value={metrics.recall}
            hint="Of all the actual positives, how many were correctly identified"
          />
          <MetricCard
            label="F1-Score"
            value={metrics.f1}
            hint="Precision and Recall of harmonic mean"
            highlight
          />
        </div>
      </div>

      {/* Right: Presets */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 h-fit space-y-3">
        <p className="text-sm font-medium text-gray-300 mb-1">
          Try it with a real-world example.
        </p>
        {presets.map((preset) => (
          <motion.button
            key={preset.name}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCounts(preset.counts)}
            className="w-full text-left p-3.5 rounded-xl bg-gray-800/60 hover:bg-gray-800 border border-gray-700 transition-colors"
          >
            <p className="text-sm font-medium text-gray-200">{preset.name}</p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              {preset.description}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function MatrixCell({
  label,
  value,
  onChange,
  color,
}: {
  label: string;
  value: number;
  onChange: (value: string) => void;
  color: string;
}) {
  return (
    <div className={`rounded-xl border p-3 ${color}`}>
      <p className="text-[10px] font-medium uppercase tracking-wide opacity-80 mb-1">
        {label}
      </p>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-2xl font-bold outline-none"
      />
    </div>
  );
}

function MetricCard({
  label,
  value,
  hint,
  highlight,
}: {
  label: string;
  value: number;
  hint: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        highlight
          ? "bg-indigo-500/10 border-indigo-500/30"
          : "bg-gray-900/60 border-gray-800"
      }`}
    >
      <p
        className={`text-xs font-medium mb-1 ${
          highlight ? "text-indigo-300" : "text-gray-400"
        }`}
      >
        {label}
      </p>
      <p
        className={`text-2xl font-bold ${
          highlight ? "text-indigo-200" : "text-white"
        }`}
      >
        {(value * 100).toFixed(1)}%
      </p>
      <p className="text-[11px] text-gray-500 mt-1.5 leading-snug">{hint}</p>
    </div>
  );
}