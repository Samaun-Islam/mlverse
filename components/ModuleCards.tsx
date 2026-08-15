"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Layers, GitBranch, FlaskConical, ArrowUpRight } from "lucide-react";

const modules = [
  {
    title: "Concepts",
    description:
      "Slide, drag, and watch core ML ideas  gradient descent, overfitting, bias-variance react in real time.",
    href: "/concepts",
    icon: Layers,
    tag: "6 interactive concepts",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    title: "Algorithms",
    description:
      "Step-by-step breakdowns of the algorithms that power ML how they think, and where they shine.",
    href: "/algorithms",
    icon: GitBranch,
    tag: "8 algorithms explained",
    gradient: "from-purple-500 to-fuchsia-500",
  },
  {
    title: "Playground",
    description:
      "Type in real numbers and get a real prediction house prices, flower species, pass or fail.",
    href: "/playground",
    icon: FlaskConical,
    tag: "3 live prediction demos",
    gradient: "from-fuchsia-500 to-pink-500",
  },
];

export default function ModuleCards() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-12 max-w-xl"
      >
        <h2 className="text-3xl font-bold text-gray tracking-tight">
          Three ways in, one way to actually understand it
        </h2>
        <p className="mt-3 text-gray">
          Start wherever makes sense for you they are all connected.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modules.map((mod, i) => {
          const Icon = mod.icon;
          return (
            <motion.div
              key={mod.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={mod.href} className="group block h-full">
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="h-full p-7 rounded-2xl bg-white border border-gray-200 hover:border-transparent hover:shadow-xl hover:shadow-indigo-100 transition-shadow relative overflow-hidden"
                >
                  {/* Gradient icon box */}
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mod.gradient} flex items-center justify-center mb-5 shadow-md`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-1.5">
                    {mod.title}
                    <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </h3>

                  <p className="mt-2.5 text-sm text-gray-600 leading-relaxed">
                    {mod.description}
                  </p>

                  <div className="mt-5 inline-flex items-center text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {mod.tag}
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}