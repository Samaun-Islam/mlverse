export interface PlaygroundDemo {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  basedOn: string;
  inputs: string[];
  gradient: string;
  accent: string;
}

export const playgroundDemos: PlaygroundDemo[] = [
  {
    slug: "house-price",
    title: "House Price Predictor",
    tagline: "আয়তন আর রুম সংখ্যা দাও, দাম বলে দিই",
    description:
      "আয়তন (sq ft), বেডরুম সংখ্যা, আর এলাকা বেছে নাও — একটা real Linear Regression মডেল সাথে সাথে দাম অনুমান করে দেবে, চার্টে তোমার বাড়ির অবস্থানও দেখাবে।",
    basedOn: "Linear Regression",
    inputs: ["Area (sq ft)", "Bedrooms", "Location"],
    gradient: "from-indigo-500 to-blue-500",
    accent: "#818cf8",
  },
  {
    slug: "flower-classifier",
    title: "Flower Species Classifier",
    tagline: "পাপড়ির মাপ দাও, প্রজাতি বলে দিই",
    description:
      "বিখ্যাত Iris dataset ব্যবহার করে, sepal ও petal-এর মাপ দিলে KNN মডেল বলে দেবে এটা কোন প্রজাতির ফুল — কাছের প্রতিবেশী ফুলগুলোও দেখতে পাবে।",
    basedOn: "K-Nearest Neighbors",
    inputs: ["Sepal Length/Width", "Petal Length/Width"],
    gradient: "from-fuchsia-500 to-purple-500",
    accent: "#e879f9",
  },
  {
    slug: "pass-fail",
    title: "Student Pass/Fail Predictor",
    tagline: "পড়াশোনার সময় দাও, ফলাফল বলে দিই",
    description:
      "পড়াশোনার ঘন্টা আর উপস্থিতি % দিলে Logistic Regression মডেল বলে দেবে পাস করার সম্ভাবনা কত শতাংশ — আর ঠিক কোথায় দাঁড়িয়ে আছো সেটাও sigmoid curve-এ দেখাবে।",
    basedOn: "Logistic Regression",
    inputs: ["Study Hours", "Attendance %"],
    gradient: "from-emerald-500 to-teal-500",
    accent: "#34d399",
  },
];