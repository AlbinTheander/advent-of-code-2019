import { createComputer, runComputer, Program } from '../intcode';
import { readData } from '../util/file';

function parseDate(s: string): number[] {
  return s.split(',').map(s => Number(s));
}

function part1(program: Program): number {
  const computer = createComputer(program.slice(), [1]);
  runComputer(computer);
  return computer.output[0];
}

function part2(program: Program): number {
  const computer = createComputer(program.slice(), [2]);
  runComputer(computer);
  return computer.output[0];
}

export default function run(): void {
  const program = parseDate(readData('day9.txt'));
  const answer1 = part1(program);
  const answer2 = part2(program);

  console.log('-- Day 9');
  console.log('THe BOOST keycode is', answer1);
  console.log('The coordinates of the distress signal is', answer2);
}
