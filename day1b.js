import { createReader } from "./reader.js";

const reader = createReader("1.txt");

let sum = 0;
let max = 0;

const sums = [];

reader.on("line", (line) => {
  if (line === "") {
    max = Math.max(max, sum);
    sum = 0;

    return;
  }

  sum += Number.parseInt(line, 10);
  sums.push(sum);
});

reader.on("close", () => {
  const [a, b, c] = sums.sort((a, b) => b - a);

  console.log(a + b + c);
});
