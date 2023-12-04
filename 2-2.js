export function parseLine(line) {
  const [game, selections] = line.split(": ");

  const gameNumber = Number(game.match(/\d+/u)[0]);

  const marbles = selections.split(/[;,] /u).map((marble) => {
    const [count, color] = marble.split(" ");

    return { color, count: Number(count) };
  });

  const counts = marbles.reduce(
    (accumulator, marble) => ({
      ...accumulator,
      [marble.color]: Math.max(accumulator[marble.color], marble.count),
    }),
    { red: 0, green: 0, blue: 0 }
  );

  return { gameNumber, counts };
}

export function computeAnswer(commands) {
  // console.dir(commands, { depth: null });

  return commands.map(({ counts }) => counts.red * counts.green * counts.blue);
}

export function hash(answer) {
  return answer.reduce((a, b) => a + b, 0);
}
