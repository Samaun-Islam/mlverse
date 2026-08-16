import { irisDataset, type IrisFlower, type IrisSpecies } from "./irisData";

export interface QueryFlower {
  sepalLength: number;
  sepalWidth: number;
  petalLength: number;
  petalWidth: number;
}

export interface NeighborResult {
  flower: IrisFlower;
  distance: number;
}

// প্রতিটা feature-এর std normalize করে distance হিসাব করছি, যাতে বড় স্কেলের
// feature (যেমন petal length, 1-7 রেঞ্জ) ছোট স্কেলের feature-কে (petal width, 0.1-2.6)
// দাবিয়ে না রাখে
const FEATURE_STD = {
  sepalLength: 0.83,
  sepalWidth: 0.43,
  petalLength: 1.76,
  petalWidth: 0.76,
};

function distance(a: QueryFlower, b: IrisFlower): number {
  const dSL = (a.sepalLength - b.sepalLength) / FEATURE_STD.sepalLength;
  const dSW = (a.sepalWidth - b.sepalWidth) / FEATURE_STD.sepalWidth;
  const dPL = (a.petalLength - b.petalLength) / FEATURE_STD.petalLength;
  const dPW = (a.petalWidth - b.petalWidth) / FEATURE_STD.petalWidth;
  return Math.sqrt(dSL ** 2 + dSW ** 2 + dPL ** 2 + dPW ** 2);
}

export function getNearestNeighbors(
  query: QueryFlower,
  k: number
): NeighborResult[] {
  return irisDataset
    .map((flower) => ({ flower, distance: distance(query, flower) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, k);
}

export interface ClassificationResult {
  species: IrisSpecies;
  confidence: number; // ভোট পাওয়া প্রতিবেশীর অনুপাত
  neighbors: NeighborResult[];
}

export function classifyFlower(query: QueryFlower, k = 5): ClassificationResult {
  const neighbors = getNearestNeighbors(query, k);

  const votes: Record<IrisSpecies, number> = {
    Setosa: 0,
    Versicolor: 0,
    Virginica: 0,
  };
  neighbors.forEach((n) => votes[n.flower.species]++);

  let winner: IrisSpecies = "Setosa";
  let maxVotes = -1;
  (Object.keys(votes) as IrisSpecies[]).forEach((species) => {
    if (votes[species] > maxVotes) {
      maxVotes = votes[species];
      winner = species;
    }
  });

  return {
    species: winner,
    confidence: maxVotes / k,
    neighbors,
  };
}