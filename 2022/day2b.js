import { createReader } from "./reader.js";

function scoreForChoice(choice) {
  return {
    A: 1,
    B: 2,
    C: 3,
  }[choice];
}

function scoreForWin(them, us) {
  if (them === us) {
    return 3;
  }

  if (them === "A" && us === "B") {
    return 6;
  }

  if (them === "B" && us === "C") {
    return 6;
  }

  if (them === "C" && us === "A") {
    return 6;
  }

  return 0;
}

function scoreForRound(round) {
  const [them, us] = round.split(" ");

  const normalizeUs = {
    X: { A: "C", B: "A", C: "B" },
    Y: { A: "A", B: "B", C: "C" },
    Z: { A: "B", B: "C", C: "A" },
  }[us][them];

  return scoreForChoice(normalizeUs) + scoreForWin(them, normalizeUs);
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
