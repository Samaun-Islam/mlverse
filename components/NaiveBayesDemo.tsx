"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { trainModel, predict, VOCABULARY } from "@/lib/naiveBayes";

const model = trainModel();

export default function NaiveBayesDemo() {
  const [selectedWords, setSelectedWords] = useState<Set<string>>(
    new Set(["free", "win", "click"])
  );

  const result = useMemo(() => predict(model, selectedWords), [selectedWords]);

  const toggleWord = (word: string) => {
    setSelectedWords((prev) => {
      const next = new Set(prev);
      if (next.has(word)) next.delete(word);
      else next.add(word);
      return next;
    });
  };

  const isSpamPrediction = result.spamPosterior > result.hamPosterior;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
      {/* Left: word selection + breakdown */}
      <div className="space-y-6">
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
          <p className="text-sm font-medium text-gray-300 mb-4">
            Choose which words are present in the message.
          </p>
          <div className="flex flex-wrap gap-2">
            {VOCABULARY.map((word) => {
              const active = selectedWords.has(word);
              return (
                <button
                  key={word}
                  onClick={() => toggleWord(word)}
                  className={`px-3.5 py-2 rounded-full text-sm font-medium transition-colors border ${
                    active
                      ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/50"
                      : "bg-gray-800/60 text-gray-400 border-gray-700 hover:border-gray-600"
                  }`}
                >
                  {word}
                </button>
              );
            })}
          </div>
        </div>

        {/* Per-word breakdown table */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
          <p className="text-sm font-medium text-gray-300 mb-4">
            How each word contributes to the calculation.
          </p>
          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            {result.steps.map((step) => (
              <div
                key={step.word}
                className={`flex items-center justify-between text-xs rounded-lg px-3 py-2 ${
                  step.present ? "bg-indigo-500/10" : "bg-gray-800/40"
                }`}
              >
                <span
                  className={`font-medium ${
                    step.present ? "text-indigo-300" : "text-gray-500"
                  }`}
                >
                  {step.word} {step.present ? "✓ Available" : ". Not Available"}
                </span>
                <span className="text-gray-500 font-mono">
                  P(spam)={step.spamProbability.toFixed(2)} · P(ham)=
                  {step.hamProbability.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: result */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 h-fit space-y-6">
        <div
          className={`rounded-xl p-5 border text-center ${
            isSpamPrediction
              ? "bg-red-500/10 border-red-500/30"
              : "bg-emerald-500/10 border-emerald-500/30"
          }`}
        >
          <p className="text-xs text-gray-400 mb-1">Prediction</p>
          <p
            className={`text-2xl font-bold ${
              isSpamPrediction ? "text-red-300" : "text-emerald-300"
            }`}
          >
            {isSpamPrediction ? "🚫 Spam" : "✅ Not Spam"}
          </p>
        </div>

        <div className="space-y-3">
          <ProbabilityBar
            label="Spam"
            value={result.spamPosterior}
            color="bg-red-400"
          />
          <ProbabilityBar
            label="Not Spam"
            value={result.hamPosterior}
            color="bg-emerald-400"
          />
        </div>

        <div className="text-xs text-gray-400 leading-relaxed bg-gray-800/60 rounded-xl p-4">
          <p className="mb-2">
            <strong className="text-gray-200">Prior:</strong> P(spam) ={" "}
            {model.priorSpam.toFixed(2)}, P(not spam) ={" "}
            {model.priorHam.toFixed(2)}
          </p>
          <p>
            Each word’s probability is multiplied together (under the naive assumption that the words are independent), and then the result is normalized to get the final prediction.
          </p>
        </div>
      </div>
    </div>
  );
}

function ProbabilityBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-xs font-mono text-gray-300">
          {(value * 100).toFixed(1)}%
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-gray-800 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          animate={{ width: `${value * 100}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        />
      </div>
    </div>
  );
}