import { readData } from '../util/file';

function parseData(s: string): string[][] {
  return s.split('\n').map(line => line.split(''));
}

function update(grid: string[][]): string[][] {
  const get = (x: number, y: number): string =>
    y >= 0 && y < 5 && x >= 0 && y < 5 ? grid[y][x] : '.';
  const countNeighbors = (x: number, y: number) =>
    [get(x - 1, y), get(x + 1, y), get(x, y - 1), get(x, y + 1)].filter(ch => ch === '#').length;

  return grid.map((line, y) =>
    line.map((ch, x) => {
      const ns = countNeighbors(x, y);
      if (ch === '#' && ns === 1) return '#';
      if (ch === '.' && (ns === 1 || ns === 2)) return '#';
      return '.';
    })
  );
}

function hash(grid: string[][]): number {
  const binString = grid
    .toString()
    .replace(/,/g, '')
    .replace(/#/g, '1')
    .replace(/\./g, '0')
    .split('')
    .reverse()
    .join('');
  return parseInt(binString, 2);
}

function part1(grid: string[][]): number {
  const hashes = new Set<number>();
  while (true) {
    const h = hash(grid);
    if (hashes.has(h)) {
      return h;
    }
    hashes.add(h);
    grid = update(grid);
  }
}

export default function run(): void {
  const data = readData('day24.txt');
  const grid = parseData(data);
  const answer1 = part1(grid);

  console.log('-- Day 24');
  console.log('The first hash to occur twice is', answer1);
}
