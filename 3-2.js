function gearValue(starIndex, previous, same, next) {
  const adjacentNumbers = [];

  adjacentNumbers.push(
    ...(previous ?? [])
      .filter((number) => number.start <= starIndex && number.end >= starIndex)
      .map((number) => number.number),
    ...(same ?? [])
      .filter((number) => number.start <= starIndex && number.end >= starIndex)
      .map((number) => number.number),
    ...(next ?? [])
      .filter((number) => number.start <= starIndex && number.end >= starIndex)
      .map((number) => number.number)
  );

  if (adjacentNumbers.length === 2) {
    return adjacentNumbers[0] * adjacentNumbers[1];
  }

  return 0;
}

export function parseLine(line) {
  const numbers = [];
  const starIndexes = [];

  let currentNumber = "";
  let index = 0;

  for (const character of line) {
    if (/\d/u.test(character)) {
      currentNumber += character;
    } else {
      if (character === "*") {
        starIndexes.push(index);
      }

      if (currentNumber) {
        numbers.push({
          number: Number(currentNumber),
          start: index - currentNumber.length - 1,
          end: index,
        });

        currentNumber = "";
      }
    }

    index++;
  }

  if (currentNumber) {
    numbers.push({
      number: Number(currentNumber),
      start: index - currentNumber.length - 1,
      end: index,
    });
  }

  return { numbers, starIndexes };
}

export function computeAnswer(commands) {
  const values = [];

  for (let index = 0; index < commands.length; index++) {
    for (const starIndex of commands[index].starIndexes) {
      values.push(
        gearValue(
          starIndex,
          commands[index - 1]?.numbers,
          commands[index].numbers,
          commands[index + 1]?.numbers
        )
      );
    }
  }

  return values;
}

export function hash(answer) {
  return answer.reduce((a, b) => a + b, 0);
}
