import {
  TrendingDown,
  GitCompare,
  Scale,
  SplitSquareHorizontal,
  Grid3x3,
  Target,
  type LucideIcon,
} from "lucide-react";

export interface NoteSection {
  heading: string;
  body: string;
}

export interface Concept {
  slug: string;
  title: string;
  shortDescription: string;
  icon: LucideIcon;
  gradient: string;
  notes: NoteSection[];
}

export const concepts: Concept[] = [
  {
    slug: "gradient-descent",
    title: "Gradient Descent",
    shortDescription:
      "Set a learning rate and a starting point, then watch loss roll downhill step by step.",
    icon: TrendingDown,
    gradient: "from-indigo-500 to-blue-500",
    notes: [
      {
        heading: "এটা আসলে কী সমস্যা সমাধান করে?",
        body:
          "যেকোনো ML মডেল ট্রেইন করার মূল লক্ষ্য হলো এমন কিছু প্যারামিটার (weight) খুঁজে বের করা, যেগুলো দিয়ে prediction-এর error (loss) সবচেয়ে কম হয়। কিন্তু সমস্যা হলো, ভালো weight কী হবে সেটা সরাসরি একবারে বের করার কোনো সহজ উপায় নেই — বিশেষ করে জটিল মডেলে। Gradient Descent হলো সেই পদ্ধতি, যেটা দিয়ে ধাপে ধাপে, বারবার একটু একটু করে, সঠিক weight-এর দিকে এগিয়ে যাওয়া যায়।",
      },
      {
        heading: "একটা সহজ উপমা দিয়ে বোঝা যাক",
        body:
          "ধরো তুমি একটা কুয়াশাচ্ছন্ন পাহাড়ে দাঁড়িয়ে আছো, চোখে কিছু দেখা যাচ্ছে না, শুধু পায়ের নিচের মাটির ঢাল অনুভব করতে পারছো। তোমাকে সবচেয়ে নিচু জায়গায় (উপত্যকায়, যেখানে loss সবচেয়ে কম) পৌঁছাতে হবে। প্রতি মুহূর্তে তুমি অনুভব করো কোন দিকে জমি সবচেয়ে বেশি ঢালু হয়ে নামছে, আর সেদিকে একধাপ এগোও। এভাবে বারবার করতে করতে একসময় তুমি উপত্যকার কাছাকাছি পৌঁছে যাও। এই 'ঢাল অনুভব করা' জিনিসটাই হলো Gradient (derivative) — আর 'একধাপ এগোনো'টাই descent step।",
      },
      {
        heading: "গাণিতিক Formula",
        body:
          "x_new = x_old − learning_rate × gradient(x_old)। এখানে gradient(x) হলো loss function-এর ঐ বিন্দুতে derivative — অর্থাৎ, x একটু বাড়ালে loss কতটা বাড়ে বা কমে সেটার measurement। Gradient পজিটিভ হলে (loss বাড়ছে) আমরা x কমাই; gradient নেগেটিভ হলে x বাড়াই — এভাবেই সবসময় loss কমার দিকেই এগোনো হয়।",
      },
      {
        heading: "Learning Rate কেন এত গুরুত্বপূর্ণ?",
        body:
          "Learning Rate ঠিক করে দেয় প্রতিটা ধাপে তুমি কতটা বড় লাফ দেবে। এটা খুব ছোট (যেমন 0.01) হলে মডেল ঠিকঠাক শিখবে ঠিকই, কিন্তু অনেক ধাপ লাগবে, ধীরে চলবে। এটা খুব বড় (যেমন 1.5) হলে তুমি উপত্যকা পার হয়ে উল্টো দিকে চলে যেতে পারো, এমনকি প্রতিবার আরও উঁচুতে উঠে যেতে পারো — একে বলে Divergence, যেখানে loss কমার বদলে বাড়তেই থাকে। তাই সঠিক learning rate বেছে নেওয়া (খুব ছোটও না, খুব বড়ও না) practical ML-এর একটা বড় অংশ।",
      },
      {
        heading: "কীভাবে বুঝবে মডেল 'শিখে ফেলেছে' (Convergence)?",
        body:
          "যখন gradient প্রায় শূন্যের কাছাকাছি চলে আসে (মানে ঢাল প্রায় সমতল), তখন বোঝা যায় তুমি একটা minimum-এর কাছাকাছি পৌঁছে গেছো — আর x তেমন একটা বদলাচ্ছে না। এটাকেই বলে Convergence। ভালো training-এ loss ধীরে ধীরে কমতে কমতে একটা জায়গায় স্থির হয়ে যায়।",
      },
      {
        heading: "বাস্তবে কোথায় ব্যবহার হয়?",
        body:
          "Gradient Descent প্রায় প্রতিটা modern ML/Deep Learning মডেলের হৃদয়ে বসে আছে — Linear Regression, Logistic Regression থেকে শুরু করে বিশাল বিশাল Neural Network পর্যন্ত সবাই ভেতরে ভেতরে এই একই মূলনীতি ব্যবহার করে, তবে উন্নত ভার্সনে (যেমন SGD, Adam, RMSProp) — যেগুলো মূলত এই একই আইডিয়ার উপর বাড়তি optimization বসায়।",
      },
      {
        heading: "সাধারণ ভুল যেগুলো এড়ানো উচিত",
        body:
          "১) Learning rate অনেক বড় রেখে training শুরু করা — এতে loss কমার বদলে বাড়তে থাকে বা লাফালাফি করে। ২) Learning rate অনেক ছোট রেখে অল্প কিছু step-এই training থামিয়ে দেওয়া — মডেল তখনো ঠিকমতো শেখেইনি। ৩) সব ডেটাসেটে একই learning rate কাজ করবে ভেবে নেওয়া — বাস্তবে এটা experiment করে বের করতে হয়, বা learning rate scheduler ব্যবহার করা হয় যেটা ধীরে ধীরে rate কমায়।",
      },
    ],
  },
  {
    slug: "overfitting-underfitting",
    title: "Overfitting vs Underfitting",
    shortDescription:
      "Change the polynomial degree and see a curve go from too simple to memorizing noise.",
    icon: GitCompare,
    gradient: "from-blue-500 to-cyan-500",
    notes: [
      {
        heading: "মূল সমস্যাটা কী?",
        body:
          "একটা মডেল ট্রেইন করার সময় লক্ষ্য শুধু ট্রেইনিং ডেটাতে ভালো করা না — আসল লক্ষ্য হলো, নতুন, আগে না দেখা ডেটাতেও ভালো prediction দেওয়া (একে বলে generalization)। Underfitting আর Overfitting হলো এই লক্ষ্য থেকে বিচ্যুত হওয়ার দুইটা বিপরীত উপায়।",
      },
      {
        heading: "Underfitting — মডেল খুব সাধারণ (simple)",
        body:
          "যখন মডেল এতটাই সরল যে ডেটার আসল প্যাটার্নটাই ধরতে পারে না, তখন তাকে বলে underfitting। যেমন, যদি ডেটাতে একটা বাঁকানো (curved) সম্পর্ক থাকে, কিন্তু তুমি সেটা একটা সরল রেখা (straight line, polynomial degree 1) দিয়ে fit করার চেষ্টা করো — তাহলে ট্রেইন ডেটাতেও ভালো prediction দিতে পারবে না, টেস্ট ডেটাতেও না। দুই জায়গাতেই error বেশি থাকবে।",
      },
      {
        heading: "Overfitting — মডেল খুব জটিল (complex)",
        body:
          "যখন মডেল এতটাই জটিল (উদাহরণস্বরূপ, খুব উঁচু polynomial degree) যে সে শুধু আসল প্যাটার্ন না, বরং ডেটার random noise-টাও মুখস্থ করে ফেলে, তখন তাকে বলে overfitting। এতে ট্রেইন ডেটাতে error প্রায় শূন্যের কাছাকাছি চলে যায় (কারণ মডেল প্রতিটা বিন্দু দিয়ে জোর করে curve পার করিয়ে দিয়েছে), কিন্তু নতুন (টেস্ট) ডেটাতে গিয়ে ভয়াবহ খারাপ prediction দেয় — কারণ noise থেকে শেখা প্যাটার্ন বাস্তবে কোনো অর্থ বহন করে না।",
      },
      {
        heading: "কীভাবে চিনবে — Train Error বনাম Test Error",
        body:
          "এই দুটো error-এর তুলনা করেই overfitting/underfitting ধরা পড়ে। Train error আর test error দুটোই বেশি হলে → underfitting (মডেল কিছুই ঠিকমতো শেখেনি)। Train error অনেক কম কিন্তু test error অনেক বেশি হলে → overfitting (মডেল ডেটা মুখস্থ করেছে, শেখেনি)। দুটো error-ই কাছাকাছি এবং যুক্তিসঙ্গতভাবে কম হলে → এটাই ভালো ফিট (good fit), যেটা আমরা চাই।",
      },
      {
        heading: "Polynomial Degree কীভাবে এটা প্রভাবিত করে",
        body:
          "Polynomial Degree হলো মডেলের 'জটিলতা' নিয়ন্ত্রণ করার একটা সহজ উপায়। Degree 1 মানে সরল রেখা (খুবই সীমিত)। Degree বাড়ালে curve আরও বেশি বাঁক নিতে পারে, ডেটার আরও সূক্ষ্ম প্যাটার্ন ধরতে পারে — কিন্তু একটা সীমার পর সেটা প্যাটার্নের বদলে random noise ধরতে শুরু করে।",
      },
      {
        heading: "বাস্তবে এটা কীভাবে সামলানো হয়?",
        body:
          "কয়েকটা common টেকনিক আছে: (১) Regularization — মডেলকে অতিরিক্ত জটিল হতে 'শাস্তি' দেওয়া (যেমন Ridge, Lasso)। (২) বেশি ডেটা জোগাড় করা — বেশি ডেটা থাকলে noise মুখস্থ করা কঠিন হয়ে যায়। (৩) Cross-validation — শুধু একটা train/test split না করে বারবার আলাদা split-এ পরীক্ষা করে দেখা মডেল সত্যিই generalize করছে কিনা। (৪) Early stopping — Neural Network-এ, test error বাড়তে শুরু করলেই training থামিয়ে দেওয়া।",
      },
    ],
  },
  {
    slug: "bias-variance",
    title: "Bias-Variance Tradeoff",
    shortDescription:
      "Drag model complexity and watch bias and variance pull the error in opposite directions.",
    icon: Scale,
    gradient: "from-cyan-500 to-teal-500",
    notes: [
      {
        heading: "Bias আর Variance আসলে কী?",
        body:
          "একটা মডেলের total error-কে দুইটা মূল অংশে ভাগ করা যায়: Bias আর Variance। Bias হলো মডেল কতটা systematically ভুল করছে। Variance হলো মডেল ডেটার ছোটখাটো বদলে কতটা আলাদা আচরণ করে।",
      },
      {
        heading: "High Bias — খুব সরল মডেল",
        body:
          "একটা মডেল যদি খুব সরল হয়, তাহলে সেটার bias বেশি হবে — সে বারবার একই ভুল করবে, কারণ সে গঠনগতভাবেই সঠিক প্যাটার্ন ধরতে অক্ষম। এটা underfitting-এর সাথে সরাসরি সম্পর্কিত।",
      },
      {
        heading: "High Variance — খুব জটিল মডেল",
        body:
          "একটা মডেল যদি খুব জটিল হয়, তাহলে সেটা ট্রেইনিং ডেটার প্রতিটা খুঁটিনাটি (noise সহ) ধরে ফেলে। dataset একটু বদলালেই মডেলের prediction অনেক বদলে যায় — এটাই high variance, overfitting-এর সাথে সম্পর্কিত।",
      },
      {
        heading: "Tradeoff কেন অনিবার্য?",
        body:
          "Bias কমাতে গেলে সাধারণত variance বেড়ে যায়। আবার variance কমাতে গেলে bias বেড়ে যায়। ML practitioner-দের কাজ হলো এমন একটা sweet spot খুঁজে বের করা, যেখানে দুটোর সম্মিলিত effect (total error) সবচেয়ে কম হয়।",
      },
      {
        heading: "গাণিতিকভাবে কীভাবে ভাঙা যায়",
        body:
          "Total Error = Bias² + Variance + Irreducible Noise। Irreducible Noise কোনো মডেল দিয়েই দূর করা যায় না। বাকি দুটো অংশ, Bias² আর Variance — এদের মধ্যে ভারসাম্য রাখাই মূল চ্যালেঞ্জ।",
      },
      {
        heading: "Demo-তে কী দেখছো",
        body:
          "উপরের চার্টে একই সমস্যার ৬টা ভিন্ন dataset দিয়ে ফিট করা মডেল দেখানো হয়েছে — এদের ছড়িয়ে থাকাটাই variance। নিচের চার্টে Complexity বাড়লে Bias² কমছে কিন্তু Variance বাড়ছে — Total Error-এর সবচেয়ে নিচু বিন্দুটাই সেরা জটিলতা নির্দেশ করে।",
      },
    ],
  },
  {
    slug: "train-test-split",
    title: "Train-Test Split",
    shortDescription:
      "Change the split ratio and see how much it shifts your model's real accuracy.",
    icon: SplitSquareHorizontal,
    gradient: "from-purple-500 to-indigo-500",
    notes: [
      {
        heading: "শীঘ্রই আসছে",
        body: "এই concept-এর বিস্তারিত notes পরের ধাপে যোগ করা হবে।",
      },
    ],
  },
  {
    slug: "confusion-matrix",
    title: "Confusion Matrix",
    shortDescription:
      "Fill in TP, FP, TN, FN yourself and watch precision, recall, and F1 calculate live.",
    icon: Grid3x3,
    gradient: "from-fuchsia-500 to-purple-500",
    notes: [
      {
        heading: "Confusion Matrix আসলে কী?",
        body:
          "যখন একটা মডেল Classification করে (যেমন, স্প্যাম/না-স্প্যাম, রোগী/সুস্থ), তখন শুধু 'কত পার্সেন্ট সঠিক' এটা জানাই যথেষ্ট না। Confusion Matrix হলো একটা টেবিল, যেটা দেখায় মডেল ঠিক কোন ধরনের ভুল করছে — সেটা ৪ ভাগে ভাগ করে: True Positive, True Negative, False Positive, False Negative।",
      },
      {
        heading: "চারটা ভাগের মানে",
        body:
          "True Positive (TP): মডেল বলেছে 'Positive', আসলেও Positive — সঠিক। True Negative (TN): মডেল বলেছে 'Negative', আসলেও Negative — সঠিক। False Positive (FP): মডেল বলেছে 'Positive', কিন্তু আসলে Negative — ভুল অ্যালার্ম (Type I Error)। False Negative (FN): মডেল বলেছে 'Negative', কিন্তু আসলে Positive — মিস করে ফেলেছে (Type II Error)।",
      },
      {
        heading: "Accuracy কেন যথেষ্ট না",
        body:
          "Accuracy = (TP + TN) / মোট sample — এটা শুধু 'কতটা ঠিক বলেছে' মাপে। কিন্তু ডেটা imbalanced হলে (যেমন ১০০ জনের মধ্যে মাত্র ২ জন আসলেই রোগী), একটা মডেল সবাইকে 'সুস্থ' বলে দিলেও 98% accuracy পেয়ে যাবে — অথচ এটা একটাও রোগী ধরতে পারেনি। এই কারণেই Precision আর Recall-এর দরকার হয়, যেগুলো TP/FP/FN-কে আলাদাভাবে বিবেচনা করে।",
      },
      {
        heading: "Precision — 'যা Positive বলেছি তার মধ্যে কতটা সত্যি'",
        body:
          "Precision = TP / (TP + FP)। এটা মাপে, মডেল যতগুলো prediction-কে 'Positive' বলেছে, তার মধ্যে আসলে কতগুলো সত্যিই Positive। High Precision দরকার হয় যখন False Positive-এর মূল্য বেশি — যেমন স্প্যাম ফিল্টারে, একটা গুরুত্বপূর্ণ মেইলকে ভুলবশত স্প্যাম বলা মারাত্মক ক্ষতিকর।",
      },
      {
        heading: "Recall — 'আসল সব Positive-এর মধ্যে কতটা ধরতে পেরেছি'",
        body:
          "Recall = TP / (TP + FN)। এটা মাপে, বাস্তবে যতগুলো সত্যিকারের Positive case ছিল, তার মধ্যে মডেল কতগুলো ধরতে পেরেছে। High Recall দরকার হয় যখন False Negative-এর মূল্য বেশি — যেমন রোগ নির্ণয়ে, একজন প্রকৃত রোগীকে 'সুস্থ' বলে miss করে ফেলা প্রাণঘাতী হতে পারে।",
      },
      {
        heading: "F1-Score — Precision আর Recall-এর ভারসাম্য",
        body:
          "F1-Score = 2 × (Precision × Recall) / (Precision + Recall) — এটা Precision আর Recall-এর harmonic mean। যখন তুমি একটা single সংখ্যা দিয়ে মডেলের সামগ্রিক performance বুঝতে চাও (Precision, Recall দুটোই গুরুত্বপূর্ণ, কোনো একটাকে অগ্রাধিকার না দিয়ে), তখন F1-Score ব্যবহার করা হয়। এটা তখনই বেশি হয়, যখন Precision আর Recall দুটোই ভালো থাকে — একটা খুব ভালো, আরেকটা খুব খারাপ হলে F1 কমই থাকবে।",
      },
      {
        heading: "কোনটা কখন গুরুত্বপূর্ণ — বাস্তব উদাহরণ",
        body:
          "Presets-এ দেওয়া উদাহরণগুলো লক্ষ্য করো: স্প্যাম ফিল্টারে FP কমানো জরুরি (Precision priority), রোগ নির্ণয়ে FN কমানো জরুরি (Recall priority)। কোনো একটা 'সঠিক' metric নেই — বরং সমস্যার প্রকৃতি অনুযায়ী ঠিক করতে হয় কোন ভুলের মূল্য বেশি, তারপর সেই অনুযায়ী মডেল টিউন করা হয়।",
      },
    ],
  },
  {
    slug: "knn-k-value",
    title: "K Value in KNN",
    shortDescription:
      "Slide K up and down and watch a decision boundary redraw itself in real time.",
    icon: Target,
    gradient: "from-pink-500 to-fuchsia-500",
    notes: [
      {
        heading: "KNN আসলে কীভাবে কাজ করে",
        body:
          "K-Nearest Neighbors (KNN) হলো Machine Learning-এর সবচেয়ে সহজ, সবচেয়ে স্বজ্ঞাত (intuitive) algorithm-গুলোর একটা। এর পেছনের ধারণা: 'তুমি কে সেটা তোমার আশেপাশের মানুষ দেখেই বোঝা যায়।' একটা নতুন বিন্দুর ক্লাস বের করতে, KNN সেই বিন্দুর সবচেয়ে কাছের K-টা training point খুঁজে বের করে, তারপর তাদের মধ্যে যে ক্লাস সবচেয়ে বেশি (majority vote), সেটাই নতুন বিন্দুর ক্লাস হিসেবে দিয়ে দেয়।",
      },
      {
        heading: "এখানে কোনো 'Training' নেই",
        body:
          "বেশিরভাগ ML মডেল (যেমন Linear Regression) আগে থেকে ডেটা দেখে কিছু প্যারামিটার/weight শিখে রাখে। KNN সেটা করে না — এটা পুরো training dataset নিজের কাছে জমা রাখে, আর prediction করার সময়ই তখন তখন distance হিসাব করে। এই কারণে একে বলে 'Lazy Learning' — শেখার কাজটা prediction-এর সময় হয়, আগে থেকে না।",
      },
      {
        heading: "K কীভাবে Decision Boundary বদলায়",
        body:
          "K হলো KNN-এর সবচেয়ে গুরুত্বপূর্ণ hyperparameter। K = 1 রাখলে, একটা নতুন বিন্দুর ক্লাস নির্ধারণ হয় শুধুমাত্র তার সবচেয়ে কাছের একটা বিন্দু দেখে — এতে সীমানা (boundary) অনেক খাঁজকাটা, অনিয়মিত হয়ে যায়, কারণ প্রতিটা single outlier-ও সীমানা বদলে দিতে পারে। K বড় করলে (যেমন 20-30), সিদ্ধান্ত অনেক বেশি প্রতিবেশীর ভোটের উপর নির্ভর করে, তাই সীমানা মসৃণ হয়ে যায় — কিন্তু অতিরিক্ত বড় K ছোট ছোট আসল ক্লাস্টারকেও মুছে দিতে পারে।",
      },
      {
        heading: "এটাও একটা Bias-Variance Tradeoff",
        body:
          "ছোট K = High Variance (ডেটার সামান্য পরিবর্তনেও prediction অনেক বদলে যায়, noise-এর প্রতি sensitive)। বড় K = High Bias (মডেল অতিরিক্ত সরলীকৃত হয়ে যায়, সূক্ষ্ম প্যাটার্ন মিস করে)। ঠিক Overfitting/Underfitting আর Bias-Variance Tradeoff-এর concept দুটোতে যা দেখেছিলে, এখানেও একই মূলনীতি — একটা মাঝামাঝি, ভারসাম্যপূর্ণ K খুঁজে বের করাই লক্ষ্য।",
      },
      {
        heading: "কেন সাধারণত Odd (বিজোড়) K বেছে নেওয়া হয়",
        body:
          "যদি দুইটা ক্লাস থাকে আর K জোড় সংখ্যা হয় (যেমন K=4), তাহলে ভোট 2-2 টাই হয়ে যেতে পারে — কোন ক্লাস জিতবে সেটা অস্পষ্ট থেকে যায়। তাই সাধারণত বিজোড় K (3, 5, 7...) বেছে নেওয়া হয়, যাতে টাই হওয়ার সম্ভাবনা কমে যায় (যদিও ৩টা+ ক্লাস থাকলে টাই তবুও হতে পারে)।",
      },
      {
        heading: "বাস্তবে কোথায় ব্যবহার হয়",
        body:
          "Recommendation System (তোমার মতো user-রা আর কী পছন্দ করেছে), Image Recognition-এর প্রাথমিক পদ্ধতি, Anomaly Detection (কাছাকাছি প্রতিবেশী না থাকলে সেটা outlier), এবং ছোট থেকে মাঝারি সাইজের ডেটাসেটে দ্রুত prototype বানাতে KNN ব্যাপকভাবে ব্যবহৃত হয়। তবে ডেটাসেট অনেক বড় হয়ে গেলে, প্রতিটা prediction-এর জন্য সব ডেটার সাথে distance হিসাব করা ধীর হয়ে যায় — তখন অন্য algorithm বেশি উপযোগী হয়।",
      },
    ],
  },
];