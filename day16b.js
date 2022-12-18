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

function reportValveState(remainingValves) {
  const openValves = remainingValves.filter(
    (valve) => valves[valve].rate === 0 && !remainingValves.includes(valve)
  );

  console.log("Valves", openValves, "are open");
}

const MINUTES = 26;

// eslint-disable-next-line max-params
function computeAnswer2(
  myPosition,
  remainingValves,
  elephantPosition = myPosition,
  clock = 0,
  myRemainingTime = 0,
  elephantRemainingTime = 0
) {
  //   console.log(`== Minute ${clock} ==`);
  //   reportValveState(remainingValves);

  if (clock >= MINUTES) {
    // console.log("clock has run out");

    return { score: 0, path: [] };
  }

  //   if (myRemainingTime === 1) {
  //     console.log("you arrived at valve", myPosition, "and are about to open it");
  //   }

  //   if (myRemainingTime > 0 && myRemainingTime !== 1) {
  //     console.log("you are on your way to valve", myPosition);
  //   }

  //   if (myRemainingTime === 0) {
  //     console.log(
  //       "you opened valve",
  //       myPosition,
  //       "and now you're planning your next move"
  //     );
  //   }

  const isMyValveOpen = myRemainingTime === 0;
  const isElephantValveOpen = elephantRemainingTime === 0;

  const next = [];
  const valvesOpened = [];

  if (isMyValveOpen) {
    // console.log(
    //   "you opened valve",
    //   myPosition,
    //   "and now you're planning your next move"
    // );
    valvesOpened.push(myPosition);
    next.push(
      ...remainingValves.map((name, index) => [
        name,
        remainingValves.filter((_, position) => position !== index),
        elephantPosition,
        clock + 1,
        valves[name].distances[myPosition],
        elephantRemainingTime,
      ])
    );
  }

  if (isElephantValveOpen) {
    // console.log(
    //   "elephant opened valve",
    //   elephantPosition,
    //   "and now it's planning its next move"
    // );
    valvesOpened.push(elephantPosition.toLowerCase());
    next.push(
      ...remainingValves.map((name, index) => [
        myPosition,
        remainingValves.filter((_, position) => position !== index),
        name,
        clock + 1,
        myRemainingTime,
        valves[name].distances[elephantPosition],
      ])
    );
  }

  if (!isMyValveOpen && !isElephantValveOpen) {
    next.push([
      myPosition,
      remainingValves,
      elephantPosition,
      clock + 1,
      myRemainingTime - 1,
      elephantRemainingTime - 1,
    ]);
  }

  const myScore = isMyValveOpen
    ? valves[myPosition].rate * (MINUTES - clock)
    : 0;

  const elephantScore = isElephantValveOpen
    ? valves[elephantPosition].rate * (MINUTES - clock)
    : 0;

  const bestCase = next.reduce(
    (incumbent, args) => {
      const challenger = computeAnswer2(...args);

      return challenger.score > incumbent.score ? challenger : incumbent;
    },
    { score: 0, path: [] }
  );

  return {
    score: myScore + elephantScore + bestCase.score,
    path: [...valvesOpened, ...bestCase.path],
  };
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

  return computeAnswer2("AA", usefulValves);
}

readInput("16.txt", readLine, computeAnswer);
