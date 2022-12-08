import fs from "node:fs";
import { URL, fileURLToPath } from "node:url";
import readline from "node:readline";

const dirname = fileURLToPath(new URL(".", import.meta.url));

export function createReader(filename) {
  const input = fs.createReadStream(`${dirname}./inputs/${filename}`);

  return readline.createInterface({ input });
}

export function readInput(filename, readLine, answer) {
  const reader = createReader(filename);

  reader.on("line", readLine);

  reader.on("close", () => {
    // eslint-disable-next-line no-console, no-undef
    console.log(answer());
  });
}
