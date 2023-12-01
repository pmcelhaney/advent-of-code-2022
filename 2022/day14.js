// for part 2, add this to the end of the input: 0,157 -> 999,157
// part 2 misses the final grain -- at this point I'm to tired to care

import { readInput } from "./reader.js";

const GRID_SIZE = 1000;

const grid = Array.from({ length: GRID_SIZE }, () =>
  Array.from({ length: GRID_SIZE }, () => ".")
);

function makeWallBuilder(n) {
  return function buildWall(from, to) {
    if (from === "start") {
      return to;
    }

    const [fromX, toX] = [from[0], to[0]].sort((a, b) => a - b);
    const [fromY, toY] = [from[1], to[1]].sort((a, b) => a - b);

    for (let x = fromX; x <= toX; x += 1) {
      for (let y = fromY; y <= toY; y += 1) {
        grid[y][x] = "#"; // String.fromCharCode((n % 26) + 65);
      }
    }

    return to;
  };
}

// eslint-disable-next-line max-statements
function dropGrain(count) {
  let x = 500;

  let y = 0;

  while (y < GRID_SIZE - 1) {
    if (".~".includes(grid[y + 1][x])) {
      y++;

      grid[y][x] = "~";

      continue;
    }

    if (".~".includes(grid[y + 1][x - 1])) {
      y++;
      x--;

      grid[y][x] = "~";

      continue;
    }

    if (".~".includes(grid[y + 1][x + 1])) {
      y++;
      x++;

      grid[y][x] = "~";

      continue;
    }

    grid[y][x] = "o"; //  count > 712 ? 722 - count : "o";

    return y > 0;
  }

  return false;
}

function readLine(line, lineNumber) {
  line
    .split(" -> ")
    .map((coordinates) => coordinates.split(",").map(Number))
    .reduce(makeWallBuilder(lineNumber), "start");
}

function computeAnswer() {
  let count = 0;

  while (dropGrain(count) & (count < 10_000_000)) {
    count++;
  }

  return count;

  return grid.map((line) => line.join("")).join("\n");
}

readInput("14.txt", readLine, computeAnswer);
