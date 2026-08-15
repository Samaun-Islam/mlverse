import {
  TrendingUp,
  Waves,
  GitFork,
  Target,
  CircleDot,
  Mail,
  type LucideIcon,
} from "lucide-react";

export interface NoteSection {
  heading: string;
  body: string;
}

export type AlgorithmCategory = "Supervised" | "Unsupervised";

export interface Algorithm {
  slug: string;
  title: string;
  category: AlgorithmCategory;
  shortDescription: string;
  icon: LucideIcon;
  gradient: string;
  notes: NoteSection[];
}

export const algorithms: Algorithm[] = [
  {
    slug: "linear-regression",
    title: "Linear Regression",
    category: "Supervised",
    shortDescription:
      "একটা সরল রেখা কীভাবে ডেটার মধ্য দিয়ে সবচেয়ে ভালোভাবে fit হয়ে যায়, লাইভ দেখো।",
    icon: TrendingUp,
    gradient: "from-indigo-500 to-blue-500",
    notes: [
      {
        heading: "Linear Regression কী সমস্যা সমাধান করে",
        body:
          "যখন দুটো সংখ্যাসূচক variable-এর মধ্যে একটা সরলরৈখিক সম্পর্ক থাকে (একটা বাড়লে আরেকটাও মোটামুটি সমানুপাতিক হারে বাড়ে/কমে), তখন Linear Regression দিয়ে সেই সম্পর্কটাকে একটা সরল রেখার সমীকরণে প্রকাশ করা যায় — যেমন, বাড়ির আয়তন বাড়লে দাম কেমন বাড়ে, বা পড়াশোনার সময় বাড়লে পরীক্ষার নম্বর কেমন বাড়ে।",
      },
      {
        heading: "Best-Fit Line খুঁজে বের করা",
        body:
          "লক্ষ্য হলো এমন একটা রেখা (y = mx + b) খুঁজে বের করা, যেটা সব ডেটা পয়েন্ট থেকে গড়ে সবচেয়ে কম দূরত্বে থাকে। এই দূরত্বকে বলে 'residual' (আসল মান বনাম রেখার predicted মানের পার্থক্য)। Linear Regression 'Least Squares' পদ্ধতি ব্যবহার করে — প্রতিটা residual-কে বর্গ (square) করে যোগ করে, সেই যোগফল সর্বনিম্ন করে এমন m (slope) আর b (intercept) বের করা হয়।",
      },
      {
        heading: "Slope (m) আর Intercept (b) কী বোঝায়",
        body:
          "Slope বলে দেয়, x একক (unit) বাড়লে y কতটা বাড়ে/কমে — এটাই সম্পর্কের 'দৃঢ়তা' আর দিক নির্দেশ করে। Intercept বলে দেয়, x = 0 হলে y-এর মান কত হবে — রেখাটা y-অক্ষকে কোথায় ছেদ করে। এই demo-তে তুমি যখন নতুন পয়েন্ট যোগ করো, দেখবে রেখাটা এই দুটো মানকে নতুন করে সমন্বয় (adjust) করে, যাতে সব পয়েন্ট মিলিয়ে সবচেয়ে ভালো fit পাওয়া যায়।",
      },
      {
        heading: "R² Score কীভাবে পড়বে",
        body:
          "R² (R-squared) বলে দেয়, y-এর মধ্যে যে পরিবর্তনশীলতা (variance) আছে, তার কতটুকু আমাদের রেখা দিয়ে ব্যাখ্যা করা যাচ্ছে। R² = 1 মানে রেখাটা প্রতিটা পয়েন্টের মধ্য দিয়ে নিখুঁতভাবে গেছে। R² = 0 মানে রেখাটা গড় মান (average) বলার চেয়ে ভালো কিছুই করছে না। বাস্তব ডেটাতে R² = 0.7-0.9 কে সাধারণত ভালো ফিট ধরা হয়, যদিও এটা ডোমেইন অনুযায়ী পাল্টায়।",
      },
      {
        heading: "কখন Linear Regression ব্যবহার করা উচিত না",
        body:
          "যদি ডেটার মধ্যে সম্পর্কটা বাঁকানো (curved) বা জটিল হয় (যেমন আমাদের Overfitting demo-র sine curve), তাহলে একটা সরল রেখা দিয়ে সেটা ভালোভাবে ধরা যাবে না — R² কম আসবে। তখন হয় Polynomial Regression (উঁচু ডিগ্রি ব্যবহার করে), অথবা সম্পূর্ণ অন্য কোনো algorithm (Decision Tree, Neural Network) ব্যবহার করা ভালো।",
      },
      {
        heading: "বাস্তবে কোথায় ব্যবহার হয়",
        body:
          "House Price Prediction (আয়তন, রুম সংখ্যা দিয়ে দাম অনুমান), Sales Forecasting (বিজ্ঞাপনের খরচ দিয়ে বিক্রি অনুমান), Salary Prediction (অভিজ্ঞতার বছর দিয়ে বেতন অনুমান) — এরকম অসংখ্য জায়গায় এটাই সবচেয়ে প্রথম চেষ্টা করার মতো, সহজ এবং ব্যাখ্যাযোগ্য (interpretable) algorithm। এই একই logic আমরা পরে Playground-এর House Price Predictor-এ ব্যবহার করব।",
      },
    ],
  },
  {
    slug: "logistic-regression",
    title: "Logistic Regression",
    category: "Supervised",
    shortDescription:
      "একটা S-আকৃতির curve কীভাবে হ্যাঁ/না সিদ্ধান্ত নেয়, sigmoid function দিয়ে।",
    icon: Waves,
    gradient: "from-blue-500 to-cyan-500",
    notes: [
      {
        heading: "শীঘ্রই আসছে",
        body: "এই algorithm-এর বিস্তারিত notes পরের ধাপে যোগ করা হবে।",
      },
    ],
  },
  {
    slug: "decision-tree",
    title: "Decision Tree",
    category: "Supervised",
    shortDescription:
      "ধাপে ধাপে প্রশ্ন করে করে কীভাবে একটা গাছের মতো কাঠামো সিদ্ধান্ত নেয়।",
    icon: GitFork,
    gradient: "from-cyan-500 to-teal-500",
    notes: [
      {
        heading: "শীঘ্রই আসছে",
        body: "এই algorithm-এর বিস্তারিত notes পরের ধাপে যোগ করা হবে।",
      },
    ],
  },
  {
    slug: "knn",
    title: "K-Nearest Neighbors",
    category: "Supervised",
    shortDescription:
      "আশেপাশের K-টা প্রতিবেশী দেখেই একটা নতুন বিন্দুর ক্লাস ঠিক করে ফেলে।",
    icon: Target,
    gradient: "from-purple-500 to-indigo-500",
    notes: [
      {
        heading: "শীঘ্রই আসছে",
        body: "এই algorithm-এর বিস্তারিত notes পরের ধাপে যোগ করা হবে।",
      },
    ],
  },
  {
    slug: "k-means",
    title: "K-Means Clustering",
    category: "Unsupervised",
    shortDescription:
      "কোনো লেবেল ছাড়াই ডেটা নিজে থেকে কীভাবে ক্লাস্টারে ভাগ হয়ে যায়।",
    icon: CircleDot,
    gradient: "from-fuchsia-500 to-purple-500",
    notes: [
      {
        heading: "শীঘ্রই আসছে",
        body: "এই algorithm-এর বিস্তারিত notes পরের ধাপে যোগ করা হবে।",
      },
    ],
  },
  {
    slug: "naive-bayes",
    title: "Naive Bayes",
    category: "Supervised",
    shortDescription:
      "সম্ভাব্যতা (probability) হিসাব করে কীভাবে দ্রুত শ্রেণীবিভাগ করে ফেলে।",
    icon: Mail,
    gradient: "from-pink-500 to-fuchsia-500",
    notes: [
      {
        heading: "শীঘ্রই আসছে",
        body: "এই algorithm-এর বিস্তারিত notes পরের ধাপে যোগ করা হবে।",
      },
    ],
  },
];