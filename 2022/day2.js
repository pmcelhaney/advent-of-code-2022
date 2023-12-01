import { createReader } from "./reader.js";

function scoreForChoice(choice) {
  return {
    X: 1,
    Y: 2,
    Z: 3,
  }[choice];
}

function scoreForWin(them, us) {
  if (them === us) {
    return 3;
  }

  if (them === "X" && us === "Y") {
    return 6;
  }

  if (them === "Y" && us === "Z") {
    return 6;
  }

  if (them === "Z" && us === "X") {
    return 6;
  }

  return 0;
}

function scoreForRound(round) {
  const [them, us] = round.split(" ");

  const normalizeThem = {
    A: "X",
    B: "Y",
    C: "Z",
  }[them];

  return scoreForChoice(us) + scoreForWin(normalizeThem, us);
}

function scoreForRoundBrute(line) {
  return {
    "A X": 1 + 3,
    "A Y": 2 + 6,
    "A Z": 3 + 0,
    "B X": 1 + 0,
    "B Y": 2 + 3,
    "B Z": 3 + 6,
    "C X": 1 + 6,
    "C Y": 2 + 0,
    "C Z": 3 + 3,
  }[line];
}

const reader = createReader("2.txt");

let sum = 0;

reader.on("line", (line) => {
  sum += scoreForRound(line);
});

reader.on("close", () => {
  console.log(sum);
});

export default 0;
