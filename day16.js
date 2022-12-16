/* eslint-disable max-statements */
/* eslint-disable regexp/prefer-named-capture-group */
/* eslint-disable prefer-named-capture-group */

import { readInput } from "./reader.js";

const valves = {};

function confirmParsing(line, [valve, rate, ...tunnels]) {
  const reproduction = `Valve ${valve} has flow rate=${rate}; ${
    tunnels.length === 1 ? "tunnel leads" : "tunnels lead"
  } to ${tunnels.length === 1 ? "valve" : "valves"} ${tunnels.join(", ")}`;

  if (line !== reproduction) {
    throw new Error(`Parsing error:\n${line}\n${reproduction}`);
  }
}

function readLine(line) {
  const [valve, rate, ...tunnels] = line.match(/([A-Z]{2}|\d+)/gu);

  confirmParsing(line, [valve, rate, ...tunnels]);

  valves[valve] = {
    rate: Number(rate),
    tunnels,
    name: valve,
    distances: {},

    // [Symbol.for("nodejs.util.inspect.custom")](depth, options, inspect) {
    //   return `${valve} ${this.rate} ${this.exits}`;
    // },
  };
}

// eslint-disable-next-line max-params
function calculateDistanceBetweenValves(start, end, steps = 0, visited = []) {
  if (steps > 9999) {
    return 10_000;
  }

  if (start === end) {
    return steps;
  }

  if (valves[start].tunnels.includes(end)) {
    return steps + 1;
  }

  if (visited.includes(start)) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.min(
    ...valves[start].tunnels.map((next) =>
      calculateDistanceBetweenValves(next, end, steps + 1, [...visited, start])
    )
  );
}

function permutations(array) {
  if (array.length === 1) {
    return [array];
  }

  const [first, ...rest] = array;

  return permutations(rest).flatMap((permutation) =>
    array.map((_, index) => [
      ...permutation.slice(0, index),
      first,
      ...permutation.slice(index),
    ])
  );
}

function scorePath(path) {
  let score = 0;

  let clock = 30;

  for (let index = 0; index < path.length - 1; index += 1) {
    const name = path[index];
    const next = path[index + 1];

    const distance = valves[name].distances[next];

    if (distance > clock) {
      return Number.NEGATIVE_INFINITY;
    }

    clock -= distance;

    clock -= 1;

    const increase = valves[next].rate * clock;

    score += increase;
  }

  return score;
}

function computeAnswer() {
  // find the minimum distance from each point to every other point

  const usefulValves = Object.values(valves)
    .filter((valve) => valve.rate > 0)
    .map((valve) => valve.name);

  Object.values(valves).forEach((valve) => {
    Object.values(valves).forEach((other) => {
      valves[valve.name].distances[other.name] = calculateDistanceBetweenValves(
        valve.name,
        other.name
      );
    });
  });

  console.log("found minimum distances");

  // const naiveGuess = ["AA"].concat(
  //   Object.values(valves)
  //     .filter((valve) => valve.rate > 0)
  //     .sort((a, b) => (a.rate > b.rate ? -1 : 1))
  //     .map((a) => a.name)
  // );

  // return scorePath(naiveGuess);

  const paths = permutations(usefulValves);

  console.log("found path permutations");

  return Math.max(...paths.map((path) => scorePath(["AA", ...path])));
}

readInput("16.txt", readLine, computeAnswer);
