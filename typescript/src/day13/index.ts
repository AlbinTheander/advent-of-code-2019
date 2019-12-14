import { Program, createComputer, runComputer } from '../intcode';
import { KeyedMap } from '../util/KeyedMap';
import { readData } from '../util/file';

type Coord = [number, number];

function parseData(s: string): number[] {
  return s.split(',').map(Number);
}

function paintScreen(program: Program): KeyedMap<Coord, number> {
  const screen = new KeyedMap<Coord, number>(
    c => c.toString(),
    () => 0
  );
  const computer = createComputer(program.slice());
  while (!computer.halted) {
    runComputer(computer);
    while (computer.output.length >= 3) {
      const [x, y, c] = computer.output.splice(0, 3);
      screen.set([x, y], c);
    }
  }
  return screen;
}

function countBlockTiles(screen: KeyedMap<Coord, number>): number {
  return [...screen.values()].filter(c => c === 2).length;
}

function playTheGame(program: Program): number {
  let score = 0;
  let ballX = 0;
  let paddleX = 0;
  const computer = createComputer(program.slice());
  computer.memory[0] = 2;
  const map = new KeyedMap<Coord, number>(
    c => c.toString(),
    () => 0
  );
  do {
    runComputer(computer);
    while (computer.output.length >= 3) {
      const [x, y, c] = computer.output.splice(0, 3);
      if (x === -1) score = c;
      if (c === 4) ballX = x;
      if (c === 3) paddleX = x;
      map.set([x, y], c);
    }
    computer.input.push(Math.sign(ballX - paddleX));
  } while (!computer.halted && countBlockTiles(map) > 0);
  return score;
}

// This function is far too useful to throw away. :-)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function toString(map: KeyedMap<Coord, number>): string {
  const entries: number[][] = [...map.data.entries()].map(([coord, col]) =>
    coord
      .split(',')
      .map(Number)
      .concat(col)
  );
  const lines: string[][] = [];
  entries.forEach(([x, y, c]) => {
    if (!lines[y]) lines[y] = [];
    lines[y][x] = ' #X-o'[c];
  });
  for (let y = 0; y < lines.length; y++)
    for (let x = 0; x < lines[y].length; x++) lines[y][x] = lines[y][x] || ' ';
  return lines.map(line => line.join('')).join('\n');
}

export default function run(): void {
  const program = parseData(readData('day13.txt'));
  const answer1 = countBlockTiles(paintScreen(program));
  const answer2 = playTheGame(program);

  console.log('-- Day 13');
  console.log('The initial number of blocks is', answer1);
  console.log('The final score is', answer2);
}
