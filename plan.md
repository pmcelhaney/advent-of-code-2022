## Making this stuff easier (22 days in)

```js
import { test } from "./advent-of-code.js";

function parseLine(line, index) {
  // returns a command object 
}

function computeAnswer(commands, index) {
  // creates whatever state is needed, loops over the commands, calculates, and returns the answer
}

function hash(answer) {
  // Sometimes the answer is just the answer, but usually there's some kind of hash
  // function to convert a multi-part answer to a single number 
  return answer;
}


// This function finds out what day + part to run from process.argv
// It then runs through all of the input files in the corresponding directory
// If the input file has a line starting with $$answer: it reports whether the answer is correct
// If the input file has a line starting with $$hash:  it reports whether the hash is correct
// If there's a line with $$min: or $$max: it tells me if the answer is definitely wrong per feedback from previous wrong answers
// (The $$ lines are not passed to parseLine, of course)
// Otherwise it reports the answer and the hash 
test(parseLine, computeAnswer, hash);
```
