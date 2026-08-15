import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import { concepts } from "@/lib/concepts";
import GradientDescentDemo from "@/components/GradientDescentDemo";
import OverfittingDemo from "@/components/OverfittingDemo";
import BiasVarianceDemo from "@/components/BiasVarianceDemo";
import TrainTestSplitDemo from "@/components/TrainTestSplitDemo";
import ConfusionMatrixDemo from "@/components/ConfusionMatrixDemo";
import KnnDemo from "@/components/KnnDemo";

export function generateStaticParams() {
  return concepts.map((c) => ({ slug: c.slug }));
}

export default async function ConceptDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const concept = concepts.find((c) => c.slug === slug);

  if (!concept) notFound();

  const Icon = concept.icon;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link
        href="/concepts"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-indigo-400 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Concepts
      </Link>

      <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${concept.gradient} flex items-center justify-center shadow-md shrink-0`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            {concept.title}
          </h1>
        </div>

        <Link
          href={`/concepts/${concept.slug}/notes`}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-900 text-gray-200 text-sm font-semibold border border-gray-700 hover:bg-gray-800 transition-colors"
        >
          <FileText className="w-4 h-4" />
          Docs
        </Link>
      </div>

      <p className="mt-3 text-gray-400 leading-relaxed">
        {concept.shortDescription}
      </p>

      <div className="mt-10">
        {slug === "gradient-descent" && <GradientDescentDemo />}
        {slug === "overfitting-underfitting" && <OverfittingDemo />}
        {slug === "bias-variance" && <BiasVarianceDemo />}
        {slug === "train-test-split" && <TrainTestSplitDemo />}
        {slug === "confusion-matrix" && <ConfusionMatrixDemo />}
        {slug === "knn-k-value" && <KnnDemo />}
      </div>
    </main>
  );
}