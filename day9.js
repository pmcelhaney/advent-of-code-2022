import { readInput } from "./reader.js";

const H = [0, 0];
const T = [0, 0];

const visited = new Set();

visited.add("0,0");

function move(direction, distance) {
  const deltaX = {
    U: 0,
    D: 0,
    L: -1,
    R: 1,
  };

  const deltaY = {
    U: 1,
    D: -1,
    L: 0,
    R: 0,
  };

  for (let steps = 0; steps < distance; steps += 1) {
    H[0] += deltaY[direction];
    H[1] += deltaX[direction];

    closeGap();
    visited.add(T.join(","));
    print();
  }
}

function closeGap() {
  if (
    T[0] !== H[0] &&
    T[1] !== H[1] &&
    (Math.abs(T[0] - H[0]) > 1 || Math.abs(T[1] - H[1]) > 1)
  ) {
    return closeGapDiagonal();
  }

  while (T[0] < H[0] - 1) {
    T[0] += 1;
  }

  while (T[0] > H[0] + 1) {
    T[0] -= 1;
  }

  while (T[1] < H[1] - 1) {
    T[1] += 1;
  }

  while (T[1] > H[1] + 1) {
    T[1] -= 1;
  }
}

function closeGapDiagonal() {
  if (T[0] < H[0]) {
    T[0] += 1;
  }

  if (T[0] > H[0]) {
    T[0] -= 1;
  }

  if (T[1] < H[1]) {
    T[1] += 1;
  }

  if (T[1] > H[1]) {
    T[1] -= 1;
  }
}

function print() {
  return;

  const grid = Array.from({ length: 10_000 }, () =>
    Array.from({ length: 10_000 }, () => ".")
  );

  grid[T[0]][T[1]] = "T";
  grid[H[0]][H[1]] = "H";

  const copy = Array.from(grid);

  console.log(
    `${copy
      .reverse()
      .map((row) => row.join(""))
      .join("\n")}\n\n`
  );
}

print();

readInput(
  "9.txt",
  (line) => {
    const [direction, distance] = line.split(" ");

    console.log(`\n\n== ${line} ==`);
    move(direction, Number(distance));
  },
  () => visited.size
);
