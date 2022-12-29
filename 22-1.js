/* eslint-disable complexity */
const ROTATIONS = {
  E: { L: "N", R: "S" },
  N: { L: "W", R: "E" },
  W: { L: "S", R: "N" },
  S: { L: "E", R: "W" },
};

const DELTAS = {
  E: { x: 1, y: 0 },
  N: { x: 0, y: -1 },
  W: { x: -1, y: 0 },
  S: { x: 0, y: 1 },
};

const ORIENTATION_SCORE = {
  E: 0,
  S: 1,
  W: 2,
  N: 3,
};

export function parseLine(line) {
  if (line.includes(".")) {
    return ["draw", line.split("")];
  }

  const distances = line.split(/[LR]/u).map(Number);
  const rotations = line.split(/\d+/u).slice(1);

  if (line === "") {
    return ["nothing"];
  }

  return [
    "moves",
    distances.map((d, index) => ({
      distance: d,
      rotation: rotations[index],
    })),
  ];
}

export function computeAnswer(instructions) {
  const grid = instructions
    .filter(([command]) => command === "draw")
    .map((x) => x[1]);
  const [, moves] = instructions.find(([command]) => command === "moves");

  const maxWidth = grid.reduce((max, row) => Math.max(max, row.length), 0);

  grid.forEach((row) => {
    row.push(...Array.from({ length: maxWidth - row.length }, () => " "));
  });

  let orientation = "E";

  let x = grid[0].indexOf(".");
  let y = 0;

  moves.forEach(({ distance, rotation }) => {
    for (let index = 0; index < distance; index++) {
      const oldX = x;
      const oldY = y;

      x += DELTAS[orientation].x;
      y += DELTAS[orientation].y;

      while (grid?.[y]?.[x] === " ") {
        x += DELTAS[orientation].x;
        y += DELTAS[orientation].y;
      }

      if (grid?.[y]?.[x] === undefined) {
        if (orientation === "E") {
          x = 0;
        }

        if (orientation === "W") {
          x = grid[0].length - 1;
        }

        if (orientation === "S") {
          y = 0;
        }

        if (orientation === "N") {
          y = grid.length - 1;
        }
      }

      while (grid?.[y]?.[x] === " ") {
        x += DELTAS[orientation].x;
        y += DELTAS[orientation].y;
      }

      if (grid[y][x] === "#") {
        x = oldX;
        y = oldY;

        break;
      }
    }

    if (rotation) {
      orientation = ROTATIONS[orientation][rotation];
    }
  });

  return [y + 1, x + 1, orientation];
}

export function hash([row, column, orientation]) {
  return 1000 * row + 4 * column + ORIENTATION_SCORE[orientation];
}
