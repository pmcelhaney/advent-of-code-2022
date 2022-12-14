import fs from "node:fs";
import { URL, fileURLToPath } from "node:url";
import readline from "node:readline";

const dirname = fileURLToPath(new URL(".", import.meta.url));

export function createReader(filename) {
  const input = fs.createReadStream(`${dirname}./inputs/${filename}`);

  return readline.createInterface({ input });
}

export function readInput(filename, readLine, answer) {
  performance.mark("start");

  const reader = createReader(filename);

  let lineNumber = 0;

  // eslint-disable-next-line no-plusplus
  reader.on("line", (line) => readLine(line, lineNumber++));

  reader.on("close", async () => {
    // eslint-disable-next-line no-console, no-undef
    console.log(`Answer: ${answer()}`);

    performance.mark("end");

    console.log(
      `Completed in ${Math.round(
        performance.measure("time", "start", "end").duration
      )}ms`
    );
  });
}
