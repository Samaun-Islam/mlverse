export type Location = "Downtown" | "Suburb" | "Rural";

export const LOCATIONS: Location[] = ["Downtown", "Suburb", "Rural"];

export interface HouseDataPoint {
  area: number; // sq ft
  bedrooms: number;
  location: Location;
  price: number; // লাখ টাকায়
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Location অনুযায়ী base price multiplier (Downtown সবচেয়ে দামি, Rural সবচেয়ে সস্তা)
const LOCATION_MULTIPLIER: Record<Location, number> = {
  Downtown: 1.35,
  Suburb: 1.0,
  Rural: 0.7,
};

function generateDataset(): HouseDataPoint[] {
  const rand = mulberry32(88);
  const points: HouseDataPoint[] = [];

  LOCATIONS.forEach((location) => {
    for (let i = 0; i < 25; i++) {
      const area = 600 + rand() * 2400;
      const bedrooms = 1 + Math.floor(rand() * 5);
      const basePrice = 8 + area * 0.045 + bedrooms * 6;
      const noise = (rand() - 0.5) * 15;
      const price = Math.max(
        5,
        basePrice * LOCATION_MULTIPLIER[location] + noise
      );
      points.push({
        area: parseFloat(area.toFixed(0)),
        bedrooms,
        location,
        price: parseFloat(price.toFixed(1)),
      });
    }
  });

  return points;
}

export const trainingData = generateDataset();

function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);

  for (let col = 0; col < n; col++) {
    let maxRow = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(M[row][col]) > Math.abs(M[maxRow][col])) maxRow = row;
    }
    [M[col], M[maxRow]] = [M[maxRow], M[col]];

    const pivot = M[col][col] || 1e-9;
    for (let row = col + 1; row < n; row++) {
      const factor = M[row][col] / pivot;
      for (let k = col; k <= n; k++) M[row][k] -= factor * M[col][k];
    }
  }

  const x = new Array(n).fill(0);
  for (let row = n - 1; row >= 0; row--) {
    let sum = M[row][n];
    for (let col = row + 1; col < n; col++) sum -= M[row][col] * x[col];
    x[row] = sum / (M[row][row] || 1e-9);
  }
  return x;
}

// Feature vector: [1 (intercept), area, bedrooms, isDowntown, isSuburb]
// (Rural বেস ক্যাটাগরি ধরে নিচ্ছি, তাই ওটার জন্য আলাদা dummy লাগবে না)
function toFeatures(area: number, bedrooms: number, location: Location): number[] {
  return [
    1,
    area,
    bedrooms,
    location === "Downtown" ? 1 : 0,
    location === "Suburb" ? 1 : 0,
  ];
}

export interface HouseModel {
  weights: number[];
}

export function trainModel(): HouseModel {
  const n = 5;
  const X = trainingData.map((d) => toFeatures(d.area, d.bedrooms, d.location));
  const y = trainingData.map((d) => d.price);

  const XtX: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  const Xty: number[] = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < X.length; k++) sum += X[k][i] * X[k][j];
      XtX[i][j] = sum + (i === j ? 1e-6 : 0);
    }
    let sumY = 0;
    for (let k = 0; k < X.length; k++) sumY += X[k][i] * y[k];
    Xty[i] = sumY;
  }

  const weights = solveLinearSystem(XtX, Xty);
  return { weights };
}

export function predictPrice(
  model: HouseModel,
  area: number,
  bedrooms: number,
  location: Location
): number {
  const features = toFeatures(area, bedrooms, location);
  return features.reduce((sum, f, i) => sum + f * model.weights[i], 0);
}