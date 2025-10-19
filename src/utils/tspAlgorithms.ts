import { House } from "@/pages/PlanRoute";

export interface TSPResult {
  path: number[]; // indices of houses in optimized order
  distance: number;
  computationTime: number;
  stepsChecked: number;
  selectedHouses?: number[]; // Original indices of houses selected by knapsack
  skippedHouses?: number[]; // Original indices of houses skipped by knapsack
  totalWeight?: number; // Total weight of selected houses
}

// Calculate Euclidean distance between two houses
function calculateDistance(house1: House, house2: House): number {
  return Math.sqrt(Math.pow(house2.x - house1.x, 2) + Math.pow(house2.y - house1.y, 2));
}

// Calculate total distance of a path
function calculatePathDistance(houses: House[], path: number[]): number {
  let totalDistance = 0;
  for (let i = 0; i < path.length - 1; i++) {
    totalDistance += calculateDistance(houses[path[i]], houses[path[i + 1]]);
  }
  return totalDistance;
}

// 0/1 Knapsack Algorithm to select houses based on capacity
export function knapsack(houses: House[], capacity: number): {
  selectedIndices: number[];
  skippedIndices: number[];
  totalWeight: number;
} {
  const n = houses.length;
  
  // Create DP table
  const dp: number[][] = Array(n + 1)
    .fill(0)
    .map(() => Array(capacity + 1).fill(0));

  // Fill DP table
  for (let i = 1; i <= n; i++) {
    const weight = houses[i - 1].gifts;
    for (let w = 0; w <= capacity; w++) {
      if (weight <= w) {
        // Max of including or excluding current house
        dp[i][w] = Math.max(
          dp[i - 1][w],
          dp[i - 1][w - weight] + 1 // Value is number of houses
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  // Backtrack to find selected houses
  const selectedIndices: number[] = [];
  let w = capacity;
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selectedIndices.push(i - 1);
      w -= houses[i - 1].gifts;
    }
  }

  selectedIndices.reverse();
  
  const skippedIndices = houses
    .map((_, idx) => idx)
    .filter(idx => !selectedIndices.includes(idx));

  const totalWeight = selectedIndices.reduce(
    (sum, idx) => sum + houses[idx].gifts,
    0
  );

  return { selectedIndices, skippedIndices, totalWeight };
}

// Greedy Nearest Neighbour Algorithm
export function greedyNearestNeighbour(houses: House[]): TSPResult {
  const startTime = performance.now();
  const n = houses.length;
  let stepsChecked = 0;

  if (n === 0) {
    return { path: [], distance: 0, computationTime: 0, stepsChecked: 0 };
  }

  const visited = new Array(n).fill(false);
  const path: number[] = [0]; // Start from first house (North Pole)
  visited[0] = true;
  let currentIndex = 0;

  // Greedily select nearest unvisited house
  for (let i = 1; i < n; i++) {
    let nearestIndex = -1;
    let nearestDistance = Infinity;

    for (let j = 0; j < n; j++) {
      stepsChecked++;
      if (!visited[j]) {
        const distance = calculateDistance(houses[currentIndex], houses[j]);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = j;
        }
      }
    }

    if (nearestIndex !== -1) {
      path.push(nearestIndex);
      visited[nearestIndex] = true;
      currentIndex = nearestIndex;
    }
  }

  const totalDistance = calculatePathDistance(houses, path);
  const computationTime = (performance.now() - startTime) / 1000;

  return {
    path,
    distance: totalDistance,
    computationTime,
    stepsChecked,
  };
}

// Dynamic Programming (Held-Karp) Algorithm
export function heldKarp(houses: House[]): TSPResult {
  const startTime = performance.now();
  const n = houses.length;
  let stepsChecked = 0;

  if (n === 0) {
    return { path: [], distance: 0, computationTime: 0, stepsChecked: 0 };
  }

  if (n === 1) {
    return { path: [0], distance: 0, computationTime: 0, stepsChecked: 0 };
  }

  // For large datasets, use greedy as fallback (Held-Karp is O(n^2 * 2^n))
  if (n > 20) {
    console.warn("Dataset too large for Held-Karp, using greedy approximation");
    return greedyNearestNeighbour(houses);
  }

  // Distance matrix
  const dist: number[][] = Array(n)
    .fill(0)
    .map(() => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      dist[i][j] = calculateDistance(houses[i], houses[j]);
    }
  }

  // DP table: dp[mask][i] = min distance to visit all cities in mask ending at i
  const dp: Map<string, number> = new Map();
  const parent: Map<string, number> = new Map();

  // Base case: start from city 0
  for (let i = 1; i < n; i++) {
    const mask = (1 << 0) | (1 << i);
    const key = `${mask},${i}`;
    dp.set(key, dist[0][i]);
    parent.set(key, 0);
    stepsChecked++;
  }

  // Fill DP table
  for (let size = 3; size <= n; size++) {
    // Generate all subsets of size 'size' containing city 0
    const subsets = generateSubsets(n, size);
    for (const subset of subsets) {
      if (!(subset & (1 << 0))) continue; // Must contain starting city

      for (let i = 1; i < n; i++) {
        if (!(subset & (1 << i))) continue; // i must be in subset

        const prevSubset = subset ^ (1 << i); // Remove i from subset
        let minDist = Infinity;
        let minPrev = -1;

        for (let j = 0; j < n; j++) {
          if (j === i || !(prevSubset & (1 << j))) continue;

          const prevKey = `${prevSubset},${j}`;
          const prevDist = dp.get(prevKey);
          if (prevDist !== undefined) {
            stepsChecked++;
            const newDist = prevDist + dist[j][i];
            if (newDist < minDist) {
              minDist = newDist;
              minPrev = j;
            }
          }
        }

        if (minPrev !== -1) {
          const key = `${subset},${i}`;
          dp.set(key, minDist);
          parent.set(key, minPrev);
        }
      }
    }
  }

  // Find minimum distance tour
  const fullMask = (1 << n) - 1;
  let minTourDist = Infinity;
  let lastCity = -1;

  for (let i = 1; i < n; i++) {
    const key = `${fullMask},${i}`;
    const tourDist = dp.get(key);
    if (tourDist !== undefined) {
      stepsChecked++;
      if (tourDist < minTourDist) {
        minTourDist = tourDist;
        lastCity = i;
      }
    }
  }

  // Reconstruct path
  const path: number[] = [];
  let currentMask = fullMask;
  let currentCity = lastCity;

  while (currentCity !== -1) {
    path.unshift(currentCity);
    const key = `${currentMask},${currentCity}`;
    const prev = parent.get(key);
    if (prev !== undefined) {
      currentMask ^= 1 << currentCity;
      currentCity = prev;
    } else {
      break;
    }
  }

  const totalDistance = calculatePathDistance(houses, path);
  const computationTime = (performance.now() - startTime) / 1000;

  return {
    path,
    distance: totalDistance,
    computationTime,
    stepsChecked,
  };
}

// Helper function to generate all subsets of given size
function generateSubsets(n: number, size: number): number[] {
  const subsets: number[] = [];
  
  function generate(current: number, index: number, count: number) {
    if (count === size) {
      subsets.push(current);
      return;
    }
    if (index === n) return;

    // Include current element
    generate(current | (1 << index), index + 1, count + 1);
    // Exclude current element
    generate(current, index + 1, count);
  }

  generate(0, 0, 0);
  return subsets;
}
