import { readInput } from "./reader.js";

const monkeys = {};

const operations = {
  "+": (a, b) => a + b,
  "*": (a, b) => a * b,
  "-": (a, b) => a - b,
  "/": (a, b) => a / b,
};

function readLine(line) {
  const [name, expression] = line.split(":");

  monkeys[name] ??= { dependents: [] };

  if (/\d/u.test(expression)) {
    monkeys[name].value = Number(expression);
  } else {
    const [, left, operation, right] = expression.split(" ");

    monkeys[name].operation = operations[operation];

    monkeys[left] ??= { dependents: [] };
    monkeys[right] ??= { dependents: [] };
    monkeys[left].dependents.push([name, "left"]);
    monkeys[right].dependents.push([name, "right"]);
  }
}

function computeAnswer() {
  const queue = Object.values(monkeys).filter(
    (monkey) => monkey.value !== undefined
  );

  while (queue.length > 0) {
    const monkey = queue.shift();

    for (const [name, side] of monkey.dependents) {
      monkeys[name][side] = monkey.value;

      if (
        monkeys[name].left !== undefined &&
        monkeys[name].right !== undefined
      ) {
        monkeys[name].value = monkeys[name].operation(
          monkeys[name].left,
          monkeys[name].right
        );
        queue.push(monkeys[name]);
      }
    }
  }

  return monkeys.root.value;
}

readInput("21.txt", readLine, computeAnswer);
