import { createReader } from "./reader.js";

const reader = createReader("3.txt");

function findDuplicate(sacks) {
  const sack1 = sacks.slice(0, sacks.length / 2);
  const sack2 = sacks.slice(sacks.length / 2);

  for (const item of sack1) {
    if (sack2.includes(item)) {
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
  sum += priority(findDuplicate(line));
});

reader.on("close", () => {
  console.log(sum);
});

export default 0;
