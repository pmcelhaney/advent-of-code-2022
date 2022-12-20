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
  const sequence = Array.from(input);
  const numbers = Array.from(input);

  for (const value of sequence) {
    const currentPosition = numbers.indexOf(value);
    const sum = currentPosition + value;

    move(
      numbers,
      currentPosition,
      sum > sequence.length ? (sum + 1) % sequence.length : sum
    );
  }

  const keys = [1000, 2000, 3000].map(
    (n) => numbers[(n + numbers.indexOf(0)) % numbers.length]
  );

  return keys.reduce((a, b) => a + b, 0);
}

readInput("20.txt", readLine, computeAnswer);
