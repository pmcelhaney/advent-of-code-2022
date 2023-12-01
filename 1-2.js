/* eslint-disable prefer-destructuring */
/* eslint-disable regexp/sort-alternatives */
function reverseString(string) {
  return string.split("").reverse().join("");
}

function toNumber(nameOrNumber) {
  const names = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
  };

  return (
    names[nameOrNumber] ??
    names[reverseString(nameOrNumber)] ??
    Number(nameOrNumber)
  );
}

export function parseLine(line) {
  const first = line.match(
    /one|two|three|four|five|six|seven|eight|nine|ten|\d/gu
  )[0];

  const last = reverseString(line).match(
    /net|enin|thgie|neves|xis|evif|ruof|eerht|owt|eno|\d/gu
  )[0];

  return toNumber(first) * 10 + toNumber(last);
}

export function computeAnswer(commands) {
  return commands;
}

export function hash(answer) {
  return answer.reduce((a, b) => a + b, 0);
}
