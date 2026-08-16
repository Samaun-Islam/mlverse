export interface StudentPoint {
  hours: number;
  attendance: number;
  passed: 0 | 1;
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

function generateDataset(): StudentPoint[] {
  const rand = mulberry32(66);
  const points: StudentPoint[] = [];

  for (let i = 0; i < 70; i++) {
    const hours = rand() * 10;
    const attendance = rand() * 100;
    // score যত বেশি, পাস করার সম্ভাবনা তত বেশি — দুটো factor-ই গুরুত্বপূর্ণ
    const score = hours * 0.55 + attendance * 0.045 - 4.2;
    const passProbability = sigmoid(score);
    const passed: 0 | 1 = rand() < passProbability ? 1 : 0;
    points.push({
      hours: parseFloat(hours.toFixed(2)),
      attendance: parseFloat(attendance.toFixed(1)),
      passed,
    });
  }

  return points;
}

export const trainingData = generateDataset();

export interface PassFailModel {
  wHours: number;
  wAttendance: number;
  bias: number;
}

// 2-feature Logistic Regression, Gradient Descent দিয়ে ট্রেইন করা
export function trainModel(
  points: StudentPoint[],
  epochs = 600,
  learningRate = 0.1
): PassFailModel {
  // Normalize করা, যাতে gradient descent স্থিতিশীলভাবে converge করে
  const meanHours = points.reduce((s, p) => s + p.hours, 0) / points.length;
  const stdHours =
    Math.sqrt(
      points.reduce((s, p) => s + (p.hours - meanHours) ** 2, 0) / points.length
    ) || 1;
  const meanAtt = points.reduce((s, p) => s + p.attendance, 0) / points.length;
  const stdAtt =
    Math.sqrt(
      points.reduce((s, p) => s + (p.attendance - meanAtt) ** 2, 0) /
        points.length
    ) || 1;

  let wH = 0;
  let wA = 0;
  let b = 0;

  for (let epoch = 0; epoch < epochs; epoch++) {
    let dwH = 0;
    let dwA = 0;
    let db = 0;

    points.forEach((p) => {
      const hNorm = (p.hours - meanHours) / stdHours;
      const aNorm = (p.attendance - meanAtt) / stdAtt;
      const pred = sigmoid(wH * hNorm + wA * aNorm + b);
      const error = pred - p.passed;
      dwH += error * hNorm;
      dwA += error * aNorm;
      db += error;
    });

    wH -= learningRate * (dwH / points.length);
    wA -= learningRate * (dwA / points.length);
    b -= learningRate * (db / points.length);
  }

  // Normalize করা weight-কে আসল scale-এ ফিরিয়ে আনা
  const wHours = wH / stdHours;
  const wAttendance = wA / stdAtt;
  const bias = b - (wH * meanHours) / stdHours - (wA * meanAtt) / stdAtt;

  return { wHours, wAttendance, bias };
}

export function predictProbability(
  model: PassFailModel,
  hours: number,
  attendance: number
): number {
  const z = model.wHours * hours + model.wAttendance * attendance + model.bias;
  return sigmoid(z);
}