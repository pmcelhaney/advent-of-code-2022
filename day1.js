import fs from "node:fs";
import { URL, fileURLToPath } from "node:url";
import readline from "node:readline";

const dirname = fileURLToPath(new URL(".", import.meta.url));

const input = fs.createReadStream(`${dirname}./inputs/1.txt`);

const reader = readline.createInterface({ input });

let max = 0;

let sum = 0;

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
