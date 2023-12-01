export function parseLine(line) {
  const numbers = line.match(/\d/gu).map(Number);

  return numbers.at(0) * 10 + numbers.at(-1);
}

export function computeAnswer(commands) {
  return commands;
}

export function hash(answer) {
  return answer.reduce((a, b) => a + b, 0);
}
