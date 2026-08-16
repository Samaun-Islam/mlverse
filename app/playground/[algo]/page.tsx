import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { playgroundDemos } from "@/lib/playground";
import HousePriceDemo from "@/components/HousePriceDemo";
import FlowerClassifierDemo from "@/components/FlowerClassifierDemo";
import PassFailDemo from "@/components/PassFailDemo";

export function generateStaticParams() {
  return playgroundDemos.map((d) => ({ algo: d.slug }));
}

export default async function PlaygroundDetailPage({
  params,
}: {
  params: Promise<{ algo: string }>;
}) {
  const { algo } = await params;
  const demo = playgroundDemos.find((d) => d.slug === algo);

  if (!demo) notFound();

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link
        href="/playground"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-indigo-400 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Playground
      </Link>

      <div className="mb-3">
        <p className="text-xs font-semibold mb-2" style={{ color: demo.accent }}>
          {demo.tagline}
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-white">
          {demo.title}
        </h1>
      </div>

      <p className="mt-3 text-gray-400 leading-relaxed max-w-2xl mb-10">
        {demo.description}
      </p>

      {algo === "house-price" && <HousePriceDemo />}
      {algo === "flower-classifier" && <FlowerClassifierDemo />}
      {algo === "pass-fail" && <PassFailDemo />}
    </main>
  );
}