import { readInput } from "./reader.js";

const rope = [
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
];

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
    rope[0][0] += deltaY[direction];
    rope[0][1] += deltaX[direction];

    for (let index = 0; index < rope.length - 2; index += 1) {
      const H = rope[index];
      const T = rope[index + 1];

      closeGap(H, T);

      if (index === 8) {
        visited.add(T.join(","));
      }
    }
  }
}

function closeGap(H, T) {
  if (
    T[0] !== H[0] &&
    T[1] !== H[1] &&
    (Math.abs(T[0] - H[0]) > 1 || Math.abs(T[1] - H[1]) > 1)
  ) {
    return closeGapDiagonal(H, T);
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

function closeGapDiagonal(H, T) {
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

readInput(
  "9.txt",
  (line) => {
    const [direction, distance] = line.split(" ");

    move(direction, Number(distance));
  },
  () => visited.size
);
