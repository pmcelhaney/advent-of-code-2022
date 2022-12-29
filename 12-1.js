let cache;

function memoShortestDistance(grid, start, end, path) {
  if (cache[`${start},${end}`]) {
    return cache[`${start},${end}`];
  }

  return shortestDistance(grid, start, end, path);
}

function shortestDistance(grid, start, end, path = []) {
  if (start.x === end.x && start.y === end.y) {
    return 0;
  }

  if (path.includes(`${start.x},${start.y}`)) {
    return Number.POSITIVE_INFINITY;
  }

  const neighbors = [
    { x: start.x, y: start.y - 1 },
    { x: start.x, y: start.y + 1 },
    { x: start.x - 1, y: start.y },
    { x: start.x + 1, y: start.y },
  ].filter(
    (neighbor) =>
      grid?.[neighbor.y]?.[neighbor.x] &&
      grid[neighbor.y][neighbor.x] <= grid[start.y][start.x] + 1
  );

  if (neighbors.length === 0) {
    return Number.POSITIVE_INFINITY;
  }

  return (
    1 +
    Math.min(
      ...neighbors.map((neighbor) =>
        memoShortestDistance(grid, neighbor, end, [
          ...path,
          `${start.x},${start.y}`,
        ])
      )
    )
  );
}

export function parseLine(line) {
  return line.split("");
}
export function computeAnswer(instructions) {
  cache = {};

  const grid = instructions.map((row) =>
    row.map((cell) => {
      if (cell === "S") {
        return "a".codePointAt(0);
      }

      if (cell === "E") {
        return "z".codePointAt(0);
      }

      return cell.codePointAt(0);
    })
  );

  const startRow = instructions.findIndex((row) => row.includes("S"));
  const startColumn = instructions[startRow].indexOf("S");
  const endRow = instructions.findIndex((row) => row.includes("E"));
  const endColumn = instructions[endRow].indexOf("E");

  return shortestDistance(
    grid,
    { x: startColumn, y: startRow },
    { x: endColumn, y: endRow }
  );
}

export function hash(x) {
  return x;
}
