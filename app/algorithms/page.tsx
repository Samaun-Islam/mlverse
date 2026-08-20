"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { algorithms } from "@/lib/algorithms";

export default function AlgorithmsPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mb-14"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-4">
          Module 2
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Algorithms
        </h1>
        <p className="mt-3 text-gray-400 leading-relaxed">
         The algorithms that actually power ML how they work and where they perform best.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {algorithms.map((algo, i) => {
          const Icon = algo.icon;
          return (
            <motion.div
              key={algo.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={`/algorithms/${algo.slug}`}
                className="group block h-full"
              >
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="h-full p-6 rounded-2xl bg-white border border-gray-200 hover:border-transparent hover:shadow-xl hover:shadow-indigo-100 transition-all"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-br ${algo.gradient} flex items-center justify-center shadow-md`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                        algo.category === "Supervised"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {algo.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-1.5">
                    {algo.title}
                    <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </h3>

                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {algo.shortDescription}
                  </p>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </main>
  );
}