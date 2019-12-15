import { readData } from '../util/file';
import { KeyedMap } from '../util/KeyedMap';
import { createComputer, runComputer } from '../intcode';

type Coord = [number, number];

function parseData(s: string): number[] {
  return s.split(',').map(Number);
}

function getDistances(program: number[]): [number, number] {
  let map = new KeyedMap<Coord, number>(
    c => c.toString(),
    () => 0
  );
  const computer = createComputer(program.slice());
  const walk = (dir: number): number => {
    computer.input.push(dir);
    runComputer(computer);
    return computer.output.shift();
  };
  let systemDist = -1;
  let maxDist = -1;

  function search(x: number, y: number, dist: number): void {
    if (dist > maxDist) maxDist = dist;
    if (map.get([x, y]) === 2 && systemDist === -1) {
      systemDist = dist;
      throw Error('Ugly unwind of recursion');
    }

    const tryDirection = (dx: number, dy: number, dir: number, back: number): void => {
      if (!map.has([x + dx, y + dy])) {
        const spot = walk(dir);
        map.set([x + dx, y + dy], spot);
        if (spot > 0) {
          search(x + dx, y + dy, dist + 1);
          walk(back);
        }
      }
    };
    tryDirection(0, 1, 1, 2); // North
    tryDirection(0, -1, 2, 1); // South
    tryDirection(-1, 0, 3, 4); // West
    tryDirection(1, 0, 4, 3); // East
  }

  // First we'll look until we find the oxygen system
  map.set([0, 0], 1);
  try {
    search(0, 0, 0);
  } catch (e) {}

  // Now, we're at the oxygen system. Let's reset the map and
  // restart the droid to find the furthest distance from the
  // oxygen system
  map = new KeyedMap<Coord, number>(
    c => c.toString(),
    () => 0
  );
  map.set([0, 0], 1);
  search(0, 0, 0);

  return [systemDist, maxDist];
}

// I should really make this some kind of library function. Fourth time, rewritten! :-P
function toString(map: KeyedMap<Coord, number>): string {
  // TODO: Add a proper entries method to KeyedMap
  const entries: number[][] = [...map.data.entries()].map(([coord, col]) =>
    coord
      .split(',')
      .map(Number)
      .concat(col)
  );
  const minX = Math.min(...entries.map(e => e[0]));
  const minY = Math.min(...entries.map(e => e[1]));
  const lines: string[][] = [];
  entries.forEach(([x, y, c]) => {
    if (!lines[y - minY]) lines[y - minY] = [];
    lines[y - minY][x - minX] = '# $'[c];
  });
  lines[0 - minY][0 - minX] = 'X';
  for (let y = 0; y < lines.length; y++)
    for (let x = 0; x < lines[y].length; x++) lines[y][x] = lines[y][x] || ' ';
  return lines.map(line => line.join('')).join('\n');
}

export default function run(): void {
  const program = parseData(readData('day15.txt'));
  const [answer1, answer2] = getDistances(program);

  console.log('-- Day 15');
  console.log('The distance from the entrance to the oxygen system is', answer1);
  console.log('The section is filled with oxygen after', answer2, 'minutes');
}
