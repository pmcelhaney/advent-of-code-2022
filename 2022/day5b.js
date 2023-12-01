import { createReader } from "./reader.js";

const reader = createReader("5.txt");

const stacks = [[], [], [], [], [], [], [], [], []];

function readItemsOnStacks(line) {
  const items = [];

  for (let index = 0; index < 9; index += 1) {
    const item = line[1 + index * 4];

    if (item) {
      items.push([index, item]);
    }
  }

  return items;
}

function addItemsToStacks(line) {
  const items = readItemsOnStacks(line);

  for (const [index, item] of items) {
    if (item !== " ") {
      stacks[index].unshift(item);
    }
  }
}

function parseMove(line) {
  const parts = line.split(" ");

  return {
    howMany: Number(parts[1]),
    from: Number(parts[3]),
    to: Number(parts[5]),
  };
}

function executeMove({ howMany, from, to }) {
  const items = stacks[from - 1].splice(-1 * howMany);

  stacks[to - 1].push(...items);
}

function topOfEachStack() {
  return stacks.map((stack) => stack.at(-1)).join("");
}

reader.on("line", (line) => {
  if (line.includes("[")) {
    addItemsToStacks(line);
  }

  if (line.startsWith("move")) {
    console.log(stacks);
    executeMove(parseMove(line));
  }
});

reader.on("close", () => {
  console.log(topOfEachStack());
});
