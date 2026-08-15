export interface Point {
  x: number;
  y: number;
}

export interface Centroid extends Point {
  id: number;
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

export const CENTROID_COLORS = ["#818cf8", "#fb923c", "#34d399", "#f472b6", "#facc15"];

// কোনো label ছাড়াই, শুধু ৩টা natural cluster-এর মতো ছড়ানো ডেটা —
// বাস্তবে unsupervised সমস্যায় আমরা জানি না আসল ক্লাস কী, শুধু ডেটা দেখি
export function generatePoints(): Point[] {
  const rand = mulberry32(24);
  const centers = [
    { x: 3, y: 7 },
    { x: 7.5, y: 6.5 },
    { x: 5, y: 2.5 },
  ];

  const points: Point[] = [];
  centers.forEach((c) => {
    for (let i = 0; i < 20; i++) {
      points.push({
        x: gaussianRandom(rand, c.x, 1.0),
        y: gaussianRandom(rand, c.y, 1.0),
      });
    }
  });
  return points;
}

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// K-Means++ initialization — শুধু random না করে, একে অপরের থেকে দূরে দূরে
// প্রাথমিক centroid বসানো হয়, এতে algorithm দ্রুত ও স্থিতিশীলভাবে converge করে
function initializeCentroids(points: Point[], k: number, rand: () => number): Centroid[] {
  const centroids: Centroid[] = [];
  const firstIdx = Math.floor(rand() * points.length);
  centroids.push({ ...points[firstIdx], id: 0 });

  while (centroids.length < k) {
    const distances = points.map((p) =>
      Math.min(...centroids.map((c) => distance(p, c)))
    );
    const totalDist = distances.reduce((a, b) => a + b, 0);
    let threshold = rand() * totalDist;
    let chosenIdx = 0;
    for (let i = 0; i < distances.length; i++) {
      threshold -= distances[i];
      if (threshold <= 0) {
        chosenIdx = i;
        break;
      }
    }
    centroids.push({ ...points[chosenIdx], id: centroids.length });
  }

  return centroids;
}

export interface KMeansStep {
  centroids: Centroid[];
  assignments: number[]; // প্রতিটা point কোন centroid-এর, index অনুযায়ী
}

function assignPoints(points: Point[], centroids: Centroid[]): number[] {
  return points.map((p) => {
    let minDist = Infinity;
    let closest = 0;
    centroids.forEach((c) => {
      const d = distance(p, c);
      if (d < minDist) {
        minDist = d;
        closest = c.id;
      }
    });
    return closest;
  });
}

function recomputeCentroids(
  points: Point[],
  assignments: number[],
  k: number,
  prevCentroids: Centroid[]
): Centroid[] {
  return Array.from({ length: k }, (_, id) => {
    const assigned = points.filter((_, i) => assignments[i] === id);
    if (assigned.length === 0) {
      // কোনো point না পেলে, আগের জায়গাতেই থাকবে
      return prevCentroids[id];
    }
    const meanX = assigned.reduce((s, p) => s + p.x, 0) / assigned.length;
    const meanY = assigned.reduce((s, p) => s + p.y, 0) / assigned.length;
    return { x: meanX, y: meanY, id };
  });
}

// পুরো K-Means প্রক্রিয়াটা ধাপে ধাপে চালিয়ে প্রতিটা ধাপের snapshot জমা রাখা হচ্ছে,
// যাতে Play বাটন দিয়ে ধাপে ধাপে animate করে দেখানো যায়
export function runKMeans(
  points: Point[],
  k: number,
  seed: number,
  maxIterations = 10
): KMeansStep[] {
  const rand = mulberry32(seed);
  let centroids = initializeCentroids(points, k, rand);
  const steps: KMeansStep[] = [];

  let assignments = assignPoints(points, centroids);
  steps.push({ centroids: [...centroids], assignments: [...assignments] });

  for (let iter = 0; iter < maxIterations; iter++) {
    const newCentroids = recomputeCentroids(points, assignments, k, centroids);
    const newAssignments = assignPoints(points, newCentroids);

    steps.push({ centroids: [...newCentroids], assignments: [...newAssignments] });

    // যদি assignment একেবারেই না বদলায়, তাহলে converge হয়ে গেছে, থামিয়ে দাও
    const changed = newAssignments.some((a, i) => a !== assignments[i]);
    centroids = newCentroids;
    assignments = newAssignments;
    if (!changed) break;
  }

  return steps;
}

// Elbow Method-এর জন্য: বিভিন্ন K-তে মোট within-cluster distance (inertia) মাপা
export function computeInertia(points: Point[], steps: KMeansStep[]): number {
  const lastStep = steps[steps.length - 1];
  let total = 0;
  points.forEach((p, i) => {
    const centroid = lastStep.centroids[lastStep.assignments[i]];
    total += distance(p, centroid) ** 2;
  });
  return total;
}