const input = `Monkey 0:
  Starting items: 66, 79
  Operation: new = old * 11
  Test: divisible by 7
    If true: throw to monkey 6
    If false: throw to monkey 7

Monkey 1:
  Starting items: 84, 94, 94, 81, 98, 75
  Operation: new = old * 17
  Test: divisible by 13
    If true: throw to monkey 5
    If false: throw to monkey 2

Monkey 2:
  Starting items: 85, 79, 59, 64, 79, 95, 67
  Operation: new = old + 8
  Test: divisible by 5
    If true: throw to monkey 4
    If false: throw to monkey 5

Monkey 3:
  Starting items: 70
  Operation: new = old + 3
  Test: divisible by 19
    If true: throw to monkey 6
    If false: throw to monkey 0

Monkey 4:
  Starting items: 57, 69, 78, 78
  Operation: new = old + 4
  Test: divisible by 2
    If true: throw to monkey 0
    If false: throw to monkey 3

Monkey 5:
  Starting items: 65, 92, 60, 74, 72
  Operation: new = old + 7
  Test: divisible by 11
    If true: throw to monkey 3
    If false: throw to monkey 4

Monkey 6:
  Starting items: 77, 91, 91
  Operation: new = old * old
  Test: divisible by 17
    If true: throw to monkey 1
    If false: throw to monkey 7

Monkey 7:
  Starting items: 76, 58, 57, 55, 67, 77, 54, 99
  Operation: new = old + 6
  Test: divisible by 3
    If true: throw to monkey 2
    If false: throw to monkey 1`;

const sample = `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
  If true: throw to monkey 2
  If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`;

function buildOperation(operation, expression) {
  console.log(operation, expression);

  if (expression === "old") {
    return operation === "*" ? (old) => old * old : (old) => old + old;
  }

  const number = Number(expression);

  return operation === "*" ? (old) => old * number : (old) => old + number;
}

function parseMonkey(monkey) {
  const m = monkey.split("\n");

  return {
    items: m[1].split(":")[1].split(",").map(Number),
    operation: buildOperation(...m[2].split(/\s+/u).slice(5)),
    modulo: Number(m[3].split(/\s+/u).at(-1)),
    next: [Number(m[4].split(/\s+/u).at(-1)), Number(m[5].split(" ").at(-1))],
    inspections: 0,
  };
}

const monkeys = input.split("\n\n").map(parseMonkey);

for (let round = 0; round < 10_000; round += 1) {
  for (const monkey of monkeys) {
    monkey.inspections += monkey.items.length;

    for (const item of monkey.items) {
      const result = Math.floor(
        monkey.operation(item) % monkeys.reduce((n, m) => n * m.modulo, 1)
      );
      const next =
        result % monkey.modulo === 0 ? monkey.next[0] : monkey.next[1];

      monkeys[next].items.push(result);
    }

    monkey.items = [];
  }
}

const answer = monkeys
  .map((m) => m.inspections)
  .sort((a, b) => b - a)
  .slice(0, 2)
  .reduce((a, b) => a * b, 1);

console.log(answer);

export const x = {};
