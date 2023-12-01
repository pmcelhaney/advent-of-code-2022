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
    ([x, y, z]) => [a + x, b + y, c + z].join(",")
  );
}

sides([1, 4, 2]);

const input = [];

const points = {};

function readLine(line) {
  input.push(line.split(",").map(Number));
  points[line] = true;
}

function computeAnswer() {
  return input.reduce(
    (sum, cube) => sum + sides(cube).filter((side) => !points[side]).length,
    0
  );
}

readInput("18.txt", readLine, computeAnswer);

//
//
// solved part 1 in the REPL
// For part 2 I want to find the endpoints of perpendicular lines
// for example 2,5,6 and 2,5,17 are on the same line (2,5,_)
// so put everything on its respective line, find the endpoints, and remove the ones that aren't endpoints of any line
//
//
