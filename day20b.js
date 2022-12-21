// For part 2, I added DECRYPTION_KEY % numbers.length to each shift, and did the multiplication at the end.
// Worked perfectly the first time on the sample input. Got the wrong answer for the real input. I guess the
// combination of duplicate numbers in the input and multiple rounds implies something that’s not coming to
// me immediately.

// Hmm, the fact that decryptionKeyOffset is % 7 whereas the other offsets are % 6 is interesting.

// Chinese Remainder Theorem (I think)
// ((num % mod) * (key % mod) + offset) % mod === (num * key + offset) % mod

import { readInput } from "./reader.js";

const DECRYPTION_KEY = 811_589_153;
const ROUNDS = 10;

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

  const spaces = numbers.length - 1;

  const keyRemainder = DECRYPTION_KEY % spaces;

  for (let round = 0; round < ROUNDS; round++) {
    for (const item of sequence) {
      const currentPosition = numbers.findIndex(
        (number) => number.index === item.index
      );

      const nextPosition =
        (currentPosition + (item.value % spaces) * keyRemainder) % spaces;

      move(numbers, currentPosition, nextPosition);
    }
  }

  const zeroIndex = numbers.findIndex((n) => n.value === 0);

  const keys = [1000, 2000, 3000].map((n) =>
    Number(numbers[(n + zeroIndex) % numbers.length].value)
  );

  console.log(keys);

  return keys.reduce((a, b) => a + b, Number(0)) * DECRYPTION_KEY;
}

readInput("20.txt", readLine, computeAnswer);
