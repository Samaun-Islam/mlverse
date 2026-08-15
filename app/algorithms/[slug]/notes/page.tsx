import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { algorithms } from "@/lib/algorithms";

export function generateStaticParams() {
  return algorithms.map((a) => ({ slug: a.slug }));
}

export default async function AlgorithmNotesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const algo = algorithms.find((a) => a.slug === slug);

  if (!algo) notFound();

  const Icon = algo.icon;

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link
        href={`/algorithms/${algo.slug}`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-indigo-400 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to {algo.title} demo
      </Link>

      <div className="flex items-center gap-4 mb-4">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${algo.gradient} flex items-center justify-center shadow-md shrink-0`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          {algo.title}
        </h1>
      </div>

      <p className="text-gray-400 mb-12 pb-8 border-b border-gray-800">
        {algo.shortDescription}
      </p>

      <article className="space-y-10">
        {algo.notes.map((section, i) => (
          <div key={i}>
            <h2 className="text-lg font-semibold text-white mb-2.5 flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-md bg-indigo-500/10 text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              {section.heading}
            </h2>
            <p className="text-gray-300 leading-relaxed text-[15px] pl-[34px]">
              {section.body}
            </p>
          </div>
        ))}
      </article>
    </main>
  );
}