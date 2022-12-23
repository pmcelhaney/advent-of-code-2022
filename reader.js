import fs from "node:fs";
import { URL, fileURLToPath } from "node:url";
import readline from "node:readline";
import { performance } from "node:perf_hooks";
import { inherits } from "node:util";

const dirname = fileURLToPath(new URL(".", import.meta.url));

export function createReader(filename) {
  const input = fs.createReadStream(`${dirname}./inputs/${filename}`);

  return readline.createInterface({ input });
}

export function test(filename, readLine, answer, hash) {
  performance.mark("start");

  const reader = createReader(filename);

  let lineNumber = 0;

  reader.on("line", (line) => readLine(line, lineNumber++));

  reader.on("close", () => {
    const result = answer(commands, initialState);

    console.log("Result:", result);
    console.log("Answer:", hash(computation));

    performance.mark("end");

    console.log(
      `Completed in ${Math.round(
        performance.measure("time", "start", "end").duration
      )}ms`
    );
  });
}
