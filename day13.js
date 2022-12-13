import { readInput } from "./reader.js";

const pairs = [];

function readLine(line, lineNumber) {
  if (lineNumber % 3 === 2) {
    return;
  }

  const data = JSON.parse(line);

  if (lineNumber % 3 === 0) {
    pairs.push([data]);
  }

  if (lineNumber % 3 === 1) {
    pairs.at(-1).push(data);
  }
}

function compare(a, b) {
  if (typeof a === "number" && typeof b === "number") {
    return b - a;
  }

  if (typeof a === "number") {
    return compare([a], b);
  }

  if (typeof b === "number") {
    return compare(a, [b]);
  }

  for (let index = 0; index < Math.min(a.length, b.length); index += 1) {
    const result = compare(a[index], b[index]);

    if (result !== 0) {
      return result;
    }
  }

  return b.length - a.length;
}

function computeAnswer() {
  return pairs.reduce(
    (sum, pair, index) => (compare(...pair) >= 0 ? sum + index + 1 : sum),
    0
  );
}

readInput("13.txt", readLine, computeAnswer);
