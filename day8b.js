import { readInput } from "./reader.js";

const grid = [];

function countVisibleTrees(height, heights) {
  const count = heights.findIndex((x) => x >= height);

  return count === -1 ? heights.length : count + 1;
}

function maxScenicScore() {
  let max = 0;

  grid.forEach((row, y) => {
    row.forEach((tree, x) => {
      const column = grid.map((c) => c[x]);

      const left = countVisibleTrees(tree, row.slice(0, x).reverse());
      const right = countVisibleTrees(tree, row.slice(x + 1));
      const up = countVisibleTrees(tree, column.slice(0, y).reverse());
      const down = countVisibleTrees(tree, column.slice(y + 1));

      max = Math.max(max, left * right * up * down);
    });
  });

  return max;
}

readInput(
  "8.txt",
  (line) => {
    grid.push(line.split("").map(Number));
  },
  () => maxScenicScore()
);
