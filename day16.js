/* eslint-disable max-statements */
/* eslint-disable regexp/prefer-named-capture-group */
/* eslint-disable prefer-named-capture-group */

// Okay I think I've got it.
// If you only have 5 steps, what's the best path?
// From that point, if you only have 5 more steps, what's the best path?
// etc.

// Or maybe you go the best option that's one step away (if there is one, otherwise the best option that's 2 steps away, etc.)

// Or maybe you calculate the value each valve will generate if you go directly to it, and take the best one
// Wait, that sounds reasonable.
// Because if A and then B is better than B and then C, and I only have time for one of them, surely A is better?
// And that fits with this being a simple programming problem, not friggin waiting travel salesman.
// Oh, no, that doesn't work because B might have half the rate of A, but B is a small detour on the way to A.
// So if I only have 2 steps left, go directly to A. If I have 3 steps, I can go to B and then A.

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

// make this a generator
// we only need to take 10 items
// give each of the 15 a chance to go first
// give each of the remaining 14 a chance to go second
// give each of the remaining 13 a chance to go third
// etc.
// So we have an array of 10 integers
// The first one counts from 0 to 14
// The second one counts from 0 to 13, then increments the first and resets to 0
// etc.
// when the first integer hits 15 we're done

// ah crap that would still be 15 billion permutations (https://www.wolframalpha.com/input?i=10+permutations+of+15)

// This isn't quite right but it's close.
function* permutationGenerator(items, count = 10) {
  const digit = Array.from(items, () => 0);

  let position = 0;

  while (digit[count - 1] < items.length) {
    if (digit[position] === items.length - position) {
      position += 1;

      if (position > count) {
        position = 0;
      }

      digit[position] = 0;
    }

    // now use the 10 digits to make a permutation
    const available = Array.from({ length: count }, () => true);
    const permutation = [];

    for (let index = 0; index < count; index += 1) {
      permutation.push(items[available.indexOf(true, index)]);
      available[index] = false;
    }

    console.log(digit);
    yield permutation;
    digit[position] += 1;
  }
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

function computeAnswer2(room, openValves, clock) {
  if (clock <= 0) {
    return 0;
  }

  const next = openValves.map((name, index) => [
    name,
    openValves.filter((_, position) => position !== index),
    clock - valves[name].distances[room] - 1, // clock - time to reach next room - time to open this valve
  ]);

  const score = valves[room].rate * clock;

  // get the score for this room (for AA it will be 0)
  // get the score for each of the next rooms
  // return this score plus max of the next rooms

  return (
    score +
    Math.max(
      0,
      ...next.map(([name, open, clock]) => computeAnswer2(name, open, clock))
    )
  );
}

function computeAnswer() {
  // find the minimum distance from each point to every other point

  const usefulValves = Object.values(valves)
    .filter((valve) => valve.rate > 0)
    .sort((a, b) => (a.rate > b.rate ? -1 : 1))
    .map((valve) => valve.name);

  Object.values(valves).forEach((valve) => {
    Object.values(valves).forEach((other) => {
      valves[valve.name].distances[other.name] = calculateDistanceBetweenValves(
        valve.name,
        other.name
      );
    });
  });

  return computeAnswer2("AA", usefulValves, 30);

  console.log("found minimum distances");

  // const naiveGuess = ["AA"].concat(
  //   Object.values(valves)
  //     .filter((valve) => valve.rate > 0)
  //     .sort((a, b) => (a.rate > b.rate ? -1 : 1))
  //     .map((a) => a.name)
  // );

  // return scorePath(naiveGuess);

  const paths = permutations(usefulValves);

  console.log(`found ${paths.length} path permutations`);

  return Math.max(1337, ...paths.map((path) => scorePath(["AA", ...path])));
}

readInput("16.txt", readLine, computeAnswer);
