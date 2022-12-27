export function parseLine(line) {
  if (line.includes(".")) {
    return ["draw", line.split("")];
  }

  return ["move", line.split("")];
}

export function computeAnswer(instructions, index) {
  const builds = instructions
    .filter(([command]) => command === "draw")
    .map((x) => x[1]);
  const [moves] = instructions.find(([command]) => command === "move");

  const cells = {};

  builds.forEach((row, zeroIndexColumnNumber) => {
    row.forEach((type, zeroIndexRowNumber) => {
      const rowNumber = zeroIndexRowNumber + 1;
      const columnNumber = zeroIndexColumnNumber + 1;
      const cell = {
        type,
        row: rowNumber,
        column: columnNumber,
      };

      if (type !== ".") {
        return;
      }

      cells[`${columnNumber},${rowNumber}`] = cell;

      const above = cells[`${columnNumber},${rowNumber - 1}`];
      const left = cells[`${columnNumber - 1},${rowNumber}`];

      if (above?.type === ".") {
        cell.up = above;
        above.down = cell;
      }

      if (left?.type === ".") {
        cell.left = left;
        left.right = cell;
      }
    });
  });

  return cells["1,9"];
}

export function hash(answer) {
  return topLeft;
}
