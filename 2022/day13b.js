import { readInput } from "./reader.js";

const packets = [[[2]], [[6]]];

function readLine(line) {
  if (line === "") {
    return;
  }

  packets.push(JSON.parse(line));
}

// eslint-disable-next-line max-statements
function compare(a, b) {
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
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

  return a.length - b.length;
}

function computeAnswer() {
  packets.sort(compare);

  const two =
    packets.findIndex((packet) => JSON.stringify(packet) === "[[2]]") + 1;
  const six =
    packets.findIndex((packet) => JSON.stringify(packet) === "[[6]]") + 1;

  return two * six;
}

readInput("13.txt", readLine, computeAnswer);
