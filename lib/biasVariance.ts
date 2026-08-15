import { fitPolynomial, predictPolynomial } from "./overfitting";

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function trueFunction(x: number): number {
  return Math.sin(x * Math.PI * 1.3) * 0.6;
}

// প্রতিবার একটু আলাদা noise দিয়ে একটা নতুন dataset বানানো (resampling)
function generateResample(seed: number) {
  const rand = mulberry32(seed);
  const points = [];
  for (let i = 0; i < 16; i++) {
    const x = -1 + (2 * i) / 15;
    const noise = (rand() - 0.5) * 0.5;
    points.push({ x, y: trueFunction(x) + noise });
  }
  return points;
}

const EVAL_XS = Array.from({ length: 25 }, (_, i) => -1 + (2 * i) / 24);
const NUM_RESAMPLES = 25;

export interface BiasVariancePoint {
  degree: number;
  bias2: number;
  variance: number;
  totalError: number;
}

// প্রতিটা degree-র জন্য ২৫টা resampled dataset দিয়ে ফিট করে bias/variance মাপা
export function computeBiasVarianceCurve(
  maxDegree: number = 10
): BiasVariancePoint[] {
  const results: BiasVariancePoint[] = [];

  for (let degree = 1; degree <= maxDegree; degree++) {
    // প্রতিটা eval x-এ, প্রতিটা resample-এর prediction জমা রাখছি
    const predictionsPerX: number[][] = EVAL_XS.map(() => []);

    for (let r = 0; r < NUM_RESAMPLES; r++) {
      const dataset = generateResample(1000 + r * 37);
      const coeffs = fitPolynomial(dataset, degree);
      EVAL_XS.forEach((x, xi) => {
        predictionsPerX[xi].push(predictPolynomial(coeffs, x));
      });
    }

    let bias2Sum = 0;
    let varianceSum = 0;

    EVAL_XS.forEach((x, xi) => {
      const preds = predictionsPerX[xi];
      const mean = preds.reduce((a, b) => a + b, 0) / preds.length;
      const trueVal = trueFunction(x);

      bias2Sum += (mean - trueVal) ** 2;
      const variance =
        preds.reduce((a, p) => a + (p - mean) ** 2, 0) / preds.length;
      varianceSum += variance;
    });

    const bias2 = bias2Sum / EVAL_XS.length;
    const variance = varianceSum / EVAL_XS.length;

    results.push({
      degree,
      bias2: parseFloat(bias2.toFixed(5)),
      variance: parseFloat(variance.toFixed(5)),
      totalError: parseFloat((bias2 + variance).toFixed(5)),
    });
  }

  return results;
}

// একটা নির্দিষ্ট degree-তে কয়েকটা sample fitted curve (visual spread দেখানোর জন্য)
export function generateSampleFits(
  degree: number,
  count: number = 6
): { x: number; y: number }[][] {
  const curves: { x: number; y: number }[][] = [];
  for (let r = 0; r < count; r++) {
    const dataset = generateResample(2000 + r * 53);
    const coeffs = fitPolynomial(dataset, degree);
    const curve = EVAL_XS.map((x) => ({
      x: parseFloat(x.toFixed(3)),
      y: predictPolynomial(coeffs, x),
    }));
    curves.push(curve);
  }
  return curves;
}

export function generateTrueCurve(): { x: number; y: number }[] {
  return EVAL_XS.map((x) => ({
    x: parseFloat(x.toFixed(3)),
    y: trueFunction(x),
  }));
}