"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { playgroundDemos } from "@/lib/playground";
import HousePricePreview from "@/components/previews/HousePricePreview";
import FlowerClassifierPreview from "@/components/previews/FlowerClassifierPreview";
import PassFailPreview from "@/components/previews/PassFailPreview";

const previewComponents: Record<string, React.ComponentType> = {
  "house-price": HousePricePreview,
  "flower-classifier": FlowerClassifierPreview,
  "pass-fail": PassFailPreview,
};

export default function PlaygroundPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-4">
          <Sparkles className="w-3 h-3" />
          Module 3 · Live Models
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Playground
        </h1>
        <p className="mt-3 text-gray-400 leading-relaxed">
          এখানে তত্ত্ব থামে, ব্যবহার শুরু হয়। নিজের নম্বর বসাও, সত্যিকারের
          মডেল থেকে সত্যিকারের prediction নাও।
        </p>
      </motion.div>

      <div className="space-y-6">
        {playgroundDemos.map((demo, i) => {
          const Preview = previewComponents[demo.slug];
          const reversed = i % 2 === 1;

          return (
            <motion.div
              key={demo.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: 0.05 }}
            >
              <Link href={`/playground/${demo.slug}`} className="group block">
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 250, damping: 22 }}
                  className={`relative overflow-hidden rounded-3xl bg-gray-900/60 border border-gray-800 group-hover:border-gray-700 transition-colors flex flex-col ${
                    reversed ? "md:flex-row-reverse" : "md:flex-row"
                  }`}
                >
                  {/* Preview panel */}
                  <div
                    className={`relative md:w-[42%] aspect-[16/10] md:aspect-auto flex items-center justify-center p-6 bg-gradient-to-br ${demo.gradient} bg-opacity-10`}
                    style={{
                      background: `radial-gradient(circle at 30% 20%, ${demo.accent}22, transparent 60%)`,
                    }}
                  >
                    <div className="w-full max-w-[220px]">
                      <Preview />
                    </div>
                    <span
                      className="absolute top-4 left-4 text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full"
                      style={{
                        color: demo.accent,
                        backgroundColor: `${demo.accent}1a`,
                      }}
                    >
                      Live Demo
                    </span>
                  </div>

                  {/* Text panel */}
                  <div className="flex-1 p-7 sm:p-9 flex flex-col justify-center">
                    <p
                      className="text-xs font-semibold mb-2"
                      style={{ color: demo.accent }}
                    >
                      {demo.tagline}
                    </p>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      {demo.title}
                      <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </h2>
                    <p className="mt-3 text-sm text-gray-400 leading-relaxed max-w-md">
                      {demo.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {demo.inputs.map((inp) => (
                        <span
                          key={inp}
                          className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-gray-800/80 text-gray-400"
                        >
                          {inp}
                        </span>
                      ))}
                    </div>

                    <p className="mt-5 text-[11px] text-gray-600">
                      চালিত হচ্ছে {demo.basedOn} দিয়ে
                    </p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </main>
  );
}