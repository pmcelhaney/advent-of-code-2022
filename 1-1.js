export function parseLine(line) {
  if (line === "") {
    return ["sum"];
  }

  return ["add", Number.parseInt(line, 10)];
}

export function computeAnswer(commands) {
  let currentSum = 0;

  const sums = [];

  for (const [command, value] of commands) {
    if (command === "sum") {
      sums.push(currentSum);
      currentSum = 0;
    } else {
      currentSum += value;
    }
  }

  return sums;
}

export function hash(answer) {
  return Math.max(...answer);
}
