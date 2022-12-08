import { readInput } from "./reader.js";

const grid = [];

function countVisibleTrees(height, heights) {
  const index = heights.findIndex((x) => x >= height);

  return index === -1 ? heights.length : index + 1;
}

function maxScenicScore() {
  return grid.reduce(
    (accumulator, row, y) =>
      row.reduce((accumlator2, tree, x) => {
        const column = grid.map((c) => c[x]);

        const left = countVisibleTrees(tree, row.slice(0, x).reverse());
        const right = countVisibleTrees(tree, row.slice(x + 1));
        const up = countVisibleTrees(tree, column.slice(0, y).reverse());
        const down = countVisibleTrees(tree, column.slice(y + 1));

        return Math.max(accumlator2, left * right * up * down);
      }, accumulator),
    0
  );
}

readInput(
  "8.txt",
  (line) => {
    grid.push(line.split("").map(Number));
  },
  () => maxScenicScore()
);
