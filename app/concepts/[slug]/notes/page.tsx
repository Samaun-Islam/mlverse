import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { concepts } from "@/lib/concepts";

export function generateStaticParams() {
  return concepts.map((c) => ({ slug: c.slug }));
}

export default async function ConceptNotesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const concept = concepts.find((c) => c.slug === slug);

  if (!concept) notFound();

  const Icon = concept.icon;

  return (
    <main className="bg-gray-900 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link
          href={`/concepts/${concept.slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-indigo-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {concept.title} demo
        </Link>

        <div className="flex items-center gap-4 mb-4">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${concept.gradient} flex items-center justify-center shadow-md shrink-0`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {concept.title}
          </h1>
        </div>

        <p className="text-gray-300 mb-12 pb-8 border-b border-gray-700">
          {concept.shortDescription}
        </p>

        <article className="space-y-10">
          {concept.notes.map((section, i) => (
            <div key={i}>
              <h2 className="text-lg font-semibold text-white mb-2.5 flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0">
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
      </div>
    </main>
  );
}