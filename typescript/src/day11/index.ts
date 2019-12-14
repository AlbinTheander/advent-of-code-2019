import { Program, createComputer, runComputer } from '../intcode';
import { KeyedMap } from '../util/KeyedMap';
import { readData } from '../util/file';

type Coord = [number, number];

function parseData(s: string): number[] {
  return s.split(',').map(Number);
}

function paint(program: Program, initialSquare: number): KeyedMap<Coord, number> {
  const map = new KeyedMap<Coord, number>(
    c => c.toString(),
    () => 0
  );
  const computer = createComputer(program.slice(), [initialSquare]);
  let x = 0;
  let y = 0;
  let dx = 0;
  let dy = -1;
  while (!computer.halted) {
    runComputer(computer);
    const color = computer.output.shift();
    const turn = computer.output.shift();
    map.set([x, y], color);

    [dx, dy] = turn === 0 ? [dy, -dx] : [-dy, dx];
    x += dx;
    y += dy;
    computer.input.push(map.get([x, y]));
  }
  return map;
}

function toString(map: KeyedMap<Coord, number>): string {
  // TODO: Add a proper entries method to KeyedMap
  const entries: number[][] = [...map.data.entries()].map(([coord, col]) =>
    coord
      .split(',')
      .map(Number)
      .concat(col)
  );
  const lines: string[][] = [];
  entries.forEach(([x, y, c]) => {
    if (!lines[y]) lines[y] = [];
    lines[y][x] = c ? '*' : ' ';
  });
  for (let y = 0; y < lines.length; y++)
    for (let x = 0; x < lines[y].length; x++) lines[y][x] = lines[y][x] || ' ';
  return lines.map(line => line.join('')).join('\n');
}

function part1(program: Program): number {
  const hull = paint(program, 0);
  return hull.size;
}

export default function run(): void {
  const program = parseData(readData('day11.txt'));
  const answer1 = part1(program);
  const answer2 = toString(paint(program, 1));

  console.log('-- Day 11');
  console.log('The amount of hull panels painted is', answer1);
  console.log('The final hull looks lik');
  console.log(answer2);
}
