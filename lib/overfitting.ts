export interface DataPoint {
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

function trueFunction(x: number): number {
  return Math.sin(x * Math.PI * 1.3) * 0.6;
}

export function generateDataset(): { train: DataPoint[]; test: DataPoint[] } {
  const rand = mulberry32(42);
  const all: DataPoint[] = [];

  for (let i = 0; i < 24; i++) {
    const x = -1 + (2 * i) / 23;
    const noise = (rand() - 0.5) * 0.5;
    all.push({ x, y: trueFunction(x) + noise });
  }

  const train: DataPoint[] = [];
  const test: DataPoint[] = [];
  all.forEach((p, i) => {
    if (i % 3 === 2) test.push(p);
    else train.push(p);
  });

  return { train, test };
}

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

export function fitPolynomial(points: DataPoint[], degree: number): number[] {
  const n = degree + 1;

  const X = points.map((p) =>
    Array.from({ length: n }, (_, k) => Math.pow(p.x, k))
  );
  const y = points.map((p) => p.y);

  const XtX: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  const Xty: number[] = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < points.length; k++) sum += X[k][i] * X[k][j];
      XtX[i][j] = sum + (i === j ? 1e-6 : 0);
    }
    let sumY = 0;
    for (let k = 0; k < points.length; k++) sumY += X[k][i] * y[k];
    Xty[i] = sumY;
  }

  return solveLinearSystem(XtX, Xty);
}

export function predictPolynomial(coeffs: number[], x: number): number {
  return coeffs.reduce((sum, c, i) => sum + c * Math.pow(x, i), 0);
}

export function computeMSE(coeffs: number[], points: DataPoint[]): number {
  const errors = points.map((p) => {
    const pred = predictPolynomial(coeffs, p.x);
    return (pred - p.y) ** 2;
  });
  return errors.reduce((a, b) => a + b, 0) / points.length;
}

export function generateCurve(
  coeffs: number[],
  steps: number = 100
): { x: number; y: number }[] {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const x = -1.15 + (2.3 * i) / steps;
    points.push({ x: parseFloat(x.toFixed(3)), y: predictPolynomial(coeffs, x) });
  }
  return points;
}