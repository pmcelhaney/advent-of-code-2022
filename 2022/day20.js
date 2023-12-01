import { readInput } from "./reader.js";

const input = [];

function readLine(line) {
  input.push(Number(line));
}

function move(array, index, position) {
  const value = array[index];

  array.splice(index, 1);

  array.splice(position, 0, value);

  return array;
}

function computeAnswer() {
  const sequence = Array.from(input, (value, index) => ({ index, value }));
  const numbers = Array.from(input, (value, index) => ({
    index,
    value,
  }));

  for (const item of sequence) {
    const currentPosition = numbers.findIndex(
      (number) => number.index === item.index
    );
    const sum = currentPosition + item.value;

    const nextPosition = sum % (numbers.length - 1);

    move(numbers, currentPosition, nextPosition);
  }

  const zeroIndex = numbers.findIndex((n) => n.value === 0);

  const keys = [1000, 2000, 3000].map(
    (n) => numbers[(n + zeroIndex) % numbers.length].value
  );

  console.log(keys);

  return keys.reduce((a, b) => a + b, 0);
}

readInput("20.txt", readLine, computeAnswer);
