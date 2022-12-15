/* eslint-disable no-loop-func */
// for part 2, add this to the end of the input: 0,157 -> 999,157
// part 2 misses the final grain -- at this point I'm to tired to care

import { readInput } from "./reader.js";

const TARGET_LINE_INDEX = 2_000_000;

const sensors = [];

const beaconsInTheLine = new Set();

function readLine(line) {
  const [sx, sy, bx, by] = line.match(/\d+/gu).map(Number);

  const distanceFromBeacon = Math.abs(sx - bx) + Math.abs(sy - by);
  const distanceFromTargetLine = Math.abs(sy - TARGET_LINE_INDEX);

  const range = distanceFromBeacon - distanceFromTargetLine;

  if (range >= 0) {
    sensors.push([sx - range, sx + range, line]);
  }

  if (by === TARGET_LINE_INDEX) {
    beaconsInTheLine.add(bx);
  }
}

// eslint-disable-next-line max-statements
function computerAnswerForIndex() {
  const starts = sensors.map((s) => s[0]);
  const ends = sensors.map((s) => s[1]);

  let index = Math.min(...starts);

  const end = Math.max(...ends);

  let count = 0;

  do {
    const ranges = sensors.filter((s) => s[0] <= index && s[1] >= index);

    if (ranges.length > 0) {
      const newIndex = Math.max(...ranges.map((s) => s[1]));

      count += newIndex - index + 1;

      // console.log(index, newIndex, newIndex - index + 1);

      index = newIndex + 1;
    } else {
      console.log("got to else");
      index = Math.min([
        Number.POSITIVE_INFINITY,
        ...starts.filter((s) => s > index),
      ]);
    }
  } while (index <= end);

  console.log("final index", index);

  return count - beaconsInTheLine.size;
}

readInput("15.txt", readLine, computeAnswer);
