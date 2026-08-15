export interface Point {
  x: number;
  y: number;
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// শুরুতে দেখানোর জন্য কিছু fixed, বাস্তবসম্মত noisy point
export function generatePresetData(): Point[] {
  const rand = mulberry32(13);
  const points: Point[] = [];
  for (let i = 0; i < 12; i++) {
    const x = 1 + i * 0.75 + (rand() - 0.5) * 0.4;
    const y = 1.2 * x + 1 + (rand() - 0.5) * 2.5;
    points.push({
      x: parseFloat(Math.max(0.2, x).toFixed(2)),
      y: parseFloat(Math.max(0.2, y).toFixed(2)),
    });
  }
  return points;
}

export interface RegressionResult {
  slope: number;
  intercept: number;
  r2: number;
}

// Least Squares দিয়ে best-fit line বের করা: y = slope * x + intercept
export function computeRegression(points: Point[]): RegressionResult {
  const n = points.length;
  if (n < 2) return { slope: 0, intercept: 0, r2: 0 };

  const sumX = points.reduce((s, p) => s + p.x, 0);
  const sumY = points.reduce((s, p) => s + p.y, 0);
  const meanX = sumX / n;
  const meanY = sumY / n;

  let numerator = 0;
  let denominator = 0;
  points.forEach((p) => {
    numerator += (p.x - meanX) * (p.y - meanY);
    denominator += (p.x - meanX) ** 2;
  });

  const slope = denominator !== 0 ? numerator / denominator : 0;
  const intercept = meanY - slope * meanX;

  // R² — মডেল কতটা ভালোভাবে variance ব্যাখ্যা করতে পারছে
  let ssRes = 0;
  let ssTot = 0;
  points.forEach((p) => {
    const predicted = slope * p.x + intercept;
    ssRes += (p.y - predicted) ** 2;
    ssTot += (p.y - meanY) ** 2;
  });
  const r2 = ssTot !== 0 ? 1 - ssRes / ssTot : 0;

  return { slope, intercept, r2 };
}

export function predict(result: RegressionResult, x: number): number {
  return result.slope * x + result.intercept;
}