import { readInput } from "./reader.js";

const grid = [];

const rotations = [];
const distances = [];

const GRID_WIDTH = 101;

const location = { x: 1, y: 1 };

let direction = { x: 1, y: 0 };

const hits = {
  rotate1: false,
  rotate2: false,
  rotate3: false,
  rotate4: false,
  revertStep: false,
  wrapRight: false,
  wrapLeft: false,
  wrapUp: false,
  wrapDown: false,
};

// eslint-disable-next-line complexity
function rotate({ x, y }, rotation) {
  // spent way too long trying to come up with a simple formula for this

  if (x === 1 && y === 0) {
    hits.rotate1 = true;

    return rotation === "L" ? { x: 0, y: -1 } : { x: 0, y: 1 };
  }

  if (x === 0 && y === -1) {
    hits.rotate2 = true;

    return rotation === "L" ? { x: -1, y: 0 } : { x: 1, y: 0 };
  }

  if (x === -1 && y === 0) {
    hits.rotate3 = true;

    return rotation === "L" ? { x: 0, y: 1 } : { x: 0, y: -1 };
  }

  if (x === 0 && y === 1) {
    hits.rotate4 = true;

    return rotation === "L" ? { x: 1, y: 0 } : { x: -1, y: 0 };
  }
}

function readLine(line, index) {
  if (index === 0) {
    grid.push(Array.from({ length: GRID_WIDTH }, () => "-"));
  }

  if (line.includes(".")) {
    grid.push([
      "-",
      ...line.split("").map((char) => (char === " " ? "-" : char)),
      ...Array.from({ length: GRID_WIDTH - line.length - 1 }, () => "-"),
    ]);
  }

  if (line.includes("R")) {
    distances.push(...line.split(/[LR]/u).map(Number));
    rotations.push(...line.split(/\d+/u).slice(1));
  }
}

function moveOneStep() {
  location.x += direction.x;
  location.y += direction.y;

  console.log("move one step to", location.x, location.y);
}

function revertStep() {
  hits.revertStep = true;
  location.x -= direction.x;
  location.y -= direction.y;

  moveThroughEmptySpace();

  console.log("bounce back to", location.x, location.y);
}

function moveThroughEmptySpace() {
  console.log("move through empty space");

  while (grid?.[location.y]?.[location.x] === "-") {
    moveOneStep();
  }

  console.log("/move through empty space");
}

function wrapAround() {
  console.log("wrap around");

  if (direction.x === 1) {
    hits.wrapRight = true;
    location.x = 0;
  }

  if (direction.x === -1) {
    hits.wrapLeft = true;
    location.x = GRID_WIDTH - 1;
  }

  if (direction.y === 1) {
    hits.wrapDown = true;
    location.y = 0;
  }

  if (direction.y === -1) {
    hits.wrapUp = true;
    location.y = grid.length - 1;
  }

  moveThroughEmptySpace();
}

function facingScore() {
  const { x, y } = direction;

  // right >
  if (x === 1 && y === 0) {
    return 0;
  }

  // down v
  if (x === 0 && y === 1) {
    return 1;
  }

  // left <
  if (x === -1 && y === 0) {
    return 2;
  }

  // up ^
  if (x === 0 && y === -1) {
    return 3;
  }
}

function computeAnswer() {
  distances.forEach((distance, index) => {
    const rotation = rotations[index];

    console.log(
      `${index}: taking ${distance} steps in direction ${direction.x}, ${direction.y}`
    );

    for (let step = 0; step < distance; step += 1) {
      moveOneStep();

      if (grid?.[location.y]?.[location.x] === "#") {
        console.log("hit a wall at", location.x, location.y);
        revertStep();

        break;
      }

      moveThroughEmptySpace();

      if (!grid?.[location.y]?.[location.x]) {
        wrapAround();
      }
    }

    if (rotation) {
      console.log("rotate", rotation);
      direction = rotate(direction, rotation);
    } else {
      console.log("done");
    }
  });

  console.log(location, direction);
  console.log(hits);

  grid[location.y][location.x] = "X";
  console.log(grid.map((row) => row.join("").replaceAll("-", " ")).join("\n"));

  return location.y * 1000 + location.x * 4 + facingScore();
}

readInput("22.txt", readLine, computeAnswer);

// 148362
