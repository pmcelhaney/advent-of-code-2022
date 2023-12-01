import { fileURLToPath } from "node:url";
import readline from "node:readline";
import { createReadStream } from "node:fs";
import { readdir } from "node:fs/promises";

import { stringify } from "flatted";

const dirname = fileURLToPath(new URL(".", import.meta.url));

function createReader(filename) {
  const input = createReadStream(`${dirname}inputs/${filename}`);

  return readline.createInterface({ input });
}

function consumeLineDefault(line) {
  if (line.startsWith("ANSWER1=")) {
    return {
      lines: [],
      answer1: line.slice(8).trim(),
    };
  }

  if (line.startsWith("RESULT1=")) {
    return {
      lines: [],
      result1: JSON.parse(line.slice(8)),
    };
  }

  if (line.startsWith("ANSWER2=")) {
    return {
      lines: [],
      answer2: line.slice(8),
    };
  }

  if (line.startsWith("RESULT2=")) {
    return {
      lines: [],
      result2: JSON.parse(line.slice(8)),
    };
  }

  return {
    lines: [line],
  };
}

function testOne({
  puzzleNumber,
  inputFilename,
  part,
  parseLine,
  computeAnswer,
  hash,
  consumeLine = consumeLineDefault,
}) {
  performance.mark("start");

  const reader = createReader(`${inputFilename}`);

  const commands = [];

  const context = {};

  let lineNumber = 0;

  reader.on("line", (line) => {
    Object.assign(
      context,
      consumeLine(line, lineNumber++, context, consumeLineDefault)
    );

    commands.push(...context.lines.map(parseLine));
  });

  reader.on("close", () => {
    performance.mark("startComputation");

    const answer = computeAnswer(commands, context.initialState);

    performance.mark("end");

    if (
      context[`result${part}`] !== undefined &&
      stringify(answer) !== stringify(context[`result${part}`])
    ) {
      console.error(
        `Puzzle ${puzzleNumber} part ${part} with input "${inputFilename}" failed`
      );
      console.error("Expected:", context[`result${part}`]);
      console.error("Actual:", answer);

      return;
    }

    const hashResult = hash(answer);

    if (
      context[`answer${part}`] !== undefined &&
      hashResult.toString() !== context[`answer${part}`]
    ) {
      console.error(
        `Puzzle ${puzzleNumber} part ${part} with input "${inputFilename}" failed (hash)`
      );
      console.error("Expected:", context[`answer${part}`]);
      console.error("Actual:", hashResult);

      return;
    }

    console.log(
      `Puzzle ${puzzleNumber} part ${part} with input "${inputFilename}" completed in ${Math.round(
        performance.measure("time", "start", "end").duration
      )}ms total, ${Math.round(
        performance.measure("time", "start", "end").duration
      )}ms for computation (`,
      hashResult,
      ")"
    );

    if (context[`answer${part}`] !== undefined) {
      return;
    }

    console.log("Result:", answer);
    console.log("Answer:", hashResult);
  });
}

// eslint-disable-next-line unicorn/no-unreadable-array-destructuring
const [, , puzzleNumber, part = 1, inputName = ""] = process.argv;

if (!puzzleNumber) {
  console.log(
    "usage: node advent-of-code.js <puzzle number> [part] [input name]"
  );
  process.exit(0);
}

if (!/^\d+$/u.test(puzzleNumber)) {
  throw new Error("Puzzle number must be a number");
}

if (part && !/^[12]$/u.test(part)) {
  throw new Error("Part must be 1 or 2");
}

if (inputName && !/^[a-z-]+$/iu.test(inputName)) {
  throw new Error(
    `input name (${inputName}) must only contain letters and dashes`
  );
}

const inputFiles = await readdir(`${dirname}inputs`);

const matchingInputFiles = inputFiles.filter((filename) =>
  filename.startsWith(`${puzzleNumber}-${part}`)
);

matchingInputFiles.forEach(async (filename) => {
  // eslint-disable-next-line import/no-dynamic-require
  const instructions = await import(`./${puzzleNumber}-${part}.js`);

  const testInstructions = {
    parseLine: (line) => line,
    computeAnswer: (commands) => commands,
    hash: (x) => x,
    consumeLine: consumeLineDefault,
    inputFilename: filename,
    puzzleNumber,
    part,
    ...instructions,
  };

  testOne(testInstructions);
});

if (matchingInputFiles.length === 0) {
  console.error(
    `No input files found for puzzle ${puzzleNumber} matching "${inputName}"`
  );
}
