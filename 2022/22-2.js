/* eslint-disable complexity */

// What a pain!
//       65       N
//  21  7WF4     WFE
//  3   8S3       S
// 54  9BE
// 6   aN1
//
// right of 1 -> right of 4 (upside down)
// bottom of 1 -> right of 3
// right of 3 -> bottom of 1
// right of 4 -> right of 1 (upside down)
// bottom of 4 -> right of 6
// right of 6 -> bottom of 4
// bottom of 6 -> top of 1
// left of 6 -> top of 2
// left of 5 -> left of 2 (upside down)
// top of 5 -> left of 3
// left of 3 -> top of 5
// left of 2 -> left of 5 (upside down)
// top of 2 -> left of 6

//
// Maybe build a graph that identifies front, east, west, south, north, and back
// Each face considers itself to be the front
// Each face has a 50x50 grid where each edge maps to another face's 50x50 grid
// The first face we read, we can see its east and its south
// The next face, we can see its west, but we've already seen it
// Then we can see a face with a north but we've already seen it
// We also see that face's south, which is new
// The next face, we can see an east, and it's the same as the previous face's south
// Okay, the west of my south is my west
// The north of my west is my north
// The A of my B is my A
// But from a different angle
// So every time you cross over an edge your rotate the cube
// keep track of coordinates (0-49,0-49)
// There are four ways to rotate the cube
// There are 6 orientations
// 2 axes of rotation (the third would spin the cube and not change the face)
// on the vertical, north and south rotate
// on the horizontal, east and west rotate
// rotation means that X and Y are transposed
// rotate right [x, y] = [-y, x]
// rotate left [x, y] = [y, -x]
// so when you go over an edge, you're rotating the cube either horizontally or vertically, either left or right
// maybe easier to think of x,y,z coordinates
// when x goes past 0, it stays at zero and z starts going up
// when x goes past 49, it stays at 49 and z starts going up
// unless z is 49, then it starts going back to 0
// so the faces could be labelled x=0, x=49, y=0, y=49, z=0, z=49
// the first face is z=0
// N/E/S/W are y=0,x=49,y=49,x=0
// when you're on the front face and going down, z will change next
// when you're on a side face and going down, x will change next
// so there's one axis that never changes unless you turn
// originally, you're going east, so that axis is y
// maybe the trick is to map x/y/z to row, column
// at first the column is x, the row is y
// when you go off the right edge, the column stays x and the row becomes y

const EDGES = [
  {
    name: "right of 1 -> right of 4 (upside down)",
    x: [50, 50],
    y: [0, 49],
    x1: [49, 49],
    y1: [149, 100],
    orientation: "W",
  },
  {
    name: "bottom of 1 -> right of 3",
    x: [50, 50],
    y: [0, 49],
    x1: [49, 49],
    y1: [149, 100],
    orientation: "W",
  },
];

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
