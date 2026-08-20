export interface ConfusionCounts {
  tp: number;
  fp: number;
  tn: number;
  fn: number;
}

export interface ConfusionMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  total: number;
}

export function computeMetrics(counts: ConfusionCounts): ConfusionMetrics {
  const { tp, fp, tn, fn } = counts;
  const total = tp + fp + tn + fn;

  const accuracy = total > 0 ? (tp + tn) / total : 0;
  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
  const f1 =
    precision + recall > 0
      ? (2 * precision * recall) / (precision + recall)
      : 0;

  return { accuracy, precision, recall, f1, total };
}

// কয়েকটা preset scenario, যাতে user বাস্তব উদাহরণ দিয়ে বুঝতে পারে
export const presets: { name: string; description: string; counts: ConfusionCounts }[] = [
  {
    name: "Balanced Model",
    description: "Fairly good, balanced performance",
    counts: { tp: 45, fp: 8, tn: 42, fn: 5 },
  },
  {
    name: "Spam filter (High precision is important)",
    description: "Important emails must not be mistakenly classified as spam (low FP is important)",
    counts: { tp: 30, fp: 2, tn: 60, fn: 8 },
  },
  {
    name: "Disease detection (High recall is important).",
    description: "No affected patient should be missed (low FN is important)",
    counts: { tp: 38, fp: 15, tn: 40, fn: 2 },
  },
  {
    name: "The Imbalanced Dataset Trap",
    description: "Even with high accuracy, the model may actually be detecting almost nothing.",
    counts: { tp: 2, fp: 1, tn: 95, fn: 2 },
  },
];