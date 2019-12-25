import { readData } from '../util/file';

function parseData(s: string): string[][] {
  return s.split('\n').map(line => line.split(''));
}

function update(grid: string[][]): string[][] {
  const get = (x: number, y: number): string =>
    y >= 0 && y < 5 && x >= 0 && y < 5 ? grid[y][x] : '.';
  const countNeighbors = (x: number, y: number): number =>
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

function updateRecursive(grids: Map<number, string[][]>): Map<number, string[][]> {
  const minLevel = Math.min(...grids.keys());
  const maxLevel = Math.max(...grids.keys());

  const getTile = (level: number, x: number, y: number): string =>
    level >= minLevel && level <= maxLevel ? grids.get(level)[y][x] : '.';
  const getRowCount = (level: number, row: number): number => {
    if (level < minLevel || level > maxLevel) return 0;
    const grid = grids.get(level);
    return grid[row].filter(ch => ch === '#').length;
  };
  const getColCount = (level: number, col: number): number => {
    if (level < minLevel || level > maxLevel) return 0;
    const grid = grids.get(level);
    return grid.filter(row => row[col] === '#').length;
  };
  const getAbove = (level: number, x: number, y: number): number => {
    if (y === 0) return getTile(level - 1, 2, 1) === '#' ? 1 : 0;
    if (y === 3 && x === 2) return getRowCount(level + 1, 4);
    return getTile(level, x, y - 1) === '#' ? 1 : 0;
  };
  const getBelow = (level: number, x: number, y: number): number => {
    if (y === 4) return getTile(level - 1, 2, 3) === '#' ? 1 : 0;
    if (y === 1 && x === 2) return getRowCount(level + 1, 0);
    return getTile(level, x, y + 1) === '#' ? 1 : 0;
  };
  const getLeft = (level: number, x: number, y: number): number => {
    if (x === 0) return getTile(level - 1, 1, 2) === '#' ? 1 : 0;
    if (y === 2 && x === 3) return getColCount(level + 1, 4);
    return getTile(level, x - 1, y) === '#' ? 1 : 0;
  };
  const getRight = (level: number, x: number, y: number): number => {
    if (x === 4) return getTile(level - 1, 3, 2) === '#' ? 1 : 0;
    if (y === 2 && x === 1) return getColCount(level + 1, 0);
    return getTile(level, x + 1, y) === '#' ? 1 : 0;
  };
  const getNeighborCount = (level: number, x: number, y: number): number =>
    getAbove(level, x, y) + getBelow(level, x, y) + getLeft(level, x, y) + getRight(level, x, y);

  const newGrids = new Map<number, string[][]>();

  for (let level = minLevel - 1; level <= maxLevel + 1; level++) {
    const grid = Array(5)
      .fill(0)
      .map(() => Array(5).fill('.'));
    let isEmpty = true;
    for (let y = 0; y < 5; y++)
      for (let x = 0; x < 5; x++) {
        if (y === 2 && x === 2) continue;
        const neighbors = getNeighborCount(level, x, y);
        const tile = getTile(level, x, y);
        if (tile === '#' && neighbors === 1) {
          grid[y][x] = '#';
          isEmpty = false;
        } else if (tile === '.' && (neighbors === 1 || neighbors === 2)) {
          grid[y][x] = '#';
          isEmpty = false;
        }
      }
    if (level < minLevel && isEmpty) continue;
    if (level > maxLevel && isEmpty) continue;
    newGrids.set(level, grid);
  }
  return newGrids;
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

function part2(grid: string[][]): number {
  let grids = new Map<number, string[][]>();
  grids.set(0, grid);
  for (let i = 0; i < 200; i++) {
    grids = updateRecursive(grids);
  }
  let sum = 0;
  for (const grid of grids.values()) {
    sum += grid
      .toString()
      .split('')
      .filter(ch => ch === '#').length;
  }
  return sum;
}

export default function run(): void {
  const data = readData('day24.txt');
  const grid = parseData(data);
  const answer1 = part1(grid);
  const answer2 = part2(grid);

  console.log('-- Day 24');
  console.log('The first hash to occur twice is', answer1);
  console.log('There are', answer2, 'recursive bugs after 200 minutes');
}
