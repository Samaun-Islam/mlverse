export interface LabeledPoint {
  x: number;
  label: 0 | 1;
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// শুরুতে দেখানোর জন্য fixed ডেটা — যেমন "পড়াশোনার ঘন্টা বনাম পাস/ফেল"
export function generatePresetData(): LabeledPoint[] {
  const rand = mulberry32(31);
  const points: LabeledPoint[] = [];

  for (let i = 0; i < 20; i++) {
    const x = 1 + i * 0.45 + (rand() - 0.5) * 0.3;
    // x যত বেশি, পাস করার সম্ভাবনা তত বেশি — কিন্তু কিছুটা randomness সহ
    const passProbability = 1 / (1 + Math.exp(-(x - 5)));
    const label: 0 | 1 = rand() < passProbability ? 1 : 0;
    points.push({ x: parseFloat(Math.max(0.2, x).toFixed(2)), label });
  }

  return points;
}

export function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

export interface LogisticResult {
  weight: number;
  bias: number;
}

// Gradient Descent দিয়ে Logistic Regression ট্রেইন করা
export function trainLogisticRegression(
  points: LabeledPoint[],
  epochs = 400,
  learningRate = 0.15
): LogisticResult {
  if (points.length === 0) return { weight: 0, bias: 0 };

  // x-কে normalize করে নিচ্ছি, যাতে gradient descent স্থিতিশীলভাবে converge করে
  const meanX = points.reduce((s, p) => s + p.x, 0) / points.length;
  const stdX =
    Math.sqrt(
      points.reduce((s, p) => s + (p.x - meanX) ** 2, 0) / points.length
    ) || 1;

  let w = 0;
  let b = 0;

  for (let epoch = 0; epoch < epochs; epoch++) {
    let dw = 0;
    let db = 0;

    points.forEach((p) => {
      const xNorm = (p.x - meanX) / stdX;
      const pred = sigmoid(w * xNorm + b);
      const error = pred - p.label;
      dw += error * xNorm;
      db += error;
    });

    w -= learningRate * (dw / points.length);
    b -= learningRate * (db / points.length);
  }

  // Normalize করা weight/bias-কে আবার আসল x-scale-এ ফিরিয়ে আনা
  const realWeight = w / stdX;
  const realBias = b - (w * meanX) / stdX;

  return { weight: realWeight, bias: realBias };
}

export function predictProbability(
  result: LogisticResult,
  x: number
): number {
  return sigmoid(result.weight * x + result.bias);
}

// যে x-এ probability ঠিক 0.5 হয় (decision boundary), সেটা বের করা
export function computeDecisionBoundary(result: LogisticResult): number {
  if (result.weight === 0) return 0;
  return -result.bias / result.weight;
}