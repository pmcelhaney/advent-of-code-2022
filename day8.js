import { readInput } from "./reader.js";

const heights = [];

function countVisible(grid) {
  let count = 0;

  grid.forEach((row, y) => {
    row.forEach((tree, x) => {
      if (
        row.slice(0, x).every((other) => other < tree) ||
        row.slice(x + 1).every((other) => other < tree) ||
        grid.slice(0, y).every((other) => other[x] < tree) ||
        grid.slice(y + 1).every((other) => other[x] < tree)
      ) {
        count += 1;
      }
    });
  });

  return count;
}

readInput(
  "8.txt",
  (line) => {
    heights.push(line.split("").map(Number));
  },
  () => countVisible(heights)
);
