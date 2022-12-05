import { createReader } from "./reader.js";

const reader = createReader("4.txt");

function fullyContains(line) {
  const [a, b] = line.split(",");
  const [aMin, aMax] = a.split("-").map(Number);
  const [bMin, bMax] = b.split("-").map(Number);

  return (aMin <= bMin && bMax <= aMax) || (bMin <= aMin && aMax <= bMax);
}

let sum = 0;

reader.on("line", (line) => {
  if (fullyContains(line)) {
    sum += 1;
  }
});

reader.on("close", () => {
  console.log(sum);
});
