import { Program, createComputer, runComputer } from '../intcode';
import { readData } from '../util/file';

function parseData(s: string): Program {
  return s.split(',').map(Number);
}

function getCoord(program: Program, x: number, y: number): number {
  const computer = createComputer(program, [x, y]);
  runComputer(computer);
  return computer.output[0];
}

function getTractorStart(program: Program, y: number, k: number): number {
  let x = Math.round(y * k);
  if (getCoord(program, x, y) === 0) {
    while (getCoord(program, x, y) === 0) x++;
    return x;
  }
  while (getCoord(program, x, y) === 1) x--;
  return x + 1;
}

function getTractorEnd(program: Program, y: number, k: number): number {
  let x = Math.round(y * k);
  if (getCoord(program, x, y) === 0) {
    while (getCoord(program, x, y) === 0) x--;
    return x;
  }
  while (getCoord(program, x, y) === 1) x++;
  return x - 1;
}

function getScan(program: Program, size: number): number[][] {
  const grid = [];
  for (let y = 0; y < size; y++) {
    grid[y] = [];
    for (let x = 0; x < size; x++) {
      grid[y][x] = getCoord(program, x, y);
    }
  }
  return grid;
}

function paintScan(scan: number[][]): void {
  const view = scan.map(line => line.map(d => (d ? '#' : ' ')).join('')).join('\n');
  console.log(view);
}

/**
 * Gets the approximate slopes of the start and the end of the tractor beam.
 */
function getKs(program: Program): [number, number] {
  const y = 100;
  let x = 0;
  while (getCoord(program, x, y) === 0) x++;
  const startX = x - 1;
  while (getCoord(program, x, y) === 1) x++;
  const endX = x - 1;
  return [startX / 100, endX / 100];
}

function getFirstFit(program: Program, size: number): [number, number] {
  const [startK, endK] = getKs(program);

  // Checks if the size x size square can fit starting at
  // line y.
  function canFit(y: number): boolean {
    const start = getTractorStart(program, y + size - 1, startK);
    const end = getTractorEnd(program, y, endK);
    return end - start >= size - 1;
  }

  let y = 100;
  while (!canFit(y)) y++;
  const x = getTractorEnd(program, y, endK) - size + 1;
  return [x, y];
}

function part1(program: Program): number {
  const scan = getScan(program, 50);
  return scan.toString().match(/1/g).length;
}

function part2(program: Program): number {
  const [x, y] = getFirstFit(program, 100);
  return x * 10000 + y;
}

export default function run(): void {
  const program = parseData(readData('day19.txt'));
  const answer1 = part1(program);
  const answer2 = part2(program);

  console.log('-- Day 19');
  console.log('The tractor beams coverate over the first 50x50 area is', answer1);
  console.log('The coordinate score for the first place to fit the ship is', answer2);
}
