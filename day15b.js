/* eslint-disable no-loop-func */
// for part 2, add this to the end of the input: 0,157 -> 999,157
// part 2 misses the final grain -- at this point I'm to tired to care

import { readInput } from "./reader.js";

const data = [];

function readLine(line) {
  data.push(line.match(/\d+/gu).map(Number));
}

function processSensors(targetLineIndex) {
  const sensors = [];

  const outOfRange = [];

  let totalArea = 0;

  for (const sensor of data) {
    const [sx, sy, bx, by] = sensor;

    const dx = Math.abs(sx - bx);
    const dy = Math.abs(sy - by);

    const distanceFromBeacon = Math.abs(sx - bx) + Math.abs(sy - by);
    const distanceFromTargetLine = Math.abs(sy - targetLineIndex);

    const range = distanceFromBeacon - distanceFromTargetLine;

    if (range >= 0) {
      sensors.push([sx - range, sx + range]);
    } else {
      outOfRange.push([distanceFromBeacon, range, dx, dy]);
    }

    totalArea += dx * dy;
  }

  return [sensors, outOfRange, totalArea];
}

// eslint-disable-next-line max-statements
function computeAnswerForTargetLine(targetLineIndex, size) {
  const [sensors, outOfRange, totalArea] = processSensors(targetLineIndex);

  console.log("total area", totalArea);

  const starts = sensors.map((s) => s[0]);

  let index = Math.max(0, Math.min(...starts));

  const end = size;

  do {
    const ranges = sensors.filter((s) => s[0] <= index && s[1] >= index);

    if (ranges.length > 0) {
      const newIndex = Math.min(end, Math.max(...ranges.map((s) => s[1])));

      console.log("from", index, "to", newIndex);

      index = newIndex + 1;
    } else {
      console.log(
        "could not find a range for",
        index,
        "in",
        sensors
          .sort((a, b) => a[0] - b[0])
          .map((s) => {
            if (index < s[0]) {
              return ["*", ...s];
            }

            return [...s, "*"];
          })
      );

      console.log(outOfRange);

      index = Math.min(
        Number.POSITIVE_INFINITY,
        ...starts.filter((s) => s > index)
      );

      return index - 1;
    }
  } while (index < end);

  return null;
}

function computeAnswer() {
  const size = 4_000_000;

  for (let index = 0; index < size; index++) {
    const maybeAnswer = computeAnswerForTargetLine(index, size);

    if (maybeAnswer) {
      return [index, maybeAnswer];
    }
  }
}

readInput("15.txt", readLine, computeAnswer);
