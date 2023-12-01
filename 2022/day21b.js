import { readInput } from "./reader.js";

const monkeys = {};

const operations = {
  "+": (a, b) => a + b,
  "*": (a, b) => a * b,
  "-": (a, b) => a - b,
  "/": (a, b) => a / b,
};

const solvers = {
  "=": (a, b) => (a === undefined ? b : a),
  "+": (a, b, r) => (a === undefined ? r - b : r - a),
  "*": (a, b, r) => (a === undefined ? r / b : r / a),
  "-": (a, b, r) => (a === undefined ? r + b : a - r),
  "/": (a, b, r) => (a === undefined ? r * b : a / r),
};

function readLine(line) {
  const [name, expression] = line.split(":");

  monkeys[name] ??= { dependents: [] };

  if (/\d/u.test(expression)) {
    monkeys[name].value = Number(expression);
  } else {
    const [, left, operation, right] = expression.split(" ");

    monkeys[name].operation = operations[operation];
    monkeys[name].symbol = operation;

    monkeys[left] ??= { dependents: [] };
    monkeys[right] ??= { dependents: [] };
    monkeys[left].dependents.push([name, "left"]);
    monkeys[right].dependents.push([name, "right"]);
  }
}

function traceDependents(monkey) {
  const [name, side] = monkey.dependents?.[0] ?? [];

  const dependent = monkeys[name];

  return name === undefined
    ? []
    : [
        [solvers[dependent.symbol], dependent.left, dependent.right],
        ...traceDependents(dependent),
      ];
}

function computeAnswer() {
  monkeys.root.symbol = "=";
  monkeys.humn.value = "x";

  const queue = Object.values(monkeys).filter(
    (monkey) => monkey.value !== undefined && monkey.value !== "x"
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

  const calculations = traceDependents(monkeys.humn).reverse();

  let answer;

  for (const calculation of calculations) {
    const [solve, a, b] = calculation;

    answer = solve(a, b, answer);
  }

  return answer;
}

readInput("21.txt", readLine, computeAnswer);
