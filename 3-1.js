function isGoodNumber(number, previous, same, next) {
  console.log(":", number, previous, same, next);

  if (same.some((index) => number.start === index || number.end === index)) {
    console.log("same");

    return true;
  }

  if (previous?.some((index) => number.start <= index && number.end >= index)) {
    console.log("before");

    return true;
  }

  if (next?.some((index) => number.start <= index && number.end >= index)) {
    console.log("after", number.start, number.end, next);

    return true;
  }

  return false;
}

export function parseLine(line) {
  const numbers = [];
  const symbolIndexes = [];

  let currentNumber = "";
  let index = 0;

  for (const character of line) {
    if (/\d/u.test(character)) {
      currentNumber += character;
    } else {
      if (character !== "." && character !== undefined) {
        symbolIndexes.push(index);
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

  return { numbers, symbolIndexes };
}

export function computeAnswer(commands) {
  const numbers = [];

  for (let index = 0; index < commands.length; index++) {
    for (const number of commands[index].numbers) {
      if (
        isGoodNumber(
          number,
          commands[index - 1]?.symbolIndexes,
          commands[index].symbolIndexes,
          commands[index + 1]?.symbolIndexes
        )
      ) {
        numbers.push(number.number);
      }
    }
  }

  return numbers;
}

export function hash(answer) {
  return answer.reduce((a, b) => a + b, 0);
}
