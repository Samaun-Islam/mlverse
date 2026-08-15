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
        heading: "নাম 'Regression' হলেও এটা আসলে Classification",
        body:
          "নামে 'Regression' থাকলেও, Logistic Regression মূলত ব্যবহার হয় Classification-এর জন্য — যেমন পাস/ফেল, স্প্যাম/না-স্প্যাম, রোগী/সুস্থ। এটা একটা সংখ্যা predict করে না, বরং একটা probability (0 থেকে 1-এর মধ্যে) predict করে, যেটা বলে দেয় কোনো একটা ইনপুট 'positive' ক্লাসের কতটা কাছাকাছি।",
      },
      {
        heading: "Sigmoid Function — সংখ্যাকে Probability-তে রূপান্তর",
        body:
          "Linear Regression যেমন সরাসরি y = mx + b আকারে একটা সংখ্যা দেয়, সেই সংখ্যাটা −∞ থেকে +∞ পর্যন্ত যেকোনো কিছু হতে পারে। কিন্তু আমাদের দরকার 0 থেকে 1-এর মধ্যে একটা probability। এই কাজটাই করে Sigmoid Function: σ(z) = 1 / (1 + e⁻ᶻ)। এটা যেকোনো সংখ্যাকে চমৎকারভাবে 0 আর 1-এর মধ্যে 'squeeze' করে দেয় — বড় পজিটিভ সংখ্যা প্রায় 1-এর কাছাকাছি যায়, বড় নেগেটিভ সংখ্যা প্রায় 0-এর কাছাকাছি যায়।",
      },
      {
        heading: "Decision Boundary — সিদ্ধান্তের সীমারেখা",
        body:
          "যেখানে sigmoid curve ঠিক 0.5 probability-তে থাকে, সেই বিন্দুটাই হলো decision boundary — এর ডানপাশে probability 0.5-এর বেশি (predict হবে 'Pass'), বামপাশে 0.5-এর কম (predict হবে 'Fail')। মডেল ট্রেইন করার মানেই হলো, ডেটার সাথে সবচেয়ে ভালোভাবে মানানসই এমন একটা weight ও bias খুঁজে বের করা, যাতে এই boundary সঠিক জায়গায় বসে।",
      },
      {
        heading: "Threshold বদলানো কেন গুরুত্বপূর্ণ",
        body:
          "ডিফল্টভাবে threshold 0.5 ধরা হয় (probability 0.5-এর বেশি হলে positive), কিন্তু বাস্তব সমস্যায় এটা সবসময় ঠিক না-ও হতে পারে। যেমন, রোগ নির্ণয়ে threshold কমিয়ে দেওয়া হয় (even সামান্য সন্দেহ হলেও 'positive' ধরে নেওয়া), কারণ একজন রোগীকে miss করার চেয়ে ভুল অ্যালার্ম অনেক কম ক্ষতিকর। এটা ঠিক Confusion Matrix-এ যা শিখেছিলে — Precision বনাম Recall-এর সেই একই ট্রেড-অফ, threshold দিয়েই নিয়ন্ত্রণ করা হয়।",
      },
      {
        heading: "কীভাবে ট্রেইন করা হয়",
        body:
          "Logistic Regression-ও Gradient Descent দিয়েই ট্রেইন হয় — ঠিক Concepts মডিউলে যেভাবে শিখেছিলে। পার্থক্য শুধু loss function-এ: Linear Regression Mean Squared Error ব্যবহার করে, কিন্তু Logistic Regression ব্যবহার করে 'Log Loss' (বা Cross-Entropy Loss), যেটা probability-ভিত্তিক ভুলকে আরও উপযুক্তভাবে মাপে।",
      },
      {
        heading: "বাস্তবে কোথায় ব্যবহার হয়",
        body:
          "Email Spam Detection, Medical Diagnosis (রোগ আছে/নেই), Customer Churn Prediction (গ্রাহক চলে যাবে কিনা), Credit Approval (loan দেওয়া উচিত কিনা) — যেকোনো জায়গায় যেখানে সিদ্ধান্তটা মূলত দুইটা ক্লাসের মধ্যে (binary), সেখানেই Logistic Regression একটা classic, নির্ভরযোগ্য প্রথম পছন্দ।",
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
        heading: "মূল ধারণা — প্রশ্নের পর প্রশ্ন",
        body:
          "Decision Tree কাজ করে ঠিক একজন ডাক্তারের মতো, যিনি একটার পর একটা প্রশ্ন করে রোগ নির্ণয় করেন — 'জ্বর আছে?', 'হ্যাঁ হলে, কাশি আছে?'। প্রতিটা প্রশ্ন ডেটাকে দুই ভাগে ভাগ করে, আর ভাগ করতে করতে শেষ পর্যন্ত একটা সিদ্ধান্তে (leaf/পাতা) পৌঁছানো হয়। প্রতিটা প্রশ্নকে বলে 'split', আর পুরো কাঠামোটাকে বলে 'tree' — কারণ এটা দেখতে উল্টানো গাছের মতো (উপরে root, নিচে leaves)।",
      },
      {
        heading: "কীভাবে সবচেয়ে ভালো প্রশ্নটা বেছে নেওয়া হয়?",
        body:
          "প্রতিটা ধাপে, Decision Tree সব সম্ভাব্য প্রশ্ন (feature + threshold-এর সব combination) পরীক্ষা করে দেখে, কোনটা ডেটাকে সবচেয়ে ভালোভাবে 'পরিষ্কার' (pure) দুই ভাগে ভাগ করতে পারে। এই পরিষ্কারতা মাপার জন্য ব্যবহার হয় Gini Impurity — একটা group-এ যদি সব পয়েন্ট একই ক্লাসের হয়, Gini = 0 (একদম pure)। Group-এ যদি দুই ক্লাসই সমান সমান মিশে থাকে, Gini সবচেয়ে বেশি (0.5)। যে split সবচেয়ে বেশি Gini কমায় (দুই ভাগকে সবচেয়ে বেশি pure করে), সেটাই বেছে নেওয়া হয়।",
      },
      {
        heading: "কেন Decision Tree-র সীমানা আয়তক্ষেত্রাকার (rectangular)",
        body:
          "প্রতিটা split শুধু একটা feature-এর উপর ভিত্তি করে হয় (যেমন শুধু x, অথবা শুধু y) — কখনো দুইটা একসাথে না। এই কারণে Decision Tree-র decision boundary সবসময় axis-aligned rectangle-এর মতো দেখতে হয় — কখনো তির্যক (diagonal) রেখা তৈরি করতে পারে না। এই demo-তে যে XOR-এর মতো প্যাটার্ন দেখছো (এক কোণায় এক ক্লাস, বিপরীত কোণায় একই ক্লাস), সেটা একটামাত্র সরল রেখা দিয়ে (Logistic Regression-এর মতো) আলাদা করা অসম্ভব — কিন্তু কয়েকটা আয়তক্ষেত্রাকার split দিয়ে Decision Tree সহজেই এটা সমাধান করতে পারে।",
      },
      {
        heading: "Max Depth কেন গুরুত্বপূর্ণ",
        body:
          "তত্ত্বগতভাবে, একটা Decision Tree প্রতিটা single ডেটা পয়েন্টকে আলাদা করে ফেলা পর্যন্ত split করতে পারে (perfectly pure leaves)। কিন্তু এটা করলে মডেল training ডেটার প্রতিটা খুঁটিনাটি, এমনকি noise-ও মুখস্থ করে ফেলে — এটাই Overfitting-এর একটা ক্লাসিক উদাহরণ (মনে আছে সেই Concepts-এর demo?)। Max Depth সীমা বেঁধে দিয়ে গাছকে খুব বেশি জটিল হতে বাধা দেওয়া হয়, যাতে এটা শুধু গুরুত্বপূর্ণ প্যাটার্নগুলোই ধরে, noise না।",
      },
      {
        heading: "Advantages ও Disadvantages",
        body:
          "সুবিধা: সহজে বোঝা যায় ও ব্যাখ্যা করা যায় (একটা tree diagram দেখেই বোঝা যায় কেন এই সিদ্ধান্ত), numerical ও categorical দুই ধরনের ডেটাতেই কাজ করে, ডেটা normalize/scale করার দরকার হয় না। অসুবিধা: সহজেই Overfit করে ফেলে (তাই Max Depth-এর মতো সীমা দরকার হয়), ডেটার সামান্য পরিবর্তনেও সম্পূর্ণ ভিন্ন গাছ তৈরি হতে পারে (high variance)।",
      },
      {
        heading: "বাস্তবে কোথায় ব্যবহার হয়",
        body:
          "Loan Approval (ব্যাংক কেন একটা loan অনুমোদন/প্রত্যাখ্যান করলো তা ব্যাখ্যা করা সহজ), Medical Diagnosis Systems, Customer Segmentation। এছাড়া Decision Tree হলো Random Forest-এর মতো আরও শক্তিশালী algorithm-এর ভিত্তি — যেখানে অনেকগুলো আলাদা আলাদা Decision Tree একসাথে কাজ করে আরও নির্ভরযোগ্য prediction দেয়।",
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
        heading: "মূল ধারণা — সঙ্গ দেখে পরিচয়",
        body:
          "KNN-এর পেছনের ধারণা অসম্ভব সহজ: 'তুমি কে, তা তোমার আশেপাশের মানুষ দেখেই বোঝা যায়'। একটা নতুন, অচেনা ডেটা পয়েন্টের ক্লাস বের করতে, KNN তার সবচেয়ে কাছের K-টা training পয়েন্ট খুঁজে বের করে, তারপর তাদের মধ্যে যে ক্লাস সংখ্যাগরিষ্ঠ (majority), সেটাই নতুন পয়েন্টের ক্লাস হিসেবে দিয়ে দেয়।",
      },
      {
        heading: "এই Demo-তে যা হচ্ছে",
        body:
          "চার্টে যেখানেই ক্লিক করো, সেটাই হয়ে যায় 'query point' (ধূসর বৃত্ত)। মডেল তখন তার সবচেয়ে কাছের K-টা training পয়েন্ট খুঁজে বের করে (dashed লাইন দিয়ে সংযুক্ত দেখানো হচ্ছে), আর ডানপাশের লিস্টে দেখতে পাচ্ছো ঠিক কোন কোন পয়েন্ট 'ভোট' দিচ্ছে। যে ক্লাস সবচেয়ে বেশি ভোট পায়, query point-টা সেই ক্লাসের রঙেই রঙিন হয়ে যায়।",
      },
      {
        heading: "Distance কীভাবে মাপা হয়?",
        body:
          "এখানে সবচেয়ে প্রচলিত পদ্ধতি ব্যবহার করা হয়েছে — Euclidean Distance, অর্থাৎ দুইটা বিন্দুর মধ্যে সরলরৈখিক (straight-line) দূরত্ব: √((x₁-x₂)² + (y₁-y₂)²)। বাস্তবে আরও কিছু distance measure আছে (Manhattan Distance, Cosine Similarity), যেগুলো ভিন্ন ভিন্ন ধরনের ডেটাতে বেশি উপযোগী হতে পারে।",
      },
      {
        heading: "কেন এটাকে 'Lazy Learning' বলা হয়",
        body:
          "Linear Regression বা Decision Tree-এর মতো algorithm আগে থেকে ডেটা 'শিখে' একটা মডেল (weight/tree) তৈরি করে রাখে, তারপর সেই মডেল দিয়ে দ্রুত prediction দেয়। KNN আলাদা — এটা কোনো advance শেখা তৈরি করে না, বরং পুরো training dataset নিজের কাছে জমা রাখে, আর prediction করার সময়ই তখন distance হিসাব করে। তাই একে বলা হয় 'Lazy Learner' — আসল কাজ prediction-এর সময় হয়, আগে থেকে না।",
      },
      {
        heading: "সীমাবদ্ধতা — বড় ডেটাসেটে ধীর",
        body:
          "যেহেতু প্রতিটা নতুন prediction-এর জন্য পুরো training dataset-এর সাথে distance হিসাব করতে হয়, dataset বড় হলে (লক্ষ লক্ষ পয়েন্ট) KNN ধীর হয়ে যায়। এছাড়া KNN feature-এর স্কেলের প্রতি sensitive — যদি একটা feature-এর মান আরেকটার চেয়ে অনেক বড় রেঞ্জে থাকে (যেমন 'বয়স' 0-100, আর 'আয়' 0-1000000), তাহলে distance calculation-এ বড় রেঞ্জের feature-টাই প্রাধান্য পেয়ে যায় — তাই ব্যবহারের আগে ডেটা normalize/scale করা জরুরি।",
      },
      {
        heading: "বাস্তবে কোথায় ব্যবহার হয়",
        body:
          "Recommendation Systems (তোমার মতো পছন্দের ইউজাররা আর কী পছন্দ করেছে), Image Recognition-এর প্রাথমিক পদ্ধতি, Anomaly Detection (আশেপাশে কেউ না থাকলে সেটাই outlier)। এছাড়া, এটা এমন একটা algorithm, যেটা দিয়ে নতুন কোনো সমস্যায় দ্রুত একটা baseline (তুলনার জন্য প্রাথমিক মান) তৈরি করা যায়, কারণ implement করা খুবই সহজ।",
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
        heading: "Unsupervised মানে কী — এই প্রথম আলাদা রকম",
        body:
          "এতক্ষণ যে algorithm-গুলো দেখেছো (Linear Regression, Logistic Regression, Decision Tree, KNN), সব কয়টাই 'Supervised' — মানে ট্রেইনিং ডেটার প্রতিটা পয়েন্টের সাথে একটা সঠিক উত্তর (label) দেওয়া ছিল। K-Means সম্পূর্ণ ভিন্ন — এখানে কোনো label নেই, শুধু কতগুলো পয়েন্ট আছে, আর algorithm-কে নিজে থেকেই বের করতে হয় এদের মধ্যে কী রকম স্বাভাবিক গোষ্ঠী (grouping) আছে।",
      },
      {
        heading: "মূল প্রক্রিয়া — দুইটা ধাপের বারবার পুনরাবৃত্তি",
        body:
          "K-Means-এ দুইটা ধাপ বারবার পুনরাবৃত্তি হয়, যতক্ষণ না ফলাফল স্থির হয়ে যায়। ধাপ ১ (Assign): প্রতিটা ডেটা পয়েন্টকে তার সবচেয়ে কাছের centroid-এর cluster-এ বসিয়ে দেওয়া হয়। ধাপ ২ (Update): প্রতিটা cluster-এর centroid-কে তার বর্তমান সব সদস্য পয়েন্টের গড় (average) অবস্থানে সরিয়ে নেওয়া হয়। এই দুই ধাপ বারবার চলতে থাকে — প্রতিবার centroid একটু একটু করে সঠিক জায়গায় সরে যায়, যতক্ষণ না আর কোনো পয়েন্ট cluster বদলাচ্ছে না (Convergence)।",
      },
      {
        heading: "K কীভাবে বেছে নেওয়া হয়?",
        body:
          "K হলো তুমি কতগুলো cluster চাও তার সংখ্যা — এটা algorithm নিজে বের করে না, তোমাকেই আগে থেকে বলে দিতে হয়। বাস্তবে সঠিক K বের করতে 'Elbow Method' ব্যবহার করা হয় — বিভিন্ন K দিয়ে চালিয়ে, প্রতিটা cluster-এর ভেতরের মোট distance (Inertia) মাপা হয়। এই মান K বাড়ালে কমতেই থাকে, কিন্তু একটা জায়গার পর কমার হার হঠাৎ কমে যায় (গ্রাফে একটা 'কনুই' বা elbow-এর মতো বাঁক তৈরি হয়) — সেই বিন্দুটাই সাধারণত সবচেয়ে ভালো K।",
      },
      {
        heading: "কেন শুরুর বিন্দু (Initialization) গুরুত্বপূর্ণ",
        body:
          "K-Means-এর centroid শুরুতে কোথায় বসানো হবে, সেটার উপর চূড়ান্ত ফলাফল নির্ভর করতে পারে — এই algorithm সবসময় একই (global) সেরা সমাধান খুঁজে বের করার নিশ্চয়তা দেয় না, বরং কাছাকাছি একটা ভালো সমাধানে (local optimum) আটকে যেতে পারে। এই কারণে বাস্তবে প্রায়ই 'K-Means++' নামের একটা স্মার্ট initialization পদ্ধতি ব্যবহার হয় (এই demo-তেও সেটাই ব্যবহার করা হয়েছে), যেটা শুরুর centroid গুলোকে ইচ্ছাকৃতভাবে একে অপরের থেকে দূরে দূরে বসায়, ফলে ফলাফল বেশি স্থিতিশীল হয়। তবুও, Reset বাটনে ক্লিক করে ভিন্ন শুরু-বিন্দু try করলে মাঝেমধ্যে সামান্য ভিন্ন ফলাফল দেখতে পাবে।",
      },
      {
        heading: "সীমাবদ্ধতা",
        body:
          "K-Means ধরে নেয় cluster-গুলো মোটামুটি গোলাকার (spherical) এবং প্রায় সমান আকারের — যদি বাস্তব ডেটায় cluster-গুলো লম্বাটে, অসম আকৃতির, বা ঘনত্বে ভিন্ন হয়, K-Means ভুল গ্রুপিং করতে পারে। এছাড়া, আগে থেকে K বলে দিতে হয় — কতগুলো natural cluster আছে সেটা algorithm নিজে বুঝতে পারে না।",
      },
      {
        heading: "বাস্তবে কোথায় ব্যবহার হয়",
        body:
          "Customer Segmentation (কেনাকাটার ধরন অনুযায়ী গ্রাহকদের গ্রুপ করা, মার্কেটিং-এর জন্য), Image Compression (একটা ছবির রঙগুলোকে কয়েকটা প্রধান রঙে ভাগ করা), Document/News Clustering (একই বিষয়ের লেখা একসাথে গ্রুপ করা), Anomaly Detection (কোনো cluster-এর অনেক দূরে থাকা পয়েন্ট সন্দেহজনক হতে পারে)।",
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
        heading: "Bayes' Theorem — সম্ভাব্যতাকে হালনাগাদ করার সূত্র",
        body:
          "Naive Bayes-এর ভিত্তি হলো Bayes' Theorem, একটা গাণিতিক সূত্র যা বলে দেয় নতুন প্রমাণ (evidence) দেখে আমরা কীভাবে আমাদের বিশ্বাস (belief) আপডেট করব। এখানে: P(Spam | শব্দগুলো) ∝ P(শব্দগুলো | Spam) × P(Spam)। অর্থাৎ, একটা মেসেজে নির্দিষ্ট কিছু শব্দ দেখে সেটা spam হওয়ার সম্ভাবনা বের করতে, আমরা দেখি — spam মেসেজে এই শব্দগুলো কতটা সাধারণ, আর সাধারণভাবেই (prior) কতগুলো মেসেজ spam হয়।",
      },
      {
        heading: "কেন এটাকে 'Naive' (সরলমনা) বলা হয়",
        body:
          "Naive Bayes একটা সরলীকৃত ধারণা করে নেয় — প্রতিটা feature (এখানে, প্রতিটা শব্দের উপস্থিতি) একে অপরের থেকে সম্পূর্ণ স্বাধীন (independent)। বাস্তবে এটা পুরোপুরি সত্যি না — যেমন 'free' আর 'click' শব্দ দুটো প্রায়ই একসাথে আসে, তাই তারা প্রকৃতপক্ষে সম্পূর্ণ independent না। এই সরলীকরণটাই এর নামের 'Naive' (নির্বোধ/সরলমনা) অংশ — অথচ আশ্চর্যজনকভাবে, এই সরলীকরণ সত্ত্বেও Naive Bayes বাস্তবে চমৎকার কাজ করে, বিশেষ করে টেক্সট classification-এ।",
      },
      {
        heading: "কেন প্রতিটা Probability গুণ (multiply) করা হয়",
        body:
          "যেহেতু আমরা ধরে নিচ্ছি শব্দগুলো independent, তাই একাধিক শব্দ একসাথে দেখার (joint) probability বের করতে শুধু প্রতিটা শব্দের individual probability গুণ করে দিলেই হয় — P(word1 AND word2 | spam) = P(word1|spam) × P(word2|spam)। এই demo-তে ঠিক এটাই হচ্ছে: তুমি যে শব্দগুলো বেছে নিচ্ছো (এবং যেগুলো বেছে নিচ্ছো না, সেগুলোরও 'না থাকার' probability), সবগুলো একসাথে গুণ হয়ে চূড়ান্ত স্কোর তৈরি করছে।",
      },
      {
        heading: "Laplace Smoothing কেন দরকার",
        body:
          "সমস্যা হলো, যদি কোনো শব্দ ট্রেইনিং ডেটায় কখনো spam মেসেজে না দেখা যায়, তাহলে তার probability হয়ে যাবে ঠিক শূন্য (0) — আর গুণের নিয়মে, একটা শূন্য পুরো ফলাফলকেই শূন্য বানিয়ে দেয়, তখন সেই শব্দ যতই গুরুত্বপূর্ণ হোক না কেন, বাকি সব প্রমাণ উপেক্ষিত হয়ে যায়। এই সমস্যা এড়াতে Laplace (Add-1) Smoothing ব্যবহার করা হয় — প্রতিটা গণনার সাথে কৃত্রিমভাবে +1 যোগ করে দেওয়া হয়, যাতে কোনো probability কখনো একদম শূন্য না হয়ে যায়।",
      },
      {
        heading: "Prior Probability-র ভূমিকা",
        body:
          "Prior হলো, কোনো শব্দ না দেখেই, শুধু সাধারণ পরিসংখ্যান দিয়ে অনুমান — যেমন, সব মেসেজের মধ্যে গড়ে কত শতাংশ আসলে spam। এই demo-তে prior হলো P(spam) = 0.5 (৭টা spam, ৭টা normal মেসেজ দিয়ে ট্রেইন করা হয়েছে)। বাস্তবে prior গুরুত্বপূর্ণ ভূমিকা রাখে — যদি বাস্তবে ৯৯% মেসেজই normal হয়, সেই তথ্যও মডেলের সিদ্ধান্তে যুক্ত হয়।",
      },
      {
        heading: "বাস্তবে কোথায় ব্যবহার হয়",
        body:
          "Email Spam Filtering (ঠিক এই demo-র মতোই, বাস্তব spam filter-এর মূল ভিত্তি), Sentiment Analysis (একটা রিভিউ পজিটিভ না নেগেটিভ), Document Categorization (একটা খবর কোন বিভাগে পড়ে — খেলা, রাজনীতি, বিনোদন)। এটা দ্রুত, সহজে implement করা যায়, এবং টেক্সট-ভিত্তিক সমস্যায় (অনেক feature/শব্দ থাকা সত্ত্বেও) আশ্চর্যজনকভাবে ভালো কাজ করে বলে আজও ব্যাপকভাবে ব্যবহৃত হয়।",
      },
    ],
  },
];