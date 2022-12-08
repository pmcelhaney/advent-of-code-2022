import { readInput } from "./reader.js";

const heights = [];

function countVisibleTrees(tree, trees) {
  const count = trees.findIndex((x) => x >= tree);

  return count === -1 ? trees.length : count + 1;
}

function maxScenicScore(grid) {
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
    heights.push(line.split("").map(Number));
  },
  () => maxScenicScore(heights)
);
