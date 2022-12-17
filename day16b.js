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
  };
}

// eslint-disable-next-line max-params
function calculateDistanceBetweenValves(start, end, steps = 0, visited = []) {
  if (start === end) {
    return steps;
  }

  if (valves[start].tunnels.includes(end)) {
    return steps + 1;
  }

  if (valves[start].distances[end] !== undefined) {
    return steps + valves[start].distances[end];
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

function computeAnswer2(me, elephant, openValves, clock) {
  if (clock <= 0) {
    return 0;
  }

  const next = openValves.map((name, index) => [
    name,
    elephant,
    openValves.filter((_, position) => position !== index),
    clock - valves[name].distances[me] - 1, // clock - time to reach next room - time to open this valve
  ]);

  const score = valves[me].rate * clock;

  // get the score for this room (for AA it will be 0)
  // get the score for each of the next rooms
  // return this score plus max of the next rooms

  return (
    score +
    Math.max(
      0,
      ...next.map(([us, them, open, remainingTime]) =>
        computeAnswer2(us, them, open, remainingTime)
      )
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
  console.log("found minimum distances");

  return computeAnswer2("AA", "AA", usefulValves, 26);
}

readInput("16.txt", readLine, computeAnswer);
