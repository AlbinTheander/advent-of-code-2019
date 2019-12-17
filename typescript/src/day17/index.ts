import { Program, createComputer, runComputer } from '../intcode';
import { readData } from '../util/file';

const LF = '\x0A';

function parseData(s: string): number[] {
  return s.split(',').map(Number);
}

function getView(program: Program): string[] {
  const computer = createComputer(program);
  runComputer(computer);
  return computer.output
    .map(d => String.fromCharCode(d))
    .join('')
    .split('\x0A');
}

function getIntersectionScore(view: string[]): number {
  const isIntersection = (x: number, y: number): boolean =>
    [
      [0, 0],
      [-1, 0],
      [1, 0]
    ].every(([dx, dy]) => view[y + dy][x + dx] === '#' && view[y + dx][x + dy] === '#');

  let sum = 0;
  for (let y = 1; y < view.length - 1; y++)
    for (let x = 1; x < view[y].length - 1; x++) if (isIntersection(x, y)) sum += x * y;
  return sum;
}

function runCleaning(program: number[], instructions: string[]): void {
  const computer = createComputer(program);
  computer.memory[0] = 2;
  const inputStr = instructions.map(ins => ins + LF).join('');
  computer.input = Array.from(inputStr).map(ch => ch.charCodeAt(0));
  runComputer(computer);
  console.log(computer.output.length);
  console.log(computer.output.map(d => String.fromCharCode(d)).join(''));
  console.log(computer.output.pop());
}

function part1(program: Program): number {
  const view = getView(program);
  const score = getIntersectionScore(view);
  return score;
}

function part2(program: Program): number {
  // These were found by printing the view above and manually finding a solution.
  const inputLines = [
    'A,B,A,C,A,B,C,A,B,C',
    'R,12,R,4,R,10,R,12',
    'R,6,L,8,R,10',
    'L,8,R,4,R,4,R,6',
    'n'
  ];
  const computer = createComputer(program);
  computer.memory[0] = 2;
  const inputStr = inputLines.map(ins => ins + LF).join('');
  computer.input = Array.from(inputStr).map(ch => ch.charCodeAt(0));
  runComputer(computer);
  return computer.output.pop();
}

export default function run(): void {
  const program = parseData(readData('day17.txt'));
  const answer1 = part1(program);
  const answer2 = part2(program);

  console.log('-- Day 17');
  console.log('The sum of the intersection values is', answer1);
  console.log('The final amount of star dust is', answer2);
}
