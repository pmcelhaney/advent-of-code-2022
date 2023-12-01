import { createReader } from "./reader.js";

const reader = createReader("5.txt");

let sum = 0;

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
  for (let remaining = howMany; remaining > 0; remaining -= 1) {
    const item = stacks[from - 1].pop();

    stacks[to - 1].push(item);
  }
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

  sum += 1;
});

reader.on("close", () => {
  console.log("-----");
  console.log(stacks);
  console.log(topOfEachStack());
});
