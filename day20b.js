// For part 2, I added DECRYPTION_KEY % numbers.length to each shift, and did the multiplication at the end.
// Worked perfectly the first time on the sample input. Got the wrong answer for the real input. I guess the
// combination of duplicate numbers in the input and multiple rounds implies something that’s not coming to
// me immediately.

// Hmm, the fact that decryptionKeyOffset is % 7 whereas the other offsets are % 6 is interesting.

import { readInput } from "./reader.js";

const DECRYPTION_KEY = 811_589_153;
const ROUNDS = 10;
const TOO_LOW = 10_072_632_977_883;
const TOO_HIGH = 9_007_199_254_740_991;

/* max safe  */ 9_007_199_254_740_991;

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

  const decryptionKeyOffset = DECRYPTION_KEY % numbers.length;

  console.log("offset", decryptionKeyOffset);

  for (let round = 0; round < ROUNDS; round++) {
    for (const item of sequence) {
      const currentPosition = numbers.findIndex(
        (number) => number.index === item.index
      );
      const sum = currentPosition + item.value + decryptionKeyOffset;

      const nextPosition = sum % (numbers.length - 1);

      move(numbers, currentPosition, nextPosition);
    }
  }

  const zeroIndex = numbers.findIndex((n) => n.value === 0);

  console.log(numbers);

  const keys = [1000, 2000, 3000].map((n) =>
    Number(numbers[(n + zeroIndex) % numbers.length].value)
  );

  console.log(keys);

  const answer = keys.reduce((a, b) => a + b, Number(0)) * DECRYPTION_KEY;

  if (answer <= TOO_LOW) {
    throw new Error(`Answer is too low: ${answer}`);
  }

  if (answer >= TOO_HIGH) {
    throw new Error(`Answer is too high: ${answer}`);
  }
}

readInput("20.txt", readLine, computeAnswer);
