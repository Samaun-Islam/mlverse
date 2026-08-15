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
    name: "ভারসাম্যপূর্ণ মডেল",
    description: "মোটামুটি ভালো, ব্যালেন্সড পারফরম্যান্স",
    counts: { tp: 45, fp: 8, tn: 42, fn: 5 },
  },
  {
    name: "স্প্যাম ফিল্টার (High Precision দরকার)",
    description: "ভুলে গুরুত্বপূর্ণ মেইল স্প্যাম বলা যাবে না (FP কম হওয়া দরকার)",
    counts: { tp: 30, fp: 2, tn: 60, fn: 8 },
  },
  {
    name: "রোগ শনাক্তকরণ (High Recall দরকার)",
    description: "কোনো আক্রান্ত রোগীকে miss করা যাবে না (FN কম হওয়া দরকার)",
    counts: { tp: 38, fp: 15, tn: 40, fn: 2 },
  },
  {
    name: "Imbalanced ডেটাসেট ফাঁদ",
    description: "Accuracy বেশি দেখালেও আসলে মডেল প্রায় কিছুই ধরতে পারছে না",
    counts: { tp: 2, fp: 1, tn: 95, fn: 2 },
  },
];