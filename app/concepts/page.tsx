"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { concepts } from "@/lib/concepts";

export default function ConceptsPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mb-14"
      >
        
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Concepts
        </h1>
        <p className="mt-3 text-gray-400 leading-relaxed">
          The ideas that sit underneath every ML algorithm. Move a slider,
          see the math respond.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {concepts.map((concept, i) => {
          const Icon = concept.icon;
          return (
            <motion.div
              key={concept.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={`/concepts/${concept.slug}`}
                className="group block h-full"
              >
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="h-full p-6 rounded-2xl bg-gray-900/60 border border-gray-800 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-950/50 transition-all"
                >
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${concept.gradient} flex items-center justify-center mb-5 shadow-md`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  <h3 className="text-lg font-semibold text-white flex items-center gap-1.5">
                    {concept.title}
                    <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </h3>

                  <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                    {concept.shortDescription}
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