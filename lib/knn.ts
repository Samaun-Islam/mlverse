export interface LabeledPoint {
  x: number;
  y: number;
  label: number; // 0, 1, বা 2 — তিনটা ক্লাস
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussianRandom(rand: () => number, mean: number, std: number) {
  const u1 = Math.max(rand(), 1e-9);
  const u2 = rand();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z * std;
}

export const CLASS_NAMES = ["Class A", "Class B", "Class C"];
export const CLASS_COLORS = ["#818cf8", "#fb923c", "#34d399"];

export function generateTrainingData(): LabeledPoint[] {
  const rand = mulberry32(55);
  const centers = [
    { x: 3, y: 6, label: 0 },
    { x: 7, y: 7, label: 1 },
    { x: 5, y: 2.5, label: 2 },
  ];

  const points: LabeledPoint[] = [];
  centers.forEach((c) => {
    for (let i = 0; i < 18; i++) {
      points.push({
        x: gaussianRandom(rand, c.x, 1.1),
        y: gaussianRandom(rand, c.y, 1.1),
        label: c.label,
      });
    }
  });
  return points;
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function classifyPoint(
  point: { x: number; y: number },
  trainingData: LabeledPoint[],
  k: number
): number {
  const distances = trainingData
    .map((p) => ({ label: p.label, dist: distance(point, p) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, k);

  const votes = [0, 0, 0];
  distances.forEach((d) => votes[d.label]++);

  let maxVotes = -1;
  let winner = 0;
  votes.forEach((v, i) => {
    if (v > maxVotes) {
      maxVotes = v;
      winner = i;
    }
  });
  return winner;
}

export interface GridCell {
  x: number;
  y: number;
  label: number;
}

export function computeDecisionGrid(
  trainingData: LabeledPoint[],
  k: number,
  resolution = 45
): GridCell[] {
  const grid: GridCell[] = [];
  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      const x = (i / (resolution - 1)) * 10;
      const y = (j / (resolution - 1)) * 10;
      const label = classifyPoint({ x, y }, trainingData, k);
      grid.push({ x, y, label });
    }
  }
  return grid;
}

export interface NeighborInfo {
  point: LabeledPoint;
  distance: number;
}

// Query point থেকে সবচেয়ে কাছের K-টা প্রতিবেশী, দূরত্ব সহ বের করা
export function getNearestNeighbors(
  point: { x: number; y: number },
  trainingData: LabeledPoint[],
  k: number
): NeighborInfo[] {
  return trainingData
    .map((p) => ({ point: p, distance: distance(point, p) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, k);
}