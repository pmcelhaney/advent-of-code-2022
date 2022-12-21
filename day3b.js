import { createReader } from "./reader.js";

const reader = createReader("3.txt");

const group = [];

function findDuplicate(sack1, sack2, sack3) {
  for (const item of sack1) {
    if (sack2.includes(item) && sack3.includes(item)) {
      return item;
    }
  }

  return "?";
}

function priority(item) {
  if (/[A-Z]/u.test(item)) {
    return item.charCodeAt(0) - 64 + 26;
  }

  return item.charCodeAt(0) - 96;
}

let sum = 0;

reader.on("line", (line) => {
  group.push(line);

  if (group.length === 3) {
    sum += priority(findDuplicate(...group));
    group.length = 0;
  }
});

reader.on("close", () => {
  console.log(sum);
});
