import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import { algorithms } from "@/lib/algorithms";
import LinearRegressionDemo from "@/components/LinearRegressionDemo";
import LogisticRegressionDemo from "@/components/LogisticRegressionDemo";
import DecisionTreeDemo from "@/components/DecisionTreeDemo";
import KnnAlgorithmDemo from "@/components/KnnAlgorithmDemo";
import KMeansDemo from "@/components/KMeansDemo";
import NaiveBayesDemo from "@/components/NaiveBayesDemo";

export function generateStaticParams() {
  return algorithms.map((a) => ({ slug: a.slug }));
}

export default async function AlgorithmDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const algo = algorithms.find((a) => a.slug === slug);

  if (!algo) notFound();

  const Icon = algo.icon;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link
        href="/algorithms"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-indigo-400 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Algorithms
      </Link>

      <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${algo.gradient} flex items-center justify-center shadow-md shrink-0`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                  algo.category === "Supervised"
                    ? "bg-emerald-500/10 text-emerald-300"
                    : "bg-amber-500/10 text-amber-300"
                }`}
              >
                {algo.category}
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white">
              {algo.title}
            </h1>
          </div>
        </div>

        <Link
          href={`/algorithms/${algo.slug}/notes`}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-900 text-gray-200 text-sm font-semibold border border-gray-700 hover:bg-gray-800 transition-colors"
        >
          <FileText className="w-4 h-4" />
          Docs
        </Link>
      </div>

      <p className="mt-3 text-gray-400 leading-relaxed max-w-2xl">
        {algo.shortDescription}
      </p>

      <div className="mt-10">
        {slug === "linear-regression" && <LinearRegressionDemo />}
        {slug === "logistic-regression" && <LogisticRegressionDemo />}
        {slug === "decision-tree" && <DecisionTreeDemo />}
        {slug === "knn" && <KnnAlgorithmDemo />}
        {slug === "k-means" && <KMeansDemo />}
        {slug === "naive-bayes" && <NaiveBayesDemo />}
      </div>
    </main>
  );
}