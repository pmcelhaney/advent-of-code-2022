/* eslint-disable complexity */
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
  const openValves = Object.values(valves).filter(
    (valve) => valve.rate > 0 && !remainingValves.includes(valve.name)
  );

  const pressure = openValves.reduce((sum, valve) => sum + valve.rate, 0);

  return `Valves ${openValves
    .map((v) => v.name)
    .join(", ")} are open, releasing ${pressure} pressure`;
}

const MINUTES = 26;

function pairsFromList(list, ordered) {
  if (list.length < 2) {
    return [];
  }

  const [head, ...tail] = list;

  return [
    ...tail.flatMap((item) =>
      ordered
        ? [
            [head, item],
            [item, head],
          ]
        : [[head, item]]
    ),
    ...pairsFromList(tail, ordered),
  ];
}

// eslint-disable-next-line max-params
function computeAnswer2(
  myPosition,
  remainingValves,
  elephantPosition = myPosition,
  clock = 0,
  myRemainingTime = 0,
  elephantRemainingTime = 0
) {
  const next = [];
  const events = [];

  events.push(`== Minute ${clock} ==`);

  //   reportValveState(remainingValves);

  if (clock >= MINUTES) {
    events.push("clock has run out");

    return { score: 0, events: [], myPath: [], elephantPath: [] };
  }

  if (myRemainingTime === 1) {
    events.push(`you arrived at valve ${myPosition} and are about to open it`);
  }

  if (myRemainingTime > 1) {
    events.push(`you are on your way to valve ${myPosition}`);
  }

  if (elephantRemainingTime === 1) {
    events.push(
      `elephant arrived at valve ${elephantPosition} and is about to open it`
    );
  }

  if (elephantRemainingTime > 1) {
    events.push(`elephant is on its way to valve ${elephantPosition}`);
  }

  const isMyValveOpen = myRemainingTime === 0;
  const isElephantValveOpen = elephantRemainingTime === 0;

  if (isMyValveOpen && isElephantValveOpen) {
    events.push(
      `you and the elephant opened valves ${myPosition} and ${elephantPosition} and now you're planning your next moves`
    );

    if (remainingValves.length === 0) {
      events.push("there are no valves left so you're done");
    } else if (remainingValves.length === 1) {
      const [lastValve] = remainingValves;

      const isElephantFurther =
        valves[lastValve].distances[myPosition] <
        valves[lastValve].distances[elephantPosition];

      events.push(
        `there is only one valve left (${lastValve}) so you ${
          isElephantFurther ? "you" : "the elephant"
        } will take it`
      );

      if (isElephantFurther) {
        next.push([
          lastValve,
          [],
          elephantPosition,
          clock + 1,
          valves[myPosition].distances[lastValve],
          MINUTES - clock - 1,
        ]);
      } else {
        next.push(
          ...remainingValves.map((name) => [
            myPosition,
            [],
            lastValve,
            clock + 1,
            MINUTES - clock - 1,
            valves[elephantPosition].distances[name],
          ])
        );
      }
    } else {
      const pairs = pairsFromList(
        remainingValves,
        elephantPosition !== myPosition
      );

      events.push(
        `your collective options are ${pairs
          .map(([me, elephant]) => `${me}/${elephant}`)
          .join(", ")}`
      );
      next.push(
        ...pairs.map(([me, elephant]) => [
          me,
          remainingValves.filter((name) => ![me, elephant].includes(name)),
          elephant,
          clock + 1,
          valves[myPosition].distances[me],
          valves[elephantPosition].distances[elephant],
        ])
      );
    }
  }

  if (isMyValveOpen && !isElephantValveOpen) {
    const nextMove = remainingValves.map((name, index) => [
      name,
      remainingValves.filter((_, position) => position !== index),
      elephantPosition,
      clock + 1,
      valves[myPosition].distances[name],
      elephantRemainingTime,
    ]);

    events.push(
      `you opened valve ${myPosition} and now you're planning your next move; your options are ${nextMove.map(
        (x) => x[2]
      )}`
    );

    next.push(...nextMove);
  }

  if (isElephantValveOpen && !isMyValveOpen) {
    const nextMove = remainingValves.map((name, index) => [
      myPosition,
      remainingValves.filter((_, position) => position !== index),
      name,
      clock + 1,
      myRemainingTime,
      valves[elephantPosition].distances[name],
    ]);

    events.push(
      `elephant opened valve ${elephantPosition} and planning its next move; its options are: ${nextMove.map(
        (x) => x[2]
      )}`
    );

    next.push(...nextMove);
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

      return (challenger.cheat && !incumbent.cheat) ||
        challenger.score > incumbent.score
        ? challenger
        : incumbent;
    },
    { score: 0, events: [], myPath: [], elephantPath: [] }
  );

  const closedValves = remainingValves;

  if (!isMyValveOpen) {
    closedValves.push(myPosition);
  }

  if (!isElephantValveOpen) {
    closedValves.push(elephantPosition);
  }

  events.push(reportValveState(closedValves));

  const result = {
    score: myScore + elephantScore + bestCase.score,
    events: [events, ...bestCase.events],
    myPath: [myPosition, ...bestCase.myPath],
    elephantPath: [elephantPosition, ...bestCase.elephantPath],
    cheat: bestCase.cheat,
  };

  if (
    clock === 1 &&
    myPosition === "JJ" &&
    elephantPosition === "BB"

    // ||
    // result.myPath
    //   .reduce((a, b) => (a.slice(-2) === b ? a : `${a}${b}`), "")
    //   .startsWith("JJBB")
  ) {
    console.log(result);

    throw new Error("cheat");

    return { ...result, cheat: true };
  }

  return result;
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
