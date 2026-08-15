export interface TrainingMessage {
  words: string[];
  isSpam: boolean;
}

// একটা ছোট, fixed training dataset — বাস্তবসম্মত স্প্যাম/না-স্প্যাম মেসেজের উদাহরণ
export const trainingMessages: TrainingMessage[] = [
  { words: ["free", "win", "prize", "click"], isSpam: true },
  { words: ["free", "money", "now", "click"], isSpam: true },
  { words: ["win", "lottery", "claim", "urgent"], isSpam: true },
  { words: ["free", "offer", "limited", "click"], isSpam: true },
  { words: ["urgent", "win", "cash", "now"], isSpam: true },
  { words: ["click", "link", "free", "gift"], isSpam: true },
  { words: ["prize", "winner", "claim", "now"], isSpam: true },
  { words: ["meeting", "tomorrow", "schedule"], isSpam: false },
  { words: ["project", "update", "team"], isSpam: false },
  { words: ["lunch", "tomorrow", "free"], isSpam: false },
  { words: ["report", "attached", "review"], isSpam: false },
  { words: ["thanks", "meeting", "schedule"], isSpam: false },
  { words: ["project", "deadline", "update"], isSpam: false },
  { words: ["family", "dinner", "tomorrow"], isSpam: false },
];

export const VOCABULARY = [
  "free",
  "win",
  "prize",
  "click",
  "urgent",
  "now",
  "money",
  "meeting",
  "project",
  "tomorrow",
];

export interface WordStats {
  word: string;
  spamProbability: number; // P(word | spam)
  hamProbability: number; // P(word | not spam)
}

export interface NaiveBayesModel {
  priorSpam: number;
  priorHam: number;
  wordStats: WordStats[];
}

// Laplace Smoothing সহ, প্রতিটা শব্দের জন্য P(word | spam) আর P(word | not spam) হিসাব করা
export function trainModel(): NaiveBayesModel {
  const spamMessages = trainingMessages.filter((m) => m.isSpam);
  const hamMessages = trainingMessages.filter((m) => !m.isSpam);

  const priorSpam = spamMessages.length / trainingMessages.length;
  const priorHam = hamMessages.length / trainingMessages.length;

  const wordStats: WordStats[] = VOCABULARY.map((word) => {
    const spamCount = spamMessages.filter((m) => m.words.includes(word)).length;
    const hamCount = hamMessages.filter((m) => m.words.includes(word)).length;

    // Laplace (Add-1) Smoothing — কোনো শব্দ কখনো না দেখা গেলেও probability শূন্য না হয়ে যায়
    const spamProbability = (spamCount + 1) / (spamMessages.length + 2);
    const hamProbability = (hamCount + 1) / (hamMessages.length + 2);

    return { word, spamProbability, hamProbability };
  });

  return { priorSpam, priorHam, wordStats };
}

export interface PredictionStep {
  word: string;
  spamProbability: number;
  hamProbability: number;
  present: boolean;
}

export interface PredictionResult {
  spamPosterior: number;
  hamPosterior: number;
  steps: PredictionStep[];
}

// নির্বাচিত শব্দগুলো দিয়ে Bayes' Theorem প্রয়োগ করে final probability বের করা
export function predict(
  model: NaiveBayesModel,
  selectedWords: Set<string>
): PredictionResult {
  let spamScore = model.priorSpam;
  let hamScore = model.priorHam;

  const steps: PredictionStep[] = model.wordStats.map((stat) => {
    const present = selectedWords.has(stat.word);
    if (present) {
      spamScore *= stat.spamProbability;
      hamScore *= stat.hamProbability;
    } else {
      // শব্দটা অনুপস্থিত থাকলে, তার "না থাকার" probability ব্যবহার করা হচ্ছে
      spamScore *= 1 - stat.spamProbability;
      hamScore *= 1 - stat.hamProbability;
    }
    return {
      word: stat.word,
      spamProbability: stat.spamProbability,
      hamProbability: stat.hamProbability,
      present,
    };
  });

  const total = spamScore + hamScore;
  const spamPosterior = total > 0 ? spamScore / total : 0.5;
  const hamPosterior = total > 0 ? hamScore / total : 0.5;

  return { spamPosterior, hamPosterior, steps };
}