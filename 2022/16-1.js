function calculateDistanceBetweenValves(
  valves,
  start,
  end,
  steps = 0,
  visited = []
) {
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
      calculateDistanceBetweenValves(valves, next, end, steps + 1, [
        ...visited,
        start,
      ])
    )
  );
}

function solve(valves, room, openValves, clock) {
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
      ...next.map(([name, open, clock]) => solve(valves, name, open, clock))
    )
  );
}

export function parseLine(line) {
  const [name, rate, ...tunnels] = line.match(/([A-Z]{2}|\d+)/gu);

  return {
    name,
    rate,
    tunnels,
    distances: {},
  };
}

export function computeAnswer(instructions) {
  const valves = Object.fromEntries(instructions.map((o) => [o.name, o]));

  Object.values(valves).forEach((valve) => {
    Object.values(valves).forEach((other) => {
      valves[valve.name].distances[other.name] = calculateDistanceBetweenValves(
        valves,
        valve.name,
        other.name
      );
    });
  });

  const usefulValves = Object.values(valves)
    .filter((valve) => valve.rate > 0)
    .sort((a, b) => (a.rate > b.rate ? -1 : 1))
    .map((valve) => valve.name);

  return solve(valves, "AA", usefulValves, 30);
}
