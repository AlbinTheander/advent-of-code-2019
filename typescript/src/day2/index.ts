import { readData } from '../util/file';
import { createComputer, runUntilHalted } from '../intcode';

function parseData(s: string): number[] {
  return s.match(/[-\d]+/g).map(Number);
}

function runWithIndata(program: number[], noun: number, verb: number): number {
  const memory = program.slice();
  memory[1] = noun;
  memory[2] = verb;
  const computer = createComputer(memory);
  runUntilHalted(computer);
  return computer.memory[0];
}

function part1(program: number[]): number {
  return runWithIndata(program, 12, 2);
}

function part2(program: number[]): number {
  for (let noun = 0; noun < 100; noun++)
    for (let verb = 0; verb < 100; verb++) {
      const memory = program.slice();
      memory[1] = noun;
      memory[2] = verb;
      const computer = createComputer(memory);
      runUntilHalted(computer);
      if (computer.memory[0] === 19690720) {
        return noun * 100 + verb;
      }
    }
  return -1;
}

export default function run(): void {
  const data = parseData(readData('day2.txt'));
  const answer1 = part1(data);
  const answer2 = part2(data);
  console.log('-- Day 2');
  console.log('The value left at address 0 is', answer1);
  console.log('The magical value to get 19690720 is', answer2);
}
