export function parseLine(line) {
  return line.split(" ");
}

export function computeAnswer(commands) {
  return commands[0];
}

export function hash(answer) {
  return answer.join(" ");
}
