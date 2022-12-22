import { readInput } from "./reader.js";

const grid = [];

const rotations = [];
const distances = [];

let gridWidth = 0;

const location = { x: 1, y: 1 };

let direction = { x: 1, y: 0 };

// eslint-disable-next-line complexity
function rotate({ x, y }, rotation) {
  // spent way too long trying to come up with a simple formula for this

  if (x === 1 && y === 0) {
    return rotation === "L" ? { x: 0, y: -1 } : { x: 0, y: 1 };
  }

  if (x === 0 && y === -1) {
    return rotation === "L" ? { x: -1, y: 0 } : { x: 1, y: 0 };
  }

  if (x === -1 && y === 0) {
    return rotation === "L" ? { x: 0, y: 1 } : { x: 0, y: -1 };
  }

  if (x === 0 && y === 1) {
    return rotation === "L" ? { x: 1, y: 0 } : { x: -1, y: 0 };
  }
}

function readLine(line, index) {
  if (index === 0) {
    gridWidth = line.length;
    grid.push(Array.from({ length: gridWidth }, () => " "));
  }

  if (line.includes(".")) {
    grid.push([" ", ...line.split("")]);
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
  location.x -= direction.x;
  location.y -= direction.y;

  console.log("bounce back to", location.x, location.y);
}

function moveThroughEmptySpace() {
  console.log("move through empty space");

  while (grid?.[location.y]?.[location.x] === " ") {
    moveOneStep();
  }

  console.log("/move through empty space");
}

function wrapAround() {
  console.log("wrap around");

  if (direction.x === 1) {
    location.x = 0;
  }

  if (direction.x === -1) {
    location.x = gridWidth - 1;
  }

  if (direction.y === 1) {
    location.y = 0;
  }

  if (direction.y === -1) {
    location.y = gridWidth - 1;
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
      console.log("done", rotations);
    }
  });

  console.log(grid.map((row) => row.join("")).join("\n"));

  return location.y * 1000 + location.x * 4 + facingScore();
}

readInput("22.txt", readLine, computeAnswer);
