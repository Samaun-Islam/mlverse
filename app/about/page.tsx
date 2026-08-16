"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Layers,
  MousePointerClick,
  Code2,
  FlaskConical,
} from "lucide-react";

const philosophy = [
  {
    icon: MousePointerClick,
    title: "কোনো Passive Reading না",
    body: "একটা formula পড়ে সেটা বিশ্বাস করে নেওয়া, আর সেই formula নিজের হাতে নাড়িয়ে দেখা — এই দুইটা সম্পূর্ণ ভিন্ন অভিজ্ঞতা। MLVerse-এর প্রতিটা concept তাই ইন্টারঅ্যাক্টিভ।",
  },
  {
    icon: Layers,
    title: "তত্ত্ব থেকে প্রয়োগ পর্যন্ত",
    body: "শুধু 'কীভাবে কাজ করে' জানলেই হয় না। Concepts থেকে Algorithms, তারপর Playground-এ real prediction — পুরো যাত্রাটাই একসাথে গাঁথা।",
  },
  {
    icon: Code2,
    title: "সব হিসাব খোলা, লুকানো নয়",
    body: "এখানে কোনো black-box demo নেই। প্রতিটা visualization-এর পেছনের গণিত সত্যিকারের JavaScript-এ লেখা, browser-এই চলে — কোনো server, কোনো hidden API নেই।",
  },
];

export default function AboutPage() {
  return (
    <main className="overflow-hidden">
      {/* Hero statement */}
      <section className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-8">
            About MLVerse
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-[1.15]">
            Machine Learning বই থেকে শেখা যায়।{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              কিন্তু মনে থাকে, যখন হাত দিয়ে ছোঁয়া যায়।
            </span>
          </h1>
          <p className="mt-6 text-lg text-gray-400 leading-relaxed max-w-2xl">
            MLVerse একটা জায়গা, যেখানে ML-এর প্রতিটা সমীকরণ শুধু পড়ার জন্য
            না — নাড়াচাড়া করার জন্য। Slider টানো, curve নড়ে ওঠে। Threshold
            বদলাও, decision পাল্টে যায়। এটাই শেখার সবচেয়ে সৎ উপায়।
          </p>
        </motion.div>
      </section>

      {/* Philosophy — alternating rhythm */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-white mb-12"
        >
          কেন এভাবে বানানো
        </motion.h2>

        <div className="space-y-10">
          {philosophy.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex gap-5 items-start"
              >
                <div className="w-11 h-11 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-400 leading-relaxed max-w-xl">
                    {item.body}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Creator's note */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-900/40 p-8 sm:p-10"
        >
          <div className="absolute top-8 left-8 text-5xl text-gray-800 font-serif select-none">
            &ldquo;
          </div>
          <p className="relative text-lg text-gray-300 leading-relaxed pl-8 sm:pl-10">
            আমি নিজে যখন Machine Learning শিখছিলাম, সবচেয়ে কঠিন অংশটা ছিল
            না — formula মনে রাখা। কঠিন ছিল, ওই formula আসলে কী করছে সেটা{" "}
            <em className="text-white not-italic font-medium">
              কল্পনা
            </em>{" "}
            করা। MLVerse বানানো হয়েছে ঠিক সেই gap পূরণ করতে — যাতে কেউ আর
            শুধু কল্পনার উপর নির্ভর না করে, নিজের চোখে দেখতে পারে।
          </p>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-3">
            শুরু করার জন্য প্রস্তুত?
          </h2>
          <p className="text-gray-400 mb-8">
            প্রথম concept থেকে শুরু করো, নাকি সরাসরি Playground-এ ঝাঁপ দাও।
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/concepts">
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-950 hover:shadow-xl transition-shadow"
              >
                Concepts দিয়ে শুরু করো
                <ArrowRight className="w-4 h-4" />
              </motion.span>
            </Link>
            <Link href="/playground">
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gray-900 text-gray-100 font-semibold border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <FlaskConical className="w-4 h-4 text-indigo-400" />
                Playground দেখো
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}