import { readInput } from "./reader.js";

function replaceEachWith(array, replacement) {
  return array.map((_, index) => [
    ...array.slice(0, index),
    replacement,
    ...array.slice(index + 1),
  ]);
}

function sides([a, b, c]) {
  const zeros = [0, 0, 0];

  return [...replaceEachWith(zeros, -1), ...replaceEachWith(zeros, 1)].map(
    ([x, y, z]) => [a + x, b + y, c + z]
  );
}

const input = [];

const points = {};

const air = {};

let max = 0;
let min = 1;

function readLine(line) {
  const point = line.split(",").map(Number);

  input.push(point);
  points[line] = true;

  min = Math.min(min, ...point);
  max = Math.max(max, ...point);
}

function findAirCells() {
  const cellsToCheck = [[1, 1, 1]];

  while (cellsToCheck.length > 0) {
    iterations += 1;

    const point = cellsToCheck.pop();

    if (
      point.some((coordinate) => coordinate < min - 1 || coordinate > max + 1)
    ) {
      continue;
    }

    const key = point.join(",");

    if (air[key] || points[key]) {
      continue;
    }

    air[key] = true;

    cellsToCheck.push(...sides(point));
  }
}

function computeAnswer() {
  findAirCells();

  return input.reduce(
    (sum, cube) => sum + sides(cube).filter((side) => air[side]).length,
    0
  );
}

readInput("18.txt", readLine, computeAnswer);

// The problem is a little harder than I understood at first. One way to solve it might be to "fill in" the droplet.
// I think the easiest way might be to put a box around the droplet and identify all the "air" between the box and the droplet.
// Then I the number of surfaces that are adjacent to an air cell.
