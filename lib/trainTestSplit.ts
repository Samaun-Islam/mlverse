export interface LabeledPoint {
  x: number;
  y: number;
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

// ৬০টা fixed পয়েন্ট বানানো হচ্ছে — দুইটা ক্লাস, কিছুটা overlap সহ (বাস্তব ডেটার মতো)
export function generateClassificationDataset(): LabeledPoint[] {
  const rand = mulberry32(7);
  const points: LabeledPoint[] = [];

  for (let i = 0; i < 30; i++) {
    const x = -1 + rand() * 1.4 + (rand() - 0.5) * 0.6;
    const y = -1 + rand() * 1.4 + (rand() - 0.5) * 0.6;
    points.push({ x, y, label: 0 });
  }
  for (let i = 0; i < 30; i++) {
    const x = -0.3 + rand() * 1.4 + (rand() - 0.5) * 0.6;
    const y = -0.3 + rand() * 1.4 + (rand() - 0.5) * 0.6;
    points.push({ x, y, label: 1 });
  }

  // shuffle (Fisher-Yates), যাতে split করলে দুই ক্লাস মিশে থাকে
  for (let i = points.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [points[i], points[j]] = [points[j], points[i]];
  }

  return points;
}

export function splitDataset(
  points: LabeledPoint[],
  trainRatio: number
): { train: LabeledPoint[]; test: LabeledPoint[] } {
  const trainCount = Math.round(points.length * trainRatio);
  return {
    train: points.slice(0, trainCount),
    test: points.slice(trainCount),
  };
}

// সহজ logistic regression, gradient descent দিয়ে ট্রেইন করা হচ্ছে
export interface LogisticModel {
  w1: number;
  w2: number;
  b: number;
}

function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

export function trainLogisticRegression(
  points: LabeledPoint[],
  epochs: number = 300,
  lr: number = 0.5
): LogisticModel {
  let w1 = 0,
    w2 = 0,
    b = 0;

  if (points.length === 0) return { w1, w2, b };

  for (let e = 0; e < epochs; e++) {
    let gw1 = 0,
      gw2 = 0,
      gb = 0;

    for (const p of points) {
      const z = w1 * p.x + w2 * p.y + b;
      const pred = sigmoid(z);
      const error = pred - p.label;
      gw1 += error * p.x;
      gw2 += error * p.y;
      gb += error;
    }

    const n = points.length;
    w1 -= lr * (gw1 / n);
    w2 -= lr * (gw2 / n);
    b -= lr * (gb / n);
  }

  return { w1, w2, b };
}

export function predictLabel(model: LogisticModel, x: number, y: number): 0 | 1 {
  const z = model.w1 * x + model.w2 * y + model.b;
  return sigmoid(z) >= 0.5 ? 1 : 0;
}

export function computeAccuracy(
  model: LogisticModel,
  points: LabeledPoint[]
): number {
  if (points.length === 0) return 0;
  const correct = points.filter(
    (p) => predictLabel(model, p.x, p.y) === p.label
  ).length;
  return correct / points.length;
}

// Decision boundary আঁকার জন্য একটা রেখার দুই প্রান্তবিন্দু বের করা
// w1*x + w2*y + b = 0  =>  y = -(w1*x + b) / w2
export function getBoundaryLine(
  model: LogisticModel
): { x: number; y: number }[] {
  const xMin = -1.5;
  const xMax = 1.5;
  if (Math.abs(model.w2) < 1e-6) {
    return [
      { x: -model.b / (model.w1 || 1e-6), y: xMin },
      { x: -model.b / (model.w1 || 1e-6), y: xMax },
    ];
  }
  const yAtXMin = -(model.w1 * xMin + model.b) / model.w2;
  const yAtXMax = -(model.w1 * xMax + model.b) / model.w2;
  return [
    { x: xMin, y: yAtXMin },
    { x: xMax, y: yAtXMax },
  ];
}