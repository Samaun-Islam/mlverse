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

// একটা XOR-এর মতো প্যাটার্ন বানাচ্ছি — উপরে-ডানে ও নিচে-বামে এক ক্লাস,
// উপরে-বামে ও নিচে-ডানে আরেক ক্লাস। এটা Decision Tree-র জন্য ভালো উদাহরণ,
// কারণ একটামাত্র সরল রেখা দিয়ে এটা আলাদা করা অসম্ভব, কিন্তু কয়েকটা
// আয়তক্ষেত্রাকার split দিয়ে সহজেই আলাদা করা যায়
export function generateTrainingData(): LabeledPoint[] {
  const rand = mulberry32(9);
  const points: LabeledPoint[] = [];

  for (let i = 0; i < 90; i++) {
    const x = rand() * 10;
    const y = rand() * 10;
    const quadrantClass = (x > 5) === (y > 5) ? 1 : 0;
    // সামান্য noise — কিছু পয়েন্ট বিপরীত ক্লাসে চলে যাবে, বাস্তবসম্মত করার জন্য
    const label: 0 | 1 = rand() < 0.06 ? ((1 - quadrantClass) as 0 | 1) : quadrantClass;
    points.push({ x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)), label });
  }

  return points;
}

function gini(labels: (0 | 1)[]): number {
  if (labels.length === 0) return 0;
  const p1 = labels.filter((l) => l === 1).length / labels.length;
  const p0 = 1 - p1;
  return 1 - p0 * p0 - p1 * p1;
}

export interface TreeNode {
  depth: number;
  samples: number;
  gini: number;
  prediction: 0 | 1;
  // যদি leaf না হয়:
  feature?: "x" | "y";
  threshold?: number;
  left?: TreeNode;
  right?: TreeNode;
}

function majorityLabel(points: LabeledPoint[]): 0 | 1 {
  const ones = points.filter((p) => p.label === 1).length;
  return ones >= points.length - ones ? 1 : 0;
}

// একটা নির্দিষ্ট node-এর ডেটার জন্য সবচেয়ে ভালো split (feature + threshold) খোঁজা
function findBestSplit(
  points: LabeledPoint[]
): { feature: "x" | "y"; threshold: number; gain: number } | null {
  const currentGini = gini(points.map((p) => p.label));
  let best: { feature: "x" | "y"; threshold: number; gain: number } | null = null;

  (["x", "y"] as const).forEach((feature) => {
    const values = [...new Set(points.map((p) => p[feature]))].sort(
      (a, b) => a - b
    );

    for (let i = 0; i < values.length - 1; i++) {
      const threshold = (values[i] + values[i + 1]) / 2;
      const left = points.filter((p) => p[feature] <= threshold);
      const right = points.filter((p) => p[feature] > threshold);
      if (left.length === 0 || right.length === 0) continue;

      const weightedGini =
        (left.length / points.length) * gini(left.map((p) => p.label)) +
        (right.length / points.length) * gini(right.map((p) => p.label));

      const gain = currentGini - weightedGini;
      if (!best || gain > best.gain) {
        best = { feature, threshold, gain };
      }
    }
  });

  return best;
}

// Recursive ভাবে tree বানানো
export function buildTree(
  points: LabeledPoint[],
  maxDepth: number,
  depth = 0,
  minSamplesSplit = 4
): TreeNode {
  const labels = points.map((p) => p.label);
  const nodeGini = gini(labels);
  const prediction = majorityLabel(points);

  const isPure = nodeGini === 0;
  const canSplit =
    depth < maxDepth && points.length >= minSamplesSplit && !isPure;

  if (!canSplit) {
    return { depth, samples: points.length, gini: nodeGini, prediction };
  }

  const split = findBestSplit(points);
  if (!split || split.gain <= 0) {
    return { depth, samples: points.length, gini: nodeGini, prediction };
  }

  const leftPoints = points.filter((p) => p[split.feature] <= split.threshold);
  const rightPoints = points.filter((p) => p[split.feature] > split.threshold);

  return {
    depth,
    samples: points.length,
    gini: nodeGini,
    prediction,
    feature: split.feature,
    threshold: split.threshold,
    left: buildTree(leftPoints, maxDepth, depth + 1, minSamplesSplit),
    right: buildTree(rightPoints, maxDepth, depth + 1, minSamplesSplit),
  };
}

export function classifyPoint(
  point: { x: number; y: number },
  tree: TreeNode
): 0 | 1 {
  if (tree.feature === undefined || !tree.left || !tree.right) {
    return tree.prediction;
  }
  const value = point[tree.feature];
  if (value <= (tree.threshold as number)) {
    return classifyPoint(point, tree.left);
  }
  return classifyPoint(point, tree.right);
}

export interface GridCell {
  x: number;
  y: number;
  label: 0 | 1;
}

export function computeDecisionGrid(
  tree: TreeNode,
  resolution = 45
): GridCell[] {
  const grid: GridCell[] = [];
  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      const x = (i / (resolution - 1)) * 10;
      const y = (j / (resolution - 1)) * 10;
      grid.push({ x, y, label: classifyPoint({ x, y }, tree) });
    }
  }
  return grid;
}