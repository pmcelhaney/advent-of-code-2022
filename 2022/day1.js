import { createReader } from "./reader.js";

const reader = createReader("1.txt");

let sum = 0;
let max = 0;

reader.on("line", (line) => {
  if (line === "") {
    max = Math.max(max, sum);
    sum = 0;

    return;
  }

  sum += Number.parseInt(line, 10);
});

reader.on("close", () => {
  console.log(max);
});
