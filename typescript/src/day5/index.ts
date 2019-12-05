import { readData } from '../util/file';
import { createComputer, runUntilHalted, Program } from '../intcode';

function parseData(s: string): number[] {
  return s.match(/[-\d]+/g).map(Number);
}

function part1(program: Program): number {
  const computer = createComputer(program, [1]);
  runUntilHalted(computer);
  return computer.output.pop();
}

function part2(program: Program): number {
  const computer = createComputer(program, [5]);
  runUntilHalted(computer);
  return computer.output.pop();
}
export default function run(): void {
  const data = parseData(readData('day5.txt'));
  const answer1 = part1(data.slice());
  const answer2 = part2(data.slice());

  console.log('-- Day 5');
  console.log('The diagnostic code for the air conditioning is', answer1);
  console.log('The diagnostic code for the radioters is', answer2);
}
